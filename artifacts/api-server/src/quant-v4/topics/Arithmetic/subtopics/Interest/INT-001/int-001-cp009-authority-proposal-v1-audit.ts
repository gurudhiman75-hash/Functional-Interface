import {
  INT_CP009_AUTHORITY_IDS,
  INT_CP009_AUTHORITY_PROPOSAL,
  INT_CP009_AUTHORITY_PROPOSAL_RESULT,
  INT_CP009_AUTHORITY_PROPOSAL_VERSION,
} from "./cp009-authority-proposal-v1";
import {
  INT_CP009_PROTOTYPE_IDS,
  buildIntCp009BalancedDiscoveryPackage,
  intCp009EquivalentAt,
  intCp009ShiftAmount,
  solveIntCp009Prototype,
  verifyIntCp009PrototypeAnswer,
  type IntCp009DatedFlow,
} from "./cp009-dated-cash-flow-discovery-balanced-v2";
import { eq, sub, type Rational } from "./cp003-exam-model";
import { INT_CP009_POST_WAVE01_GAP_RESULT } from "./cp009-post-wave01-source-ledger";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
function stable(value: unknown): string {
  return JSON.stringify(value, (_key, current) => typeof current === "bigint" ? `${current}n` : current);
}

function missingFlowFromCommonDate(
  targetAtComparison: Rational,
  knownFlows: readonly IntCp009DatedFlow[],
  ratePercent: Rational,
  comparisonPeriod: number,
  missingAtPeriod: number,
): Rational {
  const knownAtComparison = intCp009EquivalentAt(knownFlows, ratePercent, comparisonPeriod);
  const missingAtComparison = sub(targetAtComparison, knownAtComparison);
  return intCp009ShiftAmount(missingAtComparison, ratePercent, comparisonPeriod, missingAtPeriod);
}

assert(INT_CP009_AUTHORITY_PROPOSAL_VERSION === "INT-CP-009-AUTHORITY-PROPOSAL-v1", "CP009 authority proposal version drifted");
assert(INT_CP009_AUTHORITY_IDS.length === 5, "CP009 authority ID count drifted");
assert(INT_CP009_AUTHORITY_PROPOSAL.length === 5, "CP009 authority proposal count drifted");
assert(INT_CP009_AUTHORITY_PROPOSAL_RESULT.temporaryPrototypeCount === 8, "CP009 temporary prototype count drifted");
assert(INT_CP009_AUTHORITY_PROPOSAL_RESULT.proposedAuthorityCount === 5, "CP009 proposed authority count drifted");
assert(INT_CP009_AUTHORITY_PROPOSAL_RESULT.mergedPrototypeCount === 3, "CP009 merged prototype count drifted");
assert(INT_CP009_AUTHORITY_PROPOSAL_RESULT.sourceMaterialGaps === 0, "CP009 source material gaps reappeared");
assert(INT_CP009_POST_WAVE01_GAP_RESULT.materialGaps === 0, "CP009 source-gap authority is not saturated");
assert(INT_CP009_AUTHORITY_PROPOSAL_RESULT.permanentQlCount === 0, "CP009 proposal allocated permanent QLs");
assert(INT_CP009_AUTHORITY_PROPOSAL_RESULT.permanentRangeReserved === false, "CP009 proposal reserved permanent IDs");
assert(INT_CP009_AUTHORITY_PROPOSAL_RESULT.nextGate === "PRODUCT_OWNER_AUTHORITY_COUNT_APPROVAL", "CP009 proposal next gate drifted");

const prototypeOwners = new Map<string, string>();
for (const authority of INT_CP009_AUTHORITY_PROPOSAL) {
  assert(authority.retainedPrototypes.length > 0, `${authority.authorityId}: empty authority`);
  assert(authority.retainedPrototypes.includes(authority.primaryPrototype), `${authority.authorityId}: primary prototype not in authority`);
  for (const prototypeId of authority.retainedPrototypes) {
    assert(!prototypeOwners.has(prototypeId), `${prototypeId}: assigned to multiple proposed authorities`);
    prototypeOwners.set(prototypeId, authority.authorityId);
  }
}
assert(prototypeOwners.size === INT_CP009_PROTOTYPE_IDS.length, "CP009 proposal does not cover every temporary prototype exactly once");
for (const prototypeId of INT_CP009_PROTOTYPE_IDS) assert(prototypeOwners.has(prototypeId), `${prototypeId}: missing from proposal`);

