import db from '@/lib/db'
import { parseAuthCookie, verifyJwt } from '@/utils/jwt'
//api to fetch meta data from mysql about users files
//some how will have to the ID thats minio has it stored under

export async function GET (request){
    const token = parseAuthCookie(request.headers.get('cookie'))

    if(!token){
        return Response.json({error: "Unauthorized"},{status:401})
    }   

    const payload=verifyJwt(token)

    if (!payload){
        return Response.json({error: 'Invalid Token'}, {status:401})
    }

    const userId= payload.userId

    const [files] = await db.query(
    'SELECT id, object_id, filename FROM files WHERE user_id = ? ORDER BY id DESC',
    [userId]
)
    return Response.json ({files})
}