"use client";

import { useState, useEffect } from "react";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { ErrorDisplay, LoadingWithError } from "@/components/ErrorDisplay";
import { ErrorBoundary } from "@/components/ErrorBoundary";
// Types for dashboard
interface Package {
  id: number;
  name: string;
  price: number;
  type: string;
  features: string[];
}

interface UserPackageSelection {
  id: number;
  user_id: number;
  package_id: number;
  status: string;
}

interface RealAd {
  id: number;
  platform: string;
  content: string;
  engagement: number;
}

interface Campaign {
  id: number;
  name: string;
  status: string;
  budget: number;
}

interface ConnectedAccount {
  id: number;
  platform: string;
  username: string;
  status: string;
}
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useCampaigns } from "@/hooks/useCampaigns";
import { usePackages } from "@/hooks/usePackages";
import {
  BarChart3,
  Target,
  Sparkles,
  Settings,
  Plus,
  TrendingUp,
  Users,
  DollarSign,
  Eye,
  MousePointer,
  ShoppingCart,
  Brain,
  Crown,
  Zap,
  Shield,
  Globe,
  Facebook,
  Search,
  Instagram,
  Youtube,
  Linkedin,
  Twitter,
  Video,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  X,
  Check,
  Star,
} from "lucide-react";
import CampaignsSection from "@/components/dashboard/CampaignsSection";
import AnalyticsSection from "@/components/dashboard/AnalyticsSection";
import EnhancedAnalyticsSection from "@/components/dashboard/EnhancedAnalyticsSection";
import AudienceSection from "@/components/dashboard/AudienceSection";
import AdCreationWizard from "@/components/dashboard/AdCreationWizard";
import CampaignCreationModal from "@/components/dashboard/CampaignCreationModal";
import ExistingAdsSelector from "@/components/dashboard/ExistingAdsSelector";
import AccountConnectionModal from "@/components/dashboard/AccountConnectionModal";
import AdOptimizationModal from "@/components/dashboard/AdOptimizationModal";
import PackagePricingDisplay from "@/components/dashboard/PackagePricingDisplay";
import PaymentModal from "@/components/dashboard/PaymentModal";
import DashboardHeader from "@/components/DashboardHeader";

interface RealAdData {
  platform: "facebook" | "google";
  campaignId: string;
  campaignName: string;
  status: string;
  impressions: number;
  clicks: number;
  spend: number;
  conversions: number;
  ctr: number;
  cpc: number;
  cpm: number;
  roas: number;
  reach: number;
  frequency: number;
  lastUpdated: Date;
}

