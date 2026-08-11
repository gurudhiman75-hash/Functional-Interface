import {
  amount,
  amountByRecurrence,
  canonicalAnswer,
  factor,
  hash,
  pick,
  rat,
  sub,
  verifyByRelation,
  yearlyInterest,
  type Cp003MathematicalState,
  type IntCp003QlId,
  type Rational,
} from "./cp003-math-authority";

export {
  INT_CP003_AUTHORITY_VERSION,
  INT_CP003_EXACT_RATE_DEFINITIONS,
  INT_CP003_EXACT_RATE_VALUES,
  INT_CP003_FINAL_REGISTRY,
  INT_CP003_LEGACY_FAMILIES,
  INT_CP003_QL_IDS,
  INT_CP003_SOLVER_VERSION,
  INT_CP003_VERIFIER_VERSION,
  add,
  amount,
  amountByRecurrence,
  canonicalAnswer,
  div,
  eq,
  factor,
  getIntCp003RegistryEntry,
  hash,
  integer,
  mathematicalFingerprint,
  mul,
  pick,
  pow,
  rat,
  sub,
  verifyByRelation,
  yearlyInterest,
  type Cp003AnswerSemantic,
  type Cp003MathematicalState,
  type Cp003RegistryEntry,
  type Cp003Semantic,
  type Cp003SolveContract,
  type IntCp003LegacyFamily,
  type IntCp003QlId,
  type Rational,
} from "./cp003-math-authority";

export type Cp003Difficulty = "Easy" | "Medium" | "Hard";
export type Cp003Representation = "NARRATIVE" | "TABLE" | "BALANCE_LEDGER" | "GROWTH_FACTOR_CARD";

export interface AnnualState {
  readonly principal: Rational;
  readonly ratePercent: Rational;
  readonly years: number;
  readonly specifiedYear: number;
  readonly earlierYear: number;
  readonly laterYear: number;
  readonly observationYear: number;
  readonly representation: Cp003Representation;
  readonly useGrowthFactorEvidence: boolean;
}

const LEGACY_RATE_VALUES = [10, 20, 25, 50] as const;
const LEGACY_REPRESENTATIONS: readonly Cp003Representation[] = [
  "NARRATIVE",
  "TABLE",
  "BALANCE_LEDGER",
  "GROWTH_FACTOR_CARD",
];

export function stateFor(qlId: IntCp003QlId, seed: string): AnnualState {
  const rate = pick(LEGACY_RATE_VALUES, seed, `${qlId}:r`);
  const annualFactor = factor(rat(rate));
  const base = BigInt(1 + hash(`${seed}:${qlId}:p`) % 7);
  const earlierYear = 1 + hash(`${seed}:${qlId}:e`) % 2;
  return Object.freeze({
    principal: rat(10n * (annualFactor.denominator ** 4n) * base),
    ratePercent: rat(rate),
    years: 2 + hash(`${seed}:${qlId}:n`) % 3,
    specifiedYear: 2 + hash(`${seed}:${qlId}:k`) % 3,
    earlierYear,
    laterYear: earlierYear + 1 + hash(`${seed}:${qlId}:l`) % 2,
    observationYear: 1 + hash(`${seed}:${qlId}:o`) % 3,
    representation: pick(LEGACY_REPRESENTATIONS, seed, `${qlId}:rep`),
    useGrowthFactorEvidence: hash(`${seed}:${qlId}:gf`) % 2 === 0,
  });
}

export const amountLoop = amountByRecurrence;
export const yearInterest = yearlyInterest;

function mathematicalStateFor(qlId: IntCp003QlId, state: AnnualState): Cp003MathematicalState {
  const maturityAmount = amount(state.principal, state.ratePercent, state.years);
  const specifiedYearInterest = yearlyInterest(state.principal, state.ratePercent, state.specifiedYear);
  const observedAmount = amount(state.principal, state.ratePercent, state.observationYear);
  const nextObservedAmount = amount(state.principal, state.ratePercent, state.observationYear + 1);
  const earlierYearInterest = yearlyInterest(state.principal, state.ratePercent, state.earlierYear);

  switch (qlId) {
    case "INT-QL-053":
      return Object.freeze({ qlId, principal: state.principal, ratePercent: state.ratePercent, years: state.years });
    case "INT-QL-054":
      return Object.freeze({ qlId, principal: state.principal, ratePercent: state.ratePercent, years: state.years });
    case "INT-QL-055":
      return Object.freeze({ qlId, amount: maturityAmount, ratePercent: state.ratePercent, years: state.years });
    case "INT-QL-056":
      return Object.freeze({ qlId, compoundInterest: sub(maturityAmount, state.principal), ratePercent: state.ratePercent, years: state.years });
    case "INT-QL-057":
      return Object.freeze({ qlId, principal: state.principal, amount: maturityAmount, years: state.years });
    case "INT-QL-058":
      return Object.freeze({ qlId, principal: state.principal, amount: maturityAmount, ratePercent: state.ratePercent });
    case "INT-QL-059":
      return Object.freeze({ qlId, principal: state.principal, ratePercent: state.ratePercent, targetYear: state.specifiedYear });
    case "INT-QL-060":
      return Object.freeze({ qlId, nthYearInterest: specifiedYearInterest, ratePercent: state.ratePercent, targetYear: state.specifiedYear });
    case "INT-QL-061":
      return Object.freeze({ qlId, principal: state.principal, nthYearInterest: specifiedYearInterest, targetYear: state.specifiedYear });
    case "INT-QL-062":
      return Object.freeze({ qlId, currentAmount: observedAmount, ratePercent: state.ratePercent, currentYear: state.observationYear });
    case "INT-QL-063":
      return Object.freeze({
        qlId,
        openingAmount: amount(state.principal, state.ratePercent, state.observationYear - 1),
        closingAmount: observedAmount,
        yearNumber: state.observationYear,
      });
    case "INT-QL-064":
      return Object.freeze({ qlId, amountAtYear: observedAmount, nextYearAmount: nextObservedAmount, yearNumber: state.observationYear });
    case "INT-QL-065":
      return Object.freeze({
        qlId,
        principal: state.principal,
        ratePercent: state.ratePercent,
        earlierYear: state.earlierYear,
        laterYear: state.laterYear,
      });
    case "INT-QL-066":
      return Object.freeze({
        qlId,
        earlierYearInterest,
        ratePercent: state.ratePercent,
        earlierYear: state.earlierYear,
        laterYear: state.laterYear,
      });
  }
}

export function canonical(qlId: IntCp003QlId, state: AnnualState): Rational {
  return canonicalAnswer(mathematicalStateFor(qlId, state));
}

export function verify(qlId: IntCp003QlId, state: AnnualState, candidate: Rational): boolean {
  return verifyByRelation(mathematicalStateFor(qlId, state), candidate);
}
