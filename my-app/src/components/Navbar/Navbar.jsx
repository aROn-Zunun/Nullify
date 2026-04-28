'use client'

import Link from "next/link";
import "./Navbar.css";
import { useState, useEffect } from 'react'

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/api/user')
      .then(response => response.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
        }
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, []);

  const handleLogout = async () => {
    await fetch('/api/logout')
    window.location.href = '/'
  }

  return (
    <nav id="navbar">
      <div id="nav_container">

      <Link href="/">
        <h2 id="logo">Nullify</h2>
      </Link>

      {
        user ? (
          <div id="nav_buttons">
            {user.isAdmin && (
              <Link href="/admin">
                <button className="Admin_btn">Admin</button>
              </Link>
            )}
            <Link href="/upload">
              <button className="Upload_btn">Upload</button>
            </Link>
            <button className="Logout_btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div id="nav_buttons">
            <Link href="/login">
              <button className="Login_btn">Login</button>
            </Link>
            <Link href="/signup">
              <button className="Signup_btn">Sign up</button>
            </Link>
          </div>
        )
      }

      </div>
    </nav>
  );
}