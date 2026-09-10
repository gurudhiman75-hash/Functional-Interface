import type { KnowledgeFact, KnowledgeV1Difficulty } from "../../types";
import { toGeoRiv001Cp004FactSource } from "./geo-riv-001-cp004-source-authorities";

const SUBJECT = "Static GK — Indian Geography";
const CHAPTER_ID = "GEO-RIV-001";
const CP_ID = "GEO-RIV-001-CP004";
const EXAM_TAGS = ["SSC", "RAILWAY", "BANKING", "STATE_EXAMS", "UPSC"];

const WRA = "CWC-BRAHMAPUTRA-WRA-2024";
const PMP = "CWC-BRAHMAPUTRA-PMP-ATLAS";
const MORPH = "CWC-BRAHMAPUTRA-MORPHOLOGY";
const SIANG = "CWC-SIANG-CUMULATIVE-IMPACT";
const JAMUNA = "CWC-BANGLADESH-JAMUNA";
const ASSAM = "ASSAM-WR-BRAHMAPUTRA-SYSTEM";
const NCERT = "NCERT-NORTH-EAST-INDIA";

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
    factId: `geo-riv-001-cp004-${args.id}`,
    entityId: args.entityId,
    subject: SUBJECT,
    chapterId: CHAPTER_ID,
    cpId: CP_ID,
    relation: args.relation,
    entity: { canonicalName: args.entityLabel, label: { en: args.entityLabel } },
    value: { kind: "entity_ref", entityId: args.valueId, label: { en: args.valueLabel } },
    contextGroupId: args.contextGroupId,
    distractorGroupIds: args.distractorGroupIds,
    difficulty: args.difficulty ?? "Easy",
    examTags: EXAM_TAGS,
    tags: ["brahmaputra-system", ...args.tags],
    source: toGeoRiv001Cp004FactSource(args.sourceId, args.locator),
    review: { status: "REVIEW_REQUIRED", confidence: 0.97 },
    freshness: { class: "IMMUTABLE", lastVerifiedAt: "2026-09-10" },
  };
}

function textFact(args: {
  id: string;
  entityId: string;
  entityLabel: string;
  relation: string;
  text: string;
  contextGroupId: string;
  distractorGroupIds: string[];
  sourceId: string;
  locator: string;
  difficulty?: KnowledgeV1Difficulty;
  tags: string[];
}): KnowledgeFact {
  return {
    factId: `geo-riv-001-cp004-${args.id}`,
    entityId: args.entityId,
    subject: SUBJECT,
    chapterId: CHAPTER_ID,
    cpId: CP_ID,
    relation: args.relation,
    entity: { canonicalName: args.entityLabel, label: { en: args.entityLabel } },
    value: { kind: "text", text: { en: args.text } },
    contextGroupId: args.contextGroupId,
    distractorGroupIds: args.distractorGroupIds,
    difficulty: args.difficulty ?? "Medium",
    examTags: EXAM_TAGS,
    tags: ["brahmaputra-system", ...args.tags],
    source: toGeoRiv001Cp004FactSource(args.sourceId, args.locator),
    review: { status: "REVIEW_REQUIRED", confidence: 0.96 },
    freshness: { class: "IMMUTABLE", lastVerifiedAt: "2026-09-10" },
  };
}

function tributaryFact(args: {
  id: string;
  river: string;
  parentId?: string;
  parent?: string;
  sourceId?: string;
  locator: string;
  difficulty?: KnowledgeV1Difficulty;
  relation?: string;
}): KnowledgeFact {
  const parentId = args.parentId ?? "brahmaputra";
  const parent = args.parent ?? "Brahmaputra";
  return entityFact({
    id: `${args.id}-${parentId}`,
    entityId: `geo:river:${args.id}`,
    entityLabel: args.river,
    relation: args.relation ?? "tributary_of",
    valueId: `geo:river:${parentId}`,
    valueLabel: parent,
    contextGroupId: `geo-riv-${parentId}-tributaries`,
    distractorGroupIds: [`geo-riv-${parentId}-tributaries`, "geo-riv-brahmaputra-river-entities"],
    sourceId: args.sourceId ?? WRA,
    locator: args.locator,
    difficulty: args.difficulty ?? "Easy",
    tags: ["tributary", parentId],
  });
}

