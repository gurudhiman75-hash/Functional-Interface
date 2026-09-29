import type { WfmDifficulty } from "./types";

export type WfmOrderedExtractionMode =
  | "SINGLE_WORD_POSITIONS"
  | "MULTI_WORD_POSITIONS";

export interface WfmOrderedExtractionOptionAuthority {
  readonly words: readonly string[];
  readonly positions: readonly number[];
  readonly expectedExtraction: string;
  readonly meaningful: boolean;
}

export interface WfmOrderedExtractionFixture {
  readonly id: string;
  readonly mode: WfmOrderedExtractionMode;
  readonly difficulty: WfmDifficulty;
  readonly options: readonly [
    WfmOrderedExtractionOptionAuthority,
    WfmOrderedExtractionOptionAuthority,
    WfmOrderedExtractionOptionAuthority,
    WfmOrderedExtractionOptionAuthority,
    WfmOrderedExtractionOptionAuthority,
  ];
}

function extract(option: WfmOrderedExtractionOptionAuthority): string {
  if (option.words.length === 1) {
    const word = option.words[0]!.toUpperCase();
    return option.positions.map((position) => word[position - 1] ?? "").join("");
  }
  if (option.words.length !== option.positions.length) {
    throw new Error(`WFM Banking extraction option requires one position per word: ${option.words.join("/")}`);
  }
  return option.words.map((word, index) => word.toUpperCase()[option.positions[index]! - 1] ?? "").join("");
}

