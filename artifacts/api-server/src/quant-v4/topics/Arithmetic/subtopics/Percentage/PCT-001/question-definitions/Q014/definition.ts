import { DEFAULT_HINT_IDS, DEFAULT_MISCONCEPTION_IDS, DEFAULT_VALIDATION_RULE_IDS, definePct001Question, explanationOwnership } from "../definition-helpers";
import { PCT_001_APPROVED_STEM_REFERENCES } from "../stem-assets";

export const Q014 = definePct001Question({
  definitionId: "Q014",
  stem: PCT_001_APPROVED_STEM_REFERENCES["PCT-QL-317"],
  variables: { ratePairs: [{ knownRate: 50, targetRate: 10, direction: "TARGET_SMALLER" }], unitValues: [7, 14, 28], arithmeticBehavior: "INTEGER_UNIT", exactnessPolicy: "RATIONAL_EXACT", roundingBoundary: "PRESENTATION_ONLY" },
  explanation: explanationOwnership("standard"),
  hintIds: DEFAULT_HINT_IDS,
  misconceptionIds: DEFAULT_MISCONCEPTION_IDS,
  validationRuleIds: DEFAULT_VALIDATION_RULE_IDS,
});
