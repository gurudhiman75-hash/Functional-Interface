/**
 * Linguistic Authorities and Knowledge Base for CP001:
 * Gurmukhi Orthography, Lagaan & Lagakhars (ਗੁਰਮੁਖੀ ਲਿਪੀ, ਵਰਣਮਾਲਾ, ਲਗਾਂ-ਲਗਾਖਰ)
 */

export interface VargAuthority {
  readonly vargNamePa: string;
  readonly letters: readonly string[];
  readonly descriptionPa: string;
}

export const GURMUKHI_VARGS: readonly VargAuthority[] = [
  {
    vargNamePa: "ਮੁੱਖ ਵਰਗ",
    letters: ["ੳ", "ਅ", "ੲ", "ਸ", "ਹ"],
    descriptionPa: "ਗੁਰਮੁਖੀ ਵਰਣਮਾਲਾ ਦੀ ਪਹਿਲੀ ਪੰਕਤੀ (ਸਵਰ ਵਾਹਕ ਅਤੇ ਊਸ਼ਮ ਵਿਅੰਜਨ)",
  },
  {
    vargNamePa: "ਕ-ਵਰਗ (ਕੰਠੀ)",
    letters: ["ਕ", "ਖ", "ਗ", "ਘ", "ਙ"],
    descriptionPa: "ਕੰਠੀ ਧੁਨੀਆਂ ਵਾਲਾ ਵਰਗ",
  },
  {
    vargNamePa: "ਚ-ਵਰਗ (ਤਾਲਵੀ)",
    letters: ["ਚ", "ਛ", "ਜ", "ਝ", "ਞ"],
    descriptionPa: "ਤਾਲਵੀ ਧੁਨੀਆਂ ਵਾਲਾ ਵਰਗ",
  },
  {
    vargNamePa: "ਟ-ਵਰਗ (ਉਲਟ-ਜੀਭੀ)",
    letters: ["ਟ", "ਠ", "ਡ", "ਢ", "ਣ"],
    descriptionPa: "ਮੂਰਧਨੀ / ਉਲਟ-ਜੀਭੀ ਧੁਨੀਆਂ ਵਾਲਾ ਵਰਗ",
  },
  {
    vargNamePa: "ਤ-ਵਰਗ (ਦੰਤੀ)",
    letters: ["ਤ", "ਥ", "ਦ", "ਧ", "ਨ"],
    descriptionPa: "ਦੰਤੀ ਧੁਨੀਆਂ ਵਾਲਾ ਵਰਗ",
  },
  {
    vargNamePa: "ਪ-ਵਰਗ (ਹੋਠੀ)",
    letters: ["ਪ", "ਫ", "ਬ", "ਭ", "ਮ"],
    descriptionPa: "ਹੋਠੀ (ਦੋ-ਹੋਠੀ) ਧੁਨੀਆਂ ਵਾਲਾ ਵਰਗ",
  },
  {
    vargNamePa: "ਅੰਤਿਮ ਵਰਗ",
    letters: ["ਯ", "ਰ", "ਲ", "ਵ", "ੜ"],
    descriptionPa: "ਮੂਲ ਵਰਣਮਾਲਾ ਦੀ ਅੰਤਿਮ ਪੰਕਤੀ",
  },
  {
    vargNamePa: "ਨਵੀਨ ਵਰਗ (ਪੈਰ-ਬਿੰਦੀ ਟੋਲੀ)",
    letters: ["ਸ਼", "ਖ਼", "ਗ਼", "ਜ਼", "ਫ਼", "ਲ਼"],
    descriptionPa: "ਅਰਬੀ-ਫ਼ਾਰਸੀ ਧੁਨੀਆਂ ਅਤੇ ਵਿਸ਼ੇਸ਼ ਪੰਜਾਬੀ ਧੁਨੀ (ਲ਼) ਲਈ ਸ਼ਾਮਲ ਕੀਤੇ ਅੱਖਰ",
  },
];

export interface CarrierRule {
  readonly carrier: "ੳ" | "ਅ" | "ੲ";
  readonly allowedCount: number;
  readonly allowedLaganNamesPa: readonly string[];
  readonly explanationPa: string;
}

