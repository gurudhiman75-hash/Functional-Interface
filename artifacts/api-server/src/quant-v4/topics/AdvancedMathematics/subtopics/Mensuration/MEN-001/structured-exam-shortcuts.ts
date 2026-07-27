import type { Men001ExplanationSection } from "./structured-explanation";
import type { Men001Parameters, Men001SolverResult } from "./types";

function numeric(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function format(value: number) {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));
}

function gcd(left: number, right: number): number {
  let a = Math.abs(Math.round(left));
  let b = Math.abs(Math.round(right));
  while (b !== 0) {
    const remainder = a % b;
    a = b;
    b = remainder;
  }
  return a || 1;
}

function reduceTriple(values: readonly number[]) {
  const divisor = values.reduce((current, value) => gcd(current, value));
  return values.map((value) => value / divisor);
}

function pythagoreanTriple(values: readonly number[]) {
  if (values.some((value) => !Number.isInteger(value) || value <= 0)) return undefined;
  const ordered = [...values].sort((left, right) => left - right);
  const [legA, legB, hypotenuse] = ordered;
  if (legA ** 2 + legB ** 2 !== hypotenuse ** 2) return undefined;
  return { legA, legB, hypotenuse, reduced: reduceTriple(ordered) };
}

function measurementUnit(solver: Men001SolverResult) {
  if (solver.unit === "m" || solver.unit === "m²") return "m";
  if (solver.unit === "cm" || solver.unit === "cm²") return "cm";
  return undefined;
}

function areaUnit(solver: Men001SolverResult) {
  return solver.unit === "m²" || solver.unit === "cm²" ? solver.unit : undefined;
}

function tripletLabel(values: readonly number[]) {
  return values.map(format).join("–");
}

function buildIsoscelesShortcut(
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): Men001ExplanationSection | undefined {
  if (parameters.solveMode !== "findIsoscelesTriangleArea" && parameters.solveMode !== "findIsoscelesHeight") {
    return undefined;
  }
  const halfBase = numeric(solver.workingValues.halfBase);
  const height = numeric(solver.workingValues.height);
  const equalSide = numeric(solver.workingValues.equalSide);
  const unit = measurementUnit(solver);
  if (halfBase === undefined || height === undefined || equalSide === undefined || !unit) return undefined;
  const triplet = pythagoreanTriple([halfBase, height, equalSide]);
  if (!triplet) return undefined;

  const equations = [
    `${format(triplet.legA)}² + ${format(triplet.legB)}² = ${format(triplet.hypotenuse)}²`,
  ];
  if (parameters.solveMode === "findIsoscelesTriangleArea") {
    const base = numeric(solver.workingValues.base);
    const area = numeric(solver.workingValues.area);
    const aUnit = areaUnit(solver);
    if (base !== undefined && area !== undefined && aUnit) {
      equations.push(`A = ½ × ${format(base)} × ${format(height)} = ${format(area)} ${aUnit}`);
    }
  }

  return {
    kind: "STEP",
    stepNumber: 0,
    title: "Exam Shortcut",
    paragraphs: [
      `The half-base, height and equal side form the ${tripletLabel([triplet.legA, triplet.legB, triplet.hypotenuse])} Pythagorean triplet (reduced form ${tripletLabel(triplet.reduced)}). Recognise the triplet to read the height as ${format(height)} ${unit} without expanding the square root.`,
    ],
    equations,
  };
}

function buildRatioTriangleShortcut(
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): Men001ExplanationSection | undefined {
  if (parameters.solveMode !== "findTriangleAreaFromSideRatioAndPerimeter") return undefined;
  const sideA = numeric(solver.workingValues.sideA);
  const sideB = numeric(solver.workingValues.sideB);
  const sideC = numeric(solver.workingValues.sideC);
  const area = numeric(solver.workingValues.area);
  const unit = areaUnit(solver);
  if (sideA === undefined || sideB === undefined || sideC === undefined || area === undefined || !unit) {
    return undefined;
  }
  const triplet = pythagoreanTriple([sideA, sideB, sideC]);
  if (!triplet) return undefined;

  return {
    kind: "STEP",
    stepNumber: 0,
    title: "Exam Shortcut",
    paragraphs: [
      `The actual sides ${tripletLabel([triplet.legA, triplet.legB, triplet.hypotenuse])} reduce to the ${tripletLabel(triplet.reduced)} Pythagorean triplet. Use the two shorter sides directly as the perpendicular base and height instead of applying Heron's formula.`,
    ],
    equations: [
      `A = ½ × ${format(triplet.legA)} × ${format(triplet.legB)} = ${format(area)} ${unit}`,
    ],
  };
}

function buildUniformPercentageShortcut(
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): Men001ExplanationSection | undefined {
  const percentage = numeric(solver.workingValues.scale);
  const answer = numeric(solver.workingValues.areaPercent);
  if (percentage === undefined || answer === undefined) return undefined;

  if (parameters.solveMode === "findAreaPercentIncreaseAfterUniformScaling") {
    return {
      kind: "STEP",
      stepNumber: 0,
      title: "Exam Shortcut",
      paragraphs: [
        "When both linear dimensions increase by the same p%, use the successive-percentage shortcut 2p + p²/100 for the area increase.",
      ],
      equations: [
        `Area increase % = 2 × ${format(percentage)} + ${format(percentage)}²/100 = ${format(answer)}%`,
      ],
    };
  }

  if (parameters.solveMode === "findAreaPercentDecreaseAfterUniformScaling") {
    return {
      kind: "STEP",
      stepNumber: 0,
      title: "Exam Shortcut",
      paragraphs: [
        "When both linear dimensions decrease by the same p%, use 2p − p²/100 for the area decrease.",
      ],
      equations: [
        `Area decrease % = 2 × ${format(percentage)} − ${format(percentage)}²/100 = ${format(answer)}%`,
      ],
    };
  }

  return undefined;
}

function shortcutFor(
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): Men001ExplanationSection | undefined {
  return buildRatioTriangleShortcut(parameters, solver)
    ?? buildIsoscelesShortcut(parameters, solver)
    ?? buildUniformPercentageShortcut(parameters, solver);
}

export function addMen001ExamShortcut(
  sections: readonly Men001ExplanationSection[],
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): Men001ExplanationSection[] {
  const shortcut = shortcutFor(parameters, solver);
  if (!shortcut || sections.some((section) => section.kind === "STEP" && section.title === "Exam Shortcut")) {
    return [...sections];
  }

  const finalIndex = sections.findIndex((section) => section.kind === "FINAL_ANSWER");
  const inserted = finalIndex >= 0
    ? [...sections.slice(0, finalIndex), shortcut, ...sections.slice(finalIndex)]
    : [...sections, shortcut];

  let stepNumber = 0;
  return inserted.map((section): Men001ExplanationSection => {
    if (section.kind !== "STEP") return section;
    stepNumber += 1;
    return { ...section, stepNumber };
  });
}
