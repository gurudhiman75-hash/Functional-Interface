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

const healthyFamilies = [family("ssc"), family("banking"), family("punjab")];
const base = {
  now,
  targetDate: "2026-08-29",
  deadlineIso,
  scheduledPrimarySources: 5,
  freshSuccessfulPrimarySources: 5,
  failingPrimarySources: 0,
  stalePrimarySources: 0,
  criticalSourceFailures: 0,
  criticalSourceFailureLabels: [] as string[],
  latestFeedRunAt: "2026-08-30T06:00:00.000Z",
  latestIntelligenceRunAt: "2026-08-30T06:20:00.000Z",
  queuedCandidates: 40,
  openConflicts: 0,
  families: healthyFamilies,
};

const green = evaluateCurrentAffairsProductionReadiness(base);
assert.equal(green.color, "green");
assert.equal(green.learnerReady, true);
assert.equal(green.sourceCoveragePercent, 100);

const missingPack = evaluateCurrentAffairsProductionReadiness({
  ...base,
  families: [{ ...family("ssc"), englishDraftPresent: false }, family("banking"), family("punjab")],
});
assert.equal(missingPack.color, "red");
assert.equal(missingPack.checks.allEnglishDrafts, false);

const weakCoverage = evaluateCurrentAffairsProductionReadiness({
  ...base,
  freshSuccessfulPrimarySources: 3,
  failingPrimarySources: 1,
  stalePrimarySources: 2,
});
assert.equal(weakCoverage.color, "red");
assert.equal(weakCoverage.sourceCoveragePercent, 60);
assert.equal(weakCoverage.checks.sourceCoverageHealthy, false);

const eightyPercentWithRedundantDomain = evaluateCurrentAffairsProductionReadiness({
  ...base,
  freshSuccessfulPrimarySources: 4,
  failingPrimarySources: 1,
  stalePrimarySources: 1,
});
assert.equal(eightyPercentWithRedundantDomain.sourceCoveragePercent, 80);
assert.equal(eightyPercentWithRedundantDomain.checks.sourceCoverageHealthy, true);
assert.equal(eightyPercentWithRedundantDomain.checks.criticalSourcesHealthy, true);
assert.equal(eightyPercentWithRedundantDomain.blockers.some((value) => value.includes("source-family coverage")), false);

const mandatoryDomainMissing = evaluateCurrentAffairsProductionReadiness({
  ...base,
  freshSuccessfulPrimarySources: 4,
  failingPrimarySources: 1,
  criticalSourceFailures: 1,
  criticalSourceFailureLabels: ["punjab"],
});
assert.equal(mandatoryDomainMissing.sourceCoveragePercent, 80);
assert.equal(mandatoryDomainMissing.checks.sourceCoverageHealthy, true);
assert.equal(mandatoryDomainMissing.checks.criticalSourcesHealthy, false);
assert.ok(mandatoryDomainMissing.blockers.some((value) => value.includes("Punjab")));

const editorialPending = evaluateCurrentAffairsProductionReadiness({
  ...base,
  families: [{ ...family("ssc"), approvedEnglishQuestions: 8, approvedRelease: false, learnerQuizPublished: false }, family("banking"), family("punjab")],
});
assert.equal(editorialPending.color, "amber");
assert.equal(editorialPending.draftReady, true);
assert.equal(editorialPending.learnerReady, false);

console.log("Current Affairs CP028 production readiness policy contracts passed");
