import { containsForbiddenRuntimePlaceholder } from "./language-contract";
import {
  assertStructuralPatternAllowed,
  assertTargetRemainderAllowed,
  getExplanationEntries,
  getQuestionLanguageIds,
  isRenderedQuestionLanguage,
  validateNsRem001Libraries,
  validateStructuralInstance,
} from "./library";
import { expectedAnswerRule } from "./reasoning-graph";
import {
  NS_REM_001_ARCHETYPE_ID,
  NS_REM_001_CP_001,
  type NsRem001QuestionPackage,
  type NsRem001ReasoningGraph,
  type NsRem001SolverResult,
  type NsRem001ValidationResult,
} from "./types";

function check(name: string, passed: boolean, message: string) {
  return { name, passed, message };
}

export function validateNsRem001AnswerContract(solver: NsRem001SolverResult, graph: NsRem001ReasoningGraph): NsRem001ValidationResult {
  const validSetNode = graph.nodes.find((node) => node.type === "Valid Value Set");
  const extractionNode = graph.nodes.find((node) => node.type === "CP Specific Answer Extraction");
  const answerNode = graph.nodes.find((node) => node.id === graph.answerNodeId);
  const checks = [
    check("archetype ownership", solver.archetypeId === NS_REM_001_ARCHETYPE_ID && graph.archetypeId === NS_REM_001_ARCHETYPE_ID, "Solver and graph must belong to NS-REM-001."),
    check("canonical problem ownership", solver.canonicalProblemId === graph.canonicalProblemId, "Solver and graph must target the same canonical problem."),
    check("reasoning pattern agreement", solver.reasoningPatternId === graph.reasoningPatternId, "Solver and graph must share reasoning pattern ID."),
    check("candidate generation", solver.candidateDigitSet.length === solver.candidateEvaluations.length, "Every candidate must be evaluated."),
    check("valid value set", solver.validValueSet.length >= 1, "Valid value set must be non-empty."),
    check(
      "cp-001 uniqueness",
      solver.canonicalProblemId !== NS_REM_001_CP_001 || solver.validValueSet.length === 1,
      "CP-001 must produce a unique valid value.",
    ),
    check("valid set graph agreement", JSON.stringify(validSetNode?.outputs.validValueSet) === JSON.stringify(solver.validValueSet), "Graph valid value set must match solver output."),
    check("answer extraction rule", extractionNode?.outputs.selectionRule === expectedAnswerRule(solver.canonicalProblemId), "Graph must record the CP-specific answer rule."),
    check("graph answer agreement", answerNode?.outputs.answer === solver.answer, "Graph answer must match solver answer."),
    check("solver verification", solver.verification.targetRemainderSatisfied && solver.verification.answerRuleSatisfied, "Solver verification must pass."),
  ];
  return { valid: checks.every((item) => item.passed), checks };
}

export const validateCp001AnswerContract = validateNsRem001AnswerContract;
export const validateCp002AnswerContract = validateNsRem001AnswerContract;
export const validateCp003AnswerContract = validateNsRem001AnswerContract;
export const validateCp004AnswerContract = validateNsRem001AnswerContract;
export const validateCp005AnswerContract = validateNsRem001AnswerContract;
export const validateCp006AnswerContract = validateNsRem001AnswerContract;
export const validateCp007AnswerContract = validateNsRem001AnswerContract;

