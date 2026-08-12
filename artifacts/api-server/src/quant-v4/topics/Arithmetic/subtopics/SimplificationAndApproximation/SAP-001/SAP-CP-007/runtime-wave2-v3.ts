import {
  SAP_CP007_WAVE2_CATALOGUE,
  SAP_CP007_WAVE2_PROTOTYPE_IDS,
  generateSapCp007Wave2 as generateV2,
  type SapCp007Wave2Package,
  type SapCp007Wave2PrototypeId,
} from "./runtime-wave2-v2";
import { SAP_CP007_TIE_RULE, formatScaled, roundScaledHalfAway, type SapCp007Option } from "./runtime-v4";

export { SAP_CP007_WAVE2_CATALOGUE, SAP_CP007_WAVE2_PROTOTYPE_IDS };
export type { SapCp007Wave2Package, SapCp007Wave2PrototypeId } from "./runtime-wave2-v2";

const LIFECYCLE: SapCp007Wave2Package["lifecycle"] = Object.freeze({
  permanentQlId: null,
  contentStatus: "ENGLISH_REVIEW_CANDIDATE",
  active: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
});

function correctIndex(seed: number): number {
  const n = seed - 1;
  return (n % 4 + Math.floor(n / 4)) % 4;
}

function wrong(value: string, misconceptionId: string, analysis: string): SapCp007Option {
  return Object.freeze({ value, isCorrect: false, misconceptionId, analysis });
}

function makeOptions(answer: string, seed: number): readonly SapCp007Option[] {
  const allWrong = [
    wrong("A < B", "PRECISION_COMPARISON_LT", "This relation does not match the exact one-decimal and two-decimal rounded values when both are written on a common scale."),
    wrong("A = B", "PRECISION_COMPARISON_EQ", "This assumes the two precisions represent the same numerical value without checking the actual rounded digits."),
    wrong("A > B", "PRECISION_COMPARISON_GT", "This reverses or misreads the exact ordering of the two rounded results."),
    wrong("Cannot be determined", "PRECISION_NOT_EVALUATED", "The original number and both rounding instructions are fully specified, so the relation can be determined exactly."),
  ].filter((option) => option.value !== answer).slice(0, 3);
  const correct: SapCp007Option = Object.freeze({
    value: answer,
    isCorrect: true,
    misconceptionId: null,
    analysis: "This relation follows from exact fixed-point rounding at both requested precisions and comparison on a common scale.",
  });
  const options = [...allWrong];
  options.splice(correctIndex(seed), 0, correct);
  return Object.freeze(options);
}

function generatePrecisionComparison(seed: number): SapCp007Wave2Package {
  const prototypeId = "SAP-CP007-PROT-COMPARE-ROUNDED-PRECISIONS" as const;
  const n = seed - 1;
  const whole = 10 + Math.floor(n / 10);
  const tenths = n % 10;
  const relationClass = n % 3;
  const hundredths = relationClass === 0 ? 0 : relationClass === 1 ? 4 : 6;
  const thousandths = 1 + (Math.floor(n / 3) % 4);
  const scaled = BigInt(whole * 1000 + tenths * 100 + hundredths * 10 + thousandths);
  const oneDp = roundScaledHalfAway(scaled, 3, 1);
  const twoDp = roundScaledHalfAway(scaled, 3, 2);
  const oneDpOnHundredths = oneDp * 10n;
  const relation = oneDpOnHundredths < twoDp ? "A < B" : oneDpOnHundredths > twoDp ? "A > B" : "A = B";
  const expected = relationClass === 0 ? "A = B" : relationClass === 1 ? "A < B" : "A > B";
  if (relation !== expected) throw new Error(`Seed ${seed}: precision relation ${relation} did not match designed class ${expected}.`);
  const original = formatScaled(scaled, 3);
  const a = formatScaled(oneDp, 1);
  const b = formatScaled(twoDp, 2);
  const stem = `For ${original}, let A be the value rounded to 1 decimal place and B the value rounded to 2 decimal places. Which relation is correct?`;
  const data = Object.freeze({ scaled: Number(scaled), inputDp: 3, oneDpScaled: Number(oneDp), twoDpScaled: Number(twoDp), relation, relationClass, v3: 1 });
  const options = makeOptions(relation, seed);
  const partial: Omit<SapCp007Wave2Package, "validation"> = Object.freeze({
    checkpointId: "SAP-CP-007",
    prototypeId,
    proposedPermanentQlId: "SAP-QL-125",
    seed,
    difficulty: "MEDIUM",
    taskDirection: "COMPARISON",
    tieRule: SAP_CP007_TIE_RULE,
    stem,
    canonicalAnswer: relation,
    options,
    correctIndex: options.findIndex((option) => option.isCorrect),
    explanation: Object.freeze({
      coreConcept: "Rounded results at different decimal precisions must be compared as numbers, not by the number of digits displayed. Round the same exact original at both precisions, put the answers on a common fixed-point scale, and then compare them.",
      steps: Object.freeze([
        `Round ${original} to 1 decimal place: A = ${a}. Round it independently to 2 decimal places: B = ${b}.`,
        `Write A on the hundredths scale as ${formatScaled(oneDpOnHundredths, 2)} and compare it with B = ${b}; therefore ${relation}.`,
      ]),
      finalAnswer: `Therefore, the answer is ${relation}.`,
      verification: Object.freeze([
        `A corresponds to ${oneDpOnHundredths} hundredths and B to ${twoDp} hundredths.`,
        `Direct integer comparison of those two exact fixed-point values gives ${relation}.`,
      ]),
    }),
    oracle: Object.freeze({ kind: prototypeId, data }),
    canonicalPayloadKey: JSON.stringify({ prototypeId, stem, answer: relation, data }),
    generationIdentity: `${prototypeId}:v3:seed:${seed}:${JSON.stringify(data)}`,
    lifecycle: LIFECYCLE,
  });
  const errors: string[] = [];
  if (options.length !== 4 || new Set(options.map((option) => option.value)).size !== 4) errors.push("Comparison options must be four distinct values.");
  if (options.filter((option) => option.isCorrect).length !== 1) errors.push("Exactly one comparison option must be correct.");
  if (options[partial.correctIndex]?.value !== relation) errors.push("Comparison correct index is not answer-bound.");
  return Object.freeze({ ...partial, validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }) });
}

export function generateSapCp007Wave2(prototypeId: SapCp007Wave2PrototypeId, seed: number): SapCp007Wave2Package {
  if (!Number.isInteger(seed) || seed < 1) throw new Error("Seed must be a positive integer.");
  if (prototypeId === "SAP-CP007-PROT-COMPARE-ROUNDED-PRECISIONS") return generatePrecisionComparison(seed);
  return generateV2(prototypeId, seed);
}

export function generateSapCp007Wave2Sweep(seedsPerMode = 100): readonly SapCp007Wave2Package[] {
  return Object.freeze(SAP_CP007_WAVE2_PROTOTYPE_IDS.flatMap((prototypeId) => Array.from({ length: seedsPerMode }, (_, index) => generateSapCp007Wave2(prototypeId, index + 1))));
}
