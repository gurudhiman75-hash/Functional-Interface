import { randomUUID } from "node:crypto";
import { Router } from "express";

import { sqlClient } from "../lib/db";
import { requireAdminPermission } from "../lib/admin-rbac";
import { authenticate } from "../middlewares/auth";
import {
  generateQuestionStudioQuestions,
  listQuestionStudioEngines,
  listQuestionStudioPackages,
} from "../question-studio/engine-registry";
import type {
  QuestionStudioEngineId,
  QuestionStudioGenerationRequest,
} from "../question-studio/engine-types";

const router = Router();

const LANGUAGES = new Set(["en", "hi", "pa"]);
const DIFFICULTIES = new Set(["Easy", "Medium", "Hard"]);

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asPositiveInteger(value: unknown, fallback: number, max: number) {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) && parsed > 0
    ? Math.min(parsed, max)
    : fallback;
}

function normalizeDifficulty(value: unknown) {
  const raw = asString(value);
  if (raw.toLowerCase() === "moderate") return "Medium";
  return DIFFICULTIES.has(raw) ? raw : "Medium";
}

function normalizeLanguage(value: unknown) {
  const raw = asString(value).toLowerCase();
  return LANGUAGES.has(raw) ? raw : "en";
}

function publicRunCode() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const suffix = randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase();
  return `GEN-${date}-${suffix}`;
}

function normalizeEngineId(value: unknown): QuestionStudioEngineId | undefined {
  const raw = asString(value);
  if (!raw) return undefined;
  const engines = listQuestionStudioEngines();
  return engines.includes(raw as QuestionStudioEngineId)
    ? (raw as QuestionStudioEngineId)
    : undefined;
}

function packageForId(packageId: string | undefined) {
  if (!packageId) return undefined;
  return listQuestionStudioPackages().find((pkg) => pkg.packageId === packageId);
}

function engineForPackage(packageId: string | undefined) {
  return packageForId(packageId)?.engineId;
}

function difficultyForRequest(value: unknown, packageId: string | undefined) {
  const raw = asString(value);
  const pkg = packageForId(packageId);
  if (pkg?.difficultyFilterSupported === false) {
    if (!raw || raw === "Mixed") return undefined;
    // Preserve an explicit classified request so the owning adapter can reject
    // it with its chapter-specific authority message. Never synthesize Medium.
    return normalizeDifficulty(raw);
  }
  return normalizeDifficulty(value);
}

function nonQuantRunGate(req: any, _res: any, next: any) {
  const requestedEngineRaw = asString(req.body?.engineId);
  const requestedEngineId = normalizeEngineId(requestedEngineRaw);

  if (requestedEngineRaw && !requestedEngineId) {
    next();
    return;
  }

  const packageId = asString(req.body?.packageId) || undefined;
  const selectedEngineId = requestedEngineId ?? engineForPackage(packageId);

  if (!selectedEngineId || selectedEngineId === "quant-v4") {
    next("route");
    return;
  }

  next();
}

