import {
  CLS_CP004_DOMAIN_MAXIMUM,
  CLS_CP004_DOMAIN_MINIMUM,
  CLS_CP004_FEATURE_BY_VALUE,
  CLS_CP004_NUMBER_DOMAIN,
  CLS_CP004_PROTOTYPE_BY_ID,
  CLS_CP004_PROTOTYPES,
  CLS_CP004_RULE_IDS,
  analyzeClsCp004Number,
  clsCp004DivisorForRule,
  clsCp004RuleValue,
} from "./number-domain";
import type {
  ClsCp004AmbiguityAudit,
  ClsCp004Difficulty,
  ClsCp004DifficultyFeatures,
  ClsCp004NumberFeatures,
  ClsCp004PrototypeDefinition,
  ClsCp004PrototypeId,
  ClsCp004RuleId,
  ClsCp004RuleSupport,
  GeneratedClsCp004Question,
} from "./types";

const MAX_GENERATION_ATTEMPTS = 2400;

const LIFECYCLE = {
  permanentQlId: null,
  reviewStatus: "UNREVIEWED_DISCOVERY" as const,
  questionBankStatus: "NOT_STORED" as const,
  testEligibility: "INELIGIBLE" as const,
  publiclyPublishable: false as const,
  questionStudioDiscoverable: false as const,
};

type Rng = {
  next(): number;
  int(maxExclusive: number): number;
};

type CandidateState = {
  readonly intendedRuleId: ClsCp004RuleId;
  readonly intendedRuleValue: string;
  readonly numbers: readonly number[];
};

function hashText(text: string): number {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function makeRng(seed: number, salt: string): Rng {
  let state = (hashText(`${salt}:${seed}`) ^ 0x9e3779b9) >>> 0;
  if (state === 0) state = 0x6d2b79f5;
  return {
    next(): number {
      state ^= state << 13;
      state ^= state >>> 17;
      state ^= state << 5;
      return (state >>> 0) / 0x100000000;
    },
    int(maxExclusive: number): number {
      if (!Number.isInteger(maxExclusive) || maxExclusive <= 0) {
        throw new Error(`Invalid random bound: ${maxExclusive}`);
      }
      return Math.floor(this.next() * maxExclusive);
    },
  };
}

function shuffled<T>(values: readonly T[], rng: Rng): T[] {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = rng.int(index + 1);
    [result[index], result[swapIndex]] = [result[swapIndex]!, result[index]!];
  }
  return result;
}

function sampleDistinct<T>(values: readonly T[], count: number, rng: Rng): T[] {
  if (count > values.length) throw new Error(`Cannot sample ${count} values from ${values.length}`);
  return shuffled(values, rng).slice(0, count);
}

function featureFor(value: number): ClsCp004NumberFeatures {
  const features = CLS_CP004_FEATURE_BY_VALUE.get(value);
  if (!features) throw new Error(`Number outside the CLS-CP-004 domain: ${value}`);
  return features;
}

const VALUES_BY_RULE = new Map<ClsCp004RuleId, Map<string, ClsCp004NumberFeatures[]>>();
for (const ruleId of CLS_CP004_RULE_IDS) {
  const groups = new Map<string, ClsCp004NumberFeatures[]>();
  for (const features of CLS_CP004_NUMBER_DOMAIN) {
    const value = clsCp004RuleValue(features, ruleId);
    const entries = groups.get(value) ?? [];
    entries.push(features);
    groups.set(value, entries);
  }
  VALUES_BY_RULE.set(ruleId, groups);
}

function ruleSupports(numbers: readonly number[]): ClsCp004RuleSupport[] {
  const features = numbers.map(featureFor);
  const supports: ClsCp004RuleSupport[] = [];
  for (const ruleId of CLS_CP004_RULE_IDS) {
    const groups = new Map<string, number[]>();
    features.forEach((entry, index) => {
      const value = clsCp004RuleValue(entry, ruleId);
      const indexes = groups.get(value) ?? [];
      indexes.push(index);
      groups.set(value, indexes);
    });
    for (const [commonValue, matchingOptionIndexes] of groups) {
      if (matchingOptionIndexes.length !== numbers.length - 1) continue;
      const matching = new Set(matchingOptionIndexes);
      const outlierIndex = numbers.findIndex((_, index) => !matching.has(index));
      supports.push({ ruleId, commonValue, matchingOptionIndexes, outlierIndex });
    }
  }
  return supports;
}

