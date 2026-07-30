import { auditClsCp005QuestionAgainstExpandedRegistry } from "./source-gap-expanded-audit";
import { generateClsCp005SimpleExplanationQuestion } from "./simple-option-explanation-runtime";
import type {
  ClsCp005PrototypeId,
  ClsCp005Tuple,
} from "./types";

const MAX_QUALITY_ATTEMPTS = 240;
const MAX_ANSWER_SCALE_RATIO = 4;

function unorderedTupleKey(tuple: ClsCp005Tuple): string {
  return [...tuple].sort((left, right) => left - right).join(",");
}

function tupleMaximum(tuple: ClsCp005Tuple): number {
  return Math.max(...tuple);
}

function tupleTotal(tuple: ClsCp005Tuple): number {
  return tuple.reduce((total, value) => total + value, 0);
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

export type ClsCp005PresentationQualityAudit = {
  readonly result: "PASS" | "REJECT";
  readonly reasons: readonly string[];
  readonly unorderedTupleKeys: readonly string[];
  readonly maximumValueRatio: number;
  readonly tupleTotalRatio: number;
  readonly answerMaximumRatio: number;
  readonly answerTotalRatio: number;
};

export function auditClsCp005PresentationQuality(question: {
  readonly referenceTuple: ClsCp005Tuple | null;
  readonly tuples: readonly ClsCp005Tuple[];
  readonly correctIndex: number;
}): ClsCp005PresentationQualityAudit {
  const reasons: string[] = [];
  const unorderedTupleKeys = question.tuples.map(unorderedTupleKey);
  if (new Set(unorderedTupleKeys).size !== unorderedTupleKeys.length) {
    reasons.push("Two displayed options are reversals or permutations of the same numbers.");
  }

  for (const tuple of question.tuples) {
    if (new Set(tuple).size !== tuple.length) {
      reasons.push("A displayed tuple repeats a number and creates a surface giveaway.");
      break;
    }
  }

  if (question.referenceTuple) {
    const referenceKey = unorderedTupleKey(question.referenceTuple);
    if (new Set(question.referenceTuple).size !== question.referenceTuple.length) {
      reasons.push("The reference tuple repeats a number.");
    }
    if (unorderedTupleKeys.includes(referenceKey)) {
      reasons.push("A candidate merely rearranges the numbers in the reference tuple.");
    }
  }

  const maxima = question.tuples.map(tupleMaximum);
  const totals = question.tuples.map(tupleTotal);
  const maximumValueRatio = ratio(Math.max(...maxima), Math.min(...maxima));
  const tupleTotalRatio = ratio(Math.max(...totals), Math.min(...totals));
  const commonMaxima = maxima.filter((_, index) => index !== question.correctIndex);
  const commonTotals = totals.filter((_, index) => index !== question.correctIndex);
  const answerMaximumRatio = relativeRatio(maxima[question.correctIndex]!, median(commonMaxima));
  const answerTotalRatio = relativeRatio(totals[question.correctIndex]!, median(commonTotals));

  if (maximumValueRatio > 20) {
    reasons.push("The displayed options span an excessive numerical scale.");
  }
  if (tupleTotalRatio > 16) {
    reasons.push("The displayed options span an excessive total magnitude.");
  }
  if (answerMaximumRatio > MAX_ANSWER_SCALE_RATIO) {
    reasons.push("The answer is visibly much larger or smaller than the common options.");
  }
  if (answerTotalRatio > MAX_ANSWER_SCALE_RATIO) {
    reasons.push("The answer has a visibly different total magnitude from the common options.");
  }

  return {
    result: reasons.length === 0 ? "PASS" : "REJECT",
    reasons,
    unorderedTupleKeys,
    maximumValueRatio,
    tupleTotalRatio,
    answerMaximumRatio,
    answerTotalRatio,
  };
}

export function generateClsCp005QualityQuestion(
  prototypeId: ClsCp005PrototypeId,
  seed = 0,
  requestedOptionCount?: 4 | 5,
) {
  if (!Number.isSafeInteger(seed) || seed < 0) {
    throw new Error(`Seed must be a non-negative safe integer: ${seed}`);
  }
  for (let attempt = 0; attempt < MAX_QUALITY_ATTEMPTS; attempt += 1) {
    const sourceSeed = seed + attempt * 10_007;
    const candidate = generateClsCp005SimpleExplanationQuestion(prototypeId, sourceSeed, requestedOptionCount);
    const presentationQualityAudit = auditClsCp005PresentationQuality(candidate);
    if (presentationQualityAudit.result !== "PASS") continue;

    const expandedSourceGapAudit = auditClsCp005QuestionAgainstExpandedRegistry(candidate);
    if (expandedSourceGapAudit.result !== "EXPANDED_UNIQUE") continue;
    if (expandedSourceGapAudit.answerIndex !== candidate.correctIndex) continue;

    return {
      ...candidate,
      seed,
      presentationQualityAudit,
      expandedSourceGapAudit,
      metadata: {
        ...candidate.metadata,
        qualityVersion: "cls-cp005-presentation-quality-v3-expanded-source-gap" as const,
        sourceGapAuditVersion: "cls-cp005-expanded-source-gap-v1" as const,
        sourcePrototypeSeed: sourceSeed,
      },
    };
  }
  throw new Error(`${prototypeId}/${seed} did not produce a presentation-safe and expanded-rule-unique state after ${MAX_QUALITY_ATTEMPTS} attempts`);
}

export type GeneratedClsCp005QualityQuestion = ReturnType<typeof generateClsCp005QualityQuestion>;