export const CARRIER_RULES: readonly CarrierRule[] = [
  {
    carrier: "ੳ",
    allowedCount: 3,
    allowedLaganNamesPa: ["ਔਂਕੜ", "ਦੁਲੈਂਕੜ", "ਹੋੜਾ"],
    explanationPa: "‘ੳ’ ਨਾਲ ਕੇਵਲ ਤਿੰਨ ਲਗਾਂ (ਔਂਕੜ, ਦੁਲੈਂਕੜ, ਹੋੜਾ) ਲੱਗਦੀਆਂ ਹਨ। ਹੋੜਾ ਲੱਗਣ 'ਤੇ ੳ ਦਾ ਮੂੰਹ ਖੁੱਲ੍ਹਾ (ਓ) ਹੋ ਜਾਂਦਾ ਹੈ।",
  },
  {
    carrier: "ਅ",
    allowedCount: 4,
    allowedLaganNamesPa: ["ਮੁਕਤਾ", "ਕੰਨਾ", "ਦੁਲਾਵਾਂ", "ਕਨੌੜਾ"],
    explanationPa: "‘ਅ’ ਨਾਲ ਚਾਰ ਲਗਾਂ (ਮੁਕਤਾ, ਕੰਨਾ, ਦੁਲਾਵਾਂ, ਕਨੌੜਾ) ਲੱਗਦੀਆਂ ਹਨ। ਅ ਨਾਲ ਮੁਕਤਾ ਹੁੰਦਾ ਹੈ (ਅ), ਕੰਨਾ (ਆ), ਦੁਲਾਵਾਂ (ਐ), ਅਤੇ ਕਨੌੜਾ (ਔ)।",
  },
  {
    carrier: "ੲ",
    allowedCount: 3,
    allowedLaganNamesPa: ["ਸਿਹਾਰੀ", "ਬਿਹਾਰੀ", "ਲਾਂ"],
    explanationPa: "‘ੲ’ ਨਾਲ ਤਿੰਨ ਲਗਾਂ (ਸਿਹਾਰੀ, ਬਿਹਾਰੀ, ਲਾਂ) ਲੱਗਦੀਆਂ ਹਨ (ਇ, ਈ, ਏ)।",
  },
];

export interface LagakharRule {
  readonly namePa: string;
  readonly symbol: string;
  readonly laganCount: number;
  readonly allowedLaganPa: readonly string[];
  readonly explanationPa: string;
}

export const LAGAKHAR_RULES: readonly LagakharRule[] = [
  {
    namePa: "ਬਿੰਦੀ",
    symbol: "ਂ",
    laganCount: 6,
    allowedLaganPa: ["ਕੰਨਾ", "ਬਿਹਾਰੀ", "ਲਾਂ", "ਦੁਲਾਵਾਂ", "ਹੋੜਾ", "ਕਨੌੜਾ"],
    explanationPa: "ਬਿੰਦੀ 6 ਲਗਾਂ (ਕੰਨਾ, ਬਿਹਾਰੀ, ਲਾਂ, ਦੁਲਾਵਾਂ, ਹੋੜਾ, ਕਨੌੜਾ) ਨਾਲ ਨਾਸਕੀ ਆਵਾਜ਼ ਪ੍ਰਗਟਾਉਣ ਲਈ ਲੱਗਦੀ ਹੈ।",
  },
  {
    namePa: "ਟਿੱਪੀ",
    symbol: "ੰ",
    laganCount: 4,
    allowedLaganPa: ["ਮੁਕਤਾ", "ਸਿਹਾਰੀ", "ਔਂਕੜ", "ਦੁਲੈਂਕੜ"],
    explanationPa: "ਟਿੱਪੀ 4 ਲਗਾਂ (ਮੁਕਤਾ, ਸਿਹਾਰੀ, ਔਂਕੜ, ਦੁਲੈਂਕੜ) ਨਾਲ ਨਾਸਕੀ ਆਵਾਜ਼ ਪ੍ਰਗਟਾਉਣ ਲਈ ਲੱਗਦੀ ਹੈ।",
  },
  {
    namePa: "ਅੱਧਕ",
    symbol: "ੱ",
    laganCount: 3,
    allowedLaganPa: ["ਮੁਕਤਾ", "ਸਿਹਾਰੀ", "ਔਂਕੜ"],
    explanationPa: "ਅੱਧਕ ਦਬਾਅ ਜਾਂ ਬਲ (ਦੂਹਰੀ ਆਵਾਜ਼) ਦਾ ਚਿੰਨ੍ਹ ਹੈ, ਜੋ ਮੁੱਖ ਤੌਰ 'ਤੇ 3 ਲਗਾਂ (ਮੁਕਤਾ, ਸਿਹਾਰੀ, ਔਂਕੜ) ਨਾਲ ਲੱਗਦਾ ਹੈ।",
  },
];

