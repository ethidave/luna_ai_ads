// Application Configuration
export const CONFIG = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'your-secret-key-here',
};

