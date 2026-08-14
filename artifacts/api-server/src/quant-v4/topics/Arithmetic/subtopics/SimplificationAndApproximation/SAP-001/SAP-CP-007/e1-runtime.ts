import {
  SAP_E1_INACTIVE_LIFECYCLE,
  sapE1BaseValidation,
  sapE1Options,
  type SapE1CandidatePackage,
} from "../../SAP-E1-CANDIDATE-TYPES";

export const SAP_CP007_E1_SIGFIG_CANDIDATE_ID = "SAP-CP007-E1-CAND-ROUND-TO-SIGNIFICANT-FIGURES" as const;

function formatScaled(value: number, scale: number): string {
  const sign = value < 0 ? "-" : "";
  const digits = String(Math.abs(value)).padStart(scale + 1, "0");
  if (scale === 0) return `${sign}${digits}`;
  return `${sign}${digits.slice(0, -scale)}.${digits.slice(-scale)}`;
}

function roundState(coefficient: number, scale: number, significantFigures: number): { units: number; places: number; remainder: number; divisor: number; answer: string } {
  const digits = String(coefficient);
  const drop = digits.length - significantFigures;
  if (drop <= 0) return { units: coefficient, places: scale, remainder: 0, divisor: 1, answer: formatScaled(coefficient, scale) };
  const divisor = 10 ** drop;
  const remainder = coefficient % divisor;
  let units = Math.floor(coefficient / divisor);
  if (2 * remainder >= divisor) units += 1;
  const places = scale - drop;
  if (places < 0) return { units: units * (10 ** -places), places: 0, remainder, divisor, answer: String(units * (10 ** -places)) };
  return { units, places, remainder, divisor, answer: formatScaled(units, places) };
}

function truncateState(coefficient: number, scale: number, significantFigures: number): string {
  const digits = String(coefficient);
  const drop = Math.max(0, digits.length - significantFigures);
  const divisor = 10 ** drop;
  const units = Math.floor(coefficient / divisor);
  const places = scale - drop;
  return places >= 0 ? formatScaled(units, places) : String(units * 10 ** -places);
}

export function generateSapCp007E1SignificantFigures(seed: number): SapE1CandidatePackage {
  if (!Number.isInteger(seed) || seed < 1) throw new Error("Seed must be a positive integer.");
  const i = seed - 1;
  const coefficient = 21357 + 137 * i;
  const significantFigures = 2 + (i % 3);
  const drop = String(coefficient).length - significantFigures;
  const scale = drop + 1 + (Math.floor(i / 3) % 2);
  const value = formatScaled(coefficient, scale);
  const state = roundState(coefficient, scale, significantFigures);
  const answer = state.answer;
  const correctIndex = i % 4;
  const oneFewer = roundState(coefficient, scale, Math.max(1, significantFigures - 1)).answer;
  const oneMore = roundState(coefficient, scale, Math.min(5, significantFigures + 1)).answer;
  const truncated = truncateState(coefficient, scale, significantFigures);
  const adjacentLow = formatScaled(Math.max(0, state.units - 1), state.places);
  const adjacentHigh = formatScaled(state.units + 1, state.places);
  const options = sapE1Options(answer, [
    { value: truncated, misconceptionId: "TRUNCATED_NOT_ROUNDED", analysis: "The extra digits are simply cut off instead of using the next digit to decide whether to round up." },
    { value: oneFewer, misconceptionId: "ONE_SIGNIFICANT_FIGURE_TOO_FEW", analysis: "The number is rounded one significant figure earlier than the question requires." },
    { value: oneMore, misconceptionId: "ONE_SIGNIFICANT_FIGURE_TOO_MANY", analysis: "One extra significant figure is retained beyond the required precision." },
    { value: adjacentLow, misconceptionId: "LAST_KEPT_DIGIT_ONE_LOW", analysis: "The correct significant-figure place is used, but the last retained digit is one too low." },
    { value: adjacentHigh, misconceptionId: "LAST_KEPT_DIGIT_ONE_HIGH", analysis: "The correct significant-figure place is used, but the last retained digit is one too high." },
  ], correctIndex);
  const digitText = String(coefficient);
  const kept = digitText.slice(0, significantFigures);
  const nextDigit = digitText[significantFigures] ?? "0";
  const action = Number(nextDigit) >= 5 ? "round the last retained digit up" : "leave the last retained digit unchanged";
  const steps = Object.freeze([
    `The first ${significantFigures} significant digits are ${kept}; the next digit is ${nextDigit}.`,
    `Since the next digit is ${nextDigit}, ${action}.`,
    `So ${value} rounded to ${significantFigures} significant figures is ${answer}.`,
  ]);
  const errors = [...sapE1BaseValidation({ stem: `Round ${value} to ${significantFigures} significant figures.`, answer, options, correctIndex, steps })];
  if (String(coefficient).length !== 5) errors.push("E1 significant-figure coefficient must contain five explicit digits.");
  if (state.places < 1) errors.push("E1 answer must display an explicit decimal place so trailing precision is unambiguous.");
  const data = Object.freeze({ coefficient, scale, significantFigures, drop, remainder: state.remainder, divisor: state.divisor, roundedUnits: state.units, resultPlaces: state.places });
  const stem = `Round ${value} to ${significantFigures} significant figures.`;
  return Object.freeze({
    packageId: "SAP-001",
    checkpointId: "SAP-CP-007",
    candidateId: SAP_CP007_E1_SIGFIG_CANDIDATE_ID,
    candidateStatus: "E1_PROVISIONAL_UNALLOCATED",
    sourceDisposition: "E1_ADD_ARITHMETIC_SIGNIFICANT_FIGURE_ROUNDING",
    seed,
    locale: "en-IN",
    difficulty: significantFigures === 4 ? "MEDIUM" : "EASY",
    stem,
    canonicalAnswer: answer,
    options,
    correctIndex,
    explanation: Object.freeze({
      coreConcept: "Count significant digits from the first non-zero digit and use the next digit to make the rounding decision.",
      steps,
      finalAnswer: `Therefore, the rounded value is ${answer}.`,
      verification: Object.freeze([`Exact integer check: coefficient ${coefficient} is rounded by divisor ${state.divisor} with remainder ${state.remainder}.`]),
    }),
    oracle: Object.freeze({ kind: "ROUND_TO_SIGNIFICANT_FIGURES", data }),
    canonicalPayloadKey: JSON.stringify({ candidateId: SAP_CP007_E1_SIGFIG_CANDIDATE_ID, seed, data, answer }),
    generationIdentity: `${SAP_CP007_E1_SIGFIG_CANDIDATE_ID}:${seed}:${coefficient}:${scale}:${significantFigures}`,
    lifecycle: SAP_E1_INACTIVE_LIFECYCLE,
    validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }),
  });
}