export interface DuttAkkharRule {
  readonly letter: string;
  readonly namePa: string;
  readonly symbol: string;
  readonly examplesPa: readonly string[];
  readonly nonExamplesPa: readonly string[];
  readonly explanationPa: string;
}

export const DUTT_AKKHARS: readonly DuttAkkharRule[] = [
  {
    letter: "ਹ",
    namePa: "ਪੈਰੀਂ ਹਾਹਾ",
    symbol: "ੵ",
    examplesPa: ["ਪੜ੍ਹਾਈ", "ਜੜ੍ਹ", "ਵਰ੍ਹੇ", "ਚੜ੍ਹਨਾ", "ਗਲ੍ਹ", "ਆਲ੍ਹਣਾ", "ਸਿਨ੍ਹਣਾ"],
    nonExamplesPa: ["ਪੜਦਾ", "ਜੜੀ", "ਵਰਤ", "ਚੜਨਾ", "ਗੱਲ"],
    explanationPa: "ਪੈਰੀਂ ਹਾਹਾ (ੵ) ਦੁੱਤ ਅੱਖਰ ਵਜੋਂ ਪੰਜਾਬੀ ਵਿੱਚ ਸੁਰ (Tone) ਜਾਂ ਸਘੋਸ਼ ਮਹਾਂਪ੍ਰਾਣਤਾ ਨੂੰ ਪ੍ਰਗਟਾਉਂਦਾ ਹੈ।",
  },
  {
    letter: "ਰ",
    namePa: "ਪੈਰੀਂ ਰਾਰਾ",
    symbol: "੍ਰ",
    examplesPa: ["ਪ੍ਰਸ਼ਨ", "ਪ੍ਰਕਾਸ਼", "ਪ੍ਰੋਗਰਾਮ", "ਪ੍ਰੇਮ", "ਕ੍ਰਮ", "ਪ੍ਰਸਿੱਧ", "ਗ੍ਰੰਥ"],
    nonExamplesPa: ["ਪਰਸ਼ਨ", "ਪਰਕਾਸ਼", "ਪਰਮ", "ਕਰਮ"],
    explanationPa: "ਪੈਰੀਂ ਰਾਰਾ (੍ਰ) ਸੰਸਕ੍ਰਿਤ ਦੇ ਤਤਸਮ ਸ਼ਬਦਾਂ ਵਿੱਚ ਸੰਯੁਕਤ ਧੁਨੀ ਵਜੋਂ ਪੈਰ ਵਿੱਚ ਆਉਂਦਾ ਹੈ।",
  },
  {
    letter: "ਵ",
    namePa: "ਪੈਰੀਂ ਵਾਵਾ",
    symbol: "੍ਵ",
    examplesPa: ["ਸ੍ਵੈ-ਜੀਵਨੀ", "ਸ੍ਵੈਮਾਣ", "ਸ੍ਵਰ", "ਵਿਦ੍ਵਾਨ", "ਸ੍ਵਾਮੀ"],
    nonExamplesPa: ["ਸਵਾਲ", "ਸਵੇਰਾ", "ਸਵਾਰ", "ਸਵੇਰ"],
    explanationPa: "ਪੈਰੀਂ ਵਾਵਾ (੍ਵ) ਗੁਰਮੁਖੀ ਦਾ ਤੀਜਾ ਦੁੱਤ ਅੱਖਰ ਹੈ ਜੋ ਮੁੱਖ ਤੌਰ 'ਤੇ ਸੰਯੁਕਤ ਸ਼ਬਦਾਂ ਵਿੱਚ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।",
  },
];

export interface LagaanDetail {
  readonly order: number;
  readonly namePa: string;
  readonly symbol: string;
  readonly vowelType: "SHORT" | "LONG"; // ਲਘੂ ਜਾਂ ਦੀਰਘ
  readonly position: "ABOVE" | "BELOW" | "LEFT" | "RIGHT" | "NONE";
  readonly sampleWord: string;
  readonly explanationPa: string;
}

