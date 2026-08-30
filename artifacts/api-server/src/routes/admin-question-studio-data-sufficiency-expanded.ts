import { randomUUID } from "node:crypto";
import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";
import {
  DSF_CP017_CHECKPOINT_ID,
  DSF_CP017_PACKAGE_ID,
  DSF_CP017_QUESTION_STUDIO_AUTHORITY,
  DSF_CP017_QUESTION_STUDIO_PACKAGE,
  DSF_CP017_RUNTIME_MODE,
  generateDsfCp017QuestionStudioBatch,
  type DsfCp017Difficulty,
  type DsfCp017LaneId,
} from "../reasoning-v1/topics/Data-Sufficiency/DSF-001/DSF-CP-017/question-studio-normal-workflow-v1";
import type { SufficiencyClass } from "../reasoning-v1/topics/Data-Sufficiency/DSF-001/foundation";

const router = Router();
const LANE_IDS = new Set<string>(DSF_CP017_QUESTION_STUDIO_PACKAGE.lanes.map((lane) => lane.id));
const SEMANTIC_CLASSES = new Set<string>(DSF_CP017_QUESTION_STUDIO_PACKAGE.supportedSemanticClasses);
const DIFFICULTIES = new Set<string>(DSF_CP017_QUESTION_STUDIO_PACKAGE.supportedDifficulties);

type ExpansionRequest = Readonly<{
  laneId?: DsfCp017LaneId;
  semanticClass?: SufficiencyClass;
  difficulty?: DsfCp017Difficulty;
  qlId?: "DSF-QL-001";
  count: number;
  seed?: string;
}>;

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asCount(value: unknown, fallback = 5, max = 50): number {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
}

function publicRunCode(): string {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `DSF-X-${date}-${randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase()}`;
}

function requestInput(source: Record<string, unknown>, fallbackCount: number, maxCount: number): ExpansionRequest {
  const language = asString(source.language) || "en";
  const laneId = asString(source.laneId) || asString(source.expansionLaneId);
  const semanticClass = asString(source.semanticClass);
  const difficulty = asString(source.difficulty);
  const qlId = asString(source.qlId) || "DSF-QL-001";
  const seed = asString(source.seed) || undefined;

  if (language !== "en") {
    throw new Error("Expanded Data Sufficiency Question Studio generation is currently English-only.");
  }
  if (qlId !== "DSF-QL-001") {
    throw new Error("DSF-QL-002 is permanent but is not yet enabled for breadth-qualified normal Question Studio generation.");
  }
  if (laneId && !LANE_IDS.has(laneId)) {
    throw new Error(`Unsupported expanded Data Sufficiency lane '${laneId}'.`);
  }
  if (semanticClass && !SEMANTIC_CLASSES.has(semanticClass)) {
    throw new Error(`Unsupported Data Sufficiency sufficiency class '${semanticClass}'.`);
  }
  if (difficulty && !DIFFICULTIES.has(difficulty)) {
    throw new Error(`Unsupported Data Sufficiency difficulty '${difficulty}'.`);
  }

  return {
    laneId: laneId ? laneId as DsfCp017LaneId : undefined,
    semanticClass: semanticClass ? semanticClass as SufficiencyClass : undefined,
    difficulty: difficulty ? difficulty as DsfCp017Difficulty : undefined,
    qlId: "DSF-QL-001",
    count: asCount(source.count, fallbackCount, maxCount),
    seed,
  };
}

function assertReviewOnlyPayload(question: Record<string, any>): void {
  const context = question.generationContext ?? {};
  if (question.integrationAuthority !== DSF_CP017_QUESTION_STUDIO_AUTHORITY) {
    throw new Error("CP017 persistence rejected a payload from another integration authority.");
  }
  if (question.qlId !== "DSF-QL-001" || question.integrationCheckpointId !== DSF_CP017_CHECKPOINT_ID) {
    throw new Error("CP017 persistence rejected an invalid QL/checkpoint identity.");
  }
  if (
    question.questionBankStatus !== "NOT_STORED" ||
    question.questionBankWritable !== false ||
    question.testEligible !== false ||
    question.mockTestEligible !== false ||
    question.publiclyPublishable !== false ||
    question.automaticStudentPublication !== false ||
    context.questionBankWritable !== false ||
    context.testEligible !== false ||
    context.mockTestEligible !== false ||
    context.publiclyPublishable !== false ||
    context.automaticStudentPublication !== false
  ) {
    throw new Error("CP017 persistence rejected a payload with downstream release gates open.");
  }
}

