const { neon } = require('@neondatabase/serverless');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const sql = neon(process.env.DATABASE_URL);
  const { id } = req.query;

  if (!id) return res.status(400).json({ error: 'Group id is required' });

  try {
    const rows = await sql`SELECT id, name, class_size, created_at FROM groups WHERE id = ${id}`;
    if (rows.length === 0) return res.status(404).json({ error: 'Group not found' });

    const g = rows[0];
    res.status(200).json({ id: g.id, name: g.name, classSize: g.class_size, createdAt: g.created_at });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
