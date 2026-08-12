import assert from "node:assert/strict";
import { generateBlrCp005FrozenBank } from "../cp005-bank";
import {
  BLR_CP005_HUMAN_REVIEW_BLOCKER,
  blrCp005CanonicalParityProjection,
  generateBlrCp005LocalizedReviewBank,
} from "./cp005-localizer";

const canonical = generateBlrCp005FrozenBank();
const hindi = generateBlrCp005LocalizedReviewBank("hi-IN");
const punjabi = generateBlrCp005LocalizedReviewBank("pa-IN");

assert.equal(canonical.length, 184, "CP-005 canonical bank drifted from 184 records.");
assert.equal(hindi.length, 184, "Hindi candidate count must remain 184.");
assert.equal(punjabi.length, 184, "Punjabi candidate count must remain 184.");

function qlCounts(records: readonly { qlId: string }[]) {
  const counts: Record<string, number> = {};
  for (const record of records) counts[record.qlId] = (counts[record.qlId] ?? 0) + 1;
  return counts;
}
const expectedQlCounts = {
  "BLR-QL-018": 32,
  "BLR-QL-019": 16,
  "BLR-QL-020": 48,
  "BLR-QL-021": 24,
  "BLR-QL-022": 16,
  "BLR-QL-023": 16,
  "BLR-QL-024": 16,
  "BLR-QL-025": 16,
};
assert.deepEqual(qlCounts(canonical), expectedQlCounts, "Canonical CP-005 QL distribution drifted.");
assert.deepEqual(qlCounts(hindi), expectedQlCounts, "Hindi QL distribution drifted.");
assert.deepEqual(qlCounts(punjabi), expectedQlCounts, "Punjabi QL distribution drifted.");

const canonicalUnknownNodes = canonical.reduce((total, record) => total + record.explanation.familyTrees.flatMap((tree) => tree.nodes).filter((node) => node.gender === "unknown").length, 0);

for (let index = 0; index < canonical.length; index += 1) {
  const source = canonical[index]!;
  for (const localized of [hindi[index]!, punjabi[index]!]) {
    assert.deepEqual(
      blrCp005CanonicalParityProjection(localized),
      blrCp005CanonicalParityProjection(source),
      `${localized.itemId}: canonical semantic parity drifted.`,
    );
    assert.equal(localized.canonicalItemId, source.itemId);
    assert.equal(localized.metadata.canonicalItemId, source.itemId);
    assert.equal(localized.metadata.canonicalSemanticFingerprint, source.metadata.semanticFingerprint);
    assert.equal(localized.correctIndex, source.correctIndex);
    assert.deepEqual(localized.answer, source.answer);
    assert.deepEqual(localized.querySpec, source.querySpec);
    assert.deepEqual(localized.modelSpace, source.modelSpace);
    assert.equal(localized.options.length, 4);
    assert.equal(localized.explanation.optionAnalysis.length, 4);
    assert.equal(localized.explanation.familyTrees.length, source.explanation.familyTrees.length);
    assert.equal(localized.reviewOnly, true);
    assert.equal(localized.publiclyPublishable, false);
    assert.equal(localized.questionStudioVisible, false);
    assert.equal(localized.questionBankEligible, false);
    assert.equal(localized.mockTestEligible, false);
    assert.equal(localized.metadata.humanLanguageReviewRequired, true);
    assert.deepEqual(localized.metadata.activeEditorialBlockers, [BLR_CP005_HUMAN_REVIEW_BLOCKER]);
    assert.equal(localized.metadata.productDeliveryUnlocked, false);
    assert.equal(localized.metadata.productionStagingApproved, false);
    assert.equal(localized.metadata.semanticParity, "EXECUTABLE_PROVED");
    assert.notEqual(localized.sharedPrompt, source.sharedPrompt, `${localized.itemId}: shared prompt was not localized.`);
    assert.notEqual(localized.stem, source.stem, `${localized.itemId}: stem was not localized.`);
    for (let optionIndex = 0; optionIndex < 4; optionIndex += 1) {
      assert.equal(localized.explanation.optionAnalysis[optionIndex]!.optionText, localized.options[optionIndex]!.text);
      assert.equal(localized.explanation.optionAnalysis[optionIndex]!.isCorrect, localized.options[optionIndex]!.isCorrect);
    }
  }
}

const hindiUnknownNodes = hindi.reduce((total, record) => total + record.explanation.familyTrees.flatMap((tree) => tree.nodes).filter((node) => node.gender === "unknown").length, 0);
const punjabiUnknownNodes = punjabi.reduce((total, record) => total + record.explanation.familyTrees.flatMap((tree) => tree.nodes).filter((node) => node.gender === "unknown").length, 0);
assert.equal(hindiUnknownNodes, canonicalUnknownNodes, "Hindi UNKNOWN-gender evidence drifted.");
assert.equal(punjabiUnknownNodes, canonicalUnknownNodes, "Punjabi UNKNOWN-gender evidence drifted.");

assert.equal(new Set(hindi.map((record) => record.itemId)).size, 184, "Hindi item IDs must be unique.");
assert.equal(new Set(punjabi.map((record) => record.itemId)).size, 184, "Punjabi item IDs must be unique.");
assert.equal(new Set([...hindi, ...punjabi].map((record) => record.questionLanguageId)).size, 368, "Question-language IDs must be unique.");

console.log(JSON.stringify({
  verdict: "BLR_CP005_HI_PA_LOCALISATION_REVIEW_CANDIDATE_PROVED",
  canonicalCount: canonical.length,
  hindiCount: hindi.length,
  punjabiCount: punjabi.length,
  localizedCount: hindi.length + punjabi.length,
  qlDistribution: qlCounts(canonical),
  modelSpaceGroups: new Set(canonical.map((record) => record.groupKey)).size,
  totalEnumeratedModels: canonical.reduce((total, record) => total + record.modelSpace.modelCount, 0),
  canonicalUnknownGenderDiagramNodes: canonicalUnknownNodes,
  semanticParity: true,
  querySpecsPreserved: true,
  modelSpacesPreserved: true,
  optionAnalysisComplete: true,
  humanLanguageReviewRequired: true,
  productDeliveryUnlocked: false,
  questionStudioVisible: false,
  questionBankEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
}, null, 2));
