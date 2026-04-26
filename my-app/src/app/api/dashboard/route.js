import db from '@/lib/db'
import { parseAuthCookie, verifyJwt } from '@/utils/jwt'
//api to fetch count of uploaded files
export async function GET(request) 
{
  try {
    const token = parseAuthCookie(request.headers.get('cookie'))

    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyJwt(token)

    if (!payload) {
      return Response.json({ error: 'Invalid token' }, { status: 401 })
    }

    const userId = payload.userId

    const [rows] = await db.query(
      'SELECT COUNT(*) AS total_uploads FROM files WHERE user_id = ?',
      [userId]
    )

    return Response.json({ file_count: rows[0].total_uploads })
  } catch (error) {
    console.error(error)
    return Response.json(
      { error: 'Failed to find user count' },{ status: 500 })
  }
}