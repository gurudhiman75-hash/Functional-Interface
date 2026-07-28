import type { Men001ExplanationSection } from "./structured-explanation";
import type { Men001Parameters } from "./types";

type StepSection = Extract<Men001ExplanationSection, { kind: "STEP" }>;
type KeyRuleSection = Extract<Men001ExplanationSection, { kind: "KEY_RULE" }>;
type TrapSection = Extract<Men001ExplanationSection, { kind: "COMMON_TRAPS" }>;

function boundaryStep(title: string, mode: string) {
  if (title === "Calculate the Boundary") {
    if (/RhombusPerimeterFromDiagonals/.test(mode)) {
      return "The diagonals bisect each other at 90°, so their half-lengths form a right triangle. Use that triangle to find one rhombus side before calculating the full boundary.";
    }
    if (/SemicirclePerimeter/.test(mode)) {
      return "First find only the curved edge of the semicircle. It is half of a full circumference, so the arc length is πr; the diameter is added in the next step.";
    }
    if (/QuadrantPerimeter/.test(mode)) {
      return "First find only the curved edge of the quadrant. It is one quarter of the full circumference; the two straight radii are added afterwards.";
    }
    if (/SectorPerimeter/.test(mode)) {
      return "First find only the sector's arc: (θ/360) × 2πr. The two straight radii are not part of this arc calculation.";
    }
    if (/PerimeterAfterLinearScaling/.test(mode)) {
      return "Every segment of the boundary is multiplied by the same linear factor, so write the direct relation P₂ = kP₁.";
    }
    return "Identify every curved and straight part that belongs to the outside boundary before combining their lengths.";
  }

  if (title === "Calculate the Perimeter") {
    if (/RhombusPerimeterFromDiagonals/.test(mode)) {
      return "A rhombus has four equal sides. Multiply the side found from the half-diagonals by 4 and keep the answer in a linear unit.";
    }
    if (/SemicirclePerimeter/.test(mode)) {
      return "Add the semicircular arc and the full diameter: P = πr + 2r. Leaving out either part gives only part of the boundary.";
    }
    if (/QuadrantPerimeter/.test(mode)) {
      return "Add the quadrant arc and both radii. The complete perimeter is quarter-circumference + 2r.";
    }
    if (/SectorPerimeter/.test(mode)) {
      return "Add the sector arc and the two radii. A sector perimeter includes one curved edge and two straight edges.";
    }
    if (/PerimeterAfterLinearScaling/.test(mode)) {
      return "Multiply the original perimeter by k once. Perimeter is linear, so the scale factor is not squared.";
    }
    return "Add all identified boundary parts exactly once and report the result in a linear unit.";
  }

  return undefined;
}

function centralAngleStep(title: string, mode: string) {
  if (title !== "Find the Central Angle") return undefined;
  if (/CentralAngleFromArcLength/.test(mode)) {
    return "The arc covers the same fraction of 360° as its length covers of the full circumference. Use θ = (arc length ÷ circumference) × 360°.";
  }
  if (/CentralAngleFromSectorArea/.test(mode)) {
    return "The sector covers the same fraction of 360° as its area covers of the full circle. Use θ = (sector area ÷ circle area) × 360°.";
  }
  return "Compare the given part with the complete circle, then multiply that fraction by 360°.";
}

function refineStep(section: StepSection, parameters: Men001Parameters): StepSection {
  const paragraph = centralAngleStep(section.title, parameters.solveMode)
    ?? boundaryStep(section.title, parameters.solveMode);
  return paragraph
    ? { ...section, paragraphs: [paragraph, ...section.paragraphs.slice(1)] }
    : section;
}

