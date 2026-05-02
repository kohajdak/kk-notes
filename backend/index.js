// backend/index.js
const express = require('express');
const sequelize = require('./db');
const Entry = require('./models/entry');

const app = express();
app.use(express.json());

// GET /api/entries
app.get('/api/entries', async (req, res) => {
    const { q, tag } = req.query;
    const where = {};
    if (tag) where.tags = tag;
    if (q) where.body = { [require('sequelize').Op.iLike]: `%${q}%` };
    const entries = await Entry.findAll({ where, order: [['created_at', 'DESC']] });
    res.json(entries);
});

// POST /api/entries
app.post('/api/entries', async (req, res) => {
    const { title, body, tags } = req.body;
    if (!body) return res.status(400).json({ error: 'body is required' });
    const entry = await Entry.create({ title, body, tags });
    res.status(201).json(entry);
});

// DB init and server start
const PORT = process.env.PORT || 3000;
async function start() {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
}
start();

module.exports = app;
