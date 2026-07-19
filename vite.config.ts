import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

const ReactCompilerConfig = {
  target: "19",
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, "");
  // Point the /bot proxy at a local async bot for local testing by setting
  // VITE_BOT_PROXY_TARGET in .env.local (e.g. http://localhost:8081).
  const botProxyTarget = env.VITE_BOT_PROXY_TARGET || "https://bot.asyncti4.com";

  return {
    plugins: [
      react({
        babel: {
          plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
        },
      }),
    ],
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
      },
    },
    assetsInclude: ["**/*.woff", "**/*.woff2", "**/*.ttf", "**/*.otf"],
    server: {
      proxy: {
        "/bot": {
          target: botProxyTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/bot/, ""),
        },
        "/proxy": {
          target: "https://asyncti4.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/proxy/, ""),
        },
        "/auth": {
          target: "http://127.0.0.1:8000",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/auth/, ""),
        },
      },
    },
  };
});
