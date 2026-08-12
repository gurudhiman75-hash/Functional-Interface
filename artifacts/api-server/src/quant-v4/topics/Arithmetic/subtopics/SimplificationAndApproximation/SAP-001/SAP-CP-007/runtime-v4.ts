import {
  SAP_CP007_CATALOGUE,
  SAP_CP007_PROTOTYPE_IDS,
  SAP_CP007_TIE_RULE,
  formatScaled,
  generateSapCp007 as generateV3,
  roundIntegerToUnitHalfAway,
  roundScaledHalfAway,
  type SapCp007Difficulty,
  type SapCp007Option,
  type SapCp007Package,
  type SapCp007PrototypeId,
  type SapCp007TaskDirection,
} from "./runtime-v3";

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
} from "./runtime-v3";

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

function placeName(unit: number): string {
  if (unit === 10) return "nearest ten";
  if (unit === 100) return "nearest hundred";
  return "nearest thousand";
}

function insertCorrect(answer: string, seed: number, wrong: readonly SapCp007Option[]): readonly SapCp007Option[] {
  const correct: SapCp007Option = Object.freeze({
    value: answer,
    isCorrect: true,
    misconceptionId: null,
    analysis: "This option follows the declared rounding boundary or error definition exactly.",
  });
  const values = new Set([answer, ...wrong.map((option) => option.value)]);
  if (wrong.length !== 3 || values.size !== 4) throw new Error(`CP-007 v4 options collapsed for ${answer}.`);
  const options = [...wrong];
  options.splice(correctIndex(seed), 0, correct);
  return Object.freeze(options);
}

function wrong(value: string, misconceptionId: string, analysis: string): SapCp007Option {
  return Object.freeze({ value, isCorrect: false, misconceptionId, analysis });
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
    generationIdentity: `${prototypeId}:v4:seed:${seed}:${JSON.stringify(generated.data)}`,
    lifecycle: LIFECYCLE,
  });
  const errors: string[] = [];
  if (partial.options.length !== 4 || new Set(partial.options.map((option) => option.value)).size !== 4) errors.push("Options must contain four distinct values.");
  if (partial.options.filter((option) => option.isCorrect).length !== 1) errors.push("Exactly one option must be correct.");
  if (partial.options[partial.correctIndex]?.value !== partial.canonicalAnswer) errors.push("Correct index is not answer-bound.");
  if (partial.explanation.steps.length < 2 || partial.explanation.verification.length < 2) errors.push("At least two solution and verification steps are required.");
  return Object.freeze({ ...partial, validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }) });
}

function unitForSeed(seed: number): 10 | 100 | 1000 {
  return [10, 100, 1000][(seed - 1) % 3] as 10 | 100 | 1000;
}

function generateReverseIntegerInterval(seed: number): SapCp007Package {
  const prototypeId = "SAP-CP007-PROT-REVERSE-INTEGER-ROUNDING-INTERVAL" as const;
  const unit = unitForSeed(seed);
  const target = (20 + seed) * unit;
  const low = target - unit / 2;
  const high = target + unit / 2 - 1;
  const answer = `${low} to ${high} (inclusive)`;
  return buildPackage(prototypeId, seed, {
    stem: `Which range of integer values rounds to ${target} when rounded to the ${placeName(unit)}?`,
    answer,
    options: insertCorrect(answer, seed, [
      wrong(`${low + 1} to ${high} (inclusive)`, "LOWER_MIDPOINT_EXCLUDED", "This incorrectly removes the lower halfway integer, even though it rounds upward into the stated positive target."),
      wrong(`${low} to ${high + 1} (inclusive)`, "UPPER_MIDPOINT_INCLUDED", "This incorrectly includes the upper halfway integer, which rounds upward to the next multiple rather than to the stated target."),
      wrong(`${low - 1} to ${high} (inclusive)`, "LOWER_RANGE_EXTENDED", "This extends the interval one integer below the true lower midpoint, where the number rounds to the previous multiple."),
    ]),
    data: Object.freeze({ target, unit, low, high, v4: 1 }),
    coreConcept: "Reverse integer rounding reconstructs every integer original that maps to one rounded target. For a positive target under half-away-from-zero, the lower midpoint is included, while the upper midpoint belongs to the next rounded multiple.",
    steps: Object.freeze([
      `Half of the rounding unit ${unit} is ${unit / 2}.`,
      `The valid integer interval is ${target} − ${unit / 2} through ${target} + ${unit / 2} − 1, giving ${answer}.`,
    ]),
    verification: Object.freeze([
      `${low} is exactly the lower midpoint and rounds upward to ${target}.`,
      `${high + 1} is the upper midpoint and rounds upward to ${target + unit}, so it is excluded.`,
    ]),
  });
}

