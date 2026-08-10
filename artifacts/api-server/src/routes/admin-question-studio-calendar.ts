import { randomUUID } from "node:crypto";
import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";
import { CALENDAR_PERMANENT_QL_IDS, type CalendarPermanentQlId } from "../reasoning-v1/topics/Calendar/CAL-001/permanent-contracts.ts";
import {
  CAL_001_PACKAGE_ID,
  CAL_001_PRODUCTION_RELEASE,
  type Cal001QuestionStudioDifficulty,
  type Cal001QuestionStudioLanguage,
} from "../reasoning-v1/topics/Calendar/CAL-001/question-studio-runtime.ts";
import {
  CAL_001_QUESTION_STUDIO_REVIEW_PACKAGE,
  previewCal001QuestionStudioReview,
} from "../reasoning-v1/topics/Calendar/CAL-001/question-studio-review-adapter.ts";

const router = Router();
const LANGUAGES = new Set(["en", "hi", "pa"]);
const DIFFICULTIES = new Set(["Easy", "Medium", "Hard"]);
const QL_IDS = new Set<string>(CALENDAR_PERMANENT_QL_IDS);

type CalendarPreviewResult = Awaited<ReturnType<typeof previewCal001QuestionStudioReview>>;
type CalendarPreviewQuestion = CalendarPreviewResult["questions"][number];

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asCount(value: unknown, fallback = 5, max = 50) {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
}

function publicRunCode() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `CAL-${date}-${randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase()}`;
}

function explanationText(question: CalendarPreviewQuestion) {
  const lines = [
    ...question.explanation.steps.map((step, index) => `${index + 1}. ${step}`),
    question.explanation.conclusion
      ? `Conclusion: ${question.explanation.conclusion}`
      : "",
  ].filter(Boolean);
  return lines.join("\n");
}

function productionPayload(question: CalendarPreviewQuestion) {
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
    reasoningGraph: question.reasoningGraph,
    renderer: question.renderer,
    difficulty: question.difficultyBand,
    difficultyLabel: question.difficultyBand,
    patternId: question.qlId,
    qlId: question.qlId,
    packageId: CAL_001_PACKAGE_ID,
    canonicalProblemId: question.canonicalProblemId,
    canonicalItemId: question.canonicalItemId,
    questionLanguageId: question.questionLanguageId,
    questionId: question.questionId,
    topic: "Reasoning",
    subtopic: "Calendar",
    subject: "Reasoning Ability",
    language: question.language,
    locale: question.locale,
    seed: question.parameters.seed,
    runtimeMode: CAL_001_PRODUCTION_RELEASE.runtimeMode,
    sourceRuntimeMode: question.parameters.runtimeMode,
    reviewStatus: CAL_001_PRODUCTION_RELEASE.reviewStatus,
    questionBankStatus: CAL_001_PRODUCTION_RELEASE.questionBankStatus,
    testEligibility: CAL_001_PRODUCTION_RELEASE.testEligibility,
    publiclyPublishable: CAL_001_PRODUCTION_RELEASE.publiclyPublishable,
    mockTestEligible: CAL_001_PRODUCTION_RELEASE.mockTestEligible,
    manualApprovalRequired: CAL_001_PRODUCTION_RELEASE.manualApprovalRequired,
    automaticStudentPublication:
      CAL_001_PRODUCTION_RELEASE.automaticStudentPublication,
    releaseAuthority: CAL_001_PRODUCTION_RELEASE.authority,
    traceability: question.traceability,
    sourceValidation: question.validation,
    generationContext: {
      generationDomain: "reasoning-v1",
      packageId: CAL_001_PACKAGE_ID,
      runtimeMode: CAL_001_PRODUCTION_RELEASE.runtimeMode,
      sourceRuntimeMode: question.parameters.runtimeMode,
      reviewStatus: CAL_001_PRODUCTION_RELEASE.reviewStatus,
      questionBankStatus: CAL_001_PRODUCTION_RELEASE.questionBankStatus,
      testEligibility: CAL_001_PRODUCTION_RELEASE.testEligibility,
      publiclyPublishable: CAL_001_PRODUCTION_RELEASE.publiclyPublishable,
      mockTestEligible: CAL_001_PRODUCTION_RELEASE.mockTestEligible,
      manualApprovalRequired: true,
      automaticStudentPublication: false,
      releaseAuthority: CAL_001_PRODUCTION_RELEASE.authority,
      permanentQlId: question.qlId,
    },
  };
}

