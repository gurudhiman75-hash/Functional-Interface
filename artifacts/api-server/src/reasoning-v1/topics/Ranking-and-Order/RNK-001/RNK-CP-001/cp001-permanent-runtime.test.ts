import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  authorityForRnkCp001Ql,
  generateRnkCp001PermanentQuestion,
  RNK_CP001_PERMANENT_QL_IDS,
  RNK_CP001_QL_TO_AUTHORITY,
} from './cp001-permanent-runtime';
import { generateRnkCp001EnglishReviewedAuthorityQuestion } from './cp001-english-review-remediated-runtime';

const SEEDS_PER_QL = 128;
const REVIEW_SEEDS = [5, 16, 47, 92, 151, 233] as const;
let generatedQuestions = 0;
const qlReports: Array<Record<string, unknown>> = [];

for (const qlId of RNK_CP001_PERMANENT_QL_IDS) {
  const authorityId = authorityForRnkCp001Ql(qlId);
  const contexts = new Set<string>();
  const variants = new Set<string>();
  const difficulties = new Set<string>();
  const answerPositions = [0, 0, 0, 0];
  const fingerprints = new Set<string>();

  for (let seed = 0; seed < SEEDS_PER_QL; seed += 1) {
    const permanent = generateRnkCp001PermanentQuestion(qlId, seed);
    const replay = generateRnkCp001PermanentQuestion(qlId, seed);
    const reviewed = generateRnkCp001EnglishReviewedAuthorityQuestion(authorityId, seed);
    const source = reviewed.question;

    assert.deepEqual(replay, permanent, `${qlId} seed ${seed} must replay byte-stably`);
    assert.equal(permanent.packageId, 'RNK-001');
    assert.equal(permanent.checkpointId, 'RNK-CP-001');
    assert.equal(permanent.qlId, qlId);
    assert.equal(permanent.permanentQlId, qlId);
    assert.equal(permanent.authorityId, authorityId);
    assert.equal(permanent.locale, 'en-IN');
    assert.equal(Object.hasOwn(permanent, 'prototypeId'), false);

    assert.equal(permanent.stem, source.stem);
    assert.deepEqual(permanent.displayedEvidence, source.displayedEvidence);
    assert.equal(permanent.answerSemantic, source.answerSemantic);
    assert.equal(permanent.answer, source.answer);
    assert.deepEqual(permanent.options, source.options);
    assert.equal(permanent.correctIndex, source.correctIndex);
    assert.equal(permanent.difficulty, source.difficulty);
    assert.deepEqual(permanent.normalizedState, source.normalizedState);
    assert.deepEqual(permanent.explanation, source.explanation);
    assert.equal(permanent.mathematicalFingerprint, source.mathematicalFingerprint);

    assert.equal(permanent.reviewMetadata.sourcePrototypeId, reviewed.sourcePrototypeId);
    assert.equal(permanent.reviewMetadata.discoverySeed, seed);
    assert.equal(
      permanent.reviewMetadata.englishReviewProjectionVersion,
      'RNK_CP001_ENGLISH_REVIEW_V1',
    );

    assert.equal(permanent.lifecycle.reviewStatus, 'ENGLISH_DISCOVERY_FROZEN');
    assert.equal(permanent.lifecycle.englishReviewOnly, true);
    assert.equal(permanent.lifecycle.questionStudioDiscoverable, false);
    assert.equal(permanent.lifecycle.questionBankStatus, 'NOT_STORED');
    assert.equal(permanent.lifecycle.testEligibility, 'INELIGIBLE');
    assert.equal(permanent.lifecycle.publiclyPublishable, false);

    assert.equal(permanent.options.length, 4);
    assert.equal(new Set(permanent.options.map((option) => option.value)).size, 4);
    assert.equal(permanent.options[permanent.correctIndex]?.value, permanent.answer);

    const learnerText = [
      permanent.stem,
      permanent.explanation.keyRule,
      ...permanent.explanation.stepByStepSolution,
      permanent.explanation.examSpeedShortcut,
      ...permanent.explanation.optionAnalysis,
      permanent.explanation.conclusion,
    ].join('\n');
    assert.ok(!/\[[A-Z0-9_]+\]/.test(learnerText));
    assert.ok(!/\b(?:0|1) (?:people|candidates|positions)\b/i.test(learnerText));
    assert.ok(!/\bone (?:candidate|person) are\b/i.test(learnerText));

    contexts.add(source.contextId);
    variants.add(reviewed.sourcePrototypeId);
    difficulties.add(source.difficulty);
    answerPositions[permanent.correctIndex] += 1;
    fingerprints.add(permanent.mathematicalFingerprint);
    generatedQuestions += 1;
  }

  assert.deepEqual([...contexts].sort(), ['HORIZONTAL_ROW', 'MERIT_LIST', 'QUEUE']);
  assert.ok(answerPositions.every((count) => count > 0));
  assert.ok(fingerprints.size >= 20);

  qlReports.push({
    qlId,
    authorityId,
    generatedQuestions: SEEDS_PER_QL,
    contexts: [...contexts].sort(),
    difficulties: [...difficulties].sort(),
    answerPositions,
    sourcePrototypeIds: [...variants].sort(),
    uniqueFingerprints: fingerprints.size,
  });
}

assert.equal(generatedQuestions, 1_152);
assert.deepEqual(Object.keys(RNK_CP001_QL_TO_AUTHORITY), [...RNK_CP001_PERMANENT_QL_IDS]);
assert.equal(new Set(Object.values(RNK_CP001_QL_TO_AUTHORITY)).size, 9);

const reviewQuestions = RNK_CP001_PERMANENT_QL_IDS.flatMap((qlId) =>
  REVIEW_SEEDS.map((seed) => generateRnkCp001PermanentQuestion(qlId, seed)),
);
assert.equal(reviewQuestions.length, 54);
assert.equal(new Set(reviewQuestions.map((question) => question.stem)).size, 54);

const report = {
  packageId: 'RNK-001',
  checkpointId: 'RNK-CP-001',
  freezeVersion: 'RNK_CP001_ENGLISH_DISCOVERY_FREEZE_V1',
  permanentQlCount: RNK_CP001_PERMANENT_QL_IDS.length,
  permanentQlRange: 'RNK-QL-001..009',
  seedsPerQl: SEEDS_PER_QL,
  generatedQuestions,
  reviewQuestionCount: reviewQuestions.length,
  questionStudioDiscoverable: false,
  questionBankStatus: 'NOT_STORED',
  testEligibility: 'INELIGIBLE',
  publiclyPublishable: false,
  qlReports,
  conclusion: 'PASS_PERMANENT_ENGLISH_REVIEW_RUNTIME',
};

const outputDirectory = process.argv[2];
if (outputDirectory) {
  mkdirSync(outputDirectory, { recursive: true });
  writeFileSync(
    join(outputDirectory, 'rnk-cp001-permanent-runtime-audit.json'),
    `${JSON.stringify(report, null, 2)}\n`,
  );
  writeFileSync(
    join(outputDirectory, 'rnk-cp001-permanent-review.json'),
    `${JSON.stringify(reviewQuestions, null, 2)}\n`,
  );
}

console.log(JSON.stringify(report, null, 2));
