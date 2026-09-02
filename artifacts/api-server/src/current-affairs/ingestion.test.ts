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

console.log("Current Affairs Studio CP-049/050/052 ingestion, review visibility and one-day rescue contracts passed");
