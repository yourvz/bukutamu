/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: "export",
  distDir: ".", // Output to root for GitHub Pages
  // basePath is /bukutamu for yourvz.github.io/bukutamu/ subpath
  basePath: "/bukutamu",
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ensure environment variables are available during build
  env: {
    NEXT_PUBLIC_SUPABASE_URL:
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      "https://uwnpifnkdqneafcaiyhz.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      "sb_publishable_XzBy5H98yapUKN1dO5qDIw_iq_UHNlV",
  },
};

module.exports = nextConfig;
