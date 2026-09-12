/**
 * CP009: Synonyms & Antonyms (ਸਮਾਨਾਰਥਕ ਅਤੇ ਵਿਰੋਧੀ ਸ਼ਬਦ)
 * High-yield curated vocabulary items for Punjab competitive exams.
 */

export interface SynonymSet {
  readonly id: string;
  readonly headword: string;
  readonly primarySynonym: string;
  readonly otherSynonyms: readonly string[];
  readonly distractors: readonly string[];
  readonly explanationPa: string;
}

export const SYNONYM_SETS: readonly SynonymSet[] = [
  {
    id: "SYN-001",
    headword: "ਉੱਤਮ",
    primarySynonym: "ਸ਼੍ਰੇਸ਼ਠ",
    otherSynonyms: ["ਵਧੀਆ", "ਆਲਾ", "ਚੰਗਾ"],
    distractors: ["ਮੰਦਾ", "ਨੀਵਾਂ", "ਸਧਾਰਨ", "ਕਮਜ਼ੋਰ"],
    explanationPa: "‘ਉੱਤਮ’ ਦਾ ਸਮਾਨਾਰਥਕ ਸ਼ਬਦ ‘ਸ਼੍ਰੇਸ਼ਠ’ (ਸਭ ਤੋਂ ਵਧੀਆ) ਹੁੰਦਾ ਹੈ।",
  },
  {
    id: "SYN-002",
    headword: "ਆਜ਼ਾਦੀ",
    primarySynonym: "ਸੁਤੰਤਰਤਾ",
    otherSynonyms: ["ਮੁਕਤੀ", "ਖ਼ੁਦਮੁਖ਼ਤਿਆਰੀ"],
    distractors: ["ਗ਼ੁਲਾਮੀ", "ਕੈਦ", "ਬੰਧਨ", "ਜ਼ੁਲਮ"],
    explanationPa: "‘ਆਜ਼ਾਦੀ’ ਦਾ ਸ਼ੁੱਧ ਸਮਾਨਾਰਥਕ ਸ਼ਬਦ ‘ਸੁਤੰਤਰਤਾ’ ਹੈ। ਗ਼ੁਲਾਮੀ ਇਸ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ਹੈ।",
  },
  {
    id: "SYN-003",
    headword: "ਨਿਰਮਲ",
    primarySynonym: "ਪਵਿੱਤਰ",
    otherSynonyms: ["ਸਾਫ਼", "ਸੁਥਰਾ", "ਸਵੱਛ"],
    distractors: ["ਮੈਲਾ", "ਗੰਦਾ", "ਕਾਲਾ", "ਮਲੀਨ"],
    explanationPa: "‘ਨਿਰਮਲ’ ਦਾ ਅਰਥ ਮੈਲ ਤੋਂ ਰਹਿਤ ਭਾਵ ‘ਪਵਿੱਤਰ’ ਜਾਂ ਸਾਫ਼ ਹੁੰਦਾ ਹੈ।",
  },
  {
    id: "SYN-004",
    headword: "ਬਹਾਦਰ",
    primarySynonym: "ਸੂਰਬੀਰ",
    otherSynonyms: ["ਦਲੇਰ", "ਯੋਧਾ", "ਨਿਡਰ"],
    distractors: ["ਡਰਪੋਕ", "ਕਾਇਰ", "ਕਮਜ਼ੋਰ", "ਲਾਚਾਰ"],
    explanationPa: "‘ਬਹਾਦਰ’ ਅਤੇ ‘ਸੂਰਬੀਰ’ ਸਮਾਨਾਰਥਕ ਸ਼ਬਦ ਹਨ। ਕਾਇਰ ਇਸ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ਹੈ।",
  },
  {
    id: "SYN-005",
    headword: "ਹੰਕਾਰ",
    primarySynonym: "ਘਮੰਡ",
    otherSynonyms: ["ਆਕੜ", "ਗ਼ਰੂਰ"],
    distractors: ["ਨਿਮਰਤਾ", "ਸਹਿਜ", "ਸਤਿਕਾਰ", "ਪਿਆਰ"],
    explanationPa: "‘ਹੰਕਾਰ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਘਮੰਡ’ ਹੁੰਦਾ ਹੈ। ਨਿਮਰਤਾ ਇਸ ਦਾ ਉਲਟ-ਭਾਵੀ (ਵਿਰੋਧੀ) ਸ਼ਬਦ ਹੈ।",
  },
  {
    id: "SYN-006",
    headword: "ਅਮੀਰ",
    primarySynonym: "ਦੌਲਤਮੰਦ",
    otherSynonyms: ["ਧਨਾਢ", "ਮਾਲਦਾਰ", "ਸੰਪੰਨ"],
    distractors: ["ਗ਼ਰੀਬ", "ਕੰਗਾਲ", "ਭਿਖਾਰੀ", "ਮੰਗਤਾ"],
    explanationPa: "‘ਅਮੀਰ’ ਦਾ ਸਮਾਨਾਰਥਕ ਸ਼ਬਦ ‘ਦੌਲਤਮੰਦ’ ਜਾਂ ‘ਧਨਾਢ’ ਹੈ। ਗ਼ਰੀਬ ਇਸ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ਹੈ।",
  },
  {
    id: "SYN-007",
    headword: "ਦੋਸਤ",
    primarySynonym: "ਮਿੱਤਰ",
    otherSynonyms: ["ਸੱਜਣ", "ਬੇਲੀ", "ਯਾਰ"],
    distractors: ["ਦੁਸ਼ਮਣ", "ਵੈਰੀ", "ਵਿਰੋਧੀ", "ਅਣਜਾਣ"],
    explanationPa: "‘ਦੋਸਤ’ ਅਤੇ ‘ਮਿੱਤਰ’ ਸਮਾਨਾਰਥਕ ਸ਼ਬਦ ਹਨ। ਦੁਸ਼ਮਣ ਇਸ ਦਾ ਉਲਟ-ਭਾਵੀ ਸ਼ਬਦ ਹੈ।",
  },
  {
    id: "SYN-008",
    headword: "ਧਰਤੀ",
    primarySynonym: "ਜ਼ਮੀਨ",
    otherSynonyms: ["ਭੂਮੀ", "ਪ੍ਰਿਥਵੀ", "ਵਸੁੰਧਰਾ"],
    distractors: ["ਅਕਾਸ਼", "ਅੰਬਰ", "ਬੱਦਲ", "ਤਾਰੇ"],
    explanationPa: "‘ਧਰਤੀ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਜ਼ਮੀਨ’ ਜਾਂ ‘ਭੂਮੀ’ ਹੁੰਦਾ ਹੈ।",
  },
  {
    id: "SYN-009",
    headword: "ਕਿਰਪਾ",
    primarySynonym: "ਮਿਹਰ",
    otherSynonyms: ["ਦਇਆ", "ਬਖ਼ਸ਼ਿਸ਼", "ਰਹਿਮਤ"],
    distractors: ["ਗੁੱਸਾ", "ਕਹਿਰ", "ਸਜ਼ਾ", "ਬਦਲਾ"],
    explanationPa: "‘ਕਿਰਪਾ’ ਦਾ ਸਹੀ ਸਮਾਨਾਰਥਕ ‘ਮਿਹਰ’ ਜਾਂ ‘ਦਇਆ’ ਹੈ।",
  },
  {
    id: "SYN-010",
    headword: "ਚਾਨਣ",
    primarySynonym: "ਰੌਸ਼ਨੀ",
    otherSynonyms: ["ਪ੍ਰਕਾਸ਼", "ਉਜਾਲਾ", "ਜੋਤ"],
    distractors: ["ਹਨੇਰਾ", "ਕਾਲਖ", "ਧੁੰਦ", "ਰਾਤ"],
    explanationPa: "‘ਚਾਨਣ’ ਦਾ ਸਮਾਨਾਰਥਕ ਸ਼ਬਦ ‘ਰੌਸ਼ਨੀ’ ਹੈ। ਹਨੇਰਾ ਇਸ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ਹੈ।",
  },
  {
    id: "SYN-011",
    headword: "ਜੰਗ",
    primarySynonym: "ਯੁੱਧ",
    otherSynonyms: ["ਲੜਾਈ", "ਰਣ", "ਸੰਗਰਾਮ"],
    distractors: ["ਅਮਨ", "ਸ਼ਾਂਤੀ", "ਸਮਝੌਤਾ", "ਦੋਸਤੀ"],
    explanationPa: "‘ਜੰਗ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਯੁੱਧ’ ਹੈ। ਅਮਨ ਜਾਂ ਸ਼ਾਂਤੀ ਇਸ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ਹੈ।",
  },
  {
    id: "SYN-012",
    headword: "ਪਾਣੀ",
    primarySynonym: "ਜਲ",
    otherSynonyms: ["ਨੀਰ", "ਆਬ"],
    distractors: ["ਅੱਗ", "ਹਵਾ", "ਮਿੱਟੀ", "ਧੂੰਆਂ"],
    explanationPa: "‘ਪਾਣੀ’ ਦਾ ਸ਼ੁੱਧ ਸਮਾਨਾਰਥਕ ‘ਜਲ’ (ਜਾਂ ਨੀਰ) ਹੁੰਦਾ ਹੈ।",
  },
  {
    id: "SYN-013",
    headword: "ਅਸਮਾਨ",
    primarySynonym: "ਅਕਾਸ਼",
    otherSynonyms: ["ਗਗਨ", "ਅੰਬਰ", "ਫ਼ਲਕ"],
    distractors: ["ਧਰਤੀ", "ਪਤਾਲ", "ਜ਼ਮੀਨ", "ਸਾਗਰ"],
    explanationPa: "‘ਅਸਮਾਨ’ ਦਾ ਸਮਾਨਾਰਥਕ ਸ਼ਬਦ ‘ਅਕਾਸ਼’ ਜਾਂ ‘ਅੰਬਰ’ ਹੈ।",
  },
  {
    id: "SYN-014",
    headword: "ਅਧਿਆਪਕ",
    primarySynonym: "ਉਸਤਾਦ",
    otherSynonyms: ["ਗੁਰੂ", "ਸਿੱਖਿਅਕ", "ਮਾਸਟਰ"],
    distractors: ["ਵਿਦਿਆਰਥੀ", "ਚੇਲਾ", "ਸਿੱਖਿਆਰਥੀ", "ਪਾਠਕ"],
    explanationPa: "‘ਅਧਿਆਪਕ’ ਦਾ ਸਮਾਨਾਰਥੀ ਸ਼ਬਦ ‘ਉਸਤਾਦ’ ਜਾਂ ‘ਸਿੱਖਿਅਕ’ ਹੁੰਦਾ ਹੈ।",
  },
  {
    id: "SYN-015",
    headword: "ਇਮਾਨਦਾਰ",
    primarySynonym: "ਨੇਕਚਲਣ",
    otherSynonyms: ["ਸੱਚਾ", "ਧਰਮੀ", "ਦਿਆਨਤਦਾਰ"],
    distractors: ["ਬੇਈਮਾਨ", "ਠੱਗ", "ਚੋਰ", "ਦਗ਼ਾਬਾਜ਼"],
    explanationPa: "‘ਇਮਾਨਦਾਰ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਨੇਕਚਲਣ’ ਜਾਂ ‘ਦਿਆਨਤਦਾਰ’ ਹੈ।",
  },
  {
    id: "SYN-016",
    headword: "ਉੱਦਮ",
    primarySynonym: "ਉਪਰਾਲਾ",
    otherSynonyms: ["ਯਤਨ", "ਕੋਸ਼ਿਸ਼", "ਮੁਸ਼ੱਕਤ"],
    distractors: ["ਆਲਸ", "ਸੁਸਤੀ", "ਢਿੱਲ", "ਲਾਪਰਵਾਹੀ"],
    explanationPa: "‘ਉੱਦਮ’ ਦਾ ਸਮਾਨਾਰਥਕ ਸ਼ਬਦ ‘ਉਪਰਾਲਾ’ ਜਾਂ ‘ਯਤਨ’ ਹੈ।",
  },
  {
    id: "SYN-017",
    headword: "ਕ੍ਰੋਧ",
    primarySynonym: "ਗੁੱਸਾ",
    otherSynonyms: ["ਰੋਹ", "ਤੈਸ਼", "ਨਾਰਾਜ਼ਗੀ"],
    distractors: ["ਸ਼ਾਂਤੀ", "ਖਿਮਾ", "ਪਿਆਰ", "ਧੀਰਜ"],
    explanationPa: "‘ਕ੍ਰੋਧ’ ਦਾ ਸਮਾਨਾਰਥਕ ਸ਼ਬਦ ‘ਗੁੱਸਾ’ ਜਾਂ ‘ਰੋਹ’ ਹੁੰਦਾ ਹੈ।",
  },
  {
    id: "SYN-018",
    headword: "ਘਰ",
    primarySynonym: "ਮਕਾਨ",
    otherSynonyms: ["ਗ੍ਰਹਿ", "ਨਿਵਾਸ", "ਆਵਾਸ"],
    distractors: ["ਦਫ਼ਤਰ", "ਬਾਜ਼ਾਰ", "ਸੜਕ", "ਜੰਗਲ"],
    explanationPa: "‘ਘਰ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਮਕਾਨ’ ਜਾਂ ‘ਨਿਵਾਸ’ ਹੁੰਦਾ ਹੈ।",
  },
  {
    id: "SYN-019",
    headword: "ਜੰਗਲ",
    primarySynonym: "ਬਨ",
    otherSynonyms: ["ਕਾਨਨ", "ਬੀਆਬਾਨ", "ਅਰੰਨ"],
    distractors: ["ਸ਼ਹਿਰ", "ਬਸਤੀ", "ਪਿੰਡ", "ਨਗਰ"],
    explanationPa: "‘ਜੰਗਲ’ ਦਾ ਸ਼ੁੱਧ ਸਮਾਨਾਰਥਕ ‘ਬਨ’ ਜਾਂ ‘ਕਾਨਨ’ ਹੈ।",
  },
  {
    id: "SYN-020",
    headword: "ਤਲਵਾਰ",
    primarySynonym: "ਕਿਰਪਾਨ",
    otherSynonyms: ["ਖੜਗ", "ਸ਼ਮਸ਼ੀਰ", "ਤੇਗ਼"],
    distractors: ["ਢਾਲ", "ਤੀਰ", "ਨੇਜ਼ਾ", "ਬੰਦੂਕ"],
    explanationPa: "‘ਤਲਵਾਰ’ ਦਾ ਸ਼ੁੱਧ ਸਮਾਨਾਰਥਕ ‘ਕਿਰਪਾਨ’ ਜਾਂ ‘ਤੇਗ਼’ ਹੁੰਦਾ ਹੈ।",
  },
  {
    id: "SYN-021",
    headword: "ਨਦੀ",
    primarySynonym: "ਦਰਿਆ",
    otherSynonyms: ["ਸਰਿਤਾ", "ਤਰੰਗਿਣੀ"],
    distractors: ["ਸਮੁੰਦਰ", "ਝੀਲ", "ਛੱਪੜ", "ਖੂਹ"],
    explanationPa: "‘ਨਦੀ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਦਰਿਆ’ ਜਾਂ ‘ਸਰਿਤਾ’ ਹੁੰਦਾ ਹੈ।",
  },
  {
    id: "SYN-022",
    headword: "ਪੰਛੀ",
    primarySynonym: "ਪਰਿੰਦਾ",
    otherSynonyms: ["ਪੰਖੇਰੂ", "ਖ਼ਗ"],
    distractors: ["ਜਾਨਵਰ", "ਮੱਛੀ", "ਕੀੜਾ", "ਚੌਪਾਇਆ"],
    explanationPa: "‘ਪੰਛੀ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਪਰਿੰਦਾ’ ਜਾਂ ‘ਪੰਖੇਰੂ’ ਹੈ।",
  },
  {
    id: "SYN-023",
    headword: "ਫੁੱਲ",
    primarySynonym: "ਪੁਸ਼ਪ",
    otherSynonyms: ["ਸੁਮਨ", "ਕੁਸੁਮ", "ਗੁਲ"],
    distractors: ["ਕੰਡਾ", "ਪੱਤਾ", "ਟਹਿਣੀ", "ਜੜ੍ਹ"],
    explanationPa: "‘ਫੁੱਲ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਪੁਸ਼ਪ’ ਜਾਂ ‘ਸੁਮਨ’ ਹੁੰਦਾ ਹੈ।",
  },
  {
    id: "SYN-024",
    headword: "ਰਾਤ",
    primarySynonym: "ਰੈਣ",
    otherSynonyms: ["ਨਿਸਾ", "ਸ਼ਬ"],
    distractors: ["ਦਿਨ", "ਸਵੇਰ", "ਦੁਪਹਿਰ", "ਸ਼ਾਮ"],
    explanationPa: "‘ਰਾਤ’ ਦਾ ਸਮਾਨਾਰਥਕ ਸ਼ਬਦ ‘ਰੈਣ’ ਜਾਂ ‘ਨਿਸਾ’ ਹੈ।",
  },
  {
    id: "SYN-025",
    headword: "ਸੂਰਜ",
    primarySynonym: "ਦਿਨਕਰ",
    otherSynonyms: ["ਭਾਨੂ", "ਸੂਰਜ", "ਆਦਿੱਤ"],
    distractors: ["ਚੰਦਰਮਾ", "ਤਾਰਾ", "ਬੱਦਲ", "ਹਨੇਰਾ"],
    explanationPa: "‘ਸੂਰਜ’ ਦਾ ਸਮਾਨਾਰਥਕ ਸ਼ਬਦ ‘ਦਿਨਕਰ’ ਜਾਂ ‘ਭਾਨੂ’ ਹੁੰਦਾ ਹੈ।",
  },
  {
    id: "SYN-026",
    headword: "ਚੰਦਰਮਾ",
    primarySynonym: "ਚੰਨ",
    otherSynonyms: ["ਸ਼ਸ਼ੀ", "ਮਹਿਤਾਬ", "ਰਾਕੇਸ਼"],
    distractors: ["ਸੂਰਜ", "ਧੁੱਪ", "ਦਿਨ", "ਅੱਗ"],
    explanationPa: "‘ਚੰਦਰਮਾ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਚੰਨ’ ਜਾਂ ‘ਸ਼ਸ਼ੀ’ ਹੈ।",
  },
  {
    id: "SYN-027",
    headword: "ਸੁੰਦਰ",
    primarySynonym: "ਮਨਮੋਹਕ",
    otherSynonyms: ["ਸੋਹਣਾ", "ਖ਼ੂਬਸੂਰਤ", "ਦਿਲਕਸ਼"],
    distractors: ["ਬਦਸੂਰਤ", "ਕਰੂਪ", "ਭੱਦਾ", "ਮੈਲਾ"],
    explanationPa: "‘ਸੁੰਦਰ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਮਨਮੋਹਕ’ ਜਾਂ ‘ਸੋਹਣਾ’ ਹੈ।",
  },
  {
    id: "SYN-028",
    headword: "ਖ਼ੁਸ਼ੀ",
    primarySynonym: "ਪ੍ਰਸੰਨਤਾ",
    otherSynonyms: ["ਅਨੰਦ", "ਹੁਲਾਸ", "ਖੇੜਾ"],
    distractors: ["ਗ਼ਮ", "ਸੋਗ", "ਦੁੱਖ", "ਉਦਾਸੀ"],
    explanationPa: "‘ਖ਼ੁਸ਼ੀ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਪ੍ਰਸੰਨਤਾ’ ਜਾਂ ‘ਅਨੰਦ’ ਹੈ।",
  },
  {
    id: "SYN-029",
    headword: "ਅਕਲ",
    primarySynonym: "ਬੁੱਧੀ",
    otherSynonyms: ["ਸਮਝ", "ਮੱਤ", "ਦਾਨਾਈ"],
    distractors: ["ਮੂਰਖਤਾ", "ਅਗਿਆਨ", "ਬੇਸਮਝੀ", "ਭੁੱਲ"],
    explanationPa: "‘ਅਕਲ’ ਦਾ ਸਮਾਨਾਰਥਕ ਸ਼ਬਦ ‘ਬੁੱਧੀ’ ਜਾਂ ‘ਸਮਝ’ ਹੈ।",
  },
  {
    id: "SYN-030",
    headword: "ਕਾਇਰ",
    primarySynonym: "ਡਰਪੋਕ",
    otherSynonyms: ["ਬੁਜ਼ਦਿਲ", "ਕੱਚਾ"],
    distractors: ["ਬਹਾਦਰ", "ਸੂਰਮਾ", "ਦਲੇਰ", "ਯੋਧਾ"],
    explanationPa: "‘ਕਾਇਰ’ ਦਾ ਸਮਾਨਾਰਥਕ ਸ਼ਬਦ ‘ਡਰਪੋਕ’ ਜਾਂ ‘ਬੁਜ਼ਦਿਲ’ ਹੈ।",
  },
  {
    id: "SYN-031",
    headword: "ਅਨਾਦਰ",
    primarySynonym: "ਬੇਇੱਜ਼ਤੀ",
    otherSynonyms: ["ਤੌਹੀਨ", "ਹੱਤਕ", "ਨਿਰਾਦਰ"],
    distractors: ["ਸਤਿਕਾਰ", "ਮਾਣ", "ਇੱਜ਼ਤ", "ਆਦਰ"],
    explanationPa: "‘ਅਨਾਦਰ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਬੇਇੱਜ਼ਤੀ’ ਜਾਂ ‘ਤੌਹੀਨ’ ਹੈ।",
  },
  {
    id: "SYN-032",
    headword: "ਗਿਆਨ",
    primarySynonym: "ਵਿੱਦਿਆ",
    otherSynonyms: ["ਸੋਝੀ", "ਬੋਧ", "ਇਲਮ"],
    distractors: ["ਅਗਿਆਨ", "ਭਰਮ", "ਵਹਿਮ", "ਹਨੇਰਾ"],
    explanationPa: "‘ਗਿਆਨ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਵਿੱਦਿਆ’ ਜਾਂ ‘ਸੋਝੀ’ ਹੁੰਦਾ ਹੈ।",
  },
  {
    id: "SYN-033",
    headword: "ਵੈਰੀ",
    primarySynonym: "ਸ਼ਤਰੂ",
    otherSynonyms: ["ਦੁਸ਼ਮਣ", "ਹਰੀਫ਼", "ਵਿਰੋਧੀ"],
    distractors: ["ਮਿੱਤਰ", "ਦੋਸਤ", "ਸੱਜਣ", "ਹਿਤੈਸ਼ੀ"],
    explanationPa: "‘ਵੈਰੀ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਸ਼ਤਰੂ’ ਜਾਂ ‘ਦੁਸ਼ਮਣ’ ਹੈ।",
  },
  {
    id: "SYN-034",
    headword: "ਸਬਰ",
    primarySynonym: "ਸੰਤੋਖ",
    otherSynonyms: ["ਧੀਰਜ", "ਠਰੰਮਾ", "ਹੌਸਲਾ"],
    distractors: ["ਲਾਲਚ", "ਲੋਭ", "ਬੇਸਬਰੀ", "ਕਾਹਲ"],
    explanationPa: "‘ਸਬਰ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਸੰਤੋਖ’ ਜਾਂ ‘ਧੀਰਜ’ ਹੈ।",
  },
  {
    id: "SYN-035",
    headword: "ਪ੍ਰਸਿੱਧ",
    primarySynonym: "ਮਸ਼ਹੂਰ",
    otherSynonyms: ["ਨਾਮੀ", "ਜਾਣਿਆ-ਪਛਾਣਿਆ", "ਮਕਬੂਲ"],
    distractors: ["ਗੁਮਨਾਮ", "ਅਣਜਾਣ", "ਛੁਪਿਆ", "ਆਮ"],
    explanationPa: "‘ਪ੍ਰਸਿੱਧ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਮਸ਼ਹੂਰ’ ਜਾਂ ‘ਮਕਬੂਲ’ ਹੁੰਦਾ ਹੈ।",
  },
  {
    id: "SYN-036",
    headword: "ਸੰਸਾਰ",
    primarySynonym: "ਜਗਤ",
    otherSynonyms: ["ਦੁਨੀਆ", "ਜਹਾਨ", "ਆਲਮ"],
    distractors: ["ਘਰ", "ਕਮਰਾ", "ਪਿੰਡ", "ਇਲਾਕਾ"],
    explanationPa: "‘ਸੰਸਾਰ’ ਦਾ ਸਮਾਨਾਰਥਕ ਸ਼ਬਦ ‘ਜਗਤ’ ਜਾਂ ‘ਦੁਨੀਆ’ ਹੈ।",
  },
  {
    id: "SYN-037",
    headword: "ਅੱਖ",
    primarySynonym: "ਨੇਤਰ",
    otherSynonyms: ["ਲੋਚਨ","ਦੀਦੇ","ਨੈਣ"],
    distractors: ["ਕੰਨ","ਨੱਕ","ਮੱਥਾ","ਹੱਥ"],
    explanationPa: "‘ਅੱਖ’ ਦਾ ਸ਼ੁੱਧ ਸਮਾਨਾਰਥਕ ਸ਼ਬਦ ‘ਨੇਤਰ’ ਜਾਂ ‘ਲੋਚਨ’ ਹੁੰਦਾ ਹੈ।",
  },
  {
    id: "SYN-038",
    headword: "ਕੰਨਿਆ",
    primarySynonym: "ਕੁੜੀ",
    otherSynonyms: ["ਬਾਲਕੀ","ਲੜਕੀ","ਬੱਚੀ"],
    distractors: ["ਮੁੰਡਾ","ਬੁੱਢਾ","ਆਦਮੀ","ਔਰਤ"],
    explanationPa: "‘ਕੰਨਿਆ’ ਦਾ ਸਮਾਨਾਰਥਕ ਸ਼ਬਦ ‘ਕੁੜੀ’ ਜਾਂ ਲੜਕੀ ਹੈ।",
  },
  {
    id: "SYN-039",
    headword: "ਕਾਮਯਾਬੀ",
    primarySynonym: "ਸਫ਼ਲਤਾ",
    otherSynonyms: ["ਜਿੱਤ","ਫ਼ਤਹਿ","ਕਾਮਰਾਨੀ"],
    distractors: ["ਹਾਰ","ਨਾਕਾਮੀ","ਅਸਫ਼ਲਤਾ","ਢੇਰੀ"],
    explanationPa: "‘ਕਾਮਯਾਬੀ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਸਫ਼ਲਤਾ’ ਹੈ।",
  },
  {
    id: "SYN-040",
    headword: "ਕਾਇਰ",
    primarySynonym: "ਡਰਪੋਕ",
    otherSynonyms: ["ਬੁਜ਼ਦਿਲ","ਕਮਦਿਲ"],
    distractors: ["ਸੂਰਬੀਰ","ਦਲੇਰ","ਬਹਾਦਰ","ਨਿਡਰ"],
    explanationPa: "‘ਕਾਇਰ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਡਰਪੋਕ’ ਹੈ। ਬਹਾਦਰ ਇਸ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ਹੈ।",
  },
  {
    id: "SYN-041",
    headword: "ਚਾਨਣ",
    primarySynonym: "ਰੌਸ਼ਨੀ",
    otherSynonyms: ["ਉਜਾਲਾ","ਪ੍ਰਕਾਸ਼","ਜੋਤ"],
    distractors: ["ਹਨੇਰਾ","ਕਾਲਖ਼","ਛਾਂ","ਧੁੰਦ"],
    explanationPa: "‘ਚਾਨਣ’ ਦਾ ਸਮਾਨਾਰਥਕ ਸ਼ਬਦ ‘ਰੌਸ਼ਨੀ’ ਜਾਂ ਉਜਾਲਾ ਹੈ।",
  },
  {
    id: "SYN-042",
    headword: "ਹਨੇਰਾ",
    primarySynonym: "ਅੰਧਕਾਰ",
    otherSynonyms: ["ਕਾਲਖ਼","ਤਿਮਰ","ਧੁੰਦਲਕਾ"],
    distractors: ["ਚਾਨਣ","ਰੌਸ਼ਨੀ","ਧੁੱਪ","ਉਜਾਲਾ"],
    explanationPa: "‘ਹਨੇਰਾ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਅੰਧਕਾਰ’ ਹੈ।",
  },
  {
    id: "SYN-043",
    headword: "ਦੁਸ਼ਮਣ",
    primarySynonym: "ਵੈਰੀ",
    otherSynonyms: ["ਸ਼ਤਰੂ","ਮੁਖ਼ਾਲਿਫ਼","ਵਿਰੋਧੀ"],
    distractors: ["ਮਿੱਤਰ","ਦੋਸਤ","ਸਾਥੀ","ਭਰਾ"],
    explanationPa: "‘ਦੁਸ਼ਮਣ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਵੈਰੀ’ ਜਾਂ ਸ਼ਤਰੂ ਹੈ।",
  },
  {
    id: "SYN-044",
    headword: "ਮਿੱਤਰ",
    primarySynonym: "ਦੋਸਤ",
    otherSynonyms: ["ਸੱਜਣ","ਯਾਰ","ਬੇਲੀ","ਸਾਥੀ"],
    distractors: ["ਵੈਰੀ","ਦੁਸ਼ਮਣ","ਸ਼ਤਰੂ","ਬੇਗ਼ਾਨਾ"],
    explanationPa: "‘ਮਿੱਤਰ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਦੋਸਤ’ ਜਾਂ ਸੱਜਣ ਹੈ।",
  },
  {
    id: "SYN-045",
    headword: "ਦੁੱਖ",
    primarySynonym: "ਕਲੇਸ਼",
    otherSynonyms: ["ਪੀੜਾ","ਦਰਦ","ਸੰਤਾਪ","ਕਸ਼ਟ"],
    distractors: ["ਸੁੱਖ","ਆਨੰਦ","ਖ਼ੁਸ਼ੀ","ਚੈਨ"],
    explanationPa: "‘ਦੁੱਖ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਕਲੇਸ਼’ ਜਾਂ ਪੀੜਾ ਹੈ।",
  },
  {
    id: "SYN-046",
    headword: "ਸੁੱਖ",
    primarySynonym: "ਆਨੰਦ",
    otherSynonyms: ["ਚੈਨ","ਅਰਾਮ","ਪ੍ਰਸੰਨਤਾ","ਰਹਿਮਤ"],
    distractors: ["ਦੁੱਖ","ਦਰਦ","ਕਲੇਸ਼","ਪੀੜਾ"],
    explanationPa: "‘ਸੁੱਖ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਆਨੰਦ’ ਜਾਂ ਚੈਨ ਹੈ।",
  },
  {
    id: "SYN-047",
    headword: "ਕਿਰਪਾ",
    primarySynonym: "ਮਿਹਰ",
    otherSynonyms: ["ਰਹਿਮਤ","ਬਖ਼ਸ਼ਿਸ਼","ਦਇਆ"],
    distractors: ["ਕਰੋਪੀ","ਗ਼ੁੱਸਾ","ਸਜ਼ਾ","ਨਾਰਾਜ਼ਗੀ"],
    explanationPa: "‘ਕਿਰਪਾ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਮਿਹਰ’ ਜਾਂ ਰਹਿਮਤ ਹੈ।",
  },
  {
    id: "SYN-048",
    headword: "ਸੂਰਜ",
    primarySynonym: "ਦਿਨਕਰ",
    otherSynonyms: ["ਭਾਨੂੰ","ਆਫ਼ਤਾਬ","ਰਵੀ","ਸੂਰਯ"],
    distractors: ["ਚੰਨ","ਤਾਰਾ","ਰਾਤ","ਬੱਦਲ"],
    explanationPa: "‘ਸੂਰਜ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਦਿਨਕਰ’ ਜਾਂ ਭਾਨੂੰ ਹੈ।",
  },
  {
    id: "SYN-049",
    headword: "ਚੰਦਰਮਾ",
    primarySynonym: "ਚੰਨ",
    otherSynonyms: ["ਮਾਹਤਾਬ","ਸ਼ਸ਼ੀ","ਰਾਕੇਸ਼"],
    distractors: ["ਸੂਰਜ","ਧੁੱਪ","ਅੱਗ","ਤਾਰਾ"],
    explanationPa: "‘ਚੰਦਰਮਾ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਚੰਨ’ ਜਾਂ ਮਾਹਤਾਬ ਹੈ।",
  },
  {
    id: "SYN-050",
    headword: "ਬੱਦਲ",
    primarySynonym: "ਮੇਘ",
    otherSynonyms: ["ਘਟਾ","ਜਲਧਰ","ਅਬਰ"],
    distractors: ["ਧੁੱਪ","ਰੇਗਿਸਤਾਨ","ਅੱਗ","ਤਾਰੇ"],
    explanationPa: "‘ਬੱਦਲ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਮੇਘ’ ਜਾਂ ਘਟਾ ਹੈ।",
  },
  {
    id: "SYN-051",
    headword: "ਪਾਣੀ",
    primarySynonym: "ਜਲ",
    otherSynonyms: ["ਨੀਰ","ਆਬ","ਵਾਰੀ"],
    distractors: ["ਅੱਗ","ਧੂੜ","ਪੱਥਰ","ਹਵਾ"],
    explanationPa: "‘ਪਾਣੀ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਜਲ’ ਜਾਂ ਨੀਰ ਹੈ।",
  },
  {
    id: "SYN-052",
    headword: "ਅੱਗ",
    primarySynonym: "ਅਗਨੀ",
    otherSynonyms: ["ਪਾਵਕ","ਅਨਲ","ਆਤਿਸ਼"],
    distractors: ["ਪਾਣੀ","ਬਰਫ਼","ਜਲ","ਮੀਂਹ"],
    explanationPa: "‘ਅੱਗ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਅਗਨੀ’ ਜਾਂ ਪਾਵਕ ਹੈ।",
  },
  {
    id: "SYN-053",
    headword: "ਹਵਾ",
    primarySynonym: "ਪੌਣ",
    otherSynonyms: ["ਵਾਯੂ","ਸਮੀਰ","ਬਾਦ"],
    distractors: ["ਮਿੱਟੀ","ਪੱਥਰ","ਪਾਣੀ","ਅੱਗ"],
    explanationPa: "‘ਹਵਾ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਪੌਣ’ ਜਾਂ ਵਾਯੂ ਹੈ।",
  },
  {
    id: "SYN-054",
    headword: "ਧਰਤੀ",
    primarySynonym: "ਜ਼ਮੀਨ",
    otherSynonyms: ["ਭੂਮੀ","ਪ੍ਰਿਥਵੀ","ਧਰਾ"],
    distractors: ["ਅਸਮਾਨ","ਅੰਬਰ","ਬੱਦਲ","ਤਾਰੇ"],
    explanationPa: "‘ਧਰਤੀ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਜ਼ਮੀਨ’ ਜਾਂ ਭੂਮੀ ਹੈ।",
  },
  {
    id: "SYN-055",
    headword: "ਅਸਮਾਨ",
    primarySynonym: "ਅਕਾਸ਼",
    otherSynonyms: ["ਅੰਬਰ","ਫ਼ਲਕ","ਗਗਨ"],
    distractors: ["ਧਰਤੀ","ਜ਼ਮੀਨ","ਪਤਾਲ","ਖੂਹ"],
    explanationPa: "‘ਅਸਮਾਨ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਅਕਾਸ਼’ ਜਾਂ ਅੰਬਰ ਹੈ।",
  },
  {
    id: "SYN-056",
    headword: "ਕੁਦਰਤ",
    primarySynonym: "ਪ੍ਰਕਿਰਤੀ",
    otherSynonyms: ["ਸ੍ਰਿਸ਼ਟੀ","ਫਿਤਰਤ","ਨੇਚਰ"],
    distractors: ["ਬਨਾਵਟ","ਮਸ਼ੀਨ","ਨਕਲ","ਸ਼ਹਿਰ"],
    explanationPa: "‘ਕੁਦਰਤ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਪ੍ਰਕਿਰਤੀ’ ਹੈ।",
  },
  {
    id: "SYN-057",
    headword: "ਸੁੰਦਰ",
    primarySynonym: "ਖ਼ੂਬਸੂਰਤ",
    otherSynonyms: ["ਮਨਮੋਹਕ","ਸੋਹਣਾ","ਰਮਣੀਕ"],
    distractors: ["ਕਰੂਪ","ਬਦਸੂਰਤ","ਭੈੜਾ","ਗੰਦਾ"],
    explanationPa: "‘ਸੁੰਦਰ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਖ਼ੂਬਸੂਰਤ’ ਜਾਂ ਸੋਹਣਾ ਹੈ।",
  },
  {
    id: "SYN-058",
    headword: "ਕਰੂਪ",
    primarySynonym: "ਬਦਸੂਰਤ",
    otherSynonyms: ["ਭੈੜਾ","ਕੋਝਾ","ਬੇਢੰਗਾ"],
    distractors: ["ਸੁੰਦਰ","ਖ਼ੂਬਸੂਰਤ","ਸੋਹਣਾ","ਮਨਮੋਹਕ"],
    explanationPa: "‘ਕਰੂਪ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਬਦਸੂਰਤ’ ਜਾਂ ਕੋਝਾ ਹੈ।",
  },
  {
    id: "SYN-059",
    headword: "ਸਿਆਣਾ",
    primarySynonym: "ਬੁੱਧੀਮਾਨ",
    otherSynonyms: ["ਅਕਲਮੰਦ","ਦਾਨਾ","ਸੂਝਵਾਨ"],
    distractors: ["ਮੂਰਖ","ਬੇਸਮਝ","ਅੰਞਾਣਾ","ਕਮਲਾ"],
    explanationPa: "‘ਸਿਆਣਾ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਬੁੱਧੀਮਾਨ’ ਜਾਂ ਅਕਲਮੰਦ ਹੈ।",
  },
  {
    id: "SYN-060",
    headword: "ਮੂਰਖ",
    primarySynonym: "ਬੇਵਕੂਫ਼",
    otherSynonyms: ["ਅੰਞਾਣ","ਨਾਦਾਨ","ਬੇਸਮਝ"],
    distractors: ["ਸਿਆਣਾ","ਵਿਦਵਾਨ","ਚਲਾਕ","ਸੂਝਵਾਨ"],
    explanationPa: "‘ਮੂਰਖ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਬੇਵਕੂਫ਼’ ਜਾਂ ਨਾਦਾਨ ਹੈ।",
  },
  {
    id: "SYN-061",
    headword: "ਸੱਚ",
    primarySynonym: "ਸੱਤ",
    otherSynonyms: ["ਹੱਕ","ਸਚਾਈ","ਯਥਾਰਥ"],
    distractors: ["ਝੂਠ","ਕੂੜ","ਫ਼ਰੇਬ","ਧੋਖਾ"],
    explanationPa: "‘ਸੱਚ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਸੱਤ’ ਜਾਂ ਹੱਕ ਹੈ।",
  },
  {
    id: "SYN-062",
    headword: "ਝੂਠ",
    primarySynonym: "ਕੂੜ",
    otherSynonyms: ["ਅਸੱਤ","ਮਿਥਿਆ","ਫ਼ਰੇਬ"],
    distractors: ["ਸੱਚ","ਹੱਕ","ਸਚਾਈ","ਨੇਕੀ"],
    explanationPa: "‘ਝੂਠ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਕੂੜ’ ਜਾਂ ਅਸੱਤ ਹੈ।",
  },
  {
    id: "SYN-063",
    headword: "ਦੌਲਤ",
    primarySynonym: "ਧਨ",
    otherSynonyms: ["ਸੰਪਤੀ","ਮਾਇਆ","ਪੂੰਜੀ"],
    distractors: ["ਗ਼ਰੀਬੀ","ਕੰਗਾਲੀ","ਕਰਜ਼ਾ","ਥੁੜ੍ਹ"],
    explanationPa: "‘ਦੌਲਤ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਧਨ’ ਜਾਂ ਸੰਪਤੀ ਹੈ।",
  },
  {
    id: "SYN-064",
    headword: "ਗ਼ਰੀਬੀ",
    primarySynonym: "ਨਿਰਧਨਤਾ",
    otherSynonyms: ["ਕੰਗਾਲੀ","ਮੁਫ਼ਲਿਸੀ","ਤੰਗੀ"],
    distractors: ["ਅਮੀਰੀ","ਦੌਲਤ","ਸੰਪਨਤਾ","ਠਾਠ"],
    explanationPa: "‘ਗ਼ਰੀਬੀ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਨਿਰਧਨਤਾ’ ਜਾਂ ਕੰਗਾਲੀ ਹੈ।",
  },
  {
    id: "SYN-065",
    headword: "ਵਿਰੋਧ",
    primarySynonym: "ਖ਼ਿਲਾਫ਼ਤ",
    otherSynonyms: ["ਟਾਕਰਾ","ਮੁਖ਼ਾਲਫ਼ਤ","ਇਤਰਾਜ਼"],
    distractors: ["ਸਮਰਥਨ","ਸਹਿਮਤੀ","ਮਦਦ","ਏਕਾ"],
    explanationPa: "‘ਵਿਰੋਧ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਖ਼ਿਲਾਫ਼ਤ’ ਜਾਂ ਟਾਕਰਾ ਹੈ।",
  },
  {
    id: "SYN-066",
    headword: "ਸਮਰਥਨ",
    primarySynonym: "ਹਿਮਾਇਤ",
    otherSynonyms: ["ਸਹਿਯੋਗ","ਪੱਖ","ਸਹਾਇਤਾ"],
    distractors: ["ਵਿਰੋਧ","ਇਤਰਾਜ਼","ਟਾਕਰਾ","ਰੋਕ"],
    explanationPa: "‘ਸਮਰਥਨ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਹਿਮਾਇਤ’ ਜਾਂ ਸਹਿਯੋਗ ਹੈ।",
  },
  {
    id: "SYN-067",
    headword: "ਸ਼ਾਂਤੀ",
    primarySynonym: "ਅਮਨ",
    otherSynonyms: ["ਚੈਨ","ਸਕੂਨ","ਖ਼ਾਮੋਸ਼ੀ"],
    distractors: ["ਅਸ਼ਾਂਤੀ","ਰੌਲਾ","ਯੁੱਧ","ਹੱਲ੍ਹਾ"],
    explanationPa: "‘ਸ਼ਾਂਤੀ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਅਮਨ’ ਜਾਂ ਚੈਨ ਹੈ।",
  },
  {
    id: "SYN-068",
    headword: "ਯੁੱਧ",
    primarySynonym: "ਜੰਗ",
    otherSynonyms: ["ਲੜਾਈ","ਸੰਗਰਾਮ","ਮਹਾਂਭਾਰਤ"],
    distractors: ["ਅਮਨ","ਸ਼ਾਂਤੀ","ਸਮਝੌਤਾ","ਮੇਲ"],
    explanationPa: "‘ਯੁੱਧ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਜੰਗ’ ਜਾਂ ਲੜਾਈ ਹੈ।",
  },
  {
    id: "SYN-069",
    headword: "ਜਿੱਤ",
    primarySynonym: "ਵਿਜੈ",
    otherSynonyms: ["ਫ਼ਤਹਿ","ਕਾਮਯਾਬੀ","ਜੈ"],
    distractors: ["ਹਾਰ","ਪਰਾਜੈ","ਨਾਕਾਮੀ","ਸ਼ਿਕਸਤ"],
    explanationPa: "‘ਜਿੱਤ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਵਿਜੈ’ ਜਾਂ ਫ਼ਤਹਿ ਹੈ।",
  },
  {
    id: "SYN-070",
    headword: "ਹਾਰ",
    primarySynonym: "ਪਰਾਜੈ",
    otherSynonyms: ["ਸ਼ਿਕਸਤ","ਮਾਤ","ਅਸਫ਼ਲਤਾ"],
    distractors: ["ਜਿੱਤ","ਫ਼ਤਹਿ","ਵਿਜੈ","ਕਾਮਯਾਬੀ"],
    explanationPa: "‘ਹਾਰ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਪਰਾਜੈ’ ਜਾਂ ਸ਼ਿਕਸਤ ਹੈ।",
  },
  {
    id: "SYN-071",
    headword: "ਪ੍ਰੇਮ",
    primarySynonym: "ਪਿਆਰ",
    otherSynonyms: ["ਮੁਹੱਬਤ","ਨੇਹੁੰ","ਇਸ਼ਕ"],
    distractors: ["ਨਫ਼ਰਤ","ਘਿਰਣਾ","ਵੈਰ","ਦੁਸ਼ਮਣੀ"],
    explanationPa: "‘ਪ੍ਰੇਮ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਪਿਆਰ’ ਜਾਂ ਮੁਹੱਬਤ ਹੈ।",
  },
  {
    id: "SYN-072",
    headword: "ਘਿਰਣਾ",
    primarySynonym: "ਨਫ਼ਰਤ",
    otherSynonyms: ["ਕ੍ਰੋਧ","ਈਰਖਾ","ਖ਼ਾਰ"],
    distractors: ["ਪ੍ਰੇਮ","ਪਿਆਰ","ਮੁਹੱਬਤ","ਸਨੇਹ"],
    explanationPa: "‘ਘਿਰਣਾ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਨਫ਼ਰਤ’ ਹੈ।",
  },
  {
    id: "SYN-073",
    headword: "ਸਰੀਰ",
    primarySynonym: "ਤਨ",
    otherSynonyms: ["ਦੇਹ","ਜੁੱਸਾ","ਕਾਇਆ"],
    distractors: ["ਰੂਹ","ਆਤਮਾ","ਮਨ","ਸੋਚ"],
    explanationPa: "‘ਸਰੀਰ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਤਨ’ ਜਾਂ ਦੇਹ ਹੈ।",
  },
  {
    id: "SYN-074",
    headword: "ਰੂਹ",
    primarySynonym: "ਆਤਮਾ",
    otherSynonyms: ["ਜਾਨ","ਪ੍ਰਾਣ","ਚੇਤਨਾ"],
    distractors: ["ਸਰੀਰ","ਤਨ","ਮਿੱਟੀ","ਪਿੰਜਰ"],
    explanationPa: "‘ਰੂਹ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਆਤਮਾ’ ਜਾਂ ਜਾਨ ਹੈ।",
  },
  {
    id: "SYN-075",
    headword: "ਮਹਿਮਾਨ",
    primarySynonym: "ਪ੍ਰਾਹੁਣਾ",
    otherSynonyms: ["ਅਤਿਥੀ","ਯਾਤਰੀ","ਸੱਜਣ"],
    distractors: ["ਮੇਜ਼ਬਾਨ","ਮਾਲਕ","ਘਰਵਾਲਾ","ਨੌਕਰ"],
    explanationPa: "‘ਮਹਿਮਾਨ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਪ੍ਰਾਹੁਣਾ’ ਜਾਂ ਅਤਿਥੀ ਹੈ।",
  },
  {
    "id": "SYN-076",
    "headword": "ਅਸਮਾਨ",
    "primarySynonym": "ਅਕਾਸ਼",
    "otherSynonyms": [
      "ਗਗਨ",
      "ਅੰਬਰ",
      "ਫ਼ਲਕ"
    ],
    "distractors": [
      "ਧਰਤੀ",
      "ਪਤਾਲ",
      "ਜ਼ਮੀਨ",
      "ਸਾਗਰ"
    ],
    "explanationPa": "‘ਅਸਮਾਨ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਅਕਾਸ਼’ ਜਾਂ ਅੰਬਰ ਹੈ।"
  },
  {
    "id": "SYN-077",
    "headword": "ਅੱਖ",
    "primarySynonym": "ਨੇਤਰ",
    "otherSynonyms": [
      "ਲੋਚਨ",
      "ਦੀਦੇ",
      "ਚੱਖ"
    ],
    "distractors": [
      "ਕੰਨ",
      "ਨੱਕ",
      "ਮੂੰਹ",
      "ਦੰਦ"
    ],
    "explanationPa": "‘ਅੱਖ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਨੇਤਰ’ ਜਾਂ ਲੋਚਨ ਹੈ।"
  },
  {
    "id": "SYN-078",
    "headword": "ਕਿਰਪਾ",
    "primarySynonym": "ਮਿਹਰ",
    "otherSynonyms": [
      "ਦਇਆ",
      "ਬਖ਼ਸ਼ਿਸ਼",
      "ਰਹਿਮਤ"
    ],
    "distractors": [
      "ਕਹਿਰ",
      "ਗੁੱਸਾ",
      "ਸਜ਼ਾ",
      "ਜ਼ੁਲਮ"
    ],
    "explanationPa": "‘ਕਿਰਪਾ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਮਿਹਰ’ ਜਾਂ ਦਇਆ ਹੈ।"
  },
  {
    "id": "SYN-079",
    "headword": "ਦੁਸ਼ਮਣ",
    "primarySynonym": "ਵੈਰੀ",
    "otherSynonyms": [
      "ਸ਼ਤਰੂ",
      "ਬਾਗ਼ੀ",
      "ਮੁਖ਼ਾਲਿਫ਼"
    ],
    "distractors": [
      "ਮਿੱਤਰ",
      "ਦੋਸਤ",
      "ਯਾਰ",
      "ਸਾਥੀ"
    ],
    "explanationPa": "‘ਦੁਸ਼ਮਣ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਵੈਰੀ’ ਜਾਂ ਸ਼ਤਰੂ ਹੈ।"
  },
  {
    "id": "SYN-080",
    "headword": "ਕੋਮਲ",
    "primarySynonym": "ਨਾਜ਼ੁਕ",
    "otherSynonyms": [
      "ਮੁਲਾਇਮ",
      "ਨਰਮ",
      "ਸੁਕੁਮਾਰ"
    ],
    "distractors": [
      "ਕਰੜਾ",
      "ਸਖ਼ਤ",
      "ਪੱਥਰ",
      "ਕਠੋਰ"
    ],
    "explanationPa": "‘ਕੋਮਲ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਨਾਜ਼ੁਕ’ ਜਾਂ ਨਰਮ ਹੈ।"
  },
  {
    "id": "SYN-081",
    "headword": "ਕਠੋਰ",
    "primarySynonym": "ਕਰੜਾ",
    "otherSynonyms": [
      "ਸਖ਼ਤ",
      "ਪੱਥਰਦਿਲ",
      "ਜ਼ਾਲਮ"
    ],
    "distractors": [
      "ਕੋਮਲ",
      "ਨਰਮ",
      "ਮਿੱਠਾ",
      "ਨਾਜ਼ੁਕ"
    ],
    "explanationPa": "‘ਕਠੋਰ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਕਰੜਾ’ ਜਾਂ ਸਖ਼ਤ ਹੈ।"
  },
  {
    "id": "SYN-082",
    "headword": "ਸੂਰਜ",
    "primarySynonym": "ਰਵੀ",
    "otherSynonyms": [
      "ਭਾਨੂ",
      "ਦਿਨਕਰ",
      "ਆਦਿਤ"
    ],
    "distractors": [
      "ਚੰਦਰਮਾ",
      "ਤਾਰੇ",
      "ਬੱਦਲ",
      "ਹਨੇਰਾ"
    ],
    "explanationPa": "‘ਸੂਰਜ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਰਵੀ’ ਜਾਂ ਦਿਨਕਰ ਹੈ।"
  },
  {
    "id": "SYN-083",
    "headword": "ਚੰਨ",
    "primarySynonym": "ਚੰਦਰਮਾ",
    "otherSynonyms": [
      "ਸ਼ਸ਼ੀ",
      "ਮਹਿਤਾਬ",
      "ਰਾਕੇਸ਼"
    ],
    "distractors": [
      "ਸੂਰਜ",
      "ਧੁੱਪ",
      "ਦਿਨ",
      "ਅੱਗ"
    ],
    "explanationPa": "‘ਚੰਨ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਚੰਦਰਮਾ’ ਜਾਂ ਸ਼ਸ਼ੀ ਹੈ।"
  },
  {
    "id": "SYN-084",
    "headword": "ਹਵਾ",
    "primarySynonym": "ਪੌਣ",
    "otherSynonyms": [
      "ਵਾਯੂ",
      "ਸਮੀਰ",
      "ਬਾਦ"
    ],
    "distractors": [
      "ਪਾਣੀ",
      "ਅੱਗ",
      "ਧੂੜ",
      "ਪੱਥਰ"
    ],
    "explanationPa": "‘ਹਵਾ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਪੌਣ’ ਜਾਂ ਵਾਯੂ ਹੈ।"
  },
  {
    "id": "SYN-085",
    "headword": "ਅੱਗ",
    "primarySynonym": "ਅਗਨੀ",
    "otherSynonyms": [
      "ਅਨਲ",
      "ਪਾਵਕ",
      "ਭਾਂਬੜ"
    ],
    "distractors": [
      "ਬਰਫ਼",
      "ਪਾਣੀ",
      "ਮੀਂਹ",
      "ਸੀਤਲ"
    ],
    "explanationPa": "‘ਅੱਗ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਅਗਨੀ’ ਜਾਂ ਅਨਲ ਹੈ।"
  },
  {
    "id": "SYN-086",
    "headword": "ਪਾਣੀ",
    "primarySynonym": "ਜਲ",
    "otherSynonyms": [
      "ਨੀਰ",
      "ਆਬ",
      "ਸਲਿਲ"
    ],
    "distractors": [
      "ਰੇਤ",
      "ਮਿੱਟੀ",
      "ਪੱਥਰ",
      "ਅੱਗ"
    ],
    "explanationPa": "‘ਪਾਣੀ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਜਲ’ ਜਾਂ ਨੀਰ ਹੈ।"
  },
  {
    "id": "SYN-087",
    "headword": "ਧਰਤੀ",
    "primarySynonym": "ਜ਼ਮੀਨ",
    "otherSynonyms": [
      "ਭੂਮੀ",
      "ਪ੍ਰਿਥਵੀ",
      "ਧਰਾ"
    ],
    "distractors": [
      "ਅਕਾਸ਼",
      "ਅੰਬਰ",
      "ਗਗਨ",
      "ਤਾਰੇ"
    ],
    "explanationPa": "‘ਧਰਤੀ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਜ਼ਮੀਨ’ ਜਾਂ ਭੂਮੀ ਹੈ।"
  },
  {
    "id": "SYN-088",
    "headword": "ਜੰਗਲ",
    "primarySynonym": "ਬਣ",
    "otherSynonyms": [
      "ਬੀਆਬਾਨ",
      "ਅਰਣਯ",
      "ਕਾਨਨ"
    ],
    "distractors": [
      "ਸ਼ਹਿਰ",
      "ਪਿੰਡ",
      "ਮਹੱਲਾ",
      "ਘਰ"
    ],
    "explanationPa": "‘ਜੰਗਲ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਬਣ’ ਜਾਂ ਬੀਆਬਾਨ ਹੈ।"
  },
  {
    "id": "SYN-089",
    "headword": "ਰਾਹ",
    "primarySynonym": "ਮਾਰਗ",
    "otherSynonyms": [
      "ਰਸਤਾ",
      "ਪੰਧ",
      "ਪਥ"
    ],
    "distractors": [
      "ਮੰਜ਼ਿਲ",
      "ਰੁਕਾਵਟ",
      "ਖਾਈ",
      "ਕੰਧ"
    ],
    "explanationPa": "‘ਰਾਹ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਮਾਰਗ’ ਜਾਂ ਰਸਤਾ ਹੈ।"
  },
  {
    "id": "SYN-090",
    "headword": "ਮੰਜ਼ਿਲ",
    "primarySynonym": "ਮਕਸਦ",
    "otherSynonyms": [
      "ਟੀਚਾ",
      "ਨਿਸ਼ਾਨਾ",
      "ਪੜਾਅ"
    ],
    "distractors": [
      "ਭਟਕਣ",
      "ਰਾਹ",
      "ਸਫ਼ਰ",
      "ਕਦਮ"
    ],
    "explanationPa": "‘ਮੰਜ਼ਿਲ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਮਕਸਦ’ ਜਾਂ ਟੀਚਾ ਹੈ।"
  },
  {
    "id": "SYN-091",
    "headword": "ਪੰਛੀ",
    "primarySynonym": "ਪੰਖੇਰੂ",
    "otherSynonyms": [
      "ਪਰਿੰਦਾ",
      "ਖਗ",
      "ਵਿਹੰਗ"
    ],
    "distractors": [
      "ਪਸ਼ੂ",
      "ਜਾਨਵਰ",
      "ਚੌਪਾਏ",
      "ਕੀੜੇ"
    ],
    "explanationPa": "‘ਪੰਛੀ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਪੰਖੇਰੂ’ ਜਾਂ ਪਰਿੰਦਾ ਹੈ।"
  },
  {
    "id": "SYN-092",
    "headword": "ਫੁੱਲ",
    "primarySynonym": "ਕੁਸੁਮ",
    "otherSynonyms": [
      "ਪੁਸ਼ਪ",
      "ਸੁਮਨ",
      "ਗੁਲ"
    ],
    "distractors": [
      "ਕੰਡਾ",
      "ਪੱਤਾ",
      "ਜੜ੍ਹ",
      "ਟਾਹਣੀ"
    ],
    "explanationPa": "‘ਫੁੱਲ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਕੁਸੁਮ’ ਜਾਂ ਪੁਸ਼ਪ ਹੈ।"
  },
  {
    "id": "SYN-093",
    "headword": "ਰੁੱਖ",
    "primarySynonym": "ਦਰੱਖ਼ਤ",
    "otherSynonyms": [
      "ਬਿਰਖ਼",
      "ਪੇੜ",
      "ਤਰੂ"
    ],
    "distractors": [
      "ਘਾਹ",
      "ਫੁੱਲ",
      "ਬੀਜ",
      "ਫ਼ਸਲ"
    ],
    "explanationPa": "‘ਰੁੱਖ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਦਰੱਖ਼ਤ’ ਜਾਂ ਬਿਰਖ਼ ਹੈ।"
  },
  {
    "id": "SYN-094",
    "headword": "ਸੰਸਾਰ",
    "primarySynonym": "ਜਗਤ",
    "otherSynonyms": [
      "ਦੁਨੀਆ",
      "ਜਹਾਨ",
      "ਲੋਕ"
    ],
    "distractors": [
      "ਇਕਾਂਤ",
      "ਘਰ",
      "ਕਮਰਾ",
      "ਪਿੰਡ"
    ],
    "explanationPa": "‘ਸੰਸਾਰ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਜਗਤ’ ਜਾਂ ਦੁਨੀਆ ਹੈ।"
  },
  {
    "id": "SYN-095",
    "headword": "ਚਾਨਣ",
    "primarySynonym": "ਰੌਸ਼ਨੀ",
    "otherSynonyms": [
      "ਪ੍ਰਕਾਸ਼",
      "ਉਜਾਲਾ",
      "ਨੂਰ"
    ],
    "distractors": [
      "ਹਨੇਰਾ",
      "ਕਾਲਖ਼",
      "ਛਾਂ",
      "ਧੁੰਦ"
    ],
    "explanationPa": "‘ਚਾਨਣ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਰੌਸ਼ਨੀ’ ਜਾਂ ਪ੍ਰਕਾਸ਼ ਹੈ।"
  },
  {
    "id": "SYN-096",
    "headword": "ਹਨੇਰਾ",
    "primarySynonym": "ਅੰਧਕਾਰ",
    "otherSynonyms": [
      "ਤਮ",
      "ਕਾਲਖ਼",
      "ਧੁੰਦਲਕਾ"
    ],
    "distractors": [
      "ਚਾਨਣ",
      "ਰੌਸ਼ਨੀ",
      "ਧੁੱਪ",
      "ਸਵੇਰ"
    ],
    "explanationPa": "‘ਹਨੇਰਾ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਅੰਧਕਾਰ’ ਹੈ।"
  },
  {
    "id": "SYN-097",
    "headword": "ਕੋਸ਼ਿਸ਼",
    "primarySynonym": "ਜਤਨ",
    "otherSynonyms": [
      "ਉੱਦਮ",
      "ਪ੍ਰਯਤਨ",
      "ਉਪਰਾਲਾ"
    ],
    "distractors": [
      "ਆਲਸ",
      "ਢਿੱਲ",
      "ਸੁਸਤੀ",
      "ਹਾਰ"
    ],
    "explanationPa": "‘ਕੋਸ਼ਿਸ਼’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਜਤਨ’ ਜਾਂ ਉੱਦਮ ਹੈ।"
  },
  {
    "id": "SYN-098",
    "headword": "ਉਦਾਸ",
    "primarySynonym": "ਗ਼ਮਗੀਨ",
    "otherSynonyms": [
      "ਨਿਰਾਸ਼",
      "ਮਾਯੂਸ",
      "ਦੁਖੀ"
    ],
    "distractors": [
      "ਖ਼ੁਸ਼",
      "ਪ੍ਰਸੰਨ",
      "ਖਿੜਿਆ",
      "ਚਾਅ"
    ],
    "explanationPa": "‘ਉਦਾਸ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਗ਼ਮਗੀਨ’ ਜਾਂ ਨਿਰਾਸ਼ ਹੈ।"
  },
  {
    "id": "SYN-099",
    "headword": "ਪ੍ਰਸੰਨ",
    "primarySynonym": "ਖ਼ੁਸ਼",
    "otherSynonyms": [
      "ਆਨੰਦਿਤ",
      "ਬਾਗ਼ੋ-ਬਾਗ਼",
      "ਹਰਖਿਆ"
    ],
    "distractors": [
      "ਉਦਾਸ",
      "ਮਾਯੂਸ",
      "ਰੋਂਦਾ",
      "ਦੁਖੀ"
    ],
    "explanationPa": "‘ਪ੍ਰਸੰਨ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਖ਼ੁਸ਼’ ਜਾਂ ਆਨੰਦਿਤ ਹੈ।"
  },
  {
    "id": "SYN-100",
    "headword": "ਆਗਿਆ",
    "primarySynonym": "ਹੁਕਮ",
    "otherSynonyms": [
      "ਫ਼ਰਮਾਨ",
      "ਨਿਰਦੇਸ਼",
      "ਇਜਾਜ਼ਤ"
    ],
    "distractors": [
      "ਬਗ਼ਾਵਤ",
      "ਮਨਾਹੀ",
      "ਰੋਕ",
      "ਇਨਕਾਰ"
    ],
    "explanationPa": "‘ਆਗਿਆ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਹੁਕਮ’ ਜਾਂ ਇਜਾਜ਼ਤ ਹੈ।"
  },
  {
    "id": "SYN-101",
    "headword": "ਇੱਛਾ",
    "primarySynonym": "ਚਾਹ",
    "otherSynonyms": [
      "ਕਾਮਨਾ",
      "ਤਮੰਨਾ",
      "ਖ਼ਾਹਿਸ਼"
    ],
    "distractors": [
      "ਨਫ਼ਰਤ",
      "ਬੇਪਰਵਾਹੀ",
      "ਅਣਦੇਖੀ",
      "ਅਰੁਚੀ"
    ],
    "explanationPa": "‘ਇੱਛਾ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਚਾਹ’ ਜਾਂ ਕਾਮਨਾ ਹੈ।"
  },
  {
    "id": "SYN-102",
    "headword": "ਦੌਲਤ",
    "primarySynonym": "ਧਨ",
    "otherSynonyms": [
      "ਸੰਪਤੀ",
      "ਮਾਇਆ",
      "ਪੂੰਜੀ"
    ],
    "distractors": [
      "ਗ਼ਰੀਬੀ",
      "ਤੰਗੀ",
      "ਕੰਗਾਲੀ",
      "ਕਰਜ਼ਾ"
    ],
    "explanationPa": "‘ਦੌਲਤ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਧਨ’ ਜਾਂ ਸੰਪਤੀ ਹੈ।"
  },
  {
    "id": "SYN-103",
    "headword": "ਦਿਨ",
    "primarySynonym": "ਦਿਵਸ",
    "otherSynonyms": [
      "ਰੋਜ਼",
      "ਵਾਰ",
      "ਦਿਹਾੜਾ"
    ],
    "distractors": [
      "ਰਾਤ",
      "ਸੰਧਿਆ",
      "ਹਨੇਰਾ",
      "ਅੱਧੀ-ਰਾਤ"
    ],
    "explanationPa": "‘ਦਿਨ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਦਿਵਸ’ ਜਾਂ ਦਿਹਾੜਾ ਹੈ।"
  },
  {
    "id": "SYN-104",
    "headword": "ਰਾਤ",
    "primarySynonym": "ਰੈਣ",
    "otherSynonyms": [
      "ਨਿਸ਼ਾ",
      "ਸ਼ਾਮ",
      "ਰੈਣ-ਬਸੇਰਾ"
    ],
    "distractors": [
      "ਦਿਨ",
      "ਦੁਪਹਿਰ",
      "ਸਵੇਰ",
      "ਧੁੱਪ"
    ],
    "explanationPa": "‘ਰਾਤ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਰੈਣ’ ਜਾਂ ਨਿਸ਼ਾ ਹੈ।"
  },
  {
    "id": "SYN-105",
    "headword": "ਘਰ",
    "primarySynonym": "ਮਕਾਨ",
    "otherSynonyms": [
      "ਨਿਵਾਸ",
      "ਗ੍ਰਹਿ",
      "ਡੇਰਾ"
    ],
    "distractors": [
      "ਜੰਗਲ",
      "ਬਾਜ਼ਾਰ",
      "ਸੜਕ",
      "ਮੈਦਾਨ"
    ],
    "explanationPa": "‘ਘਰ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਮਕਾਨ’ ਜਾਂ ਗ੍ਰਹਿ ਹੈ।"
  },
  {
    "id": "SYN-106",
    "headword": "ਸੁੰਦਰ",
    "primarySynonym": "ਖ਼ੂਬਸੂਰਤ",
    "otherSynonyms": [
      "ਮਨੋਹਰ",
      "ਸੋਹਣਾ",
      "ਦਿਲਕਸ਼"
    ],
    "distractors": [
      "ਬਦਸੂਰਤ",
      "ਕਰੂਪ",
      "ਭੈੜਾ",
      "ਮੰਦਾ"
    ],
    "explanationPa": "‘ਸੁੰਦਰ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਖ਼ੂਬਸੂਰਤ’ ਜਾਂ ਸੋਹਣਾ ਹੈ।"
  },
  {
    "id": "SYN-107",
    "headword": "ਬਦਸੂਰਤ",
    "primarySynonym": "ਕਰੂਪ",
    "otherSynonyms": [
      "ਭੈੜਾ",
      "ਬੇਡੌਲ",
      "ਕੋਝਾ"
    ],
    "distractors": [
      "ਸੁੰਦਰ",
      "ਸੋਹਣਾ",
      "ਖ਼ੂਬਸੂਰਤ",
      "ਨਿਰਮਲ"
    ],
    "explanationPa": "‘ਬਦਸੂਰਤ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਕਰੂਪ’ ਜਾਂ ਕੋਝਾ ਹੈ।"
  },
  {
    "id": "SYN-108",
    "headword": "ਮਿੱਠਾ",
    "primarySynonym": "ਮਧੁਰ",
    "otherSynonyms": [
      "ਸ਼ੀਰੀਂ",
      "ਰਸੀਲਾ",
      "ਸੁਆਦੀ"
    ],
    "distractors": [
      "ਕੌੜਾ",
      "ਤਿੱਖਾ",
      "ਖੱਟਾ",
      "ਫਿੱਕਾ"
    ],
    "explanationPa": "‘ਮਿੱਠਾ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਮਧੁਰ’ ਜਾਂ ਸ਼ੀਰੀਂ ਹੈ।"
  },
  {
    "id": "SYN-109",
    "headword": "ਕੌੜਾ",
    "primarySynonym": "ਤਲਖ਼",
    "otherSynonyms": [
      "ਕੜਵਾ",
      "ਕਸੈਲਾ",
      "ਤਿੱਖਾ"
    ],
    "distractors": [
      "ਮਿੱਠਾ",
      "ਰਸੀਲਾ",
      "ਮਧੁਰ",
      "ਸ਼ਹਿਦ"
    ],
    "explanationPa": "‘ਕੌੜਾ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਤਲਖ਼’ ਜਾਂ ਕਸੈਲਾ ਹੈ।"
  },
  {
    "id": "SYN-110",
    "headword": "ਪੁਰਾਤਨ",
    "primarySynonym": "ਪ੍ਰਾਚੀਨ",
    "otherSynonyms": [
      "ਪੁਰਾਣਾ",
      "ਕਦੀਮੀ",
      "ਪੁਰਾਤਨਕਾਲੀਨ"
    ],
    "distractors": [
      "ਨਵੀਨ",
      "ਨਵਾਂ",
      "ਆਧੁਨਿਕ",
      "ਤਾਜ਼ਾ"
    ],
    "explanationPa": "‘ਪੁਰਾਤਨ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਪ੍ਰਾਚੀਨ’ ਜਾਂ ਕਦੀਮੀ ਹੈ।"
  },
  {
    "id": "SYN-111",
    "headword": "ਨਵੀਨ",
    "primarySynonym": "ਆਧੁਨਿਕ",
    "otherSynonyms": [
      "ਨਵਾਂ",
      "ਅਜੋਕਾ",
      "ਤਾਜ਼ਾ"
    ],
    "distractors": [
      "ਪੁਰਾਤਨ",
      "ਪ੍ਰਾਚੀਨ",
      "ਸਦੀਆਂ ਪੁਰਾਣਾ",
      "ਬਾਸੀ"
    ],
    "explanationPa": "‘ਨਵੀਨ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਆਧੁਨਿਕ’ ਜਾਂ ਨਵਾਂ ਹੈ।"
  },
  {
    "id": "SYN-112",
    "headword": "ਜਿੱਤ",
    "primarySynonym": "ਫ਼ਤਹਿ",
    "otherSynonyms": [
      "ਵਿਜੈ",
      "ਜ਼ਫ਼ਰ",
      "ਕਾਮਯਾਬੀ"
    ],
    "distractors": [
      "ਹਾਰ",
      "ਸ਼ਿਕਸਤ",
      "ਨਾਕਾਮੀ",
      "ਮਾਤ"
    ],
    "explanationPa": "‘ਜਿੱਤ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਫ਼ਤਹਿ’ ਜਾਂ ਵਿਜੈ ਹੈ।"
  },
  {
    "id": "SYN-113",
    "headword": "ਹਾਰ",
    "primarySynonym": "ਸ਼ਿਕਸਤ",
    "otherSynonyms": [
      "ਨਾਕਾਮੀ",
      "ਮਾਤ",
      "ਪਰਾਜੈ"
    ],
    "distractors": [
      "ਜਿੱਤ",
      "ਫ਼ਤਹਿ",
      "ਵਿਜੈ",
      "ਕਾਮਯਾਬੀ"
    ],
    "explanationPa": "‘ਹਾਰ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਸ਼ਿਕਸਤ’ ਜਾਂ ਮਾਤ ਹੈ।"
  },
  {
    "id": "SYN-114",
    "headword": "ਸੱਚ",
    "primarySynonym": "ਸੱਤਿਆ",
    "otherSynonyms": [
      "ਹੱਕ",
      "ਸੱਚਾਈ",
      "ਵਾਸਤਵਿਕਤਾ"
    ],
    "distractors": [
      "ਝੂਠ",
      "ਫ਼ਰੇਬ",
      "ਧੋਖਾ",
      "ਕਲਪਨਾ"
    ],
    "explanationPa": "‘ਸੱਚ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਸੱਤਿਆ’ ਜਾਂ ਹੱਕ ਹੈ।"
  },
  {
    "id": "SYN-115",
    "headword": "ਝੂਠ",
    "primarySynonym": "ਅਸੱਤ",
    "otherSynonyms": [
      "ਫ਼ਰੇਬ",
      "ਕੂੜ",
      "ਮਿਥਿਆ"
    ],
    "distractors": [
      "ਸੱਚ",
      "ਹੱਕ",
      "ਸੱਚਾਈ",
      "ਇਮਾਨ"
    ],
    "explanationPa": "‘ਝੂਠ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਅਸੱਤ’ ਜਾਂ ਕੂੜ ਹੈ।"
  },
  {
    "id": "SYN-116",
    "headword": "ਅੰਮ੍ਰਿਤ",
    "primarySynonym": "ਸੁਧਾ",
    "otherSynonyms": [
      "ਆਬਿ-ਹਯਾਤ",
      "ਪਿਯੂਸ਼"
    ],
    "distractors": [
      "ਜ਼ਹਿਰ",
      "ਵਿਸ਼",
      "ਗਰਲ",
      "ਹਲਾਹਲ"
    ],
    "explanationPa": "‘ਅੰਮ੍ਰਿਤ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਸੁਧਾ’ ਜਾਂ ਪਿਯੂਸ਼ ਹੈ।"
  },
  {
    "id": "SYN-117",
    "headword": "ਜ਼ਹਿਰ",
    "primarySynonym": "ਵਿਸ਼",
    "otherSynonyms": [
      "ਗਰਲ",
      "ਹਲਾਹਲ",
      "ਮਾਹੁਰ"
    ],
    "distractors": [
      "ਅੰਮ੍ਰਿਤ",
      "ਸੁਧਾ",
      "ਸ਼ਰਬਤ",
      "ਦੁੱਧ"
    ],
    "explanationPa": "‘ਜ਼ਹਿਰ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਵਿਸ਼’ ਜਾਂ ਗਰਲ ਹੈ।"
  },
  {
    "id": "SYN-118",
    "headword": "ਕ੍ਰੋਧ",
    "primarySynonym": "ਗੁੱਸਾ",
    "otherSynonyms": [
      "ਰੋਹ",
      "ਤੈਸ਼",
      "ਕਰੋਪ"
    ],
    "distractors": [
      "ਸ਼ਾਂਤੀ",
      "ਪਿਆਰ",
      "ਨਿਮਰਤਾ",
      "ਦਇਆ"
    ],
    "explanationPa": "‘ਕ੍ਰੋਧ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਗੁੱਸਾ’ ਜਾਂ ਰੋਹ ਹੈ।"
  },
  {
    "id": "SYN-119",
    "headword": "ਪਾਪ",
    "primarySynonym": "ਗੁਨਾਹ",
    "otherSynonyms": [
      "ਦੋਸ਼",
      "ਜੁਰਮ",
      "ਅਪਰਾਧ"
    ],
    "distractors": [
      "ਪੁੰਨ",
      "ਨੇਕੀ",
      "ਭਲਾਈ",
      "ਧਰਮ"
    ],
    "explanationPa": "‘ਪਾਪ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਗੁਨਾਹ’ ਜਾਂ ਅਪਰਾਧ ਹੈ।"
  },
  {
    "id": "SYN-120",
    "headword": "ਪੁੰਨ",
    "primarySynonym": "ਨੇਕੀ",
    "otherSynonyms": [
      "ਭਲਾਈ",
      "ਧਰਮ-ਕਰਮ",
      "ਸੁਕ੍ਰਿਤ"
    ],
    "distractors": [
      "ਪਾਪ",
      "ਗੁਨਾਹ",
      "ਬਦੀ",
      "ਜੁਰਮ"
    ],
    "explanationPa": "‘ਪੁੰਨ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਨੇਕੀ’ ਜਾਂ ਭਲਾਈ ਹੈ।"
  },
  {
    "id": "SYN-121",
    "headword": "ਅਕਲ",
    "primarySynonym": "ਮੱਤ",
    "otherSynonyms": [
      "ਬੁੱਧੀ",
      "ਸਮਝ",
      "ਦਾਨਾਈ"
    ],
    "distractors": [
      "ਬੇਵਕੂਫ਼ੀ",
      "ਮੂਰਖਤਾ",
      "ਅਗਿਆਨ",
      "ਭੁੱਲ"
    ],
    "explanationPa": "‘ਅਕਲ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਮੱਤ’ ਜਾਂ ਬੁੱਧੀ ਹੈ।"
  },
  {
    "id": "SYN-122",
    "headword": "ਮੂਰਖ",
    "primarySynonym": "ਬੇਵਕੂਫ਼",
    "otherSynonyms": [
      "ਅਗਿਆਨੀ",
      "ਜੜ੍ਹ",
      "ਨਿਰਬੁੱਧੀ"
    ],
    "distractors": [
      "ਸਿਆਣਾ",
      "ਦਾਨਿਸ਼ਮੰਦ",
      "ਵਿਦਵਾਨ",
      "ਚਤੁਰ"
    ],
    "explanationPa": "‘ਮੂਰਖ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਬੇਵਕੂਫ਼’ ਜਾਂ ਜੜ੍ਹ ਹੈ।"
  },
  {
    "id": "SYN-123",
    "headword": "ਵਿਦਵਾਨ",
    "primarySynonym": "ਪੰਡਿਤ",
    "otherSynonyms": [
      "ਗਿਆਨੀ",
      "ਦਾਨਿਸ਼ਮੰਦ",
      "ਆਲਿਮ"
    ],
    "distractors": [
      "ਅਨਪੜ੍ਹ",
      "ਮੂਰਖ",
      "ਗਵਾਰ",
      "ਅਣਜਾਣ"
    ],
    "explanationPa": "‘ਵਿਦਵਾਨ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਪੰਡਿਤ’ ਜਾਂ ਗਿਆਨੀ ਹੈ।"
  },
  {
    "id": "SYN-124",
    "headword": "ਚਤੁਰ",
    "primarySynonym": "ਚਲਾਕ",
    "otherSynonyms": [
      "ਹੁਸ਼ਿਆਰ",
      "ਤੇਜ਼",
      "ਸਿਆਣਾ"
    ],
    "distractors": [
      "ਭੋਲਾ",
      "ਸਿੱਧਾ",
      "ਮੂਰਖ",
      "ਸੁਸਤ"
    ],
    "explanationPa": "‘ਚਤੁਰ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਚਲਾਕ’ ਜਾਂ ਹੁਸ਼ਿਆਰ ਹੈ।"
  },
  {
    "id": "SYN-125",
    "headword": "ਭੋਲਾ",
    "primarySynonym": "ਨਿਰਛਲ",
    "otherSynonyms": [
      "ਸਿੱਧਾ-ਸਾਦਾ",
      "ਮਾਸੂਮ",
      "ਨਿਰਦੋਸ਼"
    ],
    "distractors": [
      "ਚਲਾਕ",
      "ਮੱਕਾਰ",
      "ਧੋਖੇਬਾਜ਼",
      "ਤੇਜ਼"
    ],
    "explanationPa": "‘ਭੋਲਾ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਨਿਰਛਲ’ ਜਾਂ ਮਾਸੂਮ ਹੈ।"
  },
  {
    "id": "SYN-126",
    "headword": "ਦਰਿਆ",
    "primarySynonym": "ਨਦੀ",
    "otherSynonyms": [
      "ਸਰਿਤਾ",
      "ਪ੍ਰਵਾਹ",
      "ਨਹਿਰ"
    ],
    "distractors": [
      "ਸਮੁੰਦਰ",
      "ਪਹਾੜ",
      "ਮਾਰੂਥਲ",
      "ਤਲਾਅ"
    ],
    "explanationPa": "‘ਦਰਿਆ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਨਦੀ’ ਜਾਂ ਸਰਿਤਾ ਹੈ।"
  },
  {
    "id": "SYN-127",
    "headword": "ਸਮੁੰਦਰ",
    "primarySynonym": "ਸਾਗਰ",
    "otherSynonyms": [
      "ਬਹਿਰ",
      "ਸਿੰਧੂ",
      "ਰਤਨਾਕਰ"
    ],
    "distractors": [
      "ਨਦੀ",
      "ਦਰਿਆ",
      "ਖੂਹ",
      "ਛੱਪੜ"
    ],
    "explanationPa": "‘ਸਮੁੰਦਰ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਸਾਗਰ’ ਜਾਂ ਸਿੰਧੂ ਹੈ।"
  },
  {
    "id": "SYN-128",
    "headword": "ਪਹਾੜ",
    "primarySynonym": "ਪਰਬਤ",
    "otherSynonyms": [
      "ਗਿਰੀ",
      "ਨਗ",
      "ਪਹਾੜੀ"
    ],
    "distractors": [
      "ਮੈਦਾਨ",
      "ਖੱਡ",
      "ਖਾਈ",
      "ਸਮੁੰਦਰ"
    ],
    "explanationPa": "‘ਪਹਾੜ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਪਰਬਤ’ ਜਾਂ ਗਿਰੀ ਹੈ।"
  },
  {
    "id": "SYN-129",
    "headword": "ਮਿੱਟੀ",
    "primarySynonym": "ਧੂੜ",
    "otherSynonyms": [
      "ਗ਼ੁਬਾਰ",
      "ਖ਼ਾਕ",
      "ਮਿਰਤਿਕਾ"
    ],
    "distractors": [
      "ਪਾਣੀ",
      "ਅੱਗ",
      "ਪੱਥਰ",
      "ਸੋਨਾ"
    ],
    "explanationPa": "‘ਮਿੱਟੀ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਧੂੜ’ ਜਾਂ ਖ਼ਾਕ ਹੈ।"
  },
  {
    "id": "SYN-130",
    "headword": "ਕੱਪੜਾ",
    "primarySynonym": "ਬਸਤਰ",
    "otherSynonyms": [
      "ਪੁਸ਼ਾਕ",
      "ਲਿਬਾਸ",
      "ਵਸਤਰ"
    ],
    "distractors": [
      "ਗਹਿਣਾ",
      "ਜੁੱਤੀ",
      "ਟੋਪੀ",
      "ਸ਼ਿੰਗਾਰ"
    ],
    "explanationPa": "‘ਕੱਪੜਾ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਬਸਤਰ’ ਜਾਂ ਪੁਸ਼ਾਕ ਹੈ।"
  },
  {
    "id": "SYN-131",
    "headword": "ਤਾਕਤ",
    "primarySynonym": "ਬਲ",
    "otherSynonyms": [
      "ਸ਼ਕਤੀ",
      "ਜ਼ੋਰ",
      "ਸਮਰੱਥਾ"
    ],
    "distractors": [
      "ਕਮਜ਼ੋਰੀ",
      "ਨਿਰਬਲਤਾ",
      "ਢਿੱਲ",
      "ਲਾਚਾਰੀ"
    ],
    "explanationPa": "‘ਤਾਕਤ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਬਲ’ ਜਾਂ ਸ਼ਕਤੀ ਹੈ।"
  },
  {
    "id": "SYN-132",
    "headword": "ਦੁੱਖ",
    "primarySynonym": "ਕਲੇਸ਼",
    "otherSynonyms": [
      "ਪੀੜ",
      "ਕਸ਼ਟ",
      "ਦਰਦ"
    ],
    "distractors": [
      "ਸੁੱਖ",
      "ਆਨੰਦ",
      "ਖ਼ੁਸ਼ੀ",
      "ਚੈਨ"
    ],
    "explanationPa": "‘ਦੁੱਖ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਕਲੇਸ਼’ ਜਾਂ ਕਸ਼ਟ ਹੈ।"
  },
  {
    "id": "SYN-133",
    "headword": "ਸੁੱਖ",
    "primarySynonym": "ਆਨੰਦ",
    "otherSynonyms": [
      "ਚੈਨ",
      "ਅਮਨ",
      "ਸੁਖ-ਚੈਨ"
    ],
    "distractors": [
      "ਦੁੱਖ",
      "ਦਰਦ",
      "ਪੀੜ",
      "ਸੋਗ"
    ],
    "explanationPa": "‘ਸੁੱਖ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਆਨੰਦ’ ਜਾਂ ਚੈਨ ਹੈ।"
  },
  {
    "id": "SYN-134",
    "headword": "ਮੌਤ",
    "primarySynonym": "ਕਾਲ",
    "otherSynonyms": [
      "ਮਰਨ",
      "ਦੇਹਾਂਤ",
      "ਕੂਚ"
    ],
    "distractors": [
      "ਜੀਵਨ",
      "ਜਨਮ",
      "ਜ਼ਿੰਦਗੀ",
      "ਸਵਾਸ"
    ],
    "explanationPa": "‘ਮੌਤ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਦੇਹਾਂਤ’ ਜਾਂ ਕਾਲ ਹੈ।"
  },
  {
    "id": "SYN-135",
    "headword": "ਜੀਵਨ",
    "primarySynonym": "ਜ਼ਿੰਦਗੀ",
    "otherSynonyms": [
      "ਹਯਾਤੀ",
      "ਜੀਵਤ",
      "ਪ੍ਰਾਣ"
    ],
    "distractors": [
      "ਮੌਤ",
      "ਮਰਗ",
      "ਨਾਸ਼",
      "ਕਾਲ"
    ],
    "explanationPa": "‘ਜੀਵਨ’ ਦਾ ਸਮਾਨਾਰਥਕ ‘ਜ਼ਿੰਦਗੀ’ ਜਾਂ ਹਯਾਤੀ ਹੈ।"
  }
];

