import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove output: 'export' to allow API routes
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
