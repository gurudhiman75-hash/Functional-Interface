import { VOWELS, normalizeLetter } from "./alphabet";
import { evenThenOdd, oddThenEven, swapAdjacent } from "./sequence";
import type { AlpOccurrenceRef, AlpWordTransformId } from "../types";

/**
 * Governed CP005 word reservoir.
 *
 * Keep this as familiar A-Z exam vocabulary rather than synthesizing runtime
 * strings. The pool deliberately mixes word lengths, repeated-letter shapes
 * and vowel/consonant topologies so the learner cannot memorize the tiny
 * legacy 24-word surface.
 */
export const WORD_BANK = Object.freeze([
  "SABERTOOTH", "ACHIEVEMENTS", "STREAMING", "DAREDEVIL", "GOVERNMENT", "VIRTUAL", "PACKETS", "WONDERS",
  "FORMATION", "BACKFIELDS", "COMPREHENSION", "IMAGINARY", "ADVENTURE", "AIRPORT", "ALGORITHM", "ANCHOR",
  "ANIMAL", "ARCHITECT", "BALANCE", "BARRIER", "BATTERY", "BEACON", "BICYCLE", "BORDER",
  "BRIDGE", "BRIGHT", "BROTHER", "CABINET", "CANDLE", "CAPTURE", "CAREER", "CARPET",
  "CASTLE", "CHANNEL", "CIRCLE", "CLIMATE", "COLLEGE", "COMMITTEE", "COMPASS", "COMPUTER",
  "COUNTRY", "COURAGE", "CRYSTAL", "DANCER", "DEPARTMENT", "DESERT", "DIAMOND", "DINNER",
  "DOCTOR", "DOCUMENT", "DRIVER", "EARTH", "EDUCATION", "ENGINE", "EVENING", "FACTORY",
  "FAMILY", "FARMER", "FESTIVAL", "FLOWER", "FOREST", "FORMULA", "FRIEND", "FUTURE",
  "GARDEN", "GENERAL", "GLASS", "GOLDEN", "GRAPH", "HEALTH", "HIGHWAY", "HISTORY",
  "HOSPITAL", "JOURNEY", "KITCHEN", "LANGUAGE", "LETTER", "LIBRARY", "MACHINE", "MARKET",
  "MASTER", "MATERIAL", "MEMORY", "MIRROR", "MOBILE", "MORNING", "MOUNTAIN", "NATION",
  "NATURE", "NUMBER", "OFFICE", "ORANGE", "PACKAGE", "PAINTING", "PEOPLE", "PLANET",
  "POCKET", "POLICE", "POWER", "PROCESS", "PROJECT", "QUALITY", "RAILWAY", "REASON",
  "RECORD", "REGION", "RIVER", "SCHOOL", "SCIENCE", "SECTION", "SERVICE", "SIGNAL",
  "SILVER", "SOLDIER", "SPIRIT", "STATION", "STREAM", "STUDENT", "SUCCESS", "SYSTEM",
  "TEACHER", "TEMPLE", "THEORY", "TRAVEL", "TREASURE", "VALLEY", "WINDOW", "WINTER",
  "WORKER", "WORLD", "WRITER", "ADDRESS", "BALLOON", "ASSESS", "TOMATO", "POETRY",
  "CAMERA", "CENTRE", "CHAPTER", "CURRENCY", "DEGREE", "ENERGY", "FIELD", "FLIGHT",
  "FOOTBALL", "FREEDOM", "GROWTH", "HARVEST", "HOTEL", "IDEA", "INDUSTRY", "INTERNET",
  "ISLAND", "JACKET", "JUSTICE", "KINGDOM", "KNOWLEDGE", "LEADER", "LESSON", "MANAGER",
  "MINUTE", "MUSEUM", "MUSIC", "NETWORK", "NOTICE", "OBJECT", "PAPER", "PARENT",
  "PATTERN", "PERSON", "PICTURE", "QUESTION", "ROAD", "SAFETY", "SAMPLE", "SHADOW",
  "SOCIETY", "SPORTS", "STORY", "STREET", "SUBJECT", "TARGET", "TECHNOLOGY", "TRAIN",
  "UNIVERSE", "VEHICLE", "VILLAGE", "VISION", "WEATHER", "WEEKEND", "WORKSHOP", "ABILITY",
  "ACCOUNT", "AIRLINE", "ANCIENT", "ANOTHER", "ARRIVAL", "ARTICLE", "AVERAGE", "BARGAIN",
  "BEDROOM", "BENEFIT", "CAPITAL", "CAPTAIN", "CENTURY", "CHICKEN", "CITIZEN", "COMPANY",
  "CONTROL", "CULTURE", "DANGEROUS", "DIGITAL", "DISPLAY", "ECONOMY", "ELEMENT", "EXAMPLE",
  "EXPRESS", "FEATURE", "FINANCE", "HOLIDAY", "IMAGINE", "JOURNAL", "JUSTIFY", "MESSAGE",
  "NATURAL", "OFFICER", "PASSAGE", "PAYMENT", "PENSION", "PERFECT", "PROBLEM", "RESPECT",
  "SCIENTIST", "STORAGE", "SUPPORT", "TRAFFIC", "VICTORY", "WARNING", "WELCOME", "BOUNDARY",
  "BUILDING", "BUSINESS", "CHILDREN", "DECISION", "DISTRICT", "ELECTION", "EMERGENCY", "EMPLOYEE",
  "ENTRANCE", "ENVIRONMENT", "EXCHANGE", "EXPERIENCE", "GALLERY", "HARMONY", "INFORMATION", "MAGAZINE",
  "MEETING", "OPINION", "OPPORTUNITY", "PASSENGER", "PRACTICE", "PRESIDENT", "REGULAR", "RESEARCH",
  "RESOURCE", "SENTENCE", "SOLUTION", "STANDARD", "TRANSPORT", "UNIFORM",
]);

