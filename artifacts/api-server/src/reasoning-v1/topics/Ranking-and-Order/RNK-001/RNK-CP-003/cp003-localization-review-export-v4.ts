import { writeFileSync } from 'node:fs';

import { RNK_CP003_PERMANENT_QL_IDS, generateRnkCp003PermanentQuestion } from './cp003-permanent-runtime';
import type { RnkCp003LocalizedLocale } from './cp003-localization-review-v1';
import {
  RNK_CP003_LOCALIZATION_REVIEW_V4_AUTHORITY,
  RNK_CP003_LOCALIZATION_REVIEW_V4_EDITORIAL,
  RNK_CP003_LOCALIZATION_REVIEW_V4_VERSION,
  localizeRnkCp003PermanentQuestionV4,
} from './cp003-localization-review-v4';

const REVIEW_SEEDS = [0, 1, 2, 5, 16, 47, 92, 151] as const;
const outputPath = process.argv[2] ?? 'RNK-CP-003-HI-PA-LOCALIZATION-REVIEW-V4-144Q.md';

function renderLocale(locale: RnkCp003LocalizedLocale): string[] {
  const lines: string[] = [];
  lines.push(locale === 'hi-IN' ? '# हिंदी समीक्षा' : '# ਪੰਜਾਬੀ ਸਮੀਖਿਆ', '');
  for (const qlId of RNK_CP003_PERMANENT_QL_IDS) {
    lines.push(`## ${qlId}`, '');
    for (const seed of REVIEW_SEEDS) {
      const canonical = generateRnkCp003PermanentQuestion(qlId, seed) as Record<string, any>;
      const question = localizeRnkCp003PermanentQuestionV4(canonical, locale);
      const evidenceKind = String((question.displayedEvidence as Record<string, unknown>).kind);
      lines.push(
        `### ${qlId} · seed ${seed}`,
        '',
        `- Prototype: \`${question.prototypeId}\``,
        `- Context: \`${question.contextId}\``,
        `- Evidence: \`${evidenceKind}\``,
        `- Correct option: ${question.correctIndex + 1}`,
        '',
        '**Question**',
        '',
        question.stem,
        '',
        '**Options**',
        '',
      );
      question.options.forEach((option: Record<string, unknown>, index: number) => lines.push(`${index + 1}. ${String(option.label)}`));
      lines.push('', `**Answer:** ${String(question.answer)}`, '', '**Key rule**', '', question.explanation.keyRule, '', '**Step-by-step solution**', '');
      question.explanation.stepByStepSolution.forEach((step: string, index: number) => lines.push(`${index + 1}. ${step}`));
      lines.push('', '**Exam-speed shortcut**', '', question.explanation.examSpeedShortcut, '', '**Option analysis**', '');
      question.explanation.optionAnalysis.forEach((analysis: string) => lines.push(`- ${analysis}`));
      lines.push('', '**Conclusion**', '', question.explanation.conclusion, '', '---', '');
    }
  }
  return lines;
}

const lines = [
  '# RNK-CP-003 Hindi/Punjabi Localization Review V4',
  '',
  '> REVIEW CANDIDATE ONLY. V4 is the final micro-editorial projection after direct V3 artifact review; formal human-language approval is still required.',
  '',
  `- Version: \`${RNK_CP003_LOCALIZATION_REVIEW_V4_VERSION}\``,
  `- Editorial: \`${RNK_CP003_LOCALIZATION_REVIEW_V4_EDITORIAL}\``,
  `- Authority: \`${RNK_CP003_LOCALIZATION_REVIEW_V4_AUTHORITY}\``,
  '- Permanent range: `RNK-QL-018..026`',
  `- Seeds per QL: ${REVIEW_SEEDS.join(', ')}`,
  `- Questions per locale: ${RNK_CP003_PERMANENT_QL_IDS.length * REVIEW_SEEDS.length}`,
  `- Total review questions: ${RNK_CP003_PERMANENT_QL_IDS.length * REVIEW_SEEDS.length * 2}`,
  '- V1 semantic baseline: preserved',
  '- V2/V3 editorial baselines: preserved semantically',
  '- English authority: frozen / unchanged',
  '- Hindi/Punjabi: review candidate',
  '- Human language review: required',
  '- Multilingual freeze: false',
  '- Product delivery: locked',
  '',
  ...renderLocale('hi-IN'),
  ...renderLocale('pa-IN'),
];

writeFileSync(outputPath, `${lines.join('\n')}\n`, 'utf8');
console.log(JSON.stringify({
  status: 'EXPORTED',
  outputPath,
  version: RNK_CP003_LOCALIZATION_REVIEW_V4_VERSION,
  reviewSeeds: REVIEW_SEEDS,
  questionsPerLocale: RNK_CP003_PERMANENT_QL_IDS.length * REVIEW_SEEDS.length,
  totalQuestions: RNK_CP003_PERMANENT_QL_IDS.length * REVIEW_SEEDS.length * 2,
}, null, 2));
