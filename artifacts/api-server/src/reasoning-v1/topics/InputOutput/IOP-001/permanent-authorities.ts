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
  readonly englishProductionStatus: "ENGLISH_REVIEW_CANDIDATE";
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

export const IOP_001_PERMANENT_QL_AUTHORITIES: readonly IopPermanentQlAuthority[] = Object.freeze([
  {
    qlId: "IOP-QL-001",
    title: "Single Select-and-Fix Rearrangement",
    checkpoints: ["IOP-CP-001", "IOP-CP-005"],
    semanticContract: "Select one remaining token by an inferable key, fix it at one open end, and repeat.",
    discoveryAuthorities: [
      "IOP-CP001-PROT-001", "IOP-CP001-PROT-002", "IOP-CP001-PROT-003",
      "IOP-CP005-PROT-001", "IOP-CP005-PROT-002", "IOP-CP005-PROT-003",
    ],
    sourceStatus: "SOURCE_BACKED_V1",
    allowedSolveModes: STANDARD_SOLVE_MODES,
    primaryExamFamily: "BANKING",
    nonBankingWeighting: "SOURCE_GATED",
    allocationStatus: "PERMANENT_ALLOCATED",
    englishProductionStatus: "ENGLISH_REVIEW_CANDIDATE",
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
  },
  {
    qlId: "IOP-QL-002",
    title: "Blocked Multi-Category Rearrangement",
    checkpoints: ["IOP-CP-002"],
    semanticContract: "Complete one category or phase across successive steps before switching to the next category or phase.",
    discoveryAuthorities: ["IOP-CP002-PROT-001", "IOP-CP002-PROT-002", "IOP-CP002-PROT-003"],
    sourceStatus: "SOURCE_BACKED_V1",
    allowedSolveModes: STANDARD_SOLVE_MODES,
    primaryExamFamily: "BANKING",
    nonBankingWeighting: "SOURCE_GATED",
    allocationStatus: "PERMANENT_ALLOCATED",
    englishProductionStatus: "ENGLISH_REVIEW_CANDIDATE",
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
  },
  {
    qlId: "IOP-QL-003",
    title: "Simultaneous Multi-Action Rearrangement",
    checkpoints: ["IOP-CP-003"],
    semanticContract: "Perform multiple independent selections and placements in the same learner-visible step.",
    discoveryAuthorities: ["IOP-CP003-PROT-001", "IOP-CP003-PROT-002", "IOP-CP003-PROT-003"],
    sourceStatus: "SOURCE_BACKED_V1",
    allowedSolveModes: STANDARD_SOLVE_MODES,
    primaryExamFamily: "BANKING",
    nonBankingWeighting: "SOURCE_GATED",
    allocationStatus: "PERMANENT_ALLOCATED",
    englishProductionStatus: "ENGLISH_REVIEW_CANDIDATE",
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
  },
  {
    qlId: "IOP-QL-004",
    title: "Alternating / Interleaved Rearrangement",
    checkpoints: ["IOP-CP-004"],
    semanticContract: "Alternate between materially different placement phases on successive visible steps.",
    discoveryAuthorities: ["IOP-CP004-PROT-001", "IOP-CP004-PROT-002", "IOP-CP004-PROT-003"],
    sourceStatus: "SOURCE_BACKED_V1",
    allowedSolveModes: STANDARD_SOLVE_MODES,
    primaryExamFamily: "BANKING",
    nonBankingWeighting: "SOURCE_GATED",
    allocationStatus: "PERMANENT_ALLOCATED",
    englishProductionStatus: "ENGLISH_REVIEW_CANDIDATE",
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
  },
  {
    qlId: "IOP-QL-005",
    title: "Numeric Transformation Pipeline",
    checkpoints: ["IOP-CP-006", "IOP-CP-008"],
    semanticContract: "Transform and/or reorder numeric tokens through multiple inferable machine stages.",
    discoveryAuthorities: [
      "IOP-CP006-PROT-001", "IOP-CP006-PROT-002", "IOP-CP006-PROT-003",
      "IOP-CP008-PROT-001",
    ],
    sourceStatus: "SOURCE_MODE_WHITELISTED_V1",
    allowedSolveModes: STANDARD_SOLVE_MODES,
    primaryExamFamily: "BANKING",
    nonBankingWeighting: "SOURCE_GATED",
    allocationStatus: "PERMANENT_ALLOCATED",
    englishProductionStatus: "ENGLISH_REVIEW_CANDIDATE",
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
  },
  {
    qlId: "IOP-QL-006",
    title: "Text / Alphanumeric Transformation Pipeline",
    checkpoints: ["IOP-CP-007", "IOP-CP-008"],
    semanticContract: "Transform and/or reorder textual or alphanumeric tokens through multiple inferable machine stages.",
    discoveryAuthorities: [
      "IOP-CP007-PROT-001", "IOP-CP007-PROT-002", "IOP-CP007-PROT-003",
      "IOP-CP008-PROT-002", "IOP-CP008-PROT-003",
    ],
    sourceStatus: "SOURCE_MODE_WHITELISTED_V1",
    allowedSolveModes: STANDARD_SOLVE_MODES,
    primaryExamFamily: "BANKING",
    nonBankingWeighting: "SOURCE_GATED",
    allocationStatus: "PERMANENT_ALLOCATED",
    englishProductionStatus: "ENGLISH_REVIEW_CANDIDATE",
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
  },
  {
    qlId: "IOP-QL-007",
    title: "Mixed Word–Number Transformed-Pair Machine",
    checkpoints: ["IOP-CP-008"],
    semanticContract: "Select a word and a number under independent rules, transform both, place the transformed pair, and repeat.",
    discoveryAuthorities: ["IOP-CP008-GAP-PROT-001"],
    sourceStatus: "SOURCE_PINNED_RBI_GRADE_B_2024",
    allowedSolveModes: STANDARD_SOLVE_MODES,
    primaryExamFamily: "BANKING",
    nonBankingWeighting: "SOURCE_GATED",
    allocationStatus: "PERMANENT_ALLOCATED",
    englishProductionStatus: "ENGLISH_REVIEW_CANDIDATE",
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
  },
  {
    qlId: "IOP-QL-008",
    title: "Box / Table Arithmetic Machine",
    checkpoints: ["IOP-CP-009"],
    semanticContract: "Transform structured cells or boxes through inferable arithmetic relationships across cells and stages.",
    discoveryAuthorities: ["IOP-CP009-PROT-001", "IOP-CP009-PROT-002", "IOP-CP009-PROT-003"],
    sourceStatus: "SOURCE_MODE_WHITELISTED_V1",
    allowedSolveModes: STANDARD_SOLVE_MODES,
    primaryExamFamily: "BANKING",
    nonBankingWeighting: "SOURCE_GATED",
    allocationStatus: "PERMANENT_ALLOCATED",
    englishProductionStatus: "ENGLISH_REVIEW_CANDIDATE",
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
  },
] as const);

export const IOP_001_PERMANENT_ALLOCATION = Object.freeze({
  packageId: "IOP-001" as const,
  chapterId: "REAS-INP" as const,
  maturity: "ENGLISH_REVIEW_CANDIDATE" as const,
  sourceFamilySaturation: "PASS_V1" as const,
  permanentQlCount: IOP_001_PERMANENT_QL_AUTHORITIES.length,
  whitelistedSourceModeCount: 19 as const,
  englishAutomatedScaleProof: "PASS" as const,
  englishHumanAuditPack: "PASS" as const,
  englishArtifactAudit: "PASS" as const,
  englishFreeze: false as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
  hindiPunjabiStatus: "NOT_STARTED" as const,
});

export function getIopPermanentAuthority(qlId: IopPermanentQlId): IopPermanentQlAuthority {
  const authority = IOP_001_PERMANENT_QL_AUTHORITIES.find((candidate) => candidate.qlId === qlId);
  if (!authority) throw new Error(`Unknown IOP permanent QL ${qlId}`);
  return authority;
}

export function assertIop001ProductActivationAllowed(): never {
  throw new Error("IOP-001 is an English review candidate but remains unfrozen; localization and product activation are locked.");
}
