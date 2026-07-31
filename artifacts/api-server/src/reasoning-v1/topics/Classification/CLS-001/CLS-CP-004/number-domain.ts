import type {
  ClsCp004NearPowerClass,
  ClsCp004NumberFeatures,
  ClsCp004PrototypeDefinition,
  ClsCp004RuleId,
} from "./types";

export const CLS_CP004_DOMAIN_MINIMUM = 2 as const;
export const CLS_CP004_DOMAIN_MAXIMUM = 999 as const;

export const CLS_CP004_DIVISIBILITY_RULE_IDS: readonly ClsCp004RuleId[] = [
  "DIVISIBLE_BY_3",
  "DIVISIBLE_BY_4",
  "DIVISIBLE_BY_5",
  "DIVISIBLE_BY_6",
  "DIVISIBLE_BY_7",
  "DIVISIBLE_BY_8",
  "DIVISIBLE_BY_9",
  "DIVISIBLE_BY_10",
  "DIVISIBLE_BY_11",
  "DIVISIBLE_BY_12",
];

export const CLS_CP004_RULE_IDS: readonly ClsCp004RuleId[] = [
  "DIGIT_COUNT",
  "PARITY",
  "PRIMALITY_CLASS",
  "PERFECT_SQUARE_STATUS",
  "PERFECT_CUBE_STATUS",
  ...CLS_CP004_DIVISIBILITY_RULE_IDS,
  "DIVISOR_COUNT",
  "DIGIT_PARITY_COMPOSITION",
  "DIGIT_SUM",
  "DIGIT_PRODUCT",
  "PALINDROME_STATUS",
  "NEAR_POWER_CLASS",
  "TRIANGULAR_STATUS",
];

function isPrime(value: number): boolean {
  if (value < 2) return false;
  if (value === 2) return true;
  if (value % 2 === 0) return false;
  for (let divisor = 3; divisor * divisor <= value; divisor += 2) {
    if (value % divisor === 0) return false;
  }
  return true;
}

function isPerfectSquare(value: number): boolean {
  const root = Math.trunc(Math.sqrt(value));
  return root * root === value;
}

function isPerfectCube(value: number): boolean {
  const root = Math.round(Math.cbrt(value));
  return root * root * root === value;
}

function positiveDivisorCount(value: number): number {
  let count = 0;
  for (let divisor = 1; divisor * divisor <= value; divisor += 1) {
    if (value % divisor !== 0) continue;
    count += divisor * divisor === value ? 1 : 2;
  }
  return count;
}

function nearPowerClass(value: number): ClsCp004NearPowerClass {
  const relations: Exclude<ClsCp004NearPowerClass, "MULTIPLE_NEAR_POWER_RELATIONS" | "NONE">[] = [];
  if (isPerfectSquare(value + 1)) relations.push("ONE_BELOW_SQUARE");
  if (value > 2 && isPerfectSquare(value - 1)) relations.push("ONE_ABOVE_SQUARE");
  if (isPerfectCube(value + 1)) relations.push("ONE_BELOW_CUBE");
  if (value > 2 && isPerfectCube(value - 1)) relations.push("ONE_ABOVE_CUBE");
  if (relations.length === 0) return "NONE";
  if (relations.length > 1) return "MULTIPLE_NEAR_POWER_RELATIONS";
  return relations[0]!;
}

function isTriangular(value: number): boolean {
  const index = Math.trunc((Math.sqrt(8 * value + 1) - 1) / 2);
  return index * (index + 1) / 2 === value;
}

export function analyzeClsCp004Number(value: number): ClsCp004NumberFeatures {
  if (!Number.isSafeInteger(value) || value < CLS_CP004_DOMAIN_MINIMUM || value > CLS_CP004_DOMAIN_MAXIMUM) {
    throw new Error(`CLS-CP-004 value must be an integer from ${CLS_CP004_DOMAIN_MINIMUM} to ${CLS_CP004_DOMAIN_MAXIMUM}: ${value}`);
  }
  const digits = String(value).split("").map(Number);
  const digitSum = digits.reduce((total, digit) => total + digit, 0);
  const digitProduct = digits.reduce((total, digit) => total * digit, 1);
  const allEven = digits.every((digit) => digit % 2 === 0);
  const allOdd = digits.every((digit) => digit % 2 === 1);
  return {
    value,
    digitCount: digits.length,
    parity: value % 2 === 0 ? "EVEN" : "ODD",
    primalityClass: isPrime(value) ? "PRIME" : "COMPOSITE",
    perfectSquare: isPerfectSquare(value),
    perfectCube: isPerfectCube(value),
    divisorCount: positiveDivisorCount(value),
    digitParityComposition: allEven ? "ALL_EVEN" : allOdd ? "ALL_ODD" : "MIXED",
    digitSum,
    digitProduct,
    hasZeroDigit: digits.includes(0),
    palindrome: String(value) === [...String(value)].reverse().join(""),
    nearPowerClass: nearPowerClass(value),
    triangular: isTriangular(value),
  };
}

export function clsCp004DivisorForRule(ruleId: ClsCp004RuleId): number | null {
  const match = /^DIVISIBLE_BY_(\d+)$/.exec(ruleId);
  return match ? Number(match[1]) : null;
}

