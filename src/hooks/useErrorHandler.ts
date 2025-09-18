import React, { useState, useCallback, useRef } from 'react';
import { AppError, createError, getErrorMessage, getErrorCode, getErrorStatus, logError, withErrorHandling } from '@/lib/error-handler';

interface UseErrorHandlerOptions {
  onError?: (error: AppError) => void;
  onRetry?: () => void;
  context?: string;
  userId?: string;
}

interface UseErrorHandlerReturn {
  error: AppError | null;
  isLoading: boolean;
  isRetrying: boolean;
  handleError: (error: any) => AppError;
  clearError: () => void;
  executeWithErrorHandling: <T>(operation: () => Promise<T>) => Promise<{ data: T | null; error: AppError | null }>;
  retry: () => void;
}

export function useErrorHandler(options: UseErrorHandlerOptions = {}): UseErrorHandlerReturn {
  const [error, setError] = useState<AppError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const retryRef = useRef<(() => void) | null>(null);

  const handleError = useCallback((error: any): AppError => {
    let appError: AppError;
    
    if (error instanceof AppError) {
      appError = error;
    } else {
      // Ensure we have a valid error message
      const message = getErrorMessage(error) || 'An unexpected error occurred';
      const code = getErrorCode(error);
      const status = getErrorStatus(error);
      
      appError = createError(
        message,
        code,
        status,
        error,
        options.context
      );
    }
    
    setError(appError);
    logError(appError, options.context, options.userId);
    
    if (options.onError) {
      options.onError(appError);
    }
    
    return appError;
  }, [options]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const executeWithErrorHandling = useCallback(async <T>(
    operation: () => Promise<T>
  ): Promise<{ data: T | null; error: AppError | null }> => {
    setIsLoading(true);
    clearError();
    
    // Store the operation for retry
    retryRef.current = () => executeWithErrorHandling(operation);
    
    const result = await withErrorHandling(operation, options.context, options.userId);
    
    if (result.error) {
      setError(result.error);
    }
    
    setIsLoading(false);
    return result;
  }, [options.context, options.userId, clearError]);

  const retry = useCallback(() => {
    if (retryRef.current) {
      setIsRetrying(true);
      retryRef.current().finally(() => {
        setIsRetrying(false);
      });
      
      if (options.onRetry) {
        options.onRetry();
      }
    }
  }, [options.onRetry]);

  return {
    error,
    isLoading,
    isRetrying,
    handleError,
    clearError,
    executeWithErrorHandling,
    retry,
  };
}

// Hook for async operations with error handling
export function useAsyncOperation<T>(
  operation: () => Promise<T>,
  options: UseErrorHandlerOptions & {
    immediate?: boolean;
    dependencies?: any[];
  } = {}
) {
  const { executeWithErrorHandling, ...errorHandler } = useErrorHandler(options);
  const [data, setData] = useState<T | null>(null);
  const [hasExecuted, setHasExecuted] = useState(false);

  const execute = useCallback(async () => {
    const result = await executeWithErrorHandling(operation);
    if (result.data) {
      setData(result.data);
    }
    setHasExecuted(true);
    return result;
  }, [operation, executeWithErrorHandling]);

  // Execute immediately if requested
  React.useEffect(() => {
    if (options.immediate && !hasExecuted) {
      execute();
    }
  }, [execute, options.immediate, hasExecuted]);

  // Re-execute when dependencies change
  React.useEffect(() => {
    if (options.dependencies && hasExecuted) {
      execute();
    }
  }, options.dependencies || []);

  return {
    ...errorHandler,
    data,
    execute,
    hasExecuted,
  };
}

// Hook for form validation errors
export function useFormErrorHandler() {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const setFieldError = useCallback((field: string, message: string) => {
    setFieldErrors(prev => ({ ...prev, [field]: message }));
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setFieldErrors(prev => {
      const { [field]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setFieldErrors({});
    setGeneralError(null);
  }, []);

  const setGeneralErrorMessage = useCallback((message: string) => {
    setGeneralError(message);
  }, []);

  const hasErrors = Object.keys(fieldErrors).length > 0 || generalError !== null;

  return {
    fieldErrors,
    generalError,
    setFieldError,
    clearFieldError,
    clearAllErrors,
    setGeneralError: setGeneralErrorMessage,
    hasErrors,
  };
}

// Hook for API calls with error handling
export function useApiCall<T>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseErrorHandlerOptions = {}
) {
  const { executeWithErrorHandling, ...errorHandler } = useErrorHandler(options);

  const call = useCallback(async (...args: any[]) => {
    return executeWithErrorHandling(() => apiFunction(...args));
  }, [apiFunction, executeWithErrorHandling]);

  return {
    ...errorHandler,
    call,
  };
}
