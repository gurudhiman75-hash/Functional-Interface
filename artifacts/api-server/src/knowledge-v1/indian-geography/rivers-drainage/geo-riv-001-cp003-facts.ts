import type { KnowledgeFact, KnowledgeV1Difficulty } from "../../types";
import { toGeoRiv001Cp003FactSource } from "./geo-riv-001-cp003-source-authorities";

const SUBJECT = "Static GK — Indian Geography";
const CHAPTER_ID = "GEO-RIV-001";
const CP_ID = "GEO-RIV-001-CP003";
const EXAM_TAGS = ["SSC", "RAILWAY", "BANKING", "STATE_EXAMS", "UPSC"];

const NMCG_COURSE = "NMCG-COURSE-OF-GANGA";
const NMCG_HYDROLOGY = "NMCG-HYDROLOGY-GANGA-BASIN";
const WRIS_GANGA = "INDIA-WRIS-GANGA-BASIN-V2";
const PRAYAGRAJ = "PRAYAGRAJ-DISTRICT-SANGAM";

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
    factId: `geo-riv-001-cp003-${args.id}`,
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
    tags: ["ganga-system", ...args.tags],
    source: toGeoRiv001Cp003FactSource(args.sourceId, args.locator),
    review: {
      status: "REVIEW_REQUIRED",
      confidence: 0.97,
    },
    freshness: {
      class: "IMMUTABLE",
      lastVerifiedAt: "2026-09-10",
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
  distractorGroupIds: string[];
  sourceId: string;
  locator: string;
  difficulty?: KnowledgeV1Difficulty;
  tags: string[];
}): KnowledgeFact {
  return {
    factId: `geo-riv-001-cp003-${args.id}`,
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
    difficulty: args.difficulty ?? "Medium",
    examTags: EXAM_TAGS,
    tags: ["ganga-system", ...args.tags],
    source: toGeoRiv001Cp003FactSource(args.sourceId, args.locator),
    review: {
      status: "REVIEW_REQUIRED",
      confidence: 0.96,
    },
    freshness: {
      class: "IMMUTABLE",
      lastVerifiedAt: "2026-09-10",
    },
  };
}

function tributaryFact(args: {
  id: string;
  river: string;
  parentId: string;
  parent: string;
  relation?: "tributary_of" | "principal_tributary_of" | "headstream_of" | "source_stream_of";
  sourceId?: string;
  locator: string;
  difficulty?: KnowledgeV1Difficulty;
}): KnowledgeFact {
  return entityFact({
    id: `${args.id}-${args.parentId}`,
    entityId: `geo:river:${args.id}`,
    entityLabel: args.river,
    relation: args.relation ?? "tributary_of",
    valueId: `geo:river:${args.parentId}`,
    valueLabel: args.parent,
    contextGroupId: `geo-riv-${args.parentId}-tributaries`,
    distractorGroupIds: ["geo-riv-ganga-river-entities", `geo-riv-${args.parentId}-tributaries`],
    sourceId: args.sourceId ?? WRIS_GANGA,
    locator: args.locator,
    difficulty: args.difficulty ?? "Easy",
    tags: ["tributary", args.parentId],
  });
}

function bankFact(id: string, river: string, side: "left bank" | "right bank", locator: string): KnowledgeFact {
  return textFact({
    id: `${id}-ganga-bank`,
    entityId: `geo:river:${id}`,
    entityLabel: river,
    relation: "joins_ganga_from_bank",
    text: side,
    contextGroupId: "geo-riv-ganga-bank-side",
    distractorGroupIds: ["geo-riv-ganga-bank-side"],
    sourceId: WRIS_GANGA,
    locator,
    difficulty: "Medium",
    tags: ["bank-side", side.replace(" ", "-")],
  });
}

