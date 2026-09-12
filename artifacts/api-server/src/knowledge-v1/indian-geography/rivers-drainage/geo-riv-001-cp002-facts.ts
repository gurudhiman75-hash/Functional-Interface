import type { KnowledgeFact, KnowledgeV1Difficulty } from "../../types";
import { toGeoRiv001FactSource } from "./geo-riv-001-source-authorities";

const SUBJECT = "Static GK — Indian Geography";
const CHAPTER_ID = "GEO-RIV-001";
const CP_ID = "GEO-RIV-001-CP002";
const EXAM_TAGS = ["SSC", "RAILWAY", "BANKING", "STATE_EXAMS", "UPSC"];

const CWC_INDUS = "CWC-INDUS-BASIN-ORGANISATION";
const BBMB_BEAS = "BBMB-BEAS-PONG-PSP-HYDROLOGY";
const CWC_RAVI_BEAS = "CWC-RAVI-BEAS-WATERS-TRIBUNAL-1987";
const CWC_FLOODS = "CWC-NATIONAL-COMMISSION-FLOODS-REPORT-V1";

function entityFact(args: {
  id: string;
  entityId: string;
  entityLabel: string;
  relation: string;
  valueId: string;
  valueLabel: string;
  contextGroupId: string;
  distractorGroupIds: string[];
  sourceId: string;
  locator: string;
  difficulty?: KnowledgeV1Difficulty;
  tags: string[];
}): KnowledgeFact {
  return {
    factId: `geo-riv-001-cp002-${args.id}`,
    entityId: args.entityId,
    subject: SUBJECT,
    chapterId: CHAPTER_ID,
    cpId: CP_ID,
    relation: args.relation,
    entity: {
      canonicalName: args.entityLabel,
      label: { en: args.entityLabel },
    },
    value: {
      kind: "entity_ref",
      entityId: args.valueId,
      label: { en: args.valueLabel },
    },
    contextGroupId: args.contextGroupId,
    distractorGroupIds: args.distractorGroupIds,
    difficulty: args.difficulty ?? "Easy",
    examTags: EXAM_TAGS,
    tags: ["indus-system", ...args.tags],
    source: toGeoRiv001FactSource(args.sourceId, args.locator),
    review: {
      status: "REVIEW_REQUIRED",
      confidence: 0.96,
    },
    freshness: {
      class: "IMMUTABLE",
      lastVerifiedAt: "2026-09-09",
    },
  };
}

function textFact(args: {
  id: string;
  entityId: string;
  entityLabel: string;
  relation: string;
  text: string;
  contextGroupId: string;
  distractorGroupIds?: string[];
  sourceId: string;
  locator: string;
  difficulty?: KnowledgeV1Difficulty;
  tags: string[];
}): KnowledgeFact {
  return {
    factId: `geo-riv-001-cp002-${args.id}`,
    entityId: args.entityId,
    subject: SUBJECT,
    chapterId: CHAPTER_ID,
    cpId: CP_ID,
    relation: args.relation,
    entity: {
      canonicalName: args.entityLabel,
      label: { en: args.entityLabel },
    },
    value: {
      kind: "text",
      text: { en: args.text },
    },
    contextGroupId: args.contextGroupId,
    distractorGroupIds: args.distractorGroupIds,
    difficulty: args.difficulty ?? "Easy",
    examTags: EXAM_TAGS,
    tags: ["indus-system", ...args.tags],
    source: toGeoRiv001FactSource(args.sourceId, args.locator),
    review: {
      status: "REVIEW_REQUIRED",
      confidence: 0.94,
    },
    freshness: {
      class: "IMMUTABLE",
      lastVerifiedAt: "2026-09-09",
    },
  };
}

function mainTributary(id: string, river: string): KnowledgeFact {
  return entityFact({
    id: `main-tributary-${id}-indus`,
    entityId: `geo:river:${id}`,
    entityLabel: river,
    relation: "main_tributary_of",
    valueId: "geo:river:indus",
    valueLabel: "Indus",
    contextGroupId: "geo-riv-indus-main-tributaries",
    distractorGroupIds: ["geo-riv-major-himalayan-rivers", "geo-riv-indus-river-entities"],
    sourceId: CWC_INDUS,
    locator: "Indus River Basin — paragraph listing Jhelum, Chenab, Ravi, Beas and Satluj as main tributaries",
    tags: ["main-tributary", id],
  });
}

