import {
  FRIENDLY_BASES,
  brokenPeriodAmount,
  deepFreeze,
  gcdForCp004,
  mixedFrequencyAmount,
  mul,
  periodMultiplierFromPeriodicRate,
  periodicRate,
  pick,
  pow,
  rat,
  type Cp004Frequency,
  type Cp004MathematicalState,
  type IntCp004QlId,
  type Rational,
} from "./cp004-frequency-math";
import { generateCp004State } from "./cp004-frequency-generation-v9-legacy";

export const INT_CP004_EXAM_FRIENDLY_STATE_V9_VERSION =
  "INT-CP-004-EXAM-FRIENDLY-STATE-v9" as const;

const COMPLETE_RATE_POOLS: Readonly<Record<Cp004Frequency, readonly Rational[]>> = Object.freeze({
  1: Object.freeze([rat(10), rat(20), rat(25)]),
  2: Object.freeze([rat(10), rat(20), rat(30)]),
  4: Object.freeze([rat(20), rat(40)]),
  12: Object.freeze([rat(24), rat(48)]),
});

const COMPLETE_PERIOD_POOLS: Readonly<Record<Cp004Frequency, readonly number[]>> = Object.freeze({
  1: Object.freeze([2, 3]),
  2: Object.freeze([2, 3]),
  4: Object.freeze([2, 3]),
  12: Object.freeze([2]),
});

const COMPARISON_PAIRS = Object.freeze([
  Object.freeze([1, 2] as const),
  Object.freeze([1, 4] as const),
  Object.freeze([2, 4] as const),
] as const);

const MIXED_PAIRS = Object.freeze([
  Object.freeze([1, 2] as const),
  Object.freeze([1, 4] as const),
  Object.freeze([2, 4] as const),
  Object.freeze([4, 2] as const),
] as const);

function lcm(left: bigint, right: bigint): bigint {
  return left / gcdForCp004(left, right) * right;
}

function principalForUnit(seed: string, label: string, unit: bigint): Rational {
  const positiveUnit = unit > 0n ? unit : 1n;
  const friendly = FRIENDLY_BASES.filter((value) => value % positiveUnit === 0n);
  if (friendly.length > 0) return rat(pick(friendly, seed, `${label}:friendly-principal`));

  const minimum = 1000n;
  const maximum = 500000n;
  let multiple = (minimum + positiveUnit - 1n) / positiveUnit;
  if (multiple < 1n) multiple = 1n;
  const candidates = [multiple, multiple + 1n, multiple + 2n, multiple + 3n]
    .map((value) => value * positiveUnit)
    .filter((value) => value >= minimum && value <= maximum);
  if (candidates.length === 0) {
    throw new Error(`${label}: exact integer result requires principal unit ${positiveUnit}, above v9 exam range.`);
  }
  return rat(pick(candidates, seed, `${label}:derived-principal`));
}

function amountMultiplier(
  annualRate: Rational,
  frequency: Cp004Frequency,
  periods: number,
): Rational {
  return pow(periodMultiplierFromPeriodicRate(periodicRate(annualRate, frequency)), periods);
}

function directMultiplier(rate: Rational, periods: number): Rational {
  return pow(periodMultiplierFromPeriodicRate(rate), periods);
}

function chooseCompleteRate(
  seed: string,
  qlId: IntCp004QlId,
  frequency: Cp004Frequency,
): Rational {
  return pick(COMPLETE_RATE_POOLS[frequency], seed, `${qlId}:v9-complete-rate`);
}

function chooseCompletePeriods(
  seed: string,
  qlId: IntCp004QlId,
  frequency: Cp004Frequency,
): number {
  return pick(COMPLETE_PERIOD_POOLS[frequency], seed, `${qlId}:v9-complete-periods`);
}

function completeState(
  qlId: IntCp004QlId,
  seed: string,
  base: Cp004MathematicalState,
): Cp004MathematicalState {
  const frequency = base.frequency;
  const nominalAnnualRatePercent = chooseCompleteRate(seed, qlId, frequency);
  const periods = chooseCompletePeriods(seed, qlId, frequency);
  const multiplier = amountMultiplier(nominalAnnualRatePercent, frequency, periods);
  const principal = principalForUnit(seed, qlId, multiplier.denominator);
  return deepFreeze({
    ...base,
    qlId,
    frequency,
    nominalAnnualRatePercent,
    periodicRatePercent: periodicRate(nominalAnnualRatePercent, frequency),
    periods,
    years: 1,
    principal,
  });
}

function directPeriodicState(
  qlId: "INT-QL-073" | "INT-QL-074",
  seed: string,
  base: Cp004MathematicalState,
): Cp004MathematicalState {
  const frequency = base.frequency;
  const periodicRatePercent = pick(
    frequency === 12 ? [rat(2), rat(4)] : [rat(5), rat(10), rat(20), rat(25)],
    seed,
    `${qlId}:v9-period-rate`,
  );
  const periods = chooseCompletePeriods(seed, qlId, frequency);
  const multiplier = directMultiplier(periodicRatePercent, periods);
  const principal = principalForUnit(seed, qlId, multiplier.denominator);
  return deepFreeze({
    ...base,
    qlId,
    frequency,
    periodicRatePercent,
    nominalAnnualRatePercent: mul(periodicRatePercent, rat(frequency)),
    periods,
    years: 1,
    principal,
  });
}

