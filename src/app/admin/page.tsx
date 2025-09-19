"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { apiUrl } from "@/lib/api-utils";
import {
  Users,
  Package,
  Target,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer,
  CreditCard,
  Activity,
  Calendar,
  Clock,
  Star,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  LineChart,
  Globe,
  Zap,
  Shield,
  Database,
  Server,
  Cpu,
  HardDrive,
  Wifi,
  Monitor,
  Smartphone,
  Tablet,
  RefreshCw,
  Download,
  Upload,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  ExternalLink,
  Lock,
  Unlock,
  Key,
  Layers,
  BarChart,
  TrendingDown as TrendingDownIcon,
  Minus,
  Maximize,
  Minimize,
  RotateCcw,
  Save,
  Copy,
  Share,
  Heart,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Clock3,
  Timer,
  Play,
  Pause,
  Square,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Video,
  VideoOff,
  Image,
  File,
  Folder,
  FolderOpen,
  Archive,
  Bookmark,
  Tag,
  Flag,
  BookmarkCheck,
  BookmarkX,
  Star as StarIcon,
  Heart as HeartIcon,
  ThumbsUp as ThumbsUpIcon,
  ThumbsDown as ThumbsDownIcon,
  MessageCircle as MessageCircleIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MapPin as MapPinIcon,
  Clock3 as Clock3Icon,
  Timer as TimerIcon,
  Play as PlayIcon,
  Pause as PauseIcon,
  Square as SquareIcon,
  SkipForward as SkipForwardIcon,
  SkipBack as SkipBackIcon,
  Volume2 as Volume2Icon,
  VolumeX as VolumeXIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Camera as CameraIcon,
  CameraOff as CameraOffIcon,
  Video as VideoIcon,
  VideoOff as VideoOffIcon,
  Image as ImageIcon,
  File as FileIcon,
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  Archive as ArchiveIcon,
  Bookmark as BookmarkIcon,
  Tag as TagIcon,
  Flag as FlagIcon,
  BookmarkCheck as BookmarkCheckIcon,
  BookmarkX as BookmarkXIcon,
  FileText,
  Settings,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  changeType: "increase" | "decrease";
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  borderColor: string;
}

function StatCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  color,
  bgColor,
  borderColor,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 ${bgColor} border ${borderColor} rounded-xl backdrop-blur-sm`}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 ${bgColor} rounded-lg`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div className="flex items-center space-x-1">
          {changeType === "increase" ? (
            <TrendingUp className="w-4 h-4 text-green-400" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-400" />
          )}
          <span
            className={`text-sm font-medium ${
              changeType === "increase" ? "text-green-400" : "text-red-400"
            }`}
          >
            {Math.abs(change)}%
          </span>
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
        <p className="text-white/70 text-sm">{title}</p>
      </div>
    </motion.div>
  );
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

