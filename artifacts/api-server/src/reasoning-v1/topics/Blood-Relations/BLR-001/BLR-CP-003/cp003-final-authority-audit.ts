export const BLR_CP003_FINAL_AUTHORITY_AUDIT_VERSION =
  "BLR_CP003_FINAL_AUTHORITY_AUDIT_V1" as const;

export type BlrCp003PermanentQlId =
  | "BLR-QL-009"
  | "BLR-QL-010"
  | "BLR-QL-011"
  | "BLR-QL-012";

export type BlrCp003PermanentAuthority =
  | "SELECT_UNORDERED_FAMILY_PAIR"
  | "IDENTIFY_ALL_MEMBERS_BY_RELATION"
  | "IDENTIFY_MEMBER_BY_MARITAL_STATUS"
  | "IDENTIFY_PERSON_BY_EXACT_LINEAGE";

export type BlrCp003SourceAuthority =
  | BlrCp003PermanentAuthority
  | "IDENTIFY_MEMBER_WITH_UNRESOLVED_MARITAL_STATUS";

export const BLR_CP003_PERMANENT_QL_BY_AUTHORITY: Readonly<
  Record<BlrCp003PermanentAuthority, BlrCp003PermanentQlId>
> = {
  SELECT_UNORDERED_FAMILY_PAIR: "BLR-QL-009",
  IDENTIFY_ALL_MEMBERS_BY_RELATION: "BLR-QL-010",
  IDENTIFY_MEMBER_BY_MARITAL_STATUS: "BLR-QL-011",
  IDENTIFY_PERSON_BY_EXACT_LINEAGE: "BLR-QL-012",
} as const;

export const BLR_CP003_FINAL_AUTHORITY_DECISIONS = [
  {
    sourceAuthority: "SELECT_UNORDERED_FAMILY_PAIR",
    decision: "FREEZE_NEW",
    finalAuthority: "SELECT_UNORDERED_FAMILY_PAIR",
    qlId: "BLR-QL-009",
    answerType: "UNORDERED_PERSON_PAIR",
    rationale:
      "The answer is an unordered pair of named people. Reversing the two names does not create a different answer, so this cannot merge into BLR-QL-004's ordered subject-reference pair contract.",
  },
  {
    sourceAuthority: "IDENTIFY_ALL_MEMBERS_BY_RELATION",
    decision: "FREEZE_NEW",
    finalAuthority: "IDENTIFY_ALL_MEMBERS_BY_RELATION",
    qlId: "BLR-QL-010",
    answerType: "PERSON_NAME_SET",
    rationale:
      "The solver must collect every matching named member. Both omission and addition are independently wrong, which is materially different from one-person identification.",
  },
  {
    sourceAuthority: "IDENTIFY_MEMBER_BY_MARITAL_STATUS",
    decision: "FREEZE_NEW",
    finalAuthority: "IDENTIFY_MEMBER_BY_MARITAL_STATUS",
    qlId: "BLR-QL-011",
    answerType: "PERSON_NAME",
    rationale:
      "The solver selects one named family member using explicit marital-status evidence after reconstructing the shared family.",
  },
  {
    sourceAuthority: "IDENTIFY_MEMBER_WITH_UNRESOLVED_MARITAL_STATUS",
    decision: "MERGE_PARAMETER",
    finalAuthority: "IDENTIFY_MEMBER_BY_MARITAL_STATUS",
    qlId: "BLR-QL-011",
    answerType: "PERSON_NAME",
    rationale:
      "Unresolved is a third target-status value beside married and explicitly unmarried. The answer domain, candidate scan and uniqueness contract remain unchanged; only the accepted evidence state differs.",
  },
  {
    sourceAuthority: "IDENTIFY_PERSON_BY_EXACT_LINEAGE",
    decision: "FREEZE_NEW",
    finalAuthority: "IDENTIFY_PERSON_BY_EXACT_LINEAGE",
    qlId: "BLR-QL-012",
    answerType: "PERSON_NAME",
    rationale:
      "The answer is a person selected through a maternal or paternal lineage path. BLR-QL-007 returns an exact-lineage relation label and therefore has a different answer contract.",
  },
] as const;

export const BLR_CP003_CROSS_CHECKPOINT_OWNERSHIP = [
  {
    sharedPassagePrototype: "SHARED_NAMED_PERSON_RELATION",
    disposition: "MERGE_EXISTING",
    ownerQlId: "BLR-QL-001",
    rationale: "Shared-passage assembly does not change named-person relation solving.",
  },
  {
    sharedPassagePrototype: "SHARED_IDENTIFY_PERSON_BY_RELATION",
    disposition: "MERGE_EXISTING",
    ownerQlId: "BLR-QL-002",
    rationale: "The reference, requested relation and single-person answer remain unchanged.",
  },
  {
    sharedPassagePrototype: "SHARED_IDENTIFY_PERSON_BY_GENDER",
    disposition: "MERGE_EXISTING",
    ownerQlId: "BLR-QL-003",
    rationale: "Gender is supplied as evidence and the answer is one named person.",
  },
  {
    sharedPassagePrototype: "SHARED_RELATION_CLAIM",
    disposition: "MERGE_EXISTING",
    ownerQlId: "BLR-QL-005",
    rationale: "True and false target values are instance properties of the relation-claim contract.",
  },
  {
    sharedPassagePrototype: "SHARED_GENERATION_COMPARISON",
    disposition: "MERGE_EXISTING",
    ownerQlId: "BLR-QL-006",
    rationale: "A shared prompt does not change generation-delta comparison.",
  },
  {
    sharedPassagePrototype: "SHARED_EXACT_LINEAGE_RELATION",
    disposition: "MERGE_EXISTING",
    ownerQlId: "BLR-QL-007",
    rationale: "The grouped item still returns the exact maternal or paternal relation label.",
  },
  {
    sharedPassagePrototype: "INTRODUCTION_OR_PHOTOGRAPH_RELATION",
    disposition: "OUTSIDE_CP003",
    ownerQlId: "BLR-QL-008",
    rationale: "Anchored introductions and photograph relations remain owned by BLR-CP-002.",
  },
] as const;

export function normalizeBlrCp003Authority(
  authority: BlrCp003SourceAuthority,
): BlrCp003PermanentAuthority {
  return authority === "IDENTIFY_MEMBER_WITH_UNRESOLVED_MARITAL_STATUS"
    ? "IDENTIFY_MEMBER_BY_MARITAL_STATUS"
    : authority;
}

export function blrCp003QlIdForAuthority(
  authority: BlrCp003SourceAuthority,
): BlrCp003PermanentQlId {
  return BLR_CP003_PERMANENT_QL_BY_AUTHORITY[
    normalizeBlrCp003Authority(authority)
  ];
}
