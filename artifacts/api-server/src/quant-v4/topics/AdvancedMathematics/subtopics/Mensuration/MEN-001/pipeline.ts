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
  const normalized = Number(value.toFixed(4));
  return solver.unit === "₹" ? `₹${normalized}` : `${normalized} ${solver.unit}`;
}

function numericCorrectValue(solver: Men001SolverResult) {
  return solver.canonicalAnswer.kind === "unit" || solver.canonicalAnswer.kind === "currency"
    ? solver.canonicalAnswer.value
    : null;
}

function numericDistractorOptions(
  solver: Men001SolverResult,
  candidates: readonly number[],
) {
  const correct = numericCorrectValue(solver);
  const values: number[] = [];
  for (const rawCandidate of candidates) {
    const candidate = Number(rawCandidate.toFixed(4));
    if (!Number.isFinite(candidate) || candidate <= 0) continue;
    if (correct !== null && Math.abs(candidate - correct) < 1e-9) continue;
    if (values.some((existing) => Math.abs(existing - candidate) < 1e-9)) continue;
    values.push(candidate);
  }
  if (values.length < 3) {
    throw new Error(
      `MEN-001 could not build three misconception distractors for ${solver.equation}.`,
    );
  }
  return values.map((value) => numericOption(value, solver));
}

function symbolicAreaOption(coefficient: number, solver: Men001SolverResult, radicand = 3) {
  const latexUnit = solver.unit === "m²" ? "\\text{m}^{2}" : "\\text{cm}^{2}";
  return `$$${coefficient}\\sqrt{${radicand}}\\,${latexUnit}$$`;
}

function heronArea(a: number, b: number, c: number) {
  const semiperimeter = (a + b + c) / 2;
  return Math.sqrt(
    semiperimeter *
      (semiperimeter - a) *
      (semiperimeter - b) *
      (semiperimeter - c),
  );
}

function buildMen001Distractors(solver: Men001SolverResult, solveMode: string) {
  const values = solver.workingValues;
  switch (solveMode) {
    case "findTriangleAreaBaseHeight": {
      const base = Number(values.base);
      const height = Number(values.height);
      return numericDistractorOptions(solver, [
        base * height,
        (base * base) / 2,
        (height * height) / 2,
        base + height,
      ]);
    }
    case "findMissingHeightFromAreaAndBase": {
      const area = Number(values.area);
      const base = Number(values.base);
      return numericDistractorOptions(solver, [
        area / base,
        base,
        2 * base,
        area / 2,
      ]);
    }
    case "findMissingBaseFromAreaAndHeight": {
      const area = Number(values.area);
      const height = Number(values.height);
      return numericDistractorOptions(solver, [
        area / height,
        height,
        2 * height,
        area / 2,
      ]);
    }
    case "findTriangleAreaHeron": {
      const sideA = Number(values.sideA);
      const sideB = Number(values.sideB);
      const sideC = Number(values.sideC);
      const perimeter = sideA + sideB + sideC;
      return numericDistractorOptions(solver, [
        Number(values.semiperimeter),
        perimeter,
        (sideA * sideC) / 2,
        (sideB * sideC) / 2,
        (sideA * sideB) / 2,
        Number(values.area) * 2,
      ]);
    }
    case "findRightTriangleAreaFromLegs": {
      const legA = Number(values.legA);
      const legB = Number(values.legB);
      return numericDistractorOptions(solver, [
        legA * legB,
        (legA * legA) / 2,
        (legB * legB) / 2,
        legA + legB,
      ]);
    }
    case "findEquilateralTriangleArea": {
      const coefficient = Number(values.coefficient);
      const side = Number(values.side);
      return [
        numericOption(coefficient, solver),
        symbolicAreaOption(side * side, solver),
        symbolicAreaOption(Math.max(1, coefficient * 2), solver),
      ];
    }
    case "findEquilateralPerimeterFromArea": {
      const side = Number(values.side);
      return numericDistractorOptions(solver, [side, 2 * side, 4 * side, 6 * side]);
    }
    case "findEquilateralSideFromPerimeter": {
      const perimeter = Number(values.perimeter);
      return numericDistractorOptions(solver, [
        perimeter,
        perimeter / 2,
        perimeter / 4,
        perimeter / 6,
      ]);
    }
    case "findIsoscelesTriangleArea": {
      const base = Number(values.base);
      const equalSide = Number(values.equalSide);
      const height = Number(values.height);
      const area = Number(values.area);
      return numericDistractorOptions(solver, [
        (base * equalSide) / 2,
        base * height,
        area / 2,
        base + 2 * equalSide,
      ]);
    }
    case "findIsoscelesHeight": {
      const equalSide = Number(values.equalSide);
      const halfBase = Number(values.halfBase);
      const base = Number(values.base);
      return numericDistractorOptions(solver, [
        equalSide,
        halfBase,
        base,
        equalSide - halfBase,
      ]);
    }
    case "findTriangleAreaFromSideRatioAndPerimeter": {
      const ratioA = Number(values.ratioA);
      const ratioB = Number(values.ratioB);
      const ratioC = Number(values.ratioC);
      return numericDistractorOptions(solver, [
        heronArea(ratioA, ratioB, ratioC),
        Number(values.semiperimeter),
        Number(values.area) * 2,
        Number(values.perimeter),
        (Number(values.sideA) * Number(values.sideC)) / 2,
      ]);
    }
    case "findLargestTriangleSideFromRatioAndPerimeter":
      return numericDistractorOptions(solver, [
        Number(values.sideA),
        Number(values.sideB),
        Number(values.scale),
        Number(values.perimeter) / 3,
        Number(values.ratioC),
      ]);
    case "findSmallestTriangleSideFromRatioAndPerimeter":
      return numericDistractorOptions(solver, [
        Number(values.sideB),
        Number(values.sideC),
        Number(values.scale),
        Number(values.perimeter) / 3,
        Number(values.ratioA),
      ]);
    case "findTriangularPlotCost": {
      const base = Number(values.base);
      const height = Number(values.height);
      const rate = Number(values.ratePerSquareMetre);
      const cost = Number(values.cost);
      return numericDistractorOptions(solver, [
        2 * cost,
        Number(values.area),
        rate * (base + height),
        rate * base,
        rate * height,
      ]);
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
