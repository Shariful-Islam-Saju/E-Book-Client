import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable external scripts for tracking pixels
  experimental: {
    optimizePackageImports: [
      "@radix-ui/react-avatar",
      "@radix-ui/react-label",
      "@radix-ui/react-slot",
      "@radix-ui/react-tabs",
    ],
  },
  // Headers for external scripts
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/", // match root
        destination: "/ebooks", // send to /ebooks
        permanent: true, // 308 redirect (SEO friendly)
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "digitalseba.s3.ap-southeast-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
