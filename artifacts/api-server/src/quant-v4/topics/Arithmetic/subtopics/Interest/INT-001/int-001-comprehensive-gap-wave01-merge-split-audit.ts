import assert from "node:assert/strict";
import { add, div, eq, mul, rat, type Rational } from "./cp003-exam-model";
import {
  constructIntCp010DiscoveryState,
  solveIntCp010Discovery,
  verifyIntCp010DiscoveryAnswer,
} from "./cp010-mixed-systems-discovery-v1";
import {
  buildIntCp010SequentialReopenPackageV2,
  solveIntCp010SequentialReopen,
  verifyIntCp010SequentialReopen,
} from "./cp010-sequential-mixed-source-reopen-v2";
import {
  INT_CP007_COLLISION_DISPOSITIONS,
  INT_CP007_RETAINED_PROTOTYPE_IDS,
} from "./cp007-scheme-equivalence-runtime-v2";

function rateFactor(ratePercent: Rational) {
  return add(rat(1n), div(ratePercent, rat(100n)));
}

function simpleFactor(ratePercent: Rational, years: number) {
  return add(rat(1n), div(mul(ratePercent, rat(BigInt(years))), rat(100n)));
}

function powFactor(base: Rational, exponent: number) {
  let result = rat(1n);
  for (let index = 0; index < exponent; index += 1) result = mul(result, base);
  return result;
}

function compoundFactor(ratePercent: Rational, years: number) {
  return powFactor(rateFactor(ratePercent), years);
}

let historicalP001RegressionChecks = 0;
let sourceBackedContainmentChecks = 0;
let stageOrderCommutationChecks = 0;
let inverseReplayChecks = 0;
let inverseDistinctnessChecks = 0;
let cp007BoundaryChecks = 0;

// 1) Historical held P001 was mathematically sound. Its hold was provenance-only.
for (let index = 0; index < 400; index += 1) {
  const state = constructIntCp010DiscoveryState("INT-CP010-PROT-001", `int-gap-merge:historical:${index}`);
  assert.equal(state.prototypeId, "INT-CP010-PROT-001");
  const answer = solveIntCp010Discovery(state);
  assert.equal(verifyIntCp010DiscoveryAnswer(state, answer), true);
  const siFactor = simpleFactor(state.simpleRatePercent, state.simpleYears);
  const ciFactor = state.compoundRatesPercent.reduce((factor, rate) => mul(factor, rateFactor(rate)), rat(1n));
  assert.equal(eq(answer, mul(state.principal, mul(siFactor, ciFactor))), true);
  historicalP001RegressionChecks += 3;
}

// 2) Every reopened fixed-rate SI→CI forward state is directly representable by the
// historical P001 authority shape by using a constant-rate compound sequence.
for (let index = 0; index < 400; index += 1) {
  const reopened = buildIntCp010SequentialReopenPackageV2("INT-CP010-REOPEN-PROT-001", `int-gap-merge:containment:${index}`);
  assert.equal(reopened.state.prototypeId, "INT-CP010-REOPEN-PROT-001");
  const historicalShape = {
    prototypeId: "INT-CP010-PROT-001" as const,
    principal: reopened.state.principal,
    simpleRatePercent: reopened.state.simpleRatePercent,
    simpleYears: reopened.state.simpleYears,
    compoundRatesPercent: Object.freeze(Array.from({ length: reopened.state.compoundYears }, () => reopened.state.compoundRatePercent)),
  };
  const oldAnswer = solveIntCp010Discovery(historicalShape);
  assert.equal(eq(oldAnswer, reopened.answer), true, `containment drift at ${index}`);
  assert.equal(verifyIntCp010DiscoveryAnswer(historicalShape, reopened.answer), true);
  sourceBackedContainmentChecks += 2;
}

// 3) SI→CI and CI→SI are the same forward mathematical contract when stage-1 maturity
// becomes the stage-2 principal: P × F_SI × F_CI. Stage order is presentation/state metadata,
// not a new solve semantic.
const simpleRates = [5n, 8n, 10n, 12n, 15n];
const compoundRates = [10n, 12n, 15n, 20n];
for (const simpleRate of simpleRates) {
  for (const compoundRate of compoundRates) {
    for (const simpleYears of [1, 2, 3]) {
      for (const compoundYears of [1, 2, 3]) {
        for (const principalValue of [8_000n, 20_000n, 50_000n]) {
          const principal = rat(principalValue);
          const common = {
            principal,
            simpleRatePercent: rat(simpleRate),
            simpleYears,
            compoundRatePercent: rat(compoundRate),
            compoundYears,
          };
          const siThenCi = {
            prototypeId: "INT-CP010-REOPEN-PROT-001" as const,
            stageOrder: "SI_THEN_CI" as const,
            ...common,
          };
          const ciThenSi = {
            prototypeId: "INT-CP010-REOPEN-PROT-002" as const,
            stageOrder: "CI_THEN_SI" as const,
            ...common,
          };
          const first = solveIntCp010SequentialReopen(siThenCi);
          const second = solveIntCp010SequentialReopen(ciThenSi);
          const factorProduct = mul(simpleFactor(rat(simpleRate), simpleYears), compoundFactor(rat(compoundRate), compoundYears));
          assert.equal(eq(first, second), true);
          assert.equal(eq(first, mul(principal, factorProduct)), true);
          assert.equal(verifyIntCp010SequentialReopen(siThenCi, first), true);
          assert.equal(verifyIntCp010SequentialReopen(ciThenSi, second), true);
          stageOrderCommutationChecks += 4;
        }
      }
    }
  }
}

