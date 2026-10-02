import {
  SER_CP008_AUDITED_QL_IDS,
  SER_CP008_MERGED_INTO_EXISTING_QLS,
  SER_CP008_REJECTED_SOURCE_GAPS,
} from "../SER-CP-008-AUDIT-REMEDIATION/audited-candidate";
import {
  SER_CP009_AUDITED_QL_IDS,
  SER_CP009_MERGED_INTO_EXISTING_QLS,
  SER_CP009_MERGED_WITHIN_CP009,
  SER_CP009_REJECTED_SOURCE_GAP,
} from "../SER-CP-009-NUMBER-SERIES-AUDIT/number-series-audited";

export const SER_CP010_CHECKPOINT_ID = "SER-CP-010" as const;
export const SER_CP010_PERMANENT_ALLOCATION_AUTHORITY =
  "SER_CP010_SOURCE_BACKED_PROMOTION_2026_10_02_V1" as const;

export const SER_CP010_PERMANENT_QL_IDS = [
  "SER-QL-014",
  "SER-QL-015",
  "SER-QL-016",
  "SER-QL-017",
  "SER-QL-018",
  "SER-QL-019",
  "SER-QL-020",
  "SER-QL-021",
  "SER-QL-022",
  "SER-QL-023",
  "SER-QL-024",
  "SER-QL-025",
  "SER-QL-026",
  "SER-QL-027",
  "SER-QL-028",
  "SER-QL-029",
] as const;

export type SerCp010PermanentQlId =
  (typeof SER_CP010_PERMANENT_QL_IDS)[number];

export interface SerCp010PermanentAllocationEntry {
  readonly permanentQlId: SerCp010PermanentQlId;
  readonly sourceCheckpointId: "SER-CP-008" | "SER-CP-009";
  readonly sourceProvisionalQlIds: readonly string[];
  readonly sourceAuthorityId: string;
  readonly title: string;
  readonly solveContract: string;
  readonly answerSemantic:
    | "ALPHANUMERIC_TERM"
    | "ALPHANUMERIC_WRONG_TERM"
    | "NUMBER_TERM"
    | "NUMBER_WRONG_TERM";
  readonly allocationStatus: "PERMANENT_ID_ALLOCATED_INACTIVE";
  readonly promotionBasis: "SOURCE_BACKED_AUDITED_CANDIDATE";
  readonly promotionApproval: "PRODUCT_OWNER_APPROVED_2026_10_02";
  readonly multilingualAuditStatus: "EN_HI_PA_AUDIT_PROVEN";
  readonly active: false;
  readonly questionStudioDiscoverable: false;
  readonly questionBankWritable: false;
  readonly testEligible: false;
  readonly mockTestEligible: false;
  readonly publiclyPublishable: false;
  readonly automaticStudentPublication: false;
}

const entries: readonly Omit<
  SerCp010PermanentAllocationEntry,
  | "allocationStatus"
  | "promotionBasis"
  | "promotionApproval"
  | "multilingualAuditStatus"
  | "active"
  | "questionStudioDiscoverable"
  | "questionBankWritable"
  | "testEligible"
  | "mockTestEligible"
  | "publiclyPublishable"
  | "automaticStudentPublication"
