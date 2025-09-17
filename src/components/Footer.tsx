"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  Globe,
} from "lucide-react";
import LunaLogo from "./LunaLogo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    main: [
      { name: "Features", href: "#features" },
      { name: "Pricing", href: "#pricing" },
      { name: "About", href: "#about" },
      { name: "Contact", href: "#contact" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "GDPR", href: "/gdpr" },
    ],
  };

  const socialLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      href: "#",
      color: "hover:text-blue-400",
    },
    { name: "Twitter", icon: Twitter, href: "#", color: "hover:text-sky-400" },
    {
      name: "Instagram",
      icon: Instagram,
      href: "#",
      color: "hover:text-pink-400",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: "#",
      color: "hover:text-blue-500",
    },
  ];

  return (
    <footer className="relative overflow-hidden">
      {/* Professional Background with Blur Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-r from-indigo-600/20 to-slate-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-slate-600/10 to-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="space-y-8">
                <Link href="/" className="group">
                  <LunaLogo
                    size="lg"
                    showText={true}
                    className="transition-all duration-300 group-hover:scale-105"
                  />
                </Link>

                <p className="text-gray-300 text-lg leading-relaxed">
                  Transform your advertising with AI-powered optimization across
                  Facebook, Google, Instagram, TikTok, and more platforms.
                </p>
              </div>
            </div>

            {/* Links Section */}
            <div className="lg:col-span-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Main Links */}
                <div>
                  <h4 className="text-2xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Navigation
                  </h4>
                  <ul className="space-y-4">
                    {footerLinks.main.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-2 flex items-center group"
                        >
                          <Sparkles className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Legal Links */}
                <div>
                  <h4 className="text-2xl font-bold mb-8 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                    Legal
                  </h4>
                  <ul className="space-y-4">
                    {footerLinks.legal.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-2 flex items-center group"
                        >
                          <Sparkles className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact Info Section */}
            <div className="lg:col-span-1">
              <div className="space-y-8">
                <h4 className="text-2xl font-bold mb-8 bg-gradient-to-r from-pink-400 via-red-400 to-orange-400 bg-clip-text text-transparent">
                  Contact Us
                </h4>

                <div className="space-y-6">
                  <motion.div
                    whileHover={{ x: 8, scale: 1.02 }}
                    className="group flex items-start space-x-4 text-gray-300 hover:text-white transition-all duration-300"
                  >
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-2xl transition-all duration-300"
                    >
                      <Mail className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                      <p className="font-medium text-white">Email</p>
                      <p className="text-sm">hello@luna-ai.com</p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ x: 8, scale: 1.02 }}
                    className="group flex items-start space-x-4 text-gray-300 hover:text-white transition-all duration-300"
                  >
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-2xl transition-all duration-300"
                    >
                      <Phone className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                      <p className="font-medium text-white">Phone</p>
                      <p className="text-sm">+1 (555) 123-4567</p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ x: 8, scale: 1.02 }}
                    className="group flex items-start space-x-4 text-gray-300 hover:text-white transition-all duration-300"
                  >
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      className="w-12 h-12 bg-gradient-to-br from-pink-500 via-red-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-2xl transition-all duration-300"
                    >
                      <MapPin className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                      <p className="font-medium text-white">Location</p>
                      <p className="text-sm">San Francisco, CA</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-8 border-t border-white/10">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="text-gray-400 text-sm mb-6 lg:mb-0">
              © {currentYear} Luna AI. All rights reserved.
            </div>
            <div className="flex items-center space-x-6">
              {socialLinks.map((social, index) => (
                <motion.div
                  key={social.name}
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Link
                    href={social.href}
                    className={`group relative text-gray-400 ${social.color} transition-all duration-300 p-4 rounded-2xl hover:scale-110 overflow-hidden`}
                    aria-label={social.name}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      animate={{
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <social.icon className="w-6 h-6 relative z-10" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
