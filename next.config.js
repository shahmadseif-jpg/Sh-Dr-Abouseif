const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');
const { securityHeaders } = require('./security-headers');

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'yt3.ggpht.com',
      },
    ],
  },
};

module.exports = withNextIntl(nextConfig);