function bankFact(id: string, river: string, bank: "north bank" | "south bank", sourceId: string, locator: string): KnowledgeFact {
  return textFact({
    id: `${id}-brahmaputra-bank`,
    entityId: `geo:river:${id}`,
    entityLabel: river,
    relation: "brahmaputra_bank_side",
    text: bank,
    contextGroupId: "geo-riv-brahmaputra-bank-side",
    distractorGroupIds: ["geo-riv-brahmaputra-bank-side"],
    sourceId,
    locator,
    difficulty: "Medium",
    tags: ["bank-side", bank.replace(" ", "-")],
  });
}

export const GEO_RIV_001_CP004_MAIN_COURSE_FACTS: KnowledgeFact[] = [
  entityFact({ id: "brahmaputra-origin-glacier", entityId: "geo:river:brahmaputra", entityLabel: "Brahmaputra", relation: "originates_from", valueId: "geo:glacier:chema-yundung", valueLabel: "Chema Yundung Glacier", contextGroupId: "geo-riv-brahmaputra-source", distractorGroupIds: ["geo-riv-himalayan-glaciers"], sourceId: PMP, locator: "Brahmaputra basin overview — mainstream originates from Chema Yundung glacier on the Tibetan Plateau", tags: ["source", "glacier"] }),
  entityFact({ id: "brahmaputra-source-region", entityId: "geo:river:brahmaputra", entityLabel: "Brahmaputra", relation: "source_region", valueId: "geo:region:kailash-ranges", valueLabel: "Kailash ranges of the Himalayas", contextGroupId: "geo-riv-brahmaputra-source-regions", distractorGroupIds: ["geo-riv-himalayan-source-regions"], sourceId: WRA, locator: "Brahmaputra Basin — river originates in the Kailash ranges of the Himalayas", difficulty: "Medium", tags: ["source", "region"] }),
  entityFact({ id: "brahmaputra-tibet-name-tsangpo", entityId: "geo:river:brahmaputra", entityLabel: "Brahmaputra", relation: "known_as_in_tibet", valueId: "geo:river-name:tsangpo", valueLabel: "Tsangpo", contextGroupId: "geo-riv-brahmaputra-aliases", distractorGroupIds: ["geo-riv-asian-river-aliases"], sourceId: PMP, locator: "Brahmaputra basin overview — in Tibet the river is known as Tsangpo", tags: ["alias", "tibet"] }),
  entityFact({ id: "brahmaputra-tibet-name-yarlung", entityId: "geo:river:brahmaputra", entityLabel: "Brahmaputra", relation: "also_known_as_in_tibet", valueId: "geo:river-name:yarlung-tsangpo", valueLabel: "Yarlung Tsangpo", contextGroupId: "geo-riv-brahmaputra-aliases", distractorGroupIds: ["geo-riv-asian-river-aliases"], sourceId: NCERT, locator: "North East India — river flows eastwards across Tibet as Yarlung Tsangpo", difficulty: "Medium", tags: ["alias", "tibet"] }),
  entityFact({ id: "brahmaputra-enters-india-arunachal", entityId: "geo:river:brahmaputra", entityLabel: "Brahmaputra", relation: "enters_india_in", valueId: "geo:state:arunachal-pradesh", valueLabel: "Arunachal Pradesh", contextGroupId: "geo-riv-brahmaputra-course-states", distractorGroupIds: ["geo-india-northeast-states"], sourceId: WRA, locator: "Brahmaputra Basin — after Tibet the river enters India through Arunachal Pradesh", tags: ["course", "arunachal-pradesh"] }),
  entityFact({ id: "brahmaputra-india-name-siang", entityId: "geo:river:brahmaputra", entityLabel: "Brahmaputra", relation: "known_as_in_arunachal", valueId: "geo:river-name:siang", valueLabel: "Siang", contextGroupId: "geo-riv-brahmaputra-aliases", distractorGroupIds: ["geo-riv-indian-river-aliases"], sourceId: WRA, locator: "Brahmaputra Basin — in Arunachal Pradesh the river is called Siang", tags: ["alias", "arunachal-pradesh"] }),
  entityFact({ id: "brahmaputra-india-name-dihang", entityId: "geo:river:brahmaputra", entityLabel: "Brahmaputra", relation: "also_known_as_upper_india", valueId: "geo:river-name:dihang", valueLabel: "Dihang", contextGroupId: "geo-riv-brahmaputra-aliases", distractorGroupIds: ["geo-riv-indian-river-aliases"], sourceId: SIANG, locator: "Siang report — in Arunachal Pradesh the Siang is also known as the Dihang", difficulty: "Medium", tags: ["alias", "dihang"] }),
  entityFact({ id: "dibang-joins-siang", entityId: "geo:river:dibang", entityLabel: "Dibang", relation: "joins_mainstream", valueId: "geo:river:siang-dihang", valueLabel: "Siang/Dihang", contextGroupId: "geo-riv-brahmaputra-formation", distractorGroupIds: ["geo-riv-brahmaputra-river-entities"], sourceId: SIANG, locator: "Siang report — Siang/Dihang is joined by Dibang and Lohit before being known as Brahmaputra", difficulty: "Medium", tags: ["confluence", "dibang"] }),
  entityFact({ id: "lohit-joins-siang", entityId: "geo:river:lohit", entityLabel: "Lohit", relation: "joins_mainstream", valueId: "geo:river:siang-dihang", valueLabel: "Siang/Dihang", contextGroupId: "geo-riv-brahmaputra-formation", distractorGroupIds: ["geo-riv-brahmaputra-river-entities"], sourceId: SIANG, locator: "Siang report — Siang/Dihang is joined by Dibang and Lohit before being known as Brahmaputra", difficulty: "Medium", tags: ["confluence", "lohit"] }),
  textFact({ id: "brahmaputra-name-after-confluence", entityId: "geo:river:brahmaputra", entityLabel: "Brahmaputra", relation: "name_transition", text: "Siang/Dihang + Dibang + Lohit → Brahmaputra", contextGroupId: "geo-riv-brahmaputra-formation", distractorGroupIds: ["geo-riv-brahmaputra-relation-chains"], sourceId: SIANG, locator: "Siang report — after Lohit and Dibang join Siang/Dihang, the river is known as Brahmaputra", difficulty: "Medium", tags: ["confluence", "name-transition"] }),
  entityFact({ id: "brahmaputra-assam-valley", entityId: "geo:river:brahmaputra", entityLabel: "Brahmaputra", relation: "major_valley_course", valueId: "geo:region:assam-valley", valueLabel: "Assam Valley", contextGroupId: "geo-riv-brahmaputra-course-regions", distractorGroupIds: ["geo-india-physical-regions"], sourceId: PMP, locator: "Brahmaputra basin overview — flows through the alluvial plains of Assam valley", tags: ["course", "assam"] }),
  entityFact({ id: "brahmaputra-bangladesh-name-jamuna", entityId: "geo:river:brahmaputra", entityLabel: "Brahmaputra", relation: "known_as_in_bangladesh", valueId: "geo:river-name:jamuna", valueLabel: "Jamuna", contextGroupId: "geo-riv-brahmaputra-aliases", distractorGroupIds: ["geo-riv-south-asia-river-aliases"], sourceId: JAMUNA, locator: "Lower Ganga report — Brahmaputra is locally called Jamuna in Bangladesh", difficulty: "Medium", tags: ["alias", "bangladesh"] }),
];

