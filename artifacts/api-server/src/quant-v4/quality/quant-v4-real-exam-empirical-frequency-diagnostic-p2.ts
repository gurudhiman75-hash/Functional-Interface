import {
  QUANT_V4_REAL_EXAM_MIN_SECTIONS_PER_PROFILE,
  QUANT_V4_REAL_EXAM_PROFILES,
  QUANT_V4_REAL_EXAM_SIMULATION_AUTHORITY,
  generateQuantV4RealExamSection,
  summarizeQuantV4RealExamSections,
  type QuantV4RealExamAuditSummary,
  type QuantV4SimulatedSection,
} from "./quant-v4-real-exam-simulation-p2";
import { QUANT_V4_REGISTERED_PYQ_OBSERVATIONS } from "./quant-v4-pyq-observation-registry-p2";
import {
  QUANT_V4_CGL_TIER_I_COMPLETE_SECTION_SPECS,
  QUANT_V4_CGL_TIER_I_WHOLE_SECTION_P2_AUDIT_POLICY,
  QUANT_V4_WHOLE_SECTION_FREQUENCY_CALIBRATION_AUTHORITY,
  buildQuantV4WholeSectionFrequencyProfile,
  canPromoteWholeSectionFrequencyWeights,
  type QuantV4WholeSectionFrequencyProfile,
} from "./quant-v4-whole-section-frequency-calibration-p2";

export const QUANT_V4_REAL_EXAM_EMPIRICAL_FREQUENCY_DIAGNOSTIC_AUTHORITY =
  "QUANT-V4-REAL-EXAM-EMPIRICAL-FREQUENCY-DIAGNOSTIC-P2" as const;

export type QuantV4EmpiricalFrequencyApplicationStatus =
  "DIAGNOSTIC_ONLY_NOT_APPLIED";

export interface QuantV4SimulatorPackageDivergence {
  readonly packageId: string;
  readonly empiricalQuestionCount: number;
  readonly empiricalQuestionShare: number;
  readonly empiricalMeanQuestionsPerSection: number;
  readonly empiricalSectionPresenceShare: number;
  readonly simulatedRecordCount: number;
  readonly simulatedRecordShare: number;
  readonly simulatedMeanRecordsPerSection: number;
  readonly signedShareDelta: number;
  readonly absoluteShareDelta: number;
}

export interface QuantV4RealExamEmpiricalFrequencyDiagnostic {
  readonly authority: typeof QUANT_V4_REAL_EXAM_EMPIRICAL_FREQUENCY_DIAGNOSTIC_AUTHORITY;
  readonly simulatorAuthority: typeof QUANT_V4_REAL_EXAM_SIMULATION_AUTHORITY;
  readonly wholeSectionAuthority: typeof QUANT_V4_WHOLE_SECTION_FREQUENCY_CALIBRATION_AUTHORITY;
  readonly examId: "SSC_CGL_TIER_I";
  readonly applicationStatus: QuantV4EmpiricalFrequencyApplicationStatus;
  readonly empiricalWeightsApplied: false;
  readonly productionPromotionAuthorized: boolean;
  readonly canPromoteWholeSectionWeights: boolean;
  readonly provisionalBlueprintEvidence: string;
  readonly provisionalSlotPlan: readonly Readonly<{ kind: string; count: number }>[];
  readonly sectionsSimulated: number;
  readonly simulatedRecordCount: number;
  readonly simulatedRuntimeCount: number;
  readonly simulatedCapabilityGapCount: number;
  readonly simulatedCapabilityGapShare: number;
  readonly simulatorReadiness: QuantV4RealExamAuditSummary["readiness"];
  readonly simulatorBlockers: readonly string[];
  readonly completeSectionCount: number;
  readonly empiricalQuestionCount: number;
  readonly empiricalPackageCoverageCount: number;
  readonly empiricalDistinctSectionYearCount: number;
  readonly nonWholeSectionCountableQuestionCount: number;
  readonly undatedCountableQuestionCount: number;
  readonly empiricalEvidenceStatus: QuantV4WholeSectionFrequencyProfile["evidenceStatus"];
  readonly empiricalBlockers: readonly string[];
  readonly totalVariationDistance: number;
  readonly l1ShareDistance: number;
  readonly packageComparison: readonly QuantV4SimulatorPackageDivergence[];
}

function countPackages(sections: readonly QuantV4SimulatedSection[]): Readonly<Record<string, number>> {
  const counts: Record<string, number> = {};
  for (const question of sections.flatMap((section) => section.questions)) {
    const packageId = String(question.packageId || "UNMAPPED_PACKAGE").trim() || "UNMAPPED_PACKAGE";
    counts[packageId] = (counts[packageId] ?? 0) + 1;
  }
  return Object.freeze(Object.fromEntries(Object.entries(counts).sort(([left], [right]) => left.localeCompare(right))));
}

