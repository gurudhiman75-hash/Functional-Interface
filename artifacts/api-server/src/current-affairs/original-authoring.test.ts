import assert from "node:assert/strict";

import { evaluateDailyMasterPackEditorialQuality } from "./daily-master-pack-approval-policy";
import { isGenericCurrentAffairsLearnerTitle } from "./learner-title-quality";
import {
  authorSourceIndependentEvent,
  titleSimilarity,
  type AuthoringInput,
} from "./original-authoring";

assert.ok(
  titleSimilarity("RBI policy rates: repo rate at 5.50%", "Monetary Policy Statement August 2026") < 0.2,
  "generic factual overlap such as policy must remain well below the near-copy gate",
);
assert.ok(titleSimilarity("SEBI launches Cyber Suraksha Portal", "SEBI launches the Cyber Suraksha Portal") > 0.7);

const appointment = authorSourceIndependentEvent({
  eventId: "event-1",
  eventDate: "2026-08-29",
  category: "appointments",
  sourceKey: "rbi",
  sourceTitle: "RBI appoints Shri Ravi Shankar as new Executive Director",
  facts: [
    { key: "appointee", value: "Shri Ravi Shankar" },
    { key: "position", value: "Executive Director" },
  ],
});
assert.equal(appointment.status, "ready");
assert.equal(appointment.title, "Shri Ravi Shankar appointed Executive Director");
assert.match(appointment.summary ?? "", /29 August 2026/);
assert.match(appointment.summary ?? "", /was appointed/);
assert.equal(appointment.oneLiner, "Shri Ravi Shankar — Executive Director.");
assert.ok(appointment.sourceTitleSimilarity < 0.72);

const index = authorSourceIndependentEvent({
  eventId: "event-2",
  eventDate: "2026-08-29",
  category: "economy_banking",
  sourceKey: "rbi",
  sourceTitle: "Financial Inclusion Index for March 2026",
  facts: [{ key: "index_value", value: "67.0" }],
});
assert.equal(index.status, "ready");
assert.equal(index.title, "RBI Financial Inclusion Index stands at 67.0");
assert.match(index.summary ?? "", /29 August 2026/);

const rates = authorSourceIndependentEvent({
  eventId: "event-3",
  eventDate: "2026-08-29",
  category: "economy_banking",
  sourceKey: "rbi",
  sourceTitle: "Resolution of the Monetary Policy Committee August 2026",
  facts: [
    { key: "policy_repo_rate", value: "5.50%" },
    { key: "standing_deposit_facility_rate", value: "5.25%" },
    { key: "marginal_standing_facility_rate", value: "5.75%" },
    { key: "bank_rate", value: "5.75%" },
  ],
});
assert.equal(rates.status, "ready");
assert.match(rates.summary ?? "", /SDF 5\.25%/);
assert.match(rates.summary ?? "", /MSF 5\.75%/);

const nisar: AuthoringInput = {
  eventId: "event-4",
  eventDate: "2026-08-29",
  category: "space",
  sourceKey: "isro",
  sourceTitle: "NISAR S-Band SAR Data Products Release",
  facts: [
    { key: "orbit_altitude", value: "747 km" },
    { key: "repeat_cycle", value: "12 days" },
    { key: "mission_life", value: "5 years" },
  ],
};
const mission = authorSourceIndependentEvent(nisar);
assert.equal(mission.status, "ready");
assert.equal(mission.title, "NISAR: key ISRO mission facts");
assert.match(mission.summary ?? "", /747 km/);
assert.match(mission.summary ?? "", /12 days/);
assert.ok(!(mission.title ?? "").includes("Data Products Release"));

const programme = authorSourceIndependentEvent({
  eventId: "event-5",
  eventDate: "2026-08-29",
  category: "punjab",
  sourceKey: "punjab_gov",
  sourceTitle: "Punjab Cabinet approves major farmer support scheme",
  facts: [
    { key: "scheme_outlay", value: "₹12,500 crore" },
    { key: "beneficiary_count", value: "25 lakh farmers" },
  ],
});
assert.equal(programme.status, "ready");
assert.match(programme.title ?? "", /Punjab Government programme/);
assert.match(programme.summary ?? "", /25 lakh farmers/);
assert.doesNotMatch(programme.summary ?? "", /Verified programme facts/i);

const officialAction = authorSourceIndependentEvent({
  eventId: "event-action",
  eventDate: "2026-08-30",
  category: "national",
  sourceKey: "pib",
  sourceTitle: "Department of Consumer Affairs Notifies Legal Metrology Indian Standard Time Rules 2026",
  facts: [
    { key: "acting_entity", value: "Department of Consumer Affairs" },
    { key: "official_action", value: "notifies" },
    { key: "action_subject", value: "Legal Metrology Indian Standard Time Rules 2026" },
  ],
});
assert.equal(officialAction.status, "ready");
assert.equal(officialAction.templateId, "verified_official_action_v1");
assert.match(officialAction.title ?? "", /^Government of India:/);
assert.match(officialAction.title ?? "", /Legal Metrology Indian Standard Time Rules 2026/);
assert.match(officialAction.summary ?? "", /^On 30 August 2026,/);
assert.match(officialAction.summary ?? "", /Department of Consumer Affairs notifies/);
assert.doesNotMatch(officialAction.summary ?? "", /Verified official facts identify|acting body|official action/i);
assert.equal(
  officialAction.oneLiner,
  "Legal Metrology Indian Standard Time Rules 2026 — Department of Consumer Affairs.",
);
assert.ok(officialAction.sourceTitleSimilarity < 0.72);

