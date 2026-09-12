/**
 * CP002: Spelling Precision (ਸ਼ੁੱਧ-ਅਸ਼ੁੱਧ ਸ਼ਬਦ-ਜੋੜ)
 * Curated knowledge base of high-yield exam-tested orthographic confusion sets.
 */

export interface SpellingItem {
  readonly id: string;
  readonly correct: string;
  readonly incorrectVariations: readonly string[];
  readonly category:
    | "SIHARI_BIHARI"     // ਸਿਹਾਰੀ / ਬਿਹਾਰੀ ਭੁਲੇਖਾ (e.g. ਕਵੀ vs ਕਵਿ)
    | "AUNKAR_DULANKAR"   // ਔਂਕੜ / ਦੁਲੈਂਕੜ ਭੁਲੇਖਾ (e.g. ਸੂਰਜ vs ਸੁਰਜ)
    | "HA_PAIRIN_SOUND"   // ਹਾਹਾ ਪੈਰੀਂ / ਸ੍ਵਰ ਉਚਾਰਨ (e.g. ਸ਼ਹਿਰ vs ਸ਼ੈਹਰ, ਪੜ੍ਹਨਾ vs ਪੜਨਾ)
    | "TIPPI_BINDI"       // ਟਿੱਪੀ / ਬਿੰਦੀ ਭੁਲੇਖਾ (e.g. ਕੰਘੀ vs ਕਂਘੀ)
    | "ADDAK_OMISSION"    // ਅੱਧਕ ਛੱਡਣਾ / ਗ਼ਲਤ ਲਾਉਣਾ (e.g. ਬੱਚਾ vs ਬਚਾ)
    | "LOANWORD_PHONETICS";// ਫ਼ਾਰਸੀ/ਅੰਗਰੇਜ਼ੀ ਸ਼ਬਦ-ਜੋੜ (e.g. ਕਾਨੂੰਨ vs ਕਾਨੂਨ);
  readonly explanationPa: string;
}

