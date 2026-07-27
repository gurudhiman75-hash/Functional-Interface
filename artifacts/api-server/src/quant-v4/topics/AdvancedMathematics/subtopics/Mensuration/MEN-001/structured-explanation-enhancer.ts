import type { Men001ExplanationSection } from "./structured-explanation";
import type { Men001Parameters, Men001SolverResult } from "./types";

const GENERIC_FORMULA_NUMBERS = new Set([
  "1", "2", "3", "4", "6", "7", "14", "22", "100", "360", "10000",
]);

function clean(value: string) {
  return value
    .trim()
    .replace(/^(Therefore|Hence|Thus|So),?\s*/i, "")
    .replace(/^Substitution gives\s*/i, "")
    .replace(/^Calculation:\s*/i, "")
    .replace(/[.]$/, "")
    .replace(/\s*=\s*/g, " = ")
    .replace(/\s*\+\s*/g, " + ")
    .replace(/\s*-\s*/g, " − ")
    .replace(/\s*×\s*/g, " × ")
    .replace(/\s*÷\s*/g, " ÷ ")
    .replace(/\s+/g, " ");
}

function containsSpecificValues(value: string) {
  const numbers = value.match(/\d+(?:\.\d+)?/g) ?? [];
  return numbers.some((number) => !GENERIC_FORMULA_NUMBERS.has(number.replace(/^0+/, "") || "0"));
}

function shouldRestore(value: string) {
  if (!value.includes("=")) return false;
  if (/^(use|from|rearrange|by pythagoras)\b/i.test(value) && !containsSpecificValues(value)) {
    return false;
  }
  return containsSpecificValues(value);
}

function titleFor(value: string) {
  const line = value.toLowerCase();
  if (/ratio sum/.test(line)) return "Add the Ratio Parts";
  if (/one ratio unit/.test(line)) return "Find One Ratio Unit";
  if (/half[- ]base/.test(line)) return "Find Half the Base";
  if (/semiperimeter/.test(line)) return "Find the Semiperimeter";
  if (/outer area/.test(line)) return "Area of the Outer Figure";
  if (/inner area/.test(line)) return "Area of the Inner Figure";
  if (/path area/.test(line)) return "Find the Path Area";
  if (/border area/.test(line)) return "Find the Border Area";
  if (/floor area/.test(line)) return "Area of the Floor";
  if (/wall area/.test(line)) return "Area of the Wall";
  if (/door area/.test(line)) return "Area of the Door";
  if (/mat area/.test(line)) return "Area of the Mat";
  if (/area of one tile|each .*tile.*area/.test(line)) return "Area of One Tile";
  if (/tiles required/.test(line)) return "Find the Number of Tiles";
  if (/circumference/.test(line)) return "Calculate the Circumference";
  if (/perimeter/.test(line)) return "Calculate the Perimeter";
  if (/breadth/.test(line)) return "Find the Breadth";
  if (/length/.test(line)) return "Find the Length";
  if (/diameter/.test(line)) return "Find the Diameter";
  if (/radius|r²/.test(line)) return "Find the Radius";
  if (/side|a²/.test(line)) return "Find the Side";
  if (/road areas?/.test(line)) return "Find the Road Areas";
  if (/cost/.test(line)) return "Calculate the Cost";
  if (/rate/.test(line)) return "Calculate the Rate";
  if (/area/.test(line)) return "Calculate the Required Area";
  return "Set Up the Numerical Calculation";
}

function instruction(title: string) {
  const text: Record<string, string> = {
    "Add the Ratio Parts": "Add all ratio parts before converting the ratio into actual measurements.",
    "Find One Ratio Unit": "Divide the total measurement by the sum of the ratio parts.",
    "Find Half the Base": "The altitude of an isosceles triangle bisects its base.",
    "Find the Semiperimeter": "Add the three sides and divide the perimeter by two.",
    "Area of the Outer Figure": "Calculate the area enclosed by the outer boundary.",
    "Area of the Inner Figure": "Calculate the inner area that will be removed.",
    "Find the Path Area": "Subtract the inner area from the outer area.",
    "Find the Border Area": "Subtract the inner region from the complete outer region.",
    "Area of the Floor": "Multiply the floor dimensions after making the units consistent.",
    "Area of the Wall": "Multiply the wall's length by its height.",
    "Area of the Door": "Multiply the door's length by its breadth.",
    "Area of the Mat": "Multiply the mat dimensions.",
    "Area of One Tile": "Multiply the tile dimensions in the same square unit as the floor.",
    "Find the Number of Tiles": "Divide the total required area by the area of one tile.",
    "Calculate the Circumference": "Substitute the circle measurement in the circumference formula.",
    "Calculate the Perimeter": "Add the required boundary lengths using the perimeter formula.",
    "Find the Breadth": "Rearrange the given relation to isolate the breadth.",
    "Find the Length": "Rearrange the given relation to isolate the length.",
    "Find the Diameter": "Use the radius or circumference relation to recover the diameter.",
    "Find the Radius": "Rearrange the circle relation to recover the radius.",
    "Find the Side": "Rearrange the relevant area or perimeter formula to recover the side.",
    "Find the Road Areas": "Calculate each road strip before correcting for their overlap.",
    "Calculate the Cost": "Multiply the required measure by the applicable rate.",
    "Calculate the Rate": "Divide the total cost by the corresponding measure.",
    "Calculate the Required Area": "Substitute the known dimensions into the area relation.",
    "Set Up the Numerical Calculation": "Substitute the supplied values into the governing relation.",
  };
  return text[title] ?? "Substitute the supplied values into the governing relation.";
}

export function enhanceMen001StructuredSections(
  sections: readonly Men001ExplanationSection[],
  originalLines: readonly string[],
  _parameters: Men001Parameters,
  _solver: Men001SolverResult,
): Men001ExplanationSection[] {
  const firstCalculation = originalLines[1];
  if (!firstCalculation || !shouldRestore(firstCalculation)) return [...sections];

  const existingSteps = sections.filter((section) => section.kind === "STEP");
  const equation = clean(firstCalculation);
  if (existingSteps.some((step) => step.equations.includes(equation))) return [...sections];

  const keyRuleIndex = sections.findIndex((section) => section.kind === "KEY_RULE");
  if (keyRuleIndex < 0) return [...sections];
  const title = titleFor(firstCalculation);
  const restored: Men001ExplanationSection = {
    kind: "STEP",
    stepNumber: 1,
    title,
    paragraphs: [instruction(title)],
    equations: [equation],
  };

  const result = [
    ...sections.slice(0, keyRuleIndex + 1),
    restored,
    ...sections.slice(keyRuleIndex + 1),
  ];
  let stepNumber = 0;
  return result.map((section) => {
    if (section.kind !== "STEP") return section;
    stepNumber += 1;
    return { ...section, stepNumber };
  });
}
