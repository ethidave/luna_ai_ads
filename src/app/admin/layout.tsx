"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  Menu,
  X,
  Home,
  Users,
  Package,
  BarChart3,
  Settings,
  Shield,
  CreditCard,
  Target,
  FileText,
  Search,
  LogOut,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  User,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  {
    id: "dashboard",
    name: "Dashboard",
    icon: Home,
    href: "/admin",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  {
    id: "users",
    name: "Users",
    icon: Users,
    href: "/admin/users",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
  },
  {
    id: "packages",
    name: "Packages",
    icon: Package,
    href: "/admin/packages",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
  },
  {
    id: "campaigns",
    name: "Campaigns",
    icon: Target,
    href: "/admin/campaigns",
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
  },
  {
    id: "analytics",
    name: "Analytics",
    icon: BarChart3,
    href: "/admin/analytics",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/20",
  },
  {
    id: "payments",
    name: "Payments",
    icon: CreditCard,
    href: "/admin/payments",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20",
  },
  {
    id: "reports",
    name: "Reports",
    icon: FileText,
    href: "/admin/reports",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
  },
  {
    id: "settings",
    name: "Settings",
    icon: Settings,
    href: "/admin/settings",
    color: "text-gray-400",
    bgColor: "bg-gray-500/10",
    borderColor: "border-gray-500/20",
  },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Determine active item based on current pathname
  const getActiveItem = () => {
    if (pathname === "/admin") return "dashboard";
    if (pathname.startsWith("/admin/users")) return "users";
    if (pathname.startsWith("/admin/packages")) return "packages";
    if (pathname.startsWith("/admin/campaigns")) return "campaigns";
    if (pathname.startsWith("/admin/analytics")) return "analytics";
    if (pathname.startsWith("/admin/payments")) return "payments";
    if (pathname.startsWith("/admin/reports")) return "reports";
    if (pathname.startsWith("/admin/settings")) return "settings";
    return "dashboard";
  };

  const activeItem = getActiveItem();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Search functionality
  const handleSearch = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // Simulate search API call
      const results = navigationItems.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };

  // Handle search result click
  const handleSearchResultClick = (href: string) => {
    router.push(href);
    setSearchQuery("");
    setSearchResults([]);
    closeMobileMenu();
  };

  // Handle logout
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/admin/login" });
  };

  // Handle refresh
  const handleRefresh = () => {
    window.location.reload();
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".search-container")) {
        setSearchResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-300"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={closeMobileMenu}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || mobileMenuOpen) && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`fixed left-0 top-0 h-full w-80 bg-white/5 backdrop-blur-xl border-r border-white/10 z-50 ${
              mobileMenuOpen ? "block" : "hidden lg:block"
            }`}
          >
            {/* Sidebar Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">
                      Admin Panel
                    </h1>
                    <p className="text-white/70 text-sm">Control Center</p>
                  </div>
                </div>
                <button
                  onClick={toggleSidebar}
                  className="hidden lg:block p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b border-white/10">
              <div className="relative search-container">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search admin functions..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  </div>
                )}

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg shadow-xl z-50">
                    {searchResults.map((result) => {
                      const Icon = result.icon;
                      return (
                        <button
                          key={result.id}
                          onClick={() => handleSearchResultClick(result.href)}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-white/10 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg"
                        >
                          <Icon className="w-5 h-5 text-white/70" />
                          <span className="text-white">{result.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeItem === item.id;

                return (
                  <motion.a
                    key={item.id}
                    href={item.href}
                    onClick={() => {
                      closeMobileMenu();
                    }}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 group ${
                      isActive
                        ? `${item.bgColor} ${item.borderColor} border text-white`
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        isActive
                          ? item.color
                          : "text-white/70 group-hover:text-white"
                      }`}
                    />
                    <span className="font-medium">{item.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto w-2 h-2 bg-blue-400 rounded-full"
                      />
                    )}
                  </motion.a>
                );
              })}
            </nav>

            {/* Sidebar Footer - Logout Only */}
            <div className="p-4 border-t border-white/10">
              {/* User Info */}
              <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium text-sm">
                    {session?.user?.name || "Admin User"}
                  </p>
                  <p className="text-white/70 text-xs">
                    {session?.user?.role || "Super Administrator"}
                  </p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-300 group"
              >
                <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "lg:ml-80" : "lg:ml-0"
        }`}
      >
        {/* Top Bar */}
        <div className="bg-white/5 backdrop-blur-sm border-b border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleSidebar}
                className="hidden lg:block p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
              >
                {sidebarOpen ? (
                  <ChevronLeft className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
              </button>
              <h2 className="text-2xl font-bold text-white capitalize">
                {navigationItems.find((item) => item.id === activeItem)?.name ||
                  "Dashboard"}
              </h2>
            </div>

            <div className="flex items-center space-x-4">
              {/* Refresh Button Only */}
              <button
                onClick={handleRefresh}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
