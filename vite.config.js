import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import path from "path"; // Import path module

export default defineConfig({
  plugins: [
    react(), // React plugin
    {
      name: "vite-plugin-tailwindcss", // Explicitly define the plugin for Tailwind CSS
      config: () => ({
        css: {
          postcss: {
            plugins: [
              tailwindcss(), // Use the Tailwind CSS plugin
              autoprefixer(), // Autoprefixer for browser compatibility
            ],
          },
        },
      }),
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Correct alias configuration
    },
  },
  server: {
    port: 5000, // Port number as a number, not a string
  },
});
