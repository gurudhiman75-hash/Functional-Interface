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
  "Find the Largest Side":
    "Select the side corresponding to the largest ratio part.",
  "Find the Smallest Side":
    "Select the side corresponding to the smallest ratio part.",
  "Find the Semiperimeter":
    "Add the three sides and divide by two before using Heron's formula.",
  "Apply Heron's Formula":
    "Substitute the semiperimeter and the three sides in Heron's formula.",
  "Find the Available Wire":
    "Calculate the complete boundary length available for reshaping.",
  "Find the Sum of Length and Breadth":
    "Use half of the rectangle's perimeter to obtain the sum of its length and breadth.",
  "Find the Radius":
    "Rearrange the relevant circle relation and recover the radius.",
  "Find the Breadth":
    "Rearrange the given relation and isolate the breadth.",
  "Find the Length":
    "Rearrange the given relation and isolate the length.",
  "Find the Height":
    "Rearrange the given relation and isolate the perpendicular height.",
  "Find the Side":
    "Rearrange the relevant relation and recover the side length.",
  "Find the Diameter":
    "Use the radius or circumference relation to recover the diameter.",
  "Find the Central Angle":
    "Rearrange the arc or sector relation to recover the central angle.",
  "Calculate the Area":
    "Substitute the known measurements in the relevant area formula.",
  "Calculate the Total Area":
    "Combine the component areas according to the Key Rule.",
  "Calculate the Area Difference":
    "Subtract the smaller enclosed area from the larger one.",
  "Area of the Outer Figure":
    "Calculate the area enclosed by the outer boundary.",
  "Area of the Inner Figure":
    "Calculate the inner area that must be removed.",
  "Find the Path Area":
    "Subtract the inner area from the outer area.",
  "Find the Border Area":
    "Subtract the inner region from the complete outer region.",
  "Find the Remaining Area":
    "Subtract the excluded region from the complete area.",
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
  "Calculate the Distance":
    "Multiply or divide by the wheel circumference as required.",
  "Find the Number of Revolutions":
    "Divide the travelled distance by the distance covered in one revolution.",
  "Calculate the Cost":
    "Multiply the required measure by the stated rate.",
  "Identify the Rate":
    "Use the rate stated in the question with the corresponding measure.",
  "Calculate the Rate":
    "Divide the total cost by the corresponding area or boundary length.",
  "Identify the Number of Rounds":
    "Use the stated number of complete rounds in the total boundary calculation.",
  "Apply the Scale Relation":
    "Substitute the corresponding measures in the scale relation.",
  "Calculate the Percentage Change":
    "Evaluate the dimension-change factors and convert the result to a percentage.",
  "Continue the Calculation":
    "Use the previous result in the next part of the calculation.",
  "Finalize the Numerical Result":
    "Evaluate the remaining expression to obtain the required numerical value.",
};

