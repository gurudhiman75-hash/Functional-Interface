import type {
  QuantV4PyqExamId,
  QuantV4PyqObservation,
} from "./quant-v4-pyq-frequency-evidence-p2";
import {
  buildQuantV4WholeSectionFrequencyProfile,
  type QuantV4CompleteSectionSpec,
  type QuantV4WholeSectionFrequencyPolicy,
  type QuantV4WholeSectionFrequencyProfile,
} from "./quant-v4-whole-section-frequency-calibration-p2";

export const QUANT_V4_WHOLE_SECTION_FREQUENCY_STABILITY_AUTHORITY =
  "QUANT-V4-WHOLE-SECTION-FREQUENCY-STABILITY-P2" as const;

export type QuantV4WholeSectionStabilityStatus =
  | "STABILITY_UNASSESSED"
  | "STABILITY_HOLD"
  | "STABILITY_CANDIDATE";

export interface QuantV4WholeSectionStabilityPolicy {
  readonly minCompleteSections: number;
  readonly minBalancedYearCount: number;
  readonly minSectionsPerBalancedYear: number;
  readonly maxSingleYearSectionShare: number;
  readonly maxSingleDateSectionShare: number;
  readonly maxLeaveOneOutShareDeltaPoints: number;
  readonly maxConcentratedDateRemovalShareDeltaPoints: number;
  readonly maxPackagesLostOnConcentratedDateRemoval: number;
  readonly productionPromotionAuthorized: boolean;
}

export interface QuantV4StabilityPackageFrequency {
  readonly packageId: string;
  readonly questionCount: number;
  readonly questionShare: number;
  readonly rank: number;
}

export interface QuantV4StabilityYearProfile {
  readonly year: string;
  readonly sectionCount: number;
  readonly sectionShare: number;
  readonly questionCount: number;
  readonly packageCoverageCount: number;
  readonly packageFrequencies: readonly QuantV4StabilityPackageFrequency[];
}

export interface QuantV4LeaveOneSectionOutSnapshot {
  readonly sectionId: string;
  readonly paperId: string;
  readonly heldDate: string;
  readonly shift: string;
  readonly remainingSectionCount: number;
  readonly remainingQuestionCount: number;
  readonly remainingPackageCoverageCount: number;
  readonly maxAbsoluteShareDeltaPoints: number;
  readonly maxAbsoluteShareDeltaPackageId: string;
  readonly maxAbsoluteRankMovement: number;
}

export interface QuantV4ConcentratedDateSensitivity {
  readonly heldDate: string;
  readonly removedSectionCount: number;
  readonly removedSectionShare: number;
  readonly removedQuestionCount: number;
  readonly remainingSectionCount: number;
  readonly remainingQuestionCount: number;
  readonly remainingPackageCoverageCount: number;
  readonly packagesLostFromSupport: readonly string[];
  readonly maxAbsoluteShareDeltaPoints: number;
  readonly maxAbsoluteShareDeltaPackageId: string;
}

export interface QuantV4WholeSectionStabilityProfile {
  readonly authority: typeof QUANT_V4_WHOLE_SECTION_FREQUENCY_STABILITY_AUTHORITY;
  readonly examId: QuantV4PyqExamId;
  readonly status: QuantV4WholeSectionStabilityStatus;
  readonly blockers: readonly string[];
  readonly wholeSectionProfile: QuantV4WholeSectionFrequencyProfile;
  readonly completeSectionCount: number;
  readonly completeQuestionCount: number;
  readonly distinctYearCount: number;
  readonly balancedYearCount: number;
  readonly maxSingleYearSectionShare: number;
  readonly maxSingleYear: string | null;
  readonly maxSingleDateSectionShare: number;
  readonly maxSingleDate: string | null;
  readonly top3QuestionCount: number;
  readonly top3QuestionShare: number;
  readonly top5QuestionCount: number;
  readonly top5QuestionShare: number;
  readonly top10QuestionCount: number;
  readonly top10QuestionShare: number;
  readonly yearProfiles: readonly QuantV4StabilityYearProfile[];
  readonly leaveOneSectionOut: readonly QuantV4LeaveOneSectionOutSnapshot[];
  readonly maxLeaveOneOutShareDeltaPoints: number;
  readonly maxLeaveOneOutRankMovement: number;
  readonly concentratedDateSensitivity: QuantV4ConcentratedDateSensitivity | null;
  readonly productionPromotionAuthorized: boolean;
}

