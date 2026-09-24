const { neon } = require('@neondatabase/serverless');

module.exports = async function handler(req, res) {
  const sql = neon(process.env.DATABASE_URL);

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS groups (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        class_size INTEGER NOT NULL DEFAULT 28,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        group_id TEXT NOT NULL,
        group_name TEXT NOT NULL DEFAULT 'General',
        presenter TEXT NOT NULL,
        product_type TEXT NOT NULL DEFAULT 'consumer',
        product_label TEXT NOT NULL DEFAULT 'product',
        class_size INTEGER NOT NULL DEFAULT 28,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS ratings (
        id SERIAL PRIMARY KEY,
        session_id TEXT NOT NULL,
        n1 INTEGER NOT NULL CHECK (n1 BETWEEN 1 AND 5),
        n2 INTEGER NOT NULL CHECK (n2 BETWEEN 1 AND 5),
        n3 INTEGER NOT NULL CHECK (n3 BETWEEN 1 AND 5),
        n4 INTEGER NOT NULL CHECK (n4 BETWEEN 1 AND 5),
        n5 INTEGER NOT NULL DEFAULT 3 CHECK (n5 BETWEEN 1 AND 5),
        f1 INTEGER NOT NULL CHECK (f1 BETWEEN 1 AND 5),
        f2 INTEGER NOT NULL CHECK (f2 BETWEEN 1 AND 5),
        f3 INTEGER NOT NULL CHECK (f3 BETWEEN 1 AND 5),
        f4 INTEGER NOT NULL CHECK (f4 BETWEEN 1 AND 5),
        f5 INTEGER NOT NULL DEFAULT 3 CHECK (f5 BETWEEN 1 AND 5),
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    // Add columns for existing tables
    await sql`ALTER TABLE sessions ADD COLUMN IF NOT EXISTS group_id TEXT`;
    await sql`ALTER TABLE sessions ADD COLUMN IF NOT EXISTS group_name TEXT NOT NULL DEFAULT 'General'`;
    await sql`ALTER TABLE ratings ADD COLUMN IF NOT EXISTS n5 INTEGER NOT NULL DEFAULT 3`;
    await sql`ALTER TABLE ratings ADD COLUMN IF NOT EXISTS f5 INTEGER NOT NULL DEFAULT 3`;

    res.status(200).json({ ok: true, message: 'Tables ready.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
