"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CreditCard,
  Settings,
  CheckCircle,
  AlertCircle,
  Loader2,
  TestTube,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
} from "lucide-react";

interface PaymentSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PaymentSettings {
  stripe_public_key: string;
  stripe_secret_key: string;
  stripe_webhook_secret: string;
  paypal_client_id: string;
  paypal_client_secret: string;
  paypal_webhook_id: string;
  razorpay_key_id: string;
  razorpay_key_secret: string;
  razorpay_webhook_secret: string;
  default_currency: string;
  test_mode: boolean;
  stripe_enabled: boolean;
  paypal_enabled: boolean;
  razorpay_enabled: boolean;
}

export default function EnhancedPaymentSettingsModal({
  isOpen,
  onClose,
}: PaymentSettingsModalProps) {
  const [settings, setSettings] = useState<PaymentSettings>({
    stripe_public_key: "",
    stripe_secret_key: "",
    stripe_webhook_secret: "",
    paypal_client_id: "",
    paypal_client_secret: "",
    paypal_webhook_id: "",
    razorpay_key_id: "",
    razorpay_key_secret: "",
    razorpay_webhook_secret: "",
    default_currency: "USD",
    test_mode: true,
    stripe_enabled: false,
    paypal_enabled: false,
    razorpay_enabled: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [testingMethod, setTestingMethod] = useState<string | null>(null);
  const [showSecrets, setShowSecrets] = useState<{[key: string]: boolean}>({});

  // Load settings on mount
  useEffect(() => {
    if (isOpen) {
      loadSettings();
    }
  }, [isOpen]);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/payment-settings", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings || settings);
      }
    } catch (error) {
      console.error("Error fetching payment settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus("idle");

    try {
      const response = await fetch("/api/admin/payment-settings", {
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
      console.error("Error saving payment settings:", error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const testPaymentMethod = async (method: string) => {
    setTestingMethod(method);
    try {
      const response = await fetch(`/api/admin/test-payment/${method}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        alert(`${method} test successful: ${data.message}`);
      } else {
        const errorData = await response.json();
        alert(`${method} test failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error(`Error testing ${method}:`, error);
      alert(`${method} test failed: Network error`);
    } finally {
      setTestingMethod(null);
    }
  };

  const handleInputChange = (field: keyof PaymentSettings, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleSecretVisibility = (field: string) => {
    setShowSecrets(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
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
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Payment Settings</h2>
                  <p className="text-white/70">Configure payment gateways and processing settings</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-white/50 animate-spin" />
                <span className="ml-3 text-white/70">Loading settings...</span>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Stripe Settings */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-white">Stripe Configuration</h3>
                      <button
                        onClick={() => handleInputChange("stripe_enabled", !settings.stripe_enabled)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          settings.stripe_enabled ? "bg-blue-600" : "bg-gray-600"
                        }`}
                      >
                        <span
                          className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                            settings.stripe_enabled ? "translate-x-5" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                    <button
                      onClick={() => testPaymentMethod("stripe")}
                      disabled={testingMethod === "stripe" || !settings.stripe_enabled}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-all duration-300 disabled:opacity-50"
                    >
                      {testingMethod === "stripe" ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <TestTube className="w-4 h-4" />
                      )}
                      <span>Test</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Public Key
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={settings.stripe_public_key}
                          onChange={(e) => handleInputChange("stripe_public_key", e.target.value)}
                          className="w-full px-4 py-3 pr-10 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="pk_test_..."
                        />
                        <button
                          onClick={() => copyToClipboard(settings.stripe_public_key)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-white/50 hover:text-white transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Secret Key
                      </label>
                      <div className="relative">
                        <input
                          type={showSecrets.stripe_secret ? "text" : "password"}
                          value={settings.stripe_secret_key}
                          onChange={(e) => handleInputChange("stripe_secret_key", e.target.value)}
                          className="w-full px-4 py-3 pr-20 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="sk_test_..."
                        />
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                          <button
                            onClick={() => toggleSecretVisibility("stripe_secret")}
                            className="p-1 text-white/50 hover:text-white transition-colors"
                          >
                            {showSecrets.stripe_secret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => copyToClipboard(settings.stripe_secret_key)}
                            className="p-1 text-white/50 hover:text-white transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Webhook Secret
                      </label>
                      <div className="relative">
                        <input
                          type={showSecrets.stripe_webhook ? "text" : "password"}
                          value={settings.stripe_webhook_secret}
                          onChange={(e) => handleInputChange("stripe_webhook_secret", e.target.value)}
                          className="w-full px-4 py-3 pr-20 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="whsec_..."
                        />
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                          <button
                            onClick={() => toggleSecretVisibility("stripe_webhook")}
                            className="p-1 text-white/50 hover:text-white transition-colors"
                          >
                            {showSecrets.stripe_webhook ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => copyToClipboard(settings.stripe_webhook_secret)}
                            className="p-1 text-white/50 hover:text-white transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <a
                      href="https://dashboard.stripe.com/webhooks"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Configure Webhooks in Stripe Dashboard</span>
                    </a>
                  </div>
                </div>

                {/* PayPal Settings */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-white">PayPal Configuration</h3>
                      <button
                        onClick={() => handleInputChange("paypal_enabled", !settings.paypal_enabled)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          settings.paypal_enabled ? "bg-yellow-600" : "bg-gray-600"
                        }`}
                      >
                        <span
                          className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                            settings.paypal_enabled ? "translate-x-5" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                    <button
                      onClick={() => testPaymentMethod("paypal")}
                      disabled={testingMethod === "paypal" || !settings.paypal_enabled}
                      className="flex items-center space-x-2 px-4 py-2 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-lg hover:bg-yellow-500/30 transition-all duration-300 disabled:opacity-50"
                    >
                      {testingMethod === "paypal" ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <TestTube className="w-4 h-4" />
                      )}
                      <span>Test</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Client ID
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={settings.paypal_client_id}
                          onChange={(e) => handleInputChange("paypal_client_id", e.target.value)}
                          className="w-full px-4 py-3 pr-10 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          placeholder="AeA1QIZXiflr1-..."
                        />
                        <button
                          onClick={() => copyToClipboard(settings.paypal_client_id)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-white/50 hover:text-white transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Client Secret
                      </label>
                      <div className="relative">
                        <input
                          type={showSecrets.paypal_secret ? "text" : "password"}
                          value={settings.paypal_client_secret}
                          onChange={(e) => handleInputChange("paypal_client_secret", e.target.value)}
                          className="w-full px-4 py-3 pr-20 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          placeholder="EC..."
                        />
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                          <button
                            onClick={() => toggleSecretVisibility("paypal_secret")}
                            className="p-1 text-white/50 hover:text-white transition-colors"
                          >
                            {showSecrets.paypal_secret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => copyToClipboard(settings.paypal_client_secret)}
                            className="p-1 text-white/50 hover:text-white transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Webhook ID
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={settings.paypal_webhook_id}
                          onChange={(e) => handleInputChange("paypal_webhook_id", e.target.value)}
                          className="w-full px-4 py-3 pr-10 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          placeholder="8W..."
                        />
                        <button
                          onClick={() => copyToClipboard(settings.paypal_webhook_id)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-white/50 hover:text-white transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <a
                      href="https://developer.paypal.com/dashboard/applications"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Configure Apps in PayPal Developer Dashboard</span>
                    </a>
                  </div>
                </div>

                {/* Razorpay Settings */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-white">Razorpay Configuration</h3>
                      <button
                        onClick={() => handleInputChange("razorpay_enabled", !settings.razorpay_enabled)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          settings.razorpay_enabled ? "bg-purple-600" : "bg-gray-600"
                        }`}
                      >
                        <span
                          className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                            settings.razorpay_enabled ? "translate-x-5" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                    <button
                      onClick={() => testPaymentMethod("razorpay")}
                      disabled={testingMethod === "razorpay" || !settings.razorpay_enabled}
                      className="flex items-center space-x-2 px-4 py-2 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg hover:bg-purple-500/30 transition-all duration-300 disabled:opacity-50"
                    >
                      {testingMethod === "razorpay" ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <TestTube className="w-4 h-4" />
                      )}
                      <span>Test</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Key ID
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={settings.razorpay_key_id}
                          onChange={(e) => handleInputChange("razorpay_key_id", e.target.value)}
                          className="w-full px-4 py-3 pr-10 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="rzp_test_..."
                        />
                        <button
                          onClick={() => copyToClipboard(settings.razorpay_key_id)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-white/50 hover:text-white transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Key Secret
                      </label>
                      <div className="relative">
                        <input
                          type={showSecrets.razorpay_secret ? "text" : "password"}
                          value={settings.razorpay_key_secret}
                          onChange={(e) => handleInputChange("razorpay_key_secret", e.target.value)}
                          className="w-full px-4 py-3 pr-20 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="..."
                        />
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                          <button
                            onClick={() => toggleSecretVisibility("razorpay_secret")}
                            className="p-1 text-white/50 hover:text-white transition-colors"
                          >
                            {showSecrets.razorpay_secret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => copyToClipboard(settings.razorpay_key_secret)}
                            className="p-1 text-white/50 hover:text-white transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Webhook Secret
                      </label>
                      <div className="relative">
                        <input
                          type={showSecrets.razorpay_webhook ? "text" : "password"}
                          value={settings.razorpay_webhook_secret}
                          onChange={(e) => handleInputChange("razorpay_webhook_secret", e.target.value)}
                          className="w-full px-4 py-3 pr-20 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="..."
                        />
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                          <button
                            onClick={() => toggleSecretVisibility("razorpay_webhook")}
                            className="p-1 text-white/50 hover:text-white transition-colors"
                          >
                            {showSecrets.razorpay_webhook ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => copyToClipboard(settings.razorpay_webhook_secret)}
                            className="p-1 text-white/50 hover:text-white transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <a
                      href="https://dashboard.razorpay.com/webhooks"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Configure Webhooks in Razorpay Dashboard</span>
                    </a>
                  </div>
                </div>

                {/* General Settings */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">General Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Default Currency
                      </label>
                      <select
                        value={settings.default_currency}
                        onChange={(e) => handleInputChange("default_currency", e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                        <option value="INR">INR - Indian Rupee</option>
                        <option value="CAD">CAD - Canadian Dollar</option>
                        <option value="AUD">AUD - Australian Dollar</option>
                        <option value="JPY">JPY - Japanese Yen</option>
                        <option value="CNY">CNY - Chinese Yuan</option>
                        <option value="BRL">BRL - Brazilian Real</option>
                        <option value="MXN">MXN - Mexican Peso</option>
                      </select>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="test_mode"
                        checked={settings.test_mode}
                        onChange={(e) => handleInputChange("test_mode", e.target.checked)}
                        className="w-5 h-5 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <label htmlFor="test_mode" className="text-white/90">
                        Test Mode
                      </label>
                    </div>
                  </div>
                </div>

                {/* Payment Status Overview */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Payment Status Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`p-4 rounded-lg border ${
                      settings.stripe_enabled && settings.stripe_public_key 
                        ? 'bg-green-500/10 border-green-500/30' 
                        : 'bg-red-500/10 border-red-500/30'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-white">Stripe</h4>
                        <div className={`w-3 h-3 rounded-full ${
                          settings.stripe_enabled && settings.stripe_public_key ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                      </div>
                      <p className={`text-sm ${
                        settings.stripe_enabled && settings.stripe_public_key ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {settings.stripe_enabled && settings.stripe_public_key ? 'Configured & Active' : 'Not Configured'}
                      </p>
                    </div>
                    
                    <div className={`p-4 rounded-lg border ${
                      settings.paypal_enabled && settings.paypal_client_id 
                        ? 'bg-green-500/10 border-green-500/30' 
                        : 'bg-red-500/10 border-red-500/30'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-white">PayPal</h4>
                        <div className={`w-3 h-3 rounded-full ${
                          settings.paypal_enabled && settings.paypal_client_id ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                      </div>
                      <p className={`text-sm ${
                        settings.paypal_enabled && settings.paypal_client_id ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {settings.paypal_enabled && settings.paypal_client_id ? 'Configured & Active' : 'Not Configured'}
                      </p>
                    </div>
                    
                    <div className={`p-4 rounded-lg border ${
                      settings.razorpay_enabled && settings.razorpay_key_id 
                        ? 'bg-green-500/10 border-green-500/30' 
                        : 'bg-red-500/10 border-red-500/30'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-white">Razorpay</h4>
                        <div className={`w-3 h-3 rounded-full ${
                          settings.razorpay_enabled && settings.razorpay_key_id ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                      </div>
                      <p className={`text-sm ${
                        settings.razorpay_enabled && settings.razorpay_key_id ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {settings.razorpay_enabled && settings.razorpay_key_id ? 'Configured & Active' : 'Not Configured'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {saveStatus === "success" && (
                  <div className="flex items-center space-x-2 text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm">Settings saved successfully!</span>
                  </div>
                )}
                {saveStatus === "error" && (
                  <div className="flex items-center space-x-2 text-red-400">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm">Failed to save settings. Please try again.</span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={onClose}
                  className="px-6 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  <span>{isSaving ? "Saving..." : "Save Settings"}</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
