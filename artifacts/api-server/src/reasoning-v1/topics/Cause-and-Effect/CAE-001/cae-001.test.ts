import assert from "node:assert/strict";
import {
  listEnabledReasoningV1QuestionStudioPackages,
  listReasoningV1QuestionStudioReviewPackages,
  persistReasoningV1QuestionStudioReview,
  previewReasoningV1QuestionStudioReview,
} from "../../../question-studio-review-registry.ts";
import { generateCaeQuestion } from "./chapter-generator.ts";
import { causalPath, solveCaeRelationship } from "./causal-solver.ts";
import { CAE_001_CAUSAL_WORLDS, CAE_001_PROJECTION_AUTHORITIES } from "./causal-world-authorities.ts";
import {
  assertCae001QuestionStudioPersistenceAllowed,
  CAE_001_QUESTION_STUDIO_PACKAGE_ID,
  CAE_001_QUESTION_STUDIO_REVIEW_PACKAGE,
  previewCae001QuestionStudioReview,
} from "./question-studio-review.ts";
import { CAE_QL_IDS, type CaeLocale } from "./types.ts";
import { validateCaeEngineAuthorities } from "./validator.ts";

const LOCALES: readonly CaeLocale[] = ["en-IN", "hi-IN", "pa-IN"];

assert.deepEqual(validateCaeEngineAuthorities(), []);
assert.equal(CAE_001_CAUSAL_WORLDS.length, 7);
assert.equal(CAE_001_PROJECTION_AUTHORITIES.length, 12);
assert.equal(CAE_001_QUESTION_STUDIO_REVIEW_PACKAGE.permanentQlCount, 9);
assert.equal(CAE_001_QUESTION_STUDIO_REVIEW_PACKAGE.causalWorldCount, 7);
assert.equal(CAE_001_QUESTION_STUDIO_REVIEW_PACKAGE.projectionAuthorityCount, 12);
assert.equal(CAE_001_QUESTION_STUDIO_REVIEW_PACKAGE.questionBankWritable, false);
assert.equal(CAE_001_QUESTION_STUDIO_REVIEW_PACKAGE.mockTestEligible, false);
assert.equal(CAE_001_QUESTION_STUDIO_REVIEW_PACKAGE.publiclyPublishable, false);

const fogWorld = CAE_001_CAUSAL_WORLDS.find((world) => world.id === "CAE-WORLD-AIRPORT-FOG")!;
const heatWorld = CAE_001_CAUSAL_WORLDS.find((world) => world.id === "CAE-WORLD-HEATWAVE-DEMAND")!;
const landWorld = CAE_001_CAUSAL_WORLDS.find((world) => world.id === "CAE-WORLD-LANDSLIDE-SUPPLY")!;
assert.equal(solveCaeRelationship(fogWorld, "fog-low-visibility", "fog-flight-cancellations"), "FIRST_DIRECT_CAUSES_SECOND");
assert.equal(solveCaeRelationship(heatWorld, "heat-water-demand", "heat-electricity-demand"), "COMMON_CAUSE");
assert.deepEqual(
  causalPath(landWorld, "land-heavy-rainfall", "land-vegetable-prices"),
  ["land-heavy-rainfall", "land-landslide", "land-highway-blocked", "land-supply-delayed", "land-vegetable-prices"],
);

for (const qlId of CAE_QL_IDS) {
  const seenAnswerPositions = new Set<number>();
  const seenProjections = new Set<string>();
  for (let seed = 0; seed < 160; seed += 1) {
    const en = generateCaeQuestion({ qlId, locale: "en-IN", seed });
    const replay = generateCaeQuestion({ qlId, locale: "en-IN", seed });
    assert.deepEqual(replay, en, `${qlId}/${seed}: generation must be deterministic`);
    assert.equal(en.options.length, 4, `${qlId}/${seed}: default profile must be four-way`);
    assert.equal(new Set(en.options).size, en.options.length, `${qlId}/${seed}: options must be unique`);
    assert.equal(en.optionMetadata.filter((option) => option.isCorrect).length, 1, `${qlId}/${seed}: exactly one option must be correct`);
    assert.equal(en.options[en.correctIndex], en.optionMetadata[en.correctIndex]!.text);
    seenAnswerPositions.add(en.correctIndex);
    seenProjections.add(en.projectionId);

    for (const locale of LOCALES) {
      const localized = generateCaeQuestion({ qlId, locale, seed });
      assert.equal(localized.projectionId, en.projectionId, `${qlId}/${seed}/${locale}: projection drift`);
      assert.equal(localized.answerId, en.answerId, `${qlId}/${seed}/${locale}: answer drift`);
      assert.equal(localized.correctIndex, en.correctIndex, `${qlId}/${seed}/${locale}: option order drift`);
      assert.equal(localized.difficulty, en.difficulty, `${qlId}/${seed}/${locale}: difficulty drift`);
      assert.deepEqual(localized.causalTrace, en.causalTrace, `${qlId}/${seed}/${locale}: causal trace drift`);
    }
  }
  assert.equal(seenAnswerPositions.size, 4, `${qlId}: correct answer must vary across all four positions`);
  assert.ok(seenProjections.size >= 1, `${qlId}: must have an executable projection`);
}

const fiveWay = generateCaeQuestion({ qlId: "CAE-QL-002", locale: "en-IN", seed: 41, questionProfile: "FIVE_WAY" });
assert.equal(fiveWay.options.length, 5);
assert.equal(fiveWay.questionProfile, "FIVE_WAY");
assert.equal(fiveWay.optionMetadata.filter((option) => option.isCorrect).length, 1);

const preview = previewCae001QuestionStudioReview({ qlId: "CAE-QL-009", locale: "pa-IN", seed: 73 });
assert.equal(preview.packageId, CAE_001_QUESTION_STUDIO_PACKAGE_ID);
assert.equal(preview.lifecycleStatus, "REVIEW_ONLY");
assert.equal(preview.question.metadata.reviewOnly, true);
assert.ok(
  listReasoningV1QuestionStudioReviewPackages().some((entry) => entry.packageId === CAE_001_QUESTION_STUDIO_PACKAGE_ID),
  "shared registry must list CAE-001",
);
assert.ok(
  listEnabledReasoningV1QuestionStudioPackages().some((entry) => entry.packageId === CAE_001_QUESTION_STUDIO_PACKAGE_ID),
  "shared registry must enable CAE-001 for review",
);
const sharedPreview = previewReasoningV1QuestionStudioReview({
  packageId: CAE_001_QUESTION_STUDIO_PACKAGE_ID,
  qlId: "CAE-QL-008",
  locale: "hi-IN",
  seed: 41,
});
assert.ok("question" in sharedPreview, "CAE-001 shared preview must expose one generated question");
if (!("question" in sharedPreview)) throw new Error("CAE-001 shared preview shape mismatch.");
assert.equal(sharedPreview.packageId, CAE_001_QUESTION_STUDIO_PACKAGE_ID);
assert.equal(sharedPreview.question.metadata.reviewOnly, true);
assert.throws(() => assertCae001QuestionStudioPersistenceAllowed(), /review only.*delivery remain locked/i);
assert.throws(
  () => persistReasoningV1QuestionStudioReview({
    packageId: CAE_001_QUESTION_STUDIO_PACKAGE_ID,
    qlId: "CAE-QL-001",
    locale: "en-IN",
    seed: 11,
  }),
  /review only.*delivery remain locked/i,
);

console.log("PASS_CAE_001_CAUSAL_WORLD_ENGINE_V2");
