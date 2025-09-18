"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  RefreshCw,
  Calendar,
  Download,
} from "lucide-react";
import { useAdminApi } from "@/hooks/useAdminApi";
import {
  AdminErrorBoundary,
  ErrorMessage,
  NoDataMessage,
  LoadingSpinner,
} from "@/components/admin/ErrorBoundary";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d");
  const [success, setSuccess] = useState("");

  const { loading, error, getAnalytics, clearError } = useAdminApi();

  const [analyticsData, setAnalyticsData] = useState<any>(null);

  // Fetch analytics data
  const fetchAnalytics = async () => {
    const data = await getAnalytics(timeRange);
    if (data) {
      setAnalyticsData(data);
      setSuccess("Analytics data loaded successfully");
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const handleRefresh = () => {
    fetchAnalytics();
  };

  const handleExport = () => {
    if (!analyticsData) return;

    const csvContent = [
      ["Metric", "Value"],
      ["Total Revenue", analyticsData.analytics?.totalRevenue || 0],
      ["Total Users", analyticsData.analytics?.totalUsers || 0],
      ["Total Campaigns", analyticsData.analytics?.totalCampaigns || 0],
      ["Total Clicks", analyticsData.analytics?.totalClicks || 0],
      ["Conversion Rate", analyticsData.analytics?.conversionRate || 0],
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-${timeRange}-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <AdminErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-white/70">Track performance and key metrics</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300 flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300 flex items-center space-x-2 disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center space-x-3">
            <div className="w-5 h-5 text-green-400">✓</div>
            <span className="text-green-400">{success}</span>
          </div>
        )}

        {/* Error Message */}
        <ErrorMessage error={error} onRetry={handleRefresh} />

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* No Data State */}
        {!loading && !error && !analyticsData && (
          <NoDataMessage
            title="No analytics data available"
            description="There are no analytics to display for the selected time range."
            action={
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Refresh Data
              </button>
            }
          />
        )}

        {/* Analytics Content */}
        {analyticsData && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">Total Revenue</p>
                    <p className="text-2xl font-bold text-white">
                      $
                      {analyticsData.analytics?.totalRevenue?.toLocaleString() ||
                        "0"}
                    </p>
                    <p className="text-green-400 text-sm flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />+
                      {analyticsData.analytics?.revenueGrowth || 0}%
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-400" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">Total Users</p>
                    <p className="text-2xl font-bold text-white">
                      {analyticsData.analytics?.totalUsers?.toLocaleString() ||
                        "0"}
                    </p>
                    <p className="text-blue-400 text-sm flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />+
                      {analyticsData.analytics?.userGrowth || 0}%
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-blue-400" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">Total Campaigns</p>
                    <p className="text-2xl font-bold text-white">
                      {analyticsData.analytics?.totalCampaigns?.toLocaleString() ||
                        "0"}
                    </p>
                    <p className="text-purple-400 text-sm flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />+
                      {analyticsData.analytics?.campaignGrowth || 0}%
                    </p>
                  </div>
                  <Target className="w-8 h-8 text-purple-400" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">Total Clicks</p>
                    <p className="text-2xl font-bold text-white">
                      {analyticsData.analytics?.totalClicks?.toLocaleString() ||
                        "0"}
                    </p>
                    <p className="text-orange-400 text-sm flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />+
                      {analyticsData.analytics?.clickGrowth || 0}%
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-orange-400" />
                </div>
              </motion.div>
            </div>

            {/* Platform Distribution */}
            {analyticsData.platformData &&
              analyticsData.platformData.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
                >
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Platform Distribution
                  </h3>
                  <div className="space-y-3">
                    {analyticsData.platformData.map(
                      (platform: any, index: number) => (
                        <div
                          key={platform.name}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-3 h-3 rounded-full ${platform.color}`}
                            ></div>
                            <span className="text-white">{platform.name}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-white font-medium">
                              {platform.value.toLocaleString()}
                            </span>
                            <span className="text-white/70 text-sm ml-2">
                              ({platform.percentage}%)
                            </span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </motion.div>
              )}

            {/* Top Campaigns */}
            {analyticsData.topCampaigns &&
              analyticsData.topCampaigns.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
                >
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Top Campaigns
                  </h3>
                  <div className="space-y-3">
                    {analyticsData.topCampaigns.map(
                      (campaign: any, index: number) => (
                        <div
                          key={campaign.id}
                          className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                        >
                          <div>
                            <span className="text-white font-medium">
                              {campaign.name}
                            </span>
                            <span className="text-white/70 text-sm ml-2">
                              ({campaign.platform})
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-white">
                              ${campaign.spent.toFixed(2)}
                            </span>
                            <span className="text-white/70 text-sm ml-2">
                              of ${campaign.budget}
                            </span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </motion.div>
              )}
          </>
        )}
      </div>
    </AdminErrorBoundary>
  );
}
