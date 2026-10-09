import { randomUUID } from "node:crypto";
import { Worker } from "node:worker_threads";
import { Router } from "express";

import { sqlClient } from "../lib/db";
import { requireAdminPermission } from "../lib/admin-rbac";
import { authenticate } from "../middlewares/auth";
import type { QuestionStudioGenerationRequest } from "../question-studio/engine-types";
import { remoteTrg002Configured, runRemoteTrg002 } from "../question-studio/remote-trg002-client";

const router = Router();
const allowedCpIds = new Set(["TRG-CP-007", "TRG-CP-008", "TRG-CP-009", "TRG-CP-010"]);
const allowedDifficulties = new Set(["Easy", "Medium", "Hard", "Mixed"]);
const allowedLanguages = new Set(["en", "hi", "pa"]);
const workerFile = new URL("./question-studio-trg002-worker.mjs", import.meta.url);
const workerTimeoutMs = 120_000;
let workerBusy = false;

type Failure = { message: string; code?: string; statusCode?: number; details?: unknown };
type GenerationBatch = {
  questions: Array<Record<string, unknown>>;
  generationContexts: Array<{ cpId?: string; difficulty: string; context: Record<string, unknown> }>;
  plan: {
    seed: string;
    profile: { id: string; label: string };
    trace: Record<string, unknown>;
    requestedDifficulty: string;
    difficultyPreset: string;
    difficultyDistribution: unknown;
    difficultyCounts: unknown;
    cpCounts: Record<string, number>;
    legacyExamProfile?: string;
  };
};

function generateOffThread(data: Record<string, unknown>): Promise<GenerationBatch> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(workerFile, { workerData: data });
    let finished = false;
    const finish = (error?: Error, batch?: GenerationBatch) => {
      if (finished) return;
      finished = true;
      clearTimeout(deadline);
      if (error) reject(error);
      else if (batch) resolve(batch);
      else reject(new Error("TRG-002 worker finished without a generation batch"));
    };
    const deadline = setTimeout(() => {
      const error = Object.assign(new Error("TRG-002 generation exceeded the 120-second safety limit. Reduce the question count or increase API compute capacity."), {
        statusCode: 503, code: "TRG002_WORKER_TIMEOUT",
      });
      void worker.terminate();
      finish(error);
    }, workerTimeoutMs);
    worker.once("message", (message: { ok: boolean; batch?: GenerationBatch; error?: Failure }) => {
      if (message.ok && message.batch) {
        finish(undefined, message.batch);
      } else {
        const failure = message.error;
        finish(Object.assign(new Error(failure?.message ?? "TRG-002 worker failed"), {
          statusCode: failure?.statusCode ?? 422,
          code: failure?.code ?? "TRG002_GENERATION_FAILED",
          details: failure?.details,
        }));
      }
      void worker.terminate();
    });
    worker.once("error", (error) => finish(error));
    worker.once("exit", (code) => {
      if (code !== 0) finish(Object.assign(new Error("TRG-002 generator worker exited unexpectedly (" + code + ")"), {
        statusCode: 503, code: "TRG002_WORKER_EXIT",
      }));
    });
  });
}

