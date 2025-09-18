"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Download,
  Upload,
  Save,
  Trash2,
  Clock,
  HardDrive,
  AlertCircle,
  CheckCircle,
  Loader2,
  Calendar,
  Settings,
  FileText,
  Archive,
  RefreshCw,
} from "lucide-react";
import { useBackup } from "@/hooks/useBackup";
import { SettingsBackup, BackupOptions } from "@/lib/services/backupService";

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: any;
  onRestore: (settings: any) => void;
}

export default function BackupModal({
  isOpen,
  onClose,
  currentSettings,
  onRestore,
}: BackupModalProps) {
  const [activeTab, setActiveTab] = useState<"create" | "manage" | "schedule">(
    "create"
  );
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Create backup form
  const [backupName, setBackupName] = useState("");
  const [backupDescription, setBackupDescription] = useState("");
  const [backupType, setBackupType] = useState<"manual" | "scheduled" | "auto">(
    "manual"
  );
  const [backupOptions, setBackupOptions] = useState<BackupOptions>({
    includeSettings: true,
    includeDatabase: false,
    includeFiles: false,
    includeLogs: false,
    compression: true,
    encryption: false,
  });

  // Schedule backup form
  const [scheduleFrequency, setScheduleFrequency] = useState<
    "daily" | "weekly" | "monthly"
  >("daily");
  const [scheduleTime, setScheduleTime] = useState("02:00");

  const {
    backups,
    stats,
    isLoading,
    error,
    createBackup,
    restoreBackup,
    deleteBackup,
    exportBackup,
    importBackup,
    scheduleBackup,
    refreshBackups,
  } = useBackup();

  useEffect(() => {
    if (isOpen) {
      refreshBackups();
    }
  }, [isOpen, refreshBackups]);

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleCreateBackup = async () => {
    if (!backupName.trim()) {
      showMessage("error", "Please enter a backup name");
      return;
    }

    try {
      const backup = await createBackup(
        currentSettings,
        backupName,
        backupDescription,
        backupType,
        backupOptions
      );

      setBackupName("");
      setBackupDescription("");
      showMessage("success", `Backup "${backup.name}" created successfully`);
    } catch (error) {
      showMessage(
        "error",
        error instanceof Error ? error.message : "Failed to create backup"
      );
    }
  };

  const handleRestoreBackup = async (backupId: string) => {
    if (
      !confirm(
        "Are you sure you want to restore this backup? This will overwrite your current settings."
      )
    ) {
      return;
    }

    try {
      const settings = await restoreBackup(backupId);
      onRestore(settings);
      showMessage("success", "Settings restored successfully");
    } catch (error) {
      showMessage(
        "error",
        error instanceof Error ? error.message : "Failed to restore backup"
      );
    }
  };

  const handleDeleteBackup = async (backupId: string) => {
    if (!confirm("Are you sure you want to delete this backup?")) {
      return;
    }

    try {
      await deleteBackup(backupId);
      showMessage("success", "Backup deleted successfully");
    } catch (error) {
      showMessage(
        "error",
        error instanceof Error ? error.message : "Failed to delete backup"
      );
    }
  };

  const handleExportBackup = async (backupId: string) => {
    try {
      const blob = await exportBackup(backupId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `backup_${backupId}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showMessage("success", "Backup exported successfully");
    } catch (error) {
      showMessage(
        "error",
        error instanceof Error ? error.message : "Failed to export backup"
      );
    }
  };

  const handleImportBackup = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await importBackup(file);
      showMessage("success", "Backup imported successfully");
    } catch (error) {
      showMessage(
        "error",
        error instanceof Error ? error.message : "Failed to import backup"
      );
    }
  };

  const handleScheduleBackup = async () => {
    try {
      await scheduleBackup(currentSettings, scheduleFrequency, scheduleTime);
      showMessage("success", "Backup schedule updated successfully");
    } catch (error) {
      showMessage(
        "error",
        error instanceof Error
          ? error.message
          : "Failed to update backup schedule"
      );
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
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
          className="bg-slate-900 border border-white/10 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div>
              <h2 className="text-2xl font-bold text-white">Settings Backup</h2>
              <p className="text-white/70 mt-1">
                Manage your settings backups and restore points
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mx-6 mt-4 p-4 rounded-lg border flex items-center space-x-2 ${
                message.type === "success"
                  ? "bg-green-500/10 border-green-500/30 text-green-400"
                  : "bg-red-500/10 border-red-500/30 text-red-400"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span>{message.text}</span>
            </motion.div>
          )}

          {/* Stats */}
          <div className="p-6 border-b border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Archive className="w-5 h-5 text-blue-400" />
                  <h3 className="text-sm font-medium text-white">
                    Total Backups
                  </h3>
                </div>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <HardDrive className="w-5 h-5 text-green-400" />
                  <h3 className="text-sm font-medium text-white">Total Size</h3>
                </div>
                <p className="text-2xl font-bold text-white">
                  {formatFileSize(stats.totalSize)}
                </p>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-5 h-5 text-purple-400" />
                  <h3 className="text-sm font-medium text-white">
                    Last Backup
                  </h3>
                </div>
                <p className="text-sm text-white/70">
                  {stats.lastBackup ? formatDate(stats.lastBackup) : "Never"}
                </p>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="w-5 h-5 text-orange-400" />
                  <h3 className="text-sm font-medium text-white">
                    Next Scheduled
                  </h3>
                </div>
                <p className="text-sm text-white/70">
                  {stats.nextScheduled
                    ? formatDate(stats.nextScheduled)
                    : "Not scheduled"}
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/10">
            {[
              { id: "create", name: "Create Backup", icon: Save },
              { id: "manage", name: "Manage Backups", icon: Archive },
              { id: "schedule", name: "Schedule", icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? "text-blue-400 border-b-2 border-blue-400 bg-blue-500/10"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {activeTab === "create" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Create New Backup
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Backup Name
                      </label>
                      <input
                        type="text"
                        value={backupName}
                        onChange={(e) => setBackupName(e.target.value)}
                        placeholder="Enter backup name"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Type
                      </label>
                      <select
                        value={backupType}
                        onChange={(e) => setBackupType(e.target.value as any)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="manual">Manual</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="auto">Automatic</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Description
                    </label>
                    <textarea
                      value={backupDescription}
                      onChange={(e) => setBackupDescription(e.target.value)}
                      placeholder="Optional description"
                      rows={3}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div className="mt-6">
                    <h4 className="text-md font-medium text-white mb-3">
                      Backup Options
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(backupOptions).map(([key, value]) => (
                        <label
                          key={key}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) =>
                              setBackupOptions({
                                ...backupOptions,
                                [key]: e.target.checked,
                              })
                            }
                            className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-white/90 capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleCreateBackup}
                      disabled={isLoading || !backupName.trim()}
                      className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      <span>Create Backup</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "manage" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">
                    Manage Backups
                  </h3>
                  <div className="flex items-center space-x-2">
                    <label className="flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg cursor-pointer hover:bg-white/20 transition-all duration-200">
                      <Upload className="w-4 h-4" />
                      <span className="text-sm text-white">Import</span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportBackup}
                        className="hidden"
                      />
                    </label>
                    <button
                      onClick={refreshBackups}
                      className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {backups.length === 0 ? (
                  <div className="text-center py-12">
                    <Archive className="w-16 h-16 text-white/30 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">
                      No Backups Found
                    </h3>
                    <p className="text-white/70">
                      Create your first backup to get started
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {backups.map((backup) => (
                      <div
                        key={backup.id}
                        className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="text-md font-medium text-white">
                                {backup.name}
                              </h4>
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${
                                  backup.type === "manual"
                                    ? "bg-blue-500/20 text-blue-400"
                                    : backup.type === "scheduled"
                                    ? "bg-green-500/20 text-green-400"
                                    : "bg-purple-500/20 text-purple-400"
                                }`}
                              >
                                {backup.type}
                              </span>
                            </div>
                            <p className="text-sm text-white/70 mb-2">
                              {backup.description}
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-white/60">
                              <span className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{formatDate(backup.timestamp)}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <HardDrive className="w-3 h-3" />
                                <span>{formatFileSize(backup.size)}</span>
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleRestoreBackup(backup.id)}
                              className="p-2 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-lg transition-all duration-200"
                              title="Restore"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleExportBackup(backup.id)}
                              className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all duration-200"
                              title="Export"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteBackup(backup.id)}
                              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "schedule" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Schedule Automatic Backups
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Frequency
                      </label>
                      <select
                        value={scheduleFrequency}
                        onChange={(e) =>
                          setScheduleFrequency(e.target.value as any)
                        }
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Time
                      </label>
                      <input
                        type="time"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-blue-400 mb-1">
                          Scheduled Backups
                        </h4>
                        <p className="text-sm text-blue-300">
                          Automatic backups will be created at the specified
                          time and frequency. Only the last 10 backups will be
                          kept to save storage space.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleScheduleBackup}
                      className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Update Schedule</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
