const { neon } = require('@neondatabase/serverless');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const sql = neon(process.env.DATABASE_URL);
  const { sessionId, N1, N2, N3, N4, N5, F1, F2, F3, F4, F5 } = req.body;

  if (!sessionId) return res.status(400).json({ error: 'sessionId is required' });

  const values = [N1, N2, N3, N4, N5, F1, F2, F3, F4, F5];
  if (values.some(v => v == null || v < 1 || v > 5)) {
    return res.status(400).json({ error: 'All ratings must be between 1 and 5' });
  }

  try {
    const session = await sql`SELECT id FROM sessions WHERE id = ${sessionId}`;
    if (session.length === 0) return res.status(404).json({ error: 'Session not found' });

    await sql`
      INSERT INTO ratings (session_id, n1, n2, n3, n4, n5, f1, f2, f3, f4, f5)
      VALUES (${sessionId}, ${N1}, ${N2}, ${N3}, ${N4}, ${N5}, ${F1}, ${F2}, ${F3}, ${F4}, ${F5})
    `;

    const count = await sql`SELECT COUNT(*) as c FROM ratings WHERE session_id = ${sessionId}`;
    res.status(200).json({ ok: true, count: parseInt(count[0].c) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
