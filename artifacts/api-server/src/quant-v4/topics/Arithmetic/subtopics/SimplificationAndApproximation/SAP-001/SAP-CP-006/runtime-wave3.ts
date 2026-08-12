import type { SapCp006Option } from "./runtime";

export const SAP_CP006_WAVE3_PROTOTYPE_IDS = [
  "SAP-CP006-PROT-EXACT-ARITHMETIC-DATA-SUFFICIENCY",
] as const;

export type SapCp006Wave3PrototypeId = typeof SAP_CP006_WAVE3_PROTOTYPE_IDS[number];

export const SAP_CP006_DATA_SUFFICIENCY_CLASSES = [
  "I alone is sufficient",
  "II alone is sufficient",
  "Both together are sufficient",
  "Even together are insufficient",
] as const;

export type SapCp006DataSufficiencyClass = typeof SAP_CP006_DATA_SUFFICIENCY_CLASSES[number];

export interface SapCp006Wave3Package {
  prototypeId: SapCp006Wave3PrototypeId;
  proposedPermanentQlId: "SAP-QL-112";
  seed: number;
  difficulty: "HARD";
  taskDirection: "DATA_SUFFICIENCY";
  answerSemantic: "DATA_SUFFICIENCY_CLASS";
  representation: "DATA_SUFFICIENCY";
  stem: string;
  canonicalAnswer: SapCp006DataSufficiencyClass;
  options: readonly SapCp006Option[];
  correctIndex: number;
  explanation: {
    coreConcept: string;
    steps: readonly string[];
    finalAnswer: string;
    verification: readonly string[];
  };
  oracle: {
    kind: SapCp006Wave3PrototypeId;
    data: Readonly<Record<string, number>>;
    firstCandidates: readonly number[];
    secondCandidates: readonly number[];
    combinedCandidates: readonly number[];
  };
  canonicalPayloadKey: string;
  generationIdentity: string;
  validation: { ok: boolean; errors: readonly string[] };
  lifecycle: {
    permanentQlId: null;
    contentStatus: "ENGLISH_REVIEW_CANDIDATE";
    active: false;
    questionStudioDiscoverable: false;
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
  };
}

interface Predicate {
  description: string;
  test: (x: number) => boolean;
}

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

