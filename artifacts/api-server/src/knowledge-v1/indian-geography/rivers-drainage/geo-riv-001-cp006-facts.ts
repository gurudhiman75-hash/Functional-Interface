import type { KnowledgeFact, KnowledgeFactSource } from "../../types";

const SUBJECT = "Static GK — Indian Geography";
const CHAPTER_ID = "GEO-RIV-001";
const CP_ID = "GEO-RIV-001-CP006";
const EXAM_TAGS = ["SSC", "RAILWAY", "BANKING", "STATE_EXAMS", "UPSC_PCS"];
const VERIFIED_AT = "2026-09-11";

function slug(value: string) { return value.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

const SOURCES: Record<string, KnowledgeFactSource> = {
  "CWC-NARMADA-FLOOD-APPRAISAL-2018": { sourceId:"CWC-NARMADA-FLOOD-APPRAISAL-2018", sourceType:"official", title:"Central Water Commission — Flood Appraisal Report 2018", url:"https://cwc.gov.in/sites/default/files/flood-appraisal-report-2018.pdf", locator:"Narmada basin description and major tributaries" },
  "CWC-HYDROLOGICAL-DATA-BOOK-2021": { sourceId:"CWC-HYDROLOGICAL-DATA-BOOK-2021", sourceType:"official", title:"Central Water Commission — Integrated Hydrological Data Book", url:"https://cwc.gov.in/", locator:"Tapi basin source, outfall and tributary-bank tables" },
  "INDIA-WRIS-MAHI-BASIN": { sourceId:"INDIA-WRIS-MAHI-BASIN", sourceType:"official", title:"India-WRIS — Mahi Basin", url:"https://indiawris.gov.in/", locator:"Mahi basin source, outfall and principal tributaries" },
  "CWC-MAHI-WATER-YEAR-BOOK": { sourceId:"CWC-MAHI-WATER-YEAR-BOOK", sourceType:"official", title:"Central Water Commission — Mahi Basin Water Year Book", url:"https://cwc.gov.in/", locator:"Mahi origin, Gulf of Khambhat outfall and tributary-bank descriptions" },
  "CWC-SABARMATI-HYDROLOGICAL-DATA": { sourceId:"CWC-SABARMATI-HYDROLOGICAL-DATA", sourceType:"official", title:"Central Water Commission — Integrated Hydrological Data Book: Sabarmati Basin", url:"https://cwc.gov.in/", locator:"Sabarmati origin and principal tributaries" },
  "NRSC-RIVER-BASIN-ATLAS-SABARMATI": { sourceId:"NRSC-RIVER-BASIN-ATLAS-SABARMATI", sourceType:"official", title:"NRSC/CWC — River Basin Atlas of India: Sabarmati", url:"https://www.nrsc.gov.in/", locator:"Sabarmati source near Tepur, Udaipur district, outfall and tributary-bank descriptions" },
  "CWC-NATIONAL-COMMISSION-FLOODS-WEST-RIVERS": { sourceId:"CWC-NATIONAL-COMMISSION-FLOODS-WEST-RIVERS", sourceType:"official", title:"Government of India — National Commission on Floods Report, Volume I", url:"https://cwc.gov.in/sites/default/files/rbareport-1980comp.pdf", locator:"West-flowing rivers: Sharavathi and Netravati source/course/outfall descriptions" },
};

export type GeoRiv001Cp006Tributary = Readonly<{ name: string; bank: "left bank" | "right bank" }>;
export type GeoRiv001Cp006RiverRow = Readonly<{ river:string; sourcePlace:string; sourceRegion:string; sourceState:string; mouth:string; tributaries:readonly GeoRiv001Cp006Tributary[]; sourceId:keyof typeof SOURCES; tributarySourceId?:keyof typeof SOURCES }>;

export const GEO_RIV_001_CP006_ROWS_V1: readonly GeoRiv001Cp006RiverRow[] = Object.freeze([
  Object.freeze({ river:"Narmada", sourcePlace:"Amarkantak", sourceRegion:"Maikal Hills", sourceState:"Madhya Pradesh", mouth:"Gulf of Khambhat", sourceId:"CWC-NARMADA-FLOOD-APPRAISAL-2018", tributaries:Object.freeze([
    Object.freeze({name:"Tawa",bank:"left bank" as const}),Object.freeze({name:"Banjar",bank:"left bank" as const}),Object.freeze({name:"Hiran",bank:"right bank" as const}),Object.freeze({name:"Barna",bank:"right bank" as const}),
  ])}),
  Object.freeze({ river:"Tapi", sourcePlace:"Multai", sourceRegion:"Satpura Range", sourceState:"Madhya Pradesh", mouth:"Gulf of Khambhat", sourceId:"CWC-HYDROLOGICAL-DATA-BOOK-2021", tributaries:Object.freeze([
    Object.freeze({name:"Purna",bank:"left bank" as const}),Object.freeze({name:"Girna",bank:"left bank" as const}),Object.freeze({name:"Panjhra",bank:"left bank" as const}),Object.freeze({name:"Gomai",bank:"right bank" as const}),Object.freeze({name:"Aner",bank:"right bank" as const}),
  ])}),
  Object.freeze({ river:"Mahi", sourcePlace:"Sardarpur", sourceRegion:"Vindhya Range", sourceState:"Madhya Pradesh", mouth:"Gulf of Khambhat", sourceId:"INDIA-WRIS-MAHI-BASIN", tributarySourceId:"CWC-MAHI-WATER-YEAR-BOOK", tributaries:Object.freeze([
    Object.freeze({name:"Anas",bank:"left bank" as const}),Object.freeze({name:"Panam",bank:"left bank" as const}),Object.freeze({name:"Som",bank:"right bank" as const}),
  ])}),
  Object.freeze({ river:"Sabarmati", sourcePlace:"Tepur", sourceRegion:"Aravalli Hills", sourceState:"Rajasthan", mouth:"Gulf of Khambhat", sourceId:"NRSC-RIVER-BASIN-ATLAS-SABARMATI", tributarySourceId:"CWC-SABARMATI-HYDROLOGICAL-DATA", tributaries:Object.freeze([
    Object.freeze({name:"Wakal",bank:"left bank" as const}),Object.freeze({name:"Hathmati",bank:"left bank" as const}),Object.freeze({name:"Watrak",bank:"left bank" as const}),Object.freeze({name:"Sei",bank:"right bank" as const}),
  ])}),
  Object.freeze({ river:"Sharavathi", sourcePlace:"Humacha", sourceRegion:"Western Ghats", sourceState:"Karnataka", mouth:"Arabian Sea", sourceId:"CWC-NATIONAL-COMMISSION-FLOODS-WEST-RIVERS", tributaries:Object.freeze([]) }),
  Object.freeze({ river:"Netravati", sourcePlace:"Kudremukh–Ballalrayan Durga region", sourceRegion:"Western Ghats", sourceState:"Karnataka", mouth:"Arabian Sea", sourceId:"CWC-NATIONAL-COMMISSION-FLOODS-WEST-RIVERS", tributaries:Object.freeze([]) }),
]);

function entityFact(r:GeoRiv001Cp006RiverRow,relation:string,valueKind:string,value:string,sourceId:keyof typeof SOURCES):KnowledgeFact{const source=SOURCES[sourceId];return{factId:`geo-riv-001-cp006-${slug(r.river)}-${slug(relation)}-${slug(value)}`,entityId:`geo:river:${slug(r.river)}`,subject:SUBJECT,chapterId:CHAPTER_ID,cpId:CP_ID,relation,entity:{canonicalName:r.river,label:{en:r.river}},value:{kind:"entity_ref",entityId:`geo:${valueKind}:${slug(value)}`,label:{en:value}},contextGroupId:"geo-riv-west-flowing",distractorGroupIds:["geo-riv-west-flowing"],difficulty:"Easy",examTags:EXAM_TAGS,tags:["west-flowing",relation],source,review:{status:"REVIEW_REQUIRED",confidence:0.97},freshness:{class:"IMMUTABLE",lastVerifiedAt:VERIFIED_AT}};}
const facts:KnowledgeFact[]=[];
for(const row of GEO_RIV_001_CP006_ROWS_V1){facts.push(entityFact(row,"originates_near","place",row.sourcePlace,row.sourceId));facts.push(entityFact(row,"source_region","region",row.sourceRegion,row.sourceId));facts.push(entityFact(row,"source_state","state",row.sourceState,row.sourceId));facts.push(entityFact(row,"drains_into","water",row.mouth,row.sourceId));facts.push(entityFact(row,"flows_westward","flow-direction","West",row.sourceId));for(const t of row.tributaries)facts.push(entityFact(row,t.bank==="left bank"?"has_left_bank_tributary":"has_right_bank_tributary","river",t.name,row.tributarySourceId??row.sourceId));}
export const GEO_RIV_001_CP006_FACTS_V1=Object.freeze(facts.map(f=>Object.freeze(f)));
export const GEO_RIV_001_CP006_AUTHORITY_V1=Object.freeze({authorityId:"GEO-RIV-001-CP006-WEST-FLOWING-V1" as const,chapterId:CHAPTER_ID,cpId:CP_ID,riverCount:GEO_RIV_001_CP006_ROWS_V1.length,coreTributaryRiverCount:GEO_RIV_001_CP006_ROWS_V1.filter(r=>r.tributaries.length>0).length,tributaryCount:GEO_RIV_001_CP006_ROWS_V1.reduce((n,r)=>n+r.tributaries.length,0),learnerFacingRiverPrefixRequired:true as const,reviewOnly:true as const});
