// backend/index.js
const express = require('express');
const sequelize = require('./db');
const Entry = require('./models/entry');

const app = express();
app.use(express.json());

// routes
app.get('/api/entries', async (req, res) => {
  const { q, tag } = req.query;
  const where = {};
  if (tag) where.tags = tag;
  if (q) where.body = { [require('sequelize').Op.iLike]: `%${q}%` };
  const entries = await Entry.findAll({ where, order: [['created_at', 'DESC']] });
  res.json(entries);
});

app.post('/api/entries', async (req, res) => {
  const { title, body, tags } = req.body;
  if (!body) return res.status(400).json({ error: 'body is required' });
  const entry = await Entry.create({ title, body, tags });
  res.status(201).json(entry);
});

const PORT = process.env.PORT || 3000;

async function startServer() {
  await sequelize.authenticate();
  await sequelize.sync();
  const server = app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  return server;
}

// ha közvetlenül futtatják: indítsd el és exportáld a server objektumot
if (require.main === module) {
  startServer().catch(err => {
    console.error('Failed to start server', err);
    process.exit(1);
  });
}

// exportáljuk az app-et tesztekhez; ha valaki explicit kéri, exportálhatjuk a startServer-t is
module.exports = { app, startServer, sequelize };