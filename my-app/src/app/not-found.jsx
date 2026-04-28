'use client'

import Link from "next/link";
import "@/app/styles/not_found_styles.css";

export default function NotFound() {
  return (
    <main className="notfound-container">
      <div className="notfound-content">
        <div className="notfound-animation">
          <div className="notfound-code">404</div>
          <div className="notfound-icon">🔍</div>
        </div>

        <h1 className="notfound-title">Page Not Found</h1>
        <p className="notfound-description">
          Oops! The page you're looking for seems to have vanished into thin air.
          Just like our encrypted files after download!
        </p>

        <div className="notfound-buttons">
          <Link href="/" className="btn-primary btn-large">
            Back to Home
          </Link>
          <Link href="/signup" className="btn-secondary btn-large">
            Create Account
          </Link>
        </div>
      </div>

      <div className="notfound-background">
        <div className="floating-element element-1">🔐</div>
        <div className="floating-element element-2">📁</div>
        <div className="floating-element element-3">⚡</div>
        <div className="floating-element element-4">🛡️</div>
      </div>
    </main>
  );
}