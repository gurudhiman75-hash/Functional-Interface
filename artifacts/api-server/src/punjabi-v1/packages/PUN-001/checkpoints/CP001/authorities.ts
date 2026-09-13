export const CP001_LIFECYCLE = "REVIEW_ONLY" as const;
export const CP001_AUTHORITY_REVISION = "forward-port-1" as const;

export const TRADITIONAL_GURMUKHI_ORDER = [
  "ੳ", "ਅ", "ੲ", "ਸ", "ਹ",
  "ਕ", "ਖ", "ਗ", "ਘ", "ਙ",
  "ਚ", "ਛ", "ਜ", "ਝ", "ਞ",
  "ਟ", "ਠ", "ਡ", "ਢ", "ਣ",
  "ਤ", "ਥ", "ਦ", "ਧ", "ਨ",
  "ਪ", "ਫ", "ਬ", "ਭ", "ਮ",
  "ਯ", "ਰ", "ਲ", "ਵ", "ੜ",
] as const;

export interface VargAuthority {
  id: string;
  name: string;
  letters: readonly [string, string, string, string, string];
  nasal: string;
}

export const VARG_AUTHORITIES: readonly VargAuthority[] = [
  { id: "CP001-VARG-K", name: "ਕ-ਵਰਗ", letters: ["ਕ", "ਖ", "ਗ", "ਘ", "ਙ"], nasal: "ਙ" },
  { id: "CP001-VARG-CH", name: "ਚ-ਵਰਗ", letters: ["ਚ", "ਛ", "ਜ", "ਝ", "ਞ"], nasal: "ਞ" },
  { id: "CP001-VARG-TT", name: "ਟ-ਵਰਗ", letters: ["ਟ", "ਠ", "ਡ", "ਢ", "ਣ"], nasal: "ਣ" },
  { id: "CP001-VARG-T", name: "ਤ-ਵਰਗ", letters: ["ਤ", "ਥ", "ਦ", "ਧ", "ਨ"], nasal: "ਨ" },
  { id: "CP001-VARG-P", name: "ਪ-ਵਰਗ", letters: ["ਪ", "ਫ", "ਬ", "ਭ", "ਮ"], nasal: "ਮ" },
] as const;

export const NAVEEN_LETTERS = ["ਸ਼", "ਖ਼", "ਗ਼", "ਜ਼", "ਫ਼", "ਲ਼"] as const;

export interface LagaAuthority {
  id: string;
  name: string;
  symbol: string;
}

export const LAGA_AUTHORITIES: readonly LagaAuthority[] = [
  { id: "CP001-LAGA-KANNA", name: "ਕੰਨਾ", symbol: "ਾ" },
  { id: "CP001-LAGA-SIHARI", name: "ਸਿਹਾਰੀ", symbol: "ਿ" },
  { id: "CP001-LAGA-BIHARI", name: "ਬਿਹਾਰੀ", symbol: "ੀ" },
  { id: "CP001-LAGA-AUNKAR", name: "ਔਂਕੜ", symbol: "ੁ" },
  { id: "CP001-LAGA-DULANKAR", name: "ਦੁਲੈਂਕੜ", symbol: "ੂ" },
  { id: "CP001-LAGA-LAAN", name: "ਲਾਂ", symbol: "ੇ" },
  { id: "CP001-LAGA-DULAVAN", name: "ਦੁਲਾਵਾਂ", symbol: "ੈ" },
  { id: "CP001-LAGA-HORA", name: "ਹੋੜਾ", symbol: "ੋ" },
  { id: "CP001-LAGA-KANAURA", name: "ਕਨੌੜਾ", symbol: "ੌ" },
] as const;

export interface CarrierAuthority {
  id: string;
  carrier: "ੳ" | "ਅ" | "ੲ";
  lagaName: string;
  lagaSymbol: string;
  independentVowel: string;
}

