export type CP004AuthorityStatus = "REVIEW_PENDING";
export type CP004GenderKind = "MORPHOLOGICAL_PAIR" | "LEXICAL_COUNTERPART";
export type CP004GenderDomain = "ANIMAL" | "KINSHIP" | "OCCUPATION" | "GENERAL_HUMAN";
export type CP004GenderRule =
  | "A_TO_I"
  | "I_TO_AN"
  | "SUFFIX_NI"
  | "SUFFIX_ANI"
  | "LEXICAL";
export type CP004NumberRule =
  | "MASC_A_TO_E"
  | "FEM_CONSONANT_TO_AAN"
  | "FEM_I_TO_IAN"
  | "VOWEL_TO_VAAN"
  | "IRREGULAR";

export interface CP004GenderPair {
  id: string;
  masculine: string;
  feminine: string;
  kind: CP004GenderKind;
  domain: CP004GenderDomain;
  rule: CP004GenderRule;
  transformSafe: boolean;
  sourceStatus: CP004AuthorityStatus;
}

export interface CP004NumberPair {
  id: string;
  singular: string;
  plural: string;
  rule: CP004NumberRule;
  sourceStatus: CP004AuthorityStatus;
}

export type CP004AgreementDimension = "GENDER" | "NUMBER";
export interface CP004AgreementContext {
  id: string;
  dimension: CP004AgreementDimension;
  targetPa: string;
  correct: string;
  incorrect: readonly [string, string, string, string];
  principlePa: string;
  sourceStatus: CP004AuthorityStatus;
}

/**
 * Only single-truth canonical pairs survive the forward port.
 * Distractors are deliberately NOT stored as fabricated derivatives of a headword.
 * Direct-form families build options from other attested canonical authorities instead.
 */
