"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Download,
  Eye,
  Calendar,
  Database,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";

interface ReportData {
  id: string;
  name: string;
  type: "analytics" | "financial" | "user" | "campaign" | "system";
  description: string;
  status: "ready" | "generating" | "failed" | "scheduled";
  size: string;
  downloads: number;
  format: "pdf" | "csv" | "excel" | "json";
  period: string;
  dataPoints: number;
  createdAt: string;
  generatedAt?: string;
  expiresAt?: string;
}

interface ReportCardProps {
  report: ReportData;
  onDownload: (reportId: string) => void;
  onView: (reportId: string) => void;
  onRegenerate: (reportId: string) => void;
}

const typeConfig = {
  analytics: {
    label: "Analytics",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    icon: Database,
  },
  financial: {
    label: "Financial",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
    icon: FileText,
  },
  user: {
    label: "User",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    icon: FileText,
  },
  campaign: {
    label: "Campaign",
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
    icon: FileText,
  },
  system: {
    label: "System",
    color: "text-gray-400",
    bgColor: "bg-gray-500/10",
    borderColor: "border-gray-500/20",
    icon: FileText,
  },
  custom: {
    label: "Custom",
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/20",
    icon: FileText,
  },
};

const statusConfig = {
  ready: {
    label: "Ready",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    icon: CheckCircle,
  },
  generating: {
    label: "Generating",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    icon: Clock,
  },
  failed: {
    label: "Failed",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    icon: AlertCircle,
  },
  scheduled: {
    label: "Scheduled",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    icon: Clock,
  },
};

const formatConfig = {
  pdf: { label: "PDF", color: "text-red-400" },
  csv: { label: "CSV", color: "text-green-400" },
  excel: { label: "Excel", color: "text-green-600" },
  json: { label: "JSON", color: "text-yellow-400" },
};

export default function ReportCard({
  report,
  onDownload,
  onView,
  onRegenerate,
}: ReportCardProps) {
  const typeInfo = typeConfig[report.type];
  const statusInfo = statusConfig[report.status];
  const formatInfo = formatConfig[report.format];
  const TypeIcon = typeInfo.icon;
  const StatusIcon = statusInfo.icon;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatFileSize = (size: string) => {
    return size;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div
            className={`p-2 rounded-lg ${typeInfo.bgColor} ${typeInfo.borderColor} border`}
          >
            <TypeIcon className={`w-5 h-5 ${typeInfo.color}`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{report.name}</h3>
            <p className="text-sm text-gray-400">{report.description}</p>
          </div>
        </div>
        <div
          className={`flex items-center space-x-1 px-2 py-1 rounded-full ${statusInfo.bgColor}`}
        >
          <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
          <span className={`text-sm font-medium ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Type</p>
          <p className={`text-sm font-medium ${typeInfo.color}`}>
            {typeInfo.label}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Format</p>
          <p className={`text-sm font-medium ${formatInfo.color}`}>
            {formatInfo.label}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Size</p>
          <p className="text-sm font-medium text-gray-300">
            {formatFileSize(report.size)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Downloads</p>
          <p className="text-sm font-medium text-gray-300">
            {report.downloads}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-xs text-gray-500 mb-1">Period</p>
          <p className="text-sm font-medium text-gray-300">{report.period}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Data Points</p>
          <p className="text-sm font-medium text-gray-300">
            {report.dataPoints.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
        <div className="flex items-center space-x-1">
          <Calendar className="w-3 h-3" />
          <span>Created {formatDate(report.createdAt)}</span>
        </div>
        {report.generatedAt && (
          <div className="flex items-center space-x-1">
            <span>Generated {formatDate(report.generatedAt)}</span>
          </div>
        )}
      </div>

      {report.expiresAt && (
        <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-yellow-400">
              Expires {formatDate(report.expiresAt)}
            </span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {report.status === "ready" && (
            <>
              <button
                onClick={() => onDownload(report.id)}
                className="flex items-center space-x-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
              <button
                onClick={() => onView(report.id)}
                className="flex items-center space-x-1 px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
              >
                <Eye className="w-4 h-4" />
                <span>View</span>
              </button>
            </>
          )}
          {report.status === "failed" && (
            <button
              onClick={() => onRegenerate(report.id)}
              className="flex items-center space-x-1 px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors text-sm"
            >
              <Clock className="w-4 h-4" />
              <span>Regenerate</span>
            </button>
          )}
          {report.status === "generating" && (
            <div className="flex items-center space-x-2 text-yellow-400">
              <Clock className="w-4 h-4 animate-spin" />
              <span className="text-sm">Generating...</span>
            </div>
          )}
          {report.status === "scheduled" && (
            <div className="flex items-center space-x-2 text-blue-400">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Scheduled</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
