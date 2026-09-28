import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets phones/tablets on your Wi-Fi open the dev server (npm run dev) by IP address.
  // Development only: this has no effect on the live site.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "172.*.*.*"],

  // The eBook shop has been removed; send old links to the booking page.
  async redirects() {
    return [{ source: "/shop", destination: "/book", permanent: true }];
  },
};

export default nextConfig;
