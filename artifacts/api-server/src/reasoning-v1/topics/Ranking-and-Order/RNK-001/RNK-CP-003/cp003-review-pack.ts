import { RNK_CP003_PROTOTYPE_IDS, type RnkCp003Question } from './cp003-model';
import { generateRnkCp003Question } from './cp003-foundation';

const REVIEW_SEEDS = [0, 1, 2, 7, 31, 97] as const;

export function buildRnkCp003ReviewPack(): readonly RnkCp003Question[] {
  return RNK_CP003_PROTOTYPE_IDS.flatMap((prototypeId) =>
    REVIEW_SEEDS.map((seed) => generateRnkCp003Question(prototypeId, seed)),
  );
}

export function renderRnkCp003QuestionsAndExplanationsMarkdown(
  questions: readonly RnkCp003Question[],
): string {
  const lines: string[] = ['# RNK-CP-003 Questions and Explanations', ''];
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
    lines.push('', `**Conclusion:** ${question.explanation.conclusion}`, '', '---', '');
  });
  return `${lines.join('\n').trim()}\n`;
}
