import { COD_SOURCE_GAP_PERMANENT_CONTRACTS } from "./source-gap-permanent-contracts";

export const COD_SOURCE_GAP_DISCOVERY_FREEZE_VERSION = "COD_SOURCE_GAP_DISCOVERY_FREEZE_V1" as const;

export const COD_SOURCE_GAP_FROZEN_QL_IDS = [
  "COD-QL-200",
  "COD-QL-201",
  "COD-QL-202",
  "COD-QL-203",
] as const;

export const COD_SOURCE_GAP_FROZEN_SOLVE_CONTRACTS = COD_SOURCE_GAP_PERMANENT_CONTRACTS.map((contract) => ({
  qlId: contract.qlId,
  checkpointId: contract.checkpointId,
  ruleId: contract.ruleId,
  solveContractId: contract.solveContractId,
  taskKind: contract.taskKind,
})) as readonly Readonly<{
  qlId: string;
  checkpointId: string;
  ruleId: string;
  solveContractId: string;
  taskKind: "INFER_AND_ENCODE";
}>[];

export const COD_SOURCE_GAP_SOURCE_FIXTURES = [
  { ruleId: "ALPHABETICAL_ASCENDING_SORT", context: {}, source: "BEHOLD", code: "BDEHLO" },
  { ruleId: "ALPHABETICAL_ASCENDING_SORT", context: {}, source: "INDEED", code: "DDEEIN" },
  { ruleId: "ALPHABETICAL_ASCENDING_SORT", context: {}, source: "COURSE", code: "CEORSU" },
  { ruleId: "INDEXED_SHIFT_THEN_REVERSE", context: { baseShift: 1, direction: -1 }, source: "PLIERS", code: "MMAFJO" },
  { ruleId: "INDEXED_SHIFT_THEN_REVERSE", context: { baseShift: 1, direction: -1 }, source: "SHOVEL", code: "FZRLFR" },
  { ruleId: "INDEXED_SHIFT_THEN_REVERSE", context: { baseShift: 1, direction: -1 }, source: "WRENCH", code: "BXJBPV" },
  { ruleId: "REVERSE_THEN_UNIFORM_SHIFT", context: { shift: 1 }, source: "NAME", code: "FNBO" },
  { ruleId: "REVERSE_THEN_UNIFORM_SHIFT", context: { shift: 1 }, source: "NANO", code: "POBO" },
  { ruleId: "REVERSE_THEN_UNIFORM_SHIFT", context: { shift: 1 }, source: "NAIL", code: "MJBO" },
  { ruleId: "MIXED_CLASS_CODE", context: { mixedVariant: "VOWEL_INDEX_CONSONANT_PREVIOUS" }, source: "HONEY", code: "G4M2X" },
  { ruleId: "MIXED_CLASS_CODE", context: { mixedVariant: "VOWEL_INDEX_CONSONANT_PREVIOUS" }, source: "STATUE", code: "RS1S52" },
  { ruleId: "MIXED_CLASS_CODE", context: { mixedVariant: "REVERSE_VOWEL_INDEX_CONSONANT_OPPOSITE" }, source: "CATHODE", code: "X5GS2W4" },
  { ruleId: "MIXED_CLASS_CODE", context: { mixedVariant: "REVERSE_VOWEL_INDEX_CONSONANT_OPPOSITE" }, source: "RELATION", code: "I4O5G32M" },
] as const;

export const COD_SOURCE_GAP_EXPLICIT_NON_ALLOCATIONS = [
  "INVERSE_DECODE",
  "RECOVER_MISSING_TOKEN",
  "CHOOSE_MATCHING_CODE_AS_SEPARATE_QL",
  "EXPLICIT_RULE_FORWARD_APPLICATION",
  "RULE_NAMING_OR_CLASSIFICATION",
  "MIXED_CLASS_VARIANT_AS_SEPARATE_QL",
] as const;
