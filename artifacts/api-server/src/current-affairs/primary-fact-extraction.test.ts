import assert from "node:assert/strict";

import { authorSourceIndependentEvent } from "./original-authoring";
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

const bopFacts = extractPrimaryPageFacts(`
India's current account recorded a deficit of US$ 2.4 billion (0.2 per cent of GDP) in the first quarter of 2026-27.
Net services receipts increased to US$ 53.1 billion during the quarter.
`);
assert.ok(bopFacts.some((fact) => fact.factKey === "current_account_status" && fact.factValue === "deficit"));
assert.ok(bopFacts.some((fact) => fact.factKey === "current_account_amount" && fact.factValue === "US$ 2.4 billion"));
assert.ok(bopFacts.some((fact) => fact.factKey === "current_account_gdp_share" && fact.factValue === "0.2% of GDP"));
assert.ok(bopFacts.some((fact) => fact.factKey === "net_services_receipts" && fact.factValue === "US$ 53.1 billion"));

const bopRbiWordingFacts = extractPrimaryPageFacts(
  "India’s current account deficit (CAD) widened to US$ 2.4 billion (0.2 per cent of GDP) in Q1:2026-27.",
);
assert.ok(bopRbiWordingFacts.some((fact) => fact.factKey === "current_account_status" && fact.factValue === "deficit"));
assert.ok(bopRbiWordingFacts.some((fact) => fact.factKey === "current_account_amount" && fact.factValue === "US$ 2.4 billion"));
assert.ok(bopRbiWordingFacts.some((fact) => fact.factKey === "current_account_gdp_share" && fact.factValue === "0.2% of GDP"));

const bopAuthoring = authorSourceIndependentEvent({
  eventId: "cp060-bop",
  eventDate: "2026-09-01",
  category: "economy_banking",
  sourceKey: "rbi",
  sourceTitle: "Developments in India’s Balance of Payments during the First Quarter (April-June) of 2026-27",
  facts: bopFacts.map((fact) => ({ key: fact.factKey, value: fact.factValue, type: fact.factType })),
});
assert.equal(bopAuthoring.status, "ready");
assert.match(bopAuthoring.title ?? "", /India current account deficit/);
assert.match(bopAuthoring.summary ?? "", /0\.2% of GDP/);
assert.ok(bopAuthoring.sourceTitleSimilarity < 0.72);

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

const shakti = authorSourceIndependentEvent({
  eventId: "cp060-shakti",
  eventDate: "2026-09-01",
  category: "defence",
  sourceKey: "pib",
  sourceTitle: "AVM SHAKTI SHARMA SCRIPTS HISTORY AS FIRST (NON-MEDICAL) WOMAN TWO-STAR OFFICER IN THE DEFENCE SERVICES",
  facts: [
    { key: "appointee", value: "AVM SHAKTI SHARMA" },
    { key: "position", value: "FIRST (NON-MEDICAL) WOMAN TWO-STAR OFFICER IN THE DEFENCE SERVICES" },
  ],
});
assert.equal(shakti.status, "ready");
assert.match(shakti.title ?? "", /Shakti Sharma becomes first non-medical woman two-star officer/i);
assert.ok(shakti.sourceTitleSimilarity < 0.72);

const kaaSanjeeb = authorSourceIndependentEvent({
  eventId: "cp060-kaa",
  eventDate: "2026-09-01",
  category: "defence",
  sourceKey: "pib",
  sourceTitle: "AIR MARSHAL KAA SANJEEB TAKES OVER AS AIR OFFICER-IN-CHARGE MAINTENANCE OF THE INDIAN AIR FORCE",
  facts: [
    { key: "appointee", value: "AIR MARSHAL KAA SANJEEB" },
    { key: "position", value: "AIR OFFICER-IN-CHARGE MAINTENANCE OF THE INDIAN AIR FORCE" },
  ],
});
assert.equal(kaaSanjeeb.status, "ready");
assert.match(kaaSanjeeb.title ?? "", /KAA Sanjeeb assumes IAF maintenance leadership/);
assert.ok(kaaSanjeeb.sourceTitleSimilarity < 0.72);

