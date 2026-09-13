import type { SourceGapOwnerCheckpoint, SourceGapRuleId } from "./remediation/source-gap-prototype";

export type CodSourceGapQlId =
  | "COD-QL-200"
  | "COD-QL-201"
  | "COD-QL-202"
  | "COD-QL-203";

export type CodSourceGapSolveContractId =
  | "CP005-INFER-ALPHABETICAL-SORT-ENCODE"
  | "CP006-INFER-INDEXED-SHIFT-THEN-REVERSE-ENCODE"
  | "CP006-INFER-REVERSE-THEN-UNIFORM-SHIFT-ENCODE"
  | "CP007-INFER-MIXED-CLASS-CODE-ENCODE";

export interface CodSourceGapPermanentContract {
  readonly qlId: CodSourceGapQlId;
  readonly checkpointId: SourceGapOwnerCheckpoint;
  readonly ruleId: SourceGapRuleId;
  readonly solveContractId: CodSourceGapSolveContractId;
  readonly taskKind: "INFER_AND_ENCODE";
  readonly status: "ENGLISH_RUNTIME_PROOF";
  readonly reviewOnly: true;
  readonly publiclyPublishable: false;
  readonly questionStudioVisible: false;
  readonly questionBankWritable: false;
  readonly mockTestEligible: false;
}

export const COD_SOURCE_GAP_PERMANENT_CONTRACTS: readonly CodSourceGapPermanentContract[] = [
  {
    qlId: "COD-QL-200",
    checkpointId: "COD-CP-005",
    ruleId: "ALPHABETICAL_ASCENDING_SORT",
    solveContractId: "CP005-INFER-ALPHABETICAL-SORT-ENCODE",
    taskKind: "INFER_AND_ENCODE",
    status: "ENGLISH_RUNTIME_PROOF",
    reviewOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    questionBankWritable: false,
    mockTestEligible: false,
  },
  {
    qlId: "COD-QL-201",
    checkpointId: "COD-CP-006",
    ruleId: "INDEXED_SHIFT_THEN_REVERSE",
    solveContractId: "CP006-INFER-INDEXED-SHIFT-THEN-REVERSE-ENCODE",
    taskKind: "INFER_AND_ENCODE",
    status: "ENGLISH_RUNTIME_PROOF",
    reviewOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    questionBankWritable: false,
    mockTestEligible: false,
  },
  {
    qlId: "COD-QL-202",
    checkpointId: "COD-CP-006",
    ruleId: "REVERSE_THEN_UNIFORM_SHIFT",
    solveContractId: "CP006-INFER-REVERSE-THEN-UNIFORM-SHIFT-ENCODE",
    taskKind: "INFER_AND_ENCODE",
    status: "ENGLISH_RUNTIME_PROOF",
    reviewOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    questionBankWritable: false,
    mockTestEligible: false,
  },
  {
    qlId: "COD-QL-203",
    checkpointId: "COD-CP-007",
    ruleId: "MIXED_CLASS_CODE",
    solveContractId: "CP007-INFER-MIXED-CLASS-CODE-ENCODE",
    taskKind: "INFER_AND_ENCODE",
    status: "ENGLISH_RUNTIME_PROOF",
    reviewOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    questionBankWritable: false,
    mockTestEligible: false,
  },
] as const;

export function getCodSourceGapPermanentContract(qlId: CodSourceGapQlId): CodSourceGapPermanentContract {
  const contract = COD_SOURCE_GAP_PERMANENT_CONTRACTS.find((entry) => entry.qlId === qlId);
  if (!contract) throw new Error(`Unknown COD-001 source-gap permanent QL '${qlId}'`);
  return contract;
}
