import {
  CLS_CP005_PAIR_RULE_IDS,
  CLS_CP005_TRIPLE_RULE_IDS,
  isClsCp005PairRule,
} from "./relation-registry";
import type {
  ClsCp005AmbiguityAudit,
  ClsCp005RuleId,
  ClsCp005RuleSignature,
  ClsCp005RuleSupport,
  ClsCp005Task,
  ClsCp005Tuple,
} from "./types";

function verifierGcd(left: number, right: number): number {
  let a = Math.abs(left);
  let b = Math.abs(right);
  while (b > 0) [a, b] = [b, a % b];
  return a;
}

function verifierLcm(left: number, right: number): number {
  return Math.abs(left * right) / verifierGcd(left, right);
}

function verifierReverse(value: number): number {
  let remaining = Math.abs(value);
  let reversed = 0;
  while (remaining > 0) {
    reversed = reversed * 10 + remaining % 10;
    remaining = Math.floor(remaining / 10);
  }
  return reversed;
}

function verifierRatio(numerator: number, denominator: number): string {
  const common = verifierGcd(numerator, denominator);
  return `${numerator / common}:${denominator / common}`;
}

function independentlyEvaluateRule(tuple: ClsCp005Tuple, ruleId: ClsCp005RuleId): string | null {
  if (tuple.length === 2) {
    if (!isClsCp005PairRule(ruleId)) return null;
    const first = tuple[0];
    const second = tuple[1];
    if (ruleId === "PAIR_SIGNED_DIFFERENCE") return String(second - first);
    if (ruleId === "PAIR_REDUCED_RATIO") return verifierRatio(second, first);
    if (ruleId === "PAIR_SUM") return String(first + second);
    if (ruleId === "PAIR_PRODUCT") return String(first * second);
    if (ruleId === "PAIR_GCD") return String(verifierGcd(first, second));
    if (ruleId === "PAIR_LCM") return String(verifierLcm(first, second));
    if (ruleId === "PAIR_CONSECUTIVE_DIRECTION") {
      if (second - first === 1) return "FORWARD";
      if (first - second === 1) return "REVERSE";
      return null;
    }
    if (ruleId === "PAIR_SQUARE_DIRECTION") {
      if (second === first ** 2) return "FORWARD";
      if (first === second ** 2) return "REVERSE";
      return null;
    }
    if (ruleId === "PAIR_CUBE_DIRECTION") {
      if (second === first ** 3) return "FORWARD";
      if (first === second ** 3) return "REVERSE";
      return null;
    }
    if (ruleId === "PAIR_DIGIT_REVERSE_DIRECTION") {
      return verifierReverse(first) === second && first !== second ? "REVERSED" : null;
    }
    return null;
  }

  if (tuple.length === 3) {
    const first = tuple[0];
    const second = tuple[1];
    const third = tuple[2];
    if (ruleId === "TRIPLE_SUM_OF_TWO_EQUALS_THIRD") {
      if (first + second === third) return "AB_TO_C";
      if (first + third === second) return "AC_TO_B";
      if (second + third === first) return "BC_TO_A";
      return null;
    }
    if (ruleId === "TRIPLE_PRODUCT_OF_TWO_EQUALS_THIRD") {
      if (first * second === third) return "AB_TO_C";
      if (first * third === second) return "AC_TO_B";
      if (second * third === first) return "BC_TO_A";
      return null;
    }
    if (ruleId === "TRIPLE_ARITHMETIC_PROGRESSION") {
      return second - first === third - second ? "ARITHMETIC" : null;
    }
    if (ruleId === "TRIPLE_GEOMETRIC_PROGRESSION") {
      return second * second === first * third ? "GEOMETRIC" : null;
    }
    if (ruleId === "TRIPLE_PYTHAGOREAN_DIRECTION") {
      if (first ** 2 + second ** 2 === third ** 2) return "AB_TO_C";
      if (first ** 2 + third ** 2 === second ** 2) return "AC_TO_B";
      if (second ** 2 + third ** 2 === first ** 2) return "BC_TO_A";
      return null;
    }
    if (ruleId === "TRIPLE_CONSECUTIVE_DIRECTION") {
      if (second === first + 1 && third === second + 1) return "FORWARD";
      if (second === first - 1 && third === second - 1) return "REVERSE";
      return null;
    }
    if (ruleId === "TRIPLE_SUM") return String(first + second + third);
    if (ruleId === "TRIPLE_PRODUCT") return String(first * second * third);
  }

  return null;
}

export function independentlyInferClsCp005Signatures(tuple: ClsCp005Tuple): readonly ClsCp005RuleSignature[] {
  const ruleIds = tuple.length === 2 ? CLS_CP005_PAIR_RULE_IDS : CLS_CP005_TRIPLE_RULE_IDS;
  return ruleIds.flatMap((ruleId) => {
    const value = independentlyEvaluateRule(tuple, ruleId);
    return value === null ? [] : [{ ruleId, value }];
  });
}

