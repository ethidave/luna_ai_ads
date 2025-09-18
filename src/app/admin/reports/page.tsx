"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  RefreshCw,
  Search,
  Filter,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
  Eye,
  MousePointer,
  Settings,
  Activity,
  CreditCard,
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
  Database,
  Server,
  Cpu,
  HardDrive,
  Wifi,
  Monitor,
  Smartphone,
  Tablet,
  Layers,
  BarChart,
  SortAsc,
  SortDesc,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  MapPin,
  Timer,
  Play as PlayIcon,
  Pause as PauseIcon,
  Square as SquareIcon,
  SkipForward as SkipForwardIcon,
  SkipBack as SkipBackIcon,
  Volume2 as Volume2Icon,
  VolumeX,
  Mic as MicIcon,
  MicOff,
  Camera as CameraIcon,
  CameraOff,
  Video as VideoIcon,
  VideoOff,
  Image as ImageIcon,
  File,
  Folder as FolderIcon,
  FolderOpen,
  Archive as ArchiveIcon,
  Bookmark as BookmarkIcon,
  Tag as TagIcon,
  Flag as FlagIcon,
  BookmarkCheck,
  BookmarkX,
  Star,
  Heart as HeartIcon,
  ThumbsUp as ThumbsUpIcon,
  ThumbsDown as ThumbsDownIcon,
  MessageCircle as MessageCircleIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MapPin as MapPinIcon,
  Clock3,
  Timer as TimerIcon,
  AlertTriangle,
  X,
} from "lucide-react";
import ReportCard from "@/components/admin/ReportCard";
import { useAdminApi } from "@/hooks/useAdminApi";
import {
  AdminErrorBoundary,
  ErrorMessage,
  NoDataMessage,
  LoadingSpinner,
} from "@/components/admin/ErrorBoundary";

interface Report {
  id: string;
  name: string;
  type: "analytics" | "financial" | "user" | "campaign" | "system";
  description: string;
  status: "ready" | "generating" | "failed" | "scheduled";
  size: string;
  downloads: number;
  format: "pdf" | "csv" | "excel" | "json";
  period: string;
  dataPoints: number;
  createdAt: string;
  generatedAt?: string;
  expiresAt?: string;
}

interface ReportCardProps {
  report: Report;
  onDownload: (report: Report) => void;
  onView: (report: Report) => void;
}

