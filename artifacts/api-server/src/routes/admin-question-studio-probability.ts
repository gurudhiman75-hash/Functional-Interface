import { randomUUID } from "node:crypto";
import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";
import {
  listProbabilityNativeReviewCatalog,
  previewProbabilityNativeReview,
  PROBABILITY_NATIVE_REVIEW_AUTHORITY,
  PROBABILITY_NATIVE_REVIEW_DIFFICULTIES,
  PROBABILITY_NATIVE_REVIEW_LANGUAGES,
  PROBABILITY_NATIVE_REVIEW_PACKAGE,
  PROBABILITY_NATIVE_REVIEW_PACKAGES,
  type ProbabilityNativeReviewDifficulty,
  type ProbabilityNativeReviewLanguage,
} from "../quant-v4/topics/Probability/native-review-adapter";
import { getProbabilityNativeFreezeSummary } from "../quant-v4/topics/Probability/native-review-freeze";
import type { ProbabilityPackageId } from "../quant-v4/topics/Probability/shared/types";

const router = Router();
const LANGUAGES = new Set<string>(PROBABILITY_NATIVE_REVIEW_LANGUAGES);
const DIFFICULTIES = new Set<string>(PROBABILITY_NATIVE_REVIEW_DIFFICULTIES);
const PACKAGES = new Set<string>(PROBABILITY_NATIVE_REVIEW_PACKAGES);
const CATALOG = listProbabilityNativeReviewCatalog();
const QL_IDS = new Set(CATALOG.map((entry) => entry.qlId));
const REVIEW_DECISION_STATUSES = new Set(["unreviewed", "needs_fix", "approved", "rejected"]);

type ProbabilityReviewResult = ReturnType<typeof previewProbabilityNativeReview>;
type ProbabilityReviewQuestion = ProbabilityReviewResult["questions"][number];

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asCount(value: unknown, fallback = 5, max = 50) {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function assertLockedNativeReviewPayload(value: unknown): void {
  const payload = asRecord(value);
  const generationContext = asRecord(payload.generationContext);
  const authority = asString(payload.integrationAuthority || generationContext.integrationAuthority);
  const questionBankStatus = asString(payload.questionBankStatus || generationContext.questionBankStatus).toUpperCase();
  const testEligibility = asString(payload.testEligibility || generationContext.testEligibility).toUpperCase();

  if (authority !== PROBABILITY_NATIVE_REVIEW_AUTHORITY) {
    throw new Error("Generated item is not governed by the Probability native review authority.");
  }
  if ((payload.reviewOnly ?? generationContext.reviewOnly) !== true) {
    throw new Error("Probability native review item lost its review-only lock.");
  }
  if ((payload.manualApprovalRequired ?? generationContext.manualApprovalRequired) !== true) {
    throw new Error("Probability native review item lost its manual-approval requirement.");
  }
  if (questionBankStatus !== "NOT_STORED" || (payload.questionBankWritable ?? generationContext.questionBankWritable) !== false) {
    throw new Error("Probability native review item lost its Question Bank lock.");
  }
  if (testEligibility !== "INELIGIBLE" || (payload.testEligible ?? generationContext.testEligible) !== false) {
    throw new Error("Probability native review item lost its test-eligibility lock.");
  }
  if ((payload.publiclyPublishable ?? generationContext.publiclyPublishable) !== false) {
    throw new Error("Probability native review item lost its publication lock.");
  }
  if ((payload.automaticStudentPublication ?? generationContext.automaticStudentPublication) !== false) {
    throw new Error("Probability native review item lost its automatic-publication lock.");
  }
}

function publicRunCode() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `PRB-${date}-${randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase()}`;
}

