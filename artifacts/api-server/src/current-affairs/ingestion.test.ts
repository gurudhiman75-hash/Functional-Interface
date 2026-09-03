import assert from "node:assert/strict";

import {
  headlineReviewProfile,
  resolveHeadlineReviewDate,
} from "./headline-review-runtime";
import {
  classifyCurrentAffairsSignal,
  discoveryKeywords,
  extractResearchSignals,
  parseSyndicationFeed,
  pdfCandidateDedupeKey,
  researchSignalFingerprint,
} from "./ingestion";
import {
  headlineRescueTerms,
  isOneDayOfficialRescueMatch,
  previousCalendarDate,
} from "./one-day-rescue-policy";
import {
  selectedAffairsProcessingBlockers,
  selectedAffairsProcessingStage,
} from "./selected-affairs-processing-policy";
import {
  extractSelectedHeadlineRecoveryClaims,
  extractSelectedPrimaryPageFacts,
  extractSelectedPrimaryPageText,
  primaryRecoveryUrlVariants,
  recoveryPageMatchesTitle,
} from "./selected-primary-recovery-policy";

const rss = `<?xml version="1.0"?>
<rss><channel>
  <item>
    <title>RBI announces new digital payments framework</title>
    <link>https://example.org/rbi-payments</link>
    <guid>item-1</guid>
    <pubDate>Fri, 28 Aug 2026 10:00:00 GMT</pubDate>
    <description><![CDATA[The framework introduces a new settlement mechanism for regulated payment entities.]]></description>
  </item>
  <item>
    <title>Punjab launches a new state scholarship initiative</title>
    <link>https://example.org/punjab-scholarship</link>
  </item>
</channel></rss>`;

const parsed = parseSyndicationFeed(rss, "https://example.org/feed.xml");
assert.equal(parsed.length, 2);
assert.equal(parsed[0]?.id, "item-1");
assert.equal(parsed[0]?.link, "https://example.org/rbi-payments");
assert.match(parsed[0]?.publishedAt ?? "", /^2026-08-28T10:00:00/);

const atom = `<?xml version="1.0"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <entry>
    <title>ISRO successfully tests a new propulsion system</title>
    <link rel="alternate" href="https://example.org/isro-test" />
    <id>tag:example.org,2026:isro-test</id>
    <updated>2026-08-28T12:00:00Z</updated>
    <summary>Technical background that is used only for discovery signals.</summary>
  </entry>
</feed>`;
const atomParsed = parseSyndicationFeed(atom, "https://example.org/atom.xml");
assert.equal(atomParsed.length, 1);
assert.equal(atomParsed[0]?.link, "https://example.org/isro-test");

const banking = classifyCurrentAffairsSignal(
  "Reserve Bank of India announces a monetary policy change affecting banks and digital payments",
);
assert.equal(banking.category, "economy_banking");
assert.ok(banking.score >= 60);

const punjab = classifyCurrentAffairsSignal(
  "Punjab Government launches a new scholarship scheme for students",
);
assert.equal(punjab.category, "punjab");
assert.ok(punjab.score >= 60);

// CP-049: important official headline structures from the 1-Sep production audit.
const sco = classifyCurrentAffairsSignal(
  "Prime Minister participates in the 26th SCO Summit in Bishkek, Kyrgyz Republic",
);
assert.equal(sco.category, "international");
assert.ok(sco.score >= 40);

const historicDefenceAppointment = classifyCurrentAffairsSignal(
  "AVM Shakti Sharma scripts history as first non-medical woman two-star officer in the defence services",
);
assert.equal(historicDefenceAppointment.category, "defence");
assert.ok(historicDefenceAppointment.score >= 45);

const officeTaking = classifyCurrentAffairsSignal(
  "Air Marshal Sandeep Thareja takes over as DGAFMS",
);
assert.ok(["appointments", "defence"].includes(officeTaking.category));
assert.ok(officeTaking.score >= 40);

const bilateral = classifyCurrentAffairsSignal(
  "India-Denmark strengthen bilateral cooperation in MSME development, innovation and intellectual property",
);
assert.equal(bilateral.category, "international");
assert.ok(bilateral.score >= 40);

const multilingualAi = classifyCurrentAffairsSignal(
  "BHASHINI Sangam strengthens India-Nepal collaboration on multilingual AI",
);
assert.equal(multilingualAi.category, "science_technology");
assert.ok(multilingualAi.score >= 35);

