import {
  MAL_CP001_FREEZE_CANDIDATE_IDS,
  MAL_CP001_FREEZE_CLASSIFICATION,
} from "./foundation/cp001-freeze-candidate-ledger";
import {
  MAL_CP001_ALLOCATION_RECOMMENDATIONS,
} from "./foundation/cp001-allocation-recommendation";
import {
  MAL_CP001_APPROVED_SCOPE_PROTOTYPE_IDS,
  MAL_CP001_CANDIDATE_PRODUCT_APPROVALS,
  MAL_CP001_CP002_REFERRED_PROTOTYPE_IDS,
  MAL_CP001_DEFERRED_PROTOTYPE_IDS,
  MAL_CP001_HELD_PROTOTYPE_IDS,
  MAL_CP001_PRODUCT_APPROVAL_METADATA,
  MAL_CP001_PROTOTYPE_PRODUCT_APPROVALS,
} from "./foundation/cp001-product-approval";
import {
  buildMalCp001FreezeReviewModel,
} from "./foundation/cp001-freeze-review-model";

function fail(message: string): never {
  throw new Error(message);
}

if (MAL_CP001_CANDIDATE_PRODUCT_APPROVALS.length !== 8) {
  fail(`Expected 8 candidate decisions, received ${MAL_CP001_CANDIDATE_PRODUCT_APPROVALS.length}.`);
}

const candidateIds = MAL_CP001_CANDIDATE_PRODUCT_APPROVALS.map(
  (entry) => entry.freezeCandidateId,
);
if (new Set(candidateIds).size !== candidateIds.length) {
  fail("Product approval ledger contains duplicate candidate decisions.");
}
for (const freezeCandidateId of MAL_CP001_FREEZE_CANDIDATE_IDS) {
  if (!candidateIds.includes(freezeCandidateId)) {
    fail(`Missing product decision for ${freezeCandidateId}.`);
  }
}

const recommendationByCandidate = new Map(
  MAL_CP001_ALLOCATION_RECOMMENDATIONS.map((entry) => [
    entry.freezeCandidateId,
    entry.recommendation,
  ]),
);

const expectedDecisionByRecommendation = {
  READY_AFTER_HUMAN_REVIEW: "APPROVED_FIRST_ALLOCATION_SCOPE",
  READY_AFTER_HUMAN_REVIEW_WITH_VARIANT_DEFERRED:
    "APPROVED_WITH_VARIANT_DEFERRED",
  HOLD_FOR_DIRECT_SOURCE_OR_EXPLICIT_PRODUCT_ACCEPTANCE:
    "HELD_FOR_SOURCE_OR_EXPLICIT_ACCEPTANCE",
  DEFER_FROM_CP001_REFER_CP002: "DEFERRED_FROM_CP001_REFER_CP002",
} as const;

const candidateDecisionCounts = new Map<string, number>();
for (const approval of MAL_CP001_CANDIDATE_PRODUCT_APPROVALS) {
  const recommendation = recommendationByCandidate.get(approval.freezeCandidateId);
  if (!recommendation) {
    fail(`${approval.freezeCandidateId} has no preceding allocation recommendation.`);
  }
  if (approval.decision !== expectedDecisionByRecommendation[recommendation]) {
    fail(
      `${approval.freezeCandidateId} approval ${approval.decision} disagrees with recommendation ${recommendation}.`,
    );
  }
  candidateDecisionCounts.set(
    approval.decision,
    (candidateDecisionCounts.get(approval.decision) ?? 0) + 1,
  );
}

const expectedCandidateDecisionCounts: Record<string, number> = {
  APPROVED_FIRST_ALLOCATION_SCOPE: 5,
  APPROVED_WITH_VARIANT_DEFERRED: 1,
  HELD_FOR_SOURCE_OR_EXPLICIT_ACCEPTANCE: 1,
  DEFERRED_FROM_CP001_REFER_CP002: 1,
};
for (const [decision, expected] of Object.entries(expectedCandidateDecisionCounts)) {
  const actual = candidateDecisionCounts.get(decision) ?? 0;
  if (actual !== expected) {
    fail(`${decision}: expected ${expected}, received ${actual}.`);
  }
}

