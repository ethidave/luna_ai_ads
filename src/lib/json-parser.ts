// JSON Parser Utility for handling API responses safely
export interface JsonParseResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  rawText?: string;
}

export async function safeJsonParse<T = any>(
  response: Response
): Promise<JsonParseResult<T>> {
  try {
    const contentType = response.headers.get('content-type');
    
    // Check if response is JSON
    if (contentType && contentType.includes('application/json')) {
      try {
        const data = await response.json();
        return {
          success: true,
          data,
        };
      } catch (jsonError) {
        console.error("Failed to parse JSON response:", jsonError);
        const text = await response.text();
        console.error("Raw response:", text);
        return {
          success: false,
          error: "Invalid JSON response from server",
          rawText: text,
        };
      }
    } else {
      // If not JSON, get the raw text
      const text = await response.text();
      console.warn("Response is not JSON, content-type:", contentType);
      console.warn("Raw response:", text);
      
      // Try to parse as JSON anyway (in case content-type is wrong)
      try {
        const data = JSON.parse(text);
        return {
          success: true,
          data,
        };
      } catch {
        return {
          success: false,
          error: `Server returned ${response.status}: ${text}`,
          rawText: text,
        };
      }
    }
  } catch (error) {
    console.error("Error in safeJsonParse:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Helper function for common API response handling
export async function handleApiResponse<T = any>(
  response: Response,
  onSuccess?: (data: T) => void,
  onError?: (error: string) => void
): Promise<T | null> {
  const result = await safeJsonParse<T>(response);
  
  if (result.success && result.data) {
    onSuccess?.(result.data);
    return result.data;
  } else {
    const errorMessage = result.error || 'Unknown error occurred';
    onError?.(errorMessage);
    return null;
  }
}

