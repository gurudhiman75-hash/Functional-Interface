import {
  SAP_CP007_CATALOGUE,
  SAP_CP007_PROTOTYPE_IDS,
  SAP_CP007_TIE_RULE,
  formatScaled,
  generateSapCp007 as generateV2,
  roundIntegerToUnitHalfAway,
  roundScaledHalfAway,
  type SapCp007Difficulty,
  type SapCp007Option,
  type SapCp007Package,
  type SapCp007PrototypeId,
  type SapCp007TaskDirection,
} from "./runtime-v2";

export {
  SAP_CP007_CATALOGUE,
  SAP_CP007_PROTOTYPE_IDS,
  SAP_CP007_TIE_RULE,
  formatScaled,
  roundIntegerToUnitHalfAway,
  roundScaledHalfAway,
};
export type {
  SapCp007Difficulty,
  SapCp007Option,
  SapCp007Package,
  SapCp007PrototypeId,
  SapCp007TaskDirection,
} from "./runtime-v2";

const LIFECYCLE: SapCp007Package["lifecycle"] = Object.freeze({
  permanentQlId: null,
  contentStatus: "ENGLISH_REVIEW_CANDIDATE",
  active: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
});

function correctIndex(seed: number): number {
  const zeroBased = seed - 1;
  return (zeroBased % 4 + Math.floor(zeroBased / 4)) % 4;
}

function buildPackage(
  prototypeId: SapCp007PrototypeId,
  seed: number,
  generated: {
    stem: string;
    answer: string;
    options: readonly SapCp007Option[];
    data: Readonly<Record<string, number | string>>;
    coreConcept: string;
    steps: readonly string[];
    verification: readonly string[];
    version: string;
  },
): SapCp007Package {
  const catalogue = SAP_CP007_CATALOGUE.find((item) => item.prototypeId === prototypeId)!;
  const partial: Omit<SapCp007Package, "validation"> = Object.freeze({
    checkpointId: "SAP-CP-007",
    prototypeId,
    proposedPermanentQlId: catalogue.proposedPermanentQlId,
    seed,
    difficulty: catalogue.difficulty as SapCp007Difficulty,
    taskDirection: catalogue.taskDirection as SapCp007TaskDirection,
    tieRule: SAP_CP007_TIE_RULE,
    stem: generated.stem,
    canonicalAnswer: generated.answer,
    options: generated.options,
    correctIndex: generated.options.findIndex((option) => option.isCorrect),
    explanation: Object.freeze({
      coreConcept: generated.coreConcept,
      steps: Object.freeze(generated.steps),
      finalAnswer: `Therefore, the answer is ${generated.answer}.`,
      verification: Object.freeze(generated.verification),
    }),
    oracle: Object.freeze({ kind: prototypeId, data: generated.data }),
    canonicalPayloadKey: JSON.stringify({ prototypeId, stem: generated.stem, answer: generated.answer, data: generated.data }),
    generationIdentity: `${prototypeId}:${generated.version}:seed:${seed}:${JSON.stringify(generated.data)}`,
    lifecycle: LIFECYCLE,
  });
  const errors: string[] = [];
  if (partial.options.length !== 4) errors.push("Exactly four options are required.");
  if (new Set(partial.options.map((option) => option.value)).size !== 4) errors.push("Options must be distinct.");
  if (partial.options.filter((option) => option.isCorrect).length !== 1) errors.push("Exactly one option must be correct.");
  if (partial.options[partial.correctIndex]?.value !== partial.canonicalAnswer) errors.push("Correct index is not answer-bound.");
  if (partial.explanation.steps.length < 2 || partial.explanation.verification.length < 2) errors.push("Explanation and verification each need at least two steps.");
  return Object.freeze({ ...partial, validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }) });
}

function insertCorrect(answer: string, seed: number, wrong: readonly SapCp007Option[]): readonly SapCp007Option[] {
  const correct: SapCp007Option = Object.freeze({
    value: answer,
    isCorrect: true,
    misconceptionId: null,
    analysis: "This option follows the declared rounding place, representation and tie rule exactly.",
  });
  const values = new Set([answer, ...wrong.map((option) => option.value)]);
  if (wrong.length !== 3 || values.size !== 4) throw new Error(`CP-007 options collapsed for ${answer}.`);
  const options = [...wrong];
  options.splice(correctIndex(seed), 0, correct);
  return Object.freeze(options);
}

function makeNegativeTieOptions(answer: string, rounded: bigint, targetDp: number, seed: number): readonly SapCp007Option[] {
  return insertCorrect(answer, seed, [
    Object.freeze({
      value: formatScaled(rounded + 1n, targetDp),
      isCorrect: false,
      misconceptionId: "NEGATIVE_TIE_TOWARD_ZERO",
      analysis: "This moves the negative halfway value toward zero, which directly contradicts the tie rule stated in the question.",
    }),
    Object.freeze({
      value: formatScaled(rounded - 1n, targetDp),
      isCorrect: false,
      misconceptionId: "NEGATIVE_TIE_EXTRA_STEP",
      analysis: "This moves one extra retained unit away from zero after the halfway adjustment has already been completed.",
    }),
    Object.freeze({
      value: formatScaled(-rounded, targetDp),
      isCorrect: false,
      misconceptionId: "NEGATIVE_SIGN_DROPPED",
      analysis: "This preserves the rounded magnitude but incorrectly removes the negative sign from the original number.",
    }),
  ]);
}

