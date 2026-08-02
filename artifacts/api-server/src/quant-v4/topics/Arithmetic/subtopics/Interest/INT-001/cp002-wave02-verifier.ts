import {
  addRational,
  compareRational,
  divideRational,
  equalsRational,
  isPositiveRational,
  multiplyRational,
  rational,
  subtractRational,
} from "./foundation/rational";
import type { Rational } from "./foundation/types";
import {
  buildIntCp002OutstandingBalanceContributions,
  calculateIntCp002Ledger,
} from "./cp002-foundation/ledger";
import type { IntCp002Contribution, IntCp002LedgerState } from "./cp002-foundation/types";
import type { IntCp002Wave02Question, IntCp002Wave02PrototypeId } from "./cp002-wave02-types";

const ZERO = rational(0);
const ONE_HUNDRED = rational(100);

function readRational(
  values: IntCp002Wave02Question["state"]["values"],
  key: string,
): Rational {
  const value = values[key] as Rational | undefined;
  if (!value || typeof value.numerator !== "bigint" || typeof value.denominator !== "bigint") {
    throw new Error(`Wave 2 verifier: rational '${key}' is missing.`);
  }
  return value;
}

function simpleInterest(principal: Rational, rate: Rational, duration: Rational): Rational {
  return divideRational(
    multiplyRational(principal, multiplyRational(rate, duration)),
    ONE_HUNDRED,
  );
}

function contribution(
  id: string,
  principal: Rational,
  rate: Rational,
  duration: Rational,
): IntCp002Contribution {
  return {
    contributionId: id,
    principal,
    annualRatePercent: rate,
    durationYears: duration,
    startsAtYears: ZERO,
    endsAtYears: duration,
    sourceKind: "INDEPENDENT_DEPOSIT",
  };
}

function ledgerTotal(contributions: IntCp002Contribution[]): Rational {
  const state: IntCp002LedgerState = {
    contributions,
    dayCountBasis: "NOT_APPLICABLE",
  };
  return calculateIntCp002Ledger(state).totalInterest;
}

function verifyPiecewiseMissingRate(question: IntCp002Wave02Question, candidate: Rational): boolean {
  if (!isPositiveRational(candidate)) return false;
  const values = question.state.values;
  const principal = readRational(values, "principal");
  const firstRate = readRational(values, "firstRate");
  const firstTime = readRational(values, "firstTime");
  const secondTime = readRational(values, "secondTime");
  const expectedTotal = readRational(values, "totalInterest");
  return equalsRational(
    ledgerTotal([
      contribution("first", principal, firstRate, firstTime),
      contribution("second", principal, candidate, secondTime),
    ]),
    expectedTotal,
  );
}

function verifyPiecewiseMissingDuration(question: IntCp002Wave02Question, candidate: Rational): boolean {
  if (!isPositiveRational(candidate)) return false;
  const values = question.state.values;
  const principal = readRational(values, "principal");
  const firstRate = readRational(values, "firstRate");
  const firstTime = readRational(values, "firstTime");
  const secondRate = readRational(values, "secondRate");
  const expectedTotal = readRational(values, "totalInterest");
  return equalsRational(
    ledgerTotal([
      contribution("first", principal, firstRate, firstTime),
      contribution("second", principal, secondRate, candidate),
    ]),
    expectedTotal,
  );
}

function verifyMultiUnknown(
  question: IntCp002Wave02Question,
  candidate: Rational,
  unknown: "principal" | "rate" | "duration",
): boolean {
  if (!isPositiveRational(candidate)) return false;
  const values = question.state.values;
  const firstPrincipal = readRational(values, "firstPrincipal");
  const firstRate = readRational(values, "firstRate");
  const firstTime = readRational(values, "firstTime");
  const secondPrincipal = unknown === "principal" ? candidate : readRational(values, "secondPrincipal");
  const secondRate = unknown === "rate" ? candidate : readRational(values, "secondRate");
  const secondTime = unknown === "duration" ? candidate : readRational(values, "secondTime");
  const expectedTotal = readRational(values, "totalInterest");
  return equalsRational(
    ledgerTotal([
      contribution("first", firstPrincipal, firstRate, firstTime),
      contribution("second", secondPrincipal, secondRate, secondTime),
    ]),
    expectedTotal,
  );
}

function verifyCommonRate(question: IntCp002Wave02Question, candidate: Rational): boolean {
  if (!isPositiveRational(candidate)) return false;
  const values = question.state.values;
  const expectedTotal = readRational(values, "totalInterest");
  const contributions = [
    contribution(
      "first",
      readRational(values, "firstPrincipal"),
      candidate,
      readRational(values, "firstTime"),
    ),
    contribution(
      "second",
      readRational(values, "secondPrincipal"),
      candidate,
      readRational(values, "secondTime"),
    ),
  ];
  return equalsRational(ledgerTotal(contributions), expectedTotal);
}

function verifyEqualInterestRate(question: IntCp002Wave02Question, candidate: Rational): boolean {
  if (!isPositiveRational(candidate)) return false;
  const values = question.state.values;
  const firstInterest = simpleInterest(
    readRational(values, "firstPrincipal"),
    readRational(values, "firstRate"),
    readRational(values, "firstTime"),
  );
  const secondInterest = simpleInterest(
    readRational(values, "secondPrincipal"),
    candidate,
    readRational(values, "secondTime"),
  );
  return equalsRational(firstInterest, secondInterest);
}

