import assert from "node:assert/strict";

import { evaluateCurrentAffairsSourceFamilyCoverage } from "./source-family-policy";

const endpoint = (
  sourceKey: string,
  sourceFamily: string,
  coverageDomain: string,
  healthy: boolean,
  overrides: Partial<{
    sourceTier: string;
    scheduled: boolean;
    fresh: boolean;
    status: string | null;
  }> = {},
) => ({
  sourceKey,
  name: sourceKey,
  sourceFamily,
  sourceTier: overrides.sourceTier ?? "core_official",
  coverageDomain,
  scheduled: overrides.scheduled ?? true,
  fresh: overrides.fresh ?? healthy,
  status: overrides.status ?? (healthy ? "success" : "failure"),
});

const full = evaluateCurrentAffairsSourceFamilyCoverage([
  endpoint("pib", "pib", "national", true),
  endpoint("rbi", "rbi", "economy_banking", true),
  endpoint("sebi", "sebi", "economy_banking", true),
  endpoint("isro", "isro", "science_space", true),
  endpoint("punjab_notifications", "punjab_government", "punjab", true),
  endpoint("punjab_press", "punjab_government", "punjab", true),
]);
assert.equal(full.requiredSourceFamilies, 5, "two Punjab endpoints must count as one institution family");
assert.equal(full.healthyRequiredSourceFamilies, 5);
assert.equal(full.sourceCoveragePercent, 100);
assert.deepEqual(full.criticalDomainFailures, []);

const redundantPunjab = evaluateCurrentAffairsSourceFamilyCoverage([
  endpoint("pib", "pib", "national", true),
  endpoint("rbi", "rbi", "economy_banking", true),
  endpoint("sebi", "sebi", "economy_banking", true),
  endpoint("isro", "isro", "science_space", true),
  endpoint("punjab_notifications", "punjab_government", "punjab", false),
  endpoint("punjab_press", "punjab_government", "punjab", true),
]);
assert.equal(redundantPunjab.sourceCoveragePercent, 100);
assert.deepEqual(redundantPunjab.degradedSourceFamilies, ["punjab_government"]);
assert.deepEqual(redundantPunjab.criticalDomainFailures, []);

const oneOptionalFamilyDown = evaluateCurrentAffairsSourceFamilyCoverage([
  endpoint("pib", "pib", "national", true),
  endpoint("rbi", "rbi", "economy_banking", true),
  endpoint("sebi", "sebi", "economy_banking", false),
  endpoint("isro", "isro", "science_space", true),
  endpoint("punjab_notifications", "punjab_government", "punjab", true),
]);
assert.equal(oneOptionalFamilyDown.sourceCoveragePercent, 80);
assert.deepEqual(oneOptionalFamilyDown.criticalDomainFailures, []);

const nationalMissing = evaluateCurrentAffairsSourceFamilyCoverage([
  endpoint("pib", "pib", "national", false),
  endpoint("rbi", "rbi", "economy_banking", true),
  endpoint("sebi", "sebi", "economy_banking", true),
  endpoint("isro", "isro", "science_space", true),
  endpoint("punjab_notifications", "punjab_government", "punjab", true),
]);
assert.equal(nationalMissing.sourceCoveragePercent, 80);
assert.deepEqual(nationalMissing.criticalDomainFailures, ["national"]);

const newspaperIgnored = evaluateCurrentAffairsSourceFamilyCoverage([
  endpoint("pib", "pib", "national", true),
  endpoint("rbi", "rbi", "economy_banking", true),
  endpoint("sebi", "sebi", "economy_banking", true),
  endpoint("isro", "isro", "science_space", true),
  endpoint("punjab_notifications", "punjab_government", "punjab", true),
  endpoint("tribune_punjab", "tribune", "punjab", false, { sourceTier: "trusted_news", scheduled: false }),
]);
assert.equal(newspaperIgnored.requiredSourceFamilies, 5, "trusted news must never inflate official readiness coverage");
assert.equal(newspaperIgnored.sourceCoveragePercent, 100);

console.log("Current Affairs CP028 source-family coverage contracts passed");