// 4) Opening-principal recovery is a genuinely different solve direction. It consumes the
// same sequential factor but asks for P instead of the final amount. Both orders are retained
// inside one inverse authority.
const seenInverseOrders = new Set<string>();
for (let index = 0; index < 500; index += 1) {
  const inverse = buildIntCp010SequentialReopenPackageV2("INT-CP010-REOPEN-PROT-003", `int-gap-merge:inverse:${index}`);
  assert.equal(inverse.state.prototypeId, "INT-CP010-REOPEN-PROT-003");
  seenInverseOrders.add(inverse.state.stageOrder);
  const replayedFinal = mul(inverse.answer, mul(
    simpleFactor(inverse.state.simpleRatePercent, inverse.state.simpleYears),
    compoundFactor(inverse.state.compoundRatePercent, inverse.state.compoundYears),
  ));
  assert.equal(eq(replayedFinal, inverse.state.finalAmount), true);
  assert.equal(verifyIntCp010SequentialReopen(inverse.state, inverse.answer), true);
  // The forward answer for the same opening principal is the supplied final amount, not the
  // inverse answer. This guards against collapsing unknown-principal and unknown-final semantics.
  assert.equal(eq(inverse.answer, inverse.state.finalAmount), false);
  inverseReplayChecks += 2;
  inverseDistinctnessChecks += 1;
}
assert.deepEqual([...seenInverseOrders].sort(), ["CI_THEN_SI", "SI_THEN_CI"]);

// 5) CP007 already owns direct simple-borrow / compound-lend gain as a context of QL110.
// The reopened spread→principal question therefore belongs to CP007 as the inverse of that
// direct ordered-return-difference contract, not to CP010. It is not QL115, whose contract is
// equal-future-value missing present principal.
assert.equal(INT_CP007_COLLISION_DISPOSITIONS["INT-CP007-PROT-004"], "MERGE_INTO_PROT_002_BORROW_LEND_CONTEXT");
assert.equal(INT_CP007_RETAINED_PROTOTYPE_IDS.includes("INT-CP007-PROT-002"), true);
assert.equal(INT_CP007_RETAINED_PROTOTYPE_IDS.includes("INT-CP007-PROT-010"), true);
cp007BoundaryChecks += 3;

for (let index = 0; index < 400; index += 1) {
  const spreadInverse = buildIntCp010SequentialReopenPackageV2("INT-CP010-REOPEN-PROT-004", `int-gap-merge:spread:${index}`);
  assert.equal(spreadInverse.state.prototypeId, "INT-CP010-REOPEN-PROT-004");
  const state = spreadInverse.state;
  // Direct CP007-style return difference at the recovered common principal must reproduce
  // the supplied gain; therefore this is the inverse direction of QL110's direct semantic.
  assert.equal(verifyIntCp010SequentialReopen(state, spreadInverse.answer), true);
  assert.equal(eq(spreadInverse.answer, state.netGain), false);
  cp007BoundaryChecks += 2;
}

export const INT_001_GAP_WAVE01_MERGE_SPLIT_DECISION = Object.freeze({
  baselinePermanentQlCount: 130 as const,
  nextFreeQlBeforeApproval: "INT-QL-132" as const,
  nextFreeQlReserved: false as const,
  permanentAllocationAuthorized: false as const,
  candidateAuthorityCount: 3 as const,
  candidates: Object.freeze([
    Object.freeze({
      candidateId: "INT-GAP-CAND-01",
      proposedOwner: "INT-CP-010",
      contract: "sequential SI/CI stages; opening principal and both stage definitions known; solve final amount",
      stageOrderPolicy: "PARAMETER_NOT_QL",
      provenance: "historical CP010 P001 mathematics + newly recovered banking-paper source authority",
      proposedQlIfApproved: "INT-QL-132",
    }),
    Object.freeze({
      candidateId: "INT-GAP-CAND-02",
      proposedOwner: "INT-CP-010",
      contract: "sequential SI/CI stages; final amount and both stage definitions known; solve opening principal",
      stageOrderPolicy: "PARAMETER_NOT_QL",
      proposedQlIfApproved: "INT-QL-133",
    }),
    Object.freeze({
      candidateId: "INT-GAP-CAND-03",
      proposedOwner: "INT-CP-007",
      contract: "same principal under two complete schemes; ordered return difference/net gain known; solve common principal",
      relationToExistingAuthority: "INVERSE_OF_INT_QL_110_NOT_INT_QL_115",
      proposedQlIfApproved: "INT-QL-134",
    }),
  ] as const),
});

console.log("PASS_INT_001_COMPREHENSIVE_GAP_WAVE01_MERGE_SPLIT_AUDIT");
console.log(JSON.stringify({
  historicalP001RegressionChecks,
  sourceBackedContainmentChecks,
  stageOrderCommutationChecks,
  inverseReplayChecks,
  inverseDistinctnessChecks,
  cp007BoundaryChecks,
  candidateAuthorityCount: INT_001_GAP_WAVE01_MERGE_SPLIT_DECISION.candidateAuthorityCount,
  proposedQlRangeIfApproved: "INT-QL-132..INT-QL-134",
  permanentAllocationAuthorized: false,
  nextFreeQlReserved: false,
}, null, 2));
