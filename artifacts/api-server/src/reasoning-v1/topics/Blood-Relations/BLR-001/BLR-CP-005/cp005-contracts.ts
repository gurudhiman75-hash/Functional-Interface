import type { BlrRelationId, FamilyGraph } from "../foundation/types";


export const BLR_CP005_RUNTIME_VERSION = "blr-cp005-permanent-runtime-v1" as const;
export const BLR_CP005_FREEZE_VERSION = "BLR_CP005_ENGLISH_DISCOVERY_FREEZE_V1" as const;
export const BLR_CP005_APPROVAL_DATE = "2026-08-02" as const;
export const BLR_CP005_OWNER_DIRECTIVE = "APPROVED_CONTINUE" as const;

export type BlrCp005QlId =
  | "BLR-QL-018"
  | "BLR-QL-019"
  | "BLR-QL-020"
  | "BLR-QL-021"
  | "BLR-QL-022"
  | "BLR-QL-023"
  | "BLR-QL-024"
  | "BLR-QL-025";

export type BlrCp005Authority =
  | "RESOLVE_INVARIANT_RELATION"
  | "RESOLVE_RELATION_UNCERTAINTY"
  | "SELECT_CLAIM_BY_MODEL_STATUS"
  | "IDENTIFY_PERSON_BY_MODEL_STATUS"
  | "RESOLVE_PERSON_IDENTITY_UNCERTAINTY"
  | "DETERMINE_COUNT_BOUND"
  | "SELECT_COUNT_BY_MODEL_STATUS"
  | "RESOLVE_COUNT_DETERMINACY";

export type BlrCp005PrototypeId =
  | "BLR-CP005-PROT-EXACT-RELATION-INVARIANT"
  | "BLR-CP005-PROT-GENDER-NEUTRAL-RELATION"
  | "BLR-CP005-PROT-BROAD-LINEAGE-RELATION"
  | "BLR-CP005-PROT-BROAD-AFFINAL-RELATION"
  | "BLR-CP005-PROT-ONE-OF-TWO-RELATIONS"
  | "BLR-CP005-PROT-RELATION-CANNOT-BE-DETERMINED"
  | "BLR-CP005-PROT-SELECT-DEFINITE-CLAIM"
  | "BLR-CP005-PROT-SELECT-POSSIBLE-CLAIM"
  | "BLR-CP005-PROT-SELECT-IMPOSSIBLE-CLAIM"
  | "BLR-CP005-PROT-SELECT-INVARIANT-FACT"
  | "BLR-CP005-PROT-SELECT-UNSUPPORTED-EXACT-RELATION"
  | "BLR-CP005-PROT-SELECT-BROAD-FOLLOWING-CLAIM"
  | "BLR-CP005-PROT-IDENTIFY-DEFINITE-PERSON"
  | "BLR-CP005-PROT-IDENTIFY-POSSIBLE-PERSON"
  | "BLR-CP005-PROT-IDENTIFY-IMPOSSIBLE-PERSON"
  | "BLR-CP005-PROT-PERSON-ONE-OF-TWO"
  | "BLR-CP005-PROT-PERSON-CANNOT-BE-DETERMINED"
  | "BLR-CP005-PROT-MINIMUM-POSSIBLE-COUNT"
  | "BLR-CP005-PROT-MAXIMUM-POSSIBLE-COUNT"
  | "BLR-CP005-PROT-SELECT-POSSIBLE-COUNT"
  | "BLR-CP005-PROT-SELECT-IMPOSSIBLE-COUNT"
  | "BLR-CP005-PROT-EXACT-COUNT-INVARIANT"
  | "BLR-CP005-PROT-COUNT-CANNOT-BE-DETERMINED";

export type BlrCp005TruthStatus = "DEFINITE" | "POSSIBLE" | "IMPOSSIBLE";
export type BlrCp005Difficulty = "EASY" | "MEDIUM" | "HARD";
export type BlrCp005BroadRelationId =
  | "PARENT"
  | "CHILD"
  | "SIBLING"
  | "SPOUSE"
  | "GRANDPARENT"
  | "GRANDCHILD"
  | "GREAT_GRANDPARENT"
  | "GREAT_GRANDCHILD"
  | "UNCLE_OR_AUNT"
  | "NEPHEW_OR_NIECE"
  | "COUSIN"
  | "PARENT_IN_LAW"
  | "CHILD_IN_LAW"
  | "SIBLING_IN_LAW";
