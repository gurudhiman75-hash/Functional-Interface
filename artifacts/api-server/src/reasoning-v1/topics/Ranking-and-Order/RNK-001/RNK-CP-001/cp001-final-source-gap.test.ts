import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { generateRnkCp001ProvisionalAuthorityReviewQuestion } from './cp001-provisional-authority-runtime';
import {
  RNK_CP001_PROVISIONAL_AUTHORITIES,
  RNK_CP001_PROVISIONAL_AUTHORITY_IDS,
} from './cp001-provisional-consolidation';
import {
  RNK_CP001_FINAL_SOURCE_DIMENSIONS,
  RNK_CP001_INVERSE_CLOSURE,
  RNK_CP001_SOURCE_PATTERN_DISPOSITIONS,
} from './cp001-final-source-gap';

const SEEDS_PER_AUTHORITY = 160;

assert.equal(RNK_CP001_PROVISIONAL_AUTHORITY_IDS.length, 9);
assert.equal(RNK_CP001_FINAL_SOURCE_DIMENSIONS.length, 8);
assert.equal(new Set(RNK_CP001_FINAL_SOURCE_DIMENSIONS.map((item) => item.dimensionId)).size, 8);

const authorityCoverage = new Set(
  RNK_CP001_FINAL_SOURCE_DIMENSIONS.flatMap((dimension) => dimension.authorityIds),
);
assert.deepEqual(
  [...authorityCoverage].sort(),
  [...RNK_CP001_PROVISIONAL_AUTHORITY_IDS].sort(),
  'Every provisional authority must close at least one final source dimension',
);

for (const dimension of RNK_CP001_FINAL_SOURCE_DIMENSIONS) {
  assert.ok(dimension.authorityIds.length > 0, `${dimension.dimensionId} has no authority owner`);
  for (const authorityId of dimension.authorityIds) {
    assert.ok(
      RNK_CP001_PROVISIONAL_AUTHORITY_IDS.includes(authorityId),
      `${dimension.dimensionId} references unknown authority ${authorityId}`,
    );
  }
}

assert.equal(new Set(RNK_CP001_SOURCE_PATTERN_DISPOSITIONS.map((item) => item.patternId)).size, 12);
assert.equal(
  RNK_CP001_SOURCE_PATTERN_DISPOSITIONS.filter((item) => item.disposition === 'CP001_COVERED').length,
  4,
);
assert.equal(
  RNK_CP001_SOURCE_PATTERN_DISPOSITIONS.filter((item) => item.disposition === 'DEFERRED').length,
  6,
);
assert.equal(
  RNK_CP001_SOURCE_PATTERN_DISPOSITIONS.filter((item) => item.disposition === 'REASSIGNED').length,
  2,
);
assert.equal(
  RNK_CP001_SOURCE_PATTERN_DISPOSITIONS.filter((item) =>
    (item.disposition as string).includes('OPEN'),
  ).length,
  0,
);
for (const item of RNK_CP001_SOURCE_PATTERN_DISPOSITIONS) {
  if (item.disposition === 'CP001_COVERED') assert.equal(item.owner, 'RNK-CP-001');
  else assert.notEqual(item.owner, 'RNK-CP-001');
}

assert.equal(RNK_CP001_INVERSE_CLOSURE.length, 3);
const inverseAuthorities = new Set<string>();
for (const pair of RNK_CP001_INVERSE_CLOSURE) {
  assert.notEqual(pair.forwardAuthorityId, pair.inverseAuthorityId);
  assert.ok(RNK_CP001_PROVISIONAL_AUTHORITY_IDS.includes(pair.forwardAuthorityId));
  assert.ok(RNK_CP001_PROVISIONAL_AUTHORITY_IDS.includes(pair.inverseAuthorityId));
  inverseAuthorities.add(pair.forwardAuthorityId);
  inverseAuthorities.add(pair.inverseAuthorityId);
}
assert.equal(inverseAuthorities.size, 6);

