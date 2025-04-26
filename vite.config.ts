import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname,
      "@/components": new URL("./components", import.meta.url).pathname,
      "@/lib": new URL("./lib", import.meta.url).pathname,
    },
  },
  server: {
    port: 5000,
  },
  css: {
    postcss: "./postcss.config.ts",
  },
});
