import { randomUUID } from "node:crypto";
import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";
import {
  SAP_QUESTION_STUDIO_CHECKPOINTS,
  SAP_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
  SAP_QUESTION_STUDIO_PACKAGE_V1,
  SAP_QUESTION_STUDIO_QLS,
  generateSapQuestionStudioBatch,
  type SapStudioCheckpointId,
  type SapStudioDifficulty,
  type SapStudioExamProfile,
  type SapStudioQlId,
  type SapStudioQuestion,
} from "../quant-v4/topics/Arithmetic/subtopics/SimplificationAndApproximation/sap-question-studio-runtime-v1";

const router = Router();
const QL_IDS = new Set<string>(SAP_QUESTION_STUDIO_QLS.map((entry) => entry.qlId));
const CHECKPOINTS = new Set<string>(SAP_QUESTION_STUDIO_CHECKPOINTS);
const DIFFICULTIES = new Set<string>(SAP_QUESTION_STUDIO_PACKAGE_V1.supportedDifficulties);
const EXAM_PROFILES = new Set<string>(SAP_QUESTION_STUDIO_PACKAGE_V1.supportedExamProfiles);

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asCount(value: unknown, fallback = 5, max = 50): number {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
}

function publicRunCode(): string {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `SAP-${date}-${randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase()}`;
}

function requestFilters(source: Record<string, unknown>) {
  const qlId = asString(source.qlId);
  const checkpointId = asString(source.checkpointId);
  const difficulty = asString(source.difficulty).toUpperCase();
  const examProfile = (asString(source.examProfile).toUpperCase() || "SSC");
  if (qlId && !QL_IDS.has(qlId)) throw new Error(`Unsupported SAP QL '${qlId}'.`);
  if (checkpointId && !CHECKPOINTS.has(checkpointId)) throw new Error(`Unsupported SAP checkpoint '${checkpointId}'.`);
  if (difficulty && !DIFFICULTIES.has(difficulty)) throw new Error(`Unsupported SAP difficulty '${difficulty}'.`);
  if (!EXAM_PROFILES.has(examProfile)) throw new Error(`Unsupported SAP exam profile '${examProfile}'.`);
  return {
    qlId: qlId ? qlId as SapStudioQlId : undefined,
    checkpointId: checkpointId ? checkpointId as SapStudioCheckpointId : undefined,
    difficulty: difficulty ? difficulty as SapStudioDifficulty : undefined,
    examProfile: examProfile as SapStudioExamProfile,
  };
}

function explanationText(question: SapStudioQuestion): string {
  return [
    question.explanation.coreConcept ? `Concept: ${question.explanation.coreConcept}` : "",
    ...question.explanation.steps.map((step, index) => `Step ${index + 1}: ${step}`),
    question.explanation.finalAnswer,
    ...question.explanation.verification.map((step) => `Check: ${step}`),
  ].filter(Boolean).join("\n\n");
}

function reviewPayload(question: SapStudioQuestion) {
  return {
    text: question.stem,
    stem: question.stem,
    options: [...question.options],
    optionDetails: question.optionDetails,
    correct: question.correctIndex,
    correctIndex: question.correctIndex,
    answer: question.answer,
    canonicalAnswer: question.answer,
    explanation: explanationText(question),
    richExplanation: question.explanation,
    difficulty: question.difficultyBand,
    difficultyLabel: question.difficultyBand,
    patternId: question.qlId,
    qlId: question.qlId,
    qlName: question.qlName,
    checkpointId: question.checkpointId,
    sourceIdentity: question.sourceIdentity,
    packageId: question.packageId,
    canonicalProblemId: question.checkpointId,
    canonicalItemId: question.canonicalItemId,
    questionLanguageId: question.questionLanguageId,
    questionId: question.questionId,
    topic: "Arithmetic",
    subtopic: "Simplification & Approximation",
    subject: "Quantitative Aptitude",
    language: question.language,
    locale: question.locale,
    seed: question.seed,
    sourceSeed: question.sourceSeed,
    examProfile: question.examProfile,
    renderer: question.renderer,
    integrationAuthority: question.integrationAuthority,
    sourceValidation: question.sourceValidation,
    sourceLifecycleLocked: question.sourceLifecycleLocked,
    reviewStatus: "QUESTION_STUDIO_REVIEW_ONLY",
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    testEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
    generationContext: {
      generationDomain: "quant-v4",
      chapter: "Simplification & Approximation",
      packageId: "SAP",
      qlId: question.qlId,
      checkpointId: question.checkpointId,
      sourceIdentity: question.sourceIdentity,
      language: question.language,
      locale: question.locale,
      examProfile: question.examProfile,
      integrationAuthority: question.integrationAuthority,
      questionStudioDiscoverable: true,
      registrationStatus: "REGISTERED",
      stagingStatus: "REVIEW_QUEUE_ENABLED",
      persistenceAllowed: true,
      questionBankStatus: "NOT_STORED",
      questionBankWritable: false,
      testEligibility: "INELIGIBLE",
      testEligible: false,
      publiclyPublishable: false,
      manualApprovalRequired: true,
      automaticStudentPublication: false,
    },
  };
}