function reviewPayload(question: ProbabilityReviewQuestion) {
  return {
    text: question.stem,
    stem: question.stem,
    options: question.options,
    correct: question.correctIndex,
    correctIndex: question.correctIndex,
    answer: question.answer,
    canonicalAnswer: question.answer,
    explanation: question.explanation.steps.join("\n"),
    richExplanation: question.explanation,
    renderer: question.renderer,
    difficulty: question.difficultyBand,
    difficultyLabel: question.difficultyBand,
    patternId: question.qlId,
    qlId: question.qlId,
    packageId: question.packageId,
    canonicalProblemId: question.canonicalProblemId,
    canonicalItemId: question.canonicalItemId,
    questionLanguageId: question.questionLanguageId,
    questionId: question.questionId,
    topic: "Probability",
    subtopic: "Probability",
    subject: "Quantitative Aptitude",
    language: question.language,
    locale: question.locale,
    seed: question.parameters.sourceSeed,
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
    releaseFreezeStatus: "PENDING_HUMAN_REVIEW" as const,
    integrationAuthority: PROBABILITY_NATIVE_REVIEW_AUTHORITY,
    traceability: question.traceability,
    sourceValidation: question.validation,
    generationContext: {
      generationDomain: "quant-v4" as const,
      packageId: question.packageId,
      canonicalProblemId: question.canonicalProblemId,
      qlId: question.qlId,
      runtimeMode: question.runtimeMode,
      reviewStatus: question.reviewStatus,
      questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY" as const,
      questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED" as const,
      integrationAuthority: PROBABILITY_NATIVE_REVIEW_AUTHORITY,
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
      releaseFreezeStatus: "PENDING_HUMAN_REVIEW" as const,
      permanentQlId: question.qlId,
    },
  };
}

