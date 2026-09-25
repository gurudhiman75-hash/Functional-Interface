export type GeoVeg001Difficulty = "Easy" | "Medium" | "Hard";

export type GeoVeg001Question = Readonly<{
  questionId: string;
  qlId: string;
  qlName: string;
  difficulty: GeoVeg001Difficulty;
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

export const GEO_VEG_001_SOURCE_IDS = Object.freeze([
  "NCERT-CONTEMPORARY-INDIA-I-NATURAL-VEGETATION-WILDLIFE",
  "NCERT-INDIA-PHYSICAL-ENVIRONMENT-NATURAL-VEGETATION",
] as const);

export function placeGeoVegOptions(
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
