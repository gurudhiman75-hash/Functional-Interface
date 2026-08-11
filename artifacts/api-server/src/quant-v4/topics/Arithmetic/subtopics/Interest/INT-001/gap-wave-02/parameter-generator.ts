import { pick } from "../foundation/prng";
import {
  addRational,
  compareRational,
  divideRational,
  equalsRational,
  isWholeRational,
  multiplyRational,
  rational,
  rationalKey,
} from "../foundation/rational";
import { getIntCp001Wave2RegistryEntry } from "./registry";
import type {
  IntCp001Wave2Context,
  IntCp001Wave2Difficulty,
  IntCp001Wave2PrototypeId,
  IntCp001Wave2PrototypeParameters,
  IntCp001Wave2VerificationDomain,
  Rational,
  SimpleInterestTimelineState,
} from "./types";

export const INT_CP001_WAVE2_RATE_PERCENT_POOL: readonly Rational[] = [
  rational(4),
  rational(5),
  rational(6),
  rational(15, 2),
  rational(8),
  rational(10),
  rational(25, 2),
  rational(12),
  rational(15),
  rational(20),
] as const;

export const INT_CP001_WAVE2_MONTH_POOL = [
  3, 4, 5, 6, 8, 9, 10, 15, 18, 21, 24, 30, 36, 42, 48, 54, 60,
] as const;

const DAY_POOL = [73, 146, 219, 292] as const;
const PRINCIPAL_POOL = [
  1200, 1500, 1600, 1800, 2000, 2400, 2500, 3000, 3200, 3600, 4000, 4500,
  4800, 5000, 6000, 7200, 8000, 9000, 10000, 12000, 15000, 18000, 20000, 24000,
] as const;

const GENERAL_TIME_POOL: readonly Rational[] = [
  rational(1, 4),
  rational(1, 3),
  rational(1, 2),
  rational(2, 3),
  rational(3, 4),
  rational(1),
  rational(3, 2),
  rational(2),
  rational(5, 2),
  rational(3),
  rational(7, 2),
  rational(4),
  rational(5),
] as const;

const TIMELINE_TIME_POOL: readonly Rational[] = [
  rational(1),
  rational(3, 2),
  rational(2),
  rational(5, 2),
  rational(3),
  rational(7, 2),
  rational(4),
  rational(5),
] as const;

const CONTEXTS: readonly IntCp001Wave2Context[] = [
  {
    scenarioId: "FIXED_DEPOSIT",
    institution: "a cooperative bank",
    actor: "Meera",
    instrument: "fixed deposit",
    purpose: "household savings",
    currencySymbol: "₹",
  },
  {
    scenarioId: "POST_OFFICE_DEPOSIT",
    institution: "a post office",
    actor: "Harpreet",
    instrument: "term deposit",
    purpose: "future expenses",
    currencySymbol: "₹",
  },
  {
    scenarioId: "EDUCATION_LOAN",
    institution: "a regional bank",
    actor: "Aman",
    instrument: "education loan",
    purpose: "course fees",
    currencySymbol: "₹",
  },
  {
    scenarioId: "CROP_LOAN",
    institution: "a rural credit society",
    actor: "Gurleen",
    instrument: "crop loan",
    purpose: "seasonal cultivation",
    currencySymbol: "₹",
  },
  {
    scenarioId: "BUSINESS_ADVANCE",
    institution: "a local finance office",
    actor: "Ravi",
    instrument: "business advance",
    purpose: "working capital",
    currencySymbol: "₹",
  },
  {
    scenarioId: "SAVINGS_CERTIFICATE",
    institution: "a savings cooperative",
    actor: "Simran",
    instrument: "savings certificate",
    purpose: "planned savings",
    currencySymbol: "₹",
  },
  {
    scenarioId: "EQUIPMENT_LOAN",
    institution: "a district bank",
    actor: "Navdeep",
    instrument: "equipment loan",
    purpose: "buying a machine",
    currencySymbol: "₹",
  },
  {
    scenarioId: "COMMUNITY_LOAN",
    institution: "a community credit group",
    actor: "Kiran",
    instrument: "member loan",
    purpose: "a planned expense",
    currencySymbol: "₹",
  },
] as const;

