import type { Com002ReviewQuestion } from "./com002-review-types";

export type Com002DifficultyV1 = "Easy" | "Medium" | "Hard";

export const COM002_DIFFICULTY_CLASSIFIER_VERSION_V1 =
  "COM-002-DIFFICULTY-V1-CANDIDATE-1" as const;

export type Com002DifficultyDecisionV1 = {
  difficulty: Com002DifficultyV1;
  topology:
    | "DIRECT_SINGLE_FACT"
    | "INVERSE_SINGLE_FACT"
    | "MATCHED_PAIR"
    | "CONTEXTUAL_DELETE_BEHAVIOR"
    | "MULTI_FACT_COMPOSITION";
  rationale: string;
  classifierVersion: typeof COM002_DIFFICULTY_CLASSIFIER_VERSION_V1;
  reviewOnlyCandidate: true;
  productionClaimAuthorized: false;
};

function decision(
  difficulty: Com002DifficultyV1,
  topology: Com002DifficultyDecisionV1["topology"],
  rationale: string,
): Com002DifficultyDecisionV1 {
  return {
    difficulty,
    topology,
    rationale,
    classifierVersion: COM002_DIFFICULTY_CLASSIFIER_VERSION_V1,
    reviewOnlyCandidate: true,
    productionClaimAuthorized: false,
  };
}

const DIRECT_MODES = new Set([
  "ENTITY_TO_FUNCTION",
  "OS_VS_NON_OS",
  "OS_TO_LICENSE",
  "TYPE_TO_PROPERTY",
  "COMPONENT_TO_ROLE",
  "CORE_COMPONENT",
  "INTERFACE_TO_PROPERTY",
  "TERM_TO_PROCESS",
  "COMPONENT_TO_FUNCTION",
  "ITEM_TO_DEFINITION",
  "EXTENSION_CONCEPT",
  "EXTENSION_TO_TYPE",
  "ACTION_TO_EFFECT",
  "RECOVERY_ACTION",
  "PERMANENT_DELETE_BEHAVIOR",
  "SHORTCUT_TO_ACTION",
]);

const INVERSE_MODES = new Set([
  "FUNCTION_TO_ENTITY",
  "ATTRIBUTE_TO_OS",
  "PROPERTY_TO_TYPE",
  "ROLE_TO_COMPONENT",
  "PROPERTY_TO_INTERFACE",
  "PROCESS_TO_TERM",
  "FUNCTION_TO_COMPONENT",
  "DEFINITION_TO_ITEM",
  "TYPE_TO_EXTENSION",
  "EFFECT_TO_ACTION",
  "ACTION_TO_SHORTCUT",
]);

export function classifyCom002DifficultyV1(
  question: Com002ReviewQuestion,
): Com002DifficultyDecisionV1 {
  if (
    question.qlId === "COM-002-QL-013" ||
    question.surfaceMode === "MULTI_STATEMENT_TRUTH_VECTOR"
  ) {
    return decision(
      "Hard",
      "MULTI_FACT_COMPOSITION",
      "Requires evaluating several independently sourced operating-system/file-management statements and composing their truth values into one answer.",
    );
  }

  if (question.surfaceMode === "MATCHED_PAIR") {
    return decision(
      "Medium",
      "MATCHED_PAIR",
      "Requires validating both sides of a shortcut or file-extension relation rather than recalling one isolated label.",
    );
  }

  if (question.surfaceMode === "DELETE_DESTINATION") {
    return decision(
      "Medium",
      "CONTEXTUAL_DELETE_BEHAVIOR",
      "Requires applying Windows deletion behavior in the stated storage/location context rather than treating every delete action as identical.",
    );
  }

  if (INVERSE_MODES.has(question.surfaceMode)) {
    return decision(
      "Medium",
      "INVERSE_SINGLE_FACT",
      "Requires reversing a familiar entity-to-property/function relation and selecting the entity, component, action, shortcut or extension from its description.",
    );
  }

  if (DIRECT_MODES.has(question.surfaceMode)) {
    return decision(
      "Easy",
      "DIRECT_SINGLE_FACT",
      "Uses direct recognition of one approved operating-system, Windows or file-management fact in its familiar direction.",
    );
  }

  throw new Error(
    `COM-002 difficulty classifier has no topology rule for ${question.qlId}/${question.surfaceMode}`,
  );
}
