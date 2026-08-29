import { randomUUID } from "node:crypto";
import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";
import { listQuestionStudioPackages as listCurrentQuestionStudioPackages } from "../question-studio/shared-generation-engine-sri";
import {
  DSF_CP017_NORMAL_QUESTION_STUDIO_AUTHORITY,
  DSF_CP017_NORMAL_QUESTION_STUDIO_PACKAGE_V1,
  DSF_CP017_RUNTIME_MODE,
  generateDsfCp017NormalQuestionStudioBatch,
  isDsfCp017NormalQuestionStudioRequest,
} from "../reasoning-v1/topics/Data-Sufficiency/DSF-001/DSF-CP-017/question-studio-normal-integration-v1";

const router = Router();

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asPositiveInteger(value: unknown, fallback: number, max: number): number {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
}

function publicRunCode(): string {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const suffix = randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase();
  return `DSF-${date}-${suffix}`;
}

function mergedQuestionStudioPackages() {
  const packages = [...listCurrentQuestionStudioPackages()] as any[];
  const existingIndex = packages.findIndex((entry) => String(entry.packageId) === "DSF-001");
  if (existingIndex >= 0) packages.splice(existingIndex, 1, DSF_CP017_NORMAL_QUESTION_STUDIO_PACKAGE_V1);
  else packages.push(DSF_CP017_NORMAL_QUESTION_STUDIO_PACKAGE_V1);
  return packages.sort((left, right) => String(left.packageId).localeCompare(String(right.packageId)));
}

function publicCapability(pkg: any) {
  return {
    packageId: String(pkg.packageId),
    topic: String(pkg.topic),
    subtopic: String(pkg.subtopic),
    subject: asString(pkg.subject) || undefined,
    label: String(pkg.label),
    enabled: Boolean(pkg.enabled),
    cpIds: Array.isArray(pkg.cpIds) ? pkg.cpIds.map(String) : [],
    canonicalProblems: Array.isArray(pkg.canonicalProblems) ? pkg.canonicalProblems : [],
    permanentQlCount: Number(pkg.permanentQlCount ?? 0),
    permanentQlIds: Array.isArray(pkg.permanentQlIds) ? pkg.permanentQlIds.map(String) : [],
    nextAvailableQlId: asString(pkg.nextAvailableQlId) || undefined,
    supportedLanguages: Array.isArray(pkg.supportedLanguages) ? pkg.supportedLanguages.map(String) : ["en"],
    supportedDifficulties: Array.isArray(pkg.supportedDifficulties) ? pkg.supportedDifficulties.map(String) : [],
    runtimeMode: asString(pkg.runtimeMode) || undefined,
    reviewStatus: asString(pkg.reviewStatus) || undefined,
    difficultyPolicy: asString(pkg.difficultyPolicy) || undefined,
    questionStudioDiscoverable: typeof pkg.questionStudioDiscoverable === "boolean" ? pkg.questionStudioDiscoverable : undefined,
    questionStudioGenerationEnabled: typeof pkg.questionStudioGenerationEnabled === "boolean" ? pkg.questionStudioGenerationEnabled : undefined,
    persistenceAllowed: typeof pkg.persistenceAllowed === "boolean" ? pkg.persistenceAllowed : undefined,
    reviewOnly: typeof pkg.reviewOnly === "boolean" ? pkg.reviewOnly : undefined,
    manualApprovalRequired: typeof pkg.manualApprovalRequired === "boolean" ? pkg.manualApprovalRequired : undefined,
    questionBankStatus: asString(pkg.questionBankStatus) || undefined,
    questionBankWritable: typeof pkg.questionBankWritable === "boolean" ? pkg.questionBankWritable : undefined,
    testEligibility: asString(pkg.testEligibility) || undefined,
    testEligible: typeof pkg.testEligible === "boolean" ? pkg.testEligible : undefined,
    mockTestEligible: typeof pkg.mockTestEligible === "boolean" ? pkg.mockTestEligible : undefined,
    publiclyPublishable: typeof pkg.publiclyPublishable === "boolean" ? pkg.publiclyPublishable : undefined,
    automaticStudentPublication: typeof pkg.automaticStudentPublication === "boolean" ? pkg.automaticStudentPublication : undefined,
    maxBatchSize: Number(pkg.maxBatchSize ?? 50),
    maxQl002BatchSize: typeof pkg.maxQl002BatchSize === "number" ? pkg.maxQl002BatchSize : undefined,
    releaseId: asString(pkg.releaseId) || undefined,
  };
}

