import {
  SAP_CP007_CATALOGUE,
  SAP_CP007_PROTOTYPE_IDS,
  SAP_CP007_TIE_RULE,
  formatScaled,
  generateSapCp007 as generateBase,
  roundIntegerToUnitHalfAway,
  roundScaledHalfAway,
  type SapCp007Difficulty,
  type SapCp007Option,
  type SapCp007Package,
  type SapCp007PrototypeId,
  type SapCp007TaskDirection,
} from "./runtime";

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
} from "./runtime";

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

function deterministicInt(seed: number, salt: number, min: number, max: number): number {
  let value = (Math.imul(seed + salt, 1103515245) + 12345 + Math.imul(salt, 2654435761)) >>> 0;
  value = (value ^ (value >>> 16)) >>> 0;
  return min + (value % (max - min + 1));
}

function makeOptions(
  answer: string,
  seed: number,
  distractors: readonly { value: string; misconceptionId: string; analysis: string }[],
): readonly SapCp007Option[] {
  const seen = new Set<string>([answer]);
  const wrong: SapCp007Option[] = [];
  for (const distractor of distractors) {
    if (seen.has(distractor.value)) continue;
    seen.add(distractor.value);
    wrong.push(Object.freeze({ ...distractor, isCorrect: false }));
    if (wrong.length === 3) break;
  }
  if (wrong.length !== 3) throw new Error(`CP-007 v2 could not build three distinct distractors for ${answer}.`);
  const correct: SapCp007Option = Object.freeze({
    value: answer,
    isCorrect: true,
    misconceptionId: null,
    analysis: "This option follows the declared rounding place and halfway rule exactly.",
  });
  const options = [...wrong];
  options.splice(correctIndex(seed), 0, correct);
  return Object.freeze(options);
}

function placeName(unit: number): string {
  if (unit === 10) return "nearest ten";
  if (unit === 100) return "nearest hundred";
  return "nearest thousand";
}

function targetPlaceName(unit: number): string {
  if (unit === 10) return "tens";
  if (unit === 100) return "hundreds";
  return "thousands";
}

function decidingPlaceName(unit: number): string {
  if (unit === 10) return "units";
  if (unit === 100) return "tens";
  return "hundreds";
}

function digitAt(value: number, place: number): number {
  return Math.floor(value / place) % 10;
}

function packageFrom(
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
    generationIdentity: `${prototypeId}:v2:seed:${seed}:${JSON.stringify(generated.data)}`,
    lifecycle: LIFECYCLE,
  });

  const errors: string[] = [];
  if (partial.options.length !== 4) errors.push("Exactly four options are required.");
  if (new Set(partial.options.map((option) => option.value)).size !== 4) errors.push("Options must be distinct.");
  if (partial.options.filter((option) => option.isCorrect).length !== 1) errors.push("Exactly one option must be correct.");
  if (partial.options[partial.correctIndex]?.value !== partial.canonicalAnswer) errors.push("Correct index is not answer-bound.");
  if (partial.explanation.steps.length < 2 || partial.explanation.verification.length < 2) errors.push("Explanation and verification each require at least two steps.");
  if (/significant figure/i.test(partial.stem)) errors.push("Source-guarded significant figures are not admitted to this foundation.");
  return Object.freeze({ ...partial, validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }) });
}

function generateIntegerDeclaredPlace(seed: number): SapCp007Package {
  const units = [10, 100, 1000] as const;
  const unit = units[(seed * 5 + Math.floor(seed / 3)) % units.length]!;
  const lowerMultiple = deterministicInt(seed, 11, 12, 240) * unit;
  const offset = deterministicInt(seed, 23, 1, unit - 1);
  const value = lowerMultiple + offset;
  const answerNumber = Number(roundIntegerToUnitHalfAway(BigInt(value), BigInt(unit)));
  const upperMultiple = lowerMultiple + unit;
  const decidingDigit = digitAt(value, unit / 10);
  const oppositeNeighbour = answerNumber === lowerMultiple ? upperMultiple : lowerMultiple;
  const fartherSameDirection = answerNumber + (answerNumber >= value ? unit : -unit);
  const wrongPlaceValue = answerNumber + (answerNumber >= value ? 2 * unit : -2 * unit);
  const answer = String(answerNumber);

  return packageFrom("SAP-CP007-PROT-ROUND-INTEGER-DECLARED-PLACE", seed, {
    stem: `Round ${value} to the ${placeName(unit)}.`,
    answer,
    options: makeOptions(answer, seed, [
      {
        value: String(oppositeNeighbour),
        misconceptionId: "ROUNDING_DIRECTION_REVERSED",
        analysis: "This chooses the neighbouring multiple on the wrong side of the deciding digit instead of following the nearest-place rule.",
      },
      {
        value: String(fartherSameDirection),
        misconceptionId: "ONE_ROUNDING_UNIT_TOO_FAR",
        analysis: "This moves one full rounding unit beyond the nearest valid multiple after the rounding direction has already been decided.",
      },
      {
        value: String(wrongPlaceValue),
        misconceptionId: "PLACE_VALUE_OVERSHOOT",
        analysis: "This changes the retained place by two complete rounding units, which is not justified by a single deciding digit.",
      },
      {
        value: String(answerNumber + 10 * (answerNumber >= value ? 1 : -1)),
        misconceptionId: "WRONG_TARGET_PLACE",
        analysis: "This reflects a tens-sized adjustment rather than rounding at the place explicitly stated in the question.",
      },
    ]),
    data: Object.freeze({ value, unit, answer: answerNumber, decidingDigit, v2: 1 }),
    coreConcept: "To round an integer to a declared place, retain the target place and inspect only the digit immediately to its right. Under the declared half-away-from-zero rule, a deciding digit of 5 or more moves to the next multiple; 0–4 keeps the lower multiple.",
    steps: Object.freeze([
      `The target place is ${targetPlaceName(unit)}; the deciding ${decidingPlaceName(unit)} digit is ${decidingDigit}.`,
      `${decidingDigit} ${decidingDigit >= 5 ? "is at least 5, so move to the next multiple" : "is below 5, so keep the lower multiple"}; the rounded value is ${answer}.`,
    ]),
    verification: Object.freeze([
      `The neighbouring multiples are ${lowerMultiple} and ${upperMultiple}.`,
      `Applying the declared rule to ${value} at unit ${unit} independently gives ${answer}.`,
    ]),
  });
}

