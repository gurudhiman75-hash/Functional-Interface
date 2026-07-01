import { DEFAULT_HINT_IDS, DEFAULT_MISCONCEPTION_IDS, DEFAULT_VALIDATION_RULE_IDS, definePct001Question, explanationOwnership } from "../definition-helpers";
import { PCT_001_APPROVED_STEM_REFERENCES } from "../stem-assets";

export const Q019 = definePct001Question({
  definitionId: "Q019",
  stem: PCT_001_APPROVED_STEM_REFERENCES["PCT-QL-417"],
  variables: { ratePairs: [{ knownRate: 8, targetRate: 64, direction: "TARGET_GREATER" }], unitValues: [75, 125, 250], arithmeticBehavior: "INTEGER_UNIT", exactnessPolicy: "RATIONAL_EXACT", roundingBoundary: "PRESENTATION_ONLY" },
  explanation: explanationOwnership("detailed"),
  hintIds: DEFAULT_HINT_IDS,
  misconceptionIds: [...DEFAULT_MISCONCEPTION_IDS, "PERCENT_LARGE_SCALE_FACTOR"],
  validationRuleIds: DEFAULT_VALIDATION_RULE_IDS,
});
