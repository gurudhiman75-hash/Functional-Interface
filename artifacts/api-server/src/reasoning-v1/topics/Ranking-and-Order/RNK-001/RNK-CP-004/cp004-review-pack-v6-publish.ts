import {
  generateRnkCp004ExamReadyQuestion,
  type RnkCp004ExamReadyQuestion,
} from './cp004-exam-ready-v12';
import {
  buildRnkCp004ReviewPackV6Final,
  renderRnkCp004QuestionsAndExplanationsMarkdownV6,
} from './cp004-review-pack-v6-final';

export { renderRnkCp004QuestionsAndExplanationsMarkdownV6 };

export function buildRnkCp004ReviewPackV6Publish(): readonly RnkCp004ExamReadyQuestion[] {
  return buildRnkCp004ReviewPackV6Final().map((question) =>
    generateRnkCp004ExamReadyQuestion(
      question.prototypeId,
      question.seed,
      question.correctIndex,
    ));
}
