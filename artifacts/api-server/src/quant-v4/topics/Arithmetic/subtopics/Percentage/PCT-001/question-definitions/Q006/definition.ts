import { DEFAULT_HINT_IDS, DEFAULT_MISCONCEPTION_IDS, DEFAULT_VALIDATION_RULE_IDS, definePct001Question, explanationOwnership } from "../definition-helpers";
import { PCT_001_APPROVED_STEM_REFERENCES } from "../stem-assets";

export const Q006 = definePct001Question({
  definitionId: "Q006",
  stem: PCT_001_APPROVED_STEM_REFERENCES["PCT-QL-117"],
  variables: { ratePairs: [{ knownRate: 60, targetRate: 20, direction: "TARGET_SMALLER" }], unitValues: [5, 15, 30], arithmeticBehavior: "INTEGER_UNIT", exactnessPolicy: "RATIONAL_EXACT", roundingBoundary: "PRESENTATION_ONLY" },
  explanation: explanationOwnership("standard"),
  hintIds: DEFAULT_HINT_IDS,
  misconceptionIds: [...DEFAULT_MISCONCEPTION_IDS, "PERCENT_SCALE_DIRECTION"],
  validationRuleIds: DEFAULT_VALIDATION_RULE_IDS,
});
