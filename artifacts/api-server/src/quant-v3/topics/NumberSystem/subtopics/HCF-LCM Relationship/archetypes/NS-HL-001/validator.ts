import { hcfOf, lcmOf, mathJaxPresent } from "./math";
import { validateNsHl001Libraries } from "./library";
import type { NsHl001QuestionPackage, NsHl001SolverResult } from "./types";

export function validateNsHl001AnswerContract(solver: NsHl001SolverResult) {
  const checks = [
    check("input-valid", solver.verification.inputValid, "Inputs must be positive integers where present."),
    check("answer-rule", solver.verification.answerRuleSatisfied, "Answer must satisfy the CP answer rule."),
    check("mathjax-valid", solver.verification.mathJaxValid, "All MathJax fields must be present."),
  ];
  return { valid: checks.every((item) => item.passed), checks };
}

export function validateNsHl001QuestionPackage(questionPackage: NsHl001QuestionPackage) {
  const libraryValidation = validateNsHl001Libraries();
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

function validateAnswer(questionPackage: NsHl001QuestionPackage) {
  const p = questionPackage.parameters;
  switch (questionPackage.canonicalProblemId) {
    case "CP-001":
      return questionPackage.solver.verification.answerRuleSatisfied;
    case "CP-002":
      return questionPackage.answer === (questionPackage.solver.verification.divisibilityValid && questionPackage.solver.verification.productRelationValid && questionPackage.solver.verification.numberConsistencyValid ? "Valid" : "Invalid");
    case "CP-003":
    case "CP-004":
    case "CP-006":
      return Boolean(questionPackage.solver.answerPair) && (!p.hcf || hcfOf([questionPackage.solver.answerPair!.a, questionPackage.solver.answerPair!.b]) === p.hcf) && (!p.lcm || lcmOf([questionPackage.solver.answerPair!.a, questionPackage.solver.answerPair!.b]) === p.lcm);
    case "CP-005":
      return typeof questionPackage.answer === "number";
  }
}

function check(name: string, passed: boolean, message: string) {
  return { name, passed, message };
}

function containsUnresolvedTemplatePlaceholder(text: string) {
  return [
    "answer",
    "productRelationLatex",
    "divisibilityCheckLatex",
    "productRelationCheckLatex",
    "missingNumberFormulaLatex",
    "hcfVerificationLatex",
    "lcmVerificationLatex",
    "quotientLatex",
    "factorPairListLatex",
    "coprimePairFilterLatex",
    "conditionFilterLatex",
    "reconstructedPairLatex",
    "factorPairCountLatex",
    "orderedPairPolicyLatex",
    "unorderedPairPolicyLatex",
    "ratioReductionLatex",
    "ratioMultiplierLatex",
    "hcfMultiplierLatex",
    "lcmMultiplierLatex",
    "consistencyCheckLatex",
  ].some((placeholder) => text.includes(`{${placeholder}}`));
}
