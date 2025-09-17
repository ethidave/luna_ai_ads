"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Save,
  Package,
  Plus,
  Trash2,
  DollarSign,
  Calendar,
  Users,
  Zap,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

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
}

interface PackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (packageData: PackageData) => void;
  packageData?: PackageData | null;
  mode: "create" | "edit";
}

const packageTypes = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
  { value: "weekly", label: "Weekly" },
  { value: "daily", label: "Daily" },
];

const statuses = [
  { value: "active", label: "Active", color: "text-green-400" },
  { value: "inactive", label: "Inactive", color: "text-gray-400" },
  { value: "draft", label: "Draft", color: "text-yellow-400" },
];

const platforms = [
  { value: "facebook", label: "Facebook" },
  { value: "google", label: "Google" },
  { value: "instagram", label: "Instagram" },
  { value: "twitter", label: "Twitter" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "tiktok", label: "TikTok" },
];

export default function PackageModal({
  isOpen,
  onClose,
  onSave,
  packageData,
  mode,
}: PackageModalProps) {
  const [formData, setFormData] = useState<PackageData>({
    name: "",
    description: "",
    price: 0,
    type: "monthly",
    status: "active",
    features: [""],
    platforms: ["facebook"],
    duration: 30,
    budget: 1000,
    maxCampaigns: 0,
    maxUsers: 1,
    limitations: {},
    customizations: [""],
    isPopular: false,
    isCustom: false,
    sortOrder: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (packageData && mode === "edit") {
      setFormData({
        ...packageData,
        features: packageData.features || [""],
        platforms: packageData.platforms || ["facebook"],
        customizations: packageData.customizations || [""],
        limitations: packageData.limitations || {},
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: 0,
        type: "monthly",
        status: "active",
        features: [""],
        platforms: ["facebook"],
        duration: 30,
        budget: 1000,
        maxCampaigns: 0,
        maxUsers: 1,
        limitations: {},
        customizations: [""],
        isPopular: false,
        isCustom: false,
        sortOrder: 0,
      });
    }
    setErrors({});
    setSuccess("");
    setError("");
  }, [packageData, mode, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Package name is required";
    }

    if (!formData.description?.trim()) {
      newErrors.description = "Description is required";
    }

    if (formData.price === undefined || formData.price < 0) {
      newErrors.price = "Price must be a positive number";
    }

    if (formData.duration === undefined || formData.duration < 1) {
      newErrors.duration = "Duration must be at least 1 day";
    }

    if (formData.budget === undefined || formData.budget < 0) {
      newErrors.budget = "Budget must be a positive number";
    }

    if (formData.maxUsers === undefined || formData.maxUsers < 1) {
      newErrors.maxUsers = "Must allow at least 1 user";
    }

    if (formData.maxCampaigns === undefined || formData.maxCampaigns < 0) {
      newErrors.maxCampaigns = "Max campaigns must be 0 or greater";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Filter out empty features and customizations
      const filteredData = {
        ...formData,
        features: formData.features?.filter((f) => f.trim() !== "") || [],
        customizations:
          formData.customizations?.filter((c) => c.trim() !== "") || [],
      };

      // Call the parent onSave function
      onSave(filteredData);

      setSuccess(
        mode === "create"
          ? "Package created successfully!"
          : "Package updated successfully!"
      );
      setTimeout(() => {
        setSuccess("");
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof PackageData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...(prev.features || []), ""],
    }));
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index) || [],
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features?.map((f, i) => (i === index ? value : f)) || [],
    }));
  };

  const addCustomization = () => {
    setFormData((prev) => ({
      ...prev,
      customizations: [...(prev.customizations || []), ""],
    }));
  };

  const removeCustomization = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      customizations: prev.customizations?.filter((_, i) => i !== index) || [],
    }));
  };

  const updateCustomization = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      customizations:
        prev.customizations?.map((c, i) => (i === index ? value : c)) || [],
    }));
  };

  const togglePlatform = (platform: string) => {
    setFormData((prev) => ({
      ...prev,
      platforms: prev.platforms?.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...(prev.platforms || []), platform],
    }));
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
          className="bg-gray-800 rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Package className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {mode === "create" ? "Create New Package" : "Edit Package"}
                </h2>
                <p className="text-gray-400 text-sm">
                  {mode === "create"
                    ? "Add a new subscription package"
                    : "Update package information"}
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

          {/* Success/Error Messages */}
          {success && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-green-400">{success}</span>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-400">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Package Name *
                </label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.name ? "border-red-500" : "border-gray-600"
                  }`}
                  placeholder="Enter package name"
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status *
                </label>
                <select
                  value={formData.status || "active"}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent ${
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

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description || ""}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={3}
                className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.description ? "border-red-500" : "border-gray-600"
                }`}
                placeholder="Enter package description"
              />
              {errors.description && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Pricing and Duration */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Price ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price || 0}
                  onChange={(e) =>
                    handleInputChange("price", parseFloat(e.target.value) || 0)
                  }
                  className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.price ? "border-red-500" : "border-gray-600"
                  }`}
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="text-red-400 text-sm mt-1">{errors.price}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Package Type
                </label>
                <select
                  value={formData.type || "monthly"}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {packageTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Duration (days) *
                </label>
                <input
                  type="number"
                  value={formData.duration || 30}
                  onChange={(e) =>
                    handleInputChange(
                      "duration",
                      parseInt(e.target.value) || 30
                    )
                  }
                  className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.duration ? "border-red-500" : "border-gray-600"
                  }`}
                  placeholder="30"
                />
                {errors.duration && (
                  <p className="text-red-400 text-sm mt-1">{errors.duration}</p>
                )}
              </div>
            </div>

            {/* Budget and Limits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Budget ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.budget || 1000}
                  onChange={(e) =>
                    handleInputChange(
                      "budget",
                      parseFloat(e.target.value) || 1000
                    )
                  }
                  className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.budget ? "border-red-500" : "border-gray-600"
                  }`}
                  placeholder="1000.00"
                />
                {errors.budget && (
                  <p className="text-red-400 text-sm mt-1">{errors.budget}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Max Users *
                </label>
                <input
                  type="number"
                  value={formData.maxUsers || 1}
                  onChange={(e) =>
                    handleInputChange("maxUsers", parseInt(e.target.value) || 1)
                  }
                  className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.maxUsers ? "border-red-500" : "border-gray-600"
                  }`}
                  placeholder="1"
                />
                {errors.maxUsers && (
                  <p className="text-red-400 text-sm mt-1">{errors.maxUsers}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Max Campaigns
                </label>
                <input
                  type="number"
                  value={formData.maxCampaigns || 0}
                  onChange={(e) =>
                    handleInputChange(
                      "maxCampaigns",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.maxCampaigns ? "border-red-500" : "border-gray-600"
                  }`}
                  placeholder="0"
                />
                {errors.maxCampaigns && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.maxCampaigns}
                  </p>
                )}
              </div>
            </div>

            {/* Platforms */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Supported Platforms
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {platforms.map((platform) => (
                  <label
                    key={platform.value}
                    className="flex items-center space-x-2 p-2 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={
                        formData.platforms?.includes(platform.value) || false
                      }
                      onChange={() => togglePlatform(platform.value)}
                      className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
                    />
                    <span className="text-white text-sm">{platform.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Features Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-300">
                  Features
                </label>
                <button
                  type="button"
                  onClick={addFeature}
                  className="flex items-center space-x-2 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Feature</span>
                </button>
              </div>
              <div className="space-y-2">
                {formData.features?.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter feature"
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="p-2 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Customizations Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-300">
                  Customizations
                </label>
                <button
                  type="button"
                  onClick={addCustomization}
                  className="flex items-center space-x-2 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Customization</span>
                </button>
              </div>
              <div className="space-y-2">
                {formData.customizations?.map((customization, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={customization}
                      onChange={(e) =>
                        updateCustomization(index, e.target.value)
                      }
                      className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter customization"
                    />
                    <button
                      type="button"
                      onClick={() => removeCustomization(index)}
                      className="p-2 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isPopular"
                    checked={formData.isPopular || false}
                    onChange={(e) =>
                      handleInputChange("isPopular", e.target.checked)
                    }
                    className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
                  />
                  <label
                    htmlFor="isPopular"
                    className="text-sm font-medium text-gray-300"
                  >
                    Mark as Popular
                  </label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isCustom"
                    checked={formData.isCustom || false}
                    onChange={(e) =>
                      handleInputChange("isCustom", e.target.checked)
                    }
                    className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
                  />
                  <label
                    htmlFor="isCustom"
                    className="text-sm font-medium text-gray-300"
                  >
                    Custom Package
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={formData.sortOrder || 0}
                  onChange={(e) =>
                    handleInputChange(
                      "sortOrder",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
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
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>
                  {loading
                    ? "Saving..."
                    : mode === "create"
                    ? "Create Package"
                    : "Save Changes"}
                </span>
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
