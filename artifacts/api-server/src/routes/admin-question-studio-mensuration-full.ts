import { randomUUID } from "node:crypto";
import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";
import { MENSURATION_QUESTION_STUDIO_INTEGRATION_AUTHORITY } from "../quant-v4/topics/AdvancedMathematics/subtopics/Mensuration/mensuration-question-studio-selection-v2";
import {
  MENSURATION_BANK_ONLY_ENGLISH_CP_IDS,
  MENSURATION_LOCALIZATION_AUTHORITY,
  MENSURATION_LOCALIZED_LANGUAGES,
  MENSURATION_QUESTION_STUDIO_CANONICAL_PROBLEMS,
  MENSURATION_QUESTION_STUDIO_DELIVERY_V3_AUTHORITY,
  MENSURATION_QUESTION_STUDIO_DIFFICULTIES,
  MENSURATION_QUESTION_STUDIO_EXAM_PROFILES_V3,
  MENSURATION_QUESTION_STUDIO_PACKAGE_V3,
  MENSURATION_QUESTION_STUDIO_PATTERNS,
  MENSURATION_QUESTION_STUDIO_REALISM_AUTHORITY,
  generateMensurationDeliveredBatchV3,
  type MensurationDeliveredQuestionV3,
  type MensurationQuestionStudioCpId,
  type MensurationQuestionStudioDifficulty,
  type MensurationStudioExamProfileV3,
  type MensurationStudioLanguage,
} from "../quant-v4/topics/AdvancedMathematics/subtopics/Mensuration/mensuration-question-studio-delivery-v3";

const router = Router();
const CP_IDS = new Set<string>(MENSURATION_QUESTION_STUDIO_CANONICAL_PROBLEMS.map((row) => row.cpId));
const PATTERN_IDS = new Set<string>(MENSURATION_QUESTION_STUDIO_PATTERNS.map((row) => row.patternId));
const DIFFICULTIES = new Set<string>(MENSURATION_QUESTION_STUDIO_DIFFICULTIES);
const EXAM_PROFILES = new Set<string>(MENSURATION_QUESTION_STUDIO_EXAM_PROFILES_V3);
const LANGUAGES = new Set<string>(MENSURATION_LOCALIZED_LANGUAGES);

function asString(value: unknown) { return typeof value === "string" ? value.trim() : ""; }
function asCount(value: unknown, fallback = 5, max = 50) {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
}
function publicRunCode() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `MEN-${date}-${randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase()}`;
}

function requestFilters(source: Record<string, unknown>) {
  const language = asString(source.language) || "en";
  const cpId = asString(source.cpId);
  const patternId = asString(source.patternId);
  const difficulty = asString(source.difficulty);
  const requestedProfile = asString(source.examProfile) || "SSC_CORE";
  const examProfile = requestedProfile === "BANKING" ? "BANKING_PRELIMS" : requestedProfile;
  if (!LANGUAGES.has(language)) throw new Error(`Unsupported Mensuration language '${language}'.`);
  if (cpId && !CP_IDS.has(cpId)) throw new Error(`Unsupported Mensuration canonical problem '${cpId}'.`);
  if (patternId && !PATTERN_IDS.has(patternId)) throw new Error(`Unsupported Mensuration pattern '${patternId}'.`);
  if (difficulty && !DIFFICULTIES.has(difficulty)) throw new Error(`Unsupported difficulty '${difficulty}'.`);
  if (!EXAM_PROFILES.has(examProfile)) throw new Error(`Unsupported Mensuration exam profile '${requestedProfile}'.`);
  const pattern = patternId ? MENSURATION_QUESTION_STUDIO_PATTERNS.find((row) => row.patternId === patternId) : undefined;
  if (pattern && cpId && pattern.cpId !== cpId) throw new Error(`${patternId} belongs to ${pattern.cpId}, not ${cpId}.`);
  return {
    language: language as MensurationStudioLanguage,
    cpId: cpId ? cpId as MensurationQuestionStudioCpId : undefined,
    patternId: patternId || undefined,
    difficulty: difficulty ? difficulty as MensurationQuestionStudioDifficulty : undefined,
    examProfile: examProfile as MensurationStudioExamProfileV3,
  };
}

