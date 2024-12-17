import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "vite-plugin-tailwindcss",
      config: () => ({
        css: {
          postcss: {
            plugins: [tailwindcss(), autoprefixer()],
          },
        },
      }),
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Correct alias for "@" paths
    },
  },
  server: {
    port: 5000,
  },
  build: {
    rollupOptions: {
      external: ["@radix-ui/react-alert-dialog"], // Mark Radix UI as external
    },
  },
});
