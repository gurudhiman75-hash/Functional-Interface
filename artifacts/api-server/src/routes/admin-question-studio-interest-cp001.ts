import { randomUUID } from "node:crypto";
import { Router } from "express";
import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";
import {
  INT_CP001_QUESTION_STUDIO_CP_ID,
  INT_CP001_QUESTION_STUDIO_INTEGRATION_VERSION,
  INT_CP001_QUESTION_STUDIO_LANGUAGES,
  INT_CP001_QUESTION_STUDIO_PACKAGE_ID,
  generateIntCp001QuestionStudioBatch,
  listIntCp001QuestionStudioPackages,
} from "../quant-v4/topics/Arithmetic/subtopics/Interest/INT-001/cp001-question-studio-integration-v1";
import { INT_CP001_FINAL_QL_IDS } from "../quant-v4/topics/Arithmetic/subtopics/Interest/INT-001/cp001-final-registry";

const router = Router();
const LANGUAGES = new Set<string>(INT_CP001_QUESTION_STUDIO_LANGUAGES);
const QL_IDS = new Set<string>(INT_CP001_FINAL_QL_IDS);

function asString(value: unknown) { return typeof value === "string" ? value.trim() : ""; }
function asCount(value: unknown, fallback = 5, max = 50) {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
}
function publicRunCode() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `INT01-${date}-${randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase()}`;
}