export const LAGAAN_DETAILS: readonly LagaanDetail[] = [
  { order: 1, namePa: "ਮੁਕਤਾ", symbol: "ਅ", vowelType: "SHORT", position: "NONE", sampleWord: "ਘਰ", explanationPa: "ਮੁਕਤਾ ਦਾ ਕੋਈ ਲਿਖਤੀ ਚਿੰਨ੍ਹ ਨਹੀਂ ਹੁੰਦਾ, ਇਹ ਲਘੂ ਸਵਰ ਹੈ।" },
  { order: 2, namePa: "ਕੰਨਾ", symbol: "ਾ", vowelType: "LONG", position: "RIGHT", sampleWord: "ਕਾਰ", explanationPa: "ਕੰਨਾ ਅੱਖਰ ਦੇ ਸੱਜੇ ਪਾਸੇ ਅੱਧੇ ਕੱਦ ਦਾ ਲੱਗਦਾ ਹੈ ਅਤੇ ਇਹ ਦੀਰਘ ਸਵਰ ਹੈ।" },
  { order: 3, namePa: "ਸਿਹਾਰੀ", symbol: "ਿ", vowelType: "SHORT", position: "LEFT", sampleWord: "ਸਿਰ", explanationPa: "ਸਿਹਾਰੀ ਅੱਖਰ ਦੇ ਖੱਬੇ ਪਾਸੇ (ਪਹਿਲਾਂ) ਲੱਗਦੀ ਹੈ ਅਤੇ ਇਹ ਲਘੂ ਸਵਰ ਹੈ।" },
  { order: 4, namePa: "ਬਿਹਾਰੀ", symbol: "ੀ", vowelType: "LONG", position: "RIGHT", sampleWord: "ਤੀਰ", explanationPa: "ਬਿਹਾਰੀ ਅੱਖਰ ਦੇ ਸੱਜੇ ਪਾਸੇ (ਬਾਅਦ) ਲੱਗਦੀ ਹੈ ਅਤੇ ਇਹ ਦੀਰਘ ਸਵਰ ਹੈ।" },
  { order: 5, namePa: "ਔਂਕੜ", symbol: "ੁ", vowelType: "SHORT", position: "BELOW", sampleWord: "ਗੁਣ", explanationPa: "ਔਂਕੜ ਅੱਖਰ ਦੇ ਹੇਠਾਂ ਇੱਕ ਲਕੀਰ ਵਜੋਂ ਲੱਗਦਾ ਹੈ ਅਤੇ ਇਹ ਲਘੂ ਸਵਰ ਹੈ।" },
  { order: 6, namePa: "ਦੁਲੈਂਕੜ", symbol: "ੂ", vowelType: "LONG", position: "BELOW", sampleWord: "ਸੂਰਜ", explanationPa: "ਦੁਲੈਂਕੜ ਅੱਖਰ ਦੇ ਹੇਠਾਂ ਦੋ ਲਕੀਰਾਂ ਵਜੋਂ ਲੱਗਦਾ ਹੈ ਅਤੇ ਇਹ ਦੀਰਘ ਸਵਰ ਹੈ।" },
  { order: 7, namePa: "ਲਾਂ", symbol: "ੇ", vowelType: "LONG", position: "ABOVE", sampleWord: "ਸੇਬ", explanationPa: "ਲਾਂ ਅੱਖਰ ਦੇ ਉੱਪਰ ਲੱਗਣ ਵਾਲੀ ਦੀਰਘ ਮਾਤਰਾ ਹੈ।" },
  { order: 8, namePa: "ਦੁਲਾਵਾਂ", symbol: "ੈ", vowelType: "LONG", position: "ABOVE", sampleWord: "ਸੈਰ", explanationPa: "ਦੁਲਾਵਾਂ ਅੱਖਰ ਦੇ ਉੱਪਰ ਦੋ ਲਕੀਰਾਂ ਵਜੋਂ ਲੱਗਦੀ ਹੈ ਅਤੇ ਇਹ ਦੀਰਘ ਮਾਤਰਾ ਹੈ।" },
  { order: 9, namePa: "ਹੋੜਾ", symbol: "ੋ", vowelType: "LONG", position: "ABOVE", sampleWord: "ਮੋਰ", explanationPa: "ਹੋੜਾ ਅੱਖਰ ਦੇ ਉੱਪਰ ਲੱਗਦਾ ਹੈ ਅਤੇ ਇਹ ਦੀਰਘ ਸਵਰ ਹੈ।" },
  { order: 10, namePa: "ਕਨੌੜਾ", symbol: "ੌ", vowelType: "LONG", position: "ABOVE", sampleWord: "ਕੌਲ", explanationPa: "ਕਨੌੜਾ ਅੱਖਰ ਦੇ ਉੱਪਰ ਲੱਗਣ ਵਾਲੀ ਦਸਵੀਂ ਦੀਰਘ ਮਾਤਰਾ ਹੈ।" },
];

