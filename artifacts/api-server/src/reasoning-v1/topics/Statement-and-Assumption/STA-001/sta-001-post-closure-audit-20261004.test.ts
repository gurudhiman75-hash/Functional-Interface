import assert from "node:assert/strict";
import { createHash } from "node:crypto";

import {
  STA_V4_LANGUAGES,
  STA_V4_PRESENTATION_PROFILES,
  STA_V4_PROFILE_IDS,
  STA_V4_QL_IDS,
  STA_V4_SCENARIOS,
  generateStaV4Question,
  type StaV4Language,
  type StaV4Locale,
} from "./exam-realness-v4-1-learner-runtime.ts";
import {
  assertStaV41RenderedQuestionIndependentProof,
  assertStaV41ScenarioIndependentProof,
  STA_001_V41_INDEPENDENT_PROOF_AUTHORITY,
} from "./exam-realness-v4-1-independent-proof.ts";
import {
  STA_001_POST_CLOSURE_PROOF_AUTHORITY,
  STA_001_QUESTION_STUDIO_REVIEW_PACKAGE,
  previewSta001QuestionStudioReview,
} from "./question-studio-review.ts";
import {
  STA_001_QUESTION_STUDIO_REVIEW_PACKAGE as HISTORICAL_V41_REVIEW_CANDIDATE_PACKAGE,
} from "./question-studio-review-v4-1.ts";

const LOCALE_BY_LANGUAGE: Readonly<Record<StaV4Language, StaV4Locale>> = Object.freeze({
  en: "en-IN",
  hi: "hi-IN",
  pa: "pa-IN",
});

assert.equal(STA_V4_SCENARIOS.length, 108);
assert.equal(new Set(STA_V4_SCENARIOS.map((scenario) => scenario.scenarioId)).size, 108);
assert.equal(STA_001_POST_CLOSURE_PROOF_AUTHORITY, STA_001_V41_INDEPENDENT_PROOF_AUTHORITY);

// Preserve historical review-candidate evidence without letting it define the live contract.
assert.equal(HISTORICAL_V41_REVIEW_CANDIDATE_PACKAGE.permanentQlCount, 4);
assert.equal(HISTORICAL_V41_REVIEW_CANDIDATE_PACKAGE.multilingualChapterFrozen, false);
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.permanentQlCount, 6);
assert.deepEqual(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.permanentQlIds, STA_V4_QL_IDS);
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.multilingualChapterFrozen, true);
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.questionBankWritable, false);
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.testEligible, false);
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.mockTestEligible, false);
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.publiclyPublishable, false);
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.automaticStudentPublication, false);

let candidateAuthorityCount = 0;
let implicitCount = 0;
let notImplicitCount = 0;
const digestRows: unknown[] = [];

for (const scenario of STA_V4_SCENARIOS) {
  assertStaV41ScenarioIndependentProof(scenario);
  candidateAuthorityCount += scenario.candidates.length;
  implicitCount += scenario.candidates.filter((candidate) => candidate.classification === "IMPLICIT").length;
  notImplicitCount += scenario.candidates.filter((candidate) => candidate.classification === "NOT_IMPLICIT").length;
  digestRows.push({
    scenarioId: scenario.scenarioId,
    qlId: scenario.qlId,
    checkpointId: scenario.checkpointId,
    sourceProfile: scenario.sourceProfile,
    difficulty: scenario.difficulty,
    discourseAct: scenario.discourseAct,
    domain: scenario.domain,
    statementVariants: scenario.statementVariants,
    candidates: scenario.candidates.map((candidate) => ({
      candidateId: candidate.candidateId,
      textVariants: candidate.textVariants,
      misconception: candidate.misconception,
      rationale: candidate.rationale,
      classification: candidate.classification,
    })),
    sourceAuthorityId: scenario.sourceAuthorityId,
  });
}

assert.equal(candidateAuthorityCount, 756);
assert.equal(implicitCount, 324);
assert.equal(notImplicitCount, 432);

