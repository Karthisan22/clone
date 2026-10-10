import { db } from 'hatchable';

export const access = 'user';
export const methods = ['GET', 'POST'];

export default async function (req, res) {
  const user = req.user;
  if (req.method === 'POST') {
    await db.query(
      `INSERT INTO user_profiles (user_id, email, created_at, last_sign_in_at)
       VALUES ($1, $2, now(), now())
       ON CONFLICT (user_id) DO UPDATE SET email = EXCLUDED.email, last_sign_in_at = now()`,
      [user.id, user.email]
    );
  }
  const { rows } = await db.query(
    'SELECT user_id, email, created_at, last_sign_in_at FROM user_profiles WHERE user_id = $1',
    [user.id]
  );
  if (rows.length === 0) {
    await db.query(
      'INSERT INTO user_profiles (user_id, email) VALUES ($1, $2) ON CONFLICT (user_id) DO NOTHING',
      [user.id, user.email]
    );
    const result = await db.query(
      'SELECT user_id, email, created_at, last_sign_in_at FROM user_profiles WHERE user_id = $1',
      [user.id]
    );
    return res.json(result.rows[0]);
  }
  return res.json(rows[0]);
}