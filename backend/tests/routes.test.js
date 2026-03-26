/* global jest */
const request = require('supertest');
const { app } = require('../server');

// ── Mock pg layer ──────────────────────────────────────────────
const mockQuery = jest.fn();

jest.mock('../config/db', () => ({
    pool: {},
    query: (...args) => mockQuery(...args),
    connectDB: jest.fn(),
    closeDB: jest.fn(),
}));

jest.mock('../config/schema', () => jest.fn());

// ── Helpers ────────────────────────────────────────────────────
afterEach(() => { mockQuery.mockReset(); });

// ── Subjects ───────────────────────────────────────────────────
describe('GET /api/subjects', () => {
    it('returns rows from the subjects table with _id alias', async () => {
        mockQuery.mockResolvedValueOnce({
            rows: [
                { _id: 'aaa-111', name: 'Mathematics', level: 'O-Level' },
                { _id: 'bbb-222', name: 'Physics', level: 'O-Level' },
            ],
        });

        const res = await request(app).get('/api/subjects');

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(2);
        expect(res.body[0]).toHaveProperty('_id');
        expect(res.body[0]).toHaveProperty('name', 'Mathematics');
        expect(mockQuery).toHaveBeenCalledWith(
            expect.stringContaining('SELECT'),
        );
    });

    it('returns 404 for a non-existent subject', async () => {
        mockQuery.mockResolvedValueOnce({ rows: [] });

        const res = await request(app).get('/api/subjects/no-such-id');
        expect(res.statusCode).toBe(404);
    });
});

// ── Topics with populated subject ──────────────────────────────
describe('GET /api/topics/:subjectId', () => {
    it('returns topics with nested subject object via JOIN', async () => {
        mockQuery.mockResolvedValueOnce({
            rows: [{
                _id: 'topic-1',
                title: 'Number Systems',
                chapter: 1,
                chapterTitle: 'Numbers & Expressions',
                order: 1,
                difficulty: 'beginner',
                notes: 'Some notes',
                summary: ['Point A'],
                content: [{ heading: 'H1', body: 'B1', examples: [] }],
                references: [],
                subject: { _id: 'sub-1', name: 'Mathematics', level: 'O-Level' },
            }],
        });

        const res = await request(app).get('/api/topics/sub-1');

        expect(res.statusCode).toBe(200);
        expect(res.body[0].subject).toEqual(
            expect.objectContaining({ name: 'Mathematics' }),
        );
        expect(res.body[0].summary).toEqual(['Point A']);
        // Verify the SQL includes a JOIN on subjects
        expect(mockQuery).toHaveBeenCalledWith(
            expect.stringContaining('JOIN subjects'),
            ['sub-1'],
        );
    });
});

// ── Questions (correctAnswer excluded from GET) ────────────────
describe('GET /api/questions/:topicId', () => {
    it('does not expose correctAnswer in listing', async () => {
        mockQuery.mockResolvedValueOnce({
            rows: [
                { _id: 'q1', topic_id: 't1', questionText: 'What is 2+2?', options: ['3', '4', '5', '6'] },
            ],
        });

        const res = await request(app).get('/api/questions/t1');

        expect(res.statusCode).toBe(200);
        expect(res.body[0]).not.toHaveProperty('correctAnswer');
        // Verify the SQL does NOT select correct_answer
        const sql = mockQuery.mock.calls[0][0];
        expect(sql).not.toMatch(/correct_answer/);
    });
});

// ── Quiz submission (scoring) ──────────────────────────────────
describe('POST /api/questions/:topicId/submit', () => {
    it('scores answers correctly against Postgres rows', async () => {
        mockQuery.mockResolvedValueOnce({
            rows: [
                { _id: 'q1', correctAnswer: 1 },
                { _id: 'q2', correctAnswer: 2 },
                { _id: 'q3', correctAnswer: 0 },
            ],
        });

        const res = await request(app)
            .post('/api/questions/topic-1/submit')
            .send({ answers: { q1: 1, q2: 0, q3: 0 } });

        expect(res.statusCode).toBe(200);
        expect(res.body.score).toBe(2);    // q1 correct, q2 wrong, q3 correct
        expect(res.body.total).toBe(3);
        expect(res.body.results).toHaveLength(3);
    });
});

// ── Auth: register + login round-trip ──────────────────────────
describe('Auth routes', () => {
    it('rejects registration with missing fields', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ email: 'a@b.com' });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/required/i);
        expect(mockQuery).not.toHaveBeenCalled();
    });

    it('rejects weak passwords', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ name: 'Test', email: 'a@b.com', password: 'abc' });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/6 characters/);
    });

    it('returns 409 when email already exists', async () => {
        mockQuery.mockResolvedValueOnce({ rows: [{ id: 'existing' }] });

        const res = await request(app)
            .post('/api/auth/register')
            .send({ name: 'Test', email: 'dup@test.com', password: 'Pass123' });

        expect(res.statusCode).toBe(409);
    });
});

// ── Forum: requires auth ───────────────────────────────────────
describe('POST /api/forum/:topicId', () => {
    it('rejects unauthenticated requests with 401', async () => {
        const res = await request(app)
            .post('/api/forum/topic-1')
            .send({ title: 'Hi', content: 'Hello' });

        expect(res.statusCode).toBe(401);
    });
});