function humanizeMath(value: string) {
  const text = value
    .trim()
    .replace(/^Substitution:\s*/i, "")
    .replace(/^Calculation:\s*/i, "")
    .replace(/^\$\$/, "")
    .replace(/\$\$$/, "")
    .replace(/\$/g, "")
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

function textOf(section: Extract<Men001ExplanationSection, { kind: "STEP" }>) {
  return [...section.paragraphs, ...section.equations].join(" ").toLowerCase();
}

function quantityTitleFromEquation(
  section: Extract<Men001ExplanationSection, { kind: "STEP" }>,
  solveMode: Men001SolveMode,
) {
  const text = textOf(section);
  if (/total area\s*=/.test(text)) return "Calculate the Total Area";
  if (/area difference|difference\s*=/.test(text)) return "Calculate the Area Difference";
  if (/remaining area|uncovered area/.test(text)) return "Find the Remaining Area";
  if (/path area/.test(text)) return "Find the Path Area";
  if (/border area/.test(text)) return "Find the Border Area";
  if (/outer area/.test(text)) return "Area of the Outer Figure";
  if (/inner area/.test(text)) return "Area of the Inner Figure";
  if (/tiles required|number of tiles\s*=/.test(text)) return "Find the Number of Tiles";
  if (/revolutions\s*=/.test(text)) return "Find the Number of Revolutions";
  if (/distance\s*=/.test(text)) return "Calculate the Distance";
  if (/cost\s*=/.test(text)) return "Calculate the Cost";
  if (/rate\s*=/.test(text)) return "Calculate the Rate";
  if (/circumference\s*=/.test(text)) return "Calculate the Circumference";
  if (/perimeter\s*=/.test(text)) return "Calculate the Perimeter";
  if (/l\s*\+\s*b\s*=|length\s*\+\s*breadth\s*=/.test(text)) {
    return "Find the Sum of Length and Breadth";
  }
  if (/^radius\s*=|\bradius\s*=|\br\s*=/.test(text)) return "Find the Radius";
  if (/diameter\s*=|\bd\s*=/.test(text) && /diameter/i.test(solveMode)) return "Find the Diameter";
  if (/breadth\s*=|\bb\s*=/.test(text) && /breadth|rectangle/i.test(solveMode)) return "Find the Breadth";
  if (/length\s*=|\bl\s*=/.test(text) && /length|rectangle/i.test(solveMode)) return "Find the Length";
  if (/height\s*=|\bh\s*=/.test(text) && /height/i.test(solveMode)) return "Find the Height";
  if (/side\s*=|\ba\s*=/.test(text) && /side|square|hexagon|triangle/i.test(solveMode)) return "Find the Side";
  if (/angle\s*=|\bθ\s*=/.test(text)) return "Find the Central Angle";
  if (/area\s*=|\ba\s*=/.test(text) && /area/i.test(solveMode)) return "Calculate the Area";
  return undefined;
}

function semanticTitle(
  section: Extract<Men001ExplanationSection, { kind: "STEP" }>,
  solveMode: Men001SolveMode,
) {
  if (section.title === "Find the Semicircle's Radius") return section.title;
  const text = textOf(section);
  if (/pythagoras/.test(text)) return "Apply Pythagoras";
  if (/ratio sum/.test(text)) return "Add the Ratio Parts";
  if (/one ratio unit/.test(text)) return "Find One Ratio Unit";
  if (/actual side lengths|actual sides are/.test(text)) return "Find the Actual Side Lengths";
  if (/largest side/.test(text)) return "Find the Largest Side";
  if (/smallest side/.test(text)) return "Find the Smallest Side";
  if (/semiperimeter/.test(text)) return "Find the Semiperimeter";
  if (/heron's formula|heron’s formula/.test(text)) return "Apply Heron's Formula";
  if (/wire length|supplies .* wire|available wire/.test(text)) return "Find the Available Wire";
  if (/rate is ₹|rate is rs|rate is \$/.test(text)) return "Identify the Rate";
  if (/complete rounds|number of rounds/.test(text)) return "Identify the Number of Rounds";
  if (/now use a\s*=|area formula/.test(text)) return "Use the Area Formula";
  if (/number of tiles\s*=.*floor area.*tile area/.test(text)) return "Use the Tile-Count Formula";
  const quantityTitle = quantityTitleFromEquation(section, solveMode);
  if (quantityTitle) return quantityTitle;
  return section.title;
}

function equationFromNarrative(
  section: Extract<Men001ExplanationSection, { kind: "STEP" }>,
  finalAnswer: string,
) {
  if (section.equations.length > 0) return section.equations;
  const text = section.paragraphs.join(" ");
  const numbers = text.match(/\d+(?:\.\d+)?/g) ?? [];
  if (/coefficient simplifies to/i.test(text)) return [`A = ${finalAnswer}`];
  if (/actual side lengths|actual sides are/i.test(text) && numbers.length >= 3) {
    return [`a = ${numbers[0]}, b = ${numbers[1]}, c = ${numbers[2]}`];
  }
  if (/largest side is/i.test(text) && numbers.length >= 1) {
    return [`largest side = ${numbers.at(-1)}`];
  }
  if (/smallest side is/i.test(text) && numbers.length >= 1) {
    return [`smallest side = ${numbers.at(-1)}`];
  }
  if (/same region covers/i.test(text) && numbers.length >= 1) {
    return [`converted area = ${finalAnswer}`];
  }
  if (/^\d+(?:\.\d+)? square centimetres/i.test(text)) {
    return [`converted area = ${finalAnswer}`];
  }
  if (/combined numerator is/i.test(text) && numbers.length >= 1) {
    return [`combined numerator = ${numbers.at(-1)}`];
  }
  if (/their areas are/i.test(text) && numbers.length >= 2) {
    return [`first area = ${numbers[0]}, second area = ${numbers[1]}`];
  }
  if (/complete rounds/i.test(text) && numbers.length >= 1) {
    return [`number of rounds = ${numbers[0]}`];
  }
  return section.equations;
}

function shouldMergeSteps(
  previous: Extract<Men001ExplanationSection, { kind: "STEP" }>,
  current: Extract<Men001ExplanationSection, { kind: "STEP" }>,
) {
  if (previous.equations.length === 0 && current.equations.length > 0) {
    return [
      "Convert the Units",
      "Use the Area Formula",
      "Area of the Circle",
      "Area of the Square",
      "Apply the Scale Relation",
    ].includes(previous.title) && [
      "Complete the Calculation",
      "Finalize the Numerical Result",
      "Find the Length",
      "Find the Side",
      "Calculate the Area",
    ].includes(current.title);
  }
  if (
    current.title === "Finalize the Numerical Result" &&
    previous.equations.length > 0 &&
    current.equations.length > 0
  ) return true;
  return false;
}

function mergeAndRenumber(sections: Men001ExplanationSection[]) {
  const merged: Men001ExplanationSection[] = [];
  for (const section of sections) {
    const previous = merged.at(-1);
    if (
      section.kind === "STEP" &&
      previous?.kind === "STEP" &&
      shouldMergeSteps(previous, section)
    ) {
      previous.paragraphs = [...new Set([...previous.paragraphs, ...section.paragraphs])];
      previous.equations = [...previous.equations, ...section.equations];
      continue;
    }
    merged.push(section);
  }
  let stepNumber = 0;
  return merged.map((section) => {
    if (section.kind !== "STEP") return section;
    stepNumber += 1;
    return { ...section, stepNumber };
  });
}

export function normalizeMen001StructuredSections(
  sections: readonly Men001ExplanationSection[],
  solveMode: Men001SolveMode,
): Men001ExplanationSection[] {
  const finalAnswer = humanizeMath(
    sections.find((section) => section.kind === "FINAL_ANSWER")?.equations[0] ?? "",
  );
  let previousStepTitle = "";
  const normalized = sections.map((section) => {
    if (section.kind === "KEY_RULE") {
      return {
        ...section,
        paragraphs: section.paragraphs.map(humanizeMath),
        equations: getMen001StructuredFormulaLines(solveMode).map(humanizeMath),
      };
    }
    if (section.kind === "FINAL_ANSWER") {
      return {
        ...section,
        paragraphs: section.paragraphs.map(humanizeMath),
        equations: section.equations.map(humanizeMath),
      };
    }

    const humanizedSection = {
      ...section,
      paragraphs: section.paragraphs.map(humanizeMath),
      equations: section.equations.map(humanizeMath),
    };
    let title = semanticTitle(humanizedSection, solveMode);
    if (title === previousStepTitle) {
      title = "Continue the Calculation";
    }
    previousStepTitle = title;
    const changedTitle = title !== section.title;
    const equations = equationFromNarrative(humanizedSection, finalAnswer).map(humanizeMath);

    return {
      ...humanizedSection,
      title,
      paragraphs: changedTitle && TITLE_PARAGRAPHS[title]
        ? [TITLE_PARAGRAPHS[title]!]
        : humanizedSection.paragraphs,
      equations,
    };
  });

  const merged = mergeAndRenumber(normalized);
  let lastTitle = "";
  return merged.map((section) => {
    if (section.kind !== "STEP") return section;
    let title = section.title;
    if (title === lastTitle) title = "Finalize the Numerical Result";
    lastTitle = title;
    return {
      ...section,
      title,
      paragraphs: title !== section.title && TITLE_PARAGRAPHS[title]
        ? [TITLE_PARAGRAPHS[title]!]
        : section.paragraphs,
    };
  });
}
