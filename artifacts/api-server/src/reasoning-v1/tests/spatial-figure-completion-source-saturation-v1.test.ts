import { FGC_001_SOURCE_SATURATION_AUTHORITY_V1 } from "../foundation/spatial/figure-completion-source-saturation-v1";
import {
  FGC_001_CANDIDATE_AUTHORITIES_V1,
  FGC_001_EXECUTABLE_PROTOTYPES_V1,
} from "../foundation/spatial/figure-completion-merge-split-proposal-v1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const authority = FGC_001_SOURCE_SATURATION_AUTHORITY_V1;

assert(authority.status === "READY_FOR_SCOPED_PERMANENT_QL_PROPOSAL", "FGC source saturation must only unlock a scoped permanent-QL proposal.");
assert(authority.humanReviewedAuthority.headSha === "1c14d6b54b53622c09285436fec50ded0ecae22e", "FGC human-reviewed head drifted.");
assert(authority.humanReviewedAuthority.workflowRunId === 32007652999, "FGC human-reviewed workflow run drifted.");
assert(authority.humanReviewedAuthority.artifactId === 9280591062, "FGC human-reviewed artifact drifted.");
assert(authority.humanReviewedAuthority.artifactDigest === "sha256:f1237905665b9b19ffce00efdf5990b56c3e2c5c8546a6e3d6f9cd3dbacab3dc", "FGC human-reviewed artifact digest drifted.");
assert(authority.humanReviewedAuthority.generatedQuestionProofCount === 800, "FGC saturation gate must retain all 800 generated discovery questions.");
assert(authority.humanReviewedAuthority.learnerReviewQuestionCount === 80, "FGC saturation gate must pin the full 80-question retained learner review surface.");
assert(authority.humanReviewedAuthority.mobileReviewApproxOptionPx === 104, "FGC mobile review scale must remain explicit.");
assert(authority.humanReviewedAuthority.directHumanVerdict === "NO_REMAINING_LEARNER_VISIBLE_BLOCKER", "FGC human review must be clean before source saturation.");

assert(FGC_001_EXECUTABLE_PROTOTYPES_V1.length === 10, "FGC source saturation expects ten executable prototypes.");
assert(FGC_001_CANDIDATE_AUTHORITIES_V1.length === 4, "FGC source saturation expects four anti-duplicated candidate authorities.");
assert(authority.taxonomy.executablePrototypeCount === 10, "FGC saturation prototype count drifted.");
assert(authority.taxonomy.candidateAuthorityCount === 4, "FGC saturation authority count drifted.");
assert(authority.taxonomy.permanentQlCountAtThisGate === 0, "Source saturation gate itself must not allocate permanent QLs.");
assert(authority.taxonomy.knownExecutableRepresentationGaps === 0, "Known executable FGC representation gaps must be closed before proposal.");
assert(!authority.taxonomy.fifthReasoningIdentityFoundInControlledSscExpansion, "A fifth FGC reasoning identity would invalidate the four-authority proposal.");
assert(authority.taxonomy.antiDuplicationDecision.includes("FOUR_REASONING_AUTHORITIES"), "FGC anti-duplication decision missing.");

assert(authority.sourceScope.SSC.status === "CONTROLLED_TAXONOMY_SATURATED_FOR_CURRENT_FGC_SCOPE", "FGC SSC taxonomy must be saturated for the controlled current scope.");
assert(authority.sourceScope.SSC.directFamiliesCovered.length >= 7, "FGC SSC source families are underspecified.");
assert(authority.sourceScope.SSC.anchors.length >= 5, "FGC SSC previous-paper anchor set is too small for the saturation decision.");
assert(authority.sourceScope.SSC.claimBoundary.includes("not to every historical SSC image representation"), "FGC SSC saturation claim must remain bounded.");
assert(authority.sourceScope.Banking.status === "NOT_ESTABLISHED_FOR_FGC_001", "FGC Banking source posture must not be overclaimed.");
assert(authority.sourceScope.PunjabState.status === "DIRECT_FGC_EVIDENCE_PRESENT_RULE_CLASSIFICATION_PENDING", "FGC Punjab-state posture must record direct evidence without invented rule classification.");
assert(authority.sourceScope.PunjabState.anchors.length >= 1, "FGC Punjab-state direct evidence anchor missing.");
assert(authority.sourceScope.PunjabState.note.includes("without guessing"), "FGC Punjab rule-family boundary must be explicit.");

assert(authority.permanentQlProposal.allowed, "FGC source saturation should allow the four-coordinate permanent QL proposal.");
assert(authority.permanentQlProposal.proposedCount === 4, "FGC permanent QL proposal count must be four.");
assert(authority.permanentQlProposal.proposedFirstCoordinate === "SPA-QL-031", "FGC permanent QL proposal must start at SPA-QL-031.");
assert(authority.permanentQlProposal.allocationNotYetApplied, "Source saturation gate must not silently apply allocation.");
assert(authority.permanentQlProposal.requiredRule.includes("reasoning authority"), "FGC permanent allocation must be reasoning-authority based.");

assert(!authority.lifecycle.questionStudioDiscoverable, "FGC Question Studio must stay off at source saturation.");
assert(!authority.lifecycle.questionBankWritable, "FGC Question Bank writes must stay off at source saturation.");
assert(!authority.lifecycle.testEligible, "FGC tests must stay off at source saturation.");
assert(!authority.lifecycle.publiclyPublishable, "FGC publication must stay off at source saturation.");
assert(!authority.lifecycle.multilingualStarted, "FGC multilingual work must stay off at source saturation.");

console.log(JSON.stringify({
  status: "PASS_FGC_001_SOURCE_SATURATION_V1",
  humanReviewedHead: authority.humanReviewedAuthority.headSha,
  workflowRunId: authority.humanReviewedAuthority.workflowRunId,
  artifactId: authority.humanReviewedAuthority.artifactId,
  generatedQuestionProofCount: authority.humanReviewedAuthority.generatedQuestionProofCount,
  executablePrototypes: authority.taxonomy.executablePrototypeCount,
  candidateAuthorities: authority.taxonomy.candidateAuthorityCount,
  sourceScope: {
    SSC: authority.sourceScope.SSC.status,
    Banking: authority.sourceScope.Banking.status,
    PunjabState: authority.sourceScope.PunjabState.status,
  },
  permanentQlProposal: authority.permanentQlProposal,
}, null, 2));
