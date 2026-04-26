"use client";
import "../styles/dashboard_styles.css";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';


export default function Dashboard() {
  const [count, setCount]=useState(0)
  const router = useRouter();

  useEffect(()=> {
    async function fetchDashboard(){ 
      
      const response= await fetch('/api/dashboard')
      const data = await response.json()

      
      setCount(data.file_count)
    }
      fetchDashboard()
    },[])
  
  return (
    <div id="dashboard_container">
      <h1 id="dashboard_header">Dashboard</h1>
      <p id="dashboard_description">Welcome to your dashboard!</p>
      <h1 id="total_uploads_title">Total Uploads</h1>
      <p id="count_uploads">You have uploaded: {count} amount of files!</p>
    </div>
  );
}