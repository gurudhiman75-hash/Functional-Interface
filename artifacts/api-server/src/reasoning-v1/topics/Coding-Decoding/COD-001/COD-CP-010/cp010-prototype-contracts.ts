import type { Cp010PrototypeId } from "./cp010-prototype-types";

export interface Cp010PrototypeContract {
  prototypeId: Cp010PrototypeId;
  checkpointId: "COD-CP-010";
  ruleFamily: "EXPLICIT_MUTUALLY_EXCLUSIVE_CONDITIONAL_TABLE";
  solveContractId: "APPLY_CONDITIONAL_TABLE_FORWARD";
  taskKind: "ENCODE_WITH_CONDITION_TABLE";
  supportedDomains: readonly ["LETTER", "DIGIT"];
  answerType: "MIXED_CODE_SEQUENCE";
  status: "PROTOTYPE";
  permanentQlId: null;
  publiclyPublishable: false;
  questionStudioVisible: false;
}

export const COD_CP010_PROTOTYPE_CONTRACTS: readonly Cp010PrototypeContract[] = [
  {
    prototypeId: "COD-CP010-PROT-APPLY-CONDITIONAL-TABLE",
    checkpointId: "COD-CP-010",
    ruleFamily: "EXPLICIT_MUTUALLY_EXCLUSIVE_CONDITIONAL_TABLE",
    solveContractId: "APPLY_CONDITIONAL_TABLE_FORWARD",
    taskKind: "ENCODE_WITH_CONDITION_TABLE",
    supportedDomains: ["LETTER", "DIGIT"],
    answerType: "MIXED_CODE_SEQUENCE",
    status: "PROTOTYPE",
    permanentQlId: null,
    publiclyPublishable: false,
    questionStudioVisible: false,
  },
] as const;
