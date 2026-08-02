import { listQuantV4Packages } from "../../../../../generation-engine";
import { addRational, equalsRational, rational } from "./foundation/rational";
import type { Rational } from "./foundation/types";
import {
  buildIntCp002OutstandingBalanceContributions,
  calculateIntCp002Ledger,
  compareIntCp002Ledgers,
  intCp002DaysToYears,
  solveIntCp002CommonRatePercent,
  solveIntCp002MissingDuration,
  solveIntCp002MissingPrincipal,
  solveIntCp002SplitPrincipal,
  validateIntCp002Contribution,
} from "./cp002-foundation/ledger";
import type { IntCp002Contribution, IntCp002LedgerState } from "./cp002-foundation/types";
import {
  reconstructIntCp002LedgerInterest,
  verifyIntCp002LedgerCandidate,
  verifyIntCp002LedgerDifferenceCandidate,
  verifyIntCp002SplitPrincipalCandidate,
  verifyIntCp002UnknownContributionCandidate,
} from "./cp002-foundation/verifier";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function assertRational(actual: Rational, expected: Rational, label: string): void {
  assert(
    equalsRational(actual, expected),
    `${label}: expected ${expected.numerator}/${expected.denominator}, received ${actual.numerator}/${actual.denominator}`,
  );
}

function assertThrows(action: () => unknown, label: string): void {
  let rejected = false;
  try {
    action();
  } catch {
    rejected = true;
  }
  assert(rejected, `${label}: invalid state did not fail closed`);
}

function contribution(request: {
  id: string;
  principal: Rational;
  rate: Rational;
  duration: Rational;
  start?: Rational;
  sourceKind?: IntCp002Contribution["sourceKind"];
}): IntCp002Contribution {
  const startsAtYears = request.start ?? rational(0);
  return {
    contributionId: request.id,
    principal: request.principal,
    annualRatePercent: request.rate,
    durationYears: request.duration,
    startsAtYears,
    endsAtYears: addRational(startsAtYears, request.duration),
    sourceKind: request.sourceKind ?? "INDEPENDENT_DEPOSIT",
  };
}

const registryBefore = JSON.stringify(listQuantV4Packages());
assert(
  !listQuantV4Packages().some((item) => String(item.packageId) === "INT-001"),
  "INT-001 must remain absent from the central Quant V4 registry",
);

const counters = {
  exactLedgerChecks: 0,
  inverseChecks: 0,
  verifierChecks: 0,
  tamperRejectionChecks: 0,
  invalidStateChecks: 0,
  dayCountChecks: 0,
  eventOrderChecks: 0,
  registryChecks: 1,
};

const piecewiseState: IntCp002LedgerState = {
  contributions: [
    contribution({
      id: "piecewise-first",
      principal: rational(10000),
      rate: rational(5),
      duration: rational(2),
      sourceKind: "RATE_INTERVAL",
    }),
    contribution({
      id: "piecewise-second",
      principal: rational(10000),
      rate: rational(8),
      duration: rational(1),
      start: rational(2),
      sourceKind: "RATE_INTERVAL",
    }),
  ],
  dayCountBasis: "NOT_APPLICABLE",
  totalInterest: rational(1800),
};
const piecewise = calculateIntCp002Ledger(piecewiseState);
assertRational(piecewise.contributions[0]!.interest, rational(1000), "piecewise first interval");
assertRational(piecewise.contributions[1]!.interest, rational(800), "piecewise second interval");
assertRational(piecewise.totalInterest, rational(1800), "piecewise total");
assertRational(reconstructIntCp002LedgerInterest(piecewiseState), rational(1800), "piecewise independent reconstruction");
assert(verifyIntCp002LedgerCandidate(piecewiseState, rational(1800)).ok, "piecewise candidate verification failed");
counters.exactLedgerChecks += 4;
counters.verifierChecks += 1;

const multipleDepositState: IntCp002LedgerState = {
  contributions: [
    contribution({ id: "deposit-a", principal: rational(5000), rate: rational(6), duration: rational(2) }),
    contribution({ id: "deposit-b", principal: rational(8000), rate: rational(15, 2), duration: rational(3, 2) }),
  ],
  dayCountBasis: "NOT_APPLICABLE",
  totalInterest: rational(1500),
};
const multiple = calculateIntCp002Ledger(multipleDepositState);
assertRational(multiple.contributions[0]!.interest, rational(600), "deposit A interest");
assertRational(multiple.contributions[1]!.interest, rational(900), "deposit B interest");
assertRational(multiple.totalInterest, rational(1500), "multiple-deposit total");
assert(verifyIntCp002LedgerCandidate(multipleDepositState, rational(1500)).ok, "multiple-deposit verification failed");
counters.exactLedgerChecks += 3;
counters.verifierChecks += 1;

