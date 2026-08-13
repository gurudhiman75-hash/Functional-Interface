import { randomUUID } from "node:crypto";
import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";
import {
  MEN_CP009_QUESTION_STUDIO_DIFFICULTIES,
  MEN_CP009_QUESTION_STUDIO_FREEZE_ID,
  MEN_CP009_QUESTION_STUDIO_LANGUAGES,
  MEN_CP009_QUESTION_STUDIO_PACKAGE_ID,
  MEN_CP009_QUESTION_STUDIO_REVIEW_PACKAGE,
  previewMenCp009QuestionStudioReview,
  type MenCp009QuestionStudioDifficulty,
  type MenCp009QuestionStudioLanguage,
  type MenCp009QuestionStudioQlId,
} from "../quant-v4/topics/AdvancedMathematics/subtopics/Mensuration/MEN-002/MEN-CP-009/question-studio-review-adapter";
import { MEN_CP_009_FROZEN_QLS_V2 } from "../quant-v4/topics/AdvancedMathematics/subtopics/Mensuration/MEN-002/MEN-CP-009/coverage-v2/registry";

const router = Router();
const LANGUAGES = new Set<string>(MEN_CP009_QUESTION_STUDIO_LANGUAGES);
const DIFFICULTIES = new Set<string>(MEN_CP009_QUESTION_STUDIO_DIFFICULTIES);
const QL_IDS = new Set<string>(MEN_CP_009_FROZEN_QLS_V2.map((row) => row.qlId));

type PreviewResult = ReturnType<typeof previewMenCp009QuestionStudioReview>;
type PreviewQuestion = PreviewResult["questions"][number];

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asCount(value: unknown, fallback = 5, max = 50) {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
}

function publicRunCode() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `MEN009-${date}-${randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase()}`;
}

