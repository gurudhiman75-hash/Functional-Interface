import assert from "node:assert/strict";
import { TRG_002_EXAM_REALNESS_LOCALIZATION_QL_IDS, generateExamRealLocalizedTrg002Question, type Trg002ExamRealnessLocale } from "./localization-exam-realness-v2";

const locales: readonly Trg002ExamRealnessLocale[] = ["hi-IN", "pa-IN"];
const hindiResidues = [
  "छत के स्तर का ऊँचाई का अंतर",
  "दो छतों के बीच का ऊँचाई-अंतर",
  "ऊपर का ऊँचाई का अंतर",
  "ऊँचाई का अंतर का उपयोग",
  "खंभे/पेड़",
  "निकट और दूर दूरी में दिया हुआ अंतर",
  "दूर जाने की दूरी अंतिम दूरी घटाकर प्रारंभिक दूरी है",
  "बड़ी मीनार से दूरी − छोटी मीनार से दूरी",
  "दूर वाले कोण से दूर दूरी",
  "उससे चली दूरी कम है",
  "आँख के ऊपर वाली ऊँचाई",
  "छत-से-छत त्रिभुज",
  "नीचे आधार और ऊपर शीर्ष की दोनों दृष्टि-रेखाओं",
  "दो दृष्टि-रेखा ऊँचाइयों",
  "दो कुल स्तर घटाएँ",
  "tan ऊपरी कोण",
  "दोनों tan मान का अंतर",
] as const;
const punjabiResidues = [
  "ਝੰਡੇ ਦਾ ਡੰਡਾ ਦੀ",
  "ਝੰਡੇ ਦਾ ਡੰਡਾ ਦੇ",
  "ਉਚਾਈ ਕੋਣ",
  "ਅਵਨਮਨ ਕੋਣ",
  "ਦਾ ਉਚਾਈ",
  "ਦੇ ਉਚਾਈ",
  "ਖੰਭੇ/ਦਰੱਖਤ",
  "ਨੇੜਲੀ ਅਤੇ ਦੂਰਲੀ ਦੂਰੀ ਵਿੱਚ ਦਿੱਤਾ ਅੰਤਰ",
  "ਦੂਰ ਜਾਣ ਦਾ ਫਾਸਲਾ ਅੰਤਿਮ ਦੂਰੀ ਘਟਾ ਕੇ ਸ਼ੁਰੂਆਤੀ ਦੂਰੀ ਹੈ",
  "ਵੱਡੀ ਮੀਨਾਰ ਤੋਂ ਦੂਰੀ − ਛੋਟੀ ਮੀਨਾਰ ਤੋਂ ਦੂਰੀ",
  "ਨੇੜਲੇ ਬਿੰਦੂ ਦੀ ਪਤਾ ਦੂਰੀ",
  "ਪਤਾ ਸ਼ੁਰੂਆਤੀ ਦੂਰੀ",
  "ਪਹਿਲੀ ਪਤਾ ਦੂਰੀ",
  "ਪਤਾ ਉਚਾਈ",
  "ਉਸ ਤੋਂ ਤੁਰਿਆ ਫਾਸਲਾ ਘੱਟ ਹੈ",
  "ਅੱਖ ਤੋਂ ਉੱਪਰ ਵਾਲੀ ਉਚਾਈ",
  "ਛੱਤ-ਤੋਂ-ਛੱਤ ਤਿਕੋਣ",
  "ਅਧਾਰ ਤੱਕ ਅਵਨਮਨ ਵਾਲਾ ਤਿਕੋਣ",
  "ਹੇਠਾਂ ਅਧਾਰ ਅਤੇ ਉੱਪਰ ਚੋਟੀ ਦੀਆਂ ਦੋਵੇਂ ਦ੍ਰਿਸ਼ਟੀ-ਰੇਖਾਵਾਂ",
  "ਖਿਤਿਜੀ ਲੱਗਦੀ ਭੁਜਾ",
  "ਦੋ ਦ੍ਰਿਸ਼ਟੀ-ਰੇਖਾ ਉਚਾਈਆਂ",
  "ਦੋ ਕੁੱਲ ਪੱਧਰ ਘਟਾਓ",
  "tan ਉੱਪਰਲਾ ਕੋਣ",
  "ਦੋਵੇਂ tan ਮੁੱਲ ਦਾ ਅੰਤਰ",
] as const;

let total = 0;
for (const qlId of TRG_002_EXAM_REALNESS_LOCALIZATION_QL_IDS) {
  for (const locale of locales) {
    for (let seedIndex = 1; seedIndex <= 12; seedIndex++) {
      const q = generateExamRealLocalizedTrg002Question(qlId, `trg002-grammar-v3-${seedIndex}`, locale) as any;
      const text = [q.stem, q.explanation.keyRule, ...q.explanation.steps.map((s: any) => s.body), q.explanation.shortcut, ...q.explanation.traps].join(" ");
      for (const residue of locale === "hi-IN" ? hindiResidues : punjabiResidues) {
        assert(!text.includes(residue), `${qlId}:${locale}: grammar residue remains: ${residue}`);
      }
      assert.equal(q.activationAuthorized, false);
      assert.equal(q.localizationLifecycle?.multilingualFreezeGranted, false);
      assert.equal(q.localizationProof?.grammarManualPolishV31, true);
      total += 1;
    }
  }
}
assert.equal(total, 2304);
console.log(`TRG002_GRAMMAR_V31_2304_PASS total=${total} qls=96 locales=2 seeds=12`);
