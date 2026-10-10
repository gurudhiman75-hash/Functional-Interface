// Fail-closed preflight before changing Cloudflare Pages API upstream away
// from Render. Vite embeds VITE_API_* values at BUILD TIME. Changing only the
// Pages Function env variable is insufficient if built JS directly calls Render.
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(projectRoot, "artifacts", "examtree", "dist", "public");

export function findLegacyApiCalls(root) {
  const found = [];
  const walk = (folder) => {
    for (const entry of readdirSync(folder, { withFileTypes: true })) {
      const full = path.join(folder, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile() && /\.(?:html|js|mjs)$/.test(entry.name)) {
        const data = readFileSync(full, "utf8");
        if (/https?:\/\/examtree-new\.onrender\.com\/api(?:\b|\/|\?)/i.test(data)) {
          found.push(path.relative(root, full));
        }
      }
    }
  };
  if (!statSync(root).isDirectory()) throw new Error("Pages build output path is not a directory");
  walk(root);
  return found;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.env.VITE_API_BASE_URL !== "/api" || process.env.VITE_API_URL !== "/api") {
    console.error("Cloudflare cutover blocked: set VITE_API_BASE_URL=/api and VITE_API_URL=/api BEFORE rebuilding student/admin JS.");
    process.exitCode = 1;
  } else {
    try {
      const files = findLegacyApiCalls(dist);
      if (files.length) {
        console.error("Cloudflare cutover blocked: compiled frontend still calls Render directly: " + files.slice(0, 8).join(", "));
        process.exitCode = 1;
      } else {
        console.log("PASS: both compiled frontends use same-origin /api and contain no direct Render API reference");
      }
    } catch (e) {
      console.error("Cloudflare cutover blocked: missing/unreadable Pages build output: " + (e instanceof Error ? e.message : String(e)));
      process.exitCode = 1;
    }
  }
}
