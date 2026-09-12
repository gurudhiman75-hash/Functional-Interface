import assert from "node:assert/strict";
import { evaluateCurrentAffairsProductionReadiness } from "./production-readiness-policy";
import { evaluateCurrentAffairsSourceFamilyCoverage } from "./source-family-policy";

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

const sourceEndpoint = (
  sourceKey: string,
  sourceFamily: string,
  coverageDomain: string,
  healthy: boolean,
  sourceTier = "core_official",
) => ({
  sourceKey,
  name: sourceKey,
  sourceFamily,
  sourceTier,
  coverageDomain,
  scheduled: sourceTier === "core_official",
  fresh: healthy,
  status: healthy ? "success" : "failure",
});

const redundantPunjabCoverage = evaluateCurrentAffairsSourceFamilyCoverage([
  sourceEndpoint("pib", "pib", "national", true),
  sourceEndpoint("rbi", "rbi", "economy_banking", true),
  sourceEndpoint("sebi", "sebi", "economy_banking", true),
  sourceEndpoint("isro", "isro", "science_space", true),
  sourceEndpoint("punjab_notifications", "punjab_government", "punjab", false),
  sourceEndpoint("punjab_press", "punjab_government", "punjab", true),
  sourceEndpoint("tribune_punjab", "tribune", "punjab", false, "trusted_news"),
]);
assert.equal(redundantPunjabCoverage.requiredSourceFamilies, 5, "Punjab Government endpoints must count once and news must not inflate coverage");
assert.equal(redundantPunjabCoverage.healthyRequiredSourceFamilies, 5);
assert.equal(redundantPunjabCoverage.sourceCoveragePercent, 100);
assert.deepEqual(redundantPunjabCoverage.degradedSourceFamilies, ["punjab_government"]);
assert.deepEqual(redundantPunjabCoverage.criticalDomainFailures, []);

const independentPunjabResilience = evaluateCurrentAffairsSourceFamilyCoverage([
  sourceEndpoint("pib", "pib", "national", true),
  sourceEndpoint("rbi", "rbi", "economy_banking", true),
  sourceEndpoint("sebi", "sebi", "economy_banking", true),
  sourceEndpoint("isro", "isro", "science_space", true),
  sourceEndpoint("punjab_notifications", "punjab_government", "punjab", false),
  sourceEndpoint("punjab_press", "punjab_government", "punjab", false),
  sourceEndpoint("punjab_lok_bhavan_press", "punjab_lok_bhavan", "punjab", true),
]);
assert.equal(independentPunjabResilience.requiredSourceFamilies, 6);
assert.equal(independentPunjabResilience.healthyRequiredSourceFamilies, 5);
assert.equal(independentPunjabResilience.sourceCoveragePercent, 83);
assert.deepEqual(independentPunjabResilience.unhealthySourceFamilies, ["punjab_government"]);
assert.deepEqual(independentPunjabResilience.criticalDomainFailures, [], "independent official Punjab family must preserve the Punjab domain");

const allPunjabOfficialFamiliesDown = evaluateCurrentAffairsSourceFamilyCoverage([
  sourceEndpoint("pib", "pib", "national", true),
  sourceEndpoint("rbi", "rbi", "economy_banking", true),
  sourceEndpoint("sebi", "sebi", "economy_banking", true),
  sourceEndpoint("isro", "isro", "science_space", true),
  sourceEndpoint("punjab_notifications", "punjab_government", "punjab", false),
  sourceEndpoint("punjab_press", "punjab_government", "punjab", false),
  sourceEndpoint("punjab_lok_bhavan_press", "punjab_lok_bhavan", "punjab", false),
  sourceEndpoint("tribune_punjab", "tribune", "punjab", true, "trusted_news"),
]);
assert.equal(allPunjabOfficialFamiliesDown.sourceCoveragePercent, 67);
assert.deepEqual(allPunjabOfficialFamiliesDown.criticalDomainFailures, ["punjab"]);

const optionalFamilyDownCoverage = evaluateCurrentAffairsSourceFamilyCoverage([
  sourceEndpoint("pib", "pib", "national", true),
  sourceEndpoint("rbi", "rbi", "economy_banking", true),
  sourceEndpoint("sebi", "sebi", "economy_banking", false),
  sourceEndpoint("isro", "isro", "science_space", true),
  sourceEndpoint("punjab_notifications", "punjab_government", "punjab", true),
]);
assert.equal(optionalFamilyDownCoverage.sourceCoveragePercent, 80);
assert.deepEqual(optionalFamilyDownCoverage.criticalDomainFailures, []);

const nationalDomainDownCoverage = evaluateCurrentAffairsSourceFamilyCoverage([
  sourceEndpoint("pib", "pib", "national", false),
  sourceEndpoint("rbi", "rbi", "economy_banking", true),
  sourceEndpoint("sebi", "sebi", "economy_banking", true),
  sourceEndpoint("isro", "isro", "science_space", true),
  sourceEndpoint("punjab_notifications", "punjab_government", "punjab", true),
]);
assert.equal(nationalDomainDownCoverage.sourceCoveragePercent, 80);
assert.deepEqual(nationalDomainDownCoverage.criticalDomainFailures, ["national"]);

console.log("Current Affairs CP029 production readiness and Punjab official resilience contracts passed");
