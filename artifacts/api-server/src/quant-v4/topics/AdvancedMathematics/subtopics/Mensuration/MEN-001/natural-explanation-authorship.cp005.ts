import type { Men001Parameters, Men001SolverResult } from "./types";
import type { Men001NaturalExplanationProfile } from "./natural-explanation-authorship";

const PROFILES: Record<string, Men001NaturalExplanationProfile> = {
  "MEN-001-QL-335": {
    opening: "The attached semicircle does not overlap the rectangle, so their areas can be calculated separately and combined.",
    conclusion: "The complete rectangle-and-semicircle figure covers {answer}.",
  },
  "MEN-001-QL-336": {
    opening: "The metal plate has one rectangular portion and one outward curved portion sharing only an edge.",
    conclusion: "The full plate therefore has area {answer}.",
  },
  "MEN-001-QL-337": {
    opening: "The two semicircular ends together form one circle, leaving a rectangle-plus-circle area calculation.",
    conclusion: "The stadium-shaped park covers {answer}.",
  },
  "MEN-001-QL-338": {
    opening: "The triangular top and rectangular body meet along an edge but do not overlap.",
    conclusion: "The signboard has a total area of {answer}.",
  },
  "MEN-001-QL-339": {
    opening: "The field is naturally split into a rectangle and an adjoining triangle whose areas must be added.",
    conclusion: "The two parts together cover {answer}.",
  },
  "MEN-001-QL-340": {
    opening: "Since the two rectangles are non-overlapping, the floor area is the sum of their individual areas.",
    conclusion: "The complete floor plan covers {answer}.",
  },
  "MEN-001-QL-341": {
    opening: "The L-shape is easiest to view as a complete outer rectangle with one corner rectangle removed.",
    conclusion: "The L-shaped floor has area {answer}.",
  },
  "MEN-001-QL-342": {
    opening: "Completing the sheet to its original rectangle makes the missing corner a clear subtraction.",
    conclusion: "The remaining metal sheet covers {answer}.",
  },
  "MEN-001-QL-343": {
    opening: "The shaded region is the part of the square not occupied by its inscribed circle.",
    conclusion: "The required shaded area is {answer}.",
  },
  "MEN-001-QL-344": {
    opening: "Because the circular bed touches all four sides, its diameter is exactly the side of the square lawn.",
    conclusion: "The lawn remaining outside the bed covers {answer}.",
  },
  "MEN-001-QL-345": {
    opening: "The square lies entirely inside the circle, with its diagonal equal to the circle's diameter.",
    conclusion: "The portion of the circle outside the square is {answer}.",
  },
  "MEN-001-QL-346": {
    opening: "The two equal semicircular cut-outs combine to the area of one complete circle.",
    conclusion: "After both cut-outs, the rectangle retains {answer}.",
  },
  "MEN-001-QL-347": {
    opening: "The four removed quadrants have equal radii and together make a complete circle.",
    conclusion: "The central portion left in the square is {answer}.",
  },
  "MEN-001-QL-348": {
    opening: "For the largest circle in a square, the square side becomes the circle's diameter.",
    conclusion: "The largest inscribed circle has area {answer}.",
  },
  "MEN-001-QL-349": {
    opening: "The diagonal of an inscribed square spans the circle's diameter, linking the square directly to the radius.",
    conclusion: "The inscribed square covers {answer}.",
  },
  "MEN-001-QL-350": {
    opening: "The largest square cut from the disc uses the full diameter as its diagonal.",
    conclusion: "The largest square that fits in the disc has area {answer}.",
  },
  "MEN-001-QL-351": {
    opening: "The rectangle's narrower side limits the diameter of any circle cut from it.",
    conclusion: "The greatest possible circle radius is {answer}.",
  },
  "MEN-001-QL-352": {
    opening: "A pond that stays inside the plot cannot have a diameter larger than the plot's smaller dimension.",
    conclusion: "The pond's maximum possible radius is {answer}.",
  },
  "MEN-001-QL-353": {
    opening: "Joining the centre of a regular hexagon to its vertices divides it into six equilateral triangles.",
    conclusion: "The exact area of the tile is {answer}.",
  },
  "MEN-001-QL-354": {
    opening: "The regular hexagonal park can be measured as six equal equilateral triangles without approximating √3.",
    conclusion: "The park's exact area is {answer}.",
  },
  "MEN-001-QL-355": {
    opening: "Every side of a regular hexagon has the same length, so the boundary consists of six equal parts.",
    conclusion: "The frame's perimeter is {answer}.",
  },
  "MEN-001-QL-356": {
    opening: "The shared diameter is inside the joined figure, so only the exposed rectangle edges and semicircular arc are counted.",
    conclusion: "The outside boundary measures {answer}.",
  },
  "MEN-001-QL-357": {
    opening: "The two semicircular ends form one full circular boundary, in addition to the two straight sides.",
    conclusion: "The stadium perimeter is {answer}.",
  },
  "MEN-001-QL-358": {
    opening: "Removing a corner replaces two outer segments with inner segments of the same lengths.",
    conclusion: "The resulting L-shape has perimeter {answer}.",
  },
  "MEN-001-QL-359": {
    opening: "The semicircular component has a known area, so it can be removed from the total before recovering the rectangle length.",
    conclusion: "The rectangular portion is {answer} long.",
  },
  "MEN-001-QL-360": {
    opening: "For an inscribed circle, the shaded area is a fixed fraction of the surrounding square when π is 22/7.",
    conclusion: "The side of the square is {answer}.",
  },
};

function clean(line: string) {
  return line.trim().replace(/\s+/g, " ");
}

export function authorMen001Cp005ExplanationLines(
  originalLines: readonly string[],
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): string[] {
  const profile = PROFILES[parameters.questionLanguageId];
  if (!profile) {
    throw new Error(`MEN-001 CP-005 requires a natural explanation profile for ${parameters.questionLanguageId}.`);
  }
  const cleaned = originalLines.map(clean).filter(Boolean);
  if (cleaned.length < 2) {
    throw new Error(`${parameters.questionLanguageId} produced too little verified explanation content.`);
  }
  return [
    profile.opening,
    ...cleaned.slice(1, -1),
    profile.conclusion.replace("{answer}", solver.answer),
  ];
}

export function getMen001Cp005NaturalExplanationProfile(questionLanguageId: string) {
  return PROFILES[questionLanguageId];
}

export function getMen001Cp005NaturalExplanationProfileIds() {
  return Object.keys(PROFILES);
}
