import {
  INT_CP001_FINAL_QL_IDS,
  type IntCp001FinalQlId,
} from "./cp001-final-registry";
import {
  INT_CP001_APPROVED_ACTIVE_STAGING_PROVIDER_V3,
  generateIntCp001ActiveStagingEnvelope,
  toIntCp001ActiveStagingPreview,
  type IntCp001ActiveStagingEnvelope,
  type IntCp001ActiveStagingLanguage,
} from "./cp001-approved-active-staging-provider-v3-runtime";

export type IntCp001QuestionStudioDifficulty = "Easy" | "Medium" | "Hard";

export interface IntCp001QuestionStudioPreRegistrationRequest {
  packageId?: string;
  archetypeId?: string;
  patternId?: string;
  canonicalProblemId?: string;
  cpId?: string;
  topic?: string;
  subtopic?: string;
  difficulty?: IntCp001QuestionStudioDifficulty | string | number;
  language?: string;
  questionLanguageId?: string;
  seed?: string;
  count?: number;
}

export const INT_CP001_QUESTION_STUDIO_PRE_REGISTRATION_CAPABILITY = Object.freeze({
  id: "INT-001",
  packageId: "INT-001",
  type: "quant-v4",
  section: "Quant",
  domain: "quant",
  topic: "Arithmetic",
  subtopic: "Simple Interest",
  name: "INT-001 Simple Interest Fundamentals and Direct Inverses",
  label: "Simple Interest Fundamentals and Direct Inverses",
  generationDomain: "quant-v4",
  canonicalProblems: [
    {
      id: "INT-CP-001",
      label: "Simple Interest Formula, Rate-Time Scaling and Amount Ratios",
    },
  ] as const,
  qlIds: [...INT_CP001_FINAL_QL_IDS] as readonly IntCp001FinalQlId[],
  supportedDifficulties: ["easy", "medium", "hard"] as const,
  difficultySelection: {
    scope: "PACKAGE_LEVEL_STATE_DERIVED",
    explicitPatternPolicy: "BEST_EFFORT_FAIL_CLOSED",
    maximumSelectorAttemptsPerQl: 96,
  } as const,
  supportedLanguages: ["en", "hi", "pa"] as const,
  enabled: true,
  stagingStatus: "ACTIVE_STAGING",
  registrationStatus: "NOT_REGISTERED",
  questionStudioDiscoverable: false,
  preRegistrationOnly: true,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
});

function normalizeSelector(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function normalizeSeed(value: unknown): string {
  const seed = String(value ?? "").trim();
  if (!seed) {
    throw new Error("INT-001 pre-registration generation requires an explicit deterministic seed.");
  }
  return seed;
}

function normalizeCount(value: unknown): number {
  if (value === undefined) return 1;
  const count = Number(value);
  if (!Number.isInteger(count) || count < 1 || count > 1000) {
    throw new Error("INT-001 pre-registration count must be an integer from 1 to 1000.");
  }
  return count;
}

function normalizeDifficulty(value: unknown): IntCp001QuestionStudioDifficulty | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value === "number" && Number.isFinite(value)) {
    if (value >= 6) return "Hard";
    if (value >= 3) return "Medium";
    return "Easy";
  }
  const normalized = normalizeSelector(value);
  if (normalized === "easy") return "Easy";
  if (normalized === "medium") return "Medium";
  if (normalized === "hard") return "Hard";
  throw new Error(`Unsupported INT-001 difficulty '${String(value)}'.`);
}

function normalizeLanguageValue(value: unknown): IntCp001ActiveStagingLanguage | undefined {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (!normalized) return undefined;
  if (["en", "en-in", "english"].includes(normalized)) return "en";
  if (["hi", "hi-in", "hindi"].includes(normalized)) return "hi";
  if (["pa", "pa-in", "punjabi"].includes(normalized)) return "pa";
  throw new Error(`Unsupported INT-001 language '${String(value)}'.`);
}

