import {
  addRational,
  compareRational,
  divideRational,
  equalsRational,
  isNonNegativeRational,
  isPositiveRational,
  multiplyRational,
  rational,
  subtractRational,
} from "../foundation/rational";
import type { Rational } from "../foundation/types";
import type {
  IntCp002Contribution,
  IntCp002DayCountBasis,
  IntCp002LedgerResult,
  IntCp002LedgerState,
  IntCp002OutstandingBalanceRequest,
} from "./types";

const ONE_HUNDRED = rational(100);
const ZERO = rational(0);

function assertRationalEquals(actual: Rational, expected: Rational, message: string): void {
  if (!equalsRational(actual, expected)) throw new Error(message);
}

export function validateIntCp002Contribution(contribution: IntCp002Contribution): void {
  if (!contribution.contributionId.trim()) {
    throw new Error("CP-002 contributionId cannot be empty.");
  }
  if (!isPositiveRational(contribution.principal)) {
    throw new Error(`${contribution.contributionId}: principal must be positive.`);
  }
  if (!isNonNegativeRational(contribution.annualRatePercent)) {
    throw new Error(`${contribution.contributionId}: annual rate cannot be negative.`);
  }
  if (!isPositiveRational(contribution.durationYears)) {
    throw new Error(`${contribution.contributionId}: duration must be positive.`);
  }
  if (!isNonNegativeRational(contribution.startsAtYears)) {
    throw new Error(`${contribution.contributionId}: start time cannot be negative.`);
  }
  if (compareRational(contribution.endsAtYears, contribution.startsAtYears) <= 0) {
    throw new Error(`${contribution.contributionId}: end time must be after start time.`);
  }
  assertRationalEquals(
    subtractRational(contribution.endsAtYears, contribution.startsAtYears),
    contribution.durationYears,
    `${contribution.contributionId}: duration does not match start/end times.`,
  );
}

export function validateIntCp002LedgerState(state: IntCp002LedgerState): void {
  if (state.contributions.length === 0) {
    throw new Error("CP-002 ledger must contain at least one contribution.");
  }
  const ids = new Set<string>();
  for (const contribution of state.contributions) {
    validateIntCp002Contribution(contribution);
    if (ids.has(contribution.contributionId)) {
      throw new Error(`Duplicate CP-002 contributionId '${contribution.contributionId}'.`);
    }
    ids.add(contribution.contributionId);
  }
  if (state.dayCountBasis === "EXPLICIT_DENOMINATOR") {
    if (!state.explicitDayCountDenominator || !isPositiveRational(state.explicitDayCountDenominator)) {
      throw new Error("Explicit day-count basis requires a positive denominator.");
    }
  } else if (state.explicitDayCountDenominator) {
    throw new Error("Explicit day-count denominator is only valid with EXPLICIT_DENOMINATOR basis.");
  }
}

export function calculateIntCp002ContributionInterest(
  contribution: IntCp002Contribution,
): Rational {
  validateIntCp002Contribution(contribution);
  const rateTime = multiplyRational(
    contribution.annualRatePercent,
    contribution.durationYears,
  );
  return divideRational(
    multiplyRational(contribution.principal, rateTime),
    ONE_HUNDRED,
  );
}

export function calculateIntCp002Ledger(
  state: IntCp002LedgerState,
): IntCp002LedgerResult {
  validateIntCp002LedgerState(state);
  const contributions = state.contributions.map((contribution) => ({
    contributionId: contribution.contributionId,
    interest: calculateIntCp002ContributionInterest(contribution),
  }));
  const totalInterest = contributions.reduce(
    (sum, item) => addRational(sum, item.interest),
    ZERO,
  );
  return { contributions, totalInterest };
}