function comparisonState(
  seed: string,
  base: Cp004MathematicalState,
): Cp004MathematicalState {
  const [frequency, comparisonFrequency] = pick(COMPARISON_PAIRS, seed, "INT-QL-075:v9-pair");
  const nominalAnnualRatePercent = rat(20);
  const years = 1;
  const first = amountMultiplier(nominalAnnualRatePercent, frequency, frequency * years);
  const second = amountMultiplier(nominalAnnualRatePercent, comparisonFrequency, comparisonFrequency * years);
  const principal = principalForUnit(seed, "INT-QL-075", lcm(first.denominator, second.denominator));
  return deepFreeze({
    ...base,
    qlId: "INT-QL-075",
    frequency,
    comparisonFrequency,
    nominalAnnualRatePercent,
    periodicRatePercent: periodicRate(nominalAnnualRatePercent, frequency),
    years,
    periods: frequency * years,
    principal,
  });
}

function effectiveState(
  qlId: "INT-QL-076" | "INT-QL-077",
  base: Cp004MathematicalState,
): Cp004MathematicalState {
  const frequency: Cp004Frequency = 2;
  const nominalAnnualRatePercent = rat(20);
  return deepFreeze({
    ...base,
    qlId,
    frequency,
    nominalAnnualRatePercent,
    periodicRatePercent: periodicRate(nominalAnnualRatePercent, frequency),
    periods: 2,
    years: 1,
    principal: rat(1000),
  });
}

function frequencyIdentificationState(
  seed: string,
  base: Cp004MathematicalState,
): Cp004MathematicalState {
  const frequency = pick([1, 2, 4] as const, seed, "INT-QL-078:v9-frequency");
  const nominalAnnualRatePercent = frequency === 4 ? rat(40) : rat(20);
  const years = 1;
  const periods = frequency;
  const multiplier = amountMultiplier(nominalAnnualRatePercent, frequency, periods);
  const principal = principalForUnit(seed, "INT-QL-078", multiplier.denominator);
  return deepFreeze({
    ...base,
    qlId: "INT-QL-078",
    frequency,
    nominalAnnualRatePercent,
    periodicRatePercent: periodicRate(nominalAnnualRatePercent, frequency),
    years,
    periods,
    principal,
  });
}

function brokenState(
  qlId: "INT-QL-079" | "INT-QL-080" | "INT-QL-081" | "INT-QL-082" | "INT-QL-083",
  seed: string,
  base: Cp004MathematicalState,
): Cp004MathematicalState {
  const nominalAnnualRatePercent = pick([rat(10), rat(20), rat(25)], seed, `${qlId}:v9-rate`);
  const fullYears = pick([1, 2] as const, seed, `${qlId}:v9-full-years`);
  const tailMonths = pick([3, 6, 9] as const, seed, `${qlId}:v9-tail-months`);
  const multiplier = brokenPeriodAmount(rat(1), nominalAnnualRatePercent, fullYears, tailMonths);
  const principal = principalForUnit(seed, qlId, multiplier.denominator);
  return deepFreeze({
    ...base,
    qlId,
    frequency: 1,
    nominalAnnualRatePercent,
    periodicRatePercent: nominalAnnualRatePercent,
    periods: fullYears,
    years: fullYears,
    fullYears,
    tailMonths,
    principal,
  });
}

function mixedState(
  qlId: "INT-QL-084" | "INT-QL-085",
  seed: string,
  base: Cp004MathematicalState,
): Cp004MathematicalState {
  const [firstFrequency, secondFrequency] = pick(MIXED_PAIRS, seed, `${qlId}:v9-pair`);
  const nominalAnnualRatePercent = firstFrequency === 4 || secondFrequency === 4 ? rat(40) : rat(20);
  const firstYears = 1;
  const secondYears = 1;
  const multiplier = mixedFrequencyAmount(
    rat(1),
    nominalAnnualRatePercent,
    firstFrequency,
    firstYears,
    secondFrequency,
    secondYears,
  );
  const principal = principalForUnit(seed, qlId, multiplier.denominator);
  return deepFreeze({
    ...base,
    qlId,
    firstFrequency,
    secondFrequency,
    firstYears,
    secondYears,
    frequency: firstFrequency,
    comparisonFrequency: secondFrequency,
    nominalAnnualRatePercent,
    periodicRatePercent: periodicRate(nominalAnnualRatePercent, firstFrequency),
    periods: firstFrequency * firstYears,
    years: firstYears + secondYears,
    principal,
  });
}

export function generateIntCp004ExamFriendlyStateV9(
  qlId: IntCp004QlId,
  seed: string,
): Cp004MathematicalState {
  const base = generateCp004State(qlId, seed);
  switch (qlId) {
    case "INT-QL-067":
    case "INT-QL-068":
    case "INT-QL-069":
    case "INT-QL-070":
    case "INT-QL-071":
    case "INT-QL-072":
      return completeState(qlId, seed, base);
    case "INT-QL-073":
    case "INT-QL-074":
      return directPeriodicState(qlId, seed, base);
    case "INT-QL-075":
      return comparisonState(seed, base);
    case "INT-QL-076":
    case "INT-QL-077":
      return effectiveState(qlId, base);
    case "INT-QL-078":
      return frequencyIdentificationState(seed, base);
    case "INT-QL-079":
    case "INT-QL-080":
    case "INT-QL-081":
    case "INT-QL-082":
    case "INT-QL-083":
      return brokenState(qlId, seed, base);
    case "INT-QL-084":
    case "INT-QL-085":
      return mixedState(qlId, seed, base);
  }
}