function tributaryOf(args: {
  id: string;
  river: string;
  parentId: string;
  parent: string;
  sourceId?: string;
  locator: string;
  difficulty?: KnowledgeV1Difficulty;
}): KnowledgeFact {
  return entityFact({
    id: `tributary-${args.id}-${args.parentId}`,
    entityId: `geo:river:${args.id}`,
    entityLabel: args.river,
    relation: "tributary_of",
    valueId: `geo:river:${args.parentId}`,
    valueLabel: args.parent,
    contextGroupId: `geo-riv-${args.parentId}-tributaries`,
    distractorGroupIds: ["geo-riv-indus-secondary-tributaries", "geo-riv-indus-river-entities"],
    sourceId: args.sourceId ?? CWC_INDUS,
    locator: args.locator,
    difficulty: args.difficulty ?? "Medium",
    tags: ["tributary", args.parentId],
  });
}

export const GEO_RIV_001_CP002_SYSTEM_FACTS: KnowledgeFact[] = [
  mainTributary("jhelum", "Jhelum"),
  mainTributary("chenab", "Chenab"),
  mainTributary("ravi", "Ravi"),
  mainTributary("beas", "Beas"),
  mainTributary("satluj", "Satluj"),
];

export const GEO_RIV_001_CP002_INDUS_FACTS: KnowledgeFact[] = [
  entityFact({
    id: "indus-source-bokhar-chu",
    entityId: "geo:river:indus",
    entityLabel: "Indus",
    relation: "originates_from",
    valueId: "geo:glacier:bokhar-chu",
    valueLabel: "Bokhar Chu glacier",
    contextGroupId: "geo-riv-indus-source",
    distractorGroupIds: ["geo-riv-indus-system-source-features"],
    sourceId: CWC_INDUS,
    locator: "Indus River Basin — CWC source description: Bokhar Chu glacier on northern slopes of Mt Kailash",
    tags: ["source", "indus"],
  }),
  entityFact({
    id: "indus-source-region-mount-kailash",
    entityId: "geo:river:indus",
    entityLabel: "Indus",
    relation: "source_region",
    valueId: "geo:mountain:mount-kailash",
    valueLabel: "Mount Kailash region",
    contextGroupId: "geo-riv-indus-source",
    distractorGroupIds: ["geo-riv-indus-system-source-regions"],
    sourceId: CWC_INDUS,
    locator: "Indus River Basin — source on northern slopes of Mt Kailash and course originating from Kailash Mountain",
    tags: ["source-region", "indus"],
  }),
  textFact({
    id: "indus-tibet-name-singi-khamban",
    entityId: "geo:river:indus",
    entityLabel: "Indus",
    relation: "known_as_in_tibet",
    text: "Singi Khamban (Lion's Mouth)",
    contextGroupId: "geo-riv-indus-names",
    distractorGroupIds: ["geo-riv-indus-system-river-names"],
    sourceId: CWC_INDUS,
    locator: "Indus River Basin — Tibet course: called Singi Khamban or Lion's Mouth",
    difficulty: "Medium",
    tags: ["alternate-name", "tibet"],
  }),
  tributaryOf({
    id: "zaskar",
    river: "Zaskar",
    parentId: "indus",
    parent: "Indus",
    locator: "Indus River Basin — Indus receives River Zaskar below Leh",
  }),
  entityFact({
    id: "zaskar-joins-indus-below-leh",
    entityId: "geo:river:zaskar",
    entityLabel: "Zaskar",
    relation: "joins_parent_near",
    valueId: "geo:place:below-leh",
    valueLabel: "below Leh",
    contextGroupId: "geo-riv-indus-confluence-locations",
    distractorGroupIds: ["geo-riv-indus-system-places"],
    sourceId: CWC_INDUS,
    locator: "Indus River Basin — Indus receives River Zaskar below Leh",
    difficulty: "Medium",
    tags: ["confluence", "leh"],
  }),
  tributaryOf({
    id: "shyok",
    river: "Shyok",
    parentId: "indus",
    parent: "Indus",
    locator: "Indus River Basin — Indus is joined by the Shyok-Nubra tributaries",
  }),
  tributaryOf({
    id: "shigar",
    river: "Shigar",
    parentId: "indus",
    parent: "Indus",
    locator: "Indus River Basin — Shigar meets the Indus near Skardu",
  }),
  entityFact({
    id: "shigar-joins-indus-skardu",
    entityId: "geo:river:shigar",
    entityLabel: "Shigar",
    relation: "joins_parent_near",
    valueId: "geo:place:skardu",
    valueLabel: "Skardu",
    contextGroupId: "geo-riv-indus-confluence-locations",
    distractorGroupIds: ["geo-riv-indus-system-places"],
    sourceId: CWC_INDUS,
    locator: "Indus River Basin — at Skardu, Shigar meets River Indus",
    difficulty: "Medium",
    tags: ["confluence", "skardu"],
  }),
  tributaryOf({
    id: "gilgit",
    river: "Gilgit",
    parentId: "indus",
    parent: "Indus",
    locator: "Indus River Basin — Gilgit comes from the west to join Indus",
  }),
];

