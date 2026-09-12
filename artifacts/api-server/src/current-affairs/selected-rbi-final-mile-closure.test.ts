import assert from "node:assert/strict";

import {
  recoverSelectedRbiFinalMileFactsForTest,
  rbiNewSiteUrlForTest,
  rbiOfficialFallbackUrlsForTest,
  SELECTED_RBI_FINAL_MILE_CLOSURE_VERSION,
} from "./selected-rbi-final-mile-closure";

{
  const title = "Money Market Operations as on August 31, 2026";
  const urls = rbiOfficialFallbackUrlsForTest(
    "https://www.rbi.org.in/scripts/BS_PressReleaseDisplay.aspx?prid=63486",
    title,
  );
  assert.equal(urls.length >= 6, true);
  assert.equal(
    urls[0],
    "https://website.rbi.org.in/web/rbi/-/press-releases/money-market-operations-as-on-august-31-2026",
    "CP066 should try the durable RBI new-site slug before legacy press-release shells",
  );
  assert.equal(urls.some((url) => /FS_PressRelease\.aspx\?prid=63486/i.test(url)), true);
  assert.equal(urls.some((url) => new URL(url).hostname === "m.rbi.org.in"), true);
}

{
  assert.equal(
    rbiNewSiteUrlForTest(
      "Developments in India’s Balance of Payments during the First Quarter (April-June) of 2026-27",
    ),
    "https://website.rbi.org.in/web/rbi/-/press-releases/developments-in-indias-balance-of-payments-during-the-first-quarter-april-june-of-2026-27",
  );
}

{
  const facts = recoverSelectedRbiFinalMileFactsForTest({
    title: "Money Market Operations as on August 31, 2026",
    text: "MONEY MARKETS @ --> Money Markets @ Volume (One Leg) Weighted Average Rate Range A. Overnight Segment (I+II+III+IV) 6,65,977.81 4.98 1.00-5.60 I. Call Money 12,984.27 5.18 4.55-5.25",
  });
  assert.equal(facts.length, 3);
  assert.equal(facts.find((item) => item.key === "acting_entity")?.value, "Reserve Bank of India");
  assert.match(facts.find((item) => item.key === "action_subject")?.value ?? "", /₹6,65,977\.81 crore/);
  assert.match(facts.find((item) => item.key === "action_subject")?.value ?? "", /4\.98% weighted average rate/);
  assert.equal(facts.every((item) => item.evidenceClass.startsWith("cp066_rbi_")), true);
}

{
  const facts = recoverSelectedRbiFinalMileFactsForTest({
    title: "Developments in India’s Balance of Payments during the First Quarter (April-June) of 2026-27",
    text: "Preliminary data on India's balance of payments are presented in Statements I and II. Key Features of India’s BoP in Q1:2026-27 India’s current account deficit stood at US$ 4.2 billion (0.5 per cent of GDP) in Q1:2026-27 as compared to US$ 3.4 billion a year ago.",
  });
  assert.equal(facts.length, 3);
  assert.equal(facts.find((item) => item.key === "official_action")?.value, "reported");
  assert.match(facts.find((item) => item.key === "action_subject")?.value ?? "", /US\$ 4\.2 billion/);
  assert.match(facts.find((item) => item.key === "action_subject")?.value ?? "", /0\.5% of GDP/);
}

{
  const facts = recoverSelectedRbiFinalMileFactsForTest({
    title: "Unrelated RBI press release",
    text: "current account deficit stood at US$ 4.2 billion (0.5 per cent of GDP)",
  });
  assert.equal(facts.length, 0, "CP066 must remain scoped to the two selected RBI residual patterns");
}

assert.equal(
  SELECTED_RBI_FINAL_MILE_CLOSURE_VERSION,
  "ca-cp066-rbi-durable-official-delivery-v1",
);
console.log("CP066 RBI durable official-delivery closure contract passed");
