import {
  NUM_CP002_PROPOSED_AUTHORITIES,
  type NumCp002ProposalAuthorityId,
} from "../merge-split/proposal";

export const NUM_CP002_PERMANENT_QL_IDS = [
  "NUM-QL-145", "NUM-QL-146", "NUM-QL-147", "NUM-QL-148",
  "NUM-QL-149", "NUM-QL-150", "NUM-QL-151", "NUM-QL-152",
  "NUM-QL-153", "NUM-QL-154", "NUM-QL-155", "NUM-QL-156",
  "NUM-QL-157", "NUM-QL-158", "NUM-QL-159", "NUM-QL-160",
  "NUM-QL-161", "NUM-QL-162", "NUM-QL-163", "NUM-QL-164",
  "NUM-QL-165",
] as const;

export type NumCp002PermanentQlId = (typeof NUM_CP002_PERMANENT_QL_IDS)[number];
export type NumCp002PermanentQlTemplateId = `NUM-CP002-QLC-${string}`;
export type NumCp002PermanentSolveModeId = `NUM-CP002-SM-${string}`;

export interface NumCp002PermanentAllocationEntry {
  readonly qlId: NumCp002PermanentQlId;
  readonly packageId: "NUM-001";
  readonly cpId: "NUM-CP-002";
  readonly qlTemplateId: NumCp002PermanentQlTemplateId;
  readonly solveModeId: NumCp002PermanentSolveModeId;
  readonly authorityId: NumCp002ProposalAuthorityId;
  readonly title: string;
  readonly corePrototypeIds: readonly string[];
  readonly adapterPrototypeIds: readonly string[];
  readonly governingInference: string;
  readonly mergeDisposition: "RETAIN" | "MERGE_AS_PARAMETERS";
  readonly sourceEvidence: readonly string[];
  readonly difficultyPolicy: "STATE_DERIVED_AT_IMPLEMENTATION_FREEZE";
  readonly allocationStatus: "PRODUCT_OWNER_APPROVED_INACTIVE_ENGLISH_IMPLEMENTATION";
  readonly permanentIdentityFrozen: true;
  readonly solveModeFrozen: true;
  readonly englishImplementationFrozen: true;
  readonly active: false;
  readonly maturity: "ENGLISH_IMPLEMENTATION_FROZEN";
  readonly reviewStatus: "AWAITING_PRODUCT_OWNER_EDITORIAL_REVIEW";
  readonly publiclyPublishable: false;
  readonly questionStudioDiscoverable: false;
  readonly questionBankWritable: false;
  readonly testEligible: false;
}

const QL_TEMPLATE_CODES = [
  "LOWEST-TERM-FRACTION",
  "MIXED-IMPROPER-REPRESENTATION",
  "TERMINATING-DECIMAL-TO-FRACTION",
  "RECURRING-DECIMAL-TO-FRACTION",
  "FRACTION-TO-TERMINATING-DECIMAL",
  "FRACTION-TO-RECURRING-DECIMAL",
  "PAIRWISE-RATIONAL-COMPARISON",
  "MULTI-RATIONAL-ORDERING",
  "INTERIOR-RATIONAL-SELECTION",
  "TERMINATION-CLASSIFICATION",
  "TERMINATION-PLACE-COUNT",
  "RECOVER-DENOMINATOR-EXPONENT",
  "MINIMAL-TERMINATION-INTERVENTION",
  "BOUNDED-TERMINATING-DENOMINATOR-COUNT",
  "BOUNDED-TERMINATING-DENOMINATOR-SET",
  "NUMERATOR-CANCELLATION-FOR-TERMINATION",
  "RECURRING-BLOCK-MISSING-DIGIT",
  "RECURRING-BLOCK-PERIOD-LENGTH",
  "MISSING-FRACTION-COMPONENT",
  "REPRESENTATION-STATEMENT-COMBINATION",
  "REPRESENTATION-DATA-SUFFICIENCY",
] as const;

if (NUM_CP002_PROPOSED_AUTHORITIES.length !== 21) {
  throw new Error("NUM-CP-002 approved authority count must be 21");
}
if (NUM_CP002_PERMANENT_QL_IDS.length !== NUM_CP002_PROPOSED_AUTHORITIES.length) {
  throw new Error("NUM-CP-002 permanent allocation count mismatch");
}

export const NUM_CP002_PERMANENT_ALLOCATION = NUM_CP002_PROPOSED_AUTHORITIES.map((authority, index) => ({
  qlId: NUM_CP002_PERMANENT_QL_IDS[index]!,
  packageId: "NUM-001" as const,
  cpId: "NUM-CP-002" as const,
  qlTemplateId: `NUM-CP002-QLC-${QL_TEMPLATE_CODES[index]!}` as NumCp002PermanentQlTemplateId,
  solveModeId: `NUM-CP002-SM-${String(index + 1).padStart(3, "0")}` as NumCp002PermanentSolveModeId,
  authorityId: authority.authorityId,
  title: authority.title,
  corePrototypeIds: authority.corePrototypeIds,
  adapterPrototypeIds: authority.adapterPrototypeIds,
  governingInference: authority.governingInference,
  mergeDisposition: (authority.corePrototypeIds.length > 1 || authority.adapterPrototypeIds.length > 0
    ? "MERGE_AS_PARAMETERS"
    : "RETAIN") as "RETAIN" | "MERGE_AS_PARAMETERS",
  sourceEvidence: [
    "NUM-CP-002-WAVE01-FOUNDATION",
    "NUM-CP-002-WAVE02-INVERSE-STRUCTURE",
    "NUM-CP-002-WAVE03-SOURCE-SATURATION-CANDIDATE",
    "NUM-CP-002-SOURCE-SATURATION-MERGE-SPLIT-PROPOSAL",
    "PR-785-MERGED-abdabe1c996e6460e7c820503f0c2860fd17bb0b",
    "PRODUCT-OWNER-21-AUTHORITY-APPROVAL-2026-08-14",
    "NUM-CP-002-PERMANENT-ALLOCATION",
    "NUM-CP-002-PERMANENT-ENGLISH-FREEZE",
    ...authority.corePrototypeIds,
    ...authority.adapterPrototypeIds,
  ],
  difficultyPolicy: "STATE_DERIVED_AT_IMPLEMENTATION_FREEZE" as const,
  allocationStatus: "PRODUCT_OWNER_APPROVED_INACTIVE_ENGLISH_IMPLEMENTATION" as const,
  permanentIdentityFrozen: true as const,
  solveModeFrozen: true as const,
  englishImplementationFrozen: true as const,
  active: false as const,
  maturity: "ENGLISH_IMPLEMENTATION_FROZEN" as const,
  reviewStatus: "AWAITING_PRODUCT_OWNER_EDITORIAL_REVIEW" as const,
  publiclyPublishable: false as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
})) satisfies readonly NumCp002PermanentAllocationEntry[];

const allocationByQlId = new Map<NumCp002PermanentQlId, NumCp002PermanentAllocationEntry>(
  NUM_CP002_PERMANENT_ALLOCATION.map((entry) => [entry.qlId, entry]),
);

export function getNumCp002PermanentAllocation(qlId: NumCp002PermanentQlId): NumCp002PermanentAllocationEntry {
  const entry = allocationByQlId.get(qlId);
  if (!entry) throw new Error(`Unknown NUM-CP-002 permanent QL ID: ${qlId}`);
  return entry;
}
