import assert from "node:assert/strict";
import { generateBlrCp006FrozenBank } from "../cp006-runtime";
import {
  BLR_CP006_HUMAN_REVIEW_BLOCKER,
  blrCp006CanonicalParityProjection,
  generateBlrCp006LocalizedReviewBank,
} from "./cp006-localizer";

const canonical = generateBlrCp006FrozenBank();
const hindi = generateBlrCp006LocalizedReviewBank("hi-IN");
const punjabi = generateBlrCp006LocalizedReviewBank("pa-IN");

assert.equal(canonical.length, 152, "CP-006 canonical bank drifted from 152 records.");
assert.equal(hindi.length, 152, "Hindi candidate count must remain 152.");
assert.equal(punjabi.length, 152, "Punjabi candidate count must remain 152.");

function qlCounts(records: readonly { qlId: string }[]) {
  const counts: Record<string, number> = {};
  for (const record of records) counts[record.qlId] = (counts[record.qlId] ?? 0) + 1;
  return counts;
}

const expectedQlCounts = {
  "BLR-QL-026": 72,
  "BLR-QL-027": 16,
  "BLR-QL-028": 16,
  "BLR-QL-029": 24,
  "BLR-QL-030": 24,
};
assert.deepEqual(qlCounts(canonical), expectedQlCounts, "Canonical CP-006 QL distribution drifted.");
assert.deepEqual(qlCounts(hindi), expectedQlCounts, "Hindi QL distribution drifted.");
assert.deepEqual(qlCounts(punjabi), expectedQlCounts, "Punjabi QL distribution drifted.");

const canonicalStatementCount = canonical.reduce((total, record) => total + record.codedStatements.length, 0);
assert.equal(canonicalStatementCount, 440, "CP-006 coded-statement inventory drifted from 440.");

const canonicalUnknownNodes = canonical.reduce(
  (total, record) => total + record.explanation.familyTree.nodes.filter((node) => node.gender === "unknown").length,
  0,
);

for (let index = 0; index < canonical.length; index += 1) {
  const source = canonical[index]!;
  for (const localized of [hindi[index]!, punjabi[index]!]) {
    assert.deepEqual(
      blrCp006CanonicalParityProjection(localized),
      blrCp006CanonicalParityProjection(source),
      `${localized.itemId}: canonical semantic parity drifted.`,
    );
    assert.equal(localized.canonicalItemId, source.itemId);
    assert.equal(localized.metadata.canonicalItemId, source.itemId);
    assert.equal(localized.metadata.canonicalSemanticFingerprint, source.metadata.semanticFingerprint);
    assert.equal(localized.correctIndex, source.correctIndex);
    assert.deepEqual(localized.codeKey, source.codeKey);
    assert.deepEqual(localized.codedStatements, source.codedStatements);
    assert.deepEqual(localized.query, source.query);
    assert.deepEqual(localized.graph, source.graph);
    assert.equal(localized.options.length, 4);
    assert.equal(localized.explanation.optionAnalysis.length, 4);
    assert.equal(localized.answer, localized.options[localized.correctIndex]!.text);
    assert.equal(localized.options[localized.correctIndex]!.semanticKey, source.options[source.correctIndex]!.semanticKey);
    assert.equal(localized.reviewOnly, true);
    assert.equal(localized.publiclyPublishable, false);
    assert.equal(localized.questionStudioVisible, false);
    assert.equal(localized.questionBankEligible, false);
    assert.equal(localized.mockTestEligible, false);
    assert.equal(localized.metadata.humanLanguageReviewRequired, true);
    assert.deepEqual(localized.metadata.activeEditorialBlockers, [BLR_CP006_HUMAN_REVIEW_BLOCKER]);
    assert.equal(localized.metadata.productDeliveryUnlocked, false);
    assert.equal(localized.metadata.productionStagingApproved, false);
    assert.equal(localized.metadata.semanticParity, "EXECUTABLE_PROVED");
    assert.notEqual(localized.sharedPrompt, source.sharedPrompt, `${localized.itemId}: shared prompt was not localized.`);
    assert.notEqual(localized.stem, source.stem, `${localized.itemId}: stem was not localized.`);
    for (const coded of source.codedStatements) {
      const literal = `${coded.leftId} ${coded.token} ${coded.rightId}`;
      assert(localized.sharedPrompt.includes(literal), `${localized.itemId}: displayed coded assertion ${literal} was lost.`);
    }
    for (const key of source.codeKey) {
      assert(localized.sharedPrompt.includes(`X ${key.token} Y`), `${localized.itemId}: code-key token ${key.token} was lost.`);
    }
    for (let optionIndex = 0; optionIndex < 4; optionIndex += 1) {
      assert.equal(localized.options[optionIndex]!.semanticKey, source.options[optionIndex]!.semanticKey);
      assert.equal(localized.options[optionIndex]!.isCorrect, source.options[optionIndex]!.isCorrect);
      assert.equal(localized.options[optionIndex]!.errorLabel, source.options[optionIndex]!.errorLabel);
      assert.equal(localized.explanation.optionAnalysis[optionIndex]!.optionText, localized.options[optionIndex]!.text);
      assert.equal(localized.explanation.optionAnalysis[optionIndex]!.isCorrect, localized.options[optionIndex]!.isCorrect);
    }
  }
}

const hindiUnknownNodes = hindi.reduce(
  (total, record) => total + record.explanation.familyTree.nodes.filter((node) => node.gender === "unknown").length,
  0,
);
const punjabiUnknownNodes = punjabi.reduce(
  (total, record) => total + record.explanation.familyTree.nodes.filter((node) => node.gender === "unknown").length,
  0,
);
assert.equal(hindiUnknownNodes, canonicalUnknownNodes, "Hindi UNKNOWN-gender evidence drifted.");
assert.equal(punjabiUnknownNodes, canonicalUnknownNodes, "Punjabi UNKNOWN-gender evidence drifted.");

assert.equal(new Set(hindi.map((record) => record.itemId)).size, 152, "Hindi item IDs must be unique.");
assert.equal(new Set(punjabi.map((record) => record.itemId)).size, 152, "Punjabi item IDs must be unique.");
assert.equal(
  new Set([...hindi, ...punjabi].map((record) => record.questionLanguageId)).size,
  304,
  "Question-language IDs must be unique.",
);

console.log(JSON.stringify({
  verdict: "BLR_CP006_HI_PA_LOCALISATION_REVIEW_CANDIDATE_PROVED",
  canonicalCount: canonical.length,
  hindiCount: hindi.length,
  punjabiCount: punjabi.length,
  localizedCount: hindi.length + punjabi.length,
  qlDistribution: qlCounts(canonical),
  codedStatementCount: canonicalStatementCount,
  canonicalUnknownGenderDiagramNodes: canonicalUnknownNodes,
  semanticParity: true,
  codeKeysPreserved: true,
  codedStatementsPreserved: true,
  queryObjectsPreserved: true,
  graphsPreserved: true,
  optionSemanticsPreserved: true,
  displayedCodedAssertionsPreserved: true,
  humanLanguageReviewRequired: true,
  productDeliveryUnlocked: false,
  questionStudioVisible: false,
  questionBankEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
}, null, 2));
