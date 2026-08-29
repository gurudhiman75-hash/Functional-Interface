import { randomUUID } from "node:crypto";
import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";
import {
  ALGEBRA_QUESTION_STUDIO_CANONICAL_PROBLEMS,
  ALGEBRA_QUESTION_STUDIO_DIFFICULTIES,
  ALGEBRA_QUESTION_STUDIO_EXAM_PROFILES,
  ALGEBRA_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
  ALGEBRA_QUESTION_STUDIO_LANGUAGES,
  ALGEBRA_QUESTION_STUDIO_PATTERNS,
  type AlgebraStudioDifficulty,
  type AlgebraStudioExamProfile,
  type AlgebraStudioLanguage,
} from "../quant-v4/topics/AdvancedMathematics/subtopics/Algebra/algebra-question-studio-runtime-v1";
import {
  ALGEBRA_QUESTION_STUDIO_DELIVERY_V3_AUTHORITY,
  ALGEBRA_QUESTION_STUDIO_PACKAGE_V3,
  generateAlgebraStudioBatchV3,
  type AlgebraQuestionStudioQuestionV3,
} from "../quant-v4/topics/AdvancedMathematics/subtopics/Algebra/algebra-question-studio-runtime-v3";
import type { AlgPermanentQlId } from "../quant-v4/topics/AdvancedMathematics/subtopics/Algebra/permanent";

const router = Router();
const CP_IDS = new Set<string>(ALGEBRA_QUESTION_STUDIO_CANONICAL_PROBLEMS.map((row) => row.cpId));
const QL_IDS = new Set<string>(ALGEBRA_QUESTION_STUDIO_PATTERNS.map((row) => row.qlId));
const PATTERN_IDS = new Set<string>(ALGEBRA_QUESTION_STUDIO_PATTERNS.map((row) => row.prototypeId));
const DIFFICULTIES = new Set<string>(ALGEBRA_QUESTION_STUDIO_DIFFICULTIES);
const EXAM_PROFILES = new Set<string>(ALGEBRA_QUESTION_STUDIO_EXAM_PROFILES);
const LANGUAGES = new Set<string>(ALGEBRA_QUESTION_STUDIO_LANGUAGES);

function asString(value: unknown) { return typeof value === "string" ? value.trim() : ""; }
function asCount(value: unknown, fallback = 5, max = 50) {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
}
function publicRunCode() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `ALG-${date}-${randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase()}`;
}

function requestFilters(source: Record<string, unknown>) {
  const language = asString(source.language) || "en";
  const cpId = asString(source.cpId);
  const qlId = asString(source.qlId);
  const patternId = asString(source.patternId);
  const difficulty = asString(source.difficulty);
  const examProfile = asString(source.examProfile) || "SSC_CORE";
  if (!LANGUAGES.has(language)) throw new Error(`Unsupported Algebra language '${language}'.`);
  if (cpId && !CP_IDS.has(cpId)) throw new Error(`Unsupported Algebra canonical problem '${cpId}'.`);
  if (qlId && !QL_IDS.has(qlId)) throw new Error(`Unsupported Algebra QL '${qlId}'.`);
  if (patternId && !PATTERN_IDS.has(patternId)) throw new Error(`Unsupported Algebra pattern '${patternId}'.`);
  if (difficulty && !DIFFICULTIES.has(difficulty)) throw new Error(`Unsupported difficulty '${difficulty}'.`);
  if (!EXAM_PROFILES.has(examProfile)) throw new Error(`Unsupported Algebra exam profile '${examProfile}'.`);
  const pattern = patternId ? ALGEBRA_QUESTION_STUDIO_PATTERNS.find((row) => row.prototypeId === patternId) : undefined;
  if (pattern && cpId && pattern.cpId !== cpId) throw new Error(`${patternId} belongs to ${pattern.cpId}, not ${cpId}.`);
  if (pattern && qlId && pattern.qlId !== qlId) throw new Error(`${patternId} belongs to ${pattern.qlId}, not ${qlId}.`);
  return {
    language: language as AlgebraStudioLanguage,
    cpId: cpId || undefined,
    qlId: qlId ? qlId as AlgPermanentQlId : undefined,
    patternId: patternId || undefined,
    difficulty: difficulty ? difficulty as AlgebraStudioDifficulty : undefined,
    examProfile: examProfile as AlgebraStudioExamProfile,
  };
}

