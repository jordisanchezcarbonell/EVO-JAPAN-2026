/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // permite revalidar fetches del lado servidor con Tag-based cache
    staleTimes: { dynamic: 30 },
  },
};

export default nextConfig;
