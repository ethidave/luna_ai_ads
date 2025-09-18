"use client";

import React, { Component, ReactNode } from "react";
import { AlertCircle, RefreshCw, Home, Bug } from "lucide-react";
import {
  AppError,
  createErrorBoundaryFallback,
  logError,
} from "@/lib/error-handler";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: AppError, errorInfo: React.ErrorInfo) => void;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: AppError | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    const appError =
      error instanceof AppError
        ? error
        : new AppError(
            error.message || "An unexpected error occurred",
            "UNKNOWN_ERROR",
            500,
            error
          );

    return { hasError: true, error: appError };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const appError =
      error instanceof AppError
        ? error
        : new AppError(
            error.message || "An unexpected error occurred",
            "UNKNOWN_ERROR",
            500,
            error
          );

    this.setState({ error: appError, errorInfo });

    // Log the error
    logError(appError, "ErrorBoundary", undefined);

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(appError, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  handleReportBug = () => {
    const error = this.state.error;
    if (error) {
      const bugReport = {
        message: error.message,
        code: error.code,
        status: error.status,
        timestamp: error.timestamp,
        userAgent: navigator.userAgent,
        url: window.location.href,
        stack: error.details?.stack || "No stack trace available",
      };

      // In a real app, you would send this to your bug reporting service
      console.log("Bug report:", bugReport);

      // For now, copy to clipboard
      navigator.clipboard
        .writeText(JSON.stringify(bugReport, null, 2))
        .then(() => alert("Error details copied to clipboard"))
        .catch(() => alert("Failed to copy error details"));
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const error = this.state.error!;
      const fallback = createErrorBoundaryFallback(error);

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
            {/* Error Icon */}
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>

            {/* Error Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {fallback.title}
            </h1>

            {/* Error Message */}
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {fallback.message}
            </p>

            {/* Error Details (Development Only) */}
            {this.props.showDetails &&
              process.env.NODE_ENV === "development" && (
                <div className="mb-8 p-4 bg-gray-100 rounded-lg text-left">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Error Details:
                  </h3>
                  <div className="text-sm text-gray-700 space-y-1">
                    <div>
                      <strong>Code:</strong> {error.code}
                    </div>
                    <div>
                      <strong>Status:</strong> {error.status}
                    </div>
                    <div>
                      <strong>Timestamp:</strong> {error.timestamp}
                    </div>
                    {error.action && (
                      <div>
                        <strong>Action:</strong> {error.action}
                      </div>
                    )}
                  </div>
                  {error.details && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm font-medium text-gray-700">
                        Stack Trace
                      </summary>
                      <pre className="mt-2 text-xs text-gray-600 overflow-auto max-h-32">
                        {JSON.stringify(error.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {fallback.canRetry && (
                <button
                  onClick={this.handleRetry}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Try Again
                </button>
              )}

              <button
                onClick={this.handleGoHome}
                className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-semibold"
              >
                <Home className="w-5 h-5 mr-2" />
                Go Home
              </button>

              <button
                onClick={this.handleReportBug}
                className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-semibold"
              >
                <Bug className="w-5 h-5 mr-2" />
                Report Bug
              </button>
            </div>

            {/* Additional Help */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                If this problem persists, please contact our support team with
                the error details above.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for functional components to handle errors
export function useErrorHandler() {
  const handleError = React.useCallback((error: any, context?: string) => {
    const appError =
      error instanceof AppError
        ? error
        : new AppError(
            error?.message || "An unexpected error occurred",
            error?.code || "UNKNOWN_ERROR",
            error?.status || 500,
            error
          );

    logError(appError, context);
    return appError;
  }, []);

  return { handleError };
}

// Higher-order component for error handling
export function withErrorHandling<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Partial<Props>
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
