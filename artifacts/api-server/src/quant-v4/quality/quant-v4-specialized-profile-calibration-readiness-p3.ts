import type { QuantV4CompetitiveExamProfileId, QuantV4SpecializedSelectionPackageId } from "../common/specialized-profile-selection";
import {
  QUANT_V4_SPECIALIZED_PROFILE_SOURCE_EXAMS,
} from "../common/specialized-profile-selection";
import {
  listRegisteredCountablePyqObservations,
} from "./quant-v4-pyq-observation-registry-p2";

export const QUANT_V4_SPECIALIZED_PROFILE_CALIBRATION_READINESS_AUTHORITY =
  "QUANT-V4-SPECIALIZED-PROFILE-CALIBRATION-READINESS-P3" as const;

export type QuantV4SpecializedCalibrationReadinessStatus =
  | "NO_EVIDENCE"
  | "EVIDENCE_PRESENT_POLICY_REQUIRED";

export interface QuantV4SpecializedCalibrationReadiness {
  readonly authority: typeof QUANT_V4_SPECIALIZED_PROFILE_CALIBRATION_READINESS_AUTHORITY;
  readonly packageId: QuantV4SpecializedSelectionPackageId;
  readonly examProfile: QuantV4CompetitiveExamProfileId;
  readonly status: QuantV4SpecializedCalibrationReadinessStatus;
  readonly countableObservationCount: number;
  readonly datedObservationCount: number;
  readonly distinctPaperCount: number;
  readonly representationCoverageCount: number;
  readonly canonicalCpMappedObservationCount: number;
  readonly canonicalCpCoverage: readonly string[];
  readonly cpMappingCompleteness: number;
  readonly difficultyMappedObservationCount: number;
  readonly difficultyMappingCompleteness: number;
  readonly difficultyEvidenceAvailable: boolean;
  readonly calibrationPolicyAdopted: false;
  readonly blockers: readonly string[];
  readonly selectionCalibrationAuthorized: false;
}

function canonicalCpFromObservation(packageId: string, subtopic: string): string | null {
  const prefix = packageId.split("-")[0] ?? "";
  const match = new RegExp(`\\b${prefix}-CP-\\d{3}\\b`, "u").exec(subtopic);
  return match?.[0] ?? null;
}

export function buildQuantV4SpecializedCalibrationReadiness(input: {
  packageId: QuantV4SpecializedSelectionPackageId;
  examProfile: QuantV4CompetitiveExamProfileId;
}): QuantV4SpecializedCalibrationReadiness {
  const examIds = QUANT_V4_SPECIALIZED_PROFILE_SOURCE_EXAMS[input.examProfile];
  const observations = listRegisteredCountablePyqObservations({
    packageId: input.packageId,
    examIds,
  });

  const dated = observations.filter((entry) => Boolean(entry.heldDate && entry.shift));
  const paperIds = new Set(
    dated.map((entry) => String(entry.paperId ?? "").trim()).filter(Boolean),
  );
  const representations = new Set(
    observations.map((entry) => String(entry.representation ?? "").trim()).filter(Boolean),
  );
  const mappedCps = observations
    .map((entry) => canonicalCpFromObservation(input.packageId, entry.subtopic))
    .filter((entry): entry is string => Boolean(entry));
  const cpCoverage = [...new Set(mappedCps)].sort();

  const difficultyMapped = observations.filter(
    (entry) =>
      Boolean(entry.empiricalDifficulty)
      && Boolean(entry.empiricalDifficultyBasis)
      && Boolean(String(entry.difficultyEvidenceRef ?? "").trim()),
  );
  const difficultyMappingCompleteness = observations.length
    ? difficultyMapped.length / observations.length
    : 0;
  const difficultyEvidenceAvailable =
    observations.length > 0 && difficultyMapped.length === observations.length;

  const blockers: string[] = [];
  if (!observations.length) blockers.push("NO_NORMALIZED_COUNTABLE_PYQ_EVIDENCE");
  if (observations.length) blockers.push("CALIBRATION_POLICY_NOT_ADOPTED");
  if (observations.length && mappedCps.length !== observations.length) {
    blockers.push("CANONICAL_CP_MAPPING_INCOMPLETE");
  }
  if (observations.length && !difficultyEvidenceAvailable) {
    blockers.push("DIFFICULTY_EVIDENCE_NOT_NORMALIZED");
  }

  return Object.freeze({
    authority: QUANT_V4_SPECIALIZED_PROFILE_CALIBRATION_READINESS_AUTHORITY,
    packageId: input.packageId,
    examProfile: input.examProfile,
    status: observations.length ? "EVIDENCE_PRESENT_POLICY_REQUIRED" : "NO_EVIDENCE",
    countableObservationCount: observations.length,
    datedObservationCount: dated.length,
    distinctPaperCount: paperIds.size,
    representationCoverageCount: representations.size,
    canonicalCpMappedObservationCount: mappedCps.length,
    canonicalCpCoverage: Object.freeze(cpCoverage),
    cpMappingCompleteness: observations.length ? mappedCps.length / observations.length : 0,
    difficultyMappedObservationCount: difficultyMapped.length,
    difficultyMappingCompleteness,
    difficultyEvidenceAvailable,
    calibrationPolicyAdopted: false,
    blockers: Object.freeze(blockers),
    selectionCalibrationAuthorized: false,
  });
}