async function persistRun(
  questions: readonly SapStudioQuestion[],
  requestSnapshot: Record<string, unknown>,
  actorUserId: string,
) {
  if (!questions.length) throw new Error("No SAP questions matched the request.");
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
        'examtree', 'quant-v4-sap-question-studio-v1', 0, 0, 0, 0,
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
        'question_studio.sap_run.created', 'generation_run', ${runId}::uuid,
        'Frozen SAP generator entered the Question Studio review queue',
        ${`Created ${questions.length} SAP review items in ${publicCode}`},
        ${JSON.stringify({ requestSnapshot, integrationAuthority: SAP_QUESTION_STUDIO_INTEGRATION_AUTHORITY, reviewOnly: true, questionBankWritable: false, testEligible: false, publiclyPublishable: false })}::jsonb
      )
    `;

    await tx`
      INSERT INTO platform.outbox_events (
        id, aggregate_type, aggregate_id, event_type, payload
      ) VALUES (
        ${randomUUID()}::uuid, 'generation_run', ${runId}::uuid,
        'question_studio.sap_run.created',
        ${JSON.stringify({ runId, publicCode, itemCount: questions.length, packageId: "SAP", integrationAuthority: SAP_QUESTION_STUDIO_INTEGRATION_AUTHORITY, reviewOnly: true })}::jsonb
      )
    `;
  });

  return { id: runId, publicCode, status: "review" as const, itemCount: questions.length };
}

router.use(authenticate);

router.get(
  "/quant/simplification/package",
  requireAdminPermission("content.generation.read"),
  (_req, res) => {
    res.json({
      generationSystem: "quant-v4",
      activationMode: "QUESTION_STUDIO_CONNECTED_REVIEW_ONLY",
      package: {
        ...SAP_QUESTION_STUDIO_PACKAGE_V1,
        qls: SAP_QUESTION_STUDIO_QLS,
      },
      maxBatchSize: 50,
      databaseWriteEnabled: true,
      persistenceAllowed: true,
      reviewOnly: true,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
    });
  },
);

router.get(
  "/quant/simplification/preview",
  requireAdminPermission("content.generation.read"),
  (req, res) => {
    try {
      const filters = requestFilters(req.query as Record<string, unknown>);
      const result = generateSapQuestionStudioBatch({
        ...filters,
        seed: asString(req.query.seed) || "sap-question-studio-preview",
        count: asCount(req.query.count, 1, 20),
      });
      res.json({ ...result, productionEligible: false, reviewOnly: true });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Unable to preview SAP questions." });
    }
  },
);

router.post(
  "/quant/simplification/runs",
  requireAdminPermission("content.generation.run"),
  async (req, res) => {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) {
      res.status(403).json({ error: "Administrator session required." });
      return;
    }
    try {
      const filters = requestFilters((req.body ?? {}) as Record<string, unknown>);
      const count = asCount(req.body?.count, 5, 50);
      const seed = asString(req.body?.seed) || `sap-review-${Date.now()}`;
      const result = generateSapQuestionStudioBatch({ ...filters, seed, count });
      const requestSnapshot = {
        packageId: "SAP",
        qlId: filters.qlId ?? null,
        checkpointId: filters.checkpointId ?? null,
        difficulty: filters.difficulty ?? null,
        examProfile: filters.examProfile,
        count,
        seed,
        integrationAuthority: SAP_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
        reviewOnly: true,
        questionBankWritable: false,
        testEligible: false,
        publiclyPublishable: false,
        requestedByFirebaseUid: req.user?.id,
      };
      const persisted = await persistRun(result.questions, requestSnapshot, actorUserId);
      res.status(201).json({
        ...persisted,
        generationSystem: "quant-v4",
        chapter: "Simplification & Approximation",
        integrationAuthority: SAP_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
        reviewOnly: true,
      });
    } catch (error) {
      console.error("SAP Question Studio run failed", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Unable to create SAP review run." });
    }
  },
);

router.get(
  "/quant/simplification/status",
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
        WHERE v.payload ->> 'packageId' = 'SAP'
          AND v.payload ->> 'integrationAuthority' = ${SAP_QUESTION_STUDIO_INTEGRATION_AUTHORITY}
      `;
      res.json({
        chapter: "Simplification & Approximation",
        permanentQlCount: 211,
        checkpointCount: 12,
        generationItemCount: Number(rows[0]?.generationItemCount ?? 0),
        approvedItemCount: Number(rows[0]?.approvedItemCount ?? 0),
        questionBankCount: Number(rows[0]?.questionBankCount ?? 0),
        integrationAuthority: SAP_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
        questionStudioDiscoverable: true,
        persistenceAllowed: true,
        reviewOnly: true,
        questionBankWritable: false,
        testEligible: false,
        publiclyPublishable: false,
      });
    } catch (_error) {
      res.status(500).json({ error: "Unable to load SAP Question Studio status." });
    }
  },
);

export default router;
