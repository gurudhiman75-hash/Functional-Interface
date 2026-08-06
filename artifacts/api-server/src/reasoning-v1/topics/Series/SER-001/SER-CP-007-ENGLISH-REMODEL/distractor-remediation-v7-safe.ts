import {
  isUniformWholeAnswerShiftV7,
  remediateSerCp007DistractorsV7,
  type SerCp007DistractorQuestionLike,
} from "./distractor-remediation-v7";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function answerLetterCount(answer: string): number {
  return [...answer].filter((character) => /[A-Za-z]/.test(character)).length;
}

function mod(value: number, base: number): number {
  return ((value % base) + base) % base;
}

function shiftCharacter(character: string, amount: number): string {
  const index = ALPHABET.indexOf(character.toUpperCase());
  if (index < 0) return character;
  const shifted = ALPHABET[mod(index + amount, 26)]!;
  return character === character.toLowerCase() ? shifted.toLowerCase() : shifted;
}

function robustLocalOptions<T extends SerCp007DistractorQuestionLike>(
  question: T,
): T {
  const answer = question.correctAnswer;
  const letterPositions = [...answer]
    .map((character, index) => (/[A-Za-z]/.test(character) ? index : -1))
    .filter((index) => index >= 0);
  const candidates: string[] = [];
  const amounts = [1, -1, 2, -2, 3, -3] as const;

  for (const position of letterPositions) {
    for (const amount of amounts) {
      const characters = [...answer];
      characters[position] = shiftCharacter(characters[position]!, amount);
      const candidate = characters.join("");
      if (
        candidate !== answer &&
        !candidates.includes(candidate) &&
        !isUniformWholeAnswerShiftV7(candidate, answer)
      ) {
        candidates.push(candidate);
      }
    }
  }

  if (letterPositions.length >= 2) {
    for (let index = 0; index < letterPositions.length - 1; index += 1) {
      const characters = [...answer];
      const left = letterPositions[index]!;
      const right = letterPositions[index + 1]!;
      [characters[left], characters[right]] = [
        characters[right]!,
        characters[left]!,
      ];
      const candidate = characters.join("");
      if (
        candidate !== answer &&
        !candidates.includes(candidate) &&
        !isUniformWholeAnswerShiftV7(candidate, answer)
      ) {
        candidates.push(candidate);
      }
    }
  }

  if (candidates.length < 3) {
    throw new Error(
      `Unable to build three safe V7 distractors for ${question.temporaryTemplateId}:${question.seed}`,
    );
  }
  const options = candidates.slice(0, 3);
  options.splice(question.correctIndex, 0, answer);
  return { ...question, options };
}

export function remediateSerCp007DistractorsV7Safe<
  T extends SerCp007DistractorQuestionLike,
>(question: T): T {
  // A one-letter answer has no meaningful distinction between a local letter
  // alternative and a whole-answer Caesar shift. Preserve its existing options.
  if (answerLetterCount(question.correctAnswer) < 2) return question;
  try {
    return remediateSerCp007DistractorsV7(question);
  } catch {
    return robustLocalOptions(question);
  }
}
