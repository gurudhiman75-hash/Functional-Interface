import assert from "node:assert/strict";

import { SUFFICIENCY_CLASSES } from "../foundation/index.ts";
import { DSF_CP002_DOMAINS } from "../DSF-CP-002/question-studio-integration-v1.ts";
import {
  DSF_CP003_ANSWER_PROFILES,
  generateDsfExamProfileBatch,
  type DsfExamAnswerProfileId,
} from "../DSF-CP-003/exam-answer-profiles-v1.ts";
import { DSF_CP007_PRODUCTION_READINESS_FREEZE } from "../DSF-CP-007/production-readiness-freeze-v1.ts";
import {
  DSF_CP008_CHECKPOINT_ID,
  DSF_CP008_HUMAN_REVIEW_BLOCKER,
  DSF_CP008_LOCALIZATION_AUTHORITY,
  DSF_CP008_LOCALIZATION_REVIEW_PACKAGE,
  DSF_CP008_LOCALIZED_LANGUAGES,
  generateDsfLocalizedExamProfileBatch,
  type DsfLocalizedLanguage,
} from "./localization-review-v1.ts";

function scriptRegex(language: DsfLocalizedLanguage): RegExp {
  return language === "hi" ? /[\u0900-\u097F]/ : /[\u0A00-\u0A7F]/;
}

function assertLocalizedSurface(language: DsfLocalizedLanguage, text: string, label: string): void {
  assert.match(text, scriptRegex(language), `${label} must contain the target script`);
  assert.doesNotMatch(
    text,
    /\b(Statement|sufficient|determine|greater|possible|together|original value|final value)\b/i,
    `${label} leaked English learner prose`,
  );
}

function sourceInput(input: {
  seed: string;
  count: number;
  answerProfile?: DsfExamAnswerProfileId;
  domain?: (typeof DSF_CP002_DOMAINS)[number]["id"];
  solveMode?: (typeof DSF_CP002_DOMAINS)[number]["solveModes"][number];
  semanticClass?: (typeof SUFFICIENCY_CLASSES)[number];
}) {
  return { ...input, language: "en" as const };
}

let checked = 0;
const seenLocalizedIds = new Set<string>();

for (const language of DSF_CP008_LOCALIZED_LANGUAGES) {
  for (const domain of DSF_CP002_DOMAINS) {
    const localized = generateDsfLocalizedExamProfileBatch({
      language,
      seed: `cp008-domain-sweep:${language}:${domain.id}`,
      count: 12,
      domain: domain.id,
      answerProfile: "GENERIC_DS_STANDARD_5_EN",
    });
    const english = generateDsfExamProfileBatch(sourceInput({
      seed: `cp008-domain-sweep:${language}:${domain.id}`,
      count: 12,
      domain: domain.id,
      answerProfile: "GENERIC_DS_STANDARD_5_EN",
    }));

    assert.equal(localized.questionCount, english.questionCount);
    localized.questions.forEach((question, index) => {
      const source = english.questions[index]!;
      assert.equal(question.canonicalEnglishProfileQuestionId, source.questionId);
      assert.equal(question.sourceQuestionId, source.sourceQuestionId);
      assert.equal(question.canonicalAnswer, source.canonicalAnswer);
      assert.equal(question.correctIndex, source.correctIndex);
      assert.deepEqual(
        question.options.map((option) => [option.key, option.semanticClass, option.isCorrect]),
        source.options.map((option) => [option.key, option.semanticClass, option.isCorrect]),
      );
      assert.equal(question.localization.semanticParity, "EXECUTABLE_PROVED");
      assert.equal(question.localization.humanLanguageReviewRequired, true);
      assert.deepEqual(question.localization.activeEditorialBlockers, [DSF_CP008_HUMAN_REVIEW_BLOCKER]);
      assert.equal(question.lifecycle.questionBankWritable, false);
      assert.equal(question.lifecycle.testEligible, false);
      assert.equal(question.lifecycle.mockTestEligible, false);
      assert.equal(question.lifecycle.publiclyPublishable, false);
      assert.equal(question.lifecycle.automaticStudentPublication, false);
      assert.equal(question.validation.semanticParityPreserved, true);
      assert.equal(question.validation.optionSemanticOrderPreserved, true);
      assert.equal(question.validation.correctIndexPreserved, true);
      assert.equal(question.validation.canonicalAnswerPreserved, true);
      assertLocalizedSurface(language, question.stem, `${question.questionId}/stem`);
      assertLocalizedSurface(language, question.questionPrompt, `${question.questionId}/prompt`);
      assertLocalizedSurface(language, question.explanation.askedTarget, `${question.questionId}/askedTarget`);
      assertLocalizedSurface(language, question.explanation.statementI, `${question.questionId}/statementI explanation`);
      assertLocalizedSurface(language, question.explanation.statementII, `${question.questionId}/statementII explanation`);
      if (question.explanation.together) {
        assertLocalizedSurface(language, question.explanation.together, `${question.questionId}/together explanation`);
      }
      assertLocalizedSurface(language, question.explanation.conclusion, `${question.questionId}/conclusion`);
      question.options.forEach((option) => assertLocalizedSurface(language, option.value, `${question.questionId}/option ${option.key}`));
      assert.ok(!seenLocalizedIds.has(question.questionId), `duplicate localized question id ${question.questionId}`);
      seenLocalizedIds.add(question.questionId);
      checked += 1;
    });
  }

  for (const domain of DSF_CP002_DOMAINS) {
    for (const solveMode of domain.solveModes) {
      const result = generateDsfLocalizedExamProfileBatch({
        language,
        seed: `cp008-mode:${language}:${solveMode}`,
        count: 1,
        solveMode,
        answerProfile: "GENERIC_DS_STANDARD_5_EN",
      });
      assert.equal(result.questions[0]!.solveModeId, solveMode);
    }
  }

  for (const semanticClass of SUFFICIENCY_CLASSES) {
    const result = generateDsfLocalizedExamProfileBatch({
      language,
      seed: `cp008-class:${language}:${semanticClass}`,
      count: 1,
      semanticClass,
      answerProfile: "GENERIC_DS_STANDARD_5_EN",
    });
    assert.equal(result.questions[0]!.canonicalAnswer, semanticClass);
  }

  for (const profile of DSF_CP003_ANSWER_PROFILES) {
    for (const semanticClass of profile.representedSemanticClasses) {
      const localized = generateDsfLocalizedExamProfileBatch({
        language,
        seed: `cp008-profile:${language}:${profile.id}:${semanticClass}`,
        count: 1,
        semanticClass,
        answerProfile: profile.id,
      });
      const question = localized.questions[0]!;
      assert.equal(question.answerProfile, profile.id);
      assert.deepEqual(question.options.map((option) => option.semanticClass), profile.semanticOrder);
      assert.equal(question.canonicalAnswer, semanticClass);
      assert.equal(question.options[question.correctIndex]!.semanticClass, semanticClass);
    }
  }
}

