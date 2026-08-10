import { buildSea001SaturationCorpus, selectManualReviewCorpus } from "./saturation/corpus.ts";
import { buildPendingSea001ManualReviewLedger } from "./review/manual-review.ts";
import {
  assessSea001AllocationReadiness,
  assertSea001PermanentAllocationPrerequisites,
} from "./review/readiness.ts";

const saturation = buildSea001SaturationCorpus(40);
const reviewCorpus = selectManualReviewCorpus(saturation.caselets, 5);
const pendingLedger = buildPendingSea001ManualReviewLedger(reviewCorpus);
const readiness = assessSea001AllocationReadiness({
  saturationCorpus: saturation.caselets,
  reviewCorpus,
  reviewLedger: pendingLedger,
});

if (!readiness.technicalAndSourceGatesPassed) {
  throw new Error("SEA-001 automated/source gates should pass before manual review handoff");
}
if (readiness.nonManualGovernanceBlockerCount !== 0) {
  throw new Error(`SEA-001 unexpectedly has ${readiness.nonManualGovernanceBlockerCount} non-manual governance blockers`);
}
if (readiness.manualReview.expectedCaselets !== 100
  || readiness.manualReview.pendingCount !== 100
  || readiness.manualReview.complete
  || readiness.manualReview.freezeEligible) {
  throw new Error(`Pending SEA-001 review ledger has an invalid state: ${JSON.stringify(readiness.manualReview)}`);
}
if (readiness.permanentAllocationEligible
  || readiness.solveInventoryFreezeEligible
  || readiness.queryMixFreezeEligible
  || readiness.englishFreezeEligible
  || readiness.activationEligible) {
  throw new Error("SEA-001 became eligible for allocation/freeze before manual English review completion");
}
let blocked = false;
try {
  assertSea001PermanentAllocationPrerequisites(readiness);
} catch (error) {
  blocked = /permanent allocation remains locked/.test(String(error));
}
if (!blocked) throw new Error("SEA-001 permanent allocation prerequisite guard did not block a pending review ledger");

console.log("PASS_SEA_001_REVIEW_READINESS_GUARD");
console.log("review caselets", readiness.manualReview.expectedCaselets);
console.log("pending decisions", readiness.manualReview.pendingCount);
console.log("automated/source gates", readiness.technicalAndSourceGatesPassed);
console.log("non-manual governance blockers", readiness.nonManualGovernanceBlockerCount);
console.log("permanent allocation eligible", readiness.permanentAllocationEligible);
console.log("activation eligible", readiness.activationEligible);
console.log("permanent QLs", 0);
