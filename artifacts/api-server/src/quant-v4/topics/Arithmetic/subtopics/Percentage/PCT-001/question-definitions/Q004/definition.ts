import { DEFAULT_HINT_IDS, DEFAULT_MISCONCEPTION_IDS, DEFAULT_VALIDATION_RULE_IDS, definePct001Question, explanationOwnership } from "../definition-helpers";
import { PCT_001_APPROVED_STEM_REFERENCES } from "../stem-assets";

export const Q004 = definePct001Question({
  definitionId: "Q004",
  stem: PCT_001_APPROVED_STEM_REFERENCES["PCT-QL-017"],
  variables: { ratePairs: [{ knownRate: 12.5, targetRate: 37.5, direction: "TARGET_GREATER" }], unitValues: [2.5, 6.5, 12.5], arithmeticBehavior: "TERMINATING_DECIMAL_UNIT", exactnessPolicy: "RATIONAL_EXACT", roundingBoundary: "PRESENTATION_ONLY" },
  explanation: explanationOwnership("detailed"),
  hintIds: [...DEFAULT_HINT_IDS, "UNIT_VALUE_PRESERVE_EXACT_DECIMAL"],
  misconceptionIds: DEFAULT_MISCONCEPTION_IDS,
  validationRuleIds: DEFAULT_VALIDATION_RULE_IDS,
});