async function persistRun(
  questions: readonly CalendarPreviewQuestion[],
  requestSnapshot: Record<string, unknown>,
  actorUserId: string,
) {
  if (questions.length === 0) {
    throw new Error("No CAL-001 questions matched the request.");
  }

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
        'examtree', 'reasoning-v1-cal-001', 0, 0, 0, 0,
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
        'question_studio.calendar_run.created', 'generation_run', ${runId}::uuid,
        'Approved CAL-001 generator entered Question Studio review',
        ${`Created ${questions.length} CAL-001 review items in ${publicCode}`},
        ${JSON.stringify({ requestSnapshot, releaseAuthority: CAL_001_PRODUCTION_RELEASE.authority })}::jsonb
      )
    `;

    await tx`
      INSERT INTO platform.outbox_events (
        id, aggregate_type, aggregate_id, event_type, payload
      ) VALUES (
        ${randomUUID()}::uuid, 'generation_run', ${runId}::uuid,
        'question_studio.calendar_run.created',
        ${JSON.stringify({ runId, publicCode, itemCount: questions.length, packageId: CAL_001_PACKAGE_ID })}::jsonb
      )
    `;
  });

  return { id: runId, publicCode, status: "review", itemCount: questions.length };
}

router.use(authenticate);

router.get(
  "/reasoning/calendar/package",
  requireAdminPermission("content.generation.read"),
  (_req, res) => {
    res.json({
      generationSystem: "reasoning-v1",
      activationMode: "PRODUCTION_REVIEW",
      package: CAL_001_QUESTION_STUDIO_REVIEW_PACKAGE,
      maxBatchSize: 50,
      permanentQlCount: CALENDAR_PERMANENT_QL_IDS.length,
      databaseWriteEnabled: true,
      persistenceAllowed: true,
      bulkSyncSupported: false,
    });
  },
);

router.get(
  "/reasoning/calendar/preview",
  requireAdminPermission("content.generation.read"),
  async (req, res) => {
    try {
      const language = (asString(req.query.language) ||
        "en") as Cal001QuestionStudioLanguage;
      const difficulty = asString(req.query.difficulty);
      const qlId = asString(req.query.qlId);
      if (!LANGUAGES.has(language)) {
        throw new Error(`Unsupported language '${language}'.`);
      }
      if (difficulty && !DIFFICULTIES.has(difficulty)) {
        throw new Error(`Unsupported difficulty '${difficulty}'.`);
      }
      if (qlId && !QL_IDS.has(qlId)) {
        throw new Error(`Unsupported QL '${qlId}'.`);
      }

      const result = await previewCal001QuestionStudioReview({
        language,
        difficulty: difficulty
          ? (difficulty as Cal001QuestionStudioDifficulty)
          : undefined,
        qlId: qlId ? (qlId as CalendarPermanentQlId) : undefined,
        seed: asString(req.query.seed) || undefined,
        count: asCount(req.query.count, 1, 20),
      });
      res.json({
        ...result,
        releaseAuthority: CAL_001_PRODUCTION_RELEASE.authority,
        productionEligible: true,
      });
    } catch (error) {
      res.status(400).json({
        error:
          error instanceof Error
            ? error.message
            : "Unable to preview Calendar questions.",
      });
    }
  },
);

router.post(
  "/reasoning/calendar/runs",
  requireAdminPermission("content.generation.run"),
  async (req, res) => {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) {
      res.status(403).json({ error: "Administrator session required." });
      return;
    }

    try {
      const language = (asString(req.body?.language) ||
        "en") as Cal001QuestionStudioLanguage;
      const difficulty = asString(req.body?.difficulty);
      const qlId = asString(req.body?.qlId);
      if (!LANGUAGES.has(language)) {
        throw new Error(`Unsupported language '${language}'.`);
      }
      if (difficulty && !DIFFICULTIES.has(difficulty)) {
        throw new Error(`Unsupported difficulty '${difficulty}'.`);
      }
      if (qlId && !QL_IDS.has(qlId)) {
        throw new Error(`Unsupported QL '${qlId}'.`);
      }

      const count = asCount(req.body?.count, 5, 50);
      const seed = asString(req.body?.seed) || undefined;
      const result = await previewCal001QuestionStudioReview({
        language,
        difficulty: difficulty
          ? (difficulty as Cal001QuestionStudioDifficulty)
          : undefined,
        qlId: qlId ? (qlId as CalendarPermanentQlId) : undefined,
        seed,
        count,
      });
      const persisted = await persistRun(
        result.questions,
        {
          packageId: CAL_001_PACKAGE_ID,
          language,
          difficulty: difficulty || null,
          qlId: qlId || null,
          count,
          seed: seed || null,
          releaseAuthority: CAL_001_PRODUCTION_RELEASE.authority,
          requestedByFirebaseUid: req.user?.id,
        },
        actorUserId,
      );
      res.status(201).json({
        ...persisted,
        generationSystem: "reasoning-v1",
        packageId: CAL_001_PACKAGE_ID,
      });
    } catch (error) {
      console.error("Calendar Question Studio run failed", error);
      res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : "Unable to create Calendar review run.",
      });
    }
  },
);

router.get(
  "/reasoning/calendar/status",
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
        WHERE v.payload ->> 'packageId' = ${CAL_001_PACKAGE_ID}
          AND v.payload ->> 'releaseAuthority' = ${CAL_001_PRODUCTION_RELEASE.authority}
      `;
      res.json({
        packageId: CAL_001_PACKAGE_ID,
        permanentQlCount: CALENDAR_PERMANENT_QL_IDS.length,
        generationItemCount: Number(rows[0]?.generationItemCount ?? 0),
        approvedItemCount: Number(rows[0]?.approvedItemCount ?? 0),
        questionBankCount: Number(rows[0]?.questionBankCount ?? 0),
        releaseAuthority: CAL_001_PRODUCTION_RELEASE.authority,
        bulkSyncSupported: false,
        automaticStudentPublication: false,
      });
    } catch (error) {
      res.status(500).json({ error: "Unable to load Calendar production status." });
    }
  },
);

export default router;
