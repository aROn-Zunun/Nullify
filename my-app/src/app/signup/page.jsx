"use client";
import "./sign_up_styles.css";
import { useState } from "react";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const response = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });

    const data = await response.json();
    console.log(data);
  }

  return (
    <div id="signup_container">
      <h1 id="create_account_header">Create Account</h1>
      <p id="signup_description">Sign up to start using Nullify.</p>

      <form id="signup_form" onSubmit={handleSubmit}>
        <div id="username_field">
          <label id="username_label">Username</label><br />
          <input
            id="username_input"
            type="text"
            name="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div id="email_field">
          <label id="email_label">Email</label><br />
          <input
            id="email_input"
            type="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div id="password_field">
          <label id="password_label">Password</label><br />
          <input
            id="password_input"
            type="password"
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <br />
        <button id="signup_button" type="submit">Sign Up</button>
      </form>
    </div>
  );
}