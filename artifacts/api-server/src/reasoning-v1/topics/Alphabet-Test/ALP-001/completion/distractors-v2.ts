import { shuffle } from "../foundation/prng";
import type { AlpOption, AlpQuestionLogic } from "../types";
import {
  adj,
  digit,
  key,
  letter,
  symbol,
  vowel,
  wordPairs,
  type C,
} from "./shared";

type TrapCandidate = {
  value: string;
  errorLabel: string;
};

function add(
  out: TrapCandidate[],
  value: string | number | undefined,
  errorLabel: string,
  answer: string,
) {
  if (value === undefined || value === null) return;
  const rendered = String(value);
  if (!rendered || rendered === answer || out.some((candidate) => candidate.value === rendered)) return;
  out.push({ value: rendered, errorLabel });
}

function number(answer: string): number | undefined {
  const parsed = Number(answer);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function firstNumber(text: string): number | undefined {
  const match = text.match(/\d+/);
  return match ? Number(match[0]) : undefined;
}

function at(items: readonly string[] | undefined, index: number): string | undefined {
  if (!items || index < 0 || index >= items.length) return undefined;
  return items[index];
}

function finalRow(c: C): readonly string[] {
  return c.changed ?? c.source;
}

function visibleAlternatives(c: C, answer: string): TrapCandidate[] {
  return [...new Set(c.pool)]
    .filter((value) => value !== answer)
    .map((value) => ({ value, errorLabel: "VISIBLE_FINAL_STATE_ALTERNATIVE" }));
}

function countWindows(
  items: readonly string[],
  predicate: (previous: string, centre: string, next: string) => boolean,
): number {
  let total = 0;
  for (let index = 0; index + 2 < items.length; index += 1) {
    if (predicate(items[index]!, items[index + 1]!, items[index + 2]!)) total += 1;
  }
  return total;
}

function directPositionCandidates(c: C, answer: string, final: readonly string[] = finalRow(c)): TrapCandidate[] {
  const out: TrapCandidate[] = [];
  const position = firstNumber(c.query.en);
  if (position !== undefined) {
    const index = Math.max(0, position - 1);
    add(out, at(c.source, index), "READ_FROM_ORIGINAL_ROW", answer);
    add(out, at(final, index - 1), "READ_PREVIOUS_FINAL_POSITION", answer);
    add(out, at(final, index + 1), "READ_NEXT_FINAL_POSITION", answer);
    add(out, at(final, final.length - position), "COUNTED_FROM_OPPOSITE_END", answer);
  }
  return out;
}

function cp006Candidates(c: C, ql: AlpQuestionLogic): TrapCandidate[] {
  const out: TrapCandidate[] = [];
  const answer = c.answer;

  if (ql.solveMode === "IDENTIFY_WORD_ALPHA_PAIR") {
    for (const value of c.pool) add(out, value, "ROW_ALPHABET_GAP_MISMATCH", answer);
    return out;
  }
  if (ql.solveMode === "IDENTIFY_WORD_BY_ALPHA_PAIR_COUNT") {
    for (const value of c.pool) add(out, value, "WRONG_PAIR_COUNT_WORD", answer);
    return out;
  }

  const both = wordPairs(c.source.join(""), "BOTH").length;
  const forward = wordPairs(c.source.join(""), "FORWARD").length;
  const backward = wordPairs(c.source.join(""), "BACKWARD").length;
  add(out, forward, "COUNTED_ONLY_FORWARD_PAIRS", answer);
  add(out, backward, "COUNTED_ONLY_BACKWARD_PAIRS", answer);
  add(out, both, "IGNORED_DIRECTION_RESTRICTION", answer);

  const n = number(answer);
  if (n !== undefined) {
    add(out, Math.max(0, n - 1), "MISSED_ONE_QUALIFYING_PAIR", answer);
    add(out, n + 1, "COUNTED_ONE_NONQUALIFYING_PAIR", answer);
  }
  return out;
}

function cp007Candidates(c: C, ql: AlpQuestionLogic): TrapCandidate[] {
  const out: TrapCandidate[] = [];
  const answer = c.answer;
  const final = finalRow(c);
  const position = firstNumber(c.query.en);

  if (ql.solveMode === "CLASS_SHIFT_TRANSFORMED_WORD") {
    add(out, c.source.join(""), "SKIPPED_CLASS_TRANSFORMATION", answer);
    add(out, [...final].reverse().join(""), "REVERSED_AFTER_CLASS_TRANSFORMATION", answer);
    const partial = final.map((token, index) => index === 0 ? c.source[0]! : token).join("");
    add(out, partial, "LEFT_FIRST_LETTER_UNCHANGED", answer);
    for (const value of c.pool) add(out, value, "INCOMPLETE_CLASS_TRANSFORMATION", answer);
    return out;
  }

  if (ql.solveMode === "CLASS_SHIFT_COUNT_UNCHANGED" || ql.solveMode === "CLASS_SHIFT_COUNT_VOWELS") {
    const n = number(answer);
    if (n !== undefined) {
      add(out, c.source.length - n, ql.solveMode.includes("UNCHANGED") ? "COUNTED_CHANGED_POSITIONS" : "COUNTED_NONVOWELS", answer);
      add(out, Math.max(0, n - 1), "MISSED_ONE_MATCHING_LETTER", answer);
      add(out, n + 1, "COUNTED_ONE_EXTRA_LETTER", answer);
    }
    return out;
  }

  if (ql.solveMode === "CLASS_SHIFT_SORTED_POSITION_OF_LETTER") {
    const n = number(answer);
    if (n !== undefined) {
      add(out, c.source.length - n + 1, "COUNTED_SORTED_POSITION_FROM_RIGHT", answer);
      add(out, Math.max(1, n - 1), "STOPPED_AT_PREVIOUS_SORTED_POSITION", answer);
      add(out, Math.min(c.source.length, n + 1), "MOVED_TO_NEXT_SORTED_POSITION", answer);
    }
    return out;
  }

  if (position !== undefined) {
    const index = position - 1;
    add(out, at(c.source, index), "READ_BEFORE_CLASS_TRANSFORMATION", answer);
    add(out, at(final, index - 1), "READ_PREVIOUS_FINAL_POSITION", answer);
    add(out, at(final, index + 1), "READ_NEXT_FINAL_POSITION", answer);
    if (ql.solveMode === "CLASS_TWO_STAGE_LETTER_AT_POSITION") {
      const stageOne = [...final].reverse();
      add(out, at(stageOne, index), "STOPPED_AFTER_FIRST_TRANSFORMATION_STAGE", answer);
    }
  }
  return out;
}

function cp008Candidates(c: C, ql: AlpQuestionLogic): TrapCandidate[] {
  const out: TrapCandidate[] = [];
  const answer = c.answer;
  const final = finalRow(c);
  const position = firstNumber(c.query.en);

  if (ql.solveMode === "DIGIT_AT_LEFT_POSITION" || ql.solveMode === "DIGIT_AT_RIGHT_POSITION") {
    if (position !== undefined) {
      const correctIndex = ql.solveMode === "DIGIT_AT_LEFT_POSITION" ? position - 1 : c.source.length - position;
      const oppositeIndex = ql.solveMode === "DIGIT_AT_LEFT_POSITION" ? c.source.length - position : position - 1;
      add(out, at(c.source, oppositeIndex), "COUNTED_FROM_WRONG_END", answer);
      add(out, at(c.source, correctIndex - 1), "READ_PREVIOUS_DIGIT_SLOT", answer);
      add(out, at(c.source, correctIndex + 1), "READ_NEXT_DIGIT_SLOT", answer);
    }
    return out;
  }

  if (ql.solveMode === "DIGIT_LEFT_POSITION" || ql.solveMode === "DIGIT_RIGHT_POSITION") {
    const n = number(answer);
    if (n !== undefined) {
      add(out, c.source.length - n + 1, "REPORTED_POSITION_FROM_WRONG_END", answer);
      add(out, Math.max(1, n - 1), "POSITION_OFF_BY_ONE_LOW", answer);
      add(out, Math.min(c.source.length, n + 1), "POSITION_OFF_BY_ONE_HIGH", answer);
    }
    return out;
  }

  if (ql.solveMode === "IDENTIFY_DIGIT_GAP_PAIR") {
    for (const value of c.pool) add(out, value, "DIGIT_GAP_RELATION_MISMATCH", answer);
    return out;
  }

  if (ql.solveMode === "COUNT_DIGIT_GAP_PAIRS") {
    const n = number(answer);
    if (n !== undefined) {
      add(out, Math.max(0, n - 1), "MISSED_ONE_EQUAL_GAP_PAIR", answer);
      add(out, n + 1, "COUNTED_ONE_UNEQUAL_GAP_PAIR", answer);
      add(out, wordPairs(c.source.join(""), "FORWARD").length, "COUNTED_ONLY_ASCENDING_DIGIT_PAIRS", answer);
    }
    return out;
  }

  if (ql.solveMode.includes("COUNT_UNCHANGED")) {
    const n = number(answer);
    if (n !== undefined) {
      add(out, c.source.length - n, "COUNTED_MOVED_DIGIT_POSITIONS", answer);
      add(out, Math.max(0, n - 1), "MISSED_ONE_UNCHANGED_DIGIT", answer);
      add(out, Math.min(c.source.length, n + 1), "COUNTED_ONE_MOVED_DIGIT_AS_UNCHANGED", answer);
    }
    return out;
  }

  if (position !== undefined) {
    const index = position - 1;
    add(out, at(c.source, index), "READ_BEFORE_DIGIT_TRANSFORM", answer);
    add(out, at(final, index - 1), "READ_PREVIOUS_FINAL_DIGIT", answer);
    add(out, at(final, index + 1), "READ_NEXT_FINAL_DIGIT", answer);
    add(out, at(final, final.length - position), "COUNTED_FINAL_DIGITS_FROM_WRONG_END", answer);
  }
  return out;
}

function cp009Candidates(c: C, ql: AlpQuestionLogic): TrapCandidate[] {
  const out: TrapCandidate[] = [];
  const answer = c.answer;
  const source = c.source;

  if (ql.qlId === "ALP-QL-138") {
    const literalZab = c.query.en.includes("Z-A-B");
    if (literalZab) {
      add(out, adj(source, (token) => token === "Z", (token) => token === "A"), "CHECKED_ONLY_PREDECESSOR_Z", answer);
      add(out, adj(source, (token) => token === "A", (token) => token === "B"), "CHECKED_ONLY_SUCCESSOR_B", answer);
      add(out, countWindows(source, (previous, centre, next) => previous === "B" && centre === "A" && next === "Z"), "REVERSED_Z_A_B_WINDOW", answer);
    } else {
      add(out, adj(source, symbol, letter), "CHECKED_ONLY_SYMBOL_PREDECESSOR", answer);
      add(out, adj(source, letter, digit), "CHECKED_ONLY_DIGIT_SUCCESSOR", answer);
      add(out, countWindows(source, (previous, centre, next) => digit(previous) && letter(centre) && symbol(next)), "REVERSED_OUTER_CLASSES", answer);
    }
    return out;
  }

  if (ql.qlId === "ALP-QL-140") {
    add(out, countWindows(source, (previous, centre) => symbol(centre) && letter(previous)), "CHECKED_ONLY_LEFT_LETTER_FLANK", answer);
    add(out, countWindows(source, (_previous, centre, next) => symbol(centre) && digit(next)), "CHECKED_ONLY_RIGHT_DIGIT_FLANK", answer);
    add(out, countWindows(source, (previous, centre, next) => symbol(centre) && ((letter(previous) && letter(next)) || (digit(previous) && digit(next)))), "ACCEPTED_SAME_CLASS_FLANKS", answer);
    return out;
  }

  if (ql.solveMode === "COUNT_LETTER_FOLLOWED_BY_SYMBOL") {
    add(out, adj(source, symbol, letter), "REVERSED_ADJACENCY_ORDER", answer);
    add(out, adj(source, letter, digit), "SCANNED_LETTER_DIGIT_INSTEAD", answer);
  } else if (ql.solveMode === "COUNT_DIGIT_FOLLOWED_BY_LETTER") {
    add(out, adj(source, letter, digit), "REVERSED_ADJACENCY_ORDER", answer);
    add(out, adj(source, digit, symbol), "SCANNED_DIGIT_SYMBOL_INSTEAD", answer);
  } else if (ql.solveMode === "COUNT_VOWEL_FOLLOWED_BY_DIGIT") {
    add(out, adj(source, letter, digit), "FORGOT_VOWEL_FILTER", answer);
    add(out, adj(source, digit, vowel), "REVERSED_ADJACENCY_ORDER", answer);
    add(out, adj(source, vowel, symbol), "SCANNED_VOWEL_SYMBOL_INSTEAD", answer);
  } else if (ql.solveMode === "COUNT_EVEN_DIGIT_PRECEDED_BY_SYMBOL") {
    add(out, adj(source, symbol, digit), "FORGOT_EVEN_DIGIT_FILTER", answer);
    add(out, adj(source, (token) => digit(token) && Number(token) % 2 === 0, symbol), "REVERSED_ADJACENCY_ORDER", answer);
    add(out, adj(source, letter, (token) => digit(token) && Number(token) % 2 === 0), "USED_LETTER_PREDECESSOR", answer);
  }

  if (ql.solveMode.startsWith("COUNT_")) {
    const n = number(answer);
    if (n !== undefined) {
      add(out, Math.max(0, n - 1), "MISSED_ONE_QUALIFYING_ADJACENCY", answer);
      add(out, n + 1, "COUNTED_ONE_NONQUALIFYING_ADJACENCY", answer);
    }
    return out;
  }

  if (ql.solveMode === "NTH_LETTER_FROM_LEFT" || ql.solveMode === "NTH_SYMBOL_FROM_RIGHT") {
    const filtered = ql.solveMode === "NTH_LETTER_FROM_LEFT" ? source.filter(letter) : source.filter(symbol).reverse();
    const opposite = ql.solveMode === "NTH_LETTER_FROM_LEFT" ? source.filter(letter).reverse() : source.filter(symbol);
    const targetIndex = filtered.indexOf(answer);
    if (targetIndex >= 0) {
      add(out, at(opposite, targetIndex), "COUNTED_CATEGORY_FROM_WRONG_END", answer);
      add(out, at(filtered, targetIndex - 1), "READ_PREVIOUS_CATEGORY_ITEM", answer);
      add(out, at(filtered, targetIndex + 1), "READ_NEXT_CATEGORY_ITEM", answer);
    }
    return out;
  }

  const occurrences = source.map((token, index) => token === answer ? index : -1).filter((index) => index >= 0);
  for (const index of occurrences) {
    add(out, at(source, index - 1), "READ_PREVIOUS_ROW_POSITION", answer);
    add(out, at(source, index + 1), "READ_NEXT_ROW_POSITION", answer);
    add(out, at(source, source.length - index - 1), "COUNTED_FROM_OPPOSITE_END", answer);
  }
  return out;
}

function cp010Candidates(c: C, ql: AlpQuestionLogic): TrapCandidate[] {
  const out: TrapCandidate[] = [];
  const answer = c.answer;
  const final = finalRow(c);

  if (ql.solveMode === "MIXED_POSITION_OF_TOKEN_AFTER_GROUP") {
    const n = number(answer);
    if (n !== undefined) {
      const target = at(final, n - 1);
      const originalIndex = target ? c.source.indexOf(target) : -1;
      if (originalIndex >= 0) add(out, originalIndex + 1, "REPORTED_ORIGINAL_POSITION_BEFORE_GROUPING", answer);
      add(out, final.length - n + 1, "REPORTED_FINAL_POSITION_FROM_RIGHT", answer);
      add(out, Math.max(1, n - 1), "FINAL_POSITION_OFF_BY_ONE_LOW", answer);
      add(out, Math.min(final.length, n + 1), "FINAL_POSITION_OFF_BY_ONE_HIGH", answer);
    }
    return out;
  }

  if (ql.solveMode === "MIXED_COUNT_UNCHANGED_AFTER_TRANSFORM") {
    const n = number(answer);
    if (n !== undefined) {
      add(out, c.source.length - n, "COUNTED_CHANGED_POSITIONS", answer);
      add(out, Math.max(0, n - 1), "MISSED_ONE_UNCHANGED_POSITION", answer);
      add(out, Math.min(c.source.length, n + 1), "COUNTED_ONE_CHANGED_POSITION_AS_UNCHANGED", answer);
    }
    return out;
  }

  if (ql.solveMode === "MIXED_COUNT_ADJACENCY_AFTER_TRANSFORM") {
    const n = number(answer);
    add(out, adj(c.source, letter, digit), "SCANNED_BEFORE_TRANSFORM", answer);
    add(out, adj(final, digit, letter), "REVERSED_FINAL_ADJACENCY_ORDER", answer);
    add(out, adj(final, letter, symbol), "SCANNED_WRONG_FINAL_CATEGORY_PAIR", answer);
    if (n !== undefined) {
      add(out, Math.max(0, n - 1), "MISSED_ONE_FINAL_ADJACENCY", answer);
      add(out, n + 1, "COUNTED_ONE_EXTRA_FINAL_ADJACENCY", answer);
    }
    return out;
  }

  return directPositionCandidates(c, answer, final);
}

function taskCandidates(c: C, ql: AlpQuestionLogic): TrapCandidate[] {
  switch (ql.checkpointId) {
    case "ALP-CP-006": return cp006Candidates(c, ql);
    case "ALP-CP-007": return cp007Candidates(c, ql);
    case "ALP-CP-008": return cp008Candidates(c, ql);
    case "ALP-CP-009": return cp009Candidates(c, ql);
    case "ALP-CP-010": return cp010Candidates(c, ql);
    default: return [];
  }
}

/**
 * Build distractors from the completed solve state, not just from the answer's
 * data type. Candidate values represent concrete mistakes a learner can make:
 * wrong end, wrong intermediate state, wrong transform stage, relaxed filter,
 * reversed adjacency, or an omitted/extra qualifying match.
 */
export function completionOptions(c: C, ql: AlpQuestionLogic, seed: number) {
  const candidates: TrapCandidate[] = [];
  for (const candidate of taskCandidates(c, ql)) add(candidates, candidate.value, candidate.errorLabel, c.answer);

  // A visible alternative from the actual generated state is preferable to an
  // invented alphabet/number neighbour when a family has fewer than three
  // distinct misconception states for a particular seed.
  for (const candidate of visibleAlternatives(c, c.answer)) {
    if (candidates.length >= 3) break;
    add(candidates, candidate.value, candidate.errorLabel, c.answer);
  }

  if (candidates.length < 3) {
    throw new Error(`${ql.qlId} seed ${seed} cannot produce three completed-state distractors.`);
  }

  const wrong = candidates.slice(0, 3);
  const options: AlpOption[] = [
    { value: c.answer, errorLabel: null },
    ...wrong.map((candidate) => ({ value: candidate.value, errorLabel: candidate.errorLabel })),
  ];
  const out = shuffle(options, key(ql, seed, "completed-state-option-order"));
  const correctIndex = out.findIndex((option) => option.value === c.answer);
  if (correctIndex < 0 || new Set(out.map((option) => option.value)).size !== 4) {
    throw new Error(`${ql.qlId} seed ${seed} produced invalid completed-state options.`);
  }
  return { out, correctIndex };
}