function verifyEqualInterestDuration(question: IntCp002Wave02Question, candidate: Rational): boolean {
  if (!isPositiveRational(candidate)) return false;
  const values = question.state.values;
  const firstInterest = simpleInterest(
    readRational(values, "firstPrincipal"),
    readRational(values, "firstRate"),
    readRational(values, "firstTime"),
  );
  const secondInterest = simpleInterest(
    readRational(values, "secondPrincipal"),
    readRational(values, "secondRate"),
    candidate,
  );
  return equalsRational(firstInterest, secondInterest);
}

function verifyOriginalRate(question: IntCp002Wave02Question, candidate: Rational): boolean {
  if (!isPositiveRational(candidate)) return false;
  const values = question.state.values;
  const principal = readRational(values, "principal");
  const newRate = readRational(values, "newRate");
  const time = readRational(values, "time");
  const extraInterest = readRational(values, "extraInterest");
  if (compareRational(candidate, newRate) >= 0) return false;
  return equalsRational(
    subtractRational(
      simpleInterest(principal, newRate, time),
      simpleInterest(principal, candidate, time),
    ),
    extraInterest,
  );
}

function verifyRepaymentAmount(question: IntCp002Wave02Question, candidate: Rational): boolean {
  if (!isPositiveRational(candidate)) return false;
  const values = question.state.values;
  const openingPrincipal = readRational(values, "openingPrincipal");
  if (compareRational(candidate, openingPrincipal) >= 0) return false;
  try {
    const contributions = buildIntCp002OutstandingBalanceContributions({
      openingPrincipal,
      annualRatePercent: readRational(values, "rate"),
      horizonYears: readRational(values, "horizon"),
      events: [{
        eventId: "candidate-repayment",
        atYears: readRational(values, "repaymentTime"),
        kind: "PARTIAL_REPAYMENT",
        amount: candidate,
      }],
    });
    return equalsRational(
      ledgerTotal(contributions),
      readRational(values, "totalInterest"),
    );
  } catch {
    return false;
  }
}

function verifyRepaymentTime(question: IntCp002Wave02Question, candidate: Rational): boolean {
  if (!isPositiveRational(candidate)) return false;
  const values = question.state.values;
  const horizon = readRational(values, "horizon");
  if (compareRational(candidate, horizon) >= 0) return false;
  try {
    const contributions = buildIntCp002OutstandingBalanceContributions({
      openingPrincipal: readRational(values, "openingPrincipal"),
      annualRatePercent: readRational(values, "rate"),
      horizonYears: horizon,
      events: [{
        eventId: "candidate-time",
        atYears: candidate,
        kind: "PARTIAL_REPAYMENT",
        amount: readRational(values, "repaymentAmount"),
      }],
    });
    return equalsRational(
      ledgerTotal(contributions),
      readRational(values, "totalInterest"),
    );
  } catch {
    return false;
  }
}

function verifyLendingRate(question: IntCp002Wave02Question, candidate: Rational): boolean {
  if (!isPositiveRational(candidate)) return false;
  const values = question.state.values;
  const principal = readRational(values, "principal");
  const borrowRate = readRational(values, "borrowRate");
  const time = readRational(values, "time");
  const netGain = readRational(values, "netGain");
  if (compareRational(candidate, borrowRate) <= 0) return false;
  return equalsRational(
    subtractRational(
      simpleInterest(principal, candidate, time),
      simpleInterest(principal, borrowRate, time),
    ),
    netGain,
  );
}

function verifyDayCount(question: IntCp002Wave02Question, candidate: Rational): boolean {
  if (!isPositiveRational(candidate) || candidate.denominator !== 1n) return false;
  const values = question.state.values;
  const denominator = readRational(values, "dayCountDenominator");
  const duration = divideRational(candidate, denominator);
  return equalsRational(
    simpleInterest(
      readRational(values, "principal"),
      readRational(values, "rate"),
      duration,
    ),
    readRational(values, "interest"),
  );
}

export function verifyIntCp002Wave02Candidate(
  question: IntCp002Wave02Question,
  candidate: Rational,
): boolean {
  const prototypeId: IntCp002Wave02PrototypeId = question.prototypeId;
  switch (prototypeId) {
    case "INT-CP002-W02-PIECEWISE-MISSING-RATE":
      return verifyPiecewiseMissingRate(question, candidate);
    case "INT-CP002-W02-PIECEWISE-MISSING-DURATION":
      return verifyPiecewiseMissingDuration(question, candidate);
    case "INT-CP002-W02-MULTI-MISSING-PRINCIPAL":
      return verifyMultiUnknown(question, candidate, "principal");
    case "INT-CP002-W02-MULTI-MISSING-RATE":
      return verifyMultiUnknown(question, candidate, "rate");
    case "INT-CP002-W02-MULTI-MISSING-DURATION":
      return verifyMultiUnknown(question, candidate, "duration");
    case "INT-CP002-W02-MULTI-COMMON-RATE":
      return verifyCommonRate(question, candidate);
    case "INT-CP002-W02-EQUAL-INTEREST-MISSING-RATE":
      return verifyEqualInterestRate(question, candidate);
    case "INT-CP002-W02-EQUAL-INTEREST-MISSING-DURATION":
      return verifyEqualInterestDuration(question, candidate);
    case "INT-CP002-W02-COUNTERFACTUAL-ORIGINAL-RATE":
      return verifyOriginalRate(question, candidate);
    case "INT-CP002-W02-PARTIAL-REPAYMENT-AMOUNT":
      return verifyRepaymentAmount(question, candidate);
    case "INT-CP002-W02-PARTIAL-REPAYMENT-TIME":
      return verifyRepaymentTime(question, candidate);
    case "INT-CP002-W02-BORROW-LEND-LENDING-RATE":
      return verifyLendingRate(question, candidate);
    case "INT-CP002-W02-DAY-COUNT-MISSING-DAYS":
      return verifyDayCount(question, candidate);
  }
}