export interface AntonymPair {
  readonly id: string;
  readonly word: string;
  readonly antonym: string;
  readonly distractors: readonly string[];
  readonly explanationPa: string;
}

export const ANTONYM_PAIRS: readonly AntonymPair[] = [
  {
    id: "ANT-001",
    word: "ਉਸਤਤ",
    antonym: "ਨਿੰਦਿਆ",
    distractors: ["ਪ੍ਰਸ਼ੰਸਾ", "ਸਿਫ਼ਤ", "ਸਤਿਕਾਰ", "ਪੂਜਾ"],
    explanationPa: "‘ਉਸਤਤ’ ਦਾ ਅਰਥ ਵਡਿਆਈ ਜਾਂ ਪ੍ਰਸ਼ੰਸਾ ਹੁੰਦਾ ਹੈ, ਇਸ ਦਾ ਉਲਟ (ਵਿਰੋਧੀ) ਸ਼ਬਦ ‘ਨਿੰਦਿਆ’ ਹੈ।",
  },
  {
    id: "ANT-002",
    word: "ਆਮਦਨ",
    antonym: "ਖ਼ਰਚ",
    distractors: ["ਕਮਾਈ", "ਮੁਨਾਫ਼ਾ", "ਪੂੰਜੀ", "ਧਨ"],
    explanationPa: "‘ਆਮਦਨ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਖ਼ਰਚ’ ਹੈ। ਕਮਾਈ ਅਤੇ ਮੁਨਾਫ਼ਾ ਇਸ ਦੇ ਸਮਾਨਾਰਥੀ ਭਾਵ ਦਿੰਦੇ ਹਨ।",
  },
  {
    id: "ANT-003",
    word: "ਖ਼ੁਸ਼ਬੂ",
    antonym: "ਬਦਬੂ",
    distractors: ["ਸੁਗੰਧ", "ਮਹਿਕ", "ਫੁੱਲ", "ਹਵਾ"],
    explanationPa: "‘ਖ਼ੁਸ਼ਬੂ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਬਦਬੂ’ (ਦੁਰਗੰਧ) ਹੈ। ਸੁਗੰਧ ਅਤੇ ਮਹਿਕ ਇਸ ਦੇ ਸਮਾਨਾਰਥਕ ਹਨ।",
  },
  {
    id: "ANT-004",
    word: "ਨੇਕੀ",
    antonym: "ਬਦੀ",
    distractors: ["ਭਲਾਈ", "ਚੰਗਿਆਈ", "ਪੁੰਨ", "ਦਇਆ"],
    explanationPa: "‘ਨੇਕੀ’ ਦਾ ਉਲਟ ਅਰਥ ‘ਬਦੀ’ (ਬੁਰਾਈ) ਹੁੰਦਾ ਹੈ।",
  },
  {
    id: "ANT-005",
    word: "ਪ੍ਰਤੱਖ",
    antonym: "ਅਪ੍ਰਤੱਖ",
    distractors: ["ਸਪਸ਼ਟ", "ਸਾਹਮਣੇ", "ਸੱਚਾ", "ਦਿੱਸਦਾ"],
    explanationPa: "ਜੋ ਸਾਹਮਣੇ ਹੋਵੇ ਉਹ ‘ਪ੍ਰਤੱਖ’ ਅਤੇ ਜੋ ਸਾਹਮਣੇ ਨਾ ਹੋਵੇ ਉਹ ‘ਅਪ੍ਰਤੱਖ’ (ਜਾਂ ਗੁਪਤ) ਹੁੰਦਾ ਹੈ।",
  },
  {
    id: "ANT-006",
    word: "ਸੂਖ਼ਮ",
    antonym: "ਅਸਥੂਲ",
    distractors: ["ਬਰੀਕ", "ਛੋਟਾ", "ਕੋਮਲ", "ਪਤਲਾ"],
    explanationPa: "‘ਸੂਖ਼ਮ’ (ਅਤਿ ਬਰੀਕ) ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਅਸਥੂਲ’ (ਮੋਟਾ/ਵਿਸ਼ਾਲ) ਹੁੰਦਾ ਹੈ।",
  },
  {
    id: "ANT-007",
    word: "ਉੱਚਾ",
    antonym: "ਨੀਵਾਂ",
    distractors: ["ਲੰਮਾ", "ਚੌੜਾ", "ਵੱਡਾ", "ਮੋਟਾ"],
    explanationPa: "‘ਉੱਚਾ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਨੀਵਾਂ’ ਹੁੰਦਾ ਹੈ।",
  },
  {
    id: "ANT-008",
    word: "ਅੰਮ੍ਰਿਤ",
    antonym: "ਜ਼ਹਿਰ",
    distractors: ["ਸ਼ਰਬਤ", "ਦੁੱਧ", "ਪਾਣੀ", "ਸ਼ਹਿਦ"],
    explanationPa: "‘ਅੰਮ੍ਰਿਤ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਜ਼ਹਿਰ’ (ਜਾਂ ਵਿਹੁ) ਹੁੰਦਾ ਹੈ।",
  },
  {
    id: "ANT-009",
    word: "ਸੁਖ",
    antonym: "ਦੁਖ",
    distractors: ["ਅਨੰਦ", "ਖ਼ੁਸ਼ੀ", "ਚੈਨ", "ਅਰਾਮ"],
    explanationPa: "‘ਸੁਖ’ ਦਾ ਉਲਟ ਸ਼ਬਦ ‘ਦੁਖ’ ਹੈ।",
  },
  {
    id: "ANT-010",
    word: "ਸੱਚ",
    antonym: "ਝੂਠ",
    distractors: ["ਧੋਖਾ", "ਫ਼ਰੇਬ", "ਪਾਪ", "ਬੁਰਾਈ"],
    explanationPa: "‘ਸੱਚ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਝੂਠ’ ਹੈ।",
  },
  {
    id: "ANT-011",
    word: "ਆਦਰ",
    antonym: "ਨਿਰਾਦਰ",
    distractors: ["ਸਤਿਕਾਰ", "ਮਾਣ", "ਵਡਿਆਈ", "ਪਿਆਰ"],
    explanationPa: "‘ਆਦਰ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਨਿਰਾਦਰ’ (ਬੇਇੱਜ਼ਤੀ) ਹੈ।",
  },
  {
    id: "ANT-012",
    word: "ਅਸਲੀ",
    antonym: "ਨਕਲੀ",
    distractors: ["ਕੱਚਾ", "ਮਾੜਾ", "ਪੁਰਾਣਾ", "ਸਸਤਾ"],
    explanationPa: "‘ਅਸਲੀ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਨਕਲੀ’ ਹੁੰਦਾ ਹੈ।",
  },
  {
    id: "ANT-013",
    word: "ਜਿੱਤ",
    antonym: "ਹਾਰ",
    distractors: ["ਮੁਕਾਬਲਾ", "ਸਮਝੌਤਾ", "ਇਨਾਮ", "ਖੇਡ"],
    explanationPa: "‘ਜਿੱਤ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਹਾਰ’ ਹੁੰਦਾ ਹੈ।",
  },
  {
    id: "ANT-014",
    word: "ਪੁੰਨ",
    antonym: "ਪਾਪ",
    distractors: ["ਨੇਕੀ", "ਧਰਮ", "ਸੇਵਾ", "ਦਇਆ"],
    explanationPa: "‘ਪੁੰਨ’ ਦਾ ਉਲਟ-ਭਾਵੀ ਸ਼ਬਦ ‘ਪਾਪ’ ਹੈ।",
  },
  {
    id: "ANT-015",
    word: "ਆਸਤਿਕ",
    antonym: "ਨਾਸਤਿਕ",
    distractors: ["ਧਰਮੀ", "ਸਾਧੂ", "ਭਗਤ", "ਪੂਜਾਰੀ"],
    explanationPa: "ਰੱਬ ਨੂੰ ਮੰਨਣ ਵਾਲਾ ‘ਆਸਤਿਕ’ ਅਤੇ ਨਾ ਮੰਨਣ ਵਾਲਾ ‘ਨਾਸਤਿਕ’ ਹੁੰਦਾ ਹੈ।",
  },
  {
    id: "ANT-016",
    word: "ਅੰਦਰਲਾ",
    antonym: "ਬਾਹਰਲਾ",
    distractors: ["ਵਿਚਕਾਰਲਾ", "ਉੱਪਰਲਾ", "ਹੇਠਲਾ", "ਸਾਹਮਣੇ"],
    explanationPa: "‘ਅੰਦਰਲਾ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਬਾਹਰਲਾ’ ਹੈ।",
  },
  {
    id: "ANT-017",
    word: "ਆਰੰਭ",
    antonym: "ਅੰਤ",
    distractors: ["ਸ਼ੁਰੂ", "ਮੁੱਢ", "ਪਹਿਲ", "ਵਿਚਕਾਰ"],
    explanationPa: "‘ਆਰੰਭ’ ਦਾ ਉਲਟ ਅਰਥ ‘ਅੰਤ’ (ਸਮਾਪਤੀ) ਹੁੰਦਾ ਹੈ।",
  },
  {
    id: "ANT-018",
    word: "ਅਕ੍ਰਿਤਘਣ",
    antonym: "ਕ੍ਰਿਤੱਗ",
    distractors: ["ਕ੍ਰਿਤਾਰਥ", "ਕੁਪੁੱਤਰ", "ਬੇਈਮਾਨ", "ਪਾਪੀ"],
    explanationPa: "ਕੀਤੀ ਨੇਕੀ ਭੁਲਾਉਣ ਵਾਲਾ ‘ਅਕ੍ਰਿਤਘਣ’ ਅਤੇ ਨੇਕੀ ਯਾਦ ਰੱਖਣ ਵਾਲਾ ‘ਕ੍ਰਿਤੱਗ’ ਹੁੰਦਾ ਹੈ।",
  },
  {
    id: "ANT-019",
    word: "ਈਮਾਨਦਾਰ",
    antonym: "ਬੇਈਮਾਨ",
    distractors: ["ਧਰਮੀ", "ਸੱਚਾ", "ਨੇਕ", "ਸਾਊ"],
    explanationPa: "‘ਈਮਾਨਦਾਰ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਬੇਈਮਾਨ’ ਹੁੰਦਾ ਹੈ।",
  },
  {
    id: "ANT-020",
    word: "ਉਧਾਰ",
    antonym: "ਨਕਦ",
    distractors: ["ਕਰਜ਼ਾ", "ਕਿਸ਼ਤ", "ਵਿਆਜ", "ਰਕਮ"],
    explanationPa: "‘ਉਧਾਰ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਨਕਦ’ ਹੁੰਦਾ ਹੈ।",
  },
  {
    id: "ANT-021",
    word: "ਉਜਾੜਨਾ",
    antonym: "ਵਸਾਉਣਾ",
    distractors: ["ਤੋੜਨਾ", "ਬਰਬਾਦ ਕਰਨਾ", "ਲੁੱਟਣਾ", "ਸਾੜਨਾ"],
    explanationPa: "‘ਉਜਾੜਨਾ’ ਦਾ ਉਲਟ ਅਰਥ ‘ਵਸਾਉਣਾ’ (ਨਿਰਮਾਣ ਕਰਨਾ) ਹੈ।",
  },
  {
    id: "ANT-022",
    word: "ਆਸ",
    antonym: "ਨਿਰਾਸ਼ਾ",
    distractors: ["ਉਮੀਦ", "ਭਰੋਸਾ", "ਯਕੀਨ", "ਇੱਛਾ"],
    explanationPa: "‘ਆਸ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਨਿਰਾਸ਼ਾ’ ਹੈ।",
  },
  {
    id: "ANT-023",
    word: "ਏਕਤਾ",
    antonym: "ਫੁੱਟ",
    distractors: ["ਮੇਲ", "ਇਤਫ਼ਾਕ", "ਸੰਗਠਨ", "ਪਿਆਰ"],
    explanationPa: "‘ਏਕਤਾ’ ਦਾ ਉਲਟ-ਭਾਵੀ ਸ਼ਬਦ ‘ਫੁੱਟ’ ਜਾਂ ‘ਵਿਰੋਧ’ ਹੈ।",
  },
  {
    id: "ANT-024",
    word: "ਔਖਾ",
    antonym: "ਸੌਖਾ",
    distractors: ["ਕਠਿਨ", "ਮੁਸ਼ਕਿਲ", "ਗੰਭੀਰ", "ਡੂੰਘਾ"],
    explanationPa: "‘ਔਖਾ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਸੌਖਾ’ (ਸਰਲ) ਹੈ।",
  },
  {
    id: "ANT-025",
    word: "ਖਰਾ",
    antonym: "ਖੋਟਾ",
    distractors: ["ਸੱਚਾ", "ਅਸਲੀ", "ਸ਼ੁੱਧ", "ਚੋਖਾ"],
    explanationPa: "‘ਖਰਾ’ ਦਾ ਉਲਟ ‘ਖੋਟਾ’ (ਮਿਲਾਵਟੀ) ਹੁੰਦਾ ਹੈ।",
  },
  {
    id: "ANT-026",
    word: "ਗੁਣ",
    antonym: "ਔਗੁਣ",
    distractors: ["ਖ਼ੂਬੀ", "ਸਿਫ਼ਤ", "ਹੁਨਰ", "ਨੇਕੀ"],
    explanationPa: "‘ਗੁਣ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਔਗੁਣ’ (ਦੋਸ਼) ਹੁੰਦਾ ਹੈ।",
  },
  {
    id: "ANT-027",
    word: "ਚੇਤਨ",
    antonym: "ਜੜ੍ਹ",
    distractors: ["ਸੁਚੇਤ", "ਜੀਵਤ", "ਜਾਗਦਾ", "ਹੋਸ਼ਿਆਰ"],
    explanationPa: "‘ਚੇਤਨ’ (ਜੀਵਤ/ਹੋਸ਼ਮੰਦ) ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਜੜ੍ਹ’ (ਬੇਜਾਨ) ਹੈ।",
  },
  {
    id: "ANT-028",
    word: "ਜਨਮ",
    antonym: "ਮਰਨ",
    distractors: ["ਪੈਦਾਇਸ਼", "ਅਵਤਾਰ", "ਜ਼ਿੰਦਗੀ", "ਜੀਵਨ"],
    explanationPa: "‘ਜਨਮ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਮਰਨ’ (ਜਾਂ ਮੌਤ) ਹੁੰਦਾ ਹੈ।",
  },
  {
    id: "ANT-029",
    word: "ਡਰਪੋਕ",
    antonym: "ਨਿਡਰ",
    distractors: ["ਕਾਇਰ", "ਬੁਜ਼ਦਿਲ", "ਕਮਜ਼ੋਰ", "ਡਰੂ"],
    explanationPa: "‘ਡਰਪੋਕ’ ਦਾ ਉਲਟ ‘ਨਿਡਰ’ (ਦਲੇਰ/ਬਹਾਦਰ) ਹੈ।",
  },
  {
    id: "ANT-030",
    word: "ਤਕੜਾ",
    antonym: "ਮਾੜਾ",
    distractors: ["ਬਲਵਾਨ", "ਮਜ਼ਬੂਤ", "ਜਵਾਨ", "ਤਾਕਤਵਰ"],
    explanationPa: "‘ਤਕੜਾ’ (ਬਲਵਾਨ) ਦਾ ਪੰਜਾਬੀ ਵਿਆਕਰਣ ਅਨੁਸਾਰ ਵਿਰੋਧੀ ‘ਮਾੜਾ’ (ਜਾਂ ਕਮਜ਼ੋਰ) ਹੈ।",
  },
  {
    id: "ANT-031",
    word: "ਧੁੱਪ",
    antonym: "ਛਾਂ",
    distractors: ["ਰੌਸ਼ਨੀ", "ਗਰਮੀ", "ਤਪਸ਼", "ਲੂ"],
    explanationPa: "‘ਧੁੱਪ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਛਾਂ’ ਹੈ।",
  },
  {
    id: "ANT-032",
    word: "ਪਿਆਰ",
    antonym: "ਨਫ਼ਰਤ",
    distractors: ["ਮੋਹ", "ਸਨੇਹ", "ਲਾਡ", "ਪ੍ਰੇਮ"],
    explanationPa: "‘ਪਿਆਰ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਨਫ਼ਰਤ’ (ਜਾਂ ਘਿਰਣਾ) ਹੁੰਦਾ ਹੈ।",
  },
  {
    id: "ANT-033",
    word: "ਸਵਦੇਸ਼",
    antonym: "ਪ੍ਰਦੇਸ਼",
    distractors: ["ਵਤਨ", "ਦੇਸ਼", "ਮਾਤ-ਭੂਮੀ", "ਨਗਰ"],
    explanationPa: "‘ਸਵਦੇਸ਼’ (ਆਪਣਾ ਦੇਸ਼) ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਪ੍ਰਦੇਸ਼’ (ਬਿਗਾਨਾ ਦੇਸ਼) ਹੈ।",
  },
  {
    id: "ANT-034",
    word: "ਭਲਾ",
    antonym: "ਬੁਰਾ",
    distractors: ["ਨੇਕ", "ਚੰਗਾ", "ਸਾਊ", "ਮਿੱਠਾ"],
    explanationPa: "‘ਭਲਾ’ ਦਾ ਉਲਟ ਅਰਥ ‘ਬੁਰਾ’ ਹੁੰਦਾ ਹੈ।",
  },
  {
    id: "ANT-035",
    word: "ਮਿੱਠਾ",
    antonym: "ਕੌੜਾ",
    distractors: ["ਸ਼ਹਿਦ", "ਖੰਡ", "ਗੁੜ", "ਸੁਆਦੀ"],
    explanationPa: "‘ਮਿੱਠਾ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਕੌੜਾ’ ਹੁੰਦਾ ਹੈ।",
  },
  {
    id: "ANT-036",
    word: "ਸਿਆਣਾ",
    antonym: "ਮੂਰਖ",
    distractors: ["ਅਕਲਮੰਦ", "ਦਾਨਾ", "ਸਮਝਦਾਰ", "ਸੁਜਾਨ"],
    explanationPa: "‘ਸਿਆਣਾ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਮੂਰਖ’ (ਬੇਸਮਝ) ਹੈ।",
  },
  {
    id: "ANT-037",
    word: "ਸੰਤੋਖੀ",
    antonym: "ਲੋਭੀ",
    distractors: ["ਸਬਰ ਵਾਲਾ", "ਦਾਨੀ", "ਸਾਧੂ", "ਤਿਆਗੀ"],
    explanationPa: "‘ਸੰਤੋਖੀ’ ਦਾ ਉਲਟ-ਭਾਵੀ ਸ਼ਬਦ ‘ਲੋਭੀ’ (ਲਾਲਚੀ) ਹੈ।",
  },
  {
    id: "ANT-038",
    word: "ਵਫ਼ਾਦਾਰ",
    antonym: "ਗ਼ੱਦਾਰ",
    distractors: ["ਸੱਚਾ", "ਵਿਸ਼ਵਾਸਪਾਤਰ", "ਸੇਵਕ", "ਸਾਥੀ"],
    explanationPa: "‘ਵਫ਼ਾਦਾਰ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਗ਼ੱਦਾਰ’ ਹੁੰਦਾ ਹੈ।",
  },
  {
    id: "ANT-039",
    word: "ਵਿਦਵਾਨ",
    antonym: "ਅਨਪੜ੍ਹ",
    distractors: ["ਪੰਡਿਤ", "ਗਿਆਨੀ", "ਦਾਨਿਸ਼ਮੰਦ", "ਪ੍ਰੋਫ਼ੈਸਰ"],
    explanationPa: "‘ਵਿਦਵਾਨ’ (ਪੜ੍ਹਿਆ-ਲਿਖਿਆ/ਗਿਆਨੀ) ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਅਨਪੜ੍ਹ’ (ਜਾਹਿਲ) ਹੈ।",
  },
  {
    id: "ANT-040",
    word: "ਸੋਗ",
    antonym: "ਹਰਖ",
    distractors: ["ਗ਼ਮ", "ਮਾਤਮ", "ਦੁੱਖ", "ਉਦਾਸੀ"],
    explanationPa: "‘ਸੋਗ’ (ਗ਼ਮ) ਦਾ ਸ਼ੁੱਧ ਟਕਸਾਲੀ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਹਰਖ’ (ਖ਼ੁਸ਼ੀ) ਹੁੰਦਾ ਹੈ।",
  },
  {
    id: "ANT-041",
    word: "ਸਵਰਗ",
    antonym: "ਨਰਕ",
    distractors: ["ਬੈਕੁੰਠ", "ਜੰਨਤ", "ਅਕਾਸ਼", "ਪੁਰੀ"],
    explanationPa: "‘ਸਵਰਗ’ ਦਾ ਉਲਟ ਅਰਥ ‘ਨਰਕ’ (ਦੋਜ਼ਖ਼) ਹੈ।",
  },
  {
    id: "ANT-042",
    word: "ਜੰਗ",
    antonym: "ਅਮਨ",
    distractors: ["ਯੁੱਧ", "ਲੜਾਈ", "ਰਣ", "ਖ਼ੂਨ-ਖ਼ਰਾਬਾ"],
    explanationPa: "‘ਜੰਗ’ ਦਾ ਉਲਟ ‘ਅਮਨ’ (ਜਾਂ ਸ਼ਾਂਤੀ) ਹੈ।",
  },
  {
    id: "ANT-043",
    word: "ਹਨੇਰਾ",
    antonym: "ਚਾਨਣ",
    distractors: ["ਕਾਲਖ", "ਰਾਤ", "ਧੁੰਦ", "ਛਾਂ"],
    explanationPa: "‘ਹਨੇਰਾ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਚਾਨਣ’ (ਰੌਸ਼ਨੀ) ਹੈ।",
  },
  {
    id: "ANT-044",
    word: "ਸੁਜਾਖਾ",
    antonym: "ਅੰਨ੍ਹਾ",
    distractors: ["ਦੇਖਣ ਵਾਲਾ", "ਅੱਖਾਂ ਵਾਲਾ", "ਸਿਆਣਾ", "ਚਾਨਣ"],
    explanationPa: "‘ਸੁਜਾਖਾ’ (ਜਿਸ ਦੀਆਂ ਅੱਖਾਂ ਠੀਕ ਹੋਣ) ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਅੰਨ੍ਹਾ’ ਹੁੰਦਾ ਹੈ।",
  },
  {
    id: "ANT-045",
    word: "ਉਰਲਾ",
    antonym: "ਪਰਲਾ",
    distractors: ["ਇੱਧਰਲਾ", "ਨੇੜਲਾ", "ਵਿਚਕਾਰਲਾ", "ਸਾਹਮਣਲਾ"],
    explanationPa: "‘ਉਰਲਾ’ (ਨੇੜਲਾ ਕੰਢਾ/ਪਾਸਾ) ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਪਰਲਾ’ (ਦੂਰ ਦਾ ਪਾਸਾ) ਹੁੰਦਾ ਹੈ।",
  },
  {
    id: "ANT-046",
    word: "ਅਗਲਾ",
    antonym: "ਪਿਛਲਾ",
    distractors: ["ਪਹਿਲਾ", "ਮੋਹਰੀ", "ਸਾਹਮਣਲਾ", "ਵਿਚਲਾ"],
    explanationPa: "‘ਅਗਲਾ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਪਿਛਲਾ’ ਹੁੰਦਾ ਹੈ।",
  },
  {
    id: "ANT-047",
    word: "ਅੰਮ੍ਰਿਤ",
    antonym: "ਜ਼ਹਿਰ",
    distractors: ["ਸ਼ਰਬਤ","ਦੁੱਧ","ਪਾਣੀ","ਮਿੱਠਾ"],
    explanationPa: "‘ਅੰਮ੍ਰਿਤ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਜ਼ਹਿਰ’ (ਵਿਹੁ) ਹੈ।",
  },
  {
    id: "ANT-048",
    word: "ਆਸਤਿਕ",
    antonym: "ਨਾਸਤਿਕ",
    distractors: ["ਧਰਮੀ","ਸੰਤ","ਸਾਧੂ","ਭਗਤ"],
    explanationPa: "‘ਆਸਤਿਕ’ ਦਾ ਉਲਟ ਸ਼ਬਦ ‘ਨਾਸਤਿਕ’ ਹੁੰਦਾ ਹੈ।",
  },
  {
    id: "ANT-049",
    word: "ਅਨੁਕੂਲ",
    antonym: "ਪ੍ਰਤੀਕੂਲ",
    distractors: ["ਸਮਾਨ","ਸਿੱਧਾ","ਸੌਖਾ","ਚੰਗਾ"],
    explanationPa: "‘ਅਨੁਕੂਲ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਪ੍ਰਤੀਕੂਲ’ ਹੈ।",
  },
  {
    id: "ANT-050",
    word: "ਆਦਰ",
    antonym: "ਨਿਰਾਦਰ",
    distractors: ["ਸਤਿਕਾਰ","ਮਾਣ","ਪਿਆਰ","ਪੂਜਾ"],
    explanationPa: "‘ਆਦਰ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਨਿਰਾਦਰ’ (ਬੇਇੱਜ਼ਤੀ) ਹੈ।",
  },
  {
    id: "ANT-051",
    word: "ਸੁਆਰਥੀ",
    antonym: "ਪਰਉਪਕਾਰੀ",
    distractors: ["ਲਾਲਚੀ","ਖ਼ੁਦਗ਼ਰਜ਼","ਚਲਾਕ","ਕੰਜੂਸ"],
    explanationPa: "‘ਸੁਆਰਥੀ’ ਦਾ ਉਲਟ-ਭਾਵੀ ਸ਼ਬਦ ‘ਪਰਉਪਕਾਰੀ’ ਹੁੰਦਾ ਹੈ।",
  },
  {
    id: "ANT-052",
    word: "ਇਕੱਠ",
    antonym: "ਵੰਡ",
    distractors: ["ਸਭਾ","ਭੀੜ","ਮੇਲਾ","ਸੰਗਤ"],
    explanationPa: "‘ਇਕੱਠ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਵੰਡ’ ਜਾਂ ਖਿਲਾਰਾ ਹੈ।",
  },
  {
    id: "ANT-053",
    word: "ਉੱਦਮੀ",
    antonym: "ਆਲਸੀ",
    distractors: ["ਮਿਹਨਤੀ","ਚੁਸਤ","ਕਿਰਤੀ","ਵੀਰ"],
    explanationPa: "‘ਉੱਦਮੀ’ (ਮਿਹਨਤੀ) ਦਾ ਉਲਟ ‘ਆਲਸੀ’ ਹੁੰਦਾ ਹੈ।",
  },
  {
    id: "ANT-054",
    word: "ਉਜਾੜ",
    antonym: "ਵੱਸੋਂ",
    distractors: ["ਜੰਗਲ","ਵੀਰਾਨ","ਖੰਡਰ","ਰੇਗਿਸਤਾਨ"],
    explanationPa: "‘ਉਜਾੜ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਵੱਸੋਂ’ ਜਾਂ ਆਬਾਦੀ ਹੈ।",
  },
  {
    id: "ANT-055",
    word: "ਸਥੂਲ",
    antonym: "ਸੂਖ਼ਮ",
    distractors: ["ਵੱਡਾ","ਭਾਰੀ","ਮੋਟਾ","ਚੌੜਾ"],
    explanationPa: "‘ਸਥੂਲ’ (ਵੱਡੇ ਅਕਾਰ ਵਾਲਾ) ਦਾ ਵਿਰੋਧੀ ‘ਸੂਖ਼ਮ’ (ਬਰੀਕ) ਹੈ।",
  },
  {
    id: "ANT-056",
    word: "ਸਜੀਵ",
    antonym: "ਨਿਰਜੀਵ",
    distractors: ["ਜਿਊਂਦਾ","ਪ੍ਰਾਣੀ","ਚੇਤਨ","ਹਰਕਤ"],
    explanationPa: "‘ਸਜੀਵ’ (ਜਿਊਂਦਾ) ਦਾ ਉਲਟ ਸ਼ਬਦ ‘ਨਿਰਜੀਵ’ (ਬੇਜਾਨ) ਹੈ।",
  },
  {
    id: "ANT-057",
    word: "ਸਦੀਵੀ",
    antonym: "ਨਾਸ਼ਵਾਨ",
    distractors: ["ਅਮਰ","ਹਮੇਸ਼ਾ","ਅਟੱਲ","ਪੱਕਾ"],
    explanationPa: "‘ਸਦੀਵੀ’ (ਹਮੇਸ਼ਾ ਰਹਿਣ ਵਾਲਾ) ਦਾ ਵਿਰੋਧੀ ‘ਨਾਸ਼ਵਾਨ’ ਹੈ।",
  },
  {
    id: "ANT-058",
    word: "ਸੁਚੱਜਾ",
    antonym: "ਕੁਚੱਜਾ",
    distractors: ["ਸਲੀਕੇਦਾਰ","ਸਿਆਣਾ","ਚੰਗਾ","ਹੁਨਰਮੰਦ"],
    explanationPa: "‘ਸੁਚੱਜਾ’ ਦਾ ਉਲਟ ਸ਼ਬਦ ‘ਕੁਚੱਜਾ’ ਹੁੰਦਾ ਹੈ।",
  },
  {
    id: "ANT-059",
    word: "ਸੁਗੰਧ",
    antonym: "ਦੁਰਗੰਧ",
    distractors: ["ਖ਼ੁਸ਼ਬੂ","ਮਹਿਕ","ਵਾਸ਼ਨਾ","ਫੁੱਲ"],
    explanationPa: "‘ਸੁਗੰਧ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਦੁਰਗੰਧ’ (ਬਦਬੂ) ਹੈ।",
  },
  {
    id: "ANT-060",
    word: "ਹਾਨੀ",
    antonym: "ਲਾਭ",
    distractors: ["ਨੁਕਸਾਨ","ਘਾਟਾ","ਤੋਟਾ","ਖ਼ਰਾਬੀ"],
    explanationPa: "‘ਹਾਨੀ’ (ਨੁਕਸਾਨ) ਦਾ ਵਿਰੋਧੀ ‘ਲਾਭ’ (ਮੁਨਾਫ਼ਾ) ਹੈ।",
  },
  {
    id: "ANT-061",
    word: "ਕੌੜਾ",
    antonym: "ਮਿੱਠਾ",
    distractors: ["ਖੱਟਾ","ਲੂਣਾ","ਫਿੱਕਾ","ਕਸੈਲਾ"],
    explanationPa: "‘ਕੌੜਾ’ ਦਾ ਉਲਟ ਸ਼ਬਦ ‘ਮਿੱਠਾ’ ਹੈ।",
  },
  {
    id: "ANT-062",
    word: "ਕੱਚਾ",
    antonym: "ਪੱਕਾ",
    distractors: ["ਹਰਾ","ਤਾਜ਼ਾ","ਕੋਮਲ","ਨਰਮ"],
    explanationPa: "‘ਕੱਚਾ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਪੱਕਾ’ ਹੈ।",
  },
  {
    id: "ANT-063",
    word: "ਖਰਾ",
    antonym: "ਖੋਟਾ",
    distractors: ["ਸ਼ੁੱਧ","ਸੱਚਾ","ਅਸਲੀ","ਚੰਗਾ"],
    explanationPa: "‘ਖਰਾ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਖੋਟਾ’ (ਮਿਲਾਵਟੀ) ਹੈ।",
  },
  {
    id: "ANT-064",
    word: "ਗੁਪਤ",
    antonym: "ਪ੍ਰਗਟ",
    distractors: ["ਲੁਕਵਾਂ","ਪਰਦੇਦਾਰ","ਓਹਲੇ","ਗੁੜ੍ਹਾ"],
    explanationPa: "‘ਗੁਪਤ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਪ੍ਰਗਟ’ (ਜ਼ਾਹਰ) ਹੈ।",
  },
  {
    id: "ANT-065",
    word: "ਚਾਨਣਾ",
    antonym: "ਹਨੇਰਾ",
    distractors: ["ਰੌਸ਼ਨੀ","ਉਜਾਲਾ","ਸਵੇਰ","ਦਿਨ"],
    explanationPa: "‘ਚਾਨਣਾ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਹਨੇਰਾ’ ਹੈ।",
  },
  {
    id: "ANT-066",
    word: "ਚੇਤਨ",
    antonym: "ਜੜ੍ਹ",
    distractors: ["ਸੁਚੇਤ","ਜਿਊਂਦਾ","ਜਾਗਦਾ","ਹੋਸ਼"],
    explanationPa: "‘ਚੇਤਨ’ (ਜਾਗ੍ਰਿਤ) ਦਾ ਵਿਰੋਧੀ ‘ਜੜ੍ਹ’ (ਬੇਹੋਸ਼/ਬੇਜਾਨ) ਹੈ।",
  },
  {
    id: "ANT-067",
    word: "ਛਾਂ",
    antonym: "ਧੁੱਪ",
    distractors: ["ਰੁੱਖ","ਠੰਢ","ਹਨੇਰਾ","ਬੱਦਲ"],
    explanationPa: "‘ਛਾਂ’ ਦਾ ਉਲਟ ਸ਼ਬਦ ‘ਧੁੱਪ’ ਹੈ।",
  },
  {
    id: "ANT-068",
    word: "ਜਿੱਤ",
    antonym: "ਹਾਰ",
    distractors: ["ਵਿਜੈ","ਫ਼ਤਹਿ","ਕਾਮਯਾਬੀ","ਜੈ"],
    explanationPa: "‘ਜਿੱਤ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਹਾਰ’ (ਸ਼ਿਕਸਤ) ਹੈ।",
  },
  {
    id: "ANT-069",
    word: "ਜੋੜਨਾ",
    antonym: "ਤੋੜਨਾ",
    distractors: ["ਇਕੱਠਾ ਕਰਨਾ","ਗੰਢਣਾ","ਮਿਲਾਉਣਾ","ਰੱਖਣਾ"],
    explanationPa: "‘ਜੋੜਨਾ’ ਦਾ ਉਲਟ ਸ਼ਬਦ ‘ਤੋੜਨਾ’ ਹੈ।",
  },
  {
    id: "ANT-070",
    word: "ਝੂਠ",
    antonym: "ਸੱਚ",
    distractors: ["ਕੂੜ","ਫ਼ਰੇਬ","ਧੋਖਾ","ਦਗ਼ਾ"],
    explanationPa: "‘ਝੂਠ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਸੱਚ’ ਹੈ।",
  },
  {
    id: "ANT-071",
    word: "ਟਿਕਾਊ",
    antonym: "ਅਸਥਿਰ",
    distractors: ["ਪੱਕਾ","ਮਜ਼ਬੂਤ","ਸਦੀਵੀ","ਸਥਾਈ"],
    explanationPa: "‘ਟਿਕਾਊ’ ਦਾ ਵਿਰੋਧੀ ‘ਅਸਥਿਰ’ ਹੈ।",
  },
  {
    id: "ANT-072",
    word: "ਠੰਢਾ",
    antonym: "ਤੱਤਾ",
    distractors: ["ਸੀਤਲ","ਬਰਫ਼ੀਲਾ","ਕੋਸਾ","ਸ਼ਾਂਤ"],
    explanationPa: "‘ਠੰਢਾ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਤੱਤਾ’ (ਗਰਮ) ਹੈ।",
  },
  {
    id: "ANT-073",
    word: "ਡਰਪੋਕ",
    antonym: "ਨਿਡਰ",
    distractors: ["ਕਾਇਰ","ਬੁਜ਼ਦਿਲ","ਕਮਜ਼ੋਰ","ਡਰੂ"],
    explanationPa: "‘ਡਰਪੋਕ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਨਿਡਰ’ (ਦਲੇਰ) ਹੈ।",
  },
  {
    id: "ANT-074",
    word: "ਢਿੱਲਾ",
    antonym: "ਚੁਸਤ",
    distractors: ["ਸੁਸਤ","ਆਲਸੀ","ਮੱਠਾ","ਹੌਲੀ"],
    explanationPa: "‘ਢਿੱਲਾ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਚੁਸਤ’ (ਫੁਰਤੀਲਾ) ਹੈ।",
  },
  {
    id: "ANT-075",
    word: "ਤਾਰਨਾ",
    antonym: "ਡੋਬਣਾ",
    distractors: ["ਬਚਾਉਣਾ","ਪਾਰ ਲਾਉਣਾ","ਤੈਰਨਾ","ਖਿੱਚਣਾ"],
    explanationPa: "‘ਤਾਰਨਾ’ ਦਾ ਉਲਟ ਸ਼ਬਦ ‘ਡੋਬਣਾ’ ਹੈ।",
  },
  {
    id: "ANT-076",
    word: "ਦੂਰ",
    antonym: "ਨੇੜੇ",
    distractors: ["ਲੰਮਾ","ਪਰੇ","ਵੱਖ","ਓਹਲੇ"],
    explanationPa: "‘ਦੂਰ’ ਦਾ ਉਲਟ ‘ਨੇੜੇ’ (ਕੋਲ) ਹੁੰਦਾ ਹੈ।",
  },
  {
    id: "ANT-077",
    word: "ਦੇਵਤਾ",
    antonym: "ਰਾਖ਼ਸ਼",
    distractors: ["ਦੇਵ","ਸੁਰ","ਭਗਵਾਨ","ਦੂਤ"],
    explanationPa: "‘ਦੇਵਤਾ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਰਾਖ਼ਸ਼’ (ਦੈਂਤ) ਹੈ।",
  },
  {
    id: "ANT-078",
    word: "ਧਰਮੀ",
    antonym: "ਪਾਪੀ",
    distractors: ["ਭਗਤ","ਸੰਤ","ਨੇਕ","ਸਾਧੂ"],
    explanationPa: "‘ਧਰਮੀ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਪਾਪੀ’ (ਅਧਰਮੀ) ਹੈ।",
  },
  {
    id: "ANT-079",
    word: "ਧੁੱਪ",
    antonym: "ਛਾਂ",
    distractors: ["ਗਰਮੀ","ਤਪਸ਼","ਲੂ","ਦਿਨ"],
    explanationPa: "‘ਧੁੱਪ’ ਦਾ ਉਲਟ ਸ਼ਬਦ ‘ਛਾਂ’ ਹੈ।",
  },
  {
    id: "ANT-080",
    word: "ਨਰਮ",
    antonym: "ਸਖ਼ਤ",
    distractors: ["ਕੋਮਲ","ਪੋਲਾ","ਮੁਲਾਇਮ","ਹਲਕਾ"],
    explanationPa: "‘ਨਰਮ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਸਖ਼ਤ’ (ਕਠੋਰ) ਹੈ।",
  },
  {
    id: "ANT-081",
    word: "ਨਵੀਨ",
    antonym: "ਪੁਰਾਤਨ",
    distractors: ["ਨਵਾਂ","ਆਧੁਨਿਕ","ਤਾਜ਼ਾ","ਅਜੋਕਾ"],
    explanationPa: "‘ਨਵੀਨ’ ਦਾ ਵਿਰੋਧੀ ‘ਪੁਰਾਤਨ’ (ਪ੍ਰਾਚੀਨ) ਹੈ।",
  },
  {
    id: "ANT-082",
    word: "ਨਿਰਮਲ",
    antonym: "ਮਲੀਨ",
    distractors: ["ਸਾਫ਼","ਪਵਿੱਤਰ","ਸਵੱਛ","ਚਿੱਟਾ"],
    explanationPa: "‘ਨਿਰਮਲ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਮਲੀਨ’ (ਮੈਲਾ) ਹੈ।",
  },
  {
    id: "ANT-083",
    word: "ਨਿਆਂ",
    antonym: "ਅਨਿਆਂ",
    distractors: ["ਇਨਸਾਫ਼","ਸੱਚ","ਧਰਮ","ਫ਼ੈਸਲਾ"],
    explanationPa: "‘ਨਿਆਂ’ ਦਾ ਉਲਟ ਸ਼ਬਦ ‘ਅਨਿਆਂ’ (ਧੱਕਾ) ਹੈ।",
  },
  {
    id: "ANT-084",
    word: "ਪੁੰਨ",
    antonym: "ਪਾਪ",
    distractors: ["ਨੇਕੀ","ਭਲਾਈ","ਦਾਨ","ਸੇਵਾ"],
    explanationPa: "‘ਪੁੰਨ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਪਾਪ’ ਹੈ।",
  },
  {
    id: "ANT-085",
    word: "ਪ੍ਰਸੰਨ",
    antonym: "ਉਦਾਸ",
    distractors: ["ਖ਼ੁਸ਼","ਬਾਗ਼-ਬਾਗ਼","ਰਾਜ਼ੀ","ਸ਼ਾਂਤ"],
    explanationPa: "‘ਪ੍ਰਸੰਨ’ ਦਾ ਉਲਟ ਸ਼ਬਦ ‘ਉਦਾਸ’ ਹੈ।",
  },
  {
    id: "ANT-086",
    word: "ਪਿਆਰ",
    antonym: "ਨਫ਼ਰਤ",
    distractors: ["ਪ੍ਰੇਮ","ਮੁਹੱਬਤ","ਨੇਹੁੰ","ਸਨੇਹ"],
    explanationPa: "‘ਪਿਆਰ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਨਫ਼ਰਤ’ ਹੈ।",
  },
  {
    id: "ANT-087",
    word: "ਫਿੱਕਾ",
    antonym: "ਗੂੜ੍ਹਾ",
    distractors: ["ਹਲਕਾ","ਕਮਜ਼ੋਰ","ਸਫ਼ੈਦ","ਪਤਲਾ"],
    explanationPa: "‘ਫਿੱਕਾ’ ਦਾ ਉਲਟ ਸ਼ਬਦ ‘ਗੂੜ੍ਹਾ’ ਹੈ।",
  },
  {
    id: "ANT-088",
    word: "ਬਹਾਦਰ",
    antonym: "ਕਾਇਰ",
    distractors: ["ਸੂਰਬੀਰ","ਦਲੇਰ","ਯੋਧਾ","ਨਿਡਰ"],
    explanationPa: "‘ਬਹਾਦਰ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਕਾਇਰ’ ਹੈ।",
  },
  {
    id: "ANT-089",
    word: "ਭਾਰੀ",
    antonym: "ਹੌਲਾ",
    distractors: ["ਵਜ਼ਨੀ","ਗੰਭੀਰ","ਮੋਟਾ","ਵੱਡਾ"],
    explanationPa: "‘ਭਾਰੀ’ ਦਾ ਉਲਟ ਸ਼ਬਦ ‘ਹੌਲਾ’ ਹੈ।",
  },
  {
    id: "ANT-090",
    word: "ਮਿੱਤਰਤਾ",
    antonym: "ਦੁਸ਼ਮਣੀ",
    distractors: ["ਦੋਸਤੀ","ਯਾਰੀ","ਸਾਂਝ","ਮੇਲ"],
    explanationPa: "‘ਮਿੱਤਰਤਾ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਦੁਸ਼ਮਣੀ’ ਹੈ।",
  },
  {
    id: "ANT-091",
    word: "ਮੋਟਾ",
    antonym: "ਪਤਲਾ",
    distractors: ["ਭਾਰੀ","ਚੌੜਾ","ਵੱਡਾ","ਡੱਲ੍ਹ"],
    explanationPa: "‘ਮੋਟਾ’ ਦਾ ਉਲਟ ਸ਼ਬਦ ‘ਪਤਲਾ’ (ਬਰੀਕ) ਹੈ।",
  },
  {
    id: "ANT-092",
    word: "ਯੋਗ",
    antonym: "ਅਯੋਗ",
    distractors: ["ਕਾਬਲ","ਲਾਇਕ","ਹੁਨਰਮੰਦ","ਠੀਕ"],
    explanationPa: "‘ਯੋਗ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਅਯੋਗ’ ਹੈ।",
  },
  {
    id: "ANT-093",
    word: "ਰਾਜਾ",
    antonym: "ਰੰਕ",
    distractors: ["ਸ਼ਹਿਨਸ਼ਾਹ","ਨ੍ਰਿਪ","ਮਹਾਰਾਜਾ","ਸੁਲਤਾਨ"],
    explanationPa: "‘ਰਾਜਾ’ ਦਾ ਉਲਟ ਸ਼ਬਦ ‘ਰੰਕ’ (ਗ਼ਰੀਬ) ਹੈ।",
  },
  {
    id: "ANT-094",
    word: "ਵਰਦਾਨ",
    antonym: "ਸਰਾਪ",
    distractors: ["ਅਸੀਸ","ਬਖ਼ਸ਼ਿਸ਼","ਕਿਰਪਾ","ਲਾਭ"],
    explanationPa: "‘ਵਰਦਾਨ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਸਰਾਪ’ ਹੈ।",
  },
  {
    id: "ANT-095",
    word: "ਸ਼ਾਂਤੀ",
    antonym: "ਅਸ਼ਾਂਤੀ",
    distractors: ["ਅਮਨ","ਚੈਨ","ਸਕੂਨ","ਧੀਰਜ"],
    explanationPa: "‘ਸ਼ਾਂਤੀ’ ਦਾ ਉਲਟ ਸ਼ਬਦ ‘ਅਸ਼ਾਂਤੀ’ ਹੈ।",
  }
,
  {
    "id": "ANT-096",
    "word": "ਸੁਗੰਧ",
    "antonym": "ਦੁਰਗੰਧ",
    "distractors": [
      "ਖ਼ੁਸ਼ਬੂ",
      "ਮਹਿਕ",
      "ਵਾਸਨਾ",
      "ਸੁਵਾਸ"
    ],
    "explanationPa": "‘ਸੁਗੰਧ’ (ਖ਼ੁਸ਼ਬੂ) ਦਾ ਉਲਟ ਸ਼ਬਦ ‘ਦੁਰਗੰਧ’ (ਬਦਬੂ) ਹੈ।"
  },
  {
    "id": "ANT-097",
    "word": "ਕੋਮਲ",
    "antonym": "ਕਠੋਰ",
    "distractors": [
      "ਨਾਜ਼ੁਕ",
      "ਨਰਮ",
      "ਮੁਲਾਇਮ",
      "ਸੁਕੁਮਾਰ"
    ],
    "explanationPa": "‘ਕੋਮਲ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਕਠੋਰ’ (ਕਰੜਾ) ਹੈ।"
  },
  {
    "id": "ANT-098",
    "word": "ਵਿਦਵਾਨ",
    "antonym": "ਮੂਰਖ",
    "distractors": [
      "ਪੰਡਿਤ",
      "ਗਿਆਨੀ",
      "ਦਾਨਿਸ਼ਮੰਦ",
      "ਆਲਿਮ"
    ],
    "explanationPa": "‘ਵਿਦਵਾਨ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਮੂਰਖ’ ਹੈ।"
  },
  {
    "id": "ANT-099",
    "word": "ਚੇਲਾ",
    "antonym": "ਗੁਰੂ",
    "distractors": [
      "ਸ਼ਾਗਿਰਦ",
      "ਸਿੱਖ",
      "ਵਿਦਿਆਰਥੀ",
      "ਸਾਥੀ"
    ],
    "explanationPa": "‘ਚੇਲਾ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਗੁਰੂ’ ਜਾਂ ਉਸਤਾਦ ਹੈ।"
  },
  {
    "id": "ANT-100",
    "word": "ਆਦਿ",
    "antonym": "ਅੰਤ",
    "distractors": [
      "ਮੁੱਢ",
      "ਸ਼ੁਰੂ",
      "ਪਹਿਲਾ",
      "ਅਰੰਭ"
    ],
    "explanationPa": "‘ਆਦਿ’ ਦਾ ਉਲਟ ਸ਼ਬਦ ‘ਅੰਤ’ (ਅਖ਼ੀਰ) ਹੈ।"
  },
  {
    "id": "ANT-101",
    "word": "ਆਸਤਿਕ",
    "antonym": "ਨਾਸਤਿਕ",
    "distractors": [
      "ਧਰਮੀ",
      "ਸ਼ਰਧਾਲੂ",
      "ਭਗਤ",
      "ਪੂਜਾਰੀ"
    ],
    "explanationPa": "ਰੱਬ ਨੂੰ ਮੰਨਣ ਵਾਲੇ ‘ਆਸਤਿਕ’ ਦਾ ਉਲਟ ‘ਨਾਸਤਿਕ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "ANT-102",
    "word": "ਸਥਿਰ",
    "antonym": "ਅਸਥਿਰ",
    "distractors": [
      "ਪੱਕਾ",
      "ਕਾਇਮ",
      "ਟਿਕਿਆ",
      "ਅਡੋਲ"
    ],
    "explanationPa": "‘ਸਥਿਰ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਅਸਥਿਰ’ (ਚੰਚਲ) ਹੈ।"
  },
  {
    "id": "ANT-103",
    "word": "ਖ਼ਰੀਦਣਾ",
    "antonym": "ਵੇਚਣਾ",
    "distractors": [
      "ਲੈਣਾ",
      "ਮੁੱਲ ਲੈਣਾ",
      "ਪ੍ਰਾਪਤ ਕਰਨਾ",
      "ਰੱਖਣਾ"
    ],
    "explanationPa": "‘ਖ਼ਰੀਦਣਾ’ ਦਾ ਉਲਟ ਸ਼ਬਦ ‘ਵੇਚਣਾ’ ਹੈ।"
  },
  {
    "id": "ANT-104",
    "word": "ਚੜ੍ਹਾਈ",
    "antonym": "ਉਤਰਾਈ",
    "distractors": [
      "ਉੱਚਾਈ",
      "ਸਿਖ਼ਰ",
      "ਉਡਾਣ",
      "ਚੜ੍ਹਤ"
    ],
    "explanationPa": "‘ਚੜ੍ਹਾਈ’ ਦਾ ਉਲਟ ਸ਼ਬਦ ‘ਉਤਰਾਈ’ ਹੈ।"
  },
  {
    "id": "ANT-105",
    "word": "ਜਾਗਣਾ",
    "antonym": "ਸੌਣਾ",
    "distractors": [
      "ਉੱਠਣਾ",
      "ਸੁਚੇਤ ਹੋਣਾ",
      "ਤੱਕਣਾ",
      "ਵੇਖਣਾ"
    ],
    "explanationPa": "‘ਜਾਗਣਾ’ ਦਾ ਉਲਟ ਸ਼ਬਦ ‘ਸੌਣਾ’ ਹੈ।"
  },
  {
    "id": "ANT-106",
    "word": "ਜੀਵਨ",
    "antonym": "ਮਰਨ",
    "distractors": [
      "ਜ਼ਿੰਦਗੀ",
      "ਹਯਾਤੀ",
      "ਸਵਾਸ",
      "ਰੂਹ"
    ],
    "explanationPa": "‘ਜੀਵਨ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਮਰਨ’ (ਮੌਤ) ਹੈ।"
  },
  {
    "id": "ANT-107",
    "word": "ਝੂਠ",
    "antonym": "ਸੱਚ",
    "distractors": [
      "ਕੂੜ",
      "ਫ਼ਰੇਬ",
      "ਧੋਖਾ",
      "ਮਿਥਿਆ"
    ],
    "explanationPa": "‘ਝੂਠ’ ਦਾ ਉਲਟ ਸ਼ਬਦ ‘ਸੱਚ’ ਹੈ।"
  },
  {
    "id": "ANT-108",
    "word": "ਡਰਪੋਕ",
    "antonym": "ਨਿਡਰ",
    "distractors": [
      "ਕਾਇਰ",
      "ਬੁਜ਼ਦਿਲ",
      "ਕੰਬੂ",
      "ਭੈਭੀਤ"
    ],
    "explanationPa": "‘ਡਰਪੋਕ’ ਦਾ ਉਲਟ ਸ਼ਬਦ ‘ਨਿਡਰ’ (ਦਲੇਰ) ਹੈ।"
  },
  {
    "id": "ANT-109",
    "word": "ਚੜ੍ਹਨਾ",
    "antonym": "ਢਲਣਾ",
    "distractors": [
      "ਉੱਗਣਾ",
      "ਉੱਠਣਾ",
      "ਚਮਕਣਾ",
      "ਪ੍ਰਗਟਣਾ"
    ],
    "explanationPa": "ਸੂਰਜ ਦੇ ਸੰਦਰਭ ਵਿੱਚ ‘ਚੜ੍ਹਨਾ’ ਦਾ ਵਿਰੋਧੀ ‘ਢਲਣਾ’ (ਡੁੱਬਣਾ) ਹੈ।"
  },
  {
    "id": "ANT-110",
    "word": "ਤਕੜਾ",
    "antonym": "ਮਾੜਾ",
    "distractors": [
      "ਬਲਵਾਨ",
      "ਮਜ਼ਬੂਤ",
      "ਜੋਰਾਵਰ",
      "ਸਖ਼ਤ"
    ],
    "explanationPa": "‘ਤਕੜਾ’ ਦਾ ਉਲਟ ਸ਼ਬਦ ‘ਮਾੜਾ’ (ਕਮਜ਼ੋਰ) ਹੈ।"
  },
  {
    "id": "ANT-111",
    "word": "ਤੇਜ਼",
    "antonym": "ਹੌਲੀ",
    "distractors": [
      "ਤਿੱਖਾ",
      "ਚੁਸਤ",
      "ਤੇਜ਼-ਤਰਾਰ",
      "ਛੇਤੀ"
    ],
    "explanationPa": "‘ਤੇਜ਼’ ਦਾ ਉਲਟ ਸ਼ਬਦ ‘ਹੌਲੀ’ (ਮੱਠਾ) ਹੈ।"
  },
  {
    "id": "ANT-112",
    "word": "ਥੋੜ੍ਹਾ",
    "antonym": "ਬਹੁਤਾ",
    "distractors": [
      "ਘੱਟ",
      "ਜ਼ਰਾ",
      "ਰੰਚਕ",
      "ਤਿਲ-ਮਾਤਰ"
    ],
    "explanationPa": "‘ਥੋੜ੍ਹਾ’ ਦਾ ਉਲਟ ਸ਼ਬਦ ‘ਬਹੁਤਾ’ (ਜ਼ਿਆਦਾ) ਹੈ।"
  },
  {
    "id": "ANT-113",
    "word": "ਦਲੇਰ",
    "antonym": "ਬੁਜ਼ਦਿਲ",
    "distractors": [
      "ਬਹਾਦਰ",
      "ਸੂਰਬੀਰ",
      "ਯੋਧਾ",
      "ਜਾਂਬਾਜ਼"
    ],
    "explanationPa": "‘ਦਲੇਰ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਬੁਜ਼ਦਿਲ’ (ਕਾਇਰ) ਹੈ।"
  },
  {
    "id": "ANT-114",
    "word": "ਧੁੱਪ",
    "antonym": "ਛਾਂ",
    "distractors": [
      "ਚਾਨਣ",
      "ਗਰਮੀ",
      "ਤਪਸ਼",
      "ਲੋਅ"
    ],
    "explanationPa": "‘ਧੁੱਪ’ ਦਾ ਉਲਟ ਸ਼ਬਦ ‘ਛਾਂ’ ਹੈ।"
  },
  {
    "id": "ANT-115",
    "word": "ਨਰਕ",
    "antonym": "ਸਵਰਗ",
    "distractors": [
      "ਦੋਜ਼ਖ਼",
      "ਜਮਲੋਕ",
      "ਪਤਾਲ",
      "ਕਾਲਖ਼"
    ],
    "explanationPa": "‘ਨਰਕ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਸਵਰਗ’ (ਬਹਿਸ਼ਤ) ਹੈ।"
  },
  {
    "id": "ANT-116",
    "word": "ਪਤਲਾ",
    "antonym": "ਗਾੜ੍ਹਾ",
    "distractors": [
      "ਬਰੀਕ",
      "ਛਿੱਦਾ",
      "ਪਤਲੀ",
      "ਜਲ"
    ],
    "explanationPa": "ਤਰਲ ਪਦਾਰਥ ਦੇ ਸੰਦਰਭ ਵਿੱਚ ‘ਪਤਲਾ’ ਦਾ ਉਲਟ ‘ਗਾੜ੍ਹਾ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "ANT-117",
    "word": "ਪਾਪ",
    "antonym": "ਪੁੰਨ",
    "distractors": [
      "ਗੁਨਾਹ",
      "ਅਪਰਾਧ",
      "ਦੋਸ਼",
      "ਜੁਰਮ"
    ],
    "explanationPa": "‘ਪਾਪ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਪੁੰਨ’ (ਨੇਕੀ) ਹੈ।"
  },
  {
    "id": "ANT-118",
    "word": "ਪਿਆਰ",
    "antonym": "ਨਫ਼ਰਤ",
    "distractors": [
      "ਮੁਹੱਬਤ",
      "ਨੇਹੁੰ",
      "ਸਨੇਹ",
      "ਇਸ਼ਕ"
    ],
    "explanationPa": "‘ਪਿਆਰ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਨਫ਼ਰਤ’ (ਘਿਰਣਾ) ਹੈ।"
  },
  {
    "id": "ANT-119",
    "word": "ਪੁਰਾਣਾ",
    "antonym": "ਨਵਾਂ",
    "distractors": [
      "ਕਦੀਮੀ",
      "ਪ੍ਰਾਚੀਨ",
      "ਪੁਰਾਤਨ",
      "ਬਾਸੀ"
    ],
    "explanationPa": "‘ਪੁਰਾਣਾ’ ਦਾ ਉਲਟ ਸ਼ਬਦ ‘ਨਵਾਂ’ ਹੈ।"
  },
  {
    "id": "ANT-120",
    "word": "ਫਿੱਕਾ",
    "antonym": "ਮਿੱਠਾ",
    "distractors": [
      "ਲੂਣਾ",
      "ਕੌੜਾ",
      "ਖੱਟਾ",
      "ਬੇਸੁਆਦ"
    ],
    "explanationPa": "‘ਫਿੱਕਾ’ ਦਾ ਉਲਟ ਸ਼ਬਦ ‘ਮਿੱਠਾ’ ਜਾਂ ‘ਚੋਖਾ’ ਹੈ।"
  },
  {
    "id": "ANT-121",
    "word": "ਬੰਧਨ",
    "antonym": "ਮੁਕਤੀ",
    "distractors": [
      "ਕੈਦ",
      "ਜੰਜੀਰ",
      "ਰੋਕ",
      "ਬੇੜੀ"
    ],
    "explanationPa": "‘ਬੰਧਨ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਮੁਕਤੀ’ (ਰਿਹਾਈ) ਹੈ।"
  },
  {
    "id": "ANT-122",
    "word": "ਬਿਮਾਰ",
    "antonym": "ਤੰਦਰੁਸਤ",
    "distractors": [
      "ਰੋਗੀ",
      "ਅਸਵਸਥ",
      "ਮਰੀਜ਼",
      "ਕਮਜ਼ੋਰ"
    ],
    "explanationPa": "‘ਬਿਮਾਰ’ ਦਾ ਉਲਟ ਸ਼ਬਦ ‘ਤੰਦਰੁਸਤ’ (ਅਰੋਗ) ਹੈ।"
  },
  {
    "id": "ANT-123",
    "word": "ਭਾਰੀ",
    "antonym": "ਹੌਲਾ",
    "distractors": [
      "ਵਜ਼ਨੀ",
      "ਬੋਝਲ",
      "ਮੋਟਾ",
      "ਵੱਡਾ"
    ],
    "explanationPa": "‘ਭਾਰੀ’ ਦਾ ਉਲਟ ਸ਼ਬਦ ‘ਹੌਲਾ’ ਹੈ।"
  },
  {
    "id": "ANT-124",
    "word": "ਭਲਾ",
    "antonym": "ਬੁਰਾ",
    "distractors": [
      "ਚੰਗਾ",
      "ਨੇਕ",
      "ਸੱਜਣ",
      "ਹਿਤਕਾਰੀ"
    ],
    "explanationPa": "‘ਭਲਾ’ ਦਾ ਉਲਟ ਸ਼ਬਦ ‘ਬੁਰਾ’ ਹੈ।"
  },
  {
    "id": "ANT-125",
    "word": "ਮਿੱਠਾ",
    "antonym": "ਕੌੜਾ",
    "distractors": [
      "ਮਧੁਰ",
      "ਸ਼ੀਰੀਂ",
      "ਸੁਆਦੀ",
      "ਰਸੀਲਾ"
    ],
    "explanationPa": "‘ਮਿੱਠਾ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਕੌੜਾ’ ਹੈ।"
  },
  {
    "id": "ANT-126",
    "word": "ਮਹਿੰਗਾ",
    "antonym": "ਸਸਤਾ",
    "distractors": [
      "ਕੀਮਤੀ",
      "ਅਣਮੁੱਲਾ",
      "ਵਡਮੁੱਲਾ",
      "ਭਾਰੀ"
    ],
    "explanationPa": "‘ਮਹਿੰਗਾ’ ਦਾ ਉਲਟ ਸ਼ਬਦ ‘ਸਸਤਾ’ ਹੈ।"
  },
  {
    "id": "ANT-127",
    "word": "ਮੁਨਾਫ਼ਾ",
    "antonym": "ਨੁਕਸਾਨ",
    "distractors": [
      "ਲਾਭ",
      "ਖੱਟੀ",
      "ਫ਼ਾਇਦਾ",
      "ਬੱਚਤ"
    ],
    "explanationPa": "‘ਮੁਨਾਫ਼ਾ’ ਦਾ ਉਲਟ ਸ਼ਬਦ ‘ਨੁਕਸਾਨ’ (ਘਾਟਾ) ਹੈ।"
  },
  {
    "id": "ANT-128",
    "word": "ਯਕੀਨ",
    "antonym": "ਸ਼ੱਕ",
    "distractors": [
      "ਵਿਸ਼ਵਾਸ",
      "ਭਰੋਸਾ",
      "ਇਤਬਾਰ",
      "ਸਿਦਕ"
    ],
    "explanationPa": "‘ਯਕੀਨ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਸ਼ੱਕ’ ਹੈ।"
  },
  {
    "id": "ANT-129",
    "word": "ਰੋਣਾ",
    "antonym": "ਹੱਸਣਾ",
    "distractors": [
      "ਵਿਰਲਾਪ",
      "ਚੀਕਣਾ",
      "ਕੁਰਲਾਉਣਾ",
      "ਹੰਝੂ"
    ],
    "explanationPa": "‘ਰੋਣਾ’ ਦਾ ਉਲਟ ਸ਼ਬਦ ‘ਹੱਸਣਾ’ ਹੈ।"
  },
  {
    "id": "ANT-130",
    "word": "ਲਾਭ",
    "antonym": "ਹਾਨੀ",
    "distractors": [
      "ਫ਼ਾਇਦਾ",
      "ਨਫ਼ਾ",
      "ਖੱਟੀ",
      "ਪ੍ਰਾਪਤੀ"
    ],
    "explanationPa": "‘ਲਾਭ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਹਾਨੀ’ (ਘਾਟਾ) ਹੈ।"
  },
  {
    "id": "ANT-131",
    "word": "ਵਫ਼ਾਦਾਰ",
    "antonym": "ਗ਼ੱਦਾਰ",
    "distractors": [
      "ਨਮਕਹਲਾਲ",
      "ਸੱਚਾ",
      "ਇਮਾਨਦਾਰ",
      "ਸਮਰਪਿਤ"
    ],
    "explanationPa": "‘ਵਫ਼ਾਦਾਰ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਗ਼ੱਦਾਰ’ (ਬੇਵਫ਼ਾ) ਹੈ।"
  },
  {
    "id": "ANT-132",
    "word": "ਵੱਡਾ",
    "antonym": "ਛੋਟਾ",
    "distractors": [
      "ਵਿਸ਼ਾਲ",
      "ਭਾਰੀ",
      "ਲੰਮਾ",
      "ਉੱਚਾ"
    ],
    "explanationPa": "‘ਵੱਡਾ’ ਦਾ ਉਲਟ ਸ਼ਬਦ ‘ਛੋਟਾ’ ਹੈ।"
  },
  {
    "id": "ANT-133",
    "word": "ਸਫ਼ਲ",
    "antonym": "ਅਸਫ਼ਲ",
    "distractors": [
      "ਕਾਮਯਾਬ",
      "ਫ਼ਤਹਿਯਾਬ",
      "ਵਿਜਈ",
      "ਸਿੱਧ"
    ],
    "explanationPa": "‘ਸਫ਼ਲ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਅਸਫ਼ਲ’ (ਨਾਕਾਮ) ਹੈ।"
  },
  {
    "id": "ANT-134",
    "word": "ਸੁੱਕਾ",
    "antonym": "ਗਿੱਲਾ",
    "distractors": [
      "ਖ਼ੁਸ਼ਕ",
      "ਸੜਿਆ",
      "ਕਠੋਰ",
      "ਕਰੜਾ"
    ],
    "explanationPa": "‘ਸੁੱਕਾ’ ਦਾ ਉਲਟ ਸ਼ਬਦ ‘ਗਿੱਲਾ’ (ਭਿੱਜਿਆ) ਹੈ।"
  },
  {
    "id": "ANT-135",
    "word": "ਸਵੇਰ",
    "antonym": "ਸ਼ਾਮ",
    "distractors": [
      "ਪ੍ਰਭਾਤ",
      "ਤੜਕਾ",
      "ਅੰਮ੍ਰਿਤ ਵੇਲਾ",
      "ਲੋਅ"
    ],
    "explanationPa": "‘ਸਵੇਰ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਸ਼ਾਮ’ (ਸੰਝ) ਹੈ।"
  },
  {
    "id": "ANT-136",
    "word": "ਹਾਰ",
    "antonym": "ਜਿੱਤ",
    "distractors": [
      "ਸ਼ਿਕਸਤ",
      "ਮਾਤ",
      "ਪਰਾਜੈ",
      "ਨਾਕਾਮੀ"
    ],
    "explanationPa": "‘ਹਾਰ’ ਦਾ ਉਲਟ ਸ਼ਬਦ ‘ਜਿੱਤ’ (ਫ਼ਤਹਿ) ਹੈ।"
  },
  {
    "id": "ANT-137",
    "word": "ਅੱਗੇ",
    "antonym": "ਪਿੱਛੇ",
    "distractors": [
      "ਮੂਹਰੇ",
      "ਸਾਹਮਣੇ",
      "ਮੋਹਰੀ",
      "ਪਹਿਲਾਂ"
    ],
    "explanationPa": "‘ਅੱਗੇ’ ਦਾ ਉਲਟ ਸ਼ਬਦ ‘ਪਿੱਛੇ’ ਹੈ।"
  },
  {
    "id": "ANT-138",
    "word": "ਉੱਚਾ",
    "antonym": "ਨੀਵਾਂ",
    "distractors": [
      "ਬੁਲੰਦ",
      "ਸਿਖ਼ਰ",
      "ਉਤਲਾ",
      "ਚੜ੍ਹਿਆ"
    ],
    "explanationPa": "‘ਉੱਚਾ’ ਦਾ ਉਲਟ ਸ਼ਬਦ ‘ਨੀਵਾਂ’ ਹੈ।"
  },
  {
    "id": "ANT-139",
    "word": "ਸਿੱਧਾ",
    "antonym": "ਪੁੱਠਾ",
    "distractors": [
      "ਸਰਲ",
      "ਸੁਖਾਲਾ",
      "ਸਾਵਾਂ",
      "ਇੱਕਸਾਰ"
    ],
    "explanationPa": "‘ਸਿੱਧਾ’ ਦਾ ਉਲਟ ਸ਼ਬਦ ‘ਪੁੱਠਾ’ ਜਾਂ ‘ਟੇਢਾ’ ਹੈ।"
  },
  {
    "id": "ANT-140",
    "word": "ਸਵੱਛ",
    "antonym": "ਮਲੀਨ",
    "distractors": [
      "ਸਾਫ਼",
      "ਨਿਰਮਲ",
      "ਪਵਿੱਤਰ",
      "ਸੁਥਰਾ"
    ],
    "explanationPa": "‘ਸਵੱਛ’ (ਸਾਫ਼) ਦਾ ਉਲਟ ਸ਼ਬਦ ‘ਮਲੀਨ’ (ਮੈਲਾ) ਹੈ।"
  },
  {
    "id": "ANT-141",
    "word": "ਸੂਖ਼ਮ",
    "antonym": "ਸਥੂਲ",
    "distractors": [
      "ਬਰੀਕ",
      "ਮਹੀਨ",
      "ਨਾਜ਼ੁਕ",
      "ਛੋਟਾ"
    ],
    "explanationPa": "‘ਸੂਖ਼ਮ’ (ਬਰੀਕ) ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਸਥੂਲ’ (ਮੋਟਾ/ਵੱਡਾ) ਹੈ।"
  },
  {
    "id": "ANT-142",
    "word": "ਸੰਜੋਗ",
    "antonym": "ਵਿਜੋਗ",
    "distractors": [
      "ਮੇਲ",
      "ਮਿਲਣ",
      "ਸੰਗਮ",
      "ਸੰਪਰਕ"
    ],
    "explanationPa": "‘ਸੰਜੋਗ’ (ਮੇਲ) ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਵਿਜੋਗ’ (ਵਿਛੋੜਾ) ਹੈ।"
  },
  {
    "id": "ANT-143",
    "word": "ਸਮਰੱਥ",
    "antonym": "ਅਸਮਰੱਥ",
    "distractors": [
      "ਕਾਬਲ",
      "ਯੋਗ",
      "ਬਲਵਾਨ",
      "ਸ਼ਕਤੀਮਾਨ"
    ],
    "explanationPa": "‘ਸਮਰੱਥ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਅਸਮਰੱਥ’ (ਲਾਚਾਰ) ਹੈ।"
  },
  {
    "id": "ANT-144",
    "word": "ਸਵਾਰਥੀ",
    "antonym": "ਪਰਉਪਕਾਰੀ",
    "distractors": [
      "ਖ਼ੁਦਗ਼ਰਜ਼",
      "ਲਾਲਚੀ",
      "ਮਤਲਬੀ",
      "ਨੀਚ"
    ],
    "explanationPa": "‘ਸਵਾਰਥੀ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਪਰਉਪਕਾਰੀ’ (ਨਿਰਸੁਆਰਥ) ਹੈ।"
  },
  {
    "id": "ANT-145",
    "word": "ਸ਼ੁੱਧ",
    "antonym": "ਅਸ਼ੁੱਧ",
    "distractors": [
      "ਪਵਿੱਤਰ",
      "ਸਾਫ਼",
      "ਅਸਲੀ",
      "ਨਿਰਮਲ"
    ],
    "explanationPa": "‘ਸ਼ੁੱਧ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਅਸ਼ੁੱਧ’ (ਮਿਲਾਵਟੀ) ਹੈ।"
  },
  {
    "id": "ANT-146",
    "word": "ਸ਼ਾਂਤ",
    "antonym": "ਅਸ਼ਾਂਤ",
    "distractors": [
      "ਗੰਭੀਰ",
      "ਠਰੰਮੇ ਵਾਲਾ",
      "ਧੀਰਜਵਾਨ",
      "ਸੁਲਝਿਆ"
    ],
    "explanationPa": "‘ਸ਼ਾਂਤ’ ਦਾ ਉਲਟ ਸ਼ਬਦ ‘ਅਸ਼ਾਂਤ’ (ਬੇਚੈਨ) ਹੈ।"
  },
  {
    "id": "ANT-147",
    "word": "ਸ਼ੁਕਰਗੁਜ਼ਾਰ",
    "antonym": "ਨਾਸ਼ੁਕਰਾ",
    "distractors": [
      "ਧੰਨਵਾਦੀ",
      "ਅਹਿਸਾਨਮੰਦ",
      "ਕ੍ਰਿਤੱਗ",
      "ਸੰਤੁਸ਼ਟ"
    ],
    "explanationPa": "‘ਸ਼ੁਕਰਗੁਜ਼ਾਰ’ ਦਾ ਉਲਟ ਸ਼ਬਦ ‘ਨਾਸ਼ੁਕਰਾ’ (ਅਕ੍ਰਿਤਘਣ) ਹੈ।"
  },
  {
    "id": "ANT-148",
    "word": "ਖ਼ੁਸ਼ਕਿਸਮਤ",
    "antonym": "ਬਦਕਿਸਮਤ",
    "distractors": [
      "ਭਾਗਾਂਵਾਲਾ",
      "ਨੇਕਬਖ਼ਤ",
      "ਧੰਨਭਾਗੀ",
      "ਕਾਮਯਾਬ"
    ],
    "explanationPa": "‘ਖ਼ੁਸ਼ਕਿਸਮਤ’ ਦਾ ਉਲਟ ਸ਼ਬਦ ‘ਬਦਕਿਸਮਤ’ (ਮੰਦਭਾਗੀ) ਹੈ।"
  },
  {
    "id": "ANT-149",
    "word": "ਗ਼ੁਲਾਮ",
    "antonym": "ਆਜ਼ਾਦ",
    "distractors": [
      "ਦਾਸ",
      "ਕੈਦੀ",
      "ਨੌਕਰ",
      "ਬੰਧੀ"
    ],
    "explanationPa": "‘ਗ਼ੁਲਾਮ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਆਜ਼ਾਦ’ (ਸੁਤੰਤਰ) ਹੈ।"
  },
  {
    "id": "ANT-150",
    "word": "ਗੁਪਤ",
    "antonym": "ਪ੍ਰਗਟ",
    "distractors": [
      "ਲੁਕਵਾਂ",
      "ਪੋਸ਼ੀਦਾ",
      "ਖ਼ੁਫ਼ੀਆ",
      "ਅਣਡਿੱਠ"
    ],
    "explanationPa": "‘ਗੁਪਤ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਪ੍ਰਗਟ’ (ਜ਼ਾਹਿਰ) ਹੈ।"
  },
  {
    "id": "ANT-151",
    "word": "ਘਰੇਲੂ",
    "antonym": "ਜੰਗਲੀ",
    "distractors": [
      "ਪਾਲਤੂ",
      "ਘਰਵਾਲਾ",
      "ਸਧਾਰਨ",
      "ਅੰਦਰੂਨੀ"
    ],
    "explanationPa": "ਜੀਵ-ਜੰਤੂਆਂ ਦੇ ਸੰਦਰਭ ਵਿੱਚ ‘ਘਰੇਲੂ’ (ਪਾਲਤੂ) ਦਾ ਉਲਟ ‘ਜੰਗਲੀ’ ਹੈ।"
  },
  {
    "id": "ANT-152",
    "word": "ਚਾਨਣ",
    "antonym": "ਹਨੇਰਾ",
    "distractors": [
      "ਰੌਸ਼ਨੀ",
      "ਉਜਾਲਾ",
      "ਪ੍ਰਕਾਸ਼",
      "ਨੂਰ"
    ],
    "explanationPa": "‘ਚਾਨਣ’ ਦਾ ਉਲਟ ਸ਼ਬਦ ‘ਹਨੇਰਾ’ (ਅੰਧਕਾਰ) ਹੈ।"
  },
  {
    "id": "ANT-153",
    "word": "ਚੇਤਨ",
    "antonym": "ਜੜ੍ਹ",
    "distractors": [
      "ਸੁਚੇਤ",
      "ਜਾਗਰੂਕ",
      "ਜ਼ਿੰਦਾ",
      "ਹੋਸ਼ਿਆਰ"
    ],
    "explanationPa": "‘ਚੇਤਨ’ (ਜੀਵੰਤ/ਸੁਚੇਤ) ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਜੜ੍ਹ’ (ਨਿਰਜਿੰਦ) ਹੈ।"
  },
  {
    "id": "ANT-154",
    "word": "ਛਾਂਟਣਾ",
    "antonym": "ਜੋੜਨਾ",
    "distractors": [
      "ਵੰਡਣਾ",
      "ਅਲੱਗ ਕਰਨਾ",
      "ਕੱਟਣਾ",
      "ਤੋੜਨਾ"
    ],
    "explanationPa": "‘ਛਾਂਟਣਾ’ (ਨਿਖੇੜਨਾ) ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਜੋੜਨਾ’ (ਇਕੱਠਾ ਕਰਨਾ) ਹੈ।"
  },
  {
    "id": "ANT-155",
    "word": "ਜਵਾਨੀ",
    "antonym": "ਬੁਢਾਪਾ",
    "distractors": [
      "ਗੱਭਰੂਪੁਣਾ",
      "ਜੋਬਨ",
      "ਉਮੰਗ",
      "ਤਾਕਤ"
    ],
    "explanationPa": "‘ਜਵਾਨੀ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਬੁਢਾਪਾ’ ਹੈ।"
  }
];

