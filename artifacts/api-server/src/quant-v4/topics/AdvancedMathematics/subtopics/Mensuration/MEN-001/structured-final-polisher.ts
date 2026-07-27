import type { Men001ExplanationSection } from "./structured-explanation";
import type { Men001SolveMode } from "./solve-mode-registry.all";

const APPROVED_COMPOSITE_TITLES = [
  "Area of the Rectangle",
  "Find the Semicircle's Radius",
  "Area of the Semicircle",
  "Add the Two Areas",
] as const;

const PARAGRAPH_BY_TITLE: Record<string, string> = {
  "Add the Ratio Parts": "Add all ratio parts before converting the ratio into actual side lengths.",
  "Add the Two Areas": "The two component regions do not overlap, so add their areas.",
  "Apply Heron's Formula": "Substitute the semiperimeter and the three side lengths in Heron's formula, then simplify the radical.",
  "Apply Pythagoras": "Use the right triangle in the figure to recover the missing perpendicular measurement.",
  "Apply the Percentage Change": "Convert each percentage change into a multiplicative factor and combine the factors.",
  "Apply the Scale Relation": "Substitute the corresponding measures in the appropriate linear or square scale relation.",
  "Area of One Tile": "Multiply the tile dimensions after writing them in the same square unit as the floor.",
  "Area of the Circle": "Substitute the radius in the circle-area formula and simplify.",
  "Area of the Inner Figure": "Calculate the inner area that must be removed from the complete region.",
  "Area of the Outer Figure": "Calculate the area enclosed by the outer boundary.",
  "Area of the Rectangle": "Multiply the rectangle's length by its breadth.",
  "Area of the Semicircle": "Use half of the full-circle area and simplify with the declared value of π.",
  "Area of the Square": "Square the side length to obtain the enclosed area.",
  "Calculate the Area Difference": "Find the two enclosed areas and subtract the smaller from the larger.",
  "Calculate the Circumference": "Substitute the known circle measurement in the circumference formula.",
  "Calculate the Cost": "Multiply the required area or boundary length by the stated rate.",
  "Calculate the Distance": "Use the distance covered in one revolution with the number of revolutions.",
  "Calculate the Perimeter": "Substitute the side measurements in the relevant perimeter formula.",
  "Calculate the Rate": "Divide the total cost by the corresponding area or boundary length.",
  "Convert the Units": "Write all measurements in compatible units before carrying out the calculation.",
  "Find One Ratio Unit": "Divide the total perimeter by the sum of the ratio parts.",
  "Find the Actual Side Lengths": "Multiply each ratio part by the value of one ratio unit.",
  "Find the Base": "Rearrange the area relation and isolate the base.",
  "Find the Border Area": "Subtract the inner region from the complete outer region.",
  "Find the Breadth": "Rearrange the given relation and isolate the breadth.",
  "Find the Central Angle": "Rearrange the arc or sector relation and isolate the central angle.",
  "Find the Diameter": "Use the radius, area or circumference relation to recover the diameter.",
  "Find the Diagonal": "Rearrange the relevant diagonal relation and isolate the missing diagonal.",
  "Find the Height": "Rearrange the area relation and isolate the perpendicular height.",
  "Find the Largest Side": "Select the side corresponding to the largest ratio part.",
  "Find the Length": "Rearrange the given relation and isolate the length.",
  "Find the New Area Percentage": "Multiply the changed linear percentages to express the new area as a percentage of the original.",
  "Find the Number of Revolutions": "Divide the total distance by the distance covered in one complete revolution.",
  "Find the Number of Tiles": "Divide the total required area by the area covered by one tile.",
  "Find the Path Area": "Subtract the inner area from the outer area.",
  "Find the Percentage Decrease": "Subtract the new area percentage from the original 100%.",
  "Find the Percentage Increase": "Subtract the original 100% from the new area percentage.",
  "Find the Radius": "Rearrange the relevant circle relation and isolate the radius.",
  "Find the Remaining Area": "Subtract the excluded or covered region from the complete area.",
  "Find the Semicircle's Radius": "The attached side is the semicircle's diameter, so divide it by two to obtain the radius.",
  "Find the Semiperimeter": "Add the three sides and divide by two before applying Heron's formula.",
  "Find the Side": "Rearrange the relevant area or perimeter relation and isolate the side length.",
  "Find the Smallest Side": "Select the side corresponding to the smallest ratio part.",
  "Find the Sum of Length and Breadth": "Use half of the rectangle's perimeter to obtain the sum of its length and breadth.",
  "Find the Width": "Rearrange the path-area relation and isolate the path width.",
  "Use the Tile-Count Formula": "Divide the total area by the area covered by one tile.",
};

