import Link from "next/link";
import "@/app/styles/home_page_styles.css";

export default function Home() {
  return (
    <main className="home-container">

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 id="Home_Welcome_Header">Welcome to Nullify</h1>
          <p id="Information_para">Secure file sharing with one-time encrypted download links</p>
          <div className="hero-buttons">
            <Link href="/signup" className="btn-primary btn-large">Create Account</Link>
            <Link href="/login" className="btn-secondary btn-large">Login</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <h2>Why Choose Nullify?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Zero-Knowledge Encryption</h3>
            <p>Your files are encrypted client-side. We never see your original content or decryption keys.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>One-Time Downloads</h3>
            <p>Generate secure links that auto-delete files after a single download for maximum security.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🗑️</div>
            <h3>Auto-Removal</h3>
            <p>Files are automatically purged from our servers immediately after download completion.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3>Fast & Reliable</h3>
            <p>Powered by MinIO for blazing-fast uploads and downloads with enterprise-grade reliability.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🔗</div>
            <h3>Easy Sharing</h3>
            <p>Generate unique encrypted links and share them with anyone. No account needed to download.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Privacy First</h3>
            <p>Your data stays yours. We comply with privacy standards and never log file contents.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Register</h3>
            <p>Create a free account in seconds</p>
          </div>
          
          <div className="step-arrow">→</div>
          
          <div className="step">
            <div className="step-number">2</div>
            <h3>Upload</h3>
            <p>Encrypt and upload your file</p>
          </div>
          
          <div className="step-arrow">→</div>
          
          <div className="step">
            <div className="step-number">3</div>
            <h3>Share</h3>
            <p>Get a unique download link</p>
          </div>
          
          <div className="step-arrow">→</div>
          
          <div className="step">
            <div className="step-number">4</div>
            <h3>Auto-Delete</h3>
            <p>File vanishes after download</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <h2>Ready to Share Securely?</h2>
        <p>Join thousands of users trusting Nullify with their sensitive files</p>
        <Link href="/signup" className="btn-primary btn-large">Get Started for Free</Link>
      </section>
    </main>
  );
}