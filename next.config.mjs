/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "financialmodelingprep.com",
      },
    ],
  },
};

export default nextConfig;
