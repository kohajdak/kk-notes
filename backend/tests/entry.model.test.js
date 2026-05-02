// backend/tests/entry.model.test.js
const { sequelize, Entry } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

test('Entry validation fails without body', async () => {
  await expect(Entry.create({ title: 'x' })).rejects.toThrow();
});
