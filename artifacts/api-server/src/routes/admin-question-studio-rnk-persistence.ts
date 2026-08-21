import { randomUUID } from "node:crypto";
import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";
import {
  generateQuestion as generateSharedQuestionStudioQuestions,
  isRnk001QuestionStudioRequest,
  listQuestionStudioPackages,
  type SharedQuestionStudioGenerationRequest,
} from "../question-studio/shared-generation-engine";

const router = Router();
const LANGUAGES = new Set(["en", "hi", "pa"]);

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function positiveInt(value: unknown, fallback: number, max: number): number {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
}

function runCode(): string {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const suffix = randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase();
  return `GEN-${date}-${suffix}`;
}

function normalizeLanguage(value: unknown): "en" | "hi" | "pa" {
  const candidate = text(value).toLowerCase();
  return LANGUAGES.has(candidate) ? candidate as "en" | "hi" | "pa" : "en";
}

function capabilityPayload() {
  return listQuestionStudioPackages().map((pkg: any) => ({
    packageId: String(pkg.packageId),
    topic: String(pkg.topic),
    subtopic: String(pkg.subtopic),
    subject: pkg.subject == null ? undefined : String(pkg.subject),
    label: String(pkg.label),
    enabled: Boolean(pkg.enabled),
    cpIds: Array.isArray(pkg.cpIds) ? pkg.cpIds.map(String) : [],
    canonicalProblems: Array.isArray(pkg.canonicalProblems)
      ? pkg.canonicalProblems.map((entry: any) => ({ id: String(entry.id), label: String(entry.label) }))
      : undefined,
    supportedDifficulties: Array.isArray(pkg.supportedDifficulties)
      ? pkg.supportedDifficulties.map(String)
      : undefined,
    supportedLanguages: Array.isArray(pkg.supportedLanguages)
      ? pkg.supportedLanguages.map(String)
      : ["en"],
    supportedExamProfiles: Array.isArray(pkg.supportedExamProfiles)
      ? pkg.supportedExamProfiles.map(String)
      : undefined,
    runtimeMode: text(pkg.runtimeMode) || undefined,
    supportedRuntimeModes: Array.isArray(pkg.supportedRuntimeModes)
      ? pkg.supportedRuntimeModes.map(String)
      : [],
    reviewOnly: typeof pkg.reviewOnly === "boolean" ? pkg.reviewOnly : undefined,
    releaseFreezeStatus: text(pkg.releaseFreezeStatus) || undefined,
    permanentQlCount: Number.isInteger(pkg.permanentQlCount) ? Number(pkg.permanentQlCount) : undefined,
    permanentQlRange: text(pkg.permanentQlRange) || undefined,
    questionBankStatus: text(pkg.questionBankStatus) || undefined,
    questionBankWritable:
      typeof pkg.questionBankWritable === "boolean" ? pkg.questionBankWritable : undefined,
    testEligibility: text(pkg.testEligibility) || undefined,
    publiclyPublishable:
      typeof pkg.publiclyPublishable === "boolean" ? pkg.publiclyPublishable : undefined,
  }));
}

router.use(authenticate);

/**
 * Expose the shared package registry at the existing capabilities endpoint.
 * The response keeps the legacy generationSystem value for admin compatibility;
 * RNK-001 itself advertises reasoning-v1 runtime metadata in its package record.
 */
router.get("/capabilities", requireAdminPermission("content.generation.read"), (_req, res) => {
  res.json({
    generationSystem: "quant-v4",
    sharedGenerationEnabled: true,
    packages: capabilityPayload(),
    difficulties: ["Easy", "Medium", "Hard"],
    languages: ["en", "hi", "pa"],
    maxBatchSize: 50,
  });
});

/**
 * Persist RNK-001 review generations into the standard Question Studio
 * generation-run/item/version tables. Non-RNK requests fall through to the
 * existing routes unchanged.
 *
 * This is deliberately NOT a Question Bank activation. Persisted payloads keep
 * questionBankStatus=NOT_STORED and questionBankWritable=false, so the mounted
 * bulk-review approval policy records editorial approval without conversion.
 */
