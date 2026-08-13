import {
  NUM_CP001_PROPOSED_AUTHORITIES,
} from "../audit/merge-split-registry";

export const NUM_CP001_PERMANENT_QL_IDS = [
  "NUM-QL-124", "NUM-QL-125", "NUM-QL-126", "NUM-QL-127",
  "NUM-QL-128", "NUM-QL-129", "NUM-QL-130", "NUM-QL-131",
  "NUM-QL-132", "NUM-QL-133", "NUM-QL-134", "NUM-QL-135",
  "NUM-QL-136", "NUM-QL-137", "NUM-QL-138", "NUM-QL-139",
  "NUM-QL-140", "NUM-QL-141", "NUM-QL-142", "NUM-QL-143",
  "NUM-QL-144",
] as const;

export type NumCp001PermanentQlId = (typeof NUM_CP001_PERMANENT_QL_IDS)[number];
export type NumCp001PermanentQlTemplateId = `NUM-CP001-QLC-${string}`;
export type NumCp001PermanentSolveModeId = `NUM-CP001-SM-${string}`;

export interface NumCp001PermanentAllocationEntry {
  readonly qlId: NumCp001PermanentQlId;
  readonly packageId: "NUM-001";
  readonly cpId: "NUM-CP-001";
  readonly qlTemplateId: NumCp001PermanentQlTemplateId;
  readonly solveModeId: NumCp001PermanentSolveModeId;
  readonly proposalId: (typeof NUM_CP001_PROPOSED_AUTHORITIES)[number]["proposalId"];
  readonly title: string;
  readonly prototypeIds: readonly string[];
  readonly governingInvariant: string;
  readonly mergeDisposition: "RETAIN" | "MERGE_AS_PARAMETERS";
  readonly sourceEvidence: readonly string[];
  readonly difficultyPolicy: "STATE_DERIVED";
  readonly language: "en";
  readonly allocationStatus: "PRODUCT_OWNER_APPROVED_INACTIVE_MULTILINGUAL_IMPLEMENTATION";
  readonly permanentIdentityFrozen: true;
  readonly solveModeFrozen: true;
  readonly englishImplementationFrozen: true;
  readonly active: false;
  readonly maturity: "MULTILINGUAL_IMPLEMENTATION_FROZEN";
  readonly reviewStatus: "PRODUCT_OWNER_COMPLETION_AUTHORISED";
  readonly publiclyPublishable: false;
  readonly questionStudioDiscoverable: false;
  readonly questionBankWritable: false;
  readonly testEligible: false;
}

const QL_TEMPLATE_CODES = [
  "SMALLEST-NUMBER-SET",
  "BOUNDARY-SET-PARITY-CLAIM",
  "EXACT-SIGNED-ORDERING",
  "DIRECT-NUMBER-LINE-DISTANCE",
  "INTEGER-COUNT-EXACT-BOUNDS",
  "DIRECT-PARITY-DISCRIMINATION",
  "PARITY-CLAIM-TRUTH-TOPOLOGY",
  "CONSECUTIVE-BLOCK-RECONSTRUCTION",
  "OUTSIDER-FROM-NUMBER-SET",
  "EXTREMAL-INTEGER-UNDER-BOUND",
  "RECOVER-INTERVAL-ENDPOINT",
  "FILTERED-INTEGER-INTERVAL-COUNT",
  "INVERSE-NUMBER-LINE-DISTANCE",
  "RECOVER-PARITY-CONDITION",
  "COMPOUND-RATIONALITY-CLASSIFICATION",
  "INTEGER-INTERVAL-CARDINALITY-TOPOLOGY",
  "CONSECUTIVE-BLOCK-TARGET-MEMBER",
  "CONSECUTIVE-BLOCK-SUM-FEASIBILITY",
  "INTEGER-STRUCTURE-STATEMENT-COMBINATION",
  "INTEGER-STRUCTURE-DATA-SUFFICIENCY",
  "GUARANTEED-CONSECUTIVE-PRODUCT-DIVISOR",
] as const;

if (NUM_CP001_PROPOSED_AUTHORITIES.length !== 21) {
  throw new Error("NUM-CP-001 approved authority count must be 21");
}
if (NUM_CP001_PERMANENT_QL_IDS.length !== NUM_CP001_PROPOSED_AUTHORITIES.length) {
  throw new Error("NUM-CP-001 permanent allocation count mismatch");
}

export const NUM_CP001_PERMANENT_ALLOCATION = NUM_CP001_PROPOSED_AUTHORITIES.map((authority, index) => ({
  qlId: NUM_CP001_PERMANENT_QL_IDS[index]!,
  packageId: "NUM-001" as const,
  cpId: "NUM-CP-001" as const,
  qlTemplateId: `NUM-CP001-QLC-${QL_TEMPLATE_CODES[index]!}` as NumCp001PermanentQlTemplateId,
  solveModeId: `NUM-CP001-SM-${String(index + 1).padStart(3, "0")}` as NumCp001PermanentSolveModeId,
  proposalId: authority.proposalId,
  title: authority.title,
  prototypeIds: authority.prototypeIds,
  governingInvariant: authority.governingInvariant,
  mergeDisposition: authority.disposition,
  sourceEvidence: [
    "NUM-CP-001-WAVE-04-SOURCE-SATURATION",
    "NUM-CP-001-WAVE-05-MERGE-SPLIT-AUDIT",
    "PR-750-MERGED-75ab2ec665278b3979c92120c8d58cb34242870f",
    "PRODUCT-OWNER-21-AUTHORITY-APPROVAL-2026-08-13",
    "NUM-CP-001-PERMANENT-ENGLISH-FREEZE",
    "NUM-CP-001-HINDI-PUNJABI-MULTILINGUAL-FREEZE",
    ...authority.prototypeIds,
  ],
  difficultyPolicy: "STATE_DERIVED" as const,
  language: "en" as const,
  allocationStatus: "PRODUCT_OWNER_APPROVED_INACTIVE_MULTILINGUAL_IMPLEMENTATION" as const,
  permanentIdentityFrozen: true as const,
  solveModeFrozen: true as const,
  englishImplementationFrozen: true as const,
  active: false as const,
  maturity: "MULTILINGUAL_IMPLEMENTATION_FROZEN" as const,
  reviewStatus: "PRODUCT_OWNER_COMPLETION_AUTHORISED" as const,
  publiclyPublishable: false as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
})) satisfies readonly NumCp001PermanentAllocationEntry[];

const allocationByQlId = new Map<NumCp001PermanentQlId, NumCp001PermanentAllocationEntry>(
  NUM_CP001_PERMANENT_ALLOCATION.map((entry) => [entry.qlId, entry]),
);

export function getNumCp001PermanentAllocation(qlId: NumCp001PermanentQlId): NumCp001PermanentAllocationEntry {
  const entry = allocationByQlId.get(qlId);
  if (!entry) throw new Error(`Unknown NUM-CP-001 permanent QL ID: ${qlId}`);
  return entry;
}
