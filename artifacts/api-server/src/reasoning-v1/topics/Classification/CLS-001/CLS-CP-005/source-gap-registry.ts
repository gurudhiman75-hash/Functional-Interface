export type ClsCp005SourceGapPairRuleId =
  | "PAIR_CONSECUTIVE_PRODUCT_DIRECTION"
  | "PAIR_SQUARE_CUBE_DIRECTION"
  | "PAIR_CONSECUTIVE_CUBES_DIRECTION"
  | "PAIR_REVERSED_CUBE_DIRECTION"
  | "PAIR_CUBE_MINUS_ONE_DIRECTION"
  | "PAIR_AFFINE_3X_MINUS_10_DIRECTION"
  | "PAIR_AFFINE_7X_PLUS_3_DIRECTION"
  | "PAIR_AFFINE_6X_PLUS_2_DIRECTION"
  | "PAIR_BOTH_PRIME"
  | "PAIR_DIVISIBILITY_DIRECTION"
  | "PAIR_PRIME_ABSOLUTE_DIFFERENCE"
  | "PAIR_DIGIT_PERMUTATION";

export type ClsCp005SourceGapTripleRuleId =
  | "TRIPLE_UNORDERED_ARITHMETIC_SET"
  | "TRIPLE_ALL_PRIME"
  | "TRIPLE_SAME_DIGIT_MULTISET";

export type ClsCp005SourceGapQuadrupleRuleId =
  | "QUADRUPLE_REDUCED_RATIO_VECTOR";

export type ClsCp005SourceGapRuleId =
  | ClsCp005SourceGapPairRuleId
  | ClsCp005SourceGapTripleRuleId
  | ClsCp005SourceGapQuadrupleRuleId;

export type ClsCp005SourceGapTuple =
  | readonly [number, number]
  | readonly [number, number, number]
  | readonly [number, number, number, number];

export type ClsCp005SourceGapSignature = {
  readonly ruleId: ClsCp005SourceGapRuleId;
  readonly value: string;
};

export type ClsCp005SourceGapRegistryEntry = {
  readonly ruleId: ClsCp005SourceGapRuleId;
  readonly arity: 2 | 3 | 4;
  readonly sourceClass: "RECURRING_SOURCE_PATTERN" | "SOURCE_ATTESTED_BOUNDED_TRANSFORM";
  readonly learnerDescription: string;
  readonly sourceEvidence: readonly string[];
  readonly disposition: "ADMIT_WAVE_2_CANDIDATE";
};

export const CLS_CP005_SOURCE_GAP_PAIR_RULE_IDS: readonly ClsCp005SourceGapPairRuleId[] = [
  "PAIR_CONSECUTIVE_PRODUCT_DIRECTION",
  "PAIR_SQUARE_CUBE_DIRECTION",
  "PAIR_CONSECUTIVE_CUBES_DIRECTION",
  "PAIR_REVERSED_CUBE_DIRECTION",
  "PAIR_CUBE_MINUS_ONE_DIRECTION",
  "PAIR_AFFINE_3X_MINUS_10_DIRECTION",
  "PAIR_AFFINE_7X_PLUS_3_DIRECTION",
  "PAIR_AFFINE_6X_PLUS_2_DIRECTION",
  "PAIR_BOTH_PRIME",
  "PAIR_DIVISIBILITY_DIRECTION",
  "PAIR_PRIME_ABSOLUTE_DIFFERENCE",
  "PAIR_DIGIT_PERMUTATION",
];

export const CLS_CP005_SOURCE_GAP_TRIPLE_RULE_IDS: readonly ClsCp005SourceGapTripleRuleId[] = [
  "TRIPLE_UNORDERED_ARITHMETIC_SET",
  "TRIPLE_ALL_PRIME",
  "TRIPLE_SAME_DIGIT_MULTISET",
];

export const CLS_CP005_SOURCE_GAP_QUADRUPLE_RULE_IDS: readonly ClsCp005SourceGapQuadrupleRuleId[] = [
  "QUADRUPLE_REDUCED_RATIO_VECTOR",
];

