// API Utility Functions
export const getApiUrl = (endpoint: string = '') => {
  // Check if we're in the browser
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    
    // For mobile devices, use the same hostname but port 8000
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `${protocol}//${hostname}:8000/api${endpoint}`;
    }
    
    // For other domains, use the same domain but port 8000
    return `${protocol}//${hostname}:8000/api${endpoint}`;
  }
  
  // Server-side fallback
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  return `${baseUrl}${endpoint}`;
};

// Helper function to check if backend is running
export const checkBackendStatus = async (): Promise<{ isRunning: boolean; error?: string }> => {
  try {
    const response = await fetch(getApiUrl('/health'), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(5000)
    });
    
    return { isRunning: response.ok };
  } catch (error) {
    return { 
      isRunning: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Helper function to get the full API URL for a specific endpoint
export const apiUrl = (endpoint: string) => getApiUrl(endpoint);