function reviewPayload(question: AlgebraQuestionStudioQuestionV3) {
  return {
    text: question.stem,
    stem: question.stem,
    options: question.options,
    optionDetails: question.optionDetails,
    correct: question.correctIndex,
    correctIndex: question.correctIndex,
    answer: question.answer,
    canonicalAnswer: question.canonicalAnswer,
    explanation: question.explanation.steps.join("\n"),
    richExplanation: question.explanation,
    renderer: question.renderer,
    difficulty: question.difficultyBand,
    difficultyLabel: question.difficultyBand,
    patternId: question.patternId,
    prototypeId: question.prototypeId,
    variantIndex: question.variantIndex,
    qlId: question.qlId,
    packageId: question.packageId,
    canonicalProblemId: question.cpId,
    canonicalItemId: question.canonicalItemId,
    questionLanguageId: question.questionLanguageId,
    questionId: question.questionId,
    topic: "Advanced Mathematics",
    subtopic: "Algebra",
    subject: "Quantitative Aptitude",
    language: question.language,
    locale: question.locale,
    seed: question.seed,
    solveMode: question.solveMode,
    runtimeMode: ALGEBRA_QUESTION_STUDIO_PACKAGE_V3.runtimeMode,
    reviewStatus: ALGEBRA_QUESTION_STUDIO_PACKAGE_V3.reviewStatus,
    sourceAuthority: question.sourceAuthority,
    sourceReviewStatus: question.sourceReviewStatus,
    sourceMaturity: question.sourceMaturity,
    questionStudioRegistrationStatus: "REGISTERED" as const,
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
    deliveryAuthority: question.deliveryAuthority,
    sourceValidation: question.validation,
    generationContext: {
      generationDomain: "quant-v4" as const,
      chapter: "Algebra" as const,
      packageId: question.packageId,
      canonicalProblemId: question.cpId,
      patternId: question.patternId,
      prototypeId: question.prototypeId,
      variantIndex: question.variantIndex,
      qlId: question.qlId,
      language: question.language,
      locale: question.locale,
      examProfile: question.examProfile,
      integrationAuthority: question.integrationAuthority,
      deliveryAuthority: question.deliveryAuthority,
      sourceAuthority: question.sourceAuthority,
      questionStudioDiscoverable: true as const,
      persistenceAllowed: true as const,
      questionBankStatus: "NOT_STORED" as const,
      questionBankWritable: false as const,
      testEligibility: "INELIGIBLE" as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      reviewOnly: true as const,
      manualApprovalRequired: true as const,
      automaticStudentPublication: false as const,
    },
  };
}

async function persistRun(
  questions: readonly AlgebraQuestionStudioQuestionV3[],
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
        'examtree', 'quant-v4-algebra-frozen-full-chapter-v3', 0, 0, 0, 0,
        ${timestamp}, ${timestamp}, ${timestamp}, ${timestamp}, ${timestamp}
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
        'question_studio.algebra_run.created', 'generation_run', ${runId}::uuid,
        'Frozen Algebra authority entered the Question Studio review queue with multilingual learner and solver provenance preserved',
        ${`Created ${questions.length} Algebra review items in ${publicCode}`},
        ${JSON.stringify({
          requestSnapshot,
          integrationAuthority: ALGEBRA_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
          deliveryAuthority: ALGEBRA_QUESTION_STUDIO_DELIVERY_V3_AUTHORITY,
          canonicalProblemCount: 14,
          qlCount: 43,
          patternCount: 109,
          questionBankWritable: false,
          testEligible: false,
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
          deliveryAuthority: ALGEBRA_QUESTION_STUDIO_DELIVERY_V3_AUTHORITY,
          reviewOnly: true,
          questionBankWritable: false,
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
    activationMode: "QUESTION_STUDIO_CONNECTED",
    package: ALGEBRA_QUESTION_STUDIO_PACKAGE_V3,
    maxBatchSize: 50,
    databaseWriteEnabled: true,
    persistenceAllowed: true,
    reviewOnly: true,
    questionBankWriteEnabled: false,
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
  });
});

