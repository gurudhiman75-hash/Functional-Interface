export type DsOwnershipDisposition =
  | "PRESERVE_FROZEN_SOURCE_QLS"
  | "ADAPT_SOURCE_CAPABILITY_BEFORE_PERMANENT_ID"
  | "REJECT_LOCAL_ANSWER_CONTRACT"
  | "SOURCE_SOLVER_ONLY";

export interface DsOwnershipReconciliationEntry {
  readonly sourceChapter: string;
  readonly sourceIdentityState: "FROZEN_PERMANENT_QL" | "TEMPORARY_OR_RETAINED" | "PROTOTYPE_ONLY" | "CAPABILITY_ONLY";
  readonly disposition: DsOwnershipDisposition;
  readonly canonicalSufficiencyOwner: "DSF-001";
  readonly domainTruthOwner: string;
  readonly identityPolicy: string;
  readonly migrationRule: string;
}

/**
 * DSF owns the meaning of sufficiency. Source chapters continue to own the
 * mathematical/reasoning truth used to construct and solve their worlds.
 * Existing permanent source QL IDs are never silently reassigned to DSF IDs.
 */
export const DSF_OWNERSHIP_RECONCILIATION: readonly DsOwnershipReconciliationEntry[] = [
  {
    sourceChapter: "Time and Work / TMW-001 CP-013",
    sourceIdentityState: "FROZEN_PERMANENT_QL",
    disposition: "PRESERVE_FROZEN_SOURCE_QLS",
    canonicalSufficiencyOwner: "DSF-001",
    domainTruthOwner: "TMW-001",
    identityPolicy: "Preserve TMW-QL-216..223 exactly. If exposed through the learner-facing Data Sufficiency taxonomy, reference the source QL identity through ancestry/alias metadata rather than cloning the same task into a new DSF QL.",
    migrationRule: "Replace or wrap chapter-local iUnique/iiUnique/combinedUnique proof flags with DSF target-projection evaluation while leaving frozen TMW identity and domain scenario ownership intact.",
  },
  {
    sourceChapter: "Number System / NUM-001 CP-003 retained DS",
    sourceIdentityState: "TEMPORARY_OR_RETAINED",
    disposition: "ADAPT_SOURCE_CAPABILITY_BEFORE_PERMANENT_ID",
    canonicalSufficiencyOwner: "DSF-001",
    domainTruthOwner: "NUM-001",
    identityPolicy: "Retained template identity is not promoted into a competing canonical DS answer model. DSF may consume NUM divisibility/candidate capabilities with explicit source ancestry.",
    migrationRule: "Use the shared DSF evaluator for canonical truth before any new permanent DS-facing identity is allocated.",
  },
  {
    sourceChapter: "Simplification and Approximation / SAP-001 CP-006 Wave 3",
    sourceIdentityState: "PROTOTYPE_ONLY",
    disposition: "REJECT_LOCAL_ANSWER_CONTRACT",
    canonicalSufficiencyOwner: "DSF-001",
    domainTruthOwner: "SAP-001",
    identityPolicy: "Do not promote the local four-class DS taxonomy as a canonical answer contract because it omits EACH_STATEMENT_ALONE.",
    migrationRule: "Retain reusable arithmetic candidate-solving ideas only; route semantic classification and exam answer profiles through DSF.",
  },
  {
    sourceChapter: "Ranking and Order / RNK-001",
    sourceIdentityState: "CAPABILITY_ONLY",
    disposition: "SOURCE_SOLVER_ONLY",
    canonicalSufficiencyOwner: "DSF-001",
    domainTruthOwner: "RNK-001",
    identityPolicy: "RNK remains owner of ranking/order inference. DSF stores source ancestry and owns only statement-subset sufficiency classification.",
    migrationRule: "Production DS adapter must consume a source-owned complete valid-order interface or equivalent proof; the CP-000 local permutation enumerator is discovery-only.",
  },
];

export const DSF_IDENTITY_GOVERNANCE = {
  canonicalSufficiencyOwner: "DSF-001" as const,
  permanentSourceIdsAreImmutable: true,
  duplicateQlForSameFrozenTaskAllowed: false,
  sourceAncestryRequired: true,
  learnerTaxonomyMayReferenceSourceQl: true,
  rule: "One underlying task keeps one permanent identity; taxonomy placement and DSF semantic proof may be layered without silently duplicating or reassigning the QL.",
} as const;

export function dsfOwnershipSummary(): Readonly<Record<DsOwnershipDisposition, number>> {
  return DSF_OWNERSHIP_RECONCILIATION.reduce<Record<DsOwnershipDisposition, number>>(
    (counts, entry) => {
      counts[entry.disposition] += 1;
      return counts;
    },
    {
      PRESERVE_FROZEN_SOURCE_QLS: 0,
      ADAPT_SOURCE_CAPABILITY_BEFORE_PERMANENT_ID: 0,
      REJECT_LOCAL_ANSWER_CONTRACT: 0,
      SOURCE_SOLVER_ONLY: 0,
    },
  );
}
