import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET (request) {
  const cookieStore = await cookies() // Use 'await' for Next.js 15+
  cookieStore.delete('authToken') // Clear the authentication token Cookie

  return NextResponse.json({ success: true }) // Return a JSON response
}
