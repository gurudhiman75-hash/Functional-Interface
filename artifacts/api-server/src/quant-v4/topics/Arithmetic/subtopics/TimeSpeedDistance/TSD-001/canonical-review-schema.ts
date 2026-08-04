import type { TsdCp001GeneratedQuestion } from "./cp001/runtime-types";
import type { TsdCp002GeneratedQuestion } from "./cp002/types";
import { generateFinalAuthorityReview, type TsdFinalReviewRecord } from "./final-authority-review";

export const TSD_CANONICAL_REVIEW_SCHEMA_VERSION = "tsd-review-v1" as const;

export interface TsdCanonicalRational {
  readonly numerator: string;
  readonly denominator: string;
}

export type TsdCanonicalValue =
  | null
  | boolean
  | number
  | string
  | TsdCanonicalRational
  | readonly TsdCanonicalValue[]
  | { readonly [key: string]: TsdCanonicalValue };

export interface TsdCanonicalOptionAudit {
  readonly text: string;
  readonly misconceptionId: string;
  readonly isCorrect: boolean;
  readonly wrongWorking: null;
  readonly applicability: null;
}

export interface TsdCanonicalOptionAnalysis {
  readonly option: "A" | "B" | "C" | "D";
  readonly text: string;
  readonly misconceptionId: string;
  readonly isCorrect: boolean;
  readonly reason: string;
}

export interface TsdCanonicalExplanation {
  readonly concept: string;
  readonly steps: readonly string[];
  readonly shortcut: string | null;
  readonly conclusion: string;
  readonly optionAnalysis: readonly TsdCanonicalOptionAnalysis[];
}

export interface TsdCanonicalReviewRecord {
  readonly schemaVersion: typeof TSD_CANONICAL_REVIEW_SCHEMA_VERSION;
  readonly chapterId: "TSD-001";
  readonly checkpointId: "TSD-CP-001" | "TSD-CP-002";
  readonly chapterArchetypeId: "TSD-001";
  readonly permanentQlId: null;
  readonly solveMode: string;
  readonly representation: string;
  readonly provisionalAuthorityId: string;
  readonly questionLanguageId: string;
  readonly language: "en";
  readonly seed: string;
  readonly difficulty: {
    readonly label: "Easy" | "Medium" | "Hard";
    readonly status: "EDITORIAL_CALIBRATION_REQUIRED";
    readonly featureScore: number;
  };
  readonly stem: string;
  readonly stemMathJax: string;
  readonly input: { readonly [key: string]: TsdCanonicalValue };
  readonly solution: { readonly [key: string]: TsdCanonicalValue };
  readonly answerText: string;
  readonly options: readonly string[];
  readonly correctIndex: number;
  readonly optionAudit: readonly TsdCanonicalOptionAudit[];
  readonly explanation: TsdCanonicalExplanation;
  readonly lifecycle: {
    readonly reviewStatus: "EDITORIAL_REVIEW_REQUIRED";
    readonly englishDecision: "NEEDS_REVISION";
    readonly englishFreezeStatus: "UNFROZEN";
    readonly questionBankStatus: "NOT_STORED";
    readonly testEligibility: "INELIGIBLE";
    readonly publiclyPublishable: false;
  };
  readonly validation: {
    readonly valid: boolean;
    readonly errors: readonly string[];
    readonly warnings: readonly string[];
  };
  readonly sourceTrace: {
    readonly sourceCheckpointId: "TSD-CP-001" | "TSD-CP-002";
    readonly legacyReviewQlId: `TSD-QL-${string}`;
    readonly runtimeSolveMode: string;
    readonly mathematicalFingerprint: string;
  };
}

type SourceQuestion = TsdCp001GeneratedQuestion | TsdCp002GeneratedQuestion;

