"use client";
import "../styles/dashboard_styles.css";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';


export default function Dashboard() {
  const [count, setCount]=useState(0)
  const router = useRouter();
  const[files, setFiles]= useState([])
  
  const [showFiles, setShowFiles]= useState(false)

  useEffect(()=> {
    async function fetchUploadCount(){ 
      
      const response= await fetch('/api/dashboard')
      const data = await response.json()

      
      setCount(data.file_count)
    }
      fetchUploadCount()
    },[])

  async function handleViewFiles(){
    const response= await fetch ('/api/dashboard/files')
    const data= await response.json ()
    setFiles(data.files)
    setShowFiles(true)
  }

  async function handleDeleteFile(objectId) {
  const response = await fetch(`/api/dashboard/files/${objectId}`, {
    method: 'DELETE'
  })

  const data = await response.json()

  if (!response.ok) {
    console.log(data.error)
    return
  }

  setFiles(files.filter(file => file.object_id !== objectId))
   setCount(count - 1)
}

  
  return (
    <div id="dashboard_container">
  <h1 id="dashboard_header">Dashboard</h1>
  <p id="dashboard_description">Manage your encrypted drops.</p>

  <section id="dashboard_board">
    <div className="dashboard_card">
      <p className="card_label">Total Uploads</p>
      <h2 className="card_number">{count}</h2>
    </div>

  

    <div className="dashboard_card">
      <p className="card_label">Manage Files</p>
      <button onClick={handleViewFiles}className="dashboard_button" >View Files</button>
    </div>
  </section>
  {showFiles && (
  <div id="users_files">
    {files.map((file) => (
      <div key={file.id} className="file_card">
        <h3>{file.filename}</h3>
        <span id="file_size">{(file.file_size / (1024 * 1024)).toFixed(2)} MB</span>
        <p id="uploaded_at">posted on: {new Date(file.uploaded_at).toISOString().slice(0, 19).replace('T', ' ')}</p>
        <p id="file_type">File type:{file. file_type || 'Unknown'}</p>
    

        <button
          onClick={() => handleDeleteFile(file.object_id)}
        >
          Delete
        </button>
      </div>
    ))}
  </div>
)}
</div>
  );
}