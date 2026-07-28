import { getIntCp001PrototypeEntry } from "./cp001-registry";
import { pick } from "./prng";
import {
  addRational,
  divideRational,
  equalsRational,
  isWholeRational,
  multiplyRational,
  rational,
  rationalKey,
} from "./rational";
import type {
  IntCp001Context,
  IntCp001PrototypeId,
  IntCp001PrototypeParameters,
  IntDifficulty,
  Rational,
  SimpleInterestState,
  VerificationDomain,
} from "./types";

export const APPROVED_RATE_PERCENT_POOL: readonly Rational[] = [
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

export const APPROVED_TIME_YEAR_POOL: readonly Rational[] = [
  rational(1, 2),
  rational(1),
  rational(3, 2),
  rational(2),
  rational(5, 2),
  rational(3),
  rational(7, 2),
  rational(4),
  rational(5),
] as const;

const INTEGER_TIME_POOL = APPROVED_TIME_YEAR_POOL.filter((value) => value.denominator === 1n);

const PRINCIPAL_POOL = [
  1200, 1500, 1600, 1800, 2000, 2400, 2500, 3000, 3200, 3600, 4000, 4500,
  4800, 5000, 6000, 7200, 8000, 9000, 10000, 12000, 15000, 18000, 20000, 24000,
] as const;

const MONTH_POOL = [3, 4, 5, 6, 8, 9, 10, 15, 18, 21, 24, 30] as const;
const DAY_POOL = [73, 146, 219, 292] as const;

const CONTEXTS: readonly IntCp001Context[] = [
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
    scenarioId: "PERSONAL_LENDING",
    institution: "a private lending agreement",
    actor: "Kiran",
    instrument: "loan",
    purpose: "a stated personal expense",
    currencySymbol: "₹",
  },
] as const;

function createState(
  principal: Rational,
  annualRatePercent: Rational,
  timeYears: Rational,
): SimpleInterestState {
  const annualRate = divideRational(annualRatePercent, rational(100));
  const simpleInterest = multiplyRational(multiplyRational(principal, annualRate), timeYears);
  return {
    principal,
    annualRatePercent,
    annualRate,
    timeYears,
    simpleInterest,
    amount: addRational(principal, simpleInterest),
  };
}

function stateKey(state: SimpleInterestState): string {
  return [
    rationalKey(state.principal),
    rationalKey(state.annualRatePercent),
    rationalKey(state.timeYears),
    rationalKey(state.simpleInterest),
  ].join("|");
}

function buildStates(times: readonly Rational[]): SimpleInterestState[] {
  const states: SimpleInterestState[] = [];
  for (const principalValue of PRINCIPAL_POOL) {
    for (const annualRatePercent of APPROVED_RATE_PERCENT_POOL) {
      for (const timeYears of times) {
        const state = createState(rational(principalValue), annualRatePercent, timeYears);
        if (!isWholeRational(state.simpleInterest)) continue;
        if (state.simpleInterest.numerator <= 0n) continue;
        states.push(state);
      }
    }
  }
  return states;
}

const ANNUAL_STATES = buildStates(INTEGER_TIME_POOL);
const GENERAL_STATES = buildStates(APPROVED_TIME_YEAR_POOL);

const MONTH_STATES = MONTH_POOL.flatMap((months) => {
  const timeYears = rational(months, 12);
  return buildStates([timeYears]).map((state) => ({ state, months }));
});

const DAY_STATES = DAY_POOL.flatMap((days) => {
  const timeYears = rational(days, 365);
  return buildStates([timeYears]).map((state) => ({ state, days }));
});

interface SubdurationCandidate {
  state: SimpleInterestState;
  targetTimeYears: Rational;
  targetInterest: Rational;
}

const SUBDURATION_CANDIDATES: SubdurationCandidate[] = [];
for (const state of ANNUAL_STATES) {
  for (const target of [rational(1, 2), rational(1), rational(3, 2), rational(2)]) {
    if (target.numerator * state.timeYears.denominator >= state.timeYears.numerator * target.denominator) {
      continue;
    }
    const targetInterest = multiplyRational(
      multiplyRational(state.principal, state.annualRate),
      target,
    );
    if (!isWholeRational(targetInterest)) continue;
    SUBDURATION_CANDIDATES.push({ state, targetTimeYears: target, targetInterest });
  }
}

