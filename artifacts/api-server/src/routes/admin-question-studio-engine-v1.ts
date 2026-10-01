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
import {
  generateProfiledQuantBatch,
  type QuantExamProfilePlan,
} from "../question-studio/quant-exam-profile";

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
    return normalizeDifficulty(raw);
  }
  return normalizeDifficulty(value);
}

function normalizeCompatibilitySelector(value: unknown): string {
  return asString(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const LEGACY_GENERIC_QUANT_PACKAGES = new Set([
  "avg 001",
  "num 001",
  "num 002",
  "sap",
  "tmw 001",
]);

const LEGACY_NUMBER_SYSTEM_CPS = new Set([
  "NUM-CP-008",
  "NUM-CP-009",
  "NUM-CP-010",
  "NUM-CP-011",
  "NUM-CP-012",
  "NUM-CP-013",
  "NUM-CP-014",
]);

/**
 * A small set of pre-registry Quant routes still owns the generic /runs
 * endpoint for chapter-specific lifecycle/delivery contracts. Keep those
 * selectors on their established route until each package is migrated
 * independently. Dedicated /quant/.../runs surfaces do not need deferral.
 */
function shouldDeferQuantCompatibilityRun(body: Record<string, unknown>): boolean {
  const packageId = normalizeCompatibilitySelector(body.packageId ?? body.archetypeId);
  const patternId = normalizeCompatibilitySelector(body.patternId);
  const topic = normalizeCompatibilitySelector(body.topic);
  const subtopic = normalizeCompatibilitySelector(body.subtopic);
  const cpId = asString(body.canonicalProblemId) || asString(body.cpId);

  if (LEGACY_GENERIC_QUANT_PACKAGES.has(packageId)) return true;
  if (LEGACY_NUMBER_SYSTEM_CPS.has(cpId)) return true;

  if (
    patternId.includes("avg 001")
    || patternId.includes("num 001")
    || patternId.includes("num 002")
    || patternId.includes("num cp 008")
    || patternId.includes("num cp 009")
    || patternId.includes("num cp 010")
    || patternId.includes("num cp 011")
    || patternId.includes("num cp 012")
    || patternId.includes("num cp 013")
    || patternId.includes("num cp 014")
    || patternId === "sap"
    || patternId.includes("sap ql")
    || patternId.includes("tmw 001")
  ) {
    return true;
  }

  const numberSelectors = new Set(["number system", "numbers", "number theory"]);
  const simplificationSelectors = new Set([
    "simplification approximation",
    "simplification and approximation",
    "simplification",
    "approximation",
  ]);
  const timeWorkSelectors = new Set([
    "time work",
    "time and work",
    "work and time",
    "pipes cisterns",
    "pipes and cisterns",
  ]);
  return (
    (topic === "average" && !subtopic)
    || (topic === "arithmetic" && subtopic === "average")
    || (numberSelectors.has(topic) && !subtopic)
    || (topic === "arithmetic" && numberSelectors.has(subtopic))
    || (simplificationSelectors.has(topic) && !subtopic)
    || (topic === "arithmetic" && simplificationSelectors.has(subtopic))
    || (timeWorkSelectors.has(topic) && !subtopic)
    || (topic === "arithmetic" && timeWorkSelectors.has(subtopic))
  );
}

router.get(
  "/capabilities",
  authenticate,
  requireAdminPermission("content.generation.read"),
  async (_req, res) => {
    try {
      const generationSystems = listQuestionStudioEngines();
      const registeredPackages = listQuestionStudioPackages();

      const packages = registeredPackages.map((pkg) => {
        const cpLabels = new Map<string, string>();
        const visibleCpIds = [
          ...new Set([
            ...pkg.cpIds.map(String),
            ...(pkg.dynamicCandidateCpIds ?? []).map(String),
          ]),
        ];

        const metadataTitles = pkg.metadata?.cpTitles;
        if (metadataTitles && typeof metadataTitles === "object" && !Array.isArray(metadataTitles)) {
          for (const [cpId, title] of Object.entries(metadataTitles as Record<string, unknown>)) {
            const normalizedTitle = asString(title);
            if (visibleCpIds.includes(cpId) && normalizedTitle) {
              cpLabels.set(cpId, normalizedTitle);
            }
          }
        }

        if (visibleCpIds.length === 1) {
          const cpId = visibleCpIds[0]!;
          const topic = asString(pkg.topic);
          const subtopic = asString(pkg.subtopic);
          const normalizedSubtopic = subtopic.toLowerCase();
          const genericSubtopic =
            !subtopic ||
            subtopic === topic ||
            /^(complete chapter|mixed|approved|review|question studio)$/i.test(subtopic) ||
            normalizedSubtopic.includes("approved checkpoint");

          if (!genericSubtopic && !cpLabels.has(cpId)) cpLabels.set(cpId, subtopic);
        }

        return {
          engineId: pkg.engineId,
          packageId: pkg.packageId,
          subject: pkg.subject,
          topic: pkg.topic,
          subtopic: pkg.subtopic,
          label: pkg.label,
          enabled: pkg.enabled,
          cpIds: pkg.cpIds,
          cpLabels: Object.fromEntries(
            visibleCpIds
              .map((cpId) => [cpId, cpLabels.get(cpId)] as const)
              .filter((entry): entry is readonly [string, string] => Boolean(entry[1])),
          ),
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
        };
      });

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
  authenticate,
  requireAdminPermission("content.generation.run"),
  async (req, res, next) => {
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
    const requestedCpIds = Array.isArray(req.body?.cpIds)
      ? [...new Set(req.body.cpIds.map(asString).filter(Boolean))].slice(0, 50)
      : [];
    const packageEngineId = engineForPackage(packageId);
    const selectedEngineId = requestedEngineId ?? packageEngineId ?? "quant-v4";

    if (
      selectedEngineId === "quant-v4"
      && shouldDeferQuantCompatibilityRun((req.body ?? {}) as Record<string, unknown>)
    ) {
      next("route");
      return;
    }

    if (requestedEngineId && packageEngineId && requestedEngineId !== packageEngineId) {
      res.status(400).json({
        error: `Package ${packageId} belongs to ${packageEngineId}, not ${requestedEngineId}`,
      });
      return;
    }

    const count = asPositiveInteger(req.body?.count, 5, 50);
    const patternId = asString(req.body?.patternId) || undefined;
    const rawTopic = asString(req.body?.topic) || undefined;
    const rawSubtopic = asString(req.body?.subtopic) || undefined;
    const topic = rawTopic ?? (selectedEngineId === "quant-v4" ? "Arithmetic" : undefined);
    const subtopic = rawSubtopic ?? (selectedEngineId === "quant-v4" ? "Percentage" : undefined);
    const exam = asString(req.body?.exam)
      || (selectedEngineId === "quant-v4" ? "SSC CGL Tier 1" : "SSC CGL");
    const subject = asString(req.body?.subject)
      || (selectedEngineId === "quant-v4" ? "Quantitative Aptitude" : undefined);
    const language = normalizeLanguage(req.body?.language);
    const difficulty = selectedEngineId === "quant-v4"
      ? (asString(req.body?.difficulty) || "Medium")
      : difficultyForRequest(req.body?.difficulty, packageId);
    const seed = asString(req.body?.seed) || undefined;
    const runtimeMode = asString(req.body?.runtimeMode) || undefined;
    const canonicalProblemId =
      asString(req.body?.canonicalProblemId)
      || asString(req.body?.cpId)
      || undefined;
    const selectedCpIds = requestedCpIds.length > 0
      ? requestedCpIds
      : canonicalProblemId
        ? [canonicalProblemId]
        : [];
    const questionLanguageId = asString(req.body?.questionLanguageId) || undefined;

    if (!packageId && !patternId && !(topic && subtopic)) {
      res.status(400).json({
        error: "A package, pattern, or topic/subtopic selection is required",
      });
      return;
    }

    if (packageId && selectedCpIds.length > 0) {
      const pkg = packageForId(packageId);
      if (pkg) {
        const allowedCpIds = new Set([
          ...pkg.cpIds.map(String),
          ...(pkg.dynamicCandidateCpIds ?? []).map(String),
        ]);
        const invalidCpIds = selectedCpIds.filter((cpId) => !allowedCpIds.has(cpId));
        if (invalidCpIds.length > 0) {
          res.status(400).json({
            error: `Selected CPs are not available in ${packageId}: ${invalidCpIds.join(", ")}`,
          });
          return;
        }
      }
    }

    if (selectedCpIds.length > count) {
      res.status(400).json({
        error: `Question count must be at least the number of selected CPs (${selectedCpIds.length})`,
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
      canonicalProblemId: selectedCpIds.length === 1 ? selectedCpIds[0] : undefined,
      questionLanguageId,
    };

    const runId = randomUUID();
    const code = publicRunCode();
    const timestamp = new Date().toISOString();

    try {
      const generatedQuestions: Array<Record<string, unknown>> = [];
      const generationContexts: Array<Record<string, unknown>> = [];
      let quantPlan: QuantExamProfilePlan | null = null;

      if (selectedEngineId === "quant-v4") {
        const quantBatch = await generateProfiledQuantBatch({
          request: generationRequest,
          count,
          selectedCpIds,
          examProfileId: req.body?.examProfileId,
          difficultyPreset: req.body?.difficultyPreset,
          difficultyDistribution: req.body?.difficultyDistribution,
        });
        quantPlan = quantBatch.plan;
        generatedQuestions.push(...quantBatch.questions);
        generationContexts.push(
          ...quantBatch.generationContexts.map((entry) => ({
            cpId: entry.cpId,
            difficulty: entry.difficulty,
            context: entry.context,
          })),
        );
      } else {
        const generationRequests = selectedCpIds.length > 0
          ? selectedCpIds.map((cpId, index) => {
              const baseCount = Math.floor(count / selectedCpIds.length);
              const remainder = count % selectedCpIds.length;
              return {
                cpId,
                count: baseCount + (index < remainder ? 1 : 0),
              };
            }).filter((entry) => entry.count > 0)
          : [{ cpId: undefined, count }];

        for (let index = 0; index < generationRequests.length; index += 1) {
          const request = generationRequests[index]!;
          const cpSeed = seed && request.cpId
            ? `${seed}:cp:${request.cpId}:slot:${index + 1}`
            : seed;

          const result = await generateQuestionStudioQuestions({
            ...generationRequest,
            count: request.count,
            seed: cpSeed,
            canonicalProblemId: request.cpId,
          });

          if (result.engineId !== selectedEngineId) {
            throw new Error(
              `Question Studio engine changed during generation: expected ${selectedEngineId}, received ${result.engineId}`,
            );
          }

          const questions = Array.isArray(result.questions) ? result.questions : [];
          generationContexts.push({
            cpId: request.cpId,
            context: {
              ...(result.generationContext ?? {}),
              engineId: result.engineId,
            },
          });

          for (const question of questions) {
            generatedQuestions.push({
              ...question,
              canonicalProblemId:
                asString((question as Record<string, unknown>)?.canonicalProblemId)
                || request.cpId,
              selectedCpId: request.cpId,
              engineId: result.engineId,
              generationContext: {
                ...(result.generationContext ?? {}),
                engineId: result.engineId,
              },
            });
          }
        }
      }

      if (generatedQuestions.length === 0) {
        res.status(422).json({ error: "The generation engine returned no questions" });
        return;
      }

      const requestSnapshot = {
        ...generationRequest,
        seed: quantPlan?.seed ?? generationRequest.seed,
        difficulty: quantPlan?.requestedDifficulty ?? generationRequest.difficulty,
        canonicalProblemId: selectedCpIds.length === 1 ? selectedCpIds[0] : undefined,
        cpIds: selectedCpIds,
        engineId: selectedEngineId,
        ...(quantPlan
          ? {
              difficultyPreset: quantPlan.difficultyPreset,
              difficultyDistribution: quantPlan.difficultyDistribution,
              difficultyCounts: quantPlan.difficultyCounts,
              cpCounts: quantPlan.cpCounts,
              ...quantPlan.trace,
            }
          : {}),
        requestedByFirebaseUid: req.user?.id,
      };

      const model = quantPlan ? "quant-v4-exam-profile" : selectedEngineId;

      await sqlClient.begin(async (tx) => {
        await tx`
          INSERT INTO content.generation_runs (
            id, public_code, status, attempt_number, prompt_snapshot, request_snapshot,
            provider, model, prompt_tokens, completion_tokens, estimated_cost_paise,
            actual_cost_paise, started_at, completed_at, created_at, updated_at
          ) VALUES (
            ${runId}::uuid, ${code}, 'review'::generation_run_status, 1,
            ${JSON.stringify(requestSnapshot)}, ${JSON.stringify(requestSnapshot)},
            'examtree', ${model}, 0, 0, 0, 0,
            ${timestamp}, ${timestamp}, ${timestamp}, ${timestamp}
          )
        `;

        for (let index = 0; index < generatedQuestions.length; index += 1) {
          const itemId = randomUUID();
          const versionId = randomUUID();
          const question = generatedQuestions[index] as Record<string, unknown>;
          const payload = {
            ...question,
            generationContexts,
            validationResult: "pending",
          };

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
            ${randomUUID()}::uuid, 'user'::audit_actor_type,
            ${req.adminSession?.user.id ?? null}::uuid,
            'question_studio.generation_run.created', 'generation_run', ${runId}::uuid,
            ${quantPlan
              ? 'Admin generated an exam-profile Question Studio batch'
              : 'Admin generated a Question Studio batch'},
            ${quantPlan
              ? `Generated ${generatedQuestions.length} ${quantPlan.profile.label} Quant V4 questions in ${code}`
              : `Generated ${generatedQuestions.length} ${selectedEngineId} questions in ${code}`},
            ${JSON.stringify({
              firebaseUid: req.user?.id,
              engineId: selectedEngineId,
              requestSnapshot,
            })}
          )
        `;

        await tx`
          INSERT INTO platform.outbox_events (
            id, aggregate_type, aggregate_id, event_type, payload
          ) VALUES (
            ${randomUUID()}::uuid, 'generation_run', ${runId}::uuid,
            'question_studio.generation_run.created',
            ${JSON.stringify({
              runId,
              publicCode: code,
              itemCount: generatedQuestions.length,
              engineId: selectedEngineId,
            })}
          )
        `;
      });

      res.status(201).json({
        id: runId,
        publicCode: code,
        status: "review",
        itemCount: generatedQuestions.length,
        generationSystem: selectedEngineId,
        engineId: selectedEngineId,
        ...(quantPlan
          ? {
              difficulty: quantPlan.requestedDifficulty,
              difficultyPreset: quantPlan.difficultyPreset,
              difficultyDistribution: quantPlan.difficultyDistribution,
              difficultyCounts: quantPlan.difficultyCounts,
              cpCounts: quantPlan.cpCounts,
              examProfile: quantPlan.trace,
            }
          : {}),
      });
    } catch (error) {
      console.error("Question Studio multi-engine generation failed", error);
      const statusCode = Number((error as { statusCode?: unknown })?.statusCode);
      const code = asString((error as { code?: unknown })?.code);
      const details = (error as { details?: unknown })?.details;
      const message = error instanceof Error ? error.message : "Question generation failed";
      res.status(Number.isFinite(statusCode) ? statusCode : 500).json({
        error: message,
        ...(code ? { code } : {}),
        ...(details !== undefined ? { details } : {}),
      });
    }
  },
);

export default router;
