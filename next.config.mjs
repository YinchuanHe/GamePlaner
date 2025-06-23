import withPWA from 'next-pwa';

const withPwa = withPWA({
  dest: 'public',
  register: false,
  disable: process.env.NODE_ENV === 'development',
  customWorkerDir: 'worker',
});

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
    ],
  },
};

export default withPwa(nextConfig);
