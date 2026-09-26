export type GeoAgr001Difficulty = "Easy" | "Medium" | "Hard";

export type GeoAgr001Question = Readonly<{
  questionId: string;
  qlId: string;
  qlName: string;
  difficulty: GeoAgr001Difficulty;
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

export const GEO_AGR_001_SOURCE_IDS = Object.freeze([
  "NCERT-CLASS10-CONTEMPORARY-INDIA-II-CH4-AGRICULTURE-2026-27",
  "NCERT-SOCIAL-SCIENCE-TEACHER-MATERIAL-INDIAN-AGRICULTURE",
] as const);

export function placeGeoAgrOptions(
  answer: string,
  distractors: readonly string[],
  correctIndex: number,
): readonly string[] {
  const options = [...distractors];
  options.splice(correctIndex, 0, answer);
  return Object.freeze(options);
}
