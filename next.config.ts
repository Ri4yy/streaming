import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.cloudflare.steamstatic.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'store.akamai.steamstatic.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'shared.akamai.steamstatic.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'books.google.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'books.google.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
