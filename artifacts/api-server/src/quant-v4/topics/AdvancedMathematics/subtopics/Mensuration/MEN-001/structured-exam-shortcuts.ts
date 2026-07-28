import type { Men001ExplanationSection } from "./structured-explanation";
import type { Men001Parameters, Men001SolverResult } from "./types";

type ShortcutSection = Extract<Men001ExplanationSection, { kind: "EXAM_SHORTCUT" }>;

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

function shortcut(paragraphs: string[], equations: string[] = []): ShortcutSection {
  return {
    kind: "EXAM_SHORTCUT",
    title: "Exam Speed Shortcut",
    paragraphs,
    equations,
  };
}

function buildIsoscelesShortcut(
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): ShortcutSection | undefined {
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
    const unitOfArea = areaUnit(solver);
    if (base !== undefined && area !== undefined && unitOfArea) {
      equations.push(`A = ½ × ${format(base)} × ${format(height)} = ${format(area)} ${unitOfArea}`);
    }
  }

  return shortcut(
    [
      `The half-base, height and equal side form the ${tripletLabel([triplet.legA, triplet.legB, triplet.hypotenuse])} Pythagorean triplet (reduced form ${tripletLabel(triplet.reduced)}). Read the height as ${format(height)} ${unit} without expanding the square root.`,
    ],
    equations,
  );
}

function buildRatioTriangleShortcut(
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): ShortcutSection | undefined {
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

  return shortcut(
    [
      `The actual sides ${tripletLabel([triplet.legA, triplet.legB, triplet.hypotenuse])} reduce to the ${tripletLabel(triplet.reduced)} Pythagorean triplet. Use the two shorter sides directly as perpendicular base and height instead of applying Heron's formula.`,
    ],
    [`A = ½ × ${format(triplet.legA)} × ${format(triplet.legB)} = ${format(area)} ${unit}`],
  );
}

function buildTriangleCancellationShortcut(
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): ShortcutSection | undefined {
  const candidates = parameters.solveMode === "findTriangleAreaBaseHeight"
    ? [numeric(solver.workingValues.base), numeric(solver.workingValues.height)]
    : parameters.solveMode === "findRightTriangleAreaFromLegs"
      ? [numeric(solver.workingValues.legA), numeric(solver.workingValues.legB)]
      : [];
  if (candidates.length !== 2 || candidates.some((value) => value === undefined)) return undefined;
  const [first, second] = candidates as [number, number];
  const area = numeric(solver.workingValues.area);
  const unit = areaUnit(solver);
  if (area === undefined || !unit) return undefined;
  const evenFirst = first % 2 === 0;
  const evenSecond = second % 2 === 0;
  if (!evenFirst && !evenSecond) return undefined;
  const halved = evenFirst ? first / 2 : second / 2;
  const other = evenFirst ? second : first;

  return shortcut(
    ["Halve an even base or height before multiplying. This removes the 1/2 immediately and keeps the arithmetic small."],
    [`A = ${format(halved)} × ${format(other)} = ${format(area)} ${unit}`],
  );
}

function buildUniformPercentageShortcut(
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): ShortcutSection | undefined {
  const percentage = numeric(solver.workingValues.scale);
  const answer = numeric(solver.workingValues.areaPercent);
  if (percentage === undefined || answer === undefined) return undefined;

  if (parameters.solveMode === "findAreaPercentIncreaseAfterUniformScaling") {
    return shortcut(
      ["When both linear dimensions increase by the same p%, use 2p + p²/100 for the area increase."],
      [`Area increase % = 2 × ${format(percentage)} + ${format(percentage)}²/100 = ${format(answer)}%`],
    );
  }

  if (parameters.solveMode === "findAreaPercentDecreaseAfterUniformScaling") {
    return shortcut(
      ["When both linear dimensions decrease by the same p%, use 2p − p²/100 for the area decrease."],
      [`Area decrease % = 2 × ${format(percentage)} − ${format(percentage)}²/100 = ${format(answer)}%`],
    );
  }

  return undefined;
}

function buildIndependentPercentageShortcut(
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): ShortcutSection | undefined {
  if (
    parameters.solveMode !== "findAreaPercentIncreaseAfterIndependentDimensionChanges" &&
    parameters.solveMode !== "findNewAreaAfterPercentageDimensionChanges"
  ) return undefined;

  const increase = numeric(solver.workingValues.increasePercent);
  const decrease = numeric(solver.workingValues.decreasePercent);
  if (increase === undefined || decrease === undefined) return undefined;
  const net = increase - decrease - (increase * decrease) / 100;
  const equations = [
    `Net change % = ${format(increase)} − ${format(decrease)} − (${format(increase)} × ${format(decrease)})/100 = ${format(net)}%`,
  ];
  if (parameters.solveMode === "findNewAreaAfterPercentageDimensionChanges") {
    const area = numeric(solver.workingValues.area);
    const scaledArea = numeric(solver.workingValues.scaledArea);
    const unit = areaUnit(solver);
    if (area !== undefined && scaledArea !== undefined && unit) {
      equations.push(`New area = ${format(area)} × (100 + ${format(net)})/100 = ${format(scaledArea)} ${unit}`);
    }
  }
  return shortcut(
    ["Treat a decrease as a negative percentage and use x + y + xy/100. This combines both dimension changes in one line."],
    equations,
  );
}

