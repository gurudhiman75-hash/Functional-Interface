import { auditClsCp005QuestionAgainstExpandedRegistry } from "./source-gap-expanded-audit";
import type { ClsCp005SourceGapRuleId, ClsCp005SourceGapTuple } from "./source-gap-registry";
import {
  generateClsCp005Wave2Question,
  type ClsCp005Wave2PrototypeId,
} from "./wave2-runtime";

const MAX_QUALITY_ATTEMPTS = 240;
const MAX_ANSWER_SCALE_RATIO = 4;

function tupleMaximum(tuple: ClsCp005SourceGapTuple): number {
  return Math.max(...tuple);
}

function tupleTotal(tuple: ClsCp005SourceGapTuple): number {
  return tuple.reduce((sum, value) => sum + value, 0);
}

function ratio(larger: number, smaller: number): number {
  return smaller === 0 ? Number.POSITIVE_INFINITY : larger / smaller;
}

function relativeRatio(left: number, right: number): number {
  return ratio(Math.max(left, right), Math.min(left, right));
}

function median(values: readonly number[]): number {
  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1
    ? sorted[middle]!
    : (sorted[middle - 1]! + sorted[middle]!) / 2;
}

function digitKey(value: number): string {
  return String(Math.abs(value)).split("").sort().join("");
}

function displayTuple(tuple: ClsCp005SourceGapTuple): string {
  return `(${tuple.join(", ")})`;
}

function unorderedTupleKey(tuple: ClsCp005SourceGapTuple): string {
  return [...tuple].sort((left, right) => left - right).join(",");
}

function sameDigitFailureEvidence(tuple: readonly [number, number, number]): string {
  const keys = tuple.map(digitKey);
  const math = keys
    .map((key, index) => `D_${index + 1} = \\{${key.split("").join(",")}\\}`)
    .join(",\\quad ");
  return `${displayTuple(tuple)}: The sorted digit groups are not all identical. \\( ${math} \\) — ❌ Fails rule.`;
}

export type ClsCp005Wave2PresentationAudit = {
  readonly result: "PASS" | "REJECT";
  readonly reasons: readonly string[];
  readonly maximumValueRatio: number;
  readonly tupleTotalRatio: number;
  readonly answerMaximumRatio: number;
  readonly answerTotalRatio: number;
};

export function auditClsCp005Wave2PresentationQuality(question: {
  readonly tuples: readonly ClsCp005SourceGapTuple[];
  readonly correctIndex: number;
}): ClsCp005Wave2PresentationAudit {
  const maxima = question.tuples.map(tupleMaximum);
  const totals = question.tuples.map(tupleTotal);
  const commonMaxima = maxima.filter((_, index) => index !== question.correctIndex);
  const commonTotals = totals.filter((_, index) => index !== question.correctIndex);
  const maximumValueRatio = ratio(Math.max(...maxima), Math.min(...maxima));
  const tupleTotalRatio = ratio(Math.max(...totals), Math.min(...totals));
  const answerMaximumRatio = relativeRatio(maxima[question.correctIndex]!, median(commonMaxima));
  const answerTotalRatio = relativeRatio(totals[question.correctIndex]!, median(commonTotals));
  const reasons: string[] = [];

  if (maximumValueRatio > 20) reasons.push("The displayed options span an excessive maximum-value range.");
  if (tupleTotalRatio > 16) reasons.push("The displayed options span an excessive total-magnitude range.");
  if (answerMaximumRatio > MAX_ANSWER_SCALE_RATIO) reasons.push("The answer is visibly much larger or smaller than the common-option maximum.");
  if (answerTotalRatio > MAX_ANSWER_SCALE_RATIO) reasons.push("The answer has a visibly different total magnitude from the common options.");

  return {
    result: reasons.length === 0 ? "PASS" : "REJECT",
    reasons,
    maximumValueRatio,
    tupleTotalRatio,
    answerMaximumRatio,
    answerTotalRatio,
  };
}

