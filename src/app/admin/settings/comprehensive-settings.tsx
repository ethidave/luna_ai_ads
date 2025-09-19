"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import PaymentSettingsModal from "@/components/admin/PaymentSettingsModal";
import EnhancedPaymentSettingsModal from "@/components/admin/EnhancedPaymentSettingsModal";
import CompletePaymentSettingsModal from "@/components/admin/CompletePaymentSettingsModal";
import BackupModal from "@/components/admin/BackupModal";
import {
  Settings,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2,
  Shield,
  Bell,
  Globe,
  CreditCard,
  Database,
  Lock,
  Users,
  Mail,
  Clock,
  Eye,
  EyeOff,
  Server,
  HardDrive,
  Key,
  Smartphone,
  Monitor,
  Zap,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Plus,
  Edit,
  X,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Info,
  ExternalLink,
  Archive,
  History,
} from "lucide-react";

export default function ComprehensiveAdminSettings() {
  const [settings, setSettings] = useState({
    // General Settings
    siteName: "LunaLuna AI",
    adminEmail: "admin@lunaai.com",
    timezone: "UTC",
    language: "en",
    siteDescription: "AI-powered advertising platform for modern businesses",
    siteUrl: "https://lunaai.com",
    supportEmail: "support@lunaai.com",
    maintenanceMode: false,

    // Security Settings
    security: {
      twoFactor: true,
      sessionTimeout: 30,
      passwordMinLength: 8,
      passwordRequireSpecial: true,
      passwordRequireNumbers: true,
      passwordRequireUppercase: true,
      loginAttempts: 5,
      lockoutDuration: 15,
      ipWhitelist: [],
      sslRequired: true,
      cookieSecure: true,
      csrfProtection: true,
    },

    // Notification Settings
    notifications: {
      email: {
        enabled: true,
        smtpHost: "smtp.gmail.com",
        smtpPort: 587,
        smtpUsername: "",
        smtpPassword: "",
        smtpEncryption: "tls",
        fromName: "LunaLuna AI",
        fromEmail: "noreply@lunaai.com",
      },
      sms: {
        enabled: false,
        provider: "twilio",
        apiKey: "",
        apiSecret: "",
        fromNumber: "",
      },
      push: {
        enabled: true,
        firebaseKey: "",
        firebaseSecret: "",
      },
      admin: {
        enabled: true,
        newUserRegistration: true,
        paymentReceived: true,
        systemErrors: true,
        securityAlerts: true,
      },
    },

    // Social Media Settings
    social: {
      facebook: "",
      twitter: "",
      linkedin: "",
      instagram: "",
      youtube: "",
      tiktok: "",
      discord: "",
      autoPost: false,
      socialLogin: false,
    },

    // Payment Settings
    payments: {
      stripe: {
        publicKey: "",
        secretKey: "",
        webhookSecret: "",
        enabled: false,
      },
      paypal: {
        clientId: "",
        clientSecret: "",
        webhookId: "",
        enabled: false,
      },
      razorpay: {
        keyId: "",
        keySecret: "",
        webhookSecret: "",
        enabled: false,
      },
      nowpayments: {
        apiKey: "",
        ipnSecret: "",
        sandboxMode: true,
        enabled: false,
        supportedCoins: [
          "BTC",
          "ETH",
          "USDT",
          "USDC",
          "LTC",
          "BCH",
          "XRP",
          "ADA",
          "DOT",
          "MATIC",
        ],
      },
      flutterwave: {
        publicKey: "",
        secretKey: "",
        encryptionKey: "",
        webhookSecret: "",
        enabled: false,
        supportedCurrencies: [
          "NGN",
          "USD",
          "EUR",
          "GBP",
          "KES",
          "GHS",
          "ZAR",
          "EGP",
        ],
      },
      general: {
        defaultCurrency: "USD",
        testMode: true,
        autoCapture: true,
        refundPolicy: "7 days",
      },
    },

    // Database Settings
    database: {
      backupEnabled: true,
      backupFrequency: "daily",
      backupRetention: 30,
      autoOptimize: true,
      queryLogging: false,
      slowQueryThreshold: 2000,
    },

    // System Settings
    system: {
      maxFileSize: 10,
      allowedFileTypes: ["jpg", "jpeg", "png", "gif", "pdf", "doc", "docx"],
      cacheEnabled: true,
      cacheDuration: 3600,
      compressionEnabled: true,
      cdnEnabled: false,
      cdnUrl: "",
      monitoringEnabled: true,
      logLevel: "info",
    },

    // API Settings
    api: {
      rateLimitEnabled: true,
      rateLimitRequests: 1000,
      rateLimitWindow: 60,
      apiKeyRequired: false,
      corsEnabled: true,
      corsOrigins: ["*"],
      webhookRetries: 3,
      webhookTimeout: 30,
    },

    // Theme Settings
    theme: {
      primaryColor: "#6366f1",
      secondaryColor: "#8b5cf6",
      accentColor: "#f59e0b",
      darkMode: false,
      customCss: "",
      logoUrl: "",
      faviconUrl: "",
    },
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [showPaymentSettings, setShowPaymentSettings] = useState(false);
  const [showEnhancedPaymentSettings, setShowEnhancedPaymentSettings] =
    useState(false);
  const [showCompletePaymentSettings, setShowCompletePaymentSettings] =
    useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", name: "General", icon: Settings },
    { id: "security", name: "Security", icon: Shield },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "social", name: "Social", icon: Globe },
    { id: "payments", name: "Payments", icon: CreditCard },
    { id: "database", name: "Database", icon: Database },
    { id: "system", name: "System", icon: Server },
    { id: "api", name: "API", icon: Key },
    { id: "theme", name: "Theme", icon: Monitor },
    { id: "backup", name: "Backup", icon: Archive },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus("idle");

    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({ settings }),
      });

      if (response.ok) {
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
        setSaveStatus("error");
        setTimeout(() => setSaveStatus("idle"), 3000);
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRestoreSettings = (restoredSettings: any) => {
    setSettings(restoredSettings);
    setSaveStatus("success");
    setTimeout(() => setSaveStatus("idle"), 3000);
  };

  const renderGeneralSettings = () => (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
        General Settings
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Site Name
          </label>
          <input
            type="text"
            value={settings.siteName}
            onChange={(e) =>
              setSettings({ ...settings, siteName: e.target.value })
            }
            className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Admin Email
          </label>
          <input
            type="email"
            value={settings.adminEmail}
            onChange={(e) =>
              setSettings({ ...settings, adminEmail: e.target.value })
            }
            className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Site URL
          </label>
          <input
            type="url"
            value={settings.siteUrl}
            onChange={(e) =>
              setSettings({ ...settings, siteUrl: e.target.value })
            }
            className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Support Email
          </label>
          <input
            type="email"
            value={settings.supportEmail}
            onChange={(e) =>
              setSettings({ ...settings, supportEmail: e.target.value })
            }
            className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Timezone
          </label>
          <select
            value={settings.timezone}
            onChange={(e) =>
              setSettings({ ...settings, timezone: e.target.value })
            }
            className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          >
            <option value="UTC">UTC</option>
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
            <option value="Europe/London">London</option>
            <option value="Europe/Paris">Paris</option>
            <option value="Asia/Tokyo">Tokyo</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Language
          </label>
          <select
            value={settings.language}
            onChange={(e) =>
              setSettings({ ...settings, language: e.target.value })
            }
            className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="it">Italian</option>
            <option value="pt">Portuguese</option>
            <option value="ru">Russian</option>
            <option value="ja">Japanese</option>
            <option value="ko">Korean</option>
            <option value="zh">Chinese</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white/90 mb-2">
          Site Description
        </label>
        <textarea
          value={settings.siteDescription}
          onChange={(e) =>
            setSettings({ ...settings, siteDescription: e.target.value })
          }
          rows={3}
          className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
        />
      </div>

      <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg">
        <div>
          <h3 className="text-lg font-medium text-white">Maintenance Mode</h3>
          <p className="text-white/70 text-sm">
            Enable maintenance mode to temporarily disable the site
          </p>
        </div>
        <button
          onClick={() =>
            setSettings({
              ...settings,
              maintenanceMode: !settings.maintenanceMode,
            })
          }
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            settings.maintenanceMode ? "bg-red-600" : "bg-gray-600"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              settings.maintenanceMode ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Security Settings</h2>

      <div className="space-y-6">
        {/* Authentication */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Authentication
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg">
              <div>
                <h4 className="text-md font-medium text-white">
                  Two-Factor Authentication
                </h4>
                <p className="text-white/70 text-sm">
                  Require 2FA for admin accounts
                </p>
              </div>
              <button
                onClick={() =>
                  setSettings({
                    ...settings,
                    security: {
                      ...settings.security,
                      twoFactor: !settings.security.twoFactor,
                    },
                  })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.security.twoFactor ? "bg-blue-600" : "bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.security.twoFactor
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  value={settings.security.sessionTimeout}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      security: {
                        ...settings.security,
                        sessionTimeout: parseInt(e.target.value),
                      },
                    })
                  }
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Login Attempts Limit
                </label>
                <input
                  type="number"
                  value={settings.security.loginAttempts}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      security: {
                        ...settings.security,
                        loginAttempts: parseInt(e.target.value),
                      },
                    })
                  }
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Password Requirements */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Password Requirements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Minimum Length
              </label>
              <input
                type="number"
                value={settings.security.passwordMinLength}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    security: {
                      ...settings.security,
                      passwordMinLength: parseInt(e.target.value),
                    },
                  })
                }
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Lockout Duration (minutes)
              </label>
              <input
                type="number"
                value={settings.security.lockoutDuration}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    security: {
                      ...settings.security,
                      lockoutDuration: parseInt(e.target.value),
                    },
                  })
                }
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {[
              {
                key: "passwordRequireSpecial",
                label: "Require Special Characters",
              },
              { key: "passwordRequireNumbers", label: "Require Numbers" },
              {
                key: "passwordRequireUppercase",
                label: "Require Uppercase Letters",
              },
              { key: "sslRequired", label: "Require SSL/HTTPS" },
              { key: "cookieSecure", label: "Secure Cookies" },
              { key: "csrfProtection", label: "CSRF Protection" },
            ].map(({ key, label }) => (
              <div
                key={key}
                className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg"
              >
                <span className="text-white/90">{label}</span>
                <button
                  onClick={() =>
                    setSettings({
                      ...settings,
                      security: {
                        ...settings.security,
                        [key]:
                          !settings.security[
                            key as keyof typeof settings.security
                          ],
                      },
                    })
                  }
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    settings.security[key as keyof typeof settings.security]
                      ? "bg-blue-600"
                      : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      settings.security[key as keyof typeof settings.security]
                        ? "translate-x-5"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">
        Notification Settings
      </h2>

      <div className="space-y-6">
        {/* Email Settings */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Email Configuration
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg">
              <div>
                <h4 className="text-md font-medium text-white">
                  Enable Email Notifications
                </h4>
                <p className="text-white/70 text-sm">
                  Send notifications via email
                </p>
              </div>
              <button
                onClick={() =>
                  setSettings({
                    ...settings,
                    notifications: {
                      ...settings.notifications,
                      email: {
                        ...settings.notifications.email,
                        enabled: !settings.notifications.email.enabled,
                      },
                    },
                  })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.notifications.email.enabled
                    ? "bg-blue-600"
                    : "bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.notifications.email.enabled
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  SMTP Host
                </label>
                <input
                  type="text"
                  value={settings.notifications.email.smtpHost}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        email: {
                          ...settings.notifications.email,
                          smtpHost: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  SMTP Port
                </label>
                <input
                  type="number"
                  value={settings.notifications.email.smtpPort}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        email: {
                          ...settings.notifications.email,
                          smtpPort: parseInt(e.target.value),
                        },
                      },
                    })
                  }
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  SMTP Username
                </label>
                <input
                  type="text"
                  value={settings.notifications.email.smtpUsername}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        email: {
                          ...settings.notifications.email,
                          smtpUsername: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  SMTP Password
                </label>
                <input
                  type="password"
                  value={settings.notifications.email.smtpPassword}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        email: {
                          ...settings.notifications.email,
                          smtpPassword: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Admin Notifications */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Admin Notifications
          </h3>
          <div className="space-y-3">
            {Object.entries(settings.notifications.admin).map(
              ([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg"
                >
                  <div>
                    <h4 className="text-md font-medium text-white capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </h4>
                    <p className="text-white/70 text-sm">
                      Receive notifications for{" "}
                      {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          admin: {
                            ...settings.notifications.admin,
                            [key]: !value,
                          },
                        },
                      })
                    }
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      value ? "bg-blue-600" : "bg-gray-600"
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        value ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSocialSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">
        Social Media Settings
      </h2>

      <div className="space-y-6">
        {/* Social Media Links */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Social Media Links
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(settings.social).map(([platform, url]) => (
              <div key={platform} className="space-y-2">
                <label className="block text-sm font-medium text-white/90 capitalize">
                  {platform === "youtube"
                    ? "YouTube"
                    : platform.charAt(0).toUpperCase() + platform.slice(1)}
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        social: {
                          ...settings.social,
                          [platform]: e.target.value,
                        },
                      })
                    }
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`https://${platform}.com/your-username`}
                  />
                  {url && (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all duration-300"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Media Preview */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Social Media Preview
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(settings.social).map(([platform, url]) => (
              <div
                key={platform}
                className={`p-4 rounded-lg border ${
                  url
                    ? "bg-green-500/10 border-green-500/30"
                    : "bg-gray-500/10 border-gray-500/30"
                }`}
              >
                <div className="text-center">
                  <div
                    className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                      url ? "bg-green-500" : "bg-gray-500"
                    }`}
                  >
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-sm font-medium text-white capitalize">
                    {platform === "youtube"
                      ? "YouTube"
                      : platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </h4>
                  <p
                    className={`text-xs mt-1 ${
                      url ? "text-green-400" : "text-gray-400"
                    }`}
                  >
                    {url ? "Connected" : "Not Connected"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Media Analytics */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Social Media Analytics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-white">
                  Total Followers
                </h4>
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-2xl font-bold text-white">12.5K</p>
              <p className="text-xs text-green-400">+12% from last month</p>
            </div>

            <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-white">
                  Engagement Rate
                </h4>
                <Activity className="w-4 h-4 text-green-400" />
              </div>
              <p className="text-2xl font-bold text-white">4.2%</p>
              <p className="text-xs text-green-400">+0.8% from last month</p>
            </div>

            <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-white">Reach</h4>
                <Globe className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-2xl font-bold text-white">45.2K</p>
              <p className="text-xs text-green-400">+18% from last month</p>
            </div>
          </div>
        </div>

        {/* Social Media Integration */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Integration Settings
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg">
              <div>
                <h4 className="text-md font-medium text-white">
                  Auto-post to Social Media
                </h4>
                <p className="text-white/70 text-sm">
                  Automatically share new content to social platforms
                </p>
              </div>
              <button
                onClick={() =>
                  setSettings({
                    ...settings,
                    social: {
                      ...settings.social,
                      autoPost: !settings.social.autoPost,
                    },
                  })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.social.autoPost ? "bg-blue-600" : "bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.social.autoPost ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg">
              <div>
                <h4 className="text-md font-medium text-white">Social Login</h4>
                <p className="text-white/70 text-sm">
                  Allow users to login with social media accounts
                </p>
              </div>
              <button
                onClick={() =>
                  setSettings({
                    ...settings,
                    social: {
                      ...settings.social,
                      socialLogin: !settings.social.socialLogin,
                    },
                  })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.social.socialLogin ? "bg-blue-600" : "bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.social.socialLogin
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "general":
        return renderGeneralSettings();
      case "security":
        return renderSecuritySettings();
      case "notifications":
        return renderNotificationsSettings();
      case "social":
        return renderSocialSettings();
      case "payments":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">
              Payment Settings
            </h2>
            <div className="text-center py-12">
              <CreditCard className="w-16 h-16 text-white/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Payment Configuration
              </h3>
              <p className="text-white/70 mb-6">
                Configure your payment gateways and processing settings
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowPaymentSettings(true)}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 text-sm sm:text-base touch-manipulation"
                >
                  Basic Settings
                </button>
                <button
                  onClick={() => setShowEnhancedPaymentSettings(true)}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  Enhanced Settings
                </button>
                <button
                  onClick={() => setShowCompletePaymentSettings(true)}
                  className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  Complete Settings
                </button>
              </div>
            </div>
          </div>
        );
      case "backup":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">
              Backup & Restore
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Create Backup */}
              <div className="p-4 sm:p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-200">
                <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                  <div className="p-1.5 sm:p-2 bg-blue-500/20 rounded-lg">
                    <Archive className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-white">
                    Create Backup
                  </h3>
                </div>
                <p className="text-white/70 text-xs sm:text-sm mb-3 sm:mb-4">
                  Create a manual backup of your current settings configuration
                </p>
                <button
                  onClick={() => setShowBackupModal(true)}
                  className="w-full px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm sm:text-base touch-manipulation"
                >
                  Open Backup Manager
                </button>
              </div>

              {/* Quick Backup */}
              <div className="p-4 sm:p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-200">
                <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                  <div className="p-1.5 sm:p-2 bg-green-500/20 rounded-lg">
                    <Save className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-white">
                    Quick Backup
                  </h3>
                </div>
                <p className="text-white/70 text-xs sm:text-sm mb-3 sm:mb-4">
                  Create a quick backup with default settings
                </p>
                <button
                  onClick={async () => {
                    const { BackupService } = await import(
                      "@/lib/services/backupService"
                    );
                    const backupService = BackupService.getInstance();
                    try {
                      await backupService.createBackup(
                        settings,
                        `Quick Backup ${new Date().toLocaleString()}`,
                        "Quick backup created from settings page"
                      );
                      setSaveStatus("success");
                      setTimeout(() => setSaveStatus("idle"), 3000);
                    } catch (error) {
                      setSaveStatus("error");
                      setTimeout(() => setSaveStatus("idle"), 3000);
                    }
                  }}
                  className="w-full px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 text-sm sm:text-base touch-manipulation"
                >
                  Create Quick Backup
                </button>
              </div>

              {/* Restore Settings */}
              <div className="p-4 sm:p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-200">
                <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                  <div className="p-1.5 sm:p-2 bg-purple-500/20 rounded-lg">
                    <History className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-white">
                    Restore Settings
                  </h3>
                </div>
                <p className="text-white/70 text-xs sm:text-sm mb-3 sm:mb-4">
                  Restore settings from a previous backup
                </p>
                <button
                  onClick={() => setShowBackupModal(true)}
                  className="w-full px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 text-sm sm:text-base touch-manipulation"
                >
                  View Backups
                </button>
              </div>
            </div>

            {/* Backup Information */}
            <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-4">
                Backup Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-medium text-white mb-2">
                    What's Included
                  </h4>
                  <ul className="space-y-1 text-sm text-white/70">
                    <li>• All general settings (site name, email, etc.)</li>
                    <li>• Security configurations</li>
                    <li>• Notification settings</li>
                    <li>• Social media links</li>
                    <li>• Payment gateway settings</li>
                    <li>• Database configurations</li>
                    <li>• System preferences</li>
                    <li>• API settings</li>
                    <li>• Theme customizations</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-md font-medium text-white mb-2">
                    Backup Features
                  </h4>
                  <ul className="space-y-1 text-sm text-white/70">
                    <li>• Automatic compression</li>
                    <li>• Version control</li>
                    <li>• Export/Import functionality</li>
                    <li>• Scheduled backups</li>
                    <li>• One-click restore</li>
                    <li>• Backup history tracking</li>
                    <li>• Secure storage</li>
                    <li>• Size optimization</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Backup Tips */}
            <div className="p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <h4 className="text-md font-medium text-blue-400 mb-2">
                    Backup Best Practices
                  </h4>
                  <ul className="space-y-1 text-sm text-blue-300">
                    <li>• Create backups before making major changes</li>
                    <li>• Schedule automatic daily backups for production</li>
                    <li>• Export backups regularly for off-site storage</li>
                    <li>• Test restore functionality periodically</li>
                    <li>
                      • Keep multiple backup versions for rollback options
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">
              {tabs.find((t) => t.id === activeTab)?.name} Settings
            </h2>
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                {React.createElement(
                  tabs.find((t) => t.id === activeTab)?.icon || Settings,
                  { className: "w-8 h-8 text-white/50" }
                )}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Coming Soon
              </h3>
              <p className="text-white/70">This section is under development</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Admin Settings
          </h1>
          <p className="text-white/70 mt-2 text-sm sm:text-base">
            Manage your application settings and configurations
          </p>
        </div>

        {/* Save Status */}
        {saveStatus !== "idle" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-lg border"
          >
            <div className="flex items-center space-x-2">
              {saveStatus === "success" ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-green-400">
                    Settings saved successfully!
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <span className="text-red-400">
                    Failed to save settings. Please try again.
                  </span>
                </>
              )}
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-6">
              <nav className="space-y-1 sm:space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all duration-200 touch-manipulation ${
                        activeTab === tab.id
                          ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                      <span className="font-medium text-sm sm:text-base">
                        {tab.name}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-6">
              {renderContent()}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 sm:mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center space-x-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            ) : (
              <Save className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
            <span className="text-sm sm:text-base">
              {isSaving ? "Saving..." : "Save Settings"}
            </span>
          </button>
        </div>
      </div>

      {/* Payment Settings Modal */}
      <PaymentSettingsModal
        isOpen={showPaymentSettings}
        onClose={() => setShowPaymentSettings(false)}
      />

      {/* Enhanced Payment Settings Modal */}
      <EnhancedPaymentSettingsModal
        isOpen={showEnhancedPaymentSettings}
        onClose={() => setShowEnhancedPaymentSettings(false)}
      />

      {/* Complete Payment Settings Modal */}
      <CompletePaymentSettingsModal
        isOpen={showCompletePaymentSettings}
        onClose={() => setShowCompletePaymentSettings(false)}
      />

      {/* Backup Modal */}
      <BackupModal
        isOpen={showBackupModal}
        onClose={() => setShowBackupModal(false)}
        currentSettings={settings}
        onRestore={handleRestoreSettings}
      />
    </div>
  );
}
