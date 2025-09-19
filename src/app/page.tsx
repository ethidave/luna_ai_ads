"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { ErrorDisplay, LoadingWithError } from "@/components/ErrorDisplay";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { logger } from "@/lib/console-utils";
import { apiUrl, apiRequest } from "@/lib/api-utils";
import BackendConnectionError from "@/components/BackendConnectionError";
import {
  ArrowRight,
  Zap,
  BarChart3,
  Target,
  CheckCircle,
  Brain,
  Star,
  Shield,
  TrendingUp,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  Send,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PaymentModal from "@/components/dashboard/PaymentModal";
import UserPackageSelections from "@/components/UserPackageSelections";

export default function Home() {
  const { user, loading: authLoading, isAdmin, isAuthenticated } = useAuth();
  const router = useRouter();
  const {
    error: packagesError,
    handleError: handlePackagesError,
    clearError: clearPackagesError,
  } = useErrorHandler({
    context: "HomePage-Packages",
  });

  // Redirect admin users to admin panel
  useEffect(() => {
    if (authLoading) return;
    if (isAdmin) {
      router.push("/admin");
      return;
    }
  }, [isAdmin, authLoading, router]);

  // State for packages
  const [packages, setPackages] = useState<
    Array<{
      id: string;
      name: string;
      description: string;
      price: string;
      type: string;
      features: string[];
      platforms: string[];
      duration: number;
      budget: number;
      isPopular?: boolean;
      monthlyPrice?: number;
      yearlyPrice?: number;
      status?: string;
      maxCampaigns?: number;
      maxUsers?: number;
      limitations?: string;
      customizations?: string[];
      isCustom?: boolean;
      sortOrder?: number;
      createdAt?: string;
      updatedAt?: string;
      popular?: boolean;
      color?: string;
      maxFacebookAccounts?: number;
      dailyBudgetCap?: string;
      hasUnlimitedBudget?: boolean;
      hasTeamCollaboration?: boolean;
      hasDedicatedConsultant?: boolean;
      limitationsArray?: string[];
    }>
  >([]);
  const [packagesLoading, setPackagesLoading] = useState(true);
  const [usingFallbackPackages, setUsingFallbackPackages] = useState(false);

  // Fallback packages if API fails
  const fallbackPackages = [
    {
      id: "1",
      name: "Starter",
      description:
        "Perfect for small businesses getting started with social media marketing.",
      price: "29",
      type: "monthly",
      features: [
        "5 Campaigns",
        "Basic Analytics",
        "Email Support",
        "Social Media Integration",
      ],
      platforms: ["Facebook", "Instagram", "Twitter"],
      duration: 30,
      budget: 1000,
      isPopular: false,
    },
    {
      id: "2",
      name: "Professional",
      description:
        "Ideal for growing businesses that need more advanced features and support.",
      price: "79",
      type: "monthly",
      features: [
        "25 Campaigns",
        "Advanced Analytics",
        "Priority Support",
        "All Social Platforms",
        "AI Content Generation",
        "A/B Testing",
      ],
      platforms: ["Facebook", "Instagram", "Twitter", "LinkedIn", "TikTok"],
      duration: 30,
      budget: 5000,
      isPopular: true,
    },
    {
      id: "3",
      name: "Enterprise",
      description:
        "For large businesses that need enterprise-level features and support.",
      price: "199",
      type: "monthly",
      features: [
        "Unlimited Campaigns",
        "Real-time Analytics",
        "24/7 Phone Support",
        "Custom Integrations",
        "Advanced AI Features",
        "White-label Options",
        "Dedicated Account Manager",
      ],
      platforms: [
        "Facebook",
        "Instagram",
        "Twitter",
        "LinkedIn",
        "TikTok",
        "YouTube",
      ],
      duration: 30,
      budget: 50000,
      isPopular: false,
    },
  ];

  // Fetch packages from database
  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    const fetchPackages = async () => {
      try {
        logger.debug("Fetching packages from API...");
        const apiBaseUrl = apiUrl("");

        // Check if API URL is valid
        if (!apiBaseUrl || apiBaseUrl === "undefined") {
          logger.warn("API URL not configured, using fallback packages");
          setPackages(fallbackPackages);
          setUsingFallbackPackages(true);
          handlePackagesError(
            new Error("API not configured. Using default packages.")
          );
          return;
        }

        logger.debug("API URL:", apiUrl);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await apiRequest("/packages", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
          mode: "cors",
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        logger.debug("Packages API Response Status:", response.status);

        if (response.ok) {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              const data = await response.json();
              logger.debug("Fetched packages data:", data);

              // The API returns { success: true, packages: [...] }
              if (data.success && Array.isArray(data.packages)) {
                setPackages(data.packages);
                setUsingFallbackPackages(false);
                clearPackagesError();
                logger.debug(
                  "Successfully loaded packages:",
                  data.packages.length
                );
              } else if (Array.isArray(data)) {
                // Handle case where API returns packages array directly
                setPackages(data);
                setUsingFallbackPackages(false);
                clearPackagesError();
                logger.debug(
                  "Successfully loaded packages (direct array):",
                  data.length
                );
              } else {
                logger.warn("Invalid packages data structure:", data);
                setPackages(fallbackPackages);
                setUsingFallbackPackages(true);
                handlePackagesError(
                  new Error("API returned invalid data structure")
                );
              }
            } catch (jsonError) {
              logger.warn("Failed to parse JSON response:", jsonError);
              setPackages(fallbackPackages);
              setUsingFallbackPackages(true);
              handlePackagesError(new Error("Failed to parse server response"));
            }
          } else {
            logger.warn("Response is not JSON, content-type:", contentType);
            setPackages(fallbackPackages);
            setUsingFallbackPackages(true);
            handlePackagesError(new Error("Server returned non-JSON response"));
          }
        } else {
          logger.warn(
            "Failed to fetch packages:",
            response.status,
            response.statusText
          );

          // Use fallback packages and show appropriate error
          setPackages(fallbackPackages);
          setUsingFallbackPackages(true);

          if (response.status === 404) {
            handlePackagesError(
              new Error("Packages endpoint not found. Using default packages.")
            );
          } else if (response.status >= 500) {
            handlePackagesError(
              new Error(
                "Server temporarily unavailable. Using default packages."
              )
            );
          } else {
            handlePackagesError(
              new Error("Unable to load packages. Using default packages.")
            );
          }
        }
      } catch (error) {
        logger.warn("Error fetching packages:", error);
        setPackages(fallbackPackages);
        setUsingFallbackPackages(true);

        // Check if it's a timeout error
        if (error instanceof Error && error.name === "AbortError") {
          handlePackagesError(
            new Error("Request timed out. Using default packages.")
          );
        } else if (
          error instanceof TypeError &&
          error.message.includes("fetch")
        ) {
          handlePackagesError(
            new Error("Unable to connect to server. Using default packages.")
          );
        } else {
          handlePackagesError(
            new Error("Failed to load packages. Using default packages.")
          );
        }
      } finally {
        setPackagesLoading(false);
      }
    };

    fetchPackages();
  }, [handlePackagesError, clearPackagesError]);

  // State for payment modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<{
    id: string;
    name: string;
    description: string;
    price: string;
    type: string;
    features: string[];
    platforms: string[];
    duration: number;
    budget: number;
    isPopular?: boolean;
    monthlyPrice?: number;
    yearlyPrice?: number;
    status?: string;
    maxCampaigns?: number;
    maxUsers?: number;
    limitations?: string;
    customizations?: string[];
    isCustom?: boolean;
    sortOrder?: number;
    createdAt?: string;
    updatedAt?: string;
    popular?: boolean;
    color?: string;
    maxFacebookAccounts?: number;
    dailyBudgetCap?: string;
    hasUnlimitedBudget?: boolean;
    hasTeamCollaboration?: boolean;
    hasDedicatedConsultant?: boolean;
    limitationsArray?: string[];
  } | null>(null);

  // State for contact form
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Handle package selection
  const handlePackageSelect = (pkg: {
    id: string;
    name: string;
    description: string;
    price: string;
    type: string;
    features: string[];
    platforms: string[];
    duration: number;
    budget: number;
    isPopular?: boolean;
    monthlyPrice?: number;
    yearlyPrice?: number;
    status?: string;
    maxCampaigns?: number;
    maxUsers?: number;
    limitations?: string;
    customizations?: string[];
    isCustom?: boolean;
    sortOrder?: number;
    createdAt?: string;
    updatedAt?: string;
    popular?: boolean;
    color?: string;
    maxFacebookAccounts?: number;
    dailyBudgetCap?: string;
    hasUnlimitedBudget?: boolean;
    hasTeamCollaboration?: boolean;
    hasDedicatedConsultant?: boolean;
    limitationsArray?: string[];
  }) => {
    if (isAuthenticated) {
      setSelectedPackage(pkg);
      setIsPaymentModalOpen(true);
    } else {
      router.push("/auth/register");
    }
  };

  // Handle contact form submission
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingContact(true);

    try {
      const response = await apiRequest("/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactForm),
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();

        if (data.success) {
          setContactSubmitted(true);
          setContactForm({ name: "", email: "", company: "", message: "" });
        } else {
          alert(data.message || "Failed to send message");
        }
      } else {
        alert("Invalid response format");
      }
    } catch {
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmittingContact(false);
    }
  };

  const handleContactChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value,
    });
  };

  // Testimonials data
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechCorp",
      content:
        "Luna AI transformed our advertising strategy. We saw a 300% increase in ROI within the first month!",
      rating: 5,
      avatar: "SJ",
    },
    {
      name: "Mike Chen",
      role: "CEO",
      company: "StartupXYZ",
      content:
        "The AI-powered insights are incredible. We're reaching our target audience like never before.",
      rating: 5,
      avatar: "MC",
    },
    {
      name: "Emily Rodriguez",
      role: "Brand Manager",
      company: "Creative Agency",
      content:
        "Luna AI saved us hours of work and delivered better results than our previous tools combined.",
      rating: 5,
      avatar: "ER",
    },
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white">
        <Header />

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Enhanced Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600"></div>
          <div className="absolute inset-0 bg-black opacity-30"></div>

          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-white to-transparent opacity-5 animate-pulse"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-8 sm:py-16 lg:py-24">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="space-y-6 sm:space-y-8"
            >
              {/* Main Heading */}
              <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight">
                Transform Your
                <span className="block bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mt-2 sm:mt-4 mb-2">
                  Advertising
                </span>
                <span className="block text-2xl sm:text-4xl md:text-5xl lg:text-6xl mt-4 sm:mt-6">
                  with AI
                </span>
              </h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed"
              >
                Create, optimize, and scale your ad campaigns with the power of
                artificial intelligence. Get better results in less time.
              </motion.p>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-purple-600 px-6 sm:px-12 lg:px-16 py-4 sm:py-6 rounded-2xl font-bold text-lg sm:text-xl lg:text-2xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-2 sm:space-x-4 shadow-xl w-full sm:w-auto max-w-sm sm:max-w-none"
                  onClick={() =>
                    document
                      .getElementById("packages")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <span>Get Started Today</span>
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                </motion.button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 max-w-4xl mx-auto"
              >
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
                    300%
                  </div>
                  <div className="text-gray-300 text-base sm:text-lg">
                    Average ROI Increase
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
                    50%
                  </div>
                  <div className="text-gray-300 text-base sm:text-lg">
                    Time Saved
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
                    10K+
                  </div>
                  <div className="text-gray-300 text-base sm:text-lg">
                    Happy Customers
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Enhanced Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-16 w-16 h-16 bg-yellow-400 bg-opacity-20 rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 left-20 w-12 h-12 bg-pink-400 bg-opacity-30 rounded-full animate-pulse"></div>
          <div className="absolute bottom-32 right-10 w-8 h-8 bg-blue-400 bg-opacity-25 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 left-5 w-6 h-6 bg-purple-400 bg-opacity-20 rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-5 w-10 h-10 bg-green-400 bg-opacity-15 rounded-full animate-bounce"></div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Why Choose Luna AI?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our AI-powered platform gives you everything you need to create,
                optimize, and scale successful advertising campaigns.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Brain,
                  title: "AI-Powered Insights",
                  description:
                    "Get intelligent recommendations and insights to optimize your campaigns automatically.",
                },
                {
                  icon: Target,
                  title: "Precise Targeting",
                  description:
                    "Reach the right audience with advanced targeting options powered by machine learning.",
                },
                {
                  icon: BarChart3,
                  title: "Real-time Analytics",
                  description:
                    "Track performance with detailed analytics and get actionable insights instantly.",
                },
                {
                  icon: Zap,
                  title: "Lightning Fast",
                  description:
                    "Create and deploy campaigns in minutes, not hours. Speed up your workflow.",
                },
                {
                  icon: Shield,
                  title: "Secure & Reliable",
                  description:
                    "Enterprise-grade security with 99.9% uptime. Your data is always protected.",
                },
                {
                  icon: TrendingUp,
                  title: "Proven Results",
                  description:
                    "Join thousands of businesses seeing 300%+ ROI improvements with our platform.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-white mb-6">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Packages Section */}
        <section id="packages" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                Choose Your Package
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                Select the perfect plan for your business needs. All packages
                include our core AI features.
              </p>

              {/* Backend connection error */}
              {usingFallbackPackages && (
                <div className="mt-6">
                  <BackendConnectionError
                    onRetry={() => {
                      setUsingFallbackPackages(false);
                      setPackagesLoading(true);
                      // Trigger a re-fetch of packages
                      window.location.reload();
                    }}
                  />
                </div>
              )}
            </div>

            <LoadingWithError
              isLoading={packagesLoading}
              error={packagesError}
              onRetry={() => {
                clearPackagesError();
                setPackagesLoading(true);
                // Re-trigger the fetch
                window.location.reload();
              }}
              onDismiss={clearPackagesError}
              loadingMessage="Loading packages..."
              errorTitle="Failed to load packages"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {packages &&
                  packages.map((pkg, index) => (
                    <motion.div
                      key={pkg.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className={`relative bg-white rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 ${
                        pkg.isPopular
                          ? "ring-2 ring-purple-500 sm:scale-105"
                          : ""
                      }`}
                    >
                      {pkg.isPopular && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                          <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                            Most Popular
                          </span>
                        </div>
                      )}

                      <div className="text-center mb-6 sm:mb-8">
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                          {pkg.name}
                        </h3>
                        <p className="text-gray-600 mb-4 text-sm sm:text-base">
                          {pkg.description}
                        </p>
                        <div className="mb-4 sm:mb-6">
                          <span className="text-4xl sm:text-5xl font-bold text-gray-900">
                            ${pkg.price}
                          </span>
                          <span className="text-gray-600 ml-2 text-sm sm:text-base">
                            /{pkg.type.toLowerCase()}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                        {pkg.features.map(
                          (feature: string, featureIndex: number) => (
                            <div
                              key={featureIndex}
                              className="flex items-center"
                            >
                              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 mr-2 sm:mr-3 flex-shrink-0" />
                              <span className="text-gray-700 text-sm sm:text-base">
                                {feature}
                              </span>
                            </div>
                          )
                        )}
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handlePackageSelect(pkg)}
                        className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 ${
                          pkg.isPopular
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg"
                            : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                        }`}
                      >
                        {isAuthenticated ? "Choose Plan" : "Get Started"}
                      </motion.button>
                    </motion.div>
                  ))}
              </div>
            </LoadingWithError>
          </div>
        </section>

        {/* User Package Selections - Only show if user is logged in */}
        {isAuthenticated && (
          <section className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <UserPackageSelections
                onEditSelection={(selection) => {
                  // Handle edit selection
                }}
                onRemoveSelection={(selectionId) => {
                  // Handle remove selection
                }}
                showActions={true}
              />
            </div>
          </section>
        )}

        {/* Testimonials Section */}
        <section id="testimonials" className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                What Our Customers Say
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Join thousands of satisfied customers who have transformed their
                advertising with Luna AI
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-8 shadow-lg"
                >
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {testimonial.role} at {testimonial.company}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16">
              <div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                  Get in Touch
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8">
                  Ready to transform your advertising? Let&apos;s discuss how
                  Luna AI can help your business grow.
                </p>

                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-white flex-shrink-0">
                      <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm sm:text-base">
                        Email
                      </div>
                      <div className="text-gray-600 text-sm sm:text-base">
                        hello@lunaai.com
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-white flex-shrink-0">
                      <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm sm:text-base">
                        Phone
                      </div>
                      <div className="text-gray-600 text-sm sm:text-base">
                        +1 (555) 123-4567
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-white flex-shrink-0">
                      <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm sm:text-base">
                        Address
                      </div>
                      <div className="text-gray-600 text-sm sm:text-base">
                        123 AI Street, Tech City, TC 12345
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-gray-50 rounded-3xl p-6 sm:p-8"
              >
                {contactSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-gray-600">
                      Thank you for your message. We&apos;ll get back to you
                      soon.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={handleContactSubmit}
                    className="space-y-4 sm:space-y-6"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={contactForm.name}
                          onChange={handleContactChange}
                          required
                          className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={contactForm.email}
                          onChange={handleContactChange}
                          required
                          className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="company"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Company
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={contactForm.company}
                        onChange={handleContactChange}
                        className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base"
                        placeholder="Your company"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={contactForm.message}
                        onChange={handleContactChange}
                        rows={4}
                        required
                        className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-base"
                        placeholder="Tell us about your project..."
                      />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isSubmittingContact}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-semibold text-base sm:text-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {isSubmittingContact ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Send Message</span>
                        </>
                      )}
                    </motion.button>
                  </form>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-24 bg-gradient-to-r from-purple-600 to-pink-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
              Ready to Transform Your Advertising?
            </h2>
            <p className="text-lg sm:text-xl text-gray-200 mb-6 sm:mb-8">
              Join thousands of businesses already using Luna AI to create
              better campaigns and drive more results.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-purple-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg hover:shadow-lg transition-all duration-300 w-full sm:w-auto max-w-sm sm:max-w-none"
              onClick={() => router.push("/auth/register")}
            >
              Start Your Free Trial
            </motion.button>
          </div>
        </section>

        <Footer />

        {/* Payment Modal */}
        {isPaymentModalOpen && selectedPackage && (
          <PaymentModal
            isOpen={isPaymentModalOpen}
            package={{
              ...selectedPackage,
              price: parseFloat(selectedPackage.price),
            }}
            onClose={() => {
              setIsPaymentModalOpen(false);
              setSelectedPackage(null);
            }}
            onSuccess={() => {
              setIsPaymentModalOpen(false);
              setSelectedPackage(null);
            }}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
