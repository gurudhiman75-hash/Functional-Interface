import type { Sea001DistributionRealnessAudit } from "./distribution-audit.ts";
import type { Sea001MultilingualTemplateAudit } from "./multilingual-template-audit.ts";
import type { Sea001StructuralCloneAudit } from "../saturation/structural-clone-audit.ts";

/**
 * Engineering anti-artifact thresholds, not historical exam-frequency weights.
 *
 * These were set after observing the deterministic 1,600-caselet measurement on
 * 2026-08-19. They deliberately preserve headroom around healthy distribution
 * metrics while refusing to waive the visibly thin per-blueprint structural pools.
 */
export const SEA001_MACHINE_REALNESS_THRESHOLDS = Object.freeze({
  measurementCaselets: 1600,
  measurementChildren: 6400,
  overallAuthorityUniqueShareMin: 0.55,
  structuralQueryUniqueShareMin: 0.64,
  lexicalTemplateUniqueShareMin: 0.35,
  authorityLargestClusterMax: 20,
  lexicalLargestClusterMax: 32,
  perBlueprintUniqueShareMin: 0.20,
  perBlueprintLargestClusterMax: 10,
  answerPositionLargestShareMax: 0.27,
  answerPositionMaxToMinRatioMax: 1.10,
  childIndexAnswerPositionMaxToMinRatioMax: 1.20,
  seatCountCellLargestShareMax: 0.13,
  participantExtractionFailuresMax: 0,
  multilingual: Object.freeze({
    setupLargestClusterShareMax: 0.15,
    questionLargestClusterShareMax: 0.20,
    clueLargestClusterShareMax: 0.25,
    explanationStepLargestClusterShareMax: 0.10,
    explanationOpeningLargestClusterShareMax: 0.15,
    optionRationaleLargestClusterShareMax: 0.06,
    exactRepeatedFullQuestionCountMax: 4,
    latinResidueCountMax: 0,
    qlCoverageRequired: 20,
  }),
  policy: "ENGINEERING_ANTI_ARTIFACT_NOT_EXAM_WEIGHTING" as const,
  pinnedAt: "2026-08-19" as const,
});

export type Sea001MachineRealnessBlocker =
  | `STRUCTURAL_UNIQUE_SHARE:${string}`
  | `STRUCTURAL_CLUSTER:${string}`
  | "OVERALL_AUTHORITY_UNIQUE_SHARE"
  | "STRUCTURAL_QUERY_UNIQUE_SHARE"
  | "LEXICAL_TEMPLATE_UNIQUE_SHARE"
  | "AUTHORITY_CLUSTER_SIZE"
  | "LEXICAL_CLUSTER_SIZE"
  | "ANSWER_POSITION_CONCENTRATION"
  | "ANSWER_POSITION_IMBALANCE"
  | "CHILD_INDEX_ANSWER_POSITION_IMBALANCE"
  | "SEAT_COUNT_CELL_CONCENTRATION"
  | "PARTICIPANT_EXTRACTION_FAILURE"
  | `MULTILINGUAL_TEMPLATE_CONCENTRATION:${"Hindi" | "Punjabi"}:${string}`
  | `MULTILINGUAL_EXACT_REPEAT:${"Hindi" | "Punjabi"}`
  | `MULTILINGUAL_LATIN_RESIDUE:${"Hindi" | "Punjabi"}`
  | `MULTILINGUAL_QL_COVERAGE:${"Hindi" | "Punjabi"}`;

export interface Sea001MachineRealnessAssessment {
  readonly status: "GREEN" | "BLOCKED";
  readonly blockers: readonly Sea001MachineRealnessBlocker[];
  readonly structural: {
    readonly overallAuthorityUniqueShare: number;
    readonly structuralQueryUniqueShare: number;
    readonly lexicalTemplateUniqueShare: number;
    readonly blueprintUniqueShares: Readonly<Record<string, number>>;
  };
  readonly policy: typeof SEA001_MACHINE_REALNESS_THRESHOLDS.policy;
}

function share(numerator: number, denominator: number): number {
  return denominator ? Number((numerator / denominator).toFixed(4)) : 0;
}

