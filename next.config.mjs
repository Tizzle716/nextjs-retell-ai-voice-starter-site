/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration nécessaire pour gérer canvas avec Next.js
  webpack: (config) => {
    config.externals = [...config.externals, { canvas: "canvas" }];  // required to make canvas work
    return config;
  },
};

export default nextConfig;
