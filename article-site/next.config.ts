import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  serverExternalPackages: ['isomorphic-dompurify', 'jsdom'],
  experimental: {
    serverActions: {
      allowedOrigins: [
        'solid-garbanzo-v6jx57r5pp7vc566-3000.app.github.dev',
        'localhost:3000',
      ],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};
export default nextConfig;
