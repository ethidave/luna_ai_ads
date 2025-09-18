"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Search,
  Download,
  RefreshCw,
  Eye,
  CheckCircle,
  X,
  AlertTriangle,
  Clock,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  RotateCcw,
  MoreVertical,
  Database,
} from "lucide-react";
import PaymentModal from "@/components/admin/PaymentModal";
import { useAdminApi } from "@/hooks/useAdminApi";
import { AdminPayment } from "@/lib/services/adminApiService";
import {
  AdminErrorBoundary,
  ErrorMessage,
  NoDataMessage,
  LoadingSpinner,
} from "@/components/admin/ErrorBoundary";

// Helper function to safely format amounts
const formatAmount = (amount: any): string => {
  const numAmount =
    typeof amount === "number" ? amount : parseFloat(amount || "0");
  return numAmount.toFixed(2);
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [paymentStats, setPaymentStats] = useState<any>(null);
  const [success, setSuccess] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  // Ensure payments is always an array
  const safePayments = Array.isArray(payments) ? payments : [];

  const {
    loading,
    error,
    getPayments,
    getPaymentStats,
    updatePayment,
    refundPayment,
    deletePayment,
    clearError,
  } = useAdminApi();

  // Fetch payments from database
  const fetchPayments = async () => {
    const data = await getPayments();
    console.log(
      "Payments API response:",
      data,
      "Type:",
      typeof data,
      "Is Array:",
      Array.isArray(data)
    );

    if (data) {
      // Ensure data is an array
      const paymentsArray = Array.isArray(data) ? data : [];
      setPayments(paymentsArray);
      setSuccess(`Successfully loaded ${paymentsArray.length} payments`);
      setTimeout(() => setSuccess(""), 3000);
    } else {
      // If no data returned, set empty array
      setPayments([]);
    }
  };

  // Fetch payment statistics
  const fetchPaymentStats = async () => {
    const stats = await getPaymentStats("30d");
    if (stats) {
      setPaymentStats(stats);
    }
  };

  useEffect(() => {
    fetchPayments();
    fetchPaymentStats();
  }, []);

  // Filter and sort payments - use safe payments array
  const filteredPayments = safePayments.filter((payment) => {
    const matchesSearch =
      payment.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.transaction_id?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || payment.status === statusFilter;
    const matchesMethod =
      paymentMethodFilter === "all" ||
      payment.payment_method === paymentMethodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  // CRUD Operations
  const handleUpdatePayment = async (paymentId: number, paymentData: any) => {
    const updatedPayment = await updatePayment(paymentId, paymentData);
    if (updatedPayment) {
      setPayments(
        safePayments.map((payment) =>
          payment.id === paymentId ? updatedPayment : payment
        )
      );
      setSuccess("Payment updated successfully");
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const handleRefundPayment = async (paymentId: number, refundData: any) => {
    const refundedPayment = await refundPayment(paymentId, refundData);
    if (refundedPayment) {
      setPayments(
        safePayments.map((payment) =>
          payment.id === paymentId ? refundedPayment : payment
        )
      );
      setSuccess("Payment refunded successfully");
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const handleDeletePayment = async (paymentId: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this payment? This action cannot be undone."
      )
    ) {
      return;
    }

    const success = await deletePayment(paymentId);
    if (success) {
      setPayments(safePayments.filter((payment) => payment.id !== paymentId));
      setSuccess("Payment deleted successfully");
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  // UI Handlers
  const handleEditPayment = (payment: AdminPayment) => {
    // Convert AdminPayment to PaymentData format
    const paymentData = {
      id: payment.id.toString(),
      user: payment.user.name,
      amount: payment.amount,
      status: payment.status as "completed" | "pending" | "failed" | "refunded",
      paymentMethod: payment.payment_method as
        | "stripe"
        | "paypal"
        | "bank_transfer"
        | "crypto",
      plan: "Premium", // Default value since AdminPayment doesn't have plan
      transactionId: payment.transaction_id,
      date: new Date(payment.created_at).toISOString().split("T")[0],
      description: payment.description || "",
      refundAmount: payment.refund_amount,
      refundReason: payment.refund_reason,
      createdAt: payment.created_at,
      updatedAt: payment.updated_at,
    };
    setSelectedPayment(paymentData);
    setShowModal(true);
  };

  const handleSavePayment = (paymentData: any) => {
    if (selectedPayment) {
      // Convert back to AdminPayment format for API call
      const adminPaymentData = {
        amount: paymentData.amount,
        status: paymentData.status,
        payment_method: paymentData.paymentMethod,
        transaction_id: paymentData.transactionId,
        description: paymentData.description,
        refund_amount: paymentData.refundAmount,
        refund_reason: paymentData.refundReason,
      };
      handleUpdatePayment(parseInt(selectedPayment.id), adminPaymentData);
    }
    // Note: Create payment functionality not available in current API
    setShowModal(false);
    setSelectedPayment(null);
  };

  const handleRefresh = () => {
    fetchPayments();
    fetchPaymentStats();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-400 bg-green-500/10 border-green-500/20";
      case "pending":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
      case "failed":
        return "text-red-400 bg-red-500/10 border-red-500/20";
      case "refunded":
        return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      case "cancelled":
        return "text-gray-400 bg-gray-500/10 border-gray-500/20";
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return CheckCircle;
      case "pending":
        return Clock;
      case "failed":
        return X;
      case "refunded":
        return RotateCcw;
      case "cancelled":
        return X;
      default:
        return AlertTriangle;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "stripe":
        return CreditCard;
      case "paypal":
        return CreditCard;
      case "flutterwave":
        return CreditCard;
      case "bank_transfer":
        return Database;
      default:
        return CreditCard;
    }
  };

  // Calculate revenue from payments or use stats - use safe payments array
  const totalRevenue =
    paymentStats?.total_revenue ||
    safePayments
      .filter((p) => p.status === "completed")
      .reduce((sum, p) => sum + parseFloat(formatAmount(p.amount)), 0);

  const totalRefunds =
    paymentStats?.refunded_amount ||
    safePayments
      .filter((p) => p.status === "refunded")
      .reduce(
        (sum, p) => sum + parseFloat(formatAmount(p.refund_amount || 0)),
        0
      );

  const netRevenue = totalRevenue - totalRefunds;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-gray-600">Loading payments...</span>
      </div>
    );
  }

  return (
    <AdminErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Payment Management
            </h1>
            <p className="text-white/70">
              Monitor and manage payment transactions
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300 flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300 flex items-center space-x-2 disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-green-400">{success}</span>
            <button
              onClick={() => setSuccess("")}
              className="ml-auto text-green-400 hover:text-green-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Error Message */}
        <ErrorMessage error={error} onRetry={handleRefresh} />

        {/* Revenue Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-green-500/10 border border-green-500/20 rounded-xl backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">
                $
                {totalRevenue.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h3>
              <p className="text-white/70 text-sm">Total Revenue</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-xl backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <RotateCcw className="w-6 h-6 text-blue-400" />
              </div>
              <TrendingDown className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">
                $
                {totalRefunds.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h3>
              <p className="text-white/70 text-sm">Total Refunds</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-purple-500/10 border border-purple-500/20 rounded-xl backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-400" />
              </div>
              <TrendingUp className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">
                $
                {netRevenue.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h3>
              <p className="text-white/70 text-sm">Net Revenue</p>
            </div>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
              <input
                type="text"
                placeholder="Search payments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={paymentMethodFilter}
              onChange={(e) => setPaymentMethodFilter(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Methods</option>
              <option value="stripe">Stripe</option>
              <option value="paypal">PayPal</option>
              <option value="flutterwave">Flutterwave</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
            <div className="flex items-center space-x-2">
              <button className="p-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300">
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* No Data State */}
        {!loading && !error && filteredPayments.length === 0 && (
          <NoDataMessage
            title={
              searchQuery ||
              statusFilter !== "all" ||
              paymentMethodFilter !== "all"
                ? "No payments found"
                : "No payments available"
            }
            description={
              searchQuery ||
              statusFilter !== "all" ||
              paymentMethodFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "There are no payment transactions in the database yet."
            }
            action={
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleRefresh}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Refresh
                </button>
              </div>
            }
          />
        )}

        {/* Payments Table */}
        {filteredPayments.length > 0 && (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-4 sm:px-6 py-4 text-left text-white font-medium">
                      User
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-white font-medium">
                      Amount
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-white font-medium">
                      Status
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-white font-medium">
                      Method
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-white font-medium">
                      Date
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-white font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredPayments.map((payment) => {
                    const StatusIcon = getStatusIcon(payment.status);
                    const MethodIcon = getPaymentMethodIcon(
                      payment.payment_method
                    );
                    return (
                      <motion.tr
                        key={payment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="hover:bg-white/5 transition-colors duration-200"
                      >
                        <td className="px-4 sm:px-6 py-4">
                          <div>
                            <div className="text-white font-medium">
                              {payment.user?.name || "Unknown User"}
                            </div>
                            <div className="text-white/70 text-sm">
                              {payment.user?.email || payment.transaction_id}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <div className="text-white font-medium">
                            ${formatAmount(payment.amount)}
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <StatusIcon className="w-4 h-4" />
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                                payment.status
                              )}`}
                            >
                              {payment.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <MethodIcon className="w-4 h-4 text-white/70" />
                            <span className="text-white capitalize">
                              {payment.payment_method?.replace("_", " ") ||
                                "Unknown"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <div>
                            <div className="text-white text-sm">
                              {new Date(
                                payment.created_at
                              ).toLocaleDateString()}
                            </div>
                            <div className="text-white/70 text-xs">
                              {new Date(
                                payment.created_at
                              ).toLocaleTimeString()}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditPayment(payment)}
                              className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all duration-300"
                              title="View Payment"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {payment.status === "completed" && (
                              <button
                                onClick={() =>
                                  handleRefundPayment(payment.id, {
                                    refund_amount: payment.amount,
                                    reason: "Admin refund",
                                    refund_method: "original",
                                  })
                                }
                                className="p-2 text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 rounded-lg transition-all duration-300"
                                title="Refund Payment"
                              >
                                <RotateCcw className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeletePayment(payment.id)}
                              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-300"
                              title="Delete Payment"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Payment Modal */}
        <PaymentModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          paymentData={selectedPayment}
          mode={selectedPayment ? "edit" : "create"}
          onSave={handleSavePayment}
        />
      </div>
    </AdminErrorBoundary>
  );
}
