import { randomUUID } from "node:crypto";
import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";
import {
  SPATIAL_QUESTION_STUDIO_PACKAGE_V1,
  SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1,
  type SpatialQuestionStudioDifficultyV1,
} from "../reasoning-v1/foundation/spatial/spatial-question-studio-integration-v1";
import {
  generateSpatialProductionStudioBatchV1,
  type SpatialProductionStudioQuestionV1,
} from "../reasoning-v1/foundation/spatial/spatial-question-studio-production-v1";
import type { SpatialPermanentQlIdV1 } from "../reasoning-v1/foundation/spatial/spatial-question-studio-runtime-v1";
import type { SpatialPermanentChapterCodeV1 } from "../reasoning-v1/foundation/spatial/spatial-permanent-ql-allocation-v1";

const router = Router();
const QL_IDS = new Set<string>(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.qlIds);
const CHAPTERS = new Set<string>(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.chapters);
const DIFFICULTIES = new Set<string>(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.supportedDifficulties);

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asCount(value: unknown, fallback = 5, max = 50): number {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
}

function publicRunCode(): string {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `SPA-${date}-${randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase()}`;
}

function explanationText(question: SpatialProductionStudioQuestionV1): string {
  return [
    `Observe: ${question.explanation.observation}`,
    `Rule: ${question.explanation.rule}`,
    `Apply: ${question.explanation.application}`,
    `Check: ${question.explanation.check}`,
  ].join("\n\n");
}

function productionPayload(question: SpatialProductionStudioQuestionV1) {
  return {
    text: question.stem,
    stem: question.stem,
    stimulusSvgs: question.stimulusSvgs,
    optionSvgs: question.optionSvgs,
    optionLabels: question.optionLabels,
    options: [...question.optionLabels],
    correct: question.correctIndex,
    correctIndex: question.correctIndex,
    answer: question.answer,
    canonicalAnswer: question.answer,
    explanation: explanationText(question),
    richExplanation: question.explanation,
    renderer: question.renderer,
    difficulty: question.difficultyBand,
    difficultyLabel: question.difficultyBand,
    patternId: question.qlId,
    qlId: question.qlId,
    qlName: question.qlName,
    proposalId: question.proposalId,
    packageId: question.packageId,
    canonicalProblemId: question.chapterCode,
    canonicalItemId: question.canonicalItemId,
    questionLanguageId: question.questionLanguageId,
    questionId: question.questionId,
    topic: "Reasoning",
    subtopic: "Spatial Reasoning",
    subject: "Reasoning Ability",
    language: question.language,
    locale: question.locale,
    seed: question.seed,
    generationSeed: question.generationSeed,
    mode: question.mode,
    contentFingerprint: question.contentFingerprint,
    runtimeMode: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.runtimeMode,
    reviewStatus: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.reviewStatus,
    questionBankStatus: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.questionBankStatus,
    testEligibility: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.testEligibility,
    testEligible: true as const,
    publiclyPublishable: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.publiclyPublishable,
    mockTestEligible: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.mockTestEligible,
    manualApprovalRequired: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.manualApprovalRequired,
    automaticStudentPublication:
      SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.automaticStudentPublication,
    integrationAuthority: question.integrationAuthority,
    releaseAuthority: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.authority,
    sourceValidation: question.validation,
    generationContext: {
      generationDomain: "reasoning-v1" as const,
      packageId: question.packageId,
      qlId: question.qlId,
      chapterCode: question.chapterCode,
      runtimeMode: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.runtimeMode,
      reviewStatus: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.reviewStatus,
      integrationAuthority: question.integrationAuthority,
      releaseAuthority: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.authority,
      questionStudioDiscoverable: true as const,
      registrationStatus: "REGISTERED" as const,
      persistenceAllowed: true as const,
      questionBankStatus: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.questionBankStatus,
      testEligibility: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.testEligibility,
      testEligible: true as const,
      publiclyPublishable: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.publiclyPublishable,
      mockTestEligible: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.mockTestEligible,
      manualApprovalRequired: true as const,
      automaticStudentPublication: false as const,
    },
  };
}

