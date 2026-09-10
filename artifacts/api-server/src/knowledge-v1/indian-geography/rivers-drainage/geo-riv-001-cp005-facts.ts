import type { KnowledgeFact, KnowledgeV1Difficulty } from "../../types";
import { toGeoRiv001Cp005FactSource } from "./geo-riv-001-cp005-source-authorities";

const SUBJECT = "Static GK — Indian Geography";
const CHAPTER_ID = "GEO-RIV-001";
const CP_ID = "GEO-RIV-001-CP005";
const EXAM_TAGS = ["SSC", "RAILWAY", "BANKING", "STATE_EXAMS"];

function entityFact(args: {
  id: string;
  river: string;
  relation: string;
  valueId: string;
  value: string;
  sourceId: string;
  locator: string;
  group: string;
  difficulty?: KnowledgeV1Difficulty;
  tags?: string[];
}): KnowledgeFact {
  return {
    factId: `geo-riv-001-cp005-${args.id}`,
    entityId: `geo:river:${args.river.toLowerCase().replaceAll(" ", "-").replaceAll(/[()]/g, "")}`,
    subject: SUBJECT,
    chapterId: CHAPTER_ID,
    cpId: CP_ID,
    relation: args.relation,
    entity: { canonicalName: args.river, label: { en: args.river } },
    value: { kind: "entity_ref", entityId: args.valueId, label: { en: args.value } },
    contextGroupId: args.group,
    distractorGroupIds: [args.group, "geo-riv-east-flowing-peninsular"],
    difficulty: args.difficulty ?? "Easy",
    examTags: EXAM_TAGS,
    tags: ["east-flowing-peninsular", ...(args.tags ?? [])],
    source: toGeoRiv001Cp005FactSource(args.sourceId, args.locator),
    review: { status: "REVIEW_REQUIRED", confidence: 0.97 },
    freshness: { class: "IMMUTABLE", lastVerifiedAt: "2026-09-10" },
  };
}

function textFact(args: {
  id: string;
  river: string;
  relation: string;
  text: string;
  sourceId: string;
  locator: string;
  group: string;
  difficulty?: KnowledgeV1Difficulty;
  tags?: string[];
}): KnowledgeFact {
  return {
    factId: `geo-riv-001-cp005-${args.id}`,
    entityId: `geo:river:${args.river.toLowerCase().replaceAll(" ", "-").replaceAll(/[()]/g, "")}`,
    subject: SUBJECT,
    chapterId: CHAPTER_ID,
    cpId: CP_ID,
    relation: args.relation,
    entity: { canonicalName: args.river, label: { en: args.river } },
    value: { kind: "text", text: { en: args.text } },
    contextGroupId: args.group,
    distractorGroupIds: [args.group, "geo-riv-east-flowing-peninsular"],
    difficulty: args.difficulty ?? "Medium",
    examTags: EXAM_TAGS,
    tags: ["east-flowing-peninsular", ...(args.tags ?? [])],
    source: toGeoRiv001Cp005FactSource(args.sourceId, args.locator),
    review: { status: "REVIEW_REQUIRED", confidence: 0.96 },
    freshness: { class: "IMMUTABLE", lastVerifiedAt: "2026-09-10" },
  };
}

function tributaryFact(args: {
  id: string;
  river: string;
  parent: string;
  bank?: "left bank" | "right bank";
  sourceId: string;
  locator: string;
  difficulty?: KnowledgeV1Difficulty;
}): KnowledgeFact {
  return entityFact({
    id: `${args.id}-${args.parent.toLowerCase()}-tributary`,
    river: args.river,
    relation: args.bank ? `${args.bank.replace(" ", "_")}_tributary_of` : "tributary_of",
    valueId: `geo:river:${args.parent.toLowerCase()}`,
    value: args.parent,
    sourceId: args.sourceId,
    locator: args.locator,
    group: `geo-riv-${args.parent.toLowerCase()}-tributaries`,
    difficulty: args.difficulty ?? "Medium",
    tags: ["tributary", ...(args.bank ? [args.bank.replace(" ", "-")] : [])],
  });
}

