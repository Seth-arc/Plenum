import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Plenum marketing site. Self-contained — does not touch the simulation runtime
// that lives at the repository root.
//
// Base path: dev serves at "/". The production build serves under the GitHub
// Pages project subpath "/Plenum/". Override with VITE_BASE_PATH (e.g. "/" for a
// custom domain).
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === "build" ? process.env.VITE_BASE_PATH ?? "/Plenum/" : "/",
  server: { port: 5180 },
  build: { outDir: "dist", sourcemap: false },
}));