function generateDecidingDigit(seed: number): SapCp007Package {
  const units = [10, 100, 1000] as const;
  const unit = units[(seed * 7 + Math.floor(seed / 5)) % units.length]!;
  const value = deterministicInt(seed, 41, 12000, 98765);
  const decidingPlace = unit / 10;
  const decidingDigit = digitAt(value, decidingPlace);
  const answer = `${decidingPlaceName(unit)} digit (${decidingDigit})`;

  const positions = unit === 10
    ? [
        { name: "tens", place: 10 },
        { name: "units", place: 1 },
        { name: "hundreds", place: 100 },
        { name: "thousands", place: 1000 },
      ]
    : unit === 100
      ? [
          { name: "hundreds", place: 100 },
          { name: "tens", place: 10 },
          { name: "units", place: 1 },
          { name: "thousands", place: 1000 },
        ]
      : [
          { name: "thousands", place: 1000 },
          { name: "hundreds", place: 100 },
          { name: "tens", place: 10 },
          { name: "ten-thousands", place: 10000 },
        ];

  const distractors = positions
    .filter((item) => item.place !== decidingPlace)
    .map((item, index) => ({
      value: `${item.name} digit (${digitAt(value, item.place)})`,
      misconceptionId: ["TARGET_DIGIT_NOT_DECIDER", "DIGIT_TOO_FAR_RIGHT", "DIGIT_TOO_FAR_LEFT"][index]!,
      analysis: [
        "This is a retained place or another visible digit, not the single digit immediately to the right of the target rounding place.",
        "This digit lies farther to the right than the deciding position and cannot override the digit directly adjacent to the target place.",
        "This digit lies to the left of the deciding position, so it belongs to the retained magnitude rather than the rounding decision.",
      ][index]!,
    }));

  return packageFrom("SAP-CP007-PROT-IDENTIFY-DECIDING-DIGIT", seed, {
    stem: `When ${value} is rounded to the ${placeName(unit)}, which digit decides whether the number rounds up or down?`,
    answer,
    options: makeOptions(answer, seed, distractors),
    data: Object.freeze({ value, unit, decidingPlace, decidingDigit, v2: 1 }),
    coreConcept: "The deciding digit is always the digit immediately to the right of the place being rounded. It alone determines whether the retained target digit stays unchanged or increases by one under the declared rounding rule.",
    steps: Object.freeze([
      `The requested rounding place is ${targetPlaceName(unit)}.`,
      `The digit immediately to its right is the ${decidingPlaceName(unit)} digit, and here that digit is ${decidingDigit}.`,
    ]),
    verification: Object.freeze([
      `The ${decidingPlaceName(unit)} place has value ${decidingPlace}.`,
      `Reading ${value} at that place gives digit ${decidingDigit}, so ${answer} is the required deciding digit.`,
    ]),
  });
}

export function generateSapCp007(prototypeId: SapCp007PrototypeId, seed: number): SapCp007Package {
  if (!Number.isInteger(seed) || seed < 1) throw new Error("Seed must be a positive integer.");
  if (prototypeId === "SAP-CP007-PROT-ROUND-INTEGER-DECLARED-PLACE") return generateIntegerDeclaredPlace(seed);
  if (prototypeId === "SAP-CP007-PROT-IDENTIFY-DECIDING-DIGIT") return generateDecidingDigit(seed);
  return generateBase(prototypeId, seed);
}

export function generateSapCp007Sweep(seedsPerMode = 100): readonly SapCp007Package[] {
  if (!Number.isInteger(seedsPerMode) || seedsPerMode < 1) throw new Error("seedsPerMode must be positive.");
  return Object.freeze(SAP_CP007_PROTOTYPE_IDS.flatMap((prototypeId) =>
    Array.from({ length: seedsPerMode }, (_, index) => generateSapCp007(prototypeId, index + 1)),
  ));
}
