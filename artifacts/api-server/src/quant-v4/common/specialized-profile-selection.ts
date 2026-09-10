import type { QuantV4ExamProfileId } from "./exam-profile";

export const QUANT_V4_SPECIALIZED_PROFILE_SELECTION_AUTHORITY =
  "QUANT-V4-SPECIALIZED-PROFILE-SELECTION-EVIDENCE-GATE-P2" as const;

export type QuantV4SpecializedSelectionPackageId =
  | "AVG-001"
  | "MAL-001"
  | "NUM-001"
  | "TMW-001";

export type QuantV4CompetitiveExamProfileId = Exclude<
  QuantV4ExamProfileId,
  "GENERIC_PRACTICE"
>;

export type QuantV4SpecializedProfileSelectionStatus =
  "EVIDENCE_GATED_SELECTION_PENDING";

export type QuantV4SpecializedProfileEvidenceStatus =
  "NO_NORMALIZED_COUNTABLE_PYQ_EVIDENCE";

export interface QuantV4SpecializedProfileSelectionContract {
  readonly authority: typeof QUANT_V4_SPECIALIZED_PROFILE_SELECTION_AUTHORITY;
  readonly packageId: QuantV4SpecializedSelectionPackageId;
  readonly examProfile: QuantV4CompetitiveExamProfileId;
  readonly selectionStatus: QuantV4SpecializedProfileSelectionStatus;
  readonly profileSelectionCalibrated: false;
  readonly deliveryAllowed: true;
  readonly normalizedCountableObservationCount: 0;
  readonly empiricalEvidenceStatus: QuantV4SpecializedProfileEvidenceStatus;
  readonly blockers: readonly [
    "NO_NORMALIZED_COUNTABLE_PYQ_EVIDENCE",
    "CP_QL_DISTRIBUTION_UNPROVEN",
    "DIFFICULTY_REPRESENTATION_UNCALIBRATED",
  ];
}

const COMPETITIVE_PROFILES: readonly QuantV4CompetitiveExamProfileId[] = Object.freeze([
  "SSC_CGL_TIER_I",
  "SSC_CGL_CHSL",
  "SSC_CGL_JSO",
  "PUNJAB_STATE",
  "BANKING_PRELIMS",
  "BANKING_MAINS",
]);

const SPECIALIZED_PACKAGES: readonly QuantV4SpecializedSelectionPackageId[] = Object.freeze([
  "AVG-001",
  "MAL-001",
  "NUM-001",
  "TMW-001",
]);

const BLOCKERS = Object.freeze([
  "NO_NORMALIZED_COUNTABLE_PYQ_EVIDENCE",
  "CP_QL_DISTRIBUTION_UNPROVEN",
  "DIFFICULTY_REPRESENTATION_UNCALIBRATED",
] as const);

function buildContract(
  packageId: QuantV4SpecializedSelectionPackageId,
  examProfile: QuantV4CompetitiveExamProfileId,
): QuantV4SpecializedProfileSelectionContract {
  return Object.freeze({
    authority: QUANT_V4_SPECIALIZED_PROFILE_SELECTION_AUTHORITY,
    packageId,
    examProfile,
    selectionStatus: "EVIDENCE_GATED_SELECTION_PENDING",
    profileSelectionCalibrated: false,
    deliveryAllowed: true,
    normalizedCountableObservationCount: 0,
    empiricalEvidenceStatus: "NO_NORMALIZED_COUNTABLE_PYQ_EVIDENCE",
    blockers: BLOCKERS,
  });
}

export const QUANT_V4_SPECIALIZED_PROFILE_SELECTION_CONTRACTS = Object.freeze(
  Object.fromEntries(
    SPECIALIZED_PACKAGES.map((packageId) => [
      packageId,
      Object.freeze(
        Object.fromEntries(
          COMPETITIVE_PROFILES.map((examProfile) => [
            examProfile,
            buildContract(packageId, examProfile),
          ]),
        ) as Record<QuantV4CompetitiveExamProfileId, QuantV4SpecializedProfileSelectionContract>,
      ),
    ]),
  ) as Record<
    QuantV4SpecializedSelectionPackageId,
    Readonly<Record<QuantV4CompetitiveExamProfileId, QuantV4SpecializedProfileSelectionContract>>
  >,
);

export function getQuantV4SpecializedProfileSelectionContract(
  packageId: QuantV4SpecializedSelectionPackageId,
  examProfile: QuantV4CompetitiveExamProfileId,
): QuantV4SpecializedProfileSelectionContract {
  return QUANT_V4_SPECIALIZED_PROFILE_SELECTION_CONTRACTS[packageId][examProfile];
}

export function getQuantV4SpecializedProfileSelectionCapability(
  packageId: QuantV4SpecializedSelectionPackageId,
) {
  return Object.freeze({
    authority: QUANT_V4_SPECIALIZED_PROFILE_SELECTION_AUTHORITY,
    defaultSelectionStatus: "EVIDENCE_GATED_SELECTION_PENDING" as const,
    profileSelectionCalibrated: false as const,
    deliveryAllowed: true as const,
    normalizedCountableObservationCount: 0 as const,
    competitiveProfiles: QUANT_V4_SPECIALIZED_PROFILE_SELECTION_CONTRACTS[packageId],
  });
}