export const CP004_GENDER_PAIRS: readonly CP004GenderPair[] = [
  { id:"GEN-001", masculine:"ਘੋੜਾ", feminine:"ਘੋੜੀ", domain:"ANIMAL", kind:"MORPHOLOGICAL_PAIR", rule:"A_TO_I", transformSafe:true, sourceStatus:"REVIEW_PENDING" },
  { id:"GEN-002", masculine:"ਦਾਦਾ", feminine:"ਦਾਦੀ", domain:"KINSHIP", kind:"MORPHOLOGICAL_PAIR", rule:"A_TO_I", transformSafe:true, sourceStatus:"REVIEW_PENDING" },
  { id:"GEN-003", masculine:"ਚਾਚਾ", feminine:"ਚਾਚੀ", domain:"KINSHIP", kind:"MORPHOLOGICAL_PAIR", rule:"A_TO_I", transformSafe:true, sourceStatus:"REVIEW_PENDING" },
  { id:"GEN-004", masculine:"ਮਾਮਾ", feminine:"ਮਾਮੀ", domain:"KINSHIP", kind:"MORPHOLOGICAL_PAIR", rule:"A_TO_I", transformSafe:true, sourceStatus:"REVIEW_PENDING" },
  { id:"GEN-005", masculine:"ਨਾਨਾ", feminine:"ਨਾਨੀ", domain:"KINSHIP", kind:"MORPHOLOGICAL_PAIR", rule:"A_TO_I", transformSafe:true, sourceStatus:"REVIEW_PENDING" },
  { id:"GEN-006", masculine:"ਬੱਚਾ", feminine:"ਬੱਚੀ", domain:"GENERAL_HUMAN", kind:"MORPHOLOGICAL_PAIR", rule:"A_TO_I", transformSafe:true, sourceStatus:"REVIEW_PENDING" },
  { id:"GEN-007", masculine:"ਬਿੱਲਾ", feminine:"ਬਿੱਲੀ", domain:"ANIMAL", kind:"MORPHOLOGICAL_PAIR", rule:"A_TO_I", transformSafe:true, sourceStatus:"REVIEW_PENDING" },
  { id:"GEN-008", masculine:"ਚੂਹਾ", feminine:"ਚੂਹੀ", domain:"ANIMAL", kind:"MORPHOLOGICAL_PAIR", rule:"A_TO_I", transformSafe:true, sourceStatus:"REVIEW_PENDING" },
  { id:"GEN-009", masculine:"ਕੁੱਕੜ", feminine:"ਕੁੱਕੜੀ", domain:"ANIMAL", kind:"MORPHOLOGICAL_PAIR", rule:"A_TO_I", transformSafe:true, sourceStatus:"REVIEW_PENDING" },
  { id:"GEN-010", masculine:"ਕਬੂਤਰ", feminine:"ਕਬੂਤਰੀ", domain:"ANIMAL", kind:"MORPHOLOGICAL_PAIR", rule:"A_TO_I", transformSafe:true, sourceStatus:"REVIEW_PENDING" },
  { id:"GEN-011", masculine:"ਮੋਰ", feminine:"ਮੋਰਨੀ", domain:"ANIMAL", kind:"MORPHOLOGICAL_PAIR", rule:"SUFFIX_NI", transformSafe:true, sourceStatus:"REVIEW_PENDING" },
  { id:"GEN-012", masculine:"ਹਿਰਨ", feminine:"ਹਿਰਨੀ", domain:"ANIMAL", kind:"MORPHOLOGICAL_PAIR", rule:"SUFFIX_NI", transformSafe:true, sourceStatus:"REVIEW_PENDING" },
  { id:"GEN-013", masculine:"ਸ਼ੇਰ", feminine:"ਸ਼ੇਰਨੀ", domain:"ANIMAL", kind:"MORPHOLOGICAL_PAIR", rule:"SUFFIX_NI", transformSafe:true, sourceStatus:"REVIEW_PENDING" },
  { id:"GEN-014", masculine:"ਨੌਕਰ", feminine:"ਨੌਕਰਾਣੀ", domain:"OCCUPATION", kind:"MORPHOLOGICAL_PAIR", rule:"SUFFIX_ANI", transformSafe:true, sourceStatus:"REVIEW_PENDING" },
  { id:"GEN-015", masculine:"ਸੇਠ", feminine:"ਸੇਠਾਣੀ", domain:"OCCUPATION", kind:"MORPHOLOGICAL_PAIR", rule:"SUFFIX_ANI", transformSafe:true, sourceStatus:"REVIEW_PENDING" },
  { id:"GEN-016", masculine:"ਨਰ", feminine:"ਨਾਰੀ", domain:"GENERAL_HUMAN", kind:"LEXICAL_COUNTERPART", rule:"LEXICAL", transformSafe:false, sourceStatus:"REVIEW_PENDING" },
  { id:"GEN-017", masculine:"ਧੋਬੀ", feminine:"ਧੋਬਣ", domain:"OCCUPATION", kind:"MORPHOLOGICAL_PAIR", rule:"I_TO_AN", transformSafe:true, sourceStatus:"REVIEW_PENDING" },
  { id:"GEN-018", masculine:"ਮਾਲੀ", feminine:"ਮਾਲਣ", domain:"OCCUPATION", kind:"MORPHOLOGICAL_PAIR", rule:"I_TO_AN", transformSafe:true, sourceStatus:"REVIEW_PENDING" },
  { id:"GEN-019", masculine:"ਤੇਲੀ", feminine:"ਤੇਲਣ", domain:"OCCUPATION", kind:"MORPHOLOGICAL_PAIR", rule:"I_TO_AN", transformSafe:true, sourceStatus:"REVIEW_PENDING" },
  { id:"GEN-020", masculine:"ਨਾਈ", feminine:"ਨਾਇਣ", domain:"OCCUPATION", kind:"MORPHOLOGICAL_PAIR", rule:"I_TO_AN", transformSafe:true, sourceStatus:"REVIEW_PENDING" },
  { id:"GEN-021", masculine:"ਭਰਾ", feminine:"ਭੈਣ", domain:"KINSHIP", kind:"LEXICAL_COUNTERPART", rule:"LEXICAL", transformSafe:false, sourceStatus:"REVIEW_PENDING" },
  { id:"GEN-022", masculine:"ਪਤੀ", feminine:"ਪਤਨੀ", domain:"KINSHIP", kind:"LEXICAL_COUNTERPART", rule:"LEXICAL", transformSafe:false, sourceStatus:"REVIEW_PENDING" },
  { id:"GEN-023", masculine:"ਪਿਤਾ", feminine:"ਮਾਤਾ", domain:"KINSHIP", kind:"LEXICAL_COUNTERPART", rule:"LEXICAL", transformSafe:false, sourceStatus:"REVIEW_PENDING" },
  { id:"GEN-024", masculine:"ਰਾਜਾ", feminine:"ਰਾਣੀ", domain:"GENERAL_HUMAN", kind:"LEXICAL_COUNTERPART", rule:"LEXICAL", transformSafe:false, sourceStatus:"REVIEW_PENDING" },
  { id:"GEN-025", masculine:"ਮੁੰਡਾ", feminine:"ਕੁੜੀ", domain:"GENERAL_HUMAN", kind:"LEXICAL_COUNTERPART", rule:"LEXICAL", transformSafe:false, sourceStatus:"REVIEW_PENDING" },
  { id:"GEN-026", masculine:"ਤਾਇਆ", feminine:"ਤਾਈ", domain:"KINSHIP", kind:"MORPHOLOGICAL_PAIR", rule:"A_TO_I", transformSafe:true, sourceStatus:"REVIEW_PENDING" },
] as const;

