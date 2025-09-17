"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  MapPin,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer,
  Target,
  DollarSign,
  BarChart3,
  PieChart,
  Activity,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Filter,
  Search,
  Download,
  RefreshCw,
  Star,
  Heart,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  ScatterChart,
  Scatter,
} from "recharts";

interface AudienceSectionProps {
  audienceData: any;
  demographics: any[];
  behaviorData: any[];
  locationData: any[];
  isLoading: boolean;
}

export default function AudienceSection({
  audienceData,
  demographics,
  behaviorData,
  locationData,
  isLoading,
}: AudienceSectionProps) {
  const [timeRange, setTimeRange] = useState("7d");
  const [audienceType, setAudienceType] = useState("all");
  const [isLive, setIsLive] = useState(true);

  // Mock data for demonstration
  const mockAudienceData = {
    totalUsers: 125000,
    newUsers: 25000,
    returningUsers: 100000,
    activeUsers: 45000,
    avgSessionDuration: 4.2,
    pagesPerSession: 3.8,
    bounceRate: 35.2,
    conversionRate: 2.8,
    lifetimeValue: 125.5,
  };

  const mockDemographics = [
    { age: "18-24", users: 25000, percentage: 20, color: "#3B82F6" },
    { age: "25-34", users: 45000, percentage: 36, color: "#10B981" },
    { age: "35-44", users: 35000, percentage: 28, color: "#F59E0B" },
    { age: "45-54", users: 15000, percentage: 12, color: "#EF4444" },
    { age: "55+", users: 5000, percentage: 4, color: "#8B5CF6" },
  ];

  const mockGenderData = [
    { gender: "Male", users: 65000, percentage: 52, color: "#3B82F6" },
    { gender: "Female", users: 55000, percentage: 44, color: "#EC4899" },
    { gender: "Other", users: 5000, percentage: 4, color: "#10B981" },
  ];

  const mockLocationData = [
    {
      country: "United States",
      users: 45000,
      percentage: 36,
      color: "#3B82F6",
    },
    { country: "Canada", users: 25000, percentage: 20, color: "#10B981" },
    {
      country: "United Kingdom",
      users: 20000,
      percentage: 16,
      color: "#F59E0B",
    },
    { country: "Germany", users: 15000, percentage: 12, color: "#EF4444" },
    { country: "Australia", users: 10000, percentage: 8, color: "#8B5CF6" },
    { country: "Other", users: 10000, percentage: 8, color: "#6B7280" },
  ];

  const mockBehaviorData = [
    { behavior: "Page Views", value: 450000, change: "+12.5%", trend: "up" },
    { behavior: "Sessions", value: 125000, change: "+8.3%", trend: "up" },
    { behavior: "Bounce Rate", value: 35.2, change: "-2.1%", trend: "down" },
    {
      behavior: "Avg Session Duration",
      value: 4.2,
      change: "+15.7%",
      trend: "up",
    },
    { behavior: "Pages per Session", value: 3.8, change: "+5.2%", trend: "up" },
    { behavior: "Conversion Rate", value: 2.8, change: "+18.9%", trend: "up" },
  ];

  const mockInterestsData = [
    { interest: "Technology", users: 35000, percentage: 28, color: "#3B82F6" },
    { interest: "Fashion", users: 30000, percentage: 24, color: "#EC4899" },
    { interest: "Sports", users: 25000, percentage: 20, color: "#10B981" },
    { interest: "Travel", users: 20000, percentage: 16, color: "#F59E0B" },
    { interest: "Food", users: 15000, percentage: 12, color: "#EF4444" },
  ];

  const mockDeviceData = [
    { device: "Desktop", users: 75000, percentage: 60, color: "#3B82F6" },
    { device: "Mobile", users: 40000, percentage: 32, color: "#10B981" },
    { device: "Tablet", users: 10000, percentage: 8, color: "#F59E0B" },
  ];

  const mockEngagementData = Array.from({ length: 7 }, (_, i) => ({
    day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
    activeUsers: Math.floor(Math.random() * 10000) + 5000,
    newUsers: Math.floor(Math.random() * 5000) + 2000,
    sessions: Math.floor(Math.random() * 8000) + 4000,
  }));

  const audienceCards = [
    {
      title: "Total Users",
      value: mockAudienceData.totalUsers.toLocaleString(),
      change: "+12.5%",
      changeType: "positive",
      icon: <Users className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "New Users",
      value: mockAudienceData.newUsers.toLocaleString(),
      change: "+8.3%",
      changeType: "positive",
      icon: <Star className="w-6 h-6" />,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Returning Users",
      value: mockAudienceData.returningUsers.toLocaleString(),
      change: "+15.7%",
      changeType: "positive",
      icon: <Heart className="w-6 h-6" />,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Active Users",
      value: mockAudienceData.activeUsers.toLocaleString(),
      change: "+22.1%",
      changeType: "positive",
      icon: <Activity className="w-6 h-6" />,
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Avg Session Duration",
      value: `${mockAudienceData.avgSessionDuration}m`,
      change: "+5.2%",
      changeType: "positive",
      icon: <Clock className="w-6 h-6" />,
      color: "from-indigo-500 to-purple-500",
    },
    {
      title: "Pages per Session",
      value: mockAudienceData.pagesPerSession.toString(),
      change: "+18.9%",
      changeType: "positive",
      icon: <Eye className="w-6 h-6" />,
      color: "from-teal-500 to-cyan-500",
    },
    {
      title: "Bounce Rate",
      value: `${mockAudienceData.bounceRate}%`,
      change: "-2.1%",
      changeType: "positive",
      icon: <TrendingDown className="w-6 h-6" />,
      color: "from-pink-500 to-rose-500",
    },
    {
      title: "Lifetime Value",
      value: `$${mockAudienceData.lifetimeValue}`,
      change: "+7.4%",
      changeType: "positive",
      icon: <DollarSign className="w-6 h-6" />,
      color: "from-yellow-500 to-orange-500",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Audience</h2>
          <p className="text-white/70">
            Understand your users and their behavior patterns
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isLive ? "bg-green-400 animate-pulse" : "bg-gray-400"
              }`}
            />
            <span className="text-sm text-white/70">
              {isLive ? "Live" : "Paused"}
            </span>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <select
            value={audienceType}
            onChange={(e) => setAudienceType(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Users</option>
            <option value="new">New Users</option>
            <option value="returning">Returning Users</option>
            <option value="active">Active Users</option>
          </select>
          <button
            onClick={() => setIsLive(!isLive)}
            className={`p-2 rounded-lg transition-all duration-300 ${
              isLive
                ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                : "bg-gray-500/20 text-gray-400 hover:bg-gray-500/30"
            }`}
          >
            <RefreshCw className={`w-5 h-5 ${isLive ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Audience Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {audienceCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`p-3 rounded-lg bg-gradient-to-r ${card.color} group-hover:scale-110 transition-transform duration-300`}
              >
                {card.icon}
              </div>
              <div className="flex items-center space-x-1">
                {card.changeType === "positive" ? (
                  <ArrowUpRight className="w-4 h-4 text-green-400" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-400" />
                )}
                <span
                  className={`text-sm font-medium ${
                    card.changeType === "positive"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {card.change}
                </span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{card.value}</h3>
            <p className="text-white/70 text-sm">{card.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Demographics and Behavior */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Age Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-6">
            Age Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={mockDemographics}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="users"
              >
                {mockDemographics.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "8px",
                  color: "white",
                }}
              />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Gender Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-6">
            Gender Distribution
          </h3>
          <div className="space-y-4">
            {mockGenderData.map((gender, index) => (
              <div
                key={gender.gender}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white font-medium">
                    {gender.gender}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-white/10 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                      style={{ width: `${gender.percentage}%` }}
                    />
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">
                      {gender.users.toLocaleString()}
                    </div>
                    <div className="text-white/70 text-sm">
                      {gender.percentage}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Geographic Distribution and Interests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Geographic Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-6">
            Geographic Distribution
          </h3>
          <div className="space-y-4">
            {mockLocationData.map((location, index) => (
              <div
                key={location.country}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white font-medium">
                    {location.country}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-white/10 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-green-500 to-blue-500"
                      style={{ width: `${location.percentage}%` }}
                    />
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">
                      {location.users.toLocaleString()}
                    </div>
                    <div className="text-white/70 text-sm">
                      {location.percentage}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Interests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-6">User Interests</h3>
          <div className="space-y-4">
            {mockInterestsData.map((interest, index) => (
              <div
                key={interest.interest}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white font-medium">
                    {interest.interest}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-white/10 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                      style={{ width: `${interest.percentage}%` }}
                    />
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">
                      {interest.users.toLocaleString()}
                    </div>
                    <div className="text-white/70 text-sm">
                      {interest.percentage}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Device Usage and Engagement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Device Usage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-6">Device Usage</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={mockDeviceData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.1)"
              />
              <XAxis dataKey="device" stroke="rgba(255,255,255,0.7)" />
              <YAxis stroke="rgba(255,255,255,0.7)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "8px",
                  color: "white",
                }}
              />
              <Bar dataKey="users" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Engagement Over Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-6">
            Engagement Over Time
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={mockEngagementData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.1)"
              />
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.7)" />
              <YAxis stroke="rgba(255,255,255,0.7)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "8px",
                  color: "white",
                }}
              />
              <Line
                type="monotone"
                dataKey="activeUsers"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="newUsers"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Behavior Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-6">Behavior Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockBehaviorData.map((behavior, index) => (
            <div key={behavior.behavior} className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-semibold">
                  {behavior.behavior}
                </h4>
                <div className="flex items-center space-x-1">
                  {behavior.trend === "up" ? (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      behavior.trend === "up"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {behavior.change}
                  </span>
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {typeof behavior.value === "number" && behavior.value > 1000
                  ? behavior.value.toLocaleString()
                  : behavior.value}
                {behavior.behavior === "Avg Session Duration" && "m"}
                {behavior.behavior === "Bounce Rate" && "%"}
                {behavior.behavior === "Conversion Rate" && "%"}
              </div>
              <div className="text-white/70 text-sm">
                {behavior.behavior === "Page Views" && "Total page views"}
                {behavior.behavior === "Sessions" && "Total sessions"}
                {behavior.behavior === "Bounce Rate" &&
                  "Users who left immediately"}
                {behavior.behavior === "Avg Session Duration" &&
                  "Average time on site"}
                {behavior.behavior === "Pages per Session" &&
                  "Pages viewed per session"}
                {behavior.behavior === "Conversion Rate" &&
                  "Users who completed goals"}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