export function assessSea001MachineRealness(input: {
  readonly distribution: Sea001DistributionRealnessAudit;
  readonly structural: Sea001StructuralCloneAudit;
  readonly multilingual: Sea001MultilingualTemplateAudit;
}): Sea001MachineRealnessAssessment {
  const { distribution, structural, multilingual } = input;
  const thresholds = SEA001_MACHINE_REALNESS_THRESHOLDS;
  const blockers: Sea001MachineRealnessBlocker[] = [];

  const overallAuthorityUniqueShare = share(structural.authorityStructure.uniqueCount, structural.caseletCount);
  const structuralQueryUniqueShare = share(structural.structuralQueryCombination.uniqueCount, structural.caseletCount);
  const lexicalTemplateUniqueShare = share(structural.lexicalTemplate.uniqueCount, structural.caseletCount);

  if (overallAuthorityUniqueShare < thresholds.overallAuthorityUniqueShareMin) blockers.push("OVERALL_AUTHORITY_UNIQUE_SHARE");
  if (structuralQueryUniqueShare < thresholds.structuralQueryUniqueShareMin) blockers.push("STRUCTURAL_QUERY_UNIQUE_SHARE");
  if (lexicalTemplateUniqueShare < thresholds.lexicalTemplateUniqueShareMin) blockers.push("LEXICAL_TEMPLATE_UNIQUE_SHARE");
  if (structural.authorityStructure.largestCluster > thresholds.authorityLargestClusterMax) blockers.push("AUTHORITY_CLUSTER_SIZE");
  if (structural.lexicalTemplate.largestCluster > thresholds.lexicalLargestClusterMax) blockers.push("LEXICAL_CLUSTER_SIZE");
  if (structural.participantExtractionFailureCount > thresholds.participantExtractionFailuresMax) blockers.push("PARTICIPANT_EXTRACTION_FAILURE");

  const blueprintUniqueShares: Record<string, number> = {};
  for (const [blueprintId, stats] of Object.entries(structural.authorityStructureByBlueprint)) {
    const observed = stats.uniqueCount + stats.cloneCaseletCount;
    const uniqueShare = share(stats.uniqueCount, observed);
    blueprintUniqueShares[blueprintId] = uniqueShare;
    if (uniqueShare < thresholds.perBlueprintUniqueShareMin) {
      blockers.push(`STRUCTURAL_UNIQUE_SHARE:${blueprintId}`);
    }
    if (stats.largestCluster > thresholds.perBlueprintLargestClusterMax) {
      blockers.push(`STRUCTURAL_CLUSTER:${blueprintId}`);
    }
  }

  if (distribution.answerPositions.largestCategoryShare > thresholds.answerPositionLargestShareMax) {
    blockers.push("ANSWER_POSITION_CONCENTRATION");
  }
  if (distribution.answerPositions.maxToMinRatio > thresholds.answerPositionMaxToMinRatioMax) {
    blockers.push("ANSWER_POSITION_IMBALANCE");
  }
  if (distribution.answerPositionByChildIndex.maxToMinRatio > thresholds.childIndexAnswerPositionMaxToMinRatioMax) {
    blockers.push("CHILD_INDEX_ANSWER_POSITION_IMBALANCE");
  }
  if (distribution.seatCountCells.largestCategoryShare > thresholds.seatCountCellLargestShareMax) {
    blockers.push("SEAT_COUNT_CELL_CONCENTRATION");
  }

  for (const [localeName, locale] of [["Hindi", multilingual.Hindi], ["Punjabi", multilingual.Punjabi]] as const) {
    const concentrationChecks = [
      ["setup", locale.setupTemplates.largestClusterShare, thresholds.multilingual.setupLargestClusterShareMax],
      ["question", locale.questionTemplates.largestClusterShare, thresholds.multilingual.questionLargestClusterShareMax],
      ["clue", locale.clueTemplates.largestClusterShare, thresholds.multilingual.clueLargestClusterShareMax],
      ["explanation-step", locale.explanationStepTemplates.largestClusterShare, thresholds.multilingual.explanationStepLargestClusterShareMax],
      ["explanation-opening", locale.explanationOpeningFrames.largestClusterShare, thresholds.multilingual.explanationOpeningLargestClusterShareMax],
      ["option-rationale", locale.optionRationaleTemplates.largestClusterShare, thresholds.multilingual.optionRationaleLargestClusterShareMax],
    ] as const;
    for (const [surface, observed, maximum] of concentrationChecks) {
      if (observed > maximum) blockers.push(`MULTILINGUAL_TEMPLATE_CONCENTRATION:${localeName}:${surface}`);
    }
    if (locale.exactRepeatedFullQuestionCount > thresholds.multilingual.exactRepeatedFullQuestionCountMax) {
      blockers.push(`MULTILINGUAL_EXACT_REPEAT:${localeName}`);
    }
    if (locale.latinResidueCount > thresholds.multilingual.latinResidueCountMax) {
      blockers.push(`MULTILINGUAL_LATIN_RESIDUE:${localeName}`);
    }
    if (locale.qlCoverage !== thresholds.multilingual.qlCoverageRequired) {
      blockers.push(`MULTILINGUAL_QL_COVERAGE:${localeName}`);
    }
  }

  return {
    status: blockers.length === 0 ? "GREEN" : "BLOCKED",
    blockers,
    structural: {
      overallAuthorityUniqueShare,
      structuralQueryUniqueShare,
      lexicalTemplateUniqueShare,
      blueprintUniqueShares,
    },
    policy: thresholds.policy,
  };
}
