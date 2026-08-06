import {
  NUM_CP005_PROPOSED_AUTHORITIES,
  type NumCp005PrototypeId,
} from "../audit/merge-split-registry";

export const NUM_CP005_PERMANENT_QL_IDS = [
  "NUM-QL-046", "NUM-QL-047", "NUM-QL-048", "NUM-QL-049",
  "NUM-QL-050", "NUM-QL-051", "NUM-QL-052", "NUM-QL-053",
  "NUM-QL-054", "NUM-QL-055", "NUM-QL-056", "NUM-QL-057",
  "NUM-QL-058", "NUM-QL-059", "NUM-QL-060", "NUM-QL-061",
  "NUM-QL-062", "NUM-QL-063", "NUM-QL-064", "NUM-QL-065",
  "NUM-QL-066", "NUM-QL-067", "NUM-QL-068", "NUM-QL-069",
] as const;

export type NumCp005PermanentQlId =
  (typeof NUM_CP005_PERMANENT_QL_IDS)[number];

export type NumCp005PermanentQlTemplateId = `NUM-CP005-QLC-${string}`;
export type NumCp005PermanentSolveModeId = `NUM-CP005-SM-${string}`;

export interface NumCp005PermanentAllocationEntry {
  readonly qlId: NumCp005PermanentQlId;
  readonly packageId: "NUM-001";
  readonly cpId: "NUM-CP-005";
  readonly qlTemplateId: NumCp005PermanentQlTemplateId;
  readonly solveModeId: NumCp005PermanentSolveModeId;
  readonly authorityId: (typeof NUM_CP005_PROPOSED_AUTHORITIES)[number]["proposalId"];
  readonly title: string;
  readonly prototypeIds: readonly NumCp005PrototypeId[];
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
  "TOTAL-PROPER-DIVISOR-COUNT",
  "ODD-EVEN-DIVISOR-COUNT",
  "DIVISIBILITY-CONSTRAINED-DIVISOR-COUNT",
  "MULTI-CONDITION-DIVISOR-SUBSET-COUNT",
  "PERFECT-POWER-DIVISOR-COUNT",
  "TOTAL-PROPER-DIVISOR-SUM",
  "DIVISOR-PRODUCT",
  "COMPLETE-DIVISOR-SET",
  "MISSING-EXPONENT-FROM-DIVISOR-COUNT",
  "PRIME-POWER-RECONSTRUCTION",
  "LEAST-INTEGER-EXACT-DIVISOR-COUNT",
  "GREATEST-BOUNDED-INTEGER-EXACT-DIVISOR-COUNT",
  "GREATEST-DIVISOR-WITHIN-BOUND",
  "INDEXED-DIVISOR",
  "BOUNDED-INTERVAL-EXACT-DIVISOR-COUNT",
  "DIVISOR-FUNCTION-CLAIM",
  "DIVISOR-FUNCTION-STATEMENT-COMBINATION",
  "DIVISOR-PAIR-TABLE-COMPLETION",
  "INVERSE-SOLUTION-CLASSIFICATION",
  "COMPLETE-EXPONENT-PAIR-SET",
  "COMPLETE-POSSIBLE-INTEGER-SET",
  "PRIME-EXPONENT-TABLE-MATCH",
  "DIVISOR-FUNCTION-CASELET-COMPARISON",
  "DIVISOR-FUNCTION-DATA-SUFFICIENCY",
] as const;

if (NUM_CP005_PROPOSED_AUTHORITIES.length !== 24) {
  throw new Error("NUM-CP-005 approved authority count must be 24");
}
if (NUM_CP005_PERMANENT_QL_IDS.length !== NUM_CP005_PROPOSED_AUTHORITIES.length) {
  throw new Error("NUM-CP-005 allocation count mismatch");
}

export const NUM_CP005_PERMANENT_ALLOCATION =
  NUM_CP005_PROPOSED_AUTHORITIES.map((authority, index) => ({
    qlId: NUM_CP005_PERMANENT_QL_IDS[index]!,
    packageId: "NUM-001" as const,
    cpId: "NUM-CP-005" as const,
    qlTemplateId: `NUM-CP005-QLC-${QL_TEMPLATE_CODES[index]!}` as NumCp005PermanentQlTemplateId,
    solveModeId: `NUM-CP005-SM-${String(index + 1).padStart(3, "0")}` as NumCp005PermanentSolveModeId,
    authorityId: authority.proposalId,
    title: authority.title,
    prototypeIds: authority.prototypeIds,
    governingInvariant: authority.governingInvariant,
    mergeDisposition: authority.disposition,
    sourceEvidence: [
      "NUM-CP-005-SOURCE-GAP-AND-MERGE-SPLIT-AUDIT",
      ...authority.prototypeIds,
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
  })) satisfies readonly NumCp005PermanentAllocationEntry[];

const allocationByQlId = new Map<NumCp005PermanentQlId, NumCp005PermanentAllocationEntry>(
  NUM_CP005_PERMANENT_ALLOCATION.map((entry) => [entry.qlId, entry]),
);

export function getNumCp005PermanentAllocation(
  qlId: NumCp005PermanentQlId,
): NumCp005PermanentAllocationEntry {
  const entry = allocationByQlId.get(qlId);
  if (!entry) throw new Error(`Unknown NUM-CP-005 permanent QL ID: ${qlId}`);
  return entry;
}
