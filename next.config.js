import nextPwa from 'next-pwa'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 's.sctvideo.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

const withPWA = nextPwa({ dest: 'public', disable: process.env.NODE_ENV === 'development' })
export default withPWA(nextConfig)
