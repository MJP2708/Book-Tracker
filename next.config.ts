import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/",
        headers: [{ key: "X-Robots-Tag", value: "index, follow" }],
      },
      {
        source: "/books/:path*",
        headers: [{ key: "X-Robots-Tag", value: "index, follow" }],
      },
      {
        source: "/profile/:path*",
        headers: [{ key: "X-Robots-Tag", value: "index, follow" }],
      },
      {
        source: "/sitemap.xml",
        headers: [{ key: "X-Robots-Tag", value: "index, follow" }],
      },
      {
        source: "/robots.txt",
        headers: [{ key: "X-Robots-Tag", value: "index, follow" }],
      },
    ];
  },
};

export default nextConfig;
