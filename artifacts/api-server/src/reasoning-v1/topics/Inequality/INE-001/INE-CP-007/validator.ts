import { createComparisonConstraint, strongestDefiniteRelation } from "../foundation/relations";
import { assertSolverAgreement } from "../foundation/solver-agreement";
import type { ComparisonRelation } from "../foundation/types";
import type { GeneratedIneCp007Question, IneCp007ValidationResult } from "./types";

function relationHolds(
  relation: ComparisonRelation,
  left: number,
  right: number,
): boolean {
  switch (relation) {
    case "GREATER_THAN":
      return left > right;
    case "LESS_THAN":
      return left < right;
    case "EQUAL_TO":
      return left === right;
    case "GREATER_THAN_OR_EQUAL":
      return left >= right;
    case "LESS_THAN_OR_EQUAL":
      return left <= right;
  }
}

export function validateIneCp007Question(
  question: GeneratedIneCp007Question,
): IneCp007ValidationResult {
  const errors: string[] = [];
  if (question.options.length !== 4 || new Set(question.options.map((entry) => entry.value)).size !== 4)
    errors.push("Exactly four unique options are required.");
  if (question.options.filter((entry) => entry.isCorrect).length !== 1)
    errors.push("Exactly one option must be correct.");
  if (!question.options[question.correctIndex]?.isCorrect)
    errors.push("correctIndex does not identify the correct option.");
  if (question.options.filter((entry) => !entry.isCorrect).some((entry) => !entry.errorLabel))
    errors.push("Every distractor requires an error label.");
  if (question.explanation.length < 40 || question.explanation.length > 300)
    errors.push("Explanation must remain short and useful.");
  if (
    question.metadata.deliveryProfile === "EXAM_PRACTICE_PROTOTYPE" &&
    question.metadata.examApplicability !== "BANKING_REGULATORY_PRACTICE_ONLY"
  )
    errors.push("Exam-practice metadata is inconsistent.");
  if (
    question.metadata.deliveryProfile === "GUIDED_DISCOVERY" &&
    question.metadata.examApplicability !== "GUIDED_CONCEPT_ONLY"
  )
    errors.push("Guided-discovery metadata is inconsistent.");
  if (
    (question.structuredScenario.taskKind === "MISSING_OPERATOR" ||
      question.structuredScenario.taskKind === "SELECT_EXPRESSION") &&
    question.displayedCodeKey.length !== 5
  )
    errors.push("Exam-shaped operator tasks require the complete code key.");
  if (
    question.structuredScenario.taskKind === "RECOVER_MAP" &&
    question.displayedCodeKey.length !== 3
  )
    errors.push("Map recovery must leave two candidate meanings unresolved.");
  if (question.structuredScenario.taskKind === "RECOVER_MAP") {
    const { candidateRelations, numericTests, targetRelation } =
      question.structuredScenario;
    const matchingRelations = candidateRelations.filter((relation) =>
      (numericTests ?? []).every(
        (test) =>
          relationHolds(relation, test.left, test.right) === test.expected,
      ),
    );
    if (
      candidateRelations.length !== 2 ||
      !numericTests ||
      numericTests.length < 2 ||
      matchingRelations.length !== 1 ||
      matchingRelations[0] !== targetRelation
    )
      errors.push(
        "Map-recovery evidence must distinguish exactly one of two candidate meanings.",
      );
  }
  if (
    question.structuredScenario.taskKind === "MISSING_OPERATOR" ||
    question.structuredScenario.taskKind === "SELECT_EXPRESSION"
  ) {
    const target = question.structuredScenario.targetRelation;
    const matchingOptions = question.options.filter((option) => {
      if (!option.relation) return false;
      const statements = [
        createComparisonConstraint("P", option.relation, "Q", "S1"),
        createComparisonConstraint("Q", "EQUAL_TO", "R", "S2"),
      ];
      return (
        strongestDefiniteRelation(
          assertSolverAgreement(statements, "P", "R").modelEvidence
            .possibleAtomicRelations,
        ) === target
      );
    });
    if (matchingOptions.length !== 1 || !matchingOptions[0]?.isCorrect)
      errors.push("The four displayed choices do not have one unique formal answer.");
  }
  if (
    question.permanentQlId !== null ||
    !question.prototypeOnly ||
    question.publiclyPublishable ||
    question.questionStudioVisible
  )
    errors.push("CP-007 records must remain unreleased prototypes.");
  const learnerText = JSON.stringify({
    stem: question.stem,
    key: question.displayedCodeKey,
    evidence: question.displayedEvidence,
    options: question.options.map((entry) => entry.value),
    explanation: question.explanation,
  });
  if (/\b(?:undefined|null|NaN)\b/i.test(learnerText))
    errors.push("Learner text contains a missing-value placeholder.");
  return { valid: errors.length === 0, errors };
}
