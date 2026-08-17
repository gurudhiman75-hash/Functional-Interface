import { randomUUID } from "node:crypto";
import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";
import type { WorCheckpointId } from "../reasoning-v1/topics/Word-Dictionary-Order/WOR-001/foundation/types";
import { buildWor001QuestionStudioPayload } from "../reasoning-v1/topics/Word-Dictionary-Order/WOR-001/question-studio-payload";
import {
  WOR_001_QUESTION_STUDIO_CATALOG,
  WOR_001_QUESTION_STUDIO_DIFFICULTIES,
  WOR_001_QUESTION_STUDIO_LANGUAGES,
  WOR_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
  WOR_001_QUESTION_STUDIO_REVIEW_PACKAGE,
  previewWor001QuestionStudioReview,
  type WorQuestionStudioDifficulty,
  type WorQuestionStudioLanguage,
  type WorQuestionStudioReviewQuestion,
} from "../reasoning-v1/topics/Word-Dictionary-Order/WOR-001/question-studio-review";

const router = Router();
const LANGUAGES = new Set<string>(WOR_001_QUESTION_STUDIO_LANGUAGES);
const DIFFICULTIES = new Set<string>(WOR_001_QUESTION_STUDIO_DIFFICULTIES);
const CHECKPOINTS = new Set<string>(WOR_001_QUESTION_STUDIO_REVIEW_PACKAGE.checkpoints.map((entry) => entry.checkpointId));
const PROTOTYPES = new Set<string>(WOR_001_QUESTION_STUDIO_CATALOG.map((entry) => entry.prototypeId));

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asCount(value: unknown, fallback = 5, max = 50) {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
}

function publicRunCode() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `WOR-${date}-${randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase()}`;
}

async function persistRun(
  questions: readonly WorQuestionStudioReviewQuestion[],
  requestSnapshot: Record<string, unknown>,
  actorUserId: string,
) {
  if (questions.length === 0) throw new Error("No WOR-001 questions matched the request.");
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
        'examtree', 'reasoning-v1-wor-001', 0, 0, 0, 0,
        ${timestamp}, ${timestamp}, ${timestamp}, ${timestamp}
      )
    `;

    for (let index = 0; index < questions.length; index += 1) {
      const question = questions[index]!;
      const itemId = randomUUID();
      const versionId = randomUUID();
      const payload = buildWor001QuestionStudioPayload(question);
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
        'question_studio.wor_001_review.created', 'generation_run', ${runId}::uuid,
        'WOR-001 entered the shared Question Studio review queue with downstream release locks preserved',
        ${`Created ${questions.length} WOR-001 review items in ${publicCode}`},
        ${JSON.stringify({
          requestSnapshot,
          integrationAuthority: WOR_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
          permanentQlCount: 0,
          questionBankWritable: false,
          testEligible: false,
          publiclyPublishable: false,
          releaseFreezeStatus: "PENDING_NATIVE_SIGNOFF_AND_PERMANENT_QL",
        })}::jsonb
      )
    `;

    await tx`
      INSERT INTO platform.outbox_events (
        id, aggregate_type, aggregate_id, event_type, payload
      ) VALUES (
        ${randomUUID()}::uuid, 'generation_run', ${runId}::uuid,
        'question_studio.wor_001_review.created',
        ${JSON.stringify({
          runId,
          publicCode,
          itemCount: questions.length,
          packageId: "WOR-001",
          reviewOnly: true,
        })}::jsonb
      )
    `;
  });

  return { id: runId, publicCode, status: "review", itemCount: questions.length };
}

function parseFilters(source: Record<string, unknown>) {
  const language = (asString(source.language) || "en") as WorQuestionStudioLanguage;
  const checkpointId = asString(source.checkpointId);
  const prototypeId = asString(source.prototypeId);
  const difficulty = asString(source.difficulty);
  if (!LANGUAGES.has(language)) throw new Error(`Unsupported WOR-001 language '${language}'.`);
  if (checkpointId && !CHECKPOINTS.has(checkpointId)) throw new Error(`Unsupported WOR-001 checkpoint '${checkpointId}'.`);
  if (prototypeId && !PROTOTYPES.has(prototypeId)) throw new Error(`Unsupported WOR-001 prototype '${prototypeId}'.`);
  if (difficulty && !DIFFICULTIES.has(difficulty)) throw new Error(`Unsupported WOR-001 difficulty '${difficulty}'.`);
  return {
    language,
    checkpointId: checkpointId ? checkpointId as WorCheckpointId : undefined,
    prototypeId: prototypeId || undefined,
    difficulty: difficulty ? difficulty as WorQuestionStudioDifficulty : undefined,
  };
}

router.use(authenticate);

router.get(
  "/reasoning/word-dictionary-order/package",
  requireAdminPermission("content.generation.read"),
  (_req, res) => {
    res.json({
      generationSystem: "reasoning-v1",
      activationMode: "QUESTION_STUDIO_REVIEW_CONNECTED",
      package: WOR_001_QUESTION_STUDIO_REVIEW_PACKAGE,
      maxBatchSize: 50,
      databaseWriteEnabled: true,
      persistenceAllowed: true,
      questionBankWriteEnabled: false,
      testEligible: false,
      publiclyPublishable: false,
      bulkSyncSupported: false,
    });
  },
);

