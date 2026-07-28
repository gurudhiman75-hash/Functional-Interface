import { buildPnc002FinalTeacherStudentPresentation } from "./student-presentation-teacher-final";
import type {
  PncStudentExplanationSection,
  PncStudentPresentation,
  PncStudentSourcePackage,
} from "./student-presentation";

function familySection(
  source: PncStudentSourcePackage,
  section: PncStudentExplanationSection,
): PncStudentExplanationSection {
  const ql = source.questionLanguageId;
  const math = source.solver.mathJax;

  if (ql === "PNC-QL-211" && section.kind === "examSpeedShortcut") {
    return {
      ...section,
      lines: [`Choose the groups in their prescribed sizes. Since the sizes are different, no whole-group symmetry division is needed: $${math}$.`],
    };
  }

  if (ql === "PNC-QL-242") {
    if (section.kind === "coreConcept") return { ...section, heading: "📌 Core Concept — Select the Quota, Then Assign Two Ordered Offices" };
    if (section.kind === "examSpeedShortcut") return { ...section, lines: [`Choose the required women and men first, then multiply by the ordered choices for the two offices: $${math}$.`] };
  }
  if (ql === "PNC-QL-243") {
    if (section.kind === "coreConcept") return { ...section, heading: "📌 Core Concept — Form the Quota, Then Choose a Woman Chairperson" };
    if (section.kind === "examSpeedShortcut") return { ...section, lines: [`Form the quota committee, choose its chairperson from the selected women and then assign the remaining stated role: $${math}$.`] };
  }
  if (ql === "PNC-QL-244") {
    if (section.kind === "coreConcept") return { ...section, heading: "📌 Core Concept — Form the Quota, Then Assign Category-Specific Offices" };
    if (section.kind === "examSpeedShortcut") return { ...section, lines: [`Select the required women and men, then choose the chairperson from the selected women and the secretary from the selected men: $${math}$.`] };
  }
  if (ql === "PNC-QL-245") {
    if (section.kind === "coreConcept") return { ...section, heading: "📌 Core Concept — Include the Compulsory Member, Then Assign Two Offices" };
    if (section.kind === "examSpeedShortcut") return { ...section, lines: [`Reserve the compulsory member, choose the remaining committee and finally assign the two ordered offices: $${math}$.`] };
  }

  if (ql === "PNC-QL-247") {
    if (section.kind === "coreConcept") {
      return {
        ...section,
        heading: "📌 Core Concept — Include the Pair, Then Arrange the Chosen Set",
        lines: [
          "Reserve the two compulsory people first, then choose only the remaining required people from the eligible pool.",
          "After the complete set is selected, arrange all selected people in a row using the factorial of the selected-set size.",
        ],
      };
    }
    if (section.kind === "examSpeedShortcut") {
      return { ...section, lines: [`Fix the compulsory pair, choose the remaining members and multiply by the arrangements of the complete selected set: $${math}$.`] };
    }
  }

  if (ql === "PNC-QL-250") {
    if (section.kind === "coreConcept") {
      return {
        ...section,
        heading: "📌 Core Concept — Select the Category Quota, Then Arrange in a Circle",
        lines: [
          "Choose the required women and men separately to form the selected group.",
          "Once selected, fix one person as the circular reference and arrange the remaining selected people around the table.",
        ],
      };
    }
    if (section.kind === "examSpeedShortcut") {
      return { ...section, lines: [`Multiply the two quota selections by the circular arrangement factor $(r-1)!$ for the selected group: $${math}$.`] };
    }
  }

  if (ql === "PNC-QL-252") {
    if (section.kind === "coreConcept") {
      return {
        ...section,
        heading: "📌 Core Concept — Include the Required Ornament, Then Remove Ring Symmetry",
        lines: [
          "Keep the compulsory ornament and choose the remaining ornaments needed for the ring.",
          "For each chosen set, remove rotational and reflection duplicates from the circular arrangements.",
        ],
      };
    }
    if (section.kind === "examSpeedShortcut") {
      return { ...section, lines: [`Choose the remaining ornaments after fixing the compulsory one, then use $(r-1)!/2$ for a reversible ring: $${math}$.`] };
    }
  }

  return section;
}

export function buildPnc002ProductionTeacherStudentPresentation(
  source: PncStudentSourcePackage,
): PncStudentPresentation {
  const finalPresentation = buildPnc002FinalTeacherStudentPresentation(source);
  return {
    ...finalPresentation,
    explanationSections: finalPresentation.explanationSections.map((section) => familySection(source, section)),
  };
}
