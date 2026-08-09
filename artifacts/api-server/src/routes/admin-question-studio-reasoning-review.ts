import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { authenticate } from "../middlewares/auth";
import {
  listReasoningV1QuestionStudioReviewPackages,
  previewReasoningV1QuestionStudioReview,
  type ReasoningV1QuestionStudioReviewPackageId,
} from "../question-studio-review-registry";

const router = Router();

const LANGUAGES = new Set(["en", "hi", "pa"]);
const DIFFICULTIES = new Set(["Easy", "Medium", "Hard"]);
const QL_IDS = new Set([
  "BLR-QL-031",
  "BLR-QL-032",
  "BLR-QL-033",
  "BLR-QL-034",
  "BLR-QL-035",
]);

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asCount(value: unknown) {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, 20) : 1;
}

router.use(authenticate);

router.get(
  "/reasoning-review/packages",
  requireAdminPermission("content.generation.read"),
  (_req, res) => {
    const packages = listReasoningV1QuestionStudioReviewPackages().map((pkg) => ({
      ...pkg,
      enabled: false,
      reviewOnly: true,
      adminReviewVisible: true,
      questionStudioVisible: false,
      persistenceAllowed: false,
      databaseWriteEnabled: false,
      questionBankEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
    }));

    res.json({
      generationSystem: "reasoning-v1",
      activationMode: "ADMIN_READ_ONLY",
      packages,
      maxPreviewSize: 20,
      databaseWriteEnabled: false,
      persistenceAllowed: false,
    });
  },
);

router.get(
  "/reasoning-review/preview",
  requireAdminPermission("content.generation.read"),
  (req, res) => {
    try {
      const packageId = asString(req.query.packageId) as ReasoningV1QuestionStudioReviewPackageId;
      const language = asString(req.query.language) || "en";
      const difficulty = asString(req.query.difficulty);
      const qlId = asString(req.query.qlId);
      const canonicalItemId = asString(req.query.canonicalItemId);
      const questionLanguageId = asString(req.query.questionLanguageId);
      const seed = asString(req.query.seed);

      if (!packageId) {
        res.status(400).json({ error: "A Reasoning V1 review package is required." });
        return;
      }
      if (!LANGUAGES.has(language)) {
        res.status(400).json({ error: `Unsupported review language '${language}'.` });
        return;
      }
      if (difficulty && !DIFFICULTIES.has(difficulty)) {
        res.status(400).json({ error: `Unsupported review difficulty '${difficulty}'.` });
        return;
      }
      if (qlId && !QL_IDS.has(qlId)) {
        res.status(400).json({ error: `Unsupported BLR-CP-007 QL '${qlId}'.` });
        return;
      }

      const result = previewReasoningV1QuestionStudioReview({
        packageId,
        language: language as "en" | "hi" | "pa",
        difficulty: difficulty
          ? difficulty as "Easy" | "Medium" | "Hard"
          : undefined,
        qlId: qlId
          ? qlId as "BLR-QL-031" | "BLR-QL-032" | "BLR-QL-033" | "BLR-QL-034" | "BLR-QL-035"
          : undefined,
        canonicalItemId: canonicalItemId || undefined,
        questionLanguageId: questionLanguageId || undefined,
        seed: seed || undefined,
        count: asCount(req.query.count),
      });

      res.json({
        ...result,
        activation: {
          mode: "ADMIN_READ_ONLY",
          databaseWriteEnabled: false,
          persistenceAllowed: false,
          questionBankEligible: false,
          mockTestEligible: false,
          publiclyPublishable: false,
        },
      });
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : "Unable to preview the Reasoning V1 review package.";
      res.status(400).json({ error: message });
    }
  },
);

router.all(
  "/reasoning-review/persist",
  requireAdminPermission("content.generation.read"),
  (_req, res) => {
    res.status(403).json({
      error: "BLR-CP-007 is activated for admin preview only. Persistence remains locked.",
      code: "QUESTION_STUDIO_PERSISTENCE_LOCKED",
    });
  },
);

export default router;
