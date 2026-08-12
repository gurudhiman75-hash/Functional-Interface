export const SAP_CP007_TIE_RULE = "HALF_AWAY_FROM_ZERO" as const;

export const SAP_CP007_PROTOTYPE_IDS = [
  "SAP-CP007-PROT-ROUND-INTEGER-DECLARED-PLACE",
  "SAP-CP007-PROT-ROUND-DECIMAL-NEAREST-INTEGER",
  "SAP-CP007-PROT-ROUND-DECIMAL-PLACES",
  "SAP-CP007-PROT-NEGATIVE-HALFWAY-EXPLICIT-RULE",
  "SAP-CP007-PROT-IDENTIFY-DECIDING-DIGIT",
  "SAP-CP007-PROT-CORRECT-PRECISION-REPRESENTATION",
  "SAP-CP007-PROT-REVERSE-INTEGER-ROUNDING-INTERVAL",
  "SAP-CP007-PROT-REVERSE-DECIMAL-ROUNDING-INTERVAL",
  "SAP-CP007-PROT-LEAST-INTEGER-FOR-ROUNDED-TARGET",
  "SAP-CP007-PROT-GREATEST-INTEGER-FOR-ROUNDED-TARGET",
  "SAP-CP007-PROT-MISSING-DIGIT-FOR-ROUNDING",
  "SAP-CP007-PROT-ABSOLUTE-ROUNDING-ERROR",
] as const;

export type SapCp007PrototypeId = typeof SAP_CP007_PROTOTYPE_IDS[number];
export type SapCp007Difficulty = "EASY" | "MEDIUM" | "HARD";
export type SapCp007TaskDirection = "FORWARD" | "INVERSE" | "PLACE_VALUE" | "ERROR";

export interface SapCp007Option {
  value: string;
  isCorrect: boolean;
  misconceptionId: string | null;
  analysis: string;
}