router.use(authenticate);

/**
 * This route intentionally runs before the SRI capability route. It returns the
 * exact current package catalog plus the additive DSF-001 CP017 normal-Studio
 * registration. Nothing else in the existing capability chain is replaced.
 */
router.get("/capabilities", requireAdminPermission("content.generation.read"), async (_req, res) => {
  try {
    res.json({
      generationSystem: "question-studio",
      packages: mergedQuestionStudioPackages().map(publicCapability),
      difficulties: ["Easy", "Medium", "Hard"],
      languages: ["en", "hi", "pa"],
      maxBatchSize: 50,
    });
  } catch (error) {
    console.error("DSF CP017 Question Studio capabilities failed", error);
    res.status(500).json({ error: "Unable to load generation capabilities" });
  }
});

/**
 * Claim only normal Question Studio requests that select DSF-001. The existing
 * /reasoning/data-sufficiency/* endpoints remain the historical CP002-CP010
 * production workflow and are intentionally not rewritten here.
 */
router.post("/runs", requireAdminPermission("content.generation.run"), async (req, res, next) => {
  if (!isDsfCp017NormalQuestionStudioRequest(req.body ?? {})) {
    next();
    return;
  }

  const count = asPositiveInteger(req.body?.count, 5, 50);
  const seed = asString(req.body?.seed) || undefined;
  const packageId = asString(req.body?.packageId) || "DSF-001";
  const canonicalProblemId = asString(req.body?.canonicalProblemId) || undefined;
  const cpId = asString(req.body?.cpId) || undefined;
  const patternId = asString(req.body?.patternId) || undefined;
  const difficulty = asString(req.body?.difficulty) || undefined;
  const language = asString(req.body?.language) || "en";
  const exam = asString(req.body?.exam) || "SSC CGL";
  const subject = asString(req.body?.subject) || "Reasoning";
  const topic = asString(req.body?.topic) || "Data Sufficiency";
  const subtopic = asString(req.body?.subtopic) || "Data Sufficiency";
  const runId = randomUUID();
  const code = publicRunCode();
  const timestamp = new Date().toISOString();
  const requestSnapshot = {
    exam,
    subject,
    difficulty: difficulty || "Mixed",
    count,
    packageId,
    patternId,
    topic,
    subtopic,
    canonicalProblemId,
    cpId,
    language,
    seed,
    runtimeMode: DSF_CP017_RUNTIME_MODE,
    integrationAuthority: DSF_CP017_NORMAL_QUESTION_STUDIO_AUTHORITY,
    requestedByFirebaseUid: req.user?.id,
  };

  try {
    const result = generateDsfCp017NormalQuestionStudioBatch({
      packageId,
      patternId,
      topic,
      subtopic,
      canonicalProblemId,
      cpId,
      difficulty,
      language,
      seed,
      count,
      runtimeMode: DSF_CP017_RUNTIME_MODE,
    });
    const generatedQuestions = Array.isArray(result.questions) ? result.questions : [];
    if (!generatedQuestions.length) {
      res.status(422).json({ error: "The Data Sufficiency generation engine returned no questions" });
      return;
    }

    await sqlClient.begin(async (tx) => {
      await tx`INSERT INTO content.generation_runs (
        id, public_code, status, attempt_number, prompt_snapshot, request_snapshot, provider, model,
        prompt_tokens, completion_tokens, estimated_cost_paise, actual_cost_paise, started_at, completed_at, created_at, updated_at
      ) VALUES (
        ${runId}::uuid, ${code}, 'review'::generation_run_status, 1,
        ${JSON.stringify(requestSnapshot)}, ${JSON.stringify(requestSnapshot)},
        'examtree', 'reasoning-v1-dsf-cp017-normal-review-v1', 0, 0, 0, 0,
        ${timestamp}, ${timestamp}, ${timestamp}, ${timestamp}
      )`;

      for (let index = 0; index < generatedQuestions.length; index += 1) {
        const question = generatedQuestions[index] as Record<string, unknown>;
        if (
          question.questionStudioDiscoverable !== true
          || question.persistenceAllowed !== true
          || question.reviewOnly !== true
          || question.questionBankWritable !== false
          || question.testEligible !== false
          || question.mockTestEligible !== false
          || question.publiclyPublishable !== false
          || question.automaticStudentPublication !== false
        ) {
          throw new Error("DSF CP017 attempted to persist a question outside the normal review-only lifecycle contract.");
        }
        const itemId = randomUUID();
        const versionId = randomUUID();
        const payload = {
          ...question,
          generationContext: {
            ...result.generationContext,
            ...(question.generationContext as Record<string, unknown> | undefined),
          },
          validationResult: "pending",
        };
        await tx`INSERT INTO content.generation_run_items (
          id, generation_run_id, item_number, status, current_version_number, created_at, updated_at
        ) VALUES (
          ${itemId}::uuid, ${runId}::uuid, ${index + 1}, 'unreviewed'::generation_item_status, 1,
          ${timestamp}, ${timestamp}
        )`;
        await tx`INSERT INTO content.generation_item_versions (
          id, generation_item_id, version_number, payload, provider_item_id, created_at
        ) VALUES (
          ${versionId}::uuid, ${itemId}::uuid, 1, ${JSON.stringify(payload)},
          ${asString(question.questionId) || null}, ${timestamp}
        )`;
      }

      await tx`INSERT INTO platform.audit_events (
        id, actor_type, actor_user_id, action_key, entity_type, entity_id, reason, summary, metadata
      ) VALUES (
        ${randomUUID()}::uuid, 'user'::audit_actor_type, ${req.adminSession?.user.id ?? null}::uuid,
        'question_studio.data_sufficiency_normal_run.created', 'generation_run', ${runId}::uuid,
        'Admin generated Data Sufficiency questions through the normal Question Studio review workflow',
        ${`Generated ${generatedQuestions.length} Data Sufficiency review items in ${code}`},
        ${JSON.stringify({ firebaseUid: req.user?.id, requestSnapshot, lifecycle: result.generationContext })}
      )`;
      await tx`INSERT INTO platform.outbox_events (
        id, aggregate_type, aggregate_id, event_type, payload
      ) VALUES (
        ${randomUUID()}::uuid, 'generation_run', ${runId}::uuid,
        'question_studio.data_sufficiency_normal_run.created',
        ${JSON.stringify({
          runId,
          publicCode: code,
          itemCount: generatedQuestions.length,
          chapter: "Data Sufficiency",
          packageId: "DSF-001",
          integrationAuthority: DSF_CP017_NORMAL_QUESTION_STUDIO_AUTHORITY,
        })}
      )`;
    });

    res.status(201).json({
      id: runId,
      publicCode: code,
      status: "review",
      itemCount: generatedQuestions.length,
      generationSystem: "reasoning-v1",
      chapter: "Data Sufficiency",
      packageId: "DSF-001",
      runtimeMode: DSF_CP017_RUNTIME_MODE,
      integrationAuthority: DSF_CP017_NORMAL_QUESTION_STUDIO_AUTHORITY,
      reviewOnly: true,
      questionBankWritable: false,
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
    });
  } catch (error) {
    console.error("DSF CP017 normal Question Studio generation failed", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Data Sufficiency generation failed" });
  }
});

export default router;
