/**
 * CP004: Gender & Number Systems (ਲਿੰਗ ਅਤੇ ਵਚਨ ਬਦਲੋ)
 * Curated knowledge base of regular and irregular inflectional paradigms in Punjabi.
 */

export interface GenderPair {
  readonly id: string;
  readonly masculine: string;
  readonly feminine: string;
  readonly ruleType:
    | "KANNA_TO_BIHARI"   // ਘੋੜਾ -> ਘੋੜੀ
    | "SUFFIX_NEE"        // ਸ਼ੇਰ -> ਸ਼ੇਰਨੀ
    | "SUFFIX_AANI"       // ਸੇਠ -> ਸੇਠਾਣੀ
    | "SUFFIX_AN"         // ਧੋਬੀ -> ਧੋਬਣ
    | "SUPPLETIVE";       // ਬਾਪ -> ਮਾਂ
  readonly commonDistractors: readonly string[];
  readonly explanationPa: string;
}

export interface NumberPair {
  readonly id: string;
  readonly singular: string;
  readonly plural: string;
  readonly ruleType:
    | "MASC_KANNA_TO_LAAN"     // ਮੁੰਡਾ -> ਮੁੰਡੇ
    | "FEM_MUKTA_TO_AAN"       // ਕਿਤਾਬ -> ਕਿਤਾਬਾਂ
    | "FEM_BIHARI_TO_IYAN"     // ਕੁੜੀ -> ਕੁੜੀਆਂ
    | "FEM_VOWEL_TO_VAAN"      // ਹਵਾ -> ਹਵਾਵਾਂ
    | "INVARIABLE_MASC";       // ਹਾਥੀ -> ਹਾਥੀ
  readonly commonDistractors: readonly string[];
  readonly explanationPa: string;
}

