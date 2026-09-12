/**
 * CP005: Adjectives & Adverbs (ਵਿਸ਼ੇਸ਼ਣ ਅਤੇ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ)
 * Curated comprehensive knowledge base of adjective and adverb classifications in Punjabi.
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
    definitionPa: "ਜਿਹੜਾ ਵਿਸ਼ੇਸ਼ਣ ਕਿਸੇ ਨਾਂਵ ਜਾਂ ਪੜਨਾਂਵ ਦੇ ਗੁਣ, ਔਗੁਣ, ਰੰਗ, ਆਕਾਰ, ਸੁਆਦ ਜਾਂ ਅਵਸਥਾ ਦੱਸੇ।",
    examples: [
      "ਸੁੰਦਰ", "ਕਾਲਾ", "ਬਹਾਦਰ", "ਮਿੱਠਾ", "ਨੇਕ", "ਮੰਦਾ", "ਇਮਾਨਦਾਰ", "ਕਮਜ਼ੋਰ", "ਬਲਵਾਨ", "ਸਿਆਣਾ",
      "ਚਲਾਕ", "ਸੁਹਿਰਦ", "ਕੋਮਲ", "ਕਰੂਪ", "ਉੱਚਾ", "ਲੰਮਾ", "ਸੂਰਬੀਰ", "ਮਿਹਨਤੀ", "ਗੋਰਾ", "ਪੀਲਾ",
      "ਨੀਲਾ", "ਹਰਾ", "ਲਾਲ", "ਖੱਟਾ", "ਕੌੜਾ", "ਨਮਕੀਨ", "ਸੁਆਦੀ", "ਬੇਸੁਆਦਾ", "ਚੌੜਾ", "ਡੂੰਘਾ",
      "ਪਤਲਾ", "ਮੋਟਾ", "ਨਿੱਕਾ", "ਵੱਡਾ", "ਭਾਰੀ", "ਹੌਲਾ", "ਤਿੱਖਾ", "ਖੁੰਢਾ", "ਗਰਮ", "ਠੰਢਾ",
      "ਕੂਲਾ", "ਸਖ਼ਤ", "ਨਰਮ", "ਸੁੱਕਾ", "ਗਿੱਲਾ", "ਤਾਜ਼ਾ", "ਬਾਸੀ", "ਅਮੀਰ", "ਗ਼ਰੀਬ", "ਦਿਆਲੂ"
    ],
  },
  {
    subtypeId: "SANKHYA",
    namePa: "ਸੰਖਿਆ-ਵਾਚਕ ਵਿਸ਼ੇਸ਼ਣ (ਗਿਣਤੀ-ਵਾਚਕ)",
    definitionPa: "ਜਿਹੜਾ ਵਿਸ਼ੇਸ਼ਣ ਨਾਂਵ ਜਾਂ ਪੜਨਾਂਵ ਦੀ ਗਿਣਤੀ, ਦਰਜਾ, ਕ੍ਰਮ ਜਾਂ ਵਾਰੀ ਦੱਸੇ।",
    examples: [
      "ਇੱਕ", "ਦੋ", "ਤਿੰਨ", "ਚਾਰ", "ਪੰਜ", "ਦਸ", "ਵੀਹ", "ਪੰਜਾਹ", "ਸੌ", "ਹਜ਼ਾਰ",
      "ਪਹਿਲਾ", "ਦੂਜਾ", "ਤੀਜਾ", "ਚੌਥਾ", "ਪੰਜਵਾਂ", "ਦਸਵਾਂ", "ਸੌਵਾਂ",
      "ਦੋਵੇਂ", "ਤਿੰਨੇ", "ਚਾਰੇ", "ਪੰਜੇ", "ਦਸੇ",
      "ਦੁੱਗਣਾ", "ਤਿੱਗਣਾ", "ਚੌਗੁਣਾ", "ਦਸਗੁਣਾ",
      "ਅੱਧਾ", "ਪੌਣਾ", "ਸਵਾ", "ਢਾਈ", "ਸਾਢੇ",
      "ਥੋੜ੍ਹੇ", "ਕੁਝ", "ਸਾਰੇ", "ਸੈਂਕੜੇ", "ਦਰਜਨ", "ਹਜ਼ਾਰਾਂ", "ਕਈ", "ਬਹੁਤੇ", "ਅਨੇਕ", "ਸਭ"
    ],
  },
  {
    subtypeId: "MINATI",
    namePa: "ਪਰਿਮਾਣ-ਵਾਚਕ ਵਿਸ਼ੇਸ਼ਣ (ਮਿਣਤੀ-ਵਾਚਕ)",
    definitionPa: "ਜਿਹੜਾ ਵਿਸ਼ੇਸ਼ਣ ਨਾਂਵ ਜਾਂ ਪੜਨਾਂਵ ਦੇ ਮਾਪ, ਤੋਲ, ਵਜ਼ਨ ਜਾਂ ਮਿਣਤੀ ਬਾਰੇ ਦੱਸੇ।",
    examples: [
      "ਦੋ ਲੀਟਰ", "ਚਾਰ ਮੀਟਰ", "ਕਿਲੋਗ੍ਰਾਮ", "ਪੰਜ ਕਿਲੋ", "ਸੇਰ ਭਰ", "ਮਣ ਭਰ", "ਟਨ", "ਕੁਇੰਟਲ",
      "ਥੋੜ੍ਹਾ ਜਿਹਾ", "ਬਹੁਤਾ", "ਗਿੱਠ ਭਰ", "ਢੇਰ ਸਾਰਾ", "ਜ਼ਰਾ ਕੁ", "ਮੁੱਠੀ ਭਰ", "ਚੁਟਕੀ ਭਰ", "ਕਾਫ਼ੀ",
      "ਰਤਾ ਭਰ", "ਬਹੁਤ ਸਾਰਾ", "ਅਥਾਹ", "ਮਣਾਂ-ਮੂੰਹੀਂ", "ਕੁਝ ਮੀਟਰ", "ਦਸ ਗਜ਼", "ਅੱਧਾ ਲੀਟਰ", "ਪੰਜ ਏਕੜ",
      "ਕਨਾਲ ਭਰ", "ਮਰਲਾ ਭਰ", "ਚੱਪਣੀ ਭਰ", "ਕੌਲੀ ਭਰ", "ਗਲਾਸ ਭਰ", "ਘੁੱਟ ਭਰ", "ਤੋਲਾ ਭਰ", "ਮਾਸਾ ਭਰ"
    ],
  },
  {
    subtypeId: "NISHCHAY",
    namePa: "ਨਿਸ਼ਚੇ-ਵਾਚਕ ਵਿਸ਼ੇਸ਼ਣ",
    definitionPa: "ਜਿਹੜਾ ਵਿਸ਼ੇਸ਼ਣ ਕਿਸੇ ਨਾਂਵ ਜਾਂ ਪੜਨਾਂਵ ਵੱਲ ਸੰਕੇਤ ਜਾਂ ਇਸ਼ਾਰਾ ਕਰਕੇ ਉਸ ਨੂੰ ਆਮ ਤੋਂ ਖ਼ਾਸ ਬਣਾਵੇ।",
    examples: [
      "ਇਹ", "ਉਹ", "ਆਹ", "ਔਹ", "ਉਹੀ", "ਏਹੋ", "ਓਹੋ", "ਇਹੋ ਜਿਹਾ", "ਉਹੋ ਜਿਹਾ", "ਆਹੀ", "ਓਹੀ",
      "ਇਹ ਮੁੰਡਾ", "ਉਹ ਕਿਤਾਬ", "ਆਹ ਘਰ", "ਔਹ ਰੁੱਖ", "ਇਹੋ ਕਾਰ", "ਓਹੋ ਗੱਡੀ", "ਇਹ ਸੱਜਣ", "ਉਹ ਦਰਵਾਜ਼ਾ",
      "ਆਹ ਕਲਮ", "ਔਹ ਪਹਾੜ", "ਇਹੀ ਵਿਦਿਆਰਥੀ", "ਉਹੀ ਦਫ਼ਤਰ"
    ],
  },
  {
    subtypeId: "PADNAVI",
    namePa: "ਪੜਨਾਂਵੀ ਵਿਸ਼ੇਸ਼ਣ",
    definitionPa: "ਜਿਹੜਾ ਸ਼ਬਦ ਮੂਲ ਰੂਪ ਵਿੱਚ ਪੜਨਾਂਵ ਹੋਵੇ ਪਰ ਨਾਂਵ ਦੇ ਨਾਲ ਆ ਕੇ ਵਿਸ਼ੇਸ਼ਣ ਦਾ ਕੰਮ ਕਰੇ।",
    examples: [
      "ਕਿਹੜਾ ਮੁੰਡਾ", "ਜਿਹੜੀ ਕੁੜੀ", "ਸਾਡਾ ਪਿੰਡ", "ਤੁਹਾਡਾ ਘਰ", "ਕਿਸ ਦਾ ਬਸਤਾ", "ਜਿਹੜਾ ਵਿਦਿਆਰਥੀ",
      "ਮੇਰੀ ਕਲਮ", "ਆਪਣਾ ਦੇਸ਼", "ਕਿਹੜੀ ਕਿਤਾਬ", "ਜਿਸ ਆਦਮੀ", "ਕਿਸੇ ਵਿਅਕਤੀ", "ਜੋ ਮਨੁੱਖ", "ਜਿਸ ਨਗਰ",
      "ਸਾਡੀ ਜਮਾਤ", "ਤੁਹਾਡੀ ਗੱਡੀ", "ਮੇਰਾ ਭਰਾ", "ਆਪਣੀ ਧਰਤੀ", "ਕਿਸੇ ਘਰ", "ਜਿਨ੍ਹਾਂ ਲੋਕਾਂ", "ਕਿਹੜੇ ਸ਼ਹਿਰ"
    ],
  },
];

export interface AdverbCategoryItem {
  readonly subtypeId: "KAAL" | "ASTHAN" | "DHANG" | "SANKHYA" | "PARIMAN" | "KARAN" | "TAKID" | "NIRNAY";
  readonly namePa: string;
  readonly definitionPa: string;
  readonly examples: readonly string[];
}

export const ADVERB_CATEGORIES: readonly AdverbCategoryItem[] = [
  {
    subtypeId: "KAAL",
    namePa: "ਕਾਲ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ",
    definitionPa: "ਜਿਹੜਾ ਸ਼ਬਦ ਕਿਰਿਆ ਦੇ ਵਾਪਰਨ ਜਾਂ ਹੋਣ ਦਾ ਸਮਾਂ ਦੱਸੇ।",
    examples: [
      "ਹੁਣ", "ਕੱਲ੍ਹ", "ਪਰਸੋਂ", "ਚੌਥ", "ਸਵੇਰੇ", "ਦੁਪਹਿਰੇ", "ਸ਼ਾਮੀਂ", "ਰਾਤੀਂ", "ਤੜਕੇ", "ਅੱਜ",
      "ਅੱਜ-ਕੱਲ੍ਹ", "ਕਦੇ-ਕਦੇ", "ਰੋਜ਼ਾਨਾ", "ਨਿੱਤ", "ਸਦਾ", "ਹਮੇਸ਼ਾ", "ਝੱਟਪੱਟ", "ਤੁਰੰਤ", "ਮਗਰੋਂ",
      "ਪਹਿਲਾਂ", "ਪਿੱਛੋਂ", "ਵੇਲੇ ਸਿਰ", "ਸਮੇਂ ਸਿਰ", "ਲਗਾਤਾਰ", "ਨਿਰੰਤਰ", "ਕਦੇ ਨਾ ਕਦੇ", "ਹਰ ਰੋਜ਼"
    ],
  },
  {
    subtypeId: "ASTHAN",
    namePa: "ਅਸਥਾਨ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ",
    definitionPa: "ਜਿਹੜਾ ਸ਼ਬਦ ਕਿਰਿਆ ਦੇ ਵਾਪਰਨ ਦਾ ਸਥਾਨ, ਥਾਂ ਜਾਂ ਦਿਸ਼ਾ ਦੱਸੇ।",
    examples: [
      "ਅੰਦਰ", "ਬਾਹਰ", "ਨੇੜੇ", "ਦੂਰ", "ਖੱਬੇ", "ਸੱਜੇ", "ਉੱਪਰ", "ਹੇਠਾਂ", "ਸਾਹਮਣੇ", "ਪਿੱਛੇ",
      "ਆਸ-ਪਾਸ", "ਵਿਚਕਾਰ", "ਕੋਲ", "ਪਰ੍ਹਾਂ", "ਉਰ੍ਹਾਂ", "ਇੱਧਰ", "ਉੱਧਰ", "ਜਿੱਧਰ", "ਕਿੱਧਰ",
      "ਦੁਆਲੇ", "ਅੱਗੇ", "ਪਿਛਾਂਹ", "ਨੇੜੇ-ਤੇੜੇ", "ਸਨਮੁੱਖ", "ਦੂਰ-ਦੁਰਾਡੇ"
    ],
  },
  {
    subtypeId: "DHANG",
    namePa: "ਪ੍ਰਕਾਰ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ (ਢੰਗ-ਵਾਚਕ)",
    definitionPa: "ਜਿਹੜਾ ਸ਼ਬਦ ਕਿਰਿਆ ਦੇ ਹੋਣ ਦਾ ਤਰੀਕਾ, ਢੰਗ ਜਾਂ ਰੀਤ ਪ੍ਰਗਟ ਕਰੇ।",
    examples: [
      "ਹੌਲੀ-ਹੌਲੀ", "ਤੇਜ਼", "ਛੇਤੀ", "ਸਹਿਜੇ", "ਚੁੱਪ-ਚਾਪ", "ਜ਼ੋਰ ਨਾਲ", "ਧਿਆਨਪੂਰਵਕ", "ਬੇਧਿਆਨੀ ਨਾਲ",
      "ਸਹਿਜ-ਸੁਭਾਅ", "ਕਾਹਲੀ ਨਾਲ", "ਖਿੜੇ-ਮੱਥੇ", "ਖ਼ੁਸ਼ੀ-ਖ਼ੁਸ਼ੀ", "ਚਲਾਕੀ ਨਾਲ", "ਸਫ਼ਾਈ ਨਾਲ", "ਸਖ਼ਤੀ ਨਾਲ",
      "ਪਿਆਰ ਨਾਲ", "ਰੋਂਦੇ-ਰੋਂਦੇ", "ਹੱਸਦੇ-ਹੱਸਦੇ", "ਇਉਂ", "ਜਿਉਂ", "ਕਿਉਂ", "ਤਿਉਂ", "ਅਚਾਨਕ", "ਇਕਦਮ"
    ],
  },
  {
    subtypeId: "SANKHYA",
    namePa: "ਸੰਖਿਆ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ (ਗਿਣਤੀ-ਵਾਚਕ)",
    definitionPa: "ਜਿਹੜਾ ਸ਼ਬਦ ਕਿਰਿਆ ਦੇ ਦੁਹਰਾਓ, ਵਾਰੀ ਜਾਂ ਆਵਿਰਤੀ ਦੀ ਗਿਣਤੀ ਦੱਸੇ।",
    examples: [
      "ਮੁੜ-ਮੁੜ", "ਇੱਕ ਵਾਰ", "ਕਈ ਵਾਰ", "ਦੂਜੀ ਵਾਰ", "ਵਾਰ-ਵਾਰ", "ਦੁਬਾਰਾ", "ਘੜੀ-ਮੁੜੀ", "ਵਾਰੋ-ਵਾਰੀ",
      "ਇੱਕ-ਇੱਕ ਕਰਕੇ", "ਦੋ-ਦੋ ਕਰਕੇ", "ਬਾਰ-ਬਾਰ", "ਸੌ ਵਾਰ", "ਦਸਵੀਂ ਵਾਰ", "ਮੁੜਕੇ", "ਦੂਸਰੀ ਦਫ਼ਾ", "ਹਰ ਵਾਰ"
    ],
  },
  {
    subtypeId: "PARIMAN",
    namePa: "ਪਰਿਮਾਣ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ (ਮਿਣਤੀ-ਵਾਚਕ)",
    definitionPa: "ਜਿਹੜਾ ਸ਼ਬਦ ਕਿਰਿਆ ਦੀ ਮਾਤਰਾ, ਮਿਣਤੀ ਜਾਂ ਦਰਜਾ ਪ੍ਰਗਟ ਕਰੇ।",
    examples: [
      "ਬਹੁਤ", "ਥੋੜ੍ਹਾ", "ਘੱਟ", "ਰਤਾ", "ਜ਼ਰਾ", "ਕਾਫ਼ੀ", "ਨਿਰਾ", "ਨਿਰੋਲ", "ਅਧਿਕ", "ਲਗਭਗ",
      "ਬਹੁਤ ਘੱਟ", "ਕਾਫ਼ੀ ਸਾਰਾ", "ਥੋੜ੍ਹਾ-ਬਹੁਤ", "ਜ਼ਰਾ ਜਿੰਨਾ", "ਰਤਾ ਕੁ", "ਏਨਾ", "ਓਨਾ", "ਜਿੰਨਾ", "ਕਿੰਨਾ"
    ],
  },
  {
    subtypeId: "KARAN",
    namePa: "ਕਾਰਨ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ",
    definitionPa: "ਜਿਹੜਾ ਸ਼ਬਦ ਕਿਰਿਆ ਦੇ ਹੋਣ ਜਾਂ ਨਾ ਹੋਣ ਦਾ ਕਾਰਨ, ਵਜ੍ਹਾ ਜਾਂ ਸਬੱਬ ਸਪਸ਼ਟ ਕਰੇ।",
    examples: [
      "ਕਿਉਂਕਿ", "ਇਸ ਲਈ", "ਤਦੇ", "ਇਸ ਵਾਸਤੇ", "ਸਿੱਟੇ ਵਜੋਂ", "ਕਿਉਂਜੋ", "ਇਸ ਕਾਰਨ", "ਸਬੱਬੀਂ",
      "ਤਾਂ ਹੀ", "ਕਾਰਨ", "ਜਿਸ ਕਰਕੇ", "ਇਸ ਬਿਨਾ 'ਤੇ", "ਤਾਹੀਓਂ", "ਏਸੇ ਲਈ"
    ],
  },
  {
    subtypeId: "TAKID",
    namePa: "ਤਾਕੀਦ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ (ਨਿਰਨਾ/ਪੱਕਿਆਈ)",
    definitionPa: "ਜਿਹੜਾ ਸ਼ਬਦ ਕਿਰਿਆ ਵਿੱਚ ਤਾਕੀਦ, ਪੱਕਿਆਈ, ਨਿਸਚਾ ਜਾਂ ਜ਼ੋਰ ਪੈਦਾ ਕਰੇ।",
    examples: [
      "ਜ਼ਰੂਰ", "ਬਿਲਕੁਲ", "ਹੀ", "ਵੀ", "ਬੇਸ਼ੱਕ", "ਨਿਸੰਗ", "ਅਵੱਸ਼", "ਜ਼ਰੂਰ ਹੀ", "ਤਾਹੀਓਂ",
      "ਨਿਸਚੇ ਹੀ", "ਖ਼ਾਸ ਕਰਕੇ", "ਯਕੀਨਨ", "ਹਰ ਹਾਲਤ ਵਿੱਚ", "ਸੱਚਮੁੱਚ ਹੀ", "ਲਾਜ਼ਮੀ"
    ],
  },
  {
    subtypeId: "NIRNAY",
    namePa: "ਨਿਰਣੇ-ਵਾਚਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ",
    definitionPa: "ਜਿਹੜਾ ਸ਼ਬਦ ਕਿਰਿਆ ਦੇ ਹੋਣ ਜਾਂ ਨਾ ਹੋਣ ਬਾਰੇ ਨਿਰਣਾ (ਹਾਂ-ਪੱਖੀ ਜਾਂ ਨਾਂਹ-ਪੱਖੀ ਫ਼ੈਸਲਾ) ਦੱਸੇ।",
    examples: [
      "ਹਾਂ ਜੀ", "ਆਹੋ", "ਨਾ", "ਨਹੀਂ", "ਜੀ ਹਾਂ", "ਕਦਾਚਿਤ ਨਹੀਂ", "ਬਿਲਕੁਲ ਨਹੀਂ", "ਸੱਚਮੁੱਚ",
      "ਜੀ ਨਹੀਂ", "ਕਦੇ ਨਹੀਂ", "ਹਾਂ", "ਬਿਲਕੁਲ ਹਾਂ", "ਠੀਕ ਹੈ", "ਅੱਛਾ"
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
  { base: "ਪਵਿੱਤਰ", higher: "ਪਵਿੱਤਰਤਰ", highest: "ਪਵਿੱਤਰਤਮ" },
  { base: "ਪ੍ਰਾਚੀਨ", higher: "ਪ੍ਰਾਚੀਨਤਰ", highest: "ਪ੍ਰਾਚੀਨਤਮ" },
  { base: "ਯੋਗ", higher: "ਯੋਗਤਰ", highest: "ਯੋਗਤਮ" },
  { base: "ਨਿਮਰ", higher: "ਨਿਮਰਤਰ", highest: "ਨਿਮਰਤਮ" },
  { base: "ਸੂਖਮ", higher: "ਸੂਖਮਤਰ", highest: "ਸੂਖਮਤਮ" },
  { base: "ਕੋਮਲ", higher: "ਕੋਮਲਤਰ", highest: "ਕੋਮਲਤਮ" },
  { base: "ਮਧੁਰ", higher: "ਮਧੁਰਤਰ", highest: "ਮਧੁਰਤਮ" },
  { base: "ਤੀਬਰ", higher: "ਤੀਬਰਤਰ", highest: "ਤੀਬਰਤਮ" },
  { base: "ਪਿਆਰਾ", higher: "ਪਿਆਰੇਰਾ", highest: "ਸਭ ਤੋਂ ਪਿਆਰਾ" },
  { base: "ਸੋਹਣਾ", higher: "ਸੁਹਣੇਰਾ", highest: "ਸਭ ਤੋਂ ਸੋਹਣਾ" },
  { base: "ਸੁਚੱਜਾ", higher: "ਸੁਚੱਜੇਰਾ", highest: "ਸਭ ਤੋਂ ਸੁਚੱਜਾ" },
  { base: "ਕੁਚੱਜਾ", higher: "ਕੁਚੱਜੇਰਾ", highest: "ਸਭ ਤੋਂ ਕੁਚੱਜਾ" },
  { base: "ਗੋਰਾ", higher: "ਗੋਰੇਰਾ", highest: "ਸਭ ਤੋਂ ਗੋਰਾ" },
  { base: "ਕਾਲਾ", higher: "ਕਲੇਰਾ", highest: "ਸਭ ਤੋਂ ਕਾਲਾ" },
  { base: "ਚੌੜਾ", higher: "ਚੁੜੇਰਾ", highest: "ਸਭ ਤੋਂ ਚੌੜਾ" },
  { base: "ਖੱਟਾ", higher: "ਖਟੇਰਾ", highest: "ਸਭ ਤੋਂ ਖੱਟਾ" },
  { base: "ਤੱਤਾ", higher: "ਤਤੇਰਾ", highest: "ਸਭ ਤੋਂ ਤੱਤਾ" },
  { base: "ਠੰਢਾ", higher: "ਠੰਢੇਰਾ", highest: "ਸਭ ਤੋਂ ਠੰਢਾ" },
  { base: "ਬੁੱਢਾ", higher: "ਵਡੇਰਾ", highest: "ਸਭ ਤੋਂ ਬੁੱਢਾ" },
  { base: "ਛੋਟਾ", higher: "ਛੁਟੇਰਾ", highest: "ਸਭ ਤੋਂ ਛੋਟਾ" },
];

export interface AdjectiveAgreementItem {
  readonly isDeclinable: boolean; // ਵਿਕਾਰੀ (true) ਜਾਂ ਅਵਿਕਾਰੀ (false)
  readonly masculineSingular: string;
  readonly masculinePlural: string;
  readonly feminineSingular: string;
  readonly femininePlural: string;
  readonly exampleNounMasc: string;
  readonly exampleNounFem: string;
  readonly notePa: string;
}

export const ADJECTIVE_AGREEMENT_ITEMS: readonly AdjectiveAgreementItem[] = [
  // Declinable (ਵਿਕਾਰੀ ਵਿਸ਼ੇਸ਼ਣ - ਲਿੰਗ ਅਤੇ ਵਚਨ ਅਨੁਸਾਰ ਰੂਪ ਬਦਲਦੇ ਹਨ)
  {
    isDeclinable: true,
    masculineSingular: "ਚੰਗਾ",
    masculinePlural: "ਚੰਗੇ",
    feminineSingular: "ਚੰਗੀ",
    femininePlural: "ਚੰਗੀਆਂ",
    exampleNounMasc: "ਮੁੰਡਾ",
    exampleNounFem: "ਕੁੜੀ",
    notePa: "‘ਚੰਗਾ’ ਵਿਕਾਰੀ ਵਿਸ਼ੇਸ਼ਣ ਹੈ, ਜੋ ਪੁਲਿੰਗ/ਇਸਤਰੀ ਲਿੰਗ ਅਤੇ ਇੱਕਵਚਨ/ਬਹੁਵਚਨ ਅਨੁਸਾਰ ਬਦਲਦਾ ਹੈ।",
  },
  {
    isDeclinable: true,
    masculineSingular: "ਕਾਲਾ",
    masculinePlural: "ਕਾਲੇ",
    feminineSingular: "ਕਾਲੀ",
    femininePlural: "ਕਾਲੀਆਂ",
    exampleNounMasc: "ਘੋੜਾ",
    exampleNounFem: "ਘੋੜੀ",
    notePa: "‘ਕਾਲਾ’ ਰੰਗ-ਵਾਚਕ ਵਿਕਾਰੀ ਵਿਸ਼ੇਸ਼ਣ ਹੈ (ਕਾਲਾ ਘੋੜਾ, ਕਾਲੇ ਘੋੜੇ, ਕਾਲੀ ਘੋੜੀ, ਕਾਲੀਆਂ ਘੋੜੀਆਂ)।",
  },
  {
    isDeclinable: true,
    masculineSingular: "ਸੋਹਣਾ",
    masculinePlural: "ਸੋਹਣੇ",
    feminineSingular: "ਸੋਹਣੀ",
    femininePlural: "ਸੋਹਣੀਆਂ",
    exampleNounMasc: "ਬਾਲਕ",
    exampleNounFem: "ਬੱਚੀ",
    notePa: "‘ਸੋਹਣਾ’ ਵਿਕਾਰੀ ਵਿਸ਼ੇਸ਼ਣ ਹੈ (ਸੋਹਣਾ ਬਾਲਕ, ਸੋਹਣੇ ਬਾਲਕ, ਸੋਹਣੀ ਬੱਚੀ, ਸੋਹਣੀਆਂ ਬੱਚੀਆਂ)।",
  },
  {
    isDeclinable: true,
    masculineSingular: "ਮਿੱਠਾ",
    masculinePlural: "ਮਿੱਠੇ",
    feminineSingular: "ਮਿੱਠੀ",
    femininePlural: "ਮਿੱਠੀਆਂ",
    exampleNounMasc: "ਸੇਬ",
    exampleNounFem: "ਲੀਚੀ",
    notePa: "‘ਮਿੱਠਾ’ ਗੁਣ-ਵਾਚਕ ਵਿਕਾਰੀ ਵਿਸ਼ੇਸ਼ਣ ਹੈ।",
  },
  {
    isDeclinable: true,
    masculineSingular: "ਵੱਡਾ",
    masculinePlural: "ਵੱਡੇ",
    feminineSingular: "ਵੱਡੀ",
    femininePlural: "ਵੱਡੀਆਂ",
    exampleNounMasc: "ਦਰਵਾਜ਼ਾ",
    exampleNounFem: "ਖਿੜਕੀ",
    notePa: "‘ਵੱਡਾ’ ਆਕਾਰ-ਵਾਚਕ ਵਿਕਾਰੀ ਵਿਸ਼ੇਸ਼ਣ ਹੈ।",
  },
  {
    isDeclinable: true,
    masculineSingular: "ਨਿੱਕਾ",
    masculinePlural: "ਨਿੱਕੇ",
    feminineSingular: "ਨਿੱਕੀ",
    femininePlural: "ਨਿੱਕੀਆਂ",
    exampleNounMasc: "ਬੱਚਾ",
    exampleNounFem: "ਬੱਚੀ",
    notePa: "‘ਨਿੱਕਾ’ ਵਿਕਾਰੀ ਵਿਸ਼ੇਸ਼ਣ ਹੈ।",
  },
  {
    isDeclinable: true,
    masculineSingular: "ਪਤਲਾ",
    masculinePlural: "ਪਤਲੇ",
    feminineSingular: "ਪਤਲੀ",
    femininePlural: "ਪਤਲੀਆਂ",
    exampleNounMasc: "ਧਾਗਾ",
    exampleNounFem: "ਰੱਸੀ",
    notePa: "‘ਪਤਲਾ’ ਵਿਕਾਰੀ ਵਿਸ਼ੇਸ਼ਣ ਹੈ।",
  },
  {
    isDeclinable: true,
    masculineSingular: "ਮੋਟਾ",
    masculinePlural: "ਮੋਟੇ",
    feminineSingular: "ਮੋਟੀ",
    femininePlural: "ਮੋਟੀਆਂ",
    exampleNounMasc: "ਰੁੱਖ",
    exampleNounFem: "ਟਾਹਣੀ",
    notePa: "‘ਮੋਟਾ’ ਵਿਕਾਰੀ ਵਿਸ਼ੇਸ਼ਣ ਹੈ।",
  },
  {
    isDeclinable: true,
    masculineSingular: "ਉੱਚਾ",
    masculinePlural: "ਉੱਚੇ",
    feminineSingular: "ਉੱਚੀ",
    femininePlural: "ਉੱਚੀਆਂ",
    exampleNounMasc: "ਮਹਿਲ",
    exampleNounFem: "ਇਮਾਰਤ",
    notePa: "‘ਉੱਚਾ’ ਵਿਕਾਰੀ ਵਿਸ਼ੇਸ਼ਣ ਹੈ।",
  },
  {
    isDeclinable: true,
    masculineSingular: "ਗੋਰਾ",
    masculinePlural: "ਗੋਰੇ",
    feminineSingular: "ਗੋਰੀ",
    femininePlural: "ਗੋਰੀਆਂ",
    exampleNounMasc: "ਮੁੰਡਾ",
    exampleNounFem: "ਕੁੜੀ",
    notePa: "‘ਗੋਰਾ’ ਵਿਕਾਰੀ ਵਿਸ਼ੇਸ਼ਣ ਹੈ।",
  },
  {
    isDeclinable: true,
    masculineSingular: "ਪੀਲਾ",
    masculinePlural: "ਪੀਲੇ",
    feminineSingular: "ਪੀਲੀ",
    femininePlural: "ਪੀਲੀਆਂ",
    exampleNounMasc: "ਫੁੱਲ",
    exampleNounFem: "ਸਰ੍ਹੋਂ",
    notePa: "‘ਪੀਲਾ’ ਵਿਕਾਰੀ ਵਿਸ਼ੇਸ਼ਣ ਹੈ।",
  },
  {
    isDeclinable: true,
    masculineSingular: "ਖੱਟਾ",
    masculinePlural: "ਖੱਟੇ",
    feminineSingular: "ਖੱਟੀ",
    femininePlural: "ਖੱਟੀਆਂ",
    exampleNounMasc: "ਨਿੰਬੂ",
    exampleNounFem: "ਇਮਲੀ",
    notePa: "‘ਖੱਟਾ’ ਵਿਕਾਰੀ ਵਿਸ਼ੇਸ਼ਣ ਹੈ।",
  },
  {
    isDeclinable: true,
    masculineSingular: "ਠੰਢਾ",
    masculinePlural: "ਠੰਢੇ",
    feminineSingular: "ਠੰਢੀ",
    femininePlural: "ਠੰਢੀਆਂ",
    exampleNounMasc: "ਸ਼ਰਬਤ",
    exampleNounFem: "ਲੱਸੀ",
    notePa: "‘ਠੰਢਾ’ ਵਿਕਾਰੀ ਵਿਸ਼ੇਸ਼ਣ ਹੈ।",
  },
  {
    isDeclinable: true,
    masculineSingular: "ਤੱਤਾ",
    masculinePlural: "ਤੱਤੇ",
    feminineSingular: "ਤੱਤੀ",
    femininePlural: "ਤੱਤੀਆਂ",
    exampleNounMasc: "ਦੁੱਧ",
    exampleNounFem: "ਚਾਹ",
    notePa: "‘ਤੱਤਾ’ ਵਿਕਾਰੀ ਵਿਸ਼ੇਸ਼ਣ ਹੈ।",
  },
  // Indeclinable (ਅਵਿਕਾਰੀ ਵਿਸ਼ੇਸ਼ਣ - ਲਿੰਗ ਅਤੇ ਵਚਨ ਬਦਲਣ 'ਤੇ ਵੀ ਰੂਪ ਨਹੀਂ ਬਦਲਦੇ)
  {
    isDeclinable: false,
    masculineSingular: "ਸੁੰਦਰ",
    masculinePlural: "ਸੁੰਦਰ",
    feminineSingular: "ਸੁੰਦਰ",
    femininePlural: "ਸੁੰਦਰ",
    exampleNounMasc: "ਬਾਗ਼",
    exampleNounFem: "ਤਸਵੀਰ",
    notePa: "‘ਸੁੰਦਰ’ ਅਵਿਕਾਰੀ ਵਿਸ਼ੇਸ਼ਣ ਹੈ; ਇਹ ਪੁਲਿੰਗ, ਇਸਤਰੀ ਲਿੰਗ, ਇੱਕਵਚਨ ਅਤੇ ਬਹੁਵਚਨ ਸਭ ਵਿੱਚ ਇੱਕੋ ਜਿਹਾ ਰਹਿੰਦਾ ਹੈ।",
  },
  {
    isDeclinable: false,
    masculineSingular: "ਲਾਲ",
    masculinePlural: "ਲਾਲ",
    feminineSingular: "ਲਾਲ",
    femininePlural: "ਲਾਲ",
    exampleNounMasc: "ਗੁਲਾਬ",
    exampleNounFem: "ਪੱਗ",
    notePa: "‘ਲਾਲ’ ਅਵਿਕਾਰੀ ਵਿਸ਼ੇਸ਼ਣ ਹੈ (ਲਾਲ ਫੁੱਲ, ਲਾਲ ਕਾਰਾਂ)।",
  },
  {
    isDeclinable: false,
    masculineSingular: "ਇਮਾਨਦਾਰ",
    masculinePlural: "ਇਮਾਨਦਾਰ",
    feminineSingular: "ਇਮਾਨਦਾਰ",
    femininePlural: "ਇਮਾਨਦਾਰ",
    exampleNounMasc: "ਅਫ਼ਸਰ",
    exampleNounFem: "ਕਰਮਚਾਰੀ",
    notePa: "‘ਇਮਾਨਦਾਰ’ ਅਵਿਕਾਰੀ ਵਿਸ਼ੇਸ਼ਣ ਹੈ।",
  },
  {
    isDeclinable: false,
    masculineSingular: "ਬਹਾਦਰ",
    masculinePlural: "ਬਹਾਦਰ",
    feminineSingular: "ਬਹਾਦਰ",
    femininePlural: "ਬਹਾਦਰ",
    exampleNounMasc: "ਸਿਪਾਹੀ",
    exampleNounFem: "ਕੁੜੀ",
    notePa: "‘ਬਹਾਦਰ’ ਅਵਿਕਾਰੀ ਵਿਸ਼ੇਸ਼ਣ ਹੈ।",
  },
  {
    isDeclinable: false,
    masculineSingular: "ਨੇਕ",
    masculinePlural: "ਨੇਕ",
    feminineSingular: "ਨੇਕ",
    femininePlural: "ਨੇਕ",
    exampleNounMasc: "ਆਦਮੀ",
    exampleNounFem: "ਔਰਤ",
    notePa: "‘ਨੇਕ’ ਅਵਿਕਾਰੀ ਵਿਸ਼ੇਸ਼ਣ ਹੈ।",
  },
  {
    isDeclinable: false,
    masculineSingular: "ਮਿਹਨਤੀ",
    masculinePlural: "ਮਿਹਨਤੀ",
    feminineSingular: "ਮਿਹਨਤੀ",
    femininePlural: "ਮਿਹਨਤੀ",
    exampleNounMasc: "ਮਜ਼ਦੂਰ",
    exampleNounFem: "ਵਿਦਿਆਰਥਣ",
    notePa: "‘ਮਿਹਨਤੀ’ ਅਵਿਕਾਰੀ ਵਿਸ਼ੇਸ਼ਣ ਹੈ।",
  },
  {
    isDeclinable: false,
    masculineSingular: "ਹੁਸ਼ਿਆਰ",
    masculinePlural: "ਹੁਸ਼ਿਆਰ",
    feminineSingular: "ਹੁਸ਼ਿਆਰ",
    femininePlural: "ਹੁਸ਼ਿਆਰ",
    exampleNounMasc: "ਵਿਦਿਆਰਥੀ",
    exampleNounFem: "ਵਿਦਿਆਰਥਣ",
    notePa: "‘ਹੁਸ਼ਿਆਰ’ ਅਵਿਕਾਰੀ ਵਿਸ਼ੇਸ਼ਣ ਹੈ।",
  },
  {
    isDeclinable: false,
    masculineSingular: "ਕਮਜ਼ੋਰ",
    masculinePlural: "ਕਮਜ਼ੋਰ",
    feminineSingular: "ਕਮਜ਼ੋਰ",
    femininePlural: "ਕਮਜ਼ੋਰ",
    exampleNounMasc: "ਮਰੀਜ਼",
    exampleNounFem: "ਗਾਂ",
    notePa: "‘ਕਮਜ਼ੋਰ’ ਅਵਿਕਾਰੀ ਵਿਸ਼ੇਸ਼ਣ ਹੈ।",
  },
  {
    isDeclinable: false,
    masculineSingular: "ਚਲਾਕ",
    masculinePlural: "ਚਲਾਕ",
    feminineSingular: "ਚਲਾਕ",
    femininePlural: "ਚਲਾਕ",
    exampleNounMasc: "ਚੋਰ",
    exampleNounFem: "ਲੂੰਬੜੀ",
    notePa: "‘ਚਲਾਕ’ ਅਵਿਕਾਰੀ ਵਿਸ਼ੇਸ਼ਣ ਹੈ।",
  },
  {
    isDeclinable: false,
    masculineSingular: "ਦਿਆਲੂ",
    masculinePlural: "ਦਿਆਲੂ",
    feminineSingular: "ਦਿਆਲੂ",
    femininePlural: "ਦਿਆਲੂ",
    exampleNounMasc: "ਰਾਜਾ",
    exampleNounFem: "ਰਾਣੀ",
    notePa: "‘ਦਿਆਲੂ’ ਅਵਿਕਾਰੀ ਵਿਸ਼ੇਸ਼ਣ ਹੈ।",
  },
];
