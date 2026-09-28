import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets phones/tablets on your Wi-Fi open the dev server (npm run dev) by IP address.
  // Development only: this has no effect on the live site.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "172.*.*.*"],

  // Ship the private eBook PDFs with the download route when deployed (e.g. on Vercel).
  outputFileTracingIncludes: {
    "/api/ebooks/download": ["./ebooks/**/*"],
  },
};

export default nextConfig;