export const GEO_RIV_001_CP003_HEADWATER_FACTS: KnowledgeFact[] = [
  tributaryFact({
    id: "bhagirathi",
    river: "Bhagirathi",
    parentId: "ganga",
    parent: "Ganga",
    relation: "source_stream_of",
    sourceId: NMCG_COURSE,
    locator: "Course of Ganga — Bhagirathi is the source stream of Ganga",
  }),
  entityFact({
    id: "bhagirathi-source-gangotri-glacier",
    entityId: "geo:river:bhagirathi",
    entityLabel: "Bhagirathi",
    relation: "originates_from",
    valueId: "geo:glacier:gangotri",
    valueLabel: "Gangotri Glacier",
    contextGroupId: "geo-riv-ganga-source-features",
    distractorGroupIds: ["geo-riv-himalayan-glaciers"],
    sourceId: NMCG_COURSE,
    locator: "Course of Ganga — Bhagirathi emanates from Gangotri Glacier at Gaumukh",
    tags: ["source", "bhagirathi"],
  }),
  entityFact({
    id: "bhagirathi-source-gaumukh",
    entityId: "geo:river:bhagirathi",
    entityLabel: "Bhagirathi",
    relation: "source_point",
    valueId: "geo:place:gaumukh",
    valueLabel: "Gaumukh",
    contextGroupId: "geo-riv-ganga-source-places",
    distractorGroupIds: ["geo-riv-himalayan-source-places"],
    sourceId: NMCG_COURSE,
    locator: "Course of Ganga — Gangotri Glacier at Gaumukh",
    tags: ["source-point", "bhagirathi"],
  }),
  tributaryFact({
    id: "alaknanda",
    river: "Alaknanda",
    parentId: "ganga",
    parent: "Ganga",
    relation: "headstream_of",
    sourceId: WRIS_GANGA,
    locator: "Ganga Basin Report — Bhagirathi joins Alaknanda at Devprayag to form the Ganga",
    difficulty: "Medium",
  }),
  textFact({
    id: "ganga-formed-bhagirathi-alaknanda",
    entityId: "geo:river:ganga",
    entityLabel: "Ganga",
    relation: "formed_by",
    text: "Bhagirathi and Alaknanda",
    contextGroupId: "geo-riv-ganga-formation",
    distractorGroupIds: ["geo-riv-himalayan-river-pairs"],
    sourceId: NMCG_COURSE,
    locator: "Course of Ganga — at Devprayag Alaknanda joins Bhagirathi and the river acquires the name Ganga",
    tags: ["formation", "devprayag"],
  }),
  entityFact({
    id: "ganga-formed-at-devprayag",
    entityId: "geo:river:ganga",
    entityLabel: "Ganga",
    relation: "formed_at",
    valueId: "geo:place:devprayag",
    valueLabel: "Devprayag",
    contextGroupId: "geo-riv-ganga-confluence-places",
    distractorGroupIds: ["geo-riv-panch-prayag-places"],
    sourceId: NMCG_COURSE,
    locator: "Course of Ganga — Ganga name begins at Devprayag after Alaknanda-Bhagirathi confluence",
    tags: ["formation", "devprayag"],
  }),
  entityFact({
    id: "ganga-enters-plains-haridwar",
    entityId: "geo:river:ganga",
    entityLabel: "Ganga",
    relation: "enters_plains_at",
    valueId: "geo:place:haridwar",
    valueLabel: "Haridwar",
    contextGroupId: "geo-riv-ganga-course-places",
    distractorGroupIds: ["geo-riv-ganga-course-places"],
    sourceId: NMCG_COURSE,
    locator: "Course of Ganga — at Haridwar, Ganga opens to the Gangetic Plains",
    tags: ["course", "plains-entry"],
  }),
  entityFact({
    id: "ganga-drains-bay-of-bengal",
    entityId: "geo:river:ganga",
    entityLabel: "Ganga",
    relation: "drains_into",
    valueId: "geo:sea:bay-of-bengal",
    valueLabel: "Bay of Bengal",
    contextGroupId: "geo-riv-ganga-mouth",
    distractorGroupIds: ["geo-riv-indian-seas"],
    sourceId: NMCG_COURSE,
    locator: "Course of Ganga — Ganga flows into the Bay of Bengal",
    tags: ["mouth", "bay-of-bengal"],
  }),
  entityFact({
    id: "ganga-divides-at-farakka",
    entityId: "geo:river:ganga",
    entityLabel: "Ganga",
    relation: "divides_near",
    valueId: "geo:place:farakka",
    valueLabel: "Farakka",
    contextGroupId: "geo-riv-ganga-lower-course",
    distractorGroupIds: ["geo-riv-ganga-course-places"],
    sourceId: WRIS_GANGA,
    locator: "Ganga Basin Report — Ganga delta starts around Farakka and the river divides into two arms below Farakka",
    difficulty: "Medium",
    tags: ["lower-course", "farakka"],
  }),
  entityFact({
    id: "ganga-left-arm-padma",
    entityId: "geo:river:ganga",
    entityLabel: "Ganga",
    relation: "left_arm_known_as",
    valueId: "geo:river:padma",
    valueLabel: "Padma",
    contextGroupId: "geo-riv-ganga-lower-course",
    distractorGroupIds: ["geo-riv-ganga-lower-course-rivers"],
    sourceId: WRIS_GANGA,
    locator: "Ganga Basin Report — left arm below Farakka is known as the Padma and flows into Bangladesh",
    difficulty: "Medium",
    tags: ["lower-course", "padma"],
  }),
  entityFact({
    id: "ganga-right-arm-bhagirathi",
    entityId: "geo:river:ganga",
    entityLabel: "Ganga",
    relation: "right_arm_known_as",
    valueId: "geo:river:bhagirathi-lower",
    valueLabel: "Bhagirathi",
    contextGroupId: "geo-riv-ganga-lower-course",
    distractorGroupIds: ["geo-riv-ganga-lower-course-rivers"],
    sourceId: WRIS_GANGA,
    locator: "Ganga Basin Report — right arm below Farakka continues south as Bhagirathi and is later known as Hooghly",
    difficulty: "Medium",
    tags: ["lower-course", "bhagirathi-hooghly"],
  }),
];

