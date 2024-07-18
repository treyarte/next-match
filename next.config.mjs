/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: false,
  experimental: {
    staleTimes: {
      dynamic: 0
    }
  }
};

export default nextConfig;
