/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  experimental: {
    forceSwcTransforms: true,
  },
  // Enable static exports if needed
  // output: 'export',
  // trailingSlash: true,
}

module.exports = nextConfig
