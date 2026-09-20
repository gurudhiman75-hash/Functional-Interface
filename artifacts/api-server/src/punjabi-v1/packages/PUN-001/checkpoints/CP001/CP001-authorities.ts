export type CP001LetterClass = "VOWEL_CARRIER" | "BASIC_CONSONANT" | "SUPPLEMENTARY_CONSONANT";

export interface LetterAuthority {
  id: string;
  letter: string;
  order: number;
  groupPa: string;
  class: CP001LetterClass;
  namePa: string;
  sourceStatus: "REVIEW_PENDING";
}

const basicRows = [
  ["ੳ", "ਊੜਾ"], ["ਅ", "ਐੜਾ"], ["ੲ", "ਈੜੀ"], ["ਸ", "ਸੱਸਾ"], ["ਹ", "ਹਾਹਾ"],
  ["ਕ", "ਕੱਕਾ"], ["ਖ", "ਖੱਖਾ"], ["ਗ", "ਗੱਗਾ"], ["ਘ", "ਘੱਗਾ"], ["ਙ", "ਙੰਙਾ"],
  ["ਚ", "ਚੱਚਾ"], ["ਛ", "ਛੱਛਾ"], ["ਜ", "ਜੱਜਾ"], ["ਝ", "ਝੱਜਾ"], ["ਞ", "ਞੰਞਾ"],
  ["ਟ", "ਟੈਂਕਾ"], ["ਠ", "ਠੱਠਾ"], ["ਡ", "ਡੱਡਾ"], ["ਢ", "ਢੱਡਾ"], ["ਣ", "ਣਾਣਾ"],
  ["ਤ", "ਤੱਤਾ"], ["ਥ", "ਥੱਥਾ"], ["ਦ", "ਦੱਦਾ"], ["ਧ", "ਧੱਦਾ"], ["ਨ", "ਨੰਨਾ"],
  ["ਪ", "ਪੱਪਾ"], ["ਫ", "ਫੱਫਾ"], ["ਬ", "ਬੱਬਾ"], ["ਭ", "ਭੱਬਾ"], ["ਮ", "ਮੰਮਾ"],
  ["ਯ", "ਯੱਯਾ"], ["ਰ", "ਰਾਰਾ"], ["ਲ", "ਲੱਲਾ"], ["ਵ", "ਵਾਵਾ"], ["ੜ", "ੜਾੜਾ"],
] as const;

function groupForOrder(order: number): string {
  if (order <= 5) return "ਮੁੱਖ ਟੋਲੀ";
  if (order <= 10) return "ਕ-ਵਰਗ";
  if (order <= 15) return "ਚ-ਵਰਗ";
  if (order <= 20) return "ਟ-ਵਰਗ";
  if (order <= 25) return "ਤ-ਵਰਗ";
  if (order <= 30) return "ਪ-ਵਰਗ";
  return "ਅੰਤਿਮ ਟੋਲੀ";
}

const supplementaryRows = [
  ["ਸ਼", "ਸ਼ਸ਼ਾ ਪੈਰ ਬਿੰਦੀ"], ["ਖ਼", "ਖੱਖਾ ਪੈਰ ਬਿੰਦੀ"], ["ਗ਼", "ਗੱਗਾ ਪੈਰ ਬਿੰਦੀ"],
  ["ਜ਼", "ਜੱਜਾ ਪੈਰ ਬਿੰਦੀ"], ["ਫ਼", "ਫੱਫਾ ਪੈਰ ਬਿੰਦੀ"], ["ਲ਼", "ਲੱਲਾ ਪੈਰ ਬਿੰਦੀ"],
] as const;

export const CP001_LETTERS: readonly LetterAuthority[] = [
  ...basicRows.map(([letter, namePa], index) => ({
    id: `LTR-${String(index + 1).padStart(2, "0")}`,
    letter,
    order: index + 1,
    groupPa: groupForOrder(index + 1),
    class: (index < 3 ? "VOWEL_CARRIER" : "BASIC_CONSONANT") as CP001LetterClass,
    namePa,
    sourceStatus: "REVIEW_PENDING" as const,
  })),
  ...supplementaryRows.map(([letter, namePa], index) => ({
    id: `LTR-${String(index + 36).padStart(2, "0")}`,
    letter,
    order: index + 36,
    groupPa: "ਨਵੀਨ ਟੋਲੀ",
    class: "SUPPLEMENTARY_CONSONANT" as const,
    namePa,
    sourceStatus: "REVIEW_PENDING" as const,
  })),
] as const;

export interface GroupAuthority {
  id: string;
  namePa: string;
  letters: readonly string[];
  sourceStatus: "REVIEW_PENDING";
}

