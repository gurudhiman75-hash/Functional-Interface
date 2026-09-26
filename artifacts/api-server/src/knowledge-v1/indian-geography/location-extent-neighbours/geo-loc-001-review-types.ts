export type GeoLoc001Difficulty = "Easy" | "Medium" | "Hard";

export type GeoLoc001Question = Readonly<{
  questionId: string;
  qlId: string;
  qlName: string;
  difficulty: GeoLoc001Difficulty;
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

export const GEO_LOC_001_SOURCE_IDS = Object.freeze([
  "NCERT-CONTEMPORARY-INDIA-I-CH01-INDIA-SIZE-LOCATION-2025-26",
  "NIOS-GEOGRAPHY-316-LESSON16-INDIA-PHYSICAL-FEATURES",
] as const);

export function placeGeoLocOptions(
  answer: string,
  distractors: readonly string[],
  correctIndex: number,
): readonly string[] {
  if (distractors.length !== 3) throw new Error("Exactly three distractors are required");
  if (correctIndex < 0 || correctIndex > 3) throw new Error("correctIndex must be 0..3");
  const options = [...distractors];
  options.splice(correctIndex, 0, answer);
  if (new Set(options).size !== 4) throw new Error("Options must be distinct");
  return Object.freeze(options);
}
