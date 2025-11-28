# Rawdati Vids

A full-stack video upload application featuring a React frontend and a Node.js/GraphQL backend. This project handles video uploads by streaming them directly to BunnyCDN.

## 🚀 Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **API:** GraphQL (Apollo Server)
- **Database:** MongoDB (Mongoose)
- **File Handling:** `graphql-upload-minimal`, `multer`
- **External Service:** BunnyCDN (Video Storage)

### Frontend (`/client`)
- **Framework:** React
- **Build Tool:** Vite
- **Language:** TypeScript
- **GraphQL Client:** Apollo Client (`apollo-upload-client`)

## 📋 Prerequisites

- Node.js (v18+ recommended)
- MongoDB instance (local or Atlas)
- BunnyCDN Account & API Key

## 🛠️ Installation & Setup

### 1. Backend Setup

1.  Clone the repository.
2.  Install backend dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the root directory (refer to your project configuration for required variables, e.g., `PORT`, `MONGODB_URI`, `BUNNY_API_KEY`).
4.  Start the backend server:
    ```bash
    npm start
    ```
    The server will start on `http://localhost:3000` (or your configured PORT).

### 2. Frontend Setup

1.  Navigate to the client directory:
    ```bash
    cd client
    ```
2.  Install frontend dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    The frontend will typically run on `http://localhost:5173`.

## 📂 Project Structure

```
rawdati_vids/
├── client/                 # React Frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── models/                 # Mongoose Models (User, Video)
├── index.js                # Express & Apollo Server Entry Point
├── resolvers.js            # GraphQL Resolvers
├── typeDefs.js             # GraphQL Type Definitions
├── UPLOAD_PROCESS.md       # Documentation on the upload flow
└── package.json            # Backend dependencies
```

## 📹 Video Upload Process

This project uses a specialized flow for uploading videos to ensure efficiency. Instead of saving large files to the server's disk, videos are streamed directly from the client to BunnyCDN through the server.

For a detailed explanation of the upload flow, please refer to [UPLOAD_PROCESS.md](./UPLOAD_PROCESS.md).

## 📝 Scripts

- **Backend:**
    - `npm start`: Runs the server (`node index.js`).
- **Frontend (`/client`):**
    - `npm run dev`: Starts the Vite development server.
    - `npm run build`: Builds the frontend for production.
    - `npm run lint`: Runs ESLint.
