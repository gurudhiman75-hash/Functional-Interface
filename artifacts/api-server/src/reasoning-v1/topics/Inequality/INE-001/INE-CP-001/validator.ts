import { verifySolverAgreement } from "../foundation/solver-agreement";
import type {
  GeneratedIneCp001PrototypeQuestion,
  IneCp001AnswerSemantic,
  IneCp001ValidationResult,
} from "./types";

function answerFromQuestion(
  question: GeneratedIneCp001PrototypeQuestion,
): IneCp001AnswerSemantic {
  return question.metadata.strongestDefiniteRelation ?? "INDETERMINATE";
}

export function validateIneCp001Question(
  question: GeneratedIneCp001PrototypeQuestion,
): IneCp001ValidationResult {
  const errors: string[] = [];
  const { statements, query } = question.structuredPrompt;
  const agreementEvidence = verifySolverAgreement(
    statements,
    query.leftId,
    query.rightId,
  );
  const pairEvidence = agreementEvidence.graphEvidence;
  if (!agreementEvidence.agreed)
    errors.push("Graph solver and model enumerator disagree.");
  if (!agreementEvidence.graphAnalysis.consistent)
    errors.push("Displayed statements are contradictory.");
  if (!pairEvidence) errors.push("No pair relation evidence was produced.");
  if (question.options.length !== 4)
    errors.push("Exactly four options are required.");
  if (
    new Set(question.options.map((option) => option.semanticValue)).size !== 4
  )
    errors.push("Options must have four unique semantic values.");
  if (question.options.filter((option) => option.isCorrect).length !== 1)
    errors.push("Exactly one option must be marked correct.");
  if (question.options[question.correctIndex]?.isCorrect !== true)
    errors.push("correctIndex must point to the correct option.");
  if (
    question.options[question.correctIndex]?.semanticValue !==
    answerFromQuestion(question)
  )
    errors.push(
      "The marked option does not match the independently solved answer.",
    );
  if (question.explanation.distractorAnalysis.length !== 3)
    errors.push("Every distractor requires an explanation.");
  return {
    valid: errors.length === 0,
    errors,
    pairEvidence,
    agreementEvidence,
  };
}
