import db from '@/lib/db'
import bcrypt from 'bcrypt'

export async function GET (request, { params }) {
  const { object_id } = await params

  try {
    const result = await db.query(
      'SELECT filename, file_size, file_type, file_modified, uploaded_at FROM files WHERE object_id = ? LIMIT 1',
      [object_id]
    )

    if (result[0].length !== 1) {
      return Response.json({ error: 'File not found' }, { status: 404 })
    }

    return Response.json(result[0][0])
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Failed to fetch file' }, { status: 500 })
  }
}
