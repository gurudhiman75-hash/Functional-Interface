import { DEFAULT_HINT_IDS, DEFAULT_MISCONCEPTION_IDS, DEFAULT_VALIDATION_RULE_IDS, definePct001Question, explanationOwnership } from "../definition-helpers";
import { PCT_001_APPROVED_STEM_REFERENCES } from "../stem-assets";

export const Q007 = definePct001Question({
  definitionId: "Q007",
  stem: PCT_001_APPROVED_STEM_REFERENCES["PCT-QL-117"],
  variables: { ratePairs: [{ knownRate: 10, targetRate: 80, direction: "TARGET_GREATER" }], unitValues: [50, 100, 250], arithmeticBehavior: "INTEGER_UNIT", exactnessPolicy: "RATIONAL_EXACT", roundingBoundary: "PRESENTATION_ONLY" },
  explanation: explanationOwnership("detailed"),
  hintIds: DEFAULT_HINT_IDS,
  misconceptionIds: [...DEFAULT_MISCONCEPTION_IDS, "PERCENT_LARGE_SCALE_FACTOR"],
  validationRuleIds: DEFAULT_VALIDATION_RULE_IDS,
});
