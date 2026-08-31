import assert from "node:assert/strict";

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
assert.match(appointment.summary ?? "", /has been appointed/);
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
assert.match(programme.title ?? "", /Punjab Government programme update/);
assert.match(programme.summary ?? "", /25 lakh farmers/);

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
assert.match(officialAction.title ?? "", /Government of India update/);
assert.ok(officialAction.sourceTitleSimilarity < 0.72);
assert.match(officialAction.summary ?? "", /acting body/);

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
assert.match(initiative.summary ?? "", /launching entity/);

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
assert.match(genericGraph.summary ?? "", /target: 45%/);
assert.match(genericGraph.summary ?? "", /target year: 2030/);

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

console.log("Current Affairs CP030 source-independent authoring contracts passed");