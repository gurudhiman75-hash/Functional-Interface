import type { BlrCp001ProvisionalAuthority } from "./cp001-review-registry";

export type BlrCp001QlId =
  | "BLR-QL-001"
  | "BLR-QL-002"
  | "BLR-QL-003"
  | "BLR-QL-004"
  | "BLR-QL-005"
  | "BLR-QL-006"
  | "BLR-QL-007";

export type BlrCp001SourcePrototypeId =
  | "BLR-CP001-PROT-DIRECT-FORWARD"
  | "BLR-CP001-PROT-DIRECT-REVERSE"
  | "BLR-CP001-PROT-COMPOSED-TWO-EDGE"
  | "BLR-CP001-PROT-COMPOSED-THREE-EDGE"
  | "BLR-CP001-PROT-IDENTIFY-PERSON"
  | "BLR-CP001-PROT-IDENTIFY-PAIR"
  | "BLR-CP001-PROT-RELATION-CLAIM"
  | "BLR-CP001-PROT-GENERATION-COMPARISON"
  | "BLR-CP001-PROT-BRANCHING-RELATION"
  | "BLR-CP001-PROT-IDENTIFY-PERSON-BY-GENDER"
  | "BLR-CP001-PROT-EXACT-LINEAGE-RELATION";

export interface BlrCp001PermanentContract {
  qlId: BlrCp001QlId;
  checkpointId: "BLR-CP-001";
  solveAuthority: BlrCp001ProvisionalAuthority;
  sourcePrototypeIds: readonly BlrCp001SourcePrototypeId[];
  answerType:
    | "RELATION_LABEL"
    | "PERSON_NAME"
    | "ORDERED_PAIR"
    | "RELATION_CLAIM"
    | "GENERATION_LABEL"
    | "EXACT_LINEAGE_RELATION";
  status: "ENGLISH_RUNTIME_PROOF";
  reviewOnly: true;
  publiclyPublishable: false;
  questionStudioVisible: false;
  mockTestEligible: false;
}

const NAMED_RELATION_PROTOTYPES = [
  "BLR-CP001-PROT-DIRECT-FORWARD",
  "BLR-CP001-PROT-DIRECT-REVERSE",
  "BLR-CP001-PROT-COMPOSED-TWO-EDGE",
  "BLR-CP001-PROT-COMPOSED-THREE-EDGE",
  "BLR-CP001-PROT-BRANCHING-RELATION",
] as const;

export const BLR_CP001_PERMANENT_CONTRACTS: readonly BlrCp001PermanentContract[] = [
  {
    qlId: "BLR-QL-001",
    checkpointId: "BLR-CP-001",
    solveAuthority: "RESOLVE_NAMED_PERSON_RELATION",
    sourcePrototypeIds: NAMED_RELATION_PROTOTYPES,
    answerType: "RELATION_LABEL",
    status: "ENGLISH_RUNTIME_PROOF",
    reviewOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    mockTestEligible: false,
  },
  {
    qlId: "BLR-QL-002",
    checkpointId: "BLR-CP-001",
    solveAuthority: "IDENTIFY_PERSON_BY_RELATION",
    sourcePrototypeIds: ["BLR-CP001-PROT-IDENTIFY-PERSON"],
    answerType: "PERSON_NAME",
    status: "ENGLISH_RUNTIME_PROOF",
    reviewOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    mockTestEligible: false,
  },
  {
    qlId: "BLR-QL-003",
    checkpointId: "BLR-CP-001",
    solveAuthority: "IDENTIFY_PERSON_BY_GENDER",
    sourcePrototypeIds: ["BLR-CP001-PROT-IDENTIFY-PERSON-BY-GENDER"],
    answerType: "PERSON_NAME",
    status: "ENGLISH_RUNTIME_PROOF",
    reviewOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    mockTestEligible: false,
  },
  {
    qlId: "BLR-QL-004",
    checkpointId: "BLR-CP-001",
    solveAuthority: "IDENTIFY_ORDERED_RELATION_PAIR",
    sourcePrototypeIds: ["BLR-CP001-PROT-IDENTIFY-PAIR"],
    answerType: "ORDERED_PAIR",
    status: "ENGLISH_RUNTIME_PROOF",
    reviewOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    mockTestEligible: false,
  },
  {
    qlId: "BLR-QL-005",
    checkpointId: "BLR-CP-001",
    solveAuthority: "SELECT_RELATION_CLAIM",
    sourcePrototypeIds: ["BLR-CP001-PROT-RELATION-CLAIM"],
    answerType: "RELATION_CLAIM",
    status: "ENGLISH_RUNTIME_PROOF",
    reviewOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    mockTestEligible: false,
  },
  {
    qlId: "BLR-QL-006",
    checkpointId: "BLR-CP-001",
    solveAuthority: "COMPARE_GENERATIONS",
    sourcePrototypeIds: ["BLR-CP001-PROT-GENERATION-COMPARISON"],
    answerType: "GENERATION_LABEL",
    status: "ENGLISH_RUNTIME_PROOF",
    reviewOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    mockTestEligible: false,
  },
  {
    qlId: "BLR-QL-007",
    checkpointId: "BLR-CP-001",
    solveAuthority: "RESOLVE_EXACT_LINEAGE_RELATION",
    sourcePrototypeIds: ["BLR-CP001-PROT-EXACT-LINEAGE-RELATION"],
    answerType: "EXACT_LINEAGE_RELATION",
    status: "ENGLISH_RUNTIME_PROOF",
    reviewOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    mockTestEligible: false,
  },
] as const;

export function getBlrCp001PermanentContract(
  qlId: BlrCp001QlId,
): BlrCp001PermanentContract {
  const contract = BLR_CP001_PERMANENT_CONTRACTS.find(
    (entry) => entry.qlId === qlId,
  );
  if (!contract) throw new Error(`Unknown BLR-CP-001 QL '${qlId}'.`);
  return contract;
}
