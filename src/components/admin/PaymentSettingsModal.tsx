"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CreditCard,
  Wallet,
  Smartphone,
  Coins,
  Check,
  AlertCircle,
  Loader2,
  Settings,
  Key,
  Eye,
  EyeOff,
  Save,
  TestTube,
} from "lucide-react";

interface PaymentSettings {
  stripe: {
    enabled: boolean;
    publicKey: string;
    secretKey: string;
    webhookSecret: string;
    testMode: boolean;
  };
  paypal: {
    enabled: boolean;
    clientId: string;
    clientSecret: string;
    sandbox: boolean;
  };
  flutterwave: {
    enabled: boolean;
    publicKey: string;
    secretKey: string;
    encryptionKey: string;
    testMode: boolean;
  };
  nowpayments: {
    enabled: boolean;
    apiKey: string;
    sandbox: boolean;
  };
  crypto: {
    usdtContract: string;
    tronNetwork: string;
    bscNetwork: string;
    ethNetwork: string;
    platformWallet: string;
  };
}

interface PaymentSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PaymentSettingsModal({
  isOpen,
  onClose,
}: PaymentSettingsModalProps) {
  const [settings, setSettings] = useState<PaymentSettings>({
    stripe: {
      enabled: false,
      publicKey: "",
      secretKey: "",
      webhookSecret: "",
      testMode: false,
    },
    paypal: { enabled: false, clientId: "", clientSecret: "", sandbox: false },
    flutterwave: {
      enabled: false,
      publicKey: "",
      secretKey: "",
      encryptionKey: "",
      testMode: false,
    },
    nowpayments: { enabled: false, apiKey: "", sandbox: false },
    crypto: {
      usdtContract: "",
      tronNetwork: "",
      bscNetwork: "",
      ethNetwork: "",
      platformWallet: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isOpen) {
      fetchSettings();
    }
  }, [isOpen]);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/payment-settings");
      const data = await response.json();

      if (data.success) {
        setSettings(data.settings);
      } else {
        setError("Failed to fetch payment settings");
      }
    } catch (error) {
      setError("Failed to fetch payment settings");
    } finally {
      setLoading(false);
    }
  };

  const validateApiKeys = () => {
    const errors = [];

    // Validate Stripe keys
    if (settings.stripe.enabled) {
      if (
        !settings.stripe.publicKey ||
        !settings.stripe.publicKey.startsWith("pk_")
      ) {
        errors.push('Stripe public key must start with "pk_"');
      }
      if (
        !settings.stripe.secretKey ||
        !settings.stripe.secretKey.startsWith("sk_")
      ) {
        errors.push('Stripe secret key must start with "sk_"');
      }
    }

    // Validate PayPal keys
    if (settings.paypal.enabled) {
      if (!settings.paypal.clientId || settings.paypal.clientId.length < 10) {
        errors.push("PayPal client ID is required and must be valid");
      }
      if (
        !settings.paypal.clientSecret ||
        settings.paypal.clientSecret.length < 10
      ) {
        errors.push("PayPal client secret is required and must be valid");
      }
    }

    // Validate Flutterwave keys
    if (settings.flutterwave.enabled) {
      if (
        !settings.flutterwave.publicKey ||
        !settings.flutterwave.publicKey.startsWith("FLWPUBK_")
      ) {
        errors.push('Flutterwave public key must start with "FLWPUBK_"');
      }
      if (
        !settings.flutterwave.secretKey ||
        !settings.flutterwave.secretKey.startsWith("FLWSECK_")
      ) {
        errors.push('Flutterwave secret key must start with "FLWSECK_"');
      }
    }

    // Validate NowPayments key
    if (settings.nowpayments.enabled) {
      if (
        !settings.nowpayments.apiKey ||
        settings.nowpayments.apiKey.length < 10
      ) {
        errors.push("NowPayments API key is required and must be valid");
      }
    }

    return errors;
  };

  const saveSettings = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    // Validate API keys before saving
    const validationErrors = validateApiKeys();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(". "));
      setSaving(false);
      return;
    }

    try {
      const response = await fetch("/api/admin/payment-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ settings }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(`Updated ${data.updates.length} payment settings`);
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.error || "Failed to save settings");
      }
    } catch (error) {
      setError("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (
    section: keyof PaymentSettings,
    field: string,
    value: any
  ) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const toggleSecretVisibility = (key: string) => {
    setShowSecrets((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const testPaymentMethod = async (method: string) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/payment-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider: method,
          testMode:
            method === "stripe"
              ? settings.stripe.testMode
              : method === "paypal"
              ? settings.paypal.sandbox
              : method === "flutterwave"
              ? settings.flutterwave.testMode
              : method === "nowpayments"
              ? settings.nowpayments.sandbox
              : false,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(`${method} test successful: ${data.message}`);
        setTimeout(() => setSuccess(""), 5000);
      } else {
        setError(`${method} test failed: ${data.message}`);
        setTimeout(() => setError(""), 5000);
      }
    } catch (error) {
      setError(`Failed to test ${method} configuration`);
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false);
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
          className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto text-gray-900"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Payment Settings
                </h2>
                <p className="text-gray-600">
                  Configure payment methods and API keys
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                <span className="ml-2 text-gray-600">Loading settings...</span>
              </div>
            ) : (
              <>
                {/* Stripe Settings */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Stripe
                        </h3>
                        <p className="text-sm text-gray-600">
                          Credit cards, Apple Pay, Google Pay
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => testPaymentMethod("stripe")}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        <TestTube className="w-4 h-4 inline mr-1" />
                        Test
                      </button>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={settings.stripe.enabled}
                          onChange={(e) =>
                            updateSetting("stripe", "enabled", e.target.checked)
                          }
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Enable</span>
                      </label>
                      <div
                        className={`w-3 h-3 rounded-full ${
                          settings.stripe.enabled
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Public Key
                      </label>
                      <div className="relative">
                        <input
                          type={showSecrets.stripe_public ? "text" : "password"}
                          value={settings.stripe.publicKey}
                          onChange={(e) =>
                            updateSetting("stripe", "publicKey", e.target.value)
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                          placeholder="pk_test_..."
                        />
                        <button
                          onClick={() =>
                            toggleSecretVisibility("stripe_public")
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showSecrets.stripe_public ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Secret Key
                      </label>
                      <div className="relative">
                        <input
                          type={showSecrets.stripe_secret ? "text" : "password"}
                          value={settings.stripe.secretKey}
                          onChange={(e) =>
                            updateSetting("stripe", "secretKey", e.target.value)
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                          placeholder="sk_test_..."
                        />
                        <button
                          onClick={() =>
                            toggleSecretVisibility("stripe_secret")
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showSecrets.stripe_secret ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Webhook Secret
                      </label>
                      <div className="relative">
                        <input
                          type={
                            showSecrets.stripe_webhook ? "text" : "password"
                          }
                          value={settings.stripe.webhookSecret}
                          onChange={(e) =>
                            updateSetting(
                              "stripe",
                              "webhookSecret",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                          placeholder="whsec_..."
                        />
                        <button
                          onClick={() =>
                            toggleSecretVisibility("stripe_webhook")
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showSecrets.stripe_webhook ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PayPal Settings */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Wallet className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          PayPal
                        </h3>
                        <p className="text-sm text-gray-600">
                          PayPal balance, credit cards
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => testPaymentMethod("paypal")}
                        className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
                      >
                        <TestTube className="w-4 h-4 inline mr-1" />
                        Test
                      </button>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={settings.paypal.enabled}
                          onChange={(e) =>
                            updateSetting("paypal", "enabled", e.target.checked)
                          }
                          className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                        />
                        <span className="text-sm text-gray-700">Enable</span>
                      </label>
                      <div
                        className={`w-3 h-3 rounded-full ${
                          settings.paypal.enabled
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Client ID
                      </label>
                      <div className="relative">
                        <input
                          type={showSecrets.paypal_client ? "text" : "password"}
                          value={settings.paypal.clientId}
                          onChange={(e) =>
                            updateSetting("paypal", "clientId", e.target.value)
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent pr-10"
                          placeholder="Client ID"
                        />
                        <button
                          onClick={() =>
                            toggleSecretVisibility("paypal_client")
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showSecrets.paypal_client ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Client Secret
                      </label>
                      <div className="relative">
                        <input
                          type={showSecrets.paypal_secret ? "text" : "password"}
                          value={settings.paypal.clientSecret}
                          onChange={(e) =>
                            updateSetting(
                              "paypal",
                              "clientSecret",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent pr-10"
                          placeholder="Client Secret"
                        />
                        <button
                          onClick={() =>
                            toggleSecretVisibility("paypal_secret")
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showSecrets.paypal_secret ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Flutterwave Settings */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Flutterwave
                        </h3>
                        <p className="text-sm text-gray-600">
                          Mobile money, bank transfers
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => testPaymentMethod("flutterwave")}
                        className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                      >
                        <TestTube className="w-4 h-4 inline mr-1" />
                        Test
                      </button>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={settings.flutterwave.enabled}
                          onChange={(e) =>
                            updateSetting(
                              "flutterwave",
                              "enabled",
                              e.target.checked
                            )
                          }
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700">Enable</span>
                      </label>
                      <div
                        className={`w-3 h-3 rounded-full ${
                          settings.flutterwave.enabled
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Public Key
                      </label>
                      <div className="relative">
                        <input
                          type={
                            showSecrets.flutterwave_public ? "text" : "password"
                          }
                          value={settings.flutterwave.publicKey}
                          onChange={(e) =>
                            updateSetting(
                              "flutterwave",
                              "publicKey",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-10"
                          placeholder="FLWPUBK_..."
                        />
                        <button
                          onClick={() =>
                            toggleSecretVisibility("flutterwave_public")
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showSecrets.flutterwave_public ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Secret Key
                      </label>
                      <div className="relative">
                        <input
                          type={
                            showSecrets.flutterwave_secret ? "text" : "password"
                          }
                          value={settings.flutterwave.secretKey}
                          onChange={(e) =>
                            updateSetting(
                              "flutterwave",
                              "secretKey",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-10"
                          placeholder="FLWSECK_..."
                        />
                        <button
                          onClick={() =>
                            toggleSecretVisibility("flutterwave_secret")
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showSecrets.flutterwave_secret ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Encryption Key
                      </label>
                      <div className="relative">
                        <input
                          type={
                            showSecrets.flutterwave_encryption
                              ? "text"
                              : "password"
                          }
                          value={settings.flutterwave.encryptionKey}
                          onChange={(e) =>
                            updateSetting(
                              "flutterwave",
                              "encryptionKey",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-10"
                          placeholder="Encryption Key"
                        />
                        <button
                          onClick={() =>
                            toggleSecretVisibility("flutterwave_encryption")
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showSecrets.flutterwave_encryption ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* NowPayments Settings */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Coins className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          NowPayments (USDT)
                        </h3>
                        <p className="text-sm text-gray-600">
                          Cryptocurrency payments
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => testPaymentMethod("nowpayments")}
                        className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                      >
                        <TestTube className="w-4 h-4 inline mr-1" />
                        Test
                      </button>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={settings.nowpayments.enabled}
                          onChange={(e) =>
                            updateSetting(
                              "nowpayments",
                              "enabled",
                              e.target.checked
                            )
                          }
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-700">Enable</span>
                      </label>
                      <div
                        className={`w-3 h-3 rounded-full ${
                          settings.nowpayments.enabled
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        API Key
                      </label>
                      <div className="relative">
                        <input
                          type={
                            showSecrets.nowpayments_api ? "text" : "password"
                          }
                          value={settings.nowpayments.apiKey}
                          onChange={(e) =>
                            updateSetting(
                              "nowpayments",
                              "apiKey",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10"
                          placeholder="API Key"
                        />
                        <button
                          onClick={() =>
                            toggleSecretVisibility("nowpayments_api")
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showSecrets.nowpayments_api ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={settings.nowpayments.sandbox}
                          onChange={(e) =>
                            updateSetting(
                              "nowpayments",
                              "sandbox",
                              e.target.checked
                            )
                          }
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-700">
                          Sandbox Mode
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Error/Success Messages */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span className="text-red-700">{error}</span>
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-green-700">{success}</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <button
                    onClick={onClose}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveSettings}
                    disabled={saving}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Settings</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