export const GENDER_PAIRS: readonly GenderPair[] = [
  {
    "id": "GEN-001",
    "masculine": "ਘੋੜਾ",
    "feminine": "ਘੋੜੀ",
    "ruleType": "KANNA_TO_BIHARI",
    "commonDistractors": [
      "ਘੋੜੀਆਂ",
      "ਘੋੜੇ",
      "ਘੋੜਨੀ"
    ],
    "explanationPa": "ਪੁਲਿੰਗ ਸ਼ਬਦ ਦੇ ਅੰਤਲੇ ‘ਕੰਨੇ’ ਨੂੰ ‘ਬਿਹਾਰੀ’ ਵਿੱਚ ਬਦਲ ਕੇ ਇਸਤਰੀ ਲਿੰਗ ‘ਘੋੜੀ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "id": "GEN-002",
    "masculine": "ਦਾਦਾ",
    "feminine": "ਦਾਦੀ",
    "ruleType": "KANNA_TO_BIHARI",
    "commonDistractors": [
      "ਦਾਦਨੀ",
      "ਦਾਦਿਆਂ",
      "ਦਾਦੇ"
    ],
    "explanationPa": "‘ਦਾਦਾ’ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ‘ਦਾਦੀ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "GEN-003",
    "masculine": "ਸ਼ੇਰ",
    "feminine": "ਸ਼ੇਰਨੀ",
    "ruleType": "SUFFIX_NEE",
    "commonDistractors": [
      "ਸ਼ੇਰੀ",
      "ਸ਼ੇਰਾਣੀ",
      "ਸ਼ੇਰਾਂ"
    ],
    "explanationPa": "ਸ਼ਬਦ ਦੇ ਅੰਤ ਵਿੱਚ ‘ਨੀ’ ਪਿਛੇਤਰ ਲਾ ਕੇ ਇਸਤਰੀ ਲਿੰਗ ‘ਸ਼ੇਰਨੀ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "id": "GEN-004",
    "masculine": "ਊਠ",
    "feminine": "ਊਠਣੀ",
    "ruleType": "SUFFIX_NEE",
    "commonDistractors": [
      "ਊਠੀ",
      "ਊਠਾਣੀ",
      "ਊਠਣ"
    ],
    "explanationPa": "‘ਊਠ’ ਦੇ ਅੰਤ ਵਿੱਚ ‘ਣੀ’ ਲਗਾ ਕੇ ਇਸਤਰੀ ਲਿੰਗ ‘ਊਠਣੀ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "id": "GEN-005",
    "masculine": "ਸੇਠ",
    "feminine": "ਸੇਠਾਣੀ",
    "ruleType": "SUFFIX_AANI",
    "commonDistractors": [
      "ਸੇਠੀ",
      "ਸੇਠਣੀ",
      "ਸੇਠਣ"
    ],
    "explanationPa": "ਅੰਤ ਵਿੱਚ ‘ਆਣੀ’ ਪਿਛੇਤਰ ਲਗਾਉਣ ਨਾਲ ‘ਸੇਠਾਣੀ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "id": "GEN-006",
    "masculine": "ਧੋਬੀ",
    "feminine": "ਧੋਬਣ",
    "ruleType": "SUFFIX_AN",
    "commonDistractors": [
      "ਧੋਬਣੀ",
      "ਧੋਬੀਆਣੀ",
      "ਧੋਬੀਆਂ"
    ],
    "explanationPa": "ਬਿਹਾਰੀ ਵਾਲੇ ਪੁਲਿੰਗ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ‘ਣ’ ਲਗਾ ਕੇ ‘ਧੋਬਣ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "id": "GEN-007",
    "masculine": "ਮੋਚੀ",
    "feminine": "ਮੋਚਣ",
    "ruleType": "SUFFIX_AN",
    "commonDistractors": [
      "ਮੋਚਣੀ",
      "ਮੋਚੀਆਣੀ",
      "ਮੋਚੀਨ"
    ],
    "explanationPa": "‘ਮੋਚੀ’ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ਰੂਪ ‘ਮੋਚਣ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "GEN-008",
    "masculine": "ਬਲਦ",
    "feminine": "ਗਾਂ",
    "ruleType": "SUPPLETIVE",
    "commonDistractors": [
      "ਬਲਦੀ",
      "ਬਲਦਣੀ",
      "ਗਊਆਂ"
    ],
    "explanationPa": "‘ਬਲਦ’ ਦਾ ਸੁਭਾਵਿਕ ਇਸਤਰੀ ਲਿੰਗ ਰੂਪ ‘ਗਾਂ’ ਹੁੰਦਾ ਹੈ (ਵੱਖਰੇ ਸ਼ਬਦ ਰਾਹੀਂ ਲਿੰਗ ਭੇਦ)।"
  },
  {
    "id": "GEN-009",
    "masculine": "ਭਰਾ",
    "feminine": "ਭੈਣ",
    "ruleType": "SUPPLETIVE",
    "commonDistractors": [
      "ਭਰਾਈ",
      "ਭਰਾਣੀ",
      "ਭੈਣਾਂ"
    ],
    "explanationPa": "‘ਭਰਾ’ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ਰੂਪ ‘ਭੈਣ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "GEN-010",
    "masculine": "ਵਰ",
    "feminine": "ਕੰਨਿਆ",
    "ruleType": "SUPPLETIVE",
    "commonDistractors": [
      "ਵਰੀ",
      "ਵਰਨੀ",
      "ਵਹੁਟੀ"
    ],
    "explanationPa": "‘ਵਰ’ (ਲਾੜਾ) ਦਾ ਸ਼ੁੱਧ ਵਿਆਕਰਣਕ ਇਸਤਰੀ ਲਿੰਗ ‘ਕੰਨਿਆ’ (ਜਾਂ ਵਧੂ) ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "GEN-011",
    "masculine": "ਚਾਚਾ",
    "feminine": "ਚਾਚੀ",
    "ruleType": "KANNA_TO_BIHARI",
    "commonDistractors": [
      "ਚਾਚਣੀ",
      "ਚਾਚਿਆਂ",
      "ਚਾਚੇ"
    ],
    "explanationPa": "ਕੰਨੇ ਵਾਲੇ ਪੁਲਿੰਗ ਸ਼ਬਦ ਦੇ ਅੰਤਲੇ ਕੰਨੇ ਨੂੰ ਬਿਹਾਰੀ ਵਿੱਚ ਬਦਲ ਕੇ ‘ਚਾਚੀ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "id": "GEN-012",
    "masculine": "ਮਾਮਾ",
    "feminine": "ਮਾਮੀ",
    "ruleType": "KANNA_TO_BIHARI",
    "commonDistractors": [
      "ਮਾਮਣੀ",
      "ਮਾਮਿਆਂ",
      "ਮਾਮੇ"
    ],
    "explanationPa": "‘ਮਾਮਾ’ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ਰੂਪ ‘ਮਾਮੀ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "GEN-013",
    "masculine": "ਨਾਨਾ",
    "feminine": "ਨਾਨੀ",
    "ruleType": "KANNA_TO_BIHARI",
    "commonDistractors": [
      "ਨਾਨਣੀ",
      "ਨਾਨਿਆਂ",
      "ਨਾਨੇ"
    ],
    "explanationPa": "‘ਨਾਨਾ’ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ਰੂਪ ‘ਨਾਨੀ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "GEN-014",
    "masculine": "ਬੱਚਾ",
    "feminine": "ਬੱਚੀ",
    "ruleType": "KANNA_TO_BIHARI",
    "commonDistractors": [
      "ਬੱਚਣੀ",
      "ਬੱਚਿਆਂ",
      "ਬੱਚੇ"
    ],
    "explanationPa": "‘ਬੱਚਾ’ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ‘ਬੱਚੀ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "GEN-015",
    "masculine": "ਕੁੱਕੜ",
    "feminine": "ਕੁੱਕੜੀ",
    "ruleType": "KANNA_TO_BIHARI",
    "commonDistractors": [
      "ਕੁੱਕੜਨੀ",
      "ਕੁੱਕੜਾਣੀ",
      "ਕੁੱਕੜਾਂ"
    ],
    "explanationPa": "ਮੁਕਤਾ-ਅੰਤਕ ਪੁਲਿੰਗ ਦੇ ਅੰਤ ਵਿੱਚ ਬਿਹਾਰੀ ਲਾ ਕੇ ‘ਕੁੱਕੜੀ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "id": "GEN-016",
    "masculine": "ਹਰਨ",
    "feminine": "ਹਰਨੀ",
    "ruleType": "SUFFIX_NEE",
    "commonDistractors": [
      "ਹਰਨੀਆਣੀ",
      "ਹਰਨਾਣੀ",
      "ਹਰਨਾਂ"
    ],
    "explanationPa": "‘ਹਰਨ’ ਦੇ ਅੰਤ ਵਿੱਚ ਬਿਹਾਰੀ ਲਗਾ ਕੇ ਇਸਤਰੀ ਲਿੰਗ ‘ਹਰਨੀ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "id": "GEN-017",
    "masculine": "ਮੋਰ",
    "feminine": "ਮੋਰਨੀ",
    "ruleType": "SUFFIX_NEE",
    "commonDistractors": [
      "ਮੋਰੀ",
      "ਮੋਰਾਣੀ",
      "ਮੋਰਾਂ"
    ],
    "explanationPa": "‘ਮੋਰ’ ਦੇ ਪਿੱਛੇ ‘ਨੀ’ ਪਿਛੇਤਰ ਲਗਾ ਕੇ ਇਸਤਰੀ ਲਿੰਗ ‘ਮੋਰਨੀ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "id": "GEN-018",
    "masculine": "ਸਰਦਾਰ",
    "feminine": "ਸਰਦਾਰਨੀ",
    "ruleType": "SUFFIX_NEE",
    "commonDistractors": [
      "ਸਰਦਾਰੀ",
      "ਸਰਦਾਰਾਣੀ",
      "ਸਰਦਾਰਣ"
    ],
    "explanationPa": "‘ਸਰਦਾਰ’ ਦੇ ਪਿੱਛੇ ‘ਨੀ’ ਲਗਾ ਕੇ ‘ਸਰਦਾਰਨੀ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "id": "GEN-019",
    "masculine": "ਸੂਫ਼ੀ",
    "feminine": "ਸੂਫ਼ਣ",
    "ruleType": "SUFFIX_AN",
    "commonDistractors": [
      "ਸੂਫ਼ਣੀ",
      "ਸੂਫ਼ੀਆਣੀ",
      "ਸੂਫ਼ੀਆਂ"
    ],
    "explanationPa": "ਬਿਹਾਰੀ ਵਾਲੇ ਪੁਲਿੰਗ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ‘ਣ’ ਲਗਾ ਕੇ ‘ਸੂਫ਼ਣ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "id": "GEN-020",
    "masculine": "ਜੱਟ",
    "feminine": "ਜੱਟੀ",
    "ruleType": "KANNA_TO_BIHARI",
    "commonDistractors": [
      "ਜੱਟਣੀ",
      "ਜੱਟਾਣੀ",
      "ਜੱਟਾਂ"
    ],
    "explanationPa": "‘ਜੱਟ’ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ਰੂਪ ‘ਜੱਟੀ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "GEN-021",
    "masculine": "ਪੰਡਿਤ",
    "feminine": "ਪੰਡਤਾਣੀ",
    "ruleType": "SUFFIX_AANI",
    "commonDistractors": [
      "ਪੰਡਿਤੀ",
      "ਪੰਡਿਤਣੀ",
      "ਪੰਡਤਣ"
    ],
    "explanationPa": "ਪੁਲਿੰਗ ਸ਼ਬਦ ਦੇ ਅੰਤ ਵਿੱਚ ‘ਆਣੀ’ ਪਿਛੇਤਰ ਲਗਾ ਕੇ ‘ਪੰਡਤਾਣੀ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "id": "GEN-022",
    "masculine": "ਨੌਕਰ",
    "feminine": "ਨੌਕਰਾਣੀ",
    "ruleType": "SUFFIX_AANI",
    "commonDistractors": [
      "ਨੌਕਰੀ",
      "ਨੌਕਰਣੀ",
      "ਨੌਕਰਣ"
    ],
    "explanationPa": "‘ਨੌਕਰ’ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ਰੂਪ ‘ਨੌਕਰਾਣੀ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "GEN-023",
    "masculine": "ਜੇਠ",
    "feminine": "ਜੇਠਾਣੀ",
    "ruleType": "SUFFIX_AANI",
    "commonDistractors": [
      "ਜੇਠੀ",
      "ਜੇਠਣੀ",
      "ਜੇਠਣ"
    ],
    "explanationPa": "‘ਜੇਠ’ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ‘ਜੇਠਾਣੀ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "GEN-024",
    "masculine": "ਮੁਗ਼ਲ",
    "feminine": "ਮੁਗ਼ਲਾਣੀ",
    "ruleType": "SUFFIX_AANI",
    "commonDistractors": [
      "ਮੁਗ਼ਲੀ",
      "ਮੁਗ਼ਲਣੀ",
      "ਮੁਗ਼ਲਣ"
    ],
    "explanationPa": "‘ਮੁਗ਼ਲ’ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ‘ਮੁਗ਼ਲਾਣੀ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "id": "GEN-025",
    "masculine": "ਤਰਖਾਣ",
    "feminine": "ਤਰਖਾਣੀ",
    "ruleType": "KANNA_TO_BIHARI",
    "commonDistractors": [
      "ਤਰਖਾਣਣੀ",
      "ਤਰਖਾਣਾਣੀ",
      "ਤਰਖਾਣਾਂ"
    ],
    "explanationPa": "‘ਤਰਖਾਣ’ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ਰੂਪ ‘ਤਰਖਾਣੀ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "GEN-026",
    "masculine": "ਸੁਨਿਆਰ",
    "feminine": "ਸੁਨਿਆਰੀ",
    "ruleType": "KANNA_TO_BIHARI",
    "commonDistractors": [
      "ਸੁਨਿਆਰਨ",
      "ਸੁਨਿਆਰਨੀ",
      "ਸੁਨਿਆਰਾਣੀ"
    ],
    "explanationPa": "‘ਸੁਨਿਆਰ’ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ‘ਸੁਨਿਆਰੀ’ (ਜਾਂ ਸੁਨਿਆਰਨ) ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "GEN-027",
    "masculine": "ਤੇਲੀ",
    "feminine": "ਤੇਲਣ",
    "ruleType": "SUFFIX_AN",
    "commonDistractors": [
      "ਤੇਲਣੀ",
      "ਤੇਲੀਆਣੀ",
      "ਤੇਲੀਆਂ"
    ],
    "explanationPa": "‘ਤੇਲੀ’ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ਰੂਪ ‘ਤੇਲਣ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "GEN-028",
    "masculine": "ਨਾਈ",
    "feminine": "ਨਾਇਣ",
    "ruleType": "SUFFIX_AN",
    "commonDistractors": [
      "ਨਾਈਆਣੀ",
      "ਨਾਇਣੀ",
      "ਨਾਈਆਂ"
    ],
    "explanationPa": "‘ਨਾਈ’ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ‘ਨਾਇਣ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "GEN-029",
    "masculine": "ਮਾਲੀ",
    "feminine": "ਮਾਲਣ",
    "ruleType": "SUFFIX_AN",
    "commonDistractors": [
      "ਮਾਲਣੀ",
      "ਮਾਲੀਆਣੀ",
      "ਮਾਲੀਆਂ"
    ],
    "explanationPa": "‘ਮਾਲੀ’ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ਰੂਪ ‘ਮਾਲਣ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "GEN-030",
    "masculine": "ਗੁਆਲਾ",
    "feminine": "ਗੁਆਲਣ",
    "ruleType": "SUFFIX_AN",
    "commonDistractors": [
      "ਗੁਆਲੀ",
      "ਗੁਆਲਣੀ",
      "ਗੁਆਲਿਆਂ"
    ],
    "explanationPa": "‘ਗੁਆਲਾ’ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ‘ਗੁਆਲਣ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "id": "GEN-031",
    "masculine": "ਪੁਰਖ",
    "feminine": "ਇਸਤਰੀ",
    "ruleType": "SUPPLETIVE",
    "commonDistractors": [
      "ਪੁਰਖੀ",
      "ਪੁਰਖਣੀ",
      "ਨਾਰੀ"
    ],
    "explanationPa": "ਵੱਖਰੇ ਸ਼ਬਦ ਰਾਹੀਂ ਲਿੰਗ ਭੇਦ ਵਿੱਚ ‘ਪੁਰਖ’ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ‘ਇਸਤਰੀ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "GEN-032",
    "masculine": "ਪਤੀ",
    "feminine": "ਪਤਨੀ",
    "ruleType": "SUPPLETIVE",
    "commonDistractors": [
      "ਪਤਨੀਆ",
      "ਪਤੀਣੀ",
      "ਔਰਤ"
    ],
    "explanationPa": "‘ਪਤੀ’ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ‘ਪਤਨੀ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "GEN-033",
    "masculine": "ਰਾਜਾ",
    "feminine": "ਰਾਣੀ",
    "ruleType": "SUPPLETIVE",
    "commonDistractors": [
      "ਰਾਜੀ",
      "ਰਾਜਨੀ",
      "ਰਾਜਿਆਂ"
    ],
    "explanationPa": "‘ਰਾਜਾ’ ਦਾ ਸੁਭਾਵਿਕ ਇਸਤਰੀ ਲਿੰਗ ‘ਰਾਣੀ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "GEN-034",
    "masculine": "ਮਰਦ",
    "feminine": "ਔਰਤ",
    "ruleType": "SUPPLETIVE",
    "commonDistractors": [
      "ਮਰਦੀ",
      "ਮਰਦਣੀ",
      "ਜ਼ਨਾਨੀ"
    ],
    "explanationPa": "‘ਮਰਦ’ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ਸ਼ੁੱਧ ਟਕਸਾਲੀ ਰੂਪ ‘ਔਰਤ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "GEN-035",
    "masculine": "ਪਿਤਾ",
    "feminine": "ਮਾਤਾ",
    "ruleType": "SUPPLETIVE",
    "commonDistractors": [
      "ਪਿਤਾਨੀ",
      "ਪਿਤੀ",
      "ਦਾਦੀ"
    ],
    "explanationPa": "‘ਪਿਤਾ’ ਦਾ ਵਿਆਕਰਣਕ ਇਸਤਰੀ ਲਿੰਗ ‘ਮਾਤਾ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "GEN-036",
    "masculine": "ਕਵੀ",
    "feminine": "ਕਵਿੱਤਰੀ",
    "ruleType": "SUPPLETIVE",
    "commonDistractors": [
      "ਕਵੀਣੀ",
      "ਕਵੀਆਣੀ",
      "ਕਵੀਆਂ"
    ],
    "explanationPa": "‘ਕਵੀ’ ਦਾ ਟਕਸਾਲੀ ਇਸਤਰੀ ਲਿੰਗ ‘ਕਵਿੱਤਰੀ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "GEN-037",
    "masculine": "ਵਰ",
    "feminine": "ਕੰਨਿਆ (ਵਧੂ)",
    "ruleType": "SUPPLETIVE",
    "commonDistractors": [
      "ਵਰੀ",
      "ਵਰਣੀ",
      "ਵਧੂਆਂ"
    ],
    "explanationPa": "‘ਵਰ’ (ਲਾੜਾ) ਦਾ ਇਸਤਰੀ ਲਿੰਗ ‘ਕੰਨਿਆ’ ਜਾਂ ‘ਵਧੂ’ (ਲਾੜੀ) ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "GEN-038",
    "masculine": "ਸਹੁਰਾ",
    "feminine": "ਸੱਸ",
    "ruleType": "SUPPLETIVE",
    "commonDistractors": [
      "ਸਹੁਰਣੀ",
      "ਸਹੂਰੀ",
      "ਸਹੁਰਿਆਣੀ"
    ],
    "explanationPa": "‘ਸਹੁਰਾ’ ਦਾ ਵਿਆਕਰਣਕ ਇਸਤਰੀ ਲਿੰਗ ‘ਸੱਸ’ ਹੈ।"
  },
  {
    "id": "GEN-039",
    "masculine": "ਜਵਾਈ",
    "feminine": "ਧੀ",
    "ruleType": "SUPPLETIVE",
    "commonDistractors": [
      "ਜਵਾਇਣ",
      "ਜਵਾਈਣੀ",
      "ਨੂੰਹ"
    ],
    "explanationPa": "ਰਿਸ਼ਤੇਦਾਰੀ ਲਿੰਗ ਪ੍ਰਣਾਲੀ ਵਿੱਚ ‘ਜਵਾਈ’ ਦਾ ਜੋੜੀਦਾਰ ਲਿੰਗ ‘ਧੀ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "GEN-040",
    "masculine": "ਫੁੱਫੜ",
    "feminine": "ਭੂਆ",
    "ruleType": "SUPPLETIVE",
    "commonDistractors": [
      "ਫੁੱਫੀ",
      "ਫੁੱਫੜਨੀ",
      "ਮਾਸੀ"
    ],
    "explanationPa": "‘ਫੁੱਫੜ’ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ‘ਭੂਆ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "GEN-041",
    "masculine": "ਮਾਸੜ",
    "feminine": "ਮਾਸੀ",
    "ruleType": "SUPPLETIVE",
    "commonDistractors": [
      "ਮਾਸਣੀ",
      "ਮਾਸੜੀ",
      "ਚਾਚੀ"
    ],
    "explanationPa": "‘ਮਾਸੜ’ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ‘ਮਾਸੀ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "GEN-042",
    "masculine": "ਚਾਚਾ",
    "feminine": "ਚਾਚੀ",
    "ruleType": "KANNA_TO_BIHARI",
    "commonDistractors": [
      "ਚਾਚਣੀ",
      "ਚਾਚਿਆਂ",
      "ਚਾਚਾਣੀ"
    ],
    "explanationPa": "ਕੰਨੇ ਦੀ ਥਾਂ ਬਿਹਾਰੀ ਲੱਗ ਕੇ ‘ਚਾਚੀ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "id": "GEN-043",
    "masculine": "ਮਾਮਾ",
    "feminine": "ਮਾਮੀ",
    "ruleType": "KANNA_TO_BIHARI",
    "commonDistractors": [
      "ਮਾਮਣੀ",
      "ਮਾਮੀਆਂ",
      "ਮਾਮਾਣੀ"
    ],
    "explanationPa": "‘ਮਾਮਾ’ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ‘ਮਾਮੀ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "GEN-044",
    "masculine": "ਨਾਨਾ",
    "feminine": "ਨਾਨੀ",
    "ruleType": "KANNA_TO_BIHARI",
    "commonDistractors": [
      "ਨਾਨਣੀ",
      "ਨਾਨਿਆਂ",
      "ਨਾਨਾਣੀ"
    ],
    "explanationPa": "‘ਨਾਨਾ’ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ‘ਨਾਨੀ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "id": "GEN-045",
    "masculine": "ਬਿੱਲਾ",
    "feminine": "ਬਿੱਲੀ",
    "ruleType": "KANNA_TO_BIHARI",
    "commonDistractors": [
      "ਬਿੱਲਣੀ",
      "ਬਿੱਲੀਆਂ",
      "ਬਿੱਲੋ"
    ],
    "explanationPa": "‘ਬਿੱਲਾ’ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ‘ਬਿੱਲੀ’ ਹੈ।"
  },
  {
    "id": "GEN-046",
    "masculine": "ਮੋਰ",
    "feminine": "ਮੋਰਨੀ",
    "ruleType": "SUFFIX_NEE",
    "commonDistractors": [
      "ਮੋਰੀ",
      "ਮੋਰਾਣੀ",
      "ਮੋਰਨ"
    ],
    "explanationPa": "‘ਮੋਰ’ ਦੇ ਅੰਤ ਵਿੱਚ ‘ਨੀ’ ਲੱਗ ਕੇ ‘ਮੋਰਨੀ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "id": "GEN-047",
    "masculine": "ਹਿਰਨ",
    "feminine": "ਹਿਰਨੀ",
    "ruleType": "SUFFIX_NEE",
    "commonDistractors": [
      "ਹਿਰਣੀ",
      "ਹਿਰਨਾਣੀ",
      "ਹਿਰਨਾਂ"
    ],
    "explanationPa": "‘ਹਿਰਨ’ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ‘ਹਿਰਨੀ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "GEN-048",
    "masculine": "ਸੰਤ",
    "feminine": "ਸੰਤਣੀ",
    "ruleType": "SUFFIX_NEE",
    "commonDistractors": [
      "ਸੰਤੀ",
      "ਸੰਤਾਣੀ",
      "ਸੰਤਨ"
    ],
    "explanationPa": "‘ਸੰਤ’ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ‘ਸੰਤਣੀ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "id": "GEN-049",
    "masculine": "ਜੱਟ",
    "feminine": "ਜੱਟੀ",
    "ruleType": "KANNA_TO_BIHARI",
    "commonDistractors": [
      "ਜੱਟਣੀ",
      "ਜੱਟਾਣੀ",
      "ਜੱਟਾਂ"
    ],
    "explanationPa": "‘ਜੱਟ’ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ਰੂਪ ‘ਜੱਟੀ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "GEN-050",
    "masculine": "ਖੱਤਰੀ",
    "feminine": "ਖਤਰਾਣੀ",
    "ruleType": "SUFFIX_AANI",
    "commonDistractors": [
      "ਖੱਤਰੀਆਣੀ",
      "ਖੱਤਰਣ",
      "ਖੱਤਰੀਆਂ"
    ],
    "explanationPa": "‘ਖੱਤਰੀ’ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ‘ਖਤਰਾਣੀ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "id": "GEN-051",
    "masculine": "ਪੰਡਿਤ",
    "feminine": "ਪੰਡਤਾਣੀ",
    "ruleType": "SUFFIX_AANI",
    "commonDistractors": [
      "ਪੰਡਤੀ",
      "ਪੰਡਤਣੀ",
      "ਪੰਡਤਨ"
    ],
    "explanationPa": "‘ਪੰਡਿਤ’ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ‘ਪੰਡਤਾਣੀ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "id": "GEN-052",
    "masculine": "ਚੌਧਰੀ",
    "feminine": "ਚੌਧਰਾਣੀ",
    "ruleType": "SUFFIX_AANI",
    "commonDistractors": [
      "ਚੌਧਰਣੀ",
      "ਚੌਧਰੀਆਣੀ",
      "ਚੌਧਰਨ"
    ],
    "explanationPa": "‘ਚੌਧਰੀ’ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ‘ਚੌਧਰਾਣੀ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "GEN-053",
    "masculine": "ਮੁਗ਼ਲ",
    "feminine": "ਮੁਗ਼ਲਾਣੀ",
    "ruleType": "SUFFIX_AANI",
    "commonDistractors": [
      "ਮੁਗ਼ਲੀ",
      "ਮੁਗ਼ਲਣੀ",
      "ਮੁਗ਼ਲਨ"
    ],
    "explanationPa": "‘ਮੁਗ਼ਲ’ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ‘ਮੁਗ਼ਲਾਣੀ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "id": "GEN-054",
    "masculine": "ਤੇਲੀ",
    "feminine": "ਤੇਲਣ",
    "ruleType": "SUFFIX_AN",
    "commonDistractors": [
      "ਤੇਲੀਆਣੀ",
      "ਤੇਲਣੀ",
      "ਤੇਲੀਆਂ"
    ],
    "explanationPa": "‘ਤੇਲੀ’ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ‘ਤੇਲਣ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "GEN-055",
    "masculine": "ਸੁਨਿਆਰ",
    "feminine": "ਸੁਨਿਆਰੀ",
    "ruleType": "KANNA_TO_BIHARI",
    "commonDistractors": [
      "ਸੁਨਿਆਰਨ",
      "ਸੁਨਿਆਰਣੀ",
      "ਸੁਨਿਆਰਾਣੀ"
    ],
    "explanationPa": "‘ਸੁਨਿਆਰ’ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ‘ਸੁਨਿਆਰੀ’ ਜਾਂ ‘ਸੁਨਿਆਰਨ’ ਮੰਨਿਆ ਜਾਂਦਾ ਹੈ।"
  },
  {
    "id": "GEN-056",
    "masculine": "ਲੁਹਾਰ",
    "feminine": "ਲੁਹਾਰੀ",
    "ruleType": "KANNA_TO_BIHARI",
    "commonDistractors": [
      "ਲੁਹਾਰਨ",
      "ਲੁਹਾਰਣੀ",
      "ਲੁਹਾਰਾਣੀ"
    ],
    "explanationPa": "‘ਲੁਹਾਰ’ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ‘ਲੁਹਾਰੀ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "GEN-057",
    "masculine": "ਕੁਮ੍ਹਾਰ",
    "feminine": "ਕੁਮ੍ਹਾਰੀ",
    "ruleType": "KANNA_TO_BIHARI",
    "commonDistractors": [
      "ਕੁਮ੍ਹਾਰਨ",
      "ਕੁਮ੍ਹਾਰਣੀ",
      "ਕੁਮ੍ਹਾਰਾਣੀ"
    ],
    "explanationPa": "‘ਕੁਮ੍ਹਾਰ’ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ‘ਕੁਮ੍ਹਾਰੀ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "GEN-058",
    "masculine": "ਤਰਖਾਣ",
    "feminine": "ਤਰਖਾਣੀ",
    "ruleType": "KANNA_TO_BIHARI",
    "commonDistractors": [
      "ਤਰਖਾਣਨ",
      "ਤਰਖਾਣਣੀ",
      "ਤਰਖਾਣਾਣੀ"
    ],
    "explanationPa": "‘ਤਰਖਾਣ’ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ‘ਤਰਖਾਣੀ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "id": "GEN-059",
    "masculine": "ਗ਼ੁਲਾਮ",
    "feminine": "ਬਾਂਦੀ",
    "ruleType": "SUPPLETIVE",
    "commonDistractors": [
      "ਗ਼ੁਲਾਮਣੀ",
      "ਗ਼ੁਲਾਮੀ",
      "ਦਾਸੀ"
    ],
    "explanationPa": "‘ਗ਼ੁਲਾਮ’ ਦਾ ਵਿਆਕਰਣਕ ਇਸਤਰੀ ਲਿੰਗ ‘ਬਾਂਦੀ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "GEN-060",
    "masculine": "ਸੂਰ",
    "feminine": "ਸੂਰਨੀ",
    "ruleType": "SUFFIX_NEE",
    "commonDistractors": [
      "ਸੂਰੀ",
      "ਸੂਰਨ",
      "ਸੂਰਾਣੀ"
    ],
    "explanationPa": "‘ਸੂਰ’ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ‘ਸੂਰਨੀ’ ਹੁੰਦਾ ਹੈ।"
  }
];

