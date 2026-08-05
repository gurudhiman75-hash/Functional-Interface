import type { BlrCp006Graph } from "../BLR-CP-006/cp006-model";
import type { BlrCp007Scenario } from "./cp007-model";
import type {
  BlrCp007V2Option,
  BlrCp007V2Question,
} from "./cp007-v2-model";
import { buildAccessibleBlrCp007V2Explanation } from "./cp007-v2-accessibility";

export function buildManualReviewedBlrCp007V2Explanation(
  scenario: BlrCp007Scenario,
  options: readonly BlrCp007V2Option[],
  selected: BlrCp007V2Option,
  graph: BlrCp006Graph,
): BlrCp007V2Question["explanation"] {
  const explanation = buildAccessibleBlrCp007V2Explanation(
    scenario,
    options,
    selected,
    graph,
  );
  if (explanation.mode !== "DIRECT_LOOKUP_MINIMAL") return explanation;
  return {
    ...explanation,
    steps: [
      ...explanation.steps,
      "This is a direct match with the relation asked in the question.",
    ],
  };
}
