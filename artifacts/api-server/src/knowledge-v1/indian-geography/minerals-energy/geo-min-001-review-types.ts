export type GeoMin001Difficulty = "Easy" | "Medium" | "Hard";

export type GeoMin001Question = Readonly<{
  questionId: string;
  qlId: string;
  qlName: string;
  difficulty: GeoMin001Difficulty;
  stem: string;
  options: readonly string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
  reviewOnly: true;
  runtimeRegistered: false;
}>;

export const GEO_MIN_001_SOURCE_IDS = Object.freeze([
  "NCERT-CLASS10-CONTEMPORARY-INDIA-II-CH5-MINERALS-ENERGY-2025-26",
  "MINISTRY-OF-MINES-INDIA-STABLE-MINERAL-GEOGRAPHY",
  "INDIAN-BUREAU-OF-MINES-STABLE-MINERAL-REFERENCE",
] as const);

export function placeGeoMinOptions(
  answer: string,
  distractors: readonly string[],
  correctIndex: number,
): readonly string[] {
  const options = [...distractors];
  options.splice(correctIndex, 0, answer);
  return Object.freeze(options);
}
