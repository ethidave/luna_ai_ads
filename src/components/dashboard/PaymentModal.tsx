"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import {
  X,
  CreditCard,
  Wallet,
  Smartphone,
  Coins,
  Lock,
  Check,
  AlertCircle,
  Loader2,
  Shield,
  DollarSign,
  Zap,
  Globe,
  LogIn,
} from "lucide-react";

interface Package {
  id: string;
  name: string;
  price: number;
  features: string[];
  platforms: string[];
  budget: number;
  duration: number;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  package: Package;
  onSuccess: (subscription: any) => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  package: selectedPackage,
  onSuccess,
}: PaymentModalProps) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [paymentData, setPaymentData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [availableMethods, setAvailableMethods] = useState<any[]>([]);
  const [loadingMethods, setLoadingMethods] = useState(true);

  useEffect(() => {
    if (isOpen) {
      // Check if user is authenticated
      if (!user) {
        setError("Please login to continue with payment");
        return;
      }
      fetchAvailableMethods();
    }
  }, [isOpen, user]);

  const fetchAvailableMethods = async () => {
    setLoadingMethods(true);
    try {
      const response = await fetch("/api/payments/methods");
      const data = await response.json();

      if (data.success) {
        setAvailableMethods(data.methods);
      } else {
        setError("Failed to load payment methods");
      }
    } catch (error) {
      setError("Failed to load payment methods");
    } finally {
      setLoadingMethods(false);
    }
  };

  const paymentMethodIcons = {
    stripe: CreditCard,
    paypal: Wallet,
    flutterwave: Globe,
    nowpayments: Zap,
  };

  const paymentMethodColors = {
    stripe: {
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
    },
    paypal: {
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-700",
    },
    flutterwave: {
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
    },
    nowpayments: {
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
    },
  };

  const handlePayment = async () => {
    if (!selectedMethod) {
      setError("Please select a payment method");
      return;
    }

    // Check if user is authenticated
    if (!user?.id) {
      setError("Please login to continue with payment");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Create payment using the payment service
      const response = await fetch(`/api/payments/${selectedMethod}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: selectedPackage.price,
          currency: "USD",
          userId: user?.id,
          packageId: selectedPackage.id,
          description: `Purchase ${selectedPackage.name} package`,
          ...paymentData,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Handle different payment method responses
        if (result.redirectUrl) {
          // Redirect to external payment page
          window.open(result.redirectUrl, "_blank");
        } else if (result.clientSecret) {
          // Handle Stripe payment with client secret
          // This would typically open a Stripe Elements modal
          console.log("Stripe payment created:", result);
        } else if (result.paymentUrl) {
          // Handle Flutterwave or other payment URLs
          window.open(result.paymentUrl, "_blank");
        } else {
          // Direct success
          onSuccess({ package: selectedPackage, payment: result });
          onClose();
        }
      } else {
        setError(result.message || result.error || "Payment failed");
      }
    } catch (error) {
      setError("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentDataChange = (field: string, value: any) => {
    setPaymentData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!isOpen) return null;

  // Show loading state while checking authentication
  if (authLoading) {
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
            className="bg-white rounded-2xl max-w-md w-full text-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Loading...
              </h2>
              <p className="text-gray-600">
                Please wait while we verify your authentication.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Show login prompt if user is not authenticated
  if (!user) {
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
            className="bg-white rounded-2xl max-w-md w-full text-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Login Required
              </h2>
              <p className="text-gray-600 mb-6">
                Please login to your account to continue with the payment
                process.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    onClose();
                    router.push("/auth/login");
                  }}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login to Continue</span>
                </button>
                <button
                  onClick={() => {
                    onClose();
                    router.push("/auth/register");
                  }}
                  className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Create Account
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

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
          className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto text-gray-900"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Complete Purchase
                </h2>
                <p className="text-gray-600">
                  Choose your payment method to unlock {selectedPackage.name}
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
            {/* Package Summary */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedPackage.name}
                </h3>
                <div className="text-right">
                  <div className="text-3xl font-bold text-purple-600">
                    ${selectedPackage.price}
                  </div>
                  <div className="text-sm text-gray-600">/month</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Monthly Budget:</span>
                  <span className="ml-2 font-semibold">
                    ${selectedPackage.budget}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Duration:</span>
                  <span className="ml-2 font-semibold">
                    {selectedPackage.duration} days
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Select Payment Method
              </h3>

              {loadingMethods ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                  <span className="ml-2 text-gray-600">
                    Loading payment methods...
                  </span>
                </div>
              ) : availableMethods.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    No payment methods available
                  </p>
                  <p className="text-sm text-gray-500">
                    Please configure payment methods in admin settings
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableMethods.map((method) => {
                    const IconComponent =
                      paymentMethodIcons[
                        method.id as keyof typeof paymentMethodIcons
                      ] || CreditCard;
                    const colors =
                      paymentMethodColors[
                        method.id as keyof typeof paymentMethodColors
                      ] || paymentMethodColors.stripe;

                    return (
                      <button
                        key={method.id}
                        onClick={() => setSelectedMethod(method.id)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                          selectedMethod === method.id
                            ? `border-purple-500 ${colors.bgColor}`
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-12 h-12 rounded-lg bg-gradient-to-r ${colors.color} flex items-center justify-center shadow-lg`}
                          >
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <div className="text-left flex-1">
                            <div
                              className={`font-semibold ${colors.textColor}`}
                            >
                              {method.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {method.description}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Fee: {method.processingFee} •{" "}
                              {method.processingTime}
                            </div>
                          </div>
                          {selectedMethod === method.id && (
                            <div className="ml-auto">
                              <Check className="w-5 h-5 text-purple-600" />
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Payment Form */}
            {selectedMethod && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  Payment Details
                </h3>

                {selectedMethod === "stripe" && (
                  <div className="space-y-4">
                    <div className="text-center py-4">
                      <CreditCard className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">
                        Pay with Credit Card, Debit Card, Apple Pay, or Google
                        Pay
                      </p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-blue-700">
                        Secure payment processing powered by Stripe. Your
                        payment information is encrypted and secure.
                      </p>
                    </div>
                  </div>
                )}

                {selectedMethod === "paypal" && (
                  <div className="space-y-4">
                    <div className="text-center py-4">
                      <Wallet className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">
                        Pay with PayPal, Credit Card, or Debit Card
                      </p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <p className="text-sm text-yellow-700">
                        You will be redirected to PayPal to complete your
                        payment securely
                      </p>
                    </div>
                  </div>
                )}

                {selectedMethod === "flutterwave" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        onChange={(e) =>
                          handlePaymentDataChange("email", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+256XXXXXXXXX"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        onChange={(e) =>
                          handlePaymentDataChange("phoneNumber", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-sm text-green-700">
                        You will be redirected to Flutterwave to complete your
                        payment using mobile money, bank transfer, or card
                      </p>
                    </div>
                  </div>
                )}

                {selectedMethod === "nowpayments" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        USDT Network
                      </label>
                      <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        onChange={(e) =>
                          handlePaymentDataChange("network", e.target.value)
                        }
                        required
                      >
                        <option value="">Select USDT Network</option>
                        <option value="tron">
                          Tron (TRC-20) - Recommended
                        </option>
                        <option value="ethereum">Ethereum (ERC-20)</option>
                        <option value="bsc">
                          Binance Smart Chain (BEP-20)
                        </option>
                        <option value="polygon">Polygon (MATIC)</option>
                        <option value="arbitrum">Arbitrum</option>
                        <option value="optimism">Optimism</option>
                      </select>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <h4 className="font-semibold text-purple-900 mb-2">
                        NowPayments Instructions
                      </h4>
                      <div className="space-y-2 text-sm text-purple-700">
                        <p>1. Select your preferred USDT network above</p>
                        <p>2. You will be redirected to NowPayments.io</p>
                        <p>
                          3. Complete the USDT payment on their secure platform
                        </p>
                        <p>4. Payment will be processed automatically</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Amount to Pay:
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          ${selectedPackage.price} USDT
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        *Minimum 3 network confirmations required
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-700">{error}</span>
              </div>
            )}

            {/* Security Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900">Secure Payment</h4>
                <p className="text-sm text-blue-700">
                  Your payment information is encrypted and secure. We never
                  store your payment details.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                disabled={!selectedMethod || loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Complete Purchase</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