export const CLS_CP005_SOURCE_GAP_RULE_IDS: readonly ClsCp005SourceGapRuleId[] = [
  ...CLS_CP005_SOURCE_GAP_PAIR_RULE_IDS,
  ...CLS_CP005_SOURCE_GAP_TRIPLE_RULE_IDS,
  ...CLS_CP005_SOURCE_GAP_QUADRUPLE_RULE_IDS,
];

export const CLS_CP005_SOURCE_GAP_REGISTRY: readonly ClsCp005SourceGapRegistryEntry[] = [
  {
    ruleId: "PAIR_CONSECUTIVE_PRODUCT_DIRECTION",
    arity: 2,
    sourceClass: "RECURRING_SOURCE_PATTERN",
    learnerDescription: "One number is the product of two consecutive integers beginning with the other number.",
    sourceEvidence: ["Radian Classification 124", "Radian Classification 139", "Radian Classification 154"],
    disposition: "ADMIT_WAVE_2_CANDIDATE",
  },
  {
    ruleId: "PAIR_SQUARE_CUBE_DIRECTION",
    arity: 2,
    sourceClass: "RECURRING_SOURCE_PATTERN",
    learnerDescription: "The two entries are the square and cube of the same integer, with order preserved.",
    sourceEvidence: ["Radian Classification 130"],
    disposition: "ADMIT_WAVE_2_CANDIDATE",
  },
  {
    ruleId: "PAIR_CONSECUTIVE_CUBES_DIRECTION",
    arity: 2,
    sourceClass: "SOURCE_ATTESTED_BOUNDED_TRANSFORM",
    learnerDescription: "The entries are cubes of consecutive integers, with order preserved.",
    sourceEvidence: ["Radian Classification 123"],
    disposition: "ADMIT_WAVE_2_CANDIDATE",
  },
  {
    ruleId: "PAIR_REVERSED_CUBE_DIRECTION",
    arity: 2,
    sourceClass: "SOURCE_ATTESTED_BOUNDED_TRANSFORM",
    learnerDescription: "The target is obtained by cubing the source and reversing the resulting digits.",
    sourceEvidence: ["Radian Classification 126"],
    disposition: "ADMIT_WAVE_2_CANDIDATE",
  },
  {
    ruleId: "PAIR_CUBE_MINUS_ONE_DIRECTION",
    arity: 2,
    sourceClass: "SOURCE_ATTESTED_BOUNDED_TRANSFORM",
    learnerDescription: "The target is one less than the cube of the source.",
    sourceEvidence: ["Radian Classification 127"],
    disposition: "ADMIT_WAVE_2_CANDIDATE",
  },
  {
    ruleId: "PAIR_AFFINE_3X_MINUS_10_DIRECTION",
    arity: 2,
    sourceClass: "RECURRING_SOURCE_PATTERN",
    learnerDescription: "The target equals three times the source minus ten.",
    sourceEvidence: ["Radian Classification 128", "Radian Classification 158"],
    disposition: "ADMIT_WAVE_2_CANDIDATE",
  },
  {
    ruleId: "PAIR_AFFINE_7X_PLUS_3_DIRECTION",
    arity: 2,
    sourceClass: "SOURCE_ATTESTED_BOUNDED_TRANSFORM",
    learnerDescription: "The target equals seven times the source plus three.",
    sourceEvidence: ["Radian Classification 134"],
    disposition: "ADMIT_WAVE_2_CANDIDATE",
  },
  {
    ruleId: "PAIR_AFFINE_6X_PLUS_2_DIRECTION",
    arity: 2,
    sourceClass: "SOURCE_ATTESTED_BOUNDED_TRANSFORM",
    learnerDescription: "One entry equals six times the other plus two, with direction preserved.",
    sourceEvidence: ["Radian Classification 132"],
    disposition: "ADMIT_WAVE_2_CANDIDATE",
  },
  {
    ruleId: "PAIR_BOTH_PRIME",
    arity: 2,
    sourceClass: "RECURRING_SOURCE_PATTERN",
    learnerDescription: "Both entries are prime numbers.",
    sourceEvidence: ["Radian Classification 131"],
    disposition: "ADMIT_WAVE_2_CANDIDATE",
  },
  {
    ruleId: "PAIR_DIVISIBILITY_DIRECTION",
    arity: 2,
    sourceClass: "RECURRING_SOURCE_PATTERN",
    learnerDescription: "One displayed position is an exact multiple of the other.",
    sourceEvidence: ["Radian Classification 156"],
    disposition: "ADMIT_WAVE_2_CANDIDATE",
  },
  {
    ruleId: "PAIR_PRIME_ABSOLUTE_DIFFERENCE",
    arity: 2,
    sourceClass: "RECURRING_SOURCE_PATTERN",
    learnerDescription: "The absolute difference between the entries is prime.",
    sourceEvidence: ["Radian Classification 140"],
    disposition: "ADMIT_WAVE_2_CANDIDATE",
  },
  {
    ruleId: "PAIR_DIGIT_PERMUTATION",
    arity: 2,
    sourceClass: "RECURRING_SOURCE_PATTERN",
    learnerDescription: "The entries contain the same digits in a different non-reversal order.",
    sourceEvidence: ["Radian Classification 120"],
    disposition: "ADMIT_WAVE_2_CANDIDATE",
  },
  {
    ruleId: "TRIPLE_UNORDERED_ARITHMETIC_SET",
    arity: 3,
    sourceClass: "RECURRING_SOURCE_PATTERN",
    learnerDescription: "After ordering the values, they form an arithmetic progression even when the displayed order is rearranged.",
    sourceEvidence: ["Radian Classification 136"],
    disposition: "ADMIT_WAVE_2_CANDIDATE",
  },
  {
    ruleId: "TRIPLE_ALL_PRIME",
    arity: 3,
    sourceClass: "RECURRING_SOURCE_PATTERN",
    learnerDescription: "All three entries are prime numbers.",
    sourceEvidence: ["Radian Classification 155"],
    disposition: "ADMIT_WAVE_2_CANDIDATE",
  },
  {
    ruleId: "TRIPLE_SAME_DIGIT_MULTISET",
    arity: 3,
    sourceClass: "RECURRING_SOURCE_PATTERN",
    learnerDescription: "All three entries are composed of the same digits in different orders.",
    sourceEvidence: ["Radian Classification 161"],
    disposition: "ADMIT_WAVE_2_CANDIDATE",
  },
  {
    ruleId: "QUADRUPLE_REDUCED_RATIO_VECTOR",
    arity: 4,
    sourceClass: "RECURRING_SOURCE_PATTERN",
    learnerDescription: "The four positions share one reduced proportional vector.",
    sourceEvidence: ["Radian Classification 137"],
    disposition: "ADMIT_WAVE_2_CANDIDATE",
  },
];

