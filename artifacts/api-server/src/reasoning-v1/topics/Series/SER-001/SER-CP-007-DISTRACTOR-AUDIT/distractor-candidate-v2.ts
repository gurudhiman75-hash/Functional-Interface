import {
  editorialTaskKindFor,
  proofModelFor,
  type SerCp007EditorialQuestion,
  type SerCp007EditorialTaskKind,
  type SerCp007ProofModel,
} from "../SER-CP-007-ENGLISH-REMODEL/adaptive-review";

export type SerCp007DistractorRoleV2 =
  | "REVERT_ONE_REQUIRED_CHANGE"
  | "APPLY_ONE_FUTURE_CHANGE_EARLY"
  | "REUSE_PREVIOUS_PROGRESSIVE_JUMP"
  | "USE_NEXT_PROGRESSIVE_JUMP_TOO_EARLY"
  | "SWAP_COLUMN_MOVEMENTS"
  | "CONTINUE_ADJACENT_INTERLEAVED_ROW"
  | "WHOLE_REVERSAL_INSTEAD_OF_REQUIRED_ORDER"
  | "ROTATE_LEFT_INSTEAD_OF_REQUIRED_ORDER"
  | "ROTATE_RIGHT_INSTEAD_OF_REQUIRED_ORDER"
  | "DELETE_FROM_WRONG_EDGE"
  | "STOP_GROWTH_ON_ONE_SIDE"
  | "EXTEND_GROWTH_ON_ONE_SIDE"
  | "SHIFT_CONSECUTIVE_BLOCK_START"
  | "MOVE_MARKER_ONE_PLACE_SHORT"
  | "MOVE_MARKER_ONE_PLACE_FAR"
  | "CHANGE_BOUNDARY_ONE_POSITION_EARLY"
  | "CHANGE_BOUNDARY_ONE_POSITION_LATE"
  | "UNIFORM_SHIFT_FORWARD"
  | "UNIFORM_SHIFT_BACKWARD"
  | "SINGLE_POSITION_MUTATION"
  | "ORDERED_PAIR_SWAPPED"
  | "FIRST_COMPONENT_MUTATED"
  | "SECOND_COMPONENT_MUTATED"
  | "REPLACEMENT_WRONG_POSITION"
  | "REPLACEMENT_WRONG_RULE"
  | "REPLACEMENT_LETTERS_WRONG_ORDER";

export interface SerCp007DistractorCandidateOptionV2 {
  readonly role: SerCp007DistractorRoleV2;
  readonly value: string;
  readonly learnerCheck: string;
}

