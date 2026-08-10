import { multiply, rational, type Rational } from "../foundation/rational";
import { convertSpeed } from "../foundation/units";
import type { TsdCp001Solution, TsdCp001SolveInput } from "./canonical-solver";
import type { TsdCp001DiscoveryAuthority } from "./discovery-registry";
import type { DisplayContract, TsdCp001OptionAudit } from "./runtime-types";
import {
  SPEED_LABEL,
  authorityOrdinal,
  formatExamNumber,
  trailingSeedOrdinal,
} from "./runtime-support";

export const EQUIVALENT_SPEED_FINGERPRINT = "representation:EQUIVALENT_SPEED_SET";
export const SCALAR_SPEED_FINGERPRINT = "representation:SCALAR_SPEED_CONVERSION";

interface OptionSet {
  readonly options: readonly string[];
  readonly optionAudit: readonly TsdCp001OptionAudit[];
  readonly correctIndex: number;
}

export interface EquivalentSpeedRepresentation {
  readonly representationKind: "EQUIVALENT_SPEED_SET";
  readonly stem: string;
  readonly display: DisplayContract;
  readonly answerText: string;
  readonly optionSet: OptionSet;
  readonly working: readonly string[];
  readonly fingerprintSuffix: typeof EQUIVALENT_SPEED_FINGERPRINT;
}

type ConversionInput = Extract<TsdCp001SolveInput, { solveMode: "convertSpeedUnit" }>;
type SpeedSolution = Extract<TsdCp001Solution, { answerKind: "SPEED" }>;

const CURATED_EQUIVALENT_INPUTS: readonly ConversionInput[] = [
  { solveMode: "convertSpeedUnit", value: rational(90), from: "KMPH", to: "MPS" },
  { solveMode: "convertSpeedUnit", value: rational(54), from: "KMPH", to: "MPS" },
  { solveMode: "convertSpeedUnit", value: rational(72), from: "KMPH", to: "M_PER_MINUTE" },
];

export function prepareEquivalentSpeedInput(
  seed: string,
  input: TsdCp001SolveInput,
): TsdCp001SolveInput {
  if (input.solveMode !== "convertSpeedUnit") return input;
  const ordinal = trailingSeedOrdinal(seed);
  if (ordinal % 3 !== 2) return input;
  return CURATED_EQUIVALENT_INPUTS[Math.floor(ordinal / 3) % CURATED_EQUIVALENT_INPUTS.length];
}

function integer(value: Rational): boolean {
  return value.denominator === 1n;
}

function speedTriplet(mps: Rational, kmph: Rational, metresPerMinute: Rational): string {
  return `${formatExamNumber(mps)} m/s = ${formatExamNumber(kmph)} km/h = ${formatExamNumber(metresPerMinute)} m/min`;
}

function sourceToMpsWorking(input: ConversionInput, metresPerSecond: Rational): string {
  const source = `${formatExamNumber(input.value)} ${SPEED_LABEL[input.from]}`;
  switch (input.from) {
    case "MPS":
      return `${source} is already written in m/s.`;
    case "KMPH":
      return `${source} × 5/18 = ${formatExamNumber(metresPerSecond)} m/s`;
    case "M_PER_MINUTE":
      return `${source} ÷ 60 = ${formatExamNumber(metresPerSecond)} m/s`;
    case "KM_PER_MINUTE":
      return `${source} × 1000 ÷ 60 = ${formatExamNumber(metresPerSecond)} m/s`;
  }
}

function optionSet(
  authority: TsdCp001DiscoveryAuthority,
  seed: string,
  correctText: string,
  wrong: readonly TsdCp001OptionAudit[],
): OptionSet {
  const correct: TsdCp001OptionAudit = {
    text: correctText,
    misconceptionId: "CORRECT",
    isCorrect: true,
  };
  const correctIndex = (trailingSeedOrdinal(seed) + authorityOrdinal(authority)) % 4;
  const optionAudit: TsdCp001OptionAudit[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    optionAudit.push(index === correctIndex ? correct : wrong[wrongIndex++]);
  }
  return {
    options: optionAudit.map((option) => option.text),
    optionAudit,
    correctIndex,
  };
}

export function buildEquivalentSpeedRepresentation(
  authority: TsdCp001DiscoveryAuthority,
  seed: string,
  input: TsdCp001SolveInput,
  solution: TsdCp001Solution,
): EquivalentSpeedRepresentation | null {
  if (input.solveMode !== "convertSpeedUnit" || solution.answerKind !== "SPEED") return null;

  // Exactly one of every three deterministic seeds uses this answer representation.
  // The input preparation step supplies deliberate exact triplets for these seeds.
  if (trailingSeedOrdinal(seed) % 3 !== 2) return null;

  const metresPerSecond = convertSpeed(input.value, input.from, "MPS");
  const kilometresPerHour = convertSpeed(metresPerSecond, "MPS", "KMPH");
  const metresPerMinute = convertSpeed(metresPerSecond, "MPS", "M_PER_MINUTE");

  if (![metresPerSecond, kilometresPerHour, metresPerMinute].every(integer)) {
    throw new Error("Curated equivalent-speed state produced a non-integral triplet");
  }

  const correctText = speedTriplet(metresPerSecond, kilometresPerHour, metresPerMinute);
  const wrongFactorKmph = multiply(metresPerSecond, rational(5));
  const mixedUnitMinutes = multiply(kilometresPerHour, rational(60));
  const copiedNumber = speedTriplet(metresPerSecond, metresPerSecond, metresPerSecond);
  const wrong: readonly TsdCp001OptionAudit[] = [
    {
      text: speedTriplet(metresPerSecond, wrongFactorKmph, metresPerMinute),
      misconceptionId: "USE_WRONG_CONVERSION_FACTOR",
      isCorrect: false,
    },
    {
      text: speedTriplet(metresPerSecond, kilometresPerHour, mixedUnitMinutes),
      misconceptionId: "MIX_UNCONVERTED_UNITS",
      isCorrect: false,
    },
    {
      text: copiedNumber,
      misconceptionId: "OMIT_UNIT_CONVERSION",
      isCorrect: false,
    },
  ];
  const source = `${formatExamNumber(input.value)} ${SPEED_LABEL[input.from]}`;

  return {
    representationKind: "EQUIVALENT_SPEED_SET",
    stem: `Which option correctly represents ${source} in m/s, km/h and m/min?`,
    display: {
      formula: "1 m/s = 18/5 km/h = 60 m/min",
      givens: [`Given speed = ${source}`],
      shortcut: "Convert the speed to m/s once, then multiply by 18/5 for km/h and by 60 for m/min.",
    },
    answerText: correctText,
    optionSet: optionSet(authority, seed, correctText, wrong),
    working: [
      `Given speed = ${source}`,
      sourceToMpsWorking(input, metresPerSecond),
      `${formatExamNumber(metresPerSecond)} m/s × 18/5 = ${formatExamNumber(kilometresPerHour)} km/h`,
      `${formatExamNumber(metresPerSecond)} m/s × 60 = ${formatExamNumber(metresPerMinute)} m/min`,
      `Therefore, ${correctText}`,
    ],
    fingerprintSuffix: EQUIVALENT_SPEED_FINGERPRINT,
  };
}

export function isEquivalentSpeedFingerprint(fingerprint: string): boolean {
  return fingerprint.includes(EQUIVALENT_SPEED_FINGERPRINT);
}
