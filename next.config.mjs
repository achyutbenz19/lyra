/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.cisin.com",
      },
      {
        protocol: "https",
        hostname: "imgs.search.brave.com",
      },
    ],
  },
};

export default nextConfig;
