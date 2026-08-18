import { writeFileSync } from 'node:fs';

import { RNK_CP001_PERMANENT_QL_IDS, generateRnkCp001PermanentQuestion } from './cp001-permanent-runtime';
import type { RnkCp001LocalizedLocale } from './cp001-localization-review-v1';
import {
  localizeRnkCp001PermanentQuestionV4,
  type RnkCp001LocalizedReviewQuestionV4,
} from './cp001-localization-review-v4';

const OUTPUT = process.argv[2] ?? 'RNK-CP-001-HI-PA-LOCALIZATION-REVIEW-V4-108Q.md';
const REVIEW_SEEDS = [5, 16, 47, 92, 151, 233] as const;
const LETTERS = ['A', 'B', 'C', 'D'] as const;

function reviewQuestions(locale: RnkCp001LocalizedLocale): readonly RnkCp001LocalizedReviewQuestionV4[] {
  return RNK_CP001_PERMANENT_QL_IDS.flatMap((qlId) =>
    REVIEW_SEEDS.map((seed) =>
      localizeRnkCp001PermanentQuestionV4(generateRnkCp001PermanentQuestion(qlId, seed), locale),
    ),
  );
}

function renderLocale(locale: RnkCp001LocalizedLocale, title: string): string[] {
  const questions = reviewQuestions(locale);
  const lines: string[] = [`## ${title}`, '', `Review items: **${questions.length}** — 6 per permanent QL.`, '', '### Questions', ''];
  questions.forEach((question, index) => {
    lines.push(`#### ${title.slice(0, 2).toUpperCase()}-${String(index + 1).padStart(2, '0')} — ${question.qlId} / ${question.contextId} / ${question.reviewMetadata.sourcePrototypeId}`, '', question.stem, '');
    question.options.forEach((option, optionIndex) => lines.push(`${LETTERS[optionIndex]}. ${option.label}`));
    lines.push('');
  });
  lines.push('### Answers and explanations', '');
  questions.forEach((question, index) => {
    lines.push(`#### ${title.slice(0, 2).toUpperCase()}-${String(index + 1).padStart(2, '0')}`, '');
    lines.push(`**Answer:** ${LETTERS[question.correctIndex]} — ${question.answer}`, '');
    lines.push(`**Key rule:** ${question.explanation.keyRule}`, '', '**Step-by-step:**', '');
    question.explanation.stepByStepSolution.forEach((step, stepIndex) => lines.push(`${stepIndex + 1}. ${step}`));
    lines.push('', `**Exam-speed shortcut:** ${question.explanation.examSpeedShortcut}`, '', '**Option analysis:**', '');
    question.explanation.optionAnalysis.forEach((line) => lines.push(`- ${line}`));
    lines.push('', `**Conclusion:** ${question.explanation.conclusion}`, '');
  });
  return lines;
}

const hindi = reviewQuestions('hi-IN');
const punjabi = reviewQuestions('pa-IN');
const lines: string[] = [
  '# RNK-CP-001 — Hindi/Punjabi Native Editorial Human Review Pack V4',
  '',
  'Status: **machine-proved native-editorial review candidate — human language review required — not multilingual frozen**.',
  '',
  'V4 carries forward V3 intact and naturalizes only the visible side-count labels in solution step 1, replacing telegraphic forms such as “दाएँ व्यक्ति = 6” / “ਸੱਜੇ ਵਿਅਕਤੀ = 6” with native count phrases.',
  '',
  '```text',
  'permanent QLs:                  RNK-QL-001..009',
  'Hindi review samples:           54',
  'Punjabi review samples:         54',
  'total human-review samples:    108',
  'full V4 parity bank/locale:   1152',
  'new QLs allocated:               0',
  'next available QL:              RNK-QL-043',
  'human language review:          REQUIRED',
  'multilingual freeze:            NOT GRANTED',
  'Question Studio:                DISABLED',
  'Question Bank/publication:      DISABLED',
  '```',
  '',
  ...renderLocale('hi-IN', 'Hindi'),
  '',
  '---',
  '',
  ...renderLocale('pa-IN', 'Punjabi'),
  '',
  '---',
  '',
  '## Human review checklist',
  '',
  '- V3 boundary-safe ordinal contract remains intact;',
  '- singular/zero stem agreement remains intact;',
  '- explanations remain context-specific and evidence-only;',
  '- side-count givens use natural plural/count constructions;',
  '- arithmetic, options, answers and semantic fingerprints remain unchanged;',
  '- no residual English learner-facing prose.',
];

writeFileSync(OUTPUT, `${lines.join('\n')}\n`, 'utf8');
console.log(JSON.stringify({
  status: 'PASS',
  output: OUTPUT,
  hindiSamples: hindi.length,
  punjabiSamples: punjabi.length,
  totalSamples: hindi.length + punjabi.length,
  humanLanguageReviewRequired: true,
  multilingualFreezeGranted: false,
}, null, 2));