// CP-050: review visibility is independent from automatic inclusion. Even an
// auto-withheld headline receives product-family scores and remains selectable.
const withheldProfile = headlineReviewProfile({
  candidateId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  title: "Railway Board reviews routine yard remodelling preparatory work",
  publishedAt: "2026-09-01T10:00:00.000Z",
  candidateStatus: "rejected",
  rejectionReason: "gdelt_broad_only_low_signal",
  payload: {
    discoveryTargetDate: "2026-09-01",
    discoveryProvider: "gdelt_doc_2",
    discoveryEligible: false,
    discoveryScore: 31,
    categoryGuess: "national",
  },
  sourceKey: "gdelt_open_news",
  sourceName: "GDELT Open News",
  sourceUrl: "https://example.org/rail-yard-review",
  sourceTrustScore: 0.55,
  isPrimarySource: false,
}, "2026-09-01");
assert.equal(withheldProfile.autoEligible, false);
assert.equal(withheldProfile.candidateStatus, "rejected");
assert.equal(withheldProfile.discoveryScore, 31);
assert.equal(withheldProfile.examScores.filter((score) => ["ssc", "banking", "punjab"].includes(score.examFamily)).length, 3);
assert.ok(Number.isFinite(withheldProfile.relevanceScore));

const manuallySelectedProfile = headlineReviewProfile({
  candidateId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
  title: "Administrative monthly report released for departmental monitoring",
  publishedAt: "2026-09-01T08:00:00.000Z",
  candidateStatus: "rejected",
  payload: {
    discoveryTargetDate: "2026-09-01",
    manualEditorialSelected: true,
    manualEditorialSelectionReason: "Editor considers it important for this day's pack",
  },
  sourceKey: "official_source",
  sourceName: "Official Source",
  sourceUrl: "https://example.gov.in/monthly-report",
  sourceTrustScore: 0.9,
  isPrimarySource: true,
}, "2026-09-01");
assert.equal(manuallySelectedProfile.manualSelected, true);
assert.equal(manuallySelectedProfile.autoEligible, false, "machine status remains visible instead of being rewritten in the review model");
assert.match(manuallySelectedProfile.selectionReason ?? "", /Editor considers it important/);

assert.equal(
  resolveHeadlineReviewDate({ historicalTargetDate: "2026-09-01" }, null, "2026-08-31"),
  "2026-09-01",
);
assert.equal(
  resolveHeadlineReviewDate({ historicalTargetDate: "2026-02-30" }, "2026-09-01T20:00:00Z", "2026-08-31"),
  "2026-09-02",
  "invalid payload dates must not poison the India-calendar review date",
);

// CP-052: discovery remains target-date first. Rescue may inspect exactly the
// previous calendar day for primary evidence only after a current-day headline
// exposes a potentially missing story; it never broad-imports older news.
assert.equal(previousCalendarDate("2026-09-01"), "2026-08-31");
assert.equal(previousCalendarDate("2026-03-01"), "2026-02-28");

const metrologyRescue = isOneDayOfficialRescueMatch(
  "Why the new Indian Standard Time rules matter for digital systems",
  "Department of Consumer Affairs Notifies Legal Metrology (Indian Standard Time) Rules, 2026",
);
assert.equal(metrologyRescue.matched, true, "Legal Metrology / IST variants should resolve to the same story identity");
assert.ok(metrologyRescue.sharedAliasTerms.includes("ist"));
assert.ok(metrologyRescue.score >= 0.48);

const genericRulesFalsePositive = isOneDayOfficialRescueMatch(
  "Government notifies new rules for routine office administration",
  "Department of Consumer Affairs Notifies Legal Metrology (Indian Standard Time) Rules, 2026",
);
assert.equal(genericRulesFalsePositive.matched, false, "generic notify/rules wording must not create a rescue match");

const rbiAliasRescue = isOneDayOfficialRescueMatch(
  "RBI announces digital payments framework for regulated entities",
  "Reserve Bank of India announced a digital payments framework for regulated payment entities",
);
assert.equal(rbiAliasRescue.matched, true);
assert.ok(headlineRescueTerms("Reserve Bank of India announces policy").includes("rbi"));

