/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === 'production' ? '/barannnn' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/barannnn/' : '',
}

module.exports = nextConfig