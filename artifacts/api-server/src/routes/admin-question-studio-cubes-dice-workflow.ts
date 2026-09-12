import { Router } from "express";

import adminQuestionStudioCubesDiceRouter from "./admin-question-studio-cubes-dice";

const router = Router();
const CND_PACKAGE_ID = "SPA-001-CND-001-REVIEW";
const CND_QL_IDS = new Set([
  "SPA-QL-043",
  "SPA-QL-044",
  "SPA-QL-045",
  "SPA-QL-046",
  "SPA-QL-047",
]);

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function isCnd001SharedQuestionStudioRequest(value: unknown): boolean {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  return asString((value as Record<string, unknown>).packageId) === CND_PACKAGE_ID;
}

router.post("/runs", (req, res, next) => {
  if (!isCnd001SharedQuestionStudioRequest(req.body)) {
    next();
    return;
  }

  const canonicalProblemId = asString(req.body?.canonicalProblemId);
  const qlId = CND_QL_IDS.has(canonicalProblemId) ? canonicalProblemId : undefined;
  req.body = {
    ...req.body,
    qlId,
  };

  const originalUrl = req.url;
  req.url = "/reasoning/spatial/cubes-dice/runs";
  adminQuestionStudioCubesDiceRouter.handle(req, res, (error?: unknown) => {
    req.url = originalUrl;
    if (error) {
      next(error);
      return;
    }
    next();
  });
});

export default router;
