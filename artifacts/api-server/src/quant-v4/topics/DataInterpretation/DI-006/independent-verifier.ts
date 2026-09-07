import { ratioDisplay } from "../DI-001/exact";
import type { Di006Question, Di006QuestionSet } from "./types";

function percent(numerator: number, denominator: number): string {
  if (!Number.isSafeInteger(numerator) || !Number.isSafeInteger(denominator) || numerator < 0 || denominator <= 0) {
    throw new Error("DI-006 independent verifier received an invalid percentage state.");
  }
  const n = BigInt(numerator);
  const d = BigInt(denominator);
  const hundredths = (n * 10_000n + d / 2n) / d;
  const whole = hundredths / 100n;
  const fraction = Number(hundredths % 100n);
  if (fraction === 0) return `${whole}%`;
  if (fraction % 10 === 0) return `${whole}.${fraction / 10}%`;
  return `${whole}.${String(fraction).padStart(2, "0")}%`;
}

function reconstruct(set: Di006QuestionSet): number[] {
  const counts = Array<number>(set.stimulus.categories.length).fill(Number.NaN);
  counts[set.stimulus.directIndex] = set.stimulus.directValue;

  for (const relation of set.stimulus.relations) {
    const source = counts[relation.sourceIndex];
    if (!Number.isFinite(source)) throw new Error("DI-006 independent verifier encountered an unresolved relation dependency.");
    const product = source * relation.numerator;
    if (product % relation.denominator !== 0) throw new Error("DI-006 independent verifier found a non-integral relation.");
    counts[relation.targetIndex] = product / relation.denominator;
  }

  const assigned = counts.reduce((sum, value, index) => index === set.stimulus.remainderIndex ? sum : sum + value, 0);
  counts[set.stimulus.remainderIndex] = set.stimulus.totalCases - assigned;
  return counts;
}

export function independentlySolveDi006Question(set: Di006QuestionSet, question: Di006Question): string {
  const counts = reconstruct(set);
  const e = question.evidence;

  switch (question.kind) {
    case "DERIVE_PRIMARY_FROM_PERCENT":
    case "DERIVE_CHAINED_RELATION":
    case "REMAINDER_FROM_TOTAL":
      return String(counts[e.categoryIndex!]!);

    case "COMBINED_INFERRED_SHARE": {
      const combined = counts[e.firstIndex!]! + counts[e.secondIndex!]!;
      return percent(combined, set.stimulus.totalCases);
    }

    case "REMAINDER_TO_DIRECT_RATIO":
      return ratioDisplay(counts[e.firstIndex!]!, counts[e.secondIndex!]!);
  }
}

export function independentlyVerifyDi006QuestionSet(set: Di006QuestionSet): boolean {
  if (set.stimulus.kind !== "CASELET") return false;
  if (set.stimulus.categories.length !== 5 || set.questions.length !== 5) return false;
  if (set.stimulus.relations.length !== 3) return false;
  const counts = reconstruct(set);
  if (counts.some((value) => !Number.isSafeInteger(value) || value <= 0)) return false;
  if (counts.reduce((sum, value) => sum + value, 0) !== set.stimulus.totalCases) return false;
  if (new Set(set.questions.map((question) => question.kind)).size !== 5) return false;

  return set.questions.every((question) => {
    const expected = independentlySolveDi006Question(set, question);
    return (
      expected === question.answer &&
      question.options.length === set.optionCount &&
      new Set(question.options).size === question.options.length &&
      question.options.filter((option) => option === expected).length === 1 &&
      question.options[question.correctIndex] === expected
    );
  });
}
