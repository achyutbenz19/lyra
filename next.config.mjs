/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.cisin.com",
      },
    ],
  },
};

export default nextConfig;
