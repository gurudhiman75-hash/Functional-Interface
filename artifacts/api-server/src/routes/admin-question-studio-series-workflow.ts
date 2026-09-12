import { Router } from "express";

import adminQuestionStudioSeriesRouter from "./admin-question-studio-series";
import { SER_CP007_PERMANENT_QL_IDS } from "../reasoning-v1/topics/Series/SER-001/SER-PERMANENT-QL-REGISTRY";

const router = Router();
const SER_PACKAGE_ID = "SER-001";
const SER_QL_IDS = new Set<string>(SER_CP007_PERMANENT_QL_IDS);

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function isSer001SharedQuestionStudioRequest(value: unknown): boolean {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  return asString((value as Record<string, unknown>).packageId) === SER_PACKAGE_ID;
}

router.post("/runs", (req, res, next) => {
  if (!isSer001SharedQuestionStudioRequest(req.body)) {
    next();
    return;
  }

  const canonicalProblemId = asString(req.body?.canonicalProblemId);
  const qlId = SER_QL_IDS.has(canonicalProblemId) ? canonicalProblemId : undefined;
  req.body = { ...req.body, qlId };

  const originalUrl = req.url;
  req.url = "/reasoning/series/runs";
  adminQuestionStudioSeriesRouter.handle(req, res, (error?: unknown) => {
    req.url = originalUrl;
    if (error) {
      next(error);
      return;
    }
    next();
  });
});

export default router;
