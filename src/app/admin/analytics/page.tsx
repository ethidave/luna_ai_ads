"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  MousePointer,
  Eye,
  Target,
  Calendar,
  Clock,
  Globe,
  Facebook,
  Search as GoogleIcon,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Video as Tiktok,
  Camera as Snapchat,
  Image as Pinterest,
  Download,
  RefreshCw,
  Filter,
  Settings,
  Activity,
  PieChart,
  LineChart,
  BarChart,
  Layers,
  Database,
  Server,
  Cpu,
  HardDrive,
  Wifi,
  Monitor,
  Smartphone,
  Tablet,
  Zap,
  Shield,
  Crown,
  Star,
  CheckCircle,
  AlertTriangle,
  X,
  Save,
  FileText,
  MessageCircle,
  Bell,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Bookmark,
  Tag,
  Archive,
  Folder,
  Image,
  Video,
  Camera,
  Mic,
  Volume2,
  Play,
  Pause,
  Square,
  SkipForward,
  SkipBack,
  RotateCcw,
  Maximize,
  Minimize,
  ExternalLink,
  Copy,
  Share,
  Lock,
  Unlock,
  Key,
  SortAsc,
  SortDesc,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  MapPin,
  Timer,
  Stopwatch,
  VolumeX,
  MicOff,
  CameraOff,
  VideoOff,
  File,
  FolderOpen,
  BookmarkCheck,
  BookmarkX,
  Clock3,
  Timer as TimerIcon,
  Stopwatch as StopwatchIcon,
} from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  changeType: "increase" | "decrease";
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  borderColor: string;
  trend?: number[];
}

function MetricCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  color,
  bgColor,
  borderColor,
  trend,
}: MetricCardProps) {
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
      {trend && (
        <div className="mt-4 h-8 flex items-end space-x-1">
          {trend.map((value, index) => (
            <div
              key={index}
              className="flex-1 bg-white/20 rounded-sm"
              style={{ height: `${(value / Math.max(...trend)) * 100}%` }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

interface ChartData {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

interface TimeSeriesData {
  date: string;
  value: number;
  label: string;
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedMetric, setSelectedMetric] = useState("revenue");
  const [chartType, setChartType] = useState("line");
  const [loading, setLoading] = useState(true);

  const [platformData, setPlatformData] = useState<ChartData[]>([]);
  const [revenueData, setRevenueData] = useState<TimeSeriesData[]>([]);
  const [userData, setUserData] = useState<TimeSeriesData[]>([]);
  const [campaignData, setCampaignData] = useState<TimeSeriesData[]>([]);
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalUsers: 0,
    totalCampaigns: 0,
    totalClicks: 0,
    conversionRate: 0,
    revenueGrowth: 0,
    userGrowth: 0,
    campaignGrowth: 0,
    clickGrowth: 0,
    conversionGrowth: 0,
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/analytics");
        if (response.ok) {
          const data = await response.json();
          setAnalytics(data.analytics || {});
          setPlatformData(data.platformData || []);
          setRevenueData(data.chartData?.revenue || []);
          setUserData(data.chartData?.users || []);
          setCampaignData(data.chartData?.campaigns || []);
          setTopCampaigns(data.topCampaigns || []);
          setDeviceData(data.deviceData || []);
          console.log("Successfully loaded analytics data");
        } else {
          let errorData = {};
          try {
            errorData = await response.json();
          } catch (parseError) {
            console.error("Failed to parse error response as JSON");
            errorData = {
              error: "Invalid response format",
              status: response.status,
            };
          }
          console.error("Failed to fetch analytics:", errorData);

          // Handle authentication errors
          if (response.status === 401 || response.status === 403) {
            console.log("Authentication required - redirecting to login");
            setAuthError(true);
            // You could redirect to login here if needed
            // window.location.href = '/admin/login';
          }

          // Set default values when API fails
          setAnalytics({
            totalRevenue: 0,
            totalUsers: 0,
            totalCampaigns: 0,
            totalClicks: 0,
            conversionRate: 0,
            revenueGrowth: 0,
            userGrowth: 0,
            campaignGrowth: 0,
            clickGrowth: 0,
            conversionGrowth: 0,
          });
          setChartData({
            revenue: [],
            users: [],
            campaigns: [],
            clicks: [],
            conversions: [],
          });
          setPlatformData([]);
          setTopCampaigns([]);
          setDeviceData([]);
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);

        // Set default values when there's a network or other error
        setAnalytics({
          totalRevenue: 0,
          totalUsers: 0,
          totalCampaigns: 0,
          totalClicks: 0,
          conversionRate: 0,
          revenueGrowth: 0,
          userGrowth: 0,
          campaignGrowth: 0,
          clickGrowth: 0,
          conversionGrowth: 0,
        });
        setChartData({
          revenue: [],
          users: [],
          campaigns: [],
          clicks: [],
          conversions: [],
        });
        setPlatformData([]);
        setTopCampaigns([]);
        setDeviceData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const [topCampaigns, setTopCampaigns] = useState<any[]>([]);
  const [deviceData, setDeviceData] = useState<ChartData[]>([]);
  const [authError, setAuthError] = useState(false);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "facebook":
        return Facebook;
      case "google":
        return GoogleIcon;
      case "instagram":
        return Instagram;
      case "twitter":
        return Twitter;
      case "youtube":
        return Youtube;
      case "linkedin":
        return Linkedin;
      case "tiktok":
        return Tiktok;
      case "snapchat":
        return Snapchat;
      case "pinterest":
        return Pinterest;
      default:
        return Globe;
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-white/70">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Authentication Required
            </h3>
            <p className="text-white/70 mb-4">
              Please log in as an admin to view analytics data.
            </p>
            <button
              onClick={() => (window.location.href = "/admin/login")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Admin Login
            </button>
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
            Analytics Dashboard
          </h1>
          <p className="text-white/70">
            Comprehensive insights and performance metrics
          </p>
        </div>
        <div className="flex items-center space-x-3">
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
          <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={`$${analytics.totalRevenue?.toLocaleString() || 0}`}
          change={analytics.revenueGrowth || 0}
          changeType="increase"
          icon={DollarSign}
          color="text-green-400"
          bgColor="bg-green-500/10"
          borderColor="border-green-500/20"
          trend={revenueData.map((d) => d.value)}
        />
        <MetricCard
          title="Total Users"
          value={analytics.totalUsers?.toLocaleString() || 0}
          change={analytics.userGrowth || 0}
          changeType="increase"
          icon={Users}
          color="text-blue-400"
          bgColor="bg-blue-500/10"
          borderColor="border-blue-500/20"
          trend={userData.map((d) => d.value)}
        />
        <MetricCard
          title="Active Campaigns"
          value={analytics.totalCampaigns || 0}
          change={analytics.campaignGrowth || 0}
          changeType="increase"
          icon={Target}
          color="text-orange-400"
          bgColor="bg-orange-500/10"
          borderColor="border-orange-500/20"
          trend={campaignData.map((d) => d.value)}
        />
        <MetricCard
          title="Total Clicks"
          value={analytics.totalClicks?.toLocaleString() || 0}
          change={analytics.clickGrowth || 0}
          changeType="increase"
          icon={MousePointer}
          color="text-purple-400"
          bgColor="bg-purple-500/10"
          borderColor="border-purple-500/20"
          trend={[3200, 3800, 2900, 4200, 4500, 4800, 5200]}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Revenue Trend</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setChartType("line")}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  chartType === "line"
                    ? "bg-blue-500/20 text-blue-400"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <LineChart className="w-4 h-4" />
              </button>
              <button
                onClick={() => setChartType("bar")}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  chartType === "bar"
                    ? "bg-blue-500/20 text-blue-400"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <BarChart className="w-4 h-4" />
              </button>
              <button
                onClick={() => setChartType("area")}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  chartType === "area"
                    ? "bg-blue-500/20 text-blue-400"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <Layers className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <p className="text-white/70">
                Revenue chart will be displayed here
              </p>
              <p className="text-white/50 text-sm">
                Interactive chart with {chartType} visualization
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
            {platformData.map((platform, index) => (
              <div
                key={platform.platform}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 ${platform.color} rounded-full`} />
                  <span className="text-white font-medium capitalize">
                    {platform.platform}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-white/10 rounded-full h-2">
                    <div
                      className={`h-2 ${platform.color} rounded-full transition-all duration-500`}
                      style={{ width: `${platform.percentage}%` }}
                    />
                  </div>
                  <span className="text-white/70 text-sm w-8 text-right">
                    {platform.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top Campaigns and Device Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Campaigns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
        >
          <h3 className="text-xl font-semibold text-white mb-6">
            Top Performing Campaigns
          </h3>
          <div className="space-y-4">
            {topCampaigns.length > 0 ? (
              topCampaigns.map((campaign, index) => {
                const PlatformIcon = getPlatformIcon(campaign.platform);
                return (
                  <div
                    key={campaign.id}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <PlatformIcon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">
                          {campaign.name}
                        </h4>
                        <p className="text-white/70 text-sm capitalize">
                          {campaign.platform}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-semibold">
                        ${campaign.budget?.toLocaleString() || 0}
                      </div>
                      <div className="text-white/70 text-sm">
                        Budget: ${campaign.budget || 0}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-white/30 mx-auto mb-4" />
                <p className="text-white/70">No campaigns found</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Device Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
        >
          <h3 className="text-xl font-semibold text-white mb-6">
            Device Analytics
          </h3>
          <div className="space-y-4">
            {deviceData.map((device, index) => (
              <div
                key={device.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 ${device.color} rounded-full`} />
                  <span className="text-white font-medium">{device.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-white/10 rounded-full h-2">
                    <div
                      className={`h-2 ${device.color} rounded-full transition-all duration-500`}
                      style={{ width: `${device.percentage}%` }}
                    />
                  </div>
                  <span className="text-white/70 text-sm w-8 text-right">
                    {device.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
      >
        <h3 className="text-xl font-semibold text-white mb-6">
          Performance Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">
              {analytics.conversionRate?.toFixed(2) || 0}%
            </div>
            <div className="text-white/70 text-sm">Conversion Rate</div>
            <div className="flex items-center justify-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-green-400 text-sm">
                +{analytics.conversionGrowth || 0}%
              </span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">
              $
              {analytics.totalRevenue > 0
                ? (analytics.totalRevenue / analytics.totalClicks).toFixed(2)
                : 0}
            </div>
            <div className="text-white/70 text-sm">Average CPC</div>
            <div className="flex items-center justify-center mt-2">
              <TrendingDown className="w-4 h-4 text-red-400 mr-1" />
              <span className="text-red-400 text-sm">-$0.05</span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">3.2x</div>
            <div className="text-white/70 text-sm">Average ROAS</div>
            <div className="flex items-center justify-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-green-400 text-sm">+0.4x</span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">
              {analytics.totalClicks > 0
                ? (
                    analytics.totalClicks / analytics.totalCampaigns || 0
                  ).toFixed(0)
                : 0}
            </div>
            <div className="text-white/70 text-sm">Avg Clicks/Campaign</div>
            <div className="flex items-center justify-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-green-400 text-sm">
                +{analytics.clickGrowth || 0}%
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
