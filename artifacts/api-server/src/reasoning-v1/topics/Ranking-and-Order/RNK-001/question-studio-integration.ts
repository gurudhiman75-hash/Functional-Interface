import type {
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioPackageDefinition,
} from "../../../../question-studio/engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../../../../question-studio/standard-lifecycle";
import {
  RNK_CP001_PERMANENT_QL_IDS,
  generateRnkCp001PermanentQuestion,
} from "./RNK-CP-001/cp001-permanent-runtime";
import {
  RNK_CP002_PERMANENT_QL_IDS,
  generateRnkCp002PermanentQuestion,
} from "./RNK-CP-002/cp002-permanent-runtime";
import {
  RNK_CP003_PERMANENT_QL_IDS,
  generateRnkCp003PermanentQuestion,
} from "./RNK-CP-003/cp003-permanent-runtime";
import {
  RNK_CP004_PERMANENT_AUTHORITY_ASSIGNMENTS,
  buildRnkCp004PermanentRuntime,
} from "./RNK-CP-004/cp004-permanent-runtime-v1";
import {
  RNK_CP005_PERMANENT_AUTHORITY_ASSIGNMENTS,
  buildRnkCp005PermanentRuntime,
} from "./RNK-CP-005/cp005-permanent-runtime-v1";
import {
  RNK_CP006_PERMANENT_AUTHORITY_ASSIGNMENTS,
  buildRnkCp006PermanentRuntime,
} from "./RNK-CP-006/cp006-permanent-runtime-v1";
import {
  RNK_CP007_PERMANENT_QL_ID,
  buildRnkCp007PermanentRuntime,
} from "./RNK-CP-007/cp007-permanent-runtime-v1";

export const RNK001_QUESTION_STUDIO_PACKAGE_ID_V1 = "RNK-001" as const;
export const RNK001_QUESTION_STUDIO_RUNTIME_MODE_V1 = "review-only" as const;
export const RNK001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1 =
  "RNK-001-ENGLISH-FREEZE-QUESTION-STUDIO-ACTIVATION-2026-10-02" as const;

const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;

const CP_IDS = [
  "RNK-CP-001",
  "RNK-CP-002",
  "RNK-CP-003",
  "RNK-CP-004",
  "RNK-CP-005",
  "RNK-CP-006",
  "RNK-CP-007",
] as const;

const QL_IDS = [
  ...RNK_CP001_PERMANENT_QL_IDS,
  ...RNK_CP002_PERMANENT_QL_IDS,
  ...RNK_CP003_PERMANENT_QL_IDS,
  ...RNK_CP004_PERMANENT_AUTHORITY_ASSIGNMENTS.map((entry) => entry.qlId),
  ...RNK_CP005_PERMANENT_AUTHORITY_ASSIGNMENTS.map((entry) => entry.qlId),
  ...RNK_CP006_PERMANENT_AUTHORITY_ASSIGNMENTS.map((entry) => entry.qlId),
  RNK_CP007_PERMANENT_QL_ID,
] as const;

type RnkDifficulty = "EASY" | "MEDIUM" | "HARD";
type SourceQuestion = Record<string, any>;

let cp004Runtime: readonly SourceQuestion[] | undefined;
let cp005Runtime: readonly SourceQuestion[] | undefined;
let cp006Runtime: readonly SourceQuestion[] | undefined;
let cp007Runtime: readonly SourceQuestion[] | undefined;

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function normalizeCount(value: number | undefined): number {
  if (value == null) return 5;
  if (!Number.isInteger(value) || value < 1 || value > 50) {
    throw new Error("RNK-001 review batches require count between 1 and 50");
  }
  return value;
}

function normalizeLanguage(value: QuestionStudioGenerationRequest["language"]): "en" {
  const language = value ?? "en";
  if (language !== "en") {
    throw new Error(
      "RNK-001 Question Studio activation is English-only until Hindi/Punjabi human product review is frozen.",
    );
  }
  return "en";
}

function normalizeDifficulty(value: unknown): RnkDifficulty | undefined {
  const normalized = text(value).toLowerCase();
  if (!normalized || normalized === "mixed") return undefined;
  if (normalized === "easy") return "EASY";
  if (normalized === "medium" || normalized === "moderate") return "MEDIUM";
  if (normalized === "hard") return "HARD";
  throw new Error(
    `RNK-001 difficulty must be Easy, Medium, Hard or Mixed; received ${String(value)}`,
  );
}

