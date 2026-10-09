import { randomUUID } from "node:crypto";
import { Router } from "express";

import { sqlClient } from "../lib/db";
import { requireAdminPermission } from "../lib/admin-rbac";
import { authenticate } from "../middlewares/auth";
import { runRemoteSharedStudio } from "../question-studio/remote-shared-studio-client";
import type { QuestionStudioGenerationRequest } from "../question-studio/engine-types";

const router = Router();
const allowedCps = new Set(["NUM-CP-001", "NUM-CP-003", "NUM-CP-004"]);
const languages = new Set(["en", "hi", "pa"]);
const difficulties = new Set(["Easy", "Medium", "Hard", "Mixed"]);
let activeRun = false;
const lifecycle = {
  lifecycleStage: "REVIEW_ONLY",
  reviewSurfaceRequired: true,
  manualApprovalRequired: true,
  questionBankStatus: "NOT_STORED",
  questionBankWritable: false,
  testEligibility: "INELIGIBLE",
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
  automaticStudentPublication: false,
  productionReleaseAuthorized: false,
} as const;

function asString(input: unknown): string {
  return typeof input === "string" ? input.trim() : "";
}
function publicCode(): string {
  return "GEN-" + new Date().toISOString().slice(0,10).replaceAll("-","") + "-" + randomUUID().replaceAll("-","").slice(0,8).toUpperCase();
}

