import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  plugins: [tailwindcss(),react()],
  server: {
    host: "localhost",
    port: 5174,
    strictPort: true,
    hmr: {
      protocol: "ws",
    },
  },
  build: {
    target: "esnext",
    manifest: true,
  },
});
