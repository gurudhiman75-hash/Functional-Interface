import type { QuantV4WholeSectionFrequencyProfile } from "./quant-v4-whole-section-frequency-calibration-p2";

export const QUANT_V4_WHOLE_SECTION_FREQUENCY_SUPPORT_AUTHORITY =
  "QUANT-V4-WHOLE-SECTION-FREQUENCY-SUPPORT-P2" as const;

export type QuantV4FrequencySupportTier =
  | "CORE_EVIDENCE"
  | "ESTABLISHED_EVIDENCE"
  | "THIN_EVIDENCE";

export interface QuantV4PackageFrequencySupport {
  readonly packageId: string;
  readonly questionCount: number;
  readonly questionShare: number;
  readonly meanQuestionsPerSection: number;
  readonly sectionPresenceCount: number;
  readonly sectionPresenceShare: number;
  readonly supportTier: QuantV4FrequencySupportTier;
}

export interface QuantV4FrequencySupportAssessment {
  readonly authority: typeof QUANT_V4_WHOLE_SECTION_FREQUENCY_SUPPORT_AUTHORITY;
  readonly sampleQuestionCount: number;
  readonly completeSectionCount: number;
  readonly packages: readonly QuantV4PackageFrequencySupport[];
  readonly coreEvidencePackages: readonly string[];
  readonly establishedEvidencePackages: readonly string[];
  readonly thinEvidencePackages: readonly string[];
  readonly productionWeightingAuthorized: false;
}

/**
 * Audit-only descriptive support labels.
 *
 * These thresholds deliberately describe evidence density rather than production
 * readiness. They MUST NOT be used as mock-test quotas or as a promotion gate.
 *
 * CORE_EVIDENCE:        observed share >= 5%
 * ESTABLISHED_EVIDENCE: observed share >= 2% and < 5%
 * THIN_EVIDENCE:        observed share < 2%
 */
function supportTier(questionShare: number): QuantV4FrequencySupportTier {
  if (questionShare >= 0.05) return "CORE_EVIDENCE";
  if (questionShare >= 0.02) return "ESTABLISHED_EVIDENCE";
  return "THIN_EVIDENCE";
}

export function buildQuantV4FrequencySupportAssessment(
  profile: QuantV4WholeSectionFrequencyProfile,
): QuantV4FrequencySupportAssessment {
  const packages = Object.freeze(
    profile.packageWeights.map((bucket) =>
      Object.freeze({
        packageId: bucket.packageId,
        questionCount: bucket.questionCount,
        questionShare: bucket.questionShare,
        meanQuestionsPerSection: bucket.meanQuestionsPerSection,
        sectionPresenceCount: bucket.sectionPresenceCount,
        sectionPresenceShare: bucket.sectionPresenceShare,
        supportTier: supportTier(bucket.questionShare),
      }),
    ),
  );

  const ids = (tier: QuantV4FrequencySupportTier) =>
    Object.freeze(packages.filter((entry) => entry.supportTier === tier).map((entry) => entry.packageId));

  return Object.freeze({
    authority: QUANT_V4_WHOLE_SECTION_FREQUENCY_SUPPORT_AUTHORITY,
    sampleQuestionCount: profile.completeQuestionCount,
    completeSectionCount: profile.completeSectionCount,
    packages,
    coreEvidencePackages: ids("CORE_EVIDENCE"),
    establishedEvidencePackages: ids("ESTABLISHED_EVIDENCE"),
    thinEvidencePackages: ids("THIN_EVIDENCE"),
    productionWeightingAuthorized: false,
  });
}
