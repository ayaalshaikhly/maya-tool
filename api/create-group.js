const { neon } = require('@neondatabase/serverless');
const crypto = require('crypto');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const sql = neon(process.env.DATABASE_URL);
  const { name, classSize } = req.body;

  if (!name) return res.status(400).json({ error: 'Group name is required' });

  const id = crypto.randomBytes(4).toString('hex');

  try {
    await sql`
      INSERT INTO groups (id, name, class_size)
      VALUES (${id}, ${name}, ${classSize || 28})
    `;

    res.status(201).json({ id, name, classSize: classSize || 28 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
