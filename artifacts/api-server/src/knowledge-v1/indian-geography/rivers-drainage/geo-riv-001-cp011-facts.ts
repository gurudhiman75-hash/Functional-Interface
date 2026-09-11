import type { KnowledgeFact, KnowledgeFactSource } from "../../types";

const SUBJECT = "Static GK — Indian Geography";
const CHAPTER_ID = "GEO-RIV-001";
const CP_ID = "GEO-RIV-001-CP011";
const EXAM_TAGS = ["SSC", "RAILWAY", "BANKING", "STATE_EXAMS", "UPSC_PCS"];
const VERIFIED_AT = "2026-09-11";

function slug(value: string) {
  return value.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const SOURCES: Record<string, KnowledgeFactSource> = {
  "NCERT-CONTEMPORARY-INDIA-I-DRAINAGE": {
    sourceId: "NCERT-CONTEMPORARY-INDIA-I-DRAINAGE",
    sourceType: "textbook",
    title: "NCERT — Contemporary India-I, Chapter 3: Drainage",
    url: "https://ncert.nic.in/textbook.php",
    locator: "Class IX Contemporary India-I, Chapter 3: Drainage — drainage basin and drainage-pattern sections",
  },
  "INDIA-WRIS-INDUS-BASIN": {
    sourceId: "INDIA-WRIS-INDUS-BASIN",
    sourceType: "official",
    title: "India-WRIS — Indus Basin",
    url: "https://indiawris.gov.in/",
    locator: "Indus basin river-network and tributary descriptions",
  },
  "INDIA-WRIS-GANGA-BASIN": {
    sourceId: "INDIA-WRIS-GANGA-BASIN",
    sourceType: "official",
    title: "India-WRIS — Ganga Basin",
    url: "https://indiawris.gov.in/",
    locator: "Ganga basin river-network and tributary descriptions",
  },
  "INDIA-WRIS-GODAVARI-BASIN": {
    sourceId: "INDIA-WRIS-GODAVARI-BASIN",
    sourceType: "official",
    title: "India-WRIS — Godavari Basin",
    url: "https://indiawris.gov.in/",
    locator: "Godavari basin river-network and tributary descriptions",
  },
  "INDIA-WRIS-KRISHNA-BASIN": {
    sourceId: "INDIA-WRIS-KRISHNA-BASIN",
    sourceType: "official",
    title: "India-WRIS — Krishna Basin",
    url: "https://indiawris.gov.in/",
    locator: "Krishna basin river-network and tributary descriptions",
  },
  "INDIA-WRIS-CAUVERY-BASIN": {
    sourceId: "INDIA-WRIS-CAUVERY-BASIN",
    sourceType: "official",
    title: "India-WRIS — Cauvery Basin",
    url: "https://indiawris.gov.in/",
    locator: "Cauvery basin river-network and tributary descriptions",
  },
};

export type GeoRiv001Cp011BasinRow = Readonly<{
  river: string;
  basin: string;
  parentRiver: string;
  sourceId: keyof typeof SOURCES;
}>;

const BASIN_ROWS: GeoRiv001Cp011BasinRow[] = [
  { river: "Jhelum", basin: "Indus Basin", parentRiver: "Indus", sourceId: "INDIA-WRIS-INDUS-BASIN" },
  { river: "Chenab", basin: "Indus Basin", parentRiver: "Indus", sourceId: "INDIA-WRIS-INDUS-BASIN" },
  { river: "Ravi", basin: "Indus Basin", parentRiver: "Indus", sourceId: "INDIA-WRIS-INDUS-BASIN" },
  { river: "Beas", basin: "Indus Basin", parentRiver: "Indus", sourceId: "INDIA-WRIS-INDUS-BASIN" },
  { river: "Satluj", basin: "Indus Basin", parentRiver: "Indus", sourceId: "INDIA-WRIS-INDUS-BASIN" },
  { river: "Yamuna", basin: "Ganga Basin", parentRiver: "Ganga", sourceId: "INDIA-WRIS-GANGA-BASIN" },
  { river: "Ghaghara", basin: "Ganga Basin", parentRiver: "Ganga", sourceId: "INDIA-WRIS-GANGA-BASIN" },
  { river: "Gandak", basin: "Ganga Basin", parentRiver: "Ganga", sourceId: "INDIA-WRIS-GANGA-BASIN" },
  { river: "Kosi", basin: "Ganga Basin", parentRiver: "Ganga", sourceId: "INDIA-WRIS-GANGA-BASIN" },
  { river: "Son", basin: "Ganga Basin", parentRiver: "Ganga", sourceId: "INDIA-WRIS-GANGA-BASIN" },
  { river: "Pranhita", basin: "Godavari Basin", parentRiver: "Godavari", sourceId: "INDIA-WRIS-GODAVARI-BASIN" },
  { river: "Indravati", basin: "Godavari Basin", parentRiver: "Godavari", sourceId: "INDIA-WRIS-GODAVARI-BASIN" },
  { river: "Sabari", basin: "Godavari Basin", parentRiver: "Godavari", sourceId: "INDIA-WRIS-GODAVARI-BASIN" },
  { river: "Bhima", basin: "Krishna Basin", parentRiver: "Krishna", sourceId: "INDIA-WRIS-KRISHNA-BASIN" },
  { river: "Tungabhadra", basin: "Krishna Basin", parentRiver: "Krishna", sourceId: "INDIA-WRIS-KRISHNA-BASIN" },
  { river: "Kabini", basin: "Cauvery Basin", parentRiver: "Cauvery", sourceId: "INDIA-WRIS-CAUVERY-BASIN" },
  { river: "Bhavani", basin: "Cauvery Basin", parentRiver: "Cauvery", sourceId: "INDIA-WRIS-CAUVERY-BASIN" },
];

export type GeoRiv001Cp011PatternRow = Readonly<{
  pattern: string;
  shortName: string;
  recognition: string;
  control: string;
}>;

const PATTERN_ROWS: GeoRiv001Cp011PatternRow[] = [
  {
    pattern: "Dendritic drainage pattern",
    shortName: "Dendritic",
    recognition: "streams branch irregularly like the branches of a tree",
    control: "a broadly uniform rock structure where streams mainly follow the general slope",
  },
  {
    pattern: "Trellis drainage pattern",
    shortName: "Trellis",
    recognition: "main streams tend to run nearly parallel and smaller tributaries join them at about right angles",
    control: "alternating bands of resistant and less resistant rock arranged in a strongly guided structural pattern",
  },
  {
    pattern: "Rectangular drainage pattern",
    shortName: "Rectangular",
    recognition: "the river network shows frequent right-angle bends",
    control: "strongly jointed or faulted rocky terrain that guides channels along fractures",
  },
  {
    pattern: "Radial drainage pattern",
    shortName: "Radial",
    recognition: "streams flow outward in different directions from a central highland",
    control: "a central elevated feature such as a dome, hill or mountain from which water flows outward",
  },
];

function basinFact(row: GeoRiv001Cp011BasinRow): KnowledgeFact {
  const source = SOURCES[row.sourceId];
  return {
    factId: `geo-riv-001-cp011-${slug(row.river)}-belongs-${slug(row.basin)}`,
    entityId: `geo:river:${slug(row.river)}`,
    subject: SUBJECT,
    chapterId: CHAPTER_ID,
    cpId: CP_ID,
    relation: "belongs_to_basin",
    entity: { canonicalName: row.river, label: { en: row.river } },
    value: { kind: "entity_ref", entityId: `geo:basin:${slug(row.basin)}`, label: { en: row.basin } },
    contextGroupId: "geo-riv-basin-membership",
    distractorGroupIds: ["geo-riv-major-basins", "geo-riv-cross-system-tributaries"],
    difficulty: "Medium",
    examTags: EXAM_TAGS,
    tags: ["basin-membership", slug(row.basin), `parent-${slug(row.parentRiver)}`],
    source: { ...source, locator: `${source.locator}; ${row.river} is treated within the ${row.parentRiver} river system / ${row.basin}.` },
    review: { status: "REVIEW_REQUIRED", confidence: 0.95 },
    freshness: { class: "IMMUTABLE", lastVerifiedAt: VERIFIED_AT },
  };
}

function patternFact(row: GeoRiv001Cp011PatternRow, relation: "recognized_by" | "controlled_by"): KnowledgeFact {
  const source = SOURCES["NCERT-CONTEMPORARY-INDIA-I-DRAINAGE"];
  const value = relation === "recognized_by" ? row.recognition : row.control;
  return {
    factId: `geo-riv-001-cp011-pattern-${slug(row.shortName)}-${relation}`,
    entityId: `geo:drainage-pattern:${slug(row.shortName)}`,
    subject: SUBJECT,
    chapterId: CHAPTER_ID,
    cpId: CP_ID,
    relation: `drainage_pattern_${relation}`,
    entity: { canonicalName: row.pattern, label: { en: row.pattern } },
    value: { kind: "text", text: { en: value } },
    contextGroupId: "geo-riv-drainage-pattern-controls",
    distractorGroupIds: ["geo-riv-drainage-pattern-controls", "geo-riv-drainage-pattern-names"],
    difficulty: "Medium",
    examTags: EXAM_TAGS,
    tags: ["drainage-pattern", slug(row.shortName), relation],
    source: { ...source, locator: `${source.locator}; ${row.pattern}.` },
    review: { status: "REVIEW_REQUIRED", confidence: 0.94 },
    freshness: { class: "IMMUTABLE", lastVerifiedAt: VERIFIED_AT },
  };
}

export const GEO_RIV_001_CP011_BASIN_ROWS_V1 = Object.freeze(BASIN_ROWS.map((row) => Object.freeze({ ...row })));
export const GEO_RIV_001_CP011_PATTERN_ROWS_V1 = Object.freeze(PATTERN_ROWS.map((row) => Object.freeze({ ...row })));
export const GEO_RIV_001_CP011_BASIN_FACTS_V1 = Object.freeze(BASIN_ROWS.map(basinFact).map((fact) => Object.freeze(fact)));
export const GEO_RIV_001_CP011_PATTERN_FACTS_V1 = Object.freeze(PATTERN_ROWS.flatMap((row) => [patternFact(row, "recognized_by"), patternFact(row, "controlled_by")]).map((fact) => Object.freeze(fact)));
export const GEO_RIV_001_CP011_FACTS_V1 = Object.freeze([...GEO_RIV_001_CP011_BASIN_FACTS_V1, ...GEO_RIV_001_CP011_PATTERN_FACTS_V1]);

export const GEO_RIV_001_CP011_AUTHORITY_V1 = Object.freeze({
  authorityId: "GEO-RIV-001-CP011-BASINS-PATTERNS-V1" as const,
  chapterId: CHAPTER_ID,
  cpId: CP_ID,
  basinMembershipCount: BASIN_ROWS.length,
  basinCount: new Set(BASIN_ROWS.map((row) => row.basin)).size,
  patternCount: PATTERN_ROWS.length,
  learnerFacingRiverPrefixRequired: true as const,
  distinguishesBasinFromStateDrainage: true as const,
  reviewOnly: true as const,
});