function rateDomain(): VerificationDomain {
  return { kind: "RATE_POOL", values: [...APPROVED_RATE_PERCENT_POOL] };
}

function timeDomain(): VerificationDomain {
  return { kind: "TIME_POOL", values: [...APPROVED_TIME_YEAR_POOL] };
}

function difficultyFor(
  prototypeId: IntCp001PrototypeId,
  state: SimpleInterestState,
  extras: { months?: number; days?: number },
): { difficulty: IntDifficulty; evidence: string[] } {
  const evidence: string[] = [];
  const inverse = /PRINCIPAL|RATE|TIME/u.test(prototypeId);
  if (inverse) evidence.push("The requested value must be reconstructed from the displayed interest state.");
  if (state.annualRatePercent.denominator !== 1n) evidence.push("The annual rate is fractional.");
  if (state.timeYears.denominator !== 1n) evidence.push("The duration must be normalised exactly.");
  if (extras.months !== undefined) evidence.push("Months must be converted to years.");
  if (extras.days !== undefined) evidence.push("Days must be converted using the stated 365-day basis.");
  if (/MULTIPLE|RATIO/u.test(prototypeId)) evidence.push("A verbal amount or interest ratio must be translated before solving.");

  if (extras.days !== undefined || /MULTIPLE|RATIO/u.test(prototypeId)) {
    return { difficulty: "Hard", evidence };
  }
  if (inverse || extras.months !== undefined || state.annualRatePercent.denominator !== 1n || state.timeYears.denominator !== 1n) {
    return { difficulty: "Medium", evidence };
  }
  return {
    difficulty: "Easy",
    evidence: evidence.length ? evidence : ["The values map directly to the simple-interest relation."],
  };
}

function baseParameters(
  prototypeId: IntCp001PrototypeId,
  seed: string,
  state: SimpleInterestState,
  verificationDomain: VerificationDomain,
  extras: {
    months?: number;
    days?: number;
    amountMultiple?: Rational;
    interestToPrincipalRatio?: Rational;
    knownTimeYears?: Rational;
    targetTimeYears?: Rational;
  } = {},
): Omit<IntCp001PrototypeParameters, "request"> {
  const registry = getIntCp001PrototypeEntry(prototypeId);
  const classified = difficultyFor(prototypeId, state, extras);
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
      extras.months ?? "-",
      extras.days ?? "-",
      extras.amountMultiple ? rationalKey(extras.amountMultiple) : "-",
      extras.interestToPrincipalRatio ? rationalKey(extras.interestToPrincipalRatio) : "-",
      extras.targetTimeYears ? rationalKey(extras.targetTimeYears) : "-",
    ].join("::"),
    display: {
      timePresentation: registry.timePresentation,
      displayedMonths: extras.months,
      displayedDays: extras.days,
      dayCountBasis: extras.days === undefined ? undefined : 365,
      amountMultiple: extras.amountMultiple,
      interestToPrincipalRatio: extras.interestToPrincipalRatio,
      knownTimeYears: extras.knownTimeYears,
      targetTimeYears: extras.targetTimeYears,
    },
  };
}