function displayDifficulty(value: RnkDifficulty): "Easy" | "Medium" | "Hard" {
  return value === "EASY" ? "Easy" : value === "MEDIUM" ? "Medium" : "Hard";
}

function normalizedDifficulty(value: unknown): RnkDifficulty | undefined {
  const normalized = text(value).toUpperCase();
  return normalized === "EASY" || normalized === "MEDIUM" || normalized === "HARD"
    ? normalized
    : undefined;
}

function cpForQl(qlId: string): (typeof CP_IDS)[number] {
  const numeric = Number(qlId.slice("RNK-QL-".length));
  if (numeric >= 1 && numeric <= 9) return "RNK-CP-001";
  if (numeric <= 17) return "RNK-CP-002";
  if (numeric <= 26) return "RNK-CP-003";
  if (numeric <= 35) return "RNK-CP-004";
  if (numeric <= 38) return "RNK-CP-005";
  if (numeric <= 41) return "RNK-CP-006";
  if (numeric === 42) return "RNK-CP-007";
  throw new Error(`Unknown RNK-001 permanent QL ${qlId}`);
}

function isQlId(value: string): boolean {
  return (QL_IDS as readonly string[]).includes(value);
}

function isCheckpointId(value: string): boolean {
  return (CP_IDS as readonly string[]).includes(value);
}

function resolveQlPool(request: QuestionStudioGenerationRequest): string[] {
  const selectors = [
    request.patternId,
    request.canonicalProblemId,
    request.questionLanguageId,
  ]
    .map((value) => text(value).toUpperCase())
    .filter(Boolean);

  const qlMatches = [...new Set(selectors.filter(isQlId))];
  const cpMatches = [...new Set(selectors.filter(isCheckpointId))];
  const allowed = new Set<string>([
    RNK001_QUESTION_STUDIO_PACKAGE_ID_V1,
    ...(QL_IDS as readonly string[]),
    ...(CP_IDS as readonly string[]),
  ]);
  const unknown = selectors.find(
    (selector) => selector.startsWith("RNK-") && !allowed.has(selector),
  );
  if (unknown) throw new Error(`Unknown RNK-001 selector ${unknown}`);
  if (qlMatches.length > 1) {
    throw new Error(`Conflicting RNK-001 QL selectors ${qlMatches.join(", ")}`);
  }
  if (cpMatches.length > 1) {
    throw new Error(
      `Conflicting RNK-001 checkpoint selectors ${cpMatches.join(", ")}`,
    );
  }

  const qlId = qlMatches[0];
  const checkpointId = cpMatches[0];
  if (qlId && checkpointId && cpForQl(qlId) !== checkpointId) {
    throw new Error(`${qlId} is owned by ${cpForQl(qlId)}, not ${checkpointId}`);
  }
  if (qlId) return [qlId];
  if (checkpointId) {
    return (QL_IDS as readonly string[]).filter(
      (candidate) => cpForQl(candidate) === checkpointId,
    );
  }
  return [...QL_IDS];
}

function runtimeForCp(checkpointId: string): readonly SourceQuestion[] {
  if (checkpointId === "RNK-CP-004") {
    cp004Runtime ??= buildRnkCp004PermanentRuntime() as readonly SourceQuestion[];
    return cp004Runtime;
  }
  if (checkpointId === "RNK-CP-005") {
    cp005Runtime ??= buildRnkCp005PermanentRuntime() as readonly SourceQuestion[];
    return cp005Runtime;
  }
  if (checkpointId === "RNK-CP-006") {
    cp006Runtime ??= buildRnkCp006PermanentRuntime() as readonly SourceQuestion[];
    return cp006Runtime;
  }
  if (checkpointId === "RNK-CP-007") {
    cp007Runtime ??= buildRnkCp007PermanentRuntime() as readonly SourceQuestion[];
    return cp007Runtime;
  }
  return [];
}

function permanentQlId(question: SourceQuestion): string {
  return String(
    question.qlId
      ?? question.permanentQlId
      ?? question.permanentProfile?.permanentQlId
      ?? question.reviewMetadata?.permanentProfile?.permanentQlId
      ?? "",
  );
}