function generateReverseDecimalInterval(seed: number): SapCp007Package {
  const prototypeId = "SAP-CP007-PROT-REVERSE-DECIMAL-ROUNDING-INTERVAL" as const;
  const targetTenths = 15 + 2 * seed;
  const lowHundredths = targetTenths * 10 - 5;
  const highHundredths = targetTenths * 10 + 5;
  const target = formatScaled(BigInt(targetTenths), 1);
  const low = formatScaled(BigInt(lowHundredths), 2);
  const high = formatScaled(BigInt(highHundredths), 2);
  const answer = `${low} ≤ x < ${high}`;
  return buildPackage(prototypeId, seed, {
    stem: `A positive number rounds to ${target} to 1 decimal place. Which interval contains exactly all possible original values?`,
    answer,
    options: insertCorrect(answer, seed, [
      wrong(`${low} < x ≤ ${high}`, "BOUNDARY_INCLUSION_REVERSED", "This reverses the midpoint inclusion: the lower midpoint belongs to the target, while the upper midpoint rounds to the next tenth."),
      wrong(`${formatScaled(BigInt(lowHundredths + 1), 2)} ≤ x < ${high}`, "LOWER_MIDPOINT_LOST", "This starts one hundredth above the true lower boundary and omits valid positive values that round to the stated target."),
      wrong(`${low} ≤ x ≤ ${high}`, "UPPER_MIDPOINT_INCLUDED", "This includes the upper midpoint even though that exact halfway value rounds upward to the next one-decimal result."),
    ]),
    data: Object.freeze({ targetTenths, lowHundredths, highHundredths, targetDp: 1, v4: 1 }),
    coreConcept: "A one-decimal rounded target represents a half-open interval one half-unit on either side. For a positive target under the declared rule, the lower midpoint rounds into the target and the upper midpoint rounds to the next tenth.",
    steps: Object.freeze([
      `One decimal place has unit 0.1, so half a unit is 0.05.`,
      `Subtract and add 0.05 around ${target}; include the lower midpoint and exclude the upper one, giving ${answer}.`,
    ]),
    verification: Object.freeze([
      `${low} rounds to ${target}.`,
      `${high} is exactly halfway to the next tenth and therefore rounds upward, so it is excluded.`,
    ]),
  });
}

