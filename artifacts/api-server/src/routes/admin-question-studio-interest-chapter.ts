import { randomUUID } from "node:crypto";
import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";
import {
  INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_LANGUAGES,
  INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_PACKAGE,
  INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_PACKAGE_ID,
  INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_VERSION,
  generateInt001ChapterAdminQuestionStudioBatch,
} from "../quant-v4/topics/Arithmetic/subtopics/Interest/INT-001/int-001-chapter-question-studio-admin-adapter-v1";

const router = Router();
const LANGUAGES = new Set<string>(INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_LANGUAGES);
const CHECKPOINTS = new Set(INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_PACKAGE.checkpoints.map((entry) => entry.checkpointId));
const QLS = new Set<string>(INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_PACKAGE.permanentQlIds);

type ChapterBatch = Awaited<ReturnType<typeof generateInt001ChapterAdminQuestionStudioBatch>>;
type ChapterQuestion = ChapterBatch["questions"][number];

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asCount(value: unknown, fallback = 5, max = 50) {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
}

function publicRunCode() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `INT-${date}-${randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase()}`;
}

function reviewPayload(question: ChapterQuestion) {
  const explanation = question.explanationLines.join("\n");
  return {
    text: question.stem,
    stem: question.stem,
    options: question.options,
    correct: question.correctIndex,
    correctIndex: question.correctIndex,
    answer: question.answer,
    canonicalAnswer: question.answer,
    explanation,
    richExplanation: { steps: question.explanationLines, conclusion: question.answer },
    difficulty: question.difficultyBand,
    difficultyLabel: question.difficultyBand,
    patternId: question.qlId,
    qlId: question.qlId,
    permanentQlId: question.qlId,
    packageId: INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_PACKAGE_ID,
    chapterId: INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_PACKAGE_ID,
    canonicalProblemId: question.checkpointId,
    checkpointId: question.checkpointId,
    sourceCanonicalProblemId: question.sourceCanonicalProblemId,
    canonicalItemId: question.canonicalItemId,
    questionLanguageId: question.questionLanguageId,
    questionId: question.questionId,
    topic: "Arithmetic",
    subtopic: "Interest",
    subject: "Quantitative Aptitude",
    language: question.language,
    locale: question.locale,
    seed: question.seed,
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
    chapterIntegrationAuthority: INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_VERSION,
    traceability: question.traceability,
    generationContext: {
      generationDomain: "quant-v4" as const,
      packageId: INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_PACKAGE_ID,
      checkpointId: question.checkpointId,
      sourceCanonicalProblemId: question.sourceCanonicalProblemId,
      runtimeMode: question.runtimeMode,
      reviewStatus: question.reviewStatus,
      questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY" as const,
      questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED" as const,
      integrationAuthority: question.integrationAuthority,
      chapterIntegrationAuthority: INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_VERSION,
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
  questions: readonly ChapterQuestion[],
  requestSnapshot: Record<string, unknown>,
  actorUserId: string,
) {
  if (questions.length === 0) throw new Error("No Interest questions matched the request.");
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
        'examtree', 'quant-v4-int-001-chapter-review', 0, 0, 0, 0,
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
          ${question.questionId}, ${timestamp}
        )
      `;
    }

    await tx`
      INSERT INTO platform.audit_events (
        id, actor_type, actor_user_id, action_key, entity_type, entity_id,
        reason, summary, metadata
      ) VALUES (
        ${randomUUID()}::uuid, 'user'::audit_actor_type, ${actorUserId}::uuid,
        'question_studio.interest_chapter_run.created', 'generation_run', ${runId}::uuid,
        'INT-001 entered the Question Studio review queue with Question Bank and student-delivery locks preserved',
        ${`Created ${questions.length} INT-001 review items in ${publicCode}`},
        ${JSON.stringify({
          requestSnapshot,
          chapterIntegrationAuthority: INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_VERSION,
          questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY",
          questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED",
          questionBankWritable: false,
          testEligible: false,
          mockTestEligible: false,
          publiclyPublishable: false,
        })}::jsonb
      )
    `;

    await tx`
      INSERT INTO platform.outbox_events (
        id, aggregate_type, aggregate_id, event_type, payload
      ) VALUES (
        ${randomUUID()}::uuid, 'generation_run', ${runId}::uuid,
        'question_studio.interest_chapter_run.created',
        ${JSON.stringify({
          runId,
          publicCode,
          itemCount: questions.length,
          packageId: INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_PACKAGE_ID,
          chapterIntegrationAuthority: INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_VERSION,
          reviewOnly: true,
        })}::jsonb
      )
    `;
  });

  return { id: runId, publicCode, status: "review", itemCount: questions.length };
}

function requestFrom(source: any) {
  const language = asString(source?.language) || "en";
  const checkpointId = asString(source?.checkpointId ?? source?.cpId).toUpperCase();
  const qlId = asString(source?.qlId).toUpperCase();
  if (!LANGUAGES.has(language)) throw new Error(`Unsupported language '${language}'.`);
  if (checkpointId && !CHECKPOINTS.has(checkpointId as any)) throw new Error(`Unsupported checkpoint '${checkpointId}'.`);
  if (qlId && !QLS.has(qlId)) throw new Error(`Unsupported QL '${qlId}'.`);
  return {
    language,
    checkpointId: checkpointId || undefined,
    qlId: qlId || undefined,
    seed: asString(source?.seed) || undefined,
    count: asCount(source?.count, 5, 50),
  };
}

router.use(authenticate);

router.get(
  "/quant/interest/package",
  requireAdminPermission("content.generation.read"),
  (_req, res) => {
    res.json({
      generationSystem: "quant-v4",
      activationMode: "REVIEW_ONLY",
      package: INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_PACKAGE,
      maxBatchSize: 50,
      permanentQlCount: INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_PACKAGE.permanentQlCount,
      checkpointCount: INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_PACKAGE.checkpointCount,
      supportedLanguages: INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_LANGUAGES,
      databaseWriteEnabled: true,
      persistenceAllowed: true,
      questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY",
      questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED",
      questionBankWriteEnabled: false,
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
    });
  },
);

router.get(
  "/quant/interest/preview",
  requireAdminPermission("content.generation.read"),
  async (req, res) => {
    try {
      const request = requestFrom(req.query);
      const result = await generateInt001ChapterAdminQuestionStudioBatch({ ...request, count: Math.min(20, request.count) });
      res.json({
        ...result,
        productionEligible: false,
        reviewOnly: true,
        questionBankWritable: false,
        testEligible: false,
        mockTestEligible: false,
        publiclyPublishable: false,
      });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Unable to preview Interest questions." });
    }
  },
);

router.post(
  "/quant/interest/runs",
  requireAdminPermission("content.generation.run"),
  async (req, res) => {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) {
      res.status(403).json({ error: "Administrator session required." });
      return;
    }
    try {
      const request = requestFrom(req.body);
      const result = await generateInt001ChapterAdminQuestionStudioBatch(request);
      const persisted = await persistRun(
        result.questions,
        {
          packageId: INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_PACKAGE_ID,
          chapterId: INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_PACKAGE_ID,
          checkpointId: request.checkpointId ?? null,
          language: request.language,
          qlId: request.qlId ?? null,
          count: request.count,
          seed: request.seed ?? null,
          chapterIntegrationAuthority: INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_VERSION,
          questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY",
          questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED",
          reviewOnly: true,
          questionBankWritable: false,
          testEligible: false,
          mockTestEligible: false,
          publiclyPublishable: false,
          requestedByFirebaseUid: req.user?.id,
        },
        actorUserId,
      );
      res.status(201).json({
        ...persisted,
        generationSystem: "quant-v4",
        packageId: INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_PACKAGE_ID,
        checkpointId: request.checkpointId ?? null,
        chapterIntegrationAuthority: INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_VERSION,
        reviewOnly: true,
        questionBankWritable: false,
        testEligible: false,
        mockTestEligible: false,
        publiclyPublishable: false,
      });
    } catch (error) {
      console.error("Interest chapter Question Studio run failed", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Unable to create Interest review run." });
    }
  },
);

router.get(
  "/quant/interest/status",
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
        WHERE v.payload ->> 'packageId' = ${INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_PACKAGE_ID}
          AND v.payload ->> 'chapterIntegrationAuthority' = ${INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_VERSION}
      `;
      res.json({
        packageId: INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_PACKAGE_ID,
        permanentQlCount: INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_PACKAGE.permanentQlCount,
        checkpointCount: INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_PACKAGE.checkpointCount,
        generationItemCount: Number(rows[0]?.generationItemCount ?? 0),
        approvedItemCount: Number(rows[0]?.approvedItemCount ?? 0),
        questionBankCount: Number(rows[0]?.questionBankCount ?? 0),
        chapterIntegrationAuthority: INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_VERSION,
        questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY",
        questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED",
        reviewOnly: true,
        questionBankWritable: false,
        testEligible: false,
        mockTestEligible: false,
        publiclyPublishable: false,
        automaticStudentPublication: false,
      });
    } catch (error) {
      console.error("Interest chapter Question Studio status failed", error);
      res.status(500).json({ error: "Unable to load Interest review status." });
    }
  },
);

export default router;
