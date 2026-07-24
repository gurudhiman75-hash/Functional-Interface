import type {
  Men001Parameters,
  Men001QuestionLanguageEntry,
  Men001SolverResult,
} from "./types";

type DistractorContext = {
  parameters: Men001Parameters;
  solver: Men001SolverResult;
};

type DistractorStrategy = (context: DistractorContext) => string;

function number(value: unknown) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) throw new Error(`MEN-001 distractor requires a finite number; received ${String(value)}.`);
  return parsed;
}

function formatted(value: number) {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));
}

function numericOption(value: number, solver: Men001SolverResult) {
  if (!Number.isFinite(value) || value <= 0) throw new Error(`MEN-001 distractor produced invalid value ${value}.`);
  return solver.unit === "₹" ? `₹${formatted(value)}` : `${formatted(value)} ${solver.unit}`;
}

function symbolicAreaOption(coefficient: number, solver: Men001SolverResult) {
  const latexUnit = solver.unit === "m²" ? "\\text{m}^{2}" : "\\text{cm}^{2}";
  return `$$${formatted(coefficient)}\\sqrt{3}\\,${latexUnit}$$`;
}

function correctNumericValue(solver: Men001SolverResult) {
  if (solver.canonicalAnswer.kind === "symbolic") {
    throw new Error("MEN-001 symbolic answer requires a symbolic distractor strategy.");
  }
  return solver.canonicalAnswer.value;
}

