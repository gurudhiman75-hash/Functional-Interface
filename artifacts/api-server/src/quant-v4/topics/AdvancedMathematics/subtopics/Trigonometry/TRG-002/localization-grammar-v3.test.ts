import assert from "node:assert/strict";
import { TRG_002_EXAM_REALNESS_LOCALIZATION_QL_IDS, generateExamRealLocalizedTrg002Question, type Trg002ExamRealnessLocale } from "./localization-exam-realness-v2";

const locales: readonly Trg002ExamRealnessLocale[] = ["hi-IN", "pa-IN"];
let total = 0;
for (const qlId of TRG_002_EXAM_REALNESS_LOCALIZATION_QL_IDS) {
  for (const locale of locales) {
    for (let seedIndex = 1; seedIndex <= 12; seedIndex++) {
      const q = generateExamRealLocalizedTrg002Question(qlId, `trg002-grammar-v3-${seedIndex}`, locale) as any;
      const text = [q.stem, q.explanation.keyRule, ...q.explanation.steps.map((s: any) => s.body), q.explanation.shortcut, ...q.explanation.traps].join(" ");
      if (locale === "hi-IN") {
        assert(!text.includes("छत के स्तर का ऊँचाई का अंतर"));
        assert(!text.includes("दो छतों के बीच का ऊँचाई-अंतर"));
        assert(!text.includes("ऊपर का ऊँचाई का अंतर"));
        assert(!text.includes("ऊँचाई का अंतर का उपयोग"));
        assert(!text.includes("खंभे/पेड़"));
      } else {
        assert(!text.includes("ਝੰਡੇ ਦਾ ਡੰਡਾ ਦੀ"));
        assert(!text.includes("ਝੰਡੇ ਦਾ ਡੰਡਾ ਦੇ"));
        assert(!text.includes("ਉਚਾਈ ਕੋਣ"));
        assert(!text.includes("ਅਵਨਮਨ ਕੋਣ"));
        assert(!text.includes("ਦਾ ਉਚਾਈ"));
        assert(!text.includes("ਦੇ ਉਚਾਈ"));
        assert(!text.includes("ਖੰਭੇ/ਦਰੱਖਤ"));
      }
      assert.equal(q.activationAuthorized, false);
      assert.equal(q.localizationLifecycle?.multilingualFreezeGranted, false);
      total += 1;
    }
  }
}
assert.equal(total, 2304);
console.log(`TRG002_GRAMMAR_V3_2304_PASS total=${total} qls=96 locales=2 seeds=12`);
