import { auditSea001Corpus, type Sea001ResidualAudit } from "../saturation/residual-audit.ts";
import type { AuditCaselet } from "../saturation/corpus.ts";

export interface Sea001DistributionConcentration {
  readonly categoryCount: number;
  readonly total: number;
  readonly largestCategoryCount: number;
  readonly largestCategoryShare: number;
  readonly smallestNonZeroCategoryCount: number;
  readonly maxToMinRatio: number;
}

export interface Sea001DistributionRealnessAudit {
  readonly caseletCount: number;
  readonly childQuestionCount: number;
  readonly queryContracts: Sea001DistributionConcentration;
  readonly answerPositions: Sea001DistributionConcentration;
  readonly answerPositionByChildIndex: Sea001DistributionConcentration;
  readonly seatCountCells: Sea001DistributionConcentration;
  readonly checkpointDistribution: Readonly<Record<string, number>>;
  readonly queryContractDistribution: Readonly<Record<string, number>>;
  readonly answerPositionDistribution: Readonly<Record<string, number>>;
  readonly answerPositionByChildIndexDistribution: Readonly<Record<string, number>>;
  readonly seatCountDistribution: Readonly<Record<string, number>>;
  readonly answerPositionByChildIndexMatrix: Readonly<Record<string, Readonly<Record<string, number>>>>;
  readonly childIndexAnswerPositionSpread: Readonly<Record<string, number>>;
  readonly queryContractsByCheckpoint: Readonly<Record<string, Readonly<Record<string, number>>>>;
  readonly measurementPolicy: "OBSERVE_FIRST_SET_LANE_TARGETS_AFTER_EVIDENCE";
  readonly thresholdStatus: "UNSET_PENDING_MEASUREMENT_AND_EXAM_PROFILES";
}

function concentration(distribution: Readonly<Record<string, number>>): Sea001DistributionConcentration {
  const counts = Object.values(distribution).filter((value) => value > 0);
  const total = counts.reduce((sum, value) => sum + value, 0);
  const largest = counts.length ? Math.max(...counts) : 0;
  const smallest = counts.length ? Math.min(...counts) : 0;
  return {
    categoryCount: counts.length,
    total,
    largestCategoryCount: largest,
    largestCategoryShare: total ? Number((largest / total).toFixed(4)) : 0,
    smallestNonZeroCategoryCount: smallest,
    maxToMinRatio: smallest ? Number((largest / smallest).toFixed(3)) : 0,
  };
}

function matrixFromChildIndexDistribution(
  distribution: Readonly<Record<string, number>>,
): Readonly<Record<string, Readonly<Record<string, number>>>> {
  const matrix: Record<string, Record<string, number>> = {};
  for (const [key, count] of Object.entries(distribution)) {
    const [childIndex = "?", answerPosition = "?"] = key.split(":");
    matrix[childIndex] ??= {};
    matrix[childIndex]![answerPosition] = count;
  }
  return matrix;
}

function spreadByChildIndex(
  matrix: Readonly<Record<string, Readonly<Record<string, number>>>,
): Readonly<Record<string, number>> {
  return Object.fromEntries(Object.entries(matrix).map(([childIndex, positions]) => {
    const counts = [0, 1, 2, 3].map((position) => positions[String(position)] ?? 0);
    return [childIndex, Math.max(...counts) - Math.min(...counts)];
  }));
}

function queryContractsByCheckpoint(caselets: readonly AuditCaselet[]) {
  const output: Record<string, Record<string, number>> = {};
  for (const caselet of caselets) {
    output[caselet.checkpointId] ??= {};
    for (const child of caselet.children) {
      const distribution = output[caselet.checkpointId]!;
      distribution[child.queryContractId] = (distribution[child.queryContractId] ?? 0) + 1;
    }
  }
  return output;
}

export function auditSea001DistributionRealness(
  caselets: readonly AuditCaselet[],
  residual: Sea001ResidualAudit = auditSea001Corpus(caselets),
): Sea001DistributionRealnessAudit {
  const matrix = matrixFromChildIndexDistribution(residual.answerPositionByChildIndexDistribution);
  return {
    caseletCount: residual.caseletCount,
    childQuestionCount: residual.childQuestionCount,
    queryContracts: concentration(residual.queryContractDistribution),
    answerPositions: concentration(residual.answerPositionDistribution),
    answerPositionByChildIndex: concentration(residual.answerPositionByChildIndexDistribution),
    seatCountCells: concentration(residual.seatCountDistribution),
    checkpointDistribution: residual.checkpointDistribution,
    queryContractDistribution: residual.queryContractDistribution,
    answerPositionDistribution: residual.answerPositionDistribution,
    answerPositionByChildIndexDistribution: residual.answerPositionByChildIndexDistribution,
    seatCountDistribution: residual.seatCountDistribution,
    answerPositionByChildIndexMatrix: matrix,
    childIndexAnswerPositionSpread: spreadByChildIndex(matrix),
    queryContractsByCheckpoint: queryContractsByCheckpoint(caselets),
    measurementPolicy: "OBSERVE_FIRST_SET_LANE_TARGETS_AFTER_EVIDENCE",
    thresholdStatus: "UNSET_PENDING_MEASUREMENT_AND_EXAM_PROFILES",
  };
}
