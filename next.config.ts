import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
  allowedDevOrigins: ['192.168.101.4'],
};

export default nextConfig;
