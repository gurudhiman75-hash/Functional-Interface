import { shuffle } from "../foundation/prng";
import type { AlpDifficulty, AlpLocale, AlpOption, AlpQuestionLogic } from "../types";

export const A = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
export const D = [..."0123456789"];
export const S = ["@", "#", "$", "%", "&", "*", "+", "?"];

export const WORDS = [
  "SABERTOOTH", "ACHIEVEMENTS", "STREAMING", "DAREDEVIL", "GOVERNMENT", "VIRTUAL", "PACKETS", "WONDERS", "FORMATION", "BACKFIELDS", "COMPREHENSION", "IMAGINARY",
  "ADVENTURE", "AIRPORT", "ALGORITHM", "ANCHOR", "ANIMAL", "ARCHITECT", "BALANCE", "BARRIER", "BATTERY", "BEACON", "BICYCLE", "BORDER", "BRIDGE", "BRIGHT", "BROTHER",
  "CABINET", "CANDLE", "CAPTURE", "CAREER", "CARPET", "CASTLE", "CHANNEL", "CIRCLE", "CLIMATE", "COLLEGE", "COMMITTEE", "COMPASS", "COMPUTER", "COUNTRY", "COURAGE", "CRYSTAL",
  "DANCER", "DEPARTMENT", "DESERT", "DIAMOND", "DINNER", "DOCTOR", "DOCUMENT", "DRIVER", "EARTH", "EDUCATION", "ENGINE", "EVENING", "FACTORY", "FAMILY", "FARMER", "FESTIVAL",
  "FLOWER", "FOREST", "FORMULA", "FRIEND", "FUTURE", "GARDEN", "GENERAL", "GLASS", "GOLDEN", "GRAPH", "HEALTH", "HIGHWAY", "HISTORY", "HOSPITAL", "JOURNEY", "KITCHEN", "LANGUAGE",
  "LETTER", "LIBRARY", "MACHINE", "MARKET", "MASTER", "MATERIAL", "MEMORY", "MIRROR", "MOBILE", "MORNING", "MOUNTAIN", "NATION", "NATURE", "NUMBER", "OFFICE", "ORANGE", "PACKAGE",
  "PAINTING", "PEOPLE", "PLANET", "POCKET", "POLICE", "POWER", "PROCESS", "PROJECT", "QUALITY", "RAILWAY", "REASON", "RECORD", "REGION", "RIVER", "SCHOOL", "SCIENCE", "SECTION",
  "SERVICE", "SIGNAL", "SILVER", "SOLDIER", "SPIRIT", "STATION", "STREAM", "STUDENT", "SUCCESS", "SYSTEM", "TEACHER", "TEMPLE", "THEORY", "TRAVEL", "TREASURE", "VALLEY", "WINDOW",
  "WINTER", "WORKER", "WORLD", "WRITER", "ADDRESS", "BALLOON", "ASSESS", "TOMATO", "POETRY", "CAMERA", "CENTRE", "CHAPTER", "CURRENCY", "DEGREE", "ENERGY", "FIELD", "FLIGHT",
  "FOOTBALL", "FREEDOM", "GROWTH", "HARVEST", "HOTEL", "IDEA", "INDUSTRY", "INTERNET", "ISLAND", "JACKET", "JUSTICE", "KINGDOM", "KNOWLEDGE", "LEADER", "LESSON",
  "MANAGER", "MINUTE", "MUSEUM", "MUSIC", "NETWORK", "NOTICE", "OBJECT", "PAPER", "PARENT", "PATTERN", "PERSON", "PICTURE", "QUESTION", "ROAD", "SAFETY", "SAMPLE", "SHADOW",
  "SOCIETY", "SPORTS", "STORY", "STREET", "SUBJECT", "TARGET", "TECHNOLOGY", "TRAIN", "UNIVERSE", "VEHICLE", "VILLAGE", "VISION", "WEATHER", "WEEKEND", "WORKSHOP",
] as const;

export const CLASS_WORDS = WORDS.filter((word) => word.length >= 6 && word.length <= 10);

