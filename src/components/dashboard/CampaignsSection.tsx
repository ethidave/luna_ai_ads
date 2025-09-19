"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  Play,
  Pause,
  Square,
  Edit,
  Trash2,
  MoreHorizontal,
  Plus,
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer,
  Users,
  DollarSign,
  Calendar,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  ExternalLink,
  Filter,
  Search,
  Download,
  Settings,
  Star,
  AlertCircle,
  CheckCircle,
  X,
  Facebook,
  RefreshCw,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import AdAnalysisModal from "./AdAnalysisModal";

interface Campaign {
  id: number;
  name: string;
  description?: string;
  status: "draft" | "pending" | "active" | "paused" | "ended" | "rejected";
  budget: number;
  spent: number;
  platforms: string; // JSON string
  objective: string;
  targetAudience: string; // JSON string
  creative: string; // JSON string
  schedule: string; // JSON string
  settings: string; // JSON string
  performance?: {
    impressions: number;
    clicks: number;
    conversions: number;
    spend: number;
    ctr: number;
    cpc: number;
    roas: number;
  };
  startDate?: string;
  endDate?: string;
  budgetType: "daily" | "lifetime";
  externalCampaignId?: string;
  createdAt: string;
  updatedAt: string;
}

interface CampaignsSectionProps {
  campaigns: Campaign[];
  selectedCampaign: Campaign | null;
  setSelectedCampaign: (campaign: Campaign | null) => void;
  campaignAnalytics: Record<string, unknown>[];
  isLoading: boolean;
  onCreateCampaign?: () => void;
  connectedAccounts?: Record<string, unknown>[];
  onAnalyzeAd?: (adId: string) => void;
  onGenerateTags?: (adId: string) => void;
  onOptimizeAd?: (adId: string) => void;
}

