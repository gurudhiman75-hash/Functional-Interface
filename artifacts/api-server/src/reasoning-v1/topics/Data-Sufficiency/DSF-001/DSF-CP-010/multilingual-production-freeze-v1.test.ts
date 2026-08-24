import assert from "node:assert/strict";

import {
  DSF_CP002_DIFFICULTIES,
  DSF_CP002_DOMAINS,
} from "../DSF-CP-002/question-studio-integration-v1.ts";
import {
  DSF_CP003_ANSWER_PROFILES,
  generateDsfExamProfileBatch,
} from "../DSF-CP-003/exam-answer-profiles-v1.ts";
import {
  DSF_CP008_LOCALIZATION_REVIEW_PACKAGE,
  type DsfLocalizedLanguage,
} from "../DSF-CP-008/localization-review-v1.ts";
import {
  DSF_CP009_LOCALIZATION_APPROVAL,
  generateDsfApprovedLocalizedExamProfileBatch,
} from "../DSF-CP-009/localization-approval-release-v1.ts";
import {
  DSF_CP010_CHAPTER_STATUS,
  DSF_CP010_FREEZE_FINGERPRINT,
  DSF_CP010_MULTILINGUAL_PRODUCTION_FREEZE,
  DSF_CP010_MULTILINGUAL_PRODUCTION_PACKAGE,
  DSF_CP010_STATUS,
  assertDsfCp010FreezeInvariant,
} from "./multilingual-production-freeze-v1.ts";

assertDsfCp010FreezeInvariant();

const languages = ["en", "hi", "pa"] as const;
const seenQuestionIds = new Set<string>();
const seenGenerationIdentities = new Set<string>();
let matrixQuestionCount = 0;
let solveModeQuestionCount = 0;
const languageCounts: Record<(typeof languages)[number], number> = { en: 0, hi: 0, pa: 0 };
const profileCounts = new Map<string, number>();
const domainCounts = new Map<string, number>();
const solveModeCounts = new Map<string, number>();
const semanticCounts = new Map<string, number>();
const difficultyCounts = new Map<string, number>();