export function generateIntCp001Parameters(
  prototypeId: IntCp001PrototypeId,
  seed: string,
): IntCp001PrototypeParameters {
  switch (prototypeId) {
    case "INT-CP001-PROT-SI-FROM-PRT": {
      const state = pick(ANNUAL_STATES, `${prototypeId}:${seed}:state`);
      return {
        ...baseParameters(prototypeId, seed, state, { kind: "DIRECT" }),
        request: {
          mode: "INTEREST_FROM_PRT",
          principal: state.principal,
          annualRatePercent: state.annualRatePercent,
          timeYears: state.timeYears,
        },
      };
    }
    case "INT-CP001-PROT-AMOUNT-FROM-PRT": {
      const state = pick(ANNUAL_STATES, `${prototypeId}:${seed}:state`);
      return {
        ...baseParameters(prototypeId, seed, state, { kind: "DIRECT" }),
        request: {
          mode: "AMOUNT_FROM_PRT",
          principal: state.principal,
          annualRatePercent: state.annualRatePercent,
          timeYears: state.timeYears,
        },
      };
    }
    case "INT-CP001-PROT-PRINCIPAL-FROM-INTEREST": {
      const state = pick(GENERAL_STATES, `${prototypeId}:${seed}:state`);
      return {
        ...baseParameters(prototypeId, seed, state, {
          kind: "PRINCIPAL_GRID",
          minimum: 100n,
          maximum: 50000n,
          step: 100n,
        }),
        request: {
          mode: "PRINCIPAL_FROM_INTEREST",
          simpleInterest: state.simpleInterest,
          annualRatePercent: state.annualRatePercent,
          timeYears: state.timeYears,
        },
      };
    }
    case "INT-CP001-PROT-PRINCIPAL-FROM-AMOUNT": {
      const state = pick(GENERAL_STATES, `${prototypeId}:${seed}:state`);
      return {
        ...baseParameters(prototypeId, seed, state, {
          kind: "PRINCIPAL_GRID",
          minimum: 100n,
          maximum: 50000n,
          step: 100n,
        }),
        request: {
          mode: "PRINCIPAL_FROM_AMOUNT",
          amount: state.amount,
          annualRatePercent: state.annualRatePercent,
          timeYears: state.timeYears,
        },
      };
    }
    case "INT-CP001-PROT-RATE-FROM-INTEREST": {
      const state = pick(GENERAL_STATES, `${prototypeId}:${seed}:state`);
      return {
        ...baseParameters(prototypeId, seed, state, rateDomain()),
        request: {
          mode: "RATE_FROM_INTEREST",
          principal: state.principal,
          simpleInterest: state.simpleInterest,
          timeYears: state.timeYears,
        },
      };
    }
    case "INT-CP001-PROT-RATE-FROM-AMOUNT": {
      const state = pick(GENERAL_STATES, `${prototypeId}:${seed}:state`);
      return {
        ...baseParameters(prototypeId, seed, state, rateDomain()),
        request: {
          mode: "RATE_FROM_AMOUNT",
          principal: state.principal,
          amount: state.amount,
          timeYears: state.timeYears,
        },
      };
    }
    case "INT-CP001-PROT-TIME-FROM-INTEREST": {
      const state = pick(GENERAL_STATES, `${prototypeId}:${seed}:state`);
      return {
        ...baseParameters(prototypeId, seed, state, timeDomain()),
        request: {
          mode: "TIME_FROM_INTEREST",
          principal: state.principal,
          simpleInterest: state.simpleInterest,
          annualRatePercent: state.annualRatePercent,
        },
      };
    }
    case "INT-CP001-PROT-TIME-FROM-AMOUNT": {
      const state = pick(GENERAL_STATES, `${prototypeId}:${seed}:state`);
      return {
        ...baseParameters(prototypeId, seed, state, timeDomain()),
        request: {
          mode: "TIME_FROM_AMOUNT",
          principal: state.principal,
          amount: state.amount,
          annualRatePercent: state.annualRatePercent,
        },
      };
    }
    case "INT-CP001-PROT-INTEREST-FOR-MONTHS": {
      const candidate = pick(MONTH_STATES, `${prototypeId}:${seed}:state`);
      return {
        ...baseParameters(prototypeId, seed, candidate.state, { kind: "DIRECT" }, {
          months: candidate.months,
        }),
        request: {
          mode: "INTEREST_FROM_PRT",
          principal: candidate.state.principal,
          annualRatePercent: candidate.state.annualRatePercent,
          timeYears: candidate.state.timeYears,
        },
      };
    }
    case "INT-CP001-PROT-INTEREST-FOR-DAYS": {
      const candidate = pick(DAY_STATES, `${prototypeId}:${seed}:state`);
      return {
        ...baseParameters(prototypeId, seed, candidate.state, { kind: "DIRECT" }, {
          days: candidate.days,
        }),
        request: {
          mode: "INTEREST_FROM_PRT",
          principal: candidate.state.principal,
          annualRatePercent: candidate.state.annualRatePercent,
          timeYears: candidate.state.timeYears,
        },
      };
    }
    case "INT-CP001-PROT-ANNUAL-INTEREST-FROM-TOTAL": {
      const state = pick(ANNUAL_STATES.filter((item) => item.timeYears.numerator > 1n), `${prototypeId}:${seed}:state`);
      return {
        ...baseParameters(prototypeId, seed, state, { kind: "DIRECT" }),
        request: {
          mode: "ANNUAL_INTEREST_FROM_TOTAL",
          totalInterest: state.simpleInterest,
          timeYears: state.timeYears,
        },
      };
    }
    case "INT-CP001-PROT-INTEREST-FOR-SUBDURATION": {
      const candidate = pick(SUBDURATION_CANDIDATES, `${prototypeId}:${seed}:state`);
      return {
        ...baseParameters(prototypeId, seed, candidate.state, { kind: "DIRECT" }, {
          knownTimeYears: candidate.state.timeYears,
          targetTimeYears: candidate.targetTimeYears,
        }),
        request: {
          mode: "INTEREST_FOR_SUBDURATION",
          totalInterest: candidate.state.simpleInterest,
          knownTimeYears: candidate.state.timeYears,
          targetTimeYears: candidate.targetTimeYears,
        },
      };
    }
    case "INT-CP001-PROT-RATE-FROM-AMOUNT-MULTIPLE": {
      const state = pick(ANNUAL_STATES, `${prototypeId}:${seed}:state`);
      const amountMultiple = divideRational(state.amount, state.principal);
      return {
        ...baseParameters(prototypeId, seed, state, rateDomain(), { amountMultiple }),
        request: {
          mode: "RATE_FROM_AMOUNT_MULTIPLE",
          amountMultiple,
          timeYears: state.timeYears,
        },
      };
    }
    case "INT-CP001-PROT-TIME-FROM-AMOUNT-MULTIPLE": {
      const state = pick(ANNUAL_STATES, `${prototypeId}:${seed}:state`);
      const amountMultiple = divideRational(state.amount, state.principal);
      return {
        ...baseParameters(prototypeId, seed, state, timeDomain(), { amountMultiple }),
        request: {
          mode: "TIME_FROM_AMOUNT_MULTIPLE",
          amountMultiple,
          annualRatePercent: state.annualRatePercent,
        },
      };
    }
    case "INT-CP001-PROT-TIME-FROM-INTEREST-MULTIPLE": {
      const state = pick(ANNUAL_STATES, `${prototypeId}:${seed}:state`);
      const interestToPrincipalRatio = divideRational(state.simpleInterest, state.principal);
      return {
        ...baseParameters(prototypeId, seed, state, timeDomain(), { interestToPrincipalRatio }),
        request: {
          mode: "TIME_FROM_INTEREST_MULTIPLE",
          interestToPrincipalRatio,
          annualRatePercent: state.annualRatePercent,
        },
      };
    }
    case "INT-CP001-PROT-RATE-FROM-INTEREST-PRINCIPAL-RATIO": {
      const state = pick(ANNUAL_STATES, `${prototypeId}:${seed}:state`);
      const interestToPrincipalRatio = divideRational(state.simpleInterest, state.principal);
      return {
        ...baseParameters(prototypeId, seed, state, rateDomain(), { interestToPrincipalRatio }),
        request: {
          mode: "RATE_FROM_INTEREST_PRINCIPAL_RATIO",
          interestToPrincipalRatio,
          timeYears: state.timeYears,
        },
      };
    }
  }
}

export function assertGeneratorFoundation(): void {
  if (ANNUAL_STATES.length < 300) throw new Error("Annual simple-interest state pool is too small.");
  if (GENERAL_STATES.length < 500) throw new Error("General simple-interest state pool is too small.");
  if (MONTH_STATES.length < 300) throw new Error("Month-state pool is too small.");
  if (DAY_STATES.length < 80) throw new Error("Day-state pool is too small.");
  if (SUBDURATION_CANDIDATES.length < 200) throw new Error("Subduration state pool is too small.");
  for (const state of [...ANNUAL_STATES.slice(0, 20), ...GENERAL_STATES.slice(0, 20)]) {
    const reconstructed = createState(state.principal, state.annualRatePercent, state.timeYears);
    if (!equalsRational(reconstructed.simpleInterest, state.simpleInterest)) {
      throw new Error("State reconstruction failed.");
    }
  }
}