export default function CampaignsSection({
  campaigns,
  selectedCampaign,
  setSelectedCampaign,
  campaignAnalytics,
  isLoading,
  onCreateCampaign,
  connectedAccounts = [],
  onAnalyzeAd,
  onGenerateTags,
  onOptimizeAd,
}: CampaignsSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAd, setSelectedAd] = useState<Record<string, unknown> | null>(
    null
  );

  // Helper functions to parse campaign data
  const getCampaignPlatforms = (campaign: Campaign) => {
    try {
      const platforms = JSON.parse(campaign.platforms);
      return Array.isArray(platforms) ? platforms : [campaign.platforms];
    } catch {
      return [campaign.platforms];
    }
  };

  const getCampaignPerformance = (campaign: Campaign) => {
    if (campaign.performance) {
      return campaign.performance;
    }
    // Fallback to basic calculations
    return {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      spend: campaign.spent || 0,
      ctr: 0,
      cpc: 0,
      roas: 0,
    };
  };

  const getCampaignType = (campaign: Campaign) => {
    try {
      const platforms = getCampaignPlatforms(campaign);
      if (platforms.includes("facebook") || platforms.includes("instagram")) {
        return "Social";
      } else if (platforms.includes("google_search")) {
        return "Search";
      } else if (platforms.includes("google_display")) {
        return "Display";
      } else if (platforms.includes("youtube")) {
        return "Video";
      }
      return "Other";
    } catch {
      return "Other";
    }
  };

  const getCampaignPlatform = (campaign: Campaign) => {
    try {
      const platforms = getCampaignPlatforms(campaign);
      if (platforms.includes("facebook")) return "Facebook Ads";
      if (platforms.includes("instagram")) return "Instagram Ads";
      if (
        platforms.includes("google_search") ||
        platforms.includes("google_display")
      )
        return "Google Ads";
      if (platforms.includes("youtube")) return "YouTube Ads";
      return platforms[0] || "Unknown";
    } catch {
      return "Unknown";
    }
  };

  // Filter and sort campaigns
  const filteredCampaigns = campaigns
    .filter((campaign) => {
      const matchesSearch = campaign.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || campaign.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const aPerformance = getCampaignPerformance(a);
      const bPerformance = getCampaignPerformance(b);

      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "spend":
          return bPerformance.spend - aPerformance.spend;
        case "roas":
          return bPerformance.roas - aPerformance.roas;
        case "ctr":
          return bPerformance.ctr - aPerformance.ctr;
        default:
          return 0;
      }
    });

  const handleCampaignAction = (campaign: Campaign, action: string) => {
    console.log(`${action} campaign:`, campaign.name);
    // Implement campaign actions
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "paused":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "completed":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getPerformanceColor = (value: number, type: "ctr" | "roas") => {
    if (type === "ctr") {
      return value >= 3
        ? "text-green-400"
        : value >= 1
        ? "text-yellow-400"
        : "text-red-400";
    } else {
      return value >= 4
        ? "text-green-400"
        : value >= 2
        ? "text-yellow-400"
        : "text-red-400";
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Campaigns</h2>
          <p className="text-white/70 text-sm sm:text-base">
            Manage and monitor your advertising campaigns
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={onCreateCampaign || (() => setShowCreateModal(true))}
            className="flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 touch-manipulation"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">New Campaign</span>
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            >
              <option value="name">Sort by Name</option>
              <option value="spend">Sort by Spend</option>
              <option value="roas">Sort by ROAS</option>
              <option value="ctr">Sort by CTR</option>
            </select>
            <div className="flex bg-white/10 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 sm:p-2 rounded-md transition-all duration-300 touch-manipulation ${
                  viewMode === "grid"
                    ? "bg-white/20 text-white"
                    : "text-white/70 hover:text-white"
                }`}
              >
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 sm:p-2 rounded-md transition-all duration-300 touch-manipulation ${
                  viewMode === "list"
                    ? "bg-white/20 text-white"
                    : "text-white/70 hover:text-white"
                }`}
              >
                <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Real Ads from Connected Accounts */}
      {campaignAnalytics.length > 0 && (
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Your Posted Ads
              </h3>
              <p className="text-white/70 text-sm sm:text-base">
                Real ads from your connected Facebook and Google accounts
              </p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <div className="text-xs sm:text-sm text-white/70">
                {campaignAnalytics.length} ads from {connectedAccounts.length}{" "}
                account{connectedAccounts.length > 1 ? "s" : ""}
              </div>
              <button
                onClick={() => window.location.reload()}
                className="px-3 sm:px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300 flex items-center space-x-2 touch-manipulation"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="text-sm sm:text-base">Refresh</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {campaignAnalytics.map((ad, index) => (
              <motion.div
                key={String(ad.id || ad.platformAdId || index)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6 hover:bg-white/10 transition-all duration-300 group"
              >
                {/* Ad Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      {ad.platform === "facebook" ? (
                        <Facebook className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      ) : (
                        <Search className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-base sm:text-lg font-semibold text-white truncate">
                        {ad.name as string}
                      </h4>
                      <p className="text-white/70 text-xs sm:text-sm capitalize">
                        {ad.platform as string} • {ad.status as string}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        ad.status === "active"
                          ? "bg-green-400"
                          : ad.status === "paused"
                          ? "bg-yellow-400"
                          : "bg-red-400"
                      }`}
                    />
                    <span className="text-white/70 text-xs sm:text-sm capitalize">
                      {String(ad.status)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4">
                  <div className="bg-white/5 rounded-lg p-2 sm:p-3">
                    <div className="text-white/70 text-xs sm:text-sm">Impressions</div>
                    <div className="text-white font-semibold text-sm sm:text-lg">
                      {typeof ad.impressions === "number"
                        ? ad.impressions.toLocaleString()
                        : "0"}
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2 sm:p-3">
                    <div className="text-white/70 text-xs sm:text-sm">Clicks</div>
                    <div className="text-white font-semibold text-sm sm:text-lg">
                      {typeof ad.clicks === "number"
                        ? ad.clicks.toLocaleString()
                        : "0"}
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2 sm:p-3">
                    <div className="text-white/70 text-xs sm:text-sm">CTR</div>
                    <div className="text-white font-semibold text-sm sm:text-lg">
                      {typeof ad.ctr === "number"
                        ? `${ad.ctr.toFixed(2)}%`
                        : "0%"}
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2 sm:p-3">
                    <div className="text-white/70 text-xs sm:text-sm">Spend</div>
                    <div className="text-white font-semibold text-sm sm:text-lg">
                      $
                      {typeof ad.spent === "number" ? ad.spent.toFixed(2) : "0"}
                    </div>
                  </div>
                </div>

                {/* AI Analysis */}
                {typeof ad.performanceScore === "number" && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/70 text-xs sm:text-sm">
                        AI Performance Score
                      </span>
                      <span className="text-white font-semibold text-sm sm:text-base">
                        {ad.performanceScore}/100
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          ad.performanceScore >= 80
                            ? "bg-green-500"
                            : ad.performanceScore >= 60
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${ad.performanceScore}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <button
                    onClick={() => setSelectedAd(ad)}
                    className="flex-1 px-3 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300 text-xs sm:text-sm font-medium touch-manipulation"
                  >
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" />
                    View Details
                  </button>
                  {onAnalyzeAd && (
                    <button
                      onClick={() =>
                        onAnalyzeAd(String(ad.id || ad.platformAdId || ""))
                      }
                      className="flex-1 px-3 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-all duration-300 text-xs sm:text-sm font-medium touch-manipulation"
                    >
                      <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" />
                      Analyze
                    </button>
                  )}
                  {onGenerateTags && (
                    <button
                      onClick={() =>
                        onGenerateTags(String(ad.id || ad.platformAdId || ""))
                      }
                      className="flex-1 px-3 py-2 bg-purple-600/20 text-purple-400 rounded-lg hover:bg-purple-600/30 transition-all duration-300 text-xs sm:text-sm font-medium touch-manipulation"
                    >
                      <Target className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" />
                      Tags
                    </button>
                  )}
                  {onOptimizeAd && (
                    <button
                      onClick={() =>
                        onOptimizeAd(String(ad.id || ad.platformAdId || ""))
                      }
                      className="flex-1 px-3 py-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition-all duration-300 text-xs sm:text-sm font-medium touch-manipulation"
                    >
                      <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" />
                      Optimize
                    </button>
                  )}
                </div>

                {/* Optimization Suggestions */}
                {Array.isArray(ad.optimizationSuggestions) &&
                  ad.optimizationSuggestions.length > 0 && (
                    <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <div className="text-yellow-400 text-sm font-medium mb-1">
                        AI Suggestions:
                      </div>
                      <div className="text-white/70 text-sm">
                        {String(ad.optimizationSuggestions[0])}
                      </div>
                    </div>
                  )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Campaigns Grid/List */}
      {filteredCampaigns.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-12 text-center">
          <Target className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No Campaigns Found
          </h3>
          <p className="text-white/70 mb-6">
            {searchTerm || statusFilter !== "all"
              ? "No campaigns match your current filters."
              : "Create your first campaign to get started."}
          </p>
          <button
            onClick={onCreateCampaign || (() => setShowCreateModal(true))}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
          >
            Create Campaign
          </button>
        </div>
      ) : (
        <div
          className={`grid gap-6 ${
            viewMode === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          }`}
        >
          {filteredCampaigns.map((campaign, index) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 group cursor-pointer ${
                selectedCampaign?.id === campaign.id
                  ? "ring-2 ring-blue-500"
                  : ""
              }`}
              onClick={() => setSelectedCampaign(campaign)}
            >
              {viewMode === "grid" ? (
                // Grid View
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {campaign.name}
                        </h3>
                        <p className="text-white/70 text-sm">
                          {getCampaignType(campaign)} •{" "}
                          {getCampaignPlatform(campaign)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(
                          campaign.status
                        )}`}
                      >
                        {campaign.status}
                      </span>
                      <button className="p-1 text-white/70 hover:text-white transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {(() => {
                      const performance = getCampaignPerformance(campaign);
                      return (
                        <>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-white">
                              ${performance.spend.toLocaleString()}
                            </div>
                            <div className="text-white/70 text-sm">Spent</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-white">
                              {performance.impressions.toLocaleString()}
                            </div>
                            <div className="text-white/70 text-sm">
                              Impressions
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-white">
                              {performance.clicks.toLocaleString()}
                            </div>
                            <div className="text-white/70 text-sm">Clicks</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-white">
                              {performance.conversions.toLocaleString()}
                            </div>
                            <div className="text-white/70 text-sm">
                              Conversions
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {(() => {
                        const performance = getCampaignPerformance(campaign);
                        return (
                          <>
                            <div className="text-center">
                              <div
                                className={`text-lg font-bold ${getPerformanceColor(
                                  performance.ctr,
                                  "ctr"
                                )}`}
                              >
                                {performance.ctr.toFixed(2)}%
                              </div>
                              <div className="text-white/70 text-xs">CTR</div>
                            </div>
                            <div className="text-center">
                              <div
                                className={`text-lg font-bold ${getPerformanceColor(
                                  performance.roas,
                                  "roas"
                                )}`}
                              >
                                {performance.roas.toFixed(1)}x
                              </div>
                              <div className="text-white/70 text-xs">ROAS</div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCampaignAction(
                            campaign,
                            campaign.status === "active" ? "pause" : "play"
                          );
                        }}
                        className="p-2 text-white/70 hover:text-white transition-colors"
                      >
                        {campaign.status === "active" ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCampaignAction(campaign, "edit");
                        }}
                        className="p-2 text-white/70 hover:text-white transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                // List View
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {campaign.name}
                      </h3>
                      <p className="text-white/70 text-sm">
                        {getCampaignType(campaign)} •{" "}
                        {getCampaignPlatform(campaign)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-8">
                    {(() => {
                      const performance = getCampaignPerformance(campaign);
                      return (
                        <>
                          <div className="text-center">
                            <div className="text-lg font-bold text-white">
                              ${performance.spend.toLocaleString()}
                            </div>
                            <div className="text-white/70 text-xs">Spent</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-white">
                              {performance.impressions.toLocaleString()}
                            </div>
                            <div className="text-white/70 text-xs">
                              Impressions
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-white">
                              {performance.clicks.toLocaleString()}
                            </div>
                            <div className="text-white/70 text-xs">Clicks</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-white">
                              {performance.conversions.toLocaleString()}
                            </div>
                            <div className="text-white/70 text-xs">
                              Conversions
                            </div>
                          </div>
                          <div className="text-center">
                            <div
                              className={`text-lg font-bold ${getPerformanceColor(
                                performance.ctr,
                                "ctr"
                              )}`}
                            >
                              {performance.ctr.toFixed(2)}%
                            </div>
                            <div className="text-white/70 text-xs">CTR</div>
                          </div>
                          <div className="text-center">
                            <div
                              className={`text-lg font-bold ${getPerformanceColor(
                                performance.roas,
                                "roas"
                              )}`}
                            >
                              {performance.roas.toFixed(1)}x
                            </div>
                            <div className="text-white/70 text-xs">ROAS</div>
                          </div>
                        </>
                      );
                    })()}
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(
                          campaign.status
                        )}`}
                      >
                        {campaign.status}
                      </span>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCampaignAction(
                              campaign,
                              campaign.status === "active" ? "pause" : "play"
                            );
                          }}
                          className="p-2 text-white/70 hover:text-white transition-colors"
                        >
                          {campaign.status === "active" ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCampaignAction(campaign, "edit");
                          }}
                          className="p-2 text-white/70 hover:text-white transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-white/70 hover:text-white transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Campaign Details Modal */}
      <AnimatePresence>
        {selectedCampaign && (
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
                <h3 className="text-2xl font-bold text-white">
                  {selectedCampaign.name}
                </h3>
                <button
                  onClick={() => setSelectedCampaign(null)}
                  className="p-2 text-white/70 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Campaign Analytics Chart */}
                <div className="bg-white/5 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">
                    Performance Over Time
                  </h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={campaignAnalytics}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.1)"
                      />
                      <XAxis dataKey="date" stroke="rgba(255,255,255,0.7)" />
                      <YAxis stroke="rgba(255,255,255,0.7)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(0,0,0,0.8)",
                          border: "1px solid rgba(255,255,255,0.2)",
                          borderRadius: "8px",
                          color: "white",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="impressions"
                        stackId="1"
                        stroke="#3B82F6"
                        fill="url(#colorImpressions)"
                      />
                      <Area
                        type="monotone"
                        dataKey="clicks"
                        stackId="2"
                        stroke="#10B981"
                        fill="url(#colorClicks)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Campaign Details */}
                <div className="space-y-6">
                  <div className="bg-white/5 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-white mb-4">
                      Campaign Details
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-white/70">Status:</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(
                            selectedCampaign.status
                          )}`}
                        >
                          {selectedCampaign.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Budget:</span>
                        <span className="text-white">
                          ${selectedCampaign.budget.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Spent:</span>
                        <span className="text-white">
                          ${selectedCampaign.spent.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Platform:</span>
                        <span className="text-white">
                          {getCampaignPlatform(selectedCampaign)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Type:</span>
                        <span className="text-white">
                          {getCampaignType(selectedCampaign)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-white mb-4">
                      Performance Metrics
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      {(() => {
                        const performance =
                          getCampaignPerformance(selectedCampaign);
                        return (
                          <>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-white">
                                {performance.impressions.toLocaleString()}
                              </div>
                              <div className="text-white/70 text-sm">
                                Impressions
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-white">
                                {performance.clicks.toLocaleString()}
                              </div>
                              <div className="text-white/70 text-sm">
                                Clicks
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-white">
                                {performance.conversions}
                              </div>
                              <div className="text-white/70 text-sm">
                                Conversions
                              </div>
                            </div>
                            <div className="text-center">
                              <div
                                className={`text-2xl font-bold ${getPerformanceColor(
                                  performance.ctr,
                                  "ctr"
                                )}`}
                              >
                                {performance.ctr.toFixed(2)}%
                              </div>
                              <div className="text-white/70 text-sm">CTR</div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ad Analysis Modal */}
      <AdAnalysisModal
        isOpen={!!selectedAd}
        onClose={() => setSelectedAd(null)}
        ad={selectedAd || {}}
        onAnalyze={onAnalyzeAd}
        onGenerateTags={onGenerateTags}
        onOptimize={onOptimizeAd}
      />
    </div>
  );
}