for (const language of DSF_CP008_LOCALIZED_LANGUAGES) {
  for (const profile of DSF_CP003_ANSWER_PROFILES.filter((entry) => entry.optionCount === 4)) {
    assert.throws(
      () => generateDsfLocalizedExamProfileBatch({
        language,
        seed: `cp008-ssc-reject:${language}:${profile.id}`,
        count: 1,
        semanticClass: "EACH_STATEMENT_ALONE",
        answerProfile: profile.id,
      }),
      /cannot render EACH_STATEMENT_ALONE/,
    );
  }
}

const hindi = generateDsfLocalizedExamProfileBatch({
  language: "hi",
  seed: "cp008-locale-identity",
  count: 1,
  answerProfile: "BANKING_STANDARD_5_EN",
}).questions[0]!;
const punjabi = generateDsfLocalizedExamProfileBatch({
  language: "pa",
  seed: "cp008-locale-identity",
  count: 1,
  answerProfile: "BANKING_STANDARD_5_EN",
}).questions[0]!;
assert.equal(hindi.canonicalEnglishProfileQuestionId, punjabi.canonicalEnglishProfileQuestionId);
assert.notEqual(hindi.questionId, punjabi.questionId);
assert.notEqual(hindi.stem, punjabi.stem);

assert.equal(DSF_CP008_LOCALIZATION_REVIEW_PACKAGE.localizationCheckpointId, DSF_CP008_CHECKPOINT_ID);
assert.equal(DSF_CP008_LOCALIZATION_REVIEW_PACKAGE.localizationAuthority, DSF_CP008_LOCALIZATION_AUTHORITY);
assert.deepEqual(DSF_CP008_LOCALIZATION_REVIEW_PACKAGE.supportedLanguages, ["en", "hi", "pa"]);
assert.deepEqual(DSF_CP008_LOCALIZATION_REVIEW_PACKAGE.productionLanguages, ["en"]);
assert.deepEqual(DSF_CP008_LOCALIZATION_REVIEW_PACKAGE.localizationReviewLanguages, ["hi", "pa"]);
assert.equal(DSF_CP008_LOCALIZATION_REVIEW_PACKAGE.perLanguageLifecycle.en.questionBankWritable, true);
assert.equal(DSF_CP008_LOCALIZATION_REVIEW_PACKAGE.perLanguageLifecycle.hi.questionBankWritable, false);
assert.equal(DSF_CP008_LOCALIZATION_REVIEW_PACKAGE.perLanguageLifecycle.pa.questionBankWritable, false);
assert.equal(DSF_CP008_LOCALIZATION_REVIEW_PACKAGE.nextAvailableQlId, "DSF-QL-002");
assert.equal(DSF_CP007_PRODUCTION_READINESS_FREEZE.boundaries.hindiEnabled, false);
assert.equal(DSF_CP007_PRODUCTION_READINESS_FREEZE.boundaries.punjabiEnabled, false);
assert.equal(DSF_CP007_PRODUCTION_READINESS_FREEZE.status, "PRODUCTION_READY_FROZEN");

console.log(JSON.stringify({
  status: "PASS_DSF_CP_008_HI_PA_LOCALIZATION_REVIEW",
  authority: DSF_CP008_LOCALIZATION_AUTHORITY,
  checkedLocalizedQuestions: checked,
  languages: DSF_CP008_LOCALIZED_LANGUAGES,
  domains: DSF_CP002_DOMAINS.map((entry) => entry.id),
  solveModeCount: DSF_CP002_DOMAINS.flatMap((entry) => entry.solveModes).length,
  answerProfileCount: DSF_CP003_ANSWER_PROFILES.length,
  permanentQlIds: DSF_CP008_LOCALIZATION_REVIEW_PACKAGE.permanentQlIds,
  nextAvailableQlId: DSF_CP008_LOCALIZATION_REVIEW_PACKAGE.nextAvailableQlId,
  englishProductionFreezePreserved: true,
  localizedDownstreamLockedPendingHumanReview: true,
}, null, 2));
