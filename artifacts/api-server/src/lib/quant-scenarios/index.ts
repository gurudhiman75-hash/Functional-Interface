import type {
  DifficultyLabel,
  Pattern,
} from "../core/generator-engine";
import type { QuantMotif } from "../motifs/types";
import {
  inferQuantTopicCluster,
} from "../quant";
import {
  createAveragesScenario,
} from "./averages-scenarios";
import {
  createFundamentalsScenario,
} from "./fundamentals-scenarios";
import {
  createMixtureAlligationScenario,
} from "./mixture-alligation-scenarios";
import {
  createNumberSystemScenario,
} from "./number-system-scenarios";
import {
  createProfitLossScenario,
} from "./profit-loss-scenarios";
import {
  createSimpleCompoundInterestScenario,
} from "./simple-compound-interest-scenarios";
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
    case "averages":
      return createAveragesScenario(
        pattern,
        difficulty,
        motif,
      );
    case "fundamentals":
      return createFundamentalsScenario(
        pattern,
        difficulty,
        motif,
      );
    case "mixture-alligation":
      return createMixtureAlligationScenario(
        pattern,
        difficulty,
        motif,
      );
    case "number-system":
      return createNumberSystemScenario(
        pattern,
        difficulty,
        motif,
      );
    case "profit-loss":
      return createProfitLossScenario(
        pattern,
        difficulty,
        motif,
      );
    case "si-ci":
      return createSimpleCompoundInterestScenario(
        pattern,
        difficulty,
        motif,
      );
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
