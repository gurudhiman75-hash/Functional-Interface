import { CLS_CP004_CURATED_STATES } from "./curated-states";
import {
  CLS_CP004_DOMAIN_MAXIMUM,
  CLS_CP004_DOMAIN_MINIMUM,
  CLS_CP004_PROTOTYPE_BY_ID,
  analyzeClsCp004Number,
  clsCp004DivisorForRule,
  clsCp004RuleValue,
} from "./number-domain";
import { auditClsCp004DisplayedNumbers } from "./runtime";
import type {
  ClsCp004Difficulty,
  ClsCp004DifficultyFeatures,
  ClsCp004NumberFeatures,
  ClsCp004PrototypeId,
  ClsCp004RuleId,
  GeneratedClsCp004Question,
} from "./types";

const LIFECYCLE = {
  permanentQlId: null,
  reviewStatus: "UNREVIEWED_DISCOVERY" as const,
  questionBankStatus: "NOT_STORED" as const,
  testEligibility: "INELIGIBLE" as const,
  publiclyPublishable: false as const,
  questionStudioDiscoverable: false as const,
};

function hashText(text: string): number {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function factorial(value: number): number {
  let result = 1;
  for (let factor = 2; factor <= value; factor += 1) result *= factor;
  return result;
}

function permutationByIndex<T>(values: readonly T[], index: number): T[] {
  const pool = [...values];
  const result: T[] = [];
  let remainingIndex = index % factorial(values.length);
  for (let position = 0; position < values.length; position += 1) {
    const blockSize = factorial(values.length - position - 1);
    const poolIndex = Math.floor(remainingIndex / blockSize);
    remainingIndex %= blockSize;
    result.push(pool.splice(poolIndex, 1)[0]!);
  }
  return result;
}

function rootOfSquare(value: number): number | null {
  const root = Math.trunc(Math.sqrt(value));
  return root * root === value ? root : null;
}

function rootOfCube(value: number): number | null {
  const root = Math.round(Math.cbrt(value));
  return root * root * root === value ? root : null;
}

function triangularIndex(value: number): number | null {
  const index = Math.trunc((Math.sqrt(8 * value + 1) - 1) / 2);
  return index * (index + 1) / 2 === value ? index : null;
}

function digitCompositionText(value: ClsCp004NumberFeatures["digitParityComposition"]): string {
  if (value === "ALL_EVEN") return "all digits are even";
  if (value === "ALL_ODD") return "all digits are odd";
  return "the digits include both odd and even digits";
}

function nearPowerText(value: ClsCp004NumberFeatures["nearPowerClass"]): string {
  switch (value) {
    case "ONE_BELOW_SQUARE": return "one less than a perfect square";
    case "ONE_ABOVE_SQUARE": return "one more than a perfect square";
    case "ONE_BELOW_CUBE": return "one less than a perfect cube";
    case "ONE_ABOVE_CUBE": return "one more than a perfect cube";
    case "MULTIPLE_NEAR_POWER_RELATIONS": return "adjacent to more than one bounded square or cube";
    case "NONE": return "not one away from a bounded perfect square or cube";
  }
}

function propertyStatement(ruleId: ClsCp004RuleId, value: string): string {
  const divisor = clsCp004DivisorForRule(ruleId);
  if (divisor !== null) {
    return value === "DIVISIBLE"
      ? `Each common number is divisible by ${divisor}.`
      : `Each common number is not divisible by ${divisor}.`;
  }
  switch (ruleId) {
    case "DIGIT_COUNT": return `Each common number has ${value} digit${value === "1" ? "" : "s"}.`;
    case "PARITY": return `Each common number is ${value.toLocaleLowerCase("en-IN")}.`;
    case "PRIMALITY_CLASS": return `Each common number is ${value.toLocaleLowerCase("en-IN")}.`;
    case "PERFECT_SQUARE_STATUS": return value === "PERFECT_SQUARE" ? "Each common number is a perfect square." : "Each common number is not a perfect square.";
    case "PERFECT_CUBE_STATUS": return value === "PERFECT_CUBE" ? "Each common number is a perfect cube." : "Each common number is not a perfect cube.";
    case "DIVISOR_COUNT": return `Each common number has exactly ${value} positive divisors.`;
    case "DIGIT_PARITY_COMPOSITION": return `In each common number, ${digitCompositionText(value as ClsCp004NumberFeatures["digitParityComposition"])}.`;
    case "DIGIT_SUM": return `The digits of each common number add to ${value}.`;
    case "DIGIT_PRODUCT": return `The product of the digits in each common number is ${value}.`;
    case "PALINDROME_STATUS": return value === "PALINDROME" ? "Each common number reads the same forwards and backwards." : "Each common number changes when its digits are reversed.";
    case "NEAR_POWER_CLASS": return `Each common number is ${nearPowerText(value as ClsCp004NumberFeatures["nearPowerClass"])}.`;
    case "TRIANGULAR_STATUS": return value === "TRIANGULAR" ? "Each common number is triangular." : "Each common number is not triangular.";
    default: throw new Error(`Unsupported CLS-CP-004 property: ${ruleId}`);
  }
}

function exactValueText(features: ClsCp004NumberFeatures, ruleId: ClsCp004RuleId): string {
  const divisor = clsCp004DivisorForRule(ruleId);
  if (divisor !== null) {
    return features.value % divisor === 0
      ? `${features.value} is divisible by ${divisor}`
      : `${features.value} is not divisible by ${divisor}`;
  }
  switch (ruleId) {
    case "DIGIT_COUNT": return `${features.value} has ${features.digitCount} digit${features.digitCount === 1 ? "" : "s"}`;
    case "PARITY": return `${features.value} is ${features.parity.toLocaleLowerCase("en-IN")}`;
    case "PRIMALITY_CLASS": return `${features.value} is ${features.primalityClass.toLocaleLowerCase("en-IN")}`;
    case "PERFECT_SQUARE_STATUS": {
      const root = rootOfSquare(features.value);
      return root === null ? `${features.value} is not a perfect square` : `${features.value} = ${root}²`;
    }
    case "PERFECT_CUBE_STATUS": {
      const root = rootOfCube(features.value);
      return root === null ? `${features.value} is not a perfect cube` : `${features.value} = ${root}³`;
    }
    case "DIVISOR_COUNT": return `${features.value} has ${features.divisorCount} positive divisors`;
    case "DIGIT_PARITY_COMPOSITION": return `${features.value}: ${digitCompositionText(features.digitParityComposition)}`;
    case "DIGIT_SUM": return `the digits of ${features.value} add to ${features.digitSum}`;
    case "DIGIT_PRODUCT": return `the digits of ${features.value} multiply to ${features.digitProduct}`;
    case "PALINDROME_STATUS": return features.palindrome ? `${features.value} is palindromic` : `${features.value} is not palindromic`;
    case "NEAR_POWER_CLASS": return `${features.value} is ${nearPowerText(features.nearPowerClass)}`;
    case "TRIANGULAR_STATUS": {
      const index = triangularIndex(features.value);
      return index === null
        ? `${features.value} is not triangular`
        : `${features.value} = ${index} × ${index + 1} ÷ 2, so it is triangular`;
    }
    default: throw new Error(`Unsupported CLS-CP-004 exact value: ${ruleId}`);
  }
}

function naturalList(values: readonly string[]): string {
  if (values.length === 0) return "";
  if (values.length === 1) return values[0]!;
  if (values.length === 2) return `${values[0]} and ${values[1]}`;
  return `${values.slice(0, -1).join(", ")} and ${values.at(-1)}`;
}

function evidenceByOption(
  numbers: readonly number[],
  ruleId: ClsCp004RuleId,
  commonValue: string,
): string[] {
  return numbers.map((number) => {
    const features = analyzeClsCp004Number(number);
    const follows = clsCp004RuleValue(features, ruleId) === commonValue;
    return `${exactValueText(features, ruleId)}; it ${follows ? "follows" : "does not follow"} the common property.`;
  });
}

function explanation(
  numbers: readonly number[],
  correctIndex: number,
  ruleId: ClsCp004RuleId,
  commonValue: string,
): GeneratedClsCp004Question["explanation"] {
  const common = numbers.filter((_, index) => index !== correctIndex).map(String);
  const odd = numbers[correctIndex]!;
  const oddFeatures = analyzeClsCp004Number(odd);
  const divisor = clsCp004DivisorForRule(ruleId);
  return {
    coreConcept: [propertyStatement(ruleId, commonValue)],
    stepByStep: [
      `${naturalList(common)} follow the same number property.`,
      `${exactValueText(oddFeatures, ruleId)}, so it has a different value under that property.`,
      `Therefore, ${odd} is the odd number.`,
    ],
    examSpeedShortcut: [
      divisor !== null
        ? `Use the divisibility test for ${divisor} instead of full division wherever possible.`
        : ruleId === "PRIMALITY_CLASS" || ruleId === "DIVISOR_COUNT"
          ? "Test small prime divisors only up to the square root of each number."
          : ruleId.includes("DIGIT")
            ? "Write the required digit count, sum, product or parity pattern beside each option."
            : ruleId === "PERFECT_SQUARE_STATUS" || ruleId === "PERFECT_CUBE_STATUS" || ruleId === "NEAR_POWER_CLASS"
              ? "Compare each number with the nearest familiar square or cube."
              : "Mark the property value beside each option, then identify the lone mismatch.",
    ],
    commonTrapWarning: [
      "Use only a standard property of each number; do not invent a formula that merely fits three options.",
    ],
  };
}

function computationalDemand(ruleId: ClsCp004RuleId): 1 | 2 | 3 {
  if (["DIGIT_COUNT", "PARITY", "PALINDROME_STATUS", "DIGIT_PARITY_COMPOSITION"].includes(ruleId)) return 1;
  if (["PRIMALITY_CLASS", "DIVISOR_COUNT", "NEAR_POWER_CLASS"].includes(ruleId)) return 3;
  return 2;
}

function nearMissDistance(
  oddFeatures: ClsCp004NumberFeatures,
  ruleId: ClsCp004RuleId,
  commonValue: string,
): number {
  const oddValue = clsCp004RuleValue(oddFeatures, ruleId);
  if (["DIGIT_COUNT", "DIVISOR_COUNT", "DIGIT_SUM", "DIGIT_PRODUCT"].includes(ruleId)) {
    return Math.abs(Number(oddValue) - Number(commonValue));
  }
  return 1;
}

function difficultyFeatures(
  numbers: readonly number[],
  intendedRuleId: ClsCp004RuleId,
  intendedRuleValue: string,
  candidateRuleCount: number,
  correctIndex: number,
  optionCount: 4 | 5,
): ClsCp004DifficultyFeatures {
  const demand = computationalDemand(intendedRuleId);
  const maximumDigitCount = Math.max(...numbers.map((number) => analyzeClsCp004Number(number).digitCount));
  const distance = nearMissDistance(analyzeClsCp004Number(numbers[correctIndex]!), intendedRuleId, intendedRuleValue);
  const requiresFactorisation = intendedRuleId === "PRIMALITY_CLASS" || intendedRuleId === "DIVISOR_COUNT";
  const requiresPowerCheck = ["PERFECT_SQUARE_STATUS", "PERFECT_CUBE_STATUS", "NEAR_POWER_CLASS", "TRIANGULAR_STATUS"].includes(intendedRuleId);
  const requiresDigitOperation = intendedRuleId.startsWith("DIGIT_") || intendedRuleId === "PALINDROME_STATUS";
  const score =
    (optionCount === 5 ? 1 : 0)
    + (maximumDigitCount === 3 ? 1 : 0)
    + (demand - 1)
    + Math.max(0, candidateRuleCount - 1)
    + (distance <= 1 ? 1 : 0)
    + (requiresFactorisation ? 1 : 0);
  return {
    optionCount,
    maximumDigitCount,
    computationalDemand: demand,
    candidateRuleCount,
    requiresFactorisation,
    requiresPowerCheck,
    requiresDigitOperation,
    nearMissDistance: distance,
    score,
  };
}

function difficultyFromScore(score: number): ClsCp004Difficulty {
  if (score <= 2) return "EASY";
  if (score <= 4) return "MEDIUM";
  return "HARD";
}

function stem(seed: number): string {
  const stems = [
    "Choose the number that differs from the others in a conventional number property.",
    "Three or four numbers share one standard property. Which number is different?",
    "Select the odd number using a standard arithmetic or digit property.",
    "Which option does not belong with the others under one conventional number rule?",
  ];
  return stems[seed % stems.length]!;
}

export function generateClsCp004DiscoveryQuestion(
  prototypeId: ClsCp004PrototypeId,
  seed = 0,
  optionCount: 4 | 5 = 4,
): GeneratedClsCp004Question {
  if (!Number.isSafeInteger(seed) || seed < 0) throw new Error(`Seed must be a non-negative safe integer: ${seed}`);
  if (optionCount !== 4 && optionCount !== 5) throw new Error(`CLS-CP-004 supports four or five options, received ${optionCount}`);
  const prototype = CLS_CP004_PROTOTYPE_BY_ID.get(prototypeId);
  if (!prototype) throw new Error(`Unknown CLS-CP-004 prototype: ${prototypeId}`);

  const states = CLS_CP004_CURATED_STATES[prototypeId][String(optionCount) as "4" | "5"];
  if (states.length === 0) throw new Error(`No curated states for ${prototypeId}/${optionCount}`);
  const stateIndex = seed % states.length;
  const cycle = Math.floor(seed / states.length);
  const state = states[stateIndex]!;
  const permutationIndex = (cycle + hashText(`${prototypeId}:${stateIndex}:${optionCount}`)) % factorial(optionCount);
  const numbers = permutationByIndex(state.numbers, permutationIndex);
  const audit = auditClsCp004DisplayedNumbers(numbers, state.ruleId);
  if (audit.result !== "UNIQUE" || audit.outlierIndex === null || !audit.intendedRuleSupported) {
    throw new Error(`${prototypeId}/${seed}/${optionCount} curated state failed independent audit: ${audit.reason}`);
  }
  const correctIndex = audit.outlierIndex;
  const features = difficultyFeatures(
    numbers,
    state.ruleId,
    state.commonValue,
    audit.candidateSupports.length,
    correctIndex,
    optionCount,
  );
  const options = numbers.map(String);
  return {
    checkpointId: "CLS-CP-004",
    prototypeId,
    seed,
    task: "FIND_NUMBER_PROPERTY_OUTLIER",
    generationProfile: prototype.generationProfile,
    stem: stem(seed + stateIndex + cycle),
    numbers,
    options,
    correctIndex,
    answer: options[correctIndex]!,
    intendedRuleId: state.ruleId,
    intendedRuleValue: state.commonValue,
    evidenceByOption: evidenceByOption(numbers, state.ruleId, state.commonValue),
    ambiguityAudit: audit,
    difficulty: difficultyFromScore(features.score),
    difficultyFeatures: features,
    explanation: explanation(numbers, correctIndex, state.ruleId, state.commonValue),
    metadata: {
      datasetVersion: "CLS-CP004-NUMBER-DOMAIN-v1",
      runtimeVersion: "cls-cp004-discovery-v1",
      locale: "en-IN",
      optionCount,
      domainMinimum: CLS_CP004_DOMAIN_MINIMUM,
      domainMaximum: CLS_CP004_DOMAIN_MAXIMUM,
      sourceSaturationStatus: "OPEN_FILE_LIBRARY_RETRY_REQUIRED",
    },
    lifecycle: LIFECYCLE,
  };
}