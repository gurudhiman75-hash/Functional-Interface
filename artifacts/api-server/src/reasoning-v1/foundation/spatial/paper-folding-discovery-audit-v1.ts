import {
  PFC_001_DISCOVERY_AUTHORITY_V1,
  PFC_001_REPRESENTATION_CATALOG_V1,
  type PfcDiscoveryRepresentationIdV1,
} from "./paper-folding-discovery-v1";

export const PFC_001_INVENTORY_COVERAGE_V1 = Object.freeze([
  {
    inventoryItem: 1,
    requirement: "single vertical or horizontal fold, single hole",
    representations: ["PFC-PROT-01-SINGLE-AXIAL-HOLE"],
  },
  {
    inventoryItem: 2,
    requirement: "single fold with an edge cut",
    representations: ["PFC-PROT-02-SINGLE-AXIAL-EDGE-NOTCH"],
  },
  {
    inventoryItem: 3,
    requirement: "two perpendicular folds",
    representations: ["PFC-PROT-03-PERPENDICULAR-DOUBLE-FOLD"],
  },
  {
    inventoryItem: 4,
    requirement: "repeated same-direction folds",
    representations: ["PFC-PROT-04-REPEATED-SAME-DIRECTION"],
  },
  {
    inventoryItem: 5,
    requirement: "corner fold",
    representations: ["PFC-PROT-05-CORNER-FOLD"],
  },
  {
    inventoryItem: 6,
    requirement: "diagonal fold",
    representations: ["PFC-PROT-06-DIAGONAL-FOLD"],
  },
  {
    inventoryItem: 7,
    requirement: "diagonal plus axial fold",
    representations: ["PFC-PROT-07-DIAGONAL-PLUS-AXIAL"],
  },
  {
    inventoryItem: 8,
    requirement: "multiple cuts or holes",
    representations: ["PFC-PROT-08-MULTIPLE-CUTS"],
  },
  {
    inventoryItem: 9,
    requirement: "cut touching an edge",
    representations: [
      "PFC-PROT-02-SINGLE-AXIAL-EDGE-NOTCH",
      "PFC-PROT-09-MULTI-FOLD-EDGE-NOTCH",
    ],
  },
  {
    inventoryItem: 10,
    requirement: "three-fold advanced unfolding",
    representations: ["PFC-PROT-10-THREE-FOLD-ADVANCED"],
  },
] as const satisfies readonly {
  inventoryItem: number;
  requirement: string;
  representations: readonly PfcDiscoveryRepresentationIdV1[];
}[]);

export const PFC_001_PROPOSED_REASONING_CLUSTERS_V1 = Object.freeze([
  {
    clusterId: "PFC-CLUSTER-A-AXIAL-AND-REPEATED-FOLDS",
    representations: [
      "PFC-PROT-01-SINGLE-AXIAL-HOLE",
      "PFC-PROT-02-SINGLE-AXIAL-EDGE-NOTCH",
      "PFC-PROT-04-REPEATED-SAME-DIRECTION",
    ],
    naturalSkill: "Track reflection and cut duplication through axial or repeated same-axis folds.",
  },
  {
    clusterId: "PFC-CLUSTER-B-MULTI-AXIS-FOLDS",
    representations: [
      "PFC-PROT-03-PERPENDICULAR-DOUBLE-FOLD",
      "PFC-PROT-07-DIAGONAL-PLUS-AXIAL",
      "PFC-PROT-10-THREE-FOLD-ADVANCED",
    ],
    naturalSkill: "Reverse multiple folds in the correct order while preserving layer provenance.",
  },
  {
    clusterId: "PFC-CLUSTER-C-DIAGONAL-AND-CORNER-FOLDS",
    representations: [
      "PFC-PROT-05-CORNER-FOLD",
      "PFC-PROT-06-DIAGONAL-FOLD",
    ],
    naturalSkill: "Reflect cuts across diagonal or partial corner folds without assuming whole-sheet layer doubling.",
  },
  {
    clusterId: "PFC-CLUSTER-D-MULTI-CUT-AND-EDGE-SEMANTICS",
    representations: [
      "PFC-PROT-08-MULTIPLE-CUTS",
      "PFC-PROT-09-MULTI-FOLD-EDGE-NOTCH",
    ],
    naturalSkill: "Propagate multiple cuts and distinguish boundary notches from interior holes.",
  },
] as const);

const catalogIds = new Set(PFC_001_REPRESENTATION_CATALOG_V1.map((item) => item.id));
const coveredIds = new Set(PFC_001_INVENTORY_COVERAGE_V1.flatMap((item) => item.representations));

export const PFC_001_DISCOVERY_AUDIT_V1 = Object.freeze({
  authorityId: "PFC-001-DISCOVERY-AUDIT-V1" as const,
  chapterCode: "PFC-001" as const,
  discoveryAuthorityId: PFC_001_DISCOVERY_AUTHORITY_V1.authorityId,
  controlledInventoryItems: PFC_001_INVENTORY_COVERAGE_V1.length,
  executableRepresentations: PFC_001_REPRESENTATION_CATALOG_V1.length,
  controlledTaxonomyStatus:
    catalogIds.size === 10 && coveredIds.size === 10
      ? ("CONTROLLED_PFC_TAXONOMY_SATURATED" as const)
      : ("CONTROLLED_PFC_TAXONOMY_GAP_REMAINS" as const),
  sourceAuditStatus: "DIRECT_EXAM_SOURCE_SATURATION_NOT_YET_CLAIMED" as const,
  sourcePosture: PFC_001_DISCOVERY_AUTHORITY_V1.sourcePosture,
  reasoningClusters: PFC_001_PROPOSED_REASONING_CLUSTERS_V1,
  permanentQlDecision: "PROPOSED_CLUSTERS_ONLY_NO_PERMANENT_QL_ALLOCATION" as const,
  qlGuard: {
    frozenExistingSpatialQlRange: "SPA-QL-001..SPA-QL-034" as const,
    nextAvailableQl: "SPA-QL-035" as const,
    spaQl035Allocated: false,
  },
  nextGate: "LEARNER_REVIEW_PLUS_DIRECT_SOURCE_AUDIT_BEFORE_QL_ALLOCATION" as const,
} as const);
