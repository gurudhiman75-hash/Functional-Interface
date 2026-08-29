import { randomUUID } from "node:crypto";
import { Router } from "express";

import { sqlClient } from "../lib/db";
import { requireAdminPermission } from "../lib/admin-rbac";
import { authenticate } from "../middlewares/auth";
import {
  generateQuestion,
  isBtdCp006QuestionStudioRequest,
  listQuestionStudioPackages,
} from "../question-studio/shared-generation-engine-btd";

const router = Router();

function asString(value: unknown) { return typeof value === "string" ? value.trim() : ""; }
function positiveInt(value: unknown, fallback: number, max: number) {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
}
function publicRunCode() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `GEN-${date}-${randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase()}`;
}

router.use(authenticate);

router.get("/capabilities", requireAdminPermission("content.generation.read"), async (_req, res) => {
  try {
    const packages = listQuestionStudioPackages().map((pkg: any) => ({
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
      supportedLanguages: Array.isArray(pkg.supportedLanguages) ? pkg.supportedLanguages.map(String) : ["en"],
      supportedDifficulties: Array.isArray(pkg.supportedDifficulties) ? pkg.supportedDifficulties.map(String) : [],
      runtimeMode: asString(pkg.runtimeMode) || undefined,
      reviewStatus: asString(pkg.reviewStatus) || undefined,
      questionStudioDiscoverable: typeof pkg.questionStudioDiscoverable === "boolean" ? pkg.questionStudioDiscoverable : undefined,
      questionStudioGenerationEnabled: typeof pkg.questionStudioGenerationEnabled === "boolean" ? pkg.questionStudioGenerationEnabled : undefined,
      questionBankStatus: asString(pkg.questionBankStatus) || undefined,
      questionBankWritable: typeof pkg.questionBankWritable === "boolean" ? pkg.questionBankWritable : undefined,
      testEligibility: asString(pkg.testEligibility) || undefined,
      testEligible: typeof pkg.testEligible === "boolean" ? pkg.testEligible : undefined,
      mockTestEligible: typeof pkg.mockTestEligible === "boolean" ? pkg.mockTestEligible : undefined,
      publiclyPublishable: typeof pkg.publiclyPublishable === "boolean" ? pkg.publiclyPublishable : undefined,
      automaticStudentPublication: typeof pkg.automaticStudentPublication === "boolean" ? pkg.automaticStudentPublication : undefined,
      freezeVersion: asString(pkg.freezeVersion) || undefined,
      frozenChapterFingerprint: asString(pkg.frozenChapterFingerprint) || undefined,
    }));
    res.json({ generationSystem: "question-studio", packages, difficulties: ["Easy", "Medium", "Hard"], languages: ["en", "hi", "pa"], maxBatchSize: 50 });
  } catch (error) {
    console.error("BTD Question Studio capabilities failed", error);
    res.status(500).json({ error: "Unable to load generation capabilities" });
  }
});