function reviewPayload(question: PreviewQuestion) {
  return {
    text: question.stem,
    stem: question.stem,
    options: question.options,
    correct: question.correctIndex,
    correctIndex: question.correctIndex,
    answer: question.answer,
    canonicalAnswer: question.answer,
    explanation: [...question.explanation.steps].join("\n"),
    richExplanation: question.explanation,
    renderer: question.renderer,
    difficulty: question.difficultyBand,
    difficultyLabel: question.difficultyBand,
    patternId: question.qlId,
    qlId: question.qlId,
    packageId: MEN_CP009_QUESTION_STUDIO_PACKAGE_ID,
    canonicalProblemId: question.canonicalProblemId,
    canonicalItemId: question.canonicalItemId,
    questionLanguageId: question.questionLanguageId,
    questionId: question.questionId,
    topic: "Advanced Mathematics",
    subtopic: "Mensuration",
    subject: "Quantitative Aptitude",
    language: question.language,
    locale: question.locale,
    seed: question.parameters.seed,
    runtimeMode: question.runtimeMode,
    reviewStatus: question.reviewStatus,
    questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY" as const,
    questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED" as const,
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
      generationDomain: "quant-v4" as const,
      packageId: MEN_CP009_QUESTION_STUDIO_PACKAGE_ID,
      checkpointId: question.canonicalProblemId,
      runtimeMode: question.runtimeMode,
      reviewStatus: question.reviewStatus,
      questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY" as const,
      questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED" as const,
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
  questions: readonly PreviewQuestion[],
  requestSnapshot: Record<string, unknown>,
  actorUserId: string,
) {
  if (!questions.length) throw new Error("No MEN-CP-009 questions matched the request.");

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
        'examtree', 'quant-v4-men-cp009-approved-frozen-review', 0, 0, 0, 0,
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
        'question_studio.mensuration_cp009_run.created', 'generation_run', ${runId}::uuid,
        'MEN-CP-009 entered the Question Studio review queue with downstream release locks preserved',
        ${`Created ${questions.length} MEN-CP-009 review items in ${publicCode}`},
        ${JSON.stringify({
          requestSnapshot,
          integrationAuthority: MEN_CP009_QUESTION_STUDIO_FREEZE_ID,
          questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY",
          questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED",
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
        'question_studio.mensuration_cp009_run.created',
        ${JSON.stringify({
          runId,
          publicCode,
          itemCount: questions.length,
          packageId: MEN_CP009_QUESTION_STUDIO_PACKAGE_ID,
          checkpointId: "MEN-CP-009",
          reviewOnly: true,
        })}::jsonb
      )
    `;
  });

  return { id: runId, publicCode, status: "review", itemCount: questions.length };
}

router.use(authenticate);

router.get(
  "/quant/mensuration/cp009/package",
  requireAdminPermission("content.generation.read"),
  (_req, res) => {
    res.json({
      generationSystem: "quant-v4",
      activationMode: "REVIEW_ONLY",
      package: MEN_CP009_QUESTION_STUDIO_REVIEW_PACKAGE,
      maxBatchSize: 50,
      permanentQlCount: MEN_CP_009_FROZEN_QLS_V2.length,
      approvedReviewPayloadCount: MEN_CP009_QUESTION_STUDIO_REVIEW_PACKAGE.approvedReviewPayloadCount,
      supportedLanguages: MEN_CP009_QUESTION_STUDIO_LANGUAGES,
      databaseWriteEnabled: true,
      persistenceAllowed: true,
      questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY",
      questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED",
      questionBankWriteEnabled: false,
      testEligible: false,
      publiclyPublishable: false,
      bulkSyncSupported: false,
    });
  },
);

router.get(
  "/quant/mensuration/cp009/preview",
  requireAdminPermission("content.generation.read"),
  (req, res) => {
    try {
      const language = (asString(req.query.language) || "en") as MenCp009QuestionStudioLanguage;
      const difficulty = asString(req.query.difficulty);
      const qlId = asString(req.query.qlId);
      if (!LANGUAGES.has(language)) throw new Error(`Unsupported language '${language}'.`);
      if (difficulty && !DIFFICULTIES.has(difficulty)) throw new Error(`Unsupported difficulty '${difficulty}'.`);
      if (qlId && !QL_IDS.has(qlId)) throw new Error(`Unsupported QL '${qlId}'.`);

      const result = previewMenCp009QuestionStudioReview({
        language,
        difficulty: difficulty ? difficulty as MenCp009QuestionStudioDifficulty : undefined,
        qlId: qlId ? qlId as MenCp009QuestionStudioQlId : undefined,
        seed: asString(req.query.seed) || undefined,
        count: asCount(req.query.count, 1, 20),
      });
      res.json({ ...result, productionEligible: false, reviewOnly: true });
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error ? error.message : "Unable to preview MEN-CP-009 questions.",
      });
    }
  },
);

router.post(
  "/quant/mensuration/cp009/runs",
  requireAdminPermission("content.generation.run"),
  async (req, res) => {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) {
      res.status(403).json({ error: "Administrator session required." });
      return;
    }

    try {
      const language = (asString(req.body?.language) || "en") as MenCp009QuestionStudioLanguage;
      const difficulty = asString(req.body?.difficulty);
      const qlId = asString(req.body?.qlId);
      if (!LANGUAGES.has(language)) throw new Error(`Unsupported language '${language}'.`);
      if (difficulty && !DIFFICULTIES.has(difficulty)) throw new Error(`Unsupported difficulty '${difficulty}'.`);
      if (qlId && !QL_IDS.has(qlId)) throw new Error(`Unsupported QL '${qlId}'.`);

      const count = asCount(req.body?.count, 5, 50);
      const seed = asString(req.body?.seed) || undefined;
      const result = previewMenCp009QuestionStudioReview({
        language,
        difficulty: difficulty ? difficulty as MenCp009QuestionStudioDifficulty : undefined,
        qlId: qlId ? qlId as MenCp009QuestionStudioQlId : undefined,
        seed,
        count,
      });
      const persisted = await persistRun(
        result.questions,
        {
          packageId: MEN_CP009_QUESTION_STUDIO_PACKAGE_ID,
          checkpointId: "MEN-CP-009",
          language,
          difficulty: difficulty || null,
          qlId: qlId || null,
          count,
          seed: seed || null,
          integrationAuthority: MEN_CP009_QUESTION_STUDIO_FREEZE_ID,
          questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY",
          questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED",
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
        generationSystem: "quant-v4",
        packageId: MEN_CP009_QUESTION_STUDIO_PACKAGE_ID,
        checkpointId: "MEN-CP-009",
        reviewOnly: true,
        questionBankWritable: false,
        testEligible: false,
        publiclyPublishable: false,
      });
    } catch (error) {
      console.error("MEN-CP-009 Question Studio run failed", error);
      res.status(500).json({
        error: error instanceof Error ? error.message : "Unable to create MEN-CP-009 review run.",
      });
    }
  },
);

router.get(
  "/quant/mensuration/cp009/status",
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
        WHERE v.payload ->> 'packageId' = ${MEN_CP009_QUESTION_STUDIO_PACKAGE_ID}
          AND v.payload ->> 'canonicalProblemId' = 'MEN-CP-009'
          AND v.payload ->> 'integrationAuthority' = ${MEN_CP009_QUESTION_STUDIO_FREEZE_ID}
      `;
      res.json({
        packageId: MEN_CP009_QUESTION_STUDIO_PACKAGE_ID,
        checkpointId: "MEN-CP-009",
        permanentQlCount: MEN_CP_009_FROZEN_QLS_V2.length,
        approvedReviewPayloadCount: MEN_CP009_QUESTION_STUDIO_REVIEW_PACKAGE.approvedReviewPayloadCount,
        generationItemCount: Number(rows[0]?.generationItemCount ?? 0),
        approvedItemCount: Number(rows[0]?.approvedItemCount ?? 0),
        questionBankCount: Number(rows[0]?.questionBankCount ?? 0),
        integrationAuthority: MEN_CP009_QUESTION_STUDIO_FREEZE_ID,
        questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY",
        questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED",
        reviewOnly: true,
        questionBankWritable: false,
        testEligible: false,
        publiclyPublishable: false,
        automaticStudentPublication: false,
      });
    } catch (error) {
      console.error("MEN-CP-009 Question Studio status failed", error);
      res.status(500).json({ error: "Unable to load MEN-CP-009 review status." });
    }
  },
);

export default router;
