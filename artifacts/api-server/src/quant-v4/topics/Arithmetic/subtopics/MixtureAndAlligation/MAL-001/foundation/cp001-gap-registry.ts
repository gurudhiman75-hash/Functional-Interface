import { MAL_CP001_PROTOTYPE_IDS } from "./types";
import { MAL_CP001_GAP_PROTOTYPE_IDS } from "./cp001-gap-types";
import type {
  MalAnswerSemantic,
  MalDifficulty,
  MalTaskDirection,
} from "./types";
import type { MalCp001GapPrototypeId } from "./cp001-gap-types";

export interface MalCp001GapRegistryEntry {
  prototypeId: MalCp001GapPrototypeId;
  cpId: "MAL-CP-001";
  taskDirection: MalTaskDirection;
  answerSemantic: MalAnswerSemantic;
  topology:
    | "TWO_COMPONENT_RATIO_UNKNOWN_VALUE"
    | "TWO_COMPONENT_TARGET_SHARE"
    | "TWO_COMPONENT_DIFFERENCE_RECONSTRUCTION"
    | "TWO_STAGE_WEIGHTED_MEAN"
    | "TWO_STAGE_UNKNOWN_QUANTITY"
    | "THREE_COMPONENT_RELATION_RECONSTRUCTION";
  preferredMethod: "ALLIGATION_CROSS" | "WEIGHTED_CONSERVATION";
  baseDifficulty: MalDifficulty;
  permanentQlId: null;
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
}

export const MAL_CP001_GAP_PROTOTYPE_REGISTRY: readonly MalCp001GapRegistryEntry[] = [
  {
    prototypeId: "MAL-CP001-PROT-SOURCE-VALUE-FROM-RATIO",
    cpId: "MAL-CP-001",
    taskDirection: "INVERSE",
    answerSemantic: "SOURCE_VALUE",
    topology: "TWO_COMPONENT_RATIO_UNKNOWN_VALUE",
    preferredMethod: "WEIGHTED_CONSERVATION",
    baseDifficulty: "Medium",
    permanentQlId: null,
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
  },
  {
    prototypeId: "MAL-CP001-PROT-COMPONENT-SHARE-FROM-TARGET",
    cpId: "MAL-CP-001",
    taskDirection: "RECONSTRUCTION",
    answerSemantic: "COMPONENT_QUANTITY",
    topology: "TWO_COMPONENT_TARGET_SHARE",
    preferredMethod: "ALLIGATION_CROSS",
    baseDifficulty: "Medium",
    permanentQlId: null,
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
  },
  {
    prototypeId: "MAL-CP001-PROT-DIFFERENCE-BASED-QUANTITIES",
    cpId: "MAL-CP-001",
    taskDirection: "RECONSTRUCTION",
    answerSemantic: "COMPONENT_QUANTITY_PAIR",
    topology: "TWO_COMPONENT_DIFFERENCE_RECONSTRUCTION",
    preferredMethod: "ALLIGATION_CROSS",
    baseDifficulty: "Medium",
    permanentQlId: null,
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
  },
  {
    prototypeId: "MAL-CP001-PROT-TWO-STAGE-BLEND-MEAN",
    cpId: "MAL-CP-001",
    taskDirection: "FORWARD",
    answerSemantic: "FINAL_MEAN_VALUE",
    topology: "TWO_STAGE_WEIGHTED_MEAN",
    preferredMethod: "WEIGHTED_CONSERVATION",
    baseDifficulty: "Medium",
    permanentQlId: null,
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
  },
  {
    prototypeId: "MAL-CP001-PROT-TWO-STAGE-UNKNOWN",
    cpId: "MAL-CP-001",
    taskDirection: "INVERSE",
    answerSemantic: "COMPONENT_QUANTITY",
    topology: "TWO_STAGE_UNKNOWN_QUANTITY",
    preferredMethod: "WEIGHTED_CONSERVATION",
    baseDifficulty: "Hard",
    permanentQlId: null,
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
  },
  {
    prototypeId: "MAL-CP001-PROT-THREE-WAY-TARGET-WITH-RELATION",
    cpId: "MAL-CP-001",
    taskDirection: "RECONSTRUCTION",
    answerSemantic: "COMPONENT_QUANTITY",
    topology: "THREE_COMPONENT_RELATION_RECONSTRUCTION",
    preferredMethod: "WEIGHTED_CONSERVATION",
    baseDifficulty: "Hard",
    permanentQlId: null,
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
  },
] as const;

const gapRegistryById = new Map<MalCp001GapPrototypeId, MalCp001GapRegistryEntry>(
  MAL_CP001_GAP_PROTOTYPE_REGISTRY.map((entry) => [entry.prototypeId, entry]),
);

export function getMalCp001GapRegistryEntry(
  prototypeId: MalCp001GapPrototypeId,
): MalCp001GapRegistryEntry {
  const entry = gapRegistryById.get(prototypeId);
  if (!entry) throw new Error(`Unknown MAL-CP-001 gap prototype ID: ${prototypeId}.`);
  return entry;
}

export const MAL_CP001_DISCOVERY_PROTOTYPE_IDS = [
  ...MAL_CP001_PROTOTYPE_IDS,
  ...MAL_CP001_GAP_PROTOTYPE_IDS,
] as const;

export type MalCp001DiscoveryPrototypeId =
  (typeof MAL_CP001_DISCOVERY_PROTOTYPE_IDS)[number];

const gapPrototypeIdSet = new Set<string>(MAL_CP001_GAP_PROTOTYPE_IDS);

export function isMalCp001GapPrototypeId(
  prototypeId: MalCp001DiscoveryPrototypeId,
): prototypeId is MalCp001GapPrototypeId {
  return gapPrototypeIdSet.has(prototypeId);
}
