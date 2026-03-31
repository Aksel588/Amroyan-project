import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
// If the site lives in a subfolder (e.g. https://domain.com/myapp/), set in .env.production:
//   VITE_BASE_URL=/myapp/
// Then rebuild and upload dist/; see DEPLOY_CPANEL.md (MIME / module script errors).
const appBase = process.env.VITE_BASE_URL || "/";

export default defineConfig(({ mode }) => ({
  base: appBase.endsWith("/") ? appBase : `${appBase}/`,
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
