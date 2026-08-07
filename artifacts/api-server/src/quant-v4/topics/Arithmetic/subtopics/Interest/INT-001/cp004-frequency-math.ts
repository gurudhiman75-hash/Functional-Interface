export type Rational = Readonly<{ numerator: bigint; denominator: bigint }>;

const abs = (value: bigint): bigint => value < 0n ? -value : value;
export const gcdForCp004 = (left: bigint, right: bigint): bigint => {
  let a = abs(left);
  let b = abs(right);
  while (b !== 0n) [a, b] = [b, a % b];
  return a || 1n;
};

export function rat(numerator: bigint | number, denominator: bigint | number = 1n): Rational {
  let n = BigInt(numerator);
  let d = BigInt(denominator);
  if (d === 0n) throw new Error("Rational denominator cannot be zero.");
  if (d < 0n) { n = -n; d = -d; }
  const divisor = gcdForCp004(n, d);
  return Object.freeze({ numerator: n / divisor, denominator: d / divisor });
}
export const add = (a: Rational, b: Rational): Rational => rat(a.numerator * b.denominator + b.numerator * a.denominator, a.denominator * b.denominator);
export const sub = (a: Rational, b: Rational): Rational => rat(a.numerator * b.denominator - b.numerator * a.denominator, a.denominator * b.denominator);
export const mul = (a: Rational, b: Rational): Rational => rat(a.numerator * b.numerator, a.denominator * b.denominator);
export const div = (a: Rational, b: Rational): Rational => {
  if (b.numerator === 0n) throw new Error("Cannot divide by zero.");
  return rat(a.numerator * b.denominator, a.denominator * b.numerator);
};
export const eq = (a: Rational, b: Rational): boolean => a.numerator === b.numerator && a.denominator === b.denominator;
export const pow = (base: Rational, exponent: number): Rational => {
  if (!Number.isInteger(exponent) || exponent < 0) throw new Error(`Invalid exponent: ${exponent}`);
  return rat(base.numerator ** BigInt(exponent), base.denominator ** BigInt(exponent));
};
export const asInteger = (value: Rational): number => {
  if (value.denominator !== 1n) throw new Error(`Expected integer, received ${value.numerator}/${value.denominator}`);
  return Number(value.numerator);
};

export type IntCp004QlId =
  | "INT-QL-067" | "INT-QL-068" | "INT-QL-069" | "INT-QL-070" | "INT-QL-071"
  | "INT-QL-072" | "INT-QL-073" | "INT-QL-074" | "INT-QL-075" | "INT-QL-076"
  | "INT-QL-077" | "INT-QL-078" | "INT-QL-079" | "INT-QL-080" | "INT-QL-081"
  | "INT-QL-082" | "INT-QL-083" | "INT-QL-084" | "INT-QL-085";

export const INT_CP004_QL_IDS: readonly IntCp004QlId[] = Object.freeze([
  "INT-QL-067", "INT-QL-068", "INT-QL-069", "INT-QL-070", "INT-QL-071",
  "INT-QL-072", "INT-QL-073", "INT-QL-074", "INT-QL-075", "INT-QL-076",
  "INT-QL-077", "INT-QL-078", "INT-QL-079", "INT-QL-080", "INT-QL-081",
  "INT-QL-082", "INT-QL-083", "INT-QL-084", "INT-QL-085",
]);

export type Cp004Frequency = 1 | 2 | 4 | 12;
export type Cp004AnswerSemantic = "MONEY" | "RATE_PERCENT" | "DURATION" | "FREQUENCY";
export type Cp004Difficulty = "Easy" | "Medium" | "Hard";
export type Cp004Representation = "STANDARD_PROSE" | "TERMS_TABLE" | "BALANCE_RECORD" | "SCHEME_COMPARISON";

export interface Cp004RegistryEntry {
  readonly qlId: IntCp004QlId;
  readonly solveContract: string;
  readonly answerSemantic: Cp004AnswerSemantic;
  readonly difficulty: Cp004Difficulty;
  readonly domain: "COMPLETE_PERIODS" | "FREQUENCY_COMPARISON" | "EFFECTIVE_RATE" | "BROKEN_PERIOD" | "MIXED_FREQUENCY";
}

