"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Settings,
  BarChart3,
  Calendar,
  Image,
  Video,
  FileText,
  Share2,
  ExternalLink,
  RefreshCw,
  Filter,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Heart,
  MessageCircle,
  ThumbsUp,
  Share,
  Download,
  Upload,
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  Linkedin,
  Globe,
  Users,
  TrendingUp,
  Clock,
  Target,
  Zap,
  Brain,
  Sparkles,
  ChevronRight,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  X,
  Save,
  Send,
  Play,
  Pause,
  Square,
  SkipForward,
  SkipBack,
  RotateCcw,
  Maximize,
  Minimize,
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
  PieChart,
  LineChart,
  Activity,
  DollarSign,
  MousePointer,
  Eye as EyeIcon,
  User,
  Tag,
  Hash,
  AtSign,
  MapPin,
  Timer,
  Volume2,
  Mic,
  Camera,
  Video as VideoIcon,
  Image as ImageIcon,
  File,
  Folder,
  Archive,
  Bookmark,
  Flag,
  Star,
  Heart as HeartIcon,
  ThumbsUp as ThumbsUpIcon,
  ThumbsDown,
  MessageCircle as MessageCircleIcon,
  Mail,
  Phone,
  MapPin as MapPinIcon,
  Clock3,
  Timer as TimerIcon,
  Clock as StopwatchIcon,
} from "lucide-react";

interface SocialAccount {
  id: string;
  platform: string;
  username: string;
  displayName: string;
  profilePicture: string;
  followersCount: number;
  postsCount: number;
  isConnected: boolean;
  canPostAds: boolean;
  canAccessAnalytics: boolean;
  status: string;
}