export const CARRIER_AUTHORITIES: readonly CarrierAuthority[] = [
  { id: "CP001-CARRIER-U", carrier: "ੳ", lagaName: "ਔਂਕੜ", lagaSymbol: "ੁ", independentVowel: "ਉ" },
  { id: "CP001-CARRIER-UU", carrier: "ੳ", lagaName: "ਦੁਲੈਂਕੜ", lagaSymbol: "ੂ", independentVowel: "ਊ" },
  { id: "CP001-CARRIER-O", carrier: "ੳ", lagaName: "ਹੋੜਾ", lagaSymbol: "ੋ", independentVowel: "ਓ" },
  { id: "CP001-CARRIER-AA", carrier: "ਅ", lagaName: "ਕੰਨਾ", lagaSymbol: "ਾ", independentVowel: "ਆ" },
  { id: "CP001-CARRIER-AI", carrier: "ਅ", lagaName: "ਦੁਲਾਵਾਂ", lagaSymbol: "ੈ", independentVowel: "ਐ" },
  { id: "CP001-CARRIER-AU", carrier: "ਅ", lagaName: "ਕਨੌੜਾ", lagaSymbol: "ੌ", independentVowel: "ਔ" },
  { id: "CP001-CARRIER-I", carrier: "ੲ", lagaName: "ਸਿਹਾਰੀ", lagaSymbol: "ਿ", independentVowel: "ਇ" },
  { id: "CP001-CARRIER-II", carrier: "ੲ", lagaName: "ਬਿਹਾਰੀ", lagaSymbol: "ੀ", independentVowel: "ਈ" },
  { id: "CP001-CARRIER-E", carrier: "ੲ", lagaName: "ਲਾਂ", lagaSymbol: "ੇ", independentVowel: "ਏ" },
] as const;

export interface LagakharAuthority {
  id: string;
  name: string;
  symbol: string;
  functionPa: string;
  example: string;
}

export const LAGAKHAR_AUTHORITIES: readonly LagakharAuthority[] = [
  {
    id: "CP001-LAGAKHAR-BINDI",
    name: "ਬਿੰਦੀ",
    symbol: "ਂ",
    functionPa: "ਨਾਸਕੀ ਧੁਨੀ ਦਰਸਾਉਣ ਲਈ ਵਰਤੀ ਜਾਂਦੀ ਹੈ।",
    example: "ਮਾਂ",
  },
  {
    id: "CP001-LAGAKHAR-TIPPI",
    name: "ਟਿੱਪੀ",
    symbol: "ੰ",
    functionPa: "ਨਾਸਕੀ ਧੁਨੀ ਦਰਸਾਉਣ ਲਈ ਵਰਤੀ ਜਾਂਦੀ ਹੈ।",
    example: "ਪਿੰਡ",
  },
  {
    id: "CP001-LAGAKHAR-ADDAK",
    name: "ਅੱਧਕ",
    symbol: "ੱ",
    functionPa: "ਅਗਲੇ ਵਿਅੰਜਨ ਦੀ ਧੁਨੀ ਨੂੰ ਦੋਹਰਾ ਜਾਂ ਬਲਵਾਨ ਕਰਦੀ ਹੈ।",
    example: "ਪੱਕਾ",
  },
] as const;

export interface SubjoinedAuthority {
  id: string;
  word: string;
  visibleSegment: string;
  subjoinedLetter: "ਹ" | "ਰ" | "ਵ";
  explanationPa: string;
}

export const SUBJOINED_AUTHORITIES: readonly SubjoinedAuthority[] = [
  {
    id: "CP001-SUBJOINED-H",
    word: "ਪੜ੍ਹਨਾ",
    visibleSegment: "ੜ੍ਹ",
    subjoinedLetter: "ਹ",
    explanationPa: "‘ਪੜ੍ਹਨਾ’ ਵਿੱਚ ‘ੜ੍ਹ’ ਦੇ ਅੰਦਰ ਹ ਪੈਰੀਂ ਰੂਪ ਵਿੱਚ ਵਰਤਿਆ ਗਿਆ ਹੈ।",
  },
  {
    id: "CP001-SUBJOINED-R",
    word: "ਪ੍ਰਸ਼ਨ",
    visibleSegment: "ਪ੍ਰ",
    subjoinedLetter: "ਰ",
    explanationPa: "‘ਪ੍ਰਸ਼ਨ’ ਵਿੱਚ ‘ਪ੍ਰ’ ਦੇ ਅੰਦਰ ਰ ਪੈਰੀਂ ਰੂਪ ਵਿੱਚ ਵਰਤਿਆ ਗਿਆ ਹੈ।",
  },
  {
    id: "CP001-SUBJOINED-V",
    word: "ਸ੍ਵਰ",
    visibleSegment: "ਸ੍ਵ",
    subjoinedLetter: "ਵ",
    explanationPa: "‘ਸ੍ਵਰ’ ਵਿੱਚ ‘ਸ੍ਵ’ ਦੇ ਅੰਦਰ ਵ ਪੈਰੀਂ ਰੂਪ ਵਿੱਚ ਵਰਤਿਆ ਗਿਆ ਹੈ।",
  },
] as const;

