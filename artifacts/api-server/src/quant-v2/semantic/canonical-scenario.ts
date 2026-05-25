import type { CanonicalPercentageProblem } from "../canonical/percentage-types";
import type { EditorialRealization } from "../editorial/editorial-types";
import {
  anchorEntry,
  detectAnchorKeys,
  type SemanticAnchorDomain,
} from "./anchorLexicon";

export type CanonicalScenario = {
  object: string;
  domain: SemanticAnchorDomain;
  unit?: string;
  entityType?: string;
  realismProfile?: string;
  allowedAnchorKeys: string[];
};

function domainForProblem(
  problem: CanonicalPercentageProblem,
): SemanticAnchorDomain {
  if (problem.subtype === "relational_percentage") return "relational";
  if (problem.category === "election") return "election";
  if (problem.category === "population") return "population";
  if (problem.category === "comparison" || problem.subtype === "pass_fail") {
    return "marks";
  }
  if (problem.category === "mixture") return "mixture";
  if (problem.category === "expenditure") return "expenditure";
  if (problem.category === "finance") return "salary";
  if (problem.category === "commercial") return "commercial";
  return "general";
}

function defaultObjectForDomain(domain: SemanticAnchorDomain) {
  switch (domain) {
    case "commercial":
      return "mobile_phone";
    case "election":
      return "votes";
    case "population":
      return "population";
    case "marks":
      return "marks";
    case "mixture":
      return "milk_water_mixture";
    case "expenditure":
      return "fuel";
    case "salary":
      return "salary";
    case "relational":
      return "income";
    default:
      return "general_quantity";
  }
}

function allowedAnchorKeys(domain: SemanticAnchorDomain) {
  switch (domain) {
    case "commercial":
      return [
        "bicycle",
        "refrigerator",
        "mobile_phone",
        "wheat_bag",
        "sugar_packet",
        "cooking_oil_tin",
        "television",
        "laptop",
        "school_bag",
        "shirt",
        "rice_bag",
        "income",
      ];
    case "election":
      return ["votes", "winning_candidate", "valid_votes"];
    case "population":
      return ["population"];
    case "marks":
      return ["marks"];
    case "mixture":
      return ["milk_water_mixture"];
    case "expenditure":
      return ["fuel"];
    case "salary":
      return ["salary"];
    case "relational":
      return ["income", "salary", "marks", "population"];
    default:
      return ["general_quantity"];
  }
}

export function deriveCanonicalScenario(input: {
  problem: CanonicalPercentageProblem;
  editorial?: EditorialRealization;
}): CanonicalScenario {
  const domain = domainForProblem(input.problem);
  const detected = detectAnchorKeys(input.editorial?.stem, "en")
    .find((key) => anchorEntry(key)?.domain === domain);
  const object = detected ?? defaultObjectForDomain(domain);
  const entry = anchorEntry(object);

  return {
    object,
    domain,
    unit: entry?.unit,
    entityType: entry?.entityType,
    realismProfile:
      domain === "general" ? "neutral_exam" : `${domain}_exam_realism`,
    allowedAnchorKeys: allowedAnchorKeys(domain),
  };
}
