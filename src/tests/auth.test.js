const request = require('supertest');
const app = require('../src/app');


describe('Auth flows', () => {
it('should register and login', async () => {
const email = `test${Date.now()}@example.com`;
const password = 'Password123!';
const registerRes = await request(app).post('/api/v1/auth/register').send({ name: 'T', email, password });
expect(registerRes.statusCode).toBe(201);
const loginRes = await request(app).post('/api/v1/auth/login').send({ email, password });
expect(loginRes.statusCode).toBe(200);
expect(loginRes.body).toHaveProperty('accessToken');
});
});