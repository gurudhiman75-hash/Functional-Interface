import { DEFAULT_HINT_IDS, DEFAULT_MISCONCEPTION_IDS, DEFAULT_VALIDATION_RULE_IDS, definePct001Question, explanationOwnership } from "../definition-helpers";
import { PCT_001_APPROVED_STEM_REFERENCES } from "../stem-assets";

export const Q010 = definePct001Question({
  definitionId: "Q010",
  stem: PCT_001_APPROVED_STEM_REFERENCES["PCT-QL-217"],
  variables: { ratePairs: [{ knownRate: 80, targetRate: 15, direction: "TARGET_SMALLER" }], unitValues: [10, 25, 50], arithmeticBehavior: "INTEGER_UNIT", exactnessPolicy: "RATIONAL_EXACT", roundingBoundary: "PRESENTATION_ONLY" },
  explanation: explanationOwnership("standard"),
  hintIds: DEFAULT_HINT_IDS,
  misconceptionIds: [...DEFAULT_MISCONCEPTION_IDS, "PERCENT_SCALE_DIRECTION"],
  validationRuleIds: DEFAULT_VALIDATION_RULE_IDS,
});
