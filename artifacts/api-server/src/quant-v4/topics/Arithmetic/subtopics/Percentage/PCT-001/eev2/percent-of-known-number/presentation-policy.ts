export const NUMBER_PRESENTATION_VERSION = "1.0.0" as const;

export interface NumberPresentationPolicy {
  locale: "en-IN";
  grouping: "INDIAN";
  maximumFractionDigits: 2;
  trimTrailingZeros: true;
  groupingThreshold: 1000;
}

export const DEFAULT_NUMBER_PRESENTATION_POLICY:
  NumberPresentationPolicy = {
    locale: "en-IN",
    grouping: "INDIAN",
    maximumFractionDigits: 2,
    trimTrailingZeros: true,
    groupingThreshold: 1000,
  };

