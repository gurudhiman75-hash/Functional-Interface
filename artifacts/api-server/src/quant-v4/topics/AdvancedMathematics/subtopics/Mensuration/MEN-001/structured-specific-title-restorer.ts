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

const GENERIC_TITLES = new Set([
  "Calculate the Required Area",
  "Complete the Calculation",
  "Continue the Calculation",
  "Finalize the Numerical Result",
  "Set Up the Numerical Calculation",
  "Simplify the Area",
  "Simplify the Calculation",
  "Substitute in the Area Formula",
  "Substitute the Given Values",
  "Use the Area Formula",
]);

const TITLE_PARAGRAPHS: Record<string, string> = {
  "Apply Heron's Formula":
    "Substitute the semiperimeter and the three sides in Heron's formula, then simplify the radical.",
  "Apply Pythagoras":
    "Use the right triangle in the figure to recover the missing perpendicular measurement.",
  "Apply the Percentage Change":
    "Convert each percentage change into its multiplicative factor and combine the factors.",
  "Apply the Scale Relation":
    "Substitute the corresponding measures in the appropriate linear or square scale relation.",
  "Area of One Tile":
    "Multiply the tile dimensions after writing them in the same square unit as the floor.",
  "Area of the Circle":
    "Substitute the radius in the circle-area formula and simplify.",
  "Area of the Inner Figure":
    "Calculate the inner area that must be removed from the complete region.",
  "Area of the Outer Figure":
    "Calculate the area enclosed by the outer boundary.",
  "Area of the Rectangle":
    "Multiply the rectangle's length by its breadth.",
  "Area of the Semicircle":
    "Use half of the full-circle area and simplify with the declared value of π.",
  "Area of the Square":
    "Square the side length to obtain the enclosed area.",
  "Calculate the Area":
    "Substitute the known measurements in the governing area formula and simplify.",
  "Calculate the Area Difference":
    "Find the two enclosed areas and subtract the smaller from the larger.",
  "Calculate the Central Angle":
    "Rearrange the arc or sector relation to isolate the central angle.",
  "Calculate the Circumference":
    "Substitute the known circle measurement in the circumference formula.",
  "Calculate the Cost":
    "Multiply the required area or boundary length by the stated rate.",
  "Calculate the Distance":
    "Use the distance covered in one revolution with the number of revolutions.",
  "Calculate the Perimeter":
    "Substitute the side measurements in the relevant perimeter formula.",
  "Calculate the Rate":
    "Divide the total cost by the corresponding area or boundary length.",
  "Combine the Results":
    "Combine the component values according to the relation stated in the Key Rule.",
  "Convert the Units":
    "Write all measurements in compatible units before carrying out the calculation.",
  "Find the Base":
    "Rearrange the area relation and isolate the base.",
  "Find the Border Area":
    "Subtract the inner region from the complete outer region.",
  "Find the Breadth":
    "Rearrange the given relation and isolate the breadth.",
  "Find the Central Angle":
    "Rearrange the arc or sector relation and isolate the angle.",
  "Find the Diameter":
    "Use the radius, area or circumference relation to recover the diameter.",
  "Find the Diagonal":
    "Rearrange the relevant diagonal relation and isolate the missing diagonal.",
  "Find the Height":
    "Rearrange the area relation and isolate the perpendicular height.",
  "Find the Length":
    "Rearrange the given relation and isolate the length.",
  "Find the Number of Revolutions":
    "Divide the total distance by the distance covered in one complete revolution.",
  "Find the Number of Tiles":
    "Divide the total required area by the area covered by one tile.",
  "Find the Path Area":
    "Subtract the inner area from the outer area.",
  "Find the Radius":
    "Rearrange the relevant circle relation and isolate the radius.",
  "Find the Remaining Area":
    "Subtract the excluded or covered region from the complete area.",
  "Find the Semiperimeter":
    "Add the three sides and divide by two before applying Heron's formula.",
  "Find the Side":
    "Rearrange the relevant area or perimeter relation and isolate the side length.",
  "Find the Sum of Length and Breadth":
    "Use half of the rectangle's perimeter to obtain the sum of its length and breadth.",
  "Find the Width":
    "Rearrange the path-area relation and isolate the path width.",
  "Use the Tile-Count Formula":
    "Divide the total area by the area covered by one tile.",
};

const BAD_PARAGRAPH = /^(Evaluate the (final|remaining)|Rearrange the relevant relation and recover the side length|Use the recovered dimensions|Use the previous result|Substitute the supplied measurements|Carry out this part)/i;

