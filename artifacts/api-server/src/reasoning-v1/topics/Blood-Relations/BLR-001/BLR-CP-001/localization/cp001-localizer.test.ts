import assert from "node:assert/strict";

import { BLR_CP001_PERMANENT_CONTRACTS } from "../cp001-permanent-contracts";
import { generateBlrCp001Question } from "../cp001-runtime";
import {
  BLR_CP001_HUMAN_REVIEW_BLOCKER,
  blrCp001CanonicalParityProjection,
  generateBlrCp001LocalizedQuestion,
} from "./cp001-localizer";

const scripts = {
  "hi-IN": /[\u0900-\u097F]/u,
  "pa-IN": /[\u0A00-\u0A7F]/u,
} as const;

let reviewed = 0;
const qlCounts: Record<string, number> = {};
const answerPositions = [0, 0, 0, 0];

for (const contract of BLR_CP001_PERMANENT_CONTRACTS) {
  for (let seed = 0; seed < 32; seed += 1) {
    const canonical = generateBlrCp001Question(contract.qlId, seed);
    for (const locale of ["hi-IN", "pa-IN"] as const) {
      const localized = generateBlrCp001LocalizedQuestion(contract.qlId, seed, locale);
      const repeat = generateBlrCp001LocalizedQuestion(contract.qlId, seed, locale);

      assert.deepEqual(repeat, localized, `${contract.qlId}/${seed}/${locale} must be deterministic.`);
      assert.deepEqual(
        blrCp001CanonicalParityProjection(localized),
        blrCp001CanonicalParityProjection(canonical),
        `${contract.qlId}/${seed}/${locale} semantic parity drifted.`,
      );
      assert.equal(localized.correctIndex, canonical.correctIndex);
      assert.equal(localized.options.length, 4);
      assert.equal(localized.options.filter((option) => option.isCorrect).length, 1);
      assert.equal(localized.options[localized.correctIndex]?.isCorrect, true);
      assert.equal(localized.reviewOnly, true);
      assert.equal(localized.publiclyPublishable, false);
      assert.equal(localized.questionStudioVisible, false);
      assert.equal(localized.questionBankEligible, false);
      assert.equal(localized.mockTestEligible, false);
      assert.equal(localized.metadata.semanticParity, "EXECUTABLE_PROVED");
      assert.equal(localized.metadata.humanLanguageReviewRequired, true);
      assert.deepEqual(localized.metadata.activeEditorialBlockers, [BLR_CP001_HUMAN_REVIEW_BLOCKER]);
      assert.equal(localized.metadata.productDeliveryUnlocked, false);
      assert.equal(localized.metadata.productionStagingApproved, false);
      assert.ok(scripts[locale].test(localized.stem), `${contract.qlId}/${seed}/${locale} has no target-script learner text.`);
      assert.ok(localized.explanation.conclusion.includes(localized.options[localized.correctIndex]!.value));
      assert.ok(localized.explanation.queryPath.length >= 2);
      assert.ok(
        localized.explanation.queryPath.some((step) =>
          step.includes(localized.options[localized.correctIndex]!.value),
        ),
        `${contract.qlId}/${seed}/${locale} explanation must connect the solved reasoning to the displayed answer.`,
      );
      assert.ok(localized.explanation.normalizedClues.length >= 1);
      assert.ok(!/\b(?:How|Which|Who|Read|Study|Consider|Use|Father|Mother|Brother|Sister|Son|Daughter|Husband|Wife)\b/i.test(localized.stem.replace(/[A-Z][a-z]+/g, "")));

      qlCounts[contract.qlId] = (qlCounts[contract.qlId] ?? 0) + 1;
      answerPositions[localized.correctIndex] += 1;
      reviewed += 1;
    }
  }
}

assert.equal(reviewed, BLR_CP001_PERMANENT_CONTRACTS.length * 32 * 2);
assert.deepEqual(
  Object.fromEntries(BLR_CP001_PERMANENT_CONTRACTS.map((contract) => [contract.qlId, qlCounts[contract.qlId]])),
  Object.fromEntries(BLR_CP001_PERMANENT_CONTRACTS.map((contract) => [contract.qlId, 64])),
);

console.log(JSON.stringify({
  verdict: "BLR_CP001_HI_PA_LOCALISATION_REVIEW_CANDIDATE_PROVED",
  localizedReviewCount: reviewed,
  qlCounts,
  answerPositions,
  semanticParity: true,
  humanLanguageReviewRequired: true,
  productDeliveryUnlocked: false,
}, null, 2));
