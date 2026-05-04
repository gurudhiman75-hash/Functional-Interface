import type { DifficultyLabel } from "../../core/generator-engine";

export function getDistractorMagnitude(
  correct: number,
  difficulty: DifficultyLabel,
) {
  const baseMagnitude = Math.max(
    1,
    Math.abs(correct),
  );
  const magnitudeScale =
    difficulty === "Easy"
      ? 0.28
      : difficulty === "Hard"
        ? 0.05
        : 0.14;
  const minimumGap =
    difficulty === "Easy"
      ? baseMagnitude < 100
        ? 18
        : 35
      : difficulty === "Hard"
        ? baseMagnitude < 100
          ? 3
          : 8
        : baseMagnitude < 100
          ? 9
          : 18;

  return Math.max(
    minimumGap,
    Math.round(
      baseMagnitude *
        magnitudeScale,
    ),
  );
}

export function getSignedCloseGap(
  magnitude: number,
) {
  return Math.max(
    1,
    Math.round(magnitude / 2),
  );
}

export function compareOptionGap(
  leftValue: string,
  rightValue: string,
  correct: number,
  difficulty: DifficultyLabel,
) {
  const leftGap = Math.abs(
    Number(leftValue) - correct,
  );
  const rightGap = Math.abs(
    Number(rightValue) - correct,
  );

  if (difficulty === "Easy") {
    return rightGap - leftGap;
  }

  if (difficulty === "Hard") {
    return leftGap - rightGap;
  }

  const targetGap = Math.max(
    6,
    Math.round(
      Math.abs(correct) * 0.12,
    ),
  );

  return (
    Math.abs(leftGap - targetGap) -
    Math.abs(rightGap - targetGap)
  );
}