export interface WordOrthographyAuthority {
  id: string;
  word: string;
  testedFeature: "ਲਗ" | "ਲਗਾਖਰ";
  correctName: string;
  explanationPa: string;
}

export const WORD_ORTHOGRAPHY_AUTHORITIES: readonly WordOrthographyAuthority[] = [
  { id: "CP001-WORD-KITAAB-SIHARI", word: "ਕਿਤਾਬ", testedFeature: "ਲਗ", correctName: "ਸਿਹਾਰੀ", explanationPa: "‘ਕਿਤਾਬ’ ਵਿੱਚ ਕ ਨਾਲ ਸਿਹਾਰੀ ਲੱਗੀ ਹੈ।" },
  { id: "CP001-WORD-KITAAB-KANNA", word: "ਕਿਤਾਬ", testedFeature: "ਲਗ", correctName: "ਕੰਨਾ", explanationPa: "‘ਕਿਤਾਬ’ ਵਿੱਚ ਤ ਨਾਲ ਕੰਨਾ ਲੱਗਾ ਹੈ।" },
  { id: "CP001-WORD-SCHOOL-DULANKAR", word: "ਸਕੂਲ", testedFeature: "ਲਗ", correctName: "ਦੁਲੈਂਕੜ", explanationPa: "‘ਸਕੂਲ’ ਵਿੱਚ ਕ ਨਾਲ ਦੁਲੈਂਕੜ ਲੱਗਾ ਹੈ।" },
  { id: "CP001-WORD-MELA-LAAN", word: "ਮੇਲਾ", testedFeature: "ਲਗ", correctName: "ਲਾਂ", explanationPa: "‘ਮੇਲਾ’ ਵਿੱਚ ਮ ਨਾਲ ਲਾਂ ਲੱਗੀ ਹੈ।" },
  { id: "CP001-WORD-GHORA-HORA", word: "ਘੋੜਾ", testedFeature: "ਲਗ", correctName: "ਹੋੜਾ", explanationPa: "‘ਘੋੜਾ’ ਵਿੱਚ ਘ ਨਾਲ ਹੋੜਾ ਲੱਗਾ ਹੈ।" },
  { id: "CP001-WORD-KAUR-KANAURA", word: "ਕੌਰ", testedFeature: "ਲਗ", correctName: "ਕਨੌੜਾ", explanationPa: "‘ਕੌਰ’ ਵਿੱਚ ਕ ਨਾਲ ਕਨੌੜਾ ਲੱਗਾ ਹੈ।" },
  { id: "CP001-WORD-MAA-BINDI", word: "ਮਾਂ", testedFeature: "ਲਗਾਖਰ", correctName: "ਬਿੰਦੀ", explanationPa: "‘ਮਾਂ’ ਵਿੱਚ ਨਾਸਕੀ ਧੁਨੀ ਲਈ ਬਿੰਦੀ ਵਰਤੀ ਗਈ ਹੈ।" },
  { id: "CP001-WORD-PIND-TIPPI", word: "ਪਿੰਡ", testedFeature: "ਲਗਾਖਰ", correctName: "ਟਿੱਪੀ", explanationPa: "‘ਪਿੰਡ’ ਵਿੱਚ ਨਾਸਕੀ ਧੁਨੀ ਲਈ ਟਿੱਪੀ ਵਰਤੀ ਗਈ ਹੈ।" },
  { id: "CP001-WORD-PAKKA-ADDAK", word: "ਪੱਕਾ", testedFeature: "ਲਗਾਖਰ", correctName: "ਅੱਧਕ", explanationPa: "‘ਪੱਕਾ’ ਵਿੱਚ ਅੱਧਕ ਅਗਲੇ ਕ ਦੀ ਧੁਨੀ ਨੂੰ ਦੋਹਰਾ ਕਰਦਾ ਹੈ।" },
] as const;
