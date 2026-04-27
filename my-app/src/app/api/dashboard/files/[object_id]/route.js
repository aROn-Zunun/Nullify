import db from '@/lib/db'
import minioClient from '@/lib/minio'
import { parseAuthCookie, verifyJwt } from '@/utils/jwt'

export async function DELETE(request, { params }) {
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
    const { object_id } = await params

    const [rows] = await db.query(
      'SELECT * FROM files WHERE object_id = ? AND user_id = ?',
      [object_id, userId]
    )

    if (rows.length === 0) {
      return Response.json({ error: 'File not found' }, { status: 404 })
    }

    await minioClient.removeObject('files', object_id)

    await db.query(
      'DELETE FROM files WHERE object_id = ? AND user_id = ?',
      [object_id, userId]
    )

    return Response.json({ message: 'File deleted' })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Failed to delete file' }, { status: 500 })
  }
}