/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost:8001'],
    path: '/avatars/',
    loader: 'custom',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8001/api/:path*',
      },
      {
        source: '/avatars/:path*',
        destination: 'http://localhost:8001/avatars/:path*',
      },
    ];
  },
}

module.exports = nextConfig
