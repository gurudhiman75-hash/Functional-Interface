import {
  SAP_CP007_TIE_RULE,
  formatScaled,
  roundIntegerToUnitHalfAway,
  roundScaledHalfAway,
  type SapCp007Option,
} from "./runtime-v4";

export const SAP_CP007_WAVE2_PROTOTYPE_IDS = [
  "SAP-CP007-PROT-COMPARE-ROUNDED-PRECISIONS",
  "SAP-CP007-PROT-MAXIMUM-POSSIBLE-ROUNDING-ERROR",
  "SAP-CP007-PROT-RELATIVE-ROUNDING-ERROR",
  "SAP-CP007-PROT-PREMATURE-ROUNDING-DIAGNOSIS",
] as const;

export type SapCp007Wave2PrototypeId = typeof SAP_CP007_WAVE2_PROTOTYPE_IDS[number];

export interface SapCp007Wave2Package {
  checkpointId: "SAP-CP-007";
  prototypeId: SapCp007Wave2PrototypeId;
  proposedPermanentQlId: "SAP-QL-125" | "SAP-QL-126" | "SAP-QL-127" | "SAP-QL-128";
  seed: number;
  difficulty: "MEDIUM" | "HARD";
  taskDirection: "COMPARISON" | "ERROR" | "DIAGNOSIS";
  tieRule: typeof SAP_CP007_TIE_RULE;
  stem: string;
  canonicalAnswer: string;
  options: readonly SapCp007Option[];
  correctIndex: number;
  explanation: {
    coreConcept: string;
    steps: readonly string[];
    finalAnswer: string;
    verification: readonly string[];
  };
  oracle: { kind: SapCp007Wave2PrototypeId; data: Readonly<Record<string, number | string>> };
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

export const SAP_CP007_WAVE2_CATALOGUE = Object.freeze([
  Object.freeze({ prototypeId: SAP_CP007_WAVE2_PROTOTYPE_IDS[0], proposedPermanentQlId: "SAP-QL-125" as const, difficulty: "MEDIUM" as const, taskDirection: "COMPARISON" as const, title: "Compare results rounded to different precisions" }),
  Object.freeze({ prototypeId: SAP_CP007_WAVE2_PROTOTYPE_IDS[1], proposedPermanentQlId: "SAP-QL-126" as const, difficulty: "MEDIUM" as const, taskDirection: "ERROR" as const, title: "Maximum possible rounding error" }),
  Object.freeze({ prototypeId: SAP_CP007_WAVE2_PROTOTYPE_IDS[2], proposedPermanentQlId: "SAP-QL-127" as const, difficulty: "HARD" as const, taskDirection: "ERROR" as const, title: "Exact relative rounding error" }),
  Object.freeze({ prototypeId: SAP_CP007_WAVE2_PROTOTYPE_IDS[3], proposedPermanentQlId: "SAP-QL-128" as const, difficulty: "MEDIUM" as const, taskDirection: "DIAGNOSIS" as const, title: "Diagnose premature rounding" }),
] as const);

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

function makeOptions(answer: string, seed: number, distractors: readonly SapCp007Option[]): readonly SapCp007Option[] {
  const correct: SapCp007Option = Object.freeze({
    value: answer,
    isCorrect: true,
    misconceptionId: null,
    analysis: "This follows the declared rounding precision and computes the requested comparison or error exactly.",
  });
  const values = new Set([answer, ...distractors.map((option) => option.value)]);
  if (distractors.length !== 3 || values.size !== 4) throw new Error(`${answer}: wave-two options are not distinct.`);
  const options = [...distractors];
  options.splice(correctIndex(seed), 0, correct);
  return Object.freeze(options);
}

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

function buildPackage(
  prototypeId: SapCp007Wave2PrototypeId,
  seed: number,
  generated: {
    stem: string;
    answer: string;
    options: readonly SapCp007Option[];
    data: Readonly<Record<string, number | string>>;
    coreConcept: string;
    steps: readonly string[];
    verification: readonly string[];
  },
): SapCp007Wave2Package {
  const catalogue = SAP_CP007_WAVE2_CATALOGUE.find((item) => item.prototypeId === prototypeId)!;
  const partial: Omit<SapCp007Wave2Package, "validation"> = Object.freeze({
    checkpointId: "SAP-CP-007",
    prototypeId,
    proposedPermanentQlId: catalogue.proposedPermanentQlId,
    seed,
    difficulty: catalogue.difficulty,
    taskDirection: catalogue.taskDirection,
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
    generationIdentity: `${prototypeId}:wave2:seed:${seed}:${JSON.stringify(generated.data)}`,
    lifecycle: LIFECYCLE,
  });
  const errors: string[] = [];
  if (partial.options.length !== 4 || new Set(partial.options.map((option) => option.value)).size !== 4) errors.push("Wave-two options must be four distinct values.");
  if (partial.options.filter((option) => option.isCorrect).length !== 1) errors.push("Exactly one wave-two option must be correct.");
  if (partial.options[partial.correctIndex]?.value !== partial.canonicalAnswer) errors.push("Wave-two correct index is not answer-bound.");
  if (partial.explanation.steps.length < 2 || partial.explanation.verification.length < 2) errors.push("Wave-two explanations require at least two solution and verification steps.");
  if (/significant figure/i.test(partial.stem)) errors.push("Source-guarded significant figures are not admitted to wave two.");
  return Object.freeze({ ...partial, validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }) });
}

