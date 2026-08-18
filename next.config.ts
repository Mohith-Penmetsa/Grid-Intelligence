import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Set Turbopack root to project directory.
  // Prevents Turbopack from scanning the parent home directory for package-lock.json.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
