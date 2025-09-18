"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Star,
  Zap,
  Crown,
  Sparkles,
  ArrowRight,
  Calendar,
  DollarSign,
  Users,
  BarChart3,
  Target,
  Shield,
  Globe,
  Smartphone,
  CreditCard,
  Gift,
  TrendingUp,
  X,
} from "lucide-react";

interface Package {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  features: string[];
  limitations: string[];
  isPopular?: boolean;
  maxFacebookAccounts: number;
  dailyBudgetCap: number;
  hasUnlimitedBudget: boolean;
  hasTeamCollaboration: boolean;
  hasDedicatedConsultant: boolean;
  discountPercentage?: number;
}

interface PackagePricingDisplayProps {
  packages: Package[];
  onPackageSelect?: (packageId: string) => void;
  currentPackage?: Package;
}

export default function PackagePricingDisplay({
  packages,
  onPackageSelect,
  currentPackage,
}: PackagePricingDisplayProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [hoveredPackage, setHoveredPackage] = useState<string | null>(null);

  // Debug logging
  console.log(
    "🎨 PackagePricingDisplay received packages:",
    packages?.length || 0
  );
  if (packages && packages.length > 0) {
    console.log(
      "🎨 Package names and prices:",
      packages.map((p) => `${p.name} - $${p.price}`)
    );
    console.log("🎨 Package details:", packages);
  } else {
    console.log("🎨 No packages received or empty array");
  }

  const getPackageIcon = (packageName: string) => {
    if (packageName.toLowerCase().includes("starter"))
      return <Zap className="w-8 h-8" />;
    if (packageName.toLowerCase().includes("professional"))
      return <Crown className="w-8 h-8" />;
    if (packageName.toLowerCase().includes("enterprise"))
      return <Star className="w-8 h-8" />;
    return <Sparkles className="w-8 h-8" />;
  };

  const getPackageGradient = (packageName: string, isPopular: boolean) => {
    if (isPopular) return "from-purple-500 via-pink-500 to-red-500";
    if (packageName.toLowerCase().includes("starter"))
      return "from-blue-500 to-cyan-500";
    if (packageName.toLowerCase().includes("professional"))
      return "from-emerald-500 to-teal-500";
    if (packageName.toLowerCase().includes("enterprise"))
      return "from-amber-500 to-orange-500";
    return "from-gray-500 to-gray-600";
  };

  const calculatePrice = (basePrice: number) => {
    if (billingCycle === "yearly") {
      return Math.round(basePrice * 12 * 0.8); // 20% discount for yearly
    }
    return basePrice;
  };

  const getBillingText = () => {
    return billingCycle === "yearly" ? "per year" : "per month";
  };

  const getSavingsText = () => {
    if (billingCycle === "yearly") {
      return "Save 20%";
    }
    return "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1500"></div>
      </div>

      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
              <Crown className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Choose Your
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Package
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Unlock the full potential of{" "}
              <span className="text-blue-400 font-semibold">Luna AI</span> with
              our powerful advertising solutions
            </p>

            {/* Dashboard-specific features */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-xl rounded-full px-6 py-3 border border-white/20">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-white font-semibold">Secure Payment</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-xl rounded-full px-6 py-3 border border-white/20">
                <Target className="w-5 h-5 text-blue-400" />
                <span className="text-white font-semibold">AI Optimized</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-xl rounded-full px-6 py-3 border border-white/20">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <span className="text-white font-semibold">Proven Results</span>
              </div>
            </div>
          </motion.div>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="inline-flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2 mb-12"
          >
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-8 py-4 rounded-xl font-semibold transition-all duration-500 ${
                billingCycle === "monthly"
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-2xl transform scale-105"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <Calendar className="w-5 h-5 inline mr-2" />
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-8 py-4 rounded-xl font-semibold transition-all duration-500 ${
                billingCycle === "yearly"
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-2xl transform scale-105"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <Gift className="w-5 h-5 inline mr-2" />
              Yearly
              <span className="ml-2 px-3 py-1 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs rounded-full font-bold">
                Save 20%
              </span>
            </button>
          </motion.div>
        </div>

        {/* Package Cards - 2 rows layout */}
        <div
          className={`grid gap-8 max-w-7xl mx-auto ${
            packages && packages.length === 3
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1 md:grid-cols-2"
          }`}
        >
          {packages && packages.length > 0 ? (
            packages.map((pkg, index) => {
              const isCurrentPackage = currentPackage?.id === pkg.id;
              const isHovered = hoveredPackage === pkg.id;
              const price = calculatePrice(pkg.price);
              const savings =
                billingCycle === "yearly"
                  ? Math.round(pkg.price * 12 * 0.2)
                  : 0;

              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: index * 0.2,
                    duration: 0.8,
                    type: "spring",
                    stiffness: 100,
                  }}
                  onHoverStart={() => setHoveredPackage(pkg.id)}
                  onHoverEnd={() => setHoveredPackage(null)}
                  className={`relative group ${
                    pkg.isPopular ? "md:scale-105" : ""
                  }`}
                >
                  {/* Floating Badges */}
                  {pkg.isPopular && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20"
                    >
                      <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white px-8 py-3 rounded-full text-sm font-bold shadow-2xl border-2 border-white/20">
                        <Star className="w-5 h-5 inline mr-2" />
                        MOST POPULAR
                      </div>
                    </motion.div>
                  )}

                  {isCurrentPackage && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20"
                    >
                      <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-8 py-3 rounded-full text-sm font-bold shadow-2xl border-2 border-white/20">
                        <Check className="w-5 h-5 inline mr-2" />
                        CURRENT PLAN
                      </div>
                    </motion.div>
                  )}

                  {/* Main Card */}
                  <motion.div
                    whileHover={{
                      scale: isHovered ? 1.05 : 1,
                      rotateY: isHovered ? 5 : 0,
                      z: isHovered ? 50 : 0,
                    }}
                    className={`relative overflow-hidden rounded-3xl transition-all duration-700 ${
                      pkg.isPopular
                        ? "bg-gradient-to-br from-purple-900/90 to-pink-900/90 border-2 border-purple-400/50 shadow-2xl"
                        : isCurrentPackage
                        ? "bg-gradient-to-br from-green-900/90 to-emerald-900/90 border-2 border-green-400/50 shadow-2xl"
                        : "bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-white/20 shadow-xl"
                    } backdrop-blur-xl`}
                  >
                    {/* Enhanced Animated Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20"></div>
                      <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
                      <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse delay-1000"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-cyan-500/20 rounded-full blur-lg animate-pulse delay-500"></div>
                      <div className="absolute bottom-1/3 right-1/3 w-20 h-20 bg-emerald-500/20 rounded-full blur-xl animate-pulse delay-1500"></div>
                    </div>

                    {/* Card Glow Effect */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>

                    <div className="relative p-8">
                      {/* Package Header */}
                      <div className="text-center mb-8">
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                          className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-6 ${
                            pkg.isPopular
                              ? "bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white shadow-2xl"
                              : isCurrentPackage
                              ? "bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white shadow-2xl"
                              : "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-xl"
                          }`}
                        >
                          {getPackageIcon(pkg.name)}
                        </motion.div>

                        <h3 className="text-3xl font-bold text-white mb-3">
                          {pkg.name}
                        </h3>
                        <p className="text-gray-300 text-lg leading-relaxed">
                          {pkg.description}
                        </p>
                      </div>

                      {/* Pricing */}
                      <div className="text-center mb-10">
                        <div className="flex items-center justify-center mb-4">
                          <span className="text-6xl font-bold text-white">
                            ${price}
                          </span>
                          <span className="text-gray-300 ml-3 text-xl">
                            /{getBillingText()}
                          </span>
                        </div>

                        {billingCycle === "yearly" && savings > 0 && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex items-center justify-center space-x-3 mb-4"
                          >
                            <span className="text-lg text-gray-400 line-through">
                              ${pkg.price * 12}
                            </span>
                            <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                              Save ${savings}
                            </span>
                          </motion.div>
                        )}

                        {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="mt-4"
                          >
                            <span className="inline-block bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                              {pkg.discountPercentage}% OFF
                            </span>
                          </motion.div>
                        )}
                      </div>

                      {/* Features */}
                      <div className="space-y-6 mb-10">
                        <h4 className="font-bold text-white text-xl mb-6 flex items-center justify-center">
                          <Sparkles className="w-6 h-6 mr-3 text-blue-400" />
                          What&apos;s Included
                        </h4>
                        <div className="space-y-4">
                          {pkg.features
                            .slice(0, 5)
                            .map((feature, featureIndex) => (
                              <motion.div
                                key={featureIndex}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: featureIndex * 0.1 }}
                                className="flex items-start group"
                              >
                                <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mr-4 mt-1">
                                  <Check className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-gray-200 text-base group-hover:text-white transition-colors">
                                  {feature}
                                </span>
                              </motion.div>
                            ))}
                          {pkg.features.length > 5 && (
                            <div className="text-center pt-2">
                              <span className="text-blue-400 text-sm font-semibold">
                                +{pkg.features.length - 5} more features
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Package Stats */}
                      <div className="grid grid-cols-2 gap-4 mb-10">
                        <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                          <div className="text-2xl font-bold text-white mb-1">
                            {pkg.maxFacebookAccounts}
                          </div>
                          <div className="text-xs text-gray-300">
                            Ad Accounts
                          </div>
                        </div>
                        <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                          <div className="text-2xl font-bold text-white mb-1">
                            ${pkg.dailyBudgetCap?.toLocaleString() || "∞"}
                          </div>
                          <div className="text-xs text-gray-300">
                            Daily Budget
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <motion.button
                        whileHover={{
                          scale: 1.05,
                          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onPackageSelect?.(pkg.id)}
                        disabled={isCurrentPackage}
                        className={`w-full py-5 px-8 rounded-2xl font-bold text-white transition-all duration-500 ${
                          isCurrentPackage
                            ? "bg-gradient-to-r from-green-500 to-emerald-500 cursor-not-allowed shadow-2xl"
                            : pkg.isPopular
                            ? "bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 shadow-2xl hover:shadow-3xl"
                            : "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 shadow-xl hover:shadow-2xl"
                        }`}
                      >
                        {isCurrentPackage ? (
                          <div className="flex items-center justify-center text-lg">
                            <Check className="w-6 h-6 mr-3" />
                            Current Plan
                          </div>
                        ) : (
                          <div className="flex items-center justify-center text-lg">
                            Get Started
                            <ArrowRight className="w-6 h-6 ml-3" />
                          </div>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mb-6">
                <X className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">
                No Packages Available
              </h3>
              <p className="text-gray-300 text-lg">
                Please check back later or contact support.
              </p>
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-center mt-20 max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/20 shadow-2xl">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-8">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-4xl font-bold text-white mb-6">
              Need a Custom Solution?
            </h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Contact our team to discuss enterprise pricing and custom features
              tailored to your business needs.
            </p>
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-12 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all duration-500"
            >
              Contact Sales
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
