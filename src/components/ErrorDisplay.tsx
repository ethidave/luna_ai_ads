"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  X,
  RefreshCw,
  AlertTriangle,
  Info,
  CheckCircle,
  Bug,
  ExternalLink,
} from "lucide-react";
import {
  AppError,
  getErrorMessage,
  getErrorCode,
  isRetryableError,
} from "@/lib/error-handler";

interface ErrorDisplayProps {
  error: AppError | string | null;
  onDismiss?: () => void;
  onRetry?: () => void;
  variant?: "error" | "warning" | "info" | "success";
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  showDismiss?: boolean;
  showRetry?: boolean;
  className?: string;
  title?: string;
  action?: string;
}

const variantStyles = {
  error: {
    container: "bg-red-50 border-red-200 text-red-800",
    icon: "text-red-400",
    iconBg: "bg-red-100",
    button: "bg-red-600 hover:bg-red-700 text-white",
  },
  warning: {
    container: "bg-yellow-50 border-yellow-200 text-yellow-800",
    icon: "text-yellow-400",
    iconBg: "bg-yellow-100",
    button: "bg-yellow-600 hover:bg-yellow-700 text-white",
  },
  info: {
    container: "bg-blue-50 border-blue-200 text-blue-800",
    icon: "text-blue-400",
    iconBg: "bg-blue-100",
    button: "bg-blue-600 hover:bg-blue-700 text-white",
  },
  success: {
    container: "bg-green-50 border-green-200 text-green-800",
    icon: "text-green-400",
    iconBg: "bg-green-100",
    button: "bg-green-600 hover:bg-green-700 text-white",
  },
};

const sizeStyles = {
  sm: {
    container: "p-3 text-sm",
    icon: "w-4 h-4",
    title: "text-sm font-medium",
    message: "text-xs",
  },
  md: {
    container: "p-4 text-base",
    icon: "w-5 h-5",
    title: "text-base font-medium",
    message: "text-sm",
  },
  lg: {
    container: "p-6 text-lg",
    icon: "w-6 h-6",
    title: "text-lg font-semibold",
    message: "text-base",
  },
};

const getIcon = (variant: string) => {
  switch (variant) {
    case "error":
      return AlertCircle;
    case "warning":
      return AlertTriangle;
    case "info":
      return Info;
    case "success":
      return CheckCircle;
    default:
      return AlertCircle;
  }
};

export function ErrorDisplay({
  error,
  onDismiss,
  onRetry,
  variant = "error",
  size = "md",
  showIcon = true,
  showDismiss = true,
  showRetry = true,
  className = "",
  title,
  action,
}: ErrorDisplayProps) {
  if (!error) return null;

  const errorMessage =
    typeof error === "string" ? error : getErrorMessage(error);
  const errorCode = typeof error === "string" ? null : getErrorCode(error);
  const canRetry = typeof error === "string" ? false : isRetryableError(error);

  const styles = variantStyles[variant];
  const sizeConfig = sizeStyles[size];
  const Icon = getIcon(variant);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className={`
          ${styles.container}
          ${sizeConfig.container}
          border rounded-lg
          ${className}
        `}
      >
        <div className="flex items-start">
          {showIcon && (
            <div
              className={`flex-shrink-0 ${sizeConfig.icon} ${styles.iconBg} rounded-full p-1 mr-3`}
            >
              <Icon className={`${sizeConfig.icon} ${styles.icon}`} />
            </div>
          )}

          <div className="flex-1 min-w-0">
            {title && (
              <h3 className={`${sizeConfig.title} ${styles.icon} mb-1`}>
                {title}
              </h3>
            )}

            <p
              className={`${sizeConfig.message} ${styles.container
                .split(" ")[0]
                .replace("bg-", "text-")}`}
            >
              {errorMessage}
            </p>

            {errorCode && process.env.NODE_ENV === "development" && (
              <p className="text-xs opacity-75 mt-1">Error Code: {errorCode}</p>
            )}

            {action && (
              <p className="text-xs opacity-75 mt-1">Action: {action}</p>
            )}
          </div>

          <div className="flex items-center space-x-2 ml-4">
            {showRetry && canRetry && onRetry && (
              <button
                onClick={onRetry}
                className={`
                  ${styles.button}
                  px-3 py-1 rounded text-xs font-medium
                  transition-colors duration-200
                  flex items-center space-x-1
                `}
              >
                <RefreshCw className="w-3 h-3" />
                <span>Retry</span>
              </button>
            )}

            {showDismiss && onDismiss && (
              <button
                onClick={onDismiss}
                className={`
                  ${styles.icon}
                  hover:opacity-75 transition-opacity duration-200
                  p-1 rounded
                `}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Specialized error displays
export function NetworkErrorDisplay({
  error,
  onRetry,
  onDismiss,
}: {
  error: AppError | string | null;
  onRetry?: () => void;
  onDismiss?: () => void;
}) {
  return (
    <ErrorDisplay
      error={error}
      onRetry={onRetry}
      onDismiss={onDismiss}
      variant="error"
      title="Connection Error"
      action="Check your internet connection and try again"
    />
  );
}

export function AuthErrorDisplay({
  error,
  onRetry,
  onDismiss,
}: {
  error: AppError | string | null;
  onRetry?: () => void;
  onDismiss?: () => void;
}) {
  return (
    <ErrorDisplay
      error={error}
      onRetry={onRetry}
      onDismiss={onDismiss}
      variant="warning"
      title="Authentication Required"
      action="Please log in to continue"
    />
  );
}

export function ValidationErrorDisplay({
  error,
  onDismiss,
}: {
  error: AppError | string | null;
  onDismiss?: () => void;
}) {
  return (
    <ErrorDisplay
      error={error}
      onDismiss={onDismiss}
      variant="warning"
      title="Validation Error"
      showRetry={false}
    />
  );
}

export function SuccessDisplay({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss?: () => void;
}) {
  return (
    <ErrorDisplay
      error={message}
      onDismiss={onDismiss}
      variant="success"
      title="Success"
      showRetry={false}
    />
  );
}

// Loading state with error handling
export function LoadingWithError({
  isLoading,
  error,
  onRetry,
  onDismiss,
  children,
  loadingMessage = "Loading...",
  errorTitle = "Error",
}: {
  isLoading: boolean;
  error: AppError | string | null;
  onRetry?: () => void;
  onDismiss?: () => void;
  children: React.ReactNode;
  loadingMessage?: string;
  errorTitle?: string;
}) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">{loadingMessage}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorDisplay
        error={error}
        onRetry={onRetry}
        onDismiss={onDismiss}
        title={errorTitle}
      />
    );
  }

  return <>{children}</>;
}
