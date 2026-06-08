import { containsForbiddenRuntimePlaceholder, parameterValues } from "./language-contract";
import {
  assertCanonicalProblemActive,
  getExplanationFamily,
  getQuestionLanguageEntries,
  isRenderedQuestionLanguage,
  requiredVisibleFields,
  validateNsRem002Libraries,
} from "./library";
import {
  NS_REM_002_ARCHETYPE_ID,
  type NsRem002QuestionPackage,
  type NsRem002ReasoningGraph,
  type NsRem002SolverResult,
  type NsRem002ValidationResult,
} from "./types";

function check(name: string, passed: boolean, message: string) {
  return { name, passed, message };
}

export function validateNsRem002AnswerContract(solver: NsRem002SolverResult, graph: NsRem002ReasoningGraph): NsRem002ValidationResult {
  const answerNode = graph.nodes.find((node) => node.id === graph.answerNodeId);
  const extractionNode = graph.nodes.find((node) => node.type === "Answer Extraction");
  const checks = [
    check("archetype ownership", solver.archetypeId === NS_REM_002_ARCHETYPE_ID && graph.archetypeId === NS_REM_002_ARCHETYPE_ID, "Solver and graph must belong to NS-REM-002."),
    check("canonical problem ownership", solver.canonicalProblemId === graph.canonicalProblemId, "Solver and graph must target the same CP."),
    check("reasoning pattern agreement", solver.reasoningPatternId === graph.reasoningPatternId, "Solver and graph must use the same reasoning pattern."),
    check("graph answer agreement", answerNode?.outputs.answer === solver.answer, "Graph final answer must match solver answer."),
    check("answer extraction agreement", extractionNode?.outputs.answer === solver.answer, "Graph answer extraction must match solver answer."),
    check("equation consistency", solver.verification.equationConsistent, "Division equation must be consistent when equation values are present."),
    check("remainder validity", solver.verification.remainderValid, "Remainder must satisfy 0 <= remainder < divisor where applicable."),
    check("range validity", solver.verification.rangeValid, "Range CPs must have valid bounds and at least one valid number."),
    check("answer rule", solver.verification.answerRuleSatisfied, "Answer must satisfy the CP-specific rule."),
  ];
  return { valid: checks.every((item) => item.passed), checks };
}

export function validateNsRem002QuestionPackage(questionPackage: NsRem002QuestionPackage): NsRem002ValidationResult {
  const answerValidation = validateNsRem002AnswerContract(questionPackage.solver, questionPackage.reasoningGraph);
  const libraryValidation = validateNsRem002Libraries();
  let cpActive = true;
  try {
    assertCanonicalProblemActive(questionPackage.canonicalProblemId);
  } catch {
    cpActive = false;
  }
  const qlEntries = getQuestionLanguageEntries(questionPackage.canonicalProblemId);
  const explanationFamily = getExplanationFamily(questionPackage.canonicalProblemId);
  const explanationText = questionPackage.explanation.lines.join("\n");
  const values = parameterValues(questionPackage.parameters);
  const requiredFields = requiredVisibleFields(questionPackage.canonicalProblemId);
  const checks = [
    ...answerValidation.checks,
    check("libraries valid", libraryValidation.valid, libraryValidation.failures.join("; ") || "Libraries must match approved NS-REM-002 package."),
    check("active CP", cpActive, "Only CP-001 through CP-009 may be used at runtime."),
    check("question language id", qlEntries.some((entry) => entry.id === questionPackage.questionLanguageId), "Question language ID must be approved for the CP."),
    check("explanation style id", explanationFamily.entries.some((entry) => entry.id === questionPackage.explanationStyleId), "Explanation style ID must be approved for the CP topology."),
    check("explanation family id", questionPackage.explanation.familyId === explanationFamily.familyId, "Explanation family must match CP topology."),
    check(
      "question language rendered from library",
      isRenderedQuestionLanguage({
        canonicalProblemId: questionPackage.canonicalProblemId,
        questionLanguageId: questionPackage.questionLanguageId,
        stem: questionPackage.stem,
        values,
      }),
      "Question must render exactly from the approved library.",
    ),
    ...requiredFields.map((field) => {
      const value = values[field];
      return check(`question includes ${field}`, typeof value === "number" && questionPackage.stem.includes(String(value)), `Rendered question must include ${field}.`);
    }),
    check("explanation consumes graph", questionPackage.explanation.graphId === questionPackage.reasoningGraph.graphId, "Explanation must consume graph output."),
    check("explanation consistency", explanationText.includes(String(questionPackage.answer)), "Explanation must include final answer."),
    check("traceability", Boolean(questionPackage.questionId && questionPackage.questionLanguageId && questionPackage.explanationStyleId && questionPackage.difficultyBand), "Traceability fields must be present."),
    check("final answer", questionPackage.answer === questionPackage.solver.answer, "Final answer must match solver output."),
    check("no placeholder question text", !containsForbiddenRuntimePlaceholder(questionPackage.stem), "Rendered question must not contain placeholders."),
    check("no placeholder explanation text", !containsForbiddenRuntimePlaceholder(explanationText), "Rendered explanation must not contain placeholders."),
  ];
  return { valid: checks.every((item) => item.passed), checks };
}

export const validateCp001AnswerContract = validateNsRem002AnswerContract;
export const validateCp002AnswerContract = validateNsRem002AnswerContract;
export const validateCp003AnswerContract = validateNsRem002AnswerContract;
export const validateCp004AnswerContract = validateNsRem002AnswerContract;
export const validateCp005AnswerContract = validateNsRem002AnswerContract;
export const validateCp006AnswerContract = validateNsRem002AnswerContract;
export const validateCp007AnswerContract = validateNsRem002AnswerContract;
export const validateCp008AnswerContract = validateNsRem002AnswerContract;
export const validateCp009AnswerContract = validateNsRem002AnswerContract;

export const validateCp001QuestionPackage = validateNsRem002QuestionPackage;
export const validateCp002QuestionPackage = validateNsRem002QuestionPackage;
export const validateCp003QuestionPackage = validateNsRem002QuestionPackage;
export const validateCp004QuestionPackage = validateNsRem002QuestionPackage;
export const validateCp005QuestionPackage = validateNsRem002QuestionPackage;
export const validateCp006QuestionPackage = validateNsRem002QuestionPackage;
export const validateCp007QuestionPackage = validateNsRem002QuestionPackage;
export const validateCp008QuestionPackage = validateNsRem002QuestionPackage;
export const validateCp009QuestionPackage = validateNsRem002QuestionPackage;
