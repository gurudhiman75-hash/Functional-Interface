import { gcd, mathJaxPresent, reduceRatio } from "./math";
import { validateNsCop001Libraries } from "./library";
import type { NsCop001QuestionPackage, NsCop001SolverResult } from "./types";

export function validateNsCop001AnswerContract(solver: NsCop001SolverResult) {
  const checks = [
    check("input-valid", solver.verification.inputValid, "Inputs must be positive integers."),
    check("answer-rule", solver.verification.answerRuleSatisfied, "Answer must satisfy CP rule."),
    check("mathjax-valid", solver.verification.mathJaxValid, "All MathJax fields must be present."),
  ];
  return { valid: checks.every((item) => item.passed), checks };
}

export function validateNsCop001QuestionPackage(questionPackage: NsCop001QuestionPackage) {
  const libraryValidation = validateNsCop001Libraries();
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

function validateAnswer(questionPackage: NsCop001QuestionPackage) {
  const p = questionPackage.parameters;
  if (questionPackage.canonicalProblemId === "CP-003") return questionPackage.solver.validCandidates.length === 1 && questionPackage.answer === questionPackage.solver.validCandidates[0];
  if (questionPackage.canonicalProblemId === "CP-006") return questionPackage.answer === reduceRatio(p.a ?? 1, p.b ?? 1).ratio;
  if (questionPackage.canonicalProblemId === "CP-005") return questionPackage.answer === 1 || questionPackage.answer === "1";
  if (questionPackage.canonicalProblemId === "CP-001" && p.cp001AnswerType === "hcfValue") return questionPackage.answer === gcd(p.a ?? 1, p.b ?? 1);
  return questionPackage.solver.verification.answerRuleSatisfied;
}

function check(name: string, passed: boolean, message: string) {
  return { name, passed, message };
}

function containsUnresolvedTemplatePlaceholder(text: string) {
  return ["answer", "a", "b", "hcf", "decisionText", "targetNumber", "number", "nextNumber", "hcfLatex", "coprimeCheckLatex", "candidateEvaluationLatex", "pairEvaluationLatex", "consecutivePropertyLatex", "ratioReductionLatex"].some((placeholder) => text.includes(`{${placeholder}}`));
}
