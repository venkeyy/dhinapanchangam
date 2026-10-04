import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Swiss Ephemeris is a native Node addon: keep it out of the bundle so its
  // prebuilt binary (prebuilds/linux-x64) ships with the server function.
  serverExternalPackages: ["sweph"],
  // sweph loads its binary through node-gyp-build at runtime, which the file
  // tracer can't follow, so ship it explicitly with every server route.
  outputFileTracingIncludes: {
    "/**": ["./node_modules/sweph/prebuilds/linux-x64/*.node", "./node_modules/sweph/build/Release/*.node"],
  },
  async redirects() {
    return [
      { source: "/", destination: "/en", permanent: false },
      // Chennai is the default city: its month calendar has no city in the address
      { source: "/:lang/tamil-calendar/:year/:month/chennai", destination: "/:lang/tamil-calendar/:year/:month", permanent: true },
    ];
  },
};

export default nextConfig;
