import { getCoverageCategoriesForCp } from "./coverage-selector";
import { selectExplanationByEsId } from "./explanation-selector";
import { selectStemByQlId } from "./stem-selector";
import type { NsSurd001QuestionPackage } from "./pipeline";

export interface NsSurd001ValidationResult {
  valid: boolean;
  checks: readonly { name: string; passed: boolean; message: string }[];
}

export function validateNsSurd001QuestionPackage(
  output: NsSurd001QuestionPackage,
): NsSurd001ValidationResult {
  const stem = selectStemByQlId(output.questionLanguageId);
  const explanation = selectExplanationByEsId(output.explanationId);
  const coverage = getCoverageCategoriesForCp(output.canonicalProblemId);
  const checks = [
    {
      name: "stemTraceability",
      passed: stem.stem === output.stem && stem.cpId === output.canonicalProblemId,
      message: "Stem must come exactly from question-language.library.json.",
    },
    {
      name: "explanationTraceability",
      passed: output.explanation.lines.length === 1 && output.explanation.lines[0] === explanation.explanation,
      message: "Explanation must come exactly from explanation.library.json.",
    },
    {
      name: "answerPresent",
      passed: output.answer.length > 0,
      message: "Answer must be present.",
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