export function validateNsRem001QuestionPackage(questionPackage: NsRem001QuestionPackage): NsRem001ValidationResult {
  const answerValidation = validateNsRem001AnswerContract(questionPackage.solver, questionPackage.reasoningGraph);
  const libraryValidation = validateNsRem001Libraries();
  const structuralInstanceValidation = validateStructuralInstance({
    patternId: questionPackage.patternId,
    instance: questionPackage.parameters.numberExpression,
  });
  let patternAllowed = true;
  let targetRemainderAllowed = true;
  try {
    assertStructuralPatternAllowed(questionPackage.patternId);
  } catch {
    patternAllowed = false;
  }
  try {
    assertTargetRemainderAllowed(questionPackage.parameters.divisor, questionPackage.parameters.targetRemainder);
  } catch {
    targetRemainderAllowed = false;
  }

  const explanationText = questionPackage.explanation.lines.join("\n");
  const expectedCandidateSet = questionPackage.parameters.missingPosition === 1 ? [1, 2, 3, 4, 5, 6, 7, 8, 9] : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const expectedValidSet = questionPackage.solver.candidateEvaluations.filter((entry) => entry.isValid).map((entry) => entry.candidate);
  const allowedQuestionIds = getQuestionLanguageIds(questionPackage.canonicalProblemId);
  const allowedExplanationIds = getExplanationEntries().map((entry) => entry.id);
  const checks = [
    ...answerValidation.checks,
    check("libraries valid", libraryValidation.valid, libraryValidation.failures.join("; ") || "Libraries must match approved NS-REM-001 content."),
    check("pattern integrity", patternAllowed && structuralInstanceValidation.valid, structuralInstanceValidation.failures.join("; ") || "Pattern and instance must be approved."),
    check("target remainder integrity", targetRemainderAllowed, "Target remainder must satisfy 0 <= remainder < divisor for an approved divisor."),
    check("question language id", allowedQuestionIds.includes(questionPackage.questionLanguageId), "Question language ID must be approved for the CP."),
    check("explanation style id", allowedExplanationIds.includes(questionPackage.explanationStyleId), "Explanation style ID must be approved."),
    check("candidate generation", JSON.stringify(questionPackage.parameters.candidateDomain) === JSON.stringify(expectedCandidateSet), "Candidate domain must follow leading zero policy."),
    check("valid value set", JSON.stringify(questionPackage.solver.validValueSet) === JSON.stringify(expectedValidSet), "Valid value set must be derived from candidate evaluations."),
    check(
      "question language rendered from library",
      isRenderedQuestionLanguage({
        canonicalProblemId: questionPackage.canonicalProblemId,
        questionLanguageId: questionPackage.questionLanguageId,
        stem: questionPackage.stem,
        numberExpression: questionPackage.parameters.numberExpression,
        divisor: questionPackage.parameters.divisor,
        targetRemainder: questionPackage.parameters.targetRemainder,
      }),
      "Stem must render exactly from the approved question language library.",
    ),
    check("question includes number", questionPackage.stem.includes(questionPackage.parameters.numberExpression), "Rendered stem must include the concrete number expression."),
    check("question includes divisor", questionPackage.stem.includes(String(questionPackage.parameters.divisor)), "Rendered stem must include the divisor."),
    check(
      "question includes target remainder",
      questionPackage.stem.includes(String(questionPackage.parameters.targetRemainder)),
      "Rendered stem must include the target remainder.",
    ),
    check("explanation consumes graph", questionPackage.explanation.graphId === questionPackage.reasoningGraph.graphId, "Explanation must consume reasoning graph output."),
    check("explanation consistency", explanationText.includes(questionPackage.solver.validValueSet.join(", ")) && explanationText.includes(String(questionPackage.answer)), "Explanation must include graph-derived valid set and answer."),
    check("traceability", Boolean(questionPackage.questionId && questionPackage.patternId && questionPackage.instanceId && questionPackage.difficultyBand), "Question ID, Pattern ID, Instance ID, and Difficulty Band must be present."),
    check("final answer", questionPackage.answer === questionPackage.solver.answer, "Final answer must match solver output."),
    check("no placeholder question text", !containsForbiddenRuntimePlaceholder(questionPackage.stem), "Rendered stem must not contain placeholders."),
    check("no placeholder explanation text", !containsForbiddenRuntimePlaceholder(explanationText), "Rendered explanation must not contain placeholders."),
  ];
  return { valid: checks.every((item) => item.passed), checks };
}

export const validateCp001QuestionPackage = validateNsRem001QuestionPackage;
export const validateCp002QuestionPackage = validateNsRem001QuestionPackage;
export const validateCp003QuestionPackage = validateNsRem001QuestionPackage;
export const validateCp004QuestionPackage = validateNsRem001QuestionPackage;
export const validateCp005QuestionPackage = validateNsRem001QuestionPackage;
export const validateCp006QuestionPackage = validateNsRem001QuestionPackage;
export const validateCp007QuestionPackage = validateNsRem001QuestionPackage;
