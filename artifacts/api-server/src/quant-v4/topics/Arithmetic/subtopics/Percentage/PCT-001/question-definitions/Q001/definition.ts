import { DEFAULT_HINT_IDS, DEFAULT_MISCONCEPTION_IDS, DEFAULT_VALIDATION_RULE_IDS, definePct001Question, explanationOwnership } from "../definition-helpers";
import { PCT_001_APPROVED_STEM_REFERENCES } from "../stem-assets";

export const Q001 = definePct001Question({
  definitionId: "Q001",
  stem: PCT_001_APPROVED_STEM_REFERENCES["PCT-QL-017"],
  variables: { ratePairs: [{ knownRate: 20, targetRate: 25, direction: "TARGET_GREATER" }], unitValues: [5, 10, 20], arithmeticBehavior: "INTEGER_UNIT", exactnessPolicy: "RATIONAL_EXACT", roundingBoundary: "PRESENTATION_ONLY" },
  explanation: explanationOwnership("short"),
  hintIds: DEFAULT_HINT_IDS,
  misconceptionIds: DEFAULT_MISCONCEPTION_IDS,
  validationRuleIds: DEFAULT_VALIDATION_RULE_IDS,
});
