import { strict as assert } from "node:assert";

import { generateBlrCp006FrozenBank } from "./cp006-runtime";
import { generateBlrCp006MultilingualFrozenBank } from "./cp006-multilingual-frozen";
import {
  BLR_CP006_EDITORIAL_V3_HUMAN_REVIEW_BLOCKER,
  BLR_CP006_EDITORIAL_V3_REVIEW_CANDIDATE,
  cp006EditorialV3SemanticProjection,
  generateBlrCp006EditorialV3ReviewBundle,
} from "./cp006-editorial-v3-review";

const source = {
  english: generateBlrCp006FrozenBank(),
  hindi: generateBlrCp006MultilingualFrozenBank("hi-IN"),
  punjabi: generateBlrCp006MultilingualFrozenBank("pa-IN"),
} as const;
const candidate = generateBlrCp006EditorialV3ReviewBundle();

for (const language of ["english", "hindi", "punjabi"] as const) {
  assert.equal(candidate[language].length, 152);
  for (let index = 0; index < source[language].length; index += 1) {
    const before = source[language][index]!;
    const after = candidate[language][index]!;

    assert.deepEqual(
      cp006EditorialV3SemanticProjection(after),
      cp006EditorialV3SemanticProjection(before),
      `${language}/${before.itemId}: semantic projection changed`,
    );
    assert.notEqual(after.sharedPrompt, before.sharedPrompt);
    assert.equal(after.stem, before.stem);
    assert.deepEqual(after.options, before.options);
    assert.equal(after.correctIndex, before.correctIndex);
    assert.equal(after.answer, before.answer);
    assert.deepEqual(after.decodedStatements, before.decodedStatements);
    assert.deepEqual(after.graph, before.graph);

    const learnerText = [
      after.sharedPrompt,
      ...after.explanation.coreConcept,
      ...after.explanation.commonTraps,
    ].join("\n");
    assert.doesNotMatch(learnerText, /arithmetic precedence/i);
    assert.doesNotMatch(learnerText, /गणितीय प्राथमिकता/);
    assert.doesNotMatch(learnerText, /ਗਣਿਤੀ ਤਰਜੀਹ/);

    assert.equal(after.metadata.noArithmeticPrecedence, true);
    assert.equal(after.metadata.editorialAuthority, BLR_CP006_EDITORIAL_V3_REVIEW_CANDIDATE);
    assert.equal(after.metadata.editorialStatus, "TRILINGUAL_REVIEW_REQUIRED");
    assert.equal(after.metadata.humanLanguageReviewRequired, true);
    assert.deepEqual(
      after.metadata.activeEditorialBlockers,
      [BLR_CP006_EDITORIAL_V3_HUMAN_REVIEW_BLOCKER],
    );
    assert.equal(after.metadata.productDeliveryUnlocked, false);
    assert.equal(after.metadata.productionStagingApproved, false);
    assert.equal(after.reviewOnly, true);
    assert.equal(after.publiclyPublishable, false);
    assert.equal(after.questionStudioVisible, false);
    assert.equal(after.questionBankEligible, false);
    assert.equal(after.mockTestEligible, false);
  }
}

console.log(JSON.stringify({
  verdict: "BLR_CP006_EDITORIAL_V3_TRILINGUAL_REVIEW_CANDIDATE_PROVED",
  englishCount: candidate.english.length,
  hindiCount: candidate.hindi.length,
  punjabiCount: candidate.punjabi.length,
  learnerPromptTutorialHintRemoved: true,
  solverNoArithmeticInvariantPreserved: true,
  semanticParityPreserved: true,
  humanLanguageReviewRequired: true,
  productDeliveryUnlocked: false,
}, null, 2));
