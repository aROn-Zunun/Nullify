import db from '@/lib/db'
import minioClient from '@/lib/minio'
import { Readable } from 'node:stream'
import { parseAuthCookie, verifyJwt } from '@/utils/jwt'

function listFiles () {
  return new Promise((resolve, reject) => {
    const files = []
    const stream = minioClient.listObjects('files', '', true)
    stream.on('data', obj => files.push(obj))
    stream.on('end', () => resolve(files))
    stream.on('error', err => reject(err))
  })
}

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
    const files = await listFiles()
    return Response.json({ files })
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

    const object_id = makeid(21)

    await minioClient.putObject(
      'files',
      object_id,
      Readable.fromWeb(file.stream())
    )

    await db.query(
      'INSERT INTO files (object_id, user_id, filename) VALUES (?, ?, ?)',
      [object_id, userId, filename]
    )

    return Response.json({ message: 'File uploaded successfully', object_id })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'File upload failed' }, { status: 500 })
  }
}
