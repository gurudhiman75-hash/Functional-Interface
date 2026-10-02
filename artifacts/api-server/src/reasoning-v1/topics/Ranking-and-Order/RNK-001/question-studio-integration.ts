import type {
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioPackageDefinition,
} from "../../../../question-studio/engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../../../../question-studio/standard-lifecycle";
import {
  generateRnkCp001PermanentQuestion,
} from "./RNK-CP-001/cp001-permanent-runtime";
import {
  generateRnkCp002PermanentQuestion,
} from "./RNK-CP-002/cp002-permanent-runtime";
import {
  generateRnkCp003PermanentQuestion,
} from "./RNK-CP-003/cp003-permanent-runtime";
import {
  buildRnkCp004PermanentRuntime,
} from "./RNK-CP-004/cp004-permanent-runtime-v1";
import {
  buildRnkCp005PermanentRuntime,
} from "./RNK-CP-005/cp005-permanent-runtime-v1";
import {
  buildRnkCp006PermanentRuntime,
} from "./RNK-CP-006/cp006-permanent-runtime-v1";
import {
  buildRnkCp007PermanentRuntime,
} from "./RNK-CP-007/cp007-permanent-runtime-v1";

export const RNK001_STANDARD_QUESTION_STUDIO_PACKAGE_ID = "RNK-001" as const;

const RNK_QL_IDS = Object.freeze(
  Array.from(
    { length: 42 },
    (_, index) => `RNK-QL-${String(index + 1).padStart(3, "0")}`,
  ),
);

const RNK_CP_RANGES = Object.freeze([
  { checkpointId: "RNK-CP-001", first: 1, last: 9 },
  { checkpointId: "RNK-CP-002", first: 10, last: 17 },
  { checkpointId: "RNK-CP-003", first: 18, last: 26 },
  { checkpointId: "RNK-CP-004", first: 27, last: 35 },
  { checkpointId: "RNK-CP-005", first: 36, last: 38 },
  { checkpointId: "RNK-CP-006", first: 39, last: 41 },
  { checkpointId: "RNK-CP-007", first: 42, last: 42 },
] as const);

export const RNK001_STANDARD_QUESTION_STUDIO_PACKAGE_V1: QuestionStudioPackageDefinition = {
  engineId: "reasoning-v1",
  packageId: RNK001_STANDARD_QUESTION_STUDIO_PACKAGE_ID,
  subject: "Reasoning",
  topic: "Ranking and Order",
  subtopic: "Ranking and Order",
  label: "Reasoning · Ranking and Order · RNK-001",
  enabled: true,
  cpIds: RNK_CP_RANGES.map((entry) => entry.checkpointId),
  qlIds: [...RNK_QL_IDS],
  supportedLanguages: ["en"],
  supportedDifficulties: ["Easy", "Medium", "Hard"],
  difficultyFilterSupported: true,
  runtimeMode: "review-only",
  supportedRuntimeModes: ["review-only"],
  ...QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1,
  metadata: {
    permanentQlRange: "RNK-QL-001..042",
    permanentQlCount: 42,
    nextAvailableQl: "RNK-QL-043",
    checkpointCount: 7,
    englishContentFrozen: true,
    multilingualHumanReviewPending: true,
    deterministicGeneration: true,
  },
};

type Difficulty = "Easy" | "Medium" | "Hard";
type SourceQuestion = Record<string, any>;

let cp004Cache: readonly SourceQuestion[] | undefined;
let cp005Cache: readonly SourceQuestion[] | undefined;
let cp006Cache: readonly SourceQuestion[] | undefined;
let cp007Cache: readonly SourceQuestion[] | undefined;

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

function qlNumber(qlId: string): number {
  const match = /^RNK-QL-(\d{3})$/u.exec(qlId);
  return match ? Number(match[1]) : Number.NaN;
}

function checkpointForQl(qlId: string): string {
  const number = qlNumber(qlId);
  const owner = RNK_CP_RANGES.find(
    (entry) => number >= entry.first && number <= entry.last,
  );
  if (!owner) throw new Error("Unknown RNK-001 QL " + qlId);
  return owner.checkpointId;
}

function qlsForCheckpoint(checkpointId: string): string[] {
  const owner = RNK_CP_RANGES.find(
    (entry) => entry.checkpointId === checkpointId,
  );
  if (!owner) throw new Error("Unknown RNK-001 checkpoint " + checkpointId);
  return Array.from(
    { length: owner.last - owner.first + 1 },
    (_, offset) =>
      `RNK-QL-${String(owner.first + offset).padStart(3, "0")}`,
  );
}

