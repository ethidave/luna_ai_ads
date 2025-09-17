"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  Eye,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar,
  Shield,
  Crown,
  Star,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  CreditCard,
  Target,
  BarChart3,
  Download,
  Upload,
  RefreshCw,
  SortAsc,
  SortDesc,
  ChevronDown,
  ChevronUp,
  X,
  Save,
  Cancel,
  Lock,
  Unlock,
  Key,
  Settings,
  Activity,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
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
  Heart as HeartIcon,
  ThumbsUp as ThumbsUpIcon,
  ThumbsDown as ThumbsDownIcon,
  MessageCircle as MessageCircleIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  Calendar as CalendarIcon,
  Shield as ShieldIcon,
  Crown as CrownIcon,
  Star as StarIcon,
  AlertTriangle as AlertTriangleIcon,
  CheckCircle as CheckCircleIcon,
  Clock as ClockIcon,
  Globe as GlobeIcon,
  CreditCard as CreditCardIcon,
  Target as TargetIcon,
  BarChart3 as BarChart3Icon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  RefreshCw as RefreshCwIcon,
  SortAsc as SortAscIcon,
  SortDesc as SortDescIcon,
  ChevronDown as ChevronDownIcon,
  ChevronUp as ChevronUpIcon,
  X as XIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Lock as LockIcon,
  Unlock as UnlockIcon,
  Key as KeyIcon,
  Settings as SettingsIcon,
  Activity as ActivityIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  DollarSign as DollarSignIcon,
  Package as PackageIcon,
  FileText as FileTextIcon,
  Bell as BellIcon,
  Flag as FlagIcon,
  Bookmark as BookmarkIcon,
  Tag as TagIcon,
  Archive as ArchiveIcon,
  Folder as FolderIcon,
  Image as ImageIcon,
  Video as VideoIcon,
  Camera as CameraIcon,
  Mic as MicIcon,
  Volume2 as Volume2Icon,
  Play as PlayIcon,
  Pause as PauseIcon,
  Square as SquareIcon,
  SkipForward as SkipForwardIcon,
  SkipBack as SkipBackIcon,
  RotateCcw as RotateCcwIcon,
  Maximize as MaximizeIcon,
  Minimize as MinimizeIcon,
  ExternalLink as ExternalLinkIcon,
  Copy as CopyIcon,
  Share as ShareIcon,
} from "lucide-react";
import UserModal from "@/components/admin/UserModal";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "moderator";
  status: "active" | "inactive" | "suspended" | "pending";
  plan: "starter" | "professional" | "enterprise";
  joinDate: string;
  lastActive: string;
  totalSpent: number;
  campaigns: number;
  avatar?: string;
  phone?: string;
  location?: string;
  verified: boolean;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/users");
        if (response.ok) {
          const data = await response.json();
          setUsers(data.users || []);
          console.log(`Successfully loaded ${data.users?.length || 0} users`);

          if (data.message) {
            console.log("Users data message:", data.message);
          }
        } else if (response.status === 401) {
          console.error(
            "Unauthorized: Please log in as an admin to access this page"
          );
          // Redirect to login or show unauthorized message
          setUsers([]);
        } else {
          const errorData = await response.json();
          console.error("Failed to fetch users:", errorData);
          // Set empty array on error to prevent UI issues
          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        // Set empty array on error to prevent UI issues
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");

  const filteredUsers = users
    .filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter;
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      return matchesSearch && matchesStatus && matchesRole;
    })
    .sort((a, b) => {
      let aValue = a[sortBy as keyof User];
      let bValue = b[sortBy as keyof User];

      if (typeof aValue === "string") aValue = aValue.toLowerCase();
      if (typeof bValue === "string") bValue = bValue.toLowerCase();

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleAddUser = () => {
    setSelectedUser(undefined);
    setShowModal(true);
  };

  const handleSaveUser = (userData: User) => {
    if (selectedUser) {
      setUsers(
        users.map((user) => (user.id === selectedUser.id ? userData : user))
      );
    } else {
      setUsers([...users, { ...userData, id: Date.now().toString() }]);
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((user) => user.id !== userId));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-400 bg-green-500/10 border-green-500/20";
      case "inactive":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
      case "suspended":
        return "text-red-400 bg-red-500/10 border-red-500/20";
      case "pending":
        return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return Crown;
      case "moderator":
        return Shield;
      default:
        return Users;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-white/70">Loading users...</p>
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
            User Management
          </h1>
          <p className="text-white/70">Manage users, roles, and permissions</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button
            onClick={handleAddUser}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users..."
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
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </select>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="moderator">Moderator</option>
            <option value="admin">Admin</option>
          </select>
          <div className="flex items-center space-x-2">
            <button
              onClick={() =>
                setViewMode(viewMode === "grid" ? "table" : "grid")
              }
              className="p-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300"
            >
              {viewMode === "grid" ? (
                <Users className="w-5 h-5" />
              ) : (
                <BarChart3 className="w-5 h-5" />
              )}
            </button>
            <button className="p-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300">
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-white font-medium">
                  User
                </th>
                <th className="px-6 py-4 text-left text-white font-medium">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-white font-medium">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-white font-medium">
                  Plan
                </th>
                <th className="px-6 py-4 text-left text-white font-medium">
                  Spent
                </th>
                <th className="px-6 py-4 text-left text-white font-medium">
                  Campaigns
                </th>
                <th className="px-6 py-4 text-left text-white font-medium">
                  Last Active
                </th>
                <th className="px-6 py-4 text-left text-white font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredUsers.map((user) => {
                const RoleIcon = getRoleIcon(user.role);
                return (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="hover:bg-white/5 transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <div className="text-white font-medium">
                            {user.name}
                          </div>
                          <div className="text-white/70 text-sm">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <RoleIcon className="w-4 h-4 text-white/70" />
                        <span className="text-white capitalize">
                          {user.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          user.status
                        )}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white capitalize">{user.plan}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white font-medium">
                        ${user.totalSpent.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white">{user.campaigns}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white/70 text-sm">
                        {user.lastActive}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all duration-300"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Modal */}
      <UserModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        user={selectedUser}
        onSave={handleSaveUser}
      />
    </div>
  );
}
