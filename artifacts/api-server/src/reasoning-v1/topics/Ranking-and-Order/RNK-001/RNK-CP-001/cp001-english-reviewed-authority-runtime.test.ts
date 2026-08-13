import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  generateRnkCp001EnglishReviewedAuthorityQuestion,
  generateRnkCp001EnglishReviewedAuthoritySet,
} from './cp001-english-review-remediated-runtime';
import { generateRnkCp001ProvisionalAuthorityReviewQuestion } from './cp001-provisional-authority-runtime';
import {
  RNK_CP001_PROVISIONAL_AUTHORITIES,
  RNK_CP001_PROVISIONAL_AUTHORITY_IDS,
} from './cp001-provisional-consolidation';

const SEEDS_PER_AUTHORITY = 320;
const REVIEW_SEEDS = [5, 16, 47, 92, 151, 233] as const;
const INTERNAL_TAG = /\[[A-Z0-9_]+\]/;
const RAW_MULTIPLICATION = /\b\d+\s+x\s+\d+\b/;
const RAW_DIVISION = /(\d|\))\s*\/\s*(\d)/;
const NUMBER_AGREEMENT_LEAK = /\b(?:0|1) (?:people|candidates|positions)\b/i;
const AWKWARD_POSSESSIVE_RANK = /'s from the (?:top|bottom|left|right|front|back) rank/i;
const BARE_GIVES_RANK = /\bgives \d+ from the (?:top|bottom|left|right|front|back)\b/i;
const NUMERIC_REMAIN_LEAK = /\b(?:0|1) remain\b/i;

let generatedQuestions = 0;
let preservedMathematicalStates = 0;
let meritListQuestions = 0;
const authorityReports: Array<Record<string, unknown>> = [];

for (const authorityId of RNK_CP001_PROVISIONAL_AUTHORITY_IDS) {
  const keyRules = new Set<string>();
  const shortcuts = new Set<string>();
  const conclusions = new Set<string>();
  const fingerprints = new Set<string>();
  const contexts = new Set<string>();
  const variants = new Set<string>();

  for (let seed = 0; seed < SEEDS_PER_AUTHORITY; seed += 1) {
    const reviewed = generateRnkCp001EnglishReviewedAuthorityQuestion(authorityId, seed);
    const replay = generateRnkCp001EnglishReviewedAuthorityQuestion(authorityId, seed);
    const raw = generateRnkCp001ProvisionalAuthorityReviewQuestion(authorityId, seed);
    assert.deepEqual(replay, reviewed, `${authorityId} seed ${seed} must replay byte-stably`);

    const question = reviewed.question;
    const rawQuestion = raw.question;

    assert.equal(reviewed.provisionalAuthorityId, authorityId);
    assert.equal(reviewed.permanentQlId, null);
    assert.equal(reviewed.reviewStatus, 'ENGLISH_REVIEW_REQUIRED');

    assert.equal(question.answer, rawQuestion.answer);
    assert.equal(question.correctIndex, rawQuestion.correctIndex);
    assert.deepEqual(question.options, rawQuestion.options);
    assert.deepEqual(question.displayedEvidence, rawQuestion.displayedEvidence);
    assert.deepEqual(question.normalizedState, rawQuestion.normalizedState);
    assert.equal(question.mathematicalFingerprint, rawQuestion.mathematicalFingerprint);
    assert.deepEqual(question.lifecycle, rawQuestion.lifecycle);
    preservedMathematicalStates += 1;

    const learnerText = [
      question.stem,
      question.explanation.keyRule,
      ...question.explanation.stepByStepSolution,
      question.explanation.examSpeedShortcut,
      ...question.explanation.optionAnalysis,
      question.explanation.conclusion,
    ].join('\n');

    assert.ok(!INTERNAL_TAG.test(learnerText), `${authorityId} seed ${seed}: internal tag leaked`);
    assert.ok(!RAW_MULTIPLICATION.test(learnerText), `${authorityId} seed ${seed}: raw x leaked`);
    assert.ok(!RAW_DIVISION.test(learnerText), `${authorityId} seed ${seed}: raw division slash leaked`);
    assert.ok(!NUMBER_AGREEMENT_LEAK.test(learnerText), `${authorityId} seed ${seed}: numeric noun agreement leaked`);
    assert.ok(!AWKWARD_POSSESSIVE_RANK.test(learnerText), `${authorityId} seed ${seed}: awkward possessive rank leaked`);
    assert.ok(!BARE_GIVES_RANK.test(learnerText), `${authorityId} seed ${seed}: bare rank result leaked`);
    assert.ok(!NUMERIC_REMAIN_LEAK.test(learnerText), `${authorityId} seed ${seed}: numeric remain agreement leaked`);
    assert.ok(!/The correct answer is\b/.test(question.explanation.conclusion));
    assert.ok(/\d/.test(question.explanation.keyRule));
    assert.ok(/\d/.test(question.explanation.examSpeedShortcut));
    assert.ok(
      question.explanation.conclusion.includes(question.targetName) ||
        /contains\s+\d+/.test(question.explanation.conclusion),
    );

    if (question.contextId === 'MERIT_LIST') {
      meritListQuestions += 1;
      assert.ok(!/\bpeople\b/i.test(learnerText), `${authorityId} seed ${seed}: merit-list people noun leaked`);
      assert.ok(!/\bperson\b/i.test(learnerText), `${authorityId} seed ${seed}: merit-list person noun leaked`);
      assert.ok(!/\bno one\b/i.test(learnerText), `${authorityId} seed ${seed}: merit-list no-one wording leaked`);
      assert.ok(/\bcandidate|candidates\b/i.test(learnerText));
    }

    keyRules.add(question.explanation.keyRule);
    shortcuts.add(question.explanation.examSpeedShortcut);
    conclusions.add(question.explanation.conclusion);
    fingerprints.add(question.mathematicalFingerprint);
    contexts.add(question.contextId);
    variants.add(reviewed.sourcePrototypeId);
    generatedQuestions += 1;
  }

  const expectedRuleDiversity = Math.min(120, fingerprints.size);
  const expectedConclusionDiversity = Math.min(90, fingerprints.size);
  assert.ok(
    keyRules.size >= expectedRuleDiversity,
    `${authorityId} key-rule diversity too low: ${keyRules.size}; state-space target ${expectedRuleDiversity}`,
  );
  assert.ok(
    shortcuts.size >= expectedRuleDiversity,
    `${authorityId} shortcut diversity too low: ${shortcuts.size}; state-space target ${expectedRuleDiversity}`,
  );
  assert.ok(
    conclusions.size >= expectedConclusionDiversity,
    `${authorityId} conclusion diversity too low: ${conclusions.size}; state-space target ${expectedConclusionDiversity}`,
  );
  assert.deepEqual([...contexts].sort(), ['HORIZONTAL_ROW', 'MERIT_LIST', 'QUEUE']);

  authorityReports.push({
    authorityId,
    generatedQuestions: SEEDS_PER_AUTHORITY,
    uniqueFingerprints: fingerprints.size,
    expectedRuleDiversity,
    expectedConclusionDiversity,
    uniqueKeyRules: keyRules.size,
    uniqueShortcuts: shortcuts.size,
    uniqueConclusions: conclusions.size,
    contexts: [...contexts].sort(),
    sourcePrototypeIds: [...variants].sort(),
  });
}