function bump(map: Map<string, number>, key: string) {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function auditQuestion(
  language: (typeof languages)[number],
  profile: (typeof DSF_CP003_ANSWER_PROFILES)[number],
  question: ReturnType<typeof generateDsfExamProfileBatch>["questions"][number] |
    ReturnType<typeof generateDsfApprovedLocalizedExamProfileBatch>["questions"][number],
) {
  assert.equal(question.qlId, "DSF-QL-001");
  assert.equal(question.answerProfile, profile.id);
  assert.ok(profile.representedSemanticClasses.includes(question.canonicalAnswer));
  assert.deepEqual(
    question.options.map((option) => option.semanticClass),
    [...profile.semanticOrder],
    `${language}/${profile.id}/${question.questionId}: option semantic order changed`,
  );
  assert.equal(question.options.length, profile.optionCount);
  assert.equal(question.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(question.options[question.correctIndex]?.semanticClass, question.canonicalAnswer);
  assert.equal(question.validation.semanticTruthPreserved, true);
  assert.equal(question.validation.optionOrderMatchesProfile, true);
  assert.ok(!seenQuestionIds.has(question.questionId), `Duplicate final question ID ${question.questionId}`);
  seenQuestionIds.add(question.questionId);
  assert.ok(
    !seenGenerationIdentities.has(question.sourceGenerationIdentity),
    `Duplicate generation identity ${question.sourceGenerationIdentity}`,
  );
  seenGenerationIdentities.add(question.sourceGenerationIdentity);

  if (language === "en") {
    assert.equal(question.language, "en");
    assert.equal(question.locale, "en-IN");
  } else {
    const localized = question as ReturnType<typeof generateDsfApprovedLocalizedExamProfileBatch>["questions"][number];
    assert.equal(localized.language, language);
    assert.equal(localized.locale, language === "hi" ? "hi-IN" : "pa-IN");
    assert.equal(localized.localization.status, "PRODUCT_OWNER_APPROVED");
    assert.equal(localized.localization.semanticParity, "EXECUTABLE_PROVED");
    assert.equal(localized.localization.humanLanguageReviewRequired, false);
    assert.deepEqual(localized.localization.activeEditorialBlockers, []);
    assert.equal(localized.lifecycle.reviewOnly, false);
    assert.equal(localized.lifecycle.questionBankWritable, true);
    assert.equal(localized.lifecycle.questionBankAcceptanceMode, "FULL_RELEASE");
    assert.equal(localized.lifecycle.testEligible, true);
    assert.equal(localized.lifecycle.mockTestEligible, true);
    assert.equal(localized.lifecycle.publiclyPublishable, true);
    assert.equal(localized.lifecycle.automaticStudentPublication, false);
  }

  languageCounts[language] += 1;
  bump(profileCounts, profile.id);
  bump(domainCounts, question.domain);
  bump(solveModeCounts, question.solveModeId);
  bump(semanticCounts, question.canonicalAnswer);
  bump(difficultyCounts, question.difficulty);
}

// Core freeze matrix: every language × every approved answer profile × every domain ×
// every semantic class representable by that profile. Generate two deterministic
// questions per cell so the frozen audit is not a one-sample smoke test.
for (const [languageIndex, language] of languages.entries()) {
  for (const [profileIndex, profile] of DSF_CP003_ANSWER_PROFILES.entries()) {
    for (const [domainIndex, domain] of DSF_CP002_DOMAINS.entries()) {
      for (const [semanticIndex, semanticClass] of profile.representedSemanticClasses.entries()) {
        const difficulty = DSF_CP002_DIFFICULTIES[
          (languageIndex + profileIndex + domainIndex + semanticIndex) % DSF_CP002_DIFFICULTIES.length
        ]!;
        const seed = `dsf-cp010-freeze:matrix:${language}:${profile.id}:${domain.id}:${semanticClass}:${difficulty}`;
        const result = language === "en"
          ? generateDsfExamProfileBatch({
              seed,
              count: 2,
              answerProfile: profile.id,
              domain: domain.id,
              semanticClass,
              difficulty,
            })
          : generateDsfApprovedLocalizedExamProfileBatch({
              seed,
              count: 2,
              language: language as DsfLocalizedLanguage,
              answerProfile: profile.id,
              domain: domain.id,
              semanticClass,
              difficulty,
            });
        assert.equal(result.questionCount, 2);
        for (const question of result.questions) {
          auditQuestion(language, profile, question);
          assert.equal(question.domain, domain.id);
          assert.equal(question.canonicalAnswer, semanticClass);
          assert.equal(question.difficulty, difficulty);
          matrixQuestionCount += 1;
        }
      }
    }
  }
}

// Explicit solve-mode × difficulty coverage in every production language. This closes
// the gap that a domain-level matrix alone could leave if one mode dominated sampling.
const genericProfile = DSF_CP003_ANSWER_PROFILES.find((profile) => profile.id === "GENERIC_DS_STANDARD_5_EN")!;
for (const language of languages) {
  for (const domain of DSF_CP002_DOMAINS) {
    for (const solveMode of domain.solveModes) {
      for (const difficulty of DSF_CP002_DIFFICULTIES) {
        const seed = `dsf-cp010-freeze:mode:${language}:${solveMode}:${difficulty}`;
        const result = language === "en"
          ? generateDsfExamProfileBatch({
              seed,
              count: 1,
              answerProfile: genericProfile.id,
              domain: domain.id,
              solveMode,
              difficulty,
            })
          : generateDsfApprovedLocalizedExamProfileBatch({
              seed,
              count: 1,
              language: language as DsfLocalizedLanguage,
              answerProfile: genericProfile.id,
              domain: domain.id,
              solveMode,
              difficulty,
            });
        const question = result.questions[0]!;
        auditQuestion(language, genericProfile, question);
        assert.equal(question.solveModeId, solveMode);
        assert.equal(question.difficulty, difficulty);
        solveModeQuestionCount += 1;
      }
    }
  }
}

assert.equal(matrixQuestionCount, 552);
assert.equal(solveModeQuestionCount, 72);
assert.equal(seenQuestionIds.size, 624);
assert.equal(seenGenerationIdentities.size, 624);
assert.deepEqual(languageCounts, { en: 208, hi: 208, pa: 208 });
assert.equal(profileCounts.size, 5);
assert.equal(domainCounts.size, 4);
assert.equal(solveModeCounts.size, 8);
assert.equal(semanticCounts.size, 5);
assert.equal(difficultyCounts.size, 3);
for (const profile of DSF_CP003_ANSWER_PROFILES) assert.ok((profileCounts.get(profile.id) ?? 0) > 0);
for (const domain of DSF_CP002_DOMAINS) assert.ok((domainCounts.get(domain.id) ?? 0) > 0);
for (const domain of DSF_CP002_DOMAINS) {
  for (const solveMode of domain.solveModes) assert.ok((solveModeCounts.get(solveMode) ?? 0) > 0);
}
for (const difficulty of DSF_CP002_DIFFICULTIES) assert.ok((difficultyCounts.get(difficulty) ?? 0) > 0);

// Determinism proof on both localized production paths.
for (const language of ["hi", "pa"] as const) {
  const input = {
    seed: `dsf-cp010-determinism:${language}`,
    count: 4,
    language,
    answerProfile: "BANKING_STANDARD_5_EN" as const,
    domain: "ALGEBRA" as const,
    difficulty: "Hard" as const,
  };
  const first = generateDsfApprovedLocalizedExamProfileBatch(input);
  const second = generateDsfApprovedLocalizedExamProfileBatch(input);
  assert.deepEqual(
    first.questions.map((question) => ({
      questionId: question.questionId,
      sourceQuestionId: question.sourceQuestionId,
      sourceGenerationIdentity: question.sourceGenerationIdentity,
      canonicalAnswer: question.canonicalAnswer,
      correctIndex: question.correctIndex,
    })),
    second.questions.map((question) => ({
      questionId: question.questionId,
      sourceQuestionId: question.sourceQuestionId,
      sourceGenerationIdentity: question.sourceGenerationIdentity,
      canonicalAnswer: question.canonicalAnswer,
      correctIndex: question.correctIndex,
    })),
  );
}

assert.equal(DSF_CP010_MULTILINGUAL_PRODUCTION_FREEZE.status, DSF_CP010_STATUS);
assert.equal(DSF_CP010_MULTILINGUAL_PRODUCTION_FREEZE.chapterStatus, DSF_CP010_CHAPTER_STATUS);
assert.equal(DSF_CP010_MULTILINGUAL_PRODUCTION_PACKAGE.productionReadinessFreezeStatus, DSF_CP010_STATUS);
assert.deepEqual(DSF_CP010_MULTILINGUAL_PRODUCTION_PACKAGE.productionLanguages, ["en", "hi", "pa"]);
assert.deepEqual(DSF_CP010_MULTILINGUAL_PRODUCTION_PACKAGE.localizationReviewLanguages, []);
assert.equal(DSF_CP010_MULTILINGUAL_PRODUCTION_PACKAGE.chapterClosedForCurrentApprovedScope, true);
assert.equal(DSF_CP010_MULTILINGUAL_PRODUCTION_PACKAGE.automaticStudentPublication, false);
assert.match(DSF_CP010_FREEZE_FINGERPRINT, /^[0-9a-f]{64}$/);

// Historical checkpoints are not rewritten by this closure overlay.
assert.equal(DSF_CP008_LOCALIZATION_REVIEW_PACKAGE.humanLanguageReviewRequired, true);
assert.equal(DSF_CP008_LOCALIZATION_REVIEW_PACKAGE.localizedQuestionBankWritable, false);
assert.deepEqual(DSF_CP008_LOCALIZATION_REVIEW_PACKAGE.productionLanguages, ["en"]);
assert.equal(DSF_CP009_LOCALIZATION_APPROVAL.status, "PRODUCT_OWNER_APPROVED");

console.log(JSON.stringify({
  status: "PASS_DSF_CP010_MULTILINGUAL_PRODUCTION_FREEZE",
  chapterStatus: DSF_CP010_CHAPTER_STATUS,
  freezeFingerprint: DSF_CP010_FREEZE_FINGERPRINT,
  auditedQuestionCount: matrixQuestionCount + solveModeQuestionCount,
  coreMatrixQuestionCount: matrixQuestionCount,
  explicitSolveModeDifficultyQuestionCount: solveModeQuestionCount,
  languageCounts,
  answerProfileCount: profileCounts.size,
  domainCount: domainCounts.size,
  solveModeCount: solveModeCounts.size,
  canonicalSemanticClassCount: semanticCounts.size,
  difficultyCount: difficultyCounts.size,
  permanentQlIds: DSF_CP010_MULTILINGUAL_PRODUCTION_FREEZE.permanentQlIds,
  nextAvailableQlId: DSF_CP010_MULTILINGUAL_PRODUCTION_FREEZE.nextAvailableQlId,
  punjabSpecificAnswerProfileEnabled: false,
  automaticStudentPublication: false,
}, null, 2));
