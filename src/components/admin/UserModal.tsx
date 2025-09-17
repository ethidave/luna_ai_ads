"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Save,
  User,
  Mail,
  Shield,
  CreditCard,
  Calendar,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "moderator";
  status: "active" | "inactive" | "suspended";
  plan: string;
  totalSpent: number;
  campaigns: number;
  lastActive: string;
  createdAt: string;
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Partial<User>) => void;
  user?: User | null;
  mode: "create" | "edit";
}

const roles = [
  { value: "admin", label: "Admin", color: "text-red-400" },
  { value: "moderator", label: "Moderator", color: "text-yellow-400" },
  { value: "user", label: "User", color: "text-green-400" },
];

const statuses = [
  { value: "active", label: "Active", color: "text-green-400" },
  { value: "inactive", label: "Inactive", color: "text-gray-400" },
  { value: "suspended", label: "Suspended", color: "text-red-400" },
];

const plans = [
  { value: "starter", label: "Starter" },
  { value: "professional", label: "Professional" },
  { value: "enterprise", label: "Enterprise" },
];

export default function UserModal({
  isOpen,
  onClose,
  onSave,
  user,
  mode,
}: UserModalProps) {
  const [formData, setFormData] = useState<Partial<User>>({
    name: "",
    email: "",
    role: "user",
    status: "active",
    plan: "starter",
    totalSpent: 0,
    campaigns: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user && mode === "edit") {
      setFormData(user);
    } else {
      setFormData({
        name: "",
        email: "",
        role: "user",
        status: "active",
        plan: "starter",
        totalSpent: 0,
        campaigns: 0,
      });
    }
    setErrors({});
  }, [user, mode, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.role) {
      newErrors.role = "Role is required";
    }

    if (!formData.status) {
      newErrors.status = "Status is required";
    }

    if (!formData.plan) {
      newErrors.plan = "Plan is required";
    }

    if (formData.totalSpent !== undefined && formData.totalSpent < 0) {
      newErrors.totalSpent = "Total spent cannot be negative";
    }

    if (formData.campaigns !== undefined && formData.campaigns < 0) {
      newErrors.campaigns = "Campaigns count cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  const handleInputChange = (field: keyof User, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <User className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {mode === "create" ? "Create New User" : "Edit User"}
                </h2>
                <p className="text-gray-400 text-sm">
                  {mode === "create"
                    ? "Add a new user to the system"
                    : "Update user information"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name ? "border-red-500" : "border-gray-600"
                  }`}
                  placeholder="Enter full name"
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? "border-red-500" : "border-gray-600"
                  }`}
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Role *
                </label>
                <select
                  value={formData.role || "user"}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                  className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.role ? "border-red-500" : "border-gray-600"
                  }`}
                >
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <p className="text-red-400 text-sm mt-1">{errors.role}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status *
                </label>
                <select
                  value={formData.status || "active"}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.status ? "border-red-500" : "border-gray-600"
                  }`}
                >
                  {statuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
                {errors.status && (
                  <p className="text-red-400 text-sm mt-1">{errors.status}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Subscription Plan *
                </label>
                <select
                  value={formData.plan || "starter"}
                  onChange={(e) => handleInputChange("plan", e.target.value)}
                  className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.plan ? "border-red-500" : "border-gray-600"
                  }`}
                >
                  {plans.map((plan) => (
                    <option key={plan.value} value={plan.value}>
                      {plan.label}
                    </option>
                  ))}
                </select>
                {errors.plan && (
                  <p className="text-red-400 text-sm mt-1">{errors.plan}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Total Spent ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.totalSpent || 0}
                  onChange={(e) =>
                    handleInputChange(
                      "totalSpent",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.totalSpent ? "border-red-500" : "border-gray-600"
                  }`}
                  placeholder="0.00"
                />
                {errors.totalSpent && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.totalSpent}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Campaigns Count
              </label>
              <input
                type="number"
                value={formData.campaigns || 0}
                onChange={(e) =>
                  handleInputChange("campaigns", parseInt(e.target.value) || 0)
                }
                className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.campaigns ? "border-red-500" : "border-gray-600"
                }`}
                placeholder="0"
              />
              {errors.campaigns && (
                <p className="text-red-400 text-sm mt-1">{errors.campaigns}</p>
              )}
            </div>

            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>
                  {mode === "create" ? "Create User" : "Save Changes"}
                </span>
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