router.get(
  "/capabilities",
  authenticate,
  requireAdminPermission("content.generation.read"),
  async (_req, res) => {
    try {
      const generationSystems = listQuestionStudioEngines();
      const packages = listQuestionStudioPackages().map((pkg) => ({
        engineId: pkg.engineId,
        packageId: pkg.packageId,
        subject: pkg.subject,
        topic: pkg.topic,
        subtopic: pkg.subtopic,
        label: pkg.label,
        enabled: pkg.enabled,
        cpIds: pkg.cpIds,
        supportedLanguages: pkg.supportedLanguages,
        supportedDifficulties: pkg.supportedDifficulties ?? [],
        difficultyFilterSupported: pkg.difficultyFilterSupported ?? true,
        runtimeMode: pkg.runtimeMode,
        supportedRuntimeModes: pkg.supportedRuntimeModes ?? [],
        dynamicCandidateCpIds: pkg.dynamicCandidateCpIds ?? [],
        lifecycleId: pkg.lifecycleId,
        lifecycleStage: pkg.lifecycleStage,
        reviewSurfaceRequired: pkg.reviewSurfaceRequired,
        manualApprovalRequired: pkg.manualApprovalRequired,
        questionBankStatus: pkg.questionBankStatus,
        questionBankWritable: pkg.questionBankWritable,
        questionBankAcceptanceMode: pkg.questionBankAcceptanceMode,
        questionBankAcceptanceAuthority: pkg.questionBankAcceptanceAuthority,
        testEligibility: pkg.testEligibility,
        testEligible: pkg.testEligible,
        mockTestEligible: pkg.mockTestEligible,
        publiclyPublishable: pkg.publiclyPublishable,
        automaticStudentPublication: pkg.automaticStudentPublication,
        productionReleaseAuthorized: pkg.productionReleaseAuthorized,
      }));

      res.json({
        generationSystem: "quant-v4",
        defaultGenerationSystem: "quant-v4",
        generationSystems,
        packages,
        difficulties: ["Easy", "Medium", "Hard"],
        languages: ["en", "hi", "pa"],
        maxBatchSize: 50,
      });
    } catch (error) {
      console.error("Question Studio engine capabilities failed", error);
      res.status(500).json({ error: "Unable to load generation capabilities" });
    }
  },
);

