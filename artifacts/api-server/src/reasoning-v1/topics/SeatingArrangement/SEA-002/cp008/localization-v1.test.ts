import assert from "node:assert/strict";

import { SEA002_CP008_ENGLISH_REVIEW_SET_V1 } from "./production-review-v1.ts";
import { SEA002_CP008_PERMANENT_QL_IDS } from "./permanent/registry.ts";
import { SEA002_CP008_LOCALIZED_REVIEW_SET_V1 } from "./localization-v1.ts";

assert.equal(SEA002_CP008_ENGLISH_REVIEW_SET_V1.length, 42);
assert.equal(SEA002_CP008_LOCALIZED_REVIEW_SET_V1.length, 84);
assert.equal(new Set(SEA002_CP008_LOCALIZED_REVIEW_SET_V1.map((candidate) => candidate.localizedFingerprint)).size, 84);

let parityChecks = 0;
let residueChecks = 0;

for (const locale of ["hi", "pa"] as const) {
  const localeSet = SEA002_CP008_LOCALIZED_REVIEW_SET_V1.filter((candidate) => candidate.locale === locale);
  assert.equal(localeSet.length, 42);
  for (const permanentQlId of SEA002_CP008_PERMANENT_QL_IDS) {
    assert.equal(localeSet.filter((candidate) => candidate.permanentQlId === permanentQlId).length, 6);
  }
}

for (const localized of SEA002_CP008_LOCALIZED_REVIEW_SET_V1) {
  const english = SEA002_CP008_ENGLISH_REVIEW_SET_V1.find((candidate) =>
    candidate.permanentQlId === localized.permanentQlId && candidate.variantIndex === localized.variantIndex,
  );
  assert.ok(english);
  assert.equal(localized.sourceEnglishFingerprint, english.fingerprint);
  assert.deepEqual(localized.options, english.options);
  assert.equal(localized.correctOptionIndex, english.correctOptionIndex);
  assert.equal(localized.answer, english.answer);
  assert.equal(localized.difficulty, english.difficulty);
  assert.equal(localized.examLineage, english.examLineage);
  assert.equal(localized.authorityKey, english.authorityKey);
  assert.equal(localized.signatureId, english.signatureId);
  assert.equal(localized.reviewStatus, "V1_REVIEW_READY_HUMAN_APPROVAL_PENDING");
  assert.equal(localized.active, false);
  assert.equal(localized.questionStudioDiscoverable, false);
  assert.equal(localized.questionBankWritable, false);
  assert.equal(localized.publiclyPublishable, false);
  assert.equal(localized.localizedFingerprint.length, 64);
  parityChecks += 10;

  assert.doesNotMatch(localized.stem, /बैठता|बैठती|बैठेगा|बैठेगी|ਬੈਠਦਾ|ਬੈਠਦੀ|ਬੈਠੇਗਾ|ਬੈਠੇਗੀ/iu);
  assert.doesNotMatch(localized.question, /बैठता|बैठती|ਬੈਠਦਾ|ਬੈਠਦੀ/iu);
  assert.doesNotMatch(localized.explanation, /बैठता|बैठती|ਬੈਠਦਾ|ਬੈਠਦੀ/iu);
  assert.doesNotMatch(localized.stem, /\bprototype\b|constraint spine|seatIndex|structural fingerprint/iu);
  assert.doesNotMatch(localized.explanation, /\bprototype\b|constraint spine|seatIndex|structural fingerprint/iu);
  assert.ok(localized.stem.length > 250);
  assert.ok(localized.question.length > 10);
  assert.ok(localized.explanation.length > 120);
  residueChecks += 8;
}

const ql029EnglishAlt12 = SEA002_CP008_ENGLISH_REVIEW_SET_V1.filter((candidate) =>
  candidate.permanentQlId === "SEA-QL-029" && candidate.topology === "ALT12_ROLE_DERIVED",
);
assert.equal(ql029EnglishAlt12.length, 2);

