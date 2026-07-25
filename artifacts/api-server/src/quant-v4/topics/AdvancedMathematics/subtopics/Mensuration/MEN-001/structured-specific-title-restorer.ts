import type { Men001ExplanationSection } from "./structured-explanation";
import type { Men001SolveMode } from "./solve-mode-registry.all";

const RECTANGLE_SEMICIRCLE_STEPS = [
  {
    title: "Area of the Rectangle",
    paragraph: "Multiply the rectangle's length by its breadth.",
  },
  {
    title: "Find the Semicircle's Radius",
    paragraph:
      "The attached side is the semicircle's diameter, so divide it by two to obtain the radius.",
  },
  {
    title: "Area of the Semicircle",
    paragraph: "Use half of the full-circle area and simplify with the declared value of π.",
  },
  {
    title: "Add the Two Areas",
    paragraph: "The rectangle and semicircle do not overlap, so add their areas.",
  },
] as const;

function spaceBeforeUnit(value: string) {
  return value
    .replace(/(√\d+|\d+(?:\.\d+)?)(m²|cm²|m|cm)\b/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim();
}

function equationLeft(value: string) {
  const left = value.split("=")[0]?.trim().toLowerCase() ?? "";
  return left
    .replace(/^(now use|by pythagoras,|heron's formula is)\s*/i, "")
    .replace(/[^a-zθ]+/g, "");
}

function refineTitle(
  section: Extract<Men001ExplanationSection, { kind: "STEP" }>,
  solveMode: Men001SolveMode,
) {
  const equations = section.equations.join(" ");
  if (/^Inner area\s*=/i.test(equations)) return "Area of the Inner Figure";
  if (/^Outer area\s*=/i.test(equations)) return "Area of the Outer Figure";
  if (/^A\s*=/.test(equations) && /Area/.test(solveMode)) {
    if (/Heron/i.test(solveMode)) return "Substitute in Heron's Formula";
    return "Calculate the Area";
  }
  if (/^l\s*=/.test(equations) && /Length/.test(solveMode)) return "Find the Length";
  if (/^b\s*=/.test(equations) && /Breadth/.test(solveMode)) return "Find the Breadth";
  if (/^h\s*=/.test(equations) && /Height/.test(solveMode)) return "Find the Height";
  return section.title;
}

function mergeSameQuantityContinuations(sections: Men001ExplanationSection[]) {
  const result: Men001ExplanationSection[] = [];
  for (const section of sections) {
    const previous = result.at(-1);
    if (section.kind === "STEP" && previous?.kind === "STEP") {
      const previousLeft = equationLeft(previous.equations.at(-1) ?? "");
      const currentLeft = equationLeft(section.equations[0] ?? "");
      const continuation = [
        "Continue the Calculation",
        "Finalize the Numerical Result",
        "Complete the Calculation",
        "Substitute in the Area Formula",
      ].includes(section.title);
      if (continuation && previousLeft && previousLeft === currentLeft) {
        previous.equations = [...previous.equations, ...section.equations];
        previous.paragraphs = previous.paragraphs.filter(
          (paragraph) => !/^Evaluate the (final|remaining)/i.test(paragraph),
        );
        continue;
      }
    }
    result.push(section);
  }

  let stepNumber = 0;
  return result.map((section) => {
    if (section.kind !== "STEP") return section;
    stepNumber += 1;
    return { ...section, stepNumber };
  });
}

export function restoreMen001SpecificStepAuthorship(
  sections: readonly Men001ExplanationSection[],
  solveMode: Men001SolveMode,
): Men001ExplanationSection[] {
  let stepIndex = 0;
  const refined = sections.map((section): Men001ExplanationSection => {
    const paragraphs = section.paragraphs.map(spaceBeforeUnit);
    const equations = section.equations.map(spaceBeforeUnit);
    if (section.kind !== "STEP") return { ...section, paragraphs, equations };

    if (solveMode === "findRectangleSemicircleCompositeArea") {
      const authored = RECTANGLE_SEMICIRCLE_STEPS[stepIndex];
      stepIndex += 1;
      if (authored) {
        return {
          ...section,
          title: authored.title,
          paragraphs: [authored.paragraph],
          equations,
        };
      }
    }

    return {
      ...section,
      title: refineTitle(section, solveMode),
      paragraphs,
      equations,
    };
  });

  return mergeSameQuantityContinuations(refined);
}
