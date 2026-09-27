import type {
  QuantV4CompetitiveExamProfileId,
  QuantV4SpecializedSelectionPackageId,
} from "../common/specialized-profile-selection";
import {
  buildQuantV4SpecializedCalibrationReadiness,
  type QuantV4SpecializedCalibrationReadiness,
} from "./quant-v4-specialized-profile-calibration-readiness-p3";

export const QUANT_V4_SPECIALIZED_PROFILE_CALIBRATION_POLICY_AUTHORITY =
  "QUANT-V4-SPECIALIZED-PROFILE-CALIBRATION-POLICY-P3" as const;

export interface QuantV4SpecializedCalibrationPolicy {
  readonly minCountableObservations: number;
  readonly minDistinctPapers: number;
  readonly minCanonicalCpCoverage: number;
  readonly minRepresentationCoverage: number;
  readonly requireCompleteCanonicalCpMapping: boolean;
  readonly requireDifficultyEvidence: boolean;
}

export type QuantV4SpecializedCalibrationPolicyStatus =
  | "POLICY_EVALUATION_HOLD"
  | "POLICY_EVALUATION_CANDIDATE";

export interface QuantV4SpecializedCalibrationPolicyAssessment {
  readonly authority: typeof QUANT_V4_SPECIALIZED_PROFILE_CALIBRATION_POLICY_AUTHORITY;
  readonly packageId: QuantV4SpecializedSelectionPackageId;
  readonly examProfile: QuantV4CompetitiveExamProfileId;
  readonly policy: QuantV4SpecializedCalibrationPolicy;
  readonly readiness: QuantV4SpecializedCalibrationReadiness;
  readonly status: QuantV4SpecializedCalibrationPolicyStatus;
  readonly blockers: readonly string[];
  readonly selectionCalibrationCandidate: boolean;
  readonly selectionPromotionAuthorized: false;
}

export type QuantV4SpecializedCalibrationPolicyKey =
  `${QuantV4SpecializedSelectionPackageId}::${QuantV4CompetitiveExamProfileId}`;

// No package/profile policy is adopted yet. This is deliberately empty.
// Adding an entry is a separate governance action and must be reviewed against
// the evidence methodology before selector behavior changes.
export const QUANT_V4_ADOPTED_SPECIALIZED_CALIBRATION_POLICIES:
  Readonly<Partial<Record<QuantV4SpecializedCalibrationPolicyKey, QuantV4SpecializedCalibrationPolicy>>> =
  Object.freeze({});

function assertNonNegativeInteger(name: string, value: number): void {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${name} must be a non-negative integer.`);
  }
}

export function validateQuantV4SpecializedCalibrationPolicy(
  policy: QuantV4SpecializedCalibrationPolicy,
): void {
  assertNonNegativeInteger("minCountableObservations", policy.minCountableObservations);
  assertNonNegativeInteger("minDistinctPapers", policy.minDistinctPapers);
  assertNonNegativeInteger("minCanonicalCpCoverage", policy.minCanonicalCpCoverage);
  assertNonNegativeInteger("minRepresentationCoverage", policy.minRepresentationCoverage);
}

export function specializedCalibrationPolicyKey(
  packageId: QuantV4SpecializedSelectionPackageId,
  examProfile: QuantV4CompetitiveExamProfileId,
): QuantV4SpecializedCalibrationPolicyKey {
  return `${packageId}::${examProfile}`;
}

export function getAdoptedQuantV4SpecializedCalibrationPolicy(
  packageId: QuantV4SpecializedSelectionPackageId,
  examProfile: QuantV4CompetitiveExamProfileId,
): QuantV4SpecializedCalibrationPolicy | null {
  return QUANT_V4_ADOPTED_SPECIALIZED_CALIBRATION_POLICIES[
    specializedCalibrationPolicyKey(packageId, examProfile)
  ] ?? null;
}

export function assessQuantV4SpecializedCalibrationPolicy(input: {
  readonly packageId: QuantV4SpecializedSelectionPackageId;
  readonly examProfile: QuantV4CompetitiveExamProfileId;
  readonly policy: QuantV4SpecializedCalibrationPolicy;
}): QuantV4SpecializedCalibrationPolicyAssessment {
  validateQuantV4SpecializedCalibrationPolicy(input.policy);
  const readiness = buildQuantV4SpecializedCalibrationReadiness({
    packageId: input.packageId,
    examProfile: input.examProfile,
  });

  const blockers: string[] = [];
  if (readiness.countableObservationCount < input.policy.minCountableObservations) {
    blockers.push("COUNTABLE_OBSERVATION_SAMPLE_BELOW_POLICY");
  }
  if (readiness.distinctPaperCount < input.policy.minDistinctPapers) {
    blockers.push("DISTINCT_PAPER_SAMPLE_BELOW_POLICY");
  }
  if (readiness.canonicalCpCoverage.length < input.policy.minCanonicalCpCoverage) {
    blockers.push("CANONICAL_CP_COVERAGE_BELOW_POLICY");
  }
  if (readiness.representationCoverageCount < input.policy.minRepresentationCoverage) {
    blockers.push("REPRESENTATION_COVERAGE_BELOW_POLICY");
  }
  if (input.policy.requireCompleteCanonicalCpMapping && readiness.cpMappingCompleteness < 1) {
    blockers.push("CANONICAL_CP_MAPPING_INCOMPLETE");
  }
  if (input.policy.requireDifficultyEvidence && !readiness.difficultyEvidenceAvailable) {
    blockers.push("DIFFICULTY_EVIDENCE_REQUIRED");
  }

  const selectionCalibrationCandidate = blockers.length === 0;
  return Object.freeze({
    authority: QUANT_V4_SPECIALIZED_PROFILE_CALIBRATION_POLICY_AUTHORITY,
    packageId: input.packageId,
    examProfile: input.examProfile,
    policy: Object.freeze({ ...input.policy }),
    readiness,
    status: selectionCalibrationCandidate ? "POLICY_EVALUATION_CANDIDATE" : "POLICY_EVALUATION_HOLD",
    blockers: Object.freeze(blockers),
    selectionCalibrationCandidate,
    selectionPromotionAuthorized: false,
  });
}
