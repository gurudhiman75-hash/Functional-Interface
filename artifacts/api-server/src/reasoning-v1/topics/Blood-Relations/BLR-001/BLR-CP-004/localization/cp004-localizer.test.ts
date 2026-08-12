import assert from "node:assert/strict";
import { generateBlrCp004FrozenBank } from "../cp004-bank";
import {
  BLR_CP004_HUMAN_REVIEW_BLOCKER,
  blrCp004CanonicalParityProjection,
  generateBlrCp004LocalizedReviewBank,
} from "./cp004-localizer";

const canonical = generateBlrCp004FrozenBank();
const hindi = generateBlrCp004LocalizedReviewBank("hi-IN");
const punjabi = generateBlrCp004LocalizedReviewBank("pa-IN");

assert.equal(canonical.length, 612, "CP-004 canonical English bank drifted from 612 records.");
assert.equal(hindi.length, canonical.length, "Hindi candidate count must match canonical count.");
assert.equal(punjabi.length, canonical.length, "Punjabi candidate count must match canonical count.");

function qlCounts(records: readonly { qlId: string }[]) {
  const counts: Record<string, number> = {};
  for (const record of records) counts[record.qlId] = (counts[record.qlId] ?? 0) + 1;
  return counts;
}

assert.deepEqual(qlCounts(hindi), qlCounts(canonical), "Hindi QL ownership distribution drifted.");
assert.deepEqual(qlCounts(punjabi), qlCounts(canonical), "Punjabi QL ownership distribution drifted.");

for (let index = 0; index < canonical.length; index += 1) {
  const source = canonical[index]!;
  for (const localized of [hindi[index]!, punjabi[index]!]) {
    assert.deepEqual(
      blrCp004CanonicalParityProjection(localized),
      blrCp004CanonicalParityProjection(source),
      `${localized.itemId}: canonical semantic parity drifted.`,
    );
    assert.equal(localized.canonicalItemId, source.itemId);
    assert.equal(localized.metadata.canonicalItemId, source.itemId);
    assert.equal(localized.metadata.canonicalSemanticFingerprint, source.metadata.semanticFingerprint);
    assert.equal(localized.correctIndex, source.correctIndex);
    assert.deepEqual(localized.answer, source.answer);
    assert.equal(localized.options.length, 4);
    assert.equal(localized.explanation.optionAnalysis.length, 4);
    assert.equal(localized.reviewOnly, true);
    assert.equal(localized.publiclyPublishable, false);
    assert.equal(localized.questionStudioVisible, false);
    assert.equal(localized.questionBankEligible, false);
    assert.equal(localized.mockTestEligible, false);
    assert.equal(localized.metadata.humanLanguageReviewRequired, true);
    assert.deepEqual(localized.metadata.activeEditorialBlockers, [BLR_CP004_HUMAN_REVIEW_BLOCKER]);
    assert.equal(localized.metadata.productDeliveryUnlocked, false);
    assert.equal(localized.metadata.productionStagingApproved, false);
    assert.equal(localized.metadata.semanticParity, "EXECUTABLE_PROVED");
    assert.notEqual(localized.sharedPrompt, source.sharedPrompt, `${localized.itemId}: passage was not localized.`);
    assert.notEqual(localized.stem, source.stem, `${localized.itemId}: stem was not localized.`);
  }
}

const canonicalZero = canonical.filter(
  (record) => record.answer.kind === "NUMBER" && record.answer.value === 0,
).length;
const hindiZero = hindi.filter(
  (record) => record.answer.kind === "NUMBER" && record.answer.value === 0,
).length;
const punjabiZero = punjabi.filter(
  (record) => record.answer.kind === "NUMBER" && record.answer.value === 0,
).length;
assert.equal(canonicalZero, 1, "CP-004 canonical zero-answer remediation drifted.");
assert.equal(hindiZero, canonicalZero, "Hindi zero-answer semantics drifted.");
assert.equal(punjabiZero, canonicalZero, "Punjabi zero-answer semantics drifted.");

assert.equal(new Set(hindi.map((record) => record.itemId)).size, 612, "Hindi item IDs must be unique.");
assert.equal(new Set(punjabi.map((record) => record.itemId)).size, 612, "Punjabi item IDs must be unique.");
assert.equal(
  new Set([...hindi, ...punjabi].map((record) => record.questionLanguageId)).size,
  1224,
  "Localized question-language identities must be unique.",
);

console.log(JSON.stringify({
  verdict: "BLR_CP004_HI_PA_LOCALISATION_REVIEW_CANDIDATE_PROVED",
  canonicalCount: canonical.length,
  hindiCount: hindi.length,
  punjabiCount: punjabi.length,
  localizedCount: hindi.length + punjabi.length,
  qlDistribution: qlCounts(canonical),
  zeroAnswerCount: canonicalZero,
  semanticParity: true,
  optionAnalysisComplete: true,
  humanLanguageReviewRequired: true,
  productDeliveryUnlocked: false,
  questionStudioVisible: false,
  questionBankEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
}, null, 2));