>[] = [
  {
    permanentQlId: "SER-QL-014",
    sourceCheckpointId: "SER-CP-008",
    sourceProvisionalQlIds: ["SER-QL-016"],
    sourceAuthorityId: "ALPHANUMERIC_PARALLEL_CHANNELS",
    title: "Parallel alphanumeric channels",
    solveContract:
      "Track the letter and number channels independently across terms and apply their fixed movements together.",
    answerSemantic: "ALPHANUMERIC_TERM",
  },
  {
    permanentQlId: "SER-QL-015",
    sourceCheckpointId: "SER-CP-008",
    sourceProvisionalQlIds: ["SER-QL-017"],
    sourceAuthorityId: "ALPHANUMERIC_INTERLEAVED_CHANNELS",
    title: "Interleaved alphanumeric channels",
    solveContract:
      "Separate alternating alphanumeric rows and continue the governed letter-number channels in the target row.",
    answerSemantic: "ALPHANUMERIC_TERM",
  },
  {
    permanentQlId: "SER-QL-016",
    sourceCheckpointId: "SER-CP-008",
    sourceProvisionalQlIds: ["SER-QL-018"],
    sourceAuthorityId: "ALPHANUMERIC_CLUSTER_NUMBER_CHANNELS",
    title: "Letter-cluster and number channels",
    solveContract:
      "Track both letter positions and the numeric component as independently governed channels across terms.",
    answerSemantic: "ALPHANUMERIC_TERM",
  },
  {
    permanentQlId: "SER-QL-017",
    sourceCheckpointId: "SER-CP-008",
    sourceProvisionalQlIds: ["SER-QL-021"],
    sourceAuthorityId: "ALPHANUMERIC_DUAL_LETTER_PROGRESSIVE_NUMBER",
    title: "Dual-letter channels with progressive numeric gaps",
    solveContract:
      "Continue two fixed letter channels while the numeric channel advances through a governed progression of gaps.",
    answerSemantic: "ALPHANUMERIC_TERM",
  },
  {
    permanentQlId: "SER-QL-018",
    sourceCheckpointId: "SER-CP-008",
    sourceProvisionalQlIds: ["SER-QL-022"],
    sourceAuthorityId: "ALPHANUMERIC_PROGRESSIVE_DUAL_CHANNEL",
    title: "Progressive letter and number jumps",
    solveContract:
      "Continue a mixed token series in which the letter jump and numeric jump each evolve by a fixed increment.",
    answerSemantic: "ALPHANUMERIC_TERM",
  },
  {
    permanentQlId: "SER-QL-019",
    sourceCheckpointId: "SER-CP-008",
    sourceProvisionalQlIds: ["SER-QL-023"],
    sourceAuthorityId: "ALPHANUMERIC_SQUARE_POSITION_COUPLING",
    title: "Square-position alphanumeric coupling",
    solveContract:
      "Continue consecutive square values while coupling each value to its wrapped alphabet-position representation.",
    answerSemantic: "ALPHANUMERIC_TERM",
  },
  {
    permanentQlId: "SER-QL-020",
    sourceCheckpointId: "SER-CP-008",
    sourceProvisionalQlIds: ["SER-QL-024"],
    sourceAuthorityId: "ALPHANUMERIC_LETTER_POSITION_SQUARE",
    title: "Letter-position square coupling",
    solveContract:
      "Move the letter by the governed alphabet step and derive the numeric component from the square of its alphabet position.",
    answerSemantic: "ALPHANUMERIC_TERM",
  },
  {
    permanentQlId: "SER-QL-021",
    sourceCheckpointId: "SER-CP-008",
    sourceProvisionalQlIds: ["SER-QL-025"],
    sourceAuthorityId: "ALPHANUMERIC_INDEX_SQUARE_WRONG_TERM",
    title: "Wrong-term alphanumeric square progression",
    solveContract:
      "Track the governed letter movement and index-square numeric progression to identify the sole corrupted mixed term.",
    answerSemantic: "ALPHANUMERIC_WRONG_TERM",
  },
  {
    permanentQlId: "SER-QL-022",
    sourceCheckpointId: "SER-CP-008",
    sourceProvisionalQlIds: ["SER-QL-027"],
    sourceAuthorityId: "ALPHANUMERIC_DUAL_LETTER_INDEX_SQUARE",
    title: "Opposing letter channels with square numbers",
    solveContract:
      "Continue two signed letter channels together with the consecutive-square numeric channel.",
    answerSemantic: "ALPHANUMERIC_TERM",
  },
  {
    permanentQlId: "SER-QL-023",
    sourceCheckpointId: "SER-CP-009",
    sourceProvisionalQlIds: ["SER-QL-029", "SER-QL-030", "SER-QL-031", "SER-QL-037"],
    sourceAuthorityId: "FIRST_DIFFERENCE_NUMBER_SERIES",
    title: "First-difference number series",
    solveContract:
      "Derive consecutive first differences, identify the governed difference pattern, and extend the series.",
    answerSemantic: "NUMBER_TERM",
  },
  {
    permanentQlId: "SER-QL-024",
    sourceCheckpointId: "SER-CP-009",
    sourceProvisionalQlIds: ["SER-QL-032"],
    sourceAuthorityId: "CONSTANT_RATIO_NUMBER_SERIES",
    title: "Constant-ratio number series",
    solveContract:
      "Continue a numeric series governed by exact repeated multiplication or division by one factor.",
    answerSemantic: "NUMBER_TERM",
  },
  {
    permanentQlId: "SER-QL-025",
    sourceCheckpointId: "SER-CP-009",
    sourceProvisionalQlIds: ["SER-QL-033"],
    sourceAuthorityId: "ALTERNATING_OPERATION_NUMBER_SERIES",
    title: "Alternating-operation number series",
    solveContract:
      "Identify and continue the repeating alternating arithmetic-operation cycle.",
    answerSemantic: "NUMBER_TERM",
  },
  {
    permanentQlId: "SER-QL-026",
    sourceCheckpointId: "SER-CP-009",
    sourceProvisionalQlIds: ["SER-QL-035"],
    sourceAuthorityId: "PROGRESSIVE_MULTIPLIER_ADJUSTMENT_SERIES",
    title: "Progressive multiplier and adjustment series",
    solveContract:
      "Continue a series with governed progressive multipliers and a bounded fixed adjustment, including factorial-style zero-adjustment forms.",
    answerSemantic: "NUMBER_TERM",
  },
  {
    permanentQlId: "SER-QL-027",
    sourceCheckpointId: "SER-CP-009",
    sourceProvisionalQlIds: ["SER-QL-036"],
    sourceAuthorityId: "DIRECT_POWER_NUMBER_SERIES",
    title: "Direct power and offset series",
    solveContract:
      "Continue square or cube values generated from a governed base progression with a bounded fixed offset.",
    answerSemantic: "NUMBER_TERM",
  },
  {
    permanentQlId: "SER-QL-028",
    sourceCheckpointId: "SER-CP-009",
    sourceProvisionalQlIds: ["SER-QL-038"],
    sourceAuthorityId: "FIBONACCI_LIKE_NUMBER_SERIES",
    title: "Previous-two-term recurrence",
    solveContract:
      "Continue a numeric series in which each new term is the sum of the previous two terms.",
    answerSemantic: "NUMBER_TERM",
  },
  {
    permanentQlId: "SER-QL-029",
    sourceCheckpointId: "SER-CP-009",
    sourceProvisionalQlIds: ["SER-QL-040"],
    sourceAuthorityId: "WRONG_TERM_PATTERN_SERIES",
    title: "Wrong-term number-series diagnosis",
    solveContract:
      "Identify the sole corrupted term in a governed power/offset or factorial-style numeric progression.",
    answerSemantic: "NUMBER_WRONG_TERM",
  },
];