export interface SapCp007Package {
  checkpointId: "SAP-CP-007";
  prototypeId: SapCp007PrototypeId;
  proposedPermanentQlId: string;
  seed: number;
  difficulty: SapCp007Difficulty;
  taskDirection: SapCp007TaskDirection;
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
  oracle: {
    kind: SapCp007PrototypeId;
    data: Readonly<Record<string, number | string>>;
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

export const SAP_CP007_CATALOGUE = Object.freeze([
  Object.freeze({ prototypeId: SAP_CP007_PROTOTYPE_IDS[0], proposedPermanentQlId: "SAP-QL-113", title: "Round an integer to a declared place", difficulty: "EASY", taskDirection: "FORWARD" }),
  Object.freeze({ prototypeId: SAP_CP007_PROTOTYPE_IDS[1], proposedPermanentQlId: "SAP-QL-114", title: "Round a decimal to the nearest integer", difficulty: "EASY", taskDirection: "FORWARD" }),
  Object.freeze({ prototypeId: SAP_CP007_PROTOTYPE_IDS[2], proposedPermanentQlId: "SAP-QL-115", title: "Round a decimal to declared decimal places", difficulty: "MEDIUM", taskDirection: "FORWARD" }),
  Object.freeze({ prototypeId: SAP_CP007_PROTOTYPE_IDS[3], proposedPermanentQlId: "SAP-QL-116", title: "Negative halfway rounding under an explicit rule", difficulty: "MEDIUM", taskDirection: "FORWARD" }),
  Object.freeze({ prototypeId: SAP_CP007_PROTOTYPE_IDS[4], proposedPermanentQlId: "SAP-QL-117", title: "Identify the deciding place-value digit", difficulty: "EASY", taskDirection: "PLACE_VALUE" }),
  Object.freeze({ prototypeId: SAP_CP007_PROTOTYPE_IDS[5], proposedPermanentQlId: "SAP-QL-118", title: "Select the correctly rounded precision representation", difficulty: "MEDIUM", taskDirection: "PLACE_VALUE" }),
  Object.freeze({ prototypeId: SAP_CP007_PROTOTYPE_IDS[6], proposedPermanentQlId: "SAP-QL-119", title: "Reverse an integer rounding interval", difficulty: "MEDIUM", taskDirection: "INVERSE" }),
  Object.freeze({ prototypeId: SAP_CP007_PROTOTYPE_IDS[7], proposedPermanentQlId: "SAP-QL-120", title: "Reverse a decimal rounding interval", difficulty: "HARD", taskDirection: "INVERSE" }),
  Object.freeze({ prototypeId: SAP_CP007_PROTOTYPE_IDS[8], proposedPermanentQlId: "SAP-QL-121", title: "Least integer rounding to a target", difficulty: "MEDIUM", taskDirection: "INVERSE" }),
  Object.freeze({ prototypeId: SAP_CP007_PROTOTYPE_IDS[9], proposedPermanentQlId: "SAP-QL-122", title: "Greatest integer rounding to a target", difficulty: "MEDIUM", taskDirection: "INVERSE" }),
  Object.freeze({ prototypeId: SAP_CP007_PROTOTYPE_IDS[10], proposedPermanentQlId: "SAP-QL-123", title: "Missing digit consistent with a rounded result", difficulty: "MEDIUM", taskDirection: "INVERSE" }),
  Object.freeze({ prototypeId: SAP_CP007_PROTOTYPE_IDS[11], proposedPermanentQlId: "SAP-QL-124", title: "Absolute error after rounding", difficulty: "MEDIUM", taskDirection: "ERROR" }),
] as const);

const LIFECYCLE: SapCp007Package["lifecycle"] = Object.freeze({
  permanentQlId: null,
  contentStatus: "ENGLISH_REVIEW_CANDIDATE",
  active: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
});

const CORE: Record<SapCp007PrototypeId, string> = {
  "SAP-CP007-PROT-ROUND-INTEGER-DECLARED-PLACE": "To round an integer to a declared place, keep the target place fixed and inspect only the digit immediately to its right. Under the declared rule, a halfway digit of 5 rounds away from zero.",
  "SAP-CP007-PROT-ROUND-DECIMAL-NEAREST-INTEGER": "Rounding a positive decimal to the nearest integer is decided by its tenths digit. Digits 0–4 keep the integer part; digits 5–9 increase it by one under the declared halfway rule.",
  "SAP-CP007-PROT-ROUND-DECIMAL-PLACES": "For a declared number of decimal places, preserve exactly that many digits and inspect the next digit only. The displayed answer must retain the requested precision, including any trailing zeroes.",
  "SAP-CP007-PROT-NEGATIVE-HALFWAY-EXPLICIT-RULE": "Negative halfway cases are ambiguous unless a tie rule is declared. With half away from zero, an exact midpoint moves to the neighbouring rounded value with the larger absolute magnitude.",
  "SAP-CP007-PROT-IDENTIFY-DECIDING-DIGIT": "The deciding digit is the digit immediately to the right of the place being rounded. It controls whether the retained target digit stays unchanged or increases by one.",
  "SAP-CP007-PROT-CORRECT-PRECISION-REPRESENTATION": "A rounded representation carries both a numeric value and a declared precision. Dropping a required trailing zero can preserve the value while losing the requested number of decimal places.",
  "SAP-CP007-PROT-REVERSE-INTEGER-ROUNDING-INTERVAL": "Reverse rounding means reconstructing every original value that maps to the displayed rounded target. For integer originals, the lower midpoint is included while the upper midpoint belongs to the next rounded target.",
  "SAP-CP007-PROT-REVERSE-DECIMAL-ROUNDING-INTERVAL": "A rounded decimal target represents a half-open interval around that target. Under positive half-up behaviour, the lower midpoint rounds into the target and the upper midpoint rounds to the next value.",
  "SAP-CP007-PROT-LEAST-INTEGER-FOR-ROUNDED-TARGET": "The least integer that rounds to a positive target is its lower midpoint. It is included because an exact halfway value rounds upward into the target.",
  "SAP-CP007-PROT-GREATEST-INTEGER-FOR-ROUNDED-TARGET": "The greatest integer that still rounds to a positive target lies one integer below the upper midpoint. The upper midpoint itself rounds upward to the next target.",
  "SAP-CP007-PROT-MISSING-DIGIT-FOR-ROUNDING": "A missing deciding digit can be tested directly against the rounding threshold. For nearest-hundred rounding, tens digits 0–4 round down and 5–9 round up.",
  "SAP-CP007-PROT-ABSOLUTE-ROUNDING-ERROR": "Absolute rounding error is the exact distance between the original number and its rounded value. Compute both on the same fixed-point scale before taking the absolute difference.",
};

function rng(seed: number): () => number {
  let state = (seed >>> 0) || 0x243f6a88;
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

function pow10(dp: number): bigint {
  return 10n ** BigInt(dp);
}

export function formatScaled(value: bigint, dp: number): string {
  const negative = value < 0n;
  const absolute = negative ? -value : value;
  if (dp === 0) return `${negative ? "-" : ""}${absolute}`;
  const scale = pow10(dp);
  const whole = absolute / scale;
  const fraction = String(absolute % scale).padStart(dp, "0");
  return `${negative ? "-" : ""}${whole}.${fraction}`;
}

export function roundScaledHalfAway(value: bigint, inputDp: number, targetDp: number): bigint {
  if (targetDp < 0 || inputDp < targetDp) throw new Error("Invalid fixed-point rounding scale.");
  const factor = pow10(inputDp - targetDp);
  const negative = value < 0n;
  const absolute = negative ? -value : value;
  let quotient = absolute / factor;
  const remainder = absolute % factor;
  if (2n * remainder >= factor) quotient += 1n;
  return negative ? -quotient : quotient;
}

export function roundIntegerToUnitHalfAway(value: bigint, unit: bigint): bigint {
  if (unit <= 0n) throw new Error("unit must be positive.");
  const negative = value < 0n;
  const absolute = negative ? -value : value;
  let quotient = absolute / unit;
  const remainder = absolute % unit;
  if (2n * remainder >= unit) quotient += 1n;
  const rounded = quotient * unit;
  return negative ? -rounded : rounded;
}

function correctIndex(seed: number): number {
  const zeroBased = seed - 1;
  return (zeroBased % 4 + Math.floor(zeroBased / 4)) % 4;
}

function makeOptions(
  answer: string,
  seed: number,
  distractors: readonly { value: string; misconceptionId: string; analysis: string }[],
): readonly SapCp007Option[] {
  const values = new Set<string>([answer]);
  const unique = distractors.filter((item) => {
    if (values.has(item.value)) return false;
    values.add(item.value);
    return true;
  }).slice(0, 3);
  if (unique.length !== 3) throw new Error(`Unable to construct three distinct distractors for answer ${answer}.`);
  const correct: SapCp007Option = Object.freeze({
    value: answer,
    isCorrect: true,
    misconceptionId: null,
    analysis: "This option follows the declared rounding place and halfway rule exactly.",
  });
  const wrong = unique.map((item): SapCp007Option => Object.freeze({ ...item, isCorrect: false }));
  const index = correctIndex(seed);
  const options = [...wrong];
  options.splice(index, 0, correct);
  return Object.freeze(options);
}

function placeName(unit: number): string {
  if (unit === 10) return "nearest ten";
  if (unit === 100) return "nearest hundred";
  return "nearest thousand";
}

function decidingPlaceName(unit: number): string {
  if (unit === 10) return "units";
  if (unit === 100) return "tens";
  return "hundreds";
}

function targetPlaceName(unit: number): string {
  if (unit === 10) return "tens";
  if (unit === 100) return "hundreds";
  return "thousands";
}

function digitAt(value: number, place: number): number {
  return Math.floor(value / place) % 10;
}

function decimalWithoutForcedZero(value: bigint, dp: number): string {
  const fixed = formatScaled(value, dp);
  if (!fixed.includes(".")) return fixed;
  return fixed.replace(/0+$/, "").replace(/\.$/, "");
}

function optionAroundInteger(answer: number, seed: number, candidates: readonly number[]): readonly SapCp007Option[] {
  return makeOptions(String(answer), seed, candidates.map((value, index) => ({
    value: String(value),
    misconceptionId: ["ROUND_DOWN_ONLY", "ROUND_ONE_UNIT_TOO_FAR", "WRONG_PLACE_VALUE"][index % 3]!,
    analysis: [
      "This keeps the lower multiple without applying the deciding digit correctly.",
      "This moves one complete rounding unit beyond the nearest permitted result.",
      "This reflects a place-value shift rather than rounding at the place stated in the question.",
    ][index % 3]!,
  })));
}

interface Generated {
  stem: string;
  answer: string;
  options: readonly SapCp007Option[];
  data: Readonly<Record<string, number | string>>;
  steps: readonly string[];
  verification: readonly string[];
}

function generateByMode(prototypeId: SapCp007PrototypeId, seed: number): Generated {
  const random = rng(seed * 104729 + SAP_CP007_PROTOTYPE_IDS.indexOf(prototypeId) * 8191 + 17);

  if (prototypeId === "SAP-CP007-PROT-ROUND-INTEGER-DECLARED-PLACE") {
    const unit = pick(random, [10, 100, 1000] as const);
    const lower = pickInt(random, 12, 240) * unit;
    const offset = pickInt(random, 1, unit - 1);
    const value = lower + offset;
    const answer = Number(roundIntegerToUnitHalfAway(BigInt(value), BigInt(unit)));
    const lowerMultiple = Math.floor(value / unit) * unit;
    const upperMultiple = lowerMultiple + unit;
    const candidates = [lowerMultiple, upperMultiple, answer + (answer === lowerMultiple ? -unit : unit), answer + 10 * (answer >= value ? 1 : -1)];
    return {
      stem: `Round ${value} to the ${placeName(unit)}.`,
      answer: String(answer),
      options: optionAroundInteger(answer, seed, candidates),
      data: { value, unit, answer },
      steps: [`The target place is ${targetPlaceName(unit)}; inspect the ${decidingPlaceName(unit)} digit ${digitAt(value, unit / 10)}.`, `${digitAt(value, unit / 10)} ${digitAt(value, unit / 10) >= 5 ? "is at least 5, so round up" : "is below 5, so keep the target digit"}; the result is ${answer}.`],
      verification: [`The two neighbouring multiples are ${lowerMultiple} and ${upperMultiple}.`, `${value} is nearer to ${answer} under the declared halfway rule.`],
    };
  }

  if (prototypeId === "SAP-CP007-PROT-ROUND-DECIMAL-NEAREST-INTEGER") {
    const whole = pickInt(random, 2, 180);
    const hundredths = pickInt(random, 1, 99);
    const scaled = BigInt(whole * 100 + hundredths);
    const rounded = Number(roundScaledHalfAway(scaled, 2, 0));
    const answer = String(rounded);
    return {
      stem: `Round ${formatScaled(scaled, 2)} to the nearest integer.`,
      answer,
      options: optionAroundInteger(rounded, seed, [whole, whole + 1, rounded + (rounded === whole ? -1 : 1), rounded + 10]),
      data: { scaled: Number(scaled), inputDp: 2, targetDp: 0, answer: rounded },
      steps: [`The tenths digit is ${Math.floor(hundredths / 10)}.`, `${Math.floor(hundredths / 10)} ${Math.floor(hundredths / 10) >= 5 ? "rounds the integer part up" : "keeps the integer part unchanged"}; the nearest integer is ${answer}.`],
      verification: [`The original value is ${formatScaled(scaled, 2)}.`, `Its distance to ${answer} is smaller than its distance to the other neighbouring integer.`],
    };
  }

  if (prototypeId === "SAP-CP007-PROT-ROUND-DECIMAL-PLACES") {
    const targetDp = pick(random, [1, 2, 3] as const);
    const inputDp = targetDp + 2;
    const scale = 10 ** inputDp;
    const whole = pickInt(random, 1, 80);
    let fraction = pickInt(random, 1, scale - 1);
    if (fraction % 100 === 0) fraction += 17;
    const scaled = BigInt(whole * scale + fraction);
    const rounded = roundScaledHalfAway(scaled, inputDp, targetDp);
    const answer = formatScaled(rounded, targetDp);
    const factor = pow10(inputDp - targetDp);
    const truncated = (scaled / factor);
    return {
      stem: `Round ${formatScaled(scaled, inputDp)} to ${targetDp} decimal place${targetDp === 1 ? "" : "s"}.`,
      answer,
      options: makeOptions(answer, seed, [
        { value: formatScaled(truncated, targetDp), misconceptionId: "TRUNCATED_NOT_ROUNDED", analysis: "This simply cuts off the discarded digits and ignores whether the deciding digit requires an increase." },
        { value: formatScaled(rounded + 1n, targetDp), misconceptionId: "ROUNDED_ONE_UNIT_HIGH", analysis: "This adds one unit in the last retained decimal place beyond the result justified by the deciding digit." },
        { value: formatScaled(rounded - 1n, targetDp), misconceptionId: "ROUNDED_ONE_UNIT_LOW", analysis: "This leaves the rounded result one unit in the last retained decimal place below the correct value." },
        { value: formatScaled(roundScaledHalfAway(scaled, inputDp, Math.max(0, targetDp - 1)), Math.max(0, targetDp - 1)), misconceptionId: "WRONG_DECIMAL_PLACE", analysis: "This rounds at a coarser decimal place than the one requested in the question." },
      ]),
      data: { scaled: Number(scaled), inputDp, targetDp, roundedScaled: Number(rounded) },
      steps: [`Keep ${targetDp} decimal place${targetDp === 1 ? "" : "s"} and inspect the next digit.`, `Apply the declared rule to that deciding digit and write exactly ${targetDp} decimal place${targetDp === 1 ? "" : "s"}: ${answer}.`],
      verification: [`The answer is stored on an exact scale of 10^${targetDp}.`, `Reconstructing the rounding interval for ${answer} contains the original value.`],
    };
  }

  if (prototypeId === "SAP-CP007-PROT-NEGATIVE-HALFWAY-EXPLICIT-RULE") {
    const targetDp = seed % 2 === 0 ? 0 : 1;
    const inputDp = targetDp + 1;
    const retainedMagnitude = targetDp === 0 ? pickInt(random, 2, 60) : pickInt(random, 20, 600);
    const scaledMagnitude = BigInt(retainedMagnitude * 10 + 5);
    const scaled = -scaledMagnitude;
    const rounded = roundScaledHalfAway(scaled, inputDp, targetDp);
    const answer = formatScaled(rounded, targetDp);
    const towardZero = formatScaled(rounded + 1n, targetDp);
    return {
      stem: `Use this rule: if a value is exactly halfway, round away from zero. Round ${formatScaled(scaled, inputDp)} to ${targetDp === 0 ? "the nearest integer" : "1 decimal place"}.`,
      answer,
      options: makeOptions(answer, seed, [
        { value: towardZero, misconceptionId: "NEGATIVE_TIE_TOWARD_ZERO", analysis: "This treats a negative halfway case as if ties move toward zero, contradicting the rule declared in the question." },
        { value: formatScaled(rounded - 1n, targetDp), misconceptionId: "NEGATIVE_TIE_EXTRA_STEP", analysis: "This moves one additional retained unit away from zero after the halfway adjustment has already been made." },
        { value: formatScaled(-rounded, targetDp), misconceptionId: "SIGN_DROPPED", analysis: "This gets the magnitude from the rounding step but incorrectly drops the negative sign from the original value." },
      ]),
      data: { scaled: Number(scaled), inputDp, targetDp, roundedScaled: Number(rounded) },
      steps: [`${formatScaled(scaled, inputDp)} lies exactly halfway between two values at the requested precision.`, `The rule says to move away from zero, so the rounded result is ${answer}.`],
      verification: [`The two candidates are equally distant from the original midpoint.`, `${answer} has the larger absolute magnitude, so it is selected by the declared tie rule.`],
    };
  }

  if (prototypeId === "SAP-CP007-PROT-IDENTIFY-DECIDING-DIGIT") {
    const unit = pick(random, [10, 100, 1000] as const);
    const value = pickInt(random, 12000, 98765);
    const decidingPlace = unit / 10;
    const decidingDigit = digitAt(value, decidingPlace);
    const answer = `${decidingPlaceName(unit)} digit (${decidingDigit})`;
    const places = [
      { name: targetPlaceName(unit), place: unit },
      { name: decidingPlaceName(unit), place: decidingPlace },
      { name: unit === 10 ? "tenths" : unit === 100 ? "units" : "tens", place: Math.max(1, decidingPlace / 10) },
      { name: unit === 10 ? "hundreds" : unit === 100 ? "thousands" : "ten-thousands", place: unit * 10 },
    ];
    const distractors = places.filter((item) => item.place !== decidingPlace).map((item, index) => ({
      value: `${item.name} digit (${digitAt(value, item.place)})`,
      misconceptionId: ["TARGET_DIGIT_NOT_DECIDER", "DIGIT_TOO_FAR_RIGHT", "DIGIT_TOO_FAR_LEFT"][index]!,
      analysis: [
        "This is the digit being retained, not the digit immediately to its right that decides the rounding direction.",
        "This digit lies beyond the immediate deciding position and cannot override the digit directly next to the target place.",
        "This digit is to the left of the target place, so it is part of the retained value rather than the rounding decision.",
      ][index]!,
    }));
    return {
      stem: `When ${value} is rounded to the ${placeName(unit)}, which digit decides whether the number rounds up or down?`,
      answer,
      options: makeOptions(answer, seed, distractors),
      data: { value, unit, decidingPlace, decidingDigit },
      steps: [`The rounding target is the ${targetPlaceName(unit)} place.`, `The digit immediately to its right is the ${decidingPlaceName(unit)} digit, which is ${decidingDigit}.`],
      verification: [`Changing digits farther right cannot change the decision once the ${decidingPlaceName(unit)} digit is fixed.`, `Therefore ${answer} is the deciding digit.`],
    };
  }

  if (prototypeId === "SAP-CP007-PROT-CORRECT-PRECISION-REPRESENTATION") {
    const whole = pickInt(random, 2, 70);
    const tenths = pickInt(random, 0, 9);
    const thousandths = pickInt(random, 1, 4);
    const scaled = BigInt(whole * 1000 + tenths * 100 + thousandths);
    const rounded = roundScaledHalfAway(scaled, 3, 2);
    const answer = formatScaled(rounded, 2);
    const unforced = decimalWithoutForcedZero(rounded, 2);
    return {
      stem: `Which is the correct representation of ${formatScaled(scaled, 3)} rounded to 2 decimal places?`,
      answer,
      options: makeOptions(answer, seed, [
        { value: unforced, misconceptionId: "TRAILING_ZERO_DROPPED", analysis: "This may have the same numeric value, but it does not display the two decimal places explicitly required by the question." },
        { value: formatScaled(scaled, 3), misconceptionId: "NOT_ROUNDED", analysis: "This repeats the original three-decimal value instead of producing a representation rounded to exactly two decimal places." },
        { value: formatScaled(rounded + 1n, 2), misconceptionId: "UNJUSTIFIED_ROUND_UP", analysis: "The deciding third decimal digit is below 5, so increasing the hundredths place is not justified." },
      ]),
      data: { scaled: Number(scaled), inputDp: 3, targetDp: 2, roundedScaled: Number(rounded), trailingZeroRequired: 1 },
      steps: [`The third decimal digit is ${thousandths}, so the hundredths digit does not increase.`, `Write the result with exactly two decimal places: ${answer}.`],
      verification: [`${answer} contains exactly two digits after the decimal point.`, `${unforced} is numerically equal but does not preserve the precision requested in the question.`],
    };
  }

  if (prototypeId === "SAP-CP007-PROT-REVERSE-INTEGER-ROUNDING-INTERVAL") {
    const unit = pick(random, [10, 100, 1000] as const);
    const target = pickInt(random, 20, 180) * unit;
    const low = target - unit / 2;
    const high = target + unit / 2 - 1;
    const answer = `${low} to ${high} (inclusive)`;
    return {
      stem: `Which range of integer values rounds to ${target} when rounded to the ${placeName(unit)}?`,
      answer,
      options: makeOptions(answer, seed, [
        { value: `${low + 1} to ${high} (inclusive)`, misconceptionId: "LOWER_MIDPOINT_EXCLUDED", analysis: "This incorrectly removes the lower midpoint, even though a positive halfway value rounds upward into the stated target." },
        { value: `${low} to ${high + 1} (inclusive)`, misconceptionId: "UPPER_MIDPOINT_INCLUDED", analysis: "This incorrectly includes the upper midpoint, which rounds upward to the next multiple rather than back to the stated target." },
        { value: `${low - 1} to ${high} (inclusive)`, misconceptionId: "LOWER_RANGE_EXTENDED", analysis: "This includes one integer below the valid lower boundary; that value is closer to the previous rounded multiple." },
      ]),
      data: { target, unit, low, high },
      steps: [`Half of the rounding unit ${unit} is ${unit / 2}.`, `For integer originals, the valid values run from ${target} − ${unit / 2} = ${low} through ${target} + ${unit / 2} − 1 = ${high}.`],
      verification: [`${low} is the lower halfway value and rounds up to ${target}.`, `${high + 1} is the upper halfway value and rounds up to ${target + unit}, so it is excluded.`],
    };
  }

  if (prototypeId === "SAP-CP007-PROT-REVERSE-DECIMAL-ROUNDING-INTERVAL") {
    const targetTenths = pickInt(random, 15, 250);
    const target = formatScaled(BigInt(targetTenths), 1);
    const lowHundredths = targetTenths * 10 - 5;
    const highHundredths = targetTenths * 10 + 5;
    const low = formatScaled(BigInt(lowHundredths), 2);
    const high = formatScaled(BigInt(highHundredths), 2);
    const answer = `${low} ≤ x < ${high}`;
    return {
      stem: `A positive number rounds to ${target} to 1 decimal place. Which interval contains exactly all possible original values?`,
      answer,
      options: makeOptions(answer, seed, [
        { value: `${low} < x ≤ ${high}`, misconceptionId: "ROUNDING_BOUNDARIES_REVERSED", analysis: "This reverses the boundary inclusion: the lower midpoint belongs to the target, while the upper midpoint rounds to the next tenth." },
        { value: `${formatScaled(BigInt(lowHundredths + 1), 2)} ≤ x < ${high}`, misconceptionId: "LOWER_MIDPOINT_LOST", analysis: "This starts one hundredth above the true lower midpoint and therefore omits valid values that round to the target." },
        { value: `${low} ≤ x ≤ ${high}`, misconceptionId: "UPPER_MIDPOINT_INCLUDED", analysis: "This includes the upper midpoint even though that exact halfway value rounds upward to the next one-decimal result." },
      ]),
      data: { targetTenths, lowHundredths, highHundredths, targetDp: 1 },
      steps: [`One decimal place has unit 0.1, so half a unit is 0.05.`, `The valid positive interval is ${target} − 0.05 through, but not including, ${target} + 0.05: ${answer}.`],
      verification: [`The lower boundary ${low} rounds up to ${target}.`, `The upper boundary ${high} rounds up to ${formatScaled(BigInt(targetTenths + 1), 1)}, so ${high} is excluded.`],
    };
  }

  if (prototypeId === "SAP-CP007-PROT-LEAST-INTEGER-FOR-ROUNDED-TARGET") {
    const unit = pick(random, [10, 100, 1000] as const);
    const target = pickInt(random, 20, 180) * unit;
    const answerNumber = target - unit / 2;
    return {
      stem: `What is the least integer that rounds to ${target} when rounded to the ${placeName(unit)}?`,
      answer: String(answerNumber),
      options: optionAroundInteger(answerNumber, seed, [answerNumber - 1, answerNumber + 1, target, target - unit]),
      data: { target, unit, answer: answerNumber },
      steps: [`Half of ${unit} is ${unit / 2}.`, `Subtract the half-unit from the target: ${target} − ${unit / 2} = ${answerNumber}; this lower midpoint is included.`],
      verification: [`${answerNumber} rounds up to ${target}.`, `${answerNumber - 1} lies below the midpoint and rounds to ${target - unit}.`],
    };
  }

  if (prototypeId === "SAP-CP007-PROT-GREATEST-INTEGER-FOR-ROUNDED-TARGET") {
    const unit = pick(random, [10, 100, 1000] as const);
    const target = pickInt(random, 20, 180) * unit;
    const upperMidpoint = target + unit / 2;
    const answerNumber = upperMidpoint - 1;
    return {
      stem: `What is the greatest integer that rounds to ${target} when rounded to the ${placeName(unit)}?`,
      answer: String(answerNumber),
      options: optionAroundInteger(answerNumber, seed, [upperMidpoint, answerNumber - 1, target, target + unit - 1]),
      data: { target, unit, upperMidpoint, answer: answerNumber },
      steps: [`The upper midpoint is ${target} + ${unit / 2} = ${upperMidpoint}.`, `That midpoint rounds to the next target, so the greatest valid integer is one less: ${answerNumber}.`],
      verification: [`${answerNumber} is still below the upper midpoint and rounds to ${target}.`, `${upperMidpoint} is exactly halfway and rounds upward to ${target + unit}.`],
    };
  }

  if (prototypeId === "SAP-CP007-PROT-MISSING-DIGIT-FOR-ROUNDING") {
    const thousands = pickInt(random, 2, 8);
    const hundreds = pickInt(random, 1, 8);
    const units = pickInt(random, 0, 9);
    const roundUp = seed % 2 === 0;
    const validDigits = roundUp ? [5, 6, 7, 8, 9] : [0, 1, 2, 3, 4];
    const invalidDigits = roundUp ? [0, 1, 2, 3, 4] : [5, 6, 7, 8, 9];
    const answerDigit = pick(random, validDigits);
    const baseHundred = thousands * 1000 + hundreds * 100;
    const target = roundUp ? baseHundred + 100 : baseHundred;
    const optionDigits = [answerDigit, ...invalidDigits.slice((seed % 2), (seed % 2) + 3)];
    const options = makeOptions(String(answerDigit), seed, optionDigits.filter((digit) => digit !== answerDigit).map((digit, index) => ({
      value: String(digit),
      misconceptionId: "MISSING_DIGIT_WRONG_SIDE_OF_THRESHOLD",
      analysis: `Using ${digit} puts the deciding tens digit on the wrong side of the 5-threshold, so the number rounds to the other hundred.`,
    })));
    return {
      stem: `The number ${thousands}${hundreds}□${units} becomes ${target} when rounded to the nearest hundred. Which of the following digits can replace □?`,
      answer: String(answerDigit),
      options,
      data: { thousands, hundreds, units, target, roundUp: roundUp ? 1 : 0, answerDigit },
      steps: [`The box is the tens digit, which decides nearest-hundred rounding.`, `To reach ${target}, the tens digit must be ${roundUp ? "5–9" : "0–4"}; among the options, ${answerDigit} satisfies that condition.`],
      verification: [`Substituting ${answerDigit} gives ${thousands}${hundreds}${answerDigit}${units}.`, `Rounding that number to the nearest hundred gives ${target}.`],
    };
  }

  const whole = pickInt(random, 2, 90);
  const tenths = pickInt(random, 0, 9);
  const hundredths = pick(random, [1, 2, 3, 4, 5, 6, 7, 8, 9] as const);
  const scaled = BigInt(whole * 100 + tenths * 10 + hundredths);
  const roundedTenths = roundScaledHalfAway(scaled, 2, 1);
  const roundedAtHundredths = roundedTenths * 10n;
  const errorHundredths = roundedAtHundredths >= scaled ? roundedAtHundredths - scaled : scaled - roundedAtHundredths;
  const answer = formatScaled(errorHundredths, 2);
  const errorValues = [1, 2, 3, 4, 5].filter((value) => value !== Number(errorHundredths));
  return {
    stem: `${formatScaled(scaled, 2)} is rounded to 1 decimal place as ${formatScaled(roundedTenths, 1)}. What is the absolute rounding error?`,
    answer,
    options: makeOptions(answer, seed, errorValues.slice(0, 3).map((value) => ({
      value: formatScaled(BigInt(value), 2),
      misconceptionId: "ROUNDING_ERROR_DISTANCE_MISREAD",
      analysis: "This does not equal the exact absolute distance between the original hundredths value and the displayed one-decimal rounded value.",
    }))),
    data: { scaled: Number(scaled), inputDp: 2, roundedTenths: Number(roundedTenths), errorHundredths: Number(errorHundredths) },
    steps: [`Write the rounded value on the same hundredths scale: ${formatScaled(roundedAtHundredths, 2)}.`, `Take the absolute difference: |${formatScaled(scaled, 2)} − ${formatScaled(roundedAtHundredths, 2)}| = ${answer}.`],
    verification: [`The error is a non-negative distance, not a signed change.`, `${answer} does not exceed 0.05, the half-unit limit for rounding to 1 decimal place.`],
  };
}

function validate(pkg: Omit<SapCp007Package, "validation">): SapCp007Package["validation"] {
  const errors: string[] = [];
  if (pkg.options.length !== 4) errors.push("Exactly four options are required.");
  if (new Set(pkg.options.map((option) => option.value)).size !== 4) errors.push("Options must be distinct.");
  if (pkg.options.filter((option) => option.isCorrect).length !== 1) errors.push("Exactly one option must be correct.");
  if (pkg.options[pkg.correctIndex]?.value !== pkg.canonicalAnswer) errors.push("Correct index is not answer-bound.");
  if (pkg.explanation.steps.length < 2 || pkg.explanation.verification.length < 2) errors.push("Explanation and verification each require at least two learner-visible steps.");
  if (pkg.tieRule !== SAP_CP007_TIE_RULE) errors.push("Tie rule drifted from checkpoint authority.");
  if (pkg.lifecycle.permanentQlId !== null || pkg.lifecycle.active || pkg.lifecycle.questionStudioDiscoverable || pkg.lifecycle.questionBankWritable || pkg.lifecycle.testEligible || pkg.lifecycle.publiclyPublishable) errors.push("CP-007 candidate lifecycle must remain inactive and unallocated.");
  if (/significant figure/i.test(pkg.stem)) errors.push("Source-guarded significant-figure content is not admitted to this foundation.");
  return Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) });
}

