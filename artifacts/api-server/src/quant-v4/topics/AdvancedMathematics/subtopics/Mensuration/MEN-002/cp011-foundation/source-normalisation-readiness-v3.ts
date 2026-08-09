import {
  MEN_CP011_NEIGHBOUR_OWNERSHIP_BOUNDARIES,
  MEN_CP011_SOURCE_READINESS_ENTRIES as MEN_CP011_SOURCE_READINESS_ENTRIES_V2,
  getMenCp011LivePrototypeIds,
  hasAttachedSourceReference,
  hasCompleteDirectSourceEvidence,
  type MenCp011DirectSourceEvidence,
  type MenCp011SourceFamilyGroup,
  type MenCp011SourceReadinessEntry,
} from "./source-normalisation-readiness";

export const MEN_CP011_SOURCE_READINESS_AUTHORITY_V3 =
  "MEN-CP011-DIRECT-SOURCE-NORMALISATION-READINESS-V3" as const;

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

function shellEvidence(
  pageLocator: string,
  exemplarLocator: string,
  immutableExtractId: string,
  sourceMatchRationale: string,
): MenCp011DirectSourceEvidence {
  return {
    ...RS_AGGARWAL_SOURCE,
    pageLocator,
    exemplarLocator,
    sourceContentHash: immutableExtractId,
    sourceMatchClassification: "DIRECT_TASK_MATCH",
    sourceMatchRationale,
  };
}

export const MEN_CP011_V3_SHELL_SOURCE_EVIDENCE_BY_PROTOTYPE: Readonly<
  Record<string, MenCp011DirectSourceEvidence>
> = {
  "MEN-CP011-PROT-SPHERICAL-SHELL-MATERIAL-VOLUME": shellEvidence(
    "printed p. 786",
    "Question 226 — hollow spherical metallic ball; external diameter and wall thickness given; find volume of metal used",
    "FILE_LIBRARY_EXTRACT:file_000000007a30824383471a9d268f3224:printed-p786:q226",
    "The exemplar directly asks for the material volume of a hollow spherical metallic ball from an outer diameter and uniform wall thickness.",
  ),
  "MEN-CP011-PROT-HEMISPHERICAL-SHELL-MATERIAL-VOLUME": shellEvidence(
    "printed p. 788",
    "Question 261 — steel hemispherical bowl; inside radius and wall thickness given; find volume of steel used",
    "FILE_LIBRARY_EXTRACT:file_000000007a30824383471a9d268f3224:printed-p788:q261",
    "The exemplar directly asks for the material volume of a hemispherical shell from its inner radius and uniform wall thickness.",
  ),
} as const;

export const MEN_CP011_SOURCE_READINESS_ENTRIES_V3: readonly MenCp011SourceReadinessEntry[] =
  MEN_CP011_SOURCE_READINESS_ENTRIES_V2.map((entry) => {
    const shellEvidenceForPrototype =
      MEN_CP011_V3_SHELL_SOURCE_EVIDENCE_BY_PROTOTYPE[entry.prototypeId];
    if (!shellEvidenceForPrototype) return entry;

    return {
      ...entry,
      sourceNormalisationStatus: "REFERENCE_ATTACHED_PENDING_REVIEW",
      evidence: shellEvidenceForPrototype,
    };
  });

function countFamilyGroups(entries: readonly MenCp011SourceReadinessEntry[]) {
  const counts = {} as Record<MenCp011SourceFamilyGroup, number>;
  for (const entry of entries) {
    counts[entry.familyGroup] = (counts[entry.familyGroup] ?? 0) + 1;
  }
  return counts;
}

export function auditMenCp011SourceReadinessV3() {
  const livePrototypeIds = getMenCp011LivePrototypeIds();
  const ledgerPrototypeIds = MEN_CP011_SOURCE_READINESS_ENTRIES_V3.map(
    (entry) => entry.prototypeId,
  );
  const attachedEntries = MEN_CP011_SOURCE_READINESS_ENTRIES_V3.filter(
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
  const normalisedEntries = MEN_CP011_SOURCE_READINESS_ENTRIES_V3.filter(
    (entry) =>
      entry.sourceNormalisationStatus === "DIRECTLY_NORMALISED" &&
      hasCompleteDirectSourceEvidence(entry.evidence),
  );
  const falselyNormalisedEntries = MEN_CP011_SOURCE_READINESS_ENTRIES_V3.filter(
    (entry) =>
      entry.sourceNormalisationStatus === "DIRECTLY_NORMALISED" &&
      !hasCompleteDirectSourceEvidence(entry.evidence),
  );
  const missingEntries = MEN_CP011_SOURCE_READINESS_ENTRIES_V3.filter(
    (entry) => entry.sourceNormalisationStatus === "MISSING_DIRECT_REFERENCE",
  );
  const incompleteAttachedEntries = MEN_CP011_SOURCE_READINESS_ENTRIES_V3.filter(
    (entry) =>
      entry.sourceNormalisationStatus ===
        "REFERENCE_ATTACHED_PENDING_REVIEW" &&
      !hasAttachedSourceReference(entry.evidence),
  );

  return {
    authority: MEN_CP011_SOURCE_READINESS_AUTHORITY_V3,
    inheritedAuthority:
      "MEN-CP011-DIRECT-SOURCE-NORMALISATION-READINESS-V2" as const,
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
      MEN_CP011_SOURCE_READINESS_ENTRIES_V3,
    ),
    canonicalOwnerConfirmedCount:
      MEN_CP011_SOURCE_READINESS_ENTRIES_V3.filter(
        (entry) => entry.ownershipStatus === "CANONICAL_OWNER_CONFIRMED",
      ).length,
    executableFormulaAuthorityCount:
      MEN_CP011_SOURCE_READINESS_ENTRIES_V3.filter(
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
