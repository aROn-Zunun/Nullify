'use client'
import './sign_up_styles.css'
import { useState } from 'react'
import { showToast } from 'nextjs-toast-notify'
import { useRouter } from 'next/navigation'

function isStrongPassword (password) {
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  return strongPasswordRegex.test(password)
}

export default function Signup () {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  async function handleSubmit (event) {
    event.preventDefault()

    if (password !== event.target.password_verify.value) {
      showToast.error('Passwords do not match')
      return
    }

    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        email,
        password
      })
    })

    const data = await response.json()

    if (response.ok) {
      showToast.success('Account created successfully!')
      router.push('/login') // Redirect to login page after successful signup
    } else {
      showToast.error(`Signup failed: ${data.error}`)
    }
  }

  return (
    <div id='signup_container'>
      <h1 id='create_account_header'>Create Account</h1>
      <p id='signup_description'>Sign up to start using Nullify.</p>

      <form id='signup_form' method='post' onSubmit={handleSubmit}>
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

        <div id='email_field'>
          <label id='email_label'>Email</label>
          
          <input
            id='email_input'
            type='email'
            name='email'
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
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

        <div id='password_verify_field'>
          <label id='password_verify_label'>Verify Password</label>

          <input
            id='password_verify_input'
            type='password'
            name='password_verify'
            required
          />
        </div>

        <div id='password_requirements'>
          <p className={password.length > 0 ? (isStrongPassword(password) ? 'strong' : 'weak') : ''}>Password must be at least 8 characters long and contain a mix of uppercase letters, lowercase letters, numbers, and special characters.</p>
        </div>

        <button id='signup_button' type='submit'>
          Sign Up
        </button>
      </form>
    </div>
  )
}
