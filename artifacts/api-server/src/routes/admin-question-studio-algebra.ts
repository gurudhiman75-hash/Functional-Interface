import { randomUUID } from "node:crypto";
import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";
import {
  ALGEBRA_QUESTION_STUDIO_CANONICAL_PROBLEMS,
  ALGEBRA_QUESTION_STUDIO_DIFFICULTIES,
  ALGEBRA_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
  ALGEBRA_QUESTION_STUDIO_LANGUAGES,
  ALGEBRA_QUESTION_STUDIO_PATTERNS,
  type AlgebraStudioDifficulty,
  type AlgebraStudioLanguage,
} from "../quant-v4/topics/AdvancedMathematics/subtopics/Algebra/algebra-question-studio-runtime-v1";
import {
  ALGEBRA_QUESTION_STUDIO_DELIVERY_V5_AUTHORITY,
  ALGEBRA_QUESTION_STUDIO_EXAM_PROFILES_V5,
  generateAlgebraStudioBatchV5,
  type AlgebraQuestionStudioQuestionV5,
  type AlgebraStudioExamProfileV5,
} from "../quant-v4/topics/AdvancedMathematics/subtopics/Algebra/algebra-question-studio-runtime-v5";
import {
  ALGEBRA_QUESTION_BANK_ACTIVATION_V1_AUTHORITY,
  ALGEBRA_QUESTION_STUDIO_BANK_ONLY_PACKAGE_V1,
  buildAlgebraBankOnlyReviewPayload,
} from "../quant-v4/topics/AdvancedMathematics/subtopics/Algebra/algebra-question-bank-activation-v1";
import type { AlgPermanentQlId } from "../quant-v4/topics/AdvancedMathematics/subtopics/Algebra/permanent";

const router = Router();
const CP_IDS = new Set<string>(ALGEBRA_QUESTION_STUDIO_CANONICAL_PROBLEMS.map((row) => row.cpId));
const QL_IDS = new Set<string>(ALGEBRA_QUESTION_STUDIO_PATTERNS.map((row) => row.qlId));
const PATTERN_IDS = new Set<string>(ALGEBRA_QUESTION_STUDIO_PATTERNS.map((row) => row.prototypeId));
const DIFFICULTIES = new Set<string>(ALGEBRA_QUESTION_STUDIO_DIFFICULTIES);
const EXAM_PROFILES = new Set<string>(ALGEBRA_QUESTION_STUDIO_EXAM_PROFILES_V5);
const LANGUAGES = new Set<string>(ALGEBRA_QUESTION_STUDIO_LANGUAGES);

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asCount(value: unknown, fallback = 5, max = 50) {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
}

function publicRunCode() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `ALG-${date}-${randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase()}`;
}

function normalizeExamProfile(value: unknown): AlgebraStudioExamProfileV5 {
  const raw = asString(value) || "SSC_CORE";
  const normalized = raw === "BANKING" ? "BANKING_PRELIMS" : raw;
  if (!EXAM_PROFILES.has(normalized)) {
    throw new Error(`Unsupported Algebra exam profile '${raw}'.`);
  }
  return normalized as AlgebraStudioExamProfileV5;
}

function requestFilters(source: Record<string, unknown>) {
  const language = asString(source.language) || "en";
  const cpId = asString(source.cpId);
  const qlId = asString(source.qlId);
  const patternId = asString(source.patternId);
  const difficulty = asString(source.difficulty);
  const examProfile = normalizeExamProfile(source.examProfile);
  if (!LANGUAGES.has(language)) throw new Error(`Unsupported Algebra language '${language}'.`);
  if (cpId && !CP_IDS.has(cpId)) throw new Error(`Unsupported Algebra canonical problem '${cpId}'.`);
  if (qlId && !QL_IDS.has(qlId)) throw new Error(`Unsupported Algebra QL '${qlId}'.`);
  if (patternId && !PATTERN_IDS.has(patternId)) throw new Error(`Unsupported Algebra pattern '${patternId}'.`);
  if (difficulty && !DIFFICULTIES.has(difficulty)) throw new Error(`Unsupported difficulty '${difficulty}'.`);
  const pattern = patternId
    ? ALGEBRA_QUESTION_STUDIO_PATTERNS.find((row) => row.prototypeId === patternId)
    : undefined;
  if (pattern && cpId && pattern.cpId !== cpId) throw new Error(`${patternId} belongs to ${pattern.cpId}, not ${cpId}.`);
  if (pattern && qlId && pattern.qlId !== qlId) throw new Error(`${patternId} belongs to ${pattern.qlId}, not ${qlId}.`);
  return {
    language: language as AlgebraStudioLanguage,
    cpId: cpId || undefined,
    qlId: qlId ? (qlId as AlgPermanentQlId) : undefined,
    patternId: patternId || undefined,
    difficulty: difficulty ? (difficulty as AlgebraStudioDifficulty) : undefined,
    examProfile,
  };
}