export const SER_CP010_PERMANENT_ALLOCATIONS: readonly SerCp010PermanentAllocationEntry[] =
  Object.freeze(
    entries.map((entry) =>
      Object.freeze({
        ...entry,
        allocationStatus: "PERMANENT_ID_ALLOCATED_INACTIVE" as const,
        promotionBasis: "SOURCE_BACKED_AUDITED_CANDIDATE" as const,
        promotionApproval: "PRODUCT_OWNER_APPROVED_2026_10_02" as const,
        multilingualAuditStatus: "EN_HI_PA_AUDIT_PROVEN" as const,
        active: false as const,
        questionStudioDiscoverable: false as const,
        questionBankWritable: false as const,
        testEligible: false as const,
        mockTestEligible: false as const,
        publiclyPublishable: false as const,
        automaticStudentPublication: false as const,
      }),
    ),
  );

export const SER_CP010_SOURCE_PROVISIONAL_TO_PERMANENT = Object.freeze(
  Object.fromEntries(
    SER_CP010_PERMANENT_ALLOCATIONS.flatMap((entry) =>
      entry.sourceProvisionalQlIds.map((sourceQlId) => [
        sourceQlId,
        entry.permanentQlId,
      ]),
    ),
  ) as Readonly<Record<string, SerCp010PermanentQlId>>,
);

export const SER_CP010_MERGED_EXISTING_VARIANTS = Object.freeze([
  ...SER_CP008_MERGED_INTO_EXISTING_QLS,
  ...SER_CP009_MERGED_INTO_EXISTING_QLS,
]);

export const SER_CP010_REJECTED_SOURCE_IDENTITIES = Object.freeze([
  ...SER_CP008_REJECTED_SOURCE_GAPS,
  SER_CP009_REJECTED_SOURCE_GAP,
]);

export const SER_CP010_WITHIN_CP009_SUBTYPE_MERGES =
  SER_CP009_MERGED_WITHIN_CP009;

const cp008Retained = new Set<string>(SER_CP008_AUDITED_QL_IDS);
const cp009Retained = new Set<string>(SER_CP009_AUDITED_QL_IDS);
const allocatedSourceRoots = new Set(
  SER_CP010_PERMANENT_ALLOCATIONS.map((entry) => entry.sourceProvisionalQlIds[0]!),
);

if (
  [...cp008Retained, ...cp009Retained].some(
    (sourceQlId) => !allocatedSourceRoots.has(sourceQlId),
  )
) {
  throw new Error("SER-CP-010 permanent allocation does not cover every retained audited source root.");
}
