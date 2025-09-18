"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Save,
  Target,
  Plus,
  Trash2,
  DollarSign,
  Calendar,
  User,
  Tag,
} from "lucide-react";

interface CampaignData {
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
  owner: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface CampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (campaignData: Partial<CampaignData>) => void;
  campaignData?: CampaignData | null;
  mode: "create" | "edit";
}

const platforms = [
  { value: "facebook", label: "Facebook", color: "text-blue-400" },
  { value: "google", label: "Google Ads", color: "text-red-400" },
  { value: "instagram", label: "Instagram", color: "text-pink-400" },
];

const statuses = [
  { value: "active", label: "Active", color: "text-green-400" },
  { value: "paused", label: "Paused", color: "text-yellow-400" },
  { value: "completed", label: "Completed", color: "text-gray-400" },
  { value: "draft", label: "Draft", color: "text-blue-400" },
];

const objectives = [
  "Brand Awareness",
  "Reach",
  "Traffic",
  "Engagement",
  "App Installs",
  "Video Views",
  "Lead Generation",
  "Conversions",
  "Sales",
  "Store Visits",
];

export default function CampaignModal({
  isOpen,
  onClose,
  onSave,
  campaignData,
  mode,
}: CampaignModalProps) {
  const [formData, setFormData] = useState<Partial<CampaignData>>({
    name: "",
    platform: "facebook",
    status: "draft",
    objective: "",
    budget: 0,
    spent: 0,
    impressions: 0,
    clicks: 0,
    ctr: 0,
    cpc: 0,
    roas: 0,
    startDate: "",
    endDate: "",
    owner: "",
    tags: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (campaignData && mode === "edit") {
      setFormData(campaignData);
    } else {
      setFormData({
        name: "",
        platform: "facebook",
        status: "draft",
        objective: "",
        budget: 0,
        spent: 0,
        impressions: 0,
        clicks: 0,
        ctr: 0,
        cpc: 0,
        roas: 0,
        startDate: "",
        endDate: "",
        owner: "",
        tags: [],
      });
    }
    setErrors({});
    setNewTag("");
  }, [campaignData, mode, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Campaign name is required";
    }

    if (!formData.objective?.trim()) {
      newErrors.objective = "Objective is required";
    }

    if (formData.budget === undefined || formData.budget < 0) {
      newErrors.budget = "Budget must be a positive number";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.owner?.trim()) {
      newErrors.owner = "Owner is required";
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

  const handleInputChange = (field: keyof CampaignData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((tag) => tag !== tagToRemove) || [],
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
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
          className="bg-gray-800 rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Target className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {mode === "create" ? "Create New Campaign" : "Edit Campaign"}
                </h2>
                <p className="text-gray-400 text-sm">
                  {mode === "create"
                    ? "Add a new advertising campaign"
                    : "Update campaign information"}
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
                  Campaign Name *
                </label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.name ? "border-red-500" : "border-gray-600"
                  }`}
                  placeholder="Enter campaign name"
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Platform *
                </label>
                <select
                  value={formData.platform || "facebook"}
                  onChange={(e) =>
                    handleInputChange("platform", e.target.value)
                  }
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {platforms.map((platform) => (
                    <option key={platform.value} value={platform.value}>
                      {platform.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status *
                </label>
                <select
                  value={formData.status || "draft"}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {statuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Objective *
                </label>
                <select
                  value={formData.objective || ""}
                  onChange={(e) =>
                    handleInputChange("objective", e.target.value)
                  }
                  className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.objective ? "border-red-500" : "border-gray-600"
                  }`}
                >
                  <option value="">Select objective</option>
                  {objectives.map((objective) => (
                    <option key={objective} value={objective}>
                      {objective}
                    </option>
                  ))}
                </select>
                {errors.objective && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.objective}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Budget ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.budget || 0}
                  onChange={(e) =>
                    handleInputChange("budget", parseFloat(e.target.value) || 0)
                  }
                  className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.budget ? "border-red-500" : "border-gray-600"
                  }`}
                  placeholder="0.00"
                />
                {errors.budget && (
                  <p className="text-red-400 text-sm mt-1">{errors.budget}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Spent ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.spent || 0}
                  onChange={(e) =>
                    handleInputChange("spent", parseFloat(e.target.value) || 0)
                  }
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Owner *
                </label>
                <input
                  type="text"
                  value={formData.owner || ""}
                  onChange={(e) => handleInputChange("owner", e.target.value)}
                  className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.owner ? "border-red-500" : "border-gray-600"
                  }`}
                  placeholder="Enter owner name"
                />
                {errors.owner && (
                  <p className="text-red-400 text-sm mt-1">{errors.owner}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.startDate || ""}
                  onChange={(e) =>
                    handleInputChange("startDate", e.target.value)
                  }
                  className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.startDate ? "border-red-500" : "border-gray-600"
                  }`}
                />
                {errors.startDate && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.startDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate || ""}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Impressions
                </label>
                <input
                  type="number"
                  value={formData.impressions || 0}
                  onChange={(e) =>
                    handleInputChange(
                      "impressions",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Clicks
                </label>
                <input
                  type="number"
                  value={formData.clicks || 0}
                  onChange={(e) =>
                    handleInputChange("clicks", parseInt(e.target.value) || 0)
                  }
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  CTR (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.ctr || 0}
                  onChange={(e) =>
                    handleInputChange("ctr", parseFloat(e.target.value) || 0)
                  }
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  CPC ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.cpc || 0}
                  onChange={(e) =>
                    handleInputChange("cpc", parseFloat(e.target.value) || 0)
                  }
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                ROAS
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.roas || 0}
                onChange={(e) =>
                  handleInputChange("roas", parseFloat(e.target.value) || 0)
                }
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            {/* Tags Section */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tags
              </label>
              <div className="flex items-center space-x-2 mb-3">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter tag and press Enter"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center space-x-1 px-3 py-1 bg-purple-500/10 text-purple-300 rounded-full text-sm"
                  >
                    <Tag className="w-3 h-3" />
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-purple-400 hover:text-purple-300"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
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
                className="flex items-center space-x-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>
                  {mode === "create" ? "Create Campaign" : "Save Changes"}
                </span>
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
