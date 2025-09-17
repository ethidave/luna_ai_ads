"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown,
  Check,
  X,
  Star,
  Zap,
  Shield,
  Users,
  BarChart3,
  Target,
  Sparkles,
  Clock,
  AlertCircle,
  ArrowRight,
  Gift,
  TrendingUp,
} from "lucide-react";

interface Package {
  id: string;
  name: string;
  price: number;
  features: string[];
  platforms?: string[];
  budget: number;
  duration: number;
  popular?: boolean;
  current?: boolean;
}

interface PackageAccessManagerProps {
  onPackageSelect?: (packageId: string) => void;
  currentPackage?: Package;
}

export default function PackageAccessManager({
  onPackageSelect,
  currentPackage,
}: PackageAccessManagerProps) {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch("/api/packages/available");
      if (response.ok) {
        const data = await response.json();
        // Use allPackages instead of availablePackages to show all options
        setPackages(data.allPackages || data.availablePackages || []);
        console.log(
          "📦 PackageAccessManager loaded packages:",
          data.allPackages?.length || 0
        );
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePackageSelect = (packageId: string) => {
    if (onPackageSelect) {
      onPackageSelect(packageId);
    }
  };

  const getFeatureIcon = (feature: string) => {
    if (feature.includes("AI")) return <Sparkles className="w-4 h-4" />;
    if (feature.includes("Analytics")) return <BarChart3 className="w-4 h-4" />;
    if (feature.includes("Campaign")) return <Target className="w-4 h-4" />;
    if (feature.includes("Support")) return <Users className="w-4 h-4" />;
    if (feature.includes("Priority")) return <Zap className="w-4 h-4" />;
    if (feature.includes("Security")) return <Shield className="w-4 h-4" />;
    return <Check className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">
              Choose Your Package
            </h2>
            <p className="text-white/70">
              Unlock the full potential of Luna AI
            </p>
          </div>
        </div>
      </div>

      {/* Current Package Status */}
      {currentPackage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-2xl p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                Current Package
              </h3>
              <p className="text-white/70">
                You're currently using {currentPackage.name}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-white/70">Price:</span>
              <span className="text-white ml-2 font-semibold">
                ${currentPackage.price}/month
              </span>
            </div>
            <div>
              <span className="text-white/70">Platforms:</span>
              <span className="text-white ml-2 font-semibold">
                {(currentPackage.platforms || []).length}
              </span>
            </div>
            <div>
              <span className="text-white/70">Budget:</span>
              <span className="text-white ml-2 font-semibold">
                ${currentPackage.budget}
              </span>
            </div>
            <div>
              <span className="text-white/70">Duration:</span>
              <span className="text-white ml-2 font-semibold">
                {currentPackage.duration} days
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Packages Grid - 2 rows layout */}
      <div
        className={`grid gap-6 max-w-6xl mx-auto ${
          packages.length === 3
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1 md:grid-cols-2"
        }`}
      >
        {packages.map((pkg, index) => {
          const isCurrentPackage =
            currentPackage?.id === pkg.id || pkg.userStatus === "active";
          const isPopular = pkg.isPopular || pkg.popular;

          return (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-white/10 backdrop-blur-xl border rounded-2xl p-8 transition-all duration-300 hover:scale-105 min-h-[600px] ${
                isPopular
                  ? "border-purple-500/50 ring-2 ring-purple-500/20"
                  : "border-white/20"
              } ${isCurrentPackage ? "ring-2 ring-green-500/50" : ""}`}
            >
              {/* Popular Badge */}
              {isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}

              {/* Current Badge */}
              {isCurrentPackage && (
                <div className="absolute -top-3 right-4">
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <Check className="w-4 h-4" />
                    <span>Current</span>
                  </div>
                </div>
              )}

              {/* Expired Badge */}
              {pkg.userStatus === "expired" && !isCurrentPackage && (
                <div className="absolute -top-3 right-4">
                  <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>Expired</span>
                  </div>
                </div>
              )}

              {/* Package Header */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  {pkg.name}
                </h3>
                <p className="text-white/70 text-sm mb-4">{pkg.description}</p>
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <span className="text-3xl font-bold text-white">
                    ${pkg.price}
                  </span>
                  <span className="text-white/70">
                    /{pkg.billingCycle || "month"}
                  </span>
                </div>
                {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <span className="text-lg text-white/50 line-through">
                      ${pkg.originalPrice}
                    </span>
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                      {pkg.discountPercentage}% OFF
                    </span>
                  </div>
                )}
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-sm text-white/70 mb-1">
                    Daily Budget Cap
                  </div>
                  <div className="text-lg font-semibold text-white">
                    ${pkg.dailyBudgetCap?.toLocaleString() || "Unlimited"}
                  </div>
                </div>
                {isCurrentPackage && pkg.daysRemaining && (
                  <div className="mt-2 bg-green-500/20 border border-green-500/30 rounded-lg p-2">
                    <div className="text-xs text-green-300 text-center">
                      {pkg.daysRemaining > 0
                        ? `${pkg.daysRemaining} days remaining`
                        : "Package expired - please renew"}
                    </div>
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6">
                {pkg.features.map((feature, featureIndex) => (
                  <div
                    key={featureIndex}
                    className="flex items-center space-x-3"
                  >
                    <div className="text-green-400">
                      {getFeatureIcon(feature)}
                    </div>
                    <span className="text-white text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Package Stats */}
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-sm text-white/70 mb-1">
                      Max Accounts
                    </div>
                    <div className="text-lg font-semibold text-white">
                      {pkg.maxFacebookAccounts || "Unlimited"}
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-sm text-white/70 mb-1">
                      Team Collab
                    </div>
                    <div className="text-lg font-semibold text-white">
                      {pkg.hasTeamCollaboration ? "Yes" : "No"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handlePackageSelect(pkg.id)}
                disabled={isCurrentPackage}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                  isCurrentPackage
                    ? "bg-green-500/20 text-green-300 cursor-not-allowed"
                    : isPopular
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {isCurrentPackage ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Current Package</span>
                  </>
                ) : pkg.userStatus === "expired" ? (
                  <>
                    <span>Renew Package</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>Select Package</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Benefits Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-8"
      >
        <h3 className="text-2xl font-bold text-white text-center mb-6">
          Why Choose Luna AI?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">
              AI-Powered Optimization
            </h4>
            <p className="text-white/70 text-sm">
              Advanced AI algorithms optimize your campaigns for maximum
              performance and ROI.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">
              Real-Time Analytics
            </h4>
            <p className="text-white/70 text-sm">
              Get instant insights from your Facebook and Google Ads campaigns.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">
              Secure & Reliable
            </h4>
            <p className="text-white/70 text-sm">
              Enterprise-grade security with 99.9% uptime guarantee.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
