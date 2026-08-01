import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  generateRnkCp001ProvisionalAuthorityReviewQuestion,
  generateRnkCp001ProvisionalAuthorityReviewSet,
} from './cp001-provisional-authority-runtime';
import {
  authorityForRnkCp001Prototype,
  RNK_CP001_PROVISIONAL_AUTHORITIES,
  RNK_CP001_PROVISIONAL_AUTHORITY_IDS,
} from './cp001-provisional-consolidation';

const SEEDS_PER_AUTHORITY = 320;
const REVIEW_SEEDS = [5, 16, 47, 92, 151, 233] as const;

const authorityReports = RNK_CP001_PROVISIONAL_AUTHORITY_IDS.map((authorityId) => {
  const authority = RNK_CP001_PROVISIONAL_AUTHORITIES.find(
    (candidate) => candidate.authorityId === authorityId,
  );
  assert.ok(authority, `Missing authority contract ${authorityId}`);

  const variants = new Set<string>();
  const contexts = new Set<string>();
  const difficulties = new Set<string>();
  const stems = new Set<string>();
  const fingerprints = new Set<string>();
  const answerPositions = [0, 0, 0, 0];

  for (let seed = 0; seed < SEEDS_PER_AUTHORITY; seed += 1) {
    const reviewQuestion = generateRnkCp001ProvisionalAuthorityReviewQuestion(authorityId, seed);
    const replay = generateRnkCp001ProvisionalAuthorityReviewQuestion(authorityId, seed);
    assert.deepEqual(replay, reviewQuestion, `${authorityId} seed ${seed} must replay byte-stably`);

    assert.equal(reviewQuestion.packageId, 'RNK-001');
    assert.equal(reviewQuestion.checkpointId, 'RNK-CP-001');
    assert.equal(reviewQuestion.provisionalAuthorityId, authorityId);
    assert.equal(reviewQuestion.permanentQlId, null);
    assert.equal(reviewQuestion.locale, 'en-IN');
    assert.equal(reviewQuestion.reviewStatus, 'ENGLISH_REVIEW_REQUIRED');
    assert.equal(reviewQuestion.sourceVariantCount, authority.sourcePrototypeIds.length);
    assert.ok(reviewQuestion.sourceVariantIndex >= 0);
    assert.ok(reviewQuestion.sourceVariantIndex < reviewQuestion.sourceVariantCount);
    assert.equal(
      authorityForRnkCp001Prototype(reviewQuestion.sourcePrototypeId).authorityId,
      authorityId,
    );
    assert.equal(reviewQuestion.authorityContract.title, authority.title);
    assert.equal(reviewQuestion.authorityContract.answerSemantic, authority.answerSemantic);
    assert.equal(reviewQuestion.authorityContract.evidenceFamily, authority.evidenceFamily);
    assert.equal(reviewQuestion.authorityContract.governingEquation, authority.governingEquation);
    assert.equal(reviewQuestion.authorityContract.sideParameter, authority.sideParameter);
    assert.equal(reviewQuestion.authorityContract.exactMiddleRequired, authority.exactMiddleRequired);

    const question = reviewQuestion.question;
    assert.equal(question.prototypeId, reviewQuestion.sourcePrototypeId);
    assert.equal(question.permanentQlId, null);
    assert.equal(question.answerSemantic, authority.answerSemantic);
    assert.ok(question.stem.includes(question.targetName));
    assert.ok(question.stem.endsWith('?'));
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options.map((option) => option.value)).size, 4);
    assert.equal(question.options[question.correctIndex]?.value, question.answer);
    assert.equal(question.options.filter((option) => option.value === question.answer).length, 1);
    assert.equal(
      question.options.filter((option) => option.misconceptionId === 'CORRECT').length,
      1,
    );
    assert.equal(question.explanation.optionAnalysis.length, 4);
    assert.ok(question.explanation.stepByStepSolution.every((step) => /\d/.test(step)));

    const state = question.normalizedState;
    assert.equal(state.rankFromStart + state.rankFromEnd, state.total + 1);
    assert.equal(state.beforeCount, state.rankFromStart - 1);
    assert.equal(state.afterCount, state.rankFromEnd - 1);
    assert.equal(state.beforeCount + state.afterCount + 1, state.total);
    if (authority.exactMiddleRequired) {
      assert.equal(state.total % 2, 1);
      assert.equal(state.rankFromStart, state.rankFromEnd);
    }

    assert.equal(reviewQuestion.lifecycle.questionStudioDiscoverable, false);
    assert.equal(reviewQuestion.lifecycle.questionBankStatus, 'NOT_STORED');
    assert.equal(reviewQuestion.lifecycle.testEligibility, 'INELIGIBLE');
    assert.equal(reviewQuestion.lifecycle.publiclyPublishable, false);
    assert.equal(question.lifecycle.questionStudioDiscoverable, false);
    assert.equal(question.lifecycle.questionBankStatus, 'NOT_STORED');
    assert.equal(question.lifecycle.testEligibility, 'INELIGIBLE');
    assert.equal(question.lifecycle.publiclyPublishable, false);

    variants.add(reviewQuestion.sourcePrototypeId);
    contexts.add(question.contextId);
    difficulties.add(question.difficulty);
    stems.add(question.stem);
    fingerprints.add(question.mathematicalFingerprint);
    answerPositions[question.correctIndex] += 1;
  }

  assert.deepEqual([...variants].sort(), [...authority.sourcePrototypeIds].sort());
  assert.deepEqual([...contexts].sort(), ['HORIZONTAL_ROW', 'MERIT_LIST', 'QUEUE']);
  assert.ok(difficulties.has('EASY'));
  assert.ok(difficulties.has('MEDIUM'));
  assert.ok(answerPositions.every((count) => count > 0));
  assert.ok(stems.size >= 180, `${authorityId} stem diversity too low: ${stems.size}`);
  assert.ok(fingerprints.size >= 30, `${authorityId} fingerprint diversity too low: ${fingerprints.size}`);

  return {
    authorityId,
    sourcePrototypeIds: authority.sourcePrototypeIds,
    sourceVariantCount: authority.sourcePrototypeIds.length,
    generatedQuestions: SEEDS_PER_AUTHORITY,
    contexts: [...contexts].sort(),
    difficulties: [...difficulties].sort(),
    answerPositions,
    uniqueStems: stems.size,
    uniqueFingerprints: fingerprints.size,
  };
});