export const GEO_RIV_001_CP003_PANCH_PRAYAG_FACTS: KnowledgeFact[] = [
  tributaryFact({ id: "dhauliganga", river: "Dhauliganga", parentId: "alaknanda", parent: "Alaknanda", locator: "Ganga Basin Report — Dhauliganga joins Alaknanda at Vishnuprayag", difficulty: "Medium" }),
  entityFact({ id: "dhauliganga-vishnuprayag", entityId: "geo:river:dhauliganga", entityLabel: "Dhauliganga", relation: "joins_river_at", valueId: "geo:place:vishnuprayag", valueLabel: "Vishnuprayag", contextGroupId: "geo-riv-panch-prayag", distractorGroupIds: ["geo-riv-panch-prayag-places"], sourceId: WRIS_GANGA, locator: "Ganga Basin Report — Vishnuprayag, where Dhauliganga joins Alaknanda", difficulty: "Medium", tags: ["panch-prayag", "vishnuprayag"] }),
  tributaryFact({ id: "nandakini", river: "Nandakini", parentId: "alaknanda", parent: "Alaknanda", locator: "Ganga Basin Report — Nandakini joins Alaknanda at Nandprayag", difficulty: "Medium" }),
  entityFact({ id: "nandakini-nandprayag", entityId: "geo:river:nandakini", entityLabel: "Nandakini", relation: "joins_river_at", valueId: "geo:place:nandprayag", valueLabel: "Nandprayag", contextGroupId: "geo-riv-panch-prayag", distractorGroupIds: ["geo-riv-panch-prayag-places"], sourceId: WRIS_GANGA, locator: "Ganga Basin Report — Nandprayag, where Nandakini joins Alaknanda", difficulty: "Medium", tags: ["panch-prayag", "nandprayag"] }),
  tributaryFact({ id: "pindar", river: "Pindar", parentId: "alaknanda", parent: "Alaknanda", locator: "Ganga Basin Report — Pindar joins Alaknanda at Karnaprayag", difficulty: "Medium" }),
  entityFact({ id: "pindar-karnaprayag", entityId: "geo:river:pindar", entityLabel: "Pindar", relation: "joins_river_at", valueId: "geo:place:karnaprayag", valueLabel: "Karnaprayag", contextGroupId: "geo-riv-panch-prayag", distractorGroupIds: ["geo-riv-panch-prayag-places"], sourceId: WRIS_GANGA, locator: "Ganga Basin Report — Karnaprayag, where Pindar joins Alaknanda", difficulty: "Medium", tags: ["panch-prayag", "karnaprayag"] }),
  tributaryFact({ id: "mandakini", river: "Mandakini", parentId: "alaknanda", parent: "Alaknanda", locator: "Ganga Basin Report — Mandakini joins Alaknanda at Rudraprayag", difficulty: "Medium" }),
  entityFact({ id: "mandakini-rudraprayag", entityId: "geo:river:mandakini", entityLabel: "Mandakini", relation: "joins_river_at", valueId: "geo:place:rudraprayag", valueLabel: "Rudraprayag", contextGroupId: "geo-riv-panch-prayag", distractorGroupIds: ["geo-riv-panch-prayag-places"], sourceId: WRIS_GANGA, locator: "Ganga Basin Report — Rudraprayag, where Mandakini joins Alaknanda", difficulty: "Medium", tags: ["panch-prayag", "rudraprayag"] }),
  tributaryFact({ id: "bhagirathi", river: "Bhagirathi", parentId: "alaknanda", parent: "Alaknanda", relation: "tributary_of", sourceId: WRIS_GANGA, locator: "Ganga Basin Report — Bhagirathi joins Alaknanda at Devprayag", difficulty: "Medium" }),
  entityFact({ id: "bhagirathi-devprayag", entityId: "geo:river:bhagirathi", entityLabel: "Bhagirathi", relation: "joins_river_at", valueId: "geo:place:devprayag", valueLabel: "Devprayag", contextGroupId: "geo-riv-panch-prayag", distractorGroupIds: ["geo-riv-panch-prayag-places"], sourceId: WRIS_GANGA, locator: "Ganga Basin Report — Devprayag, where Bhagirathi joins Alaknanda to form Ganga", difficulty: "Medium", tags: ["panch-prayag", "devprayag"] }),
];