export const MEN_001_DISTRACTOR_STRATEGIES = {
  "omit-half-factor": ({ solver }: DistractorContext) => numericOption(correctNumericValue(solver) * 2, solver),
  "use-base-as-both-dimensions": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.base) ** 2 / 2, solver),
  "use-height-as-both-dimensions": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.height) ** 2 / 2, solver),
  "omit-double-area": ({ solver }: DistractorContext) => numericOption(correctNumericValue(solver) / 2, solver),
  "divide-area-by-double-base": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.area) / (2 * number(solver.workingValues.base)), solver),
  "halve-given-base": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.base) / 2, solver),
  "divide-area-by-double-height": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.area) / (2 * number(solver.workingValues.height)), solver),
  "halve-given-height": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.height) / 2, solver),
  "use-semiperimeter-as-area": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.semiperimeter), solver),
  "square-semiperimeter": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.semiperimeter) ** 2, solver),
  "use-partial-heron-product": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.semiperimeter) * number(solver.workingValues.factorA), solver),
  "use-first-leg-as-both-dimensions": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.legA) ** 2 / 2, solver),
  "use-second-leg-as-both-dimensions": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.legB) ** 2 / 2, solver),
  "omit-root-three": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.coefficient), solver),
  "omit-quarter-factor": ({ solver }: DistractorContext) => symbolicAreaOption(number(solver.workingValues.side) ** 2, solver),
  "use-half-instead-of-quarter": ({ solver }: DistractorContext) => symbolicAreaOption(number(solver.workingValues.coefficient) * 2, solver),
  "report-side-only": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.side), solver),
  "double-side-instead-of-triple": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.side) * 2, solver),
  "quadruple-side-instead-of-triple": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.side) * 4, solver),
  "retain-perimeter": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.perimeter), solver),
  "divide-by-two": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.perimeter) / 2, solver),
  "divide-by-six": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.perimeter) / 6, solver),
  "use-equal-side-as-height": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.base) * number(solver.workingValues.equalSide) / 2, solver),
  "use-half-base-as-height": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.base) * number(solver.workingValues.halfBase) / 2, solver),
  "retain-equal-side": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.equalSide), solver),
  "use-half-base": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.halfBase), solver),
  "subtract-half-base": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.equalSide) - number(solver.workingValues.halfBase), solver),
  "omit-scale-square": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.area) / number(solver.workingValues.scale) ** 2, solver),
  "halve-heron-area": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.area) / 2, solver),
  "double-heron-area": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.area) * 2, solver),
  "report-scale-factor": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.scale), solver),
  "choose-largest-side": ({ solver }: DistractorContext) => numericOption(Math.max(number(solver.workingValues.sideA), number(solver.workingValues.sideB), number(solver.workingValues.sideC)), solver),
  "choose-smallest-side": ({ solver }: DistractorContext) => numericOption(Math.min(number(solver.workingValues.sideA), number(solver.workingValues.sideB), number(solver.workingValues.sideC)), solver),
  "multiply-rate-by-base-only": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.ratePerSquareMetre) * number(solver.workingValues.base), solver),
  "multiply-rate-by-height-only": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.ratePerSquareMetre) * number(solver.workingValues.height), solver),

  "add-rectangle-dimensions-as-area": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.length) + number(solver.workingValues.breadth), solver),
  "square-rectangle-length": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.length) ** 2, solver),
  "square-rectangle-breadth": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.breadth) ** 2, solver),
  "single-length-plus-breadth": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.length) + number(solver.workingValues.breadth), solver),
  "double-rectangle-length": ({ solver }: DistractorContext) => numericOption(2 * number(solver.workingValues.length), solver),
  "double-rectangle-breadth": ({ solver }: DistractorContext) => numericOption(2 * number(solver.workingValues.breadth), solver),
  "divide-area-by-double-breadth": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.area) / (2 * number(solver.workingValues.breadth)), solver),
  "retain-rectangle-breadth": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.breadth), solver),
  "halve-rectangle-length": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.length) / 2, solver),
  "subtract-length-without-halving-perimeter": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.perimeter) - number(solver.workingValues.length), solver),
  "quarter-rectangle-perimeter": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.perimeter) / 4, solver),
  "halve-known-rectangle-length": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.length) / 2, solver),
  "use-half-perimeter-as-area": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.perimeter) / 2, solver),
  "multiply-length-by-half-perimeter": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.length) * number(solver.workingValues.perimeter) / 2, solver),
  "square-recovered-breadth": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.breadth) ** 2, solver),
  "subtract-diagonal-and-side": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.diagonal) - number(solver.workingValues.length), solver),
  "use-pythagorean-sum": ({ solver }: DistractorContext) => numericOption(Math.sqrt(number(solver.workingValues.diagonal) ** 2 + number(solver.workingValues.length) ** 2), solver),
  "halve-rectangle-diagonal": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.diagonal) / 2, solver),

  "use-square-perimeter-as-area": ({ solver }: DistractorContext) => numericOption(4 * number(solver.workingValues.side), solver),
  "use-double-side-as-area": ({ solver }: DistractorContext) => numericOption(2 * number(solver.workingValues.side), solver),
  "halve-square-area": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.area) / 2, solver),
  "use-square-area-as-perimeter": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.side) ** 2, solver),
  "double-square-side": ({ solver }: DistractorContext) => numericOption(2 * number(solver.workingValues.side), solver),
  "triple-square-side": ({ solver }: DistractorContext) => numericOption(3 * number(solver.workingValues.side), solver),
  "quarter-square-area": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.area) / 4, solver),
  "half-square-area": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.area) / 2, solver),
  "root-half-square-area": ({ solver }: DistractorContext) => numericOption(Math.sqrt(number(solver.workingValues.area) / 2), solver),
  "use-full-diagonal-square": ({ solver }: DistractorContext) => numericOption(2 * number(solver.workingValues.diagonalCoefficient) ** 2, solver),
  "halve-diagonal-coefficient-square": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.diagonalCoefficient) ** 2 / 2, solver),
  "use-four-diagonal-coefficients-as-area": ({ solver }: DistractorContext) => numericOption(4 * number(solver.workingValues.diagonalCoefficient), solver),
  "report-diagonal-coefficient-as-perimeter": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.diagonalCoefficient), solver),
  "double-diagonal-coefficient": ({ solver }: DistractorContext) => numericOption(2 * number(solver.workingValues.diagonalCoefficient), solver),
  "eight-diagonal-coefficients": ({ solver }: DistractorContext) => numericOption(8 * number(solver.workingValues.diagonalCoefficient), solver),

  "halve-parallelogram-area": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.area) / 2, solver),
  "square-parallelogram-base": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.base) ** 2, solver),
  "square-parallelogram-height": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.height) ** 2, solver),
  "divide-parallelogram-area-by-double-base": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.area) / (2 * number(solver.workingValues.base)), solver),
  "retain-parallelogram-base": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.base), solver),
  "halve-parallelogram-height": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.height) / 2, solver),
  "divide-parallelogram-area-by-double-height": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.area) / (2 * number(solver.workingValues.height)), solver),
  "retain-parallelogram-height": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.height), solver),
  "halve-parallelogram-base": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.base) / 2, solver),
  "single-adjacent-side-sum": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.base) + number(solver.workingValues.adjacentSide), solver),
  "double-parallelogram-base": ({ solver }: DistractorContext) => numericOption(2 * number(solver.workingValues.base), solver),
  "double-adjacent-side": ({ solver }: DistractorContext) => numericOption(2 * number(solver.workingValues.adjacentSide), solver),

  "omit-diagonal-half-factor": ({ solver }: DistractorContext) => numericOption(2 * number(solver.workingValues.area), solver),
  "square-first-diagonal-half": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.diagonalA) ** 2 / 2, solver),
  "square-second-diagonal-half": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.diagonalB) ** 2 / 2, solver),
  "omit-double-area-diagonal": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.area) / number(solver.workingValues.diagonalA), solver),
  "divide-area-by-double-diagonal": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.area) / (2 * number(solver.workingValues.diagonalA)), solver),
  "double-known-diagonal": ({ solver }: DistractorContext) => numericOption(2 * number(solver.workingValues.diagonalA), solver),
  "use-full-rhombus-diagonals": ({ solver }: DistractorContext) => numericOption(Math.sqrt(number(solver.workingValues.diagonalA) ** 2 + number(solver.workingValues.diagonalB) ** 2), solver),
  "report-first-half-diagonal": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.halfDiagonalA), solver),
  "average-half-diagonals": ({ solver }: DistractorContext) => numericOption((number(solver.workingValues.halfDiagonalA) + number(solver.workingValues.halfDiagonalB)) / 2, solver),
  "report-rhombus-side": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.side), solver),
  "double-rhombus-side": ({ solver }: DistractorContext) => numericOption(2 * number(solver.workingValues.side), solver),
  "triple-rhombus-side": ({ solver }: DistractorContext) => numericOption(3 * number(solver.workingValues.side), solver),

  "omit-trapezium-half-factor": ({ solver }: DistractorContext) => numericOption(2 * number(solver.workingValues.area), solver),
  "use-parallel-side-difference": ({ solver }: DistractorContext) => numericOption(Math.abs(number(solver.workingValues.parallelSideB) - number(solver.workingValues.parallelSideA)) * number(solver.workingValues.height) / 2, solver),
  "omit-trapezium-height": ({ solver }: DistractorContext) => numericOption((number(solver.workingValues.parallelSideA) + number(solver.workingValues.parallelSideB)) / 2, solver),
  "omit-double-area-trapezium-height": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.area) / (number(solver.workingValues.parallelSideA) + number(solver.workingValues.parallelSideB)), solver),
  "divide-by-parallel-side-difference": ({ solver }: DistractorContext) => numericOption(2 * number(solver.workingValues.area) / Math.abs(number(solver.workingValues.parallelSideB) - number(solver.workingValues.parallelSideA)), solver),
  "use-parallel-side-average-as-height": ({ solver }: DistractorContext) => numericOption((number(solver.workingValues.parallelSideA) + number(solver.workingValues.parallelSideB)) / 2, solver),
  "omit-double-area-missing-parallel": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.area) / number(solver.workingValues.height) - number(solver.workingValues.parallelSideA), solver),
  "report-parallel-side-sum": ({ solver }: DistractorContext) => numericOption(2 * number(solver.workingValues.area) / number(solver.workingValues.height), solver),
  "add-known-parallel-side": ({ solver }: DistractorContext) => numericOption(2 * number(solver.workingValues.area) / number(solver.workingValues.height) + number(solver.workingValues.parallelSideA), solver),

  "use-one-perpendicular-only": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.diagonal) * number(solver.workingValues.perpendicularA) / 2, solver),
  "use-perpendicular-difference": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.diagonal) * Math.abs(number(solver.workingValues.perpendicularA) - number(solver.workingValues.perpendicularB)) / 2, solver),
  "omit-half-general-quadrilateral": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.diagonal) * (number(solver.workingValues.perpendicularA) + number(solver.workingValues.perpendicularB)), solver),
} as const satisfies Record<string, DistractorStrategy>;