const cciAseem = authorSourceIndependentEvent({
  eventId: "cp060-cci-aseem",
  eventDate: "2026-09-01",
  category: "national",
  sourceKey: "pib",
  sourceTitle: "CCI approves acquisition of Aseem Infrastructure Finance Limited by TPG Nicobar SG Pte. Ltd. and related transactions",
  facts: [
    { key: "acting_entity", value: "CCI" },
    { key: "official_action", value: "approves" },
    { key: "action_subject", value: "acquisition of Aseem Infrastructure Finance Limited by TPG Nicobar SG Pte. Ltd. and related transactions" },
  ],
});
assert.equal(cciAseem.status, "ready");
assert.match(cciAseem.title ?? "", /TPG Nicobar.*purchase.*Aseem Infrastructure Finance.*CCI clearance/i);
assert.ok(cciAseem.sourceTitleSimilarity < 0.72);

const cciApollo = authorSourceIndependentEvent({
  eventId: "cp060-cci-apollo",
  eventDate: "2026-09-01",
  category: "national",
  sourceKey: "pib",
  sourceTitle: "CCI approves acquisition of up to 100% equity shareholding of Apollo Fertility Centre (AFCPL) and Apollo Specialty Hospitals (ASHPL) by Kids Clinic India Ltd. (KCIL) and related transactions",
  facts: [
    { key: "acting_entity", value: "CCI" },
    { key: "official_action", value: "approves" },
    { key: "action_subject", value: "acquisition of up to 100% equity shareholding of Apollo Fertility Centre (AFCPL) and Apollo Specialty Hospitals (ASHPL) by Kids Clinic India Ltd. (KCIL) and related transactions" },
    { key: "percentage", value: "100%" },
  ],
});
assert.equal(cciApollo.status, "ready");
assert.match(cciApollo.title ?? "", /Kids Clinic India.*purchase.*Apollo Fertility Centre.*Apollo Specialty Hospitals.*CCI clearance/i);
assert.ok(cciApollo.sourceTitleSimilarity < 0.72);

const dgft = authorSourceIndependentEvent({
  eventId: "cp060-dgft",
  eventDate: "2026-09-01",
  category: "national",
  sourceKey: "pib",
  sourceTitle: "DGFT Enables Automated Issuance of Free Sale and Commerce Certificates to Promote Ease of Doing Business",
  facts: [
    { key: "acting_entity", value: "DGFT" },
    { key: "official_action", value: "enabled" },
    { key: "action_subject", value: "Automated Issuance of Free Sale and Commerce Certificates to Promote Ease of Doing Business" },
  ],
});
assert.equal(dgft.status, "ready");
assert.equal(dgft.title, "DGFT automates Free Sale and Commerce Certificate issuance");
assert.ok(dgft.sourceTitleSimilarity < 0.72);

const indiaDenmark = authorSourceIndependentEvent({
  eventId: "cp060-india-denmark",
  eventDate: "2026-09-01",
  category: "international",
  sourceKey: "pib",
  sourceTitle: "India–Denmark Strengthen Bilateral Cooperation in MSME Development, Innovation & Intellectual Property",
  facts: [
    { key: "acting_entity", value: "India–Denmark" },
    { key: "official_action", value: "strengthen" },
    { key: "action_subject", value: "Bilateral Cooperation in MSME Development, Innovation & Intellectual Property" },
  ],
});
assert.equal(indiaDenmark.status, "ready");
assert.match(indiaDenmark.title ?? "", /India and Denmark deepen MSME Development, Innovation & IP cooperation/);
assert.ok(indiaDenmark.sourceTitleSimilarity < 0.72);

const malformedPm = authorSourceIndependentEvent({
  eventId: "cp060-malformed-pm",
  eventDate: "2026-09-01",
  category: "international",
  sourceKey: "pib",
  sourceTitle: "PM to participate in Valedictory Session of Departmental Summit on Water Security on 2nd September",
  facts: [
    { key: "acting_entity", value: "PM to" },
    { key: "official_action", value: "participate" },
    { key: "action_subject", value: "Valedictory Session of Departmental Summit on Water Security on 2nd September" },
  ],
});
assert.equal(malformedPm.status, "needs_editorial");
assert.ok(malformedPm.reasons.some((reason) => /actor is malformed/i.test(reason)));

const exactVrrr = authorSourceIndependentEvent({
  eventId: "cp060-vrrr",
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
assert.equal(exactVrrr.status, "needs_editorial", "CP060/061 must not weaken the 0.72 near-copy safeguard");

console.log("Current Affairs Studio CP008/060/061 primary-fact and selected-blocker recovery contracts passed");
