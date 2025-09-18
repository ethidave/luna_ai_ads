"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Facebook,
  Search as GoogleIcon,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Shield,
  Zap,
  TrendingUp,
  Users,
  Target,
} from "lucide-react";

interface AccountConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccountConnected: () => void;
}

export default function AccountConnectionModal({
  isOpen,
  onClose,
  onAccountConnected,
}: AccountConnectionModalProps) {
  const [connecting, setConnecting] = useState<string | null>(null);
  const [connectedAccounts, setConnectedAccounts] = useState<
    Record<string, unknown>[]
  >([]);
  const [error, setError] = useState<string | null>(null);

  const handleConnectAccount = async (platform: "facebook" | "google") => {
    setConnecting(platform);
    setError(null);

    try {
      // For demo purposes, we'll simulate the OAuth flow
      // In production, you would redirect to the actual OAuth URLs

      if (platform === "facebook") {
        // Facebook OAuth URL with required permissions for ads
        const facebookAuthUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${
          process.env.NEXT_PUBLIC_FACEBOOK_APP_ID
        }&redirect_uri=${encodeURIComponent(
          window.location.origin + "/auth/facebook/callback"
        )}&scope=ads_read,ads_management,read_insights&response_type=code&state=${Date.now()}`;

        // Check if Facebook App ID is configured
        if (!process.env.NEXT_PUBLIC_FACEBOOK_APP_ID) {
          setError("Facebook App ID not configured. Please contact support.");
          setConnecting(null);
          return;
        }

        // Open popup for OAuth
        const popup = window.open(
          facebookAuthUrl,
          "facebook-auth",
          "width=600,height=600,scrollbars=yes,resizable=yes,top=100,left=100"
        );

        if (!popup) {
          setError(
            "Popup blocked. Please allow popups for this site and try again."
          );
          setConnecting(null);
          return;
        }

        // Listen for popup completion
        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed);
            setConnecting(null);
            // In real implementation, you'd handle the callback
            // For now, we'll simulate success
            setTimeout(() => {
              setConnectedAccounts((prev) => [
                ...prev,
                {
                  id: `fb_${Date.now()}`,
                  platform: "facebook",
                  name: "My Facebook Ads Account",
                  status: "connected",
                  connectedAt: new Date().toISOString(),
                },
              ]);
              onAccountConnected();
            }, 1000);
          }
        }, 1000);

        // Timeout after 5 minutes
        setTimeout(() => {
          if (!popup?.closed) {
            popup.close();
            clearInterval(checkClosed);
            setConnecting(null);
            setError("Connection timed out. Please try again.");
          }
        }, 300000);
      } else if (platform === "google") {
        // Google OAuth URL with required permissions for Google Ads
        const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${
          process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
        }&redirect_uri=${encodeURIComponent(
          window.location.origin + "/auth/google/callback"
        )}&scope=https://www.googleapis.com/auth/adwords&response_type=code&access_type=offline&prompt=consent&state=${Date.now()}`;

        // Check if Google Client ID is configured
        if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
          setError("Google Client ID not configured. Please contact support.");
          setConnecting(null);
          return;
        }

        // Open popup for OAuth
        const popup = window.open(
          googleAuthUrl,
          "google-auth",
          "width=600,height=600,scrollbars=yes,resizable=yes,top=100,left=100"
        );

        if (!popup) {
          setError(
            "Popup blocked. Please allow popups for this site and try again."
          );
          setConnecting(null);
          return;
        }

        // Listen for popup completion
        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed);
            setConnecting(null);
            // In real implementation, you'd handle the callback
            // For now, we'll simulate success
            setTimeout(() => {
              setConnectedAccounts((prev) => [
                ...prev,
                {
                  id: `google_${Date.now()}`,
                  platform: "google",
                  name: "My Google Ads Account",
                  status: "connected",
                  connectedAt: new Date().toISOString(),
                },
              ]);
              onAccountConnected();
            }, 1000);
          }
        }, 1000);

        // Timeout after 5 minutes
        setTimeout(() => {
          if (!popup?.closed) {
            popup.close();
            clearInterval(checkClosed);
            setConnecting(null);
            setError("Connection timed out. Please try again.");
          }
        }, 300000);
      }
    } catch (error) {
      console.error("Connection failed:", error);
      setError("Failed to connect account. Please try again.");
      setConnecting(null);
    }
  };

  const handleDisconnectAccount = async (platform: string) => {
    try {
      // Remove from connected accounts
      setConnectedAccounts((prev) =>
        prev.filter((acc) => acc.platform !== platform)
      );
    } catch (error) {
      console.error("Disconnect failed:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-900 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Connect Your Ad Accounts
                </h2>
                <p className="text-white/70">
                  Connect your Facebook and Google Ads accounts to analyze and
                  improve your existing ads
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/70 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-400">{error}</span>
              </div>
            )}

            {/* Connected Accounts */}
            {connectedAccounts.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Connected Accounts
                </h3>
                <div className="space-y-3">
                  {connectedAccounts.map((account, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-800/50 border border-gray-700/50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-lg ${
                            account.platform === "facebook"
                              ? "bg-blue-500/20"
                              : "bg-green-500/20"
                          }`}
                        >
                          {account.platform === "facebook" ? (
                            <Facebook className="w-5 h-5 text-blue-400" />
                          ) : (
                            <GoogleIcon className="w-5 h-5 text-green-400" />
                          )}
                        </div>
                        <div>
                          <div className="text-white font-medium">
                            {account.name as string}
                          </div>
                          <div className="text-white/70 text-sm capitalize">
                            {account.platform as string} Ads
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <button
                          onClick={() =>
                            handleDisconnectAccount(account.platform as string)
                          }
                          className="px-3 py-1 text-red-400 hover:text-red-300 text-sm"
                        >
                          Disconnect
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Platform Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Facebook Ads */}
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <Facebook className="w-8 h-8 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      Facebook Ads
                    </h3>
                    <p className="text-white/70">
                      Connect your Facebook Ads account
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2 text-white/70 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Access all your Facebook and Instagram ads</span>
                  </div>
                  <div className="flex items-center space-x-2 text-white/70 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Real-time performance data</span>
                  </div>
                  <div className="flex items-center space-x-2 text-white/70 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>AI-powered optimization suggestions</span>
                  </div>
                </div>

                <button
                  onClick={() => handleConnectAccount("facebook")}
                  disabled={connecting === "facebook"}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {connecting === "facebook" ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-5 h-5" />
                      <span>Connect Facebook Ads</span>
                    </>
                  )}
                </button>
              </div>

              {/* Google Ads */}
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-green-500/20 rounded-lg">
                    <GoogleIcon className="w-8 h-8 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      Google Ads
                    </h3>
                    <p className="text-white/70">
                      Connect your Google Ads account
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2 text-white/70 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Access all your Google Ads campaigns</span>
                  </div>
                  <div className="flex items-center space-x-2 text-white/70 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Search, Display, and Video ads</span>
                  </div>
                  <div className="flex items-center space-x-2 text-white/70 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Advanced keyword optimization</span>
                  </div>
                </div>

                <button
                  onClick={() => handleConnectAccount("google")}
                  disabled={connecting === "google"}
                  className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {connecting === "google" ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-5 h-5" />
                      <span>Connect Google Ads</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Benefits */}
            <div className="mt-8 p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <Zap className="w-5 h-5 text-purple-400" />
                <span>What You&apos;ll Get</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start space-x-3">
                  <TrendingUp className="w-5 h-5 text-purple-400 mt-1" />
                  <div>
                    <div className="text-white font-medium">Real-Time Data</div>
                    <div className="text-white/70 text-sm">
                      Live performance metrics from your ads
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Target className="w-5 h-5 text-purple-400 mt-1" />
                  <div>
                    <div className="text-white font-medium">
                      AI Optimization
                    </div>
                    <div className="text-white/70 text-sm">
                      Smart suggestions to improve performance
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-purple-400 mt-1" />
                  <div>
                    <div className="text-white font-medium">
                      Audience Insights
                    </div>
                    <div className="text-white/70 text-sm">
                      Better targeting recommendations
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
