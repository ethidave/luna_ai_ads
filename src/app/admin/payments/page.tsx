"use client";

import { useState, useEffect } from "react";

// Helper function to safely format amounts
const formatAmount = (amount: any): string => {
  const numAmount =
    typeof amount === "number" ? amount : parseFloat(amount || "0");
  return numAmount.toFixed(2);
};
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  CheckCircle,
  X,
  AlertTriangle,
  Clock,
  DollarSign,
  Users,
  Calendar,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  LineChart,
  Settings,
  Activity,
  FileText,
  MessageCircle,
  Bell,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Bookmark,
  Tag,
  Archive,
  Folder,
  Image,
  Video,
  Camera,
  Mic,
  Volume2,
  Play,
  Pause,
  Square,
  SkipForward,
  SkipBack,
  RotateCcw,
  Maximize,
  Minimize,
  ExternalLink,
  Copy,
  Share,
  Lock,
  Unlock,
  Key,
  Database,
  Server,
  Cpu,
  HardDrive,
  Wifi,
  Monitor,
  Smartphone,
  Tablet,
  Layers,
  BarChart,
  SortAsc,
  SortDesc,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  MapPin,
  Timer,
  Stopwatch,
  VolumeX,
  MicOff,
  CameraOff,
  VideoOff,
  File,
  FolderOpen,
  BookmarkCheck,
  BookmarkX,
  Star,
  Heart as HeartIcon,
  ThumbsUp as ThumbsUpIcon,
  ThumbsDown as ThumbsDownIcon,
  MessageCircle as MessageCircleIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MapPin as MapPinIcon,
  Clock3,
  Timer as TimerIcon,
  Stopwatch as StopwatchIcon,
  MoreVertical,
} from "lucide-react";
import PaymentModal from "@/components/admin/PaymentModal";

interface Payment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  currency: string;
  status: "completed" | "pending" | "failed" | "refunded" | "cancelled";
  paymentMethod: "stripe" | "paypal" | "flutterwave" | "bank_transfer";
  transactionId: string;
  description: string;
  plan: string;
  createdAt: string;
  updatedAt: string;
  processedAt?: string;
  refundedAt?: string;
  refundAmount?: number;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/payments");
        if (response.ok) {
          const data = await response.json();
          setPayments(data.payments || []);
          console.log(
            `Successfully loaded ${data.payments?.length || 0} payments`
          );
        } else {
          const errorData = await response.json();
          console.error("Failed to fetch payments:", errorData);
          setPayments([]);
        }
      } catch (error) {
        console.error("Error fetching payments:", error);
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | undefined>();

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || payment.status === statusFilter;
    const matchesMethod =
      paymentMethodFilter === "all" ||
      payment.paymentMethod === paymentMethodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const handleEditPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowModal(true);
  };

  const handleUpdatePayment = (paymentData: Payment) => {
    setPayments(
      payments.map((payment) =>
        payment.id === paymentData.id ? paymentData : payment
      )
    );
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

  const totalRevenue = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + parseFloat(formatAmount(p.amount)), 0);

  const totalRefunds = payments
    .filter((p) => p.status === "refunded")
    .reduce((sum, p) => sum + parseFloat(formatAmount(p.refundAmount)), 0);

  const netRevenue = totalRevenue - totalRefunds;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-white/70">Loading payments...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Payment Management
          </h1>
          <p className="text-white/70">
            Monitor and manage payment transactions
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

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

      {/* Payments Table */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-white font-medium">
                  User
                </th>
                <th className="px-6 py-4 text-left text-white font-medium">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-white font-medium">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-white font-medium">
                  Method
                </th>
                <th className="px-6 py-4 text-left text-white font-medium">
                  Plan
                </th>
                <th className="px-6 py-4 text-left text-white font-medium">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-white font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredPayments.map((payment) => {
                const StatusIcon = getStatusIcon(payment.status);
                const MethodIcon = getPaymentMethodIcon(payment.paymentMethod);
                return (
                  <motion.tr
                    key={payment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="hover:bg-white/5 transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-white font-medium">
                          {payment.userName}
                        </div>
                        <div className="text-white/70 text-sm">
                          {payment.userEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">
                        ${formatAmount(payment.amount)}{" "}
                        {payment.currency || "USD"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
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
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <MethodIcon className="w-4 h-4 text-white/70" />
                        <span className="text-white capitalize">
                          {payment.paymentMethod.replace("_", " ")}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white">{payment.plan}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-white text-sm">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-white/70 text-xs">
                          {new Date(payment.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditPayment(payment)}
                          className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all duration-300"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300">
                          <MoreVertical className="w-4 h-4" />
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

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        payment={selectedPayment}
        onUpdate={handleUpdatePayment}
      />
    </div>
  );
}
