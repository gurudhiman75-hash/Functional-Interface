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
  "add-base-height": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.base) + number(solver.workingValues.height), solver),
  "average-base-height": ({ solver }: DistractorContext) => numericOption((number(solver.workingValues.base) + number(solver.workingValues.height)) / 2, solver),
  "halve-correct-length": ({ solver }: DistractorContext) => numericOption(correctNumericValue(solver) / 2, solver),
  "retain-given-base": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.base), solver),
  "retain-given-height": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.height), solver),
  "use-perimeter-as-area": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.sideA) + number(solver.workingValues.sideB) + number(solver.workingValues.sideC), solver),
  "use-semiperimeter-as-area": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.semiperimeter), solver),
  "use-two-sides-as-perpendicular": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.sideA) * number(solver.workingValues.sideB) / 2, solver),
  "add-legs": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.legA) + number(solver.workingValues.legB), solver),
  "use-hypotenuse-as-area": ({ solver }: DistractorContext) => numericOption(Math.sqrt(number(solver.workingValues.legA) ** 2 + number(solver.workingValues.legB) ** 2), solver),
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
  "use-perimeter-as-area-isosceles": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.base) + 2 * number(solver.workingValues.equalSide), solver),
  "retain-equal-side": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.equalSide), solver),
  "use-half-base": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.halfBase), solver),
  "subtract-half-base": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.equalSide) - number(solver.workingValues.halfBase), solver),
  "omit-scale-square": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.area) / number(solver.workingValues.scale) ** 2, solver),
  "double-heron-area": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.area) * 2, solver),
  "report-scale-factor": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.scale), solver),
  "report-largest-ratio-term": ({ solver }: DistractorContext) => numericOption(Math.max(number(solver.workingValues.ratioA), number(solver.workingValues.ratioB), number(solver.workingValues.ratioC)), solver),
  "report-smallest-ratio-term": ({ solver }: DistractorContext) => numericOption(Math.min(number(solver.workingValues.ratioA), number(solver.workingValues.ratioB), number(solver.workingValues.ratioC)), solver),
  "choose-largest-side": ({ solver }: DistractorContext) => numericOption(Math.max(number(solver.workingValues.sideA), number(solver.workingValues.sideB), number(solver.workingValues.sideC)), solver),
  "choose-smallest-side": ({ solver }: DistractorContext) => numericOption(Math.min(number(solver.workingValues.sideA), number(solver.workingValues.sideB), number(solver.workingValues.sideC)), solver),
  "report-area-only": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.area), solver),
  "multiply-rate-by-base-only": ({ solver }: DistractorContext) => numericOption(number(solver.workingValues.ratePerSquareMetre) * number(solver.workingValues.base), solver),
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
