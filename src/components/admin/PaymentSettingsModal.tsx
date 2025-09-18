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
}

export default function PaymentSettingsModal({
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
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [testingMethod, setTestingMethod] = useState<string | null>(null);

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
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
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
                  <p className="text-white/70">Configure payment gateways and settings</p>
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
                {/* Payment gateway settings will be added here */}
                <div className="text-center text-white/70">
                  Payment gateway configuration coming soon...
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