import type { Men001ExplanationSection } from "./structured-explanation";
import type { Men001Parameters, Men001SolverResult } from "./types";

type StepSection = Extract<Men001ExplanationSection, { kind: "STEP" }>;
type FinalSection = Extract<Men001ExplanationSection, { kind: "FINAL_ANSWER" }>;

function numeric(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function format(value: number) {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));
}

function measurementUnit(solver: Men001SolverResult) {
  if (solver.unit === "m" || solver.unit === "m²") return "m";
  if (solver.unit === "cm" || solver.unit === "cm²") return "cm";
  return undefined;
}

function areaUnit(solver: Men001SolverResult) {
  return solver.unit === "m²" || solver.unit === "cm²" ? solver.unit : undefined;
}

function triangleBaseHeightSteps(
  parameters: Men001Parameters,
  solver: Men001SolverResult,
  final: FinalSection,
): StepSection[] | undefined {
  if (parameters.solveMode !== "findTriangleAreaBaseHeight") return undefined;
  const base = numeric(solver.workingValues.base);
  const height = numeric(solver.workingValues.height);
  const area = numeric(solver.workingValues.area);
  const lUnit = measurementUnit(solver);
  const aUnit = areaUnit(solver);
  if (base === undefined || height === undefined || area === undefined || !lUnit || !aUnit) return undefined;

  return [
    {
      kind: "STEP",
      stepNumber: 1,
      title: "Identify the Measurements",
      paragraphs: ["Read the base and its corresponding perpendicular height directly from the question."],
      equations: [
        `b = ${format(base)} ${lUnit}`,
        `h = ${format(height)} ${lUnit}`,
      ],
    },
    {
      kind: "STEP",
      stepNumber: 2,
      title: "Substitute and Calculate",
      paragraphs: [
        "Substitute the measurements into the triangle-area formula and simplify.",
        ...final.paragraphs,
      ],
      equations: [
        `A = ½ × ${format(base)} × ${format(height)}`,
        `A = ${format(area)} ${aUnit}`,
        ...final.equations,
      ],
    },
  ];
}

function circularWireSquareAreaSteps(
  parameters: Men001Parameters,
  solver: Men001SolverResult,
  final: FinalSection,
): StepSection[] | undefined {
  if (parameters.solveMode !== "findSquareAreaFromCircularWire") return undefined;
  const radius = numeric(solver.workingValues.radius);
  const wireLength = numeric(solver.workingValues.wireLength);
  const side = numeric(solver.workingValues.side);
  const squareArea = numeric(solver.workingValues.squareArea);
  const lUnit = measurementUnit(solver);
  const aUnit = areaUnit(solver);
  if (
    radius === undefined || wireLength === undefined || side === undefined ||
    squareArea === undefined || !lUnit || !aUnit
  ) return undefined;

  return [
    {
      kind: "STEP",
      stepNumber: 1,
      title: "Find the Wire Length",
      paragraphs: ["The complete circumference of the circle is the length of the wire."],
      equations: [
        `L = 2 × 22/7 × ${format(radius)} = ${format(wireLength)} ${lUnit}`,
      ],
    },
    {
      kind: "STEP",
      stepNumber: 2,
      title: "Find the Side of the Square",
      paragraphs: ["The square divides the same wire equally among its four sides."],
      equations: [
        `s = ${format(wireLength)} ÷ 4 = ${format(side)} ${lUnit}`,
      ],
    },
    {
      kind: "STEP",
      stepNumber: 3,
      title: "Calculate the Enclosed Area",
      paragraphs: [
        "Square the side length to obtain the area enclosed by the square.",
        ...final.paragraphs,
      ],
      equations: [
        `A = ${format(side)}² = ${format(squareArea)} ${aUnit}`,
        ...final.equations,
      ],
    },
  ];
}

function appendFinalAnswerToLastStep(
  sections: readonly Men001ExplanationSection[],
  final: FinalSection,
): Men001ExplanationSection[] {
  const withoutFinal = sections.filter((section) => section.kind !== "FINAL_ANSWER");
  const lastStepIndex = withoutFinal.findLastIndex((section) => section.kind === "STEP");
  if (lastStepIndex < 0) {
    throw new Error("MEN-001 exact four-tier explanation requires a worked solution before the final result.");
  }

  return withoutFinal.map((section, index): Men001ExplanationSection => {
    if (index !== lastStepIndex || section.kind !== "STEP") return section;
    return {
      ...section,
      paragraphs: [...section.paragraphs, ...final.paragraphs],
      equations: [...section.equations, ...final.equations],
    };
  });
}

export function finalizeMen001ExactFourTier(
  sections: readonly Men001ExplanationSection[],
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): Men001ExplanationSection[] {
  const keyRule = sections.find((section) => section.kind === "KEY_RULE");
  const final = sections.find((section): section is FinalSection => section.kind === "FINAL_ANSWER");
  if (!keyRule || !final) {
    throw new Error("MEN-001 could not convert the legacy worked explanation into the exact four-tier layout.");
  }

  const focusedSteps = triangleBaseHeightSteps(parameters, solver, final)
    ?? circularWireSquareAreaSteps(parameters, solver, final);
  if (focusedSteps) return [keyRule, ...focusedSteps];
  return appendFinalAnswerToLastStep(sections, final);
}

function equationLines(equations: readonly string[]) {
  return equations.map((equation) => `$$${equation}$$`);
}

function joinContent(paragraphs: readonly string[], equations: readonly string[]) {
  return [...paragraphs, ...equationLines(equations)].join("\n\n");
}

export function buildMen001ExactFourTierLines(
  sections: readonly Men001ExplanationSection[],
): string[] {
  const keyRule = sections.find((section) => section.kind === "KEY_RULE");
  const steps = sections.filter((section): section is StepSection => section.kind === "STEP");
  const shortcut = sections.find((section) => section.kind === "EXAM_SHORTCUT");
  const traps = sections.find((section) => section.kind === "COMMON_TRAPS");
  const finalAnswer = sections.find((section) => section.kind === "FINAL_ANSWER");
  if (!keyRule || steps.length === 0 || !shortcut || !traps || finalAnswer) {
    throw new Error("MEN-001 compatibility explanation must contain exactly four learner-facing tiers.");
  }

  const workedSolution = steps.map((step) => [
    `${step.stepNumber}. **${step.title}**`,
    joinContent(step.paragraphs, step.equations),
  ].filter(Boolean).join("\n\n")).join("\n\n");

  return [
    ["### 📌 Key Rule & Formula", joinContent(keyRule.paragraphs, keyRule.equations)].join("\n\n"),
    ["### 📝 Step-by-Step Solution", workedSolution].join("\n\n"),
    ["### 💡 Exam Speed Shortcut", joinContent(shortcut.paragraphs, shortcut.equations)].join("\n\n"),
    ["### ⚠️ Common Traps", traps.paragraphs.map((paragraph) => `- ${paragraph}`).join("\n")].join("\n\n"),
  ];
}
