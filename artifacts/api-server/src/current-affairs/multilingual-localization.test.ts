import assert from "node:assert/strict";
import { createHash } from "node:crypto";

import {
  evaluateCurrentAffairsLocalization,
  localizationInputFingerprint,
  localizeCurrentAffairsAuthoring,
  type CurrentAffairsLocalizationInput,
} from "./multilingual-localization";

function legacyLocalizationFingerprint(input: CurrentAffairsLocalizationInput): string {
  const normalize = (value: string) => value.normalize("NFKC").replace(/\s+/g, " ").trim();
  const stable = JSON.stringify({
    eventId: input.eventId,
    authoringVersionId: input.authoringVersionId,
    languageCode: input.languageCode,
    sourceTitle: normalize(input.sourceTitle),
    sourceSummary: normalize(input.sourceSummary),
    sourceOneLiner: normalize(input.sourceOneLiner ?? ""),
    templateId: input.templateId ?? "",
    sourceKey: input.sourceKey ?? "",
    facts: [...input.facts]
      .map((fact) => ({ key: fact.key.trim().toLowerCase(), value: normalize(fact.value) }))
      .sort((a, b) => a.key.localeCompare(b.key) || a.value.localeCompare(b.value)),
  });
  return createHash("sha256").update(stable).digest("hex");
}

const appointmentBase = {
  eventId: "event-1",
  authoringVersionId: "authoring-1",
  sourceTitle: "Ravi Shankar appointed Executive Director",
  sourceSummary: "Ravi Shankar has been appointed Executive Director.",
  sourceOneLiner: "Ravi Shankar was appointed Executive Director.",
  templateId: "appointment_v1",
  sourceKey: "rbi",
  facts: [
    { key: "appointee", value: "Ravi Shankar" },
    { key: "position", value: "Executive Director" },
  ],
} as const;

const hiAppointment = localizeCurrentAffairsAuthoring({ ...appointmentBase, languageCode: "hi" });
assert.equal(hiAppointment.status, "ready");
assert.match(hiAppointment.localizedTitle ?? "", /नियुक्ति/u);
assert.match(hiAppointment.localizedSummary ?? "", /Ravi Shankar/);
assert.match(hiAppointment.localizedSummary ?? "", /Executive Director/);
assert.equal(hiAppointment.quality.missingCanonicalFacts.length, 0);
assert.equal(hiAppointment.quality.sharedTranslationQuality.approvable, true);

const paAppointment = localizeCurrentAffairsAuthoring({ ...appointmentBase, languageCode: "pa" });
assert.equal(paAppointment.status, "ready");
assert.match(paAppointment.localizedTitle ?? "", /ਨਿਯੁਕਤੀ/u);
assert.match(paAppointment.localizedSummary ?? "", /Ravi Shankar/);
assert.equal(paAppointment.quality.expectedScriptPresent, true);

const rates: CurrentAffairsLocalizationInput = {
  eventId: "event-2",
  authoringVersionId: "authoring-2",
  languageCode: "hi",
  sourceTitle: "RBI policy rates: repo rate at 5.50%",
  sourceSummary: "The Reserve Bank of India policy-rate snapshot is: repo rate 5.50%; SDF 5.25%; MSF 5.75%; Bank Rate 5.75%.",
  sourceOneLiner: "RBI repo rate is 5.50%.",
  templateId: "rbi_policy_rates_v1",
  sourceKey: "rbi",
  facts: [
    { key: "policy_repo_rate", value: "5.50%" },
    { key: "standing_deposit_facility_rate", value: "5.25%" },
    { key: "marginal_standing_facility_rate", value: "5.75%" },
    { key: "bank_rate", value: "5.75%" },
  ],
};
const hiRates = localizeCurrentAffairsAuthoring(rates);
assert.equal(hiRates.status, "ready");
assert.match(hiRates.localizedSummary ?? "", /5\.50%/);
assert.match(hiRates.localizedSummary ?? "", /5\.25%/);
assert.match(hiRates.localizedSummary ?? "", /5\.75%/);
assert.equal(hiRates.quality.sharedTranslationQuality.errorCount, 0);