function generatePrecisionComparison(seed: number): SapCp007Wave2Package {
  const prototypeId = "SAP-CP007-PROT-COMPARE-ROUNDED-PRECISIONS" as const;
  const n = seed - 1;
  const whole = 10 + Math.floor(n / 10);
  const tenths = n % 10;
  const hundredths = 1 + ((n * 3) % 9);
  const thousandths = 1 + ((n * 7) % 9);
  const scaled = BigInt(whole * 1000 + tenths * 100 + hundredths * 10 + thousandths);
  const oneDp = roundScaledHalfAway(scaled, 3, 1);
  const twoDp = roundScaledHalfAway(scaled, 3, 2);
  const oneDpOnHundredths = oneDp * 10n;
  const relation = oneDpOnHundredths < twoDp ? "A < B" : oneDpOnHundredths > twoDp ? "A > B" : "A = B";
  const original = formatScaled(scaled, 3);
  const a = formatScaled(oneDp, 1);
  const b = formatScaled(twoDp, 2);
  return buildPackage(prototypeId, seed, {
    stem: `For ${original}, let A be the value rounded to 1 decimal place and B the value rounded to 2 decimal places. Which relation is correct?`,
    answer: relation,
    options: makeOptions(relation, seed, [
      wrong("A < B", "PRECISION_COMPARISON_LT", "This relation is incorrect when the two exact fixed-point rounded values are compared on a common hundredths scale."),
      wrong("A = B", "PRECISION_COMPARISON_EQ", "This assumes the two displayed precisions have the same numerical value without evaluating both rounded results exactly."),
      wrong("A > B", "PRECISION_COMPARISON_GT", "This relation reverses or misreads the exact ordering of the one-decimal and two-decimal rounded results."),
      wrong("Cannot be determined", "PRECISION_NOT_EVALUATED", "The original number is fully specified, so both rounded values and their relation can be determined exactly."),
    ].filter((option) => option.value !== relation).slice(0, 3)),
    data: Object.freeze({ scaled: Number(scaled), inputDp: 3, oneDpScaled: Number(oneDp), twoDpScaled: Number(twoDp), relation, v2: 1 }),
    coreConcept: "Rounded values shown at different decimal precisions must be converted to a common exact scale before they are compared numerically. A longer representation does not automatically mean a larger value; the rounded digits determine the relation.",
    steps: Object.freeze([
      `Rounding ${original} to 1 decimal place gives A = ${a}; rounding it to 2 decimal places gives B = ${b}.`,
      `Compare them on the hundredths scale: A = ${formatScaled(oneDpOnHundredths, 2)} and B = ${b}, so ${relation}.`,
    ]),
    verification: Object.freeze([
      `A in hundredths is ${oneDpOnHundredths}; B in hundredths is ${twoDp}.`,
      `Direct integer comparison on that common scale reproduces ${relation}.`,
    ]),
  });
}

