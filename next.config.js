/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === 'production' ? '/barannnn' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/barannnn/' : '',
  // Enable static export for GitHub Pages in production
  ...(process.env.NODE_ENV === 'production' && {
    output: 'export'
  })
}

module.exports = nextConfig