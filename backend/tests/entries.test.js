// tests/entries.test.js
const request = require('supertest');
const app = require('../index');
const sequelize = require('../db');
const Entry = require('../models/entry');

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    await sequelize.close();
});

test('POST /api/entries creates an entry and GET returns it', async () => {
    const payload = { title: 'Teszt', body: 'Ez egy teszt bejegyzés', tags: 'test' };
    const postRes = await request(app).post('/api/entries').send(payload);
    expect(postRes.statusCode).toBe(201);
    expect(postRes.body).toHaveProperty('id');

    const getRes = await request(app).get('/api/entries');
    expect(getRes.statusCode).toBe(200);
    expect(Array.isArray(getRes.body)).toBe(true);
    expect(getRes.body.length).toBeGreaterThanOrEqual(1);
});
