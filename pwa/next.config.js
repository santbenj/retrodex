/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  images: {
    domains: ['raw.githubusercontent.com'], // Ajoutez le domaine ici
  },
}

module.exports = nextConfig
