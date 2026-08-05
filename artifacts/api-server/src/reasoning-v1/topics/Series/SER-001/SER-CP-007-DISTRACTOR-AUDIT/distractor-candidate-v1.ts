import {
  editorialTaskKindFor,
  proofModelFor,
  type SerCp007EditorialTaskKind,
  type SerCp007ProofModel,
} from "../SER-CP-007-ENGLISH-REMODEL/adaptive-review";

export type SerCp007DistractorRole =
  | "UNIFORM_SHIFT_FORWARD"
  | "UNIFORM_SHIFT_BACKWARD"
  | "SINGLE_POSITION_MUTATION"
  | "WHOLE_REVERSAL"
  | "CYCLIC_ROTATION_LEFT"
  | "CYCLIC_ROTATION_RIGHT"
  | "LENGTH_PLUS_ONE"
  | "LENGTH_MINUS_ONE"
  | "ORDERED_PAIR_SWAPPED"
  | "FIRST_COMPONENT_MUTATED"
  | "SECOND_COMPONENT_MUTATED"
  | "REPLACEMENT_SHIFT_FORWARD"
  | "REPLACEMENT_SHIFT_BACKWARD"
  | "REPLACEMENT_SINGLE_POSITION_MUTATION";

export interface SerCp007DistractorCandidateQuestion {
  readonly temporaryTemplateId: string;
  readonly canonicalAuthorityId: string;
  readonly taskKind: string;
  readonly seed: number;
  readonly correctAnswer: string;
  readonly correctIndex: number;
}

export interface SerCp007DistractorCandidateOption {
  readonly role: SerCp007DistractorRole;
  readonly value: string;
  readonly learnerCheck: string;
}

