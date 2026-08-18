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
  "पेड़/खंभा", "ਦਰੱਖਤ/ਖੰਭਾ", "छोटी/पहली", "ਛੋਟੀ/ਪਹਿਲੀ",
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
      assert(!text.includes(fragment), `${qlId}:${locale}: editorial residue remains: ${fragment}`);
    }
    assert(!/\b\d+\/2\s*m\b/u.test(text), `${qlId}:${locale}: half-metre fraction remains.`);
    assert(!/[-−]\d+\s*\+\s*\d+√3\s*m/u.test(question.stem), `${qlId}:${locale}: artificial signed compound-surd given remains in stem.`);
    if (["TRG-002-QL-083", "TRG-002-QL-084", "TRG-002-QL-085"].includes(qlId)) {
      assert(locale === "hi-IN" ? question.stem.includes("पादों के बीच क्षैतिज दूरी") : question.stem.includes("ਪੈਰਾਂ ਵਿਚਕਾਰ ਖਿਤਿਜੀ ਦੂਰੀ"), `${qlId}:${locale}: building foot-to-foot horizontal distance must be explicit.`);
    }
    records += 1;
  }
}
assert.equal(records, 192);
console.log(`TRG002_EXAM_REALNESS_V2_EDITORIAL_PASS records=${records} qls=96 locales=2 residues=0`);
