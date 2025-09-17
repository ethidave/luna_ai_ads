"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, User, LogIn, UserPlus } from "lucide-react";
import LunaLogo from "./LunaLogo";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      {/* Professional Background with Blur Effects */}
      <div
        className={`absolute inset-0 transition-all duration-700 ${
          isScrolled
            ? "bg-gradient-to-r from-white/95 via-white/90 to-white/95 backdrop-blur-3xl shadow-2xl"
            : "bg-gradient-to-r from-slate-900/30 via-slate-800/20 to-slate-900/30 backdrop-blur-2xl"
        }`}
      >
        {/* Professional Background Pattern */}
        <div
          className={`absolute inset-0 opacity-20 ${
            isScrolled
              ? "bg-gradient-to-br from-blue-600/10 via-indigo-600/10 to-slate-600/10"
              : "bg-gradient-to-br from-blue-600/20 via-indigo-600/20 to-slate-600/20"
          }`}
        />

        {/* Professional Blur Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-gradient-to-r from-indigo-600/20 to-slate-600/20 rounded-full blur-3xl"></div>
        </div>

        {/* Glassmorphism Overlay */}
        <div
          className={`absolute inset-0 ${
            isScrolled
              ? "bg-gradient-to-r from-white/10 via-white/5 to-white/10"
              : "bg-gradient-to-r from-white/5 via-white/2 to-white/5"
          } backdrop-blur-xl`}
        />
      </div>

      {/* Border with Gradient */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-px transition-all duration-700 ${
          isScrolled
            ? "bg-gradient-to-r from-transparent via-white/30 to-transparent"
            : "bg-gradient-to-r from-transparent via-white/20 to-transparent"
        }`}
      />

      {/* Content Container */}
      <div className="relative z-10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="group">
              <LunaLogo
                size="md"
                showText={true}
                className="transition-all duration-300 group-hover:scale-105"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors duration-300 hover:text-blue-600 ${
                    isScrolled ? "text-gray-700" : "text-white/90"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              <Link
                href="/auth/login"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isScrolled
                    ? "text-gray-700 hover:bg-gray-100"
                    : "text-white/90 hover:bg-white/10"
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Link>
              <Link
                href="/auth/register"
                className="group relative flex items-center space-x-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-6 py-2 rounded-xl text-sm font-medium hover:shadow-2xl transition-all duration-500 overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <span className="relative z-10 flex items-center space-x-2">
                  <UserPlus className="w-4 h-4" />
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors duration-300 ${
                isScrolled
                  ? "text-gray-700 hover:bg-gray-100"
                  : "text-white hover:bg-white/10"
              }`}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="lg:hidden relative overflow-hidden"
              >
                {/* Mobile Menu Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/90 to-white/95 backdrop-blur-3xl">
                  {/* Animated Pattern */}
                  <motion.div
                    animate={{
                      backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                    }}
                    transition={{
                      duration: 15,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-30"
                  />

                  {/* Glassmorphism Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-white/10 backdrop-blur-xl" />
                </div>

                {/* Border */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                {/* Content */}
                <div className="relative z-10">
                  <div className="px-4 py-6 space-y-4">
                    {navItems.map((item, index) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="block text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors duration-300"
                        >
                          {item.name}
                        </Link>
                      </motion.div>
                    ))}
                    <div className="pt-4 border-t border-gray-200 space-y-3">
                      <Link
                        href="/auth/login"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors duration-300"
                      >
                        <LogIn className="w-4 h-4" />
                        <span>Login</span>
                      </Link>
                      <Link
                        href="/auth/register"
                        onClick={() => setIsMenuOpen(false)}
                        className="group relative flex items-center space-x-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-4 py-3 rounded-xl font-medium hover:shadow-2xl transition-all duration-500 overflow-hidden"
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          animate={{
                            backgroundPosition: [
                              "0% 50%",
                              "100% 50%",
                              "0% 50%",
                            ],
                          }}
                          transition={{ duration: 3, repeat: Infinity }}
                        />
                        <span className="relative z-10 flex items-center space-x-2">
                          <UserPlus className="w-4 h-4" />
                          <span>Get Started</span>
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </div>
    </motion.header>
  );
}
