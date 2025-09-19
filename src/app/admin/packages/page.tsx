"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiUrl } from "@/lib/api-utils";
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
  Activity,
  TrendingUp,
  TrendingDown,
  FileText,
  History,
  Minus,
  Settings,
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
  Loader2,
  AlertCircle,
} from "lucide-react";
import PackageModal from "@/components/admin/PackageModal";

interface PackageData {
  id?: string;
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
  createdAt?: string;
  updatedAt?: string;
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
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showModal, setShowModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<
    PackageData | undefined
  >();
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [priceHistory, setPriceHistory] = useState<Record<string, any[]>>({});
  const [showPriceHistory, setShowPriceHistory] = useState<
    Record<string, boolean>
  >({});
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState("");

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPriceHistory = async (packageId: string) => {
    try {
      console.log(`Fetching price history for package ${packageId}...`);

      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }

      const response = await fetch(
        apiUrl(`/admin/packages/${packageId}/price-history`),
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(`Price history response status: ${response.status}`);

      if (response.ok) {
        const contentType = response.headers.get("content-type");

        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Server returned non-JSON response");
        }

        const data = await response.json();
        console.log("Price history data received:", data);

        if (data.success) {
          setPriceHistory((prev) => ({
            ...prev,
            [packageId]: data.priceHistory || [],
          }));
        } else {
          throw new Error(data.message || "Failed to fetch price history");
        }
      } else if (response.status === 401) {
        throw new Error("Authentication failed. Please login again.");
      } else if (response.status === 403) {
        throw new Error("Access denied. Admin privileges required.");
      } else if (response.status === 404) {
        console.warn(`Price history not found for package ${packageId}`);
        setPriceHistory((prev) => ({
          ...prev,
          [packageId]: [],
        }));
      } else if (response.status === 500) {
        throw new Error("Server error. Please try again later.");
      } else {
        const errorText = await response.text();
        throw new Error(`Request failed: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error("Error fetching price history:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch price history";
      console.warn(
        `Price history error for package ${packageId}:`,
        errorMessage
      );
      // Set empty array for this package to prevent repeated requests
      setPriceHistory((prev) => ({
        ...prev,
        [packageId]: [],
      }));
    }
  };

  const togglePriceHistory = (packageId: string) => {
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
      setSuccess("");

      console.log("Fetching packages from real API...");

      // Get auth token
      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }

      const response = await fetch(apiUrl('/admin/packages'), {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Packages response status:", response.status);

      if (response.ok) {
        const contentType = response.headers.get("content-type");

        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Server returned non-JSON response");
        }

        const data = await response.json();
        console.log("Packages data received:", data);

        if (data.success) {
          setPackages(data.packages || []);
          setSuccess(
            `Successfully loaded ${data.packages?.length || 0} packages`
          );
          setTimeout(() => setSuccess(""), 3000);
        } else {
          throw new Error(data.message || "Failed to fetch packages");
        }
      } else if (response.status === 401) {
        throw new Error("Authentication failed. Please login again.");
      } else if (response.status === 403) {
        throw new Error("Access denied. Admin privileges required.");
      } else if (response.status === 500) {
        throw new Error("Server error. Please try again later.");
      } else {
        const errorText = await response.text();
        throw new Error(`Request failed: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch packages";
      setError(errorMessage);
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

      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }

      const isEdit = modalMode === "edit";
      const url = isEdit
        ? apiUrl(`/admin/packages/${packageData.id}`)
        : apiUrl('/admin/packages');
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(packageData),
      });

      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
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
            throw new Error(
              data.message ||
                `Failed to ${isEdit ? "update" : "create"} package`
            );
          }
        } else {
          throw new Error("Server returned non-JSON response");
        }
      } else if (response.status === 401) {
        throw new Error("Authentication failed. Please login again.");
      } else if (response.status === 403) {
        throw new Error("Access denied. Admin privileges required.");
      } else if (response.status === 500) {
        throw new Error("Server error. Please try again later.");
      } else {
        const errorText = await response.text();
        throw new Error(`Request failed: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error("Error saving package:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : `Failed to ${modalMode === "edit" ? "update" : "create"} package`;
      setError(errorMessage);
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

      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }

      const response = await fetch(
        apiUrl(`/admin/packages/${packageId}`),
        {
          method: "DELETE",
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
            setPackages(packages.filter((pkg) => pkg.id !== packageId));
            setSuccess("Package deleted successfully!");
            setTimeout(() => setSuccess(""), 3000);
          } else {
            throw new Error(data.message || "Failed to delete package");
          }
        } else {
          throw new Error("Server returned non-JSON response");
        }
      } else if (response.status === 401) {
        throw new Error("Authentication failed. Please login again.");
      } else if (response.status === 403) {
        throw new Error("Access denied. Admin privileges required.");
      } else if (response.status === 500) {
        throw new Error("Server error. Please try again later.");
      } else {
        const errorText = await response.text();
        throw new Error(`Request failed: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error("Error deleting package:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete package";
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // Bulk actions
  const handleBulkAction = async () => {
    if (selectedPackages.length === 0) {
      setError("Please select packages to perform bulk action");
      return;
    }

    if (!bulkAction) {
      setError("Please select a bulk action");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }

      const response = await fetch(
        apiUrl('/admin/packages/bulk-action'),
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            packageIds: selectedPackages,
            action: bulkAction,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSuccess(`Bulk action completed successfully!`);
          setTimeout(() => setSuccess(""), 3000);
          setSelectedPackages([]);
          setBulkAction("");
          fetchPackages(); // Refresh the list
        } else {
          throw new Error(data.message || "Bulk action failed");
        }
      } else {
        throw new Error(`Bulk action failed: ${response.status}`);
      }
    } catch (error) {
      console.error("Error performing bulk action:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Bulk action failed";
      setError(errorMessage);
      setTimeout(() => setError(""), 5000);
    } finally {
      setSaving(false);
    }
  };

  const handleSelectPackage = (packageId: string) => {
    setSelectedPackages((prev) =>
      prev.includes(packageId)
        ? prev.filter((id) => id !== packageId)
        : [...prev, packageId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPackages.length === filteredPackages.length) {
      setSelectedPackages([]);
    } else {
      setSelectedPackages(filteredPackages.map((pkg) => pkg.id!));
    }
  };

  const filteredPackages = packages
    .filter((pkg) => {
      const matchesSearch =
        pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && pkg.status === "active") ||
        (statusFilter === "inactive" && pkg.status === "inactive") ||
        (statusFilter === "draft" && pkg.status === "draft");
      const matchesType = typeFilter === "all" || pkg.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    })
    .sort((a, b) => {
      let aValue: any = a[sortBy as keyof PackageData];
      let bValue: any = b[sortBy as keyof PackageData];

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Package Management
          </h1>
          <p className="text-white/70 text-sm sm:text-base">
            Manage subscription packages and pricing
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all duration-300 ${
                viewMode === "grid"
                  ? "bg-blue-500/20 text-blue-400"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-lg transition-all duration-300 ${
                viewMode === "table"
                  ? "bg-blue-500/20 text-blue-400"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              <FileText className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={fetchPackages}
            className="px-3 sm:px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300 flex items-center space-x-2 text-sm sm:text-base touch-manipulation"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button className="px-3 sm:px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300 flex items-center space-x-2 text-sm sm:text-base touch-manipulation">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button
            onClick={handleAddPackage}
            className="px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2 text-sm sm:text-base touch-manipulation"
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
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="relative">
            <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search packages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="draft">Draft</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          >
            <option value="all">All Types</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="weekly">Weekly</option>
            <option value="daily">Daily</option>
          </select>
          <div className="flex items-center space-x-2">
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split("-");
                setSortBy(field);
                setSortOrder(order as "asc" | "desc");
              }}
              className="px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            >
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="price-asc">Price Low-High</option>
              <option value="price-desc">Price High-Low</option>
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedPackages.length > 0 && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <span className="text-blue-400 font-medium">
                {selectedPackages.length} package
                {selectedPackages.length > 1 ? "s" : ""} selected
              </span>
              <button
                onClick={handleSelectAll}
                className="text-blue-300 hover:text-blue-200 text-sm underline"
              >
                {selectedPackages.length === filteredPackages.length
                  ? "Deselect All"
                  : "Select All"}
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">Select Action</option>
                <option value="activate">Activate</option>
                <option value="deactivate">Deactivate</option>
                <option value="delete">Delete</option>
                <option value="duplicate">Duplicate</option>
              </select>
              <button
                onClick={handleBulkAction}
                disabled={!bulkAction}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm"
              >
                Apply Action
              </button>
              <button
                onClick={() => setSelectedPackages([])}
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Packages Grid */}
      <div
        className={`${
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            : "space-y-4"
        }`}
      >
        {filteredPackages.map((pkg) => (
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedPackages.includes(pkg.id!)}
                  onChange={() => handleSelectPackage(pkg.id!)}
                  className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                />
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
              {pkg.platforms && (
                <div className="flex items-center space-x-2 text-white/70 text-sm">
                  <Globe className="w-4 h-4" />
                  <span>
                    {Array.isArray(pkg.platforms)
                      ? pkg.platforms.join(", ")
                      : String(pkg.platforms)}
                  </span>
                </div>
              )}
            </div>

            {/* Price History */}
            <div className="mb-6">
              <button
                onClick={() => pkg.id && togglePriceHistory(pkg.id)}
                className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors text-sm mb-3"
              >
                <History className="w-4 h-4" />
                <span>Price History</span>
                {pkg.id && showPriceHistory[pkg.id] ? (
                  <Minus className="w-4 h-4" />
                ) : (
                  <TrendingUp className="w-4 h-4" />
                )}
              </button>

              {pkg.id && showPriceHistory[pkg.id] && (
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
                  onClick={() => pkg.id && handleDeletePackage(pkg.id)}
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
