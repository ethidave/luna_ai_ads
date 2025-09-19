"use client";

import { motion } from "framer-motion";
import { Brain, Sparkles, Zap } from "lucide-react";

interface LunaLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export default function LunaLogo({
  size = "md",
  showText = true,
  className = "",
}: LunaLogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Logo Icon */}
      <motion.div
        whileHover={{
          scale: 1.1,
          rotate: [0, -5, 5, 0],
          transition: { duration: 0.3 },
        }}
        whileTap={{ scale: 0.95 }}
        className={`${sizeClasses[size]} relative`}
      >
        {/* Main Logo Container */}
        <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl relative overflow-hidden">
          {/* Animated Background Glow */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-2xl blur-sm"
          />

          {/* AI Symbol - Custom Design */}
          <motion.div
            animate={{
              y: [0, -2, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative z-10"
          >
            <div className="w-6 h-6 text-white drop-shadow-lg flex items-center justify-center">
              <div className="relative">
                {/* AI Symbol - Stylized "AI" */}
                <div className="text-xs font-bold leading-none">
                  <div className="flex items-center justify-center">
                    <span className="text-white">AI</span>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-1 -right-1 w-1 h-1 bg-yellow-300 rounded-full"></div>
                <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-blue-300 rounded-full"></div>
              </div>
            </div>
          </motion.div>

          {/* Floating Sparkles */}
          <motion.div
            animate={{
              rotate: 360,
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute -top-1 -right-1"
          >
            <Sparkles className="w-3 h-3 text-yellow-300" />
          </motion.div>

          <motion.div
            animate={{
              rotate: -360,
              scale: [1.2, 0.8, 1.2],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute -bottom-1 -left-1"
          >
            <Zap className="w-2 h-2 text-blue-300" />
          </motion.div>

          {/* Gradient Border Effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20 border border-white/20"></div>
        </div>

        {/* Outer Glow Ring */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 blur-md -z-10"
        />
      </motion.div>

      {/* Logo Text */}
      {showText && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col"
        >
          <motion.span
            className={`${textSizes[size]} font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent`}
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            Luna AI
          </motion.span>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
          />
        </motion.div>
      )}
    </div>
  );
}

