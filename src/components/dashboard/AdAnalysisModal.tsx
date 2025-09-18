"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  BarChart3,
  Target,
  TrendingUp,
  Lightbulb,
  Tag,
  Eye,
  MousePointer,
  DollarSign,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Sparkles,
} from "lucide-react";

interface AdAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  ad: Record<string, unknown>;
  onAnalyze?: (adId: string) => void;
  onGenerateTags?: (adId: string) => void;
  onOptimize?: (adId: string) => void;
}

export default function AdAnalysisModal({
  isOpen,
  onClose,
  ad,
  onAnalyze,
  onGenerateTags,
  onOptimize,
}: AdAnalysisModalProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  if (!isOpen || !ad) return null;

  const handleAnalyze = async () => {
    if (!onAnalyze) return;
    setIsAnalyzing(true);
    try {
      await onAnalyze((ad.id || ad.platformAdId) as string);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateTags = async () => {
    if (!onGenerateTags) return;
    setIsGeneratingTags(true);
    try {
      await onGenerateTags((ad.id || ad.platformAdId) as string);
    } finally {
      setIsGeneratingTags(false);
    }
  };

  const handleOptimize = async () => {
    if (!onOptimize) return;
    setIsOptimizing(true);
    try {
      await onOptimize((ad.id || ad.platformAdId) as string);
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  {ad.platform === "facebook" ? (
                    <BarChart3 className="w-6 h-6 text-white" />
                  ) : (
                    <Target className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {ad.name as string}
                  </h2>
                  <p className="text-white/70 capitalize">
                    {ad.platform as string} • {ad.status as string} •{" "}
                    {ad.objective as string}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Performance Metrics */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Performance Metrics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Eye className="w-5 h-5 text-blue-400" />
                    <span className="text-white/70 text-sm">Impressions</span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {(ad.impressions as number)?.toLocaleString() || "0"}
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <MousePointer className="w-5 h-5 text-green-400" />
                    <span className="text-white/70 text-sm">Clicks</span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {(ad.clicks as number)?.toLocaleString() || "0"}
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                    <span className="text-white/70 text-sm">CTR</span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {(ad.ctr as number)
                      ? `${(ad.ctr as number).toFixed(2)}%`
                      : "0%"}
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="w-5 h-5 text-yellow-400" />
                    <span className="text-white/70 text-sm">Spend</span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    ${(ad.spent as number)?.toFixed(2) || "0"}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Analysis */}
            {(ad.performanceScore as number) && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  AI Analysis
                </h3>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-yellow-400" />
                      <span className="text-white font-medium">
                        Performance Score
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-white">
                      {ad.performanceScore as number}/100
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3 mb-4">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${
                        (ad.performanceScore as number) >= 80
                          ? "bg-green-500"
                          : (ad.performanceScore as number) >= 60
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${ad.performanceScore as number}%` }}
                    />
                  </div>
                  <div className="text-white/70 text-sm">
                    {(ad.performanceScore as number) >= 80
                      ? "Excellent performance! Your ad is performing very well."
                      : (ad.performanceScore as number) >= 60
                      ? "Good performance with room for improvement."
                      : "Performance needs improvement. Consider optimization."}
                  </div>
                </div>
              </div>
            )}

            {/* Generated Tags */}
            {(ad.generatedTags as string[]) && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Generated Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(ad.generatedTags as string[]).map(
                    (tag: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30"
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Optimization Suggestions */}
            {(ad.optimizationSuggestions as string[]) &&
              (ad.optimizationSuggestions as string[]).length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Optimization Suggestions
                  </h3>
                  <div className="space-y-3">
                    {(ad.optimizationSuggestions as string[]).map(
                      (suggestion: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-start space-x-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg"
                        >
                          <Lightbulb className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                          <p className="text-white/90 text-sm">{suggestion}</p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* Action Buttons */}
            <div className="flex items-center space-x-4 pt-6 border-t border-white/10">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="flex-1 px-4 py-3 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isAnalyzing ? (
                  <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <BarChart3 className="w-4 h-4" />
                )}
                <span>{isAnalyzing ? "Analyzing..." : "Analyze Ad"}</span>
              </button>
              <button
                onClick={handleGenerateTags}
                disabled={isGeneratingTags}
                className="flex-1 px-4 py-3 bg-purple-600/20 text-purple-400 rounded-lg hover:bg-purple-600/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isGeneratingTags ? (
                  <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Tag className="w-4 h-4" />
                )}
                <span>
                  {isGeneratingTags ? "Generating..." : "Generate Tags"}
                </span>
              </button>
              <button
                onClick={handleOptimize}
                disabled={isOptimizing}
                className="flex-1 px-4 py-3 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isOptimizing ? (
                  <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>{isOptimizing ? "Optimizing..." : "Optimize Ad"}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
