import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Add Tailwind CSS plugin
    tailwindcss(),
  ],
  server: {
    host: true,
  },
});
