import { Router } from "express";

import adminQuestionStudioSpatialV5Router from "./admin-question-studio-spatial-v5";
import { SPATIAL_QUESTION_STUDIO_PACKAGE_V1 as SPATIAL_QUESTION_STUDIO_PACKAGE_V6 } from "../reasoning-v1/foundation/spatial/spatial-question-studio-integration-v6";

const router = Router();
const SPA_PACKAGE_ID = "SPA-001";
const SPA_QL_IDS = new Set<string>(SPATIAL_QUESTION_STUDIO_PACKAGE_V6.qlIds);

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function isSpa001SharedQuestionStudioRequest(value: unknown): boolean {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  return asString((value as Record<string, unknown>).packageId) === SPA_PACKAGE_ID;
}

router.post("/runs", (req, res, next) => {
  if (!isSpa001SharedQuestionStudioRequest(req.body)) {
    next();
    return;
  }

  const canonicalProblemId = asString(req.body?.canonicalProblemId) || asString(req.body?.cpId);
  const qlId = SPA_QL_IDS.has(canonicalProblemId) ? canonicalProblemId : undefined;
  req.body = {
    ...req.body,
    ...(qlId ? { qlId } : {}),
  };

  const originalUrl = req.url;
  req.url = "/reasoning/spatial/runs";
  adminQuestionStudioSpatialV5Router.handle(req, res, (error?: unknown) => {
    req.url = originalUrl;
    if (error) {
      next(error);
      return;
    }
    next();
  });
});

export default router;