/**
 * SYSTEM HUB - UNIVERSAL API CONFIGURATION
 * 
 * This file centralizes the API communication layer.
 * In development, it targets localhost:5000.
 * In production, it targets the hosted backend URL.
 */

export const API_BASE_URL = import.meta.env.PROD 
  ? 'https://study-tracker-56a2.onrender.com' 
  : 'http://localhost:5000';

// Optional: Add a helper for cleaner fetch calls
export const getApiUrl = (path: string) => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
};
