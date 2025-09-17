"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
  Stopwatch,
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
  Stopwatch as StopwatchIcon,
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

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/dashboard");
        if (response.ok) {
          const data = await response.json();
          setStats(
            data.stats || {
              totalUsers: 0,
              totalRevenue: 0,
              activeCampaigns: 0,
              totalClicks: 0,
              conversionRate: 0,
              avgSessionTime: "0m 0s",
              serverUptime: "0%",
              apiCalls: 0,
            }
          );
          setChartData(data.chartData || []);
          setRecentActivity(data.recentActivity || []);

          if (data.message) {
            console.log("Dashboard data message:", data.message);
          }
        } else {
          const errorData = await response.json();
          console.error("Failed to fetch dashboard data:", errorData);
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
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-white/70">
            Welcome back! Here's what's happening with your platform.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">
              Revenue Overview
            </h3>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300">
                <BarChart3 className="w-4 h-4" />
              </button>
              <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300">
                <PieChart className="w-4 h-4" />
              </button>
              <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300">
                <LineChart className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <p className="text-white/70">
                Revenue chart will be displayed here
              </p>
            </div>
          </div>
        </motion.div>

        {/* Platform Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
        >
          <h3 className="text-xl font-semibold text-white mb-6">
            Platform Distribution
          </h3>
          <div className="space-y-4">
            {chartData.map((platform, index) => (
              <div
                key={platform.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 ${platform.color} rounded-full`} />
                  <span className="text-white font-medium">
                    {platform.name}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-white/10 rounded-full h-2">
                    <div
                      className={`h-2 ${platform.color} rounded-full transition-all duration-500`}
                      style={{ width: `${platform.value}%` }}
                    />
                  </div>
                  <span className="text-white/70 text-sm w-8 text-right">
                    {platform.value}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* System Health and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Health */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
        >
          <h3 className="text-xl font-semibold text-white mb-6">
            System Health
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/70 text-sm">CPU Usage</span>
                <span className="text-white font-medium">
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
                <span className="text-white/70 text-sm">Memory Usage</span>
                <span className="text-white font-medium">
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
                <span className="text-white/70 text-sm">Disk Usage</span>
                <span className="text-white font-medium">
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
                <span className="text-white/70 text-sm">Network</span>
                <span className="text-white font-medium">
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
          className="lg:col-span-2 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">
              Recent Activity
            </h3>
            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => {
              const Icon = getActivityIcon(activity.type);
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center space-x-3 p-3 rounded-lg border ${getStatusColor(
                    activity.status
                  )}`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm">{activity.message}</p>
                    <p className="text-white/50 text-xs">
                      {activity.timestamp}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    {activity.status === "success" && (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    )}
                    {activity.status === "warning" && (
                      <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    )}
                    {activity.status === "error" && (
                      <AlertTriangle className="w-4 h-4 text-red-400" />
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
        className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
                className={`p-4 ${action.bgColor} border border-white/10 rounded-lg hover:border-white/20 transition-all duration-300`}
              >
                <Icon className={`w-6 h-6 ${action.color} mx-auto mb-2`} />
                <p className="text-white text-sm font-medium">{action.name}</p>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