const nextDayAnnouncement = authorSourceIndependentEvent({
  eventId: "event-next-day",
  eventDate: "2026-08-31",
  category: "economy_banking",
  sourceKey: "rbi",
  sourceTitle: "RBI liquidity operations notice for September 2026",
  facts: [
    { key: "acting_entity", value: "Reserve Bank of India" },
    { key: "official_action", value: "announces" },
    { key: "action_subject", value: "7-day Variable Rate Reverse Repo auction under LAF on September 01, 2026" },
  ],
});
assert.equal(nextDayAnnouncement.status, "ready");
assert.match(nextDayAnnouncement.summary ?? "", /^On 31 August 2026,/);
assert.match(nextDayAnnouncement.summary ?? "", /September 01, 2026/);
assert.doesNotMatch(nextDayAnnouncement.summary ?? "", /happened on September 01/i);

const scheduledLaunch = authorSourceIndependentEvent({
  eventId: "event-scheduled-launch",
  eventDate: "2026-08-31",
  category: "national",
  sourceKey: "pib",
  sourceTitle: "Union Minister to launch fisheries Infrastructure projects worth Rs 36.49 Crore",
  facts: [
    { key: "acting_entity", value: "Union Minister Shri Rajiv Ranjan Singh" },
    { key: "official_action", value: "scheduled launch" },
    { key: "action_subject", value: "fisheries Infrastructure projects worth Rs 36.49 Crore" },
  ],
});
assert.equal(scheduledLaunch.status, "ready");
assert.match(scheduledLaunch.summary ?? "", /announced that it would launch fisheries Infrastructure projects/);
assert.doesNotMatch(scheduledLaunch.summary ?? "", /scheduled launch fisheries/i);

const scheduledConduct = authorSourceIndependentEvent({
  eventId: "event-scheduled-conduct",
  eventDate: "2026-08-31",
  category: "economy_banking",
  sourceKey: "rbi",
  sourceTitle: "RBI liquidity operations calendar for September 2026",
  facts: [
    { key: "acting_entity", value: "RBI" },
    { key: "official_action", value: "scheduled conduct" },
    { key: "action_subject", value: "7-day Variable Rate Reverse Repo auction under LAF on September 01, 2026" },
  ],
});
assert.equal(scheduledConduct.status, "ready");
assert.match(scheduledConduct.summary ?? "", /announced that it would conduct 7-day Variable Rate Reverse Repo/);
assert.doesNotMatch(scheduledConduct.summary ?? "", /scheduled conduct/i);

const nearCopyOfficialAction = authorSourceIndependentEvent({
  eventId: "event-near-copy-action",
  eventDate: "2026-08-31",
  category: "economy_banking",
  sourceKey: "rbi",
  sourceTitle: "7-day Variable Rate Reverse Repo auction under LAF on September 01, 2026",
  facts: [
    { key: "acting_entity", value: "Reserve Bank of India" },
    { key: "official_action", value: "announces" },
    { key: "action_subject", value: "7-day Variable Rate Reverse Repo auction under LAF on September 01, 2026" },
  ],
});
assert.equal(nearCopyOfficialAction.status, "needs_editorial");
assert.equal(nearCopyOfficialAction.title, undefined);
assert.ok(nearCopyOfficialAction.reasons.some((reason) => /too similar to the source title/i.test(reason)));

const greenForge = authorSourceIndependentEvent({
  eventId: "event-green-forge",
  eventDate: "2026-08-31",
  category: "national",
  sourceKey: "pib",
  sourceTitle: "Union Minister inaugurates first of it’s kind Green Forge Complex at National Agri-food & Biomanufacturing Institute Mohali; describes it as milestone in genetically modified crop revolution",
  facts: [
    { key: "acting_entity", value: "Union Minister Dr. Jitendra Singh" },
    { key: "official_action", value: "inaugurates" },
    { key: "action_subject", value: "first of it’s kind Green Forge Complex at National Agri-food & Biomanufacturing Institute Mohali; describes it as milestone in genetically modified crop revolution" },
  ],
});
assert.equal(greenForge.status, "ready");
assert.doesNotMatch(greenForge.title ?? "", /…/);
assert.doesNotMatch(greenForge.oneLiner ?? "", /…/);
assert.match(greenForge.title ?? "", /Green Forge Complex/);
assert.doesNotMatch(greenForge.title ?? "", /describes it as/);

