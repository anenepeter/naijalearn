/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jyltaekdutgeneccvumq.supabase.co',
        pathname: '**', // Allow any path
      },
    ],
  },
};

module.exports = nextConfig;