export const QUANT_V4_CGL_TIER_I_STABILITY_P2_AUDIT_POLICY: QuantV4WholeSectionStabilityPolicy = Object.freeze({
  minCompleteSections: 8,
  minBalancedYearCount: 3,
  minSectionsPerBalancedYear: 2,
  maxSingleYearSectionShare: 0.60,
  maxSingleDateSectionShare: 0.25,
  maxLeaveOneOutShareDeltaPoints: 2.0,
  maxConcentratedDateRemovalShareDeltaPoints: 2.0,
  maxPackagesLostOnConcentratedDateRemoval: 2,
  productionPromotionAuthorized: false,
});

function clean(value: unknown): string {
  return String(value ?? "").trim();
}

function validateRatio(name: string, value: number): void {
  if (!Number.isFinite(value) || value < 0 || value > 1) {
    throw new Error(`${name} must be a finite ratio in [0,1].`);
  }
}

function validatePolicy(policy: QuantV4WholeSectionStabilityPolicy): void {
  for (const [name, value] of [
    ["minCompleteSections", policy.minCompleteSections],
    ["minBalancedYearCount", policy.minBalancedYearCount],
    ["minSectionsPerBalancedYear", policy.minSectionsPerBalancedYear],
    ["maxPackagesLostOnConcentratedDateRemoval", policy.maxPackagesLostOnConcentratedDateRemoval],
  ] as const) {
    if (!Number.isInteger(value) || value < 0) {
      throw new Error(`${name} must be a non-negative integer.`);
    }
  }
  validateRatio("maxSingleYearSectionShare", policy.maxSingleYearSectionShare);
  validateRatio("maxSingleDateSectionShare", policy.maxSingleDateSectionShare);
  for (const [name, value] of [
    ["maxLeaveOneOutShareDeltaPoints", policy.maxLeaveOneOutShareDeltaPoints],
    ["maxConcentratedDateRemovalShareDeltaPoints", policy.maxConcentratedDateRemovalShareDeltaPoints],
  ] as const) {
    if (!Number.isFinite(value) || value < 0) {
      throw new Error(`${name} must be a non-negative finite number.`);
    }
  }
}

function countPackages(observations: readonly QuantV4PyqObservation[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const observation of observations) {
    const packageId = clean(observation.packageId) || "UNMAPPED_PACKAGE";
    counts.set(packageId, (counts.get(packageId) ?? 0) + 1);
  }
  return counts;
}

function rankedPackageFrequencies(
  observations: readonly QuantV4PyqObservation[],
): readonly QuantV4StabilityPackageFrequency[] {
  const counts = countPackages(observations);
  const questionCount = observations.length;
  const ordered = [...counts.entries()].sort(
    ([leftId, leftCount], [rightId, rightCount]) => rightCount - leftCount || leftId.localeCompare(rightId),
  );
  let priorCount: number | undefined;
  let priorRank = 0;
  return Object.freeze(ordered.map(([packageId, count], index) => {
    if (count !== priorCount) {
      priorRank = index + 1;
      priorCount = count;
    }
    return Object.freeze({
      packageId,
      questionCount: count,
      questionShare: questionCount ? count / questionCount : 0,
      rank: priorRank,
    });
  }));
}

function shareMap(observations: readonly QuantV4PyqObservation[]): Map<string, number> {
  const counts = countPackages(observations);
  const total = observations.length;
  return new Map([...counts.entries()].map(([packageId, count]) => [packageId, total ? count / total : 0]));
}

function rankMap(observations: readonly QuantV4PyqObservation[]): Map<string, number> {
  return new Map(rankedPackageFrequencies(observations).map((entry) => [entry.packageId, entry.rank]));
}

