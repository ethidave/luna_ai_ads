import { NextRequest, NextResponse } from 'next/server';

export interface ApiError {
  message: string;
  statusCode: number;
  code?: string;
  details?: any;
}

export class ApiErrorHandler {
  static handle(error: any): NextResponse {
    console.error('API Error:', error);

    // Database connection errors
    if (error.code === 'ECONNREFUSED') {
      return NextResponse.json({
        success: false,
        error: 'Database connection failed',
        message: 'Unable to connect to the database. Please check if MySQL is running.',
        code: 'DB_CONNECTION_ERROR',
        statusCode: 503
      }, { status: 503 });
    }

    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      return NextResponse.json({
        success: false,
        error: 'Database authentication failed',
        message: 'Invalid database credentials. Please check your database configuration.',
        code: 'DB_AUTH_ERROR',
        statusCode: 503
      }, { status: 503 });
    }

    if (error.code === 'ER_BAD_DB_ERROR') {
      return NextResponse.json({
        success: false,
        error: 'Database not found',
        message: 'The specified database does not exist. Please create it first.',
        code: 'DB_NOT_FOUND',
        statusCode: 503
      }, { status: 503 });
    }

    // TypeORM errors
    if (error.name === 'QueryFailedError') {
      return NextResponse.json({
        success: false,
        error: 'Database query failed',
        message: 'A database operation failed. Please try again.',
        code: 'DB_QUERY_ERROR',
        statusCode: 500,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }, { status: 500 });
    }

    if (error.name === 'EntityNotFoundError') {
      return NextResponse.json({
        success: false,
        error: 'Resource not found',
        message: 'The requested resource was not found.',
        code: 'RESOURCE_NOT_FOUND',
        statusCode: 404
      }, { status: 404 });
    }

    // Validation errors
    if (error.name === 'ValidationError') {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        message: 'The provided data is invalid.',
        code: 'VALIDATION_ERROR',
        statusCode: 400,
        details: error.details || error.message
      }, { status: 400 });
    }

    // Authentication errors
    if (error.message?.includes('Unauthorized') || error.statusCode === 401) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
        message: 'You must be logged in to access this resource.',
        code: 'UNAUTHORIZED',
        statusCode: 401
      }, { status: 401 });
    }

    // Rate limiting errors
    if (error.statusCode === 429) {
      return NextResponse.json({
        success: false,
        error: 'Rate limit exceeded',
        message: 'Too many requests. Please try again later.',
        code: 'RATE_LIMIT_EXCEEDED',
        statusCode: 429
      }, { status: 429 });
    }

    // AI service errors
    if (error.message?.includes('GEMINI') || error.message?.includes('AI')) {
      return NextResponse.json({
        success: false,
        error: 'AI service error',
        message: 'The AI service is temporarily unavailable. Please try again later.',
        code: 'AI_SERVICE_ERROR',
        statusCode: 503
      }, { status: 503 });
    }

    // Generic server error
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'An unexpected error occurred. Please try again later.',
      code: 'INTERNAL_ERROR',
      statusCode: 500,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }

  static async withErrorHandling(
    handler: (request: NextRequest) => Promise<NextResponse>
  ) {
    return async (request: NextRequest): Promise<NextResponse> => {
      try {
        return await handler(request);
      } catch (error) {
        return this.handle(error);
      }
    };
  }
}

// Utility function for API routes
export function withApiErrorHandling(handler: (request: NextRequest) => Promise<NextResponse>) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      return await handler(request);
    } catch (error) {
      return ApiErrorHandler.handle(error);
    }
  };
}