// Fail closed when authored classification metadata drifts independently of
// the frozen candidate ordinal + misconception contract.
{
  const scenario = STA_V4_SCENARIOS[0]!;
  const first = scenario.candidates[0]!;
  const driftedFirst = {
    ...first,
    classification: first.classification === "IMPLICIT" ? "NOT_IMPLICIT" as const : "IMPLICIT" as const,
  };
  const driftedScenario = {
    ...scenario,
    candidates: [driftedFirst, ...scenario.candidates.slice(1)],
  } as unknown as typeof scenario;
  assert.throws(
    () => assertStaV41ScenarioIndependentProof(driftedScenario),
    /authored classification .* disagrees with independent .* proof/i,
  );
}

const authorityDigest = createHash("sha256")
  .update(JSON.stringify(digestRows))
  .digest("hex");

let directGeneratedSurfaces = 0;
let liveQuestionStudioSurfaces = 0;

for (const qlId of STA_V4_QL_IDS) {
  for (const profileId of STA_V4_PROFILE_IDS) {
    for (let sample = 0; sample < 32; sample += 1) {
      const seed = `sta-post-closure:${qlId}:${profileId}:${sample}`;
      for (const language of STA_V4_LANGUAGES) {
        const question = generateStaV4Question({
          seed,
          locale: LOCALE_BY_LANGUAGE[language],
          profileId,
          qlId,
        });
        assertStaV41RenderedQuestionIndependentProof({
          questionId: question.questionId,
          queryPolarity: question.queryPolarity,
          candidates: question.candidates,
          answerSet: question.answerSet,
          options: question.options,
          answerIndex: question.answerIndex,
        });
        directGeneratedSurfaces += 1;
      }
    }

    for (const language of STA_V4_LANGUAGES) {
      const preview = previewSta001QuestionStudioReview({
        language,
        qlId,
        profileId,
        count: 4,
        seed: `sta-post-closure-live:${qlId}:${profileId}:${language}`,
      });
      assert.equal(preview.independentProofVerified, true);
      assert.equal(preview.independentProofAuthority, STA_001_V41_INDEPENDENT_PROOF_AUTHORITY);
      for (const question of preview.questions) {
        assert.equal(question.permanentQlId, qlId);
        assert.equal(question.validation.multilingualFrozen, true);
        assert.equal(question.lifecycleStatus, "REVIEW_ONLY");
        assert.ok(question.queryPolarity === "POSITIVE" || question.queryPolarity === "NEGATIVE");
        assertStaV41RenderedQuestionIndependentProof({
          questionId: question.questionId,
          queryPolarity: question.queryPolarity,
          candidates: question.candidates.map((candidate) => ({
            candidateId: candidate.candidateId,
            classification: candidate.oracle.classification,
            misconception: candidate.misconception,
          })),
          answerSet: question.answerSet,
          options: question.options,
          correctIndex: question.correctIndex,
        });
        liveQuestionStudioSurfaces += 1;
      }
    }
  }
}

assert.equal(
  directGeneratedSurfaces,
  STA_V4_QL_IDS.length * STA_V4_PROFILE_IDS.length * 32 * STA_V4_LANGUAGES.length,
);
assert.equal(
  liveQuestionStudioSurfaces,
  STA_V4_QL_IDS.length * STA_V4_PROFILE_IDS.length * STA_V4_LANGUAGES.length * 4,
);
assert.equal(STA_V4_PRESENTATION_PROFILES.length, 9);

console.log(JSON.stringify({
  status: "PASS_STA_001_POST_CLOSURE_AUDIT_20261004",
  qlCount: STA_V4_QL_IDS.length,
  scenarioAuthorityCount: STA_V4_SCENARIOS.length,
  candidateAuthorityCount,
  classifications: { implicit: implicitCount, notImplicit: notImplicitCount },
  profileCount: STA_V4_PROFILE_IDS.length,
  languages: STA_V4_LANGUAGES,
  directGeneratedSurfaces,
  liveQuestionStudioSurfaces,
  totalPostClosureGeneratedSurfaces: directGeneratedSurfaces + liveQuestionStudioSurfaces,
  independentProofAuthority: STA_001_V41_INDEPENDENT_PROOF_AUTHORITY,
  authorityDigest,
  historicalReviewCandidateIsolated: true,
  currentPermanentQlCount: STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.permanentQlCount,
  multilingualChapterFrozen: STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.multilingualChapterFrozen,
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
}, null, 2));