let p008IntoP002Checks = 0;
for (let index = 0; index < 400; index += 1) {
  const q = buildIntCp009BalancedDiscoveryPackage("INT-CP009-PROT-008", `int-cp009-proposal:p008-p002:${index}`);
  const state = q.mathematicalState;
  assert(state.prototypeId === "INT-CP009-PROT-008", "P008 narrowing failed");
  const scheduleToday = intCp009EquivalentAt(state.repayments, state.periodicRatePercent, 0);
  const equivalentPaymentToday = intCp009ShiftAmount(q.answer, state.periodicRatePercent, state.comparisonPeriod, 0);
  assert(eq(scheduleToday, equivalentPaymentToday), `P008/P002 merge identity failed at ${index}`);
  p008IntoP002Checks += 1;
}

let missingFlowMergeChecks = 0;
for (let index = 0; index < 300; index += 1) {
  const middle = buildIntCp009BalancedDiscoveryPackage("INT-CP009-PROT-003", `int-cp009-proposal:missing-middle:${index}`);
  const middleState = middle.mathematicalState;
  assert(middleState.prototypeId === "INT-CP009-PROT-003", "P003 narrowing failed");
  const middleFinalPeriod = Math.max(middleState.missingAtPeriod, ...middleState.repayments.map((flow) => flow.atPeriod));
  const middleTarget = intCp009ShiftAmount(middleState.openingDebt, middleState.periodicRatePercent, 0, middleFinalPeriod);
  const middleGeneric = missingFlowFromCommonDate(middleTarget, middleState.repayments, middleState.periodicRatePercent, middleFinalPeriod, middleState.missingAtPeriod);
  assert(eq(middle.answer, middleGeneric), `P003 generic missing-flow identity failed at ${index}`);
  missingFlowMergeChecks += 1;

  const final = buildIntCp009BalancedDiscoveryPackage("INT-CP009-PROT-005", `int-cp009-proposal:missing-final:${index}`);
  const finalState = final.mathematicalState;
  assert(finalState.prototypeId === "INT-CP009-PROT-005", "P005 narrowing failed");
  const finalTarget = intCp009ShiftAmount(finalState.openingDebt, finalState.periodicRatePercent, 0, finalState.finalPeriod);
  const finalGeneric = missingFlowFromCommonDate(finalTarget, finalState.knownRepayments, finalState.periodicRatePercent, finalState.finalPeriod, finalState.finalPeriod);
  assert(eq(final.answer, finalGeneric), `P005 generic missing-flow identity failed at ${index}`);
  missingFlowMergeChecks += 1;

  const deposit = buildIntCp009BalancedDiscoveryPackage("INT-CP009-PROT-006", `int-cp009-proposal:missing-deposit:${index}`);
  const depositState = deposit.mathematicalState;
  assert(depositState.prototypeId === "INT-CP009-PROT-006", "P006 narrowing failed");
  const depositGeneric = missingFlowFromCommonDate(depositState.targetFund, depositState.deposits, depositState.periodicRatePercent, depositState.duePeriod, depositState.missingAtPeriod);
  assert(eq(deposit.answer, depositGeneric), `P006 generic missing-flow identity failed at ${index}`);
  missingFlowMergeChecks += 1;
}

