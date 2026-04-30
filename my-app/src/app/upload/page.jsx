"use client";
import "@/app/styles/upload_styles.css";
import { useState } from 'react'
import { useEffect } from 'react'
import { showToast } from 'nextjs-toast-notify'
import * as bcrypt from 'bcryptjs'

async function EncryptFile (file) {
  const reader = new FileReader()

  return new Promise((resolve, reject) => {
    reader.onload = async function (event) {
      const fileData = event.target.result

      const key = await window.crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt']
      )

      //nonce 
      const iv = window.crypto.getRandomValues(new Uint8Array(12))

      const ciphertext = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        fileData
      )

      
      const encryption_key = await window.crypto.subtle.exportKey('raw', key)
      const enc_key_hex = Array.from(new Uint8Array(encryption_key))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')

      const data = new Blob([iv, new Uint8Array(ciphertext)])

      //hashing the enc_key_hex
      const hashed_key= await window.crypto.subtle.digest('SHA-256',encryption_key)
      // convert the return array elements into hex
      const hash_key_hex= Array.from(new Uint8Array(hashed_key))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')


      resolve({
        file: data,
        key: enc_key_hex,
        key_hashed: hash_key_hex
      })
    }

    reader.onerror = function (error) {
      reject(error)
    }

    reader.readAsArrayBuffer(file)
  })
}

export default function Create() {
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState(null)
  const [progressMsg, setProgressMsg] = useState(null)
  const [downloadUrl, setDownloadUrl] = useState(null)

  const uploadFile = async () => {
    if (file) {
      const formData = new FormData()

      setProgressMsg('Encrypting file...')

      const encrypted = await EncryptFile(file)

      formData.append('filename', file.name)
      formData.append('file_size', file.size)
      formData.append('file_type', file.type)
      formData.append('file_modified', new Date(file.lastModified).toISOString().slice(0, 19).replace('T', ' '))
      formData.append('file', encrypted.file)
      formData.append('key_hash',encrypted.key_hashed)

      setProgressMsg('Uploading file...')

      const response = await fetch('/api/files', {
        method: 'POST',
        body: formData
      })
      if (response.ok) {
        const data = await response.json()

        showToast.success('File uploaded successfully!')

        setDownloadUrl(
          `${window.location.origin}/download/${data.object_id}#${encrypted.key}`
        ) // Store the download URL for later use
      } else {
        const data = await response.json()
        showToast.error(`File upload failed: ${data.error}`)
      }

      setProgressMsg(null)
      setFile(null) // Clear the selected file
    }
  };

  const handleDrag = e => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = e => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const droppedFiles = e.dataTransfer.files
    if (droppedFiles) {
      setFile(droppedFiles[0])
      console.log(droppedFiles[0])
    }
  }

  const handleChange = e => {
    const selectedFiles = e.target.files
    if (selectedFiles) {
      setFile(selectedFiles[0])
    }
  }

  return (
    <main id="create_drop_page">
      <div id="create_drop_container"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}>
        <h1 id="create_drop_title">{file ? "File Info" : "Create Drop"}</h1>
        <p id="create_drop_text">
          {file ? "Click Upload to encrypt and share this file." : "Upload a file to create a secure drop."}
        </p>

        <div id="create_drop_form">
          {
            file ? (
              <>
                <div id="file_info">
                  <ul>
                    <li>
                      <strong>Name:</strong> <span id="file_name">{file.name}</span>
                    </li>
                    <li>
                      <strong>Size:</strong> <span id="file_size">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                    </li>
                    <li>
                      <strong>Type:</strong> <span id="file_type">{file.type || 'Unknown'}</span>
                    </li>
                    <li>
                      <strong>Last Modified:</strong> <span id="file_last_modified">{new Date(file.lastModified).toLocaleString()}</span>
                    </li>
                  </ul>
                </div>
                <div id="file_actions">
                  <button type="button" id="upload_button" onClick={() => uploadFile()}>
                    Upload File
                  </button>
                  <button type="button" id="cancel_button" onClick={() => setFile(null)}>
                    Cancel
                  </button>
                </div>
              </>
             ) : (
                <label className={dragActive ? 'drop_zone drag_active' : 'drop_zone'}>
                  <p>Drag and drop a file here</p>
                  <p>or</p>
                  <span id="choose_file_text">
                    Choose a file
                    <input
                      type="file"
                      style={{ display: "none" }}
                      onChange={handleChange}
                  />
                </span>
              </label>
            )
          }
        </div>
      </div>

      {progressMsg && (
        <div id="loading_overlay">
          <div id="loading_widget">
            <div id="spinner"></div>
            <p id="loading_text">{progressMsg}</p>
          </div>
        </div>
      )}

      {downloadUrl && (
        <div id="download_overlay">
          <div id="download_widget">
            <h2 id="download_title">✓ File Uploaded Successfully!</h2>
            <p id="download_subtitle">Share this link with others:</p>
            <div id="download_link_container">
              <input
                type="text"
                id="download_link_input"
                value={downloadUrl}
                readOnly
              />
              <button
                type="button"
                id="copy_button"
                onClick={() => {
                  navigator.clipboard.writeText(downloadUrl)
                  showToast.success('Link copied to clipboard!')
                }}
              >
                Copy Link
              </button>
            </div>
            <button
              type="button"
              id="close_download_button"
              onClick={() => setDownloadUrl(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}