export function normalizeWord(word: string): string {
  const normalized = word.trim().toUpperCase();
  if (!/^[A-Z]+$/.test(normalized)) throw new Error(`Expected an A-Z word, received: ${word}`);
  return normalized;
}

export function occurrenceRefs(word: string): AlpOccurrenceRef[] {
  const counts = new Map<string, number>();
  return [...normalizeWord(word)].map((letter) => {
    const occurrence = (counts.get(letter) ?? 0) + 1;
    counts.set(letter, occurrence);
    return { letter, occurrence };
  });
}

export function occurrenceLabel(ref: AlpOccurrenceRef): string {
  const suffix = ref.occurrence === 1 ? "first" : ref.occurrence === 2 ? "second" : ref.occurrence === 3 ? "third" : `${ref.occurrence}th`;
  return `${suffix} ${ref.letter}`;
}

export function findOccurrencePosition(word: string, ref: AlpOccurrenceRef): number {
  let seen = 0;
  for (const [index, letter] of [...normalizeWord(word)].entries()) {
    if (letter !== normalizeLetter(ref.letter)) continue;
    seen += 1;
    if (seen === ref.occurrence) return index + 1;
  }
  throw new Error(`${occurrenceLabel(ref)} is absent from ${word}.`);
}

export function occurrenceAtPosition(word: string, position: number): AlpOccurrenceRef {
  const refs = occurrenceRefs(word);
  const ref = refs[position - 1];
  if (!ref) throw new Error(`Position ${position} is outside ${word}.`);
  return ref;
}

export function stableSortRefs(refs: readonly AlpOccurrenceRef[], direction: "ASC" | "DESC"): AlpOccurrenceRef[] {
  return refs
    .map((ref, originalIndex) => ({ ref, originalIndex }))
    .sort((first, second) => {
      const comparison = first.ref.letter.localeCompare(second.ref.letter);
      return (direction === "ASC" ? comparison : -comparison) || first.originalIndex - second.originalIndex;
    })
    .map(({ ref }) => ref);
}

export function refsToWord(refs: readonly AlpOccurrenceRef[]): string {
  return refs.map((ref) => ref.letter).join("");
}

export function reverseRange<T>(items: readonly T[], start: number, end: number): T[] {
  if (!Number.isInteger(start) || !Number.isInteger(end) || start < 1 || end > items.length || start >= end) {
    throw new Error(`Invalid reverse range ${start}..${end} for length ${items.length}.`);
  }
  return [...items.slice(0, start - 1), ...items.slice(start - 1, end).reverse(), ...items.slice(end)];
}

export function applyWordTransformRefs(
  word: string,
  transformId: AlpWordTransformId,
  rangeStart?: number,
  rangeEnd?: number,
): AlpOccurrenceRef[] {
  const refs = occurrenceRefs(word);
  switch (transformId) {
    case "REVERSE": return [...refs].reverse();
    case "ASC_SORT": return stableSortRefs(refs, "ASC");
    case "DESC_SORT": return stableSortRefs(refs, "DESC");
    case "VOWELS_FIRST": return [...refs.filter((ref) => VOWELS.has(ref.letter)), ...refs.filter((ref) => !VOWELS.has(ref.letter))];
    case "CONSONANTS_FIRST": return [...refs.filter((ref) => !VOWELS.has(ref.letter)), ...refs.filter((ref) => VOWELS.has(ref.letter))];
    case "ODD_THEN_EVEN": return oddThenEven(refs);
    case "EVEN_THEN_ODD": return evenThenOdd(refs);
    case "SWAP_ADJACENT": return swapAdjacent(refs);
    case "REVERSE_RANGE": return reverseRange(refs, rangeStart!, rangeEnd!);
  }
}

export function transformedOccurrencePosition(
  word: string,
  transformId: AlpWordTransformId,
  ref: AlpOccurrenceRef,
  rangeStart?: number,
  rangeEnd?: number,
): number {
  const transformed = applyWordTransformRefs(word, transformId, rangeStart, rangeEnd);
  const index = transformed.findIndex((candidate) => candidate.letter === ref.letter && candidate.occurrence === ref.occurrence);
  if (index < 0) throw new Error(`Occurrence ${occurrenceLabel(ref)} was lost during transformation.`);
  return index + 1;
}

export function unchangedRefs(word: string, transformId: AlpWordTransformId, rangeStart?: number, rangeEnd?: number): AlpOccurrenceRef[] {
  const source = occurrenceRefs(word);
  const transformed = applyWordTransformRefs(word, transformId, rangeStart, rangeEnd);
  return source.filter((ref, index) => transformed[index]?.letter === ref.letter && transformed[index]?.occurrence === ref.occurrence);
}