export function clsCp004RuleValue(
  features: ClsCp004NumberFeatures,
  ruleId: ClsCp004RuleId,
): string {
  const divisor = clsCp004DivisorForRule(ruleId);
  if (divisor !== null) return features.value % divisor === 0 ? "DIVISIBLE" : "NOT_DIVISIBLE";
  switch (ruleId) {
    case "DIGIT_COUNT":
      return String(features.digitCount);
    case "PARITY":
      return features.parity;
    case "PRIMALITY_CLASS":
      return features.primalityClass;
    case "PERFECT_SQUARE_STATUS":
      return features.perfectSquare ? "PERFECT_SQUARE" : "NOT_PERFECT_SQUARE";
    case "PERFECT_CUBE_STATUS":
      return features.perfectCube ? "PERFECT_CUBE" : "NOT_PERFECT_CUBE";
    case "DIVISOR_COUNT":
      return String(features.divisorCount);
    case "DIGIT_PARITY_COMPOSITION":
      return features.digitParityComposition;
    case "DIGIT_SUM":
      return String(features.digitSum);
    case "DIGIT_PRODUCT":
      return String(features.digitProduct);
    case "PALINDROME_STATUS":
      return features.palindrome ? "PALINDROME" : "NOT_PALINDROME";
    case "NEAR_POWER_CLASS":
      return features.nearPowerClass;
    case "TRIANGULAR_STATUS":
      return features.triangular ? "TRIANGULAR" : "NOT_TRIANGULAR";
    default:
      throw new Error(`Unsupported CLS-CP-004 rule: ${ruleId}`);
  }
}

export const CLS_CP004_NUMBER_DOMAIN: readonly ClsCp004NumberFeatures[] = Array.from(
  { length: CLS_CP004_DOMAIN_MAXIMUM - CLS_CP004_DOMAIN_MINIMUM + 1 },
  (_, index) => analyzeClsCp004Number(CLS_CP004_DOMAIN_MINIMUM + index),
);

export const CLS_CP004_FEATURE_BY_VALUE = new Map(
  CLS_CP004_NUMBER_DOMAIN.map((features) => [features.value, features]),
);

export const CLS_CP004_PROTOTYPES: readonly ClsCp004PrototypeDefinition[] = [
  { prototypeId: "CLS-CP004-PROT-001", title: "Exact digit-count outlier", generationProfile: "DIGIT_COUNT_OUTLIER", allowedRuleIds: ["DIGIT_COUNT"] },
  { prototypeId: "CLS-CP004-PROT-002", title: "Odd-even parity outlier", generationProfile: "PARITY_OUTLIER", allowedRuleIds: ["PARITY"] },
  { prototypeId: "CLS-CP004-PROT-003", title: "Prime-composite class outlier", generationProfile: "PRIMALITY_OUTLIER", allowedRuleIds: ["PRIMALITY_CLASS"] },
  { prototypeId: "CLS-CP004-PROT-004", title: "Perfect-square status outlier", generationProfile: "SQUARE_STATUS_OUTLIER", allowedRuleIds: ["PERFECT_SQUARE_STATUS"] },
  { prototypeId: "CLS-CP004-PROT-005", title: "Perfect-cube status outlier", generationProfile: "CUBE_STATUS_OUTLIER", allowedRuleIds: ["PERFECT_CUBE_STATUS"] },
  { prototypeId: "CLS-CP004-PROT-006", title: "Conventional divisibility outlier", generationProfile: "DIVISIBILITY_OUTLIER", allowedRuleIds: CLS_CP004_DIVISIBILITY_RULE_IDS },
  { prototypeId: "CLS-CP004-PROT-007", title: "Exact divisor-count outlier", generationProfile: "DIVISOR_COUNT_OUTLIER", allowedRuleIds: ["DIVISOR_COUNT"] },
  { prototypeId: "CLS-CP004-PROT-008", title: "Digit parity-composition outlier", generationProfile: "DIGIT_COMPOSITION_OUTLIER", allowedRuleIds: ["DIGIT_PARITY_COMPOSITION"] },
  { prototypeId: "CLS-CP004-PROT-009", title: "Exact digit-sum outlier", generationProfile: "DIGIT_SUM_OUTLIER", allowedRuleIds: ["DIGIT_SUM"] },
  { prototypeId: "CLS-CP004-PROT-010", title: "Exact non-zero digit-product outlier", generationProfile: "DIGIT_PRODUCT_OUTLIER", allowedRuleIds: ["DIGIT_PRODUCT"] },
  { prototypeId: "CLS-CP004-PROT-011", title: "Palindromic-number status outlier", generationProfile: "PALINDROME_STATUS_OUTLIER", allowedRuleIds: ["PALINDROME_STATUS"] },
  { prototypeId: "CLS-CP004-PROT-012", title: "Bounded near-power class outlier", generationProfile: "NEAR_POWER_OUTLIER", allowedRuleIds: ["NEAR_POWER_CLASS"] },
  { prototypeId: "CLS-CP004-PROT-013", title: "Triangular-number status outlier", generationProfile: "TRIANGULAR_STATUS_OUTLIER", allowedRuleIds: ["TRIANGULAR_STATUS"] },
];

export const CLS_CP004_PROTOTYPE_BY_ID = new Map(
  CLS_CP004_PROTOTYPES.map((prototype) => [prototype.prototypeId, prototype]),
);