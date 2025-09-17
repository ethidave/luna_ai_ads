"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Search,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  Brain,
  Sparkles,
  Lightbulb,
  Target,
  Users,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  X,
  Upload,
  Image,
  Video,
  Type,
  Palette,
  Zap,
  Award,
  TrendingUp,
  BarChart3,
  Eye,
  MousePointer,
  Star,
} from "lucide-react";

interface AdCreationWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdCreationWizard({
  isOpen,
  onClose,
}: AdCreationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [adObjective, setAdObjective] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [budget, setBudget] = useState("");
  const [adCreative, setAdCreative] = useState({
    headline: "",
    description: "",
    callToAction: "",
    image: null,
  });

  const platforms = [
    {
      id: "google",
      name: "Google Ads",
      icon: Search,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "facebook",
      name: "Facebook Ads",
      icon: Facebook,
      color: "from-blue-600 to-indigo-600",
    },
    {
      id: "instagram",
      name: "Instagram Ads",
      icon: Instagram,
      color: "from-pink-500 to-rose-500",
    },
    {
      id: "youtube",
      name: "YouTube Ads",
      icon: Youtube,
      color: "from-red-500 to-pink-500",
    },
    {
      id: "linkedin",
      name: "LinkedIn Ads",
      icon: Linkedin,
      color: "from-blue-700 to-blue-800",
    },
  ];

  const objectives = [
    {
      id: "awareness",
      name: "Brand Awareness",
      description: "Increase brand recognition and reach",
      icon: Eye,
    },
    {
      id: "traffic",
      name: "Website Traffic",
      description: "Drive visitors to your website",
      icon: Globe,
    },
    {
      id: "leads",
      name: "Lead Generation",
      description: "Capture potential customer information",
      icon: Users,
    },
    {
      id: "sales",
      name: "Sales",
      description: "Drive direct sales and conversions",
      icon: DollarSign,
    },
    {
      id: "engagement",
      name: "Engagement",
      description: "Increase social media engagement",
      icon: MousePointer,
    },
  ];

  const audienceTypes = [
    {
      id: "tech_professionals",
      name: "Tech Professionals",
      description: "Software developers, engineers, IT managers",
      size: "2.5M",
    },
    {
      id: "marketing_managers",
      name: "Marketing Managers",
      description: "Digital marketing professionals and agencies",
      size: "1.8M",
    },
    {
      id: "small_business",
      name: "Small Business Owners",
      description: "Entrepreneurs and small business decision makers",
      size: "3.2M",
    },
    {
      id: "ecommerce",
      name: "E-commerce Brands",
      description: "Online retailers and e-commerce businesses",
      size: "1.5M",
    },
    {
      id: "custom",
      name: "Custom Audience",
      description: "Create your own audience based on specific criteria",
      size: "Custom",
    },
  ];

  const handleWebsiteAnalysis = async () => {
    if (!websiteUrl) return;

    setIsAnalyzing(true);

    // Simulate AI analysis
    setTimeout(() => {
      setAnalysisResult({
        domain: websiteUrl,
        industry: "AI/Marketing Technology",
        keyFeatures: [
          "AI-powered ad optimization",
          "Automated campaign management",
          "Real-time performance analytics",
          "Multi-platform advertising",
          "Smart audience targeting",
        ],
        suggestedKeywords: [
          "AI marketing tools",
          "automated advertising",
          "smart ads platform",
          "digital marketing AI",
          "ad optimization software",
        ],
        targetAudiences: [
          "Marketing professionals",
          "Small business owners",
          "Digital agencies",
          "E-commerce brands",
        ],
        suggestedHeadlines: [
          "Transform Your Ads with AI",
          "Automate Your Advertising Success",
          "Smart Ads, Better Results",
          "AI-Powered Marketing Made Simple",
        ],
        suggestedDescriptions: [
          "Boost your ad performance with AI-powered optimization and automation",
          "Save time and increase ROI with intelligent advertising tools",
          "Get better results from your ads with smart automation and insights",
        ],
        recommendedBudget: "$100-500/day",
        estimatedReach: "50,000-100,000 people",
        predictedCTR: "3.5-5.2%",
        predictedCPC: "$0.80-1.50",
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  const handlePlatformToggle = (platformId) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((id) => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreateAd = () => {
    // Implement ad creation logic
    console.log("Creating ad with:", {
      websiteUrl,
      analysisResult,
      selectedPlatforms,
      adObjective,
      targetAudience,
      budget,
      adCreative,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  AI Ad Creation Wizard
                </h2>
                <p className="text-white/70">
                  Create optimized ads with AI-powered insights
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
                Step {currentStep} of 5
              </span>
              <span className="text-white/70 text-sm">
                {Math.round((currentStep / 5) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Step 1: Website Analysis */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Analyze Your Website
                </h3>
                <p className="text-white/70">
                  Enter your website URL to get AI-powered insights and
                  recommendations
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Website URL
                  </label>
                  <div className="flex space-x-4">
                    <input
                      type="url"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleWebsiteAnalysis}
                      disabled={!websiteUrl || isAnalyzing}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAnalyzing ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Analyzing...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Brain className="w-4 h-4" />
                          <span>Analyze</span>
                        </div>
                      )}
                    </button>
                  </div>
                </div>

                {analysisResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-xl p-6"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                      <h4 className="text-lg font-semibold text-white">
                        Analysis Complete!
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="text-white font-medium mb-2">
                          Industry: {analysisResult.industry}
                        </h5>
                        <h5 className="text-white font-medium mb-2">
                          Key Features:
                        </h5>
                        <ul className="text-white/70 text-sm space-y-1">
                          {analysisResult.keyFeatures.map((feature, index) => (
                            <li
                              key={index}
                              className="flex items-center space-x-2"
                            >
                              <div className="w-1 h-1 bg-white/70 rounded-full" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-white font-medium mb-2">
                          Suggested Keywords:
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.suggestedKeywords.map(
                            (keyword, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-white/10 rounded-full text-white text-sm"
                              >
                                {keyword}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 2: Platform Selection */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Select Advertising Platforms
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
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      selectedPlatforms.includes(platform.id)
                        ? "border-blue-500 bg-blue-500/20"
                        : "border-white/20 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-lg bg-gradient-to-r ${platform.color}`}
                      >
                        <platform.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-white font-medium">
                        {platform.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Ad Objective */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Choose Your Ad Objective
                </h3>
                <p className="text-white/70">
                  What do you want to achieve with your ads?
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {objectives.map((objective) => (
                  <div
                    key={objective.id}
                    onClick={() => setAdObjective(objective.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      adObjective === objective.id
                        ? "border-blue-500 bg-blue-500/20"
                        : "border-white/20 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                        <objective.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">
                          {objective.name}
                        </h4>
                        <p className="text-white/70 text-sm">
                          {objective.description}
                        </p>
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
                  Define Your Target Audience
                </h3>
                <p className="text-white/70">
                  Who do you want to reach with your ads?
                </p>
              </div>

              <div className="space-y-4">
                {audienceTypes.map((audience) => (
                  <div
                    key={audience.id}
                    onClick={() => setTargetAudience(audience.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      targetAudience === audience.id
                        ? "border-blue-500 bg-blue-500/20"
                        : "border-white/20 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">
                          {audience.name}
                        </h4>
                        <p className="text-white/70 text-sm">
                          {audience.description}
                        </p>
                      </div>
                      <span className="text-white/70 text-sm">
                        {audience.size}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 5: Budget & Creative */}
          {currentStep === 5 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Set Budget & Creative
                </h3>
                <p className="text-white/70">
                  Configure your budget and ad creative elements
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Daily Budget
                    </label>
                    <input
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder="100"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">
                      Headline
                    </label>
                    <input
                      type="text"
                      value={adCreative.headline}
                      onChange={(e) =>
                        setAdCreative((prev) => ({
                          ...prev,
                          headline: e.target.value,
                        }))
                      }
                      placeholder="Transform Your Ads with AI"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">
                      Description
                    </label>
                    <textarea
                      value={adCreative.description}
                      onChange={(e) =>
                        setAdCreative((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Boost your ad performance with AI-powered optimization and automation"
                      rows={3}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Call to Action
                    </label>
                    <select
                      value={adCreative.callToAction}
                      onChange={(e) =>
                        setAdCreative((prev) => ({
                          ...prev,
                          callToAction: e.target.value,
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
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">
                      Ad Preview
                    </label>
                    <div className="bg-white/5 border border-white/20 rounded-lg p-4">
                      <div className="space-y-2">
                        <h4 className="text-white font-semibold">
                          {adCreative.headline || "Your Headline"}
                        </h4>
                        <p className="text-white/70 text-sm">
                          {adCreative.description ||
                            "Your description will appear here"}
                        </p>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
                          {adCreative.callToAction || "Call to Action"}
                        </button>
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
              {Array.from({ length: 5 }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i + 1 <= currentStep ? "bg-blue-500" : "bg-white/20"
                  }`}
                />
              ))}
            </div>

            {currentStep < 5 ? (
              <button
                onClick={handleNext}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleCreateAd}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
              >
                <Zap className="w-4 h-4" />
                <span>Create Ads</span>
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

