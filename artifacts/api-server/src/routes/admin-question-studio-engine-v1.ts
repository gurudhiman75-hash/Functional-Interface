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
  resolveLegacyQuantExamProfile,
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

function generationCount(value: unknown) {
  if (value === undefined || value === null || value === "") return 5;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 50) {
    throw Object.assign(
      new Error("Question count must be an integer between 1 and 50"),
      { statusCode: 400, code: "INVALID_GENERATION_COUNT" },
    );
  }
  return parsed;
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

function validatePackageLanguage(
  pkg: ReturnType<typeof listQuestionStudioPackages>[number],
  value: unknown,
) {
  const requested = asString(value).toLowerCase() || pkg.supportedLanguages[0];
  if (!requested || !pkg.supportedLanguages.includes(requested as "en" | "hi" | "pa")) {
    throw Object.assign(
      new Error(`Package ${pkg.packageId} does not support language ${requested || "<missing>"}`),
      { statusCode: 400, code: "UNSUPPORTED_PACKAGE_LANGUAGE" },
    );
  }
  return requested as "en" | "hi" | "pa";
}

function validatePackageDifficulty(
  pkg: ReturnType<typeof listQuestionStudioPackages>[number],
  value: unknown,
) {
  const raw = asString(value);
  if (pkg.difficultyFilterSupported === false) {
    if (!raw || raw === "Mixed") return undefined;
    throw Object.assign(
      new Error(`Package ${pkg.packageId} does not support difficulty filtering`),
      { statusCode: 400, code: "DIFFICULTY_FILTER_UNSUPPORTED" },
    );
  }

  const normalized = raw.toLowerCase() === "moderate" ? "Medium" : (raw || "Medium");
  if (!pkg.supportedDifficulties?.includes(normalized as "Easy" | "Medium" | "Hard")) {
    throw Object.assign(
      new Error(`Package ${pkg.packageId} does not support difficulty ${normalized}`),
      { statusCode: 400, code: "UNSUPPORTED_PACKAGE_DIFFICULTY" },
    );
  }
  return normalized;
}

function validatePackageRuntimeMode(
  pkg: ReturnType<typeof listQuestionStudioPackages>[number],
  value: unknown,
) {
  const requested = asString(value) || pkg.runtimeMode;
  const supportedRuntimeModes = pkg.supportedRuntimeModes ?? [];
  const validRuntimeMode = !requested
    || supportedRuntimeModes.includes(requested)
    || (supportedRuntimeModes.length === 0 && requested === pkg.runtimeMode);

  if (!validRuntimeMode) {
    throw Object.assign(
      new Error(`Package ${pkg.packageId} does not support runtime mode ${requested}`),
      { statusCode: 400, code: "UNSUPPORTED_PACKAGE_RUNTIME_MODE" },
    );
  }
  return requested;
}

function packageSubjectLabel(pkg: ReturnType<typeof listQuestionStudioPackages>[number]) {
  const explicit = asString(pkg.subject);
  if (explicit) return explicit;
  if (pkg.engineId === "quant-v4") return "Quantitative Aptitude";
  if (pkg.engineId === "reasoning-v1") return "Reasoning Ability";
  if (pkg.engineId === "language-v1") return "English";
  if (pkg.engineId === "knowledge-v1") return "Static GK";
  return "Other";
}

