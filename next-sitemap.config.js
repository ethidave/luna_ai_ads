/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || "https://lunaais.com",
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ["/admin/*", "/auth/*", "/api/*"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/auth/", "/api/"],
      },
    ],
    additionalSitemaps: ["https://lunaais.com/sitemap.xml"],
  },
  transform: async (config, path) => {
    // Custom transform for different page types
    const customConfig = {
      loc: path,
      changefreq: "daily",
      priority: 0.7,
      lastmod: new Date().toISOString(),
    };

    // Homepage gets highest priority
    if (path === "/") {
      customConfig.priority = 1.0;
      customConfig.changefreq = "daily";
    }

    // Dashboard pages get high priority
    if (path.startsWith("/dashboard")) {
      customConfig.priority = 0.9;
      customConfig.changefreq = "daily";
    }

    // Social media pages get medium priority
    if (path.startsWith("/social-media")) {
      customConfig.priority = 0.8;
      customConfig.changefreq = "weekly";
    }

    return customConfig;
  },
};
