import {
  MEN_CP011_NEIGHBOUR_OWNERSHIP_BOUNDARIES,
  getMenCp011LivePrototypeIds,
  hasAttachedSourceReference,
  hasCompleteDirectSourceEvidence,
  type MenCp011DirectSourceEvidence,
  type MenCp011SourceFamilyGroup,
  type MenCp011SourceReadinessEntry,
} from "./source-normalisation-readiness";
import {
  MEN_CP011_SOURCE_READINESS_ENTRIES_V3,
} from "./source-normalisation-readiness-v3";

export const MEN_CP011_SOURCE_READINESS_AUTHORITY_V4 =
  "MEN-CP011-DIRECT-SOURCE-NORMALISATION-READINESS-V4" as const;

const RS_AGGARWAL_SOURCE = {
  sourceType: "ESTABLISHED_EXAM_PREP_BOOK" as const,
  documentId:
    "FILE_LIBRARY:file_000000007a30824383471a9d268f3224:ISBN-978-93-525-3402-9",
  documentTitle:
    "Quantitative Aptitude for Competitive Examinations (Fully Solved) — Dr. R.S. Aggarwal",
  editionOrYear: "Revised and Enlarged Edition 2017; Reprint 2017",
  chapterOrSection: "Volume and Surface Areas",
  reviewer: null,
  reviewedAt: null,
} as const;

function rsAggarwalEvidence(
  pageLocator: string,
  exemplarLocator: string,
  immutableExtractId: string,
  sourceMatchClassification:
    | "DIRECT_TASK_MATCH"
    | "REPRESENTATION_ONLY_SUPPORT",
  sourceMatchRationale: string,
): MenCp011DirectSourceEvidence {
  return {
    ...RS_AGGARWAL_SOURCE,
    pageLocator,
    exemplarLocator,
    sourceContentHash: immutableExtractId,
    sourceMatchClassification,
    sourceMatchRationale,
  };
}

export const MEN_CP011_V4_BOX_LINING_SOURCE_EVIDENCE_BY_PROTOTYPE: Readonly<
  Record<string, MenCp011DirectSourceEvidence>
> = {
  "MEN-CP011-PROT-HOLLOW-CUBOID-MATERIAL-VOLUME": rsAggarwalEvidence(
    "question printed p. 777; worked solution printed p. 795",
    "Question 46 — covered wooden box; inner dimensions and uniform thickness given; find volume of wood",
    "FILE_LIBRARY_EXTRACT:file_000000007a30824383471a9d268f3224:printed-p777-q46:solution-p795",
    "DIRECT_TASK_MATCH",
    "The exemplar directly asks for material volume of a closed hollow cuboid and its worked solution subtracts the inner cuboid volume from the outer cuboid volume.",
  ),
  "MEN-CP011-PROT-INNER-LINING-COST": rsAggarwalEvidence(
    "printed p. 780",
    "Question 112 — well of stated diameter and depth; find cost of plastering the inner curved surface",
    "FILE_LIBRARY_EXTRACT:file_000000007a30824383471a9d268f3224:printed-p780:q112",
    "REPRESENTATION_ONLY_SUPPORT",
    "The exemplar directly validates inner cylindrical curved-surface costing, but it omits a bottom face; the live family requires the inner curved wall plus the existing bottom of an open tank.",
  ),
} as const;

export const MEN_CP011_SOURCE_READINESS_ENTRIES_V4: readonly MenCp011SourceReadinessEntry[] =
  MEN_CP011_SOURCE_READINESS_ENTRIES_V3.map((entry) => {
    const evidence =
      MEN_CP011_V4_BOX_LINING_SOURCE_EVIDENCE_BY_PROTOTYPE[
        entry.prototypeId
      ];
    if (!evidence) return entry;

    return {
      ...entry,
      sourceNormalisationStatus: "REFERENCE_ATTACHED_PENDING_REVIEW",
      evidence,
    };
  });

function countFamilyGroups(entries: readonly MenCp011SourceReadinessEntry[]) {
  const counts = {} as Record<MenCp011SourceFamilyGroup, number>;
  for (const entry of entries) {
    counts[entry.familyGroup] = (counts[entry.familyGroup] ?? 0) + 1;
  }
  return counts;
}

