import { getMen001Cp006FormulaLine } from "./explanation-formula.cp006";
import type {
  Men001Explanation,
  Men001Parameters,
  Men001SolverResult,
} from "./types";

export type Men001ExplanationSection =
  | {
      kind: "KEY_RULE";
      title: "Key Rule";
      paragraphs: string[];
      equations: string[];
    }
  | {
      kind: "STEP";
      stepNumber: number;
      title: string;
      paragraphs: string[];
      equations: string[];
    }
  | {
      kind: "FINAL_ANSWER";
      title: "Final Answer";
      paragraphs: string[];
      equations: string[];
    };

declare module "./types" {
  interface Men001Explanation {
    displayFormat: "KEY_RULE_STEPS_FINAL_ANSWER";
    sections: Men001ExplanationSection[];
  }
}

function finishSentence(value: string) {
  const text = value.trim().replace(/\s+/g, " ");
  if (!text) return text;
  return /[.!?]$/.test(text) ? text : `${text}.`;
}

function readableEquation(value: string) {
  return value
    .trim()
    .replace(/\(1\/2\)/g, "½")
    .replace(/\b1\/2\b/g, "½")
    .replace(/\s*=\s*/g, " = ")
    .replace(/\s*\+\s*/g, " + ")
    .replace(/\s*-\s*/g, " − ")
    .replace(/\s*×\s*/g, " × ")
    .replace(/\s*÷\s*/g, " ÷ ")
    .replace(/\s+/g, " ")
    .trim();
}

function areaUnit(solver: Men001SolverResult) {
  if (solver.unit === "m²" || solver.unit === "cm²") return solver.unit;
  return undefined;
}

function lengthUnit(solver: Men001SolverResult) {
  if (solver.unit === "m" || solver.unit === "m²") return "m";
  if (solver.unit === "cm" || solver.unit === "cm²") return "cm";
  return undefined;
}

