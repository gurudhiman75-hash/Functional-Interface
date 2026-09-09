import type { KnowledgeFact } from "../../types";
import { toGeoRiv001FactSource } from "./geo-riv-001-source-authorities";

const SUBJECT = "Static GK — Indian Geography";
const CHAPTER_ID = "GEO-RIV-001";
const CP_ID = "GEO-RIV-001-CP001";
const EXAM_TAGS = ["SSC", "RAILWAY", "BANKING", "STATE_EXAMS", "UPSC_PCS"];
const NCERT_DRAINAGE = "NCERT-CONTEMPORARY-INDIA-I-DRAINAGE";
const CWC_INDUS = "CWC-INDUS-BASIN-ORGANISATION";

function relationFact(
  id: string,
  entityId: string,
  entityLabel: string,
  relation: string,
  valueId: string,
  valueLabel: string,
  sourceId: string,
  locator: string,
  contextGroupId: string,
  distractorGroupIds: string[],
  difficulty: KnowledgeFact["difficulty"] = "Medium",
): KnowledgeFact {
  return {
    factId: `geo-riv-001-cp001-v2-${id}`,
    entityId,
    subject: SUBJECT,
    chapterId: CHAPTER_ID,
    cpId: CP_ID,
    relation,
    entity: {
      canonicalName: entityLabel,
      label: { en: entityLabel },
    },
    value: {
      kind: "entity_ref",
      entityId: valueId,
      label: { en: valueLabel },
    },
    contextGroupId,
    distractorGroupIds,
    difficulty,
    examTags: EXAM_TAGS,
    tags: ["drainage-basics", "classification-v2", relation],
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

function characteristicFact(
  id: string,
  groupId: string,
  groupLabel: string,
  characteristicId: string,
  characteristicLabel: string,
  locator: string,
): KnowledgeFact {
  return relationFact(
    id,
    `geo:river-group:${groupId}`,
    groupLabel,
    "has_group_characteristic",
    `geo:river-characteristic:${characteristicId}`,
    characteristicLabel,
    NCERT_DRAINAGE,
    locator,
    "geo-riv-himalayan-peninsular-characteristics",
    ["geo-riv-river-group-characteristics"],
    "Medium",
  );
}

const PENINSULAR_FLOW_LOCATOR =
  "Class IX Contemporary India-I, Chapter 3: Drainage — Peninsular rivers: most major rivers flow west-to-east to the Bay of Bengal; Narmada and Tapi are the major west-flowing exceptions";
const PENINSULAR_MOUTH_LOCATOR =
  "Class IX Contemporary India-I, Chapter 3: Drainage — Peninsular rivers: east-flowing major rivers form deltas; Narmada and Tapi form estuaries";
const GROUP_CHARACTER_LOCATOR =
  "Class IX Contemporary India-I, Chapter 3: Drainage — Himalayan and Peninsular rivers: Himalayan rivers are predominantly perennial while many Peninsular rivers are seasonal/rain-fed";

export const GEO_RIV_001_CP001_FLOW_DIRECTION_V2: KnowledgeFact[] = [
  relationFact("narmada-flow-west", "geo:river:narmada", "Narmada", "has_flow_direction", "geo:flow-direction:west", "West-flowing", NCERT_DRAINAGE, PENINSULAR_FLOW_LOCATOR, "geo-riv-flow-direction", ["geo-riv-east-west-flow"]),
  relationFact("tapi-flow-west", "geo:river:tapi", "Tapi", "has_flow_direction", "geo:flow-direction:west", "West-flowing", NCERT_DRAINAGE, PENINSULAR_FLOW_LOCATOR, "geo-riv-flow-direction", ["geo-riv-east-west-flow"]),
  relationFact("mahanadi-flow-east", "geo:river:mahanadi", "Mahanadi", "has_flow_direction", "geo:flow-direction:east", "East-flowing", NCERT_DRAINAGE, PENINSULAR_FLOW_LOCATOR, "geo-riv-flow-direction", ["geo-riv-east-west-flow"]),
  relationFact("godavari-flow-east", "geo:river:godavari", "Godavari", "has_flow_direction", "geo:flow-direction:east", "East-flowing", NCERT_DRAINAGE, PENINSULAR_FLOW_LOCATOR, "geo-riv-flow-direction", ["geo-riv-east-west-flow"]),
  relationFact("krishna-flow-east", "geo:river:krishna", "Krishna", "has_flow_direction", "geo:flow-direction:east", "East-flowing", NCERT_DRAINAGE, PENINSULAR_FLOW_LOCATOR, "geo-riv-flow-direction", ["geo-riv-east-west-flow"]),
  relationFact("kaveri-flow-east", "geo:river:kaveri", "Kaveri", "has_flow_direction", "geo:flow-direction:east", "East-flowing", NCERT_DRAINAGE, PENINSULAR_FLOW_LOCATOR, "geo-riv-flow-direction", ["geo-riv-east-west-flow"]),
];

export const GEO_RIV_001_CP001_OUTFALL_V2: KnowledgeFact[] = [
  relationFact("narmada-outfall-arabian", "geo:river:narmada", "Narmada", "drains_into", "geo:sea:arabian-sea", "Arabian Sea", NCERT_DRAINAGE, PENINSULAR_FLOW_LOCATOR, "geo-riv-drainage-outfall", ["geo-riv-sea-outfalls"]),
  relationFact("tapi-outfall-arabian", "geo:river:tapi", "Tapi", "drains_into", "geo:sea:arabian-sea", "Arabian Sea", NCERT_DRAINAGE, PENINSULAR_FLOW_LOCATOR, "geo-riv-drainage-outfall", ["geo-riv-sea-outfalls"]),
  relationFact("indus-outfall-arabian", "geo:river:indus", "Indus", "drains_into", "geo:sea:arabian-sea", "Arabian Sea", CWC_INDUS, "CWC Indus Basin Organisation — Indus basin course and Arabian Sea outfall", "geo-riv-drainage-outfall", ["geo-riv-sea-outfalls"]),
  relationFact("mahanadi-outfall-bay", "geo:river:mahanadi", "Mahanadi", "drains_into", "geo:bay:bay-of-bengal", "Bay of Bengal", NCERT_DRAINAGE, PENINSULAR_FLOW_LOCATOR, "geo-riv-drainage-outfall", ["geo-riv-sea-outfalls"]),
  relationFact("godavari-outfall-bay", "geo:river:godavari", "Godavari", "drains_into", "geo:bay:bay-of-bengal", "Bay of Bengal", NCERT_DRAINAGE, PENINSULAR_FLOW_LOCATOR, "geo-riv-drainage-outfall", ["geo-riv-sea-outfalls"]),
  relationFact("krishna-outfall-bay", "geo:river:krishna", "Krishna", "drains_into", "geo:bay:bay-of-bengal", "Bay of Bengal", NCERT_DRAINAGE, PENINSULAR_FLOW_LOCATOR, "geo-riv-drainage-outfall", ["geo-riv-sea-outfalls"]),
  relationFact("kaveri-outfall-bay", "geo:river:kaveri", "Kaveri", "drains_into", "geo:bay:bay-of-bengal", "Bay of Bengal", NCERT_DRAINAGE, PENINSULAR_FLOW_LOCATOR, "geo-riv-drainage-outfall", ["geo-riv-sea-outfalls"]),
];

export const GEO_RIV_001_CP001_MOUTH_TYPE_V2: KnowledgeFact[] = [
  relationFact("narmada-mouth-estuary", "geo:river:narmada", "Narmada", "has_mouth_type", "geo:mouth-type:estuary", "Estuary", NCERT_DRAINAGE, PENINSULAR_MOUTH_LOCATOR, "geo-riv-mouth-type", ["geo-riv-delta-estuary"]),
  relationFact("tapi-mouth-estuary", "geo:river:tapi", "Tapi", "has_mouth_type", "geo:mouth-type:estuary", "Estuary", NCERT_DRAINAGE, PENINSULAR_MOUTH_LOCATOR, "geo-riv-mouth-type", ["geo-riv-delta-estuary"]),
  relationFact("mahanadi-mouth-delta", "geo:river:mahanadi", "Mahanadi", "has_mouth_type", "geo:mouth-type:delta", "Delta", NCERT_DRAINAGE, PENINSULAR_MOUTH_LOCATOR, "geo-riv-mouth-type", ["geo-riv-delta-estuary"]),
  relationFact("godavari-mouth-delta", "geo:river:godavari", "Godavari", "has_mouth_type", "geo:mouth-type:delta", "Delta", NCERT_DRAINAGE, PENINSULAR_MOUTH_LOCATOR, "geo-riv-mouth-type", ["geo-riv-delta-estuary"]),
  relationFact("krishna-mouth-delta", "geo:river:krishna", "Krishna", "has_mouth_type", "geo:mouth-type:delta", "Delta", NCERT_DRAINAGE, PENINSULAR_MOUTH_LOCATOR, "geo-riv-mouth-type", ["geo-riv-delta-estuary"]),
  relationFact("kaveri-mouth-delta", "geo:river:kaveri", "Kaveri", "has_mouth_type", "geo:mouth-type:delta", "Delta", NCERT_DRAINAGE, PENINSULAR_MOUTH_LOCATOR, "geo-riv-mouth-type", ["geo-riv-delta-estuary"]),
];

export const GEO_RIV_001_CP001_GROUP_CHARACTERISTICS_V2: KnowledgeFact[] = [
  characteristicFact("himalayan-mostly-perennial", "himalayan", "Himalayan rivers", "mostly-perennial", "Mostly perennial", GROUP_CHARACTER_LOCATOR),
  characteristicFact("peninsular-many-seasonal", "peninsular", "Peninsular rivers", "many-seasonal-rain-fed", "Many are seasonal or strongly rain-fed", GROUP_CHARACTER_LOCATOR),
];

export const GEO_RIV_001_CP001_RELATION_EXPANSION_V2: KnowledgeFact[] = [
  ...GEO_RIV_001_CP001_FLOW_DIRECTION_V2,
  ...GEO_RIV_001_CP001_OUTFALL_V2,
  ...GEO_RIV_001_CP001_MOUTH_TYPE_V2,
  ...GEO_RIV_001_CP001_GROUP_CHARACTERISTICS_V2,
];
