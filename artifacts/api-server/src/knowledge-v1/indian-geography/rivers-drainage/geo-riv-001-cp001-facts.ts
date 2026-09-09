import type { KnowledgeFact } from "../../types";
import { toGeoRiv001FactSource } from "./geo-riv-001-source-authorities";

const SUBJECT = "Static GK — Indian Geography";
const CHAPTER_ID = "GEO-RIV-001";
const CP_ID = "GEO-RIV-001-CP001";
const EXAM_TAGS = ["SSC", "RAILWAY", "BANKING", "STATE_EXAMS"];

function conceptFact(
  id: string,
  term: string,
  definition: string,
  sourceId: string,
  locator: string,
  difficulty: KnowledgeFact["difficulty"] = "Easy",
): KnowledgeFact {
  return {
    factId: `geo-riv-001-cp001-concept-${id}`,
    entityId: `geo:concept:${id}`,
    subject: SUBJECT,
    chapterId: CHAPTER_ID,
    cpId: CP_ID,
    relation: "defined_as",
    entity: {
      canonicalName: term,
      label: { en: term },
    },
    value: {
      kind: "text",
      text: { en: definition },
    },
    contextGroupId: "geo-riv-drainage-concepts",
    distractorGroupIds: ["geo-riv-drainage-concept-definitions"],
    difficulty,
    examTags: EXAM_TAGS,
    tags: ["drainage-basics", "concept", id],
    source: toGeoRiv001FactSource(sourceId, locator),
    review: {
      status: "REVIEW_REQUIRED",
      confidence: 0.92,
    },
    freshness: {
      class: "IMMUTABLE",
    },
  };
}

function classificationFact(
  id: string,
  river: string,
  classId: string,
  classLabel: string,
  sourceId: string,
  locator: string,
  difficulty: KnowledgeFact["difficulty"] = "Easy",
): KnowledgeFact {
  return {
    factId: `geo-riv-001-cp001-class-${id}-${classId}`,
    entityId: `geo:river:${id}`,
    subject: SUBJECT,
    chapterId: CHAPTER_ID,
    cpId: CP_ID,
    relation: "classified_as_river_group",
    entity: {
      canonicalName: river,
      label: { en: river },
    },
    value: {
      kind: "entity_ref",
      entityId: `geo:river-class:${classId}`,
      label: { en: classLabel },
    },
    contextGroupId: "geo-riv-major-river-classification",
    distractorGroupIds: [
      "geo-riv-himalayan-vs-peninsular",
      "geo-riv-major-river-groups",
    ],
    difficulty,
    examTags: EXAM_TAGS,
    tags: ["river-classification", classId],
    source: toGeoRiv001FactSource(sourceId, locator),
    review: {
      status: "REVIEW_REQUIRED",
      confidence: 0.95,
    },
    freshness: {
      class: "IMMUTABLE",
    },
  };
}

function patternFact(
  id: string,
  pattern: string,
  definition: string,
  sourceId: string,
  locator: string,
): KnowledgeFact {
  return {
    factId: `geo-riv-001-cp001-pattern-${id}`,
    entityId: `geo:drainage-pattern:${id}`,
    subject: SUBJECT,
    chapterId: CHAPTER_ID,
    cpId: CP_ID,
    relation: "drainage_pattern_defined_as",
    entity: {
      canonicalName: pattern,
      label: { en: pattern },
    },
    value: {
      kind: "text",
      text: { en: definition },
    },
    contextGroupId: "geo-riv-drainage-patterns",
    distractorGroupIds: ["geo-riv-drainage-pattern-names"],
    difficulty: "Medium",
    examTags: EXAM_TAGS,
    tags: ["drainage-pattern", id],
    source: toGeoRiv001FactSource(sourceId, locator),
    review: {
      status: "REVIEW_REQUIRED",
      confidence: 0.91,
    },
    freshness: {
      class: "IMMUTABLE",
    },
  };
}