export const WFM_BANKING_ORDERED_EXTRACTION_FIXTURES: readonly WfmOrderedExtractionFixture[] = [
  {
    id: "WFM-BANK-ORD-001",
    mode: "SINGLE_WORD_POSITIONS",
    difficulty: "MEDIUM",
    options: [
      { words: ["EDUCATION"], positions: [1, 3, 5, 8], expectedExtraction: "EUTO", meaningful: false },
      { words: ["HOSPITAL"], positions: [2, 4, 6, 8], expectedExtraction: "OPTL", meaningful: false },
      { words: ["NOTEBOOK"], positions: [1, 3, 5, 8], expectedExtraction: "NTBK", meaningful: false },
      { words: ["NOTWITHSTANDING"], positions: [4, 5, 11, 12], expectedExtraction: "WIND", meaningful: true },
      { words: ["CELEBRATION"], positions: [2, 5, 8, 10], expectedExtraction: "EBTO", meaningful: false },
    ],
  },
  {
    id: "WFM-BANK-ORD-002",
    mode: "SINGLE_WORD_POSITIONS",
    difficulty: "EASY",
    options: [
      { words: ["DEPARTMENT"], positions: [3, 4, 5, 6], expectedExtraction: "PART", meaningful: true },
      { words: ["LANGUAGE"], positions: [1, 3, 5, 7], expectedExtraction: "LNUG", meaningful: false },
      { words: ["BUILDING"], positions: [2, 4, 6, 8], expectedExtraction: "ULIG", meaningful: false },
      { words: ["ELEPHANT"], positions: [1, 4, 6, 8], expectedExtraction: "EPAT", meaningful: false },
      { words: ["MOUNTAIN"], positions: [2, 4, 6, 8], expectedExtraction: "ONAN", meaningful: false },
    ],
  },
  {
    id: "WFM-BANK-ORD-003",
    mode: "MULTI_WORD_POSITIONS",
    difficulty: "MEDIUM",
    options: [
      { words: ["AMBER", "CABLE", "STONE", "CHAIR"], positions: [2, 2, 2, 2], expectedExtraction: "MATH", meaningful: true },
      { words: ["ROBIN", "CLOUD", "BRICK", "WATER"], positions: [2, 2, 2, 2], expectedExtraction: "OLRA", meaningful: false },
      { words: ["TIGER", "CABLE", "ROSES", "PEARL"], positions: [2, 2, 2, 2], expectedExtraction: "IAOE", meaningful: false },
      { words: ["HOUSE", "GREEN", "STONE", "PAPER"], positions: [2, 2, 2, 2], expectedExtraction: "ORTA", meaningful: false },
      { words: ["LIGHT", "MANGO", "BRICK", "CLOUD"], positions: [2, 2, 2, 2], expectedExtraction: "IARL", meaningful: false },
    ],
  },
  {
    id: "WFM-BANK-ORD-004",
    mode: "MULTI_WORD_POSITIONS",
    difficulty: "HARD",
    options: [
      { words: ["CABIN", "STONE", "DELTA", "GLOVE"], positions: [3, 3, 1, 5], expectedExtraction: "BODE", meaningful: true },
      { words: ["TIGER", "PLANT", "CLOUD", "BEACH"], positions: [2, 4, 1, 5], expectedExtraction: "INC H".replace(" ", ""), meaningful: false },
      { words: ["HOUSE", "BRICK", "MANGO", "WATER"], positions: [3, 2, 4, 1], expectedExtraction: "URIW", meaningful: false },
      { words: ["LIGHT", "STONE", "PAPER", "CLOUD"], positions: [1, 3, 2, 5], expectedExtraction: "LOAL", meaningful: false },
      { words: ["GREEN", "TABLE", "SNAKE", "PEARL"], positions: [4, 2, 5, 1], expectedExtraction: "EAEP", meaningful: false },
    ],
  },
  {
    id: "WFM-BANK-ORD-005",
    mode: "MULTI_WORD_POSITIONS",
    difficulty: "MEDIUM",
    options: [
      { words: ["BRAVE", "CABLE", "TIGER", "SNAKE"], positions: [2, 2, 2, 2], expectedExtraction: "RAIN", meaningful: true },
      { words: ["PLANT", "HOUSE", "BRICK", "WATER"], positions: [2, 2, 2, 2], expectedExtraction: "LOAR", meaningful: false },
      { words: ["MANGO", "GREEN", "CLOUD", "PEARL"], positions: [2, 2, 2, 2], expectedExtraction: "ARLE", meaningful: false },
      { words: ["STONE", "TABLE", "LIGHT", "CHAIR"], positions: [2, 2, 2, 2], expectedExtraction: "TAAA", meaningful: false },
      { words: ["ROBIN", "SNAKE", "PAPER", "GLOVE"], positions: [2, 2, 2, 2], expectedExtraction: "ONAL", meaningful: false },
    ],
  },
  {
    id: "WFM-BANK-ORD-006",
    mode: "MULTI_WORD_POSITIONS",
    difficulty: "HARD",
    options: [
      { words: ["MANGO", "STONE", "ALERT", "CLOUD"], positions: [4, 3, 2, 5], expectedExtraction: "GOLD", meaningful: true },
      { words: ["BRICK", "HOUSE", "PLANT", "WATER"], positions: [2, 4, 1, 5], expectedExtraction: "RSP R".replace(" ", ""), meaningful: false },
      { words: ["TIGER", "CABLE", "ROBIN", "PEARL"], positions: [3, 5, 2, 1], expectedExtraction: "GBOP", meaningful: false },
      { words: ["LIGHT", "GREEN", "STONE", "MANGO"], positions: [4, 2, 5, 1], expectedExtraction: "HER M".replace(" ", ""), meaningful: false },
      { words: ["SNAKE", "PAPER", "GLOVE", "BRICK"], positions: [5, 1, 3, 2], expectedExtraction: "EAVR", meaningful: false },
    ],
  },
] as const;

for (const fixture of WFM_BANKING_ORDERED_EXTRACTION_FIXTURES) {
  const meaningful = fixture.options.filter((option) => option.meaningful);
  if (meaningful.length !== 1) {
    throw new Error(`${fixture.id}: requires exactly one meaningful extraction`);
  }
  for (const option of fixture.options) {
    const actual = extract(option);
    if (actual !== option.expectedExtraction) {
      throw new Error(`${fixture.id}: extraction drift ${actual} !== ${option.expectedExtraction}`);
    }
    if (option.words.length !== 1 && option.words.length !== option.positions.length) {
      throw new Error(`${fixture.id}: invalid word/position cardinality`);
    }
  }
}

export function extractOrderedBankingLetters(option: WfmOrderedExtractionOptionAuthority): string {
  return extract(option);
}