export default function DashboardPage() {
  const { user, loading: authLoading, isAuthenticated, isAdmin } = useAuth();
  const { campaigns, loading: campaignsLoading } = useCampaigns();
  const { packages, currentPackage, loading: packagesLoading } = usePackages();
  const router = useRouter();

  // Error handling
  const {
    error: generalError,
    handleError: handleGeneralError,
    clearError: clearGeneralError,
  } = useErrorHandler({ context: "Dashboard" });

  const {
    error: packageError,
    handleError: handlePackageError,
    clearError: clearPackageError,
  } = useErrorHandler({ context: "Dashboard-Packages" });
  const [activeTab, setActiveTab] = useState("overview");
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showAdOptimization, setShowAdOptimization] = useState(false);
  const [realAdsData, setRealAdsData] = useState<RealAdData[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasPackageAccess, setHasPackageAccess] = useState(false);
  const [availableUpgrades, setAvailableUpgrades] = useState<Package[]>([]);
  const [availablePackages, setAvailablePackages] = useState<Package[]>([]);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPackageForPayment, setSelectedPackageForPayment] =
    useState<Package | null>(null);
  const [showAccountConnection, setShowAccountConnection] = useState(false);
  const [showExistingAdsSelector, setShowExistingAdsSelector] = useState(false);
  const [connectedAccounts, setConnectedAccounts] = useState<
    ConnectedAccount[]
  >([]);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    // If user is admin, redirect to admin panel
    if (isAdmin) {
      router.push("/admin");
      return;
    }

    checkPackageAccess();
    fetchRealAdsData();
  }, [isAuthenticated, isAdmin, authLoading, router]);

  // Packages are now handled by the usePackages hook

  // Debug packages loading
  useEffect(() => {
    console.log("📦 Available packages updated:", availablePackages);
    console.log("📦 Packages count:", availablePackages.length);
    if (availablePackages.length > 0) {
      console.log(
        "📦 Package names:",
        availablePackages.map((p) => p.name)
      );
    }
  }, [availablePackages]);

  const checkPackageAccess = async () => {
    try {
      clearPackageError();

      // Get auth token
      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }

      // Get current package details
      const currentResponse = await fetch(
        "http://127.0.0.1:8000/api/packages/current",
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (currentResponse.ok) {
        const contentType = currentResponse.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const currentData = await currentResponse.json();
          if (currentData.success && currentData.hasActivePackage) {
            setHasPackageAccess(true);
          }
        }
      }

      // Get available upgrades
      const upgradesResponse = await fetch(
        "http://127.0.0.1:8000/api/packages/upgrades",
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (upgradesResponse.ok) {
        const contentType = upgradesResponse.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const upgradesData = await upgradesResponse.json();
          if (upgradesData.success) {
            setAvailableUpgrades(upgradesData.availableUpgrades || []);
          }
        }
      }

      // Get all packages for pricing display (including current package)
      const packagesResponse = await fetch(
        "http://127.0.0.1:8000/api/packages/available",
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (packagesResponse.ok) {
        const contentType = packagesResponse.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const packagesData = await packagesResponse.json();
          console.log("📦 Packages API response:", packagesData);

          if (
            packagesData.success &&
            packagesData.packages &&
            packagesData.packages.length > 0
          ) {
            console.log(
              "📦 Using API packages:",
              packagesData.packages.map(
                (p: Record<string, unknown>) => `${p.name} - $${p.price}`
              )
            );
            setAvailablePackages(packagesData.packages);
          } else {
            console.log("📦 API returned empty packages, using local packages");
            setAvailablePackages(packages);
          }
        }
      } else {
        console.log("📦 Packages API failed, using local packages");
        setAvailablePackages(packages);
      }
    } catch (error) {
      console.error("Error checking package access:", error);
      handlePackageError(error);
      console.log("📦 Error occurred, using local packages");
      setAvailablePackages(packages);
    }
  };

  const fetchRealAdsData = async () => {
    if (!hasPackageAccess) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }

      const response = await fetch("http://127.0.0.1:8000/api/ads/real-data", {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          if (data.success) {
            setRealAdsData(data.data || []);
          } else {
            console.error("Failed to fetch ads data:", data.message);
            setRealAdsData([]);
          }
        }
      } else if (response.status === 401) {
        throw new Error("Authentication failed. Please login again.");
      } else if (response.status === 403) {
        throw new Error("Access denied. Package access required.");
      } else {
        throw new Error(`Failed to fetch ads data: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching real ads data:", error);
      handleGeneralError(error);
      setRealAdsData([]);
    } finally {
      setLoading(false);
    }
  };

  // Campaigns are now handled by the useCampaigns hook

  const handleCancelPackage = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }

      const response = await fetch(
        "http://127.0.0.1:8000/api/packages/cancel",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          if (data.success) {
            alert("Package cancelled successfully!");
            setShowCancelModal(false);
            checkPackageAccess(); // Refresh package status
          } else {
            alert(`Error: ${data.message || "Failed to cancel package"}`);
          }
        }
      } else if (response.status === 401) {
        throw new Error("Authentication failed. Please login again.");
      } else if (response.status === 403) {
        throw new Error("Access denied. Admin privileges required.");
      } else {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const error = await response.json();
          throw new Error(
            error.message || `Request failed: ${response.status}`
          );
        } else {
          throw new Error(
            `Request failed: ${response.status} ${response.statusText}`
          );
        }
      }
    } catch (error) {
      console.error("Error cancelling package:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to cancel package. Please try again.";
      alert(errorMessage);
    }
  };

  const handleUpgradePackage = (upgradePackage: Record<string, unknown>) => {
    // This will be handled by the PaymentModal
    setShowUpgradeModal(true);
  };

  const handlePackageSelect = async (packageId: string) => {
    try {
      // Find package from local packages data
      const selectedPackage = packages.find(
        (pkg) => pkg.id.toString() === packageId
      );

      if (selectedPackage) {
        setSelectedPackageForPayment(selectedPackage);
        setShowPaymentModal(true);
      } else {
        console.error("Package not found:", packageId);
        alert("Package not found. Please try again.");
      }
    } catch (error) {
      console.error("Error selecting package:", error);
      alert("Error loading package. Please try again.");
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setSelectedPackageForPayment(null);
    checkPackageAccess(); // Refresh package status
    alert("Payment successful! Your package has been activated.");
  };

  const handleCampaignCreated = async (
    campaignData: Record<string, unknown>
  ) => {
    console.log("Campaign created:", campaignData);
    setShowCampaignModal(false);
    // Refresh campaigns list
    // Campaigns are now handled by the useCampaigns hook
  };

  const handleAccountConnected = () => {
    // Refresh connected accounts
    fetchConnectedAccounts();
    setShowAccountConnection(false);
  };

  const fetchConnectedAccounts = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }

      const response = await fetch(
        "http://127.0.0.1:8000/api/accounts/connect",
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          if (data.success) {
            setConnectedAccounts(data.accounts || []);
          } else {
            console.error("Failed to fetch connected accounts:", data.message);
            setConnectedAccounts([]);
          }
        }
      } else if (response.status === 401) {
        throw new Error("Authentication failed. Please login again.");
      } else if (response.status === 403) {
        throw new Error("Access denied. Package access required.");
      } else {
        throw new Error(
          `Failed to fetch connected accounts: ${response.status}`
        );
      }
    } catch (error) {
      console.error("Failed to fetch connected accounts:", error);
      handleGeneralError(error);
      setConnectedAccounts([]);
    }
  };

  const handleExistingAdSelected = (ad: Record<string, unknown>) => {
    // Open campaign creation modal with existing ad data
    setShowExistingAdsSelector(false);
    // You can pass the ad data to the campaign creation modal
    console.log("Selected existing ad:", ad);
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "campaigns", label: "Campaigns", icon: Target },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "packages", label: "Packages", icon: Crown },
  ];

  const platformIcons = {
    facebook: Facebook,
    google: Search,
    instagram: Instagram,
    youtube: Youtube,
    linkedin: Linkedin,
    twitter: Twitter,
    tiktok: Video,
  };

  const calculateSummaryStats = () => {
    const totalImpressions = realAdsData.reduce(
      (sum, campaign) => sum + campaign.impressions,
      0
    );
    const totalClicks = realAdsData.reduce(
      (sum, campaign) => sum + campaign.clicks,
      0
    );
    const totalSpend = realAdsData.reduce(
      (sum, campaign) => sum + campaign.spend,
      0
    );
    const totalConversions = realAdsData.reduce(
      (sum, campaign) => sum + campaign.conversions,
      0
    );
    const averageCTR =
      realAdsData.length > 0
        ? realAdsData.reduce((sum, campaign) => sum + campaign.ctr, 0) /
          realAdsData.length
        : 0;
    const averageCPC =
      realAdsData.length > 0
        ? realAdsData.reduce((sum, campaign) => sum + campaign.cpc, 0) /
          realAdsData.length
        : 0;

    return {
      totalImpressions,
      totalClicks,
      totalSpend,
      totalConversions,
      averageCTR,
      averageCPC,
    };
  };

  const summaryStats = calculateSummaryStats();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <DashboardHeader />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-8"
          >
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
              Welcome back, {user?.name || user?.email}!
            </h1>
            <p className="text-white/70 text-base sm:text-lg">
              Manage your advertising campaigns with powerful optimization tools
            </p>
          </motion.div>

          {/* Error Messages */}
          <ErrorDisplay
            error={packageError}
            onDismiss={clearPackageError}
            onRetry={() => {
              clearPackageError();
              checkPackageAccess();
            }}
            title="Error Loading Package Data"
            className="mb-6 sm:mb-8"
          />

          <ErrorDisplay
            error={generalError}
            onDismiss={clearGeneralError}
            onRetry={() => {
              clearGeneralError();
              fetchRealAdsData();
            }}
            title="Error Loading Dashboard Data"
            className="mb-6 sm:mb-8"
          />

          {/* Package Access Warning */}
          {!hasPackageAccess && !packageError && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400 flex-shrink-0" />
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-white">
                      Package Purchase Required
                    </h3>
                    <p className="text-white/70 text-sm sm:text-base">
                      You must purchase a package to create campaigns and access
                      all dashboard features. Choose a package and complete
                      payment to get started.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab("packages")}
                  className="w-full sm:w-auto sm:ml-auto bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Crown className="w-4 h-4" />
                  <span>Choose Plan</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* Package Status Info */}
          {hasPackageAccess && currentPackage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-white">
                      Active Package: {currentPackage.name}
                    </h3>
                    <p className="text-white/70 text-sm sm:text-base">
                      Active Package
                    </p>
                  </div>
                </div>
                {true && (
                  <button
                    onClick={() => setActiveTab("packages")}
                    className="w-full sm:w-auto bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <Crown className="w-4 h-4" />
                    <span>Choose Plan</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-1 bg-white/10 backdrop-blur-xl rounded-2xl p-2 mb-6 sm:mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-200 text-sm sm:text-base ${
                  activeTab === tab.id
                    ? "bg-white text-purple-600 shadow-lg"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <tab.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="hidden xs:inline">{tab.label}</span>
                <span className="xs:hidden">{tab.label.split(" ")[0]}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Current Package Status */}
                {currentPackage && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          Current Package: {currentPackage.name}
                        </h3>
                        <p className="text-gray-600 mt-1">
                          {currentPackage.type}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          ${currentPackage.price}
                        </div>
                        <div className="text-sm text-gray-500">per week</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-white rounded-lg p-4">
                        <div className="text-sm text-gray-500">
                          Max Ad Accounts
                        </div>
                        <div className="text-lg font-semibold">
                          {currentPackage.max_campaigns}
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <div className="text-sm text-gray-500">
                          Daily Budget Cap
                        </div>
                        <div className="text-lg font-semibold">$ Unlimited</div>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <div className="text-sm text-gray-500">
                          Team Collaboration
                        </div>
                        <div className="text-lg font-semibold">Yes</div>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      {availableUpgrades.length > 0 && (
                        <button
                          onClick={() => setShowUpgradeModal(true)}
                          className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-200"
                        >
                          Upgrade Package
                        </button>
                      )}
                      <button
                        onClick={() => setShowCancelModal(true)}
                        className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-200"
                      >
                        Cancel Package
                      </button>
                    </div>
                  </div>
                )}
                {/* Enhanced Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-xl border border-blue-400/30 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div className="text-right">
                        <span className="text-2xl sm:text-3xl font-bold text-white">
                          {summaryStats.totalImpressions.toLocaleString()}
                        </span>
                        <div className="flex items-center text-green-400 text-xs sm:text-sm">
                          <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          +12.5%
                        </div>
                      </div>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                      Total Impressions
                    </h3>
                    <p className="text-blue-200 text-xs sm:text-sm">
                      Reached across all platforms
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-xl border border-green-400/30 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                        <MousePointer className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div className="text-right">
                        <span className="text-2xl sm:text-3xl font-bold text-white">
                          {summaryStats.totalClicks.toLocaleString()}
                        </span>
                        <div className="flex items-center text-green-400 text-xs sm:text-sm">
                          <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          +8.2%
                        </div>
                      </div>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                      Total Clicks
                    </h3>
                    <p className="text-green-200 text-xs sm:text-sm">
                      High engagement rate
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div className="text-right">
                        <span className="text-2xl sm:text-3xl font-bold text-white">
                          ${summaryStats.totalSpend.toLocaleString()}
                        </span>
                        <div className="flex items-center text-red-400 text-xs sm:text-sm">
                          <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          +5.1%
                        </div>
                      </div>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                      Total Spend
                    </h3>
                    <p className="text-purple-200 text-xs sm:text-sm">
                      Optimized performance
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-gradient-to-br from-pink-500/20 to-pink-600/20 backdrop-blur-xl border border-pink-400/30 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                        <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div className="text-right">
                        <span className="text-2xl sm:text-3xl font-bold text-white">
                          {summaryStats.totalConversions.toLocaleString()}
                        </span>
                        <div className="flex items-center text-green-400 text-xs sm:text-sm">
                          <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          +15.3%
                        </div>
                      </div>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                      Conversions
                    </h3>
                    <p className="text-pink-200 text-xs sm:text-sm">
                      High conversion rate
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {activeTab === "campaigns" && (
              <motion.div
                key="campaigns"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* Connect Accounts Section */}
                {connectedAccounts.length === 0 && (
                  <div className="mb-6 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-500/20 rounded-lg">
                          <Shield className="w-8 h-8 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-white">
                            Connect Your Ad Accounts
                          </h3>
                          <p className="text-white/70">
                            Connect your Facebook and Google Ads accounts to
                            analyze and improve your existing ads
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowAccountConnection(true)}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                      >
                        <Shield className="w-5 h-5" />
                        <span>Connect Accounts</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Connected Accounts Status */}
                {connectedAccounts.length > 0 && (
                  <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-6 h-6 text-green-400" />
                        <div>
                          <h4 className="text-white font-semibold">
                            Connected Accounts
                          </h4>
                          <p className="text-white/70">
                            {connectedAccounts.length} account
                            {connectedAccounts.length > 1 ? "s" : ""} connected
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setShowExistingAdsSelector(true)}
                          className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                        >
                          <Target className="w-4 h-4" />
                          <span>Select Existing Ad</span>
                        </button>
                        <button
                          onClick={() => setShowAdOptimization(true)}
                          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                        >
                          <Zap className="w-4 h-4" />
                          <span>AI Optimize Ads</span>
                        </button>
                        <button
                          onClick={() => setShowAccountConnection(true)}
                          className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300"
                        >
                          Manage
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <CampaignsSection
                  campaigns={campaigns as any}
                  selectedCampaign={null}
                  setSelectedCampaign={() => {}}
                  campaignAnalytics={realAdsData as any}
                  isLoading={campaignsLoading}
                  onCreateCampaign={() => setShowCampaignModal(true)}
                  connectedAccounts={connectedAccounts as any}
                  onAnalyzeAd={async (adId) => {
                    try {
                      const response = await fetch(
                        "http://127.0.0.1:8000/api/ads/analyze",
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ adId }),
                        }
                      );
                      const contentType = response.headers.get("content-type");
                      if (
                        contentType &&
                        contentType.includes("application/json")
                      ) {
                        const data = await response.json();
                        if (data.success) {
                          // Refresh ads data
                          fetchRealAdsData();
                          alert(
                            "Ad analysis completed! Check the performance score and suggestions."
                          );
                        } else {
                          alert("Failed to analyze ad: " + data.error);
                        }
                      } else {
                        alert("Failed to analyze ad: Invalid response format");
                      }
                    } catch (error) {
                      console.error("Error analyzing ad:", error);
                      alert("Failed to analyze ad");
                    }
                  }}
                  onGenerateTags={async (adId) => {
                    try {
                      const response = await fetch(
                        "http://127.0.0.1:8000/api/ads/generate-tags",
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ adId }),
                        }
                      );
                      const contentType = response.headers.get("content-type");
                      if (
                        contentType &&
                        contentType.includes("application/json")
                      ) {
                        const data = await response.json();
                        if (data.success) {
                          // Refresh ads data
                          fetchRealAdsData();
                          alert(
                            "Tags generated successfully! Check the ad details for new tags."
                          );
                        } else {
                          alert("Failed to generate tags: " + data.error);
                        }
                      } else {
                        alert(
                          "Failed to generate tags: Invalid response format"
                        );
                      }
                    } catch (error) {
                      console.error("Error generating tags:", error);
                      alert("Failed to generate tags");
                    }
                  }}
                  onOptimizeAd={async (adId) => {
                    try {
                      const response = await fetch(
                        "http://127.0.0.1:8000/api/ads/optimize",
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ adId }),
                        }
                      );
                      const contentType = response.headers.get("content-type");
                      if (
                        contentType &&
                        contentType.includes("application/json")
                      ) {
                        const data = await response.json();
                        if (data.success) {
                          // Refresh ads data
                          fetchRealAdsData();
                          alert(
                            "Ad optimization completed! Check the improvement suggestions."
                          );
                        } else {
                          alert("Failed to optimize ad: " + data.error);
                        }
                      } else {
                        alert("Failed to optimize ad: Invalid response format");
                      }
                    } catch (error) {
                      console.error("Error optimizing ad:", error);
                      alert("Failed to optimize ad");
                    }
                  }}
                />
              </motion.div>
            )}

            {activeTab === "analytics" && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <EnhancedAnalyticsSection
                  analyticsData={realAdsData as any}
                  performanceMetrics={summaryStats}
                  trendData={realAdsData as any}
                  campaigns={realAdsData as any}
                  onAnalyzeCampaign={(campaignId) =>
                    console.log("Analyze campaign:", campaignId)
                  }
                  onGenerateTags={(campaignId) =>
                    console.log("Generate tags for:", campaignId)
                  }
                  onOptimizeCampaign={(campaignId) =>
                    console.log("Optimize campaign:", campaignId)
                  }
                />
              </motion.div>
            )}

            {activeTab === "packages" && (
              <motion.div
                key="packages"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
                  {/* Enhanced Animated Background */}
                  <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
                  </div>

                  <div className="relative z-10 p-4 sm:p-6 lg:p-8">
                    {/* Header */}
                    <div className="text-center mb-12 sm:mb-16">
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="mb-6 sm:mb-8"
                      >
                        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4 sm:mb-6">
                          <Crown className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
                          Choose Your
                          <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Plan
                          </span>
                        </h1>
                        <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8">
                          Unlock the full potential of{" "}
                          <span className="text-blue-400 font-semibold">
                            Luna
                          </span>{" "}
                          with our powerful advertising solutions
                        </p>
                      </motion.div>
                    </div>

                    {/* Package Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
                      {packages.map((pkg, index) => (
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
                          className={`relative group ${
                            pkg.is_popular ? "sm:scale-105 lg:scale-110" : ""
                          }`}
                        >
                          {/* Popular Badge */}
                          {pkg.is_popular && (
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

                          {/* Main Card */}
                          <motion.div
                            whileHover={{
                              scale: 1.05,
                              rotateY: 5,
                              z: 50,
                            }}
                            className={`relative overflow-hidden rounded-3xl transition-all duration-700 ${
                              pkg.is_popular
                                ? "bg-gradient-to-br from-purple-900/90 to-pink-900/90 border-2 border-purple-400/50 shadow-2xl"
                                : "bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-white/20 shadow-xl"
                            } backdrop-blur-xl`}
                          >
                            <div className="relative p-4 sm:p-6 lg:p-8">
                              {/* Package Header */}
                              <div className="text-center mb-6 sm:mb-8">
                                <motion.div
                                  whileHover={{ rotate: 360 }}
                                  transition={{ duration: 0.6 }}
                                  className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-3xl mb-4 sm:mb-6 ${
                                    pkg.is_popular
                                      ? "bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white shadow-2xl"
                                      : "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-xl"
                                  }`}
                                >
                                  {pkg.name
                                    .toLowerCase()
                                    .includes("starter") ? (
                                    <Zap className="w-6 h-6 sm:w-8 sm:h-8" />
                                  ) : pkg.name
                                      .toLowerCase()
                                      .includes("professional") ? (
                                    <Crown className="w-6 h-6 sm:w-8 sm:h-8" />
                                  ) : (
                                    <Star className="w-6 h-6 sm:w-8 sm:h-8" />
                                  )}
                                </motion.div>

                                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                                  {pkg.name}
                                </h3>
                                <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                                  {pkg.description}
                                </p>
                              </div>

                              {/* Pricing */}
                              <div className="text-center mb-8 sm:mb-10">
                                <div className="flex items-center justify-center mb-4">
                                  <span className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
                                    ${pkg.price}
                                  </span>
                                  <span className="text-gray-300 ml-2 sm:ml-3 text-lg sm:text-xl">
                                    /month
                                  </span>
                                </div>
                                <div className="text-gray-400 text-sm mb-4">
                                  30 days
                                </div>
                              </div>

                              {/* Features */}
                              <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-10">
                                <h4 className="font-bold text-white text-lg sm:text-xl mb-4 sm:mb-6 flex items-center justify-center">
                                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-blue-400" />
                                  What&apos;s Included
                                </h4>
                                <div className="space-y-4">
                                  {pkg.features
                                    .slice(0, 5)
                                    .map(
                                      (
                                        feature: string,
                                        featureIndex: number
                                      ) => (
                                        <motion.div
                                          key={featureIndex}
                                          initial={{ opacity: 0, x: -20 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{
                                            delay: featureIndex * 0.1,
                                          }}
                                          className="flex items-start group"
                                        >
                                          <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mr-3 sm:mr-4 mt-1">
                                            <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                          </div>
                                          <span className="text-gray-200 text-sm sm:text-base group-hover:text-white transition-colors">
                                            {feature}
                                          </span>
                                        </motion.div>
                                      )
                                    )}
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
                              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-10">
                                <div className="text-center p-3 sm:p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                                  <div className="text-xl sm:text-2xl font-bold text-white mb-1">
                                    {pkg.max_campaigns}
                                  </div>
                                  <div className="text-xs text-gray-300">
                                    Ad Accounts
                                  </div>
                                </div>
                                <div className="text-center p-3 sm:p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                                  <div className="text-xl sm:text-2xl font-bold text-white mb-1">
                                    ${pkg.budget?.toLocaleString() || "∞"}
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
                                onClick={() =>
                                  handlePackageSelect(pkg.id.toString())
                                }
                                className={`w-full py-4 sm:py-5 px-6 sm:px-8 rounded-2xl font-bold text-white transition-all duration-500 ${
                                  pkg.is_popular
                                    ? "bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 shadow-2xl hover:shadow-3xl"
                                    : "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 shadow-xl hover:shadow-2xl"
                                }`}
                              >
                                <div className="flex items-center justify-center text-base sm:text-lg">
                                  Get Started
                                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2 sm:ml-3" />
                                </div>
                              </motion.button>
                            </div>
                          </motion.div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Modals */}
          <AnimatePresence>
            {showCampaignModal && (
              <CampaignCreationModal
                key="campaign-modal"
                isOpen={showCampaignModal}
                onClose={() => setShowCampaignModal(false)}
                onCampaignCreated={handleCampaignCreated}
              />
            )}

            {/* Upgrade Package Modal */}
            {showUpgradeModal && (
              <motion.div
                key="upgrade-modal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setShowUpgradeModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">
                        Upgrade Package
                      </h2>
                      <button
                        onClick={() => setShowUpgradeModal(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      {availableUpgrades.map((upgrade) => (
                        <div
                          key={upgrade.id}
                          className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {upgrade.name}
                            </h3>
                            <div className="text-right">
                              <div className="text-xl font-bold text-blue-600">
                                ${upgrade.price}
                              </div>
                              <div className="text-sm text-gray-500">
                                per week
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-600 mb-3">{upgrade.type}</p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>Max Accounts: Unlimited</div>
                            <div>Budget Cap: $Unlimited</div>
                            <div>Team Collab: Yes</div>
                            <div>Dedicated Support: Yes</div>
                          </div>
                          <button
                            onClick={() => {
                              setShowUpgradeModal(false);
                              // Handle upgrade payment
                              console.log("Upgrading to:", upgrade);
                            }}
                            className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg hover:shadow-lg transition-all duration-200"
                          >
                            Upgrade to {upgrade.name}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Cancel Package Modal */}
            {showCancelModal && (
              <motion.div
                key="cancel-modal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setShowCancelModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-2xl max-w-md w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">
                        Cancel Package
                      </h2>
                      <button
                        onClick={() => setShowCancelModal(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="mb-6">
                      <p className="text-gray-600 mb-4">
                        Are you sure you want to cancel your current package?
                        This action cannot be undone.
                      </p>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-800 text-sm">
                          <strong>Warning:</strong> You will lose access to all
                          premium features immediately after cancellation.
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={() => setShowCancelModal(false)}
                        className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Keep Package
                      </button>
                      <button
                        onClick={handleCancelPackage}
                        className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Cancel Package
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Payment Modal */}
            {showPaymentModal && selectedPackageForPayment && (
              <PaymentModal
                key="payment-modal"
                isOpen={showPaymentModal}
                package={selectedPackageForPayment as any}
                onClose={() => {
                  setShowPaymentModal(false);
                  setSelectedPackageForPayment(null);
                }}
                onSuccess={handlePaymentSuccess}
              />
            )}

            {/* Account Connection Modal */}
            <AccountConnectionModal
              key="account-connection-modal"
              isOpen={showAccountConnection}
              onClose={() => setShowAccountConnection(false)}
              onAccountConnected={handleAccountConnected}
            />

            {/* Existing Ads Selector Modal */}
            <ExistingAdsSelector
              key="existing-ads-selector-modal"
              isOpen={showExistingAdsSelector}
              onClose={() => setShowExistingAdsSelector(false)}
              onAdSelected={handleExistingAdSelected as any}
              platform="all"
              connectedAccounts={connectedAccounts}
              onConnectAccount={() => setShowAccountConnection(true)}
            />

            {/* Ad Optimization Modal */}
            <AdOptimizationModal
              key="ad-optimization-modal"
              isOpen={showAdOptimization}
              onClose={() => setShowAdOptimization(false)}
              onOptimizationComplete={(results) => {
                console.log("Ad optimization completed:", results);
                // Refresh the dashboard data
                fetchRealAdsData();
              }}
            />
          </AnimatePresence>
        </div>
      </div>
    </ErrorBoundary>
  );
}
