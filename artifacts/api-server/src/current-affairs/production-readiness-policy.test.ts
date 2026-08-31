import assert from "node:assert/strict";
import { evaluateCurrentAffairsProductionReadiness } from "./production-readiness-policy";

const now = new Date("2026-08-30T08:30:00.000Z");
const deadlineIso = "2026-08-30T01:30:00.000Z";
const family = (name: "ssc" | "banking" | "punjab") => ({
  family: name,
  englishDraftPresent: true,
  hindiDraftPresent: true,
  punjabiDraftPresent: true,
  eventCount: 8,
  approvedEnglishQuestions: 12,
  totalEnglishQuestions: 12,
  releaseReady: true,
  approvedRelease: true,
  learnerQuizPublished: true,
});

const green = evaluateCurrentAffairsProductionReadiness({
  now,
  targetDate: "2026-08-29",
  deadlineIso,
  scheduledPrimarySources: 5,
  freshSuccessfulPrimarySources: 5,
  failingPrimarySources: 0,
  stalePrimarySources: 0,
  criticalSourceFailures: 0,
  latestFeedRunAt: "2026-08-30T06:00:00.000Z",
  latestIntelligenceRunAt: "2026-08-30T06:20:00.000Z",
  queuedCandidates: 40,
  openConflicts: 0,
  families: [family("ssc"), family("banking"), family("punjab")],
});
assert.equal(green.color, "green");
assert.equal(green.learnerReady, true);
assert.equal(green.sourceCoveragePercent, 100);

const missingPack = evaluateCurrentAffairsProductionReadiness({
  now,
  targetDate: "2026-08-29",
  deadlineIso,
  scheduledPrimarySources: 5,
  freshSuccessfulPrimarySources: 5,
  failingPrimarySources: 0,
  stalePrimarySources: 0,
  criticalSourceFailures: 0,
  latestFeedRunAt: "2026-08-30T06:00:00.000Z",
  latestIntelligenceRunAt: "2026-08-30T06:20:00.000Z",
  queuedCandidates: 40,
  openConflicts: 0,
  families: [{ ...family("ssc"), englishDraftPresent: false }, family("banking"), family("punjab")],
});
assert.equal(missingPack.color, "red");
assert.equal(missingPack.checks.allEnglishDrafts, false);

const weakCoverage = evaluateCurrentAffairsProductionReadiness({
  now,
  targetDate: "2026-08-29",
  deadlineIso,
  scheduledPrimarySources: 5,
  freshSuccessfulPrimarySources: 3,
  failingPrimarySources: 1,
  stalePrimarySources: 2,
  criticalSourceFailures: 1,
  latestFeedRunAt: "2026-08-30T06:00:00.000Z",
  latestIntelligenceRunAt: "2026-08-30T06:20:00.000Z",
  queuedCandidates: 40,
  openConflicts: 0,
  families: [family("ssc"), family("banking"), family("punjab")],
});
assert.equal(weakCoverage.color, "red");
assert.equal(weakCoverage.checks.sourceCoverageHealthy, false);
assert.equal(weakCoverage.checks.criticalSourcesHealthy, false);

const editorialPending = evaluateCurrentAffairsProductionReadiness({
  now,
  targetDate: "2026-08-29",
  deadlineIso,
  scheduledPrimarySources: 5,
  freshSuccessfulPrimarySources: 5,
  failingPrimarySources: 0,
  stalePrimarySources: 0,
  criticalSourceFailures: 0,
  latestFeedRunAt: "2026-08-30T06:00:00.000Z",
  latestIntelligenceRunAt: "2026-08-30T06:20:00.000Z",
  queuedCandidates: 40,
  openConflicts: 0,
  families: [{ ...family("ssc"), approvedEnglishQuestions: 8, approvedRelease: false, learnerQuizPublished: false }, family("banking"), family("punjab")],
});
assert.equal(editorialPending.color, "amber");
assert.equal(editorialPending.draftReady, true);
assert.equal(editorialPending.learnerReady, false);

console.log("current-affairs CP025 production readiness policy contracts passed");
