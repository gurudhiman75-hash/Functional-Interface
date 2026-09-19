import { strict as assert } from "node:assert";
import { blrCanonicalPersonNames } from "./foundation/localized-person-names";

import {
  buildBlr001MultilingualReviewCorpora,
  buildBlr001MultilingualReviewSummary,
  buildBlr001RepresentativeHumanReviewRecords,
  renderBlr001MultilingualHumanReviewMarkdown,
} from "./multilingual-human-review-pack";

const corpora = buildBlr001MultilingualReviewCorpora();
const full = [
  ...corpora.cp001.hindi,
  ...corpora.cp001.punjabi,
  ...corpora.cp002.hindi,
  ...corpora.cp002.punjabi,
  ...corpora.cp003.hindi,
  ...corpora.cp003.punjabi,
  ...corpora.cp004.hindi,
  ...corpora.cp004.punjabi,
  ...corpora.cp005.hindi,
  ...corpora.cp005.punjabi,
  ...corpora.cp006.english,
  ...corpora.cp006.hindi,
  ...corpora.cp006.punjabi,
];
const representative = buildBlr001RepresentativeHumanReviewRecords();
const summary = buildBlr001MultilingualReviewSummary();
const markdown = renderBlr001MultilingualHumanReviewMarkdown();

const expectedQls = Array.from(
  { length: 30 },
  (_, index) => `BLR-QL-${String(index + 1).padStart(3, "0")}`,
);
assert.deepEqual(
  [...new Set(full.map((record) => record.qlId))].sort(),
  expectedQls,
);
assert.deepEqual(summary.permanentQlCoverage, expectedQls);
assert.equal(summary.qlRange, "BLR-QL-001..BLR-QL-030");
assert.deepEqual(summary.languages, ["en-IN", "hi-IN", "pa-IN"]);
assert.equal(summary.currentReleaseLock.reviewOnly, true);
assert.equal(summary.currentReleaseLock.questionBankEligible, false);
assert.equal(summary.currentReleaseLock.mockTestEligible, false);
assert.equal(summary.currentReleaseLock.publiclyPublishable, false);
assert.equal(summary.currentReleaseLock.productDeliveryUnlocked, false);
assert.equal(summary.approvalBoundary.automaticFreeze, false);

const canonicalNamePattern = new RegExp(
  `\\b(?:${blrCanonicalPersonNames().join("|")})\\b`,
);

for (const record of full) {
  if (record.locale === "hi-IN" || record.locale === "pa-IN") {
    const learnerProjection = JSON.stringify({
      sharedPrompt: record.sharedPrompt ?? "",
      stem: record.stem ?? "",
      options: (record.options ?? []).map((option: any) => option.text ?? option.value ?? ""),
      editorial: record.editorial ?? null,
      explanation: record.explanation ?? null,
      proceduralLogic: record.proceduralLogic ?? null,
    });
    assert.doesNotMatch(
      learnerProjection,
      canonicalNamePattern,
      `${record.itemId}: Roman-script person name leaked into ${record.locale} learner text.`,
    );
  }

  assert.equal(record.reviewOnly, true, `${record.itemId}: reviewOnly`);
  assert.equal(record.questionBankEligible, false, `${record.itemId}: bank lock`);
  assert.equal(record.mockTestEligible, false, `${record.itemId}: mock lock`);
  assert.equal(record.publiclyPublishable, false, `${record.itemId}: public lock`);
  assert.equal(
    record.metadata?.humanLanguageReviewRequired,
    true,
    `${record.itemId}: human language review must remain required`,
  );
  assert.equal(
    record.metadata?.productDeliveryUnlocked,
    false,
    `${record.itemId}: product delivery must remain locked`,
  );
  assert.equal(
    record.metadata?.productionStagingApproved,
    false,
    `${record.itemId}: production staging must remain locked`,
  );
}

const representativeQls = new Set(representative.map((record) => String(record.qlId)));
for (const qlId of expectedQls) {
  assert.ok(representativeQls.has(qlId), `${qlId} missing from Markdown review sample`);
}

for (const locale of ["hi-IN", "pa-IN"] as const) {
  const cp001Qls = new Set(
    representative
      .filter((record) => record.checkpointId === "BLR-CP-001" && record.locale === locale)
      .map((record) => record.qlId),
  );
  assert.equal(cp001Qls.size, 7, `CP001 ${locale} representative QL coverage`);

  const cp002 = representative.filter(
    (record) => record.checkpointId === "BLR-CP-002" && record.locale === locale,
  );
  const presentations = new Set(cp002.map((record) => record.metadata?.presentation));
  const forms = new Set(cp002.map((record) => record.metadata?.questionForm));
  for (const presentation of ["POINTING", "PHOTOGRAPH", "INTRODUCTION", "STAGE", "CONVERSATION"]) {
    assert.ok(presentations.has(presentation), `CP002 ${locale} missing ${presentation}`);
  }
  for (const form of ["HOW_RELATED", "WHOSE_PHOTOGRAPH", "WHOSE_PORTRAIT"]) {
    assert.ok(forms.has(form), `CP002 ${locale} missing ${form}`);
  }
  assert.ok(cp002.some((record) => record.metadata?.selfIdentity === true), `CP002 ${locale} missing SELF`);
  assert.ok(cp002.some((record) => Number(record.metadata?.onlyConstraintCount ?? 0) > 0), `CP002 ${locale} missing ONLY`);
  assert.ok(cp002.some((record) => Number(record.metadata?.negativeConstraintCount ?? 0) > 0), `CP002 ${locale} missing negative constraint`);
}

for (const record of [
  ...corpora.cp006.english,
  ...corpora.cp006.hindi,
  ...corpora.cp006.punjabi,
]) {
  const learner = [
    record.sharedPrompt,
    ...(record.explanation?.coreConcept ?? []),
    ...(record.explanation?.commonTraps ?? []),
  ].join("\n");
  assert.doesNotMatch(learner, /arithmetic precedence/i);
  assert.doesNotMatch(learner, /गणितीय प्राथमिकता/);
  assert.doesNotMatch(learner, /ਗਣਿਤੀ ਤਰਜੀਹ/);
  assert.equal(record.metadata?.noArithmeticPrecedence, true);
  assert.equal(record.metadata?.editorialStatus, "TRILINGUAL_REVIEW_REQUIRED");
}

assert.match(markdown, /Status: \*\*review candidate only/);
assert.match(markdown, /BLR-QL-001\.\.BLR-QL-030/);
assert.match(markdown, /Current Question Bank, test, mock-test and public-release gates remain locked/);
assert.equal(markdown.includes("BLR-QL-031"), false);

console.log(JSON.stringify({
  verdict: "BLR_001_MULTILINGUAL_HUMAN_REVIEW_PACK_PROVED",
  fullRecordCount: full.length,
  representativeRecordCount: representative.length,
  permanentQlRange: summary.qlRange,
  languages: summary.languages,
  humanReviewRequired: true,
  automaticFreeze: false,
  productDeliveryUnlocked: false,
}, null, 2));
