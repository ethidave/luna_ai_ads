"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  RefreshCw,
  Eye,
  MousePointer,
  Target,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  X,
  Facebook,
  Search as SearchIcon,
  Calendar,
  BarChart3,
  Users,
  Globe,
  Zap,
  Brain,
  Sparkles,
  ArrowRight,
  Play,
  Pause,
  Edit,
  Settings,
  Star,
  Award,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface ExistingAd {
  id: string;
  name: string;
  platform: "facebook" | "google";
  status: "active" | "paused" | "completed";
  objective: string;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  cpc: number;
  roas: number;
  reach: number;
  frequency: number;
  engagement: number;
  headline: string;
  description: string;
  callToAction: string;
  imageUrl?: string;
  videoUrl?: string;
  targetAudience: string[];
  keywords: string[];
  createdAt: string;
  updatedAt: string;
}

interface ExistingAdsSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onAdSelected: (ad: ExistingAd) => void;
  platform?: "facebook" | "google" | "all";
  connectedAccounts?: any[];
  onConnectAccount?: () => void;
}

export default function ExistingAdsSelector({
  isOpen,
  onClose,
  onAdSelected,
  platform = "all",
  connectedAccounts = [],
  onConnectAccount,
}: ExistingAdsSelectorProps) {
  const [ads, setAds] = useState<ExistingAd[]>([]);
  const [filteredAds, setFilteredAds] = useState<ExistingAd[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<
    "facebook" | "google" | "all"
  >(platform);
  const [selectedStatus, setSelectedStatus] = useState<
    "all" | "active" | "paused" | "completed"
  >("all");
  const [sortBy, setSortBy] = useState<
    "performance" | "spend" | "date" | "name"
  >("performance");
  const [selectedAd, setSelectedAd] = useState<ExistingAd | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  // Fetch real ads data
  const fetchAds = async () => {
    try {
      setLoading(true);
      setError("");

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
            setAds(data.data || []);
          } else {
            throw new Error(data.message || "Failed to fetch ads data");
          }
        } else {
          throw new Error("Server returned non-JSON response");
        }
      } else if (response.status === 401) {
        throw new Error("Authentication failed. Please login again.");
      } else if (response.status === 403) {
        throw new Error("Access denied. Package access required.");
      } else {
        throw new Error(`Failed to fetch ads data: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching ads data:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch ads data";
      setError(errorMessage);
      setAds([]);
    } finally {
      setLoading(false);
    }
  };

  // Load ads when component mounts
  useEffect(() => {
    if (isOpen) {
      fetchAds();
    }
  }, [isOpen]);

  // Filter ads when data or filters change
  useEffect(() => {
    filterAds();
  }, [ads, searchTerm, selectedPlatform, selectedStatus, sortBy]);

  // Mock data for demonstration (fallback)
  const mockAds: ExistingAd[] = [
    {
      id: "ad_001",
      name: "Summer Sale Campaign",
      platform: "facebook",
      status: "active",
      objective: "conversions",
      budget: 1000,
      spent: 750,
      impressions: 50000,
      clicks: 1250,
      conversions: 45,
      ctr: 2.5,
      cpc: 0.6,
      roas: 4.2,
      reach: 35000,
      frequency: 1.43,
      engagement: 3.2,
      headline: "Summer Sale - Up to 50% Off!",
      description:
        "Don't miss our biggest sale of the year. Premium products at unbeatable prices.",
      callToAction: "Shop Now",
      targetAudience: ["Women 25-45", "Fashion enthusiasts", "Sale shoppers"],
      keywords: ["summer sale", "discount", "fashion", "shopping"],
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-15T12:00:00Z",
    },
    {
      id: "ad_002",
      name: "Brand Awareness Campaign",
      platform: "facebook",
      status: "active",
      objective: "awareness",
      budget: 500,
      spent: 320,
      impressions: 75000,
      clicks: 900,
      conversions: 8,
      ctr: 1.2,
      cpc: 0.36,
      roas: 2.1,
      reach: 60000,
      frequency: 1.25,
      engagement: 2.1,
      headline: "Introducing Our New Collection",
      description:
        "Discover the latest trends and styles that everyone's talking about.",
      callToAction: "Learn More",
      targetAudience: ["General audience", "Fashion interested", "Brand aware"],
      keywords: ["brand awareness", "new collection", "fashion", "trends"],
      createdAt: "2024-01-05T00:00:00Z",
      updatedAt: "2024-01-15T12:00:00Z",
    },
    {
      id: "ad_003",
      name: "Search Campaign - High Intent",
      platform: "google",
      status: "active",
      objective: "conversions",
      budget: 800,
      spent: 520,
      impressions: 25000,
      clicks: 800,
      conversions: 35,
      ctr: 3.2,
      cpc: 0.65,
      roas: 3.8,
      reach: 20000,
      frequency: 1.25,
      engagement: 4.5,
      headline: "Best Quality Products Online",
      description:
        "Shop premium products with fast delivery and excellent customer service.",
      callToAction: "Buy Now",
      targetAudience: [
        "High-intent buyers",
        "Quality seekers",
        "Online shoppers",
      ],
      keywords: [
        "best quality",
        "premium products",
        "online shopping",
        "fast delivery",
      ],
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-15T12:00:00Z",
    },
    {
      id: "ad_004",
      name: "Display Remarketing",
      platform: "google",
      status: "paused",
      objective: "conversions",
      budget: 400,
      spent: 280,
      impressions: 40000,
      clicks: 600,
      conversions: 18,
      ctr: 1.5,
      cpc: 0.47,
      roas: 2.9,
      reach: 30000,
      frequency: 1.33,
      engagement: 2.8,
      headline: "Complete Your Purchase",
      description:
        "You left items in your cart. Complete your order now and save!",
      callToAction: "Complete Order",
      targetAudience: [
        "Cart abandoners",
        "Previous visitors",
        "Interested buyers",
      ],
      keywords: [
        "cart abandonment",
        "complete purchase",
        "save money",
        "limited time",
      ],
      createdAt: "2024-01-03T00:00:00Z",
      updatedAt: "2024-01-15T12:00:00Z",
    },
  ];

  useEffect(() => {
    if (isOpen) {
      loadAds();
    }
  }, [isOpen]);

  useEffect(() => {
    filterAds();
  }, [ads, searchTerm, selectedPlatform, selectedStatus, sortBy]);

  const loadAds = async () => {
    setLoading(true);
    try {
      // Fetch real ads from API
      const response = await fetch("/api/ads/real?refresh=true");
      const data = await response.json();

      if (data.success) {
        setAds(data.ads);
      } else {
        console.error("Failed to load ads:", data.error);
        // Fallback to mock data if no real ads available
        setAds(mockAds);
      }
    } catch (error) {
      console.error("Failed to load ads:", error);
      // Fallback to mock data
      setAds(mockAds);
    } finally {
      setLoading(false);
    }
  };

  const filterAds = () => {
    // Use real ads data if available, otherwise fallback to mock data
    const adsToUse = ads.length > 0 ? ads : mockAds;
    let filtered = [...adsToUse];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (ad) =>
          ad.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ad.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ad.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by platform
    if (selectedPlatform !== "all") {
      filtered = filtered.filter((ad) => ad.platform === selectedPlatform);
    }

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter((ad) => ad.status === selectedStatus);
    }

    // Sort ads
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "performance":
          return b.roas - a.roas;
        case "spend":
          return b.spent - a.spent;
        case "date":
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredAds(filtered);
  };

  const handleAdSelect = (ad: ExistingAd) => {
    setSelectedAd(ad);
    setShowAnalysis(true);
  };

  const handleImproveAd = (ad: ExistingAd) => {
    onAdSelected(ad);
    onClose();
  };

  const getPerformanceColor = (
    value: number,
    type: "ctr" | "roas" | "engagement"
  ) => {
    if (type === "ctr") {
      return value > 2
        ? "text-green-400"
        : value > 1
        ? "text-yellow-400"
        : "text-red-400";
    }
    if (type === "roas") {
      return value > 3
        ? "text-green-400"
        : value > 2
        ? "text-yellow-400"
        : "text-red-400";
    }
    if (type === "engagement") {
      return value > 3
        ? "text-green-400"
        : value > 2
        ? "text-yellow-400"
        : "text-red-400";
    }
    return "text-white";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "paused":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "completed":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  if (!isOpen) return null;

  return (
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
        className="bg-gray-900 rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Select Existing Ad to Improve
              </h2>
              <p className="text-white/70">
                Choose an ad to analyze and optimize for better performance
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

        {/* Filters */}
        <div className="p-6 border-b border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
              <input
                type="text"
                placeholder="Search ads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value as any)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Platforms</option>
              <option value="facebook">Facebook</option>
              <option value="google">Google</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="performance">Sort by Performance</option>
              <option value="spend">Sort by Spend</option>
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>
        </div>

        {/* Ads List */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 text-white/50 animate-spin" />
              <span className="ml-3 text-white/70">Loading ads...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="text-red-400 mb-4">
                  <AlertCircle className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Error Loading Ads
                </h3>
                <p className="text-gray-400 mb-4">{error}</p>
                <button
                  onClick={fetchAds}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : connectedAccounts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Connect Your Ad Accounts
              </h3>
              <p className="text-white/70 mb-6 max-w-md mx-auto">
                To view and select your existing ads, you need to connect your
                Facebook and Google Ads accounts first.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    onClose();
                    onConnectAccount?.();
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Target className="w-5 h-5" />
                  <span>Connect Accounts</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : filteredAds.length === 0 ? (
            <div className="text-center py-12">
              <Target className="w-12 h-12 text-white/30 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                No ads found
              </h3>
              <p className="text-white/70">
                Try adjusting your filters or search terms
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAds.map((ad) => (
                <motion.div
                  key={ad.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/70 transition-colors cursor-pointer"
                  onClick={() => handleAdSelect(ad)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-lg ${
                          ad.platform === "facebook"
                            ? "bg-blue-500/20"
                            : "bg-green-500/20"
                        }`}
                      >
                        {ad.platform === "facebook" ? (
                          <Facebook className="w-5 h-5 text-blue-400" />
                        ) : (
                          <SearchIcon className="w-5 h-5 text-green-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{ad.name}</h3>
                        <p className="text-sm text-white/70 capitalize">
                          {ad.platform} • {ad.objective}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(
                          ad.status
                        )}`}
                      >
                        {ad.status}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-white font-medium mb-1">
                      {ad.headline}
                    </h4>
                    <p className="text-white/70 text-sm line-clamp-2">
                      {ad.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-white/70 text-xs">Impressions</div>
                      <div className="text-white font-semibold">
                        {ad.impressions.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-white/70 text-xs">Clicks</div>
                      <div className="text-white font-semibold">
                        {ad.clicks.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-white/70 text-xs">CTR</div>
                      <div
                        className={`font-semibold ${getPerformanceColor(
                          ad.ctr,
                          "ctr"
                        )}`}
                      >
                        {ad.ctr.toFixed(2)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-white/70 text-xs">ROAS</div>
                      <div
                        className={`font-semibold ${getPerformanceColor(
                          ad.roas,
                          "roas"
                        )}`}
                      >
                        {ad.roas.toFixed(1)}x
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-white/70 text-sm">
                      Spent: ${ad.spent.toLocaleString()}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImproveAd(ad);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                    >
                      <Brain className="w-4 h-4" />
                      <span>Improve Ad</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
