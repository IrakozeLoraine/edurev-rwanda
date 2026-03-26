/* global jest */
const request = require('supertest');
const { app, startServer, stopServer } = require('../server');

jest.mock('../config/db', () => ({
    pool: {},
    query: jest.fn(),
    connectDB: jest.fn(),
    closeDB: jest.fn(),
}));

jest.mock('../config/schema', () => jest.fn());

describe('Health check', () => {
    beforeAll(async () => {
        await startServer();
    });

    afterAll(async () => {
        await stopServer();
    });

    it('responds with 200 on root path', async () => {
        const res = await request(app).get('/api/health');
        expect(res.statusCode).toBe(200);
    });
});
