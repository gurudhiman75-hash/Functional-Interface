import assert from "node:assert/strict";

import {
  classifyCurrentAffairsSignal,
  discoveryKeywords,
  extractResearchSignals,
  parseSyndicationFeed,
  pdfCandidateDedupeKey,
  researchSignalFingerprint,
} from "./ingestion";

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

console.log("Current Affairs Studio CP-049 ingestion and important-story classification contracts passed");