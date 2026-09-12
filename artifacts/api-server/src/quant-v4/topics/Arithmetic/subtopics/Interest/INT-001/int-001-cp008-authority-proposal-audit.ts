import { eq, sub } from "./cp003-exam-model";
import {
  INT_CP008_PROTOTYPE_IDS,
  INT_CP008_RATE_LIBRARY,
  answerSemanticForIntCp008Prototype,
  constructIntCp008PrototypeState,
  intCp008EndInstallment,
  solveIntCp008Prototype,
  verifyIntCp008PrototypeAnswer,
  type IntCp008PrototypeState,
} from "./cp008-instalment-discovery-v1";
import {
  INT_CP008_AUTHORITY_GROUPS,
  INT_CP008_AUTHORITY_PROPOSAL,
  INT_CP008_PROTOTYPE_TO_AUTHORITY_SLOT,
} from "./cp008-authority-proposal-v1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const allMapped = INT_CP008_AUTHORITY_GROUPS.flatMap((group) => [...group.prototypes]);
assert(allMapped.length === INT_CP008_PROTOTYPE_IDS.length, "CP008 authority proposal does not map exactly 11 prototypes");
assert(new Set(allMapped).size === INT_CP008_PROTOTYPE_IDS.length, "CP008 prototype is mapped more than once");
for (const prototypeId of INT_CP008_PROTOTYPE_IDS) {
  assert(INT_CP008_PROTOTYPE_TO_AUTHORITY_SLOT[prototypeId], `${prototypeId}: missing authority slot`);
}
assert(INT_CP008_AUTHORITY_GROUPS.length === 9, "CP008 proposed authority count drifted");
assert(INT_CP008_AUTHORITY_PROPOSAL.proposedAuthorityCount === 9, "CP008 proposal metadata count drifted");
assert(INT_CP008_AUTHORITY_PROPOSAL.permanentQlAllocationAuthorized === false, "CP008 proposal authorized permanent QLs");
assert(INT_CP008_AUTHORITY_PROPOSAL.permanentQlIdsAllocated.length === 0, "CP008 proposal allocated QL IDs");