export interface NearSynonymItem {
  readonly id: string;
  readonly termA: string;
  readonly termB: string;
  readonly contextSentence: string;
  readonly correctTerm: string;
  readonly distractors: readonly string[];
  readonly explanationPa: string;
}

export const NEAR_SYNONYMS: readonly NearSynonymItem[] = [
  {
    "id": "NEAR-001",
    "termA": "ਭਾਸ਼ਾ",
    "termB": "ਬੋਲੀ",
    "contextSentence": "ਵਿਦਿਅਕ ਅਤੇ ਸਰਕਾਰੀ ਕੰਮਕਾਜ ਲਈ ਨਿਯਮਬੱਧ ਵਿਆਕਰਣ ਵਾਲੀ ‘____’ ਦੀ ਵਰਤੋਂ ਹੁੰਦੀ ਹੈ, ਜਦਕਿ ਘਰਾਂ ਵਿੱਚ ਸਥਾਨਕ ਰੂਪ ਬੋਲਿਆ ਜਾਂਦਾ ਹੈ।",
    "correctTerm": "ਭਾਸ਼ਾ",
    "distractors": [
      "ਬੋਲੀ",
      "ਅਖਾਣ",
      "ਮੁਹਾਵਰਾ"
    ],
    "explanationPa": "ਨਿਯਮਬੱਧ ਅਤੇ ਲਿਖਤੀ ਵਿਆਕਰਣਕ ਪ੍ਰਬੰਧ ਨੂੰ ‘ਭਾਸ਼ਾ’ ਆਖਦੇ ਹਨ, ਜਦਕਿ ਸਥਾਨਕ ਬੋਲਚਾਲ ਨੂੰ ‘ਬੋਲੀ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।"
  },
  {
    "id": "NEAR-002",
    "termA": "ਖੋਜ",
    "termB": "ਭਾਲ",
    "contextSentence": "ਵਿਗਿਆਨੀਆਂ ਨੇ ਕੈਂਸਰ ਦੇ ਇਲਾਜ ਲਈ ਨਵੀਂ ਦਵਾਈ ਦੀ ਗੰਭੀਰ ‘____’ ਕੀਤੀ।",
    "correctTerm": "ਖੋਜ",
    "distractors": [
      "ਭਾਲ",
      "ਉਡੀਕ",
      "ਤੱਕਣੀ"
    ],
    "explanationPa": "ਵਿਗਿਆਨਕ ਅਤੇ ਅਕਾਦਮਿਕ ਅਨੁਸੰਧਾਨ (Research) ਲਈ ‘ਖੋਜ’ ਢੁਕਵਾਂ ਸ਼ਬਦ ਹੈ, ਗੁਆਚੀ ਚੀਜ਼ ਲੱਭਣ ਲਈ ‘ਭਾਲ’ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।"
  },
  {
    "id": "NEAR-003",
    "termA": "ਨਿਆਂ",
    "termB": "ਫ਼ੈਸਲਾ",
    "contextSentence": "ਅਦਾਲਤ ਨੇ ਦੋਹਾਂ ਧਿਰਾਂ ਦੀਆਂ ਦਲੀਲਾਂ ਸੁਣ ਕੇ ਦੁੱਧ ਦਾ ਦੁੱਧ ਤੇ ਪਾਣੀ ਦਾ ਪਾਣੀ ਕਰਦਿਆਂ ਨਿਰਪੱਖ ‘____’ ਕੀਤਾ।",
    "correctTerm": "ਨਿਆਂ",
    "distractors": [
      "ਫ਼ੈਸਲਾ",
      "ਸਮਝੌਤਾ",
      "ਇਕਰਾਰ"
    ],
    "explanationPa": "ਸੱਚ ਅਤੇ ਇਨਸਾਫ਼ 'ਤੇ ਆਧਾਰਿਤ ਸੱਚੇ ਨਿਰਣੇ ਨੂੰ ‘ਨਿਆਂ’ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।"
  },
  {
    "id": "NEAR-004",
    "termA": "ਅਹੰਕਾਰ",
    "termB": "ਗ਼ਰੂਰ",
    "contextSentence": "ਰਾਵਣ ਨੂੰ ਆਪਣੀ ਸ਼ਕਤੀ ਦਾ ਬਹੁਤ ‘____’ ਸੀ, ਜਿਸ ਨੇ ਉਸ ਦਾ ਸਰਵਨਾਸ਼ ਕਰ ਦਿੱਤਾ।",
    "correctTerm": "ਅਹੰਕਾਰ",
    "distractors": [
      "ਗ਼ਰੂਰ",
      "ਮਾਣ",
      "ਗ਼ੈਰਤ"
    ],
    "explanationPa": "ਵਿਨਾਸ਼ਕਾਰੀ ਘਮੰਡ ਅਤੇ ਝੂਠੀ ਆਕੜ ਲਈ ਸ਼ਾਸਤਰੀ ਸ਼ਬਦ ‘ਅਹੰਕਾਰ’ ਹੈ।"
  },
  {
    "id": "NEAR-005",
    "termA": "ਪਵਿੱਤਰ",
    "termB": "ਸਾਫ਼",
    "contextSentence": "ਗੁਰਦੁਆਰਾ ਸਾਹਿਬ ਦੇ ਸਰੋਵਰ ਦਾ ਜਲ ਰੂਹਾਨੀ ਤੌਰ 'ਤੇ ਅਤਿਅੰਤ ‘____’ ਮੰਨਿਆ ਜਾਂਦਾ ਹੈ।",
    "correctTerm": "ਪਵਿੱਤਰ",
    "distractors": [
      "ਸਾਫ਼",
      "ਚਮਕਦਾਰ",
      "ਧੋਤਾ"
    ],
    "explanationPa": "ਧਾਰਮਿਕ ਅਤੇ ਰੂਹਾਨੀ ਸ਼ੁੱਧਤਾ ਲਈ ‘ਪਵਿੱਤਰ’ ਸ਼ਬਦ ਹੀ ਪ੍ਰਮਾਣਿਕ ਹੈ, ਜਦਕਿ ‘ਸਾਫ਼’ ਸਿਰਫ਼ ਭੌਤਿਕ ਸਫ਼ਾਈ ਲਈ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।"
  },
  {
    "id": "NEAR-006",
    "termA": "ਸੁਤੰਤਰਤਾ",
    "termB": "ਮੁਕਤੀ",
    "contextSentence": "15 ਅਗਸਤ 1947 ਨੂੰ ਭਾਰਤ ਨੇ ਬਰਤਾਨਵੀ ਸਾਮਰਾਜ ਤੋਂ ਰਾਜਸੀ ‘____’ ਪ੍ਰਾਪਤ ਕੀਤੀ।",
    "correctTerm": "ਸੁਤੰਤਰਤਾ",
    "distractors": [
      "ਮੁਕਤੀ",
      "ਛੁਟਕਾਰਾ",
      "ਸੰਨਿਆਸ"
    ],
    "explanationPa": "ਕੌਮੀ ਅਤੇ ਰਾਜਨੀਤਿਕ ਆਜ਼ਾਦੀ ਲਈ ‘ਸੁਤੰਤਰਤਾ’ ਸ਼ਬਦ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ, ਜਦਕਿ ‘ਮੁਕਤੀ’ ਸੰਸਾਰਕ ਬੰਧਨਾਂ ਜਾਂ ਮੋਹ ਤੋਂ ਛੁਟਕਾਰੇ ਲਈ ਆਉਂਦਾ ਹੈ।"
  },
  {
    "id": "NEAR-007",
    "termA": "ਆਸ",
    "termB": "ਲੋਚਾ",
    "contextSentence": "ਕਿਸਾਨ ਨੂੰ ਪਰਮਾਤਮਾ 'ਤੇ ਪੂਰੀ ‘____’ ਸੀ ਕਿ ਇਸ ਵਾਰ ਬਾਰਿਸ਼ ਸਮੇਂ ਸਿਰ ਹੋਵੇਗੀ।",
    "correctTerm": "ਆਸ",
    "distractors": [
      "ਲੋਚਾ",
      "ਤਾਂਘ",
      "ਲਾਲਸਾ"
    ],
    "explanationPa": "ਭਵਿੱਖ ਵਿੱਚ ਕਿਸੇ ਸ਼ੁਭ ਘਟਨਾ ਦੀ ਉਮੀਦ ਲਈ ‘ਆਸ’ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ, ਜਦਕਿ ‘ਲੋਚਾ’ ਮਨ ਦੀ ਤੀਬਰ ਤਾਂਘ ਹੁੰਦੀ ਹੈ।"
  },
  {
    "id": "NEAR-008",
    "termA": "ਮਿੱਤਰ",
    "termB": "ਸਾਥੀ",
    "contextSentence": "ਰੇਲ ਦੇ ਲੰਮੇ ਸਫ਼ਰ ਦੌਰਾਨ ਮੇਰੀ ਸੀਟ ਦੇ ਕੋਲ ਬੈਠਾ ਮੁਸਾਫ਼ਰ ਮੇਰਾ ਚੰਗਾ ‘____’ ਬਣ ਗਿਆ।",
    "correctTerm": "ਸਾਥੀ",
    "distractors": [
      "ਮਿੱਤਰ",
      "ਦੋਸਤ",
      "ਯਾਰ"
    ],
    "explanationPa": "ਸਫ਼ਰ ਜਾਂ ਕੰਮ ਵਿੱਚ ਨਾਲ ਹੋਣ ਵਾਲੇ ਨੂੰ ‘ਸਾਥੀ’ (ਸਫ਼ਰੀ) ਕਿਹਾ ਜਾਂਦਾ ਹੈ, ਜਦਕਿ ‘ਮਿੱਤਰ’ ਗੂੜ੍ਹੀ ਆਤਮੀ ਸਾਂਝ ਵਾਲਾ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "NEAR-009",
    "termA": "ਕ੍ਰੋਧ",
    "termB": "ਗੁੱਸਾ",
    "contextSentence": "ਰਿਸ਼ੀ ਦੁਰਵਾਸਾ ਆਪਣੇ ਤੇਜ ਅਤੇ ਬੇਕਾਬੂ ‘____’ ਕਾਰਨ ਪ੍ਰਸਿੱਧ ਸਨ।",
    "correctTerm": "ਕ੍ਰੋਧ",
    "distractors": [
      "ਗੁੱਸਾ",
      "ਨਾਰਾਜ਼ਗੀ",
      "ਖਿੱਝ"
    ],
    "explanationPa": "ਪੌਰਾਣਿਕ ਅਤੇ ਸਾਹਿਤਕ ਗੰਭੀਰ ਰੋਹ ਲਈ ‘ਕ੍ਰੋਧ’ ਟਕਸਾਲੀ ਸ਼ਬਦ ਹੈ।"
  },
  {
    "id": "NEAR-010",
    "termA": "ਧਨ",
    "termB": "ਰੁਪਈਆ",
    "contextSentence": "ਉਸ ਕੋਲ ਪੁਰਖਿਆਂ ਦੀ ਬਹੁਤ ਵੱਡੀ ‘____-ਦੌਲਤ’ ਅਤੇ ਜਾਇਦਾਦ ਸੀ।",
    "correctTerm": "ਧਨ",
    "distractors": [
      "ਰੁਪਈਆ",
      "ਸਿੱਕਾ",
      "ਕਰੰਸੀ"
    ],
    "explanationPa": "ਸਮੁੱਚੀ ਜਾਇਦਾਦ ਅਤੇ ਪੂੰਜੀ ਲਈ ‘ਧਨ’ (ਧਨ-ਦੌਲਤ) ਦਾ ਪ੍ਰਯੋਗ ਹੁੰਦਾ ਹੈ, ‘ਰੁਪਈਆ’ ਕੇਵਲ ਨਕਦ ਮੁਦਰਾ ਹੈ।"
  }
];
