"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Save,
  CreditCard,
  User,
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

interface PaymentData {
  id: string;
  user: string;
  amount: number;
  status: "completed" | "pending" | "failed" | "refunded";
  paymentMethod: "stripe" | "paypal" | "bank_transfer" | "crypto";
  plan: string;
  transactionId: string;
  date: string;
  description: string;
  refundAmount?: number;
  refundReason?: string;
  createdAt: string;
  updatedAt: string;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (paymentData: Partial<PaymentData>) => void;
  paymentData?: PaymentData | null;
  mode: "create" | "edit" | "view";
}

const statuses = [
  {
    value: "completed",
    label: "Completed",
    color: "text-green-400",
    icon: CheckCircle,
  },
  {
    value: "pending",
    label: "Pending",
    color: "text-yellow-400",
    icon: AlertCircle,
  },
  { value: "failed", label: "Failed", color: "text-red-400", icon: XCircle },
  {
    value: "refunded",
    label: "Refunded",
    color: "text-gray-400",
    icon: XCircle,
  },
];

const paymentMethods = [
  { value: "stripe", label: "Stripe", color: "text-blue-400" },
  { value: "paypal", label: "PayPal", color: "text-yellow-400" },
  { value: "bank_transfer", label: "Bank Transfer", color: "text-green-400" },
  { value: "crypto", label: "Cryptocurrency", color: "text-purple-400" },
];

const plans = [
  { value: "starter", label: "Starter" },
  { value: "professional", label: "Professional" },
  { value: "enterprise", label: "Enterprise" },
];