function generateExtremum(seed: number, greatest: boolean): SapCp007Package {
  const prototypeId = greatest
    ? "SAP-CP007-PROT-GREATEST-INTEGER-FOR-ROUNDED-TARGET" as const
    : "SAP-CP007-PROT-LEAST-INTEGER-FOR-ROUNDED-TARGET" as const;
  const unit = unitForSeed(seed);
  const target = (40 + seed) * unit;
  const midpoint = greatest ? target + unit / 2 : target - unit / 2;
  const answerNumber = greatest ? midpoint - 1 : midpoint;
  const answer = String(answerNumber);
  const stem = `What is the ${greatest ? "greatest" : "least"} integer that rounds to ${target} when rounded to the ${placeName(unit)}?`;
  const wrongValues = greatest
    ? [midpoint, answerNumber - 1, target]
    : [answerNumber - 1, answerNumber + 1, target];
  return buildPackage(prototypeId, seed, {
    stem,
    answer,
    options: insertCorrect(answer, seed, wrongValues.map((value, index) => wrong(
      String(value),
      ["MIDPOINT_BOUNDARY_MISREAD", "OFF_BY_ONE_BOUNDARY", "TARGET_CONFUSED_WITH_ORIGINAL"][index]!,
      [
        greatest ? "This is the upper midpoint itself, which rounds to the next target." : "This lies one integer below the included lower midpoint and rounds to the previous target.",
        "This is one integer away from the actual extremal boundary allowed by the rounding interval.",
        "This confuses the displayed rounded target with the least or greatest possible original integer.",
      ][index]!,
    ))),
    data: Object.freeze({ target, unit, midpoint, answer: answerNumber, greatest: greatest ? 1 : 0, v4: 1 }),
    coreConcept: greatest
      ? "The greatest integer that rounds to a positive target lies exactly one integer below the upper midpoint, because the upper midpoint itself is a tie that rounds away from zero to the next multiple."
      : "The least integer that rounds to a positive target is the lower midpoint itself, because an exact positive halfway value rounds away from zero upward into the stated target.",
    steps: Object.freeze(greatest
      ? [`The upper midpoint is ${target} + ${unit / 2} = ${midpoint}.`, `That midpoint rounds to the next multiple, so the greatest valid integer is ${midpoint} − 1 = ${answer}.`]
      : [`The lower midpoint is ${target} − ${unit / 2} = ${midpoint}.`, `That positive midpoint rounds upward into ${target}, so the least valid integer is ${answer}.`]),
    verification: Object.freeze(greatest
      ? [`${answer} remains below the upper midpoint and rounds to ${target}.`, `${midpoint} is exactly halfway and rounds to ${target + unit}.`]
      : [`${answer} is the included lower midpoint and rounds to ${target}.`, `${answerNumber - 1} lies below the midpoint and rounds to ${target - unit}.`]),
  });
}

function generateMissingDigit(seed: number): SapCp007Package {
  const prototypeId = "SAP-CP007-PROT-MISSING-DIGIT-FOR-ROUNDING" as const;
  const n = seed - 1;
  const thousands = 2 + (n % 7);
  const hundreds = 1 + (Math.floor(n / 7) % 8);
  const units = Math.floor(n / 56) % 10;
  const roundUp = seed % 2 === 0;
  const answerDigit = roundUp ? 5 + (n % 5) : n % 5;
  const baseHundred = thousands * 1000 + hundreds * 100;
  const target = roundUp ? baseHundred + 100 : baseHundred;
  const invalid = roundUp ? [0, 1, 2] : [5, 6, 7];
  const answer = String(answerDigit);
  return buildPackage(prototypeId, seed, {
    stem: `The number ${thousands}${hundreds}□${units} becomes ${target} when rounded to the nearest hundred. Which digit can replace □?`,
    answer,
    options: insertCorrect(answer, seed, invalid.map((digit) => wrong(String(digit), "MISSING_DIGIT_WRONG_SIDE_OF_THRESHOLD", `Using ${digit} puts the deciding tens digit on the wrong side of the 5-threshold, so the number rounds to a different hundred.`))),
    data: Object.freeze({ thousands, hundreds, units, target, roundUp: roundUp ? 1 : 0, answerDigit, v4: 1 }),
    coreConcept: "For nearest-hundred rounding, the tens digit is the deciding digit. Values 0–4 keep the current hundred, while values 5–9 move to the next hundred under the declared positive halfway rule.",
    steps: Object.freeze([
      `The box is the tens digit, so it alone decides nearest-hundred rounding.`,
      `To reach ${target}, the tens digit must lie in ${roundUp ? "5–9" : "0–4"}; among the options, ${answerDigit} satisfies that condition.`,
    ]),
    verification: Object.freeze([
      `Substituting ${answerDigit} gives ${thousands}${hundreds}${answerDigit}${units}.`,
      `Rounding that integer to the nearest hundred gives exactly ${target}; each displayed distractor rounds to the other hundred.`,
    ]),
  });
}