export function auditClsCp004DisplayedNumbers(
  numbers: readonly number[],
  intendedRuleId?: ClsCp004RuleId,
): ClsCp004AmbiguityAudit {
  if (![4, 5].includes(numbers.length)) {
    throw new Error(`CLS-CP-004 audit requires four or five numbers, received ${numbers.length}`);
  }
  if (new Set(numbers).size !== numbers.length) {
    return {
      result: "NO_VALID_RULE",
      outlierIndex: null,
      intendedRuleSupported: false,
      candidateSupports: [],
      reason: "Displayed numbers must be distinct.",
    };
  }
  numbers.forEach(featureFor);
  const supports = ruleSupports(numbers);
  if (supports.length === 0) {
    return {
      result: "NO_VALID_RULE",
      outlierIndex: null,
      intendedRuleSupported: false,
      candidateSupports: [],
      reason: "No admitted conventional property groups every number except one.",
    };
  }
  const outlierIndexes = new Set(supports.map((support) => support.outlierIndex));
  if (outlierIndexes.size !== 1) {
    return {
      result: "AMBIGUOUS",
      outlierIndex: null,
      intendedRuleSupported: intendedRuleId
        ? supports.some((support) => support.ruleId === intendedRuleId)
        : false,
      candidateSupports: supports,
      reason: "Different admitted number properties identify different outliers.",
    };
  }
  const outlierIndex = supports[0]!.outlierIndex;
  const intendedRuleSupported = intendedRuleId
    ? supports.some((support) => support.ruleId === intendedRuleId && support.outlierIndex === outlierIndex)
    : true;
  if (intendedRuleId && !intendedRuleSupported) {
    return {
      result: "NO_VALID_RULE",
      outlierIndex: null,
      intendedRuleSupported: false,
      candidateSupports: supports,
      reason: "The state is classifiable, but not by the intended number property.",
    };
  }
  return {
    result: "UNIQUE",
    outlierIndex,
    intendedRuleSupported,
    candidateSupports: supports,
    reason: supports.length > 1
      ? "Several admitted properties agree on the same odd number."
      : "Exactly one admitted property identifies one odd number.",
  };
}

function requirePrototype(prototypeId: ClsCp004PrototypeId): ClsCp004PrototypeDefinition {
  const prototype = CLS_CP004_PROTOTYPE_BY_ID.get(prototypeId);
  if (!prototype) throw new Error(`Unknown CLS-CP-004 prototype: ${prototypeId}`);
  return prototype;
}

function selectIntendedRule(
  prototype: ClsCp004PrototypeDefinition,
  seed: number,
  attempt: number,
): ClsCp004RuleId {
  const index = hashText(`${prototype.prototypeId}:${seed}:${attempt}:rule`) % prototype.allowedRuleIds.length;
  return prototype.allowedRuleIds[index]!;
}

function allowedForPrototype(
  features: ClsCp004NumberFeatures,
  prototype: ClsCp004PrototypeDefinition,
): boolean {
  switch (prototype.generationProfile) {
    case "DIGIT_PRODUCT_OUTLIER":
      return !features.hasZeroDigit && features.digitCount >= 2 && features.digitProduct > 0;
    case "DIGIT_SUM_OUTLIER":
    case "DIGIT_COMPOSITION_OUTLIER":
    case "PALINDROME_STATUS_OUTLIER":
      return features.digitCount >= 2;
    case "NEAR_POWER_OUTLIER":
      return features.nearPowerClass !== "MULTIPLE_NEAR_POWER_RELATIONS";
    default:
      return true;
  }
}

