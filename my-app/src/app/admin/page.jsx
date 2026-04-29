"use client"
import '../styles/admin_styles.css'
import { useEffect, useState } from "react"

export default function AdminPage() {
  const [stats, setStats] = useState({ user_count: 0, file_count: 0 })
  const [users, setUsers] = useState([])
  const [expanded, setExpanded] = useState(null) // tracks which user is expanded

  useEffect(() => {
    async function fetchStats() {
      const res = await fetch('/api/admin')
      const data = await res.json()
      setStats(data)
    }

    async function fetchUsers() {
      const res = await fetch('/api/admin/user')
      const data = await res.json()
      setUsers(data.users)
    }
  
    

    fetchStats()
    fetchUsers()
  }, [])

   //api to delete users, passing userid to the backend 
  async function deleteUser(id){
    const res = await fetch(`/api/admin/user/${id}`, { method: 'DELETE' })
    if (res.ok){
      const data = await res.json()
      setUsers(users.filter(user => user.id!==id))
      setStats(prev =>({
        user_count: prev.user_count -1,
        file_count: prev.file_count - data.deleted_file_count
      }))
      
    }
  }

  function toggleUser(id) {
    setExpanded(expanded === id ? null : id) // collapse if already open
  }

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

      <section id="admin_users">
        <h2>Users</h2>
        {users.map(user => (
  <div key={user.id} className="user_card">
    <div className="user_row">
      <div className="user_info">
        <p className="user_name">{user.username}</p>
        <p className="user_email">{user.email}</p>
      </div>
      <button 
        className="expand_btn" 
        onClick={() => toggleUser(user.id)}
      >
        {expanded === user.id ? 'Hide' : 'View'}
      </button>
    </div>
    {expanded === user.id && (
      <div className="user_details">
        <p>Email: {user.email}</p>
        <p>Joined: {new Date(user.created_at).toLocaleDateString()}</p>
        <p>Files: {user.file_count}</p>
        <p>Storage: {(user.storage_used / 1024 / 1024).toFixed(2)} MB</p>
        <p>Admin: {user.is_admin ? 'Yes' : 'No'}</p>
         <button className="delete_btn" onClick={() => deleteUser(user.id)}>
          Delete User
          </button>
      </div>
    )}
  </div>
))}
      </section>
    </div>
  )
}