function generateNegativeHalfway(seed: number): SapCp007Package {
  const prototypeId = "SAP-CP007-PROT-NEGATIVE-HALFWAY-EXPLICIT-RULE" as const;
  const targetDp = seed % 2 === 0 ? 0 : 1;
  const inputDp = targetDp + 1;
  const retainedMagnitude = targetDp === 0 ? 20 + seed * 3 : 200 + seed * 7;
  const scaled = -BigInt(retainedMagnitude * 10 + 5);
  const rounded = roundScaledHalfAway(scaled, inputDp, targetDp);
  const answer = formatScaled(rounded, targetDp);
  const original = formatScaled(scaled, inputDp);
  return buildPackage(prototypeId, seed, {
    stem: `Use this rule: if a value is exactly halfway, round away from zero. Round ${original} to ${targetDp === 0 ? "the nearest integer" : "1 decimal place"}.`,
    answer,
    options: makeNegativeTieOptions(answer, rounded, targetDp, seed),
    data: Object.freeze({ scaled: Number(scaled), inputDp, targetDp, roundedScaled: Number(rounded), retainedMagnitude, exactHalfway: 1, v3: 1 }),
    coreConcept: "An exact halfway value is equidistant from the two neighbouring rounded values, so the declared tie rule is decisive. Under half away from zero, a negative midpoint is rounded to the neighbour with the larger absolute magnitude, not toward zero.",
    steps: Object.freeze([
      `${original} is exactly halfway between the two neighbouring values at the requested precision.`,
      `The declared rule says to move away from zero, so choose the negative neighbour with the larger absolute magnitude: ${answer}.`,
    ]),
    verification: Object.freeze([
      `The discarded part is exactly half of one unit at the requested precision.`,
      `${answer} is the equidistant neighbour farther from zero, so it satisfies the declared tie rule.`,
    ]),
    version: "v3",
  });
}

function unforcedDecimal(value: bigint): string {
  return formatScaled(value, 2).replace(/0+$/, "").replace(/\.$/, "");
}

function generatePrecisionRepresentation(seed: number): SapCp007Package {
  const prototypeId = "SAP-CP007-PROT-CORRECT-PRECISION-REPRESENTATION" as const;
  // 10 whole-number states × 10 tenths states = 100 distinct review states.
  const zeroBased = seed - 1;
  const whole = 10 + Math.floor(zeroBased / 10);
  const tenths = zeroBased % 10;
  const thousandths = 1 + (zeroBased % 4);
  const scaled = BigInt(whole * 1000 + tenths * 100 + thousandths);
  const rounded = roundScaledHalfAway(scaled, 3, 2);
  const answer = formatScaled(rounded, 2);
  const original = formatScaled(scaled, 3);
  const wrong: readonly SapCp007Option[] = Object.freeze([
    Object.freeze({
      value: unforcedDecimal(rounded),
      isCorrect: false,
      misconceptionId: "TRAILING_ZERO_DROPPED",
      analysis: "This has the same numerical value but does not display the two decimal places explicitly required by the question.",
    }),
    Object.freeze({
      value: original,
      isCorrect: false,
      misconceptionId: "NOT_ROUNDED",
      analysis: "This repeats the original three-decimal number instead of giving the requested two-decimal rounded representation.",
    }),
    Object.freeze({
      value: formatScaled(rounded + 1n, 2),
      isCorrect: false,
      misconceptionId: "UNJUSTIFIED_ROUND_UP",
      analysis: "The third decimal digit is below 5, so increasing the hundredths place is not justified under the declared rule.",
    }),
  ]);
  return buildPackage(prototypeId, seed, {
    stem: `Which is the correct representation of ${original} rounded to 2 decimal places?`,
    answer,
    options: insertCorrect(answer, seed, wrong),
    data: Object.freeze({ scaled: Number(scaled), inputDp: 3, targetDp: 2, roundedScaled: Number(rounded), trailingZeroRequired: 1, whole, tenths, thousandths, v3: 1 }),
    coreConcept: "A rounded representation communicates both a numerical value and a requested precision. When the answer is required to two decimal places, a trailing zero in the hundredths place must be retained even though dropping it would not change the numerical value.",
    steps: Object.freeze([
      `The third decimal digit in ${original} is ${thousandths}, which is below 5, so the hundredths digit remains 0.`,
      `Write the result with exactly two decimal places, including the required trailing zero: ${answer}.`,
    ]),
    verification: Object.freeze([
      `${answer} has exactly two digits after the decimal point.`,
      `${unforcedDecimal(rounded)} is numerically equal but does not preserve the two-decimal precision requested in the question.`,
    ]),
    version: "v3",
  });
}

export function generateSapCp007(prototypeId: SapCp007PrototypeId, seed: number): SapCp007Package {
  if (!Number.isInteger(seed) || seed < 1) throw new Error("Seed must be a positive integer.");
  if (prototypeId === "SAP-CP007-PROT-NEGATIVE-HALFWAY-EXPLICIT-RULE") return generateNegativeHalfway(seed);
  if (prototypeId === "SAP-CP007-PROT-CORRECT-PRECISION-REPRESENTATION") return generatePrecisionRepresentation(seed);
  return generateV2(prototypeId, seed);
}

export function generateSapCp007Sweep(seedsPerMode = 100): readonly SapCp007Package[] {
  if (!Number.isInteger(seedsPerMode) || seedsPerMode < 1) throw new Error("seedsPerMode must be positive.");
  return Object.freeze(SAP_CP007_PROTOTYPE_IDS.flatMap((prototypeId) =>
    Array.from({ length: seedsPerMode }, (_, index) => generateSapCp007(prototypeId, index + 1)),
  ));
}
