import type { KnowledgeFact } from "../../types";
import { toGeoRiv001Cp010FactSource, type GeoRiv001Cp010SourceId } from "./geo-riv-001-cp010-source-authorities";

const SUBJECT = "Static GK — Indian Geography";
const CHAPTER_ID = "GEO-RIV-001";
const CP_ID = "GEO-RIV-001-CP010";
const EXAM_TAGS = ["SSC", "RAILWAY", "BANKING", "STATE_EXAMS", "UPSC_PCS"];
const VERIFIED_AT = "2026-09-11";

function slug(value: string) {
  return value.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function entityId(kind: "project" | "river" | "state" | "reservoir", value: string) {
  return `geo:${kind}:${slug(value)}`;
}

function fact(args: {
  id: string;
  project: string;
  relation: "project_on_river" | "project_in_state" | "project_creates_reservoir";
  valueKind: "river" | "state" | "reservoir";
  value: string;
  sourceId: GeoRiv001Cp010SourceId;
  locator: string;
}): KnowledgeFact {
  return {
    factId: `geo-riv-001-cp010-${args.id}`,
    entityId: entityId("project", args.project),
    subject: SUBJECT,
    chapterId: CHAPTER_ID,
    cpId: CP_ID,
    relation: args.relation,
    entity: { canonicalName: args.project, label: { en: args.project } },
    value: { kind: "entity_ref", entityId: entityId(args.valueKind, args.value), label: { en: args.value } },
    contextGroupId: "geo-riv-project-relations",
    distractorGroupIds: ["geo-riv-project-relations", `geo-${args.valueKind}s`],
    difficulty: "Easy",
    examTags: EXAM_TAGS,
    tags: ["dam-project", args.relation, args.valueKind],
    source: toGeoRiv001Cp010FactSource(args.sourceId, args.locator),
    review: { status: "REVIEW_REQUIRED", confidence: 0.97 },
    freshness: { class: "IMMUTABLE", lastVerifiedAt: VERIFIED_AT },
  };
}

function reservoirRiverFact(args: {
  id: string;
  reservoir: string;
  river: string;
  sourceId: GeoRiv001Cp010SourceId;
  locator: string;
}): KnowledgeFact {
  return {
    factId: `geo-riv-001-cp010-${args.id}`,
    entityId: entityId("reservoir", args.reservoir),
    subject: SUBJECT,
    chapterId: CHAPTER_ID,
    cpId: CP_ID,
    relation: "reservoir_on_river",
    entity: { canonicalName: args.reservoir, label: { en: args.reservoir } },
    value: { kind: "entity_ref", entityId: entityId("river", args.river), label: { en: args.river } },
    contextGroupId: "geo-riv-reservoir-relations",
    distractorGroupIds: ["geo-riv-reservoir-relations", "geo-rivers"],
    difficulty: "Medium",
    examTags: EXAM_TAGS,
    tags: ["reservoir", "reservoir_on_river"],
    source: toGeoRiv001Cp010FactSource(args.sourceId, args.locator),
    review: { status: "REVIEW_REQUIRED", confidence: 0.97 },
    freshness: { class: "IMMUTABLE", lastVerifiedAt: VERIFIED_AT },
  };
}

type ProjectRow = {
  project: string;
  river: string;
  states: string[];
  reservoir: string;
  sourceId: GeoRiv001Cp010SourceId;
  locator: string;
};

const PROJECT_ROWS: ProjectRow[] = [
  {
    project: "Bhakra Dam",
    river: "Satluj",
    states: ["Himachal Pradesh"],
    reservoir: "Gobind Sagar",
    sourceId: "BBMB-INDUS-BASIN",
    locator: "Bhakra Dam is constructed across River Satluj; Gobindsagar is the Bhakra reservoir near Bilaspur, Himachal Pradesh.",
  },
  {
    project: "Pong Dam",
    river: "Beas",
    states: ["Himachal Pradesh"],
    reservoir: "Maharana Pratap Sagar",
    sourceId: "BBMB-INDUS-BASIN",
    locator: "Beas Project Unit-II is Pong Dam on River Beas; CWC/BBMB reservoir references identify Maharana Pratap Sagar.",
  },
  {
    project: "Tehri Dam",
    river: "Bhagirathi",
    states: ["Uttarakhand"],
    reservoir: "Tehri Reservoir",
    sourceId: "THDC-TEHRI-HPP",
    locator: "Tehri Hydro Power Complex is on the Bhagirathi River in Uttarakhand; the HPP includes the Tehri storage dam and reservoir.",
  },
  {
    project: "Hirakud Dam",
    river: "Mahanadi",
    states: ["Odisha"],
    reservoir: "Hirakud Reservoir",
    sourceId: "ODISHA-HIRAKUD",
    locator: "Government of Odisha district page: Hirakud Dam stands across River Mahanadi near Sambalpur and forms the Hirakud reservoir.",
  },
  {
    project: "Nagarjuna Sagar Dam",
    river: "Krishna",
    states: ["Telangana", "Andhra Pradesh"],
    reservoir: "Nagarjuna Sagar Reservoir",
    sourceId: "KRMB-NAGARJUNA-SAGAR",
    locator: "KRMB: Nagarjuna Sagar Project/Dam lies between Nalgonda district of Telangana and Guntur district of Andhra Pradesh on the Krishna system.",
  },
  {
    project: "Sardar Sarovar Dam",
    river: "Narmada",
    states: ["Gujarat"],
    reservoir: "Sardar Sarovar Reservoir",
    sourceId: "GUJ-NWR-SARDAR-SAROVAR",
    locator: "Government of Gujarat: Sardar Sarovar (Narmada) Project; CWC project tables identify Sardar Sarovar Dam on Narmada in Gujarat.",
  },
  {
    project: "Indira Sagar Dam",
    river: "Narmada",
    states: ["Madhya Pradesh"],
    reservoir: "Indira Sagar Reservoir",
    sourceId: "CWC-FLOOD-SITREP-2023",
    locator: "CWC reservoir/project table: Indira Sagar Dam — Narmada — Madhya Pradesh.",
  },
  {
    project: "Mettur Dam",
    river: "Cauvery",
    states: ["Tamil Nadu"],
    reservoir: "Stanley Reservoir",
    sourceId: "TN-METTUR",
    locator: "Government of Tamil Nadu: Stanley Reservoir is also known as Mettur Dam and its main water source is River Cauvery.",
  },
  {
    project: "Rihand Dam",
    river: "Rihand",
    states: ["Uttar Pradesh"],
    reservoir: "Govind Ballabh Pant Sagar",
    sourceId: "CWC-RESERVOIR-COMPENDIUM-2024",
    locator: "CWC reservoir appendices list Rihand in Uttar Pradesh on River Rihand; reservoir commonly recorded as Govind Ballabh Pant Sagar.",
  },
  {
    project: "Ukai Dam",
    river: "Tapi",
    states: ["Gujarat"],
    reservoir: "Ukai Reservoir",
    sourceId: "CWC-FLOOD-SITREP-2023",
    locator: "CWC project table: Ukai Dam — Tapi — Gujarat.",
  },
  {
    project: "Gandhi Sagar Dam",
    river: "Chambal",
    states: ["Madhya Pradesh"],
    reservoir: "Gandhi Sagar Reservoir",
    sourceId: "CWC-FLOOD-SITREP-2023",
    locator: "CWC project table: Gandhisagar Dam — Chambal — Madhya Pradesh.",
  },
  {
    project: "Tungabhadra Dam",
    river: "Tungabhadra",
    states: ["Karnataka"],
    reservoir: "Tungabhadra Reservoir",
    sourceId: "CWC-RESERVOIR-COMPENDIUM-2024",
    locator: "CWC reservoir compendium records Tungabhadra reservoir/project in Karnataka on River Tungabhadra.",
  },
];

const projectFacts: KnowledgeFact[] = [];
const reservoirFacts: KnowledgeFact[] = [];
for (const row of PROJECT_ROWS) {
  const base = slug(row.project);
  projectFacts.push(fact({
    id: `${base}-river`, project: row.project, relation: "project_on_river", valueKind: "river", value: row.river,
    sourceId: row.sourceId, locator: row.locator,
  }));
  projectFacts.push(fact({
    id: `${base}-reservoir`, project: row.project, relation: "project_creates_reservoir", valueKind: "reservoir", value: row.reservoir,
    sourceId: row.sourceId, locator: row.locator,
  }));
  for (const state of row.states) {
    projectFacts.push(fact({
      id: `${base}-state-${slug(state)}`, project: row.project, relation: "project_in_state", valueKind: "state", value: state,
      sourceId: row.sourceId, locator: row.locator,
    }));
  }
  reservoirFacts.push(reservoirRiverFact({
    id: `${slug(row.reservoir)}-river`, reservoir: row.reservoir, river: row.river, sourceId: row.sourceId, locator: row.locator,
  }));
}

export const GEO_RIV_001_CP010_PROJECT_ROWS_V1 = Object.freeze(PROJECT_ROWS.map((row) => Object.freeze({ ...row, states: Object.freeze([...row.states]) })));
export const GEO_RIV_001_CP010_PROJECT_FACTS_V1 = Object.freeze(projectFacts.map((item) => Object.freeze(item)));
export const GEO_RIV_001_CP010_RESERVOIR_FACTS_V1 = Object.freeze(reservoirFacts.map((item) => Object.freeze(item)));
export const GEO_RIV_001_CP010_FACTS_V1 = Object.freeze([...GEO_RIV_001_CP010_PROJECT_FACTS_V1, ...GEO_RIV_001_CP010_RESERVOIR_FACTS_V1]);

export const GEO_RIV_001_CP010_AUTHORITY_V1 = Object.freeze({
  authorityId: "GEO-RIV-001-CP010-PROJECT-RELATIONS-V1" as const,
  chapterId: CHAPTER_ID,
  cpId: CP_ID,
  projectCount: PROJECT_ROWS.length,
  projectFactCount: GEO_RIV_001_CP010_PROJECT_FACTS_V1.length,
  reservoirFactCount: GEO_RIV_001_CP010_RESERVOIR_FACTS_V1.length,
  mutableStatusExcluded: true as const,
  learnerFacingRiverPrefixRequired: true as const,
  reviewOnly: true as const,
});