export const CP002_SPELLING_ITEMS: readonly SpellingItem[] = [
  // 1. ਸਿਹਾਰੀ / ਬਿਹਾਰੀ ਭੁਲੇਖਾ
  {
    id: "SPL-001",
    correct: "ਕਵੀ",
    incorrectVariations: ["ਕਵਿ", "ਕਵੀਂ", "ਕਵਈ"],
    category: "SIHARI_BIHARI",
    explanationPa: "ਪੰਜਾਬੀ ਵਿੱਚ ਸ਼ਬਦ ਦੇ ਅੰਤ ਵਿੱਚ ਬਿਹਾਰੀ (ੀ) ਲੱਗਦੀ ਹੈ, ਇਸ ਲਈ ‘ਕਵੀ’ ਸ਼ੁੱਧ ਸ਼ਬਦ-ਜੋੜ ਹੈ।",
  },
  {
    id: "SPL-002",
    correct: "ਨਦੀ",
    incorrectVariations: ["ਨਦਿ", "ਨਦੀਂ", "ਨਦਈ"],
    category: "SIHARI_BIHARI",
    explanationPa: "ਪੰਜਾਬੀ ਸ਼ਬਦ-ਜੋੜਾਂ ਅਨੁਸਾਰ ਅੰਤਲਾ ਸਵਰ ਦੀਰਘ ਹੁੰਦਾ ਹੈ, ਇਸ ਲਈ ‘ਨਦੀ’ ਸ਼ੁੱਧ ਰੂਪ ਹੈ।",
  },
  {
    id: "SPL-003",
    correct: "ਸਥਿਤੀ",
    incorrectVariations: ["ਸਥੀਤੀ", "ਸਥਤੀ", "ਸਥਿਤਿ"],
    category: "SIHARI_BIHARI",
    explanationPa: "‘ਸਥਿਤੀ’ ਵਿੱਚ ਪਹਿਲੀ ਲਗ ਸਿਹਾਰੀ ਅਤੇ ਦੂਜੀ ਲਗ ਬਿਹਾਰੀ ਹੁੰਦੀ ਹੈ।",
  },
  {
    id: "SPL-004",
    correct: "ਕਿਰਪਾ",
    incorrectVariations: ["ਕ੍ਰਿਪਾ", "ਕ੍ਰਿਪਾਂ", "ਕਿਰਪਾਂ"],
    category: "SIHARI_BIHARI",
    explanationPa: "ਪੰਜਾਬੀ ਟਕਸਾਲੀ ਰੂਪ ਵਿੱਚ ਤਤਸਮ ‘ਕ੍ਰਿਪਾ’ ਦੀ ਥਾਂ ਤਦਭਵ ‘ਕਿਰਪਾ’ ਸ਼ੁੱਧ ਮੰਨਿਆ ਜਾਂਦਾ ਹੈ।",
  },

  // 2. ਹਾਹਾ ਧੁਨੀ ਅਤੇ ਸਿਹਾਰੀ ਦਾ ਉਚਾਰਨ (Ha-pairin & Vowel shift)
  {
    id: "SPL-005",
    correct: "ਸ਼ਹਿਰ",
    incorrectVariations: ["ਸ਼ੈਹਰ", "ਸ਼ਹਰ", "ਸ਼ਹਿੜ"],
    category: "HA_PAIRIN_SOUND",
    explanationPa: "‘ਹ’ ਤੋਂ ਪਹਿਲੇ ਅੱਖਰ ਦੀ ਐ-ਕਾਰ ਧੁਨੀ ਲਈ ‘ਹ’ ਉੱਤੇ ਸਿਹਾਰੀ ਲੱਗਦੀ ਹੈ, ਇਸ ਲਈ ‘ਸ਼ਹਿਰ’ ਸ਼ੁੱਧ ਹੈ।",
  },
  {
    id: "SPL-006",
    correct: "ਨਹਿਰ",
    incorrectVariations: ["ਨੈਹਰ", "ਨਹਰ", "ਨੇਹਰ"],
    category: "HA_PAIRIN_SOUND",
    explanationPa: "ਪੰਜਾਬੀ ਧੁਨੀ-ਨੇਮਾਂ ਅਨੁਸਾਰ ‘ਹ’ ਨਾਲ ਸਿਹਾਰੀ ਲਾ ਕੇ ‘ਨਹਿਰ’ ਲਿਖਿਆ ਜਾਂਦਾ ਹੈ।",
  },
  {
    id: "SPL-007",
    correct: "ਪੜ੍ਹਨਾ",
    incorrectVariations: ["ਪੜਨਾ", "ਪੜ੍ਹਨਾਂ", "ਪੜ੍ਹੰਨਾ"],
    category: "HA_PAIRIN_SOUND",
    explanationPa: "‘ਪੜ੍ਹਨਾ’ ਵਿੱਚ ‘ੜ’ ਦੇ ਪੈਰ ਵਿੱਚ ‘ਹ’ (੍ਹ) ਲੱਗਦਾ ਹੈ। ਪੈਰ ਵਿੱਚ ਹਾਹਾ ਛੱਡਣਾ ਅਸ਼ੁੱਧ ਹੈ।",
  },
  {
    id: "SPL-008",
    correct: "ਚੜ੍ਹਨਾ",
    incorrectVariations: ["ਚੜਨਾ", "ਚੜ੍ਹਨਾਂ", "ਚੈੜਨਾ"],
    category: "HA_PAIRIN_SOUND",
    explanationPa: "ਸੁਰ (Tone) ਨੂੰ ਦਰਸਾਉਣ ਲਈ ‘ੜ’ ਦੇ ਪੈਰ ਵਿੱਚ ‘ਹ’ ਲੱਗਦਾ ਹੈ, ਇਸ ਲਈ ‘ਚੜ੍ਹਨਾ’ ਸ਼ੁੱਧ ਹੈ।",
  },
  {
    id: "SPL-009",
    correct: "ਕਹਿਣਾ",
    incorrectVariations: ["ਕੈਹਣਾ", "ਕਹਣਾ", "ਕਹਿਨਾ"],
    category: "HA_PAIRIN_SOUND",
    explanationPa: "‘ਹ’ ਦੀ ਪੂਰਵ-ਸਿਹਾਰੀ ਨੇਮ ਅਨੁਸਾਰ ‘ਕਹਿਣਾ’ ਸ਼ੁੱਧ ਰੂਪ ਹੈ।",
  },
  {
    id: "SPL-010",
    correct: "ਸਹਿਣਾ",
    incorrectVariations: ["ਸੈਹਣਾ", "ਸਹਣਾ", "ਸੇਹਣਾ"],
    category: "HA_PAIRIN_SOUND",
    explanationPa: "‘ਹ’ ਵਾਲੇ ਸ਼ਬਦਾਂ ਵਿੱਚ ਐ-ਕਾਰ ਉਚਾਰਨ ਲਈ ਸਿਹਾਰੀ ਵਰਤੀ ਜਾਂਦੀ ਹੈ, ਇਸ ਲਈ ‘ਸਹਿਣਾ’ ਸ਼ੁੱਧ ਹੈ।",
  },

  // 3. ਔਂਕੜ / ਦੁਲੈਂਕੜ ਭੁਲੇਖਾ
  {
    id: "SPL-011",
    correct: "ਸੂਰਜ",
    incorrectVariations: ["ਸੁਰਜ", "ਸੂਰਜ਼", "ਸੁੜਜ"],
    category: "AUNKAR_DULANKAR",
    explanationPa: "‘ਸੂਰਜ’ ਵਿੱਚ ‘ਸ’ ਨੂੰ ਦੁਲੈਂਕੜ (ੂ) ਲੱਗਦਾ ਹੈ, ਔਂਕੜ ਲਾਉਣਾ ਅਸ਼ੁੱਧ ਹੈ।",
  },
  {
    id: "SPL-012",
    correct: "ਸਕੂਲ",
    incorrectVariations: ["ਸਕੁਲ", "ਸਕੂਲ੍ਹ", "ਸ਼ਕੂਲ"],
    category: "AUNKAR_DULANKAR",
    explanationPa: "‘ਸਕੂਲ’ ਸ਼ਬਦ ਵਿੱਚ ‘ਕ’ ਨੂੰ ਦੁਲੈਂਕੜ (ੂ) ਲੱਗਦਾ ਹੈ।",
  },
  {
    id: "SPL-013",
    correct: "ਕਾਨੂੰਨ",
    incorrectVariations: ["ਕਾਨੂਨ", "ਕਾਨੂੰਨਿ", "ਕਾਨੁਨ"],
    category: "LOANWORD_PHONETICS",
    explanationPa: "ਅਰਬੀ-ਫ਼ਾਰਸੀ ਮੂਲ ਦੇ ਇਸ ਸ਼ਬਦ ਵਿੱਚ ‘ਕੰਨਾ’ ਅਤੇ ‘ਦੁਲੈਂਕੜ’ ਦੋਵੇਂ ਆਉਂਦੇ ਹਨ, ਇਸ ਲਈ ‘ਕਾਨੂੰਨ’ ਸ਼ੁੱਧ ਹੈ।",
  },
  {
    id: "SPL-014",
    correct: "ਜ਼ਰੂਰ",
    incorrectVariations: ["ਜਰੂਰ", "ਜ਼ਰੁਰ", "ਜ਼ਰੂੜ"],
    category: "LOANWORD_PHONETICS",
    explanationPa: "‘ਜ਼’ ਦੇ ਪੈਰ ਵਿੱਚ ਬਿੰਦੀ ਅਤੇ ‘ਰ’ ਨੂੰ ਦੁਲੈਂਕੜ ਲੱਗਦਾ ਹੈ, ਇਸ ਲਈ ‘ਜ਼ਰੂਰ’ ਸ਼ੁੱਧ ਹੈ।",
  },

  // 4. ਟਿੱਪੀ / ਬਿੰਦੀ ਅਤੇ ਅੱਧਕ
  {
    id: "SPL-015",
    correct: "ਬੁੱਧੀ",
    incorrectVariations: ["ਬੁਧੀ", "ਬੁੱਧਿ", "ਬੂਧੀ"],
    category: "ADDAK_OMISSION",
    explanationPa: "ਦਬਾਅ ਵਾਲੀ ਆਵਾਜ਼ ਪ੍ਰਗਟਾਉਣ ਲਈ ‘ਬ’ ਉੱਤੇ ਅੱਧਕ ਅਤੇ ‘ਧ’ ਨੂੰ ਬਿਹਾਰੀ ਲੱਗਦੀ ਹੈ (ਬੁੱਧੀ)।",
  },
  {
    id: "SPL-016",
    correct: "ਹੱਥ",
    incorrectVariations: ["ਹਥ", "ਹਥ਼", "ਹਾਥ"],
    category: "ADDAK_OMISSION",
    explanationPa: "ਮੁਕਤਾ ਧੁਨੀ 'ਤੇ ਬਲ ਦੇਣ ਲਈ ‘ਹ’ ਉੱਤੇ ਅੱਧਕ ਲੱਗਦਾ ਹੈ, ਇਸ ਲਈ ‘ਹੱਥ’ ਸ਼ੁੱਧ ਰੂਪ ਹੈ।",
  },
  {
    id: "SPL-017",
    correct: "ਕੰਘੀ",
    incorrectVariations: ["ਕਂਘੀ", "ਕੰਘਿ", "ਕਘੀ"],
    category: "TIPPI_BINDI",
    explanationPa: "ਮੁਕਤਾ ਅੱਖਰ ‘ਕ’ ਨਾਲ ਨਾਸਕੀ ਆਵਾਜ਼ ਲਈ ਟਿੱਪੀ (ੰ) ਲੱਗਦੀ ਹੈ, ਬਿੰਦੀ ਨਹੀਂ।",
  },
  {
    id: "SPL-018",
    correct: "ਗਾਂ",
    incorrectVariations: ["ਗੰ", "ਗਾ", "ਗਾਂਈ"],
    category: "TIPPI_BINDI",
    explanationPa: "ਕੰਨਾ (ਾ) ਲਗ ਨਾਲ ਨਾਸਕੀ ਆਵਾਜ਼ ਲਈ ਹਮੇਸ਼ਾ ਬਿੰਦੀ (ਂ) ਲੱਗਦੀ ਹੈ, ਇਸ ਲਈ ‘ਗਾਂ’ ਸ਼ੁੱਧ ਹੈ।",
  },
  {
    id: "SPL-019",
    correct: "ਕੁਰਸੀ",
    incorrectVariations: ["ਕੁਰਸਿ", "ਕੁਰਸੀਂ", "ਕੂਰਸੀ"],
    category: "SIHARI_BIHARI",
    explanationPa: "ਅੰਤਿਮ ਸਵਰ ਬਿਹਾਰੀ ਹੁੰਦਾ ਹੈ ਅਤੇ ‘ਕ’ ਨੂੰ ਔਂਕੜ ਲੱਗਦਾ ਹੈ, ਇਸ ਲਈ ‘ਕੁਰਸੀ’ ਸ਼ੁੱਧ ਹੈ।",
  },
  {
    id: "SPL-020",
    correct: "ਸੁੰਦਰ",
    incorrectVariations: ["ਸੂੰਦਰ", "ਸੁਂਦਰ", "ਸੰਦਰ"],
    category: "TIPPI_BINDI",
    explanationPa: "ਔਂਕੜ (ੁ) ਨਾਲ ਨਾਸਕੀ ਆਵਾਜ਼ ਲਈ ਟਿੱਪੀ (ੰ) ਲੱਗਦੀ ਹੈ (ਸੁੰਦਰ)।",
  },
  {
    id: "SPL-021",
    correct: "ਵਿਹੜਾ",
    incorrectVariations: ["ਵੇਹੜਾ", "ਵੈਹੜਾ", "ਵਿਹੜ੍ਹਾ"],
    category: "HA_PAIRIN_SOUND",
    explanationPa: "‘ਹ’ ਤੋਂ ਪਹਿਲੇ ਅੱਖਰ ਦੀ ਐ-ਕਾਰ ਧੁਨੀ ਲਈ ਸਿਹਾਰੀ ਵਰਤੀ ਜਾਂਦੀ ਹੈ (ਵਿਹੜਾ)।",
  },
  {
    id: "SPL-022",
    correct: "ਦੁਪਹਿਰ",
    incorrectVariations: ["ਦੁਪੈਹਰ", "ਦੁਪਹਰ", "ਦੂਪਹਿਰ"],
    category: "HA_PAIRIN_SOUND",
    explanationPa: "‘ਹ’ ਨਾਲ ਸਿਹਾਰੀ ਲੱਗਣ ਕਾਰਨ ‘ਦੁਪਹਿਰ’ ਸ਼ੁੱਧ ਹੈ।",
  },
  {
    id: "SPL-023",
    correct: "ਤਿਉਹਾਰ",
    incorrectVariations: ["ਤਿਓਹਾਰ", "ਤਿਵਹਾਰ", "ਤਿਉਹਾੜ"],
    category: "LOANWORD_PHONETICS",
    explanationPa: "‘ਤਿਉਹਾਰ’ ਸ਼ੁੱਧ ਟਕਸਾਲੀ ਸ਼ਬਦ-ਜੋੜ ਹੈ।",
  },
  {
    id: "SPL-024",
    correct: "ਇਸ਼ਨਾਨ",
    incorrectVariations: ["ਇਸਨਾਨ", "ਅਸ਼ਨਾਨ", "ਸਨਾਨ"],
    category: "LOANWORD_PHONETICS",
    explanationPa: "ਟਕਸਾਲੀ ਪੰਜਾਬੀ ਵਿੱਚ ‘ਇਸ਼ਨਾਨ’ ਸ਼ੁੱਧ ਮੰਨਿਆ ਜਾਂਦਾ ਹੈ।",
  },
  {
    id: "SPL-025",
    correct: "ਸੰਸਾਰ",
    incorrectVariations: ["ਸਂਸਾਰ", "ਸਨਸਾਰ", "ਸਸਾਰ"],
    category: "TIPPI_BINDI",
    explanationPa: "ਮੁਕਤਾ ਨਾਲ ਟਿੱਪੀ ਲੱਗਦੀ ਹੈ, ਇਸ ਲਈ ‘ਸੰਸਾਰ’ ਸ਼ੁੱਧ ਹੈ।",
  },
  {
    id: "SPL-026",
    correct: "ਪ੍ਰੀਖਿਆ",
    incorrectVariations: ["ਪਰੀਖਿਆ", "ਪ੍ਰੀਖ੍ਯਾ", "ਪਰਿਖਿਆ"],
    category: "SIHARI_BIHARI",
    explanationPa: "‘ਪ੍ਰੀਖਿਆ’ ਵਿੱਚ ‘ਪ’ ਦੇ ਪੈਰ ਵਿੱਚ ਰਾਰਾ ਅਤੇ ਬਿਹਾਰੀ ਲੱਗਦੀ ਹੈ।",
  },
  {
    id: "SPL-027",
    correct: "ਵਿਦਿਆਰਥੀ",
    incorrectVariations: ["ਵਿਦਿਆਰਥਿ", "ਵਿਦਿਆਰਥ੍ਹੀ", "ਵਿਦਯਾਰਥੀ"],
    category: "SIHARI_BIHARI",
    explanationPa: "ਅੰਤਿਮ ਲਗ ਬਿਹਾਰੀ ਹੁੰਦੀ ਹੈ (ਵਿਦਿਆਰਥੀ)।",
  },
  {
    id: "SPL-028",
    correct: "ਮਹੱਤਵ",
    incorrectVariations: ["ਮਹਤਵ", "ਮਹਾਤਮ", "ਮਹੱਤਤਵ"],
    category: "ADDAK_OMISSION",
    explanationPa: "‘ਤ’ 'ਤੇ ਬਲ ਹੋਣ ਕਰਕੇ ‘ਹ’ ਉੱਤੇ ਅੱਧਕ ਲੱਗਦਾ ਹੈ (ਮਹੱਤਵ)।",
  },
  {
    id: "SPL-029",
    correct: "ਪ੍ਰਸਿੱਧ",
    incorrectVariations: ["ਪ੍ਰਸਿਧ", "ਪ੍ਰਸੀਧ", "ਪਰਸਿੱਧ"],
    category: "ADDAK_OMISSION",
    explanationPa: "ਸਿਹਾਰੀ ਨਾਲ ਬਲ ਦਰਸਾਉਣ ਲਈ ‘ਸ’ ਉੱਤੇ ਅੱਧਕ ਆਉਂਦਾ ਹੈ (ਪ੍ਰਸਿੱਧ)।",
  },
  {
    id: "SPL-030",
    correct: "ਸੰਵਿਧਾਨ",
    incorrectVariations: ["ਸਂਵਿਧਾਨ", "ਸਨਵਿਧਾਨ", "ਸਵਿਧਾਨ"],
    category: "TIPPI_BINDI",
    explanationPa: "ਟਿੱਪੀ ਨਾਸਕੀ ਆਵਾਜ਼ ਲਈ ਵਰਤੀ ਜਾਂਦੀ ਹੈ (ਸੰਵਿਧਾਨ)।",
  },
  {
    id: "SPL-031",
    correct: "ਵਿਸ਼ਵਾਸ",
    incorrectVariations: ["ਵਿਸਵਾਸ", "ਵਿਸ਼ਵਾਸ਼", "ਵਿਸ਼੍ਵਾਸ"],
    category: "LOANWORD_PHONETICS",
    explanationPa: "ਪਹਿਲਾ ਅੱਖਰ ਸ਼ ਅਤੇ ਦੂਜਾ ਸ ਹੁੰਦਾ ਹੈ (ਵਿਸ਼ਵਾਸ)।",
  },
  {
    id: "SPL-032",
    correct: "ਜਿਊਣਾ",
    incorrectVariations: ["ਜੀਊਣਾ", "ਜੀਵਣਾ", "ਜਿਓਣਾ"],
    category: "SIHARI_BIHARI",
    explanationPa: "‘ਜ’ ਨੂੰ ਸਿਹਾਰੀ ਲੱਗਦੀ ਹੈ (ਜਿਊਣਾ)।",
  },
  {
    id: "SPL-033",
    correct: "ਵਿਹੜਾ",
    incorrectVariations: ["ਵੇਹੜਾ", "ਵੈਹੜਾ", "ਵੀਹੜਾ"],
    category: "HA_PAIRIN_SOUND",
    explanationPa: "‘ਹ’ ਤੋਂ ਪਹਿਲਾਂ ਐ-ਕਾਰ ਧੁਨੀ ਲਈ ‘ਵ’ ਨੂੰ ਸਿਹਾਰੀ (ਵਿਹੜਾ) ਲੱਗਦੀ ਹੈ।",
  },
  {
    id: "SPL-034",
    correct: "ਬਹਿਣਾ",
    incorrectVariations: ["ਬੈਹਣਾ", "ਬਹਣਾ", "ਬੇਹਣਾ"],
    category: "HA_PAIRIN_SOUND",
    explanationPa: "ਪੰਜਾਬੀ ਸ਼ਬਦ-ਜੋੜਾਂ ਅਨੁਸਾਰ ‘ਹ’ ਤੋਂ ਪਹਿਲੇ ਅੱਖਰ ਨੂੰ ਸਿਹਾਰੀ ਲੱਗਦੀ ਹੈ (ਬਹਿਣਾ)।",
  },
  {
    id: "SPL-035",
    correct: "ਲਹਿਰ",
    incorrectVariations: ["ਲੈਹਰ", "ਲਹਰ", "ਲੇਹਰ"],
    category: "HA_PAIRIN_SOUND",
    explanationPa: "‘ਲ’ ਨੂੰ ਸਿਹਾਰੀ ਲੱਗਦੀ ਹੈ (ਲਹਿਰ)।",
  },
  {
    id: "SPL-036",
    correct: "ਕਹਿਰ",
    incorrectVariations: ["ਕੈਹਰ", "ਕਹਰ", "ਕੇਹਰ"],
    category: "HA_PAIRIN_SOUND",
    explanationPa: "ਟਕਸਾਲੀ ਨੇਮਾਂ ਅਨੁਸਾਰ ‘ਕਹਿਰ’ ਸ਼ੁੱਧ ਹੈ।",
  },
  {
    id: "SPL-037",
    correct: "ਜ਼ਹਿਰ",
    incorrectVariations: ["ਜ਼ੈਹਰ", "ਜ਼ਹਰ", "ਜਹਿਰ"],
    category: "HA_PAIRIN_SOUND",
    explanationPa: "‘ਜ਼ਹਿਰ’ ਸ਼ੁੱਧ ਟਕਸਾਲੀ ਰੂਪ ਹੈ।",
  },
  {
    id: "SPL-038",
    correct: "ਮਹਿਕ",
    incorrectVariations: ["ਮੈਹਕ", "ਮਹਕ", "ਮੇਹਕ"],
    category: "HA_PAIRIN_SOUND",
    explanationPa: "‘ਮ’ ਨੂੰ ਸਿਹਾਰੀ ਲੱਗਦੀ ਹੈ (ਮਹਿਕ)।",
  },
  {
    id: "SPL-039",
    correct: "ਸੂਰਤ",
    incorrectVariations: ["ਸੁਰਤ", "ਸੂਰਿਤ", "ਸੂੜਤ"],
    category: "AUNKAR_DULANKAR",
    explanationPa: "ਦੀਰਘ ਊ-ਕਾਰ ਧੁਨੀ ਲਈ ਦੁਲੈਂਕੜ ਲੱਗਦਾ ਹੈ (ਸੂਰਤ)।",
  },
  {
    id: "SPL-040",
    correct: "ਮੂਰਤ",
    incorrectVariations: ["ਮੁਰਤ", "ਮੂਰਿਤ", "ਮੂੜਤ"],
    category: "AUNKAR_DULANKAR",
    explanationPa: "‘ਮ’ ਨੂੰ ਦੁਲੈਂਕੜ ਲੱਗਦਾ ਹੈ (ਮੂਰਤ)।",
  },
  {
    id: "SPL-041",
    correct: "ਜ਼ਰੂਰਤ",
    incorrectVariations: ["ਜ਼ਰੁਰਤ", "ਜਰੂਰਤ", "ਜ਼ਰੂੜਤ"],
    category: "AUNKAR_DULANKAR",
    explanationPa: "‘ਰ’ ਨੂੰ ਦੁਲੈਂਕੜ ਅਤੇ ‘ਜ਼’ ਪੈਰ-ਬਿੰਦੀ ਲੱਗਦੀ ਹੈ (ਜ਼ਰੂਰਤ)।",
  },
  {
    id: "SPL-042",
    correct: "ਕਾਨੂੰਨੀ",
    incorrectVariations: ["ਕਾਨੂਨੀ", "ਕਾਨੁਨੀ", "ਕਾਨੂਨਿ"],
    category: "AUNKAR_DULANKAR",
    explanationPa: "‘ਨ’ ਨੂੰ ਦੁਲੈਂਕੜ ਅਤੇ ਅੰਤ ਵਿੱਚ ਬਿਹਾਰੀ ਲੱਗਦੀ ਹੈ (ਕਾਨੂੰਨੀ)।",
  },
  {
    id: "SPL-043",
    correct: "ਬੁੱਧੀਮਾਨ",
    incorrectVariations: ["ਬੁਧੀਮਾਨ", "ਬੁਧਿਮਾਨ", "ਬੁੱਧਿਮਾਨ"],
    category: "SIHARI_BIHARI",
    explanationPa: "ਪੰਜਾਬੀ ਵਿੱਚ ਅੰਤਲੇ ਹਿੱਸੇ ਤੋਂ ਪਹਿਲਾਂ ਦੀਰਘ ਬਿਹਾਰੀ ਲੱਗਦੀ ਹੈ (ਬੁੱਧੀਮਾਨ)।",
  },
  {
    id: "SPL-044",
    correct: "ਸ਼੍ਰੇਣੀ",
    incorrectVariations: ["ਸ੍ਰੇਣੀ", "ਸ਼੍ਰੇਨੀ", "ਸ੍ਰੈਣੀ"],
    category: "LOANWORD_PHONETICS",
    explanationPa: "‘ਸ਼’ ਦੇ ਪੈਰ ਵਿੱਚ ਰਾਰਾ ਅਤੇ ਲਾਂ ਲੱਗਦੀ ਹੈ (ਸ਼੍ਰੇਣੀ)।",
  },
  {
    id: "SPL-045",
    correct: "ਦ੍ਰਿਸ਼ਟੀਕੋਣ",
    incorrectVariations: ["ਦ੍ਰਿਸਟੀਕੋਣ", "ਦਰਿਸ਼ਟੀਕੋਣ", "ਦ੍ਰਿਸ਼ਟਿਕੋਣ"],
    category: "LOANWORD_PHONETICS",
    explanationPa: "‘ਦ੍ਰਿਸ਼ਟੀਕੋਣ’ ਵਿੱਚ ‘ਟ’ ਨੂੰ ਬਿਹਾਰੀ ਸ਼ੁੱਧ ਰੂਪ ਹੈ।",
  },
  {
    id: "SPL-046",
    correct: "ਸੰਪਤੀ",
    incorrectVariations: ["ਸੰਪਤੀਂ", "ਸਮਪਤੀ", "ਸਂਪਤੀ"],
    category: "TIPPI_BINDI",
    explanationPa: "ਮੁਕਤਾ ਨਾਲ ਨਾਸਕੀ ਧੁਨੀ ਲਈ ਟਿੱਪੀ ਲੱਗਦੀ ਹੈ (ਸੰਪਤੀ)।",
  },
  {
    id: "SPL-047",
    correct: "ਪ੍ਰਬੰਧਕ",
    incorrectVariations: ["ਪਰਬੰਧਕ", "ਪ੍ਰਬਂਧਕ", "ਪ੍ਰਬਨਧਕ"],
    category: "TIPPI_BINDI",
    explanationPa: "‘ਬ’ ਉੱਤੇ ਟਿੱਪੀ ਲੱਗਦੀ ਹੈ (ਪ੍ਰਬੰਧਕ)।",
  },
  {
    id: "SPL-048",
    correct: "ਸਬੰਧਤ",
    incorrectVariations: ["ਸਬੰਧਿਤ", "ਸਮਬੰਧਤ", "ਸਬਂਧਤ"],
    category: "SIHARI_BIHARI",
    explanationPa: "ਪੰਜਾਬੀ ਵਿੱਚ ਤਦਭਵ ਨੇਮ ਅਨੁਸਾਰ ‘ਸਬੰਧਤ’ ਸ਼ੁੱਧ ਮੰਨਿਆ ਜਾਂਦਾ ਹੈ।",
  },
  {
    id: "SPL-049",
    correct: "ਸਿੱਖਿਆ",
    incorrectVariations: ["ਸਿਖਿਆ", "ਸੀਖਿਆ", "ਸਿਖ੍ਯਾ"],
    category: "ADDAK_OMISSION",
    explanationPa: "ਦੁਹਰਾਅ ਅਤੇ ਬਲ ਲਈ ‘ਸ’ ਉੱਤੇ ਅੱਧਕ ਲੱਗਦਾ ਹੈ (ਸਿੱਖਿਆ)।",
  },
  {
    id: "SPL-050",
    correct: "ਮਨੁੱਖ",
    incorrectVariations: ["ਮਨੁਖ", "ਮਨੂੱਖ", "ਮਾਨੁਖ"],
    category: "ADDAK_OMISSION",
    explanationPa: "‘ਨ’ ਦੇ ਔਂਕੜ ਉੱਤੇ ਅੱਧਕ ਲੱਗਦਾ ਹੈ (ਮਨੁੱਖ)।",
  },
  {
    id: "SPL-051",
    correct: "ਗਿਆਨ",
    incorrectVariations: ["ਗ੍ਯਾਨ", "ਗਿਆਣ", "ਗਿਆਨੁ"],
    category: "LOANWORD_PHONETICS",
    explanationPa: "ਟਕਸਾਲੀ ਪੰਜਾਬੀ ਵਿੱਚ ‘ਗਿਆਨ’ ਸ਼ੁੱਧ ਰੂਪ ਹੈ।",
  },
  {
    id: "SPL-052",
    correct: "ਸਰਵਉੱਚ",
    incorrectVariations: ["ਸਰਵਉਚ", "ਸਰਬਉੱਚ", "ਸਰਵੋਚ"],
    category: "ADDAK_OMISSION",
    explanationPa: "‘ੳ’ ਦੇ ਔਂਕੜ ਉੱਤੇ ਅੱਧਕ ਲੱਗਦਾ ਹੈ (ਸਰਵਉੱਚ)।",
  },
  {
    id: "SPL-053",
    correct: "ਵਿਗਿਆਨ",
    incorrectVariations: ["ਵਿਗ੍ਯਾਨ", "ਵਿਗਿਆਣ", "ਬਿਗਿਆਨ"],
    category: "LOANWORD_PHONETICS",
    explanationPa: "‘ਵ’ ਨੂੰ ਸਿਹਾਰੀ ਲੱਗਦੀ ਹੈ (ਵਿਗਿਆਨ)।",
  },
  {
    id: "SPL-054",
    correct: "ਸ਼ਰਧਾਂਜਲੀ",
    incorrectVariations: ["ਸਰਧਾਂਜਲੀ", "ਸ਼ਰਧਾਂਜਲਿ", "ਸ਼੍ਰਧਾਂਜਲੀ"],
    category: "SIHARI_BIHARI",
    explanationPa: "ਅੰਤਿਮ ਅੱਖਰ ਨੂੰ ਬਿਹਾਰੀ ਲੱਗਦੀ ਹੈ (ਸ਼ਰਧਾਂਜਲੀ)।",
  },
  {
    id: "SPL-055",
    correct: "ਪ੍ਰਾਪਤੀ",
    incorrectVariations: ["ਪਰਾਪਤੀ", "ਪ੍ਰਾਪਤਿ", "ਪ੍ਰਾਪਤੀਂ"],
    category: "SIHARI_BIHARI",
    explanationPa: "ਪੰਜਾਬੀ ਵਿੱਚ ਅੰਤਲਾ ਸਵਰ ਦੀਰਘ ਬਿਹਾਰੀ ਹੁੰਦਾ ਹੈ (ਪ੍ਰਾਪਤੀ)।",
  },
  {
    id: "SPL-056",
    correct: "ਸੂਚਨਾ",
    incorrectVariations: ["ਸੁਚਨਾ", "ਸੂਚਨਾਂ", "ਸੂਚਣਾ"],
    category: "AUNKAR_DULANKAR",
    explanationPa: "‘ਸ’ ਨੂੰ ਦੁਲੈਂਕੜ ਲੱਗਦਾ ਹੈ (ਸੂਚਨਾ)।",
  },
  {
    id: "SPL-057",
    correct: "ਦੂਰਦਰਸ਼ਨ",
    incorrectVariations: ["ਦੁਰਦਰਸ਼ਨ", "ਦੂਰਦਰਸਨ", "ਦੂਰਦਰਸ਼ਣ"],
    category: "AUNKAR_DULANKAR",
    explanationPa: "‘ਦ’ ਨੂੰ ਦੁਲੈਂਕੜ ਲੱਗਦਾ ਹੈ (ਦੂਰਦਰਸ਼ਨ)।",
  },
  {
    id: "SPL-058",
    correct: "ਗੰਭੀਰ",
    incorrectVariations: ["ਗਂਭੀਰ", "ਗਮਭੀਰ", "ਗੰਭਿਰ"],
    category: "TIPPI_BINDI",
    explanationPa: "‘ਭ’ ਨੂੰ ਬਿਹਾਰੀ ਅਤੇ ‘ਗ’ ਉੱਤੇ ਟਿੱਪੀ ਲੱਗਦੀ ਹੈ (ਗੰਭੀਰ)।",
  },
  {
    id: "SPL-059",
    correct: "ਨਿਰੰਤਰ",
    incorrectVariations: ["ਨਿਰਂਤਰ", "ਨਿਰਨਤਰ", "ਨੀਰੰਤਰ"],
    category: "TIPPI_BINDI",
    explanationPa: "‘ਰ’ ਉੱਤੇ ਟਿੱਪੀ ਲੱਗਦੀ ਹੈ (ਨਿਰੰਤਰ)।",
  },
  {
    id: "SPL-060",
    correct: "ਸੰਘਰਸ਼",
    incorrectVariations: ["ਸਂਘਰਸ਼", "ਸੰਘਰਸ", "ਸੰਗਰਸ਼"],
    category: "TIPPI_BINDI",
    explanationPa: "‘ਸ’ ਉੱਤੇ ਟਿੱਪੀ ਅਤੇ ‘ਘ’ ਆਉਂਦਾ ਹੈ (ਸੰਘਰਸ਼)।",
  },
  {
    id: "SPL-061",
    correct: "ਉੱਦਮ",
    incorrectVariations: ["ਉਦਮ", "ਊਦਮ", "ਉਦੱਮ"],
    category: "ADDAK_OMISSION",
    explanationPa: "‘ੳ’ ਉੱਤੇ ਅੱਧਕ ਲੱਗਦਾ ਹੈ (ਉੱਦਮ)।",
  },
  {
    id: "SPL-062",
    correct: "ਸੁਤੰਤਰਤਾ",
    incorrectVariations: ["ਸਵਤੰਤਰਤਾ", "ਸੁਤਂਤਰਤਾ", "ਸੁਤੰਤ੍ਰਤਾ"],
    category: "LOANWORD_PHONETICS",
    explanationPa: "ਪੰਜਾਬੀ ਤਦਭਵ ਸ਼ਬਦ-ਜੋੜ ‘ਸੁਤੰਤਰਤਾ’ ਹੈ।",
  },
  {
    id: "SPL-063",
    correct: "ਵਿਸ਼ੇਸ਼ਤਾ",
    incorrectVariations: ["ਵਿਸੇਸਤਾ", "ਵਿਸ਼ੇਸ਼ਤਾਂ", "ਬਿਸ਼ੇਸ਼ਤਾ"],
    category: "LOANWORD_PHONETICS",
    explanationPa: "ਦੋਵੇਂ ‘ਸ਼’ ਪੈਰ-ਬਿੰਦੀ ਵਾਲੇ ਹੁੰਦੇ ਹਨ (ਵਿਸ਼ੇਸ਼ਤਾ)।",
  },
  {
    id: "SPL-064",
    correct: "ਸੱਭਿਆਚਾਰ",
    incorrectVariations: ["ਸਭਿਆਚਾਰ", "ਸੱਭਯਾਚਾਰ", "ਸਭਯਾਚਾਰ"],
    category: "ADDAK_OMISSION",
    explanationPa: "‘ਸ’ ਉੱਤੇ ਅੱਧਕ ਲੱਗਦਾ ਹੈ (ਸੱਭਿਆਚਾਰ)।",
  },
  {
    id: "SPL-065",
    correct: "ਇਤਿਹਾਸ",
    incorrectVariations: ["ਇਤਹਾਸ", "ਇਤੀਹਾਸ", "ਅਤਿਹਾਸ"],
    category: "SIHARI_BIHARI",
    explanationPa: "‘ਤ’ ਨੂੰ ਸਿਹਾਰੀ ਲੱਗਦੀ ਹੈ (ਇਤਿਹਾਸ)।",
  },
  {
    id: "SPL-066",
    correct: "ਮਿਹਨਤ",
    incorrectVariations: ["ਮਹਿਨਤ", "ਮੇਹਨਤ", "ਮਿਹਿਨਤ"],
    category: "HA_PAIRIN_SOUND",
    explanationPa: "‘ਹ’ ਤੋਂ ਪਹਿਲੇ ਅੱਖਰ ਉੱਤੇ ਸਿਹਾਰੀ ਲੱਗਦੀ ਹੈ, ਇਸ ਲਈ ‘ਮਿਹਨਤ’ ਸ਼ੁੱਧ ਹੈ।",
  },
  {
    id: "SPL-067",
    correct: "ਕਹਿਣਾ",
    incorrectVariations: ["ਕਹਣਾ", "ਕੈਹਣਾ", "ਕਹਨਾ"],
    category: "HA_PAIRIN_SOUND",
    explanationPa: "ਟਕਸਾਲੀ ਨੇਮਾਂ ਅਨੁਸਾਰ ‘ਕਹਿਣਾ’ ਸ਼ੁੱਧ ਸ਼ਬਦ-ਜੋੜ ਹੈ।",
  },
  {
    id: "SPL-068",
    correct: "ਬਹਿਣਾ",
    incorrectVariations: ["ਬਹਣਾ", "ਬੈਹਣਾ", "ਬਹਿਨਾ"],
    category: "HA_PAIRIN_SOUND",
    explanationPa: "ਟਕਸਾਲੀ ਨੇਮਾਂ ਅਨੁਸਾਰ ‘ਬਹਿਣਾ’ ਸ਼ੁੱਧ ਸ਼ਬਦ-ਜੋੜ ਹੈ।",
  },
  {
    id: "SPL-069",
    correct: "ਸਹਿਣਾ",
    incorrectVariations: ["ਸਹਣਾ", "ਸੈਹਣਾ", "ਸਹਿਨਾ"],
    category: "HA_PAIRIN_SOUND",
    explanationPa: "ਟਕਸਾਲੀ ਨੇਮਾਂ ਅਨੁਸਾਰ ‘ਸਹਿਣਾ’ ਸ਼ੁੱਧ ਸ਼ਬਦ-ਜੋੜ ਹੈ।",
  },
  {
    id: "SPL-070",
    correct: "ਰਹਿਣਾ",
    incorrectVariations: ["ਰਹਣਾ", "ਰੈਹਣਾ", "ਰਹਿਨਾ"],
    category: "HA_PAIRIN_SOUND",
    explanationPa: "ਟਕਸਾਲੀ ਨੇਮਾਂ ਅਨੁਸਾਰ ‘ਰਹਿਣਾ’ ਸ਼ੁੱਧ ਸ਼ਬਦ-ਜੋੜ ਹੈ।",
  },
  {
    id: "SPL-071",
    correct: "ਗਹਿਣਾ",
    incorrectVariations: ["ਗਹਣਾ", "ਗੈਹਣਾ", "ਗਹਿਨਾ"],
    category: "HA_PAIRIN_SOUND",
    explanationPa: "ਟਕਸਾਲੀ ਨੇਮਾਂ ਅਨੁਸਾਰ ‘ਗਹਿਣਾ’ ਸ਼ੁੱਧ ਸ਼ਬਦ-ਜੋੜ ਹੈ।",
  },
  {
    id: "SPL-072",
    correct: "ਲਹਿਰ",
    incorrectVariations: ["ਲੈਹਰ", "ਲਹਰ", "ਲਹਿੜ"],
    category: "HA_PAIRIN_SOUND",
    explanationPa: "ਟਕਸਾਲੀ ਨੇਮਾਂ ਅਨੁਸਾਰ ‘ਲਹਿਰ’ ਸ਼ੁੱਧ ਸ਼ਬਦ-ਜੋੜ ਹੈ।",
  },
  {
    id: "SPL-073",
    correct: "ਜ਼ਹਿਰ",
    incorrectVariations: ["ਜ਼ੈਹਰ", "ਜਹਿਰ", "ਜ਼ਹਰ"],
    category: "LOANWORD_PHONETICS",
    explanationPa: "ਫ਼ਾਰਸੀ ਧੁਨੀ ‘ਜ਼’ ਅਤੇ ਸਿਹਾਰੀ ਵਾਲਾ ‘ਜ਼ਹਿਰ’ ਸ਼ੁੱਧ ਹੈ।",
  },
  {
    id: "SPL-074",
    correct: "ਪਹਿਰਾਵਾ",
    incorrectVariations: ["ਪੈਹਰਾਵਾ", "ਪਹਰਾਵਾ", "ਪਹਿੜਾਵਾ"],
    category: "HA_PAIRIN_SOUND",
    explanationPa: "‘ਪਹਿਰਾਵਾ’ ਸ਼ੁੱਧ ਟਕਸਾਲੀ ਰੂਪ ਹੈ।",
  },
  {
    id: "SPL-075",
    correct: "ਸੁਨਹਿਰੀ",
    incorrectVariations: ["ਸੁਨੈਹਰੀ", "ਸੁਨਹਰੀ", "ਸੁਨਿਹਰੀ"],
    category: "HA_PAIRIN_SOUND",
    explanationPa: "‘ਸੁਨਹਿਰੀ’ ਸ਼ੁੱਧ ਟਕਸਾਲੀ ਰੂਪ ਹੈ।",
  },
  {
    id: "SPL-076",
    correct: "ਵਹੁਟੀ",
    incorrectVariations: ["ਬਹੁਟੀ", "ਬੋਹਟੀ", "ਵੋਹਟੀ"],
    category: "HA_PAIRIN_SOUND",
    explanationPa: "‘ਵਹੁਟੀ’ ਸ਼ੁੱਧ ਪੰਜਾਬੀ ਸ਼ਬਦ-ਜੋੜ ਹੈ।",
  },
  {
    id: "SPL-077",
    correct: "ਸਹੁਰਾ",
    incorrectVariations: ["ਸੌਹਰਾ", "ਸੋਹਰਾ", "ਸਉਹਰਾ"],
    category: "HA_PAIRIN_SOUND",
    explanationPa: "‘ਸਹੁਰਾ’ ਸ਼ੁੱਧ ਟਕਸਾਲੀ ਰੂਪ ਹੈ।",
  },
  {
    id: "SPL-078",
    correct: "ਪਹੁੰਚਣਾ",
    incorrectVariations: ["ਪਹੁਚਣਾ", "ਪੌਹਚਣਾ", "ਪੋਹਚਣਾ"],
    category: "TIPPI_BINDI",
    explanationPa: "‘ਹ’ ਉੱਤੇ ਔਂਕੜ ਅਤੇ ਟਿੱਪੀ ਲੱਗਦੀ ਹੈ (ਪਹੁੰਚਣਾ)।",
  },
  {
    id: "SPL-079",
    correct: "ਗੰਢ",
    incorrectVariations: ["ਗਂਢ", "ਗੰਡ", "ਗੰਧ"],
    category: "TIPPI_BINDI",
    explanationPa: "‘ਗ’ ਉੱਤੇ ਟਿੱਪੀ ਅਤੇ ‘ਢ’ ਲੱਗਦਾ ਹੈ (ਗੰਢ)।",
  },
  {
    id: "SPL-080",
    correct: "ਕੰਧ",
    incorrectVariations: ["ਕਂਧ", "ਕੰਦ", "ਕਨਧ"],
    category: "TIPPI_BINDI",
    explanationPa: "‘ਕ’ ਉੱਤੇ ਟਿੱਪੀ ਅਤੇ ‘ਧ’ ਲੱਗਦਾ ਹੈ (ਕੰਧ)।",
  },
  {
    id: "SPL-081",
    correct: "ਝੰਡਾ",
    incorrectVariations: ["ਝਂਡਾ", "ਝਨਡਾ", "ਝੰਦਾ"],
    category: "TIPPI_BINDI",
    explanationPa: "‘ਝ’ ਉੱਤੇ ਟਿੱਪੀ ਅਤੇ ‘ਡ’ ਲੱਗਦਾ ਹੈ (ਝੰਡਾ)।",
  },
  {
    id: "SPL-082",
    correct: "ਸੰਦੂਕ",
    incorrectVariations: ["ਸਂਦੂਕ", "ਸੰਦੁਕ", "ਸਨਦੂਕ"],
    category: "AUNKAR_DULANKAR",
    explanationPa: "‘ਦ’ ਨੂੰ ਦੁਲੈਂਕੜ ਲੱਗਦਾ ਹੈ (ਸੰਦੂਕ)।",
  },
  {
    id: "SPL-083",
    correct: "ਬੰਦੂਕ",
    incorrectVariations: ["ਬਂਦੂਕ", "ਬੰਦੁਕ", "ਬਨਦੂਕ"],
    category: "AUNKAR_DULANKAR",
    explanationPa: "‘ਦ’ ਨੂੰ ਦੁਲੈਂਕੜ ਲੱਗਦਾ ਹੈ (ਬੰਦੂਕ)।",
  },
  {
    id: "SPL-084",
    correct: "ਮੂਰਖ",
    incorrectVariations: ["ਮੁਰਖ", "ਮੂਰਖ਼", "ਮੂੜਖ"],
    category: "AUNKAR_DULANKAR",
    explanationPa: "‘ਮ’ ਨੂੰ ਦੁਲੈਂਕੜ ਲੱਗਦਾ ਹੈ (ਮੂਰਖ)।",
  },
  {
    id: "SPL-085",
    correct: "ਦੂਰ",
    incorrectVariations: ["ਦੁਰ", "ਦੂੜ", "ਦੂਰਿ"],
    category: "AUNKAR_DULANKAR",
    explanationPa: "‘ਦ’ ਨੂੰ ਦੁਲੈਂਕੜ ਲੱਗਦਾ ਹੈ (ਦੂਰ)।",
  },
  {
    id: "SPL-086",
    correct: "ਚੂਹਾ",
    incorrectVariations: ["ਚੁਹਾ", "ਚੂਹਾਂ", "ਚੁਹਾਂ"],
    category: "AUNKAR_DULANKAR",
    explanationPa: "‘ਚ’ ਨੂੰ ਦੁਲੈਂਕੜ ਲੱਗਦਾ ਹੈ (ਚੂਹਾ)।",
  },
  {
    id: "SPL-087",
    correct: "ਸੂਰਮਾ",
    incorrectVariations: ["ਸੁਰਮਾ", "ਸੂਰਮਾਂ", "ਸੂੜਮਾ"],
    category: "AUNKAR_DULANKAR",
    explanationPa: "‘ਸ’ ਨੂੰ ਦੁਲੈਂਕੜ ਲੱਗਦਾ ਹੈ (ਸੂਰਮਾ)।",
  },
  {
    id: "SPL-088",
    correct: "ਬੁੱਧੀਮਾਨ",
    incorrectVariations: ["ਬੁਧੀਮਾਨ", "ਬੁੱਧਿਮਾਨ", "ਬੁਧਿਮਾਨ"],
    category: "ADDAK_OMISSION",
    explanationPa: "‘ਬ’ ਉੱਤੇ ਅੱਧਕ ਲੱਗਦਾ ਹੈ (ਬੁੱਧੀਮਾਨ)।",
  },
  {
    id: "SPL-089",
    correct: "ਮਿੱਤਰਤਾ",
    incorrectVariations: ["ਮਿਤਰਤਾ", "ਮੀਤਰਤਾ", "ਮਿੱਤ੍ਰਤਾ"],
    category: "ADDAK_OMISSION",
    explanationPa: "‘ਮ’ ਉੱਤੇ ਅੱਧਕ ਲੱਗਦਾ ਹੈ (ਮਿੱਤਰਤਾ)।",
  },
  {
    id: "SPL-090",
    correct: "ਉੱਤਰ",
    incorrectVariations: ["ਉਤਰ", "ਊਤਰ", "ਉੱਤ੍ਰ"],
    category: "ADDAK_OMISSION",
    explanationPa: "‘ੳ’ ਉੱਤੇ ਅੱਧਕ ਲੱਗਦਾ ਹੈ (ਉੱਤਰ)।",
  },
  {
    id: "SPL-091",
    correct: "ਹਿੱਸਾ",
    incorrectVariations: ["ਹਿਸਾ", "ਹੀਸਾ", "ਹਿੱਸਾਂ"],
    category: "ADDAK_OMISSION",
    explanationPa: "‘ਹ’ ਉੱਤੇ ਅੱਧਕ ਲੱਗਦਾ ਹੈ (ਹਿੱਸਾ)।",
  },
  {
    id: "SPL-092",
    correct: "ਗੁੱਸਾ",
    incorrectVariations: ["ਗੁਸਾ", "ਗੂਸਾ", "ਗੁੱਸਾਂ"],
    category: "ADDAK_OMISSION",
    explanationPa: "‘ਗ’ ਉੱਤੇ ਅੱਧਕ ਲੱਗਦਾ ਹੈ (ਗੁੱਸਾ)।",
  },
  {
    id: "SPL-093",
    correct: "ਕਿੱਸਾ",
    incorrectVariations: ["ਕਿਸਾ", "ਕੀਸਾ", "ਕਿੱਸਾਂ"],
    category: "ADDAK_OMISSION",
    explanationPa: "‘ਕ’ ਉੱਤੇ ਅੱਧਕ ਲੱਗਦਾ ਹੈ (ਕਿੱਸਾ)।",
  },
  {
    id: "SPL-094",
    correct: "ਜ਼ਿੰਮੇਵਾਰੀ",
    incorrectVariations: ["ਜਿੰਮੇਵਾਰੀ", "ਜਿਮੇਵਾਰੀ", "ਜ਼ਿਮੇਵਾਰੀ"],
    category: "LOANWORD_PHONETICS",
    explanationPa: "‘ਜ਼’ ਪੈਰ-ਬਿੰਦੀ ਅਤੇ ‘ਮ’ ਉੱਤੇ ਟਿੱਪੀ ਲੱਗਦੀ ਹੈ (ਜ਼ਿੰਮੇਵਾਰੀ)।",
  },
  {
    id: "SPL-095",
    correct: "ਫ਼ੈਸਲਾ",
    incorrectVariations: ["ਫੈਸਲਾ", "ਫ਼ੈਂਸਲਾ", "ਫੈਸਲਾਂ"],
    category: "LOANWORD_PHONETICS",
    explanationPa: "‘ਫ਼’ ਪੈਰ-ਬਿੰਦੀ ਨਾਲ ‘ਫ਼ੈਸਲਾ’ ਸ਼ੁੱਧ ਹੈ।",
  },
  {
    id: "SPL-096",
    correct: "ਖ਼ਬਰ",
    incorrectVariations: ["ਖਬਰ", "ਖ਼ਬੜ", "ਖਬੜ"],
    category: "LOANWORD_PHONETICS",
    explanationPa: "‘ਖ਼’ ਪੈਰ-ਬਿੰਦੀ ਨਾਲ ‘ਖ਼ਬਰ’ ਸ਼ੁੱਧ ਹੈ।",
  },
  {
    id: "SPL-097",
    correct: "ਕਾਗ਼ਜ਼",
    incorrectVariations: ["ਕਾਗਜ਼", "ਕਾਗਜ", "ਕਾਗ਼ਜ"],
    category: "LOANWORD_PHONETICS",
    explanationPa: "‘ਗ਼’ ਅਤੇ ‘ਜ਼’ ਦੋਵਾਂ ਪੈਰਾਂ ਵਿੱਚ ਬਿੰਦੀ ਲੱਗਦੀ ਹੈ (ਕਾਗ਼ਜ਼)।",
  },
  {
    id: "SPL-098",
    correct: "ਨਤੀਜਾ",
    incorrectVariations: ["ਨਤਿਜਾ", "ਨਤੀਜ਼ਾ", "ਨਤੀਜਾਂ"],
    category: "SIHARI_BIHARI",
    explanationPa: "‘ਤ’ ਨੂੰ ਬਿਹਾਰੀ ਲੱਗਦੀ ਹੈ (ਨਤੀਜਾ)।",
  },
  {
    id: "SPL-099",
    correct: "ਤਬਦੀਲੀ",
    incorrectVariations: ["ਤਬਦਿਲੀ", "ਤਬਦੀਲਿ", "ਤਬਦੀਲ਼ੀ"],
    category: "SIHARI_BIHARI",
    explanationPa: "‘ਦ’ ਅਤੇ ‘ਲ’ ਦੋਵਾਂ ਨੂੰ ਬਿਹਾਰੀ ਲੱਗਦੀ ਹੈ (ਤਬਦੀਲੀ)।",
  },
  {
    id: "SPL-100",
    correct: "ਵਜ਼ੀਰ",
    incorrectVariations: ["ਵਜੀਰ", "ਬਜ਼ੀਰ", "ਬਜੀਰ"],
    category: "LOANWORD_PHONETICS",
    explanationPa: "‘ਵ’ ਅਤੇ ਪੈਰ-ਬਿੰਦੀ ਵਾਲਾ ‘ਜ਼’ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ (ਵਜ਼ੀਰ)।",
  },
  {
  "id": "SPL-101",
  "correct": "ਵਿਹਾਰ",
  "incorrectVariations": [
    "ਬਿਹਾਰ",
    "ਵੇਹਾਰ",
    "ਵਿਹਾਲ"
  ],
  "category": "HA_PAIRIN_SOUND",
  "explanationPa": "ਟਕਸਾਲੀ ਪੰਜਾਬੀ ਵਿੱਚ 'ਵ' ਨਾਲ 'ਵਿਹਾਰ' ਸ਼ੁੱਧ ਹੈ, 'ਬਿਹਾਰ' ਬੋਲਚਾਲੀ ਜਾਂ ਰਾਜ ਦਾ ਨਾਮ ਹੈ।"
},
  {
  "id": "SPL-102",
  "correct": "ਤਿਉਹਾਰ",
  "incorrectVariations": [
    "ਤਿਓਹਾਰ",
    "ਤੇਹਾਰ",
    "ਤਿਹਾਰ"
  ],
  "category": "HA_PAIRIN_SOUND",
  "explanationPa": "ਸ਼ੁੱਧ ਸ਼ਬਦ-ਜੋੜ 'ਤਿਉਹਾਰ' ਹੈ (ਤ ਨੂੰ ਸਿਹਾਰੀ, ੳ ਨੂੰ ਹੋੜਾ)।"
},
  {
  "id": "SPL-103",
  "correct": "ਲੋੜੀਂਦਾ",
  "incorrectVariations": [
    "ਲੋੜੀਦਾ",
    "ਲੋੜਿੰਦਾ",
    "ਲੋੜੀਂਦਾਂ"
  ],
  "category": "TIPPI_BINDI",
  "explanationPa": "ਬਿਹਾਰੀ ਤੋਂ ਬਾਅਦ ਨਾਸਕੀ ਧੁਨੀ ਲਈ ਬਿੰਦੀ ਲੱਗਦੀ ਹੈ (ਲੋੜੀਂਦਾ)।"
},
  {
  "id": "SPL-104",
  "correct": "ਸਿਫ਼ਾਰਸ਼",
  "incorrectVariations": [
    "ਸਫਾਰਸ਼",
    "ਸਿਫਾਰਸ",
    "ਸਫ਼ਾਰਿਸ਼"
  ],
  "category": "LOANWORD_PHONETICS",
  "explanationPa": "ਪਹਿਲੇ ਅੱਖਰ 'ਸ' ਨੂੰ ਸਿਹਾਰੀ ਅਤੇ ਅੰਤ ਵਿੱਚ ਪੈਰ-ਬਿੰਦੀ ਵਾਲਾ 'ਸ਼' ਆਉਂਦਾ ਹੈ (ਸਿਫ਼ਾਰਸ਼)।"
},
  {
  "id": "SPL-105",
  "correct": "ਜ਼ਰੂਰੀ",
  "incorrectVariations": [
    "ਜਰੂਰੀ",
    "ਜ਼ਰੁਰੀ",
    "ਜਰੁਰੀ"
  ],
  "category": "LOANWORD_PHONETICS",
  "explanationPa": "ਫ਼ਾਰਸੀ ਮੂਲ ਕਾਰਨ 'ਜ਼' ਅਤੇ 'ਰ' ਨੂੰ ਦੁਲੈਂਕੜ (ਜ਼ਰੂਰੀ) ਸ਼ੁੱਧ ਹੈ।"
},
  {
  "id": "SPL-106",
  "correct": "ਗੰਭੀਰ",
  "incorrectVariations": [
    "ਗਭੀਰ",
    "ਗੰਭਿਰ",
    "ਗੰਬੀਰ"
  ],
  "category": "TIPPI_BINDI",
  "explanationPa": "'ਗ' ਉੱਤੇ ਟਿੱਪੀ ਅਤੇ 'ਭ' ਨੂੰ ਬਿਹਾਰੀ ਲੱਗਦੀ ਹੈ (ਗੰਭੀਰ)।"
},
  {
  "id": "SPL-107",
  "correct": "ਮਹੱਤਵਪੂਰਨ",
  "incorrectVariations": [
    "ਮਹਤਵਪੂਰਨ",
    "ਮਹੱਤਵਪੁਰਨ",
    "ਮਹਤਵਪੁਰਨ"
  ],
  "category": "ADDAK_OMISSION",
  "explanationPa": "'ਹ' ਉੱਤੇ ਅੱਧਕ ਅਤੇ 'ਪ' ਨੂੰ ਦੁਲੈਂਕੜ ਲੱਗਦਾ ਹੈ (ਮਹੱਤਵਪੂਰਨ)।"
},
  {
  "id": "SPL-108",
  "correct": "ਸ਼ਰਧਾਲੂ",
  "incorrectVariations": [
    "ਸਰਧਾਲੂ",
    "ਸ਼ਰਧਾਲੁ",
    "ਸ਼ਰਦਾਲੂ"
  ],
  "category": "LOANWORD_PHONETICS",
  "explanationPa": "'ਸ਼' ਬਿੰਦੀ ਵਾਲਾ ਅਤੇ ਅੰਤ ਵਿੱਚ 'ਲ' ਨੂੰ ਦੁਲੈਂਕੜ ਲੱਗਦਾ ਹੈ (ਸ਼ਰਧਾਲੂ)।"
},
  {
  "id": "SPL-109",
  "correct": "ਬੁੱਧੀਮਾਨ",
  "incorrectVariations": [
    "ਬੁਧੀਮਾਨ",
    "ਬੁੱਧਿਮਾਨ",
    "ਬੁਧਿਮਾਨ"
  ],
  "category": "ADDAK_OMISSION",
  "explanationPa": "'ਬ' ਨੂੰ ਔਂਕੜ ਉੱਤੇ ਅੱਧਕ ਅਤੇ 'ਧ' ਨੂੰ ਬਿਹਾਰੀ ਲੱਗਦੀ ਹੈ (ਬੁੱਧੀਮਾਨ)।"
},
  {
  "id": "SPL-110",
  "correct": "ਸਹਿਣਸ਼ੀਲਤਾ",
  "incorrectVariations": [
    "ਸੈਹਣਸ਼ੀਲਤਾ",
    "ਸਹਿਣਸੀਲਤਾ",
    "ਸਹਣਸ਼ੀਲਤਾ"
  ],
  "category": "HA_PAIRIN_SOUND",
  "explanationPa": "'ਹ' ਨੂੰ ਸਿਹਾਰੀ ਅਤੇ 'ਸ਼' ਪੈਰ-ਬਿੰਦੀ ਵਾਲਾ ਲੱਗਦਾ ਹੈ (ਸਹਿਣਸ਼ੀਲਤਾ)।"
},
  {
  "id": "SPL-111",
  "correct": "ਪਰੰਪਰਾ",
  "incorrectVariations": [
    "ਪਰੰਮਪਰਾ",
    "ਪਰਪਰਾ",
    "ਪ੍ਰੰਪਰਾ"
  ],
  "category": "TIPPI_BINDI",
  "explanationPa": "'ਰ' ਉੱਤੇ ਟਿੱਪੀ ਲੱਗ ਕੇ 'ਪਰੰਪਰਾ' ਸ਼ੁੱਧ ਟਕਸਾਲੀ ਰੂਪ ਬਣਦਾ ਹੈ।"
},
  {
  "id": "SPL-112",
  "correct": "ਅਨੁਸ਼ਾਸਨ",
  "incorrectVariations": [
    "ਅਨੁਸਾਸਨ",
    "ਅਨੂਸ਼ਾਸਨ",
    "ਅਨੁਸ਼ਾਸਣ"
  ],
  "category": "LOANWORD_PHONETICS",
  "explanationPa": "'ਨ' ਨੂੰ ਔਂਕੜ ਅਤੇ 'ਸ਼' ਪੈਰ-ਬਿੰਦੀ ਵਾਲਾ ਆਉਂਦਾ ਹੈ (ਅਨੁਸ਼ਾਸਨ)।"
},
  {
  "id": "SPL-113",
  "correct": "ਕਾਮਯਾਬੀ",
  "incorrectVariations": [
    "ਕਾਮਜਾਬੀ",
    "ਕਾਮਯਾਬਿ",
    "ਕਾਮਯਾਂਬੀ"
  ],
  "category": "SIHARI_BIHARI",
  "explanationPa": "'ਯ' ਨਾਲ 'ਕਾਮਯਾਬੀ' ਅਤੇ ਅੰਤ ਵਿੱਚ ਬਿਹਾਰੀ ਸ਼ੁੱਧ ਹੈ।"
},
  {
  "id": "SPL-114",
  "correct": "ਕਿਰਤ",
  "incorrectVariations": [
    "ਕ੍ਰਿਤ",
    "ਕਿਰਿਤ",
    "ਕ੍ਰਿੱਤ"
  ],
  "category": "SIHARI_BIHARI",
  "explanationPa": "ਪੰਜਾਬੀ ਵਿੱਚ ਤਦਭਵ ਰੂਪ 'ਕਿਰਤ' ਸ਼ੁੱਧ ਹੈ, ਤਤਸਮ 'ਕ੍ਰਿਤ' ਨਹੀਂ।"
},
  {
  "id": "SPL-115",
  "correct": "ਧਿਆਨ",
  "incorrectVariations": [
    "ਦਿਆਨ",
    "ਧਿਆਂਨ",
    "ਧਿਯਾਨ"
  ],
  "category": "SIHARI_BIHARI",
  "explanationPa": "'ਧ' ਨੂੰ ਸਿਹਾਰੀ ਅਤੇ 'ਯ' ਨਾਲ 'ਧਿਆਨ' ਸ਼ੁੱਧ ਰੂਪ ਹੈ।"
},
  {
  "id": "SPL-116",
  "correct": "ਉੱਦਮ",
  "incorrectVariations": [
    "ਉਦਮ",
    "ਉੱਦਮੁ",
    "ਊਦਮ"
  ],
  "category": "ADDAK_OMISSION",
  "explanationPa": "'ੳ' ਨੂੰ ਔਂਕੜ ਉੱਤੇ ਅੱਧਕ ਲੱਗ ਕੇ 'ਉੱਦਮ' (ਮਿਹਨਤ/ਯਤਨ) ਸ਼ੁੱਧ ਲਿਖਿਆ ਜਾਂਦਾ ਹੈ।"
},
  {
  "id": "SPL-117",
  "correct": "ਸੁੰਦਰ",
  "incorrectVariations": [
    "ਸੁੰਦੜ",
    "ਸੁਦਰ",
    "ਸੂੰਦਰ"
  ],
  "category": "TIPPI_BINDI",
  "explanationPa": "'ਸ' ਨੂੰ ਔਂਕੜ ਉੱਤੇ ਟਿੱਪੀ ਲੱਗਦੀ ਹੈ (ਸੁੰਦਰ)।"
},
  {
  "id": "SPL-118",
  "correct": "ਪ੍ਰਸ਼ਾਸਨ",
  "incorrectVariations": [
    "ਪ੍ਰਸਾਸਨ",
    "ਪਰਸ਼ਾਸਨ",
    "ਪ੍ਰਸ਼ਾਸਣ"
  ],
  "category": "LOANWORD_PHONETICS",
  "explanationPa": "'ਪ' ਦੇ ਪੈਰ ਵਿੱਚ 'ਰ' ਅਤੇ 'ਸ਼' ਬਿੰਦੀ ਵਾਲਾ ਆਉਂਦਾ ਹੈ (ਪ੍ਰਸ਼ਾਸਨ)।"
},
  {
  "id": "SPL-119",
  "correct": "ਸਮੱਸਿਆ",
  "incorrectVariations": [
    "ਸਮਸਿਆ",
    "ਸਮੱਸਯਾ",
    "ਸਮਸਯਾ"
  ],
  "category": "ADDAK_OMISSION",
  "explanationPa": "'ਮ' ਉੱਤੇ ਅੱਧਕ ਲੱਗਦਾ ਹੈ (ਸਮੱਸਿਆ)।"
},
  {
  "id": "SPL-120",
  "correct": "ਵਿਵਸਥਾ",
  "incorrectVariations": [
    "ਬਿਵਸਥਾ",
    "ਵਿਵਸਤਾ",
    "ਵੇਵਸਥਾ"
  ],
  "category": "SIHARI_BIHARI",
  "explanationPa": "'ਵ' ਨਾਲ 'ਵਿਵਸਥਾ' ਟਕਸਾਲੀ ਸ਼ੁੱਧ ਰੂਪ ਹੈ।"
},
  {
  "id": "SPL-121",
  "correct": "ਖ਼ੂਬਸੂਰਤ",
  "incorrectVariations": [
    "ਖੂਬਸੂਰਤ",
    "ਖ਼ੂਬਸੁਰਤ",
    "ਖੂਬਸੁਰਤ"
  ],
  "category": "LOANWORD_PHONETICS",
  "explanationPa": "'ਖ਼' ਪੈਰ-ਬਿੰਦੀ ਵਾਲਾ ਅਤੇ ਦੋਵੇਂ ਥਾਈਂ ਦੁਲੈਂਕੜ ਲੱਗਦਾ ਹੈ (ਖ਼ੂਬਸੂਰਤ)।"
},
  {
  "id": "SPL-122",
  "correct": "ਕੁਰਬਾਨੀ",
  "incorrectVariations": [
    "ਕੁਰਬਾਨਿ",
    "ਕੁਰਬਾਂਨੀ",
    "ਕਰਬਾਨੀ"
  ],
  "category": "SIHARI_BIHARI",
  "explanationPa": "'ਕ' ਨੂੰ ਔਂਕੜ ਅਤੇ ਅੰਤ ਵਿੱਚ ਬਿਹਾਰੀ ਲੱਗਦੀ ਹੈ (ਕੁਰਬਾਨੀ)।"
},
  {
  "id": "SPL-123",
  "correct": "ਮੌਲਿਕ",
  "incorrectVariations": [
    "ਮੋਲਿਕ",
    "ਮੌਲਕ",
    "ਮੌਲੀਕ"
  ],
  "category": "SIHARI_BIHARI",
  "explanationPa": "'ਮ' ਨੂੰ ਕਨੌੜਾ ਅਤੇ 'ਲ' ਨੂੰ ਸਿਹਾਰੀ ਲੱਗਦੀ ਹੈ (ਮੌਲਿਕ)।"
},
  {
  "id": "SPL-124",
  "correct": "ਦਰਸ਼ਨ",
  "incorrectVariations": [
    "ਦਰਸਨ",
    "ਦਰਸ਼ਣ",
    "ਦ੍ਰਸ਼ਨ"
  ],
  "category": "LOANWORD_PHONETICS",
  "explanationPa": "'ਸ਼' ਪੈਰ-ਬਿੰਦੀ ਵਾਲਾ ਅਤੇ 'ਨ' ਨਾਲ 'ਦਰਸ਼ਨ' ਸ਼ੁੱਧ ਹੈ।"
},
  {
  "id": "SPL-125",
  "correct": "ਆਲ੍ਹਣਾ",
  "incorrectVariations": [
    "ਆਲਣਾ",
    "ਆਲਨਾ",
    "ਆਲ੍ਹਾਣਾ"
  ],
  "category": "HA_PAIRIN_SOUND",
  "explanationPa": "'ਲ' ਦੇ ਪੈਰ ਵਿੱਚ 'ਹ' (ਲ੍ਹ) ਲੱਗਦਾ ਹੈ (ਆਲ੍ਹਣਾ)।"
},
  {
  "id": "SPL-126",
  "correct": "ਸੰਖੇਪ",
  "incorrectVariations": [
    "ਸਖੇਪ",
    "ਸੰਖੇਪੁ",
    "ਸੰਖੈਪ"
  ],
  "category": "TIPPI_BINDI",
  "explanationPa": "'ਸ' ਉੱਤੇ ਟਿੱਪੀ ਅਤੇ 'ਖ' ਨੂੰ ਲਾਂ ਲੱਗਦੀ ਹੈ (ਸੰਖੇਪ)।"
},
  {
  "id": "SPL-127",
  "correct": "ਵਿਸ਼ੇਸ਼",
  "incorrectVariations": [
    "ਬਿਸ਼ੇਸ਼",
    "ਵਿਸੇਸ",
    "ਵਿਸ਼ੇਸ"
  ],
  "category": "LOANWORD_PHONETICS",
  "explanationPa": "ਦੋਵੇਂ ਥਾਈਂ ਪੈਰ-ਬਿੰਦੀ ਵਾਲਾ 'ਸ਼' ਆਉਂਦਾ ਹੈ (ਵਿਸ਼ੇਸ਼)।"
},
  {
  "id": "SPL-128",
  "correct": "ਗ਼ਰੀਬ",
  "incorrectVariations": [
    "ਗਰੀਬ",
    "ਗ਼ਰਿਬ",
    "ਗਰੀਬੀ"
  ],
  "category": "LOANWORD_PHONETICS",
  "explanationPa": "'ਗ਼' ਪੈਰ-ਬਿੰਦੀ ਵਾਲਾ ਅਤੇ 'ਰ' ਨੂੰ ਬਿਹਾਰੀ ਲੱਗਦੀ ਹੈ (ਗ਼ਰੀਬ)।"
},
  {
  "id": "SPL-129",
  "correct": "ਚਿੰਤਾ",
  "incorrectVariations": [
    "ਚਿਂਤਾ",
    "ਚੀਂਤਾ",
    "ਚਿਤਾਂ"
  ],
  "category": "TIPPI_BINDI",
  "explanationPa": "'ਚ' ਨੂੰ ਸਿਹਾਰੀ ਉੱਤੇ ਟਿੱਪੀ ਲੱਗਦੀ ਹੈ (ਚਿੰਤਾ)।"
},
  {
  "id": "SPL-130",
  "correct": "ਸ਼ਰਮਿੰਦਾ",
  "incorrectVariations": [
    "ਸਰਮਿੰਦਾ",
    "ਸ਼ਰਮਿਂਦਾ",
    "ਸ਼ਰਮੀਂਦਾ"
  ],
  "category": "TIPPI_BINDI",
  "explanationPa": "'ਮ' ਨੂੰ ਸਿਹਾਰੀ ਉੱਤੇ ਟਿੱਪੀ ਲੱਗਦੀ ਹੈ (ਸ਼ਰਮਿੰਦਾ)।"
},
  {
  "id": "SPL-131",
  "correct": "ਉਚਾਰਨ",
  "incorrectVariations": [
    "ਉਚਾਰਣ",
    "ਉਚਾਰੰਨ",
    "ਉਚਾਰਣਾ"
  ],
  "category": "LOANWORD_PHONETICS",
  "explanationPa": "ਅੰਤ ਵਿੱਚ 'ਨ' ਆਉਂਦਾ ਹੈ, 'ਣ' ਨਹੀਂ (ਉਚਾਰਨ)।"
},
  {
  "id": "SPL-132",
  "correct": "ਮੁਕਾਬਲਾ",
  "incorrectVariations": [
    "ਮੁਕਾਬਲਾਂ",
    "ਮੁਕਾਬਿਲਾ",
    "ਮੌਕਾਬਲਾ"
  ],
  "category": "AUNKAR_DULANKAR",
  "explanationPa": "'ਮ' ਨੂੰ ਔਂਕੜ ਨਾਲ 'ਮੁਕਾਬਲਾ' ਸ਼ੁੱਧ ਟਕਸਾਲੀ ਰੂਪ ਹੈ।"
},
  {
  "id": "SPL-133",
  "correct": "ਸੰਤੋਖ",
  "incorrectVariations": [
    "ਸਤੋਖ",
    "ਸੰਤੌਖ",
    "ਸੰਤੋਸ਼"
  ],
  "category": "TIPPI_BINDI",
  "explanationPa": "'ਸ' ਉੱਤੇ ਟਿੱਪੀ ਅਤੇ 'ਤ' ਨੂੰ ਹੋੜਾ ਲੱਗਦਾ ਹੈ (ਸੰਤੋਖ)।"
},
  {
  "id": "SPL-134",
  "correct": "ਨੁਕਸਾਨ",
  "incorrectVariations": [
    "ਨੁਕਸਾਣ",
    "ਨਕਸਾਨ",
    "ਨੁਕਸ਼ਾਨ"
  ],
  "category": "AUNKAR_DULANKAR",
  "explanationPa": "'ਨ' ਨੂੰ ਔਂਕੜ ਅਤੇ ਅੰਤ ਵਿੱਚ 'ਨ' ਆਉਂਦਾ ਹੈ (ਨੁਕਸਾਨ)।"
},
  {
  "id": "SPL-135",
  "correct": "ਵਿਕਾਸ",
  "incorrectVariations": [
    "ਬਿਕਾਸ",
    "ਵਿਗਾਸ",
    "ਵੇਕਾਸ"
  ],
  "category": "SIHARI_BIHARI",
  "explanationPa": "'ਵ' ਨਾਲ 'ਵਿਕਾਸ' ਸ਼ੁੱਧ ਟਕਸਾਲੀ ਰੂਪ ਹੈ।"
},
  {
  "id": "SPL-136",
  "correct": "ਪ੍ਰਕਿਰਤੀ",
  "incorrectVariations": [
    "ਪ੍ਰਕਿਰਤਿ",
    "ਪ੍ਰਕ੍ਰਿਤੀ",
    "ਪਰਕਿਰਤੀ"
  ],
  "category": "SIHARI_BIHARI",
  "explanationPa": "'ਕ' ਨੂੰ ਸਿਹਾਰੀ ਅਤੇ 'ਤ' ਨੂੰ ਬਿਹਾਰੀ ਲੱਗਦੀ ਹੈ (ਪ੍ਰਕਿਰਤੀ)।"
},
  {
  "id": "SPL-137",
  "correct": "ਅਹਿਸਾਸ",
  "incorrectVariations": [
    "ਐਹਸਾਸ",
    "ਅਹਸਾਸ",
    "ਅਹਿਸ਼ਾਸ਼"
  ],
  "category": "HA_PAIRIN_SOUND",
  "explanationPa": "'ਹ' ਨੂੰ ਸਿਹਾਰੀ ਲੱਗਦੀ ਹੈ (ਅਹਿਸਾਸ)।"
},
  {
  "id": "SPL-138",
  "correct": "ਤਰੱਕੀ",
  "incorrectVariations": [
    "ਤਰਕੀ",
    "ਤਰਕ੍ਕੀ",
    "ਤਰੱਕਿ"
  ],
  "category": "ADDAK_OMISSION",
  "explanationPa": "'ਰ' ਉੱਤੇ ਅੱਧਕ ਅਤੇ 'ਕ' ਨੂੰ ਬਿਹਾਰੀ ਲੱਗਦੀ ਹੈ (ਤਰੱਕੀ)।"
},
  {
  "id": "SPL-139",
  "correct": "ਸੰਕੋਚ",
  "incorrectVariations": [
    "ਸਕੋਚ",
    "ਸੰਕੌਚ",
    "ਸੰਕੋਛ"
  ],
  "category": "TIPPI_BINDI",
  "explanationPa": "'ਸ' ਉੱਤੇ ਟਿੱਪੀ ਅਤੇ 'ਕ' ਨੂੰ ਹੋੜਾ ਲੱਗਦਾ ਹੈ (ਸੰਕੋਚ)।"
},
  {
  "id": "SPL-140",
  "correct": "ਫ਼ਰਜ਼",
  "incorrectVariations": [
    "ਫਰਜ",
    "ਫ਼ਰਜ",
    "ਫਰਜ਼"
  ],
  "category": "LOANWORD_PHONETICS",
  "explanationPa": "'ਫ਼' ਅਤੇ 'ਜ਼' ਦੋਵਾਂ ਪੈਰਾਂ ਵਿੱਚ ਬਿੰਦੀ ਲੱਗਦੀ ਹੈ (ਫ਼ਰਜ਼)।"
}
];
