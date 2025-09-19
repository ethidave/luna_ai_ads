import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles.css";
import { Providers } from "@/components/providers";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: process.env.APP_NAME || "Luna AI - AI-Powered Ad Management",
  description:
    process.env.APP_DESCRIPTION ||
    "Revolutionary ad management platform powered by AI. Create, manage, and optimize your Facebook, Instagram, Google, and Website ads with intelligent automation.",
  keywords:
    process.env.APP_KEYWORDS ||
    "ad management, AI advertising, Facebook ads, Google ads, Instagram ads, automated marketing, AI optimization",
  authors: [{ name: process.env.APP_AUTHOR || "Luna AI Team" }],
  creator: process.env.APP_CREATOR || "Luna AI",
  publisher: process.env.APP_PUBLISHER || "Luna AI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  metadataBase: new URL(process.env.APP_URL || "http://localhost:3000"),
  openGraph: {
    title: process.env.APP_NAME || "Luna AI - AI-Powered Ad Management",
    description:
      process.env.APP_DESCRIPTION ||
      "Revolutionary ad management platform powered by AI",
    url: process.env.APP_URL || "http://localhost:3000",
    siteName: "Luna AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Luna AI",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luna AI - AI-Powered Ad Management",
    description:
      "Revolutionary ad management platform powered by AI",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <Providers>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#363636",
                  color: "#fff",
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: "#10B981",
                    secondary: "#fff",
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: "#EF4444",
                    secondary: "#fff",
                  },
                },
              }}
            />
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