const CWC = "CWC-HYDROLOGICAL-DATA-2021";
const GOD = "INDIA-WRIS-GODAVARI-BASIN";
const KRI = "INDIA-WRIS-KRISHNA-BASIN";
const KGBO = "CWC-KGBO-BOOKLET";
const MAH = "CWC-MAHANADI-PMP-ATLAS";
const CAU = "CWC-CAUVERY-PMP-ATLAS";
const ODI = "ODISHA-TOPOGRAPHY-RIVERS";
const DHA = "DHAMTARI-MAHANADI-SOURCE";
const NAS = "NASHIK-GODAVARI-DAKSHIN-GANGA";

export const GEO_RIV_001_CP005_CORE_FACTS: KnowledgeFact[] = [
  entityFact({ id: "godavari-source-trimbakeshwar", river: "Godavari", relation: "originates_near", valueId: "geo:place:trimbakeshwar", value: "Trimbakeshwar", sourceId: NAS, locator: "Godavari Darshan — origin at Brahmagiri/Trimbakeshwar", group: "geo-riv-east-source-places", tags: ["source"] }),
  entityFact({ id: "godavari-source-district", river: "Godavari", relation: "source_district", valueId: "geo:district:nashik", value: "Nashik", sourceId: GOD, locator: "Godavari Basin — rises near Triambak hills in Nashik district", group: "geo-riv-east-source-districts", tags: ["source"] }),
  entityFact({ id: "godavari-source-state", river: "Godavari", relation: "source_state", valueId: "geo:state:maharashtra", value: "Maharashtra", sourceId: GOD, locator: "Godavari Basin — source in Maharashtra", group: "geo-riv-east-source-states", tags: ["source"] }),
  entityFact({ id: "godavari-mouth", river: "Godavari", relation: "drains_into", valueId: "geo:water:bay-of-bengal", value: "Bay of Bengal", sourceId: GOD, locator: "Godavari Basin — drains into Bay of Bengal", group: "geo-riv-east-outfalls", tags: ["mouth"] }),
  entityFact({ id: "godavari-dakshin-ganga", river: "Godavari", relation: "also_known_as", valueId: "geo:river-name:dakshin-ganga", value: "Dakshin Ganga", sourceId: NAS, locator: "Nashik Culture & Heritage — Godavari is also known as Dakshin Ganga", group: "geo-riv-indian-river-nicknames", tags: ["nickname"] }),

  entityFact({ id: "krishna-source-mahabaleshwar", river: "Krishna", relation: "originates_near", valueId: "geo:place:mahabaleshwar", value: "Mahabaleshwar", sourceId: KRI, locator: "Krishna Basin — rises just north of Mahabaleshwar in Western Ghats", group: "geo-riv-east-source-places", tags: ["source"] }),
  entityFact({ id: "krishna-source-state", river: "Krishna", relation: "source_state", valueId: "geo:state:maharashtra", value: "Maharashtra", sourceId: KGBO, locator: "KGBO — Krishna rises in Maharashtra", group: "geo-riv-east-source-states", tags: ["source"] }),
  entityFact({ id: "krishna-mouth", river: "Krishna", relation: "drains_into", valueId: "geo:water:bay-of-bengal", value: "Bay of Bengal", sourceId: KGBO, locator: "KGBO — Krishna flows east and falls into Bay of Bengal downstream of Vijayawada", group: "geo-riv-east-outfalls", tags: ["mouth"] }),

  entityFact({ id: "mahanadi-source-sihawa", river: "Mahanadi", relation: "source_region", valueId: "geo:region:sihawa-hills", value: "Sihawa Hills", sourceId: DHA, locator: "Dhamtari district — Mahanadi originates in the Sihawa hills", group: "geo-riv-east-source-regions", tags: ["source"] }),
  entityFact({ id: "mahanadi-source-state", river: "Mahanadi", relation: "source_state", valueId: "geo:state:chhattisgarh", value: "Chhattisgarh", sourceId: MAH, locator: "Mahanadi Basin — origin in Dhamtari district, Chhattisgarh", group: "geo-riv-east-source-states", tags: ["source"] }),
  entityFact({ id: "mahanadi-mouth", river: "Mahanadi", relation: "drains_into", valueId: "geo:water:bay-of-bengal", value: "Bay of Bengal", sourceId: MAH, locator: "Mahanadi Basin — drains into Bay of Bengal", group: "geo-riv-east-outfalls", tags: ["mouth"] }),

  entityFact({ id: "cauvery-source-talakaveri", river: "Cauvery", relation: "originates_at", valueId: "geo:place:talakaveri", value: "Talakaveri", sourceId: CAU, locator: "Cauvery Basin — rises at Talakaveri", group: "geo-riv-east-source-places", tags: ["source"] }),
  entityFact({ id: "cauvery-source-range", river: "Cauvery", relation: "source_range", valueId: "geo:range:brahmagiri", value: "Brahmagiri Range", sourceId: CAU, locator: "Cauvery Basin — Talakaveri in Brahmagiri range", group: "geo-riv-east-source-ranges", tags: ["source"] }),
  entityFact({ id: "cauvery-source-state", river: "Cauvery", relation: "source_state", valueId: "geo:state:karnataka", value: "Karnataka", sourceId: CAU, locator: "Cauvery Basin — source in Kodagu district, Karnataka", group: "geo-riv-east-source-states", tags: ["source"] }),
  entityFact({ id: "cauvery-mouth", river: "Cauvery", relation: "drains_into", valueId: "geo:water:bay-of-bengal", value: "Bay of Bengal", sourceId: CAU, locator: "Cauvery Basin — drains into Bay of Bengal", group: "geo-riv-east-outfalls", tags: ["mouth"] }),
  entityFact({ id: "cauvery-alias-kaveri", river: "Cauvery", relation: "also_spelled", valueId: "geo:river-name:kaveri", value: "Kaveri", sourceId: CAU, locator: "Cauvery basin authority; Kaveri is accepted alternate spelling in Indian exam usage", group: "geo-riv-indian-river-aliases", tags: ["alias"] }),

  entityFact({ id: "pennar-source-hill", river: "Pennar", relation: "originates_at", valueId: "geo:hill:chenna-kasava", value: "Chenna Kasava Hill", sourceId: CAU, locator: "Pennar Basin — rises in Chenna Kasava hill", group: "geo-riv-east-source-places", tags: ["source"] }),
  entityFact({ id: "pennar-source-range", river: "Pennar", relation: "source_range", valueId: "geo:range:nandidurg", value: "Nandidurg Range", sourceId: CAU, locator: "Pennar Basin — source in Nandidurg range", group: "geo-riv-east-source-ranges", tags: ["source"] }),
  entityFact({ id: "pennar-source-state", river: "Pennar", relation: "source_state", valueId: "geo:state:karnataka", value: "Karnataka", sourceId: CAU, locator: "Pennar Basin — source in Karnataka", group: "geo-riv-east-source-states", tags: ["source"] }),
  entityFact({ id: "pennar-mouth", river: "Pennar", relation: "drains_into", valueId: "geo:water:bay-of-bengal", value: "Bay of Bengal", sourceId: CAU, locator: "Pennar Basin — east-flowing to Bay of Bengal", group: "geo-riv-east-outfalls", tags: ["mouth"] }),

  textFact({ id: "brahmani-formed-sankh-koel", river: "Brahmani", relation: "formed_by", text: "Sankh + Koel", sourceId: ODI, locator: "Odisha topography — Sankh and Koel meet near Vedavyas/Rourkela to form Brahmani", group: "geo-riv-east-formations", difficulty: "Medium", tags: ["formation"] }),
  entityFact({ id: "brahmani-upper-south-koel", river: "Brahmani", relation: "upper_reach_name", valueId: "geo:river:south-koel", value: "South Koel", sourceId: CWC, locator: "Hydrological Data Book — Brahmani is known as South Koel in upper reaches", group: "geo-riv-east-upper-reach-names", difficulty: "Medium", tags: ["course"] }),
  entityFact({ id: "brahmani-mouth", river: "Brahmani", relation: "drains_into", valueId: "geo:water:bay-of-bengal", value: "Bay of Bengal", sourceId: MAH, locator: "Mahanadi adjoining basins — Brahmani drains to Bay of Bengal", group: "geo-riv-east-outfalls", tags: ["mouth"] }),

  entityFact({ id: "baitarani-source", river: "Baitarani", relation: "source_region", valueId: "geo:region:keonjhar-hills", value: "Keonjhar Hills", sourceId: ODI, locator: "Odisha topography — Baitarani originates in Gonasika hills of Keonjhar", group: "geo-riv-east-source-regions", tags: ["source"] }),
  entityFact({ id: "baitarani-mouth", river: "Baitarani", relation: "drains_into", valueId: "geo:water:bay-of-bengal", value: "Bay of Bengal", sourceId: MAH, locator: "Mahanadi adjoining basins — Baitarani drains to Bay of Bengal", group: "geo-riv-east-outfalls", tags: ["mouth"] }),

  entityFact({ id: "subarnarekha-source", river: "Subarnarekha", relation: "originates_near", valueId: "geo:place:nagri-ranchi", value: "Nagri near Ranchi", sourceId: MAH, locator: "Subarnarekha basin — originates near Nagri village in Ranchi district", group: "geo-riv-east-source-places", tags: ["source"] }),
  entityFact({ id: "subarnarekha-mouth", river: "Subarnarekha", relation: "drains_into", valueId: "geo:water:bay-of-bengal", value: "Bay of Bengal", sourceId: MAH, locator: "Subarnarekha basin — drains into Bay of Bengal", group: "geo-riv-east-outfalls", tags: ["mouth"] }),
];