function directionalFact(
  id: string,
  river: string,
  relation: "flows_westward" | "drains_into",
  valueId: string,
  valueLabel: string,
  sourceId: string,
  locator: string,
): KnowledgeFact {
  return {
    factId: `geo-riv-001-cp001-${id}-${relation}-${valueId}`,
    entityId: `geo:river:${id}`,
    subject: SUBJECT,
    chapterId: CHAPTER_ID,
    cpId: CP_ID,
    relation,
    entity: {
      canonicalName: river,
      label: { en: river },
    },
    value: {
      kind: "entity_ref",
      entityId: `geo:${valueId}`,
      label: { en: valueLabel },
    },
    contextGroupId:
      relation === "flows_westward"
        ? "geo-riv-flow-direction"
        : "geo-riv-drainage-outfall",
    distractorGroupIds:
      relation === "flows_westward"
        ? ["geo-riv-east-west-flow"]
        : ["geo-riv-sea-bay-outfalls"],
    difficulty: "Medium",
    examTags: EXAM_TAGS,
    tags: ["river-classification", relation],
    source: toGeoRiv001FactSource(sourceId, locator),
    review: {
      status: "REVIEW_REQUIRED",
      confidence: 0.96,
    },
    freshness: {
      class: "IMMUTABLE",
    },
  };
}

const NCERT_DRAINAGE = "NCERT-CONTEMPORARY-INDIA-I-DRAINAGE";
const NCERT_KAVERI = "NCERT-SOCIAL-SCIENCE-TEACHER-MANUAL-KAVERI";

export const GEO_RIV_001_CP001_CONCEPT_CANDIDATES: KnowledgeFact[] = [
  conceptFact(
    "drainage",
    "Drainage",
    "the river system of an area",
    NCERT_DRAINAGE,
    "Class IX Contemporary India-I, Chapter 3: Drainage — opening terminology",
  ),
  conceptFact(
    "drainage-basin",
    "Drainage basin",
    "the area drained by a river and its river system",
    NCERT_DRAINAGE,
    "Class IX Contemporary India-I, Chapter 3: Drainage — drainage basin terminology",
  ),
  conceptFact(
    "water-divide",
    "Water divide",
    "an elevated boundary that separates neighbouring drainage basins",
    NCERT_DRAINAGE,
    "Class IX Contemporary India-I, Chapter 3: Drainage — water divide terminology",
  ),
  conceptFact(
    "tributary",
    "Tributary",
    "a river or stream that joins a larger river",
    NCERT_DRAINAGE,
    "Class IX Contemporary India-I, Chapter 3: Drainage — river-system terminology",
  ),
  conceptFact(
    "distributary",
    "Distributary",
    "a channel that branches away from the main river, especially in a delta region",
    NCERT_DRAINAGE,
    "Class IX Contemporary India-I, Chapter 3: Drainage — delta/distributary context",
    "Medium",
  ),
];

export const GEO_RIV_001_CP001_PATTERN_CANDIDATES: KnowledgeFact[] = [
  patternFact(
    "dendritic",
    "Dendritic drainage pattern",
    "a branching drainage pattern resembling the branches of a tree",
    NCERT_DRAINAGE,
    "Class IX Contemporary India-I, Chapter 3: Drainage — drainage patterns",
  ),
  patternFact(
    "trellis",
    "Trellis drainage pattern",
    "a pattern in which tributaries tend to follow near-parallel courses and smaller streams join them at approximately right angles",
    NCERT_DRAINAGE,
    "Class IX Contemporary India-I, Chapter 3: Drainage — drainage patterns",
  ),
  patternFact(
    "rectangular",
    "Rectangular drainage pattern",
    "a drainage pattern associated with strongly jointed rock terrain and frequent right-angle bends",
    NCERT_DRAINAGE,
    "Class IX Contemporary India-I, Chapter 3: Drainage — drainage patterns",
  ),
  patternFact(
    "radial",
    "Radial drainage pattern",
    "a pattern in which streams flow outward in different directions from a central elevated area",
    NCERT_DRAINAGE,
    "Class IX Contemporary India-I, Chapter 3: Drainage — drainage patterns",
  ),
];