function refineRectangleWireToSquare(
  sections: readonly Men001ExplanationSection[],
  parameters: Men001Parameters,
) {
  if (parameters.solveMode !== "findSquareSideFromRectangleWire") return undefined;
  let stepIndex = 0;
  return sections.map((section): Men001ExplanationSection => {
    if (section.kind !== "STEP") return section;
    stepIndex += 1;
    if (stepIndex === 1) {
      return {
        ...section,
        stepNumber: 1,
        title: "Find the Wire Length",
        paragraphs: [
          "A rectangle has two lengths and two breadths. Calculate 2(l + b) to find the complete length of the wire.",
        ],
      };
    }
    if (stepIndex === 2) {
      return {
        ...section,
        stepNumber: 2,
        title: "Use the Same Wire for the Square",
        paragraphs: [
          "No wire is added or removed, so the square's perimeter is exactly the rectangle's wire length.",
        ],
      };
    }
    if (stepIndex === 3) {
      return {
        ...section,
        stepNumber: 3,
        title: "Find the Side of the Square",
        paragraphs: [
          "A square has four equal sides. Divide the conserved wire length by 4 to obtain one side.",
          ...section.paragraphs.slice(1),
        ],
      };
    }
    return section;
  });
}

function refineKeyRule(section: KeyRuleSection, parameters: Men001Parameters): KeyRuleSection {
  if (parameters.questionLanguageId !== "MEN-001-QL-004") return section;
  return {
    ...section,
    paragraphs: [
      "The triangle formula A = ½bh can be used backwards. Since the area and base are known, double the area and divide by the base to get the perpendicular height.",
    ],
  };
}

function keepTrapPrefix(paragraph: string) {
  const match = paragraph.match(/^(Option [A-D] \(.+?\): )/);
  return match?.[1] ?? "";
}

function firstMistakeSentence(paragraph: string) {
  const start = paragraph.indexOf("Common mistake:");
  if (start < 0) return "Common mistake: using the wrong intermediate value.";
  const remainder = paragraph.slice(start);
  const end = remainder.indexOf(". ");
  return end < 0 ? remainder : remainder.slice(0, end + 1);
}

function refineCentralAngleTraps(section: TrapSection, parameters: Men001Parameters): TrapSection {
  const mode = parameters.solveMode;
  if (!/CentralAngleFromArcLength|CentralAngleFromSectorArea/.test(mode)) return section;
  const method = /CentralAngleFromArcLength/.test(mode)
    ? "Find the full circumference first, then use θ = (arc length ÷ circumference) × 360°."
    : "Find the full circle area first, then use θ = (sector area ÷ circle area) × 360°.";
  return {
    ...section,
    paragraphs: section.paragraphs.map((paragraph) =>
      `${keepTrapPrefix(paragraph)}${firstMistakeSentence(paragraph)} ${method}`
    ),
  };
}

function refineRectangleWireTraps(section: TrapSection, parameters: Men001Parameters): TrapSection {
  if (parameters.solveMode !== "findSquareSideFromRectangleWire") return section;
  return {
    ...section,
    paragraphs: section.paragraphs.map((paragraph) => {
      const prefix = keepTrapPrefix(paragraph);
      if (/by two|by 2\b/i.test(paragraph)) {
        return `${prefix}Common mistake: dividing the total rectangle wire by 2 instead of 4. A square has four equal sides, so divide the complete wire length by 4.`;
      }
      if (/by three|by 3\b/i.test(paragraph)) {
        return `${prefix}Common mistake: dividing the total rectangle wire by 3. A square has four equal sides, so divide the complete wire length by 4.`;
      }
      return `${prefix}Common mistake: dividing the total rectangle wire by 8, which halves the correct side. Divide the complete wire length by 4 once.`;
    }),
  };
}

function refineTraps(section: TrapSection, parameters: Men001Parameters): TrapSection {
  return refineRectangleWireTraps(
    refineCentralAngleTraps(section, parameters),
    parameters,
  );
}

export function ensureMen001ComprehensionSpecificity(
  sections: readonly Men001ExplanationSection[],
  parameters: Men001Parameters,
): Men001ExplanationSection[] {
  const baseSections = refineRectangleWireToSquare(sections, parameters) ?? sections;
  return baseSections.map((section): Men001ExplanationSection => {
    if (section.kind === "KEY_RULE") return refineKeyRule(section, parameters);
    if (section.kind === "STEP") return refineStep(section, parameters);
    if (section.kind === "COMMON_TRAPS") return refineTraps(section, parameters);
    return section;
  });
}