export const GEO_RIV_001_CP004_MAJOR_TRIBUTARY_FACTS: KnowledgeFact[] = [
  tributaryFact({ id: "dibang", river: "Dibang", sourceId: WRA, locator: "Brahmaputra Basin — Dibang listed among principal tributaries" }),
  tributaryFact({ id: "lohit", river: "Lohit", sourceId: WRA, locator: "Brahmaputra Basin — Lohit listed among principal tributaries" }),
  tributaryFact({ id: "subansiri", river: "Subansiri", sourceId: WRA, locator: "Brahmaputra Basin — Subansiri listed among principal tributaries" }),
  tributaryFact({ id: "jia-bharali", river: "Jia Bharali", sourceId: WRA, locator: "Brahmaputra Basin — Jiabharali listed among principal tributaries", difficulty: "Medium" }),
  tributaryFact({ id: "manas", river: "Manas", sourceId: WRA, locator: "Brahmaputra Basin — Manas listed among principal tributaries" }),
  tributaryFact({ id: "sankosh", river: "Sankosh", sourceId: WRA, locator: "Brahmaputra Basin — Sankosh listed among principal tributaries", difficulty: "Medium" }),
  tributaryFact({ id: "teesta", river: "Teesta", sourceId: PMP, locator: "Brahmaputra basin overview — Teesta listed as a major tributary and joins in Bangladesh", difficulty: "Medium", relation: "tributary_of_brahmaputra_system" }),
  tributaryFact({ id: "burhi-dihing", river: "Burhi Dihing", sourceId: WRA, locator: "Brahmaputra Basin — Burhidihing listed among principal tributaries", difficulty: "Medium" }),
  tributaryFact({ id: "disang", river: "Disang", sourceId: WRA, locator: "Brahmaputra Basin — Disang listed among principal tributaries", difficulty: "Medium" }),
  tributaryFact({ id: "dikhow", river: "Dikhow", sourceId: WRA, locator: "Brahmaputra Basin — Dikhow listed among principal tributaries", difficulty: "Medium" }),
  tributaryFact({ id: "dhansiri-south", river: "Dhansiri (South)", sourceId: WRA, locator: "Brahmaputra Basin — Dhansiri listed among principal tributaries", difficulty: "Medium" }),
  tributaryFact({ id: "kopili", river: "Kopili", sourceId: WRA, locator: "Brahmaputra Basin — Kopili listed among principal tributaries", difficulty: "Medium" }),
];

