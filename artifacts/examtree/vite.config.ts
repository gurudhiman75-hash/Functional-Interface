import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

const rawPort = process.env.PORT ?? "5173";

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH ?? "/";

function assertStaticEntryExcludesFirebase(): Plugin {
  return {
    name: "assert-static-entry-excludes-firebase",
    apply: "build",
    generateBundle(_options, bundle) {
      const chunks = Object.values(bundle).filter((output) => output.type === "chunk");
      const chunksByFileName = new Map(chunks.map((chunk) => [chunk.fileName, chunk]));
      const entryChunks = chunks.filter((chunk) => chunk.isEntry);
      const visited = new Set<string>();
      const violations = new Set<string>();
      const queue = [...entryChunks];

      while (queue.length > 0) {
        const chunk = queue.pop();
        if (!chunk || visited.has(chunk.fileName)) continue;
        visited.add(chunk.fileName);

        for (const moduleId of Object.keys(chunk.modules)) {
          const normalizedId = moduleId.replaceAll("\\", "/");
          if (
            normalizedId.includes("/node_modules/firebase/") ||
            normalizedId.includes("/node_modules/@firebase/")
          ) {
            violations.add(`${chunk.fileName}: ${normalizedId}`);
          }
        }

        for (const importedFile of chunk.imports) {
          const importedChunk = chunksByFileName.get(importedFile);
          if (importedChunk) queue.push(importedChunk);
        }
      }

      if (violations.size > 0) {
        this.error(
          `Firebase entered the static application entry graph. Keep Firebase behind route-scoped dynamic imports:\n${[
            ...violations,
          ].join("\n")}`,
        );
      }
    },
  };
}

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    assertStaticEntryExcludesFirebase(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          charts: ["recharts"],
          firebase: ["firebase/app", "firebase/auth", "firebase/firestore", "firebase/storage"],
        },
      },
    },
  },
  server: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
    proxy: {
      "/api": "http://localhost:3001",
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
