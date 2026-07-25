import { getMen001StructuredFormulaLines } from "./structured-formula-plans";
import type { Men001ExplanationSection } from "./structured-explanation";
import type { Men001SolveMode } from "./solve-mode-registry.all";

const TITLE_PARAGRAPHS: Record<string, string> = {
  "Apply Pythagoras":
    "Use the right triangle formed inside the figure to recover the missing perpendicular measurement.",
  "Add the Ratio Parts":
    "Add all ratio parts before converting them into actual side lengths.",
  "Find One Ratio Unit":
    "Divide the total perimeter by the sum of the ratio parts.",
  "Find the Actual Side Lengths":
    "Multiply each ratio part by the value of one ratio unit.",
  "Find the Semiperimeter":
    "Add the three sides and divide by two before using Heron's formula.",
  "Apply Heron's Formula":
    "Substitute the semiperimeter and the three sides in Heron's formula.",
  "Find the Available Wire":
    "Calculate the complete boundary length available for reshaping.",
  "Find the Radius":
    "Rearrange the relevant circle relation and recover the radius.",
  "Find the Breadth":
    "Rearrange the given relation and isolate the breadth.",
  "Find the Length":
    "Rearrange the given relation and isolate the length.",
  "Find the Side":
    "Rearrange the relevant relation and recover the side length.",
  "Area of the Outer Figure":
    "Calculate the area enclosed by the outer boundary.",
  "Area of the Inner Figure":
    "Calculate the inner area that must be removed.",
  "Find the Path Area":
    "Subtract the inner area from the outer area.",
  "Find the Border Area":
    "Subtract the inner region from the complete outer region.",
  "Use the Area Formula":
    "Use the recovered dimensions in the appropriate area formula.",
  "Use the Tile-Count Formula":
    "Divide the total area by the area covered by one tile.",
  "Find the Number of Tiles":
    "Carry out the division to obtain the required number of whole tiles.",
  "Calculate the Circumference":
    "Substitute the known circle measurement in the circumference formula.",
  "Calculate the Perimeter":
    "Substitute the known side measurements in the perimeter formula.",
  "Continue the Calculation":
    "Use the previous result in the next part of the calculation.",
  "Finalize the Numerical Result":
    "Evaluate the remaining expression to obtain the required numerical value.",
};

function humanizeMath(value: string) {
  let text = value
    .trim()
    .replace(/^Substitution:\s*/i, "")
    .replace(/^Calculation:\s*/i, "")
    .replace(/^\$\$/, "")
    .replace(/\$\$$/, "")
    .replace(/\\times/g, "×")
    .replace(/\\div/g, "÷")
    .replace(/\\cdot/g, "×")
    .replace(/\\pi/g, "π")
    .replace(/\\,/g, "")
    .replace(/\\text\{([^{}]+)\}/g, "$1")
    .replace(/\^\{2\}/g, "²")
    .replace(/\\sqrt\{([^{}]+)\}/g, (_, radicand: string) =>
      radicand.length === 1 ? `√${radicand}` : `√(${radicand})`)
    .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "$1/$2")
    .replace(/[{}]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text;
}

function semanticTitle(section: Extract<Men001ExplanationSection, { kind: "STEP" }>) {
  const text = [...section.paragraphs, ...section.equations].join(" ").toLowerCase();
  if (/pythagoras/.test(text)) return "Apply Pythagoras";
  if (/ratio sum/.test(text)) return "Add the Ratio Parts";
  if (/one ratio unit/.test(text)) return "Find One Ratio Unit";
  if (/actual side lengths/.test(text)) return "Find the Actual Side Lengths";
  if (/semiperimeter/.test(text)) return "Find the Semiperimeter";
  if (/heron's formula|heron’s formula/.test(text)) return "Apply Heron's Formula";
  if (/wire length|supplies .* wire|available wire/.test(text)) return "Find the Available Wire";
  if (/^radius\s*=|\bradius\s*=|\br\s*=/.test(text)) return "Find the Radius";
  if (/^breadth\s*=|\bbreadth\s*=/.test(text)) return "Find the Breadth";
  if (/^length\s*=|\blength\s*=/.test(text)) return "Find the Length";
  if (/^side\s*=|\bside\s*=/.test(text)) return "Find the Side";
  if (/outer area/.test(text)) return "Area of the Outer Figure";
  if (/inner area/.test(text)) return "Area of the Inner Figure";
  if (/path area/.test(text)) return "Find the Path Area";
  if (/border area/.test(text)) return "Find the Border Area";
  if (/now use a\s*=|area formula/.test(text)) return "Use the Area Formula";
  if (/number of tiles\s*=.*floor area.*tile area/.test(text)) return "Use the Tile-Count Formula";
  if (/tiles required\s*=/.test(text)) return "Find the Number of Tiles";
  if (/circumference\s*=/.test(text)) return "Calculate the Circumference";
  if (/perimeter\s*=/.test(text)) return "Calculate the Perimeter";
  return section.title;
}

export function normalizeMen001StructuredSections(
  sections: readonly Men001ExplanationSection[],
  solveMode: Men001SolveMode,
): Men001ExplanationSection[] {
  const stepIndexes = sections
    .map((section, index) => ({ section, index }))
    .filter((item) => item.section.kind === "STEP")
    .map((item) => item.index);
  const finalStepIndex = stepIndexes.at(-1);
  let previousStepTitle = "";

  return sections.map((section, sectionIndex) => {
    if (section.kind === "KEY_RULE") {
      return {
        ...section,
        equations: getMen001StructuredFormulaLines(solveMode).map(humanizeMath),
      };
    }
    if (section.kind === "FINAL_ANSWER") {
      return {
        ...section,
        equations: section.equations.map(humanizeMath),
      };
    }

    let title = semanticTitle(section);
    if (title === previousStepTitle) {
      title = sectionIndex === finalStepIndex
        ? "Finalize the Numerical Result"
        : "Continue the Calculation";
    }
    previousStepTitle = title;
    const changedTitle = title !== section.title;

    return {
      ...section,
      title,
      paragraphs: changedTitle && TITLE_PARAGRAPHS[title]
        ? [TITLE_PARAGRAPHS[title]!]
        : section.paragraphs,
      equations: section.equations.map(humanizeMath),
    };
  });
}
