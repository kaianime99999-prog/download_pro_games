/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['via.placeholder.com', 'www.wifi4games.com'],
  },
  trailingSlash: true,
  distDir: '.next',
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  async rewrites() {
    return [
      {
        source: '/404',
        destination: '/not-found',
      },
    ]
  },
  // تحسينات للإنتاج
  experimental: {
    serverComponentsExternalPackages: ['jsonwebtoken', 'bcryptjs'],
  },
  // تحسين الذاكرة
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
}

module.exports = nextConfig