function generateSourceQuestion(qlId: string, seed: number): SourceQuestion {
  if ((RNK_CP001_PERMANENT_QL_IDS as readonly string[]).includes(qlId)) {
    return generateRnkCp001PermanentQuestion(qlId as any, seed) as unknown as SourceQuestion;
  }
  if ((RNK_CP002_PERMANENT_QL_IDS as readonly string[]).includes(qlId)) {
    return generateRnkCp002PermanentQuestion(qlId as any, seed) as unknown as SourceQuestion;
  }
  if ((RNK_CP003_PERMANENT_QL_IDS as readonly string[]).includes(qlId)) {
    return generateRnkCp003PermanentQuestion(qlId as any, seed) as unknown as SourceQuestion;
  }

  const runtime = runtimeForCp(cpForQl(qlId));
  const matches = runtime.filter((question) => permanentQlId(question) === qlId);
  if (!matches.length) {
    throw new Error(`${qlId} has no frozen source-backed runtime instances.`);
  }
  return matches[seed % matches.length]!;
}

function optionText(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    for (const key of ["label", "text", "value", "answer", "answerKey"]) {
      if (record[key] != null) return String(record[key]);
    }
  }
  return String(value);
}

function correctIndexFor(question: SourceQuestion, options: readonly string[]): number {
  for (const key of ["correctIndex", "answerIndex"]) {
    const value = Number(question[key]);
    if (Number.isInteger(value) && value >= 0 && value < options.length) return value;
  }

  if (question.answerKey != null && Array.isArray(question.options)) {
    const answerKey = String(question.answerKey);
    const byKey = question.options.findIndex(
      (option: unknown) =>
        typeof option === "object"
        && option !== null
        && String((option as Record<string, unknown>).answerKey ?? "") === answerKey,
    );
    if (byKey >= 0) return byKey;
  }

  if (question.answer != null) {
    const answer = String(question.answer);
    const byLabel = options.findIndex((option) => option === answer);
    if (byLabel >= 0) return byLabel;
    if (Array.isArray(question.options)) {
      const byValue = question.options.findIndex(
        (option: unknown) =>
          typeof option === "object"
          && option !== null
          && String((option as Record<string, unknown>).value ?? "") === answer,
      );
      if (byValue >= 0) return byValue;
    }
  }

  throw new Error("RNK-001 source runtime emitted a question without a resolvable correct option.");
}

function explanationText(question: SourceQuestion): string {
  const values: string[] = [];
  const add = (value: unknown): void => {
    if (typeof value === "string" || typeof value === "number") {
      const rendered = String(value).trim();
      if (rendered) values.push(rendered);
      return;
    }
    if (Array.isArray(value)) {
      value.forEach(add);
      return;
    }
    if (!value || typeof value !== "object") return;
    const record = value as Record<string, unknown>;
    for (const key of [
      "mentalPicture",
      "given",
      "keyRule",
      "ruleStatement",
      "lines",
      "steps",
      "stepByStepSolution",
      "resultLine",
      "conclusion",
      "examSpeedShortcut",
    ]) {
      if (record[key] != null) add(record[key]);
    }
  };

  add(question.visibleExplanation);
  add(question.explanation);
  return [...new Set(values)].join("\n\n");
}

function resolveInstance(
  preferredQl: string,
  pool: readonly string[],
  baseSeed: string,
  index: number,
  requestedDifficulty: RnkDifficulty | undefined,
) {
  const candidates = [preferredQl, ...pool.filter((qlId) => qlId !== preferredQl)];
  const attemptLimit = requestedDifficulty ? 180 : 1;

  for (const qlId of candidates) {
    const checkpointId = cpForQl(qlId);

    if (checkpointId >= "RNK-CP-004") {
      const runtime = runtimeForCp(checkpointId)
        .filter((question) => permanentQlId(question) === qlId)
        .filter((question) =>
          !requestedDifficulty
          || normalizedDifficulty(question.difficulty) === requestedDifficulty,
        );
      if (!runtime.length) continue;
      const itemSeed = `${baseSeed}:${qlId}:${index}:frozen-runtime`;
      const numericSeed = hash(itemSeed);
      const generated = runtime[numericSeed % runtime.length]!;
      return { qlId, generated, itemSeed, numericSeed, attempt: 0 };
    }

    for (let attempt = 0; attempt < attemptLimit; attempt += 1) {
      const itemSeed = `${baseSeed}:${qlId}:${index}:attempt:${attempt}`;
      const numericSeed = hash(itemSeed);
      try {
        const generated = generateSourceQuestion(qlId, numericSeed);
        const difficulty = normalizedDifficulty(generated.difficulty);
        if (!difficulty) continue;
        if (!requestedDifficulty || difficulty === requestedDifficulty) {
          return { qlId, generated, itemSeed, numericSeed, attempt };
        }
      } catch {
        continue;
      }
    }
  }

  throw new Error(
    requestedDifficulty
      ? `RNK-001 could not produce a ${displayDifficulty(requestedDifficulty)} instance inside the selected QL/checkpoint scope without relabelling difficulty.`
      : "RNK-001 could not produce a valid deterministic instance for the requested scope.",
  );
}

