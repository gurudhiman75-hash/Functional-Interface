import type { KnowledgeFact } from "../../types";
import { toGeoRiv001Cp012FactSource, type GeoRiv001Cp012SourceId } from "./geo-riv-001-cp012-source-authorities";

const SUBJECT = "Static GK — Indian Geography";
const CHAPTER_ID = "GEO-RIV-001";
const CP_ID = "GEO-RIV-001-CP012";
const EXAM_TAGS = ["SSC", "RAILWAY", "BANKING", "STATE_EXAMS", "UPSC_PCS"];
const VERIFIED_AT = "2026-09-11";

function slug(value: string) { return value.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

export type GeoRiv001Cp012CityRiverRow = Readonly<{
  city: string;
  river: string;
  state: string;
  sourceId: GeoRiv001Cp012SourceId;
  locator: string;
}>;

const ROWS: GeoRiv001Cp012CityRiverRow[] = [
  { city: "Varanasi", river: "Ganga", state: "Uttar Pradesh", sourceId: "VARANASI-DISTRICT-GANGA", locator: "District Varanasi describes the city's ghats as riverfront steps leading to the banks of the Ganga." },
  { city: "Prayagraj", river: "Ganga", state: "Uttar Pradesh", sourceId: "PRAYAGRAJ-DISTRICT-GEOGRAPHY", locator: "District geography states that Prayagraj stands at the confluence of the Ganga and Yamuna." },
  { city: "Prayagraj", river: "Yamuna", state: "Uttar Pradesh", sourceId: "PRAYAGRAJ-DISTRICT-GEOGRAPHY", locator: "District geography states that Prayagraj stands at the confluence of the Ganga and Yamuna." },
  { city: "Patna", river: "Ganga", state: "Bihar", sourceId: "PATNA-DISTRICT-GANGA", locator: "Patna district states that Patna is located on the south bank of the Ganga." },
  { city: "Haridwar", river: "Ganga", state: "Uttarakhand", sourceId: "HARIDWAR-DISTRICT-GANGA", locator: "Haridwar district describes the sacred Ganga at Har Ki Pauri and Haridwar's direct Ganga association." },
  { city: "Delhi", river: "Yamuna", state: "Delhi", sourceId: "DELHI-IFC-YAMUNA", locator: "Government of NCT of Delhi flood-control functions explicitly describe protecting the city of Delhi from floods in River Yamuna." },
  { city: "Mathura", river: "Yamuna", state: "Uttar Pradesh", sourceId: "MATHURA-DISTRICT-YAMUNA", locator: "Mathura district states that Mathura is located on the bank of the Yamuna." },
  { city: "Agra", river: "Yamuna", state: "Uttar Pradesh", sourceId: "AGRA-DISTRICT-YAMUNA", locator: "Agra district describes Agra as a city on the banks of the Yamuna." },
  { city: "Nashik", river: "Godavari", state: "Maharashtra", sourceId: "NASHIK-DISTRICT-GEOGRAPHY", locator: "Nashik district describes the city as situated on the banks of the Godavari and the river flowing through the city." },
  { city: "Tiruchirappalli", river: "Cauvery", state: "Tamil Nadu", sourceId: "TRICHY-DISTRICT-CAUVERY", locator: "Tiruchirappalli district states that the city is situated on the banks of the Cauvery." },
  { city: "Ahmedabad", river: "Sabarmati", state: "Gujarat", sourceId: "RBI-AHMEDABAD-SABARMATI", locator: "RBI Ahmedabad profile places the office near Gandhi Bridge on the banks of the Sabarmati in Ahmedabad, supporting the standard city-river relation." },
  { city: "Surat", river: "Tapi", state: "Gujarat", sourceId: "SURAT-DISTRICT-TAPI", locator: "Surat district states that Surat city is situated on the left bank of River Tapi." },
  { city: "Jabalpur", river: "Narmada", state: "Madhya Pradesh", sourceId: "JABALPUR-DISTRICT-NARMADA", locator: "Jabalpur district tourism material repeatedly anchors major Jabalpur places and projects to the Narmada." },
  { city: "Cuttack", river: "Mahanadi", state: "Odisha", sourceId: "ODISHA-CUTTACK-MAHANADI", locator: "Government of Odisha describes Cuttack Mahanadi river-front development and Mahanadi banks at Cuttack." },
  { city: "Srinagar", river: "Jhelum", state: "Jammu and Kashmir", sourceId: "SRINAGAR-DISTRICT-JHELUM", locator: "District Srinagar geographic convention identifies the Jhelum as the river passing through Srinagar city." },
  { city: "Guwahati", river: "Brahmaputra", state: "Assam", sourceId: "ASSAM-GUWAHATI-BRAHMAPUTRA", locator: "Government of Assam district/city geography convention places Guwahati on the Brahmaputra." },
  { city: "Vijayawada", river: "Krishna", state: "Andhra Pradesh", sourceId: "AP-VIJAYAWADA-KRISHNA", locator: "Government of Andhra Pradesh district geography convention places Vijayawada on the Krishna River." },
  { city: "Kolkata", river: "Hooghly", state: "West Bengal", sourceId: "KMC-HOOGHLY-RIVERFRONT", locator: "Kolkata Municipal Corporation describes the Hooghly riverfront within Kolkata's municipal boundaries." },
];

function fact(row: GeoRiv001Cp012CityRiverRow): KnowledgeFact {
  return {
    factId: `geo-riv-001-cp012-city-${slug(row.city)}-river-${slug(row.river)}`,
    entityId: `geo:city:${slug(row.city)}`,
    subject: SUBJECT,
    chapterId: CHAPTER_ID,
    cpId: CP_ID,
    relation: "city_on_river",
    entity: { canonicalName: row.city, label: { en: row.city } },
    value: { kind: "entity_ref", entityId: `geo:river:${slug(row.river)}`, label: { en: row.river } },
    contextGroupId: "geo-riv-city-river-relations",
    distractorGroupIds: ["geo-riv-major-cities", "geo-riv-major-rivers"],
    difficulty: "Easy",
    examTags: EXAM_TAGS,
    tags: ["city-place", "city_on_river", slug(row.state)],
    source: toGeoRiv001Cp012FactSource(row.sourceId, row.locator),
    review: { status: "REVIEW_REQUIRED", confidence: 0.96 },
    freshness: { class: "SLOW_MUTABLE", lastVerifiedAt: VERIFIED_AT },
  };
}

export const GEO_RIV_001_CP012_CITY_RIVER_ROWS_V1 = Object.freeze(ROWS.map((row) => Object.freeze({ ...row })));
export const GEO_RIV_001_CP012_FACTS_V1 = Object.freeze(ROWS.map((row) => Object.freeze(fact(row))));
export const GEO_RIV_001_CP012_AUTHORITY_V1 = Object.freeze({
  authorityId: "GEO-RIV-001-CP012-CITY-RIVER-RELATIONS-V1" as const,
  chapterId: CHAPTER_ID,
  cpId: CP_ID,
  relation: "city_on_river" as const,
  relationCount: ROWS.length,
  cityCount: new Set(ROWS.map((row) => row.city)).size,
  riverCount: new Set(ROWS.map((row) => row.river)).size,
  learnerFacingRiverPrefixRequired: true as const,
  reviewOnly: true as const,
});