export function intCp002DaysToYears(
  days: bigint | number,
  basis: Exclude<IntCp002DayCountBasis, "NOT_APPLICABLE">,
  explicitDenominator?: Rational,
): Rational {
  const dayCount = rational(days);
  if (!isPositiveRational(dayCount)) throw new Error("Day count must be positive.");

  if (basis === "ACTUAL_365") return divideRational(dayCount, rational(365));
  if (basis === "COMMERCIAL_360") return divideRational(dayCount, rational(360));
  if (!explicitDenominator || !isPositiveRational(explicitDenominator)) {
    throw new Error("EXPLICIT_DENOMINATOR requires a positive denominator.");
  }
  return divideRational(dayCount, explicitDenominator);
}

export function solveIntCp002CommonRatePercent(
  totalInterest: Rational,
  contributions: ReadonlyArray<Pick<IntCp002Contribution, "principal" | "durationYears">>,
): Rational {
  if (!isNonNegativeRational(totalInterest)) {
    throw new Error("Total interest cannot be negative.");
  }
  if (contributions.length === 0) {
    throw new Error("Common-rate recovery requires at least one contribution.");
  }
  const weightedPrincipalTime = contributions.reduce(
    (sum, contribution) => {
      if (!isPositiveRational(contribution.principal) || !isPositiveRational(contribution.durationYears)) {
        throw new Error("Common-rate contributions require positive principal and duration.");
      }
      return addRational(
        sum,
        multiplyRational(contribution.principal, contribution.durationYears),
      );
    },
    ZERO,
  );
  return divideRational(
    multiplyRational(totalInterest, ONE_HUNDRED),
    weightedPrincipalTime,
  );
}

export function solveIntCp002MissingPrincipal(
  totalInterest: Rational,
  knownContributions: IntCp002Contribution[],
  unknownAnnualRatePercent: Rational,
  unknownDurationYears: Rational,
): Rational {
  if (!isPositiveRational(unknownAnnualRatePercent) || !isPositiveRational(unknownDurationYears)) {
    throw new Error("Missing-principal recovery requires positive rate and duration.");
  }
  const knownInterest = knownContributions.length === 0
    ? ZERO
    : calculateIntCp002Ledger({
      contributions: knownContributions,
      dayCountBasis: "NOT_APPLICABLE",
    }).totalInterest;
  const remainingInterest = subtractRational(totalInterest, knownInterest);
  if (!isPositiveRational(remainingInterest)) {
    throw new Error("Missing-principal contribution must have positive remaining interest.");
  }
  const rateTime = multiplyRational(unknownAnnualRatePercent, unknownDurationYears);
  return divideRational(
    multiplyRational(remainingInterest, ONE_HUNDRED),
    rateTime,
  );
}

export function solveIntCp002MissingDuration(
  totalInterest: Rational,
  knownContributions: IntCp002Contribution[],
  unknownPrincipal: Rational,
  unknownAnnualRatePercent: Rational,
): Rational {
  if (!isPositiveRational(unknownPrincipal) || !isPositiveRational(unknownAnnualRatePercent)) {
    throw new Error("Missing-duration recovery requires positive principal and rate.");
  }
  const knownInterest = knownContributions.length === 0
    ? ZERO
    : calculateIntCp002Ledger({
      contributions: knownContributions,
      dayCountBasis: "NOT_APPLICABLE",
    }).totalInterest;
  const remainingInterest = subtractRational(totalInterest, knownInterest);
  if (!isPositiveRational(remainingInterest)) {
    throw new Error("Missing-duration contribution must have positive remaining interest.");
  }
  return divideRational(
    multiplyRational(remainingInterest, ONE_HUNDRED),
    multiplyRational(unknownPrincipal, unknownAnnualRatePercent),
  );
}

