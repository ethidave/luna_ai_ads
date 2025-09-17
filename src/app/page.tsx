"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
  Play,
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
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect admin users to admin panel
  useEffect(() => {
    if (status === "loading") return;
    if (session?.user?.isAdmin) {
      router.push("/admin");
      return;
    }
  }, [session, status, router]);

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
  const [packagesError, setPackagesError] = useState<string | null>(null);

  // Fetch packages from database
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch("/api/packages");
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched packages:", data);
          // The API returns { success: true, packages: [...] }
          if (data.success && Array.isArray(data.packages)) {
            setPackages(data.packages);
          } else {
            console.error("Invalid packages data structure:", data);
            setPackagesError("Invalid packages data");
          }
        } else {
          console.error("Failed to fetch packages:", response.statusText);
          setPackagesError("Failed to load packages");
        }
      } catch (error) {
        console.error("Error fetching packages:", error);
        setPackagesError("Failed to load packages");
      } finally {
        setPackagesLoading(false);
      }
    };

    fetchPackages();
  }, []);

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
    if (session) {
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
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactForm),
      });

      const data = await response.json();

      if (data.success) {
        setContactSubmitted(true);
        setContactForm({ name: "", email: "", company: "", message: "" });
      } else {
        alert(data.message || "Failed to send message");
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

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 opacity-90"></div>
        <div className="absolute inset-0 bg-black opacity-20"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Transform Your
              <span className="block bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                Advertising
              </span>
              with AI
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Create, optimize, and scale your ad campaigns with the power of
              artificial intelligence. Get better results in less time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                onClick={() =>
                  document
                    .getElementById("packages")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-purple-600 transition-all duration-300 flex items-center justify-center space-x-2"
                onClick={() => {
                  // Demo functionality - could open a modal or navigate to demo page
                  alert("Demo video would open here!");
                }}
              >
                <Play className="w-5 h-5" />
                <span>Watch Demo</span>
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-16 h-16 bg-white bg-opacity-10 rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-20 w-12 h-12 bg-yellow-400 bg-opacity-20 rounded-full animate-bounce"></div>
        <div className="absolute bottom-10 left-20 w-10 h-10 bg-pink-400 bg-opacity-30 rounded-full animate-pulse"></div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
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
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Choose Your Package
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Select the perfect plan for your business needs. All packages
              include our core AI features.
            </p>
          </div>

          {packagesLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : packagesError ? (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 text-lg">{packagesError}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages &&
                packages.map((pkg, index) => (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 ${
                      pkg.isPopular ? "ring-2 ring-purple-500 scale-105" : ""
                    }`}
                  >
                    {pkg.isPopular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                          Most Popular
                        </span>
                      </div>
                    )}

                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {pkg.name}
                      </h3>
                      <p className="text-gray-600 mb-4">{pkg.description}</p>
                      <div className="mb-6">
                        <span className="text-5xl font-bold text-gray-900">
                          ${pkg.price}
                        </span>
                        <span className="text-gray-600 ml-2">
                          /{pkg.type.toLowerCase()}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4 mb-8">
                      {pkg.features.map(
                        (feature: string, featureIndex: number) => (
                          <div key={featureIndex} className="flex items-center">
                            <CheckCircle className="w-5 h-5 text-purple-600 mr-3 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        )
                      )}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handlePackageSelect(pkg)}
                      className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
                        pkg.isPopular
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg"
                          : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                      }`}
                    >
                      {session ? "Choose Plan" : "Get Started"}
                    </motion.button>
                  </motion.div>
                ))}
            </div>
          )}
        </div>
      </section>

      {/* User Package Selections - Only show if user is logged in */}
      {session && (
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <UserPackageSelections
              onEditSelection={(selection) => {
                // Handle edit selection
                console.log("Edit selection:", selection);
              }}
              onRemoveSelection={(selectionId) => {
                // Handle remove selection
                console.log("Remove selection:", selectionId);
              }}
              showActions={true}
            />
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-50">
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
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Get in Touch
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Ready to transform your advertising? Let&apos;s discuss how Luna
                AI can help your business grow.
              </p>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-white">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Email</div>
                    <div className="text-gray-600">hello@lunaai.com</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-white">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Phone</div>
                    <div className="text-gray-600">+1 (555) 123-4567</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-white">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Address</div>
                    <div className="text-gray-600">
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
              className="bg-gray-50 rounded-3xl p-8"
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
                    Thank you for your message. We&apos;ll get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      placeholder="Tell us about your project..."
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmittingContact}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-graher project i needient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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
      <section className="py-24 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Advertising?
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            Join thousands of businesses already using Luna AI to create better
            campaigns and drive more results.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300"
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
  );
}
