import { canonicalClsCp005RuleValue, displayClsCp005Tuple } from "./tuple-domain";
import { CLS_CP005_RULE_IDS } from "./relation-registry";
import type { ClsCp005Pair, ClsCp005RuleId } from "./types";

export const CLS_CP005_WAVE2_RULE_ID = "PAIR_FIRST_DIGIT_PRODUCT_TO_SECOND" as const;
export const CLS_CP005_WAVE2_PROTOTYPE_ID = "CLS-CP005-PROT-W2-001" as const;
export const CLS_CP005_WAVE2_VERSION = "cls-cp005-wave2-digit-product-v1" as const;

type Wave2RuleId = ClsCp005RuleId | typeof CLS_CP005_WAVE2_RULE_ID;

type Support = {
  readonly ruleId: Wave2RuleId;
  readonly commonValue: string;
  readonly answerIndex: number;
};

function hashText(text: string): number {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function digitProduct(value: number): number | null {
  if (value < 10 || value > 99 || value % 10 === 0) return null;
  return Math.floor(value / 10) * (value % 10);
}

export function canonicalClsCp005Wave2RuleValue(pair: ClsCp005Pair): string | null {
  const product = digitProduct(pair[0]);
  return product !== null && product === pair[1] ? "DIGIT_PRODUCT" : null;
}

function ruleValue(pair: ClsCp005Pair, ruleId: Wave2RuleId): string | null {
  return ruleId === CLS_CP005_WAVE2_RULE_ID
    ? canonicalClsCp005Wave2RuleValue(pair)
    : canonicalClsCp005RuleValue(pair, ruleId);
}

const ALL_RULE_IDS: readonly Wave2RuleId[] = [
  ...CLS_CP005_RULE_IDS,
  CLS_CP005_WAVE2_RULE_ID,
];

const MATCHING_PAIRS: readonly ClsCp005Pair[] = Array.from({ length: 87 }, (_, index) => index + 12)
  .filter((value) => value % 10 !== 0)
  .map((value) => [value, digitProduct(value)!] as const)
  .filter(([, product]) => product >= 2);

const DISTRACTOR_POOL: readonly ClsCp005Pair[] = Array.from({ length: 87 }, (_, index) => index + 12)
  .filter((value) => value % 10 !== 0)
  .flatMap((value) => {
    const product = digitProduct(value)!;
    const candidates = [product - 3, product - 2, product - 1, product + 1, product + 2, product + 3]
      .filter((candidate) => candidate >= 2 && candidate <= 81 && candidate !== product);
    return candidates.map((candidate) => [value, candidate] as const);
  });

function supportsFor(pairs: readonly ClsCp005Pair[]): readonly Support[] {
  const supports: Support[] = [];
  for (const ruleId of ALL_RULE_IDS) {
    const values = pairs.map((pair) => ruleValue(pair, ruleId));
    const counts = new Map<string, number[]>();
    values.forEach((value, index) => {
      if (value === null) return;
      const indexes = counts.get(value) ?? [];
      indexes.push(index);
      counts.set(value, indexes);
    });
    for (const [value, indexes] of counts) {
      if (indexes.length !== pairs.length - 1) continue;
      const answerIndex = pairs.findIndex((_, index) => !indexes.includes(index));
      if (answerIndex >= 0) supports.push({ ruleId, commonValue: value, answerIndex });
    }
  }
  return supports;
}

function permute<T>(values: readonly T[], seed: number): T[] {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = hashText(`${seed}:${index}`) % (index + 1);
    [result[index], result[swap]] = [result[swap]!, result[index]!];
  }
  return result;
}

