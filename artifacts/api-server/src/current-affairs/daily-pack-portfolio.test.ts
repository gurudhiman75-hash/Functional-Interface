import assert from "node:assert/strict";

import { selectDailyMasterPackPortfolio, type DailyPackPortfolioEvent } from "./daily-pack-portfolio";

const event = (id: string, title: string, category = "national", summary = ""): DailyPackPortfolioEvent => ({
  id,
  title,
  summary,
  category,
  facts: [],
});

const sample = [
  event("sco", "Prime Minister participates in the 26th SCO Summit in Bishkek, Kyrgyz Republic", "international"),
  event("historic", "AVM Shakti Sharma scripts history as first non-medical woman two-star officer in the defence services", "defence"),
  event("kavach", "Indian Railways approves ₹170 Crore for Kavach 4.0 on remaining 712 Rkm of Moradabad Division"),
  event("interlocking", "Indian Railways approves ₹233 Crore for Electronic Interlocking at 21 Stations in Samastipur Division"),
  event("yard", "Indian Railways approves ₹125 Crore Bhavnagar Para Yard Remodeling Project in Gujarat"),
  event("bypass", "Indian Railways approves ₹272 Crore Bypass Line Between Adra and Joychandipahar to Boost Freight Capacity"),
  event("quiz1", "NHRC launches online Human Rights Quiz 2026 on MyGov ahead of Foundation Day"),
  event("quiz2", "Ministry of Earth Sciences launches Online National Quiz with MyGov to celebrate 20 years"),
  event("prep", "Ministry of Coal holds Preparatory Meeting for Special Campaign 6.0"),
  event("bank", "India Post Payments Bank launches DakPay Sound Box for Merchants and new digital platforms", "economy_banking"),
];

const decision = selectDailyMasterPackPortfolio(sample, 18);
assert.ok(decision.selectedIds.includes("sco"), "SCO summit must survive portfolio selection");
assert.ok(decision.selectedIds.includes("historic"), "historic first must survive portfolio selection");
assert.ok(decision.selectedIds.includes("kavach"), "rail-safety project should win a railway slot");
assert.ok(decision.selectedIds.includes("interlocking"), "rail-signalling project should win a railway slot");
assert.equal(decision.selectedIds.includes("yard"), false);
assert.equal(decision.selectedIds.includes("bypass"), false);
assert.equal(decision.selectedIds.includes("quiz1"), false, "routine MyGov quiz should be removed");
assert.equal(decision.selectedIds.includes("quiz2"), false, "routine national quiz should be removed");
assert.equal(decision.selectedIds.includes("prep"), false, "preparatory meetings should not enter the learner pack");
assert.ok(decision.selectedIds.includes("bank"));

const crowded = Array.from({ length: 25 }, (_, index) => event(`standard-${index}`, `Standard national policy development ${index}`));
crowded.push(event("critical-sco", "Prime Minister participates in the 26th SCO Summit", "international"));
const crowdedDecision = selectDailyMasterPackPortfolio(crowded, 18);
assert.ok(crowdedDecision.selectedIds.includes("critical-sco"), "critical stories cannot be displaced by the daily event cap");
assert.ok(crowdedDecision.selectedIds.length >= 18);

console.log("CP-049 daily Current Affairs portfolio contracts passed");