export const INT_CP004_REGISTRY: readonly Cp004RegistryEntry[] = Object.freeze([
  { qlId: "INT-QL-067", solveContract: "Find amount from nominal annual rate, frequency and complete periods", answerSemantic: "MONEY", difficulty: "Easy", domain: "COMPLETE_PERIODS" },
  { qlId: "INT-QL-068", solveContract: "Find compound interest from nominal annual rate, frequency and complete periods", answerSemantic: "MONEY", difficulty: "Easy", domain: "COMPLETE_PERIODS" },
  { qlId: "INT-QL-069", solveContract: "Find principal from final amount under stated compounding frequency", answerSemantic: "MONEY", difficulty: "Medium", domain: "COMPLETE_PERIODS" },
  { qlId: "INT-QL-070", solveContract: "Find principal from compound interest under stated compounding frequency", answerSemantic: "MONEY", difficulty: "Medium", domain: "COMPLETE_PERIODS" },
  { qlId: "INT-QL-071", solveContract: "Find nominal annual rate from final amount and frequency", answerSemantic: "RATE_PERCENT", difficulty: "Hard", domain: "COMPLETE_PERIODS" },
  { qlId: "INT-QL-072", solveContract: "Find duration from amount under stated compounding frequency", answerSemantic: "DURATION", difficulty: "Medium", domain: "COMPLETE_PERIODS" },
  { qlId: "INT-QL-073", solveContract: "Find amount when the rate for each compounding period is stated directly", answerSemantic: "MONEY", difficulty: "Easy", domain: "COMPLETE_PERIODS" },
  { qlId: "INT-QL-074", solveContract: "Find compound interest when the rate for each compounding period is stated directly", answerSemantic: "MONEY", difficulty: "Easy", domain: "COMPLETE_PERIODS" },
  { qlId: "INT-QL-075", solveContract: "Find the excess amount caused by more frequent compounding", answerSemantic: "MONEY", difficulty: "Medium", domain: "FREQUENCY_COMPARISON" },
  { qlId: "INT-QL-076", solveContract: "Find the effective annual rate", answerSemantic: "RATE_PERCENT", difficulty: "Medium", domain: "EFFECTIVE_RATE" },
  { qlId: "INT-QL-077", solveContract: "Find the nominal annual rate from the effective annual rate", answerSemantic: "RATE_PERCENT", difficulty: "Hard", domain: "EFFECTIVE_RATE" },
  { qlId: "INT-QL-078", solveContract: "Identify the compounding frequency from amount evidence", answerSemantic: "FREQUENCY", difficulty: "Hard", domain: "FREQUENCY_COMPARISON" },
  { qlId: "INT-QL-079", solveContract: "Find amount after whole years plus an explicitly simple fractional-year tail", answerSemantic: "MONEY", difficulty: "Medium", domain: "BROKEN_PERIOD" },
  { qlId: "INT-QL-080", solveContract: "Find compound interest after whole years plus an explicitly simple fractional-year tail", answerSemantic: "MONEY", difficulty: "Medium", domain: "BROKEN_PERIOD" },
  { qlId: "INT-QL-081", solveContract: "Find principal from a broken-period amount", answerSemantic: "MONEY", difficulty: "Hard", domain: "BROKEN_PERIOD" },
  { qlId: "INT-QL-082", solveContract: "Find annual rate from a broken-period amount", answerSemantic: "RATE_PERCENT", difficulty: "Hard", domain: "BROKEN_PERIOD" },
  { qlId: "INT-QL-083", solveContract: "Find the number of complete years when the simple tail is stated", answerSemantic: "DURATION", difficulty: "Hard", domain: "BROKEN_PERIOD" },
  { qlId: "INT-QL-084", solveContract: "Find amount when compounding frequency changes between successive intervals", answerSemantic: "MONEY", difficulty: "Hard", domain: "MIXED_FREQUENCY" },
  { qlId: "INT-QL-085", solveContract: "Find compound interest when compounding frequency changes between successive intervals", answerSemantic: "MONEY", difficulty: "Hard", domain: "MIXED_FREQUENCY" },
]);

export interface Cp004MathematicalState {
  readonly qlId: IntCp004QlId;
  readonly principal: Rational;
  readonly nominalAnnualRatePercent: Rational;
  readonly periodicRatePercent: Rational;
  readonly frequency: Cp004Frequency;
  readonly periods: number;
  readonly comparisonFrequency: Cp004Frequency;
  readonly years: number;
  readonly fullYears: number;
  readonly tailMonths: 3 | 6 | 9;
  readonly firstFrequency: Cp004Frequency;
  readonly firstYears: number;
  readonly secondFrequency: Cp004Frequency;
  readonly secondYears: number;
}

