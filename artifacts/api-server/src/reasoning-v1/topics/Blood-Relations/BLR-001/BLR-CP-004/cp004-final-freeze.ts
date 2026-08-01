import { buildBlrCp004Telemetry } from "./cp004-bank";
import {
  BLR_CP004_APPROVAL_DATE,
  BLR_CP004_FREEZE_VERSION,
  BLR_CP004_OWNER_DIRECTIVE,
  BLR_CP004_PERMANENT_CONTRACTS,
  type BlrCp004Authority,
  type BlrCp004PrototypeId,
  type BlrCp004QlId,
} from "./cp004-model";

export const BLR_CP004_SOURCE_AUDIT = [
  {
    dimension: "distinct named family members",
    disposition: "INCLUDE",
    owner: "BLR-CP-004",
  },
  {
    dimension: "male, female, married, explicitly unmarried and unresolved-status member counts",
    disposition: "INCLUDE",
    owner: "BLR-CP-004",
  },
  {
    dimension: "members on a specified generation row",
    disposition: "INCLUDE",
    owner: "BLR-CP-004",
  },
  {
    dimension: "direct, extended, blood and affinal relative counts around one reference",
    disposition: "INCLUDE",
    owner: "BLR-CP-004",
  },
  {
    dimension: "children shared by a named couple",
    disposition: "INCLUDE",
    owner: "BLR-CP-004",
  },
  {
    dimension: "marriage, sibling, parent-child and cousin pair counts",
    disposition: "INCLUDE",
    owner: "BLR-CP-004",
  },
  {
    dimension: "number of occupied generations",
    disposition: "INCLUDE",
    owner: "BLR-CP-004",
  },
  {
    dimension: "multi-component family composition profile",
    disposition: "INCLUDE",
    owner: "BLR-CP-004",
  },
  {
    dimension: "minimum, maximum, possible or indeterminate counts under incomplete evidence",
    disposition: "DELEGATE",
    owner: "BLR-CP-005",
  },
  {
    dimension: "coded-relation counting",
    disposition: "DELEGATE",
    owner: "BLR-CP-006/007",
  },
  {
    dimension: "profession, city, colour, floor or seating composition",
    disposition: "EXCLUDE",
    owner: "Puzzle",
  },
  {
    dimension: "statement-wise count sufficiency",
    disposition: "EXCLUDE",
    owner: "Data Sufficiency",
  },
] as const;

export type BlrCp004MergeDecision = {
  prototypeId: BlrCp004PrototypeId;
  authority: BlrCp004Authority;
  qlId: BlrCp004QlId;
  rationale: string;
};

export const BLR_CP004_MERGE_SPLIT_AUDIT: readonly BlrCp004MergeDecision[] =
  BLR_CP004_PERMANENT_CONTRACTS.flatMap((contract) =>
    contract.sourcePrototypeIds.map((prototypeId) => ({
      prototypeId,
      authority: contract.solveAuthority,
      qlId: contract.qlId,
      rationale:
        contract.solveAuthority === "COUNT_MEMBERS_BY_FILTER"
          ? "The count universe is people; total, gender, status and generation-row predicates are parameters."
          : contract.solveAuthority === "COUNT_RELATIVES_OF_REFERENCE"
            ? "The solver scans a named candidate universe around one reference unit; relation vocabulary and one/two reference anchors are parameters."
            : contract.solveAuthority === "COUNT_RELATION_PAIRS"
              ? "The counted entity is a canonical relation pair; marriage, sibling, parent-child and cousin predicates share the same deduplicate-then-count contract."
              : contract.solveAuthority === "COUNT_GENERATIONS"
                ? "The counted entity is an occupied generation row, materially different from counting people or relation pairs."
                : "The answer is a four-component composition vector and requires all components to match simultaneously.",
    })),
  );

export const BLR_CP004_INVERSE_AND_OVERLAP_AUDIT = [
  {
    cp004Authority: "COUNT_MEMBERS_BY_FILTER",
    comparedAuthority: "BLR-CP-003 family member/set identification",
    decision: "KEEP_SEPARATE",
    rationale:
      "CP-004 returns NUMBER over an explicit universe; CP-003 returns one person or a complete person-name set.",
  },
  {
    cp004Authority: "COUNT_RELATIVES_OF_REFERENCE",
    comparedAuthority: "BLR-QL-002 and BLR-QL-010",
    decision: "KEEP_SEPARATE",
    rationale:
      "Identifying one/all matching people and returning only their cardinality have different answer semantics, distractors and omission rules.",
  },
  {
    cp004Authority: "COUNT_RELATION_PAIRS",
    comparedAuthority: "BLR-QL-009 SELECT_UNORDERED_FAMILY_PAIR",
    decision: "KEEP_SEPARATE",
    rationale:
      "Selecting one pair from options is not the same as enumerating every matching pair, canonicalising direction and returning the count.",
  },
  {
    cp004Authority: "COUNT_GENERATIONS",
    comparedAuthority: "BLR-QL-006 COMPARE_GENERATIONS",
    decision: "KEEP_SEPARATE",
    rationale:
      "BLR-QL-006 compares two people; CP-004 counts all occupied generation rows in the explicit family universe.",
  },
  {
    cp004Authority: "SELECT_FAMILY_COMPOSITION_PROFILE",
    comparedAuthority: "all earlier BLR authorities",
    decision: "NEW_CONTRACT",
    rationale:
      "The answer is a count vector whose components must all be jointly correct; no earlier authority owns this output domain.",
  },
] as const;

export const BLR_CP004_FINAL_FREEZE = {
  version: BLR_CP004_FREEZE_VERSION,
  approvalDate: BLR_CP004_APPROVAL_DATE,
  approvedBy: "PROJECT_OWNER" as const,
  ownerDirective: BLR_CP004_OWNER_DIRECTIVE,
  checkpointId: "BLR-CP-004" as const,
  state: "ENGLISH_DISCOVERY_FROZEN" as const,
  telemetry: buildBlrCp004Telemetry(),
  permanentQlRange: "BLR-QL-013..BLR-QL-017" as const,
  permanentQlIds: BLR_CP004_PERMANENT_CONTRACTS.map((contract) => contract.qlId),
  nextAvailableChapterQlId: "BLR-QL-018" as const,
  sourcePrototypeCount: 13,
  solveAuthorityCount: 5,
  structuralSaturationApproved: true,
  finalDiscoveryFreezeApproved: true,
  releaseLock: {
    englishReviewOnly: true,
    questionStudioAllowed: false,
    questionBankWriteAllowed: false,
    mockTestAllowed: false,
    localisationAllowed: false,
    publicPublicationAllowed: false,
    productionStagingAllowed: false,
    mergeAllowed: false,
  },
} as const;