router.post("/runs", requireAdminPermission("content.generation.run"), async (req, res, next) => {
  const packageId = text(req.body?.packageId) || undefined;
  const patternId = text(req.body?.patternId) || undefined;
  const topic = text(req.body?.topic) || undefined;
  const subtopic = text(req.body?.subtopic) || undefined;
  const canonicalProblemId = text(req.body?.canonicalProblemId) || undefined;
  const cpId = text(req.body?.cpId) || undefined;

  const generationRequest: SharedQuestionStudioGenerationRequest = {
    packageId,
    patternId,
    topic,
    subtopic,
    difficulty: text(req.body?.difficulty) || undefined,
    language: normalizeLanguage(req.body?.language),
    seed: text(req.body?.seed) || undefined,
    count: positiveInt(req.body?.count, 5, 50),
    runtimeMode: text(req.body?.runtimeMode) || undefined,
    canonicalProblemId,
    cpId,
    questionLanguageId: text(req.body?.questionLanguageId) || undefined,
    examProfileId: text(req.body?.examProfileId) || "CHAPTER_COVERAGE",
  };

  if (!isRnk001QuestionStudioRequest(generationRequest)) {
    next();
    return;
  }

  const actorUserId = req.adminSession?.user.id;
  if (!actorUserId) {
    res.status(403).json({ error: "Administrator session required" });
    return;
  }

  const runId = randomUUID();
  const publicCode = runCode();
  const timestamp = new Date().toISOString();

  try {
    const result = await generateSharedQuestionStudioQuestions(generationRequest);
    const questions = Array.isArray(result.questions)
      ? result.questions.map((question) => question as Record<string, unknown>)
      : [];

    if (questions.length === 0) {
      res.status(422).json({ error: "RNK-001 generation returned no questions" });
      return;
    }

    const generationContext = result.generationContext as Record<string, unknown>;
    if (
      generationContext.questionBankStatus !== "NOT_STORED"
      || generationContext.questionBankWritable !== false
      || generationContext.testEligible !== false
      || generationContext.mockTestEligible !== false
      || generationContext.publiclyPublishable !== false
      || generationContext.automaticStudentPublication !== false
    ) {
      res.status(409).json({
        error: "RNK-001 persistence lifecycle guard rejected an unlocked generation payload",
        code: "RNK_PERSISTENCE_LIFECYCLE_GUARD_FAILED",
      });
      return;
    }

    const requestSnapshot = {
      exam: text(req.body?.exam) || undefined,
      subject: text(req.body?.subject) || "Reasoning Ability",
      ...generationRequest,
      generationSystem: "reasoning-v1",
      lifecycleStatus: "REVIEW_ONLY_PERSISTED",
      requestedByFirebaseUid: req.user?.id,
    };

    await sqlClient.begin(async (tx) => {
      await tx`
        INSERT INTO content.generation_runs (
          id, public_code, status, attempt_number, prompt_snapshot, request_snapshot,
          provider, model, prompt_tokens, completion_tokens, estimated_cost_paise,
          actual_cost_paise, started_at, completed_at, created_at, updated_at
        ) VALUES (
          ${runId}::uuid, ${publicCode}, 'review'::generation_run_status, 1,
          ${JSON.stringify(requestSnapshot)}, ${JSON.stringify(requestSnapshot)},
          'examtree', 'reasoning-v1-rnk-review', 0, 0, 0, 0,
          ${timestamp}, ${timestamp}, ${timestamp}, ${timestamp}
        )
      `;

      for (let index = 0; index < questions.length; index += 1) {
        const question = questions[index]!;
        const itemId = randomUUID();
        const versionId = randomUUID();
        const payload = {
          ...question,
          generationContext: {
            ...generationContext,
            lifecycleStatus: "REVIEW_ONLY_PERSISTED",
            persistenceAuthority: "RNK_001_QUESTION_STUDIO_PERSISTENCE_V1",
          },
          validationResult: "pending",
        };

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
            ${versionId}::uuid, ${itemId}::uuid, 1,
            ${JSON.stringify(payload)}, ${text(question.questionId) || null}, ${timestamp}
          )
        `;
      }

      await tx`
        INSERT INTO platform.audit_events (
          id, actor_type, actor_user_id, action_key, entity_type, entity_id,
          reason, summary, metadata
        ) VALUES (
          ${randomUUID()}::uuid, 'user'::audit_actor_type, ${actorUserId}::uuid,
          'question_studio.rnk_review_run.persisted', 'generation_run', ${runId}::uuid,
          'Admin generated a persisted RNK-001 review batch',
          ${`Persisted ${questions.length} RNK-001 review questions in ${publicCode}`},
          ${JSON.stringify({
            packageId: "RNK-001",
            language: generationRequest.language,
            examProfileId: generationRequest.examProfileId,
            itemCount: questions.length,
            questionBankWritable: false,
            testEligible: false,
            mockTestEligible: false,
            publiclyPublishable: false,
          })}
        )
      `;

      await tx`
        INSERT INTO platform.outbox_events (
          id, aggregate_type, aggregate_id, event_type, payload
        ) VALUES (
          ${randomUUID()}::uuid, 'generation_run', ${runId}::uuid,
          'question_studio.rnk_review_run.persisted',
          ${JSON.stringify({
            runId,
            publicCode,
            packageId: "RNK-001",
            itemCount: questions.length,
            lifecycleStatus: "REVIEW_ONLY_PERSISTED",
          })}
        )
      `;
    });

    res.status(201).json({
      id: runId,
      publicCode,
      status: "review",
      itemCount: questions.length,
      generationSystem: "reasoning-v1",
      lifecycleStatus: "REVIEW_ONLY_PERSISTED",
      questionBankStatus: "NOT_STORED",
      questionBankWritable: false,
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
    });
  } catch (error) {
    console.error("RNK-001 Question Studio persistence failed", error);
    const message = error instanceof Error ? error.message : "Unable to persist RNK-001 review generation";
    res.status(500).json({ error: message, code: "RNK_REVIEW_PERSISTENCE_FAILED" });
  }
});

export default router;