function gcd(left: number, right: number): number {
  let a = Math.abs(left);
  let b = Math.abs(right);
  while (b !== 0) [a, b] = [b, a % b];
  return a;
}

function gcdAll(values: readonly number[]): number {
  return values.reduce((current, value) => gcd(current, value));
}

function isPrime(value: number): boolean {
  if (!Number.isInteger(value) || value < 2) return false;
  if (value % 2 === 0) return value === 2;
  for (let divisor = 3; divisor * divisor <= value; divisor += 2) {
    if (value % divisor === 0) return false;
  }
  return true;
}

function reverseDigits(value: number): number {
  return Number(String(Math.abs(value)).split("").reverse().join(""));
}

function digitKey(value: number): string {
  return String(Math.abs(value)).split("").sort().join("");
}

function exactIntegerRoot(value: number, power: 2 | 3): number | null {
  const approximate = power === 2 ? Math.round(Math.sqrt(value)) : Math.round(Math.cbrt(value));
  return approximate ** power === value ? approximate : null;
}

function directionalTransform(
  first: number,
  second: number,
  transform: (value: number) => number,
): "FORWARD" | "REVERSE" | null {
  if (transform(first) === second) return "FORWARD";
  if (transform(second) === first) return "REVERSE";
  return null;
}

export function independentlyEvaluateClsCp005SourceGapRule(
  tuple: ClsCp005SourceGapTuple,
  ruleId: ClsCp005SourceGapRuleId,
): string | null {
  if (tuple.length === 2) {
    const [first, second] = tuple;
    switch (ruleId) {
      case "PAIR_CONSECUTIVE_PRODUCT_DIRECTION":
        return directionalTransform(first, second, (value) => value * (value + 1));
      case "PAIR_SQUARE_CUBE_DIRECTION": {
        const firstBase = exactIntegerRoot(first, 2);
        if (firstBase !== null && firstBase ** 3 === second) return "FORWARD";
        const secondBase = exactIntegerRoot(second, 2);
        if (secondBase !== null && secondBase ** 3 === first) return "REVERSE";
        return null;
      }
      case "PAIR_CONSECUTIVE_CUBES_DIRECTION": {
        const firstBase = exactIntegerRoot(first, 3);
        if (firstBase !== null && (firstBase + 1) ** 3 === second) return "FORWARD";
        const secondBase = exactIntegerRoot(second, 3);
        if (secondBase !== null && (secondBase + 1) ** 3 === first) return "REVERSE";
        return null;
      }
      case "PAIR_REVERSED_CUBE_DIRECTION":
        return directionalTransform(first, second, (value) => reverseDigits(value ** 3));
      case "PAIR_CUBE_MINUS_ONE_DIRECTION":
        return directionalTransform(first, second, (value) => value ** 3 - 1);
      case "PAIR_AFFINE_3X_MINUS_10_DIRECTION":
        return directionalTransform(first, second, (value) => 3 * value - 10);
      case "PAIR_AFFINE_7X_PLUS_3_DIRECTION":
        return directionalTransform(first, second, (value) => 7 * value + 3);
      case "PAIR_AFFINE_6X_PLUS_2_DIRECTION":
        return directionalTransform(first, second, (value) => 6 * value + 2);
      case "PAIR_BOTH_PRIME":
        return isPrime(first) && isPrime(second) ? "BOTH_PRIME" : null;
      case "PAIR_DIVISIBILITY_DIRECTION":
        if (first !== 0 && second % first === 0) return "SECOND_MULTIPLE";
        if (second !== 0 && first % second === 0) return "FIRST_MULTIPLE";
        return null;
      case "PAIR_PRIME_ABSOLUTE_DIFFERENCE":
        return isPrime(Math.abs(first - second)) ? "PRIME_DIFFERENCE" : null;
      case "PAIR_DIGIT_PERMUTATION":
        return first !== second && reverseDigits(first) !== second && digitKey(first) === digitKey(second)
          ? "SAME_DIGITS_NON_REVERSAL"
          : null;
      default:
        return null;
    }
  }

  if (tuple.length === 3) {
    const [first, second, third] = tuple;
    switch (ruleId) {
      case "TRIPLE_UNORDERED_ARITHMETIC_SET": {
        const sorted = [first, second, third].sort((left, right) => left - right);
        const unorderedAp = sorted[1]! - sorted[0]! === sorted[2]! - sorted[1]!;
        const displayedAp = second - first === third - second;
        return unorderedAp && !displayedAp ? "UNORDERED_ARITHMETIC" : null;
      }
      case "TRIPLE_ALL_PRIME":
        return [first, second, third].every(isPrime) ? "ALL_PRIME" : null;
      case "TRIPLE_SAME_DIGIT_MULTISET": {
        const keys = [first, second, third].map(digitKey);
        return new Set([first, second, third]).size === 3 && new Set(keys).size === 1
          ? "SAME_DIGITS"
          : null;
      }
      default:
        return null;
    }
  }

  if (tuple.length === 4 && ruleId === "QUADRUPLE_REDUCED_RATIO_VECTOR") {
    const divisor = gcdAll(tuple);
    if (divisor <= 0) return null;
    return tuple.map((value) => value / divisor).join(":");
  }

  return null;
}

export function independentlyInferClsCp005SourceGapSignatures(
  tuple: ClsCp005SourceGapTuple,
): readonly ClsCp005SourceGapSignature[] {
  const ruleIds = tuple.length === 2
    ? CLS_CP005_SOURCE_GAP_PAIR_RULE_IDS
    : tuple.length === 3
      ? CLS_CP005_SOURCE_GAP_TRIPLE_RULE_IDS
      : CLS_CP005_SOURCE_GAP_QUADRUPLE_RULE_IDS;
  return ruleIds.flatMap((ruleId) => {
    const value = independentlyEvaluateClsCp005SourceGapRule(tuple, ruleId);
    return value === null ? [] : [{ ruleId, value }];
  });
}
