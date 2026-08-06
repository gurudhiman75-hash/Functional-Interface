import type { ClassificationTask, PrototypeId } from "./types";

export type ClsCp001QlId = "CLS-QL-001" | "CLS-QL-002" | "CLS-QL-003";

export type ClsCp001SolveContractId =
  | "CP001-FIND-SEMANTIC-OUTLIER"
  | "CP001-SELECT-MEMBER-OF-SHARED-SEMANTIC-CLASS"
  | "CP001-SELECT-COHERENT-SEMANTIC-GROUP";

export type ClsCp001PermanentContract = {
  readonly qlId: ClsCp001QlId;
  readonly checkpointId: "CLS-CP-001";
  readonly solveContractId: ClsCp001SolveContractId;
  readonly task: ClassificationTask;
  readonly allowedPrototypeIds: readonly PrototypeId[];
  readonly status: "MULTILINGUAL_RUNTIME_PROOF";
  readonly reviewOnly: true;
  readonly publiclyPublishable: false;
  readonly questionStudioVisible: false;
};

export const CLS_CP001_PERMANENT_CONTRACTS: readonly ClsCp001PermanentContract[] = [
  {
    qlId: "CLS-QL-001",
    checkpointId: "CLS-CP-001",
    solveContractId: "CP001-FIND-SEMANTIC-OUTLIER",
    task: "FIND_OUTLIER",
    allowedPrototypeIds: [
      "CLS-CP001-PROT-001",
      "CLS-CP001-PROT-002",
      "CLS-CP001-PROT-003",
      "CLS-CP001-PROT-005",
      "CLS-CP001-PROT-006",
    ],
    status: "MULTILINGUAL_RUNTIME_PROOF",
    reviewOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
  },
  {
    qlId: "CLS-QL-002",
    checkpointId: "CLS-CP-001",
    solveContractId: "CP001-SELECT-MEMBER-OF-SHARED-SEMANTIC-CLASS",
    task: "SELECT_CLASS_MEMBER",
    allowedPrototypeIds: [
      "CLS-CP001-PROT-004",
      "CLS-CP001-PROT-007",
    ],
    status: "MULTILINGUAL_RUNTIME_PROOF",
    reviewOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
  },
  {
    qlId: "CLS-QL-003",
    checkpointId: "CLS-CP-001",
    solveContractId: "CP001-SELECT-COHERENT-SEMANTIC-GROUP",
    task: "SELECT_COHERENT_GROUP",
    allowedPrototypeIds: ["CLS-CP001-PROT-008"],
    status: "MULTILINGUAL_RUNTIME_PROOF",
    reviewOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
  },
] as const;

export function getClsCp001PermanentContract(qlId: ClsCp001QlId): ClsCp001PermanentContract {
  const contract = CLS_CP001_PERMANENT_CONTRACTS.find((entry) => entry.qlId === qlId);
  if (!contract) throw new Error(`Unknown CLS-CP-001 QL '${qlId}'`);
  return contract;
}