async function persistRun(
  questions: readonly SpatialProductionStudioQuestionV1[],
  requestSnapshot: Record<string, unknown>,
  actorUserId: string,
) {
  if (!questions.length) throw new Error("No Spatial questions matched the request.");
  const runId = randomUUID();
  const publicCode = publicRunCode();
  const timestamp = new Date().toISOString();

  await sqlClient.begin(async (tx) => {
    await tx`
      INSERT INTO content.generation_runs (
        id, public_code, status, attempt_number, prompt_snapshot, request_snapshot,
        provider, model, prompt_tokens, completion_tokens, estimated_cost_paise,
        actual_cost_paise, started_at, completed_at, created_at, updated_at
      ) VALUES (
        ${runId}::uuid, ${publicCode}, 'review'::generation_run_status, 1,
        ${JSON.stringify(requestSnapshot)}::jsonb, ${JSON.stringify(requestSnapshot)}::jsonb,
        'examtree', 'reasoning-v1-spa-001', 0, 0, 0, 0,
        ${timestamp}, ${timestamp}, ${timestamp}, ${timestamp}
      )
    `;

    for (let index = 0; index < questions.length; index += 1) {
      const question = questions[index]!;
      const itemId = randomUUID();
      const versionId = randomUUID();
      const payload = productionPayload(question);
      await tx`
        INSERT INTO content.generation_run_items (
          id, generation_run_id, item_number, status, current_version_number,
          created_at, updated_at
        ) VALUES (
          ${itemId}::uuid, ${runId}::uuid, ${index + 1},
          'unreviewed'::generation_item_status, 1, ${timestamp}, ${timestamp}
        )
      `;
      await tx`
        INSERT INTO content.generation_item_versions (
          id, generation_item_id, version_number, payload, provider_item_id, created_at
        ) VALUES (
          ${versionId}::uuid, ${itemId}::uuid, 1, ${JSON.stringify(payload)}::jsonb,
          ${question.questionLanguageId}, ${timestamp}
        )
      `;
    }

    await tx`
      INSERT INTO platform.audit_events (
        id, actor_type, actor_user_id, action_key, entity_type, entity_id,
        reason, summary, metadata
      ) VALUES (
        ${randomUUID()}::uuid, 'user'::audit_actor_type, ${actorUserId}::uuid,
        'question_studio.spatial_run.created', 'generation_run', ${runId}::uuid,
        'Approved SPA-001 generator entered the standard Question Studio lifecycle',
        ${`Created ${questions.length} SPA-001 review items in ${publicCode}`},
        ${JSON.stringify({
          requestSnapshot,
          integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.integrationAuthority,
          releaseAuthority: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.authority,
          manualApprovalRequired: true,
          automaticStudentPublication: false,
        })}::jsonb
      )
    `;

    await tx`
      INSERT INTO platform.outbox_events (
        id, aggregate_type, aggregate_id, event_type, payload
      ) VALUES (
        ${randomUUID()}::uuid, 'generation_run', ${runId}::uuid,
        'question_studio.spatial_run.created',
        ${JSON.stringify({
          runId,
          publicCode,
          itemCount: questions.length,
          packageId: "SPA-001",
          releaseAuthority: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.authority,
        })}::jsonb
      )
    `;
  });

  return { id: runId, publicCode, status: "review" as const, itemCount: questions.length };
}

function requestFilters(source: Record<string, unknown>) {
  const language = asString(source.language) || "en";
  const qlId = asString(source.qlId);
  const chapterCode = asString(source.chapterCode);
  const difficulty = asString(source.difficulty);
  if (language !== "en") throw new Error("Spatial Question Studio currently supports English only.");
  if (qlId && !QL_IDS.has(qlId)) throw new Error(`Unsupported Spatial QL '${qlId}'.`);
  if (chapterCode && !CHAPTERS.has(chapterCode)) throw new Error(`Unsupported Spatial chapter '${chapterCode}'.`);
  if (difficulty && !DIFFICULTIES.has(difficulty)) throw new Error(`Unsupported difficulty '${difficulty}'.`);
  return {
    language: "en" as const,
    qlId: qlId ? qlId as SpatialPermanentQlIdV1 : undefined,
    chapterCode: chapterCode ? chapterCode as SpatialPermanentChapterCodeV1 : undefined,
    difficulty: difficulty ? difficulty as SpatialQuestionStudioDifficultyV1 : undefined,
  };
}

router.use(authenticate);