export function solveIntCp002SplitPrincipal(request: {
  totalPrincipal: Rational;
  totalInterest: Rational;
  firstAnnualRatePercent: Rational;
  firstDurationYears: Rational;
  secondAnnualRatePercent: Rational;
  secondDurationYears: Rational;
}): { firstPrincipal: Rational; secondPrincipal: Rational } {
  if (!isPositiveRational(request.totalPrincipal)) {
    throw new Error("Split-principal total must be positive.");
  }
  const firstCoefficient = multiplyRational(
    request.firstAnnualRatePercent,
    request.firstDurationYears,
  );
  const secondCoefficient = multiplyRational(
    request.secondAnnualRatePercent,
    request.secondDurationYears,
  );
  const coefficientDifference = subtractRational(firstCoefficient, secondCoefficient);
  if (equalsRational(coefficientDifference, ZERO)) {
    throw new Error("Split-principal inverse is indeterminate when both rate-time coefficients match.");
  }
  const numerator = subtractRational(
    multiplyRational(request.totalInterest, ONE_HUNDRED),
    multiplyRational(request.totalPrincipal, secondCoefficient),
  );
  const firstPrincipal = divideRational(numerator, coefficientDifference);
  const secondPrincipal = subtractRational(request.totalPrincipal, firstPrincipal);
  if (!isPositiveRational(firstPrincipal) || !isPositiveRational(secondPrincipal)) {
    throw new Error("Recovered split principal must contain two positive parts.");
  }
  return { firstPrincipal, secondPrincipal };
}

export function compareIntCp002Ledgers(
  left: IntCp002LedgerState,
  right: IntCp002LedgerState,
): {
  leftInterest: Rational;
  rightInterest: Rational;
  difference: Rational;
  relation: "LEFT_GREATER" | "RIGHT_GREATER" | "EQUAL";
} {
  const leftInterest = calculateIntCp002Ledger(left).totalInterest;
  const rightInterest = calculateIntCp002Ledger(right).totalInterest;
  const difference = subtractRational(leftInterest, rightInterest);
  const comparison = compareRational(leftInterest, rightInterest);
  return {
    leftInterest,
    rightInterest,
    difference,
    relation: comparison > 0 ? "LEFT_GREATER" : comparison < 0 ? "RIGHT_GREATER" : "EQUAL",
  };
}

export function buildIntCp002OutstandingBalanceContributions(
  request: IntCp002OutstandingBalanceRequest,
): IntCp002Contribution[] {
  if (!isPositiveRational(request.openingPrincipal)) {
    throw new Error("Opening principal must be positive.");
  }
  if (!isNonNegativeRational(request.annualRatePercent)) {
    throw new Error("Outstanding-balance rate cannot be negative.");
  }
  if (!isPositiveRational(request.horizonYears)) {
    throw new Error("Outstanding-balance horizon must be positive.");
  }

  const contributions: IntCp002Contribution[] = [];
  let balance = request.openingPrincipal;
  let previousTime = ZERO;

  for (const [index, event] of request.events.entries()) {
    if (!event.eventId.trim()) throw new Error(`Event ${index + 1}: eventId cannot be empty.`);
    if (!isPositiveRational(event.amount)) throw new Error(`${event.eventId}: event amount must be positive.`);
    if (compareRational(event.atYears, previousTime) <= 0) {
      throw new Error(`${event.eventId}: events must be strictly increasing and after time zero.`);
    }
    if (compareRational(event.atYears, request.horizonYears) >= 0) {
      throw new Error(`${event.eventId}: event must occur before the horizon.`);
    }

    const durationYears = subtractRational(event.atYears, previousTime);
    contributions.push({
      contributionId: `balance-segment-${index + 1}`,
      principal: balance,
      annualRatePercent: request.annualRatePercent,
      durationYears,
      startsAtYears: previousTime,
      endsAtYears: event.atYears,
      sourceKind: "OUTSTANDING_BALANCE_SEGMENT",
    });

    balance = subtractRational(balance, event.amount);
    if (!isPositiveRational(balance)) {
      throw new Error(`${event.eventId}: repayment/withdrawal must leave a positive balance.`);
    }
    previousTime = event.atYears;
  }

  contributions.push({
    contributionId: `balance-segment-${request.events.length + 1}`,
    principal: balance,
    annualRatePercent: request.annualRatePercent,
    durationYears: subtractRational(request.horizonYears, previousTime),
    startsAtYears: previousTime,
    endsAtYears: request.horizonYears,
    sourceKind: "OUTSTANDING_BALANCE_SEGMENT",
  });

  contributions.forEach(validateIntCp002Contribution);
  return contributions;
}
