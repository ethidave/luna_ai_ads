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
  Stopwatch,
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
  Stopwatch as StopwatchIcon,
} from "lucide-react";
import ReportCard from "@/components/admin/ReportCard";

interface Report {
  id: string;
  name: string;
  type: "financial" | "user" | "campaign" | "system" | "custom";
  description: string;
  status: "generating" | "ready" | "failed";
  createdAt: string;
  generatedAt?: string;
  fileSize?: string;
  downloadCount: number;
  format: "pdf" | "excel" | "csv" | "json";
  period: string;
  dataPoints: number;
}

interface ReportCardProps {
  report: Report;
  onDownload: (report: Report) => void;
  onView: (report: Report) => void;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/reports");
        if (response.ok) {
          const data = await response.json();
          setReports(data.reports || []);
          setStats({
            totalReports: data.totalReports || 0,
            totalDownloads: data.totalDownloads || 0,
            totalDataPoints: data.totalDataPoints || 0,
            readyReports: data.readyReports || 0,
          });
          if (data.realStats) {
            setRealStats(data.realStats);
          }
          console.log("Successfully loaded reports data with real statistics");
        } else {
          const errorData = await response.json();
          console.error("Failed to fetch reports:", errorData);
        }
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

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

  const handleDownload = (report: Report) => {
    if (report.status === "ready") {
      // Simulate download
      console.log(`Downloading report: ${report.name}`);
      setReports(
        reports.map((r) =>
          r.id === report.id ? { ...r, downloadCount: r.downloadCount + 1 } : r
        )
      );
    }
  };

  const handleView = (report: Report) => {
    console.log(`Viewing report: ${report.name}`);
  };

  const handleGenerateReport = async () => {
    try {
      const response = await fetch("/api/admin/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "New Custom Report",
          type: "custom",
          description: "Custom report generated by admin",
          format: "pdf",
          period: "Last 30 days",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const newReport: Report = {
          ...data.report,
          fileSize: undefined,
          generatedAt: undefined,
        };
        setReports([newReport, ...reports]);
        setStats((prev) => ({
          ...prev,
          totalReports: prev.totalReports + 1,
        }));

        // Simulate generation completion with real data
        setTimeout(() => {
          setReports(
            reports.map((r) =>
              r.id === newReport.id
                ? {
                    ...r,
                    status: "ready",
                    generatedAt: new Date().toISOString(),
                    fileSize: `${(data.dataPoints * 0.002).toFixed(1)} MB`,
                    dataPoints: data.dataPoints,
                  }
                : r
            )
          );
          setStats((prev) => ({
            ...prev,
            readyReports: prev.readyReports + 1,
            totalDataPoints: prev.totalDataPoints + data.dataPoints,
          }));
        }, 5000);
      } else {
        console.error("Failed to generate report");
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
      <div className="space-y-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-white/70">Loading reports...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
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
          <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300 flex items-center space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

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
        <h3 className="text-xl font-semibold text-white mb-6">Report Types</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(typeStats).map(([type, count]) => (
            <div key={type} className="text-center">
              <div className="text-2xl font-bold text-white mb-1">{count}</div>
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
          />
        ))}
      </div>

      {filteredReports.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <FileText className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No Reports Found
          </h3>
          <p className="text-white/70">
            Try adjusting your filters or generate a new report
          </p>
        </motion.div>
      )}
    </div>
  );
}
