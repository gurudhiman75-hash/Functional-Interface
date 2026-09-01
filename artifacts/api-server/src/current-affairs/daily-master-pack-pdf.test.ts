import assert from "node:assert/strict";

import type { DailyMasterPackPayload } from "./daily-master-pack";
import { assertDailyMasterPackPdfPayload, renderDailyMasterPackPdf } from "./daily-master-pack-pdf";

const sample: DailyMasterPackPayload = {
  contentDate: "2026-08-30",
  generatedAt: "2026-08-31T02:00:00.000Z",
  language: "en",
  eventCount: 2,
  categoryCount: 2,
  sections: [
    {
      category: "national",
      label: "National Affairs",
      events: [
        {
          id: "11111111-1111-4111-8111-111111111111",
          publicCode: "CA-20260830-ABCDEF",
          category: "national",
          eventDate: "2026-08-30",
          title: "Government notifies an examination-relevant national rule",
          summary: "The Government notified a rule with direct relevance for current affairs preparation.",
          oneLiner: "Remember the notifying authority and effective date.",
          examFamilies: ["ssc", "punjab"],
          facts: [
            { key: "notifying_authority", value: "Union Government", type: "entity", confidence: 0.99 },
            { key: "effective_date", value: "30 August 2026", type: "date", confidence: 0.98 },
          ],
          sources: [
            { name: "Official Government Source", url: "https://example.gov.in/notice", primary: true },
          ],
        },
      ],
    },
    {
      category: "economy_banking",
      label: "Economy & Banking",
      events: [
        {
          id: "22222222-2222-4222-8222-222222222222",
          publicCode: "CA-20260830-GHIJKL",
          category: "economy_banking",
          eventDate: "2026-08-30",
          title: "Banking regulator announces a policy update",
          summary: "The regulator announced a policy update affecting the banking sector.",
          oneLiner: "Know the regulator, policy name and implementation date.",
          examFamilies: ["banking"],
          facts: Array.from({ length: 14 }, (_, index) => ({
            key: `fact_${index + 1}`,
            value: `Verified fact value ${index + 1} with enough text to exercise line wrapping in the generated document.`,
            type: "string",
            confidence: 0.95,
          })),
          sources: [
            { name: "Regulator", url: "https://example.org/regulator/update", primary: true },
            { name: "Supporting Source", url: "https://example.com/supporting", primary: false },
          ],
        },
      ],
    },
  ],
};

assert.equal(assertDailyMasterPackPdfPayload(sample), sample);
assert.throws(() => assertDailyMasterPackPdfPayload(null), /payload is missing/);
assert.throws(() => assertDailyMasterPackPdfPayload({ ...sample, contentDate: "30-08-2026" }), /invalid content date/);
assert.throws(() => assertDailyMasterPackPdfPayload({ ...sample, language: "hi" }), /English master pack only/);

const rendered = renderDailyMasterPackPdf(sample);
assert.ok(Buffer.isBuffer(rendered.buffer));
assert.equal(rendered.contentDate, sample.contentDate);
assert.equal(rendered.eventCount, sample.eventCount);
assert.ok(rendered.pageCount >= 1);
assert.ok(rendered.buffer.length > 1_000, `expected a non-trivial PDF, got ${rendered.buffer.length} bytes`);
assert.equal(rendered.buffer.subarray(0, 5).toString("ascii"), "%PDF-");
assert.ok(rendered.buffer.subarray(Math.max(0, rendered.buffer.length - 128)).toString("latin1").includes("%%EOF"));

console.log(`CP-038 canonical master-pack PDF contracts passed (${rendered.pageCount} page(s), ${rendered.buffer.length} bytes)`);