interface RecentActivity {
  id: string;
  type: "user" | "payment" | "campaign" | "system";
  message: string;
  timestamp: string;
  status: "success" | "warning" | "error";
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRevenue: 0,
    activeCampaigns: 0,
    totalClicks: 0,
    conversionRate: 0,
    avgSessionTime: "0m 0s",
    serverUptime: "0%",
    apiCalls: 0,
  });

  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");
        setSuccess("");

        console.log("🔄 Fetching dashboard data from real API...");

        // Get auth token
        const token = localStorage.getItem("auth_token");
        console.log("🔑 Auth token found:", token ? "Yes" : "No");

        if (!token) {
          throw new Error("No authentication token found. Please login again.");
        }

        const response = await fetch(
          apiUrl('/admin/dashboard'),
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("📊 Dashboard response status:", response.status);
        console.log(
          "📊 Response headers:",
          Object.fromEntries(response.headers.entries())
        );

        if (response.ok) {
          const contentType = response.headers.get("content-type");

          if (!contentType || !contentType.includes("application/json")) {
            throw new Error("Server returned non-JSON response");
          }

          const data = await response.json();
          console.log("📊 Dashboard data received:", data);

          if (data.success) {
            const statsData = data.stats || {};
            console.log("📊 Stats data:", statsData);

            setStats({
              totalUsers: statsData.totalUsers || 0,
              totalRevenue: statsData.totalRevenue || 0,
              activeCampaigns: statsData.activeCampaigns || 0,
              totalClicks: statsData.totalClicks || 0,
              conversionRate: statsData.conversionRate || 0,
              avgSessionTime: statsData.avgSessionTime || "0m 0s",
              serverUptime: statsData.serverUptime || "0%",
              apiCalls: statsData.apiCalls || 0,
            });

            setChartData(data.chartData || []);
            setRecentActivity(data.recentActivity || []);

            console.log("✅ Dashboard data loaded successfully");
            setSuccess("Dashboard data loaded successfully");
            setTimeout(() => setSuccess(""), 3000);
          } else {
            throw new Error(data.message || "Failed to load dashboard data");
          }
        } else if (response.status === 401) {
          console.error("❌ Authentication failed - token may be expired");
          throw new Error("Authentication failed. Please login again.");
        } else if (response.status === 403) {
          console.error("❌ Access denied - admin privileges required");
          throw new Error("Access denied. Admin privileges required.");
        } else if (response.status === 500) {
          console.error("❌ Server error");
          throw new Error("Server error. Please try again later.");
        } else {
          const errorText = await response.text();
          console.error("❌ Request failed:", response.status, errorText);
          throw new Error(`Request failed: ${response.status} - ${errorText}`);
        }
      } catch (error) {
        console.error("❌ Error fetching dashboard data:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to load dashboard data";
        setError(errorMessage);

        // Set empty data on error
        setStats({
          totalUsers: 0,
          totalRevenue: 0,
          activeCampaigns: 0,
          totalClicks: 0,
          conversionRate: 0,
          avgSessionTime: "0m 0s",
          serverUptime: "0%",
          apiCalls: 0,
        });
        setChartData([]);
        setRecentActivity([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const [systemHealth, setSystemHealth] = useState({
    cpu: 45,
    memory: 67,
    disk: 23,
    network: 89,
  });

  const refreshDashboard = async () => {
    console.log("🔄 Refreshing dashboard data...");
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }

      const response = await fetch(
        apiUrl('/admin/dashboard'),
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const statsData = data.stats || {};
          setStats({
            totalUsers: statsData.totalUsers || 0,
            totalRevenue: statsData.totalRevenue || 0,
            activeCampaigns: statsData.activeCampaigns || 0,
            totalClicks: statsData.totalClicks || 0,
            conversionRate: statsData.conversionRate || 0,
            avgSessionTime: statsData.avgSessionTime || "0m 0s",
            serverUptime: statsData.serverUptime || "0%",
            apiCalls: statsData.apiCalls || 0,
          });
          setChartData(data.chartData || []);
          setRecentActivity(data.recentActivity || []);
          setSuccess("Dashboard data refreshed successfully");
          setTimeout(() => setSuccess(""), 3000);
        } else {
          throw new Error(data.message || "Failed to refresh dashboard data");
        }
      } else {
        throw new Error(`Failed to refresh data: ${response.status}`);
      }
    } catch (error) {
      console.error("Error refreshing dashboard:", error);
      setError(
        error instanceof Error ? error.message : "Failed to refresh dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user":
        return Users;
      case "payment":
        return CreditCard;
      case "campaign":
        return Target;
      case "system":
        return Server;
      default:
        return Activity;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-400 bg-green-500/10 border-green-500/20";
      case "warning":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
      case "error":
        return "text-red-400 bg-red-500/10 border-red-500/20";
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-white/70">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-white/70 text-sm sm:text-base">
            Welcome back! Here's what's happening with your platform.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          <button className="px-3 sm:px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-2 touch-manipulation">
            <Download className="w-4 h-4" />
            <span className="text-sm sm:text-base">Export Data</span>
          </button>
          <button
            onClick={refreshDashboard}
            disabled={loading}
            className="px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span className="text-sm sm:text-base">{loading ? "Refreshing..." : "Refresh"}</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center space-x-3">
          <div className="flex-shrink-0">
            <svg
              className="w-5 h-5 text-red-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-red-400">Error</h3>
            <p className="text-sm text-red-300">{error}</p>
          </div>
          <button
            onClick={() => setError("")}
            className="ml-auto text-red-400 hover:text-red-300"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center space-x-3">
          <div className="flex-shrink-0">
            <svg
              className="w-5 h-5 text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-green-400">Success</h3>
            <p className="text-sm text-green-300">{success}</p>
          </div>
          <button
            onClick={() => setSuccess("")}
            className="ml-auto text-green-400 hover:text-green-300"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/70">Loading dashboard data...</p>
          </div>
        </div>
      )}

      {/* No Data State */}
      {!loading &&
        !error &&
        stats.totalUsers === 0 &&
        stats.totalRevenue === 0 &&
        stats.activeCampaigns === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">
              No Data Available
            </h3>
            <p className="text-white/70 mb-4">
              There's no data to display in the dashboard yet. This could mean:
            </p>
            <ul className="text-white/60 text-sm mb-6 space-y-1">
              <li>• No users have registered yet</li>
              <li>• No campaigns have been created</li>
              <li>• No revenue has been generated</li>
              <li>• Database is empty or not connected</li>
            </ul>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Refresh Data
              </button>
              <button
                onClick={() => {
                  console.log("Current stats:", stats);
                  console.log("Chart data:", chartData);
                  console.log("Recent activity:", recentActivity);
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Debug Info
              </button>
            </div>
          </div>
        )}

      {/* Stats Grid */}
      {!loading && !error && stats.totalUsers > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            change={12.5}
            changeType="increase"
            icon={Users}
            color="text-blue-400"
            bgColor="bg-blue-500/10"
            borderColor="border-blue-500/20"
          />
          <StatCard
            title="Total Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            change={8.3}
            changeType="increase"
            icon={DollarSign}
            color="text-green-400"
            bgColor="bg-green-500/10"
            borderColor="border-green-500/20"
          />
          <StatCard
            title="Active Campaigns"
            value={stats.activeCampaigns}
            change={-2.1}
            changeType="decrease"
            icon={Target}
            color="text-orange-400"
            bgColor="bg-orange-500/10"
            borderColor="border-orange-500/20"
          />
          <StatCard
            title="Total Clicks"
            value={stats.totalClicks.toLocaleString()}
            change={15.7}
            changeType="increase"
            icon={MousePointer}
            color="text-purple-400"
            bgColor="bg-purple-500/10"
            borderColor="border-purple-500/20"
          />
        </div>
      )}

      {/* Data Summary */}
      {!loading &&
        !error &&
        (stats.totalUsers > 0 ||
          stats.totalRevenue > 0 ||
          stats.activeCampaigns > 0) && (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Data Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/70 mb-2">Database Status</div>
                <div className="text-green-400 font-medium">
                  Connected & Active
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/70 mb-2">Last Updated</div>
                <div className="text-white font-medium">
                  {new Date().toLocaleString()}
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/70 mb-2">Data Source</div>
                <div className="text-blue-400 font-medium">
                  Laravel Backend API
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Charts and Analytics */}
      {!loading && !error && stats.totalUsers > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 sm:p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2">
              <h3 className="text-lg sm:text-xl font-semibold text-white">
                Revenue Overview
              </h3>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 touch-manipulation">
                  <BarChart3 className="w-4 h-4" />
                </button>
                <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 touch-manipulation">
                  <PieChart className="w-4 h-4" />
                </button>
                <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 touch-manipulation">
                  <LineChart className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="h-48 sm:h-64 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 sm:w-16 sm:h-16 text-white/30 mx-auto mb-4" />
                <p className="text-white/70 text-sm sm:text-base">
                  Revenue chart will be displayed here
                </p>
              </div>
            </div>
          </motion.div>

          {/* Platform Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 sm:p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">
              Platform Distribution
            </h3>
            <div className="space-y-3 sm:space-y-4">
              {chartData.map((platform, index) => (
                <div
                  key={platform.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                    <div className={`w-3 h-3 sm:w-4 sm:h-4 ${platform.color} rounded-full flex-shrink-0`} />
                    <span className="text-white font-medium text-sm sm:text-base truncate">
                      {platform.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                    <div className="w-20 sm:w-32 bg-white/10 rounded-full h-2">
                      <div
                        className={`h-2 ${platform.color} rounded-full transition-all duration-500`}
                        style={{ width: `${platform.value}%` }}
                      />
                    </div>
                    <span className="text-white/70 text-xs sm:text-sm w-6 sm:w-8 text-right">
                      {platform.value}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* System Health and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* System Health */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 sm:p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
            >
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">
                System Health
              </h3>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/70 text-xs sm:text-sm">CPU Usage</span>
                    <span className="text-white font-medium text-sm sm:text-base">
                      {systemHealth.cpu}%
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${systemHealth.cpu}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/70 text-xs sm:text-sm">Memory Usage</span>
                    <span className="text-white font-medium text-sm sm:text-base">
                      {systemHealth.memory}%
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${systemHealth.memory}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/70 text-xs sm:text-sm">Disk Usage</span>
                    <span className="text-white font-medium text-sm sm:text-base">
                      {systemHealth.disk}%
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${systemHealth.disk}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/70 text-xs sm:text-sm">Network</span>
                    <span className="text-white font-medium text-sm sm:text-base">
                      {systemHealth.network}%
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${systemHealth.network}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 p-4 sm:p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2">
                <h3 className="text-lg sm:text-xl font-semibold text-white">
                  Recent Activity
                </h3>
                <button className="text-blue-400 hover:text-blue-300 text-sm font-medium touch-manipulation">
                  View All
                </button>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {recentActivity.map((activity, index) => {
                  const Icon = getActivityIcon(activity.type);
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg border ${getStatusColor(
                        activity.status
                      )}`}
                    >
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs sm:text-sm">{activity.message}</p>
                        <p className="text-white/50 text-xs">
                          {activity.timestamp}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        {activity.status === "success" && (
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                        )}
                        {activity.status === "warning" && (
                          <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                        )}
                        {activity.status === "error" && (
                          <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 sm:p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {[
                {
                  name: "Add User",
                  icon: Plus,
                  color: "text-blue-400",
                  bgColor: "bg-blue-500/10",
                },
                {
                  name: "Create Campaign",
                  icon: Target,
                  color: "text-green-400",
                  bgColor: "bg-green-500/10",
                },
                {
                  name: "View Reports",
                  icon: FileText,
                  color: "text-purple-400",
                  bgColor: "bg-purple-500/10",
                },
                {
                  name: "System Settings",
                  icon: Settings,
                  color: "text-orange-400",
                  bgColor: "bg-orange-500/10",
                },
                {
                  name: "Backup Data",
                  icon: Database,
                  color: "text-cyan-400",
                  bgColor: "bg-cyan-500/10",
                },
                {
                  name: "Security Logs",
                  icon: Shield,
                  color: "text-red-400",
                  bgColor: "bg-red-500/10",
                },
              ].map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.button
                    key={action.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-3 sm:p-4 ${action.bgColor} border border-white/10 rounded-lg hover:border-white/20 transition-all duration-300 touch-manipulation`}
                  >
                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${action.color} mx-auto mb-1 sm:mb-2`} />
                    <p className="text-white text-xs sm:text-sm font-medium">
                      {action.name}
                    </p>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
