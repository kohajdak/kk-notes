// backend/tests/entries.integration.test.js
const request = require('supertest');
const { app, sequelize } = require('../index');

beforeAll(async () => { await sequelize.sync({ force: true }); });
afterAll(async () => { await sequelize.close(); });

test('POST /api/entries returns 400 when body missing', async () => {
  const res = await request(app).post('/api/entries').send({ tags: 'test' });
  expect(res.statusCode).toBe(400);
  expect(res.body.error).toBe('body is required');
});

test('GET /api/entries?tag=test filters by tag', async () => {
  await request(app).post('/api/entries').send({ body: 'Tagged entry', tags: 'test' });
  await request(app).post('/api/entries').send({ body: 'Other entry', tags: 'other' });
  const res = await request(app).get('/api/entries').query({ tag: 'test' });
  expect(res.statusCode).toBe(200);
  expect(res.body.every(e => e.tags === 'test')).toBe(true);
});

test('PUT /api/entries/:id returns 404 for non-existent entry', async () => {
  const res = await request(app).put('/api/entries/99999').send({ body: 'Updated' });
  expect(res.statusCode).toBe(404);
  expect(res.body.error).toBe('Note not found');
});

test('PUT /api/entries/:id returns 400 when body missing', async () => {
  const createRes = await request(app).post('/api/entries').send({ body: 'Original' });
  const id = createRes.body.id;
  const res = await request(app).put(`/api/entries/${id}`).send({ tags: 'updated' });
  expect(res.statusCode).toBe(400);
  expect(res.body.error).toBe('body is required');
});

test('DELETE /api/entries/:id returns 404 for non-existent entry', async () => {
  const res = await request(app).delete('/api/entries/99999');
  expect(res.statusCode).toBe(404);
  expect(res.body.error).toBe('Note not found');
});

test('GET /api/entries handles empty search query', async () => {
  await request(app).post('/api/entries').send({ body: 'Test entry' });
  const res = await request(app).get('/api/entries').query({ q: '' });
  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});

test('POST /api/entries creates entry with default backgroundColor', async () => {
  const res = await request(app).post('/api/entries').send({ body: 'Test entry' });
  expect(res.statusCode).toBe(201);
  expect(res.body.backgroundColor).toBe('#FFE082');
});

test('PUT /api/entries/:id updates backgroundColor', async () => {
  const createRes = await request(app).post('/api/entries').send({ body: 'Original' });
  const id = createRes.body.id;
  const updateRes = await request(app).put(`/api/entries/${id}`).send({ body: 'Updated', backgroundColor: '#FF6B6B' });
  expect(updateRes.statusCode).toBe(200);
  expect(updateRes.body.backgroundColor).toBe('#FF6B6B');
});