let equivalenceChecks = 0;
let retainChecks = 0;
let verifierChecks = 0;
for (let index = 0; index < 200; index += 1) {
  const p006 = constructIntCp008PrototypeState("INT-CP008-PROT-006", `cp008-authority:p006:${index}`);
  const p006Answer = solveIntCp008Prototype(p006);
  const p001Equivalent: IntCp008PrototypeState = {
    prototypeId: "INT-CP008-PROT-001",
    periodicRatePercent: p006.periodicRatePercent,
    periods: p006.periods,
    periodUnit: p006.periodUnit,
    openingBalance: sub(p006.purchasePrice, p006.downPayment),
  };
  assert(eq(p006Answer, solveIntCp008Prototype(p001Equivalent)), `P006/${index}: down-payment merge equivalence failed`);
  equivalenceChecks += 1;

  const p009 = constructIntCp008PrototypeState("INT-CP008-PROT-009", `cp008-authority:p009:${index}`);
  const p009Answer = solveIntCp008Prototype(p009);
  const p002Equivalent: IntCp008PrototypeState = {
    prototypeId: "INT-CP008-PROT-002",
    periodicRatePercent: p009.periodicRatePercent,
    periods: p009.periods,
    periodUnit: p009.periodUnit,
    installment: p009.withdrawal,
  };
  assert(eq(p009Answer, solveIntCp008Prototype(p002Equivalent)), `P009/${index}: withdrawal/opening inverse merge equivalence failed`);
  equivalenceChecks += 1;

  const p005 = constructIntCp008PrototypeState("INT-CP008-PROT-005", `cp008-authority:p005:${index}`);
  const beginningAnswer = solveIntCp008Prototype(p005);
  const endAnswer = intCp008EndInstallment(p005.openingBalance, p005.periodicRatePercent, p005.periods);
  assert(!eq(beginningAnswer, endAnswer), `P005/${index}: beginning/end event order collapsed`);
  retainChecks += 1;

  const p004 = constructIntCp008PrototypeState("INT-CP008-PROT-004", `cp008-authority:p004:${index}`);
  const p004Answer = solveIntCp008Prototype(p004);
  assert(!eq(p004Answer, p004.regularInstallment), `P004/${index}: balancing payment collapsed into regular instalment`);
  retainChecks += 1;

  const p010 = constructIntCp008PrototypeState("INT-CP008-PROT-010", `cp008-authority:p010:${index}`);
  const p010Answer = solveIntCp008Prototype(p010);
  assert(p010Answer.numerator > 0n, `P010/${index}: missed-payment catch-up is not positive`);
  retainChecks += 1;

  const p011 = constructIntCp008PrototypeState("INT-CP008-PROT-011", `cp008-authority:p011:${index}`);
  const p011Answer = solveIntCp008Prototype(p011);
  assert(p011Answer.numerator > 0n, `P011/${index}: two-rate difference is not positive`);
  assert(answerSemanticForIntCp008Prototype("INT-CP008-PROT-011") === "INSTALLMENT_DIFFERENCE", "P011 answer semantic drifted");
  retainChecks += 2;

  const p003 = constructIntCp008PrototypeState("INT-CP008-PROT-003", `cp008-authority:p003:${index}`);
  assert(solveIntCp008Prototype(p003).numerator > 0n, `P003/${index}: intermediate balance should remain positive`);
  retainChecks += 1;

  const p008 = constructIntCp008PrototypeState("INT-CP008-PROT-008", `cp008-authority:p008:${index}`);
  assert(solveIntCp008Prototype(p008).numerator > p008.deposit.numerator, `P008/${index}: recurring fund did not exceed one deposit`);
  retainChecks += 1;

  const p007 = constructIntCp008PrototypeState("INT-CP008-PROT-007", `cp008-authority:p007:${index}`);
  const p007Answer = solveIntCp008Prototype(p007);
  assert(INT_CP008_RATE_LIBRARY.some((candidate) => eq(candidate, p007Answer)), `P007/${index}: bounded inverse escaped rate library`);
  retainChecks += 1;

  for (const prototypeId of INT_CP008_PROTOTYPE_IDS) {
    const state = constructIntCp008PrototypeState(prototypeId, `cp008-authority:verify:${prototypeId}:${index}`);
    const answer = solveIntCp008Prototype(state);
    assert(verifyIntCp008PrototypeAnswer(state, answer), `${prototypeId}/${index}: canonical verifier regression`);
    verifierChecks += 1;
  }
}

console.log(JSON.stringify({
  proposalVersion: INT_CP008_AUTHORITY_PROPOSAL.version,
  temporaryPrototypes: INT_CP008_AUTHORITY_PROPOSAL.temporaryPrototypeCount,
  proposedAuthorityCount: INT_CP008_AUTHORITY_PROPOSAL.proposedAuthorityCount,
  mergedPrototypeCount: INT_CP008_AUTHORITY_PROPOSAL.mergedPrototypeCount,
  sourceMaterialGaps: INT_CP008_AUTHORITY_PROPOSAL.sourceMaterialGaps,
  equivalenceChecks,
  retainChecks,
  verifierChecks,
  firstPotentialPermanentQl: INT_CP008_AUTHORITY_PROPOSAL.firstPotentialPermanentQl,
  lastPotentialPermanentQlIfApproved: INT_CP008_AUTHORITY_PROPOSAL.lastPotentialPermanentQlIfApproved,
  permanentQlAllocationAuthorized: false,
  permanentQlIdsAllocated: 0,
  nextGate: INT_CP008_AUTHORITY_PROPOSAL.nextGate,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
}, null, 2));
console.log("PASS_INT_CP008_AUTHORITY_PROPOSAL_AUDIT");
