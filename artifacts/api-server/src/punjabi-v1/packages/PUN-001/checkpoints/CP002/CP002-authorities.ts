export type SpellingCategory =
  | "SIHARI_BIHARI"
  | "AUNKAR_DULANKAR"
  | "HA_PAIRIN_SOUND"
  | "ADDAK_OMISSION"
  | "LOANWORD_PHONETICS";

export interface SpellingAuthority {
  id: string;
  correct: string;
  incorrect: readonly [string, string, string];
  category: SpellingCategory;
  explanationPa: string;
  contextPa: string;
  sourceStatus: "REVIEW_PENDING";
}

/**
 * Forward-port Wave 1.
 * These records are extracted from the donor corpus for review generation only.
 * REVIEW_PENDING means they are not production linguistic authority yet.
 */
export const CP002_AUTHORITIES: readonly SpellingAuthority[] = [
  {
    id: "SPL-001",
    correct: "ਕਵੀ",
    incorrect: ["ਕਵਿ", "ਕਵੀਂ", "ਕਵਈ"],
    category: "SIHARI_BIHARI",
    explanationPa: "‘ਕਵੀ’ ਸ਼ਬਦ ਦੇ ਅੰਤ ਵਿੱਚ ਬਿਹਾਰੀ (ੀ) ਲੱਗਦੀ ਹੈ।",
    contextPa: "ਉਹ ਪੰਜਾਬੀ ਦਾ ਪ੍ਰਸਿੱਧ ਕਵੀ ਹੈ।",
    sourceStatus: "REVIEW_PENDING",
  },
  {
    id: "SPL-002",
    correct: "ਨਦੀ",
    incorrect: ["ਨਦਿ", "ਨਦੀਂ", "ਨਦਈ"],
    category: "SIHARI_BIHARI",
    explanationPa: "‘ਨਦੀ’ ਦੇ ਅੰਤ ਵਿੱਚ ਬਿਹਾਰੀ (ੀ) ਲੱਗਦੀ ਹੈ।",
    contextPa: "ਇਹ ਨਦੀ ਪਿੰਡ ਦੇ ਨੇੜੇ ਵਗਦੀ ਹੈ।",
    sourceStatus: "REVIEW_PENDING",
  },
  {
    id: "SPL-003",
    correct: "ਸਥਿਤੀ",
    incorrect: ["ਸਥੀਤੀ", "ਸਥਤੀ", "ਸਥਿਤਿ"],
    category: "SIHARI_BIHARI",
    explanationPa: "ਸਹੀ ਸ਼ਬਦ-ਜੋੜ ‘ਸਥਿਤੀ’ ਹੈ।",
    contextPa: "ਮੌਸਮ ਦੀ ਸਥਿਤੀ ਹੁਣ ਸੁਧਰ ਰਹੀ ਹੈ।",
    sourceStatus: "REVIEW_PENDING",
  },
  {
    id: "SPL-005",
    correct: "ਸ਼ਹਿਰ",
    incorrect: ["ਸ਼ੈਹਰ", "ਸ਼ਹਰ", "ਸ਼ਹਿੜ"],
    category: "HA_PAIRIN_SOUND",
    explanationPa: "ਸਹੀ ਸ਼ਬਦ-ਜੋੜ ‘ਸ਼ਹਿਰ’ ਹੈ।",
    contextPa: "ਉਹ ਪੜ੍ਹਾਈ ਲਈ ਸ਼ਹਿਰ ਗਿਆ।",
    sourceStatus: "REVIEW_PENDING",
  },
  {
    id: "SPL-006",
    correct: "ਨਹਿਰ",
    incorrect: ["ਨੈਹਰ", "ਨਹਰ", "ਨੇਹਰ"],
    category: "HA_PAIRIN_SOUND",
    explanationPa: "ਸਹੀ ਸ਼ਬਦ-ਜੋੜ ‘ਨਹਿਰ’ ਹੈ।",
    contextPa: "ਖੇਤਾਂ ਦੇ ਕੋਲੋਂ ਨਹਿਰ ਲੰਘਦੀ ਹੈ।",
    sourceStatus: "REVIEW_PENDING",
  },
  {
    id: "SPL-007",
    correct: "ਪੜ੍ਹਨਾ",
    incorrect: ["ਪੜਨਾ", "ਪੜ੍ਹਨਾਂ", "ਪੜ੍ਹੰਨਾ"],
    category: "HA_PAIRIN_SOUND",
    explanationPa: "‘ਪੜ੍ਹਨਾ’ ਵਿੱਚ ੜ ਦੇ ਪੈਰ ਵਿੱਚ ਹਾਹਾ (੍ਹ) ਆਉਂਦਾ ਹੈ।",
    contextPa: "ਮੈਨੂੰ ਹਰ ਰੋਜ਼ ਅਖ਼ਬਾਰ ਪੜ੍ਹਨਾ ਚੰਗਾ ਲੱਗਦਾ ਹੈ।",
    sourceStatus: "REVIEW_PENDING",
  },
  {
    id: "SPL-008",
    correct: "ਚੜ੍ਹਨਾ",
    incorrect: ["ਚੜਨਾ", "ਚੜ੍ਹਨਾਂ", "ਚੈੜਨਾ"],
    category: "HA_PAIRIN_SOUND",
    explanationPa: "‘ਚੜ੍ਹਨਾ’ ਵਿੱਚ ੜ ਦੇ ਪੈਰ ਵਿੱਚ ਹਾਹਾ (੍ਹ) ਆਉਂਦਾ ਹੈ।",
    contextPa: "ਉਸ ਨੇ ਪੌੜੀਆਂ ਚੜ੍ਹਨਾ ਸ਼ੁਰੂ ਕੀਤਾ।",
    sourceStatus: "REVIEW_PENDING",
  },
  {
    id: "SPL-009",
    correct: "ਕਹਿਣਾ",
    incorrect: ["ਕੈਹਣਾ", "ਕਹਣਾ", "ਕਹਿਨਾ"],
    category: "HA_PAIRIN_SOUND",
    explanationPa: "ਸਹੀ ਸ਼ਬਦ-ਜੋੜ ‘ਕਹਿਣਾ’ ਹੈ।",
    contextPa: "ਮੈਂ ਤੁਹਾਨੂੰ ਇੱਕ ਗੱਲ ਕਹਿਣਾ ਚਾਹੁੰਦਾ ਹਾਂ।",
    sourceStatus: "REVIEW_PENDING",
  },
  {
    id: "SPL-010",
    correct: "ਸਹਿਣਾ",
    incorrect: ["ਸੈਹਣਾ", "ਸਹਣਾ", "ਸੇਹਣਾ"],
    category: "HA_PAIRIN_SOUND",
    explanationPa: "ਸਹੀ ਸ਼ਬਦ-ਜੋੜ ‘ਸਹਿਣਾ’ ਹੈ।",
    contextPa: "ਇੰਨੀ ਗਰਮੀ ਸਹਿਣਾ ਔਖਾ ਹੈ।",
    sourceStatus: "REVIEW_PENDING",
  },
  {
    id: "SPL-011",
    correct: "ਸੂਰਜ",
    incorrect: ["ਸੁਰਜ", "ਸੂਰਜ਼", "ਸੁੜਜ"],
    category: "AUNKAR_DULANKAR",
    explanationPa: "‘ਸੂਰਜ’ ਵਿੱਚ ਸ ਨਾਲ ਦੁਲੈਂਕੜ (ੂ) ਲੱਗਦਾ ਹੈ।",
    contextPa: "ਸੂਰਜ ਪੂਰਬ ਵੱਲੋਂ ਚੜ੍ਹਦਾ ਹੈ।",
    sourceStatus: "REVIEW_PENDING",
  },
  {
    id: "SPL-012",
    correct: "ਸਕੂਲ",
    incorrect: ["ਸਕੁਲ", "ਸਕੂਲ੍ਹ", "ਸ਼ਕੂਲ"],
    category: "AUNKAR_DULANKAR",
    explanationPa: "‘ਸਕੂਲ’ ਵਿੱਚ ਕ ਨਾਲ ਦੁਲੈਂਕੜ (ੂ) ਲੱਗਦਾ ਹੈ।",
    contextPa: "ਬੱਚੇ ਸਮੇਂ ਸਿਰ ਸਕੂਲ ਪਹੁੰਚ ਗਏ।",
    sourceStatus: "REVIEW_PENDING",
  },
  {
    id: "SPL-013",
    correct: "ਕਾਨੂੰਨ",
    incorrect: ["ਕਾਨੂਨ", "ਕਾਨੂੰਨਿ", "ਕਾਨੁਨ"],
    category: "LOANWORD_PHONETICS",
    explanationPa: "ਸਹੀ ਸ਼ਬਦ-ਜੋੜ ‘ਕਾਨੂੰਨ’ ਹੈ।",
    contextPa: "ਹਰ ਨਾਗਰਿਕ ਨੂੰ ਕਾਨੂੰਨ ਦੀ ਪਾਲਣਾ ਕਰਨੀ ਚਾਹੀਦੀ ਹੈ।",
    sourceStatus: "REVIEW_PENDING",
  },
  {
    id: "SPL-014",
    correct: "ਜ਼ਰੂਰ",
    incorrect: ["ਜਰੂਰ", "ਜ਼ਰੁਰ", "ਜ਼ਰੂੜ"],
    category: "LOANWORD_PHONETICS",
    explanationPa: "ਸਹੀ ਸ਼ਬਦ-ਜੋੜ ‘ਜ਼ਰੂਰ’ ਹੈ।",
    contextPa: "ਤੁਸੀਂ ਕੱਲ੍ਹ ਜ਼ਰੂਰ ਆਓ।",
    sourceStatus: "REVIEW_PENDING",
  },
  {
    id: "SPL-015",
    correct: "ਬੁੱਧੀ",
    incorrect: ["ਬੁਧੀ", "ਬੁੱਧਿ", "ਬੂਧੀ"],
    category: "ADDAK_OMISSION",
    explanationPa: "‘ਬੁੱਧੀ’ ਵਿੱਚ ਅੱਧਕ ਨਾਲ ਦੁੱਗਣੀ ਧੁਨੀ ਬਣਦੀ ਹੈ।",
    contextPa: "ਸਹੀ ਫ਼ੈਸਲਾ ਬੁੱਧੀ ਨਾਲ ਲੈਣਾ ਚਾਹੀਦਾ ਹੈ।",
    sourceStatus: "REVIEW_PENDING",
  },
] as const;
