import { randomUUID } from "node:crypto";
import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";
import {
  SPATIAL_QUESTION_STUDIO_PACKAGE_V1,
  SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1,
  type SpatialQuestionStudioChapterCodeV1,
  type SpatialQuestionStudioDifficultyV1,
  type SpatialQuestionStudioPermanentQlIdV1,
} from "../reasoning-v1/foundation/spatial/spatial-question-studio-integration-v6";
import {
  SPATIAL_QUESTION_STUDIO_LANGUAGES_V1,
  type SpatialQuestionStudioLanguageV1,
} from "../reasoning-v1/foundation/spatial/spatial-question-studio-localization-v1";
import {
  generateSpatialProductionStudioBatchV1,
  type SpatialProductionStudioQuestionV1,
} from "../reasoning-v1/foundation/spatial/spatial-question-studio-production-v6";
import { SPATIAL_FINAL_HELD_GAP_INTERNAL_ACTIVATION_V1 } from "../reasoning-v1/foundation/spatial/spatial-final-held-gap-freeze-v1";

const router = Router();
const QL_IDS = new Set<string>(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.qlIds);
const CHAPTERS = new Set<string>(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.chapters);
const DIFFICULTIES = new Set<string>(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.supportedDifficulties);
const LANGUAGES = new Set<string>(SPATIAL_QUESTION_STUDIO_LANGUAGES_V1);

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

function lifecycleRecord(question: SpatialProductionStudioQuestionV1): Record<string, unknown> {
  return (question.lifecycle ?? {}) as unknown as Record<string, unknown>;
}

function lifecycleBoolean(question: SpatialProductionStudioQuestionV1, key: string, fallback: boolean): boolean {
  const value = lifecycleRecord(question)[key];
  return typeof value === "boolean" ? value : fallback;
}