function directionWords(value: string): { source: "first" | "second"; target: "first" | "second" } {
  return value === "FORWARD"
    ? { source: "first", target: "second" }
    : { source: "second", target: "first" };
}

export function renderClsCp005Wave2CoreRule(ruleId: ClsCp005SourceGapRuleId, value: string): string {
  const direction = directionWords(value);
  switch (ruleId) {
    case "PAIR_CONSECUTIVE_PRODUCT_DIRECTION":
      return `Rule: multiply the ${direction.source} number by its next integer to obtain the ${direction.target} number.`;
    case "PAIR_SQUARE_CUBE_DIRECTION":
      return `Rule: the ${direction.source} entry is a square and the ${direction.target} entry is the cube of the same base.`;
    case "PAIR_CONSECUTIVE_CUBES_DIRECTION":
      return `Rule: the ${direction.source} and ${direction.target} entries are cubes of consecutive integers.`;
    case "PAIR_REVERSED_CUBE_DIRECTION":
      return `Rule: cube the ${direction.source} number and reverse that result to obtain the ${direction.target} number.`;
    case "PAIR_CUBE_MINUS_ONE_DIRECTION":
      return `Rule: the ${direction.target} number is one less than the cube of the ${direction.source} number.`;
    case "PAIR_AFFINE_3X_MINUS_10_DIRECTION":
      return `Rule: the ${direction.target} number is three times the ${direction.source} number minus 10.`;
    case "PAIR_AFFINE_7X_PLUS_3_DIRECTION":
      return `Rule: the ${direction.target} number is seven times the ${direction.source} number plus 3.`;
    case "PAIR_AFFINE_6X_PLUS_2_DIRECTION":
      return `Rule: the ${direction.target} number is six times the ${direction.source} number plus 2.`;
    case "PAIR_BOTH_PRIME":
      return "Rule: both numbers in the pair are prime.";
    case "PAIR_DIVISIBILITY_DIRECTION":
      return value === "SECOND_MULTIPLE"
        ? "Rule: the second number is an exact multiple of the first."
        : "Rule: the first number is an exact multiple of the second.";
    case "PAIR_PRIME_ABSOLUTE_DIFFERENCE":
      return "Rule: the absolute difference between the two numbers is prime.";
    case "PAIR_DIGIT_PERMUTATION":
      return "Rule: both numbers contain the same digits in a different order, but are not simple reversals.";
    case "TRIPLE_UNORDERED_ARITHMETIC_SET":
      return "Rule: after arranging the three values from smallest to largest, the two consecutive gaps are equal.";
    case "TRIPLE_ALL_PRIME":
      return "Rule: all three numbers are prime.";
    case "TRIPLE_SAME_DIGIT_MULTISET":
      return "Rule: all three numbers contain the same digits in different orders.";
    case "QUADRUPLE_REDUCED_RATIO_VECTOR":
      return `Rule: after dividing all four values by their common factor, the four positions reduce to the ratio ${value}.`;
  }
}

function clampThreeDigit(value: number): number {
  return Math.max(100, Math.min(999, value));
}

