"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Brain,
  Sparkles,
  Clock,
  Hash,
  Lightbulb,
  Target,
  Users,
  Eye,
  Heart,
  MessageCircle,
  Share,
  RefreshCw,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Zap,
  Activity,
  PieChart,
  LineChart,
} from "lucide-react";

interface AIInsight {
  type: "trend" | "anomaly" | "recommendation" | "prediction";
  title: string;
  description: string;
  confidence: number;
  impact: "high" | "medium" | "low";
  actionable: boolean;
  action?: string;
  priority: number;
}

interface TrendAnalysis {
  trendingTopics: string[];
  hashtags: string[];
  contentTypes: string[];
  predictions: string[];
}

export default function AIAnalyticsPage() {
  const [loading, setLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("instagram");
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [trends, setTrends] = useState<TrendAnalysis | null>(null);
  const [contentIdeas, setContentIdeas] = useState<string[]>([]);
  const [optimalTimes, setOptimalTimes] = useState<string[]>([]);
  const [analysisReasoning, setAnalysisReasoning] = useState<string>("");

  const analyzeEngagement = async () => {
    if (!selectedAccount) return;

    setLoading(true);
    try {
      const response = await fetch("/api/ai/analyze-engagement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountId: selectedAccount,
          platform: selectedPlatform,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setInsights(
          data.analysis.insights.map((insight: string, index: number) => ({
            type: "recommendation" as const,
            title: `Insight ${index + 1}`,
            description: insight,
            confidence: 85,
            impact: "high" as const,
            actionable: true,
            priority: index + 1,
          }))
        );
      }
    } catch (error) {
      console.error("Error analyzing engagement:", error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeTrends = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/ai/trends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: selectedPlatform,
          industry: "technology",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setTrends(data.trends);
      }
    } catch (error) {
      console.error("Error analyzing trends:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateContentIdeas = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/ai/content-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: "AI and Technology",
          platform: selectedPlatform,
          count: 5,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setContentIdeas(data.ideas);
      }
    } catch (error) {
      console.error("Error generating content ideas:", error);
    } finally {
      setLoading(false);
    }
  };

  const getOptimalPostTimes = async () => {
    if (!selectedAccount) return;

    setLoading(true);
    try {
      const response = await fetch("/api/ai/optimal-post-time", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountId: selectedAccount,
          platform: selectedPlatform,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setOptimalTimes(data.optimalTimes);
        setAnalysisReasoning(data.reasoning);
      }
    } catch (error) {
      console.error("Error getting optimal post times:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            AI Analytics & Insights
          </h1>
          <p className="text-white/70">
            Powered by Gemini AI for advanced social media analysis
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="youtube">YouTube</option>
            <option value="twitter">Twitter</option>
          </select>
          <button
            onClick={() => {
              analyzeEngagement();
              analyzeTrends();
              generateContentIdeas();
              getOptimalPostTimes();
            }}
            disabled={loading}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Brain className="w-4 h-4" />
            )}
            <span>{loading ? "Analyzing..." : "Run AI Analysis"}</span>
          </button>
        </div>
      </div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
      >
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
          <Brain className="w-5 h-5 text-purple-400" />
          <span>AI Insights & Recommendations</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {insights.map((insight, index) => (
            <div
              key={index}
              className="p-4 bg-white/5 rounded-lg border border-white/10"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      insight.impact === "high"
                        ? "bg-red-400"
                        : insight.impact === "medium"
                        ? "bg-yellow-400"
                        : "bg-green-400"
                    }`}
                  />
                  <span className="text-white font-medium text-sm">
                    {insight.title}
                  </span>
                </div>
                <div className="text-xs text-white/70">
                  {insight.confidence}% confidence
                </div>
              </div>
              <p className="text-white/80 text-sm mb-3">
                {insight.description}
              </p>
              {insight.actionable && insight.action && (
                <div className="text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded">
                  💡 {insight.action}
                </div>
              )}
            </div>
          ))}
          {insights.length === 0 && (
            <div className="col-span-full text-center py-8">
              <Brain className="w-12 h-12 text-white/30 mx-auto mb-4" />
              <p className="text-white/70">Run AI analysis to get insights</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Trends Analysis */}
      {trends && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
        >
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span>Trending Topics & Hashtags</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-medium mb-3">Trending Topics</h4>
              <div className="space-y-2">
                {trends.trendingTopics.map((topic, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <span className="text-white/80 text-sm">{topic}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-white font-medium mb-3">Popular Hashtags</h4>
              <div className="flex flex-wrap gap-2">
                {trends.hashtags.map((hashtag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-sm"
                  >
                    {hashtag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Content Ideas */}
      {contentIdeas.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
        >
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            <span>AI-Generated Content Ideas</span>
          </h3>
          <div className="space-y-3">
            {contentIdeas.map((idea, index) => (
              <div
                key={index}
                className="p-4 bg-white/5 rounded-lg border border-white/10 flex items-start space-x-3"
              >
                <div className="w-6 h-6 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-yellow-400 text-sm font-medium">
                    {index + 1}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium">{idea}</p>
                  <p className="text-white/70 text-sm mt-1">
                    AI-generated for {selectedPlatform}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Optimal Post Times */}
      {optimalTimes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
        >
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <span>Optimal Posting Times</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {optimalTimes.map((time, index) => (
              <div
                key={index}
                className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-center"
              >
                <div className="text-2xl font-bold text-blue-400 mb-1">
                  {time}
                </div>
                <div className="text-white/70 text-sm">
                  Peak engagement time
                </div>
              </div>
            ))}
          </div>
          {analysisReasoning && (
            <div className="p-4 bg-white/5 rounded-lg">
              <h4 className="text-white font-medium mb-2">
                AI Analysis Reasoning:
              </h4>
              <p className="text-white/80 text-sm">{analysisReasoning}</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

