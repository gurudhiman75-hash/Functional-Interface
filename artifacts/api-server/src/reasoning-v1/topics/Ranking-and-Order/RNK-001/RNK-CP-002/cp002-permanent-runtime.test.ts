import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  authorityForRnkCp002Ql,
  generateRnkCp002PermanentQuestion,
  RNK_CP002_PERMANENT_QL_IDS,
  RNK_CP002_QL_TO_AUTHORITY,
} from './cp002-permanent-runtime';
import { listRnkCp002AuthorityVariants } from './cp002-authority-runtime';

const SEEDS_PER_QL = 192;
const audits: unknown[] = [];
const reviewQuestions: unknown[] = [];
let deterministicChecks = 0;
let identityChecks = 0;
let optionChecks = 0;
let lifecycleChecks = 0;
let hygieneChecks = 0;

assert.deepEqual([...RNK_CP002_PERMANENT_QL_IDS], [
  'RNK-QL-010', 'RNK-QL-011', 'RNK-QL-012', 'RNK-QL-013',
  'RNK-QL-014', 'RNK-QL-015', 'RNK-QL-016', 'RNK-QL-017',
]);
assert.equal(Object.keys(RNK_CP002_QL_TO_AUTHORITY).length, 8);
assert.equal(new Set(Object.values(RNK_CP002_QL_TO_AUTHORITY)).size, 8);

for (const qlId of RNK_CP002_PERMANENT_QL_IDS) {
  const authorityId = authorityForRnkCp002Ql(qlId);
  const variants = new Set<string>();
  const contexts = new Set<string>();
  const difficulties = new Set<string>();
  const answerSemantics = new Set<string>();
  const correctPositions = [0, 0, 0, 0];
  const answers = new Set<string>();

  for (let seed = 0; seed < SEEDS_PER_QL; seed += 1) {
    const question = generateRnkCp002PermanentQuestion(qlId, seed);
    assert.deepEqual(generateRnkCp002PermanentQuestion(qlId, seed), question);
    deterministicChecks += 1;

    assert.equal(question.packageId, 'RNK-001');
    assert.equal(question.checkpointId, 'RNK-CP-002');
    assert.equal(question.qlId, qlId);
    assert.equal(question.permanentQlId, qlId);
    assert.equal(question.authorityId, authorityId);
    assert.ok(!('prototypeId' in question));
    assert.ok(!('sourcePrototypeId' in question));
    assert.equal(question.reviewMetadata.discoverySeed, seed);
    assert.equal(question.reviewMetadata.englishReviewProjectionVersion, 'RNK_CP002_ENGLISH_REVIEW_V1');
    assert.ok(question.reviewMetadata.sourceVariantIndex >= 0);
    assert.ok(question.reviewMetadata.sourceVariantIndex < question.reviewMetadata.sourceVariantCount);
    assert.equal(
      question.reviewMetadata.sourceVariantCount,
      listRnkCp002AuthorityVariants(authorityId).length,
    );
    identityChecks += 1;

    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options.map((item) => String(item.value))).size, 4);
    assert.equal(String(question.options[question.correctIndex].value), String(question.answer));
    assert.equal(question.options.filter((item) => String(item.value) === String(question.answer)).length, 1);
    assert.deepEqual(
      question.reviewMetadata.canonicalOptionValues,
      question.reviewMetadata.canonicalOptionValues,
    );
    optionChecks += 1;

    assert.equal(question.lifecycle.reviewStatus, 'ENGLISH_DISCOVERY_FROZEN');
    assert.equal(question.lifecycle.englishReviewOnly, true);
    assert.equal(question.lifecycle.questionStudioDiscoverable, false);
    assert.equal(question.lifecycle.questionBankStatus, 'NOT_STORED');
    assert.equal(question.lifecycle.testEligibility, 'INELIGIBLE');
    assert.equal(question.lifecycle.publiclyPublishable, false);
    lifecycleChecks += 1;

    const learnerText = [
      question.stem,
      String(question.answer),
      ...question.options.flatMap((item) => [String(item.label), item.explanation]),
      question.explanation.keyRule,
      ...question.explanation.stepByStepSolution,
      question.explanation.examSpeedShortcut,
      ...question.explanation.optionAnalysis,
      question.explanation.conclusion,
    ].join(' ');
    assert.ok(!/\b(?:RNK-CP|RNK-QL|PROT-|AUTH-)\b/.test(learnerText));
    assert.ok(!/\bthe the\b/i.test(learnerText));
    assert.ok(!/\b(?:start|end) end\b/i.test(learnerText));
    assert.ok(!/\b(?:top|bottom|front|back) end\b/i.test(learnerText));
    assert.ok(!/\b(?:the )?(?:first|second) person\b/i.test(learnerText));
    assert.ok(!/undefined|null|NaN/.test(learnerText));
    hygieneChecks += 1;

    variants.add(question.reviewMetadata.sourcePrototypeId);
    contexts.add(question.contextId);
    difficulties.add(question.difficulty);
    answerSemantics.add(question.answerSemantic);
    correctPositions[question.correctIndex] += 1;
    answers.add(String(question.answer));

    if (seed < 4) reviewQuestions.push(question);
  }

  assert.deepEqual([...variants].sort(), [...listRnkCp002AuthorityVariants(authorityId)].sort());
  assert.deepEqual([...contexts].sort(), ['HORIZONTAL_ROW', 'MERIT_LIST', 'QUEUE']);
  assert.ok(correctPositions.every((count) => count > 0));

  if (qlId === 'RNK-QL-016') {
    assert.ok(answers.has('Cannot be determined'));
    assert.ok([...answers].some((answer) => /^\d+$/.test(answer)));
  }
  if (qlId === 'RNK-QL-017') {
    assert.ok(answers.has('The proposed total is impossible'));
    assert.ok([...answers].some((answer) => !answer.startsWith('The proposed total')));
  }

  audits.push({
    qlId,
    authorityId,
    generated: SEEDS_PER_QL,
    variants: [...variants].sort(),
    contexts: [...contexts].sort(),
    difficulties: [...difficulties].sort(),
    answerSemantics: [...answerSemantics].sort(),
    correctPositions,
    distinctAnswers: answers.size,
  });
}

const totalQuestions = RNK_CP002_PERMANENT_QL_IDS.length * SEEDS_PER_QL;
assert.equal(totalQuestions, 1536);
const summary = {
  packageId: 'RNK-001',
  checkpointId: 'RNK-CP-002',
  permanentQlCount: RNK_CP002_PERMANENT_QL_IDS.length,
  permanentRange: 'RNK-QL-010..017',
  nextAvailableQlId: 'RNK-QL-018',
  seedsPerQl: SEEDS_PER_QL,
  totalQuestions,
  deterministicChecks,
  identityChecks,
  optionChecks,
  lifecycleChecks,
  hygieneChecks,
  audits,
  conclusion: 'PASS_CP002_PERMANENT_ENGLISH_REVIEW_RUNTIME',
};

const outputDirectory = process.argv[2];
if (outputDirectory) {
  mkdirSync(outputDirectory, { recursive: true });
  writeFileSync(join(outputDirectory, 'cp002-permanent-runtime-audit.json'), `${JSON.stringify(summary, null, 2)}\n`);
  writeFileSync(join(outputDirectory, 'cp002-permanent-review.json'), `${JSON.stringify(reviewQuestions, null, 2)}\n`);
}
console.log(JSON.stringify(summary, null, 2));
