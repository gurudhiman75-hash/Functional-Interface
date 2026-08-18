import { randomUUID } from "node:crypto";
import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";
import type { Sea001CheckpointId } from "../reasoning-v1/topics/SeatingArrangement/SEA-001/saturation/corpus.ts";
import type { Sea001PermanentQlId } from "../reasoning-v1/topics/SeatingArrangement/SEA-001/permanent/registry.ts";
import {
  SEA001_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
  SEA001_QUESTION_STUDIO_LANGUAGES,
  SEA001_QUESTION_STUDIO_PACKAGE,
  SEA001_QUESTION_STUDIO_PACKAGE_ID,
  SEA001_QUESTION_STUDIO_RUNTIME_MODE,
  generateSea001QuestionStudioBatch,
  type Sea001QuestionStudioLanguage,
} from "../reasoning-v1/topics/SeatingArrangement/SEA-001/question-studio/seating-question-studio-runtime.ts";

const router = Router();
const QL_IDS = new Set<string>(SEA001_QUESTION_STUDIO_PACKAGE.qlIds);
const CHECKPOINTS = new Set<string>(SEA001_QUESTION_STUDIO_PACKAGE.checkpoints);
const LANGUAGES = new Set<string>(SEA001_QUESTION_STUDIO_LANGUAGES);

type StudioBatch = ReturnType<typeof generateSea001QuestionStudioBatch>;
type StudioQuestion = StudioBatch["questions"][number];

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asCount(value: unknown, fallback = 5, max = 50): number {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
}

function publicRunCode(): string {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `SEA-${date}-${randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase()}`;
}

function requestFilters(source: Record<string, unknown>) {
  const language = asString(source.language) || "en";
  const qlId = asString(source.qlId);
  const checkpointId = asString(source.checkpointId);
  if (!LANGUAGES.has(language)) throw new Error(`Unsupported SEA-001 language '${language}'.`);
  if (qlId && !QL_IDS.has(qlId)) throw new Error(`Unsupported SEA-001 QL '${qlId}'.`);
  if (checkpointId && !CHECKPOINTS.has(checkpointId)) {
    throw new Error(`Unsupported SEA-001 checkpoint '${checkpointId}'.`);
  }
  return {
    language: language as Sea001QuestionStudioLanguage,
    qlId: qlId ? qlId as Sea001PermanentQlId : undefined,
    checkpointId: checkpointId ? checkpointId as Sea001CheckpointId : undefined,
  };
}

function explanationText(question: StudioQuestion): string {
  return [
    ...question.explanation.steps,
    question.explanation.conclusion,
  ].filter(Boolean).join("\n");
}

function productionPayload(question: StudioQuestion, generationContext: StudioBatch["generationContext"]) {
  const stem = `${question.sharedPrompt}\n\n${question.stem}`;
  return {
    text: stem,
    stem,
    sharedPrompt: question.sharedPrompt,
    options: question.options,
    optionDetails: question.optionDetails,
    correct: question.correctIndex,
    correctIndex: question.correctIndex,
    answer: question.answer,
    canonicalAnswer: question.answer,
    explanation: explanationText(question),
    richExplanation: question.explanation,
    decodedStatements: question.decodedStatements,
    reasoningGraph: question.reasoningGraph,
    renderer: question.renderer,
    difficulty: question.difficultyBand,
    difficultyLabel: question.difficultyBand,
    patternId: question.qlId,
    qlId: question.qlId,
    checkpointId: question.checkpointId,
    blueprintAuthorityId: question.blueprintAuthorityId,
    caseletId: question.caseletId,
    packageId: SEA001_QUESTION_STUDIO_PACKAGE_ID,
    packageCode: "SEA-001",
    canonicalProblemId: question.canonicalProblemId,
    canonicalItemId: question.canonicalItemId,
    questionLanguageId: question.questionLanguageId,
    questionId: question.questionId,
    topic: "Reasoning",
    subtopic: "Seating Arrangement",
    subject: "Reasoning Ability",
    language: question.language,
    locale: question.locale,
    seed: question.parameters.seed,
    contentFingerprint: question.contentFingerprint,
    runtimeMode: SEA001_QUESTION_STUDIO_RUNTIME_MODE,
    reviewStatus: "UNREVIEWED_DYNAMIC",
    questionBankStatus: "NOT_STORED",
    questionBankEligible: false,
    testEligibility: "INELIGIBLE",
    testEligible: false,
    mockTestEligible: false,
    productionStagingApproved: false,
    publiclyPublishable: false,
    manualApprovalRequired: true,
    automaticStudentPublication: false,
    integrationAuthority: SEA001_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
    traceability: question.traceability,
    sourceValidation: question.validation,
    generationContext: {
      ...generationContext,
      runtimeMode: SEA001_QUESTION_STUDIO_RUNTIME_MODE,
      reviewStatus: "UNREVIEWED_DYNAMIC",
      questionBankStatus: "NOT_STORED",
      questionBankEligible: false,
      testEligibility: "INELIGIBLE",
      testEligible: false,
      mockTestEligible: false,
      productionStagingApproved: false,
      publiclyPublishable: false,
      manualApprovalRequired: true,
      automaticStudentPublication: false,
      integrationAuthority: SEA001_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
    },
  };
}

