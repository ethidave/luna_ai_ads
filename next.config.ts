import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['typeorm', 'mysql2'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('typeorm', 'mysql2');
    }
    return config;
  },
  // Fix chunk loading issues
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Optimize for stability
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
};

export default nextConfig;
