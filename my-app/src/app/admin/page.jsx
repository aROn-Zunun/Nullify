"use client";

import "../styles/admin_styles.css"
import {uesEffect,useEffect,useState} from "react"
export default function AdminPage(){
    const [stats, setStats]=useState({user_count:0, file_count:0});

    useEffect(()=>{
        async function fetchStatus(){
            const res= await fetch('/api/admin');
            const data= await res.json();
            setStats(data);
        }
        fetchStatus();
    },[])
    return (
    <div id="admin_container">
      <h1 id="admin_header">Admin</h1>
      <p id="admin_description">User management — Nullify</p>

      <section id="admin_stats">
        <div className="stat_card">
          <p className="stat_label">Total Users</p>
          <h2 className="stat_number">{stats.user_count}</h2>
        </div>
        <div className="stat_card">
          <p className="stat_label">Total Files</p>
          <h2 className="stat_number">{stats.file_count}</h2>
        </div>
      </section>
    </div>
  );
}