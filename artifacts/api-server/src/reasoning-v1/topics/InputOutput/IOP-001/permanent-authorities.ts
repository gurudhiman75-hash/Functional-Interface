export type IopPermanentQlId =
  | "IOP-QL-001"
  | "IOP-QL-002"
  | "IOP-QL-003"
  | "IOP-QL-004"
  | "IOP-QL-005"
  | "IOP-QL-006"
  | "IOP-QL-007"
  | "IOP-QL-008";

export type IopPermanentSolveMode =
  | "STEP_OUTPUT"
  | "FINAL_OUTPUT"
  | "ELEMENT_AT_POSITION"
  | "POSITION_OF_ELEMENT"
  | "STEP_NUMBER"
  | "PREVIOUS_STEP"
  | "MISSING_STEP"
  | "REMAINING_STEP_COUNT";

export type IopPermanentSourceStatus =
  | "SOURCE_BACKED_V1"
  | "SOURCE_PINNED_RBI_GRADE_B_2024"
  | "SOURCE_MODE_WHITELISTED_V1";

export interface IopPermanentQlAuthority {
  readonly qlId: IopPermanentQlId;
  readonly title: string;
  readonly checkpoints: readonly string[];
  readonly semanticContract: string;
  readonly discoveryAuthorities: readonly string[];
  readonly sourceStatus: IopPermanentSourceStatus;
  readonly allowedSolveModes: readonly IopPermanentSolveMode[];
  readonly primaryExamFamily: "BANKING";
  readonly nonBankingWeighting: "SOURCE_GATED";
  readonly allocationStatus: "PERMANENT_ALLOCATED";
  readonly englishProductionStatus: "ENGLISH_FROZEN";
  readonly questionStudioDiscoverable: false;
  readonly questionBankWritable: false;
  readonly testEligible: false;
  readonly publiclyPublishable: false;
}

const STANDARD_SOLVE_MODES: readonly IopPermanentSolveMode[] = [
  "STEP_OUTPUT",
  "FINAL_OUTPUT",
  "ELEMENT_AT_POSITION",
  "POSITION_OF_ELEMENT",
  "STEP_NUMBER",
  "PREVIOUS_STEP",
  "MISSING_STEP",
  "REMAINING_STEP_COUNT",
] as const;

const deliveryLocks = {
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
};

function authority(
  qlId: IopPermanentQlId,
  title: string,
  checkpoints: readonly string[],
  semanticContract: string,
  discoveryAuthorities: readonly string[],
  sourceStatus: IopPermanentSourceStatus,
): IopPermanentQlAuthority {
  return {
    qlId,
    title,
    checkpoints,
    semanticContract,
    discoveryAuthorities,
    sourceStatus,
    allowedSolveModes: STANDARD_SOLVE_MODES,
    primaryExamFamily: "BANKING",
    nonBankingWeighting: "SOURCE_GATED",
    allocationStatus: "PERMANENT_ALLOCATED",
    englishProductionStatus: "ENGLISH_FROZEN",
    ...deliveryLocks,
  };
}

