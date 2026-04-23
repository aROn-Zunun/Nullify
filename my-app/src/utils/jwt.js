import jwt from 'jsonwebtoken';
import * as Cookie from 'cookie';

export function parseAuthCookie(cookieHeader) {
  if (!cookieHeader) return null;
  const cookies = Cookie.parse(cookieHeader);
  return cookies.authToken || null;
}

export function verifyJwt(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}