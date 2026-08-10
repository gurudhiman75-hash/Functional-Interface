import {
  generateSerCp007WaveDExamReadyQuestion,
} from "./foundation-exam-ready";
import type {
  SerCp007WaveDQuestion,
  SerCp007WaveDTemporaryTemplateId,
} from "./foundation";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DETERMINATE_INSERTION_RULES = new Set([
  "CENTER_INSERTION_GROWTH",
  "ALTERNATING_INTERIOR_INSERTION_GROWTH",
]);

function mod(value: number, base: number): number {
  return ((value % base) + base) % base;
}

function letterAt(position: number): string {
  return ALPHABET[mod(position, 26)]!;
}

function positionOf(letter: string): number {
  const position = ALPHABET.indexOf(letter.toUpperCase());
  if (position < 0) throw new Error(`Invalid insertion letter ${letter}.`);
  return position;
}

function insertAt(token: string, index: number, letter: string): string {
  return token.slice(0, index) + letter + token.slice(index);
}

function templateNumber(templateId: string): number {
  const match = templateId.match(/(\d+)$/);
  return match ? Number(match[1]) : templateId.length;
}

function mutateToken(token: string, salt: number): string {
  const characters = [...token];
  const index = mod(salt, characters.length);
  characters[index] = letterAt(positionOf(characters[index]!) + 1 + mod(salt, 3));
  return characters.join("");
}

function stemFor(
  taskKind: SerCp007WaveDQuestion["taskKind"],
  sequence: readonly (string | null)[],
): string {
  const rendered = sequence.map((term) => term ?? "?").join(", ");
  switch (taskKind) {
    case "NEXT_TERM":
      return `Which letter group should come next?\n${rendered}, ?`;
    case "MISSING_TERM":
      return `Which letter group should replace the question mark?\n${rendered}`;
    case "PREVIOUS_TERM":
      return `Which letter group should come immediately before the first given term?\n?, ${rendered}`;
    case "WRONG_TERM":
      return `Which letter group should replace the incorrect term?\n${rendered}`;
  }
}

function deterministicLetters(
  templateId: string,
  seed: number,
): { readonly start: number; readonly step: number; readonly letters: readonly string[] } {
  const number = templateNumber(templateId);
  const start = mod(seed * 7 + number * 11, 26);
  const steps = [2, 3, 4, 5] as const;
  const step = steps[mod(seed + number, steps.length)]!;
  return {
    start,
    step,
    letters: Array.from({ length: 7 }, (_, index) =>
      letterAt(start + step * index),
    ),
  };
}

function rebuildTerms(
  core: string,
  insertionIndexes: readonly number[],
  insertedLetters: readonly string[],
): readonly string[] {
  if (insertionIndexes.length < 7) {
    throw new Error("Expected seven insertion indexes for V6 remediation.");
  }
  const terms: string[] = [core];
  for (let index = 0; index < 7; index += 1) {
    terms.push(
      insertAt(
        terms[index]!,
        insertionIndexes[index]!,
        insertedLetters[index]!,
      ),
    );
  }
  return terms;
}

function layoutFor(
  question: SerCp007WaveDQuestion,
  terms: readonly string[],
): {
  readonly sequence: readonly (string | null)[];
  readonly answerIndex: number;
  readonly corruptedIndex: number | null;
  readonly displayedWrongTerm: string | null;
} {
  const displayLength = terms.length - 1;
  switch (question.taskKind) {
    case "NEXT_TERM":
      return {
        sequence: terms.slice(0, displayLength),
        answerIndex: displayLength,
        corruptedIndex: null,
        displayedWrongTerm: null,
      };
    case "MISSING_TERM": {
      const answerIndex = question.hiddenState.answerIndex;
      return {
        sequence: terms.slice(0, displayLength).map((term, index) =>
          index === answerIndex ? null : term,
        ),
        answerIndex,
        corruptedIndex: null,
        displayedWrongTerm: null,
      };
    }
    case "PREVIOUS_TERM":
      return {
        sequence: terms.slice(1),
        answerIndex: 0,
        corruptedIndex: null,
        displayedWrongTerm: null,
      };
    case "WRONG_TERM": {
      const corruptedIndex = question.hiddenState.corruptedIndex ?? 2;
      const displayed = [...terms.slice(0, displayLength)];
      let displayedWrongTerm = mutateToken(
        displayed[corruptedIndex]!,
        question.seed + corruptedIndex,
      );
      let salt = question.seed + corruptedIndex + 13;
      while (displayed.includes(displayedWrongTerm)) {
        displayedWrongTerm = mutateToken(displayed[corruptedIndex]!, salt);
        salt += 1;
      }
      displayed[corruptedIndex] = displayedWrongTerm;
      return {
        sequence: displayed,
        answerIndex: corruptedIndex,
        corruptedIndex,
        displayedWrongTerm,
      };
    }
  }
}

function replaceAt(value: string, index: number, character: string): string {
  return value.slice(0, index) + character + value.slice(index + 1);
}