export const GEO_RIV_001_CP002_JHELUM_FACTS: KnowledgeFact[] = [
  entityFact({
    id: "jhelum-source-verinag",
    entityId: "geo:river:jhelum",
    entityLabel: "Jhelum",
    relation: "originates_from",
    valueId: "geo:spring:cheshma-verinag",
    valueLabel: "Cheshma Verinag spring",
    contextGroupId: "geo-riv-indus-system-sources",
    distractorGroupIds: ["geo-riv-indus-system-source-features"],
    sourceId: CWC_INDUS,
    locator: "Jhelum River Basin — formed by water of the spring Cheshma Verinag in the south-eastern Kashmir Valley",
    tags: ["source", "jhelum"],
  }),
  entityFact({
    id: "jhelum-wular-lake",
    entityId: "geo:river:jhelum",
    entityLabel: "Jhelum",
    relation: "flows_through",
    valueId: "geo:lake:wular",
    valueLabel: "Wular Lake",
    contextGroupId: "geo-riv-indus-system-lake-associations",
    distractorGroupIds: ["geo-riv-indus-system-lakes-places"],
    sourceId: CWC_INDUS,
    locator: "Jhelum River Basin — river joins the waters of Wular Lake and takes off from its south-west corner",
    tags: ["lake", "jhelum"],
  }),
  entityFact({
    id: "jhelum-srinagar",
    entityId: "geo:river:jhelum",
    entityLabel: "Jhelum",
    relation: "flows_through_city",
    valueId: "geo:city:srinagar",
    valueLabel: "Srinagar",
    contextGroupId: "geo-riv-indus-system-city-associations",
    distractorGroupIds: ["geo-riv-indus-system-cities"],
    sourceId: CWC_INDUS,
    locator: "Jhelum River Basin — course from Khanabal to and through Srinagar",
    difficulty: "Medium",
    tags: ["city", "jhelum"],
  }),
  tributaryOf({
    id: "lidder",
    river: "Lidder",
    parentId: "jhelum",
    parent: "Jhelum",
    locator: "Jhelum River Basin — Lidder joins Jhelum downstream of Khannabal",
  }),
  entityFact({
    id: "jhelum-joins-chenab-trimmu",
    entityId: "geo:river:jhelum",
    entityLabel: "Jhelum",
    relation: "joins_river",
    valueId: "geo:river:chenab",
    valueLabel: "Chenab",
    contextGroupId: "geo-riv-indus-joining-chain",
    distractorGroupIds: ["geo-riv-indus-main-tributaries"],
    sourceId: CWC_FLOODS,
    locator: "National Commission on Floods, Volume I — Jhelum description: joins Chenab at Trimmu",
    difficulty: "Hard",
    tags: ["joining-chain", "jhelum", "chenab"],
  }),
  entityFact({
    id: "jhelum-chenab-confluence-trimmu",
    entityId: "geo:river:jhelum",
    entityLabel: "Jhelum",
    relation: "joins_river_at",
    valueId: "geo:place:trimmu",
    valueLabel: "Trimmu",
    contextGroupId: "geo-riv-indus-confluence-locations",
    distractorGroupIds: ["geo-riv-indus-system-places"],
    sourceId: CWC_FLOODS,
    locator: "National Commission on Floods, Volume I — Jhelum joins Chenab at Trimmu",
    difficulty: "Hard",
    tags: ["confluence", "trimmu"],
  }),
];

