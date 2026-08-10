import { randomUUID } from "node:crypto";
import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";
import {
  listReasoningV1QuestionStudioReviewPackages,
  previewReasoningV1QuestionStudioReview,
  type ReasoningV1QuestionStudioReviewPackageId,
} from "../question-studio-review-registry";
import {
  BLR_CP007_QUESTION_STUDIO_PACKAGE_ID,
  listBlrCp007QuestionStudioReviewEntries,
  type BlrCp007QuestionStudioDifficulty,
  type BlrCp007QuestionStudioLanguage,
  type BlrCp007QuestionStudioQlId,
} from "../reasoning-v1/topics/Blood-Relations/BLR-001/BLR-CP-007/question-studio-review-adapter";

const router = Router();

const RELEASE_AUTHORITY = "BLR_CP007_PRODUCT_RELEASE_APPROVED_2026_08_09" as const;
const RELEASE_RUNTIME_MODE = "CANONICAL_REVIEW" as const;
const RELEASE_REVIEW_STATUS = "APPROVED_EDITORIAL_CANONICAL" as const;
const FULL_IMPORT_CONFIRMATION = "SYNCHRONIZE_504_BLR_CP007" as const;
const LANGUAGES = new Set(["en", "hi", "pa"]);
const DIFFICULTIES = new Set(["Easy", "Medium", "Hard"]);
const QL_IDS = new Set(["BLR-QL-031", "BLR-QL-032", "BLR-QL-033", "BLR-QL-034", "BLR-QL-035"]);

type PreviewQuestion = ReturnType<typeof listBlrCp007QuestionStudioReviewEntries>[number];

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asCount(value: unknown, fallback = 5, max = 50) {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
}

function publicRunCode() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `BLR-${date}-${randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase()}`;
}

function explanationText(question: PreviewQuestion) {
  const lines = [
    ...question.explanation.steps.map((step, index) => `${index + 1}. ${step}`),
    `Conclusion: ${question.explanation.conclusion}`,
    question.explanation.shortcut ? `Shortcut: ${question.explanation.shortcut}` : "",
    question.explanation.commonTrap ? `Common trap: ${question.explanation.commonTrap}` : "",
  ].filter(Boolean);
  return lines.join("\n");
}

function productionPayload(question: PreviewQuestion) {
  const stem = question.sharedPrompt
    ? `${question.sharedPrompt}\n\n${question.stem}`
    : question.stem;

  return {
    text: stem,
    stem,
    options: question.options,
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
    packageId: BLR_CP007_QUESTION_STUDIO_PACKAGE_ID,
    canonicalProblemId: question.canonicalProblemId,
    canonicalItemId: question.canonicalItemId,
    questionLanguageId: question.questionLanguageId,
    questionId: question.questionId,
    topic: "Blood Relations",
    subtopic: "Coded Blood Relations",
    subject: "Reasoning Ability",
    language: question.language,
    locale: question.locale,
    seed: question.parameters.seed,
    runtimeMode: RELEASE_RUNTIME_MODE,
    sourceRuntimeMode: question.parameters.runtimeMode,
    reviewStatus: RELEASE_REVIEW_STATUS,
    questionBankStatus: "READY_FOR_STORAGE",
    testEligibility: "ELIGIBLE",
    publiclyPublishable: true,
    mockTestEligible: true,
    releaseAuthority: RELEASE_AUTHORITY,
    traceability: question.traceability,
    sourceValidation: question.validation,
    generationContext: {
      generationDomain: "reasoning-v1",
      packageId: BLR_CP007_QUESTION_STUDIO_PACKAGE_ID,
      runtimeMode: RELEASE_RUNTIME_MODE,
      sourceRuntimeMode: question.parameters.runtimeMode,
      reviewStatus: RELEASE_REVIEW_STATUS,
      questionBankStatus: "READY_FOR_STORAGE",
      testEligibility: "ELIGIBLE",
      publiclyPublishable: true,
      mockTestEligible: true,
      releaseAuthority: RELEASE_AUTHORITY,
      corpusAuthority: question.parameters.corpusAuthority,
      recordAuthority: question.parameters.recordAuthority,
    },
  };
}

