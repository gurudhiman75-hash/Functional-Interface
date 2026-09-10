import assert from "node:assert/strict";
import { solveLp009 } from "./lp-009.ts";
import type { Lp009LocalizedLanguage } from "./lp-009-localization-v1.ts";
import { generateLp009LocalizedBatchV3, LP_009_HI_PA_LOCALIZATION_REVIEW_V3 } from "./lp-009-localization-v3.ts";

const languages: readonly Lp009LocalizedLanguage[] = ["hi", "pa"];
const qls = ["LP-QL-033", "LP-QL-034", "LP-QL-035", "LP-QL-036"] as const;
const badYearGrammar = {
  hi: [/सभी व्यक्ति के जन्म-वर्ष/, /सभी अधिकारी के जन्म-वर्ष/, /सभी शोधकर्ता के जन्म-वर्ष/, /सभी सदस्य के जन्म-वर्ष/],
  pa: [/ਸਾਰੇ ਵਿਅਕਤੀ ਦੇ ਜਨਮ ਸਾਲ/, /ਸਾਰੇ ਅਧਿਕਾਰੀ ਦੇ ਜਨਮ ਸਾਲ/, /ਸਾਰੇ ਖੋਜਕਰਤਾ ਦੇ ਜਨਮ ਸਾਲ/, /ਸਾਰੇ ਮੈਂਬਰ ਦੇ ਜਨਮ ਸਾਲ/],
} as const;
const expectedYearSummaries = {
  hi: new Set([
    "शर्तों से सभी व्यक्तियों के जन्म-वर्ष तय हो जाते हैं।",
    "शर्तों से सभी अधिकारियों के जन्म-वर्ष तय हो जाते हैं।",
    "शर्तों से सभी शोधकर्ताओं के जन्म-वर्ष तय हो जाते हैं।",
    "शर्तों से सभी सदस्यों के जन्म-वर्ष तय हो जाते हैं।",
  ]),
  pa: new Set([
    "ਸ਼ਰਤਾਂ ਤੋਂ ਸਾਰੇ ਵਿਅਕਤੀਆਂ ਦੇ ਜਨਮ ਸਾਲ ਨਿਸ਼ਚਿਤ ਹੋ ਜਾਂਦੇ ਹਨ।",
    "ਸ਼ਰਤਾਂ ਤੋਂ ਸਾਰੇ ਅਧਿਕਾਰੀਆਂ ਦੇ ਜਨਮ ਸਾਲ ਨਿਸ਼ਚਿਤ ਹੋ ਜਾਂਦੇ ਹਨ।",
    "ਸ਼ਰਤਾਂ ਤੋਂ ਸਾਰੇ ਖੋਜਕਰਤਿਆਂ ਦੇ ਜਨਮ ਸਾਲ ਨਿਸ਼ਚਿਤ ਹੋ ਜਾਂਦੇ ਹਨ।",
    "ਸ਼ਰਤਾਂ ਤੋਂ ਸਾਰੇ ਮੈਂਬਰਾਂ ਦੇ ਜਨਮ ਸਾਲ ਨਿਸ਼ਚਿਤ ਹੋ ਜਾਂਦੇ ਹਨ।",
  ]),
} as const;

assert.equal(LP_009_HI_PA_LOCALIZATION_REVIEW_V3.supersedes, "LP_009_HI_PA_LOCALIZATION_REVIEW_V2");
assert.equal(LP_009_HI_PA_LOCALIZATION_REVIEW_V3.status, "HUMAN_REVIEW_CANDIDATE_V3");
assert.equal(LP_009_HI_PA_LOCALIZATION_REVIEW_V3.questionBankWritable, false);
assert.equal(LP_009_HI_PA_LOCALIZATION_REVIEW_V3.testEligible, false);
assert.equal(LP_009_HI_PA_LOCALIZATION_REVIEW_V3.mockTestEligible, false);
assert.equal(LP_009_HI_PA_LOCALIZATION_REVIEW_V3.publiclyPublishable, false);

for (const language of languages) {
  const caselets = generateLp009LocalizedBatchV3(language, "lp-009-localization-v3-audit", 100);
  const qlCounts = Object.fromEntries(qls.map((ql) => [ql, 0])) as Record<(typeof qls)[number], number>;
  const slotCounts = Object.fromEntries(qls.map((ql) => [ql, [0, 0, 0, 0]])) as Record<(typeof qls)[number], number[]>;
  const observedYearSummaries = new Set<string>();

  for (const caselet of caselets) {
    assert.deepEqual(solveLp009({ clues: caselet.clues }), [caselet.assignment]);
    for (const child of caselet.children) {
      const english = caselet.englishCaselet.children.find((entry) => entry.questionId === child.questionId)!;
      assert.equal(child.correctIndex, english.correctIndex);
      assert.equal(child.answer, child.options[child.correctIndex]);
      assert.equal(child.explanation.lines.length, english.explanation.lines.length);
      assert.ok(child.explanation.lines.every((line) => line.includes("|---|---|")));
      for (const pattern of badYearGrammar[language]) assert.doesNotMatch(child.explanation.summary, pattern);
      if (caselet.mode === "YEAR") observedYearSummaries.add(child.explanation.summary);
      qlCounts[child.qlId] += 1;
      slotCounts[child.qlId][child.correctIndex]! += 1;
    }
  }

  assert.deepEqual(observedYearSummaries, expectedYearSummaries[language]);
  for (const ql of qls) {
    assert.equal(qlCounts[ql], 100);
    assert.deepEqual(slotCounts[ql], [25, 25, 25, 25]);
  }
}

console.log("LP-009 Hindi/Punjabi localization V3 grammar-closeout audit passed: 200 caselets / 800 localized questions.");
