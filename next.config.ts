import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // cacheComponents: true, // Removed to fix blocking route error with dynamic auth
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static-us-img.skywork.ai',
      },
      {
        protocol: 'https',
        hostname: '**', // Permite cualquier dominio HTTPS
      },
    ],
  },
};

export default nextConfig;
