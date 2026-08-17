import type { SapCp006Option } from "./runtime";
import {
  SAP_CP006_DATA_SUFFICIENCY_CLASSES,
  SAP_CP006_WAVE3_PROTOTYPE_IDS,
  type SapCp006DataSufficiencyClass,
  type SapCp006Wave3Package,
  type SapCp006Wave3PrototypeId,
} from "./runtime-wave3";

export {
  SAP_CP006_DATA_SUFFICIENCY_CLASSES,
  SAP_CP006_WAVE3_PROTOTYPE_IDS,
};
export type {
  SapCp006DataSufficiencyClass,
  SapCp006Wave3Package,
  SapCp006Wave3PrototypeId,
} from "./runtime-wave3";

const DOMAIN = Object.freeze([1, 2, 3, 4, 5, 6]);
const FRACTIONS = [[1,2],[1,4],[3,4],[2,5],[3,5],[4,5],[2,3],[5,6],[3,8],[5,8]] as const;
const LIFECYCLE: SapCp006Wave3Package["lifecycle"] = {
  permanentQlId: null,
  contentStatus: "ENGLISH_REVIEW_CANDIDATE",
  active: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
};

const PREDICATE_EXACT = 0;
const PREDICATE_GREATER_THAN = 1;
const PREDICATE_LESS_THAN = 2;
const PREDICATE_GREATER_OR_EQUAL = 3;
const PREDICATE_LESS_OR_EQUAL = 4;

type PredicateKind = 0 | 1 | 2 | 3 | 4;

interface Predicate {
  kind: PredicateKind;
  threshold: number;
  description: string;
  test: (x: number) => boolean;
}

