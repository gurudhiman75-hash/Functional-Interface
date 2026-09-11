import type { KnowledgeFact } from "../../types";
import { toGeoRiv001FactSource } from "./geo-riv-001-source-authorities";

const SUBJECT = "Static GK — Indian Geography";
const CHAPTER_ID = "GEO-RIV-001";
const CP_ID = "GEO-RIV-001-CP013";
const EXAM_TAGS = ["SSC", "RAILWAY", "BANKING", "STATE_EXAMS"];
const NCERT = "NCERT-CONTEMPORARY-INDIA-I-DRAINAGE";
const NCERT_MAJOR = "NCERT-SOCIAL-SCIENCE-TEACHER-MANUAL-KAVERI";

export type GeoRiv001Cp013Class = "HIMALAYAN" | "PENINSULAR" | "EAST_FLOWING" | "WEST_FLOWING" | "DELTA_FORMING" | "ESTUARY_FORMING" | "MAJOR_RIVER";
export type GeoRiv001Cp013Row = Readonly<{ river: string; classes: readonly GeoRiv001Cp013Class[]; system: string; sourceId: string; locator: string }>;

export const GEO_RIV_001_CP013_ROWS_V1: readonly GeoRiv001Cp013Row[] = Object.freeze([
  { river:"Indus", classes:["HIMALAYAN","MAJOR_RIVER"], system:"Indus", sourceId:NCERT_MAJOR, locator:"NCERT teacher manual — major Himalayan rivers" },
  { river:"Ganga", classes:["HIMALAYAN","DELTA_FORMING","MAJOR_RIVER"], system:"Ganga", sourceId:NCERT_MAJOR, locator:"NCERT Drainage chapter and teacher manual — Himalayan river and delta-forming system" },
  { river:"Brahmaputra", classes:["HIMALAYAN","DELTA_FORMING","MAJOR_RIVER"], system:"Brahmaputra", sourceId:NCERT_MAJOR, locator:"NCERT Drainage chapter and teacher manual — Himalayan river and delta-forming system" },
  { river:"Godavari", classes:["PENINSULAR","EAST_FLOWING","DELTA_FORMING","MAJOR_RIVER"], system:"Godavari", sourceId:NCERT_MAJOR, locator:"NCERT Drainage chapter and teacher manual — major Peninsular east-flowing river forming a delta" },
  { river:"Krishna", classes:["PENINSULAR","EAST_FLOWING","DELTA_FORMING","MAJOR_RIVER"], system:"Krishna", sourceId:NCERT_MAJOR, locator:"NCERT Drainage chapter and teacher manual — major Peninsular east-flowing river forming a delta" },
  { river:"Mahanadi", classes:["PENINSULAR","EAST_FLOWING","DELTA_FORMING","MAJOR_RIVER"], system:"Mahanadi", sourceId:NCERT_MAJOR, locator:"NCERT Drainage chapter and teacher manual — major Peninsular east-flowing river forming a delta" },
  { river:"Cauvery", classes:["PENINSULAR","EAST_FLOWING","DELTA_FORMING","MAJOR_RIVER"], system:"Cauvery", sourceId:NCERT_MAJOR, locator:"NCERT Drainage chapter and teacher manual — major Peninsular east-flowing river forming a delta" },
  { river:"Narmada", classes:["PENINSULAR","WEST_FLOWING","ESTUARY_FORMING","MAJOR_RIVER"], system:"Narmada", sourceId:NCERT_MAJOR, locator:"NCERT Drainage chapter and teacher manual — major Peninsular west-flowing river forming an estuary" },
  { river:"Tapi", classes:["PENINSULAR","WEST_FLOWING","ESTUARY_FORMING","MAJOR_RIVER"], system:"Tapi", sourceId:NCERT_MAJOR, locator:"NCERT Drainage chapter and teacher manual — major Peninsular west-flowing river forming an estuary" },
  { river:"Pennar", classes:["PENINSULAR","EAST_FLOWING"], system:"Pennar", sourceId:NCERT, locator:"NCERT Drainage chapter — Peninsular east-flowing drainage context" },
  { river:"Mahi", classes:["PENINSULAR","WEST_FLOWING"], system:"Mahi", sourceId:NCERT, locator:"NCERT Drainage chapter — Peninsular west-flowing rivers" },
  { river:"Sabarmati", classes:["PENINSULAR","WEST_FLOWING"], system:"Sabarmati", sourceId:NCERT, locator:"NCERT Drainage chapter — Peninsular west-flowing rivers" },
]);

const CLASS_LABEL: Record<GeoRiv001Cp013Class,string> = {
  HIMALAYAN:"Himalayan river", PENINSULAR:"Peninsular river", EAST_FLOWING:"East-flowing river", WEST_FLOWING:"West-flowing river", DELTA_FORMING:"Delta-forming river", ESTUARY_FORMING:"Estuary-forming river", MAJOR_RIVER:"Major river",
};

function fact(row: GeoRiv001Cp013Row, cls: GeoRiv001Cp013Class): KnowledgeFact {
  const id=row.river.toLowerCase().replaceAll(" ","-");
  return { factId:`geo-riv-001-cp013-${id}-${cls.toLowerCase().replaceAll("_","-")}`, entityId:`geo:river:${id}`, subject:SUBJECT, chapterId:CHAPTER_ID, cpId:CP_ID, relation:"classified_as_river_group", entity:{canonicalName:row.river,label:{en:row.river}}, value:{kind:"entity_ref",entityId:`geo:river-class:${cls.toLowerCase().replaceAll("_","-")}`,label:{en:CLASS_LABEL[cls]}}, contextGroupId:"geo-riv-cross-classification", distractorGroupIds:["geo-riv-cross-classification"], difficulty: cls==="MAJOR_RIVER"?"Medium":"Easy", examTags:EXAM_TAGS, tags:["river-comparison",cls.toLowerCase()], source:toGeoRiv001FactSource(row.sourceId,row.locator), review:{status:"REVIEW_REQUIRED",confidence:0.96}, freshness:{class:"IMMUTABLE",lastVerifiedAt:"2026-09-11"} };
}

export const GEO_RIV_001_CP013_FACTS_V1: readonly KnowledgeFact[] = Object.freeze(GEO_RIV_001_CP013_ROWS_V1.flatMap((row)=>row.classes.map((cls)=>fact(row,cls))));
export const GEO_RIV_001_CP013_CLASS_LABEL = CLASS_LABEL;
export function geoRiv001Cp013HasClass(river:string, cls:GeoRiv001Cp013Class){ return GEO_RIV_001_CP013_ROWS_V1.some((r)=>r.river===river && r.classes.includes(cls)); }
