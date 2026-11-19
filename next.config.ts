import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    // Tailwind CSS is small (~5 kB gzipped). Inlining it removes a render-blocking
    // request, which costs ~550 ms of first paint on a slow 4G connection.
    inlineCss: true,
  },
  // The case study deck is a static page in public/deck/. Give it a short address.
  redirects() {
    return [{ source: "/deck", destination: "/deck/index.html", permanent: false }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
