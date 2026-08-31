import assert from "node:assert/strict";
import { parsePibPostedDateListing } from "./pib-historical-backfill";

const html = `
  <a href="/PressReleasePage.aspx?PRID=2304613&lang=1&reg=3">Target release</a>
  <span>Posted on: 30 Aug 2026</span>
  <a href="/PressReleasePage.aspx?PRID=2304000&lang=1&reg=3">Wrong-day release</a>
  <span>Posted on: 29 Aug 2026</span>
  <a href="https://example.com/PressReleasePage.aspx?PRID=2304999">External release</a>
  <span>Posted on: 30 Aug 2026</span>
`;

const entries = parsePibPostedDateListing(html, "2026-08-30");
assert.equal(entries.length, 1);
assert.equal(entries[0]?.externalId, "2304613");
assert.equal(entries[0]?.publishedAt, "2026-08-30T00:00:00.000Z");
console.log("CP034 PIB archive contract passed");
