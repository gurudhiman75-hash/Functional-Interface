import { randomUUID } from "node:crypto";
import { Router } from "express";
import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";
import type {
  InterestQuestionStudioLanguage,
  InterestQuestionStudioRequest,
} from "../quant-v4/topics/Arithmetic/subtopics/Interest/INT-001/interest-question-studio-frozen-adapter-v1";

export type InterestFrozenQuestionStudioRouteConfig = Readonly<{
  pathSegment: string;
  runCodePrefix: string;
  model: string;
  cpId: string;
  packageId: string;
  integrationVersion: string;
  languages: readonly InterestQuestionStudioLanguage[];
  qlIds: readonly string[];
  listPackages: () => readonly any[];
  generateBatch: (request?: InterestQuestionStudioRequest) => Promise<any>;
}>;

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asCount(value: unknown, fallback = 5, max = 50): number {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
}

export function createInterestFrozenQuestionStudioRouter(config: InterestFrozenQuestionStudioRouteConfig) {
  const router = Router();
  const languages = new Set<string>(config.languages);
  const qlIds = new Set<string>(config.qlIds);
  const basePath = `/quant/interest/${config.pathSegment}`;

  function publicRunCode(): string {
    const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
    return `${config.runCodePrefix}-${date}-${randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase()}`;
  }

  async function persistRun(
    questionPackages: readonly any[],
    questions: readonly any[],
    requestSnapshot: Record<string, unknown>,
    actorUserId: string,
  ) {
    if (!questions.length || questions.length !== questionPackages.length) {
      throw new Error(`No valid ${config.cpId} questions matched the request.`);
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
          'examtree', ${config.model}, 0, 0, 0, 0,
          ${timestamp}, ${timestamp}, ${timestamp}, ${timestamp}
        )
      `;
      for (let index = 0; index < questions.length; index += 1) {
        const question = questions[index]!;
        const sourcePackage = questionPackages[index]!;
        const itemId = randomUUID();
        const versionId = randomUUID();
        const payload = {
          ...question,
          sourcePackage,
          integrationAuthority: config.integrationVersion,
          questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY",
          questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED",
          manualApprovalRequired: true,
          questionBankWritable: false,
          testEligible: false,
          mockTestEligible: false,
          publiclyPublishable: false,
          automaticStudentPublication: false,
        };
        JSON.stringify(payload);
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
            ${versionId}::uuid, ${itemId}::uuid, 1, ${JSON.stringify(payload)}::jsonb, ${question.questionId}, ${timestamp}
          )
        `;
      }
      await tx`
        INSERT INTO platform.audit_events (
          id, actor_type, actor_user_id, action_key, entity_type, entity_id, reason, summary, metadata
        ) VALUES (
          ${randomUUID()}::uuid, 'user'::audit_actor_type, ${actorUserId}::uuid,
          ${`question_studio.${config.pathSegment}_run.created`}, 'generation_run', ${runId}::uuid,
          ${`${config.cpId} frozen questions entered the Question Studio review queue with downstream release locks preserved`},
          ${`Created ${questions.length} ${config.cpId} review items in ${publicCode}`},
          ${JSON.stringify({ requestSnapshot, integrationAuthority: config.integrationVersion, questionBankWritable: false, testEligible: false, mockTestEligible: false, publiclyPublishable: false })}::jsonb
        )
      `;
      await tx`
        INSERT INTO platform.outbox_events (id, aggregate_type, aggregate_id, event_type, payload)
        VALUES (
          ${randomUUID()}::uuid, 'generation_run', ${runId}::uuid,
          ${`question_studio.${config.pathSegment}_run.created`},
          ${JSON.stringify({ runId, publicCode, itemCount: questions.length, packageId: config.packageId, checkpointId: config.cpId, reviewOnly: true })}::jsonb
        )
      `;
    });
    return { id: runId, publicCode, status: "review", itemCount: questions.length };
  }

  router.use(authenticate);

  router.get(`${basePath}/package`, requireAdminPermission("content.generation.read"), (_req, res) => {
    res.json({
      generationSystem: "quant-v4",
      activationMode: config.languages.length === 1 ? "FROZEN_ENGLISH_REVIEW" : "FROZEN_MULTILINGUAL_REVIEW",
      package: config.listPackages()[0],
      maxBatchSize: 50,
      permanentQlCount: config.qlIds.length,
      supportedLanguages: config.languages,
      databaseWriteEnabled: true,
      persistenceAllowed: true,
      questionStudioDiscoverable: true,
      questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY",
      questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED",
      questionBankWriteEnabled: false,
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
      integrationAuthority: config.integrationVersion,
    });
  });

  router.get(`${basePath}/preview`, requireAdminPermission("content.generation.read"), async (req, res) => {
    try {
      const language = asString(req.query.language) || "en";
      const qlId = asString(req.query.qlId).toUpperCase();
      if (!languages.has(language)) throw new Error(`Unsupported language '${language}'.`);
      if (qlId && !qlIds.has(qlId)) throw new Error(`Unsupported QL '${qlId}'.`);
      const result = await config.generateBatch({
        canonicalProblemId: config.cpId,
        language,
        questionLanguageId: qlId || undefined,
        seed: asString(req.query.seed) || undefined,
        count: asCount(req.query.count, 1, 20),
      });
      res.json({ ...result, integrationAuthority: config.integrationVersion, reviewOnly: true, productionEligible: false });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : `Unable to preview ${config.cpId} questions.` });
    }
  });

  router.post(`${basePath}/runs`, requireAdminPermission("content.generation.run"), async (req, res) => {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) {
      res.status(403).json({ error: "Administrator session required." });
      return;
    }
    try {
      const language = asString(req.body?.language) || "en";
      const qlId = asString(req.body?.qlId).toUpperCase();
      if (!languages.has(language)) throw new Error(`Unsupported language '${language}'.`);
      if (qlId && !qlIds.has(qlId)) throw new Error(`Unsupported QL '${qlId}'.`);
      const count = asCount(req.body?.count, 5, 50);
      const seed = asString(req.body?.seed) || undefined;
      const result = await config.generateBatch({
        canonicalProblemId: config.cpId,
        language,
        questionLanguageId: qlId || undefined,
        seed,
        count,
      });
      const requestSnapshot = {
        packageId: config.packageId,
        checkpointId: config.cpId,
        language,
        qlId: qlId || null,
        count,
        seed: seed || null,
        integrationAuthority: config.integrationVersion,
        questionStudioDiscoverable: true,
        questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY",
        questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED",
        reviewOnly: true,
        questionBankWritable: false,
        testEligible: false,
        mockTestEligible: false,
        publiclyPublishable: false,
        automaticStudentPublication: false,
        requestedByFirebaseUid: req.user?.id,
      };
      const persisted = await persistRun(result.questionPackages, result.questions, requestSnapshot, actorUserId);
      res.status(201).json({
        ...persisted,
        generationSystem: "quant-v4",
        packageId: config.packageId,
        checkpointId: config.cpId,
        integrationAuthority: config.integrationVersion,
        reviewOnly: true,
        questionBankWritable: false,
        testEligible: false,
        mockTestEligible: false,
        publiclyPublishable: false,
        automaticStudentPublication: false,
      });
    } catch (error) {
      console.error(`${config.cpId} Question Studio run failed`, error);
      res.status(500).json({ error: error instanceof Error ? error.message : `Unable to create ${config.cpId} review run.` });
    }
  });

  router.get(`${basePath}/status`, requireAdminPermission("content.generation.read"), async (_req, res) => {
    try {
      const rows = await sqlClient`
        SELECT
          count(*)::int AS "generationItemCount",
          count(*) FILTER (WHERE i.status = 'approved')::int AS "approvedItemCount",
          count(*) FILTER (WHERE i.accepted_question_id IS NOT NULL)::int AS "questionBankCount"
        FROM content.generation_run_items i
        INNER JOIN content.generation_item_versions v ON v.generation_item_id = i.id AND v.version_number = i.current_version_number
        WHERE v.payload ->> 'packageId' = ${config.packageId}
          AND v.payload ->> 'canonicalProblemId' = ${config.cpId}
          AND v.payload ->> 'integrationAuthority' = ${config.integrationVersion}
      `;
      res.json({
        packageId: config.packageId,
        checkpointId: config.cpId,
        permanentQlCount: config.qlIds.length,
        generationItemCount: Number(rows[0]?.generationItemCount ?? 0),
        approvedItemCount: Number(rows[0]?.approvedItemCount ?? 0),
        questionBankCount: Number(rows[0]?.questionBankCount ?? 0),
        questionStudioDiscoverable: true,
        questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY",
        questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED",
        reviewOnly: true,
        questionBankWritable: false,
        testEligible: false,
        mockTestEligible: false,
        publiclyPublishable: false,
        automaticStudentPublication: false,
        integrationAuthority: config.integrationVersion,
      });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : `Unable to read ${config.cpId} Question Studio status.` });
    }
  });

  return router;
}
