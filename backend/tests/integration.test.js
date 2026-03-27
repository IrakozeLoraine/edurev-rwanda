/**
 * Integration tests — run against a real PostgreSQL instance.
 *
 * These are skipped when PGHOST is not set (e.g. default `npm test` without
 * a database). CI sets PGHOST via a Postgres service container.
 *
 * Run locally:
 *   PGHOST=localhost PGUSER=edurev PGPASSWORD=edurev_pass PGDATABASE=edurev_test npm test
 */
const hasDB = !!process.env.PGHOST;

const describeIf = hasDB ? describe : describe.skip;

describeIf('Postgres integration', () => {
    let query, connectDB, closeDB, initSchema;

    beforeAll(async () => {
        // Require real modules (no mocks)
        ({ query, connectDB, closeDB } = require('../config/db'));
        initSchema = require('../config/schema');
        await connectDB();
        await initSchema();
    });

    afterAll(async () => {
        // Clean up test data
        await query('DELETE FROM forum_posts');
        await query('DELETE FROM questions');
        await query('DELETE FROM topics');
        await query('DELETE FROM subjects');
        await query('DELETE FROM users');
        await closeDB();
    });

    // ── Schema check ───────────────────────────────────────────
    it('creates all five required tables', async () => {
        const res = await query(`
            SELECT table_name FROM information_schema.tables
            WHERE table_schema = 'public'
            ORDER BY table_name
        `);
        const tables = res.rows.map(r => r.table_name);

        expect(tables).toContain('users');
        expect(tables).toContain('subjects');
        expect(tables).toContain('topics');
        expect(tables).toContain('questions');
        expect(tables).toContain('forum_posts');
    });

    // ── Full content flow: subject → topic → question → fetch ──
    it('inserts and retrieves subject → topic → questions', async () => {
        // Insert subject
        const sub = await query(
            "INSERT INTO subjects (name, level) VALUES ('Test Math', 'O-Level') RETURNING id"
        );
        const subjectId = sub.rows[0].id;

        // Insert topic with JSONB fields
        const top = await query(
            `INSERT INTO topics (subject_id, title, chapter, chapter_title, "order", difficulty, notes, summary, content, "references")
             VALUES ($1, 'Algebra', 1, 'Numbers', 1, 'beginner', 'Notes here', '["A","B"]', '[{"heading":"H","body":"B","examples":[]}]', '["ref1"]')
             RETURNING id`,
            [subjectId]
        );
        const topicId = top.rows[0].id;

        // Insert question
        await query(
            "INSERT INTO questions (topic_id, question_text, options, correct_answer) VALUES ($1, 'What is 1+1?', '[\"1\",\"2\",\"3\"]', 1)",
            [topicId]
        );

        // Fetch topic with JOIN (same query pattern as the route)
        const topicResult = await query(
            `SELECT t.id, t.title, t.summary, t.content, t."references",
                    json_build_object('_id', s.id, 'name', s.name, 'level', s.level) AS subject
             FROM topics t JOIN subjects s ON t.subject_id = s.id
             WHERE t.id = $1`,
            [topicId]
        );

        expect(topicResult.rows).toHaveLength(1);
        const topic = topicResult.rows[0];
        expect(topic.title).toBe('Algebra');
        expect(topic.summary).toEqual(['A', 'B']);
        expect(topic.content[0].heading).toBe('H');
        expect(topic.subject.name).toBe('Test Math');

        // Fetch questions without correctAnswer (same exclusion as the route)
        const qResult = await query(
            'SELECT id, question_text, options FROM questions WHERE topic_id = $1',
            [topicId]
        );
        expect(qResult.rows).toHaveLength(1);
        expect(qResult.rows[0].question_text).toBe('What is 1+1?');
        expect(qResult.rows[0].options).toEqual(['1', '2', '3']);
    });

    // ── Forum post with user JOIN ──────────────────────────────
    it('creates a forum post and returns it with joined user', async () => {
        // Setup: create user, subject, topic
        const user = await query(
            "INSERT INTO users (name, email, password) VALUES ('Alice', 'alice@test.com', 'hashed') RETURNING id"
        );
        const sub = await query(
            "INSERT INTO subjects (name, level) VALUES ('Forum Subject', 'A-Level') RETURNING id"
        );
        const top = await query(
            `INSERT INTO topics (subject_id, title, chapter, "order") VALUES ($1, 'Forum Topic', 1, 1) RETURNING id`,
            [sub.rows[0].id]
        );

        // Insert forum post
        const post = await query(
            `INSERT INTO forum_posts (topic_id, user_id, title, content)
             VALUES ($1, $2, 'My Question', 'How does this work?')
             RETURNING id, topic_id, title, content, created_at`,
            [top.rows[0].id, user.rows[0].id]
        );
        expect(post.rows[0].title).toBe('My Question');

        // Fetch with JOIN (same pattern as forum route)
        const fetched = await query(
            `SELECT fp.id, fp.title, fp.content,
                    json_build_object('_id', u.id, 'name', u.name) AS user
             FROM forum_posts fp
             JOIN users u ON fp.user_id = u.id
             WHERE fp.topic_id = $1
             ORDER BY fp.created_at DESC`,
            [top.rows[0].id]
        );
        expect(fetched.rows).toHaveLength(1);
        expect(fetched.rows[0].user.name).toBe('Alice');
    });

    // ── Constraint enforcement ─────────────────────────────────
    it('rejects invalid difficulty values', async () => {
        const sub = await query(
            "INSERT INTO subjects (name, level) VALUES ('Constraint Test', 'O-Level') RETURNING id"
        );
        await expect(
            query(
                `INSERT INTO topics (subject_id, title, chapter, "order", difficulty)
                 VALUES ($1, 'Bad', 1, 1, 'expert')`,
                [sub.rows[0].id]
            )
        ).rejects.toThrow();
    });
});
