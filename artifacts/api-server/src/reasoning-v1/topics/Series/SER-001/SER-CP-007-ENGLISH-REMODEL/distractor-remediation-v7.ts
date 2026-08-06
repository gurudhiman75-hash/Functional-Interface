const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export interface SerCp007DistractorQuestionLike {
  readonly temporaryTemplateId: string;
  readonly sourceRuleId: string;
  readonly taskKind: string;
  readonly seed: number;
  readonly options: readonly string[];
  readonly correctAnswer: string;
  readonly correctIndex: number;
  readonly hiddenState?: {
    readonly canonicalTerms?: readonly string[];
    readonly answerIndex?: number;
    readonly answerIndexes?: readonly number[];
    readonly insertedLetters?: readonly string[];
    readonly insertionIndexes?: readonly number[];
  };
}

function mod(value: number, base: number): number {
  return ((value % base) + base) % base;
}

function letterIndex(character: string): number {
  return ALPHABET.indexOf(character.toUpperCase());
}

function shiftCharacter(character: string, amount: number): string {
  const index = letterIndex(character);
  if (index < 0) return character;
  const shifted = ALPHABET[mod(index + amount, 26)]!;
  return character === character.toLowerCase() ? shifted.toLowerCase() : shifted;
}

function signedSmallStep(from: string, to: string): number {
  const left = letterIndex(from);
  const right = letterIndex(to);
  if (left < 0 || right < 0) return 0;
  let delta = right - left;
  if (delta > 13) delta -= 26;
  if (delta < -13) delta += 26;
  return delta;
}

export function isUniformWholeAnswerShiftV7(
  candidate: string,
  answer: string,
): boolean {
  if (candidate.length !== answer.length) return false;
  const deltas: number[] = [];
  for (let index = 0; index < answer.length; index += 1) {
    const expected = answer[index]!;
    const actual = candidate[index]!;
    const expectedIndex = letterIndex(expected);
    const actualIndex = letterIndex(actual);
    if (expectedIndex < 0 || actualIndex < 0) {
      if (expected !== actual) return false;
      continue;
    }
    deltas.push(mod(actualIndex - expectedIndex, 26));
  }
  return deltas.length >= 2 && new Set(deltas).size === 1 && deltas[0] !== 0;
}

function answerIndexes(
  question: SerCp007DistractorQuestionLike,
): readonly number[] {
  const state = question.hiddenState;
  if (state?.answerIndexes?.length) return state.answerIndexes;
  if (typeof state?.answerIndex === "number") return [state.answerIndex];
  const terms = state?.canonicalTerms ?? [];
  return question.correctAnswer
    .split(/,|→/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => terms.indexOf(part))
    .filter((index) => index >= 0);
}

function interleavedRowCount(sourceRuleId: string): number | null {
  switch (sourceRuleId) {
    case "TWO_INTERLEAVED_CLUSTER_ROWS":
    case "ALTERNATING_FRAME_CORE_ROWS":
    case "NEXT_TWO_INTERLEAVED_ROWS":
      return 2;
    case "THREE_INTERLEAVED_CLUSTER_ROWS":
      return 3;
    case "FOUR_INTERLEAVED_CLUSTER_ROWS":
      return 4;
    default:
      return null;
  }
}

function rowIndexes(
  termCount: number,
  rowIndex: number,
  rowCount: number,
): readonly number[] {
  const indexes: number[] = [];
  for (let index = rowIndex; index < termCount; index += rowCount) {
    indexes.push(index);
  }
  return indexes;
}

function stepVector(from: string, to: string): readonly number[] {
  if (from.length !== to.length) return [];
  return [...from].map((character, index) =>
    signedSmallStep(character, to[index]!),
  );
}

function applyStep(token: string, steps: readonly number[]): string {
  if (token.length !== steps.length) return token;
  return [...token]
    .map((character, index) => shiftCharacter(character, steps[index]!))
    .join("");
}

