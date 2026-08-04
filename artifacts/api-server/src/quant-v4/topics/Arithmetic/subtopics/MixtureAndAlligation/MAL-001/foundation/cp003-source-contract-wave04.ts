import {
  addRational,
  compareRational,
  divideRational,
  multiplyRational,
  rational,
  rationalKey,
  reduceRationalRatio,
  subtractRational,
} from "./rational";
import {
  malCp003RetainedFraction,
  powerRational,
} from "./cp003-solver";
import type { Rational } from "./types";

export const MAL_CP003_WAVE04_SOURCE_CANDIDATE_IDS = [
  "MAL-CP003-PROT-FINAL-ORIGINAL-TO-REFILL-RATIO-EQUAL-REPLACEMENTS",
  "MAL-CP003-PROT-VESSEL-VOLUME-FROM-FINAL-RATIO",
] as const;

export type MalCp003Wave04SourceCandidateId =
  (typeof MAL_CP003_WAVE04_SOURCE_CANDIDATE_IDS)[number];

export type MalCp003DisplayPolicy =
  | { kind: "EXACT_INTEGER_OR_TERMINATING_DECIMAL"; maximumDecimalPlaces: number }
  | { kind: "EXACT_FRACTION" }
  | { kind: "ROUND_TO_DP"; decimalPlaces: number };

export interface MalCp003SourceReference {
  sourceId: string;
  sourceTitle: string;
  editionOrArtifact: string;
  location: string;
  taskSummary: string;
  evidenceKind:
    | "UPLOADED_TEXTBOOK_DIRECT"
    | "INTERNAL_REVIEW_DIRECT"
    | "UPLOADED_TEXTBOOK_BOUNDARY";
  ownerVerdict: "MAL-CP-002" | "MAL-CP-003" | "MAL-CP-004";
  candidateId: MalCp003Wave04SourceCandidateId | null;
}

export const MAL_CP003_WAVE04_SOURCE_REFERENCES:
  readonly MalCp003SourceReference[] = [
    {
      sourceId: "RSA-QA-ALLIGATION-Q17",
      sourceTitle: "Quantitative Aptitude for Competitive Examinations",
      editionOrArtifact: "R.S. Aggarwal, revised and enlarged edition, 2017",
      location: "Alligation or Mixture, printed page 636, question 17",
      taskSummary:
        "A pure-liquid vessel undergoes the same remove-and-refill operation three times; find the final original-liquid quantity.",
      evidenceKind: "UPLOADED_TEXTBOOK_DIRECT",
      ownerVerdict: "MAL-CP-003",
      candidateId: null,
    },
    {
      sourceId: "RSA-QA-RATIO-Q242",
      sourceTitle: "Quantitative Aptitude for Competitive Examinations",
      editionOrArtifact: "R.S. Aggarwal, revised and enlarged edition, 2017",
      location: "Ratio and Proportion, printed page 453, question 242",
      taskSummary:
        "A pure-milk can undergoes equal repeated replacement; find the final water:milk ratio.",
      evidenceKind: "UPLOADED_TEXTBOOK_DIRECT",
      ownerVerdict: "MAL-CP-003",
      candidateId:
        "MAL-CP003-PROT-FINAL-ORIGINAL-TO-REFILL-RATIO-EQUAL-REPLACEMENTS",
    },
    {
      sourceId: "RSA-QA-RATIO-Q243",
      sourceTitle: "Quantitative Aptitude for Competitive Examinations",
      editionOrArtifact: "R.S. Aggarwal, revised and enlarged edition, 2017",
      location: "Ratio and Proportion, printed page 453, question 243",
      taskSummary:
        "A fixed quantity is removed and refilled four times; reconstruct the original cask capacity from the final original:new-liquid ratio.",
      evidenceKind: "UPLOADED_TEXTBOOK_DIRECT",
      ownerVerdict: "MAL-CP-003",
      candidateId: "MAL-CP003-PROT-VESSEL-VOLUME-FROM-FINAL-RATIO",
    },
    {
      sourceId: "RAP-CP017-QL1101",
      sourceTitle: "RAP-003 explanation-quality and human-review artifacts",
      editionOrArtifact: "ExamTree internal reviewed English runtime evidence",
      location: "RAP-CP-017 / RAP-QL-1101",
      taskSummary:
        "A pure-liquid vessel undergoes equal repeated replacement; find the final original:new-liquid ratio.",
      evidenceKind: "INTERNAL_REVIEW_DIRECT",
      ownerVerdict: "MAL-CP-003",
      candidateId:
        "MAL-CP003-PROT-FINAL-ORIGINAL-TO-REFILL-RATIO-EQUAL-REPLACEMENTS",
    },
    {
      sourceId: "RAP-CP017-QL1102",
      sourceTitle: "RAP-003 explanation-quality and human-review artifacts",
      editionOrArtifact: "ExamTree internal reviewed English runtime evidence",
      location: "RAP-CP-017 / RAP-QL-1102",
      taskSummary:
        "A pure-liquid vessel undergoes equal repeated replacement; find the final original-liquid quantity under an explicit two-decimal display instruction.",
      evidenceKind: "INTERNAL_REVIEW_DIRECT",
      ownerVerdict: "MAL-CP-003",
      candidateId: null,
    },
    {
      sourceId: "RSA-QA-ALLIGATION-Q19-Q20",
      sourceTitle: "Quantitative Aptitude for Competitive Examinations",
      editionOrArtifact: "R.S. Aggarwal, revised and enlarged edition, 2017",
      location: "Alligation or Mixture, printed page 636, questions 19 and 20",
      taskSummary:
        "A single homogeneous remove-and-refill operation changes a two-component ratio to a target ratio.",
      evidenceKind: "UPLOADED_TEXTBOOK_BOUNDARY",
      ownerVerdict: "MAL-CP-002",
      candidateId: null,
    },
    {
      sourceId: "RSA-QA-ALLIGATION-Q16",
      sourceTitle: "Quantitative Aptitude for Competitive Examinations",
      editionOrArtifact: "R.S. Aggarwal, revised and enlarged edition, 2017",
      location: "Alligation or Mixture, printed page 636, question 16",
      taskSummary:
        "Part of a solution is replaced by another solution with its own concentration; determine the replaced fraction from the final concentration.",
      evidenceKind: "UPLOADED_TEXTBOOK_BOUNDARY",
      ownerVerdict: "MAL-CP-004",
      candidateId: null,
    },
  ] as const;