function lifecycleString(question: SpatialProductionStudioQuestionV1, key: string, fallback: string): string {
  const value = lifecycleRecord(question)[key];
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function explanationText(question: SpatialProductionStudioQuestionV1): string {
  const labels = question.language === "hi"
    ? ["क्या देखें", "नियम", "कैसे लगाएँ", "जाँच"]
    : question.language === "pa"
      ? ["ਕੀ ਵੇਖਣਾ", "ਨਿਯਮ", "ਕਿਵੇਂ ਲਗਾਉਣਾ", "ਜਾਂਚ"]
      : ["Observe", "Rule", "Apply", "Check"];
  return [
    `${labels[0]}: ${question.explanation.observation}`,
    `${labels[1]}: ${question.explanation.rule}`,
    `${labels[2]}: ${question.explanation.application}`,
    `${labels[3]}: ${question.explanation.check}`,
  ].join("\n\n");
}

function isNumericOptionSpatialQuestion(question: SpatialProductionStudioQuestionV1): question is SpatialProductionStudioQuestionV1 & {
  renderer: { kind: "SVG_WITH_NUMERIC_OPTIONS" };
  options: readonly [number, number, number, number];
} {
  return question.renderer.kind === "SVG_WITH_NUMERIC_OPTIONS" && "options" in question && Array.isArray(question.options);
}

export function productionPayloadV5(question: SpatialProductionStudioQuestionV1) {
  const numericOptions = isNumericOptionSpatialQuestion(question);
  const persistedOptions = numericOptions ? [...question.options] : [...question.optionLabels];
  // Numeric preview option SVGs are UI-only. Persist numeric text options so Question Bank stays semantically native.
  const optionSvgs = !numericOptions && "optionSvgs" in question && Array.isArray(question.optionSvgs)
    ? question.optionSvgs
    : undefined;
  const canonicalAnswer = numericOptions ? question.options[question.correctIndex] : question.answer;
  const questionBankStatus = lifecycleString(question, "questionBankStatus", "READY_FOR_STORAGE");
  const questionBankWritable = lifecycleBoolean(question, "questionBankWritable", true);
  const questionBankAcceptanceMode = lifecycleString(question, "questionBankAcceptanceMode", "FULL_RELEASE");
  const testEligibility = lifecycleString(question, "testEligibility", "ELIGIBLE");
  const testEligible = lifecycleBoolean(question, "testEligible", true);
  const testBuilderEligible = lifecycleBoolean(question, "testBuilderEligible", testEligible);
  const publiclyPublishable = lifecycleBoolean(question, "publiclyPublishable", true);
  const mockTestEligible = lifecycleBoolean(question, "mockTestEligible", false);
  const publicReleaseAuthorized = lifecycleBoolean(question, "publicReleaseAuthorized", false);
  const studentDeliveryAuthorized = lifecycleBoolean(question, "studentDeliveryAuthorized", false);
  const automaticStudentPublication = lifecycleBoolean(question, "automaticStudentPublication", false);
  const releaseAuthority = lifecycleString(
    question,
    "releaseAuthority",
    SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.authority,
  );
  const sourceFreezeAuthority = "sourceFreezeAuthority" in question
    ? String(question.sourceFreezeAuthority)
    : undefined;

  return {
    text: question.stem,
    stem: question.stem,
    stimulusSvgs: question.stimulusSvgs,
    ...(optionSvgs ? { optionSvgs } : {}),
    optionLabels: question.optionLabels,
    options: persistedOptions,
    correct: question.correctIndex,
    correctIndex: question.correctIndex,
    answer: question.answer,
    canonicalAnswer,
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
    localization: question.localization,
    localizationAuthority: question.localization.authority,
    runtimeMode: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.runtimeMode,
    reviewStatus: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.reviewStatus,
    questionBankStatus,
    questionBankWritable,
    questionBankAcceptanceMode,
    questionBankAcceptanceAuthority: releaseAuthority,
    testEligibility,
    testEligible,
    testBuilderEligible,
    publiclyPublishable,
    mockTestEligible,
    publicReleaseAuthorized,
    studentDeliveryAuthorized,
    manualApprovalRequired: true,
    automaticStudentPublication,
    integrationAuthority: question.integrationAuthority,
    releaseAuthority,
    ...(sourceFreezeAuthority ? { sourceFreezeAuthority } : {}),
    sourceValidation: question.validation,
    generationContext: {
      generationDomain: "reasoning-v1" as const,
      packageId: question.packageId,
      qlId: question.qlId,
      chapterCode: question.chapterCode,
      language: question.language,
      locale: question.locale,
      runtimeMode: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.runtimeMode,
      reviewStatus: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.reviewStatus,
      integrationAuthority: question.integrationAuthority,
      localizationAuthority: question.localization.authority,
      releaseAuthority,
      ...(sourceFreezeAuthority ? { sourceFreezeAuthority } : {}),
      questionStudioDiscoverable: true as const,
      registrationStatus: "REGISTERED" as const,
      persistenceAllowed: true as const,
      questionBankStatus,
      questionBankWritable,
      questionBankAcceptanceMode,
      questionBankAcceptanceAuthority: releaseAuthority,
      testEligibility,
      testEligible,
      testBuilderEligible,
      publiclyPublishable,
      mockTestEligible,
      publicReleaseAuthorized,
      studentDeliveryAuthorized,
      manualApprovalRequired: true as const,
      automaticStudentPublication,
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
  const localizationAuthorities = [...new Set(questions.map((question) => question.localization.authority))];

  await sqlClient.begin(async (tx) => {
    await tx`
      INSERT INTO content.generation_runs (
        id, public_code, status, attempt_number, prompt_snapshot, request_snapshot,
        provider, model, prompt_tokens, completion_tokens, estimated_cost_paise,
        actual_cost_paise, started_at, completed_at, created_at, updated_at
      ) VALUES (
        ${runId}::uuid, ${publicCode}, 'review'::generation_run_status, 1,
        ${JSON.stringify(requestSnapshot)}::jsonb, ${JSON.stringify(requestSnapshot)}::jsonb,
        'examtree', 'reasoning-v1-spa-001-v6', 0, 0, 0, 0,
        ${timestamp}, ${timestamp}, ${timestamp}, ${timestamp}
      )
    `;

    for (let index = 0; index < questions.length; index += 1) {
      const question = questions[index]!;
      const itemId = randomUUID();
      const versionId = randomUUID();
      const payload = productionPayloadV5(question);
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
        'Approved multilingual SPA-001 generator entered the standard Question Studio lifecycle',
        ${`Created ${questions.length} SPA-001 review items in ${publicCode}`},
        ${JSON.stringify({
          requestSnapshot,
          integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.integrationAuthority,
          localizationAuthorities,
          finalHeldGapActivationAuthority: SPATIAL_FINAL_HELD_GAP_INTERNAL_ACTIVATION_V1.authorityId,
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
          language: questions[0]?.language,
          localizationAuthorities,
          integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.integrationAuthority,
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
  if (!LANGUAGES.has(language)) throw new Error(`Unsupported Spatial language '${language}'.`);
  if (qlId && !QL_IDS.has(qlId)) throw new Error(`Unsupported Spatial QL '${qlId}'.`);
  if (chapterCode && !CHAPTERS.has(chapterCode)) throw new Error(`Unsupported Spatial chapter '${chapterCode}'.`);
  if (difficulty && !DIFFICULTIES.has(difficulty)) throw new Error(`Unsupported difficulty '${difficulty}'.`);
  return {
    language: language as SpatialQuestionStudioLanguageV1,
    qlId: qlId ? qlId as SpatialQuestionStudioPermanentQlIdV1 : undefined,
    chapterCode: chapterCode ? chapterCode as SpatialQuestionStudioChapterCodeV1 : undefined,
    difficulty: difficulty ? difficulty as SpatialQuestionStudioDifficultyV1 : undefined,
  };
}

router.use(authenticate);

router.get("/reasoning/spatial/package", requireAdminPermission("content.generation.read"), (_req, res) => {
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
    testBuilderEligibleAfterApproval: true,
    mockTestEligible: false,
    publicReleaseAuthorized: false,
    studentDeliveryAuthorized: false,
    automaticStudentPublication: false,
    bulkSyncSupported: false,
  });
});

router.get("/reasoning/spatial/preview", requireAdminPermission("content.generation.read"), (req, res) => {
  try {
    const filters = requestFilters(req.query as Record<string, unknown>);
    const result = generateSpatialProductionStudioBatchV1({
      ...filters,
      seed: asString(req.query.seed) || "spa-question-studio-preview-v6",
      count: asCount(req.query.count, 1, 20),
    });
    const localizationAuthorities = [...new Set(result.questions.map((question) => question.localization.authority))];
    res.json({
      ...result,
      integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.integrationAuthority,
      localizationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.localizationAuthority,
      localizationAuthorities,
      finalHeldGapFreezeAuthority: SPATIAL_FINAL_HELD_GAP_INTERNAL_ACTIVATION_V1.sourceFreezeAuthorityId,
      finalHeldGapActivationAuthority: SPATIAL_FINAL_HELD_GAP_INTERNAL_ACTIVATION_V1.authorityId,
      productionEligible: true,
      automaticStudentPublication: false,
    });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Unable to preview Spatial questions." });
  }
});

router.post("/reasoning/spatial/runs", requireAdminPermission("content.generation.run"), async (req, res) => {
  const actorUserId = req.adminSession?.user.id;
  if (!actorUserId) {
    res.status(403).json({ error: "Administrator session required." });
    return;
  }
  try {
    const filters = requestFilters((req.body ?? {}) as Record<string, unknown>);
    const count = asCount(req.body?.count, 5, 50);
    const seed = asString(req.body?.seed) || `spa-review-v6-${Date.now()}`;
    const result = generateSpatialProductionStudioBatchV1({ ...filters, seed, count });
    const localizationAuthorities = [...new Set(result.questions.map((question) => question.localization.authority))];
    const requestSnapshot = {
      packageId: "SPA-001",
      language: filters.language,
      difficulty: filters.difficulty ?? null,
      qlId: filters.qlId ?? null,
      chapterCode: filters.chapterCode ?? null,
      count,
      seed,
      integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.integrationAuthority,
      localizationAuthorities,
      finalHeldGapFreezeAuthority: SPATIAL_FINAL_HELD_GAP_INTERNAL_ACTIVATION_V1.sourceFreezeAuthorityId,
      finalHeldGapActivationAuthority: SPATIAL_FINAL_HELD_GAP_INTERNAL_ACTIVATION_V1.authorityId,
      manualApprovalRequired: true,
      automaticStudentPublication: false,
      requestedByFirebaseUid: req.user?.id,
    };
    const persisted = await persistRun(result.questions, requestSnapshot, actorUserId);
    res.status(201).json({
      ...persisted,
      generationSystem: "reasoning-v1",
      packageId: "SPA-001",
      language: filters.language,
      integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.integrationAuthority,
      automaticStudentPublication: false,
    });
  } catch (error) {
    console.error("Spatial Question Studio V6 generation failed", error);
    res.status(400).json({ error: error instanceof Error ? error.message : "Unable to create Spatial review run." });
  }
});

router.get("/reasoning/spatial/status", requireAdminPermission("content.generation.read"), async (_req, res) => {
  try {
    const generationRows = await sqlClient`
      SELECT
        COUNT(*)::int AS "generationItemCount",
        COUNT(*) FILTER (WHERE i.status = 'approved')::int AS "approvedItemCount"
      FROM content.generation_run_items i
      INNER JOIN content.generation_item_versions v
        ON v.generation_item_id = i.id
       AND v.version_number = i.current_version_number
      WHERE v.payload ->> 'packageId' = 'SPA-001'
    `;
    const bankRows = await sqlClient`
      SELECT COUNT(*)::int AS "questionBankCount"
      FROM content.question_versions qv
      WHERE qv.answer_model -> 'generation' ->> 'packageId' = 'SPA-001'
    `;
    res.json({
      packageId: "SPA-001",
      permanentQlCount: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.permanentQlCount,
      supportedLanguages: SPATIAL_QUESTION_STUDIO_LANGUAGES_V1,
      generationItemCount: Number(generationRows[0]?.generationItemCount ?? 0),
      approvedItemCount: Number(generationRows[0]?.approvedItemCount ?? 0),
      questionBankCount: Number(bankRows[0]?.questionBankCount ?? 0),
      integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.integrationAuthority,
      finalHeldGapFreezeAuthority: SPATIAL_FINAL_HELD_GAP_INTERNAL_ACTIVATION_V1.sourceFreezeAuthorityId,
      finalHeldGapActivationAuthority: SPATIAL_FINAL_HELD_GAP_INTERNAL_ACTIVATION_V1.authorityId,
      questionBankConversionEligibleAfterApproval: true,
      testEligibleAfterApproval: true,
      testBuilderEligibleAfterApproval: true,
      mockTestEligible: false,
      publicReleaseAuthorized: false,
      studentDeliveryAuthorized: false,
      automaticStudentPublication: false,
    });
  } catch (error) {
    console.error("Spatial Question Studio V6 status failed", error);
    res.status(500).json({ error: "Unable to load Spatial Question Studio status." });
  }
});

export default router;