export type BlrCp005RelationAnswerId = BlrRelationId | BlrCp005BroadRelationId;
export type BlrCp005LineageSide = "PATERNAL" | "MATERNAL" | "UNSPECIFIED";

export interface BlrCp005PermanentContract {
  qlId: BlrCp005QlId;
  solveAuthority: BlrCp005Authority;
  answerType:
    | "RELATION_LABEL"
    | "RELATION_SET_OR_INDETERMINATE"
    | "CLAIM_TEXT"
    | "PERSON_NAME"
    | "PERSON_SET_OR_INDETERMINATE"
    | "NUMBER"
    | "NUMBER_OR_INDETERMINATE";
  sourcePrototypeIds: readonly BlrCp005PrototypeId[];
  status: "ENGLISH_DISCOVERY_FROZEN";
  reviewOnly: true;
  publiclyPublishable: false;
  questionStudioVisible: false;
  questionBankEligible: false;
  mockTestEligible: false;
}

export const BLR_CP005_PERMANENT_CONTRACTS: readonly BlrCp005PermanentContract[] = [
  {
    qlId: "BLR-QL-018",
    solveAuthority: "RESOLVE_INVARIANT_RELATION",
    answerType: "RELATION_LABEL",
    sourcePrototypeIds: [
      "BLR-CP005-PROT-EXACT-RELATION-INVARIANT",
      "BLR-CP005-PROT-GENDER-NEUTRAL-RELATION",
      "BLR-CP005-PROT-BROAD-LINEAGE-RELATION",
      "BLR-CP005-PROT-BROAD-AFFINAL-RELATION",
    ],
    status: "ENGLISH_DISCOVERY_FROZEN", reviewOnly: true, publiclyPublishable: false,
    questionStudioVisible: false, questionBankEligible: false, mockTestEligible: false,
  },
  {
    qlId: "BLR-QL-019",
    solveAuthority: "RESOLVE_RELATION_UNCERTAINTY",
    answerType: "RELATION_SET_OR_INDETERMINATE",
    sourcePrototypeIds: [
      "BLR-CP005-PROT-ONE-OF-TWO-RELATIONS",
      "BLR-CP005-PROT-RELATION-CANNOT-BE-DETERMINED",
    ],
    status: "ENGLISH_DISCOVERY_FROZEN", reviewOnly: true, publiclyPublishable: false,
    questionStudioVisible: false, questionBankEligible: false, mockTestEligible: false,
  },
  {
    qlId: "BLR-QL-020",
    solveAuthority: "SELECT_CLAIM_BY_MODEL_STATUS",
    answerType: "CLAIM_TEXT",
    sourcePrototypeIds: [
      "BLR-CP005-PROT-SELECT-DEFINITE-CLAIM",
      "BLR-CP005-PROT-SELECT-POSSIBLE-CLAIM",
      "BLR-CP005-PROT-SELECT-IMPOSSIBLE-CLAIM",
      "BLR-CP005-PROT-SELECT-INVARIANT-FACT",
      "BLR-CP005-PROT-SELECT-UNSUPPORTED-EXACT-RELATION",
      "BLR-CP005-PROT-SELECT-BROAD-FOLLOWING-CLAIM",
    ],
    status: "ENGLISH_DISCOVERY_FROZEN", reviewOnly: true, publiclyPublishable: false,
    questionStudioVisible: false, questionBankEligible: false, mockTestEligible: false,
  },
  {
    qlId: "BLR-QL-021",
    solveAuthority: "IDENTIFY_PERSON_BY_MODEL_STATUS",
    answerType: "PERSON_NAME",
    sourcePrototypeIds: [
      "BLR-CP005-PROT-IDENTIFY-DEFINITE-PERSON",
      "BLR-CP005-PROT-IDENTIFY-POSSIBLE-PERSON",
      "BLR-CP005-PROT-IDENTIFY-IMPOSSIBLE-PERSON",
    ],
    status: "ENGLISH_DISCOVERY_FROZEN", reviewOnly: true, publiclyPublishable: false,
    questionStudioVisible: false, questionBankEligible: false, mockTestEligible: false,
  },
  {
    qlId: "BLR-QL-022",
    solveAuthority: "RESOLVE_PERSON_IDENTITY_UNCERTAINTY",
    answerType: "PERSON_SET_OR_INDETERMINATE",
    sourcePrototypeIds: [
      "BLR-CP005-PROT-PERSON-ONE-OF-TWO",
      "BLR-CP005-PROT-PERSON-CANNOT-BE-DETERMINED",
    ],
    status: "ENGLISH_DISCOVERY_FROZEN", reviewOnly: true, publiclyPublishable: false,
    questionStudioVisible: false, questionBankEligible: false, mockTestEligible: false,
  },
  {
    qlId: "BLR-QL-023",
    solveAuthority: "DETERMINE_COUNT_BOUND",
    answerType: "NUMBER",
    sourcePrototypeIds: [
      "BLR-CP005-PROT-MINIMUM-POSSIBLE-COUNT",
      "BLR-CP005-PROT-MAXIMUM-POSSIBLE-COUNT",
    ],
    status: "ENGLISH_DISCOVERY_FROZEN", reviewOnly: true, publiclyPublishable: false,
    questionStudioVisible: false, questionBankEligible: false, mockTestEligible: false,
  },
  {
    qlId: "BLR-QL-024",
    solveAuthority: "SELECT_COUNT_BY_MODEL_STATUS",
    answerType: "NUMBER",
    sourcePrototypeIds: [
      "BLR-CP005-PROT-SELECT-POSSIBLE-COUNT",
      "BLR-CP005-PROT-SELECT-IMPOSSIBLE-COUNT",
    ],
    status: "ENGLISH_DISCOVERY_FROZEN", reviewOnly: true, publiclyPublishable: false,
    questionStudioVisible: false, questionBankEligible: false, mockTestEligible: false,
  },
  {
    qlId: "BLR-QL-025",
    solveAuthority: "RESOLVE_COUNT_DETERMINACY",
    answerType: "NUMBER_OR_INDETERMINATE",
    sourcePrototypeIds: [
      "BLR-CP005-PROT-EXACT-COUNT-INVARIANT",
      "BLR-CP005-PROT-COUNT-CANNOT-BE-DETERMINED",
    ],
    status: "ENGLISH_DISCOVERY_FROZEN", reviewOnly: true, publiclyPublishable: false,
    questionStudioVisible: false, questionBankEligible: false, mockTestEligible: false,
  },
] as const;