export interface Cp004Option {
  readonly id: "A" | "B" | "C" | "D";
  readonly value: Rational;
  readonly text: string;
  readonly isCorrect: boolean;
  readonly misconceptionId: string;
  readonly feedback: string;
}

export interface Cp004Explanation {
  readonly whatAsked: string;
  readonly steps: readonly string[];
  readonly finalAnswer: string;
  readonly commonMistake: string;
}

export interface IntCp004Question {
  readonly packageId: "INT-001";
  readonly canonicalProblemId: "INT-CP-004";
  readonly permanentQlId: IntCp004QlId;
  readonly qlId: IntCp004QlId;
  readonly solveContract: string;
  readonly answerSemantic: Cp004AnswerSemantic;
  readonly difficulty: Cp004Difficulty;
  readonly seed: string;
  readonly mathematicalState: Cp004MathematicalState;
  readonly representation: Cp004Representation;
  readonly stemFamilyId: string;
  readonly stem: string;
  readonly options: readonly Cp004Option[];
  readonly correctIndex: number;
  readonly correctAnswer: string;
  readonly solution: Rational;
  readonly explanation: Cp004Explanation;
  readonly authorityVersion: "INT-CP-004-MATH-AUTHORITY-v1";
  readonly generatorVersion: "INT-CP-004-EXAM-GENERATOR-v1";
  readonly solverVersion: "INT-CP-004-CANONICAL-SOLVER-v1";
  readonly verifierVersion: "INT-CP-004-RELATION-VERIFIER-v1";
  readonly editorialStatus: "ENGLISH_REVIEW_CANDIDATE";
  readonly approvalStatus: "NOT_APPROVED";
  readonly enabled: false;
  readonly stagingStatus: "NOT_STAGED";
  readonly registrationStatus: "NOT_REGISTERED";
  readonly questionStudioDiscoverable: false;
  readonly questionBankStatus: "NOT_STORED";
  readonly testEligibility: "INELIGIBLE";
  readonly publiclyPublishable: false;
}

export const FREQUENCIES: readonly Cp004Frequency[] = Object.freeze([1, 2, 4, 12]);
export const TAIL_MONTHS: readonly (3 | 6 | 9)[] = Object.freeze([3, 6, 9]);
export const FRIENDLY_BASES = Object.freeze([800n, 1000n, 1200n, 1500n, 2000n, 2500n, 3200n, 4000n, 5000n, 6250n, 8000n, 10000n, 12000n, 12500n, 16000n, 20000n, 25000n, 32000n, 40000n, 50000n, 62500n, 80000n, 100000n]);
export const PERIODIC_RATES = Object.freeze([rat(1), rat(2), rat(5, 2), rat(3), rat(4), rat(5)]);
export const NOMINAL_RATE_POOLS: Readonly<Record<Cp004Frequency, readonly Rational[]>> = Object.freeze({
  1: Object.freeze([rat(5), rat(8), rat(10), rat(25, 2), rat(15), rat(20), rat(25)]),
  2: Object.freeze([rat(4), rat(6), rat(8), rat(10), rat(12), rat(16), rat(20), rat(24), rat(30)]),
  4: Object.freeze([rat(4), rat(8), rat(12), rat(16), rat(20), rat(24), rat(32), rat(40)]),
  12: Object.freeze([rat(12), rat(24), rat(36), rat(48)]),
});

export function hash(source: string): number {
  let state = 2166136261;
  for (const character of source) {
    state ^= character.charCodeAt(0);
    state = Math.imul(state, 16777619);
  }
  return state >>> 0;
}
export function pick<T>(values: readonly T[], seed: string, label: string): T {
  if (values.length === 0) throw new Error(`Cannot pick ${label} from an empty list.`);
  return values[hash(`${seed}:${label}`) % values.length]!;
}
export function deepFreeze<T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    for (const nested of Object.values(value as Record<string, unknown>)) deepFreeze(nested);
    Object.freeze(value);
  }
  return value;
}