function createTimelineState(
  principal: Rational,
  annualRatePercent: Rational,
  earlierTimeYears: Rational,
  laterTimeYears: Rational,
): SimpleInterestTimelineState {
  if (compareRational(earlierTimeYears, rational(0)) < 0) {
    throw new Error("Earlier time cannot be negative.");
  }
  if (compareRational(laterTimeYears, earlierTimeYears) <= 0) {
    throw new Error("Later time must be after earlier time.");
  }
  const annualRate = divideRational(annualRatePercent, rational(100));
  const annualInterest = multiplyRational(principal, annualRate);
  const earlierInterest = multiplyRational(annualInterest, earlierTimeYears);
  const laterInterest = multiplyRational(annualInterest, laterTimeYears);
  return {
    principal,
    annualRatePercent,
    annualRate,
    earlierTimeYears,
    laterTimeYears,
    earlierInterest,
    laterInterest,
    earlierAmount: addRational(principal, earlierInterest),
    laterAmount: addRational(principal, laterInterest),
    annualInterest,
  };
}

function stateKey(state: SimpleInterestTimelineState): string {
  return [
    rationalKey(state.principal),
    rationalKey(state.annualRatePercent),
    rationalKey(state.earlierTimeYears),
    rationalKey(state.laterTimeYears),
    rationalKey(state.earlierAmount),
    rationalKey(state.laterAmount),
  ].join("|");
}

function wholeMoneyState(state: SimpleInterestTimelineState): boolean {
  return [
    state.principal,
    state.annualInterest,
    state.earlierInterest,
    state.laterInterest,
    state.earlierAmount,
    state.laterAmount,
  ].every(isWholeRational);
}

interface SingleTimeCandidate {
  state: SimpleInterestTimelineState;
  months?: number;
  days?: number;
}

function buildSingleTimeCandidates(): {
  month: SingleTimeCandidate[];
  day: SingleTimeCandidate[];
  general: SingleTimeCandidate[];
} {
  const month: SingleTimeCandidate[] = [];
  const day: SingleTimeCandidate[] = [];
  const general: SingleTimeCandidate[] = [];

  for (const principalValue of PRINCIPAL_POOL) {
    for (const rate of INT_CP001_WAVE2_RATE_PERCENT_POOL) {
      for (const months of INT_CP001_WAVE2_MONTH_POOL) {
        const state = createTimelineState(
          rational(principalValue),
          rate,
          rational(0),
          rational(months, 12),
        );
        if (wholeMoneyState(state)) month.push({ state, months });
      }
      for (const days of DAY_POOL) {
        const state = createTimelineState(
          rational(principalValue),
          rate,
          rational(0),
          rational(days, 365),
        );
        if (wholeMoneyState(state)) day.push({ state, days });
      }
      for (const time of GENERAL_TIME_POOL) {
        const state = createTimelineState(rational(principalValue), rate, rational(0), time);
        if (wholeMoneyState(state)) general.push({ state });
      }
    }
  }
  return { month, day, general };
}

const SINGLE_TIME_CANDIDATES = buildSingleTimeCandidates();

function buildTimelineCandidates(): SimpleInterestTimelineState[] {
  const states: SimpleInterestTimelineState[] = [];
  for (const principalValue of PRINCIPAL_POOL) {
    for (const rate of INT_CP001_WAVE2_RATE_PERCENT_POOL) {
      for (const earlier of TIMELINE_TIME_POOL) {
        for (const later of TIMELINE_TIME_POOL) {
          if (compareRational(later, earlier) <= 0) continue;
          const state = createTimelineState(rational(principalValue), rate, earlier, later);
          if (!wholeMoneyState(state)) continue;
          states.push(state);
        }
      }
    }
  }
  return states;
}

const TIMELINE_CANDIDATES = buildTimelineCandidates();

function principalDomain(): IntCp001Wave2VerificationDomain {
  return { kind: "PRINCIPAL_GRID", minimum: 100n, maximum: 50000n, step: 100n };
}

function rateDomain(): IntCp001Wave2VerificationDomain {
  return { kind: "RATE_POOL", values: [...INT_CP001_WAVE2_RATE_PERCENT_POOL] };
}

function monthDomain(): IntCp001Wave2VerificationDomain {
  return { kind: "MONTH_POOL", values: INT_CP001_WAVE2_MONTH_POOL.map((value) => rational(value)) };
}

