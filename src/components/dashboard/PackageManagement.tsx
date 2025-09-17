"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown,
  Star,
  Check,
  X,
  Zap,
  Globe,
  Target,
  BarChart3,
  Users,
  DollarSign,
  Clock,
  Sparkles,
  ArrowRight,
  Info,
  Shield,
  Award,
  Rocket,
} from "lucide-react";

interface Package {
  id: number;
  name: string;
  description: string;
  price: number;
  type: string;
  features: string[];
  platforms: string[];
  duration: number;
  budget: number;
  maxCampaigns: number;
  maxUsers: number;
  isPopular: boolean;
  isCustom: boolean;
}

interface PackageManagementProps {
  onPackageSelect?: (packageId: number) => void;
  currentPackage?: Package | null;
}

export default function PackageManagement({
  onPackageSelect,
  currentPackage,
}: PackageManagementProps) {
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch("/api/packages");
      if (response.ok) {
        const data = await response.json();
        setPackages(data.packages || []);
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePackageSelect = (pkg: Package) => {
    setSelectedPackage(pkg);
    setShowDetails(true);
    if (onPackageSelect) {
      onPackageSelect(pkg.id);
    }
  };

  const getPackageIcon = (type: string) => {
    switch (type) {
      case "basic":
        return <Target className="w-6 h-6" />;
      case "professional":
        return <Crown className="w-6 h-6" />;
      case "enterprise":
        return <Award className="w-6 h-6" />;
      case "custom":
        return <Rocket className="w-6 h-6" />;
      default:
        return <Star className="w-6 h-6" />;
    }
  };

  const getPackageColor = (type: string) => {
    switch (type) {
      case "basic":
        return "from-blue-500 to-cyan-500";
      case "professional":
        return "from-purple-500 to-pink-500";
      case "enterprise":
        return "from-orange-500 to-red-500";
      case "custom":
        return "from-green-500 to-emerald-500";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Choose Your Advertising Package
        </h2>
        <p className="text-white/70 text-lg">
          Select the perfect package for your advertising needs with AI-powered
          optimization
        </p>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {packages.map((pkg, index) => (
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative bg-white/10 backdrop-blur-xl border rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 cursor-pointer group ${
              pkg.isPopular
                ? "border-yellow-500/50 ring-2 ring-yellow-500/20"
                : "border-white/20"
            }`}
            onClick={() => handlePackageSelect(pkg)}
          >
            {/* Popular Badge */}
            {pkg.isPopular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
                  <Star className="w-4 h-4" />
                  <span>Most Popular</span>
                </div>
              </div>
            )}

            {/* Package Header */}
            <div className="text-center mb-6">
              <div
                className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${getPackageColor(
                  pkg.type
                )} flex items-center justify-center text-white`}
              >
                {getPackageIcon(pkg.type)}
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
              <p className="text-white/70">{pkg.description}</p>
            </div>

            {/* Price */}
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-white mb-2">
                ${pkg.price}
                <span className="text-lg text-white/70">/month</span>
              </div>
              <p className="text-white/70 text-sm">
                {pkg.duration} days duration • ${pkg.budget} budget
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3 mb-6">
              {pkg.features.slice(0, 5).map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-white/80 text-sm">{feature}</span>
                </div>
              ))}
              {pkg.features.length > 5 && (
                <div className="text-white/60 text-sm">
                  +{pkg.features.length - 5} more features
                </div>
              )}
            </div>

            {/* Platforms */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 justify-center">
                {pkg.platforms.map((platform, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white/10 text-white/80 rounded-full text-xs"
                  >
                    {platform}
                  </span>
                ))}
              </div>
            </div>

            {/* Limits */}
            <div className="grid grid-cols-2 gap-4 text-center text-sm text-white/70 mb-6">
              <div>
                <div className="font-semibold">{pkg.maxCampaigns}</div>
                <div>Campaigns</div>
              </div>
              <div>
                <div className="font-semibold">{pkg.maxUsers}</div>
                <div>Users</div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                pkg.isPopular
                  ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:shadow-lg hover:shadow-yellow-500/25"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {currentPackage?.id === pkg.id
                ? "Current Package"
                : "Select Package"}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Package Details Modal */}
      <AnimatePresence>
        {showDetails && selectedPackage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getPackageColor(
                      selectedPackage.type
                    )} flex items-center justify-center text-white`}
                  >
                    {getPackageIcon(selectedPackage.type)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      {selectedPackage.name}
                    </h3>
                    <p className="text-white/70">
                      {selectedPackage.description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 text-white/70 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Package Details */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">
                      Package Details
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-white/70">Price:</span>
                        <span className="text-white font-semibold">
                          ${selectedPackage.price}/month
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Duration:</span>
                        <span className="text-white">
                          {selectedPackage.duration} days
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Budget:</span>
                        <span className="text-white">
                          ${selectedPackage.budget}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Max Campaigns:</span>
                        <span className="text-white">
                          {selectedPackage.maxCampaigns}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Max Users:</span>
                        <span className="text-white">
                          {selectedPackage.maxUsers}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">
                      Supported Platforms
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPackage.platforms.map((platform, index) => (
                        <span
                          key={index}
                          className="px-3 py-2 bg-white/10 text-white rounded-lg text-sm"
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Features List */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">
                    Features Included
                  </h4>
                  <div className="space-y-3">
                    {selectedPackage.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span className="text-white/80">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/20">
                <div className="text-white/70 text-sm">
                  <Info className="w-4 h-4 inline mr-2" />
                  All packages include AI-powered optimization and global
                  targeting
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowDetails(false)}
                    className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-300"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      // Handle package selection
                      setShowDetails(false);
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                  >
                    <span>Select Package</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
