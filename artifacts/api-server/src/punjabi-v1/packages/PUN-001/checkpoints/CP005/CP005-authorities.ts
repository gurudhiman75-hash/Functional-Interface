/**
 * CP005: Adjectives & Adverbs (ਵਿਸ਼ੇਸ਼ਣ ਅਤੇ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ)
 * Curated knowledge base of adjective and adverb classifications in Punjabi.
 */

export interface AdjectiveCategoryItem {
  readonly subtypeId: "GUN" | "SANKHYA" | "MINATI" | "NISHCHAY" | "PADNAVI";
  readonly namePa: string;
  readonly definitionPa: string;
  readonly examples: readonly string[];
}

export const ADJECTIVE_CATEGORIES: readonly AdjectiveCategoryItem[] = [
  {
    subtypeId: "GUN",
    namePa: "ਗੁਣ-ਵਾਚਕ ਵਿਸ਼ੇਸ਼ਣ",
    definitionPa: "ਜਿਹੜਾ ਵਿਸ਼ੇਸ਼ਣ ਕਿਸੇ ਨਾਂਵ ਜਾਂ ਪੜਨਾਂਵ ਦੇ ਗੁਣ, ਔਗੁਣ, ਰੰਗ, ਆਕਾਰ ਜਾਂ ਅਵਸਥਾ ਦੱਸੇ।",
    examples: [
      "ਸੁੰਦਰ",
      "ਕਾਲਾ",
      "ਬਹਾਦਰ",
      "ਮਿੱਠਾ",
      "ਨੇਕ",
      "ਮੰਦਾ",
      "ਇਮਾਨਦਾਰ",
      "ਕਮਜ਼ੋਰ",
      "ਬਲਵਾਨ",
      "ਸਿਆਣਾ",
      "ਚਲਾਕ",
      "ਸੁਹਿਰਦ",
      "ਕੋਮਲ",
      "ਕਰੂਪ",
      "ਉੱਚਾ",
      "ਲੰਮਾ",
      "ਸੂਰਬੀਰ",
      "ਮਿਹਨਤੀ",
    ],
  },
  {
    subtypeId: "SANKHYA",
    namePa: "ਸੰਖਿਆ-ਵਾਚਕ ਵਿਸ਼ੇਸ਼ਣ (ਗਿਣਤੀ-ਵਾਚਕ)",
    definitionPa: "ਜਿਹੜਾ ਵਿਸ਼ੇਸ਼ਣ ਨਾਂਵ ਜਾਂ ਪੜਨਾਂਵ ਦੀ ਗਿਣਤੀ, ਦਰਜਾ ਜਾਂ ਵਾਰੀ ਦੱਸੇ।",
    examples: [
      "ਪੰਜ",
      "ਦਸਵਾਂ",
      "ਦੁੱਗਣਾ",
      "ਥੋੜ੍ਹੇ",
      "ਕੁਝ",
      "ਸਾਰੇ",
      "ਚੌਥਾ",
      "ਦੋਵੇਂ",
      "ਸੈਂਕੜੇ",
      "ਦਰਜਨ",
      "ਤੀਜਾ",
      "ਚੌਗੁਣਾ",
      "ਹਜ਼ਾਰਾਂ",
      "ਕਈ",
      "ਬਹੁਤੇ",
      "ਪਹਿਲਾ",
      "ਅੱਧਾ",
    ],
  },
  {
    subtypeId: "MINATI",
    namePa: "ਪਰਿਮਾਣ-ਵਾਚਕ ਵਿਸ਼ੇਸ਼ਣ (ਮਿਣਤੀ-ਵਾਚਕ)",
    definitionPa: "ਜਿਹੜਾ ਵਿਸ਼ੇਸ਼ਣ ਨਾਂਵ ਜਾਂ ਪੜਨਾਂਵ ਦੇ ਮਾਪ, ਤੋਲ ਜਾਂ ਮਿਣਤੀ ਬਾਰੇ ਦੱਸੇ।",
    examples: [
      "ਦੋ ਲੀਟਰ",
      "ਚਾਰ ਮੀਟਰ",
      "ਥੋੜ੍ਹਾ ਜਿਹਾ",
      "ਬਹੁਤਾ",
      "ਕਿਲੋਗ੍ਰਾਮ",
      "ਸੇਰ ਭਰ",
      "ਮਣ ਭਰ",
      "ਗਿੱਠ ਭਰ",
      "ਢੇਰ ਸਾਰਾ",
      "ਜ਼ਰਾ ਕੁ",
      "ਮੁੱਠੀ ਭਰ",
      "ਚੁਟਕੀ ਭਰ",
      "ਕਾਫ਼ੀ",
    ],
  },
  {
    subtypeId: "NISHCHAY",
    namePa: "ਨਿਸ਼ਚੇ-ਵਾਚਕ ਵਿਸ਼ੇਸ਼ਣ",
    definitionPa: "ਜਿਹੜਾ ਵਿਸ਼ੇਸ਼ਣ ਕਿਸੇ ਨਾਂਵ ਜਾਂ ਪੜਨਾਂਵ ਵੱਲ ਇਸ਼ਾਰਾ ਕਰਕੇ ਉਸ ਨੂੰ ਆਮ ਤੋਂ ਖ਼ਾਸ ਬਣਾਵੇ।",
    examples: [
      "ਇਹ",
      "ਉਹ",
      "ਆਹ",
      "ਉਹੀ",
      "ਏਹੋ",
      "ਓਹੋ",
      "ਇਹੋ ਜਿਹਾ",
      "ਉਹੋ ਜਿਹਾ",
    ],
  },
  {
    subtypeId: "PADNAVI",
    namePa: "ਪੜਨਾਂਵੀ ਵਿਸ਼ੇਸ਼ਣ",
    definitionPa: "ਜਿਹੜਾ ਸ਼ਬਦ ਮੂਲ ਰੂਪ ਵਿੱਚ ਪੜਨਾਂਵ ਹੋਵੇ ਪਰ ਨਾਂਵ ਦੇ ਨਾਲ ਆ ਕੇ ਵਿਸ਼ੇਸ਼ਣ ਦਾ ਕੰਮ ਕਰੇ।",
    examples: [
      "ਕਿਹੜਾ ਮੁੰਡਾ",
      "ਜਿਹੜੀ ਕੁੜੀ",
      "ਸਾਡਾ ਪਿੰਡ",
      "ਤੁਹਾਡਾ ਘਰ",
      "ਕਿਸ ਦਾ ਬਸਤਾ",
      "ਜਿਹੜਾ ਵਿਦਿਆਰਥੀ",
      "ਮੇਰੀ ਕਲਮ",
      "ਆਪਣਾ ਦੇਸ਼",
      "ਕਿਹੜੀ ਕਿਤਾਬ",
      "ਜਿਸ ਆਦਮੀ",
    ],
  },
];