function interleavedWrongTerms(
  question: SerCp007DistractorQuestionLike,
  answerIndex: number,
): readonly string[] {
  const terms = question.hiddenState?.canonicalTerms ?? [];
  const rowCount = interleavedRowCount(question.sourceRuleId);
  if (!rowCount || terms.length === 0 || !terms[answerIndex]) return [];
  const targetRow = mod(answerIndex, rowCount);
  const targetIndexes = rowIndexes(terms.length, targetRow, rowCount);
  const localIndex = targetIndexes.indexOf(answerIndex);
  if (localIndex < 0) return [];
  const previousIndex =
    localIndex > 0 ? targetIndexes[localIndex - 1]! : targetIndexes[0]!;
  const previous = terms[previousIndex]!;

  const targetStep =
    localIndex >= 2
      ? stepVector(
          terms[targetIndexes[localIndex - 2]!]!,
          terms[targetIndexes[localIndex - 1]!]!,
        )
      : targetIndexes.length >= 2
        ? stepVector(terms[targetIndexes[0]!]!, terms[targetIndexes[1]!]!)
        : [];
  if (targetStep.length === 0) return [];

  const otherRow = mod(targetRow + 1, rowCount);
  const otherIndexes = rowIndexes(terms.length, otherRow, rowCount);
  const otherStep =
    otherIndexes.length >= 2
      ? stepVector(terms[otherIndexes[0]!]!, terms[otherIndexes[1]!]!)
      : targetStep;
  const swapped = [...targetStep];
  if (swapped.length > 1) {
    [swapped[0], swapped[1]] = [swapped[1]!, swapped[0]!];
  }
  const reversedOne = [...targetStep];
  reversedOne[0] = -(reversedOne[0] ?? 0) || 1;

  return [
    applyStep(previous, otherStep),
    applyStep(previous, swapped),
    applyStep(previous, reversedOne),
  ];
}

function splitAnswer(answer: string): {
  readonly parts: readonly string[];
  readonly delimiter: string;
} {
  if (answer.includes("→")) {
    return {
      parts: answer.split("→").map((part) => part.trim()),
      delimiter: " → ",
    };
  }
  if (answer.includes(",")) {
    return {
      parts: answer.split(",").map((part) => part.trim()),
      delimiter: ", ",
    };
  }
  return { parts: [answer], delimiter: "" };
}

function interleavedCandidates(
  question: SerCp007DistractorQuestionLike,
): readonly string[] {
  const indexes = answerIndexes(question);
  const { parts, delimiter } = splitAnswer(question.correctAnswer);
  if (indexes.length === 0 || parts.length === 0) return [];
  const wrongByPart = indexes.map((index) => interleavedWrongTerms(question, index));
  if (parts.length === 1) return wrongByPart[0] ?? [];

  const output: string[] = [];
  if (parts.length === 2) {
    output.push([parts[1]!, parts[0]!].join(delimiter));
    const firstWrong = wrongByPart[0]?.[0];
    const secondWrong = wrongByPart[1]?.[0];
    if (firstWrong) output.push([firstWrong, parts[1]!].join(delimiter));
    if (secondWrong) output.push([parts[0]!, secondWrong].join(delimiter));
    if (firstWrong && secondWrong) {
      output.push([firstWrong, secondWrong].join(delimiter));
    }
  }
  return output;
}

function replaceAt(value: string, index: number, character: string): string {
  if (index < 0 || index >= value.length) return value;
  return value.slice(0, index) + character + value.slice(index + 1);
}

function moveCharacter(
  value: string,
  fromIndex: number,
  toIndex: number,
): string {
  if (
    fromIndex < 0 ||
    fromIndex >= value.length ||
    toIndex < 0 ||
    toIndex >= value.length
  ) {
    return value;
  }
  const character = value[fromIndex]!;
  const without = value.slice(0, fromIndex) + value.slice(fromIndex + 1);
  const safeTarget = toIndex > fromIndex ? toIndex - 1 : toIndex;
  return without.slice(0, safeTarget) + character + without.slice(safeTarget);
}

function insertionCandidates(
  question: SerCp007DistractorQuestionLike,
): readonly string[] {
  if (
    question.sourceRuleId !== "CENTER_INSERTION_GROWTH" &&
    question.sourceRuleId !== "ALTERNATING_INTERIOR_INSERTION_GROWTH"
  ) {
    return [];
  }
  const state = question.hiddenState;
  const indexes = answerIndexes(question);
  const answerIndex = indexes[0];
  if (
    answerIndex === undefined ||
    answerIndex < 1 ||
    !state?.insertedLetters?.length ||
    !state.insertionIndexes?.length
  ) {
    return [];
  }
  const insertionStepIndex = answerIndex - 1;
  const insertionIndex = state.insertionIndexes[insertionStepIndex];
  const inserted = state.insertedLetters[insertionStepIndex];
  if (insertionIndex === undefined || !inserted) return [];
  const answer = question.correctAnswer;
  const left = moveCharacter(answer, insertionIndex, Math.max(0, insertionIndex - 1));
  const right = moveCharacter(
    answer,
    insertionIndex,
    Math.min(answer.length - 1, insertionIndex + 2),
  );
  const previousLetter =
    state.insertedLetters[insertionStepIndex - 1] ?? shiftCharacter(inserted, -1);
  const nextLetter =
    state.insertedLetters[insertionStepIndex + 1] ?? shiftCharacter(inserted, 1);
  return [
    left,
    right,
    replaceAt(answer, insertionIndex, previousLetter),
    replaceAt(answer, insertionIndex, nextLetter),
  ];
}