async function persistRun(
  questions: readonly ProbabilityReviewQuestion[],
  requestSnapshot: Record<string, unknown>,
  actorUserId: string,
) {
  if (!questions.length) throw new Error("No Probability native questions matched the request.");
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
        'examtree', 'quant-v4-prb-ml06-native-review', 0, 0, 0, 0,
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
        'question_studio.probability_native_review.created', 'generation_run', ${runId}::uuid,
        'Probability native parity content entered human review with downstream release locks preserved',
        ${`Created ${questions.length} Probability native review items in ${publicCode}`},
        ${JSON.stringify({
          requestSnapshot,
          integrationAuthority: PROBABILITY_NATIVE_REVIEW_AUTHORITY,
          questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY",
          questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED",
          questionBankWritable: false,
          testEligible: false,
          publiclyPublishable: false,
          releaseFreezeStatus: "PENDING_HUMAN_REVIEW",
        })}::jsonb
      )
    `;

    await tx`
      INSERT INTO platform.outbox_events (
        id, aggregate_type, aggregate_id, event_type, payload
      ) VALUES (
        ${randomUUID()}::uuid, 'generation_run', ${runId}::uuid,
        'question_studio.probability_native_review.created',
        ${JSON.stringify({ runId, publicCode, itemCount: questions.length, reviewOnly: true })}::jsonb
      )
    `;
  });

  return { id: runId, publicCode, status: "review", itemCount: questions.length };
}

router.use(authenticate);

router.get(
  "/quant/probability/native-review/package",
  requireAdminPermission("content.generation.read"),
  (_req, res) => {
    res.json({
      generationSystem: "quant-v4",
      activationMode: "REVIEW_ONLY",
      package: PROBABILITY_NATIVE_REVIEW_PACKAGE,
      maxBatchSize: 50,
      permanentQlCount: CATALOG.length,
      nativeReviewSurfaceCount: CATALOG.length * 2,
      supportedLanguages: PROBABILITY_NATIVE_REVIEW_LANGUAGES,
      supportedPackages: PROBABILITY_NATIVE_REVIEW_PACKAGES,
      databaseWriteEnabled: true,
      persistenceAllowed: true,
      questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY",
      questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED",
      questionBankWriteEnabled: false,
      testEligible: false,
      publiclyPublishable: false,
      bulkSyncSupported: false,
      releaseFreeze: getProbabilityNativeFreezeSummary(),
    });
  },
);

router.get(
  "/quant/probability/native-review/preview",
  requireAdminPermission("content.generation.read"),
  (req, res) => {
    try {
      const language = (asString(req.query.language) || "hi") as ProbabilityNativeReviewLanguage;
      const packageId = asString(req.query.packageId);
      const difficulty = asString(req.query.difficulty);
      const qlId = asString(req.query.qlId);
      if (!LANGUAGES.has(language)) throw new Error(`Unsupported language '${language}'.`);
      if (packageId && !PACKAGES.has(packageId)) throw new Error(`Unsupported package '${packageId}'.`);
      if (difficulty && !DIFFICULTIES.has(difficulty)) throw new Error(`Unsupported difficulty '${difficulty}'.`);
      if (qlId && !QL_IDS.has(qlId)) throw new Error(`Unsupported QL '${qlId}'.`);

      const result = previewProbabilityNativeReview({
        language,
        packageId: packageId ? packageId as ProbabilityPackageId : undefined,
        difficulty: difficulty ? difficulty as ProbabilityNativeReviewDifficulty : undefined,
        qlId: qlId || undefined,
        seed: asString(req.query.seed) || undefined,
        count: asCount(req.query.count, 1, 20),
      });
      res.json({ ...result, productionEligible: false, reviewOnly: true, integrationAuthority: PROBABILITY_NATIVE_REVIEW_AUTHORITY });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Unable to preview Probability native questions." });
    }
  },
);

router.post(
  "/quant/probability/native-review/runs",
  requireAdminPermission("content.generation.run"),
  async (req, res) => {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) {
      res.status(403).json({ error: "Administrator session required." });
      return;
    }
    try {
      const language = (asString(req.body?.language) || "hi") as ProbabilityNativeReviewLanguage;
      const packageId = asString(req.body?.packageId);
      const difficulty = asString(req.body?.difficulty);
      const qlId = asString(req.body?.qlId);
      if (!LANGUAGES.has(language)) throw new Error(`Unsupported language '${language}'.`);
      if (packageId && !PACKAGES.has(packageId)) throw new Error(`Unsupported package '${packageId}'.`);
      if (difficulty && !DIFFICULTIES.has(difficulty)) throw new Error(`Unsupported difficulty '${difficulty}'.`);
      if (qlId && !QL_IDS.has(qlId)) throw new Error(`Unsupported QL '${qlId}'.`);
      const count = asCount(req.body?.count, 5, 50);
      const seed = asString(req.body?.seed) || undefined;
      const result = previewProbabilityNativeReview({
        language,
        packageId: packageId ? packageId as ProbabilityPackageId : undefined,
        difficulty: difficulty ? difficulty as ProbabilityNativeReviewDifficulty : undefined,
        qlId: qlId || undefined,
        seed,
        count,
      });
      const persisted = await persistRun(result.questions, {
        chapterId: "Probability",
        language,
        packageId: packageId || null,
        difficulty: difficulty || null,
        qlId: qlId || null,
        count,
        seed: seed || null,
        integrationAuthority: PROBABILITY_NATIVE_REVIEW_AUTHORITY,
        questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY",
        questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED",
        reviewOnly: true,
        questionBankWritable: false,
        testEligible: false,
        publiclyPublishable: false,
        releaseFreezeStatus: "PENDING_HUMAN_REVIEW",
        requestedByFirebaseUid: req.user?.id,
      }, actorUserId);
      res.status(201).json({
        ...persisted,
        generationSystem: "quant-v4",
        chapterId: "Probability",
        reviewOnly: true,
        questionBankWritable: false,
        testEligible: false,
        publiclyPublishable: false,
        releaseFreezeStatus: "PENDING_HUMAN_REVIEW",
      });
    } catch (error) {
      console.error("Probability native Question Studio review run failed", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Unable to create Probability native review run." });
    }
  },
);

router.patch(
  "/quant/probability/native-review/items/:itemId/decision",
  requireAdminPermission("content.generation.review"),
  async (req, res) => {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) {
      res.status(403).json({ error: "Administrator session required." });
      return;
    }
    const itemId = asString(req.params.itemId);
    const status = asString(req.body?.status);
    const reason = asString(req.body?.reason);
    if (!itemId) {
      res.status(400).json({ error: "Probability native review item is required." });
      return;
    }
    if (!REVIEW_DECISION_STATUSES.has(status)) {
      res.status(400).json({ error: "Invalid Probability native review decision." });
      return;
    }
    if ((status === "needs_fix" || status === "rejected") && !reason) {
      res.status(400).json({ error: "A reason is required for this review decision." });
      return;
    }

    try {
      const result = await sqlClient.begin(async (tx) => {
        const rows = await tx`
          SELECT
            i.id,
            i.status,
            i.generation_run_id AS "generationRunId",
            i.accepted_question_id AS "acceptedQuestionId",
            i.accepted_question_version_id AS "acceptedQuestionVersionId",
            i.current_version_number AS "currentVersionNumber",
            v.id AS "versionId",
            v.payload
          FROM content.generation_run_items i
          INNER JOIN content.generation_item_versions v
            ON v.generation_item_id = i.id
           AND v.version_number = i.current_version_number
          WHERE i.id = ${itemId}::uuid
          FOR UPDATE OF i
        `;
        const row = rows[0];
        if (!row) throw new Error("Probability native review item was not found.");
        if (row.acceptedQuestionId || row.acceptedQuestionVersionId) {
          throw new Error("Probability native review item is unexpectedly linked to Question Bank.");
        }
        assertLockedNativeReviewPayload(row.payload);

        const updated = await tx`
          UPDATE content.generation_run_items
          SET
            status = ${status}::generation_item_status,
            retry_reason = ${reason || null},
            reviewer_user_id = ${actorUserId}::uuid,
            updated_at = now()
          WHERE id = ${itemId}::uuid
          RETURNING status, updated_at AS "updatedAt"
        `;

        const counts = await tx`
          SELECT
            COUNT(*)::int AS total,
            COUNT(*) FILTER (WHERE status = 'approved')::int AS approved
          FROM content.generation_run_items
          WHERE generation_run_id = ${String(row.generationRunId)}::uuid
        `;
        const total = Number(counts[0]?.total ?? 0);
        const approved = Number(counts[0]?.approved ?? 0);
        const runStatus = total > 0 && approved === total
          ? "approved"
          : approved > 0
            ? "partially_approved"
            : "review";
        await tx`
          UPDATE content.generation_runs
          SET status = ${runStatus}::generation_run_status, updated_at = now()
          WHERE id = ${String(row.generationRunId)}::uuid
        `;

        await tx`
          INSERT INTO platform.audit_events (
            id, actor_type, actor_user_id, action_key, entity_type, entity_id,
            entity_version_id, reason, summary, metadata
          ) VALUES (
            ${randomUUID()}::uuid, 'user'::audit_actor_type, ${actorUserId}::uuid,
            ${`question_studio.probability_native_review.${status}`}, 'generation_item', ${itemId}::uuid,
            ${String(row.versionId)}::uuid, ${reason || null},
            ${`Probability native review item moved to ${status} without Question Bank conversion`},
            ${JSON.stringify({
              previousStatus: row.status,
              status,
              integrationAuthority: PROBABILITY_NATIVE_REVIEW_AUTHORITY,
              editorialDecisionOnly: true,
              questionBankWritePerformed: false,
              questionBankWritable: false,
              testEligible: false,
              publiclyPublishable: false,
              releaseFreezeStillRequired: true,
            })}::jsonb
          )
        `;

        return {
          id: itemId,
          generationRunId: String(row.generationRunId),
          previousStatus: String(row.status),
          status: String(updated[0]?.status ?? status),
          updatedAt: updated[0]?.updatedAt ?? null,
          convertedQuestion: null,
          questionBankWritePerformed: false,
          releaseFreezeStillRequired: true,
        };
      });

      res.json(result);
    } catch (error) {
      console.error("Probability native review decision failed", error);
      res.status(422).json({ error: error instanceof Error ? error.message : "Unable to save Probability native review decision." });
    }
  },
);

router.get(
  "/quant/probability/native-review/status",
  requireAdminPermission("content.generation.read"),
  async (_req, res) => {
    try {
      const rows = await sqlClient`
        SELECT
          count(*)::int AS "generationItemCount",
          count(*) FILTER (WHERE i.status = 'approved')::int AS "approvedItemCount",
          count(DISTINCT ((v.payload ->> 'qlId') || ':' || (v.payload ->> 'language')))
            FILTER (
              WHERE i.status = 'approved'
                AND v.payload ->> 'qlId' IS NOT NULL
                AND v.payload ->> 'language' IN ('hi', 'pa')
            )::int AS "uniqueApprovedSurfaceCount",
          count(DISTINCT (v.payload ->> 'qlId'))
            FILTER (WHERE i.status = 'approved' AND v.payload ->> 'language' = 'hi')::int
            AS "hindiApprovedQlCount",
          count(DISTINCT (v.payload ->> 'qlId'))
            FILTER (WHERE i.status = 'approved' AND v.payload ->> 'language' = 'pa')::int
            AS "punjabiApprovedQlCount",
          count(*) FILTER (WHERE i.accepted_question_id IS NOT NULL)::int AS "questionBankCount"
        FROM content.generation_run_items i
        INNER JOIN content.generation_item_versions v
          ON v.generation_item_id = i.id AND v.version_number = i.current_version_number
        WHERE v.payload ->> 'integrationAuthority' = ${PROBABILITY_NATIVE_REVIEW_AUTHORITY}
      `;
      const freeze = getProbabilityNativeFreezeSummary();
      const approvedItemCount = Number(rows[0]?.approvedItemCount ?? 0);
      const uniqueApprovedSurfaceCount = Number(rows[0]?.uniqueApprovedSurfaceCount ?? 0);
      const hindiApprovedQlCount = Number(rows[0]?.hindiApprovedQlCount ?? 0);
      const punjabiApprovedQlCount = Number(rows[0]?.punjabiApprovedQlCount ?? 0);
      const questionBankCount = Number(rows[0]?.questionBankCount ?? 0);
      res.json({
        chapterId: "Probability",
        permanentQlCount: CATALOG.length,
        nativeReviewSurfaceCount: CATALOG.length * 2,
        generationItemCount: Number(rows[0]?.generationItemCount ?? 0),
        approvedItemCount,
        uniqueApprovedSurfaceCount,
        duplicateApprovedItemCount: Math.max(0, approvedItemCount - uniqueApprovedSurfaceCount),
        hindiApprovedQlCount,
        punjabiApprovedQlCount,
        databaseEvidenceComplete:
          uniqueApprovedSurfaceCount === CATALOG.length * 2
          && hindiApprovedQlCount === CATALOG.length
          && punjabiApprovedQlCount === CATALOG.length
          && questionBankCount === 0,
        questionBankCount,
        integrationAuthority: PROBABILITY_NATIVE_REVIEW_AUTHORITY,
        questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY",
        questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED",
        reviewOnly: true,
        questionBankWritable: false,
        testEligible: false,
        publiclyPublishable: false,
        automaticStudentPublication: false,
        releaseFreeze: freeze,
      });
    } catch (error) {
      console.error("Probability native Question Studio review status failed", error);
      res.status(500).json({ error: "Unable to load Probability native review status." });
    }
  },
);

export default router;
