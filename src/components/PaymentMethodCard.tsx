"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  CreditCard,
  Smartphone,
  Globe,
  Shield,
  Zap,
  Check,
  ArrowRight,
  Info,
} from "lucide-react";

export interface PaymentMethod {
  id: string;
  name: string;
  type: "crypto" | "fiat" | "mobile";
  icon: string;
  color: string;
  gradient: string;
  description: string;
  features: string[];
  fees: string;
  processingTime: string;
  minAmount?: number;
  maxAmount?: number;
  supportedCurrencies: string[];
  isPopular?: boolean;
  isRecommended?: boolean;
}

interface PaymentMethodCardProps {
  method: PaymentMethod;
  isSelected: boolean;
  onSelect: (methodId: string) => void;
  amount?: number;
  currency?: string;
}

export const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  method,
  isSelected,
  onSelect,
  amount,
  currency = "USD",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getIcon = () => {
    switch (method.type) {
      case "crypto":
        return <Globe className="w-8 h-8" />;
      case "fiat":
        return <CreditCard className="w-8 h-8" />;
      case "mobile":
        return <Smartphone className="w-8 h-8" />;
      default:
        return <CreditCard className="w-8 h-8" />;
    }
  };

  const getTypeIcon = () => {
    switch (method.type) {
      case "crypto":
        return "₿";
      case "fiat":
        return "💳";
      case "mobile":
        return "📱";
      default:
        return "💳";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onSelect(method.id)}
      className={`relative cursor-pointer transition-all duration-300 ${
        isSelected ? "ring-2 ring-blue-500 shadow-2xl" : "hover:shadow-xl"
      }`}
    >
      {/* Popular Badge */}
      {method.isPopular && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-3 -right-3 z-10"
        >
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            🔥 Popular
          </div>
        </motion.div>
      )}

      {/* Recommended Badge */}
      {method.isRecommended && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-3 -left-3 z-10"
        >
          <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            ⭐ Recommended
          </div>
        </motion.div>
      )}

      <div
        className={`bg-white rounded-2xl p-6 border-2 transition-all duration-300 ${
          isSelected
            ? "border-blue-500 bg-blue-50"
            : "border-gray-200 hover:border-gray-300"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{
                scale: isHovered ? 1.1 : 1,
                rotate: isHovered ? 5 : 0,
              }}
              className={`w-12 h-12 rounded-xl bg-gradient-to-r ${method.gradient} flex items-center justify-center text-white shadow-lg`}
            >
              {getIcon()}
            </motion.div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{method.name}</h3>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{getTypeIcon()}</span>
                <span className="text-sm text-gray-500 capitalize">
                  {method.type}
                </span>
              </div>
            </div>
          </div>

          {/* Selection Indicator */}
          <motion.div
            animate={{ scale: isSelected ? 1 : 0 }}
            className={`w-6 h-6 rounded-full flex items-center justify-center ${
              isSelected ? "bg-blue-500" : "bg-gray-200"
            }`}
          >
            {isSelected && <Check className="w-4 h-4 text-white" />}
          </motion.div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          {method.description}
        </p>

        {/* Features */}
        <div className="space-y-2 mb-4">
          {method.features.slice(0, 3).map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-2 text-sm text-gray-600"
            >
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span>{feature}</span>
            </motion.div>
          ))}
        </div>

        {/* Payment Info */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-gray-500 mb-1">Fees</div>
            <div className="font-semibold text-gray-900">{method.fees}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-gray-500 mb-1">Processing</div>
            <div className="font-semibold text-gray-900">
              {method.processingTime}
            </div>
          </div>
        </div>

        {/* Amount Display */}
        {amount && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 mb-4"
          >
            <div className="text-sm text-gray-600 mb-1">You&apos;ll pay</div>
            <div className="text-xl font-bold text-gray-900">
              {amount.toLocaleString()} {currency}
            </div>
          </motion.div>
        )}

        {/* Supported Currencies */}
        <div className="mb-4">
          <div className="text-xs text-gray-500 mb-2">Supported currencies</div>
          <div className="flex flex-wrap gap-1">
            {method.supportedCurrencies.slice(0, 4).map((curr, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                {curr}
              </span>
            ))}
            {method.supportedCurrencies.length > 4 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{method.supportedCurrencies.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
            isSelected
              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <span>{isSelected ? "Selected" : "Select Method"}</span>
          {isSelected && <Check className="w-4 h-4" />}
          {!isSelected && <ArrowRight className="w-4 h-4" />}
        </motion.button>

        {/* Security Badge */}
        <div className="flex items-center justify-center space-x-2 mt-4 text-xs text-gray-500">
          <Shield className="w-3 h-3" />
          <span>Bank-level security</span>
        </div>
      </div>
    </motion.div>
  );
};

// Payment Methods Data
export const paymentMethods: PaymentMethod[] = [
  {
    id: "usdt",
    name: "USDT (TRC-20)",
    type: "crypto",
    icon: "₮",
    color: "green",
    gradient: "from-green-500 to-emerald-600",
    description:
      "Fast and low-cost cryptocurrency payments using Tether on the Tron network.",
    features: [
      "Low transaction fees",
      "Fast confirmation times",
      "Global accessibility",
      "No chargebacks",
    ],
    fees: "0.1%",
    processingTime: "2-5 minutes",
    minAmount: 10,
    maxAmount: 10000,
    supportedCurrencies: ["USDT"],
    isRecommended: true,
  },
  {
    id: "bnb",
    name: "BNB (BSC)",
    type: "crypto",
    icon: "B",
    color: "yellow",
    gradient: "from-yellow-500 to-orange-600",
    description:
      "Binance Coin payments on the Binance Smart Chain for ultra-fast transactions.",
    features: [
      "Ultra-low fees",
      "Instant confirmation",
      "DeFi integration",
      "High liquidity",
    ],
    fees: "0.05%",
    processingTime: "1-3 minutes",
    minAmount: 0.01,
    maxAmount: 1000,
    supportedCurrencies: ["BNB"],
    isPopular: true,
  },
  {
    id: "eth",
    name: "Ethereum",
    type: "crypto",
    icon: "Ξ",
    color: "blue",
    gradient: "from-blue-500 to-indigo-600",
    description:
      "Ethereum payments with smart contract integration and DeFi compatibility.",
    features: [
      "Smart contracts",
      "DeFi ecosystem",
      "High security",
      "Wide adoption",
    ],
    fees: "0.2%",
    processingTime: "3-10 minutes",
    minAmount: 0.001,
    maxAmount: 100,
    supportedCurrencies: ["ETH"],
  },
  {
    id: "stripe",
    name: "Stripe",
    type: "fiat",
    icon: "💳",
    color: "purple",
    gradient: "from-purple-500 to-pink-600",
    description:
      "Accept payments from all major credit cards, debit cards, and digital wallets.",
    features: [
      "All major cards",
      "Apple Pay & Google Pay",
      "Fraud protection",
      "Global reach",
    ],
    fees: "2.9% + $0.30",
    processingTime: "Instant",
    minAmount: 1,
    maxAmount: 50000,
    supportedCurrencies: ["USD", "EUR", "GBP", "CAD", "AUD"],
    isPopular: true,
  },
  {
    id: "paypal",
    name: "PayPal",
    type: "fiat",
    icon: "P",
    color: "blue",
    gradient: "from-blue-600 to-cyan-600",
    description:
      "Pay with your PayPal account, credit card, or bank account securely.",
    features: [
      "PayPal balance",
      "Credit/debit cards",
      "Buyer protection",
      "Mobile payments",
    ],
    fees: "2.9% + $0.30",
    processingTime: "Instant",
    minAmount: 1,
    maxAmount: 25000,
    supportedCurrencies: ["USD", "EUR", "GBP", "CAD", "AUD", "JPY"],
  },
  {
    id: "flutterwave",
    name: "Flutterwave",
    type: "mobile",
    icon: "F",
    color: "green",
    gradient: "from-green-600 to-teal-600",
    description:
      "African-focused payment gateway supporting mobile money and local payment methods.",
    features: [
      "Mobile money",
      "Local bank transfers",
      "African markets",
      "Multi-currency",
    ],
    fees: "1.4% - 3.8%",
    processingTime: "Instant",
    minAmount: 1,
    maxAmount: 10000,
    supportedCurrencies: ["USD", "NGN", "GHS", "KES", "ZAR", "EGP"],
  },
];
