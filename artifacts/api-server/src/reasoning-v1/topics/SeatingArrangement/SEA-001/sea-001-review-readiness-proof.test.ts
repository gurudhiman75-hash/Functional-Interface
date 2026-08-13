import { buildSea001SaturationCorpus, selectManualReviewCorpus } from "./saturation/corpus.ts";
import { buildApprovedSea001ManualReviewLedger } from "./review/approved-review.ts";
import {
  assessSea001AllocationReadiness,
  assertSea001PermanentAllocationPrerequisites,
} from "./review/readiness.ts";

const saturation = buildSea001SaturationCorpus(40);
const reviewCorpus = selectManualReviewCorpus(saturation.caselets, 5);
const approvedLedger = buildApprovedSea001ManualReviewLedger(reviewCorpus);
const readiness = assessSea001AllocationReadiness({
  saturationCorpus: saturation.caselets,
  reviewCorpus,
  reviewLedger: approvedLedger,
});

if (!readiness.technicalAndSourceGatesPassed) {
  throw new Error("SEA-001 automated/source gates should pass before permanent allocation eligibility");
}
if (readiness.nonManualGovernanceBlockerCount !== 0) {
  throw new Error(`SEA-001 unexpectedly has ${readiness.nonManualGovernanceBlockerCount} non-manual governance blockers`);
}
if (readiness.manualReview.expectedCaselets !== 100
  || readiness.manualReview.acceptCount !== 100
  || readiness.manualReview.pendingCount !== 0
  || readiness.manualReview.rewriteCount !== 0
  || readiness.manualReview.rejectCount !== 0
  || readiness.manualReview.unsignedDecisionCount !== 0
  || !readiness.manualReview.complete
  || !readiness.manualReview.freezeEligible) {
  throw new Error(`Approved SEA-001 review ledger has an invalid state: ${JSON.stringify(readiness.manualReview)}`);
}
if (!readiness.permanentAllocationEligible
  || !readiness.solveInventoryFreezeEligible
  || !readiness.queryMixFreezeEligible
  || !readiness.englishFreezeEligible) {
  throw new Error("SEA-001 did not become eligible for allocation/freeze after signed English approval");
}
if (readiness.activationEligible) {
  throw new Error("SEA-001 activation must remain separately gated after English review approval");
}

assertSea001PermanentAllocationPrerequisites(readiness);

console.log("PASS_SEA_001_REVIEW_READINESS_APPROVED");
console.log("review caselets", readiness.manualReview.expectedCaselets);
console.log("accepted decisions", readiness.manualReview.acceptCount);
console.log("pending decisions", readiness.manualReview.pendingCount);
console.log("automated/source gates", readiness.technicalAndSourceGatesPassed);
console.log("non-manual governance blockers", readiness.nonManualGovernanceBlockerCount);
console.log("permanent allocation eligible", readiness.permanentAllocationEligible);
console.log("solve inventory freeze eligible", readiness.solveInventoryFreezeEligible);
console.log("query mix freeze eligible", readiness.queryMixFreezeEligible);
console.log("english freeze eligible", readiness.englishFreezeEligible);
console.log("activation eligible", readiness.activationEligible);
