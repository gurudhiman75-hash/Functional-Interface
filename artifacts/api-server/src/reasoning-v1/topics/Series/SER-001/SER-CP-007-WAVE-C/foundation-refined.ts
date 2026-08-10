export * from "./foundation";

import {
  generateSerCp007WaveCQuestion as generateBaseQuestion,
  type SerCp007WaveCQuestion,
  type SerCp007WaveCTemporaryTemplateId,
} from "./foundation";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function positionOf(letter: string): number {
  const position = ALPHABET.indexOf(letter);
  if (position < 0) throw new Error(`Invalid letter ${letter}`);
  return position;
}

function letterAt(position: number): string {
  return ALPHABET[((position % 26) + 26) % 26]!;
}

function shift(value: string, amount: number): string {
  return [...value]
    .map((letter) => letterAt(positionOf(letter) + amount))
    .join("");
}

function mutate(value: string, seed: number): string {
  const letters = [...value];
  const index = seed % letters.length;
  letters[index] = letterAt(positionOf(letters[index]!) + 1 + (seed % 3));
  return letters.join("");
}

function refineWrongReplacement(
  question: SerCp007WaveCQuestion,
): SerCp007WaveCQuestion {
  if (question.taskKind !== "WRONG_AND_REPLACEMENT") return question;

  const wrong = question.hiddenState.displayedWrongTerm;
  if (!wrong) throw new Error("Wrong/replacement question is missing its displayed wrong term.");
  const correctReplacement = question.hiddenState.canonicalTerms[
    question.hiddenState.answerIndexes[0]!
  ]!;

  const candidates = [
    correctReplacement,
    mutate(correctReplacement, question.seed + 3),
    shift(correctReplacement, 1),
    shift(correctReplacement, -1),
    mutate(correctReplacement, question.seed + 11),
  ];
  const replacements = [...new Set(candidates)].filter(
    (candidate) => candidate !== wrong,
  );
  let offset = 2;
  while (replacements.length < 4) {
    const candidate = shift(correctReplacement, offset);
    if (candidate !== wrong && !replacements.includes(candidate)) {
      replacements.push(candidate);
    }
    offset += 1;
  }

  const distractors = replacements
    .filter((candidate) => candidate !== correctReplacement)
    .slice(0, 3);
  const optionReplacements = [...distractors];
  optionReplacements.splice(question.correctIndex, 0, correctReplacement);
  const options = optionReplacements.map(
    (replacement) => `${wrong} → ${replacement}`,
  );

  return {
    ...question,
    options,
  };
}

export function generateSerCp007WaveCQuestion(
  temporaryTemplateId: SerCp007WaveCTemporaryTemplateId,
  seed: number,
): SerCp007WaveCQuestion {
  return refineWrongReplacement(
    generateBaseQuestion(temporaryTemplateId, seed),
  );
}
