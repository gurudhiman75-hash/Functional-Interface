import { randomUUID } from "node:crypto";
import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";
import {
  TSD_CP011_QUESTION_STUDIO_DIFFICULTIES,
  TSD_CP011_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
  TSD_CP011_QUESTION_STUDIO_LANGUAGES,
  TSD_CP011_QUESTION_STUDIO_PACKAGE_ID,
  TSD_CP011_QUESTION_STUDIO_REVIEW_PACKAGE,
  previewTsdCp011QuestionStudioReview,
  type TsdCp011QuestionStudioDifficulty,
  type TsdCp011QuestionStudioLanguage,
  type TsdCp011QuestionStudioQlId,
} from "../quant-v4/topics/Arithmetic/subtopics/TimeSpeedDistance/TSD-002/cp011/question-studio-review-adapter";
import { TSD_CP011_PERMANENT_QL_IDS } from "../quant-v4/topics/Arithmetic/subtopics/TimeSpeedDistance/TSD-002/cp011/ql-allocation";

const router = Router();
const LANGUAGES = new Set<string>(TSD_CP011_QUESTION_STUDIO_LANGUAGES);
const DIFFICULTIES = new Set<string>(TSD_CP011_QUESTION_STUDIO_DIFFICULTIES);
const QL_IDS = new Set<string>(TSD_CP011_PERMANENT_QL_IDS);
type ReviewQuestion = ReturnType<typeof previewTsdCp011QuestionStudioReview>["questions"][number];

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}
function asCount(value: unknown, fallback = 5, max = 50) {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
}
function publicRunCode() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `TSD11-${date}-${randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase()}`;
}

function reviewPayload(question: ReviewQuestion) {
  return {
    text: question.stem,
    stem: question.stem,
    options: question.options,
    correct: question.correctIndex,
    correctIndex: question.correctIndex,
    answer: question.answer,
    canonicalAnswer: question.answer,
    explanation: [...question.explanation.steps, question.explanation.conclusion].join("\n"),
    richExplanation: question.explanation,
    renderer: { kind: "text-math", renderingContract: "plain-unicode-math-v1", textFallbackAvailable: true },
    difficulty: question.difficultyBand,
    difficultyLabel: question.difficultyBand,
    patternId: question.qlId,
    qlId: question.qlId,
    familyId: question.familyId,
    authorityKey: question.authorityKey,
    packageId: TSD_CP011_QUESTION_STUDIO_PACKAGE_ID,
    canonicalProblemId: "TSD-CP-011",
    canonicalItemId: question.canonicalItemId,
    questionLanguageId: question.questionLanguageId,
    questionId: question.questionId,
    topic: "Arithmetic",
    subtopic: "Time, Speed & Distance",
    subject: "Quantitative Aptitude",
    language: question.language,
    locale: question.locale,
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
    sourceValidation: question.validation,
    generationContext: {
      generationDomain: "quant-v4" as const,
      packageId: TSD_CP011_QUESTION_STUDIO_PACKAGE_ID,
      checkpointId: "TSD-CP-011",
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
      familyId: question.familyId,
      authorityKey: question.authorityKey,
    },
  };
}