export const CP001_GROUPS: readonly GroupAuthority[] = [
  { id: "GRP-01", namePa: "ਮੁੱਖ ਟੋਲੀ", letters: ["ੳ", "ਅ", "ੲ", "ਸ", "ਹ"], sourceStatus: "REVIEW_PENDING" },
  { id: "GRP-02", namePa: "ਕ-ਵਰਗ", letters: ["ਕ", "ਖ", "ਗ", "ਘ", "ਙ"], sourceStatus: "REVIEW_PENDING" },
  { id: "GRP-03", namePa: "ਚ-ਵਰਗ", letters: ["ਚ", "ਛ", "ਜ", "ਝ", "ਞ"], sourceStatus: "REVIEW_PENDING" },
  { id: "GRP-04", namePa: "ਟ-ਵਰਗ", letters: ["ਟ", "ਠ", "ਡ", "ਢ", "ਣ"], sourceStatus: "REVIEW_PENDING" },
  { id: "GRP-05", namePa: "ਤ-ਵਰਗ", letters: ["ਤ", "ਥ", "ਦ", "ਧ", "ਨ"], sourceStatus: "REVIEW_PENDING" },
  { id: "GRP-06", namePa: "ਪ-ਵਰਗ", letters: ["ਪ", "ਫ", "ਬ", "ਭ", "ਮ"], sourceStatus: "REVIEW_PENDING" },
  { id: "GRP-07", namePa: "ਅੰਤਿਮ ਟੋਲੀ", letters: ["ਯ", "ਰ", "ਲ", "ਵ", "ੜ"], sourceStatus: "REVIEW_PENDING" },
  { id: "GRP-08", namePa: "ਨਵੀਨ ਟੋਲੀ", letters: ["ਸ਼", "ਖ਼", "ਗ਼", "ਜ਼", "ਫ਼", "ਲ਼"], sourceStatus: "REVIEW_PENDING" },
] as const;

export interface ArticulationAuthority {
  id: string;
  letter: string;
  vargPa: string;
  placePa: string;
  positionInVarg: number;
  isNasal: boolean;
  sourceStatus: "REVIEW_PENDING";
}

const articulationRows = [
  ["ਕ-ਵਰਗ", "ਕੰਠੀ", ["ਕ", "ਖ", "ਗ", "ਘ", "ਙ"]],
  ["ਚ-ਵਰਗ", "ਤਾਲਵੀ", ["ਚ", "ਛ", "ਜ", "ਝ", "ਞ"]],
  ["ਟ-ਵਰਗ", "ਮੂਰਧਨੀ / ਉਲਟ-ਜੀਭੀ", ["ਟ", "ਠ", "ਡ", "ਢ", "ਣ"]],
  ["ਤ-ਵਰਗ", "ਦੰਤੀ", ["ਤ", "ਥ", "ਦ", "ਧ", "ਨ"]],
  ["ਪ-ਵਰਗ", "ਹੋਠੀ", ["ਪ", "ਫ", "ਬ", "ਭ", "ਮ"]],
] as const;

export const CP001_ARTICULATION: readonly ArticulationAuthority[] = articulationRows.flatMap(
  ([vargPa, placePa, letters], vargIndex) => letters.map((letter, index) => ({
    id: `ART-${vargIndex + 1}-${index + 1}`,
    letter,
    vargPa,
    placePa,
    positionInVarg: index + 1,
    isNasal: index === 4,
    sourceStatus: "REVIEW_PENDING" as const,
  })),
);

export interface LagaAuthority {
  id: string;
  order: number;
  namePa: string;
  symbol: string;
  independentVowel: string;
  carrier: "ੳ" | "ਅ" | "ੲ";
  positionPa: string;
  lengthPa: "ਲਘੂ" | "ਦੀਰਘ";
  sourceStatus: "REVIEW_PENDING";
}

