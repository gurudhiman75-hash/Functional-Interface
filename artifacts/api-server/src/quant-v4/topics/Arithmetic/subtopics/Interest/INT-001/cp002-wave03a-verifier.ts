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
import type { IntCp002Contribution } from "./cp002-foundation/types";
import type {
  IntCp002Wave03aPrototypeId,
  IntCp002Wave03aQuestion,
} from "./cp002-wave03a-types";

const ZERO = rational(0);
const ONE_HUNDRED = rational(100);

function read(question: IntCp002Wave03aQuestion, key: string): Rational {
  const value = question.state.values[key] as Rational | undefined;
  if (!value || typeof value.numerator !== "bigint" || typeof value.denominator !== "bigint") {
    throw new Error(`Wave 3A verifier: rational '${key}' is missing.`);
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

function total(contributions: IntCp002Contribution[]): Rational {
  return calculateIntCp002Ledger({
    contributions,
    dayCountBasis: "NOT_APPLICABLE",
  }).totalInterest;
}

function verifyPiecewisePrincipal(question: IntCp002Wave03aQuestion, candidate: Rational): boolean {
  if (!isPositiveRational(candidate)) return false;
  return equalsRational(
    addRational(
      simpleInterest(candidate, read(question, "firstRate"), read(question, "firstTime")),
      simpleInterest(candidate, read(question, "secondRate"), read(question, "secondTime")),
    ),
    read(question, "totalInterest"),
  );
}

function verifyThreeIntervalDirect(question: IntCp002Wave03aQuestion, candidate: Rational): boolean {
  const principal = read(question, "principal");
  const reconstructed = total([
    contribution("interval-1", principal, read(question, "firstRate"), read(question, "firstTime")),
    contribution("interval-2", principal, read(question, "secondRate"), read(question, "secondTime")),
    contribution("interval-3", principal, read(question, "thirdRate"), read(question, "thirdTime")),
  ]);
  return equalsRational(candidate, reconstructed);
}

function threeDeposits(question: IntCp002Wave03aQuestion, thirdPrincipal?: Rational): IntCp002Contribution[] {
  return [
    contribution("deposit-1", read(question, "firstPrincipal"), read(question, "firstRate"), read(question, "firstTime")),
    contribution("deposit-2", read(question, "secondPrincipal"), read(question, "secondRate"), read(question, "secondTime")),
    contribution("deposit-3", thirdPrincipal ?? read(question, "thirdPrincipal"), read(question, "thirdRate"), read(question, "thirdTime")),
  ];
}

function verifyThreeDepositDirect(question: IntCp002Wave03aQuestion, candidate: Rational): boolean {
  return equalsRational(candidate, total(threeDeposits(question)));
}

function verifyThreeDepositMissingPrincipal(question: IntCp002Wave03aQuestion, candidate: Rational): boolean {
  if (!isPositiveRational(candidate)) return false;
  return equalsRational(total(threeDeposits(question, candidate)), read(question, "totalInterest"));
}

function verifySplitRatio(question: IntCp002Wave03aQuestion, candidate: Rational): boolean {
  if (!isPositiveRational(candidate)) return false;
  const totalPrincipal = read(question, "totalPrincipal");
  const firstPrincipal = divideRational(
    multiplyRational(totalPrincipal, candidate),
    addRational(candidate, rational(1)),
  );
  const secondPrincipal = subtractRational(totalPrincipal, firstPrincipal);
  return equalsRational(
    addRational(
      simpleInterest(firstPrincipal, read(question, "firstRate"), read(question, "firstTime")),
      simpleInterest(secondPrincipal, read(question, "secondRate"), read(question, "secondTime")),
    ),
    read(question, "totalInterest"),
  );
}

function verifyEqualInterestSplit(question: IntCp002Wave03aQuestion, candidate: Rational): boolean {
  if (!isPositiveRational(candidate)) return false;
  const totalPrincipal = read(question, "totalPrincipal");
  if (compareRational(candidate, totalPrincipal) >= 0) return false;
  const second = subtractRational(totalPrincipal, candidate);
  return equalsRational(
    simpleInterest(candidate, read(question, "firstRate"), read(question, "firstTime")),
    simpleInterest(second, read(question, "secondRate"), read(question, "secondTime")),
  );
}

function verifyTimeChangeDifference(question: IntCp002Wave03aQuestion, candidate: Rational): boolean {
  const principal = read(question, "principal");
  const rate = read(question, "rate");
  const oldTime = read(question, "oldTime");
  const newTime = read(question, "newTime");
  return equalsRational(
    candidate,
    subtractRational(
      simpleInterest(principal, rate, newTime),
      simpleInterest(principal, rate, oldTime),
    ),
  );
}

function verifyOriginalDuration(question: IntCp002Wave03aQuestion, candidate: Rational): boolean {
  if (!isPositiveRational(candidate)) return false;
  const newTime = read(question, "newTime");
  if (compareRational(candidate, newTime) >= 0) return false;
  return equalsRational(
    subtractRational(
      simpleInterest(read(question, "principal"), read(question, "rate"), newTime),
      simpleInterest(read(question, "principal"), read(question, "rate"), candidate),
    ),
    read(question, "extraInterest"),
  );
}

function verifyTwoRepayments(question: IntCp002Wave03aQuestion, candidate: Rational): boolean {
  try {
    const contributions = buildIntCp002OutstandingBalanceContributions({
      openingPrincipal: read(question, "openingPrincipal"),
      annualRatePercent: read(question, "rate"),
      horizonYears: read(question, "horizon"),
      events: [
        {
          eventId: "repayment-1",
          atYears: read(question, "firstRepaymentTime"),
          kind: "PARTIAL_REPAYMENT",
          amount: read(question, "firstRepaymentAmount"),
        },
        {
          eventId: "repayment-2",
          atYears: read(question, "secondRepaymentTime"),
          kind: "PARTIAL_REPAYMENT",
          amount: read(question, "secondRepaymentAmount"),
        },
      ],
    });
    return equalsRational(candidate, total(contributions));
  } catch {
    return false;
  }
}

function verifyBorrowLendPrincipal(question: IntCp002Wave03aQuestion, candidate: Rational): boolean {
  if (!isPositiveRational(candidate)) return false;
  const spread = subtractRational(read(question, "lendRate"), read(question, "borrowRate"));
  return equalsRational(
    simpleInterest(candidate, spread, read(question, "time")),
    read(question, "netGain"),
  );
}

function verifyBorrowLendDuration(question: IntCp002Wave03aQuestion, candidate: Rational): boolean {
  if (!isPositiveRational(candidate)) return false;
  const spread = subtractRational(read(question, "lendRate"), read(question, "borrowRate"));
  return equalsRational(
    simpleInterest(read(question, "principal"), spread, candidate),
    read(question, "netGain"),
  );
}

function verifyUnitLedger(question: IntCp002Wave03aQuestion, candidate: Rational): boolean {
  const prototypeId = question.prototypeId;
  if (prototypeId === "INT-CP002-W03A-MONTH-BASED-LEDGER") {
    return equalsRational(candidate, total([
      contribution("month-1", read(question, "firstPrincipal"), read(question, "firstRate"), divideRational(read(question, "firstMonths"), rational(12))),
      contribution("month-2", read(question, "secondPrincipal"), read(question, "secondRate"), divideRational(read(question, "secondMonths"), rational(12))),
    ]));
  }
  if (prototypeId === "INT-CP002-W03A-FRACTIONAL-YEAR-LEDGER") {
    return equalsRational(candidate, total([
      contribution("fraction-1", read(question, "firstPrincipal"), read(question, "firstRate"), read(question, "firstTime")),
      contribution("fraction-2", read(question, "secondPrincipal"), read(question, "secondRate"), read(question, "secondTime")),
    ]));
  }
  const dayDuration = divideRational(read(question, "days"), read(question, "dayBasis"));
  return equalsRational(candidate, total([
    contribution("day-part", read(question, "dayPrincipal"), read(question, "dayRate"), dayDuration),
    contribution("year-part", read(question, "yearPrincipal"), read(question, "yearRate"), read(question, "yearTime")),
  ]));
}

export function verifyIntCp002Wave03aCandidate(
  question: IntCp002Wave03aQuestion,
  candidate: Rational,
): boolean {
  const prototypeId: IntCp002Wave03aPrototypeId = question.prototypeId;
  switch (prototypeId) {
    case "INT-CP002-W03A-PIECEWISE-MISSING-PRINCIPAL": return verifyPiecewisePrincipal(question, candidate);
    case "INT-CP002-W03A-PIECEWISE-THREE-INTERVAL-DIRECT": return verifyThreeIntervalDirect(question, candidate);
    case "INT-CP002-W03A-THREE-DEPOSIT-DIRECT": return verifyThreeDepositDirect(question, candidate);
    case "INT-CP002-W03A-THREE-DEPOSIT-MISSING-PRINCIPAL": return verifyThreeDepositMissingPrincipal(question, candidate);
    case "INT-CP002-W03A-SPLIT-PRINCIPAL-RATIO": return verifySplitRatio(question, candidate);
    case "INT-CP002-W03A-EQUAL-INTEREST-SPLIT": return verifyEqualInterestSplit(question, candidate);
    case "INT-CP002-W03A-TIME-CHANGE-DIFFERENCE": return verifyTimeChangeDifference(question, candidate);
    case "INT-CP002-W03A-ORIGINAL-DURATION": return verifyOriginalDuration(question, candidate);
    case "INT-CP002-W03A-TWO-REPAYMENTS-DIRECT": return verifyTwoRepayments(question, candidate);
    case "INT-CP002-W03A-BORROW-LEND-MISSING-PRINCIPAL": return verifyBorrowLendPrincipal(question, candidate);
    case "INT-CP002-W03A-BORROW-LEND-MISSING-DURATION": return verifyBorrowLendDuration(question, candidate);
    case "INT-CP002-W03A-MONTH-BASED-LEDGER":
    case "INT-CP002-W03A-FRACTIONAL-YEAR-LEDGER":
    case "INT-CP002-W03A-MIXED-DAY-YEAR-LEDGER":
      return verifyUnitLedger(question, candidate);
  }
}
