import {
  getMen001NaturalExplanationProfile,
  type Men001NaturalExplanationProfile,
} from "./natural-explanation-authorship";

const DYNAMIC_SAFE_OVERRIDES: Record<
  string,
  Partial<Men001NaturalExplanationProfile>
> = {
  "MEN-001-QL-010": {
    opening:
      "The three boundary lengths are known, so Heron’s formula can find the enclosure’s area without constructing a height.",
  },
  "MEN-001-QL-019": {
    opening:
      "The perpendicular height bisects the base, allowing Pythagoras to be used on either half of the isosceles triangle.",
  },
  "MEN-001-QL-021": {
    opening:
      "The perimeter fixes the scale of the given side ratio, after which Heron’s formula gives the sheet’s area.",
  },
  "MEN-001-QL-022": {
    opening:
      "Add the ratio parts first; the plot’s perimeter then determines the value of one part and hence the largest side.",
  },
  "MEN-001-QL-023": {
    opening:
      "The frame’s perimeter is distributed in the stated ratio, and the smallest ratio share gives the shortest side.",
  },
  "MEN-001-QL-213": {
    opening:
      "The arc occupies the same fraction of the circumference as the stated central angle occupies of a full turn.",
  },
  "MEN-001-QL-214": {
    opening:
      "The stated central angle determines the fraction of the full circumference represented by the arc.",
  },
  "MEN-001-QL-215": {
    opening:
      "The sector’s angle gives its fraction of the full circle, so that fraction is applied to the circle’s area.",
  },
  "MEN-001-QL-216": {
    opening:
      "The sector covers the same fraction of the circular field as its angle covers of 360°.",
  },
  "MEN-001-QL-223": {
    conclusion:
      "After the stated number of complete revolutions, the wheel travels {answer}.",
  },
  "MEN-001-QL-317": {
    opening:
      "One round uses the plot’s perimeter, so the required wire is that boundary length multiplied by the stated number of rounds.",
  },
  "MEN-001-QL-324": {
    opening:
      "Each fencing round uses the whole perimeter, and the combined length for all the stated rounds is charged at the given rate.",
    conclusion:
      "The multiple-round fencing cost is {answer}.",
  },
};

export function getFinalMen001NaturalExplanationProfile(
  questionLanguageId: string,
): Men001NaturalExplanationProfile | undefined {
  const base = getMen001NaturalExplanationProfile(questionLanguageId);
  if (!base) return undefined;
  return {
    ...base,
    ...DYNAMIC_SAFE_OVERRIDES[questionLanguageId],
  };
}
