import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
  // sharp's native libvips binary (.so) isn't picked up by Vercel's output
  // file tracing automatically, causing ERR_DLOPEN_FAILED at runtime.
  // Force-include it for the route that uses sharp.
  outputFileTracingIncludes: {
    "/apply": [
      "./node_modules/@img/sharp-linux-x64/**/*",
      "./node_modules/@img/sharp-libvips-linux-x64/**/*",
    ],
  },
  allowedDevOrigins: ['192.168.101.4', '192.168.101.6'],
};

export default nextConfig;
