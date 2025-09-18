// Centralized error handling utilities
export interface ErrorInfo {
  message: string;
  code?: string;
  status?: number;
  details?: any;
  timestamp: string;
  userId?: string;
  action?: string;
}

export class AppError extends Error {
  public code: string;
  public status: number;
  public details: any;
  public timestamp: string;
  public action?: string;

  constructor(
    message: string,
    code: string = 'UNKNOWN_ERROR',
    status: number = 500,
    details: any = null,
    action?: string
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
    this.details = details;
    this.timestamp = new Date().toISOString();
    this.action = action;
  }
}

export const ErrorCodes = {
  // Authentication errors
  AUTH_REQUIRED: 'AUTH_REQUIRED',
  AUTH_INVALID: 'AUTH_INVALID',
  AUTH_EXPIRED: 'AUTH_EXPIRED',
  AUTH_FORBIDDEN: 'AUTH_FORBIDDEN',
  
  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  CONNECTION_ERROR: 'CONNECTION_ERROR',
  
  // API errors
  API_ERROR: 'API_ERROR',
  API_UNAVAILABLE: 'API_UNAVAILABLE',
  API_RATE_LIMITED: 'API_RATE_LIMITED',
  
  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  
  // Business logic errors
  PACKAGE_REQUIRED: 'PACKAGE_REQUIRED',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  OPERATION_FAILED: 'OPERATION_FAILED',
  
  // System errors
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export const ErrorMessages = {
  [ErrorCodes.AUTH_REQUIRED]: 'Please log in to continue',
  [ErrorCodes.AUTH_INVALID]: 'Invalid credentials. Please try again',
  [ErrorCodes.AUTH_EXPIRED]: 'Your session has expired. Please log in again',
  [ErrorCodes.AUTH_FORBIDDEN]: 'You do not have permission to perform this action',
  
  [ErrorCodes.NETWORK_ERROR]: 'Network error. Please check your connection and try again',
  [ErrorCodes.TIMEOUT_ERROR]: 'Request timed out. Please try again',
  [ErrorCodes.CONNECTION_ERROR]: 'Unable to connect to the server. Please try again later',
  
  [ErrorCodes.API_ERROR]: 'Server error occurred. Please try again',
  [ErrorCodes.API_UNAVAILABLE]: 'Service temporarily unavailable. Please try again later',
  [ErrorCodes.API_RATE_LIMITED]: 'Too many requests. Please wait a moment and try again',
  
  [ErrorCodes.VALIDATION_ERROR]: 'Please check your input and try again',
  [ErrorCodes.INVALID_INPUT]: 'Invalid input provided',
  [ErrorCodes.MISSING_REQUIRED_FIELD]: 'Please fill in all required fields',
  
  [ErrorCodes.PACKAGE_REQUIRED]: 'A package subscription is required to access this feature',
  [ErrorCodes.INSUFFICIENT_PERMISSIONS]: 'You do not have sufficient permissions for this action',
  [ErrorCodes.RESOURCE_NOT_FOUND]: 'The requested resource was not found',
  [ErrorCodes.OPERATION_FAILED]: 'Operation failed. Please try again',
  
  [ErrorCodes.UNKNOWN_ERROR]: 'An unexpected error occurred. Please try again',
  [ErrorCodes.INTERNAL_ERROR]: 'Internal server error. Please contact support if this persists',
} as const;

export function createError(
  message: string,
  code: keyof typeof ErrorCodes = 'UNKNOWN_ERROR',
  status: number = 500,
  details: any = null,
  action?: string
): AppError {
  return new AppError(message, code, status, details, action);
}

export function getErrorMessage(error: any): string {
  if (error instanceof AppError) {
    return error.message;
  }
  
  if (error?.code && ErrorMessages[error.code as keyof typeof ErrorMessages]) {
    return ErrorMessages[error.code as keyof typeof ErrorMessages];
  }
  
  if (error?.message) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return ErrorMessages.UNKNOWN_ERROR;
}

export function getErrorCode(error: any): string {
  if (error instanceof AppError) {
    return error.code;
  }
  
  if (error?.code) {
    return error.code;
  }
  
  return ErrorCodes.UNKNOWN_ERROR;
}

export function getErrorStatus(error: any): number {
  if (error instanceof AppError) {
    return error.status;
  }
  
  if (error?.status) {
    return error.status;
  }
  
  return 500;
}

export function isRetryableError(error: any): boolean {
  const code = getErrorCode(error);
  const status = getErrorStatus(error);
  
  return (
    code === ErrorCodes.NETWORK_ERROR ||
    code === ErrorCodes.TIMEOUT_ERROR ||
    code === ErrorCodes.CONNECTION_ERROR ||
    code === ErrorCodes.API_UNAVAILABLE ||
    status >= 500
  );
}

export function shouldShowErrorToUser(error: any): boolean {
  const code = getErrorCode(error);
  
  // Don't show internal errors to users
  if (code === ErrorCodes.INTERNAL_ERROR) {
    return false;
  }
  
  return true;
}

export function logError(error: any, context?: string, userId?: string): void {
  const errorInfo: ErrorInfo = {
    message: getErrorMessage(error),
    code: getErrorCode(error),
    status: getErrorStatus(error),
    details: error?.details || error,
    timestamp: new Date().toISOString(),
    userId,
    action: context,
  };
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error logged:', errorInfo);
  }
  
  // In production, you would send this to your error tracking service
  // Example: Sentry.captureException(error, { extra: errorInfo });
}

export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  context?: string,
  userId?: string
): Promise<{ data: T | null; error: AppError | null }> {
  try {
    const data = await operation();
    return { data, error: null };
  } catch (error) {
    const appError = error instanceof AppError 
      ? error 
      : createError(
          getErrorMessage(error),
          getErrorCode(error),
          getErrorStatus(error),
          error
        );
    
    logError(appError, context, userId);
    return { data: null, error: appError };
  }
}

export function createErrorBoundaryFallback(error: AppError) {
  return {
    title: 'Something went wrong',
    message: shouldShowErrorToUser(error) 
      ? getErrorMessage(error) 
      : 'An unexpected error occurred. Please try again.',
    action: error.action || 'Please try again',
    canRetry: isRetryableError(error),
  };
}
