// Universal deterministic Question Studio execution. The caller is responsible
// for authenticated admin access and the existing atomic Neon review transaction.
// This module NEVER writes, approves or publishes questions.
import {
  generateQuestionStudioQuestions,
  listQuestionStudioPackages,
} from "./engine-registry";
import { generateProfiledQuantBatch } from "./quant-exam-profile";
import type {
  QuestionStudioEngineId,
  QuestionStudioGenerationRequest,
} from "./engine-types";

export type UniversalStudioComputeInput = {
  request: QuestionStudioGenerationRequest;
  count: number;
  selectedCpIds: string[];
  examProfileId?: unknown;
  difficultyPreset?: unknown;
  difficultyDistribution?: unknown;
  forwardLegacyExamProfile?: boolean;
  difficultyFilterSupported?: boolean;
};

export type UniversalStudioComputeResult = {
  questions: Array<Record<string, unknown>>;
  generationContexts: Array<Record<string, unknown>>;
  quantPlan: Awaited<ReturnType<typeof generateProfiledQuantBatch>>["plan"] | null;
  engineId: QuestionStudioEngineId;
  packageId: string;
};

function fail(code: string, message: string): never {
  throw Object.assign(new Error(message), { statusCode: 400, code });
}

export function validateUniversalStudioComputeInput(input: UniversalStudioComputeInput) {
  if (!input || typeof input !== "object" || !input.request || typeof input.request !== "object") {
    fail("INVALID_UNIVERSAL_GENERATION_REQUEST", "Generation input is required");
  }
  if (!Number.isInteger(input.count) || input.count < 1 || input.count > 50 ||
      input.request.count !== input.count) {
    fail("INVALID_UNIVERSAL_GENERATION_COUNT", "Question count must be between 1 and 50");
  }
  const packageId = input.request.packageId;
  if (!packageId || typeof packageId !== "string") {
    fail("UNREGISTERED_UNIVERSAL_PACKAGE", "A registered package is required for remote generation");
  }
  const pkg = listQuestionStudioPackages().find((item) => item.packageId === packageId);
  if (!pkg || !pkg.enabled) {
    fail("UNREGISTERED_UNIVERSAL_PACKAGE", "The requested Question Studio package is unavailable");
  }
  if (input.request.engineId !== pkg.engineId) {
    fail("UNIVERSAL_ENGINE_PACKAGE_MISMATCH", "The selected package does not belong to the requested engine");
  }
  if (!input.request.language || !pkg.supportedLanguages.includes(input.request.language)) {
    fail("UNSUPPORTED_UNIVERSAL_LANGUAGE", "This package does not support the selected language");
  }
  // Some source-governed packages (e.g. NUM-001/NUM-002) cannot filter
  // by Easy/Medium/Hard. The canonical admin route passes undefined for
  // these packages, while mixed generation is an allowed planning request.
  // Do not demand a difficulty filter or synthesize one for the worker.
  const requestedDifficulty = input.request.difficulty;
  if (pkg.difficultyFilterSupported === false) {
    if (requestedDifficulty !== undefined && requestedDifficulty !== "Mixed") {
      fail("DIFFICULTY_FILTER_UNSUPPORTED", `Package ${pkg.packageId} does not support difficulty filtering`);
    }
  } else if (typeof requestedDifficulty !== "string" ||
      !["Easy", "Medium", "Hard", "Mixed"].includes(requestedDifficulty)) {
    fail("INVALID_UNIVERSAL_DIFFICULTY", "Invalid Question Studio difficulty");
  }
  const selected = input.selectedCpIds;
  if (!Array.isArray(selected) || selected.length > input.count ||
      selected.length > 50 || selected.some((x) => typeof x !== "string") ||
      new Set(selected).size !== selected.length) {
    fail("INVALID_UNIVERSAL_CP_SELECTION", "Invalid selected CP list");
  }
  const allowed = new Set([...pkg.cpIds, ...(pkg.dynamicCandidateCpIds ?? [])]);
  if (selected.some((cp) => !allowed.has(cp))) {
    fail("INVALID_UNIVERSAL_CP_SELECTION", "The selected CP does not belong to this package");
  }
  if (input.request.canonicalProblemId &&
      (selected.length !== 1 || input.request.canonicalProblemId !== selected[0])) {
    fail("INVALID_UNIVERSAL_CP_SELECTION", "Canonical CP and selected CP list disagree");
  }
  if (pkg.supportedRuntimeModes?.length &&
      input.request.runtimeMode &&
      !pkg.supportedRuntimeModes.includes(input.request.runtimeMode)) {
    fail("UNSUPPORTED_UNIVERSAL_RUNTIME_MODE", "Invalid runtime mode for this package");
  }
  if (pkg.supportedDifficulties?.length && input.request.difficulty !== "Mixed" &&
      !pkg.supportedDifficulties.includes(input.request.difficulty as "Easy" | "Medium" | "Hard") &&
      pkg.difficultyFilterSupported !== false) {
    fail("UNSUPPORTED_UNIVERSAL_DIFFICULTY", "This package does not support the selected difficulty");
  }
  if (input.forwardLegacyExamProfile !== undefined && typeof input.forwardLegacyExamProfile !== "boolean") {
    fail("INVALID_UNIVERSAL_GENERATION_REQUEST", "Invalid exam profile selector");
  }
  if (input.difficultyFilterSupported !== undefined && typeof input.difficultyFilterSupported !== "boolean") {
    fail("INVALID_UNIVERSAL_GENERATION_REQUEST", "Invalid difficulty filter selector");
  }
  return pkg;
}

