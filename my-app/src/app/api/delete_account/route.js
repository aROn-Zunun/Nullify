import db from '@/lib/db'
import minioClient from '@/lib/minio'
import { parseAuthCookie, verifyJwt } from '@/utils/jwt'

export async function DELETE(request){
    try{
        const token= parseAuthCookie(request.headers.get('cookie'))
        if (!token)
            return Response.json({error: 'Unauthorized'},{status: 401})
        
        const payload = verifyJwt(token)
        if(!payload)
           return Response.json({error: 'Unauthorized'},{status: 401})

        const id = payload.userId

        const [files]= await db.query(
            'SELECT object_id FROM files WHERE user_id =?',[id]
        )
        //delete blob from minio
        for (const file of files){
            await minioClient.removeObject('files', file.object_id)
        }

        //deleteing mysql data
        await db.query('DELETE FROM users WHERE id=?',[id])
        
        return Response.json({message: 'Account deleted'})
    } 
    catch (error){
        console.error (error)
        return Response.json({error: "Failed to delete user account"},{status:500})
    }
    
}