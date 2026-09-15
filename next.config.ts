import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `sharp` (used by @richardmcquiston01/makertool-image2outline) ships a
  // native addon; keep it external to the server bundle instead of letting
  // webpack/Turbopack try to trace and inline it.
  serverExternalPackages: ["sharp", "@richardmcquiston01/makertool-image2outline"],
  // Pin the workspace root to this project so Turbopack doesn't infer it
  // from a lockfile in a parent directory outside this repo.
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