interface SocialPost {
  id: string;
  platform: string;
  content: string;
  type: string;
  status: string;
  visibility: string;
  mediaUrls: string[];
  hashtags: string[];
  likes: number;
  comments: number;
  shares: number;
  views: number;
  clicks: number;
  spend: number;
  revenue: number;
  scheduledAt?: string;
  publishedAt?: string;
  isAd: boolean;
  aiOptimization?: Record<string, unknown>;
  socialMediaAccount: {
    id: string;
    username: string;
    displayName: string;
    platform: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function SocialMediaPage() {
  const [accounts, setAccounts] = useState<Record<string, SocialAccount[]>>({});
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    fetchAccounts();
    fetchPosts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/social-media/accounts"
      );
      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          setAccounts(data.accounts || {});
        }
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/social-media/posts"
      );
      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          setPosts(data.posts || []);
        }
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const connectAccount = async (platform: string) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/auth/social/${platform}`
      );
      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          window.open(data.authUrl, "_blank");
        }
      }
    } catch (error) {
      console.error("Error connecting account:", error);
    }
  };

  const disconnectAccount = async (accountId: string) => {
    try {
      const response = await fetch(
        `/api/social-media/accounts?accountId=${accountId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        await fetchAccounts();
      }
    } catch (error) {
      console.error("Error disconnecting account:", error);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "facebook":
        return Facebook;
      case "instagram":
        return Instagram;
      case "youtube":
        return Youtube;
      case "twitter":
        return Twitter;
      case "linkedin":
        return Linkedin;
      default:
        return Globe;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "facebook":
        return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      case "instagram":
        return "text-pink-400 bg-pink-500/10 border-pink-500/20";
      case "youtube":
        return "text-red-400 bg-red-500/10 border-red-500/20";
      case "twitter":
        return "text-sky-400 bg-sky-500/10 border-sky-500/20";
      case "linkedin":
        return "text-blue-600 bg-blue-600/10 border-blue-600/20";
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "text-green-400 bg-green-500/10";
      case "scheduled":
        return "text-yellow-400 bg-yellow-500/10";
      case "draft":
        return "text-gray-400 bg-gray-500/10";
      case "failed":
        return "text-red-400 bg-red-500/10";
      default:
        return "text-gray-400 bg-gray-500/10";
    }
  };

  const totalAccounts = Object.values(accounts).flat().length;
  const totalPosts = posts.length;
  const totalFollowers = Object.values(accounts)
    .flat()
    .reduce((sum, account) => sum + account.followersCount, 0);
  const totalEngagement = posts.reduce(
    (sum, post) => sum + post.likes + post.comments + post.shares,
    0
  );

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-white/70">Loading social media accounts...</p>
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
            Social Media Management
          </h1>
          <p className="text-white/70">
            Connect, manage, and analyze your social media presence
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowCreatePost(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Post</span>
          </button>
          <button
            onClick={() => window.open("/social-media/analytics", "_blank")}
            className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300 flex items-center space-x-2"
          >
            <BarChart3 className="w-4 h-4" />
            <span>AI Analytics</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-xl backdrop-blur-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {totalFollowers.toLocaleString()}
            </h3>
            <p className="text-white/70 text-sm">Total Followers</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-green-500/10 border border-green-500/20 rounded-xl backdrop-blur-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <Share2 className="w-6 h-6 text-green-400" />
            </div>
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">{totalPosts}</h3>
            <p className="text-white/70 text-sm">Total Posts</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-purple-500/10 border border-purple-500/20 rounded-xl backdrop-blur-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <Heart className="w-6 h-6 text-purple-400" />
            </div>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {totalEngagement.toLocaleString()}
            </h3>
            <p className="text-white/70 text-sm">Total Engagement</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-orange-500/10 border border-orange-500/20 rounded-xl backdrop-blur-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-500/10 rounded-lg">
              <Globe className="w-6 h-6 text-orange-400" />
            </div>
            <TrendingUp className="w-4 h-4 text-orange-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {totalAccounts}
            </h3>
            <p className="text-white/70 text-sm">Connected Accounts</p>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-white/5 rounded-lg p-1">
        {[
          { id: "overview", label: "Overview", icon: BarChart3 },
          { id: "accounts", label: "Accounts", icon: Users },
          { id: "posts", label: "Posts", icon: FileText },
          { id: "analytics", label: "Analytics", icon: TrendingUp },
          { id: "scheduling", label: "Scheduling", icon: Calendar },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-white/10 text-white"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
          >
            <h3 className="text-xl font-semibold text-white mb-6">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setShowCreatePost(true)}
                className="p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg hover:from-blue-600/30 hover:to-purple-600/30 transition-all duration-300 text-left"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <Plus className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-medium">Create Post</span>
                </div>
                <p className="text-white/70 text-sm">
                  Share content across all platforms
                </p>
              </button>

              <button
                onClick={() => setActiveTab("accounts")}
                className="p-4 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-lg hover:from-green-600/30 hover:to-emerald-600/30 transition-all duration-300 text-left"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <Users className="w-5 h-5 text-green-400" />
                  <span className="text-white font-medium">
                    Manage Accounts
                  </span>
                </div>
                <p className="text-white/70 text-sm">
                  Connect or disconnect social accounts
                </p>
              </button>

              <button
                onClick={() => window.open("/social-media/analytics", "_blank")}
                className="p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg hover:from-purple-600/30 hover:to-pink-600/30 transition-all duration-300 text-left"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                  <span className="text-white font-medium">AI Analytics</span>
                </div>
                <p className="text-white/70 text-sm">
                  AI-powered insights and trends
                </p>
              </button>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
          >
            <h3 className="text-xl font-semibold text-white mb-6">
              Recent Activity
            </h3>
            <div className="space-y-3">
              {posts.slice(0, 3).map((post) => {
                const PlatformIcon = getPlatformIcon(post.platform);
                return (
                  <div
                    key={post.id}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-lg ${getPlatformColor(
                          post.platform
                        )}`}
                      >
                        <PlatformIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">
                          {post.content.substring(0, 40)}...
                        </p>
                        <p className="text-white/70 text-sm">
                          {post.platform} •{" "}
                          {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="text-white font-semibold text-sm">
                          {post.likes + post.comments + post.shares}
                        </div>
                        <div className="text-white/70 text-xs">Engagement</div>
                      </div>
                      <div
                        className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                          post.status
                        )}`}
                      >
                        {post.status}
                      </div>
                    </div>
                  </div>
                );
              })}
              {posts.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-white/30 mx-auto mb-4" />
                  <p className="text-white/70">
                    No posts yet. Create your first post!
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {activeTab === "accounts" && (
        <div className="space-y-6">
          {/* Connect New Accounts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
          >
            <h3 className="text-xl font-semibold text-white mb-6">
              Connect New Accounts
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  platform: "google",
                  name: "Google",
                  icon: Youtube,
                  color: "text-red-400 bg-red-500/10 border-red-500/20",
                },
                {
                  platform: "facebook",
                  name: "Facebook",
                  icon: Facebook,
                  color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
                },
                {
                  platform: "instagram",
                  name: "Instagram",
                  icon: Instagram,
                  color: "text-pink-400 bg-pink-500/10 border-pink-500/20",
                },
                {
                  platform: "twitter",
                  name: "Twitter",
                  icon: Twitter,
                  color: "text-sky-400 bg-sky-500/10 border-sky-500/20",
                },
              ].map(({ platform, name, icon: Icon, color }) => (
                <button
                  key={platform}
                  onClick={() => connectAccount(platform)}
                  className={`p-4 rounded-lg border ${color} hover:scale-105 transition-all duration-300`}
                >
                  <Icon className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm font-medium">{name}</p>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Connected Accounts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
          >
            <h3 className="text-xl font-semibold text-white mb-6">
              Connected Accounts
            </h3>
            <div className="space-y-4">
              {Object.entries(accounts).map(([platform, platformAccounts]) => (
                <div key={platform}>
                  <h4 className="text-lg font-medium text-white mb-3 capitalize">
                    {platform} Accounts
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {platformAccounts.map((account) => {
                      const PlatformIcon = getPlatformIcon(account.platform);
                      return (
                        <div
                          key={account.id}
                          className="p-4 bg-white/5 rounded-lg border border-white/10"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div
                                className={`p-2 rounded-lg ${getPlatformColor(
                                  account.platform
                                )}`}
                              >
                                <PlatformIcon className="w-4 h-4" />
                              </div>
                              <div>
                                <h5 className="text-white font-medium">
                                  {account.displayName}
                                </h5>
                                <p className="text-white/70 text-sm">
                                  @{account.username}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => disconnectAccount(account.id)}
                              className="p-1 hover:bg-white/10 rounded"
                            >
                              <X className="w-4 h-4 text-white/70" />
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-white/70">Followers</p>
                              <p className="text-white font-semibold">
                                {account.followersCount.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-white/70">Posts</p>
                              <p className="text-white font-semibold">
                                {account.postsCount.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <div
                              className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                                account.status
                              )}`}
                            >
                              {account.status}
                            </div>
                            <div className="flex items-center space-x-2">
                              {account.canPostAds && (
                                <div
                                  className="w-2 h-2 bg-green-400 rounded-full"
                                  title="Can post ads"
                                />
                              )}
                              {account.canAccessAnalytics && (
                                <div
                                  className="w-2 h-2 bg-blue-400 rounded-full"
                                  title="Can access analytics"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {activeTab === "posts" && (
        <div className="space-y-6">
          {/* Posts List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">All Posts</h3>
              <div className="flex items-center space-x-2">
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Platforms</option>
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="youtube">YouTube</option>
                  <option value="twitter">Twitter</option>
                </select>
                <button className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {posts
                .filter(
                  (post) =>
                    selectedPlatform === "all" ||
                    post.platform === selectedPlatform
                )
                .map((post) => {
                  const PlatformIcon = getPlatformIcon(post.platform);
                  return (
                    <div
                      key={post.id}
                      className="p-4 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`p-2 rounded-lg ${getPlatformColor(
                              post.platform
                            )}`}
                          >
                            <PlatformIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <h5 className="text-white font-medium">
                              {post.socialMediaAccount.displayName}
                            </h5>
                            <p className="text-white/70 text-sm">
                              @{post.socialMediaAccount.username} •{" "}
                              {post.platform}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div
                            className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                              post.status
                            )}`}
                          >
                            {post.status}
                          </div>
                          {post.isAd && (
                            <div className="px-2 py-1 rounded-full text-xs bg-purple-500/10 text-purple-400">
                              Ad
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-white/90 mb-3">{post.content}</p>
                      {post.mediaUrls && post.mediaUrls.length > 0 && (
                        <div className="mb-3">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {post.mediaUrls.slice(0, 4).map((url, index) => (
                              <div
                                key={index}
                                className="aspect-square bg-white/10 rounded-lg flex items-center justify-center"
                              >
                                <ImageIcon className="w-8 h-8 text-white/50" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {post.hashtags && post.hashtags.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-1">
                          {post.hashtags.slice(0, 5).map((hashtag, index) => (
                            <span key={index} className="text-blue-400 text-sm">
                              {hashtag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6 text-sm text-white/70">
                          <div className="flex items-center space-x-1">
                            <Heart className="w-4 h-4" />
                            <span>{post.likes}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{post.comments}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Share className="w-4 h-4" />
                            <span>{post.shares}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{post.views}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-1 hover:bg-white/10 rounded">
                            <Edit className="w-4 h-4 text-white/70" />
                          </button>
                          <button className="p-1 hover:bg-white/10 rounded">
                            <Trash2 className="w-4 h-4 text-white/70" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
