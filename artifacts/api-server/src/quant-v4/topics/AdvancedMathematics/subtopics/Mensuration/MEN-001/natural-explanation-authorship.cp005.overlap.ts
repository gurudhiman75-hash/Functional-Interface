import type { Men001NaturalExplanationProfile } from "./natural-explanation-authorship";

const PROFILE: Men001NaturalExplanationProfile = {
  opening:
    "The shared rectangular region belongs to both floor sections, so simply adding the two areas would count that part twice.",
  conclusion:
    "After correcting for the overlap, the composite floor covers {answer}.",
};

export function getMen001Cp005OverlapNaturalExplanationProfile(
  questionLanguageId: string,
): Men001NaturalExplanationProfile | undefined {
  return questionLanguageId === "MEN-001-QL-361" ? PROFILE : undefined;
}

export function getMen001Cp005OverlapNaturalExplanationProfileIds() {
  return ["MEN-001-QL-361"];
}
