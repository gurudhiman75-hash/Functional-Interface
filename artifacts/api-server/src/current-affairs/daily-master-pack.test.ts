import assert from "node:assert/strict";

import {
  buildDailyMasterPackPayload,
  evaluateLocalizedMasterPackParity,
  renderDailyMasterPackMarkdown,
  type DailyMasterPackEvent,
} from "./daily-master-pack";
import "./daily-master-pack-pdf.test";

const englishEvents: DailyMasterPackEvent[] = [
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
];

const payload = buildDailyMasterPackPayload("2026-08-30", englishEvents);
assert.equal(payload.language, "en");
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

const hindiEvents: DailyMasterPackEvent[] = [
  {
    ...englishEvents[0]!,
    title: "RBI ने सत्यापित नीति अपडेट जारी किया",
    summary: "भारतीय रिज़र्व बैंक ने विनियमित संस्थाओं के लिए नीति अपडेट जारी किया।",
    oneLiner: "नियामक और प्रभावी तिथि याद रखें।",
    facts: englishEvents[0]!.facts.map((fact) => ({
      ...fact,
      label: fact.key === "regulator" ? "नियामक" : "प्रभावी तिथि",
    })),
  },
  {
    ...englishEvents[1]!,
    title: "पंजाब ने सत्यापित राज्य पहल की घोषणा की",
    summary: "पंजाब ने सत्यापित कार्यान्वयन विवरण वाली राज्य पहल की घोषणा की।",
    oneLiner: "कार्यान्वयन करने वाले राज्य प्राधिकरण को याद रखें।",
    facts: englishEvents[1]!.facts.map((fact) => ({ ...fact, label: "राज्य" })),
  },
];
const hindiPayload = buildDailyMasterPackPayload("2026-08-30", hindiEvents, "hi");
const hindiMarkdown = renderDailyMasterPackMarkdown(hindiPayload);
assert.equal(hindiPayload.language, "hi");
assert.deepEqual(hindiPayload.sections.map((section) => section.label), ["अर्थव्यवस्था एवं बैंकिंग", "पंजाब"]);
assert.match(hindiMarkdown, /Examtree दैनिक करेंट अफेयर्स/);
assert.match(hindiMarkdown, /समाचार में क्यों/);
assert.match(hindiMarkdown, /मुख्य तथ्य/);
assert.match(hindiMarkdown, /परीक्षा प्रासंगिकता/);
assert.match(hindiMarkdown, /भारतीय रिज़र्व बैंक/);

const punjabiEvents: DailyMasterPackEvent[] = [
  {
    ...englishEvents[0]!,
    title: "RBI ਨੇ ਪ੍ਰਮਾਣਿਤ ਨੀਤੀ ਅਪਡੇਟ ਜਾਰੀ ਕੀਤਾ",
    summary: "ਭਾਰਤੀ ਰਿਜ਼ਰਵ ਬੈਂਕ ਨੇ ਨਿਯੰਤਰਿਤ ਸੰਸਥਾਵਾਂ ਲਈ ਨੀਤੀ ਅਪਡੇਟ ਜਾਰੀ ਕੀਤਾ।",
    oneLiner: "ਨਿਯਾਮਕ ਅਤੇ ਲਾਗੂ ਮਿਤੀ ਯਾਦ ਰੱਖੋ।",
    facts: englishEvents[0]!.facts.map((fact) => ({
      ...fact,
      label: fact.key === "regulator" ? "ਨਿਯਾਮਕ" : "ਲਾਗੂ ਮਿਤੀ",
    })),
  },
  {
    ...englishEvents[1]!,
    title: "ਪੰਜਾਬ ਨੇ ਪ੍ਰਮਾਣਿਤ ਰਾਜ ਪਹਿਲ ਦਾ ਐਲਾਨ ਕੀਤਾ",
    summary: "ਪੰਜਾਬ ਨੇ ਪ੍ਰਮਾਣਿਤ ਲਾਗੂਕਰਨ ਵੇਰਵਿਆਂ ਵਾਲੀ ਰਾਜ ਪਹਿਲ ਦਾ ਐਲਾਨ ਕੀਤਾ।",
    oneLiner: "ਲਾਗੂ ਕਰਨ ਵਾਲੀ ਰਾਜ ਅਥਾਰਟੀ ਨੂੰ ਯਾਦ ਰੱਖੋ।",
    facts: englishEvents[1]!.facts.map((fact) => ({ ...fact, label: "ਰਾਜ" })),
  },
];
const punjabiPayload = buildDailyMasterPackPayload("2026-08-30", punjabiEvents, "pa");
const punjabiMarkdown = renderDailyMasterPackMarkdown(punjabiPayload);
assert.equal(punjabiPayload.language, "pa");
assert.deepEqual(punjabiPayload.sections.map((section) => section.label), ["ਅਰਥਵਿਵਸਥਾ ਅਤੇ ਬੈਂਕਿੰਗ", "ਪੰਜਾਬ"]);
assert.match(punjabiMarkdown, /Examtree ਰੋਜ਼ਾਨਾ ਕਰੰਟ ਅਫੇਅਰਜ਼/);
assert.match(punjabiMarkdown, /ਖ਼ਬਰਾਂ ਵਿੱਚ ਕਿਉਂ/);
assert.match(punjabiMarkdown, /ਮੁੱਖ ਤੱਥ/);
assert.match(punjabiMarkdown, /ਪ੍ਰੀਖਿਆ ਸੰਬੰਧਤਾ/);
assert.match(punjabiMarkdown, /ਭਾਰਤੀ ਰਿਜ਼ਰਵ ਬੈਂਕ/);

const hindiParity = evaluateLocalizedMasterPackParity(englishEvents, hindiEvents);
assert.equal(hindiParity.complete, true);
assert.equal(hindiParity.expectedEventCount, 2);
assert.equal(hindiParity.localizedEventCount, 2);
assert.deepEqual(hindiParity.missingEventIds, []);

const incompleteParity = evaluateLocalizedMasterPackParity(englishEvents, hindiEvents.slice(0, 1));
assert.equal(incompleteParity.complete, false);
assert.deepEqual(incompleteParity.missingEventIds, ["event-2"]);
assert.deepEqual(incompleteParity.missingPublicCodes, ["CA-20260830-BBBB2222"]);

const extraParity = evaluateLocalizedMasterPackParity(englishEvents, [
  ...hindiEvents,
  { ...hindiEvents[0]!, id: "event-extra", publicCode: "CA-20260830-EXTRA" },
]);
assert.equal(extraParity.complete, false);
assert.deepEqual(extraParity.extraEventIds, ["event-extra"]);

console.log("CP-036/038/040 daily master pack text, PDF and multilingual parity tests passed");