const badManualParity = evaluateCurrentAffairsLocalization({
  input: rates,
  localizedTitle: "RBI नीति दरें",
  localizedSummary: "भारतीय रिज़र्व बैंक की रेपो दर 5.50% है।",
  localizedOneLiner: "RBI रेपो दर 5.50% है।",
});
assert.ok(badManualParity.missingCanonicalFacts.some((item) => item.value === "5.25%"));
assert.ok(badManualParity.sharedTranslationQuality.errorCount > 0, "protected numeric values must not disappear");

const mission = localizeCurrentAffairsAuthoring({
  eventId: "event-3",
  authoringVersionId: "authoring-3",
  languageCode: "pa",
  sourceTitle: "NISAR: key ISRO mission facts",
  sourceSummary: "Key verified facts for NISAR include orbit altitude 747 km; repeat cycle 12 days; mission life 5 years; launcher GSLV-F16.",
  sourceOneLiner: "NISAR — orbit altitude 747 km; repeat cycle 12 days; mission life 5 years; launcher GSLV-F16.",
  templateId: "isro_mission_facts_v1",
  sourceKey: "isro",
  facts: [
    { key: "orbit_altitude", value: "747 km" },
    { key: "repeat_cycle", value: "12 days" },
    { key: "mission_life", value: "5 years" },
    { key: "launcher", value: "GSLV-F16" },
  ],
});
assert.equal(mission.status, "ready");
assert.match(mission.localizedTitle ?? "", /NISAR/);
assert.match(mission.localizedSummary ?? "", /747 km/);
assert.match(mission.localizedSummary ?? "", /12 days/);
assert.match(mission.localizedSummary ?? "", /GSLV-F16/);

const programme = localizeCurrentAffairsAuthoring({
  eventId: "event-4",
  authoringVersionId: "authoring-4",
  languageCode: "hi",
  sourceTitle: "Punjab Government programme update: ₹12,500 crore outlay",
  sourceSummary: "Verified programme facts from Punjab Government: outlay ₹12,500 crore; beneficiaries 25 lakh farmers; effective date 2026-09-01.",
  sourceOneLiner: "Punjab Government programme — outlay ₹12,500 crore; beneficiaries 25 lakh farmers; effective date 2026-09-01.",
  templateId: "programme_outlay_v1",
  sourceKey: "punjab_gov",
  facts: [
    { key: "scheme_outlay", value: "₹12,500 crore" },
    { key: "beneficiary_count", value: "25 lakh farmers" },
    { key: "effective_date", value: "2026-09-01" },
  ],
});
assert.equal(programme.status, "ready");
assert.match(programme.localizedTitle ?? "", /पंजाब सरकार/u);
assert.match(programme.localizedSummary ?? "", /₹12,500 crore/);
assert.match(programme.localizedSummary ?? "", /25 lakh farmers/);
assert.match(programme.localizedSummary ?? "", /2026-09-01/);

const officialAction: CurrentAffairsLocalizationInput = {
  eventId: "event-6",
  authoringVersionId: "authoring-6",
  languageCode: "hi",
  sourceTitle: "Government of India update: 14 development projects worth over Rs 100 crore at Lucknow Cantonment",
  sourceSummary: "Verified official facts identify Raksha Mantri & UP Chief Minister as the acting body, the action as perform Bhoomi Pujan, and the subject as 14 development projects worth over Rs 100 crore at Lucknow Cantonment.",
  sourceOneLiner: "subject: 14 development projects worth over Rs 100 crore at Lucknow Cantonment.",
  templateId: "verified_official_action_v1",
  sourceKey: "pib",
  facts: [
    { key: "acting_entity", value: "Raksha Mantri & UP Chief Minister" },
    { key: "official_action", value: "perform Bhoomi Pujan" },
    { key: "action_subject", value: "14 development projects worth over Rs 100 crore at Lucknow Cantonment" },
  ],
};
const hiOfficialAction = localizeCurrentAffairsAuthoring(officialAction);
assert.equal(hiOfficialAction.status, "ready");
assert.match(hiOfficialAction.localizedTitle ?? "", /भारत सरकार/u);
assert.match(hiOfficialAction.localizedTitle ?? "", /14 development projects/);
assert.match(hiOfficialAction.localizedSummary ?? "", /Raksha Mantri & UP Chief Minister/);
assert.match(hiOfficialAction.localizedSummary ?? "", /perform Bhoomi Pujan/);
assert.match(hiOfficialAction.localizedSummary ?? "", /Rs 100 crore/);
assert.equal(hiOfficialAction.quality.missingCanonicalFacts.length, 0);
assert.equal(hiOfficialAction.quality.sharedTranslationQuality.approvable, true);