export function periodicRate(nominalAnnualRatePercent: Rational, frequency: Cp004Frequency): Rational {
  return div(nominalAnnualRatePercent, rat(frequency));
}
export function periodMultiplierFromPeriodicRate(periodicRatePercent: Rational): Rational {
  return add(rat(1), div(periodicRatePercent, rat(100)));
}
export function completeAmountFromNominal(principal: Rational, nominalAnnualRatePercent: Rational, frequency: Cp004Frequency, periods: number): Rational {
  return mul(principal, pow(periodMultiplierFromPeriodicRate(periodicRate(nominalAnnualRatePercent, frequency)), periods));
}
export function completeAmountFromPeriodic(principal: Rational, periodicRatePercent: Rational, periods: number): Rational {
  return mul(principal, pow(periodMultiplierFromPeriodicRate(periodicRatePercent), periods));
}
export function effectiveAnnualRate(nominalAnnualRatePercent: Rational, frequency: Cp004Frequency): Rational {
  const oneYearAmount = pow(periodMultiplierFromPeriodicRate(periodicRate(nominalAnnualRatePercent, frequency)), frequency);
  return mul(sub(oneYearAmount, rat(1)), rat(100));
}
export function brokenPeriodAmount(principal: Rational, annualRatePercent: Rational, fullYears: number, tailMonths: number): Rational {
  const afterWholeYears = mul(principal, pow(add(rat(1), div(annualRatePercent, rat(100))), fullYears));
  const simpleTail = add(rat(1), mul(div(annualRatePercent, rat(100)), rat(tailMonths, 12)));
  return mul(afterWholeYears, simpleTail);
}
export function mixedFrequencyAmount(
  principal: Rational,
  nominalAnnualRatePercent: Rational,
  firstFrequency: Cp004Frequency,
  firstYears: number,
  secondFrequency: Cp004Frequency,
  secondYears: number,
): Rational {
  const first = pow(periodMultiplierFromPeriodicRate(periodicRate(nominalAnnualRatePercent, firstFrequency)), firstFrequency * firstYears);
  const second = pow(periodMultiplierFromPeriodicRate(periodicRate(nominalAnnualRatePercent, secondFrequency)), secondFrequency * secondYears);
  return mul(principal, mul(first, second));
}

export function registryEntry(qlId: IntCp004QlId): Cp004RegistryEntry {
  const entry = INT_CP004_REGISTRY.find((candidate) => candidate.qlId === qlId);
  if (!entry) throw new Error(`${qlId}: missing CP-004 registry entry.`);
  return entry;
}

export function completeAmountForState(state: Cp004MathematicalState): Rational {
  return completeAmountFromNominal(state.principal, state.nominalAnnualRatePercent, state.frequency, state.periods);
}
export function periodicAmountForState(state: Cp004MathematicalState): Rational {
  return completeAmountFromPeriodic(state.principal, state.periodicRatePercent, state.periods);
}
export function brokenAmountForState(state: Cp004MathematicalState): Rational {
  return brokenPeriodAmount(state.principal, state.nominalAnnualRatePercent, state.fullYears, state.tailMonths);
}
export function mixedAmountForState(state: Cp004MathematicalState): Rational {
  return mixedFrequencyAmount(state.principal, state.nominalAnnualRatePercent, state.firstFrequency, state.firstYears, state.secondFrequency, state.secondYears);
}

export function canonicalCp004Answer(state: Cp004MathematicalState): Rational {
  switch (state.qlId) {
    case "INT-QL-067": return completeAmountForState(state);
    case "INT-QL-068": return sub(completeAmountForState(state), state.principal);
    case "INT-QL-069":
    case "INT-QL-070": return state.principal;
    case "INT-QL-071": return state.nominalAnnualRatePercent;
    case "INT-QL-072": return rat(state.periods);
    case "INT-QL-073": return periodicAmountForState(state);
    case "INT-QL-074": return sub(periodicAmountForState(state), state.principal);
    case "INT-QL-075": {
      const first = completeAmountFromNominal(state.principal, state.nominalAnnualRatePercent, state.frequency, state.frequency * state.years);
      const second = completeAmountFromNominal(state.principal, state.nominalAnnualRatePercent, state.comparisonFrequency, state.comparisonFrequency * state.years);
      return absRational(sub(first, second));
    }
    case "INT-QL-076":
    case "INT-QL-077": return state.qlId === "INT-QL-076" ? effectiveAnnualRate(state.nominalAnnualRatePercent, state.frequency) : state.nominalAnnualRatePercent;
    case "INT-QL-078": return rat(state.frequency);
    case "INT-QL-079": return brokenAmountForState(state);
    case "INT-QL-080": return sub(brokenAmountForState(state), state.principal);
    case "INT-QL-081": return state.principal;
    case "INT-QL-082": return state.nominalAnnualRatePercent;
    case "INT-QL-083": return rat(state.fullYears);
    case "INT-QL-084": return mixedAmountForState(state);
    case "INT-QL-085": return sub(mixedAmountForState(state), state.principal);
  }
}
export function absRational(value: Rational): Rational { return rat(abs(value.numerator), value.denominator); }