// CP-053: Process Selected may advance clean events but must expose every gate
// instead of treating admin selection as verification or publication authority.
const processReady = {
  reviewEventPresent: true,
  eventStatus: "verified",
  verifiedFactCount: 4,
  openConflictCount: 0,
  officialEvidenceCount: 1,
  supportedOfficialEvidenceCount: 1,
  enrichmentFailureCount: 0,
  authoringStatus: "ready",
  hindiStatus: "ready",
  punjabiStatus: "manual",
};
assert.deepEqual(selectedAffairsProcessingBlockers(processReady), []);
assert.equal(selectedAffairsProcessingStage(processReady), "ready");

const processUnsupportedOfficial = {
  ...processReady,
  eventStatus: "review",
  verifiedFactCount: 0,
  officialEvidenceCount: 1,
  supportedOfficialEvidenceCount: 0,
  authoringStatus: "pending",
  hindiStatus: "missing",
  punjabiStatus: "missing",
};
assert.deepEqual(
  selectedAffairsProcessingBlockers(processUnsupportedOfficial),
  ["official_source_not_automatically_supported", "verification_required"],
);
assert.equal(selectedAffairsProcessingStage(processUnsupportedOfficial), "verification");

const processConflict = {
  ...processReady,
  openConflictCount: 1,
};
assert.ok(selectedAffairsProcessingBlockers(processConflict).includes("fact_conflict"));
assert.equal(selectedAffairsProcessingStage(processConflict), "verification");

const processLocalizationPending = {
  ...processReady,
  hindiStatus: "missing",
  punjabiStatus: "needs_editorial",
};
assert.deepEqual(
  selectedAffairsProcessingBlockers(processLocalizationPending),
  ["hindi_needs_editorial", "punjabi_needs_editorial"],
);
assert.equal(selectedAffairsProcessingStage(processLocalizationPending), "localization");

// CP-054: selected-primary recovery repairs stale headline semantics and may add
// page-backed facts, but it remains evidence-only. Strict CP-053 verification is
// still the next authority after these claims are materialized.
const plannedClaims = extractSelectedHeadlineRecoveryClaims(
  "PM to participate in Valedictory Session of Departmental Summit on Water Security on 2nd September",
);
assert.equal(plannedClaims.find((claim) => claim.factKey === "acting_entity")?.factValue, "PM");
assert.equal(plannedClaims.find((claim) => claim.factKey === "official_action")?.factValue, "scheduled participate");
assert.equal(plannedClaims.find((claim) => claim.factKey === "event_status")?.factValue, "planned");
assert.ok(!plannedClaims.some((claim) => claim.factValue === "PM to"));

const rbiAppointmentClaims = extractSelectedHeadlineRecoveryClaims(
  "RBI appoints Shri Suman Ray as new Executive Director",
);
assert.equal(rbiAppointmentClaims.find((claim) => claim.factKey === "acting_entity")?.factValue, "RBI");
assert.equal(rbiAppointmentClaims.find((claim) => claim.factKey === "appointee")?.factValue, "Shri Suman Ray");
assert.equal(rbiAppointmentClaims.find((claim) => claim.factKey === "position")?.factValue, "Executive Director");

const dgftClaims = extractSelectedHeadlineRecoveryClaims(
  "DGFT Enables Automated Issuance of Free Sale and Commerce Certificates to Promote Ease of Doing Business",
);
assert.equal(dgftClaims.find((claim) => claim.factKey === "acting_entity")?.factValue, "DGFT");
assert.equal(dgftClaims.find((claim) => claim.factKey === "official_action")?.factValue, "enabled");
assert.match(dgftClaims.find((claim) => claim.factKey === "action_subject")?.factValue ?? "", /Free Sale and Commerce Certificates/i);

const gdpTitle = "India’s GDP Performance";
const gdpHtml = `
<html><body>
<header>Press Information Bureau navigation</header>
<h1>India’s GDP Performance</h1>
<p>Real GDP growth stood at 7.8% in Q1 FY 2026-27 while real GVA growth was 8.2%.</p>
<p>Investment grew by 11.9%, household consumption grew by 7.1%, and exports rose by 12.0%.</p>
<footer>Common government footer</footer>
</body></html>`;
const gdpText = extractSelectedPrimaryPageText(gdpHtml);
assert.equal(recoveryPageMatchesTitle(gdpTitle, gdpText).matched, true);
const gdpFacts = extractSelectedPrimaryPageFacts(gdpTitle, gdpText);
assert.equal(gdpFacts.find((fact) => fact.factKey === "real_gdp_growth")?.factValue, "7.8%");
assert.equal(gdpFacts.find((fact) => fact.factKey === "real_gva_growth")?.factValue, "8.2%");
assert.equal(gdpFacts.find((fact) => fact.factKey === "investment_growth")?.factValue, "11.9%");
assert.equal(gdpFacts.find((fact) => fact.factKey === "household_consumption_growth")?.factValue, "7.1%");
assert.equal(gdpFacts.find((fact) => fact.factKey === "exports_growth")?.factValue, "12.0%");

