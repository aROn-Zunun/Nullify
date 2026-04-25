import { NextResponse } from 'next/server'
import { parseAuthCookie, verifyJwt } from '@/utils/jwt'

export async function proxy (request) {
  // 1. Get the JWT from the Cookie
  const token = parseAuthCookie(request.headers.get('cookie'))

  // 2. Define protected routes (example: all pages except the login page)
  const isProtectedRoute = !(
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/signup') ||
    request.nextUrl.pathname === '/'
  )

  if (isProtectedRoute) {
    // 3. No token provided: Redirect to the login page
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // 4. Verify the JWT
    const payload = verifyJwt(token)

    if (!payload) {
      // The token is invalid or expired, clear the invalid Cookie (optional)
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('authToken')
      return response
    }

    // 5. Verification passed: Attach user information to the request context (optional, needs to be used with route parameters)
    // Or obtain it through the getToken function in subsequent processing
  } else {
    // 6. Login page: If authenticated, redirect to the dashboard
    if (token && verifyJwt(token)) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // 7. Allow the request to continue
  return NextResponse.next()
}

// Configure the scope of the middleware (example: match all page routes)
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
