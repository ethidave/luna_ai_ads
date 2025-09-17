"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Smartphone,
  Globe,
  Search,
  Filter,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";
import {
  PaymentMethodCard,
  PaymentMethod,
  paymentMethods,
} from "./PaymentMethodCard";

interface PaymentSelectorProps {
  amount: number;
  currency?: string;
  onPaymentMethodSelect: (method: PaymentMethod) => void;
  selectedMethodId?: string;
  className?: string;
}

export const PaymentSelector: React.FC<PaymentSelectorProps> = ({
  amount,
  currency = "USD",
  onPaymentMethodSelect,
  selectedMethodId,
  className = "",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<
    "all" | "crypto" | "fiat" | "mobile"
  >("all");
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null
  );

  // Filter methods based on search and type
  const filteredMethods = paymentMethods.filter((method) => {
    const matchesSearch =
      method.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      method.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || method.type === filterType;
    return matchesSearch && matchesType;
  });

  // Handle method selection
  const handleMethodSelect = (methodId: string) => {
    const method = paymentMethods.find((m) => m.id === methodId);
    if (method) {
      setSelectedMethod(method);
      onPaymentMethodSelect(method);
    }
  };

  // Set initial selection
  useEffect(() => {
    if (selectedMethodId) {
      const method = paymentMethods.find((m) => m.id === selectedMethodId);
      if (method) {
        setSelectedMethod(method);
      }
    }
  }, [selectedMethodId]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "crypto":
        return <Globe className="w-4 h-4" />;
      case "fiat":
        return <CreditCard className="w-4 h-4" />;
      case "mobile":
        return <Smartphone className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "crypto":
        return "from-green-500 to-emerald-600";
      case "fiat":
        return "from-blue-500 to-indigo-600";
      case "mobile":
        return "from-purple-500 to-pink-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-xl border border-gray-200 ${className}`}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Choose Payment Method
          </h2>
          <div className="text-sm text-gray-500">
            Amount:{" "}
            <span className="font-semibold text-gray-900">
              {amount.toLocaleString()} {currency}
            </span>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search payment methods..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
          </div>

          <div className="flex gap-2">
            {(["all", "crypto", "fiat", "mobile"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                  filterType === type
                    ? `bg-gradient-to-r ${getTypeColor(
                        type
                      )} text-white shadow-lg`
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {getTypeIcon(type)}
                <span className="capitalize">{type}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Methods Grid */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {filteredMethods.length > 0 ? (
            <motion.div
              key={`${filterType}-${searchTerm}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredMethods.map((method, index) => (
                <motion.div
                  key={method.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <PaymentMethodCard
                    method={method}
                    isSelected={selectedMethod?.id === method.id}
                    onSelect={handleMethodSelect}
                    amount={amount}
                    currency={currency}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No payment methods found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Selected Method Summary */}
      {selectedMethod && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 border-t border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-r ${selectedMethod.gradient} flex items-center justify-center text-white shadow-lg`}
              >
                {selectedMethod.type === "crypto" ? (
                  <Globe className="w-6 h-6" />
                ) : selectedMethod.type === "fiat" ? (
                  <CreditCard className="w-6 h-6" />
                ) : (
                  <Smartphone className="w-6 h-6" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {selectedMethod.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedMethod.description}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-sm text-gray-500">Total Amount</div>
                <div className="text-xl font-bold text-gray-900">
                  {amount.toLocaleString()} {currency}
                </div>
                <div className="text-xs text-gray-500">
                  Fees: {selectedMethod.fees} • {selectedMethod.processingTime}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Payment Security Info */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-500 mt-0.5" />
          <div className="text-sm text-gray-600">
            <p className="font-medium text-gray-900 mb-1">
              Secure Payment Processing
            </p>
            <p>
              All payments are processed securely using industry-standard
              encryption. Your payment information is never stored on our
              servers. We support PCI DSS compliance and use advanced fraud
              detection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};