assert.equal(generatedQuestions, 2_880);
assert.equal(preservedMathematicalStates, 2_880);
assert.ok(meritListQuestions > 0);

for (const seed of [0, 41, 319]) {
  const set = generateRnkCp001EnglishReviewedAuthoritySet(seed);
  assert.equal(set.length, 9);
  assert.deepEqual(
    set.map((question) => question.provisionalAuthorityId),
    [...RNK_CP001_PROVISIONAL_AUTHORITY_IDS],
  );
}

const reviewQuestions = RNK_CP001_PROVISIONAL_AUTHORITY_IDS.flatMap((authorityId) =>
  REVIEW_SEEDS.map((seed) => generateRnkCp001EnglishReviewedAuthorityQuestion(authorityId, seed)),
);
assert.equal(reviewQuestions.length, 54);
assert.equal(new Set(reviewQuestions.map((review) => review.question.stem)).size, 54);
assert.equal(new Set(reviewQuestions.map((review) => review.question.explanation.keyRule)).size, 54);
assert.equal(new Set(reviewQuestions.map((review) => review.question.explanation.examSpeedShortcut)).size, 54);
assert.equal(new Set(reviewQuestions.map((review) => review.question.explanation.conclusion)).size, 54);

const report = {
  packageId: 'RNK-001',
  checkpointId: 'RNK-CP-001',
  provisionalAuthorityCount: RNK_CP001_PROVISIONAL_AUTHORITY_IDS.length,
  permanentQlCount: 0,
  seedsPerAuthority: SEEDS_PER_AUTHORITY,
  generatedQuestions,
  preservedMathematicalStates,
  meritListQuestions,
  reviewQuestionCount: reviewQuestions.length,
  reviewUniqueStems: new Set(reviewQuestions.map((review) => review.question.stem)).size,
  reviewUniqueKeyRules: new Set(reviewQuestions.map((review) => review.question.explanation.keyRule)).size,
  reviewUniqueShortcuts: new Set(reviewQuestions.map((review) => review.question.explanation.examSpeedShortcut)).size,
  reviewUniqueConclusions: new Set(reviewQuestions.map((review) => review.question.explanation.conclusion)).size,
  authorityReports,
  conclusion: 'PASS_ENGLISH_HUMANIZED_AUTHORITY_RUNTIME',
};

function markdownReview(): string {
  const lines: string[] = [
    '# RNK-CP-001 — Humanized English Authority Review',
    '',
    'Status: **manual English review candidate; permanent QLs remain unallocated.**',
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
    );

    for (const seed of REVIEW_SEEDS) {
      const reviewed = generateRnkCp001EnglishReviewedAuthorityQuestion(authorityId, seed);
      const question = reviewed.question;
      lines.push(
        `### ${questionNumber}. Seed ${seed} — ${reviewed.sourcePrototypeId}`,
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
        `**Conclusion:** ${question.explanation.conclusion}`,
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
    join(outputDirectory, 'rnk-cp001-english-humanization-audit.json'),
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