function signatureKey(signature: ClsCp005RuleSignature): string {
  return `${signature.ruleId}::${signature.value}`;
}

function supportFromKey(key: string, matchingOptionIndexes: readonly number[], answerIndex: number): ClsCp005RuleSupport {
  const separator = key.indexOf("::");
  return {
    ruleId: key.slice(0, separator) as ClsCp005RuleId,
    commonValue: key.slice(separator + 2),
    matchingOptionIndexes,
    answerIndex,
  };
}

function finaliseAudit(
  supports: readonly ClsCp005RuleSupport[],
  intendedRuleId: ClsCp005RuleId,
  intendedRuleValue: string,
): ClsCp005AmbiguityAudit {
  const intendedRuleSupported = supports.some(
    (support) => support.ruleId === intendedRuleId && support.commonValue === intendedRuleValue,
  );
  if (!intendedRuleSupported) {
    return {
      result: "NO_VALID_RULE",
      answerIndex: null,
      intendedRuleSupported: false,
      candidateSupports: supports,
      reason: "The independently reconstructed tuples do not support the intended rule.",
    };
  }
  const answerIndexes = [...new Set(supports.map((support) => support.answerIndex))];
  if (answerIndexes.length !== 1) {
    return {
      result: "AMBIGUOUS",
      answerIndex: null,
      intendedRuleSupported: true,
      candidateSupports: supports,
      reason: `Competing admitted rules support different answers: ${answerIndexes.join(", ")}.`,
    };
  }
  return {
    result: "UNIQUE",
    answerIndex: answerIndexes[0]!,
    intendedRuleSupported: true,
    candidateSupports: supports,
    reason: "Every admitted supporting rule points to the same answer.",
  };
}

export function auditClsCp005OddTuples(
  tuples: readonly ClsCp005Tuple[],
  intendedRuleId: ClsCp005RuleId,
  intendedRuleValue: string,
): ClsCp005AmbiguityAudit {
  const signatures = new Map<string, number[]>();
  for (const [optionIndex, tuple] of tuples.entries()) {
    for (const signature of independentlyInferClsCp005Signatures(tuple)) {
      const key = signatureKey(signature);
      const indexes = signatures.get(key) ?? [];
      indexes.push(optionIndex);
      signatures.set(key, indexes);
    }
  }
  const supports: ClsCp005RuleSupport[] = [];
  for (const [key, matchingOptionIndexes] of signatures) {
    if (matchingOptionIndexes.length !== tuples.length - 1) continue;
    const answerIndex = tuples.findIndex((_, index) => !matchingOptionIndexes.includes(index));
    if (answerIndex >= 0) supports.push(supportFromKey(key, matchingOptionIndexes, answerIndex));
  }
  return finaliseAudit(supports, intendedRuleId, intendedRuleValue);
}

export function auditClsCp005EquivalentSet(
  referenceTuple: ClsCp005Tuple,
  tuples: readonly ClsCp005Tuple[],
  intendedRuleId: ClsCp005RuleId,
  intendedRuleValue: string,
): ClsCp005AmbiguityAudit {
  const referenceSignatures = independentlyInferClsCp005Signatures(referenceTuple);
  const optionSignatureSets = tuples.map((tuple) => new Set(independentlyInferClsCp005Signatures(tuple).map(signatureKey)));
  const supports: ClsCp005RuleSupport[] = [];
  for (const signature of referenceSignatures) {
    const key = signatureKey(signature);
    const matchingOptionIndexes = optionSignatureSets
      .map((set, index) => set.has(key) ? index : -1)
      .filter((index) => index >= 0);
    if (matchingOptionIndexes.length === 1) {
      supports.push(supportFromKey(key, matchingOptionIndexes, matchingOptionIndexes[0]!));
    }
  }
  return finaliseAudit(supports, intendedRuleId, intendedRuleValue);
}

export function independentlyVerifyClsCp005Question(question: {
  readonly task: ClsCp005Task;
  readonly referenceTuple: ClsCp005Tuple | null;
  readonly tuples: readonly ClsCp005Tuple[];
  readonly intendedRuleId: ClsCp005RuleId;
  readonly intendedRuleValue: string;
}): ClsCp005AmbiguityAudit {
  return question.task === "SELECT_EQUIVALENT_NUMBER_SET"
    ? auditClsCp005EquivalentSet(
        question.referenceTuple ?? (() => { throw new Error("Equivalent-set question is missing its reference tuple"); })(),
        question.tuples,
        question.intendedRuleId,
        question.intendedRuleValue,
      )
    : auditClsCp005OddTuples(question.tuples, question.intendedRuleId, question.intendedRuleValue);
}