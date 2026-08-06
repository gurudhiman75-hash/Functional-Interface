import {
  remediateSerCp007DistractorsV7,
  type SerCp007DistractorQuestionLike,
} from "./distractor-remediation-v7";

function answerLetterCount(answer: string): number {
  return [...answer].filter((character) => /[A-Za-z]/.test(character)).length;
}

export function remediateSerCp007DistractorsV7Safe<
  T extends SerCp007DistractorQuestionLike,
>(question: T): T {
  // A one-letter answer has no meaningful distinction between a local letter
  // alternative and a whole-answer Caesar shift. Preserve its existing options.
  if (answerLetterCount(question.correctAnswer) < 2) return question;
  return remediateSerCp007DistractorsV7(question);
}