export function buildMensurationReviewPayloadV3(question: MensurationDeliveredQuestionV3) {
  return {
    text: question.stem,
    stem: question.stem,
    options: question.options,
    optionDetails: question.optionDetails,
    correct: question.correctIndex,
    correctIndex: question.correctIndex,
    answer: question.answer,
    canonicalAnswer: question.answer,
    explanation: question.explanation.steps.join("\n"),
    richExplanation: question.explanation,
    renderer: question.renderer,
    difficulty: question.difficultyBand,
    difficultyLabel: question.difficultyBand,
    patternId: question.patternId,
    patternKind: question.patternKind,
    qlId: question.qlId,
    permanentQlId: question.qlId,
    packageId: question.packageId,
    canonicalProblemId: question.cpId,
    canonicalItemId: question.canonicalItemId,
    questionLanguageId: question.questionLanguageId,
    questionId: question.questionId,
    topic: "Advanced Mathematics",
    subtopic: "Mensuration",
    subject: "Quantitative Aptitude",
    language: question.language,
    locale: question.locale,
    seed: question.seed,
    solveMode: question.solveMode,
    examProfile: question.examProfile,
    sourceExamProfile: question.sourceExamProfile,
    centralExamProfile: question.centralExamProfile,
    optionCount: question.optionCount,
    runtimeMode: MENSURATION_QUESTION_STUDIO_PACKAGE_V3.runtimeMode,
    reviewStatus: MENSURATION_QUESTION_STUDIO_PACKAGE_V3.reviewStatus,
    sourceAuthority: question.sourceAuthority,
    sourceReviewStatus: question.sourceReviewStatus,
    sourceMaturity: question.sourceMaturity,
    realism: question.realism,
    realismAuthority: MENSURATION_QUESTION_STUDIO_REALISM_AUTHORITY,
    localization: question.localization ?? null,
    localizationAuthority: question.localization ? MENSURATION_LOCALIZATION_AUTHORITY : null,
    deliveryAuthority: question.deliveryAuthority,
    bankOnlyEligibility: question.bankOnlyEligibility,
    questionStudioRegistrationStatus: question.lifecycleStage === "BANK_ONLY"
      ? "REGISTERED_BANK_ONLY_INTERNAL" as const
      : "REGISTERED_REVIEW_ONLY" as const,
    questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED" as const,
    lifecycleId: question.lifecycleId,
    lifecycleStage: question.lifecycleStage,
    reviewSurfaceRequired: question.reviewSurfaceRequired,
    reviewRunPersistenceAllowed: question.reviewRunPersistenceAllowed,
    canonicalQuestionPersistenceAllowed: question.canonicalQuestionPersistenceAllowed,
    questionBankStatus: question.questionBankStatus,
    questionBankWritable: question.questionBankWritable,
    questionBankAcceptanceMode: question.questionBankAcceptanceMode,
    questionBankAcceptanceAuthority: question.questionBankAcceptanceAuthority,
    testEligibility: question.testEligibility,
    testEligible: question.testEligible,
    publiclyPublishable: question.publiclyPublishable,
    mockTestEligible: question.mockTestEligible,
    manualApprovalRequired: question.manualApprovalRequired,
    automaticStudentPublication: question.automaticStudentPublication,
    productionReleaseAuthorized: question.productionReleaseAuthorized,
    integrationAuthority: question.integrationAuthority,
    sourceValidation: question.validation,
    generationContext: {
      generationDomain: "quant-v4" as const,
      chapter: "Mensuration" as const,
      packageId: question.packageId,
      canonicalProblemId: question.cpId,
      patternId: question.patternId,
      patternKind: question.patternKind,
      qlId: question.qlId,
      language: question.language,
      locale: question.locale,
      examProfile: question.examProfile,
      sourceExamProfile: question.sourceExamProfile,
      centralExamProfile: question.centralExamProfile,
      optionCount: question.optionCount,
      frequencyBand: question.realism.frequencyBand,
      realismAuthority: MENSURATION_QUESTION_STUDIO_REALISM_AUTHORITY,
      localizationAuthority: question.localization ? MENSURATION_LOCALIZATION_AUTHORITY : null,
      integrationAuthority: question.integrationAuthority,
      deliveryAuthority: question.deliveryAuthority,
      lifecycleId: question.lifecycleId,
      lifecycleStage: question.lifecycleStage,
      questionStudioDiscoverable: true as const,
      persistenceAllowed: true as const,
      questionBankStatus: question.questionBankStatus,
      questionBankWritable: question.questionBankWritable,
      questionBankAcceptanceMode: question.questionBankAcceptanceMode,
      questionBankAcceptanceAuthority: question.questionBankAcceptanceAuthority,
      testEligibility: question.testEligibility,
      testEligible: question.testEligible,
      mockTestEligible: question.mockTestEligible,
      publiclyPublishable: question.publiclyPublishable,
      reviewOnly: question.lifecycleStage === "REVIEW_ONLY",
      manualApprovalRequired: question.manualApprovalRequired,
      automaticStudentPublication: question.automaticStudentPublication,
      productionReleaseAuthorized: question.productionReleaseAuthorized,
    },
  };
}

