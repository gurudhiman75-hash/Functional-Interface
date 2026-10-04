import {
  TSD_001_QUESTION_STUDIO_CP_IDS,
  TSD_001_QUESTION_STUDIO_LANGUAGES,
  generateTsd001QuestionStudioBatch,
} from "../quant-v4/topics/Arithmetic/subtopics/TimeSpeedDistance/TSD-001/question-studio-adapter";
import {
  TSD_CP007_QUESTION_STUDIO_COMPATIBLE_COMBINATIONS_PER_LOCALE,
  previewTsdCp007QuestionStudioReview,
} from "../quant-v4/topics/Arithmetic/subtopics/TimeSpeedDistance/TSD-002/cp007/question-studio-review-adapter";
import {
  TSD_CP008_QUESTION_STUDIO_COMPATIBLE_COMBINATIONS_PER_LOCALE,
  previewTsdCp008QuestionStudioReview,
} from "../quant-v4/topics/Arithmetic/subtopics/TimeSpeedDistance/TSD-002/cp008/question-studio-review-adapter";
import {
  TSD_CP009_QUESTION_STUDIO_COMPATIBLE_COMBINATIONS_PER_LOCALE,
  TSD_CP009_QUESTION_STUDIO_DETERMINISTIC_REVIEW_COMBINATIONS,
  previewTsdCp009QuestionStudioReview,
} from "../quant-v4/topics/Arithmetic/subtopics/TimeSpeedDistance/TSD-002/cp009/question-studio-review-adapter";
import { TSD_CANONICAL_LIFECYCLE } from "../quant-v4/topics/Arithmetic/subtopics/TimeSpeedDistance/canonical-lifecycle";
import {
  QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1,
} from "./standard-lifecycle";
import type {
  QuestionStudioDifficulty,
  QuestionStudioGeneratedQuestion,
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioLanguage,
  QuestionStudioPackageDefinition,
} from "./engine-types";

const TSD_002_REGISTERED_CP_IDS = [
  "TSD-CP-007",
  "TSD-CP-008",
  "TSD-CP-009",
] as const;

const TSD_STUDIO_LOCKED_CP_IDS = [
  "TSD-CP-010",
  "TSD-CP-011",
  "TSD-CP-012",
] as const;

type Tsd002RegisteredCpId = (typeof TSD_002_REGISTERED_CP_IDS)[number];

