import {
  isUniformWholeAnswerShiftV7,
  type SerCp007DistractorQuestionLike,
} from "./distractor-remediation-v7";
import { remediateSerCp007DistractorsV7Safe } from "./distractor-remediation-v7-safe";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function mod(value: number, base: number): number {
  return ((value % base) + base) % base;
}

function shiftLetter(character: string, amount: number): string {
  const index = ALPHABET.indexOf(character.toUpperCase());
  if (index < 0) return character;
  const shifted = ALPHABET[mod(index + amount, 26)]!;
  return character === character.toLowerCase() ? shifted.toLowerCase() : shifted;
}

function answerIndex(question: SerCp007DistractorQuestionLike): number | null {
  if (typeof question.hiddenState?.answerIndex === "number") {
    return question.hiddenState.answerIndex;
  }
  if (question.hiddenState?.answerIndexes?.length) {
    return question.hiddenState.answerIndexes[0] ?? null;
  }
  return null;
}

function unique(values: readonly string[], answer: string): readonly string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))]
    .filter((value) => value !== answer)
    .filter((value) => !isUniformWholeAnswerShiftV7(value, answer));
}

function cumulativePrefixCandidates(
  question: SerCp007DistractorQuestionLike,
): readonly string[] {
  if (question.sourceRuleId !== "CUMULATIVE_PREFIX_GROWTH") return [];
  const terms = question.hiddenState?.canonicalTerms ?? [];
  const index = answerIndex(question);
  const answer = question.correctAnswer;
  if (index === null || index <= 0 || !terms[index - 1]) return [];

  const previous = terms[index - 1]!;
  if (!answer.startsWith(previous) || answer.length <= previous.length) return [];
  const appended = answer.slice(previous.length);
  const nextAppend = [...appended].map((letter) => shiftLetter(letter, 1)).join("");
  const previousAppend = [...appended].map((letter) => shiftLetter(letter, -1)).join("");
  const transposeLastTwo =
    answer.length >= 2
      ? answer.slice(0, -2) + answer.at(-1)! + answer.at(-2)!
      : answer;
  const omitPreviousFinal =
    previous.length >= 2 ? previous.slice(0, -1) + appended : answer;
  const insertBeforePreviousFinal =
    previous.length >= 1
      ? previous.slice(0, -1) + appended + previous.at(-1)!
      : answer;

  return unique(
    [
      previous + nextAppend,
      previous + previousAppend,
      transposeLastTwo,
      omitPreviousFinal,
      insertBeforePreviousFinal,
    ],
    answer,
  );
}

function withOptions<T extends SerCp007DistractorQuestionLike>(
  question: T,
  distractors: readonly string[],
): T {
  if (distractors.length < 3) return remediateSerCp007DistractorsV7Safe(question);
  const options = [...distractors.slice(0, 3)];
  options.splice(question.correctIndex, 0, question.correctAnswer);
  return { ...question, options };
}

export function remediateSerCp007DistractorsV71<
  T extends SerCp007DistractorQuestionLike,
>(question: T): T {
  const cumulative = cumulativePrefixCandidates(question);
  if (cumulative.length >= 3) return withOptions(question, cumulative);
  return remediateSerCp007DistractorsV7Safe(question);
}
