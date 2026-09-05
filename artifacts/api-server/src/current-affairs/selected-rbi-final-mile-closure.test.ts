import assert from "node:assert/strict";

import {
  recoverSelectedRbiFinalMileFactsForTest,
  rbiOfficialFallbackUrlsForTest,
  SELECTED_RBI_FINAL_MILE_CLOSURE_VERSION,
} from "./selected-rbi-final-mile-closure";

{
  const urls = rbiOfficialFallbackUrlsForTest(
    "https://www.rbi.org.in/scripts/BS_PressReleaseDisplay.aspx?prid=63486",
  );
  assert.equal(urls.length >= 5, true);
  assert.equal(urls.some((url) => /FS_PressRelease\.aspx\?prid=63486/i.test(url)), true);
  assert.equal(urls.some((url) => new URL(url).hostname === "m.rbi.org.in"), true);
  for (const url of urls) {
    assert.equal(["www.rbi.org.in", "rbi.org.in", "m.rbi.org.in"].includes(new URL(url).hostname), true);
  }
}

{
  const facts = recoverSelectedRbiFinalMileFactsForTest({
    title: "Money Market Operations as on August 31, 2026",
    text: "MONEY MARKETS Volume (One Leg) Weighted Average Rate Range A. Overnight Segment (I+II+III+IV) 6,65,977.81 4.98 1.00-5.60 I. Call Money 12,984.27 5.18 4.55-5.25",
  });
  assert.equal(facts.length, 3);
  assert.equal(facts.find((item) => item.key === "acting_entity")?.value, "Reserve Bank of India");
  assert.match(facts.find((item) => item.key === "action_subject")?.value ?? "", /₹6,65,977\.81 crore/);
  assert.match(facts.find((item) => item.key === "action_subject")?.value ?? "", /4\.98% weighted average rate/);
}

{
  const facts = recoverSelectedRbiFinalMileFactsForTest({
    title: "Developments in India’s Balance of Payments during the First Quarter (April-June) of 2026-27",
    text: "Key Features of India’s BoP in Q1:2026-27 India’s current account deficit stood at US$ 4.2 billion (0.5 per cent of GDP) in Q1:2026-27 as compared to US$ 3.4 billion a year ago.",
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
  assert.equal(facts.length, 0, "CP065 must remain scoped to the two selected RBI residual patterns");
}

assert.equal(SELECTED_RBI_FINAL_MILE_CLOSURE_VERSION, "ca-cp065-rbi-final-mile-v1");
console.log("CP065 RBI final-mile closure contract passed");
