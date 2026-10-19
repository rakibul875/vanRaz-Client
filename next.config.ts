import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    cpus: 4,
    memoryBasedWorkersCount: true,
  },
  output: "standalone",
  enablePrerenderSourceMaps: false,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },

      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "example.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/product",
        destination: "/products",
        permanent: true,
      },
      {
        source: "/product/:path*",
        destination: "/products/:path*",
        permanent: true,
      },
      {
        source: "/dashboard/admin",
        destination: "/adminDashboard",
        permanent: true,
      },
      {
        source: "/dashboard/adminPanel/:path*",
        destination: "/adminDashboard",
        permanent: true,
      },
      {
        source: "/dashboard/:path*",
        destination: "/userDashboard/:path*",
        permanent: true,
      },
      {
        source: "/dashboard",
        destination: "/userDashboard",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