export const GEO_RIV_001_CP003_MAJOR_TRIBUTARY_FACTS: KnowledgeFact[] = [
  tributaryFact({ id: "yamuna", river: "Yamuna", parentId: "ganga", parent: "Ganga", relation: "principal_tributary_of", sourceId: NMCG_HYDROLOGY, locator: "Hydrology of Ganga Basin — Yamuna listed among main tributaries contributing major water yield" }),
  tributaryFact({ id: "ramganga", river: "Ramganga", parentId: "ganga", parent: "Ganga", locator: "Ganga Basin Report — Ramganga is the first major tributary joining Ganga" }),
  tributaryFact({ id: "gomti", river: "Gomti", parentId: "ganga", parent: "Ganga", locator: "Ganga Basin Report — Gomti joins Ganga at Audihar" }),
  tributaryFact({ id: "ghaghara", river: "Ghaghara", parentId: "ganga", parent: "Ganga", relation: "principal_tributary_of", sourceId: NMCG_HYDROLOGY, locator: "Hydrology of Ganga Basin — Ghaghara listed among major water-yield tributaries" }),
  tributaryFact({ id: "gandak", river: "Gandak", parentId: "ganga", parent: "Ganga", relation: "principal_tributary_of", locator: "Ganga Basin Report — Gandak listed among principal tributaries and joins Ganga near Patna" }),
  tributaryFact({ id: "kosi", river: "Kosi", parentId: "ganga", parent: "Ganga", relation: "principal_tributary_of", sourceId: NMCG_HYDROLOGY, locator: "Hydrology of Ganga Basin — Kosi listed among major water-yield tributaries" }),
  tributaryFact({ id: "sone", river: "Sone", parentId: "ganga", parent: "Ganga", relation: "principal_tributary_of", sourceId: NMCG_HYDROLOGY, locator: "Hydrology of Ganga Basin — Sone listed among major water-yield tributaries" }),
  bankFact("yamuna", "Yamuna", "right bank", "Ganga Basin Report — Yamuna joins Ganga on its right bank at Allahabad/Prayagraj"),
  bankFact("ramganga", "Ramganga", "left bank", "Ganga Basin Report — Ramganga joins Ganga on its left bank near Kannauj"),
  bankFact("gomti", "Gomti", "left bank", "Ganga Basin Report — Ramganga and Gomti identified as important left-bank tributaries in Uttar Pradesh"),
  bankFact("ghaghara", "Ghaghara", "left bank", "Ganga Basin Report — Ghaghara included with major left-bank tributaries entering from the Himalayan/Nepal side"),
  bankFact("gandak", "Gandak", "left bank", "Ganga Basin Report — Great Gandak listed among major left-bank tributaries in Bihar"),
  bankFact("kosi", "Kosi", "left bank", "Ganga Basin Report — Kosi listed among major left-bank tributaries in Bihar"),
  bankFact("sone", "Sone", "right bank", "Ganga Basin Report — Sone identified as principal right-bank tributary of Ganga"),
];

