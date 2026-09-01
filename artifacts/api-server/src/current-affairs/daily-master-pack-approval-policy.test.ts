import assert from "node:assert/strict";

import { evaluateDailyMasterPackApprovalReadiness } from "./daily-master-pack-approval-policy";

const ids = ["11111111-1111-4111-8111-111111111111", "22222222-2222-4222-8222-222222222222"];
const pack = (language: "en" | "hi" | "pa") => ({
  language,
  payloadLanguage: language,
  status: "draft",
  resourceStatus: "draft",
  declaredEventCount: 2,
  declaredCategoryCount: 2,
  payloadEventIds: ids,
  payloadCategoryCount: 2,
  renderTargets: ["web", "text", "pdf"],
});

const base = {
  packs: [pack("en"), pack("hi"), pack("pa")],
  currentEligibleEventIds: ids,
  verifiedEventCount: 2,
  currentAuthoringCount: 2,
  currentHindiLocalizationCount: 2,
  currentPunjabiLocalizationCount: 2,
  openConflictCount: 0,
  censusStatus: "complete",
  censusBlockerCount: 0,
};

const ready = evaluateDailyMasterPackApprovalReadiness(base);
assert.equal(ready.ready, true);
assert.equal(ready.blockers.length, 0);
assert.equal(ready.checks.eventParity, true);
assert.equal(ready.checks.currentEligibilityParity, true);
assert.equal(ready.checks.resourcesRemainDraft, true);
assert.equal(ready.checks.allRenderTargetsAvailable, true);

const missingPunjabi = evaluateDailyMasterPackApprovalReadiness({ ...base, packs: [pack("en"), pack("hi")] });
assert.equal(missingPunjabi.ready, false);
assert.match(missingPunjabi.blockers.join(" "), /English, Hindi and Punjabi/);

const stale = evaluateDailyMasterPackApprovalReadiness({ ...base, currentEligibleEventIds: [...ids, "33333333-3333-4333-8333-333333333333"] });
assert.equal(stale.ready, false);
assert.equal(stale.checks.currentEligibilityParity, false);
assert.match(stale.blockers.join(" "), /stale or incomplete/);

const localizationGap = evaluateDailyMasterPackApprovalReadiness({ ...base, currentPunjabiLocalizationCount: 1 });
assert.equal(localizationGap.ready, false);
assert.equal(localizationGap.checks.noteLocalizationParity, false);

const openConflict = evaluateDailyMasterPackApprovalReadiness({ ...base, openConflictCount: 1 });
assert.equal(openConflict.ready, false);
assert.equal(openConflict.checks.conflictFree, false);

const publishedResource = evaluateDailyMasterPackApprovalReadiness({
  ...base,
  packs: [pack("en"), { ...pack("hi"), resourceStatus: "published" }, pack("pa")],
});
assert.equal(publishedResource.ready, false);
assert.equal(publishedResource.checks.resourcesRemainDraft, false);

const legacyNoPdfMetadata = evaluateDailyMasterPackApprovalReadiness({
  ...base,
  packs: [pack("en"), { ...pack("hi"), renderTargets: ["web", "text"] }, pack("pa")],
});
assert.equal(legacyNoPdfMetadata.ready, true);
assert.equal(legacyNoPdfMetadata.checks.allRenderTargetsAvailable, false);
assert.match(legacyNoPdfMetadata.warnings.join(" "), /render-target manifests predate multilingual PDF support/);

const wrongPayloadLanguage = evaluateDailyMasterPackApprovalReadiness({
  ...base,
  packs: [pack("en"), { ...pack("hi"), payloadLanguage: "en" }, pack("pa")],
});
assert.equal(wrongPayloadLanguage.ready, false);
assert.equal(wrongPayloadLanguage.checks.payloadIntegrity, false);

const blockedCensus = evaluateDailyMasterPackApprovalReadiness({ ...base, censusStatus: "blocked", censusBlockerCount: 1 });
assert.equal(blockedCensus.ready, false);
assert.equal(blockedCensus.checks.censusNotBlocked, false);

const reviewCensus = evaluateDailyMasterPackApprovalReadiness({ ...base, censusStatus: "review" });
assert.equal(reviewCensus.ready, true);
assert.equal(reviewCensus.warnings.length, 1);

const duplicatePayloadEvent = evaluateDailyMasterPackApprovalReadiness({
  ...base,
  packs: [{ ...pack("en"), payloadEventIds: [ids[0]!, ids[0]!] }, pack("hi"), pack("pa")],
});
assert.equal(duplicatePayloadEvent.ready, false);
assert.equal(duplicatePayloadEvent.checks.payloadIntegrity, false);

console.log("CP-042 canonical Daily Master Pack editorial approval policy contracts passed");
