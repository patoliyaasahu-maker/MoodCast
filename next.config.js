/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: [
    "@neondatabase/serverless",
    "@prisma/adapter-neon",
    "ws",
    "bufferutil",
    "utf-8-validate",
  ],
};

module.exports = nextConfig;
