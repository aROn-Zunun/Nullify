import * as Minio from 'minio'
import db from '@/lib/db'

// Create a MinIO client
const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: process.env.MINIO_PORT,
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY
})

if (!(await minioClient.bucketExists('files'))) {
  await minioClient.makeBucket('files', 'us-east-1')
  console.log("Bucket 'files' created")
}

const listener = await minioClient.listenBucketNotification('files', '', '', [
  's3:ObjectRemoved:*'
])

listener.on('notification', async record => {
  await db.query('DELETE FROM files WHERE object_id = ?', [
    record.s3.object.key
  ])
})

await minioClient.setBucketLifecycle('files', {
  Rule: [
    {
      ID: 'delete-old-objects',
      Status: 'Enabled',
      Filter: {
        Prefix: ''
      },
      Expiration: {
        Days: 1 // Automatically delete objects after 1 day
      }
    }
  ]
})

export default minioClient
