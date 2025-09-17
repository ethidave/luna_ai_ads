"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import PaymentSettingsModal from "@/components/admin/PaymentSettingsModal";
import {
  Settings,
  User,
  Shield,
  Bell,
  Globe,
  Database,
  Server,
  Key,
  Save,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Info,
  Eye,
  EyeOff,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Globe as GlobeIcon,
  Smartphone,
  Monitor,
  Tablet,
  Wifi,
  HardDrive,
  Cpu,
  Layers,
  BarChart3,
  PieChart,
  LineChart,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  CreditCard,
  FileText,
  Package,
  Home,
  Wallet,
  Bell as BellIcon,
  Search,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Database as DatabaseIcon,
  Activity,
  Zap,
  DollarSign,
  Eye as EyeIcon,
  MousePointer,
  Calendar as CalendarIcon,
  UserCheck,
  AlertTriangle,
  CheckCircle as CheckCircleIcon,
  Clock as ClockIcon,
  Star,
  Filter,
  Download,
  Upload,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  ExternalLink,
  Lock,
  Unlock,
  Key as KeyIcon,
  Server as ServerIcon,
  Cpu as CpuIcon,
  HardDrive as HardDriveIcon,
  Wifi as WifiIcon,
  Monitor as MonitorIcon,
  Smartphone as SmartphoneIcon,
  Tablet as TabletIcon,
  Globe2,
  Layers as LayersIcon,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  BarChart as BarChartIcon,
  TrendingDown as TrendingDownIcon,
  Minus,
  Maximize,
  Minimize,
  RotateCcw,
  Save as SaveIcon,
  Copy,
  Share,
  Heart,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MapPin as MapPinIcon,
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
} from "lucide-react";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState({
    siteName: "Luna AI Admin",
    siteDescription: "Advanced AI-powered ad management platform",
    adminEmail: "admin@lunaai.com",
    timezone: "UTC",
    language: "en",
    theme: "dark",
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    security: {
      twoFactor: false,
      sessionTimeout: 30,
      passwordPolicy: "strong",
    },
    social: {
      google: true,
      facebook: true,
      github: true,
      twitter: false,
      linkedin: false,
    },
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");
  const [showPaymentSettings, setShowPaymentSettings] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus("saving");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: "general", name: "General", icon: Settings },
    { id: "security", name: "Security", icon: Shield },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "social", name: "Social Media", icon: Globe },
    { id: "payments", name: "Payments", icon: CreditCard },
    { id: "system", name: "System", icon: Server },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Settings</h1>
          <p className="text-white/70 mt-2">
            Manage your admin panel configuration
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Save Status */}
      {saveStatus !== "idle" && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg flex items-center space-x-3 ${
            saveStatus === "success"
              ? "bg-green-500/10 border border-green-500/20 text-green-400"
              : saveStatus === "error"
              ? "bg-red-500/10 border border-red-500/20 text-red-400"
              : "bg-blue-500/10 border border-blue-500/20 text-blue-400"
          }`}
        >
          {saveStatus === "success" ? (
            <CheckCircle className="w-5 h-5" />
          ) : saveStatus === "error" ? (
            <AlertCircle className="w-5 h-5" />
          ) : (
            <RefreshCw className="w-5 h-5 animate-spin" />
          )}
          <span>
            {saveStatus === "success"
              ? "Settings saved successfully!"
              : saveStatus === "error"
              ? "Failed to save settings. Please try again."
              : "Saving settings..."}
          </span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
            {activeTab === "general" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">
                  General Settings
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Site Name
                    </label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) =>
                        setSettings({ ...settings, siteName: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Admin Email
                    </label>
                    <input
                      type="email"
                      value={settings.adminEmail}
                      onChange={(e) =>
                        setSettings({ ...settings, adminEmail: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Timezone
                    </label>
                    <select
                      value={settings.timezone}
                      onChange={(e) =>
                        setSettings({ ...settings, timezone: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="UTC">UTC</option>
                      <option value="EST">Eastern Time</option>
                      <option value="PST">Pacific Time</option>
                      <option value="GMT">Greenwich Mean Time</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Language
                    </label>
                    <select
                      value={settings.language}
                      onChange={(e) =>
                        setSettings({ ...settings, language: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Site Description
                  </label>
                  <textarea
                    value={settings.siteDescription}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        siteDescription: e.target.value,
                      })
                    }
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Security Settings
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <h3 className="text-white font-medium">
                        Two-Factor Authentication
                      </h3>
                      <p className="text-white/70 text-sm">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setSettings({
                          ...settings,
                          security: {
                            ...settings.security,
                            twoFactor: !settings.security.twoFactor,
                          },
                        })
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.security.twoFactor
                          ? "bg-blue-500"
                          : "bg-gray-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.security.twoFactor
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="p-4 bg-white/5 rounded-lg">
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Session Timeout (minutes)
                    </label>
                    <input
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          security: {
                            ...settings.security,
                            sessionTimeout: parseInt(e.target.value),
                          },
                        })
                      }
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Notification Settings
                </h2>

                <div className="space-y-4">
                  {Object.entries(settings.notifications).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                      >
                        <div>
                          <h3 className="text-white font-medium capitalize">
                            {key} Notifications
                          </h3>
                          <p className="text-white/70 text-sm">
                            Receive notifications via {key}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            setSettings({
                              ...settings,
                              notifications: {
                                ...settings.notifications,
                                [key]: !value,
                              },
                            })
                          }
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            value ? "bg-blue-500" : "bg-gray-600"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              value ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {activeTab === "social" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Social Media Integration
                </h2>

                <div className="space-y-4">
                  {Object.entries(settings.social).map(
                    ([platform, enabled]) => (
                      <div
                        key={platform}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                            <Globe className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h3 className="text-white font-medium capitalize">
                              {platform}
                            </h3>
                            <p className="text-white/70 text-sm">
                              Enable {platform} login integration
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            setSettings({
                              ...settings,
                              social: {
                                ...settings.social,
                                [platform]: !enabled,
                              },
                            })
                          }
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            enabled ? "bg-blue-500" : "bg-gray-600"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              enabled ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {activeTab === "payments" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">
                    Payment Settings
                  </h2>
                  <button
                    onClick={() => setShowPaymentSettings(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Configure Payment Methods</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="p-6 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">Stripe</h3>
                        <p className="text-white/70 text-sm">
                          Credit Cards, Apple Pay
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70 text-sm">Status:</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-green-400 text-sm">
                          Configured
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Wallet className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">PayPal</h3>
                        <p className="text-white/70 text-sm">
                          PayPal Balance, Cards
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70 text-sm">Status:</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <span className="text-gray-400 text-sm">
                          Not Configured
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">
                          Flutterwave
                        </h3>
                        <p className="text-white/70 text-sm">
                          Mobile Money, Bank Transfer
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70 text-sm">Status:</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <span className="text-gray-400 text-sm">
                          Not Configured
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">
                          NowPayments
                        </h3>
                        <p className="text-white/70 text-sm">
                          USDT Cryptocurrency
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70 text-sm">Status:</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <span className="text-gray-400 text-sm">
                          Not Configured
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
                  <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="text-blue-400 font-semibold mb-2">
                        Payment Configuration
                      </h4>
                      <p className="text-blue-300/80 text-sm mb-4">
                        Configure your payment methods to accept payments from
                        customers. Each payment method requires specific API
                        keys and credentials.
                      </p>
                      <ul className="text-blue-300/80 text-sm space-y-1">
                        <li>
                          • Stripe: Accept credit cards, Apple Pay, Google Pay
                        </li>
                        <li>
                          • PayPal: Accept PayPal balance and credit cards
                        </li>
                        <li>
                          • Flutterwave: Accept mobile money and bank transfers
                        </li>
                        <li>
                          • NowPayments: Accept USDT cryptocurrency payments
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "system" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">
                  System Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-white/5 rounded-lg">
                    <h3 className="text-white font-medium mb-2">
                      Server Status
                    </h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-white/70 text-sm">Online</span>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-lg">
                    <h3 className="text-white font-medium mb-2">
                      Database Status
                    </h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-white/70 text-sm">Connected</span>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-lg">
                    <h3 className="text-white font-medium mb-2">
                      Memory Usage
                    </h3>
                    <span className="text-white/70 text-sm">2.4 GB / 8 GB</span>
                  </div>

                  <div className="p-4 bg-white/5 rounded-lg">
                    <h3 className="text-white font-medium mb-2">CPU Usage</h3>
                    <span className="text-white/70 text-sm">45%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Settings Modal */}
      <PaymentSettingsModal
        isOpen={showPaymentSettings}
        onClose={() => setShowPaymentSettings(false)}
      />
    </div>
  );
}