router.get("/quant/algebra/preview", requireAdminPermission("content.generation.read"), (req, res) => {
  try {
    const filters = requestFilters(req.query as Record<string, unknown>);
    const result = generateAlgebraStudioBatchV3({
      ...filters,
      seed: asString(req.query.seed) || "algebra-question-studio-preview",
      count: asCount(req.query.count, 1, 20),
    });
    res.json({ ...result, productionEligible: false, reviewOnly: true });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Unable to preview Algebra questions." });
  }
});

router.post("/quant/algebra/runs", requireAdminPermission("content.generation.run"), async (req, res) => {
  const actorUserId = req.adminSession?.user.id;
  if (!actorUserId) { res.status(403).json({ error: "Administrator session required." }); return; }
  try {
    const filters = requestFilters((req.body ?? {}) as Record<string, unknown>);
    const count = asCount(req.body?.count, 5, 50);
    const seed = asString(req.body?.seed) || `algebra-run:${Date.now()}`;
    const result = generateAlgebraStudioBatchV3({ ...filters, seed, count });
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
      deliveryAuthority: ALGEBRA_QUESTION_STUDIO_DELIVERY_V3_AUTHORITY,
      questionStudioDiscoverable: true,
      persistenceAllowed: true,
      reviewOnly: true,
      questionBankWritable: false,
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
      reviewOnly: true,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
    });
  } catch (error) {
    console.error("Full Algebra Question Studio run failed", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Unable to create Algebra review run." });
  }
});

router.get("/quant/algebra/status", requireAdminPermission("content.generation.read"), async (_req, res) => {
  try {
    const rows = await sqlClient`
      SELECT
        count(*)::int AS "generationItemCount",
        count(*) FILTER (WHERE i.status = 'approved')::int AS "approvedItemCount",
        count(*) FILTER (WHERE i.accepted_question_id IS NOT NULL)::int AS "questionBankCount"
      FROM content.generation_run_items i
      INNER JOIN content.generation_item_versions v
        ON v.generation_item_id = i.id AND v.version_number = i.current_version_number
      WHERE v.payload ->> 'integrationAuthority' = ${ALGEBRA_QUESTION_STUDIO_INTEGRATION_AUTHORITY}
    `;
    res.json({
      chapter: "Algebra",
      canonicalProblemCount: ALGEBRA_QUESTION_STUDIO_PACKAGE_V3.canonicalProblemCount,
      patternCount: ALGEBRA_QUESTION_STUDIO_PACKAGE_V3.patternCount,
      qlCount: ALGEBRA_QUESTION_STUDIO_PACKAGE_V3.qlCount,
      generationItemCount: Number(rows[0]?.generationItemCount ?? 0),
      approvedItemCount: Number(rows[0]?.approvedItemCount ?? 0),
      questionBankCount: Number(rows[0]?.questionBankCount ?? 0),
      integrationAuthority: ALGEBRA_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
      deliveryAuthority: ALGEBRA_QUESTION_STUDIO_DELIVERY_V3_AUTHORITY,
      defaultExamProfile: ALGEBRA_QUESTION_STUDIO_PACKAGE_V3.defaultExamProfile,
      supportedExamProfiles: ALGEBRA_QUESTION_STUDIO_EXAM_PROFILES,
      supportedLanguages: ALGEBRA_QUESTION_STUDIO_LANGUAGES,
      questionStudioDiscoverable: true,
      persistenceAllowed: true,
      reviewOnly: true,
      questionBankWritable: false,
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
    });
  } catch (error) {
    console.error("Full Algebra Question Studio status failed", error);
    res.status(500).json({ error: "Unable to load Algebra Question Studio status." });
  }
});

export default router;
