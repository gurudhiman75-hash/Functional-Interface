import {
  SAP_CP007_CATALOGUE,
  SAP_CP007_PROTOTYPE_IDS,
  SAP_CP007_TIE_RULE,
  formatScaled,
  generateSapCp007 as generateBase,
  roundScaledHalfAway,
  type SapCp007Difficulty,
  type SapCp007Option,
  type SapCp007Package,
  type SapCp007PrototypeId,
  type SapCp007TaskDirection,
} from "./runtime-v4";

export { SAP_CP007_CATALOGUE, SAP_CP007_PROTOTYPE_IDS, SAP_CP007_TIE_RULE, formatScaled };
export type { SapCp007Package, SapCp007PrototypeId } from "./runtime-v4";

const LIFECYCLE: SapCp007Package["lifecycle"] = Object.freeze({
  permanentQlId: null,
  contentStatus: "ENGLISH_REVIEW_CANDIDATE",
  active: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
});

function unforced(value: bigint): string {
  return formatScaled(value, 2).replace(/0+$/, "").replace(/\.$/, "");
}

function replaceNearestIntegerDistractors(base: SapCp007Package): SapCp007Package {
  const answer = Number(base.canonicalAnswer);
  const candidateValues = [answer - 1, answer + 1, answer - 2, answer + 2]
    .filter((value) => value >= 0)
    .map(String)
    .filter((value) => value !== base.canonicalAnswer)
    .slice(0, 3);
  if (new Set(candidateValues).size !== 3) throw new Error(`${base.seed}: could not build nearest-integer editorial distractors.`);
  const misconceptionIds = ["NEIGHBOUR_BELOW", "NEIGHBOUR_ABOVE", "TWO_INTEGER_OVERSHOOT"];
  const analyses = [
    "This chooses the neighbouring integer below the correct rounded result instead of applying the tenths digit to the given decimal.",
    "This chooses the neighbouring integer above the correct rounded result and moves one integer farther than the deciding digit permits.",
    "This moves two integer steps away from the correct rounded result, which cannot be justified by a single nearest-integer rounding decision.",
  ];
  const wrong: SapCp007Option[] = candidateValues.map((value, index) => Object.freeze({
    value,
    isCorrect: false,
    misconceptionId: misconceptionIds[index]!,
    analysis: analyses[index]!,
  }));
  const correct = base.options.find((option) => option.isCorrect)!;
  const options = [...wrong];
  options.splice(base.correctIndex, 0, correct);
  return Object.freeze({
    ...base,
    options: Object.freeze(options),
    canonicalPayloadKey: JSON.stringify({ prototypeId: base.prototypeId, stem: base.stem, answer: base.canonicalAnswer, data: base.oracle.data, editorial: 1 }),
    generationIdentity: `${base.generationIdentity}:EDITORIAL-NEAREST-INTEGER`,
  });
}

function correctIndex(seed: number): number {
  const n = seed - 1;
  return (n % 4 + Math.floor(n / 4)) % 4;
}