export interface AdverbCategoryItem {
  readonly subtypeId: "KAAL" | "ASTHAN" | "DHANG" | "SANKHYA" | "KARAN" | "TAKID" | "NIRNAY";
  readonly namePa: string;
  readonly definitionPa: string;
  readonly examples: readonly string[];
}

export const ADVERB_CATEGORIES: readonly AdverbCategoryItem[] = [
  {
    subtypeId: "KAAL",
    namePa: "ਕਾਲ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ",
    definitionPa: "ਜਿਹੜਾ ਸ਼ਬਦ ਕਿਰਿਆ ਦੇ ਹੋਣ ਦਾ ਸਮਾਂ ਦੱਸੇ।",
    examples: [
      "ਹੁਣ",
      "ਕੱਲ੍ਹ",
      "ਪਰਸੋਂ",
      "ਸਵੇਰੇ",
      "ਕਦੇ-ਕਦੇ",
      "ਰੋਜ਼ਾਨਾ",
      "ਦੁਪਹਿਰੇ",
      "ਝੱਟਪੱਟ",
      "ਅੱਜ-ਕੱਲ੍ਹ",
      "ਸ਼ਾਮੀਂ",
      "ਤੜਕੇ",
      "ਸਦਾ",
      "ਨਿੱਤ",
    ],
  },
  {
    subtypeId: "ASTHAN",
    namePa: "ਅਸਥਾਨ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ",
    definitionPa: "ਜਿਹੜਾ ਸ਼ਬਦ ਕਿਰਿਆ ਦੇ ਵਾਪਰਨ ਦਾ ਸਥਾਨ ਜਾਂ ਦਿਸ਼ਾ ਦੱਸੇ।",
    examples: [
      "ਅੰਦਰ",
      "ਬਾਹਰ",
      "ਨੇੜੇ",
      "ਦੂਰ",
      "ਖੱਬੇ",
      "ਸੱਜੇ",
      "ਉੱਪਰ",
      "ਹੇਠਾਂ",
      "ਸਾਹਮਣੇ",
      "ਪਿੱਛੇ",
      "ਆਸ-ਪਾਸ",
      "ਵਿਚਕਾਰ",
      "ਕੋਲ",
    ],
  },
  {
    subtypeId: "DHANG",
    namePa: "ਪ੍ਰਕਾਰ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ (ਢੰਗ-ਵਾਚਕ)",
    definitionPa: "ਜਿਹੜਾ ਸ਼ਬਦ ਕਿਰਿਆ ਦੇ ਹੋਣ ਦਾ ਤਰੀਕਾ ਜਾਂ ਢੰਗ ਪ੍ਰਗਟ ਕਰੇ।",
    examples: [
      "ਹੌਲੀ-ਹੌਲੀ",
      "ਤੇਜ਼",
      "ਛੇਤੀ",
      "ਸਹਿਜੇ",
      "ਚੁੱਪ-ਚਾਪ",
      "ਜ਼ੋਰ ਨਾਲ",
      "ਧਿਆਨਪੂਰਵਕ",
      "ਬੇਧਿਆਨੀ ਨਾਲ",
      "ਸਹਿਜ-ਸੁਭਾਅ",
      "ਕਾਹਲੀ ਨਾਲ",
      "ਖਿੜੇ-ਮੱਥੇ",
    ],
  },
  {
    subtypeId: "SANKHYA",
    namePa: "ਸੰਖਿਆ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ (ਗਿਣਤੀ-ਵਾਚਕ)",
    definitionPa: "ਜਿਹੜਾ ਸ਼ਬਦ ਕਿਰਿਆ ਦੇ ਦੁਹਰਾਓ ਜਾਂ ਵਾਰੀ ਦੀ ਗਿਣਤੀ ਦੱਸੇ।",
    examples: [
      "ਮੁੜ-ਮੁੜ",
      "ਇੱਕ ਵਾਰ",
      "ਕਈ ਵਾਰ",
      "ਦੂਜੀ ਵਾਰ",
      "ਵਾਰ-ਵਾਰ",
      "ਦੁਬਾਰਾ",
      "ਘੜੀ-ਮੁੜੀ",
      "ਵਾਰੋ-ਵਾਰੀ",
      "ਇੱਕ-ਇੱਕ ਕਰਕੇ",
    ],
  },
  {
    subtypeId: "KARAN",
    namePa: "ਕਾਰਨ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ",
    definitionPa: "ਜਿਹੜਾ ਸ਼ਬਦ ਕਿਰਿਆ ਦੇ ਹੋਣ ਜਾਂ ਨਾ ਹੋਣ ਦਾ ਕਾਰਨ ਸਪਸ਼ਟ ਕਰੇ।",
    examples: [
      "ਕਿਉਂਕਿ",
      "ਇਸ ਲਈ",
      "ਤਦੇ",
      "ਇਸ ਵਾਸਤੇ",
      "ਸਿੱਟੇ ਵਜੋਂ",
      "ਕਿਉਂਜੋ",
      "ਇਸ ਕਾਰਨ",
      "ਸਬੱਬੀਂ",
    ],
  },
  {
    subtypeId: "TAKID",
    namePa: "ਤਾਕੀਦ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ (ਨਿਰਨਾ/ਪੱਕਿਆਈ)",
    definitionPa: "ਜਿਹੜਾ ਸ਼ਬਦ ਕਿਰਿਆ ਵਿੱਚ ਤਾਕੀਦ, ਪੱਕਿਆਈ ਜਾਂ ਜ਼ੋਰ ਪੈਦਾ ਕਰੇ।",
    examples: [
      "ਜ਼ਰੂਰ",
      "ਬਿਲਕੁਲ",
      "ਹੀ",
      "ਵੀ",
      "ਬੇਸ਼ੱਕ",
      "ਨਿਸੰਗ",
      "ਅਵੱਸ਼",
      "ਜ਼ਰੂਰ ਹੀ",
      "ਤਾਹੀਓਂ",
    ],
  },
  {
    subtypeId: "NIRNAY",
    namePa: "ਨਿਰਣੇ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ",
    definitionPa: "ਜਿਹੜਾ ਸ਼ਬਦ ਕਿਰਿਆ ਦੇ ਹੋਣ ਜਾਂ ਨਾ ਹੋਣ ਬਾਰੇ ਫ਼ੈਸਲਾ (ਹਾਂ ਜਾਂ ਨਾਂਹ) ਦੱਸੇ।",
    examples: [
      "ਹਾਂ ਜੀ",
      "ਆਹੋ",
      "ਨਾ",
      "ਨਹੀਂ",
      "ਜੀ ਹਾਂ",
      "ਕਦਾਚਿਤ ਨਹੀਂ",
      "ਬਿਲਕੁਲ ਨਹੀਂ",
      "ਸੱਚਮੁੱਚ",
    ],
  },
];