export async function executeUniversalStudioCompute(
  input: UniversalStudioComputeInput,
): Promise<UniversalStudioComputeResult> {
  const pkg = validateUniversalStudioComputeInput(input);
  const request = input.request;
  const generatedQuestions: Array<Record<string, unknown>> = [];
  const generationContexts: Array<Record<string, unknown>> = [];
  let quantPlan: UniversalStudioComputeResult["quantPlan"] = null;

  if (pkg.engineId === "quant-v4") {
    const result = await generateProfiledQuantBatch({
      request,
      count: input.count,
      selectedCpIds: input.selectedCpIds,
      examProfileId: input.examProfileId,
      difficultyPreset: input.difficultyPreset,
      difficultyDistribution: input.difficultyDistribution,
      // Derive source authority from the registered package, not a remote
      // caller's optional field. This preserves source labels for Number System
      // even when an authorized staging request omits the explicit override.
      forwardLegacyExamProfile: input.forwardLegacyExamProfile === true || pkg.packageId === "NUM-001" || pkg.packageId === "SAP",
      difficultyFilterSupported: pkg.difficultyFilterSupported !== false
        && input.difficultyFilterSupported !== false,
      generateCandidateBatch: (candidateRequest) =>
        generateQuestionStudioQuestions({ ...candidateRequest, engineId: "quant-v4" }),
    });
    quantPlan = result.plan;
    generatedQuestions.push(...result.questions);
    generationContexts.push(...result.generationContexts.map((item) => ({
      cpId: item.cpId, difficulty: item.difficulty, context: item.context,
    })));
  } else {
    const parts = input.selectedCpIds.length
      ? input.selectedCpIds.map((cpId, index) => ({
          cpId,
          count: Math.floor(input.count / input.selectedCpIds.length) +
            (index < input.count % input.selectedCpIds.length ? 1 : 0),
        })).filter((x) => x.count > 0)
      : [{ cpId: undefined, count: input.count }];

    for (const [index, item] of parts.entries()) {
      const cpSeed = request.seed && item.cpId
        ? `${request.seed}:cp:${item.cpId}:slot:${index + 1}`
        : request.seed;
      const result = await generateQuestionStudioQuestions({
        ...request, count: item.count, seed: cpSeed, canonicalProblemId: item.cpId,
      });
      if (result.engineId !== pkg.engineId ||
          !Array.isArray(result.questions) || result.questions.length !== item.count) {
        throw Object.assign(new Error("Question Studio returned an incomplete or mismatched batch"), {
          statusCode: 422, code: "UNIVERSAL_GENERATION_BATCH_MISMATCH",
        });
      }
      const context = { ...(result.generationContext ?? {}), engineId: result.engineId };
      generationContexts.push({ cpId: item.cpId, context });
      for (const question of result.questions) {
        generatedQuestions.push({
          ...question,
          canonicalProblemId: typeof question.canonicalProblemId === "string" && question.canonicalProblemId.trim()
            ? question.canonicalProblemId : item.cpId,
          selectedCpId: item.cpId,
          engineId: result.engineId,
          generationContext: context,
        });
      }
    }
  }
  if (generatedQuestions.length !== input.count) {
    throw Object.assign(new Error("Generated question count did not match the request"), {
      statusCode: 422, code: "UNIVERSAL_GENERATION_BATCH_MISMATCH",
    });
  }
  return { questions: generatedQuestions, generationContexts, quantPlan, engineId: pkg.engineId, packageId: pkg.packageId };
}
