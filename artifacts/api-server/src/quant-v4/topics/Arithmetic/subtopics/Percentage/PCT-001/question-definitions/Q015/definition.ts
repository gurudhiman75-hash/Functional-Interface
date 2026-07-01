import { DEFAULT_HINT_IDS, DEFAULT_MISCONCEPTION_IDS, DEFAULT_VALIDATION_RULE_IDS, definePct001Question, explanationOwnership } from "../definition-helpers";
import { PCT_001_APPROVED_STEM_REFERENCES } from "../stem-assets";

export const Q015 = definePct001Question({
  definitionId: "Q015",
  stem: PCT_001_APPROVED_STEM_REFERENCES["PCT-QL-317"],
  variables: { ratePairs: [{ knownRate: 15, targetRate: 90, direction: "TARGET_GREATER" }], unitValues: [40, 100, 200], arithmeticBehavior: "INTEGER_UNIT", exactnessPolicy: "RATIONAL_EXACT", roundingBoundary: "PRESENTATION_ONLY" },
  explanation: explanationOwnership("detailed"),
  hintIds: DEFAULT_HINT_IDS,
  misconceptionIds: [...DEFAULT_MISCONCEPTION_IDS, "PERCENT_LARGE_SCALE_FACTOR"],
  validationRuleIds: DEFAULT_VALIDATION_RULE_IDS,
});
