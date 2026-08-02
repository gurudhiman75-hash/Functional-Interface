import { strict as assert } from "node:assert";
import { runTmw001ChapterPipeline } from "./foundation/chapter-localized-runtime";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];

function checkpointNumber(qlId: string): number {
  const value = Number(qlId.slice(-3));
  if (value <= 20) return 1;
  if (value <= 34) return 2;
  if (value <= 57) return 3;
  if (value <= 81) return 4;
  if (value <= 105) return 5;
  if (value <= 127) return 6;
  if (value <= 143) return 7;
  if (value <= 156) return 8;
  if (value <= 174) return 9;
  if (value <= 192) return 10;
  return 11;
}

function reviewSeed(qlId: string): string {
  const cp = checkpointNumber(qlId);
  return cp === 11
    ? `review-${qlId}-0`
    : `tmw-cp${String(cp).padStart(3, "0")}-localization:${qlId}:0`;
}

const targetedQlIds = [
  "TMW-QL-002",
  "TMW-QL-005",
  "TMW-QL-092",
  "TMW-QL-131",
  "TMW-QL-151",
  "TMW-QL-181",
  "TMW-QL-187",
  "TMW-QL-192",
  "TMW-QL-193",
  "TMW-QL-195",
  "TMW-QL-196",
  "TMW-QL-197",
  "TMW-QL-199",
  "TMW-QL-200",
  "TMW-QL-203",
  "TMW-QL-205",
  "TMW-QL-206",
  "TMW-QL-208",
  "TMW-QL-209",
] as const;

const blockedHindi = [
  /\d+ दिन में एक रिकॉर्ड क्लर्क का कुल/,
  /एक ठेकेदार .* भाग पूरा होता है/,
  /केवल भारी मशीनें से/,
  /बड़ा प्रेषण ऑर्डर के लिए/,
  /स्तर .* भरी न हो जाए/,
  /स्तर .* भरी और .* भरी के बीच/,
  /ठीक 10 घंटों तक भरने/,
  /\d+ दिनों का कुल \d+ (?:फाइलें|पुस्तिकाएँ|पेटियाँ|पुर्ज़े) हैं/,
  /\d+ दिनों का कुल \d+ फाइलें पूरी हुईं/,
  /पहले दिन की दरें \d+ और \d+ फाइलें हैं/,
  /पहले दिन \d+ पुर्ज़े है(?!ं)/,
  /\d+ पेटियाँ पूरा करने/,
  /दिनों का कुल ज्ञात कीजिए/,
];

const blockedPunjabi = [
  /\d+ ਦਿਨ ਵਿੱਚ ਇੱਕ ਰਿਕਾਰਡ ਕਲਰਕ ਦਾ ਕੁੱਲ/,
  /ਇੱਕ ਠੇਕੇਦਾਰ .* ਹਿੱਸਾ ਪੂਰਾ ਹੁੰਦਾ ਹੈ/,
  /ਟੀਮ B ਇਕੱਲੀ .* ਕਰੇਗਾ/,
  /ਵੱਡਾ ਡਿਸਪੈਚ ਆਰਡਰ ਲਈ/,
  /ਪੱਧਰ .* ਭਰੀ ਨਾ ਹੋ ਜਾਵੇ/,
  /ਪੱਧਰ .* ਭਰੀ ਅਤੇ .* ਭਰੀ ਦੇ ਵਿਚਕਾਰ/,
  /ਠੀਕ 10 ਘੰਟੇ ਤੱਕ ਭਰਨ/,
  /\d+ ਦਿਨਾਂ ਦਾ ਕੁੱਲ \d+ (?:ਫਾਈਲਾਂ|ਪੁਸਤਿਕਾਵਾਂ|ਪੇਟੀਆਂ|ਪੁਰਜ਼ੇ) ਹਨ/,
  /\d+ ਦਿਨਾਂ ਦਾ ਕੁੱਲ \d+ ਫਾਈਲਾਂ ਪੂਰੀਆਂ ਹੋਈਆਂ/,
  /ਪਹਿਲੇ ਦਿਨ ਦੀਆਂ ਦਰਾਂ \d+ ਅਤੇ \d+ ਫਾਈਲਾਂ ਹਨ/,
  /ਦਿਨਾਂ ਦਾ ਕੁੱਲ ਲੱਭੋ/,
];

let reviewedRows = 0;
for (const qlId of targetedQlIds) {
  for (const language of languages) {
    const question = runTmw001ChapterPipeline({
      questionLanguageId: qlId,
      seed: reviewSeed(qlId),
      language,
    });
    const stem = question.stem as string;
    const blocked = language === "hi" ? blockedHindi : blockedPunjabi;
    for (const pattern of blocked) {
      assert.equal(pattern.test(stem), false, `${qlId}:${language}: ${pattern}: ${stem}`);
    }
    assert.equal(question.validation.valid, true, `${qlId}:${language}:${question.validation.errors.join(" | ")}`);
    assert.equal(question.publiclyPublishable, false);
    reviewedRows += 1;
  }
}

assert.equal(reviewedRows, targetedQlIds.length * languages.length);
console.log(JSON.stringify({
  chapter: "TMW-001",
  wave: "MULTILINGUAL_STEM_EDITORIAL_WAVE_02",
  targetedQls: targetedQlIds.length,
  reviewedRows,
  blockedFindings: 0,
  status: "PASS",
}, null, 2));
