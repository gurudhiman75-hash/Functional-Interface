import assert from "node:assert/strict";

import { findListingDate, parseOfficialListing } from "./official-listing";

assert.equal(findListingDate("Aug 24, 2026"), "2026-08-24T00:00:00.000Z");
assert.equal(findListingDate("24 August 2026"), "2026-08-24T00:00:00.000Z");
assert.equal(findListingDate("24-08-2026"), "2026-08-24T00:00:00.000Z");
assert.equal(findListingDate("2026-08-24"), "2026-08-24T00:00:00.000Z");

const sebiHtml = `
<table>
<tr><td>Aug 24, 2026</td><td><a href="/media-and-notifications/press-releases/aug-2026/launch-of-cyber-suraksha-portal.html">Launch of Cyber Suraksha Portal</a></td></tr>
<tr><td>Aug 20, 2026</td><td><a href="/media-and-notifications/press-releases/aug-2026/sebi-studies-retail-participation.html">SEBI Studies Indicate Key Trends in Retail Participation</a></td></tr>
</table>
<a href="/">Home</a>`;
const sebi = parseOfficialListing(
  sebiHtml,
  "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=6&smid=0&ssid=23",
  "sebi_press_releases",
);
assert.equal(sebi.length, 2);
assert.equal(sebi[0]?.publishedAt, "2026-08-24T00:00:00.000Z");
assert.equal(sebi[0]?.dateConfidence, "contextual");
assert.match(sebi[0]?.link ?? "", /^https:\/\/www\.sebi\.gov\.in\//);

const isroHtml = `
<section id="latest-news">
<div><span>28 August 2026</span><a href="/ISRO_NASA_NISAR_one_year.html">ISRO and NASA Celebrate One Successful Year of NISAR Mission on Orbit</a></div>
<div><span>27 August 2026</span><a href="/SSLV_improved_stage_test.html">ISRO tests an improved version of the first stage of Small Satellite Launch Vehicle</a></div>
</section>`;
const isro = parseOfficialListing(isroHtml, "https://www.isro.gov.in/", "isro_latest_news");
assert.equal(isro.length, 2);
assert.equal(isro[0]?.publishedAt, "2026-08-28T00:00:00.000Z");

const undatedPunjab = parseOfficialListing(
  `<a href="/press-release-announcement/example-scheme/">Punjab Government launches new public welfare scheme</a>`,
  "https://punjab.gov.in/press-release-announcement/",
  "punjab_press_releases",
);
assert.equal(undatedPunjab.length, 1);
assert.equal(undatedPunjab[0]?.dateConfidence, "unknown");
assert.equal(undatedPunjab[0]?.publishedAt, undefined);

const external = parseOfficialListing(
  `<div>Aug 24, 2026 <a href="https://example.com/fake">SEBI launches investor portal</a></div>`,
  "https://www.sebi.gov.in/",
  "sebi_press_releases",
);
assert.equal(external.length, 0, "listing adapters must not follow unrelated external hosts");

console.log("Current Affairs Studio CP007 official listing contracts passed");
