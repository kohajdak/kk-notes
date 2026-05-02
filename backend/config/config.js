// backend/config/config.js
module.exports = {
  development: {
    url: process.env.DATABASE_URL || 'postgres://app:secret@127.0.0.1:5432/notes',
    dialect: 'postgres'
  },
  test: {
    url: process.env.DATABASE_URL || 'postgres://app:secret@127.0.0.1:5432/notes_test',
    dialect: 'postgres'
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres'
  }
};
