import { randomUUID } from "node:crypto";
import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";
import {
  INT_CP007_QUESTION_STUDIO_DIFFICULTIES,
  INT_CP007_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
  INT_CP007_QUESTION_STUDIO_LANGUAGES,
  INT_CP007_QUESTION_STUDIO_PACKAGE_ID,
  INT_CP007_QUESTION_STUDIO_REVIEW_PACKAGE,
  previewIntCp007QuestionStudioReview,
  type IntCp007QuestionStudioDifficulty,
  type IntCp007QuestionStudioLanguage,
} from "../quant-v4/topics/Arithmetic/subtopics/Interest/INT-001/cp007-question-studio-review-adapter";
import { INT_CP007_QL_IDS, type IntCp007QlId } from "../quant-v4/topics/Arithmetic/subtopics/Interest/INT-001/cp007-scheme-equivalence-runtime-v3-final";

const router = Router();
const LANGUAGES = new Set<string>(INT_CP007_QUESTION_STUDIO_LANGUAGES);
const DIFFICULTIES = new Set<string>(INT_CP007_QUESTION_STUDIO_DIFFICULTIES);
const QL_IDS = new Set<string>(INT_CP007_QL_IDS);

type PreviewResult = ReturnType<typeof previewIntCp007QuestionStudioReview>;
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
  return `INT7-${date}-${randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase()}`;
}