export const GEO_RIV_001_CP002_CHENAB_FACTS: KnowledgeFact[] = [
  tributaryOf({
    id: "chandra",
    river: "Chandra",
    parentId: "chenab-headstream",
    parent: "Chenab headstream system",
    locator: "Chenab River Basin — Chandra and Bhaga merge at Tandi to form Chenab",
    difficulty: "Medium",
  }),
  tributaryOf({
    id: "bhaga",
    river: "Bhaga",
    parentId: "chenab-headstream",
    parent: "Chenab headstream system",
    locator: "Chenab River Basin — Chandra and Bhaga merge at Tandi to form Chenab",
    difficulty: "Medium",
  }),
  textFact({
    id: "chenab-formed-chandra-bhaga",
    entityId: "geo:river:chenab",
    entityLabel: "Chenab",
    relation: "formed_by",
    text: "the confluence of the Chandra and Bhaga rivers",
    contextGroupId: "geo-riv-indus-river-formation",
    distractorGroupIds: ["geo-riv-indus-river-formation-pairs"],
    sourceId: CWC_INDUS,
    locator: "Chenab River Basin — Chenab (Chandra Bhaga) formed after Chandra and Bhaga merge at Tandi",
    difficulty: "Medium",
    tags: ["formation", "chandra", "bhaga"],
  }),
  entityFact({
    id: "chenab-formation-tandi",
    entityId: "geo:river:chenab",
    entityLabel: "Chenab",
    relation: "formed_at",
    valueId: "geo:place:tandi",
    valueLabel: "Tandi",
    contextGroupId: "geo-riv-indus-river-formation",
    distractorGroupIds: ["geo-riv-indus-system-places"],
    sourceId: CWC_INDUS,
    locator: "Chenab River Basin — Chandra and Bhaga merge at Tandi",
    tags: ["formation", "tandi"],
  }),
  entityFact({
    id: "chandra-source-baralacha",
    entityId: "geo:river:chandra",
    entityLabel: "Chandra",
    relation: "source_area",
    valueId: "geo:pass:baralacha",
    valueLabel: "Baralacha Pass area",
    contextGroupId: "geo-riv-indus-system-sources",
    distractorGroupIds: ["geo-riv-indus-system-passes"],
    sourceId: CWC_INDUS,
    locator: "Chenab River Basin — Chandra originates from the Baralacha Pass area in Lahaul-Spiti",
    difficulty: "Medium",
    tags: ["source", "baralacha"],
  }),
  entityFact({
    id: "bhaga-source-baralacha",
    entityId: "geo:river:bhaga",
    entityLabel: "Bhaga",
    relation: "source_area",
    valueId: "geo:pass:baralacha",
    valueLabel: "Baralacha Pass area",
    contextGroupId: "geo-riv-indus-system-sources",
    distractorGroupIds: ["geo-riv-indus-system-passes"],
    sourceId: CWC_INDUS,
    locator: "Chenab River Basin — Bhaga originates from the Baralacha Pass area in Lahaul-Spiti",
    difficulty: "Medium",
    tags: ["source", "baralacha"],
  }),
  tributaryOf({
    id: "miyar-nallah",
    river: "Miyar Nallah",
    parentId: "chenab",
    parent: "Chenab",
    locator: "Chenab River Basin — Chenab receives Miyar Nallah on its right bank",
  }),
  tributaryOf({
    id: "marusudar",
    river: "Marusudar",
    parentId: "chenab",
    parent: "Chenab",
    locator: "Chenab River Basin — Marusudar joins Chenab on the right bank near Bhandarkot",
    difficulty: "Hard",
  }),
];

