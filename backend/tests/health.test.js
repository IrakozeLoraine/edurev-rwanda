/* global jest */
const request = require('supertest');

jest.mock('../config/db', () => ({
    pool: {},
    query: jest.fn(),
    connectDB: jest.fn(),
    closeDB: jest.fn(),
}));

jest.mock('../config/schema', () => jest.fn());

const { app } = require('../server');

describe('Health check', () => {
    it('responds with 200 on root path', async () => {
        const res = await request(app).get('/api/health');
        expect(res.statusCode).toBe(200);
    });
});
