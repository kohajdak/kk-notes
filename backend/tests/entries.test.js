// tests/entries.test.js
const request = require('supertest');
const { app, sequelize } = require('../index');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

test('POST /api/entries creates an entry and GET returns it', async () => {
  const payload = { body: 'This is a test entry', tags: 'test' };
  const postRes = await request(app).post('/api/entries').send(payload);
  expect(postRes.statusCode).toBe(201);
  expect(postRes.body).toHaveProperty('id');
  expect(postRes.body.body).toBe('This is a test entry');
  expect(postRes.body.tags).toBe('test');

  const getRes = await request(app).get('/api/entries');
  expect(getRes.statusCode).toBe(200);
  expect(Array.isArray(getRes.body)).toBe(true);
  expect(getRes.body.length).toBeGreaterThanOrEqual(1);
});

test('GET /api/entries with search query', async () => {
  await request(app).post('/api/entries').send({ body: 'Unique search content', tags: 'search' });
  const res = await request(app).get('/api/entries').query({ q: 'unique' });
  expect(res.statusCode).toBe(200);
  expect(res.body.some(e => e.body.includes('Unique'))).toBe(true);
});

test('PUT /api/entries/:id updates an entry', async () => {
  const createRes = await request(app).post('/api/entries').send({ body: 'Original content' });
  const id = createRes.body.id;

  const updateRes = await request(app).put(`/api/entries/${id}`).send({ body: 'Updated content', tags: 'updated' });
  expect(updateRes.statusCode).toBe(200);
  expect(updateRes.body.body).toBe('Updated content');
  expect(updateRes.body.tags).toBe('updated');
});

test('DELETE /api/entries/:id removes an entry', async () => {
  const createRes = await request(app).post('/api/entries').send({ body: 'To be deleted' });
  const id = createRes.body.id;

  const deleteRes = await request(app).delete(`/api/entries/${id}`);
  expect(deleteRes.statusCode).toBe(204);

  const getRes = await request(app).get('/api/entries');
  expect(getRes.body.find(e => e.id === id)).toBeUndefined();
});