export const GEO_RIV_001_CP004_BANK_FACTS: KnowledgeFact[] = [
  bankFact("subansiri", "Subansiri", "north bank", ASSAM, "Assam Water Resources — Subansiri listed among main north-bank tributaries"),
  bankFact("jia-bharali", "Jia Bharali", "north bank", ASSAM, "Assam Water Resources — Jiabharali listed among main north-bank tributaries"),
  bankFact("manas", "Manas", "north bank", ASSAM, "Assam Water Resources — Manas listed among main north-bank tributaries"),
  bankFact("sankosh", "Sankosh", "north bank", ASSAM, "Assam Water Resources — Sonkosh listed among main north-bank tributaries"),
  bankFact("puthimari", "Puthimari", "north bank", ASSAM, "Assam Water Resources — Puthimari listed among main north-bank tributaries"),
  bankFact("burhi-dihing", "Burhi Dihing", "south bank", ASSAM, "Assam Water Resources — Buridehing listed among main south-bank tributaries"),
  bankFact("disang", "Disang", "south bank", ASSAM, "Assam Water Resources — Desang listed among main south-bank tributaries"),
  bankFact("dikhow", "Dikhow", "south bank", ASSAM, "Assam Water Resources — Dikhow listed among main south-bank tributaries"),
  bankFact("dhansiri-south", "Dhansiri (South)", "south bank", ASSAM, "Assam Water Resources — Dhansiri (South) listed among main south-bank tributaries"),
  bankFact("kopili", "Kopili", "south bank", ASSAM, "Assam Water Resources — Kopili listed among main south-bank tributaries"),
];

