import db from  '@/lib/db'
import { parseAuthCookie, verifyJwt } from '@/utils/jwt'

//api to fetch all users and their data.
// total user , total files, metadata of files, and total storage
export async function GET(request) {
    const token = parseAuthCookie(request.headers.get('cookie'))
    if (!token) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const payload = verifyJwt(token)
    if (!payload?.isAdmin) return Response.json({ error: 'Forbidden' }, { status: 403 })
    const [users] = await db.query(`
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

  const user_count = users.length
  const file_count = users.reduce((sum, u) => sum + u.file_count, 0)
  const total_storage = users.reduce((sum, u) => sum + Number(u.storage_used), 0)
    
    
    return Response.json({ user_count, file_count, total_storage, users})
}