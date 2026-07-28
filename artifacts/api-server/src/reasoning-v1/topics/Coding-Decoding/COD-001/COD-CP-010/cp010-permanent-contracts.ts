export type Cp010QlId = "COD-QL-199";

export interface Cp010PermanentContract {
  qlId: Cp010QlId;
  checkpointId: "COD-CP-010";
  ruleFamily: "EXPLICIT_MUTUALLY_EXCLUSIVE_CONDITIONAL_TABLE";
  solveContractId: "APPLY_CONDITIONAL_TABLE_FORWARD";
  sourcePrototypeId: "COD-CP010-PROT-APPLY-CONDITIONAL-TABLE";
  status: "ENGLISH_RUNTIME_PROOF";
  publiclyPublishable: false;
  questionStudioVisible: false;
}

export const COD_CP010_PERMANENT_CONTRACTS: readonly Cp010PermanentContract[] = [
  {
    qlId: "COD-QL-199",
    checkpointId: "COD-CP-010",
    ruleFamily: "EXPLICIT_MUTUALLY_EXCLUSIVE_CONDITIONAL_TABLE",
    solveContractId: "APPLY_CONDITIONAL_TABLE_FORWARD",
    sourcePrototypeId: "COD-CP010-PROT-APPLY-CONDITIONAL-TABLE",
    status: "ENGLISH_RUNTIME_PROOF",
    publiclyPublishable: false,
    questionStudioVisible: false,
  },
] as const;

export function getCp010PermanentContract(qlId: Cp010QlId): Cp010PermanentContract {
  const contract = COD_CP010_PERMANENT_CONTRACTS.find((entry) => entry.qlId === qlId);
  if (!contract) throw new Error(`Unknown COD-CP-010 QL '${qlId}'`);
  return contract;
}
