import { evaluateConclusion } from "../foundation/conclusion-evaluator";
import { analyzeInequalityGraph } from "../foundation/graph-solver";
import { assertSolverAgreement } from "../foundation/solver-agreement";
import type {
  GeneratedIneCp008Question,
  IneCp008ValidationResult,
} from "./types";

export function validateIneCp008Question(
  question: GeneratedIneCp008Question,
): IneCp008ValidationResult {
  const errors: string[] = [];
  const scenario = question.structuredScenario;
  if (
    question.options.length !== 4 ||
    new Set(question.options.map((entry) => entry.value)).size !== 4
  )
    errors.push("Exactly four unique options are required.");
  if (question.options.filter((entry) => entry.isCorrect).length !== 1)
    errors.push("Exactly one option must be marked correct.");
  if (!question.options[question.correctIndex]?.isCorrect)
    errors.push("correctIndex does not identify the correct option.");
  if (
    question.options
      .filter((entry) => !entry.isCorrect)
      .some((entry) => !entry.errorLabel)
  )
    errors.push("Every distractor requires a misconception label.");
  if (question.explanation.length < 100 || question.explanation.length > 500)
    errors.push("Explanation must be clear, concise, and sufficiently helpful.");
  if (
    question.metadata.deliveryProfile === "EXAM_PRACTICE_PROTOTYPE" &&
    question.metadata.examApplicability !==
      "BANKING_REGULATORY_PRACTICE_ONLY"
  )
    errors.push("Exam-practice applicability is inconsistent.");
  if (
    question.metadata.deliveryProfile === "GUIDED_ADVANCED_PROTOTYPE" &&
    question.metadata.examApplicability !== "GUIDED_CONCEPT_ONLY"
  )
    errors.push("Guided applicability is inconsistent.");

  if (scenario.taskKind === "SELECT_STATEMENT_SET") {
    const target = scenario.targetConclusion!;
    const matches = question.options.filter((option) => {
      if (!option.statementSet) return false;
      const evidence = assertSolverAgreement(
        option.statementSet,
        target.leftId,
        target.rightId,
      );
      return (
        evidence.graphEvidence?.strongestDefiniteRelation === target.relation
      );
    });
    if (matches.length !== 1 || !matches[0]?.isCorrect)
      errors.push(
        "Statement-set choices must produce one unique strongest target relation.",
      );
  } else if (scenario.taskKind === "CONTRADICTORY_ADDITION") {
    const contradictions = question.options.filter(
      (option) =>
        option.statement &&
        !analyzeInequalityGraph([
          ...scenario.baseStatements,
          option.statement,
        ]).consistent,
    );
    if (contradictions.length !== 1 || !contradictions[0]?.isCorrect)
      errors.push("Exactly one candidate addition must contradict the chain.");
  } else if (scenario.taskKind === "RECONSTRUCT_RELATION") {
    const target = scenario.targetConclusion!;
    const matches = question.options.filter((option) => {
      if (!option.statementSet) return false;
      const evidence = assertSolverAgreement(
        option.statementSet,
        target.leftId,
        target.rightId,
      );
      return (
        evidence.graphEvidence?.strongestDefiniteRelation === target.relation
      );
    });
    if (matches.length !== 1 || !matches[0]?.isCorrect)
      errors.push(
        "Missing-relation choices must produce one unique strongest endpoint relation.",
      );
  } else {
    const possible = question.options.filter((option) => {
      if (!option.conclusion) return false;
      const evaluation = evaluateConclusion(
        scenario.baseStatements,
        option.conclusion,
      );
      return evaluation.truth === "POSSIBLY_TRUE";
    });
    if (possible.length !== 1 || !possible[0]?.isCorrect)
      errors.push("Exactly one conclusion must be possible but not definite.");
    for (const option of question.options) {
      if (!option.conclusion) continue;
      const truth = evaluateConclusion(
        scenario.baseStatements,
        option.conclusion,
      ).truth;
      if (truth !== option.conclusionTruth)
        errors.push("Stored conclusion classification does not match the solver.");
    }
  }

  for (const option of question.options) {
    for (const statementSet of option.statementSet ? [option.statementSet] : []) {
      const query = scenario.query;
      if (!query) continue;
      const agreement = assertSolverAgreement(
        statementSet,
        query.leftId,
        query.rightId,
      );
      if (!agreement.agreed)
        errors.push("Independent solvers disagree on an option statement set.");
    }
  }
  if (
    question.permanentQlId !== null ||
    !question.prototypeOnly ||
    question.publiclyPublishable ||
    question.questionStudioVisible
  )
    errors.push("CP-008 records must remain unreleased prototypes.");
  const learnerText = JSON.stringify({
    stem: question.stem,
    statements: question.displayedStatements,
    options: question.options.map((entry) => entry.value),
    explanation: question.explanation,
  });
  if (/\b(?:undefined|null|NaN)\b/i.test(learnerText))
    errors.push("Learner text contains a missing-value placeholder.");
  if (/ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œ|ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â|ÃƒÆ’|ÃƒÂ¯Ã‚Â¿Ã‚Â½|Ã¯Â¿Â½/.test(learnerText))
    errors.push("Learner text contains damaged character encoding.");
  return { valid: errors.length === 0, errors };
}
