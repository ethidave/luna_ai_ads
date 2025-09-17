"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer,
  Target,
  DollarSign,
  Users,
  Calendar,
  Clock,
  Download,
  Filter,
  RefreshCw,
  Activity,
  PieChart,
  LineChart,
  Zap,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Facebook,
  Search,
  Play,
  Pause,
  Edit,
  Settings,
  Brain,
  Sparkles,
  Lightbulb,
  Award,
  TrendingUp as TrendingUpIcon,
  AlertCircle,
  CheckCircle,
  Target as TargetIcon,
  BarChart,
  Line,
  Area,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  ComposedChart,
} from "lucide-react";

interface EnhancedAnalyticsSectionProps {
  analyticsData?: any[];
  performanceMetrics?: any;
  trendData?: any[];
  campaigns?: any[];
  onAnalyzeCampaign?: (campaignId: string) => void;
  onGenerateTags?: (campaignId: string) => void;
  onOptimizeCampaign?: (campaignId: string) => void;
}

export default function EnhancedAnalyticsSection({
  analyticsData = [],
  performanceMetrics = {},
  trendData = [],
  campaigns = [],
  onAnalyzeCampaign,
  onGenerateTags,
  onOptimizeCampaign,
}: EnhancedAnalyticsSectionProps) {
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [tagSuggestions, setTagSuggestions] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);

  // Mock data for demonstration
  const mockAnalyticsData = [
    {
      date: "2024-01-01",
      impressions: 12000,
      clicks: 240,
      conversions: 12,
      spend: 120,
    },
    {
      date: "2024-01-02",
      impressions: 15000,
      clicks: 300,
      conversions: 18,
      spend: 150,
    },
    {
      date: "2024-01-03",
      impressions: 18000,
      clicks: 360,
      conversions: 24,
      spend: 180,
    },
    {
      date: "2024-01-04",
      impressions: 16000,
      clicks: 320,
      conversions: 20,
      spend: 160,
    },
    {
      date: "2024-01-05",
      impressions: 20000,
      clicks: 400,
      conversions: 30,
      spend: 200,
    },
  ];

  const mockPerformanceMetrics = {
    totalImpressions: 81000,
    totalClicks: 1620,
    totalConversions: 104,
    totalSpend: 810,
    averageCTR: 2.0,
    averageCPC: 0.5,
    averageROAS: 3.2,
    conversionRate: 6.4,
  };

  const handleAnalyzeCampaign = async (campaign: any) => {
    if (!onAnalyzeCampaign) return;

    setIsAnalyzing(true);
    try {
      const response = await fetch(
        `/api/ai/analyze-campaign?campaignId=${campaign.id}`
      );
      const data = await response.json();

      if (data.success) {
        setAnalysisResults(data.analysis);
        setSelectedCampaign(campaign);
      }
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateTags = async (campaign: any) => {
    if (!onGenerateTags) return;

    setIsGeneratingTags(true);
    try {
      const response = await fetch("/api/ai/generate-targeting-tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: campaign.name,
          industry: "Technology",
          targetAudience: "Business Owners",
          platform: "facebook",
          objective: "conversions",
        }),
      });
      const data = await response.json();

      if (data.success) {
        setTagSuggestions(data.tags);
        setSelectedCampaign(campaign);
      }
    } catch (error) {
      console.error("Tag generation failed:", error);
    } finally {
      setIsGeneratingTags(false);
    }
  };

  const data = analyticsData.length > 0 ? analyticsData : mockAnalyticsData;
  const metrics =
    Object.keys(performanceMetrics).length > 0
      ? performanceMetrics
      : mockPerformanceMetrics;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">
            Enhanced Ad Analytics
          </h2>
          <p className="text-white/70 mt-2">
            AI-powered insights and optimization for your advertising campaigns
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <RefreshCw className="w-4 h-4 mr-2 inline" />
            Refresh Data
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <Download className="w-4 h-4 mr-2 inline" />
            Export Report
          </button>
        </div>
      </div>

      {/* Performance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Total Impressions",
            value: metrics.totalImpressions?.toLocaleString() || "0",
            change: "+12.5%",
            trend: "up",
            icon: Eye,
            color: "blue",
          },
          {
            title: "Total Clicks",
            value: metrics.totalClicks?.toLocaleString() || "0",
            change: "+8.3%",
            trend: "up",
            icon: MousePointer,
            color: "green",
          },
          {
            title: "Conversions",
            value: metrics.totalConversions?.toLocaleString() || "0",
            change: "+15.2%",
            trend: "up",
            icon: Target,
            color: "purple",
          },
          {
            title: "Total Spend",
            value: `$${metrics.totalSpend?.toLocaleString() || "0"}`,
            change: "+5.1%",
            trend: "up",
            icon: DollarSign,
            color: "orange",
          },
        ].map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-${metric.color}-500/20`}>
                <metric.icon className={`w-6 h-6 text-${metric.color}-400`} />
              </div>
              <div className="flex items-center space-x-1">
                {metric.trend === "up" ? (
                  <ArrowUpRight className="w-4 h-4 text-green-400" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-400" />
                )}
                <span
                  className={`text-sm font-medium ${
                    metric.trend === "up" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {metric.change}
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{metric.value}</h3>
              <p className="text-white/70 text-sm">{metric.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI-Powered Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Campaign Analysis */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center">
              <Brain className="w-5 h-5 mr-2 text-purple-400" />
              AI Campaign Analysis
            </h3>
            <button className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors">
              <Sparkles className="w-4 h-4 mr-1 inline" />
              Analyze All
            </button>
          </div>

          <div className="space-y-4">
            {campaigns.slice(0, 3).map((campaign, index) => (
              <motion.div
                key={campaign.id || `campaign-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700/30"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <TargetIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{campaign.name}</h4>
                    <p className="text-sm text-white/70">
                      {campaign.platforms || "Facebook, Google"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleAnalyzeCampaign(campaign)}
                    disabled={isAnalyzing}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isAnalyzing ? "Analyzing..." : "Analyze"}
                  </button>
                  <button
                    onClick={() => handleGenerateTags(campaign)}
                    disabled={isGeneratingTags}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {isGeneratingTags ? "Generating..." : "Tags"}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white flex items-center mb-6">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
            Key Performance Metrics
          </h3>

          <div className="space-y-4">
            {[
              {
                label: "Click-Through Rate",
                value: `${metrics.averageCTR}%`,
                target: "2.0%",
                status: "good",
              },
              {
                label: "Cost Per Click",
                value: `$${metrics.averageCPC}`,
                target: "$0.50",
                status: "good",
              },
              {
                label: "Return on Ad Spend",
                value: `${metrics.averageROAS}x`,
                target: "3.0x",
                status: "excellent",
              },
              {
                label: "Conversion Rate",
                value: `${metrics.conversionRate}%`,
                target: "5.0%",
                status: "good",
              },
            ].map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      metric.status === "excellent"
                        ? "bg-green-400"
                        : metric.status === "good"
                        ? "bg-blue-400"
                        : "bg-yellow-400"
                    }`}
                  />
                  <span className="text-white/90">{metric.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium">{metric.value}</span>
                  <span className="text-white/50 text-sm">
                    / {metric.target}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Analysis Results Modal */}
      {analysisResults && selectedCampaign && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">
                Analysis Results: {selectedCampaign.name}
              </h3>
              <button
                onClick={() => setAnalysisResults(null)}
                className="text-white/70 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">
                  Strengths
                </h4>
                <div className="space-y-2">
                  {analysisResults.strengths?.map(
                    (strength: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 text-green-400"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>{strength}</span>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mb-4">
                  Recommendations
                </h4>
                <div className="space-y-2">
                  {analysisResults.recommendations
                    ?.slice(0, 3)
                    .map((rec: any, index: number) => (
                      <div
                        key={index}
                        className="p-3 bg-blue-600/20 rounded-lg border border-blue-600/30"
                      >
                        <h5 className="font-medium text-white">{rec.title}</h5>
                        <p className="text-sm text-white/70">
                          {rec.description}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Tag Suggestions Modal */}
      {tagSuggestions && selectedCampaign && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">
                Tag Suggestions: {selectedCampaign.name}
              </h3>
              <button
                onClick={() => setTagSuggestions(null)}
                className="text-white/70 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">
                  Facebook Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {tagSuggestions.facebookTags?.map(
                    (tag: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mb-4">
                  Google Ads Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {tagSuggestions.googleTags?.map(
                    (tag: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