function nonEmpty(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function publicRunCode(): string {
  return "GEN-" + new Date().toISOString().slice(0, 10).replaceAll("-", "") + "-"
    + randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase();
}

const packageLifecycle = {
  lifecycleId: "QUESTION-STUDIO-STANDARD-BANK-ONLY-V1",
  lifecycleStage: "BANK_ONLY",
  reviewSurfaceRequired: true,
  manualApprovalRequired: true,
  questionBankStatus: "WRITABLE",
  questionBankWritable: true,
  questionBankAcceptanceMode: "FULL_RELEASE",
  questionBankAcceptanceAuthority: "TRG-002-V4-HUMAN-APPROVED-INTERNAL",
  testEligibility: "ELIGIBLE",
  testEligible: true,
  mockTestEligible: true,
  publiclyPublishable: false,
  automaticStudentPublication: false,
  productionReleaseAuthorized: false,
} as const;

// Only intercept the TRG-002 request. All other packages and read/review
// operations continue through the existing canonical Question Studio registry.
router.post(
  "/runs",
  (req, _res, next) => {
    if (req.body?.packageId !== "TRG-002") { next(); return; }
    next();
  },
  authenticate,
  requireAdminPermission("content.generation.run"),
  async (req, res, next) => {
    // This router is mounted before the large legacy API. Do not fall through
    // to a second generation route for a TRG-002 request.
    if (req.body?.packageId !== "TRG-002") { next(); return; }

    if (workerBusy) {
      res.status(429).json({
        error: "A TRG-002 batch is already generating. Wait for it to finish before starting another.",
        code: "TRG002_GENERATOR_BUSY",
      });
      return;
    }

    const rawCount = req.body?.count ?? 5;
    const count = Number(rawCount);
    const rawCpIds = req.body?.cpIds;
    const cpIds = Array.isArray(rawCpIds)
      ? [...new Set(rawCpIds.map(nonEmpty).filter(Boolean))]
      : [];
    const invalidCpIds = cpIds.filter((cpId) => !allowedCpIds.has(cpId));
    const language = nonEmpty(req.body?.language) || "en";
    const difficulty = nonEmpty(req.body?.difficulty) || "Medium";
    const engine = nonEmpty(req.body?.engineId) || "quant-v4";
    const requestedMode = nonEmpty(req.body?.runtimeMode);

    if (!Number.isInteger(count) || count < 1 || count > 50) {
      res.status(400).json({ error: "Question count must be between 1 and 50", code: "INVALID_GENERATION_COUNT" });
      return;
    }
    if (invalidCpIds.length > 0 || cpIds.length > count || !allowedLanguages.has(language)
        || !allowedDifficulties.has(difficulty) || engine !== "quant-v4") {
      res.status(400).json({ error: "Invalid TRG-002 CP, difficulty, language or engine selection", code: "INVALID_TRG002_SELECTION" });
      return;
    }
    if (requestedMode && requestedMode !== "RELEASED") {
      res.status(400).json({ error: "Unsupported TRG-002 runtime mode", code: "INVALID_TRG002_RUNTIME_MODE" });
      return;
    }

    const seed = nonEmpty(req.body?.seed) || undefined;
    const exam = nonEmpty(req.body?.exam) || "SSC CGL Tier 1";
    const generationRequest: QuestionStudioGenerationRequest = {
      engineId: "quant-v4",
      exam,
      subject: "Quantitative Aptitude",
      difficulty,
      count,
      packageId: "TRG-002",
      topic: "Advanced Mathematics",
      subtopic: "Trigonometry — Heights & Distances",
      language: language as "en" | "hi" | "pa",
      seed,
      runtimeMode: requestedMode || "RELEASED",
      canonicalProblemId: cpIds.length === 1 ? cpIds[0] : undefined,
    };

    workerBusy = true;
    const startedAt = Date.now();
    const computeBackend = remoteTrg002Configured() ? "remote" : "local-thread";
    const computeInput = {
      request: generationRequest,
      count,
      selectedCpIds: cpIds,
      examProfileId: req.body?.examProfileId,
      difficultyPreset: req.body?.difficultyPreset,
      difficultyDistribution: req.body?.difficultyDistribution,
    };
    req.log.info({ packageId: "TRG-002", count, cpCount: cpIds.length, computeBackend, rssBytes: process.memoryUsage().rss }, "Question Studio generation started");
    try {
      // A configured remote worker is mandatory: never silently fall back to
      // the local thread after an error (that can OOM the 512 MiB web service).
      const batch: GenerationBatch = remoteTrg002Configured()
        ? await runRemoteTrg002(computeInput)
        : await generateOffThread(computeInput);
      const generatedQuestions = batch.questions;
      const plan = batch.plan;
      if (generatedQuestions.length !== count) {
        throw Object.assign(new Error("TRG-002 returned an incomplete batch"), {
          statusCode: 422, code: "TRG002_GENERATION_COUNT_MISMATCH",
        });
      }

      const runId = randomUUID();
      const publicCode = publicRunCode();
      const timestamp = new Date().toISOString();
      const requestSnapshot = {
        ...generationRequest,
        seed: plan.seed,
        difficulty: plan.requestedDifficulty,
        cpIds,
        engineId: "quant-v4",
        packageLifecycle,
        difficultyPreset: plan.difficultyPreset,
        difficultyDistribution: plan.difficultyDistribution,
        difficultyCounts: plan.difficultyCounts,
        legacyExamProfile: plan.legacyExamProfile,
        cpCounts: plan.cpCounts,
        ...plan.trace,
        requestedByFirebaseUid: req.user?.id,
      };

      // Preserve the same atomic review-only persistence and audit/outbox
      // writes as the canonical multi-engine generation route.
      await sqlClient.begin(async (tx) => {
        await tx`
          INSERT INTO content.generation_runs (
            id, public_code, status, attempt_number, prompt_snapshot, request_snapshot,
            provider, model, prompt_tokens, completion_tokens, estimated_cost_paise,
            actual_cost_paise, started_at, completed_at, created_at, updated_at
          ) VALUES (
            ${runId}::uuid, ${publicCode}, 'review'::generation_run_status, 1,
            ${JSON.stringify(requestSnapshot)}, ${JSON.stringify(requestSnapshot)},
            'examtree', 'quant-v4-exam-profile', 0, 0, 0, 0,
            ${timestamp}, ${timestamp}, ${timestamp}, ${timestamp}
          )
        `;
        for (let index = 0; index < generatedQuestions.length; index += 1) {
          const itemId = randomUUID();
          const versionId = randomUUID();
          const question = generatedQuestions[index]!;
          const payload = { ...question, ...packageLifecycle, generationContexts: batch.generationContexts, validationResult: "pending" };
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
              ${JSON.stringify(payload)}, ${nonEmpty(question.questionId) || null}, ${timestamp}
            )
          `;
        }
        await tx`
          INSERT INTO platform.audit_events (
            id, actor_type, actor_user_id, action_key, entity_type, entity_id, reason, summary, metadata
          ) VALUES (
            ${randomUUID()}::uuid, 'user'::audit_actor_type,
            ${req.adminSession?.user.id ?? null}::uuid,
            'question_studio.generation_run.created', 'generation_run', ${runId}::uuid,
            'Admin generated an exam-profile Question Studio batch',
            ${"Generated " + count + " " + plan.profile.label + " Quant V4 questions in " + publicCode},
            ${JSON.stringify({ firebaseUid: req.user?.id, engineId: "quant-v4", requestSnapshot })}
          )
        `;
        await tx`
          INSERT INTO platform.outbox_events (
            id, aggregate_type, aggregate_id, event_type, payload
          ) VALUES (
            ${randomUUID()}::uuid, 'generation_run', ${runId}::uuid,
            'question_studio.generation_run.created',
            ${JSON.stringify({ runId, publicCode, itemCount: count, engineId: "quant-v4" })}
          )
        `;
      });

      req.log.info({ packageId: "TRG-002", count, computeBackend, elapsedMs: Date.now() - startedAt, rssBytes: process.memoryUsage().rss, runId }, "Question Studio generation saved");
      res.status(201).json({
        id: runId, publicCode, status: "review", itemCount: generatedQuestions.length,
        generationSystem: "quant-v4", engineId: "quant-v4",
        difficulty: plan.requestedDifficulty, difficultyPreset: plan.difficultyPreset,
        difficultyDistribution: plan.difficultyDistribution,
        difficultyCounts: plan.difficultyCounts, cpCounts: plan.cpCounts,
        examProfile: plan.trace,
      });
    } catch (caught) {
      const failure = caught as Failure;
      req.log.error({ code: failure.code, error: failure.message, computeBackend, elapsedMs: Date.now() - startedAt, rssBytes: process.memoryUsage().rss }, "Question Studio generation failed");
      const statusCode = Number(failure.statusCode);
      res.status(statusCode >= 400 && statusCode < 600 ? statusCode : 500).json({
        error: failure.message || "TRG-002 generation failed",
        code: failure.code || "TRG002_GENERATION_FAILED",
        ...(failure.details !== undefined ? { details: failure.details } : {}),
      });
    } finally {
      workerBusy = false;
    }
  },
);

export default router;
