import {
  MAL_CP001_FREEZE_CANDIDATE_IDS,
} from "./foundation/cp001-freeze-candidate-ledger";
import {
  MAL_CP001_ALLOCATION_RECOMMENDATIONS,
} from "./foundation/cp001-allocation-recommendation";
import {
  getMalCp001SourceFixtureLedgerEntry,
} from "./foundation/cp001-source-fixture-ledger";
import {
  MAL_CP001_SOURCE_RECOVERY_FINDINGS,
} from "./foundation/cp001-source-recovery-ledger";
import {
  buildMalCp001FreezeReviewModel,
} from "./foundation/cp001-freeze-review-model";

function fail(message: string): never {
  throw new Error(message);
}

if (MAL_CP001_ALLOCATION_RECOMMENDATIONS.length !== 8) {
  fail(`Expected 8 recommendation rows, received ${MAL_CP001_ALLOCATION_RECOMMENDATIONS.length}.`);
}

const recommendationIds = MAL_CP001_ALLOCATION_RECOMMENDATIONS.map(
  (entry) => entry.freezeCandidateId,
);
if (new Set(recommendationIds).size !== recommendationIds.length) {
  fail("Allocation recommendation ledger contains duplicate candidate rows.");
}
for (const candidateId of MAL_CP001_FREEZE_CANDIDATE_IDS) {
  if (!recommendationIds.includes(candidateId)) {
    fail(`Missing allocation recommendation for ${candidateId}.`);
  }
}

const dispositionCounts = new Map<string, number>();
for (const entry of MAL_CP001_ALLOCATION_RECOMMENDATIONS) {
  const source = getMalCp001SourceFixtureLedgerEntry(entry.freezeCandidateId);
  if (entry.sourceReadiness !== source.readiness) {
    fail(`${entry.freezeCandidateId} recommendation disagrees with the source ledger.`);
  }
  if (
    entry.humanReviewStatus !== "PENDING" ||
    entry.permanentQlId !== null ||
    entry.currentlyAllocationEligible ||
    entry.publiclyPublishable ||
    entry.questionStudioDiscoverable
  ) {
    fail(`${entry.freezeCandidateId} escaped the non-allocating recommendation boundary.`);
  }
  dispositionCounts.set(
    entry.recommendation,
    (dispositionCounts.get(entry.recommendation) ?? 0) + 1,
  );
}

const expectedCounts: Record<string, number> = {
  READY_AFTER_HUMAN_REVIEW: 5,
  READY_AFTER_HUMAN_REVIEW_WITH_VARIANT_DEFERRED: 1,
  HOLD_FOR_DIRECT_SOURCE_OR_EXPLICIT_PRODUCT_ACCEPTANCE: 1,
  DEFER_FROM_CP001_REFER_CP002: 1,
};
for (const [recommendation, expected] of Object.entries(expectedCounts)) {
  const actual = dispositionCounts.get(recommendation) ?? 0;
  if (actual !== expected) {
    fail(`${recommendation}: expected ${expected}, received ${actual}.`);
  }
}

const ratioScale = MAL_CP001_ALLOCATION_RECOMMENDATIONS.find(
  (entry) => entry.freezeCandidateId === "MAL-CP001-FREEZE-QUANTITIES-FROM-RATIO-SCALE",
);
if (
  !ratioScale ||
  ratioScale.recommendation !== "READY_AFTER_HUMAN_REVIEW_WITH_VARIANT_DEFERRED" ||
  !ratioScale.deferredPrototypeScope?.includes("Difference-as-scale")
) {
  fail("Difference-scale variant was not explicitly deferred inside the supported ratio-scale contract.");
}

const twoStageInverse = MAL_CP001_ALLOCATION_RECOMMENDATIONS.find(
  (entry) => entry.freezeCandidateId === "MAL-CP001-FREEZE-TWO-STAGE-UNKNOWN-QUANTITY",
);
if (
  !twoStageInverse ||
  twoStageInverse.recommendation !== "HOLD_FOR_DIRECT_SOURCE_OR_EXPLICIT_PRODUCT_ACCEPTANCE"
) {
  fail("Two-stage inverse must remain held rather than silently promoted from analogous evidence.");
}

const threeWay = MAL_CP001_ALLOCATION_RECOMMENDATIONS.find(
  (entry) => entry.freezeCandidateId === "MAL-CP001-FREEZE-THREE-WAY-RELATION-QUANTITY",
);
const recovery = MAL_CP001_SOURCE_RECOVERY_FINDINGS.find(
  (entry) => entry.freezeCandidateId === "MAL-CP001-FREEZE-THREE-WAY-RELATION-QUANTITY",
);
if (
  !threeWay ||
  threeWay.recommendation !== "DEFER_FROM_CP001_REFER_CP002" ||
  !recovery ||
  recovery.ownershipVerdict !== "MAL-CP-002" ||
  recovery.clearsCp001SourceBlocker
) {
  fail("Three-way candidate must remain deferred from CP-001 and referred to the CP-002 boundary.");
}

const reviewModel = buildMalCp001FreezeReviewModel();
if (reviewModel.humanReviewStatus !== "PENDING") {
  fail("Allocation recommendations cannot proceed after fabricated human approval.");
}
if (reviewModel.permanentQlCount !== 0) {
  fail("Permanent QLs appeared before the allocation recommendation gate closed.");
}
for (const candidateGroup of reviewModel.candidateGroups) {
  if (candidateGroup.humanReviewStatus !== "PENDING") {
    fail(`${candidateGroup.freezeCandidateId} has a non-pending product-review status.`);
  }
}

console.log(JSON.stringify({
  status: "PASS_NON_ALLOCATING_RECOMMENDATION",
  candidateCount: MAL_CP001_ALLOCATION_RECOMMENDATIONS.length,
  recommendationCounts: Object.fromEntries([...dispositionCounts.entries()].sort()),
  readyAfterHumanReviewCount: dispositionCounts.get("READY_AFTER_HUMAN_REVIEW") ?? 0,
  readyWithVariantDeferredCount:
    dispositionCounts.get("READY_AFTER_HUMAN_REVIEW_WITH_VARIANT_DEFERRED") ?? 0,
  heldForSourceOrProductDecisionCount:
    dispositionCounts.get("HOLD_FOR_DIRECT_SOURCE_OR_EXPLICIT_PRODUCT_ACCEPTANCE") ?? 0,
  deferredToCp002BoundaryCount:
    dispositionCounts.get("DEFER_FROM_CP001_REFER_CP002") ?? 0,
  actualHumanApprovals: 0,
  permanentQlCount: reviewModel.permanentQlCount,
  allocationReady: false,
  publiclyPublishable: reviewModel.publiclyPublishable,
  questionStudioDiscoverable: reviewModel.questionStudioDiscoverable,
}, null, 2));
