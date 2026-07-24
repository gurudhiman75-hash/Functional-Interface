import { buildQuantV4AnswerOptions } from "../../../../../shared/answers/option-generation";
import { renderMen001Explanation } from "./explanation-renderer";
import { getMen001QuestionEntry, renderMen001Template } from "./library";
import {
  generateMen001Parameters,
  type Men001ParameterInput,
} from "./parameter-generator";
import { buildMen001ReasoningGraph } from "./reasoning-graph";
import { solveMen001 } from "./solver";
import {
  MEN_001_PACKAGE_ID,
  type Men001ActiveCanonicalProblemId,
  type Men001QuestionPackage,
  type Men001SolverResult,
} from "./types";
import { validateMen001QuestionPackage } from "./validator";

function unitOption(value: number, unit: "cm" | "cm²") {
  return `${value} ${unit}`;
}

function symbolicAreaOption(coefficient: number, radicand = 3) {
  return `$$${coefficient}\\sqrt{${radicand}}\\,\\text{cm}^{2}$$`;
}

function buildMen001Distractors(solver: Men001SolverResult, solveMode: string) {
  const values = solver.workingValues;
  switch (solveMode) {
    case "findTriangleAreaBaseHeight":
      return [
        unitOption(Number(values.base) * Number(values.height), "cm²"),
        unitOption(Number(values.base) + Number(values.height), "cm²"),
        unitOption(Number(values.area) + Number(values.base), "cm²"),
      ];
    case "findMissingHeightFromAreaAndBase":
      return [
        unitOption(Number(values.area) / Number(values.base), "cm"),
        unitOption(Number(values.base), "cm"),
        unitOption(Number(values.height) + 2, "cm"),
      ];
    case "findTriangleAreaHeron":
      return [
        unitOption(
          Number(values.sideA) + Number(values.sideB) + Number(values.sideC),
          "cm²",
        ),
        unitOption(Number(values.semiperimeter), "cm²"),
        unitOption(Number(values.radicand), "cm²"),
      ];
    case "findRightTriangleAreaFromLegs":
      return [
        unitOption(Number(values.legA) * Number(values.legB), "cm²"),
        unitOption(Number(values.legA) + Number(values.legB), "cm²"),
        unitOption(Number(values.area) + Number(values.legA), "cm²"),
      ];
    case "findEquilateralTriangleArea": {
      const coefficient = Number(values.coefficient);
      const side = Number(values.side);
      return [
        unitOption(coefficient, "cm²"),
        symbolicAreaOption(side * side),
        symbolicAreaOption(Math.max(1, coefficient * 2)),
      ];
    }
    default:
      return [];
  }
}

export function runMen001Pipeline(
  cpId: Men001ActiveCanonicalProblemId,
  input: Men001ParameterInput = {},
): Men001QuestionPackage {
  const parameters = generateMen001Parameters(cpId, input);
  const entry = getMen001QuestionEntry(parameters.questionLanguageId);
  const stem = renderMen001Template(entry.template, parameters.renderVariables);
  const solver = solveMen001(parameters);
  const reasoningGraph = buildMen001ReasoningGraph(parameters, solver);
  const explanation = renderMen001Explanation(parameters, solver, reasoningGraph);
  const optionResult = buildQuantV4AnswerOptions(solver.canonicalAnswer, {
    seed: `${parameters.seed}:${parameters.questionLanguageId}:options`,
    optionCount: 4,
    existingOptions: buildMen001Distractors(solver, parameters.solveMode),
    context: {
      packageId: MEN_001_PACKAGE_ID,
      canonicalProblemId: cpId,
      questionLanguageId: parameters.questionLanguageId,
      taskKind: parameters.taskKind,
      answerType: parameters.answerDimension,
      difficulty: parameters.difficulty,
      stem,
      variables: parameters.renderVariables,
    },
  });
  const mathematicalFingerprint = [
    parameters.solveMode,
    ...Object.entries(parameters.values)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, value]) => `${key}=${value}`),
  ].join("|");

  const basePackage: Omit<Men001QuestionPackage, "validation"> = {
    packageId: MEN_001_PACKAGE_ID,
    archetypeId: MEN_001_PACKAGE_ID,
    canonicalProblemId: cpId,
    questionId: parameters.questionId,
    questionLanguageId: parameters.questionLanguageId,
    language: "en",
    difficultyBand: parameters.difficulty,
    taskKind: parameters.taskKind,
    solveMode: parameters.solveMode,
    stem,
    options: optionResult.options,
    correctIndex: optionResult.correct,
    answer: solver.answer,
    parameters,
    solver,
    reasoningGraph,
    explanation,
    maturity: "RUNTIME_PROOF",
    publiclyPublishable: false,
    mathematicalFingerprint,
    traceability: {
      packageId: MEN_001_PACKAGE_ID,
      canonicalProblemId: cpId,
      questionLanguageId: parameters.questionLanguageId,
      explanationStrategyId: entry.explanationStrategyId,
      distractorStrategyIds: entry.distractorStrategyIds,
      diagramRequirement: entry.diagramRequirement,
      answerDimension: entry.answerDimension,
      unitPolicy: entry.unitPolicy,
      seed: parameters.seed,
    },
  };
  const validation = validateMen001QuestionPackage(basePackage);
  return { ...basePackage, validation };
}

export const runMen001Cp001Pipeline = (input: Men001ParameterInput = {}) =>
  runMen001Pipeline("MEN-CP-001", input);
