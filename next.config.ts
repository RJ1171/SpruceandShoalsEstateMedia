import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@remotion/renderer", "@remotion/bundler"],
  outputFileTracingIncludes: {
    "/api/render": [
      "./remotion/**/*",
      "./node_modules/@remotion/compositor-linux-x64-gnu/**/*"
    ]
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "image.mux.com" }
    ]
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "25mb"
    }
  }
};

export default nextConfig;