for (const seed of [0, 41, 319]) {
  const set = generateRnkCp001ProvisionalAuthorityReviewSet(seed);
  assert.equal(set.length, 9);
  assert.deepEqual(
    set.map((question) => question.provisionalAuthorityId),
    [...RNK_CP001_PROVISIONAL_AUTHORITY_IDS],
  );
}

const generatedQuestions = authorityReports.reduce(
  (sum, authority) => sum + authority.generatedQuestions,
  0,
);
assert.equal(generatedQuestions, 2_880);
const chapterDifficulties = new Set(authorityReports.flatMap((authority) => authority.difficulties));
assert.deepEqual([...chapterDifficulties].sort(), ['EASY', 'HARD', 'MEDIUM']);

const reviewQuestions = RNK_CP001_PROVISIONAL_AUTHORITY_IDS.flatMap((authorityId) =>
  REVIEW_SEEDS.map((seed) => generateRnkCp001ProvisionalAuthorityReviewQuestion(authorityId, seed)),
);
assert.equal(reviewQuestions.length, 54);
for (const authority of RNK_CP001_PROVISIONAL_AUTHORITIES.filter(
  (candidate) => candidate.sourcePrototypeIds.length === 2,
)) {
  const reviewVariants = new Set(
    reviewQuestions
      .filter((question) => question.provisionalAuthorityId === authority.authorityId)
      .map((question) => question.sourcePrototypeId),
  );
  assert.equal(reviewVariants.size, 2, `${authority.authorityId} review pack must show both variants`);
}

const report = {
  packageId: 'RNK-001',
  checkpointId: 'RNK-CP-001',
  provisionalAuthorityCount: RNK_CP001_PROVISIONAL_AUTHORITY_IDS.length,
  permanentQlCount: 0,
  seedsPerAuthority: SEEDS_PER_AUTHORITY,
  generatedAuthorityDispatches: generatedQuestions,
  deterministicReplayChecks: generatedQuestions,
  ownershipChecks: generatedQuestions,
  answerSemanticChecks: generatedQuestions,
  lifecycleChecks: generatedQuestions,
  reviewQuestionCount: reviewQuestions.length,
  chapterDifficulties: [...chapterDifficulties].sort(),
  authorityReports,
  conclusion: 'PASS_PROVISIONAL_AUTHORITY_REVIEW_RUNTIME',
};

function markdownReview(): string {
  const lines: string[] = [
    '# RNK-CP-001 — Provisional Authority English Review',
    '',
    'Status: **English review required; permanent QLs remain unallocated.**',
    '',
  ];

  let questionNumber = 1;
  for (const authorityId of RNK_CP001_PROVISIONAL_AUTHORITY_IDS) {
    const authority = RNK_CP001_PROVISIONAL_AUTHORITIES.find(
      (candidate) => candidate.authorityId === authorityId,
    );
    assert.ok(authority);
    lines.push(
      `## ${authorityId}`,
      '',
      `**Authority:** ${authority.title}`,
      '',
      `**Equation:** \`${authority.governingEquation}\``,
      '',
      `**Source prototypes:** ${authority.sourcePrototypeIds.map((id) => `\`${id}\``).join(', ')}`,
      '',
    );

    for (const seed of REVIEW_SEEDS) {
      const reviewQuestion = generateRnkCp001ProvisionalAuthorityReviewQuestion(authorityId, seed);
      const question = reviewQuestion.question;
      lines.push(
        `### ${questionNumber}. Seed ${seed} — ${reviewQuestion.sourcePrototypeId}`,
        '',
        question.stem,
        '',
        ...question.options.map((option, index) => `${index + 1}. ${option.label}`),
        '',
        `**Answer:** Option ${question.correctIndex + 1} — ${question.answer}`,
        '',
        `**Rule:** ${question.explanation.keyRule}`,
        '',
        '**Worked steps:**',
        ...question.explanation.stepByStepSolution.map((step, index) => `${index + 1}. ${step}`),
        '',
        `**Exam-speed shortcut:** ${question.explanation.examSpeedShortcut}`,
        '',
        '**Option diagnostics:**',
        ...question.explanation.optionAnalysis.map((line) => `- ${line}`),
        '',
      );
      questionNumber += 1;
    }
  }
  return `${lines.join('\n')}\n`;
}

const outputDirectory = process.argv[2];
if (outputDirectory) {
  mkdirSync(outputDirectory, { recursive: true });
  writeFileSync(
    join(outputDirectory, 'rnk-cp001-authority-runtime-audit.json'),
    `${JSON.stringify(report, null, 2)}\n`,
  );
  writeFileSync(
    join(outputDirectory, 'rnk-cp001-authority-review.json'),
    `${JSON.stringify(reviewQuestions, null, 2)}\n`,
  );
  writeFileSync(
    join(outputDirectory, 'rnk-cp001-authority-review.md'),
    markdownReview(),
  );
}

console.log(JSON.stringify(report, null, 2));