export function generateSapCp007(prototypeId: SapCp007PrototypeId, seed: number): SapCp007Package {
  if (!SAP_CP007_PROTOTYPE_IDS.includes(prototypeId)) throw new Error(`Unknown CP-007 prototype ${prototypeId}.`);
  if (!Number.isInteger(seed) || seed < 1) throw new Error("Seed must be a positive integer.");
  const catalogue = SAP_CP007_CATALOGUE.find((item) => item.prototypeId === prototypeId)!;
  const generated = generateByMode(prototypeId, seed);
  const base = Object.freeze({
    checkpointId: "SAP-CP-007" as const,
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
      coreConcept: CORE[prototypeId],
      steps: Object.freeze(generated.steps),
      finalAnswer: `Therefore, the answer is ${generated.answer}.`,
      verification: Object.freeze(generated.verification),
    }),
    oracle: Object.freeze({ kind: prototypeId, data: generated.data }),
    canonicalPayloadKey: JSON.stringify({ prototypeId, stem: generated.stem, answer: generated.answer, data: generated.data }),
    generationIdentity: `${prototypeId}:seed:${seed}:${JSON.stringify(generated.data)}`,
    lifecycle: LIFECYCLE,
  });
  return Object.freeze({ ...base, validation: validate(base) });
}

export function generateSapCp007Sweep(seedsPerMode = 100): readonly SapCp007Package[] {
  if (!Number.isInteger(seedsPerMode) || seedsPerMode < 1) throw new Error("seedsPerMode must be positive.");
  return Object.freeze(SAP_CP007_PROTOTYPE_IDS.flatMap((prototypeId) =>
    Array.from({ length: seedsPerMode }, (_, index) => generateSapCp007(prototypeId, index + 1)),
  ));
}
