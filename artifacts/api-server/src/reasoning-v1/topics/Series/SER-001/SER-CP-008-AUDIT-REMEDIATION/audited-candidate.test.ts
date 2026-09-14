import assert from "node:assert/strict";

import {
  SER_CP008_AUDITED_QL_AUTHORITIES,
  SER_CP008_AUDITED_QL_IDS,
  SER_CP008_REJECTED_SOURCE_GAPS,
  assertSerCp008AuditedQlId,
  generateSerCp008Audited,
} from "./audited-candidate";

assert.equal(SER_CP008_AUDITED_QL_IDS.length, 13);
assert.equal(SER_CP008_AUDITED_QL_AUTHORITIES.length, 13);
assert.deepEqual(
  SER_CP008_REJECTED_SOURCE_GAPS.map((entry) => entry.qlId),
  ["SER-QL-019", "SER-QL-020"],
);
assert.ok(
  SER_CP008_REJECTED_SOURCE_GAPS.every(
    (entry) =>
      entry.auditDecision === "REJECT_WRONG_CHAPTER_OWNERSHIP"
      && entry.permanentQlReserved === false
      && entry.questionStudioDiscoverable === false
      && entry.questionBankWritable === false
      && entry.testEligible === false
      && entry.mockTestEligible === false
      && entry.publiclyPublishable === false,
  ),
);
assert.equal((SER_CP008_AUDITED_QL_IDS as readonly string[]).includes("SER-QL-019"), false);
assert.equal((SER_CP008_AUDITED_QL_IDS as readonly string[]).includes("SER-QL-020"), false);
assert.throws(() => assertSerCp008AuditedQlId("SER-QL-019"), /internal alphanumeric relation/i);
assert.throws(() => assertSerCp008AuditedQlId("SER-QL-020"), /internal alphanumeric relation/i);

const locales = ["en-IN", "hi-IN", "pa-IN"] as const;
let generatedProofs = 0;
for (const qlId of SER_CP008_AUDITED_QL_IDS) {
  for (const seed of [0, 1, 2, 17, 41, 83] as const) {
    const english = generateSerCp008Audited(qlId, seed, "en-IN");
    assert.equal(english.qlId, qlId);
    assert.equal(english.seed, seed);
    assert.equal(english.options.length, 4);
    assert.equal(new Set(english.options.map((option) => option.value)).size, 4);
    assert.equal(english.options[english.correctIndex]?.value, english.correctAnswer);
    assert.ok(english.explanation.length >= 3);
    assert.ok(!SER_CP008_REJECTED_SOURCE_GAPS.some((entry) => entry.qlId === english.qlId));
    generatedProofs += 1;

    for (const locale of locales.slice(1)) {
      const localized = generateSerCp008Audited(qlId, seed, locale);
      assert.equal(localized.correctAnswer, english.correctAnswer);
      assert.equal(localized.correctIndex, english.correctIndex);
      assert.equal(localized.difficulty, english.difficulty);
      assert.deepEqual(localized.structuralFeatures, english.structuralFeatures);
      generatedProofs += 1;
    }
  }
}

console.log(JSON.stringify({
  status: "SER_CP008_AUDITED_13_QL_OWNERSHIP_PASS",
  auditedQlCount: SER_CP008_AUDITED_QL_IDS.length,
  rejectedWrongOwner: SER_CP008_REJECTED_SOURCE_GAPS,
  generatedProofs,
}, null, 2));
