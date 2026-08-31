import assert from "node:assert/strict";

import {
  assertAllowedPrimaryPageUrl,
  extractPrimaryPageFacts,
  extractPrimaryPageText,
  primaryPageContentHash,
} from "./primary-fact-extraction";

assert.equal(
  assertAllowedPrimaryPageUrl("isro", "https://www.isro.gov.in/example.html#section"),
  "https://www.isro.gov.in/example.html",
);
assert.equal(
  assertAllowedPrimaryPageUrl("rbi", "https://m.rbi.org.in/Scripts/example.aspx"),
  "https://m.rbi.org.in/Scripts/example.aspx",
);
assert.throws(
  () => assertAllowedPrimaryPageUrl("rbi", "https://example.com/fake-rbi"),
  /not allowed/,
);
assert.throws(
  () => assertAllowedPrimaryPageUrl("sebi", "http://www.sebi.gov.in/example"),
  /HTTPS/,
);

const html = `
<html><body>
<header>Navigation and unrelated numbers 999</header>
<main>
<h1>Official release</h1>
<p>Reserve Bank of India has appointed Smt. Ananya Rao as Executive Director.</p>
<p>The Financial Inclusion Index stood at 67.0 for March 2026.</p>
</main>
<footer>Copyright footer</footer>
</body></html>`;
const text = extractPrimaryPageText(html);
assert.match(text, /Ananya Rao/);
assert.doesNotMatch(text, /Navigation and unrelated/);
assert.doesNotMatch(text, /Copyright footer/);
assert.match(primaryPageContentHash(text), /^[a-f0-9]{64}$/);

const rbiFacts = extractPrimaryPageFacts(text);
assert.ok(rbiFacts.some((fact) => fact.factKey === "appointee" && /Ananya Rao/.test(fact.factValue)));
assert.ok(rbiFacts.some((fact) => fact.factKey === "position" && /Executive Director/.test(fact.factValue)));
assert.ok(rbiFacts.some((fact) => fact.factKey === "index_value" && fact.factValue === "67.0"));

const bankingFacts = extractPrimaryPageFacts(`
The Monetary Policy Committee decided to keep the policy repo rate at 5.50%.
The standing deposit facility rate remains at 5.25%, while the marginal standing facility rate and the Bank Rate remain at 5.75%.
The cash reserve ratio is 4.00% and the statutory liquidity ratio is 18.00%.
`);
assert.ok(bankingFacts.some((fact) => fact.factKey === "policy_repo_rate" && fact.factValue === "5.50%"));
assert.ok(bankingFacts.some((fact) => fact.factKey === "standing_deposit_facility_rate" && fact.factValue === "5.25%"));
assert.ok(bankingFacts.some((fact) => fact.factKey === "marginal_standing_facility_rate" && fact.factValue === "5.75%"));
assert.ok(bankingFacts.some((fact) => fact.factKey === "bank_rate" && fact.factValue === "5.75%"));
assert.ok(bankingFacts.some((fact) => fact.factKey === "cash_reserve_ratio" && fact.factValue === "4.00%"));
assert.ok(bankingFacts.some((fact) => fact.factKey === "statutory_liquidity_ratio" && fact.factValue === "18.00%"));

const spaceFacts = extractPrimaryPageFacts(`
The satellite operates in a 747 km Sun-synchronous orbit and provides global observations every 12 days.
Mission Life: 5 Years.
The mission was launched onboard GSLV-F16.
`);
assert.ok(spaceFacts.some((fact) => fact.factKey === "orbit_altitude" && fact.factValue === "747 km"));
assert.ok(spaceFacts.some((fact) => fact.factKey === "repeat_cycle" && fact.factValue === "12 days"));
assert.ok(spaceFacts.some((fact) => fact.factKey === "mission_life" && fact.factValue === "5 years"));
assert.ok(spaceFacts.some((fact) => fact.factKey === "launcher" && fact.factValue === "GSLV-F16"));

const schemeFacts = extractPrimaryPageFacts(`
The programme has a total outlay of ₹12,500 crore and will provide support to 25 lakh farmers.
The guidelines shall come into force on 1 September 2026.
The programme has a target of 80% coverage by 2030.
`);
assert.ok(schemeFacts.some((fact) => fact.factKey === "scheme_outlay" && /12,500 crore/.test(fact.factValue)));
assert.ok(schemeFacts.some((fact) => fact.factKey === "beneficiary_count" && /25 lakh farmers/.test(fact.factValue)));
assert.ok(schemeFacts.some((fact) => fact.factKey === "effective_date" && fact.factValue === "2026-09-01"));
assert.ok(schemeFacts.some((fact) => fact.factKey === "target_percentage" && fact.factValue === "80%"));
assert.ok(schemeFacts.some((fact) => fact.factKey === "target_year" && fact.factValue === "2030"));

const mouFacts = extractPrimaryPageFacts(
  "A Memorandum of Understanding between Securities and Exchange Board of India and National Institute of Securities Markets was signed.",
);
const mou = mouFacts.find((fact) => fact.factKey === "mou_parties");
assert.ok(mou);
assert.equal(
  mou.factValue,
  "Securities and Exchange Board of India and National Institute of Securities Markets",
  "trailing signing prose must not become part of a party name",
);

const ambiguous = extractPrimaryPageFacts(
  "The state ranked 2nd in one survey. It ranked 4th in another survey.",
);
assert.equal(ambiguous.some((fact) => fact.factKey === "rank"), false, "ambiguous repeated generic keys must be dropped");

console.log("Current Affairs Studio CP008 primary fact extraction contracts passed");