function buildWireShortcut(
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): ShortcutSection | undefined {
  const mode = parameters.solveMode;
  const radius = numeric(solver.workingValues.radius);
  const side = numeric(solver.workingValues.side);
  const unit = measurementUnit(solver);

  if ((mode === "findSquareSideFromCircularWire" || mode === "findSquareAreaFromCircularWire") && radius !== undefined && side !== undefined && unit) {
    const equations = [`s = πr/2 = 11r/7 = ${format(side)} ${unit}`];
    const squareArea = numeric(solver.workingValues.squareArea);
    const unitOfArea = areaUnit(solver);
    if (mode === "findSquareAreaFromCircularWire" && squareArea !== undefined && unitOfArea) {
      equations.push(`A = s² = ${format(side)}² = ${format(squareArea)} ${unitOfArea}`);
    }
    return shortcut(
      ["For a circular wire reshaped into a square, go directly from radius to square side: s = πr/2. With π = 22/7, this becomes s = 11r/7."],
      equations,
    );
  }

  if ((mode === "findCircleRadiusFromSquareWire" || mode === "findCircleAreaFromSquareWire") && side !== undefined && radius !== undefined && unit) {
    const equations = [`r = 2s/π = 7s/11 = ${format(radius)} ${unit}`];
    const circleArea = numeric(solver.workingValues.circleArea);
    const unitOfArea = areaUnit(solver);
    if (mode === "findCircleAreaFromSquareWire" && circleArea !== undefined && unitOfArea) {
      equations.push(`A = 14s²/11 = ${format(circleArea)} ${unitOfArea}`);
    }
    return shortcut(
      ["For a square wire reshaped into a circle, use r = 2s/π directly. With π = 22/7, r = 7s/11."],
      equations,
    );
  }

  if (/Wire/.test(mode)) {
    return shortcut([
      "Write one boundary-conservation equation first. Cancel the common factor 2 or divide the total wire by the number of equal sides before doing any area calculation.",
    ]);
  }

  return undefined;
}

function buildUnitShortcut(
  parameters: Men001Parameters,
): ShortcutSection | undefined {
  if (/SquareCentimetresToSquareMetres/.test(parameters.solveMode)) {
    return shortcut(["For area, square the linear conversion: 1 m² = 10,000 cm². Move from cm² to m² by dividing by 10,000, not 100."]);
  }
  if (/SquareMetresToSquareCentimetres/.test(parameters.solveMode)) {
    return shortcut(["For area, square the linear conversion: 1 m² = 10,000 cm². Move from m² to cm² by multiplying by 10,000."]);
  }
  if (/MixedLengthUnits|UnitConversion/.test(parameters.solveMode)) {
    return shortcut(["Convert every linear measurement to one unit before using the formula; convert the final unit only after the geometry is complete."]);
  }
  return undefined;
}

function buildScaleShortcut(parameters: Men001Parameters): ShortcutSection | undefined {
  if (/Area.*Scal|AreaFromMap|MapArea|PlotAreaFromPlan/.test(parameters.solveMode)) {
    return shortcut(["Remember the exam rule: linear measures follow k, but areas follow k². Write the square on the scale factor before substituting numbers."]);
  }
  if (/Perimeter.*Scal|LinearScale|MapLength|ActualLengthFromMap/.test(parameters.solveMode)) {
    return shortcut(["Perimeter and length are one-dimensional, so use the linear scale factor k only once; do not square it."]);
  }
  return undefined;
}

function buildSafeFallbackShortcut(
  parameters: Men001Parameters,
): ShortcutSection {
  switch (parameters.answerDimension) {
    case "AREA":
      return shortcut(["Keep all lengths in one unit, cancel common factors before multiplying, and attach the square unit only to the final area."]);
    case "LENGTH":
      return shortcut(["Rearrange the governing relation to isolate the required length first, then substitute the measurements once."]);
    case "COST":
      return shortcut(["Find the geometric area or boundary first and apply the stated money rate only in the final multiplication."]);
    case "RATE":
      return shortcut(["Find the complete geometric measure first, then divide the total cost by that measure in one step."]);
    case "COUNT":
      return shortcut(["Use total required area ÷ area of one item and cancel the square units before evaluating the count."]);
    case "ANGLE":
      return shortcut(["Work with the required fraction of 360° before multiplying; this usually allows cancellation with the denominator." ]);
    case "PERCENT":
      return shortcut(["Convert each change to a multiplier, combine the multipliers, and compare the result with 100% only once." ]);
    case "SCALAR":
      return shortcut(["Form the required ratio first and cancel common factors before converting it to the scale value." ]);
  }
}

function shortcutFor(
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): ShortcutSection {
  return buildRatioTriangleShortcut(parameters, solver)
    ?? buildIsoscelesShortcut(parameters, solver)
    ?? buildTriangleCancellationShortcut(parameters, solver)
    ?? buildUniformPercentageShortcut(parameters, solver)
    ?? buildIndependentPercentageShortcut(parameters, solver)
    ?? buildWireShortcut(parameters, solver)
    ?? buildUnitShortcut(parameters)
    ?? buildScaleShortcut(parameters)
    ?? buildSafeFallbackShortcut(parameters);
}

export function addMen001ExamShortcut(
  sections: readonly Men001ExplanationSection[],
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): Men001ExplanationSection[] {
  if (sections.some((section) => section.kind === "EXAM_SHORTCUT")) return [...sections];
  const examShortcut = shortcutFor(parameters, solver);
  const finalIndex = sections.findIndex((section) => section.kind === "FINAL_ANSWER");
  return finalIndex >= 0
    ? [...sections.slice(0, finalIndex), examShortcut, ...sections.slice(finalIndex)]
    : [...sections, examShortcut];
}