export function auditMenCp011SourceReadinessV4() {
  const livePrototypeIds = getMenCp011LivePrototypeIds();
  const ledgerPrototypeIds = MEN_CP011_SOURCE_READINESS_ENTRIES_V4.map(
    (entry) => entry.prototypeId,
  );
  const attachedEntries = MEN_CP011_SOURCE_READINESS_ENTRIES_V4.filter(
    (entry) => hasAttachedSourceReference(entry.evidence),
  );
  const directTaskMatchPendingReviewEntries = attachedEntries.filter(
    (entry) =>
      entry.evidence.sourceMatchClassification === "DIRECT_TASK_MATCH" &&
      entry.sourceNormalisationStatus === "REFERENCE_ATTACHED_PENDING_REVIEW",
  );
  const representationOnlyEntries = attachedEntries.filter(
    (entry) =>
      entry.evidence.sourceMatchClassification ===
      "REPRESENTATION_ONLY_SUPPORT",
  );
  const normalisedEntries = MEN_CP011_SOURCE_READINESS_ENTRIES_V4.filter(
    (entry) =>
      entry.sourceNormalisationStatus === "DIRECTLY_NORMALISED" &&
      hasCompleteDirectSourceEvidence(entry.evidence),
  );
  const falselyNormalisedEntries = MEN_CP011_SOURCE_READINESS_ENTRIES_V4.filter(
    (entry) =>
      entry.sourceNormalisationStatus === "DIRECTLY_NORMALISED" &&
      !hasCompleteDirectSourceEvidence(entry.evidence),
  );
  const missingEntries = MEN_CP011_SOURCE_READINESS_ENTRIES_V4.filter(
    (entry) => entry.sourceNormalisationStatus === "MISSING_DIRECT_REFERENCE",
  );
  const incompleteAttachedEntries = MEN_CP011_SOURCE_READINESS_ENTRIES_V4.filter(
    (entry) =>
      entry.sourceNormalisationStatus ===
        "REFERENCE_ATTACHED_PENDING_REVIEW" &&
      !hasAttachedSourceReference(entry.evidence),
  );

  return {
    authority: MEN_CP011_SOURCE_READINESS_AUTHORITY_V4,
    inheritedAuthority:
      "MEN-CP011-DIRECT-SOURCE-NORMALISATION-READINESS-V3" as const,
    livePrototypeCount: livePrototypeIds.length,
    ledgerPrototypeCount: ledgerPrototypeIds.length,
    uniqueLivePrototypeCount: new Set(livePrototypeIds).size,
    uniqueLedgerPrototypeCount: new Set(ledgerPrototypeIds).size,
    liveAndLedgerSetsMatch:
      livePrototypeIds.length === ledgerPrototypeIds.length &&
      livePrototypeIds.every((prototypeId) =>
        ledgerPrototypeIds.includes(prototypeId),
      ),
    familyGroupCounts: countFamilyGroups(
      MEN_CP011_SOURCE_READINESS_ENTRIES_V4,
    ),
    canonicalOwnerConfirmedCount:
      MEN_CP011_SOURCE_READINESS_ENTRIES_V4.filter(
        (entry) => entry.ownershipStatus === "CANONICAL_OWNER_CONFIRMED",
      ).length,
    executableFormulaAuthorityCount:
      MEN_CP011_SOURCE_READINESS_ENTRIES_V4.filter(
        (entry) =>
          entry.formulaAuthorityStatus ===
          "EXECUTABLE_AND_INDEPENDENTLY_VERIFIED",
      ).length,
    attachedReferenceCount: attachedEntries.length,
    directTaskMatchPendingReviewCount:
      directTaskMatchPendingReviewEntries.length,
    representationOnlySupportCount: representationOnlyEntries.length,
    directlyNormalisedCount: normalisedEntries.length,
    missingDirectReferenceCount: missingEntries.length,
    incompleteAttachedReferenceCount: incompleteAttachedEntries.length,
    falselyNormalisedCount: falselyNormalisedEntries.length,
    neighbourBoundaryCount: MEN_CP011_NEIGHBOUR_OWNERSHIP_BOUNDARIES.length,
    sourceNormalisationComplete:
      normalisedEntries.length === livePrototypeIds.length &&
      falselyNormalisedEntries.length === 0,
    permanentQlAllocationAllowed: false,
    publicationEligible: false,
    blockers: [
      "DIRECT_SOURCE_DOCUMENT_LOCATORS_MISSING",
      "DIRECT_SOURCE_EXEMPLAR_LOCATORS_MISSING",
      "DIRECT_TASK_MATCHES_STILL_REQUIRED",
      "SOURCE_REVIEWER_ATTESTATION_MISSING",
      "PERMANENT_QLS_UNALLOCATED",
      "MANUAL_ENGLISH_REVIEW_PENDING",
      "MULTILINGUAL_PARITY_PENDING",
    ] as const,
  };
}