const contexts = new Set<string>();
const difficulties = new Set<string>();
const answerSemantics = new Set<string>();
const answerPositions = [0, 0, 0, 0];
const sourceVariantsByAuthority = new Map<string, Set<string>>();
let generatedQuestions = 0;
let firstRankCases = 0;
let lastRankCases = 0;
let zeroBeforeCases = 0;
let zeroAfterCases = 0;
let oneBeforeCases = 0;
let oneAfterCases = 0;
let exactMiddleCases = 0;

for (const authority of RNK_CP001_PROVISIONAL_AUTHORITIES) {
  const variants = new Set<string>();
  sourceVariantsByAuthority.set(authority.authorityId, variants);

  for (let seed = 0; seed < SEEDS_PER_AUTHORITY; seed += 1) {
    const reviewQuestion = generateRnkCp001ProvisionalAuthorityReviewQuestion(
      authority.authorityId,
      seed,
    );
    const question = reviewQuestion.question;
    const state = question.normalizedState;

    assert.equal(reviewQuestion.provisionalAuthorityId, authority.authorityId);
    assert.equal(reviewQuestion.permanentQlId, null);
    assert.equal(reviewQuestion.reviewStatus, 'ENGLISH_REVIEW_REQUIRED');
    assert.equal(question.answerSemantic, authority.answerSemantic);
    assert.equal(question.permanentQlId, null);
    assert.equal(question.options[question.correctIndex]?.value, question.answer);
    assert.equal(new Set(question.options.map((option) => option.value)).size, 4);
    assert.equal(question.options.filter((option) => option.value === question.answer).length, 1);

    assert.equal(state.rankFromStart + state.rankFromEnd, state.total + 1);
    assert.equal(state.beforeCount, state.rankFromStart - 1);
    assert.equal(state.afterCount, state.rankFromEnd - 1);
    assert.equal(state.beforeCount + state.afterCount + 1, state.total);

    assert.equal(reviewQuestion.lifecycle.questionStudioDiscoverable, false);
    assert.equal(reviewQuestion.lifecycle.questionBankStatus, 'NOT_STORED');
    assert.equal(reviewQuestion.lifecycle.testEligibility, 'INELIGIBLE');
    assert.equal(reviewQuestion.lifecycle.publiclyPublishable, false);
    assert.equal(question.lifecycle.questionStudioDiscoverable, false);
    assert.equal(question.lifecycle.questionBankStatus, 'NOT_STORED');
    assert.equal(question.lifecycle.testEligibility, 'INELIGIBLE');
    assert.equal(question.lifecycle.publiclyPublishable, false);

    if (state.rankFromStart === 1) firstRankCases += 1;
    if (state.rankFromStart === state.total) lastRankCases += 1;
    if (state.beforeCount === 0) zeroBeforeCases += 1;
    if (state.afterCount === 0) zeroAfterCases += 1;
    if (state.beforeCount === 1) oneBeforeCases += 1;
    if (state.afterCount === 1) oneAfterCases += 1;
    if (state.rankFromStart === state.rankFromEnd) exactMiddleCases += 1;

    variants.add(reviewQuestion.sourcePrototypeId);
    contexts.add(question.contextId);
    difficulties.add(question.difficulty);
    answerSemantics.add(question.answerSemantic);
    answerPositions[question.correctIndex] += 1;
    generatedQuestions += 1;
  }

  assert.deepEqual([...variants].sort(), [...authority.sourcePrototypeIds].sort());
}

assert.equal(generatedQuestions, 1_440);
assert.deepEqual([...contexts].sort(), ['HORIZONTAL_ROW', 'MERIT_LIST', 'QUEUE']);
assert.deepEqual([...difficulties].sort(), ['EASY', 'HARD', 'MEDIUM']);
assert.deepEqual([...answerSemantics].sort(), ['COUNT', 'RANK', 'TOTAL']);
assert.ok(answerPositions.every((count) => count > 0));
assert.ok(firstRankCases > 0);
assert.ok(lastRankCases > 0);
assert.ok(zeroBeforeCases > 0);
assert.ok(zeroAfterCases > 0);
assert.ok(oneBeforeCases > 0);
assert.ok(oneAfterCases > 0);
assert.ok(exactMiddleCases > 0);

