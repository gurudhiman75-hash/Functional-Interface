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
