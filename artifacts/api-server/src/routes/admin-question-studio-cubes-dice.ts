import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { authenticate } from "../middlewares/auth";
import {
  CND_001_QUESTION_STUDIO_REVIEW_ONLY_REGISTRATION_AUTHORITY_V1,
  generateCubesDiceQuestionStudioRegisteredBatchV1,
} from "../reasoning-v1/foundation/spatial/cubes-dice-question-studio-registered-runtime-v1";
import type {
  CubesDiceQuestionStudioLanguageV2,
  CubesDiceQuestionStudioQlIdV2,
} from "../reasoning-v1/foundation/spatial/cubes-dice-question-studio-seeded-runtime-v2";

const router = Router();
const LANGUAGES = new Set(["en", "hi", "pa"]);
const QL_IDS = new Set(["SPA-QL-043", "SPA-QL-044", "SPA-QL-045", "SPA-QL-046", "SPA-QL-047"]);

const QLS = Object.freeze([
  Object.freeze({ permanentQlId: "SPA-QL-043", proposalId: "CND-CAN-A-DIE-FACE-RELATIONS", name: "Die face relations from two views", baseDifficulty: "Medium" }),
  Object.freeze({ permanentQlId: "SPA-QL-044", proposalId: "CND-CAN-B-CUBE-NET-FOLDING", name: "Cube-net opposite-face relations", baseDifficulty: "Medium" }),
  Object.freeze({ permanentQlId: "SPA-QL-045", proposalId: "CND-CAN-C-PAINTED-CUBE-EXPOSURE", name: "Painted-cube face exposure counts", baseDifficulty: "Medium" }),
  Object.freeze({ permanentQlId: "SPA-QL-046", proposalId: "CND-CAN-D-VOXEL-STACK-OCCUPANCY", name: "Stable unit-cube stack reasoning", baseDifficulty: "Medium" }),
  Object.freeze({ permanentQlId: "SPA-QL-047", proposalId: "CND-CAN-E-ORTHOGRAPHIC-PROJECTION", name: "Top, front and right projections", baseDifficulty: "Medium" }),
] as const);

const PACKAGE = Object.freeze({
  packageId: "SPA-001-CND-001-REVIEW" as const,
  chapterCode: "CND-001" as const,
  label: "Cubes & Dice — Review-only Question Studio" as const,
  qlIds: Object.freeze(QLS.map((entry) => entry.permanentQlId)),
  qls: QLS,
  permanentQlCount: 5,
  supportedLanguages: Object.freeze(["en", "hi", "pa"] as const),
  supportedDifficulties: Object.freeze(["Easy", "Medium", "Hard"] as const),
  registrationAuthority: CND_001_QUESTION_STUDIO_REVIEW_ONLY_REGISTRATION_AUTHORITY_V1.authorityId,
  activationMode: "REGISTERED_REVIEW_ONLY" as const,
  questionStudioVisible: true,
  questionStudioDiscoverable: true,
  previewGenerationAuthorized: true,
  persistenceAllowed: false,
  databaseWriteEnabled: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
  automaticStudentPublication: false,
});

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asCount(value: unknown): number {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, 20) : 5;
}

function filters(source: Record<string, unknown>) {
  const language = asString(source.language) || "en";
  const qlId = asString(source.qlId);
  if (!LANGUAGES.has(language)) throw new Error(`Unsupported CND language '${language}'.`);
  if (qlId && !QL_IDS.has(qlId)) throw new Error(`Unsupported CND QL '${qlId}'.`);
  return {
    language: language as CubesDiceQuestionStudioLanguageV2,
    qlId: qlId ? qlId as CubesDiceQuestionStudioQlIdV2 : undefined,
    count: asCount(source.count),
    seed: asString(source.seed) || "cnd-question-studio-review",
  };
}

router.use(authenticate);

router.get(
  "/reasoning/spatial/cubes-dice/package",
  requireAdminPermission("content.generation.read"),
  (_req, res) => {
    res.json({
      generationSystem: "reasoning-v1",
      package: PACKAGE,
      maxPreviewBatchSize: 20,
      registrationStatus: "REGISTERED_REVIEW_ONLY",
      databaseWriteEnabled: false,
      persistenceAllowed: false,
      questionBankConversionEligibleAfterApproval: false,
      testEligibleAfterApproval: false,
      publiclyPublishableAfterApproval: false,
      automaticStudentPublication: false,
    });
  },
);

router.get(
  "/reasoning/spatial/cubes-dice/preview",
  requireAdminPermission("content.generation.read"),
  (req, res) => {
    try {
      const input = filters(req.query as Record<string, unknown>);
      const questions = generateCubesDiceQuestionStudioRegisteredBatchV1(input);
      res.json({
        generationSystem: "reasoning-v1",
        packageId: PACKAGE.packageId,
        activationMode: PACKAGE.activationMode,
        registrationAuthority: PACKAGE.registrationAuthority,
        questions,
        productionEligible: false,
        persistenceAllowed: false,
        questionBankWritable: false,
        testEligible: false,
        publiclyPublishable: false,
      });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Unable to preview CND questions." });
    }
  },
);

router.get(
  "/reasoning/spatial/cubes-dice/status",
  requireAdminPermission("content.generation.read"),
  (_req, res) => {
    res.json({
      packageId: PACKAGE.packageId,
      chapterCode: PACKAGE.chapterCode,
      permanentQlCount: PACKAGE.permanentQlCount,
      supportedLanguages: PACKAGE.supportedLanguages,
      registrationStatus: "REGISTERED_REVIEW_ONLY",
      registrationAuthority: PACKAGE.registrationAuthority,
      questionStudioDiscoverable: true,
      previewGenerationAuthorized: true,
      persistenceAllowed: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
      nextGate: CND_001_QUESTION_STUDIO_REVIEW_ONLY_REGISTRATION_AUTHORITY_V1.nextGate,
    });
  },
);

router.post(
  "/reasoning/spatial/cubes-dice/runs",
  requireAdminPermission("content.generation.write"),
  (_req, res) => {
    res.status(409).json({
      error: "CND-001 is registered for Question Studio review and preview, but persistence is intentionally locked at this gate.",
      registrationStatus: "REGISTERED_REVIEW_ONLY",
      persistenceAllowed: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
      nextGate: CND_001_QUESTION_STUDIO_REVIEW_ONLY_REGISTRATION_AUTHORITY_V1.nextGate,
    });
  },
);

export { PACKAGE as CND_001_QUESTION_STUDIO_REVIEW_PACKAGE_V1 };
export default router;
