import { seatCountOf, type AuditCaselet, type Sea001CheckpointId } from "../saturation/corpus.ts";

export type Sea001CheckpointDifficultyPrior = "Easy" | "Medium" | "Hard";

export interface Sea001DifficultyFeatureVector {
  readonly checkpointId: Sea001CheckpointId;
  readonly blueprintAuthorityId: string;
  readonly checkpointPrior: Sea001CheckpointDifficultyPrior;
  readonly seatCount: number;
  readonly clueCount: number;
  readonly negativeClueCount: number;
  readonly relativeDirectionClueCount: number;
  readonly absoluteAnchorClueCount: number;
  readonly facingFactClueCount: number;
  readonly conditionalClueCount: number;
  readonly mixedFacing: boolean;
  readonly proofEventCount: number;
  readonly childQuestionCount: number;
  readonly distinctQueryContractCount: number;
  readonly statementQueryCount: number;
  readonly hypotheticalSurfaceCount: number;
  readonly calibratedDifficultyBand: null;
  readonly calibrationStatus: "FEATURE_VECTOR_ONLY_NO_EMPIRICAL_CALIBRATION";
}

const CHECKPOINT_PRIOR: Readonly<Record<Sea001CheckpointId, Sea001CheckpointDifficultyPrior>> = Object.freeze({
  "SEA-CP-001": "Easy",
  "SEA-CP-002": "Medium",
  "SEA-CP-003": "Medium",
  "SEA-CP-004": "Medium",
  "SEA-CP-005": "Hard",
});

function countMatchingClues(caselet: AuditCaselet, kind: RegExp, text: RegExp): number {
  if (caselet.constraints?.length) {
    return caselet.constraints.filter((constraint) => kind.test(constraint.kind)).length;
  }
  return caselet.clueTexts.filter((clue) => text.test(clue)).length;
}

export function sea001DifficultyFeatures(caselet: AuditCaselet): Sea001DifficultyFeatureVector {
  const childText = caselet.children.map((child) => child.text).join("\n");
  return {
    checkpointId: caselet.checkpointId,
    blueprintAuthorityId: caselet.blueprintAuthorityId,
    checkpointPrior: CHECKPOINT_PRIOR[caselet.checkpointId],
    seatCount: seatCountOf(caselet),
    clueCount: caselet.clueTexts.length,
    negativeClueCount: countMatchingClues(caselet, /^NOT_/u, /\b(?:not|no one|does not|doesn't|neither)\b/iu),
    relativeDirectionClueCount: countMatchingClues(caselet, /RELATIVE|CLOCKWISE|ANTICLOCKWISE/u, /\b(?:left|right|clockwise|anticlockwise)\b/iu),
    absoluteAnchorClueCount: countMatchingClues(caselet, /ABSOLUTE|AT_END|AT_MIDDLE|LANDMARK/u, /\b(?:extreme|end|middle|entrance|stage|door)\b/iu),
    facingFactClueCount: countMatchingClues(caselet, /FACING/u, /\bfaces?\b/iu),
    conditionalClueCount: caselet.clueTexts.filter((clue) => /\b(?:if|otherwise|provided|unless)\b/iu.test(clue)).length,
    mixedFacing: caselet.checkpointId === "SEA-CP-002" || caselet.checkpointId === "SEA-CP-005",
    proofEventCount: caselet.proofTrace?.length ?? 0,
    childQuestionCount: caselet.children.length,
    distinctQueryContractCount: new Set(caselet.children.map((child) => child.queryContractId)).size,
    statementQueryCount: caselet.children.filter((child) => child.queryContractId === "SEA-QC-016" || child.queryContractId === "SEA-QC-017").length,
    hypotheticalSurfaceCount: caselet.children.filter((child) => /\b(?:if|after|exchange|swap|were to)\b/iu.test(child.text)).length,
    calibratedDifficultyBand: null,
    calibrationStatus: "FEATURE_VECTOR_ONLY_NO_EMPIRICAL_CALIBRATION",
  };
}

interface NumericSummary {
  readonly min: number;
  readonly max: number;
  readonly mean: number;
}

function numericSummary(values: readonly number[]): NumericSummary {
  if (!values.length) return { min: 0, max: 0, mean: 0 };
  return {
    min: Math.min(...values),
    max: Math.max(...values),
    mean: Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(3)),
  };
}

export function summarizeSea001DifficultyFeatures(caselets: readonly AuditCaselet[]) {
  const vectors = caselets.map(sea001DifficultyFeatures);
  const checkpointSummary = Object.fromEntries(
    (["SEA-CP-001", "SEA-CP-002", "SEA-CP-003", "SEA-CP-004", "SEA-CP-005"] as const).map((checkpointId) => {
      const subset = vectors.filter((vector) => vector.checkpointId === checkpointId);
      return [checkpointId, {
        caseletCount: subset.length,
        seatCount: numericSummary(subset.map((vector) => vector.seatCount)),
        clueCount: numericSummary(subset.map((vector) => vector.clueCount)),
        negativeClueCount: numericSummary(subset.map((vector) => vector.negativeClueCount)),
        proofEventCount: numericSummary(subset.map((vector) => vector.proofEventCount)),
        conditionalClueCount: numericSummary(subset.map((vector) => vector.conditionalClueCount)),
      }];
    }),
  );
  const cp001 = checkpointSummary["SEA-CP-001"];
  const cp005 = checkpointSummary["SEA-CP-005"];
  return {
    caseletCount: vectors.length,
    checkpointSummary,
    clueCountRangeOverlapCp001VsCp005: cp001.clueCount.max >= cp005.clueCount.min,
    proofEventRangeOverlapCp001VsCp005: cp001.proofEventCount.max >= cp005.proofEventCount.min,
    calibratedCaseletCount: vectors.filter((vector) => vector.calibratedDifficultyBand !== null).length,
    calibrationStatus: "NO_EMPIRICAL_SOLVE_TIME_OR_ACCURACY_CALIBRATION" as const,
  };
}
