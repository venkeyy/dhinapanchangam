import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Swiss Ephemeris is a native Node addon: keep it out of the bundle so its
  // prebuilt binary (prebuilds/linux-x64) ships with the server function.
  serverExternalPackages: ["sweph"],
  async redirects() {
    return [{ source: "/", destination: "/en", permanent: false }];
  },
};

export default nextConfig;