export const CP004_NUMBER_PAIRS: readonly CP004NumberPair[] = [
  { id:"NUM-001", singular:"ਮੁੰਡਾ", plural:"ਮੁੰਡੇ", rule:"MASC_A_TO_E", sourceStatus:"REVIEW_PENDING" },
  { id:"NUM-002", singular:"ਕਮਰਾ", plural:"ਕਮਰੇ", rule:"MASC_A_TO_E", sourceStatus:"REVIEW_PENDING" },
  { id:"NUM-003", singular:"ਘੋੜਾ", plural:"ਘੋੜੇ", rule:"MASC_A_TO_E", sourceStatus:"REVIEW_PENDING" },
  { id:"NUM-004", singular:"ਬੱਚਾ", plural:"ਬੱਚੇ", rule:"MASC_A_TO_E", sourceStatus:"REVIEW_PENDING" },
  { id:"NUM-005", singular:"ਕੁੱਤਾ", plural:"ਕੁੱਤੇ", rule:"MASC_A_TO_E", sourceStatus:"REVIEW_PENDING" },
  { id:"NUM-006", singular:"ਰਸਤਾ", plural:"ਰਸਤੇ", rule:"MASC_A_TO_E", sourceStatus:"REVIEW_PENDING" },
  { id:"NUM-007", singular:"ਬੂਟਾ", plural:"ਬੂਟੇ", rule:"MASC_A_TO_E", sourceStatus:"REVIEW_PENDING" },
  { id:"NUM-008", singular:"ਪੱਤਾ", plural:"ਪੱਤੇ", rule:"MASC_A_TO_E", sourceStatus:"REVIEW_PENDING" },
  { id:"NUM-009", singular:"ਕਿਤਾਬ", plural:"ਕਿਤਾਬਾਂ", rule:"FEM_CONSONANT_TO_AAN", sourceStatus:"REVIEW_PENDING" },
  { id:"NUM-010", singular:"ਅੱਖ", plural:"ਅੱਖਾਂ", rule:"FEM_CONSONANT_TO_AAN", sourceStatus:"REVIEW_PENDING" },
  { id:"NUM-011", singular:"ਰਾਤ", plural:"ਰਾਤਾਂ", rule:"FEM_CONSONANT_TO_AAN", sourceStatus:"REVIEW_PENDING" },
  { id:"NUM-012", singular:"ਗੱਲ", plural:"ਗੱਲਾਂ", rule:"FEM_CONSONANT_TO_AAN", sourceStatus:"REVIEW_PENDING" },
  { id:"NUM-013", singular:"ਕਲਮ", plural:"ਕਲਮਾਂ", rule:"FEM_CONSONANT_TO_AAN", sourceStatus:"REVIEW_PENDING" },
  { id:"NUM-014", singular:"ਸੜਕ", plural:"ਸੜਕਾਂ", rule:"FEM_CONSONANT_TO_AAN", sourceStatus:"REVIEW_PENDING" },
  { id:"NUM-015", singular:"ਭੈਣ", plural:"ਭੈਣਾਂ", rule:"FEM_CONSONANT_TO_AAN", sourceStatus:"REVIEW_PENDING" },
  { id:"NUM-016", singular:"ਦੁਕਾਨ", plural:"ਦੁਕਾਨਾਂ", rule:"FEM_CONSONANT_TO_AAN", sourceStatus:"REVIEW_PENDING" },
  { id:"NUM-017", singular:"ਕੁੜੀ", plural:"ਕੁੜੀਆਂ", rule:"FEM_I_TO_IAN", sourceStatus:"REVIEW_PENDING" },
  { id:"NUM-018", singular:"ਕੁਰਸੀ", plural:"ਕੁਰਸੀਆਂ", rule:"FEM_I_TO_IAN", sourceStatus:"REVIEW_PENDING" },
  { id:"NUM-019", singular:"ਕਾਪੀ", plural:"ਕਾਪੀਆਂ", rule:"FEM_I_TO_IAN", sourceStatus:"REVIEW_PENDING" },
  { id:"NUM-020", singular:"ਚਾਬੀ", plural:"ਚਾਬੀਆਂ", rule:"FEM_I_TO_IAN", sourceStatus:"REVIEW_PENDING" },
  { id:"NUM-021", singular:"ਨਦੀ", plural:"ਨਦੀਆਂ", rule:"FEM_I_TO_IAN", sourceStatus:"REVIEW_PENDING" },
  { id:"NUM-022", singular:"ਰੋਟੀ", plural:"ਰੋਟੀਆਂ", rule:"FEM_I_TO_IAN", sourceStatus:"REVIEW_PENDING" },
  { id:"NUM-023", singular:"ਗੱਡੀ", plural:"ਗੱਡੀਆਂ", rule:"FEM_I_TO_IAN", sourceStatus:"REVIEW_PENDING" },
  { id:"NUM-024", singular:"ਟੋਪੀ", plural:"ਟੋਪੀਆਂ", rule:"FEM_I_TO_IAN", sourceStatus:"REVIEW_PENDING" },
  { id:"NUM-025", singular:"ਚਿੜੀ", plural:"ਚਿੜੀਆਂ", rule:"FEM_I_TO_IAN", sourceStatus:"REVIEW_PENDING" },
  { id:"NUM-026", singular:"ਖਿੜਕੀ", plural:"ਖਿੜਕੀਆਂ", rule:"FEM_I_TO_IAN", sourceStatus:"REVIEW_PENDING" },
  { id:"NUM-027", singular:"ਮਾਂ", plural:"ਮਾਵਾਂ", rule:"IRREGULAR", sourceStatus:"REVIEW_PENDING" },
  { id:"NUM-028", singular:"ਗਾਂ", plural:"ਗਾਵਾਂ", rule:"IRREGULAR", sourceStatus:"REVIEW_PENDING" },
  { id:"NUM-029", singular:"ਥਾਂ", plural:"ਥਾਵਾਂ", rule:"IRREGULAR", sourceStatus:"REVIEW_PENDING" },
  { id:"NUM-030", singular:"ਹਵਾ", plural:"ਹਵਾਵਾਂ", rule:"VOWEL_TO_VAAN", sourceStatus:"REVIEW_PENDING" },
  { id:"NUM-031", singular:"ਦਵਾਈ", plural:"ਦਵਾਈਆਂ", rule:"FEM_I_TO_IAN", sourceStatus:"REVIEW_PENDING" },
  { id:"NUM-032", singular:"ਕਹਾਣੀ", plural:"ਕਹਾਣੀਆਂ", rule:"FEM_I_TO_IAN", sourceStatus:"REVIEW_PENDING" },
] as const;

