const { neon } = require('@neondatabase/serverless');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const sql = neon(process.env.DATABASE_URL);
  const { passcode, scope, groupId, sessionId } = req.body;

  if (passcode !== 'chung') {
    return res.status(403).json({ error: 'Invalid passcode' });
  }

  try {
    if (scope === 'all') {
      await sql`DELETE FROM ratings`;
      await sql`DELETE FROM sessions`;
      await sql`DELETE FROM groups`;
      return res.status(200).json({ ok: true, message: 'All data cleared.' });
    }

    if (scope === 'group' && groupId) {
      const sessions = await sql`SELECT id FROM sessions WHERE group_id = ${groupId}`;
      for (const s of sessions) {
        await sql`DELETE FROM ratings WHERE session_id = ${s.id}`;
      }
      await sql`DELETE FROM sessions WHERE group_id = ${groupId}`;
      await sql`DELETE FROM groups WHERE id = ${groupId}`;
      return res.status(200).json({ ok: true, message: 'Group deleted.' });
    }

    if (scope === 'session' && sessionId) {
      await sql`DELETE FROM ratings WHERE session_id = ${sessionId}`;
      await sql`DELETE FROM sessions WHERE id = ${sessionId}`;
      return res.status(200).json({ ok: true, message: 'Session deleted.' });
    }

    res.status(400).json({ error: 'Invalid scope. Use: all, group, or session.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
