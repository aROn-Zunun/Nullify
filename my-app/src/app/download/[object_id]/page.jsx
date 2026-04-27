'use client'

import '@/app/styles/download_styles.css'
import { useState } from 'react'
import { useEffect } from 'react'
import { showToast } from 'nextjs-toast-notify'

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

export default function DownloadPage () {
  const [file_info, setFileInfo] = useState(null)

  const getFileInfo = async () => {
    const object_id = window.location.pathname.split('/').pop()
    try {
      const response = await fetch(`/api/files/${object_id}/info`)
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

  const downloadFile = async e => {
    e.preventDefault()

    const encryptionKey = window.location.hash.substring(1)

    const object_id = window.location.pathname.split('/').pop()
    try {
      const response = await fetch(`/api/files/${object_id}`)

      if (response.ok) {
        const encBlob = await response.blob()
        const decryptedFile = await DecryptFile(encBlob, encryptionKey)

        downloadBlob(decryptedFile, getFilename(response)) // Use original filename for download
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
    getFileInfo().then(info => setFileInfo(info))
  }, [])

  return (
    <main id='download_page'>
      <div id='download_container'>
        <section id='download_info'>
          {file_info ? (
            <>
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
            </>
          ) : (
            <p id='loading_message'>Loading file information...</p>
          )}
        </section>

        <button id='download_button' onClick={downloadFile}>
          Download File
        </button>
      </div>
  </main>
  )
}
