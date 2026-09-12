import { eq } from "./cp003-exam-model";
import {
  INT_CP010_POST_WAVE01_SOURCE_RESULT,
} from "./cp010-post-wave01-source-ledger-v1";
import {
  INT_CP010_AUTHORITY_PROPOSAL_RESULT,
  INT_CP010_AUTHORITY_PROPOSAL_VERSION,
  INT_CP010_PROPOSED_AUTHORITIES,
  INT_CP010_SOURCE_HOLD_PROTOTYPES,
} from "./cp010-two-authority-proposal-v1";
import {
  buildIntCp010DiscoveryPackage,
  solveIntCp010Discovery,
  verifyIntCp010DiscoveryAnswer,
} from "./cp010-mixed-systems-discovery-v1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(INT_CP010_AUTHORITY_PROPOSAL_VERSION === "INT-CP-010-TWO-AUTHORITY-PROPOSAL-v1", "CP010 authority proposal version drifted");
assert(INT_CP010_POST_WAVE01_SOURCE_RESULT.materialReliableSourceGaps === 0, "Cannot propose authorities while reliable source gaps remain");
assert(INT_CP010_PROPOSED_AUTHORITIES.length === 2, "CP010 must propose exactly two reliable authorities");
assert(new Set(INT_CP010_PROPOSED_AUTHORITIES.map((authority) => authority.authorityId)).size === 2, "Authority IDs collide");
assert(INT_CP010_PROPOSED_AUTHORITIES.flatMap((authority) => authority.sourcePrototypeIds).join(",") === "INT-CP010-PROT-003,INT-CP010-PROT-004", "Proposal admitted or lost a prototype");
assert(INT_CP010_SOURCE_HOLD_PROTOTYPES.map((item) => item.prototypeId).join(",") === "INT-CP010-PROT-001,INT-CP010-PROT-002", "Source-hold prototype set drifted");
assert(INT_CP010_AUTHORITY_PROPOSAL_RESULT.proposedAuthorityCount === 2, "Proposed authority count drifted");
assert(INT_CP010_AUTHORITY_PROPOSAL_RESULT.merges === 0, "No merge should be claimed between equal-instalment and heterogeneous-opening-debt contracts");
assert(INT_CP010_AUTHORITY_PROPOSAL_RESULT.candidatePermanentQlRangeIfApproved === "INT-QL-130..INT-QL-131", "Candidate permanent range drifted");
assert(INT_CP010_AUTHORITY_PROPOSAL_RESULT.nextPotentialQlAfterApprovedAllocation === "INT-QL-132", "Next QL after candidate range drifted");
assert(INT_CP010_AUTHORITY_PROPOSAL_RESULT.permanentQlCount === 0, "Authority proposal must remain ID-free");
assert(INT_CP010_AUTHORITY_PROPOSAL_RESULT.candidateRangeReserved === false, "Authority proposal must not reserve permanent IDs");

const a1 = INT_CP010_PROPOSED_AUTHORITIES[0]!;
const a2 = INT_CP010_PROPOSED_AUTHORITIES[1]!;
assert(a1.solveContract === "VARIABLE_RATE_EQUAL_INSTALMENT" && a1.answerSemantic === "INSTALMENT_AMOUNT", "AUTH-01 contract drifted");
assert(a2.solveContract === "VARIABLE_RATE_HETEROGENEOUS_OPENING_DEBT" && a2.answerSemantic === "OPENING_DEBT", "AUTH-02 contract drifted");
assert(a1.componentAuthorities.includes("INT-CP-008:EQUAL_INSTALMENT") && !a1.componentAuthorities.includes("INT-CP-009:HETEROGENEOUS_DATED_CASH_FLOW"), "AUTH-01 component boundary drifted");
assert(a2.componentAuthorities.includes("INT-CP-009:HETEROGENEOUS_DATED_CASH_FLOW") && !a2.componentAuthorities.includes("INT-CP-008:EQUAL_INSTALMENT"), "AUTH-02 component boundary drifted");
assert(a1.separationRationale.length > 80 && a2.separationRationale.length > 80, "Protected non-merge rationale too thin");

let packages = 0;
let proofChecks = 0;
const fingerprints = new Map<string, Set<string>>([
  ["INT-CP010-PROT-003", new Set<string>()],
  ["INT-CP010-PROT-004", new Set<string>()],
]);
for (const prototypeId of ["INT-CP010-PROT-003", "INT-CP010-PROT-004"] as const) {
  for (let index = 0; index < 300; index += 1) {
    const seed = `cp010:authority-proposal:${prototypeId}:${index}`;
    const q = buildIntCp010DiscoveryPackage(prototypeId, seed);
    packages += 1;
    fingerprints.get(prototypeId)!.add(q.mathematicalFingerprint);
    assert(eq(solveIntCp010Discovery(q.mathematicalState), q.answer), `${prototypeId}/${seed}: canonical solver drift`);
    assert(verifyIntCp010DiscoveryAnswer(q.mathematicalState, q.answer), `${prototypeId}/${seed}: verifier drift`);
    assert(q.permanentQlId === null && q.lifecycle.permanentIdentityAllocated === false, `${prototypeId}/${seed}: permanent identity leaked`);
    assert(q.lifecycle.questionStudioDiscoverable === false && q.lifecycle.questionBankWritable === false && q.lifecycle.testEligible === false && q.lifecycle.publiclyPublishable === false, `${prototypeId}/${seed}: downstream gate leaked`);
    proofChecks += 4;
  }
}
assert(packages === 600, `Expected 600 proposal proof packages, got ${packages}`);
for (const [prototypeId, states] of fingerprints) assert(states.size >= 100, `${prototypeId}: authority candidate state pool too thin (${states.size})`);

console.log(JSON.stringify({
  proposalVersion: INT_CP010_AUTHORITY_PROPOSAL_VERSION,
  discoveryPrototypeCount: INT_CP010_AUTHORITY_PROPOSAL_RESULT.discoveryPrototypeCount,
  reliablePermanentCandidatePrototypeCount: INT_CP010_AUTHORITY_PROPOSAL_RESULT.reliablePermanentCandidatePrototypeCount,
  sourceHoldPrototypeCount: INT_CP010_AUTHORITY_PROPOSAL_RESULT.sourceHoldPrototypeCount,
  proposedAuthorityCount: INT_CP010_AUTHORITY_PROPOSAL_RESULT.proposedAuthorityCount,
  merges: INT_CP010_AUTHORITY_PROPOSAL_RESULT.merges,
  protectedNonMerges: INT_CP010_AUTHORITY_PROPOSAL_RESULT.protectedNonMerges,
  candidatePermanentQlRangeIfApproved: INT_CP010_AUTHORITY_PROPOSAL_RESULT.candidatePermanentQlRangeIfApproved,
  nextPotentialQlAfterApprovedAllocation: INT_CP010_AUTHORITY_PROPOSAL_RESULT.nextPotentialQlAfterApprovedAllocation,
  proofPackages: packages,
  proofChecks,
  uniqueStates: Object.fromEntries([...fingerprints].map(([id, values]) => [id, values.size])),
  permanentQlCount: 0,
  candidateRangeReserved: false,
  nextGate: INT_CP010_AUTHORITY_PROPOSAL_RESULT.nextGate,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
}, null, 2));
console.log("PASS_INT_CP010_TWO_AUTHORITY_PROPOSAL_V1_AUDIT");