async function loadImportPlan() {
  const allQuestions = listBlrCp007QuestionStudioReviewEntries();
  const corpusIds = new Set(allQuestions.map((question) => question.questionLanguageId));
  const rows = await sqlClient`
    SELECT
      v.payload ->> 'questionLanguageId' AS "questionLanguageId",
      count(*)::int AS "occurrences"
    FROM content.generation_run_items i
    INNER JOIN content.generation_item_versions v
      ON v.generation_item_id = i.id AND v.version_number = i.current_version_number
    WHERE v.payload ->> 'packageId' = ${BLR_CP007_QUESTION_STUDIO_PACKAGE_ID}
      AND v.payload ->> 'releaseAuthority' = ${RELEASE_AUTHORITY}
      AND COALESCE(v.payload ->> 'questionLanguageId', '') <> ''
    GROUP BY v.payload ->> 'questionLanguageId'
  `;

  const existingIds = new Set(rows.map((row) => String(row.questionLanguageId ?? "")).filter(Boolean));
  const duplicateQuestionLanguageIds = rows
    .filter((row) => Number(row.occurrences ?? 0) > 1)
    .map((row) => String(row.questionLanguageId ?? ""))
    .filter(Boolean)
    .sort();
  const unexpectedQuestionLanguageIds = [...existingIds]
    .filter((questionLanguageId) => !corpusIds.has(questionLanguageId))
    .sort();
  const missing = allQuestions.filter((question) => !existingIds.has(question.questionLanguageId));
  const existingCount = allQuestions.length - missing.length;
  const driftDetected = duplicateQuestionLanguageIds.length > 0 || unexpectedQuestionLanguageIds.length > 0;

  return {
    allQuestions,
    missing,
    plan: {
      packageId: BLR_CP007_QUESTION_STUDIO_PACKAGE_ID,
      releaseAuthority: RELEASE_AUTHORITY,
      totalFrozenRecords: allQuestions.length,
      existingCount,
      missingCount: missing.length,
      duplicateQuestionLanguageIds,
      unexpectedQuestionLanguageIds,
      driftDetected,
      alreadyImported: missing.length === 0 && !driftDetected,
      readyToImport: missing.length > 0 && !driftDetected,
      confirmationRequired: missing.length > 0,
      requiredConfirmation: FULL_IMPORT_CONFIRMATION,
    },
  };
}

