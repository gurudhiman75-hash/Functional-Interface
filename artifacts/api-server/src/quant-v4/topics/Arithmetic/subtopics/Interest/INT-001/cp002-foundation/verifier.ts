import {
  addRational,
  divideRational,
  equalsRational,
  multiplyRational,
  rational,
  subtractRational,
} from "../foundation/rational";
import type { Rational } from "../foundation/types";
import { validateIntCp002Contribution, validateIntCp002LedgerState } from "./ledger";
import type {
  IntCp002Contribution,
  IntCp002LedgerState,
  IntCp002VerificationResult,
} from "./types";

const ZERO = rational(0);
const ONE_HUNDRED = rational(100);

function reconstructContributionInterest(contribution: IntCp002Contribution): Rational {
  validateIntCp002Contribution(contribution);
  const annualInterest = divideRational(
    multiplyRational(contribution.principal, contribution.annualRatePercent),
    ONE_HUNDRED,
  );
  return multiplyRational(annualInterest, contribution.durationYears);
}

export function reconstructIntCp002LedgerInterest(
  state: IntCp002LedgerState,
): Rational {
  validateIntCp002LedgerState(state);
  let total = ZERO;
  for (const contribution of state.contributions) {
    total = addRational(total, reconstructContributionInterest(contribution));
  }
  return total;
}

export function verifyIntCp002LedgerCandidate(
  state: IntCp002LedgerState,
  candidateTotalInterest: Rational,
): IntCp002VerificationResult {
  const errors: string[] = [];
  let reconstructedTotalInterest = ZERO;
  try {
    reconstructedTotalInterest = reconstructIntCp002LedgerInterest(state);
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
    return { ok: false, errors, reconstructedTotalInterest };
  }

  if (!equalsRational(reconstructedTotalInterest, candidateTotalInterest)) {
    errors.push("Candidate total interest does not match independent contribution reconstruction.");
  }
  if (state.totalInterest && !equalsRational(reconstructedTotalInterest, state.totalInterest)) {
    errors.push("Stored ledger total does not match independent contribution reconstruction.");
  }
  return {
    ok: errors.length === 0,
    errors,
    reconstructedTotalInterest,
  };
}

export function verifyIntCp002UnknownContributionCandidate(request: {
  knownContributions: IntCp002Contribution[];
  unknownContributionTemplate: Omit<IntCp002Contribution, "principal">;
  candidatePrincipal: Rational;
  expectedTotalInterest: Rational;
}): IntCp002VerificationResult {
  const unknownContribution: IntCp002Contribution = {
    ...request.unknownContributionTemplate,
    principal: request.candidatePrincipal,
  };
  return verifyIntCp002LedgerCandidate(
    {
      contributions: [...request.knownContributions, unknownContribution],
      dayCountBasis: "NOT_APPLICABLE",
      totalInterest: request.expectedTotalInterest,
    },
    request.expectedTotalInterest,
  );
}

export function verifyIntCp002SplitPrincipalCandidate(request: {
  totalPrincipal: Rational;
  firstPrincipal: Rational;
  secondPrincipal: Rational;
  firstAnnualRatePercent: Rational;
  firstDurationYears: Rational;
  secondAnnualRatePercent: Rational;
  secondDurationYears: Rational;
  expectedTotalInterest: Rational;
}): IntCp002VerificationResult {
  const errors: string[] = [];
  if (!equalsRational(
    addRational(request.firstPrincipal, request.secondPrincipal),
    request.totalPrincipal,
  )) {
    errors.push("Split principals do not add to the declared total principal.");
  }

  const first: IntCp002Contribution = {
    contributionId: "split-first",
    principal: request.firstPrincipal,
    annualRatePercent: request.firstAnnualRatePercent,
    durationYears: request.firstDurationYears,
    startsAtYears: ZERO,
    endsAtYears: request.firstDurationYears,
    sourceKind: "INDEPENDENT_DEPOSIT",
  };
  const second: IntCp002Contribution = {
    contributionId: "split-second",
    principal: request.secondPrincipal,
    annualRatePercent: request.secondAnnualRatePercent,
    durationYears: request.secondDurationYears,
    startsAtYears: ZERO,
    endsAtYears: request.secondDurationYears,
    sourceKind: "INDEPENDENT_DEPOSIT",
  };
  const result = verifyIntCp002LedgerCandidate(
    {
      contributions: [first, second],
      dayCountBasis: "NOT_APPLICABLE",
      totalPrincipal: request.totalPrincipal,
      totalInterest: request.expectedTotalInterest,
    },
    request.expectedTotalInterest,
  );
  return {
    ok: errors.length === 0 && result.ok,
    errors: [...errors, ...result.errors],
    reconstructedTotalInterest: result.reconstructedTotalInterest,
  };
}

export function verifyIntCp002LedgerDifferenceCandidate(request: {
  left: IntCp002LedgerState;
  right: IntCp002LedgerState;
  candidateDifference: Rational;
}): {
  ok: boolean;
  errors: string[];
  reconstructedDifference: Rational;
} {
  const leftInterest = reconstructIntCp002LedgerInterest(request.left);
  const rightInterest = reconstructIntCp002LedgerInterest(request.right);
  const reconstructedDifference = subtractRational(leftInterest, rightInterest);
  const errors = equalsRational(reconstructedDifference, request.candidateDifference)
    ? []
    : ["Candidate ledger difference does not match independent reconstruction."];
  return { ok: errors.length === 0, errors, reconstructedDifference };
}