export interface BlrCp005VariableDomain {
  variableId: string;
  values: readonly string[];
}

export interface BlrCp005Model {
  modelId: string;
  assignment: Readonly<Record<string, string>>;
  graph: FamilyGraph;
}

export interface BlrCp005ModelSpace {
  scenarioId: string;
  topologyId: string;
  groupKey: string;
  sharedPrompt: string;
  variables: readonly BlrCp005VariableDomain[];
  models: readonly BlrCp005Model[];
}

export type BlrCp005CountSpec =
  | { kind: "TOTAL_MEMBERS" }
  | { kind: "GENDER"; gender: "MALE" | "FEMALE" }
  | { kind: "CHILDREN_OF"; parentId: string }
  | { kind: "RELATIVES_OF"; referenceId: string; relationId: BlrCp005RelationAnswerId }
  | { kind: "MARRIED_COUPLES" };

export type BlrCp005Predicate =
  | { kind: "RELATION"; subjectId: string; referenceId: string; relationId: BlrCp005RelationAnswerId }
  | { kind: "SIDE_RELATION"; subjectId: string; referenceId: string; relationId: BlrRelationId; lineageSide: BlrCp005LineageSide }
  | { kind: "GENDER"; personId: string; gender: "MALE" | "FEMALE" }
  | { kind: "COUNT_EQUALS"; countSpec: BlrCp005CountSpec; value: number };

export interface BlrCp005ClaimOptionSpec {
  claimId: string;
  text: string;
  predicate: BlrCp005Predicate;
}

export type BlrCp005QuerySpec =
  | {
      kind: "INVARIANT_RELATION";
      subjectId: string;
      referenceId: string;
    }
  | {
      kind: "RELATION_UNCERTAINTY";
      subjectId: string;
      referenceId: string;
      mode: "ONE_OF_TWO" | "INDETERMINATE";
    }
  | {
      kind: "CLAIM_STATUS";
      requestedStatus: BlrCp005TruthStatus;
      claims: readonly BlrCp005ClaimOptionSpec[];
    }
  | {
      kind: "PERSON_STATUS";
      requestedStatus: BlrCp005TruthStatus;
      referenceId: string;
      relationId: BlrCp005RelationAnswerId;
      candidatePersonIds: readonly string[];
    }
  | {
      kind: "PERSON_UNCERTAINTY";
      referenceId: string;
      relationId: BlrCp005RelationAnswerId;
      candidatePersonIds: readonly string[];
      mode: "ONE_OF_TWO" | "INDETERMINATE";
    }
  | {
      kind: "COUNT_BOUND";
      countSpec: BlrCp005CountSpec;
      bound: "MINIMUM" | "MAXIMUM";
    }
  | {
      kind: "COUNT_STATUS";
      countSpec: BlrCp005CountSpec;
      requestedStatus: "POSSIBLE" | "IMPOSSIBLE";
      candidateValues: readonly number[];
    }
  | {
      kind: "COUNT_DETERMINACY";
      countSpec: BlrCp005CountSpec;
    };