async function persistRun(
  questions: readonly MensurationDeliveredQuestionV3[],
  requestSnapshot: Record<string, unknown>,
  actorUserId: string,
) {
  if (!questions.length) throw new Error("No Mensuration questions matched the request.");
  const runId = randomUUID();
  const publicCode = publicRunCode();
  const timestamp = new Date().toISOString();
  const bankOnlyItemCount = questions.filter((question) => question.lifecycleStage === "BANK_ONLY").length;
  const reviewOnlyItemCount = questions.length - bankOnlyItemCount;
  await sqlClient.begin(async (tx) => {
    await tx`
      INSERT INTO content.generation_runs (
        id, public_code, status, attempt_number, prompt_snapshot, request_snapshot,
        provider, model, prompt_tokens, completion_tokens, estimated_cost_paise,
        actual_cost_paise, started_at, completed_at, created_at, updated_at
      ) VALUES (
        ${runId}::uuid, ${publicCode}, 'review'::generation_run_status, 1,
        ${JSON.stringify(requestSnapshot)}::jsonb, ${JSON.stringify(requestSnapshot)}::jsonb,
        'examtree', 'quant-v4-mensuration-delivery-v3', 0, 0, 0, 0,
        ${timestamp}, ${timestamp}, ${timestamp}, ${timestamp}, ${timestamp}
      )
    `;
    for (let index = 0; index < questions.length; index += 1) {
      const question = questions[index]!;
      const itemId = randomUUID();
      const versionId = randomUUID();
      const payload = buildMensurationReviewPayloadV3(question);
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
        'question_studio.mensuration_run.created', 'generation_run', ${runId}::uuid,
        'Mensuration entered the Question Studio review queue under fail-closed per-item lifecycle rules',
        ${`Created ${questions.length} Mensuration items in ${publicCode}: ${bankOnlyItemCount} bank-only, ${reviewOnlyItemCount} review-only`},
        ${JSON.stringify({ requestSnapshot, integrationAuthority: MENSURATION_QUESTION_STUDIO_INTEGRATION_AUTHORITY, deliveryAuthority: MENSURATION_QUESTION_STUDIO_DELIVERY_V3_AUTHORITY, realismAuthority: MENSURATION_QUESTION_STUDIO_REALISM_AUTHORITY, localizationAuthority: MENSURATION_LOCALIZATION_AUTHORITY, canonicalProblemCount: 13, bankOnlyItemCount, reviewOnlyItemCount })}::jsonb
      )
    `;
    await tx`
      INSERT INTO platform.outbox_events (id, aggregate_type, aggregate_id, event_type, payload)
      VALUES (
        ${randomUUID()}::uuid, 'generation_run', ${runId}::uuid, 'question_studio.mensuration_run.created',
        ${JSON.stringify({ runId, publicCode, itemCount: questions.length, bankOnlyItemCount, reviewOnlyItemCount, chapter: "Mensuration", deliveryAuthority: MENSURATION_QUESTION_STUDIO_DELIVERY_V3_AUTHORITY, mixedLifecycle: true })}::jsonb
      )
    `;
  });
  return {
    id: runId,
    publicCode,
    status: "review" as const,
    itemCount: questions.length,
    bankOnlyItemCount,
    reviewOnlyItemCount,
  };
}

router.use(authenticate);

router.get("/quant/mensuration/package", requireAdminPermission("content.generation.read"), (_req, res) => {
  res.json({
    generationSystem: "quant-v4",
    activationMode: "QUESTION_STUDIO_MIXED_REVIEW_BANK_ONLY",
    package: MENSURATION_QUESTION_STUDIO_PACKAGE_V3,
    maxBatchSize: 50,
    databaseWriteEnabled: true,
    persistenceAllowed: true,
    questionBankWriteEnabled: true,
    questionBankWritePolicy: "ELIGIBLE_APPROVED_ITEMS_ONLY",
    bankOnlyEnglishCpIds: MENSURATION_BANK_ONLY_ENGLISH_CP_IDS,
    nonEnglishLifecycle: "REVIEW_ONLY",
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
  });
});

router.get("/quant/mensuration/preview", requireAdminPermission("content.generation.read"), (req, res) => {
  try {
    const filters = requestFilters(req.query as Record<string, unknown>);
    const result = generateMensurationDeliveredBatchV3({
      ...filters,
      seed: asString(req.query.seed) || "mensuration-question-studio-preview",
      count: asCount(req.query.count, 1, 20),
    });
    const bankOnlyItemCount = result.questions.filter((question) => question.lifecycleStage === "BANK_ONLY").length;
    res.json({
      ...result,
      productionEligible: false,
      bankOnlyItemCount,
      reviewOnlyItemCount: result.questions.length - bankOnlyItemCount,
      automaticStudentPublication: false,
    });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Unable to preview Mensuration questions." });
  }
});

router.post("/quant/mensuration/runs", requireAdminPermission("content.generation.run"), async (req, res) => {
  const actorUserId = req.adminSession?.user.id;
  if (!actorUserId) { res.status(403).json({ error: "Administrator session required." }); return; }
  try {
    const filters = requestFilters((req.body ?? {}) as Record<string, unknown>);
    const count = asCount(req.body?.count, 5, 50);
    const seed = asString(req.body?.seed) || `mensuration-run:${Date.now()}`;
    const result = generateMensurationDeliveredBatchV3({ ...filters, seed, count });
    const persisted = await persistRun(result.questions, {
      chapter: "Mensuration",
      cpId: filters.cpId ?? null,
      patternId: filters.patternId ?? null,
      difficulty: filters.difficulty ?? null,
      examProfile: filters.examProfile,
      language: filters.language,
      count,
      seed,
      integrationAuthority: MENSURATION_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
      deliveryAuthority: MENSURATION_QUESTION_STUDIO_DELIVERY_V3_AUTHORITY,
      realismAuthority: MENSURATION_QUESTION_STUDIO_REALISM_AUTHORITY,
      localizationAuthority: filters.language === "en" ? null : MENSURATION_LOCALIZATION_AUTHORITY,
      questionStudioDiscoverable: true,
      persistenceAllowed: true,
      lifecycleMode: "PER_ITEM_FAIL_CLOSED",
      bankOnlyEnglishCpIds: MENSURATION_BANK_ONLY_ENGLISH_CP_IDS,
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      requestedByFirebaseUid: req.user?.id,
    }, actorUserId);
    res.status(201).json({
      ...persisted,
      generationSystem: "quant-v4",
      chapter: "Mensuration",
      examProfile: filters.examProfile,
      language: filters.language,
      mixedLifecycle: true,
      testEligible: false,
      publiclyPublishable: false,
    });
  } catch (error) {
    console.error("Full Mensuration Question Studio run failed", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Unable to create Mensuration review run." });
  }
});

router.get("/quant/mensuration/status", requireAdminPermission("content.generation.read"), async (_req, res) => {
  try {
    const rows = await sqlClient`
      SELECT
        count(*)::int AS "generationItemCount",
        count(*) FILTER (WHERE i.status = 'approved')::int AS "approvedItemCount",
        count(*) FILTER (WHERE v.payload ->> 'questionBankWritable' = 'true')::int AS "bankReadyItemCount",
        count(*) FILTER (WHERE v.payload ->> 'lifecycleStage' = 'REVIEW_ONLY')::int AS "reviewOnlyItemCount",
        count(*) FILTER (WHERE i.accepted_question_id IS NOT NULL)::int AS "questionBankCount"
      FROM content.generation_run_items i
      INNER JOIN content.generation_item_versions v
        ON v.generation_item_id = i.id AND v.version_number = i.current_version_number
      WHERE v.payload ->> 'integrationAuthority' = ${MENSURATION_QUESTION_STUDIO_INTEGRATION_AUTHORITY}
    `;
    res.json({
      chapter: "Mensuration",
      canonicalProblemCount: 13,
      patternCount: MENSURATION_QUESTION_STUDIO_PACKAGE_V3.patternCount,
      qlCount: MENSURATION_QUESTION_STUDIO_PACKAGE_V3.qlCount,
      prototypeCount: MENSURATION_QUESTION_STUDIO_PACKAGE_V3.prototypeCount,
      generationItemCount: Number(rows[0]?.generationItemCount ?? 0),
      approvedItemCount: Number(rows[0]?.approvedItemCount ?? 0),
      bankReadyItemCount: Number(rows[0]?.bankReadyItemCount ?? 0),
      reviewOnlyItemCount: Number(rows[0]?.reviewOnlyItemCount ?? 0),
      questionBankCount: Number(rows[0]?.questionBankCount ?? 0),
      integrationAuthority: MENSURATION_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
      deliveryAuthority: MENSURATION_QUESTION_STUDIO_DELIVERY_V3_AUTHORITY,
      realismAuthority: MENSURATION_QUESTION_STUDIO_REALISM_AUTHORITY,
      localizationAuthority: MENSURATION_LOCALIZATION_AUTHORITY,
      defaultExamProfile: MENSURATION_QUESTION_STUDIO_PACKAGE_V3.defaultExamProfile,
      supportedExamProfiles: MENSURATION_QUESTION_STUDIO_EXAM_PROFILES_V3,
      supportedLanguages: MENSURATION_LOCALIZED_LANGUAGES,
      questionStudioDiscoverable: true,
      persistenceAllowed: true,
      lifecycleMode: "PER_ITEM_FAIL_CLOSED",
      bankOnlyEnglishCpIds: MENSURATION_BANK_ONLY_ENGLISH_CP_IDS,
      nonEnglishLifecycle: "REVIEW_ONLY",
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
    });
  } catch (error) {
    console.error("Full Mensuration Question Studio status failed", error);
    res.status(500).json({ error: "Unable to load Mensuration Question Studio status." });
  }
});

export default router;
