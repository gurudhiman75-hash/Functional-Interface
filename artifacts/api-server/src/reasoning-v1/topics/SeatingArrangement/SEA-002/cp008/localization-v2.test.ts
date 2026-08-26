import assert from "node:assert/strict";

import "./localization-v1.test.ts";
import { SEA002_CP008_ENGLISH_REVIEW_SET_V2 } from "./production-review-v2.ts";
import { SEA002_CP008_PERMANENT_QL_IDS } from "./permanent/registry.ts";
import {
  SEA002_CP008_LOCALIZATION_EDITORIAL_V2,
  SEA002_CP008_LOCALIZED_REVIEW_SET_V2,
} from "./localization-v2.ts";

assert.equal(SEA002_CP008_ENGLISH_REVIEW_SET_V2.length, 42);
assert.equal(SEA002_CP008_LOCALIZED_REVIEW_SET_V2.length, 84);
assert.equal(SEA002_CP008_LOCALIZATION_EDITORIAL_V2.localizedSurfaceCount, 84);
assert.equal(new Set(SEA002_CP008_LOCALIZED_REVIEW_SET_V2.map((candidate) => candidate.localizedFingerprint)).size, 84);

for (const locale of ["hi", "pa"] as const) {
  const localeSet = SEA002_CP008_LOCALIZED_REVIEW_SET_V2.filter((candidate) => candidate.locale === locale);
  assert.equal(localeSet.length, 42);
  assert.equal(new Set(localeSet.map((candidate) => candidate.stem)).size, 42, `${locale}: every V2 localized setup must be distinct`);
  for (const qlId of SEA002_CP008_PERMANENT_QL_IDS) {
    const group = localeSet.filter((candidate) => candidate.permanentQlId === qlId);
    assert.equal(group.length, 6);
    assert.equal(new Set(group.map((candidate) => candidate.stem)).size, 6, `${locale}/${qlId}: setup pool too repetitive`);
  }
}

for (const localized of SEA002_CP008_LOCALIZED_REVIEW_SET_V2) {
  const english = SEA002_CP008_ENGLISH_REVIEW_SET_V2.find((candidate) =>
    candidate.permanentQlId === localized.permanentQlId && candidate.variantIndex === localized.variantIndex,
  );
  assert.ok(english);
  assert.equal(localized.sourceEnglishFingerprint, english.fingerprint);
  assert.deepEqual(localized.options, english.options);
  assert.equal(localized.correctOptionIndex, english.correctOptionIndex);
  assert.equal(localized.answer, english.answer);
  assert.equal(localized.localizedFingerprint.length, 64);
  assert.equal(localized.active, false);
  assert.equal(localized.questionStudioDiscoverable, false);
  assert.equal(localized.questionBankWritable, false);
  assert.equal(localized.publiclyPublishable, false);
  assert.doesNotMatch(localized.stem, /बैठता|बैठती|बैठेगा|बैठेगी|ਬੈਠਦਾ|ਬੈਠਦੀ|ਬੈਠੇਗਾ|ਬੈਠੇਗੀ/iu);
  assert.doesNotMatch(localized.question, /बैठता|बैठती|ਬੈਠਦਾ|ਬੈਠਦੀ/iu);
  assert.doesNotMatch(localized.explanation, /बैठता|बैठती|ਬੈਠਦਾ|ਬੈਠਦੀ/iu);
}

console.log("PASS_SEA002_CP008_LOCALIZATION_V2");
console.log("English V2 source surfaces", SEA002_CP008_ENGLISH_REVIEW_SET_V2.length);
console.log("localized V2 surfaces", SEA002_CP008_LOCALIZED_REVIEW_SET_V2.length);
console.log("Hindi unique setups", new Set(SEA002_CP008_LOCALIZED_REVIEW_SET_V2.filter((candidate) => candidate.locale === "hi").map((candidate) => candidate.stem)).size);
console.log("Punjabi unique setups", new Set(SEA002_CP008_LOCALIZED_REVIEW_SET_V2.filter((candidate) => candidate.locale === "pa").map((candidate) => candidate.stem)).size);
console.log("mechanical gender slash residue", 0);
console.log("human approval", SEA002_CP008_LOCALIZATION_EDITORIAL_V2.humanApprovalStatus);
console.log("Studio/Bank/public", false, false, false);
