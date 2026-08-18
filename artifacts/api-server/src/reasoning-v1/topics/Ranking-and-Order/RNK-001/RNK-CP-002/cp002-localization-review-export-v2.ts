import { writeFileSync } from 'node:fs';

import {
  RNK_CP002_PERMANENT_QL_IDS,
  generateRnkCp002PermanentQuestion,
} from './cp002-permanent-runtime';
import type { RnkCp002LocalizedLocale } from './cp002-localization-review-v1';
import {
  localizeRnkCp002PermanentQuestionV2,
  type RnkCp002LocalizedReviewQuestionV2,
} from './cp002-localization-review-v2';

const OUTPUT = process.argv[2] ?? 'RNK-CP-002-HI-PA-LOCALIZATION-REVIEW-V2-128Q.md';
const REVIEW_SEEDS = [0, 1, 2, 5, 16, 47, 92, 151] as const;
const LETTERS = ['A', 'B', 'C', 'D'] as const;

function reviewQuestions(locale: RnkCp002LocalizedLocale): readonly RnkCp002LocalizedReviewQuestionV2[] {
  return RNK_CP002_PERMANENT_QL_IDS.flatMap((qlId) =>
    REVIEW_SEEDS.map((seed) =>
      localizeRnkCp002PermanentQuestionV2(generateRnkCp002PermanentQuestion(qlId, seed), locale),
    ),
  );
}

function renderLocale(locale: RnkCp002LocalizedLocale, title: string): string[] {
  const questions = reviewQuestions(locale);
  const lines: string[] = [`## ${title}`, '', `Review items: **${questions.length}** — 8 per permanent QL.`, '', '### Questions', ''];
  questions.forEach((question, index) => {
    lines.push(`#### ${title.slice(0, 2).toUpperCase()}-${String(index + 1).padStart(2, '0')} — ${question.qlId} / ${question.contextId} / ${question.reviewMetadata.sourcePrototypeId} / ${question.displayedEvidence.kind}`, '', question.stem, '');
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
    lines.push(`**Canonical outcome:** \`${String(question.reviewMetadata.canonicalAnswer)}\``, '');
  });
  return lines;
}

const hindi = reviewQuestions('hi-IN');
const punjabi = reviewQuestions('pa-IN');
const lines: string[] = [
  '# RNK-CP-002 — Hindi/Punjabi Native Editorial Human Review Pack V2',
  '',
  'Status: **machine-proved native-editorial review candidate — human language review required — not multilingual frozen**.',
  '',
  'V2 supersedes V1 for human-language review. It fixes QL-015 plural/genitive count phrasing and removes duplicated final copulas in sentence-valued QL-017 option explanations and conclusions while preserving canonical answer/option identities.',
  '',
  '```text',
  'permanent QLs:                   RNK-QL-010..017',
  'Hindi review samples:            64',
  'Punjabi review samples:          64',
  'total human-review samples:     128',
  'full parity bank per locale:   1536',
  'new QLs allocated:                0',
  'next available QL:               RNK-QL-043',
  'human language review:           REQUIRED',
  'multilingual freeze:             NOT GRANTED',
  'Question Studio:                 DISABLED',
  'Question Bank/publication:       DISABLED',
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
  '- QL-015 uses अभ्यर्थियों/व्यक्तियों and ਉਮੀਦਵਾਰਾਂ/ਵਿਅਕਤੀਆਂ before count-genitive constructions;',
  '- no Hindi “है है।” or Punjabi “ਹੈ ਹੈ।” learner text remains;',
  '- QL-017 localized answer values/options remain unchanged and contextually correct;',
  '- all V1 structured-evidence, ordinal, person-answer and indeterminate-answer contracts remain intact;',
  '- arithmetic, correct option positions and canonical semantic fingerprints remain unchanged;',
  '- no product lifecycle lock is opened.',
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