const classifiedByPrototype = new Map(
  MAL_CP001_FREEZE_CLASSIFICATION.map((entry) => [entry.prototypeId, entry]),
);
const prototypeIds = MAL_CP001_PROTOTYPE_PRODUCT_APPROVALS.map(
  (entry) => entry.prototypeId,
);
if (prototypeIds.length !== MAL_CP001_FREEZE_CLASSIFICATION.length) {
  fail(
    `Expected ${MAL_CP001_FREEZE_CLASSIFICATION.length} prototype decisions, received ${prototypeIds.length}.`,
  );
}
if (new Set(prototypeIds).size !== prototypeIds.length) {
  fail("Product approval ledger contains duplicate prototype decisions.");
}
for (const approval of MAL_CP001_PROTOTYPE_PRODUCT_APPROVALS) {
  const classification = classifiedByPrototype.get(approval.prototypeId);
  if (!classification) {
    fail(`Unknown approved-scope prototype ${approval.prototypeId}.`);
  }
  if (classification.freezeCandidateId !== approval.freezeCandidateId) {
    fail(`${approval.prototypeId} is attached to the wrong freeze candidate.`);
  }
  if (approval.reviewRowCountInScope !== 4) {
    fail(`${approval.prototypeId} must retain the four-row review sample in scope.`);
  }
}

const prototypeDecisionCounts = new Map<string, number>();
for (const approval of MAL_CP001_PROTOTYPE_PRODUCT_APPROVALS) {
  prototypeDecisionCounts.set(
    approval.decision,
    (prototypeDecisionCounts.get(approval.decision) ?? 0) + 1,
  );
}

if (MAL_CP001_APPROVED_SCOPE_PROTOTYPE_IDS.length !== 12) {
  fail(
    `Expected 12 prototypes in the approved first-allocation scope, received ${MAL_CP001_APPROVED_SCOPE_PROTOTYPE_IDS.length}.`,
  );
}
if (
  MAL_CP001_DEFERRED_PROTOTYPE_IDS.length !== 1 ||
  MAL_CP001_DEFERRED_PROTOTYPE_IDS[0] !==
    "MAL-CP001-PROT-DIFFERENCE-BASED-QUANTITIES"
) {
  fail("The difference-as-scale prototype must be the sole deferred variant.");
}
if (
  MAL_CP001_HELD_PROTOTYPE_IDS.length !== 1 ||
  MAL_CP001_HELD_PROTOTYPE_IDS[0] !== "MAL-CP001-PROT-TWO-STAGE-UNKNOWN"
) {
  fail("The inverse two-stage prototype must remain the sole held prototype.");
}
if (
  MAL_CP001_CP002_REFERRED_PROTOTYPE_IDS.length !== 1 ||
  MAL_CP001_CP002_REFERRED_PROTOTYPE_IDS[0] !==
    "MAL-CP001-PROT-THREE-WAY-TARGET-WITH-RELATION"
) {
  fail("The three-way relation prototype must remain referred to CP-002.");
}