function decimalString(value: bigint | number | string): string {
  if (typeof value === "bigint") return value.toString();
  if (typeof value === "number") {
    if (!Number.isSafeInteger(value)) throw new Error(`Unsafe rational integer: ${value}`);
    return String(value);
  }
  if (/^-?\d+n$/.test(value)) return value.slice(0, -1);
  if (/^-?\d+$/.test(value)) return value;
  throw new Error(`Invalid rational integer string: ${value}`);
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function canonicalRational(value: unknown): TsdCanonicalRational | null {
  if (!isObject(value)) return null;
  const keys = Object.keys(value).sort();
  if (keys.length !== 2) return null;

  if (keys[0] === "denominator" && keys[1] === "numerator") {
    const numerator = value.numerator;
    const denominator = value.denominator;
    if (
      (typeof numerator === "bigint" || typeof numerator === "number" || typeof numerator === "string")
      && (typeof denominator === "bigint" || typeof denominator === "number" || typeof denominator === "string")
    ) {
      return Object.freeze({
        numerator: decimalString(numerator),
        denominator: decimalString(denominator),
      });
    }
  }

  if (keys[0] === "d" && keys[1] === "n") {
    const numerator = value.n;
    const denominator = value.d;
    if (
      (typeof numerator === "bigint" || typeof numerator === "number" || typeof numerator === "string")
      && (typeof denominator === "bigint" || typeof denominator === "number" || typeof denominator === "string")
    ) {
      return Object.freeze({
        numerator: decimalString(numerator),
        denominator: decimalString(denominator),
      });
    }
  }

  return null;
}

export function canonicalReviewValue(value: unknown): TsdCanonicalValue {
  const rational = canonicalRational(value);
  if (rational) return rational;
  if (value === null) return null;
  if (typeof value === "bigint") return value.toString();
  if (typeof value === "boolean" || typeof value === "number" || typeof value === "string") return value;
  if (Array.isArray(value)) return Object.freeze(value.map(canonicalReviewValue));
  if (isObject(value)) {
    return Object.freeze(Object.fromEntries(
      Object.entries(value)
        .filter(([, child]) => child !== undefined)
        .sort(([first], [second]) => first.localeCompare(second))
        .map(([key, child]) => [key, canonicalReviewValue(child)]),
    ));
  }
  throw new Error(`Unsupported canonical review value: ${String(value)}`);
}

function canonicalInput(sourceQuestion: SourceQuestion): { readonly [key: string]: TsdCanonicalValue } {
  const input = sourceQuestion.input as unknown as Record<string, unknown>;
  return Object.freeze(Object.fromEntries(
    Object.entries(input)
      .filter(([key, value]) => key !== "mode" && key !== "solveMode" && value !== undefined)
      .sort(([first], [second]) => first.localeCompare(second))
      .map(([key, value]) => [key, canonicalReviewValue(value)]),
  ));
}

function canonicalSolution(sourceQuestion: SourceQuestion): { readonly [key: string]: TsdCanonicalValue } {
  return canonicalReviewValue(sourceQuestion.solution) as { readonly [key: string]: TsdCanonicalValue };
}

function stripTierPrefix(value: string): string {
  return value
    .replace(/^📌 Main Rule:\s*/i, "")
    .replace(/^⚡ Exam Speed Trick:\s*/i, "")
    .trim();
}

function canonicalExplanation(sourceQuestion: SourceQuestion): TsdCanonicalExplanation {
  return Object.freeze({
    concept: stripTierPrefix(sourceQuestion.explanation.keyRule),
    steps: Object.freeze([...sourceQuestion.explanation.stepByStepSolution]),
    shortcut: sourceQuestion.explanation.examSpeedShortcut.trim()
      ? stripTierPrefix(sourceQuestion.explanation.examSpeedShortcut)
      : null,
    conclusion: sourceQuestion.explanation.conclusion,
    optionAnalysis: Object.freeze(sourceQuestion.explanation.optionAnalysis.map((entry) => Object.freeze({
      option: entry.option,
      text: entry.text,
      misconceptionId: entry.misconceptionId,
      isCorrect: entry.isCorrect,
      reason: entry.reason.replace(/^[✅⚠️]\uFE0F?\s*/, ""),
    }))),
  });
}

function canonicalOptionAudit(sourceQuestion: SourceQuestion): readonly TsdCanonicalOptionAudit[] {
  return Object.freeze(sourceQuestion.optionAudit.map((entry) => Object.freeze({
    text: entry.text,
    misconceptionId: entry.misconceptionId,
    isCorrect: entry.isCorrect,
    wrongWorking: null,
    applicability: null,
  })));
}

export function canonicalReviewRecord(record: TsdFinalReviewRecord): TsdCanonicalReviewRecord {
  const sourceQuestion = record.sourceQuestion;
  return Object.freeze({
    schemaVersion: TSD_CANONICAL_REVIEW_SCHEMA_VERSION,
    chapterId: "TSD-001",
    checkpointId: record.finalCheckpointId,
    chapterArchetypeId: "TSD-001",
    permanentQlId: null,
    solveMode: record.finalAuthorityKey,
    representation: record.finalRepresentation,
    provisionalAuthorityId: sourceQuestion.provisionalAuthorityId,
    questionLanguageId: record.questionLanguageId,
    language: "en",
    seed: sourceQuestion.seed,
    difficulty: Object.freeze({ ...sourceQuestion.difficulty }),
    stem: sourceQuestion.stem,
    stemMathJax: sourceQuestion.stemMathJax,
    input: canonicalInput(sourceQuestion),
    solution: canonicalSolution(sourceQuestion),
    answerText: sourceQuestion.answerText,
    options: Object.freeze([...sourceQuestion.options]),
    correctIndex: sourceQuestion.correctIndex,
    optionAudit: canonicalOptionAudit(sourceQuestion),
    explanation: canonicalExplanation(sourceQuestion),
    lifecycle: Object.freeze({ ...sourceQuestion.lifecycle }),
    validation: Object.freeze({
      valid: sourceQuestion.validation.valid,
      errors: Object.freeze([...sourceQuestion.validation.errors]),
      warnings: Object.freeze([...sourceQuestion.validation.warnings]),
    }),
    sourceTrace: Object.freeze({
      sourceCheckpointId: record.sourceCheckpointId,
      legacyReviewQlId: record.legacyReviewQlId,
      runtimeSolveMode: sourceQuestion.solveMode,
      mathematicalFingerprint: sourceQuestion.mathematicalFingerprint,
    }),
  });
}

export function generateCanonicalReviewRecords(): readonly TsdCanonicalReviewRecord[] {
  return Object.freeze(generateFinalAuthorityReview().map(canonicalReviewRecord));
}

export function stableCanonicalJson(value: unknown): string {
  return JSON.stringify(value);
}
