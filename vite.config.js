// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Radio Browser (balanceador)
      "/rb": {
        target: "https://all.api.radio-browser.info",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/rb/, ""),
      },
      // TuneIn OPML
      "/ti": {
        target: "https://opml.radiotime.com",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/ti/, ""),
      },
    },
    // opcional: desactiva el overlay de errores si te molesta
    // hmr: { overlay: false },
  },
});