function packageChapterLabel(pkg: ReturnType<typeof listQuestionStudioPackages>[number]) {
  if (pkg.engineId === "quant-v4") {
    return asString(pkg.subtopic) || asString(pkg.topic) || pkg.label;
  }
  return asString(pkg.topic) || asString(pkg.subtopic) || pkg.label;
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
  "num 002",
  "sap",
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

function isLegacyNum002QuestionLanguageId(value: unknown): boolean {
  const match = /^NUM-QL-(\d{3})$/u.exec(asString(value).toUpperCase());
  return Boolean(match && Number(match[1]) >= 166);
}

function includesLegacyNum002CpIds(value: unknown): boolean {
  return Array.isArray(value)
    && value.some((cpId) => LEGACY_NUMBER_SYSTEM_CPS.has(asString(cpId)));
}

function inferNum001CpFromQl(value: unknown): "NUM-CP-001" | "NUM-CP-003" | "NUM-CP-004" | undefined {
  const match = /^NUM-QL-(\d{3})$/u.exec(asString(value).toUpperCase());
  if (!match) return undefined;
  const number = Number(match[1]);
  if (number >= 1 && number <= 17) return "NUM-CP-003";
  if (number >= 18 && number <= 45) return "NUM-CP-004";
  if (number >= 124 && number <= 144) return "NUM-CP-001";
  return undefined;
}

function isNum001UnifiedRequest(body: Record<string, unknown>): boolean {
  const packageId = normalizeCompatibilitySelector(body.packageId ?? body.archetypeId);
  const patternId = normalizeCompatibilitySelector(body.patternId);
  const topic = normalizeCompatibilitySelector(body.topic);
  const subtopic = normalizeCompatibilitySelector(body.subtopic);
  const cpId = asString(body.canonicalProblemId) || asString(body.cpId);
  const qlCp = inferNum001CpFromQl(body.questionLanguageId);
  const numberSelectors = new Set(["number system", "numbers", "number theory"]);

  if (packageId === "num 002") return false;
  if (LEGACY_NUMBER_SYSTEM_CPS.has(cpId)) return false;
  if (includesLegacyNum002CpIds(body.cpIds)) return false;
  if (isLegacyNum002QuestionLanguageId(body.questionLanguageId)) return false;

  return (
    packageId === "num 001"
    || patternId.includes("num 001")
    || cpId === "NUM-CP-001"
    || cpId === "NUM-CP-003"
    || cpId === "NUM-CP-004"
    || Boolean(qlCp)
    || (numberSelectors.has(topic) && !subtopic)
    || (topic === "arithmetic" && numberSelectors.has(subtopic))
  );
}

/**
 * A small set of pre-registry Quant routes still owns the generic /runs
 * endpoint for chapter-specific lifecycle/delivery contracts. Keep those
 * selectors on their established route until each package is migrated
 * independently. Dedicated /quant/.../runs surfaces do not need deferral.
 */
function isBankingSapCompatibilityRequest(body: Record<string, unknown>): boolean {
  const packageId = normalizeCompatibilitySelector(body.packageId ?? body.archetypeId);
  const patternId = normalizeCompatibilitySelector(body.patternId);
  const topic = normalizeCompatibilitySelector(body.topic);
  const subtopic = normalizeCompatibilitySelector(body.subtopic);
  const legacyProfile = resolveLegacyQuantExamProfile(
    body.examProfileId ?? body.examProfile,
    body.exam,
  );
  const bankingProfile =
    legacyProfile === "BANKING_PRELIMS" || legacyProfile === "BANKING_MAINS";
  if (!bankingProfile) return false;

  const simplificationSelectors = new Set([
    "simplification approximation",
    "simplification and approximation",
    "simplification",
    "approximation",
  ]);

  return (
    packageId === "sap"
    || patternId === "sap"
    || patternId.includes("sap ql")
    || (simplificationSelectors.has(topic) && !subtopic)
    || (topic === "arithmetic" && simplificationSelectors.has(subtopic))
  );
}

function shouldDeferQuantCompatibilityRun(body: Record<string, unknown>): boolean {
  const packageId = normalizeCompatibilitySelector(body.packageId ?? body.archetypeId);
  const patternId = normalizeCompatibilitySelector(body.patternId);
  const topic = normalizeCompatibilitySelector(body.topic);
  const subtopic = normalizeCompatibilitySelector(body.subtopic);
  const cpId = asString(body.canonicalProblemId) || asString(body.cpId);
  const bankingSap = isBankingSapCompatibilityRequest(body);

  if (LEGACY_GENERIC_QUANT_PACKAGES.has(packageId) && !(packageId === "sap" && bankingSap)) return true;
  if (LEGACY_NUMBER_SYSTEM_CPS.has(cpId)) return true;
  if (includesLegacyNum002CpIds(body.cpIds)) return true;
  if (isLegacyNum002QuestionLanguageId(body.questionLanguageId)) return true;

  if (
    patternId.includes("num 002")
    || patternId.includes("num cp 008")
    || patternId.includes("num cp 009")
    || patternId.includes("num cp 010")
    || patternId.includes("num cp 011")
    || patternId.includes("num cp 012")
    || patternId.includes("num cp 013")
    || patternId.includes("num cp 014")
    || ((patternId === "sap" || patternId.includes("sap ql")) && !bankingSap)
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
  return (
    ((numberSelectors.has(topic) && !subtopic) && packageId === "num 002")
    || ((topic === "arithmetic" && numberSelectors.has(subtopic)) && packageId === "num 002")
    || ((simplificationSelectors.has(topic) && !subtopic) && !bankingSap)
    || ((topic === "arithmetic" && simplificationSelectors.has(subtopic)) && !bankingSap)
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
          subject: packageSubjectLabel(pkg),
          chapter: packageChapterLabel(pkg),
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
    const rawCpIds = Array.isArray(req.body?.cpIds)
      ? req.body.cpIds.map(asString).filter(Boolean)
      : [];
    if (rawCpIds.length > 50) {
      res.status(400).json({
        error: "At most 50 CPs can be selected in one generation run",
        code: "TOO_MANY_SELECTED_CPS",
      });
      return;
    }
    const requestedCpIds = [...new Set(rawCpIds)];
    const packageEngineId = engineForPackage(packageId);
    const selectedEngineId = requestedEngineId ?? packageEngineId ?? "quant-v4";

    if (
      selectedEngineId === "quant-v4"
      && shouldDeferQuantCompatibilityRun((req.body ?? {}) as Record<string, unknown>)
    ) {
      next("route");
      return;
    }

    const selectedPackage = packageId ? packageForId(packageId) : undefined;
    if (packageId && !selectedPackage) {
      res.status(400).json({ error: `Question Studio package ${packageId} is not registered` });
      return;
    }

    if (requestedEngineId && packageEngineId && requestedEngineId !== packageEngineId) {
      res.status(400).json({
        error: `Package ${packageId} belongs to ${packageEngineId}, not ${requestedEngineId}`,
      });
      return;
    }

    const count = generationCount(req.body?.count);
    const patternId = asString(req.body?.patternId) || undefined;
    const rawTopic = asString(req.body?.topic) || undefined;
    const rawSubtopic = asString(req.body?.subtopic) || undefined;
    const topic = selectedPackage?.topic
      ?? rawTopic
      ?? (selectedEngineId === "quant-v4" ? "Arithmetic" : undefined);
    const subtopic = selectedPackage?.subtopic
      ?? rawSubtopic
      ?? (selectedEngineId === "quant-v4" ? "Percentage" : undefined);
    const exam = asString(req.body?.exam)
      || (selectedEngineId === "quant-v4" ? "SSC CGL Tier 1" : "SSC CGL");
    const subject = selectedPackage
      ? packageSubjectLabel(selectedPackage)
      : asString(req.body?.subject)
        || (selectedEngineId === "quant-v4" ? "Quantitative Aptitude" : undefined);
    const language = selectedPackage
      ? validatePackageLanguage(selectedPackage, req.body?.language)
      : normalizeLanguage(req.body?.language);
    const difficulty = selectedPackage
      ? validatePackageDifficulty(selectedPackage, req.body?.difficulty)
      : selectedEngineId === "quant-v4"
        ? (asString(req.body?.difficulty) || "Medium")
        : difficultyForRequest(req.body?.difficulty, packageId);
    const seed = asString(req.body?.seed) || undefined;
    const runtimeMode = selectedPackage
      ? validatePackageRuntimeMode(selectedPackage, req.body?.runtimeMode)
      : asString(req.body?.runtimeMode) || undefined;
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

    const packageLifecycle = selectedPackage
      ? Object.fromEntries(
          Object.entries({
            lifecycleId: selectedPackage.lifecycleId,
            lifecycleStage: selectedPackage.lifecycleStage,
            reviewSurfaceRequired: selectedPackage.reviewSurfaceRequired,
            manualApprovalRequired: selectedPackage.manualApprovalRequired,
            questionBankStatus: selectedPackage.questionBankStatus,
            questionBankWritable: selectedPackage.questionBankWritable,
            questionBankAcceptanceMode: selectedPackage.questionBankAcceptanceMode,
            questionBankAcceptanceAuthority: selectedPackage.questionBankAcceptanceAuthority,
            testEligibility: selectedPackage.testEligibility,
            testEligible: selectedPackage.testEligible,
            mockTestEligible: selectedPackage.mockTestEligible,
            publiclyPublishable: selectedPackage.publiclyPublishable,
            automaticStudentPublication: selectedPackage.automaticStudentPublication,
            productionReleaseAuthorized: selectedPackage.productionReleaseAuthorized,
          }).filter(([, value]) => value !== undefined),
        )
      : {};

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
          forwardLegacyExamProfile:
            packageId === "AVG-001"
            || packageId === "TMW-001"
            || isNum001UnifiedRequest((req.body ?? {}) as Record<string, unknown>)
            || isBankingSapCompatibilityRequest((req.body ?? {}) as Record<string, unknown>),
          difficultyFilterSupported:
            !isNum001UnifiedRequest((req.body ?? {}) as Record<string, unknown>)
            && packageForId(packageId)?.difficultyFilterSupported !== false,
          generateCandidateBatch: (candidateRequest) =>
            generateQuestionStudioQuestions({
              ...candidateRequest,
              engineId: "quant-v4",
            }),
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
          if (questions.length !== request.count) {
            throw new Error(
              `Question Studio package ${packageId ?? selectedEngineId} returned ${questions.length} question(s) for ${request.cpId ?? "chapter mix"}; expected exactly ${request.count}.`,
            );
          }
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
        packageLifecycle,
        ...(quantPlan
          ? {
              difficultyPreset: quantPlan.difficultyPreset,
              difficultyDistribution: quantPlan.difficultyDistribution,
              difficultyCounts: quantPlan.difficultyCounts,
              legacyExamProfile: quantPlan.legacyExamProfile,
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
            ...packageLifecycle,
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
