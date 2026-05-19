export type RealizationCompactnessProfile =
  | "compact"
  | "balanced"
  | "descriptive";

export type ExamRealizationProfile =
  | "ssc"
  | "railway"
  | "banking"
  | "punjab"
  | "state_psc"
  | "custom";

export type RealizationCadenceProfile =
  | "compact_exam_cadence"
  | "balanced_exam_cadence"
  | "descriptive_cadence";

export interface RealizationProfile {
  examProfile: ExamRealizationProfile;
  compactness: RealizationCompactnessProfile;
  currencyStyle: "symbol" | "rs";
  explanationLabelStyle: "compact" | "standard";
  cadenceProfile: RealizationCadenceProfile;
}

export function resolveRealizationProfile(
  examProfile?: string,
): RealizationProfile {
  const normalized = String(examProfile ?? "custom").toLowerCase();
  if (normalized === "ssc" || normalized === "railway" || normalized === "punjab") {
    return {
      examProfile: normalized,
      compactness: "compact",
      currencyStyle: "symbol",
      explanationLabelStyle: "compact",
      cadenceProfile: "compact_exam_cadence",
    };
  }
  if (normalized === "banking" || normalized === "state_psc") {
    return {
      examProfile: normalized,
      compactness: "balanced",
      currencyStyle: "symbol",
      explanationLabelStyle: "standard",
      cadenceProfile: "balanced_exam_cadence",
    };
  }
  return {
    examProfile: "custom",
    compactness: "compact",
    currencyStyle: "symbol",
    explanationLabelStyle: "compact",
    cadenceProfile: "compact_exam_cadence",
  };
}
