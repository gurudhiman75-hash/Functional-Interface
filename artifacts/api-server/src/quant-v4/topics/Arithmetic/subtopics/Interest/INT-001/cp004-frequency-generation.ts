import {
  FREQUENCIES, FRIENDLY_BASES, NOMINAL_RATE_POOLS, PERIODIC_RATES, TAIL_MONTHS, brokenPeriodAmount, deepFreeze,
  gcdForCp004, mixedFrequencyAmount, mul, periodMultiplierFromPeriodicRate, periodicRate, pick, pow, rat,
  type Cp004Frequency, type Cp004MathematicalState, type IntCp004QlId, type Rational,
} from "./cp004-frequency-math";

function requiredMultiplier(state: Omit<Cp004MathematicalState, "principal">): Rational {
  switch (state.qlId) {
    case "INT-QL-073":
    case "INT-QL-074": return pow(periodMultiplierFromPeriodicRate(state.periodicRatePercent), state.periods);
    case "INT-QL-075": {
      const first = pow(periodMultiplierFromPeriodicRate(periodicRate(state.nominalAnnualRatePercent, state.frequency)), state.frequency * state.years);
      const second = pow(periodMultiplierFromPeriodicRate(periodicRate(state.nominalAnnualRatePercent, state.comparisonFrequency)), state.comparisonFrequency * state.years);
      return mul(first, second);
    }
    case "INT-QL-079":
    case "INT-QL-080":
    case "INT-QL-081":
    case "INT-QL-082":
    case "INT-QL-083": return brokenPeriodAmount(rat(1), state.nominalAnnualRatePercent, state.fullYears, state.tailMonths);
    case "INT-QL-084":
    case "INT-QL-085": return mixedFrequencyAmount(rat(1), state.nominalAnnualRatePercent, state.firstFrequency, state.firstYears, state.secondFrequency, state.secondYears);
    default: return pow(periodMultiplierFromPeriodicRate(periodicRate(state.nominalAnnualRatePercent, state.frequency)), state.periods);
  }
}

function compatiblePrincipal(seed: string, state: Omit<Cp004MathematicalState, "principal">): Rational {
  const exactEvidenceQl = new Set<IntCp004QlId>([
    "INT-QL-069", "INT-QL-070", "INT-QL-071", "INT-QL-072",
    "INT-QL-081", "INT-QL-082", "INT-QL-083",
  ]);
  if (!exactEvidenceQl.has(state.qlId)) return rat(pick(FRIENDLY_BASES, seed, `${state.qlId}:principal`));
  const denominator = requiredMultiplier(state).denominator;
  const unit = denominator / gcdForCp004(denominator, 100n);
  if (unit > 100000n) throw new Error(`${state.qlId}: exact-paise construction requires an unrealistic principal unit ${unit}.`);
  const target = pick(FRIENDLY_BASES, seed, `${state.qlId}:principal-target`);
  const friendlyCandidates = FRIENDLY_BASES.filter((value) => value % unit === 0n);
  const multiple = target / unit > 0n ? target / unit : 1n;
  const fallbackCandidates = [multiple, multiple + 1n, multiple > 1n ? multiple - 1n : 1n]
    .map((item) => item * unit)
    .filter((item) => item >= 800n && item <= 100000n);
  const candidates = [...(friendlyCandidates.length > 0 ? friendlyCandidates : fallbackCandidates)];
  if (candidates.length === 0) throw new Error(`${state.qlId}: no realistic exact-paise principal candidate.`);
  candidates.sort((left, right) => {
    const leftDistance = left > target ? left - target : target - left;
    const rightDistance = right > target ? right - target : target - right;
    if (leftDistance !== rightDistance) return leftDistance < rightDistance ? -1 : 1;
    return left < right ? -1 : left > right ? 1 : 0;
  });
  return rat(candidates[0]!);
}

function periodsForFrequency(seed: string, frequency: Cp004Frequency): number {
  const pools: Readonly<Record<Cp004Frequency, readonly number[]>> = {
    1: [2, 3, 4],
    2: [2, 3, 4, 5, 6],
    4: [2, 3, 4, 6, 8],
    12: [3, 6, 9, 12, 18],
  };
  return pick(pools[frequency], seed, "periods");
}

