# Nullify

## Description

Nullify is a secure file hosting platform that implements a zero-knowledge encryption model. This ensures user privacy and security by encrypting files directly in the browser before uploading them to the server. Encryption is performed using AES-GCM through the WebCrypto API, and decryption occurs client-side after downloading the encrypted file.

With zero-knowledge encryption, users can verify the security themselves by inspecting network packets to confirm that only encrypted data is sent to the server. In the event of a data breach, files remain safe as the server never has access to the decryption keys.

## Prerequisites

Before running the project, ensure you have the following installed:

- [Docker](https://docs.docker.com/get-docker/)
- [Node.js](https://nodejs.org/) (which includes npm)
- [Next.js](https://nextjs.org/) (install globally via npm: `npm install -g next`)

## Installation and Setup

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd Nullify
   ```

2. **Start the services using Docker Compose:**
   ```
   docker-compose up -d
   ```
   This will start the MySQL database and MinIO object storage services.

3. **Configure environment variables:**
   - Copy the example environment file:
     ```
     cp example_env.local .env.local
     ```
   - Edit `.env.local` and set the appropriate values for your setup. The file should include:
     ```
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD='[your password here]'
     DB_NAME=nullify_db
     DB_PORT=3306

     MINIO_ENDPOINT=localhost
     MINIO_PORT=9000
     MINIO_ACCESS_KEY=admin
     MINIO_SECRET_KEY=password123

     JWT_SECRET=your_jwt_secret_key
     JWT_EXPIRES_IN=1H
     ```

4. **Navigate to the Next.js application directory:**
   ```
   cd my-app
   ```

5. **Install dependencies:**
   ```
   npm install
   ```

6. **Run the Next.js application:**
   ```
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

## Usage

- Register an account or log in.
- Upload files, which will be encrypted in your browser before sending to the server.
- Download and decrypt files securely on your device.

## Additional Notes

- Ensure Docker services are running before starting the Next.js app.
- For production deployment, consider securing your environment variables and database configurations.
- The default root password for the provided docker compose file is: `rootpassword`