function resolveLanguage(request: IntCp001QuestionStudioPreRegistrationRequest): IntCp001ActiveStagingLanguage {
  const direct = normalizeLanguageValue(request.language);
  const questionLanguage = normalizeLanguageValue(request.questionLanguageId);
  if (direct && questionLanguage && direct !== questionLanguage) {
    throw new Error(
      `Conflicting INT-001 language selectors '${String(request.language)}' and '${String(request.questionLanguageId)}'.`,
    );
  }
  return direct ?? questionLanguage ?? "en";
}

function assertPackageSelectors(request: IntCp001QuestionStudioPreRegistrationRequest): void {
  for (const selector of [request.packageId, request.archetypeId]) {
    if (selector !== undefined && String(selector).trim().toUpperCase() !== "INT-001") {
      throw new Error(`Unknown INT-001 package selector '${String(selector)}'.`);
    }
  }

  if (request.topic !== undefined) {
    const topic = normalizeSelector(request.topic);
    if (!["arithmetic", "interest", "simple interest"].includes(topic)) {
      throw new Error(`Unsupported INT-001 topic selector '${String(request.topic)}'.`);
    }
  }

  if (request.subtopic !== undefined) {
    const subtopic = normalizeSelector(request.subtopic);
    if (!["interest", "simple interest"].includes(subtopic)) {
      throw new Error(`Unsupported INT-001 subtopic selector '${String(request.subtopic)}'.`);
    }
  }

  for (const cpSelector of [request.canonicalProblemId, request.cpId]) {
    if (cpSelector !== undefined && String(cpSelector).trim().toUpperCase() !== "INT-CP-001") {
      throw new Error(`Unknown INT-001 canonical problem '${String(cpSelector)}'.`);
    }
  }
}

function resolveQlId(patternId: unknown): IntCp001FinalQlId | undefined {
  const normalized = String(patternId ?? "").trim().toUpperCase();
  if (!normalized || normalized === "INT-001" || normalized === "INT-CP-001") return undefined;
  if ((INT_CP001_FINAL_QL_IDS as readonly string[]).includes(normalized)) {
    return normalized as IntCp001FinalQlId;
  }
  throw new Error(`Unknown INT-001 pattern '${String(patternId)}'.`);
}

function difficultyOf(envelope: IntCp001ActiveStagingEnvelope): IntCp001QuestionStudioDifficulty {
  return normalizeDifficulty(envelope.question.difficulty) ?? "Easy";
}

function selectorSeed(requestedSeed: string, attempt: number): string {
  return attempt === 1
    ? requestedSeed
    : `${requestedSeed}:difficulty-selector:${attempt - 1}`;
}

function generateSelectedEnvelope(request: {
  qlId: IntCp001FinalQlId;
  language: IntCp001ActiveStagingLanguage;
  seed: string;
  difficulty?: IntCp001QuestionStudioDifficulty;
}) {
  for (let attempt = 1; attempt <= 96; attempt += 1) {
    const candidateSeed = selectorSeed(request.seed, attempt);
    const envelope = generateIntCp001ActiveStagingEnvelope({
      qlId: request.qlId,
      language: request.language,
      seed: candidateSeed,
    });
    const actualDifficulty = difficultyOf(envelope);
    if (!request.difficulty || actualDifficulty === request.difficulty) {
      return {
        envelope,
        selectorTrace: {
          selectedQlId: request.qlId,
          requestSeed: request.seed,
          selectorSeed: candidateSeed,
          selectorAttempts: attempt,
          requestedDifficulty: request.difficulty ?? null,
          actualDifficulty,
          providerRequestedSeed: envelope.trace.requestedSeed,
          providerEffectiveSeed: envelope.trace.effectiveSeed,
          providerGenerationAttempts: envelope.trace.generationAttempts,
        },
      };
    }
  }

  throw new Error(
    `${request.qlId}/${request.language}/${request.seed}: unable to satisfy difficulty ${request.difficulty} after 96 deterministic selector attempts.`,
  );
}

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function shuffled<T>(items: readonly T[], seed: string): T[] {
  const result = [...items];
  let state = hash(seed) || 1;
  for (let index = result.length - 1; index > 0; index -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const swapIndex = state % (index + 1);
    [result[index], result[swapIndex]] = [result[swapIndex]!, result[index]!];
  }
  return result;
}

