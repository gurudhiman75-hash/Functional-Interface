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

const KNOWN_COMMON_EXTRACTIONS = new Set([
  "WIND",
  "PART",
  "MATH",
  "BODE",
  "RAIN",
  "GOLD",
  "TREE",
  "BOOK",
  "STAR",
  "HOME",
  "FIRE",
  "NOTE",
  "LOAD",
  "INCH",
]);

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
      { words: ["EDUCATION"], positions: [1, 3, 5, 8], expectedExtraction: "EUAO", meaningful: false },
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
      { words: ["TIGER", "PLANT", "CLOUD", "BEACH"], positions: [2, 4, 1, 4], expectedExtraction: "INCC", meaningful: false },
      { words: ["HOUSE", "BRICK", "MANGO", "WATER"], positions: [3, 2, 4, 1], expectedExtraction: "URGW", meaningful: false },
      { words: ["LIGHT", "STONE", "PAPER", "CLOUD"], positions: [1, 3, 2, 4], expectedExtraction: "LOAU", meaningful: false },
      { words: ["GREEN", "TABLE", "SNAKE", "PEARL"], positions: [4, 2, 5, 1], expectedExtraction: "EAEP", meaningful: false },
    ],
  },
  {
    id: "WFM-BANK-ORD-005",
    mode: "MULTI_WORD_POSITIONS",
    difficulty: "MEDIUM",
    options: [
      { words: ["BRAVE", "CABLE", "TIGER", "SNAKE"], positions: [2, 2, 2, 2], expectedExtraction: "RAIN", meaningful: true },
      { words: ["PLANT", "HOUSE", "BRICK", "WATER"], positions: [2, 2, 2, 2], expectedExtraction: "LORA", meaningful: false },
      { words: ["MANGO", "GREEN", "CLOUD", "PEARL"], positions: [2, 2, 2, 2], expectedExtraction: "ARLE", meaningful: false },
      { words: ["STONE", "TABLE", "LIGHT", "CHAIR"], positions: [2, 2, 2, 2], expectedExtraction: "TAIH", meaningful: false },
      { words: ["ROBIN", "SNAKE", "PAPER", "GLOVE"], positions: [2, 2, 2, 2], expectedExtraction: "ONAL", meaningful: false },
    ],
  },
  {
    id: "WFM-BANK-ORD-006",
    mode: "MULTI_WORD_POSITIONS",
    difficulty: "HARD",
    options: [
      { words: ["MANGO", "STONE", "ALERT", "CLOUD"], positions: [4, 3, 2, 5], expectedExtraction: "GOLD", meaningful: true },
      { words: ["BRICK", "HOUSE", "PLANT", "WATER"], positions: [2, 4, 1, 5], expectedExtraction: "RSPR", meaningful: false },
      { words: ["TIGER", "CABLE", "ROBIN", "PEARL"], positions: [3, 5, 2, 1], expectedExtraction: "GEOP", meaningful: false },
      { words: ["LIGHT", "GREEN", "STONE", "MANGO"], positions: [4, 2, 5, 1], expectedExtraction: "HREM", meaningful: false },
      { words: ["SNAKE", "PAPER", "GLOVE", "BRICK"], positions: [5, 1, 3, 2], expectedExtraction: "EPOR", meaningful: false },
    ],
  },
  {
    id: "WFM-BANK-ORD-007",
    mode: "MULTI_WORD_POSITIONS",
    difficulty: "EASY",
    options: [
      { words: ["TIGER", "ROSE", "EAGLE", "ENGINE"], positions: [1, 1, 1, 1], expectedExtraction: "TREE", meaningful: true },
      { words: ["CLOUD", "MANGO", "SNAKE", "PAPER"], positions: [1, 1, 1, 1], expectedExtraction: "CMSP", meaningful: false },
      { words: ["HOUSE", "GREEN", "TABLE", "LIGHT"], positions: [1, 1, 1, 1], expectedExtraction: "HGTL", meaningful: false },
      { words: ["BRAVE", "STONE", "PEARL", "CLOUD"], positions: [1, 1, 1, 1], expectedExtraction: "BSPC", meaningful: false },
      { words: ["LIGHT", "APPLE", "WATER", "MANGO"], positions: [1, 1, 1, 1], expectedExtraction: "LAWM", meaningful: false },
    ],
  },
  {
    id: "WFM-BANK-ORD-008",
    mode: "MULTI_WORD_POSITIONS",
    difficulty: "EASY",
    options: [
      { words: ["BRAVE", "OCEAN", "ORANGE", "KING"], positions: [1, 1, 1, 1], expectedExtraction: "BOOK", meaningful: true },
      { words: ["TIGER", "ROSE", "APPLE", "SNAKE"], positions: [1, 1, 1, 1], expectedExtraction: "TRAS", meaningful: false },
      { words: ["HOUSE", "MANGO", "LIGHT", "PEARL"], positions: [1, 1, 1, 1], expectedExtraction: "HMLP", meaningful: false },
      { words: ["CLOUD", "APPLE", "BRICK", "WATER"], positions: [1, 1, 1, 1], expectedExtraction: "CABW", meaningful: false },
      { words: ["MANGO", "STONE", "TIGER", "GREEN"], positions: [1, 1, 1, 1], expectedExtraction: "MSTG", meaningful: false },
    ],
  },
  {
    id: "WFM-BANK-ORD-009",
    mode: "MULTI_WORD_POSITIONS",
    difficulty: "MEDIUM",
    options: [
      { words: ["SNAKE", "TIGER", "APPLE", "ROSE"], positions: [1, 1, 1, 1], expectedExtraction: "STAR", meaningful: true },
      { words: ["CLOUD", "BRAVE", "PEARL", "GREEN"], positions: [1, 1, 1, 1], expectedExtraction: "CBPG", meaningful: false },
      { words: ["HOUSE", "MANGO", "LIGHT", "WATER"], positions: [1, 1, 1, 1], expectedExtraction: "HMLW", meaningful: false },
      { words: ["ROBIN", "EAGLE", "CLOUD", "STONE"], positions: [1, 1, 1, 1], expectedExtraction: "RECS", meaningful: false },
      { words: ["PLANT", "GLOVE", "MANGO", "TABLE"], positions: [1, 1, 1, 1], expectedExtraction: "PGMT", meaningful: false },
    ],
  },
  {
    id: "WFM-BANK-ORD-010",
    mode: "MULTI_WORD_POSITIONS",
    difficulty: "MEDIUM",
    options: [
      { words: ["HOUSE", "OCEAN", "MANGO", "EAGLE"], positions: [1, 1, 1, 1], expectedExtraction: "HOME", meaningful: true },
      { words: ["BRICK", "STONE", "CLOUD", "PLANT"], positions: [1, 1, 1, 1], expectedExtraction: "BSCP", meaningful: false },
      { words: ["TIGER", "GREEN", "PAPER", "LIGHT"], positions: [1, 1, 1, 1], expectedExtraction: "TGPL", meaningful: false },
      { words: ["ROBIN", "CABLE", "WATER", "SNAKE"], positions: [1, 1, 1, 1], expectedExtraction: "RCWS", meaningful: false },
      { words: ["MANGO", "TABLE", "BRAVE", "STONE"], positions: [1, 1, 1, 1], expectedExtraction: "MTBS", meaningful: false },
    ],
  },
  {
    id: "WFM-BANK-ORD-011",
    mode: "MULTI_WORD_POSITIONS",
    difficulty: "HARD",
    options: [
      { words: ["COFFEE", "TIGER", "BRICK", "GREEN"], positions: [3, 2, 2, 3], expectedExtraction: "FIRE", meaningful: true },
      { words: ["HOUSE", "STONE", "CLOUD", "PAPER"], positions: [3, 2, 2, 3], expectedExtraction: "UTLP", meaningful: false },
      { words: ["MANGO", "TABLE", "SNAKE", "GLOVE"], positions: [3, 2, 2, 4], expectedExtraction: "NANV", meaningful: false },
      { words: ["ROBIN", "CABLE", "WATER", "LIGHT"], positions: [3, 2, 2, 3], expectedExtraction: "BAAG", meaningful: false },
      { words: ["PLANT", "TIGER", "PAPER", "STONE"], positions: [3, 2, 2, 3], expectedExtraction: "AIAO", meaningful: false },
    ],
  },
  {
    id: "WFM-BANK-ORD-012",
    mode: "MULTI_WORD_POSITIONS",
    difficulty: "HARD",
    options: [
      { words: ["ROBIN", "STONE", "CLOUD", "SNAKE"], positions: [3, 3, 3, 4], expectedExtraction: "BOOK", meaningful: true },
      { words: ["BRAVE", "MANGO", "LIGHT", "WATER"], positions: [3, 3, 3, 4], expectedExtraction: "ANGE", meaningful: false },
      { words: ["HOUSE", "TABLE", "PAPER", "GREEN"], positions: [3, 3, 3, 4], expectedExtraction: "UBPE", meaningful: false },
      { words: ["TIGER", "CABLE", "STONE", "PLANT"], positions: [3, 3, 3, 4], expectedExtraction: "GBON", meaningful: false },
      { words: ["MANGO", "BRICK", "CLOUD", "PEARL"], positions: [3, 3, 3, 4], expectedExtraction: "NIOR", meaningful: false },
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
    if (option.meaningful && !KNOWN_COMMON_EXTRACTIONS.has(actual)) {
      throw new Error(`${fixture.id}: meaningful extraction ${actual} is not in the governed common-word authority`);
    }
    if (!option.meaningful && KNOWN_COMMON_EXTRACTIONS.has(actual)) {
      throw new Error(`${fixture.id}: non-answer extraction ${actual} is also a governed common word`);
    }
    if (option.words.length !== 1 && option.words.length !== option.positions.length) {
      throw new Error(`${fixture.id}: invalid word/position cardinality`);
    }
  }
}

export function extractOrderedBankingLetters(option: WfmOrderedExtractionOptionAuthority): string {
  return extract(option);
}
