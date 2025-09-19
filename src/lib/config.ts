// Application Configuration
const getApiUrl = () => {
  // Check if we're in the browser
  if (typeof window !== 'undefined') {
    // For mobile devices, try to detect the server IP
    const hostname = window.location.hostname;
    
    // If running on localhost or 127.0.0.1, use the same hostname but port 8000
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `http://${hostname}:8000/api`;
    }
    
    // For other domains, use the same domain but port 8000
    return `http://${hostname}:8000/api`;
  }
  
  // Server-side fallback
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
};

const getFrontendUrl = () => {
  // Check if we're in the browser
  if (typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.host}`;
  }
  
  // Server-side fallback
  return process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';
};

export const CONFIG = {
  API_URL: getApiUrl(),
  FRONTEND_URL: getFrontendUrl(),
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'your-secret-key-here',
};

