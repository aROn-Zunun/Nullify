import db from '@/lib/db'
import { parseAuthCookie, verifyJwt } from '@/utils/jwt'
import minioClient from '@/lib/minio'


// api function to delete users by their userID and blobs 

export async function DELETE(request, {params}){
    try{
        const token = parseAuthCookie(request.headers.get('cookie'))
        if (!token )
        return Response.json({error:'Unauthorized'},{status:401})
        
        const payload= verifyJwt(token)

        if (!payload?.isAdmin) 
            return Response.json ({error: 'Forbidden'},{status:403})

        const {id}= await params

        // grabbing the files ID to delete it from MINIO
         const [files]= await db.query(
            'SELECT object_id FROM files WHERE user_id=?', [id]
        )

        //deleteing users' uploaded blob
        for (const file of files){
            await minioClient.removeObject('files', file.object_id)
        }

         //deleteing users information from mysql
        await db.query('DELETE FROM users WHERE id=?', [id])
        return Response.json ({message: 'User deleted', deleted_file_count:files.length ??0})
    }
    catch (error) {
        console.error(error)
        return Response.json({ error: 'Failed to delete user' }, { status: 500 })
     }




}
export async function GET(request, { params }) {
  const token = parseAuthCookie(request.headers.get('cookie'))
  if (!token)
    return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const payload = verifyJwt(token)
  if (!payload?.isAdmin)                           
    return Response.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params                      

  const [files] = await db.query(
    'SELECT id, object_id, filename, file_size, file_type, uploaded_at FROM files WHERE user_id = ?',
    [id]                                          
  )

  return Response.json({ files })
}