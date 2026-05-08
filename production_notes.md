# Production Hosting Guide

The application is structured as a Vite frontend and a Node.js backend.

## 1. Backend Hosting (Render.com)

1.  **Web Service Setup**: Link your repo.
2.  **Root Directory**: Set to `server` (if deploying just the backend) or `.` (if using the root `npm start`).
3.  **Build Command**: `npm install`
4.  **Start Command**: `node server.js` (if Root Directory is `server`) or `node server/server.js` (if Root Directory is `.`).
5.  **Environment Variables (CRITICAL)**:
    *   `MONGODB_URI`: `mongodb+srv://saurabhy4959:Rajesh%40241006@cluster0...`
        > [!IMPORTANT]
        > **Note the `%40`** instead of `@` in the password. Without this, Render will fail to connect.
    *   `JWT_SECRET`: `neural_secret_key_2026` (or your preferred secret)
    *   `PORT`: `5000` (or leave empty, Render assigns one)

## 2. Frontend Hosting (GitHub Pages / Vercel)

The frontend is already configured to use the correct API URL in `src/config.ts`.

1.  **Check `src/config.ts`**:
    ```typescript
    export const API_BASE_URL = import.meta.env.PROD 
      ? 'https://study-tracker-56a2.onrender.com' 
      : 'http://localhost:5000';
    ```
2.  **Verify Production URL**: Ensure the Render URL above matches your actual live service URL.

## 3. Database Security (MongoDB Atlas)

> [!CAUTION]
> **IP Access**: In MongoDB Atlas, go to **Network Access** and ensure that you have whitelisted either:
> 1.  `0.0.0.0/0` (Allow access from anywhere - recommended for Render as their IPs change).
> 2.  The specific Outbound IPs provided by your hosting platform.
