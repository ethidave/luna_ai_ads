"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  AlertTriangle, 
  Server, 
  Terminal, 
  Copy, 
  CheckCircle, 
  RefreshCw,
  ExternalLink,
  Wifi,
  WifiOff
} from "lucide-react";
import { checkBackendStatus, getApiUrl } from "@/lib/api-utils";

interface BackendConnectionErrorProps {
  onRetry?: () => void;
  showRetryButton?: boolean;
}

export default function BackendConnectionError({ 
  onRetry, 
  showRetryButton = true 
}: BackendConnectionErrorProps) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [backendStatus, setBackendStatus] = useState<{ isRunning: boolean; error?: string } | null>(null);
  const [copiedCommand, setCopiedCommand] = useState(false);

  const currentApiUrl = getApiUrl('');
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';

  const checkBackend = async () => {
    setIsRetrying(true);
    const status = await checkBackendStatus();
    setBackendStatus(status);
    setIsRetrying(false);
  };

  useEffect(() => {
    checkBackend();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCommand(true);
    setTimeout(() => setCopiedCommand(false), 2000);
  };

  const handleRetry = () => {
    checkBackend();
    if (onRetry) {
      onRetry();
    }
  };

  if (backendStatus?.isRunning) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg"
      >
        <div className="flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <div>
            <p className="text-green-400 font-medium">Backend Connected!</p>
            <p className="text-green-300 text-sm">Laravel backend is running and accessible.</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 p-6 bg-red-500/10 border border-red-500/20 rounded-xl"
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <WifiOff className="w-6 h-6 text-red-400" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-red-400 mb-2">
            Backend Not Running
          </h3>
          
          <p className="text-red-300 mb-4">
            The Laravel backend is not running. Please start it to use the application.
          </p>

          <div className="space-y-4">
            {/* Current API URL */}
            <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-3">
              <p className="text-red-200 text-sm font-medium mb-1">Current API URL:</p>
              <code className="text-red-300 text-sm break-all">{currentApiUrl}</code>
            </div>

            {/* Instructions */}
            <div className="space-y-3">
              <h4 className="text-red-200 font-medium">To fix this issue:</h4>
              
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <span className="text-red-300 text-sm font-mono bg-red-500/10 px-2 py-1 rounded">1</span>
                  <p className="text-red-200 text-sm">Navigate to your Laravel backend directory</p>
                </div>
                
                <div className="flex items-start space-x-2">
                  <span className="text-red-300 text-sm font-mono bg-red-500/10 px-2 py-1 rounded">2</span>
                  <p className="text-red-200 text-sm">Run the following command:</p>
                </div>

                {/* Command to copy */}
                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <code className="text-green-400 text-sm font-mono">
                      php artisan serve --host=0.0.0.0 --port=8000
                    </code>
                    <button
                      onClick={() => copyToClipboard('php artisan serve --host=0.0.0.0 --port=8000')}
                      className="ml-2 p-1 text-gray-400 hover:text-white transition-colors"
                    >
                      {copiedCommand ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {!isLocalhost && (
                  <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <p className="text-yellow-300 text-sm">
                      <strong>Mobile Device Detected:</strong> The backend is configured to accept connections from all devices on your network.
                    </p>
                  </div>
                )}

                <div className="flex items-start space-x-2">
                  <span className="text-red-300 text-sm font-mono bg-red-500/10 px-2 py-1 rounded">3</span>
                  <p className="text-red-200 text-sm">Wait for the server to start, then refresh this page</p>
                </div>
              </div>
            </div>

            {/* Retry button */}
            {showRetryButton && (
              <div className="pt-4">
                <button
                  onClick={handleRetry}
                  disabled={isRetrying}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white rounded-lg transition-colors duration-200"
                >
                  {isRetrying ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  <span>{isRetrying ? 'Checking...' : 'Check Again'}</span>
                </button>
              </div>
            )}

            {/* Additional help */}
            <div className="mt-4 pt-4 border-t border-red-500/20">
              <p className="text-red-200 text-xs">
                <strong>Need help?</strong> Make sure you have PHP and Laravel installed, and that you're in the correct Laravel project directory.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
