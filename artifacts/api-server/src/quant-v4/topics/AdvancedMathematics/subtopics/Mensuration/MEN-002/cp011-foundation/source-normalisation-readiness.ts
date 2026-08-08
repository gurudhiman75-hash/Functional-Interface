import { getMenCp011FoundationPrototypeIds } from "./registry";
import { getMenCp011SurfacePrototypeIds } from "./surface-area-runtime";
import { getMenCp011OpenContainerPrototypeIds } from "./open-containers-runtime";
import { getMenCp011InversePrototypeIds } from "./inverse-thickness-length";
import { getMenCp011HollowBoxPrototypeIds } from "./hollow-boxes";
import { getMenCp011ShellPrototypeIds } from "./spherical-shells";
import { getMenCp011HiddenFacePrototypeIds } from "./hidden-face-exposure";
import { getMenCp011CostPrototypeIds } from "./cost-lining";
import { getMenCp011RatioPercentPrototypeIds } from "./ratio-percent";
import { getMenCp011ConicalMaterialPrototypeIds } from "./conical-material";
import { getMenCp011ConicalSurfaceCostPrototypeIds } from "./conical-surface-cost";

export const MEN_CP011_SOURCE_READINESS_AUTHORITY =
  "MEN-CP011-DIRECT-SOURCE-NORMALISATION-READINESS-V1" as const;

export type MenCp011SourceFamilyGroup =
  | "PIPE_MATERIAL_AND_INVERSE_CORE"
  | "PIPE_SURFACE_EXPOSURE"
  | "OPEN_CYLINDER_EXPOSURE"
  | "ADDITIONAL_PIPE_INVERSES"
  | "HOLLOW_RECTANGULAR_SOLIDS"
  | "SPHERICAL_SHELLS"
  | "HIDDEN_FACE_EXPOSURE"
  | "SHEET_AND_LINING_COST"
  | "MATERIAL_RATIO_AND_PERCENT_CHANGE"
  | "CONICAL_MATERIAL_VOLUME"
  | "CONICAL_SURFACE_AND_LINING_COST";

export type MenCp011AcceptedSourceType =
  | "OFFICIAL_EXAM_PAPER"
  | "ESTABLISHED_EXAM_PREP_BOOK"
  | "STANDARD_MATHEMATICS_TEXTBOOK"
  | "APPROVED_INTERNAL_SOURCE_EXTRACT";

export type MenCp011SourceNormalisationStatus =
  | "MISSING_DIRECT_REFERENCE"
  | "REFERENCE_ATTACHED_PENDING_REVIEW"
  | "DIRECTLY_NORMALISED";

export interface MenCp011DirectSourceEvidence {
  sourceType: MenCp011AcceptedSourceType | null;
  documentId: string | null;
  documentTitle: string | null;
  editionOrYear: string | null;
  chapterOrSection: string | null;
  pageLocator: string | null;
  exemplarLocator: string | null;
  sourceContentHash: string | null;
  reviewer: string | null;
  reviewedAt: string | null;
}

export interface MenCp011SourceReadinessEntry {
  prototypeId: string;
  familyGroup: MenCp011SourceFamilyGroup;
  canonicalOwner: "MEN-CP-011";
  formulaAuthorityStatus: "EXECUTABLE_AND_INDEPENDENTLY_VERIFIED";
  ownershipStatus: "CANONICAL_OWNER_CONFIRMED";
  sourceNormalisationStatus: MenCp011SourceNormalisationStatus;
  evidence: MenCp011DirectSourceEvidence;
  requiredEvidence: readonly string[];
  publicationBlocked: true;
  permanentQlAllocationBlocked: true;
}

export interface MenCp011NeighbourOwnershipBoundary {
  neighbouringCanonicalProblemId:
    | "MEN-CP-007"
    | "MEN-CP-008"
    | "MEN-CP-009"
    | "MEN-CP-010"
    | "MEN-CP-012"
    | "MEN-CP-013";
  retainedScope: string;
  excludedFromMenCp011: readonly string[];
}

interface GroupDefinition {
  familyGroup: MenCp011SourceFamilyGroup;
  prototypeIds: readonly string[];
  sourceFocus: string;
}

