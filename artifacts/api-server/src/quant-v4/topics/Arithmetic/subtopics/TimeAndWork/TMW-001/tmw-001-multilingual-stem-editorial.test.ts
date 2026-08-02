import { strict as assert } from "node:assert";
import { TMW_CP001_REGISTRY } from "./foundation/cp001-registry";
import { TMW_CP002_REGISTRY } from "./foundation/cp002-registry";
import { TMW_CP003_REGISTRY } from "./foundation/cp003-registry";
import { TMW_CP004_REGISTRY } from "./foundation/cp004-registry";
import { TMW_CP005_REGISTRY } from "./foundation/cp005-registry";
import { TMW_CP006_REGISTRY } from "./foundation/cp006-registry";
import { TMW_CP007_REGISTRY } from "./foundation/cp007-registry";
import { TMW_CP008_REGISTRY } from "./foundation/cp008-registry";
import { TMW_CP009_REGISTRY } from "./foundation/cp009-registry";
import { TMW_CP010_REGISTRY } from "./foundation/cp010-registry";
import { TMW_CP_011_REGISTRY } from "./foundation/cp011-registry";
import { runTmw001ChapterPipeline } from "./foundation/chapter-localized-runtime";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];
const registry = [
  ...TMW_CP001_REGISTRY,
  ...TMW_CP002_REGISTRY,
  ...TMW_CP003_REGISTRY,
  ...TMW_CP004_REGISTRY,
  ...TMW_CP005_REGISTRY,
  ...TMW_CP006_REGISTRY,
  ...TMW_CP007_REGISTRY,
  ...TMW_CP008_REGISTRY,
  ...TMW_CP009_REGISTRY,
  ...TMW_CP010_REGISTRY,
  ...TMW_CP_011_REGISTRY,
];

function ordinal(qlId: string): number {
  return Number(qlId.slice(-3));
}

function checkpointNumber(qlId: string): number {
  const value = ordinal(qlId);
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

const blockedHindi = [
  /क्लर्क 4/,
  /दिया गया काम का/,
  /फाइलें पूरे करने/,
  /फाइलें की तुलना/,
  /रंगाई का ठेका का/,
  /आयाम वाले खुदाई का गड्ढा को/,
  /छपाई का ऑर्डर का समान भाग/,
  /कितने भारी मशीनें/,
  /ज्ञात पाइप:/,
  /चलती है पहले \d+ घंटों तक चलती है/,
  /चलती है तब तक चलती है/,
  /अगली \d+वीं वापसी/,
  /Priya|Meera|Rohan/,
  /1 पुस्तिकाएँ/,
  /पेटियाँ पूरे होते हैं/,
  /पेटियाँ पूरा होने/,
  /पुस्तिकाएँ पूरे होते हैं/,
  /पुर्ज़े पूरा होने/,
  /सड़क के हिस्से/,
  /फाइलें पूरे हुए/,
  /कार्टन पूरा करता है/,
  /फाइलें पूरे होते हैं/,
  /फाइलें पूरा करता है/,
  /कुल \d+ पुर्ज़े हुआ/,
];

const blockedPunjabi = [
  /ਕਲਰਕ 4/,
  /ਦਿੱਤਾ ਹੋਇਆ ਕੰਮ ਦਾ/,
  /ਅਰਜ਼ੀਆਂ ਪੂਰੇ ਕਰਨ/,
  /ਫਾਈਲਾਂ ਪੂਰੇ ਕਰਨ/,
  /ਇੱਕ ਪ੍ਰਕਿਰਿਆ ਹੋਇਆ ਕੰਮ/,
  /ਟੀਮ B ਇਕੱਲਾ ਸਾਰਾ ਕੰਮ/,
  /ਰੰਗ ਕਰਨ ਦਾ ਠੇਕਾ ਦਾ/,
  /ਮਾਪ ਵਾਲੇ ਖੁਦਾਈ ਦਾ ਖੱਡਾ ਨੂੰ/,
  /ਕੰਮ ਕਰ ਰਹੇ ਹਨ/,
  /ਛਪਾਈ ਦਾ ਆਰਡਰ ਦਾ ਇੱਕੋ ਹਿੱਸਾ/,
  /ਕਿੰਨੇ ਭਾਰੀ ਮਸ਼ੀਨਾਂ/,
  /ਪਤਾ ਪਾਈਪ:/,
  /ਚੱਲਦੀ ਹੈ ਪਹਿਲਾਂ \d+ ਘੰਟਿਆਂ ਲਈ ਚੱਲਦੀ ਹੈ/,
  /ਚੱਲਦੀ ਹੈ ਤਦ ਤੱਕ ਚੱਲਦੀ ਹੈ/,
  /ਅਗਲੀ \d+ਵੀਂ ਵਾਪਸੀ/,
  /Priya|Meera|Rohan/,
  /1 ਪੁਸਤਿਕਾਵਾਂ/,
  /ਪੁਰਜ਼ੇ ਪੂਰੀਆਂ ਹੁੰਦੀਆਂ ਹਨ/,
  /ਪੁਰਜ਼ੇ ਪੂਰੀਆਂ ਹੋਣ/,
  /ਸੜਕ ਦੇ ਹਿੱਸੇ/,
  /ਕਾਰਟਨ ਪੂਰੀਆਂ ਹੋਈਆਂ/,
  /ਕਾਰਟਨ ਪੂਰੀ ਕਰਦਾ ਹੈ/,
  /ਪੁਰਜ਼ੇ ਪੂਰੀਆਂ ਹੋਈਆਂ/,
  /ਕੁੱਲ \d+ ਪੁਰਜ਼ੇ ਹੋਇਆ/,
];

let rows = 0;
let mathJaxFractionRows = 0;
for (const entry of registry) {
  for (const language of languages) {
    const question = runTmw001ChapterPipeline({
      questionLanguageId: entry.qlId,
      seed: reviewSeed(entry.qlId),
      language,
    });
    const stem = question.stem as string;
    const blocked = language === "hi" ? blockedHindi : blockedPunjabi;
    for (const pattern of blocked) {
      assert.equal(pattern.test(stem), false, `${entry.qlId}:${language}: blocked stem pattern ${pattern}: ${stem}`);
    }
    const outsideMath = stem.replace(/\\\([\s\S]*?\\\)/g, "");
    assert.equal(/\b\d+\/\d+\b/.test(outsideMath), false, `${entry.qlId}:${language}: bare fraction remains: ${stem}`);
    if (/\\frac\{\d+\}\{\d+\}/.test(stem)) mathJaxFractionRows += 1;
    rows += 1;
  }
}

assert.equal(rows, 422);
assert.ok(mathJaxFractionRows >= 30);
console.log(JSON.stringify({
  chapter: "TMW-001",
  reviewRows: rows,
  mathJaxFractionRows,
  blockedStemFindings: 0,
  status: "PASS",
}, null, 2));