function normalizeDifficulty(value: unknown): Difficulty | undefined {
  const normalized = text(value).toLowerCase();
  if (!normalized || normalized === "mixed") return undefined;
  if (normalized === "easy" || normalized === "e") return "Easy";
  if (normalized === "medium" || normalized === "moderate" || normalized === "m") {
    return "Medium";
  }
  if (normalized === "hard" || normalized === "h") return "Hard";
  return undefined;
}

function optionText(value: unknown): string {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }
  if (!value || typeof value !== "object") return String(value ?? "");
  const option = value as Record<string, unknown>;
  for (const key of ["label", "value", "text", "answer", "display"]) {
    const candidate = option[key];
    if (typeof candidate === "string" || typeof candidate === "number") {
      return String(candidate);
    }
  }
  return JSON.stringify(value);
}

function sourceDifficulty(source: SourceQuestion): Difficulty | undefined {
  return normalizeDifficulty(
    source.difficulty
    ?? source.difficultyBand
    ?? source.reviewMetadata?.difficultyModel?.label
    ?? source.candidateRuntimeProfile?.difficulty,
  );
}

function sourceQlId(source: SourceQuestion): string | undefined {
  return text(
    source.qlId
    ?? source.permanentQlId
    ?? source.permanentProfile?.permanentQlId
    ?? source.reviewMetadata?.permanentProfile?.permanentQlId,
  ).toUpperCase() || undefined;
}

function correctIndexFor(source: SourceQuestion, options: readonly string[]): number {
  const explicit = Number(
    source.correctIndex
    ?? source.answerIndex,
  );
  if (Number.isInteger(explicit) && explicit >= 0 && explicit < options.length) {
    return explicit;
  }

  const answerKey = text(source.answerKey);
  if (answerKey && Array.isArray(source.options)) {
    const byKey = source.options.findIndex(
      (option: unknown) =>
        Boolean(option)
        && typeof option === "object"
        && text((option as Record<string, unknown>).answerKey) === answerKey,
    );
    if (byKey >= 0) return byKey;
  }

  const answer = String(source.answer ?? "");
  const byAnswer = options.indexOf(answer);
  if (byAnswer >= 0) return byAnswer;

  throw new Error("RNK-001 source question has no resolvable correct option.");
}

function stringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => {
      if (typeof entry === "string" || typeof entry === "number") return String(entry);
      if (entry && typeof entry === "object") {
        const object = entry as Record<string, unknown>;
        return text(object.text ?? object.label ?? object.statement ?? object.expression);
      }
      return "";
    })
    .filter(Boolean);
}

function explanationText(source: SourceQuestion): string {
  if (typeof source.visibleExplanation === "string") return source.visibleExplanation;
  if (typeof source.explanation === "string") return source.explanation;
  if (Array.isArray(source.explanation)) {
    return source.explanation.map(String).filter(Boolean).join("\n");
  }

  const explanation =
    source.visibleExplanation && typeof source.visibleExplanation === "object"
      ? source.visibleExplanation
      : source.explanation && typeof source.explanation === "object"
        ? source.explanation
        : {};

  const object = explanation as Record<string, unknown>;
  const pieces = [
    text(object.ruleStatement),
    text(object.coreConcept),
    ...stringList(object.steps),
    ...stringList(object.working),
    text(object.conclusion),
  ].filter(Boolean);

  if (pieces.length) return pieces.join("\n\n");

  const fallback = [
    ...stringList(source.clues),
    text(source.answer),
  ].filter(Boolean);
  return fallback.length
    ? fallback.join("\n\n")
    : "The ranking constraints lead uniquely to the stated answer.";
}

function learnerStem(source: SourceQuestion): string {
  const stem = text(source.stem ?? source.text);
  const instruction = text(source.instruction);
  const clues = stringList(source.clues);
  return [instruction, ...clues, stem].filter(Boolean).join("\n");
}

