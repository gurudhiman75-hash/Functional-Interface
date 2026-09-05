import { Buffer } from "node:buffer";
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
const CATEGORY_ICON_CHUNK_BUDGET_BYTES = 64 * 1024;
const STATIC_ENTRY_CHUNK_BUDGET_BYTES = 384 * 1024;
const STATIC_ENTRY_GRAPH_BUDGET_BYTES = 768 * 1024;

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

function assertCategoryIconBundleBudget(): Plugin {
  return {
    name: "assert-category-icon-bundle-budget",
    apply: "build",
    generateBundle(_options, bundle) {
      let categoryIconChunkFound = false;

      for (const output of Object.values(bundle)) {
        if (output.type !== "chunk") continue;
        const containsCategoryIcon = Object.keys(output.modules).some((moduleId) =>
          moduleId.replaceAll("\\", "/").includes("/src/components/CategoryIcon.tsx"),
        );
        if (!containsCategoryIcon) continue;

        categoryIconChunkFound = true;
        const chunkBytes = Buffer.byteLength(output.code, "utf8");
        if (chunkBytes > CATEGORY_ICON_CHUNK_BUDGET_BYTES) {
          this.error(
            `${output.fileName} contains CategoryIcon and is ${(chunkBytes / 1024).toFixed(1)} KiB. ` +
              `Keep category icons tree-shakable and below ${CATEGORY_ICON_CHUNK_BUDGET_BYTES / 1024} KiB.`,
          );
        }
      }

      if (!categoryIconChunkFound) {
        this.error("CategoryIcon was not emitted into the production bundle; bundle budget could not be verified.");
      }
    },
  };
}

function assertStartupBundleBudgets(): Plugin {
  return {
    name: "assert-startup-bundle-budgets",
    apply: "build",
    generateBundle(_options, bundle) {
      const chunks = Object.values(bundle).filter((output) => output.type === "chunk");
      const chunksByFileName = new Map(chunks.map((chunk) => [chunk.fileName, chunk]));
      const entryChunks = chunks.filter((output) => output.isEntry);

      if (entryChunks.length === 0) {
        this.error("No production entry chunk was emitted; startup bundle budgets could not be verified.");
      }

      for (const entry of entryChunks) {
        const entryBytes = Buffer.byteLength(entry.code, "utf8");
        if (entryBytes > STATIC_ENTRY_CHUNK_BUDGET_BYTES) {
          this.error(
            `${entry.fileName} is ${(entryBytes / 1024).toFixed(1)} KiB. ` +
              `Keep the production entry chunk below ${STATIC_ENTRY_CHUNK_BUDGET_BYTES / 1024} KiB.`,
          );
        }

        const visited = new Set<string>();
        const queue = [entry];
        let staticGraphBytes = 0;

        while (queue.length > 0) {
          const chunk = queue.pop();
          if (!chunk || visited.has(chunk.fileName)) continue;
          visited.add(chunk.fileName);
          staticGraphBytes += Buffer.byteLength(chunk.code, "utf8");

          for (const importedFile of chunk.imports) {
            const importedChunk = chunksByFileName.get(importedFile);
            if (importedChunk) queue.push(importedChunk);
          }
        }

        if (staticGraphBytes > STATIC_ENTRY_GRAPH_BUDGET_BYTES) {
          this.error(
            `${entry.fileName} has a ${(staticGraphBytes / 1024).toFixed(1)} KiB static JS graph. ` +
              `Keep eagerly reachable production JavaScript below ${STATIC_ENTRY_GRAPH_BUDGET_BYTES / 1024} KiB.`,
          );
        }
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
    assertCategoryIconBundleBudget(),
    assertStartupBundleBudgets(),
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