function repairSameDigitOddScale<T extends ReturnType<typeof generateClsCp005Wave2Question>>(
  question: T,
  sourcePrototypeSeed: number,
): T {
  if (
    question.prototypeId !== "CLS-CP005-W2-PROT-015"
    || question.task !== "FIND_ODD_NUMBER_TUPLE"
    || question.intendedRuleId !== "TRIPLE_SAME_DIGIT_MULTISET"
  ) {
    return question;
  }

  const correctIndex = question.correctIndex;
  const commonTuples = question.tuples.filter((_, index) => index !== correctIndex);
  const commonValues = commonTuples.flatMap((tuple) => [...tuple]);
  const anchor = Math.round(median(commonValues));
  const forbidden = new Set(commonTuples.map(unorderedTupleKey));
  const spread = Math.max(36, Math.min(160, Math.round(anchor * 0.28)));

  for (let offset = 0; offset < 1600; offset += 1) {
    const firstDelta = ((sourcePrototypeSeed + offset * 37) % (spread * 2 + 1)) - spread;
    const secondDelta = ((sourcePrototypeSeed * 3 + 17 + offset * 53) % (spread * 2 + 1)) - spread;
    const thirdDelta = ((sourcePrototypeSeed * 5 + 29 + offset * 71) % (spread * 2 + 1)) - spread;
    const replacement = [
      clampThreeDigit(anchor + firstDelta),
      clampThreeDigit(anchor + secondDelta),
      clampThreeDigit(anchor + thirdDelta),
    ] as const;
    if (new Set(replacement).size !== 3) continue;
    if (new Set(replacement.map(digitKey)).size === 1) continue;
    if (forbidden.has(unorderedTupleKey(replacement))) continue;

    const tuples = question.tuples.map((tuple, index) => index === correctIndex ? replacement : tuple);
    const audit = auditClsCp005QuestionAgainstExpandedRegistry({
      task: question.task,
      referenceTuple: null,
      tuples,
      intendedRuleId: question.intendedRuleId,
      intendedRuleValue: question.intendedRuleValue,
    });
    if (audit.result !== "EXPANDED_UNIQUE" || audit.answerIndex !== correctIndex) continue;

    const quality = auditClsCp005Wave2PresentationQuality({ tuples, correctIndex });
    if (quality.result !== "PASS") continue;

    const options = tuples.map(displayTuple);
    const evidenceByOption = question.evidenceByOption.map((evidence, index) =>
      index === correctIndex ? sameDigitFailureEvidence(replacement) : evidence);
    const answer = options[correctIndex]!;
    const commonOptions = options.filter((_, index) => index !== correctIndex);

    return {
      ...question,
      tuples,
      options,
      answer,
      evidenceByOption,
      expandedAmbiguityAudit: audit,
      explanation: {
        ...question.explanation,
        stepByStep: [
          "Apply the same complete rule to every option.",
          `${commonOptions.join(", ")} follow the common relation, while ${answer} fails it.`,
          `Therefore, ${answer} is the odd option.`,
        ],
      },
      metadata: {
        ...question.metadata,
        scaleRepairVersion: "same-digit-triple-v2-near-median" as const,
      },
    } as T;
  }

  return question;
}

export function generateClsCp005Wave2QualityQuestion(
  prototypeId: ClsCp005Wave2PrototypeId,
  seed = 0,
  requestedOptionCount?: 4 | 5,
) {
  if (!Number.isSafeInteger(seed) || seed < 0) {
    throw new Error(`Seed must be a non-negative safe integer: ${seed}`);
  }

  for (let attempt = 0; attempt < MAX_QUALITY_ATTEMPTS; attempt += 1) {
    const sourcePrototypeSeed = seed + attempt * 10_007;
    const generated = generateClsCp005Wave2Question(prototypeId, sourcePrototypeSeed, requestedOptionCount);
    const candidate = repairSameDigitOddScale(generated, sourcePrototypeSeed);
    const presentationQualityAudit = auditClsCp005Wave2PresentationQuality(candidate);
    if (presentationQualityAudit.result !== "PASS") continue;

    return {
      ...candidate,
      seed,
      explanation: {
        ...candidate.explanation,
        coreConcept: [renderClsCp005Wave2CoreRule(candidate.intendedRuleId, candidate.intendedRuleValue)],
      },
      presentationQualityAudit,
      metadata: {
        ...candidate.metadata,
        qualityVersion: "cls-cp005-wave2-answer-aware-v2" as const,
        sourcePrototypeSeed,
      },
    };
  }

  throw new Error(`${prototypeId}/${seed} did not produce an answer-aware presentation-safe Wave 2 state after ${MAX_QUALITY_ATTEMPTS} attempts`);
}

export type GeneratedClsCp005Wave2QualityQuestion = ReturnType<typeof generateClsCp005Wave2QualityQuestion>;
