import { buildQuantV4AnswerOptions } from "../../../../../shared/answers/option-generation";
import { renderMen001Explanation } from "./explanation-renderer";
import { getMen001QuestionEntry, renderMen001Template } from "./library";
import { generateMen001Parameters, type Men001ParameterInput } from "./parameter-generator";
import { buildMen001ReasoningGraph } from "./reasoning-graph";
import { solveMen001 } from "./solver";
import {
  MEN_001_PACKAGE_ID,
  type Men001ActiveCanonicalProblemId,
  type Men001QuestionPackage,
  type Men001SolverResult,
} from "./types";
import { validateMen001QuestionPackage } from "./validator";

function numericOption(value: number, solver: Men001SolverResult) {
  return solver.unit === "₹" ? `₹${value}` : `${value} ${solver.unit}`;
}

function symbolicAreaOption(coefficient: number, solver: Men001SolverResult, radicand = 3) {
  const latexUnit = solver.unit === "m²" ? "\\text{m}^{2}" : "\\text{cm}^{2}";
  return `$$${coefficient}\\sqrt{${radicand}}\\,${latexUnit}$$`;
}

function buildMen001Distractors(solver: Men001SolverResult, solveMode: string) {
  const values = solver.workingValues;
  switch (solveMode) {
    case "findTriangleAreaBaseHeight":
      return [
        numericOption(Number(values.base) * Number(values.height), solver),
        numericOption(Number(values.base) + Number(values.height), solver),
        numericOption(Number(values.area) + Number(values.base), solver),
      ];
    case "findMissingHeightFromAreaAndBase":
      return [
        numericOption(Number(values.area) / Number(values.base), solver),
        numericOption(Number(values.base), solver),
        numericOption(Number(values.height) + 2, solver),
      ];
    case "findMissingBaseFromAreaAndHeight":
      return [
        numericOption(Number(values.area) / Number(values.height), solver),
        numericOption(Number(values.height), solver),
        numericOption(Number(values.base) + 2, solver),
      ];
    case "findTriangleAreaHeron":
      return [
        numericOption(Number(values.sideA) + Number(values.sideB) + Number(values.sideC), solver),
        numericOption(Number(values.semiperimeter), solver),
        numericOption(Number(values.radicand), solver),
      ];
    case "findRightTriangleAreaFromLegs":
      return [
        numericOption(Number(values.legA) * Number(values.legB), solver),
        numericOption(Number(values.legA) + Number(values.legB), solver),
        numericOption(Number(values.area) + Number(values.legA), solver),
      ];
    case "findEquilateralTriangleArea": {
      const coefficient = Number(values.coefficient);
      const side = Number(values.side);
      return [
        numericOption(coefficient, solver),
        symbolicAreaOption(side * side, solver),
        symbolicAreaOption(Math.max(1, coefficient * 2), solver),
      ];
    }
    case "findEquilateralPerimeterFromArea":
      return [
        numericOption(Number(values.side), solver),
        numericOption(Number(values.side) * 2, solver),
        numericOption(Number(values.perimeter) + Number(values.side), solver),
      ];
    case "findEquilateralSideFromPerimeter":
      return [
        numericOption(Number(values.perimeter), solver),
        numericOption(Number(values.perimeter) / 2, solver),
        numericOption(Number(values.side) + 3, solver),
      ];
    case "findIsoscelesTriangleArea":
      return [
        numericOption((Number(values.base) * Number(values.equalSide)) / 2, solver),
        numericOption(Number(values.base) * Number(values.height), solver),
        numericOption(Number(values.base) + 2 * Number(values.equalSide), solver),
      ];
    case "findIsoscelesHeight":
      return [
        numericOption(Number(values.equalSide), solver),
        numericOption(Number(values.halfBase), solver),
        numericOption(Number(values.height) + 2, solver),
      ];
    case "findTriangleAreaFromSideRatioAndPerimeter":
      return [
        numericOption(Number(values.semiperimeter), solver),
        numericOption((Number(values.sideA) * Number(values.sideB)) / 2, solver),
        numericOption(Number(values.area) * 2, solver),
      ];
    case "findLargestTriangleSideFromRatioAndPerimeter":
    case "findSmallestTriangleSideFromRatioAndPerimeter":
      return [
        numericOption(Number(values.scale), solver),
        numericOption(Number(values.sideB), solver),
        numericOption(Number(values.targetSide) + Number(values.scale), solver),
      ];
    case "findTriangularPlotCost":
      return [
        numericOption(Number(values.cost) * 2, solver),
        numericOption(Number(values.area), solver),
        numericOption(Number(values.cost) + Number(values.ratePerSquareMetre), solver),
      ];
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
    parameters.unitPolicy,
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
