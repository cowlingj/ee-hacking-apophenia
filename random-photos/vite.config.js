/* global __dirname */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";
import fs from "fs";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: { enabled: true },
      includeAssets: ["photos/*", "ee-logo.svg", "favicon.png"],
      manifest: {
        short_name: "Random Photos",
        name: "Random Photos - Hacking Apopenia",
        description: "Show a set of random photos",
        icons: [
          {
            src: "/ee-icon.svg",
            type: "image/svg+xml",
            sizes: "192x192",
          },
          {
            src: "/ee-icon.svg",
            type: "image/svg+xml",
            sizes: "512x512",
          },
          {
            src: "/ee-icon.svg",
            sizes: "any",
            type: "image/svg+xml",
          },
        ],
        start_url: "/index.html",
        display: "standalone",
        theme_color: "#1795d3",
        workbox: {
          globPatterns: ["**/*.{js,css,html,png,svg,jpg}"],
        },
        background_color: "#ffffff",
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
  },
  define: {
    CONFIG_IMAGES: JSON.stringify(
      fs
        .readdirSync(path.resolve(__dirname, "public", "photos"))
        .map((file) => path.join("/photos", file))
    ),
  },
});
