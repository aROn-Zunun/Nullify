import jwt from 'jsonwebtoken';
import * as Cookie from 'cookie';

export function parseAuthCookie(cookieHeader) {
  if (!cookieHeader) return null;
  const cookies = Cookie.parse(cookieHeader);
  return cookies.authToken || null;
}

/*// signing(HMAC) token for authenticity containing userId and is_admin to avoid unauthorized access
export function signJwt(payload){
  return jwt.sign(payload, process.env.JWT_SECRET,{
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}
  */
export function verifyJwt(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}