const GROUPS: readonly GroupDefinition[] = [
  {
    familyGroup: "PIPE_MATERIAL_AND_INVERSE_CORE",
    prototypeIds: getMenCp011FoundationPrototypeIds(),
    sourceFocus:
      "hollow-cylinder or pipe material volume, diameter/thickness representation, and inverse inner-radius reasoning",
  },
  {
    familyGroup: "PIPE_SURFACE_EXPOSURE",
    prototypeIds: getMenCp011SurfacePrototypeIds(),
    sourceFocus:
      "inner/outer curved surfaces, annular ends, and complete hollow-pipe surface ledgers",
  },
  {
    familyGroup: "OPEN_CYLINDER_EXPOSURE",
    prototypeIds: getMenCp011OpenContainerPrototypeIds(),
    sourceFocus:
      "one-end-open and both-ends-open cylindrical surface topology",
  },
  {
    familyGroup: "ADDITIONAL_PIPE_INVERSES",
    prototypeIds: getMenCp011InversePrototypeIds(),
    sourceFocus:
      "inverse pipe thickness and inverse pipe length from material volume",
  },
  {
    familyGroup: "HOLLOW_RECTANGULAR_SOLIDS",
    prototypeIds: getMenCp011HollowBoxPrototypeIds(),
    sourceFocus:
      "outer-minus-inner material volume for hollow cubes and cuboids",
  },
  {
    familyGroup: "SPHERICAL_SHELLS",
    prototypeIds: getMenCp011ShellPrototypeIds(),
    sourceFocus:
      "spherical and hemispherical outer-minus-inner shell material volume",
  },
  {
    familyGroup: "HIDDEN_FACE_EXPOSURE",
    prototypeIds: getMenCp011HiddenFacePrototypeIds(),
    sourceFocus:
      "joined-cube contact faces and floor-hidden cuboid surfaces",
  },
  {
    familyGroup: "SHEET_AND_LINING_COST",
    prototypeIds: getMenCp011CostPrototypeIds(),
    sourceFocus:
      "open-container sheet cost and inner-lining cost derived from an included-surface ledger",
  },
  {
    familyGroup: "MATERIAL_RATIO_AND_PERCENT_CHANGE",
    prototypeIds: getMenCp011RatioPercentPrototypeIds(),
    sourceFocus:
      "hollow-solid material-volume ratios and percentage change after cavity modification",
  },
  {
    familyGroup: "CONICAL_MATERIAL_VOLUME",
    prototypeIds: getMenCp011ConicalMaterialPrototypeIds(),
    sourceFocus:
      "explicit-inner and declared-similar conical shell material volume without inferred thickness",
  },
  {
    familyGroup: "CONICAL_SURFACE_AND_LINING_COST",
    prototypeIds: getMenCp011ConicalSurfaceCostPrototypeIds(),
    sourceFocus:
      "both conical curved walls and shell-derived inner conical lining cost",
  },
] as const;

export const MEN_CP011_NEIGHBOUR_OWNERSHIP_BOUNDARIES: readonly MenCp011NeighbourOwnershipBoundary[] = [
  {
    neighbouringCanonicalProblemId: "MEN-CP-007",
    retainedScope:
      "direct cube/cuboid surface area, open-top box sheet area, painting and coating where no shell material ledger is decisive",
    excludedFromMenCp011: [
      "direct open-top cuboid sheet area already owned by MEN-CP007-PROT-OPEN-TOP-BOX-AREA",
      "ordinary cuboid TSA/LSA and direct face-count questions",
    ],
  },
  {
    neighbouringCanonicalProblemId: "MEN-CP-008",
    retainedScope:
      "direct cylinder and cone volume, curved/total surface area, slant height, canvas and one-cone lining calculations",
    excludedFromMenCp011: [
      "single intact cylinder or cone measurement",
      "direct inner-cone lining when no inner-outer shell relation is used",
    ],
  },
  {
    neighbouringCanonicalProblemId: "MEN-CP-009",
    retainedScope:
      "direct sphere and hemisphere volume or surface measurement without an inner-outer shell transformation",
    excludedFromMenCp011: [
      "single solid sphere or hemisphere formula application",
    ],
  },
  {
    neighbouringCanonicalProblemId: "MEN-CP-010",
    retainedScope: "pyramids and frustums, including truncated-cone measurement",
    excludedFromMenCp011: [
      "conical frustum volume, curved area, total area and inverse dimensions",
    ],
  },
  {
    neighbouringCanonicalProblemId: "MEN-CP-012",
    retainedScope:
      "recasting and conservation of material between solids",
    excludedFromMenCp011: [
      "melting, recasting or transformation questions whose decisive rule is volume conservation",
    ],
  },
  {
    neighbouringCanonicalProblemId: "MEN-CP-013",
    retainedScope:
      "composite solids, drilled/removed solids and containment where no canonical shell relation governs the cavity",
    excludedFromMenCp011: [
      "generic drilled conical/cylindrical removal from another solid",
      "composite union or subtraction not organised as a hollow/open-surface family",
    ],
  },
] as const;

const EMPTY_EVIDENCE: MenCp011DirectSourceEvidence = {
  sourceType: null,
  documentId: null,
  documentTitle: null,
  editionOrYear: null,
  chapterOrSection: null,
  pageLocator: null,
  exemplarLocator: null,
  sourceContentHash: null,
  reviewer: null,
  reviewedAt: null,
};

