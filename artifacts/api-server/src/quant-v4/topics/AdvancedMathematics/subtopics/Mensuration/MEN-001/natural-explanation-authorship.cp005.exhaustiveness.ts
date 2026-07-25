import type { Men001NaturalExplanationProfile } from "./natural-explanation-authorship";

const PROFILES: Record<string, Men001NaturalExplanationProfile> = {
  "MEN-001-QL-362": {
    opening:
      "The two rectangles meet along one full edge, and that shared segment lies inside the combined floor plan rather than on its outside boundary.",
    conclusion:
      "After removing the internal shared edge from both separate perimeters, the joined boundary is {answer}.",
  },
  "MEN-001-QL-363": {
    opening:
      "The remaining land touches two boundaries: the outside of the square park and the circular edge of the pond inside it.",
    conclusion:
      "Together, the outer and inner boundaries measure {answer}.",
  },
  "MEN-001-QL-364": {
    opening:
      "A regular hexagon divides its perimeter equally among six identical sides.",
    conclusion:
      "Each side of the regular hexagonal frame is {answer}.",
  },
  "MEN-001-QL-365": {
    opening:
      "The perimeter first determines the common side of the regular hexagon, after which its six-equilateral-triangle area formula can be used.",
    conclusion:
      "The regular hexagonal park has exact area {answer}.",
  },
  "MEN-001-QL-366": {
    opening:
      "The two semicircular ends make one complete circular boundary, and the rest of the stadium perimeter is shared equally by the two straight sides.",
    conclusion:
      "Each straight side of the stadium measures {answer}.",
  },
  "MEN-001-QL-367": {
    opening:
      "For a square inscribed in a circle, the square’s diagonal is the circle’s diameter, making the shaded difference a fixed multiple of the radius squared.",
    conclusion:
      "The circle has radius {answer}.",
  },
};

export function getMen001Cp005ExhaustivenessNaturalExplanationProfile(
  questionLanguageId: string,
): Men001NaturalExplanationProfile | undefined {
  return PROFILES[questionLanguageId];
}

export function getMen001Cp005ExhaustivenessNaturalExplanationProfileIds() {
  return Object.keys(PROFILES);
}
