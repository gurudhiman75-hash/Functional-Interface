import {
  SAP_CP007_WAVE2_CATALOGUE,
  SAP_CP007_WAVE2_PROTOTYPE_IDS,
  generateSapCp007Wave2 as generateV3,
  type SapCp007Wave2Package,
  type SapCp007Wave2PrototypeId,
} from "./runtime-wave2-v3";
import { SAP_CP007_TIE_RULE, roundIntegerToUnitHalfAway, type SapCp007Option } from "./runtime-v4";

export { SAP_CP007_WAVE2_CATALOGUE, SAP_CP007_WAVE2_PROTOTYPE_IDS };
export type { SapCp007Wave2Package, SapCp007Wave2PrototypeId } from "./runtime-wave2-v3";

const LIFECYCLE: SapCp007Wave2Package["lifecycle"] = Object.freeze({
  permanentQlId: null,
  contentStatus: "ENGLISH_REVIEW_CANDIDATE",
  active: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
});

function gcd(a: bigint, b: bigint): bigint {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) [x, y] = [y, x % y];
  return x || 1n;
}

function reducedFraction(numerator: bigint, denominator: bigint): string {
  const divisor = gcd(numerator, denominator);
  return `${numerator / divisor}/${denominator / divisor}`;
}

function correctIndex(seed: number): number {
  const n = seed - 1;
  return (n % 4 + Math.floor(n / 4)) % 4;
}

function wrong(value: string, misconceptionId: string, analysis: string): SapCp007Option {
  return Object.freeze({ value, isCorrect: false, misconceptionId, analysis });
}

function generateRelativeError(seed: number): SapCp007Wave2Package {
  const prototypeId = "SAP-CP007-PROT-RELATIVE-ROUNDING-ERROR" as const;
  const unit = [10, 100, 1000][(seed - 1) % 3]!;
  const k = 2 + seed;
  const original = BigInt((2 * k + 1) * unit / 2);
  const rounded = roundIntegerToUnitHalfAway(original, BigInt(unit));
  const error = rounded >= original ? rounded - original : original - rounded;
  const denominator = 2 * k + 1;
  const answer = reducedFraction(error, original);
  const roundedBaseError = reducedFraction(error, rounded < 0n ? -rounded : rounded);
  const distractors: SapCp007Option[] = [
    wrong(`1/${denominator + 2}`, "RELATIVE_ERROR_DENOMINATOR_HIGH", "This increases the exact original-value denominator by two instead of reducing absolute error divided by the original value."),
    wrong(`1/${denominator - 2}`, "RELATIVE_ERROR_DENOMINATOR_LOW", "This decreases the exact original-value denominator by two and therefore overstates the relative error."),
    wrong(roundedBaseError, "ROUNDED_VALUE_USED_AS_BASE", "This divides the absolute error by the rounded approximation rather than by the exact original value required by the definition of relative rounding error."),
  ];
  const values = new Set([answer, ...distractors.map((option) => option.value)]);
  if (values.size !== 4) throw new Error(`Seed ${seed}: relative-error options collapsed.`);
  const correct: SapCp007Option = Object.freeze({
    value: answer,
    isCorrect: true,
    misconceptionId: null,
    analysis: "This divides the exact absolute rounding error by the exact original value and reduces the fraction completely.",
  });
  const options = [...distractors];
  options.splice(correctIndex(seed), 0, correct);
  const stem = `${original} is rounded to the nearest ${unit}. The rounded value is ${rounded}. What is the relative rounding error, written as a fraction of the original value?`;
  const data = Object.freeze({ unit, k, original: Number(original), rounded: Number(rounded), error: Number(error), denominator, roundedBaseError, v4: 1 });
  const partial: Omit<SapCp007Wave2Package, "validation"> = Object.freeze({
    checkpointId: "SAP-CP-007",
    prototypeId,
    proposedPermanentQlId: "SAP-QL-127",
    seed,
    difficulty: "HARD",
    taskDirection: "ERROR",
    tieRule: SAP_CP007_TIE_RULE,
    stem,
    canonicalAnswer: answer,
    options: Object.freeze(options),
    correctIndex: options.findIndex((option) => option.isCorrect),
    explanation: Object.freeze({
      coreConcept: "Relative rounding error compares the absolute rounding error with the exact original value, not with the rounded approximation. Compute |rounded − original| divided by |original| and reduce that exact ratio completely.",
      steps: Object.freeze([
        `Absolute error = |${rounded} − ${original}| = ${error}.`,
        `Relative error = ${error}/${original} = ${answer} after reducing the fraction.`,
      ]),
      finalAnswer: `Therefore, the answer is ${answer}.`,
      verification: Object.freeze([
        `The original value is an exact midpoint between neighbouring multiples of ${unit}, so the absolute error is ${unit / 2}.`,
        `Reducing (${unit / 2})/${original} independently gives ${answer}; using ${rounded} as the denominator would instead give ${roundedBaseError}.`,
      ]),
    }),
    oracle: Object.freeze({ kind: prototypeId, data }),
    canonicalPayloadKey: JSON.stringify({ prototypeId, stem, answer, data }),
    generationIdentity: `${prototypeId}:v4:seed:${seed}:${JSON.stringify(data)}`,
    lifecycle: LIFECYCLE,
  });
  const errors: string[] = [];
  if (options.length !== 4 || new Set(options.map((option) => option.value)).size !== 4) errors.push("Relative-error options must be four distinct values.");
  if (options.filter((option) => option.isCorrect).length !== 1) errors.push("Exactly one relative-error option must be correct.");
  if (options[partial.correctIndex]?.value !== answer) errors.push("Relative-error correct index is not answer-bound.");
  return Object.freeze({ ...partial, validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }) });
}

export function generateSapCp007Wave2(prototypeId: SapCp007Wave2PrototypeId, seed: number): SapCp007Wave2Package {
  if (!Number.isInteger(seed) || seed < 1) throw new Error("Seed must be a positive integer.");
  if (prototypeId === "SAP-CP007-PROT-RELATIVE-ROUNDING-ERROR") return generateRelativeError(seed);
  return generateV3(prototypeId, seed);
}

export function generateSapCp007Wave2Sweep(seedsPerMode = 100): readonly SapCp007Wave2Package[] {
  return Object.freeze(SAP_CP007_WAVE2_PROTOTYPE_IDS.flatMap((prototypeId) => Array.from({ length: seedsPerMode }, (_, index) => generateSapCp007Wave2(prototypeId, index + 1))));
}