export const CP001_LAGAAN: readonly LagaAuthority[] = [
  { id: "LAG-01", order: 1, namePa: "ਮੁਕਤਾ", symbol: "∅", independentVowel: "ਅ", carrier: "ਅ", positionPa: "ਕੋਈ ਵੱਖਰਾ ਚਿੰਨ੍ਹ ਨਹੀਂ", lengthPa: "ਲਘੂ", sourceStatus: "REVIEW_PENDING" },
  { id: "LAG-02", order: 2, namePa: "ਕੰਨਾ", symbol: "ਾ", independentVowel: "ਆ", carrier: "ਅ", positionPa: "ਸੱਜੇ", lengthPa: "ਦੀਰਘ", sourceStatus: "REVIEW_PENDING" },
  { id: "LAG-03", order: 3, namePa: "ਸਿਹਾਰੀ", symbol: "ਿ", independentVowel: "ਇ", carrier: "ੲ", positionPa: "ਖੱਬੇ", lengthPa: "ਲਘੂ", sourceStatus: "REVIEW_PENDING" },
  { id: "LAG-04", order: 4, namePa: "ਬਿਹਾਰੀ", symbol: "ੀ", independentVowel: "ਈ", carrier: "ੲ", positionPa: "ਸੱਜੇ", lengthPa: "ਦੀਰਘ", sourceStatus: "REVIEW_PENDING" },
  { id: "LAG-05", order: 5, namePa: "ਔਂਕੜ", symbol: "ੁ", independentVowel: "ਉ", carrier: "ੳ", positionPa: "ਹੇਠਾਂ", lengthPa: "ਲਘੂ", sourceStatus: "REVIEW_PENDING" },
  { id: "LAG-06", order: 6, namePa: "ਦੁਲੈਂਕੜ", symbol: "ੂ", independentVowel: "ਊ", carrier: "ੳ", positionPa: "ਹੇਠਾਂ", lengthPa: "ਦੀਰਘ", sourceStatus: "REVIEW_PENDING" },
  { id: "LAG-07", order: 7, namePa: "ਲਾਂ", symbol: "ੇ", independentVowel: "ਏ", carrier: "ੲ", positionPa: "ਉੱਪਰ", lengthPa: "ਦੀਰਘ", sourceStatus: "REVIEW_PENDING" },
  { id: "LAG-08", order: 8, namePa: "ਦੁਲਾਵਾਂ", symbol: "ੈ", independentVowel: "ਐ", carrier: "ਅ", positionPa: "ਉੱਪਰ", lengthPa: "ਦੀਰਘ", sourceStatus: "REVIEW_PENDING" },
  { id: "LAG-09", order: 9, namePa: "ਹੋੜਾ", symbol: "ੋ", independentVowel: "ਓ", carrier: "ੳ", positionPa: "ਉੱਪਰ", lengthPa: "ਦੀਰਘ", sourceStatus: "REVIEW_PENDING" },
  { id: "LAG-10", order: 10, namePa: "ਕਨੌੜਾ", symbol: "ੌ", independentVowel: "ਔ", carrier: "ਅ", positionPa: "ਉੱਪਰ", lengthPa: "ਦੀਰਘ", sourceStatus: "REVIEW_PENDING" },
] as const;

export interface LagakharAuthority {
  id: string;
  namePa: string;
  symbol: string;
  allowedLagaPa: readonly string[];
  rolePa: string;
  sourceStatus: "REVIEW_PENDING";
}

export const CP001_LAGAKHARS: readonly LagakharAuthority[] = [
  { id: "MRK-01", namePa: "ਬਿੰਦੀ", symbol: "ਂ", allowedLagaPa: ["ਕੰਨਾ", "ਬਿਹਾਰੀ", "ਲਾਂ", "ਦੁਲਾਵਾਂ", "ਹੋੜਾ", "ਕਨੌੜਾ"], rolePa: "ਨਾਸਕੀ ਧੁਨੀ", sourceStatus: "REVIEW_PENDING" },
  { id: "MRK-02", namePa: "ਟਿੱਪੀ", symbol: "ੰ", allowedLagaPa: ["ਮੁਕਤਾ", "ਸਿਹਾਰੀ", "ਔਂਕੜ", "ਦੁਲੈਂਕੜ"], rolePa: "ਨਾਸਕੀ ਧੁਨੀ", sourceStatus: "REVIEW_PENDING" },
  { id: "MRK-03", namePa: "ਅੱਧਕ", symbol: "ੱ", allowedLagaPa: ["ਮੁਕਤਾ", "ਸਿਹਾਰੀ", "ਔਂਕੜ"], rolePa: "ਅਗਲੇ ਵਿਅੰਜਨ ਦੀ ਦੁੱਗਣੀ ਧੁਨੀ", sourceStatus: "REVIEW_PENDING" },
] as const;

export interface DuttAuthority {
  id: string;
  baseLetter: string;
  namePa: string;
  symbol: string;
  sourceStatus: "REVIEW_PENDING";
}

export const CP001_DUTT: readonly DuttAuthority[] = [
  { id: "DUT-01", baseLetter: "ਹ", namePa: "ਪੈਰੀਂ ਹਾਹਾ", symbol: "੍ਹ", sourceStatus: "REVIEW_PENDING" },
  { id: "DUT-02", baseLetter: "ਰ", namePa: "ਪੈਰੀਂ ਰਾਰਾ", symbol: "੍ਰ", sourceStatus: "REVIEW_PENDING" },
  { id: "DUT-03", baseLetter: "ਵ", namePa: "ਪੈਰੀਂ ਵਾਵਾ", symbol: "੍ਵ", sourceStatus: "REVIEW_PENDING" },
] as const;

// 90 explicit rows + 10 carrier-to-independent-vowel relations represented by CP001_LAGAAN.
export const CP001_SYSTEM_AUTHORITY_COUNT =
  CP001_LETTERS.length + CP001_GROUPS.length + CP001_ARTICULATION.length + CP001_LAGAAN.length + CP001_LAGAAN.length + CP001_LAGAKHARS.length + CP001_DUTT.length;
