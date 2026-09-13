import assert from "node:assert/strict";
import { hasDirectEdge } from "./causal-solver.ts";
import { CAE_001_CAUSAL_WORLDS } from "./causal-world-authorities.ts";
import { generateCaeQuestion } from "./chapter-generator.ts";
import { CAE_001_EDITORIAL_REALNESS_REVIEW } from "./editorial-review-pack.ts";
import { previewCae001QuestionStudioReview } from "./question-studio-review.ts";
import { CAE_001_SOURCE_PROFILE_REVIEW, renderCae001SourceProfileReview } from "./source-profile-review-pack.ts";
import {
  CAE_SOURCE_PROFILE_AUTHORITIES,
  CaeSourceProfileIncompatibleError,
  generateCaeSourceProfileQuestion,
  type CaeSourceProfileId,
} from "./source-profiles.ts";
import { CAE_PROVISIONAL_QL_IDS, type CaeLocale } from "./types.ts";

const LOCALES: readonly CaeLocale[] = ["en-IN", "hi-IN", "pa-IN"];

for (const qlId of CAE_PROVISIONAL_QL_IDS) {
  const samples = CAE_001_EDITORIAL_REALNESS_REVIEW[qlId];
  assert.equal(samples.length, 10, `${qlId}: ordinary editorial review must keep ten samples`);
  assert.equal(new Set(samples.map((entry) => entry.question.causalStateId)).size, 10, `${qlId}: ordinary editorial review must use ten distinct causal states`);
}

const bankAuthority = CAE_SOURCE_PROFILE_AUTHORITIES.CLASSIC_BANK_FIVE_RELATION;
assert.deepEqual(bankAuthority.relationshipIds, [
  "FIRST_DIRECT_CAUSES_SECOND",
  "SECOND_DIRECT_CAUSES_FIRST",
  "INDEPENDENT_CAUSES",
  "INDEPENDENT_EFFECTS",
  "COMMON_CAUSE",
]);
const punjabAuthority = CAE_SOURCE_PROFILE_AUTHORITIES.PUNJAB_POLICE_SI_2016_FOUR_RELATION;
assert.deepEqual(punjabAuthority.relationshipIds, [
  "FIRST_DIRECT_CAUSES_SECOND",
  "SECOND_DIRECT_CAUSES_FIRST",
  "INDEPENDENT_EFFECTS",
  "COMMON_CAUSE",
]);

for (const profileId of Object.keys(CAE_001_SOURCE_PROFILE_REVIEW) as CaeSourceProfileId[]) {
  const samples = CAE_001_SOURCE_PROFILE_REVIEW[profileId];
  assert.equal(samples.length, 10, `${profileId}: source review requires ten samples`);
  assert.equal(new Set(samples.map((entry) => entry.question.causalStateId)).size, 10, `${profileId}: source review must use ten distinct causal states`);
  for (const { question } of samples) {
    assert.equal(question.sourceProfileId, profileId);
    assert.equal(question.options.filter((_, index) => index === question.correctIndex).length, 1);
    assert.equal(new Set(question.options).size, question.options.length, `${profileId}: options must be unique`);
    if (profileId === "CLASSIC_BANK_FIVE_RELATION") {
      assert.equal(question.options.length, 5);
      assert.deepEqual(new Set(question.optionMetadata.map((option) => option.id)), new Set(bankAuthority.relationshipIds));
    } else if (profileId === "PUNJAB_POLICE_SI_2016_FOUR_RELATION") {
      assert.equal(question.options.length, 4);
      assert.deepEqual(new Set(question.optionMetadata.map((option) => option.id)), new Set(punjabAuthority.relationshipIds));
      assert.notEqual(question.answerId, "INDEPENDENT_CAUSES");
    } else {
      assert.equal(question.options.length, 4);
      assert.equal(question.optionMetadata.filter((option) => option.isCorrect).length, 1);
      assert.ok(question.answerId.startsWith("VALID_DIRECT:"));
      const world = CAE_001_CAUSAL_WORLDS.find((entry) => entry.id === question.causalWorldId)!;
      const [causeId, effectId] = question.causalTrace;
      assert.ok(causeId && effectId && hasDirectEdge(world, causeId, effectId), `${question.causalStateId}: SSC recognition answer must be a direct canonical edge`);
    }
  }
}

// Presentation/source profile may alter options, never the selected causal state.
for (const profileId of ["CLASSIC_BANK_FIVE_RELATION", "PUNJAB_POLICE_SI_2016_FOUR_RELATION", "SSC_SELECTION_POST_DIRECT_RECOGNITION"] as const) {
  const authority = CAE_SOURCE_PROFILE_AUTHORITIES[profileId];
  let checked = 0;
  for (const qlId of authority.allowedQlIds) {
    for (let seed = 0; seed < 300 && checked < 30; seed += 1) {
      try {
        const profiled = generateCaeSourceProfileQuestion({ qlId, locale: "en-IN", seed, sourceProfileId: profileId });
        const base = generateCaeQuestion({ qlId, locale: "en-IN", seed, questionProfile: authority.baseQuestionProfile });
        assert.equal(profiled.causalStateId, base.causalStateId, `${profileId}/${qlId}/${seed}: presentation profile changed causal state`);
        checked += 1;
      } catch (error) {
        if (!(error instanceof CaeSourceProfileIncompatibleError)) throw error;
      }
    }
  }
  assert.ok(checked >= 20, `${profileId}: insufficient compatible states for profile parity QA`);
}

// Locale rendering must keep semantic state, answer ID and presentation order fixed.
for (const profileId of ["CLASSIC_BANK_FIVE_RELATION", "PUNJAB_POLICE_SI_2016_FOUR_RELATION", "SSC_SELECTION_POST_DIRECT_RECOGNITION"] as const) {
  const first = CAE_001_SOURCE_PROFILE_REVIEW[profileId][0]!;
  const en = generateCaeSourceProfileQuestion({ qlId: first.question.qlId, locale: "en-IN", seed: first.seed, sourceProfileId: profileId });
  for (const locale of LOCALES) {
    const localized = generateCaeSourceProfileQuestion({ qlId: first.question.qlId, locale, seed: first.seed, sourceProfileId: profileId });
    assert.equal(localized.causalStateId, en.causalStateId, `${profileId}/${locale}: causal state drift`);
    assert.equal(localized.answerId, en.answerId, `${profileId}/${locale}: answer drift`);
    assert.equal(localized.correctIndex, en.correctIndex, `${profileId}/${locale}: option-order drift`);
    assert.deepEqual(localized.optionMetadata.map((option) => option.id), en.optionMetadata.map((option) => option.id), `${profileId}/${locale}: semantic option drift`);
  }
}

assert.ok(renderCae001SourceProfileReview().includes("CLASSIC_BANK_FIVE_RELATION"));
assert.ok(renderCae001SourceProfileReview().includes("PUNJAB_POLICE_SI_2016_FOUR_RELATION"));
assert.ok(renderCae001SourceProfileReview().includes("SSC_SELECTION_POST_DIRECT_RECOGNITION"));

const studio = previewCae001QuestionStudioReview({
  qlId: "CAE-QL-001",
  locale: "en-IN",
  seed: 0,
  sourceProfileId: "SSC_SELECTION_POST_DIRECT_RECOGNITION",
});
assert.equal(studio.reviewOnly, true);
assert.equal(studio.question.metadata.reviewOnly, true);
assert.equal(studio.question.metadata.questionBankWritable, false);
assert.equal(studio.question.metadata.testEligible, false);
assert.equal(studio.question.metadata.mockEligible, false);
assert.equal(studio.question.metadata.publicEligible, false);