const EQUATION_SUFFICIENT_TITLES = new Set([
  "Calculate the Area",
  "Combine the Results",
  "Continue the Calculation",
  "Finalize the Numerical Result",
]);

function allText(section: Extract<Men001ExplanationSection, { kind: "STEP" }>) {
  return [...section.equations, ...section.paragraphs].join(" ");
}

function firstLeft(section: Extract<Men001ExplanationSection, { kind: "STEP" }>) {
  const left = section.equations[0]?.split("=")[0]?.trim() ?? "";
  return left
    .replace(/^(Semiperimeter:|Heron's formula is|Now use|Using these values,|For the rectangle,)\s*/i, "")
    .replace(/[^A-Za-zθ₁₂+]+/g, "")
    .toLowerCase();
}

function deriveTitle(
  section: Extract<Men001ExplanationSection, { kind: "STEP" }>,
  solveMode: Men001SolveMode,
) {
  const text = allText(section);
  const lower = text.toLowerCase();
  const leftRaw = section.equations[0]?.split("=")[0]?.trim() ?? "";
  const left = firstLeft(section);

  if (/ratio sum/.test(lower)) return "Add the Ratio Parts";
  if (/one ratio unit/.test(lower)) return "Find One Ratio Unit";
  if (/\ba\s*=.*\bb\s*=.*\bc\s*=/.test(lower) || /actual side lengths/.test(lower)) {
    return "Find the Actual Side Lengths";
  }
  if (/largest side/.test(lower)) return "Find the Largest Side";
  if (/smallest side/.test(lower)) return "Find the Smallest Side";
  if (/semiperimeter/.test(lower)) return "Find the Semiperimeter";
  if (/heron's formula|heron’s formula/.test(lower)) return "Apply Heron's Formula";
  if (/pythagoras/.test(lower)) return "Apply Pythagoras";
  if (/new area percentage|new area\s*=.*%\s*of\s*the\s*original/.test(lower)) {
    return "Find the New Area Percentage";
  }
  if (/\bincrease\s*=/.test(lower)) return "Find the Percentage Increase";
  if (/\bdecrease\s*=/.test(lower)) return "Find the Percentage Decrease";
  if (/outer area/.test(lower)) return "Area of the Outer Figure";
  if (/inner area/.test(lower)) return "Area of the Inner Figure";
  if (/path area/.test(lower)) return "Find the Path Area";
  if (/border area/.test(lower)) return "Find the Border Area";
  if (/remaining area|uncovered area/.test(lower)) return "Find the Remaining Area";
  if (/number of tiles|tiles required/.test(lower)) return "Find the Number of Tiles";
  if (/revolutions\s*=/.test(lower)) return "Find the Number of Revolutions";
  if (/total area/.test(lower)) return "Combine the Results";
  if (/area difference|difference\s*=/.test(lower)) return "Calculate the Area Difference";
  if (/l\s*\+\s*b\s*=|length\s*\+\s*breadth\s*=/.test(lower)) {
    return "Find the Sum of Length and Breadth";
  }
  if (/\bcentral angle\b|\bangle\s*=/.test(lower) || left === "θ") {
    return "Find the Central Angle";
  }
  if (/circumference/.test(leftRaw.toLowerCase()) || left === "c") {
    return "Calculate the Circumference";
  }
  if (/perimeter/.test(leftRaw.toLowerCase()) || left === "p") {
    return "Calculate the Perimeter";
  }
  if (/cost/.test(leftRaw.toLowerCase())) return "Calculate the Cost";
  if (/rate/.test(leftRaw.toLowerCase())) return "Calculate the Rate";
  if (/distance/.test(leftRaw.toLowerCase())) return "Calculate the Distance";
  if (/radius/.test(leftRaw.toLowerCase()) || left === "r") return "Find the Radius";
  if (/diameter/.test(leftRaw.toLowerCase()) || left === "d" && /Diameter/.test(solveMode)) {
    return "Find the Diameter";
  }
  if (/diagonal/.test(leftRaw.toLowerCase()) || left.startsWith("d") && /Diagonal/.test(solveMode)) {
    return "Find the Diagonal";
  }
  if (/length/.test(leftRaw.toLowerCase()) || left === "l") return "Find the Length";
  if (/breadth/.test(leftRaw.toLowerCase()) || left === "b" && /Breadth|Rectangle/.test(solveMode)) {
    return "Find the Breadth";
  }
  if (/base/.test(leftRaw.toLowerCase()) || left === "b" && /Base/.test(solveMode)) {
    return "Find the Base";
  }
  if (/height/.test(leftRaw.toLowerCase()) || left === "h") return "Find the Height";
  if (/width/.test(leftRaw.toLowerCase()) || left === "w") return "Find the Width";
  if (/area/.test(leftRaw.toLowerCase()) || left === "a" && /^A\s*=/.test(section.equations[0] ?? "")) {
    return "Calculate the Area";
  }
  if (/side/.test(leftRaw.toLowerCase()) || left === "a") return "Find the Side";

  return section.title;
}

function equationIdentity(section: Extract<Men001ExplanationSection, { kind: "STEP" }>) {
  return firstLeft(section);
}

function mergeSameQuantity(sections: Men001ExplanationSection[]) {
  const result: Men001ExplanationSection[] = [];
  for (const section of sections) {
    const previous = result.at(-1);
    if (section.kind === "STEP" && previous?.kind === "STEP") {
      if (previous.title === section.title) {
        previous.paragraphs = [...new Set([...previous.paragraphs, ...section.paragraphs])];
        previous.equations = [...previous.equations, ...section.equations];
        continue;
      }
      const previousIdentity = equationIdentity(previous);
      const currentIdentity = equationIdentity(section);
      if (previousIdentity && previousIdentity === currentIdentity) {
        previous.paragraphs = [...new Set([...previous.paragraphs, ...section.paragraphs])];
        previous.equations = [...previous.equations, ...section.equations];
        continue;
      }
    }
    result.push(section);
  }
  return result;
}

function paragraphsForTitle(
  title: string,
  section: Extract<Men001ExplanationSection, { kind: "STEP" }>,
) {
  if (section.equations.length > 0 && EQUATION_SUFFICIENT_TITLES.has(title)) return [];
  const paragraph = PARAGRAPH_BY_TITLE[title] ?? section.paragraphs[0];
  return paragraph ? [paragraph] : [];
}

function renumberAndDeduplicate(sections: Men001ExplanationSection[]) {
  let stepNumber = 0;
  let previousTitle = "";
  return sections.map((section, index): Men001ExplanationSection => {
    if (section.kind !== "STEP") return section;
    stepNumber += 1;
    let title = section.title;
    if (title === previousTitle) {
      const hasLaterStep = sections.slice(index + 1).some((candidate) => candidate.kind === "STEP");
      title = hasLaterStep ? "Continue the Calculation" : "Finalize the Numerical Result";
    }
    previousTitle = title;
    return {
      ...section,
      stepNumber,
      title,
      paragraphs: paragraphsForTitle(title, section),
    };
  });
}

export function polishMen001StructuredSections(
  sections: readonly Men001ExplanationSection[],
  solveMode: Men001SolveMode,
): Men001ExplanationSection[] {
  if (solveMode === "findRectangleSemicircleCompositeArea") {
    let stepIndex = 0;
    return sections.map((section): Men001ExplanationSection => {
      if (section.kind !== "STEP") return section;
      const title = APPROVED_COMPOSITE_TITLES[stepIndex] ?? section.title;
      stepIndex += 1;
      return {
        ...section,
        title,
        paragraphs: paragraphsForTitle(title, section),
      };
    });
  }

  const retitled = sections.map((section): Men001ExplanationSection => {
    if (section.kind !== "STEP") return section;
    const title = deriveTitle(section, solveMode);
    return {
      ...section,
      title,
      paragraphs: paragraphsForTitle(title, section),
    };
  });

  return renumberAndDeduplicate(mergeSameQuantity(retitled));
}
