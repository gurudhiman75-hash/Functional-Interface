import assert from "node:assert/strict";

import { buildDailyMasterPackPayload, renderDailyMasterPackMarkdown } from "./daily-master-pack";

const payload = buildDailyMasterPackPayload("2026-08-30", [
  {
    id: "event-1",
    publicCode: "CA-20260830-AAAA1111",
    category: "economy_banking",
    eventDate: "2026-08-30",
    title: "RBI issues verified policy update",
    summary: "The Reserve Bank of India issued a policy update for regulated entities.",
    oneLiner: "Remember the regulator and the effective date.",
    examFamilies: ["banking", "ssc"],
    facts: [
      { key: "regulator", value: "Reserve Bank of India", type: "entity", confidence: 0.99 },
      { key: "effective_date", value: "30 August 2026", type: "date", confidence: 0.98 },
    ],
    sources: [
      { name: "Reserve Bank of India", url: "https://www.rbi.org.in/", primary: true },
    ],
  },
  {
    id: "event-2",
    publicCode: "CA-20260830-BBBB2222",
    category: "punjab",
    eventDate: "2026-08-30",
    title: "Punjab announces verified state initiative",
    summary: "Punjab announced a state initiative with verified implementation details.",
    oneLiner: "Remember the implementing state authority.",
    examFamilies: ["punjab"],
    facts: [
      { key: "state", value: "Punjab", type: "entity", confidence: 0.99 },
    ],
    sources: [
      { name: "Punjab Lok Bhavan", url: "https://www.punjabrajbhavan.gov.in/home/press/", primary: true },
    ],
  },
]);

assert.equal(payload.eventCount, 2);
assert.equal(payload.categoryCount, 2);
assert.deepEqual(payload.sections.map((section) => section.category), ["economy_banking", "punjab"]);

const markdown = renderDailyMasterPackMarkdown(payload);
assert.match(markdown, /Examtree Daily Current Affairs/);
assert.match(markdown, /Economy & Banking/);
assert.match(markdown, /Punjab/);
assert.match(markdown, /Reserve Bank of India/);
assert.match(markdown, /Exam relevance/);
assert.match(markdown, /Draft only/);

console.log("CP-036 daily master pack rendering tests passed");
