import { DEFAULT_HINT_IDS, DEFAULT_MISCONCEPTION_IDS, DEFAULT_VALIDATION_RULE_IDS, definePct001Question, explanationOwnership } from "../definition-helpers";
import { PCT_001_APPROVED_STEM_REFERENCES } from "../stem-assets";

export const Q013 = definePct001Question({
  definitionId: "Q013",
  stem: PCT_001_APPROVED_STEM_REFERENCES["PCT-QL-317"],
  variables: { ratePairs: [{ knownRate: 25, targetRate: 75, direction: "TARGET_GREATER" }], unitValues: [2, 8, 20], arithmeticBehavior: "INTEGER_UNIT", exactnessPolicy: "RATIONAL_EXACT", roundingBoundary: "PRESENTATION_ONLY" },
  explanation: explanationOwnership("short"),
  hintIds: DEFAULT_HINT_IDS,
  misconceptionIds: DEFAULT_MISCONCEPTION_IDS,
  validationRuleIds: DEFAULT_VALIDATION_RULE_IDS,
});