function generatePrecisionRepresentation(seed: number): SapCp007Package {
  const prototypeId = "SAP-CP007-PROT-CORRECT-PRECISION-REPRESENTATION" as const;
  const n = seed - 1;
  const whole = 10 + Math.floor(n / 10);
  const tenths = n % 10;
  const carryCase = seed % 2 === 0;
  const hundredths = carryCase ? 9 : 0;
  const thousandths = carryCase ? 5 + (n % 5) : 1 + (n % 4);
  const scaled = BigInt(whole * 1000 + tenths * 100 + hundredths * 10 + thousandths);
  const rounded = roundScaledHalfAway(scaled, 3, 2);
  const answer = formatScaled(rounded, 2);
  if (!answer.endsWith("0")) throw new Error(`${seed}: precision editorial state does not preserve a trailing zero.`);
  const original = formatScaled(scaled, 3);
  const truncated = scaled / 10n;
  const thirdWrong = truncated !== rounded ? formatScaled(truncated, 2) : formatScaled(rounded + 1n, 2);
  const thirdMisconception = truncated !== rounded ? "TRUNCATED_NOT_ROUNDED" : "UNJUSTIFIED_ROUND_UP";
  const thirdAnalysis = truncated !== rounded
    ? "This truncates at the hundredths place even though the third decimal digit requires the hundredths digit to increase and carry."
    : "This increases the hundredths place even though the third decimal digit is below 5 and does not justify rounding upward.";
  const wrong: SapCp007Option[] = [
    Object.freeze({ value: unforced(rounded), isCorrect: false, misconceptionId: "TRAILING_ZERO_DROPPED", analysis: "This may be numerically equal, but it does not display the two decimal places explicitly required by the question." }),
    Object.freeze({ value: original, isCorrect: false, misconceptionId: "NOT_ROUNDED", analysis: "This repeats the original three-decimal value instead of producing the requested two-decimal rounded representation." }),
    Object.freeze({ value: thirdWrong, isCorrect: false, misconceptionId: thirdMisconception, analysis: thirdAnalysis }),
  ];
  const values = new Set([answer, ...wrong.map((option) => option.value)]);
  if (values.size !== 4) throw new Error(`${seed}: precision editorial options collapsed.`);
  const correct: SapCp007Option = Object.freeze({ value: answer, isCorrect: true, misconceptionId: null, analysis: "This both rounds correctly and preserves exactly two decimal places, including the required trailing zero." });
  const options = [...wrong];
  const index = correctIndex(seed);
  options.splice(index, 0, correct);
  const catalogue = SAP_CP007_CATALOGUE.find((item) => item.prototypeId === prototypeId)!;
  const data = Object.freeze({ scaled: Number(scaled), inputDp: 3, targetDp: 2, roundedScaled: Number(rounded), trailingZeroRequired: 1, carryCase: carryCase ? 1 : 0, whole, tenths, hundredths, thousandths, editorialMode: 2 });
  const explanation = carryCase
    ? Object.freeze({
        coreConcept: "A rounded representation carries both its numerical value and its requested precision. When the third decimal digit is 5 or more, the hundredths digit must increase; if that digit is 9, the increase carries into the tenths place, and the resulting trailing zero must still be displayed to show two decimal places.",
        steps: Object.freeze([
          `The third decimal digit in ${original} is ${thousandths}, so the hundredths digit 9 must increase by one.`,
          `That increase carries into the tenths place; write the rounded result with exactly two decimal places: ${answer}.`,
        ]),
        finalAnswer: `Therefore, the answer is ${answer}.`,
        verification: Object.freeze([
          `Truncating would give ${formatScaled(truncated, 2)}, but the deciding digit ${thousandths} requires rounding upward.`,
          `${answer} contains exactly two digits after the decimal point and preserves the required trailing zero.`,
        ]),
      })
    : Object.freeze({
        coreConcept: "A rounded representation carries both its numerical value and its requested precision. When rounding to two decimal places, keep exactly two digits after the decimal point; a trailing zero must remain visible even when removing it would not change the numerical value.",
        steps: Object.freeze([
          `The third decimal digit in ${original} is ${thousandths}, which is below 5, so the hundredths digit remains 0.`,
          `Write the rounded result with exactly two decimal places, including the required trailing zero: ${answer}.`,
        ]),
        finalAnswer: `Therefore, the answer is ${answer}.`,
        verification: Object.freeze([
          `${answer} has exactly two digits after the decimal point.`,
          `${unforced(rounded)} is numerically equal but does not preserve the two-decimal precision requested in the question.`,
        ]),
      });
  const partial: Omit<SapCp007Package, "validation"> = Object.freeze({
    checkpointId: "SAP-CP-007",
    prototypeId,
    proposedPermanentQlId: catalogue.proposedPermanentQlId,
    seed,
    difficulty: catalogue.difficulty as SapCp007Difficulty,
    taskDirection: catalogue.taskDirection as SapCp007TaskDirection,
    tieRule: SAP_CP007_TIE_RULE,
    stem: `Which is the correct representation of ${original} rounded to 2 decimal places?`,
    canonicalAnswer: answer,
    options: Object.freeze(options),
    correctIndex: index,
    explanation,
    oracle: Object.freeze({ kind: prototypeId, data }),
    canonicalPayloadKey: JSON.stringify({ prototypeId, stem: original, answer, data }),
    generationIdentity: `${prototypeId}:EDITORIAL-V2:seed:${seed}:${JSON.stringify(data)}`,
    lifecycle: LIFECYCLE,
  });
  const errors: string[] = [];
  if (options.length !== 4 || new Set(options.map((option) => option.value)).size !== 4) errors.push("Precision editorial options must be four distinct values.");
  if (options.filter((option) => option.isCorrect).length !== 1) errors.push("Exactly one precision editorial option must be correct.");
  if (options[index]?.value !== answer) errors.push("Precision editorial correct index is not answer-bound.");
  return Object.freeze({ ...partial, validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }) });
}

export function generateSapCp007(prototypeId: SapCp007PrototypeId, seed: number): SapCp007Package {
  if (prototypeId === "SAP-CP007-PROT-CORRECT-PRECISION-REPRESENTATION") return generatePrecisionRepresentation(seed);
  const base = generateBase(prototypeId, seed);
  if (prototypeId === "SAP-CP007-PROT-ROUND-DECIMAL-NEAREST-INTEGER") return replaceNearestIntegerDistractors(base);
  return base;
}
