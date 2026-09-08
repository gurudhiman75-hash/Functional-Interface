import assert from "node:assert/strict";

import {
  evaluateSelectedApprovalCensus,
  SELECTED_APPROVAL_CENSUS_VERSION,
} from "./selected-approval-census";

assert.equal(SELECTED_APPROVAL_CENSUS_VERSION, "ca-cp070-selection-aware-approval-census-v1");

const ids = [
  "11111111-1111-4111-8111-111111111111",
  "22222222-2222-4222-8222-222222222222",
];

const broadReviewSelectedClosed = evaluateSelectedApprovalCensus({
  broadCensus: {
    status: "review",
    coverageConfidenceScore: 76,
    blockers: [],
    warnings: [
      "17 high-priority target-date event/discovery gap(s) remain",
      "40 actionable clusters remain unresolved",
    ],
  },
  selectedHeadlineCount: 3,
  resolvedSelectedHeadlineCount: 3,
  liveSelectedEventIds: [ids[1]!, ids[0]!, ids[0]!],
  storedPackEventIds: ids,
});
assert.equal(broadReviewSelectedClosed.status, "complete");
assert.deepEqual(broadReviewSelectedClosed.blockers, []);
assert.equal(broadReviewSelectedClosed.selectedHeadlineCount, 3);
assert.equal(broadReviewSelectedClosed.resolvedSelectedHeadlineCount, 3);
assert.equal(broadReviewSelectedClosed.selectedEventCount, 2);
assert.equal(broadReviewSelectedClosed.storedPackEventCount, 2);
assert.equal(broadReviewSelectedClosed.broadCensusStatus, "review");
assert.equal(broadReviewSelectedClosed.broadCoverageConfidenceScore, 76);
assert.equal(broadReviewSelectedClosed.warnings.length, 1);
assert.match(broadReviewSelectedClosed.warnings[0] ?? "", /does not block an otherwise closed admin-selected pack/i);

const hardBroadBlocker = evaluateSelectedApprovalCensus({
  broadCensus: {
    status: "blocked",
    coverageConfidenceScore: 40,
    blockers: ["No target-date source candidates were discovered."],
    warnings: [],
  },
  selectedHeadlineCount: 2,
  resolvedSelectedHeadlineCount: 2,
  liveSelectedEventIds: ids,
  storedPackEventIds: ids,
});
assert.equal(hardBroadBlocker.status, "blocked");
assert.match(hardBroadBlocker.blockers.join(" "), /cannot override discovery failures/i);

const unresolvedSelection = evaluateSelectedApprovalCensus({
  broadCensus: {
    status: "review",
    coverageConfidenceScore: 76,
    blockers: [],
    warnings: [],
  },
  selectedHeadlineCount: 3,
  resolvedSelectedHeadlineCount: 2,
  liveSelectedEventIds: ids,
  storedPackEventIds: ids,
});
assert.equal(unresolvedSelection.status, "blocked");
assert.match(unresolvedSelection.blockers.join(" "), /1 manually selected headline/i);

const staleStoredPack = evaluateSelectedApprovalCensus({
  broadCensus: {
    status: "review",
    coverageConfidenceScore: 76,
    blockers: [],
    warnings: [],
  },
  selectedHeadlineCount: 2,
  resolvedSelectedHeadlineCount: 2,
  liveSelectedEventIds: ids,
  storedPackEventIds: [ids[0]!],
});
assert.equal(staleStoredPack.status, "blocked");
assert.match(staleStoredPack.blockers.join(" "), /stored canonical pack membership is stale/i);

const missingBroadCensus = evaluateSelectedApprovalCensus({
  broadCensus: null,
  selectedHeadlineCount: 2,
  resolvedSelectedHeadlineCount: 2,
  liveSelectedEventIds: ids,
  storedPackEventIds: ids,
});
assert.equal(missingBroadCensus.status, "blocked");
assert.match(missingBroadCensus.blockers.join(" "), /broad target-date discovery census has not been materialized/i);

console.log("Current Affairs CP-070 selection-aware approval census contracts passed");