export const GEO_RIV_001_CP002_RAVI_FACTS: KnowledgeFact[] = [
  entityFact({
    id: "ravi-source-chamba",
    entityId: "geo:river:ravi",
    entityLabel: "Ravi",
    relation: "source_region",
    valueId: "geo:district:chamba-himachal-pradesh",
    valueLabel: "Chamba district, Himachal Pradesh",
    contextGroupId: "geo-riv-indus-system-sources",
    distractorGroupIds: ["geo-riv-indus-system-source-regions"],
    sourceId: CWC_INDUS,
    locator: "Ravi River — originates in the Himalayas in Chamba district of Himachal Pradesh",
    tags: ["source", "ravi"],
  }),
  textFact({
    id: "ravi-perennial",
    entityId: "geo:river:ravi",
    entityLabel: "Ravi",
    relation: "flow_regime",
    text: "perennial river",
    contextGroupId: "geo-riv-himalayan-flow-regime",
    distractorGroupIds: ["geo-riv-flow-regime"],
    sourceId: CWC_INDUS,
    locator: "Ravi River — CWC describes Ravi as a perennial river",
    tags: ["flow-regime", "ravi"],
  }),
  tributaryOf({
    id: "budhil",
    river: "Budhil",
    parentId: "ravi",
    parent: "Ravi",
    locator: "Ravi River — Budhil is listed as one of Ravi's two major tributaries near its upper course",
  }),
  tributaryOf({
    id: "nai-dhona",
    river: "Nai (Dhona)",
    parentId: "ravi",
    parent: "Ravi",
    locator: "Ravi River — Nai or Dhona is listed as one of Ravi's two major tributaries",
  }),
  entityFact({
    id: "ravi-joins-chenab",
    entityId: "geo:river:ravi",
    entityLabel: "Ravi",
    relation: "joins_river",
    valueId: "geo:river:chenab",
    valueLabel: "Chenab",
    contextGroupId: "geo-riv-indus-joining-chain",
    distractorGroupIds: ["geo-riv-indus-main-tributaries"],
    sourceId: CWC_RAVI_BEAS,
    locator: "Ravi & Beas Waters Tribunal Report, Chapter III — Ravi merges into the Chenab",
    difficulty: "Hard",
    tags: ["joining-chain", "ravi", "chenab"],
  }),
];

export const GEO_RIV_001_CP002_BEAS_FACTS: KnowledgeFact[] = [
  entityFact({
    id: "beas-source-beas-kund",
    entityId: "geo:river:beas",
    entityLabel: "Beas",
    relation: "originates_from",
    valueId: "geo:source:beas-kund",
    valueLabel: "Beas Kund",
    contextGroupId: "geo-riv-indus-system-sources",
    distractorGroupIds: ["geo-riv-indus-system-source-features"],
    sourceId: BBMB_BEAS,
    locator: "Pong PSP Feasibility Study, Chapter 3 Hydrology — Beas originates from Beas Kund",
    tags: ["source", "beas"],
  }),
  entityFact({
    id: "beas-source-rohtang",
    entityId: "geo:river:beas",
    entityLabel: "Beas",
    relation: "source_area",
    valueId: "geo:pass:rohtang",
    valueLabel: "near Rohtang Pass",
    contextGroupId: "geo-riv-indus-system-sources",
    distractorGroupIds: ["geo-riv-indus-system-passes"],
    sourceId: BBMB_BEAS,
    locator: "Pong PSP Feasibility Study, Chapter 3 Hydrology — Beas Kund in Pir Panjal ranges near Rohtang Pass",
    tags: ["source-area", "beas", "rohtang"],
  }),
  entityFact({
    id: "beas-joins-satluj",
    entityId: "geo:river:beas",
    entityLabel: "Beas",
    relation: "joins_river",
    valueId: "geo:river:satluj",
    valueLabel: "Satluj",
    contextGroupId: "geo-riv-indus-joining-chain",
    distractorGroupIds: ["geo-riv-indus-main-tributaries"],
    sourceId: CWC_FLOODS,
    locator: "National Commission on Floods, Volume I — Beas joins Sutlej at Harike",
    difficulty: "Medium",
    tags: ["joining-chain", "beas", "satluj"],
  }),
  entityFact({
    id: "beas-satluj-confluence-harike",
    entityId: "geo:river:beas",
    entityLabel: "Beas",
    relation: "joins_river_at",
    valueId: "geo:place:harike",
    valueLabel: "Harike",
    contextGroupId: "geo-riv-indus-confluence-locations",
    distractorGroupIds: ["geo-riv-indus-system-places"],
    sourceId: CWC_FLOODS,
    locator: "National Commission on Floods, Volume I — Beas joins Sutlej at Harike",
    difficulty: "Medium",
    tags: ["confluence", "harike"],
  }),
];

