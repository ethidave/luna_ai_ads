"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowRight,
  CreditCard,
  Smartphone,
  Globe,
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff,
  Settings,
  History,
  Download,
  Filter,
  Search,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Coins,
  Zap,
} from "lucide-react";
import { AuthGuard } from "@/components/AuthGuard";
import { PaymentSelector } from "@/components/PaymentSelector";
import { PaymentMethod } from "@/components/PaymentMethodCard";
import { useAuth } from "@/contexts/AuthContext";

interface WalletBalance {
  usdt: number;
  bnb: number;
  eth: number;
  stripe: number;
  paypal: number;
  flutterwave: number;
  totalUSD: number;
}

interface Transaction {
  id: string;
  type: "deposit" | "withdrawal" | "payment" | "refund";
  method: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed";
  description: string;
  timestamp: Date;
  hash?: string;
}

export default function WalletPage() {
  const { user } = useAuth();
  const [balance, setBalance] = useState<WalletBalance>({
    usdt: 1250.5,
    bnb: 2.5,
    eth: 0.8,
    stripe: 500.0,
    paypal: 750.0,
    flutterwave: 300.0,
    totalUSD: 2801.3,
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showBalances, setShowBalances] = useState(true);
  const [selectedTab, setSelectedTab] = useState<
    "overview" | "deposit" | "withdraw" | "history"
  >("overview");
  const [depositAmount, setDepositAmount] = useState(100);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulate loading transactions
    setTransactions([
      {
        id: "1",
        type: "deposit",
        method: "USDT",
        amount: 500,
        currency: "USDT",
        status: "completed",
        description: "Deposit via USDT (TRC-20)",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        hash: "0x1234...5678",
      },
      {
        id: "2",
        type: "payment",
        method: "Stripe",
        amount: 150,
        currency: "USD",
        status: "completed",
        description: "Campaign payment - Summer Sale",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      },
      {
        id: "3",
        type: "deposit",
        method: "PayPal",
        amount: 200,
        currency: "USD",
        status: "completed",
        description: "PayPal deposit",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
      {
        id: "4",
        type: "deposit",
        method: "BNB",
        amount: 1.5,
        currency: "BNB",
        status: "pending",
        description: "Deposit via BNB (BSC)",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        hash: "0xabcd...efgh",
      },
    ]);
  }, []);

  const handleDeposit = async () => {
    if (!selectedPaymentMethod) return;

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Handle successful deposit
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDownLeft className="w-4 h-4 text-green-500" />;
      case "withdrawal":
        return <ArrowUpRight className="w-4 h-4 text-red-500" />;
      case "payment":
        return <CreditCard className="w-4 h-4 text-blue-500" />;
      case "refund":
        return <RefreshCw className="w-4 h-4 text-purple-500" />;
      default:
        return <DollarSign className="w-4 h-4 text-gray-500" />;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case "usdt":
      case "bnb":
      case "eth":
        return <Globe className="w-4 h-4" />;
      case "stripe":
        return <CreditCard className="w-4 h-4" />;
      case "paypal":
        return <Smartphone className="w-4 h-4" />;
      case "flutterwave":
        return <Zap className="w-4 h-4" />;
      default:
        return <Coins className="w-4 h-4" />;
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Wallet className="w-8 h-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Wallet</h1>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowBalances(!showBalances)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                >
                  {showBalances ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                  <span>{showBalances ? "Hide" : "Show"} Balances</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Balance Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 rounded-2xl p-8 text-white mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Total Balance</h2>
                <p className="text-blue-100">All payment methods combined</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold">
                  {showBalances
                    ? `$${balance.totalUSD.toLocaleString()}`
                    : "••••••"}
                </div>
                <div className="text-blue-100">USD Equivalent</div>
              </div>
            </div>

            {/* Individual Balances */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                {
                  name: "USDT",
                  amount: balance.usdt,
                  icon: "₮",
                  color: "from-green-500 to-emerald-600",
                },
                {
                  name: "BNB",
                  amount: balance.bnb,
                  icon: "B",
                  color: "from-yellow-500 to-orange-600",
                },
                {
                  name: "ETH",
                  amount: balance.eth,
                  icon: "Ξ",
                  color: "from-blue-500 to-indigo-600",
                },
                {
                  name: "Stripe",
                  amount: balance.stripe,
                  icon: "💳",
                  color: "from-purple-500 to-pink-600",
                },
                {
                  name: "PayPal",
                  amount: balance.paypal,
                  icon: "P",
                  color: "from-blue-600 to-cyan-600",
                },
                {
                  name: "Flutterwave",
                  amount: balance.flutterwave,
                  icon: "F",
                  color: "from-green-600 to-teal-600",
                },
              ].map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center"
                >
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <div className="text-sm text-blue-100 mb-1">{item.name}</div>
                  <div className="font-bold">
                    {showBalances ? item.amount.toLocaleString() : "••••"}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-8">
            {[
              { id: "overview", label: "Overview", icon: TrendingUp },
              { id: "deposit", label: "Deposit", icon: Plus },
              { id: "withdraw", label: "Withdraw", icon: ArrowUpRight },
              { id: "history", label: "History", icon: History },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  selectedTab === tab.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {selectedTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              >
                {/* Recent Transactions */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Recent Transactions
                      </h3>
                      <button className="text-blue-600 hover:text-blue-500 text-sm font-medium">
                        View All
                      </button>
                    </div>

                    <div className="space-y-4">
                      {transactions.slice(0, 5).map((transaction) => (
                        <motion.div
                          key={transaction.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                              {getTypeIcon(transaction.type)}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {transaction.description}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center space-x-2">
                                {getMethodIcon(transaction.method)}
                                <span>{transaction.method}</span>
                                <span>•</span>
                                <span>
                                  {transaction.timestamp.toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div
                              className={`font-semibold ${
                                transaction.type === "deposit"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {transaction.type === "deposit" ? "+" : "-"}
                              {showBalances
                                ? transaction.amount.toLocaleString()
                                : "••••"}{" "}
                              {transaction.currency}
                            </div>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(transaction.status)}
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                                  transaction.status
                                )}`}
                              >
                                {transaction.status}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Quick Actions
                    </h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => setSelectedTab("deposit")}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                      >
                        <Plus className="w-5 h-5" />
                        <span>Add Funds</span>
                      </button>
                      <button
                        onClick={() => setSelectedTab("withdraw")}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                      >
                        <ArrowUpRight className="w-5 h-5" />
                        <span>Withdraw</span>
                      </button>
                      <button className="w-full border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:border-gray-400 transition-all duration-300 flex items-center justify-center space-x-2">
                        <Download className="w-5 h-5" />
                        <span>Export</span>
                      </button>
                    </div>
                  </div>

                  {/* Payment Methods Status */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Payment Methods
                    </h3>
                    <div className="space-y-3">
                      {[
                        {
                          name: "USDT (TRC-20)",
                          status: "active",
                          balance: balance.usdt,
                        },
                        {
                          name: "BNB (BSC)",
                          status: "active",
                          balance: balance.bnb,
                        },
                        {
                          name: "Ethereum",
                          status: "active",
                          balance: balance.eth,
                        },
                        {
                          name: "Stripe",
                          status: "active",
                          balance: balance.stripe,
                        },
                        {
                          name: "PayPal",
                          status: "active",
                          balance: balance.paypal,
                        },
                        {
                          name: "Flutterwave",
                          status: "active",
                          balance: balance.flutterwave,
                        },
                      ].map((method) => (
                        <div
                          key={method.name}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                method.status === "active"
                                  ? "bg-green-500"
                                  : "bg-gray-400"
                              }`}
                            ></div>
                            <span className="text-sm text-gray-700">
                              {method.name}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {showBalances
                              ? `$${method.balance.toLocaleString()}`
                              : "••••"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {selectedTab === "deposit" && (
              <motion.div
                key="deposit"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto"
              >
                <PaymentSelector
                  amount={depositAmount}
                  currency="USD"
                  onPaymentMethodSelect={setSelectedPaymentMethod}
                  selectedMethodId={selectedPaymentMethod?.id}
                />

                {selectedPaymentMethod && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Deposit Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Amount
                        </label>
                        <input
                          type="number"
                          value={depositAmount}
                          onChange={(e) =>
                            setDepositAmount(Number(e.target.value))
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min="1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Payment Method
                        </label>
                        <div className="px-4 py-3 bg-gray-50 rounded-xl">
                          {selectedPaymentMethod.name}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={handleDeposit}
                        disabled={loading}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        {loading ? (
                          <>
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <span>Proceed to Payment</span>
                            <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {selectedTab === "history" && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Transaction History
                  </h3>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search transactions..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                      <Filter className="w-5 h-5" />
                      <span>Filter</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          {getTypeIcon(transaction.type)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {transaction.description}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center space-x-2">
                            {getMethodIcon(transaction.method)}
                            <span>{transaction.method}</span>
                            <span>•</span>
                            <span>
                              {transaction.timestamp.toLocaleString()}
                            </span>
                            {transaction.hash && (
                              <>
                                <span>•</span>
                                <span className="font-mono text-xs">
                                  {transaction.hash}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div
                          className={`font-semibold ${
                            transaction.type === "deposit"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.type === "deposit" ? "+" : "-"}
                          {showBalances
                            ? transaction.amount.toLocaleString()
                            : "••••"}{" "}
                          {transaction.currency}
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(transaction.status)}
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                              transaction.status
                            )}`}
                          >
                            {transaction.status}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AuthGuard>
  );
}