function requiredEvidence(sourceFocus: string) {
  return [
    `one accepted direct source that explicitly covers ${sourceFocus}`,
    "stable document identifier and title",
    "edition/year plus chapter or section",
    "page or equivalent stable locator",
    "at least one representative question/example locator",
    "content hash or immutable extract identifier",
    "human reviewer and review timestamp",
  ] as const;
}

export const MEN_CP011_SOURCE_READINESS_ENTRIES: readonly MenCp011SourceReadinessEntry[] =
  GROUPS.flatMap((group) =>
    group.prototypeIds.map((prototypeId) => ({
      prototypeId,
      familyGroup: group.familyGroup,
      canonicalOwner: "MEN-CP-011" as const,
      formulaAuthorityStatus:
        "EXECUTABLE_AND_INDEPENDENTLY_VERIFIED" as const,
      ownershipStatus: "CANONICAL_OWNER_CONFIRMED" as const,
      sourceNormalisationStatus: "MISSING_DIRECT_REFERENCE" as const,
      evidence: { ...EMPTY_EVIDENCE },
      requiredEvidence: requiredEvidence(group.sourceFocus),
      publicationBlocked: true as const,
      permanentQlAllocationBlocked: true as const,
    })),
  );

export function getMenCp011LivePrototypeIds() {
  return GROUPS.flatMap((group) => group.prototypeIds);
}

export function hasCompleteDirectSourceEvidence(
  evidence: MenCp011DirectSourceEvidence,
) {
  return Boolean(
    evidence.sourceType &&
      evidence.documentId?.trim() &&
      evidence.documentTitle?.trim() &&
      evidence.editionOrYear?.trim() &&
      evidence.chapterOrSection?.trim() &&
      evidence.pageLocator?.trim() &&
      evidence.exemplarLocator?.trim() &&
      evidence.sourceContentHash?.trim() &&
      evidence.reviewer?.trim() &&
      evidence.reviewedAt?.trim(),
  );
}

export function auditMenCp011SourceReadiness() {
  const livePrototypeIds = getMenCp011LivePrototypeIds();
  const ledgerPrototypeIds = MEN_CP011_SOURCE_READINESS_ENTRIES.map(
    (entry) => entry.prototypeId,
  );
  const normalisedEntries = MEN_CP011_SOURCE_READINESS_ENTRIES.filter(
    (entry) =>
      entry.sourceNormalisationStatus === "DIRECTLY_NORMALISED" &&
      hasCompleteDirectSourceEvidence(entry.evidence),
  );
  const falselyNormalisedEntries = MEN_CP011_SOURCE_READINESS_ENTRIES.filter(
    (entry) =>
      entry.sourceNormalisationStatus === "DIRECTLY_NORMALISED" &&
      !hasCompleteDirectSourceEvidence(entry.evidence),
  );
  const missingEntries = MEN_CP011_SOURCE_READINESS_ENTRIES.filter(
    (entry) => entry.sourceNormalisationStatus === "MISSING_DIRECT_REFERENCE",
  );
  const familyGroupCounts = Object.fromEntries(
    GROUPS.map((group) => [group.familyGroup, group.prototypeIds.length]),
  ) as Record<MenCp011SourceFamilyGroup, number>;

  return {
    authority: MEN_CP011_SOURCE_READINESS_AUTHORITY,
    livePrototypeCount: livePrototypeIds.length,
    ledgerPrototypeCount: ledgerPrototypeIds.length,
    uniqueLivePrototypeCount: new Set(livePrototypeIds).size,
    uniqueLedgerPrototypeCount: new Set(ledgerPrototypeIds).size,
    liveAndLedgerSetsMatch:
      livePrototypeIds.length === ledgerPrototypeIds.length &&
      livePrototypeIds.every((prototypeId) =>
        ledgerPrototypeIds.includes(prototypeId),
      ),
    familyGroupCounts,
    canonicalOwnerConfirmedCount: MEN_CP011_SOURCE_READINESS_ENTRIES.filter(
      (entry) => entry.ownershipStatus === "CANONICAL_OWNER_CONFIRMED",
    ).length,
    executableFormulaAuthorityCount: MEN_CP011_SOURCE_READINESS_ENTRIES.filter(
      (entry) =>
        entry.formulaAuthorityStatus ===
        "EXECUTABLE_AND_INDEPENDENTLY_VERIFIED",
    ).length,
    directlyNormalisedCount: normalisedEntries.length,
    missingDirectReferenceCount: missingEntries.length,
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
      "SOURCE_REVIEWER_ATTESTATION_MISSING",
      "PERMANENT_QLS_UNALLOCATED",
      "MANUAL_ENGLISH_REVIEW_PENDING",
      "MULTILINGUAL_PARITY_PENDING",
    ] as const,
  };
}
