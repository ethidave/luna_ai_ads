"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Copy,
  RefreshCw,
  Download,
  Tag,
  Hash,
  Smile,
  Target,
  TrendingUp,
  Zap,
  CheckCircle,
  ArrowRight,
  Brain,
  Globe,
  BarChart3,
  Star,
  Award,
  Rocket,
  Lightbulb,
  Wand2,
} from "lucide-react";

interface AIContentGeneratorProps {
  onContentGenerated?: (content: any) => void;
  initialData?: {
    productName?: string;
    platform?: string;
    objective?: string;
    industry?: string;
  };
}

export default function AIContentGenerator({
  onContentGenerated,
  initialData,
}: AIContentGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [formData, setFormData] = useState({
    productName: initialData?.productName || "",
    platform: initialData?.platform || "google",
    objective: initialData?.objective || "awareness",
    industry: initialData?.industry || "Technology",
    targetAudience: "",
    tone: "professional",
    budget: 1000,
  });

  const platforms = [
    { value: "google", label: "Google Ads", icon: "🔍" },
    { value: "facebook", label: "Facebook", icon: "👥" },
    { value: "instagram", label: "Instagram", icon: "📸" },
    { value: "youtube", label: "YouTube", icon: "📺" },
    { value: "linkedin", label: "LinkedIn", icon: "💼" },
    { value: "tiktok", label: "TikTok", icon: "🎵" },
    { value: "twitter", label: "Twitter", icon: "🐦" },
  ];

  const objectives = [
    { value: "awareness", label: "Brand Awareness", icon: "🎯" },
    { value: "traffic", label: "Drive Traffic", icon: "🌐" },
    { value: "conversions", label: "Conversions", icon: "💰" },
    { value: "engagement", label: "Engagement", icon: "❤️" },
    { value: "leads", label: "Lead Generation", icon: "📋" },
    { value: "sales", label: "Sales", icon: "🛒" },
  ];

  const industries = [
    "Technology",
    "Fashion",
    "Health",
    "Finance",
    "Education",
    "Food",
    "Travel",
    "Beauty",
    "Automotive",
    "Real Estate",
  ];

  const tones = [
    "professional",
    "casual",
    "funny",
    "urgent",
    "inspirational",
    "emotional",
    "authoritative",
  ];

  const generateContent = async () => {
    if (!formData.productName) {
      alert("Please enter a product name");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/ai/generate-tags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        setGeneratedContent(result.data);
        if (onContentGenerated) {
          onContentGenerated(result.data);
        }
      } else {
        console.error("Failed to generate content");
      }
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadContent = () => {
    if (!generatedContent) return;

    const content = `
AI Generated Content for ${formData.productName}

HEADLINE: ${generatedContent.headline}
DESCRIPTION: ${generatedContent.description}
CALL TO ACTION: ${generatedContent.callToAction}

TAGLINE: ${generatedContent.tagline}
VALUE PROPOSITION: ${generatedContent.valueProposition}
URGENCY: ${generatedContent.urgency}
SOCIAL PROOF: ${generatedContent.socialProof}

KEYWORDS: ${generatedContent.keywords.join(", ")}
HASHTAGS: ${generatedContent.hashtags.join(" ")}
EMOJIS: ${generatedContent.emojis.join(" ")}

BENEFITS:
${generatedContent.benefits.map((benefit: string) => `• ${benefit}`).join("\n")}

SUGGESTIONS:
${generatedContent.suggestions
  .map((suggestion: string) => `• ${suggestion}`)
  .join("\n")}

PERFORMANCE METRICS:
• Performance Score: ${generatedContent.performanceScore}/100
• Estimated CTR: ${generatedContent.estimatedCTR}%
• Estimated CPC: $${generatedContent.estimatedCPC}

Generated on: ${new Date().toLocaleString()}
    `;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${formData.productName}-ai-content.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">
              AI Content Generator
            </h2>
            <p className="text-white/70">
              Generate high-quality tags, headlines, and content
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div>
            <label className="block text-white font-medium mb-2">
              Product/Service Name *
            </label>
            <input
              type="text"
              value={formData.productName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  productName: e.target.value,
                }))
              }
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your product or service name"
            />
          </div>

          {/* Platform */}
          <div>
            <label className="block text-white font-medium mb-2">
              Platform
            </label>
            <select
              value={formData.platform}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, platform: e.target.value }))
              }
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {platforms.map((platform) => (
                <option
                  key={platform.value}
                  value={platform.value}
                  className="bg-gray-800"
                >
                  {platform.icon} {platform.label}
                </option>
              ))}
            </select>
          </div>

          {/* Objective */}
          <div>
            <label className="block text-white font-medium mb-2">
              Campaign Objective
            </label>
            <select
              value={formData.objective}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, objective: e.target.value }))
              }
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {objectives.map((objective) => (
                <option
                  key={objective.value}
                  value={objective.value}
                  className="bg-gray-800"
                >
                  {objective.icon} {objective.label}
                </option>
              ))}
            </select>
          </div>

          {/* Industry */}
          <div>
            <label className="block text-white font-medium mb-2">
              Industry
            </label>
            <select
              value={formData.industry}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, industry: e.target.value }))
              }
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {industries.map((industry) => (
                <option key={industry} value={industry} className="bg-gray-800">
                  {industry}
                </option>
              ))}
            </select>
          </div>

          {/* Target Audience */}
          <div>
            <label className="block text-white font-medium mb-2">
              Target Audience
            </label>
            <input
              type="text"
              value={formData.targetAudience}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  targetAudience: e.target.value,
                }))
              }
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="e.g., Young professionals, 25-35"
            />
          </div>

          {/* Tone */}
          <div>
            <label className="block text-white font-medium mb-2">Tone</label>
            <select
              value={formData.tone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, tone: e.target.value }))
              }
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {tones.map((tone) => (
                <option
                  key={tone}
                  value={tone}
                  className="bg-gray-800 capitalize"
                >
                  {tone}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <div className="mt-8 text-center">
          <button
            onClick={generateContent}
            disabled={isGenerating || !formData.productName}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 mx-auto"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Generating AI Content...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                <span>Generate AI Content</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Content */}
      <AnimatePresence>
        {generatedContent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Main Content */}
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white flex items-center space-x-3">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                  <span>Generated Content</span>
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={downloadContent}
                    className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-colors flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={() => setGeneratedContent(null)}
                    className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Main Content */}
                <div className="space-y-6">
                  {/* Headline */}
                  <div>
                    <label className="text-purple-300 text-sm font-medium mb-2 flex items-center space-x-2">
                      <Target className="w-4 h-4" />
                      <span>Headline</span>
                    </label>
                    <div className="p-4 bg-white/10 rounded-xl">
                      <p className="text-white text-lg font-semibold">
                        {generatedContent.headline}
                      </p>
                      <button
                        onClick={() =>
                          copyToClipboard(generatedContent.headline)
                        }
                        className="mt-2 text-purple-300 hover:text-purple-200 text-sm flex items-center space-x-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-purple-300 text-sm font-medium mb-2 flex items-center space-x-2">
                      <BarChart3 className="w-4 h-4" />
                      <span>Description</span>
                    </label>
                    <div className="p-4 bg-white/10 rounded-xl">
                      <p className="text-white">
                        {generatedContent.description}
                      </p>
                      <button
                        onClick={() =>
                          copyToClipboard(generatedContent.description)
                        }
                        className="mt-2 text-purple-300 hover:text-purple-200 text-sm flex items-center space-x-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </button>
                    </div>
                  </div>

                  {/* Call to Action */}
                  <div>
                    <label className="text-purple-300 text-sm font-medium mb-2 flex items-center space-x-2">
                      <ArrowRight className="w-4 h-4" />
                      <span>Call to Action</span>
                    </label>
                    <div className="p-4 bg-white/10 rounded-xl">
                      <p className="text-white font-medium">
                        {generatedContent.callToAction}
                      </p>
                      <button
                        onClick={() =>
                          copyToClipboard(generatedContent.callToAction)
                        }
                        className="mt-2 text-purple-300 hover:text-purple-200 text-sm flex items-center space-x-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Column - Tags and Metrics */}
                <div className="space-y-6">
                  {/* Keywords */}
                  <div>
                    <label className="text-purple-300 text-sm font-medium mb-2 flex items-center space-x-2">
                      <Tag className="w-4 h-4" />
                      <span>Keywords</span>
                    </label>
                    <div className="p-4 bg-white/10 rounded-xl">
                      <div className="flex flex-wrap gap-2">
                        {generatedContent.keywords
                          ?.slice(0, 10)
                          .map((keyword: string, index: number) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-purple-500/30 text-purple-200 rounded-full text-sm"
                            >
                              {keyword}
                            </span>
                          ))}
                      </div>
                      <button
                        onClick={() =>
                          copyToClipboard(generatedContent.keywords.join(", "))
                        }
                        className="mt-2 text-purple-300 hover:text-purple-200 text-sm flex items-center space-x-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy All</span>
                      </button>
                    </div>
                  </div>

                  {/* Hashtags */}
                  <div>
                    <label className="text-purple-300 text-sm font-medium mb-2 flex items-center space-x-2">
                      <Hash className="w-4 h-4" />
                      <span>Hashtags</span>
                    </label>
                    <div className="p-4 bg-white/10 rounded-xl">
                      <div className="flex flex-wrap gap-2">
                        {generatedContent.hashtags
                          ?.slice(0, 8)
                          .map((hashtag: string, index: number) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-500/30 text-blue-200 rounded-full text-sm"
                            >
                              {hashtag}
                            </span>
                          ))}
                      </div>
                      <button
                        onClick={() =>
                          copyToClipboard(generatedContent.hashtags.join(" "))
                        }
                        className="mt-2 text-purple-300 hover:text-purple-200 text-sm flex items-center space-x-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy All</span>
                      </button>
                    </div>
                  </div>

                  {/* Emojis */}
                  <div>
                    <label className="text-purple-300 text-sm font-medium mb-2 flex items-center space-x-2">
                      <Smile className="w-4 h-4" />
                      <span>Emojis</span>
                    </label>
                    <div className="p-4 bg-white/10 rounded-xl">
                      <div className="flex flex-wrap gap-2">
                        {generatedContent.emojis?.map(
                          (emoji: string, index: number) => (
                            <span
                              key={index}
                              className="text-2xl cursor-pointer hover:scale-110 transition-transform"
                              onClick={() => copyToClipboard(emoji)}
                            >
                              {emoji}
                            </span>
                          )
                        )}
                      </div>
                      <button
                        onClick={() =>
                          copyToClipboard(generatedContent.emojis.join(" "))
                        }
                        className="mt-2 text-purple-300 hover:text-purple-200 text-sm flex items-center space-x-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy All</span>
                      </button>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div>
                    <label className="text-purple-300 text-sm font-medium mb-2 flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4" />
                      <span>Performance Score</span>
                    </label>
                    <div className="p-4 bg-white/10 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-semibold">
                          Overall Score
                        </span>
                        <span className="text-green-400 font-bold text-xl">
                          {generatedContent.performanceScore}/100
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                          style={{
                            width: `${generatedContent.performanceScore}%`,
                          }}
                        ></div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                        <div>
                          <span className="text-gray-400">CTR:</span>
                          <span className="text-white ml-2">
                            {generatedContent.estimatedCTR}%
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">CPC:</span>
                          <span className="text-white ml-2">
                            ${generatedContent.estimatedCPC}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Content */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tagline & Value Prop */}
                <div>
                  <label className="text-purple-300 text-sm font-medium mb-2">
                    Tagline
                  </label>
                  <div className="p-4 bg-white/10 rounded-xl">
                    <p className="text-white italic">
                      "{generatedContent.tagline}"
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-purple-300 text-sm font-medium mb-2">
                    Value Proposition
                  </label>
                  <div className="p-4 bg-white/10 rounded-xl">
                    <p className="text-white">
                      {generatedContent.valueProposition}
                    </p>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="mt-6">
                <label className="text-purple-300 text-sm font-medium mb-2">
                  Key Benefits
                </label>
                <div className="p-4 bg-white/10 rounded-xl">
                  <ul className="space-y-2">
                    {generatedContent.benefits?.map(
                      (benefit: string, index: number) => (
                        <li
                          key={index}
                          className="text-white flex items-center space-x-2"
                        >
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span>{benefit}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