export const GEO_RIV_001_CP002_SATLUJ_FACTS: KnowledgeFact[] = [
  entityFact({
    id: "satluj-source-mansarovar",
    entityId: "geo:river:satluj",
    entityLabel: "Satluj",
    relation: "source_region",
    valueId: "geo:lake:mansarovar-region",
    valueLabel: "near Mansarovar Lake in Tibet",
    contextGroupId: "geo-riv-indus-system-sources",
    distractorGroupIds: ["geo-riv-indus-system-source-regions"],
    sourceId: CWC_INDUS,
    locator: "Satluj River — CWC states the river originates near Mansarover Lake in Tibet",
    tags: ["source", "satluj"],
  }),
  entityFact({
    id: "satluj-shipkila",
    entityId: "geo:river:satluj",
    entityLabel: "Satluj",
    relation: "enters_india_via",
    valueId: "geo:pass:shipkila",
    valueLabel: "Shipkila",
    contextGroupId: "geo-riv-indus-system-pass-associations",
    distractorGroupIds: ["geo-riv-indus-system-passes"],
    sourceId: CWC_INDUS,
    locator: "Satluj River — CWC course description begins from the border through Shipkilla in Himachal Pradesh",
    tags: ["pass", "satluj"],
  }),
  tributaryOf({
    id: "spiti",
    river: "Spiti",
    parentId: "satluj",
    parent: "Satluj",
    locator: "Satluj River — Satluj is joined by the river Spiti",
  }),
  entityFact({
    id: "satluj-joins-chenab-panjnad",
    entityId: "geo:river:satluj",
    entityLabel: "Satluj",
    relation: "joins_river",
    valueId: "geo:river:chenab",
    valueLabel: "Chenab",
    contextGroupId: "geo-riv-indus-joining-chain",
    distractorGroupIds: ["geo-riv-indus-main-tributaries"],
    sourceId: CWC_FLOODS,
    locator: "National Commission on Floods, Volume I — Sutlej joins Chenab at Panjnad",
    difficulty: "Hard",
    tags: ["joining-chain", "satluj", "chenab"],
  }),
  entityFact({
    id: "satluj-chenab-confluence-panjnad",
    entityId: "geo:river:satluj",
    entityLabel: "Satluj",
    relation: "joins_river_at",
    valueId: "geo:place:panjnad",
    valueLabel: "Panjnad",
    contextGroupId: "geo-riv-indus-confluence-locations",
    distractorGroupIds: ["geo-riv-indus-system-places"],
    sourceId: CWC_FLOODS,
    locator: "National Commission on Floods, Volume I — Sutlej joins Chenab at Panjnad",
    difficulty: "Hard",
    tags: ["confluence", "panjnad"],
  }),
];

export const GEO_RIV_001_CP002_FACT_CANDIDATES: KnowledgeFact[] = [
  ...GEO_RIV_001_CP002_SYSTEM_FACTS,
  ...GEO_RIV_001_CP002_INDUS_FACTS,
  ...GEO_RIV_001_CP002_JHELUM_FACTS,
  ...GEO_RIV_001_CP002_CHENAB_FACTS,
  ...GEO_RIV_001_CP002_RAVI_FACTS,
  ...GEO_RIV_001_CP002_BEAS_FACTS,
  ...GEO_RIV_001_CP002_SATLUJ_FACTS,
];
