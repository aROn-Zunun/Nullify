"use client";
import "../styles/dashboard_styles.css";
import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();

  return (
    <div id="dashboard_container">
      <h1 id="dashboard_header">Dashboard</h1>
      <p id="dashboard_description">Welcome to your dashboard!</p>
    </div>
  );
}