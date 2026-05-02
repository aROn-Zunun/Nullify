"use client";
import "../styles/dashboard_styles.css";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';


export default function Dashboard() {
  const [count, setCount]=useState(0)
  const [totalStorage, setTotalStorage ]=useState(0)
  const router = useRouter();
  const[files, setFiles]= useState([])
  
  const [showFiles, setShowFiles]= useState(false)

  useEffect(()=> {
    async function fetchUploadCount(){ 
      
      const response= await fetch('/api/dashboard/files')
      const data = await response.json()

      
      setCount(data.files.length)
      setTotalStorage(data.files.reduce((sum, file) => sum + file.file_size, 0))
      setFiles(data.files)
    }
      fetchUploadCount()
    },[])

  async function handleViewFiles() {
  setShowFiles(true)
  setTimeout(() => {
    document.getElementById('users_files')?.scrollIntoView({ behavior: 'smooth' })
  }, 100)
}
  async function handleDeleteFile(objectId) {
    const response = await fetch(`/api/dashboard/files/${objectId}`, { method: 'DELETE' })
  if (!response.ok){
    console.log (data.error)
    return
  }
  const updatedFiles = files.filter(file => file.object_id !== objectId)
    setFiles(updatedFiles)
    setCount(updatedFiles.length) 
    setTotalStorage(updatedFiles.reduce((sum, file) => sum + file.file_size, 0))
}

  
  
  async function deleteAccount(){
    const res= await fetch ('/api/delete_account',{method: 'DELETE'})
    if (res.ok){
      await fetch ('/api/logout',{method: 'GET'})
      window.location.href = '/'
    }
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

    <div className= "dashboard_card">
      <p className="card_label">Storage Used</p>
      <h2 className="card_number">{(totalStorage / (1024 * 1024)).toFixed(2)} MB</h2>
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
        <span id="file_size">size: {(file.file_size / (1024 * 1024)).toFixed(2)} MB</span>
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
  <button onClick={deleteAccount} className="delete_account_btn">Delete Account</button>
</div>
  );
}