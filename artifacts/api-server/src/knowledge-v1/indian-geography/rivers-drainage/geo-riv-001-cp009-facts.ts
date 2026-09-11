import type { KnowledgeFact, KnowledgeV1Difficulty } from "../../types";
import { GEO_RIV_001_CP004_REVIEWABLE_FACTS_V1 } from "./geo-riv-001-cp004-editorial-review-v1";
import { GEO_RIV_001_CP005_REVIEWABLE_FACTS_V1 } from "./geo-riv-001-cp005-editorial-review-v1";
import { toGeoRiv001Cp009FactSource, type GeoRiv001Cp009SourceId } from "./geo-riv-001-cp009-source-authorities";

const SUBJECT = "Static GK — Indian Geography";
const CHAPTER_ID = "GEO-RIV-001";
const CP_ID = "GEO-RIV-001-CP009";
const EXAM_TAGS = ["SSC", "RAILWAY", "BANKING", "STATE_EXAMS", "UPSC_PCS"];
const VERIFIED_AT = "2026-09-11";

function riverId(river: string) {
  return `geo:river:${river.toLowerCase().replaceAll(" ", "-").replaceAll(/[()]/g, "")}`;
}

function stateId(state: string) {
  return `geo:state:${state.toLowerCase().replaceAll(" ", "-").replaceAll("&", "and")}`;
}

function courseStateFact(args: {
  id: string;
  river: string;
  state: string;
  sourceId: GeoRiv001Cp009SourceId;
  locator: string;
  difficulty?: KnowledgeV1Difficulty;
}): KnowledgeFact {
  return {
    factId: `geo-riv-001-cp009-${args.id}`,
    entityId: riverId(args.river),
    subject: SUBJECT,
    chapterId: CHAPTER_ID,
    cpId: CP_ID,
    relation: "flows_through_state",
    entity: { canonicalName: args.river, label: { en: args.river } },
    value: { kind: "entity_ref", entityId: stateId(args.state), label: { en: args.state } },
    contextGroupId: "geo-riv-main-course-states",
    distractorGroupIds: ["geo-riv-main-course-states", "geo-india-states"],
    difficulty: args.difficulty ?? "Easy",
    examTags: EXAM_TAGS,
    tags: ["river-state", "main-course", "course-state"],
    source: toGeoRiv001Cp009FactSource(args.sourceId, args.locator),
    review: { status: "REVIEW_REQUIRED", confidence: 0.97 },
    freshness: { class: "IMMUTABLE", lastVerifiedAt: VERIFIED_AT },
  };
}

