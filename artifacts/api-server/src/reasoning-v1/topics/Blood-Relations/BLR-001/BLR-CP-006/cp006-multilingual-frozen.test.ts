import { strict as assert } from "node:assert";
import {
  BLR_CP006_MULTILINGUAL_FREEZE_APPROVED_AT,
  BLR_CP006_MULTILINGUAL_FREEZE_AUTHORITY,
  generateBlrCp006MultilingualFrozenBank,
  generateBlrCp006MultilingualFrozenBundle,
  multilingualFrozenLearnerCorpusIsUnchanged,
  multilingualFrozenSemanticParityIsExact,
} from "./cp006-multilingual-frozen";
import { BLR_CP006_HI_PA_LOCALISATION_REVIEW_CANDIDATE } from "./localization/cp006-localizer";

const hindi = generateBlrCp006MultilingualFrozenBank("hi-IN");
const punjabi = generateBlrCp006MultilingualFrozenBank("pa-IN");
const bundle = generateBlrCp006MultilingualFrozenBundle();
const localized = [...hindi, ...punjabi];
const all = [...bundle.english, ...localized];

const expectedQlCounts: Record<string, number> = {
  "BLR-QL-026": 72,
  "BLR-QL-027": 16,
  "BLR-QL-028": 16,
  "BLR-QL-029": 24,
  "BLR-QL-030": 24,
};
const countByQl = (bank: readonly { qlId: string }[]) => Object.fromEntries(
  Object.keys(expectedQlCounts).map((qlId) => [
    qlId,
    bank.filter((question) => question.qlId === qlId).length,
  ]),
);

assert.equal(bundle.english.length, 152);
assert.equal(hindi.length, 152);
assert.equal(punjabi.length, 152);
assert.equal(localized.length, 304);
assert.equal(all.length, 456);
assert.deepEqual(countByQl(hindi), expectedQlCounts);
assert.deepEqual(countByQl(punjabi), expectedQlCounts);
assert.equal(multilingualFrozenLearnerCorpusIsUnchanged("hi-IN"), true);
assert.equal(multilingualFrozenLearnerCorpusIsUnchanged("pa-IN"), true);
assert.equal(multilingualFrozenSemanticParityIsExact("hi-IN"), true);
assert.equal(multilingualFrozenSemanticParityIsExact("pa-IN"), true);
assert.equal(new Set(hindi.map((question) => question.itemId)).size, 152);
assert.equal(new Set(punjabi.map((question) => question.itemId)).size, 152);

for (const question of localized) {
  assert.equal(question.metadata.localizationAuthority, BLR_CP006_MULTILINGUAL_FREEZE_AUTHORITY);
  assert.equal(question.metadata.localizationStatus, "MULTILINGUAL_FROZEN");
  assert.equal(question.metadata.reviewStatus, "MULTILINGUAL_FROZEN");
  assert.equal(question.metadata.multilingualFreezeStatus, BLR_CP006_MULTILINGUAL_FREEZE_AUTHORITY);
  assert.equal(question.metadata.humanLanguageReviewRequired, false);
  assert.deepEqual(question.metadata.activeEditorialBlockers, []);
  assert.equal(question.metadata.productDeliveryUnlocked, false);
  assert.equal(question.metadata.productionStagingApproved, false);
  assert.deepEqual(question.multilingualFreezeProof, {
    authority: BLR_CP006_MULTILINGUAL_FREEZE_AUTHORITY,
    approvedBy: "PRODUCT_OWNER",
    approvedAt: BLR_CP006_MULTILINGUAL_FREEZE_APPROVED_AT,
    sourceAuthority: BLR_CP006_HI_PA_LOCALISATION_REVIEW_CANDIDATE,
    learnerCorpusChanged: false,
    semanticParityPreserved: true,
    questionStudioUnlocked: false,
    productDeliveryUnlocked: false,
  });
  assert.equal(question.reviewOnly, true);
  assert.equal(question.publiclyPublishable, false);
  assert.equal(question.questionStudioVisible, false);
  assert.equal(question.questionBankEligible, false);
  assert.equal(question.mockTestEligible, false);
}

const summary = {
  englishCount: bundle.english.length,
  hindiFrozenCount: hindi.length,
  punjabiFrozenCount: punjabi.length,
  localizedFrozenCount: localized.length,
  totalMultilingualRecordCount: all.length,
  hindiLearnerCorpusChanged: !multilingualFrozenLearnerCorpusIsUnchanged("hi-IN"),
  punjabiLearnerCorpusChanged: !multilingualFrozenLearnerCorpusIsUnchanged("pa-IN"),
  hindiSemanticParity: multilingualFrozenSemanticParityIsExact("hi-IN"),
  punjabiSemanticParity: multilingualFrozenSemanticParityIsExact("pa-IN"),
  localizationReviewPendingCount: localized.filter(
    (question) => question.metadata.activeEditorialBlockers.length > 0
  ).length,
  humanReviewRequiredCount: localized.filter(
    (question) => question.metadata.humanLanguageReviewRequired
  ).length,
  multilingualFrozenCount: localized.filter(
    (question) =>
      question.metadata.multilingualFreezeStatus === BLR_CP006_MULTILINGUAL_FREEZE_AUTHORITY
  ).length,
  productDeliveryEnabledCount: all.filter(
    (question) =>
      question.publiclyPublishable
      || question.questionStudioVisible
      || question.questionBankEligible
      || question.mockTestEligible
  ).length,
  verdict: "BLR_CP006_MULTILINGUAL_FROZEN",
};

assert.equal(summary.localizationReviewPendingCount, 0);
assert.equal(summary.humanReviewRequiredCount, 0);
assert.equal(summary.multilingualFrozenCount, 304);
assert.equal(summary.productDeliveryEnabledCount, 0);

console.log(JSON.stringify(summary, null, 2));