export interface MalCp003FinalRatioResult {
  originalPart: Rational;
  refillPart: Rational;
  retainedFraction: Rational;
}

export interface MalCp003VesselVolumeFromRatioResult {
  vesselVolume: Rational;
  retainedFractionPerStage: Rational;
  finalOriginalFraction: Rational;
}

function bigintPower(base: bigint, exponent: number): bigint {
  let result = 1n;
  let factor = base;
  let remaining = exponent;
  while (remaining > 0) {
    if (remaining % 2 === 1) result *= factor;
    remaining = Math.floor(remaining / 2);
    if (remaining > 0) factor *= factor;
  }
  return result;
}

function exactIntegerNthRoot(value: bigint, exponent: number): bigint | null {
  if (value < 0n || !Number.isInteger(exponent) || exponent <= 0) return null;
  if (value === 0n || value === 1n) return value;
  let low = 0n;
  let high = 1n;
  while (bigintPower(high, exponent) < value) high *= 2n;
  while (low <= high) {
    const middle = (low + high) / 2n;
    const powered = bigintPower(middle, exponent);
    if (powered === value) return middle;
    if (powered < value) low = middle + 1n;
    else high = middle - 1n;
  }
  return null;
}

function exactRationalNthRoot(value: Rational, exponent: number): Rational | null {
  const numerator = exactIntegerNthRoot(value.numerator, exponent);
  const denominator = exactIntegerNthRoot(value.denominator, exponent);
  return numerator === null || denominator === null
    ? null
    : rational(numerator, denominator);
}

export function solveMalCp003FinalRatioSourceContract(input: {
  vesselVolume: Rational;
  removedQuantity: Rational;
  operations: number;
}): MalCp003FinalRatioResult {
  if (!Number.isInteger(input.operations) || input.operations <= 0) {
    throw new Error("Operations must be a positive integer.");
  }
  const retainedFraction = powerRational(
    malCp003RetainedFraction(input.vesselVolume, input.removedQuantity),
    input.operations,
  );
  const refillFraction = subtractRational(rational(1), retainedFraction);
  const [originalPart, refillPart] = reduceRationalRatio(
    retainedFraction,
    refillFraction,
  );
  return { originalPart, refillPart, retainedFraction };
}

