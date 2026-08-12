import {
  NUM_CP007_PROPOSED_AUTHORITIES,
  type NumCp007DiscoveredPrototypeId,
} from "../post-wave04-authority-proposal.ts";

export const NUM_CP007_PERMANENT_QL_IDS = [
  "NUM-QL-098", "NUM-QL-099", "NUM-QL-100", "NUM-QL-101",
  "NUM-QL-102", "NUM-QL-103", "NUM-QL-104", "NUM-QL-105",
  "NUM-QL-106", "NUM-QL-107", "NUM-QL-108", "NUM-QL-109",
  "NUM-QL-110", "NUM-QL-111", "NUM-QL-112", "NUM-QL-113",
  "NUM-QL-114", "NUM-QL-115", "NUM-QL-116", "NUM-QL-117",
  "NUM-QL-118", "NUM-QL-119", "NUM-QL-120", "NUM-QL-121",
  "NUM-QL-122", "NUM-QL-123",
] as const;

export type NumCp007PermanentQlId = (typeof NUM_CP007_PERMANENT_QL_IDS)[number];
export type NumCp007PermanentQlTemplateId = `NUM-CP007-QLC-${string}`;
export type NumCp007PermanentSolveModeId = `NUM-CP007-SM-${string}`;

export interface NumCp007PermanentAllocationEntry {
  readonly qlId: NumCp007PermanentQlId;
  readonly packageId: "NUM-002";
  readonly cpId: "NUM-CP-007";
  readonly qlTemplateId: NumCp007PermanentQlTemplateId;
  readonly solveModeId: NumCp007PermanentSolveModeId;
  readonly authorityId: (typeof NUM_CP007_PROPOSED_AUTHORITIES)[number]["authorityId"];
  readonly title: string;
  readonly prototypeIds: readonly NumCp007DiscoveredPrototypeId[];
  readonly governingInvariant: string;
  readonly mergeDisposition: "RETAIN" | "MERGE_AS_PARAMETERS";
  readonly sourceEvidence: readonly string[];
  readonly difficultyPolicy: "STATE_DERIVED";
  readonly language: "en";
  readonly allocationStatus: "PRODUCT_OWNER_APPROVED_INACTIVE_ENGLISH_IMPLEMENTATION";
  readonly permanentIdentityFrozen: true;
  readonly active: false;
  readonly maturity: "ENGLISH_IMPLEMENTATION_FROZEN";
  readonly reviewStatus: "PRODUCT_OWNER_COMPLETION_AUTHORISED";
  readonly publiclyPublishable: false;
  readonly questionStudioDiscoverable: false;
  readonly questionBankWritable: false;
  readonly testEligible: false;
}

const QL_TEMPLATE_CODES = [
  "RECOVER-REMAINDER",
  "RECOVER-DIVIDEND",
  "RECOVER-DIVISOR",
  "RECOVER-QUOTIENT",
  "VALID-DIVISION-STATEMENT",
  "SIGNED-ADDITIVE-REMAINDER",
  "MULTIPLICATIVE-REMAINDER",
  "EXACT-DIVISIBILITY-ADJUSTMENT",
  "SINGLE-RESIDUE-EXPRESSION-REMAINDER",
  "COMPATIBLE-NESTED-REMAINDER",
  "LINKED-DIVISION-RELATION",
  "BOUNDED-NONZERO-RESIDUE-COUNT",
  "BOUNDED-SOLUTION-TOPOLOGY",
  "NEAREST-MULTIPLE-CLASSIFICATION",
  "UNIQUE-BOUNDED-RESIDUE-RECONSTRUCTION",
  "COMPLETE-BOUNDED-RESIDUE-SET",
  "DIVISION-STATE-CLASSIFICATION",
  "SAME-REMAINDER-DIVISOR-RECONSTRUCTION",
  "QUOTIENT-REMAINDER-PAIR",
  "STATEMENT-COMBINATION",
  "DATA-SUFFICIENCY",
  "INVERSE-REMAINDER-PROPAGATION",
  "SUCCESSIVE-QUOTIENT-DIVISION",
  "WRONG-DIVISOR-CORRECTION",
  "LONG-DIVISION-TRACE",
  "BOUNDED-NONZERO-REMAINDER-EXTREMUM",
] as const;

if (NUM_CP007_PROPOSED_AUTHORITIES.length !== 26) {
  throw new Error("NUM-CP-007 approved authority count must be 26");
}
if (NUM_CP007_PERMANENT_QL_IDS.length !== NUM_CP007_PROPOSED_AUTHORITIES.length) {
  throw new Error("NUM-CP-007 permanent allocation count mismatch");
}

export const NUM_CP007_PERMANENT_ALLOCATION = NUM_CP007_PROPOSED_AUTHORITIES.map((authority, index) => ({
  qlId: NUM_CP007_PERMANENT_QL_IDS[index]!,
  packageId: "NUM-002" as const,
  cpId: "NUM-CP-007" as const,
  qlTemplateId: `NUM-CP007-QLC-${QL_TEMPLATE_CODES[index]!}` as NumCp007PermanentQlTemplateId,
  solveModeId: `NUM-CP007-SM-${String(index + 1).padStart(3, "0")}` as NumCp007PermanentSolveModeId,
  authorityId: authority.authorityId,
  title: authority.title,
  prototypeIds: authority.prototypes,
  governingInvariant: authority.rationale,
  mergeDisposition: authority.prototypes.length > 1 ? "MERGE_AS_PARAMETERS" as const : "RETAIN" as const,
  sourceEvidence: [
    "NUM-CP-007-POST-WAVE04-SOURCE-SATURATION-AND-MERGE-SPLIT-AUDIT",
    ...authority.prototypes,
    "NUM-CP-007-PRODUCT-OWNER-26-AUTHORITY-APPROVAL",
  ],
  difficultyPolicy: "STATE_DERIVED" as const,
  language: "en" as const,
  allocationStatus: "PRODUCT_OWNER_APPROVED_INACTIVE_ENGLISH_IMPLEMENTATION" as const,
  permanentIdentityFrozen: true as const,
  active: false as const,
  maturity: "ENGLISH_IMPLEMENTATION_FROZEN" as const,
  reviewStatus: "PRODUCT_OWNER_COMPLETION_AUTHORISED" as const,
  publiclyPublishable: false as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
})) satisfies readonly NumCp007PermanentAllocationEntry[];

const allocationByQlId = new Map<NumCp007PermanentQlId, NumCp007PermanentAllocationEntry>(
  NUM_CP007_PERMANENT_ALLOCATION.map((entry) => [entry.qlId, entry]),
);

export function getNumCp007PermanentAllocation(qlId: NumCp007PermanentQlId): NumCp007PermanentAllocationEntry {
  const entry = allocationByQlId.get(qlId);
  if (!entry) throw new Error(`Unknown NUM-CP-007 permanent QL ID: ${qlId}`);
  return entry;
}
