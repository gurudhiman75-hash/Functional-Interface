import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { authenticate } from "../middlewares/auth";

const router = Router();
const distDir = path.dirname(fileURLToPath(import.meta.url));
const manifestPath = path.resolve(distDir, "question-studio-capabilities.json");
let manifestPromise: Promise<Record<string, unknown>> | null = null;

async function loadManifest(): Promise<Record<string, unknown>> {
  manifestPromise ??= readFile(manifestPath, "utf8").then((raw) => {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.packages)) {
      throw new Error("Question Studio capabilities manifest is invalid.");
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
      res.setHeader("Cache-Control", "private, max-age=60");
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