async function persistExpansionRun(
  questions: readonly Record<string, any>[],
  requestSnapshot: Record<string, unknown>,
  actorUserId: string,
) {
  if (!questions.length) throw new Error("No expanded Data Sufficiency questions matched the request.");
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
        'examtree', 'reasoning-v1-dsf-cp017-expanded-review-v1',
        0, 0, 0, 0, ${timestamp}, ${timestamp}, ${timestamp}, ${timestamp}, ${timestamp}
      )
    `;

    for (let index = 0; index < questions.length; index += 1) {
      const question = questions[index]!;
      assertReviewOnlyPayload(question);
      const itemId = randomUUID();
      const versionId = randomUUID();
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
          ${versionId}::uuid, ${itemId}::uuid, 1, ${JSON.stringify(question)}::jsonb,
          ${String(question.questionId)}, ${timestamp}
        )
      `;
    }

    await tx`
      INSERT INTO platform.audit_events (
        id, actor_type, actor_user_id, action_key, entity_type, entity_id,
        reason, summary, metadata
      ) VALUES (
        ${randomUUID()}::uuid, 'user'::audit_actor_type, ${actorUserId}::uuid,
        'question_studio.data_sufficiency_expansion_run.created', 'generation_run', ${runId}::uuid,
        'CP017 expanded Data Sufficiency questions entered the normal Question Studio review queue; Question Bank/test/mock/public release remains locked',
        ${`Created ${questions.length} expanded Data Sufficiency review items in ${publicCode}`},
        ${JSON.stringify({
          requestSnapshot,
          integrationCheckpointId: DSF_CP017_CHECKPOINT_ID,
          integrationAuthority: DSF_CP017_QUESTION_STUDIO_AUTHORITY,
          runtimeMode: DSF_CP017_RUNTIME_MODE,
          generatableQlIds: DSF_CP017_QUESTION_STUDIO_PACKAGE.generatableQlIds,
          currentPermanentQlIds: DSF_CP017_QUESTION_STUDIO_PACKAGE.currentPermanentQlIds,
          questionBankWritable: false,
          testEligible: false,
          mockTestEligible: false,
          publiclyPublishable: false,
          automaticStudentPublication: false,
        })}::jsonb
      )
    `;

    await tx`
      INSERT INTO platform.outbox_events (
        id, aggregate_type, aggregate_id, event_type, payload
      ) VALUES (
        ${randomUUID()}::uuid, 'generation_run', ${runId}::uuid,
        'question_studio.data_sufficiency_expansion_run.created',
        ${JSON.stringify({
          runId,
          publicCode,
          itemCount: questions.length,
          packageId: DSF_CP017_PACKAGE_ID,
          integrationCheckpointId: DSF_CP017_CHECKPOINT_ID,
          reviewOnly: true,
        })}::jsonb
      )
    `;
  });

  return { id: runId, publicCode, status: "review" as const, itemCount: questions.length };
}

router.use(authenticate);

router.get(
  "/reasoning/data-sufficiency/expanded/package",
  requireAdminPermission("content.generation.read"),
  (_req, res) => {
    res.json({
      generationSystem: "reasoning-v1",
      activationMode: "NORMAL_QUESTION_STUDIO_REVIEW",
      package: DSF_CP017_QUESTION_STUDIO_PACKAGE,
      maxBatchSize: 50,
      currentPermanentQlIds: DSF_CP017_QUESTION_STUDIO_PACKAGE.currentPermanentQlIds,
      generatableQlIds: DSF_CP017_QUESTION_STUDIO_PACKAGE.generatableQlIds,
      nextAvailableQlId: DSF_CP017_QUESTION_STUDIO_PACKAGE.nextAvailableQlId,
      databaseWriteEnabled: true,
      persistenceAllowed: true,
      manualReviewRequired: true,
      questionBankWriteEnabled: false,
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
    });
  },
);

router.get(
  "/reasoning/data-sufficiency/expanded/preview",
  requireAdminPermission("content.generation.read"),
  (req, res) => {
    try {
      const input = requestInput(req.query as Record<string, unknown>, 1, 20);
      const result = generateDsfCp017QuestionStudioBatch({ ...input, seed: input.seed ?? "dsf-cp017-preview" });
      res.json({
        ...result,
        productionEligible: false,
        manualReviewRequired: true,
        questionBankStatus: "NOT_STORED",
        questionBankWritable: false,
        testEligibility: "INELIGIBLE",
        testEligible: false,
        mockTestEligible: false,
        publiclyPublishable: false,
        automaticStudentPublication: false,
      });
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error ? error.message : "Unable to preview expanded Data Sufficiency questions.",
      });
    }
  },
);

