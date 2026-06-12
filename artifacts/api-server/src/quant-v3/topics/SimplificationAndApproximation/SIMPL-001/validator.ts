import { getCoverageCategoriesForCp } from "./coverage-selector";
import { selectExplanationByEsId } from "./explanation-selector";
import { selectStemByQlId } from "./stem-selector";
import { solveSimpl001 } from "./solver";
import type { Simpl001QuestionPackage } from "./pipeline";

export interface Simpl001ValidationResult {
  valid: boolean;
  checks: readonly { name: string; passed: boolean; message: string }[];
}

export function validateSimpl001QuestionPackage(
  output: Simpl001QuestionPackage,
): Simpl001ValidationResult {
  const stem = selectStemByQlId(output.questionLanguageId);
  const explanation = selectExplanationByEsId(output.explanationId);
  const coverage = getCoverageCategoriesForCp(output.canonicalProblemId);
  const independent = solveSimpl001(output.parameters);
  const checks = [
    {
      name: "stemTraceability",
      passed: stem.text === output.stem && stem.cpId === output.canonicalProblemId,
      message: "Stem must come exactly from question-language.library.json.",
    },
    {
      name: "explanationTraceability",
      passed: output.explanation.text === explanation.text.replaceAll("{answer}", output.answer),
      message: "Explanation must come exactly from explanation.library.json.",
    },
    {
      name: "answerVerified",
      passed: independent.answer === output.answer,
      message: "Answer must match independent SIMPL-001 computation.",
    },
    {
      name: "coverageLinked",
      passed: coverage.includes(output.parameters.coverageCategory),
      message: "Coverage category must come from coverage-targets.library.json.",
    },
    {
      name: "reasoningGraphPresent",
      passed: output.reasoningGraph.nodes.some((node) => node.id === "answer"),
      message: "Reasoning graph must contain an answer node.",
    },
    {
      name: "mathJaxBalanced",
      passed: hasBalancedMath(output.answerLatex),
      message: "MathJax delimiters must be balanced.",
    },
  ];
  return { valid: checks.every((check) => check.passed), checks };
}

function hasBalancedMath(value: string): boolean {
  return (value.match(/\\\(/g)?.length ?? 0) === (value.match(/\\\)/g)?.length ?? 0);
}
