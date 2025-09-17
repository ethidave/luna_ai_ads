"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Plus,
  Target,
  DollarSign,
  Calendar,
  Clock,
  Users,
  Globe,
  Search,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Image,
  Video,
  Type,
  Palette,
  Settings,
  Zap,
  CheckCircle,
  AlertCircle,
  Upload,
  Link,
  Eye,
  MousePointer,
  BarChart3,
  TrendingUp,
  Star,
  Award,
  Brain,
  Sparkles,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  Save,
  Play,
  Pause,
  Edit,
  Trash2,
} from "lucide-react";
import ExistingAdsSelector from "./ExistingAdsSelector";
import AdOptimizationModal from "./AdOptimizationModal";

interface CampaignCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCampaignCreated?: (campaign: any) => void;
}

export default function CampaignCreationModal({
  isOpen,
  onClose,
  onCampaignCreated,
}: CampaignCreationModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);
  const [showAIFeatures, setShowAIFeatures] = useState(false);
  const [showExistingAdsSelector, setShowExistingAdsSelector] = useState(false);
  const [showAdOptimization, setShowAdOptimization] = useState(false);
  const [websiteAnalysis, setWebsiteAnalysis] = useState<any>(null);
  const [isAnalyzingWebsite, setIsAnalyzingWebsite] = useState(false);
  const [campaignData, setCampaignData] = useState({
    name: "",
    description: "",
    platforms: [] as string[],
    objective: "",
    websiteUrl: "", // Optional website URL for analysis
    targetAudience: {
      age: { min: 18, max: 65 },
      gender: "all",
      interests: [] as string[],
      locations: [] as string[],
      languages: [] as string[],
    },
    creative: {
      headline: "",
      description: "",
      callToAction: "",
      // Removed images and videos - focus on analysis only
    },
    schedule: {
      startDate: "",
      endDate: "",
      timezone: "UTC",
    },
    settings: {
      bidStrategy: "automatic",
      optimization: "conversions",
      delivery: "standard",
    },
  });

  const platforms = [
    {
      id: "facebook",
      name: "Facebook Ads",
      icon: Facebook,
      color: "from-blue-600 to-indigo-600",
      description: "Facebook, Instagram, Messenger ads",
      features: ["Feed ads", "Stories ads", "Reels ads", "Carousel ads"],
    },
    {
      id: "google",
      name: "Google Ads",
      icon: Search,
      color: "from-green-500 to-emerald-500",
      description: "Search, Display, Video, Shopping ads",
      features: [
        "Search campaigns",
        "Display network",
        "YouTube ads",
        "Shopping ads",
      ],
    },
  ];

  const objectives = [
    {
      id: "awareness",
      name: "Brand Awareness",
      description: "Increase brand recognition and reach",
      icon: Eye,
      platforms: ["facebook", "google"],
    },
    {
      id: "traffic",
      name: "Website Traffic",
      description: "Drive visitors to your website",
      icon: Globe,
      platforms: ["facebook", "google"],
    },
    {
      id: "leads",
      name: "Lead Generation",
      description: "Capture potential customer information",
      icon: Users,
      platforms: ["facebook", "google"],
    },
    {
      id: "sales",
      name: "Sales & Conversions",
      description: "Drive direct sales and conversions",
      icon: DollarSign,
      platforms: ["facebook", "google"],
    },
    {
      id: "engagement",
      name: "Engagement",
      description: "Increase social media engagement",
      icon: MousePointer,
      platforms: ["facebook", "google"],
    },
  ];

  const interests = [
    "Technology",
    "Marketing",
    "Business",
    "Finance",
    "Health",
    "Fitness",
    "Travel",
    "Food",
    "Fashion",
    "Sports",
    "Entertainment",
    "Education",
    "Real Estate",
    "Automotive",
    "Beauty",
    "Gaming",
    "Music",
    "Art",
  ];

  const locations = [
    "United States",
    "Canada",
    "United Kingdom",
    "Germany",
    "France",
    "Australia",
    "Japan",
    "India",
    "Brazil",
    "Mexico",
    "Spain",
    "Italy",
  ];

  const languages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Italian",
    "Portuguese",
    "Chinese",
    "Japanese",
    "Korean",
    "Arabic",
    "Russian",
    "Dutch",
  ];

  const bidStrategies = [
    {
      id: "automatic",
      name: "Automatic Bidding",
      description: "Let AI optimize your bids",
    },
    {
      id: "manual",
      name: "Manual Bidding",
      description: "Set your own bid amounts",
    },
    {
      id: "target_cpa",
      name: "Target CPA",
      description: "Optimize for cost per acquisition",
    },
    {
      id: "target_roas",
      name: "Target ROAS",
      description: "Optimize for return on ad spend",
    },
  ];

  const handlePlatformToggle = (platformId: string) => {
    setCampaignData((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter((id) => id !== platformId)
        : [...prev.platforms, platformId],
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setCampaignData((prev) => ({
      ...prev,
      targetAudience: {
        ...prev.targetAudience,
        interests: prev.targetAudience.interests.includes(interest)
          ? prev.targetAudience.interests.filter((i) => i !== interest)
          : [...prev.targetAudience.interests, interest],
      },
    }));
  };

  const handleLocationToggle = (location: string) => {
    setCampaignData((prev) => ({
      ...prev,
      targetAudience: {
        ...prev.targetAudience,
        locations: prev.targetAudience.locations.includes(location)
          ? prev.targetAudience.locations.filter((l) => l !== location)
          : [...prev.targetAudience.locations, location],
      },
    }));
  };

  // Image and video upload handlers removed - focus on analysis only

  const analyzeWebsite = async () => {
    if (!campaignData.websiteUrl) return;

    setIsAnalyzingWebsite(true);
    try {
      const response = await fetch("/api/ai/analyze-website", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ websiteUrl: campaignData.websiteUrl }),
      });

      const data = await response.json();
      if (data.success) {
        setWebsiteAnalysis(data.analysis);
        // Auto-populate fields with analysis insights
        setCampaignData((prev) => ({
          ...prev,
          description: data.analysis.description || prev.description,
          targetAudience: {
            ...prev.targetAudience,
            interests:
              data.analysis.keywords?.slice(0, 5) ||
              prev.targetAudience.interests,
          },
        }));
      }
    } catch (error) {
      console.error("Website analysis failed:", error);
    } finally {
      setIsAnalyzingWebsite(false);
    }
  };

  const handleExistingAdSelected = (ad: any) => {
    // Populate form with existing ad data
    setCampaignData((prev) => ({
      ...prev,
      name: `Improved ${ad.name}`,
      description: ad.description,
      platforms: [ad.platform],
      objective: ad.objective,
      targetAudience: {
        ...prev.targetAudience,
        interests: ad.keywords || prev.targetAudience.interests,
      },
      creative: {
        headline: ad.headline,
        description: ad.description,
        callToAction: ad.callToAction,
      },
    }));
    setShowExistingAdsSelector(false);
  };

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generateAIContent = async () => {
    if (
      !campaignData.name ||
      !campaignData.objective ||
      campaignData.platforms.length === 0
    ) {
      setValidationErrors([
        "Please fill in campaign name, objective, and select platforms before generating AI content",
      ]);
      return;
    }

    setIsGeneratingAI(true);
    try {
      const response = await fetch("/api/ai/generate-copy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productName: campaignData.name,
          targetAudience: `${campaignData.targetAudience.age.min}-${
            campaignData.targetAudience.age.max
          } years, ${
            campaignData.targetAudience.gender
          }, interested in ${campaignData.targetAudience.interests.join(", ")}`,
          platform: campaignData.platforms[0],
          objective: campaignData.objective,
          tone: "professional",
          language: "English",
          industry: "Technology",
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setAiSuggestions(result.data);
        setShowAIFeatures(true);

        // Auto-fill creative fields with AI suggestions
        setCampaignData((prev) => ({
          ...prev,
          creative: {
            ...prev.creative,
            headline: result.data.headline,
            description: result.data.primaryText,
            callToAction: result.data.callToAction,
          },
        }));
      }
    } catch (error) {
      console.error("AI generation error:", error);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const generateGlobalTargeting = async () => {
    setIsGeneratingAI(true);
    try {
      const response = await fetch("/api/ai/global-targeting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productName: campaignData.name,
          industry: "Technology",
          budget: 0, // No budget needed for analysis-only campaigns
          objective: campaignData.objective,
          primaryLanguage: "English",
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setAiSuggestions((prev) => ({
          ...prev,
          globalTargeting: result.data,
        }));
      }
    } catch (error) {
      console.error("Global targeting generation error:", error);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const generatePerformancePrediction = async () => {
    setIsGeneratingAI(true);
    try {
      const response = await fetch("/api/ai/performance-prediction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(campaignData),
      });

      if (response.ok) {
        const result = await response.json();
        setAiSuggestions((prev) => ({
          ...prev,
          performancePrediction: result.data,
        }));
      }
    } catch (error) {
      console.error("Performance prediction error:", error);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleCreateCampaign = async () => {
    setIsCreating(true);

    try {
      // Validate required fields
      const errors: string[] = [];
      if (!campaignData.name) errors.push("Campaign Name is required");
      // Budget validation removed - focus on analysis only
      if (campaignData.platforms.length === 0)
        errors.push("Please select at least one platform");
      if (!campaignData.objective)
        errors.push("Campaign Objective is required");

      if (errors.length > 0) {
        setValidationErrors(errors);
        setIsCreating(false);
        return;
      }

      setValidationErrors([]);

      // Prepare campaign data for API
      const campaignPayload = {
        name: campaignData.name,
        description: campaignData.description,
        platforms: campaignData.platforms,
        objective: campaignData.objective,
        budget: 0, // No budget needed for analysis-only campaigns
        targetAudience: campaignData.targetAudience,
        creative: campaignData.creative,
        schedule: campaignData.schedule,
        settings: campaignData.settings,
      };

      // Call the API to create campaign
      console.log("Creating campaign with payload:", campaignPayload);
      const response = await fetch("/api/campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(campaignPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create campaign");
      }

      const result = await response.json();
      const newCampaign = result.campaign;

      // Add performance data for display
      const campaignWithPerformance = {
        ...newCampaign,
        performance: {
          impressions: 0,
          clicks: 0,
          conversions: 0,
          spend: 0,
          ctr: 0,
          cpc: 0,
          roas: 0,
        },
        platforms: JSON.parse(newCampaign.platforms),
        targetAudience: JSON.parse(newCampaign.targetAudience),
        creative: JSON.parse(newCampaign.creative),
        schedule: JSON.parse(newCampaign.schedule),
        settings: JSON.parse(newCampaign.settings),
      };

      if (onCampaignCreated) {
        onCampaignCreated(campaignWithPerformance);
      }

      // Show success message
      console.log(
        `Campaign "${newCampaign.name}" created successfully! It's now being set up on ${campaignData.platforms.length} platform(s).`
      );

      onClose();
    } catch (error) {
      console.error("Error creating campaign:", error);
      // You could add a toast notification here instead of alert
      console.error(
        `Error creating campaign: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="campaign-creation-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Analyze Campaign
                </h2>
                <p className="text-white/70">
                  Set up campaign analysis for Facebook and Google Ads
                  optimization
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/70 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white text-sm">
                Step {currentStep} of 6
              </span>
              <span className="text-white/70 text-sm">
                {Math.round((currentStep / 6) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 6) * 100}%` }}
              />
            </div>
          </div>

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-red-500/20 border border-red-500/30 rounded-lg p-4"
            >
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <h4 className="text-red-400 font-semibold">
                  Please fix the following errors:
                </h4>
              </div>
              <ul className="text-red-300 text-sm space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-red-400 rounded-full" />
                    <span>{error}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Campaign Information
                </h3>
                <p className="text-white/70">
                  Provide basic details about your campaign
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Campaign Name
                  </label>
                  <input
                    type="text"
                    value={campaignData.name}
                    onChange={(e) =>
                      setCampaignData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="e.g., Summer Sale 2024"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-white font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    value={campaignData.description}
                    onChange={(e) =>
                      setCampaignData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Describe your campaign goals and strategy..."
                    rows={3}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-white font-medium mb-2">
                    Website URL (Optional)
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                    <input
                      type="url"
                      value={campaignData.websiteUrl}
                      onChange={(e) =>
                        setCampaignData((prev) => ({
                          ...prev,
                          websiteUrl: e.target.value,
                        }))
                      }
                      placeholder="https://yourwebsite.com"
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <p className="text-white/50 text-sm mt-1">
                    Optional: Add your website URL for better analysis and
                    optimization
                  </p>
                  {campaignData.websiteUrl && (
                    <button
                      onClick={analyzeWebsite}
                      disabled={isAnalyzingWebsite}
                      className="mt-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {isAnalyzingWebsite ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Brain className="w-4 h-4" />
                      )}
                      <span>
                        {isAnalyzingWebsite
                          ? "Analyzing..."
                          : "Analyze Website"}
                      </span>
                    </button>
                  )}

                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-white/70 text-sm mb-3">
                      Or select an existing ad to improve:
                    </p>
                    <button
                      onClick={() => setShowExistingAdsSelector(true)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                    >
                      <Target className="w-4 h-4" />
                      <span>Select Existing Ad</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Platform Selection (Facebook & Google Only) */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Select Platforms
                </h3>
                <p className="text-white/70">
                  Choose which platforms you want to advertise on
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {platforms.map((platform) => (
                  <div
                    key={platform.id}
                    onClick={() => handlePlatformToggle(platform.id)}
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                      campaignData.platforms.includes(platform.id)
                        ? "border-blue-500 bg-blue-500/20"
                        : "border-white/20 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div
                        className={`p-3 rounded-lg bg-gradient-to-r ${platform.color}`}
                      >
                        <platform.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-semibold mb-1">
                          {platform.name}
                        </h4>
                        <p className="text-white/70 text-sm mb-3">
                          {platform.description}
                        </p>
                        <div className="space-y-1">
                          {platform.features.map((feature, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2"
                            >
                              <div className="w-1 h-1 bg-white/70 rounded-full" />
                              <span className="text-white/70 text-xs">
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Campaign Objective */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Campaign Objective
                </h3>
                <p className="text-white/70">
                  What do you want to achieve with this campaign?
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {objectives.map((objective) => (
                  <div
                    key={objective.id}
                    onClick={() =>
                      setCampaignData((prev) => ({
                        ...prev,
                        objective: objective.id,
                      }))
                    }
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                      campaignData.objective === objective.id
                        ? "border-blue-500 bg-blue-500/20"
                        : "border-white/20 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                        <objective.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">
                          {objective.name}
                        </h4>
                        <p className="text-white/70 text-sm mb-3">
                          {objective.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {objective.platforms.map((platformId) => {
                            const platform = platforms.find(
                              (p) => p.id === platformId
                            );
                            return platform ? (
                              <span
                                key={platformId}
                                className="px-2 py-1 bg-white/10 rounded-full text-white text-xs"
                              >
                                {platform.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 4: Target Audience */}
          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Target Audience
                </h3>
                <p className="text-white/70">
                  Define who you want to reach with your ads
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Demographics */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-white font-semibold mb-4">
                      Demographics
                    </h4>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-white font-medium mb-2">
                          Age Range
                        </label>
                        <div className="flex items-center space-x-4">
                          <input
                            type="number"
                            value={campaignData.targetAudience.age.min}
                            onChange={(e) =>
                              setCampaignData((prev) => ({
                                ...prev,
                                targetAudience: {
                                  ...prev.targetAudience,
                                  age: {
                                    ...prev.targetAudience.age,
                                    min: parseInt(e.target.value),
                                  },
                                },
                              }))
                            }
                            className="w-20 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-white/70">to</span>
                          <input
                            type="number"
                            value={campaignData.targetAudience.age.max}
                            onChange={(e) =>
                              setCampaignData((prev) => ({
                                ...prev,
                                targetAudience: {
                                  ...prev.targetAudience,
                                  age: {
                                    ...prev.targetAudience.age,
                                    max: parseInt(e.target.value),
                                  },
                                },
                              }))
                            }
                            className="w-20 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-white font-medium mb-2">
                          Gender
                        </label>
                        <select
                          value={campaignData.targetAudience.gender}
                          onChange={(e) =>
                            setCampaignData((prev) => ({
                              ...prev,
                              targetAudience: {
                                ...prev.targetAudience,
                                gender: e.target.value,
                              },
                            }))
                          }
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="all">All Genders</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold mb-4">Interests</h4>
                    <div className="flex flex-wrap gap-2">
                      {interests.map((interest) => (
                        <button
                          key={interest}
                          onClick={() => handleInterestToggle(interest)}
                          className={`px-3 py-2 rounded-full text-sm transition-all duration-300 ${
                            campaignData.targetAudience.interests.includes(
                              interest
                            )
                              ? "bg-blue-500 text-white"
                              : "bg-white/10 text-white/70 hover:bg-white/20"
                          }`}
                        >
                          {interest}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Locations & Languages */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-white font-semibold mb-4">Locations</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {locations.map((location) => (
                        <label
                          key={location}
                          className="flex items-center space-x-3 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={campaignData.targetAudience.locations.includes(
                              location
                            )}
                            onChange={() => handleLocationToggle(location)}
                            className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                          />
                          <span className="text-white/70 text-sm">
                            {location}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold mb-4">Languages</h4>
                    <select
                      multiple
                      value={campaignData.targetAudience.languages}
                      onChange={(e) =>
                        setCampaignData((prev) => ({
                          ...prev,
                          targetAudience: {
                            ...prev.targetAudience,
                            languages: Array.from(
                              e.target.selectedOptions,
                              (option) => option.value
                            ),
                          },
                        }))
                      }
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {languages.map((language) => (
                        <option
                          key={language}
                          value={language}
                          className="bg-gray-800"
                        >
                          {language}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 5: Creative Analysis */}
          {currentStep === 5 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-white">
                    Creative Analysis
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={generateAIContent}
                      disabled={isGeneratingAI}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGeneratingAI ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Brain className="w-4 h-4" />
                      )}
                      <span>AI Generate</span>
                    </button>
                    <button
                      onClick={generateGlobalTargeting}
                      disabled={isGeneratingAI}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Globe className="w-4 h-4" />
                      <span>Global Strategy</span>
                    </button>
                    <button
                      onClick={generatePerformancePrediction}
                      disabled={isGeneratingAI}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <TrendingUp className="w-4 h-4" />
                      <span>Predict Performance</span>
                    </button>
                    <button
                      onClick={() => setShowAdOptimization(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                    >
                      <Zap className="w-4 h-4" />
                      <span>Optimize Existing Ads</span>
                    </button>
                  </div>
                </div>
                <p className="text-white/70">
                  Upload your ad creative materials or use AI to generate
                  optimized content
                </p>
              </div>

              {/* AI Suggestions Display */}
              {aiSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-6 mb-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-5 h-5 text-purple-400" />
                      <h4 className="text-lg font-semibold text-white">
                        AI Suggestions
                      </h4>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-purple-300">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span>AI Powered</span>
                    </div>
                  </div>

                  {aiSuggestions.headline && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-purple-300 text-sm font-medium">
                          Generated Headline:
                        </label>
                        <p className="text-white text-lg font-semibold">
                          {aiSuggestions.headline}
                        </p>
                      </div>
                      <div>
                        <label className="text-purple-300 text-sm font-medium">
                          Generated Description:
                        </label>
                        <p className="text-white">
                          {aiSuggestions.primaryText}
                        </p>
                      </div>
                      <div>
                        <label className="text-purple-300 text-sm font-medium">
                          Call to Action:
                        </label>
                        <p className="text-white font-medium">
                          {aiSuggestions.callToAction}
                        </p>
                      </div>

                      {aiSuggestions.keywords &&
                        aiSuggestions.keywords.length > 0 && (
                          <div>
                            <label className="text-purple-300 text-sm font-medium">
                              Keywords:
                            </label>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {aiSuggestions.keywords.map(
                                (keyword: string, index: number) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-purple-500/30 text-purple-200 rounded-full text-sm"
                                  >
                                    {keyword}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        )}

                      {aiSuggestions.performanceScore && (
                        <div className="flex items-center space-x-4">
                          <div>
                            <label className="text-purple-300 text-sm font-medium">
                              Performance Score:
                            </label>
                            <p className="text-white font-bold text-xl">
                              {aiSuggestions.performanceScore}/100
                            </p>
                          </div>
                          {aiSuggestions.estimatedCTR && (
                            <div>
                              <label className="text-purple-300 text-sm font-medium">
                                Estimated CTR:
                              </label>
                              <p className="text-white font-bold">
                                {aiSuggestions.estimatedCTR}%
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {aiSuggestions.globalTargeting && (
                    <div className="mt-4 p-4 bg-blue-500/20 rounded-lg">
                      <h5 className="text-blue-300 font-medium mb-2">
                        Global Targeting Strategy
                      </h5>
                      <p className="text-white text-sm">
                        {aiSuggestions.globalTargeting.globalStrategy?.primaryMarkets?.join(
                          ", "
                        )}{" "}
                        markets recommended
                      </p>
                    </div>
                  )}

                  {aiSuggestions.performancePrediction && (
                    <div className="mt-4 p-4 bg-green-500/20 rounded-lg">
                      <h5 className="text-green-300 font-medium mb-2">
                        Performance Prediction
                      </h5>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-green-300">
                            Estimated Reach:
                          </span>
                          <span className="text-white ml-2">
                            {aiSuggestions.performancePrediction.estimatedReach?.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-green-300">Estimated CPC:</span>
                          <span className="text-white ml-2">
                            ${aiSuggestions.performancePrediction.estimatedCPC}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Headline
                    </label>
                    <input
                      type="text"
                      value={campaignData.creative.headline}
                      onChange={(e) =>
                        setCampaignData((prev) => ({
                          ...prev,
                          creative: {
                            ...prev.creative,
                            headline: e.target.value,
                          },
                        }))
                      }
                      placeholder="Enter your ad headline..."
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">
                      Description
                    </label>
                    <textarea
                      value={campaignData.creative.description}
                      onChange={(e) =>
                        setCampaignData((prev) => ({
                          ...prev,
                          creative: {
                            ...prev.creative,
                            description: e.target.value,
                          },
                        }))
                      }
                      placeholder="Enter your ad description..."
                      rows={4}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">
                      Call to Action
                    </label>
                    <select
                      value={campaignData.creative.callToAction}
                      onChange={(e) =>
                        setCampaignData((prev) => ({
                          ...prev,
                          creative: {
                            ...prev.creative,
                            callToAction: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select CTA</option>
                      <option value="Learn More">Learn More</option>
                      <option value="Get Started">Get Started</option>
                      <option value="Sign Up">Sign Up</option>
                      <option value="Try Free">Try Free</option>
                      <option value="Shop Now">Shop Now</option>
                      <option value="Download">Download</option>
                      <option value="Contact Us">Contact Us</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">
                      Website URL
                    </label>
                    <input
                      type="url"
                      value={campaignData.creative.websiteUrl}
                      onChange={(e) =>
                        setCampaignData((prev) => ({
                          ...prev,
                          creative: {
                            ...prev.creative,
                            websiteUrl: e.target.value,
                          },
                        }))
                      }
                      placeholder="https://yourwebsite.com"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Images section removed - focus on analysis only */}

                  {/* Videos section removed - focus on analysis only */}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 6: Schedule & Settings */}
          {currentStep === 6 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Schedule & Settings
                </h3>
                <p className="text-white/70">
                  Configure when and how your campaign runs
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-white font-semibold mb-4">Schedule</h4>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-white font-medium mb-2">
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={campaignData.schedule.startDate}
                          onChange={(e) =>
                            setCampaignData((prev) => ({
                              ...prev,
                              schedule: {
                                ...prev.schedule,
                                startDate: e.target.value,
                              },
                            }))
                          }
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-white font-medium mb-2">
                          End Date
                        </label>
                        <input
                          type="date"
                          value={campaignData.schedule.endDate}
                          onChange={(e) =>
                            setCampaignData((prev) => ({
                              ...prev,
                              schedule: {
                                ...prev.schedule,
                                endDate: e.target.value,
                              },
                            }))
                          }
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-white font-medium mb-2">
                          Timezone
                        </label>
                        <select
                          value={campaignData.schedule.timezone}
                          onChange={(e) =>
                            setCampaignData((prev) => ({
                              ...prev,
                              schedule: {
                                ...prev.schedule,
                                timezone: e.target.value,
                              },
                            }))
                          }
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="UTC">UTC</option>
                          <option value="EST">Eastern Time</option>
                          <option value="PST">Pacific Time</option>
                          <option value="GMT">Greenwich Mean Time</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-white font-semibold mb-4">
                      Bidding & Optimization
                    </h4>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-white font-medium mb-2">
                          Bid Strategy
                        </label>
                        <select
                          value={campaignData.settings.bidStrategy}
                          onChange={(e) =>
                            setCampaignData((prev) => ({
                              ...prev,
                              settings: {
                                ...prev.settings,
                                bidStrategy: e.target.value,
                              },
                            }))
                          }
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {bidStrategies.map((strategy) => (
                            <option key={strategy.id} value={strategy.id}>
                              {strategy.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-white font-medium mb-2">
                          Optimization Goal
                        </label>
                        <select
                          value={campaignData.settings.optimization}
                          onChange={(e) =>
                            setCampaignData((prev) => ({
                              ...prev,
                              settings: {
                                ...prev.settings,
                                optimization: e.target.value,
                              },
                            }))
                          }
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="conversions">Conversions</option>
                          <option value="clicks">Clicks</option>
                          <option value="impressions">Impressions</option>
                          <option value="reach">Reach</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-white font-medium mb-2">
                          Delivery
                        </label>
                        <select
                          value={campaignData.settings.delivery}
                          onChange={(e) =>
                            setCampaignData((prev) => ({
                              ...prev,
                              settings: {
                                ...prev.settings,
                                delivery: e.target.value,
                              },
                            }))
                          }
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="standard">Standard</option>
                          <option value="accelerated">Accelerated</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/20">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center space-x-2">
              {Array.from({ length: 6 }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i + 1 <= currentStep ? "bg-blue-500" : "bg-white/20"
                  }`}
                />
              ))}
            </div>

            {currentStep < 6 ? (
              <button
                onClick={handleNext}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleCreateCampaign}
                disabled={isCreating}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Analyze Campaign</span>
                  </>
                )}
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Existing Ads Selector Modal */}
      <ExistingAdsSelector
        isOpen={showExistingAdsSelector}
        onClose={() => setShowExistingAdsSelector(false)}
        onAdSelected={handleExistingAdSelected}
        platform="all"
      />

      {/* Ad Optimization Modal */}
      <AdOptimizationModal
        isOpen={showAdOptimization}
        onClose={() => setShowAdOptimization(false)}
        onOptimizationComplete={(results) => {
          console.log("Ad optimization completed:", results);
          // You can integrate the optimization results into the campaign
        }}
      />
    </AnimatePresence>
  );
}