function difficultyFor(
  prototypeId: IntCp001Wave2PrototypeId,
  state: SimpleInterestTimelineState,
): { difficulty: IntCp001Wave2Difficulty; evidence: string[] } {
  const evidence: string[] = [];
  if (/MONTHS/u.test(prototypeId)) evidence.push("Months must be connected exactly with an annual rate.");
  if (/DAYS/u.test(prototypeId)) evidence.push("The stated 365-day basis must be applied exactly.");
  if (/TWO-AMOUNTS/u.test(prototypeId)) evidence.push("Two observations on the same simple-interest line must be reconciled.");
  if (/RATIO/u.test(prototypeId)) evidence.push("A verbal amount or interest ratio must be translated into an exact factor.");
  if (/PRINCIPAL|RATE|TIME/u.test(prototypeId)) evidence.push("The requested quantity is reconstructed from indirect evidence.");
  if (state.annualRatePercent.denominator !== 1n) evidence.push("The annual percentage rate is fractional.");
  if (state.laterTimeYears.denominator !== 1n) evidence.push("The duration is fractional in years.");

  if (/DAYS|TWO-AMOUNTS|TWO-AMOUNT-RATIO/u.test(prototypeId)) {
    return { difficulty: "Hard", evidence };
  }
  if (evidence.length > 0) return { difficulty: "Medium", evidence };
  return { difficulty: "Easy", evidence: ["The exact simple-interest factor is used directly."] };
}

function baseParameters(
  prototypeId: IntCp001Wave2PrototypeId,
  seed: string,
  state: SimpleInterestTimelineState,
  verificationDomain: IntCp001Wave2VerificationDomain,
  display: IntCp001Wave2PrototypeParameters["display"],
): Omit<IntCp001Wave2PrototypeParameters, "request"> {
  getIntCp001Wave2RegistryEntry(prototypeId);
  const classified = difficultyFor(prototypeId, state);
  return {
    prototypeId,
    seed,
    context: pick(CONTEXTS, `${prototypeId}:${seed}:context`),
    hiddenState: state,
    verificationDomain,
    difficulty: classified.difficulty,
    difficultyEvidence: classified.evidence,
    generationFingerprint: [
      prototypeId,
      stateKey(state),
      display.displayedMonths ?? "-",
      display.displayedDays ?? "-",
      display.laterToEarlierAmountRatio
        ? rationalKey(display.laterToEarlierAmountRatio)
        : "-",
    ].join("::"),
    display,
  };
}

