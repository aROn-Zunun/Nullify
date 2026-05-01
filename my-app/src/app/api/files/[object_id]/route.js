import { NextResponse } from 'next/server'
import db from '@/lib/db'
import minioClient from '@/lib/minio'
import bcrypt from 'bcrypt'

function getFile (filename) {
  return new Promise((resolve, reject) => {
    minioClient.getObject('files', filename, (err, stream) => {
      if (err) return reject(err)
      const chunks = []
      stream.on('data', chunk => chunks.push(chunk))
      stream.on('end', async () => {
        await minioClient.removeObject('files', filename) // Delete the file after fetching
        
        resolve(Buffer.concat(chunks))
      })
      stream.on('error', err => reject(err))
    })
  })
}

export async function GET (request, { params }) {
  const { object_id } = await params
  const key_hash = request.headers.get('x-key-hash')
  try {
    const result = await db.query(
      'SELECT object_id, filename,key_hash FROM files WHERE object_id = ? LIMIT 1',
      [object_id]
    )

    if (result[0].length !== 1) {
      return Response.json({ error: 'File not found' }, { status: 404 })
    }

    const file_info = result[0][0]
    const match = await bcrypt.compare(key_hash, file_info.key_hash)
    if (!match ){
      return Response.json ({error:'Invalid key'}, {status:403})
    }
    
    const file = await getFile(file_info.object_id)
    return new NextResponse(file, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(file_info.filename)}`
      }
    })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Failed to fetch file' }, { status: 500 })
  }
}
