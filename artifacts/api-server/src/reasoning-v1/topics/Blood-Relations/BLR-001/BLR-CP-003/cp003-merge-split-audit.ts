import type { BlrCp001QlId } from "../BLR-CP-001/cp001-permanent-contracts";

export type BlrCp003AuditPrototypeId =
  | "BLR-CP003-PROT-SHARED-RELATION"
  | "BLR-CP003-PROT-SHARED-IDENTIFY-PERSON"
  | "BLR-CP003-PROT-SHARED-IDENTIFY-BY-RELATION"
  | "BLR-CP003-PROT-SHARED-IDENTIFY-PERSON-BY-GENDER"
  | "BLR-CP003-PROT-SHARED-MARRIED-PAIR"
  | "BLR-CP003-PROT-SHARED-SIBLING-PAIR"
  | "BLR-CP003-PROT-SHARED-PARENT-CHILD-PAIR"
  | "BLR-CP003-PROT-SHARED-GENDER"
  | "BLR-CP003-PROT-SHARED-GENERATION"
  | "BLR-CP003-PROT-SHARED-THREE-GENERATION-COMPARE"
  | "BLR-CP003-PROT-SHARED-TRUE-CLAIM"
  | "BLR-CP003-PROT-SHARED-FALSE-CLAIM"
  | "BLR-CP003-PROT-SHARED-MEMBER-SET"
  | "BLR-CP003-PROT-SHARED-MARITAL-STATUS"
  | "BLR-CP003-PROT-SHARED-IDENTIFY-BY-MARITAL-STATUS"
  | "BLR-CP003-PROT-SHARED-EXACT-LINEAGE"
  | "BLR-CP003-PROT-SHARED-IDENTIFY-BY-EXACT-LINEAGE"
  | "BLR-CP003-PROT-SHARED-GREAT-RELATION"
  | "BLR-CP003-PROT-MULTI-ITEM-GROUP";

export type BlrCp003ProvisionalNewAuthority =
  | "DETERMINE_MEMBER_GENDER"
  | "SELECT_UNORDERED_FAMILY_PAIR"
  | "IDENTIFY_ALL_MEMBERS_BY_RELATION"
  | "DETERMINE_MEMBER_MARITAL_STATUS"
  | "IDENTIFY_MEMBER_BY_MARITAL_STATUS"
  | "IDENTIFY_PERSON_BY_EXACT_LINEAGE";

export type BlrCp003MergeSplitDecision =
  | {
      prototypeId: BlrCp003AuditPrototypeId;
      decision: "MERGE_EXISTING";
      existingQlId: BlrCp001QlId;
      existingAuthority: string;
      answerType: string;
      rationale: string;
    }
  | {
      prototypeId: BlrCp003AuditPrototypeId;
      decision: "PROVISIONAL_NEW";
      provisionalAuthority: BlrCp003ProvisionalNewAuthority;
      answerType: string;
      rationale: string;
    }
  | {
      prototypeId: "BLR-CP003-PROT-MULTI-ITEM-GROUP";
      decision: "ASSEMBLY_ONLY";
      answerType: "NONE";
      rationale: string;
    };

