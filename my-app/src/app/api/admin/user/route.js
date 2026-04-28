import db from '@/lib/db'
import { parseAuthCookie, verifyJwt } from '@/utils/jwt'

export async function GET(request) {
  const token = parseAuthCookie(request.headers.get('cookie'))
  if (!token) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const payload = verifyJwt(token)
  if (!payload?.isAdmin) return Response.json({ error: 'Forbidden' }, { status: 403 })

  const [rows] = await db.query(`
    SELECT
    users.id,
    users.username,
    users.email,
    users.is_admin,
    users.created_at,
    COUNT(files.id) AS file_count,
    COALESCE(SUM(files.file_size), 0) AS storage_used
  FROM users
  LEFT JOIN files ON files.user_id = users.id
  GROUP BY users.id
  `)

  return Response.json({ users: rows })
}