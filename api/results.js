const { neon } = require('@neondatabase/serverless');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const sql = neon(process.env.DATABASE_URL);
  const { id } = req.query;

  if (!id) return res.status(400).json({ error: 'Session id is required' });

  try {
    const session = await sql`
      SELECT id, group_name, presenter, product_type, product_label, class_size, created_at
      FROM sessions WHERE id = ${id}
    `;
    if (session.length === 0) return res.status(404).json({ error: 'Session not found' });

    const ratings = await sql`
      SELECT n1, n2, n3, n4, n5, f1, f2, f3, f4, f5, created_at
      FROM ratings WHERE session_id = ${id}
      ORDER BY created_at ASC
    `;

    const s = session[0];
    res.status(200).json({
      session: s.id,
      groupName: s.group_name,
      presenter: s.presenter,
      productType: s.product_type,
      productLabel: s.product_label,
      classSize: s.class_size,
      createdAt: s.created_at,
      ratings: ratings.map(r => ({
        N1: r.n1, N2: r.n2, N3: r.n3, N4: r.n4, N5: r.n5,
        F1: r.f1, F2: r.f2, F3: r.f3, F4: r.f4, F5: r.f5
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