export const BLR_CP003_MERGE_SPLIT_MATRIX_V1: readonly BlrCp003MergeSplitDecision[] = [
  {
    prototypeId: "BLR-CP003-PROT-SHARED-RELATION",
    decision: "MERGE_EXISTING",
    existingQlId: "BLR-QL-001",
    existingAuthority: "RESOLVE_NAMED_PERSON_RELATION",
    answerType: "RELATION_LABEL",
    rationale:
      "A shared passage changes assembly, not the subject-to-reference relation solve.",
  },
  {
    prototypeId: "BLR-CP003-PROT-SHARED-GREAT-RELATION",
    decision: "MERGE_EXISTING",
    existingQlId: "BLR-QL-001",
    existingAuthority: "RESOLVE_NAMED_PERSON_RELATION",
    answerType: "RELATION_LABEL",
    rationale:
      "Great-generation depth is an output/path property inside the named-person relation authority.",
  },
  {
    prototypeId: "BLR-CP003-PROT-SHARED-IDENTIFY-PERSON",
    decision: "MERGE_EXISTING",
    existingQlId: "BLR-QL-002",
    existingAuthority: "IDENTIFY_PERSON_BY_RELATION",
    answerType: "PERSON_NAME",
    rationale:
      "The reference and relation are fixed and the answer is one named person.",
  },
  {
    prototypeId: "BLR-CP003-PROT-SHARED-IDENTIFY-BY-RELATION",
    decision: "MERGE_EXISTING",
    existingQlId: "BLR-QL-002",
    existingAuthority: "IDENTIFY_PERSON_BY_RELATION",
    answerType: "PERSON_NAME",
    rationale:
      "Great-generation vocabulary does not alter the person-by-relation solve contract.",
  },
  {
    prototypeId:
      "BLR-CP003-PROT-SHARED-IDENTIFY-PERSON-BY-GENDER",
    decision: "MERGE_EXISTING",
    existingQlId: "BLR-QL-003",
    existingAuthority: "IDENTIFY_PERSON_BY_GENDER",
    answerType: "PERSON_NAME",
    rationale:
      "The shared prompt changes only assembly; a supplied gender and candidate set still produce one person-name answer under the frozen person-by-gender contract.",
  },
  {
    prototypeId: "BLR-CP003-PROT-SHARED-TRUE-CLAIM",
    decision: "MERGE_EXISTING",
    existingQlId: "BLR-QL-005",
    existingAuthority: "SELECT_RELATION_CLAIM",
    answerType: "RELATION_CLAIM",
    rationale:
      "Target truth TRUE is already an instance property of the frozen claim authority.",
  },
  {
    prototypeId: "BLR-CP003-PROT-SHARED-FALSE-CLAIM",
    decision: "MERGE_EXISTING",
    existingQlId: "BLR-QL-005",
    existingAuthority: "SELECT_RELATION_CLAIM",
    answerType: "RELATION_CLAIM",
    rationale:
      "The frozen query contract already supports targetTruth FALSE as an instance property.",
  },
  {
    prototypeId: "BLR-CP003-PROT-SHARED-GENERATION",
    decision: "MERGE_EXISTING",
    existingQlId: "BLR-QL-006",
    existingAuthority: "COMPARE_GENERATIONS",
    answerType: "GENERATION_LABEL",
    rationale:
      "Embedding the comparison in a passage does not change its generation-delta solve.",
  },
  {
    prototypeId:
      "BLR-CP003-PROT-SHARED-THREE-GENERATION-COMPARE",
    decision: "MERGE_EXISTING",
    existingQlId: "BLR-QL-006",
    existingAuthority: "COMPARE_GENERATIONS",
    answerType: "GENERATION_LABEL",
    rationale:
      "A three-level distance widens the output range but not the generation-comparison solve authority.",
  },
  {
    prototypeId: "BLR-CP003-PROT-SHARED-EXACT-LINEAGE",
    decision: "MERGE_EXISTING",
    existingQlId: "BLR-QL-007",
    existingAuthority: "RESOLVE_EXACT_LINEAGE_RELATION",
    answerType: "EXACT_LINEAGE_RELATION",
    rationale:
      "The grouped item invokes the frozen exact-lineage solver without defining a second algorithm.",
  },
  {
    prototypeId: "BLR-CP003-PROT-SHARED-GENDER",
    decision: "PROVISIONAL_NEW",
    provisionalAuthority: "DETERMINE_MEMBER_GENDER",
    answerType: "GENDER_LABEL",
    rationale:
      "The answer is a gender label; frozen BLR-QL-003 instead identifies a person from a supplied gender and candidate domain.",
  },
  {
    prototypeId: "BLR-CP003-PROT-SHARED-MARRIED-PAIR",
    decision: "PROVISIONAL_NEW",
    provisionalAuthority: "SELECT_UNORDERED_FAMILY_PAIR",
    answerType: "UNORDERED_PERSON_PAIR",
    rationale:
      "The option is an unordered couple; frozen BLR-QL-004 requires subject-reference order and a directional relation.",
  },
  {
    prototypeId: "BLR-CP003-PROT-SHARED-SIBLING-PAIR",
    decision: "PROVISIONAL_NEW",
    provisionalAuthority: "SELECT_UNORDERED_FAMILY_PAIR",
    answerType: "UNORDERED_PERSON_PAIR",
    rationale:
      "Sibling pair order is immaterial and uses the same unordered pair-selection solver as the couple item.",
  },
  {
    prototypeId: "BLR-CP003-PROT-SHARED-PARENT-CHILD-PAIR",
    decision: "PROVISIONAL_NEW",
    provisionalAuthority: "SELECT_UNORDERED_FAMILY_PAIR",
    answerType: "UNORDERED_PERSON_PAIR",
    rationale:
      "The rendered option does not state which member is the parent, unlike a frozen ordered relation-pair answer.",
  },
  {
    prototypeId: "BLR-CP003-PROT-SHARED-MEMBER-SET",
    decision: "PROVISIONAL_NEW",
    provisionalAuthority: "IDENTIFY_ALL_MEMBERS_BY_RELATION",
    answerType: "PERSON_NAME_SET",
    rationale:
      "The answer must contain every matching member, materially differing from one-person identification and its uniqueness rule.",
  },
  {
    prototypeId: "BLR-CP003-PROT-SHARED-MARITAL-STATUS",
    decision: "PROVISIONAL_NEW",
    provisionalAuthority: "DETERMINE_MEMBER_MARITAL_STATUS",
    answerType: "MARITAL_STATUS_LABEL",
    rationale:
      "This is a unary fact/status solve with a status-label answer, not a binary kinship relation to a supplied reference.",
  },
  {
    prototypeId:
      "BLR-CP003-PROT-SHARED-IDENTIFY-BY-MARITAL-STATUS",
    decision: "PROVISIONAL_NEW",
    provisionalAuthority: "IDENTIFY_MEMBER_BY_MARITAL_STATUS",
    answerType: "PERSON_NAME",
    rationale:
      "The answer is a person selected by a unary status fact rather than by a relation to a supplied reference person.",
  },
  {
    prototypeId:
      "BLR-CP003-PROT-SHARED-IDENTIFY-BY-EXACT-LINEAGE",
    decision: "PROVISIONAL_NEW",
    provisionalAuthority: "IDENTIFY_PERSON_BY_EXACT_LINEAGE",
    answerType: "PERSON_NAME",
    rationale:
      "The answer is a person, but selection requires the exact maternal/paternal solver outside BLR-QL-002's broad relation input domain.",
  },
  {
    prototypeId: "BLR-CP003-PROT-MULTI-ITEM-GROUP",
    decision: "ASSEMBLY_ONLY",
    answerType: "NONE",
    rationale:
      "The shared passage packages independently solved items and has no student answer of its own.",
  },
] as const;

export function cp003ProvisionalAuthorities(): BlrCp003ProvisionalNewAuthority[] {
  return [
    ...new Set(
      BLR_CP003_MERGE_SPLIT_MATRIX_V1.flatMap((entry) =>
        entry.decision === "PROVISIONAL_NEW"
          ? [entry.provisionalAuthority]
          : [],
      ),
    ),
  ];
}
