import { RNK_CP004_PROTOTYPE_IDS } from './cp004-foundation';
import {
  generateRnkCp004ExamReadyQuestion,
  type RnkCp004ExamReadyQuestion,
} from './cp004-exam-ready-v3';

const REVIEW_CORRECT_INDEX_SEQUENCE = [
  1, 2, 3, 0, 2, 0,
  3, 1, 0, 3, 1, 2,
  1, 3, 2, 0, 2, 1,
  0, 3, 2, 1, 3, 0,
  2, 3, 1, 0, 1, 0,
  3, 0, 2, 1, 3, 1,
  2, 3, 2, 0, 3, 0,
  1, 2, 3, 1, 2, 0,
  1, 0, 2, 3, 2, 1,
  0, 1, 3, 2, 3, 0,
] as const;

export function buildRnkCp004ReviewPack(): readonly RnkCp004ExamReadyQuestion[] {
  const questions: RnkCp004ExamReadyQuestion[] = [];
  const fingerprints = new Set<string>();

  RNK_CP004_PROTOTYPE_IDS.forEach((prototypeId, prototypeIndex) => {
    let accepted = 0;
    let candidateSeed = prototypeIndex * 1000;
    while (accepted < 6) {
      const outputIndex = prototypeIndex * 6 + accepted;
      const question = generateRnkCp004ExamReadyQuestion(
        prototypeId,
        candidateSeed,
        REVIEW_CORRECT_INDEX_SEQUENCE[outputIndex],
      );
      candidateSeed += 1;
      if (fingerprints.has(question.reviewMetadata.normalizedSemanticFingerprint)) continue;
      fingerprints.add(question.reviewMetadata.normalizedSemanticFingerprint);
      questions.push(question);
      accepted += 1;
    }
  });

  return questions;
}

export function renderRnkCp004QuestionsAndExplanationsMarkdown(
  questions: readonly RnkCp004ExamReadyQuestion[],
): string {
  const lines: string[] = [
    '# RNK-CP-004 Questions and Explanations — English Remodel V2',
    '',
    '> Status: manual English review pending. Permanent QL allocation remains open.',
    '',
    '> The internal proof object remains structured, but the student explanation renders only the reasoning needed for each question.',
    '',
  ];

  questions.forEach((question, index) => {
    const features = question.reviewMetadata.reasoningFeatures;
    lines.push(
      `## Question ${index + 1}`,
      '',
      `**Stable ID:** \`${question.reviewMetadata.stableQuestionId}\`  `,
      `**Prototype:** \`${question.prototypeId}\`  `,
      `**Seed:** \`${question.seed}\`  `,
      `**Difficulty:** ${question.difficulty}  `,
      `**Competency:** ${question.reviewMetadata.competency}  `,
      `**Explanation mode:** \`${question.reviewMetadata.explanationMode}\`  `,
      `**Clue profile:** ${features.essentialClueCount} essential · ${features.redundantClueCount} redundant · shortest proof ${features.shortestProofClueCount} clue(s)  `,
      `**Review state:** ${question.reviewMetadata.reviewStatus}  `,
      '**Lifecycle:** Question Studio disabled · Question Bank NOT_STORED · Tests INELIGIBLE · Public false',
      '',
      question.stem,
      '',
    );

    question.options.forEach((option, optionIndex) => {
      lines.push(`${String.fromCharCode(65 + optionIndex)}. ${option.label}`);
    });

    lines.push('', '### Explanation', '');
    question.visibleExplanation.lines.forEach((line) => lines.push(line, ''));

    if (question.visibleExplanation.optionAnalysis?.length) {
      lines.push('**Why the other options fail:**', '');
      question.visibleExplanation.optionAnalysis.forEach((analysis) => lines.push(`- ${analysis}`));
      lines.push('');
    }

    lines.push(`**Answer: ${question.visibleExplanation.answer}**`, '', '---', '');
  });

  return `${lines.join('\n').trim()}\n`;
}