function commonValuePreference(
  ruleId: ClsCp004RuleId,
  value: string,
  seed: number,
): number {
  const inverse = seed % 4 === 3;
  switch (ruleId) {
    case "PERFECT_SQUARE_STATUS":
      return value === (inverse ? "NOT_PERFECT_SQUARE" : "PERFECT_SQUARE") ? 0 : 1;
    case "PERFECT_CUBE_STATUS":
      return value === (inverse ? "NOT_PERFECT_CUBE" : "PERFECT_CUBE") ? 0 : 1;
    case "PALINDROME_STATUS":
      return value === (inverse ? "NOT_PALINDROME" : "PALINDROME") ? 0 : 1;
    case "TRIANGULAR_STATUS":
      return value === (inverse ? "NOT_TRIANGULAR" : "TRIANGULAR") ? 0 : 1;
    case "NEAR_POWER_CLASS":
      return value === "NONE" ? 2 : value === "MULTIPLE_NEAR_POWER_RELATIONS" ? 3 : 0;
    default: {
      const divisor = clsCp004DivisorForRule(ruleId);
      if (divisor !== null) return value === (inverse ? "NOT_DIVISIBLE" : "DIVISIBLE") ? 0 : 1;
      return 0;
    }
  }
}

function viableCommonGroups(
  prototype: ClsCp004PrototypeDefinition,
  ruleId: ClsCp004RuleId,
  optionCount: 4 | 5,
  seed: number,
): { value: string; entries: ClsCp004NumberFeatures[] }[] {
  const groups = VALUES_BY_RULE.get(ruleId)!;
  return [...groups.entries()]
    .map(([value, entries]) => ({
      value,
      entries: entries.filter((features) => allowedForPrototype(features, prototype)),
    }))
    .filter(({ value, entries }) => {
      if (entries.length < optionCount - 1) return false;
      if (ruleId === "DIGIT_PRODUCT" && value === "0") return false;
      if (ruleId === "NEAR_POWER_CLASS" && value === "MULTIPLE_NEAR_POWER_RELATIONS") return false;
      return true;
    })
    .sort((left, right) =>
      commonValuePreference(ruleId, left.value, seed) - commonValuePreference(ruleId, right.value, seed)
      || left.value.localeCompare(right.value),
    );
}

function secondaryDistance(
  candidate: ClsCp004NumberFeatures,
  common: readonly ClsCp004NumberFeatures[],
  intendedRuleId: ClsCp004RuleId,
): number {
  const targetDigitCount = Math.round(common.reduce((sum, entry) => sum + entry.digitCount, 0) / common.length);
  const targetDigitSum = Math.round(common.reduce((sum, entry) => sum + entry.digitSum, 0) / common.length);
  const targetDivisorCount = Math.round(common.reduce((sum, entry) => sum + entry.divisorCount, 0) / common.length);
  let distance = Math.abs(candidate.digitCount - targetDigitCount) * 12;
  distance += Math.min(8, Math.abs(candidate.digitSum - targetDigitSum));
  distance += Math.min(6, Math.abs(candidate.divisorCount - targetDivisorCount));

  if (intendedRuleId !== "PARITY") {
    const parityCounts = common.reduce((counts, entry) => {
      counts[entry.parity] += 1;
      return counts;
    }, { EVEN: 0, ODD: 0 });
    const dominantParity = parityCounts.EVEN >= parityCounts.ODD ? "EVEN" : "ODD";
    if (candidate.parity !== dominantParity) distance += 3;
  }
  if (intendedRuleId !== "DIGIT_PARITY_COMPOSITION") {
    const dominantComposition = common[0]!.digitParityComposition;
    if (common.every((entry) => entry.digitParityComposition === dominantComposition)
      && candidate.digitParityComposition !== dominantComposition) distance += 3;
  }
  return distance;
}

