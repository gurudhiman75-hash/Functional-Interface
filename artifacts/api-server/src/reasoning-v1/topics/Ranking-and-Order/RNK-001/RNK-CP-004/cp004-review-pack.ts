import { RNK_CP004_PROTOTYPE_IDS, generateRnkCp004Question, type RnkCp004Question } from './cp004-foundation';

const REVIEW_SEEDS = [0, 1, 2, 7, 31, 97] as const;

export function buildRnkCp004ReviewPack(): readonly RnkCp004Question[] {
  return RNK_CP004_PROTOTYPE_IDS.flatMap((prototypeId) =>
    REVIEW_SEEDS.map((seed) => generateRnkCp004Question(prototypeId, seed)),
  );
}

export function renderRnkCp004QuestionsAndExplanationsMarkdown(questions: readonly RnkCp004Question[]): string {
  const lines: string[] = ['# RNK-CP-004 Questions and Explanations', ''];
  questions.forEach((question, index) => {
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
      `**Mental picture:** ${question.explanation.mentalPicture}`,
      '',
      `**Key rule:** ${question.explanation.keyRule}`,
      '',
      '**Step-by-step solution:**',
      '',
    );
    question.explanation.stepByStepSolution.forEach((step, stepIndex) => lines.push(`${stepIndex + 1}. ${step}`));
    lines.push('', `**Exam-speed shortcut:** ${question.explanation.examSpeedShortcut}`, '', '**Option analysis:**', '');
    question.explanation.optionAnalysis.forEach((analysis) => lines.push(`- ${analysis}`));
    lines.push('', `**Conclusion:** ${question.explanation.conclusion}`, '', '---', '');
  });
  return `${lines.join('\n').trim()}\n`;
}
