import { strict as assert } from "node:assert";
import { generateStaQl001LocalizedQuestion } from "./localization-ql001.ts";
import {
  generateStaQl001LocalizedQuestionV2,
  STA_QL001_LOCALIZATION_EDITORIAL_VERSION,
} from "./localization-ql001-editorial-v2.ts";
import type { StaLocalizedLocale } from "./localization-types.ts";

const CASES_PER_LOCALE = Number(process.env.STA_QL001_LOCALIZATION_V2_CASES_PER_LOCALE ?? 768);

function sameArray(a: readonly unknown[], b: readonly unknown[]): boolean {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

const banned: Record<StaLocalizedLocale, readonly string[]> = {
  "hi-IN": [
    "मान्यता I",
    "मान्यता II",
    "मान्यता III",
    "अंतर्निहित",
    "लेक्टर्न",
    "संपर्क योग्य",
    "काउंटर समय के बाद",
    "लोकेशन पिन का अनुसरण",
    "बताया गया फोल्डर वही काम स्वीकार करता",
  ],
  "pa-IN": [
    "ਮਾਨਤਾ I",
    "ਮਾਨਤਾ II",
    "ਮਾਨਤਾ III",
    "ਅੰਤਰਿਨਿਹਿਤ",
    "ਲੈਕਟਰਨ",
    "ਸੰਪਰਕਯੋਗ",
    "ਕਾਊਂਟਰ ਦੇ ਸਮੇਂ ਤੋਂ ਬਾਅਦ",
    "ਫਾਲੋ ਕਰੋ",
    "ਉਪਕਰਣ ਜੋੜ",
    "ਸਾਰੇ ਅਸਥਾਈ ਬਿਆਂ",
  ],
};

const requiredTerms: Record<StaLocalizedLocale, readonly string[]> = {
  "hi-IN": ["पूर्वधारणा", "निहित"],
  "pa-IN": ["ਧਾਰਨਾ", "ਨਿਹਿਤ"],
};

const seen: Record<StaLocalizedLocale, Set<string>> = {
  "hi-IN": new Set<string>(),
  "pa-IN": new Set<string>(),
};
let semanticParityChecks = 0;
let editorialChecks = 0;

assert.equal(STA_QL001_LOCALIZATION_EDITORIAL_VERSION, "V2_NATIVE_EDITORIAL");

for (const locale of ["hi-IN", "pa-IN"] as const) {
  for (let index = 0; index < CASES_PER_LOCALE; index += 1) {
    const seed = `sta-ql001-editorial-v2:${locale}:${index}`;
    const v1 = generateStaQl001LocalizedQuestion(seed, locale);
    const v2 = generateStaQl001LocalizedQuestionV2(seed, locale);
    seen[locale].add(v2.scenarioId);

    assert.equal(v2.questionId, v1.questionId, `${seed}: question identity drift`);
    assert.equal(v2.qlId, v1.qlId, `${seed}: QL drift`);
    assert.equal(v2.scenarioId, v1.scenarioId, `${seed}: scenario drift`);
    assert.equal(v2.answerIndex, v1.answerIndex, `${seed}: answer index drift`);
    assert.ok(sameArray(v2.answerSet, v1.answerSet), `${seed}: answer set drift`);
    assert.equal(v2.difficulty, v1.difficulty, `${seed}: difficulty drift`);
    assert.deepEqual(v2.sourceProfile, v1.sourceProfile, `${seed}: source profile drift`);
    assert.deepEqual(v2.lifecycle, v1.lifecycle, `${seed}: lifecycle drift`);

    assert.equal(v2.candidates.length, v1.candidates.length, `${seed}: candidate count drift`);
    v2.candidates.forEach((candidate, candidateIndex) => {
      const before = v1.candidates[candidateIndex]!;
      assert.equal(candidate.candidateId, before.candidateId, `${seed}: candidate identity drift`);
      assert.deepEqual(candidate.oracle, before.oracle, `${seed}: oracle drift`);
    });
    assert.deepEqual(v2.options, v1.options, `${seed}: option semantic/display drift`);
    semanticParityChecks += 1;

    const learnerText = [v2.statement, ...v2.candidates.map((candidate) => candidate.text), v2.explanation].join("\n");
    for (const phrase of banned[locale]) {
      assert.ok(!learnerText.includes(phrase), `${seed}: rejected V1 wording remains: ${phrase}`);
    }
    for (const term of requiredTerms[locale]) {
      assert.ok(v2.explanation.includes(term), `${seed}: expected exam-style explanation term missing: ${term}`);
    }
    assert.ok(!v2.explanation.startsWith("देखें कि"), `${seed}: Hindi boilerplate lead remains`);
    assert.ok(!v2.explanation.startsWith("ਵੇਖੋ ਕਿ"), `${seed}: Punjabi boilerplate lead remains`);
    assert.ok(v2.explanation.split(/\s+/u).length <= 95, `${seed}: explanation too long after declutter`);
    editorialChecks += 1;
  }
}

assert.equal(seen["hi-IN"].size, 16, "Hindi V2 proof did not reach all 16 QL001 authorities");
assert.equal(seen["pa-IN"].size, 16, "Punjabi V2 proof did not reach all 16 QL001 authorities");

console.log("PASS_STA_QL001_HI_PA_NATIVE_EDITORIAL_V2");
console.log(JSON.stringify({
  editorialVersion: STA_QL001_LOCALIZATION_EDITORIAL_VERSION,
  semanticParityChecks,
  editorialChecks,
  reachedHindiAuthorities: seen["hi-IN"].size,
  reachedPunjabiAuthorities: seen["pa-IN"].size,
  lifecycle: "QL001_REVIEW_CANDIDATE",
  nativeApprovalRecorded: false,
  questionStudioDiscoverable: false,
}, null, 2));
