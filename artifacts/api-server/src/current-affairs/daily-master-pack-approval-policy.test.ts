import assert from "node:assert/strict";

import {
  evaluateDailyMasterPackApprovalReadiness,
  evaluateDailyMasterPackEditorialQuality,
  type DailyMasterPackEditorialEvent,
} from "./daily-master-pack-approval-policy";

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

const cleanEditorialEvent: DailyMasterPackEditorialEvent = {
  id: ids[0]!,
  title: "C-DOT launches 14 indigenous quantum products",
  summary: "On 31 August 2026, C-DOT launched 14 indigenous quantum products to strengthen communication-network security.",
  oneLiner: "14 indigenous quantum products — launched by C-DOT",
  category: "science_technology",
  facts: [
    { key: "launching_entity", value: "C-DOT" },
    { key: "initiative", value: "14 indigenous quantum products" },
  ],
};
const cleanEditorialQuality = evaluateDailyMasterPackEditorialQuality([cleanEditorialEvent]);
assert.equal(cleanEditorialQuality.ready, true);
assert.equal(cleanEditorialQuality.blockers.length, 0);

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
  editorialQuality: cleanEditorialQuality,
};

const ready = evaluateDailyMasterPackApprovalReadiness(base);
assert.equal(ready.ready, true);
assert.equal(ready.blockers.length, 0);
assert.equal(ready.checks.eventParity, true);
assert.equal(ready.checks.currentEligibilityParity, true);
assert.equal(ready.checks.resourcesRemainDraft, true);
assert.equal(ready.checks.allRenderTargetsAvailable, true);
assert.equal(ready.checks.editorialQuality, true);

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
assert.equal(reviewCensus.ready, false);
assert.equal(reviewCensus.checks.censusNotBlocked, false);
assert.match(reviewCensus.blockers.join(" "), /still in review/);

const missingCensus = evaluateDailyMasterPackApprovalReadiness({ ...base, censusStatus: null });
assert.equal(missingCensus.ready, false);
assert.match(missingCensus.blockers.join(" "), /census is missing/);

const duplicatePayloadEvent = evaluateDailyMasterPackApprovalReadiness({
  ...base,
  packs: [{ ...pack("en"), payloadEventIds: [ids[0]!, ids[0]!] }, pack("hi"), pack("pa")],
});
assert.equal(duplicatePayloadEvent.ready, false);
assert.equal(duplicatePayloadEvent.checks.payloadIntegrity, false);

// CP-048: exact learner-pack failure signatures from the real 31-Aug-2026 PDF audit.
const quality = (event: Omit<DailyMasterPackEditorialEvent, "id">) => evaluateDailyMasterPackEditorialQuality([{ id: ids[0]!, ...event }]);

const vrrr = quality({
  title: "Reserve Bank of India: 7-day Variable Rate Reverse Repo (VRRR) auction under LAF on September 01, 2026",
  summary: "On 31 August 2026, RBI scheduled conduct 7-day Variable Rate Reverse Repo (VRRR) auction under LAF on September 01, 2026.",
  oneLiner: "7-day Variable Rate Reverse Repo (VRRR) auction — RBI",
  category: "economy_banking",
  facts: [{ key: "official_action", value: "scheduled conduct" }],
});
assert.equal(vrrr.ready, false);
assert.ok(vrrr.issues.some((issue) => issue.kind === "routine_event"));
assert.ok(vrrr.issues.some((issue) => issue.kind === "malformed_planned_action"));

const cpgrams = quality({
  title: "Government of India: 51st Monthly Report on CPGRAMS for Central Ministries Departments performance for July 2026",
  summary: "DARPG released the 51st Monthly Report on CPGRAMS for Central Ministries and Departments.",
  oneLiner: "51st Monthly Report on CPGRAMS — DARPG",
  category: "reports_indices",
  facts: [{ key: "acting_entity", value: "Department of Administrative Reforms and Public Grievances" }],
});
assert.equal(cpgrams.ready, false);
assert.ok(cpgrams.issues.some((issue) => issue.kind === "routine_event"));

