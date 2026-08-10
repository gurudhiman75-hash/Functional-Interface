export type TsdDifficultyLabel = "Easy" | "Medium" | "Hard";
export type TsdDifficultyStatus = "EDITORIAL_CALIBRATION_REQUIRED" | "EDITORIALLY_CALIBRATED";

export interface TsdEditorialDifficulty {
  readonly label: TsdDifficultyLabel;
  readonly status: TsdDifficultyStatus;
  readonly featureScore: number;
}

export interface TsdEditorialLifecycle {
  readonly reviewStatus: "EDITORIAL_REVIEW_REQUIRED";
  readonly englishDecision: "NEEDS_REVISION";
  readonly englishFreezeStatus: "UNFROZEN";
  readonly questionBankStatus: "NOT_STORED";
  readonly testEligibility: "INELIGIBLE";
  readonly publiclyPublishable: false;
}

export function reopenedEditorialLifecycle(): TsdEditorialLifecycle {
  return Object.freeze({
    reviewStatus: "EDITORIAL_REVIEW_REQUIRED",
    englishDecision: "NEEDS_REVISION",
    englishFreezeStatus: "UNFROZEN",
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
  });
}

export function editorialDifficulty(label: TsdDifficultyLabel, featureScore: number): TsdEditorialDifficulty {
  if (!Number.isInteger(featureScore) || featureScore < 0) {
    throw new Error(`Invalid TSD editorial difficulty score: ${featureScore}`);
  }
  return Object.freeze({
    label,
    status: "EDITORIAL_CALIBRATION_REQUIRED",
    featureScore,
  });
}

export function questionLanguageId(
  checkpointId: "TSD-CP-001" | "TSD-CP-002",
  authorityId: string,
  seed: string,
): string {
  return `${checkpointId}:${authorityId}:${seed}:en`;
}
