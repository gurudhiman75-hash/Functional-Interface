import {
  auditClsCp005QuestionAgainstExpandedRegistry,
  CLS_CP005_EXPANDED_RULE_COUNT,
} from "./source-gap-expanded-audit";
import { displayClsCp005Tuple } from "./tuple-domain";
import type { ClsCp005Pair } from "./types";
import { auditClsCp005Wave2PresentationQuality } from "./wave2-quality-runtime";
import {
  CLS_CP005_WAVE2_DIGIT_PRODUCT_RULE_ID,
  clsCp005DigitProduct,
} from "./wave2-digit-product-rule";

export const CLS_CP005_DIGIT_PRODUCT_EQUIVALENT_PROTOTYPE_ID =
  "CLS-CP005-W2-PROT-DIGIT-PRODUCT-EQUIVALENT" as const;
export const CLS_CP005_DIGIT_PRODUCT_EQUIVALENT_VERSION =
  "cls-cp005-wave2-digit-product-equivalent-v1" as const;

function hashText(text: string): number {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

const MATCHES: readonly ClsCp005Pair[] = Array.from({ length: 87 }, (_, index) => index + 12)
  .filter((value) => value % 10 !== 0)
  .map((value) => [value, clsCp005DigitProduct(value)!] as const)
  .filter(([, product]) => product >= 2);

const NON_MATCHES: readonly ClsCp005Pair[] = Array.from({ length: 87 }, (_, index) => index + 12)
  .filter((value) => value % 10 !== 0)
  .flatMap((value) => {
    const product = clsCp005DigitProduct(value)!;
    return [product - 2, product - 1, product + 1, product + 2]
      .filter((candidate) => candidate >= 2 && candidate <= 81 && candidate !== product)
      .map((candidate) => [value, candidate] as const);
  });

function permute<T>(values: readonly T[], seed: number): T[] {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = hashText(`${seed}:${index}`) % (index + 1);
    [result[index], result[swap]] = [result[swap]!, result[index]!];
  }
  return result;
}

function explanation(pair: ClsCp005Pair, matches: boolean): string {
  const [first, second] = pair;
  const tens = Math.floor(first / 10);
  const ones = first % 10;
  const product = tens * ones;
  const reason = matches
    ? `The product of the two digits of ${first} is the second number ${second}.`
    : `The product of the two digits of ${first} is ${product}, not ${second}.`;
  const equation = matches
    ? `\\( ${tens} \\times ${ones} = ${second} \\)`
    : `\\( ${tens} \\times ${ones} = ${product} \\ne ${second} \\)`;
  return `${displayClsCp005Tuple(pair)}: ${reason} ${equation} — ${matches ? "✅ Matches reference rule." : "❌ Does not match reference rule."}`;
}

function constructState(seed: number, optionCount: 4 | 5) {
  const base = hashText(`${CLS_CP005_DIGIT_PRODUCT_EQUIVALENT_PROTOTYPE_ID}:${seed}:${optionCount}`);
  for (let attempt = 0; attempt < 2000; attempt += 1) {
    const reference = MATCHES[(base + attempt * 17) % MATCHES.length]!;
    const match = MATCHES[(base + attempt * 23 + 7) % MATCHES.length]!;
    if (reference[0] === match[0] || reference[1] === match[1]) continue;

    const used = new Set([reference.join(","), match.join(",")]);
    const distractors: ClsCp005Pair[] = [];
    for (let offset = 0; offset < NON_MATCHES.length && distractors.length < optionCount - 1; offset += 1) {
      const pair = NON_MATCHES[(base + attempt * 31 + offset * 37) % NON_MATCHES.length]!;
      const key = pair.join(",");
      if (used.has(key)) continue;
      used.add(key);
      distractors.push(pair);
    }
    if (distractors.length !== optionCount - 1) continue;
    const tuples = permute([match, ...distractors], base + attempt * 41);
    const audit = auditClsCp005QuestionAgainstExpandedRegistry({
      task: "SELECT_EQUIVALENT_NUMBER_SET",
      referenceTuple: reference,
      tuples,
      intendedRuleId: CLS_CP005_WAVE2_DIGIT_PRODUCT_RULE_ID,
      intendedRuleValue: "DIGIT_PRODUCT",
    });
    if (audit.result !== "EXPANDED_UNIQUE" || audit.answerIndex === null) continue;
    const quality = auditClsCp005Wave2PresentationQuality({
      referenceTuple: reference,
      tuples,
      correctIndex: audit.answerIndex,
    });
    if (quality.result !== "PASS") continue;
    return { reference, tuples, correctIndex: audit.answerIndex, audit, quality, attempt };
  }
  throw new Error(`No natural digit-product equivalent state for seed ${seed}`);
}

export function generateClsCp005DigitProductEquivalentQuestion(seed = 0, optionCount: 4 | 5 = 4) {
  if (!Number.isSafeInteger(seed) || seed < 0) throw new Error(`Invalid seed: ${seed}`);
  const state = constructState(seed, optionCount);
  const options = state.tuples.map(displayClsCp005Tuple);
  const answer = options[state.correctIndex]!;
  const referenceExplanation = explanation(state.reference, true)
    .replace("✅ Matches reference rule.", "establishes the reference rule.");
  return {
    checkpointId: "CLS-CP-005" as const,
    wave: "SOURCE_GAP_WAVE_2" as const,
    prototypeId: CLS_CP005_DIGIT_PRODUCT_EQUIVALENT_PROTOTYPE_ID,
    permanentQlId: null,
    seed,
    task: "SELECT_EQUIVALENT_NUMBER_SET" as const,
    arity: 2 as const,
    stem: "Which option follows the same rule as the reference pair?",
    referenceTuple: state.reference,
    tuples: state.tuples,
    options,
    correctIndex: state.correctIndex,
    answer,
    intendedRuleId: CLS_CP005_WAVE2_DIGIT_PRODUCT_RULE_ID,
    intendedRuleValue: "DIGIT_PRODUCT" as const,
    evidenceByOption: state.tuples.map((pair, index) => explanation(pair, index === state.correctIndex)),
    expandedAmbiguityAudit: state.audit,
    presentationQualityAudit: state.quality,
    explanation: {
      coreConcept: ["Reference rule: multiply the two digits of the first number to obtain the second number."],
      stepByStep: [
        `Reference ${referenceExplanation}`,
        `Only ${answer} repeats the same digit-product relation.`,
        `Therefore, ${answer} is correct.`,
      ],
      examSpeedShortcut: ["Multiply the tens digit by the ones digit in each first number and compare the result with the second number."],
      commonTrapWarning: ["Do not reuse the reference numbers; match the relation, not the values."],
    },
    reviewOnly: true as const,
    questionStudioVisible: false as const,
    metadata: {
      locale: "en-IN" as const,
      runtimeVersion: CLS_CP005_DIGIT_PRODUCT_EQUIVALENT_VERSION,
      completeRuleCount: CLS_CP005_EXPANDED_RULE_COUNT,
      sourceAttempt: state.attempt,
      naturalnessStatus: "EXECUTABLE_REVIEW_REQUIRED" as const,
    },
  };
}