export const IOP_001_PERMANENT_QL_AUTHORITIES: readonly IopPermanentQlAuthority[] = Object.freeze([
  authority(
    "IOP-QL-001",
    "Single Select-and-Fix Rearrangement",
    ["IOP-CP-001", "IOP-CP-005"],
    "Select one remaining token by an inferable key, fix it at one open end, and repeat.",
    [
      "IOP-CP001-PROT-001", "IOP-CP001-PROT-002", "IOP-CP001-PROT-003",
      "IOP-CP005-PROT-001", "IOP-CP005-PROT-002", "IOP-CP005-PROT-003",
    ],
    "SOURCE_BACKED_V1",
  ),
  authority(
    "IOP-QL-002",
    "Blocked Multi-Category Rearrangement",
    ["IOP-CP-002"],
    "Complete one category or phase across successive steps before switching to the next category or phase.",
    ["IOP-CP002-PROT-001", "IOP-CP002-PROT-002", "IOP-CP002-PROT-003"],
    "SOURCE_BACKED_V1",
  ),
  authority(
    "IOP-QL-003",
    "Simultaneous Multi-Action Rearrangement",
    ["IOP-CP-003"],
    "Perform multiple independent selections and placements in the same learner-visible step.",
    ["IOP-CP003-PROT-001", "IOP-CP003-PROT-002", "IOP-CP003-PROT-003"],
    "SOURCE_BACKED_V1",
  ),
  authority(
    "IOP-QL-004",
    "Alternating / Interleaved Rearrangement",
    ["IOP-CP-004"],
    "Alternate between materially different placement phases on successive visible steps.",
    ["IOP-CP004-PROT-001", "IOP-CP004-PROT-002", "IOP-CP004-PROT-003"],
    "SOURCE_BACKED_V1",
  ),
  authority(
    "IOP-QL-005",
    "Numeric Transformation Pipeline",
    ["IOP-CP-006", "IOP-CP-008"],
    "Transform and/or reorder numeric tokens through multiple inferable machine stages.",
    ["IOP-CP006-PROT-001", "IOP-CP006-PROT-002", "IOP-CP006-PROT-003", "IOP-CP008-PROT-001"],
    "SOURCE_MODE_WHITELISTED_V1",
  ),
  authority(
    "IOP-QL-006",
    "Text / Alphanumeric Transformation Pipeline",
    ["IOP-CP-007", "IOP-CP-008"],
    "Transform and/or reorder textual or alphanumeric tokens through multiple inferable machine stages.",
    ["IOP-CP007-PROT-001", "IOP-CP007-PROT-002", "IOP-CP007-PROT-003", "IOP-CP008-PROT-002", "IOP-CP008-PROT-003"],
    "SOURCE_MODE_WHITELISTED_V1",
  ),
  authority(
    "IOP-QL-007",
    "Mixed Word–Number Transformed-Pair Machine",
    ["IOP-CP-008"],
    "Select a word and a number under independent rules, transform both, place the transformed pair, and repeat.",
    ["IOP-CP008-GAP-PROT-001"],
    "SOURCE_PINNED_RBI_GRADE_B_2024",
  ),
  authority(
    "IOP-QL-008",
    "Box / Table Arithmetic Machine",
    ["IOP-CP-009"],
    "Transform structured cells or boxes through inferable arithmetic relationships across cells and stages.",
    ["IOP-CP009-PROT-001", "IOP-CP009-PROT-002", "IOP-CP009-PROT-003"],
    "SOURCE_MODE_WHITELISTED_V1",
  ),
] as const);

export const IOP_001_PERMANENT_ALLOCATION = Object.freeze({
  packageId: "IOP-001" as const,
  chapterId: "REAS-INP" as const,
  maturity: "ENGLISH_FROZEN" as const,
  sourceFamilySaturation: "PASS_V1" as const,
  permanentQlCount: IOP_001_PERMANENT_QL_AUTHORITIES.length,
  whitelistedSourceModeCount: 19 as const,
  englishAutomatedScaleProof: "PASS" as const,
  englishHumanAuditPack: "PASS" as const,
  englishArtifactAudit: "PASS" as const,
  englishHumanApproval: "APPROVED_2026_08_18" as const,
  englishFreeze: true as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
  hindiPunjabiStatus: "NOT_STARTED" as const,
});

export function getIopPermanentAuthority(qlId: IopPermanentQlId): IopPermanentQlAuthority {
  const result = IOP_001_PERMANENT_QL_AUTHORITIES.find((candidate) => candidate.qlId === qlId);
  if (!result) throw new Error(`Unknown IOP permanent QL ${qlId}`);
  return result;
}

export function assertIop001ProductActivationAllowed(): never {
  throw new Error("IOP-001 English is frozen, but product activation remains locked. Hindi/Punjabi localization may proceed under a separate review/freeze gate.");
}
