// API Utility Functions
export const getApiUrl = (endpoint: string = '') => {
  // Check if we're in the browser
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // For local development (localhost)
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `http://${hostname}:8000/api${endpoint}`;
    }
    
    // For production, use the production API URL
    return `https://api.lunaais.com/api${endpoint}`;
  }
  
  // Server-side fallback - use production API URL
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.lunaais.com/api';
  return `${baseUrl}${endpoint}`;
};

// CSRF token management
let csrfToken: string | null = null;

// Function to get CSRF token from the server
export const getCsrfToken = async (): Promise<string | null> => {
  try {
    const response = await fetch(getApiUrl('/csrf-token'), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for CSRF token
    });
    
    if (response.ok) {
      const data = await response.json();
      csrfToken = data.csrf_token || data.csrfToken || data.token;
      return csrfToken;
    }
  } catch (error) {
    console.warn('Failed to get CSRF token:', error);
  }
  
  return null;
};

// Function to get CSRF token from meta tag (fallback)
export const getCsrfTokenFromMeta = (): string | null => {
  if (typeof document !== 'undefined') {
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    return metaTag ? metaTag.getAttribute('content') : null;
  }
  return null;
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

// Helper function to get headers with CSRF token
export const getHeadersWithCsrf = async (): Promise<HeadersInit> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  };

  if (typeof window !== 'undefined') {
    // Try to get CSRF token from meta tag first
    const metaToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (metaToken) {
      headers['X-CSRF-TOKEN'] = metaToken;
    } else {
      // Try to get CSRF token from API
      const csrfToken = await getCsrfToken();
      if (csrfToken) {
        headers['X-CSRF-TOKEN'] = csrfToken;
      }
    }
  }

  return headers;
};

// Helper function to make API requests with CSRF token
export const apiRequest = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
  const url = getApiUrl(endpoint);
  const headers = await getHeadersWithCsrf();
  
  return fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });
};