function generateAbsoluteError(seed: number): SapCp007Package {
  const prototypeId = "SAP-CP007-PROT-ABSOLUTE-ROUNDING-ERROR" as const;
  const n = seed - 1;
  const whole = 10 + Math.floor(n / 10);
  const tenths = n % 10;
  const hundredths = 1 + (n % 9);
  const scaled = BigInt(whole * 100 + tenths * 10 + hundredths);
  const roundedTenths = roundScaledHalfAway(scaled, 2, 1);
  const roundedHundredths = roundedTenths * 10n;
  const errorHundredths = roundedHundredths >= scaled ? roundedHundredths - scaled : scaled - roundedHundredths;
  const answer = formatScaled(errorHundredths, 2);
  const allErrors = [1n, 2n, 3n, 4n, 5n].filter((value) => value !== errorHundredths).slice(0, 3);
  return buildPackage(prototypeId, seed, {
    stem: `${formatScaled(scaled, 2)} is rounded to 1 decimal place as ${formatScaled(roundedTenths, 1)}. What is the absolute rounding error?`,
    answer,
    options: insertCorrect(answer, seed, allErrors.map((value) => wrong(formatScaled(value, 2), "ROUNDING_ERROR_DISTANCE_MISREAD", "This does not equal the exact absolute distance between the original hundredths value and the displayed one-decimal rounded value."))),
    data: Object.freeze({ scaled: Number(scaled), inputDp: 2, roundedTenths: Number(roundedTenths), errorHundredths: Number(errorHundredths), v4: 1 }),
    coreConcept: "Absolute rounding error is the non-negative distance between the exact original value and its rounded representation. Put both numbers on the same fixed-point scale, subtract, and take the absolute value.",
    steps: Object.freeze([
      `Write the rounded value on the hundredths scale as ${formatScaled(roundedHundredths, 2)}.`,
      `Take the absolute difference: |${formatScaled(scaled, 2)} − ${formatScaled(roundedHundredths, 2)}| = ${answer}.`,
    ]),
    verification: Object.freeze([
      `The error is a distance, so it cannot be negative.`,
      `${answer} is no greater than 0.05, the maximum half-unit distance when rounding to one decimal place.`,
    ]),
  });
}

export function generateSapCp007(prototypeId: SapCp007PrototypeId, seed: number): SapCp007Package {
  if (!Number.isInteger(seed) || seed < 1) throw new Error("Seed must be a positive integer.");
  if (prototypeId === "SAP-CP007-PROT-REVERSE-INTEGER-ROUNDING-INTERVAL") return generateReverseIntegerInterval(seed);
  if (prototypeId === "SAP-CP007-PROT-REVERSE-DECIMAL-ROUNDING-INTERVAL") return generateReverseDecimalInterval(seed);
  if (prototypeId === "SAP-CP007-PROT-LEAST-INTEGER-FOR-ROUNDED-TARGET") return generateExtremum(seed, false);
  if (prototypeId === "SAP-CP007-PROT-GREATEST-INTEGER-FOR-ROUNDED-TARGET") return generateExtremum(seed, true);
  if (prototypeId === "SAP-CP007-PROT-MISSING-DIGIT-FOR-ROUNDING") return generateMissingDigit(seed);
  if (prototypeId === "SAP-CP007-PROT-ABSOLUTE-ROUNDING-ERROR") return generateAbsoluteError(seed);
  return generateV3(prototypeId, seed);
}

export function generateSapCp007Sweep(seedsPerMode = 100): readonly SapCp007Package[] {
  if (!Number.isInteger(seedsPerMode) || seedsPerMode < 1) throw new Error("seedsPerMode must be positive.");
  return Object.freeze(SAP_CP007_PROTOTYPE_IDS.flatMap((prototypeId) => Array.from({ length: seedsPerMode }, (_, index) => generateSapCp007(prototypeId, index + 1))));
}