async function persistRun(questions: readonly ReviewQuestion[], requestSnapshot: Record<string, unknown>, actorUserId: string) {
  if (!questions.length) throw new Error("No TSD-CP-011 questions matched the request.");
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
        'examtree', 'quant-v4-tsd-cp011-frozen-review', 0, 0, 0, 0,
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
          ${itemId}::uuid, ${runId}::uuid, ${index + 1}, 'unreviewed'::generation_item_status, 1, ${timestamp}, ${timestamp}
        )
      `;
      await tx`
        INSERT INTO content.generation_item_versions (
          id, generation_item_id, version_number, payload, provider_item_id, created_at
        ) VALUES (
          ${versionId}::uuid, ${itemId}::uuid, 1, ${JSON.stringify(payload)}::jsonb, ${question.questionLanguageId}, ${timestamp}
        )
      `;
    }
    await tx`
      INSERT INTO platform.audit_events (
        id, actor_type, actor_user_id, action_key, entity_type, entity_id, reason, summary, metadata
      ) VALUES (
        ${randomUUID()}::uuid, 'user'::audit_actor_type, ${actorUserId}::uuid,
        'question_studio.tsd_cp011_run.created', 'generation_run', ${runId}::uuid,
        'TSD-CP-011 entered the Question Studio review queue with downstream release locks preserved',
        ${`Created ${questions.length} TSD-CP-011 review items in ${publicCode}`},
        ${JSON.stringify({ requestSnapshot, integrationAuthority: TSD_CP011_QUESTION_STUDIO_INTEGRATION_AUTHORITY, questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY", questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED", questionBankWritable: false, testEligible: false, publiclyPublishable: false })}::jsonb
      )
    `;
  });
  return { id: runId, publicCode, status: "review" as const, itemCount: questions.length };
}

router.use(authenticate);

router.get("/quant/time-speed-distance/cp011/package", requireAdminPermission("content.generation.read"), (_req, res) => {
  res.json({
    generationSystem: "quant-v4",
    activationMode: "REVIEW_ONLY",
    package: TSD_CP011_QUESTION_STUDIO_REVIEW_PACKAGE,
    maxBatchSize: 50,
    permanentQlCount: TSD_CP011_PERMANENT_QL_IDS.length,
    reviewedCombinationsPerLocale: TSD_CP011_QUESTION_STUDIO_REVIEW_PACKAGE.reviewedCombinationsPerLocale,
    deterministicReviewCombinations: TSD_CP011_QUESTION_STUDIO_REVIEW_PACKAGE.deterministicReviewCombinations,
    supportedLanguages: TSD_CP011_QUESTION_STUDIO_LANGUAGES,
    supportedDifficulties: TSD_CP011_QUESTION_STUDIO_DIFFICULTIES,
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

router.get("/quant/time-speed-distance/cp011/preview", requireAdminPermission("content.generation.read"), (req, res) => {
  try {
    const language = (asString(req.query.language) || "en") as TsdCp011QuestionStudioLanguage;
    const difficulty = asString(req.query.difficulty);
    const qlId = asString(req.query.qlId);
    if (!LANGUAGES.has(language)) throw new Error(`Unsupported language '${language}'.`);
    if (difficulty && !DIFFICULTIES.has(difficulty)) throw new Error(`Unsupported difficulty '${difficulty}'.`);
    if (qlId && !QL_IDS.has(qlId)) throw new Error(`Unsupported QL '${qlId}'.`);
    const result = previewTsdCp011QuestionStudioReview({
      language,
      difficulty: difficulty ? difficulty as TsdCp011QuestionStudioDifficulty : undefined,
      qlId: qlId ? qlId as TsdCp011QuestionStudioQlId : undefined,
      seed: asString(req.query.seed) || undefined,
      count: asCount(req.query.count, 1, 20),
    });
    res.json({ ...result, integrationAuthority: TSD_CP011_QUESTION_STUDIO_INTEGRATION_AUTHORITY, productionEligible: false, reviewOnly: true });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Unable to preview TSD CP-011 questions." });
  }
});

router.post("/quant/time-speed-distance/cp011/runs", requireAdminPermission("content.generation.run"), async (req, res) => {
  const actorUserId = req.adminSession?.user.id;
  if (!actorUserId) {
    res.status(403).json({ error: "Administrator session required." });
    return;
  }
  try {
    const language = (asString(req.body?.language) || "en") as TsdCp011QuestionStudioLanguage;
    const difficulty = asString(req.body?.difficulty);
    const qlId = asString(req.body?.qlId);
    if (!LANGUAGES.has(language)) throw new Error(`Unsupported language '${language}'.`);
    if (difficulty && !DIFFICULTIES.has(difficulty)) throw new Error(`Unsupported difficulty '${difficulty}'.`);
    if (qlId && !QL_IDS.has(qlId)) throw new Error(`Unsupported QL '${qlId}'.`);
    const count = asCount(req.body?.count, 5, 50);
    const seed = asString(req.body?.seed) || undefined;
    const result = previewTsdCp011QuestionStudioReview({
      language,
      difficulty: difficulty ? difficulty as TsdCp011QuestionStudioDifficulty : undefined,
      qlId: qlId ? qlId as TsdCp011QuestionStudioQlId : undefined,
      seed,
      count,
    });
    const persisted = await persistRun(result.questions, {
      packageId: TSD_CP011_QUESTION_STUDIO_PACKAGE_ID,
      checkpointId: "TSD-CP-011",
      language,
      difficulty: difficulty || null,
      qlId: qlId || null,
      count,
      seed: seed || null,
      integrationAuthority: TSD_CP011_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
      questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY",
      questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED",
      reviewOnly: true,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
      requestedByFirebaseUid: req.user?.id,
    }, actorUserId);
    res.status(201).json({ ...persisted, generationSystem: "quant-v4", packageId: TSD_CP011_QUESTION_STUDIO_PACKAGE_ID, checkpointId: "TSD-CP-011", reviewOnly: true, questionBankWritable: false, testEligible: false, publiclyPublishable: false });
  } catch (error) {
    console.error("TSD CP-011 Question Studio run failed", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Unable to create TSD CP-011 review run." });
  }
});

router.get("/quant/time-speed-distance/cp011/status", requireAdminPermission("content.generation.read"), async (_req, res) => {
  try {
    const rows = await sqlClient`
      SELECT
        count(*)::int AS "generationItemCount",
        count(*) FILTER (WHERE i.status = 'approved')::int AS "approvedItemCount",
        count(*) FILTER (WHERE i.accepted_question_id IS NOT NULL)::int AS "questionBankCount"
      FROM content.generation_run_items i
      INNER JOIN content.generation_item_versions v ON v.generation_item_id = i.id AND v.version_number = i.current_version_number
      WHERE v.payload ->> 'packageId' = ${TSD_CP011_QUESTION_STUDIO_PACKAGE_ID}
        AND v.payload ->> 'canonicalProblemId' = 'TSD-CP-011'
        AND v.payload ->> 'integrationAuthority' = ${TSD_CP011_QUESTION_STUDIO_INTEGRATION_AUTHORITY}
    `;
    res.json({
      packageId: TSD_CP011_QUESTION_STUDIO_PACKAGE_ID,
      checkpointId: "TSD-CP-011",
      permanentQlCount: TSD_CP011_PERMANENT_QL_IDS.length,
      reviewedCombinationsPerLocale: TSD_CP011_QUESTION_STUDIO_REVIEW_PACKAGE.reviewedCombinationsPerLocale,
      deterministicReviewCombinations: TSD_CP011_QUESTION_STUDIO_REVIEW_PACKAGE.deterministicReviewCombinations,
      generationItemCount: Number(rows[0]?.generationItemCount ?? 0),
      approvedItemCount: Number(rows[0]?.approvedItemCount ?? 0),
      questionBankCount: Number(rows[0]?.questionBankCount ?? 0),
      integrationAuthority: TSD_CP011_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
      questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY",
      questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED",
      reviewOnly: true,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
    });
  } catch (error) {
    console.error("TSD CP-011 Question Studio status failed", error);
    res.status(500).json({ error: "Unable to read TSD CP-011 Question Studio status." });
  }
});

export default router;
