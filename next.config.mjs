/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration nécessaire pour gérer canvas avec Next.js
  webpack: (config) => {
    config.externals = [...config.externals, { canvas: "canvas" }];  // required to make canvas work
    return config;
  },
  output: 'standalone',
  images: {
    unoptimized: true
  },
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons']
  }
};

export default nextConfig;
