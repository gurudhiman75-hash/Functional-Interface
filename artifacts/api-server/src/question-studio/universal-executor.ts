// Universal deterministic Question Studio execution. The caller is responsible
// for authenticated admin access and the existing atomic Neon review transaction.
// This module NEVER writes, approves or publishes questions.
import {
  generateQuestionStudioQuestions,
  listQuestionStudioPackages,
} from "./engine-registry";
import { supportsExactNativeReplay } from "./persisted-native-review-format";
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
  if (input.request.nativeGroupedReview !== undefined && typeof input.request.nativeGroupedReview !== "boolean") {
    fail("INVALID_UNIVERSAL_GENERATION_REQUEST", "Invalid native grouped review selector");
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
  // Remembers each English batch request so Hindi/Punjabi can be generated from
  // the very same request when a saved question cannot be replayed from a seed.
  const batchRequests = new Map<string, Record<string, unknown>>();
  const tagBatch = (batchRequest: Record<string, unknown>, questions: Array<Record<string, unknown>>) => {
    const key = `b${batchRequests.size}`;
    batchRequests.set(key, batchRequest);
    return questions.map((question, index) => ({ ...question, nativeCompanionRef: { key, index } }));
  };

  if (pkg.engineId === "quant-v4") {
    // GEO-001 frozen QLs have checkpoint-specific difficulty availability.
    // Mixed exam profiles cannot assign a Hard slot to a CP with no Hard QLs.
    const supportedDifficultiesByCp = pkg.packageId === "GEO-001" && input.selectedCpIds.length
      ? await (async () => {
          const { listGeo001CpSupportedDifficulties } = await import(
            "../quant-v4/topics/AdvancedMathematics/subtopics/Geometry/question-studio-standard-integration"
          );
          return Object.fromEntries(input.selectedCpIds.map(cpId => [cpId, listGeo001CpSupportedDifficulties(cpId)]));
        })()
      : undefined;
    const result = await generateProfiledQuantBatch({
      supportedDifficultiesByCp,
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
      generateCandidateBatch: async (candidateRequest) => {
        const candidate = await generateQuestionStudioQuestions({ ...candidateRequest, engineId: "quant-v4" });
        return Array.isArray(candidate.questions)
          ? { ...candidate, questions: tagBatch({ ...candidateRequest, engineId: "quant-v4" } as Record<string, unknown>, candidate.questions as Array<Record<string, unknown>>) }
          : candidate;
      },
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
      const partRequest = { ...request, count: item.count, seed: cpSeed, canonicalProblemId: item.cpId };
      const result = await generateQuestionStudioQuestions(partRequest);
      if (result.engineId !== pkg.engineId ||
          !Array.isArray(result.questions) || result.questions.length !== item.count) {
        throw Object.assign(new Error("Question Studio returned an incomplete or mismatched batch"), {
          statusCode: 422, code: "UNIVERSAL_GENERATION_BATCH_MISMATCH",
        });
      }
      const context = { ...(result.generationContext ?? {}), engineId: result.engineId };
      generationContexts.push({ cpId: item.cpId, context });
      const taggedQuestions = Array.isArray(result.questions)
        ? tagBatch(partRequest as Record<string, unknown>, result.questions as Array<Record<string, unknown>>)
        : result.questions;
      for (const question of taggedQuestions) {
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
  // Compute-only Universal worker already owns the chapter engines. Prepare
  // the released Hindi/Punjabi variants here, not in the isolated task
  // receiver. The receiver validates fingerprint and answer mapping before
  // saving; none of these candidate variants is automatically approved.
  const normalizedQuestions=generatedQuestions.map(question=>{
    const {nativeReviewSnapshot:_discardedUntrustedSnapshot,...safe}=question;
    return {
      ...safe,
      packageId:typeof safe.packageId==="string"&&safe.packageId.trim()?safe.packageId:pkg.packageId,
      language:typeof safe.language==="string"&&safe.language.trim()?safe.language:request.language,
    };
  });
  const companionCache = new Map<string, Promise<Array<Record<string, unknown>> | null>>();
  const companionBatch = (key: string, language: "hi" | "pa") => {
    const cacheKey = `${key}:${language}`;
    if (!companionCache.has(cacheKey)) {
      const original = batchRequests.get(key);
      companionCache.set(cacheKey, original
        ? generateQuestionStudioQuestions({ ...original, language } as never)
            .then((out) => (Array.isArray(out.questions) ? out.questions as Array<Record<string, unknown>> : null))
            .catch((error) => {
              console.warn("[native-review] companion batch failed", { packageId: pkg.packageId, language, reason: error instanceof Error ? error.message : String(error) });
              return null;
            })
        : Promise.resolve(null));
    }
    return companionCache.get(cacheKey)!;
  };
  // Second attempt: ask for the English question's exact checkpoint and
  // question-language ID in the other language (frozen question banks).
  const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");
  const companionByQuestionLanguage = async (
    key: string, index: number, language: "hi" | "pa", english: Record<string, unknown>,
  ): Promise<Record<string, unknown> | null> => {
    const original = batchRequests.get(key);
    const cpId = text(english.canonicalProblemId || english.selectedCpId || english.cpId);
    const qlId = text(english.questionLanguageId || english.qlId);
    if (!original || !qlId || index > 60) return null;
    const tag = language.toUpperCase();
    for (const candidateQl of [...new Set([qlId, qlId.replace(/-EN\b/, `-${tag}`).replace(/:en\b/, `:${language}`)])]) {
      try {
        const out = await generateQuestionStudioQuestions({
          ...original, language, count: index + 1,
          ...(cpId ? { canonicalProblemId: cpId } : {}), questionLanguageId: candidateQl,
        } as never);
        const found = Array.isArray(out.questions) ? out.questions[index] as Record<string, unknown> | undefined : undefined;
        if (found) return found;
      } catch { /* try the next spelling */ }
    }
    return null;
  };
  const nativeSnapshots=await (await import("./persisted-native-review"))
    .prepareNativeReviewBatch(normalizedQuestions, ["hi", "pa"], async (question) => {
      if (supportsExactNativeReplay(pkg.packageId)) return undefined;
      const ref = question.nativeCompanionRef as { key?: string; index?: number } | undefined;
      if (!ref || typeof ref.key !== "string" || typeof ref.index !== "number") return undefined;
      const [hi, pa] = await Promise.all((["hi", "pa"] as const).map(async (language) => {
        if (!pkg.supportedLanguages.includes(language)) return [] as Array<Record<string, unknown>>;
        const candidates: Array<Record<string, unknown>> = [];
        const aligned = (await companionBatch(ref.key!, language))?.[ref.index!];
        if (aligned) candidates.push(aligned);
        const exact = await companionByQuestionLanguage(ref.key!, ref.index!, language, question);
        if (exact) candidates.push(exact);
        return candidates;
      }));
      const companions: Record<string, Array<Record<string, unknown>>> = {};
      if (hi.length) companions.hi = hi;
      if (pa.length) companions.pa = pa;
      return companions;
    });
  const completeQuestions=normalizedQuestions.map((question,index)=>{
    const { nativeCompanionRef: _ref, ...clean } = question;
    return {
      ...clean,
      ...(nativeSnapshots[index]?{nativeReviewSnapshot:nativeSnapshots[index]}:{}),
    };
  });
  return { questions: completeQuestions, generationContexts, quantPlan, engineId: pkg.engineId, packageId: pkg.packageId };
}