export function isRnk001QuestionStudioRequest(
  request: QuestionStudioGenerationRequest,
): boolean {
  const packageId = text(request.packageId).toUpperCase();
  if (packageId) return packageId === RNK001_QUESTION_STUDIO_PACKAGE_ID_V1;

  const selectors = [
    request.patternId,
    request.canonicalProblemId,
    request.questionLanguageId,
  ].map((value) => text(value).toUpperCase());
  if (
    selectors.some(
      (selector) =>
        selector.startsWith("RNK-QL-") || selector.startsWith("RNK-CP-"),
    )
  ) {
    return true;
  }

  const topic = text(request.topic).toLowerCase();
  const subtopic = text(request.subtopic).toLowerCase();
  return (
    topic === "ranking and order"
    || topic === "ranking & order"
    || topic === "ranking"
    || subtopic === "ranking and order"
    || subtopic === "ranking & order"
  );
}

export const RNK001_STANDARD_REVIEW_ONLY_PACKAGE_V1: QuestionStudioPackageDefinition = {
  engineId: "reasoning-v1",
  packageId: RNK001_QUESTION_STUDIO_PACKAGE_ID_V1,
  subject: "Reasoning",
  topic: "Ranking and Order",
  subtopic: "Ranking and Order",
  label: "Reasoning · Ranking and Order · RNK-001",
  enabled: true,
  cpIds: [...CP_IDS],
  supportedLanguages: ["en"],
  supportedDifficulties: ["Easy", "Medium", "Hard"],
  difficultyFilterSupported: true,
  runtimeMode: RNK001_QUESTION_STUDIO_RUNTIME_MODE_V1,
  supportedRuntimeModes: [RNK001_QUESTION_STUDIO_RUNTIME_MODE_V1],
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
  metadata: {
    registrationAuthorityId: RNK001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
    permanentQlRange: "RNK-QL-001..042",
    permanentQlCount: QL_IDS.length,
    checkpointCount: CP_IDS.length,
    cp008AdapterCaseletClosure: "ZERO_NEW_QLS",
    nextAvailablePermanentQl: "RNK-QL-043",
    deterministicGeneration: true,
    sourceBackedChapterRoute: true,
    englishContentFreeze: true,
    multilingualProductFinalFreeze: false,
    difficultyCalibrationStatus: "FROZEN_SOURCE_INSTANCE_LABEL",
    reviewOnly: true,
  },
};

