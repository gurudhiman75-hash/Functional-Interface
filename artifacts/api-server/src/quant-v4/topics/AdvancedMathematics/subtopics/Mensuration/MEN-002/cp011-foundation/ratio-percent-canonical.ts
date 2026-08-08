import {
  MEN_CP011_RATIO_PERCENT_AUTHORITY,
  MEN_CP011_RATIO_PERCENT_PROTOTYPES,
  auditMenCp011RatioPercentBatch as auditDraftBatch,
  generateMenCp011RatioPercentQuestion as generateDraftQuestion,
  generateMenCp011RatioPercentReviewBatch as generateDraftReviewBatch,
  getMenCp011RatioPercentDefinition,
  getMenCp011RatioPercentPrototypeIds,
  type MenCp011RatioPercentGenerationConstraints,
  type MenCp011RatioPercentPackage,
  type MenCp011RatioPercentPrototypeId,
} from "./ratio-percent.ts";

export const MEN_CP011_RATIO_PERCENT_PRESENTATION_AUTHORITY =
  "MEN-CP011-RATIO-PERCENT-MATHJAX-REPAIR-V1" as const;

export {
  MEN_CP011_RATIO_PERCENT_AUTHORITY,
  MEN_CP011_RATIO_PERCENT_PROTOTYPES,
  getMenCp011RatioPercentDefinition,
  getMenCp011RatioPercentPrototypeIds,
};

export type {
  MenCp011RatioPercentDefinition,
  MenCp011RatioPercentDiagram,
  MenCp011RatioPercentGenerationConstraints,
  MenCp011RatioPercentLearnerSolution,
  MenCp011RatioPercentLinearUnit,
  MenCp011RatioPercentOption,
  MenCp011RatioPercentPackage,
  MenCp011RatioPercentPrototypeId,
  MenCp011RatioPercentSolveMode,
  MenCp011RatioPercentState,
} from "./ratio-percent.ts";

function dimension(value: bigint, unit: "cm" | "m") {
  return `$${value}\\text{ ${unit}}$`;
}

function repairedStem(question: MenCp011RatioPercentPackage) {
  if (
    question.target !== "RATIO" ||
    !question.stem.includes("$(R,r,h)=")
  ) {
    return question.stem;
  }
  const state = question.state;
  return `Two hollow cylindrical pipes are compared. Pipe A has outer radius ${dimension(state.outerRadiusA!, state.unit)}, inner radius ${dimension(state.innerRadiusA!, state.unit)} and length ${dimension(state.lengthA!, state.unit)}. Pipe B has corresponding dimensions ${dimension(state.outerRadiusB!, state.unit)}, ${dimension(state.innerRadiusB!, state.unit)} and ${dimension(state.lengthB!, state.unit)}. Find the ratio of material volumes A:B.`;
}

function learnerText(question: MenCp011RatioPercentPackage) {
  return [
    question.stem,
    ...question.options.map((option) => option.display),
    question.answer,
    question.learnerSolution.formula,
    ...question.learnerSolution.steps,
    question.learnerSolution.finalAnswer,
    question.learnerSolution.shortcut,
    ...question.learnerSolution.wrongOptionAnalysis,
  ].join("\n");
}

function repairQuestion(
  draft: MenCp011RatioPercentPackage,
): MenCp011RatioPercentPackage {
  const stem = repairedStem(draft);
  const repairedBase: MenCp011RatioPercentPackage = {
    ...draft,
    stem,
  };
  const text = learnerText(repairedBase);
  const nonNestedCheck = {
    name: "non-nested learner MathJax",
    passed: !/\$\([^$]*\$/.test(stem),
    message:
      "A stem may contain multiple inline expressions, but one dollar-delimited expression must never contain another.",
  };
  const delimiterCheck = {
    name: "balanced learner MathJax delimiters",
    passed: (text.match(/\$/g) ?? []).length % 2 === 0,
    message:
      "Every learner-facing MathJax dollar delimiter must have a matching partner.",
  };
  const checks = [
    ...draft.validation.checks.filter(
      (check) =>
        check.name !== nonNestedCheck.name &&
        check.name !== delimiterCheck.name,
    ),
    nonNestedCheck,
    delimiterCheck,
  ];
  return {
    ...repairedBase,
    validation: {
      valid: checks.every((check) => check.passed),
      checks,
    },
  };
}

export function generateMenCp011RatioPercentQuestion(
  prototypeId: MenCp011RatioPercentPrototypeId,
  seed: string,
  constraints: MenCp011RatioPercentGenerationConstraints = {},
) {
  return repairQuestion(generateDraftQuestion(prototypeId, seed, constraints));
}

export function generateMenCp011RatioPercentReviewBatch() {
  const draft = generateDraftReviewBatch();
  return {
    ...draft,
    records: draft.records.map(repairQuestion),
  };
}

export function auditMenCp011RatioPercentBatch(
  records: readonly MenCp011RatioPercentPackage[],
) {
  return auditDraftBatch(records);
}