async function persistRun(
  questions: readonly AlgebraQuestionStudioQuestionV5[],
  requestSnapshot: Record<string, unknown>,
  actorUserId: string,
) {
  if (!questions.length) throw new Error("No Algebra questions matched the request.");
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
        'examtree', 'quant-v4-algebra-v5-bank-only', 0, 0, 0, 0,
        ${timestamp}, ${timestamp}, ${timestamp}, ${timestamp}, ${timestamp}
      )
    `;

    for (let index = 0; index < questions.length; index += 1) {
      const question = questions[index]!;
      const itemId = randomUUID();
      const versionId = randomUUID();
      const payload = buildAlgebraBankOnlyReviewPayload(question);
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
          ${question.questionId}, ${timestamp}
        )
      `;
    }

    await tx`
      INSERT INTO platform.audit_events (
        id, actor_type, actor_user_id, action_key, entity_type, entity_id, reason, summary, metadata
      ) VALUES (
        ${randomUUID()}::uuid, 'user'::audit_actor_type, ${actorUserId}::uuid,
        'question_studio.algebra_run.created', 'generation_run', ${runId}::uuid,
        'Frozen Algebra V5 entered the standard Question Studio BANK_ONLY lifecycle; manual approval is required and scored/public gates remain locked',
        ${`Created ${questions.length} Algebra BANK_ONLY review items in ${publicCode}`},
        ${JSON.stringify({
          requestSnapshot,
          integrationAuthority: ALGEBRA_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
          deliveryAuthority: ALGEBRA_QUESTION_STUDIO_DELIVERY_V5_AUTHORITY,
          bankActivationAuthority: ALGEBRA_QUESTION_BANK_ACTIVATION_V1_AUTHORITY,
          lifecycleId: ALGEBRA_QUESTION_STUDIO_BANK_ONLY_PACKAGE_V1.lifecycleId,
          canonicalProblemCount: 14,
          qlCount: 43,
          patternCount: 109,
          questionBankStatus: "READY_FOR_STORAGE",
          questionBankWritable: true,
          questionBankAcceptanceMode: "BANK_ONLY",
          manualApprovalRequired: true,
          testEligible: false,
          mockTestEligible: false,
          publiclyPublishable: false,
        })}::jsonb
      )
    `;

    await tx`
      INSERT INTO platform.outbox_events (id, aggregate_type, aggregate_id, event_type, payload)
      VALUES (
        ${randomUUID()}::uuid, 'generation_run', ${runId}::uuid, 'question_studio.algebra_run.created',
        ${JSON.stringify({
          runId,
          publicCode,
          itemCount: questions.length,
          chapter: "Algebra",
          integrationAuthority: ALGEBRA_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
          deliveryAuthority: ALGEBRA_QUESTION_STUDIO_DELIVERY_V5_AUTHORITY,
          bankActivationAuthority: ALGEBRA_QUESTION_BANK_ACTIVATION_V1_AUTHORITY,
          questionBankStatus: "READY_FOR_STORAGE",
          questionBankWritable: true,
          questionBankAcceptanceMode: "BANK_ONLY",
          manualApprovalRequired: true,
          testEligible: false,
          publiclyPublishable: false,
        })}::jsonb
      )
    `;
  });

  return { id: runId, publicCode, status: "review" as const, itemCount: questions.length };
}

router.use(authenticate);

router.get("/quant/algebra/package", requireAdminPermission("content.generation.read"), (_req, res) => {
  res.json({
    generationSystem: "quant-v4",
    activationMode: "BANK_ONLY_INTERNAL",
    package: ALGEBRA_QUESTION_STUDIO_BANK_ONLY_PACKAGE_V1,
    maxBatchSize: 50,
    databaseWriteEnabled: true,
    persistenceAllowed: true,
    reviewRequired: true,
    reviewOnly: false,
    questionBankWriteEnabled: true,
    questionBankAcceptanceMode: "BANK_ONLY",
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
  });
});

router.get("/quant/algebra/preview", requireAdminPermission("content.generation.read"), (req, res) => {
  try {
    const filters = requestFilters(req.query as Record<string, unknown>);
    const result = generateAlgebraStudioBatchV5({
      ...filters,
      seed: asString(req.query.seed) || "algebra-question-studio-preview-v5",
      count: asCount(req.query.count, 1, 20),
    });
    res.json({
      ...result,
      productionEligible: false,
      reviewRequired: true,
      reviewOnly: false,
      questionBankStatus: "READY_FOR_STORAGE",
      questionBankWritable: true,
      questionBankAcceptanceMode: "BANK_ONLY",
      manualApprovalRequired: true,
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
    });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Unable to preview Algebra questions." });
  }
});

