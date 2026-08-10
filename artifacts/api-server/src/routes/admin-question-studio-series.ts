import { randomUUID } from "node:crypto";
import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";
import {
  SER_001_PACKAGE_ID,
  SER_001_QUESTION_STUDIO_DIFFICULTIES,
  SER_001_QUESTION_STUDIO_LANGUAGES,
  SER_001_QUESTION_STUDIO_REVIEW_PACKAGE,
  previewSer001QuestionStudioReview,
  type Ser001QuestionStudioDifficulty,
  type Ser001QuestionStudioLanguage,
} from "../reasoning-v1/topics/Series/SER-001/SER-CP-007-QUESTION-STUDIO-INTEGRATION/question-studio-review-adapter";
import {
  SER_CP007_PERMANENT_QL_IDS,
  type SerCp007PermanentQlId,
} from "../reasoning-v1/topics/Series/SER-001/SER-PERMANENT-QL-REGISTRY";

const router = Router();
const LANGUAGES = new Set<string>(SER_001_QUESTION_STUDIO_LANGUAGES);
const DIFFICULTIES = new Set<string>(SER_001_QUESTION_STUDIO_DIFFICULTIES);
const QL_IDS = new Set<string>(SER_CP007_PERMANENT_QL_IDS);

type SeriesPreviewResult = ReturnType<typeof previewSer001QuestionStudioReview>;
type SeriesPreviewQuestion = SeriesPreviewResult["questions"][number];

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asCount(value: unknown, fallback = 5, max = 50) {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
}

function publicRunCode() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `SER-${date}-${randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase()}`;
}

function explanationText(question: SeriesPreviewQuestion) {
  return [
    ...question.explanation.steps,
    question.explanation.conclusion
      ? `Conclusion: ${question.explanation.conclusion}`
      : "",
  ].filter(Boolean).join("\n");
}

function reviewPayload(question: SeriesPreviewQuestion) {
  return {
    text: question.stem,
    stem: question.stem,
    options: question.options,
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
    packageId: SER_001_PACKAGE_ID,
    canonicalProblemId: question.canonicalProblemId,
    canonicalItemId: question.canonicalItemId,
    questionLanguageId: question.questionLanguageId,
    questionId: question.questionId,
    topic: "Reasoning",
    subtopic: "Series",
    subject: "Reasoning Ability",
    language: question.language,
    locale: question.locale,
    seed: question.parameters.seed,
    runtimeMode: question.runtimeMode,
    reviewStatus: question.reviewStatus,
    questionBankStatus: "NOT_STORED" as const,
    questionBankWritable: false as const,
    testEligibility: "INELIGIBLE" as const,
    testEligible: false as const,
    publiclyPublishable: false as const,
    mockTestEligible: false as const,
    manualApprovalRequired: true as const,
    automaticStudentPublication: false as const,
    integrationAuthority: question.integrationAuthority,
    traceability: question.traceability,
    sourceValidation: question.validation,
    generationContext: {
      generationDomain: "reasoning-v1" as const,
      packageId: SER_001_PACKAGE_ID,
      runtimeMode: question.runtimeMode,
      reviewStatus: question.reviewStatus,
      integrationAuthority: question.integrationAuthority,
      questionBankStatus: "NOT_STORED" as const,
      questionBankWritable: false as const,
      testEligibility: "INELIGIBLE" as const,
      testEligible: false as const,
      publiclyPublishable: false as const,
      mockTestEligible: false as const,
      persistenceAllowed: true as const,
      reviewOnly: true as const,
      manualApprovalRequired: true as const,
      automaticStudentPublication: false as const,
      permanentQlId: question.qlId,
    },
  };
}

async function persistRun(
  questions: readonly SeriesPreviewQuestion[],
  requestSnapshot: Record<string, unknown>,
  actorUserId: string,
) {
  if (questions.length === 0) {
    throw new Error("No SER-001 questions matched the request.");
  }

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
        'examtree', 'reasoning-v1-ser-001', 0, 0, 0, 0,
        ${timestamp}, ${timestamp}, ${timestamp}, ${timestamp}
      )
    `;

    for (let index = 0; index < questions.length; index += 1) {
      const question = questions[index]!;
      const itemId = randomUUID();
      const versionId = randomUUID();
      const payload = reviewPayload(question);

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
        'question_studio.series_run.created', 'generation_run', ${runId}::uuid,
        'SER-001 entered the Question Studio review queue with release locks preserved',
        ${`Created ${questions.length} SER-001 review items in ${publicCode}`},
        ${JSON.stringify({
          requestSnapshot,
          integrationAuthority: SER_001_QUESTION_STUDIO_REVIEW_PACKAGE.integrationAuthority,
          questionBankWritable: false,
          testEligible: false,
          publiclyPublishable: false,
        })}::jsonb
      )
    `;

    await tx`
      INSERT INTO platform.outbox_events (
        id, aggregate_type, aggregate_id, event_type, payload
      ) VALUES (
        ${randomUUID()}::uuid, 'generation_run', ${runId}::uuid,
        'question_studio.series_run.created',
        ${JSON.stringify({
          runId,
          publicCode,
          itemCount: questions.length,
          packageId: SER_001_PACKAGE_ID,
          reviewOnly: true,
        })}::jsonb
      )
    `;
  });

  return { id: runId, publicCode, status: "review", itemCount: questions.length };
}