async function persistRun(
  questions: readonly PreviewQuestion[],
  requestSnapshot: Record<string, unknown>,
  actorUserId: string,
) {
  if (questions.length === 0) throw new Error("No BLR-CP-007 questions matched the request.");

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
        'examtree', 'reasoning-v1-blr-cp007', 0, 0, 0, 0,
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
        'question_studio.reasoning_run.created', 'generation_run', ${runId}::uuid,
        'Approved BLR-CP-007 frozen corpus entered Question Studio review',
        ${`Created ${questions.length} BLR-CP-007 review items in ${publicCode}`},
        ${JSON.stringify({ requestSnapshot, releaseAuthority: RELEASE_AUTHORITY })}::jsonb
      )
    `;

    await tx`
      INSERT INTO platform.outbox_events (
        id, aggregate_type, aggregate_id, event_type, payload
      ) VALUES (
        ${randomUUID()}::uuid, 'generation_run', ${runId}::uuid,
        'question_studio.reasoning_run.created',
        ${JSON.stringify({ runId, publicCode, itemCount: questions.length, packageId: BLR_CP007_QUESTION_STUDIO_PACKAGE_ID })}::jsonb
      )
    `;
  });

  return { id: runId, publicCode, status: "review", itemCount: questions.length };
}

router.use(authenticate);

router.get("/reasoning/packages", requireAdminPermission("content.generation.read"), (_req, res) => {
  const packages = listReasoningV1QuestionStudioReviewPackages().map((pkg) => ({
    ...pkg,
    enabled: true,
    reviewOnly: false,
    adminReviewVisible: true,
    questionStudioVisible: true,
    persistenceAllowed: true,
    databaseWriteEnabled: true,
    questionBankEligible: true,
    mockTestEligible: true,
    publiclyPublishable: true,
    releaseAuthority: RELEASE_AUTHORITY,
  }));
  res.json({
    generationSystem: "reasoning-v1",
    activationMode: "PRODUCTION_REVIEW",
    packages,
    maxBatchSize: 50,
    totalFrozenRecords: 504,
    databaseWriteEnabled: true,
    persistenceAllowed: true,
  });
});

router.get("/reasoning/preview", requireAdminPermission("content.generation.read"), (req, res) => {
  try {
    const packageId = asString(req.query.packageId) as ReasoningV1QuestionStudioReviewPackageId;
    const language = (asString(req.query.language) || "en") as BlrCp007QuestionStudioLanguage;
    const difficulty = asString(req.query.difficulty);
    const qlId = asString(req.query.qlId);
    if (packageId !== BLR_CP007_QUESTION_STUDIO_PACKAGE_ID) throw new Error("Unknown BLR production package.");
    if (!LANGUAGES.has(language)) throw new Error(`Unsupported language '${language}'.`);
    if (difficulty && !DIFFICULTIES.has(difficulty)) throw new Error(`Unsupported difficulty '${difficulty}'.`);
    if (qlId && !QL_IDS.has(qlId)) throw new Error(`Unsupported QL '${qlId}'.`);

    const result = previewReasoningV1QuestionStudioReview({
      packageId,
      language,
      difficulty: difficulty ? difficulty as BlrCp007QuestionStudioDifficulty : undefined,
      qlId: qlId ? qlId as BlrCp007QuestionStudioQlId : undefined,
      canonicalItemId: asString(req.query.canonicalItemId) || undefined,
      questionLanguageId: asString(req.query.questionLanguageId) || undefined,
      seed: asString(req.query.seed) || undefined,
      count: asCount(req.query.count, 1, 20),
    });
    res.json({ ...result, releaseAuthority: RELEASE_AUTHORITY, productionEligible: true });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Unable to preview BLR questions." });
  }
});

router.post("/reasoning/runs", requireAdminPermission("content.generation.run"), async (req, res) => {
  const actorUserId = req.adminSession?.user.id;
  if (!actorUserId) {
    res.status(403).json({ error: "Administrator session required." });
    return;
  }
  try {
    const packageId = asString(req.body?.packageId) as ReasoningV1QuestionStudioReviewPackageId;
    const language = (asString(req.body?.language) || "en") as BlrCp007QuestionStudioLanguage;
    const difficulty = asString(req.body?.difficulty);
    const qlId = asString(req.body?.qlId);
    if (packageId !== BLR_CP007_QUESTION_STUDIO_PACKAGE_ID) throw new Error("Unknown BLR production package.");
    if (!LANGUAGES.has(language)) throw new Error(`Unsupported language '${language}'.`);
    if (difficulty && !DIFFICULTIES.has(difficulty)) throw new Error(`Unsupported difficulty '${difficulty}'.`);
    if (qlId && !QL_IDS.has(qlId)) throw new Error(`Unsupported QL '${qlId}'.`);

    const count = asCount(req.body?.count, 5, 50);
    const seed = asString(req.body?.seed) || undefined;
    const result = previewReasoningV1QuestionStudioReview({
      packageId,
      language,
      difficulty: difficulty ? difficulty as BlrCp007QuestionStudioDifficulty : undefined,
      qlId: qlId ? qlId as BlrCp007QuestionStudioQlId : undefined,
      seed,
      count,
    });
    const persisted = await persistRun(result.questions, {
      packageId, language, difficulty: difficulty || null, qlId: qlId || null,
      count, seed: seed || null, releaseAuthority: RELEASE_AUTHORITY,
      requestedByFirebaseUid: req.user?.id,
    }, actorUserId);
    res.status(201).json({ ...persisted, generationSystem: "reasoning-v1" });
  } catch (error) {
    console.error("BLR Question Studio run failed", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Unable to create BLR review run." });
  }
});

router.get("/reasoning/import-plan", requireAdminPermission("content.generation.read"), async (_req, res) => {
  try {
    const { plan } = await loadImportPlan();
    res.json(plan);
  } catch (error) {
    console.error("BLR import preflight failed", error);
    res.status(500).json({ error: "Unable to calculate BLR synchronization plan." });
  }
});

router.post("/reasoning/import-all", requireAdminPermission("content.generation.run"), async (req, res) => {
  const actorUserId = req.adminSession?.user.id;
  if (!actorUserId) {
    res.status(403).json({ error: "Administrator session required." });
    return;
  }

  const packageId = asString(req.body?.packageId);
  const confirmation = asString(req.body?.confirmation);
  if (packageId !== BLR_CP007_QUESTION_STUDIO_PACKAGE_ID) {
    res.status(400).json({ error: "Unknown BLR production package." });
    return;
  }
  if (confirmation !== FULL_IMPORT_CONFIRMATION) {
    res.status(400).json({ error: "Explicit BLR full-corpus synchronization confirmation is required." });
    return;
  }

  try {
    const { plan, missing } = await loadImportPlan();
    if (plan.driftDetected) {
      res.status(409).json({
        error: "BLR synchronization blocked because current production records do not match the frozen corpus authority.",
        plan,
      });
      return;
    }

    if (missing.length === 0) {
      res.json({
        id: null,
        publicCode: null,
        status: "already_imported",
        itemCount: 0,
        existingCount: plan.existingCount,
        importPlan: plan,
      });
      return;
    }

    const persisted = await persistRun(missing, {
      packageId: BLR_CP007_QUESTION_STUDIO_PACKAGE_ID,
      importMode: "ALL_FROZEN_RECORDS",
      requestedCount: plan.totalFrozenRecords,
      existingCount: plan.existingCount,
      missingCount: plan.missingCount,
      duplicateQuestionLanguageIds: plan.duplicateQuestionLanguageIds,
      unexpectedQuestionLanguageIds: plan.unexpectedQuestionLanguageIds,
      releaseAuthority: RELEASE_AUTHORITY,
      requestedByFirebaseUid: req.user?.id,
      explicitConfirmation: true,
    }, actorUserId);
    res.status(201).json({
      ...persisted,
      existingCount: plan.existingCount,
      generationSystem: "reasoning-v1",
      preflightMissingCount: plan.missingCount,
    });
  } catch (error) {
    console.error("BLR full import failed", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Unable to import BLR frozen corpus." });
  }
});

router.get("/reasoning/status", requireAdminPermission("content.generation.read"), async (_req, res) => {
  try {
    const rows = await sqlClient`
      SELECT
        count(*)::int AS "generationItemCount",
        count(*) FILTER (WHERE i.status = 'approved')::int AS "approvedItemCount",
        count(*) FILTER (WHERE i.accepted_question_id IS NOT NULL)::int AS "questionBankCount"
      FROM content.generation_run_items i
      INNER JOIN content.generation_item_versions v
        ON v.generation_item_id = i.id AND v.version_number = i.current_version_number
      WHERE v.payload ->> 'packageId' = ${BLR_CP007_QUESTION_STUDIO_PACKAGE_ID}
        AND v.payload ->> 'releaseAuthority' = ${RELEASE_AUTHORITY}
    `;
    res.json({
      packageId: BLR_CP007_QUESTION_STUDIO_PACKAGE_ID,
      totalFrozenRecords: 504,
      generationItemCount: Number(rows[0]?.generationItemCount ?? 0),
      approvedItemCount: Number(rows[0]?.approvedItemCount ?? 0),
      questionBankCount: Number(rows[0]?.questionBankCount ?? 0),
      releaseAuthority: RELEASE_AUTHORITY,
    });
  } catch (error) {
    res.status(500).json({ error: "Unable to load BLR production status." });
  }
});

export default router;
