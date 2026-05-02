"use client"
import '../styles/admin_styles.css'
import { useEffect, useState } from "react"

export default function AdminPage() {
  const [stats, setStats] = useState({ user_count: 0, file_count: 0 , total_storage: 0 })
  const [users, setUsers] = useState([])
  const [expanded, setExpanded] = useState(null) // tracks which user is expanded
  

  useEffect(() => {
    async function fetchdata(){
      const res= await fetch ('/api/admin')
      const data = await res.json()
      
      setUsers(data.users)
      
      setStats( {
      user_count: data.user_count,
      file_count: data.file_count,
      total_storage: data.total_storage
    })
    }
    fetchdata()
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
        <div className="stat_card">
          <p className="stat_label">Storage used</p>
          <h2 className="stat_number">{stats.total_storage >= 1073741824 
              ? (Number(stats.total_storage) / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
              : (Number(stats.total_storage) / (1024 * 1024)).toFixed(2) + ' MB'}</h2>
        </div>
      </section>

      <section id="admin_users">
  <div id="user_table_header">
    <span>USER</span>
    <span>EMAIL</span>
    <span>FILES</span>
    <span>ROLE</span>
    <span>JOINED</span>
    <span></span>
  </div>
  {users.map(user => (
    <div key={user.id} className="user_row">
      <div className="user_info">
        <div className={user.is_admin == 1 ? 'user_avatar avatar_admin' : 'user_avatar'}>{user.username.slice(0,2).toUpperCase()}</div>
        <span className="user_name">{user.username}</span>
      </div>
      <span className="user_email">{user.email}</span>
      <span>{user.file_count}</span>
      <span className={user.is_admin == 1? 'badge_admin' : 'badge_user'}>
        {user.is_admin ==1 ? 'admin' : 'user'}
      </span>
      <span>{user.created_at.slice(0, 16).replace('T', ' ')}</span>{/*im gettind a different time from my sql*/}
      <button className="delete_btn" onClick={() => deleteUser(user.id)}>Delete</button>
    </div>
  ))}
</section>

      
    </div>
  )
}