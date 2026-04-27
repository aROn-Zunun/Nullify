import db from '@/lib/db'
import minioClient from '@/lib/minio'
import { Readable } from 'node:stream'
import { parseAuthCookie, verifyJwt } from '@/utils/jwt'

function makeid (length) {
  var result = ''
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export async function GET (request) {
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

    const result = await db.query(
      'SELECT object_id, filename, file_size, file_type, file_modified, uploaded_at FROM files WHERE user_id = ?',
      [userId]
    )

    return Response.json({ files: result[0] })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Failed to list files' }, { status: 500 })
  }
}

export async function POST (request) {
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

    const data = await request.formData()
    const file = data.get('file')
    const filename = data.get('filename')
    const file_size = data.get('file_size')
    const file_type = data.get('file_type')
    const file_modified = data.get('file_modified')

    const object_id = makeid(21)

    await minioClient.putObject(
      'files',
      object_id,
      Readable.fromWeb(file.stream())
    )

    await db.query(
      'INSERT INTO files (object_id, user_id, filename, file_size, file_type, file_modified) VALUES (?, ?, ?, ?, ?, ?)',
      [object_id, userId, filename, file_size, file_type, file_modified]
    )

    return Response.json({ message: 'File uploaded successfully', object_id })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'File upload failed' }, { status: 500 })
  }
}

export async function DELETE (request, { params }) {
  const { object_id } = await params

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

    const result = await db.query(
      'SELECT id FROM files WHERE object_id = ? AND user_id = ? LIMIT 1',
      [object_id, userId]
    )

    if (result[0].length !== 1) {
      return Response.json({ error: 'File not found' }, { status: 404 })
    }

    try {
      await minioClient.removeObject('files', object_id)
    } finally {
      await db.query('DELETE FROM files WHERE object_id = ?', [object_id])
    }

    return Response.json({ message: 'File deleted successfully' })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Failed to delete file' }, { status: 500 })
  }
}
