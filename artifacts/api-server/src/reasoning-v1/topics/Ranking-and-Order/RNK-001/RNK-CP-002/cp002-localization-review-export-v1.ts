import { writeFileSync } from 'node:fs';

import {
  RNK_CP002_PERMANENT_QL_IDS,
  generateRnkCp002PermanentQuestion,
} from './cp002-permanent-runtime';
import {
  localizeRnkCp002PermanentQuestion,
  type RnkCp002LocalizedLocale,
  type RnkCp002LocalizedReviewQuestion,
} from './cp002-localization-review-v1';

const OUTPUT = process.argv[2] ?? 'RNK-CP-002-HI-PA-LOCALIZATION-REVIEW-V1-128Q.md';
const REVIEW_SEEDS = [0, 1, 2, 5, 16, 47, 92, 151] as const;
const LETTERS = ['A', 'B', 'C', 'D'] as const;

function reviewQuestions(locale: RnkCp002LocalizedLocale): readonly RnkCp002LocalizedReviewQuestion[] {
  return RNK_CP002_PERMANENT_QL_IDS.flatMap((qlId) =>
    REVIEW_SEEDS.map((seed) =>
      localizeRnkCp002PermanentQuestion(generateRnkCp002PermanentQuestion(qlId, seed), locale),
    ),
  );
}

function renderLocale(locale: RnkCp002LocalizedLocale, title: string): string[] {
  const questions = reviewQuestions(locale);
  const lines: string[] = [
    `## ${title}`,
    '',
    `Review items: **${questions.length}** — 8 seeds for each of 8 permanent QLs.`,
    '',
    '### Questions',
    '',
  ];

  questions.forEach((question, index) => {
    lines.push(
      `#### ${title.slice(0, 2).toUpperCase()}-${String(index + 1).padStart(2, '0')} — ${question.qlId} / ${question.contextId} / ${question.reviewMetadata.sourcePrototypeId} / ${question.displayedEvidence.kind}`,
      '',
      question.stem,
      '',
    );
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
    lines.push(`**Canonical semantic fingerprint:** \`${question.localizationProof.canonicalSemanticFingerprint}\``, '');
  });
  return lines;
}

const hindi = reviewQuestions('hi-IN');
const punjabi = reviewQuestions('pa-IN');
const prototypes = new Set(hindi.map((question) => question.reviewMetadata.sourcePrototypeId));
const evidenceKinds = new Set(hindi.map((question) => question.displayedEvidence.kind));
const lines: string[] = [
  '# RNK-CP-002 — Hindi/Punjabi Localization Human Review Pack V1',
  '',
  'Status: **machine-parity review candidate — human language review required — not multilingual frozen**.',
  '',
  'CP002 V1 renders learner text directly from frozen structured displayed evidence. It does not translate or parse English stems. Person, indeterminate and order-status answers/options are localized from preserved canonical outcome identities.',
  '',
  '```text',
  'permanent QLs:                   RNK-QL-010..017',
  'Hindi review samples:            64',
  'Punjabi review samples:          64',
  'total human-review samples:     128',
  'full parity bank per locale:   1536',
  `source prototypes in pack:       ${prototypes.size}`,
  `evidence kinds in pack:          ${evidenceKinds.size}`,
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
  '- all three contexts use natural native top/bottom, left/right, and front/back wording;',
  '- exact ranks 1..4 use natural native ordinal words while larger numeric ranks remain intact;',
  '- between-count versus position-gap language is unambiguous;',
  '- mixed-end questions clearly expose the total only when it is part of displayed evidence;',
  '- QL-013 person answers/options use localized names;',
  '- QL-016 localizes “cannot be determined” without changing its canonical semantic identity;',
  '- QL-017 localizes order-status answers/options consistently with the named people and context;',
  '- explanations use only structured displayed evidence plus derived calculations;',
  '- no residual English learner-facing prose;',
  '- Question Studio, persistence, bank, tests and publication remain locked.',
];

writeFileSync(OUTPUT, `${lines.join('\n')}\n`, 'utf8');
console.log(JSON.stringify({
  status: 'PASS',
  output: OUTPUT,
  hindiSamples: hindi.length,
  punjabiSamples: punjabi.length,
  totalSamples: hindi.length + punjabi.length,
  sourcePrototypeCount: prototypes.size,
  evidenceKindCount: evidenceKinds.size,
  humanLanguageReviewRequired: true,
  multilingualFreezeGranted: false,
}, null, 2));