router.get(
  "/reasoning/word-dictionary-order/preview",
  requireAdminPermission("content.generation.read"),
  (req, res) => {
    try {
      const filters = parseFilters(req.query as Record<string, unknown>);
      const result = previewWor001QuestionStudioReview({
        ...filters,
        seed: asString(req.query.seed) || undefined,
        count: asCount(req.query.count, 1, 20),
      });
      res.json({
        ...result,
        productionEligible: false,
        questionBankWritable: false,
        testEligible: false,
        publiclyPublishable: false,
      });
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error ? error.message : "Unable to preview WOR-001 questions.",
      });
    }
  },
);

router.post(
  "/reasoning/word-dictionary-order/runs",
  requireAdminPermission("content.generation.run"),
  async (req, res) => {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) {
      res.status(403).json({ error: "Administrator session required." });
      return;
    }
    try {
      const filters = parseFilters((req.body ?? {}) as Record<string, unknown>);
      const count = asCount(req.body?.count, 5, 50);
      const seed = asString(req.body?.seed) || undefined;
      const result = previewWor001QuestionStudioReview({
        ...filters,
        seed,
        count,
      });
      const persisted = await persistRun(
        result.questions,
        {
          packageId: "WOR-001",
          chapterId: "WOR-001",
          checkpointId: filters.checkpointId ?? null,
          prototypeId: filters.prototypeId ?? null,
          language: filters.language,
          difficulty: filters.difficulty ?? null,
          count,
          seed: seed ?? null,
          subject: "Reasoning Ability",
          topic: "Reasoning",
          subtopic: "Word & Dictionary Order",
          integrationAuthority: WOR_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
          questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY",
          questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED",
          reviewOnly: true,
          permanentQlCount: 0,
          questionBankWritable: false,
          testEligible: false,
          publiclyPublishable: false,
          releaseFreezeStatus: "PENDING_NATIVE_SIGNOFF_AND_PERMANENT_QL",
          requestedByFirebaseUid: req.user?.id,
        },
        actorUserId,
      );
      res.status(201).json({
        ...persisted,
        generationSystem: "reasoning-v1",
        packageId: "WOR-001",
        reviewOnly: true,
        permanentQlCount: 0,
        questionBankWritable: false,
        testEligible: false,
        publiclyPublishable: false,
      });
    } catch (error) {
      console.error("WOR-001 Question Studio review run failed", error);
      res.status(500).json({
        error: error instanceof Error ? error.message : "Unable to create WOR-001 review run.",
      });
    }
  },
);

router.get(
  "/reasoning/word-dictionary-order/status",
  requireAdminPermission("content.generation.read"),
  async (_req, res) => {
    try {
      const rows = await sqlClient`
        SELECT
          count(*)::int AS "generationItemCount",
          count(*) FILTER (WHERE i.status = 'approved')::int AS "approvedItemCount",
          count(*) FILTER (WHERE i.status = 'needs_fix')::int AS "needsFixItemCount",
          count(*) FILTER (WHERE i.status = 'rejected')::int AS "rejectedItemCount",
          count(*) FILTER (WHERE i.accepted_question_id IS NOT NULL)::int AS "questionBankCount"
        FROM content.generation_run_items i
        INNER JOIN content.generation_item_versions v
          ON v.generation_item_id = i.id AND v.version_number = i.current_version_number
        WHERE v.payload ->> 'packageId' = 'WOR-001'
          AND v.payload ->> 'integrationAuthority' = ${WOR_001_QUESTION_STUDIO_REVIEW_AUTHORITY}
      `;
      res.json({
        packageId: "WOR-001",
        checkpointCount: WOR_001_QUESTION_STUDIO_REVIEW_PACKAGE.checkpointCount,
        prototypeCount: WOR_001_QUESTION_STUDIO_REVIEW_PACKAGE.prototypeCount,
        permanentQlCount: 0,
        generationItemCount: Number(rows[0]?.generationItemCount ?? 0),
        approvedItemCount: Number(rows[0]?.approvedItemCount ?? 0),
        needsFixItemCount: Number(rows[0]?.needsFixItemCount ?? 0),
        rejectedItemCount: Number(rows[0]?.rejectedItemCount ?? 0),
        questionBankCount: Number(rows[0]?.questionBankCount ?? 0),
        integrationAuthority: WOR_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
        questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY",
        questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED",
        questionStudioVisible: true,
        reviewOnly: true,
        questionBankWritable: false,
        testEligible: false,
        publiclyPublishable: false,
        automaticStudentPublication: false,
        releaseFreezeStatus: "PENDING_NATIVE_SIGNOFF_AND_PERMANENT_QL",
      });
    } catch (error) {
      console.error("WOR-001 Question Studio status failed", error);
      res.status(500).json({ error: "Unable to load WOR-001 Question Studio status." });
    }
  },
);

export default router;
