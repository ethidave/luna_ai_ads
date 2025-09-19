"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiUrl } from "@/lib/api-utils";
import {
  Target,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  Eye,
  Play,
  Pause,
  Square,
  RefreshCw,
  Search,
  Filter,
  Download,
  Upload,
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  MousePointer,
  Eye as EyeIcon,
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
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  X,
  Save,
  Activity,
  FileText,
  MessageCircle,
  Bell,
  Heart,
  ThumbsUp,
  Settings,
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
  SortAsc,
  SortDesc,
  ChevronDown,
  ChevronUp,
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
} from "lucide-react";
import CampaignModal from "@/components/admin/CampaignModal";

interface Campaign {
  id: string;
  name: string;
  platform:
    | "facebook"
    | "google"
    | "instagram"
    | "twitter"
    | "youtube"
    | "linkedin"
    | "tiktok"
    | "snapchat"
    | "pinterest";
  status: "active" | "paused" | "completed" | "draft";
  objective: string;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  cpc: number;
  roas: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  owner: string;
  tags: string[];
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        setError("");
        setSuccess("");

        const token = localStorage.getItem("auth_token");
        if (!token) {
          throw new Error("No authentication token found. Please login again.");
        }

        const response = await fetch(
          apiUrl('/admin/campaigns'),
          {
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
              setCampaigns(data.campaigns || []);
              setSuccess(
                `Successfully loaded ${data.campaigns?.length || 0} campaigns`
              );
              setTimeout(() => setSuccess(""), 3000);
            } else {
              throw new Error(data.message || "Failed to fetch campaigns");
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
        console.error("Error fetching campaigns:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch campaigns";
        setError(errorMessage);
        setCampaigns([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<
    Campaign | undefined
  >();

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.objective.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || campaign.status === statusFilter;
    const matchesPlatform =
      platformFilter === "all" || campaign.platform === platformFilter;
    return matchesSearch && matchesStatus && matchesPlatform;
  });

  const handleEditCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setShowModal(true);
  };

  const handleAddCampaign = () => {
    setSelectedCampaign(undefined);
    setShowModal(true);
  };

  const handleSaveCampaign = async (campaignData: Partial<Campaign>) => {
    try {
      setError("");
      setSuccess("");

      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }

      const isEdit = !!selectedCampaign;
      const url = isEdit
        ? apiUrl(`/admin/campaigns/${selectedCampaign.id}`)
        : apiUrl('/admin/campaigns');
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(campaignData),
      });

      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          if (data.success) {
            if (isEdit) {
              setCampaigns(
                campaigns.map((campaign) =>
                  campaign.id === selectedCampaign.id
                    ? { ...campaign, ...data.campaign }
                    : campaign
                )
              );
            } else {
              setCampaigns([data.campaign, ...campaigns]);
            }
            setSuccess(
              `Campaign ${isEdit ? "updated" : "created"} successfully!`
            );
            setTimeout(() => setSuccess(""), 3000);
            setShowModal(false);
          } else {
            throw new Error(
              data.message ||
                `Failed to ${isEdit ? "update" : "create"} campaign`
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
      console.error("Error saving campaign:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : `Failed to ${selectedCampaign ? "update" : "create"} campaign`;
      setError(errorMessage);
    }
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this campaign? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }

      const response = await fetch(
        apiUrl(`/admin/campaigns/${campaignId}`),
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
            setCampaigns(
              campaigns.filter((campaign) => campaign.id !== campaignId)
            );
            setSuccess("Campaign deleted successfully!");
            setTimeout(() => setSuccess(""), 3000);
          } else {
            throw new Error(data.message || "Failed to delete campaign");
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
      console.error("Error deleting campaign:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete campaign";
      setError(errorMessage);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-400 bg-green-500/10 border-green-500/20";
      case "paused":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
      case "completed":
        return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      case "draft":
        return "text-gray-400 bg-gray-500/10 border-gray-500/20";
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
  };

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
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-white/70">Loading campaigns...</p>
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
            Campaign Management
          </h1>
          <p className="text-white/70">
            Manage and monitor advertising campaigns
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button
            onClick={handleAddCampaign}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Campaign</span>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
            <input
              type="text"
              placeholder="Search campaigns..."
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
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
            <option value="draft">Draft</option>
          </select>
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Platforms</option>
            <option value="facebook">Facebook</option>
            <option value="google">Google</option>
            <option value="instagram">Instagram</option>
            <option value="twitter">Twitter</option>
            <option value="youtube">YouTube</option>
            <option value="linkedin">LinkedIn</option>
            <option value="tiktok">TikTok</option>
            <option value="snapchat">Snapchat</option>
            <option value="pinterest">Pinterest</option>
          </select>
          <div className="flex items-center space-x-2">
            <button className="p-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300">
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCampaigns.map((campaign) => {
          const PlatformIcon = getPlatformIcon(campaign.platform);
          return (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <PlatformIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {campaign.name}
                    </h3>
                    <p className="text-white/70 text-sm capitalize">
                      {campaign.platform}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                    campaign.status
                  )}`}
                >
                  {campaign.status}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-white/70 text-sm mb-2">
                  {campaign.objective}
                </p>
                <div className="flex items-center space-x-4 text-sm text-white/70">
                  <span>
                    Budget: ${(campaign.budget || 0).toLocaleString()}
                  </span>
                  <span>Spent: ${(campaign.spent || 0).toLocaleString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {(campaign.impressions || 0).toLocaleString()}
                  </div>
                  <div className="text-white/70 text-sm">Impressions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {(campaign.clicks || 0).toLocaleString()}
                  </div>
                  <div className="text-white/70 text-sm">Clicks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {(campaign.ctr || 0).toFixed(2)}%
                  </div>
                  <div className="text-white/70 text-sm">CTR</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    ${(campaign.cpc || 0).toFixed(2)}
                  </div>
                  <div className="text-white/70 text-sm">CPC</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEditCampaign(campaign)}
                    className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all duration-300"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCampaign(campaign.id)}
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
          );
        })}
      </div>

      {/* Campaign Modal */}
      <CampaignModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        campaignData={selectedCampaign}
        mode={selectedCampaign ? "edit" : "create"}
        onSave={handleSaveCampaign}
      />
    </div>
  );
}
