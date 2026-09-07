import assert from "node:assert/strict";

import {
  buildSelectedEditorialLocalization,
  chooseCciEditorialTitle,
  chooseSelectedProductFamily,
  parseCciAcquisition,
  removeInternalScheduledActionFalsePositive,
  SELECTED_EDITORIAL_CLEANUP_VERSION,
} from "./selected-editorial-cleanup-runtime";
import {
  selectedApprovalMembershipIds,
  SELECTED_MASTER_PACK_APPROVAL_BOUNDARY_VERSION,
} from "./selected-daily-master-pack-approval-runtime";

assert.equal(SELECTED_EDITORIAL_CLEANUP_VERSION, "ca-cp069-selected-editorial-cleanup-v1");
assert.equal(SELECTED_MASTER_PACK_APPROVAL_BOUNDARY_VERSION, "ca-cp069-selected-master-pack-approval-boundary-v1");

const apolloSubject = "acquisition of up to 100% equity shareholding of Apollo Fertility Centre (AFCPL) and Apollo Specialty Hospitals (ASHPL) by Kids Clinic India Ltd. (KCIL) and related transactions";
const apollo = parseCciAcquisition(apolloSubject);
assert.ok(apollo);
assert.equal(apollo?.buyer, "Kids Clinic India");
assert.equal(apollo?.target, "Apollo Fertility Centre and Apollo Specialty Hospitals");
assert.equal(apollo?.percentage, "100%");

const sourceTitle = "CCI approves acquisition of up to 100% equity shareholding of Apollo Fertility Centre (AFCPL) and Apollo Specialty Hospitals (ASHPL) by Kids Clinic India Ltd. (KCIL) and related transactions";
const repairedTitle = chooseCciEditorialTitle(apolloSubject, [sourceTitle]);
assert.ok(repairedTitle);
assert.doesNotMatch(repairedTitle?.title ?? "", /\s\.\s/);
assert.match(repairedTitle?.title ?? "", /CCI/);
assert.match(repairedTitle?.title ?? "", /Kids Clinic India/);
assert.ok((repairedTitle?.sourceTitleSimilarity ?? 1) < 0.72);

const selectedFamily = chooseSelectedProductFamily([
  { family: "banking", score: 63, include: false },
  { family: "ssc", score: 41, include: false },
  { family: "punjab", score: 23, include: false },
]);
assert.equal(selectedFamily, "banking");
assert.equal(chooseSelectedProductFamily([
  { family: "banking", score: 63, include: true },
  { family: "ssc", score: 41, include: false },
]), null, "an existing product-family recommendation must not be overridden");

const vrrrFacts = [
  { key: "acting_entity", value: "RBI" },
  { key: "official_action", value: "scheduled conduct" },
  { key: "action_subject", value: "7-day Variable Rate Reverse Repo (VRRR) auction under LAF on September 01, 2026" },
];
for (const language of ["hi", "pa"] as const) {
  const localized = buildSelectedEditorialLocalization({ language, eventDate: "2026-08-31", facts: vrrrFacts });
  assert.ok(localized);
  assert.equal(localized?.kind, "rbi_vrrr_planned_auction");
  assert.doesNotMatch(`${localized?.title} ${localized?.summary} ${localized?.oneLiner}`, /scheduled conduct/i);
  assert.match(localized?.summary ?? "", /VRRR/);
  assert.ok(language === "hi" ? /[\u0900-\u097F]/u.test(localized?.summary ?? "") : /[\u0A00-\u0A7F]/u.test(localized?.summary ?? ""));
}

const cciFacts = [
  { key: "acting_entity", value: "CCI" },
  { key: "official_action", value: "approves" },
  { key: "action_subject", value: apolloSubject },
  { key: "percentage", value: "100%" },
];
for (const language of ["hi", "pa"] as const) {
  const localized = buildSelectedEditorialLocalization({ language, eventDate: "2026-09-01", facts: cciFacts });
  assert.ok(localized);
  assert.equal(localized?.kind, "cci_acquisition");
  assert.match(localized?.summary ?? "", /100%/);
  assert.match(localized?.title ?? "", /Kids Clinic India/);
  assert.match(localized?.title ?? "", /Apollo Fertility Centre/);
  assert.ok(language === "hi" ? /[\u0900-\u097F]/u.test(localized?.summary ?? "") : /[\u0A00-\u0A7F]/u.test(localized?.summary ?? ""));
}

const cleanPayload = {
  sections: [{
    events: [{
      id: "event-vrrr",
      title: "RBI announces 7-day VRRR auction",
      summary: "On 31 August 2026, RBI announced that it would conduct the 7-day VRRR auction.",
      oneLiner: "RBI announced the 7-day VRRR auction.",
    }],
  }],
  editorialQuality: {
    ready: false,
    blockers: ["Malformed planned-event wording remains in canonical pack (event-vrrr): scheduled conduct"],
    warnings: ["Routine item remains"],
  },
};
const cleaned = removeInternalScheduledActionFalsePositive(cleanPayload as any);
assert.equal(cleaned.removed, 1);
assert.equal((cleaned.payload.editorialQuality as any).ready, true);
assert.deepEqual((cleaned.payload.editorialQuality as any).blockers, []);

const actuallyMalformed = removeInternalScheduledActionFalsePositive({
  sections: [{ events: [{ id: "event-vrrr", title: "VRRR", summary: "RBI scheduled conduct VRRR auction", oneLiner: "VRRR" }] }],
  editorialQuality: {
    ready: false,
    blockers: ["Malformed planned-event wording remains in canonical pack (event-vrrr): scheduled conduct"],
    warnings: [],
  },
} as any);
assert.equal(actuallyMalformed.removed, 0, "a malformed learner-facing phrase must remain blocked");

const fakeSelectedCandidate = {
  packs: [
    {
      language: "en",
      payload: { membership: { mode: "admin_selected", selectedEventCount: 2 } },
      payloadEventIds: ["22222222-2222-4222-8222-222222222222", "11111111-1111-4111-8111-111111111111"],
    },
    { language: "hi", payload: {}, payloadEventIds: [] },
    { language: "pa", payload: {}, payloadEventIds: [] },
  ],
} as any;
assert.deepEqual(selectedApprovalMembershipIds(fakeSelectedCandidate), [
  "11111111-1111-4111-8111-111111111111",
  "22222222-2222-4222-8222-222222222222",
]);

const fakeBroadCandidate = {
  packs: [{ language: "en", payload: {}, payloadEventIds: ["11111111-1111-4111-8111-111111111111"] }],
} as any;
assert.equal(selectedApprovalMembershipIds(fakeBroadCandidate), null);

console.log("Current Affairs CP-069 selected editorial cleanup and approval contracts passed");