function markerCandidates(
  question: SerCp007DistractorQuestionLike,
): readonly string[] {
  if (question.sourceRuleId !== "UNIFORM_FRAME_CASE_MARKER_ROTATION") return [];
  const answer = question.correctAnswer;
  const markerIndex = [...answer].findIndex((character) => /[a-z]/.test(character));
  if (markerIndex < 0) return [];
  const background = answer[markerIndex]!.toUpperCase();
  const make = (position: number, duplicate = false): string =>
    [...answer]
      .map((character, index) => {
        if (index === markerIndex && !duplicate) return background;
        if (index === mod(position, answer.length)) return background.toLowerCase();
        return character.toUpperCase();
      })
      .join("");
  return [
    make(markerIndex - 1),
    make(markerIndex + 1),
    make(markerIndex + 1, true),
    make(markerIndex + 2),
  ];
}

function deletionCandidates(
  question: SerCp007DistractorQuestionLike,
): readonly string[] {
  const deletionRules = new Set([
    "FIXED_FRONT_DELETION",
    "FIXED_END_DELETION",
    "ALTERNATING_EDGE_DELETION",
  ]);
  if (!deletionRules.has(question.sourceRuleId)) return [];
  const terms = question.hiddenState?.canonicalTerms ?? [];
  const answerIndex = answerIndexes(question)[0];
  if (answerIndex === undefined || answerIndex < 1 || !terms[answerIndex - 1]) {
    return [];
  }
  const previous = terms[answerIndex - 1]!;
  const correct = question.correctAnswer;
  const opposite =
    correct === previous.slice(1) ? previous.slice(0, -1) : previous.slice(1);
  const twoFromFront = previous.slice(Math.min(2, previous.length - 1));
  const twoFromEnd = previous.slice(0, Math.max(1, previous.length - 2));
  const internalIndex = Math.max(1, Math.floor(previous.length / 2));
  const internal = previous.slice(0, internalIndex) + previous.slice(internalIndex + 1);
  return [opposite, twoFromFront, twoFromEnd, internal];
}

function mutateOneLetter(value: string, salt: number): string {
  const letterPositions = [...value]
    .map((character, index) => (letterIndex(character) >= 0 ? index : -1))
    .filter((index) => index >= 0);
  if (letterPositions.length === 0) return value + "A";
  const position = letterPositions[mod(salt, letterPositions.length)]!;
  const amount = salt % 2 === 0 ? 1 : -1;
  return replaceAt(value, position, shiftCharacter(value[position]!, amount));
}

function swapAdjacentLetters(value: string, salt: number): string {
  const positions = [...value]
    .map((character, index) => (letterIndex(character) >= 0 ? index : -1))
    .filter((index) => index >= 0);
  if (positions.length < 2) return mutateOneLetter(value, salt);
  const pair = mod(salt, positions.length - 1);
  const left = positions[pair]!;
  const right = positions[pair + 1]!;
  const output = [...value];
  [output[left], output[right]] = [output[right]!, output[left]!];
  return output.join("");
}

function uniqueCandidates(
  candidates: readonly string[],
  answer: string,
): string[] {
  return [...new Set(candidates.map((candidate) => candidate.trim()).filter(Boolean))]
    .filter((candidate) => candidate !== answer)
    .filter((candidate) => !isUniformWholeAnswerShiftV7(candidate, answer));
}

export function remediateSerCp007DistractorsV7<
  T extends SerCp007DistractorQuestionLike,
>(question: T): T {
  const rowCount = interleavedRowCount(question.sourceRuleId);
  const ruleSpecific = [
    ...(rowCount ? interleavedCandidates(question) : []),
    ...insertionCandidates(question),
    ...markerCandidates(question),
    ...deletionCandidates(question),
  ];
  const retained = question.options.filter(
    (option) =>
      option !== question.correctAnswer &&
      !isUniformWholeAnswerShiftV7(option, question.correctAnswer),
  );
  const candidates = uniqueCandidates(
    [...ruleSpecific, ...retained],
    question.correctAnswer,
  );

  let salt = question.seed + question.temporaryTemplateId.length;
  while (candidates.length < 3 && salt < 500) {
    const candidate =
      salt % 2 === 0
        ? mutateOneLetter(question.correctAnswer, salt)
        : swapAdjacentLetters(question.correctAnswer, salt);
    if (
      candidate !== question.correctAnswer &&
      !candidates.includes(candidate) &&
      !isUniformWholeAnswerShiftV7(candidate, question.correctAnswer)
    ) {
      candidates.push(candidate);
    }
    salt += 1;
  }
  if (candidates.length < 3) {
    throw new Error(
      `Unable to build three V7 distractors for ${question.temporaryTemplateId}:${question.seed}`,
    );
  }

  const options = candidates.slice(0, 3);
  options.splice(question.correctIndex, 0, question.correctAnswer);
  return { ...question, options };
}