export type Men001DistractorStrategyId = keyof typeof MEN_001_DISTRACTOR_STRATEGIES;

export function hasMen001DistractorStrategy(strategyId: string): strategyId is Men001DistractorStrategyId {
  return strategyId in MEN_001_DISTRACTOR_STRATEGIES;
}

function seedHash(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function buildMen001Options(
  entry: Men001QuestionLanguageEntry,
  parameters: Men001Parameters,
  solver: Men001SolverResult,
) {
  if (entry.distractorStrategyIds.length !== 3) {
    throw new Error(`${entry.qlId} must declare exactly three misconception strategies.`);
  }
  const correct = solver.canonicalAnswer.kind === "symbolic"
    ? solver.canonicalAnswer.rendered
    : solver.canonicalAnswer.display;
  const distractors = entry.distractorStrategyIds.map((strategyId) => {
    if (!hasMen001DistractorStrategy(strategyId)) {
      throw new Error(`${entry.qlId} references unknown distractor strategy ${strategyId}.`);
    }
    return MEN_001_DISTRACTOR_STRATEGIES[strategyId]({ parameters, solver });
  });
  const normalized = [correct, ...distractors].map((option) => option.trim().toLowerCase());
  if (new Set(normalized).size !== 4) {
    throw new Error(`${entry.qlId} misconception strategies did not produce four unique options.`);
  }

  const options = [correct, ...distractors];
  for (let index = options.length - 1; index > 0; index -= 1) {
    const swapIndex = seedHash(`${parameters.seed}:${entry.qlId}:option:${index}`) % (index + 1);
    [options[index], options[swapIndex]] = [options[swapIndex]!, options[index]!];
  }
  const correctIndex = options.indexOf(correct);
  return { options, correctIndex, distractors };
}
