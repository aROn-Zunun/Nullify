import db from  '@/lib/db'
import { parseAuthCookie, verifyJwt } from '@/utils/jwt'

//api to fetch all users and their data.
// total user , total files
export async function GET(request) {
    const token = parseAuthCookie(request.headers.get('cookie'))
    if (!token) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const payload = verifyJwt(token)
    if (!payload?.isAdmin) return Response.json({ error: 'Forbidden' }, { status: 403 })

    const [[{ user_count }]] = await db.query('SELECT COUNT(*) AS user_count FROM users')
    const [[{ file_count }]] = await db.query('SELECT COUNT(*) AS file_count FROM files')
    
    return Response.json({ user_count, file_count })
}