router.post("/quant/algebra/runs", requireAdminPermission("content.generation.run"), async (req, res) => {
  const actorUserId = req.adminSession?.user.id;
  if (!actorUserId) {
    res.status(403).json({ error: "Administrator session required." });
    return;
  }
  try {
    const filters = requestFilters((req.body ?? {}) as Record<string, unknown>);
    const count = asCount(req.body?.count, 5, 50);
    const seed = asString(req.body?.seed) || `algebra-run-v5:${Date.now()}`;
    const result = generateAlgebraStudioBatchV5({ ...filters, seed, count });
    const persisted = await persistRun(result.questions, {
      chapter: "Algebra",
      cpId: filters.cpId ?? null,
      qlId: filters.qlId ?? null,
      patternId: filters.patternId ?? null,
      difficulty: filters.difficulty ?? null,
      examProfile: filters.examProfile,
      language: filters.language,
      count,
      seed,
      integrationAuthority: ALGEBRA_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
      deliveryAuthority: ALGEBRA_QUESTION_STUDIO_DELIVERY_V5_AUTHORITY,
      bankActivationAuthority: ALGEBRA_QUESTION_BANK_ACTIVATION_V1_AUTHORITY,
      lifecycleId: ALGEBRA_QUESTION_STUDIO_BANK_ONLY_PACKAGE_V1.lifecycleId,
      questionStudioDiscoverable: true,
      persistenceAllowed: true,
      reviewRequired: true,
      reviewOnly: false,
      questionBankStatus: "READY_FOR_STORAGE",
      questionBankWritable: true,
      questionBankAcceptanceMode: "BANK_ONLY",
      manualApprovalRequired: true,
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      requestedByFirebaseUid: req.user?.id,
    }, actorUserId);
    res.status(201).json({
      ...persisted,
      generationSystem: "quant-v4",
      chapter: "Algebra",
      examProfile: filters.examProfile,
      language: filters.language,
      reviewRequired: true,
      reviewOnly: false,
      questionBankStatus: "READY_FOR_STORAGE",
      questionBankWritable: true,
      questionBankAcceptanceMode: "BANK_ONLY",
      manualApprovalRequired: true,
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
    });
  } catch (error) {
    console.error("Algebra V5 BANK_ONLY Question Studio run failed", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Unable to create Algebra BANK_ONLY review run." });
  }
});

router.get("/quant/algebra/status", requireAdminPermission("content.generation.read"), async (_req, res) => {
  try {
    const rows = await sqlClient`
      SELECT
        count(*)::int AS "generationItemCount",
        count(*) FILTER (WHERE i.status = 'approved')::int AS "approvedItemCount",
        count(*) FILTER (WHERE v.payload ->> 'questionBankStatus' = 'READY_FOR_STORAGE')::int AS "bankReadyItemCount",
        count(*) FILTER (WHERE i.accepted_question_id IS NOT NULL)::int AS "questionBankCount"
      FROM content.generation_run_items i
      INNER JOIN content.generation_item_versions v
        ON v.generation_item_id = i.id AND v.version_number = i.current_version_number
      WHERE v.payload ->> 'integrationAuthority' = ${ALGEBRA_QUESTION_STUDIO_INTEGRATION_AUTHORITY}
    `;
    res.json({
      chapter: "Algebra",
      canonicalProblemCount: ALGEBRA_QUESTION_STUDIO_BANK_ONLY_PACKAGE_V1.canonicalProblemCount,
      patternCount: ALGEBRA_QUESTION_STUDIO_BANK_ONLY_PACKAGE_V1.patternCount,
      qlCount: ALGEBRA_QUESTION_STUDIO_BANK_ONLY_PACKAGE_V1.qlCount,
      generationItemCount: Number(rows[0]?.generationItemCount ?? 0),
      approvedItemCount: Number(rows[0]?.approvedItemCount ?? 0),
      bankReadyItemCount: Number(rows[0]?.bankReadyItemCount ?? 0),
      questionBankCount: Number(rows[0]?.questionBankCount ?? 0),
      integrationAuthority: ALGEBRA_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
      deliveryAuthority: ALGEBRA_QUESTION_STUDIO_DELIVERY_V5_AUTHORITY,
      bankActivationAuthority: ALGEBRA_QUESTION_BANK_ACTIVATION_V1_AUTHORITY,
      lifecycleId: ALGEBRA_QUESTION_STUDIO_BANK_ONLY_PACKAGE_V1.lifecycleId,
      lifecycleStage: "BANK_ONLY",
      defaultExamProfile: ALGEBRA_QUESTION_STUDIO_BANK_ONLY_PACKAGE_V1.defaultExamProfile,
      supportedExamProfiles: ALGEBRA_QUESTION_STUDIO_EXAM_PROFILES_V5,
      supportedLanguages: ALGEBRA_QUESTION_STUDIO_LANGUAGES,
      questionStudioDiscoverable: true,
      persistenceAllowed: true,
      reviewRequired: true,
      reviewOnly: false,
      questionBankStatus: "READY_FOR_STORAGE",
      questionBankWritable: true,
      questionBankAcceptanceMode: "BANK_ONLY",
      manualApprovalRequired: true,
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
      productionReleaseAuthorized: false,
    });
  } catch (error) {
    console.error("Algebra V5 BANK_ONLY Question Studio status failed", error);
    res.status(500).json({ error: "Unable to load Algebra Question Studio status." });
  }
});

export default router;
