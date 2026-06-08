import { factorCount, hcfOf, mathJaxPresent } from "./math";
import { validateNsHcf001Libraries } from "./library";
import { validCp003Candidates } from "./solver";
import type { NsHcf001QuestionPackage, NsHcf001SolverResult } from "./types";

export function validateNsHcf001AnswerContract(solver: NsHcf001SolverResult) {
  const checks = [
    check("input-valid", solver.verification.inputValid, "Inputs must be positive integers."),
    check("hcf-valid", solver.verification.hcfValid, "HCF must divide every number."),
    check("answer-rule", solver.verification.answerRuleSatisfied, "Answer must satisfy the CP answer rule."),
    check("mathjax-valid", solver.verification.mathJaxValid, "All MathJax fields must be present."),
  ];
  return { valid: checks.every((item) => item.passed), checks };
}

export function validateNsHcf001QuestionPackage(questionPackage: NsHcf001QuestionPackage) {
  const libraryValidation = validateNsHcf001Libraries();
  const checks = [
    check("libraries-valid", libraryValidation.valid, libraryValidation.failures.join("\n") || "Libraries are valid."),
    check("stem-rendered", !/\{[A-Za-z]+\}/.test(questionPackage.stem), "Stem must not contain unresolved placeholders."),
    check("explanation-rendered", !questionPackage.explanation.lines.join("\n").includes("{answer}"), "Explanation must render answer."),
    check("traceability-question", questionPackage.traceability.questionId === questionPackage.questionId, "Traceability questionId mismatch."),
    check("traceability-answer", questionPackage.traceability.answer === questionPackage.answer, "Traceability answer mismatch."),
    check("traceability-graph", questionPackage.traceability.graphId === questionPackage.reasoningGraph.graphId, "Traceability graph mismatch."),
    check("mathjax-present", mathJaxPresent(questionPackage), "MathJax fields missing."),
    check("answer-valid", validateAnswer(questionPackage), "Answer is invalid."),
  ];
  return { valid: checks.every((item) => item.passed), checks };
}

function validateAnswer(questionPackage: NsHcf001QuestionPackage) {
  switch (questionPackage.canonicalProblemId) {
    case "CP-001":
      return questionPackage.answer === hcfOf(questionPackage.numbers);
    case "CP-002":
      return questionPackage.answer === factorCount(hcfOf(questionPackage.numbers));
    case "CP-003": {
      const valid = validCp003Candidates(questionPackage.parameters);
      return valid.length === 1 && valid[0] === questionPackage.answer && questionPackage.answer === questionPackage.solver.missingNumber;
    }
    case "CP-004":
      return questionPackage.answer === hcfOf(questionPackage.numbers);
  }
}

function check(name: string, passed: boolean, message: string) {
  return { name, passed, message };
}