export interface WordBreakdownItem {
  readonly id: string;
  readonly word: string;
  readonly constituentLagan: readonly string[];
  readonly lagakhar?: string;
  readonly duttAkkhar?: string;
  readonly breakdownPa: string;
}

export const ORTHOGRAPHIC_WORD_BREAKDOWNS: readonly WordBreakdownItem[] = [
  {
    id: "BRK-001",
    word: "ਪੰਜਾਬੀ",
    constituentLagan: ["ਮੁਕਤਾ", "ਕੰਨਾ", "ਬਿਹਾਰੀ"],
    lagakhar: "ਟਿੱਪੀ",
    breakdownPa: "ਪ + ੰ (ਟਿੱਪੀ) + ਜ + ਾ (ਕੰਨਾ) + ਬ + ੀ (ਬਿਹਾਰੀ)",
  },
  {
    id: "BRK-002",
    word: "ਕਿਤਾਬਾਂ",
    constituentLagan: ["ਸਿਹਾਰੀ", "ਕੰਨਾ", "ਕੰਨਾ"],
    lagakhar: "ਬਿੰਦੀ",
    breakdownPa: "ਕ + ਿ (ਸਿਹਾਰੀ) + ਤ + ਾ (ਕੰਨਾ) + ਬ + ਾ (ਕੰਨਾ) + ਂ (ਬਿੰਦੀ)",
  },
  {
    id: "BRK-003",
    word: "ਸਿੱਖਿਆ",
    constituentLagan: ["ਸਿਹਾਰੀ", "ਸਿਹਾਰੀ", "ਕੰਨਾ"],
    lagakhar: "ਅੱਧਕ",
    breakdownPa: "ਸ + ਿ (ਸਿਹਾਰੀ) + ੱ (ਅੱਧਕ) + ਖ + ਿ (ਸਿਹਾਰੀ) + ਅ + ਾ (ਕੰਨਾ)",
  },
  {
    id: "BRK-004",
    word: "ਗੁਰਮੁਖੀ",
    constituentLagan: ["ਔਂਕੜ", "ਔਂਕੜ", "ਬਿਹਾਰੀ"],
    breakdownPa: "ਗ + ੁ (ਔਂਕੜ) + ਰ (ਮੁਕਤਾ) + ਮ + ੁ (ਔਂਕੜ) + ਖ + ੀ (ਬਿਹਾਰੀ)",
  },
  {
    id: "BRK-005",
    word: "ਪੜ੍ਹਾਈ",
    constituentLagan: ["ਮੁਕਤਾ", "ਕੰਨਾ", "ਬਿਹਾਰੀ"],
    duttAkkhar: "ਹ (ਪੈਰੀਂ ਹਾਹਾ)",
    breakdownPa: "ਪ (ਮੁਕਤਾ) + ੜ੍ਹ (ਪੈਰੀਂ ਹਾਹਾ) + ਾ (ਕੰਨਾ) + ੲ + ੀ (ਬਿਹਾਰੀ)",
  },
  {
    id: "BRK-006",
    word: "ਪ੍ਰਕਾਸ਼",
    constituentLagan: ["ਮੁਕਤਾ", "ਕੰਨਾ", "ਮੁਕਤਾ"],
    duttAkkhar: "ਰ (ਪੈਰੀਂ ਰਾਰਾ)",
    breakdownPa: "ਪ੍ਰ (ਪੈਰੀਂ ਰਾਰਾ) + ਕ + ਾ (ਕੰਨਾ) + ਸ਼ (ਮੁਕਤਾ)",
  },
];

