import { equalRational, formatRational, rational, type Rational } from "../../../shared/exact-rational";
import { valueNode, type BracketStyle, type ExpressionNode } from "../../../shared/expression-ast";
import type { EvaluationTraceStep } from "../../../shared/exact-evaluator";
import { SAP_CP001_WAVE02_PROTOTYPE_IDS, type SapAnswerSemantic, type SapCp001Wave02Explanation, type SapCp001Wave02MisconceptionId, type SapCp001Wave02PrototypeId, type SapCp001Wave02QuestionState, type SapDifficulty, type SapTaskDirection } from "./types";

export const LIFECYCLE = Object.freeze({
  permanentQlId: null,
  maturity: "EXECUTABLE_DISCOVERY_PROOF" as const,
  reviewStatus: "UNREVIEWED_DISCOVERY_CANDIDATE" as const,
  questionBankStatus: "NOT_STORED" as const,
  testEligibility: "INELIGIBLE" as const,
  active: false as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
});

export const SOURCE_ANCESTRY = Object.freeze([
  "SAP-001-SAP-002-END-TO-END-DESIGN.md",
  "SAP-SOURCE-AND-OWNERSHIP-AUDIT.md",
  "SAP-OPEN-QL-DISCOVERY-AND-FREEZE-PROTOCOL.md",
  "SAP-CP-001 Wave 01 exact-expression runtime authority",
  "uploaded simplification and quantitative-aptitude source fixtures",
]);

export class DeterministicRng {
  private state: number;

  constructor(seedText: string) {
    let state = 2166136261;
    for (let index = 0; index < seedText.length; index += 1) {
      state ^= seedText.charCodeAt(index);
      state = Math.imul(state, 16777619);
    }
    this.state = state >>> 0 || 0x9e3779b9;
  }

  next(): number {
    let value = this.state;
    value ^= value << 13;
    value ^= value >>> 17;
    value ^= value << 5;
    this.state = value >>> 0;
    return this.state;
  }

  int(minimum: number, maximum: number): number {
    return minimum + (this.next() % (maximum - minimum + 1));
  }
}

export interface OptionDraft {
  readonly value: string;
  readonly isCorrect: boolean;
  readonly misconceptionId: SapCp001Wave02MisconceptionId | null;
  readonly analysis: string;
}

export interface BuiltState {
  readonly taskDirection: SapTaskDirection;
  readonly answerSemantic: SapAnswerSemantic;
  readonly stem: string;
  readonly questionState: SapCp001Wave02QuestionState;
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly canonicalTrace: readonly EvaluationTraceStep[];
  readonly optionDrafts: readonly OptionDraft[];
  readonly explanation: Omit<SapCp001Wave02Explanation, "finalAnswer" | "commonTraps">;
  readonly hiddenState: Readonly<Record<string, string | number | boolean>>;
  readonly difficultyEvidence: readonly string[];
  readonly fingerprintParts: readonly string[];
}

export function assertPositiveInteger(value: number, label: string): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${label} must be a positive integer.`);
  }
}

export function difficultyForSeed(seed: number): SapDifficulty {
  return (["EASY", "MEDIUM", "HARD"] as const)[(seed - 1) % 3]!;
}

export function prototypeIndex(prototypeId: SapCp001Wave02PrototypeId): number {
  return SAP_CP001_WAVE02_PROTOTYPE_IDS.indexOf(prototypeId);
}

export function integerNode(value: number | bigint): ExpressionNode {
  return valueNode(typeof value === "bigint" ? value : BigInt(value));
}

export function bracketStyleForSeed(seed: number): BracketStyle {
  return (["ROUND", "SQUARE", "CURLY"] as const)[seed % 3]!;
}

export function comparisonText(comparison: -1 | 0 | 1): string {
  if (comparison > 0) return "Left expression > Right expression";
  if (comparison < 0) return "Left expression < Right expression";
  return "Left expression = Right expression";
}

export function rotateDrafts(
  correct: Omit<OptionDraft, "isCorrect">,
  wrong: readonly Omit<OptionDraft, "isCorrect">[],
  correctIndex: number,
): readonly OptionDraft[] {
  const drafts: OptionDraft[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === correctIndex) {
      drafts.push(Object.freeze({ ...correct, isCorrect: true }));
    } else {
      drafts.push(Object.freeze({ ...wrong[wrongIndex]!, isCorrect: false }));
      wrongIndex += 1;
    }
  }
  return Object.freeze(drafts);
}

export function numericWrongValues(answer: Rational): readonly Rational[] {
  const candidates = [
    rational(answer.numerator + answer.denominator, answer.denominator),
    rational(answer.numerator - answer.denominator, answer.denominator),
    rational(-answer.numerator, answer.denominator),
    rational(answer.numerator + 2n * answer.denominator, answer.denominator),
    rational(answer.numerator - 2n * answer.denominator, answer.denominator),
    rational(answer.numerator * 2n, answer.denominator),
  ];
  const result: Rational[] = [];
  for (const candidate of candidates) {
    if (!equalRational(candidate, answer) && !result.some((entry) => equalRational(entry, candidate))) {
      result.push(candidate);
    }
    if (result.length === 3) break;
  }
  if (result.length !== 3) throw new Error("Unable to create three distinct numeric distractors.");
  return Object.freeze(result);
}

export function buildNumericDrafts(answer: Rational, correctIndex: number): readonly OptionDraft[] {
  const wrong = numericWrongValues(answer);
  return rotateDrafts(
    {
      value: formatRational(answer),
      misconceptionId: null,
      analysis: "This matches the exact canonical result and the independently evaluated substituted expression.",
    },
    wrong.map((value, index) => ({
      value: formatRational(value),
      misconceptionId: index === 0
        ? "FINAL_ARITHMETIC_PLUS_ONE" as const
        : index === 1
          ? "FINAL_ARITHMETIC_MINUS_ONE" as const
          : "REVERSED_SUBTRACTION_SIGN" as const,
      analysis: index === 0
        ? "This is one unit above the exact value."
        : index === 1
          ? "This is one unit below the exact value."
          : "This reverses the final sign or direction of subtraction.",
    })),
    correctIndex,
  );
}
