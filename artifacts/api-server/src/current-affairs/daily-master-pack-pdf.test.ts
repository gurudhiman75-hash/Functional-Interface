import assert from "node:assert/strict";

import { ensureCurrentAffairsFonts } from "../../ensure-current-affairs-fonts.mjs";
import { buildDailyMasterPackPayload, type DailyMasterPackEvent, type DailyMasterPackPayload } from "./daily-master-pack";
import {
  assertDailyMasterPackPdfFontCoverage,
  assertDailyMasterPackPdfPayload,
  renderDailyMasterPackPdf,
} from "./daily-master-pack-pdf";

await ensureCurrentAffairsFonts();

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

const localizedBase = {
  id: "33333333-3333-4333-8333-333333333333",
  publicCode: "CA-20260830-LOCAL1",
  category: "economy_banking",
  eventDate: "2026-08-30",
  examFamilies: ["banking", "ssc"],
  sources: [{ name: "Reserve Bank of India", url: "https://www.rbi.org.in/", primary: true }],
} satisfies Omit<DailyMasterPackEvent, "title" | "summary" | "oneLiner" | "facts">;

const hindiPayload = buildDailyMasterPackPayload("2026-08-30", [{
  ...localizedBase,
  title: "भारतीय रिज़र्व बैंक ने नई बैंकिंग पहल की घोषणा की",
  summary: "भारतीय रिज़र्व बैंक ने डिजिटल भुगतान व्यवस्था के लिए सत्यापित नई पहल की घोषणा की।",
  oneLiner: "याद रखें कि यह पहल भारतीय रिज़र्व बैंक से संबंधित है।",
  facts: [
    { key: "regulator", label: "नियामक", value: "Reserve Bank of India", type: "entity", confidence: 0.99 },
    { key: "effective_date", label: "प्रभावी तिथि", value: "30 August 2026", type: "date", confidence: 0.98 },
  ],
}], "hi");

const punjabiPayload = buildDailyMasterPackPayload("2026-08-30", [{
  ...localizedBase,
  id: "44444444-4444-4444-8444-444444444444",
  publicCode: "CA-20260830-LOCAL2",
  category: "punjab",
  title: "ਪੰਜਾਬ ਸਰਕਾਰ ਨੇ ਨਵੀਂ ਸਿੱਖਿਆ ਪਹਿਲ ਦੀ ਘੋਸ਼ਣਾ ਕੀਤੀ",
  summary: "ਪੰਜਾਬ ਸਰਕਾਰ ਨੇ ਵਿਦਿਆਰਥੀਆਂ ਲਈ ਪ੍ਰਮਾਣਿਤ ਨਵੀਂ ਸਿੱਖਿਆ ਪਹਿਲ ਦੀ ਘੋਸ਼ਣਾ ਕੀਤੀ।",
  oneLiner: "ਯਾਦ ਰੱਖੋ ਕਿ ਇਹ ਪਹਿਲ ਪੰਜਾਬ ਸਰਕਾਰ ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ।",
  facts: [
    { key: "state", label: "ਰਾਜ", value: "Punjab", type: "entity", confidence: 0.99 },
    { key: "initiative", label: "ਪਹਿਲ", value: "Education initiative", type: "string", confidence: 0.97 },
  ],
}], "pa");

assert.equal(assertDailyMasterPackPdfPayload(sample), sample);
assert.equal(assertDailyMasterPackPdfPayload(hindiPayload), hindiPayload);
assert.equal(assertDailyMasterPackPdfPayload(punjabiPayload), punjabiPayload);
assert.throws(() => assertDailyMasterPackPdfPayload(null), /payload is missing/);
assert.throws(() => assertDailyMasterPackPdfPayload({ ...sample, contentDate: "30-08-2026" }), /invalid content date/);
assert.throws(() => assertDailyMasterPackPdfPayload({ ...sample, language: "fr" }), /must be en, hi or pa/);

const englishCoverage = assertDailyMasterPackPdfFontCoverage(sample);
assert.equal(englishCoverage.fontFamily, "sans-serif");
assert.equal(englishCoverage.checkedCodePoints, 0);

const hindiCoverage = assertDailyMasterPackPdfFontCoverage(hindiPayload);
assert.equal(hindiCoverage.fontFamily, "ExamtreeDevanagari");
assert.ok(hindiCoverage.checkedCodePoints >= 20, `expected Devanagari coverage checks, got ${hindiCoverage.checkedCodePoints}`);

const punjabiCoverage = assertDailyMasterPackPdfFontCoverage(punjabiPayload);
assert.equal(punjabiCoverage.fontFamily, "ExamtreeGurmukhi");
assert.ok(punjabiCoverage.checkedCodePoints >= 20, `expected Gurmukhi coverage checks, got ${punjabiCoverage.checkedCodePoints}`);

for (const payload of [sample, hindiPayload, punjabiPayload]) {
  const rendered = renderDailyMasterPackPdf(payload);
  assert.ok(Buffer.isBuffer(rendered.buffer));
  assert.equal(rendered.contentDate, payload.contentDate);
  assert.equal(rendered.eventCount, payload.eventCount);
  assert.equal(rendered.language, payload.language);
  assert.ok(rendered.pageCount >= 1);
  assert.ok(rendered.buffer.length > 1_000, `expected a non-trivial ${payload.language} PDF, got ${rendered.buffer.length} bytes`);
  assert.equal(rendered.buffer.subarray(0, 5).toString("ascii"), "%PDF-");
  assert.ok(rendered.buffer.subarray(Math.max(0, rendered.buffer.length - 128)).toString("latin1").includes("%%EOF"));
}

console.log("CP-041 canonical EN/HI/PA PDF font, glyph-coverage and native rendering contracts passed");
