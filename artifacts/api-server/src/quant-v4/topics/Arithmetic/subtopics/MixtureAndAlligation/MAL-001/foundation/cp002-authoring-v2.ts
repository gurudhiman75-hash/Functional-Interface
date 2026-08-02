import type { MalCp002Context } from "./cp002-context-library";
import type { MalCp002SolveRequest, MalCp002SolveResult } from "./cp002-types";
import type { MalCp002Explanation } from "./cp002-authoring-types";
import { buildTargetAdjustmentExplanation, buildForwardRatioExplanation } from "./cp002-authoring-v2-adjustment";
import { buildOriginalRatioExplanation, buildComponentPairExplanation } from "./cp002-authoring-v2-reconstruction";
import { buildReplacementExplanation } from "./cp002-authoring-v2-replacement";

export { buildMalCp002Stem } from "./cp002-authoring-v2-common";
export {
  buildMalCp002Diagram,
  buildMalCp002Options,
  buildMalCp002ReasoningGraph,
  formatMalCp002Answer,
} from "./cp002-authoring";

export function buildMalCp002Explanation(
  request: MalCp002SolveRequest,
  result: MalCp002SolveResult,
  context: MalCp002Context,
): MalCp002Explanation {
  switch (request.mode) {
    case "UNKNOWN_PURE_ADJUSTMENT_TO_TARGET":
      if (result.kind !== "ADJUSTMENT_QUANTITY") {
        throw new Error(`Expected ADJUSTMENT_QUANTITY, received ${result.kind}.`);
      }
      return buildTargetAdjustmentExplanation(request, result, context);

    case "RESULTING_RATIO_AFTER_PURE_ADJUSTMENT":
      if (result.kind !== "COMPONENT_RATIO") {
        throw new Error(`Expected COMPONENT_RATIO, received ${result.kind}.`);
      }
      return buildForwardRatioExplanation(request, result, context);

    case "ORIGINAL_RATIO_FROM_FINAL_PURE_ADJUSTMENT":
      if (result.kind !== "ORIGINAL_RATIO") {
        throw new Error(`Expected ORIGINAL_RATIO, received ${result.kind}.`);
      }
      return buildOriginalRatioExplanation(request, result, context);

    case "COMPONENT_QUANTITIES_FROM_TOTAL_AND_RATIO":
      if (result.kind !== "COMPONENT_QUANTITY_PAIR") {
        throw new Error(
          `Expected COMPONENT_QUANTITY_PAIR, received ${result.kind}.`,
        );
      }
      return buildComponentPairExplanation(request, result, context);

    case "UNKNOWN_SINGLE_REPLACEMENT_TO_TARGET":
      if (result.kind !== "SINGLE_REPLACEMENT_QUANTITY") {
        throw new Error(
          `Expected SINGLE_REPLACEMENT_QUANTITY, received ${result.kind}.`,
        );
      }
      return buildReplacementExplanation(request, result, context);
  }
}
