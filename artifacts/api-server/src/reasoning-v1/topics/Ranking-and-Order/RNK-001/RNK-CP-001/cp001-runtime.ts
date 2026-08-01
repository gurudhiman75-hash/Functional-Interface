import {
  generateRnkCp001Question as generateFoundationQuestion,
  type RnkCp001PrototypeId,
  type RnkCp001Question,
} from './cp001-foundation';

export * from './cp001-foundation';

function naturalizeCountAgreement(stem: string): string {
  return stem
    .replace(/^0 people are /, 'No one is ')
    .replace(/^1 people are /, 'One person is ')
    .replace(/, and 0 people are /, ', and no one is ')
    .replace(/, and 1 people are /, ', and one person is ');
}

export function generateRnkCp001Question(
  prototypeId: RnkCp001PrototypeId,
  seed: number,
): RnkCp001Question {
  const question = generateFoundationQuestion(prototypeId, seed);
  const stem = naturalizeCountAgreement(question.stem);
  return stem === question.stem ? question : { ...question, stem };
}