function rng(seed: number): () => number {
  let state = (seed >>> 0) || 0x9e3779b9;
  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickInt(random: () => number, min: number, max: number): number {
  return min + Math.floor(random() * (max - min + 1));
}

function pick<T>(random: () => number, values: readonly T[]): T {
  return values[Math.floor(random() * values.length)]!;
}

function independentCorrectIndex(seed: number): number {
  const zeroBased = seed - 1;
  const withinBlock = zeroBased % 4;
  const block = Math.floor(zeroBased / 4);
  return (withinBlock + block) % 4;
}

function classify(
  firstCandidates: readonly number[],
  secondCandidates: readonly number[],
  combinedCandidates: readonly number[],
): SapCp006DataSufficiencyClass {
  const firstSufficient = firstCandidates.length === 1;
  const secondSufficient = secondCandidates.length === 1;
  const combinedSufficient = combinedCandidates.length === 1;
  if (firstSufficient && !secondSufficient) return "I alone is sufficient";
  if (!firstSufficient && secondSufficient) return "II alone is sufficient";
  if (!firstSufficient && !secondSufficient && combinedSufficient) return "Both together are sufficient";
  return "Even together are insufficient";
}

function predicate(
  kind: PredicateKind,
  threshold: number,
  coefficient: number,
  percentValue: number,
): Predicate {
  const expressionValue = (x: number) => coefficient * x + percentValue;
  if (kind === PREDICATE_EXACT) {
    return Object.freeze({ kind, threshold, description: `E = ${threshold}`, test: (x: number) => expressionValue(x) === threshold });
  }
  if (kind === PREDICATE_GREATER_THAN) {
    return Object.freeze({ kind, threshold, description: `E > ${threshold}`, test: (x: number) => expressionValue(x) > threshold });
  }
  if (kind === PREDICATE_LESS_THAN) {
    return Object.freeze({ kind, threshold, description: `E < ${threshold}`, test: (x: number) => expressionValue(x) < threshold });
  }
  if (kind === PREDICATE_GREATER_OR_EQUAL) {
    return Object.freeze({ kind, threshold, description: `E ≥ ${threshold}`, test: (x: number) => expressionValue(x) >= threshold });
  }
  return Object.freeze({ kind, threshold, description: `E ≤ ${threshold}`, test: (x: number) => expressionValue(x) <= threshold });
}

function makeOptions(answer: SapCp006DataSufficiencyClass, seed: number): readonly SapCp006Option[] {
  const correctIndex = independentCorrectIndex(seed);
  const correct: SapCp006Option = Object.freeze({
    value: answer,
    isCorrect: true,
    misconceptionId: null,
    analysis: "This class matches the exact number of allowed x-values left by Statement I, Statement II and their intersection.",
  });
  const wrong = SAP_CP006_DATA_SUFFICIENCY_CLASSES
    .filter((value) => value !== answer)
    .map((value): SapCp006Option => Object.freeze({
      value,
      isCorrect: false,
      misconceptionId: "DATA_SUFFICIENCY_CLASSIFICATION_ERROR",
      analysis: "This class misjudges whether Statement I, Statement II, or their combined candidate set leaves exactly one allowed value of x.",
    }));
  const options = [...wrong];
  options.splice(correctIndex, 0, correct);
  return Object.freeze(options);
}

export function generateSapCp006Wave3(
  prototypeId: SapCp006Wave3PrototypeId,
  seed: number,
): SapCp006Wave3Package {
  if (!Number.isInteger(seed) || seed < 1) throw new Error("Seed must be a positive integer.");
  const random = rng(seed * 86028121 + 137);
  const scenario = (seed - 1) % 4;
  const hiddenX = 2 + ((seed * 5 + Math.floor((seed - 1) / 4) * 3) % 4);
  const [a, b] = pick(random, FRACTIONS);
  const fractionScale = pickInt(random, 4, 10);
  const fractionBase = b * fractionScale;
  const coefficient = a * fractionScale;
  const p = pickInt(random, 10, 60);
  const percentScale = pickInt(random, 2, 6);
  const percentBase = 100 * percentScale;
  const percentValue = p * percentScale;
  const exactE = coefficient * hiddenX + percentValue;

  let firstKind: PredicateKind;
  let firstThreshold: number;
  let secondKind: PredicateKind;
  let secondThreshold: number;

  if (scenario === 0) {
    // I uniquely identifies x; II deliberately leaves several candidates.
    firstKind = PREDICATE_EXACT;
    firstThreshold = exactE;
    secondKind = PREDICATE_GREATER_THAN;
    secondThreshold = exactE - 2 * coefficient;
  } else if (scenario === 1) {
    // II uniquely identifies x; I deliberately leaves several candidates.
    firstKind = PREDICATE_LESS_THAN;
    firstThreshold = exactE + 2 * coefficient;
    secondKind = PREDICATE_EXACT;
    secondThreshold = exactE;
  } else if (scenario === 2) {
    // Each bound leaves multiple values, but together they isolate hiddenX.
    firstKind = PREDICATE_GREATER_THAN;
    firstThreshold = exactE - coefficient;
    secondKind = PREDICATE_LESS_THAN;
    secondThreshold = exactE + coefficient;
  } else {
    // The two wider inclusive bounds still leave three consecutive x-values.
    firstKind = PREDICATE_GREATER_OR_EQUAL;
    firstThreshold = exactE - coefficient;
    secondKind = PREDICATE_LESS_OR_EQUAL;
    secondThreshold = exactE + coefficient;
  }

  const first = predicate(firstKind, firstThreshold, coefficient, percentValue);
  const second = predicate(secondKind, secondThreshold, coefficient, percentValue);
  const firstCandidates = Object.freeze(DOMAIN.filter(first.test));
  const secondCandidates = Object.freeze(DOMAIN.filter(second.test));
  const combinedCandidates = Object.freeze(DOMAIN.filter((x) => first.test(x) && second.test(x)));
  const canonicalAnswer = classify(firstCandidates, secondCandidates, combinedCandidates);
  const options = makeOptions(canonicalAnswer, seed);
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const stem = `For integer x from 1 to 6, E = x × ${a}/${b} of ${fractionBase} + ${p}% of ${percentBase}. Can x be determined uniquely? Statement I: ${first.description}. Statement II: ${second.description}.`;
  const data = Object.freeze({
    scenario,
    hiddenX,
    a,
    b,
    fractionBase,
    coefficient,
    p,
    percentBase,
    percentValue,
    exactE,
    firstKind,
    firstThreshold,
    secondKind,
    secondThreshold,
    editorialMode: 3,
  });

  const expectedClass = scenario === 0
    ? "I alone is sufficient"
    : scenario === 1
      ? "II alone is sufficient"
      : scenario === 2
        ? "Both together are sufficient"
        : "Even together are insufficient";
  const errors: string[] = [];
  if (canonicalAnswer !== expectedClass) errors.push(`Scenario ${scenario} produced ${canonicalAnswer}, expected ${expectedClass}.`);
  if (options.length !== 4 || new Set(options.map((option) => option.value)).size !== 4) errors.push("Data-sufficiency options must contain four distinct classes.");
  if (options.filter((option) => option.isCorrect).length !== 1) errors.push("Exactly one data-sufficiency class must be correct.");
  if (options[correctIndex]?.value !== canonicalAnswer) errors.push("Correct option is not answer-bound.");
  if (!combinedCandidates.includes(hiddenX)) errors.push("The hidden x does not satisfy both generated statements.");
  if (/[Dd]ivis|remainder|parity/.test(stem)) errors.push("Number-system vocabulary leaked into arithmetic data sufficiency.");

  return Object.freeze({
    prototypeId,
    proposedPermanentQlId: "SAP-QL-112",
    seed,
    difficulty: "HARD",
    taskDirection: "DATA_SUFFICIENCY",
    answerSemantic: "DATA_SUFFICIENCY_CLASS",
    representation: "DATA_SUFFICIENCY",
    stem,
    canonicalAnswer,
    options,
    correctIndex,
    explanation: Object.freeze({
      coreConcept: "Data sufficiency asks whether the unknown is uniquely determined, not merely whether a statement is true. First reduce the mixed arithmetic to a simple exact expression for E, then test the allowed x-values against each numeric statement and against both together.",
      steps: Object.freeze([
        `${a}/${b} of ${fractionBase} = ${coefficient}, and ${p}% of ${percentBase} = ${percentValue}; therefore E = ${coefficient}x + ${percentValue}.`,
        `Statement I leaves x in {${firstCandidates.join(", ")}}; Statement II leaves x in {${secondCandidates.join(", ")}}; together they leave {${combinedCandidates.join(", ")}}.`,
      ]),
      finalAnswer: `Therefore, ${canonicalAnswer}.`,
      verification: Object.freeze([
        `Substitute x = 1,2,3,4,5,6 independently into E = ${coefficient}x + ${percentValue}.`,
        `The candidate-set sizes are I=${firstCandidates.length}, II=${secondCandidates.length}, together=${combinedCandidates.length}; these sizes give '${canonicalAnswer}'.`,
      ]),
    }),
    oracle: Object.freeze({
      kind: prototypeId,
      data,
      firstCandidates,
      secondCandidates,
      combinedCandidates,
    }),
    canonicalPayloadKey: JSON.stringify({ prototypeId, stem, answer: canonicalAnswer, data }),
    generationIdentity: `${prototypeId}:ARITHMETIC-DS-V3:seed:${seed}:${JSON.stringify(data)}`,
    validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }),
    lifecycle: LIFECYCLE,
  });
}

export function generateSapCp006Wave3Sweep(count = 400): readonly SapCp006Wave3Package[] {
  if (!Number.isInteger(count) || count < 4) throw new Error("count must be an integer of at least 4.");
  return Object.freeze(Array.from({ length: count }, (_, index) => generateSapCp006Wave3(SAP_CP006_WAVE3_PROTOTYPE_IDS[0], index + 1)));
}
