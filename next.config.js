/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false, // don't leak "X-Powered-By: Next.js"
  reactStrictMode: true,
};

module.exports = nextConfig;
