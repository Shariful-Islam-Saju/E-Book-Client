import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/ebooks",
        permanent: true, // true = 308 redirect (good for SEO), false = 307 temporary
      },
    ];
  },
};

export default nextConfig;
