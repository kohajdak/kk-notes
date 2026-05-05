// backend/tests/entry.model.test.js
const { sequelize, Entry } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

test('Entry validation fails without body', async () => {
  await expect(Entry.create({ tags: 'test' })).rejects.toThrow();
});

test('Entry creates successfully with required fields', async () => {
  const entry = await Entry.create({ body: 'Test body', tags: 'test', backgroundColor: '#FFE082' });
  expect(entry.id).toBeDefined();
  expect(entry.body).toBe('Test body');
  expect(entry.tags).toBe('test');
  expect(entry.backgroundColor).toBe('#FFE082');
});

test('Entry has default backgroundColor when not provided', async () => {
  const entry = await Entry.create({ body: 'Test body' });
  expect(entry.backgroundColor).toBe('#FFE082');
});

test('Entry can be updated', async () => {
  const entry = await Entry.create({ body: 'Original', tags: 'original' });
  await entry.update({ body: 'Updated', tags: 'updated' });
  expect(entry.body).toBe('Updated');
  expect(entry.tags).toBe('updated');
});

test('Entry can be deleted', async () => {
  const entry = await Entry.create({ body: 'To delete' });
  const id = entry.id;
  await entry.destroy();
  const found = await Entry.findByPk(id);
  expect(found).toBeNull();
});
