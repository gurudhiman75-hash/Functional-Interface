import type {
  DifficultyLabel,
  Pattern,
} from "../core/generator-engine";
import type { QuantMotif } from "../motifs/types";
import {
  inferQuantTopicCluster,
} from "../quant";
import {
  createTimeWorkScenario,
  type QuantProceduralScenario,
} from "./time-work-scenarios";

export type {
  QuantProceduralScenario,
} from "./time-work-scenarios";

export function createQuantProceduralScenario(
  pattern: Pattern,
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
): QuantProceduralScenario | null {
  const topicCluster =
    inferQuantTopicCluster(pattern);

  switch (topicCluster) {
    case "time-work":
      return createTimeWorkScenario(
        pattern,
        difficulty,
        motif,
      );
    default:
      return null;
  }
}