export type L = { en: string; hi: string; pa: string };
export type C = { source: string[]; changed?: string[]; word?: string; changedWord?: string; answer: string; pool: string[]; operation: L; query: L; working: L; shortcut: L };

type TrapCandidate = { value: string; errorLabel: string };

export const tr = (locale: AlpLocale, text: L) => locale === "hi-IN" ? text.hi : locale === "pa-IN" ? text.pa : text.en;
export const key = (ql: AlpQuestionLogic, seed: number, salt: string) => `${ql.qlId}:${seed}:${salt}`;
export const rank = (token: string) => token.charCodeAt(0) - 64;
export const shift = (token: string, amount: number) => A[((rank(token) - 1 + amount) % 26 + 26) % 26]!;
export const vowel = (token: string) => "AEIOU".includes(token);
export const letter = (token: string) => /^[A-Z]$/.test(token);
export const digit = (token: string) => /^\d$/.test(token);
export const symbol = (token: string) => !letter(token) && !digit(token);
export const swap = <T>(items: readonly T[]) => {
  const result = [...items];
  for (let index = 0; index + 1 < result.length; index += 2) {
    [result[index], result[index + 1]] = [result[index + 1]!, result[index]!];
  }
  return result;
};
export const track = (items: readonly string[]) => items.map((token, index) => ({ token, position: index + 1, reversePosition: items.length - index }));
export const nums = (answer: number, maximum = 99) => [answer, Math.max(0, answer - 1), answer + 1, Math.max(0, answer - 2), answer + 2, Math.max(0, answer - 3), answer + 3].filter((value) => value === answer || value <= maximum).map(String);
export const seqMiss = (value: string) => [value, [...value].reverse().join(""), swap([...value]).join(""), [...value.slice(1), value[0]!].join(""), `${value.slice(0, -1)}${value[0]}`];

export function cyclePick<T>(items: readonly T[], ql: AlpQuestionLogic, seed: number, salt = "cycle"): T {
  if (!items.length) throw new Error(`${ql.qlId} cannot cycle an empty pool.`);
  const qlNumber = Number.parseInt(ql.qlId.slice(-3), 10) || 0;
  const saltOffset = [...salt].reduce((total, char) => total + char.charCodeAt(0), 0);
  const index = ((seed + qlNumber * 17 + saltOffset) % items.length + items.length) % items.length;
  return items[index]!;
}

export function allPairs(items: readonly string[]) {
  const pairs: string[] = [];
  for (let first = 0; first < items.length; first += 1) {
    for (let second = first + 1; second < items.length; second += 1) pairs.push(`${items[first]} : ${items[second]}`);
  }
  return [...new Set(pairs)];
}

function uniqueCandidates(candidates: readonly TrapCandidate[], answer: string): TrapCandidate[] {
  const seen = new Set<string>([answer]);
  const result: TrapCandidate[] = [];
  for (const candidate of candidates) {
    if (!candidate.value || seen.has(candidate.value)) continue;
    seen.add(candidate.value);
    result.push(candidate);
  }
  return result;
}

function numberCandidates(answer: string): TrapCandidate[] {
  const value = Number(answer);
  if (!Number.isFinite(value)) return [];
  return [
    { value: String(Math.max(0, value - 1)), errorLabel: "OFF_BY_ONE_LOW" },
    { value: String(value + 1), errorLabel: "OFF_BY_ONE_HIGH" },
    { value: String(Math.max(0, value - 2)), errorLabel: "TWO_STEP_MISCOUNT_LOW" },
    { value: String(value + 2), errorLabel: "TWO_STEP_MISCOUNT_HIGH" },
    { value: String(Math.max(0, value - 3)), errorLabel: "BROADER_COUNT_MISCOUNT_LOW" },
    { value: String(value + 3), errorLabel: "BROADER_COUNT_MISCOUNT_HIGH" },
  ];
}

