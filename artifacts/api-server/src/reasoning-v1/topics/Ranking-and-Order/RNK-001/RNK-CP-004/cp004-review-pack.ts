import { RNK_CP004_PROTOTYPE_IDS } from './cp004-foundation';
import {
  generateRnkCp004ExamReadyQuestion,
  type RnkCp004ExamReadyQuestion,
} from './cp004-exam-ready-v2';

const REVIEW_SEEDS = [0, 1, 2, 7, 31, 97] as const;

export function buildRnkCp004ReviewPack(): readonly RnkCp004ExamReadyQuestion[] {
  return RNK_CP004_PROTOTYPE_IDS.flatMap((prototypeId) =>
    REVIEW_SEEDS.map((seed) => generateRnkCp004ExamReadyQuestion(prototypeId, seed)),
  );
}

export function renderRnkCp004QuestionsAndExplanationsMarkdown(
  questions: readonly RnkCp004ExamReadyQuestion[],
): string {
  const lines: string[] = [
    '# RNK-CP-004 Questions and Explanations — English Remodel V1',
    '',
    '> Status: manual English review pending. Permanent QL allocation remains open.',
    '',
  ];
  questions.forEach((question, index) => {
    lines.push(
      `## Question ${index + 1}`,
      '',
      `**Stable ID:** \`${question.reviewMetadata.stableQuestionId}\`  `,
      `**Prototype:** \`${question.prototypeId}\`  `,
      `**Seed:** \`${question.seed}\`  `,
      `**Difficulty:** ${question.difficulty}  `,
      `**Competency:** ${question.reviewMetadata.competency}  `,
      `**Review state:** ${question.reviewMetadata.reviewStatus}  `,
      '**Lifecycle:** Question Studio disabled · Question Bank NOT_STORED · Tests INELIGIBLE · Public false',
      '',
      question.stem,
      '',
    );
    question.options.forEach((option, optionIndex) => {
      lines.push(`${String.fromCharCode(65 + optionIndex)}. ${option.label}`);
    });
    lines.push(
      '',
      '### Explanation',
      '',
      `**Mental picture:** ${question.explanation.mentalPicture}`,
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
    lines.push('', `**${question.explanation.conclusion}**`, '', '---', '');
  });
  return `${lines.join('\n').trim()}\n`;
}
