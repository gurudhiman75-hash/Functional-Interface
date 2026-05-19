import type {
  CanonicalPercentageProblem,
} from "../canonical/percentage-types";
import type { ReasoningGraph } from "../reasoning/reasoning-graph-types";
import type { EditorialStyle } from "./editorial-types";
import { realizeExplanationWithNaturalization } from "./explanation-rhythm-engine";

export function realizeExplanation(input: {
  problem: CanonicalPercentageProblem;
  graph: ReasoningGraph;
  style?: EditorialStyle;
  seed?: number | string;
}): string {
  return realizeExplanationWithNaturalization(input).explanation;
}

export { realizeExplanationWithNaturalization };