function bankForCheckpoint(checkpointId: string): readonly SourceQuestion[] {
  if (checkpointId === "RNK-CP-004") {
    cp004Cache ??= buildRnkCp004PermanentRuntime() as readonly SourceQuestion[];
    return cp004Cache;
  }
  if (checkpointId === "RNK-CP-005") {
    cp005Cache ??= buildRnkCp005PermanentRuntime() as readonly SourceQuestion[];
    return cp005Cache;
  }
  if (checkpointId === "RNK-CP-006") {
    cp006Cache ??= buildRnkCp006PermanentRuntime() as readonly SourceQuestion[];
    return cp006Cache;
  }
  if (checkpointId === "RNK-CP-007") {
    cp007Cache ??= buildRnkCp007PermanentRuntime() as readonly SourceQuestion[];
    return cp007Cache;
  }
  return [];
}

function generateSource(
  qlId: string,
  seed: number,
  requestedDifficulty: Difficulty | undefined,
): SourceQuestion {
  const number = qlNumber(qlId);
  const checkpointId = checkpointForQl(qlId);

  let candidates: SourceQuestion[];
  if (number <= 9) {
    candidates = Array.from({ length: requestedDifficulty ? 96 : 1 }, (_, offset) =>
      generateRnkCp001PermanentQuestion(qlId as any, seed + offset) as unknown as SourceQuestion,
    );
  } else if (number <= 17) {
    candidates = Array.from({ length: requestedDifficulty ? 96 : 1 }, (_, offset) =>
      generateRnkCp002PermanentQuestion(qlId as any, seed + offset) as unknown as SourceQuestion,
    );
  } else if (number <= 26) {
    candidates = Array.from({ length: requestedDifficulty ? 96 : 1 }, (_, offset) =>
      generateRnkCp003PermanentQuestion(qlId as any, seed + offset) as unknown as SourceQuestion,
    );
  } else {
    const bank = bankForCheckpoint(checkpointId).filter(
      (question) => sourceQlId(question) === qlId,
    );
    const start = bank.length ? seed % bank.length : 0;
    candidates = bank.length
      ? Array.from({ length: bank.length }, (_, offset) =>
          bank[(start + offset) % bank.length]!,
        )
      : [];
  }

  const compatible = requestedDifficulty
    ? candidates.find((question) => sourceDifficulty(question) === requestedDifficulty)
    : candidates[0];

  if (!compatible) {
    throw new Error(
      qlId
      + " cannot produce a "
      + String(requestedDifficulty ?? "valid")
      + " English instance without relabelling difficulty.",
    );
  }
  return compatible;
}

function requestedScope(request: QuestionStudioGenerationRequest): {
  explicit: boolean;
  qlPool: string[];
} {
  const selectors = [
    request.patternId,
    request.canonicalProblemId,
    request.questionLanguageId,
  ]
    .map((value) => text(value).toUpperCase())
    .filter(Boolean)
    .filter((value) => value !== RNK001_STANDARD_QUESTION_STUDIO_PACKAGE_ID);

  if (!selectors.length) {
    return { explicit: false, qlPool: [...RNK_QL_IDS] };
  }

  const qlId = selectors.find((value) => value.startsWith("RNK-QL-"));
  const checkpointId = selectors.find((value) => value.startsWith("RNK-CP-"));

  if (qlId) {
    if (!RNK_QL_IDS.includes(qlId)) {
      throw new Error("Unknown RNK-001 QL selector " + qlId);
    }
    if (checkpointId && checkpointForQl(qlId) !== checkpointId) {
      throw new Error(
        qlId + " is owned by " + checkpointForQl(qlId) + ", not " + checkpointId,
      );
    }
    return { explicit: true, qlPool: [qlId] };
  }

  if (checkpointId) {
    return { explicit: true, qlPool: qlsForCheckpoint(checkpointId) };
  }

  throw new Error("Unknown RNK-001 selector " + selectors[0]);
}

export function isRnk001QuestionStudioRequest(
  request: QuestionStudioGenerationRequest,
): boolean {
  const packageId = text(request.packageId).toUpperCase();
  if (packageId) return packageId === RNK001_STANDARD_QUESTION_STUDIO_PACKAGE_ID;

  const selectors = [
    request.patternId,
    request.canonicalProblemId,
    request.questionLanguageId,
  ]
    .map((value) => text(value).toUpperCase())
    .filter(Boolean);
  if (selectors.some((value) => value.startsWith("RNK-QL-") || value.startsWith("RNK-CP-"))) {
    return true;
  }

  const topic = text(request.topic).toLowerCase();
  const subtopic = text(request.subtopic).toLowerCase();
  return topic === "ranking and order"
    || subtopic === "ranking and order"
    || topic === "ranking & order"
    || subtopic === "ranking & order";
}

