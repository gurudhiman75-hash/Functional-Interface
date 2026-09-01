import assert from "node:assert/strict";

import {
  evaluateDailyDiscoveryCensus,
  evaluateHighYieldDiscoveryGaps,
} from "./daily-discovery-census";

const healthyInput = {
  rawCandidateCount: 80,
  distinctSourceCount: 8,
  distinctSourceFamilyCount: 6,
  officialCandidateCount: 40,
  trustedNewsCandidateCount: 30,
  specialistCandidateCount: 10,
  clusterCount: 42,
  unresolvedClusterCount: 0,
  eventCount: 36,
  verifiedEventCount: 32,
  reviewEventCount: 4,
  authoringReadyCount: 29,
  highPriorityUnresolvedCount: 0,
  evidenceGrades: { A: 25, B: 7, C: 4, D: 0 } as const,
  eventCategoryCount: 10,
};

const healthy = evaluateDailyDiscoveryCensus(healthyInput);
assert.equal(healthy.status, "complete");
assert.ok(healthy.coverageConfidenceScore >= 80);
assert.equal(healthy.blockers.length, 0);

const unresolvedEvenWithHighScore = evaluateDailyDiscoveryCensus({
  ...healthyInput,
  eventCount: 36,
  verifiedEventCount: 34,
  reviewEventCount: 2,
  authoringReadyCount: 33,
  evidenceGrades: { A: 28, B: 6, C: 2, D: 0 },
  unresolvedClusterCount: 1,
});
assert.equal(unresolvedEvenWithHighScore.status, "review");
assert.match(unresolvedEvenWithHighScore.warnings.join(" "), /cluster\(s\) remain unresolved/);

const highYieldGapEvenWithHighScore = evaluateDailyDiscoveryCensus({
  ...healthyInput,
  eventCount: 36,
  verifiedEventCount: 34,
  reviewEventCount: 2,
  authoringReadyCount: 33,
  evidenceGrades: { A: 28, B: 6, C: 2, D: 0 },
  highPriorityUnresolvedCount: 1,
});
assert.equal(highYieldGapEvenWithHighScore.status, "review");
assert.match(highYieldGapEvenWithHighScore.warnings.join(" "), /high-priority target-date event\/discovery gap/);

const discoveryGaps = evaluateHighYieldDiscoveryGaps([
  {
    id: "gdp-a",
    resolutionKey: "cluster-gdp",
    title: "Quarterly Estimates of Gross Domestic Product for Q1 2026-27 record 7.8% growth",
    category: "economy_banking",
    resolvedIntoLearnerEvent: false,
    linkedEventIds: [],
  },
  {
    id: "gdp-b",
    resolutionKey: "cluster-gdp",
    title: "India GDP grows 7.8% in first quarter of 2026-27",
    category: "economy_banking",
    resolvedIntoLearnerEvent: false,
    linkedEventIds: [],
  },
  {
    id: "upi",
    resolutionKey: "cluster-upi",
    title: "NIPL agreement expands UPI merchant acceptance in Uzbekistan",
    category: "economy_banking",
    resolvedIntoLearnerEvent: true,
    linkedEventIds: ["event-upi"],
  },
  {
    id: "vrrr",
    resolutionKey: "cluster-vrrr",
    title: "7-day Variable Rate Reverse Repo VRRR auction under LAF on September 01, 2026",
    category: "economy_banking",
    resolvedIntoLearnerEvent: false,
    linkedEventIds: [],
  },
]);
assert.equal(discoveryGaps.length, 1, "same high-yield cluster must count once, resolved stories and routine VRRR must not count");
assert.equal(discoveryGaps[0]?.resolutionKey, "cluster-gdp");
assert.match(discoveryGaps[0]?.title ?? "", /GDP|Gross Domestic Product/i);

const linkedUnresolvedGap = evaluateHighYieldDiscoveryGaps([
  {
    id: "census",
    resolutionKey: "cluster-census",
    title: "First phase of Census 2027 completed in Tamil Nadu",
    category: "national",
    resolvedIntoLearnerEvent: false,
    linkedEventIds: ["event-census"],
  },
]);
assert.equal(linkedUnresolvedGap.length, 1);
assert.deepEqual(linkedUnresolvedGap[0]?.linkedEventIds, ["event-census"]);

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

console.log("CP-045 daily discovery census completeness contracts passed");