const courseRows: Array<[string, string, string, GeoRiv001Cp009SourceId, string]> = [
  ["ganga-uttarakhand", "Ganga", "Uttarakhand", "CWC-UGBO-WQ-FEB-2025", "CWC UGBO WQ Bulletin p.4 — Ganga passes through Uttarakhand"],
  ["ganga-uttar-pradesh", "Ganga", "Uttar Pradesh", "CWC-UGBO-WQ-FEB-2025", "CWC UGBO WQ Bulletin p.4 — Ganga passes through Uttar Pradesh"],
  ["ganga-bihar", "Ganga", "Bihar", "CWC-UGBO-WQ-FEB-2025", "CWC UGBO WQ Bulletin p.4 — Ganga enters and flows through Bihar"],
  ["ganga-jharkhand", "Ganga", "Jharkhand", "CWC-UGBO-WQ-FEB-2025", "CWC UGBO WQ Bulletin p.4 — course-state summary includes Jharkhand"],
  ["ganga-west-bengal", "Ganga", "West Bengal", "CWC-UGBO-WQ-FEB-2025", "CWC UGBO WQ Bulletin p.4 — Ganga enters West Bengal after Bihar"],

  ["brahmaputra-arunachal-pradesh", "Brahmaputra", "Arunachal Pradesh", "ASSAM-WR-BRAHMAPUTRA-SYSTEM", "Government of Assam — Brahmaputra enters India through Arunachal Pradesh"],
  ["brahmaputra-assam", "Brahmaputra", "Assam", "ASSAM-WR-BRAHMAPUTRA-SYSTEM", "Government of Assam — Brahmaputra flows through Assam before Bangladesh"],

  ["krishna-maharashtra", "Krishna", "Maharashtra", "CWC-KGBO-BOOKLET", "CWC KGBO — Krishna rises in Maharashtra and flows west-to-east"],
  ["krishna-karnataka", "Krishna", "Karnataka", "CWC-KGBO-BOOKLET", "CWC KGBO — Krishna course through Karnataka"],
  ["krishna-telangana", "Krishna", "Telangana", "CGWB-TELANGANA-RIVERS-2020", "CGWB/Telangana — Krishna flows through southern Telangana"],
  ["krishna-andhra-pradesh", "Krishna", "Andhra Pradesh", "CGWB-TELANGANA-RIVERS-2020", "CGWB/Telangana — Krishna flows down through Andhra Pradesh before Bay of Bengal"],

  ["godavari-maharashtra", "Godavari", "Maharashtra", "MAHARASHTRA-STATE-DMP-RIVERS", "Government of Maharashtra — Godavari originates and flows across Maharashtra"],
  ["godavari-telangana", "Godavari", "Telangana", "CGWB-TELANGANA-RIVERS-2020", "CGWB/Telangana — Godavari drains through northern Telangana"],
  ["godavari-andhra-pradesh", "Godavari", "Andhra Pradesh", "CGWB-TELANGANA-RIVERS-2020", "CGWB/Telangana — Godavari flows down through Andhra Pradesh before Bay of Bengal"],

  ["mahanadi-chhattisgarh", "Mahanadi", "Chhattisgarh", "CWC-HYDROLOGICAL-NETWORK-2025", "CWC hydrological network — main-stem Mahanadi station at Basantpur, Chhattisgarh"],
  ["mahanadi-odisha", "Mahanadi", "Odisha", "ODISHA-TOPOGRAPHY-RIVERS", "Government of Odisha — Mahanadi main course has a long Odisha segment"],

  ["cauvery-karnataka", "Cauvery", "Karnataka", "TNPCB-CAUVERY-ACTION-PLAN", "TNPCB river description — Cauvery flows in Karnataka and Tamil Nadu"],
  ["cauvery-tamil-nadu", "Cauvery", "Tamil Nadu", "TNPCB-CAUVERY-ACTION-PLAN", "TNPCB river description — Cauvery flows in Karnataka and Tamil Nadu"],

  ["pennar-karnataka", "Pennar", "Karnataka", "CWC-IHD-PENNAR-2018", "CWC IHD 2018 — 61 km of Pennar runs in Karnataka"],
  ["pennar-andhra-pradesh", "Pennar", "Andhra Pradesh", "CWC-IHD-PENNAR-2018", "CWC IHD 2018 — Pennar enters Andhra Pradesh and runs eastward to Bay of Bengal"],

  ["teesta-sikkim", "Teesta", "Sikkim", "WII-TEESTA-INTRODUCTION", "WII — Teesta flows through Sikkim before entering West Bengal"],
  ["teesta-west-bengal", "Teesta", "West Bengal", "WII-TEESTA-INTRODUCTION", "WII — Teesta enters West Bengal at Rangpo"],

  ["subarnarekha-jharkhand", "Subarnarekha", "Jharkhand", "ISTI-SUBARNAREKHA-HYDROLOGY", "Government ISTI portal — Subarnarekha traverses Jharkhand districts"],
  ["subarnarekha-west-bengal", "Subarnarekha", "West Bengal", "ISTI-SUBARNAREKHA-HYDROLOGY", "Government ISTI portal — Subarnarekha continues into West Bengal"],
  ["subarnarekha-odisha", "Subarnarekha", "Odisha", "ISTI-SUBARNAREKHA-HYDROLOGY", "Government ISTI portal — Subarnarekha continues into Odisha"],
];

export const GEO_RIV_001_CP009_COURSE_STATE_FACTS_V1 = Object.freeze(
  courseRows.map(([id, river, state, sourceId, locator]) => Object.freeze(courseStateFact({ id, river, state, sourceId, locator }))),
);

function projectSourceState(fact: KnowledgeFact, upstream: "cp004" | "cp005"): KnowledgeFact {
  return {
    ...fact,
    factId: `geo-riv-001-cp009-proj-${upstream}-${fact.factId}`,
    cpId: CP_ID,
    tags: [...fact.tags, "cp009-source-state-projection", `upstream:${upstream}`, `upstream-fact:${fact.factId}`],
    review: { ...fact.review, status: "REVIEW_REQUIRED" },
  };
}

const sourceStateProjection = [
  ...GEO_RIV_001_CP005_REVIEWABLE_FACTS_V1.filter((fact) => fact.relation === "source_state").map((fact) => projectSourceState(fact, "cp005")),
  ...GEO_RIV_001_CP004_REVIEWABLE_FACTS_V1.filter((fact) => fact.relation === "rises_in" && fact.value.kind === "entity_ref" && fact.value.entityId.includes("state:sikkim")).map((fact) => projectSourceState(fact, "cp004")),
];

export const GEO_RIV_001_CP009_SOURCE_STATE_FACTS_V1 = Object.freeze(sourceStateProjection.map((fact) => Object.freeze(fact)));

export const GEO_RIV_001_CP009_FACTS_V1 = Object.freeze([
  ...GEO_RIV_001_CP009_COURSE_STATE_FACTS_V1,
  ...GEO_RIV_001_CP009_SOURCE_STATE_FACTS_V1,
]);

export const GEO_RIV_001_CP009_AUTHORITY_V1 = Object.freeze({
  authorityId: "GEO-RIV-001-CP009-RIVER-STATE-FACTS-V1" as const,
  chapterId: CHAPTER_ID,
  cpId: CP_ID,
  courseFactCount: GEO_RIV_001_CP009_COURSE_STATE_FACTS_V1.length,
  sourceStateProjectionCount: GEO_RIV_001_CP009_SOURCE_STATE_FACTS_V1.length,
  heldOutUpstreams: Object.freeze(["cp006"] as const),
  basinStateConflationForbidden: true as const,
  reviewOnly: true as const,
});