const tributaryRows: Array<[string, string, string, "left bank" | "right bank" | undefined, string, string]> = [
  ["pravara", "Pravara", "Godavari", "right bank", GOD, "Godavari Basin — Pravara is a right-bank tributary"],
  ["manjira", "Manjira", "Godavari", "right bank", GOD, "Godavari Basin — Manjra/Manjira is a right-bank tributary"],
  ["darna", "Darna", "Godavari", "right bank", GOD, "Godavari Basin — Darna is a right-bank tributary"],
  ["purna", "Purna", "Godavari", "left bank", GOD, "Godavari Basin — Purna is a left-bank tributary"],
  ["pranhita", "Pranhita", "Godavari", "left bank", GOD, "Godavari Basin — Pranhita is a left-bank tributary"],
  ["indravati", "Indravati", "Godavari", "left bank", GOD, "Godavari Basin — Indravati is a left-bank tributary"],
  ["sabari", "Sabari", "Godavari", "left bank", GOD, "Godavari Basin — Sabari is a left-bank tributary"],

  ["ghataprabha", "Ghataprabha", "Krishna", "right bank", KGBO, "KGBO — Ghataprabha is a principal right-bank tributary"],
  ["malaprabha", "Malaprabha", "Krishna", "right bank", KGBO, "KGBO — Malaprabha is a principal right-bank tributary"],
  ["tungabhadra", "Tungabhadra", "Krishna", "right bank", KGBO, "KGBO — Tungabhadra is a principal right-bank tributary"],
  ["bhima", "Bhima", "Krishna", "left bank", KGBO, "KGBO — Bhima is a principal left-bank tributary"],
  ["musi", "Musi", "Krishna", "left bank", KGBO, "KGBO — Musi is a principal left-bank tributary"],
  ["munneru", "Munneru", "Krishna", "left bank", KGBO, "KGBO — Munneru is a principal left-bank tributary"],

  ["seonath", "Seonath", "Mahanadi", "left bank", MAH, "Mahanadi Basin — Seonath is a left-bank tributary"],
  ["hasdeo", "Hasdeo", "Mahanadi", "left bank", MAH, "Mahanadi Basin — Hasdeo is a left-bank tributary"],
  ["mand", "Mand", "Mahanadi", "left bank", MAH, "Mahanadi Basin — Mand is a left-bank tributary"],
  ["ib", "Ib", "Mahanadi", "left bank", MAH, "Mahanadi Basin — Ib is a left-bank tributary"],
  ["ong", "Ong", "Mahanadi", "right bank", MAH, "Mahanadi Basin — Ong is a right-bank tributary"],
  ["tel", "Tel", "Mahanadi", "right bank", MAH, "Mahanadi Basin — Tel is a right-bank tributary"],
  ["jonk", "Jonk", "Mahanadi", "right bank", MAH, "Mahanadi Basin — Jonk is a right-bank tributary"],

  ["harangi", "Harangi", "Cauvery", "left bank", CAU, "Cauvery Basin — Harangi is a left-bank tributary"],
  ["hemavati", "Hemavati", "Cauvery", "left bank", CAU, "Cauvery Basin — Hemavati is a left-bank tributary"],
  ["shimsha", "Shimsha", "Cauvery", "left bank", CAU, "Cauvery Basin — Shimsha is a left-bank tributary"],
  ["arkavati", "Arkavati", "Cauvery", "left bank", CAU, "Cauvery Basin — Arkavati is a left-bank tributary"],
  ["lakshmantirtha", "Lakshmantirtha", "Cauvery", "right bank", CAU, "Cauvery Basin — Lakshmantirtha is a right-bank tributary"],
  ["kabini", "Kabini", "Cauvery", "right bank", CAU, "Cauvery Basin — Kabini is a right-bank tributary"],
  ["suvarnavati", "Suvarnavati", "Cauvery", "right bank", CAU, "Cauvery Basin — Suvarnavati is a right-bank tributary"],
  ["bhavani", "Bhavani", "Cauvery", "right bank", CAU, "Cauvery Basin — Bhavani is a right-bank tributary"],
  ["noyyal", "Noyyal", "Cauvery", "right bank", CAU, "Cauvery Basin — Noyyal is a right-bank tributary"],
  ["amaravati", "Amaravati", "Cauvery", "right bank", CAU, "Cauvery Basin — Amaravati is a right-bank tributary"],

  ["jayamangali", "Jayamangali", "Pennar", "left bank", CAU, "Pennar Basin — Jayamangali is a left-bank tributary"],
  ["kunderu", "Kunderu", "Pennar", "left bank", CAU, "Pennar Basin — Kunderu is a left-bank tributary"],
  ["sagileru", "Sagileru", "Pennar", "left bank", CAU, "Pennar Basin — Sagileru is a left-bank tributary"],
  ["chitravati", "Chitravati", "Pennar", "right bank", CAU, "Pennar Basin — Chitravati is a right-bank tributary"],
  ["papagni", "Papagni", "Pennar", "right bank", CAU, "Pennar Basin — Papagni is a right-bank tributary"],
  ["cheyyeru", "Cheyyeru", "Pennar", "right bank", CAU, "Pennar Basin — Cheyyeru is a right-bank tributary"],

  ["salandi", "Salandi", "Baitarani", undefined, CWC, "Hydrological Data Book — Salandi is a principal tributary of Baitarani"],
  ["matai", "Matai", "Baitarani", undefined, CWC, "Hydrological Data Book — Matai is a principal tributary of Baitarani"],
  ["kanchi", "Kanchi", "Subarnarekha", undefined, MAH, "Subarnarekha basin — Kanchi is a principal tributary"],
  ["kharkai", "Kharkai", "Subarnarekha", undefined, MAH, "Subarnarekha basin — Kharkai is a principal tributary"],
  ["karkari", "Karkari", "Subarnarekha", undefined, MAH, "Subarnarekha basin — Karkari is a principal tributary"],
];

