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

/**
 * GEO-MIN-001 source policy
 *
 * Permanent QLs may use any durable fact from the authority stack below.
 * Annual production, reserve or ranking values are never promoted to timeless
 * authority without carrying an explicit source year in the fact ID.
 */
export const GEO_MIN_001_SOURCE_CATALOG = Object.freeze({
  NCERT: "NCERT-CLASS10-CONTEMPORARY-INDIA-II-CH5-MINERALS-ENERGY-2025-26",
  MINES_ANNUAL_REPORT: "MINISTRY-OF-MINES-ANNUAL-REPORT-2025-26",
  IBM_IMYB_2024: "IBM-INDIAN-MINERALS-YEARBOOK-2024",
  IBM_NMI_2025: "IBM-NATIONAL-MINERAL-INVENTORY-AT-A-GLANCE-2025",
  IBM_IMIG: "IBM-INDIAN-MINERAL-INDUSTRY-AT-A-GLANCE",
  IBM_STATISTICAL_PROFILES: "IBM-STATISTICAL-PROFILES-OF-MINERALS",
  IBM_IRON_ORE: "IBM-MINERAL-REVIEW-IRON-ORE",
  IBM_MANGANESE: "IBM-MINERAL-REVIEW-MANGANESE-ORE",
  IBM_CHROMITE: "IBM-MINERAL-REVIEW-CHROMITE",
  IBM_BAUXITE: "IBM-MINERAL-REVIEW-BAUXITE",
  IBM_COPPER: "IBM-MINERAL-REVIEW-COPPER",
  IBM_LEAD_ZINC: "IBM-MINERAL-REVIEW-LEAD-ZINC",
  IBM_MICA: "IBM-MINERAL-REVIEW-MICA",
  IBM_LIMESTONE: "IBM-MINERAL-REVIEW-LIMESTONE-CALCAREOUS-MATERIALS",
  IBM_GYPSUM: "IBM-MINERAL-REVIEW-GYPSUM",
  IBM_DOLOMITE: "IBM-MINERAL-REVIEW-DOLOMITE",
  IBM_GRAPHITE: "IBM-MINERAL-REVIEW-GRAPHITE",
  IBM_MAGNESITE: "IBM-MINERAL-REVIEW-MAGNESITE",
  IBM_PHOSPHATE: "IBM-MINERAL-REVIEW-APATITE-ROCK-PHOSPHATE",
  IBM_SALT: "IBM-MINERAL-REVIEW-SALT",
  IBM_RARE_EARTHS: "IBM-MINERAL-REVIEW-RARE-EARTHS",
  GSI: "GEOLOGICAL-SURVEY-OF-INDIA-MINERAL-GEOLOGY",
  STATE_DMG: "OFFICIAL-STATE-DIRECTORATES-GEOLOGY-MINING",
  SALT_COMMISSIONER: "SALT-COMMISSIONER-INDIA-SALT-INDUSTRY",
} as const);

export const GEO_MIN_001_FOUNDATION_SOURCE_IDS = Object.freeze([
  GEO_MIN_001_SOURCE_CATALOG.NCERT,
  GEO_MIN_001_SOURCE_CATALOG.MINES_ANNUAL_REPORT,
  GEO_MIN_001_SOURCE_CATALOG.IBM_IMYB_2024,
  GEO_MIN_001_SOURCE_CATALOG.IBM_NMI_2025,
  GEO_MIN_001_SOURCE_CATALOG.GSI,
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
