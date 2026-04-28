'use client'

import "./Loading.css";

export default function Loading({ message = "" }) {
  return (
    <main className="loading-container">
      <div className="loading-content">
        <div className="loading-animation">
          <div className="spinner-widget"></div>
        </div>

        <p className="loading-description">{message}</p>
      </div>
    </main>
  );
}