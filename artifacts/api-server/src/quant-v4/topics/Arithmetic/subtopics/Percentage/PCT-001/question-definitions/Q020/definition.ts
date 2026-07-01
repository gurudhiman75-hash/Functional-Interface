import { DEFAULT_HINT_IDS, DEFAULT_MISCONCEPTION_IDS, DEFAULT_VALIDATION_RULE_IDS, definePct001Question, explanationOwnership } from "../definition-helpers";
import { PCT_001_APPROVED_STEM_REFERENCES } from "../stem-assets";

export const Q020 = definePct001Question({
  definitionId: "Q020",
  stem: PCT_001_APPROVED_STEM_REFERENCES["PCT-QL-417"],
  variables: { ratePairs: [{ knownRate: 22.5, targetRate: 67.5, direction: "TARGET_GREATER" }], unitValues: [2.5, 8.5, 18.5], arithmeticBehavior: "TERMINATING_DECIMAL_UNIT", exactnessPolicy: "RATIONAL_EXACT", roundingBoundary: "PRESENTATION_ONLY" },
  explanation: explanationOwnership("detailed"),
  hintIds: [...DEFAULT_HINT_IDS, "UNIT_VALUE_PRESERVE_EXACT_DECIMAL"],
  misconceptionIds: DEFAULT_MISCONCEPTION_IDS,
  validationRuleIds: DEFAULT_VALIDATION_RULE_IDS,
});
