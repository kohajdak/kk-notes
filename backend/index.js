// backend/index.js
const express = require('express');
const cors = require('cors');
const { Op } = require('sequelize');
const { sequelize, Entry } = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.get('/api/entries', async (req, res) => {
  try {
    const { q, tag } = req.query;
    const where = {};
    if (tag) where.tags = tag;
    if (q && q.trim()) {
      where.body = { [Op.iLike]: `%${q}%` };
    }
    const entries = await Entry.findAll({ where, order: [['createdAt', 'DESC']] });
    res.json(entries);
  } catch (err) {
    console.error('Error fetching entries:', err);
    res.status(500).json({ error: 'Failed to fetch entries', details: err.message });
  }
});

app.post('/api/entries', async (req, res) => {
  try {
    const { body, tags, backgroundColor } = req.body;
    if (!body) return res.status(400).json({ error: 'body is required' });
    const entry = await Entry.create({ body, tags, backgroundColor: backgroundColor || '#FFE082' });
    res.status(201).json(entry);
  } catch (err) {
    console.error('Error creating entry:', err);
    res.status(500).json({ error: 'Failed to create entry', details: err.message });
  }
});

app.put('/api/entries/:id', async (req, res) => {
  try {
    const entry = await Entry.findByPk(req.params.id);
    if (!entry) return res.status(404).json({ error: 'Note not found' });

    const { body, tags, backgroundColor } = req.body;
    if (!body) return res.status(400).json({ error: 'body is required' });

    entry.body = body;
    entry.tags = tags;
    entry.backgroundColor = backgroundColor || '#FFE082';
    await entry.save();

    res.json(entry);
  } catch (err) {
    console.error('Error updating entry:', err);
    res.status(500).json({ error: 'Failed to update entry', details: err.message });
  }
});

app.delete('/api/entries/:id', async (req, res) => {
  try {
    const entry = await Entry.findByPk(req.params.id);
    if (!entry) return res.status(404).json({ error: 'Note not found' });

    await entry.destroy();
    res.status(204).end();
  } catch (err) {
    console.error('Error deleting entry:', err);
    res.status(500).json({ error: 'Failed to delete entry', details: err.message });
  }
});

const PORT = process.env.PORT || 3000;

async function startServer() {
  await sequelize.authenticate();

  if (process.env.NODE_ENV !== 'production') {
    await sequelize.sync({ alter: true });
  } else if (process.env.SKIP_DB_SYNC !== 'true') {
    await sequelize.sync({ alter: true });
  } else {
    console.log('Production mode: skipping sequelize.sync(); run migrations instead.');
  }

  const server = app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  return server;
}

if (require.main === module) {
  startServer().catch(err => {
    console.error('Failed to start server', err);
    process.exit(1);
  });
}

module.exports = { app, startServer, sequelize };