import { parseAuthCookie, verifyJwt } from '@/utils/jwt'

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

    return Response.json({ user: payload })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Failed to get user data' }, { status: 500 })
  }
}