async function persistRun(
  batch: StudioBatch,
  requestSnapshot: Record<string, unknown>,
  actorUserId: string,
) {
  if (!batch.questions.length) throw new Error("No SEA-001 questions matched the request.");
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
        'examtree', 'reasoning-v1-sea-001', 0, 0, 0, 0,
        ${timestamp}, ${timestamp}, ${timestamp}, ${timestamp}
      )
    `;

    for (let index = 0; index < batch.questions.length; index += 1) {
      const question = batch.questions[index]!;
      const itemId = randomUUID();
      const versionId = randomUUID();
      const payload = productionPayload(question, batch.generationContext);
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
        'question_studio.seating_run.created', 'generation_run', ${runId}::uuid,
        'SEA-001 dynamic candidate entered Question Studio review with delivery locks retained',
        ${`Created ${batch.questions.length} SEA-001 review items in ${publicCode}`},
        ${JSON.stringify({
          requestSnapshot,
          integrationAuthority: SEA001_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
          runtimeMode: SEA001_QUESTION_STUDIO_RUNTIME_MODE,
          questionBankStatus: "NOT_STORED",
          testEligibility: "INELIGIBLE",
          publiclyPublishable: false,
        })}::jsonb
      )
    `;

    await tx`
      INSERT INTO platform.outbox_events (
        id, aggregate_type, aggregate_id, event_type, payload
      ) VALUES (
        ${randomUUID()}::uuid, 'generation_run', ${runId}::uuid,
        'question_studio.seating_run.created',
        ${JSON.stringify({
          runId,
          publicCode,
          itemCount: batch.questions.length,
          packageId: SEA001_QUESTION_STUDIO_PACKAGE_ID,
          integrationAuthority: SEA001_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
        })}::jsonb
      )
    `;
  });

  return { id: runId, publicCode, status: "review" as const, itemCount: batch.questions.length };
}

router.use(authenticate);

router.get(
  "/reasoning/seating/package",
  requireAdminPermission("content.generation.read"),
  (_req, res) => {
    res.json({
      generationSystem: "reasoning-v1",
      activationMode: "DYNAMIC_REVIEW_ONLY",
      package: SEA001_QUESTION_STUDIO_PACKAGE,
      maxBatchSize: 50,
      permanentQlCount: SEA001_QUESTION_STUDIO_PACKAGE.permanentQlCount,
      databaseWriteEnabled: true,
      generationRunPersistenceAllowed: true,
      questionBankConversionEligibleAfterApproval: false,
      testEligibleAfterApproval: false,
      publiclyPublishableAfterApproval: false,
      automaticStudentPublication: false,
    });
  },
);

router.get(
  "/reasoning/seating/preview",
  requireAdminPermission("content.generation.read"),
  (req, res) => {
    try {
      const filters = requestFilters(req.query as Record<string, unknown>);
      const result = generateSea001QuestionStudioBatch({
        ...filters,
        seed: asString(req.query.seed) || "sea001-question-studio-preview",
        count: asCount(req.query.count, 1, 20),
      });
      res.json({
        ...result,
        integrationAuthority: SEA001_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
        productionEligible: false,
        reviewEligible: true,
      });
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error ? error.message : "Unable to preview SEA-001 questions.",
      });
    }
  },
);

router.post(
  "/reasoning/seating/runs",
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
      const seed = asString(req.body?.seed) || `sea001-review-${Date.now()}`;
      const batch = generateSea001QuestionStudioBatch({ ...filters, seed, count });
      const requestSnapshot = {
        packageId: SEA001_QUESTION_STUDIO_PACKAGE_ID,
        language: filters.language,
        qlId: filters.qlId ?? null,
        checkpointId: filters.checkpointId ?? null,
        count,
        seed,
        runtimeMode: SEA001_QUESTION_STUDIO_RUNTIME_MODE,
        integrationAuthority: SEA001_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
        questionBankStatus: "NOT_STORED",
        testEligibility: "INELIGIBLE",
        publiclyPublishable: false,
        requestedByFirebaseUid: req.user?.id,
      };
      const persisted = await persistRun(batch, requestSnapshot, actorUserId);
      res.status(201).json({
        ...persisted,
        generationSystem: "reasoning-v1",
        packageId: SEA001_QUESTION_STUDIO_PACKAGE_ID,
        runtimeMode: SEA001_QUESTION_STUDIO_RUNTIME_MODE,
        integrationAuthority: SEA001_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
        questionBankStatus: "NOT_STORED",
        testEligibility: "INELIGIBLE",
        publiclyPublishable: false,
      });
    } catch (error) {
      console.error("SEA-001 Question Studio run failed", error);
      res.status(500).json({
        error: error instanceof Error ? error.message : "Unable to create SEA-001 review run.",
      });
    }
  },
);

router.get(
  "/reasoning/seating/status",
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
        WHERE v.payload ->> 'packageId' = ${SEA001_QUESTION_STUDIO_PACKAGE_ID}
          AND v.payload ->> 'integrationAuthority' = ${SEA001_QUESTION_STUDIO_INTEGRATION_AUTHORITY}
      `;
      res.json({
        packageId: SEA001_QUESTION_STUDIO_PACKAGE_ID,
        permanentQlCount: SEA001_QUESTION_STUDIO_PACKAGE.permanentQlCount,
        supportedLanguages: SEA001_QUESTION_STUDIO_PACKAGE.supportedLanguages,
        generationItemCount: Number(rows[0]?.generationItemCount ?? 0),
        approvedItemCount: Number(rows[0]?.approvedItemCount ?? 0),
        questionBankCount: Number(rows[0]?.questionBankCount ?? 0),
        runtimeMode: SEA001_QUESTION_STUDIO_RUNTIME_MODE,
        integrationAuthority: SEA001_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
        questionBankConversionEligibleAfterApproval: false,
        testEligibleAfterApproval: false,
        publiclyPublishableAfterApproval: false,
        automaticStudentPublication: false,
      });
    } catch (error) {
      res.status(500).json({ error: "Unable to load SEA-001 Question Studio status." });
    }
  },
);

export default router;