const lecture = quality({
  title: "Government of India: second Annual Trident Lecture of CENJOWS",
  summary: "Raksha Rajya Mantri scheduled inaugurate second Annual Trident Lecture of CENJOWS.",
  oneLiner: "second Annual Trident Lecture of CENJOWS — Raksha Rajya Mantri",
  category: "defence",
  facts: [{ key: "official_action", value: "scheduled inaugurate" }],
});
assert.equal(lecture.ready, false);
assert.ok(lecture.issues.some((issue) => issue.kind === "routine_event"));
assert.ok(lecture.issues.some((issue) => issue.kind === "malformed_planned_action"));

const fisheries = quality({
  title: "Government of India: fisheries infrastructure projects worth Rs 36.49 Crore",
  summary: "The Union Minister scheduled launch fisheries infrastructure projects worth Rs 36.49 Crore.",
  oneLiner: "fisheries infrastructure projects worth Rs 36.49 Crore — Union Minister",
  category: "national",
  facts: [{ key: "official_action", value: "scheduled launch" }],
});
assert.equal(fisheries.ready, false);
assert.ok(fisheries.issues.some((issue) => issue.kind === "malformed_planned_action"));

const indoGerman = quality({
  title: "Government of India: in New Delhi on September 1, 2026",
  summary: "On 31 August 2026, 4th Indo-German Environment Forum to be held in New Delhi on September 1, 2026.",
  oneLiner: "in New Delhi on September 1, 2026 — 4th Indo-German Environment Forum to be",
  category: "environment",
  facts: [
    { key: "acting_entity", value: "4th Indo-German Environment Forum to be" },
    { key: "action_subject", value: "in New Delhi on September 1, 2026" },
  ],
});
assert.equal(indoGerman.ready, false);
assert.ok(indoGerman.issues.some((issue) => issue.kind === "malformed_entity"));

const truncated = quality({
  title: "Government of India: first of its kind Green Forge Complex at NABI Mohali…",
  summary: "The Union Minister inaugurated the Green Forge Complex at NABI Mohali.",
  oneLiner: "Green Forge Complex at NABI Mohali… — Union Minister",
  category: "national",
  facts: [{ key: "action_subject", value: "Green Forge Complex at NABI Mohali" }],
});
assert.equal(truncated.ready, false);
assert.ok(truncated.issues.some((issue) => issue.kind === "truncated_copy"));

const genericPlaceholder = quality({
  title: "Government of India: science and technology initiative",
  summary: "C-DOT launched 14 Indigenous Quantum Products to strengthen communication-network security.",
  oneLiner: "14 Indigenous Quantum Products — launched by C-DOT",
  category: "science_technology",
  facts: [
    { key: "launching_entity", value: "C-DOT" },
    { key: "initiative", value: "14 Indigenous Quantum Products" },
  ],
});
assert.equal(genericPlaceholder.ready, false);
assert.ok(genericPlaceholder.issues.some((issue) => issue.kind === "generic_placeholder_title"));

const internalArtifact = quality({
  title: "Government of India: Legal Metrology Indian Standard Time Rules 2026",
  summary: "Verified official facts identify the acting body and action subject for the learner copy.",
  oneLiner: "Legal Metrology Indian Standard Time Rules 2026",
  category: "national",
  facts: [{ key: "action_subject", value: "Legal Metrology Indian Standard Time Rules 2026" }],
});
assert.equal(internalArtifact.ready, false);
assert.ok(internalArtifact.issues.some((issue) => issue.kind === "internal_authoring_artifact"));

const gdpQuality = quality({
  title: "India's GDP grows 7.8% in the first quarter of 2026-27",
  summary: "Quarterly estimates of Gross Domestic Product recorded 7.8% growth in Q1 2026-27.",
  oneLiner: "Q1 2026-27 GDP growth — 7.8%",
  category: "economy_banking",
  facts: [{ key: "percentage", value: "7.8%" }],
});
assert.equal(gdpQuality.ready, true, "high-yield macroeconomic stories must remain approvable when learner copy is clean");

const qualityBlockedApproval = evaluateDailyMasterPackApprovalReadiness({ ...base, editorialQuality: vrrr });
assert.equal(qualityBlockedApproval.ready, false);
assert.equal(qualityBlockedApproval.checks.editorialQuality, false);
assert.match(qualityBlockedApproval.blockers.join(" "), /Routine\/recurring item/);

console.log("CP-048 canonical Daily Master Pack editorial-quality approval contracts passed");