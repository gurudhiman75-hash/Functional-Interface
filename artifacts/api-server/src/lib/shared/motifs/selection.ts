import type {
  GeneratorOptions,
  Pattern,
  QuantTopicCluster,
} from "../../core/generator-engine";
import type { QuantMotif } from "../../motifs/types";
import { ALL_MOTIFS } from "../../motifs";
import {
  getMotifFormulaCompatibility,
  getRequestedDifficultyLabel,
} from "../../quant";
import { pickWeightedItem } from "../randomness";
import { validatePatternCompatibility } from "../validation/contracts";

function fallbackDifficultyLabel(
  difficultyScore: number,
) {
  if (difficultyScore <= 2.5) {
    return "Easy" as const;
  }

  if (difficultyScore <= 5.5) {
    return "Medium" as const;
  }

  return "Hard" as const;
}

export function getRangeOverlap(
  left: [number, number],
  right: [number, number],
) {
  const start = Math.max(
    left[0],
    right[0],
  );
  const end = Math.min(
    left[1],
    right[1],
  );

  return Math.max(0, end - start + 1);
}

export function pickMotif(
  topicCluster: QuantTopicCluster,
  pattern?: Pattern,
  options?: GeneratorOptions,
  classifyDifficultyLabel?: (
    difficultyScore: number,
  ) => "Easy" | "Medium" | "Hard",
): QuantMotif | null {
  const classifyLabel =
    classifyDifficultyLabel ??
    fallbackDifficultyLabel;
  const compatibleMotifs =
    ALL_MOTIFS.filter(
      (motif) => {
        if (
          motif.topicCluster !==
          topicCluster
        ) {
          return false;
        }

        if (!pattern) {
          return true;
        }

        const difficulty =
          getRequestedDifficultyLabel(
            pattern,
            options,
            classifyLabel,
          );
        const patternCompatibility =
          validatePatternCompatibility(
            pattern,
            topicCluster,
            motif,
            difficulty,
          );

        return (
          patternCompatibility.valid
        );
      },
    );

  if (!compatibleMotifs.length) {
    return null;
  }

  const targetDifficulty =
    pattern
      ? getRequestedDifficultyLabel(
          pattern,
          options,
          classifyLabel,
        )
      : "Medium";
  const targetDepthRange: [
    number,
    number,
  ] =
    targetDifficulty === "Easy"
      ? [1, 2]
      : targetDifficulty === "Hard"
        ? [3, 6]
        : [2, 4];

  return pickWeightedItem(
    compatibleMotifs,
    (motif) => {
      let weight =
        getMotifFormulaCompatibility(
          pattern,
          motif,
        );
      const overlap =
        getRangeOverlap(
          targetDepthRange,
          motif.reasoningDepthRange,
        );

      weight *= overlap > 0 ? 1 + overlap : 0.3;

      if (
        options?.examProfile &&
        options.examProfile !==
          "custom"
      ) {
        weight *=
          motif.examWeights?.[
            options.examProfile
          ] ?? 1;
      }

      return weight;
    },
  );
}