function maxAbsoluteShareDelta(input: {
  readonly baseline: readonly QuantV4PyqObservation[];
  readonly comparison: readonly QuantV4PyqObservation[];
}): { readonly packageId: string; readonly deltaPoints: number } {
  const baselineShares = shareMap(input.baseline);
  const comparisonShares = shareMap(input.comparison);
  const packageIds = [...new Set([...baselineShares.keys(), ...comparisonShares.keys()])].sort();
  let bestPackageId = "";
  let bestDelta = -1;
  for (const packageId of packageIds) {
    const delta = Math.abs((comparisonShares.get(packageId) ?? 0) - (baselineShares.get(packageId) ?? 0)) * 100;
    if (delta > bestDelta + 1e-12 || (Math.abs(delta - bestDelta) <= 1e-12 && packageId < bestPackageId)) {
      bestPackageId = packageId;
      bestDelta = delta;
    }
  }
  return Object.freeze({ packageId: bestPackageId, deltaPoints: Math.max(0, bestDelta) });
}

function maxAbsoluteRankMovement(input: {
  readonly baseline: readonly QuantV4PyqObservation[];
  readonly comparison: readonly QuantV4PyqObservation[];
}): number {
  const baselineRanks = rankMap(input.baseline);
  const comparisonRanks = rankMap(input.comparison);
  const missingRank = comparisonRanks.size + 1;
  let maxMovement = 0;
  for (const [packageId, baselineRank] of baselineRanks) {
    maxMovement = Math.max(maxMovement, Math.abs((comparisonRanks.get(packageId) ?? missingRank) - baselineRank));
  }
  return maxMovement;
}

function concentration(
  frequencies: readonly QuantV4StabilityPackageFrequency[],
  n: number,
): { readonly questionCount: number; readonly questionShare: number } {
  const questionCount = frequencies.slice(0, n).reduce((sum, entry) => sum + entry.questionCount, 0);
  const total = frequencies.reduce((sum, entry) => sum + entry.questionCount, 0);
  return Object.freeze({ questionCount, questionShare: total ? questionCount / total : 0 });
}

