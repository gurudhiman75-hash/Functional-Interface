import { PNL_001_CANONICAL_REVIEW_LIBRARY } from "./question-studio-review.library";
import { buildPnl001LocalizedReviewSurface } from "./question-studio-multilingual-review-surface";

export const PNL_001_ARCHETYPE_ID = "PNL-001" as const;
export const PNL_001_CP_IDS = [
  "PNL-CP-001",
  "PNL-CP-002",
  "PNL-CP-003",
  "PNL-CP-004",
  "PNL-CP-005",
  "PNL-CP-006",
] as const;
export const PNL_001_LANGUAGES = ["en", "hi", "pa"] as const;

export type Pnl001CanonicalProblemId = (typeof PNL_001_CP_IDS)[number];
export type Pnl001Language = (typeof PNL_001_LANGUAGES)[number];
export type Pnl001DifficultyBand = "Easy" | "Medium" | "Hard";

export type Pnl001ReviewSafety = Readonly<{
  reviewStatus: "APPROVED_EDITORIAL_CANONICAL";
  questionBankStatus: "NOT_STORED";
  testEligibility: "INELIGIBLE";
  publiclyPublishable: false;
  runtimeMode: "CANONICAL_REVIEW";
}>;

export type Pnl001CanonicalReleasePolicy = Readonly<{
  reviewStatus: "APPROVED_EDITORIAL_CANONICAL";
  questionBankStatus: "WRITABLE";
  testEligibility: "ELIGIBLE";
  publiclyPublishable: true;
  runtimeMode: "CANONICAL_REVIEW";
}>;

export const PNL_001_CANONICAL_RELEASE_POLICY = {
  reviewStatus: "APPROVED_EDITORIAL_CANONICAL",
  questionBankStatus: "WRITABLE",
  testEligibility: "ELIGIBLE",
  publiclyPublishable: true,
  runtimeMode: "CANONICAL_REVIEW",
} as const satisfies Pnl001CanonicalReleasePolicy;

export type Pnl001ReviewEntry = Readonly<{
  qlId: string;
  cpId: Pnl001CanonicalProblemId;
  solveMode: string;
  representation: string;
  contextFamily: string;
  difficulty: Pnl001DifficultyBand;
  stem: string;
  options: readonly [string, string, string, string];
  correctIndex: number;
  answer: string;
  explanation: string;
  safety: Pnl001ReviewSafety;
}>;

type Pnl001ReviewLibrary = Readonly<{
  schemaVersion: 1;
  archetypeId: typeof PNL_001_ARCHETYPE_ID;
  title: "Profit & Loss";
  language: "en";
  runtimeMode: "CANONICAL_REVIEW";
  entryCount: number;
  entries: Readonly<Record<string, Pnl001ReviewEntry>>;
}>;

export type Pnl001ReviewPipelineInput = Readonly<{
  difficultyBand?: Pnl001DifficultyBand;
  language?: Pnl001Language;
  questionLanguageId?: string;
  seed?: string;
}>;

const reviewLibrary = PNL_001_CANONICAL_REVIEW_LIBRARY as Pnl001ReviewLibrary;
const entries = Object.values(reviewLibrary.entries);