export const GEO_RIV_001_CP003_YAMUNA_FACTS: KnowledgeFact[] = [
  entityFact({ id: "yamuna-source-yamunotri-glacier", entityId: "geo:river:yamuna", entityLabel: "Yamuna", relation: "originates_from", valueId: "geo:glacier:yamunotri", valueLabel: "Yamunotri Glacier", contextGroupId: "geo-riv-ganga-source-features", distractorGroupIds: ["geo-riv-himalayan-glaciers"], sourceId: WRIS_GANGA, locator: "Ganga Basin Report — Yamuna originates from Yamunotri glacier", tags: ["yamuna", "source"] }),
  entityFact({ id: "yamuna-source-banderpoonch", entityId: "geo:river:yamuna", entityLabel: "Yamuna", relation: "source_region", valueId: "geo:mountain:banderpoonch", valueLabel: "Banderpoonch peaks", contextGroupId: "geo-riv-ganga-source-regions", distractorGroupIds: ["geo-riv-himalayan-source-regions"], sourceId: WRIS_GANGA, locator: "Ganga Basin Report — Yamunotri glacier near Banderpoonch peaks", difficulty: "Medium", tags: ["yamuna", "source-region"] }),
  entityFact({ id: "yamuna-joins-ganga-prayagraj", entityId: "geo:river:yamuna", entityLabel: "Yamuna", relation: "joins_river", valueId: "geo:river:ganga", valueLabel: "Ganga", contextGroupId: "geo-riv-ganga-joining-relations", distractorGroupIds: ["geo-riv-ganga-river-entities"], sourceId: WRIS_GANGA, locator: "Ganga Basin Report — Yamuna joins Ganga at Allahabad (current Prayagraj)", tags: ["yamuna", "confluence"] }),
  entityFact({ id: "yamuna-confluence-prayagraj", entityId: "geo:river:yamuna", entityLabel: "Yamuna", relation: "joins_river_at", valueId: "geo:place:prayagraj", valueLabel: "Prayagraj", contextGroupId: "geo-riv-ganga-confluence-places", distractorGroupIds: ["geo-riv-ganga-course-places"], sourceId: PRAYAGRAJ, locator: "District Prayagraj Geography — Prayagraj stands at the confluence of Ganga and Yamuna", tags: ["yamuna", "prayagraj"] }),
  tributaryFact({ id: "chambal", river: "Chambal", parentId: "yamuna", parent: "Yamuna", locator: "Ganga Basin Report — Chambal listed among important tributaries of Yamuna", difficulty: "Medium" }),
  tributaryFact({ id: "betwa", river: "Betwa", parentId: "yamuna", parent: "Yamuna", locator: "Ganga Basin Report — Betwa listed among important tributaries of Yamuna", difficulty: "Medium" }),
  tributaryFact({ id: "ken", river: "Ken", parentId: "yamuna", parent: "Yamuna", locator: "Ganga Basin Report — Ken listed among important tributaries of Yamuna", difficulty: "Medium" }),
];

