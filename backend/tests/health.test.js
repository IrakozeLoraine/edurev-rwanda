const request = require('supertest');
const app = require('../server');

describe('Health check', () => {
    it('responds with 200 on root path', async () => {
        const res = await request(app).get('/api/health');
        expect(res.statusCode).toBe(200);
    });
});
