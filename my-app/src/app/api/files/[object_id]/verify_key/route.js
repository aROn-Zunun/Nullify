import db from '@/lib/db'
import * as bcrypt from 'bcrypt'

export async function POST(request, { params }) {
  const { object_id } = await params
  try {
    const { key_hash } = await request.json()

    const result = await db.query(
      'SELECT key_hash FROM files WHERE object_id = ? LIMIT 1',
      [object_id]
    )
    if (result[0].length !== 1) {
      return Response.json({ error: 'File not found' }, { status: 404 })
    }

    const stored_hash = result[0][0].key_hash
    const match = await bcrypt.compare(key_hash, stored_hash)

    if (!match) {
      return Response.json({ error: 'Invalid key' }, { status: 403 })
    }

    return Response.json({ message: 'Key verified' })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Verification failed' }, { status: 500 })
  }
}