export async function generateRnk001QuestionStudioBatch(
  request: QuestionStudioGenerationRequest,
): Promise<QuestionStudioGenerationResult> {
  const language = request.language ?? "en";
  if (language !== "en") {
    throw new Error(
      "RNK-001 Question Studio activation is English-only until Hindi/Punjabi human review is approved.",
    );
  }

  const count = Math.min(50, Math.max(1, Math.floor(Number(request.count ?? 5) || 5)));
  const difficulty = normalizeDifficulty(request.difficulty);
  const baseSeed = text(request.seed) || "rnk001-question-studio-v1";
  const scope = requestedScope(request);
  const start = hash(baseSeed + ":ql-start") % scope.qlPool.length;
  const questions: Record<string, unknown>[] = [];

  for (let index = 0; index < count; index += 1) {
    const qlCandidates = Array.from(
      { length: scope.qlPool.length },
      (_, offset) => scope.qlPool[(start + index + offset) % scope.qlPool.length]!,
    );

    let resolved:
      | {
          qlId: string;
          source: SourceQuestion;
          numericSeed: number;
        }
      | undefined;
    let lastError: Error | undefined;

    for (const qlId of qlCandidates) {
      const numericSeed = hash(baseSeed + ":" + qlId + ":" + index);
      try {
        resolved = {
          qlId,
          source: generateSource(qlId, numericSeed, difficulty),
          numericSeed,
        };
        break;
      } catch (error) {
        const failure = error instanceof Error ? error : new Error(String(error));
        if (scope.explicit && scope.qlPool.length === 1) throw failure;
        lastError = failure;
      }
    }

    if (!resolved) {
      throw lastError ?? new Error(
        "RNK-001 could not produce a source-backed question for the requested difficulty.",
      );
    }

    const { qlId, source, numericSeed } = resolved;
    const checkpointId = checkpointForQl(qlId);
    const options = Array.isArray(source.options)
      ? source.options.map(optionText)
      : [];
    if (options.length !== 4 || new Set(options).size !== 4) {
      throw new Error(qlId + " did not expose four unique learner options.");
    }
    const correctIndex = correctIndexFor(source, options);
    const answer = String(source.answer ?? options[correctIndex] ?? "");
    const actualDifficulty = sourceDifficulty(source) ?? difficulty ?? "Medium";
    const stem = learnerStem(source);

    questions.push({
      ...QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1,
      id: `RNK-001:${qlId}:${numericSeed}:en`,
      questionId: `RNK-001:${qlId}:${numericSeed}:en`,
      packageId: RNK001_STANDARD_QUESTION_STUDIO_PACKAGE_ID,
      patternId: qlId,
      qlId,
      cpId: checkpointId,
      checkpointId,
      subject: "Reasoning",
      topic: "Ranking and Order",
      subtopic: "Ranking and Order",
      language: "en",
      locale: "en-IN",
      stem,
      text: stem,
      options,
      correctIndex,
      correct: correctIndex,
      answer,
      canonicalAnswer: answer,
      explanation: explanationText(source),
      difficulty: actualDifficulty,
      difficultyLabel: actualDifficulty,
      generationSeed: String(numericSeed),
      numericSeed,
      reviewOnly: true,
      readOnly: true,
      productionReleased: false,
      questionStudioDiscoverable: true,
      questionStudioGenerationEnabled: true,
      questionBankWritable: false,
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
      manualApprovalRequired: true,
      traceability: {
        chapterId: "RNK-001",
        checkpointId,
        qlId,
        englishContentFrozen: true,
        sourceFingerprint:
          source.mathematicalFingerprint
          ?? source.permanentRuntimeFingerprint
          ?? source.candidateRuntimeFingerprint
          ?? source.normalizedLearnerFingerprint
          ?? null,
      },
    });
  }

  return {
    questions,
    generationContext: {
      ...QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1,
      engineId: "reasoning-v1",
      packageId: RNK001_STANDARD_QUESTION_STUDIO_PACKAGE_ID,
      language: "en",
      requestedDifficulty: difficulty ?? "Mixed",
      seed: baseSeed,
      count,
      permanentQlRange: "RNK-QL-001..042",
      permanentQlCount: 42,
      nextAvailableQl: "RNK-QL-043",
      checkpointCount: 7,
      explicitScopeApplied: scope.explicit,
      englishContentFrozen: true,
      multilingualHumanReviewPending: true,
      reviewOnly: true,
      questionBankWritable: false,
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
    },
  };
}
