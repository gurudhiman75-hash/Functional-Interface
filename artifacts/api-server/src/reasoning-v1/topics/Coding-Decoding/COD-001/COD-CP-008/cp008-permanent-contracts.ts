import type { Cp008PrototypeId } from "./cp008-prototype-types";

export type Cp008QlId = "COD-QL-173" | "COD-QL-174";

export type Cp008SolveContractId =
  | "CP008-DIRECT-RENAMED-LABEL"
  | "CP008-SEMANTIC-REFERENT-THEN-RENAME";

export interface Cp008PermanentContract {
  qlId: Cp008QlId;
  checkpointId: "COD-CP-008";
  ruleId: "DIRECT_RENAMED_LABEL" | "SEMANTIC_REFERENT_THEN_RENAME";
  solveContractId: Cp008SolveContractId;
  prototypeId: Cp008PrototypeId;
  status: "ENGLISH_RUNTIME_PROOF";
  publiclyPublishable: false;
  questionStudioVisible: false;
}

export const COD_CP008_PERMANENT_CONTRACTS: readonly Cp008PermanentContract[] = [
  {
    qlId: "COD-QL-173",
    checkpointId: "COD-CP-008",
    ruleId: "DIRECT_RENAMED_LABEL",
    solveContractId: "CP008-DIRECT-RENAMED-LABEL",
    prototypeId: "COD-CP008-PROT-DIRECT-RENAMED-LABEL",
    status: "ENGLISH_RUNTIME_PROOF",
    publiclyPublishable: false,
    questionStudioVisible: false,
  },
  {
    qlId: "COD-QL-174",
    checkpointId: "COD-CP-008",
    ruleId: "SEMANTIC_REFERENT_THEN_RENAME",
    solveContractId: "CP008-SEMANTIC-REFERENT-THEN-RENAME",
    prototypeId: "COD-CP008-PROT-SEMANTIC-REFERENT-RENAMING",
    status: "ENGLISH_RUNTIME_PROOF",
    publiclyPublishable: false,
    questionStudioVisible: false,
  },
] as const;

export function getCp008PermanentContract(qlId: Cp008QlId): Cp008PermanentContract {
  const contract = COD_CP008_PERMANENT_CONTRACTS.find((entry) => entry.qlId === qlId);
  if (!contract) throw new Error(`Unknown COD-CP-008 QL '${qlId}'`);
  return contract;
}
