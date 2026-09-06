import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  typescript: { ignoreBuildErrors: true },
  experimental: {
    turbo: {
      // ponytail: Turbopack resolves server-only (fs) transitively.
      // Use webpack until chat route is CF-compatible.
    },
  },
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;