const hiRoleAlt12 = SEA002_CP008_LOCALIZED_REVIEW_SET_V1.filter((candidate) =>
  candidate.locale === "hi" && candidate.permanentQlId === "SEA-QL-029" && [4, 5].includes(candidate.variantIndex),
);
assert.equal(hiRoleAlt12.length, 2);
assert.ok(hiRoleAlt12.every((candidate) => /बारह व्यक्ति/u.test(candidate.stem)));
assert.ok(hiRoleAlt12.every((candidate) => /प्रत्येक कोने पर एक व्यक्ति/u.test(candidate.stem)));
assert.ok(hiRoleAlt12.every((candidate) => /प्रत्येक भुजा पर दो व्यक्ति/u.test(candidate.stem)));
assert.ok(hiRoleAlt12.every((candidate) => !/60 मीटर|5 मीटर/u.test(candidate.stem)));
assert.ok(hiRoleAlt12.every((candidate) => /कोना-बनाम-भुजा नियम/u.test(candidate.explanation)));
assert.ok(hiRoleAlt12.some((candidate) => /कोनों पर मौजूद व्यक्तियों का मुख बाहर की ओर/u.test(candidate.stem)));
assert.ok(hiRoleAlt12.some((candidate) => /कोनों पर मौजूद व्यक्तियों का मुख केंद्र की ओर/u.test(candidate.stem)));

const paRoleAlt12 = SEA002_CP008_LOCALIZED_REVIEW_SET_V1.filter((candidate) =>
  candidate.locale === "pa" && candidate.permanentQlId === "SEA-QL-029" && [4, 5].includes(candidate.variantIndex),
);
assert.equal(paRoleAlt12.length, 2);
assert.ok(paRoleAlt12.every((candidate) => /ਬਾਰਾਂ ਵਿਅਕਤੀ/u.test(candidate.stem)));
assert.ok(paRoleAlt12.every((candidate) => /ਹਰ ਕੋਨੇ 'ਤੇ ਇੱਕ ਵਿਅਕਤੀ/u.test(candidate.stem)));
assert.ok(paRoleAlt12.every((candidate) => /ਹਰ ਭੁਜਾ 'ਤੇ ਦੋ ਵਿਅਕਤੀ/u.test(candidate.stem)));
assert.ok(paRoleAlt12.every((candidate) => !/60 ਮੀਟਰ|5 ਮੀਟਰ/u.test(candidate.stem)));
assert.ok(paRoleAlt12.every((candidate) => /ਕੋਨਾ-ਬਨਾਮ-ਭੁਜਾ ਨਿਯਮ/u.test(candidate.explanation)));
assert.ok(paRoleAlt12.some((candidate) => /ਕੋਨਿਆਂ ਵਾਲਿਆਂ ਦਾ ਮੂੰਹ ਬਾਹਰ ਵੱਲ/u.test(candidate.stem)));
assert.ok(paRoleAlt12.some((candidate) => /ਕੋਨਿਆਂ ਵਾਲਿਆਂ ਦਾ ਮੂੰਹ ਕੇਂਦਰ ਵੱਲ/u.test(candidate.stem)));

const hiAlt12 = SEA002_CP008_LOCALIZED_REVIEW_SET_V1.filter((candidate) => candidate.locale === "hi" && candidate.permanentQlId === "SEA-QL-035");
assert.ok(hiAlt12.every((candidate) => /60 मीटर/u.test(candidate.stem) && /5 मीटर/u.test(candidate.stem)));
const paAlt12 = SEA002_CP008_LOCALIZED_REVIEW_SET_V1.filter((candidate) => candidate.locale === "pa" && candidate.permanentQlId === "SEA-QL-035");
assert.ok(paAlt12.every((candidate) => /60 ਮੀਟਰ/u.test(candidate.stem) && /5 ਮੀਟਰ/u.test(candidate.stem)));

console.log("PASS_SEA002_CP008_LOCALIZATION_V1");
console.log("English source surfaces", SEA002_CP008_ENGLISH_REVIEW_SET_V1.length);
console.log("localized surfaces", SEA002_CP008_LOCALIZED_REVIEW_SET_V1.length);
console.log("Hindi surfaces", 42);
console.log("Punjabi surfaces", 42);
console.log("localized QL029 ALT12 role-derived surfaces", hiRoleAlt12.length + paRoleAlt12.length);
console.log("semantic parity checks", parityChecks);
console.log("editorial residue checks", residueChecks);
console.log("mechanical gender slash residue", 0);
console.log("human approval", "PENDING");
console.log("Studio/Bank/public", false, false, false);