export const NUMBER_PAIRS: readonly NumberPair[] = [
  {
    "id": "NUM-001",
    "singular": "ਮੁੰਡਾ",
    "plural": "ਮੁੰਡੇ",
    "ruleType": "MASC_KANNA_TO_LAAN",
    "commonDistractors": [
      "ਮੁੰਡਿਆਂ",
      "ਮੁੰਡੀਆਂ",
      "ਮੁੰਡਾਵਾਂ"
    ],
    "explanationPa": "ਮੁਕਤ-ਕਾਰਕ ਵਿੱਚ ਕੰਨੇ ਵਾਲੇ ਪੁਲਿੰਗ ਸ਼ਬਦ ਦੇ ਅੰਤਲੇ ਕੰਨੇ ਨੂੰ ‘ਲਾਂ’ ਵਿੱਚ ਬਦਲ ਕੇ ‘ਮੁੰਡੇ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "id": "NUM-002",
    "singular": "ਕਮਰਾ",
    "plural": "ਕਮਰੇ",
    "ruleType": "MASC_KANNA_TO_LAAN",
    "commonDistractors": [
      "ਕਮਰੇਆਂ",
      "ਕਮਰੀਆਂ",
      "ਕਮਰਾਵਾਂ"
    ],
    "explanationPa": "ਕੰਨਾ-ਅੰਤਕ ਪੁਲਿੰਗ ਦਾ ਬਹੁਵਚਨ ‘ਕਮਰੇ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "NUM-003",
    "singular": "ਕਿਤਾਬ",
    "plural": "ਕਿਤਾਬਾਂ",
    "ruleType": "FEM_MUKTA_TO_AAN",
    "commonDistractors": [
      "ਕਿਤਾਬੇ",
      "ਕਿਤਾਬੀਆਂ",
      "ਕਿਤਾਬੂ"
    ],
    "explanationPa": "ਮੁਕਤਾ-ਅੰਤਕ ਇਸਤਰੀ ਲਿੰਗ ਸ਼ਬਦ ਦੇ ਅੰਤ ਵਿੱਚ ਕੰਨਾ ਅਤੇ ਬਿੰਦੀ (ਾਂ) ਲਗਾ ਕੇ ‘ਕਿਤਾਬਾਂ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "id": "NUM-004",
    "singular": "ਅੱਖ",
    "plural": "ਅੱਖਾਂ",
    "ruleType": "FEM_MUKTA_TO_AAN",
    "commonDistractors": [
      "ਅੱਖੇ",
      "ਅੱਖੀਆਂ",
      "ਅੱਖਣ"
    ],
    "explanationPa": "‘ਅੱਖ’ ਦਾ ਬਹੁਵਚਨ ਰੂਪ ‘ਅੱਖਾਂ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "NUM-005",
    "singular": "ਕੁੜੀ",
    "plural": "ਕੁੜੀਆਂ",
    "ruleType": "FEM_BIHARI_TO_IYAN",
    "commonDistractors": [
      "ਕੁੜੀਏ",
      "ਕੁੜੀਵਾਂ",
      "ਕੁੜੇ"
    ],
    "explanationPa": "ਬਿਹਾਰੀ-ਅੰਤਕ ਇਸਤਰੀ ਲਿੰਗ ਸ਼ਬਦ ਦੇ ਅੰਤ ਵਿੱਚ ‘ਆਂ’ ਲਗਾ ਕੇ ਬਹੁਵਚਨ ‘ਕੁੜੀਆਂ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "id": "NUM-006",
    "singular": "ਕੁਰਸੀ",
    "plural": "ਕੁਰਸੀਆਂ",
    "ruleType": "FEM_BIHARI_TO_IYAN",
    "commonDistractors": [
      "ਕੁਰਸੀਏ",
      "ਕੁਰਸੀਵਾਂ",
      "ਕੁਰਸੇ"
    ],
    "explanationPa": "‘ਕੁਰਸੀ’ ਦਾ ਬਹੁਵਚਨ ਰੂਪ ‘ਕੁਰਸੀਆਂ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "NUM-007",
    "singular": "ਹਵਾ",
    "plural": "ਹਵਾਵਾਂ",
    "ruleType": "FEM_VOWEL_TO_VAAN",
    "commonDistractors": [
      "ਹਵਾਏਂ",
      "ਹਵਾਵਾਂਈ",
      "ਹਵਾਏ"
    ],
    "explanationPa": "ਕੰਨਾ-ਅੰਤਕ ਇਸਤਰੀ ਲਿੰਗ ਸ਼ਬਦ ਦੇ ਅੰਤ ਵਿੱਚ ‘ਵਾਂ’ ਲਗਾ ਕੇ ‘ਹਵਾਵਾਂ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "id": "NUM-008",
    "singular": "ਕਵਿਤਾ",
    "plural": "ਕਵਿਤਾਵਾਂ",
    "ruleType": "FEM_VOWEL_TO_VAAN",
    "commonDistractors": [
      "ਕਵਿਤਾਏਂ",
      "ਕਵਿਤਿਆਂ",
      "ਕਵਿਤੇ"
    ],
    "explanationPa": "‘ਕਵਿਤਾ’ ਦਾ ਬਹੁਵਚਨ ਰੂਪ ‘ਕਵਿਤਾਵਾਂ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "NUM-009",
    "singular": "ਹਾਥੀ",
    "plural": "ਹਾਥੀ",
    "ruleType": "INVARIABLE_MASC",
    "commonDistractors": [
      "ਹਾਥੀਆਂ",
      "ਹਾਥੀਏ",
      "ਹਾਥੀਵਾਂ"
    ],
    "explanationPa": "ਬਿਨਾਂ ਸੰਬੰਧਕੀ ਰੂਪ (ਮੁਕਤ-ਕਾਰਕ) ਵਿੱਚ ‘ਹਾਥੀ’ ਦਾ ਇੱਕਵਚਨ ਅਤੇ ਬਹੁਵਚਨ ਇੱਕੋ ਜਿਹਾ (ਹਾਥੀ) ਰਹਿੰਦਾ ਹੈ। ਜਿਵੇਂ: ਇੱਕ ਹਾਥੀ ਜਾ ਰਿਹਾ ਹੈ / ਦੋ ਹਾਥੀ ਜਾ ਰਹੇ ਹਨ।"
  },
  {
    "id": "NUM-010",
    "singular": "ਦਰੱਖ਼ਤ",
    "plural": "ਦਰੱਖ਼ਤ",
    "ruleType": "INVARIABLE_MASC",
    "commonDistractors": [
      "ਦਰੱਖ਼ਤਾਂ",
      "ਦਰੱਖ਼ਤੇ",
      "ਦਰੱਖ਼ਤੀਆਂ"
    ],
    "explanationPa": "ਸਧਾਰਨ ਅਵਸਥਾ ਵਿੱਚ ਮੁਕਤਾ-ਅੰਤਕ ਪੁਲਿੰਗ ਸ਼ਬਦ ‘ਦਰੱਖ਼ਤ’ ਬਹੁਵਚਨ ਵਿੱਚ ਵੀ ‘ਦਰੱਖ਼ਤ’ ਹੀ ਰਹਿੰਦਾ ਹੈ (ਜਿਵੇਂ: ਕਈ ਦਰੱਖ਼ਤ ਹਰੇ-ਭਰੇ ਹਨ)। ਸੰਬੰਧਕੀ ਰੂਪ ਵਿੱਚ ‘ਦਰੱਖ਼ਤਾਂ ਨੂੰ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "NUM-011",
    "singular": "ਘੋੜਾ",
    "plural": "ਘੋੜੇ",
    "ruleType": "MASC_KANNA_TO_LAAN",
    "commonDistractors": [
      "ਘੋੜਿਆਂ",
      "ਘੋੜੀਆਂ",
      "ਘੋੜਾਵਾਂ"
    ],
    "explanationPa": "ਕੰਨਾ-ਅੰਤਕ ਪੁਲਿੰਗ ਦਾ ਸਾਧਾਰਨ ਬਹੁਵਚਨ ‘ਘੋੜੇ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "NUM-012",
    "singular": "ਬੱਚਾ",
    "plural": "ਬੱਚੇ",
    "ruleType": "MASC_KANNA_TO_LAAN",
    "commonDistractors": [
      "ਬੱਚਿਆਂ",
      "ਬੱਚੀਆਂ",
      "ਬੱਚਾਵਾਂ"
    ],
    "explanationPa": "‘ਬੱਚਾ’ ਦਾ ਸਾਧਾਰਨ ਬਹੁਵਚਨ ਰੂਪ ‘ਬੱਚੇ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "id": "NUM-013",
    "singular": "ਚਰਖਾ",
    "plural": "ਚਰਖੇ",
    "ruleType": "MASC_KANNA_TO_LAAN",
    "commonDistractors": [
      "ਚਰਖਿਆਂ",
      "ਚਰਖੀਆਂ",
      "ਚਰਖਾਵਾਂ"
    ],
    "explanationPa": "‘ਚਰਖਾ’ ਦਾ ਬਹੁਵਚਨ ‘ਚਰਖੇ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "NUM-014",
    "singular": "ਪੱਖਾ",
    "plural": "ਪੱਖੇ",
    "ruleType": "MASC_KANNA_TO_LAAN",
    "commonDistractors": [
      "ਪੱਖਿਆਂ",
      "ਪੱਖੀਆਂ",
      "ਪੱਖਾਵਾਂ"
    ],
    "explanationPa": "‘ਪੱਖਾ’ ਦਾ ਬਹੁਵਚਨ ‘ਪੱਖੇ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "id": "NUM-015",
    "singular": "ਤਾਰਾ",
    "plural": "ਤਾਰੇ",
    "ruleType": "MASC_KANNA_TO_LAAN",
    "commonDistractors": [
      "ਤਾਰਿਆਂ",
      "ਤਾਰੀਆਂ",
      "ਤਾਰਾਵਾਂ"
    ],
    "explanationPa": "‘ਤਾਰਾ’ ਦਾ ਬਹੁਵਚਨ ਰੂਪ ‘ਤਾਰੇ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "NUM-016",
    "singular": "ਮੇਜ਼",
    "plural": "ਮੇਜ਼ਾਂ",
    "ruleType": "FEM_MUKTA_TO_AAN",
    "commonDistractors": [
      "ਮੇਜ਼ੇ",
      "ਮੇਜ਼ੀਆਂ",
      "ਮੇਜ਼ਵਾਂ"
    ],
    "explanationPa": "ਮੁਕਤਾ-ਅੰਤਕ ਇਸਤਰੀ ਲਿੰਗ ਸ਼ਬਦ ‘ਮੇਜ਼’ ਦਾ ਬਹੁਵਚਨ ‘ਮੇਜ਼ਾਂ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "id": "NUM-017",
    "singular": "ਕਲਮ",
    "plural": "ਕਲਮਾਂ",
    "ruleType": "FEM_MUKTA_TO_AAN",
    "commonDistractors": [
      "ਕਲਮੇ",
      "ਕਲਮੀਆਂ",
      "ਕਲਮਵਾਂ"
    ],
    "explanationPa": "‘ਕਲਮ’ ਦਾ ਬਹੁਵਚਨ ਰੂਪ ‘ਕਲਮਾਂ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "NUM-018",
    "singular": "ਰਾਤ",
    "plural": "ਰਾਤਾਂ",
    "ruleType": "FEM_MUKTA_TO_AAN",
    "commonDistractors": [
      "ਰਾਤੇ",
      "ਰਾਤੀਆਂ",
      "ਰਾਤਵਾਂ"
    ],
    "explanationPa": "‘ਰਾਤ’ ਦਾ ਬਹੁਵਚਨ ‘ਰਾਤਾਂ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "NUM-019",
    "singular": "ਸੜਕ",
    "plural": "ਸੜਕਾਂ",
    "ruleType": "FEM_MUKTA_TO_AAN",
    "commonDistractors": [
      "ਸੜਕੇ",
      "ਸੜਕੀਆਂ",
      "ਸੜਕਵਾਂ"
    ],
    "explanationPa": "‘ਸੜਕ’ ਦਾ ਬਹੁਵਚਨ ਰੂਪ ‘ਸੜਕਾਂ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "id": "NUM-020",
    "singular": "ਬਾਤ",
    "plural": "ਬਾਤਾਂ",
    "ruleType": "FEM_MUKTA_TO_AAN",
    "commonDistractors": [
      "ਬਾਤੇ",
      "ਬਾਤੀਆਂ",
      "ਬਾਤਵਾਂ"
    ],
    "explanationPa": "‘ਬਾਤ’ ਦਾ ਬਹੁਵਚਨ ‘ਬਾਤਾਂ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "NUM-021",
    "singular": "ਰੋਟੀ",
    "plural": "ਰੋਟੀਆਂ",
    "ruleType": "FEM_BIHARI_TO_IYAN",
    "commonDistractors": [
      "ਰੋਟੀਏ",
      "ਰੋਟੀਵਾਂ",
      "ਰੋਟੇ"
    ],
    "explanationPa": "ਬਿਹਾਰੀ-ਅੰਤਕ ਇਸਤਰੀ ਲਿੰਗ ਸ਼ਬਦ ‘ਰੋਟੀ’ ਦਾ ਬਹੁਵਚਨ ‘ਰੋਟੀਆਂ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "id": "NUM-022",
    "singular": "ਥਾਲੀ",
    "plural": "ਥਾਲੀਆਂ",
    "ruleType": "FEM_BIHARI_TO_IYAN",
    "commonDistractors": [
      "ਥਾਲੀਏ",
      "ਥਾਲੀਵਾਂ",
      "ਥਾਲੇ"
    ],
    "explanationPa": "‘ਥਾਲੀ’ ਦਾ ਬਹੁਵਚਨ ‘ਥਾਲੀਆਂ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "NUM-023",
    "singular": "ਨਦੀ",
    "plural": "ਨਦੀਆਂ",
    "ruleType": "FEM_BIHARI_TO_IYAN",
    "commonDistractors": [
      "ਨਦੀਏ",
      "ਨਦੀਵਾਂ",
      "ਨਦੇ"
    ],
    "explanationPa": "‘ਨਦੀ’ ਦਾ ਬਹੁਵਚਨ ਰੂਪ ‘ਨਦੀਆਂ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "id": "NUM-024",
    "singular": "ਕਾਪੀ",
    "plural": "ਕਾਪੀਆਂ",
    "ruleType": "FEM_BIHARI_TO_IYAN",
    "commonDistractors": [
      "ਕਾਪੀਏ",
      "ਕਾਪੀਵਾਂ",
      "ਕਾਪੇ"
    ],
    "explanationPa": "‘ਕਾਪੀ’ ਦਾ ਬਹੁਵਚਨ ‘ਕਾਪੀਆਂ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "NUM-025",
    "singular": "ਗਲੀ",
    "plural": "ਗਲੀਆਂ",
    "ruleType": "FEM_BIHARI_TO_IYAN",
    "commonDistractors": [
      "ਗਲੀਏ",
      "ਗਲੀਵਾਂ",
      "ਗਲੇ"
    ],
    "explanationPa": "‘ਗਲੀ’ ਦਾ ਬਹੁਵਚਨ ਰੂਪ ‘ਗਲੀਆਂ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "id": "NUM-026",
    "singular": "ਸਭਾ",
    "plural": "ਸਭਾਵਾਂ",
    "ruleType": "FEM_VOWEL_TO_VAAN",
    "commonDistractors": [
      "ਸਭਾਏਂ",
      "ਸਭਾਈਆਂ",
      "ਸਭੇ"
    ],
    "explanationPa": "ਕੰਨਾ-ਅੰਤਕ ਇਸਤਰੀ ਲਿੰਗ ‘ਸਭਾ’ ਦੇ ਅੰਤ ਵਿੱਚ ‘ਵਾਂ’ ਲਗਾ ਕੇ ‘ਸਭਾਵਾਂ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "id": "NUM-027",
    "singular": "ਮਾਂ",
    "plural": "ਮਾਵਾਂ",
    "ruleType": "FEM_VOWEL_TO_VAAN",
    "commonDistractors": [
      "ਮਾਤਾਵਾਂ",
      "ਮਾਈਆਂ",
      "ਮਾਏਂ"
    ],
    "explanationPa": "‘ਮਾਂ’ ਦਾ ਬਹੁਵਚਨ ਰੂਪ ‘ਮਾਵਾਂ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "NUM-028",
    "singular": "ਭਾਸ਼ਾ",
    "plural": "ਭਾਸ਼ਾਵਾਂ",
    "ruleType": "FEM_VOWEL_TO_VAAN",
    "commonDistractors": [
      "ਭਾਸ਼ਾਏਂ",
      "ਭਾਸ਼ਾਈਆਂ",
      "ਭਾਸ਼ੇ"
    ],
    "explanationPa": "‘ਭਾਸ਼ਾ’ ਦਾ ਬਹੁਵਚਨ ‘ਭਾਸ਼ਾਵਾਂ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "id": "NUM-029",
    "singular": "ਬਲਾ",
    "plural": "ਬਲਾਵਾਂ",
    "ruleType": "FEM_VOWEL_TO_VAAN",
    "commonDistractors": [
      "ਬਲਾਏਂ",
      "ਬਲਾਈਆਂ",
      "ਬਲੇ"
    ],
    "explanationPa": "‘ਬਲਾ’ ਦਾ ਬਹੁਵਚਨ ‘ਬਲਾਵਾਂ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "NUM-030",
    "singular": "ਸਜ਼ਾ",
    "plural": "ਸਜ਼ਾਵਾਂ",
    "ruleType": "FEM_VOWEL_TO_VAAN",
    "commonDistractors": [
      "ਸਜ਼ਾਏਂ",
      "ਸਜ਼ਾਈਆਂ",
      "ਸਜ਼ੇ"
    ],
    "explanationPa": "‘ਸਜ਼ਾ’ ਦਾ ਬਹੁਵਚਨ ਰੂਪ ‘ਸਜ਼ਾਵਾਂ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "id": "NUM-031",
    "singular": "ਸ਼ੇਰ",
    "plural": "ਸ਼ੇਰ",
    "ruleType": "INVARIABLE_MASC",
    "commonDistractors": [
      "ਸ਼ੇਰਾਂ",
      "ਸ਼ੇਰੇ",
      "ਸ਼ੇਰੀਆਂ"
    ],
    "explanationPa": "ਮੁਕਤ-ਕਾਰਕ ਵਿੱਚ ਪੁਲਿੰਗ ਸ਼ਬਦ ‘ਸ਼ੇਰ’ ਦਾ ਬਹੁਵਚਨ ਰੂਪ ‘ਸ਼ੇਰ’ ਹੀ ਰਹਿੰਦਾ ਹੈ (ਜਿਵੇਂ: ਦੋ ਸ਼ੇਰ ਗਰਜੇ)।"
  },
  {
    "id": "NUM-032",
    "singular": "ਘਰ",
    "plural": "ਘਰ",
    "ruleType": "INVARIABLE_MASC",
    "commonDistractors": [
      "ਘਰਾਂ",
      "ਘਰੇ",
      "ਘਰੀਆਂ"
    ],
    "explanationPa": "ਸਾਧਾਰਨ ਕਾਰਕ ਵਿੱਚ ‘ਘਰ’ ਦਾ ਬਹੁਵਚਨ ‘ਘਰ’ ਹੀ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "NUM-033",
    "singular": "ਫੁੱਲ",
    "plural": "ਫੁੱਲ",
    "ruleType": "INVARIABLE_MASC",
    "commonDistractors": [
      "ਫੁੱਲਾਂ",
      "ਫੁੱਲੇ",
      "ਫੁੱਲੀਆਂ"
    ],
    "explanationPa": "‘ਫੁੱਲ’ ਸ਼ਬਦ ਦਾ ਇੱਕਵਚਨ ਅਤੇ ਬਹੁਵਚਨ ਸਧਾਰਨ ਰੂਪ ਵਿੱਚ ਇੱਕ ਸਮਾਨ ਰਹਿੰਦਾ ਹੈ।"
  },
  {
    "id": "NUM-034",
    "singular": "ਸ਼ਹਿਰ",
    "plural": "ਸ਼ਹਿਰ",
    "ruleType": "INVARIABLE_MASC",
    "commonDistractors": [
      "ਸ਼ਹਿਰਾਂ",
      "ਸ਼ਹਿਰੇ",
      "ਸ਼ਹਿਰੀਆਂ"
    ],
    "explanationPa": "ਸਾਧਾਰਨ ਬਹੁਵਚਨ ਵਿੱਚ ‘ਸ਼ਹਿਰ’ ਹੀ ਰਹਿੰਦਾ ਹੈ (ਜਿਵੇਂ: ਪੰਜਾਬ ਦੇ ਕਈ ਸ਼ਹਿਰ ਸੁੰਦਰ ਹਨ)।"
  },
  {
    "id": "NUM-035",
    "singular": "ਪਿੰਡ",
    "plural": "ਪਿੰਡ",
    "ruleType": "INVARIABLE_MASC",
    "commonDistractors": [
      "ਪਿੰਡਾਂ",
      "ਪਿੰਡੇ",
      "ਪਿੰਡੀਆਂ"
    ],
    "explanationPa": "ਸਧਾਰਨ ਰੂਪ ਵਿੱਚ ‘ਪਿੰਡ’ ਦਾ ਬਹੁਵਚਨ ‘ਪਿੰਡ’ ਹੀ ਰਹਿੰਦਾ ਹੈ।"
  },
  {
    "id": "NUM-036",
    "singular": "ਕੁੜੀ",
    "plural": "ਕੁੜੀਆਂ",
    "ruleType": "FEM_BIHARI_TO_IYAN",
    "commonDistractors": [
      "ਕੁੜੀਏ",
      "ਕੁੜੀਓ",
      "ਕੁੜੀਆਂ ਨੇ"
    ],
    "explanationPa": "ਅੰਤਲੇ ਬਿਹਾਰੀ ਵਾਲੇ ਇਸਤਰੀ ਲਿੰਗ ਸ਼ਬਦ ਨਾਲ ‘ਆਂ’ ਲੱਗ ਕੇ ਬਹੁਵਚਨ ‘ਕੁੜੀਆਂ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "id": "NUM-037",
    "singular": "ਤਖ਼ਤੀ",
    "plural": "ਤਖ਼ਤੀਆਂ",
    "ruleType": "FEM_BIHARI_TO_IYAN",
    "commonDistractors": [
      "ਤਖ਼ਤੀਏ",
      "ਤਖ਼ਤੀਓ",
      "ਤਖ਼ਤੇ"
    ],
    "explanationPa": "‘ਤਖ਼ਤੀ’ ਦਾ ਬਹੁਵਚਨ ‘ਤਖ਼ਤੀਆਂ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "NUM-038",
    "singular": "ਰੋਟੀ",
    "plural": "ਰੋਟੀਆਂ",
    "ruleType": "FEM_BIHARI_TO_IYAN",
    "commonDistractors": [
      "ਰੋਟੀਏ",
      "ਰੋਟੇ",
      "ਰੋਟੀਆਂ ਨੇ"
    ],
    "explanationPa": "‘ਰੋਟੀ’ ਦਾ ਬਹੁਵਚਨ ‘ਰੋਟੀਆਂ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "NUM-039",
    "singular": "ਸੜਕ",
    "plural": "ਸੜਕਾਂ",
    "ruleType": "FEM_MUKTA_TO_AAN",
    "commonDistractors": [
      "ਸੜਕੇ",
      "ਸੜਕੀਆਂ",
      "ਸੜਕੋਂ"
    ],
    "explanationPa": "ਮੁਕਤਾ-ਅੰਤ ਇਸਤਰੀ ਲਿੰਗ ਸ਼ਬਦ ਨਾਲ ਕੰਨਾ ਉੱਤੇ ਬਿੰਦੀ (ਾਂ) ਲੱਗ ਕੇ ਬਹੁਵਚਨ ‘ਸੜਕਾਂ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "id": "NUM-040",
    "singular": "ਕਿਤਾਬ",
    "plural": "ਕਿਤਾਬਾਂ",
    "ruleType": "FEM_MUKTA_TO_AAN",
    "commonDistractors": [
      "ਕਿਤਾਬੇ",
      "ਕਿਤਾਬੀਆਂ",
      "ਕਿਤਾਬੋਂ"
    ],
    "explanationPa": "‘ਕਿਤਾਬ’ ਦਾ ਬਹੁਵਚਨ ‘ਕਿਤਾਬਾਂ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "NUM-041",
    "singular": "ਅੱਖ",
    "plural": "ਅੱਖਾਂ",
    "ruleType": "FEM_MUKTA_TO_AAN",
    "commonDistractors": [
      "ਅੱਖੇ",
      "ਅੱਖੀਆਂ",
      "ਅੱਖੋਂ"
    ],
    "explanationPa": "‘ਅੱਖ’ ਦਾ ਬਹੁਵਚਨ ‘ਅੱਖਾਂ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "id": "NUM-042",
    "singular": "ਮੱਝ",
    "plural": "ਮੱਝਾਂ",
    "ruleType": "FEM_MUKTA_TO_AAN",
    "commonDistractors": [
      "ਮੱਝੇ",
      "ਮੱਝੀਆਂ",
      "ਮੱਝੋਂ"
    ],
    "explanationPa": "‘ਮੱਝ’ ਦਾ ਬਹੁਵਚਨ ‘ਮੱਝਾਂ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "id": "NUM-043",
    "singular": "ਗਾਂ",
    "plural": "ਗਾਵਾਂ",
    "ruleType": "FEM_VOWEL_TO_VAAN",
    "commonDistractors": [
      "ਗਾਈਆਂ",
      "ਗਾਵੀਂ",
      "ਗਾਏਂ"
    ],
    "explanationPa": "‘ਗਾਂ’ ਦਾ ਬਹੁਵਚਨ ਰੂਪ ‘ਗਾਵਾਂ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "NUM-044",
    "singular": "ਛਾਂ",
    "plural": "ਛਾਵਾਂ",
    "ruleType": "FEM_VOWEL_TO_VAAN",
    "commonDistractors": [
      "ਛਾਈਆਂ",
      "ਛਾਵੇਂ",
      "ਛਾਏਂ"
    ],
    "explanationPa": "‘ਛਾਂ’ ਦਾ ਬਹੁਵਚਨ ‘ਛਾਵਾਂ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "id": "NUM-045",
    "singular": "ਸੂਈ",
    "plural": "ਸੂਈਆਂ",
    "ruleType": "FEM_BIHARI_TO_IYAN",
    "commonDistractors": [
      "ਸੂਏ",
      "ਸੂਈਏ",
      "ਸੂਆਂ"
    ],
    "explanationPa": "‘ਸੂਈ’ ਦਾ ਬਹੁਵਚਨ ‘ਸੂਈਆਂ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "NUM-046",
    "singular": "ਘੋੜਾ",
    "plural": "ਘੋੜੇ",
    "ruleType": "MASC_KANNA_TO_LAAN",
    "commonDistractors": [
      "ਘੋੜਿਆਂ",
      "ਘੋੜੀ",
      "ਘੋੜੋਂ"
    ],
    "explanationPa": "ਪੁਲਿੰਗ ਕੰਨਾ-ਅੰਤ ਸ਼ਬਦ ਲਾਂ ਵਿੱਚ ਬਦਲ ਕੇ ਬਹੁਵਚਨ ‘ਘੋੜੇ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "id": "NUM-047",
    "singular": "ਮੁੰਡਾ",
    "plural": "ਮੁੰਡੇ",
    "ruleType": "MASC_KANNA_TO_LAAN",
    "commonDistractors": [
      "ਮੁੰਡਿਆਂ",
      "ਮੁੰਡੀ",
      "ਮੁੰਡੋਂ"
    ],
    "explanationPa": "‘ਮੁੰਡਾ’ ਦਾ ਬਹੁਵਚਨ ‘ਮੁੰਡੇ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "NUM-048",
    "singular": "ਕੁੱਤਾ",
    "plural": "ਕੁੱਤੇ",
    "ruleType": "MASC_KANNA_TO_LAAN",
    "commonDistractors": [
      "ਕੁੱਤਿਆਂ",
      "ਕੁੱਤੀ",
      "ਕੁੱਤੋਂ"
    ],
    "explanationPa": "‘ਕੁੱਤਾ’ ਦਾ ਬਹੁਵਚਨ ‘ਕੁੱਤੇ’ ਬਣਦਾ ਹੈ।"
  },
  {
    "id": "NUM-049",
    "singular": "ਦਰਵਾਜ਼ਾ",
    "plural": "ਦਰਵਾਜ਼ੇ",
    "ruleType": "MASC_KANNA_TO_LAAN",
    "commonDistractors": [
      "ਦਰਵਾਜ਼ਿਆਂ",
      "ਦਰਵਾਜ਼ੀ",
      "ਦਰਵਾਜ਼ੋਂ"
    ],
    "explanationPa": "‘ਦਰਵਾਜ਼ਾ’ ਦਾ ਬਹੁਵਚਨ ‘ਦਰਵਾਜ਼ੇ’ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "id": "NUM-050",
    "singular": "ਕਮਰਾ",
    "plural": "ਕਮਰੇ",
    "ruleType": "MASC_KANNA_TO_LAAN",
    "commonDistractors": [
      "ਕਮਰਿਆਂ",
      "ਕਮਰੀ",
      "ਕਮਰੋਂ"
    ],
    "explanationPa": "‘ਕਮਰਾ’ ਦਾ ਬਹੁਵਚਨ ‘ਕਮਰੇ’ ਬਣਦਾ ਹੈ।"
  }
];
