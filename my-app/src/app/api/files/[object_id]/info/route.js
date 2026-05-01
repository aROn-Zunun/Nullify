import db from '@/lib/db'
import bcrypt from 'bcrypt'

export async function GET (request, { params }) {
  const { object_id } = await params

  try {
    const key_hash=request.headers.get('x-key-hash')
    const result = await db.query(
      'SELECT filename, file_size, file_type, file_modified, uploaded_at, key_hash FROM files WHERE object_id = ? LIMIT 1',
      [object_id]
    )

    if (result[0].length !== 1) {
      return Response.json({ error: 'File not found' }, { status: 404 })
    }
    const stored_hash= result[0][0].key_hash
    const match= await bcrypt.compare(key_hash,stored_hash)
    if (!match){
      return Response.json({error:'Invalid key'},{status:403})
    }

    
    return Response.json(result[0][0],{message: 'Key verified'})
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Failed to fetch file' }, { status: 500 })
  }
}