const genericPunjabi: CurrentAffairsLocalizationInput = {
  eventId: "event-7",
  authoringVersionId: "authoring-7",
  languageCode: "pa",
  sourceTitle: "Government of India national affairs verified-fact update",
  sourceSummary: "Verified facts for this national affairs development are official action: notifies; subject: Legal Metrology Indian Standard Time Rules 2026; effective date: 2026-09-01.",
  sourceOneLiner: "official action: notifies; subject: Legal Metrology Indian Standard Time Rules 2026.",
  templateId: "generic_verified_fact_graph_v1",
  sourceKey: "pib",
  facts: [
    { key: "official_action", value: "notifies" },
    { key: "action_subject", value: "Legal Metrology Indian Standard Time Rules 2026" },
    { key: "effective_date", value: "2026-09-01" },
  ],
};
const paGeneric = localizeCurrentAffairsAuthoring(genericPunjabi);
assert.equal(paGeneric.status, "ready");
assert.match(paGeneric.localizedTitle ?? "", /ਭਾਰਤ ਸਰਕਾਰ/u);
assert.match(paGeneric.localizedSummary ?? "", /notifies/);
assert.match(paGeneric.localizedSummary ?? "", /Legal Metrology Indian Standard Time Rules 2026/);
assert.match(paGeneric.localizedSummary ?? "", /2026-09-01/);
assert.equal(paGeneric.quality.missingCanonicalFacts.length, 0);
assert.equal(paGeneric.quality.expectedScriptPresent, true);

const genericManualParity = evaluateCurrentAffairsLocalization({
  input: genericPunjabi,
  localizedTitle: "ਭਾਰਤ ਸਰਕਾਰ ਅਪਡੇਟ",
  localizedSummary: "Legal Metrology Indian Standard Time Rules 2026 ਲਈ ਅਪਡੇਟ ਹੈ।",
  localizedOneLiner: "ਅਪਡੇਟ।",
});
assert.ok(genericManualParity.missingCanonicalFacts.some((item) => item.key === "official_action"));
assert.ok(genericManualParity.missingCanonicalFacts.some((item) => item.key === "effective_date"));

const appointmentFingerprintInput: CurrentAffairsLocalizationInput = { ...appointmentBase, languageCode: "hi" };
assert.equal(
  localizationInputFingerprint(appointmentFingerprintInput),
  legacyLocalizationFingerprint(appointmentFingerprintInput),
  "existing CP010 templates must retain their fingerprint and avoid unnecessary rewrites",
);
assert.notEqual(
  localizationInputFingerprint(genericPunjabi),
  legacyLocalizationFingerprint(genericPunjabi),
  "CP035 generic templates must invalidate the old needs-editorial fingerprint",
);

const unsupported = localizeCurrentAffairsAuthoring({
  eventId: "event-5",
  authoringVersionId: "authoring-5",
  languageCode: "pa",
  sourceTitle: "Editor-written source-independent title",
  sourceSummary: "Editor-written source-independent summary.",
  templateId: "manual",
  sourceKey: "pib",
  facts: [{ key: "rank", value: "4" }],
});
assert.equal(unsupported.status, "needs_editorial");
assert.equal(unsupported.localizedTitle, undefined);

console.log("Current Affairs Studio CP035 multilingual localization recovery contracts passed");
