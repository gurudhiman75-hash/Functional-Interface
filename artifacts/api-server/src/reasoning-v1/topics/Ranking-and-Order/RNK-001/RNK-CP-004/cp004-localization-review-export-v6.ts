import { writeFileSync } from 'node:fs';

import { buildRnkCp004PermanentRuntime } from './cp004-permanent-runtime-v1';
import type { RnkCp004LocalizedLocale } from './cp004-localization-review-v1';
import {
  RNK_CP004_LOCALIZATION_REVIEW_V6_AUTHORITY,
  RNK_CP004_LOCALIZATION_REVIEW_V6_VERSION,
  localizeRnkCp004PermanentQuestionV6,
} from './cp004-localization-review-v6';

const REVIEW_ORDINALS = [1, 2, 6, 17, 48, 97, 152, 191] as const;
const TARGET_QLS = ['RNK-QL-027', 'RNK-QL-028'] as const;
const outputPath = process.argv[2] ?? 'RNK-CP-004-HI-PA-LOCALIZATION-REVIEW-V6-32Q.md';
const canonical = buildRnkCp004PermanentRuntime();

function renderLocale(locale: RnkCp004LocalizedLocale): string[] {
  const lines: string[] = [locale === 'hi-IN' ? '# हिंदी समीक्षा' : '# ਪੰਜਾਬੀ ਸਮੀਖਿਆ', ''];
  for (const qlId of TARGET_QLS) {
    lines.push(`## ${qlId}`, '');
    const sourceQuestions = canonical.filter(
      (question) => question.reviewMetadata.permanentProfile.permanentQlId === qlId,
    );
    for (const ordinal of REVIEW_ORDINALS) {
      const source = sourceQuestions.find(
        (question) => question.reviewMetadata.permanentProfile.permanentOrdinalWithinAuthority === ordinal,
      );
      if (!source) throw new Error(`Missing ${qlId} ordinal ${ordinal}`);
      const question = localizeRnkCp004PermanentQuestionV6(source, locale) as Record<string, any>;
      lines.push(
        `### ${qlId} · permanent ordinal ${ordinal}`,
        '',
        `- Authority: \`${source.reviewMetadata.permanentProfile.authorityId}\``,
        `- Context: \`${source.reviewMetadata.languageProfile.contextFamily}\``,
        `- Correct option: ${question.correctIndex + 1}`,
        '',
        '**Question**',
        '',
        question.stem,
        '',
        '**Options**',
        '',
      );
      question.options.forEach((option: Record<string, any>, index: number) => lines.push(`${index + 1}. ${option.label}`));
      lines.push('', `**Answer:** ${question.answer}`, '', '**Step-by-step solution**', '');
      question.explanation.stepByStepSolution.forEach((step: string, index: number) => lines.push(`${index + 1}. ${step}`));
      lines.push('', '**Option analysis**', '');
      question.explanation.optionAnalysis.forEach((line: string) => lines.push(`- ${line}`));
      lines.push('', '---', '');
    }
  }
  return lines;
}

const lines = [
  '# RNK-CP-004 Hindi/Punjabi Localization Review V6',
  '',
  '> REVIEW CANDIDATE ONLY. V6 remediates reason-specific option pedagogy for RNK-QL-027/028 while preserving V5 Final mathematics, stems, option labels/order, answers and all release locks.',
  '',
  `- Version: \`${RNK_CP004_LOCALIZATION_REVIEW_V6_VERSION}\``,
  `- Authority: \`${RNK_CP004_LOCALIZATION_REVIEW_V6_AUTHORITY}\``,
  '- Scope: `RNK-QL-027..028` learner pedagogy only',
  `- Ordinals per QL: ${REVIEW_ORDINALS.join(', ')}`,
  '- Questions: 16 Hindi + 16 Punjabi = 32',
  '- Formal human language approval: required',
  '- Multilingual freeze: false',
  '',
  ...renderLocale('hi-IN'),
  ...renderLocale('pa-IN'),
];

writeFileSync(outputPath, `${lines.join('\n')}\n`, 'utf8');
console.log(JSON.stringify({
  status: 'EXPORTED',
  outputPath,
  version: RNK_CP004_LOCALIZATION_REVIEW_V6_VERSION,
  targetQls: TARGET_QLS,
  totalQuestions: 32,
}, null, 2));
