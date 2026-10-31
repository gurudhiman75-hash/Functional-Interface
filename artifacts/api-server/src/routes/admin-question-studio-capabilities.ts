import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { authenticate } from "../middlewares/auth";

const router = Router();
const distDir = path.dirname(fileURLToPath(import.meta.url));
// This route runs *before* the legacy chapter registry. The isolated staging
// admin API must select the four-engine build artifact HERE, not in the
// downstream registry (which never sees successful GET /capabilities calls).
const isIsolatedQsStaging = process.env.EXAMTREE_API_RUNTIME === "cloud-run"
  && process.env.EXAMTREE_API_STAGING === "true";
// The complete Cloud Run admin revision is also a canonical four-engine
// Question Studio host. The older production catalogue predates the unified
// registry and can make the admin subject selector appear Quant-only.
// Student-only Cloud Run revisions keep the legacy manifest while admin routes
// are delegated; never infer authorization from this UI discovery catalogue.
const isFullCloudRunAdmin = process.env.EXAMTREE_API_RUNTIME === "cloud-run"
  && process.env.EXAMTREE_API_STAGING === "false"
  && process.env.EXAMTREE_ADMIN_ROUTES_DELEGATED_RENDER === "false"
  && process.env.EXAMTREE_ADMIN_DETERMINISTIC_ONLY === "false";
const useUnifiedCatalog = isIsolatedQsStaging || isFullCloudRunAdmin;
const manifestPath = path.resolve(distDir, useUnifiedCatalog
  ? "question-studio-unified-capabilities.json"
  : "question-studio-capabilities.json");
let manifestPromise: Promise<Record<string, unknown>> | null = null;

async function loadManifest(): Promise<Record<string, unknown>> {
  manifestPromise ??= readFile(manifestPath, "utf8").then((raw) => {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.packages)) {
      throw new Error("Question Studio capabilities manifest is invalid.");
    }
    if (useUnifiedCatalog) {
      const engines = parsed.generationSystems;
      const packages = parsed.packages;
      if (!Array.isArray(engines) || engines.length < 4 ||
          !packages.some((pkg: {packageId?: string; enabled?: boolean}) =>
            pkg.packageId === "COM-001" && pkg.enabled === true)) {
        throw new Error("Unified Question Studio catalog lacks required four-engine packages.");
      }
    }
    return parsed as Record<string, unknown>;
  });
  return manifestPromise;
}

router.use(authenticate);

router.get(
  "/capabilities",
  requireAdminPermission("content.generation.read"),
  async (_req, res) => {
    try {
      const manifest = await loadManifest();
      // This is an authenticated JSON API, not a cacheable static asset.
      // Conditional GETs previously returned 304 with no JSON body.
      res.setHeader("Cache-Control", "private, no-store");
      res.setHeader("Vary", "Authorization");
      res.setHeader("X-Examtree-QS-Catalog", isIsolatedQsStaging ? "unified-staging-v1" : "legacy");
      res.json(manifest);
    } catch (error) {
      console.error("Question Studio capabilities manifest load failed", error);
      res.status(500).json({
        error: "Unable to load Question Studio capabilities",
        code: "QUESTION_STUDIO_CAPABILITIES_MANIFEST_UNAVAILABLE",
      });
    }
  },
);

export default router;