function explanationText(question: PreviewQuestion) {
  return [
    question.explanation.keyIdea,
    ...question.explanation.steps,
    question.explanation.conclusion,
  ].filter(Boolean).join("\n");
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
    explanation: explanationText(question),
    richExplanation: question.explanation,
    renderer: question.renderer,
    difficulty: question.difficultyBand,
    difficultyLabel: question.difficultyBand,
    patternId: question.qlId,
    qlId: question.qlId,
    packageId: INT_CP007_QUESTION_STUDIO_PACKAGE_ID,
    canonicalProblemId: question.canonicalProblemId,
    canonicalItemId: question.canonicalItemId,
    questionLanguageId: question.questionLanguageId,
    questionId: question.questionId,
    topic: "Arithmetic",
    subtopic: "Interest",
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
    sourceFreezeId: question.sourceFreezeId,
    sourceApprovalAuthority: question.sourceApprovalAuthority,
    traceability: question.traceability,
    sourceValidation: question.validation,
    generationContext: {
      generationDomain: "quant-v4" as const,
      packageId: INT_CP007_QUESTION_STUDIO_PACKAGE_ID,
      checkpointId: "INT-CP-007" as const,
      runtimeMode: question.runtimeMode,
      reviewStatus: question.reviewStatus,
      questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY" as const,
      questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED" as const,
      integrationAuthority: question.integrationAuthority,
      sourceFreezeId: question.sourceFreezeId,
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

async function persistRun(questions: readonly PreviewQuestion[], requestSnapshot: Record<string, unknown>, actorUserId: string) {
  if (questions.length === 0) throw new Error("No INT-CP-007 questions matched the request.");
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
        'examtree', 'quant-v4-int-cp007-frozen-review', 0, 0, 0, 0,
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
          id, generation_run_id, item_number, status, current_version_number, created_at, updated_at
        ) VALUES (
          ${itemId}::uuid, ${runId}::uuid, ${index + 1}, 'unreviewed'::generation_item_status, 1,
          ${timestamp}, ${timestamp}
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
        id, actor_type, actor_user_id, action_key, entity_type, entity_id, reason, summary, metadata
      ) VALUES (
        ${randomUUID()}::uuid, 'user'::audit_actor_type, ${actorUserId}::uuid,
        'question_studio.interest_cp007_run.created', 'generation_run', ${runId}::uuid,
        'INT-CP-007 entered the Question Studio review queue from frozen English/Hindi/Punjabi authorities with downstream locks preserved',
        ${`Created ${questions.length} INT-CP-007 review items in ${publicCode}`},
        ${JSON.stringify({
          requestSnapshot,
          integrationAuthority: INT_CP007_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
          questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY",
          questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED",
          questionBankWritable: false,
          testEligible: false,
          publiclyPublishable: false,
        })}::jsonb
      )
    `;
    await tx`
      INSERT INTO platform.outbox_events (id, aggregate_type, aggregate_id, event_type, payload)
      VALUES (
        ${randomUUID()}::uuid, 'generation_run', ${runId}::uuid,
        'question_studio.interest_cp007_run.created',
        ${JSON.stringify({ runId, publicCode, itemCount: questions.length, packageId: "INT-001", checkpointId: "INT-CP-007", reviewOnly: true })}::jsonb
      )
    `;
  });
  return { id: runId, publicCode, status: "review", itemCount: questions.length };
}

router.use(authenticate);

router.get("/quant/interest/cp007/package", requireAdminPermission("content.generation.read"), (_req, res) => {
  res.json({
    generationSystem: "quant-v4",
    activationMode: "REVIEW_ONLY",
    package: INT_CP007_QUESTION_STUDIO_REVIEW_PACKAGE,
    maxBatchSize: 50,
    permanentQlCount: INT_CP007_QL_IDS.length,
    supportedLanguages: INT_CP007_QUESTION_STUDIO_LANGUAGES,
    databaseWriteEnabled: true,
    persistenceAllowed: true,
    questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY",
    questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED",
    questionBankWriteEnabled: false,
    testEligible: false,
    publiclyPublishable: false,
    bulkSyncSupported: false,
  });
});

router.get("/quant/interest/cp007/preview", requireAdminPermission("content.generation.read"), (req, res) => {
  try {
    const language = (asString(req.query.language) || "en") as IntCp007QuestionStudioLanguage;
    const difficulty = asString(req.query.difficulty);
    const qlId = asString(req.query.qlId);
    if (!LANGUAGES.has(language)) throw new Error(`Unsupported language '${language}'.`);
    if (difficulty && !DIFFICULTIES.has(difficulty)) throw new Error(`Unsupported difficulty '${difficulty}'.`);
    if (qlId && !QL_IDS.has(qlId)) throw new Error(`Unsupported QL '${qlId}'.`);
    const result = previewIntCp007QuestionStudioReview({
      language,
      difficulty: difficulty ? difficulty as IntCp007QuestionStudioDifficulty : undefined,
      qlId: qlId ? qlId as IntCp007QlId : undefined,
      seed: asString(req.query.seed) || undefined,
      count: asCount(req.query.count, 1, 20),
    });
    res.json({ ...result, integrationAuthority: INT_CP007_QUESTION_STUDIO_INTEGRATION_AUTHORITY, productionEligible: false, reviewOnly: true });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Unable to preview Interest CP-007 questions." });
  }
});

router.post("/quant/interest/cp007/runs", requireAdminPermission("content.generation.run"), async (req, res) => {
  const actorUserId = req.adminSession?.user.id;
  if (!actorUserId) {
    res.status(403).json({ error: "Administrator session required." });
    return;
  }
  try {
    const language = (asString(req.body?.language) || "en") as IntCp007QuestionStudioLanguage;
    const difficulty = asString(req.body?.difficulty);
    const qlId = asString(req.body?.qlId);
    if (!LANGUAGES.has(language)) throw new Error(`Unsupported language '${language}'.`);
    if (difficulty && !DIFFICULTIES.has(difficulty)) throw new Error(`Unsupported difficulty '${difficulty}'.`);
    if (qlId && !QL_IDS.has(qlId)) throw new Error(`Unsupported QL '${qlId}'.`);
    const count = asCount(req.body?.count, 5, 50);
    const seed = asString(req.body?.seed) || undefined;
    const result = previewIntCp007QuestionStudioReview({
      language,
      difficulty: difficulty ? difficulty as IntCp007QuestionStudioDifficulty : undefined,
      qlId: qlId ? qlId as IntCp007QlId : undefined,
      seed,
      count,
    });
    const persisted = await persistRun(result.questions, {
      packageId: "INT-001",
      checkpointId: "INT-CP-007",
      language,
      difficulty: difficulty || null,
      qlId: qlId || null,
      count,
      seed: seed || null,
      integrationAuthority: INT_CP007_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
      questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY",
      questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED",
      reviewOnly: true,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
      requestedByFirebaseUid: req.user?.id,
    }, actorUserId);
    res.status(201).json({
      ...persisted,
      generationSystem: "quant-v4",
      packageId: "INT-001",
      checkpointId: "INT-CP-007",
      reviewOnly: true,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
    });
  } catch (error) {
    console.error("Interest CP-007 Question Studio run failed", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Unable to create Interest CP-007 review run." });
  }
});

router.get("/quant/interest/cp007/status", requireAdminPermission("content.generation.read"), async (_req, res) => {
  try {
    const rows = await sqlClient`
      SELECT
        count(*)::int AS "generationItemCount",
        count(*) FILTER (WHERE i.status = 'approved')::int AS "approvedItemCount",
        count(*) FILTER (WHERE i.accepted_question_id IS NOT NULL)::int AS "questionBankCount"
      FROM content.generation_run_items i
      INNER JOIN content.generation_item_versions v
        ON v.generation_item_id = i.id AND v.version_number = i.current_version_number
      WHERE v.payload ->> 'packageId' = 'INT-001'
        AND v.payload ->> 'canonicalProblemId' = 'INT-CP-007'
        AND v.payload ->> 'integrationAuthority' = ${INT_CP007_QUESTION_STUDIO_INTEGRATION_AUTHORITY}
    `;
    res.json({
      packageId: "INT-001",
      checkpointId: "INT-CP-007",
      permanentQlCount: INT_CP007_QL_IDS.length,
      generationItemCount: Number(rows[0]?.generationItemCount ?? 0),
      approvedItemCount: Number(rows[0]?.approvedItemCount ?? 0),
      questionBankCount: Number(rows[0]?.questionBankCount ?? 0),
      integrationAuthority: INT_CP007_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
      questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY",
      questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED",
      reviewOnly: true,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
    });
  } catch (error) {
    console.error("Interest CP-007 Question Studio status failed", error);
    res.status(500).json({ error: "Unable to load Interest CP-007 review status." });
  }
});

export default router;