const initiative = authorSourceIndependentEvent({
  eventId: "event-launch",
  eventDate: "2026-08-30",
  category: "science_technology",
  sourceKey: "pib",
  sourceTitle: "Government launches National Research Fellowship Portal",
  facts: [
    { key: "launching_entity", value: "Government" },
    { key: "initiative", value: "National Research Fellowship Portal" },
  ],
});
assert.equal(initiative.status, "ready");
assert.equal(initiative.templateId, "verified_initiative_v1");
assert.match(initiative.title ?? "", /Government|India/);
assert.match(initiative.summary ?? "", /Government launched National Research Fellowship Portal/);
assert.doesNotMatch(initiative.summary ?? "", /launching entity|Verified facts identify/i);

const plannedPassive = authorSourceIndependentEvent({
  eventId: "event-forum",
  eventDate: "2026-08-31",
  category: "environment",
  sourceKey: "pib",
  sourceTitle: "4th Indo-German Environment Forum to be held in New Delhi on September 1, 2026",
  facts: [
    { key: "initiative", value: "4th Indo-German Environment Forum" },
    { key: "official_action", value: "scheduled hold" },
    { key: "event_status", value: "to be held in New Delhi on September 1, 2026" },
  ],
});
assert.equal(plannedPassive.status, "ready");
assert.match(plannedPassive.summary ?? "", /announced that 4th Indo-German Environment Forum would be held in New Delhi on September 1, 2026/);
assert.doesNotMatch(plannedPassive.title ?? "", /in New Delhi on September 1/);
assert.doesNotMatch(plannedPassive.oneLiner ?? "", /…/);

const genericGraph = authorSourceIndependentEvent({
  eventId: "event-generic",
  eventDate: "2026-08-30",
  category: "environment",
  sourceKey: "pib",
  sourceTitle: "National programme sets ambitious climate targets",
  facts: [
    { key: "target_percentage", value: "45%" },
    { key: "target_year", value: "2030" },
    { key: "amount", value: "₹500 crore" },
  ],
});
assert.equal(genericGraph.status, "ready");
assert.equal(genericGraph.templateId, "generic_verified_fact_graph_v1");
assert.equal(genericGraph.title, "45% target by 2030");
assert.match(genericGraph.summary ?? "", /Target: 45%/);
assert.match(genericGraph.summary ?? "", /Target year: 2030/);
assert.doesNotMatch(genericGraph.summary ?? "", /Verified facts for this|fact graph/i);
assert.doesNotMatch(genericGraph.oneLiner ?? "", /target:/i);

assert.equal(isGenericCurrentAffairsLearnerTitle("C-DOT: science and technology initiative"), true);
assert.equal(isGenericCurrentAffairsLearnerTitle("Ministry of Earth Sciences: national affairs update"), true);
assert.equal(isGenericCurrentAffairsLearnerTitle("Government of India: key environment development"), true);
assert.equal(isGenericCurrentAffairsLearnerTitle("Legal Metrology IST Rules take effect after 180 days"), false);

const sparseGeneric = authorSourceIndependentEvent({
  eventId: "event-generic-held",
  eventDate: "2026-09-01",
  category: "science_technology",
  sourceKey: "pib",
  sourceTitle: "Official release on a technology programme",
  facts: [
    { key: "amount", value: "₹100 crore" },
    { key: "percentage", value: "18%" },
  ],
});
assert.equal(sparseGeneric.status, "needs_editorial");
assert.equal(sparseGeneric.title, undefined);
assert.ok(sparseGeneric.reasons.some((reason) => /generic source\/category placeholder/i.test(reason)));

const universalApprovalGate = evaluateDailyMasterPackEditorialQuality([{
  id: "event-placeholder",
  title: "C-DOT: science and technology initiative",
  summary: "C-DOT announced a technology initiative.",
  oneLiner: "Technology initiative.",
  category: "science_technology",
  facts: [{ key: "initiative", value: "Example programme" }],
}]);
assert.equal(universalApprovalGate.ready, false);
assert.ok(universalApprovalGate.issues.some((issue) => issue.kind === "generic_placeholder_title"));

const thin = authorSourceIndependentEvent({
  eventId: "event-6",
  eventDate: "2026-08-29",
  category: "reports_indices",
  sourceKey: "pib",
  sourceTitle: "India ranked 4th in Example Global Report",
  facts: [{ key: "rank", value: "4" }],
});
assert.equal(thin.status, "needs_editorial");
assert.equal(thin.title, undefined);

const tooClose = authorSourceIndependentEvent({
  eventId: "event-7",
  eventDate: "2026-08-29",
  category: "appointments",
  sourceKey: "rbi",
  sourceTitle: "Ananya Rao appointed Executive Director",
  facts: [
    { key: "appointee", value: "Ananya Rao" },
    { key: "position", value: "Executive Director" },
  ],
});
assert.equal(tooClose.status, "needs_editorial", "near-copy learner titles must be rejected");
assert.ok(tooClose.sourceTitleSimilarity >= 0.72);

console.log("Current Affairs CP-055 learner-writing and universal title-quality contracts passed");