function chooseFrequency(seed: string, qlId: IntCp004QlId): Cp004Frequency {
  if (["INT-QL-069", "INT-QL-070", "INT-QL-071", "INT-QL-072"].includes(qlId)) {
    return pick([2, 4] as const, seed, `${qlId}:frequency`);
  }
  if (qlId === "INT-QL-077") return pick([2, 4] as const, seed, `${qlId}:frequency`);
  if (["INT-QL-075", "INT-QL-076", "INT-QL-078"].includes(qlId)) {
    return pick([2, 4, 12] as const, seed, `${qlId}:frequency`);
  }
  if (["INT-QL-079", "INT-QL-080", "INT-QL-081", "INT-QL-082", "INT-QL-083"].includes(qlId)) return 1;
  return pick(FREQUENCIES, seed, `${qlId}:frequency`);
}

function inverseRatePool(frequency: Cp004Frequency): readonly Rational[] {
  if (frequency === 2) return Object.freeze([rat(8), rat(12), rat(16), rat(20), rat(24), rat(30)]);
  return Object.freeze([rat(8), rat(16), rat(20), rat(24), rat(32), rat(40)]);
}

function nominalRatePoolFor(
  qlId: IntCp004QlId,
  frequency: Cp004Frequency,
  firstFrequency: Cp004Frequency,
  secondFrequency: Cp004Frequency,
): readonly Rational[] {
  if (["INT-QL-069", "INT-QL-070", "INT-QL-071", "INT-QL-072"].includes(qlId)) return inverseRatePool(frequency);
  if (qlId === "INT-QL-077") return inverseRatePool(frequency);
  if (["INT-QL-081", "INT-QL-082", "INT-QL-083"].includes(qlId)) return Object.freeze([rat(10), rat(20), rat(25)]);
  if (["INT-QL-084", "INT-QL-085"].includes(qlId)) {
    return firstFrequency === 12 || secondFrequency === 12
      ? Object.freeze([rat(12), rat(24)])
      : Object.freeze([rat(8), rat(12), rat(16), rat(20), rat(24)]);
  }
  return NOMINAL_RATE_POOLS[frequency];
}

export function generateCp004State(qlId: IntCp004QlId, seed: string): Cp004MathematicalState {
  const frequency = chooseFrequency(seed, qlId);
  const firstFrequency = pick(FREQUENCIES, seed, `${qlId}:first-frequency`);
  const secondFrequency = pick(FREQUENCIES.filter((item) => item !== firstFrequency), seed, `${qlId}:second-frequency`);
  const nominalAnnualRatePercent = pick(
    nominalRatePoolFor(qlId, frequency, firstFrequency, secondFrequency),
    seed,
    `${qlId}:nominal-rate`,
  );
  const periodicRatePercent = pick(PERIODIC_RATES, seed, `${qlId}:periodic-rate`);
  const years = pick([1, 2, 3] as const, seed, `${qlId}:years`);
  const periods = qlId === "INT-QL-078"
    ? frequency * years
    : qlId === "INT-QL-071"
      ? pick(frequency === 2 ? [3, 4] as const : [2, 3] as const, seed, `${qlId}:inverse-rate-periods`)
      : ["INT-QL-069", "INT-QL-070", "INT-QL-072"].includes(qlId)
        ? pick(frequency === 2 ? [2, 3, 4] as const : [2, 4] as const, seed, `${qlId}:inverse-periods`)
        : periodsForFrequency(seed, frequency);
  const fullYears = ["INT-QL-081", "INT-QL-082", "INT-QL-083"].includes(qlId)
    ? pick([1, 2, 3] as const, seed, `${qlId}:full-years`)
    : pick([1, 2, 3, 4] as const, seed, `${qlId}:full-years`);
  const tailMonths = pick(TAIL_MONTHS, seed, `${qlId}:tail-months`);
  const comparisonFrequency = pick(FREQUENCIES.filter((item) => item !== frequency), seed, `${qlId}:comparison-frequency`);
  const firstYears = pick([1, 2] as const, seed, `${qlId}:first-years`);
  const secondYears = pick([1, 2] as const, seed, `${qlId}:second-years`);

  const withoutPrincipal: Omit<Cp004MathematicalState, "principal"> = {
    qlId,
    nominalAnnualRatePercent,
    periodicRatePercent,
    frequency,
    periods,
    comparisonFrequency,
    years,
    fullYears,
    tailMonths,
    firstFrequency,
    firstYears,
    secondFrequency,
    secondYears,
  };
  return deepFreeze({ ...withoutPrincipal, principal: compatiblePrincipal(seed, withoutPrincipal) });
}