const reviewModel = buildMalCp001FreezeReviewModel();
let approvedScopeReviewRows = 0;
let deferredReviewRows = 0;
let heldReviewRows = 0;
let referredReviewRows = 0;
for (const candidateGroup of reviewModel.candidateGroups) {
  if (candidateGroup.humanReviewStatus !== "PENDING") {
    fail(`${candidateGroup.freezeCandidateId} fabricated row-level human approval.`);
  }
  for (const prototypeGroup of candidateGroup.prototypeGroups) {
    const decision = MAL_CP001_PROTOTYPE_PRODUCT_APPROVALS.find(
      (entry) => entry.prototypeId === prototypeGroup.prototypeId,
    );
    if (!decision) fail(`Missing decision for ${prototypeGroup.prototypeId}.`);
    for (const row of prototypeGroup.questions) {
      if (row.humanReviewStatus !== "PENDING") {
        fail(`${row.reviewKey} fabricated individual question approval.`);
      }
    }
    const count = prototypeGroup.questions.length;
    if (decision.decision === "IN_APPROVED_SCOPE") approvedScopeReviewRows += count;
    if (decision.decision === "DEFERRED_VARIANT") deferredReviewRows += count;
    if (decision.decision === "HELD") heldReviewRows += count;
    if (decision.decision === "REFERRED_TO_CP002") referredReviewRows += count;
  }
}

if (
  approvedScopeReviewRows !== 48 ||
  deferredReviewRows !== 4 ||
  heldReviewRows !== 4 ||
  referredReviewRows !== 4
) {
  fail(
    `Unexpected review-row scope split: ${approvedScopeReviewRows}/${deferredReviewRows}/${heldReviewRows}/${referredReviewRows}.`,
  );
}

if (
  !MAL_CP001_PRODUCT_APPROVAL_METADATA.candidateScopeApproved ||
  MAL_CP001_PRODUCT_APPROVAL_METADATA.individualQuestionRowsApproved ||
  !MAL_CP001_PRODUCT_APPROVAL_METADATA.allocationScopeFrozen ||
  MAL_CP001_PRODUCT_APPROVAL_METADATA.qlTemplateCountFrozen ||
  MAL_CP001_PRODUCT_APPROVAL_METADATA.permanentQlCount !== 0 ||
  MAL_CP001_PRODUCT_APPROVAL_METADATA.publiclyPublishable ||
  MAL_CP001_PRODUCT_APPROVAL_METADATA.questionStudioDiscoverable
) {
  fail("Product approval metadata escaped the approved-scope, non-publishing boundary.");
}

console.log(JSON.stringify({
  status: "PASS_PRODUCT_APPROVAL_SCOPE_FROZEN_QL_EXPANSION_OPEN",
  approvalAuthority: MAL_CP001_PRODUCT_APPROVAL_METADATA.approvalAuthority,
  approvalDate: MAL_CP001_PRODUCT_APPROVAL_METADATA.approvalDate,
  candidateDecisionCounts: Object.fromEntries(
    [...candidateDecisionCounts.entries()].sort(),
  ),
  prototypeDecisionCounts: Object.fromEntries(
    [...prototypeDecisionCounts.entries()].sort(),
  ),
  approvedCandidateCount:
    (candidateDecisionCounts.get("APPROVED_FIRST_ALLOCATION_SCOPE") ?? 0) +
    (candidateDecisionCounts.get("APPROVED_WITH_VARIANT_DEFERRED") ?? 0),
  approvedScopePrototypeCount: MAL_CP001_APPROVED_SCOPE_PROTOTYPE_IDS.length,
  approvedScopeReviewRows,
  deferredReviewRows,
  heldReviewRows,
  referredReviewRows,
  individualQuestionRowsApproved:
    MAL_CP001_PRODUCT_APPROVAL_METADATA.individualQuestionRowsApproved,
  qlTemplateCountFrozen:
    MAL_CP001_PRODUCT_APPROVAL_METADATA.qlTemplateCountFrozen,
  permanentQlCount: MAL_CP001_PRODUCT_APPROVAL_METADATA.permanentQlCount,
  firstAllocationScopeReadyForQlExpansion: true,
  publiclyPublishable: MAL_CP001_PRODUCT_APPROVAL_METADATA.publiclyPublishable,
  questionStudioDiscoverable:
    MAL_CP001_PRODUCT_APPROVAL_METADATA.questionStudioDiscoverable,
}, null, 2));
