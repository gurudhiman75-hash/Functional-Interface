import {
  auditClsCp005QuestionAgainstExpandedRegistry,
  CLS_CP005_EXPANDED_RULE_COUNT,
} from "./source-gap-expanded-audit";
import { displayClsCp005Tuple } from "./tuple-domain";
import type { ClsCp005Pair } from "./types";
import {
  auditClsCp005Wave2PresentationQuality,
} from "./wave2-quality-runtime";
import {
  CLS_CP005_WAVE2_DIGIT_PRODUCT_PROTOTYPE_ID,
  CLS_CP005_WAVE2_DIGIT_PRODUCT_RULE_ID,
  CLS_CP005_WAVE2_DIGIT_PRODUCT_VERSION,
  clsCp005DigitProduct,
  independentlyEvaluateClsCp005Wave2DigitProductRule,
} from "./wave2-digit-product-rule";

export const CLS_CP005_WAVE2_RULE_ID = CLS_CP005_WAVE2_DIGIT_PRODUCT_RULE_ID;
export const CLS_CP005_WAVE2_PROTOTYPE_ID = CLS_CP005_WAVE2_DIGIT_PRODUCT_PROTOTYPE_ID;
export const CLS_CP005_WAVE2_VERSION = CLS_CP005_WAVE2_DIGIT_PRODUCT_VERSION;

function hashText(text: string): number {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function canonicalClsCp005Wave2RuleValue(pair: ClsCp005Pair): string | null {
  return independentlyEvaluateClsCp005Wave2DigitProductRule(pair);
}

const MATCHING_PAIRS: readonly ClsCp005Pair[] = Array.from({ length: 87 }, (_, index) => index + 12)
  .filter((value) => value % 10 !== 0)
  .map((value) => [value, clsCp005DigitProduct(value)!] as const)
  .filter(([, product]) => product >= 2);

const DISTRACTOR_POOL: readonly ClsCp005Pair[] = Array.from({ length: 87 }, (_, index) => index + 12)
  .filter((value) => value % 10 !== 0)
  .flatMap((value) => {
    const product = clsCp005DigitProduct(value)!;
    const candidates = [product - 3, product - 2, product - 1, product + 1, product + 2, product + 3]
      .filter((candidate) => candidate >= 2 && candidate <= 81 && candidate !== product);
    return candidates.map((candidate) => [value, candidate] as const);
  });

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
  for (let attempt = 0; attempt < 2400; attempt += 1) {
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
      const pairs = permute([...common, odd], base + attempt * 41 + offset);
      const audit = auditClsCp005QuestionAgainstExpandedRegistry({
        task: "FIND_ODD_NUMBER_PAIR",
        referenceTuple: null,
        tuples: pairs,
        intendedRuleId: CLS_CP005_WAVE2_DIGIT_PRODUCT_RULE_ID,
        intendedRuleValue: "DIGIT_PRODUCT",
      });
      if (audit.result !== "EXPANDED_UNIQUE" || audit.answerIndex === null) continue;
      const presentationQualityAudit = auditClsCp005Wave2PresentationQuality({
        tuples: pairs,
        correctIndex: audit.answerIndex,
      });
      if (presentationQualityAudit.result !== "PASS") continue;
      return {
        pairs,
        correctIndex: audit.answerIndex,
        expandedAmbiguityAudit: audit,
        presentationQualityAudit,
        sourceAttempt: attempt,
      };
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
    wave: "SOURCE_GAP_WAVE_2" as const,
    prototypeId: CLS_CP005_WAVE2_PROTOTYPE_ID,
    permanentQlId: null,
    seed,
    task: "FIND_ODD_NUMBER_PAIR" as const,
    arity: 2 as const,
    stem: stem(seed),
    referenceTuple: null,
    pairs: state.pairs,
    tuples: state.pairs,
    options,
    correctIndex: state.correctIndex,
    answer: options[state.correctIndex]!,
    intendedRuleId: CLS_CP005_WAVE2_DIGIT_PRODUCT_RULE_ID,
    intendedRuleValue: "DIGIT_PRODUCT" as const,
    evidenceByOption: state.pairs.map((pair, index) => explanation(pair, index !== state.correctIndex)),
    expandedAmbiguityAudit: state.expandedAmbiguityAudit,
    ambiguityAudit: {
      result: state.expandedAmbiguityAudit.result,
      answerIndex: state.expandedAmbiguityAudit.answerIndex,
      intendedRuleSupported: state.expandedAmbiguityAudit.intendedRuleSupported,
      candidateSupports: state.expandedAmbiguityAudit.supports,
      completeRuleCount: state.expandedAmbiguityAudit.completeRuleCount,
    },
    presentationQualityAudit: state.presentationQualityAudit,
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
      runtimeVersion: CLS_CP005_WAVE2_DIGIT_PRODUCT_VERSION,
      sourceGapAuditVersion: "cls-cp005-expanded-source-gap-v2-digit-product" as const,
      completeRuleCount: CLS_CP005_EXPANDED_RULE_COUNT,
      sourceAttempt: state.sourceAttempt,
      sourceStatus: "SOURCE_BACKED_WAVE2_DISCOVERY" as const,
      equivalentSetAdmission: "NOT_ADMITTED_PENDING_NATURALNESS_AUDIT" as const,
    },
    lifecycle: {
      permanentQlId: null,
      reviewStatus: "UNREVIEWED_DISCOVERY" as const,
      questionBankStatus: "NOT_STORED" as const,
      testEligibility: "INELIGIBLE" as const,
      publiclyPublishable: false as const,
      questionStudioDiscoverable: false as const,
    },
  };
}
