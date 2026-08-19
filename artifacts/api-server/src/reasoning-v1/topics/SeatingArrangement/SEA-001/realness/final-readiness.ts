import {
  SEA_EXAM_REALNESS_EVIDENCE,
  summarizeSeaExamRealnessEvidence,
} from "./exam-evidence.ts";
import { SEA001_PERMANENT_INACTIVE_LIFECYCLE } from "../permanent/freeze.ts";
import { runSea001ExternalSourceAudit } from "../saturation/source-audit.ts";

export const SEA001_REALNESS_GATE_POLICY = Object.freeze({
  technicalSourceAuthority: "WAVE5_EXTERNAL_SOURCE_AUDIT" as const,
  machineArtifactPolicy: "MEASURE_THEN_PIN_THRESHOLDS" as const,
  productWeightingPolicy: "FAMILY_COMPLETE_EVIDENCE_REQUIRED" as const,
  dynamicMultilingualPolicy: "MEASUREMENT_PLUS_HUMAN_SPOT_REVIEW_REQUIRED" as const,
});

export type Sea001RealnessBlocker =
  | "TECHNICAL_SOURCE_AUDIT_NOT_GREEN"
  | "SSC_REQUIRES_SEA002"
  | "BANKING_REQUIRES_SEA002_AND_SEA003"
  | "PUNJAB_SOURCE_BASE_TOO_NARROW"
  | "MACHINE_ARTIFACT_THRESHOLDS_NOT_PINNED"
  | "DYNAMIC_MULTILINGUAL_SPOT_REVIEW_PENDING";

export interface Sea001FinalRealnessReadiness {
  readonly technicalSourceSaturation: "GREEN" | "BLOCKED";
  readonly technicalSourceEvidenceRecords: number;
  readonly technicalSourceExamFamiliesCovered: number;
  readonly technicalSourceCheckpointsCovered: number;
  readonly targetExamRealnessEvidenceRecords: number;
  readonly familyProductWeightFreezeReady: false;
  readonly machineArtifactThresholdFreezeReady: false;
  readonly dynamicMultilingualSpotReviewStatus: "PENDING";
  readonly blockers: readonly Sea001RealnessBlocker[];
  readonly weightingPolicy: "OBSERVED_COUNTS_ONLY_DO_NOT_CONVERT_TO_PRODUCT_PERCENTAGES_YET";
  readonly productActivationStillLocked: true;
}

export function sea001FinalRealnessReadiness(): Sea001FinalRealnessReadiness {
  const source = runSea001ExternalSourceAudit();
  const exam = summarizeSeaExamRealnessEvidence();
  const blockers: Sea001RealnessBlocker[] = [];

  if (!source.passed) blockers.push("TECHNICAL_SOURCE_AUDIT_NOT_GREEN");
  if (exam.SSC.completenessStatus === "REQUIRES_SEA002") blockers.push("SSC_REQUIRES_SEA002");
  if (exam.BANKING.completenessStatus === "REQUIRES_SEA002_AND_SEA003") {
    blockers.push("BANKING_REQUIRES_SEA002_AND_SEA003");
  }
  if (exam.PUNJAB_STATE.completenessStatus === "SOURCE_BASE_TOO_NARROW") {
    blockers.push("PUNJAB_SOURCE_BASE_TOO_NARROW");
  }

  // Deliberately fail closed until the deterministic combined measurement is available
  // and its engineering thresholds are pinned from observed data rather than guessed.
  blockers.push("MACHINE_ARTIFACT_THRESHOLDS_NOT_PINNED");

  // The approved multilingual freeze protects the reviewed corpus. It must not be reused
  // as approval for a fresh dynamic-generation realness sample.
  blockers.push("DYNAMIC_MULTILINGUAL_SPOT_REVIEW_PENDING");

  const productActivationStillLocked = !SEA001_PERMANENT_INACTIVE_LIFECYCLE.questionStudioRegistered
    && !SEA001_PERMANENT_INACTIVE_LIFECYCLE.questionBankWritable
    && !SEA001_PERMANENT_INACTIVE_LIFECYCLE.testEligible
    && !SEA001_PERMANENT_INACTIVE_LIFECYCLE.publiclyPublishable;

  if (!productActivationStillLocked) {
    throw new Error("SEA-001 realness audit must never activate downstream product gates.");
  }

  return {
    technicalSourceSaturation: source.passed ? "GREEN" : "BLOCKED",
    technicalSourceEvidenceRecords: source.evidenceCount,
    technicalSourceExamFamiliesCovered: source.examFamiliesCovered.length,
    technicalSourceCheckpointsCovered: source.checkpointsCovered.length,
    targetExamRealnessEvidenceRecords: SEA_EXAM_REALNESS_EVIDENCE.length,
    familyProductWeightFreezeReady: false,
    machineArtifactThresholdFreezeReady: false,
    dynamicMultilingualSpotReviewStatus: "PENDING",
    blockers,
    weightingPolicy: exam.weightingPolicy,
    productActivationStillLocked: true,
  };
}
