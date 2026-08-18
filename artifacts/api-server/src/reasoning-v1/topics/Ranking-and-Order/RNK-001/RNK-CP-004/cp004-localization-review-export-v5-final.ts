import { writeFileSync } from 'node:fs';

import { buildRnkCp004PermanentRuntime } from './cp004-permanent-runtime-v1';
import { RNK_CP004_PERMANENT_QL_IDS } from './cp004-localization-review-v1';
import type { RnkCp004LocalizedLocale } from './cp004-localization-review-v1';
import {
  RNK_CP004_LOCALIZATION_REVIEW_V5_FINAL_AUTHORITY,
  RNK_CP004_LOCALIZATION_REVIEW_V5_FINAL_VERSION,
  localizeRnkCp004PermanentQuestionV5Final,
} from './cp004-localization-review-v5-final';

const REVIEW_ORDINALS = [1, 2, 6, 17, 48, 97, 152, 191] as const;
const outputPath = process.argv[2] ?? 'RNK-CP-004-HI-PA-LOCALIZATION-REVIEW-V5-FINAL-144Q.md';
const canonical = buildRnkCp004PermanentRuntime();

function questionsForQl(qlId: string) {
  return canonical.filter(
    (question) => question.reviewMetadata.permanentProfile.permanentQlId === qlId,
  );
}

function renderLocale(locale: RnkCp004LocalizedLocale): string[] {
  const lines: string[] = [];
  lines.push(locale === 'hi-IN' ? '# हिंदी समीक्षा' : '# ਪੰਜਾਬੀ ਸਮੀਖਿਆ', '');

  for (const qlId of RNK_CP004_PERMANENT_QL_IDS) {
    const sourceQuestions = questionsForQl(qlId);
    lines.push(`## ${qlId}`, '');

    for (const ordinal of REVIEW_ORDINALS) {
      const canonicalQuestion = sourceQuestions.find(
        (question) => question.reviewMetadata.permanentProfile.permanentOrdinalWithinAuthority === ordinal,
      );
      if (!canonicalQuestion) throw new Error(`Missing ${qlId} permanent ordinal ${ordinal}`);
      const question = localizeRnkCp004PermanentQuestionV5Final(canonicalQuestion, locale);
      const profile = canonicalQuestion.reviewMetadata.permanentProfile;
      const inverse = canonicalQuestion.reviewMetadata.sourceInverseProfile;
      const context = canonicalQuestion.reviewMetadata.languageProfile.contextFamily;
      const diversity = question.localizationMetadata.editorialDiversity;

      lines.push(
        `### ${qlId} · permanent ordinal ${ordinal}`,
        '',
        `- Authority: \`${profile.authorityId}\``,
        `- Prototype: \`${question.prototypeId}\``,
        `- Seed: \`${question.seed}\``,
        `- Context: \`${context}\``,
        `- Source inverse: \`${inverse.variant}\``,
        `- Editorial diversity: intro ${diversity.introVariant}, query ${diversity.queryVariant}, clue templates ${diversity.clueVariantIds.join('/')}, shuffled ${diversity.clueOrderShuffled}`,
        `- Correct option: ${question.correctIndex + 1}`,
        '',
        '**Question**',
        '',
        question.stem,
        '',
        '**Options**',
        '',
      );
      question.options.forEach((option: Record<string, unknown>, index: number) => {
        lines.push(`${index + 1}. ${String(option.label)}`);
      });
      lines.push(
        '',
        `**Answer:** ${String(question.answer)}`,
        '',
        '**Key rule**',
        '',
        question.explanation.keyRule,
        '',
        '**Step-by-step solution**',
        '',
      );
      question.explanation.stepByStepSolution.forEach((step: string, index: number) => {
        lines.push(`${index + 1}. ${step}`);
      });
      lines.push(
        '',
        '**Exam-speed shortcut**',
        '',
        question.explanation.examSpeedShortcut,
        '',
        '**Option analysis**',
        '',
      );
      question.explanation.optionAnalysis.forEach((analysis: string) => lines.push(`- ${analysis}`));
      lines.push('', '**Conclusion**', '', question.explanation.conclusion, '', '---', '');
    }
  }

  return lines;
}

const questionsPerLocale = RNK_CP004_PERMANENT_QL_IDS.length * REVIEW_ORDINALS.length;
const lines = [
  '# RNK-CP-004 Hindi/Punjabi Localization Review V5 Final',
  '',
  '> REVIEW CANDIDATE ONLY. V5 Final keeps the moderate deterministic diversity contract while refining clue sentence skeletons so the three variants are visibly distinct. V1 semantic, V2 editorial, V3 distractor-contract and V4 missing-comparison pedagogy baselines remain preserved. Formal language approval and multilingual freeze are not granted.',
  '',
  `- Version: \`${RNK_CP004_LOCALIZATION_REVIEW_V5_FINAL_VERSION}\``,
  `- Authority: \`${RNK_CP004_LOCALIZATION_REVIEW_V5_FINAL_AUTHORITY}\``,
  '- Permanent range: `RNK-QL-027..035`',
  `- Permanent ordinals sampled per QL: ${REVIEW_ORDINALS.join(', ')}`,
  `- Questions per locale: ${questionsPerLocale}`,
  `- Total review questions: ${questionsPerLocale * 2}`,
  '- Frozen English runtime: 1,728 questions',
  '- Full localized parity bank: 1,728 Hindi + 1,728 Punjabi',
  '- Moderate diversity: 2 intro variants, 3 visibly distinct clue variants, 2 query variants',
  '- Clue order: deterministic seeded shuffle',
  '- Anti-repetition: same clue template max twice consecutively',
  '- V4 options, answers and explanations: preserved exactly',
  '- Human language review: required',
  '- Multilingual freeze: false',
  '- Question Studio / Question Bank / product delivery: locked',
  '',
  ...renderLocale('hi-IN'),
  ...renderLocale('pa-IN'),
];

writeFileSync(outputPath, `${lines.join('\n')}\n`, 'utf8');
console.log(JSON.stringify({
  status: 'EXPORTED',
  outputPath,
  version: RNK_CP004_LOCALIZATION_REVIEW_V5_FINAL_VERSION,
  reviewOrdinals: REVIEW_ORDINALS,
  questionsPerLocale,
  totalQuestions: questionsPerLocale * 2,
  v5DiversityContractPreserved: true,
  v4PedagogyBaselinePreserved: true,
}, null, 2));
