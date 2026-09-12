import { strict as assert } from "node:assert";

import {
  GEO_RIV_001_CP001_ALL_CANDIDATES,
  GEO_RIV_001_CP001_MAJOR_RIVER_CLASSIFICATION_CANDIDATES,
} from "./geo-riv-001-cp001-facts";
import {
  auditGeoRiv001Cp001Facts,
  auditGeoRiv001Cp001PreFreezeEligibility,
} from "./geo-riv-001-cp001-validator";
import {
  GEO_RIV_001_SOURCE_AUTHORITIES,
  auditGeoRiv001SourceAuthorities,
} from "./geo-riv-001-source-authorities";

const sourceAudit = auditGeoRiv001SourceAuthorities();
assert.equal(sourceAudit.valid, true, sourceAudit.issues.join("\n"));
const sourceIds = new Set(GEO_RIV_001_SOURCE_AUTHORITIES.map((source) => source.sourceId));
for (const requiredSourceId of [
  "NCERT-CONTEMPORARY-INDIA-I-DRAINAGE",
  "NCERT-SOCIAL-SCIENCE-TEACHER-MANUAL-KAVERI",
  "CWC-INDUS-BASIN-ORGANISATION",
  "INDIA-WRIS-NARMADA-BASIN-V2",
  "INDIA-WRIS-GODAVARI-BASIN-V2",
]) {
  assert.equal(sourceIds.has(requiredSourceId), true, `Missing CP001 source authority ${requiredSourceId}`);
}

const factAudit = auditGeoRiv001Cp001Facts(GEO_RIV_001_CP001_ALL_CANDIDATES);
assert.equal(factAudit.valid, true, factAudit.issues.join("\n"));
assert.equal(factAudit.factCount, 21);
assert.equal(factAudit.relationCount, 21);

const preFreezeAudit = auditGeoRiv001Cp001PreFreezeEligibility(
  GEO_RIV_001_CP001_ALL_CANDIDATES,
);
assert.equal(preFreezeAudit.valid, true, preFreezeAudit.unexpectedIssues.join("\n"));
assert.equal(preFreezeAudit.accidentallyEligible.length, 0);
assert.equal(preFreezeAudit.expectedReviewBlocked.length, 21);

const majorGroups = GEO_RIV_001_CP001_MAJOR_RIVER_CLASSIFICATION_CANDIDATES.map(
  (fact) => {
    assert.equal(fact.value.kind, "entity_ref");
    return fact.value.kind === "entity_ref" ? fact.value.entityId : "";
  },
);

assert.equal(
  majorGroups.filter((value) => value === "geo:river-class:himalayan").length,
  3,
);
assert.equal(
  majorGroups.filter((value) => value === "geo:river-class:peninsular").length,
  6,
);

const riverNames = GEO_RIV_001_CP001_MAJOR_RIVER_CLASSIFICATION_CANDIDATES.map(
  (fact) => fact.entity.label.en,
);
assert.equal(new Set(riverNames).size, riverNames.length);

const narmadaOutfall = GEO_RIV_001_CP001_ALL_CANDIDATES.find(
  (fact) => fact.factId === "geo-riv-001-cp001-narmada-drains_into-sea:arabian-sea",
);
assert.ok(narmadaOutfall);
assert.equal(narmadaOutfall.source.sourceId, "INDIA-WRIS-NARMADA-BASIN-V2");

const godavariOutfall = GEO_RIV_001_CP001_ALL_CANDIDATES.find(
  (fact) => fact.factId === "geo-riv-001-cp001-godavari-drains_into-bay:bay-of-bengal",
);
assert.ok(godavariOutfall);
assert.equal(godavariOutfall.source.sourceId, "INDIA-WRIS-GODAVARI-BASIN-V2");

// CP001 V1 candidates deliberately remain blocked from generation until the
// source locators and learner-facing wording receive editorial review/freeze.
for (const fact of GEO_RIV_001_CP001_ALL_CANDIDATES) {
  assert.equal(fact.review.status, "REVIEW_REQUIRED");
}
