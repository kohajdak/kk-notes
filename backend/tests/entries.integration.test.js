const request = require('supertest');
const { app, sequelize } = require('../index');

beforeAll(async () => { await sequelize.sync({ force: true }); });
afterAll(async () => { await sequelize.close(); });

test('POST /api/entries returns 400 when body missing', async () => {
  const res = await request(app).post('/api/entries').send({ title: 'x' });
  expect(res.statusCode).toBe(400);
});

test('GET /api/entries?tag=test filters by tag', async () => {
  await request(app).post('/api/entries').send({ title: 't', body: 'b', tags: 'test' });
  const res = await request(app).get('/api/entries').query({ tag: 'test' });
  expect(res.statusCode).toBe(200);
  expect(res.body.some(e => e.tags === 'test')).toBe(true);
});