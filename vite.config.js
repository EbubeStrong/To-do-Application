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
    port: 5000, // Local dev server on port 5000
  },
  build: {
    rollupOptions: {
      input: path.resolve(__dirname, "index.html"), // Ensure the main entry is correctly resolved
      output: {
        dir: "dist", // Output directory
        format: "es", // ES module format
      },
    },
  },
  base: "/", // Optional: If you're deploying to the root
});