export interface DegreeItem {
  readonly base: string;
  readonly higher: string;
  readonly highest: string;
}

export const DEGREE_ITEMS: readonly DegreeItem[] = [
  { base: "ਉੱਚਾ", higher: "ਉਚੇਰਾ", highest: "ਉੱਚਤਮ" },
  { base: "ਚੰਗਾ", higher: "ਚੰਗੇਰਾ", highest: "ਉੱਤਮ" },
  { base: "ਮੋਟਾ", higher: "ਮੁਟੇਰਾ", highest: "ਸਭ ਤੋਂ ਮੋਟਾ" },
  { base: "ਸੁੰਦਰ", higher: "ਸੁੰਦਰਤਰ", highest: "ਸੁੰਦਰਤਮ" },
  { base: "ਲੰਮਾ", higher: "ਲੰਮੇਰਾ", highest: "ਸਭ ਤੋਂ ਲੰਮਾ" },
  { base: "ਡੂੰਘਾ", higher: "ਡੁੰਘੇਰਾ", highest: "ਸਭ ਤੋਂ ਡੂੰਘਾ" },
  { base: "ਵੱਡਾ", higher: "ਵਡੇਰਾ", highest: "ਸਭ ਤੋਂ ਵੱਡਾ" },
  { base: "ਪਤਲਾ", higher: "ਪਤਲੇਰਾ", highest: "ਸਭ ਤੋਂ ਪਤਲਾ" },
  { base: "ਮਿੱਠਾ", higher: "ਮਿਠੇਰਾ", highest: "ਸਭ ਤੋਂ ਮਿੱਠਾ" },
  { base: "ਨਿੱਕਾ", higher: "ਨਿਕੇਰਾ", highest: "ਸਭ ਤੋਂ ਨਿੱਕਾ" },
  { base: "ਸਖ਼ਤ", higher: "ਸਖ਼ਤਤਰ", highest: "ਸਖ਼ਤਤਮ" },
  { base: "ਕਠਿਨ", higher: "ਕਠਿਨਤਰ", highest: "ਕਠਿਨਤਮ" },
  { base: "ਨੇਕ", higher: "ਨੇਕਤਰ", highest: "ਨੇਕਤਮ" },
  { base: "ਤੇਜ਼", higher: "ਤੇਜ਼ਤਰ", highest: "ਤੇਜ਼ਤਮ" },
  { base: "ਸੌਖਾ", higher: "ਸੌਖੇਰਾ", highest: "ਸਭ ਤੋਂ ਸੌਖਾ" },
  { base: "ਔਖਾ", higher: "ਔਖੇਰਾ", highest: "ਸਭ ਤੋਂ ਔਖਾ" },
  { base: "ਭਾਰਾ", higher: "ਭਾਰੇਰਾ", highest: "ਸਭ ਤੋਂ ਭਾਰਾ" },
  { base: "ਹੌਲਾ", higher: "ਹੌਲੇਰਾ", highest: "ਸਭ ਤੋਂ ਹੌਲਾ" },
  { base: "ਮਹਾਨ", higher: "ਮਹਾਨਤਰ", highest: "ਮਹਾਨਤਮ" },
  { base: "ਸ਼੍ਰੇਸ਼ਠ", higher: "ਸ਼੍ਰੇਸ਼ਠਤਰ", highest: "ਸ਼੍ਰੇਸ਼ਠਤਮ" },
];