// This endpoint is explicitly gated by QUESTION_STUDIO_SHARED_WORKER_URL at
// app.ts. No remote URL means the original NUM-001 implementation is unchanged.
// It runs only after admin authentication and content.generation.run RBAC.
router.post("/runs", authenticate, requireAdminPermission("content.generation.run"), async (req, res) => {
  if (activeRun) {
    res.status(429).json({ error: "Number System generation is in progress. Retry after it finishes.", code: "NUM001_GENERATOR_BUSY" });
    return;
  }
  const count = Number(req.body?.count ?? 5);
  const rawCps = req.body?.cpIds;
  const cpIds: string[] = Array.isArray(rawCps) ? [...new Set(rawCps.map(asString).filter(Boolean))] : [];
  const difficulty = asString(req.body?.difficulty) || "Mixed";
  const language = asString(req.body?.language) || "en";
  const engine = asString(req.body?.engineId) || "quant-v4";
  const runtimeMode = asString(req.body?.runtimeMode) || "QUESTION_STUDIO_ACTIVE";
  if (!Number.isInteger(count) || count < 1 || count > 50
      || !cpIds.every((cp) => allowedCps.has(cp)) || cpIds.length > count
      || !languages.has(language) || !difficulties.has(difficulty)
      || engine !== "quant-v4" || runtimeMode !== "QUESTION_STUDIO_ACTIVE") {
    res.status(400).json({ error: "Unsupported NUM-001 count, CPs, difficulty, language, or runtime mode", code: "NUM001_INVALID_SELECTION" });
    return;
  }
  if (language !== "en" && cpIds.some((cp) => cp !== "NUM-CP-001")) {
    res.status(400).json({ error: "Only NUM-CP-001 supports Hindi/Punjabi review", code: "NUM001_LANGUAGE_RESTRICTED" });
    return;
  }
  const exam = asString(req.body?.exam) || "SSC CGL Tier 1";
  const request: QuestionStudioGenerationRequest = {
    engineId: "quant-v4",
    exam,
    subject: "Quantitative Aptitude",
    topic: "Arithmetic",
    subtopic: "Number System",
    packageId: "NUM-001",
    count,
    language: language as "en" | "hi" | "pa",
    difficulty,
    runtimeMode,
    seed: asString(req.body?.seed) || undefined,
    canonicalProblemId: cpIds.length === 1 ? cpIds[0] : undefined,
  };
  activeRun = true;
  const started = Date.now();
  req.log.info({ packageId: "NUM-001", count, cpCount: cpIds.length, backend: "shared-cloudrun", rssBytes: process.memoryUsage().rss }, "NUM-001 remote generation started");
  try {
    const batch = await runRemoteSharedStudio({
      request,
      count,
      selectedCpIds: cpIds,
      examProfileId: req.body?.examProfileId,
      difficultyPreset: req.body?.difficultyPreset,
      difficultyDistribution: req.body?.difficultyDistribution,
    });
    if (batch.questions.length !== count) {
      throw Object.assign(new Error("NUM-001 returned an incomplete question batch"), { statusCode: 422, code: "NUM001_COUNT_MISMATCH" });
    }
    const plan = batch.plan;
    const runId = randomUUID();
    const code = publicCode();
    const timestamp = new Date().toISOString();
    const requestSnapshot = {
      ...request,
      seed: plan.seed,
      difficulty: plan.requestedDifficulty,
      cpIds,
      engineId: "quant-v4",
      packageLifecycle: lifecycle,
      difficultyPreset: plan.difficultyPreset,
      difficultyDistribution: plan.difficultyDistribution,
      difficultyCounts: plan.difficultyCounts,
      legacyExamProfile: plan.legacyExamProfile,
      cpCounts: plan.cpCounts,
      ...plan.trace,
      requestedByFirebaseUid: req.user?.id,
    };
    // Review records, versions, provenance and events are committed together
    // ONLY on Render. The isolated Cloud Run service never gets DB credentials.
    await sqlClient.begin(async (tx) => {
      await tx`
        INSERT INTO content.generation_runs (
          id, public_code, status, attempt_number, prompt_snapshot, request_snapshot,
          provider, model, prompt_tokens, completion_tokens, estimated_cost_paise,
          actual_cost_paise, started_at, completed_at, created_at, updated_at
        ) VALUES (
          ${runId}::uuid, ${code}, 'review'::generation_run_status, 1,
          ${JSON.stringify(requestSnapshot)}, ${JSON.stringify(requestSnapshot)},
          'examtree', 'quant-v4-exam-profile', 0, 0, 0, 0,
          ${timestamp}, ${timestamp}, ${timestamp}, ${timestamp}
        )
      `;
      for (let index = 0; index < batch.questions.length; index++) {
        const itemId = randomUUID();
        const versionId = randomUUID();
        const question = batch.questions[index]!;
        const payload = { ...question, ...lifecycle, generationContexts: batch.generationContexts, validationResult: "pending" };
        await tx`
          INSERT INTO content.generation_run_items (
            id, generation_run_id, item_number, status, current_version_number, created_at, updated_at
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
            ${JSON.stringify(payload)}, ${asString(question.questionId) || null}, ${timestamp}
          )
        `;
      }
      await tx`
        INSERT INTO platform.audit_events (
          id, actor_type, actor_user_id, action_key, entity_type, entity_id, reason, summary, metadata
        ) VALUES (
          ${randomUUID()}::uuid, 'user'::audit_actor_type, ${req.adminSession?.user.id ?? null}::uuid,
          'question_studio.generation_run.created', 'generation_run', ${runId}::uuid,
          'Admin generated a review-only NUM-001 Question Studio batch',
          ${"Generated " + count + " Number System questions in " + code},
          ${JSON.stringify({ firebaseUid: req.user?.id, engineId: "quant-v4", requestSnapshot })}
        )
      `;
      await tx`
        INSERT INTO platform.outbox_events (
          id, aggregate_type, aggregate_id, event_type, payload
        ) VALUES (
          ${randomUUID()}::uuid, 'generation_run', ${runId}::uuid,
          'question_studio.generation_run.created',
          ${JSON.stringify({ runId, publicCode: code, itemCount: count, engineId: "quant-v4" })}
        )
      `;
    });
    req.log.info({ packageId: "NUM-001", count, runId, elapsedMs: Date.now()-started }, "NUM-001 remote generation saved");
    res.status(201).json({
      id: runId, publicCode: code, status: "review", itemCount: count,
      generationSystem: "quant-v4", engineId: "quant-v4",
      difficulty: plan.requestedDifficulty, difficultyPreset: plan.difficultyPreset,
      difficultyDistribution: plan.difficultyDistribution,
      difficultyCounts: plan.difficultyCounts, cpCounts: plan.cpCounts, examProfile: plan.trace,
    });
  } catch (caught) {
    const failure = caught as { message?: string; code?: string; statusCode?: number };
    const s = Number(failure.statusCode);
    const status = Number.isInteger(s) && s >= 400 && s < 600 ? s : 500;
    req.log.error({ packageId: "NUM-001", status, code: failure.code, elapsedMs: Date.now()-started }, "NUM-001 remote generation failed");
    res.status(status).json({
      error: failure.message || "NUM-001 generation failed",
      code: failure.code || "NUM001_REMOTE_GENERATION_FAILED",
    });
  } finally {
    activeRun = false;
  }
});

export default router;