export interface BlrCp005Option {
  text: string;
  semanticKey: string;
  isCorrect: boolean;
  errorLabel?: string;
  modelStatus?: BlrCp005TruthStatus;
}

export interface BlrCp005FamilyTreeNode {
  id: string;
  label: string;
  gender: "male" | "female" | "unknown";
  generation: number;
}
export interface BlrCp005FamilyTreeEdge {
  id: string;
  type: "marriage" | "parent-child" | "sibling";
  sourceId: string;
  targetId: string;
}
export interface BlrCp005FamilyTreeDiagram {
  kind: "blood-relation-family-tree";
  version: 1;
  title: string;
  modelLabel: string;
  nodes: readonly BlrCp005FamilyTreeNode[];
  edges: readonly BlrCp005FamilyTreeEdge[];
  query: { subjectId?: string; referenceId?: string; answerLabel: string; pathPersonIds: readonly string[] };
  accessibleSummary: string;
  asciiFallback: string;
}

export interface GeneratedBlrCp005Question {
  packageId: "BLR-001";
  checkpointId: "BLR-CP-005";
  qlId: BlrCp005QlId;
  permanentQlId: BlrCp005QlId;
  solveAuthority: BlrCp005Authority;
  sourcePrototypeId: BlrCp005PrototypeId;
  prototypeOnly: false;
  reviewOnly: true;
  publiclyPublishable: false;
  questionStudioVisible: false;
  questionBankEligible: false;
  mockTestEligible: false;
  locale: "en-IN";
  seed: number;
  itemId: string;
  scenarioId: string;
  topologyId: string;
  groupKey: string;
  sharedPrompt: string;
  stem: string;
  answerType: BlrCp005PermanentContract["answerType"];
  options: readonly BlrCp005Option[];
  correctIndex: number;
  querySpec: BlrCp005QuerySpec;
  answer:
    | { kind: "RELATION"; relationId: BlrCp005RelationAnswerId }
    | { kind: "RELATION_SET"; relationIds: readonly BlrRelationId[] }
    | { kind: "CLAIM"; claimId: string; status: BlrCp005TruthStatus }
    | { kind: "PERSON"; personId: string; status: BlrCp005TruthStatus }
    | { kind: "PERSON_SET"; personIds: readonly string[] }
    | { kind: "NUMBER"; value: number; status?: BlrCp005TruthStatus; bound?: "MINIMUM" | "MAXIMUM" }
    | { kind: "INDETERMINATE"; survivingValues: readonly (string | number)[] };
  modelSpace: {
    variables: readonly BlrCp005VariableDomain[];
    modelCount: number;
    modelFingerprints: readonly string[];
    assignments: readonly Readonly<Record<string, string>>[];
  };
  explanation: {
    coreConcept: readonly string[];
    modelAudit: readonly string[];
    conclusion: string;
    examShortcut: string;
    optionAnalysis: readonly {
      optionLabel: "A" | "B" | "C" | "D";
      optionText: string;
      isCorrect: boolean;
      explanation: string;
    }[];
    familyTrees: readonly BlrCp005FamilyTreeDiagram[];
  };
  metadata: {
    runtimeVersion: typeof BLR_CP005_RUNTIME_VERSION;
    freezeVersion: typeof BLR_CP005_FREEZE_VERSION;
    approvalDate: typeof BLR_CP005_APPROVAL_DATE;
    approvedBy: "PROJECT_OWNER";
    ownerDirective: typeof BLR_CP005_OWNER_DIRECTIVE;
    structuralSaturationApproved: true;
    finalDiscoveryFreezeApproved: true;
    completeModelEnumeration: true;
    independentVerifierAgreed: true;
    uniqueAnswer: true;
    optionSemanticsUnique: true;
    difficulty: BlrCp005Difficulty;
    modelCount: number;
    semanticFingerprint: string;
  };
}