router.post(
  "/reasoning/data-sufficiency/expanded/runs",
  requireAdminPermission("content.generation.run"),
  async (req, res) => {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) {
      res.status(403).json({ error: "Administrator session required." });
      return;
    }

    try {
      const input = requestInput((req.body ?? {}) as Record<string, unknown>, 5, 50);
      const seed = input.seed ?? `dsf-cp017-run:${Date.now()}`;
      const result = generateDsfCp017QuestionStudioBatch({ ...input, seed });
      const requestSnapshot = {
        chapter: "Data Sufficiency",
        generationScope: "EXPANDED_REVIEW",
        packageId: DSF_CP017_PACKAGE_ID,
        qlId: "DSF-QL-001",
        laneId: input.laneId ?? null,
        semanticClass: input.semanticClass ?? null,
        difficulty: input.difficulty ?? null,
        language: "en",
        count: input.count,
        seed,
        integrationCheckpointId: DSF_CP017_CHECKPOINT_ID,
        integrationAuthority: DSF_CP017_QUESTION_STUDIO_AUTHORITY,
        questionStudioDiscoverable: true,
        persistenceAllowed: true,
        reviewOnly: true,
        manualApprovalRequired: true,
        questionBankStatus: "NOT_STORED",
        questionBankWritable: false,
        testEligibility: "INELIGIBLE",
        testEligible: false,
        mockTestEligible: false,
        publiclyPublishable: false,
        automaticStudentPublication: false,
        requestedByFirebaseUid: req.user?.id,
      };
      const persisted = await persistExpansionRun(result.questions, requestSnapshot, actorUserId);
      res.status(201).json({
        ...persisted,
        generationSystem: "reasoning-v1",
        chapter: "Data Sufficiency",
        generationScope: "EXPANDED_REVIEW",
        packageId: DSF_CP017_PACKAGE_ID,
        qlId: "DSF-QL-001",
        integrationCheckpointId: DSF_CP017_CHECKPOINT_ID,
        integrationAuthority: DSF_CP017_QUESTION_STUDIO_AUTHORITY,
        language: "en",
        manualReviewRequired: true,
        questionBankStatus: "NOT_STORED",
        questionBankWritable: false,
        testEligibility: "INELIGIBLE",
        testEligible: false,
        mockTestEligible: false,
        publiclyPublishable: false,
        automaticStudentPublication: false,
      });
    } catch (error) {
      console.error("Expanded Data Sufficiency Question Studio run failed", error);
      res.status(400).json({
        error: error instanceof Error ? error.message : "Unable to create expanded Data Sufficiency review run.",
      });
    }
  },
);

router.get(
  "/reasoning/data-sufficiency/expanded/status",
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
        WHERE v.payload ->> 'integrationAuthority' = ${DSF_CP017_QUESTION_STUDIO_AUTHORITY}
      `;
      res.json({
        chapter: "Data Sufficiency",
        generationScope: "EXPANDED_REVIEW",
        integrationCheckpointId: DSF_CP017_CHECKPOINT_ID,
        integrationAuthority: DSF_CP017_QUESTION_STUDIO_AUTHORITY,
        permanentQlCount: DSF_CP017_QUESTION_STUDIO_PACKAGE.currentPermanentQlIds.length,
        generatableQlCount: DSF_CP017_QUESTION_STUDIO_PACKAGE.generatableQlIds.length,
        laneCount: DSF_CP017_QUESTION_STUDIO_PACKAGE.laneCount,
        generationItemCount: Number(rows[0]?.generationItemCount ?? 0),
        approvedItemCount: Number(rows[0]?.approvedItemCount ?? 0),
        questionBankCount: Number(rows[0]?.questionBankCount ?? 0),
        currentPermanentQlIds: DSF_CP017_QUESTION_STUDIO_PACKAGE.currentPermanentQlIds,
        generatableQlIds: DSF_CP017_QUESTION_STUDIO_PACKAGE.generatableQlIds,
        nextAvailableQlId: DSF_CP017_QUESTION_STUDIO_PACKAGE.nextAvailableQlId,
        supportedLanguages: DSF_CP017_QUESTION_STUDIO_PACKAGE.supportedLanguages,
        supportedDifficulties: DSF_CP017_QUESTION_STUDIO_PACKAGE.supportedDifficulties,
        questionStudioDiscoverable: true,
        questionStudioGenerationEnabled: true,
        persistenceAllowed: true,
        manualReviewRequired: true,
        reviewOnly: true,
        questionBankStatus: "NOT_STORED",
        questionBankWritable: false,
        testEligibility: "INELIGIBLE",
        testEligible: false,
        mockTestEligible: false,
        publiclyPublishable: false,
        automaticStudentPublication: false,
      });
    } catch (error) {
      console.error("Expanded Data Sufficiency Question Studio status failed", error);
      res.status(500).json({ error: "Unable to load expanded Data Sufficiency Question Studio status." });
    }
  },
);

export default router;
