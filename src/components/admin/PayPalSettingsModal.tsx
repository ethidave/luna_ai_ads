"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Eye,
  EyeOff,
  Copy,
  Check,
  AlertCircle,
  ExternalLink,
  Settings,
} from "lucide-react";
import { adminApiService } from "@/lib/services/adminApiService";

interface PayPalSettings {
  paypal_client_id: string;
  paypal_client_secret: string;
  paypal_webhook_id: string;
  paypal_enabled: boolean;
  paypal_sandbox: boolean;
  paypal_currency: string;
  paypal_webhook_url: string;
}

interface PayPalSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PayPalSettingsModal({
  isOpen,
  onClose,
}: PayPalSettingsModalProps) {
  const [settings, setSettings] = useState<PayPalSettings>({
    paypal_client_id: "",
    paypal_client_secret: "",
    paypal_webhook_id: "",
    paypal_enabled: false,
    paypal_sandbox: true,
    paypal_currency: "USD",
    paypal_webhook_url: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [testingConnection, setTestingConnection] = useState(false);
  const [showSecrets, setShowSecrets] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Load settings on mount
  useEffect(() => {
    if (isOpen) {
      loadSettings();
    }
  }, [isOpen]);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const response = await adminApiService.getPaymentSettings();
      if (response.success && response.data) {
        setSettings({
          paypal_client_id: response.data.paypal_client_id || "",
          paypal_client_secret: response.data.paypal_client_secret || "",
          paypal_webhook_id: response.data.paypal_webhook_id || "",
          paypal_enabled: response.data.paypal_enabled || false,
          paypal_sandbox: response.data.paypal_sandbox !== false,
          paypal_currency: response.data.paypal_currency || "USD",
          paypal_webhook_url: response.data.paypal_webhook_url || "",
        });
      }
    } catch (error) {
      console.error("Failed to load PayPal settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof PayPalSettings, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleSecretVisibility = (field: string) => {
    setShowSecrets((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  const testConnection = async () => {
    setTestingConnection(true);
    try {
      const response = await adminApiService.testPaymentMethod("paypal");
      if (response.success) {
        alert("PayPal connection test successful!");
      } else {
        alert(`PayPal connection test failed: ${response.error}`);
      }
    } catch (error) {
      alert("PayPal connection test failed. Please check your credentials.");
    } finally {
      setTestingConnection(false);
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    setSaveStatus("idle");

    try {
      const response = await adminApiService.updatePaymentSettings({
        paypal_client_id: settings.paypal_client_id,
        paypal_client_secret: settings.paypal_client_secret,
        paypal_webhook_id: settings.paypal_webhook_id,
        paypal_enabled: settings.paypal_enabled,
        paypal_sandbox: settings.paypal_sandbox,
        paypal_currency: settings.paypal_currency,
        paypal_webhook_url: settings.paypal_webhook_url,
      });

      if (response.success) {
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
        setSaveStatus("error");
        setTimeout(() => setSaveStatus("idle"), 3000);
      }
    } catch (error) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  PayPal Configuration
                </h2>
                <p className="text-gray-600">
                  Configure PayPal payment processing settings
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
              </div>
            ) : (
              <>
                {/* Enable/Disable Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Enable PayPal
                    </h3>
                    <p className="text-sm text-gray-600">
                      Enable or disable PayPal payment processing
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleInputChange(
                        "paypal_enabled",
                        !settings.paypal_enabled
                      )
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.paypal_enabled ? "bg-yellow-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.paypal_enabled
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Sandbox Mode Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Sandbox Mode
                    </h3>
                    <p className="text-sm text-gray-600">
                      Use PayPal sandbox for testing (recommended for
                      development)
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleInputChange(
                        "paypal_sandbox",
                        !settings.paypal_sandbox
                      )
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.paypal_sandbox ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.paypal_sandbox
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* PayPal Credentials */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    PayPal Credentials
                  </h3>

                  {/* Client ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PayPal Client ID
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={settings.paypal_client_id}
                        onChange={(e) =>
                          handleInputChange("paypal_client_id", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent pr-20"
                        placeholder="Enter your PayPal Client ID"
                      />
                      <button
                        onClick={() =>
                          copyToClipboard(
                            settings.paypal_client_id,
                            "client_id"
                          )
                        }
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {copiedField === "client_id" ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Client Secret */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PayPal Client Secret
                    </label>
                    <div className="relative">
                      <input
                        type={showSecrets.client_secret ? "text" : "password"}
                        value={settings.paypal_client_secret}
                        onChange={(e) =>
                          handleInputChange(
                            "paypal_client_secret",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent pr-20"
                        placeholder="Enter your PayPal Client Secret"
                      />
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                        <button
                          onClick={() =>
                            toggleSecretVisibility("client_secret")
                          }
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          {showSecrets.client_secret ? (
                            <EyeOff className="w-4 h-4 text-gray-500" />
                          ) : (
                            <Eye className="w-4 h-4 text-gray-500" />
                          )}
                        </button>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              settings.paypal_client_secret,
                              "client_secret"
                            )
                          }
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          {copiedField === "client_secret" ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-500" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Webhook ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PayPal Webhook ID
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={settings.paypal_webhook_id}
                        onChange={(e) =>
                          handleInputChange("paypal_webhook_id", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent pr-20"
                        placeholder="Enter your PayPal Webhook ID"
                      />
                      <button
                        onClick={() =>
                          copyToClipboard(
                            settings.paypal_webhook_id,
                            "webhook_id"
                          )
                        }
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {copiedField === "webhook_id" ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Currency */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Currency
                    </label>
                    <select
                      value={settings.paypal_currency}
                      onChange={(e) =>
                        handleInputChange("paypal_currency", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                      <option value="AUD">AUD - Australian Dollar</option>
                      <option value="JPY">JPY - Japanese Yen</option>
                    </select>
                  </div>
                </div>

                {/* Webhook URL */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Webhook Configuration
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Webhook URL
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={settings.paypal_webhook_url}
                        onChange={(e) =>
                          handleInputChange(
                            "paypal_webhook_url",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent pr-20"
                        placeholder="https://yourdomain.com/api/webhooks/paypal"
                      />
                      <button
                        onClick={() =>
                          copyToClipboard(
                            settings.paypal_webhook_url,
                            "webhook_url"
                          )
                        }
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {copiedField === "webhook_url" ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-500" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      This URL will receive PayPal webhook notifications
                    </p>
                  </div>
                </div>

                {/* Help Section */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">
                        Setup Instructions
                      </h4>
                      <ol className="text-sm text-blue-800 mt-2 space-y-1">
                        <li>
                          1. Go to{" "}
                          <a
                            href="https://developer.paypal.com/dashboard/applications"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline inline-flex items-center"
                          >
                            PayPal Developer Dashboard{" "}
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        </li>
                        <li>
                          2. Create a new application or use an existing one
                        </li>
                        <li>3. Copy the Client ID and Client Secret</li>
                        <li>4. Set up webhooks for payment notifications</li>
                        <li>
                          5. Use sandbox mode for testing, live mode for
                          production
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>

                {/* Status Indicators */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Configuration Status
                    </h4>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          settings.paypal_enabled && settings.paypal_client_id
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          settings.paypal_enabled && settings.paypal_client_id
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {settings.paypal_enabled && settings.paypal_client_id
                          ? "Configured & Active"
                          : "Not Configured"}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Mode</h4>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          settings.paypal_sandbox
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          settings.paypal_sandbox
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {settings.paypal_sandbox ? "Sandbox Mode" : "Live Mode"}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex space-x-3">
              <button
                onClick={testConnection}
                disabled={
                  testingConnection ||
                  !settings.paypal_enabled ||
                  !settings.paypal_client_id
                }
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {testingConnection ? "Testing..." : "Test Connection"}
              </button>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveSettings}
                disabled={isSaving}
                className="px-6 py-2 text-sm font-medium text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </div>

          {/* Save Status */}
          {saveStatus !== "idle" && (
            <div
              className={`absolute top-4 right-4 p-4 rounded-lg ${
                saveStatus === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {saveStatus === "success"
                ? "Settings saved successfully!"
                : "Failed to save settings"}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
