import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Limit image formats to reduce transformations
    formats: ['image/webp', 'image/avif'],
    // Limit device sizes to reduce the number of generated images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    // Limit image sizes for responsive images
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Disable static image imports optimization for better control
    dangerouslyAllowSVG: false,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '54321',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