function spaceBeforeUnit(value: string) {
  return value
    .replace(/(√\d+|\d+(?:\.\d+)?)(m²|cm²|m|cm)\b/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim();
}

function equationLeft(value: string) {
  const left = value.split("=")[0]?.trim() ?? "";
  return left
    .replace(/^(now use|by pythagoras,|heron's formula is|using these values,)\s*/i, "")
    .replace(/[^A-Za-zθ₁₂]+/g, "")
    .toLowerCase();
}

function titleFromEquation(
  section: Extract<Men001ExplanationSection, { kind: "STEP" }>,
  solveMode: Men001SolveMode,
) {
  const equation = section.equations[0] ?? "";
  const rawLeft = equation.split("=")[0]?.trim() ?? "";
  const left = equationLeft(equation);
  const text = [...section.paragraphs, ...section.equations].join(" ").toLowerCase();

  if (/pythagoras/.test(text)) return "Apply Pythagoras";
  if (/heron's formula|heron’s formula/.test(text)) return "Apply Heron's Formula";
  if (/outer area/.test(text)) return "Area of the Outer Figure";
  if (/inner area/.test(text)) return "Area of the Inner Figure";
  if (/path area/.test(text)) return "Find the Path Area";
  if (/border area/.test(text)) return "Find the Border Area";
  if (/remaining area|uncovered area/.test(text)) return "Find the Remaining Area";
  if (/tiles required|number of tiles/.test(text)) return "Find the Number of Tiles";
  if (/revolutions/.test(text) && equation.includes("=")) return "Find the Number of Revolutions";
  if (/distance/.test(rawLeft)) return "Calculate the Distance";
  if (/cost/.test(rawLeft)) return "Calculate the Cost";
  if (/rate/.test(rawLeft)) return "Calculate the Rate";
  if (/circumference/.test(rawLeft) || left === "c") return "Calculate the Circumference";
  if (/perimeter/.test(rawLeft) || left === "p") return "Calculate the Perimeter";
  if (/area difference|difference/.test(rawLeft)) return "Calculate the Area Difference";
  if (/total area/.test(rawLeft)) return "Combine the Results";
  if (/area/.test(rawLeft) || left === "a" && /^[A-Z]\s*=/.test(equation)) {
    return "Calculate the Area";
  }
  if (/angle/.test(rawLeft) || left === "θ") return "Find the Central Angle";
  if (/radius/.test(rawLeft) || left === "r") return "Find the Radius";
  if (/diameter/.test(rawLeft) || left === "d" && /Diameter/.test(solveMode)) {
    return "Find the Diameter";
  }
  if (/diagonal/.test(rawLeft) || left.startsWith("d") && /Diagonal/.test(solveMode)) {
    return "Find the Diagonal";
  }
  if (/length/.test(rawLeft) || left === "l") return "Find the Length";
  if (/breadth/.test(rawLeft) || left === "b" && /Breadth|Rectangle/.test(solveMode)) {
    return "Find the Breadth";
  }
  if (/base/.test(rawLeft) || left === "b" && /Base/.test(solveMode)) return "Find the Base";
  if (/height/.test(rawLeft) || left === "h") return "Find the Height";
  if (/width/.test(rawLeft) || left === "w") return "Find the Width";
  if (/side/.test(rawLeft) || left === "a") return "Find the Side";
  if (/l\s*\+\s*b/.test(equation)) return "Find the Sum of Length and Breadth";
  return section.title;
}

function canonicalParagraph(
  title: string,
  existing: readonly string[],
  changedTitle: boolean,
) {
  const canonical = TITLE_PARAGRAPHS[title];
  if (!canonical) return [...existing];
  if (changedTitle || existing.length === 0 || existing.some((item) => BAD_PARAGRAPH.test(item))) {
    return [canonical];
  }
  return [...existing];
}

function chooseMergedTitle(previous: string, current: string) {
  if (GENERIC_TITLES.has(previous) && !GENERIC_TITLES.has(current)) return current;
  return previous;
}

function mergeConsecutiveSameQuantity(sections: Men001ExplanationSection[]) {
  const result: Men001ExplanationSection[] = [];
  for (const section of sections) {
    const previous = result.at(-1);
    if (section.kind === "STEP" && previous?.kind === "STEP") {
      const previousLeft = equationLeft(previous.equations.at(-1) ?? "");
      const currentLeft = equationLeft(section.equations[0] ?? "");
      if (previousLeft && previousLeft === currentLeft) {
        const title = chooseMergedTitle(previous.title, section.title);
        previous.title = title;
        previous.paragraphs = canonicalParagraph(
          title,
          [...previous.paragraphs, ...section.paragraphs],
          true,
        );
        previous.equations = [...previous.equations, ...section.equations];
        continue;
      }
    }
    result.push(section);
  }
  return result;
}

function guaranteeDistinctTitles(sections: Men001ExplanationSection[]) {
  let previousTitle = "";
  return sections.map((section, index): Men001ExplanationSection => {
    if (section.kind !== "STEP") return section;
    let title = section.title;
    if (title === previousTitle) {
      const hasLaterStep = sections.slice(index + 1).some((candidate) => candidate.kind === "STEP");
      title = hasLaterStep ? "Continue the Calculation" : "Finalize the Numerical Result";
    }
    previousTitle = title;
    return {
      ...section,
      title,
      paragraphs: canonicalParagraph(title, section.paragraphs, title !== section.title),
    };
  });
}

function renumber(sections: Men001ExplanationSection[]) {
  let stepNumber = 0;
  return sections.map((section) => {
    if (section.kind !== "STEP") return section;
    stepNumber += 1;
    return { ...section, stepNumber };
  });
}

export function restoreMen001SpecificStepAuthorship(
  sections: readonly Men001ExplanationSection[],
  solveMode: Men001SolveMode,
): Men001ExplanationSection[] {
  let approvedStepIndex = 0;
  const refined = sections.map((section): Men001ExplanationSection => {
    const paragraphs = section.paragraphs.map(spaceBeforeUnit);
    const equations = section.equations.map(spaceBeforeUnit);
    if (section.kind !== "STEP") return { ...section, paragraphs, equations };

    if (solveMode === "findRectangleSemicircleCompositeArea") {
      const authored = RECTANGLE_SEMICIRCLE_STEPS[approvedStepIndex];
      approvedStepIndex += 1;
      if (authored) {
        return {
          ...section,
          title: authored.title,
          paragraphs: [authored.paragraph],
          equations,
        };
      }
    }

    const title = titleFromEquation({ ...section, paragraphs, equations }, solveMode);
    return {
      ...section,
      title,
      paragraphs: canonicalParagraph(title, paragraphs, title !== section.title),
      equations,
    };
  });

  const merged = solveMode === "findRectangleSemicircleCompositeArea"
    ? refined
    : mergeConsecutiveSameQuantity(refined);
  return renumber(guaranteeDistinctTitles(merged));
}