function constructState(seed: number, optionCount: 4 | 5) {
  const base = hashText(`${CLS_CP005_WAVE2_PROTOTYPE_ID}:${seed}:${optionCount}`);
  for (let attempt = 0; attempt < 2000; attempt += 1) {
    const common: ClsCp005Pair[] = [];
    const used = new Set<string>();
    for (let offset = 0; offset < MATCHING_PAIRS.length && common.length < optionCount - 1; offset += 1) {
      const pair = MATCHING_PAIRS[(base + attempt * 17 + offset * 23) % MATCHING_PAIRS.length]!;
      const key = pair.join(",");
      if (used.has(key)) continue;
      used.add(key);
      common.push(pair);
    }
    if (common.length !== optionCount - 1) continue;

    for (let offset = 0; offset < DISTRACTOR_POOL.length; offset += 1) {
      const odd = DISTRACTOR_POOL[(base + attempt * 31 + offset * 37) % DISTRACTOR_POOL.length]!;
      if (used.has(odd.join(","))) continue;
      const candidate = permute([...common, odd], base + attempt * 41 + offset);
      const supports = supportsFor(candidate);
      const intended = supports.filter((support) => support.ruleId === CLS_CP005_WAVE2_RULE_ID);
      if (intended.length !== 1) continue;
      if (supports.some((support) => support.answerIndex !== intended[0]!.answerIndex)) continue;
      return { pairs: candidate, correctIndex: intended[0]!.answerIndex, supports };
    }
  }
  throw new Error(`Wave 2 digit-product state could not be constructed for seed ${seed}`);
}

function stem(seed: number): string {
  const stems = [
    "Which number pair is different from the others?",
    "Find the pair that does not follow the same rule as the others.",
    "Choose the odd number pair.",
    "Which pair has a different relation between its two numbers?",
    "Select the pair that does not belong with the rest.",
  ] as const;
  return stems[hashText(`stem:${seed}`) % stems.length]!;
}

function explanation(pair: ClsCp005Pair, matches: boolean): string {
  const [first, second] = pair;
  const tens = Math.floor(first / 10);
  const ones = first % 10;
  const product = tens * ones;
  const reason = matches
    ? `Multiplying the two digits of ${first} gives the second number ${second}.`
    : `Multiplying the two digits of ${first} gives ${product}, not the second number ${second}.`;
  const equation = matches
    ? `\\( ${tens} \\times ${ones} = ${second} \\)`
    : `\\( ${tens} \\times ${ones} = ${product} \\ne ${second} \\)`;
  return `${displayClsCp005Tuple(pair)}: ${reason} ${equation} — ${matches ? "✅ Matches rule." : "❌ Fails rule."}`;
}

export function generateClsCp005Wave2DigitProductQuestion(seed = 0, optionCount: 4 | 5 = 4) {
  if (!Number.isSafeInteger(seed) || seed < 0) throw new Error(`Invalid seed: ${seed}`);
  if (optionCount !== 4 && optionCount !== 5) throw new Error(`Invalid option count: ${optionCount}`);
  const state = constructState(seed, optionCount);
  const options = state.pairs.map(displayClsCp005Tuple);
  return {
    checkpointId: "CLS-CP-005" as const,
    prototypeId: CLS_CP005_WAVE2_PROTOTYPE_ID,
    permanentQlId: null,
    seed,
    task: "FIND_ODD_NUMBER_PAIR" as const,
    stem: stem(seed),
    pairs: state.pairs,
    options,
    correctIndex: state.correctIndex,
    answer: options[state.correctIndex]!,
    intendedRuleId: CLS_CP005_WAVE2_RULE_ID,
    evidenceByOption: state.pairs.map((pair, index) => explanation(pair, index !== state.correctIndex)),
    ambiguityAudit: {
      result: "UNIQUE" as const,
      answerIndex: state.correctIndex,
      candidateSupports: state.supports,
      completeRuleCount: ALL_RULE_IDS.length,
    },
    explanation: {
      coreConcept: ["Rule: multiply the two digits of the first number to obtain the second number."],
      stepByStep: [
        "Apply the same digit-product rule to the first number in every pair.",
        `${state.pairs.filter((_, index) => index !== state.correctIndex).map(displayClsCp005Tuple).join(", ")} follow the rule, while ${options[state.correctIndex]} does not.`,
        `Therefore, ${options[state.correctIndex]} is the odd pair.`,
      ],
      examSpeedShortcut: ["Multiply the tens digit by the ones digit in each first number and compare it with the second number."],
      commonTrapWarning: ["Use the digits of the first number only; do not multiply the two complete numbers in the pair."],
    },
    reviewOnly: true as const,
    questionStudioVisible: false as const,
    metadata: {
      locale: "en-IN" as const,
      runtimeVersion: CLS_CP005_WAVE2_VERSION,
      sourceStatus: "SOURCE_BACKED_WAVE2_DISCOVERY" as const,
      equivalentSetAdmission: "NOT_ADMITTED_PENDING_NATURALNESS_AUDIT" as const,
    },
  };
}
