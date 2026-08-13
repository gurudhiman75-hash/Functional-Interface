import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  RNK_CP003_AUTHORITIES,
  RNK_CP003_PERMANENT_QL_IDS,
  authorityForCp003Ql,
} from './cp003-consolidation';
import { generateRnkCp003PermanentQuestion } from './cp003-permanent-runtime';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const outputDirectory = process.argv[2] ?? 'rnk-cp003-permanent-output';
mkdirSync(outputDirectory, { recursive: true });

const seedsPerAuthority = 192;
const questions = RNK_CP003_PERMANENT_QL_IDS.flatMap((qlId) =>
  Array.from({ length: seedsPerAuthority }, (_, seed) => generateRnkCp003PermanentQuestion(qlId, seed)),
);

assert(questions.length === 1728, 'Unexpected CP-003 permanent runtime count');
const qlCounts = new Map<string, number>();
const prototypeCoverage = new Map<string, Set<string>>();
const correctIndexes = new Set<number>();
const contexts = new Set<string>();
const difficulties = new Set<string>();

for (const question of questions) {
  const regenerated = generateRnkCp003PermanentQuestion(question.permanentQlId, question.seed);
  assert(JSON.stringify(regenerated) === JSON.stringify(question), `Non-deterministic permanent output at ${question.permanentQlId}:${question.seed}`);
  const authority = authorityForCp003Ql(question.permanentQlId);
  assert(authority.prototypes.includes(question.prototypeId), `${question.prototypeId} is not owned by ${question.permanentQlId}`);
  assert(question.options.length === 4, `Expected four options at ${question.permanentQlId}:${question.seed}`);
  const correct = question.options[question.correctIndex] as Record<string, unknown>;
  if ('answerKey' in question) {
    assert(correct.answerKey === question.answerKey, `Correct answer-key mismatch at ${question.permanentQlId}:${question.seed}`);
  } else {
    assert(correct.answer === question.answer, `Correct numeric answer mismatch at ${question.permanentQlId}:${question.seed}`);
  }
  assert(question.lifecycle.reviewStatus === 'APPROVED', `Permanent review status not approved at ${question.permanentQlId}:${question.seed}`);
  assert(question.lifecycle.questionStudioDiscoverable === false, `Question Studio activated at ${question.permanentQlId}:${question.seed}`);
  assert(question.lifecycle.questionBankStatus === 'NOT_STORED', `Question Bank activated at ${question.permanentQlId}:${question.seed}`);
  assert(question.lifecycle.testEligibility === 'INELIGIBLE', `Test eligibility activated at ${question.permanentQlId}:${question.seed}`);
  assert(question.lifecycle.publiclyPublishable === false, `Publication activated at ${question.permanentQlId}:${question.seed}`);
  qlCounts.set(question.permanentQlId, (qlCounts.get(question.permanentQlId) ?? 0) + 1);
  const covered = prototypeCoverage.get(question.permanentQlId) ?? new Set<string>();
  covered.add(question.prototypeId);
  prototypeCoverage.set(question.permanentQlId, covered);
  correctIndexes.add(question.correctIndex);
  contexts.add(String(question.contextId));
  difficulties.add(String(question.difficulty));
}

assert(correctIndexes.size === 4, 'All four correct indexes must be reachable');
assert(contexts.size >= 4, 'All four CP-003 contexts must remain reachable');
assert(difficulties.size === 3, 'Easy, Medium and Hard must remain reachable');
for (const authority of RNK_CP003_AUTHORITIES) {
  assert(qlCounts.get(authority.qlId) === seedsPerAuthority, `Unexpected count for ${authority.qlId}`);
  assert(prototypeCoverage.get(authority.qlId)?.size === authority.prototypes.length, `Variant coverage missing for ${authority.qlId}`);
}

const report = {
  checkpointId: 'RNK-CP-003',
  status: 'PERMANENT_ENGLISH_REVIEW_RUNTIME_PROVED',
  permanentRange: 'RNK-QL-018..026',
  permanentAuthorityCount: RNK_CP003_PERMANENT_QL_IDS.length,
  seedsPerAuthority,
  runtimeQuestionCount: questions.length,
  correctIndexCoverage: [...correctIndexes].sort(),
  contextCoverage: [...contexts].sort(),
  difficultyCoverage: [...difficulties].sort(),
  lifecycle: {
    reviewStatus: 'APPROVED',
    questionStudio: 'DISABLED',
    questionBank: 'NOT_STORED',
    testEligibility: 'INELIGIBLE',
    publicPublication: false,
    hindiPunjabi: 'NOT_STARTED',
  },
};

writeFileSync(join(outputDirectory, 'cp003-permanent-runtime.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(JSON.stringify(report, null, 2));
