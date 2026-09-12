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
    | "LOANWORD_PHONETICS"// ਫ਼ਾਰਸੀ/ਅੰਗਰੇਜ਼ੀ ਸ਼ਬਦ-ਜੋੜ (e.g. ਕਾਨੂੰਨ vs ਕਾਨੂਨ)
    | "VARG_CONFUSION"    // ਵਰਗ ਉਚਾਰਨ ਭੁਲੇਖਾ (e.g. ਣ vs ਨ, ਘ vs ਖ)
    | "HALVANT_PAIRIN"    // ਹਲੰਤ ਅਤੇ ਪੈਰੀਂ ਅੱਖਰ (e.g. ਪ੍ਰਕਾਸ਼ vs ਪਰਕਾਸ਼)
    | "TATSAM_TADBHAV";   // ਤਤਸਮ / ਤਦਭਵ ਸ਼ਬਦ-ਜੋੜ (e.g. ਅਸਚਰਜ vs ਅਚਰਜ)
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
  ,
  // --- VARG_CONFUSION (ਣ vs ਨ, ਘ/ਖ, ਝ/ਛ, ਧ/ਥ, ਭ/ਫ) ---
  {
    id: "SPL-101",
    correct: "ਪਾਣੀ",
    incorrectVariations: ["ਪਾਨੀ", "ਪਾਂਣੀ", "ਪਾਂਨੀ"],
    category: "VARG_CONFUSION",
    explanationPa: "ਪੰਜਾਬੀ ਵਿੱਚ ਸ਼ੁੱਧ ਰੂਪ ‘ਪਾਣੀ’ (ਣ ਨਾਲ) ਹੈ, ‘ਪਾਨੀ’ ਬੋਲਚਾਲੀ ਜਾਂ ਹਿੰਦੀ ਪ੍ਰਭਾਵਿਤ ਅਸ਼ੁੱਧ ਰੂਪ ਹੈ।",
  },
  {
    id: "SPL-102",
    correct: "ਰਾਣੀ",
    incorrectVariations: ["ਰਾਨੀ", "ਰਾਂਣੀ", "ਰਾਂਨੀ"],
    category: "VARG_CONFUSION",
    explanationPa: "ਟਕਸਾਲੀ ਪੰਜਾਬੀ ਸ਼ਬਦ-ਜੋੜ ‘ਰਾਣੀ’ ਹੈ, ‘ਰਾਨੀ’ ਅਸ਼ੁੱਧ ਹੈ।",
  },
  {
    id: "SPL-103",
    correct: "ਕਹਾਣੀ",
    incorrectVariations: ["ਕਹਾਨੀ", "ਕਹਾੱਣੀ", "ਕਹਾਂਣੀ"],
    category: "VARG_CONFUSION",
    explanationPa: "ਸ਼ੁੱਧ ਸ਼ਬਦ-ਜੋੜ ‘ਕਹਾਣੀ’ ਹੈ (ਅੰਤ ਵਿੱਚ ਣਾਣਾ)।",
  },
  {
    id: "SPL-104",
    correct: "ਗੁਣ",
    incorrectVariations: ["ਗੁਨ", "ਗੂਣ", "ਗੂਨ"],
    category: "VARG_CONFUSION",
    explanationPa: "ਟਕਸਾਲੀ ਪੰਜਾਬੀ ਵਿੱਚ ‘ਗੁਣ’ ਸ਼ੁੱਧ ਹੈ।",
  },
  {
    id: "SPL-105",
    correct: "ਮਾਣ",
    incorrectVariations: ["ਮਾਨ", "ਮਾਂਣ", "ਮਾਂਨ"],
    category: "VARG_CONFUSION",
    explanationPa: "ਸ਼ੁੱਧ ਰੂਪ ‘ਮਾਣ’ (ਇੱਜ਼ਤ/ਫ਼ਖ਼ਰ) ਹੈ।",
  },
  {
    id: "SPL-106",
    correct: "ਪ੍ਰਾਣ",
    incorrectVariations: ["ਪ੍ਰਾਨ", "ਪਰਾਣ", "ਪਰਾਨ"],
    category: "VARG_CONFUSION",
    explanationPa: "ਸ਼ੁੱਧ ਰੂਪ ‘ਪ੍ਰਾਣ’ ਹੈ।",
  },
  {
    id: "SPL-107",
    correct: "ਵੀਣਾ",
    incorrectVariations: ["ਵੀਨਾ", "ਵਿਣਾ", "ਵੀਨਾਂ"],
    category: "VARG_CONFUSION",
    explanationPa: "ਸੰਗੀਤ ਸਾਜ਼ ਦਾ ਸ਼ੁੱਧ ਨਾਮ ‘ਵੀਣਾ’ ਹੈ।",
  },
  {
    id: "SPL-108",
    correct: "ਬਾਣੀ",
    incorrectVariations: ["ਬਾਨੀ", "ਬਾਂਣੀ", "ਬਾਂਨੀ"],
    category: "VARG_CONFUSION",
    explanationPa: "ਪਵਿੱਤਰ ਬਚਨਾਂ ਲਈ ਸ਼ੁੱਧ ਸ਼ਬਦ ‘ਬਾਣੀ’ ਹੈ।",
  },
  {
    id: "SPL-109",
    correct: "ਪੁਰਾਣਾ",
    incorrectVariations: ["ਪੁਰਾਨਾ", "ਪੁਰਾਂਣਾ", "ਪੂਰਾਣਾ"],
    category: "VARG_CONFUSION",
    explanationPa: "ਟਕਸਾਲੀ ਪੰਜਾਬੀ ਵਿੱਚ ‘ਪੁਰਾਣਾ’ ਸ਼ੁੱਧ ਹੈ, ‘ਪੁਰਾਨਾ’ ਅਸ਼ੁੱਧ ਹੈ।",
  },
  {
    id: "SPL-110",
    correct: "ਸਿਆਣਾ",
    incorrectVariations: ["ਸਿਆਨਾ", "ਸਿਯਾਣਾ", "ਸਿਯਾਨਾ"],
    category: "VARG_CONFUSION",
    explanationPa: "ਅਕਲਮੰਦ ਲਈ ਸ਼ੁੱਧ ਟਕਸਾਲੀ ਸ਼ਬਦ ‘ਸਿਆਣਾ’ ਹੈ।",
  },
  {
    id: "SPL-111",
    correct: "ਦਾਣਾ",
    incorrectVariations: ["ਦਾਨਾ", "ਦਾਂਣਾ", "ਦਾਂਨਾ"],
    category: "VARG_CONFUSION",
    explanationPa: "ਅੰਨ ਦੇ ਕਣ ਲਈ ‘ਦਾਣਾ’ ਸ਼ੁੱਧ ਸ਼ਬਦ-ਜੋੜ ਹੈ।",
  },
  {
    id: "SPL-112",
    correct: "ਗਾਣਾ",
    incorrectVariations: ["ਗਾਨਾ", "ਗਾਂਣਾ", "ਗਾਂਨਾ"],
    category: "VARG_CONFUSION",
    explanationPa: "ਗੀਤ ਲਈ ਸ਼ੁੱਧ ਸ਼ਬਦ ‘ਗਾਣਾ’ ਹੈ।",
  },
  {
    id: "SPL-113",
    correct: "ਖਾਣਾ",
    incorrectVariations: ["ਖਾਨਾ", "ਖਾਂਣਾ", "ਖਾਂਨਾ"],
    category: "VARG_CONFUSION",
    explanationPa: "ਭੋਜਨ ਜਾਂ ਖਾਣ ਦੀ ਕਿਰਿਆ ਲਈ ‘ਖਾਣਾ’ ਸ਼ੁੱਧ ਹੈ।",
  },
  {
    id: "SPL-114",
    correct: "ਜਾਣਾ",
    incorrectVariations: ["ਜਾਨਾ", "ਜਾਂਣਾ", "ਜਾਂਨਾ"],
    category: "VARG_CONFUSION",
    explanationPa: "ਕਿਰਿਆ ਦਾ ਸ਼ੁੱਧ ਮੂਲ ਰੂਪ ‘ਜਾਣਾ’ ਹੈ।",
  },
  {
    id: "SPL-115",
    correct: "ਆਉਣਾ",
    incorrectVariations: ["ਆਉਨਾ", "ਆਵਣਾ", "ਆਓਣਾ"],
    category: "VARG_CONFUSION",
    explanationPa: "ਟਕਸਾਲੀ ਪੰਜਾਬੀ ਵਿੱਚ ‘ਆਉਣਾ’ ਸ਼ੁੱਧ ਰੂਪ ਹੈ।",
  },
  {
    id: "SPL-116",
    correct: "ਦੇਣਾ",
    incorrectVariations: ["ਦੇਨਾ", "ਦੇਵਣਾ", "ਦੈਣਾ"],
    category: "VARG_CONFUSION",
    explanationPa: "ਸ਼ੁੱਧ ਕਿਰਿਆ ਰੂਪ ‘ਦੇਣਾ’ ਹੈ।",
  },
  {
    id: "SPL-117",
    correct: "ਲੈਣਾ",
    incorrectVariations: ["ਲੈਨਾ", "ਲੈਵਣਾ", "ਲੇਣਾ"],
    category: "VARG_CONFUSION",
    explanationPa: "ਸ਼ੁੱਧ ਕਿਰਿਆ ਰੂਪ ‘ਲੈਣਾ’ ਹੈ।",
  },
  {
    id: "SPL-118",
    correct: "ਗਹਿਣਾ",
    incorrectVariations: ["ਗਹਿਨਾ", "ਗੈਹਣਾ", "ਗੈਹਨਾ"],
    category: "VARG_CONFUSION",
    explanationPa: "ਜ਼ੇਵਰ ਲਈ ਸ਼ੁੱਧ ਸ਼ਬਦ ‘ਗਹਿਣਾ’ ਹੈ।",
  },
  {
    id: "SPL-119",
    correct: "ਰਹਿਣਾ",
    incorrectVariations: ["ਰਹਿਨਾ", "ਰੈਹਣਾ", "ਰੈਹਨਾ"],
    category: "VARG_CONFUSION",
    explanationPa: "ਟਕਸਾਲੀ ਪੰਜਾਬੀ ਵਿੱਚ ‘ਰਹਿਣਾ’ ਸ਼ੁੱਧ ਹੈ।",
  },
  {
    id: "SPL-120",
    correct: "ਕਹਿਣਾ",
    incorrectVariations: ["ਕਹਿਨਾ", "ਕੈਹਣਾ", "ਕੈਹਨਾ"],
    category: "VARG_CONFUSION",
    explanationPa: "ਬੋਲਣ ਦੀ ਕਿਰਿਆ ਲਈ ਸ਼ੁੱਧ ਰੂਪ ‘ਕਹਿਣਾ’ ਹੈ।",
  },
  {
    id: "SPL-121",
    correct: "ਸਹਿਣਾ",
    incorrectVariations: ["ਸਹਿਨਾ", "ਸੈਹਣਾ", "ਸੈਹਨਾ"],
    category: "VARG_CONFUSION",
    explanationPa: "ਬਰਦਾਸ਼ਤ ਕਰਨ ਲਈ ‘ਸਹਿਣਾ’ ਸ਼ੁੱਧ ਸ਼ਬਦ ਹੈ।",
  },
  {
    id: "SPL-122",
    correct: "ਵਹਿਣਾ",
    incorrectVariations: ["ਵਹਿਨਾ", "ਵੈਹਣਾ", "ਵੈਹਨਾ"],
    category: "VARG_CONFUSION",
    explanationPa: "ਪਾਣੀ ਦੇ ਵਹਾਅ ਲਈ ‘ਵਹਿਣਾ’ ਸ਼ੁੱਧ ਹੈ।",
  },
  {
    id: "SPL-123",
    correct: "ਧੋਬੀ",
    incorrectVariations: ["ਥੋਬੀ", "ਧੋਬਿ", "ਧੌਬੀ"],
    category: "VARG_CONFUSION",
    explanationPa: "ਕੱਪੜੇ ਧੋਣ ਵਾਲੇ ਲਈ ਸ਼ੁੱਧ ਸ਼ਬਦ ‘ਧੋਬੀ’ (ਧ ਨਾਲ) ਹੈ।",
  },
  {
    id: "SPL-124",
    correct: "ਧਰਮ",
    incorrectVariations: ["ਥਰਮ", "ਧਰੱਮ", "ਧ੍ਰਮ"],
    category: "VARG_CONFUSION",
    explanationPa: "ਸ਼ੁੱਧ ਰੂਪ ‘ਧਰਮ’ (ਧ ਨਾਲ) ਹੈ।",
  },
  {
    id: "SPL-125",
    correct: "ਧੁੱਪ",
    incorrectVariations: ["ਥੁੱਪ", "ਧੁਪ", "ਧੂਪ"],
    category: "VARG_CONFUSION",
    explanationPa: "ਸੂਰਜ ਦੀ ਰੌਸ਼ਨੀ ਲਈ ਸ਼ੁੱਧ ਸ਼ਬਦ ‘ਧੁੱਪ’ ਹੈ।",
  },
  {
    id: "SPL-126",
    correct: "ਝੰਡਾ",
    incorrectVariations: ["ਛੰਡਾ", "ਝਂਡਾ", "ਝੱਡਾ"],
    category: "VARG_CONFUSION",
    explanationPa: "ਰਾਸ਼ਟਰੀ ਧਵੱਜ ਲਈ ਸ਼ੁੱਧ ਸ਼ਬਦ ‘ਝੰਡਾ’ (ਝ ਨਾਲ) ਹੈ।",
  },
  {
    id: "SPL-127",
    correct: "ਘੰਟੀ",
    incorrectVariations: ["ਖੰਟੀ", "ਘਂਟੀ", "ਘੰਟਿ"],
    category: "VARG_CONFUSION",
    explanationPa: "ਸ਼ੁੱਧ ਸ਼ਬਦ ‘ਘੰਟੀ’ (ਘ ਨਾਲ) ਹੈ।",
  },
  {
    id: "SPL-128",
    correct: "ਭੋਜਨ",
    incorrectVariations: ["ਫੋਜਨ", "ਭੌਜਨ", "ਭੋਜਣ"],
    category: "VARG_CONFUSION",
    explanationPa: "ਸ਼ੁੱਧ ਸ਼ਬਦ ‘ਭੋਜਨ’ (ਭ ਨਾਲ) ਹੈ।",
  },
  {
    id: "SPL-129",
    correct: "ਮਧਾਣੀ",
    incorrectVariations: ["ਮਧਾਨੀ", "ਮਥਾਣੀ", "ਮਥਾਨੀ"],
    category: "VARG_CONFUSION",
    explanationPa: "ਦਹੀਂ ਰਿੜਕਣ ਵਾਲੇ ਸਾਧਨ ਦਾ ਸ਼ੁੱਧ ਨਾਮ ‘ਮਧਾਣੀ’ ਹੈ।",
  },
  {
    id: "SPL-130",
    correct: "ਟਿਕਾਣਾ",
    incorrectVariations: ["ਟਿਕਾਨਾ", "ਠਿਕਾਣਾ", "ਠਿਕਾਨਾ"],
    category: "VARG_CONFUSION",
    explanationPa: "ਰਹਿਣ ਦੀ ਥਾਂ ਲਈ ‘ਟਿਕਾਣਾ’ ਸ਼ੁੱਧ ਹੈ।",
  },
  {
    id: "SPL-131",
    correct: "ਸੋਹਣਾ",
    incorrectVariations: ["ਸੋਹਨਾ", "ਸੌਹਣਾ", "ਸੌਹਨਾ"],
    category: "VARG_CONFUSION",
    explanationPa: "ਸੁੰਦਰ ਲਈ ਸ਼ੁੱਧ ਪੰਜਾਬੀ ਸ਼ਬਦ ‘ਸੋਹਣਾ’ ਹੈ।",
  },
  {
    id: "SPL-132",
    correct: "ਪਹਿਨਣਾ",
    incorrectVariations: ["ਪਹਿਨਨਾ", "ਪੈਹਨਣਾ", "ਪਹਿਣਨਾ"],
    category: "VARG_CONFUSION",
    explanationPa: "ਕੱਪੜੇ ਧਾਰਨ ਕਰਨ ਦੀ ਕਿਰਿਆ ਦਾ ਸ਼ੁੱਧ ਰੂਪ ‘ਪਹਿਨਣਾ’ ਹੈ।",
  },
  {
    id: "SPL-133",
    correct: "ਠਾਣੇਦਾਰ",
    incorrectVariations: ["ਥਾਣੇਦਾਰ", "ਥਾਨੇਦਾਰ", "ਠਾਨੇਦਾਰ"],
    category: "VARG_CONFUSION",
    explanationPa: "ਪੰਜਾਬੀ ਵਿੱਚ ‘ਠਾਣੇਦਾਰ’ ਸ਼ੁੱਧ ਸ਼ਬਦ-ਜੋੜ ਹੈ।",
  },

  // --- HALVANT_PAIRIN (ਪੈਰੀਂ ਰ, ਹ, ਵ ਅਤੇ ਸੰਯੁਕਤ ਅੱਖਰ) ---
  {
    id: "SPL-134",
    correct: "ਪ੍ਰਕਾਸ਼",
    incorrectVariations: ["ਪਰਕਾਸ਼", "ਪ੍ਰਕਾਸ", "ਪ੍ਰਕਾਸ਼ੁ"],
    category: "HALVANT_PAIRIN",
    explanationPa: "ਟਕਸਾਲੀ ਮਿਆਰੀ ਰੂਪ ਵਿੱਚ ਪੈਰੀਂ ਰਾਰਾ ਲੱਗ ਕੇ ‘ਪ੍ਰਕਾਸ਼’ ਲਿਖਿਆ ਜਾਂਦਾ ਹੈ।",
  },
  {
    id: "SPL-135",
    correct: "ਪ੍ਰਸ਼ਨ",
    incorrectVariations: ["ਪਰਸ਼ਨ", "ਪ੍ਰਸਨ", "ਪਰਸਨ"],
    category: "HALVANT_PAIRIN",
    explanationPa: "ਸਵਾਲ ਲਈ ਸ਼ੁੱਧ ਰੂਪ ‘ਪ੍ਰਸ਼ਨ’ (ਪੈਰੀਂ ਰਾਰਾ) ਹੈ।",
  },
  {
    id: "SPL-136",
    correct: "ਕ੍ਰਮ",
    incorrectVariations: ["ਕਰਮ", "ਕ੍ਰਿਮ", "ਕ੍ਰੱਮ"],
    category: "HALVANT_PAIRIN",
    explanationPa: "ਸਿਲਸਿਲੇ ਜਾਂ ਤਰਤੀਬ ਲਈ ‘ਕ੍ਰਮ’ (ਪੈਰੀਂ ਰਾਰਾ) ਸ਼ੁੱਧ ਹੈ।",
  },
  {
    id: "SPL-137",
    correct: "ਦ੍ਰਿੜ੍ਹ",
    incorrectVariations: ["ਦਿਰੜ", "ਦ੍ਰਿੜ", "ਦਿਰੜ੍ਹ"],
    category: "HALVANT_PAIRIN",
    explanationPa: "ਪੱਕੇ ਇਰਾਦੇ ਲਈ ਸ਼ੁੱਧ ਸ਼ਬਦ ‘ਦ੍ਰਿੜ੍ਹ’ (ਪੈਰੀਂ ਰਾਰਾ ਅਤੇ ਪੈਰੀਂ ਹਾਹਾ) ਹੈ।",
  },
  {
    id: "SPL-138",
    correct: "ਪ੍ਰੇਮ",
    incorrectVariations: ["ਪਰੇਮ", "ਪ੍ਰੈਮ", "ਪ੍ਰੇਮੁ"],
    category: "HALVANT_PAIRIN",
    explanationPa: "ਪਿਆਰ ਲਈ ਸ਼ੁੱਧ ਤਤਸਮ ਰੂਪ ‘ਪ੍ਰੇਮ’ (ਪੈਰੀਂ ਰਾਰਾ) ਹੈ।",
  },
  {
    id: "SPL-139",
    correct: "ਪ੍ਰਧਾਨ",
    incorrectVariations: ["ਪਰਧਾਨ", "ਪ੍ਰਥਾਨ", "ਪਰਥਾਨ"],
    category: "HALVANT_PAIRIN",
    explanationPa: "ਮੁਖੀ ਲਈ ਸ਼ੁੱਧ ਸ਼ਬਦ ‘ਪ੍ਰਧਾਨ’ ਹੈ।",
  },
  {
    id: "SPL-140",
    correct: "ਸ੍ਰੀ",
    incorrectVariations: ["ਸ਼੍ਰੀ", "ਸਰੀ", "ਸਿਰੀ"],
    category: "HALVANT_PAIRIN",
    explanationPa: "ਗੁਰਮੁਖੀ ਲਿਪੀ ਦੇ ਟਕਸਾਲੀ ਨੇਮਾਂ ਅਨੁਸਾਰ ‘ਸ੍ਰੀ’ (ਸੱਸੇ ਪੈਰੀਂ ਰਾਰਾ) ਮਿਆਰੀ ਰੂਪ ਹੈ।",
  },
  {
    id: "SPL-141",
    correct: "ਸ੍ਵੈਮਾਣ",
    incorrectVariations: ["ਸਵੈਮਾਣ", "ਸਵੈਮਾਨ", "ਸ੍ਵੈਮਾਨ"],
    category: "HALVANT_PAIRIN",
    explanationPa: "ਆਤਮ-ਸਨਮਾਨ ਲਈ ਸ਼ੁੱਧ ਰੂਪ ‘ਸ੍ਵੈਮਾਣ’ (ਸੱਸੇ ਪੈਰੀਂ ਵਾਵਾ) ਹੈ।",
  },
  {
    id: "SPL-142",
    correct: "ਸ੍ਵੈ-ਜੀਵਨੀ",
    incorrectVariations: ["ਸਵੈ-ਜੀਵਨੀ", "ਸ੍ਵੈ-ਜਿਵਨੀ", "ਸਵੈ ਜੀਵਨੀ"],
    category: "HALVANT_PAIRIN",
    explanationPa: "ਆਪਣੀ ਜੀਵਨ-ਕਥਾ ਲਈ ਸ਼ੁੱਧ ਸ਼ਬਦ ‘ਸ੍ਵੈ-ਜੀਵਨੀ’ ਹੈ।",
  },
  {
    id: "SPL-143",
    correct: "ਸ੍ਵਰ",
    incorrectVariations: ["ਸਵਰ", "ਸ੍ਰਵ", "ਸ੍ਵਾਰ"],
    category: "HALVANT_PAIRIN",
    explanationPa: "ਧੁਨੀ ਵਿਗਿਆਨ ਵਿੱਚ ਸਵਰ ਧੁਨੀ ਲਈ ‘ਸ੍ਵਰ’ ਸ਼ੁੱਧ ਸ਼ਬਦ ਹੈ।",
  },
  {
    id: "SPL-144",
    correct: "ਦ੍ਰਿਸ਼ਟੀ",
    incorrectVariations: ["ਦਿਰਸ਼ਟੀ", "ਦ੍ਰਿਸ਼ਟਿ", "ਦਿਰਸਟੀ"],
    category: "HALVANT_PAIRIN",
    explanationPa: "ਨਜ਼ਰ ਲਈ ਸ਼ੁੱਧ ਰੂਪ ‘ਦ੍ਰਿਸ਼ਟੀ’ ਹੈ।",
  },
  {
    id: "SPL-145",
    correct: "ਗ੍ਰੰਥ",
    incorrectVariations: ["ਗਰੰਥ", "ਗ੍ਰਿੰਥ", "ਗਰਿੰਥ"],
    category: "HALVANT_PAIRIN",
    explanationPa: "ਮਹਾਨ ਧਰਮ ਪੁਸਤਕ ਲਈ ‘ਗ੍ਰੰਥ’ ਸ਼ੁੱਧ ਰੂਪ ਹੈ।",
  },
  {
    id: "SPL-146",
    correct: "ਗ੍ਰਹਿ",
    incorrectVariations: ["ਗਰਹਿ", "ਗ੍ਰਿਹ", "ਗ੍ਰਹ"],
    category: "HALVANT_PAIRIN",
    explanationPa: "ਖ਼ਗੋਲੀ ਪਿੰਡ ਲਈ ਸ਼ੁੱਧ ਸ਼ਬਦ ‘ਗ੍ਰਹਿ’ ਹੈ।",
  },
  {
    id: "SPL-147",
    correct: "ਪ੍ਰਤੀਕ",
    incorrectVariations: ["ਪਰਤੀਕ", "ਪ੍ਰਤਿਕ", "ਪਰਤਿਕ"],
    category: "HALVANT_PAIRIN",
    explanationPa: "ਚਿੰਨ੍ਹ ਲਈ ਸ਼ੁੱਧ ਸ਼ਬਦ ‘ਪ੍ਰਤੀਕ’ ਹੈ।",
  },
  {
    id: "SPL-148",
    correct: "ਪ੍ਰਸੰਗ",
    incorrectVariations: ["ਪਰਸੰਗ", "ਪ੍ਰਸਂਗ", "ਪਰਸਂਗ"],
    category: "HALVANT_PAIRIN",
    explanationPa: "ਸੰਦਰਭ ਲਈ ਸ਼ੁੱਧ ਸ਼ਬਦ ‘ਪ੍ਰਸੰਗ’ ਹੈ।",
  },
  {
    id: "SPL-149",
    correct: "ਪ੍ਰਭਾਵ",
    incorrectVariations: ["ਪਰਭਾਵ", "ਪ੍ਰਭਾਉ", "ਪਰਭਾਉ"],
    category: "HALVANT_PAIRIN",
    explanationPa: "ਅਸਰ ਲਈ ਸ਼ੁੱਧ ਸ਼ਬਦ ‘ਪ੍ਰਭਾਵ’ ਹੈ।",
  },
  {
    id: "SPL-150",
    correct: "ਪ੍ਰਕਿਰਤੀ",
    incorrectVariations: ["ਪਰਕਿਰਤੀ", "ਪ੍ਰਕਿਰਤਿ", "ਪਰਕਿਰਤਿ"],
    category: "HALVANT_PAIRIN",
    explanationPa: "ਕੁਦਰਤ ਜਾਂ ਸੁਭਾਅ ਲਈ ‘ਪ੍ਰਕਿਰਤੀ’ ਸ਼ੁੱਧ ਹੈ।",
  },
  {
    id: "SPL-151",
    correct: "ਪ੍ਰਾਪਤ",
    incorrectVariations: ["ਪਰਾਪਤ", "ਪ੍ਰਾਪਿਤ", "ਪਰਾਪਿਤ"],
    category: "HALVANT_PAIRIN",
    explanationPa: "ਹਾਸਲ ਕਰਨ ਲਈ ਸ਼ੁੱਧ ਸ਼ਬਦ ‘ਪ੍ਰਾਪਤ’ ਹੈ।",
  },
  {
    id: "SPL-152",
    correct: "ਪ੍ਰਵੇਸ਼",
    incorrectVariations: ["ਪਰਵੇਸ਼", "ਪ੍ਰਵੇਸ", "ਪਰਵੇਸ"],
    category: "HALVANT_PAIRIN",
    explanationPa: "ਦਾਖ਼ਲੇ ਲਈ ਸ਼ੁੱਧ ਸ਼ਬਦ ‘ਪ੍ਰਵੇਸ਼’ ਹੈ।",
  },
  {
    id: "SPL-153",
    correct: "ਪ੍ਰਬੰਧ",
    incorrectVariations: ["ਪਰਬੰਧ", "ਪ੍ਰਬਂਧ", "ਪਰਬਂਧ"],
    category: "HALVANT_PAIRIN",
    explanationPa: "ਇੰਤਜ਼ਾਮ ਲਈ ਸ਼ੁੱਧ ਸ਼ਬਦ ‘ਪ੍ਰਬੰਧ’ ਹੈ।",
  },
  {
    id: "SPL-154",
    correct: "ਪ੍ਰਗਟ",
    incorrectVariations: ["ਪਰਗਟ", "ਪ੍ਰਗਟਿ", "ਪਰਗਟਿ"],
    category: "HALVANT_PAIRIN",
    explanationPa: "ਜ਼ਾਹਿਰ ਹੋਣ ਲਈ ਸ਼ੁੱਧ ਸ਼ਬਦ ‘ਪ੍ਰਗਟ’ ਹੈ।",
  },
  {
    id: "SPL-155",
    correct: "ਪ੍ਰਸਿੱਧ",
    incorrectVariations: ["ਪਰਸਿੱਧ", "ਪ੍ਰਸਿਧ", "ਪਰਸਿਧ"],
    category: "HALVANT_PAIRIN",
    explanationPa: "ਮਸ਼ਹੂਰ ਲਈ ਸ਼ੁੱਧ ਸ਼ਬਦ ‘ਪ੍ਰਸਿੱਧ’ ਹੈ।",
  },
  {
    id: "SPL-156",
    correct: "ਪ੍ਰਤੱਖ",
    incorrectVariations: ["ਪਰਤੱਖ", "ਪ੍ਰਤਖ", "ਪਰਤਖ"],
    category: "HALVANT_PAIRIN",
    explanationPa: "ਸਾਹਮਣੇ ਦਿਖਾਈ ਦੇਣ ਵਾਲੀ ਸੱਚਾਈ ਲਈ ‘ਪ੍ਰਤੱਖ’ ਸ਼ੁੱਧ ਹੈ।",
  },
  {
    id: "SPL-157",
    correct: "ਅੰਮ੍ਰਿਤ",
    incorrectVariations: ["ਅੰਮਿਰਤ", "ਅਮ੍ਰਿਤ", "ਅੰਮ੍ਰਿਤੁ"],
    category: "HALVANT_PAIRIN",
    explanationPa: "ਪਵਿੱਤਰ ਅੰਮ੍ਰਿਤ ਲਈ ‘ਅੰਮ੍ਰਿਤ’ (ਪੈਰੀਂ ਰਾਰਾ) ਸ਼ੁੱਧ ਹੈ।",
  },
  {
    id: "SPL-158",
    correct: "ਨਿਮਰਤਾ",
    incorrectVariations: ["ਨਮਰਤਾ", "ਨਿੰਮਰਤਾ", "ਨਿਮ੍ਰਤਾ"],
    category: "HALVANT_PAIRIN",
    explanationPa: "ਅਧੀਨਗੀ ਅਤੇ ਹਲੀਮੀ ਲਈ ‘ਨਿਮਰਤਾ’ ਸ਼ੁੱਧ ਸ਼ਬਦ-ਜੋੜ ਹੈ।",
  },
  {
    id: "SPL-159",
    correct: "ਕ੍ਰਿਪਾ",
    incorrectVariations: ["ਕਰਿਪਾ", "ਕਿਰਪਾ", "ਕ੍ਰਿਪਾਂ"],
    category: "HALVANT_PAIRIN",
    explanationPa: "ਦਇਆ ਜਾਂ ਮਿਹਰ ਲਈ ‘ਕ੍ਰਿਪਾ’ ਸ਼ੁੱਧ ਤਤਸਮ ਸ਼ਬਦ ਹੈ।",
  },
  {
    id: "SPL-160",
    correct: "ਤ੍ਰਿਕੋਣ",
    incorrectVariations: ["ਤਿਰਕੋਣ", "ਤ੍ਰਿਕੋਨ", "ਤਿਰਕੋਨ"],
    category: "HALVANT_PAIRIN",
    explanationPa: "ਤਿੰਨ ਕੋਣਾਂ ਵਾਲੀ ਆਕ੍ਰਿਤੀ ਲਈ ‘ਤ੍ਰਿਕੋਣ’ ਸ਼ੁੱਧ ਹੈ।",
  },
  {
    id: "SPL-161",
    correct: "ਤ੍ਰੈਲ",
    incorrectVariations: ["ਤਰੈਲ", "ਤ੍ਰੈਲ਼", "ਤ੍ਰੈਲਾ"],
    category: "HALVANT_PAIRIN",
    explanationPa: "ਤ੍ਰੇਲ/ਸ਼ਬਨਮ ਲਈ ‘ਤ੍ਰੈਲ’ ਸ਼ੁੱਧ ਸ਼ਬਦ ਹੈ।",
  },
  {
    id: "SPL-162",
    correct: "ਭ੍ਰਮ",
    incorrectVariations: ["ਭਰਮ", "ਭ੍ਰੱਮ", "ਭ੍ਰਿਮ"],
    category: "HALVANT_PAIRIN",
    explanationPa: "ਸ਼ੰਕੇ ਜਾਂ ਵਹਿਮ ਲਈ ਸ਼ੁੱਧ ਤਤਸਮ ਰੂਪ ‘ਭ੍ਰਮ’ ਹੈ।",
  },
  {
    id: "SPL-163",
    correct: "ਸ਼੍ਰੋਮਣੀ",
    incorrectVariations: ["ਸਰੋਮਣੀ", "ਸ਼੍ਰੋਮਨੀ", "ਸਰੋਮਨੀ"],
    category: "HALVANT_PAIRIN",
    explanationPa: "ਸਭ ਤੋਂ ਉੱਚੇ ਜਾਂ ਸਿਰਕੱਢ ਲਈ ‘ਸ਼੍ਰੋਮਣੀ’ ਸ਼ੁੱਧ ਸ਼ਬਦ ਹੈ।",
  },
  {
    id: "SPL-164",
    correct: "ਦ੍ਰਿਸ਼",
    incorrectVariations: ["ਦਰਿਸ਼", "ਦ੍ਰਿਸ", "ਦਰਿਸ"],
    category: "HALVANT_PAIRIN",
    explanationPa: "ਨਜ਼ਾਰੇ ਲਈ ‘ਦ੍ਰਿਸ਼’ ਸ਼ੁੱਧ ਹੈ।",
  },
  {
    id: "SPL-165",
    correct: "ਵਿੱਦਿਆ",
    incorrectVariations: ["ਵਿਦਿਆ", "ਵਿਦ੍ਯਾ", "ਵਿਦਿਯਾ"],
    category: "HALVANT_PAIRIN",
    explanationPa: "ਪੰਜਾਬੀ ਵਿੱਚ ਅੱਧਕ ਸਹਿਤ ‘ਵਿੱਦਿਆ’ ਮਿਆਰੀ ਟਕਸਾਲੀ ਰੂਪ ਹੈ।",
  },
  {
    id: "SPL-166",
    correct: "ਵਿਗਿਆਨ",
    incorrectVariations: ["ਵਿਗ੍ਯਾਨ", "ਵਿਗਿਯਾਨ", "ਵਿਗਯਾਨ"],
    category: "HALVANT_PAIRIN",
    explanationPa: "ਸਾਇੰਸ ਲਈ ਸ਼ੁੱਧ ਸ਼ਬਦ ‘ਵਿਗਿਆਨ’ ਹੈ।",
  },
  {
    id: "SPL-167",
    correct: "ਆਗਿਆ",
    incorrectVariations: ["ਆਗ੍ਯਾ", "ਆਗਿਯਾ", "ਅਗਿਆ"],
    category: "HALVANT_PAIRIN",
    explanationPa: "ਇਜਾਜ਼ਤ ਲਈ ਸ਼ੁੱਧ ਪੰਜਾਬੀ ਸ਼ਬਦ ‘ਆਗਿਆ’ ਹੈ।",
  },

  // --- TATSAM_TADBHAV (ਤਤਸਮ ਅਤੇ ਤਦਭਵ ਸ਼ਬਦ-ਜੋੜ) ---
  {
    id: "SPL-168",
    correct: "ਆਕਾਸ਼",
    incorrectVariations: ["ਅਕਾਸ਼", "ਅਕਾਸ", "ਆਕਾਸ"],
    category: "TATSAM_TADBHAV",
    explanationPa: "ਅੰਬਰ ਲਈ ਸ਼ੁੱਧ ਟਕਸਾਲੀ ਸ਼ਬਦ ‘ਆਕਾਸ਼’ ਹੈ।",
  },
  {
    id: "SPL-169",
    correct: "ਅਸਚਰਜ",
    incorrectVariations: ["ਅਸਚਰਜੁ", "ਅਸਚਰਜ਼", "ਅਸਚਰਚ"],
    category: "TATSAM_TADBHAV",
    explanationPa: "ਹੈਰਾਨੀ ਲਈ ਸ਼ੁੱਧ ਸ਼ਬਦ ‘ਅਸਚਰਜ’ ਹੈ।",
  },
  {
    id: "SPL-170",
    correct: "ਯੋਗ",
    incorrectVariations: ["ਜੋਗ", "ਯੋਗੁ", "ਯੌਗ"],
    category: "TATSAM_TADBHAV",
    explanationPa: "ਸਮਰੱਥਾ ਜਾਂ ਸਾਧਨਾ ਲਈ ਸ਼ੁੱਧ ਤਤਸਮ ਸ਼ਬਦ ‘ਯੋਗ’ ਹੈ।",
  },
  {
    id: "SPL-171",
    correct: "ਕਾਰਜ",
    incorrectVariations: ["ਕਾਜ", "ਕਾਰਜ਼", "ਕਾਰਜੁ"],
    category: "TATSAM_TADBHAV",
    explanationPa: "ਕੰਮ ਲਈ ਸ਼ੁੱਧ ਤਤਸਮ ਸ਼ਬਦ ‘ਕਾਰਜ’ ਹੈ।",
  },
  {
    id: "SPL-172",
    correct: "ਦੁੱਧ",
    incorrectVariations: ["ਦੁਗਧ", "ਦੁਧ", "ਦੂਧ"],
    category: "TATSAM_TADBHAV",
    explanationPa: "ਪੰਜਾਬੀ ਵਿੱਚ ਤਦਭਵ ਮਿਆਰੀ ਰੂਪ ‘ਦੁੱਧ’ (ਅੱਧਕ ਨਾਲ) ਸ਼ੁੱਧ ਹੈ।",
  },
  {
    id: "SPL-173",
    correct: "ਅੱਗ",
    incorrectVariations: ["ਅਗਨੀ", "ਅਗ", "ਆਗ"],
    category: "TATSAM_TADBHAV",
    explanationPa: "ਪੰਜਾਬੀ ਤਦਭਵ ਸ਼ੁੱਧ ਰੂਪ ‘ਅੱਗ’ ਹੈ।",
  },
  {
    id: "SPL-174",
    correct: "ਸੂਰਜ",
    incorrectVariations: ["ਸੂਰਯ", "ਸੁਰਜ", "ਸੂਰਜੁ"],
    category: "TATSAM_TADBHAV",
    explanationPa: "ਪੰਜਾਬੀ ਵਿੱਚ ਤਦਭਵ ਪ੍ਰਮਾਣਿਤ ਸ਼ਬਦ ‘ਸੂਰਜ’ ਹੈ।",
  },
  {
    id: "SPL-175",
    correct: "ਹੱਥ",
    incorrectVariations: ["ਹਸਤ", "ਹਥ", "ਹਾਥ"],
    category: "TATSAM_TADBHAV",
    explanationPa: "ਪੰਜਾਬੀ ਸ਼ੁੱਧ ਰੂਪ ‘ਹੱਥ’ (ਅੱਧਕ ਸਹਿਤ) ਹੈ।",
  },
  {
    id: "SPL-176",
    correct: "ਅੱਖ",
    incorrectVariations: ["ਅਕਸ਼ੀ", "ਅਖ", "ਆਂਖ"],
    category: "TATSAM_TADBHAV",
    explanationPa: "ਨੇਤਰ ਲਈ ਪੰਜਾਬੀ ਸ਼ੁੱਧ ਸ਼ਬਦ ‘ਅੱਖ’ ਹੈ।",
  },
  {
    id: "SPL-177",
    correct: "ਕੰਨ",
    incorrectVariations: ["ਕਰਣ", "ਕਨ", "ਕਾਂਨ"],
    category: "TATSAM_TADBHAV",
    explanationPa: "ਸ੍ਰਵਣ ਅੰਗ ਲਈ ਪੰਜਾਬੀ ਸ਼ੁੱਧ ਸ਼ਬਦ ‘ਕੰਨ’ (ਟਿੱਪੀ ਨਾਲ) ਹੈ।",
  },
  {
    id: "SPL-178",
    correct: "ਨੱਕ",
    incorrectVariations: ["ਨਾਸਿਕਾ", "ਨਕ", "ਨਾਕ"],
    category: "TATSAM_TADBHAV",
    explanationPa: "ਪੰਜਾਬੀ ਸ਼ੁੱਧ ਸ਼ਬਦ ‘ਨੱਕ’ ਹੈ।",
  },
  {
    id: "SPL-179",
    correct: "ਦੰਦ",
    incorrectVariations: ["ਦੰਤ", "ਦਂਦ", "ਦਾਂਤ"],
    category: "TATSAM_TADBHAV",
    explanationPa: "ਪੰਜਾਬੀ ਸ਼ੁੱਧ ਸ਼ਬਦ ‘ਦੰਦ’ (ਟਿੱਪੀ ਨਾਲ) ਹੈ।",
  },
  {
    id: "SPL-180",
    correct: "ਜੀਭ",
    incorrectVariations: ["ਜਿਹਵਾ", "ਜਿਭ", "ਜੀਬ"],
    category: "TATSAM_TADBHAV",
    explanationPa: "ਰਸਨਾ ਲਈ ਪੰਜਾਬੀ ਸ਼ੁੱਧ ਸ਼ਬਦ ‘ਜੀਭ’ ਹੈ।",
  },
  {
    id: "SPL-181",
    correct: "ਸੱਪ",
    incorrectVariations: ["ਸਰਪ", "ਸਪ", "ਸਾਂਪ"],
    category: "TATSAM_TADBHAV",
    explanationPa: "ਪੰਜਾਬੀ ਸ਼ੁੱਧ ਰੂਪ ‘ਸੱਪ’ (ਅੱਧਕ ਨਾਲ) ਹੈ।",
  },
  {
    id: "SPL-182",
    correct: "ਕਾਂ",
    incorrectVariations: ["ਕਾਕ", "ਕਾਗ", "ਕਾ"],
    category: "TATSAM_TADBHAV",
    explanationPa: "ਪੰਛੀ ਲਈ ਪੰਜਾਬੀ ਸ਼ੁੱਧ ਸ਼ਬਦ ‘ਕਾਂ’ (ਬਿੰਦੀ ਨਾਲ) ਹੈ।",
  },
  {
    id: "SPL-183",
    correct: "ਰਾਤ",
    incorrectVariations: ["ਰਾਤਰੀ", "ਰੈਣ", "ਰਾਤਿ"],
    category: "TATSAM_TADBHAV",
    explanationPa: "ਪੰਜਾਬੀ ਸ਼ੁੱਧ ਰੂਪ ‘ਰਾਤ’ ਹੈ।",
  },
  {
    id: "SPL-184",
    correct: "ਦਿਨ",
    incorrectVariations: ["ਦਿਵਸ", "ਦੀਨ", "ਦਿੰਨ"],
    category: "TATSAM_TADBHAV",
    explanationPa: "ਪੰਜਾਬੀ ਸ਼ੁੱਧ ਸ਼ਬਦ-ਜੋੜ ‘ਦਿਨ’ ਹੈ।",
  },
  {
    id: "SPL-185",
    correct: "ਪੰਛੀ",
    incorrectVariations: ["ਪਕਸ਼ੀ", "ਪਂਛੀ", "ਪਛੀ"],
    category: "TATSAM_TADBHAV",
    explanationPa: "ਪਰਿੰਦੇ ਲਈ ਪੰਜਾਬੀ ਸ਼ੁੱਧ ਸ਼ਬਦ ‘ਪੰਛੀ’ ਹੈ।",
  },
  {
    id: "SPL-186",
    correct: "ਮਿੱਤਰ",
    incorrectVariations: ["ਮੀਤ", "ਮਿਤਰ", "ਮਿਤ੍ਰ"],
    category: "TATSAM_TADBHAV",
    explanationPa: "ਦੋਸਤ ਲਈ ਸ਼ੁੱਧ ਟਕਸਾਲੀ ਸ਼ਬਦ ‘ਮਿੱਤਰ’ ਹੈ।",
  },
  {
    id: "SPL-187",
    correct: "ਭਾਈ",
    incorrectVariations: ["ਭਰਾਤਾ", "ਭਾਈਆ", "ਭਾਈਯਾ"],
    category: "TATSAM_TADBHAV",
    explanationPa: "ਵੀਰ ਲਈ ਪੰਜਾਬੀ ਸ਼ੁੱਧ ਸ਼ਬਦ ‘ਭਾਈ’ ਹੈ।",
  },
  {
    id: "SPL-188",
    correct: "ਘੋੜਾ",
    incorrectVariations: ["ਘੋਟਕ", "ਘੋਡ਼ਾ", "ਘੌੜਾ"],
    category: "TATSAM_TADBHAV",
    explanationPa: "ਜਾਨਵਰ ਲਈ ਸ਼ੁੱਧ ਪੰਜਾਬੀ ਸ਼ਬਦ ‘ਘੋੜਾ’ ਹੈ।",
  },
  {
    id: "SPL-189",
    correct: "ਗਾਂ",
    incorrectVariations: ["ਗਊ", "ਗਾਓ", "ਗਾ"],
    category: "TATSAM_TADBHAV",
    explanationPa: "ਪੰਜਾਬੀ ਸ਼ੁੱਧ ਸ਼ਬਦ ‘ਗਾਂ’ (ਬਿੰਦੀ ਸਹਿਤ) ਹੈ।",
  },
  {
    id: "SPL-190",
    correct: "ਪੱਥਰ",
    incorrectVariations: ["ਪ੍ਰਸਤਰ", "ਪਥਰ", "ਪਾਥਰ"],
    category: "TATSAM_TADBHAV",
    explanationPa: "ਪੰਜਾਬੀ ਸ਼ੁੱਧ ਰੂਪ ‘ਪੱਥਰ’ (ਅੱਧਕ ਨਾਲ) ਹੈ।",
  },
  {
    id: "SPL-191",
    correct: "ਲੋਹਾ",
    incorrectVariations: ["ਲੋਹ", "ਲੋਹਾਂ", "ਲੌਹਾ"],
    category: "TATSAM_TADBHAV",
    explanationPa: "ਧਾਤੂ ਲਈ ਪੰਜਾਬੀ ਸ਼ੁੱਧ ਸ਼ਬਦ ‘ਲੋਹਾ’ ਹੈ।",
  },
  {
    id: "SPL-192",
    correct: "ਸੋਨਾ",
    incorrectVariations: ["ਸਵਰਣ", "ਸੋਨਾਂ", "ਸੌਨਾ"],
    category: "TATSAM_TADBHAV",
    explanationPa: "ਕੀਮਤੀ ਧਾਤੂ ਲਈ ਸ਼ੁੱਧ ਸ਼ਬਦ ‘ਸੋਨਾ’ ਹੈ।",
  },
  {
    id: "SPL-193",
    correct: "ਚਾਂਦੀ",
    incorrectVariations: ["ਚਾਂਦਿ", "ਚਾਦੀ", "ਚਾਂਦੀਂ"],
    category: "TATSAM_TADBHAV",
    explanationPa: "ਧਾਤੂ ਲਈ ਸ਼ੁੱਧ ਸ਼ਬਦ ‘ਚਾਂਦੀ’ ਹੈ।",
  },
  {
    id: "SPL-194",
    correct: "ਤਾਂਬਾ",
    incorrectVariations: ["ਤਾਮਰ", "ਤਾਬਾ", "ਤਾਂਬਾਂ"],
    category: "TATSAM_TADBHAV",
    explanationPa: "ਧਾਤੂ ਲਈ ਪੰਜਾਬੀ ਸ਼ੁੱਧ ਸ਼ਬਦ ‘ਤਾਂਬਾ’ ਹੈ।",
  },
  {
    id: "SPL-195",
    correct: "ਸੱਚ",
    incorrectVariations: ["ਸੱਤਿਆ", "ਸਚ", "ਸਾਚ"],
    category: "TATSAM_TADBHAV",
    explanationPa: "ਸਤਿ ਲਈ ਪੰਜਾਬੀ ਸ਼ੁੱਧ ਸ਼ਬਦ ‘ਸੱਚ’ (ਅੱਧਕ ਨਾਲ) ਹੈ।",
  },
  {
    id: "SPL-196",
    correct: "ਝੂਠ",
    incorrectVariations: ["ਅਸੱਤਿਆ", "ਝੂਠੁ", "ਝੂਠਾ"],
    category: "TATSAM_TADBHAV",
    explanationPa: "ਅਸੱਤ ਲਈ ਸ਼ੁੱਧ ਸ਼ਬਦ ‘ਝੂਠ’ ਹੈ।",
  },
  {
    id: "SPL-197",
    correct: "ਕੰਮ",
    incorrectVariations: ["ਕਰਮ", "ਕਮ", "ਕਾਮ"],
    category: "TATSAM_TADBHAV",
    explanationPa: "ਕਾਰਜ ਲਈ ਪੰਜਾਬੀ ਸ਼ੁੱਧ ਤਦਭਵ ਰੂਪ ‘ਕੰਮ’ ਹੈ।",
  },
  {
    id: "SPL-198",
    correct: "ਗੁਰਮੁਖੀ",
    incorrectVariations: ["ਗੁਰਮੁਖਿ", "ਗੁਰਮੁੱਖੀ", "ਗੁਰਮੂਖੀ"],
    category: "TATSAM_TADBHAV",
    explanationPa: "ਪੰਜਾਬੀ ਲਿਪੀ ਦਾ ਸ਼ੁੱਧ ਮਿਆਰੀ ਨਾਮ ‘ਗੁਰਮੁਖੀ’ ਹੈ।",
  },
  {
    id: "SPL-199",
    correct: "ਪੰਜਾਬੀ",
    incorrectVariations: ["ਪਂਜਾਬੀ", "ਪੰਜਾਂਬੀ", "ਪੰਜਾਬਿ"],
    category: "TATSAM_TADBHAV",
    explanationPa: "ਸਾਡੀ ਮਾਂ-ਬੋਲੀ ਦਾ ਸ਼ੁੱਧ ਸ਼ਬਦ-ਜੋੜ ‘ਪੰਜਾਬੀ’ (ਟਿੱਪੀ ਨਾਲ) ਹੈ।",
  },
  {
    id: "SPL-200",
    correct: "ਸੰਸਕ੍ਰਿਤ",
    incorrectVariations: ["ਸੰਸਕ੍ਰਿਤਿ", "ਸੰਸਕਰਿਤ", "ਸਂਸਕ੍ਰਿਤ"],
    category: "TATSAM_TADBHAV",
    explanationPa: "ਪ੍ਰਾਚੀਨ ਭਾਸ਼ਾ ਦਾ ਸ਼ੁੱਧ ਸ਼ਬਦ-ਜੋੜ ‘ਸੰਸਕ੍ਰਿਤ’ ਹੈ।",
  }
];
