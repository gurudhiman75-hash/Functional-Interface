/**
 * Canonical Punjabi Grammar Terminology Registry
 * Standardized across literary/academic Punjabi (ਟਕਸਾਲੀ ਮਾਝੀ ਬੋਲੀ)
 * as tested by Punjab state competitive exams (PPSC, PSSSB, Punjab Police).
 */

export interface GrammarTerm {
  readonly id: string;
  readonly pa: string;
  readonly en: string;
  readonly category:
    | "orthography"
    | "word_class"
    | "inflection"
    | "syntax"
    | "morphology"
    | "semantics";
  readonly definitionPa: string;
  readonly examplesPa: readonly string[];
}

export const PUNJABI_GRAMMAR_TERMS: readonly GrammarTerm[] = [
  // Orthography & Script
  {
    id: "TERM-ORTHO-001",
    pa: "ਗੁਰਮੁਖੀ ਲਿਪੀ",
    en: "Gurmukhi Script",
    category: "orthography",
    definitionPa: "ਪੰਜਾਬੀ ਭਾਸ਼ਾ ਨੂੰ ਲਿਖਣ ਲਈ ਵਰਤੀ ਜਾਂਦੀ ਪ੍ਰਮਾਣਿਤ ਅਤੇ ਟਕਸਾਲੀ ਲਿਪੀ।",
    examplesPa: ["ੳ", "ਅ", "ੲ", "ਸ", "ਹ"],
  },
  {
    id: "TERM-ORTHO-002",
    pa: "ਸਵਰ ਵਾਹਕ",
    en: "Vowel Carriers",
    category: "orthography",
    definitionPa: "ਉਹ ਮੂਲ ਅੱਖਰ ਜਿਨ੍ਹਾਂ ਨਾਲ ਲਗਾਂ ਮਿਲ ਕੇ ਦਸ ਸਵਰ ਧੁਨੀਆਂ ਬਣਾਉਂਦੀਆਂ ਹਨ (ੳ, ਅ, ੲ)।",
    examplesPa: ["ੳ", "ਅ", "ੲ"],
  },
  {
    id: "TERM-ORTHO-003",
    pa: "ਲਗਾਂ",
    en: "Vowel Signs / Matras",
    category: "orthography",
    definitionPa: "ਸਵਰ ਧੁਨੀਆਂ ਨੂੰ ਪ੍ਰਗਟਾਉਣ ਵਾਲੇ ਚਿੰਨ੍ਹ (ਕੁੱਲ 10 ਲਗਾਂ: ਮੁਕਤਾ, ਕੰਨਾ, ਸਿਹਾਰੀ, ਬਿਹਾਰੀ, ਔਂਕੜ, ਦੁਲੈਂਕੜ, ਲਾਂ, ਦੁਲਾਵਾਂ, ਹੋੜਾ, ਕਨੌੜਾ)।",
    examplesPa: ["ਮੁਕਤਾ", "ਕੰਨਾ", "ਸਿਹਾਰੀ", "ਬਿਹਾਰੀ"],
  },
  {
    id: "TERM-ORTHO-004",
    pa: "ਲਗਾਖਰ",
    en: "Auxiliary Diacritics",
    category: "orthography",
    definitionPa: "ਲਗਾਂ ਦੇ ਨਾਲ ਲੱਗਣ ਵਾਲੇ ਸਹਾਇਕ ਚਿੰਨ੍ਹ (ਬਿੰਦੀ, ਟਿੱਪੀ, ਅੱਧਕ)।",
    examplesPa: ["ਬਿੰਦੀ", "ਟਿੱਪੀ", "ਅੱਧਕ"],
  },
  {
    id: "TERM-ORTHO-005",
    pa: "ਦੁੱਤ ਅੱਖਰ",
    en: "Subjoined Consonants (Pairin Akkhar)",
    category: "orthography",
    definitionPa: "ਉਹ ਅੱਖਰ ਜੋ ਦੂਜੇ ਅੱਖਰਾਂ ਦੇ ਪੈਰਾਂ ਵਿੱਚ ਲਿਖੇ ਜਾਂਦੇ ਹਨ (ਹ, ਰ, ਵ)।",
    examplesPa: ["ਪੜ੍ਹਨਾ (੍ਹ)", "ਪ੍ਰਸ਼ਨ (੍ਰ)", "ਸਵੈ (੍ਵ)"],
  },
  {
    id: "TERM-ORTHO-006",
    pa: "ਅਨੁਨਾਸਕ ਅੱਖਰ",
    en: "Nasal Consonants",
    category: "orthography",
    definitionPa: "ਉਹ ਅੱਖਰ ਜਿਨ੍ਹਾਂ ਦਾ ਉਚਾਰਨ ਨੱਕ ਰਾਹੀਂ ਹੁੰਦਾ ਹੈ (ਙ, ਞ, ਣ, ਨ, ਮ)।",
    examplesPa: ["ਙ", "ਞ", "ਣ", "ਨ", "ਮ"],
  },

  // Word Classes (ਸ਼ਬਦ-ਭੇਦ)
  {
    id: "TERM-POS-001",
    pa: "ਨਾਂਵ",
    en: "Noun",
    category: "word_class",
    definitionPa: "ਜਿਹੜੇ ਸ਼ਬਦ ਕਿਸੇ ਵਿਅਕਤੀ, ਜੀਵ, ਥਾਂ, ਵਸਤੂ ਜਾਂ ਭਾਵ ਦਾ ਬੋਧ ਕਰਵਾਉਣ।",
    examplesPa: ["ਅਮਨ", "ਕਿਤਾਬ", "ਅੰਮ੍ਰਿਤਸਰ", "ਸੁੰਦਰਤਾ"],
  },
  {
    id: "TERM-POS-002",
    pa: "ਪੜਨਾਂਵ",
    en: "Pronoun",
    category: "word_class",
    definitionPa: "ਜਿਹੜਾ ਸ਼ਬਦ ਨਾਂਵ ਦੀ ਥਾਂ 'ਤੇ ਵਰਤਿਆ ਜਾਵੇ।",
    examplesPa: ["ਮੈਂ", "ਤੂੰ", "ਉਹ", "ਆਪ", "ਕੌਣ"],
  },
  {
    id: "TERM-POS-003",
    pa: "ਵਿਸ਼ੇਸ਼ਣ",
    en: "Adjective",
    category: "word_class",
    definitionPa: "ਜਿਹੜਾ ਸ਼ਬਦ ਕਿਸੇ ਨਾਂਵ ਜਾਂ ਪੜਨਾਂਵ ਦੇ ਗੁਣ, ਔਗੁਣ ਜਾਂ ਵਿਸ਼ੇਸ਼ਤਾ ਦੱਸੇ।",
    examplesPa: ["ਲਾਲ", "ਸੁੰਦਰ", "ਪੰਜ", "ਬਹੁਤਾ"],
  },
  {
    id: "TERM-POS-004",
    pa: "ਕਿਰਿਆ",
    en: "Verb",
    category: "word_class",
    definitionPa: "ਜਿਹੜੇ ਸ਼ਬਦ ਤੋਂ ਕਿਸੇ ਕੰਮ ਦੇ ਹੋਣ, ਕਰਨ ਜਾਂ ਵਾਪਰਨ ਦਾ ਕਾਲ ਸਹਿਤ ਗਿਆਨ ਹੋਵੇ।",
    examplesPa: ["ਪੜ੍ਹਦਾ ਹੈ", "ਲਿਖਿਆ", "ਜਾਵੇਗਾ"],
  },
  {
    id: "TERM-POS-005",
    pa: "ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ",
    en: "Adverb",
    category: "word_class",
    definitionPa: "ਜਿਹੜੇ ਸ਼ਬਦ ਕਿਰਿਆ ਦੇ ਹੋਣ ਦਾ ਸਮਾਂ, ਸਥਾਨ, ਢੰਗ ਜਾਂ ਕਾਰਨ ਦੱਸਣ।",
    examplesPa: ["ਹੌਲੀ-ਹੌਲੀ", "ਕੱਲ੍ਹ", "ਅੰਦਰ", "ਬਹੁਤ"],
  },
  {
    id: "TERM-POS-006",
    pa: "ਸੰਬੰਧਕ",
    en: "Postposition",
    category: "word_class",
    definitionPa: "ਜਿਹੜਾ ਸ਼ਬਦ ਨਾਂਵ ਜਾਂ ਪੜਨਾਂਵ ਦੇ ਪਿੱਛੇ ਆ ਕੇ ਉਸ ਦਾ ਸੰਬੰਧ ਵਾਕ ਦੇ ਹੋਰ ਸ਼ਬਦਾਂ ਨਾਲ ਜੋੜੇ।",
    examplesPa: ["ਦਾ", "ਦੇ", "ਦੀ", "ਨੂੰ", "ਤੋਂ", "ਨੇ"],
  },
  {
    id: "TERM-POS-007",
    pa: "ਯੋਜਕ",
    en: "Conjunction",
    category: "word_class",
    definitionPa: "ਜਿਹੜਾ ਸ਼ਬਦ ਦੋ ਸ਼ਬਦਾਂ, ਵਾਕੰਸ਼ਾਂ ਜਾਂ ਵਾਕਾਂ ਨੂੰ ਆਪਸ ਵਿੱਚ ਜੋੜੇ।",
    examplesPa: ["ਅਤੇ", "ਕਿਉਂਕਿ", "ਪਰ", "ਜਾਂ", "ਜੇਕਰ"],
  },
  {
    id: "TERM-POS-008",
    pa: "ਵਿਸਮਿਕ",
    en: "Interjection",
    category: "word_class",
    definitionPa: "ਜਿਹੜੇ ਸ਼ਬਦ ਖ਼ੁਸ਼ੀ, ਗ਼ਮੀ, ਹੈਰਾਨੀ, ਡਰ ਜਾਂ ਪ੍ਰਸ਼ੰਸਾ ਦੇ ਭਾਵ ਪ੍ਰਗਟ ਕਰਨ।",
    examplesPa: ["ਵਾਹ!", "ਹਾਏ!", "ਸ਼ਾਬਾਸ਼!", "ਬੱਲੇ!"],
  },

  // Inflection (ਰੂਪਾਂਤਰਣ)
  {
    id: "TERM-INF-001",
    pa: "ਲਿੰਗ",
    en: "Gender",
    category: "inflection",
    definitionPa: "ਸ਼ਬਦ ਦੇ ਜਿਸ ਰੂਪ ਤੋਂ ਪੁਰਖ (ਨਰ) ਜਾਂ ਇਸਤਰੀ (ਮਾਦਾ) ਜਾਤੀ ਦੇ ਭੇਦ ਦਾ ਪਤਾ ਲੱਗੇ।",
    examplesPa: ["ਪੁਲਿੰਗ: ਘੋੜਾ", "ਇਸਤਰੀ ਲਿੰਗ: ਘੋੜੀ"],
  },
  {
    id: "TERM-INF-002",
    pa: "ਵਚਨ",
    en: "Number",
    category: "inflection",
    definitionPa: "ਸ਼ਬਦ ਦੇ ਜਿਸ ਰੂਪ ਤੋਂ ਕਿਸੇ ਜੀਵ ਜਾਂ ਵਸਤੂ ਦੇ ਇੱਕ ਜਾਂ ਇੱਕ ਤੋਂ ਵੱਧ ਹੋਣ ਦਾ ਬੋਧ ਹੋਵੇ।",
    examplesPa: ["ਇੱਕਵਚਨ: ਮੁੰਡਾ", "ਬਹੁਵਚਨ: ਮੁੰਡੇ"],
  },
  {
    id: "TERM-INF-003",
    pa: "ਕਾਲ",
    en: "Tense",
    category: "inflection",
    definitionPa: "ਕਿਰਿਆ ਦੇ ਜਿਸ ਰੂਪ ਤੋਂ ਕੰਮ ਦੇ ਸਮੇਂ ਦਾ ਗਿਆਨ ਹੋਵੇ।",
    examplesPa: ["ਭੂਤਕਾਲ", "ਵਰਤਮਾਨ ਕਾਲ", "ਭਵਿੱਖਤ ਕਾਲ"],
  },
  {
    id: "TERM-INF-004",
    pa: "ਕਾਰਕ",
    en: "Case",
    category: "inflection",
    definitionPa: "ਵਾਕ ਵਿੱਚ ਨਾਂਵ ਜਾਂ ਪੜਨਾਂਵ ਦਾ ਕਿਰਿਆ ਜਾਂ ਹੋਰ ਸ਼ਬਦਾਂ ਨਾਲ ਸੰਬੰਧ ਦਰਸਾਉਣ ਵਾਲੀ ਅਵਸਥਾ।",
    examplesPa: ["ਕਰਤਾ ਕਾਰਕ", "ਕਰਮ ਕਾਰਕ", "ਕਰਨ ਕਾਰਕ"],
  },
];

export function getGrammarTerm(id: string): GrammarTerm | undefined {
  return PUNJABI_GRAMMAR_TERMS.find((t) => t.id === id);
}

export function listTermsByCategory(category: GrammarTerm["category"]): readonly GrammarTerm[] {
  return PUNJABI_GRAMMAR_TERMS.filter((t) => t.category === category);
}