export const GEO_RIV_001_CP005_TRIBUTARY_FACTS: KnowledgeFact[] = tributaryRows.map(
  ([id, river, parent, bank, sourceId, locator]) => tributaryFact({ id, river, parent, bank, sourceId, locator }),
);

export const GEO_RIV_001_CP005_HIERARCHY_FACTS: KnowledgeFact[] = [
  tributaryFact({ id: "wardha", river: "Wardha", parent: "Pranhita", sourceId: CWC, locator: "Hydrological Data Book — Wardha and Wainganga combine to form/contribute to Pranhita", difficulty: "Hard" }),
  tributaryFact({ id: "wainganga", river: "Wainganga", parent: "Pranhita", sourceId: CWC, locator: "Hydrological Data Book — Wainganga after meeting Wardha is called Pranhita", difficulty: "Hard" }),
  textFact({ id: "tungabhadra-formed-tunga-bhadra", river: "Tungabhadra", relation: "formed_by", text: "Tunga + Bhadra", sourceId: KRI, locator: "Krishna Basin — Tungabhadra is formed by Tunga and Bhadra", group: "geo-riv-east-formations", difficulty: "Hard", tags: ["formation"] }),
];

export const GEO_RIV_001_CP005_FACTS: KnowledgeFact[] = [
  ...GEO_RIV_001_CP005_CORE_FACTS,
  ...GEO_RIV_001_CP005_TRIBUTARY_FACTS,
  ...GEO_RIV_001_CP005_HIERARCHY_FACTS,
];