export default function PaymentModal({
  isOpen,
  onClose,
  onSave,
  paymentData,
  mode,
}: PaymentModalProps) {
  const [formData, setFormData] = useState<Partial<PaymentData>>({
    user: "",
    amount: 0,
    status: "pending",
    paymentMethod: "stripe",
    plan: "starter",
    transactionId: "",
    date: "",
    description: "",
    refundAmount: 0,
    refundReason: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (paymentData && (mode === "edit" || mode === "view")) {
      setFormData(paymentData);
    } else {
      setFormData({
        user: "",
        amount: 0,
        status: "pending",
        paymentMethod: "stripe",
        plan: "starter",
        transactionId: "",
        date: "",
        description: "",
        refundAmount: 0,
        refundReason: "",
      });
    }
    setErrors({});
  }, [paymentData, mode, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.user?.trim()) {
      newErrors.user = "User is required";
    }

    if (formData.amount === undefined || formData.amount <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    if (!formData.transactionId?.trim()) {
      newErrors.transactionId = "Transaction ID is required";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    if (!formData.plan?.trim()) {
      newErrors.plan = "Plan is required";
    }

    if (
      formData.status === "refunded" &&
      (!formData.refundAmount || formData.refundAmount <= 0)
    ) {
      newErrors.refundAmount =
        "Refund amount is required for refunded payments";
    }

    if (formData.status === "refunded" && !formData.refundReason?.trim()) {
      newErrors.refundReason =
        "Refund reason is required for refunded payments";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "view") {
      onClose();
      return;
    }
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  const handleInputChange = (field: keyof PaymentData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
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
          className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-500/10 rounded-lg">
                <CreditCard className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {mode === "create"
                    ? "Create New Payment"
                    : mode === "edit"
                    ? "Edit Payment"
                    : "Payment Details"}
                </h2>
                <p className="text-gray-400 text-sm">
                  {mode === "create"
                    ? "Add a new payment record"
                    : mode === "edit"
                    ? "Update payment information"
                    : "View payment details"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  User *
                </label>
                <input
                  type="text"
                  value={formData.user || ""}
                  onChange={(e) => handleInputChange("user", e.target.value)}
                  disabled={mode === "view"}
                  className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.user ? "border-red-500" : "border-gray-600"
                  } ${mode === "view" ? "opacity-50 cursor-not-allowed" : ""}`}
                  placeholder="Enter user name or email"
                />
                {errors.user && (
                  <p className="text-red-400 text-sm mt-1">{errors.user}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount || 0}
                  onChange={(e) =>
                    handleInputChange("amount", parseFloat(e.target.value) || 0)
                  }
                  disabled={mode === "view"}
                  className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.amount ? "border-red-500" : "border-gray-600"
                  } ${mode === "view" ? "opacity-50 cursor-not-allowed" : ""}`}
                  placeholder="0.00"
                />
                {errors.amount && (
                  <p className="text-red-400 text-sm mt-1">{errors.amount}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status *
                </label>
                <select
                  value={formData.status || "pending"}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  disabled={mode === "view"}
                  className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.status ? "border-red-500" : "border-gray-600"
                  } ${mode === "view" ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {statuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
                {errors.status && (
                  <p className="text-red-400 text-sm mt-1">{errors.status}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Payment Method *
                </label>
                <select
                  value={formData.paymentMethod || "stripe"}
                  onChange={(e) =>
                    handleInputChange("paymentMethod", e.target.value)
                  }
                  disabled={mode === "view"}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {paymentMethods.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Transaction ID *
                </label>
                <input
                  type="text"
                  value={formData.transactionId || ""}
                  onChange={(e) =>
                    handleInputChange("transactionId", e.target.value)
                  }
                  disabled={mode === "view"}
                  className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.transactionId ? "border-red-500" : "border-gray-600"
                  } ${mode === "view" ? "opacity-50 cursor-not-allowed" : ""}`}
                  placeholder="Enter transaction ID"
                />
                {errors.transactionId && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.transactionId}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Plan *
                </label>
                <select
                  value={formData.plan || "starter"}
                  onChange={(e) => handleInputChange("plan", e.target.value)}
                  disabled={mode === "view"}
                  className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.plan ? "border-red-500" : "border-gray-600"
                  } ${mode === "view" ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {plans.map((plan) => (
                    <option key={plan.value} value={plan.value}>
                      {plan.label}
                    </option>
                  ))}
                </select>
                {errors.plan && (
                  <p className="text-red-400 text-sm mt-1">{errors.plan}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Date *
              </label>
              <input
                type="date"
                value={formData.date || ""}
                onChange={(e) => handleInputChange("date", e.target.value)}
                disabled={mode === "view"}
                className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors.date ? "border-red-500" : "border-gray-600"
                } ${mode === "view" ? "opacity-50 cursor-not-allowed" : ""}`}
              />
              {errors.date && (
                <p className="text-red-400 text-sm mt-1">{errors.date}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description || ""}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                disabled={mode === "view"}
                rows={3}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter payment description"
              />
            </div>

            {/* Refund Fields - Only show if status is refunded */}
            {formData.status === "refunded" && (
              <div className="space-y-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <h3 className="text-lg font-medium text-red-400">
                  Refund Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Refund Amount ($) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.refundAmount || 0}
                      onChange={(e) =>
                        handleInputChange(
                          "refundAmount",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      disabled={mode === "view"}
                      className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                        errors.refundAmount
                          ? "border-red-500"
                          : "border-gray-600"
                      } ${
                        mode === "view" ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      placeholder="0.00"
                    />
                    {errors.refundAmount && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.refundAmount}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Refund Reason *
                    </label>
                    <input
                      type="text"
                      value={formData.refundReason || ""}
                      onChange={(e) =>
                        handleInputChange("refundReason", e.target.value)
                      }
                      disabled={mode === "view"}
                      className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                        errors.refundReason
                          ? "border-red-500"
                          : "border-gray-600"
                      } ${
                        mode === "view" ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      placeholder="Enter refund reason"
                    />
                    {errors.refundReason && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.refundReason}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
              >
                {mode === "view" ? "Close" : "Cancel"}
              </button>
              {mode !== "view" && (
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>
                    {mode === "create" ? "Create Payment" : "Save Changes"}
                  </span>
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
