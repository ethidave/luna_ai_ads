"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Save,
  User,
  Mail,
  Shield,
  Crown,
  Users,
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Calendar,
  DollarSign,
  Target,
  Activity,
  Clock,
  Globe,
  Phone,
  MapPin,
  Building,
  FileText,
  Settings,
  Key,
  Bell,
  Star,
  Heart,
  ThumbsUp,
  MessageCircle,
  Camera,
  Image,
  Video,
  Music,
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
  Download,
  Upload,
  RefreshCw,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  Edit,
  Trash2,
  MoreVertical,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Check,
  X as XIcon,
  Loader2,
} from "lucide-react";

import { AdminUser } from "@/lib/services/adminApiService";

interface UserFormData {
  name: string;
  email: string;
  password?: string;
  is_admin?: boolean;
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: AdminUser;
  mode: "create" | "edit" | "view";
  onSave: (userData: UserFormData) => void;
  loading?: boolean;
}

export default function UserModal({
  isOpen,
  onClose,
  user,
  mode,
  onSave,
  loading = false,
}: UserModalProps) {
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    password: "",
    is_admin: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user && mode !== "create") {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "", // Don't pre-fill password for security
        is_admin: user.is_admin || false,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        password: "",
        is_admin: false,
      });
    }
    setErrors({});
  }, [user, mode, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (
      mode === "create" &&
      (!formData.password || !formData.password.trim())
    ) {
      newErrors.password = "Password is required for new users";
    }

    if (
      mode === "create" &&
      formData.password &&
      formData.password.length < 6
    ) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleInputChange = (
    field: keyof UserFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 rounded-xl border border-white/10 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              {mode === "create" && <Plus className="w-6 h-6 text-blue-400" />}
              {mode === "edit" && <Edit className="w-6 h-6 text-green-400" />}
              {mode === "view" && <Eye className="w-6 h-6 text-blue-400" />}
              <h2 className="text-xl font-semibold text-white">
                {mode === "create" && "Create New User"}
                {mode === "edit" && "Edit User"}
                {mode === "view" && "User Details"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {mode === "view" ? (
              // View Mode
              <div className="space-y-6">
                {/* User Avatar and Basic Info */}
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-xl">
                      {user?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {user?.name}
                    </h3>
                    <p className="text-white/70">{user?.email}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${
                          user?.email_verified_at
                            ? "text-green-400 bg-green-500/10 border-green-500/20"
                            : "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
                        }`}
                      >
                        {user?.email_verified_at ? "Verified" : "Pending"}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium border text-purple-400 bg-purple-500/10 border-purple-500/20">
                        {user?.is_admin ? "Admin" : "User"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* User Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-white/70 text-sm">Email</label>
                      <p className="text-white">{user?.email}</p>
                    </div>
                    <div>
                      <label className="text-white/70 text-sm">Role</label>
                      <p className="text-white capitalize">
                        {user?.is_admin ? "Admin" : "User"}
                      </p>
                    </div>
                    <div>
                      <label className="text-white/70 text-sm">
                        Email Verified
                      </label>
                      <p className="text-white">
                        {user?.email_verified_at ? "Yes" : "No"}
                      </p>
                    </div>
                    <div>
                      <label className="text-white/70 text-sm">User ID</label>
                      <p className="text-white">{user?.id}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-white/70 text-sm">
                        Created At
                      </label>
                      <p className="text-white">
                        {user?.created_at
                          ? new Date(user.created_at).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-white/70 text-sm">
                        Updated At
                      </label>
                      <p className="text-white">
                        {user?.updated_at
                          ? new Date(user.updated_at).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Create/Edit Mode
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    Basic Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/70 text-sm font-medium mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.name ? "border-red-500" : "border-white/20"
                        }`}
                        placeholder="Enter full name"
                        disabled={loading}
                      />
                      {errors.name && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-white/70 text-sm font-medium mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.email ? "border-red-500" : "border-white/20"
                        }`}
                        placeholder="Enter email address"
                        disabled={loading}
                      />
                      {errors.email && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    Authentication
                  </h3>

                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">
                      Password{" "}
                      {mode === "create"
                        ? "*"
                        : "(leave blank to keep current)"}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12 ${
                          errors.password ? "border-red-500" : "border-white/20"
                        }`}
                        placeholder={
                          mode === "create"
                            ? "Enter password"
                            : "Enter new password (optional)"
                        }
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors duration-200"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>
                </div>

                {/* Role */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    Role & Permissions
                  </h3>

                  <div>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.is_admin}
                        onChange={(e) =>
                          handleInputChange("is_admin", e.target.checked)
                        }
                        className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                        disabled={loading}
                      />
                      <span className="text-white/70 text-sm">
                        Admin privileges (can access admin panel)
                      </span>
                    </label>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end space-x-3 pt-6 border-t border-white/10">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>
                      {mode === "create" ? "Create User" : "Save Changes"}
                    </span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
