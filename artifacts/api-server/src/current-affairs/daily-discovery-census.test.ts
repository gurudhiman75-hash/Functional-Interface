import assert from "node:assert/strict";

import { evaluateDailyDiscoveryCensus } from "./daily-discovery-census";

const healthy = evaluateDailyDiscoveryCensus({
  rawCandidateCount: 80,
  distinctSourceCount: 8,
  distinctSourceFamilyCount: 6,
  officialCandidateCount: 40,
  trustedNewsCandidateCount: 30,
  specialistCandidateCount: 10,
  clusterCount: 42,
  unresolvedClusterCount: 1,
  eventCount: 36,
  verifiedEventCount: 32,
  reviewEventCount: 4,
  authoringReadyCount: 29,
  highPriorityUnresolvedCount: 0,
  evidenceGrades: { A: 25, B: 7, C: 4, D: 0 },
  eventCategoryCount: 10,
});
assert.equal(healthy.status, "complete");
assert.ok(healthy.coverageConfidenceScore >= 80);
assert.equal(healthy.blockers.length, 0);

const empty = evaluateDailyDiscoveryCensus({
  rawCandidateCount: 0,
  distinctSourceCount: 0,
  distinctSourceFamilyCount: 0,
  officialCandidateCount: 0,
  trustedNewsCandidateCount: 0,
  specialistCandidateCount: 0,
  clusterCount: 0,
  unresolvedClusterCount: 0,
  eventCount: 0,
  verifiedEventCount: 0,
  reviewEventCount: 0,
  authoringReadyCount: 0,
  highPriorityUnresolvedCount: 0,
  evidenceGrades: { A: 0, B: 0, C: 0, D: 0 },
  eventCategoryCount: 0,
});
assert.equal(empty.status, "blocked");
assert.match(empty.blockers.join(" "), /No target-date source candidates/);

const narrow = evaluateDailyDiscoveryCensus({
  rawCandidateCount: 23,
  distinctSourceCount: 1,
  distinctSourceFamilyCount: 1,
  officialCandidateCount: 23,
  trustedNewsCandidateCount: 0,
  specialistCandidateCount: 0,
  clusterCount: 16,
  unresolvedClusterCount: 6,
  eventCount: 16,
  verifiedEventCount: 8,
  reviewEventCount: 8,
  authoringReadyCount: 6,
  highPriorityUnresolvedCount: 2,
  evidenceGrades: { A: 8, B: 0, C: 8, D: 0 },
  eventCategoryCount: 5,
});
assert.equal(narrow.status, "review");
assert.match(narrow.warnings.join(" "), /Discovery breadth is narrow/);
assert.match(narrow.warnings.join(" "), /No trusted-news candidates/);
assert.match(narrow.warnings.join(" "), /high-priority/);

console.log("CP-036 daily discovery census policy tests passed");
