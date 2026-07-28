import { PNL_001_CANONICAL_REVIEW_LIBRARY } from "./question-studio-review.library";

export const PNL_001_ARCHETYPE_ID = "PNL-001" as const;
export const PNL_001_CP_IDS = [
  "PNL-CP-001",
  "PNL-CP-002",
  "PNL-CP-003",
  "PNL-CP-004",
  "PNL-CP-005",
  "PNL-CP-006",
] as const;
export const PNL_001_LANGUAGES = ["en"] as const;

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
  language: Pnl001Language;
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
  if (input.language && input.language !== "en") {
    throw new Error("PNL-001 canonical review runtime currently supports English only.");
  }

  if (input.questionLanguageId) {
    const forced = reviewLibrary.entries[input.questionLanguageId];
    if (!forced) {
      throw new Error(`Unknown PNL-001 question-language ID: ${input.questionLanguageId}`);
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
        (input.difficultyBand ? ` at ${input.difficultyBand} difficulty.` : "."),
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
  const entry = selectReviewEntry(cpId, input);
  const seed = input.seed ?? `${entry.qlId}:canonical-review`;
  const explanationId = `${entry.qlId}-EXPLANATION-V2`;
  const validationChecks = [
    {
      name: "canonical-review-source",
      passed: entry.safety.runtimeMode === "CANONICAL_REVIEW",
      message: "Question is sourced from the approved canonical review library.",
    },
    {
      name: "four-unique-options",
      passed:
        entry.options.length === 4 &&
        new Set(entry.options).size === 4 &&
        entry.options[entry.correctIndex] === entry.answer,
      message: "Question has four unique options and one reviewed keyed answer.",
    },
    {
      name: "question-bank-safety",
      passed:
        entry.safety.questionBankStatus === "NOT_STORED" &&
        entry.safety.testEligibility === "INELIGIBLE" &&
        entry.safety.publiclyPublishable === false,
      message: "Canonical review output is not eligible for Question Bank, tests or publication.",
    },
  ];
  const validation = {
    valid: validationChecks.every((check) => check.passed),
    checks: validationChecks,
  };

  return {
    archetypeId: PNL_001_ARCHETYPE_ID,
    canonicalProblemId: cpId,
    questionId: `${entry.qlId}:canonical-review`,
    questionLanguageId: entry.qlId,
    explanationId,
    language: "en" as const,
    difficultyBand: entry.difficulty,
    stem: entry.stem,
    answer: entry.answer,
    options: [...entry.options],
    correctIndex: entry.correctIndex,
    parameters: {
      archetypeId: PNL_001_ARCHETYPE_ID,
      canonicalProblemId: cpId,
      questionLanguageId: entry.qlId,
      explanationId,
      language: "en" as const,
      difficultyBand: entry.difficulty,
      taskKind: entry.solveMode,
      answerType: "TEXT",
      representation: entry.representation,
      contextFamily: entry.contextFamily,
      seed,
      runtimeMode: entry.safety.runtimeMode,
      reviewStatus: entry.safety.reviewStatus,
      questionBankStatus: entry.safety.questionBankStatus,
      testEligibility: entry.safety.testEligibility,
      publiclyPublishable: entry.safety.publiclyPublishable,
    },
    solver: {
      answer: entry.answer,
      numericAnswer: null,
      answerType: "TEXT",
      evidence: {
        source: "PNL-001 Editorial V2 canonical review",
        solveMode: entry.solveMode,
        reviewedCorrectIndex: entry.correctIndex,
      },
      mathJax: {},
    },
    reasoningGraph: {
      graphId: `${entry.qlId}-canonical-review-graph`,
      nodes: [
        { id: "solve-mode", label: "Solve mode", value: entry.solveMode },
        { id: "answer", label: "Reviewed answer", value: entry.answer },
        { id: "safety", label: "Runtime status", value: entry.safety.runtimeMode },
      ],
    },
    explanation: {
      explanationId,
      lines: entry.explanation.split(/\n{2,}/),
    },
    traceability: {
      questionId: `${entry.qlId}:canonical-review`,
      canonicalProblemId: cpId,
      questionLanguageId: entry.qlId,
      explanationId,
      difficultyBand: entry.difficulty,
      taskKind: entry.solveMode,
      answerType: "TEXT",
      representation: entry.representation,
      contextFamily: entry.contextFamily,
      generationMode: "CANONICAL_REVIEW",
      source: "PNL-001 Editorial V2",
      seed,
      reviewStatus: entry.safety.reviewStatus,
      questionBankStatus: entry.safety.questionBankStatus,
      testEligibility: entry.safety.testEligibility,
      publiclyPublishable: entry.safety.publiclyPublishable,
    },
    validation,
    mathJax: {},
  } as const;
}
