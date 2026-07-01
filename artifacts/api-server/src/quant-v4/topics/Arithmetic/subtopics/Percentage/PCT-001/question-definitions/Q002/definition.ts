import { DEFAULT_HINT_IDS, DEFAULT_MISCONCEPTION_IDS, DEFAULT_VALIDATION_RULE_IDS, definePct001Question, explanationOwnership } from "../definition-helpers";
import { PCT_001_APPROVED_STEM_REFERENCES } from "../stem-assets";

export const Q002 = definePct001Question({
  definitionId: "Q002",
  stem: PCT_001_APPROVED_STEM_REFERENCES["PCT-QL-017"],
  variables: { ratePairs: [{ knownRate: 40, targetRate: 25, direction: "TARGET_SMALLER" }], unitValues: [6, 12, 24], arithmeticBehavior: "INTEGER_UNIT", exactnessPolicy: "RATIONAL_EXACT", roundingBoundary: "PRESENTATION_ONLY" },
  explanation: explanationOwnership("standard"),
  hintIds: DEFAULT_HINT_IDS,
  misconceptionIds: DEFAULT_MISCONCEPTION_IDS,
  validationRuleIds: DEFAULT_VALIDATION_RULE_IDS,
});