export const GEO_RIV_001_CP001_MAJOR_RIVER_CLASSIFICATION_CANDIDATES: KnowledgeFact[] = [
  classificationFact(
    "indus",
    "Indus",
    "himalayan",
    "Himalayan river",
    NCERT_KAVERI,
    "NCERT teacher manual, River Kaveri section — major Himalayan rivers",
  ),
  classificationFact(
    "ganga",
    "Ganga",
    "himalayan",
    "Himalayan river",
    NCERT_KAVERI,
    "NCERT teacher manual, River Kaveri section — major Himalayan rivers",
  ),
  classificationFact(
    "brahmaputra",
    "Brahmaputra",
    "himalayan",
    "Himalayan river",
    NCERT_KAVERI,
    "NCERT teacher manual, River Kaveri section — major Himalayan rivers",
  ),
  classificationFact(
    "narmada",
    "Narmada",
    "peninsular",
    "Peninsular river",
    NCERT_KAVERI,
    "NCERT teacher manual, River Kaveri section — major Peninsular rivers",
  ),
  classificationFact(
    "tapi",
    "Tapi",
    "peninsular",
    "Peninsular river",
    NCERT_KAVERI,
    "NCERT teacher manual, River Kaveri section — major Peninsular rivers",
  ),
  classificationFact(
    "godavari",
    "Godavari",
    "peninsular",
    "Peninsular river",
    NCERT_KAVERI,
    "NCERT teacher manual, River Kaveri section — major Peninsular rivers",
  ),
  classificationFact(
    "mahanadi",
    "Mahanadi",
    "peninsular",
    "Peninsular river",
    NCERT_KAVERI,
    "NCERT teacher manual, River Kaveri section — major Peninsular rivers",
  ),
  classificationFact(
    "krishna",
    "Krishna",
    "peninsular",
    "Peninsular river",
    NCERT_KAVERI,
    "NCERT teacher manual, River Kaveri section — major Peninsular rivers",
  ),
  classificationFact(
    "kaveri",
    "Kaveri",
    "peninsular",
    "Peninsular river",
    NCERT_KAVERI,
    "NCERT teacher manual, River Kaveri section — major Peninsular rivers",
  ),
];

export const GEO_RIV_001_CP001_DIRECTIONAL_CANDIDATES: KnowledgeFact[] = [
  directionalFact(
    "narmada",
    "Narmada",
    "flows_westward",
    "flow-direction:west",
    "West-flowing river",
    "INDIA-WRIS-NARMADA-BASIN-V2",
    "Narmada Basin Report V2, section 1.4 Major rivers",
  ),
  directionalFact(
    "narmada",
    "Narmada",
    "drains_into",
    "sea:arabian-sea",
    "Arabian Sea",
    "INDIA-WRIS-NARMADA-BASIN-V2",
    "Narmada Basin Report V2, section 1.4 Major rivers — Gulf of Khambhat/Arabian Sea outfall",
  ),
  directionalFact(
    "godavari",
    "Godavari",
    "drains_into",
    "bay:bay-of-bengal",
    "Bay of Bengal",
    "INDIA-WRIS-GODAVARI-BASIN-V2",
    "Godavari Basin Report V2, section 1.1 Overview — Bay of Bengal drainage division",
  ),
];

export const GEO_RIV_001_CP001_ALL_CANDIDATES: KnowledgeFact[] = [
  ...GEO_RIV_001_CP001_CONCEPT_CANDIDATES,
  ...GEO_RIV_001_CP001_PATTERN_CANDIDATES,
  ...GEO_RIV_001_CP001_MAJOR_RIVER_CLASSIFICATION_CANDIDATES,
  ...GEO_RIV_001_CP001_DIRECTIONAL_CANDIDATES,
];
