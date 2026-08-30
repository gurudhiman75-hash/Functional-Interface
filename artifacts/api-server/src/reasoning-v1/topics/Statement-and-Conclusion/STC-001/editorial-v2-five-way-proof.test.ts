import assert from "node:assert/strict";
import { STC_V2_FIVE_WAY_EITHER_AUTHORITIES } from "./editorial-v2-five-way-either-authorities.ts";
import { generateStcV2FiveWayQuestion } from "./editorial-v2-five-way-profile.ts";
import { STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE } from "./question-studio-review-v2.ts";
import { stcExclusiveEither } from "./truth-model-solver.ts";
import { STC_QL_IDS, type StcLocale } from "./types.ts";

const LOCALES: readonly StcLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const eitherSurfaceSet = new Set<string>();

// The legacy V2 solver pool remains executable for audit/history, but it is not
// an active presentation profile in non-syllogistic STC V2.1.
assert.deepEqual(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.presentationProfiles, ["FOUR_WAY"]);
assert.equal(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.bankingFiveWayEitherStatus, "REMOVED_FROM_ACTIVE_NON_SYLLOGISTIC_STC");
assert.equal(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.archivedSolverValidatedFiveWayEitherAuthorityCount, 8);

assert.equal(STC_V2_FIVE_WAY_EITHER_AUTHORITIES.length, 8, "archived V2 either-or audit pool must retain eight authorities");
assert.equal(new Set(STC_V2_FIVE_WAY_EITHER_AUTHORITIES.map((entry) => entry.id)).size, 8, "archived V2 either-or authority IDs must be unique");

for (const [index, authority] of STC_V2_FIVE_WAY_EITHER_AUTHORITIES.entries()) {
  eitherSurfaceSet.add(authority.surfaceArchetype);
  assert.equal(authority.qlId, "STC-QL-002");
  assert.equal(stcExclusiveEither(authority.premises, authority.candidates[0].expression, authority.candidates[1].expression), true, `${authority.id}: exclusive either-or proof failed`);

  const seed = index * 4;
  const en = generateStcV2FiveWayQuestion({ qlId: "STC-QL-002", locale: "en-IN", seed });
  assert.equal(en.scenarioId, authority.id);
  assert.equal(en.answerClass, "EITHER");
  assert.equal(en.correctIndex, 2);
  assert.equal(en.options.length, 5);
  assert.equal(en.presentationProfile, "FIVE_WAY_EITHER");
  assert.equal(en.surfaceArchetype, authority.surfaceArchetype);
  assert.equal(en.metadata.repeatedInstructionEmbeddedInStem, false);
  assert.equal(en.metadata.reviewOnly, true);
  assert.equal(en.metadata.questionBankWritable, false);
  assert.equal(en.metadata.testEligible, false);
  assert.equal(en.metadata.mockEligible, false);
  assert.equal(en.metadata.publicEligible, false);
  assert.equal(en.metadata.automaticPublication, false);

  for (const locale of LOCALES) {
    const localized = generateStcV2FiveWayQuestion({ qlId: "STC-QL-002", locale, seed });
    assert.equal(localized.scenarioId, en.scenarioId, `${authority.id}/${locale}: scenario drift`);
    assert.equal(localized.answerClass, "EITHER", `${authority.id}/${locale}: either class drift`);
    assert.equal(localized.correctIndex, 2, `${authority.id}/${locale}: either index drift`);
    assert.equal(localized.surfaceArchetype, en.surfaceArchetype, `${authority.id}/${locale}: surface drift`);
    assert.equal(localized.difficulty, en.difficulty, `${authority.id}/${locale}: difficulty drift`);
    assert.equal(localized.options.length, 5);
    assert.ok(localized.explanation.length > 60);
    if (locale !== "en-IN") {
      assert.notEqual(localized.stem, en.stem, `${authority.id}/${locale}: untranslated either-or stem`);
      assert.notDeepEqual(localized.conclusions, en.conclusions, `${authority.id}/${locale}: untranslated either-or conclusions`);
      assert.notDeepEqual(localized.options, en.options, `${authority.id}/${locale}: untranslated five-way options`);
    }
  }
}

assert.equal(eitherSurfaceSet.size, 8, "archived V2 either-or pool must retain eight distinct surface archetypes");

// Keep the historical five-option mapping testable for audit reproducibility,
// without exposing it through the active Question Studio package.
const expectedFiveWayIndex = { ONLY_I: 0, ONLY_II: 1, NEITHER: 3, BOTH: 4 } as const;
for (const qlId of STC_QL_IDS) {
  for (const locale of LOCALES) {
    for (const seed of [1, 2, 3, 5, 6, 7]) {
      const question = generateStcV2FiveWayQuestion({ qlId, locale, seed });
      assert.notEqual(question.answerClass, "EITHER", `${qlId}/${locale}/${seed}: ordinary historical path must not become EITHER`);
      const cls = question.answerClass as keyof typeof expectedFiveWayIndex;
      assert.equal(question.correctIndex, expectedFiveWayIndex[cls], `${qlId}/${locale}/${seed}: historical five-way index mapping drift`);
      assert.equal(question.options.length, 5);
      assert.equal(question.presentationProfile, "FIVE_WAY_EITHER");
    }
  }
}

console.log("PASS_STC_001_V2_1_ARCHIVED_EITHER_OR_SOLVER_POOL_INACTIVE");
