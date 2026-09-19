export type GeoSoi001Difficulty = "Easy" | "Medium" | "Hard";

export interface GeoSoi001Question {
  questionId: string;
  qlId: string;
  qlName: string;
  difficulty: GeoSoi001Difficulty;
  stem: string;
  options: readonly string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
  reviewOnly: true;
  runtimeRegistered: false;
}

export function placeGeoSoiOptions(
  canonicalAnswer: string,
  distractors: readonly string[],
  correctIndex: number,
): readonly string[] {
  if (distractors.length !== 3) throw new Error("Exactly three distractors are required.");
  const options = [...distractors];
  options.splice(correctIndex, 0, canonicalAnswer);
  return Object.freeze(options);
}

export const GEO_SOI_001_SOURCE_IDS = Object.freeze([
  "NCERT-CONTEMPORARY-INDIA-II-CH01",
] as const);
