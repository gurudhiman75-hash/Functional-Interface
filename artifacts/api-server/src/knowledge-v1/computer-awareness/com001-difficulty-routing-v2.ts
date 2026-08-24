import type { Com001ReviewV2Question } from "./com001-review-synthesis-v2";

export type Com001DifficultyV2 = "Easy" | "Medium" | "Hard";

export const COM001_DIFFICULTY_CLASSIFIER_VERSION_V2 =
  "COM-001-DIFFICULTY-V2-CANDIDATE-1" as const;

export type Com001DifficultyDecisionV2 = {
  difficulty: Com001DifficultyV2;
  topology:
    | "DIRECT_SINGLE_FACT"
    | "INVERSE_SINGLE_FACT"
    | "MATCHED_PAIR"
    | "ORDERED_HIERARCHY"
    | "MULTI_CONSTRAINT_PROFILE"
    | "MULTI_FACT_COMPOSITION"
    | "DIRECT_EXAM_CAPACITY_RELATION"
    | "EXPLICIT_STANDARDS_CONVENTION";
  rationale: string;
  classifierVersion: typeof COM001_DIFFICULTY_CLASSIFIER_VERSION_V2;
  productionClaimAuthorized: false;
};

function decision(
  difficulty: Com001DifficultyV2,
  topology: Com001DifficultyDecisionV2["topology"],
  rationale: string,
): Com001DifficultyDecisionV2 {
  return {
    difficulty,
    topology,
    rationale,
    classifierVersion: COM001_DIFFICULTY_CLASSIFIER_VERSION_V2,
    productionClaimAuthorized: false,
  };
}

const DIRECT_RELATIONAL_MODES = new Set([
  "ENTITY_SELECTION",
  "LAYER_TO_ENTITY",
  "COMPONENT_TO_FUNCTION",
  "PARENT_TO_ENTITY",
  "MEDIUM_TO_ENTITY",
]);

const INVERSE_RELATIONAL_MODES = new Set([
  "ENTITY_TO_LAYER",
  "FUNCTION_TO_COMPONENT",
  "ENTITY_TO_PARENT",
]);

export function classifyCom001DifficultyV2(
  question: Com001ReviewV2Question,
): Com001DifficultyDecisionV2 {
  if (question.qlId === "COM-001-QL-008") {
    return decision(
      "Hard",
      "MULTI_FACT_COMPOSITION",
      "Requires evaluating several independent facts and then composing their truth values into one answer.",
    );
  }

  if (question.qlId === "COM-001-QL-007") {
    return decision(
      "Hard",
      "MULTI_CONSTRAINT_PROFILE",
      "Requires satisfying several operational storage characteristics simultaneously rather than recalling one isolated fact.",
    );
  }

  if (question.qlId === "COM-001-QL-006") {
    return decision(
      "Medium",
      "ORDERED_HIERARCHY",
      "Requires using relative position/order in the memory hierarchy rather than direct fact recognition.",
    );
  }

  if (question.qlId === "COM-001-QL-009") {
    if (question.capacityConvention === "TRADITIONAL_EXAM_1024") {
      return decision(
        "Easy",
        "DIRECT_EXAM_CAPACITY_RELATION",
        "Uses a single explicitly defined competitive-exam capacity relationship with one-step recognition or conversion.",
      );
    }
    return decision(
      "Medium",
      "EXPLICIT_STANDARDS_CONVENTION",
      "Requires keeping SI/IEC prefix convention explicit and selecting the value under that convention.",
    );
  }

  const mode = question.relationalSurfaceMode ?? "";
  if (mode === "MATCHED_PAIR") {
    return decision(
      "Medium",
      "MATCHED_PAIR",
      "Requires validating both sides of a relation pair rather than selecting an item from a directly named class.",
    );
  }
  if (INVERSE_RELATIONAL_MODES.has(mode)) {
    return decision(
      "Medium",
      "INVERSE_SINGLE_FACT",
      "Requires reversing the familiar fact direction from property/function/class back to the correct entity or category.",
    );
  }
  if (DIRECT_RELATIONAL_MODES.has(mode)) {
    return decision(
      "Easy",
      "DIRECT_SINGLE_FACT",
      "Directly recognizes one canonical memory/storage fact in its familiar entity-to-property or class-to-entity direction.",
    );
  }

  throw new Error(
    `COM-001 V2 difficulty classifier has no topology rule for ${question.qlId}/${mode || question.reviewV2Mode}`,
  );
}