const report = {
  packageId: 'RNK-001',
  checkpointId: 'RNK-CP-001',
  finalSourceDimensionCount: RNK_CP001_FINAL_SOURCE_DIMENSIONS.length,
  provisionalAuthorityCount: RNK_CP001_PROVISIONAL_AUTHORITY_IDS.length,
  sourcePatternDispositionCount: RNK_CP001_SOURCE_PATTERN_DISPOSITIONS.length,
  openCp001SourcePatternCount: 0,
  inversePairCount: RNK_CP001_INVERSE_CLOSURE.length,
  permanentQlCount: 0,
  generatedRuntimeChecks: generatedQuestions,
  lifecycleChecks: generatedQuestions,
  contexts: [...contexts].sort(),
  difficulties: [...difficulties].sort(),
  answerSemantics: [...answerSemantics].sort(),
  answerPositions,
  edgeCoverage: {
    firstRankCases,
    lastRankCases,
    zeroBeforeCases,
    zeroAfterCases,
    oneBeforeCases,
    oneAfterCases,
    exactMiddleCases,
  },
  dimensions: RNK_CP001_FINAL_SOURCE_DIMENSIONS,
  sourcePatternDispositions: RNK_CP001_SOURCE_PATTERN_DISPOSITIONS,
  inverseClosure: RNK_CP001_INVERSE_CLOSURE,
  sourceVariantsByAuthority: Object.fromEntries(
    [...sourceVariantsByAuthority].map(([authorityId, variants]) => [authorityId, [...variants].sort()]),
  ),
  verdict: 'ELIGIBLE_FOR_ENGLISH_MANUAL_REVIEW',
  conclusion: 'PASS_FINAL_SOURCE_AND_GAP_AUDIT',
};

function markdownReport(): string {
  const lines = [
    '# RNK-CP-001 — Final Source-Gap Evidence',
    '',
    `Verdict: **${report.verdict}**`,
    '',
    `Permanent QLs: **${report.permanentQlCount}**`,
    '',
    '## Closed dimensions',
    '',
    ...RNK_CP001_FINAL_SOURCE_DIMENSIONS.map(
      (dimension) =>
        `- \`${dimension.dimensionId}\` — ${dimension.authorityIds.map((id) => `\`${id}\``).join(', ')}`,
    ),
    '',
    '## Source dispositions',
    '',
    ...RNK_CP001_SOURCE_PATTERN_DISPOSITIONS.map(
      (item) => `- \`${item.patternId}\` → **${item.owner}** (${item.disposition})`,
    ),
    '',
    '## Edge proof',
    '',
    `- first-rank cases: ${firstRankCases}`,
    `- last-rank cases: ${lastRankCases}`,
    `- zero-before cases: ${zeroBeforeCases}`,
    `- zero-after cases: ${zeroAfterCases}`,
    `- one-before cases: ${oneBeforeCases}`,
    `- one-after cases: ${oneAfterCases}`,
    `- exact-middle cases: ${exactMiddleCases}`,
    '',
    'No CP-001 source dimension remains open. English human review is still required before discovery freeze or permanent identity.',
    '',
  ];
  return lines.join('\n');
}

const outputDirectory = process.argv[2];
if (outputDirectory) {
  mkdirSync(outputDirectory, { recursive: true });
  writeFileSync(
    join(outputDirectory, 'rnk-cp001-final-source-gap-audit.json'),
    `${JSON.stringify(report, null, 2)}\n`,
  );
  writeFileSync(
    join(outputDirectory, 'rnk-cp001-final-source-gap-audit.md'),
    `${markdownReport()}\n`,
  );
}

console.log(JSON.stringify(report, null, 2));