function letterCandidates(answer: string): TrapCandidate[] {
  if (!letter(answer)) return [];
  const opposite = A[26 - rank(answer)]!;
  return [
    { value: shift(answer, -1), errorLabel: "STOPPED_ONE_STEP_EARLY" },
    { value: shift(answer, 1), errorLabel: "STOPPED_ONE_STEP_LATE" },
    { value: shift(answer, -2), errorLabel: "TWO_STEP_POSITION_MISCOUNT" },
    { value: shift(answer, 2), errorLabel: "TWO_STEP_POSITION_MISCOUNT" },
    { value: opposite, errorLabel: "USED_OPPOSITE_REFERENCE" },
  ];
}

function tokenCandidates(answer: string, pool: readonly string[]): TrapCandidate[] {
  if (letter(answer)) return letterCandidates(answer);
  if (digit(answer)) {
    const value = Number(answer);
    return [
      { value: String((value + 9) % 10), errorLabel: "ADJACENT_DIGIT_MISREAD" },
      { value: String((value + 1) % 10), errorLabel: "ADJACENT_DIGIT_MISREAD" },
      { value: String((value + 8) % 10), errorLabel: "TWO_POSITION_DIGIT_MISREAD" },
      { value: String((value + 2) % 10), errorLabel: "TWO_POSITION_DIGIT_MISREAD" },
    ];
  }
  return pool.filter((value) => value !== answer).map((value, index) => ({
    value,
    errorLabel: index % 2 === 0 ? "WRONG_POSITION_TOKEN" : "WRONG_REFERENCE_SCAN",
  }));
}

function sequenceCandidates(answer: string, pool: readonly string[], ql: AlpQuestionLogic): TrapCandidate[] {
  if (ql.solveMode === "IDENTIFY_WORD_BY_ALPHA_PAIR_COUNT") {
    return pool.filter((value) => value !== answer).map((value) => ({ value, errorLabel: "WRONG_PAIR_COUNT_WORD" }));
  }
  const reversed = [...answer].reverse().join("");
  const swapped = swap([...answer]).join("");
  const rotated = answer.length > 1 ? `${answer.slice(1)}${answer[0]}` : answer;
  const partial = answer.length > 1 ? `${answer.slice(0, -1)}${answer[0]}` : answer;
  return [
    { value: reversed, errorLabel: "REVERSED_FINAL_RESULT" },
    { value: swapped, errorLabel: "ADJACENT_SWAP_INSTEAD" },
    { value: rotated, errorLabel: "ROTATED_RESULT" },
    { value: partial, errorLabel: "PARTIAL_TRANSFORMATION" },
    ...pool.filter((value) => value !== answer).map((value) => ({ value, errorLabel: "INCOMPLETE_TRANSFORMATION" })),
  ];
}

function misconceptionCandidates(answer: string, pool: readonly string[], ql: AlpQuestionLogic): TrapCandidate[] {
  if (ql.answerType === "NUMBER") return numberCandidates(answer);
  if (ql.answerType === "LETTER") return letterCandidates(answer);
  if (ql.answerType === "TOKEN") return tokenCandidates(answer, pool);
  if (ql.answerType === "TOKEN_PAIR") return pool.filter((value) => value !== answer).map((value) => ({ value, errorLabel: "PAIR_RELATION_MISMATCH" }));
  if (ql.answerType === "TOKEN_SEQUENCE") return sequenceCandidates(answer, pool, ql);
  return pool.filter((value) => value !== answer).map((value) => ({ value, errorLabel: "FINAL_CONDITION_MISMATCH" }));
}

function shapedFallback(answer: string, ql: AlpQuestionLogic): TrapCandidate[] {
  const values = ql.answerType === "NUMBER"
    ? Array.from({ length: 100 }, (_, index) => String(index))
    : ql.answerType === "TOKEN_PAIR"
      ? allPairs([...A.slice(0, 8), ...D])
      : ql.answerType === "TOKEN_SEQUENCE"
        ? [...seqMiss(answer), ...WORDS, ...CLASS_WORDS]
        : ql.answerType === "LETTER"
          ? A
          : [...A, ...D, ...S];
  return values.map((value) => ({ value, errorLabel: "DOMAIN_VALID_FALLBACK" }));
}