function insertionDistractors(
  correctAnswer: string,
  answerIndex: number,
  terms: readonly string[],
  insertionIndexes: readonly number[],
  insertedLetters: readonly string[],
  correctIndex: number,
  salt: number,
): readonly string[] {
  const pool: string[] = [];
  if (answerIndex > 0) {
    const previous = terms[answerIndex - 1]!;
    const insertionIndex = insertionIndexes[answerIndex - 1]!;
    const correctLetter = insertedLetters[answerIndex - 1]!;
    const wrongLetter = letterAt(positionOf(correctLetter) + 1);
    pool.push(insertAt(previous, insertionIndex, wrongLetter));
    const adjacent = Math.min(previous.length, insertionIndex + 1);
    pool.push(insertAt(previous, adjacent, correctLetter));
    if (answerIndex > 1) {
      pool.push(
        insertAt(
          previous,
          insertionIndex,
          insertedLetters[answerIndex - 2]!,
        ),
      );
    }
  } else if (terms[1]) {
    const next = terms[1]!;
    const insertionIndex = insertionIndexes[0]!;
    pool.push(next.slice(0, insertionIndex) + next.slice(insertionIndex + 1));
    if (insertionIndex > 0) {
      pool.push(next.slice(0, insertionIndex - 1) + next.slice(insertionIndex));
    }
    if (insertionIndex + 1 < next.length) {
      pool.push(next.slice(0, insertionIndex + 1) + next.slice(insertionIndex + 2));
    }
  }
  pool.push(mutateToken(correctAnswer, salt));
  pool.push(mutateToken(correctAnswer, salt + 7));
  pool.push(replaceAt(correctAnswer, mod(salt, correctAnswer.length), letterAt(salt)));

  const distractors = [...new Set(pool)].filter(
    (candidate) => candidate && candidate !== correctAnswer,
  );
  let cursor = salt + 17;
  while (distractors.length < 3) {
    const candidate = mutateToken(correctAnswer, cursor);
    cursor += 1;
    if (candidate !== correctAnswer && !distractors.includes(candidate)) {
      distractors.push(candidate);
    }
  }
  const options = distractors.slice(0, 3);
  options.splice(correctIndex, 0, correctAnswer);
  return options;
}

export function generateSerCp007WaveDDeterminateQuestionV6(
  temporaryTemplateId: SerCp007WaveDTemporaryTemplateId,
  seed: number,
): SerCp007WaveDQuestion {
  const original = generateSerCp007WaveDExamReadyQuestion(
    temporaryTemplateId,
    seed,
  );
  if (!DETERMINATE_INSERTION_RULES.has(original.sourceRuleId)) {
    return original;
  }

  const insertionIndexes = original.hiddenState.insertionIndexes;
  const { start, step, letters: insertedLetters } = deterministicLetters(
    temporaryTemplateId,
    seed,
  );
  const core = original.hiddenState.canonicalTerms[0]!;
  const terms = rebuildTerms(core, insertionIndexes, insertedLetters);
  const layout = layoutFor(original, terms);
  const correctAnswer = terms[layout.answerIndex]!;
  const sideRule =
    original.sourceRuleId === "CENTER_INSERTION_GROWTH"
      ? "Insert the new letter at the centre each time."
      : "Insert just left of the centre, then just right of the centre, and repeat.";
  const letterSequence = insertedLetters.join(" → ");
  const normalSteps = terms.slice(0, -1).map(
    (term, index) =>
      `${term} + insert ${insertedLetters[index]} at place ${insertionIndexes[index]! + 1} = ${terms[index + 1]}.`,
  );
  const conclusion =
    original.taskKind === "WRONG_TERM"
      ? `${layout.displayedWrongTerm} is incorrect. The determinate insertion rule gives ${correctAnswer}.`
      : `Therefore, the required group is ${correctAnswer}.`;

  return {
    ...original,
    difficulty: "MEDIUM",
    stem: stemFor(original.taskKind, layout.sequence),
    sequence: layout.sequence,
    options: insertionDistractors(
      correctAnswer,
      layout.answerIndex,
      terms,
      insertionIndexes,
      insertedLetters,
      original.correctIndex,
      seed + templateNumber(temporaryTemplateId) * 29,
    ),
    correctAnswer,
    mathematicalFingerprint: [
      original.canonicalAuthorityId,
      original.sourceRuleId,
      "DETERMINATE_INSERTION_V6",
      core,
      start,
      step,
      insertionIndexes.join("."),
      original.taskKind,
      layout.answerIndex,
      layout.corruptedIndex ?? "clean",
    ].join("|"),
    explanation: {
      rule: `Keep all existing letters in the same order. ${sideRule} The inserted letters follow a fixed +${step} alphabet progression: ${letterSequence}.`,
      steps: normalSteps,
      quickMethod: `First locate the insertion place. Then continue the inserted-letter sequence by +${step}; neither part may be guessed independently.`,
      commonMistake: `Position alone is not enough. The next inserted letter must also follow the +${step} sequence.`,
      trapCode: "ARBITRARY_INSERTION_LETTERS_REMOVED_V6",
      conclusion,
    },
    hiddenState: {
      ...original.hiddenState,
      parameterKey: `${core}|insert-start:${start}|insert-step:${step}|indexes:${insertionIndexes.join(".")}|v6`,
      canonicalTerms: terms,
      answerIndex: layout.answerIndex,
      corruptedIndex: layout.corruptedIndex,
      displayedWrongTerm: layout.displayedWrongTerm,
      insertionIndexes,
      insertedLetters,
    },
  };
}

export const SER_CP007_WAVE_D_V6_DETERMINATE_RULE_IDS = [
  ...DETERMINATE_INSERTION_RULES,
] as const;
