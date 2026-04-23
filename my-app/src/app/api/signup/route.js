import db from '@/lib/db'
import * as bcrypt from 'bcryptjs'

function isStrongPassword (password) {
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  return strongPasswordRegex.test(password)
}

function isEmailValid (email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
}

export async function POST (request) {
  try {
    const data = await request.json()

    const { username, email, password } = data

    if (username.length < 5) {
      return Response.json(
        { error: 'Username must be at least 5 characters long.' },
        { status: 400 }
      )
    }

    if (!isEmailValid(email)) {
      return Response.json({ error: 'Invalid email format.' }, { status: 400 })
    }

    if (!isStrongPassword(password)) {
      return Response.json(
        {
          error:
            'Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and special characters.'
        },
        { status: 400 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 10)

    await db.query(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, passwordHash]
    )

    return Response.json({ message: 'User created successfully' })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Unhandled error occurred' }, { status: 500 })
  }
}