export async function generateRnk001QuestionStudioBatch(
  request: QuestionStudioGenerationRequest,
): Promise<QuestionStudioGenerationResult> {
  if (
    request.runtimeMode
    && request.runtimeMode !== RNK001_QUESTION_STUDIO_RUNTIME_MODE_V1
  ) {
    throw new Error(
      `RNK-001 only supports ${RNK001_QUESTION_STUDIO_RUNTIME_MODE_V1} runtime during review`,
    );
  }

  const language = normalizeLanguage(request.language);
  const count = normalizeCount(request.count);
  const requestedDifficulty = normalizeDifficulty(request.difficulty);
  const pool = resolveQlPool(request);
  const baseSeed = text(request.seed) || "rnk001-question-studio-activation-v1";
  const start = hash(`${baseSeed}:ql-start`) % pool.length;
  const questions: Record<string, unknown>[] = [];

  for (let index = 0; index < count; index += 1) {
    const preferredQl = pool[(start + index) % pool.length]!;
    const { qlId, generated, itemSeed, numericSeed, attempt } = resolveInstance(
      preferredQl,
      pool,
      baseSeed,
      index,
      requestedDifficulty,
    );

    const checkpointId = cpForQl(qlId);
    const sourceDifficulty = normalizedDifficulty(generated.difficulty);
    if (!sourceDifficulty) {
      throw new Error(`${qlId} emitted an unsupported difficulty label.`);
    }
    const difficulty = displayDifficulty(sourceDifficulty);
    const optionRecords = Array.isArray(generated.options) ? generated.options : [];
    const options = optionRecords.map(optionText);
    if (options.length < 2) {
      throw new Error(`${qlId} emitted fewer than two answer options.`);
    }
    const correctIndex = correctIndexFor(generated, options);
    const answer = generated.answer ?? options[correctIndex]!;
    const stem = String(generated.stem ?? generated.text ?? "").trim();
    if (!stem) throw new Error(`${qlId} emitted an empty learner stem.`);
    const questionId = `RNK-001:${qlId}:${numericSeed}:en`;

    questions.push({
      ...lifecycle,
      lifecycleStage: lifecycle.stage,
      id: questionId,
      questionId,
      packageId: RNK001_QUESTION_STUDIO_PACKAGE_ID_V1,
      patternId: qlId,
      qlId,
      cpId: checkpointId,
      checkpointId,
      subject: "Reasoning",
      topic: "Ranking and Order",
      subtopic: "Ranking and Order",
      language,
      locale: "en-IN",
      stem,
      text: stem,
      options,
      optionRecords,
      correctIndex,
      correct: correctIndex,
      answer,
      canonicalAnswer: options[correctIndex]!,
      explanation: explanationText(generated),
      packageExplanation: generated.explanation ?? generated.visibleExplanation ?? null,
      difficulty,
      difficultyLabel: difficulty,
      requestedDifficulty: request.difficulty ?? null,
      requestedDifficultyApplied: requestedDifficulty
        ? sourceDifficulty === requestedDifficulty
        : false,
      difficultySearchAttempts: attempt + 1,
      requestedExam: request.exam ?? null,
      examProfileApplied: false,
      generationSeed: itemSeed,
      numericSeed,
      registrationStatus: "REGISTERED_REVIEW_ONLY",
      registrationAuthorityId: RNK001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
      questionStudioDiscoverable: true,
      questionStudioGenerationEnabled: true,
      runtimeRegistered: true,
      reviewOnly: true,
      readOnly: true,
      productionReleased: false,
      sourceLifecycle: generated.lifecycle ?? null,
      traceability: {
        packageId: RNK001_QUESTION_STUDIO_PACKAGE_ID_V1,
        qlId,
        checkpointId,
        sourceSeed: generated.seed ?? numericSeed,
        sourcePrototypeId: generated.prototypeId ?? null,
        sourceAuthorityId:
          generated.authorityId
          ?? generated.permanentProfile?.authorityId
          ?? generated.reviewMetadata?.permanentProfile?.authorityId
          ?? null,
        mathematicalFingerprint:
          generated.mathematicalFingerprint
          ?? generated.permanentRuntimeFingerprint
          ?? generated.learnerFingerprint
          ?? null,
      },
      validation: {
        sourceBacked: true,
        frozenPermanentQl: true,
        difficultyDerivedFromGeneratedInstance: true,
        automaticStudentPublication: false,
      },
    });
  }

  return {
    questions,
    generationContext: {
      ...lifecycle,
      lifecycleStage: lifecycle.stage,
      engineId: "reasoning-v1",
      packageId: RNK001_QUESTION_STUDIO_PACKAGE_ID_V1,
      runtimeMode: RNK001_QUESTION_STUDIO_RUNTIME_MODE_V1,
      registrationStatus: "REGISTERED_REVIEW_ONLY",
      registrationAuthorityId: RNK001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
      permanentQlRange: "RNK-QL-001..042",
      permanentQlCount: QL_IDS.length,
      permanentQlIds: [...QL_IDS],
      cpIds: [...CP_IDS],
      cp008PermanentQlAllocation: 0,
      nextAvailablePermanentQl: "RNK-QL-043",
      language,
      requestedDifficulty: requestedDifficulty
        ? displayDifficulty(requestedDifficulty)
        : "Mixed",
      difficultyFilterApplied: Boolean(requestedDifficulty),
      difficultyCalibrationStatus: "FROZEN_SOURCE_INSTANCE_LABEL",
      englishContentFreeze: true,
      multilingualProductFinalFreeze: false,
      requestedExam: request.exam ?? null,
      examProfileApplied: false,
      seed: baseSeed,
      count,
    },
  };
}
