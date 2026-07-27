import { getMen001Cp006FormulaLine } from "./natural-explanation-formula.cp006";
import type {
  Men001Explanation,
  Men001Parameters,
  Men001SolverResult,
} from "./types";

export type Men001ExplanationSection =
  | {
      kind: "KEY_RULE";
      title: "Key Rule & Formula";
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
      kind: "EXAM_SHORTCUT";
      title: "Exam Speed Shortcut";
      paragraphs: string[];
      equations: string[];
    }
  | {
      kind: "COMMON_TRAPS";
      title: "Common Traps";
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
    displayFormat: "FOUR_TIER_COMPETITIVE_EXPLANATION";
    sections: Men001ExplanationSection[];
  }
}

const FORMULA_OVERRIDES: Partial<Record<Men001Parameters["solveMode"], string[]>> = {
  findRectangleSemicircleCompositeArea: [
    "Total Area = Rectangle Area + Semicircle Area",
    "Rectangle Area = l × b",
    "Semicircle Area = ½ × πr²",
  ],
  findEquilateralSideFromPerimeter: ["a = P ÷ 3"],
  findSquareSideFromArea: ["a = √A"],
};

function finishSentence(value: string) {
  const text = value.trim().replace(/\s+/g, " ");
  if (!text) return text;
  return /[.!?]$/.test(text) ? text : `${text}.`;
}

function stripMathDelimiters(value: string) {
  return value.trim().replace(/^\$\$/, "").replace(/\$\$$/, "").trim();
}