export const CP004_AGREEMENT_CONTEXTS: readonly CP004AgreementContext[] = [
  { id:"CTX-G01", dimension:"GENDER", targetPa:"ਪੁਲਿੰਗ ਇਕਵਚਨ", correct:"ਮੁੰਡਾ ਮੈਦਾਨ ਵਿੱਚ ਖੇਡ ਰਿਹਾ ਹੈ।", incorrect:["ਮੁੰਡਾ ਮੈਦਾਨ ਵਿੱਚ ਖੇਡ ਰਹੀ ਹੈ।","ਮੁੰਡਾ ਮੈਦਾਨ ਵਿੱਚ ਖੇਡ ਰਹੇ ਹਨ।","ਮੁੰਡੇ ਮੈਦਾਨ ਵਿੱਚ ਖੇਡ ਰਿਹਾ ਹੈ।","ਮੁੰਡਾ ਮੈਦਾਨ ਵਿੱਚ ਖੇਡ ਰਹੀਆਂ ਹਨ।"], principlePa:"‘ਮੁੰਡਾ’ ਪੁਲਿੰਗ ਇਕਵਚਨ ਹੈ, ਇਸ ਲਈ ਕਿਰਿਆ ਨਾਲ ‘ਰਿਹਾ ਹੈ’ ਆਉਂਦਾ ਹੈ।", sourceStatus:"REVIEW_PENDING" },
  { id:"CTX-G02", dimension:"GENDER", targetPa:"ਇਸਤਰੀ ਲਿੰਗ ਇਕਵਚਨ", correct:"ਕੁੜੀ ਕਿਤਾਬ ਪੜ੍ਹ ਰਹੀ ਹੈ।", incorrect:["ਕੁੜੀ ਕਿਤਾਬ ਪੜ੍ਹ ਰਿਹਾ ਹੈ।","ਕੁੜੀ ਕਿਤਾਬ ਪੜ੍ਹ ਰਹੇ ਹਨ।","ਕੁੜੀਆਂ ਕਿਤਾਬ ਪੜ੍ਹ ਰਹੀ ਹੈ।","ਕੁੜੀ ਕਿਤਾਬ ਪੜ੍ਹ ਰਹੀਆਂ ਹਨ।"], principlePa:"‘ਕੁੜੀ’ ਇਸਤਰੀ ਲਿੰਗ ਇਕਵਚਨ ਹੈ, ਇਸ ਲਈ ਕਿਰਿਆ ਨਾਲ ‘ਰਹੀ ਹੈ’ ਆਉਂਦਾ ਹੈ।", sourceStatus:"REVIEW_PENDING" },
  { id:"CTX-G03", dimension:"GENDER", targetPa:"ਪੁਲਿੰਗ ਇਕਵਚਨ", correct:"ਮੇਰਾ ਭਰਾ ਘਰ ਆਇਆ ਹੈ।", incorrect:["ਮੇਰੀ ਭਰਾ ਘਰ ਆਇਆ ਹੈ।","ਮੇਰਾ ਭਰਾ ਘਰ ਆਈ ਹੈ।","ਮੇਰੇ ਭਰਾ ਘਰ ਆਈ ਹੈ।","ਮੇਰੀ ਭਰਾ ਘਰ ਆਈ ਹੈ।"], principlePa:"‘ਭਰਾ’ ਪੁਲਿੰਗ ਇਕਵਚਨ ਹੈ; ਇਸ ਲਈ ‘ਮੇਰਾ’ ਅਤੇ ‘ਆਇਆ’ ਦੋਵੇਂ ਉਸ ਨਾਲ ਮਿਲਦੇ ਹਨ।", sourceStatus:"REVIEW_PENDING" },
  { id:"CTX-G04", dimension:"GENDER", targetPa:"ਇਸਤਰੀ ਲਿੰਗ ਇਕਵਚਨ", correct:"ਮੇਰੀ ਭੈਣ ਘਰ ਆਈ ਹੈ।", incorrect:["ਮੇਰਾ ਭੈਣ ਘਰ ਆਈ ਹੈ।","ਮੇਰੀ ਭੈਣ ਘਰ ਆਇਆ ਹੈ।","ਮੇਰੇ ਭੈਣ ਘਰ ਆਏ ਹਨ।","ਮੇਰਾ ਭੈਣ ਘਰ ਆਇਆ ਹੈ।"], principlePa:"‘ਭੈਣ’ ਇਸਤਰੀ ਲਿੰਗ ਇਕਵਚਨ ਹੈ; ਇਸ ਲਈ ‘ਮੇਰੀ’ ਅਤੇ ‘ਆਈ’ ਦੋਵੇਂ ਉਸ ਨਾਲ ਮਿਲਦੇ ਹਨ।", sourceStatus:"REVIEW_PENDING" },
  { id:"CTX-G05", dimension:"GENDER", targetPa:"ਇਸਤਰੀ ਲਿੰਗ ਇਕਵਚਨ", correct:"ਘੋੜੀ ਤੇਜ਼ ਦੌੜੀ।", incorrect:["ਘੋੜੀ ਤੇਜ਼ ਦੌੜਿਆ।","ਘੋੜਾ ਤੇਜ਼ ਦੌੜੀ।","ਘੋੜੀ ਤੇਜ਼ ਦੌੜੇ।","ਘੋੜੀਆਂ ਤੇਜ਼ ਦੌੜੀ।"], principlePa:"‘ਘੋੜੀ’ ਇਸਤਰੀ ਲਿੰਗ ਇਕਵਚਨ ਹੈ, ਇਸ ਲਈ ‘ਦੌੜੀ’ ਸਹੀ ਰੂਪ ਹੈ।", sourceStatus:"REVIEW_PENDING" },
  { id:"CTX-G06", dimension:"GENDER", targetPa:"ਇਸਤਰੀ ਲਿੰਗ ਇਕਵਚਨ", correct:"ਬੱਚੀ ਹੱਸ ਰਹੀ ਹੈ।", incorrect:["ਬੱਚੀ ਹੱਸ ਰਿਹਾ ਹੈ।","ਬੱਚਾ ਹੱਸ ਰਹੀ ਹੈ।","ਬੱਚੀ ਹੱਸ ਰਹੇ ਹਨ।","ਬੱਚੀਆਂ ਹੱਸ ਰਹੀ ਹੈ।"], principlePa:"‘ਬੱਚੀ’ ਇਸਤਰੀ ਲਿੰਗ ਇਕਵਚਨ ਹੈ, ਇਸ ਲਈ ‘ਹੱਸ ਰਹੀ ਹੈ’ ਸਹੀ ਮਿਲਾਪ ਹੈ।", sourceStatus:"REVIEW_PENDING" },
  { id:"CTX-N01", dimension:"NUMBER", targetPa:"ਪੁਲਿੰਗ ਬਹੁਵਚਨ", correct:"ਮੁੰਡੇ ਮੈਦਾਨ ਵਿੱਚ ਖੇਡ ਰਹੇ ਹਨ।", incorrect:["ਮੁੰਡੇ ਮੈਦਾਨ ਵਿੱਚ ਖੇਡ ਰਿਹਾ ਹੈ।","ਮੁੰਡਾ ਮੈਦਾਨ ਵਿੱਚ ਖੇਡ ਰਹੇ ਹਨ।","ਮੁੰਡੇ ਮੈਦਾਨ ਵਿੱਚ ਖੇਡ ਰਹੀ ਹੈ।","ਮੁੰਡੇ ਮੈਦਾਨ ਵਿੱਚ ਖੇਡ ਰਿਹਾ ਹਨ।"], principlePa:"‘ਮੁੰਡੇ’ ਪੁਲਿੰਗ ਬਹੁਵਚਨ ਹੈ, ਇਸ ਲਈ ‘ਖੇਡ ਰਹੇ ਹਨ’ ਸਹੀ ਮਿਲਾਪ ਹੈ।", sourceStatus:"REVIEW_PENDING" },
  { id:"CTX-N02", dimension:"NUMBER", targetPa:"ਇਸਤਰੀ ਲਿੰਗ ਬਹੁਵਚਨ", correct:"ਕੁੜੀਆਂ ਕਿਤਾਬਾਂ ਪੜ੍ਹ ਰਹੀਆਂ ਹਨ।", incorrect:["ਕੁੜੀਆਂ ਕਿਤਾਬਾਂ ਪੜ੍ਹ ਰਹੀ ਹੈ।","ਕੁੜੀ ਕਿਤਾਬਾਂ ਪੜ੍ਹ ਰਹੀਆਂ ਹਨ।","ਕੁੜੀਆਂ ਕਿਤਾਬਾਂ ਪੜ੍ਹ ਰਹੇ ਹਨ।","ਕੁੜੀਆਂ ਕਿਤਾਬ ਪੜ੍ਹ ਰਹੀ ਹੈ।"], principlePa:"‘ਕੁੜੀਆਂ’ ਇਸਤਰੀ ਲਿੰਗ ਬਹੁਵਚਨ ਹੈ, ਇਸ ਲਈ ‘ਪੜ੍ਹ ਰਹੀਆਂ ਹਨ’ ਸਹੀ ਰੂਪ ਹੈ।", sourceStatus:"REVIEW_PENDING" },
  { id:"CTX-N03", dimension:"NUMBER", targetPa:"ਇਸਤਰੀ ਲਿੰਗ ਬਹੁਵਚਨ", correct:"ਕਿਤਾਬਾਂ ਮੇਜ਼ ਉੱਤੇ ਪਈਆਂ ਹਨ।", incorrect:["ਕਿਤਾਬਾਂ ਮੇਜ਼ ਉੱਤੇ ਪਈ ਹੈ।","ਕਿਤਾਬ ਮੇਜ਼ ਉੱਤੇ ਪਈਆਂ ਹਨ।","ਕਿਤਾਬਾਂ ਮੇਜ਼ ਉੱਤੇ ਪਿਆ ਹੈ।","ਕਿਤਾਬਾਂ ਮੇਜ਼ ਉੱਤੇ ਪਏ ਹਨ।"], principlePa:"‘ਕਿਤਾਬਾਂ’ ਇਸਤਰੀ ਲਿੰਗ ਬਹੁਵਚਨ ਹੈ, ਇਸ ਲਈ ‘ਪਈਆਂ ਹਨ’ ਸਹੀ ਰੂਪ ਹੈ।", sourceStatus:"REVIEW_PENDING" },
  { id:"CTX-N04", dimension:"NUMBER", targetPa:"ਇਸਤਰੀ ਲਿੰਗ ਬਹੁਵਚਨ", correct:"ਗੱਡੀਆਂ ਬਾਹਰ ਖੜ੍ਹੀਆਂ ਹਨ।", incorrect:["ਗੱਡੀਆਂ ਬਾਹਰ ਖੜ੍ਹੀ ਹੈ।","ਗੱਡੀ ਬਾਹਰ ਖੜ੍ਹੀਆਂ ਹਨ।","ਗੱਡੀਆਂ ਬਾਹਰ ਖੜ੍ਹੇ ਹਨ।","ਗੱਡੀਆਂ ਬਾਹਰ ਖੜ੍ਹਾ ਹੈ।"], principlePa:"‘ਗੱਡੀਆਂ’ ਇਸਤਰੀ ਲਿੰਗ ਬਹੁਵਚਨ ਹੈ, ਇਸ ਲਈ ‘ਖੜ੍ਹੀਆਂ ਹਨ’ ਸਹੀ ਮਿਲਾਪ ਹੈ।", sourceStatus:"REVIEW_PENDING" },
  { id:"CTX-N05", dimension:"NUMBER", targetPa:"ਪੁਲਿੰਗ ਬਹੁਵਚਨ", correct:"ਬੱਚੇ ਕਮਰੇ ਵਿੱਚ ਬੈਠੇ ਹਨ।", incorrect:["ਬੱਚੇ ਕਮਰੇ ਵਿੱਚ ਬੈਠਾ ਹੈ।","ਬੱਚਾ ਕਮਰੇ ਵਿੱਚ ਬੈਠੇ ਹਨ।","ਬੱਚੇ ਕਮਰੇ ਵਿੱਚ ਬੈਠੀ ਹੈ।","ਬੱਚੇ ਕਮਰੇ ਵਿੱਚ ਬੈਠਾ ਹਨ।"], principlePa:"‘ਬੱਚੇ’ ਪੁਲਿੰਗ ਬਹੁਵਚਨ ਹੈ, ਇਸ ਲਈ ‘ਬੈਠੇ ਹਨ’ ਸਹੀ ਮਿਲਾਪ ਹੈ।", sourceStatus:"REVIEW_PENDING" },
  { id:"CTX-N06", dimension:"NUMBER", targetPa:"ਇਸਤਰੀ ਲਿੰਗ ਬਹੁਵਚਨ", correct:"ਚਿੜੀਆਂ ਦਰੱਖਤ ਉੱਤੇ ਬੈਠੀਆਂ ਹਨ।", incorrect:["ਚਿੜੀਆਂ ਦਰੱਖਤ ਉੱਤੇ ਬੈਠੀ ਹੈ।","ਚਿੜੀ ਦਰੱਖਤ ਉੱਤੇ ਬੈਠੀਆਂ ਹਨ।","ਚਿੜੀਆਂ ਦਰੱਖਤ ਉੱਤੇ ਬੈਠੇ ਹਨ।","ਚਿੜੀਆਂ ਦਰੱਖਤ ਉੱਤੇ ਬੈਠਾ ਹੈ।"], principlePa:"‘ਚਿੜੀਆਂ’ ਇਸਤਰੀ ਲਿੰਗ ਬਹੁਵਚਨ ਹੈ, ਇਸ ਲਈ ‘ਬੈਠੀਆਂ ਹਨ’ ਸਹੀ ਮਿਲਾਪ ਹੈ।", sourceStatus:"REVIEW_PENDING" },
] as const;

export const CP004_TRANSFORM_SAFE_GENDER_PAIRS = CP004_GENDER_PAIRS.filter((x) => x.transformSafe);
