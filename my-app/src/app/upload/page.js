'use client'

import '@/app/styles/upload_styles.css'
import { useState } from 'react'
import { useEffect } from 'react'
import { showToast } from 'nextjs-toast-notify'

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

      resolve({
        file: data,
        key: enc_key_hex
      })
    }

    reader.onerror = function (error) {
      reject(error)
    }

    reader.readAsArrayBuffer(file)
  })
}

export default function UploadPage () {
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState(null)
  const [downloadUrl, setDownloadUrl] = useState(null)
  const [progressMsg, setProgressMsg] = useState(null)

  useEffect(() => {
    const uploadFiles = async () => {
      if (file) {
        const formData = new FormData()

        setProgressMsg('Encrypting file...')

        const encrypted = await EncryptFile(file)

        formData.append('filename', file.name)
        formData.append('file', encrypted.file)

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
    }

    uploadFiles()
  }, [file])

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
    }
  }

  const handleChange = e => {
    const selectedFiles = e.target.files
    if (selectedFiles) {
      setFile(selectedFiles[0])
    }
  }

  return (
    <div className='upload_container'>
      {progressMsg ? (
        <p className='progress_msg'>{progressMsg}</p>
      ) : (
        <>
          <h1>Upload Files</h1>

          <div
            className={`drop-zone ${dragActive ? 'active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <p>Drag and drop files here</p>
            <input
              type='file'
              multiple
              onChange={handleChange}
              className='file-input'
            />
          </div>
          {file && (
            <div className='file-list'>
              <h2>Selected File:</h2>
              <ul>
                <li>{file.name}</li>
              </ul>
            </div>
          )}
          {downloadUrl && (
            <div className='download-url'>
              <h2>Download URL:</h2>
              <p>{downloadUrl}</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