function numeric(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function rectangleSemicircleSteps(
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): Men001ExplanationSection[] | undefined {
  if (parameters.solveMode !== "findRectangleSemicircleCompositeArea") return undefined;

  const length = numeric(solver.workingValues.length);
  const breadth = numeric(solver.workingValues.breadth);
  const radius = numeric(solver.workingValues.radius);
  const rectangleArea = numeric(solver.workingValues.rectangleArea);
  const semicircleArea = numeric(solver.workingValues.semicircleArea);
  const totalArea = numeric(solver.workingValues.area);
  const aUnit = areaUnit(solver);
  const lUnit = lengthUnit(solver);
  if (
    length === undefined ||
    breadth === undefined ||
    radius === undefined ||
    rectangleArea === undefined ||
    semicircleArea === undefined ||
    totalArea === undefined ||
    !aUnit ||
    !lUnit
  ) {
    return undefined;
  }

  return [
    {
      kind: "STEP",
      stepNumber: 1,
      title: "Area of the Rectangle",
      paragraphs: ["Multiply the rectangle's length by its breadth."],
      equations: [
        `Rectangle Area = ${length} × ${breadth} = ${rectangleArea} ${aUnit}`,
      ],
    },
    {
      kind: "STEP",
      stepNumber: 2,
      title: "Find the Semicircle's Radius",
      paragraphs: [
        `The semicircle is attached along the ${breadth} ${lUnit} side, so this side is its diameter. The radius is half of the diameter.`,
      ],
      equations: [`r = ${breadth} ÷ 2 = ${radius} ${lUnit}`],
    },
    {
      kind: "STEP",
      stepNumber: 3,
      title: "Area of the Semicircle",
      paragraphs: ["A semicircle has half the area of a full circle."],
      equations: [
        "Semicircle Area = ½ × πr²",
        `= ½ × 22/7 × ${radius} × ${radius}`,
        `= ${semicircleArea} ${aUnit}`,
      ],
    },
    {
      kind: "STEP",
      stepNumber: 4,
      title: "Add the Two Areas",
      paragraphs: [
        "The rectangle and semicircle do not overlap, so their areas are added.",
      ],
      equations: [
        `Total Area = ${rectangleArea} + ${semicircleArea} = ${totalArea} ${aUnit}`,
      ],
    },
  ];
}

function removeWorkingPrefix(value: string) {
  return value
    .trim()
    .replace(/^Substitution gives\s*/i, "")
    .replace(/^Substitution:\s*/i, "")
    .replace(/^Calculation:\s*/i, "")
    .replace(/^Using these values,\s*/i, "")
    .replace(/^With the given measurements,\s*/i, "")
    .replace(/^This gives\s*/i, "")
    .replace(/^Therefore,?\s*/i, "")
    .replace(/^Hence,?\s*/i, "")
    .trim();
}

function stepTitle(value: string, solveMode: string, stepNumber: number) {
  const text = `${solveMode} ${value}`.toLowerCase();
  if (/convert|centimetre|metre|unit/.test(text)) return "Convert the Units";
  if (/radius/.test(text) && /diameter|half|÷\s*2|\/\s*2/.test(text)) return "Find the Radius";
  if (/rectangle/.test(text) && /area|a\s*=/.test(text)) return "Area of the Rectangle";
  if (/triangle/.test(text) && /area|a\s*=/.test(text)) return "Area of the Triangle";
  if (/semicircle/.test(text) && /area|a\s*=/.test(text)) return "Area of the Semicircle";
  if (/circle/.test(text) && /area|a\s*=/.test(text)) return "Area of the Circle";
  if (/square/.test(text) && /area|a\s*=/.test(text)) return "Area of the Square";
  if (/hexagon/.test(text) && /area|a\s*=/.test(text)) return "Area of the Regular Hexagon";
  if (/perimeter|circumference|boundary|wire/.test(text)) return "Calculate the Boundary";
  if (/scale factor|ratio/.test(text)) return "Apply the Scale Relation";
  if (/percentage|percent|%/.test(text)) return "Apply the Percentage Change";
  if (/add|total|sum|combine|\+/.test(text)) return "Combine the Results";
  if (/subtract|difference|remaining|−|\s-\s/.test(text)) return "Subtract the Required Part";
  if (/square root|√/.test(text)) return "Take the Positive Square Root";
  if (/cost|rate|₹/.test(text)) return "Calculate the Cost or Rate";
  return stepNumber === 1 ? "Substitute the Given Values" : "Simplify the Calculation";
}

function genericSteps(
  originalLines: readonly string[],
  authoredLines: readonly string[],
  parameters: Men001Parameters,
): Men001ExplanationSection[] {
  const source = originalLines.length >= 4
    ? originalLines.slice(2, -1)
    : authoredLines.slice(1, -1);
  const cleaned = source
    .map(removeWorkingPrefix)
    .filter(Boolean)
    .filter((line, index, lines) => index === 0 || line !== lines[index - 1]);

  const steps = cleaned.map((line, index): Men001ExplanationSection => {
    const stepNumber = index + 1;
    const hasEquation = line.includes("=");
    return {
      kind: "STEP",
      stepNumber,
      title: stepTitle(line, parameters.solveMode, stepNumber),
      paragraphs: hasEquation ? [] : [finishSentence(line)],
      equations: hasEquation ? [readableEquation(line.replace(/[.]$/, ""))] : [],
    };
  });

  if (steps.length > 0) return steps;
  return [
    {
      kind: "STEP",
      stepNumber: 1,
      title: "Apply the Formula",
      paragraphs: ["Substitute the given measurements and simplify exactly."],
      equations: [],
    },
  ];
}

function formulaNarrative(
  originalLines: readonly string[],
  parameters: Men001Parameters,
) {
  if (parameters.canonicalProblemId === "MEN-CP-006") {
    return getMen001Cp006FormulaLine(parameters.questionLanguageId);
  }
  const relation = originalLines[1];
  return relation ? finishSentence(relation) : "Use the governing mensuration relation for the given figure.";
}

export function buildMen001StructuredExplanation(
  originalLines: readonly string[],
  authoredLines: readonly string[],
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): Men001ExplanationSection[] {
  const opening = authoredLines[0] ?? originalLines[0] ?? "Identify the required measurement relation.";
  const conclusion = authoredLines.at(-1) ?? originalLines.at(-1) ?? `The required answer is ${solver.answer}.`;
  const formula = readableEquation(solver.equation);
  const detailed = rectangleSemicircleSteps(parameters, solver);
  const working = detailed ?? genericSteps(originalLines, authoredLines, parameters);

  return [
    {
      kind: "KEY_RULE",
      title: "Key Rule",
      paragraphs: [finishSentence(opening), formulaNarrative(originalLines, parameters)],
      equations: [formula],
    },
    ...working.map((section, index) => ({
      ...section,
      stepNumber: index + 1,
    })),
    {
      kind: "FINAL_ANSWER",
      title: "Final Answer",
      paragraphs: [finishSentence(conclusion)],
      equations: [solver.answer],
    },
  ];
}

export function flattenMen001StructuredExplanation(
  sections: readonly Men001ExplanationSection[],
) {
  return sections.flatMap((section) => {
    const heading = section.kind === "STEP"
      ? `Step ${section.stepNumber}: ${section.title}`
      : section.title;
    return [
      heading,
      ...section.paragraphs,
      ...section.equations.map((equation) => `$$${equation}$$`),
    ];
  });
}

export function assertMen001StructuredExplanation(
  explanation: Men001Explanation,
  answer: string,
) {
  if (explanation.displayFormat !== "KEY_RULE_STEPS_FINAL_ANSWER") {
    throw new Error("MEN-001 explanation must use the structured worked format.");
  }
  const [first, ...rest] = explanation.sections;
  const last = rest.at(-1);
  if (!first || first.kind !== "KEY_RULE" || first.equations.length === 0) {
    throw new Error("MEN-001 explanation must begin with a Key Rule and formula.");
  }
  if (!last || last.kind !== "FINAL_ANSWER" || !last.equations.includes(answer)) {
    throw new Error("MEN-001 explanation must end with the canonical final answer.");
  }
  const steps = explanation.sections.filter((section) => section.kind === "STEP");
  if (steps.length === 0) {
    throw new Error("MEN-001 explanation must contain at least one worked step.");
  }
  steps.forEach((step, index) => {
    if (step.stepNumber !== index + 1 || !step.title.trim()) {
      throw new Error("MEN-001 explanation steps must be sequential and titled.");
    }
    if (step.paragraphs.length === 0 && step.equations.length === 0) {
      throw new Error("MEN-001 explanation steps cannot be empty.");
    }
  });
}
