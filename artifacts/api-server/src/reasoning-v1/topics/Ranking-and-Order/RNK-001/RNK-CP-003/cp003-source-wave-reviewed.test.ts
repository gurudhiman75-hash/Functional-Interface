import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  RNK_CP003_SOURCE_PROTOTYPE_IDS,
  generateRnkCp003SourceQuestion,
  solveCp003SourceIndependently,
  type RnkCp003SourceQuestion,
} from './cp003-source-wave';
import { generateRnkCp003ReviewedSourceQuestion } from './cp003-source-wave-reviewed';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const REVIEW_SEEDS = [0, 1, 2, 7, 31, 97] as const;
const outputDirectory = process.argv[2] ?? 'rnk-cp003-source-reviewed-output';
mkdirSync(outputDirectory, { recursive: true });

const questions = RNK_CP003_SOURCE_PROTOTYPE_IDS.flatMap((prototypeId) =>
  REVIEW_SEEDS.map((seed) => generateRnkCp003ReviewedSourceQuestion(prototypeId, seed)),
);

assert(questions.length === 24, 'Expected 24 reviewed supplementary questions');
assert(
  new Set(questions.map((question) => `${question.prototypeId}:${question.seed}`)).size === questions.length,
  'Duplicate reviewed supplementary identity',
);

for (const question of questions) {
  const base = generateRnkCp003SourceQuestion(question.prototypeId, question.seed);
  const regenerated = generateRnkCp003ReviewedSourceQuestion(question.prototypeId, question.seed);

  assert(
    JSON.stringify(regenerated) === JSON.stringify(question),
    `Non-deterministic reviewed output at ${question.prototypeId}:${question.seed}`,
  );
  assert(question.answer === base.answer, `Answer changed during review at ${question.prototypeId}:${question.seed}`);
  assert(
    JSON.stringify(question.options) === JSON.stringify(base.options),
    `Options changed during review at ${question.prototypeId}:${question.seed}`,
  );
  assert(
    JSON.stringify(question.displayedEvidence) === JSON.stringify(base.displayedEvidence),
    `Displayed evidence changed during review at ${question.prototypeId}:${question.seed}`,
  );
  assert(
    question.mathematicalFingerprint === base.mathematicalFingerprint,
    `Fingerprint changed during review at ${question.prototypeId}:${question.seed}`,
  );
  assert(
    solveCp003SourceIndependently(question.displayedEvidence) === question.answer,
    `Reviewed solver mismatch at ${question.prototypeId}:${question.seed}`,
  );
  assert(question.options.length === 4, `Expected four options at ${question.prototypeId}:${question.seed}`);
  assert(
    question.options[question.correctIndex].answer === question.answer,
    `Correct option mismatch at ${question.prototypeId}:${question.seed}`,
  );
  assert(question.explanation.stepByStepSolution.length === 4, `Expected four teaching steps at ${question.prototypeId}:${question.seed}`);
  assert(question.explanation.optionAnalysis.length === 4, `Expected four option analyses at ${question.prototypeId}:${question.seed}`);
  assert(question.explanation.conclusion.includes(String(question.answer)), `Conclusion omits answer at ${question.prototypeId}:${question.seed}`);
  assert(!/\bthe\s+the\b/i.test(question.stem), `Duplicate article in stem at ${question.prototypeId}:${question.seed}`);
  assert(!/\b1 places\b/i.test(question.stem), `Singular movement error at ${question.prototypeId}:${question.seed}`);
  assert(!/start end|end end/i.test(question.stem), `Internal direction wording leaked at ${question.prototypeId}:${question.seed}`);
  assert(!/reference start|reference end/i.test(JSON.stringify(question.explanation)), `Technical reference wording leaked at ${question.prototypeId}:${question.seed}`);
  assert(!/moves from \d+(?:st|nd|rd|th) from the/i.test(question.stem), `Repeated movement phrasing at ${question.prototypeId}:${question.seed}`);
  assert(!/moved from \d+(?:st|nd|rd|th) from the/i.test(question.stem), `Repeated inverse movement phrasing at ${question.prototypeId}:${question.seed}`);
  assert(!/current rank from one fixed end/i.test(question.explanation.examSpeedShortcut), `Abstract ledger wording remained at ${question.prototypeId}:${question.seed}`);
  assert(
    question.lifecycle.reviewStatus === 'UNREVIEWED'
      && question.lifecycle.questionStudioDiscoverable === false
      && question.lifecycle.questionBankStatus === 'NOT_STORED'
      && question.lifecycle.testEligibility === 'INELIGIBLE'
      && question.lifecycle.publiclyPublishable === false,
    `Lifecycle lock changed at ${question.prototypeId}:${question.seed}`,
  );
}

function renderMarkdown(reviewQuestions: readonly RnkCp003SourceQuestion[]): string {
  const lines: string[] = ['# RNK-CP-003 Supplementary Questions and Explanations', ''];
  reviewQuestions.forEach((question, index) => {
    lines.push(`## Question ${index + 1}`, '', question.stem, '');
    question.options.forEach((option, optionIndex) => {
      lines.push(`${String.fromCharCode(65 + optionIndex)}. ${option.label}`);
    });
    lines.push(
      '',
      '### Explanation',
      '',
      `**Correct answer:** ${question.answer}`,
      '',
      `**Key rule:** ${question.explanation.keyRule}`,
      '',
      '**Step-by-step solution:**',
      '',
    );
    question.explanation.stepByStepSolution.forEach((step, stepIndex) => {
      lines.push(`${stepIndex + 1}. ${step}`);
    });
    lines.push(
      '',
      `**Exam-speed shortcut:** ${question.explanation.examSpeedShortcut}`,
      '',
      '**Option analysis:**',
      '',
    );
    question.explanation.optionAnalysis.forEach((analysis) => lines.push(`- ${analysis}`));
    lines.push('', `**Conclusion:** ${question.explanation.conclusion}`, '', '---', '');
  });
  return `${lines.join('\n').trim()}\n`;
}

const report = {
  checkpointId: 'RNK-CP-003',
  status: 'SUPPLEMENTARY_ENGLISH_REVIEW_PENDING',
  reviewedQuestionCount: questions.length,
  prototypes: RNK_CP003_SOURCE_PROTOTYPE_IDS,
  reviewSeeds: REVIEW_SEEDS,
  answerAndOptionParity: 'PASS',
  displayedEvidenceParity: 'PASS',
  mathematicalFingerprintParity: 'PASS',
  editorialAudit: 'PASS',
  permanentQlCount: null,
  nextAvailableQlId: 'RNK-QL-018',
  lifecycle: {
    questionStudio: 'DISABLED',
    questionBank: 'NOT_STORED',
    testEligibility: 'INELIGIBLE',
    publicPublication: false,
    hindiPunjabi: 'NOT_STARTED',
  },
};

writeFileSync(
  join(outputDirectory, 'cp003-supplementary-reviewed-audit.json'),
  `${JSON.stringify(report, null, 2)}\n`,
  'utf8',
);
writeFileSync(
  join(outputDirectory, 'cp003-supplementary-reviewed-pack.json'),
  `${JSON.stringify(questions, null, 2)}\n`,
  'utf8',
);
writeFileSync(
  join(outputDirectory, 'RNK-CP-003-Supplementary-Questions-and-Explanations.md'),
  renderMarkdown(questions),
  'utf8',
);
console.log(JSON.stringify(report, null, 2));