async function persistRun(questionPackages: readonly any[], questions: readonly any[], requestSnapshot: Record<string, unknown>, actorUserId: string) {
  if (!questions.length || questions.length !== questionPackages.length) throw new Error("No valid INT-CP-001 questions matched the request.");
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
        'examtree', 'quant-v4-int-cp001-frozen-multilingual', 0, 0, 0, 0,
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
        integrationAuthority: INT_CP001_QUESTION_STUDIO_INTEGRATION_VERSION,
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
          ${versionId}::uuid, ${itemId}::uuid, 1, ${JSON.stringify(payload)}::jsonb,
          ${String(question.questionId ?? question.questionLanguageId ?? sourcePackage.qlId)}, ${timestamp}
        )
      `;
    }
    await tx`
      INSERT INTO platform.audit_events (
        id, actor_type, actor_user_id, action_key, entity_type, entity_id, reason, summary, metadata
      ) VALUES (
        ${randomUUID()}::uuid, 'user'::audit_actor_type, ${actorUserId}::uuid,
        'question_studio.interest_cp001_run.created', 'generation_run', ${runId}::uuid,
        'INT-CP-001 frozen multilingual questions entered the Question Studio review queue with downstream release locks preserved',
        ${`Created ${questions.length} INT-CP-001 review items in ${publicCode}`},
        ${JSON.stringify({ requestSnapshot, integrationAuthority: INT_CP001_QUESTION_STUDIO_INTEGRATION_VERSION, questionBankWritable: false, testEligible: false, publiclyPublishable: false })}::jsonb
      )
    `;
    await tx`
      INSERT INTO platform.outbox_events (id, aggregate_type, aggregate_id, event_type, payload)
      VALUES (
        ${randomUUID()}::uuid, 'generation_run', ${runId}::uuid,
        'question_studio.interest_cp001_run.created',
        ${JSON.stringify({ runId, publicCode, itemCount: questions.length, packageId: INT_CP001_QUESTION_STUDIO_PACKAGE_ID, checkpointId: INT_CP001_QUESTION_STUDIO_CP_ID, reviewOnly: true })}::jsonb
      )
    `;
  });
  return { id: runId, publicCode, status: "review", itemCount: questions.length };
}

router.use(authenticate);

router.get("/quant/interest/cp001/package", requireAdminPermission("content.generation.read"), (_req, res) => {
  res.json({
    generationSystem: "quant-v4",
    activationMode: "FROZEN_MULTILINGUAL_REVIEW",
    package: listIntCp001QuestionStudioPackages()[0],
    maxBatchSize: 50,
    permanentQlCount: INT_CP001_FINAL_QL_IDS.length,
    supportedLanguages: INT_CP001_QUESTION_STUDIO_LANGUAGES,
    databaseWriteEnabled: true,
    persistenceAllowed: true,
    questionStudioDiscoverable: true,
    reviewOnly: true,
    questionBankWriteEnabled: false,
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    integrationAuthority: INT_CP001_QUESTION_STUDIO_INTEGRATION_VERSION,
  });
});

router.get("/quant/interest/cp001/preview", requireAdminPermission("content.generation.read"), async (req, res) => {
  try {
    const language = asString(req.query.language) || "en";
    const qlId = asString(req.query.qlId);
    if (!LANGUAGES.has(language)) throw new Error(`Unsupported language '${language}'.`);
    if (qlId && !QL_IDS.has(qlId)) throw new Error(`Unsupported QL '${qlId}'.`);
    const result = await generateIntCp001QuestionStudioBatch({
      language,
      qlId: qlId || undefined,
      difficulty: asString(req.query.difficulty) || undefined,
      seed: asString(req.query.seed) || undefined,
      count: asCount(req.query.count, 1, 20),
    });
    res.json({ ...result, integrationAuthority: INT_CP001_QUESTION_STUDIO_INTEGRATION_VERSION, reviewOnly: true, productionEligible: false });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Unable to preview Interest CP-001 questions." });
  }
});

router.post("/quant/interest/cp001/runs", requireAdminPermission("content.generation.run"), async (req, res) => {
  const actorUserId = req.adminSession?.user.id;
  if (!actorUserId) { res.status(403).json({ error: "Administrator session required." }); return; }
  try {
    const language = asString(req.body?.language) || "en";
    const qlId = asString(req.body?.qlId);
    if (!LANGUAGES.has(language)) throw new Error(`Unsupported language '${language}'.`);
    if (qlId && !QL_IDS.has(qlId)) throw new Error(`Unsupported QL '${qlId}'.`);
    const count = asCount(req.body?.count, 5, 50);
    const seed = asString(req.body?.seed) || undefined;
    const difficulty = asString(req.body?.difficulty) || undefined;
    const result = await generateIntCp001QuestionStudioBatch({ language, qlId: qlId || undefined, difficulty, seed, count });
    const requestSnapshot = {
      packageId: INT_CP001_QUESTION_STUDIO_PACKAGE_ID,
      checkpointId: INT_CP001_QUESTION_STUDIO_CP_ID,
      language, qlId: qlId || null, difficulty: difficulty || null, count, seed: seed || null,
      integrationAuthority: INT_CP001_QUESTION_STUDIO_INTEGRATION_VERSION,
      questionStudioDiscoverable: true, reviewOnly: true,
      questionBankWritable: false, testEligible: false, mockTestEligible: false, publiclyPublishable: false,
      requestedByFirebaseUid: req.user?.id,
    };
    const persisted = await persistRun(result.questionPackages, result.questions, requestSnapshot, actorUserId);
    res.status(201).json({ ...persisted, generationSystem: "quant-v4", packageId: INT_CP001_QUESTION_STUDIO_PACKAGE_ID, checkpointId: INT_CP001_QUESTION_STUDIO_CP_ID, integrationAuthority: INT_CP001_QUESTION_STUDIO_INTEGRATION_VERSION, reviewOnly: true, questionBankWritable: false, testEligible: false, mockTestEligible: false, publiclyPublishable: false });
  } catch (error) {
    console.error("Interest CP-001 Question Studio run failed", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Unable to create Interest CP-001 review run." });
  }
});

router.get("/quant/interest/cp001/status", requireAdminPermission("content.generation.read"), async (_req, res) => {
  try {
    const rows = await sqlClient`
      SELECT
        count(*)::int AS "generationItemCount",
        count(*) FILTER (WHERE i.status = 'approved')::int AS "approvedItemCount",
        count(*) FILTER (WHERE i.accepted_question_id IS NOT NULL)::int AS "questionBankCount"
      FROM content.generation_run_items i
      INNER JOIN content.generation_item_versions v ON v.generation_item_id = i.id AND v.version_number = i.current_version_number
      WHERE v.payload ->> 'packageId' = ${INT_CP001_QUESTION_STUDIO_PACKAGE_ID}
        AND v.payload ->> 'canonicalProblemId' = ${INT_CP001_QUESTION_STUDIO_CP_ID}
        AND v.payload ->> 'integrationAuthority' = ${INT_CP001_QUESTION_STUDIO_INTEGRATION_VERSION}
    `;
    res.json({
      packageId: INT_CP001_QUESTION_STUDIO_PACKAGE_ID,
      checkpointId: INT_CP001_QUESTION_STUDIO_CP_ID,
      permanentQlCount: INT_CP001_FINAL_QL_IDS.length,
      generationItemCount: Number(rows[0]?.generationItemCount ?? 0),
      approvedItemCount: Number(rows[0]?.approvedItemCount ?? 0),
      questionBankCount: Number(rows[0]?.questionBankCount ?? 0),
      questionStudioDiscoverable: true,
      reviewOnly: true,
      questionBankWritable: false,
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      integrationAuthority: INT_CP001_QUESTION_STUDIO_INTEGRATION_VERSION,
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Unable to read Interest CP-001 Question Studio status." });
  }
});

export default router;