function hashSeed(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function selectReviewEntry(
  cpId: Pnl001CanonicalProblemId,
  input: Pnl001ReviewPipelineInput,
) {
  if (input.questionLanguageId) {
    const forced = reviewLibrary.entries[input.questionLanguageId];
    if (!forced) {
      throw new Error(
        `Unknown PNL-001 question-language ID: ${input.questionLanguageId}`,
      );
    }
    if (forced.cpId !== cpId) {
      throw new Error(
        `${input.questionLanguageId} belongs to ${forced.cpId}, not ${cpId}.`,
      );
    }
    return forced;
  }

  const eligible = entries.filter(
    (entry) =>
      entry.cpId === cpId &&
      (!input.difficultyBand || entry.difficulty === input.difficultyBand),
  );
  if (!eligible.length) {
    throw new Error(
      `No PNL-001 canonical review entries match ${cpId}` +
        (input.difficultyBand
          ? ` at ${input.difficultyBand} difficulty.`
          : "."),
    );
  }

  const seed = input.seed ?? `${cpId}:canonical-review`;
  return eligible[hashSeed(seed) % eligible.length]!;
}

export function getPnl001ActiveCanonicalProblemIds() {
  return [...PNL_001_CP_IDS];
}

export function listPnl001CanonicalReviewEntries() {
  return [...entries];
}

export function getPnl001CanonicalReviewEntry(qlId: string) {
  return reviewLibrary.entries[qlId];
}

export function runPnl001ReviewPipeline(
  cpId: Pnl001CanonicalProblemId,
  input: Pnl001ReviewPipelineInput = {},
) {
  if (!PNL_001_CP_IDS.includes(cpId)) {
    throw new Error(`Unknown PNL-001 canonical problem: ${cpId}`);
  }
  const language = input.language ?? "en";
  const entry = selectReviewEntry(cpId, input);
  const surface = buildPnl001LocalizedReviewSurface(entry.qlId, language);
  const seed = input.seed ?? `${entry.qlId}:canonical-review`;
  const explanationId =
    language === "en"
      ? `${entry.qlId}-EXPLANATION-V2`
      : `${entry.qlId}-EXPLANATION-WAVE03-${language.toUpperCase()}`;
  const questionId =
    language === "en"
      ? `${entry.qlId}:canonical-review`
      : `${entry.qlId}:canonical-review:${language}`;
  const validationChecks = [
    {
      name: "canonical-review-source",
      passed: entry.safety.runtimeMode === "CANONICAL_REVIEW",
      message:
        "Question is sourced from the approved canonical review authority.",
    },
    ...surface.validation.checks,
    {
      name: "four-unique-options",
      passed:
        surface.options.length === 4 &&
        new Set(surface.options).size === 4 &&
        surface.options[surface.correctIndex] === surface.answer,
      message:
        "Question has four unique options and one reviewed keyed answer.",
    },
    {
      name: "canonical-source-freeze",
      passed:
        entry.safety.questionBankStatus === "NOT_STORED" &&
        entry.safety.testEligibility === "INELIGIBLE" &&
        entry.safety.publiclyPublishable === false,
      message: "The frozen source library remains immutable review provenance.",
    },
    {
      name: "canonical-production-release-policy",
      passed:
        PNL_001_CANONICAL_RELEASE_POLICY.questionBankStatus === "WRITABLE" &&
        PNL_001_CANONICAL_RELEASE_POLICY.testEligibility === "ELIGIBLE" &&
        PNL_001_CANONICAL_RELEASE_POLICY.publiclyPublishable === true,
      message:
        "Approved canonical output is eligible for Question Bank, tests and publication.",
    },
  ];
  const validation = {
    valid: validationChecks.every((check) => check.passed),
    checks: validationChecks,
  };
  if (!validation.valid) {
    throw new Error(
      `${entry.qlId} ${language}: canonical review package validation failed: ${validationChecks
        .filter((check) => !check.passed)
        .map((check) => check.message)
        .join(" | ")}`,
    );
  }

  const source =
    language === "en"
      ? "PNL-001 Editorial V2 canonical review"
      : "PNL-001 Wave 03 multilingual canonical review";
  return {
    archetypeId: PNL_001_ARCHETYPE_ID,
    canonicalProblemId: cpId,
    questionId,
    questionLanguageId: entry.qlId,
    explanationId,
    language,
    difficultyBand: entry.difficulty,
    stem: surface.stem,
    answer: surface.answer,
    options: [...surface.options],
    correctIndex: surface.correctIndex,
    parameters: {
      archetypeId: PNL_001_ARCHETYPE_ID,
      canonicalProblemId: cpId,
      questionLanguageId: entry.qlId,
      explanationId,
      language,
      difficultyBand: entry.difficulty,
      taskKind: entry.solveMode,
      answerType: "TEXT",
      representation: entry.representation,
      contextFamily: entry.contextFamily,
      seed,
      runtimeMode: PNL_001_CANONICAL_RELEASE_POLICY.runtimeMode,
      reviewStatus: PNL_001_CANONICAL_RELEASE_POLICY.reviewStatus,
      questionBankStatus: PNL_001_CANONICAL_RELEASE_POLICY.questionBankStatus,
      testEligibility: PNL_001_CANONICAL_RELEASE_POLICY.testEligibility,
      publiclyPublishable: PNL_001_CANONICAL_RELEASE_POLICY.publiclyPublishable,
    },
    solver: {
      answer: surface.answer,
      numericAnswer: null,
      answerType: "TEXT",
      evidence: {
        source,
        solveMode: entry.solveMode,
        reviewedCorrectIndex: surface.correctIndex,
        language,
      },
      mathJax: {},
    },
    reasoningGraph: {
      graphId: `${entry.qlId}-canonical-review-${language}-graph`,
      nodes: [
        { id: "solve-mode", label: "Solve mode", value: entry.solveMode },
        { id: "answer", label: "Reviewed answer", value: surface.answer },
        {
          id: "safety",
          label: "Runtime status",
          value: PNL_001_CANONICAL_RELEASE_POLICY.runtimeMode,
        },
      ],
    },
    explanation: {
      explanationId,
      lines: surface.explanation.split(/\n{2,}/),
    },
    traceability: {
      questionId,
      canonicalProblemId: cpId,
      questionLanguageId: entry.qlId,
      explanationId,
      language,
      difficultyBand: entry.difficulty,
      taskKind: entry.solveMode,
      answerType: "TEXT",
      representation: entry.representation,
      contextFamily: entry.contextFamily,
      generationMode: "CANONICAL_REVIEW",
      source,
      seed,
      reviewStatus: PNL_001_CANONICAL_RELEASE_POLICY.reviewStatus,
      questionBankStatus: PNL_001_CANONICAL_RELEASE_POLICY.questionBankStatus,
      testEligibility: PNL_001_CANONICAL_RELEASE_POLICY.testEligibility,
      publiclyPublishable: PNL_001_CANONICAL_RELEASE_POLICY.publiclyPublishable,
    },
    validation,
    mathJax: {},
  } as const;
}
