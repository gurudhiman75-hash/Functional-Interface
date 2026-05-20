import type {
  CanonicalPercentageProblem,
} from "../canonical/percentage-types";
import {
  formatSemanticValue,
  semanticAnswerValue,
} from "./semantic-values";

export function semanticAnswerText(problem: CanonicalPercentageProblem) {
  return formatSemanticValue(semanticAnswerValue(problem));
}

export function shortcutDomainNoun(problem: CanonicalPercentageProblem) {
  switch (problem.subtype) {
    case "election_margin":
      return "votes";
    case "pass_fail":
      return "marks";
    case "price_consumption":
      return "consumption";
    case "reverse_percentage":
      return "quantity";
    default:
      return "value";
  }
}

export function isPercentageAnswer(problem: CanonicalPercentageProblem) {
  return [
    "profit_loss",
    "price_consumption",
    "restore_original",
    "salary_revision",
    "relational_percentage",
  ].includes(problem.subtype);
}
