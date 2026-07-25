import { getMen001StructuredFormulaLines } from "./structured-formula-plans";
import type { Men001ExplanationSection } from "./structured-explanation";
import type { Men001SolveMode } from "./solve-mode-registry.all";

const TITLE_PARAGRAPHS: Record<string, string> = {
  "Continue the Calculation":
    "Use the previous result in the next part of the calculation.",
  "Finalize the Numerical Result":
    "Evaluate the remaining expression to obtain the required numerical value.",
};

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
        equations: getMen001StructuredFormulaLines(solveMode),
      };
    }
    if (section.kind !== "STEP") return section;

    let title = section.title;
    if (title === previousStepTitle) {
      title = sectionIndex === finalStepIndex
        ? "Finalize the Numerical Result"
        : "Continue the Calculation";
    }
    previousStepTitle = title;

    if (title === section.title) return section;
    return {
      ...section,
      title,
      paragraphs: [TITLE_PARAGRAPHS[title]!],
    };
  });
}
