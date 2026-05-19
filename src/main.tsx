import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { AppProvider } from './context/AppContext'
import { GoogleOAuthProvider } from '@react-oauth/google'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '238388973814-72776kvvco1uqts1fhof9q68p9a13l73.apps.googleusercontent.com';
console.log("Loaded Google Client ID:", GOOGLE_CLIENT_ID ? "YES (Found)" : "NO (Empty)");

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AppProvider>
        <App />
      </AppProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
)