export function buildQuantV4SimulatorPackageDivergence(input: {
  readonly sectionsSimulated: number;
  readonly simulatedPackageCounts: Readonly<Record<string, number>>;
  readonly empiricalProfile: QuantV4WholeSectionFrequencyProfile;
}): readonly QuantV4SimulatorPackageDivergence[] {
  const simulatedTotal = Object.values(input.simulatedPackageCounts).reduce((sum, count) => sum + count, 0);
  const empiricalByPackage = new Map(input.empiricalProfile.packageWeights.map((bucket) => [bucket.packageId, bucket] as const));
  const packageIds = new Set([
    ...Object.keys(input.simulatedPackageCounts),
    ...input.empiricalProfile.packageWeights.map((bucket) => bucket.packageId),
  ]);

  return Object.freeze(
    [...packageIds]
      .map((packageId) => {
        const empirical = empiricalByPackage.get(packageId);
        const simulatedRecordCount = input.simulatedPackageCounts[packageId] ?? 0;
        const empiricalQuestionShare = empirical?.questionShare ?? 0;
        const simulatedRecordShare = simulatedTotal ? simulatedRecordCount / simulatedTotal : 0;
        const signedShareDelta = simulatedRecordShare - empiricalQuestionShare;
        return Object.freeze({
          packageId,
          empiricalQuestionCount: empirical?.questionCount ?? 0,
          empiricalQuestionShare,
          empiricalMeanQuestionsPerSection: empirical?.meanQuestionsPerSection ?? 0,
          empiricalSectionPresenceShare: empirical?.sectionPresenceShare ?? 0,
          simulatedRecordCount,
          simulatedRecordShare,
          simulatedMeanRecordsPerSection: input.sectionsSimulated ? simulatedRecordCount / input.sectionsSimulated : 0,
          signedShareDelta,
          absoluteShareDelta: Math.abs(signedShareDelta),
        });
      })
      .sort((left, right) => right.absoluteShareDelta - left.absoluteShareDelta || left.packageId.localeCompare(right.packageId)),
  );
}

export async function runQuantV4RealExamEmpiricalFrequencyDiagnosticP2(input: {
  readonly sectionsPerAudit?: number;
  readonly seedPrefix?: string;
} = {}): Promise<QuantV4RealExamEmpiricalFrequencyDiagnostic> {
  const exam = QUANT_V4_REAL_EXAM_PROFILES.find((profile) => profile.id === "SSC_CGL_TIER_I");
  if (!exam) throw new Error("SSC_CGL_TIER_I real-exam profile is missing.");

  const sectionsPerAudit = Math.max(
    QUANT_V4_REAL_EXAM_MIN_SECTIONS_PER_PROFILE,
    Math.floor(input.sectionsPerAudit ?? QUANT_V4_REAL_EXAM_MIN_SECTIONS_PER_PROFILE),
  );
  const sections: QuantV4SimulatedSection[] = [];
  const seedPrefix = input.seedPrefix ?? QUANT_V4_REAL_EXAM_EMPIRICAL_FREQUENCY_DIAGNOSTIC_AUTHORITY;
  for (let sectionIndex = 1; sectionIndex <= sectionsPerAudit; sectionIndex += 1) {
    sections.push(await generateQuantV4RealExamSection({
      examId: "SSC_CGL_TIER_I",
      sectionIndex,
      seed: `${seedPrefix}:SSC_CGL_TIER_I:${sectionIndex}`,
    }));
  }

  const simulatorSummary = summarizeQuantV4RealExamSections(exam, sections);
  const empiricalProfile = buildQuantV4WholeSectionFrequencyProfile({
    examId: "SSC_CGL_TIER_I",
    observations: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS,
    sections: QUANT_V4_CGL_TIER_I_COMPLETE_SECTION_SPECS,
    policy: QUANT_V4_CGL_TIER_I_WHOLE_SECTION_P2_AUDIT_POLICY,
  });
  const simulatedPackageCounts = countPackages(sections);
  const packageComparison = buildQuantV4SimulatorPackageDivergence({
    sectionsSimulated: sectionsPerAudit,
    simulatedPackageCounts,
    empiricalProfile,
  });
  const l1ShareDistance = packageComparison.reduce((sum, entry) => sum + entry.absoluteShareDelta, 0);
  const simulatedRecordCount = sections.reduce((sum, section) => sum + section.questions.length, 0);

  return Object.freeze({
    authority: QUANT_V4_REAL_EXAM_EMPIRICAL_FREQUENCY_DIAGNOSTIC_AUTHORITY,
    simulatorAuthority: QUANT_V4_REAL_EXAM_SIMULATION_AUTHORITY,
    wholeSectionAuthority: QUANT_V4_WHOLE_SECTION_FREQUENCY_CALIBRATION_AUTHORITY,
    examId: "SSC_CGL_TIER_I",
    applicationStatus: "DIAGNOSTIC_ONLY_NOT_APPLIED",
    empiricalWeightsApplied: false,
    productionPromotionAuthorized: empiricalProfile.productionPromotionAuthorized,
    canPromoteWholeSectionWeights: canPromoteWholeSectionFrequencyWeights(empiricalProfile),
    provisionalBlueprintEvidence: exam.blueprintEvidence,
    provisionalSlotPlan: Object.freeze(exam.slotPlan.map((slot) => Object.freeze({ ...slot }))),
    sectionsSimulated: sectionsPerAudit,
    simulatedRecordCount,
    simulatedRuntimeCount: simulatorSummary.runtimeGeneratedCount,
    simulatedCapabilityGapCount: simulatorSummary.capabilityGapCount,
    simulatedCapabilityGapShare: simulatedRecordCount ? simulatorSummary.capabilityGapCount / simulatedRecordCount : 0,
    simulatorReadiness: simulatorSummary.readiness,
    simulatorBlockers: Object.freeze([...simulatorSummary.blockers]),
    completeSectionCount: empiricalProfile.completeSectionCount,
    empiricalQuestionCount: empiricalProfile.completeQuestionCount,
    empiricalPackageCoverageCount: empiricalProfile.packageCoverageCount,
    empiricalDistinctSectionYearCount: empiricalProfile.distinctSectionYearCount,
    nonWholeSectionCountableQuestionCount: empiricalProfile.nonWholeSectionCountableQuestionCount,
    undatedCountableQuestionCount: empiricalProfile.undatedCountableQuestionCount,
    empiricalEvidenceStatus: empiricalProfile.evidenceStatus,
    empiricalBlockers: Object.freeze([...empiricalProfile.blockers]),
    totalVariationDistance: l1ShareDistance / 2,
    l1ShareDistance,
    packageComparison,
  });
}
