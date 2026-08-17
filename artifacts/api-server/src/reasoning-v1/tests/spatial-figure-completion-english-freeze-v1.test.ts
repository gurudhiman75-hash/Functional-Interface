import { FGC_001_ENGLISH_FREEZE_AUTHORITY_V1 } from "../foundation/spatial/figure-completion-english-freeze-v1";
import {
  SPATIAL_FGC_PERMANENT_QL_ALLOCATIONS_V2,
  SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V2,
} from "../foundation/spatial/spatial-permanent-ql-allocation-v2";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const freeze = FGC_001_ENGLISH_FREEZE_AUTHORITY_V1;

assert(freeze.status === "ENGLISH_PERMANENT_RUNTIME_FROZEN", "FGC English freeze status drifted.");
assert(freeze.permanentQlRange === "SPA-QL-031..SPA-QL-034", "FGC English freeze QL range drifted.");
assert(freeze.permanentQlCount === 4, "FGC English freeze must cover exactly four permanent QLs.");
assert(freeze.nextAvailableSpatialQlId === "SPA-QL-035", "FGC English freeze must leave SPA-QL-035 next available.");
assert(freeze.frozenBaseSpatialAuthorityId === SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V2.frozenBaseAuthorityId, "FGC English freeze must preserve the frozen P0 base authority.");

assert(freeze.exactReviewedAuthority.headSha === "e15ae1a64917f397fd9767aaf29588677054c21f", "FGC English freeze reviewed head drifted.");
assert(freeze.exactReviewedAuthority.workflowRunId === 32009278720, "FGC English freeze workflow run drifted.");
assert(freeze.exactReviewedAuthority.artifactId === 9281170371, "FGC English freeze artifact drifted.");
assert(freeze.exactReviewedAuthority.artifactDigest === "sha256:9e2acb8f13355afc59f9ecd01276e7086855e410186bb456e8e4eed340f77135", "FGC English freeze artifact digest drifted.");
assert(freeze.exactReviewedAuthority.permanentRuntimeProofQuestions === 320, "FGC English freeze must pin the 320-question permanent runtime proof.");
assert(freeze.exactReviewedAuthority.retainedLearnerReviewQuestions === 48, "FGC English freeze must pin the 48-question learner review pack.");
assert(freeze.exactReviewedAuthority.approximateMobileOptionPixels === 104, "FGC English freeze must preserve mobile review size.");
assert(freeze.exactReviewedAuthority.reviewVerdict === "APPROVED_NO_REMAINING_ENGLISH_LEARNER_BLOCKER", "FGC English freeze requires clean learner-facing review.");

assert(freeze.qls.length === 4, "FGC English freeze QL list must contain four entries.");
assert(JSON.stringify(freeze.qls.map((entry) => entry.qlId)) === JSON.stringify(SPATIAL_FGC_PERMANENT_QL_ALLOCATIONS_V2.map((entry) => entry.permanentQlId)), "FGC English freeze must cover the exact permanent allocation order.");
assert(freeze.qls.every((entry) => entry.englishRuntimeImplemented && entry.englishImplementationFrozen), "Every FGC permanent QL must be runtime-implemented and English-frozen.");

const proof = freeze.proofGuarantees;
assert(proof.tenRepresentationsCompressedIntoFourReasoningAuthorities, "FGC anti-duplication guarantee missing.");
assert(proof.exactlyFourPermanentQls, "FGC exact-four-QL guarantee missing.");
assert(proof.eightyUniqueSemanticQuestionsPerQl, "FGC 80 unique questions per QL guarantee missing.");
assert(proof.totalUniquePermanentEnglishQuestions === 320, "FGC total unique English runtime guarantee drifted.");
assert(proof.exactAnswerSlotBalancePerQl, "FGC answer-slot balance guarantee missing.");
assert(proof.deterministicReplay, "FGC deterministic replay guarantee missing.");
assert(proof.semanticOptionUniqueness && proof.perceptualOptionUniqueness && proof.uniqueAnswerOracle, "FGC option/answer validity guarantees missing.");
assert(proof.mobileMinimumOptionPixels === 104, "FGC mobile minimum guarantee drifted.");
assert(proof.studentSpecificExplanationChecks, "FGC student-specific explanation guarantee missing.");
assert(proof.genericVisibleStateWordingRejected && proof.genericAllRulesWordingRejected, "FGC generic explanation wording must stay rejected.");
assert(proof.p09RuleLearnerDerivableFromVisibleReferenceMotifs, "FGC P09 visible-rule guarantee missing.");
assert(proof.p10IndependentContactPartnersSeparated, "FGC P10 independent-feature guarantee missing.");
assert(proof.frozenP0AllocationPreserved, "FGC P0 preservation guarantee missing.");

assert(freeze.sourceScope.SSC.status === "CONTROLLED_TAXONOMY_SATURATED_FOR_CURRENT_FGC_SCOPE", "FGC SSC source posture drifted.");
assert(freeze.sourceScope.Banking.status === "NOT_ESTABLISHED_FOR_FGC_001", "FGC Banking source posture must remain unestablished.");
assert(freeze.sourceScope.PunjabState.status === "DIRECT_FGC_EVIDENCE_PRESENT_RULE_CLASSIFICATION_PENDING", "FGC Punjab-state source posture drifted.");

assert(freeze.lifecycle.englishRuntimeImplemented && freeze.lifecycle.englishImplementationFrozen, "FGC English lifecycle must be implemented and frozen.");
assert(!freeze.lifecycle.questionStudioDiscoverable, "FGC Question Studio must remain off after English freeze.");
assert(freeze.lifecycle.questionStudioRegistrationStatus === "NOT_REGISTERED", "FGC must remain unregistered after English freeze.");
assert(!freeze.lifecycle.persistenceAllowed && !freeze.lifecycle.questionBankWritable, "FGC persistence/QB writes must remain off after English freeze.");
assert(!freeze.lifecycle.testEligible && !freeze.lifecycle.publiclyPublishable, "FGC tests/publication must remain off after English freeze.");
assert(!freeze.lifecycle.hindiPunjabiGeneration, "FGC Hindi/Punjabi generation must remain off until localization gate.");
assert(freeze.nextGate === "FGC_001_HINDI_PUNJABI_LOCALIZATION_AND_REVIEW", "FGC next gate must be multilingual localization/review.");

console.log(JSON.stringify({
  status: "PASS_FGC_001_ENGLISH_FREEZE_V1",
  authorityId: freeze.authorityId,
  permanentQlRange: freeze.permanentQlRange,
  exactReviewedAuthority: freeze.exactReviewedAuthority,
  sourceScope: {
    SSC: freeze.sourceScope.SSC.status,
    Banking: freeze.sourceScope.Banking.status,
    PunjabState: freeze.sourceScope.PunjabState.status,
  },
  lifecycle: freeze.lifecycle,
  nextGate: freeze.nextGate,
}, null, 2));
