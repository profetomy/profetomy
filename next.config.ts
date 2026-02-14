import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
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
