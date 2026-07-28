import type { UniformDigitPrototypeId } from "./uniform-digit-types";

export type Cp007QlId = "COD-QL-169" | "COD-QL-170" | "COD-QL-171" | "COD-QL-172";

export type Cp007SolveContractId =
  | "CP007-UNIFORM-EXPLICIT-FORWARD"
  | "CP007-UNIFORM-INVERSE-DECODE"
  | "CP007-UNIFORM-MISSING-DIGIT"
  | "CP007-UNIFORM-INFERRED-FORWARD";

export interface Cp007PermanentContract {
  qlId: Cp007QlId;
  checkpointId: "COD-CP-007";
  ruleId: "UNIFORM_MODULAR_DIGIT_TRANSLATION";
  solveContractId: Cp007SolveContractId;
  prototypeIds: readonly UniformDigitPrototypeId[];
  status: "ENGLISH_RUNTIME_PROOF";
  publiclyPublishable: false;
  questionStudioVisible: false;
}

export const COD_CP007_PERMANENT_CONTRACTS: readonly Cp007PermanentContract[] = [
  {
    qlId: "COD-QL-169",
    checkpointId: "COD-CP-007",
    ruleId: "UNIFORM_MODULAR_DIGIT_TRANSLATION",
    solveContractId: "CP007-UNIFORM-EXPLICIT-FORWARD",
    prototypeIds: ["COD-CP007-PROT-UNIFORM-DIGIT-ENCODE"],
    status: "ENGLISH_RUNTIME_PROOF",
    publiclyPublishable: false,
    questionStudioVisible: false,
  },
  {
    qlId: "COD-QL-170",
    checkpointId: "COD-CP-007",
    ruleId: "UNIFORM_MODULAR_DIGIT_TRANSLATION",
    solveContractId: "CP007-UNIFORM-INVERSE-DECODE",
    prototypeIds: ["COD-CP007-PROT-UNIFORM-DIGIT-DECODE"],
    status: "ENGLISH_RUNTIME_PROOF",
    publiclyPublishable: false,
    questionStudioVisible: false,
  },
  {
    qlId: "COD-QL-171",
    checkpointId: "COD-CP-007",
    ruleId: "UNIFORM_MODULAR_DIGIT_TRANSLATION",
    solveContractId: "CP007-UNIFORM-MISSING-DIGIT",
    prototypeIds: ["COD-CP007-PROT-UNIFORM-DIGIT-MISSING"],
    status: "ENGLISH_RUNTIME_PROOF",
    publiclyPublishable: false,
    questionStudioVisible: false,
  },
  {
    qlId: "COD-QL-172",
    checkpointId: "COD-CP-007",
    ruleId: "UNIFORM_MODULAR_DIGIT_TRANSLATION",
    solveContractId: "CP007-UNIFORM-INFERRED-FORWARD",
    prototypeIds: [
      "COD-CP007-PROT-UNIFORM-DIGIT-INFER-ENCODE",
      "COD-CP007-PROT-UNIFORM-DIGIT-CHOOSE-MATCHING",
    ],
    status: "ENGLISH_RUNTIME_PROOF",
    publiclyPublishable: false,
    questionStudioVisible: false,
  },
] as const;

export function getCp007PermanentContract(qlId: Cp007QlId): Cp007PermanentContract {
  const contract = COD_CP007_PERMANENT_CONTRACTS.find((entry) => entry.qlId === qlId);
  if (!contract) throw new Error(`Unknown COD-CP-007 QL '${qlId}'`);
  return contract;
}
