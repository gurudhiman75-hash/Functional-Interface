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

export function restoreMen001SpecificStepAuthorship(
  sections: readonly Men001ExplanationSection[],
  solveMode: Men001SolveMode,
): Men001ExplanationSection[] {
  if (solveMode !== "findRectangleSemicircleCompositeArea") {
    return [...sections];
  }

  let stepIndex = 0;
  return sections.map((section) => {
    if (section.kind !== "STEP") return section;
    const authored = RECTANGLE_SEMICIRCLE_STEPS[stepIndex];
    stepIndex += 1;
    if (!authored) return section;
    return {
      ...section,
      title: authored.title,
      paragraphs: [authored.paragraph],
    };
  });
}
