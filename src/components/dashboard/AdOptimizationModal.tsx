"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Zap,
  Target,
  TrendingUp,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

interface AdOptimizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOptimizationComplete?: (results: any) => void;
}

interface Ad {
  id: string;
  platformAdId: string;
  platform: string;
  accountName: string;
  name: string;
  status: string;
  headline: string;
  description: string;
  callToAction: string;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  roas: number;
  performanceScore: number;
  generatedTags?: string[];
  aiAnalysis?: any;
}

interface OptimizationResult {
  adId: string;
  platform: string;
  name: string;
  optimization: {
    originalAd: any;
    optimizedContent: any;
    targeting: any;
    performance: any;
    suggestions: string[];
    realTimeOptimization: any;
  };
  status: string;
}

export default function AdOptimizationModal({
  isOpen,
  onClose,
  onOptimizationComplete,
}: AdOptimizationModalProps) {
  const [ads, setAds] = useState<Ad[]>([]);
  const [selectedAds, setSelectedAds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResults, setOptimizationResults] = useState<
    OptimizationResult[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"select" | "optimize" | "publish">(
    "select"
  );
  const [publishingAds, setPublishingAds] = useState<string[]>([]);

  // Fetch ads when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchAds();
    }
  }, [isOpen]);

  const fetchAds = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ads/real?refresh=true");
      const data = await response.json();

      if (data.success) {
        setAds(data.ads || []);
      } else {
        setError(data.error || "Failed to fetch ads");
      }
    } catch (err) {
      setError("Failed to fetch ads");
      console.error("Error fetching ads:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdSelection = (adId: string) => {
    setSelectedAds((prev) =>
      prev.includes(adId) ? prev.filter((id) => id !== adId) : [...prev, adId]
    );
  };

  const handleSelectAll = () => {
    if (selectedAds.length === ads.length) {
      setSelectedAds([]);
    } else {
      setSelectedAds(ads.map((ad) => ad.id));
    }
  };

  const handleOptimizeAds = async () => {
    if (selectedAds.length === 0) {
      setError("Please select at least one ad to optimize");
      return;
    }

    setIsOptimizing(true);
    setError(null);

    try {
      const response = await fetch("/api/ads/optimize-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adIds: selectedAds,
          optimizationType: "comprehensive",
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOptimizationResults(data.optimizedAds);
        setActiveTab("optimize");
        onOptimizationComplete?.(data.optimizedAds);
      } else {
        setError(data.error || "Failed to optimize ads");
      }
    } catch (err) {
      setError("Failed to optimize ads");
      console.error("Error optimizing ads:", err);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handlePublishAd = async (adId: string, optimizedContent: any) => {
    setPublishingAds((prev) => [...prev, adId]);

    try {
      const response = await fetch("/api/ads/optimize-ai", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adId,
          optimizedContent,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update the optimization results
        setOptimizationResults((prev) =>
          prev.map((result) =>
            result.adId === adId ? { ...result, status: "published" } : result
          )
        );
      } else {
        setError(data.error || "Failed to publish ad");
      }
    } catch (err) {
      setError("Failed to publish ad");
      console.error("Error publishing ad:", err);
    } finally {
      setPublishingAds((prev) => prev.filter((id) => id !== adId));
    }
  };

  const handlePublishAll = async () => {
    setActiveTab("publish");

    for (const result of optimizationResults) {
      if (result.status !== "published") {
        await handlePublishAd(
          result.adId,
          result.optimization.optimizedContent
        );
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Zap className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold">AI Ad Optimization</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("select")}
            className={`px-6 py-3 font-medium ${
              activeTab === "select"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Select Ads ({selectedAds.length})
          </button>
          <button
            onClick={() => setActiveTab("optimize")}
            className={`px-6 py-3 font-medium ${
              activeTab === "optimize"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            disabled={optimizationResults.length === 0}
          >
            AI Optimization ({optimizationResults.length})
          </button>
          <button
            onClick={() => setActiveTab("publish")}
            className={`px-6 py-3 font-medium ${
              activeTab === "publish"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            disabled={optimizationResults.length === 0}
          >
            Publish Results
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          {/* Select Ads Tab */}
          {activeTab === "select" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Select Ads to Optimize</h3>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleSelectAll}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {selectedAds.length === ads.length
                      ? "Deselect All"
                      : "Select All"}
                  </button>
                  <button
                    onClick={fetchAds}
                    disabled={isLoading}
                    className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800"
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                    />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
                  <span className="ml-2">Loading ads...</span>
                </div>
              ) : ads.length === 0 ? (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">
                    No ads found. Please connect your accounts first.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Connect Accounts
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {ads.map((ad) => (
                    <div
                      key={ad.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedAds.includes(ad.id)
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleAdSelection(ad.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <input
                              type="checkbox"
                              checked={selectedAds.includes(ad.id)}
                              onChange={() => handleAdSelection(ad.id)}
                              className="h-4 w-4 text-blue-600"
                            />
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                ad.platform === "facebook"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {ad.platform.toUpperCase()}
                            </span>
                            <span className="text-sm text-gray-500">
                              {ad.accountName}
                            </span>
                          </div>
                          <h4 className="font-medium text-gray-900 mb-1">
                            {ad.name}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {ad.headline}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>
                              Impressions:{" "}
                              {ad.impressions?.toLocaleString() || 0}
                            </span>
                            <span>CTR: {ad.ctr?.toFixed(2)}%</span>
                            <span>CPC: ${ad.cpc?.toFixed(2) || 0}</span>
                            <span>ROAS: {ad.roas?.toFixed(2) || 0}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            Score: {ad.performanceScore || 0}/100
                          </div>
                          <div
                            className={`text-xs ${
                              ad.status === "active"
                                ? "text-green-600"
                                : "text-gray-500"
                            }`}
                          >
                            {ad.status}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {ads.length > 0 && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleOptimizeAds}
                    disabled={selectedAds.length === 0 || isOptimizing}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isOptimizing ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Zap className="h-4 w-4" />
                    )}
                    <span>
                      {isOptimizing
                        ? "Optimizing..."
                        : `Optimize ${selectedAds.length} Ads`}
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Optimization Results Tab */}
          {activeTab === "optimize" && (
            <div>
              <h3 className="text-lg font-medium mb-4">
                AI Optimization Results
              </h3>
              <div className="space-y-6">
                {optimizationResults.map((result) => (
                  <div key={result.adId} className="border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {result.name}
                        </h4>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            result.platform === "facebook"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {result.platform.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          Improvement: +
                          {result.optimization.performance.improvementPotential}
                          %
                        </div>
                        <div className="text-xs text-gray-500">
                          Score:{" "}
                          {result.optimization.performance.performanceScore}/100
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Original vs Optimized */}
                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">
                          Original Ad
                        </h5>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Headline:</span>
                            <p className="text-gray-600">
                              {result.optimization.originalAd.headline}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium">Description:</span>
                            <p className="text-gray-600">
                              {result.optimization.originalAd.description}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium">CTA:</span>
                            <p className="text-gray-600">
                              {result.optimization.originalAd.callToAction}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">
                          AI Optimized
                        </h5>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Headline:</span>
                            <p className="text-blue-600 font-medium">
                              {result.optimization.optimizedContent.headline}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium">Description:</span>
                            <p className="text-blue-600 font-medium">
                              {result.optimization.optimizedContent.description}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium">CTA:</span>
                            <p className="text-blue-600 font-medium">
                              {
                                result.optimization.optimizedContent
                                  .callToAction
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Keywords and Tags */}
                    <div className="mt-4">
                      <h5 className="font-medium text-gray-900 mb-2">
                        Generated Keywords & Tags
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {result.optimization.targeting.keywords
                          ?.slice(0, 10)
                          .map((keyword: string, index: number) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                            >
                              {keyword}
                            </span>
                          ))}
                      </div>
                    </div>

                    {/* Suggestions */}
                    <div className="mt-4">
                      <h5 className="font-medium text-gray-900 mb-2">
                        AI Suggestions
                      </h5>
                      <ul className="space-y-1 text-sm text-gray-600">
                        {result.optimization.suggestions
                          ?.slice(0, 3)
                          .map((suggestion: string, index: number) => (
                            <li
                              key={index}
                              className="flex items-start space-x-2"
                            >
                              <TrendingUp className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{suggestion}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handlePublishAll}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Publish All Optimizations</span>
                </button>
              </div>
            </div>
          )}

          {/* Publish Results Tab */}
          {activeTab === "publish" && (
            <div>
              <h3 className="text-lg font-medium mb-4">Publishing Status</h3>
              <div className="space-y-3">
                {optimizationResults.map((result) => (
                  <div
                    key={result.adId}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`h-3 w-3 rounded-full ${
                          result.status === "published"
                            ? "bg-green-500"
                            : publishingAds.includes(result.adId)
                            ? "bg-yellow-500"
                            : "bg-gray-300"
                        }`}
                      />
                      <div>
                        <h4 className="font-medium">{result.name}</h4>
                        <p className="text-sm text-gray-500">
                          {result.platform.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {result.status === "published" ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : publishingAds.includes(result.adId) ? (
                        <RefreshCw className="h-4 w-4 animate-spin text-yellow-500" />
                      ) : (
                        <button
                          onClick={() =>
                            handlePublishAd(
                              result.adId,
                              result.optimization.optimizedContent
                            )
                          }
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Publish
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