router.use(authenticate);

router.get(
  "/reasoning/series/package",
  requireAdminPermission("content.generation.read"),
  (_req, res) => {
    res.json({
      generationSystem: "reasoning-v1",
      activationMode: "REVIEW_ONLY",
      package: SER_001_QUESTION_STUDIO_REVIEW_PACKAGE,
      maxBatchSize: 50,
      permanentQlCount: SER_CP007_PERMANENT_QL_IDS.length,
      frozenTemplateCount: SER_001_QUESTION_STUDIO_REVIEW_PACKAGE.frozenTemplateCount,
      multilingualProofPayloadCount:
        SER_001_QUESTION_STUDIO_REVIEW_PACKAGE.multilingualProofPayloadCount,
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
  "/reasoning/series/preview",
  requireAdminPermission("content.generation.read"),
  (req, res) => {
    try {
      const language = (asString(req.query.language) || "en") as Ser001QuestionStudioLanguage;
      const difficulty = asString(req.query.difficulty);
      const qlId = asString(req.query.qlId);
      if (!LANGUAGES.has(language)) throw new Error(`Unsupported language '${language}'.`);
      if (difficulty && !DIFFICULTIES.has(difficulty)) throw new Error(`Unsupported difficulty '${difficulty}'.`);
      if (qlId && !QL_IDS.has(qlId)) throw new Error(`Unsupported QL '${qlId}'.`);

      const result = previewSer001QuestionStudioReview({
        language,
        difficulty: difficulty ? difficulty as Ser001QuestionStudioDifficulty : undefined,
        qlId: qlId ? qlId as SerCp007PermanentQlId : undefined,
        seed: asString(req.query.seed) || undefined,
        count: asCount(req.query.count, 1, 20),
      });
      res.json({
        ...result,
        integrationAuthority: SER_001_QUESTION_STUDIO_REVIEW_PACKAGE.integrationAuthority,
        productionEligible: false,
        reviewOnly: true,
      });
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error ? error.message : "Unable to preview Series questions.",
      });
    }
  },
);

router.post(
  "/reasoning/series/runs",
  requireAdminPermission("content.generation.run"),
  async (req, res) => {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) {
      res.status(403).json({ error: "Administrator session required." });
      return;
    }

    try {
      const language = (asString(req.body?.language) || "en") as Ser001QuestionStudioLanguage;
      const difficulty = asString(req.body?.difficulty);
      const qlId = asString(req.body?.qlId);
      if (!LANGUAGES.has(language)) throw new Error(`Unsupported language '${language}'.`);
      if (difficulty && !DIFFICULTIES.has(difficulty)) throw new Error(`Unsupported difficulty '${difficulty}'.`);
      if (qlId && !QL_IDS.has(qlId)) throw new Error(`Unsupported QL '${qlId}'.`);

      const count = asCount(req.body?.count, 5, 50);
      const seed = asString(req.body?.seed) || undefined;
      const result = previewSer001QuestionStudioReview({
        language,
        difficulty: difficulty ? difficulty as Ser001QuestionStudioDifficulty : undefined,
        qlId: qlId ? qlId as SerCp007PermanentQlId : undefined,
        seed,
        count,
      });
      const persisted = await persistRun(
        result.questions,
        {
          packageId: SER_001_PACKAGE_ID,
          language,
          difficulty: difficulty || null,
          qlId: qlId || null,
          count,
          seed: seed || null,
          integrationAuthority: SER_001_QUESTION_STUDIO_REVIEW_PACKAGE.integrationAuthority,
          reviewOnly: true,
          questionBankWritable: false,
          testEligible: false,
          publiclyPublishable: false,
          requestedByFirebaseUid: req.user?.id,
        },
        actorUserId,
      );
      res.status(201).json({
        ...persisted,
        generationSystem: "reasoning-v1",
        packageId: SER_001_PACKAGE_ID,
        reviewOnly: true,
        questionBankWritable: false,
        testEligible: false,
        publiclyPublishable: false,
      });
    } catch (error) {
      console.error("Series Question Studio run failed", error);
      res.status(500).json({
        error: error instanceof Error ? error.message : "Unable to create Series review run.",
      });
    }
  },
);

router.get(
  "/reasoning/series/status",
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
        WHERE v.payload ->> 'packageId' = ${SER_001_PACKAGE_ID}
          AND v.payload ->> 'integrationAuthority' = ${SER_001_QUESTION_STUDIO_REVIEW_PACKAGE.integrationAuthority}
      `;
      res.json({
        packageId: SER_001_PACKAGE_ID,
        permanentQlCount: SER_CP007_PERMANENT_QL_IDS.length,
        frozenTemplateCount: SER_001_QUESTION_STUDIO_REVIEW_PACKAGE.frozenTemplateCount,
        generationItemCount: Number(rows[0]?.generationItemCount ?? 0),
        approvedItemCount: Number(rows[0]?.approvedItemCount ?? 0),
        questionBankCount: Number(rows[0]?.questionBankCount ?? 0),
        integrationAuthority: SER_001_QUESTION_STUDIO_REVIEW_PACKAGE.integrationAuthority,
        reviewOnly: true,
        questionBankWritable: false,
        testEligible: false,
        publiclyPublishable: false,
        automaticStudentPublication: false,
      });
    } catch (error) {
      res.status(500).json({ error: "Unable to load Series review status." });
    }
  },
);

export default router;