let retainedDistinctionChecks = 0;
let regressionPackages = 0;
for (let index = 0; index < 200; index += 1) {
  const p001 = buildIntCp009BalancedDiscoveryPackage("INT-CP009-PROT-001", `int-cp009-proposal:retain:p001:${index}`);
  const p002 = buildIntCp009BalancedDiscoveryPackage("INT-CP009-PROT-002", `int-cp009-proposal:retain:p002:${index}`);
  const p004 = buildIntCp009BalancedDiscoveryPackage("INT-CP009-PROT-004", `int-cp009-proposal:retain:p004:${index}`);
  const p007 = buildIntCp009BalancedDiscoveryPackage("INT-CP009-PROT-007", `int-cp009-proposal:retain:p007:${index}`);

  assert(p001.answerSemantic === "FUTURE_FUND", "P001 future-fund semantic drifted");
  assert(p002.answerSemantic === "OPENING_DEBT", "P002 opening-debt semantic drifted");
  assert(p004.answerSemantic === "OUTSTANDING_BALANCE", "P004 outstanding-balance semantic drifted");
  assert(p007.answerSemantic === "PERIODIC_RATE_PERCENT", "P007 rate semantic drifted");
  retainedDistinctionChecks += 4;

  const p001State = p001.mathematicalState;
  const p002State = p002.mathematicalState;
  const p004State = p004.mathematicalState;
  assert(p001State.prototypeId === "INT-CP009-PROT-001" && p001State.deposits.every((flow) => flow.direction === "DEPOSIT"), "P001 flow-direction contract drifted");
  assert(p002State.prototypeId === "INT-CP009-PROT-002" && p002State.repayments.every((flow) => flow.direction === "REPAYMENT"), "P002 flow-direction contract drifted");
  assert(p004State.prototypeId === "INT-CP009-PROT-004" && p004State.afterPeriod >= 1, "P004 intermediate-state contract drifted");
  retainedDistinctionChecks += 3;

  for (const q of [p001, p002, p004, p007]) {
    assert(eq(solveIntCp009Prototype(q.mathematicalState), q.answer), `${q.prototypeId}: canonical regression drift`);
    assert(verifyIntCp009PrototypeAnswer(q.mathematicalState, q.answer), `${q.prototypeId}: verifier regression drift`);
    assert(q.permanentQlId === null, `${q.prototypeId}: permanent identity leaked`);
    assert(q.lifecycle.questionStudioDiscoverable === false, `${q.prototypeId}: Question Studio opened`);
    assert(q.lifecycle.questionBankWritable === false, `${q.prototypeId}: Question Bank opened`);
    assert(q.lifecycle.testEligibility === "INELIGIBLE", `${q.prototypeId}: test gate opened`);
    assert(q.lifecycle.publiclyPublishable === false, `${q.prototypeId}: public gate opened`);
    regressionPackages += 1;
  }
}

assert(stable(INT_CP009_AUTHORITY_PROPOSAL.map((entry) => entry.retainedPrototypes)) === stable([
  ["INT-CP009-PROT-001"],
  ["INT-CP009-PROT-002", "INT-CP009-PROT-008"],
  ["INT-CP009-PROT-003", "INT-CP009-PROT-005", "INT-CP009-PROT-006"],
  ["INT-CP009-PROT-004"],
  ["INT-CP009-PROT-007"],
]), "CP009 approved-proposal grouping order drifted");

console.log(JSON.stringify({
  proposalVersion: INT_CP009_AUTHORITY_PROPOSAL_VERSION,
  temporaryPrototypes: INT_CP009_AUTHORITY_PROPOSAL_RESULT.temporaryPrototypeCount,
  proposedAuthorities: INT_CP009_AUTHORITY_PROPOSAL_RESULT.proposedAuthorityCount,
  mergedPrototypes: INT_CP009_AUTHORITY_PROPOSAL_RESULT.mergedPrototypeCount,
  sourceMaterialGaps: INT_CP009_AUTHORITY_PROPOSAL_RESULT.sourceMaterialGaps,
  p008IntoP002Checks,
  missingFlowMergeChecks,
  retainedDistinctionChecks,
  regressionPackages,
  permanentQlCount: 0,
  candidatePermanentRangeIfApproved: INT_CP009_AUTHORITY_PROPOSAL_RESULT.candidatePermanentRangeIfApproved,
  permanentRangeReserved: false,
  nextPotentialQlIdentity: INT_CP009_AUTHORITY_PROPOSAL_RESULT.nextPotentialQlIdentity,
  nextGate: INT_CP009_AUTHORITY_PROPOSAL_RESULT.nextGate,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
}, null, 2));
console.log("PASS_INT_CP009_AUTHORITY_PROPOSAL_V1_AUDIT");