function readableEquation(value: string) {
  return stripMathDelimiters(value)
    .replace(/[.]$/, "")
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
  return solver.unit === "m²" || solver.unit === "cm²" ? solver.unit : undefined;
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
    length === undefined || breadth === undefined || radius === undefined ||
    rectangleArea === undefined || semicircleArea === undefined ||
    totalArea === undefined || !aUnit || !lUnit
  ) return undefined;

  return [
    {
      kind: "STEP",
      stepNumber: 1,
      title: "Area of the Rectangle",
      paragraphs: ["Multiply the rectangle's length by its breadth."],
      equations: [`Rectangle Area = ${length} × ${breadth} = ${rectangleArea} ${aUnit}`],
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
      paragraphs: ["The two parts do not overlap, so their areas are added."],
      equations: [`Total Area = ${rectangleArea} + ${semicircleArea} = ${totalArea} ${aUnit}`],
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
    .replace(/^(Therefore|Hence|Thus|So),?\s*/i, "")
    .trim();
}

function isTerminalNarrative(value: string) {
  return !value.includes("=") && /^(the required|the exact|the side length|the converted|the final|the answer)\b/i.test(value.trim());
}

function isSimpleResultEquation(value: string) {
  if (!value.includes("=")) return false;
  const right = value.split("=").at(-1)?.trim() ?? "";
  return /\d|√|π/.test(right) && !/[+−×÷*/()]/.test(right);
}

function baseStepTitle(value: string, solveMode: string, stepNumber: number) {
  const line = value.toLowerCase();
  const mode = solveMode.toLowerCase();
  if (/add|total|sum|combine|\+/.test(line)) return "Combine the Results";
  if (/subtract|difference|remaining|−|\s-\s/.test(line)) return "Subtract the Required Part";
  if (/convert|centimetre|metre|unit/.test(line)) return "Convert the Units";
  if (/radius/.test(line) && /diameter|half|÷\s*2|\/\s*2/.test(line)) return "Find the Radius";
  if (/rectangle/.test(line) && /area|a\s*=/.test(line)) return "Area of the Rectangle";
  if (/triangle/.test(line) && /area|a\s*=/.test(line)) return "Area of the Triangle";
  if (/semicircle/.test(line) && /area|a\s*=/.test(line)) return "Area of the Semicircle";
  if (/circle/.test(line) && /area|a\s*=/.test(line)) return "Area of the Circle";
  if (/square/.test(line) && /area|a\s*=/.test(line)) return "Area of the Square";
  if (/hexagon/.test(line) && /area|a\s*=/.test(line)) return "Area of the Regular Hexagon";
  if (/perimeter|circumference|boundary|wire/.test(line)) return "Calculate the Boundary";
  if (/scale factor|ratio/.test(line)) return "Apply the Scale Relation";
  if (/percentage|percent|%/.test(line)) return "Apply the Percentage Change";
  if (/square root|√/.test(line)) return "Take the Positive Square Root";
  if (/cost|rate|₹/.test(line)) return "Calculate the Cost or Rate";
  if (/convert|unit/.test(mode)) return "Convert the Units";
  if (/perimeter|circumference|boundary|wire/.test(mode)) return "Calculate the Boundary";
  if (/scale|similar/.test(mode)) return "Apply the Scale Relation";
  if (/area/.test(mode)) return stepNumber === 1 ? "Substitute in the Area Formula" : "Simplify the Area";
  return stepNumber === 1 ? "Substitute the Given Values" : "Simplify the Calculation";
}

function instructionForStep(title: string) {
  const instructions: Record<string, string> = {
    "Combine the Results": "Combine the component values using the relation stated in the Key Rule.",
    "Subtract the Required Part": "Subtract the excluded or inner part from the complete measure.",
    "Convert the Units": "Write all measurements in compatible units before calculating.",
    "Find the Radius": "Use the diameter-radius relationship before applying the circle formula.",
    "Area of the Rectangle": "Multiply the rectangle's length by its breadth.",
    "Area of the Triangle": "Use the base and corresponding perpendicular height.",
    "Area of the Semicircle": "Use half of the full-circle area.",
    "Area of the Circle": "Substitute the radius in the circle-area formula.",
    "Area of the Square": "Square the side length.",
    "Area of the Regular Hexagon": "Use the regular-hexagon area relation and simplify exactly.",
    "Calculate the Boundary": "Use the boundary relation for the required perimeter or circumference.",
    "Apply the Scale Relation": "Substitute the corresponding measures in the scale relation.",
    "Apply the Percentage Change": "Convert each percentage change into its multiplicative factor.",
    "Take the Positive Square Root": "Take the positive root because a physical measurement cannot be negative.",
    "Calculate the Cost or Rate": "Combine the measure with the stated cost or rate relation.",
    "Substitute in the Area Formula": "Place the given measurements into the selected area formula.",
    "Simplify the Area": "Simplify the numerical expression to obtain the area.",
    "Substitute the Given Values": "Substitute the supplied measurements into the governing formula.",
    "Simplify the Calculation": "Simplify the expression while preserving the correct unit.",
    "Continue the Calculation": "Use the previous result in the next part of the calculation.",
    "Complete the Calculation": "Evaluate the final numerical expression.",
  };
  return instructions[title] ?? "Carry out this part of the calculation exactly.";
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
    .filter((line) => !isTerminalNarrative(line))
    .filter((line, index, lines) => index === 0 || line !== lines[index - 1]);

  let previousTitle = "";
  const steps = cleaned.map((line, index): Men001ExplanationSection => {
    const stepNumber = index + 1;
    const hasEquation = line.includes("=");
    let title = baseStepTitle(line, parameters.solveMode, stepNumber);
    if (hasEquation && index > 0 && isSimpleResultEquation(line)) {
      title = "Complete the Calculation";
    } else if (title === previousTitle) {
      title = index === cleaned.length - 1 ? "Complete the Calculation" : "Continue the Calculation";
    }
    previousTitle = title;
    return {
      kind: "STEP",
      stepNumber,
      title,
      paragraphs: hasEquation ? [instructionForStep(title)] : [finishSentence(line)],
      equations: hasEquation ? [readableEquation(line)] : [],
    };
  });

  return steps.length > 0 ? steps : [{
    kind: "STEP",
    stepNumber: 1,
    title: "Apply the Formula",
    paragraphs: ["Substitute the given measurements and simplify exactly."],
    equations: [],
  }];
}

function relationLine(originalLines: readonly string[], parameters: Men001Parameters) {
  if (parameters.canonicalProblemId === "MEN-CP-006") {
    return getMen001Cp006FormulaLine(parameters.questionLanguageId);
  }
  return originalLines[1] ?? "";
}

function relationEquation(value: string) {
  const cleaned = value.trim().replace(/[.]$/, "");
  const colon = cleaned.lastIndexOf(":");
  if (colon >= 0) {
    const afterColon = cleaned.slice(colon + 1).trim();
    if (afterColon.includes("=")) return readableEquation(afterColon);
  }
  return readableEquation(cleaned);
}

function keyRuleContent(
  originalLines: readonly string[],
  parameters: Men001Parameters,
  solver: Men001SolverResult,
) {
  const override = FORMULA_OVERRIDES[parameters.solveMode];
  if (override) return { paragraphs: [] as string[], equations: override };

  const relation = relationLine(originalLines, parameters);
  if (relation.includes("=")) {
    return { paragraphs: [] as string[], equations: [relationEquation(relation)] };
  }
  return {
    paragraphs: relation ? [finishSentence(relation)] : [],
    equations: [readableEquation(solver.equation)],
  };
}

export function buildMen001StructuredExplanation(
  originalLines: readonly string[],
  authoredLines: readonly string[],
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): Men001ExplanationSection[] {
  const opening = authoredLines[0] ?? originalLines[0] ?? "Identify the required measurement relation.";
  const conclusion = authoredLines.at(-1) ?? originalLines.at(-1) ?? `The required answer is ${solver.answer}.`;
  const keyRule = keyRuleContent(originalLines, parameters, solver);
  const detailed = rectangleSemicircleSteps(parameters, solver);
  const working = detailed ?? genericSteps(originalLines, authoredLines, parameters);

  return [
    {
      kind: "KEY_RULE",
      title: "Key Rule & Formula",
      paragraphs: [finishSentence(opening), ...keyRule.paragraphs],
      equations: keyRule.equations,
    },
    ...working,
    {
      kind: "FINAL_ANSWER",
      title: "Final Answer",
      paragraphs: [finishSentence(conclusion)],
      equations: [stripMathDelimiters(solver.answer)],
    },
  ];
}

export function flattenMen001StructuredExplanation(
  sections: readonly Men001ExplanationSection[],
) {
  const lines: string[] = [];
  let wroteSolutionHeading = false;
  for (const section of sections) {
    if (section.kind === "STEP" && !wroteSolutionHeading) {
      lines.push("Step-by-Step Solution");
      wroteSolutionHeading = true;
    }
    const heading = section.kind === "STEP"
      ? `Step ${section.stepNumber}: ${section.title}`
      : section.title;
    lines.push(
      heading,
      ...section.paragraphs,
      ...section.equations.map((equation) => `$$${equation}$$`),
    );
  }
  return lines;
}

export function assertMen001StructuredExplanation(
  explanation: Men001Explanation,
  answer: string,
) {
  if (explanation.displayFormat !== "FOUR_TIER_COMPETITIVE_EXPLANATION") {
    throw new Error("MEN-001 explanation must use the four-tier competitive format.");
  }
  const first = explanation.sections[0];
  const last = explanation.sections.at(-1);
  if (!first || first.kind !== "KEY_RULE" || first.title !== "Key Rule & Formula" || first.equations.length === 0) {
    throw new Error("MEN-001 explanation must begin with Key Rule & Formula.");
  }
  if (!last || last.kind !== "FINAL_ANSWER" || !last.equations.includes(stripMathDelimiters(answer))) {
    throw new Error("MEN-001 explanation must end with the canonical final answer.");
  }
  const steps = explanation.sections.filter((section) => section.kind === "STEP");
  if (steps.length === 0) throw new Error("MEN-001 explanation must contain a step-by-step solution.");
  steps.forEach((step, index) => {
    if (step.stepNumber !== index + 1 || !step.title.trim()) {
      throw new Error("MEN-001 explanation steps must be sequential and titled.");
    }
    if (step.paragraphs.length === 0 && step.equations.length === 0) {
      throw new Error("MEN-001 explanation steps cannot be empty.");
    }
    if (index > 0 && step.title === steps[index - 1]!.title) {
      throw new Error("MEN-001 adjacent explanation steps must use distinct titles.");
    }
  });
  const shortcuts = explanation.sections.filter((section) => section.kind === "EXAM_SHORTCUT");
  const traps = explanation.sections.filter((section) => section.kind === "COMMON_TRAPS");
  if (shortcuts.length !== 1 || shortcuts[0]!.paragraphs.length + shortcuts[0]!.equations.length === 0) {
    throw new Error("MEN-001 explanation must contain one non-empty Exam Speed Shortcut block.");
  }
  if (traps.length !== 1 || traps[0]!.paragraphs.length !== 3) {
    throw new Error("MEN-001 explanation must explain all three wrong options in one Common Traps block.");
  }
  const firstStepIndex = explanation.sections.findIndex((section) => section.kind === "STEP");
  const shortcutIndex = explanation.sections.findIndex((section) => section.kind === "EXAM_SHORTCUT");
  const trapIndex = explanation.sections.findIndex((section) => section.kind === "COMMON_TRAPS");
  const finalIndex = explanation.sections.findIndex((section) => section.kind === "FINAL_ANSWER");
  if (!(firstStepIndex > 0 && shortcutIndex > firstStepIndex && trapIndex > shortcutIndex && finalIndex > trapIndex)) {
    throw new Error("MEN-001 explanation blocks are not in the required four-tier order.");
  }
}
