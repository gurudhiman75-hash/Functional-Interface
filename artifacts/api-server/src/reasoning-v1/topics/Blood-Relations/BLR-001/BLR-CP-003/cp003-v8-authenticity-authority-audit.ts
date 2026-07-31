import type { BlrCp003ProvisionalNewAuthority } from "./cp003-merge-split-audit";

export const BLR_CP003_V8_AUTHORITY_AUDIT_VERSION =
  "BLR_CP003_V8_AUTHORITY_AUDIT_V1" as const;

export type BlrCp003V8RetainedAuthority =
  | "SELECT_UNORDERED_FAMILY_PAIR"
  | "IDENTIFY_ALL_MEMBERS_BY_RELATION"
  | "IDENTIFY_MEMBER_BY_MARITAL_STATUS";

export type BlrCp003V8AuthorityDisposition =
  | {
      authority: "DETERMINE_MEMBER_GENDER";
      decision: "MERGE_EXISTING";
      targetAuthority: "IDENTIFY_PERSON_BY_GENDER";
      targetQlId: "BLR-QL-003";
      rationale: string;
    }
  | {
      authority: "DETERMINE_MEMBER_MARITAL_STATUS";
      decision: "MERGE_PROVISIONAL";
      targetAuthority: "IDENTIFY_MEMBER_BY_MARITAL_STATUS";
      targetQlId: null;
      rationale: string;
    }
  | {
      authority: BlrCp003V8RetainedAuthority;
      decision: "RETAIN_PROVISIONAL";
      targetAuthority: BlrCp003V8RetainedAuthority;
      targetQlId: null;
      rationale: string;
    }
  | {
      authority: "IDENTIFY_PERSON_BY_EXACT_LINEAGE";
      decision: "PRESERVE_V5_APPROVED";
      targetAuthority: "IDENTIFY_PERSON_BY_EXACT_LINEAGE";
      targetQlId: null;
      rationale: string;
    };

export const BLR_CP003_V8_AUTHORITY_DISPOSITIONS: readonly BlrCp003V8AuthorityDisposition[] = [
  {
    authority: "DETERMINE_MEMBER_GENDER",
    decision: "MERGE_EXISTING",
    targetAuthority: "IDENTIFY_PERSON_BY_GENDER",
    targetQlId: "BLR-QL-003",
    rationale:
      "A four-option gender-label question has only two natural labels and therefore requires obvious meta distractors. The authentic competitive form identifies a person from gender evidence and is already owned by BLR-QL-003.",
  },
  {
    authority: "DETERMINE_MEMBER_MARITAL_STATUS",
    decision: "MERGE_PROVISIONAL",
    targetAuthority: "IDENTIFY_MEMBER_BY_MARITAL_STATUS",
    targetQlId: null,
    rationale:
      "A binary married/unmarried answer contract cannot sustain four exam-grade options without artificial fillers. The authentic form asks which named member satisfies the marital-status condition.",
  },
  {
    authority: "SELECT_UNORDERED_FAMILY_PAIR",
    decision: "RETAIN_PROVISIONAL",
    targetAuthority: "SELECT_UNORDERED_FAMILY_PAIR",
    targetQlId: null,
    rationale:
      "Name-pair options support distinct spouse, sibling, parent-child and cousin distractors without learner-facing internal terminology.",
  },
  {
    authority: "IDENTIFY_ALL_MEMBERS_BY_RELATION",
    decision: "RETAIN_PROVISIONAL",
    targetAuthority: "IDENTIFY_ALL_MEMBERS_BY_RELATION",
    targetQlId: null,
    rationale:
      "Complete-set answers materially differ from one-person identification because omissions and extra members are both incorrect.",
  },
  {
    authority: "IDENTIFY_MEMBER_BY_MARITAL_STATUS",
    decision: "RETAIN_PROVISIONAL",
    targetAuthority: "IDENTIFY_MEMBER_BY_MARITAL_STATUS",
    targetQlId: null,
    rationale:
      "The answer is a named family member selected by a kinship condition and an explicit marital-status condition.",
  },
  {
    authority: "IDENTIFY_PERSON_BY_EXACT_LINEAGE",
    decision: "PRESERVE_V5_APPROVED",
    targetAuthority: "IDENTIFY_PERSON_BY_EXACT_LINEAGE",
    targetQlId: null,
    rationale:
      "The V5 human-approved exact-lineage evidence remains unchanged and outside the V8 authenticity remediation bank.",
  },
] as const;

export function blrCp003V8RetainedAuthorities(): readonly BlrCp003V8RetainedAuthority[] {
  return BLR_CP003_V8_AUTHORITY_DISPOSITIONS.flatMap((entry) =>
    entry.decision === "RETAIN_PROVISIONAL" ? [entry.authority] : [],
  );
}

export function blrCp003V8DispositionFor(
  authority: BlrCp003ProvisionalNewAuthority,
): BlrCp003V8AuthorityDisposition {
  const disposition = BLR_CP003_V8_AUTHORITY_DISPOSITIONS.find(
    (entry) => entry.authority === authority,
  );
  if (!disposition) {
    throw new Error(`Missing BLR-CP-003 V8 disposition for ${authority}.`);
  }
  return disposition;
}
