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
let domainDifficultyQuestionCount = 0;
let semanticCoverageQuestionCount = 0;
let solveModeQuestionCount = 0;
const languageCounts: Record<(typeof languages)[number], number> = { en: 0, hi: 0, pa: 0 };
const profileCounts = new Map<string, number>();
const domainCounts = new Map<string, number>();
const solveModeCounts = new Map<string, number>();
const semanticCounts = new Map<string, number>();
const difficultyCounts = new Map<string, number>();
const profileSemanticCoverage = new Set<string>();

function bump(map: Map<string, number>, key: string) {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function generate(
  language: (typeof languages)[number],
  input: Omit<Parameters<typeof generateDsfExamProfileBatch>[0], "language">,
) {
  return language === "en"
    ? generateDsfExamProfileBatch({ ...input, language: "en" })
    : generateDsfApprovedLocalizedExamProfileBatch({
        ...input,
        language: language as DsfLocalizedLanguage,
      });
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

// Source-valid production breadth: every language × profile × domain × difficulty.
// We deliberately do not force a semantic class inside this matrix because the frozen
// source runtime does not promise every semantic class in every domain/difficulty cell.
// Three deterministic samples per cell provide 540 questions of production breadth.
for (const language of languages) {
  for (const profile of DSF_CP003_ANSWER_PROFILES) {
    for (const domain of DSF_CP002_DOMAINS) {
      for (const difficulty of DSF_CP002_DIFFICULTIES) {
        const seed = `dsf-cp010-freeze:breadth:${language}:${profile.id}:${domain.id}:${difficulty}`;
        const result = generate(language, {
          seed,
          count: 3,
          answerProfile: profile.id,
          domain: domain.id,
          difficulty,
        });
        assert.equal(result.questionCount, 3);
        for (const question of result.questions) {
          auditQuestion(language, profile, question);
          assert.equal(question.domain, domain.id);
          assert.equal(question.difficulty, difficulty);
          domainDifficultyQuestionCount += 1;
        }
      }
    }
  }
}

// Semantic completeness: every language × every semantic class representable by each
// approved profile, without inventing an unsupported domain/difficulty constraint.
for (const language of languages) {
  for (const profile of DSF_CP003_ANSWER_PROFILES) {
    for (const semanticClass of profile.representedSemanticClasses) {
      const seed = `dsf-cp010-freeze:semantic:${language}:${profile.id}:${semanticClass}`;
      const result = generate(language, {
        seed,
        count: 1,
        answerProfile: profile.id,
        semanticClass,
      });
      const question = result.questions[0]!;
      auditQuestion(language, profile, question);
      assert.equal(question.canonicalAnswer, semanticClass);
      profileSemanticCoverage.add(`${language}:${profile.id}:${semanticClass}`);
      semanticCoverageQuestionCount += 1;
    }
  }
}

// Solve-mode completeness: every production language × every frozen solve mode.
// Difficulty is already exhaustive in the breadth matrix, so it is intentionally not
// cross-forced here; this keeps the audit aligned to source-valid contracts.
const genericProfile = DSF_CP003_ANSWER_PROFILES.find((profile) => profile.id === "GENERIC_DS_STANDARD_5_EN")!;
for (const language of languages) {
  for (const domain of DSF_CP002_DOMAINS) {
    for (const solveMode of domain.solveModes) {
      const seed = `dsf-cp010-freeze:mode:${language}:${solveMode}`;
      const result = generate(language, {
        seed,
        count: 1,
        answerProfile: genericProfile.id,
        domain: domain.id,
        solveMode,
      });
      const question = result.questions[0]!;
      auditQuestion(language, genericProfile, question);
      assert.equal(question.solveModeId, solveMode);
      solveModeQuestionCount += 1;
    }
  }
}

assert.equal(domainDifficultyQuestionCount, 540);
assert.equal(semanticCoverageQuestionCount, 69);
assert.equal(solveModeQuestionCount, 24);
assert.equal(seenQuestionIds.size, 633);
assert.equal(seenGenerationIdentities.size, 633);
assert.deepEqual(languageCounts, { en: 211, hi: 211, pa: 211 });
assert.equal(profileCounts.size, 5);
assert.equal(domainCounts.size, 4);
assert.equal(solveModeCounts.size, 8);
assert.equal(semanticCounts.size, 5);
assert.equal(difficultyCounts.size, 3);
assert.equal(profileSemanticCoverage.size, 69);
for (const language of languages) {
  for (const profile of DSF_CP003_ANSWER_PROFILES) {
    assert.ok((profileCounts.get(profile.id) ?? 0) > 0);
    for (const semanticClass of profile.representedSemanticClasses) {
      assert.ok(profileSemanticCoverage.has(`${language}:${profile.id}:${semanticClass}`));
    }
  }
}
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
  auditedQuestionCount: domainDifficultyQuestionCount + semanticCoverageQuestionCount + solveModeQuestionCount,
  domainDifficultyBreadthQuestionCount: domainDifficultyQuestionCount,
  explicitProfileSemanticQuestionCount: semanticCoverageQuestionCount,
  explicitSolveModeQuestionCount: solveModeQuestionCount,
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