assertRational(
  solveIntCp002CommonRatePercent(rational(1200), [
    { principal: rational(5000), durationYears: rational(2) },
    { principal: rational(10000), durationYears: rational(1) },
  ]),
  rational(6),
  "common rate recovery",
);
counters.inverseChecks += 1;

const knownForPrincipal = [
  contribution({ id: "known-principal", principal: rational(5000), rate: rational(6), duration: rational(2) }),
];
const missingPrincipal = solveIntCp002MissingPrincipal(
  rational(1320),
  knownForPrincipal,
  rational(8),
  rational(3, 2),
);
assertRational(missingPrincipal, rational(6000), "missing principal recovery");
assert(verifyIntCp002UnknownContributionCandidate({
  knownContributions: knownForPrincipal,
  unknownContributionTemplate: {
    contributionId: "unknown-principal",
    annualRatePercent: rational(8),
    durationYears: rational(3, 2),
    startsAtYears: rational(0),
    endsAtYears: rational(3, 2),
    sourceKind: "INDEPENDENT_DEPOSIT",
  },
  candidatePrincipal: missingPrincipal,
  expectedTotalInterest: rational(1320),
}).ok, "missing-principal independent verification failed");
counters.inverseChecks += 1;
counters.verifierChecks += 1;

const knownForDuration = [
  contribution({ id: "known-duration", principal: rational(5000), rate: rational(6), duration: rational(2) }),
];
const missingDuration = solveIntCp002MissingDuration(
  rational(1500),
  knownForDuration,
  rational(6000),
  rational(10),
);
assertRational(missingDuration, rational(3, 2), "missing duration recovery");
const recoveredDuration = contribution({
  id: "recovered-duration",
  principal: rational(6000),
  rate: rational(10),
  duration: missingDuration,
});
assert(verifyIntCp002LedgerCandidate({
  contributions: [...knownForDuration, recoveredDuration],
  dayCountBasis: "NOT_APPLICABLE",
  totalInterest: rational(1500),
}, rational(1500)).ok, "missing-duration independent verification failed");
counters.inverseChecks += 1;
counters.verifierChecks += 1;

const split = solveIntCp002SplitPrincipal({
  totalPrincipal: rational(10000),
  totalInterest: rational(920),
  firstAnnualRatePercent: rational(5),
  firstDurationYears: rational(2),
  secondAnnualRatePercent: rational(8),
  secondDurationYears: rational(1),
});
assertRational(split.firstPrincipal, rational(6000), "split first principal");
assertRational(split.secondPrincipal, rational(4000), "split second principal");
assert(verifyIntCp002SplitPrincipalCandidate({
  totalPrincipal: rational(10000),
  firstPrincipal: split.firstPrincipal,
  secondPrincipal: split.secondPrincipal,
  firstAnnualRatePercent: rational(5),
  firstDurationYears: rational(2),
  secondAnnualRatePercent: rational(8),
  secondDurationYears: rational(1),
  expectedTotalInterest: rational(920),
}).ok, "split-principal independent verification failed");
counters.inverseChecks += 2;
counters.verifierChecks += 1;

const comparison = compareIntCp002Ledgers(piecewiseState, multipleDepositState);
assertRational(comparison.leftInterest, rational(1800), "comparison left interest");
assertRational(comparison.rightInterest, rational(1500), "comparison right interest");
assertRational(comparison.difference, rational(300), "comparison difference");
assert(comparison.relation === "LEFT_GREATER", "comparison relation mismatch");
assert(verifyIntCp002LedgerDifferenceCandidate({
  left: piecewiseState,
  right: multipleDepositState,
  candidateDifference: rational(300),
}).ok, "ledger-difference verification failed");
counters.exactLedgerChecks += 4;
counters.verifierChecks += 1;

