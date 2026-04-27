import mysql from 'mysql2/promise'

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
})

await db.query('CREATE DATABASE IF NOT EXISTS ??', [process.env.DB_NAME])

await db.query('USE ??', [process.env.DB_NAME])

// Only create tables if they don't exist
await db.query(`
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT min_username_length CHECK (CHAR_LENGTH(username) >= 5),
    CONSTRAINT email_format CHECK (email REGEXP '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
  )
`)

await db.query(`
  CREATE TABLE IF NOT EXISTS files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    object_id VARCHAR(21) NOT NULL UNIQUE,
    user_id INT,
    filename varchar(255) NOT NULL,
    file_size BIGINT NOT NULL,
    file_type VARCHAR(255) NOT NULL,
    file_modified TIMESTAMP NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`)

console.log('Database initialized successfully')

export default db
