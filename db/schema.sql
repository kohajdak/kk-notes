-- db/schema.sql
CREATE TABLE entries (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  body TEXT NOT NULL,
  tags VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);