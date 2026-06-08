import { getQuestionLanguageEntries, mathJaxKeys, renderQuestionLanguage, requiredVisibleFields, validateNsFac001Libraries } from "./library";
import { buildFactorModel, factorsDivisibleBy, positionClass } from "./math";
import type { NsFac001QuestionPackage, NsFac001ReasoningGraph, NsFac001SolverResult, NsFac001ValidationResult } from "./types";

export function validateNsFac001AnswerContract(solver: NsFac001SolverResult, reasoningGraph: NsFac001ReasoningGraph): NsFac001ValidationResult {
  const graphAnswer = reasoningGraph.nodes.find((node) => node.id === reasoningGraph.answerNodeId)?.outputs.answer;
  return result([
    check("graph-answer", graphAnswer === solver.answer, "Graph answer must equal solver answer."),
    check("solver-verification", Object.values(solver.verification).every(Boolean), "Solver verification flags must all pass."),
    check("mathjax-generation", mathJaxKeys().every((key) => Boolean(solver[key]) && Boolean(reasoningGraph[key])), "All MathJax fields must be present."),
  ]);
}

export function validateNsFac001QuestionPackage(questionPackage: NsFac001QuestionPackage): NsFac001ValidationResult {
  const p = questionPackage.parameters;
  const libraryValidation = validateNsFac001Libraries();
  const checks = [
    check("library-validation", libraryValidation.valid, libraryValidation.failures.join("; ") || "Libraries are valid."),
    check("question-id", questionPackage.questionId === p.questionId, "Question ID must be consistent."),
    check("cp-id", questionPackage.canonicalProblemId === p.canonicalProblemId, "CP ID must be consistent."),
    check("question-language-id", getQuestionLanguageEntries(p.canonicalProblemId).some((entry) => entry.id === questionPackage.questionLanguageId), "Question language ID must be approved."),
    check("stem-rendered", renderQuestionLanguage({ canonicalProblemId: p.canonicalProblemId, questionLanguageId: questionPackage.questionLanguageId, values: renderValues(p) }) === questionPackage.stem, "Question must render from approved library."),
    check("stem-placeholders", !questionPackage.stem.includes("{"), "Stem must not have unresolved placeholders."),
    check("visible-fields", requiredVisibleFields(p.canonicalProblemId).every((field) => questionPackage.stem.includes(String(renderValues(p)[field]))), "Stem must display required variables."),
    check("explanation-answer", questionPackage.explanation.lines.join("\n").includes(String(questionPackage.answer)), "Explanation must include answer."),
    check("graph-answer", questionPackage.reasoningGraph.nodes.find((node) => node.id === questionPackage.reasoningGraph.answerNodeId)?.outputs.answer === questionPackage.answer, "Graph answer must match final answer."),
    check("traceability", questionPackage.traceability.answer === questionPackage.answer && questionPackage.traceability.graphId === questionPackage.reasoningGraph.graphId, "Traceability must preserve answer and graph ID."),
    check("mathjax-fields", mathJaxKeys().every((key) => Boolean(questionPackage[key]) && Boolean(questionPackage.traceability[key])), "All MathJax fields must be present."),
    ...cpChecks(questionPackage),
  ];
  return result(checks);
}

function cpChecks(questionPackage: NsFac001QuestionPackage) {
  const p = questionPackage.parameters;
  const model = buildFactorModel(p.number, p.k, p.position);
  switch (p.canonicalProblemId) {
    case "CP-001":
      return [check("cp001-factor-count", questionPackage.answer === model.factorCount, "CP-001 must answer factorCount.")];
    case "CP-002":
      return [check("cp002-factor-sum", questionPackage.answer === model.factorSum, "CP-002 must answer factorSum.")];
    case "CP-003":
      return [
        check("cp003-product-string", questionPackage.answer === model.factorProductString, "CP-003 must answer factorProductString."),
        check("cp003-bigint-string", typeof questionPackage.answer === "string" && /^\d+$/.test(questionPackage.answer), "CP-003 answer must be exact decimal string."),
        check("cp003-product-digits", questionPackage.productDigitCount === model.factorProductString.length, "CP-003 productDigitCount must match answer length."),
      ];
    case "CP-004":
      return [check("cp004-parity", questionPackage.answer === (model.isPerfectSquare ? "Odd" : "Even"), "CP-004 must follow perfect square parity.")];
    case "CP-005":
      return [check("cp005-greatest-proper", questionPackage.answer === model.greatestProperFactor, "CP-005 must answer greatest proper factor.")];
    case "CP-006": {
      const k = required(p.k, "k");
      return [
        check("cp006-k-divides", p.number % k === 0, "CP-006 k must divide number."),
        check("cp006-count", questionPackage.answer === factorsDivisibleBy(model.factorList, k).length, "CP-006 must count factors divisible by k."),
      ];
    }
    case "CP-007": {
      const k = required(p.k, "k");
      const divisible = factorsDivisibleBy(model.factorList, k).length;
      return [
        check("cp007-k-divides", p.number % k === 0, "CP-007 k must divide number."),
        check("cp007-derived", questionPackage.answer === model.factorCount - divisible, "CP-007 must derive complement from factorCount minus divisible count."),
      ];
    }
    case "CP-008": {
      const position = required(p.position, "position");
      return [
        check("cp008-position", position <= model.factorCount, "CP-008 position must be within factorCount."),
        check("cp008-selected", questionPackage.answer === model.factorsIncreasing[position - 1], "CP-008 must select kth smallest factor."),
        check("cp008-position-class", questionPackage.solver.positionClass === positionClass(position, model.factorCount), "CP-008 must classify position coverage."),
      ];
    }
    case "CP-009": {
      const position = required(p.position, "position");
      return [
        check("cp009-position", position <= model.factorCount, "CP-009 position must be within factorCount."),
        check("cp009-selected", questionPackage.answer === model.factorsDecreasing[position - 1], "CP-009 must select kth largest factor."),
        check("cp009-position-class", questionPackage.solver.positionClass === positionClass(position, model.factorCount), "CP-009 must classify position coverage."),
      ];
    }
  }
}

function renderValues(parameters: NsFac001QuestionPackage["parameters"]) {
  return {
    number: parameters.number,
    k: parameters.k,
    position: parameters.position,
    ordinalDisplay: parameters.ordinalDisplay,
  };
}

function required(value: number | undefined, name: string) {
  if (typeof value !== "number") throw new Error(`Missing NS-FAC-001 value: ${name}`);
  return value;
}

function check(name: string, passed: boolean, message: string) {
  return { name, passed, message };
}

function result(checks: ReturnType<typeof check>[]) {
  return { valid: checks.every((item) => item.passed), checks };
}