export function options(answer: string, pool: readonly string[], ql: AlpQuestionLogic, seed: number) {
  let candidates = uniqueCandidates(misconceptionCandidates(answer, pool, ql), answer);
  if (candidates.length < 3) candidates = uniqueCandidates([...candidates, ...shapedFallback(answer, ql)], answer);
  if (candidates.length < 3) throw new Error(`${ql.qlId} cannot produce three misconception-owned distractors.`);

  const wrong = shuffle(candidates, key(ql, seed, "misconception-options")).slice(0, 3);
  const chosen: AlpOption[] = [{ value: answer, errorLabel: null }, ...wrong.map((candidate) => ({ value: candidate.value, errorLabel: candidate.errorLabel }))];
  const order = shuffle(chosen, key(ql, seed, "option-order"));
  const correctIndex = order.findIndex((option) => option.value === answer);
  if (correctIndex < 0 || new Set(order.map((option) => option.value)).size !== 4) throw new Error(`${ql.qlId} invalid options`);
  return { out: order, correctIndex };
}

export function difficulty(ql: AlpQuestionLogic, _seed: number): AlpDifficulty {
  const mode = ql.solveMode;

  const hard = new Set([
    "IDENTIFY_WORD_BY_ALPHA_PAIR_COUNT",
    "COUNT_WORD_ALPHA_PAIRS_AFTER_REVERSE",
    "CLASS_SHIFT_SORTED_LETTER_AT_POSITION",
    "CLASS_SHIFT_SORTED_POSITION_OF_LETTER",
    "CLASS_TWO_STAGE_LETTER_AT_POSITION",
    "IDENTIFY_DIGIT_GAP_PAIR",
    "DIGIT_COUNT_UNCHANGED_SELECTED_TRANSFORM",
    "COUNT_VOWEL_FOLLOWED_BY_DIGIT",
    "COUNT_EVEN_DIGIT_PRECEDED_BY_SYMBOL",
    "NTH_SYMBOL_FROM_RIGHT",
    "MIXED_SORT_LETTERS_IN_PLACE_POSITION",
    "MIXED_SORT_DIGITS_IN_PLACE_POSITION",
    "MIXED_REVERSE_LETTERS_IN_PLACE_POSITION",
    "MIXED_REVERSE_DIGITS_IN_PLACE_POSITION",
    "MIXED_POSITION_OF_TOKEN_AFTER_GROUP",
    "MIXED_COUNT_UNCHANGED_AFTER_TRANSFORM",
    "MIXED_COUNT_ADJACENCY_AFTER_TRANSFORM",
  ]);
  if (hard.has(mode)) return "HARD";

  const easy = new Set([
    "DIGIT_AT_LEFT_POSITION",
    "DIGIT_AT_RIGHT_POSITION",
    "MIXED_ELEMENT_FROM_LEFT",
    "MIXED_ELEMENT_FROM_RIGHT",
  ]);
  if (easy.has(mode)) return "EASY";

  return "MEDIUM";
}

export function wordPairs(word: string, direction: "BOTH" | "FORWARD" | "BACKWARD" = "BOTH") {
  const tokens = [...word];
  const pairs: Array<readonly [string, string]> = [];
  for (let first = 0; first < tokens.length; first += 1) {
    for (let second = first + 1; second < tokens.length; second += 1) {
      if (second - first !== Math.abs(rank(tokens[first]!) - rank(tokens[second]!))) continue;
      const forward = rank(tokens[first]!) < rank(tokens[second]!);
      if ((direction === "FORWARD" && !forward) || (direction === "BACKWARD" && forward)) continue;
      pairs.push([tokens[first]!, tokens[second]!] as const);
    }
  }
  return pairs;
}

export function mixed(ql: AlpQuestionLogic, seed: number) {
  return shuffle([
    ...shuffle(A, key(ql, seed, "letters")).slice(0, 8),
    ...shuffle(D, key(ql, seed, "digits")).slice(0, 8),
    ...shuffle(S, key(ql, seed, "symbols")),
  ], key(ql, seed, "mixed"));
}

export const adj = (items: readonly string[], first: (value: string) => boolean, second: (value: string) => boolean) => items.slice(0, -1).filter((value, index) => first(value) && second(items[index + 1]!)).length;