export interface SerCp007DistractorCandidateV1 {
  readonly editorialTaskKind: SerCp007EditorialTaskKind;
  readonly proofModel: SerCp007ProofModel;
  readonly options: readonly string[];
  readonly correctAnswer: string;
  readonly correctIndex: number;
  readonly distractors: readonly SerCp007DistractorCandidateOption[];
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const LEARNER_CHECKS: Readonly<Record<SerCp007DistractorRole, string>> = {
  UNIFORM_SHIFT_FORWARD:
    "This option moves every letter too far forward instead of using the required movement.",
  UNIFORM_SHIFT_BACKWARD:
    "This option moves every letter backward instead of using the required movement.",
  SINGLE_POSITION_MUTATION:
    "This option changes only one position and leaves the remaining rule incomplete.",
  WHOLE_REVERSAL:
    "This option reverses the whole group, which is not the required transformation.",
  CYCLIC_ROTATION_LEFT:
    "This option rotates the group one place to the left instead of following the required rule.",
  CYCLIC_ROTATION_RIGHT:
    "This option rotates the group one place to the right instead of following the required rule.",
  LENGTH_PLUS_ONE:
    "This option makes the group one letter too long.",
  LENGTH_MINUS_ONE:
    "This option makes the group one letter too short.",
  ORDERED_PAIR_SWAPPED:
    "This option contains the two required groups in the wrong order.",
  FIRST_COMPONENT_MUTATED:
    "The first answer group is altered even though the ordered pair requires the exact first group.",
  SECOND_COMPONENT_MUTATED:
    "The second answer group is altered even though the ordered pair requires the exact second group.",
  REPLACEMENT_SHIFT_FORWARD:
    "The wrong displayed group is identified correctly, but its replacement is shifted forward.",
  REPLACEMENT_SHIFT_BACKWARD:
    "The wrong displayed group is identified correctly, but its replacement is shifted backward.",
  REPLACEMENT_SINGLE_POSITION_MUTATION:
    "The wrong displayed group is identified correctly, but one letter of the replacement is changed.",
};

function shiftCharacter(character: string, amount: number): string {
  const upper = character.toUpperCase();
  const position = ALPHABET.indexOf(upper);
  if (position < 0) return character;
  const shifted = ALPHABET[((position + amount) % 26 + 26) % 26]!;
  return character === upper ? shifted : shifted.toLowerCase();
}

function shiftLetters(value: string, amount: number): string {
  return [...value].map((character) => shiftCharacter(character, amount)).join("");
}

function mutateOnePosition(value: string, salt: number): string {
  const characters = [...value];
  const letterIndexes = characters
    .map((character, index) =>
      ALPHABET.includes(character.toUpperCase()) ? index : -1,
    )
    .filter((index) => index >= 0);
  if (letterIndexes.length === 0) return `${value}X`;
  const selected = letterIndexes[salt % letterIndexes.length]!;
  characters[selected] = shiftCharacter(
    characters[selected]!,
    1 + (salt % 3),
  );
  return characters.join("");
}

function rotateLeft(value: string): string {
  return value.length <= 1 ? value : value.slice(1) + value[0];
}

function rotateRight(value: string): string {
  return value.length <= 1
    ? value
    : value.at(-1)! + value.slice(0, -1);
}

function lengthPlusOne(value: string): string {
  const lastLetter = [...value]
    .reverse()
    .find((character) => ALPHABET.includes(character.toUpperCase()));
  return value + (lastLetter ? shiftCharacter(lastLetter, 1) : "X");
}

function lengthMinusOne(value: string): string | null {
  if (value.length <= 1) return null;
  const characters = [...value];
  for (let index = characters.length - 1; index >= 0; index -= 1) {
    if (ALPHABET.includes(characters[index]!.toUpperCase())) {
      characters.splice(index, 1);
      const output = characters.join("");
      return output.length > 0 ? output : null;
    }
  }
  return null;
}

function splitAnswer(value: string): {
  readonly separator: "ARROW" | "COMMA" | "SINGLE";
  readonly units: readonly string[];
} {
  if (value.includes("→")) {
    return {
      separator: "ARROW",
      units: value.split("→").map((unit) => unit.trim()),
    };
  }
  if (value.includes(",")) {
    return {
      separator: "COMMA",
      units: value.split(",").map((unit) => unit.trim()),
    };
  }
  return { separator: "SINGLE", units: [value] };
}

function joinAnswer(
  separator: "ARROW" | "COMMA" | "SINGLE",
  units: readonly string[],
): string {
  if (separator === "ARROW") return units.join(" → ");
  if (separator === "COMMA") return units.join(", ");
  return units[0]!;
}

function option(
  role: SerCp007DistractorRole,
  value: string,
): SerCp007DistractorCandidateOption {
  return { role, value, learnerCheck: LEARNER_CHECKS[role] };
}

function singleUnitPool(
  correct: string,
  proofModel: SerCp007ProofModel,
  seed: number,
): readonly SerCp007DistractorCandidateOption[] {
  const common = [
    option("SINGLE_POSITION_MUTATION", mutateOnePosition(correct, seed)),
    option("UNIFORM_SHIFT_FORWARD", shiftLetters(correct, 1)),
    option("UNIFORM_SHIFT_BACKWARD", shiftLetters(correct, -1)),
    option("WHOLE_REVERSAL", [...correct].reverse().join("")),
    option("CYCLIC_ROTATION_LEFT", rotateLeft(correct)),
    option("CYCLIC_ROTATION_RIGHT", rotateRight(correct)),
  ];

  switch (proofModel) {
    case "DIRECT_COLUMN_MOVEMENT":
      return [common[1]!, common[2]!, common[0]!, ...common.slice(3)];
    case "INTERLEAVED_ROWS":
      return [common[0]!, common[1]!, common[3]!, ...common.slice(2)];
    case "POSITION_TRANSFORMATION":
      return [common[3]!, common[4]!, common[0]!, common[5]!, ...common.slice(1, 3)];
    case "LENGTH_OR_CONTENT_CHANGE": {
      const shorter = lengthMinusOne(correct);
      return [
        option("LENGTH_PLUS_ONE", lengthPlusOne(correct)),
        ...(shorter ? [option("LENGTH_MINUS_ONE", shorter)] : []),
        common[0]!,
        common[1]!,
        common[3]!,
      ];
    }
    case "CONTINUOUS_GAP_COMPLETION":
      return [common[3]!, common[0]!, common[1]!, common[2]!, common[4]!];
    case "MARKER_OR_BOUNDARY_MOVEMENT":
      return [common[4]!, common[5]!, common[0]!, common[1]!, common[2]!];
  }
}

function multiUnitPool(
  separator: "ARROW" | "COMMA",
  units: readonly string[],
  seed: number,
): readonly SerCp007DistractorCandidateOption[] {
  if (separator === "ARROW" && units.length === 2) {
    const left = units[0]!;
    const replacement = units[1]!;
    return [
      option(
        "REPLACEMENT_SHIFT_FORWARD",
        joinAnswer(separator, [left, shiftLetters(replacement, 1)]),
      ),
      option(
        "REPLACEMENT_SHIFT_BACKWARD",
        joinAnswer(separator, [left, shiftLetters(replacement, -1)]),
      ),
      option(
        "REPLACEMENT_SINGLE_POSITION_MUTATION",
        joinAnswer(separator, [left, mutateOnePosition(replacement, seed)]),
      ),
    ];
  }

  if (units.length >= 2) {
    const swapped = [...units];
    [swapped[0], swapped[1]] = [swapped[1]!, swapped[0]!];
    const firstWrong = [...units];
    firstWrong[0] = mutateOnePosition(firstWrong[0]!, seed);
    const secondWrong = [...units];
    secondWrong[1] = mutateOnePosition(secondWrong[1]!, seed + 1);
    return [
      option("ORDERED_PAIR_SWAPPED", joinAnswer(separator, swapped)),
      option("FIRST_COMPONENT_MUTATED", joinAnswer(separator, firstWrong)),
      option("SECOND_COMPONENT_MUTATED", joinAnswer(separator, secondWrong)),
    ];
  }

  return [];
}

function uniqueDistractors(
  correctAnswer: string,
  pool: readonly SerCp007DistractorCandidateOption[],
  seed: number,
): readonly SerCp007DistractorCandidateOption[] {
  const selected: SerCp007DistractorCandidateOption[] = [];
  const seen = new Set<string>([correctAnswer]);
  for (const candidate of pool) {
    if (candidate.value.length === 0 || seen.has(candidate.value)) continue;
    seen.add(candidate.value);
    selected.push(candidate);
    if (selected.length === 3) return selected;
  }

  let salt = seed + 17;
  while (selected.length < 3) {
    const fallback = option(
      "SINGLE_POSITION_MUTATION",
      mutateOnePosition(correctAnswer, salt),
    );
    salt += 1;
    if (seen.has(fallback.value)) continue;
    seen.add(fallback.value);
    selected.push(fallback);
  }
  return selected;
}

export function buildSerCp007DistractorCandidateV1(
  question: SerCp007DistractorCandidateQuestion,
): SerCp007DistractorCandidateV1 {
  const editorialTaskKind = editorialTaskKindFor(question.taskKind);
  const proofModel = proofModelFor(question.canonicalAuthorityId);
  const answer = splitAnswer(question.correctAnswer);
  const pool =
    answer.separator === "SINGLE"
      ? singleUnitPool(
          question.correctAnswer,
          proofModel,
          question.seed + question.temporaryTemplateId.length,
        )
      : multiUnitPool(
          answer.separator,
          answer.units,
          question.seed + question.temporaryTemplateId.length,
        );
  const distractors = uniqueDistractors(
    question.correctAnswer,
    pool,
    question.seed,
  );
  const options = distractors.map((entry) => entry.value);
  options.splice(question.correctIndex, 0, question.correctAnswer);
  return {
    editorialTaskKind,
    proofModel,
    options,
    correctAnswer: question.correctAnswer,
    correctIndex: question.correctIndex,
    distractors,
  };
}

function letterCount(value: string): number {
  return [...value].filter((character) =>
    ALPHABET.includes(character.toUpperCase()),
  ).length;
}

function differingPositions(left: string, right: string): number | null {
  if (left.length !== right.length) return null;
  let count = 0;
  for (let index = 0; index < left.length; index += 1) {
    if (left[index] !== right[index]) count += 1;
  }
  return count;
}

export function validateSerCp007DistractorRole(
  correctAnswer: string,
  candidate: SerCp007DistractorCandidateOption,
): boolean {
  const correct = splitAnswer(correctAnswer);
  const distractor = splitAnswer(candidate.value);

  switch (candidate.role) {
    case "UNIFORM_SHIFT_FORWARD":
      return candidate.value === shiftLetters(correctAnswer, 1);
    case "UNIFORM_SHIFT_BACKWARD":
      return candidate.value === shiftLetters(correctAnswer, -1);
    case "SINGLE_POSITION_MUTATION":
      return differingPositions(correctAnswer, candidate.value) === 1;
    case "WHOLE_REVERSAL":
      return candidate.value === [...correctAnswer].reverse().join("");
    case "CYCLIC_ROTATION_LEFT":
      return candidate.value === rotateLeft(correctAnswer);
    case "CYCLIC_ROTATION_RIGHT":
      return candidate.value === rotateRight(correctAnswer);
    case "LENGTH_PLUS_ONE":
      return letterCount(candidate.value) === letterCount(correctAnswer) + 1;
    case "LENGTH_MINUS_ONE":
      return letterCount(candidate.value) + 1 === letterCount(correctAnswer);
    case "ORDERED_PAIR_SWAPPED":
      return (
        correct.units.length >= 2 &&
        distractor.units.length === correct.units.length &&
        distractor.units[0] === correct.units[1] &&
        distractor.units[1] === correct.units[0]
      );
    case "FIRST_COMPONENT_MUTATED":
      return (
        correct.units.length === distractor.units.length &&
        correct.units[0] !== distractor.units[0] &&
        correct.units.slice(1).every((unit, index) =>
          unit === distractor.units[index + 1],
        )
      );
    case "SECOND_COMPONENT_MUTATED":
      return (
        correct.units.length === distractor.units.length &&
        correct.units[0] === distractor.units[0] &&
        correct.units[1] !== distractor.units[1] &&
        correct.units.slice(2).every((unit, index) =>
          unit === distractor.units[index + 2],
        )
      );
    case "REPLACEMENT_SHIFT_FORWARD":
      return (
        correct.separator === "ARROW" &&
        distractor.separator === "ARROW" &&
        correct.units[0] === distractor.units[0] &&
        distractor.units[1] === shiftLetters(correct.units[1]!, 1)
      );
    case "REPLACEMENT_SHIFT_BACKWARD":
      return (
        correct.separator === "ARROW" &&
        distractor.separator === "ARROW" &&
        correct.units[0] === distractor.units[0] &&
        distractor.units[1] === shiftLetters(correct.units[1]!, -1)
      );
    case "REPLACEMENT_SINGLE_POSITION_MUTATION":
      return (
        correct.separator === "ARROW" &&
        distractor.separator === "ARROW" &&
        correct.units[0] === distractor.units[0] &&
        differingPositions(correct.units[1]!, distractor.units[1]!) === 1
      );
  }
}