const outstanding = buildIntCp002OutstandingBalanceContributions({
  openingPrincipal: rational(10000),
  annualRatePercent: rational(10),
  horizonYears: rational(2),
  events: [{
    eventId: "repayment-1",
    atYears: rational(1),
    kind: "PARTIAL_REPAYMENT",
    amount: rational(4000),
  }],
});
assert(outstanding.length === 2, "outstanding-balance segment count mismatch");
assertRational(outstanding[0]!.principal, rational(10000), "first outstanding balance");
assertRational(outstanding[1]!.principal, rational(6000), "second outstanding balance");
const outstandingState: IntCp002LedgerState = {
  contributions: outstanding,
  dayCountBasis: "NOT_APPLICABLE",
  totalInterest: rational(1600),
};
assertRational(calculateIntCp002Ledger(outstandingState).totalInterest, rational(1600), "outstanding-balance interest");
assert(verifyIntCp002LedgerCandidate(outstandingState, rational(1600)).ok, "outstanding-balance verification failed");
counters.eventOrderChecks += 4;
counters.verifierChecks += 1;

assertRational(intCp002DaysToYears(73, "ACTUAL_365"), rational(1, 5), "365-day conversion");
assertRational(intCp002DaysToYears(72, "COMMERCIAL_360"), rational(1, 5), "360-day conversion");
assertRational(intCp002DaysToYears(183, "EXPLICIT_DENOMINATOR", rational(366)), rational(1, 2), "explicit day-count conversion");
counters.dayCountChecks += 3;

assert(!verifyIntCp002LedgerCandidate(piecewiseState, rational(1801)).ok, "tampered ledger total was accepted");
assert(!verifyIntCp002LedgerDifferenceCandidate({
  left: piecewiseState,
  right: multipleDepositState,
  candidateDifference: rational(301),
}).ok, "tampered ledger difference was accepted");
assert(!verifyIntCp002SplitPrincipalCandidate({
  totalPrincipal: rational(10000),
  firstPrincipal: rational(6001),
  secondPrincipal: rational(3999),
  firstAnnualRatePercent: rational(5),
  firstDurationYears: rational(2),
  secondAnnualRatePercent: rational(8),
  secondDurationYears: rational(1),
  expectedTotalInterest: rational(920),
}).ok, "tampered split principal was accepted");
counters.tamperRejectionChecks += 3;

assertThrows(() => validateIntCp002Contribution({
  contributionId: "bad-duration",
  principal: rational(1000),
  annualRatePercent: rational(5),
  durationYears: rational(2),
  startsAtYears: rational(0),
  endsAtYears: rational(1),
  sourceKind: "RATE_INTERVAL",
}), "duration/start-end mismatch");
assertThrows(() => solveIntCp002SplitPrincipal({
  totalPrincipal: rational(10000),
  totalInterest: rational(1000),
  firstAnnualRatePercent: rational(5),
  firstDurationYears: rational(2),
  secondAnnualRatePercent: rational(10),
  secondDurationYears: rational(1),
}), "indeterminate split coefficient");
assertThrows(() => buildIntCp002OutstandingBalanceContributions({
  openingPrincipal: rational(10000),
  annualRatePercent: rational(10),
  horizonYears: rational(2),
  events: [
    { eventId: "late", atYears: rational(3, 2), kind: "PARTIAL_REPAYMENT", amount: rational(1000) },
    { eventId: "early", atYears: rational(1), kind: "PARTIAL_REPAYMENT", amount: rational(1000) },
  ],
}), "unordered repayment events");
assertThrows(() => intCp002DaysToYears(30, "EXPLICIT_DENOMINATOR"), "missing explicit day denominator");
counters.invalidStateChecks += 4;

const registryAfter = JSON.stringify(listQuantV4Packages());
assert(registryAfter === registryBefore, "Central Quant V4 registry changed during CP-002 Wave 0 audit");
assert(
  !listQuantV4Packages().some((item) => String(item.packageId) === "INT-001"),
  "CP-002 Wave 0 introduced INT-001 into the central registry",
);
counters.registryChecks += 2;

console.log(JSON.stringify({
  packageId: "INT-001",
  canonicalProblemId: "INT-CP-002",
  auditId: "INT-CP-002-WAVE00-LEDGER-FOUNDATION",
  permanentQlCount: 0,
  frozenSolveContractCount: 0,
  ...counters,
  enabled: false,
  stagingStatus: "NOT_STAGED",
  registrationStatus: "NOT_REGISTERED",
  questionStudioDiscoverable: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));
console.log("PASS_INT_CP002_WAVE00_LEDGER_FOUNDATION");