const bopTitle = "Developments in India’s Balance of Payments during the First Quarter (April-June) of 2026-27";
const bopText = `
${bopTitle}
India recorded a current account deficit of US$ 4.2 billion, equivalent to 0.5 per cent of GDP.
The merchandise trade deficit was US$ 86.1 billion and net services receipts were US$ 51.6 billion.
Net FDI inflow was US$ 6.1 billion while net FPI outflow was US$ 9.6 billion.
`;
assert.equal(recoveryPageMatchesTitle(bopTitle, bopText).matched, true);
const bopFacts = extractSelectedPrimaryPageFacts(bopTitle, bopText);
assert.equal(bopFacts.find((fact) => fact.factKey === "current_account_deficit")?.factValue, "US$ 4.2 billion");
assert.equal(bopFacts.find((fact) => fact.factKey === "current_account_deficit_gdp_share")?.factValue, "0.5%");
assert.equal(bopFacts.find((fact) => fact.factKey === "merchandise_trade_deficit")?.factValue, "US$ 86.1 billion");
assert.equal(bopFacts.find((fact) => fact.factKey === "net_services_receipts")?.factValue, "US$ 51.6 billion");
assert.equal(bopFacts.find((fact) => fact.factKey === "net_fdi_inflow")?.factValue, "US$ 6.1 billion");
assert.equal(bopFacts.find((fact) => fact.factKey === "net_fpi_outflow")?.factValue, "US$ 9.6 billion");

const commonWrapper = "Press Information Bureau Government of India Home Releases Ministries Contact Sitemap";
assert.equal(recoveryPageMatchesTitle(gdpTitle, commonWrapper).matched, false, "common PIB wrapper must not be accepted as release evidence");

const pibVariants = primaryRecoveryUrlVariants("pib", "https://www.pib.gov.in/PressReleseDetail.aspx?PRID=2305422");
assert.ok(pibVariants.some((url) => /PressReleseDetailm\.aspx/i.test(url)));
const rbiVariants = primaryRecoveryUrlVariants("rbi", "https://www.rbi.org.in/scripts/BS_PressReleaseDisplay.aspx?prid=63491");
assert.ok(rbiVariants.some((url) => url.startsWith("https://m.rbi.org.in/")));

const keywords = discoveryKeywords(
  "Reserve Bank announces digital payments framework for regulated payment entities",
);
assert.ok(keywords.includes("reserve") || keywords.includes("payments"));
assert.ok(keywords.length <= 12);

const syntheticNewspaperText = `
Morning Edition

RBI announces new framework for digital payment operators
The Reserve Bank announced changes affecting regulated payment entities and settlement systems.
The framework will take effect after a transition period.

City traffic diversions announced for weekend festival
Several roads will be closed temporarily for a local cultural event.

Punjab launches statewide agriculture data initiative
The Punjab government approved a new scheme to improve farm data and service delivery.
The initiative will be implemented by the state department.

ISRO completes key test for next satellite mission
Scientists completed a propulsion test ahead of a future satellite launch.
`;
const signals = extractResearchSignals(syntheticNewspaperText);
assert.ok(signals.some((signal) => signal.categoryGuess === "economy_banking"));
assert.ok(signals.some((signal) => signal.categoryGuess === "punjab"));
assert.ok(signals.some((signal) => signal.categoryGuess === "space"));
assert.ok(signals.every((signal) => !Object.prototype.hasOwnProperty.call(signal, "body")));
assert.ok(signals.every((signal) => !Object.prototype.hasOwnProperty.call(signal, "summary")));

assert.equal(
  researchSignalFingerprint("RBI announces new framework for digital payment operators"),
  researchSignalFingerprint("RBI announces new framework for digital payment operators!"),
);
assert.equal(
  pdfCandidateDedupeKey("the_hindu", "a".repeat(64), "Example headline"),
  pdfCandidateDedupeKey("THE_HINDU", "a".repeat(64), "Example headline"),
);

console.log("Current Affairs Studio CP-049/050/052/053/054 ingestion, review, rescue, selected-processing and primary-recovery contracts passed");
