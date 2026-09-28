export type GeoInd001Difficulty = "Easy" | "Medium" | "Hard";

export type GeoInd001Question = Readonly<{
  questionId: string;
  qlId: string;
  qlName: string;
  difficulty: GeoInd001Difficulty;
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

export const GEO_IND_001_SOURCE_CATALOG = Object.freeze({
  NCERT_CLASS10_MANUFACTURING: "NCERT-CLASS10-CONTEMPORARY-INDIA-II-MANUFACTURING-INDUSTRIES",
  NCERT_CLASS12_INDUSTRIES: "NCERT-CLASS12-INDIA-PEOPLE-ECONOMY-MANUFACTURING-INDUSTRIES",
  DPIIT: "DPIIT-INDUSTRIAL-GEOGRAPHY-AND-POLICY",
  STEEL: "MINISTRY-OF-STEEL-INDIA",
  TEXTILES: "MINISTRY-OF-TEXTILES-INDIA",
  FERTILIZERS: "DEPARTMENT-OF-FERTILIZERS-INDIA",
  CHEMICALS: "DEPARTMENT-OF-CHEMICALS-PETROCHEMICALS-INDIA",
  HEAVY_INDUSTRIES: "MINISTRY-OF-HEAVY-INDUSTRIES-INDIA",
} as const);

export const GEO_IND_001_FOUNDATION_SOURCE_IDS = Object.freeze([
  GEO_IND_001_SOURCE_CATALOG.NCERT_CLASS10_MANUFACTURING,
  GEO_IND_001_SOURCE_CATALOG.NCERT_CLASS12_INDUSTRIES,
] as const);

export function placeGeoIndOptions(answer: string, distractors: readonly string[], correctIndex: number) {
  const options = [...distractors];
  options.splice(correctIndex, 0, answer);
  return Object.freeze(options);
}