export function verifyCp004Answer(state: Cp004MathematicalState, candidate: Rational): boolean {
  switch (state.qlId) {
    case "INT-QL-067": return eq(candidate, completeAmountForState(state));
    case "INT-QL-068": return eq(add(candidate, state.principal), completeAmountForState(state));
    case "INT-QL-069": {
      const observed = completeAmountForState(state);
      return eq(completeAmountFromNominal(candidate, state.nominalAnnualRatePercent, state.frequency, state.periods), observed);
    }
    case "INT-QL-070": {
      const observedInterest = sub(completeAmountForState(state), state.principal);
      return eq(sub(completeAmountFromNominal(candidate, state.nominalAnnualRatePercent, state.frequency, state.periods), candidate), observedInterest);
    }
    case "INT-QL-071": {
      const observed = completeAmountForState(state);
      return eq(completeAmountFromNominal(state.principal, candidate, state.frequency, state.periods), observed)
        && uniqueNominalRate(candidate, (rate) => eq(completeAmountFromNominal(state.principal, rate, state.frequency, state.periods), observed), state.frequency);
    }
    case "INT-QL-072": {
      if (candidate.denominator !== 1n) return false;
      const periods = Number(candidate.numerator);
      return periods >= 1 && periods <= 24
        && eq(completeAmountFromNominal(state.principal, state.nominalAnnualRatePercent, state.frequency, periods), completeAmountForState(state));
    }
    case "INT-QL-073": return eq(candidate, periodicAmountForState(state));
    case "INT-QL-074": return eq(add(candidate, state.principal), periodicAmountForState(state));
    case "INT-QL-075": return eq(candidate, canonicalCp004Answer(state));
    case "INT-QL-076": return eq(candidate, effectiveAnnualRate(state.nominalAnnualRatePercent, state.frequency));
    case "INT-QL-077": {
      const observed = effectiveAnnualRate(state.nominalAnnualRatePercent, state.frequency);
      return eq(effectiveAnnualRate(candidate, state.frequency), observed)
        && uniqueNominalRate(candidate, (rate) => eq(effectiveAnnualRate(rate, state.frequency), observed), state.frequency);
    }
    case "INT-QL-078": {
      if (candidate.denominator !== 1n) return false;
      const frequency = Number(candidate.numerator) as Cp004Frequency;
      const observed = completeAmountForState(state);
      return FREQUENCIES.includes(frequency)
        && eq(completeAmountFromNominal(state.principal, state.nominalAnnualRatePercent, frequency, frequency * state.years), observed)
        && FREQUENCIES.filter((item) => eq(completeAmountFromNominal(state.principal, state.nominalAnnualRatePercent, item, item * state.years), observed)).length === 1;
    }
    case "INT-QL-079": return eq(candidate, brokenAmountForState(state));
    case "INT-QL-080": return eq(add(candidate, state.principal), brokenAmountForState(state));
    case "INT-QL-081": return eq(brokenPeriodAmount(candidate, state.nominalAnnualRatePercent, state.fullYears, state.tailMonths), brokenAmountForState(state));
    case "INT-QL-082": {
      const observed = brokenAmountForState(state);
      return eq(brokenPeriodAmount(state.principal, candidate, state.fullYears, state.tailMonths), observed)
        && uniqueBrokenRate(candidate, state, observed);
    }
    case "INT-QL-083": {
      if (candidate.denominator !== 1n) return false;
      const years = Number(candidate.numerator);
      return years >= 1 && years <= 5
        && eq(brokenPeriodAmount(state.principal, state.nominalAnnualRatePercent, years, state.tailMonths), brokenAmountForState(state));
    }
    case "INT-QL-084": return eq(candidate, mixedAmountForState(state));
    case "INT-QL-085": return eq(add(candidate, state.principal), mixedAmountForState(state));
  }
}

function uniqueNominalRate(candidate: Rational, predicate: (rate: Rational) => boolean, frequency: Cp004Frequency): boolean {
  const matches = NOMINAL_RATE_POOLS[frequency].filter(predicate);
  return matches.length === 1 && eq(matches[0]!, candidate);
}
function uniqueBrokenRate(candidate: Rational, state: Cp004MathematicalState, observed: Rational): boolean {
  const pool = NOMINAL_RATE_POOLS[1];
  const matches = pool.filter((rate) => eq(brokenPeriodAmount(state.principal, rate, state.fullYears, state.tailMonths), observed));
  return matches.length === 1 && eq(matches[0]!, candidate);
}
