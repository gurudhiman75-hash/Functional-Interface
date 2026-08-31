import assert from "node:assert/strict";

import {
  canAutoPromoteCluster,
  canAutoVerifyEvent,
  indiaDate,
  previousIndiaDate,
  shouldBuildDailyDrafts,
} from "./orchestration-policy";

const primaryPromotion = canAutoPromoteCluster({
  confidence: 0.72,
  category: "economy_banking",
  memberCount: 1,
  distinctSourceCount: 1,
  primarySourceCount: 1,
  highTrustSourceCount: 1,
  urlEvidenceCount: 1,
  primaryUrlEvidenceCount: 1,
  maxTrustScore: 0.95,
});
assert.equal(primaryPromotion.allowed, true, "high-trust primary singleton should clear the singleton-safe threshold");

const corroboratedPromotion = canAutoPromoteCluster({
  confidence: 0.81,
  category: "national",
  memberCount: 2,
  distinctSourceCount: 2,
  primarySourceCount: 0,
  highTrustSourceCount: 2,
  urlEvidenceCount: 2,
  primaryUrlEvidenceCount: 0,
  maxTrustScore: 0.88,
});
assert.equal(corroboratedPromotion.allowed, true);

assert.equal(canAutoPromoteCluster({
  confidence: 0.92,
  category: "other",
  memberCount: 3,
  distinctSourceCount: 3,
  primarySourceCount: 1,
  highTrustSourceCount: 3,
  urlEvidenceCount: 3,
  primaryUrlEvidenceCount: 1,
  maxTrustScore: 0.98,
}).allowed, false);

assert.equal(canAutoPromoteCluster({
  confidence: 0.9,
  category: "national",
  memberCount: 1,
  distinctSourceCount: 1,
  primarySourceCount: 0,
  highTrustSourceCount: 1,
  urlEvidenceCount: 0,
  primaryUrlEvidenceCount: 0,
  maxTrustScore: 0.9,
}).allowed, false, "PDF-only discovery cannot auto-promote without URL evidence");

assert.equal(canAutoVerifyEvent({
  verificationGateAllowed: true,
  verificationConfidence: 0.9,
  verifiedFactCount: 2,
  openConflictCount: 0,
  evidenceCount: 1,
  primaryEvidenceCount: 1,
}).allowed, true);

assert.equal(canAutoVerifyEvent({
  verificationGateAllowed: true,
  verificationConfidence: 0.95,
  verifiedFactCount: 2,
  openConflictCount: 1,
  evidenceCount: 2,
  primaryEvidenceCount: 1,
}).allowed, false, "contradictions must block auto-verification");

assert.equal(canAutoVerifyEvent({
  verificationGateAllowed: true,
  verificationConfidence: 0.9,
  verifiedFactCount: 0,
  openConflictCount: 0,
  evidenceCount: 1,
  primaryEvidenceCount: 1,
}).allowed, false, "events with no canonical facts remain review-only");

assert.equal(indiaDate(new Date("2026-08-28T20:00:00Z")), "2026-08-29");
assert.equal(previousIndiaDate(new Date("2026-08-29T00:20:00Z")), "2026-08-28");
assert.equal(shouldBuildDailyDrafts(new Date("2026-08-29T00:20:00Z")), true);
assert.equal(shouldBuildDailyDrafts(new Date("2026-08-29T03:20:00Z")), false);

console.log("Current Affairs Studio CP006 orchestration policy contracts passed");
