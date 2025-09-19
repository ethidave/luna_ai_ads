// Application Configuration
const getApiUrl = () => {
  // Check if we're in the browser
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // If running on localhost or 127.0.0.1, use local development API
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `http://${hostname}:8000/api`;
    }
    
    // For production domains, use the production API URL
    return 'https://api.lunaais.com/api';
  }
  
  // Server-side fallback - use production API URL
  return process.env.NEXT_PUBLIC_API_URL || 'https://api.lunaais.com/api';
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

