import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { RNK_CP003_PERMANENT_QL_IDS } from './cp003-consolidation';
import { buildRnkCp003ReviewPack } from './cp003-review-pack';
import { RNK_CP003_SOURCE_PROTOTYPE_IDS } from './cp003-source-wave';
import { generateRnkCp003ReviewedSourceQuestion } from './cp003-source-wave-reviewed';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const REVIEW_SEEDS = [0, 1, 2, 7, 31, 97] as const;
const EXPECTED_PROJECTION_HASH = '6457a50fdde7673f9e66fe607a47a5c38a4c921489ed387b72c87ef8a22947d5';
const outputDirectory = process.argv[2] ?? 'rnk-cp003-final-freeze-output';
mkdirSync(outputDirectory, { recursive: true });

const initial = buildRnkCp003ReviewPack();
const supplementary = RNK_CP003_SOURCE_PROTOTYPE_IDS.flatMap((prototypeId) =>
  REVIEW_SEEDS.map((seed) => generateRnkCp003ReviewedSourceQuestion(prototypeId, seed)),
);
const approved = [...initial, ...supplementary];

assert(initial.length === 54, 'Initial approved corpus must contain 54 questions');
assert(supplementary.length === 24, 'Supplementary approved corpus must contain 24 questions');
assert(approved.length === 78, 'Combined approved corpus must contain 78 questions');
assert(new Set(approved.map((question) => `${question.prototypeId}:${question.seed}`)).size === 78, 'Duplicate approved review identity');
assert(RNK_CP003_PERMANENT_QL_IDS.length === 9, 'Expected nine permanent QLs');
assert(RNK_CP003_PERMANENT_QL_IDS[0] === 'RNK-QL-018' && RNK_CP003_PERMANENT_QL_IDS.at(-1) === 'RNK-QL-026', 'Unexpected permanent range');

const projection = approved.map((question) => ({
  prototypeId: question.prototypeId,
  seed: question.seed,
  contextId: question.contextId,
  stem: question.stem,
  options: question.options.map((option) => ({
    label: option.label,
    misconceptionId: option.misconceptionId,
    explanation: option.explanation,
  })),
  correctIndex: question.correctIndex,
  answer: question.answer,
  difficulty: question.difficulty,
  explanation: {
    keyRule: question.explanation.keyRule,
    stepByStepSolution: question.explanation.stepByStepSolution,
    examSpeedShortcut: question.explanation.examSpeedShortcut,
    optionAnalysis: question.explanation.optionAnalysis,
    conclusion: question.explanation.conclusion,
  },
  mathematicalFingerprint: question.mathematicalFingerprint,
}));
const projectionHash = createHash('sha256').update(JSON.stringify(projection), 'utf8').digest('hex');
assert(projectionHash === EXPECTED_PROJECTION_HASH, `Approved English projection changed: ${projectionHash}`);

for (const question of approved) {
  assert(question.options.length === 4, `Expected four options at ${question.prototypeId}:${question.seed}`);
  assert(question.explanation.optionAnalysis.length === 4, `Expected four option analyses at ${question.prototypeId}:${question.seed}`);
  assert(question.explanation.conclusion.includes(String(question.answer)), `Conclusion omits answer at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.questionStudioDiscoverable === false, `Question Studio activated at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.questionBankStatus === 'NOT_STORED', `Question Bank activated at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.testEligibility === 'INELIGIBLE', `Test eligibility activated at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.publiclyPublishable === false, `Publication activated at ${question.prototypeId}:${question.seed}`);
}

const freeze = {
  checkpointId: 'RNK-CP-003',
  freezeVersion: 'RNK_CP003_ENGLISH_DISCOVERY_FREEZE_V1',
  status: 'ENGLISH_DISCOVERY_FROZEN',
  initialApprovedQuestions: initial.length,
  supplementaryApprovedQuestions: supplementary.length,
  approvedEnglishQuestionCount: approved.length,
  discoveryPrototypeCount: 13,
  discoveryRuntimeQuestionCount: 3120,
  permanentAuthorityCount: 9,
  permanentRange: 'RNK-QL-018..026',
  cumulativeRange: 'RNK-QL-001..026',
  nextAvailableQlId: 'RNK-QL-027',
  approvedEnglishProjection: `sha256:${projectionHash}`,
  openSourceDimensions: 0,
  lifecycle: {
    englishReviewOnly: true,
    hindiPunjabi: 'NOT_STARTED',
    questionStudio: 'DISABLED',
    questionBank: 'NOT_STORED',
    testEligibility: 'INELIGIBLE',
    publicPublication: false,
  },
};

writeFileSync(join(outputDirectory, 'cp003-final-discovery-freeze.json'), `${JSON.stringify(freeze, null, 2)}\n`, 'utf8');
console.log(JSON.stringify(freeze, null, 2));
