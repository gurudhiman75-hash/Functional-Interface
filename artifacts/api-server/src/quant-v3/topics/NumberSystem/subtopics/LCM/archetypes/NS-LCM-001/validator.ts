import { countCommonMultiplesInRange, firstCommonMultipleGreaterThan, lcmOf, mathJaxPresent } from "./math";
import { validateNsLcm001Libraries } from "./library";
import { validCp003Candidates } from "./solver";
import type { NsLcm001QuestionPackage, NsLcm001SolverResult } from "./types";

export function validateNsLcm001AnswerContract(solver: NsLcm001SolverResult) {
  const checks = [
    check("input-valid", solver.verification.inputValid, "Inputs must be positive integers."),
    check("lcm-valid", solver.verification.lcmValid, "LCM must be divisible by every number."),
    check("answer-rule", solver.verification.answerRuleSatisfied, "Answer must satisfy the CP answer rule."),
    check("mathjax-valid", solver.verification.mathJaxValid, "All MathJax fields must be present."),
  ];
  return { valid: checks.every((item) => item.passed), checks };
}

export function validateNsLcm001QuestionPackage(questionPackage: NsLcm001QuestionPackage) {
  const libraryValidation = validateNsLcm001Libraries();
  const checks = [
    check("libraries-valid", libraryValidation.valid, libraryValidation.failures.join("\n") || "Libraries are valid."),
    check("stem-rendered", !/\{[A-Za-z]+\}/.test(questionPackage.stem), "Stem must not contain unresolved placeholders."),
    check("explanation-rendered", !containsUnresolvedTemplatePlaceholder(questionPackage.explanation.lines.join("\n")), "Explanation must not contain unresolved placeholders."),
    check("traceability-question", questionPackage.traceability.questionId === questionPackage.questionId, "Traceability questionId mismatch."),
    check("traceability-answer", questionPackage.traceability.answer === questionPackage.answer, "Traceability answer mismatch."),
    check("traceability-graph", questionPackage.traceability.graphId === questionPackage.reasoningGraph.graphId, "Traceability graph mismatch."),
    check("mathjax-present", mathJaxPresent(questionPackage), "MathJax fields missing."),
    check("answer-valid", validateAnswer(questionPackage), "Answer is invalid."),
  ];
  return { valid: checks.every((item) => item.passed), checks };
}

function validateAnswer(questionPackage: NsLcm001QuestionPackage) {
  switch (questionPackage.canonicalProblemId) {
    case "CP-001":
      return questionPackage.answer === lcmOf(questionPackage.numbers);
    case "CP-002":
      return questionPackage.answer === lcmOf(questionPackage.parameters.cycleLengths ?? questionPackage.numbers);
    case "CP-003": {
      const valid = validCp003Candidates(questionPackage.parameters);
      return valid.length === 1 && valid[0] === questionPackage.answer && questionPackage.answer === questionPackage.solver.missingNumber;
    }
    case "CP-004":
      return questionPackage.answer === countCommonMultiplesInRange(questionPackage.numbers, questionPackage.parameters.lowerBound ?? 1, questionPackage.parameters.upperBound ?? 1);
    case "CP-005":
      return questionPackage.answer === firstCommonMultipleGreaterThan(questionPackage.numbers, questionPackage.parameters.threshold ?? 0);
  }
}

function check(name: string, passed: boolean, message: string) {
  return { name, passed, message };
}

function containsUnresolvedTemplatePlaceholder(text: string) {
  return [
    "answer",
    "targetLcm",
    "threshold",
    "operandFactorizationLatex",
    "primeUnionLatex",
    "maximumExponentSelectionLatex",
    "lcmLatex",
    "synchronizationInterpretationLatex",
    "candidateEvaluationLatex",
    "rangeCountFormulaLatex",
    "thresholdSelectionFormulaLatex",
  ].some((placeholder) => text.includes(`{${placeholder}}`));
}