function constructCandidateState(
  prototype: ClsCp004PrototypeDefinition,
  seed: number,
  optionCount: 4 | 5,
  attempt: number,
): CandidateState {
  const intendedRuleId = selectIntendedRule(prototype, seed, attempt);
  const rng = makeRng(seed * MAX_GENERATION_ATTEMPTS + attempt, prototype.prototypeId);
  const commonGroups = viableCommonGroups(prototype, intendedRuleId, optionCount, seed + attempt);
  if (commonGroups.length === 0) throw new Error(`No viable common group for ${intendedRuleId}`);

  const preferredRank = commonValuePreference(intendedRuleId, commonGroups[0]!.value, seed + attempt);
  const preferredGroups = commonGroups.filter((group) =>
    commonValuePreference(intendedRuleId, group.value, seed + attempt) === preferredRank,
  );
  const commonGroup = preferredGroups[rng.int(preferredGroups.length)]!;
  const common = sampleDistinct(commonGroup.entries, optionCount - 1, rng);

  const oddCandidates = CLS_CP004_NUMBER_DOMAIN
    .filter((features) => allowedForPrototype(features, prototype))
    .filter((features) => clsCp004RuleValue(features, intendedRuleId) !== commonGroup.value)
    .filter((features) => !common.some((entry) => entry.value === features.value))
    .sort((left, right) =>
      secondaryDistance(left, common, intendedRuleId) - secondaryDistance(right, common, intendedRuleId)
      || hashText(`${seed}:${attempt}:${left.value}`) - hashText(`${seed}:${attempt}:${right.value}`),
    );
  if (oddCandidates.length === 0) throw new Error(`No odd candidates for ${intendedRuleId}/${commonGroup.value}`);

  const topWindow = Math.min(80, oddCandidates.length);
  const odd = oddCandidates[rng.int(topWindow)]!;
  return {
    intendedRuleId,
    intendedRuleValue: commonGroup.value,
    numbers: [...common.map((entry) => entry.value), odd.value],
  };
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

function propertyStatement(
  ruleId: ClsCp004RuleId,
  value: string,
): string {
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
    case "DIGIT_PRODUCT": return `The non-zero product of the digits in each common number is ${value}.`;
    case "PALINDROME_STATUS": return value === "PALINDROME" ? "Each common number reads the same forwards and backwards." : "Each common number changes when its digits are reversed.";
    case "NEAR_POWER_CLASS": return `Each common number is ${nearPowerText(value as ClsCp004NumberFeatures["nearPowerClass"])}.`;
    case "TRIANGULAR_STATUS": return value === "TRIANGULAR" ? "Each common number is triangular." : "Each common number is not triangular.";
    default: throw new Error(`Unsupported property statement for ${ruleId}`);
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
    default: throw new Error(`Unsupported exact value text for ${ruleId}`);
  }
}

