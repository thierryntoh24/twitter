import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "", // Leave empty if no specific port
        pathname: "/**", // Allow all paths from this domain
      },
    ],
  },
};

module.exports = nextConfig;
