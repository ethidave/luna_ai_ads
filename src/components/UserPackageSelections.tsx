"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  BarChart3,
  Globe,
  Star,
  Trash2,
  Edit,
  ArrowRight,
  Loader2,
  AlertCircle,
  Check,
  TrendingUp,
  TrendingDown,
  Minus,
  History,
} from "lucide-react";

interface PackageSelection {
  id: string;
  packageId: number;
  billingCycle: string;
  selectedPrice: number;
  isActive: boolean;
  isCompleted: boolean;
  selectionData: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  package: {
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
  } | null;
}

interface UserPackageSelectionsProps {
  onEditSelection?: (selection: PackageSelection) => void;
  onRemoveSelection?: (selectionId: string) => void;
  showActions?: boolean;
}

export default function UserPackageSelections({
  onEditSelection,
  onRemoveSelection,
  showActions = true,
}: UserPackageSelectionsProps) {
  const [selections, setSelections] = useState<PackageSelection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [priceHistory, setPriceHistory] = useState<Record<number, any[]>>({});
  const [showPriceHistory, setShowPriceHistory] = useState<
    Record<number, boolean>
  >({});

  const fetchSelections = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/user/package-selection");
      const data = await response.json();

      if (data.success) {
        setSelections(data.selections || []);
      } else {
        setError(data.message || "Failed to load package selections");
        setSelections([]);
      }
    } catch (error) {
      console.error("Error fetching package selections:", error);
      setError("Failed to load package selections");
      setSelections([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSelections();
  }, []);

  const fetchPriceHistory = async (packageId: number) => {
    try {
      const response = await fetch(
        `/api/price-history?packageId=${packageId}&limit=5`
      );
      const data = await response.json();

      if (data.success) {
        setPriceHistory((prev) => ({
          ...prev,
          [packageId]: data.priceHistory,
        }));
      }
    } catch (error) {
      console.error("Error fetching price history:", error);
    }
  };

  const togglePriceHistory = (packageId: number) => {
    setShowPriceHistory((prev) => ({
      ...prev,
      [packageId]: !prev[packageId],
    }));

    // Fetch price history if not already loaded
    if (!priceHistory[packageId]) {
      fetchPriceHistory(packageId);
    }
  };

  const handleRemoveSelection = async (selectionId: string) => {
    if (!confirm("Are you sure you want to remove this package selection?")) {
      return;
    }

    try {
      const response = await fetch(
        `/api/user/package-selection?id=${selectionId}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();

      if (data.success) {
        setSelections(selections.filter((s) => s.id !== selectionId));
        onRemoveSelection?.(selectionId);
      } else {
        setError(data.error || "Failed to remove selection");
      }
    } catch (error) {
      console.error("Error removing selection:", error);
      setError("Failed to remove selection");
    }
  };

  const getBillingText = (billingCycle: string) => {
    return billingCycle === "yearly" ? "per year" : "per month";
  };

  const getStatusColor = (isCompleted: boolean) => {
    return isCompleted
      ? "text-green-400 bg-green-500/10 border-green-500/20"
      : "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
  };

  const getStatusText = (isCompleted: boolean) => {
    return isCompleted ? "Completed" : "Pending";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-white/70">Loading your package selections...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="text-red-400 mb-4">
            <AlertCircle className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Failed to Load Selections
            </h3>
            <p className="text-white/70">{error}</p>
          </div>
          <button
            onClick={fetchSelections}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (selections.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="text-white/70 mb-4">
            <Package className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              No Package Selections
            </h3>
            <p>
              You haven't selected any packages yet. Browse our packages to get
              started!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Your Package Selections
          </h2>
          <p className="text-white/70">
            Manage your selected packages and pricing
          </p>
        </div>
        <button
          onClick={fetchSelections}
          className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300"
        >
          <Loader2 className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {selections.map((selection, index) => (
          <motion.div
            key={selection.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all duration-300"
          >
            {/* Package Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {selection.package?.name || "Unknown Package"}
                  </h3>
                  <p className="text-white/70 text-sm capitalize">
                    {selection.package?.type || "Package"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {selection.package?.isPopular && (
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded-full border border-yellow-500/30">
                    Popular
                  </span>
                )}
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                    selection.isCompleted
                  )}`}
                >
                  {getStatusText(selection.isCompleted)}
                </span>
              </div>
            </div>

            {/* Price and Billing */}
            <div className="mb-4">
              <div className="text-3xl font-bold text-white mb-1">
                ${selection.selectedPrice.toFixed(2)}
                <span className="text-lg text-white/70">
                  /{getBillingText(selection.billingCycle)}
                </span>
              </div>
              <p className="text-white/70 text-sm">
                {selection.package?.description || "Package description"}
              </p>
            </div>

            {/* Package Details */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center space-x-2 text-white/70 text-sm">
                <Package className="w-4 h-4" />
                <span>{selection.package?.maxCampaigns || 0} Campaigns</span>
              </div>
              <div className="flex items-center space-x-2 text-white/70 text-sm">
                <Users className="w-4 h-4" />
                <span>{selection.package?.maxUsers || 1} Users</span>
              </div>
              <div className="flex items-center space-x-2 text-white/70 text-sm">
                <DollarSign className="w-4 h-4" />
                <span>Budget: ${selection.package?.budget || 0}</span>
              </div>
              <div className="flex items-center space-x-2 text-white/70 text-sm">
                <Clock className="w-4 h-4" />
                <span>Duration: {selection.package?.duration || 30} Days</span>
              </div>
              <div className="flex items-center space-x-2 text-white/70 text-sm">
                <Globe className="w-4 h-4" />
                <span>
                  Platforms: {selection.package?.platforms?.join(", ") || "N/A"}
                </span>
              </div>
            </div>

            {/* Features Preview */}
            {selection.package?.features &&
              selection.package.features.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-white mb-3">
                    Key Features:
                  </h4>
                  <div className="space-y-2">
                    {selection.package.features
                      .slice(0, 3)
                      .map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-center space-x-2"
                        >
                          <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                          <span className="text-white/70 text-sm">
                            {feature}
                          </span>
                        </div>
                      ))}
                    {selection.package.features.length > 3 && (
                      <div className="text-white/50 text-sm">
                        +{selection.package.features.length - 3} more features
                      </div>
                    )}
                  </div>
                </div>
              )}

            {/* Price History */}
            <div className="mb-6">
              <button
                onClick={() => togglePriceHistory(selection.packageId)}
                className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors text-sm mb-3"
              >
                <History className="w-4 h-4" />
                <span>Price History</span>
                {showPriceHistory[selection.packageId] ? (
                  <Minus className="w-4 h-4" />
                ) : (
                  <TrendingUp className="w-4 h-4" />
                )}
              </button>

              {showPriceHistory[selection.packageId] && (
                <div className="bg-white/5 rounded-lg p-4 space-y-3">
                  {priceHistory[selection.packageId]?.length > 0 ? (
                    priceHistory[selection.packageId].map((record, index) => (
                      <div
                        key={record.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center space-x-2">
                          {record.changeType === "increase" ? (
                            <TrendingUp className="w-4 h-4 text-red-400" />
                          ) : record.changeType === "decrease" ? (
                            <TrendingDown className="w-4 h-4 text-green-400" />
                          ) : (
                            <Minus className="w-4 h-4 text-gray-400" />
                          )}
                          <span className="text-white/70">
                            {new Date(record.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-white/70">
                            ${record.oldPrice.toFixed(2)}
                          </span>
                          <span className="text-white">→</span>
                          <span className="text-white font-semibold">
                            ${record.newPrice.toFixed(2)}
                          </span>
                          <span
                            className={`text-xs ${
                              record.priceChangePercentage > 0
                                ? "text-red-400"
                                : record.priceChangePercentage < 0
                                ? "text-green-400"
                                : "text-gray-400"
                            }`}
                          >
                            {record.priceChangePercentage > 0 ? "+" : ""}
                            {record.priceChangePercentage.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-white/50 text-sm text-center py-2">
                      No price history available
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            {showActions && (
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onEditSelection?.(selection)}
                    className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all duration-300"
                    title="Edit selection"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleRemoveSelection(selection.id)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-300"
                    title="Remove selection"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 text-sm flex items-center space-x-2">
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
