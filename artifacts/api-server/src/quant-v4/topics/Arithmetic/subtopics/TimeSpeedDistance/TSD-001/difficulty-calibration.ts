import type {
  TsdDifficultyLabel,
  TsdEditorialDifficulty,
} from "./editorial-contract";

/**
 * Chapter-wide difficulty rubric.
 *
 * 1 = direct one-relation recall/application -> Easy
 * 2 = one conversion or two linked operations -> Medium
 * 3 = multi-step weighted/clock/remaining-time application -> Medium
 * 4+ = inverse weighting, coupled equations or allocation/ratio reasoning -> Hard
 */
export function calibratedDifficultyLabel(featureScore: number): TsdDifficultyLabel {
  if (!Number.isInteger(featureScore) || featureScore < 1) {
    throw new Error(`Invalid TSD difficulty feature score: ${featureScore}`);
  }
  if (featureScore === 1) return "Easy";
  if (featureScore <= 3) return "Medium";
  return "Hard";
}

export function calibrateTsdDifficulty(
  difficulty: TsdEditorialDifficulty,
): TsdEditorialDifficulty {
  return Object.freeze({
    label: calibratedDifficultyLabel(difficulty.featureScore),
    status: "EDITORIALLY_CALIBRATED" as const,
    featureScore: difficulty.featureScore,
  });
}