export const GEO_RIV_001_CP004_SUBSYSTEM_FACTS: KnowledgeFact[] = [
  entityFact({ id: "subansiri-source-tibet", entityId: "geo:river:subansiri", entityLabel: "Subansiri", relation: "rises_in", valueId: "geo:region:tibet", valueLabel: "Tibet", contextGroupId: "geo-riv-brahmaputra-tributary-sources", distractorGroupIds: ["geo-asia-regions"], sourceId: "CWC-SIANG-CUMULATIVE-IMPACT", locator: "Subansiri report — Subansiri originates in Tibet", difficulty: "Medium", tags: ["subansiri", "source"] }),
  tributaryFact({ id: "ranganadi", river: "Ranganadi", parentId: "subansiri", parent: "Subansiri", sourceId: MORPH, locator: "Brahmaputra Morphology Report — Ranganadi is a major tributary of Subansiri", difficulty: "Hard" }),
  tributaryFact({ id: "dikrong", river: "Dikrong", parentId: "subansiri", parent: "Subansiri", sourceId: MORPH, locator: "Brahmaputra Morphology Report — Dikrong is a major tributary of Subansiri", difficulty: "Hard" }),
  tributaryFact({ id: "jiadhol", river: "Jiadhol", parentId: "subansiri", parent: "Subansiri", sourceId: MORPH, locator: "Brahmaputra Morphology Report — Jiadhol is a major tributary of Subansiri", difficulty: "Hard" }),
  entityFact({ id: "kameng-jia-bharali", entityId: "geo:river:kameng", entityLabel: "Kameng", relation: "also_known_as", valueId: "geo:river:jia-bharali", valueLabel: "Jia Bharali", contextGroupId: "geo-riv-brahmaputra-aliases", distractorGroupIds: ["geo-riv-indian-river-aliases"], sourceId: SIANG, locator: "Siang report — Kameng (Jia Bhareli) listed among Himalayan tributaries", difficulty: "Medium", tags: ["kameng", "alias"] }),
  textFact({ id: "trans-himalayan-north-bank-trio", entityId: "geo:river:brahmaputra", entityLabel: "Brahmaputra", relation: "trans_himalayan_north_bank_tributaries", text: "Subansiri, Jia Bharali and Manas", contextGroupId: "geo-riv-brahmaputra-trans-himalayan", distractorGroupIds: ["geo-riv-brahmaputra-tributary-groups"], sourceId: MORPH, locator: "Brahmaputra Morphology Report — three trans-Himalayan north-bank tributaries are Subansiri, Jia-Bharali and Manas", difficulty: "Hard", tags: ["trans-himalayan", "north-bank"] }),
  entityFact({ id: "teesta-source-sikkim", entityId: "geo:river:teesta", entityLabel: "Teesta", relation: "rises_in", valueId: "geo:state:sikkim", valueLabel: "Sikkim", contextGroupId: "geo-riv-brahmaputra-tributary-sources", distractorGroupIds: ["geo-india-northeast-states"], sourceId: PMP, locator: "Brahmaputra basin overview — Teesta rises in Sikkim", difficulty: "Medium", tags: ["teesta", "source"] }),
  entityFact({ id: "teesta-joins-bangladesh", entityId: "geo:river:teesta", entityLabel: "Teesta", relation: "joins_brahmaputra_system_in", valueId: "geo:country:bangladesh", valueLabel: "Bangladesh", contextGroupId: "geo-riv-brahmaputra-lower-course", distractorGroupIds: ["geo-south-asia-countries"], sourceId: PMP, locator: "Brahmaputra basin overview — Teesta joins Brahmaputra near Rangpur in Bangladesh", difficulty: "Medium", tags: ["teesta", "bangladesh"] }),
  textFact({ id: "brahmaputra-india-basin-states", entityId: "geo:basin:brahmaputra", entityLabel: "Brahmaputra basin in India", relation: "spreads_over_states", text: "Arunachal Pradesh, Assam, West Bengal, Meghalaya, Nagaland and Sikkim", contextGroupId: "geo-riv-brahmaputra-basin-states", distractorGroupIds: ["geo-india-state-groups"], sourceId: WRA, locator: "Water Resources Assessment 2024 — Indian Brahmaputra basin state distribution", difficulty: "Hard", tags: ["basin", "states"] }),
  textFact({ id: "brahmaputra-transboundary-countries", entityId: "geo:river:brahmaputra", entityLabel: "Brahmaputra", relation: "transboundary_course", text: "Tibet (China), India and Bangladesh", contextGroupId: "geo-riv-brahmaputra-countries", distractorGroupIds: ["geo-south-asia-country-groups"], sourceId: PMP, locator: "Brahmaputra basin overview — basin/course extends through China, India and Bangladesh", difficulty: "Medium", tags: ["transboundary", "countries"] }),
  textFact({ id: "brahmaputra-braided-assam", entityId: "geo:river:brahmaputra", entityLabel: "Brahmaputra", relation: "channel_character_in_assam", text: "braided river with many channels", contextGroupId: "geo-riv-brahmaputra-character", distractorGroupIds: ["geo-riv-channel-types"], sourceId: MORPH, locator: "Brahmaputra Morphology Report — river in Assam has a complex braided multi-channel character", difficulty: "Medium", tags: ["braided", "assam"] }),
  entityFact({ id: "kameng-joins-brahmaputra", entityId: "geo:river:kameng", entityLabel: "Kameng", relation: "tributary_of", valueId: "geo:river:brahmaputra", valueLabel: "Brahmaputra", contextGroupId: "geo-riv-brahmaputra-tributaries", distractorGroupIds: ["geo-riv-brahmaputra-river-entities"], sourceId: SIANG, locator: "Siang report — Kameng (Jia Bhareli) listed among Brahmaputra tributaries", difficulty: "Medium", tags: ["kameng", "tributary"] }),
  entityFact({ id: "brahmaputra-bay-system", entityId: "geo:river:brahmaputra", entityLabel: "Brahmaputra", relation: "ultimate_outfall", valueId: "geo:sea:bay-of-bengal", valueLabel: "Bay of Bengal", contextGroupId: "geo-riv-brahmaputra-mouth", distractorGroupIds: ["geo-riv-indian-seas"], sourceId: PMP, locator: "Brahmaputra basin overview — system ultimately drains to the Bay of Bengal", difficulty: "Easy", tags: ["mouth", "bay-of-bengal"] }),
  entityFact({ id: "jamuna-joins-ganga-padma", entityId: "geo:river-name:jamuna", entityLabel: "Jamuna (Brahmaputra in Bangladesh)", relation: "joins", valueId: "geo:river:ganga-padma", valueLabel: "Ganga/Padma", contextGroupId: "geo-riv-brahmaputra-lower-course", distractorGroupIds: ["geo-riv-south-asia-rivers"], sourceId: JAMUNA, locator: "Lower Ganga report — Brahmaputra/Jamuna joins the Ganga/Padma near Goalundo", difficulty: "Hard", tags: ["bangladesh", "confluence"] }),
];

export const GEO_RIV_001_CP004_FACTS_V1: KnowledgeFact[] = [
  ...GEO_RIV_001_CP004_MAIN_COURSE_FACTS,
  ...GEO_RIV_001_CP004_MAJOR_TRIBUTARY_FACTS,
  ...GEO_RIV_001_CP004_BANK_FACTS,
  ...GEO_RIV_001_CP004_SUBSYSTEM_FACTS,
];