export const GEO_RIV_001_CP003_PLAIN_TRIBUTARY_FACTS: KnowledgeFact[] = [
  entityFact({ id: "ramganga-source-lohba", entityId: "geo:river:ramganga", entityLabel: "Ramganga", relation: "source_region", valueId: "geo:place:lohba", valueLabel: "near Lohba village", contextGroupId: "geo-riv-ganga-source-places", distractorGroupIds: ["geo-riv-ganga-source-places"], sourceId: WRIS_GANGA, locator: "Ganga Basin Report — Ramganga rises in lower Himalayas near Lohba village", difficulty: "Medium", tags: ["ramganga", "source"] }),
  entityFact({ id: "ramganga-joins-kannauj", entityId: "geo:river:ramganga", entityLabel: "Ramganga", relation: "joins_river_at", valueId: "geo:place:kannauj", valueLabel: "near Kannauj", contextGroupId: "geo-riv-ganga-confluence-places", distractorGroupIds: ["geo-riv-ganga-confluence-places"], sourceId: WRIS_GANGA, locator: "Ganga Basin Report — Ramganga joins Ganga on left bank near Kannauj", difficulty: "Medium", tags: ["ramganga", "confluence"] }),
  entityFact({ id: "gomti-source-manikot", entityId: "geo:river:gomti", entityLabel: "Gomti", relation: "source_region", valueId: "geo:place:manikot", valueLabel: "near Manikot", contextGroupId: "geo-riv-ganga-source-places", distractorGroupIds: ["geo-riv-ganga-source-places"], sourceId: WRIS_GANGA, locator: "Ganga Basin Report — Gomti originates near Manikot in Pilibhit district", difficulty: "Medium", tags: ["gomti", "source"] }),
  entityFact({ id: "gomti-joins-audihar", entityId: "geo:river:gomti", entityLabel: "Gomti", relation: "joins_river_at", valueId: "geo:place:audihar", valueLabel: "Audihar", contextGroupId: "geo-riv-ganga-confluence-places", distractorGroupIds: ["geo-riv-ganga-confluence-places"], sourceId: WRIS_GANGA, locator: "Ganga Basin Report — Gomti joins Ganga at Audihar in Jaunpur district", difficulty: "Medium", tags: ["gomti", "confluence"] }),
  textFact({ id: "ghaghara-upper-name-karnali", entityId: "geo:river:ghaghara", entityLabel: "Ghaghara", relation: "upper_course_name", text: "Karnali", contextGroupId: "geo-riv-ganga-river-names", distractorGroupIds: ["geo-riv-ganga-river-names"], sourceId: WRIS_GANGA, locator: "Ganga Basin Report — Ghaghara described as Karnali/Kauriala in the upper course", tags: ["ghaghara", "alternate-name"] }),
  entityFact({ id: "ghaghara-joins-chapra", entityId: "geo:river:ghaghara", entityLabel: "Ghaghara", relation: "joins_river_at", valueId: "geo:place:chapra", valueLabel: "near Chapra", contextGroupId: "geo-riv-ganga-confluence-places", distractorGroupIds: ["geo-riv-ganga-confluence-places"], sourceId: WRIS_GANGA, locator: "Ganga Basin Report — Ghaghara meets Ganga at/near Chapra", difficulty: "Medium", tags: ["ghaghara", "confluence"] }),
  textFact({ id: "gandak-name-narayani", entityId: "geo:river:gandak", entityLabel: "Gandak", relation: "also_known_as", text: "Narayani", contextGroupId: "geo-riv-ganga-river-names", distractorGroupIds: ["geo-riv-ganga-river-names"], sourceId: WRIS_GANGA, locator: "Ganga Basin Report — Gandak known as Narayani in the plains", tags: ["gandak", "alternate-name"] }),
  entityFact({ id: "gandak-joins-patna", entityId: "geo:river:gandak", entityLabel: "Gandak", relation: "joins_river_at", valueId: "geo:place:patna", valueLabel: "near Patna", contextGroupId: "geo-riv-ganga-confluence-places", distractorGroupIds: ["geo-riv-ganga-confluence-places"], sourceId: WRIS_GANGA, locator: "Ganga Basin Report — Gandak joins Ganga near Patna", difficulty: "Medium", tags: ["gandak", "confluence"] }),
  textFact({ id: "kosi-formed-three-streams", entityId: "geo:river:kosi", entityLabel: "Kosi", relation: "formed_by", text: "Sun Kosi, Arun Kosi and Tamur Kosi", contextGroupId: "geo-riv-ganga-formation", distractorGroupIds: ["geo-riv-himalayan-river-triples"], sourceId: WRIS_GANGA, locator: "Ganga Basin Report — Kosi formed by Sun Kosi, Arun Kosi and Tamur Kosi", difficulty: "Hard", tags: ["kosi", "formation"] }),
  textFact({ id: "kosi-sorrow-bihar", entityId: "geo:river:kosi", entityLabel: "Kosi", relation: "known_as", text: "Sorrow of Bihar", contextGroupId: "geo-riv-ganga-river-names", distractorGroupIds: ["geo-riv-indian-river-epithets"], sourceId: WRIS_GANGA, locator: "Ganga Basin Report — Kosi is also called the Sorrow of Bihar", difficulty: "Easy", tags: ["kosi", "epithet"] }),
  entityFact({ id: "kosi-joins-manihari", entityId: "geo:river:kosi", entityLabel: "Kosi", relation: "joins_river_at", valueId: "geo:place:manihari", valueLabel: "west of Manihari", contextGroupId: "geo-riv-ganga-confluence-places", distractorGroupIds: ["geo-riv-ganga-confluence-places"], sourceId: WRIS_GANGA, locator: "Ganga Basin Report — Kosi meets Ganga west of Manihari", difficulty: "Hard", tags: ["kosi", "confluence"] }),
  entityFact({ id: "sone-source-amarkantak", entityId: "geo:river:sone", entityLabel: "Sone", relation: "source_region", valueId: "geo:plateau:amarkantak", valueLabel: "Amarkantak plateau", contextGroupId: "geo-riv-ganga-source-regions", distractorGroupIds: ["geo-riv-indian-source-regions"], sourceId: WRIS_GANGA, locator: "Ganga Basin Report — Sone rises in the Maikala range at Amarkantak plateau", difficulty: "Medium", tags: ["sone", "source"] }),
  entityFact({ id: "sone-joins-arrah", entityId: "geo:river:sone", entityLabel: "Sone", relation: "joins_river_at", valueId: "geo:place:arrah", valueLabel: "near Arrah", contextGroupId: "geo-riv-ganga-confluence-places", distractorGroupIds: ["geo-riv-ganga-confluence-places"], sourceId: WRIS_GANGA, locator: "Ganga Basin Report — Sone meets Ganga near Arrah, west of Patna", difficulty: "Medium", tags: ["sone", "confluence"] }),
];

export const GEO_RIV_001_CP003_FACTS: KnowledgeFact[] = [
  ...GEO_RIV_001_CP003_HEADWATER_FACTS,
  ...GEO_RIV_001_CP003_PANCH_PRAYAG_FACTS,
  ...GEO_RIV_001_CP003_MAJOR_TRIBUTARY_FACTS,
  ...GEO_RIV_001_CP003_YAMUNA_FACTS,
  ...GEO_RIV_001_CP003_PLAIN_TRIBUTARY_FACTS,
];
