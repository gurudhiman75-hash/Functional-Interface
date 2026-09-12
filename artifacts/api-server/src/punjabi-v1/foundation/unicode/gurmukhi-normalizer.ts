/**
 * Gurmukhi Unicode Normalizer & Character Classifier
 * Enforces canonical representations, NFC normalization, Nukta unification,
 * and Lagan/Lagakhar sequence invariants.
 */

// Gurmukhi Unicode Block: U+0A00 to U+0A7F

export const GURMUKHI_VOWEL_CARRIERS = ["ੳ", "ਅ", "ੲ"] as const;
export type GurmukhiVowelCarrier = (typeof GURMUKHI_VOWEL_CARRIERS)[number];

export const GURMUKHI_INDEPENDENT_VOWELS = [
  "ਅ", "ਆ", "ਇ", "ਈ", "ਉ", "ਊ", "ਏ", "ਐ", "ਓ", "ਔ"
] as const;

export const GURMUKHI_CONSONANTS = [
  "ਸ", "ਹ",
  "ਕ", "ਖ", "ਗ", "ਘ", "ਙ",
  "ਚ", "ਛ", "ਜ", "ਝ", "ਞ",
  "ਟ", "ਠ", "ਡ", "ਢ", "ਣ",
  "ਤ", "ਥ", "ਦ", "ਧ", "ਨ",
  "ਪ", "ਫ", "ਬ", "ਭ", "ਮ",
  "ਯ", "ਰ", "ਲ", "ਵ", "ੜ",
  // ਨਵੀਨ ਟੋਲੀ (Pairin Bindi)
  "ਸ਼", "ਖ਼", "ਗ਼", "ਜ਼", "ਫ਼", "ਲ਼"
] as const;

export const GURMUKHI_NASAL_CONSONANTS = ["ਙ", "ਞ", "ਣ", "ਨ", "ਮ"] as const;

export const GURMUKHI_DUTT_LETTERS = ["ਹ", "ਰ", "ਵ"] as const;

export interface LaganDefinition {
  name: string;
  nameEn: string;
  symbol: string; // empty string for Mukta
  unicodeCodePoint: string;
  carrierVowel: GurmukhiVowelCarrier | "all_consonants";
}

export const GURMUKHI_LAGAN: readonly LaganDefinition[] = [
  { name: "ਮੁਕਤਾ", nameEn: "Mukta", symbol: "", unicodeCodePoint: "INHERENT", carrierVowel: "all_consonants" },
  { name: "ਕੰਨਾ", nameEn: "Kanna", symbol: "\u0A3E", unicodeCodePoint: "U+0A3E", carrierVowel: "all_consonants" },
  { name: "ਸਿਹਾਰੀ", nameEn: "Sihari", symbol: "\u0A3F", unicodeCodePoint: "U+0A3F", carrierVowel: "all_consonants" },
  { name: "ਬਿਹਾਰੀ", nameEn: "Bihari", symbol: "\u0A40", unicodeCodePoint: "U+0A40", carrierVowel: "all_consonants" },
  { name: "ਔਂਕੜ", nameEn: "Aunkar", symbol: "\u0A41", unicodeCodePoint: "U+0A41", carrierVowel: "all_consonants" },
  { name: "ਦੁਲੈਂਕੜ", nameEn: "Dulankar", symbol: "\u0A42", unicodeCodePoint: "U+0A42", carrierVowel: "all_consonants" },
  { name: "ਲਾਂ", nameEn: "Laan", symbol: "\u0A47", unicodeCodePoint: "U+0A47", carrierVowel: "all_consonants" },
  { name: "ਦੁਲਾਵਾਂ", nameEn: "Dulavan", symbol: "\u0A48", unicodeCodePoint: "U+0A48", carrierVowel: "all_consonants" },
  { name: "ਹੋੜਾ", nameEn: "Hora", symbol: "\u0A4B", unicodeCodePoint: "U+0A4B", carrierVowel: "all_consonants" },
  { name: "ਕਨੌੜਾ", nameEn: "Kanaura", symbol: "\u0A4C", unicodeCodePoint: "U+0A4C", carrierVowel: "all_consonants" },
] as const;

export interface LagakharDefinition {
  name: string;
  nameEn: string;
  symbol: string;
  unicodeCodePoint: string;
  usageRule: string;
}

