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
  Coins,
  Globe,
  Shield,
  Zap,
} from "lucide-react";

interface CompletePaymentSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PaymentSettings {
  stripe: {
    publicKey: string;
    secretKey: string;
    webhookSecret: string;
    enabled: boolean;
  };
  paypal: {
    clientId: string;
    clientSecret: string;
    webhookId: string;
    enabled: boolean;
  };
  razorpay: {
    keyId: string;
    keySecret: string;
    webhookSecret: string;
    enabled: boolean;
  };
  nowpayments: {
    apiKey: string;
    ipnSecret: string;
    sandboxMode: boolean;
    enabled: boolean;
    supportedCoins: string[];
  };
  flutterwave: {
    publicKey: string;
    secretKey: string;
    encryptionKey: string;
    webhookSecret: string;
    enabled: boolean;
    supportedCurrencies: string[];
  };
  general: {
    defaultCurrency: string;
    testMode: boolean;
    autoCapture: boolean;
    refundPolicy: string;
  };
}

export default function CompletePaymentSettingsModal({
  isOpen,
  onClose,
}: CompletePaymentSettingsModalProps) {
  const [settings, setSettings] = useState<PaymentSettings>({
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
      supportedCoins: ["BTC", "ETH", "USDT", "USDC", "LTC", "BCH", "XRP", "ADA", "DOT", "MATIC"],
    },
    flutterwave: {
      publicKey: "",
      secretKey: "",
      encryptionKey: "",
      webhookSecret: "",
      enabled: false,
      supportedCurrencies: ["NGN", "USD", "EUR", "GBP", "KES", "GHS", "ZAR", "EGP"],
    },
    general: {
      defaultCurrency: "USD",
      testMode: true,
      autoCapture: true,
      refundPolicy: "7 days",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [testingMethod, setTestingMethod] = useState<string | null>(null);
  const [showSecrets, setShowSecrets] = useState<{[key: string]: boolean}>({});
  const [activeTab, setActiveTab] = useState("stripe");

  const paymentTabs = [
    { id: "stripe", name: "Stripe", icon: CreditCard, color: "blue" },
    { id: "paypal", name: "PayPal", icon: Globe, color: "yellow" },
    { id: "razorpay", name: "Razorpay", icon: Shield, color: "purple" },
    { id: "nowpayments", name: "NowPayments", icon: Coins, color: "green" },
    { id: "flutterwave", name: "Flutterwave", icon: Zap, color: "orange" },
    { id: "general", name: "General", icon: Settings, color: "gray" },
  ];

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

  const handleInputChange = (provider: string, field: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [provider]: {
        ...prev[provider as keyof PaymentSettings],
        [field]: value,
      },
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
  };

  const renderStripeSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-white">Stripe Configuration</h3>
          <button
            onClick={() => handleInputChange("stripe", "enabled", !settings.stripe.enabled)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              settings.stripe.enabled ? "bg-blue-600" : "bg-gray-600"
            }`}
          >
            <span
              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                settings.stripe.enabled ? "translate-x-5" : "translate-x-1"
              }`}
            />
          </button>
        </div>
        <button
          onClick={() => testPaymentMethod("stripe")}
          disabled={testingMethod === "stripe" || !settings.stripe.enabled}
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
          <label className="block text-sm font-medium text-white/90 mb-2">Public Key</label>
          <div className="relative">
            <input
              type="text"
              value={settings.stripe.publicKey}
              onChange={(e) => handleInputChange("stripe", "publicKey", e.target.value)}
              className="w-full px-4 py-3 pr-10 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="pk_test_..."
            />
            <button
              onClick={() => copyToClipboard(settings.stripe.publicKey)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-white/50 hover:text-white transition-colors"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">Secret Key</label>
          <div className="relative">
            <input
              type={showSecrets.stripe_secret ? "text" : "password"}
              value={settings.stripe.secretKey}
              onChange={(e) => handleInputChange("stripe", "secretKey", e.target.value)}
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
                onClick={() => copyToClipboard(settings.stripe.secretKey)}
                className="p-1 text-white/50 hover:text-white transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-white/90 mb-2">Webhook Secret</label>
          <div className="relative">
            <input
              type={showSecrets.stripe_webhook ? "text" : "password"}
              value={settings.stripe.webhookSecret}
              onChange={(e) => handleInputChange("stripe", "webhookSecret", e.target.value)}
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
                onClick={() => copyToClipboard(settings.stripe.webhookSecret)}
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
  );

  const renderNowPaymentsSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-white">NowPayments Configuration</h3>
          <button
            onClick={() => handleInputChange("nowpayments", "enabled", !settings.nowpayments.enabled)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              settings.nowpayments.enabled ? "bg-green-600" : "bg-gray-600"
            }`}
          >
            <span
              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                settings.nowpayments.enabled ? "translate-x-5" : "translate-x-1"
              }`}
            />
          </button>
        </div>
        <button
          onClick={() => testPaymentMethod("nowpayments")}
          disabled={testingMethod === "nowpayments" || !settings.nowpayments.enabled}
          className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-all duration-300 disabled:opacity-50"
        >
          {testingMethod === "nowpayments" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <TestTube className="w-4 h-4" />
          )}
          <span>Test</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">API Key</label>
          <div className="relative">
            <input
              type={showSecrets.nowpayments_api ? "text" : "password"}
              value={settings.nowpayments.apiKey}
              onChange={(e) => handleInputChange("nowpayments", "apiKey", e.target.value)}
              className="w-full px-4 py-3 pr-20 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="np_..."
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
              <button
                onClick={() => toggleSecretVisibility("nowpayments_api")}
                className="p-1 text-white/50 hover:text-white transition-colors"
              >
                {showSecrets.nowpayments_api ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button
                onClick={() => copyToClipboard(settings.nowpayments.apiKey)}
                className="p-1 text-white/50 hover:text-white transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">IPN Secret</label>
          <div className="relative">
            <input
              type={showSecrets.nowpayments_ipn ? "text" : "password"}
              value={settings.nowpayments.ipnSecret}
              onChange={(e) => handleInputChange("nowpayments", "ipnSecret", e.target.value)}
              className="w-full px-4 py-3 pr-20 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="..."
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
              <button
                onClick={() => toggleSecretVisibility("nowpayments_ipn")}
                className="p-1 text-white/50 hover:text-white transition-colors"
              >
                {showSecrets.nowpayments_ipn ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button
                onClick={() => copyToClipboard(settings.nowpayments.ipnSecret)}
                className="p-1 text-white/50 hover:text-white transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="sandbox_mode"
              checked={settings.nowpayments.sandboxMode}
              onChange={(e) => handleInputChange("nowpayments", "sandboxMode", e.target.checked)}
              className="w-5 h-5 text-green-600 bg-white/10 border-white/20 rounded focus:ring-green-500 focus:ring-2"
            />
            <label htmlFor="sandbox_mode" className="text-white/90">
              Sandbox Mode (Test Mode)
            </label>
          </div>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-white/90 mb-2">Supported Cryptocurrencies</label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {settings.nowpayments.supportedCoins.map((coin) => (
            <div key={coin} className="flex items-center space-x-2 p-2 bg-white/5 border border-white/10 rounded-lg">
              <Coins className="w-4 h-4 text-green-400" />
              <span className="text-white/90 text-sm">{coin}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4">
        <a
          href="https://nowpayments.io/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Configure in NowPayments Dashboard</span>
        </a>
      </div>
    </div>
  );

  const renderFlutterwaveSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-white">Flutterwave Configuration</h3>
          <button
            onClick={() => handleInputChange("flutterwave", "enabled", !settings.flutterwave.enabled)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              settings.flutterwave.enabled ? "bg-orange-600" : "bg-gray-600"
            }`}
          >
            <span
              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                settings.flutterwave.enabled ? "translate-x-5" : "translate-x-1"
              }`}
            />
          </button>
        </div>
        <button
          onClick={() => testPaymentMethod("flutterwave")}
          disabled={testingMethod === "flutterwave" || !settings.flutterwave.enabled}
          className="flex items-center space-x-2 px-4 py-2 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-lg hover:bg-orange-500/30 transition-all duration-300 disabled:opacity-50"
        >
          {testingMethod === "flutterwave" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <TestTube className="w-4 h-4" />
          )}
          <span>Test</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">Public Key</label>
          <div className="relative">
            <input
              type="text"
              value={settings.flutterwave.publicKey}
              onChange={(e) => handleInputChange("flutterwave", "publicKey", e.target.value)}
              className="w-full px-4 py-3 pr-10 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="FLWPUBK-..."
            />
            <button
              onClick={() => copyToClipboard(settings.flutterwave.publicKey)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-white/50 hover:text-white transition-colors"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">Secret Key</label>
          <div className="relative">
            <input
              type={showSecrets.flutterwave_secret ? "text" : "password"}
              value={settings.flutterwave.secretKey}
              onChange={(e) => handleInputChange("flutterwave", "secretKey", e.target.value)}
              className="w-full px-4 py-3 pr-20 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="FLWSECK-..."
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
              <button
                onClick={() => toggleSecretVisibility("flutterwave_secret")}
                className="p-1 text-white/50 hover:text-white transition-colors"
              >
                {showSecrets.flutterwave_secret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button
                onClick={() => copyToClipboard(settings.flutterwave.secretKey)}
                className="p-1 text-white/50 hover:text-white transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">Encryption Key</label>
          <div className="relative">
            <input
              type={showSecrets.flutterwave_encryption ? "text" : "password"}
              value={settings.flutterwave.encryptionKey}
              onChange={(e) => handleInputChange("flutterwave", "encryptionKey", e.target.value)}
              className="w-full px-4 py-3 pr-20 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="..."
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
              <button
                onClick={() => toggleSecretVisibility("flutterwave_encryption")}
                className="p-1 text-white/50 hover:text-white transition-colors"
              >
                {showSecrets.flutterwave_encryption ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button
                onClick={() => copyToClipboard(settings.flutterwave.encryptionKey)}
                className="p-1 text-white/50 hover:text-white transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">Webhook Secret</label>
          <div className="relative">
            <input
              type={showSecrets.flutterwave_webhook ? "text" : "password"}
              value={settings.flutterwave.webhookSecret}
              onChange={(e) => handleInputChange("flutterwave", "webhookSecret", e.target.value)}
              className="w-full px-4 py-3 pr-20 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="..."
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
              <button
                onClick={() => toggleSecretVisibility("flutterwave_webhook")}
                className="p-1 text-white/50 hover:text-white transition-colors"
              >
                {showSecrets.flutterwave_webhook ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button
                onClick={() => copyToClipboard(settings.flutterwave.webhookSecret)}
                className="p-1 text-white/50 hover:text-white transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-white/90 mb-2">Supported Currencies</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {settings.flutterwave.supportedCurrencies.map((currency) => (
            <div key={currency} className="flex items-center space-x-2 p-2 bg-white/5 border border-white/10 rounded-lg">
              <Globe className="w-4 h-4 text-orange-400" />
              <span className="text-white/90 text-sm">{currency}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4">
        <a
          href="https://dashboard.flutterwave.com/settings/webhooks"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 text-orange-400 hover:text-orange-300 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Configure Webhooks in Flutterwave Dashboard</span>
        </a>
      </div>
    </div>
  );

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">General Payment Settings</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">Default Currency</label>
          <select
            value={settings.general.defaultCurrency}
            onChange={(e) => handleInputChange("general", "defaultCurrency", e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="NGN">NGN - Nigerian Naira</option>
            <option value="KES">KES - Kenyan Shilling</option>
            <option value="GHS">GHS - Ghanaian Cedi</option>
            <option value="ZAR">ZAR - South African Rand</option>
            <option value="EGP">EGP - Egyptian Pound</option>
            <option value="INR">INR - Indian Rupee</option>
            <option value="CAD">CAD - Canadian Dollar</option>
            <option value="AUD">AUD - Australian Dollar</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">Refund Policy</label>
          <select
            value={settings.general.refundPolicy}
            onChange={(e) => handleInputChange("general", "refundPolicy", e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7 days">7 days</option>
            <option value="14 days">14 days</option>
            <option value="30 days">30 days</option>
            <option value="No refunds">No refunds</option>
          </select>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="test_mode"
            checked={settings.general.testMode}
            onChange={(e) => handleInputChange("general", "testMode", e.target.checked)}
            className="w-5 h-5 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
          />
          <label htmlFor="test_mode" className="text-white/90">
            Test Mode (Use test keys for all payment methods)
          </label>
        </div>
        
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="auto_capture"
            checked={settings.general.autoCapture}
            onChange={(e) => handleInputChange("general", "autoCapture", e.target.checked)}
            className="w-5 h-5 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
          />
          <label htmlFor="auto_capture" className="text-white/90">
            Auto Capture (Automatically capture payments)
          </label>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "stripe":
        return renderStripeSettings();
      case "nowpayments":
        return renderNowPaymentsSettings();
      case "flutterwave":
        return renderFlutterwaveSettings();
      case "general":
        return renderGeneralSettings();
      default:
        return (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              {React.createElement(paymentTabs.find(t => t.id === activeTab)?.icon || Settings, { className: "w-8 h-8 text-white/50" })}
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Coming Soon</h3>
            <p className="text-white/70">This payment method configuration is under development</p>
          </div>
        );
    }
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
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden"
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
                  <h2 className="text-2xl font-bold text-white">Complete Payment Settings</h2>
                  <p className="text-white/70">Configure all payment gateways and processing settings</p>
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
          <div className="flex h-[calc(90vh-140px)]">
            {/* Sidebar */}
            <div className="w-64 p-6 border-r border-white/10 overflow-y-auto">
              <nav className="space-y-2">
                {paymentTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        activeTab === tab.id
                          ? `bg-${tab.color}-500/20 text-${tab.color}-400 border border-${tab.color}-500/30`
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-white/50 animate-spin" />
                  <span className="ml-3 text-white/70">Loading settings...</span>
                </div>
              ) : (
                renderContent()
              )}
            </div>
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