router.post("/runs", requireAdminPermission("content.generation.run"), async (req, res, next) => {
  if (!isBtdCp006QuestionStudioRequest(req.body ?? {})) { next(); return; }

  const count = positiveInt(req.body?.count, 5, 50);
  const packageId = asString(req.body?.packageId) || "BTD-001";
  const canonicalProblemId = asString(req.body?.canonicalProblemId) || asString(req.body?.cpId) || undefined;
  const questionLanguageId = asString(req.body?.questionLanguageId) || undefined;
  const difficulty = asString(req.body?.difficulty) || undefined;
  const language = asString(req.body?.language) || "en";
  const seed = asString(req.body?.seed) || undefined;
  const runId = randomUUID();
  const code = publicRunCode();
  const timestamp = new Date().toISOString();
  const requestSnapshot = {
    exam: asString(req.body?.exam) || "SSC CGL",
    subject: asString(req.body?.subject) || "Quantitative Aptitude",
    topic: asString(req.body?.topic) || "Arithmetic",
    subtopic: asString(req.body?.subtopic) || "Banker's Discount & True Discount",
    packageId,
    patternId: asString(req.body?.patternId) || packageId,
    canonicalProblemId,
    questionLanguageId,
    difficulty: difficulty ?? "Mixed",
    language,
    seed,
    count,
    requestedByFirebaseUid: req.user?.id,
  };

  try {
    const result: any = await generateQuestion({ ...requestSnapshot });
    const generatedQuestions = Array.isArray(result.questions) ? result.questions : [];
    if (!generatedQuestions.length) { res.status(422).json({ error: "The BTD generation engine returned no questions" }); return; }

    await sqlClient.begin(async (tx) => {
      await tx`INSERT INTO content.generation_runs (
        id, public_code, status, attempt_number, prompt_snapshot, request_snapshot, provider, model,
        prompt_tokens, completion_tokens, estimated_cost_paise, actual_cost_paise, started_at, completed_at, created_at, updated_at
      ) VALUES (
        ${runId}::uuid, ${code}, 'review'::generation_run_status, 1, ${JSON.stringify(requestSnapshot)}, ${JSON.stringify(requestSnapshot)},
        'examtree', 'quant-v4-btd-review', 0, 0, 0, 0, ${timestamp}, ${timestamp}, ${timestamp}, ${timestamp}
      )`;

      for (let index = 0; index < generatedQuestions.length; index += 1) {
        const question = generatedQuestions[index] as Record<string, unknown>;
        if (
          question.questionStudioDiscoverable !== true
          || question.questionStudioGenerationEnabled !== true
          || question.questionBankWritable !== false
          || question.testEligible !== false
          || question.mockTestEligible !== false
          || question.publiclyPublishable !== false
          || question.automaticStudentPublication !== false
        ) {
          throw new Error("BTD Question Studio attempted to persist a package outside the review-only lifecycle boundary.");
        }
        const itemId = randomUUID();
        const versionId = randomUUID();
        const payload = { ...question, generationContext: result.generationContext, validationResult: "pending" };
        await tx`INSERT INTO content.generation_run_items (
          id, generation_run_id, item_number, status, current_version_number, created_at, updated_at
        ) VALUES (${itemId}::uuid, ${runId}::uuid, ${index + 1}, 'unreviewed'::generation_item_status, 1, ${timestamp}, ${timestamp})`;
        await tx`INSERT INTO content.generation_item_versions (
          id, generation_item_id, version_number, payload, provider_item_id, created_at
        ) VALUES (${versionId}::uuid, ${itemId}::uuid, 1, ${JSON.stringify(payload)}, ${asString(question.questionId) || null}, ${timestamp})`;
      }

      await tx`INSERT INTO platform.audit_events (
        id, actor_type, actor_user_id, action_key, entity_type, entity_id, reason, summary, metadata
      ) VALUES (
        ${randomUUID()}::uuid, 'user'::audit_actor_type, ${req.adminSession?.user.id ?? null}::uuid,
        'question_studio.generation_run.created', 'generation_run', ${runId}::uuid,
        'Admin generated a review-only Question Studio batch', ${`Generated ${generatedQuestions.length} BTD-001 review questions in ${code}`},
        ${JSON.stringify({ firebaseUid: req.user?.id, requestSnapshot, lifecycle: "QUESTION_STUDIO_REVIEW_ONLY" })}
      )`;
      await tx`INSERT INTO platform.outbox_events (
        id, aggregate_type, aggregate_id, event_type, payload
      ) VALUES (
        ${randomUUID()}::uuid, 'generation_run', ${runId}::uuid, 'question_studio.generation_run.created',
        ${JSON.stringify({ runId, publicCode: code, itemCount: generatedQuestions.length, chapter: "BTD-001", lifecycle: "QUESTION_STUDIO_REVIEW_ONLY" })}
      )`;
    });

    res.status(201).json({ id: runId, publicCode: code, status: "review", itemCount: generatedQuestions.length, generationSystem: "quant-v4", chapter: "BTD-001", questionStudioReviewOnly: true });
  } catch (error: any) {
    console.error("BTD Question Studio generation failed", error);
    const status = Number(error?.statusCode) || 500;
    res.status(status).json({ error: error instanceof Error ? error.message : "Question generation failed" });
  }
});

export default router;