export interface SerCp007DistractorCandidateV2 {
  readonly editorialTaskKind: SerCp007EditorialTaskKind;
  readonly proofModel: SerCp007ProofModel;
  readonly options: readonly string[];
  readonly correctAnswer: string;
  readonly correctIndex: number;
  readonly distractors: readonly SerCp007DistractorCandidateOptionV2[];
  readonly forbiddenDisplayedValues: readonly string[];
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const CHECKS: Readonly<Record<SerCp007DistractorRoleV2, string>> = {
  REVERT_ONE_REQUIRED_CHANGE:
    "one required letter change has been left incomplete",
  APPLY_ONE_FUTURE_CHANGE_EARLY:
    "one change belonging to the following step has been applied too early",
  REUSE_PREVIOUS_PROGRESSIVE_JUMP:
    "the previous jump has been repeated instead of increasing or decreasing it",
  USE_NEXT_PROGRESSIVE_JUMP_TOO_EARLY:
    "the next progressive jump has been used one step too soon",
  SWAP_COLUMN_MOVEMENTS:
    "the right movements have been applied to the wrong letter positions",
  CONTINUE_ADJACENT_INTERLEAVED_ROW:
    "an adjacent interleaved row has been continued instead of the row containing the blank",
  WHOLE_REVERSAL_INSTEAD_OF_REQUIRED_ORDER:
    "the whole group has been reversed even though the required position rule is different",
  ROTATE_LEFT_INSTEAD_OF_REQUIRED_ORDER:
    "the letters have been rotated left instead of using the required position rule",
  ROTATE_RIGHT_INSTEAD_OF_REQUIRED_ORDER:
    "the letters have been rotated right instead of using the required position rule",
  DELETE_FROM_WRONG_EDGE:
    "the correct number of letters has been changed from the wrong edge",
  STOP_GROWTH_ON_ONE_SIDE:
    "only one side of the growing group has been completed",
  EXTEND_GROWTH_ON_ONE_SIDE:
    "one side has been extended into the following step",
  SHIFT_CONSECUTIVE_BLOCK_START:
    "the group length is plausible, but its starting letter is one place wrong",
  MOVE_MARKER_ONE_PLACE_SHORT:
    "the marker has been moved one place less than required",
  MOVE_MARKER_ONE_PLACE_FAR:
    "the marker has been moved one place farther than required",
  CHANGE_BOUNDARY_ONE_POSITION_EARLY:
    "one boundary position has been changed before its turn",
  CHANGE_BOUNDARY_ONE_POSITION_LATE:
    "one boundary position has not yet been changed",
  UNIFORM_SHIFT_FORWARD:
    "every letter has been moved forward uniformly, although the positions follow different movements",
  UNIFORM_SHIFT_BACKWARD:
    "every letter has been moved backward uniformly, although the positions follow different movements",
  SINGLE_POSITION_MUTATION:
    "only one letter has been altered without completing the governing rule",
  ORDERED_PAIR_SWAPPED:
    "the two required groups are correct but have been placed in the wrong order",
  FIRST_COMPONENT_MUTATED:
    "the first group of the ordered pair has been altered",
  SECOND_COMPONENT_MUTATED:
    "the second group of the ordered pair has been altered",
  REPLACEMENT_WRONG_POSITION:
    "a plausible replacement has been attached to the wrong displayed term",
  REPLACEMENT_WRONG_RULE:
    "the incorrect term is identified correctly, but the replacement follows a nearby wrong rule",
  REPLACEMENT_LETTERS_WRONG_ORDER:
    "the incorrect term is identified correctly, but the replacement letters are in the wrong order",
};

function option(
  role: SerCp007DistractorRoleV2,
  value: string,
): SerCp007DistractorCandidateOptionV2 {
  return { role, value, learnerCheck: CHECKS[role] };
}

function stableHash(value: string): number {
  let hash = 2166136261;
  for (const character of value) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash;
}

function shiftCharacter(character: string, amount: number): string {
  const upper = character.toUpperCase();
  const position = ALPHABET.indexOf(upper);
  if (position < 0) return character;
  const shifted = ALPHABET[((position + amount) % 26 + 26) % 26]!;
  return character === upper ? shifted : shifted.toLowerCase();
}

function signedDelta(from: string, to: string): number {
  const left = ALPHABET.indexOf(from.toUpperCase());
  const right = ALPHABET.indexOf(to.toUpperCase());
  if (left < 0 || right < 0) return 0;
  let delta = right - left;
  if (delta > 13) delta -= 26;
  if (delta < -13) delta += 26;
  return delta;
}

function shiftLetters(value: string, amount: number): string {
  return [...value].map((character) => shiftCharacter(character, amount)).join("");
}

function mutateOnePosition(value: string, salt: number): string {
  const characters = [...value];
  const positions = characters
    .map((character, index) =>
      ALPHABET.includes(character.toUpperCase()) ? index : -1,
    )
    .filter((index) => index >= 0);
  if (positions.length === 0) return `${value}X`;
  const selected = positions[salt % positions.length]!;
  characters[selected] = shiftCharacter(characters[selected]!, 1 + (salt % 3));
  return characters.join("");
}

function rotateLeft(value: string): string {
  return value.length <= 1 ? value : value.slice(1) + value[0];
}

function rotateRight(value: string): string {
  return value.length <= 1 ? value : value.at(-1)! + value.slice(0, -1);
}

function splitAnswer(value: string): {
  readonly separator: "ARROW" | "COMMA" | "SINGLE";
  readonly units: readonly string[];
} {
  if (value.includes("→")) {
    return { separator: "ARROW", units: value.split("→").map((unit) => unit.trim()) };
  }
  if (value.includes(",")) {
    return { separator: "COMMA", units: value.split(",").map((unit) => unit.trim()) };
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

function answerIndexes(question: SerCp007EditorialQuestion): readonly number[] {
  const state = question.hiddenState;
  if (state?.answerIndexes?.length) return state.answerIndexes;
  if (typeof state?.answerIndex === "number") return [state.answerIndex];
  const terms = state?.canonicalTerms ?? [];
  return splitAnswer(question.correctAnswer).units
    .map((unit) => terms.indexOf(unit))
    .filter((index) => index >= 0);
}

function displayedTerms(question: SerCp007EditorialQuestion): readonly string[] {
  const line = question.stem.split("\n").at(-1) ?? "";
  return line
    .split(",")
    .map((term) => term.trim().replace(/^\?+|\?+$/g, ""))
    .filter((term) => /^[A-Za-z]+$/.test(term));
}

function replaceAt(value: string, index: number, character: string): string {
  return value.slice(0, index) + character + value.slice(index + 1);
}

function revertOneChange(previous: string, current: string, salt: number): string | null {
  if (previous.length !== current.length) return null;
  const differences = [...current]
    .map((character, index) => (character !== previous[index] ? index : -1))
    .filter((index) => index >= 0);
  if (differences.length === 0) return null;
  const index = differences[salt % differences.length]!;
  return replaceAt(current, index, previous[index]!);
}

function applyOneFutureChange(current: string, next: string, salt: number): string | null {
  if (current.length !== next.length) return null;
  const differences = [...current]
    .map((character, index) => (character !== next[index] ? index : -1))
    .filter((index) => index >= 0);
  if (differences.length === 0) return null;
  const index = differences[salt % differences.length]!;
  return replaceAt(current, index, next[index]!);
}

function applyDeltas(base: string, deltas: readonly number[]): string | null {
  if (base.length !== deltas.length) return null;
  return [...base]
    .map((character, index) => shiftCharacter(character, deltas[index]!))
    .join("");
}

function progressiveCandidate(
  beforeBefore: string | undefined,
  before: string | undefined,
  answer: string,
  after: string | undefined,
  useFollowingJump: boolean,
): string | null {
  if (!before || before.length !== answer.length) return null;
  if (useFollowingJump) {
    if (!after || after.length !== answer.length) return null;
    const deltas = [...answer].map((character, index) =>
      signedDelta(character, after[index]!),
    );
    return applyDeltas(before, deltas);
  }
  if (!beforeBefore || beforeBefore.length !== before.length) return null;
  const deltas = [...before].map((character, index) =>
    signedDelta(beforeBefore[index]!, character),
  );
  return applyDeltas(before, deltas);
}

function swappedColumnCandidate(previous: string | undefined, answer: string): string | null {
  if (!previous || previous.length !== answer.length || answer.length < 2) return null;
  const deltas = [...answer].map((character, index) =>
    signedDelta(previous[index]!, character),
  );
  const rotated = [...deltas.slice(1), deltas[0]!];
  return applyDeltas(previous, rotated);
}

function moveUniqueMarker(
  previous: string | undefined,
  answer: string,
  amount: number,
): string | null {
  if (!previous || previous.length !== answer.length) return null;
  for (const character of new Set([...answer])) {
    if (
      answer.split(character).length - 1 !== 1 ||
      previous.split(character).length - 1 !== 1
    ) {
      continue;
    }
    const oldIndex = previous.indexOf(character);
    const currentIndex = answer.indexOf(character);
    if (oldIndex === currentIndex) continue;
    const target = Math.max(0, Math.min(answer.length - 1, currentIndex + amount));
    if (target === currentIndex) continue;
    const without = answer.slice(0, currentIndex) + answer.slice(currentIndex + 1);
    return without.slice(0, target) + character + without.slice(target);
  }
  return null;
}

function wrongEdgeDeletion(answer: string): string | null {
  if (answer.length <= 2) return null;
  return answer.slice(1);
}

function oneSidedGrowth(answer: string, removeLeft: boolean): string | null {
  if (answer.length <= 2) return null;
  return removeLeft ? answer.slice(1) : answer.slice(0, -1);
}

function oneSidedExtension(
  answer: string,
  next: string | undefined,
  useLeft: boolean,
): string | null {
  if (!next || next.length <= answer.length) return null;
  if (next.includes(answer)) {
    const index = next.indexOf(answer);
    const left = next.slice(0, index);
    const right = next.slice(index + answer.length);
    if (useLeft && left) return left.at(-1)! + answer;
    if (!useLeft && right) return answer + right[0]!;
  }
  return null;
}

function shiftedBlockStart(answer: string, amount: number): string {
  return [...answer].map((character) => shiftCharacter(character, amount)).join("");
}

function arrowPool(
  question: SerCp007EditorialQuestion,
  units: readonly string[],
  salt: number,
): readonly SerCp007DistractorCandidateOptionV2[] {
  const wrong = units[0]!;
  const replacement = units[1]!;
  const shown = displayedTerms(question);
  const indexes = answerIndexes(question);
  const index = indexes[0] ?? 0;
  const alternateWrong = shown[index > 0 ? index - 1 : index + 1];
  const ordered = rotateLeft(replacement) === replacement
    ? [...replacement].reverse().join("")
    : rotateLeft(replacement);
  return [
    ...(alternateWrong
      ? [
          option(
            "REPLACEMENT_WRONG_POSITION",
            joinAnswer("ARROW", [alternateWrong, replacement]),
          ),
        ]
      : []),
    option(
      "REPLACEMENT_WRONG_RULE",
      joinAnswer("ARROW", [wrong, mutateOnePosition(replacement, salt)]),
    ),
    option(
      "REPLACEMENT_LETTERS_WRONG_ORDER",
      joinAnswer("ARROW", [wrong, ordered]),
    ),
    option(
      "REPLACEMENT_WRONG_RULE",
      joinAnswer("ARROW", [wrong, shiftLetters(replacement, 1)]),
    ),
  ];
}

function orderedPairPool(
  separator: "COMMA" | "ARROW",
  units: readonly string[],
  salt: number,
): readonly SerCp007DistractorCandidateOptionV2[] {
  const swapped = [...units];
  [swapped[0], swapped[1]] = [swapped[1]!, swapped[0]!];
  const firstWrong = [...units];
  firstWrong[0] = mutateOnePosition(firstWrong[0]!, salt);
  const secondWrong = [...units];
  secondWrong[1] = mutateOnePosition(secondWrong[1]!, salt + 1);
  return [
    option("ORDERED_PAIR_SWAPPED", joinAnswer(separator, swapped)),
    option("FIRST_COMPONENT_MUTATED", joinAnswer(separator, firstWrong)),
    option("SECOND_COMPONENT_MUTATED", joinAnswer(separator, secondWrong)),
  ];
}

function singlePool(
  question: SerCp007EditorialQuestion,
  proofModel: SerCp007ProofModel,
  salt: number,
): readonly SerCp007DistractorCandidateOptionV2[] {
  const terms = question.hiddenState?.canonicalTerms ?? [];
  const index = answerIndexes(question)[0] ?? terms.indexOf(question.correctAnswer);
  const beforeBefore = index >= 2 ? terms[index - 2] : undefined;
  const before = index >= 1 ? terms[index - 1] : undefined;
  const after = index >= 0 && index + 1 < terms.length ? terms[index + 1] : undefined;
  const answer = question.correctAnswer;
  const pool: SerCp007DistractorCandidateOptionV2[] = [];

  const reverted = before ? revertOneChange(before, answer, salt) : null;
  if (reverted) pool.push(option("REVERT_ONE_REQUIRED_CHANGE", reverted));
  const future = after ? applyOneFutureChange(answer, after, salt + 1) : null;
  if (future) pool.push(option("APPLY_ONE_FUTURE_CHANGE_EARLY", future));

  switch (proofModel) {
    case "DIRECT_COLUMN_MOVEMENT": {
      if (question.canonicalAuthorityId === "COLUMNWISE_PROGRESSIVE_CLUSTER_MOVEMENT") {
        const repeated = progressiveCandidate(
          beforeBefore,
          before,
          answer,
          after,
          false,
        );
        const early = progressiveCandidate(
          beforeBefore,
          before,
          answer,
          after,
          true,
        );
        if (repeated) {
          pool.unshift(option("REUSE_PREVIOUS_PROGRESSIVE_JUMP", repeated));
        }
        if (early) {
          pool.unshift(option("USE_NEXT_PROGRESSIVE_JUMP_TOO_EARLY", early));
        }
      }
      const swapped = swappedColumnCandidate(before, answer);
      if (swapped) pool.push(option("SWAP_COLUMN_MOVEMENTS", swapped));
      pool.push(
        option("UNIFORM_SHIFT_FORWARD", shiftLetters(answer, 1)),
        option("UNIFORM_SHIFT_BACKWARD", shiftLetters(answer, -1)),
      );
      break;
    }
    case "INTERLEAVED_ROWS":
      pool.push(
        option(
          "CONTINUE_ADJACENT_INTERLEAVED_ROW",
          mutateOnePosition(answer, salt + 7),
        ),
        option("SWAP_COLUMN_MOVEMENTS", rotateLeft(answer)),
      );
      break;
    case "POSITION_TRANSFORMATION":
      pool.push(
        option(
          "WHOLE_REVERSAL_INSTEAD_OF_REQUIRED_ORDER",
          [...answer].reverse().join(""),
        ),
        option("ROTATE_LEFT_INSTEAD_OF_REQUIRED_ORDER", rotateLeft(answer)),
        option("ROTATE_RIGHT_INSTEAD_OF_REQUIRED_ORDER", rotateRight(answer)),
      );
      break;
    case "LENGTH_OR_CONTENT_CHANGE": {
      const deletion = wrongEdgeDeletion(answer);
      const shortOneSide = oneSidedGrowth(answer, salt % 2 === 0);
      const longOneSide = oneSidedExtension(answer, after, salt % 2 === 0);
      if (deletion) pool.push(option("DELETE_FROM_WRONG_EDGE", deletion));
      if (shortOneSide) pool.push(option("STOP_GROWTH_ON_ONE_SIDE", shortOneSide));
      if (longOneSide) pool.push(option("EXTEND_GROWTH_ON_ONE_SIDE", longOneSide));
      if (
        question.canonicalAuthorityId === "VARIABLE_LENGTH_CONSECUTIVE_CLUSTER" ||
        question.canonicalAuthorityId === "GROWING_CONSECUTIVE_CLUSTER"
      ) {
        pool.unshift(
          option("SHIFT_CONSECUTIVE_BLOCK_START", shiftedBlockStart(answer, 1)),
          option("SHIFT_CONSECUTIVE_BLOCK_START", shiftedBlockStart(answer, -1)),
        );
      }
      break;
    }
    case "CONTINUOUS_GAP_COMPLETION":
      pool.push(
        option(
          "WHOLE_REVERSAL_INSTEAD_OF_REQUIRED_ORDER",
          [...answer].reverse().join(""),
        ),
        option("SINGLE_POSITION_MUTATION", mutateOnePosition(answer, salt + 4)),
      );
      break;
    case "MARKER_OR_BOUNDARY_MOVEMENT": {
      const markerShort = moveUniqueMarker(before, answer, -1);
      const markerFar = moveUniqueMarker(before, answer, 1);
      if (markerShort) pool.unshift(option("MOVE_MARKER_ONE_PLACE_SHORT", markerShort));
      if (markerFar) pool.unshift(option("MOVE_MARKER_ONE_PLACE_FAR", markerFar));
      if (reverted) pool.push(option("CHANGE_BOUNDARY_ONE_POSITION_LATE", reverted));
      if (future) pool.push(option("CHANGE_BOUNDARY_ONE_POSITION_EARLY", future));
      break;
    }
  }

  pool.push(
    option("SINGLE_POSITION_MUTATION", mutateOnePosition(answer, salt + 11)),
    option("UNIFORM_SHIFT_FORWARD", shiftLetters(answer, 1)),
    option("UNIFORM_SHIFT_BACKWARD", shiftLetters(answer, -1)),
  );
  return pool;
}

function forbiddenValues(question: SerCp007EditorialQuestion): ReadonlySet<string> {
  const forbidden = new Set<string>([question.correctAnswer]);
  for (const term of displayedTerms(question)) forbidden.add(term);
  const answer = splitAnswer(question.correctAnswer);
  if (answer.separator === "ARROW" && answer.units.length === 2) {
    forbidden.add(joinAnswer("ARROW", [answer.units[0]!, answer.units[0]!]));
  }
  return forbidden;
}

function selectDistractors(
  question: SerCp007EditorialQuestion,
  pool: readonly SerCp007DistractorCandidateOptionV2[],
  salt: number,
): readonly SerCp007DistractorCandidateOptionV2[] {
  const forbidden = forbiddenValues(question);
  const selected: SerCp007DistractorCandidateOptionV2[] = [];
  const seenValues = new Set<string>(forbidden);
  const seenRoles = new Set<SerCp007DistractorRoleV2>();
  const offset = pool.length > 0 ? stableHash(`${question.sourceRuleId}:${salt}`) % pool.length : 0;
  const ordered = [...pool.slice(offset), ...pool.slice(0, offset)];

  for (const candidate of ordered) {
    if (!candidate.value || seenValues.has(candidate.value) || seenRoles.has(candidate.role)) {
      continue;
    }
    const split = splitAnswer(candidate.value);
    if (
      split.separator === "ARROW" &&
      split.units.length === 2 &&
      split.units[0] === split.units[1]
    ) {
      continue;
    }
    seenValues.add(candidate.value);
    seenRoles.add(candidate.role);
    selected.push(candidate);
    if (selected.length === 3) return selected;
  }

  const fallbackRoles: readonly SerCp007DistractorRoleV2[] = [
    "SINGLE_POSITION_MUTATION",
    "UNIFORM_SHIFT_FORWARD",
    "UNIFORM_SHIFT_BACKWARD",
  ];
  let fallbackSalt = salt + 101;
  while (selected.length < 3) {
    const role = fallbackRoles.find((entry) => !seenRoles.has(entry)) ?? "SINGLE_POSITION_MUTATION";
    const value =
      role === "UNIFORM_SHIFT_FORWARD"
        ? shiftLetters(question.correctAnswer, 1 + (fallbackSalt % 2))
        : role === "UNIFORM_SHIFT_BACKWARD"
          ? shiftLetters(question.correctAnswer, -1 - (fallbackSalt % 2))
          : mutateOnePosition(question.correctAnswer, fallbackSalt);
    fallbackSalt += 1;
    if (seenValues.has(value)) continue;
    seenValues.add(value);
    seenRoles.add(role);
    selected.push(option(role, value));
  }
  return selected;
}

export function buildSerCp007DistractorCandidateV2(
  question: SerCp007EditorialQuestion,
): SerCp007DistractorCandidateV2 {
  const editorialTaskKind = editorialTaskKindFor(question.taskKind);
  const proofModel = proofModelFor(question.canonicalAuthorityId);
  const answer = splitAnswer(question.correctAnswer);
  const salt = question.seed + stableHash(question.temporaryTemplateId);
  const pool =
    answer.separator === "ARROW" && answer.units.length === 2
      ? arrowPool(question, answer.units, salt)
      : answer.separator !== "SINGLE" && answer.units.length >= 2
        ? orderedPairPool(answer.separator, answer.units, salt)
        : singlePool(question, proofModel, salt);
  const distractors = selectDistractors(question, pool, salt);
  const options = distractors.map((entry) => entry.value);
  options.splice(question.correctIndex, 0, question.correctAnswer);
  return {
    editorialTaskKind,
    proofModel,
    options,
    correctAnswer: question.correctAnswer,
    correctIndex: question.correctIndex,
    distractors,
    forbiddenDisplayedValues: [...forbiddenValues(question)].filter(
      (value) => value !== question.correctAnswer,
    ),
  };
}

export function validateSerCp007DistractorCandidateV2(
  question: SerCp007EditorialQuestion,
  candidate: SerCp007DistractorCandidateOptionV2,
): boolean {
  if (!candidate.value || candidate.value === question.correctAnswer) return false;
  if (forbiddenValues(question).has(candidate.value)) return false;
  const split = splitAnswer(candidate.value);
  if (
    split.separator === "ARROW" &&
    split.units.length === 2 &&
    split.units[0] === split.units[1]
  ) {
    return false;
  }
  return candidate.learnerCheck.trim().length > 0;
}
