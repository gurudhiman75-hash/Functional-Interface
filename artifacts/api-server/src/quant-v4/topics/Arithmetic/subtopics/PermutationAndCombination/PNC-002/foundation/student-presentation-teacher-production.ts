import { buildPnc002FinalTeacherStudentPresentation } from "./student-presentation-teacher-final";
import type {
  PncStudentExplanationSection,
  PncStudentPresentation,
  PncStudentSourcePackage,
} from "./student-presentation";

function isGenericShortcut(section: PncStudentExplanationSection): boolean {
  return section.kind === "examSpeedShortcut"
    && section.lines.some((line) => /Write the structural factors before multiplying|Write the counting stages separately/i.test(line));
}

function routedShortcut(
  source: PncStudentSourcePackage,
  section: PncStudentExplanationSection,
): PncStudentExplanationSection {
  if (!isGenericShortcut(section)) return section;
  const mode = source.solveMode.toLowerCase();
  const stem = source.stem.toLowerCase();
  const math = source.solver.mathJax;
  let line: string;

  if (mode.includes("exactposition") || mode.includes("prescribedpositions")) {
    line = `Place every compulsory item in its fixed position first, then arrange only the unrestricted items: $${math}$.`;
  } else if (mode.includes("eitherend")) {
    line = `Choose which end receives the particular person, then arrange everyone else in the remaining positions: $${math}$.`;
  } else if (mode.includes("bothends")) {
    line = `Arrange the two particular people at the two ends, then arrange all remaining people in the middle positions: $${math}$.`;
  } else if (mode.includes("positionclass") || mode.includes("positionset")) {
    if (mode.includes("atleast")) {
      line = `Split the count by how many particular items occupy the allowed position class, evaluate each admissible case and add them: $${math}$.`;
    } else if (mode.includes("exactly")) {
      line = `Choose exactly which particular items enter the allowed position class, assign their positions and then arrange the remaining items: $${math}$.`;
    } else {
      line = `Reserve the required position set for the particular items, arrange them there and arrange all other items in the remaining positions: $${math}$.`;
    }
  } else if (mode.includes("relativeorder") || mode.includes("independentrelativeorderchains")) {
    line = `Start with all linear arrangements and divide by the number of equally likely orders of each restricted chain: $${math}$.`;
  } else if (mode.includes("strictalternation")) {
    line = `Arrange each category internally, then multiply by the number of valid starting patterns for strict alternation: $${math}$.`;
  } else if (mode.includes("exactlyfromtwocategories")) {
    line = `Choose the exact quota from the first category and the remaining quota from the second category, then multiply: $${math}$.`;
  } else if (mode.includes("atleastfromtwocategories") || mode.includes("atmostfromtwocategories") || mode.includes("specifiedmemberrange")) {
    line = `List only the allowed category or specified-member counts, evaluate each disjoint case and add the results: $${math}$.`;
  } else if (mode.includes("atleastonefromeachofthreecategories")) {
    line = `List the positive quota splits across all three categories, count each split separately and add them: $${math}$.`;
  } else if (mode.includes("atleastonefromeachoftwocategories")) {
    line = `Use total committees minus the all-from-one-category cases: $${math}$.`;
  } else if (mode.includes("exactlytspecifiedmembers")) {
    line = `Choose the required number from the specially identified set and fill the remaining committee places from everyone else: $${math}$.`;
  } else if (mode.includes("atleastonespecifiedmember")) {
    line = `Use total committees minus the committees containing none of the particular members: $${math}$.`;
  } else if (mode.includes("allornonespecifiedmembers")) {
    line = `Add the two disjoint cases—both particular members included and both excluded: $${math}$.`;
  } else if (mode.includes("implicationbetweenspecifiedmembers")) {
    line = `Count all committees and subtract the single forbidden case in which the dependent member is chosen without the required member: $${math}$.`;
  } else if (mode.includes("atmosttspecifiedmembers")) {
    line = `Add the cases containing zero through the allowed maximum number of specially identified members: $${math}$.`;
  } else if (mode.includes("personbetweentwoneighbors")) {
    line = `Treat the three-person neighbour pattern as a circular block, count its two internal orders and arrange the remaining circular units: $${math}$.`;
  } else if (mode.includes("clockwiseexactgap")) {
    line = `Fix A as the reference, place B at the one clockwise position that creates the required gap and arrange everyone else: $${math}$.`;
  } else if (mode.includes("clockwiseatleastgap") || mode.includes("clockwiseatmostgap")) {
    line = `Fix A, count the clockwise positions allowed for B by the gap condition and arrange all remaining people: $${math}$.`;
  } else if (mode.includes("prescribedclockwiseorder")) {
    line = `Fix one circular reference and divide by the number of equally likely clockwise orders of the restricted people: $${math}$.`;
  } else if (mode.includes("atleastoneemptylabelledbox")) {
    line = `Use all labelled assignments minus the onto assignments in which every receiver is used: $${math}$.`;
  } else if (mode.includes("exactoccupancyvector")) {
    line = `Use the multinomial coefficient: choose the contents of each named receiver according to its exact occupancy: $${math}$.`;
  } else if (mode.includes("specifiedboxoccupancy")) {
    line = `Choose the objects placed in the specified receiver, then assign every remaining different object independently to the other receivers: $${math}$.`;
  } else if (mode.includes("exactlyoneoftwospecifiedfixed")) {
    line = `Choose which one of the two cards stays fixed, then remove arrangements in which the other card also remains fixed: $${math}$.`;
  } else if (mode.includes("neitheroftwospecifiedfixed")) {
    line = `Apply inclusion–exclusion to the two forbidden fixed-position events: $${math}$.`;
  } else if (mode.includes("nonuniformcapacities")) {
    line = `List the occupancy vectors that satisfy every capacity, evaluate the multinomial count for each vector and add them: $${math}$.`;
  } else if (/at least|at most|exactly/.test(stem) && /committee|group/.test(stem)) {
    line = `Break the condition into disjoint allowed quota cases and add their combination counts: $${math}$.`;
  } else {
    line = `Translate the restriction into its exact counting stages and evaluate them in order: $${math}$.`;
  }

  return { ...section, lines: [line] };
}

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

  return routedShortcut(source, section);
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