router.get(
  "/reasoning/spatial/package",
  requireAdminPermission("content.generation.read"),
  (_req, res) => {
    res.json({
      generationSystem: "reasoning-v1",
      activationMode: "PRODUCTION_REVIEW",
      package: SPATIAL_QUESTION_STUDIO_PACKAGE_V1,
      maxBatchSize: 50,
      permanentQlCount: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.permanentQlCount,
      databaseWriteEnabled: true,
      persistenceAllowed: true,
      questionBankConversionEligibleAfterApproval: true,
      testEligibleAfterApproval: true,
      publiclyPublishableAfterApproval: true,
      automaticStudentPublication: false,
      bulkSyncSupported: false,
    });
  },
);

router.get(
  "/reasoning/spatial/preview",
  requireAdminPermission("content.generation.read"),
  (req, res) => {
    try {
      const filters = requestFilters(req.query as Record<string, unknown>);
      const result = generateSpatialProductionStudioBatchV1({
        ...filters,
        seed: asString(req.query.seed) || "spa-question-studio-preview",
        count: asCount(req.query.count, 1, 20),
      });
      res.json({
        ...result,
        integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.integrationAuthority,
        releaseAuthority: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.authority,
        productionEligible: true,
      });
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error ? error.message : "Unable to preview Spatial questions.",
      });
    }
  },
);

router.post(
  "/reasoning/spatial/runs",
  requireAdminPermission("content.generation.run"),
  async (req, res) => {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) {
      res.status(403).json({ error: "Administrator session required." });
      return;
    }
    try {
      const filters = requestFilters((req.body ?? {}) as Record<string, unknown>);
      const count = asCount(req.body?.count, 5, 50);
      const seed = asString(req.body?.seed) || `spa-review-${Date.now()}`;
      const result = generateSpatialProductionStudioBatchV1({ ...filters, seed, count });
      const requestSnapshot = {
        packageId: "SPA-001",
        language: "en",
        difficulty: filters.difficulty ?? null,
        qlId: filters.qlId ?? null,
        chapterCode: filters.chapterCode ?? null,
        count,
        seed,
        integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.integrationAuthority,
        releaseAuthority: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.authority,
        manualApprovalRequired: true,
        automaticStudentPublication: false,
        requestedByFirebaseUid: req.user?.id,
      };
      const persisted = await persistRun(result.questions, requestSnapshot, actorUserId);
      res.status(201).json({
        ...persisted,
        generationSystem: "reasoning-v1",
        packageId: "SPA-001",
        releaseAuthority: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.authority,
      });
    } catch (error) {
      console.error("Spatial Question Studio run failed", error);
      res.status(500).json({
        error: error instanceof Error ? error.message : "Unable to create Spatial review run.",
      });
    }
  },
);

router.get(
  "/reasoning/spatial/status",
  requireAdminPermission("content.generation.read"),
  async (_req, res) => {
    try {
      const rows = await sqlClient`
        SELECT
          count(*)::int AS "generationItemCount",
          count(*) FILTER (WHERE i.status = 'approved')::int AS "approvedItemCount",
          count(*) FILTER (WHERE i.accepted_question_id IS NOT NULL)::int AS "questionBankCount"
        FROM content.generation_run_items i
        INNER JOIN content.generation_item_versions v
          ON v.generation_item_id = i.id AND v.version_number = i.current_version_number
        WHERE v.payload ->> 'packageId' = 'SPA-001'
          AND v.payload ->> 'integrationAuthority' = ${SPATIAL_QUESTION_STUDIO_PACKAGE_V1.integrationAuthority}
      `;
      res.json({
        packageId: "SPA-001",
        permanentQlCount: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.permanentQlCount,
        generationItemCount: Number(rows[0]?.generationItemCount ?? 0),
        approvedItemCount: Number(rows[0]?.approvedItemCount ?? 0),
        questionBankCount: Number(rows[0]?.questionBankCount ?? 0),
        integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.integrationAuthority,
        releaseAuthority: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.authority,
        questionBankConversionEligibleAfterApproval: true,
        testEligibleAfterApproval: true,
        publiclyPublishableAfterApproval: true,
        automaticStudentPublication: false,
      });
    } catch (error) {
      res.status(500).json({ error: "Unable to load Spatial review status." });
    }
  },
);

export default router;