export function solveMalCp003VesselVolumeFromFinalRatioSourceContract(input: {
  removedQuantity: Rational;
  operations: number;
  finalOriginalPart: Rational;
  finalRefillPart: Rational;
}): MalCp003VesselVolumeFromRatioResult {
  if (!Number.isInteger(input.operations) || input.operations <= 0) {
    throw new Error("Operations must be a positive integer.");
  }
  if (
    compareRational(input.finalOriginalPart, rational(0)) <= 0 ||
    compareRational(input.finalRefillPart, rational(0)) <= 0
  ) {
    throw new Error("Final ratio parts must be positive.");
  }
  const totalParts = addRational(
    input.finalOriginalPart,
    input.finalRefillPart,
  );
  const finalOriginalFraction = divideRational(
    input.finalOriginalPart,
    totalParts,
  );
  const retainedFractionPerStage = exactRationalNthRoot(
    finalOriginalFraction,
    input.operations,
  );
  if (
    retainedFractionPerStage === null ||
    compareRational(retainedFractionPerStage, rational(1)) >= 0
  ) {
    throw new Error(
      "The final ratio does not yield an exact repeated-replacement vessel capacity.",
    );
  }
  const removedFraction = subtractRational(
    rational(1),
    retainedFractionPerStage,
  );
  const vesselVolume = divideRational(input.removedQuantity, removedFraction);
  if (compareRational(vesselVolume, input.removedQuantity) <= 0) {
    throw new Error("Reconstructed vessel volume must exceed the removed quantity.");
  }
  return {
    vesselVolume,
    retainedFractionPerStage,
    finalOriginalFraction,
  };
}

function powerOfTen(exponent: number): bigint {
  if (!Number.isInteger(exponent) || exponent < 0) {
    throw new Error(`Decimal places must be a non-negative integer; received ${exponent}.`);
  }
  return 10n ** BigInt(exponent);
}

function exactTerminatingDecimal(
  value: Rational,
  maximumDecimalPlaces: number,
): string | null {
  let denominator = value.denominator;
  let twos = 0;
  let fives = 0;
  while (denominator % 2n === 0n) {
    denominator /= 2n;
    twos += 1;
  }
  while (denominator % 5n === 0n) {
    denominator /= 5n;
    fives += 1;
  }
  if (denominator !== 1n) return null;
  const decimalPlaces = Math.max(twos, fives);
  if (decimalPlaces > maximumDecimalPlaces) return null;
  const sign = value.numerator < 0n ? "-" : "";
  const absoluteNumerator =
    value.numerator < 0n ? -value.numerator : value.numerator;
  const scale = powerOfTen(decimalPlaces);
  const scaled = (absoluteNumerator * scale) / value.denominator;
  if (decimalPlaces === 0) return `${sign}${scaled}`;
  const digits = scaled.toString().padStart(decimalPlaces + 1, "0");
  const whole = digits.slice(0, -decimalPlaces);
  const fraction = digits.slice(-decimalPlaces).replace(/0+$/u, "");
  return fraction ? `${sign}${whole}.${fraction}` : `${sign}${whole}`;
}

function roundToDecimalPlaces(value: Rational, decimalPlaces: number): string {
  const sign = value.numerator < 0n ? "-" : "";
  const absoluteNumerator =
    value.numerator < 0n ? -value.numerator : value.numerator;
  const scale = powerOfTen(decimalPlaces);
  const scaledNumerator = absoluteNumerator * scale;
  let quotient = scaledNumerator / value.denominator;
  const remainder = scaledNumerator % value.denominator;
  if (remainder * 2n >= value.denominator) quotient += 1n;
  if (decimalPlaces === 0) return `${sign}${quotient}`;
  const digits = quotient.toString().padStart(decimalPlaces + 1, "0");
  return `${sign}${digits.slice(0, -decimalPlaces)}.${digits.slice(-decimalPlaces)}`;
}

export function formatMalCp003SourceValue(
  value: Rational,
  policy: MalCp003DisplayPolicy,
): string {
  switch (policy.kind) {
    case "EXACT_INTEGER_OR_TERMINATING_DECIMAL": {
      const decimal = exactTerminatingDecimal(
        value,
        policy.maximumDecimalPlaces,
      );
      return decimal ?? rationalKey(value);
    }
    case "EXACT_FRACTION":
      return rationalKey(value);
    case "ROUND_TO_DP":
      return roundToDecimalPlaces(value, policy.decimalPlaces);
  }
}

export function formatMalCp003SourceRatio(
  first: Rational,
  second: Rational,
): string {
  const [firstPart, secondPart] = reduceRationalRatio(first, second);
  return `${firstPart.numerator}:${secondPart.numerator}`;
}