router.post(
  "/runs",
  nonQuantRunGate,
  authenticate,
  requireAdminPermission("content.generation.run"),
  async (req, res) => {
    const requestedEngineRaw = asString(req.body?.engineId);
    const requestedEngineId = normalizeEngineId(requestedEngineRaw);

    if (requestedEngineRaw && !requestedEngineId) {
      res.status(400).json({
        error: `Question Studio engine ${requestedEngineRaw} is not registered`,
        generationSystems: listQuestionStudioEngines(),
      });
      return;
    }

    const packageId = asString(req.body?.packageId) || undefined;
    const packageEngineId = engineForPackage(packageId);
    const selectedEngineId = requestedEngineId ?? packageEngineId;

    if (!selectedEngineId || selectedEngineId === "quant-v4") {
      res.status(409).json({
        error: "Legacy Quant requests must use the established Question Studio run path",
      });
      return;
    }

    if (
      requestedEngineId &&
      packageEngineId &&
      requestedEngineId !== packageEngineId
    ) {
      res.status(400).json({
        error: `Package ${packageId} belongs to ${packageEngineId}, not ${requestedEngineId}`,
      });
      return;
    }

    const count = asPositiveInteger(req.body?.count, 5, 50);
    const patternId = asString(req.body?.patternId) || undefined;
    const topic = asString(req.body?.topic) || undefined;
    const subtopic = asString(req.body?.subtopic) || undefined;
    const exam = asString(req.body?.exam) || "SSC CGL";
    const subject = asString(req.body?.subject) || undefined;
    const language = normalizeLanguage(req.body?.language);
    const difficulty = difficultyForRequest(req.body?.difficulty, packageId);
    const seed = asString(req.body?.seed) || undefined;
    const runtimeMode = asString(req.body?.runtimeMode) || undefined;
    const canonicalProblemId =
      asString(req.body?.canonicalProblemId) ||
      asString(req.body?.cpId) ||
      undefined;
    const questionLanguageId =
      asString(req.body?.questionLanguageId) || undefined;

    if (!packageId && !patternId && !(topic && subtopic)) {
      res.status(400).json({
        error: "A package, pattern, or topic/subtopic selection is required",
      });
      return;
    }

    const generationRequest: QuestionStudioGenerationRequest = {
      engineId: selectedEngineId,
      exam,
      subject,
      difficulty,
      count,
      packageId,
      patternId,
      topic,
      subtopic,
      language: language as "en" | "hi" | "pa",
      seed,
      runtimeMode,
      canonicalProblemId,
      questionLanguageId,
    };

    const runId = randomUUID();
    const code = publicRunCode();
    const timestamp = new Date().toISOString();

    try {
      const result = await generateQuestionStudioQuestions(generationRequest);
      const generatedQuestions = Array.isArray(result.questions)
        ? result.questions
        : [];

      if (generatedQuestions.length === 0) {
        res.status(422).json({
          error: "The generation engine returned no questions",
        });
        return;
      }

      const requestSnapshot = {
        ...generationRequest,
        engineId: result.engineId,
        requestedByFirebaseUid: req.user?.id,
      };
      const generationContext = {
        ...(result.generationContext ?? {}),
        engineId: result.engineId,
      };

      await sqlClient.begin(async (tx) => {
        await tx`
          INSERT INTO content.generation_runs (
            id,
            public_code,
            status,
            attempt_number,
            prompt_snapshot,
            request_snapshot,
            provider,
            model,
            prompt_tokens,
            completion_tokens,
            estimated_cost_paise,
            actual_cost_paise,
            started_at,
            completed_at,
            created_at,
            updated_at
          ) VALUES (
            ${runId}::uuid,
            ${code},
            'review'::generation_run_status,
            1,
            ${JSON.stringify(requestSnapshot)},
            ${JSON.stringify(requestSnapshot)},
            'examtree',
            ${result.engineId},
            0,
            0,
            0,
            0,
            ${timestamp},
            ${timestamp},
            ${timestamp},
            ${timestamp}
          )
        `;

        for (let index = 0; index < generatedQuestions.length; index++) {
          const itemId = randomUUID();
          const versionId = randomUUID();
          const question = generatedQuestions[index] as Record<string, unknown>;
          const payload = {
            ...question,
            engineId: result.engineId,
            generationContext,
            validationResult: "pending",
          };

          await tx`
            INSERT INTO content.generation_run_items (
              id,
              generation_run_id,
              item_number,
              status,
              current_version_number,
              created_at,
              updated_at
            ) VALUES (
              ${itemId}::uuid,
              ${runId}::uuid,
              ${index + 1},
              'unreviewed'::generation_item_status,
              1,
              ${timestamp},
              ${timestamp}
            )
          `;

          await tx`
            INSERT INTO content.generation_item_versions (
              id,
              generation_item_id,
              version_number,
              payload,
              provider_item_id,
              created_at
            ) VALUES (
              ${versionId}::uuid,
              ${itemId}::uuid,
              1,
              ${JSON.stringify(payload)},
              ${asString(question.questionId) || null},
              ${timestamp}
            )
          `;
        }

        await tx`
          INSERT INTO platform.audit_events (
            id,
            actor_type,
            actor_user_id,
            action_key,
            entity_type,
            entity_id,
            reason,
            summary,
            metadata
          ) VALUES (
            ${randomUUID()}::uuid,
            'user'::audit_actor_type,
            ${req.adminSession?.user.id ?? null}::uuid,
            'question_studio.generation_run.created',
            'generation_run',
            ${runId}::uuid,
            'Admin generated a Question Studio batch',
            ${`Generated ${generatedQuestions.length} ${result.engineId} questions in ${code}`},
            ${JSON.stringify({
              firebaseUid: req.user?.id,
              engineId: result.engineId,
              requestSnapshot,
            })}
          )
        `;

        await tx`
          INSERT INTO platform.outbox_events (
            id,
            aggregate_type,
            aggregate_id,
            event_type,
            payload
          ) VALUES (
            ${randomUUID()}::uuid,
            'generation_run',
            ${runId}::uuid,
            'question_studio.generation_run.created',
            ${JSON.stringify({
              runId,
              publicCode: code,
              itemCount: generatedQuestions.length,
              engineId: result.engineId,
            })}
          )
        `;
      });

      res.status(201).json({
        id: runId,
        publicCode: code,
        status: "review",
        itemCount: generatedQuestions.length,
        generationSystem: result.engineId,
        engineId: result.engineId,
      });
    } catch (error) {
      console.error("Question Studio multi-engine generation failed", error);
      const message = error instanceof Error
        ? error.message
        : "Question generation failed";
      res.status(500).json({ error: message });
    }
  },
);

export default router;