function evidenceByOption(
  numbers: readonly number[],
  ruleId: ClsCp004RuleId,
  commonValue: string,
): string[] {
  return numbers.map((number) => {
    const features = featureFor(number);
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
  const oddFeatures = featureFor(odd);
  const divisor = clsCp004DivisorForRule(ruleId);
  return {
    coreConcept: [propertyStatement(ruleId, commonValue)],
    stepByStep: [
      `${common.slice(0, -1).join(", ")}${common.length > 1 ? ` and ${common.at(-1)}` : ""} follow the same number property.`,
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
      "Use only the declared conventional property; do not invent a formula that merely fits three options.",
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
  audit: ClsCp004AmbiguityAudit,
  optionCount: 4 | 5,
): ClsCp004DifficultyFeatures {
  const demand = computationalDemand(intendedRuleId);
  const maximumDigitCount = Math.max(...numbers.map((number) => featureFor(number).digitCount));
  const distance = nearMissDistance(featureFor(numbers[audit.outlierIndex!]!), intendedRuleId, intendedRuleValue);
  const requiresFactorisation = intendedRuleId === "PRIMALITY_CLASS" || intendedRuleId === "DIVISOR_COUNT";
  const requiresPowerCheck = ["PERFECT_SQUARE_STATUS", "PERFECT_CUBE_STATUS", "NEAR_POWER_CLASS", "TRIANGULAR_STATUS"].includes(intendedRuleId);
  const requiresDigitOperation = intendedRuleId.startsWith("DIGIT_") || intendedRuleId === "PALINDROME_STATUS";
  const score =
    (optionCount === 5 ? 1 : 0)
    + (maximumDigitCount === 3 ? 1 : 0)
    + (demand - 1)
    + Math.max(0, audit.candidateSupports.length - 1)
    + (distance <= 1 ? 1 : 0)
    + (requiresFactorisation ? 1 : 0);
  return {
    optionCount,
    maximumDigitCount,
    computationalDemand: demand,
    candidateRuleCount: audit.candidateSupports.length,
    requiresFactorisation,
    requiresPowerCheck,
    requiresDigitOperation,
    nearMissDistance: distance,
    score,
  };
}

function difficultyFromScore(score: number): ClsCp004Difficulty {
  if (score <= 2) return "EASY";
  if (score <= 5) return "MEDIUM";
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

const GENERATION_CACHE = new Map<string, GeneratedClsCp004Question>();

export function generateClsCp004Prototype(
  prototypeId: ClsCp004PrototypeId,
  seed = 0,
  optionCount: 4 | 5 = 4,
): GeneratedClsCp004Question {
  if (!Number.isSafeInteger(seed) || seed < 0) throw new Error(`Seed must be a non-negative safe integer: ${seed}`);
  if (optionCount !== 4 && optionCount !== 5) throw new Error(`CLS-CP-004 supports four or five options, received ${optionCount}`);
  const prototype = requirePrototype(prototypeId);
  const cacheKey = `${prototypeId}:${seed}:${optionCount}`;
  const cached = GENERATION_CACHE.get(cacheKey);
  if (cached) return cached;

  for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt += 1) {
    let state: CandidateState;
    try {
      state = constructCandidateState(prototype, seed, optionCount, attempt);
    } catch {
      continue;
    }
    const rng = makeRng(seed * MAX_GENERATION_ATTEMPTS + attempt, `${prototypeId}:shuffle`);
    const numbers = shuffled(state.numbers, rng);
    if (new Set(numbers).size !== optionCount) continue;
    const audit = auditClsCp004DisplayedNumbers(numbers, state.intendedRuleId);
    if (audit.result !== "UNIQUE" || !audit.intendedRuleSupported || audit.outlierIndex === null) continue;
    const correctIndex = audit.outlierIndex;
    const features = difficultyFeatures(numbers, state.intendedRuleId, state.intendedRuleValue, audit, optionCount);
    const options = numbers.map(String);
    const question: GeneratedClsCp004Question = {
      checkpointId: "CLS-CP-004",
      prototypeId,
      seed,
      task: "FIND_NUMBER_PROPERTY_OUTLIER",
      generationProfile: prototype.generationProfile,
      stem: stem(seed + attempt),
      numbers,
      options,
      correctIndex,
      answer: options[correctIndex]!,
      intendedRuleId: state.intendedRuleId,
      intendedRuleValue: state.intendedRuleValue,
      evidenceByOption: evidenceByOption(numbers, state.intendedRuleId, state.intendedRuleValue),
      ambiguityAudit: audit,
      difficulty: difficultyFromScore(features.score),
      difficultyFeatures: features,
      explanation: explanation(numbers, correctIndex, state.intendedRuleId, state.intendedRuleValue),
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
    const independent = independentlyVerifyClsCp004Question(question);
    if (independent.result !== "UNIQUE" || independent.outlierIndex !== correctIndex) continue;
    GENERATION_CACHE.set(cacheKey, question);
    return question;
  }

  throw new Error(`${prototypeId}/${seed}/${optionCount} did not produce a unique state`);
}

export function independentlyVerifyClsCp004Question(
  question: GeneratedClsCp004Question,
): ClsCp004AmbiguityAudit {
  return auditClsCp004DisplayedNumbers(question.numbers, question.intendedRuleId);
}

export function getClsCp004PrototypeDefinitions(): readonly ClsCp004PrototypeDefinition[] {
  return CLS_CP004_PROTOTYPES;
}

export function getClsCp004DomainSummary() {
  return {
    datasetVersion: "CLS-CP004-NUMBER-DOMAIN-v1" as const,
    minimum: CLS_CP004_DOMAIN_MINIMUM,
    maximum: CLS_CP004_DOMAIN_MAXIMUM,
    numberCount: CLS_CP004_NUMBER_DOMAIN.length,
    ruleCount: CLS_CP004_RULE_IDS.length,
    prototypeCount: CLS_CP004_PROTOTYPES.length,
    permanentQlCount: 0 as const,
    locale: "en-IN" as const,
  };
}

export { analyzeClsCp004Number };