function generateMaximumError(seed: number): SapCp007Wave2Package {
  const prototypeId = "SAP-CP007-PROT-MAXIMUM-POSSIBLE-ROUNDING-ERROR" as const;
  const cases = [
    { label: "nearest ten", numerator: 5n, dp: 0, answer: "5" },
    { label: "nearest hundred", numerator: 50n, dp: 0, answer: "50" },
    { label: "1 decimal place", numerator: 5n, dp: 2, answer: "0.05" },
    { label: "2 decimal places", numerator: 5n, dp: 3, answer: "0.005" },
  ] as const;
  const chosen = cases[(seed - 1) % cases.length]!;
  const cycle = Math.floor((seed - 1) / cases.length) + 1;
  const context = cycle % 2 === 0 ? "A positive quantity" : "A measurement value";
  return buildPackage(prototypeId, seed, {
    stem: `${context} is rounded to the ${chosen.label}. What is the maximum possible absolute rounding error under the declared half-away-from-zero rule?`,
    answer: chosen.answer,
    options: makeOptions(chosen.answer, seed, [
      wrong(chosen.dp === 0 ? String(Number(chosen.answer) * 2) : formatScaled(chosen.numerator * 2n, chosen.dp), "FULL_UNIT_USED_AS_ERROR", "This uses one full rounding unit, but the farthest an original value can be from its rounded target is only half that unit."),
      wrong(chosen.dp === 0 ? String(Number(chosen.answer) / 5) : formatScaled(1n, chosen.dp), "DECIDING_DIGIT_CONFUSED_WITH_ERROR", "This confuses a place-value digit size with the half-unit distance that bounds the absolute rounding error."),
      wrong("0", "ASSUMED_NO_ROUNDING_ERROR", "Rounding can change the original value, so the maximum possible error is not zero even though some individual values round exactly."),
    ]),
    data: Object.freeze({ caseIndex: (seed - 1) % cases.length, cycle, numerator: Number(chosen.numerator), dp: chosen.dp, answer: chosen.answer, v2: 1 }),
    coreConcept: "When a value is rounded to a declared unit, every original value that maps to a rounded target lies within half of that rounding unit. Therefore the maximum possible absolute rounding error is exactly one half of the unit.",
    steps: Object.freeze([
      `Identify one rounding unit for ${chosen.label}.`,
      `The maximum distance from the rounded target is half of that unit, which is ${chosen.answer}.`,
    ]),
    verification: Object.freeze([
      `An exact midpoint is ${chosen.answer} away from a rounded target and is handled by the declared tie rule.`,
      `Any value farther than this half-unit belongs to a neighbouring rounded target.`,
    ]),
  });
}

function generateRelativeError(seed: number): SapCp007Wave2Package {
  const prototypeId = "SAP-CP007-PROT-RELATIVE-ROUNDING-ERROR" as const;
  const unit = [10, 100, 1000][(seed - 1) % 3]!;
  const k = 2 + seed;
  const original = BigInt((2 * k + 1) * unit / 2);
  const rounded = roundIntegerToUnitHalfAway(original, BigInt(unit));
  const error = rounded >= original ? rounded - original : original - rounded;
  const answer = reducedFraction(error, original);
  const denominator = 2 * k + 1;
  return buildPackage(prototypeId, seed, {
    stem: `${original} is rounded to the nearest ${unit}. The rounded value is ${rounded}. What is the relative rounding error, written as a fraction of the original value?`,
    answer,
    options: makeOptions(answer, seed, [
      wrong(`1/${denominator + 1}`, "RELATIVE_ERROR_DENOMINATOR_SHIFT", "This uses the wrong original-value denominator after simplifying the absolute error divided by the exact original value."),
      wrong(`1/${Math.max(1, denominator - 1)}`, "RELATIVE_ERROR_OFF_BY_ONE", "This changes the denominator by one instead of reducing the exact ratio of absolute error to original value."),
      wrong(reducedFraction(error, rounded < 0n ? -rounded : rounded), "ROUNDED_VALUE_USED_AS_BASE", "This divides the absolute error by the rounded approximation rather than by the original exact value requested in the definition."),
    ]),
    data: Object.freeze({ unit, k, original: Number(original), rounded: Number(rounded), error: Number(error), denominator, v2: 1 }),
    coreConcept: "Relative rounding error compares the absolute rounding error with the exact original value, not with the rounded approximation. Compute |rounded − original| ÷ |original| and reduce the ratio exactly before choosing an answer.",
    steps: Object.freeze([
      `Absolute error = |${rounded} − ${original}| = ${error}.`,
      `Relative error = ${error}/${original} = ${answer} after reducing the fraction.`,
    ]),
    verification: Object.freeze([
      `The original value is exactly halfway between neighbouring multiples of ${unit}, so the absolute error is ${unit / 2}.`,
      `Reducing (${unit / 2})/${original} independently gives ${answer}.`,
    ]),
  });
}

