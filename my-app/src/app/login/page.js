'use client'
import '../styles/login_styles.css'
import { useState } from 'react'
import { showToast } from 'nextjs-toast-notify'
import { useRouter } from 'next/navigation'

export default function Login () {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  async function handleSubmit (event) {
    event.preventDefault()

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password
      })
    })

    if (response.ok) {
      showToast.success('Login successful!')
      window.location.href = '/dashboard' // Full page reload to rerender navbar
    } else {
      const data = await response.json()
      showToast.error(`Login failed: ${data.error}`)
    }
  }

  return (
    <div id='login_container'>
      <h1 id='login_header'>Login</h1>
      <p id='login_description'>Please enter your credentials to login.</p>

      <form id='login_form' onSubmit={handleSubmit}>
        <div id='username_field'>
          <label id='username_label'>Username</label>

          <input
            id='username_input'
            type='text'
            name='username'
            required
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>

        <div id='password_field'>
          <label id='password_label'>Password</label>

          <input
            id='password_input'
            type='password'
            name='password'
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <button id='login_button' type='submit'>
          Login
        </button>
      </form>
    </div>
  )
}
