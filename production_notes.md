# Production Hosting Guide

Since the frontend is on GitHub Pages (static), you must host the backend (the `server/` folder) on a platform that supports Node.js.

## Recommended: Render.com (Free Tier)

1.  **Create a New Web Service**: Link your GitHub repository.
2.  **Root Directory**: Set this to `.` (or keep it default if you link the whole repo).
3.  **Build Command**: `npm install`
4.  **Start Command**: `node server/server.js` (Make sure the path is correct).
5.  **Environment Variables**:
    *   `JWT_SECRET`: (Pick a strong random string)
    *   `PORT`: `10000` (Render's default)
6.  **CORS Setup**: Ensure the server allows requests from your GitHub Pages URL.

## Updating the Frontend

Once your backend is live (e.g., `https://study-tracker-api.onrender.com`), you need to update the frontend to point to it.

1.  In `vite.config.ts`, update the proxy (for local dev).
2.  In your frontend fetch calls (e.g., `src/pages/Login.tsx`), ensure you are using the full URL or an environment variable.

> [!IMPORTANT]
> The current frontend code uses relative paths like `/api/auth/login`. On GitHub Pages, this points to GitHub's servers, which causes the **405 Method Not Allowed** error.
> You must either:
> 1.  Use an absolute URL in your fetch calls (e.g., `https://your-api.com/api/auth/login`).
> 2.  Set up a proxy or use a global config for the API Base URL.

## Example API Base URL Config

```typescript
// src/config.ts
export const API_BASE_URL = import.meta.env.PROD 
  ? 'https://your-api.onrender.com' 
  : '';
```
