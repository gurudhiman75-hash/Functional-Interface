export const BLR_CP003_V9_WAVE02_AUTHORITY_AUDIT_VERSION =
  "BLR_CP003_V9_WAVE02_AUTHORITY_AUDIT_V1" as const;

export type BlrCp003V9Wave02AuthorityDecision =
  | {
      prototypeId: string;
      decision: "MERGE_PROVISIONAL";
      targetAuthority:
        | "SELECT_UNORDERED_FAMILY_PAIR"
        | "IDENTIFY_ALL_MEMBERS_BY_RELATION"
        | "IDENTIFY_MEMBER_BY_MARITAL_STATUS";
      rationale: string;
    }
  | {
      prototypeId: string;
      decision: "PROVISIONAL_SPLIT_CANDIDATE";
      sourceAuthority: "IDENTIFY_MEMBER_BY_MARITAL_STATUS";
      candidateAuthority: "IDENTIFY_MEMBER_WITH_UNRESOLVED_MARITAL_STATUS";
      rationale: string;
    };

export const BLR_CP003_V9_WAVE02_AUTHORITY_AUDIT: readonly BlrCp003V9Wave02AuthorityDecision[] = [
  {
    prototypeId: "BLR-CP003-PROT-V9W2-UNRESOLVED-SINGLE-PARENT-STATUS",
    decision: "PROVISIONAL_SPLIT_CANDIDATE",
    sourceAuthority: "IDENTIFY_MEMBER_BY_MARITAL_STATUS",
    candidateAuthority: "IDENTIFY_MEMBER_WITH_UNRESOLVED_MARITAL_STATUS",
    rationale:
      "The answer is still a person name, but the solver must preserve a three-state evidence model—married, explicitly unmarried, and unresolved—instead of selecting a supplied positive status.",
  },
  {
    prototypeId: "BLR-CP003-PROT-V9W2-FOUR-GRID-UNKNOWN-STATUS",
    decision: "PROVISIONAL_SPLIT_CANDIDATE",
    sourceAuthority: "IDENTIFY_MEMBER_BY_MARITAL_STATUS",
    candidateAuthority: "IDENTIFY_MEMBER_WITH_UNRESOLVED_MARITAL_STATUS",
    rationale:
      "The multi-branch version invokes the same unresolved-status contract and must not be merged by wording alone before a negative/unknown-boundary audit.",
  },
  {
    prototypeId: "BLR-CP003-PROT-V9W2-EXPLICIT-UNMARRIED-NOT-UNKNOWN",
    decision: "MERGE_PROVISIONAL",
    targetAuthority: "IDENTIFY_MEMBER_BY_MARITAL_STATUS",
    rationale:
      "The negative clues alter evidence presentation, while the answer remains the one person matching an explicit unmarried-status fact.",
  },
  {
    prototypeId: "BLR-CP003-PROT-V9W2-FOUR-GRID-EXPLICIT-UNMARRIED",
    decision: "MERGE_PROVISIONAL",
    targetAuthority: "IDENTIFY_MEMBER_BY_MARITAL_STATUS",
    rationale:
      "Multiple known and unknown branches increase elimination depth but do not change the positive status-selection contract.",
  },
  {
    prototypeId: "BLR-CP003-PROT-V9W2-AUNT-COUSIN-MIXED-PAIR",
    decision: "MERGE_PROVISIONAL",
    targetAuthority: "SELECT_UNORDERED_FAMILY_PAIR",
    rationale:
      "The two slots use different relations, but the student still selects one unordered person pair satisfying the stem's compound predicate.",
  },
  {
    prototypeId: "BLR-CP003-PROT-V9W2-MOTHER-IN-LAW-DAUGHTER-PAIR",
    decision: "MERGE_PROVISIONAL",
    targetAuthority: "SELECT_UNORDERED_FAMILY_PAIR",
    rationale:
      "Mixed generation directions are predicate details inside the same unordered pair-selection solve.",
  },
  {
    prototypeId: "BLR-CP003-PROT-V9W2-BROTHER-IN-LAW-NEPHEW-PAIR",
    decision: "MERGE_PROVISIONAL",
    targetAuthority: "SELECT_UNORDERED_FAMILY_PAIR",
    rationale:
      "Blood-side and spouse-side paths remain two independently checked slots in one unordered pair answer.",
  },
  {
    prototypeId: "BLR-CP003-PROT-V9W2-ESTABLISHED-CHILDREN-IN-LAW-PAIR",
    decision: "MERGE_PROVISIONAL",
    targetAuthority: "SELECT_UNORDERED_FAMILY_PAIR",
    rationale:
      "Excluding an unnamed spouse branch affects evidence completeness, not the pair answer shape or solver contract.",
  },
  {
    prototypeId: "BLR-CP003-PROT-V9W2-COMPLETE-PARENTS-AFTER-EXCLUSION",
    decision: "MERGE_PROVISIONAL",
    targetAuthority: "IDENTIFY_ALL_MEMBERS_BY_RELATION",
    rationale:
      "The answer must contain every named parent after negative filtering, which is the retained complete-set contract.",
  },
  {
    prototypeId: "BLR-CP003-PROT-V9W2-PARENTS-IN-LAW-SET",
    decision: "MERGE_PROVISIONAL",
    targetAuthority: "IDENTIFY_ALL_MEMBERS_BY_RELATION",
    rationale:
      "Father-in-law and mother-in-law are gendered members of one complete parent-in-law set.",
  },
  {
    prototypeId: "BLR-CP003-PROT-V9W2-TWO-NEPHEW-BRANCH-SET",
    decision: "MERGE_PROVISIONAL",
    targetAuthority: "IDENTIFY_ALL_MEMBERS_BY_RELATION",
    rationale:
      "The two evidence paths reach the same nephew relation through blood and spouse branches, requiring exhaustive set collection.",
  },
  {
    prototypeId: "BLR-CP003-PROT-V9W2-THREE-BRANCH-COUSIN-SET",
    decision: "MERGE_PROVISIONAL",
    targetAuthority: "IDENTIFY_ALL_MEMBERS_BY_RELATION",
    rationale:
      "An unknown spouse does not change the cousin relation established through the named parent; the task remains complete-set identification.",
  },
] as const;

export function blrCp003V9Wave02SplitCandidates(): readonly string[] {
  return BLR_CP003_V9_WAVE02_AUTHORITY_AUDIT.flatMap((entry) =>
    entry.decision === "PROVISIONAL_SPLIT_CANDIDATE"
      ? [entry.candidateAuthority]
      : [],
  );
}