export function generateIntCp001Wave2Parameters(
  prototypeId: IntCp001Wave2PrototypeId,
  seed: string,
): IntCp001Wave2PrototypeParameters {
  switch (prototypeId) {
    case "INT-CP001-W2-PROT-AMOUNT-FOR-MONTHS": {
      const candidate = pick(SINGLE_TIME_CANDIDATES.month, `${prototypeId}:${seed}:state`);
      return {
        ...baseParameters(prototypeId, seed, candidate.state, { kind: "DIRECT" }, {
          displayedMonths: candidate.months,
        }),
        request: {
          mode: "AMOUNT_FROM_PRT",
          principal: candidate.state.principal,
          annualRatePercent: candidate.state.annualRatePercent,
          timeYears: candidate.state.laterTimeYears,
        },
      };
    }
    case "INT-CP001-W2-PROT-AMOUNT-FOR-DAYS": {
      const candidate = pick(SINGLE_TIME_CANDIDATES.day, `${prototypeId}:${seed}:state`);
      return {
        ...baseParameters(prototypeId, seed, candidate.state, { kind: "DIRECT" }, {
          displayedDays: candidate.days,
          dayCountBasis: 365,
        }),
        request: {
          mode: "AMOUNT_FROM_PRT",
          principal: candidate.state.principal,
          annualRatePercent: candidate.state.annualRatePercent,
          timeYears: candidate.state.laterTimeYears,
        },
      };
    }
    case "INT-CP001-W2-PROT-PRINCIPAL-FROM-INTEREST-MONTHS": {
      const candidate = pick(SINGLE_TIME_CANDIDATES.month, `${prototypeId}:${seed}:state`);
      return {
        ...baseParameters(prototypeId, seed, candidate.state, principalDomain(), {
          displayedMonths: candidate.months,
        }),
        request: {
          mode: "PRINCIPAL_FROM_INTEREST",
          simpleInterest: candidate.state.laterInterest,
          annualRatePercent: candidate.state.annualRatePercent,
          timeYears: candidate.state.laterTimeYears,
        },
      };
    }
    case "INT-CP001-W2-PROT-PRINCIPAL-FROM-AMOUNT-MONTHS": {
      const candidate = pick(SINGLE_TIME_CANDIDATES.month, `${prototypeId}:${seed}:state`);
      return {
        ...baseParameters(prototypeId, seed, candidate.state, principalDomain(), {
          displayedMonths: candidate.months,
        }),
        request: {
          mode: "PRINCIPAL_FROM_AMOUNT",
          amount: candidate.state.laterAmount,
          annualRatePercent: candidate.state.annualRatePercent,
          timeYears: candidate.state.laterTimeYears,
        },
      };
    }
    case "INT-CP001-W2-PROT-RATE-FROM-INTEREST-MONTHS": {
      const candidate = pick(SINGLE_TIME_CANDIDATES.month, `${prototypeId}:${seed}:state`);
      return {
        ...baseParameters(prototypeId, seed, candidate.state, rateDomain(), {
          displayedMonths: candidate.months,
        }),
        request: {
          mode: "RATE_FROM_INTEREST",
          principal: candidate.state.principal,
          simpleInterest: candidate.state.laterInterest,
          timeYears: candidate.state.laterTimeYears,
        },
      };
    }
    case "INT-CP001-W2-PROT-RATE-FROM-AMOUNT-MONTHS": {
      const candidate = pick(SINGLE_TIME_CANDIDATES.month, `${prototypeId}:${seed}:state`);
      return {
        ...baseParameters(prototypeId, seed, candidate.state, rateDomain(), {
          displayedMonths: candidate.months,
        }),
        request: {
          mode: "RATE_FROM_AMOUNT",
          principal: candidate.state.principal,
          amount: candidate.state.laterAmount,
          timeYears: candidate.state.laterTimeYears,
        },
      };
    }
    case "INT-CP001-W2-PROT-TIME-MONTHS-FROM-INTEREST": {
      const candidate = pick(SINGLE_TIME_CANDIDATES.month, `${prototypeId}:${seed}:state`);
      return {
        ...baseParameters(prototypeId, seed, candidate.state, monthDomain(), {}),
        request: {
          mode: "TIME_MONTHS_FROM_INTEREST",
          principal: candidate.state.principal,
          simpleInterest: candidate.state.laterInterest,
          annualRatePercent: candidate.state.annualRatePercent,
        },
      };
    }
    case "INT-CP001-W2-PROT-TIME-MONTHS-FROM-AMOUNT": {
      const candidate = pick(SINGLE_TIME_CANDIDATES.month, `${prototypeId}:${seed}:state`);
      return {
        ...baseParameters(prototypeId, seed, candidate.state, monthDomain(), {}),
        request: {
          mode: "TIME_MONTHS_FROM_AMOUNT",
          principal: candidate.state.principal,
          amount: candidate.state.laterAmount,
          annualRatePercent: candidate.state.annualRatePercent,
        },
      };
    }
    case "INT-CP001-W2-PROT-ANNUAL-INTEREST-FROM-TWO-AMOUNTS": {
      const state = pick(TIMELINE_CANDIDATES, `${prototypeId}:${seed}:state`);
      return {
        ...baseParameters(prototypeId, seed, state, { kind: "DIRECT" }, {
          earlierTimeYears: state.earlierTimeYears,
          laterTimeYears: state.laterTimeYears,
        }),
        request: {
          mode: "ANNUAL_INTEREST_FROM_TWO_AMOUNTS",
          earlierAmount: state.earlierAmount,
          laterAmount: state.laterAmount,
          earlierTimeYears: state.earlierTimeYears,
          laterTimeYears: state.laterTimeYears,
        },
      };
    }
    case "INT-CP001-W2-PROT-PRINCIPAL-FROM-TWO-AMOUNTS": {
      const state = pick(TIMELINE_CANDIDATES, `${prototypeId}:${seed}:state`);
      return {
        ...baseParameters(prototypeId, seed, state, principalDomain(), {
          earlierTimeYears: state.earlierTimeYears,
          laterTimeYears: state.laterTimeYears,
        }),
        request: {
          mode: "PRINCIPAL_FROM_TWO_AMOUNTS",
          earlierAmount: state.earlierAmount,
          laterAmount: state.laterAmount,
          earlierTimeYears: state.earlierTimeYears,
          laterTimeYears: state.laterTimeYears,
        },
      };
    }
    case "INT-CP001-W2-PROT-RATE-FROM-TWO-AMOUNTS": {
      const state = pick(TIMELINE_CANDIDATES, `${prototypeId}:${seed}:state`);
      return {
        ...baseParameters(prototypeId, seed, state, rateDomain(), {
          earlierTimeYears: state.earlierTimeYears,
          laterTimeYears: state.laterTimeYears,
        }),
        request: {
          mode: "RATE_FROM_TWO_AMOUNTS",
          earlierAmount: state.earlierAmount,
          laterAmount: state.laterAmount,
          earlierTimeYears: state.earlierTimeYears,
          laterTimeYears: state.laterTimeYears,
        },
      };
    }
    case "INT-CP001-W2-PROT-RATE-FROM-TWO-AMOUNT-RATIO": {
      const state = pick(TIMELINE_CANDIDATES, `${prototypeId}:${seed}:state`);
      const ratio = divideRational(state.laterAmount, state.earlierAmount);
      return {
        ...baseParameters(prototypeId, seed, state, rateDomain(), {
          earlierTimeYears: state.earlierTimeYears,
          laterTimeYears: state.laterTimeYears,
          laterToEarlierAmountRatio: ratio,
        }),
        request: {
          mode: "RATE_FROM_TWO_AMOUNT_RATIO",
          laterToEarlierAmountRatio: ratio,
          earlierTimeYears: state.earlierTimeYears,
          laterTimeYears: state.laterTimeYears,
        },
      };
    }
    case "INT-CP001-W2-PROT-AMOUNT-MULTIPLE-FROM-RATE-TIME": {
      const candidate = pick(SINGLE_TIME_CANDIDATES.general, `${prototypeId}:${seed}:state`);
      return {
        ...baseParameters(prototypeId, seed, candidate.state, { kind: "DIRECT" }, {}),
        request: {
          mode: "AMOUNT_MULTIPLE_FROM_RATE_TIME",
          annualRatePercent: candidate.state.annualRatePercent,
          timeYears: candidate.state.laterTimeYears,
        },
      };
    }
    case "INT-CP001-W2-PROT-INTEREST-RATIO-FROM-RATE-TIME": {
      const candidate = pick(SINGLE_TIME_CANDIDATES.general, `${prototypeId}:${seed}:state`);
      return {
        ...baseParameters(prototypeId, seed, candidate.state, { kind: "DIRECT" }, {}),
        request: {
          mode: "INTEREST_RATIO_FROM_RATE_TIME",
          annualRatePercent: candidate.state.annualRatePercent,
          timeYears: candidate.state.laterTimeYears,
        },
      };
    }
  }
}

export function assertIntCp001Wave2GeneratorFoundation(): void {
  if (SINGLE_TIME_CANDIDATES.month.length < 500) throw new Error("Wave 02 month pool is too small.");
  if (SINGLE_TIME_CANDIDATES.day.length < 100) throw new Error("Wave 02 day pool is too small.");
  if (SINGLE_TIME_CANDIDATES.general.length < 500) throw new Error("Wave 02 general pool is too small.");
  if (TIMELINE_CANDIDATES.length < 500) throw new Error("Wave 02 timeline pool is too small.");

  for (const state of TIMELINE_CANDIDATES.slice(0, 50)) {
    const rebuilt = createTimelineState(
      state.principal,
      state.annualRatePercent,
      state.earlierTimeYears,
      state.laterTimeYears,
    );
    if (!equalsRational(rebuilt.earlierAmount, state.earlierAmount)
      || !equalsRational(rebuilt.laterAmount, state.laterAmount)) {
      throw new Error("Wave 02 timeline reconstruction failed.");
    }
  }
}
