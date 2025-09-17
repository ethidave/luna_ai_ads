"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  Eye,
  CheckCircle,
  X,
  Save,
  DollarSign,
  Users,
  Target,
  Zap,
  Shield,
  Crown,
  Star,
  AlertTriangle,
  Clock,
  Globe,
  CreditCard,
  BarChart3,
  Download,
  Upload,
  RefreshCw,
  SortAsc,
  SortDesc,
  ChevronDown,
  ChevronUp,
  Settings,
  Activity,
  TrendingUp,
  TrendingDown,
  FileText,
  History,
  Minus,
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
  PieChart,
  LineChart,
  BarChart,
  Search,
  Filter,
  Calendar,
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
  Loader2,
  AlertCircle,
} from "lucide-react";
import PackageModal from "@/components/admin/PackageModal";

interface PackageData {
  id: string;
  name: string;
  description: string;
  price: number;
  type: "monthly" | "yearly" | "weekly" | "daily";
  status: "active" | "inactive" | "draft";
  features: string[];
  platforms: string[];
  duration: number;
  budget: number;
  maxCampaigns: number;
  maxUsers: number;
  limitations: Record<string, any>;
  customizations: string[];
  isPopular: boolean;
  isCustom: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  // Legacy fields for compatibility
  billingCycle?: "monthly" | "yearly";
  isActive?: boolean;
  maxFacebookAccounts?: number;
  dailyBudgetCap?: number;
  hasUnlimitedBudget?: boolean;
  hasTeamCollaboration?: boolean;
  hasDedicatedConsultant?: boolean;
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<
    PackageData | undefined
  >();
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [priceHistory, setPriceHistory] = useState<Record<number, any[]>>({});
  const [showPriceHistory, setShowPriceHistory] = useState<
    Record<number, boolean>
  >({});

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPriceHistory = async (packageId: number) => {
    try {
      const response = await fetch(
        `/api/price-history?packageId=${packageId}&limit=10`
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

  const fetchPackages = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/admin/packages");
      const data = await response.json();

      if (data.success) {
        setPackages(data.packages || []);
        setSuccess(`Loaded ${data.packages?.length || 0} packages`);
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message || "Failed to fetch packages");
        setPackages([]);
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
      setError("Failed to fetch packages");
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPackage = (packageData: PackageData) => {
    setSelectedPackage(packageData);
    setModalMode("edit");
    setShowModal(true);
  };

  const handleAddPackage = () => {
    setSelectedPackage(undefined);
    setModalMode("create");
    setShowModal(true);
  };

  const handleSavePackage = async (packageData: PackageData) => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const isEdit = modalMode === "edit";
      const url = "/api/admin/packages";
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(packageData),
      });

      const data = await response.json();

      if (data.success) {
        if (isEdit) {
          setPackages(
            packages.map((pkg) =>
              pkg.id === packageData.id
                ? { ...packageData, ...data.package }
                : pkg
            )
          );
        } else {
          setPackages([...packages, { ...packageData, ...data.package }]);
        }
        setSuccess(
          data.message ||
            `Package ${isEdit ? "updated" : "created"} successfully!`
        );
        setTimeout(() => setSuccess(""), 3000);
        setShowModal(false);
      } else {
        setError(
          data.message || `Failed to ${isEdit ? "update" : "create"} package`
        );
      }
    } catch (error) {
      console.error("Error saving package:", error);
      setError(
        `Failed to ${modalMode === "edit" ? "update" : "create"} package`
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePackage = async (packageId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this package? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch(`/api/admin/packages?id=${packageId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        setPackages(packages.filter((pkg) => pkg.id !== packageId));
        setSuccess("Package deleted successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message || "Failed to delete package");
      }
    } catch (error) {
      console.error("Error deleting package:", error);
      setError("Failed to delete package");
    } finally {
      setSaving(false);
    }
  };

  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch =
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && pkg.status === "active") ||
      (statusFilter === "inactive" && pkg.status === "inactive") ||
      (statusFilter === "draft" && pkg.status === "draft");
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-400 bg-green-500/10 border-green-500/20";
      case "inactive":
        return "text-red-400 bg-red-500/10 border-red-500/20";
      case "draft":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "monthly":
        return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      case "yearly":
        return "text-purple-400 bg-purple-500/10 border-purple-500/20";
      case "weekly":
        return "text-green-400 bg-green-500/10 border-green-500/20";
      case "daily":
        return "text-orange-400 bg-orange-500/10 border-orange-500/20";
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-white/70">Loading packages...</p>
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
            Package Management
          </h1>
          <p className="text-white/70">
            Manage subscription packages and pricing
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchPackages}
            className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300 flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button
            onClick={handleAddPackage}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Package</span>
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <span className="text-green-400">{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <span className="text-red-400">{error}</span>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
            <input
              type="text"
              placeholder="Search packages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="draft">Draft</option>
          </select>
          <div className="flex items-center space-x-2">
            <button className="p-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPackages.map((pkg) => (
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
                  <p className="text-white/70 text-sm capitalize">{pkg.type}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {pkg.isPopular && (
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded-full border border-yellow-500/30">
                    Popular
                  </span>
                )}
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                    pkg.status
                  )}`}
                >
                  {pkg.status}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-3xl font-bold text-white mb-1">
                ${pkg.price}
                <span className="text-lg text-white/70">
                  /
                  {pkg.type === "monthly"
                    ? "mo"
                    : pkg.type === "yearly"
                    ? "yr"
                    : pkg.type === "weekly"
                    ? "wk"
                    : "day"}
                </span>
              </div>
              <p className="text-white/70 text-sm">{pkg.description}</p>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex items-center space-x-2 text-white/70 text-sm">
                <Users className="w-4 h-4" />
                <span>Up to {pkg.maxUsers} users</span>
              </div>
              <div className="flex items-center space-x-2 text-white/70 text-sm">
                <Target className="w-4 h-4" />
                <span>Up to {pkg.maxCampaigns} campaigns</span>
              </div>
              <div className="flex items-center space-x-2 text-white/70 text-sm">
                <DollarSign className="w-4 h-4" />
                <span>Budget: ${pkg.budget.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-2 text-white/70 text-sm">
                <Clock className="w-4 h-4" />
                <span>Duration: {pkg.duration} days</span>
              </div>
              {pkg.platforms && pkg.platforms.length > 0 && (
                <div className="flex items-center space-x-2 text-white/70 text-sm">
                  <Globe className="w-4 h-4" />
                  <span>{pkg.platforms.join(", ")}</span>
                </div>
              )}
            </div>

            {/* Price History */}
            <div className="mb-6">
              <button
                onClick={() => togglePriceHistory(pkg.id)}
                className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors text-sm mb-3"
              >
                <History className="w-4 h-4" />
                <span>Price History</span>
                {showPriceHistory[pkg.id] ? (
                  <Minus className="w-4 h-4" />
                ) : (
                  <TrendingUp className="w-4 h-4" />
                )}
              </button>

              {showPriceHistory[pkg.id] && (
                <div className="bg-white/5 rounded-lg p-4 space-y-3">
                  {priceHistory[pkg.id]?.length > 0 ? (
                    priceHistory[pkg.id].map((record, index) => (
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

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEditPackage(pkg)}
                  className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all duration-300"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeletePackage(pkg.id)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 text-sm">
                View Details
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredPackages.length === 0 && !loading && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white/70 mb-2">
            No packages found
          </h3>
          <p className="text-white/50 mb-6">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your search or filter criteria"
              : "Get started by creating your first package"}
          </p>
          <button
            onClick={handleAddPackage}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
          >
            <Plus className="w-5 h-5 inline mr-2" />
            Add Package
          </button>
        </div>
      )}

      {/* Package Modal */}
      <PackageModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        packageData={selectedPackage}
        onSave={handleSavePackage}
        mode={modalMode}
      />
    </div>
  );
}
