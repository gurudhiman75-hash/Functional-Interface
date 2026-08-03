import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  RNK_CP003_SOURCE_PROTOTYPE_IDS,
  generateRnkCp003SourceQuestion,
  solveCp003SourceIndependently,
  type RnkCp003SourceQuestion,
} from './cp003-source-wave';
import { generateRnkCp003FinalSourceQuestion } from './cp003-source-wave-final';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const REVIEW_SEEDS = [0, 1, 2, 7, 31, 97] as const;
const outputDirectory = process.argv[2] ?? 'rnk-cp003-source-reviewed-output';
mkdirSync(outputDirectory, { recursive: true });

const questions = RNK_CP003_SOURCE_PROTOTYPE_IDS.flatMap((prototypeId) =>
  REVIEW_SEEDS.map((seed) => generateRnkCp003FinalSourceQuestion(prototypeId, seed)),
);

assert(questions.length === 24, 'Expected 24 final supplementary questions');
assert(new Set(questions.map((question) => `${question.prototypeId}:${question.seed}`)).size === 24, 'Duplicate final supplementary identity');

for (const question of questions) {
  const base = generateRnkCp003SourceQuestion(question.prototypeId, question.seed);
  const regenerated = generateRnkCp003FinalSourceQuestion(question.prototypeId, question.seed);
  assert(JSON.stringify(regenerated) === JSON.stringify(question), `Non-deterministic final output at ${question.prototypeId}:${question.seed}`);
  assert(question.answer === base.answer, `Answer changed at ${question.prototypeId}:${question.seed}`);
  assert(JSON.stringify(question.options) === JSON.stringify(base.options), `Options changed at ${question.prototypeId}:${question.seed}`);
  assert(JSON.stringify(question.displayedEvidence) === JSON.stringify(base.displayedEvidence), `Evidence changed at ${question.prototypeId}:${question.seed}`);
  assert(question.mathematicalFingerprint === base.mathematicalFingerprint, `Fingerprint changed at ${question.prototypeId}:${question.seed}`);
  assert(solveCp003SourceIndependently(question.displayedEvidence) === question.answer, `Solver mismatch at ${question.prototypeId}:${question.seed}`);
  assert(question.options[question.correctIndex].answer === question.answer, `Correct option mismatch at ${question.prototypeId}:${question.seed}`);
  assert(question.explanation.stepByStepSolution.length === 4, `Expected four solution steps at ${question.prototypeId}:${question.seed}`);
  assert(question.explanation.optionAnalysis.length === 4, `Expected four option analyses at ${question.prototypeId}:${question.seed}`);
  assert(question.explanation.conclusion.includes(String(question.answer)), `Conclusion omits answer at ${question.prototypeId}:${question.seed}`);
  assert(!/\bthe\s+the\b/i.test(question.stem), `Duplicate article at ${question.prototypeId}:${question.seed}`);
  assert(!/\b1 places\b/i.test(question.stem), `Singular movement error at ${question.prototypeId}:${question.seed}`);
  assert(!/start end|end end|reference start|reference end/i.test(`${question.stem} ${JSON.stringify(question.explanation)}`), `Internal wording leaked at ${question.prototypeId}:${question.seed}`);
  assert(!/moves? from \d+(?:st|nd|rd|th) from the/i.test(question.stem), `Repeated movement wording at ${question.prototypeId}:${question.seed}`);
  assert(!/current rank from one fixed end/i.test(question.explanation.examSpeedShortcut), `Abstract shortcut remained at ${question.prototypeId}:${question.seed}`);
  assert(question.permanentQlId === null, `Permanent QL allocated early at ${question.prototypeId}:${question.seed}`);
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
    question.options.forEach((option, optionIndex) => lines.push(`${String.fromCharCode(65 + optionIndex)}. ${option.label}`));
    lines.push('', '### Explanation', '', `**Correct answer:** ${question.answer}`, '', `**Key rule:** ${question.explanation.keyRule}`, '', '**Step-by-step solution:**', '');
    question.explanation.stepByStepSolution.forEach((step, stepIndex) => lines.push(`${stepIndex + 1}. ${step}`));
    lines.push('', `**Exam-speed shortcut:** ${question.explanation.examSpeedShortcut}`, '', '**Option analysis:**', '');
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
  answerOptionEvidenceFingerprintParity: 'PASS',
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

writeFileSync(join(outputDirectory, 'cp003-supplementary-reviewed-audit.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
writeFileSync(join(outputDirectory, 'cp003-supplementary-reviewed-pack.json'), `${JSON.stringify(questions, null, 2)}\n`, 'utf8');
writeFileSync(join(outputDirectory, 'RNK-CP-003-Supplementary-Questions-and-Explanations.md'), renderMarkdown(questions), 'utf8');
console.log(JSON.stringify(report, null, 2));
