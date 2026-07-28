import { buildPnc002TeacherStudentPresentation } from "./student-presentation-teacher";
import type {
  PncStudentExplanationSection,
  PncStudentPresentation,
  PncStudentSourcePackage,
} from "./student-presentation";

function factorial(value: number): number | undefined {
  if (!Number.isInteger(value) || value < 0 || value > 12) return undefined;
  let result = 1;
  for (let factor = 2; factor <= value; factor += 1) result *= factor;
  return result;
}

function factorialProduct(value: number): string {
  if (value <= 1) return "1";
  return Array.from({ length: value }, (_, index) => String(value - index)).join(" \\times ");
}

function parenthesisedFactorialStep(source: PncStudentSourcePackage): string | undefined {
  const match = source.solver.mathJax.match(/\((\d+)\s*-\s*(\d+)\)!/);
  if (!match) return undefined;
  const total = Number(match[1]);
  const removed = Number(match[2]);
  const remaining = total - removed;
  const value = factorial(remaining);
  if (value === undefined) return undefined;
  return `**Expand the circular factorial:** $(${total}-${removed})! = ${remaining}! = ${factorialProduct(remaining)} = ${value}$.`;
}

function familyTeachingStep(source: PncStudentSourcePackage): string {
  const mode = source.solveMode.toLowerCase();
  const stem = source.stem.toLowerCase();
  if (mode.includes("circular") || mode.includes("roundtable") || mode.includes("rotation") || mode.includes("dihedral") || /round table|clockwise|ring|necklace|ornament/.test(stem)) {
    return "**Remove rotational duplicates:** Fix one reference position first; only the remaining positions are freely arranged around the circle.";
  }
  if (mode.includes("recover")) {
    return "**Check the bounded candidates:** Evaluate only the allowed values and keep the unique one that reproduces the target count.";
  }
  return "**Separate the stages:** Write each independent counting choice before combining the factors.";
}

function reviewedStepSection(
  source: PncStudentSourcePackage,
  section: PncStudentExplanationSection,
): PncStudentExplanationSection {
  const unnumbered = section.lines.map((line) => line.replace(/^\d+\.\s*/, "").trim());
  while (unnumbered.length < 4) {
    const insertion = parenthesisedFactorialStep(source) ?? familyTeachingStep(source);
    const finalIndex = Math.max(0, unnumbered.length - 1);
    if (!unnumbered.includes(insertion)) {
      unnumbered.splice(finalIndex, 0, insertion);
    } else {
      unnumbered.splice(finalIndex, 0, "**Connect the condition to the formula:** Apply the stated restriction before evaluating the final count.");
    }
  }
  return {
    ...section,
    lines: unnumbered.slice(0, 8).map((line, index) => `${index + 1}. ${line}`),
  };
}

function reviewedCoreSection(
  source: PncStudentSourcePackage,
  section: PncStudentExplanationSection,
): PncStudentExplanationSection {
  if (source.questionLanguageId !== "PNC-QL-269") return section;
  return {
    ...section,
    heading: "📌 Core Concept — Build the Team Quota, Then Choose Captains",
    lines: [
      "Form Team A with the required women–men split; because the teams are named, every remaining member then belongs to Team B automatically.",
      "Only after both teams are fixed should one captain be chosen independently from each team.",
    ],
  };
}

export function buildPnc002ReviewedTeacherStudentPresentation(
  source: PncStudentSourcePackage,
): PncStudentPresentation {
  const teacher = buildPnc002TeacherStudentPresentation(source);
  return {
    ...teacher,
    explanationSections: teacher.explanationSections.map((section) => {
      if (section.kind === "coreConcept") return reviewedCoreSection(source, section);
      if (section.kind === "stepByStep") return reviewedStepSection(source, section);
      return section;
    }),
  };
}