export const GURMUKHI_LAGAKHARS: readonly LagakharDefinition[] = [
  {
    name: "ਬਿੰਦੀ",
    nameEn: "Bindi",
    symbol: "\u0A02",
    unicodeCodePoint: "U+0A02",
    usageRule: "ਕੰਨਾ, ਬਿਹਾਰੀ, ਲਾਂ, ਦੁਲਾਵਾਂ, ਹੋੜਾ, ਕਨੌੜਾ ਨਾਲ ਨਾਸਕੀ ਆਵਾਜ਼ ਲਈ ਲੱਗਦੀ ਹੈ (ਕੁੱਲ 6 ਲਗਾਂ ਨਾਲ)।"
  },
  {
    name: "ਟਿੱਪੀ",
    nameEn: "Tippi",
    symbol: "\u0A70",
    unicodeCodePoint: "U+0A70",
    usageRule: "ਮੁਕਤਾ, ਸਿਹਾਰੀ, ਔਂਕੜ, ਦੁਲੈਂਕੜ ਨਾਲ ਨਾਸਕੀ ਆਵਾਜ਼ ਲਈ ਲੱਗਦੀ ਹੈ (ਕੁੱਲ 4 ਲਗਾਂ ਨਾਲ)।"
  },
  {
    name: "ਅੱਧਕ",
    nameEn: "Addak",
    symbol: "\u0A71",
    unicodeCodePoint: "U+0A71",
    usageRule: "ਅਗਲੇ ਅੱਖਰ ਦੀ ਆਵਾਜ਼ ਦੂਹਰੀ (ਬਲ ਵਾਲੀ) ਕਰਨ ਲਈ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ; ਮੁਕਤਾ, ਸਿਹਾਰੀ, ਔਂਕੜ ਨਾਲ ਮੁੱਖ ਤੌਰ 'ਤੇ ਲੱਗਦਾ ਹੈ।"
  }
] as const;

/** Canonical mapping of decomposed nukta forms to atomic NFC Gurmukhi chars */
const NUKTA_REPLACEMENTS: ReadonlyArray<[RegExp, string]> = [
  [/\u0A38\u0A3C/g, "ਸ਼"], // ਸ + nukta -> ਸ਼
  [/\u0A16\u0A3C/g, "ਖ਼"], // ਖ + nukta -> ਖ਼
  [/\u0A17\u0A3C/g, "ਗ਼"], // ਗ + nukta -> ਗ਼
  [/\u0A1C\u0A3C/g, "ਜ਼"], // ਜ + nukta -> ਜ਼
  [/\u0A2B\u0A3C/g, "ਫ਼"], // ਫ + nukta -> ਫ਼
  [/\u0A32\u0A3C/g, "ਲ਼"], // ਲ + nukta -> ਲ਼
];

/**
 * Normalizes Gurmukhi text:
 * 1. NFC normalization
 * 2. Unification of decomposed Nukta variants
 * 3. Stripping non-essential zero-width invisible codepoints
 * 4. Enforces canonical Lagan followed by Lagakhar order (e.g. ਮਾ + ਂ instead of ਮ + ਂ + ਾ)
 */
export function normalizeGurmukhi(input: string): string {
  if (!input) return "";

  // 1. NFC Normalization
  let text = input.normalize("NFC");

  // 2. Unify Nukta forms
  for (const [pattern, replacement] of NUKTA_REPLACEMENTS) {
    text = text.replace(pattern, replacement);
  }

  // 3. Strip non-printing zero-width characters (except valid ZWJ/ZWNJ around virama)
  text = text.replace(/[\u200B\uFEFF]/g, "");

  // 4. Ensure Lagan precedes Lagakhar in decomposed or reversed combinations:
  // If Lagakhar (Bindi \u0A02, Tippi \u0A70, Addak \u0A71) precedes a Matra (\u0A3E..\u0A4C), swap them.
  text = text.replace(/([\u0A02\u0A70\u0A71])([\u0A3E-\u0A4C])/g, "$2$1");

  return text;
}

export type GurmukhiCharClass =
  | "VOWEL_CARRIER"
  | "INDEPENDENT_VOWEL"
  | "CONSONANT"
  | "NASAL_CONSONANT"
  | "DUTT_LETTER"
  | "LAGAN"
  | "LAGAKHAR"
  | "VIRAMA"
  | "PUNCTUATION"
  | "DIGIT"
  | "OTHER";

export function classifyGurmukhiChar(char: string): GurmukhiCharClass {
  if (GURMUKHI_VOWEL_CARRIERS.includes(char as any)) return "VOWEL_CARRIER";
  if (GURMUKHI_INDEPENDENT_VOWELS.includes(char as any)) return "INDEPENDENT_VOWEL";
  if (GURMUKHI_NASAL_CONSONANTS.includes(char as any)) return "NASAL_CONSONANT";
  if (GURMUKHI_DUTT_LETTERS.includes(char as any)) return "DUTT_LETTER";
  if (GURMUKHI_CONSONANTS.includes(char as any)) return "CONSONANT";
  if (GURMUKHI_LAGAN.some((l) => l.symbol === char)) return "LAGAN";
  if (GURMUKHI_LAGAKHARS.some((lk) => lk.symbol === char)) return "LAGAKHAR";
  if (char === "\u0A4D") return "VIRAMA";
  if (char === "।" || char === "॥" || char === "." || char === "," || char === "?" || char === "!" || char === "-" || char === "—") return "PUNCTUATION";
  if (char >= "੦" && char <= "੯") return "DIGIT";
  return "OTHER";
}

/** Check if string contains any Gurmukhi Unicode character */
export function hasGurmukhiScript(text: string): boolean {
  return /[\u0A00-\u0A7F]/.test(text);
}
