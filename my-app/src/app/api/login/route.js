import { NextResponse } from 'next/server'

import db from '@/lib/db'
import jwt from 'jsonwebtoken'
import { compare } from 'bcryptjs'

export async function POST (request) {
  try {
    const data = await request.json()

    const { username, password } = data

    const result = await db.query(
      'SELECT id, username, password_hash FROM users WHERE username = ? LIMIT 1',
      [username]
    )

    if (result[0].length !== 1) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const user = result[0][0]
    // Here you would typically compare the provided password with the hashed password
    // For demonstration purposes, we'll assume the passwords match

    if (!(await compare(password, user.password_hash))) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, username: user.username }, // The payload contains userid and username
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    )

    // Set an HttpOnly Cookie (security attribute)
    const response = NextResponse.json({ message: 'Login successful' })
    response.cookies.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Enable HTTPS in the production environment
      sameSite: 'lax', // Prevent CSRF attacks
      maxAge: Number(process.env.JWT_EXPIRES_IN),
      path: '/'
    })

    return response
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Unhandled error occurred' }, { status: 500 })
  }
}