function generatePackageDifficultyEnvelope(request: {
  language: IntCp001ActiveStagingLanguage;
  seed: string;
  difficulty: IntCp001QuestionStudioDifficulty;
}) {
  const candidateQlIds = shuffled(
    INT_CP001_FINAL_QL_IDS,
    `${request.seed}:${request.difficulty}:compatible-ql-order`,
  );
  const failures: string[] = [];

  for (const qlId of candidateQlIds) {
    try {
      return generateSelectedEnvelope({
        qlId,
        language: request.language,
        difficulty: request.difficulty,
        seed: `${request.seed}:${qlId}`,
      });
    } catch (error) {
      failures.push(error instanceof Error ? error.message : String(error));
    }
  }

  throw new Error(
    `INT-001/${request.language}/${request.seed}: no compatible QL produced ${request.difficulty}; ${failures.at(-1) ?? "unknown failure"}`,
  );
}

export function toIntCp001QuestionStudioJsonSafe<T>(value: T): T {
  return JSON.parse(
    JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item),
  ) as T;
}

export function runIntCp001QuestionStudioPreRegistration(
  request: IntCp001QuestionStudioPreRegistrationRequest,
) {
  assertPackageSelectors(request);
  const qlId = resolveQlId(request.patternId);
  const language = resolveLanguage(request);
  const difficulty = normalizeDifficulty(request.difficulty);
  const seed = normalizeSeed(request.seed);
  const count = normalizeCount(request.count);

  const qlOrder = qlId || difficulty
    ? []
    : shuffled(
      INT_CP001_FINAL_QL_IDS,
      `${seed}:INT-001:pre-registration:ql-order`,
    );

  const selected = Array.from({ length: count }, (_unused, index) => {
    if (qlId) {
      return generateSelectedEnvelope({
        qlId,
        language,
        difficulty,
        seed: `${seed}:${qlId}:${index}`,
      });
    }

    if (difficulty) {
      return generatePackageDifficultyEnvelope({
        language,
        difficulty,
        seed: `${seed}:package-difficulty:${index}`,
      });
    }

    const selectedQlId = qlOrder[index % qlOrder.length]!;
    return generateSelectedEnvelope({
      qlId: selectedQlId,
      language,
      seed: `${seed}:${selectedQlId}:${index}`,
    });
  });

  const response = {
    capability: INT_CP001_QUESTION_STUDIO_PRE_REGISTRATION_CAPABILITY,
    generationContext: {
      providerId: INT_CP001_APPROVED_ACTIVE_STAGING_PROVIDER_V3.providerId,
      packageId: "INT-001",
      canonicalProblemId: "INT-CP-001",
      requestedPatternId: qlId ?? null,
      requestedDifficulty: difficulty ?? null,
      difficultySelectionScope: qlId
        ? "EXPLICIT_PATTERN_BEST_EFFORT_FAIL_CLOSED"
        : difficulty
          ? "PACKAGE_LEVEL_STATE_DERIVED"
          : "STATE_DERIVED_UNFILTERED",
      seed,
      count,
      language,
      runtimeMode: INT_CP001_APPROVED_ACTIVE_STAGING_PROVIDER_V3.runtimeMode,
      stagingStatus: "ACTIVE_STAGING",
      registrationStatus: "NOT_REGISTERED",
      questionStudioDiscoverable: false,
      preRegistrationOnly: true,
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
    },
    questionPackages: selected.map((item) => item.envelope.question),
    questions: selected.map((item, index) => ({
      ...toIntCp001ActiveStagingPreview(item.envelope, {
        questionIndex: index + 1,
        questionCount: count,
      }),
      requestedDifficulty: difficulty ?? null,
      selectorTrace: item.selectorTrace,
      preRegistrationOnly: true,
    })),
    envelopes: selected.map((item) => ({
      ...item.envelope,
      selectorTrace: item.selectorTrace,
    })),
  };

  return toIntCp001QuestionStudioJsonSafe(response);
}