function rng(seed: number): () => number {
  let state = (seed >>> 0) || 0x13198a2e;
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

function rotate<T>(items: readonly T[], offset: number): T[] {
  const shift = ((offset % items.length) + items.length) % items.length;
  return [...items.slice(shift), ...items.slice(0, shift)];
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

function makeOptions(answer: SapCp006DataSufficiencyClass, seed: number): readonly SapCp006Option[] {
  const items: SapCp006Option[] = SAP_CP006_DATA_SUFFICIENCY_CLASSES.map((value) => ({
    value,
    isCorrect: value === answer,
    misconceptionId: value === answer ? null : "DATA_SUFFICIENCY_CLASSIFICATION_ERROR",
    analysis: value === answer
      ? "This class matches the number of allowed x-values left by Statement I, Statement II and their intersection."
      : "This class assigns sufficiency incorrectly after the allowed x-values from the two statements are enumerated exactly.",
  }));
  return Object.freeze(rotate(items, seed % 4));
}

export function generateSapCp006Wave3(
  prototypeId: SapCp006Wave3PrototypeId,
  seed: number,
): SapCp006Wave3Package {
  if (!Number.isInteger(seed) || seed < 1) throw new Error("Seed must be a positive integer.");
  const random = rng(seed * 86028121 + 59);
  const scenario = (seed - 1) % 4;
  const hiddenX = 1 + ((seed * 5 + Math.floor(seed / 4) * 3) % 6);
  const [a, b] = pick(random, FRACTIONS);
  const fractionScale = pickInt(random, 4, 10);
  const fractionBase = b * fractionScale;
  const coefficient = a * fractionScale;
  const p = pickInt(random, 10, 60);
  const percentScale = pickInt(random, 2, 6);
  const percentBase = 100 * percentScale;
  const percentValue = p * percentScale;
  const exactE = coefficient * hiddenX + percentValue;

  const exactPredicate: Predicate = Object.freeze({
    description: `E = ${exactE}`,
    test: (x: number) => coefficient * x + percentValue === exactE,
  });

  const parityPredicate: Predicate = hiddenX % 2 === 0
    ? Object.freeze({
        description: `E − ${percentValue} is divisible by ${2 * coefficient}`,
        test: (x: number) => (coefficient * x) % (2 * coefficient) === 0,
      })
    : Object.freeze({
        description: `E − ${percentValue} is not divisible by ${2 * coefficient}`,
        test: (x: number) => (coefficient * x) % (2 * coefficient) !== 0,
      });

  const residue = hiddenX % 3;
  const residuePredicate: Predicate = Object.freeze({
    description: `when E − ${percentValue} is divided by ${3 * coefficient}, the remainder is ${coefficient * residue}`,
    test: (x: number) => (coefficient * x) % (3 * coefficient) === coefficient * residue,
  });

  const universalPredicate: Predicate = Object.freeze({
    description: `E − ${percentValue} is divisible by ${coefficient}`,
    test: (x: number) => (coefficient * x) % coefficient === 0,
  });

  let first: Predicate;
  let second: Predicate;
  if (scenario === 0) {
    first = exactPredicate;
    second = parityPredicate;
  } else if (scenario === 1) {
    first = parityPredicate;
    second = exactPredicate;
  } else if (scenario === 2) {
    first = parityPredicate;
    second = residuePredicate;
  } else {
    first = parityPredicate;
    second = universalPredicate;
  }

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
    residue,
  });
  const errors: string[] = [];
  if (options.length !== 4 || new Set(options.map((option) => option.value)).size !== 4) errors.push("Data-sufficiency options must contain four distinct classes.");
  if (options.filter((option) => option.isCorrect).length !== 1) errors.push("Exactly one data-sufficiency class must be correct.");
  if (options[correctIndex]?.value !== canonicalAnswer) errors.push("Correct option is not answer-bound.");
  if (!combinedCandidates.includes(hiddenX)) errors.push("The hidden x does not satisfy both generated statements.");

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
      coreConcept: "Data sufficiency asks whether the unknown is uniquely determined, not merely whether a statement is true. Evaluate the mixed expression symbolically enough to test each allowed x-value, then judge Statement I, Statement II and their intersection separately.",
      steps: Object.freeze([
        `${a}/${b} of ${fractionBase} = ${coefficient}, and ${p}% of ${percentBase} = ${percentValue}; therefore E = ${coefficient}x + ${percentValue}.`,
        `Statement I leaves x in {${firstCandidates.join(", ")}}; Statement II leaves x in {${secondCandidates.join(", ")}}; together they leave {${combinedCandidates.join(", ")}}.`,
      ]),
      finalAnswer: `Therefore, ${canonicalAnswer}.`,
      verification: Object.freeze([
        `Re-enumerate x = 1,2,3,4,5,6 independently against Statement I and Statement II.`,
        `The candidate-set sizes are I=${firstCandidates.length}, II=${secondCandidates.length}, together=${combinedCandidates.length}, which gives the class '${canonicalAnswer}'.`,
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
    generationIdentity: `${prototypeId}:seed:${seed}:${JSON.stringify(data)}`,
    validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }),
    lifecycle: LIFECYCLE,
  });
}

export function generateSapCp006Wave3Sweep(count = 400): readonly SapCp006Wave3Package[] {
  if (!Number.isInteger(count) || count < 4) throw new Error("count must be an integer of at least 4.");
  return Object.freeze(Array.from({ length: count }, (_, index) => generateSapCp006Wave3(SAP_CP006_WAVE3_PROTOTYPE_IDS[0], index + 1)));
}
