import type { QuantV4ExamProfileId } from "./exam-profile";
import {
  listRegisteredCountablePyqObservations,
} from "../quality/quant-v4-pyq-observation-registry-p2";
import type { QuantV4PyqExamId } from "../quality/quant-v4-pyq-frequency-evidence-p2";

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
  | "EVIDENCE_GATED_SELECTION_PENDING"
  | "EVIDENCE_ACCUMULATING_SELECTION_PENDING";

export type QuantV4SpecializedProfileEvidenceStatus =
  | "NO_NORMALIZED_COUNTABLE_PYQ_EVIDENCE"
  | "NORMALIZED_COUNTABLE_EVIDENCE_ACCUMULATING";

export interface QuantV4SpecializedProfileSelectionContract {
  readonly authority: typeof QUANT_V4_SPECIALIZED_PROFILE_SELECTION_AUTHORITY;
  readonly packageId: QuantV4SpecializedSelectionPackageId;
  readonly examProfile: QuantV4CompetitiveExamProfileId;
  readonly selectionStatus: QuantV4SpecializedProfileSelectionStatus;
  readonly profileSelectionCalibrated: false;
  readonly deliveryAllowed: true;
  readonly normalizedCountableObservationCount: number;
  readonly empiricalEvidenceStatus: QuantV4SpecializedProfileEvidenceStatus;
  readonly blockers: readonly string[];
}

export const QUANT_V4_SPECIALIZED_PROFILE_SOURCE_EXAMS: Readonly<
  Record<QuantV4CompetitiveExamProfileId, readonly QuantV4PyqExamId[]>
> = Object.freeze({
  SSC_CGL_TIER_I: Object.freeze(["SSC_CGL_TIER_I"]),
  SSC_CGL_CHSL: Object.freeze(["SSC_CHSL"]),
  SSC_CGL_JSO: Object.freeze(["SSC_CGL_TIER_II"]),
  PUNJAB_STATE: Object.freeze(["PSSSB", "PPSC", "PUNJAB_POLICE"]),
  BANKING_PRELIMS: Object.freeze(["IBPS_PO_PRELIMS"]),
  BANKING_MAINS: Object.freeze(["IBPS_PO_MAINS"]),
});

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

const ZERO_EVIDENCE_BLOCKERS = Object.freeze([
  "NO_NORMALIZED_COUNTABLE_PYQ_EVIDENCE",
  "CP_QL_DISTRIBUTION_UNPROVEN",
  "DIFFICULTY_REPRESENTATION_UNCALIBRATED",
] as const);

function buildContract(
  packageId: QuantV4SpecializedSelectionPackageId,
  examProfile: QuantV4CompetitiveExamProfileId,
): QuantV4SpecializedProfileSelectionContract {
  const observations = listRegisteredCountablePyqObservations({
    packageId,
    examIds: QUANT_V4_SPECIALIZED_PROFILE_SOURCE_EXAMS[examProfile],
  });

  if (!observations.length) {
    return Object.freeze({
      authority: QUANT_V4_SPECIALIZED_PROFILE_SELECTION_AUTHORITY,
      packageId,
      examProfile,
      selectionStatus: "EVIDENCE_GATED_SELECTION_PENDING",
      profileSelectionCalibrated: false,
      deliveryAllowed: true,
      normalizedCountableObservationCount: 0,
      empiricalEvidenceStatus: "NO_NORMALIZED_COUNTABLE_PYQ_EVIDENCE",
      blockers: ZERO_EVIDENCE_BLOCKERS,
    });
  }

  const blockers = [
    "PROFILE_SAMPLE_INSUFFICIENT_FOR_CALIBRATION",
    "CP_QL_DISTRIBUTION_UNPROVEN",
    "DIFFICULTY_REPRESENTATION_UNCALIBRATED",
  ];
  if (observations.some((observation) => !observation.heldDate || !observation.shift)) {
    blockers.push("DATED_PAPER_IDENTITY_INCOMPLETE");
  }

  return Object.freeze({
    authority: QUANT_V4_SPECIALIZED_PROFILE_SELECTION_AUTHORITY,
    packageId,
    examProfile,
    selectionStatus: "EVIDENCE_ACCUMULATING_SELECTION_PENDING",
    profileSelectionCalibrated: false,
    deliveryAllowed: true,
    normalizedCountableObservationCount: observations.length,
    empiricalEvidenceStatus: "NORMALIZED_COUNTABLE_EVIDENCE_ACCUMULATING",
    blockers: Object.freeze(blockers),
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
  const competitiveProfiles = QUANT_V4_SPECIALIZED_PROFILE_SELECTION_CONTRACTS[packageId];
  const totalEvidence = listRegisteredCountablePyqObservations({ packageId }).length;
  const evidenceBearingProfileCount = Object.values(competitiveProfiles)
    .filter((contract) => contract.normalizedCountableObservationCount > 0)
    .length;

  return Object.freeze({
    authority: QUANT_V4_SPECIALIZED_PROFILE_SELECTION_AUTHORITY,
    defaultSelectionStatus: "EVIDENCE_GATED_SELECTION_PENDING" as const,
    profileSelectionCalibrated: false as const,
    deliveryAllowed: true as const,
    normalizedCountableObservationCount: totalEvidence,
    evidenceBearingProfileCount,
    competitiveProfiles,
  });
}