export function buildQuantV4WholeSectionFrequencyStabilityProfile(input: {
  readonly examId: QuantV4PyqExamId;
  readonly observations: readonly QuantV4PyqObservation[];
  readonly sections: readonly QuantV4CompleteSectionSpec[];
  readonly wholeSectionPolicy: QuantV4WholeSectionFrequencyPolicy;
  readonly stabilityPolicy: QuantV4WholeSectionStabilityPolicy;
}): QuantV4WholeSectionStabilityProfile {
  validatePolicy(input.stabilityPolicy);
  const wholeSectionProfile = buildQuantV4WholeSectionFrequencyProfile({
    examId: input.examId,
    observations: input.observations,
    sections: input.sections,
    policy: input.wholeSectionPolicy,
  });
  const completePaperIds = new Set(
    wholeSectionProfile.sectionSnapshots.filter((snapshot) => snapshot.complete).map((snapshot) => snapshot.paperId),
  );
  const completeSpecs = input.sections.filter(
    (section) => section.examId === input.examId && completePaperIds.has(section.paperId),
  );
  const completeObservations = wholeSectionProfile.completeSectionObservations;
  const blockers: string[] = [];

  if (completeSpecs.length < input.stabilityPolicy.minCompleteSections) {
    blockers.push("COMPLETE_SECTION_SAMPLE_BELOW_STABILITY_POLICY");
  }

  if (!completeSpecs.length || !completeObservations.length) {
    return Object.freeze({
      authority: QUANT_V4_WHOLE_SECTION_FREQUENCY_STABILITY_AUTHORITY,
      examId: input.examId,
      status: "STABILITY_UNASSESSED",
      blockers: Object.freeze([...new Set(["NO_COMPLETE_SECTION_EVIDENCE", ...blockers])]),
      wholeSectionProfile,
      completeSectionCount: completeSpecs.length,
      completeQuestionCount: completeObservations.length,
      distinctYearCount: 0,
      balancedYearCount: 0,
      maxSingleYearSectionShare: 0,
      maxSingleYear: null,
      maxSingleDateSectionShare: 0,
      maxSingleDate: null,
      top3QuestionCount: 0,
      top3QuestionShare: 0,
      top5QuestionCount: 0,
      top5QuestionShare: 0,
      top10QuestionCount: 0,
      top10QuestionShare: 0,
      yearProfiles: Object.freeze([]),
      leaveOneSectionOut: Object.freeze([]),
      maxLeaveOneOutShareDeltaPoints: 0,
      maxLeaveOneOutRankMovement: 0,
      concentratedDateSensitivity: null,
      productionPromotionAuthorized: input.stabilityPolicy.productionPromotionAuthorized,
    });
  }

  const yearToSpecs = new Map<string, QuantV4CompleteSectionSpec[]>();
  const dateToSpecs = new Map<string, QuantV4CompleteSectionSpec[]>();
  for (const spec of completeSpecs) {
    const year = spec.heldDate.slice(0, 4);
    yearToSpecs.set(year, [...(yearToSpecs.get(year) ?? []), spec]);
    dateToSpecs.set(spec.heldDate, [...(dateToSpecs.get(spec.heldDate) ?? []), spec]);
  }

  const balancedYearCount = [...yearToSpecs.values()].filter(
    (specs) => specs.length >= input.stabilityPolicy.minSectionsPerBalancedYear,
  ).length;
  if (balancedYearCount < input.stabilityPolicy.minBalancedYearCount) {
    blockers.push("BALANCED_YEAR_SAMPLE_BELOW_POLICY");
  }

  const yearEntries = [...yearToSpecs.entries()].sort(([left], [right]) => left.localeCompare(right));
  const maxYearEntry = [...yearEntries].sort(
    ([leftYear, leftSpecs], [rightYear, rightSpecs]) => rightSpecs.length - leftSpecs.length || leftYear.localeCompare(rightYear),
  )[0];
  const maxSingleYearSectionShare = maxYearEntry ? maxYearEntry[1].length / completeSpecs.length : 0;
  if (maxSingleYearSectionShare > input.stabilityPolicy.maxSingleYearSectionShare + 1e-12) {
    blockers.push("SINGLE_YEAR_SECTION_CONCENTRATION_HIGH");
  }

  const dateEntries = [...dateToSpecs.entries()].sort(([left], [right]) => left.localeCompare(right));
  const maxDateEntry = [...dateEntries].sort(
    ([leftDate, leftSpecs], [rightDate, rightSpecs]) => rightSpecs.length - leftSpecs.length || leftDate.localeCompare(rightDate),
  )[0];
  const maxSingleDateSectionShare = maxDateEntry ? maxDateEntry[1].length / completeSpecs.length : 0;
  if (maxSingleDateSectionShare > input.stabilityPolicy.maxSingleDateSectionShare + 1e-12) {
    blockers.push("SINGLE_DATE_SECTION_CONCENTRATION_HIGH");
  }

  const frequencies = rankedPackageFrequencies(completeObservations);
  const top3 = concentration(frequencies, 3);
  const top5 = concentration(frequencies, 5);
  const top10 = concentration(frequencies, 10);

  const yearProfiles = Object.freeze(yearEntries.map(([year, specs]) => {
    const paperIds = new Set(specs.map((spec) => spec.paperId));
    const observations = completeObservations.filter((observation) => paperIds.has(clean(observation.paperId)));
    return Object.freeze({
      year,
      sectionCount: specs.length,
      sectionShare: specs.length / completeSpecs.length,
      questionCount: observations.length,
      packageCoverageCount: countPackages(observations).size,
      packageFrequencies: rankedPackageFrequencies(observations),
    });
  }));

  const leaveOneSectionOut = Object.freeze(completeSpecs.map((spec) => {
    const comparison = completeObservations.filter((observation) => clean(observation.paperId) !== spec.paperId);
    const shareDelta = maxAbsoluteShareDelta({ baseline: completeObservations, comparison });
    return Object.freeze({
      sectionId: spec.sectionId,
      paperId: spec.paperId,
      heldDate: spec.heldDate,
      shift: spec.shift,
      remainingSectionCount: completeSpecs.length - 1,
      remainingQuestionCount: comparison.length,
      remainingPackageCoverageCount: countPackages(comparison).size,
      maxAbsoluteShareDeltaPoints: shareDelta.deltaPoints,
      maxAbsoluteShareDeltaPackageId: shareDelta.packageId,
      maxAbsoluteRankMovement: maxAbsoluteRankMovement({ baseline: completeObservations, comparison }),
    });
  }));
  const maxLeaveOneOutShareDeltaPoints = Math.max(...leaveOneSectionOut.map((snapshot) => snapshot.maxAbsoluteShareDeltaPoints));
  const maxLeaveOneOutRankMovement = Math.max(...leaveOneSectionOut.map((snapshot) => snapshot.maxAbsoluteRankMovement));
  if (maxLeaveOneOutShareDeltaPoints > input.stabilityPolicy.maxLeaveOneOutShareDeltaPoints + 1e-12) {
    blockers.push("LEAVE_ONE_SECTION_OUT_SHARE_DRIFT_HIGH");
  }

  let concentratedDateSensitivity: QuantV4ConcentratedDateSensitivity | null = null;
  if (maxDateEntry) {
    const [heldDate, specs] = maxDateEntry;
    const removedPaperIds = new Set(specs.map((spec) => spec.paperId));
    const comparison = completeObservations.filter((observation) => !removedPaperIds.has(clean(observation.paperId)));
    const baselinePackages = new Set(countPackages(completeObservations).keys());
    const comparisonPackages = new Set(countPackages(comparison).keys());
    const packagesLostFromSupport = [...baselinePackages].filter((packageId) => !comparisonPackages.has(packageId)).sort();
    const shareDelta = maxAbsoluteShareDelta({ baseline: completeObservations, comparison });
    concentratedDateSensitivity = Object.freeze({
      heldDate,
      removedSectionCount: specs.length,
      removedSectionShare: specs.length / completeSpecs.length,
      removedQuestionCount: completeObservations.length - comparison.length,
      remainingSectionCount: completeSpecs.length - specs.length,
      remainingQuestionCount: comparison.length,
      remainingPackageCoverageCount: comparisonPackages.size,
      packagesLostFromSupport: Object.freeze(packagesLostFromSupport),
      maxAbsoluteShareDeltaPoints: shareDelta.deltaPoints,
      maxAbsoluteShareDeltaPackageId: shareDelta.packageId,
    });
    if (shareDelta.deltaPoints > input.stabilityPolicy.maxConcentratedDateRemovalShareDeltaPoints + 1e-12) {
      blockers.push("CONCENTRATED_DATE_REMOVAL_SHARE_DRIFT_HIGH");
    }
    if (packagesLostFromSupport.length > input.stabilityPolicy.maxPackagesLostOnConcentratedDateRemoval) {
      blockers.push("CONCENTRATED_DATE_SUPPORT_LOSS_HIGH");
    }
  }

  const status: QuantV4WholeSectionStabilityStatus = blockers.length
    ? "STABILITY_HOLD"
    : "STABILITY_CANDIDATE";

  return Object.freeze({
    authority: QUANT_V4_WHOLE_SECTION_FREQUENCY_STABILITY_AUTHORITY,
    examId: input.examId,
    status,
    blockers: Object.freeze([...new Set(blockers)]),
    wholeSectionProfile,
    completeSectionCount: completeSpecs.length,
    completeQuestionCount: completeObservations.length,
    distinctYearCount: yearToSpecs.size,
    balancedYearCount,
    maxSingleYearSectionShare,
    maxSingleYear: maxYearEntry?.[0] ?? null,
    maxSingleDateSectionShare,
    maxSingleDate: maxDateEntry?.[0] ?? null,
    top3QuestionCount: top3.questionCount,
    top3QuestionShare: top3.questionShare,
    top5QuestionCount: top5.questionCount,
    top5QuestionShare: top5.questionShare,
    top10QuestionCount: top10.questionCount,
    top10QuestionShare: top10.questionShare,
    yearProfiles,
    leaveOneSectionOut,
    maxLeaveOneOutShareDeltaPoints,
    maxLeaveOneOutRankMovement,
    concentratedDateSensitivity,
    productionPromotionAuthorized: input.stabilityPolicy.productionPromotionAuthorized,
  });
}

export function canPromoteQuantV4WholeSectionFrequencyFromStability(
  profile: QuantV4WholeSectionStabilityProfile,
): boolean {
  return profile.status === "STABILITY_CANDIDATE" && profile.productionPromotionAuthorized;
}
