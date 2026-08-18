import assert from "node:assert/strict";

import {
  TRG_002_EXAM_REALNESS_LOCALIZATION_QL_IDS,
  generateExamRealLocalizedTrg002Question,
  type Trg002ExamRealnessLocale,
} from "./localization-exam-realness-v2";

const locales: readonly Trg002ExamRealnessLocale[] = ["hi-IN", "pa-IN"];
const forbidden = [
  "डिप्रैशन", "ਡਿਪ੍ਰੈਸ਼ਨ",
  "दृष्टि-रेखाs", "ਦ੍ਰਿਸ਼ਟੀ-ਰੇਖਾs",
  "ऊँचाइयों का ऊँचाई का अंतर", "ऊँचाइयों का ऊँचाई में अंतर",
  "ਉਚਾਈਆਂ ਦਾ ਉਚਾਈ ਦਾ ਅੰਤਰ", "ਉਚਾਈਆਂ ਦਾ ਉਚਾਈ ਵਿੱਚ ਅੰਤਰ",
  "खंभा की", "खंभा का", "ਖੰਭਾ ਦੀ", "ਖੰਭਾ ਦਾ",
  "पेड़/खंभा", "खंभे/पेड़", "ਦਰੱਖਤ/ਖੰਭਾ", "ਖੰਭੇ/ਦਰੱਖਤ", "छोटी/पहली", "ਛੋਟੀ/ਪਹਿਲੀ",
  "छत के स्तर का ऊँचाई का अंतर", "दो छतों के बीच का ऊँचाई-अंतर", "ऊपर का ऊँचाई का अंतर", "ऊँचाई का अंतर का उपयोग",
  "ਛੱਤ ਦੇ ਪੱਧਰ ਦਾ ਉਚਾਈ ਦਾ ਅੰਤਰ", "ਦੋ ਛੱਤਾਂ ਵਿਚਕਾਰ ਉਚਾਈ-ਅੰਤਰ", "ਉੱਪਰ ਵਾਲਾ ਉਚਾਈ ਦਾ ਅੰਤਰ",
  "ਝੰਡੇ ਦਾ ਡੰਡਾ ਦੀ", "ਝੰਡੇ ਦਾ ਡੰਡਾ ਦੇ",
  "ਉਚਾਈ ਕੋਣ", "ਅਵਨਮਨ ਕੋਣ",
  "ਦਾ ਉਚਾਈ", "ਦੇ ਉਚਾਈ",
  "अंतर/ऊँचाई", "ਅੰਤਰ/ਉਚਾਈ",
  "पाद", "ਪੈਰ",
];

function learnerText(question: any) {
  return [
    question.stem,
    question.explanation.keyRule,
    ...question.explanation.steps.map((step: any) => step.body),
    question.explanation.shortcut,
    ...question.explanation.traps,
  ].join(" ");
}

let records = 0;
for (const [index, qlId] of TRG_002_EXAM_REALNESS_LOCALIZATION_QL_IDS.entries()) {
  for (const locale of locales) {
    const question: any = generateExamRealLocalizedTrg002Question(
      qlId,
      `trg002-exam-realness-v2-editorial-${String(index + 1).padStart(3, "0")}`,
      locale,
    );
    const text = learnerText(question);
    for (const fragment of forbidden) {
      assert(!text.includes(fragment), `${qlId}:${locale}: grammar/editorial residue remains: ${fragment}`);
    }
    assert(!/\b\d+\/2\s*m\b/u.test(text), `${qlId}:${locale}: half-metre fraction remains.`);
    assert(!/[-−]\d+\s*\+\s*\d+√3\s*m/u.test(question.stem), `${qlId}:${locale}: artificial signed compound-surd given remains in stem.`);
    if (locale === "pa-IN" && /(?:30|45|60)°/.test(text)) {
      assert(!text.includes("ਉਚਾਈ ਕੋਣ"), `${qlId}:${locale}: Punjabi elevation term must use ਉਚਾਣ ਕੋਣ.`);
      assert(!text.includes("ਅਵਨਮਨ ਕੋਣ"), `${qlId}:${locale}: Punjabi depression term must use ਨਿਵਾਣ ਕੋਣ.`);
    }
    if (["TRG-002-QL-083", "TRG-002-QL-084", "TRG-002-QL-085"].includes(qlId)) {
      assert(locale === "hi-IN" ? question.stem.includes("आधारों के बीच क्षैतिज दूरी") : question.stem.includes("ਅਧਾਰਾਂ ਵਿਚਕਾਰ ਖਿਤਿਜੀ ਦੂਰੀ"), `${qlId}:${locale}: building base-to-base horizontal distance must be explicit.`);
    }
    records += 1;
  }
}
assert.equal(records, 192);
console.log(`TRG002_EXAM_REALNESS_V2_EDITORIAL_GRAMMAR_PASS records=${records} qls=96 locales=2 residues=0`);
