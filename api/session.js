const { neon } = require('@neondatabase/serverless');
const crypto = require('crypto');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const sql = neon(process.env.DATABASE_URL);
  const { groupId, presenter, productType, productLabel } = req.body;

  if (!groupId || !presenter || !productType) {
    return res.status(400).json({ error: 'groupId, presenter, and productType are required' });
  }

  try {
    // Get group info
    const group = await sql`SELECT id, name, class_size FROM groups WHERE id = ${groupId}`;
    if (group.length === 0) return res.status(404).json({ error: 'Group not found' });

    const g = group[0];
    const id = crypto.randomBytes(4).toString('hex');

    await sql`
      INSERT INTO sessions (id, group_id, group_name, presenter, product_type, product_label, class_size)
      VALUES (${id}, ${groupId}, ${g.name}, ${presenter}, ${productType}, ${productLabel || 'product'}, ${g.class_size})
    `;

    res.status(201).json({
      id, groupId, groupName: g.name, presenter,
      productType, productLabel: productLabel || 'product',
      classSize: g.class_size
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