function normalizeSelector(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function normalizeLanguage(value: unknown): QuestionStudioLanguage {
  const language = String(value ?? "en").trim().toLowerCase();
  if (language === "en" || language === "hi" || language === "pa") return language;
  throw new Error(`TSD Question Studio does not support language '${language}'.`);
}

function normalizeDifficulty(value: unknown): QuestionStudioDifficulty | undefined {
  const text = String(value ?? "").trim().toLowerCase();
  if (!text || text === "mixed") return undefined;
  if (text === "easy") return "Easy";
  if (text === "medium" || text === "moderate") return "Medium";
  if (text === "hard") return "Hard";
  return undefined;
}

function legacyDifficulty(value: unknown): "EASY" | "MEDIUM" | undefined {
  const difficulty = normalizeDifficulty(value);
  if (!difficulty) return undefined;
  if (difficulty === "Hard") {
    throw new Error("TSD-002 CP007-CP009 frozen review surfaces support Easy and Medium only.");
  }
  return difficulty.toUpperCase() as "EASY" | "MEDIUM";
}

function inferCheckpointFromQl(value: unknown): string | undefined {
  const match = String(value ?? "").trim().toUpperCase().match(/^TSD-QL-(\d{3})$/u);
  if (!match) return undefined;
  const ordinal = Number(match[1]);
  if (ordinal >= 58 && ordinal <= 70) return "TSD-CP-005";
  if (ordinal >= 71 && ordinal <= 83) return "TSD-CP-006";
  if (ordinal >= 84 && ordinal <= 94) return "TSD-CP-007";
  if (ordinal >= 95 && ordinal <= 103) return "TSD-CP-008";
  if (ordinal >= 104 && ordinal <= 114) return "TSD-CP-009";
  if (ordinal >= 115 && ordinal <= 124) return "TSD-CP-010";
  if (ordinal >= 125 && ordinal <= 131) return "TSD-CP-011";
  if (ordinal >= 132 && ordinal <= 142) return "TSD-CP-012";
  return undefined;
}

function requestedCheckpoint(request: QuestionStudioGenerationRequest): string | undefined {
  const explicit = String(request.canonicalProblemId ?? "").trim().toUpperCase();
  const inferred = inferCheckpointFromQl(request.questionLanguageId);
  if (explicit && inferred && explicit !== inferred) {
    throw new Error(
      `${String(request.questionLanguageId)} is owned by ${inferred}, not ${explicit}.`,
    );
  }
  return explicit || inferred;
}

export function isTsdEngineRequest(request: QuestionStudioGenerationRequest): boolean {
  const packageId = normalizeSelector(request.packageId);
  if (packageId) return packageId === "tsd 001" || packageId === "tsd 002";

  const checkpoint = String(request.canonicalProblemId ?? "").trim().toUpperCase();
  if (/^TSD-CP-\d{3}$/u.test(checkpoint)) return true;
  if (inferCheckpointFromQl(request.questionLanguageId)) return true;

  const topic = normalizeSelector(request.topic);
  const subtopic = normalizeSelector(request.subtopic);
  const selectors = new Set([
    "time speed distance",
    "time speed and distance",
    "time speed distance tsd",
    "tsd",
  ]);
  return selectors.has(topic) || (topic === "arithmetic" && selectors.has(subtopic));
}

function lifecycleFields() {
  const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
  return {
    lifecycleId: lifecycle.lifecycleId,
    lifecycleStage: lifecycle.stage,
    reviewSurfaceRequired: lifecycle.reviewSurfaceRequired,
    manualApprovalRequired: lifecycle.manualApprovalRequired,
    questionBankStatus: lifecycle.questionBankStatus,
    questionBankWritable: lifecycle.questionBankWritable,
    testEligibility: lifecycle.testEligibility,
    testEligible: lifecycle.testEligible,
    mockTestEligible: lifecycle.mockTestEligible,
    publiclyPublishable: lifecycle.publiclyPublishable,
    automaticStudentPublication: lifecycle.automaticStudentPublication,
    productionReleaseAuthorized: lifecycle.productionReleaseAuthorized,
  } as const;
}

export function tsd001EnginePackage(): QuestionStudioPackageDefinition {
  return {
    engineId: "quant-v4",
    packageId: "TSD-001",
    subject: "Quantitative Aptitude",
    topic: "Arithmetic",
    subtopic: "Time, Speed & Distance",
    label: "Time, Speed & Distance · Core review",
    enabled: true,
    cpIds: [...TSD_001_QUESTION_STUDIO_CP_IDS],
    supportedLanguages: [...TSD_001_QUESTION_STUDIO_LANGUAGES],
    supportedDifficulties: ["Easy", "Medium", "Hard"],
    runtimeMode: "QUESTION_STUDIO_REVIEW_ACTIVE",
    supportedRuntimeModes: ["QUESTION_STUDIO_REVIEW_ACTIVE"],
    ...lifecycleFields(),
    metadata: {
      canonicalLifecycle: "FROZEN",
      studioCheckpointIds: [...TSD_001_QUESTION_STUDIO_CP_IDS],
      frozenButNotStudioCheckpointIds: ["TSD-CP-003", "TSD-CP-004"],
      permanentQlRange: "TSD-QL-058..TSD-QL-083",
      sourceAuthority: "TSD-001 frozen multilingual CP005-CP006 authorities",
    },
  };
}

export function tsd002EnginePackage(): QuestionStudioPackageDefinition {
  return {
    engineId: "quant-v4",
    packageId: "TSD-002",
    subject: "Quantitative Aptitude",
    topic: "Arithmetic",
    subtopic: "Time, Speed & Distance",
    label: "Time, Speed & Distance · Applied motion review",
    enabled: true,
    cpIds: [...TSD_002_REGISTERED_CP_IDS],
    supportedLanguages: ["en", "hi", "pa"],
    supportedDifficulties: ["Easy", "Medium"],
    difficultyFilterSupported: true,
    runtimeMode: "TSD-002-FROZEN-REGISTERED-REVIEW",
    supportedRuntimeModes: ["TSD-002-FROZEN-REGISTERED-REVIEW"],
    ...lifecycleFields(),
    metadata: {
      canonicalLifecycle: "FROZEN",
      studioCheckpointIds: [...TSD_002_REGISTERED_CP_IDS],
      frozenStudioLockedCheckpointIds: [...TSD_STUDIO_LOCKED_CP_IDS],
      cp007CompatibleCombinationsPerLocale:
        TSD_CP007_QUESTION_STUDIO_COMPATIBLE_COMBINATIONS_PER_LOCALE,
      cp008CompatibleCombinationsPerLocale:
        TSD_CP008_QUESTION_STUDIO_COMPATIBLE_COMBINATIONS_PER_LOCALE,
      cp009CompatibleCombinationsPerLocale:
        TSD_CP009_QUESTION_STUDIO_COMPATIBLE_COMBINATIONS_PER_LOCALE,
      cp009DeterministicMultilingualCombinations:
        TSD_CP009_QUESTION_STUDIO_DETERMINISTIC_REVIEW_COMBINATIONS,
      sourceAuthority: "TSD-002 frozen multilingual CP007-CP009 authorities",
    },
  };
}

function flattenExplanation(value: unknown): string {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return "";
  const record = value as Record<string, unknown>;
  const parts: string[] = [];
  for (const key of ["whatAsked", "method", "formula"]) {
    if (typeof record[key] === "string" && String(record[key]).trim()) {
      parts.push(String(record[key]).trim());
    }
  }
  for (const key of ["givens", "steps", "solution"]) {
    if (Array.isArray(record[key])) {
      parts.push(...(record[key] as unknown[]).map(String).map((item) => item.trim()).filter(Boolean));
    }
  }
  for (const key of ["shortcut", "conclusion", "finalAnswer"]) {
    const item = record[key];
    if (typeof item === "string" && item.trim()) parts.push(item.trim());
    else if (item && typeof item === "object") {
      const nested = item as Record<string, unknown>;
      if (Array.isArray(nested.steps)) {
        parts.push(...nested.steps.map(String).map((line) => line.trim()).filter(Boolean));
      }
    }
  }
  return parts.join("\n\n");
}

function withReviewLifecycle(
  source: Readonly<Record<string, unknown>>,
  checkpointId: string,
  packageId: "TSD-001" | "TSD-002",
): QuestionStudioGeneratedQuestion {
  const options = Array.isArray(source.options) ? [...source.options] : [];
  const correctIndex = Number(source.correctIndex ?? source.correct ?? -1);
  const answer = source.answer ?? (correctIndex >= 0 ? options[correctIndex] : undefined);
  const qlId = String(source.qlId ?? source.questionLanguageId ?? "").trim();
  const language = normalizeLanguage(source.language);
  const difficulty = normalizeDifficulty(source.difficultyBand ?? source.difficulty) ?? "Medium";
  const explanation = flattenExplanation(source.explanation);
  const validationSource =
    source.validation && typeof source.validation === "object"
      ? source.validation as Record<string, unknown>
      : {};

  return {
    ...source,
    text: String(source.text ?? source.stem ?? ""),
    stem: String(source.stem ?? source.text ?? ""),
    options,
    correct: correctIndex,
    correctIndex,
    answer,
    canonicalAnswer: source.canonicalAnswer ?? {
      kind: "symbolic",
      value: answer,
      display: answer,
      rendered: answer,
      rounding: "exact",
    },
    explanation,
    packageExplanation:
      source.packageExplanation
      ?? (source.explanation && typeof source.explanation === "object" ? source.explanation : undefined),
    difficulty,
    difficultyLabel: difficulty,
    patternId: packageId,
    packageId,
    section: "Quant",
    topic: "Arithmetic",
    subtopic: "Time, Speed & Distance",
    generationBackend: "quant-v4",
    canonicalProblemId: checkpointId,
    qlId: qlId || undefined,
    questionLanguageId: qlId || String(source.questionLanguageId ?? "") || undefined,
    language,
    validation: {
      ...validationSource,
      valid: validationSource.valid !== false,
    },
    ...lifecycleFields(),
    reviewOnly: true,
    publicReleaseAuthorized: false,
    metadata: {
      ...(source.metadata && typeof source.metadata === "object"
        ? source.metadata as Record<string, unknown>
        : {}),
      packageId,
      canonicalProblemId: checkpointId,
      qlId: qlId || undefined,
      lifecycleStage: "REVIEW_ONLY",
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
    },
  };
}

function enrichResult(
  source: Readonly<Record<string, unknown>>,
  packageId: "TSD-001" | "TSD-002",
  fallbackCheckpoint: string,
): QuestionStudioGenerationResult {
  const rawQuestions = Array.isArray(source.questions)
    ? source.questions as Readonly<Record<string, unknown>>[]
    : [];
  const questions = rawQuestions.map((question) => withReviewLifecycle(
    question,
    String(question.canonicalProblemId ?? fallbackCheckpoint),
    packageId,
  ));
  return {
    ...source,
    generationContext: {
      ...(source.generationContext && typeof source.generationContext === "object"
        ? source.generationContext as Record<string, unknown>
        : {}),
      engineId: "quant-v4",
      generationDomain: "quant-v4",
      packageId,
      ...lifecycleFields(),
      reviewOnly: true,
      publicReleaseAuthorized: false,
    },
    questions,
  };
}

function previewTsd002Checkpoint(
  checkpointId: Tsd002RegisteredCpId,
  request: QuestionStudioGenerationRequest,
  seed: string,
): Readonly<Record<string, unknown>> {
  const language = normalizeLanguage(request.language);
  const difficulty = legacyDifficulty(request.difficulty);
  const qlId = String(request.questionLanguageId ?? "").trim() || undefined;
  const common = {
    language,
    difficulty,
    qlId: qlId as never,
    seed,
    count: 1,
  };

  if (checkpointId === "TSD-CP-007") {
    return previewTsdCp007QuestionStudioReview(common as never) as unknown as Readonly<Record<string, unknown>>;
  }
  if (checkpointId === "TSD-CP-008") {
    return previewTsdCp008QuestionStudioReview(common as never) as unknown as Readonly<Record<string, unknown>>;
  }
  return previewTsdCp009QuestionStudioReview(common as never) as unknown as Readonly<Record<string, unknown>>;
}

function checkpointForTsd002(
  request: QuestionStudioGenerationRequest,
): Tsd002RegisteredCpId | undefined {
  const checkpoint = requestedCheckpoint(request);
  if (!checkpoint) return undefined;
  if ((TSD_STUDIO_LOCKED_CP_IDS as readonly string[]).includes(checkpoint)) {
    throw new Error(
      `${checkpoint} content is frozen but remains Question Studio locked by its canonical lifecycle authority.`,
    );
  }
  if (!(TSD_002_REGISTERED_CP_IDS as readonly string[]).includes(checkpoint)) {
    throw new Error(`${checkpoint} is not registered under the TSD-002 review package.`);
  }
  return checkpoint as Tsd002RegisteredCpId;
}

async function generateTsd002Batch(
  request: QuestionStudioGenerationRequest,
): Promise<QuestionStudioGenerationResult> {
  const count = Math.min(50, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const fixedCheckpoint = checkpointForTsd002(request);
  const checkpoints = fixedCheckpoint
    ? [fixedCheckpoint]
    : [...TSD_002_REGISTERED_CP_IDS];
  const batchSeed = request.seed
    ?? `question-studio:TSD-002:${normalizeLanguage(request.language)}:${Date.now()}`;

  const questions: QuestionStudioGeneratedQuestion[] = [];
  const fingerprints = new Set<string>();
  const maxAttempts = Math.max(60, count * 24);

  for (let attempt = 0; attempt < maxAttempts && questions.length < count; attempt += 1) {
    const checkpointId = checkpoints[attempt % checkpoints.length]!;
    const itemSeed = `${batchSeed}:${checkpointId}:${attempt}`;
    const preview = previewTsd002Checkpoint(checkpointId, request, itemSeed);
    const raw = Array.isArray(preview.questions)
      ? preview.questions[0] as Readonly<Record<string, unknown>> | undefined
      : undefined;
    if (!raw) continue;

    const normalized = withReviewLifecycle(raw, checkpointId, "TSD-002");
    const fingerprint = [
      checkpointId,
      String(normalized.qlId ?? normalized.questionLanguageId ?? ""),
      String(normalized.stem ?? normalized.text ?? ""),
      JSON.stringify(normalized.options ?? []),
    ].join("|");
    if (fingerprints.has(fingerprint)) continue;
    fingerprints.add(fingerprint);
    questions.push(normalized);
  }

  if (questions.length !== count) {
    throw new Error(
      `TSD-002 could generate only ${questions.length} unique review questions for the requested filters; requested ${count}.`,
    );
  }

  return {
    generationContext: {
      generationDomain: "quant-v4",
      engineId: "quant-v4",
      packageId: "TSD-002",
      seed: batchSeed,
      timestamp: Date.now(),
      checkpointId: fixedCheckpoint ?? "MIXED",
      registeredCheckpointIds: [...TSD_002_REGISTERED_CP_IDS],
      frozenStudioLockedCheckpointIds: [...TSD_STUDIO_LOCKED_CP_IDS],
      runtimeMode: "TSD-002-FROZEN-REGISTERED-REVIEW",
      ...lifecycleFields(),
      reviewOnly: true,
      publicReleaseAuthorized: false,
    },
    questions,
  };
}

export async function generateTsdEngineBatch(
  request: QuestionStudioGenerationRequest,
): Promise<QuestionStudioGenerationResult | null> {
  if (!isTsdEngineRequest(request)) return null;

  const packageId = normalizeSelector(request.packageId);
  const checkpoint = requestedCheckpoint(request);
  const inferredPackage = checkpoint && (
    checkpoint === "TSD-CP-005" || checkpoint === "TSD-CP-006"
  )
    ? "TSD-001"
    : checkpoint?.startsWith("TSD-CP-")
      ? "TSD-002"
      : undefined;
  const selectedPackage = packageId === "tsd 001"
    ? "TSD-001"
    : packageId === "tsd 002"
      ? "TSD-002"
      : inferredPackage ?? "TSD-001";

  if (selectedPackage === "TSD-001") {
    if (checkpoint && !TSD_001_QUESTION_STUDIO_CP_IDS.includes(checkpoint as never)) {
      throw new Error(`${checkpoint} is not registered under TSD-001 Question Studio review.`);
    }
    const source = generateTsd001QuestionStudioBatch({
      packageId: "TSD-001",
      canonicalProblemId: checkpoint,
      questionLanguageId: request.questionLanguageId,
      difficulty: request.difficulty,
      language: normalizeLanguage(request.language),
      seed: request.seed,
      count: request.count,
    });
    return enrichResult(
      source as unknown as Readonly<Record<string, unknown>>,
      "TSD-001",
      checkpoint ?? "MIXED",
    );
  }

  return generateTsd002Batch(request);
}

export const TSD_CURRENT_STUDIO_AUTHORITY = Object.freeze({
  registeredPackages: Object.freeze(["TSD-001", "TSD-002"] as const),
  registeredCheckpointIds: Object.freeze([
    ...TSD_001_QUESTION_STUDIO_CP_IDS,
    ...TSD_002_REGISTERED_CP_IDS,
  ]),
  frozenStudioLockedCheckpointIds: Object.freeze([...TSD_STUDIO_LOCKED_CP_IDS]),
  canonicalLifecycle: TSD_CANONICAL_LIFECYCLE,
  reviewOnlyLifecycleId:
    QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1.lifecycleId,
});
