'use client'

import '@/app/styles/download_styles.css'
import { useState } from 'react'
import { useEffect } from 'react'
import { showToast } from 'nextjs-toast-notify'
import NotFound from '@/app/not-found'
import Loading from '@/components/Loading/Loading'

async function importHexKey (hexString, algorithm = 'AES-GCM') {
  const keyData = Uint8Array.fromHex(hexString)

  return await crypto.subtle.importKey(
    'raw', // Format of the key data
    keyData, // Uint8Array derived from hex
    algorithm, // e.g., "AES-GCM" or "HMAC"
    true, // Whether the key is extractable
    ['decrypt'] // Intended usages
  )
}

async function DecryptFile (encBlob, keyHex) {
  const reader = new FileReader()

  return new Promise((resolve, reject) => {
    reader.onload = async function (event) {
      const fileData = event.target.result

      const key = await importHexKey(keyHex)

      const iv = new Uint8Array(fileData.slice(0, 12))
      const ciphertext = new Uint8Array(fileData.slice(12))

      try {
        const decryptedData = await window.crypto.subtle.decrypt(
          { name: 'AES-GCM', iv: iv },
          key,
          ciphertext
        )

        resolve(new Blob([decryptedData]))
      } catch (e) {
        reject('Failed to decrypt file')
      }
    }

    reader.onerror = function (error) {
      return reject(error)
    }

    reader.readAsArrayBuffer(encBlob)
  })
}

function downloadBlob (blob, filename) {
  // 1. Create a URL for the blob object
  const url = window.URL.createObjectURL(blob)

  // 2. Create a temporary anchor element
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename) // Set the filename
  document.body.appendChild(link) // Required for Firefox

  // 3. Trigger the download by clicking the link
  link.click()

  // 4. Cleanup: remove the element and revoke the URL to free memory
  link.parentNode.removeChild(link)
  window.URL.revokeObjectURL(url)
}

function getFilename (response) {
  const disposition = response.headers.get('Content-Disposition')
  let filename = 'downloaded_file'

  if (disposition && disposition.includes('filename=')) {
    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
    const matches = filenameRegex.exec(disposition)
    if (matches != null && matches[1]) {
      filename = matches[1].replace(/['"]/g, '')
    }
  }

  return filename
}
async function getKeyHash(decryption_key_hex){
  const decryption_key_raw= new Uint8Array(
  decryption_key_hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16))
  )
  const hash = await window.crypto.subtle.digest('SHA-256', decryption_key_raw)
  return Array.from(new Uint8Array(hash))
  .map(b => b.toString(16).padStart(2, '0'))
  .join('')
}

export default function DownloadPage () {
  const [file_info, setFileInfo] = useState(null)
  const [encryptionKey, setEncryptionKey] = useState('')
  const [showKeyModal, setShowKeyModal] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [keyInput, setKeyInput] = useState('')
  const [loading, setLoading] = useState(true)

  const getFileInfo = async (keyHash) => {
    const object_id = window.location.pathname.split('/').pop()
    try {
      const response = await fetch(`/api/files/${object_id}/info`,
      {headers:{'x-key-hash': keyHash}})
      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        const data = await response.json()
        showToast.error(`Failed to fetch file info: ${data.error}`)
        return null
      }
    } catch (error) {
      console.error('Error fetching file info:', error)
      showToast.error('An error occurred while fetching the file info.')
      return null
    }
  }

  const handleKeySubmit = async (e) => {
    e.preventDefault()
    if (keyInput.trim() === '') {
      showToast.error('Please enter a decryption key')
      return
    }
    const keyHash=await getKeyHash(keyInput)
    const info = await getFileInfo(keyHash)
    if (!info){
      showToast.error('Invalid decryption key')
      return
    }
    setFileInfo(info)
    setEncryptionKey(keyInput)
    setShowKeyModal(false)
  }

  const downloadFile = async e => {
    e.preventDefault()

    if (!encryptionKey) {
      showToast.error('Decryption key is required')
      return
    }

    const object_id = window.location.pathname.split('/').pop()
    try {
      const keyHash=await getKeyHash(encryptionKey)
      const response = await fetch(`/api/files/${object_id}`, { headers: { 'x-key-hash': keyHash }})

      if (response.ok) {
        const encBlob = await response.blob()
        const decryptedFile = await DecryptFile(encBlob, encryptionKey)

        downloadBlob(decryptedFile, getFilename(response)) // Use original filename for download
        showToast.success("File Downloaded successfullu!")
        setTimeout(()=>{
          window.location.href='/dashboard'
        },2000)
      } else {
        const data = await response.json()
        showToast.error(`Failed to fetch file: ${data.error}`)
      }
    } catch (error) {
      console.error('Error fetching file:', error)
      showToast.error('An error occurred while fetching the file.')
    }
  }

  useEffect(() => {
  const urlKey = window.location.hash.substring(1)
  if (urlKey) {
    getKeyHash(urlKey).then (keyHash=>{
      getFileInfo(keyHash).then(info=>{
        if(info){
          setEncryptionKey(urlKey)
          setFileInfo(info)
        }else {
          showToast.error ('Invlaid decrption key')
          setShowKeyModal(true)
        }
        setLoading(false)
      }
      )
    })
  } else {
    setShowKeyModal(true)
    setLoading(false)
  }

}, [])

  if (loading) return <Loading/>
  if (!file_info && !showKeyModal) return <NotFound/>
  return (
    <main id='download_page'>
      {/* Key Modal */}
      {showKeyModal && (
        <div id='key_modal_overlay'>
          <div id='key_modal'>
            <h2>Enter Decryption Key</h2>
            <p>This file requires a decryption key to download. Please enter the key provided to you.</p>
            <form onSubmit={handleKeySubmit}>
              <input
                type='password'
                placeholder='Enter decryption key (hex format)'
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                id='key_input'
              />
              <button type='submit' className='btn-primary'>Unlock</button>
            </form>
          </div>
        </div>
      )}

       {file_info && <div id='download_container'>
        <section id='download_info'>
          <h1 id='download_filename'>{file_info.filename}</h1>
          <div id='download_details'>
            <p>
              <strong>Size:</strong>{' '}
              {(file_info.file_size / (1024 * 1024)).toFixed(2)} MB
            </p>
            <p>
              <strong>Type:</strong> {file_info.file_type}
            </p>
            <p>
              <strong>Uploaded:</strong>{' '}
              {new Date(file_info.uploaded_at).toUTCString()}
            </p>
            <p>
              <strong>Modified:</strong>{' '}
              {new Date(file_info.file_modified).toUTCString()}
            </p>
          </div>
        </section>

        <button id='download_button' onClick={downloadFile}>
          Download File
        </button>
     
      </div>}
    </main>
  )
}