function generatePrematureDiagnosis(seed: number): SapCp007Wave2Package {
  const prototypeId = "SAP-CP007-PROT-PREMATURE-ROUNDING-DIAGNOSIS" as const;
  const n = seed - 1;
  const aWhole = 10 + Math.floor(n / 10);
  const bWhole = 2 + (n % 10);
  const hundredths = seed % 2 === 0 ? 49 : 51;
  const aScaled = BigInt(aWhole * 100 + hundredths);
  const bScaled = BigInt(bWhole * 100 + hundredths);
  const exactSum = aScaled + bScaled;
  const correctRounded = roundScaledHalfAway(exactSum, 2, 0);
  const aEarly = roundScaledHalfAway(aScaled, 2, 0);
  const bEarly = roundScaledHalfAway(bScaled, 2, 0);
  const premature = aEarly + bEarly;
  if (premature === correctRounded) throw new Error(`Seed ${seed}: premature-rounding state did not change the result.`);
  const originalA = formatScaled(aScaled, 2);
  const originalB = formatScaled(bScaled, 2);
  const answer = `Premature rounding changed the result; the correct final answer is ${correctRounded}`;
  return buildPackage(prototypeId, seed, {
    stem: `A student must add ${originalA} and ${originalB}, then round the final sum to the nearest integer. The student first rounds the two numbers to ${aEarly} and ${bEarly}, adds them, and reports ${premature}. Which diagnosis is correct?`,
    answer,
    options: makeOptions(answer, seed, [
      wrong(`The student's method is valid; ${premature} is the correct final answer`, "PREMATURE_ROUNDING_ACCEPTED", "Rounding the inputs before the required final operation changes the exact sum in this case, so the student's reported result is not valid."),
      wrong(`The only error is arithmetic; the correct final answer is ${premature}`, "ARITHMETIC_BLAMED_NOT_ROUNDING", "The student's addition of the rounded inputs is arithmetically consistent; the error comes from rounding too early."),
      wrong(`Both methods are equivalent because each input was rounded correctly`, "ROUNDING_DISTRIBUTED_ILLEGALLY", "Correctly rounding individual inputs does not guarantee that their sum equals the result obtained by rounding the exact final sum."),
    ]),
    data: Object.freeze({ aScaled: Number(aScaled), bScaled: Number(bScaled), exactSum: Number(exactSum), aEarly: Number(aEarly), bEarly: Number(bEarly), premature: Number(premature), correctRounded: Number(correctRounded), inputDp: 2, v2: 1 }),
    coreConcept: "Rounding is generally not distributive over arithmetic operations. When a question says to round the final result, keep the inputs exact through the operation and round only once at the end; otherwise small input errors can combine and change the final rounded answer.",
    steps: Object.freeze([
      `Add first without rounding: ${originalA} + ${originalB} = ${formatScaled(exactSum, 2)}.`,
      `Now round the exact sum to the nearest integer: ${formatScaled(exactSum, 2)} → ${correctRounded}; the student's early-rounded route gave ${premature}.`,
    ]),
    verification: Object.freeze([
      `The exact route and premature route differ by ${correctRounded >= premature ? correctRounded - premature : premature - correctRounded}.`,
      `Therefore the source of the error is the timing of the rounding step, not the addition of the rounded integers.`,
    ]),
  });
}

export function generateSapCp007Wave2(prototypeId: SapCp007Wave2PrototypeId, seed: number): SapCp007Wave2Package {
  if (!Number.isInteger(seed) || seed < 1) throw new Error("Seed must be a positive integer.");
  if (prototypeId === "SAP-CP007-PROT-COMPARE-ROUNDED-PRECISIONS") return generatePrecisionComparison(seed);
  if (prototypeId === "SAP-CP007-PROT-MAXIMUM-POSSIBLE-ROUNDING-ERROR") return generateMaximumError(seed);
  if (prototypeId === "SAP-CP007-PROT-RELATIVE-ROUNDING-ERROR") return generateRelativeError(seed);
  return generatePrematureDiagnosis(seed);
}

export function generateSapCp007Wave2Sweep(seedsPerMode = 100): readonly SapCp007Wave2Package[] {
  return Object.freeze(SAP_CP007_WAVE2_PROTOTYPE_IDS.flatMap((prototypeId) => Array.from({ length: seedsPerMode }, (_, index) => generateSapCp007Wave2(prototypeId, index + 1))));
}
