import {
  FGC_001_CANDIDATE_AUTHORITIES_V1,
  FGC_001_CANDIDATE_AUTHORITY_IDS_V1,
  FGC_001_EXECUTABLE_PROTOTYPES_V1,
  FGC_001_MERGE_SPLIT_GOVERNANCE_V1,
} from "../foundation/spatial/figure-completion-merge-split-proposal-v1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(FGC_001_EXECUTABLE_PROTOTYPES_V1.length === 8, "FGC merge/split proposal must account for exactly eight executable prototypes.");
assert(new Set(FGC_001_EXECUTABLE_PROTOTYPES_V1).size === 8, "FGC executable prototype inventory contains duplicates.");
assert(FGC_001_CANDIDATE_AUTHORITIES_V1.length === 4, "FGC merge/split proposal must contain exactly four candidate reasoning authorities.");
assert(new Set(FGC_001_CANDIDATE_AUTHORITY_IDS_V1).size === 4, "FGC candidate authority IDs must be unique.");

const ownership = new Map<string, string[]>();
for (const authority of FGC_001_CANDIDATE_AUTHORITIES_V1) {
  assert(authority.permanentQlId === null, `${authority.candidateId}: permanent QL allocation is forbidden at proposal stage.`);
  assert(authority.executablePrototypes.length > 0, `${authority.candidateId}: candidate must own at least one executable prototype.`);
  assert(authority.reasoningIdentity.trim().length > 30, `${authority.candidateId}: reasoning identity is underspecified.`);
  assert(authority.mergeDecision.trim().length > 30, `${authority.candidateId}: merge/split decision is underspecified.`);
  assert(authority.sourceEvidence.length > 0, `${authority.candidateId}: source evidence is required.`);
  for (const prototypeId of authority.executablePrototypes) {
    const owners = ownership.get(prototypeId) ?? [];
    owners.push(authority.candidateId);
    ownership.set(prototypeId, owners);
  }
}

for (const prototypeId of FGC_001_EXECUTABLE_PROTOTYPES_V1) {
  const owners = ownership.get(prototypeId) ?? [];
  assert(owners.length === 1, `${prototypeId}: expected exactly one candidate authority owner, found ${owners.join(",") || "none"}.`);
}
assert(ownership.size === FGC_001_EXECUTABLE_PROTOTYPES_V1.length, "FGC candidate ownership contains an unknown prototype.");

const structural = FGC_001_CANDIDATE_AUTHORITIES_V1.find((authority) => authority.candidateId === "FGC-CAND-A-STRUCTURAL-CONTINUITY")!;
assert(structural.executablePrototypes.length === 4, "Structural continuity candidate must merge P01-P04 rather than allocate representation-level QLs.");

const feature = FGC_001_CANDIDATE_AUTHORITIES_V1.find((authority) => authority.candidateId === "FGC-CAND-B-FEATURE-PROPERTY-COMPLETION")!;
assert(feature.executablePrototypes.includes("FGC-PROT-05-COMPOUND-CONTOUR-MARKER"), "Feature/property candidate must own P05.");
assert(feature.knownRepresentationGaps.some((gap) => gap.includes("component-count/orientation")), "Feature/property source gap must remain explicit.");

const symmetry = FGC_001_CANDIDATE_AUTHORITIES_V1.find((authority) => authority.candidateId === "FGC-CAND-C-QUADRANT-SYMMETRY")!;
assert(symmetry.executablePrototypes.includes("FGC-PROT-06-QUADRANT-MIRROR-SYMMETRY"), "Quadrant symmetry candidate must own P06.");
assert(symmetry.executablePrototypes.includes("FGC-PROT-08-ARC-QUADRANT-SYMMETRY"), "Arc representation stress P08 must merge into P06 reasoning authority.");

const compound = FGC_001_CANDIDATE_AUTHORITIES_V1.find((authority) => authority.candidateId === "FGC-CAND-D-COMPOUND-SYMMETRY-STATE")!;
assert(compound.executablePrototypes.length === 1 && compound.executablePrototypes[0] === "FGC-PROT-07-MIRROR-STATE-REVERSAL", "Compound symmetry/state candidate must retain P07 as a distinct reasoning authority candidate.");

assert(FGC_001_MERGE_SPLIT_GOVERNANCE_V1.permanentQlCount === 0, "FGC merge/split proposal must allocate zero permanent QLs.");
assert(!FGC_001_MERGE_SPLIT_GOVERNANCE_V1.nextSpatialQlCoordinateReserved, "SPA-QL-031 must remain unreserved.");
assert(FGC_001_MERGE_SPLIT_GOVERNANCE_V1.proposedFirstCoordinateIfLaterApproved === "SPA-QL-031", "FGC later coordinate proposal must begin at the next free Spatial coordinate only if approved.");
assert(FGC_001_MERGE_SPLIT_GOVERNANCE_V1.sourcePosture.SSC.includes("NOT_FULLY_SATURATED"), "FGC SSC source posture must not overclaim saturation.");
assert(FGC_001_MERGE_SPLIT_GOVERNANCE_V1.sourcePosture.Banking === "NOT_ESTABLISHED", "FGC Banking source posture must remain unestablished.");
assert(FGC_001_MERGE_SPLIT_GOVERNANCE_V1.sourcePosture.PunjabState === "NOT_ESTABLISHED", "FGC Punjab-state source posture must remain unestablished.");
assert(!FGC_001_MERGE_SPLIT_GOVERNANCE_V1.lifecycle.questionStudioDiscoverable, "FGC Question Studio must remain off at merge/split proposal stage.");
assert(!FGC_001_MERGE_SPLIT_GOVERNANCE_V1.lifecycle.questionBankWritable, "FGC Question Bank writes must remain off at merge/split proposal stage.");
assert(!FGC_001_MERGE_SPLIT_GOVERNANCE_V1.lifecycle.testEligible, "FGC test eligibility must remain off at merge/split proposal stage.");
assert(!FGC_001_MERGE_SPLIT_GOVERNANCE_V1.lifecycle.publiclyPublishable, "FGC publication must remain off at merge/split proposal stage.");
assert(FGC_001_MERGE_SPLIT_GOVERNANCE_V1.allocationGate.includes("BLOCKED"), "FGC permanent allocation gate must remain blocked.");

console.log(JSON.stringify({
  status: "PASS_FGC_001_MERGE_SPLIT_PROPOSAL_V1",
  executablePrototypes: FGC_001_EXECUTABLE_PROTOTYPES_V1.length,
  candidateAuthorities: FGC_001_CANDIDATE_AUTHORITIES_V1.map((authority) => ({
    candidateId: authority.candidateId,
    prototypeCount: authority.executablePrototypes.length,
    prototypes: authority.executablePrototypes,
    representationGaps: authority.knownRepresentationGaps,
  })),
  permanentQlCount: FGC_001_MERGE_SPLIT_GOVERNANCE_V1.permanentQlCount,
  proposedFirstCoordinateIfLaterApproved: FGC_001_MERGE_SPLIT_GOVERNANCE_V1.proposedFirstCoordinateIfLaterApproved,
  allocationGate: FGC_001_MERGE_SPLIT_GOVERNANCE_V1.allocationGate,
}, null, 2));
