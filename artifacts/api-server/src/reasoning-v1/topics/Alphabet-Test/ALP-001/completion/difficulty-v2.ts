import type { AlpDifficulty, AlpQuestionLogic } from "../types";
import type { C } from "./shared";
import { repeatedOccurrenceCount } from "./mixed-row";

function numericAnswer(c: C): number {
  const value = Number(c.answer);
  return Number.isFinite(value) ? value : 0;
}

function wordRepeatBurden(c: C): number {
  return c.source.length - new Set(c.source).size;
}

function scoreCp006(ql: AlpQuestionLogic, c: C): number {
  const repeatBurden = wordRepeatBurden(c) > 0 ? 1 : 0;
  const pairDensity = numericAnswer(c) >= 3 ? 1 : 0;
  switch (ql.solveMode) {
    case "COUNT_WORD_ALPHA_PAIRS_BOTH":
    case "COUNT_WORD_ALPHA_PAIRS_FORWARD":
    case "COUNT_WORD_ALPHA_PAIRS_BACKWARD":
      return 2 + repeatBurden + pairDensity;
    case "IDENTIFY_WORD_ALPHA_PAIR":
      return 3 + repeatBurden;
    case "IDENTIFY_WORD_BY_ALPHA_PAIR_COUNT":
      return 4 + pairDensity;
    case "COUNT_WORD_ALPHA_PAIRS_AFTER_REVERSE":
      return 3 + repeatBurden + pairDensity;
    default:
      return 2;
  }
}

function scoreCp007(ql: AlpQuestionLogic, c: C): number {
  const repeatBurden = wordRepeatBurden(c) > 0 ? 1 : 0;
  switch (ql.solveMode) {
    case "CLASS_SHIFT_LETTER_AT_POSITION":
    case "CLASS_SHIFT_TRANSFORMED_WORD":
      return 2 + repeatBurden;
    case "CLASS_SHIFT_COUNT_UNCHANGED":
    case "CLASS_SHIFT_COUNT_VOWELS":
    case "CLASS_OPPOSITE_LETTER_AT_POSITION":
      return 3 + repeatBurden;
    case "CLASS_SHIFT_SORTED_LETTER_AT_POSITION":
    case "CLASS_SHIFT_SORTED_POSITION_OF_LETTER":
      return 4 + repeatBurden;
    case "CLASS_TWO_STAGE_LETTER_AT_POSITION":
      return 5;
    default:
      return 2;
  }
}

function scoreCp008(ql: AlpQuestionLogic, c: C): number {
  switch (ql.solveMode) {
    case "DIGIT_AT_LEFT_POSITION":
    case "DIGIT_AT_RIGHT_POSITION":
      return 0;
    case "DIGIT_LEFT_POSITION":
    case "DIGIT_RIGHT_POSITION":
      return 1;
    case "COUNT_DIGIT_GAP_PAIRS":
      return 2 + (numericAnswer(c) >= 3 ? 1 : 0);
    case "IDENTIFY_DIGIT_GAP_PAIR":
      return 4;
    case "DIGIT_AFTER_ASC_POSITION":
    case "DIGIT_AFTER_DESC_POSITION":
      return 2;
    case "DIGIT_AFTER_REVERSE_POSITION":
    case "DIGIT_AFTER_ADJACENT_SWAP_POSITION":
      return 1;
    case "DIGIT_COUNT_UNCHANGED_ASC":
      return 3;
    case "DIGIT_COUNT_UNCHANGED_SELECTED_TRANSFORM": {
      const kind = c.query.en.match(/apply\s+(ASC|DESC|REV|SWAP)/)?.[1];
      return kind === "ASC" || kind === "DESC" ? 4 : 2;
    }
    default:
      return 2;
  }
}

function scoreCp009(ql: AlpQuestionLogic, c: C): number {
  if (ql.qlId === "ALP-QL-138" || ql.qlId === "ALP-QL-140") return 4;

  switch (ql.solveMode) {
    case "MIXED_ELEMENT_FROM_LEFT":
    case "MIXED_ELEMENT_FROM_RIGHT":
      return 0;
    case "MIXED_RELATIVE_RIGHT_FROM_LEFT":
    case "MIXED_RELATIVE_LEFT_FROM_LEFT":
      return 2;
    case "MIXED_RELATIVE_RIGHT_FROM_RIGHT":
    case "MIXED_RELATIVE_LEFT_FROM_RIGHT":
      return 3;
    case "COUNT_LETTER_FOLLOWED_BY_SYMBOL":
    case "COUNT_DIGIT_FOLLOWED_BY_LETTER":
      return 2;
    case "COUNT_VOWEL_FOLLOWED_BY_DIGIT":
    case "COUNT_EVEN_DIGIT_PRECEDED_BY_SYMBOL":
      return 3;
    case "NTH_LETTER_FROM_LEFT":
      return 1;
    case "NTH_SYMBOL_FROM_RIGHT":
      return 2;
    default:
      return 2;
  }
}

function scoreCp010(ql: AlpQuestionLogic, c: C): number {
  const operation = c.operation.en;
  let score: number;
  switch (ql.solveMode) {
    case "MIXED_GROUP_LETTERS_DIGITS_SYMBOLS_POSITION":
    case "MIXED_GROUP_SYMBOLS_DIGITS_LETTERS_POSITION":
      score = 2; break;
    case "MIXED_SORT_LETTERS_IN_PLACE_POSITION":
    case "MIXED_SORT_DIGITS_IN_PLACE_POSITION":
      score = 4; break;
    case "MIXED_REVERSE_LETTERS_IN_PLACE_POSITION":
    case "MIXED_REVERSE_DIGITS_IN_PLACE_POSITION":
      score = 3; break;
    case "MIXED_SWAP_ADJACENT_POSITION":
    case "MIXED_REVERSE_ALL_POSITION":
    case "MIXED_REMOVE_CATEGORY_POSITION":
      score = 2; break;
    case "MIXED_POSITION_OF_TOKEN_AFTER_GROUP":
      score = 3; break;
    case "MIXED_COUNT_UNCHANGED_AFTER_TRANSFORM":
      score = operation.includes("sort only") ? 5 : operation.includes("group") ? 4 : 3;
      break;
    case "MIXED_COUNT_ADJACENCY_AFTER_TRANSFORM":
      score = 4; break;
    default:
      score = 2;
  }

  // Repeated occurrences add reasoning burden only where the learner must scan,
  // compare or recover a state. They do not make a simple nth-position question hard.
  const repeats = repeatedOccurrenceCount(c.source);
  const repetitionMatters = ql.solveMode.includes("COUNT_") || ql.solveMode.includes("POSITION_OF_TOKEN");
  if (repetitionMatters && repeats >= 2) score += 1;
  return score;
}

/**
 * Difficulty is derived only from the generated solve state. Raw seed, token
 * magnitude and row length are deliberately absent. A seed may change the
 * difficulty only by producing a materially different reasoning structure.
 */
export function completionDifficulty(ql: AlpQuestionLogic, c: C): AlpDifficulty {
  const checkpoint = Number(ql.checkpointId.slice(-3));
  const score = checkpoint === 6 ? scoreCp006(ql, c)
    : checkpoint === 7 ? scoreCp007(ql, c)
      : checkpoint === 8 ? scoreCp008(ql, c)
        : checkpoint === 9 ? scoreCp009(ql, c)
          : scoreCp010(ql, c);

  if (score <= 1) return "EASY";
  if (score <= 3) return "MEDIUM";
  return "HARD";
}