export default function ReportsPage() {
  const { loading, error, getReports, generateReport, clearError } =
    useAdminApi();

  const [reports, setReports] = useState<Report[]>([]);
  const [retryCount, setRetryCount] = useState(0);
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);

  const [stats, setStats] = useState({
    totalReports: 0,
    totalDownloads: 0,
    totalDataPoints: 0,
    readyReports: 0,
  });

  const [realStats, setRealStats] = useState({
    totalRevenue: 0,
    totalUsers: 0,
    totalCampaigns: 0,
    totalPayments: 0,
    totalClicks: 0,
    totalConversions: 0,
    activeCampaigns: 0,
    usersThisMonth: 0,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formatFilter, setFormatFilter] = useState("all");

  const fetchReports = async (isRetry = false) => {
    try {
      console.log("Fetching reports using useAdminApi hook...");
      const response = await getReports();

      if (response) {
        console.log("Reports API Response:", response);

        // Extract real data from backend response
        if (response.reports) {
          setRealStats({
            totalRevenue: response.reports.summary?.total_revenue || 0,
            totalUsers: response.reports.summary?.total_users || 0,
            totalCampaigns: response.reports.summary?.total_campaigns || 0,
            totalPayments: response.reports.summary?.total_payments || 0,
            totalClicks: response.reports.analytics_reports?.total_clicks || 0,
            totalConversions:
              response.reports.analytics_reports?.total_conversions || 0,
            activeCampaigns:
              response.reports.campaign_reports?.active_campaigns || 0,
            usersThisMonth: response.reports.user_reports?.new_users || 0,
          });

          // Generate sample reports based on real data
          const sampleReports: Report[] = [
            {
              id: "user-report-1",
              name: "User Analytics Report",
              type: "user",
              description: `Comprehensive user analytics for ${
                response.reports.summary?.total_users || 0
              } users`,
              status: "ready",
              size: "1.2 MB",
              downloads: 5,
              format: "pdf",
              period: "Last 30 days",
              dataPoints: response.reports.user_reports?.new_users || 0,
              createdAt: new Date().toISOString(),
              generatedAt: new Date().toISOString(),
            },
            {
              id: "financial-report-1",
              name: "Financial Summary Report",
              type: "financial",
              description: `Financial overview showing $${(
                response.reports.summary?.total_revenue || 0
              ).toFixed(2)} in revenue`,
              status: "ready",
              size: "0.8 MB",
              downloads: 3,
              format: "excel",
              period: "Last 30 days",
              dataPoints: response.reports.payment_reports?.total_payments || 0,
              createdAt: new Date().toISOString(),
              generatedAt: new Date().toISOString(),
            },
            {
              id: "campaign-report-1",
              name: "Campaign Performance Report",
              type: "campaign",
              description: `Performance analysis for ${
                response.reports.summary?.total_campaigns || 0
              } campaigns`,
              status: "ready",
              size: "2.1 MB",
              downloads: 8,
              format: "pdf",
              period: "Last 30 days",
              dataPoints: response.reports.analytics_reports?.total_clicks || 0,
              createdAt: new Date().toISOString(),
              generatedAt: new Date().toISOString(),
            },
          ];

          setReports(sampleReports);
          setStats({
            totalReports: sampleReports.length,
            totalDownloads: sampleReports.reduce(
              (sum, r) => sum + r.downloads,
              0
            ),
            totalDataPoints: sampleReports.reduce(
              (sum, r) => sum + r.dataPoints,
              0
            ),
            readyReports: sampleReports.filter((r) => r.status === "ready")
              .length,
          });

          setRetryCount(0);
          setLastFetchTime(new Date());
          console.log("Successfully loaded reports data with real statistics");
        } else {
          // If no real data, show empty state
          setReports([]);
          setStats({
            totalReports: 0,
            totalDownloads: 0,
            totalDataPoints: 0,
            readyReports: 0,
          });
          setRealStats({
            totalRevenue: 0,
            totalUsers: 0,
            totalCampaigns: 0,
            totalPayments: 0,
            totalClicks: 0,
            totalConversions: 0,
            activeCampaigns: 0,
            usersThisMonth: 0,
          });
        }
      } else {
        // If no response, show empty state
        setReports([]);
        setStats({
          totalReports: 0,
          totalDownloads: 0,
          totalDataPoints: 0,
          readyReports: 0,
        });
        setRealStats({
          totalRevenue: 0,
          totalUsers: 0,
          totalCampaigns: 0,
          totalPayments: 0,
          totalClicks: 0,
          totalConversions: 0,
          activeCampaigns: 0,
          usersThisMonth: 0,
        });
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      // Show empty state on error
      setReports([]);
      setStats({
        totalReports: 0,
        totalDownloads: 0,
        totalDataPoints: 0,
        readyReports: 0,
      });
      setRealStats({
        totalRevenue: 0,
        totalUsers: 0,
        totalCampaigns: 0,
        totalPayments: 0,
        totalClicks: 0,
        totalConversions: 0,
        activeCampaigns: 0,
        usersThisMonth: 0,
      });
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || report.type === typeFilter;
    const matchesStatus =
      statusFilter === "all" || report.status === statusFilter;
    const matchesFormat =
      formatFilter === "all" || report.format === formatFilter;
    return matchesSearch && matchesType && matchesStatus && matchesFormat;
  });

  const handleDownload = (reportId: string) => {
    const report = reports.find((r) => r.id === reportId);
    if (report && report.status === "ready") {
      // Simulate download
      console.log(`Downloading report: ${report.name}`);
      setReports(
        reports.map((r) =>
          r.id === reportId ? { ...r, downloads: r.downloads + 1 } : r
        )
      );
    }
  };

  const handleView = (reportId: string) => {
    const report = reports.find((r) => r.id === reportId);
    if (report) {
      console.log(`Viewing report: ${report.name}`);
    }
  };

  const handleRegenerate = (reportId: string) => {
    const report = reports.find((r) => r.id === reportId);
    if (report) {
      console.log(`Regenerating report: ${report.name}`);
      // Add regeneration logic here
    }
  };

  const handleRefresh = () => {
    setRetryCount(0);
    fetchReports();
  };

  const handleRetry = () => {
    setRetryCount(0);
    clearError();
    fetchReports();
  };

  const handleGenerateReport = async () => {
    try {
      console.log("Generating report using useAdminApi hook...");
      const response = await generateReport({
        name: "New Custom Report",
        type: "custom",
        description: "Custom report generated by admin",
        format: "pdf",
        period: "Last 30 days",
      });

      if (response) {
        const newReport: Report = {
          id: `custom-report-${Date.now()}`,
          name: "Custom Generated Report",
          type: "analytics",
          description: "Custom report generated by admin",
          status: "generating",
          size: "0 MB",
          downloads: 0,
          format: "pdf",
          period: "Last 30 days",
          dataPoints: 0,
          createdAt: new Date().toISOString(),
        };

        setReports([newReport, ...reports]);
        setStats((prev) => ({
          ...prev,
          totalReports: prev.totalReports + 1,
        }));

        // Simulate generation completion
        setTimeout(() => {
          setReports(
            reports.map((r) =>
              r.id === newReport.id
                ? {
                    ...r,
                    status: "ready",
                    generatedAt: new Date().toISOString(),
                    size: "1.5 MB",
                    dataPoints: 500,
                  }
                : r
            )
          );
          setStats((prev) => ({
            ...prev,
            readyReports: prev.readyReports + 1,
            totalDataPoints: prev.totalDataPoints + 500,
          }));
        }, 3000);
      }
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  const getTypeStats = () => {
    const stats = reports.reduce((acc, report) => {
      acc[report.type] = (acc[report.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return stats;
  };

  const typeStats = getTypeStats();

  if (loading) {
    return (
      <AdminErrorBoundary>
        <div className="space-y-8">
          <div className="flex items-center justify-center min-h-64">
            <LoadingSpinner size="lg" />
            <span className="ml-3 text-gray-600">Loading reports...</span>
          </div>
        </div>
      </AdminErrorBoundary>
    );
  }

  return (
    <AdminErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Reports & Analytics
            </h1>
            <p className="text-white/70">
              Generate and manage comprehensive reports
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleGenerateReport}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>Generate Report</span>
            </button>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              <span>{loading ? "Refreshing..." : "Refresh"}</span>
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && <ErrorMessage error={error} onRetry={handleRetry} />}

        {/* Last Fetch Time */}
        {lastFetchTime && !error && (
          <div className="text-white/50 text-sm">
            Last updated: {lastFetchTime.toLocaleTimeString()}
          </div>
        )}

        {/* Real Data Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
        >
          <h3 className="text-xl font-semibold text-white mb-6">
            Real Data Overview
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">
                ${realStats.totalRevenue.toFixed(2)}
              </div>
              <div className="text-white/70 text-sm">Total Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {realStats.totalUsers}
              </div>
              <div className="text-white/70 text-sm">Total Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">
                {realStats.totalCampaigns}
              </div>
              <div className="text-white/70 text-sm">Total Campaigns</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400 mb-1">
                {realStats.totalClicks.toLocaleString()}
              </div>
              <div className="text-white/70 text-sm">Total Clicks</div>
            </div>
          </div>
        </motion.div>

        {/* Report Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-xl backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {stats.totalReports}
              </h3>
              <p className="text-white/70 text-sm">Total Reports</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-green-500/10 border border-green-500/20 rounded-xl backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <Download className="w-6 h-6 text-green-400" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {stats.totalDownloads}
              </h3>
              <p className="text-white/70 text-sm">Total Downloads</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-orange-500/10 border border-orange-500/20 rounded-xl backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-500/10 rounded-lg">
                <BarChart3 className="w-6 h-6 text-orange-400" />
              </div>
              <TrendingUp className="w-4 h-4 text-orange-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {stats.totalDataPoints.toLocaleString()}
              </h3>
              <p className="text-white/70 text-sm">Data Points</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-purple-500/10 border border-purple-500/20 rounded-xl backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <Activity className="w-6 h-6 text-purple-400" />
              </div>
              <TrendingUp className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {stats.readyReports}
              </h3>
              <p className="text-white/70 text-sm">Ready Reports</p>
            </div>
          </motion.div>
        </div>

        {/* Report Type Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
        >
          <h3 className="text-xl font-semibold text-white mb-6">
            Report Types
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(typeStats).map(([type, count]) => (
              <div key={type} className="text-center">
                <div className="text-2xl font-bold text-white mb-1">
                  {count}
                </div>
                <div className="text-white/70 text-sm capitalize">{type}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Filters and Search */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="financial">Financial</option>
              <option value="user">User</option>
              <option value="campaign">Campaign</option>
              <option value="system">System</option>
              <option value="custom">Custom</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="ready">Ready</option>
              <option value="generating">Generating</option>
              <option value="failed">Failed</option>
            </select>
            <select
              value={formatFilter}
              onChange={(e) => setFormatFilter(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Formats</option>
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
            </select>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onDownload={handleDownload}
              onView={handleView}
              onRegenerate={handleRegenerate}
            />
          ))}
        </div>

        {filteredReports.length === 0 && !loading && (
          <NoDataMessage
            title="No Reports Found"
            description="Try adjusting your filters or generate a new report"
          />
        )}
      </div>
    </AdminErrorBoundary>
  );
}
