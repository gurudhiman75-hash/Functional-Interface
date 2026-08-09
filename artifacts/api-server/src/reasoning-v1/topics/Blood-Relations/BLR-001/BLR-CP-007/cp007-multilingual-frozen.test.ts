import { strict as assert } from "node:assert";
import { BLR_CP007_ENGLISH_FREEZE_AUTHORITY } from "./cp007-english-frozen";
import {
  BLR_CP007_MULTILINGUAL_FREEZE_APPROVED_AT,
  BLR_CP007_MULTILINGUAL_FREEZE_AUTHORITY,
  BLR_CP007_MULTILINGUAL_FREEZE_REVIEW_NOTE,
  generateBlrCp007MultilingualFrozenBank,
  generateBlrCp007MultilingualFrozenBundle,
  multilingualFrozenLearnerCorpusIsUnchanged,
  multilingualFrozenSemanticParityIsExact,
} from "./cp007-multilingual-frozen";

const hindi = generateBlrCp007MultilingualFrozenBank("hi-IN");
const punjabi = generateBlrCp007MultilingualFrozenBank("pa-IN");
const bundle = generateBlrCp007MultilingualFrozenBundle();
const localised = [...hindi, ...punjabi];
const all = [...bundle.english, ...bundle.hindi, ...bundle.punjabi];

const expectedQlCounts = {
  "BLR-QL-031": 48,
  "BLR-QL-032": 32,
  "BLR-QL-033": 24,
  "BLR-QL-034": 32,
  "BLR-QL-035": 32,
};
const countByQl = (bank: typeof hindi): Record<string, number> => Object.fromEntries(
  Object.keys(expectedQlCounts).map((qlId) => [
    qlId,
    bank.filter((question) => question.qlId === qlId).length,
  ]),
);

assert.equal(hindi.length, 168);
assert.equal(punjabi.length, 168);
assert.equal(bundle.english.length, 168);
assert.equal(all.length, 504);
assert.deepEqual(countByQl(hindi), expectedQlCounts);
assert.deepEqual(countByQl(punjabi), expectedQlCounts);
assert.equal(multilingualFrozenLearnerCorpusIsUnchanged("hi-IN"), true);
assert.equal(multilingualFrozenLearnerCorpusIsUnchanged("pa-IN"), true);
assert.equal(multilingualFrozenSemanticParityIsExact("hi-IN"), true);
assert.equal(multilingualFrozenSemanticParityIsExact("pa-IN"), true);
assert.equal(new Set(hindi.map((question) => question.itemId)).size, 168);
assert.equal(new Set(punjabi.map((question) => question.itemId)).size, 168);

for (const question of bundle.english) {
  assert.equal(question.metadata.englishFreezeStatus, BLR_CP007_ENGLISH_FREEZE_AUTHORITY);
  assert.equal(question.reviewOnly, true);
  assert.equal(question.publiclyPublishable, false);
  assert.equal(question.questionStudioVisible, false);
  assert.equal(question.questionBankEligible, false);
  assert.equal(question.mockTestEligible, false);
}

for (const question of localised) {
  assert.equal(question.reviewProof.reviewStatus, "MULTILINGUAL_FROZEN");
  assert.equal(question.reviewProof.reviewerNote, BLR_CP007_MULTILINGUAL_FREEZE_REVIEW_NOTE);
  assert.deepEqual(question.metadata.activeEditorialBlockers, []);
  assert.deepEqual(question.v4ReviewProof.activeEditorialBlockers, []);
  assert.equal(question.metadata.localizationStatus, BLR_CP007_MULTILINGUAL_FREEZE_AUTHORITY);
  assert.equal(question.metadata.multilingualFreezeStatus, BLR_CP007_MULTILINGUAL_FREEZE_AUTHORITY);
  assert.equal(question.v4ReviewProof.humanReviewRequired, false);
  assert.equal(question.localisationProof.authority, BLR_CP007_MULTILINGUAL_FREEZE_AUTHORITY);
  assert.equal(question.localisationProof.sourceAuthority, "BLR_CP007_HI_PA_LOCALISATION_REVIEW_CANDIDATE");
  assert.equal(question.localisationProof.humanLanguageReviewRequired, false);
  assert.equal(question.localisationProof.productDeliveryUnlocked, false);
  assert.deepEqual(question.multilingualFreezeProof, {
    authority: BLR_CP007_MULTILINGUAL_FREEZE_AUTHORITY,
    approvedBy: "PRODUCT_OWNER",
    approvedAt: BLR_CP007_MULTILINGUAL_FREEZE_APPROVED_AT,
    sourceAuthority: "BLR_CP007_HI_PA_LOCALISATION_REVIEW_CANDIDATE",
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
  assert(!question.sharedPrompt.includes("ਇਨ੍ਹਾਂ ਸੰਕੇਤਾਂ ਦੇ ਅਰਥ"));
  assert(!question.stem.includes(" हो?"));
  assert(!question.stem.includes(" हो।"));
  assert(!question.stem.includes(" ਹੋਵੇ?"));
  assert(!question.stem.includes(" ਹੋਵੇ।"));
}

const summary = {
  englishCount: bundle.english.length,
  hindiFrozenCount: hindi.length,
  punjabiFrozenCount: punjabi.length,
  localizedFrozenCount: localised.length,
  totalMultilingualRecordCount: all.length,
  hindiLearnerCorpusChanged: !multilingualFrozenLearnerCorpusIsUnchanged("hi-IN"),
  punjabiLearnerCorpusChanged: !multilingualFrozenLearnerCorpusIsUnchanged("pa-IN"),
  hindiSemanticParity: multilingualFrozenSemanticParityIsExact("hi-IN"),
  punjabiSemanticParity: multilingualFrozenSemanticParityIsExact("pa-IN"),
  localisationReviewPendingCount: localised.filter((question) =>
    question.metadata.activeEditorialBlockers.includes("HINDI_PUNJABI_HUMAN_REVIEW_PENDING")
  ).length,
  humanReviewRequiredCount: localised.filter((question) => question.v4ReviewProof.humanReviewRequired).length,
  multilingualFrozenCount: localised.filter((question) =>
    question.metadata.multilingualFreezeStatus === BLR_CP007_MULTILINGUAL_FREEZE_AUTHORITY
  ).length,
  productDeliveryEnabledCount: all.filter((question) =>
    question.publiclyPublishable
      || question.questionStudioVisible
      || question.questionBankEligible
      || question.mockTestEligible
  ).length,
  verdict: "BLR_CP007_MULTILINGUAL_FROZEN",
};

assert.equal(summary.localisationReviewPendingCount, 0);
assert.equal(summary.humanReviewRequiredCount, 0);
assert.equal(summary.multilingualFrozenCount, 336);
assert.equal(summary.productDeliveryEnabledCount, 0);

console.log(JSON.stringify(summary, null, 2));
